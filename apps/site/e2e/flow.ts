import { expect, type Locator, type Page } from "@playwright/test";
import { open } from "./ready.ts";

/*
 * The /how-it-works flow diagram's steps and where they sit, shared by how-it-works.desktop.spec.ts and
 * how-it-works.phone.spec.ts.
 */

/* oxlint-disable playwright/no-raw-locators -- look test (step geometry), moves to PixelSlash in SS-17 */
/** The diagram's steps, by the step id each carries. */
export const steps = (page: Page): Locator => page.locator("[data-node]");
/* oxlint-enable playwright/no-raw-locators */

/** Each step's id and box, in order. */
export async function boxes(page: Page): Promise<{ id: string; x: number; y: number; bottom: number }[]> {
  return steps(page).evaluateAll((nodes) =>
    nodes.map((node) => {
      const box = node.getBoundingClientRect();
      return { id: node.getAttribute("data-node") ?? "", x: box.left, y: box.top, bottom: box.bottom };
    }),
  );
}

/** Every step sits under the one before it at the same left edge, and the page never scrolls sideways. */
export async function expectStacked(page: Page): Promise<void> {
  await open(page, "/how-it-works");
  const nodes = await boxes(page);
  expect(nodes.map((node) => node.id)).toEqual(["1", "2", "3", "4", "5", "6", "6a", "7", "7a", "8", "9", "10"]);
  const pairs = nodes.slice(1).map((node, index) => ({ node, before: nodes[index] ?? node }));
  for (const { node, before } of pairs) {
    expect(node.y, `${node.id} is below ${before.id}`).toBeGreaterThanOrEqual(before.bottom);
    expect(Math.abs(node.x - before.x), `${node.id} lines up with ${before.id}`).toBeLessThan(1);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, "the page scrolls sideways").toBe(0);
}
