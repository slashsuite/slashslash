import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { type Token, lexer } from "marked";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import cliMarkdown from "@pixelslash-src/docs/cli.md?raw";
import { PIXELSLASH_FILES } from "../../../scripts/fetch-sources";
import { PAGES } from "#/content/pages";
import { SITE_URL } from "#/content/site";
import { ANCHOR_PAGE, CLI_SPLIT } from "#/pixelslash/doc/cli";
import { splitCli } from "#/pixelslash/doc/cli-pages";
import { plainText, slugger } from "#/pixelslash/doc/doc-text";
import { CLI_INTRO_DOC, DOCS_BY_SLUG } from "#/pixelslash/doc/docs-content";
import { DOC_PAGES, type DocPageDef, GROUPS, LISTED_PAGES, neighbours } from "#/pixelslash/doc/docs-map";
import { DocsIndexPage, DocsPage } from "#/pixelslash/doc/DocsPages";
import { OLD_ANCHOR_SCRIPT, oldAnchorScript } from "#/pixelslash/doc/old-anchors";
import { resolveImageSrc } from "#/pixelslash/doc/resolve-links";

/*
 * PixelSlash's docs, ported from its site, against the files fetched at the pinned commit
 * (scripts/fetch-sources.ts): docs/cli.md cut into pages, every heading and code block on exactly one
 * of them, and the built pages in dist (`bunx moon run site:test` builds first).
 */

const SITE = resolve(import.meta.dirname, "../../..");
const SOURCES = resolve(SITE, ".sources/pixelslash");
const DIST = resolve(SITE, "dist");

const fetched = (path: string): string => readFileSync(resolve(SOURCES, path), "utf8");
const built = (file: string): string => {
  const path = resolve(DIST, file);
  if (!existsSync(path)) throw new Error(`No built page at ${path}. Run the build first: bunx moon run site:build.`);
  return readFileSync(path, "utf8");
};

const tokens = lexer(cliMarkdown);

function codeBlocks(list: Token[]): string[] {
  return list.flatMap((token) => {
    const own = token.type === "code" && "text" in token ? [token.text] : [];
    const items = "items" in token && Array.isArray(token.items) ? codeBlocks(token.items) : [];
    const inner = "tokens" in token && Array.isArray(token.tokens) ? codeBlocks(token.tokens) : [];
    return [...own, ...items, ...inner];
  });
}

const unescape = (html: string): string =>
  html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");

