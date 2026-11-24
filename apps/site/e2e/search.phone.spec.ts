import { expect, test } from "@playwright/test";
import { open } from "./ready.ts";

/*
 * The docs search on a phone: its results open in the page, and the page still never scrolls sideways.
 * Where the box sits, before a query and with results, is the visual check's (pixelslash.config.ts).
 */

test("search results on a phone never push the page sideways", async ({ page }) => {
  await open(page, "/pixelslash/docs");
  await page.getByRole("searchbox", { name: "Search the docs" }).fill("baseline");
  await expect(page.getByRole("search").getByRole("link").first()).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, "the page scrolls sideways with results").toBe(0);
});
