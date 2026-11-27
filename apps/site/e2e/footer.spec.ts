import { expect, test } from "@playwright/test";
import { open } from "./ready.ts";

/*
 * The footer's columns in a real browser: every paragraph under a column title (the links, the licence
 * lines and the trademark sentence after them) is set at the kit's one step down, 14px, so the last one
 * does not read larger than the rest. The lead beside the lockup is the footer's own line, not a column's.
 */

const COLUMN_SIZE = "14px";

for (const path of ["/", "/pixelslash"]) {
  test(`on ${path} every footer paragraph has the same computed font size`, async ({ page }) => {
    await open(page, path);
    const items = page.getByRole("contentinfo").getByRole("listitem");
    const licence = items.getByText(/licen/i);
    const links = items.getByRole("link");
    // Three licence lines and the trademark sentence, then the product and docs links.
    await expect(licence).toHaveCount(4);
    await expect(licence.last()).toHaveText(/the licences do not grant them/);
    await expect(links).not.toHaveCount(0);
    for (const paragraph of [...(await licence.all()), ...(await links.all())]) {
      // oxlint-disable-next-line playwright/no-restricted-matchers -- one size across the footer is the behaviour asked for here; the rest of its look stays the visual check's
      await expect(paragraph).toHaveCSS("font-size", COLUMN_SIZE);
    }
  });
}
