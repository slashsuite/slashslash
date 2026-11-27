/**
 * The self-host image's smoke test (`bunx moon run self-host:smoke`): builds the image, then runs it
 * the way a person would, under the limits of Kubernetes' restricted policy (no new privileges, no
 * capabilities), and checks what README.md promises:
 *
 * - both products answer through Caddy and Docker reports the container healthy;
 * - nothing runs as root, and the image's user is `app`;
 * - the generated ToggleSlash admin token creates a project, and the project survives a restart;
 * - each product comes back after `kill -9` with no ERR_ADDRESS_IN_USE, and the other product keeps
 *   its pid;
 * - every log line carries its service's name and none carries the token;
 * - the container writes nowhere outside /run, /tmp, /home/app and /data;
 * - a /data that UID 1654 cannot write stops the container with one line naming the path and UID;
 * - it starts and turns healthy on a fresh volume with a read-only root filesystem and empty
 *   writable folders at /run, /tmp and /home/app, as the Helm chart (chart/) runs it;
 * - `slashslash version` and the version label are the version it was built with, and every
 *   licence the image owes is under /usr/share/licenses/slashslash;
 * - `slashslash backup` and `restore` bring back a wiped volume (the ToggleSlash project and token,
 *   PixelSlash and its generated secrets byte for byte), a changed version on the volume makes the
 *   next start write exactly one upgrade backup that restores, a backup from a newer version is
 *   refused with nothing touched, and only the last five manual backups are kept.
 *
 * With SMOKE_UPGRADE_FROM set to a released image (CI sets the `:latest` one), it first checks
 * that the image under test upgrades an install that image made: see upgradeFrom.
 *
 * The GitHub values are dummies, as PixelSlash's own e2e build uses: never a real secret. It also
 * prints the container's memory. Set SMOKE_IMAGE to test an image that is
 * already built instead of building one, and SMOKE_VERSION to the version it was built with (default
 * self-host/VERSION plus `-dev`, which is also what it builds).
 */
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build, readVersion } from "./build.ts";

const IMAGE = process.env["SMOKE_IMAGE"] || "slashslash:smoke";
const VERSION = process.env["SMOKE_VERSION"] || `${readVersion()}-dev`;
const LICENCES = ["pixelslash", "toggleslash", "caddy", "s6-overlay", "dotnet", "bun"];
const NAME = `slashslash-smoke-${process.pid}`;
const VOLUME = `${NAME}-data`;
const DUMMY_GITHUB = ["-e", "GITHUB_CLIENT_ID=smoke-not-real", "-e", "GITHUB_CLIENT_SECRET=smoke-not-real"];
const LIMITS = ["--security-opt", "no-new-privileges", "--cap-drop", "ALL"];

function docker(args: string[], allowFailure = false): string {
  const result = Bun.spawnSync(["docker", ...args], { stdout: "pipe", stderr: "pipe" });
  const out = result.stdout.toString() + result.stderr.toString();
  if (result.exitCode !== 0 && !allowFailure)
    throw new Error(`docker ${args.join(" ")} exited ${result.exitCode}:\n${out}`);
  return out.trim();
}

function check(ok: boolean, what: string, detail = ""): void {
  if (!ok) throw new Error(`FAILED: ${what}${detail ? `\n${detail}` : ""}`);
  console.log(`ok: ${what}`);
}

async function waitFor(what: string, test: () => boolean | Promise<boolean>, seconds: number, name = NAME): Promise<void> {
  const until = Date.now() + seconds * 1000;
  while (Date.now() < until) {
    if (await test()) return;
    await Bun.sleep(1000);
  }
  throw new Error(`FAILED: ${what} within ${seconds} s\n${docker(["logs", "--tail", "40", name], true)}`);
}

const health = (name = NAME) => docker(["inspect", "-f", "{{.State.Health.Status}}", name], true);
const hostPort = (port: number, name = NAME) => docker(["port", name, `${port}/tcp`]).split("\n")[0]?.replace("0.0.0.0", "127.0.0.1") ?? "";

/** The pid of the first process whose command line contains `needle`. */
function pidOf(needle: string): number | null {
  const line = docker(["exec", NAME, "ps", "-eo", "pid=,args="])
    .split("\n")
    .find((l) => l.includes(needle) && !l.includes("ps -eo"));
  return line ? Number(line.trim().split(/\s+/)[0]) : null;
}

async function healthyOnFrontDoor(name = NAME): Promise<boolean> {
  try {
    const ps = await fetch(`http://${hostPort(3000, name)}/`, { signal: AbortSignal.timeout(3000) });
    const ts = await fetch(`http://${hostPort(8080, name)}/health`, { signal: AbortSignal.timeout(3000) });
    return ps.status < 500 && ts.status === 200;
  } catch {
    return false;
  }
}

