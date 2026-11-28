import { expect, type Locator, type Page, test } from "@playwright/test";
import { CARDS } from "../src/pixelslash/content/pricing.ts";
import { open } from "./ready.ts";

/*
 * PixelSlash's docs landing and pricing in a real browser, in both themes: the docs index lists are the
 * quiet ink with the accent kept to their markers, every accent on pricing resolves to one colour, and the
 * pricing cards' bodies share one ink. The rest of their look is the visual check's.
 */

const THEMES = ["light", "dark"] as const;

/** The computed text colour of every element `selector` finds. */
const colour = (page: Page, selector: string): Promise<string[]> => inks(page.locator(selector));

const inks = (locator: Locator): Promise<string[]> =>
  locator.evaluateAll((nodes) =>
    // oxlint-disable-next-line no-restricted-globals -- one resolved colour across these elements is the behaviour asked for here; the rest of their look stays the visual check's
    nodes.map((node) => getComputedStyle(node).color),
  );

/** The ink of each pricing card's body: the licence line's words, or the card's own text. */
async function cardBodies(page: Page): Promise<string[]> {
  const facts = page.getByTestId("pricing-facts");
  const bodies = CARDS.map((card) =>
    "licence" in card.body
      ? colour(page, "[data-testid=pricing-facts] [data-licence-line]")
      : inks(facts.getByText(card.body.text)),
  );
  return (await Promise.all(bodies)).flat();
}

for (const theme of THEMES) {
  test.describe(theme, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    });

    test("the docs index lists are the quiet ink, with the accent on their markers alone", async ({ page }) => {
      await open(page, "/pixelslash/docs");
      const [ink] = await colour(page, "h1");
      const links = await colour(page, "[data-testid=docs-index-link]");
      const markers = await colour(page, "[data-testid=docs-index-marker] > *");
      const nav = await colour(page, "[data-testid=docs-nav] a:not([aria-current])");
      const [current] = await colour(page, "[data-testid=docs-nav] a[aria-current=page]");
      expect(links.length).toBeGreaterThan(10);
      expect(new Set(links)).toEqual(new Set([ink]));
      expect(nav.length).toBeGreaterThan(10);
      expect(new Set(nav)).toEqual(new Set([ink]));
      // The markers and the current page are the accent, and the accent is not the ink.
      expect(new Set(markers)).toEqual(new Set([current]));
      expect(current).not.toBe(ink);
    });

    test("pricing has one accent and its card bodies share one ink", async ({ page }) => {
      await open(page, "/pixelslash/pricing");
      const links = await colour(page, "[data-testid=licence-brief] a, [data-testid=contact-line] a");
      const icons = await colour(page, "[data-testid=pricing-facts] svg");
      expect(links.length).toBeGreaterThan(0);
      expect(icons.length).toBeGreaterThan(0);
      expect(new Set([...links, ...icons]).size).toBe(1);
      // The contact line's words are a note's ink, as the licence brief's are, not a second accent.
      const [contact] = await colour(page, "[data-testid=contact-line]");
      const [brief] = await colour(page, "[data-testid=licence-brief]");
      expect(contact).toBe(brief);
      const bodies = await cardBodies(page);
      expect(bodies.length).toBeGreaterThan(1);
      expect(new Set(bodies).size).toBe(1);
    });
  });
}
