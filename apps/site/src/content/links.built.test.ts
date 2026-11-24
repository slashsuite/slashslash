import { existsSync, globSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

/** The built site to check. */
const DIST = resolve(import.meta.dirname, "../../dist");

/**
 * Dead internal links written in PixelSlash's fetched content (.sources, public/pixelslash), which this repo cannot fix,
 * as `<built page> <href>` with the reason. A dead link written in this repo's own files is fixed, never listed here.
 */
const EXCEPTIONS: ReadonlyMap<string, string> = new Map();

const pages = (): string[] => {
  if (!["404.html", "index.html"].some((file) => existsSync(resolve(DIST, file))))
    throw new Error(`No built page in ${DIST}. Run the build first: bun run build.`);
  return globSync("**/*.html", { cwd: DIST }).toSorted();
};

const html = (page: string): string => readFileSync(resolve(DIST, page), "utf8");

/** Attribute values as written, with the entities Astro and React escape undone. */
const attrs = (source: string, name: string): string[] =>
  [...source.matchAll(new RegExp(`\\s${name}="([^"]*)"`, "g"))].map((m) =>
    (m[1] ?? "").replaceAll("&amp;", "&").replaceAll("&#38;", "&"),
  );

/** A percent-decoded part of an href, or undefined when its escapes are malformed (the link then counts as dead). */
function decode(part: string): string | undefined {
  try {
    return decodeURIComponent(part);
  } catch {
    return undefined;
  }
}

/** The built page a site path serves, or the file in dist/ it names, or undefined when neither exists. */
function target(path: string): string | undefined {
  const decoded = decode(path);
  if (decoded === undefined) return undefined;
  const clean = decoded.replace(/^\/+/, "").replace(/\/+$/, "");
  const candidates = clean === "" ? ["index.html"] : [`${clean}.html`, `${clean}/index.html`, clean];
  return candidates.find((file) => existsSync(resolve(DIST, file)) && statSync(resolve(DIST, file)).isFile());
}

/** A link to this site: a path or an #anchor, not a protocol-relative address. */
const isInternal = (href: string): boolean => (href.startsWith("/") || href.startsWith("#")) && !href.startsWith("//");

/** Whether an internal href on a page reaches a built file and, when it has an #anchor, an id on it. */
function resolves(page: string, href: string, idsOf: (page: string) => Set<string>): boolean {
  const [rest = "", hash] = href.split("#", 2);
  const path = rest.split("?", 1)[0] ?? "";
  const file = path === "" ? page : target(path);
  if (file === undefined) return false;
  return !hash || (file.endsWith(".html") && idsOf(file).has(decode(hash) ?? ""));
}

/** Drops inert UISlash story preview subtrees whose sample links (e.g. #quotes, /privacy) are non-interactive illustrations. */
function stripInertPreviews(source: string): string {
  const marker = /<div\b[^>]*\bdata-uislash-preview="[^"]*"[^>]*>/g;
  const tag = /<\/?div\b[^>]*>/g;
  let out = "";
  let cursor = 0;
  for (let match = marker.exec(source); match !== null; match = marker.exec(source)) {
    out += source.slice(cursor, match.index);
    let depth = 1;
    tag.lastIndex = match.index + match[0].length;
    while (depth > 0) {
      const next = tag.exec(source);
      if (next === null) break;
      depth += next[0].startsWith("</") ? -1 : 1;
    }
    cursor = depth === 0 ? tag.lastIndex : source.length;
    marker.lastIndex = cursor;
  }
  return out + source.slice(cursor);
}

/** Every internal href on every built page that does not resolve, as `<page> <href>`. */
function deadLinks(): string[] {
  const ids = new Map<string, Set<string>>();
  const idsOf = (page: string): Set<string> => {
    let found = ids.get(page);
    if (!found) ids.set(page, (found = new Set(attrs(html(page), "id"))));
    return found;
  };
  return pages().flatMap((page) =>
    attrs(stripInertPreviews(html(page)), "href")
      .filter((href) => isInternal(href) && !resolves(page, href, idsOf))
      .map((href) => `${page} ${href}`),
  );
}

describe("internal links", () => {
  test("every internal href and #anchor on every built page resolves", () => {
    expect(deadLinks().filter((link) => !EXCEPTIONS.has(link))).toEqual([]);
  });

  test("every exception is still a dead link", () => {
    const dead = new Set(deadLinks());
    for (const link of EXCEPTIONS.keys()) expect(dead.has(link), link).toBe(true);
  });
});
