import { globSync, readFileSync, statSync } from "node:fs";
import { basename, resolve } from "node:path";
import { describe, expect, test } from "vitest";

const DIR = import.meta.dirname;
const SELF = basename(import.meta.filename);

/**
 * The first comment in a source file, before any code: a run of `//` lines, a `/* *\/` block or an
 * HTML comment. An .astro file's opening `---` fence is skipped, so its frontmatter comment counts.
 */
function firstComment(source: string): string | undefined {
  const body = source.replace(/^\s*---[^\S\n]*\n/, "");
  return /^\s*(\/\/[^\n]*(?:\n\s*\/\/[^\n]*)*|\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->)/.exec(body)?.[1];
}

/** Every stand-in, by its path under this folder: everything but the README and this test. */
const standIns = (): string[] =>
  globSync("**/*", { cwd: DIR })
    .filter((file) => statSync(resolve(DIR, file)).isFile() && file !== "README.md" && file !== SELF)
    .toSorted();

/** Whether a stand-in's first comment names the UISlash package it stands in for. */
const namesItsPackage = (file: string): boolean =>
  /@slashsuite\/(?:ui-react|themes)\b/.test(firstComment(readFileSync(resolve(DIR, file), "utf8")) ?? "");

describe("stand-ins", () => {
  test("every stand-in's first comment names the UISlash package it stands in for", () => {
    const missing = standIns().filter((file) => !namesItsPackage(file));
    expect(missing).toEqual([]);
  });
});