const decode = (html: string): string => unescape(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

const cliPages = DOC_PAGES.filter((page) => page.file === undefined && page.kind === undefined);
const pageHtml = new Map(DOC_PAGES.map((page) => [page.slug, renderToStaticMarkup(<DocsPage slug={page.slug} />)]));
const indexHtml = renderToStaticMarkup(<DocsIndexPage />);
/** Every part of cli.md as the site shows it: the index lead and each cli page's body. */
const bodies = [indexHtml, ...cliPages.map((page) => pageHtml.get(page.slug) ?? "")];

/**
 * The `id="…"` of every heading in a page's body, which is where an anchor lands. A titled Card's heading
 * (the previous and next links) carries React's `useId` (`_R_…_`), which no link targets and which restarts
 * on each page, so it is left out.
 */
const idsIn = (html: string): string[] =>
  [...html.matchAll(/<h[1-6][^>]*\sid="([^"]+)"/g)].map((m) => m[1] ?? "").filter((id) => !/^_.*_$/.test(id));

function def(slug: string, sections: string[]): DocPageDef {
  return { slug, title: slug, group: "reference", sections };
}

describe("the fetch", () => {
  test("takes docs/cli.md, every docs file of the map and every screenshot the docs show", () => {
    expect(PIXELSLASH_FILES).toContain("docs/cli.md");
    const files = DOC_PAGES.flatMap((page) => (page.file === undefined ? [] : [page.file]));
    expect(files).toHaveLength(27);
    for (const file of files) expect(PIXELSLASH_FILES).toContain(file);
    expect(PIXELSLASH_FILES.filter((path) => path.startsWith("apps/site/public/docs-images/"))).toHaveLength(17);
  });
});

describe("the docs map", () => {
  test("puts every H2 of cli.md on exactly one page", () => {
    const h2 = tokens.flatMap((token) =>
      token.type === "heading" && token.depth === 2 ? [plainText(token.tokens)] : [],
    );
    expect(h2.length).toBeGreaterThan(0);
    for (const text of h2) {
      const owners = cliPages.filter((page) => page.sections.includes(text));
      expect(
        owners.map((page) => page.slug),
        `"${text}"`,
      ).toHaveLength(1);
    }
  });

  test("every listed heading exists in cli.md", () => {
    const headings = new Set(tokens.flatMap((token) => (token.type === "heading" ? [plainText(token.tokens)] : [])));
    const missing = DOC_PAGES.flatMap((page) => page.sections.filter((section) => !headings.has(section)));
    expect(missing).toEqual([]);
  });

  test("has at least six pages, each in a group", () => {
    expect(DOC_PAGES.length).toBeGreaterThanOrEqual(6);
    for (const page of DOC_PAGES) expect(GROUPS.map((group) => group.id)).toContain(page.group);
    expect(new Set(DOC_PAGES.map((page) => page.slug)).size).toBe(DOC_PAGES.length);
    expect(GROUPS).toHaveLength(12);
  });

  test("stops the build on an H2 no page claims", () => {
    expect(() => splitCli("# T\n\n## Placed\n\n## Stray\n", [def("a", ["Placed"])])).toThrow(
      /"Stray" of cli\.md is on no page/,
    );
  });

  test("stops the build on a section on two pages", () => {
    expect(() => splitCli("# T\n\n## One\n", [def("a", ["One"]), def("b", ["One"])])).toThrow(/"One" is on both a and b/);
  });

  test("stops the build on a listed heading that no longer exists", () => {
    expect(() => splitCli("# T\n\n## One\n", [def("a", ["One", "Gone"])])).toThrow(/no heading "Gone"/);
  });

  test("cuts an H3 out of its H2 and puts the rest back after it", () => {
    const md = "# T\n\n## A\n\na1\n\n### Cut\n\ncut\n\n### Kept\n\nkept\n";
    const split = splitCli(md, [def("a", ["A"]), def("b", ["Cut"])]);
    const text = (slug: string): string => (split.pages.get(slug) ?? []).map((token) => plainText([token])).join("|");
    expect(text("b")).toContain("Cut");
    expect(text("a")).toContain("Kept");
    expect(text("a")).not.toContain("Cut");
    expect(split.anchorPage.get("cut")).toBe("b");
    expect(split.anchorPage.get("kept")).toBe("a");
  });
});

describe("the docs pages", () => {
  test("every H2 and H3 of cli.md is on exactly one page, with its GitHub anchor", () => {
    const slug = slugger();
    const headings = tokens.filter((token) => token.type === "heading" && token.depth >= 2 && token.depth <= 3);
    expect(headings.length).toBeGreaterThan(0);
    const seen = bodies.flatMap(idsIn);
    for (const heading of headings) {
      if (heading.type !== "heading") continue;
      const id = slug(plainText(heading.tokens));
      expect(
        seen.filter((seenId) => seenId === id),
        `#${id}`,
      ).toHaveLength(1);
    }
  });

  test("every code block of cli.md is on exactly one page, verbatim", () => {
    const blocks = codeBlocks(tokens);
    expect(blocks.length).toBeGreaterThan(0);
    const shown = bodies.reduce((count, html) => count + (html.match(/<pre/g)?.length ?? 0), 0);
    expect(shown).toBe(blocks.length);
    const flat = unescape(bodies.join("").replace(/<[^>]+>/g, "")).replace(/\s+/g, "");
    for (const block of blocks) expect(flat).toContain(block.replace(/\s+/g, ""));
  });

  test("heading ids are unique across the pages cut from cli.md", () => {
    const all = bodies.flatMap(idsIn);
    expect(new Set(all).size).toBe(all.length);
  });

  test("the index shows the file's own title and the blurb before its first section", () => {
    expect(CLI_INTRO_DOC.title).toBe(CLI_SPLIT.title);
    expect(CLI_SPLIT.title).toBe("PixelSlash");
    expect(indexHtml).toContain("compares two versions of a page");
    expect(indexHtml).toContain('data-testid="docs-nav"');
    expect(indexHtml.match(/<a\b[^>]*aria-current="page"[^>]*>/g)).toEqual([expect.stringContaining('href="/pixelslash/docs"')]);
  });

  test("the index lists every listed page, once, under its group", () => {
    // The group cards alone: the docs nav after them lists the pages too.
    const cards = indexHtml.slice(indexHtml.indexOf('data-testid="docs-index"'), indexHtml.indexOf('data-testid="docs-nav"'));
    const counts = LISTED_PAGES.map((item) => [
      item.slug,
      cards.match(new RegExp(`href="/pixelslash/docs/${item.slug}"`, "g"))?.length ?? 0,
    ]);
    expect(counts.filter(([, count]) => count !== 1)).toEqual([]);
    for (const group of GROUPS) expect(indexHtml).toContain(group.title);
    for (const page of DOC_PAGES.filter((item) => item.unlisted === true))
      expect(indexHtml).not.toContain(`href="/pixelslash/docs/${page.slug}"`);
  });

  test.each(LISTED_PAGES.map((p) => p.slug))("%s has the group nav, the current page marked, and previous/next", (slug) => {
    const html = pageHtml.get(slug) ?? "";
    expect(html).toContain('data-testid="docs-nav"');
    for (const group of GROUPS) expect(html).toContain(`data-testid="docs-group-${group.id}"`);
    for (const other of LISTED_PAGES) expect(html).toContain(`href="/pixelslash/docs/${other.slug}"`);
    const current = [...html.matchAll(/<a\b[^>]*aria-current="page"[^>]*>/g)].map((m) => m[0]);
    expect(current).toHaveLength(1);
    expect(current[0]).toContain(`href="/pixelslash/docs/${slug}"`);
    const { prev, next } = neighbours(slug);
    expect(html.includes('data-testid="docs-prev"')).toBe(prev !== undefined);
    expect(html.includes('data-testid="docs-next"')).toBe(next !== undefined);
    expect(prev !== undefined || next !== undefined).toBe(true);
    const source = DOCS_BY_SLUG.get(slug)?.source ?? "";
    expect(html).toContain(`href="https://github.com/slashsuite/pixelslash/blob/main/${source}"`);
  });

  test("the first page has no previous and the last no next", () => {
    expect(neighbours(LISTED_PAGES[0]?.slug ?? "").prev).toBeUndefined();
    expect(neighbours(LISTED_PAGES.at(-1)?.slug ?? "").next).toBeUndefined();
  });

  test("getting started is docs/getting-started.md, and its links to cli.md land on the page holding the anchor", () => {
    const md = fetched("docs/getting-started.md");
    expect(DOCS_BY_SLUG.get("getting-started")?.title).toBe("Getting started");
    expect(md).toContain("cli.md#");
    const html = pageHtml.get("getting-started") ?? "";
    expect(html).not.toContain('href="cli.md');
    const links = [...html.matchAll(/href="\/pixelslash\/docs\/([^"#]+)#([^"]+)"/g)];
    expect(links.length).toBeGreaterThan(0);
    for (const match of links) {
      expect(DOC_PAGES.map((p) => p.slug)).toContain(match[1]);
      expect(ANCHOR_PAGE[match[2] ?? ""]).toBe(match[1]);
    }
  });

  test("no page's text links a repository markdown file that is served here as a page", () => {
    for (const [slug, page] of pageHtml) {
      // The text alone: the edit link after it goes to the page's own file on GitHub, as it should.
      const html = page.slice(page.indexOf('data-testid="docs-article"'), page.indexOf('data-testid="docs-edit"'));
      expect(html, slug).not.toMatch(/href="(?!https:)[^"]*\.md/);
      for (const doc of DOC_PAGES.filter((item) => item.file !== undefined))
        expect(html, slug).not.toContain(`/blob/main/${doc.file}"`);
    }
  });
});

describe("the screenshots in the docs", () => {
  const images = DOC_PAGES.flatMap((page) => {
    if (!page.file) return [];
    const md = fetched(page.file);
    return [...md.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((match) => ({ page, file: page.file ?? "", src: match[1] ?? "" }));
  });

  test("every one is a file the site serves, drawn on its page", () => {
    expect(images.length).toBeGreaterThan(0);
    for (const { page, file, src } of images) {
      const served = resolveImageSrc(src, file);
      expect(served).not.toBeNull();
      expect(existsSync(resolve(SITE, "public", `.${served ?? ""}`)), served ?? src).toBe(true);
      expect(pageHtml.get(page.slug)).toContain(`src="${served}"`);
    }
  });
});

/** Runs the script against a stand-in `location`, and returns where it sent the browser, if anywhere. */
function run(script: string, hash: string): string | undefined {
  let sent: string | undefined;
  const location = { hash, replace: (to: string) => (sent = to) };
  runInNewContext(script, { location });
  return sent;
}

describe("links into the docs", () => {
  test("an old /pixelslash/docs#anchor is sent to the page that holds it, for every heading of cli.md", () => {
    for (const [anchor, slug] of CLI_SPLIT.anchorPage) expect(OLD_ANCHOR_SCRIPT).toContain(`"${anchor}":"${slug}"`);
    expect(CLI_SPLIT.anchorPage.get("uploading-to-a-server")).toBe("upload");
    expect(CLI_SPLIT.anchorPage.get("comparing-two-snapshot-dirs")).toBe("compare-dirs");
    expect(CLI_SPLIT.anchorPage.get("snapshot-capture-the-pinned-image")).toBe("capture");
    expect(CLI_SPLIT.anchorPage.get("exit-codes-and-the-failed-line")).toBe("signing-in");
  });

  test("the script, run, replaces the location with the page that holds the anchor", () => {
    expect(run(oldAnchorScript(ANCHOR_PAGE), "#exit-codes-and-the-failed-line")).toBe(
      "/pixelslash/docs/signing-in#exit-codes-and-the-failed-line",
    );
  });

  test("the script leaves an empty hash and one it does not know alone", () => {
    expect(run(OLD_ANCHOR_SCRIPT, "")).toBeUndefined();
    expect(run(OLD_ANCHOR_SCRIPT, "#no-such-heading")).toBeUndefined();
    expect(run(OLD_ANCHOR_SCRIPT, "#toString")).toBeUndefined();
  });
});

describe("the built docs pages", () => {
  const files = [
    { path: "/pixelslash/docs", file: "pixelslash/docs.html", h1: "Docs" },
    ...DOC_PAGES.map((page) => ({ path: `/pixelslash/docs/${page.slug}`, file: `pixelslash/docs/${page.slug}.html`, h1: page.title })),
  ];

  test.each(files)("$file has one h1, the page's title, and wears the PixelSlash card", ({ file, h1 }) => {
    const html = built(file);
    const headings = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => decode(m[1] ?? ""));
    expect(headings).toEqual([h1]);
    expect(html).toContain(`<meta property="og:image" content="${SITE_URL}/og/pixelslash.png"`);
  });

  test("each docs page's title ends · PixelSlash docs and its description is its first paragraph", () => {
    const html = built("pixelslash/docs/getting-started.html");
    expect(decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "")).toMatch(/^Getting started · PixelSlash docs \| /);
    const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
    expect(description.length).toBeGreaterThan(40);
    expect(decode(fetched("docs/getting-started.md"))).toContain(description.slice(0, 30));
  });

  test("every link into the docs from the other PixelSlash pages names a page and a heading that exist", () => {
    const links = ["pixelslash.html", "pixelslash/how-it-works.html", "pixelslash/security.html", "pixelslash/self-host.html"].flatMap(
      (file) => [...built(file).matchAll(/href="\/pixelslash\/docs\/([a-z0-9-]+)(?:#([^"]+))?"/g)].map((m) => ({ file, slug: m[1] ?? "", anchor: m[2] })),
    );
    expect(links.length).toBeGreaterThan(0);
    for (const { file, slug } of links) expect(DOC_PAGES.map((page) => page.slug), file).toContain(slug);
    const unknownAnchors = links
      .filter(({ slug, anchor }) => anchor !== undefined && !(DOCS_BY_SLUG.get(slug)?.headings.some((h) => h.id === anchor) ?? false))
      .map(({ file, anchor = "" }) => `${file} #${anchor}`);
    expect(unknownAnchors).toEqual([]);
  });

  test("the docs index carries the old-anchor script, inline", () => {
    const html = built("pixelslash/docs.html");
    expect(html).toContain(OLD_ANCHOR_SCRIPT.slice(0, 60));
  });

  test("the sitemap lists the docs index and every listed page, and no unlisted one", () => {
    const sitemap = built("sitemap.xml");
    expect(sitemap).toContain(`<loc>${SITE_URL}/pixelslash/docs</loc>`);
    for (const page of LISTED_PAGES) expect(sitemap).toContain(`<loc>${SITE_URL}/pixelslash/docs/${page.slug}</loc>`);
    for (const page of DOC_PAGES.filter((item) => item.unlisted === true)) {
      expect(sitemap).not.toContain(`/pixelslash/docs/${page.slug}<`);
      expect(PAGES.some((entry) => entry.path === `/pixelslash/docs/${page.slug}`)).toBe(false);
    }
  });
});
