import { existsSync, globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { PAGES } from "#/content/pages";
import { PRODUCTS } from "#/content/products";
import { SITE_URL } from "#/content/site";
import { STAGE } from "#/pixelslash/content/stage";

const CLIENT = resolve(import.meta.dirname, "../../dist");
const BUILT = resolve(CLIENT, "index.html");
const SRC_PAGES = resolve(import.meta.dirname, "../pages");

/** The built file of a page address: `index.html` for `/`, `<path>.html` otherwise. */
const builtFile = (path: string): string => (path === "/" ? "index.html" : `${path.slice(1)}.html`);

function builtHtml(): string {
  if (!existsSync(BUILT))
    throw new Error(`No built page at ${BUILT}. Run the build first: bun run build.`);
  return readFileSync(BUILT, "utf8");
}

/**
 * Every built slashslash page: the home, /developers, each tool's page and the 404 page. The PixelSlash pages
 * (pixelslash/**) and UISlash component docs (uislash/**) carry each tool's own fetched copy and stories, with
 * their own checks in src/pixelslash/pages.built.test.ts and src/uislash/uislash.built.test.ts.
 */
function builtPages(): string[] {
  builtHtml();
  const pages = globSync("**/*.html", { cwd: CLIENT }).filter(
    (page) =>
      page !== "pixelslash.html" &&
      !page.startsWith("pixelslash/") &&
      page !== "uislash.html" &&
      !page.startsWith("uislash/"),
  );
  expect(pages.toSorted()).toEqual(["404.html", "developers.html", "flakeslash.html", "how-it-works.html", "index.html", "omnislash.html", "taskslash.html", "toggleslash.html"]);
  return pages.map((page) => readFileSync(resolve(CLIENT, page), "utf8"));
}

/** Visible text only: tags, scripts and styles removed, entities left as they are. */
function visibleText(html: string): string {
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}

const descriptionOf = (html: string): string | undefined => html.match(/name="description" content="([^"]*)"/)?.[1];

const canonical = (page: string): string | undefined =>
  readFileSync(resolve(CLIENT, page), "utf8").match(/<link rel="canonical" href="([^"]+)"/)?.[1];

describe("built page", () => {
  test("PixelSlash's pages take their stage from the product's stage in the shared table", () => {
    expect(STAGE).toBe(PRODUCTS.find((product) => product.name === "PixelSlash")?.stage);
  });

  test("no built page keeps the retired status words", () => {
    builtHtml();
    const pages = globSync("**/*.html", { cwd: CLIENT });
    expect(pages.length).toBeGreaterThan(0);
    for (const page of pages) {
      const html = readFileSync(resolve(CLIENT, page), "utf8");
      expect(html, `${page} should not say "Available now"`).not.toContain("Available now");
      expect(html, `${page} should not say "Works today"`).not.toContain("Works today");
      expect(html, `${page} should not say "early development"`).not.toMatch(/early development/i);
    }
  });

  // Agents and tokens were ruled out too, until the story put agents at the heart of the home (story.test.ts).
  test("keeps out the words the brief rules out, and the comparisons nobody checked", () => {
    const forbidden =
      /salary|\bclients?\b|employer|job hunt|notice period|Unleash|Flagsmith|GrowthBook|PostHog|Piranha|OpenFeature|LaunchDarkly MCP/i;
    for (const html of builtPages()) expect(visibleText(html).match(forbidden)?.[0]).toBeUndefined();
  });

  test("has no form, no email address and no phone number", () => {
    for (const html of builtPages()) {
      expect(html).not.toMatch(/<form[\s>]/);
      // Raw HTML, so a mailto: link cannot hide behind the tag stripping.
      expect(html).not.toMatch(/mailto:|[\w.+-]+@[\w-]+\.[\w.]+/);
      expect(visibleText(html)).not.toMatch(/\b0\d{9}\b|\+\d{8,}/);
    }
  });

  // The share images are og.test.ts's; the 404 page has no description, since no search engine lists it.
  test("has a title, and every page but the 404 a description", () => {
    for (const html of builtPages()) expect(html).toMatch(/<title>[^<]+<\/title>/);
    for (const { path } of PAGES) {
      expect(readFileSync(resolve(CLIENT, builtFile(path)), "utf8"), path).toMatch(/name="description" content="[^"]{40,}"/);
    }
    expect(SITE_URL).toMatch(/^https:\/\/[^/]+$/);
  });

  test("every suite page's share image is in the build at 1200x630", () => {
    builtHtml();
    for (const { path } of PAGES.filter((page) => !page.path.startsWith("/pixelslash"))) {
      const html = readFileSync(resolve(CLIENT, builtFile(path)), "utf8");
      const image = html.match(/property="og:image" content="([^"]+)"/)?.[1];
      expect(image?.startsWith(`${SITE_URL}/`), `${path} should name a share image on ${SITE_URL}`).toBe(true);
      const file = resolve(CLIENT, (image ?? "").slice(SITE_URL.length + 1));
      expect(existsSync(file), `${path}'s share image ${image} should be in dist/`).toBe(true);
      // A PNG's IHDR chunk holds its width and height as big-endian 32-bit numbers at bytes 16 and 20.
      const png = readFileSync(file);
      expect(png.subarray(1, 4).toString("latin1")).toBe("PNG");
      expect([png.readUInt32BE(16), png.readUInt32BE(20)], `${image} size`).toEqual([1200, 630]);
    }
  });

  test("every PixelSlash page names its share image at 1200x630", () => {
    for (const { path } of PAGES.filter((page) => page.path.startsWith("/pixelslash"))) {
      const html = readFileSync(resolve(CLIENT, builtFile(path)), "utf8");
      expect(html, path).toMatch(/property="og:image" content="https:\/\/[^"]+\.png"/);
      expect(html, path).toContain('property="og:image:width" content="1200"');
      expect(html, path).toContain('property="og:image:height" content="630"');
    }
  });

  test("each page has its own description", () => {
    builtPages();
    const developers = readFileSync(resolve(CLIENT, "developers.html"), "utf8");
    const landing = readFileSync(resolve(CLIENT, "index.html"), "utf8");
    expect(descriptionOf(developers)).toBeDefined();
    expect(descriptionOf(developers)).not.toBe(descriptionOf(landing));
  });
});

describe("is open to search engines", () => {
  test("robots.txt allows every crawler and names the sitemap", () => {
    expect(readFileSync(resolve(CLIENT, "robots.txt"), "utf8")).toBe(
      `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
    );
  });

  test("the page list names every .astro page under src/pages but the 404 page", () => {
    const files = globSync("**/*.astro", { cwd: SRC_PAGES }).filter((file) => file !== "404.astro");
    expect(new Set(files)).toEqual(new Set(PAGES.map((page) => page.file)));
  });

  test("the sitemap lists exactly the page list on the live site", () => {
    const sitemap = readFileSync(resolve(CLIENT, "sitemap.xml"), "utf8");
    expect([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])).toEqual(
      PAGES.map((page) => `${SITE_URL}${page.path}`),
    );
  });

  test("no page asks crawlers to stay out", () => {
    for (const html of builtPages()) expect(html).not.toMatch(/<meta[^>]*name="robots"|noindex|nofollow/i);
  });

  test("the files that set response headers carry no robots tag", () => {
    expect(readFileSync(resolve(CLIENT, "_headers"), "utf8")).not.toMatch(/robots/i);
  });

  test("each real page has its own canonical address on the live site", () => {
    expect(canonical("index.html")).toBe(`${SITE_URL}/`);
    expect(canonical("developers.html")).toBe(`${SITE_URL}/developers`);
  });
});