/** `kill -9` one product's main process, then see it come back with a new pid and the other untouched. */
async function killAndRecover(victim: { name: string; needle: string }, other: { name: string; needle: string }) {
  const before = pidOf(victim.needle);
  const otherBefore = pidOf(other.needle);
  check(before !== null && otherBefore !== null, `${victim.name} and ${other.name} are running`);
  docker(["exec", NAME, "kill", "-9", String(before)]);
  await waitFor(
    `${victim.name} back after kill -9`,
    async () => {
      const now = pidOf(victim.needle);
      return now !== null && now !== before && (await healthyOnFrontDoor());
    },
    120,
  );
  // A crash loop shows within seconds; give it the time to show.
  await Bun.sleep(8000);
  const after = pidOf(victim.needle);
  check(after !== null && after !== before, `${victim.name} came back after kill -9 (pid ${before} to ${after})`);
  check(await healthyOnFrontDoor(), `${victim.name} still answers 8 s later`);
  check(pidOf(other.needle) === otherBefore, `${other.name} kept its pid (${otherBefore})`);
  // The orphan is gone, not just joined by a new one: one workerd, no more.
  const args = docker(["exec", NAME, "ps", "-eo", "args="]).split("\n");
  const count = (needle: string) => args.filter((a) => a.includes(needle)).length;
  check(count("bin/workerd") === 1, "one workerd left");
  check(!docker(["logs", NAME]).includes("ERR_ADDRESS_IN_USE"), `no ERR_ADDRESS_IN_USE in the logs`);
}

/** `docker exec` that keeps the exit code, for a command that is meant to fail. */
function exec(command: string): { code: number; out: string } {
  const result = Bun.spawnSync(["docker", "exec", NAME, "sh", "-c", command], { stdout: "pipe", stderr: "pipe" });
  return { code: result.exitCode ?? 1, out: (result.stdout.toString() + result.stderr.toString()).trim() };
}

const sh = (command: string, name = NAME) => docker(["exec", name, "sh", "-c", command]);
const secretHashes = (name = NAME) => sh("cd /data/pixelslash/secrets && sha256sum * | sort", name);
const backups = (prefix: string, name = NAME) =>
  sh(`ls /data/backups | grep '^${prefix}-' || true`, name).split("\n").filter(Boolean);

async function projectAndTokenAreThere(token: string, what: string): Promise<void> {
  await waitFor(`healthy after ${what}`, async () => health() === "healthy" && (await healthyOnFrontDoor()), 180);
  const project = await fetch(`http://${hostPort(8080)}/api/v1/projects/smoke`, { headers: { authorization: `Bearer ${token}` } });
  check(project.status === 200, `the ToggleSlash project is there after ${what} (${project.status})`);
  check(docker(["exec", NAME, "slashslash", "secret", "toggleslash-admin-token"]) === token, `the token is the same after ${what}`);
}

