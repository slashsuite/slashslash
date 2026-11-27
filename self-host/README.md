# The Slash products on your own server

One image runs PixelSlash and ToggleSlash together: one container, one volume, two GitHub values.

```sh
docker run -d --name slashslash --restart unless-stopped \
  -p 3000:3000 -p 8080:8080 \
  -e GITHUB_CLIENT_ID=<id> -e GITHUB_CLIENT_SECRET=<secret> \
  -v slashslash-data:/data \
  ghcr.io/slashsuite/slashslash:latest
```

- PixelSlash is on `http://<your server>:3000`, ToggleSlash on `http://<your server>:8080`.
- The GitHub values are a GitHub OAuth app's, for PixelSlash's sign-in. Its callback is
  `http://<your server>:3000/auth/github/callback`.
- The ToggleSlash admin token is made on the first start and kept on the volume. Read it with
  `docker exec slashslash slashslash secret toggleslash-admin-token`. It never goes to the logs.
- `docker exec slashslash slashslash status` shows each service and whether each tool answers.
- `docker exec slashslash slashslash version` prints the image's version.
- `docker exec slashslash slashslash backup` and `slashslash restore <file>` back up and restore the
  volume (see "Backup, restore and rollback").

amd64 only. To build the image yourself instead, see "How it is built" below.

For a guided setup on Proxmox, Docker, Compose, Kubernetes or another platform, follow
[`skills/self-host`](../skills/self-host/SKILL.md): a step-by-step guide any coding agent (or person)
can work through, with the checks that prove each step.

On Kubernetes it is one `helm install` (or one `kubectl apply`): see [`chart/`](chart/README.md).

## On Proxmox, in one line

Run this in the Proxmox host's shell, as root:

```sh
bash -c "$(curl -fsSL https://raw.githubusercontent.com/slashsuite/slashslash/main/self-host/proxmox/install.sh)"
```

It asks for what it needs, makes one unprivileged Debian 13 container with Docker in it (2 cores,
2 GB, an 8 GB root disk, started on boot, tagged `slashslash`), runs the image there with its data
on a mount of its own at `/var/lib/slashslash`, waits until it is healthy and prints both
addresses and the command that reads the ToggleSlash admin token. It refuses a container id that is
taken and touches no other container or VM.

Without a terminal it reads everything from the environment instead:

| Name | Default | What |
| --- | --- | --- |
| `CTID` | the next free id | The new container's id |
| `IP` | `dhcp` | `dhcp`, or an address with its prefix, `192.168.0.40/24` |
| `GATEWAY` | none | Required with a fixed address |
| `BRIDGE` | `vmbr0` | The network bridge |
| `STORAGE` | `local-lvm` | Storage for the root disk (Docker's own files live there) |
| `DATA_STORAGE`, `DATA_GB` | `STORAGE`, `8` | A new data volume, on that storage at that size |
| `DATA_PATH` | unset | A host folder for the data instead, such as a ZFS dataset's mountpoint. It must be empty or already slashslash's, and no other container may mount it. It is given to UID 101654, the image's user as the host sees it |
| `DATA_VOLUME` | unset | A volume `--uninstall` kept, used again under the same `CTID` |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | none, required | PixelSlash's GitHub sign-in. The callback is `http://<address>:3000/auth/github/callback` |
| `VERSION` | `latest` | The image tag to run |
| `CT_HOSTNAME` | `slashslash` | The container's host name |

The GitHub values go into `/etc/slashslash/.env` in the container (mode 0600) over stdin, never on
a command line. `DRY_RUN=1` prints every command that would change something and changes nothing.

The other modes take arguments after the line's `_`:

```sh
url=https://raw.githubusercontent.com/slashsuite/slashslash/main/self-host/proxmox/install.sh
bash -c "$(curl -fsSL $url)" _ --upgrade <CTID> [VERSION]  # pull VERSION (default latest), recreate on the same data
bash -c "$(curl -fsSL $url)" _ --uninstall <CTID>          # remove the container, keep the data
bash -c "$(curl -fsSL $url)" _ --uninstall <CTID> --purge  # remove the container and its data volume
```

An upgrade prints the old and new version and the upgrade backup the new version wrote (see
"Backup, restore and rollback"). Uninstall keeps a data volume by taking it out of the container's
config first and tells you how to use it again. The volume stays filed under that id, so give the
id to no other guest until then. `--purge` deletes it. A host folder (`DATA_PATH`)
is never deleted, even with `--purge`. Upgrade and uninstall act only on a container tagged
`slashslash`.

A root disk on ZFS storage is untested: Docker inside may need `fuse-overlayfs` there. `local-lvm`
works.

## Versions

The image is published at `ghcr.io/slashsuite/slashslash`:

| Tag | What it is |
| --- | --- |
| `latest` | The newest release |
| `0.1.0` (any `X.Y.Z`) | That release. Pin this to choose when you upgrade |
| `edge` | The newest build of main, tested but not released |
| `0.1.0-edge.<sha7>` | One build of main |

Releases up to 0.1.1 were published before the move to slashsuite and stay at
`ghcr.io/madangryscientist/slashslash` (their charts at `oci://ghcr.io/madangryscientist/charts`).

To pin a release, put its tag in place of `latest` in the `docker run` above. An upgrade is
`docker pull` of the new tag, then `docker rm -f slashslash` and the same `docker run`: everything
lives on the volume, and the first start of the new version backs the volume up before either tool
touches it (see "Backup, restore and rollback" below). The version is also on the image as the `org.opencontainers.image.version`
label, next to each tool's commit (`build.slashslash.pixelslash.revision`,
`build.slashslash.toggleslash.revision`).

