import { existsSync, globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { ui as rawUi } from "@uislash-src/packages/ui-react/docs/ui";
import { componentPageOf, componentPages } from "@uislash-src/packages/ui-react/docs/components/index";
import propsJson from "@uislash-src/packages/ui-react/docs/props.json";
import { swapUiReferences } from "#/uislash/ui";

const SITE = resolve(import.meta.dirname, "../..");
const DIST = resolve(SITE, "dist");
const FETCHED_UISLASH = resolve(SITE, ".sources/uislash");

function readDist(file: string): string {
  const path = resolve(DIST, file);
  if (!existsSync(path)) throw new Error(`No built file at ${path}. Run "bunx moon run site:build" first.`);
  return readFileSync(path, "utf8");
}

function visibleText(html: string): string {
  return html
    .replace(/<(script|style|template)[\s\S]*?<\/\1>/g, " ")
    .replace(/<\/(code|a|span|strong|em)>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&#39;", "'")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replace(/\s+/g, " ")
    .trim();
}

const propsMap = new Map<string, number>(
  Object.entries(propsJson).map(([name, doc]) => [
    name,
    "props" in doc && Array.isArray(doc.props) ? doc.props.length : 0,
  ]),
);

/** Topics in the pinned uislash docs examples that intentionally ship only a Do example (no Dont export). */
const ONE_SIDED_TOPICS = new Set(["Switch/Row", "ListRow/RowActions"]);

function expectedExamples(slug: string): number {
  const page = componentPageOf(slug);
  const fromPairs = page.pairs.reduce(
    (total, topic) => total + (ONE_SIDED_TOPICS.has(topic) ? 1 : 2),
    0,
  );
  return fromPairs + (page.fullPage !== undefined ? 1 : 0);
}

function expectedProps(slug: string): number {
  return componentPageOf(slug).api.reduce((total, name) => total + (propsMap.get(name) ?? 0), 0);
}

/** Escapes a class token the way Tailwind v4 escapes class selectors in generated CSS. */
function escapeCssClass(token: string): string {
  return token.replace(/([^a-zA-Z0-9_-])/g, "\\$1");
}

function addStoryTokens(source: string, tokens: Set<string>): void {
  for (const match of source.matchAll(/\bclassName\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    const raw = match[1] ?? match[2] ?? "";
    for (const token of raw.split(/\s+/).filter((part) => part !== "")) {
      tokens.add(token);
    }
  }
}

/** Extracts static className string tokens from the fetched docs example files. */
function storyClassTokens(): string[] {
  const storyDir = resolve(FETCHED_UISLASH, "packages/ui-react/docs/examples");
  const files = globSync("**/*.{ts,tsx}", { cwd: storyDir });
  expect(files.length).toBeGreaterThan(0);
  const tokens = new Set<string>();
  for (const file of files) {
    addStoryTokens(readFileSync(resolve(storyDir, file), "utf8"), tokens);
  }
  return [...tokens].toSorted();
}

function builtCounts(slug: string): { examples: number; propRows: number } {
  const html = readDist(`uislash/${slug}.html`);
  return {
    examples: html.match(/data-uislash-example="[^"]+"/g)?.length ?? 0,
    propRows: html.match(/data-prop-row="[^"]*"/g)?.length ?? 0,
  };
}

function installCodeLines(): string[] {
  return rawUi.install.steps.flatMap((step) => ("code" in step ? [step.code].flat() : []));
}

describe("built /uislash pages", () => {
  test("writes /uislash, /uislash/llms.txt, and one HTML page per fetched component", () => {
    expect(existsSync(resolve(DIST, "uislash.html"))).toBe(true);
    expect(existsSync(resolve(DIST, "uislash/llms.txt"))).toBe(true);
    const builtSlugs = globSync("uislash/*.html", { cwd: DIST })
      .map((file) => file.replace(/^uislash\//, "").replace(/\.html$/, ""))
      .toSorted();
    expect(builtSlugs).toEqual(componentPages.map((page) => page.slug).toSorted());
    expect(builtSlugs.length).toBeGreaterThanOrEqual(90);
  });

  test("dist/uislash/llms.txt covers every component page and uses /uislash/ paths", () => {
    const llms = readDist("uislash/llms.txt");
    expect(llms.startsWith("# UISlash\n")).toBe(true);
    for (const page of componentPages) {
      expect(llms, page.slug).toContain(`## ${page.name}\n`);
    }
    expect(llms).not.toContain("@hackcove/");
  });

  test("for button, date-field, chat-message, and every component, built example and prop-row counts match fetched docs data", () => {
    for (const slug of ["button", "date-field", "chat-message"]) {
      const counts = builtCounts(slug);
      expect(counts.examples, `${slug} examples`).toBe(expectedExamples(slug));
      expect(counts.propRows, `${slug} prop rows`).toBe(expectedProps(slug));
      expect(counts.examples, `${slug} has examples`).toBeGreaterThan(0);
      expect(counts.propRows, `${slug} has props`).toBeGreaterThan(0);
    }
    for (const page of componentPages) {
      const counts = builtCounts(page.slug);
      expect(counts.examples, `${page.slug} examples`).toBe(expectedExamples(page.slug));
      expect(counts.propRows, `${page.slug} prop rows`).toBe(expectedProps(page.slug));
    }
  });

  test("every Tailwind utility class used by a fetched story is present in the built CSS", () => {
    const css = globSync("_astro/*.css", { cwd: DIST })
      .map((file) => readFileSync(resolve(DIST, file), "utf8"))
      .join("\n");
    expect(css.length).toBeGreaterThan(0);
    const tokens = storyClassTokens();
    expect(tokens.length).toBeGreaterThan(0);
    const missing = tokens.filter((token) => !css.includes(`.${escapeCssClass(token)}`));
    expect(missing).toEqual([]);
  });

  test("/uislash index intro and Getting started text equal fetched ui.ts after reference swaps", () => {
    expect(existsSync(resolve(FETCHED_UISLASH, "packages/ui-react/docs/ui.ts"))).toBe(true);
    const html = readDist("uislash.html");
    const words = visibleText(html);
    expect(words).toContain(swapUiReferences(rawUi.subtitle));
    for (const paragraph of rawUi.intro) {
      expect(words, paragraph).toContain(swapUiReferences(paragraph));
    }
    expect(words).toContain(swapUiReferences(rawUi.install.title));
    for (const step of rawUi.install.steps) {
      expect(words, step.text).toContain(swapUiReferences(step.text));
    }
    for (const line of installCodeLines()) {
      expect(words, line).toContain(swapUiReferences(line));
    }
    expect(words).toContain(swapUiReferences(rawUi.themes.title));
    expect(words).toContain(swapUiReferences(rawUi.themes.intro));
    expect(words).toContain(swapUiReferences(rawUi.components.title));
    expect(words).toContain(swapUiReferences(rawUi.components.intro));
    expect(words).toContain(swapUiReferences(rawUi.docs.title));
    expect(words).toContain(swapUiReferences(rawUi.docs.text));
    expect(html).toContain('href="/uislash/llms.txt"');
    expect(html).toContain('href="https://www.npmjs.com/package/@slashsuite/ui-react"');
    expect(html).not.toContain("@hackcove/");
  });

  // SearchIsland is the kit's SiteSearch, wrapped so it reports its hydration (src/uislash/SearchIsland.tsx).
  test("/uislash pages include the SiteSearch island", () => {
    for (const file of ["uislash.html", "uislash/button.html"]) {
      const html = readDist(file);
      expect(html, file).toMatch(/<astro-island[^>]*component-export="SearchIsland"/);
    }
  });
});
