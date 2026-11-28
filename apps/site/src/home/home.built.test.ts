import { existsSync, globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { PRODUCTS } from "#/content/products";
import { CONTACT } from "#/content/site";
import { STAGES } from "#/content/stages";
import { HERO, PIPELINE, STANDS, VIEW, VIEW_QUESTIONS } from "#/content/story";
import { TOOL_CARDS } from "#/home/tools";
import { HERO_STRIP_LABEL } from "#/illustrations/hero";
import { isSectionKey, SECTIONS } from "#/shell/sections";

/*
 * The suite home as the site builds it, read from dist (`bunx moon run site:test` builds first):
 * on the shell in the suite's section, the hero from the story module with its two calls to action and
 * the five-stage pipeline strip, then the pipeline: its steps in order, a row per tool under the step
 * it runs at with what it does and its release stage, and no count of tools anywhere. Then where it
 * stands and the ask at #your-view, and every drawing finished before any script.
 */

const DIST = resolve(import.meta.dirname, "../../dist");
const SRC = resolve(import.meta.dirname, "..");

function read(file: string): string {
  const path = resolve(DIST, file);
  if (!existsSync(path)) throw new Error(`No built page at ${path}. Run the build first: bunx moon run site:build.`);
  return readFileSync(path, "utf8");
}

/** Visible text: tags and scripts dropped, the escapes React and Astro write undone, spaces folded. */
function text(html: string): string {
  return html
    .replace(/<(script|style|template)[\s\S]*?<\/\1>/g, " ")
    // Inline links and code sit inside sentences, so neither opening nor closing tags add spaces.
    .replace(/<\/?(a|code)\b[^>]*>/g, "")
    .replace(/<\/(span|strong|em)>/g, "")
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

const html = read("index.html");
const hero = html.slice(html.indexOf('class="hero-ground"'), html.indexOf('data-home-section="tools"'));

/** Each tool row's HTML, by the tool it names, in page order: from the pipeline to the first section after it. */
const pipeline = html.slice(html.indexOf('data-home-section="tools"'), html.indexOf('data-home-section="stands"'));
const cards = pipeline
  .split('data-tool="')
  .slice(1)
  .map((chunk) => ({ name: chunk.slice(0, chunk.indexOf('"')), html: chunk }));

describe("/", () => {
  test("sits on the shell in the suite's section", () => {
    const classes = html.match(/<html[^>]*\sclass="([^"]*)"/)?.[1]?.split(/\s+/) ?? [];
    expect(classes).toContain(SECTIONS.suite.day);
  });

  test("has exactly one h1, the story's hero title", () => {
    const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1] ?? ""));
    expect(h1s).toEqual([HERO.title.text]);
    expect(text(hero)).toContain(HERO.lead.text);
  });

  test("has no @@ label in the hero", () => {
    expect(hero).not.toContain("@@");
  });

  test("the hero draws the five-stage pipeline strip in order with every product mark", () => {
    const strip = hero.slice(hero.indexOf('data-testid="hero-pipeline"'));
    const label = strip.match(/aria-label="([^"]*)"/)?.[1];
    expect(label && text(label)).toBe(HERO_STRIP_LABEL);
    const stages = [...strip.matchAll(/class="pipeline-stage-name">([\s\S]*?)<\/span>/g)].map((m) => text(m[1] ?? ""));
    expect(stages).toEqual(PIPELINE.stages.map((stage) => stage.name));
    for (const product of PRODUCTS) {
      expect(strip, product.name).toContain(`/brand/${product.name.toLowerCase()}-mark.svg`);
      expect(text(strip), product.name).toContain(product.name);
    }
  });

  test("the hero links to /how-it-works and #tools", () => {
    const hrefs = [...hero.matchAll(/<a[^>]*href="([^"]*)"/g)].map((m) => m[1]);
    expect(hrefs).toEqual(["/how-it-works", "#tools"]);
  });

  test("has a row per tool at each step it runs at, each with what it does there and its release stage", () => {
    const placed = PIPELINE.stages.flatMap((stage) => stage.tools);
    expect(cards.map((card) => card.name)).toEqual(placed.map((row) => row.tool));
    cards.forEach((card, index) => {
      const words = text(`<x ${card.html}`);
      const tool = TOOL_CARDS.find((item) => item.name === card.name);
      const stage = PRODUCTS.find((product) => product.name === card.name)?.stage ?? "planned";
      expect(tool, card.name).toBeDefined();
      expect(words, card.name).toContain(card.name);
      expect(words, card.name).toContain(placed[index]?.does.text);
      expect(words, card.name).toContain(STAGES[stage].label);
      const mark = `/brand/${card.name.toLowerCase()}-mark.svg`;
      expect(card.html, card.name).toContain(`src="${mark}"`);
      expect(existsSync(resolve(DIST, mark.slice(1))), `${mark} is built`).toBe(true);
    });
  });

  test("shows the steps Planned, Written, Built and tested, Reviewed, Released, then the Next line", () => {
    const steps = rows(pipeline, "data-step");
    expect(steps.map((step) => step.name)).toEqual(["Planned", "Written", "Built and tested", "Reviewed", "Released"]);
    const omni = steps.filter((step) => rows(step.html, "data-tool").some((row) => row.name === "OmniSlash"));
    expect(omni.map((step) => step.name)).toEqual(["Planned", "Written", "Reviewed"]);
    expect(text(pipeline).indexOf(PIPELINE.next.text)).toBeGreaterThan(text(pipeline).indexOf("Released"));
  });

  test("has one tool card per tool, OmniSlash's included", () => {
    const names = TOOL_CARDS.map((card) => card.name);
    expect(new Set(names).size).toBe(names.length);
    expect(names.filter((name) => name === "OmniSlash")).toHaveLength(1);
  });

  test("shows the pipeline steps in order, each with its words, and each tool under the step it runs at", () => {
    const steps = rows(pipeline, "data-step");
    expect(steps.map((step) => step.name)).toEqual(PIPELINE.stages.map((stage) => stage.name));
    PIPELINE.stages.forEach((stage, index) => {
      const chunk = steps[index]?.html ?? "";
      expect(text(`<x ${chunk}`)).toContain(stage.text.text);
      expect(rows(chunk, "data-tool").map((row) => row.name)).toEqual(stage.tools.map((row) => row.tool));
    });
    expect(text(pipeline)).toContain(PIPELINE.lead);
    expect(text(pipeline)).toContain(PIPELINE.next.text);
  });

  test("a card links exactly when its tool has a page here", () => {
    for (const card of cards) {
      const key = card.name.toLowerCase();
      const hrefs = [...card.html.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
      expect(hrefs, card.name).toEqual(isSectionKey(key) ? [SECTIONS[key].home] : []);
      for (const href of hrefs) expect(existsSync(resolve(DIST, `${(href ?? "").slice(1)}.html`)), card.name).toBe(true);
    }
  });

  test("names TaskSlash, with a card that links its page", () => {
    const card = cards.find((item) => item.name === "TaskSlash");
    expect(card, "no TaskSlash card").toBeDefined();
    expect(card?.html).toContain('href="/taskslash"');
    expect(card?.html).toContain('src="/brand/taskslash-mark.svg"');
  });

  test("counts no tools and no questions", () => {
    expect(text(html)).not.toMatch(/\b(two|three|four|five|six|\d+)\s+(slash\s+)?(tools|questions)\b/i);
  });

  test("hydrates only the motion island", () => {
    const islands = [...html.matchAll(/<astro-island[^>]*component-export="([^"]*)"[^>]*client="([^"]*)"/g)].map(
      (m) => `${m[1]}:${m[2]}`,
    );
    expect(islands).toEqual(["Motion:load"]);
  });
});