## Licences

Each part keeps its own licence, and every one is in the image under
`/usr/share/licenses/slashslash`:

- slashslash's own files (the `Dockerfile`, `rootfs/`, the `slashslash` command): MIT.
- PixelSlash and ToggleSlash: Elastic License 2.0 (`pixelslash/`, `toggleslash/`). It allows
  running and sharing the image; it does not allow offering either tool to others as a hosted or
  managed service.
- Caddy: Apache 2.0. s6-overlay: ISC. The .NET runtime: MIT (`dotnet/`).
- Bun: MIT, with JavaScriptCore and WebKit under LGPL 2.1 (`bun/LICENSE.md` says where their source
  is and how to relink).

The names PixelSlash and ToggleSlash are not licensed with the code. An image built from a fork
must not carry them as its name.

## Settings

Everything is the container's environment.

| Name | Default | What it does |
| --- | --- | --- |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | none, required | PixelSlash's GitHub sign-in |
| `PIXELSLASH_ALLOWED_GITHUB_LOGINS` | unset | Comma-separated GitHub logins that may sign in to PixelSlash; unset lets anyone with a GitHub account in |
| `PIXELSLASH_PUBLIC_URL` | unset | The URL people open PixelSlash at. Behind a proxy that ends TLS, set it to the `https://` URL: the GitHub callback and the session cookie's Secure flag follow it |
| `TOGGLESLASH_ADMIN_TOKEN` | generated once | Set it to use your own token instead of the generated one |
| `PIXELSLASH_PORT` | `3000` | The port PixelSlash answers on inside the container |
| `TOGGLESLASH_PORT` | `8080` | The port ToggleSlash answers on inside the container |
| `SLASHSLASH_DOMAIN` | unset | With a domain, `pixelslash.<domain>` and `toggleslash.<domain>` also answer on one port |
| `SLASHSLASH_PORT` | `8000` | That one port, used only with `SLASHSLASH_DOMAIN` |