async function backupAndRestore(token: string): Promise<void> {
  // A manual backup, then the volume's state wiped with both products stopped, then a restore.
  const hashes = secretHashes();
  check(hashes.split("\n").length >= 2, "PixelSlash generated its secret files", hashes);
  const file = docker(["exec", NAME, "slashslash", "backup"]).split("\n").at(-1) ?? "";
  check(/^\/data\/backups\/manual-\d{8}T\d{6}Z-.+\.tgz$/.test(file), `slashslash backup wrote ${file}`);
  await projectAndTokenAreThere(token, "a backup");
  sh("for s in pixelslash toggleslash; do /command/s6-svc -wD -T 60000 -d /run/service/$s; done; rm -rf /data/pixelslash /data/toggleslash /data/secrets");
  console.log(`  | ${docker(["exec", NAME, "slashslash", "restore", file])}`);
  await projectAndTokenAreThere(token, "wiping the volume and restoring");
  check(secretHashes() === hashes, "PixelSlash's secret files hash the same as before the wipe");

  // An older version on the volume: the next start writes one upgrade backup, which restores.
  check(backups("upgrade").length === 0, "no upgrade backup before the version changes");
  sh("echo 0.0.1 > /data/.slashslash-version");
  docker(["restart", NAME]);
  await projectAndTokenAreThere(token, "a restart on a volume last run by 0.0.1");
  const upgrades = backups("upgrade");
  check(upgrades.length === 1 && upgrades[0]?.endsWith("-0.0.1.tgz") === true, `the start wrote exactly one upgrade backup (${upgrades.join(" ")})`);
  check(sh("cat /data/.slashslash-version") === VERSION, `the volume now records ${VERSION}`);
  console.log(`  | ${docker(["exec", NAME, "slashslash", "restore", `/data/backups/${upgrades[0]}`])}`);
  await projectAndTokenAreThere(token, "restoring the upgrade backup");
  check(sh("cat /data/.slashslash-version") === VERSION, `a restore records the running version, ${VERSION}`);

  // A backup from a newer version, made by repacking a real one: refused, and nothing stops.
  const pids = [pidOf(PIXELSLASH.needle), pidOf(TOGGLESLASH.needle)];
  const asideBefore = sh("ls -d /data/restore-* | wc -l");
  sh(`rm -rf /tmp/newer && mkdir /tmp/newer && tar -xzf ${file} -C /tmp/newer && echo 9.9.9 > /tmp/newer/version \
    && tar -czf /tmp/newer.tgz -C /tmp/newer version .slashslash-version pixelslash toggleslash secrets caddy && rm -rf /tmp/newer`);
  const refused = exec("slashslash restore /tmp/newer.tgz");
  console.log(`  | ${refused.out}`);
  check(refused.code !== 0 && refused.out.includes("9.9.9") && refused.out.includes(VERSION),
    `a backup from 9.9.9 is refused, naming 9.9.9 and ${VERSION}`);
  sh("rm -f /tmp/newer.tgz");
  check(pidOf(PIXELSLASH.needle) === pids[0] && pidOf(TOGGLESLASH.needle) === pids[1], "both products kept running through the refusal");
  check(sh("ls -d /data/restore-* | wc -l") === asideBefore && secretHashes() === hashes, "the refusal moved nothing on the volume");
  await projectAndTokenAreThere(token, "the refused restore");

  // Six more manual backups: the last five are kept, and the upgrade backup is not pruned.
  for (let i = 0; i < 6; i++) docker(["exec", NAME, "slashslash", "backup"]);
  const manual = backups("manual");
  check(manual.length === 5, `five manual backups are kept after six more (${manual.length})`);
  check(backups("upgrade").length === 1, "the upgrade backup is still there");
  await projectAndTokenAreThere(token, "six backups in a row");
}

const PIXELSLASH = { name: "pixelslash", needle: "deploy/docker/start.ts" };
const TOGGLESLASH = { name: "toggleslash", needle: "ToggleSlash.Server.dll" };

/** Docker's own diff, with what the container may write and the folders above it taken out. */
function writesOutsideAllowed(): string[] {
  const allowed = /^\/(run|tmp|home\/app|data)(\/|$)/;
  const parents = new Set(["/home"]);
  return docker(["diff", NAME])
    .split("\n")
    .filter(Boolean)
    .map((line) => line.slice(2))
    .filter((path) => !allowed.test(path) && !parents.has(path));
}