describe("the home's own sources", () => {
  test("hold no hex colour", () => {
    const files = globSync("{illustrations,home}/**/*.{ts,tsx,css}", { cwd: SRC });
    expect(files).toContain("illustrations/hero.css");
    const hits = files.filter((file) => /#[0-9a-f]{3,8}\b/i.test(readFileSync(resolve(SRC, file), "utf8")));
    expect(hits).toEqual([]);
  });
});

/** Every string in a story constant, however deep. */
function strings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  // A claim's fact ids and repository paths are citations, and a link's href an address, not words on the page.
  if (value !== null && typeof value === "object")
    return Object.entries(value).flatMap(([key, item]) =>
      key === "facts" || key === "repo" || key === "external" ? [] : strings(item),
    );
  return [];
}

/** The HTML of the section an h2 with this id opens, up to the next home section. */
function section(id: string): string {
  const start = html.indexOf(`data-home-section="${id}"`);
  expect(start, id).toBeGreaterThan(-1);
  const next = html.indexOf("data-home-section=", start + 1);
  return html.slice(start, next === -1 ? undefined : next);
}

/** Each element carrying `attr`, by its value, in page order, with the HTML up to the next one. */
function rows(chunk: string, attr: string): { name: string; html: string }[] {
  return chunk
    .split(`${attr}="`)
    .slice(1)
    .map((part) => ({ name: part.slice(0, part.indexOf('"')), html: part }));
}

