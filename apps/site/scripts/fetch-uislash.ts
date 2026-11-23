/**
 * Fetches the UISlash docs data at the commit pinned in uislash.sha.json into .sources/uislash:
 * packages/ui-react/docs/components/*.ts, props.json, types.json,
 * apps/hack-cove-site/src/content/ui.ts, and the story closure under apps/storybook/src.
 * Fails, naming both versions, when node_modules/@slashsuite/ui-react differs from uislash.sha.json.
 */
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, posix, resolve } from "node:path";

const REPO = "slashsuite/uislash";
const SITE = resolve(import.meta.dirname, "..");

type UislashPin = {
  sha: string;
  "ui-react": string;
  themes: string;
};

/** Reads and validates uislash.sha.json: full 40-char commit SHA plus both package versions. */
function readUislashPin(path: string): UislashPin {
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

const DOCS_COMPONENTS = "packages/ui-react/docs/components";
const DOCS_DATA = [
  "packages/ui-react/docs/props.json",
  "packages/ui-react/docs/types.json",
  "apps/hack-cove-site/src/content/ui.ts",
] as const;
const STORIES_ROOT = "apps/storybook/src";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readInstalledUiReactVersion(siteDir: string): string {
  const pkgPath = resolve(siteDir, "node_modules/@slashsuite/ui-react/package.json");
  if (!existsSync(pkgPath)) {
    throw new Error(`installed @slashsuite/ui-react not found at ${pkgPath}; run bun install`);
  }
  const parsed: unknown = JSON.parse(readFileSync(pkgPath, "utf8"));
  if (!isRecord(parsed) || typeof parsed["version"] !== "string") {
    throw new Error(`${pkgPath}: missing string version`);
  }
  return parsed["version"];
}

/**
 * Checks that the installed @slashsuite/ui-react version matches uislash.sha.json's "ui-react" field.
 * Fails naming both versions when they differ.
 */
export function assertUiReactVersionMatches(siteDir = SITE): UislashPin {
  const pin = readUislashPin(resolve(siteDir, "uislash.sha.json"));
  const installed = readInstalledUiReactVersion(siteDir);
  if (installed !== pin["ui-react"]) {
    throw new Error(
      `uislash.sha.json pins ui-react ${pin["ui-react"]}, but installed @slashsuite/ui-react is ${installed}; set "ui-react" in uislash.sha.json (and "sha" to the uislash commit that built it) to ${installed}`,
    );
  }
  return pin;
}

function addMatches(text: string, pattern: RegExp, stems: Set<string>): void {
  for (const match of text.matchAll(pattern)) {
    const stem = match[1];
    if (stem) stems.add(stem);
  }
}

function addListStems(source: string, listPattern: RegExp, itemPattern: RegExp, stems: Set<string>): void {
  for (const match of source.matchAll(listPattern)) {
    addMatches(match[1] ?? "", itemPattern, stems);
  }
}

/** Collects every story stem named by pairs, fullPage or stories in the component docs files. */
export function collectStoryStems(componentSources: readonly string[]): Set<string> {
  const stems = new Set<string>();
  for (const source of componentSources) {
    addListStems(source, /\bpairs:\s*\[([\s\S]*?)\]/g, /["']([^"'/]+)\/[^"']+["']/g, stems);
    addMatches(source, /\bfullPage:\s*["']([^"'/]+)\/[^"']+["']/g, stems);
    addListStems(source, /\bstories:\s*\[([\s\S]*?)\]/g, /["']([^"'/]+)["']/g, stems);
  }
  return stems;
}

/** Lists every file under a directory, as POSIX paths relative to `root`. */
function listRelativeFiles(root: string, subDir: string): string[] {
  const full = resolve(root, subDir);
  if (!existsSync(full)) return [];
  const out: string[] = [];
  for (const entry of readdirSync(full, { recursive: true, encoding: "utf8" })) {
    const abs = resolve(full, entry);
    if (statSync(abs).isFile()) {
      out.push(posix.join(subDir, entry.replaceAll("\\", "/")));
    }
  }
  return out.toSorted();
}

function resolveRelativeImport(fromFile: string, specifier: string, allFiles: ReadonlySet<string>): string {
  const stripped = specifier.replace(/\.(?:js|ts|tsx)$/, "");
  const base = posix.normalize(posix.join(posix.dirname(fromFile), stripped));
  const candidates = [base, `${base}.ts`, `${base}.tsx`, `${base}/index.ts`, `${base}/index.tsx`];
  const hit = candidates.find((candidate) => allFiles.has(candidate));
  if (hit === undefined) {
    throw new Error(`${fromFile}: cannot resolve relative import "${specifier}"`);
  }
  return hit;
}

function relativeSpecifiers(source: string): string[] {
  const found: string[] = [];
  for (const match of source.matchAll(/\b(?:from|import)\s*\(?\s*["'](\.{1,2}\/[^"']+)["']/g)) {
    if (match[1]) found.push(match[1]);
  }
  return found;
}

/** Resolves the story files for `stems` plus every relative helper file they import. */
function resolveStoryClosure(extractDir: string, stems: ReadonlySet<string>): string[] {
  const storyTree = listRelativeFiles(extractDir, STORIES_ROOT);
  const allFiles = new Set(storyTree);
  const queue = storyTree.filter((file) => {
    if (!file.endsWith(".stories.tsx")) return false;
    const stem = posix.basename(file, ".stories.tsx");
    return stems.has(stem);
  });
  const seen = new Set<string>();
  while (queue.length > 0) {
    const current = queue.shift();
    if (current === undefined || seen.has(current)) continue;
    seen.add(current);
    const source = readFileSync(resolve(extractDir, current), "utf8");
    for (const specifier of relativeSpecifiers(source)) {
      queue.push(resolveRelativeImport(current, specifier, allFiles));
    }
  }
  return [...seen].toSorted();
}

async function downloadTarball(sha: string, destFile: string): Promise<void> {
  const url = `https://codeload.github.com/${REPO}/tar.gz/${sha}`;
  let response: Response;
  let body: ArrayBuffer;
  try {
    response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status} from ${url}`);
    body = await response.arrayBuffer();
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`could not fetch uislash archive at ${sha}: ${reason}`, { cause: error });
  }
  writeFileSync(destFile, new Uint8Array(body));
}

function extractArchivePaths(tarball: string, sha: string, outDir: string): void {
  const prefix = `uislash-${sha}`;
  const members = [
    `${prefix}/packages/ui-react/docs`,
    `${prefix}/apps/hack-cove-site/src/content/ui.ts`,
    `${prefix}/${STORIES_ROOT}`,
  ];
  const result = spawnSync("tar", ["-xzf", tarball, "-C", outDir, "--strip-components=1", ...members], {
    encoding: "utf8",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`tar extract failed (${String(result.status)}): ${result.stderr}`);
  }
}

function copyIntoStaging(extractDir: string, stageDir: string, files: readonly string[]): void {
  for (const rel of files) {
    const src = resolve(extractDir, rel);
    if (!existsSync(src)) throw new Error(`missing expected uislash file: ${rel}`);
    const dst = resolve(stageDir, rel);
    mkdirSync(dirname(dst), { recursive: true });
    copyFileSync(src, dst);
  }
  // packages/ui-react/docs/components/types.ts imports IconName from "../../src/icons".
  const iconShim = resolve(stageDir, "packages/ui-react/src/icons.d.ts");
  mkdirSync(dirname(iconShim), { recursive: true });
  writeFileSync(iconShim, 'export type { IconName } from "@slashsuite/ui-react";\n');
}

export async function fetchUislashSources(siteDir = SITE): Promise<{
  sha: string;
  docsCount: number;
  storyCount: number;
}> {
  const pin = assertUiReactVersionMatches(siteDir);
  const workDir = mkdtempSync(join(tmpdir(), "slashslash-uislash-"));
  const outDir = resolve(siteDir, ".sources/uislash");
  const stageDir = resolve(siteDir, ".sources/uislash.next");
  try {
    const tarball = resolve(workDir, "uislash.tar.gz");
    const extractDir = resolve(workDir, "extracted");
    mkdirSync(extractDir, { recursive: true });
    await downloadTarball(pin.sha, tarball);
    extractArchivePaths(tarball, pin.sha, extractDir);

    const componentFiles = listRelativeFiles(extractDir, DOCS_COMPONENTS).filter((file) => file.endsWith(".ts"));
    const componentSources = componentFiles.map((file) => readFileSync(resolve(extractDir, file), "utf8"));
    const stems = collectStoryStems(componentSources);
    const storyFiles = resolveStoryClosure(extractDir, stems);

    const docsFiles = [...componentFiles, ...DOCS_DATA];
    rmSync(stageDir, { recursive: true, force: true });
    mkdirSync(stageDir, { recursive: true });
    copyIntoStaging(extractDir, stageDir, [...docsFiles, ...storyFiles]);
    rmSync(outDir, { recursive: true, force: true });
    renameSync(stageDir, outDir);
    return { sha: pin.sha, docsCount: docsFiles.length, storyCount: storyFiles.length };
  } finally {
    rmSync(stageDir, { recursive: true, force: true });
    rmSync(workDir, { recursive: true, force: true });
  }
}
