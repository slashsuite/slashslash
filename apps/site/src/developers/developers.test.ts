import { existsSync, globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { PRODUCTS } from "#/content/products";
import { CONTACT, DEVELOPERS_HEADLINE, DEVELOPERS_TITLE, SITE_NAME } from "#/content/site";
import { STAGES } from "#/content/stages";
import { DEVELOPER_QUESTIONS } from "#/developers/questions";
import { SELF_HOST } from "#/developers/self-host";
import { TODAY } from "#/developers/today";
import { SECTIONS } from "#/shell/sections";

/*
 * /developers as the site builds it, read from dist (`bunx moon run site:test` builds first): on the
 * shell in the suite's section, in the page's order: intro, try any product today, self-hosting in one
 * container, every product in detail, and the ask, with a copy button on every command block.
 */

const DIST = resolve(import.meta.dirname, "../../dist");
const HERE = import.meta.dirname;

function read(file: string): string {
  const path = resolve(DIST, file);
  if (!existsSync(path)) throw new Error(`No built page at ${path}. Run the build first: bunx moon run site:build.`);
  return readFileSync(path, "utf8");
}

/** Visible text: tags and scripts dropped, the escapes React and Astro write undone, spaces folded. */
function text(html: string): string {
  return html
    .replace(/<(script|style|template)[\s\S]*?<\/\1>/g, " ")
    .replace(/<\/?(a|code|span)\b[^>]*>/g, "")
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

const html = read("developers.html");
const words = text(html);
const between = (from: string, to: string): string => html.slice(html.indexOf(from), html.indexOf(to));

describe("/developers", () => {
  test("sits on the shell in the suite's section", () => {
    const classes = html.match(/<html[^>]*\sclass="([^"]*)"/)?.[1]?.split(/\s+/) ?? [];
    expect(classes).toContain(SECTIONS.suite.day);
  });

  test("keeps its own title and links the brand back to the suite home", () => {
    expect(text(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "")).toBe(`${DEVELOPERS_TITLE} | ${SITE_NAME}`);
    expect(html).toMatch(/<a [^>]*href="\/"/);
  });

  test("opens on one h1, the developers headline, and points to /how-it-works", () => {
    const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1] ?? ""));
    expect(h1s).toEqual([DEVELOPERS_HEADLINE]);
    expect(html).toMatch(/<h1[^>]*id="for-developers"/);
    expect(html).toContain('href="/how-it-works"');
  });

  test("has no @@ label", () => {
    expect(words).not.toContain("@@");
  });

  test("keeps the page's order", () => {
    const ids = ["for-developers", "try-today", "self-host", "tools-detail", "ask"];
    const at = ids.map((id) => html.indexOf(`id="${id}"`));
    for (const [i, place] of at.entries()) expect(place, ids[i]).toBeGreaterThan(-1);
    expect(at).toEqual(at.toSorted((a, b) => a - b));
  });

  test("renders try-today commands for every alpha product, the self-host section, and every developer question", () => {
    expect(words).toContain("npx @slashsuite/pixelslash --live-png main.png --local-png branch.png --out out");
    expect(words).toContain("bun add @slashsuite/ui-react @slashsuite/themes");
    expect(words).toContain("ghcr.io/slashsuite/slashslash:latest");
    expect(words).toContain("self-host/proxmox/install.sh");
    expect(words).toContain("oci://ghcr.io/slashsuite/charts");
    for (const entry of TODAY.entries) {
      expect(words, entry.id).toContain(entry.title);
      expect(words, entry.id).toContain(entry.note.text);
    }
    for (const detail of SELF_HOST.details) {
      expect(words, detail.text).toContain(detail.text.replaceAll("`", ""));
    }
    for (const question of DEVELOPER_QUESTIONS) expect(words).toContain(question);
    expect(words).toContain(CONTACT.lead.trim());
    expect(words).toContain(CONTACT.link);
    expect(html).toContain(`href="${CONTACT.href}"`);
  });

  test("gives every product a card with every paragraph of its summary", () => {
    const tools = between('id="tools-detail"', 'id="ask"');
    const cards = tools.split("<article").slice(1);
    expect(cards).toHaveLength(PRODUCTS.length);
    for (const [i, product] of PRODUCTS.entries()) {
      const card = text(cards[i] ?? "");
      expect(card).toContain(product.name);
      expect(card).toContain(product.question.text);
      for (const paragraph of product.summary) expect(card).toContain(paragraph.text.replaceAll("`", ""));
      // The stage's label beside the name and its sentence, in this product's own card.
      expect(cards[i], product.name).toMatch(new RegExp(`data-status-for="${product.name}"[\\s\\S]*?${STAGES[product.stage].label}<`));
      expect(card).toContain(STAGES[product.stage].sentence);
    }
  });

  test("has no tabs", () => {
    expect(html).not.toMatch(/role="tab/);
  });

  test("puts a copy button on every command block, and hydrates only Today and SelfHost", () => {
    const main = html.slice(html.indexOf("<main"));
    const blocks = main
      .split("<figure")
      .slice(1)
      .map((chunk) => chunk.slice(0, chunk.indexOf("</figure>")));
    expect(blocks).toHaveLength(TODAY.entries.length + 1);
    for (const block of blocks) expect(block).toMatch(/<button[^>]*aria-label="Copy"/);
    const islands = [...html.matchAll(/<astro-island[^>]*component-export="([^"]+)"[^>]*>/g)];
    expect(islands.map((m) => m[1])).toEqual(["Today", "SelfHost"]);
    for (const island of islands) expect(island[0]).toContain('client="visible"');
  });

  test("names no count of tools or questions", () => {
    expect(words).not.toMatch(/\b(two|three|four|five|six|\d+)\s+(slash\s+)?(tools|questions)\b/i);
  });

  test("names TaskSlash and UISlash, with each card linking its page", () => {
    const tools = between('id="tools-detail"', 'id="ask"');
    const taskCard = tools.split("<article").find((chunk) => text(chunk).includes("TaskSlash"));
    expect(taskCard, "no TaskSlash card").toBeDefined();
    expect(taskCard).toContain('href="/taskslash"');
    const uiCard = tools.split("<article").find((chunk) => text(chunk).includes("UISlash"));
    expect(uiCard, "no UISlash card").toBeDefined();
    expect(uiCard).toContain('href="/uislash"');
  });
});

describe("the /developers sources", () => {
  const files = globSync("*.{ts,tsx}", { cwd: HERE }).filter((file) => !file.endsWith(".test.ts"));

  test("hold no hex colour", () => {
    expect(files.length).toBeGreaterThan(0);
    expect(files.filter((file) => /#[0-9a-f]{3,8}\b/i.test(readFileSync(resolve(HERE, file), "utf8")))).toEqual([]);
  });
});
