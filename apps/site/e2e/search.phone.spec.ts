import { expect, test } from "@playwright/test";
import { PLACES, THEMES, place, shoot, sideways } from "./search-place.ts";

/*
 * Where the docs search box sits on a phone: above the page title, with the docs nav after the page, and
 * the page never scrolls sideways, before a query or with its results.
 */

for (const path of PLACES) {
  for (const theme of THEMES) {
    test(`the box's place on ${path} in ${theme}`, async ({ page }) => {
      const { box, allDocs, title } = await place(page, path, theme);
      expect(box.y + box.height, "the box is above All docs").toBeLessThan(allDocs.y);
      expect(box.y + box.height, "the box is above the page title").toBeLessThan(title.y);
      expect(allDocs.y, "the nav is after the page").toBeGreaterThan(title.y);
      expect(await sideways(page), "the page scrolls sideways").toBe(0);
      await shoot(page, `${path.split("/").at(-1)}-${theme}-phone`);
      expect(await sideways(page), "the page scrolls sideways with results").toBe(0);
    });
  }
}
