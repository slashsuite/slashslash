import { existsSync, globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { LISTED_PAGES, SELF_HOST_HREF } from "#/pixelslash/doc/docs-map";
import { DOCS } from "#/pixelslash/doc/resolve-links";
import type { SearchEntry } from "#/pixelslash/doc/search";

/*
 * The docs search as the build writes it, read from dist (`bunx moon run site:test` builds first): the
 * index file, and the island on the docs pages and on no other page.
 */

const DIST = resolve(import.meta.dirname, "../../../dist");

function read(file: string): string {
  const path = resolve(DIST, file);
  if (!existsSync(path)) throw new Error(`No built file at ${path}. Run the build first: bunx moon run site:build.`);
  return readFileSync(path, "utf8");
}

const INDEX: SearchEntry[] = JSON.parse(read("pixelslash/search-index.json"));

/** The built file a page address is served from: `/pixelslash/docs/upload` is pixelslash/docs/upload.html. */
const fileOf = (url: string): string => `${url.split("#")[0]?.slice(1)}.html`;

describe("dist/pixelslash/search-index.json", () => {
  test("every listed docs page has an entry under its own address", () => {
    const missing = LISTED_PAGES.filter(
      (page) => !INDEX.some((entry) => entry.url === `${DOCS}/${page.slug}` || entry.url.startsWith(`${DOCS}/${page.slug}#`)),
    );
    expect(missing.map((page) => page.slug)).toEqual([]);
  });

  test("the self-host guide has entries under its address", () => {
    expect(INDEX.filter((entry) => entry.url.startsWith(`${SELF_HOST_HREF}#`)).length).toBeGreaterThan(0);
  });

  test("every entry's page is a page the build wrote", () => {
    const pages = [...new Set(INDEX.map((entry) => fileOf(entry.url)))];
    expect(pages.filter((file) => !existsSync(resolve(DIST, file)))).toEqual([]);
  });
});

const ISLAND = /<astro-island[^>]*component-export="DocsSearch"/g;

describe("the search island", () => {
  test("is on the docs landing and on every docs page, once", () => {
    const pages = ["pixelslash/docs.html", ...globSync("pixelslash/docs/*.html", { cwd: DIST })];
    expect(pages.length).toBeGreaterThan(LISTED_PAGES.length);
    for (const file of pages) expect(read(file).match(ISLAND)?.length, file).toBe(1);
  });

  test("is a search landmark whose field is named, hints at the / key and has a decorative glass", () => {
    const pages = ["pixelslash/docs.html", ...globSync("pixelslash/docs/*.html", { cwd: DIST })];
    for (const file of pages) {
      const box = read(file).match(/<div role="search">[\s\S]*?<input[^>]*>/)?.[0] ?? "";
      expect(box, file).toMatch(/<input type="search" aria-label="Search the docs" placeholder="Search the docs \(press \/\)"/);
      expect(box, file).toMatch(/<span aria-hidden="true"[^>]*><svg /);
    }
  });

  test("is on no other page", () => {
    const others = globSync("**/*.html", { cwd: DIST }).filter(
      (file) => file !== "pixelslash/docs.html" && !file.startsWith("pixelslash/docs/"),
    );
    expect(others).toContain("index.html");
    expect(others).toContain("pixelslash.html");
    for (const file of others) expect(read(file), file).not.toMatch(ISLAND);
  });
});