/** Rich text as the page shows it: `code` without its backticks, [words](href) as its words. */
const plain = (line: string): string => line.replaceAll("`", "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

const afterTools = html.slice(html.indexOf('data-home-section="tools"'));
const TITLES = [PIPELINE.title, STANDS.title, VIEW.title];

describe("the home from the pipeline on", () => {
  test("opens each section with its title as an h2, in the story's order", () => {
    const h2s = [...afterTools.matchAll(/<h2[^>]*\sid="[^"]*"[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => text(m[1] ?? ""));
    expect(h2s).toEqual(TITLES);
  });

  test("carries every string of the story's sections", () => {
    const words = text(afterTools);
    for (const line of strings([STANDS, VIEW_QUESTIONS])) expect(words, line).toContain(plain(line));
  });

  test("has no @@ label", () => {
    expect(afterTools).not.toContain("@@");
  });

  test("links UISlash docs and llms.txt, FlakeSlash dashboard, PixelSlash hosted app, and /developers#self-host, and shows no report screenshot", () => {
    const stands = section("stands");
    const links = [...stands.matchAll(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({
      text: text(m[2] ?? ""),
      href: m[1],
    }));
    expect(links).toEqual([
      { text: "the component docs", href: "/uislash" },
      { text: "/uislash/llms.txt", href: "/uislash/llms.txt" },
      { text: "flakeslash.slashslash.build", href: "https://flakeslash.slashslash.build" },
      { text: "pixelslash.dev", href: "https://pixelslash.dev" },
      { text: "See self-hosting details", href: "/developers#self-host" },
    ]);
    const items = [...(stands.match(/data-stands-start[^>]*>([\s\S]*?)<\/ul>/)?.[1] ?? "").matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)];
    expect(items).toHaveLength(6);
    expect(stands).toContain("<code>@slashsuite/ui-react</code>");
    expect(html).not.toContain("report.png");
  });

  test("puts the ask at #your-view: the questions in order as a numbered list, and the contact line", () => {
    expect([...html.matchAll(/id="your-view"/g)]).toHaveLength(1);
    const ask = section("your-view");
    expect(ask).toContain('id="your-view"');
    const list = ask.match(/<ol[^>]*>([\s\S]*?)<\/ol>/)?.[1] ?? "";
    const items = [...list.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => text(m[1] ?? ""));
    expect(items).toEqual([...VIEW_QUESTIONS]);
    expect(text(ask)).toContain(CONTACT.lead.trim());
    expect(text(ask)).toContain(CONTACT.link);
    expect(ask).toContain(`href="${CONTACT.href}"`);
  });

  test("with no JavaScript every drawing is finished: nothing is held in a start frame", () => {
    // The start frame is only ever drawn under `.motion`, which only the head script sets, so a page
    // with no script shows every drawing's base style: the finished drawing.
    // The flags grid on /developers has no start frame: it only replays while lit, from its finished style.
    const still = new Set(["illustrations/combinations.css"]);
    const files = globSync("illustrations/*.css", { cwd: SRC }).filter((file) => !still.has(file));
    expect(files).toContain("illustrations/hero.css");
    for (const file of files) {
      const css = readFileSync(resolve(SRC, file), "utf8");
      const starts = [...css.matchAll(/[^{}]*:not\(\.played\)[^{}]*\{/g)].flatMap((m) =>
        m[0].replace(/\/\*[\s\S]*?\*\//g, "").replace("{", "").split(",").map((part) => part.trim()),
      );
      expect(starts.length, file).toBeGreaterThan(0);
      for (const selector of starts.filter((part) => part.includes(":not(.played)"))) {
        expect(selector, file).toMatch(/^\.motion /);
      }
    }
  });
});