Any other setting either product reads (see each product's own docs) passes straight through.
Ports 3100 and 8180 are taken inside the container (the tools listen there, behind Caddy), so none
of the three port settings may use them.

Each tool has its own port, or its own host name with a domain, never a path. The host names are
plain HTTP on `SLASHSLASH_PORT`; map it to the host's port 80 (`-p 80:8000`) or put your own proxy
in front. The container cannot bind port 80 itself, since it holds no privilege at all (below).

## Data

Everything lives on the one volume at `/data`:

| Path | What |
| --- | --- |
| `/data/pixelslash` | PixelSlash's database, shots and its own generated secrets |
| `/data/toggleslash/toggleslash.db` | ToggleSlash's SQLite database |
| `/data/secrets` | Secrets for you to read: today `toggleslash-admin-token` (mode 0700) |
| `/data/caddy` | The front door's own state |
| `/data/backups` | Backups: yours (`manual-*`) and the ones taken before an upgrade (`upgrade-*`) |
| `/data/restore-*` | What a restore replaced, in case you want it back |

## Backup, restore and rollback

Both tools change their data when a new version starts (database migrations), and neither can
change it back. A copy of the volume taken while either one is writing can miss data. So use the
image's own commands, which stop both tools while they run (seconds on a small volume, longer on
a large one):

```sh
docker exec slashslash slashslash backup
```

It prints the file it wrote, `/data/backups/manual-<UTC time>-<version>.tgz`, and keeps the last
five. To keep one off the server, copy it out:

```sh
docker cp slashslash:/data/backups/manual-20261115T101500Z-0.1.0.tgz .
```

`slashslash backup <file>` writes to a path of your choosing instead (inside the container, so pick
one on the volume or copy it out). A backup holds `pixelslash/`, `toggleslash/`, `secrets/` and
`caddy/` (PixelSlash's `tmp/` is left out) and the version that made it.

To restore one:

```sh
docker cp manual-20261115T101500Z-0.1.0.tgz slashslash:/data/backups/
docker exec slashslash slashslash restore /data/backups/manual-20261115T101500Z-0.1.0.tgz
```

It checks the whole file first, then stops both tools, moves what is on the volume now into
`/data/restore-<UTC time>/` (the last three are kept), unpacks the backup and starts both tools.
Your other backups stay where they are. A backup made by a newer version than the running image is
refused before anything is touched, naming both versions, because an older tool cannot read data a
newer one has migrated. Restore it with that version or a newer one.

**Upgrades back themselves up.** The volume records the version that last ran on it
(`/data/.slashslash-version`). When a different version starts, it writes
`/data/backups/upgrade-<UTC time>-<old version>.tgz` before either tool starts, and only then lets
them migrate. If that backup fails (a full disk), the container stops instead. The last three
upgrade backups are kept; manual backups never push them out. A volume from before versions were
recorded gets one too, labelled `0.0.0`.

**To roll back an upgrade,** run the previous image again and restore the upgrade backup taken
before the upgrade:

```sh
docker rm -f slashslash
docker run -d --name slashslash ... ghcr.io/slashsuite/slashslash:<previous version>
# 0.1.0 and 0.1.1 are at ghcr.io/madangryscientist/slashslash:<previous version>
docker exec slashslash ls /data/backups
docker exec slashslash slashslash restore /data/backups/upgrade-<UTC time>-<previous version>.tgz
```

Anything written since the upgrade is lost, so take a manual backup first if you may want it. A
restore records the running image's version on the volume, since both tools bring the restored data
up to that version as soon as they start.

## It runs as one user, never root

Every process in the container runs as `app` (UID and GID 1654): the supervisor, both tools and the
front door. Nothing starts as root, nothing changes an owner at start, no file has a setuid bit and
no binary carries a capability, so it runs under `--security-opt no-new-privileges --cap-drop ALL`
and Kubernetes' restricted policy.

A Docker named volume (as above) starts owned by 1654, so it just works. A folder from the host
(`-v /srv/slashslash:/data`) must be writable by UID 1654 first:

```sh
sudo chown -R 1654:1654 /srv/slashslash
```

If it is not, the container stops at once with one line naming the path and the UID. On Kubernetes,
use the Helm chart in [`chart/`](chart/README.md), which sets all of this.

## How it is built

- The two tools are not rebuilt here. Each is its own repo's self-host image, built from the commit
  in `pins/pixelslash.sha` and `pins/toggleslash.sha`. Those pins move only by hand. The PixelSlash
  pin here is separate from the site's `apps/site/pixelslash.sha`, which a bot moves hourly.
- `Dockerfile` copies PixelSlash (`/opt/pixelslash` and Bun) and Caddy onto the ToggleSlash runtime
  image (aspnet 10 on Ubuntu 24.04), adds s6-overlay as the supervisor, and labels the image with
  each pin (`build.slashslash.<product>.revision`) and its version. The licences are in
  `/usr/share/licenses/slashslash` (see Licences above).
- `VERSION` holds the release version. The image says it is that version only when built from a
  release tag; any other build says `<VERSION>-dev`, or `<VERSION>-edge.<sha7>` on main.
- `rootfs/` holds the supervisor's services: `init-data` (makes the folders and the token, every
  start), `pixelslash`, `toggleslash` and `caddy`, each with a logger that puts the service's name
  in front of every line it writes (`[pixelslash] ...`). It also holds the `slashslash` command, the
  health check, which asks both tools through the front door, and `lib/slashslash/backup.sh`, the
  one archive format that `slashslash backup` and `init-data`'s upgrade backup both write.
