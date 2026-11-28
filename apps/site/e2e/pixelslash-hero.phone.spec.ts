import { expect, test } from "@playwright/test";
import { open } from "./ready.ts";

/*
 * The PixelSlash home hero on a 390 wide phone: its three actions sit on one row, so none wraps onto a
 * line of its own. Where they sit is the behaviour, so this reads their boxes; how they look stays the
 * visual check's. The theme moves no box, so one theme is enough.
 */

test.use({ viewport: { width: 390, height: 844 } });

test("the hero's actions sit on one row at 390 wide", async ({ page }) => {
  await open(page, "/pixelslash");
  // The hero's action row has no role of its own; its test id names it.
  const links = await page.getByTestId("hero-actions").getByRole("link").all();
  expect(links).toHaveLength(3);
  // oxlint-disable-next-line no-restricted-properties -- one row is what the ticket asks of the hero's actions; how they look stays the visual check's
  const boxes = await Promise.all(links.map(async (link) => link.boundingBox()));
  const middles = boxes.map((box) => (box === null ? Number.NaN : box.y + box.height / 2));
  // A link with no box is shorter than the filled button beside it, so the row is read at its middle.
  for (const middle of middles) expect(Math.abs(middle - (middles[0] ?? 0))).toBeLessThanOrEqual(2);
});