async function readOnlyDataStops(): Promise<void> {
  // Owned by whoever runs the test and mode 0555: not writable by UID 1654 inside the container.
  const dir = mkdtempSync(join(process.env["TMPDIR"] || tmpdir(), "slashslash-smoke-ro-"));
  Bun.spawnSync(["chmod", "0555", dir]);
  const name = `${NAME}-ro`;
  try {
    docker(["run", "-d", "--name", name, ...LIMITS, ...DUMMY_GITHUB, "-v", `${dir}:/data`, IMAGE]);
    const until = Date.now() + 60_000;
    while (docker(["inspect", "-f", "{{.State.Running}}", name]) === "true" && Date.now() < until) await Bun.sleep(500);
    const state = docker(["inspect", "-f", "{{.State.Running}} {{.State.ExitCode}}", name]);
    const logs = docker(["logs", name]);
    console.log(`  the container said:\n${logs.replace(/^/gm, "  | ")}`);
    check(state.startsWith("false") && !state.endsWith(" 0"), `an unwritable /data stops the container (${state})`);
    check(
      /\/data is not writable by UID 1654/.test(logs),
      "the stop names the path and the UID",
    );
  } finally {
    docker(["rm", "-f", name], true);
    Bun.spawnSync(["chmod", "0755", dir]);
    rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * The way the Helm chart runs it: read-only root, and at each other writable path an empty folder
 * as a kubelet makes an emptyDir under fsGroup 1654 (owner root, group 1654, mode 2777), with the
 * chart's S6_YES_I_WANT_A_WORLD_WRITABLE_RUN_BECAUSE_KUBERNETES.
 */
async function readOnlyRootRuns(): Promise<void> {
  const name = `${NAME}-rootro`;
  const empty = ["/run", "/tmp", "/home/app"].flatMap((path) => ["--tmpfs", `${path}:exec,mode=2777,uid=0,gid=1654`]);
  const kubernetes = ["-e", "S6_YES_I_WANT_A_WORLD_WRITABLE_RUN_BECAUSE_KUBERNETES=1"];
  try {
    docker(["run", "-d", "--name", name, ...LIMITS, "--read-only", ...empty, ...kubernetes, ...DUMMY_GITHUB, "-v", `${name}:/data`, IMAGE]);
    const status = () => docker(["inspect", "-f", "{{.State.Health.Status}}", name], true);
    const until = Date.now() + 180_000;
    while (status() !== "healthy" && docker(["inspect", "-f", "{{.State.Running}}", name]) === "true" && Date.now() < until)
      await Bun.sleep(1000);
    check(status() === "healthy", "healthy on a fresh volume with a read-only root filesystem", docker(["logs", "--tail", "40", name], true));
  } finally {
    docker(["rm", "-f", name], true);
    docker(["volume", "rm", name], true);
  }
}

/**
 * An install the released image made, started again on the image under test: the released image
 * runs on a fresh volume, makes a ToggleSlash project, and is stopped; the new image then starts on
 * that volume and must keep the project, the token and PixelSlash's secrets, and write exactly one
 * upgrade backup (none when the two versions are the same, as on a re-run of a release tag).
 */
async function upgradeFrom(released: string): Promise<void> {
  const name = `${NAME}-upgrade`;
  const volume = `${name}-data`;
  const start = (image: string) =>
    docker(["run", "-d", "--name", name, ...LIMITS, ...DUMMY_GITHUB, "-p", "127.0.0.1::3000", "-p", "127.0.0.1::8080",
      "-v", `${volume}:/data`, image]);
  const healthy = (what: string) =>
    waitFor(what, async () => health(name) === "healthy" && (await healthyOnFrontDoor(name)), 180, name);
  const project = async (token: string) =>
    (await fetch(`http://${hostPort(8080, name)}/api/v1/projects/upgrade`, { headers: { authorization: `Bearer ${token}` } })).status;
  try {
    docker(["pull", released]);
    start(released);
    await healthy(`${released} healthy on a fresh volume`);
    const from = docker(["exec", name, "slashslash", "version"]);
    const token = docker(["exec", name, "slashslash", "secret", "toggleslash-admin-token"]);
    const created = await fetch(`http://${hostPort(8080, name)}/api/v1/projects`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ key: "upgrade", name: "Upgrade" }),
    });
    check(created.status === 201, `${released} (${from}) makes a ToggleSlash project (${created.status})`);
    const hashes = secretHashes(name);
    check(hashes.split("\n").length >= 2, `${released} generated PixelSlash's secret files`, hashes);
    docker(["stop", "--time", "60", name]);
    docker(["rm", name]);

    start(IMAGE);
    await healthy(`the image under test healthy on the volume ${from} wrote`);
    console.log(`ok: upgrade from ${from}: healthy on the old volume`);
    const reported = docker(["exec", name, "slashslash", "version"]);
    check(reported === VERSION, `upgrade from ${from}: slashslash version is ${VERSION} (${reported})`);
    const upgrades = backups("upgrade", name);
    if (from === VERSION)
      check(upgrades.length === 0, `upgrade from ${from}: the same version, so no upgrade backup (${upgrades.join(" ")})`);
    else
      check(upgrades.length === 1 && upgrades[0]?.endsWith(`-${from}.tgz`) === true,
        `upgrade from ${from}: exactly one upgrade backup (${upgrades.join(" ")})`);
    const status = await project(token);
    check(status === 200, `upgrade from ${from}: the ToggleSlash project is there (${status})`);
    check(docker(["exec", name, "slashslash", "secret", "toggleslash-admin-token"]) === token, `upgrade from ${from}: the token is the same`);
    check(secretHashes(name) === hashes, `upgrade from ${from}: PixelSlash's secret files hash the same`);
  } finally {
    docker(["rm", "-f", name], true);
    docker(["volume", "rm", volume], true);
  }
}

