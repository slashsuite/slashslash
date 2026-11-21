import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, test } from "vitest";

// The brand the suite pages wear: logo direction C (glyph and cut), in Slash Day and Slash Night.
// The files come from design/logos (`gen.py`); this checks the built copies in dist/brand.

const DIST = resolve(import.meta.dirname, "../../dist");

/** Each tool's slug (its file names) and its text tone on light, its pastel on dark (the colours in gen.py's ACCENT). */
const TOOLS: Record<string, { deep: string; text: string; pastel: string }> = {
  slash: { deep: "#c94f08", text: "#a03604", pastel: "#fab387" },
  pixelslash: { deep: "#8839ef", text: "#8839ef", pastel: "#cba6f7" },
  flakeslash: { deep: "#0a7ea8", text: "#086c90", pastel: "#89dceb" },
  toggleslash: { deep: "#2d7d1d", text: "#286f1a", pastel: "#a6e3a1" },
  bundleslash: { deep: "#9a5b00", text: "#9a5b00", pastel: "#f9e2af" },
  taskslash: { deep: "#1e66f5", text: "#1a5fe6", pastel: "#89b4fa" },
  sightslash: { deep: "#c8399a", text: "#b8338a", pastel: "#f5c2e7" },
  uislash: { deep: "#13838a", text: "#0e777c", pastel: "#94e2d5" },
  omnislash: { deep: "#7287fd", text: "#3d5afc", pastel: "#b4befe" },
};
const INK_LIGHT = "#24273a";
const INK_DARK = "#e2e8fc";
const MUTE_LIGHT = "#5c5f77";
const MUTE_DARK = "#c6cce2";
// The ticket's canvases, and the site's own (--bg in styles.css): the light lockup must read on both.
const CANVAS_LIGHT = "#eef2f9";
const SITE_LIGHT = "#eff1f5";
const PAPER = "#ffffff";
const CANVAS_DARK = "#0d1326";
const SITE_DARK = "#11111b";

type Colour = [number, number, number];

function rgb(hex: string): Colour {
  const m = hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
  if (!m) throw new Error(`Not a hex colour: ${hex}`);
  return [Number.parseInt(m[1] ?? "", 16), Number.parseInt(m[2] ?? "", 16), Number.parseInt(m[3] ?? "", 16)];
}

function luminance(hex: string): number {
  const [r, g, b] = rgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

/** WCAG contrast ratio between two hex colours. */
function contrast(one: string, two: string): number {
  const [a, b] = [luminance(one), luminance(two)];
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** The fill a class is given in an SVG's own <style> block (the first rule for it, in the solid part). */
function fillOf(svg: string, cls: string): string {
  const style = svg.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? "";
  const solid = style.replace(/@media\(prefers-color-scheme:dark\)\{[\s\S]*\}$/, "");
  const m = solid.match(new RegExp(`\\.${cls}\\{fill:(#[0-9a-f]{6})\\}`, "i"));
  if (!m) throw new Error(`No .${cls} fill in the style block`);
  return (m[1] ?? "").toLowerCase();
}

/** The fill a class takes inside the prefers-color-scheme: dark block of an SVG's style. */
function darkFillOf(svg: string, cls: string): string {
  const dark = svg.slice(svg.indexOf("@media(prefers-color-scheme:dark)"), svg.indexOf("</style>"));
  const m = dark.match(new RegExp(`\\.${cls}\\{fill:(#[0-9a-f]{6})\\}`, "i"));
  if (!m) throw new Error(`No .${cls} fill in the dark block`);
  return (m[1] ?? "").toLowerCase();
}

function read(file: string): string {
  const path = join(DIST, file);
  if (!existsSync(path)) throw new Error(`No built file at ${path}. Run "bun run build" first.`);
  return readFileSync(path, "utf8");
}

/** Every text file under dist/, the PixelSlash pages and their fetched files included. */
function textFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      textFiles(path, out);
    } else if (/\.(html|css|js|mjs|xml|json|txt|svg|webmanifest)$/.test(name)) {
      out.push(path);
    }
  }
  return out;
}

