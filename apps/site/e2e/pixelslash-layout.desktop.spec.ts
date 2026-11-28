import { expect, type Locator, test } from "@playwright/test";
import { open } from "./ready.ts";

/*
 * The PixelSlash pages leave no dead space at 1440 wide, in both themes: every row of a card grid
 * reaches the grid's end (no card alone at half or a third of the width, no row two thirds full),
 * the cards in one row end level, no docs group card is near empty, and no home section's words
 * lean to its left leaving the right side bare. Where things sit is what the ticket asks of these
 * pages, so this measures boxes; how they look stays the visual check's.
 */

const THEMES = ["light", "dark"] as const;

/** Each page's card grid, and how to find the card in each of its cells. */
const GRIDS = [
  { path: "/pixelslash", grid: "[data-testid=feature-grid]", card: ":scope > *" },
  { path: "/pixelslash/pricing", grid: "[data-testid=pricing-facts]", card: ":scope > *" },
  // Each docs group is its heading over its card; the card alone is measured.
  { path: "/pixelslash/docs", grid: "[data-testid=docs-index]", card: "[data-testid=docs-group-card]" },
] as const;


/** How much wider a section's bare right side may be than its left, as a share of its width. */
const LEAN = 0.25;

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

/**
 * The left and right edges of the text a region draws, by its line boxes. A block's own box runs to
 * its parent's edge however short its text, so it says nothing here.
 */
async function ink(region: Locator): Promise<{ left: number; right: number }> {
  return region.evaluate((root) => {
    const drawn: DOMRect[] = [];
    const range = document.createRange();
    const text = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (text.nextNode()) {
      range.selectNodeContents(text.currentNode);
      drawn.push(...range.getClientRects());
    }
    const seen = drawn.filter((rect) => rect.width > 1 && rect.height > 1);
    return { left: Math.min(...seen.map((r) => r.left)), right: Math.max(...seen.map((r) => r.right)) };
  });
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

    test("no docs group card is near empty, beside a full one or across the row", async ({ page }) => {
      await open(page, "/pixelslash/docs");
      // A group's card and its links have no role that tells them from the docs nav's; their test ids name them.
      const cells = page.getByTestId("docs-group-card");
      const cards = await boxes(cells);
      const grouped = rows(cards);
      const shared = grouped.filter((row) => row.length > 1).flat();
      const alone = grouped.filter((row) => row.length === 1).flat();
      expect(shared.length).toBeGreaterThan(1);
      expect(alone.length).toBeGreaterThan(0);
      for (const index of shared) {
        const card = cards[index] ?? { x: 0, y: 0, width: 0, height: 1 };
        const last = await box(cells.nth(index).getByTestId("docs-index-link").last());
        expect(bottom(last) - card.y).toBeGreaterThanOrEqual(FILLED * card.height);
      }
      for (const index of alone) {
        const card = cards[index] ?? { x: 0, y: 0, width: 0, height: 1 };
        expect((await ink(cells.nth(index))).right).toBeGreaterThan(card.x + card.width / 2);
      }
    });

    test("no section on /pixelslash leans left with its right side bare", async ({ page }) => {
      await open(page, "/pixelslash");
      const sections = await page.getByRole("main").getByRole("region").all();
      expect(sections.length).toBeGreaterThan(0);
      for (const section of sections) {
        const whole = await box(section);
        const drawn = await ink(section);
        const bare = right(whole) - drawn.right - (drawn.left - whole.x);
        expect(bare).toBeLessThanOrEqual(LEAN * whole.width);
      }
    });
  });
}