- When a tool dies hard, its `finish` script kills what is left of that tool's process group, so a
  child it left behind (PixelSlash's workerd and diff worker hold their ports) cannot block the
  restart. The other tool is not touched.

```sh
bun self-host/build.ts            # builds slashslash:dev, and any product image a pin needs
bunx moon run self-host:smoke     # builds and checks it end to end
```

The smoke test runs the image under the restricted limits and checks that both tools answer, that
nothing runs as root, that the token creates a project that survives a restart, that each tool
comes back from `kill -9` without the other noticing, that every log line is labelled and none
holds the token, that nothing is written outside `/run`, `/tmp`, `/home/app` and `/data`, and that
an unwritable `/data` stops the container with its one line, that it turns healthy with a
read-only root filesystem (as the Helm chart runs it), and that the image reports the
version it was built with and holds every licence. It also backs up, wipes and restores the
volume, makes a start on an older recorded version write one upgrade backup and restores it, has a
backup from a newer version refused with nothing touched, and checks that five manual backups are
kept. With `SMOKE_UPGRADE_FROM=<image>` it first runs that image on a fresh volume, makes a
ToggleSlash project and stops it, then starts the image under test on the same volume and checks
that it is healthy, reports its own version, wrote exactly one upgrade backup (none when the two
versions are the same) and kept the project, the token and PixelSlash's secrets. Unset, that stage
is skipped, so a local run needs no network. CI runs the smoke on every change here
(`.github/workflows/self-host.yml`), always with `SMOKE_UPGRADE_FROM` set to the released
`:latest`, and only the image that passed it is pushed to ghcr.

## Move a product to a newer commit

```sh
bun self-host/bump.ts pixelslash          # to PixelSlash main
bun self-host/bump.ts toggleslash <sha>   # to one full 40-character commit
```

It checks that GitHub serves the commit for that product's repo (a commit not on `main` is allowed,
with a warning), writes `pins/<product>.sha` and prints the old and new sha and the compare URL. It
does not commit or push. Open a pull request with the pin change and that output, merge it once
the `smoke` check is green (that run also starts an install on the released image and upgrades it
to the new one), then tag a release (below) when you want it published as `:latest`.

## Releasing

1. Set `VERSION` to the new `X.Y.Z`, set `version` and `appVersion` in `chart/Chart.yaml` to the
   same, run `bun self-host/chart.ts --write` (the rendered manifest names the version), and land
   that on main.
2. Tag that commit `self-host-vX.Y.Z` and push the tag. CI checks the tag matches `VERSION`, builds,
   runs the smoke, pushes `:X.Y.Z` and `:latest`, then pushes the chart to
   `oci://ghcr.io/slashsuite/charts`.

The first push from CI creates each package (the image, the chart) private. Its owner makes it
public once, under the package's settings on github.com (Change visibility); GitHub's API cannot
change it.
