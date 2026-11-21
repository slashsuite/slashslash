import { existsSync, globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { licenceOf } from "#/content/facts";
import { PRODUCTS } from "#/content/products";
import { HERO } from "#/content/story";
import { renderToStaticMarkup } from "react-dom/server";
import { SECTIONS, markFor } from "#/shell/sections";
import { SlashShell } from "#/shell/SlashShell";

// The shell as it is built: the 404 page's header, switcher and footer, and the stylesheet that
// defines every section's scopes.

const DIST = resolve(import.meta.dirname, "../../dist");

function built(file: string): string {
  const path = resolve(DIST, file);
  if (!existsSync(path)) throw new Error(`No ${file} in ${DIST}. Run "bunx moon run site:build" first.`);
  return readFileSync(path, "utf8");
}

/** Every element of `tag` in `html`, outermost only, with its contents. */
const elements = (html: string, tag: string): string[] =>
  [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?</${tag}>`, "g"))].map((m) => m[0]);

/** The text of an HTML fragment, tags dropped and whitespace collapsed. */
const text = (html: string): string => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

/** Every link in `html` as its href and its text. */
const links = (html: string): { href: string; text: string }[] =>
  [...html.matchAll(/<a\b[^>]*\bhref="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map((m) => ({
    href: m[1] ?? "",
    text: text(m[2] ?? ""),
  }));

const notFound = (): string => built("404.html");

describe("the shell on the 404 page", () => {
  test("<html> is built in the suite's light scope", () => {
    expect(notFound().match(/<html[^>]*class="([^"]*)"/)?.[1]?.split(/\s+/)).toContain(SECTIONS.suite.day);
  });

  test("one header, whose suite lockup links home", () => {
    const headers = elements(notFound(), "header");
    expect(headers).toHaveLength(1);
    expect(links(headers[0] ?? "")[0]).toEqual({ href: "/", text: SECTIONS.suite.name });
  });

  test("the switcher, named Tools, links each tool's home and no other", () => {
    const nav = elements(notFound(), "nav").find((n) => /aria-label="Tools"/.test(n));
    expect(nav, "no nav named Tools").toBeDefined();
    expect(links(nav ?? "")).toEqual([
      { href: "/pixelslash", text: "PixelSlash" },
      { href: "/flakeslash", text: "FlakeSlash" },
      { href: "/toggleslash", text: "ToggleSlash" },
      { href: "/taskslash", text: "TaskSlash" },
      { href: "/omnislash", text: "OmniSlash" },
      { href: "/uislash", text: "UISlash" },
    ]);
  });

  test("the footer names each tool's own licence in its facts file's words: TaskSlash and UISlash are MIT, the others Elastic License 2.0", () => {
    const footer = elements(notFound(), "footer")[0] ?? "";
    const licences = [...footer.matchAll(/data-licence="[^"]*">([\s\S]*?)<\/span>/g)].map((m) => text(m[1] ?? ""));
    expect(licences).toEqual([
      `${licenceOf("pixelslash")}: PixelSlash, ToggleSlash, FlakeSlash`,
      `${licenceOf("taskslash")}: TaskSlash, UISlash`,
      `${licenceOf("omnislash")}: OmniSlash`,
    ]);
  });

  test("the footer line is the home's headline", () => {
    const footer = (elements(notFound(), "footer")[0] ?? "").replace(/<!--.*?-->/g, "");
    expect(text(footer)).toContain(HERO.title.text);
  });

  test("the footer names every product", () => {
    const footers = elements(notFound(), "footer");
    expect(footers).toHaveLength(1);
    const words = text(footers[0] ?? "");
    for (const product of PRODUCTS) expect(words).toContain(product.name);
  });

  test("only a planned tool carries the Planned caption: every built tool links its page here", () => {
    const footer = elements(notFound(), "footer")[0] ?? "";
    const caption = (name: string): boolean => new RegExp(`${name}\\s*Planned`).test(text(footer));
    for (const product of PRODUCTS) expect(caption(product.name), product.name).toBe(product.stage === "planned");
    expect(links(footer)).toContainEqual({ href: "/uislash", text: "UISlash" });
    expect(footer).toContain(`src="${markFor("UISlash")}"`);
  });

  test("the head script names the suite's dark scope", () => {
    const head = notFound().match(/<head>[\s\S]*<\/head>/)?.[0] ?? "";
    const scripts = elements(head, "script").join("");
    expect(scripts).toContain(SECTIONS.suite.night);
  });
});

describe("the stylesheet", () => {
  test("every built page links exactly one stylesheet, the same file", () => {
    const pages = globSync("**/*.html", { cwd: DIST }).toSorted();
    expect(pages.length).toBeGreaterThan(0);
    const sheets = pages.map((page) => {
      const tags = built(page).match(/<link\b[^>]*\brel="stylesheet"[^>]*>/g) ?? [];
      return { page, hrefs: tags.map((tag) => tag.match(/\bhref="([^"]+)"/)?.[1]) };
    });
    const first = sheets[0]?.hrefs;
    expect(first).toHaveLength(1);
    for (const { page, hrefs } of sheets) expect(hrefs, page).toEqual(first);
  });

  test("defines every section's day and night scope", () => {
    const css = globSync("_astro/*.css", { cwd: DIST })
      .map((file) => readFileSync(resolve(DIST, file), "utf8"))
      .join("\n");
    expect(css.length).toBeGreaterThan(0);
    const missing = Object.entries(SECTIONS)
      .flatMap(([key, s]) => [`${key} ${s.day}`, `${key} ${s.night}`])
      .filter((entry) => !new RegExp(`\\.${entry.split(" ")[1]}(?![\\w-])`).test(css));
    expect(missing).toEqual([]);
  });

  test("every mark a section or the footer names is in public/brand", () => {
    const marks = [...Object.values(SECTIONS).map((s) => s.mark), ...PRODUCTS.map((p) => markFor(p.name))];
    expect(marks.filter((mark) => !existsSync(resolve(import.meta.dirname, "../../public", mark.slice(1))))).toEqual([]);
  });
});

describe("the shell on a tool's page", () => {
  // The shell rendered here as a tool page renders it, so the test reads one page's markup alone.
  const html = renderToStaticMarkup(
    <SlashShell section="pixelslash" path="/pixelslash/pricing">
      <p>page</p>
    </SlashShell>,
  );
  const current = (label: string): string[] =>
    elements(html, "nav")
      .filter((nav) => nav.includes(`aria-label="${label}"`))
      .flatMap((nav) => links(nav.replace(/<a\b(?![^>]*aria-current="page")[^>]*>[\s\S]*?<\/a>/g, "")))
      .map((link) => link.href);

  test("the tool's tab is current in the switcher", () => {
    expect(new Set(current("Tools"))).toEqual(new Set([SECTIONS.pixelslash.home]));
  });

  test("the page's entry is current in the tool's own row", () => {
    expect(new Set(current(SECTIONS.pixelslash.name))).toEqual(new Set(["/pixelslash/pricing"]));
  });
});