describe("the brand files in dist/brand", () => {
  test("all 27 direction C files are there: nine marks and eighteen lockups", () => {
    const names = Object.keys(TOOLS).flatMap((slug) => [
      `${slug}-mark.svg`,
      `${slug}-lockup-light.svg`,
      `${slug}-lockup-dark.svg`,
    ]);
    expect(names).toHaveLength(27);
    for (const name of names) expect(existsSync(join(DIST, "brand", name)), name).toBe(true);
  });

  test("each mark draws in its deep fill on light and its pastel on dark", () => {
    for (const [slug, tone] of Object.entries(TOOLS)) {
      const svg = read(`brand/${slug}-mark.svg`);
      expect(fillOf(svg, "a"), slug).toBe(tone.deep);
      expect(darkFillOf(svg, "a"), slug).toBe(tone.pastel);
    }
  });

  test("each light lockup has its tool's text tone and the light ink", () => {
    for (const [slug, tone] of Object.entries(TOOLS)) {
      const svg = read(`brand/${slug}-lockup-light.svg`);
      expect(fillOf(svg, "t"), slug).toBe(tone.text);
      expect(fillOf(svg, "a"), slug).toBe(tone.deep);
      expect(fillOf(svg, "i"), slug).toBe(INK_LIGHT);
    }
    expect(fillOf(read("brand/slash-lockup-light.svg"), "m")).toBe(MUTE_LIGHT);
  });

  test("each dark lockup has its tool's pastel and the dark ink", () => {
    for (const [slug, tone] of Object.entries(TOOLS)) {
      const svg = read(`brand/${slug}-lockup-dark.svg`);
      expect(fillOf(svg, "t"), slug).toBe(tone.pastel);
      expect(fillOf(svg, "a"), slug).toBe(tone.pastel);
      expect(fillOf(svg, "i"), slug).toBe(INK_DARK);
    }
    expect(fillOf(read("brand/slash-lockup-dark.svg"), "m")).toBe(MUTE_DARK);
  });

  test("the light text tones and the light mute measure at least 4.5:1 on the canvas and on white", () => {
    for (const [slug, tone] of Object.entries(TOOLS)) {
      for (const bg of [CANVAS_LIGHT, SITE_LIGHT, PAPER]) {
        expect(contrast(tone.text, bg), `${slug} on ${bg}`).toBeGreaterThanOrEqual(4.5);
      }
    }
    for (const bg of [CANVAS_LIGHT, SITE_LIGHT, PAPER]) {
      expect(contrast(MUTE_LIGHT, bg), `mute on ${bg}`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(INK_LIGHT, bg), `ink on ${bg}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  test("the dark pastels, the dark ink and the dark mute measure at least 4.5:1 on Slash Night", () => {
    for (const [slug, tone] of Object.entries(TOOLS)) {
      for (const bg of [CANVAS_DARK, SITE_DARK]) {
        expect(contrast(tone.pastel, bg), `${slug} on ${bg}`).toBeGreaterThanOrEqual(4.5);
      }
    }
    for (const bg of [CANVAS_DARK, SITE_DARK]) {
      expect(contrast(INK_DARK, bg), `ink on ${bg}`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(MUTE_DARK, bg), `mute on ${bg}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

const iconOf = (html: string): string | undefined => {
  const link = html.match(/<link[^>]*rel="icon"[^>]*>/)?.[0] ?? "";
  return link.match(/href="([^"]+)"/)?.[1];
};

describe("the icon and the header on the built pages", () => {
  test("the suite's pages use the suite mark as the icon", () => {
    for (const page of ["index.html", "developers.html", "404.html"]) {
      expect(iconOf(read(page)), page).toBe("/brand/slash-mark.svg");
    }
  });

  test("FlakeSlash, ToggleSlash, TaskSlash, OmniSlash and UISlash use their own tool mark", () => {
    expect(iconOf(read("flakeslash.html"))).toBe("/brand/flakeslash-mark.svg");
    expect(iconOf(read("toggleslash.html"))).toBe("/brand/toggleslash-mark.svg");
    expect(iconOf(read("taskslash.html"))).toBe("/brand/taskslash-mark.svg");
    expect(iconOf(read("omnislash.html"))).toBe("/brand/omnislash-mark.svg");
    expect(iconOf(read("uislash.html"))).toBe("/brand/uislash-mark.svg");
  });

  test("no page still points at the old logo files or PixelSlash's own favicon", () => {
    // However they are referenced: relative, root, absolute or in CSS.
    const stale = /\b(favicon|logo-light|logo-dark)\.svg\b/;
    const hits = textFiles(DIST)
      .filter((file) => stale.test(readFileSync(file, "utf8")))
      .map((file) => relative(DIST, file));
    expect(hits).toEqual([]);
  });
});
