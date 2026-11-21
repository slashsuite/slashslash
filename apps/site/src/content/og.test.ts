import { describe, expect, test } from "vitest";
import { HOW_IT_WORKS_HEADLINE } from "#/content/how-it-works";
import { HERO } from "#/content/story";
import { OG_CARDS, ogCardFor, wornCard } from "#/content/og";
import { PAGES } from "#/content/pages";
import { PRODUCTS } from "#/content/products";
import { STATEMENT } from "#/pixelslash/content/pricing";

const card = (path: string) => OG_CARDS.find((item) => item.path === path);

const question = (name: string) => PRODUCTS.find((product) => product.name === name)?.question.text;

describe("the share card list", () => {
  test("has exactly one card per page that wears its own, in PAGES order", () => {
    expect(OG_CARDS.map((item) => item.path)).toEqual(
      PAGES.map((page) => page.path).filter((path) => wornCard(path) === undefined),
    );
  });

  test("gives the docs pages the PixelSlash card and no card of their own", () => {
    expect(wornCard("/pixelslash/docs")).toBe("/pixelslash");
    expect(wornCard("/pixelslash/docs/upload")).toBe("/pixelslash");
    expect(wornCard("/pixelslash/docsearch")).toBeUndefined();
    expect(wornCard("/pixelslash/security")).toBe("/pixelslash");
    expect(ogCardFor("/pixelslash/docs/getting-started").slug).toBe("pixelslash");
    expect(OG_CARDS.some((item) => item.path.startsWith("/pixelslash/docs"))).toBe(false);
  });

  test("gives every UISlash component page the one shared UISlash card", () => {
    expect(wornCard("/uislash")).toBeUndefined();
    expect(wornCard("/uislash/button")).toBe("/uislash");
    expect(ogCardFor("/uislash").slug).toBe("uislash");
    expect(ogCardFor("/uislash/button")).toBe(card("/uislash"));
    expect(OG_CARDS.filter((item) => item.tool === "uislash")).toHaveLength(1);
  });

  test("gives every card a unique slug made from its path", () => {
    expect(new Set(OG_CARDS.map((item) => item.slug)).size).toBe(OG_CARDS.length);
    expect(card("/")?.slug).toBe("slashslash");
    expect(card("/pixelslash/compare")?.slug).toBe("pixelslash-compare");
    for (const item of OG_CARDS) expect(item.slug, item.path).toMatch(/^[a-z0-9-]+$/);
  });

  test("gives every card a headline and an alt that names it, with no long dashes", () => {
    for (const item of OG_CARDS) {
      expect(item.headline.trim(), item.path).not.toBe("");
      expect(item.alt, item.path).toContain(item.headline);
      expect(`${item.headline}${item.alt}`, item.path).not.toMatch(/[\u2013\u2014]/);
    }
  });

  test("takes its headlines from the content modules that hold them", () => {
    expect(card("/")?.headline).toBe(HERO.title.text);
    expect(card("/flakeslash")?.headline).toBe(question("FlakeSlash"));
    expect(card("/toggleslash")?.headline).toBe(question("ToggleSlash"));
    expect(card("/taskslash")?.headline).toBe(question("TaskSlash"));
    expect(card("/pixelslash/pricing")?.headline).toBe(STATEMENT.text);
  });

  test("gives /how-it-works the page's h1 as its headline", () => {
    expect(card("/how-it-works")).toMatchObject({ tool: "slash", headline: HOW_IT_WORKS_HEADLINE });
  });

  test("gives /omnislash the headline, its page's h1", () => {
    expect(card("/omnislash")).toMatchObject({ tool: "omnislash", headline: "From an idea to a merged change, in one tool." });
  });

  test("gives the PixelSlash security page and self-host guide the PixelSlash card", () => {
    expect(ogCardFor("/pixelslash/security")).toBe(card("/pixelslash"));
    expect(ogCardFor("/pixelslash/self-host")).toBe(card("/pixelslash"));
  });

  test("gives the 404 page the suite's card and refuses a page it does not know", () => {
    expect(ogCardFor("/404")).toBe(card("/"));
    expect(() => ogCardFor("/nowhere")).toThrow(/og\.ts/);
  });
});
