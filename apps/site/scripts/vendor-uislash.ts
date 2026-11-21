/**
 * Checks out slashsuite/uislash at the commit pinned in uislash.json into .sources/uislash-build
 * (gitignored), runs uislash's own build for @slashsuite/ui-react, and packs both
 * @slashsuite/ui-react and @slashsuite/themes with `bun pm pack` into apps/site/vendor/.
 * Both tarballs are committed so installs need no npm @slashsuite scope.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const REPO_URL = "https://github.com/slashsuite/uislash.git";
const SITE = resolve(import.meta.dirname, "..");
const PIN_PATH = resolve(SITE, "uislash.json");
const BUILD_DIR = resolve(SITE, ".sources/uislash-build");
const VENDOR_DIR = resolve(SITE, "vendor");

export type UislashPin = {
  sha: string;
  "ui-react": string;
  themes: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Reads and validates uislash.json: full 40-char commit SHA plus both package versions. */
export function readUislashPin(path = PIN_PATH): UislashPin {
  const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
  if (!isRecord(parsed)) throw new Error(`${path}: expected a JSON object`);
  const sha = parsed["sha"];
  const uiReact = parsed["ui-react"];
  const themes = parsed["themes"];
  if (typeof sha !== "string" || !/^[0-9a-f]{40}$/.test(sha)) {
    throw new Error(`${path}: sha is not a full commit SHA: "${String(sha)}"`);
  }
  if (typeof uiReact !== "string" || uiReact.trim() === "") {
    throw new Error(`${path}: ui-react version is missing`);
  }
  if (typeof themes !== "string" || themes.trim() === "") {
    throw new Error(`${path}: themes version is missing`);
  }
  return { sha, "ui-react": uiReact, themes };
}

function run(command: string, args: readonly string[], cwd: string): void {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed in ${cwd} with exit code ${String(result.status)}`);
  }
}

function readPackageVersion(packageJsonPath: string): string {
  const parsed: unknown = JSON.parse(readFileSync(packageJsonPath, "utf8"));
  if (!isRecord(parsed) || typeof parsed["version"] !== "string") {
    throw new Error(`${packageJsonPath}: missing string version`);
  }
  return parsed["version"];
}

function checkoutAtSha(sha: string): void {
  rmSync(BUILD_DIR, { recursive: true, force: true });
  mkdirSync(BUILD_DIR, { recursive: true });
  run("git", ["init", "--quiet"], BUILD_DIR);
  run("git", ["remote", "add", "origin", REPO_URL], BUILD_DIR);
  run("git", ["fetch", "--depth", "1", "origin", sha], BUILD_DIR);
  run("git", ["checkout", "--quiet", "FETCH_HEAD"], BUILD_DIR);
}

function verifyCheckedOutVersions(pin: UislashPin): void {
  const uiReactVersion = readPackageVersion(resolve(BUILD_DIR, "packages/ui-react/package.json"));
  if (uiReactVersion !== pin["ui-react"]) {
    throw new Error(
      `uislash at ${pin.sha} has packages/ui-react version ${uiReactVersion}, expected ${pin["ui-react"]} from uislash.json`,
    );
  }
  const themesVersion = readPackageVersion(resolve(BUILD_DIR, "themes/package.json"));
  if (themesVersion !== pin.themes) {
    throw new Error(
      `uislash at ${pin.sha} has themes version ${themesVersion}, expected ${pin.themes} from uislash.json`,
    );
  }
}

function removeOldTarballs(prefix: string): void {
  if (!existsSync(VENDOR_DIR)) return;
  for (const name of readdirSync(VENDOR_DIR)) {
    if (name.startsWith(prefix) && name.endsWith(".tgz")) {
      rmSync(resolve(VENDOR_DIR, name), { force: true });
    }
  }
}

function packPackage(pkgDir: string, filename: string, prefix: string): void {
  removeOldTarballs(prefix);
  const destination = resolve(VENDOR_DIR, filename);
  run("bun", ["pm", "pack", "--ignore-scripts", "--filename", destination], pkgDir);
  if (!existsSync(destination)) {
    throw new Error(`bun pm pack did not write ${destination}`);
  }
}

function main(): void {
  const pin = readUislashPin();
  console.log(`vendoring @slashsuite/ui-react@${pin["ui-react"]} and @slashsuite/themes@${pin.themes} from ${pin.sha}`);
  checkoutAtSha(pin.sha);
  verifyCheckedOutVersions(pin);

  // Install at the uislash root, then run uislash's own build task for ui-react.
  // themes ships raw CSS files and has no build task in themes/moon.yml.
  run("bun", ["install", "--frozen-lockfile"], BUILD_DIR);
  run("bunx", ["moon", "run", "ui-react:build"], BUILD_DIR);

  mkdirSync(VENDOR_DIR, { recursive: true });
  packPackage(resolve(BUILD_DIR, "packages/ui-react"), `slashsuite-ui-react-${pin["ui-react"]}.tgz`, "slashsuite-ui-react-");
  packPackage(resolve(BUILD_DIR, "themes"), `slashsuite-themes-${pin.themes}.tgz`, "slashsuite-themes-");
  console.log(`packed vendored tarballs into ${VENDOR_DIR}`);
}

if (import.meta.main) {
  try {
    main();
  } catch (error) {
    console.error(`vendor-uislash: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
