import { expect, type Locator, test } from "@playwright/test";
import { open } from "./ready.ts";

/*
 * The PixelSlash pages leave no dead space at 1440 wide, in both themes: every row of a card grid
 * reaches the grid's end (no card alone at half or a third of the width, no row two thirds full),
 * the cards in one row end level, no docs group card sits near empty beside a full one, and no
 * section leaves its right half empty. Where things sit is what the ticket asks of these pages,
 * so this measures boxes; how they look stays the visual check's.
 */

const THEMES = ["light", "dark"] as const;

/** Each page's card grid, and how to find the card in each of its cells. */
const GRIDS = [
  { path: "/pixelslash", grid: "[data-testid=feature-grid]", card: ":scope > *" },
  { path: "/pixelslash/pricing", grid: "[data-testid=pricing-facts]", card: ":scope > *" },
  // Each docs group is its heading over its card; the card alone is measured.
  { path: "/pixelslash/docs", grid: "[data-testid=docs-index]", card: "[data-testid=docs-group-card]" },
] as const;

/** The regions whose content must reach past their middle: each landing section, and the pricing hero. */
const REGIONS = [
  { path: "/pixelslash", region: "main section" },
  { path: "/pixelslash/pricing", region: "[data-testid=pricing-hero]" },
] as const;

/** What fills a region: its words, code, pictures and controls. */
const CONTENT = ":is(p, h2, h3, pre, img, svg, a, button)";

/** Tolerance in CSS pixels. */
const SLACK = 2;

/** The least share of a docs group card's height its links fill when it shares a row. */
const FILLED = 0.5;

type Box = { x: number; y: number; width: number; height: number };

async function box(locator: Locator): Promise<Box> {
  // oxlint-disable-next-line no-restricted-properties -- where the cards and columns sit is the behaviour this ticket asks of these pages; how they look stays the visual check's
  const found = await locator.boundingBox();
  expect(found).not.toBeNull();
  return found ?? { x: 0, y: 0, width: 0, height: 0 };
}

/** Every box `locator` finds, in document order. */
const boxes = async (locator: Locator): Promise<Box[]> => Promise.all((await locator.all()).map(box));

/** Indexes of the cards grouped into rows by their top edge. */
function rows(cards: Box[]): number[][] {
  const out: number[][] = [];
  cards.forEach((card, index) => {
    const row = out.find((r) => Math.abs((cards[r[0] ?? 0]?.y ?? Number.NaN) - card.y) <= SLACK);
    row?.push(index);
    if (row === undefined) out.push([index]);
  });
  return out;
}

const right = (b: Box): number => b.x + b.width;
const bottom = (b: Box): number => b.y + b.height;

test.use({ viewport: { width: 1440, height: 900 } });

for (const theme of THEMES) {
  test.describe(theme, () => {
    test.beforeEach(async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
    });

    for (const { path, grid, card } of GRIDS) {
      test(`every row of the cards on ${path} fills the grid and ends level`, async ({ page }) => {
        await open(page, path);
        const whole = await box(page.locator(grid));
        const cards = await boxes(page.locator(grid).locator(card));
        expect(cards.length).toBeGreaterThan(1);
        for (const row of rows(cards).map((r) => r.map((i) => cards[i] ?? whole))) {
          expect(Math.abs(Math.min(...row.map((c) => c.x)) - whole.x)).toBeLessThanOrEqual(SLACK);
          expect(right(whole) - Math.max(...row.map(right))).toBeLessThanOrEqual(SLACK);
          expect(Math.max(...row.map(bottom)) - Math.min(...row.map(bottom))).toBeLessThanOrEqual(SLACK);
        }
      });
    }

    test("no docs group card sits near empty beside a full one", async ({ page }) => {
      await open(page, "/pixelslash/docs");
      // A group's card and its links have no role that tells them from the docs nav's; their test ids name them.
      const cells = page.getByTestId("docs-group-card");
      const cards = await boxes(cells);
      const shared = rows(cards).filter((row) => row.length > 1).flat();
      expect(shared.length).toBeGreaterThan(1);
      for (const index of shared) {
        const card = cards[index] ?? { x: 0, y: 0, width: 0, height: 1 };
        const last = await box(cells.nth(index).getByTestId("docs-index-link").last());
        expect(bottom(last) - card.y).toBeGreaterThanOrEqual(FILLED * card.height);
      }
    });

    for (const { path, region } of REGIONS) {
      test(`no section on ${path} leaves its right half empty`, async ({ page }) => {
        await open(page, path);
        const regions = await page.locator(region).all();
        expect(regions.length).toBeGreaterThan(0);
        for (const found of regions) {
          const whole = await box(found);
          const reach = Math.max(...(await boxes(found.locator(CONTENT))).map(right));
          expect(reach).toBeGreaterThan(whole.x + whole.width / 2);
        }
      });
    }
  });
}