async function main(): Promise<void> {
  if (!process.env["SMOKE_IMAGE"]) build(IMAGE, VERSION);
  const released = process.env["SMOKE_UPGRADE_FROM"];
  if (released) await upgradeFrom(released);

  docker(["run", "-d", "--name", NAME, ...LIMITS, ...DUMMY_GITHUB, "-p", "127.0.0.1::3000", "-p", "127.0.0.1::8080",
    "-v", `${VOLUME}:/data`, IMAGE]);
  await waitFor("the container reports healthy", () => health() === "healthy", 180);
  check(await healthyOnFrontDoor(), "PixelSlash / and ToggleSlash /health answer through Caddy");
  // The Helm chart's startup probe is an HTTP GET of PixelSlash's /, which passes only on 200 to 399.
  const front = await fetch(`http://${hostPort(3000)}/`, { redirect: "manual", signal: AbortSignal.timeout(3000) });
  check(front.status >= 200 && front.status < 400, `PixelSlash / answers ${front.status}, which the chart's startup probe accepts`);

  check(docker(["inspect", "-f", "{{.Config.User}}", IMAGE]) === "app", "the image's user is app");
  const users = docker(["exec", NAME, "ps", "-eo", "user="]).split("\n").map((u) => u.trim());
  check(users.length > 0 && users.every((u) => u === "app"), "no process runs as root", users.join(" "));
  check(docker(["exec", NAME, "sh", "-c", "find / -xdev -type f -perm /6000 2>/dev/null; true"]) === "", "no setuid or setgid file in the image");

  const reported = docker(["exec", NAME, "slashslash", "version"]);
  check(reported === VERSION, `slashslash version is ${VERSION} (${reported})`);
  const label = docker(["inspect", "-f", '{{index .Config.Labels "org.opencontainers.image.version"}}', IMAGE]);
  check(label === VERSION, `the version label is ${VERSION} (${label})`);
  // Every non-empty file under the folder, as `bun/LICENSE.md`; each product needs at least one.
  const licences = docker(["exec", NAME, "find", "/usr/share/licenses/slashslash", "-type", "f", "-size", "+0c"])
    .split("\n")
    .map((f) => f.replace("/usr/share/licenses/slashslash/", ""));
  const missing = ["LICENSE", "NOTICE", ...LICENCES.map((d) => `${d}/`)].filter(
    (want) => !licences.some((f) => (want.endsWith("/") ? f.startsWith(want) : f === want)),
  );
  check(missing.length === 0, `the licences are there: slashslash, ${LICENCES.join(", ")}`, `missing: ${missing.join(" ")}`);

  const token = docker(["exec", NAME, "slashslash", "secret", "toggleslash-admin-token"]);
  check(/^[0-9a-f]{64}$/.test(token), "the generated admin token is 32 random bytes in hex");
  const created = await fetch(`http://${hostPort(8080)}/api/v1/projects`, {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ key: "smoke", name: "Smoke" }),
  });
  check(created.status === 201, `the token creates a ToggleSlash project (${created.status})`);

  docker(["restart", NAME]);
  await waitFor("healthy again after docker restart", async () => health() === "healthy" && (await healthyOnFrontDoor()), 180);
  const listed = await fetch(`http://${hostPort(8080)}/api/v1/projects/smoke`, {
    headers: { authorization: `Bearer ${token}` },
  });
  check(listed.status === 200, `the project survived docker restart (${listed.status})`);
  check(docker(["exec", NAME, "slashslash", "secret", "toggleslash-admin-token"]) === token, "the token survived too");

  await killAndRecover(PIXELSLASH, TOGGLESLASH);
  await killAndRecover(TOGGLESLASH, PIXELSLASH);
  await backupAndRestore(token);

  const status = docker(["exec", NAME, "slashslash", "status"]);
  console.log(status.replace(/^/gm, "  | "));
  const statusOk =
    ["pixelslash", "toggleslash", "caddy"].every((s) => new RegExp(`^${s} +up \\(pid \\d+`, "m").test(status)) &&
    ["pixelslash", "toggleslash"].every((s) => new RegExp(`^${s} +healthy `, "m").test(status));
  check(statusOk, "slashslash status shows every service up and both products healthy");

  const logs = docker(["logs", NAME]).split("\n").filter(Boolean);
  const unlabelled = logs.filter((l) => !/^\[(init-data|pixelslash|toggleslash|caddy)\] /.test(l));
  check(unlabelled.length === 0, `every log line has its service prefix (${logs.length} lines)`, unlabelled.slice(0, 10).join("\n"));
  check(!logs.some((l) => l.includes(token)), "the admin token is in no log line");

  const outside = writesOutsideAllowed();
  check(outside.length === 0, "nothing written outside /run, /tmp, /home/app and /data", outside.join("\n"));

  console.log(`measured: memory after the run ${docker(["stats", "--no-stream", "--format", "{{.MemUsage}}", NAME])}`);

  await readOnlyDataStops();
  await readOnlyRootRuns();
  console.log("smoke: all checks passed");
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  docker(["rm", "-f", NAME], true);
  docker(["volume", "rm", VOLUME], true);
}
