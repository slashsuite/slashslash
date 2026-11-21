import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { expect, test } from "vitest";
import { PIXELSLASH_FILES } from "../scripts/fetch-sources";
import { assertUiReactVersionMatches, collectStoryStems } from "../scripts/fetch-uislash";

const SITE = resolve(import.meta.dirname, "..");
const SCRIPT = resolve(SITE, "scripts/fetch-sources.ts");
const TOUCHED = [resolve(SITE, ".sources"), resolve(SITE, "public/pixelslash")];

/** Every file under a folder with its modification time, so a delete or a rewrite shows. */
function snapshot(dir: string): Record<string, number> {
  if (!existsSync(dir)) return {};
  const out: Record<string, number> = {};
  for (const name of readdirSync(dir, { recursive: true, encoding: "utf8" })) {
    const path = resolve(dir, name);
    out[name] = statSync(path).mtimeMs;
  }
  return out;
}

/** Creates a minimal site directory with uislash.json and an installed @slashsuite/ui-react package.json. */
function makeSiteFixture(pinVersion: string, installedVersion: string): string {
  const dir = mkdtempSync(resolve(tmpdir(), "uislash-pin-"));
  writeFileSync(
    resolve(dir, "uislash.json"),
    JSON.stringify({ sha: "e85986c14eecae2c7892cc8843d9da3573cb4624", "ui-react": pinVersion, themes: "0.3.2" }),
  );
  const pkgDir = resolve(dir, "node_modules/@slashsuite/ui-react");
  mkdirSync(pkgDir, { recursive: true });
  writeFileSync(resolve(pkgDir, "package.json"), JSON.stringify({ name: "@slashsuite/ui-react", version: installedVersion }));
  return dir;
}

test("--list prints exactly PIXELSLASH_FILES and touches no fetched folder", () => {
  const before = TOUCHED.map(snapshot);
  const run = spawnSync("bun", [SCRIPT, "--list"], { encoding: "utf8" });
  expect(run.status, run.stderr).toBe(0);
  expect(run.stdout).toBe(`${PIXELSLASH_FILES.join("\n")}\n`);
  expect(TOUCHED.map(snapshot)).toEqual(before);
});

test("assertUiReactVersionMatches passes when uislash.json matches installed @slashsuite/ui-react", () => {
  const pin = assertUiReactVersionMatches(SITE);
  expect(pin.sha).toMatch(/^[0-9a-f]{40}$/);
  expect(pin["ui-react"]).toMatch(/^\d+\.\d+\.\d+/);
  const dir = makeSiteFixture("0.11.3", "0.11.3");
  try {
    expect(assertUiReactVersionMatches(dir)["ui-react"]).toBe("0.11.3");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("assertUiReactVersionMatches fails naming both versions when uislash.json differs from installed @slashsuite/ui-react", () => {
  const dir = makeSiteFixture("0.99.0", "0.11.3");
  try {
    expect(() => assertUiReactVersionMatches(dir)).toThrow(/0\.99\.0[\s\S]*0\.11\.3/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("collectStoryStems collects PascalCase and lowercase story stems from pairs, fullPage, and stories", () => {
  const stems = collectStoryStems([
    `export const pages = [{ pairs: ["Button/Primary", "ui/EmptyNote"], fullPage: "Layout/Full", stories: ["extraStem"] }];`,
  ]);
  expect([...stems].toSorted()).toEqual(["Button", "Layout", "extraStem", "ui"]);
});
