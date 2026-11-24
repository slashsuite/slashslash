# Move a standalone ToggleSlash server onto the slashslash image

This runbook moves a ToggleSlash server that runs on its own in a Proxmox LXC (the toggleslash repo's
`compose.yaml` behind Debian's Caddy, SQLite on a ZFS dataset) into a new LXC that runs the slashslash
image. The new container takes over the old one's network line, address and MAC included, so no
client, tunnel rule or DNS record changes. The old container is stopped, never deleted, so the way
back is to start it again.

Most of the work happens before the freeze, on a new container with a temporary address, and is
rehearsed there with a real copy of the data. The freeze itself is a final backup, a copy and an
address move: about two minutes, five at most.

## The setup this assumes

| | Old container | New container |
| --- | --- | --- |
| Server | the toggleslash repo's compose project at a pinned commit, on `127.0.0.1:8080` | the slashslash image, ToggleSlash on `127.0.0.1:8180` inside it |
| Data | `/var/lib/toggleslash/toggleslash.db` on its own dataset | `/var/lib/slashslash/toggleslash/toggleslash.db` on a new dataset (the image's `/data`) |
| Admin token | `/etc/toggleslash/admin.env`, passed by compose | `/data/secrets/toggleslash-admin-token` on the volume |
| Front door | Debian's Caddy on the CT: a LAN door, a public SDK door and an admin door, each its own port | the same Caddyfile on the CT, its upstream moved to `127.0.0.1:8180` |
| Nightly backup | a systemd timer running `sqlite3 .backup`, keeping 14 | the same timer, pointed at the new path |

Three things about the image decide how this is done:

1. **The image's ToggleSlash must be at least as new as the old server's.** The server migrates its
   database on start and cannot read a schema a newer version wrote. Check this first (step 1).
2. **The client address.** The server locks out a client IP after 30 wrong credentials a minute, so
   it must see the real caller. The image's own Caddy trusts no proxy in front of it, so behind
   another Caddy every caller would share one address, and one bad key would lock out every app. So
   the new container runs the image with host networking and its Caddy proxies straight to
   ToggleSlash on `127.0.0.1:8180`, which ToggleSlash already trusts. Two consequences:
   - The image's own Caddy now listens on the container's address too (`:8080` reaches ToggleSlash
     past the door rules, `:3000` is PixelSlash). A firewall in the container drops both from
     anything but loopback (step 4).
   - This uses a port the image keeps internal, so **never run `install.sh --upgrade` on this
     container**: it recreates the container with published ports, and the doors then answer 502.
     Upgrade by hand (see Afterwards).
3. **PixelSlash comes with it.** The image runs both products. PixelSlash idles with placeholder
   GitHub values; nothing uses it here.

## The values and helpers

Every command on the Proxmox host reads these. Put them in a file next to the backups (never in a
repo), mode 0600, and source it in every shell you use there:

```sh
OLD_CTID=      # the old container
OLD_REF=       # the toggleslash commit the old server runs (/opt/toggleslash/current)
OLD_DB=/var/lib/toggleslash/toggleslash.db
OLD_SERVICE=toggleslash-server-1
NEW_CTID=      # a free id
NEW_HOSTNAME=toggleslash-image
DATASET=       # a new ZFS dataset for the image's /data, such as tank/slashslash-flags
VERSION=       # the image release to run (see step 1)
BRIDGE=vmbr0
BACKUP_DIR=    # a folder on the host, mode 0700, for the backups and the token
ADDR=          # the old container's address, for the checks
SDK_HOST= ADMIN_HOST= DASHBOARD_URL=  # the public SDK hostname, the admin hostname, the dashboard
DOOR_CHECK=    # the old setup's door check script (check.sh lan|public|admin <url>), on the checking machine

# The old server's database, backed up while it runs (SQLite's online backup, consistent while the
# server writes), as the server's UID so no root-owned -wal file is left behind. Stops on a bad copy.
backup_old() { # the file name to write in BACKUP_DIR
  pct exec $OLD_CTID -- sh -ec "install -d -m 0700 -o 1654 -g 1654 /var/tmp/migrate
    setpriv --reuid=1654 --regid=1654 --clear-groups sqlite3 $OLD_DB '.backup /var/tmp/migrate/$1'
    [ \"\$(setpriv --reuid=1654 --regid=1654 --clear-groups sqlite3 -readonly /var/tmp/migrate/$1 'PRAGMA integrity_check;')\" = ok ]" || return 1
  pct pull $OLD_CTID /var/tmp/migrate/$1 "$BACKUP_DIR/$1" || return 1
  pct exec $OLD_CTID -- rm -rf /var/tmp/migrate
  chmod 0600 "$BACKUP_DIR/$1"
  (cd "$BACKUP_DIR" && sha256sum "$1" | tee -a SHA256SUMS)
}

# A database and the token into the stopped new container. Checks the copy before removing anything.
copy_in() { # a database file in BACKUP_DIR
  data="$(zfs get -H -o value mountpoint "$DATASET")" || return 1
  (cd "$BACKUP_DIR" && grep " $1\$" SHA256SUMS | tail -n 1 | sha256sum -c -) || return 1
  [ "$(pct status $NEW_CTID)" = "status: stopped" ] || { echo "$NEW_CTID is running"; return 1; }
  rm -f "$data/toggleslash/toggleslash.db" "$data/toggleslash/toggleslash.db-wal" "$data/toggleslash/toggleslash.db-shm"
  install -o 101654 -g 101654 -m 0644 "$BACKUP_DIR/$1" "$data/toggleslash/toggleslash.db" || return 1
  sed -n 's/^TOGGLESLASH_ADMIN_TOKEN=//p' "$BACKUP_DIR/admin.env" > "$data/secrets/toggleslash-admin-token"
  chown 101654:101654 "$data/secrets/toggleslash-admin-token"
  chmod 0600 "$data/secrets/toggleslash-admin-token"
}

wait_healthy() {
  for i in $(seq 60); do
    [ "$(pct exec $NEW_CTID -- docker inspect -f '{{.State.Health.Status}}' slashslash 2>/dev/null)" = healthy ] && { echo healthy; return 0; }
    sleep 3
  done
  echo "not healthy after 3 minutes"; return 1
}
```

On the checking machine (a LAN machine with `curl` and `jq`) you need `ADDR`, `SDK_HOST`,
`ADMIN_HOST` and `DOOR_CHECK`, a server SDK key for one project in `SDK_KEY`, and the admin token.
Read the key and the token when needed; never store them in the values file.

## Before the freeze

Nothing here touches the old container except reading it.

### 1. Check the image carries the old server's ToggleSlash

```sh
docker pull -q ghcr.io/slashsuite/slashslash:$VERSION
rev="$(docker inspect -f '{{index .Config.Labels "build.slashslash.toggleslash.revision"}}' ghcr.io/slashsuite/slashslash:$VERSION)"
git -C ~/dev/toggleslash fetch -q && git -C ~/dev/toggleslash merge-base --is-ancestor "$OLD_REF" "$rev" && echo ok
```

If this does not print `ok`, stop: the image is older than the old server. Move the pin
(`bun self-host/bump.ts toggleslash <sha>`, see the README), release, and come back with that
version.

### 2. A backup now

On the Proxmox host:

```sh
install -d -m 0700 "$BACKUP_DIR"
backup_old toggleslash.db
for f in /etc/toggleslash/admin.env /etc/caddy/Caddyfile /usr/local/sbin/toggleslash-backup \
         /etc/systemd/system/toggleslash-backup.service /etc/systemd/system/toggleslash-backup.timer; do
  pct pull $OLD_CTID "$f" "$BACKUP_DIR/${f##*/}"
done
chmod 0600 "$BACKUP_DIR"/*
(cd "$BACKUP_DIR" && sha256sum admin.env Caddyfile toggleslash-backup* >> SHA256SUMS && cat SHA256SUMS)
```

Keep the checksums.

### 3. The new container, on a temporary address

```sh
zfs create -o quota=8G "$DATASET"
curl -fsSL https://raw.githubusercontent.com/slashsuite/slashslash/main/self-host/proxmox/install.sh \
  -o "$BACKUP_DIR/install.sh"
CTID=$NEW_CTID IP=dhcp BRIDGE=$BRIDGE DATA_PATH="$(zfs get -H -o value mountpoint "$DATASET")" \
  VERSION=$VERSION CT_HOSTNAME=$NEW_HOSTNAME GITHUB_CLIENT_ID=unused GITHUB_CLIENT_SECRET=unused \
  bash "$BACKUP_DIR/install.sh" </dev/null
```

It ends healthy and prints the temporary address. Call it `STAGE`.

### 4. Host networking, the firewall, the doors and the nightly backup

```sh
pct exec $NEW_CTID -- sh -ec "docker rm -f slashslash >/dev/null
  docker run -d --name slashslash --restart unless-stopped --network host \
    --env-file /etc/slashslash/.env -v /var/lib/slashslash:/data ghcr.io/slashsuite/slashslash:$VERSION >/dev/null
  DEBIAN_FRONTEND=noninteractive apt-get install -y -qq caddy sqlite3 nftables >/dev/null"

# Only loopback reaches the image's own Caddy. Its own table, so Docker's rules never touch it.
cat > "$BACKUP_DIR/nftables.conf" <<'EOF'
#!/usr/sbin/nft -f
table inet image_guard
delete table inet image_guard
table inet image_guard {
  chain input {
    type filter hook input priority 0; policy accept;
    iif != "lo" tcp dport { 3000, 8080 } drop
  }
}
EOF
pct push $NEW_CTID "$BACKUP_DIR/nftables.conf" /etc/nftables.conf --perms 0755
pct exec $NEW_CTID -- systemctl enable nftables
pct exec $NEW_CTID -- systemctl restart nftables

# The old Caddyfile, upstream moved to the image's ToggleSlash. Nothing else changes.
sed 's/127\.0\.0\.1:8080/127.0.0.1:8180/g' "$BACKUP_DIR/Caddyfile" > "$BACKUP_DIR/Caddyfile.new"
pct push $NEW_CTID "$BACKUP_DIR/Caddyfile.new" /etc/caddy/Caddyfile --perms 0644
# The Caddyfile turns Caddy's admin endpoint off, so `systemctl reload caddy` cannot work: restart it.
pct exec $NEW_CTID -- systemctl restart caddy

# The old nightly backup, pointed at the new path. Its backups stay on the dataset, next to the image's own.
sed -e 's#/var/lib/toggleslash/toggleslash.db#/var/lib/slashslash/toggleslash/toggleslash.db#' \
    -e 's#/var/lib/toggleslash/backups#/var/lib/slashslash/nightly#' \
    "$BACKUP_DIR/toggleslash-backup" > "$BACKUP_DIR/toggleslash-backup.new"
pct push $NEW_CTID "$BACKUP_DIR/toggleslash-backup.new" /usr/local/sbin/toggleslash-backup --perms 0755
pct push $NEW_CTID "$BACKUP_DIR/toggleslash-backup.service" /etc/systemd/system/toggleslash-backup.service
pct push $NEW_CTID "$BACKUP_DIR/toggleslash-backup.timer" /etc/systemd/system/toggleslash-backup.timer
pct exec $NEW_CTID -- systemctl daemon-reload
pct exec $NEW_CTID -- systemctl enable --now toggleslash-backup.timer
```

Enrol the new container in whatever keeps your containers' packages updated, as the old one is.

### 5. Rehearse with the real data

The same copy the freeze does, from step 2's backup. `pct shutdown` stops Docker cleanly, and Docker
restarts the image at the next boot: a container stopped by its daemon shutting down is not
"manually stopped".

```sh
pct shutdown $NEW_CTID && copy_in toggleslash.db && pct start $NEW_CTID && wait_healthy
pct exec $NEW_CTID -- systemctl start toggleslash-backup.service   # prints "backed up to ..."
```

From the checking machine:

```sh
TOGGLESLASH_ADMIN_TOKEN=<the admin token> $DOOR_CHECK lan http://$STAGE:8090
TOGGLESLASH_ADMIN_TOKEN=<the admin token> $DOOR_CHECK public http://$STAGE:8091
curl -fsS -H "Authorization: Bearer $SDK_KEY" http://$STAGE:8090/sdk/v1/ruleset > stage.json
curl -fsS -H "Authorization: Bearer $SDK_KEY" http://$ADDR:8090/sdk/v1/ruleset > old.json
diff <(jq -S . old.json) <(jq -S . stage.json)
curl -sS -m 3 -o /dev/null http://$STAGE:8080/health && echo "8080 is open: fix the firewall"
```

Every door row matches. The two rulesets hold the same flags (a flag changed since step 2 shows up
here and is fine). A request to `:8092` without a `Cf-Access-Jwt-Assertion` header answers 403. The
last line prints nothing.

If anything fails here, fix it here: the old server is still serving.

## The freeze

Announce it. First, on the checking machine, capture what clients read now:

```sh
curl -fsS -H "Authorization: Bearer $SDK_KEY" https://$SDK_HOST/sdk/v1/ruleset > before.json
```

Then on the Proxmox host, in one shell with the values and helpers sourced. The subshell stops at the
first failure; if it stops, read the error and roll back (below) or fix it and run the rest by hand.

```sh
(
  set -e
  # The freeze starts: stop the old server, then take the final backup. Nothing writes after it.
  pct exec $OLD_CTID -- docker stop $OLD_SERVICE
  backup_old final.db
  # Stop the old container, and keep it from starting at the next host boot (two containers with
  # one address and one MAC would fight).
  pct shutdown $OLD_CTID
  pct set $OLD_CTID --onboot 0
  # The data in, then the old network line, address and MAC as they are, so no ARP cache on the
  # LAN holds a stale entry for the address.
  pct shutdown $NEW_CTID
  copy_in final.db
  pct set $NEW_CTID --net0 "$(pct config $OLD_CTID | sed -n 's/^net0: //p')"
  pct start $NEW_CTID
  wait_healthy
)
# The freeze ends here.
pct exec $NEW_CTID -- docker exec slashslash slashslash status
```

## The checks after

From the checking machine. All must pass; if one does not, roll back.

```sh
curl -fsS http://$ADDR:8090/health && curl -fsS https://$SDK_HOST/health
TOGGLESLASH_ADMIN_TOKEN=<the admin token> $DOOR_CHECK lan http://$ADDR:8090
TOGGLESLASH_ADMIN_TOKEN=<the admin token> $DOOR_CHECK public http://$ADDR:8091
TOGGLESLASH_ADMIN_TOKEN=<the admin token> $DOOR_CHECK public https://$SDK_HOST
TOGGLESLASH_ACCESS_CLIENT_ID=<id> TOGGLESLASH_ACCESS_CLIENT_SECRET=<secret> \
TOGGLESLASH_ADMIN_TOKEN=<the admin token> $DOOR_CHECK admin https://$ADMIN_HOST
curl -fsS -H "Authorization: Bearer $SDK_KEY" https://$SDK_HOST/sdk/v1/ruleset > after.json
diff <(jq -S . before.json) <(jq -S . after.json) && echo "same flags"
```

The admin mode is the `/health` check on the admin door too: it passes `/health` only with the Access
service token. Then open `$DASHBOARD_URL` and see the projects and flags as before.

## Rollback

The old container is untouched apart from its `onboot` flag and its stopped server, and its data is
as it was at the freeze. Its compose service restarts `unless-stopped` and was stopped by hand, so
start it by hand.

```sh
pct shutdown $NEW_CTID
pct set $NEW_CTID --onboot 0
pct set $OLD_CTID --onboot 1
pct start $OLD_CTID
pct exec $OLD_CTID -- docker start $OLD_SERVICE
```

Then run the checks above against it. Anything written to the new server after the freeze is lost.
To keep it, take it with `sqlite3 .backup` (as `backup_old` does) inside the new container before
shutting it down, and put that over `$OLD_DB` with the old server stopped (remove its `-wal` and
`-shm`, owner 1654 inside the container), but only when step 1 found the image's ToggleSlash at
exactly `OLD_REF`: a newer server may have migrated the file past what the old one reads.

## Afterwards

- The old container stays stopped. Do not delete it or its dataset; the backups in `BACKUP_DIR` stay
  on the host.
- **Upgrade by hand, never with `install.sh --upgrade`:**

  ```sh
  pct exec $NEW_CTID -- sh -ec "docker pull -q ghcr.io/slashsuite/slashslash:<new version>
    docker rm -f slashslash >/dev/null
    docker run -d --name slashslash --restart unless-stopped --network host \
      --env-file /etc/slashslash/.env -v /var/lib/slashslash:/data ghcr.io/slashsuite/slashslash:<new version> >/dev/null"
  ```

  The first start of the new version writes its upgrade backup, as the README says.
