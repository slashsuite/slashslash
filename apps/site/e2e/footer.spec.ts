import { expect, test } from "@playwright/test";
import { open } from "./ready.ts";

/*
 * The footer in a real browser: every paragraph in it (the lead beside the lockup, the links, the
 * licence lines and the trademark sentence after them) is set at the kit's one step down, 14px, so
 * none reads larger than the rest.
 */

const FOOTER_SIZE = "14px";

for (const path of ["/", "/pixelslash"]) {
  test(`on ${path} every footer paragraph has the same computed font size`, async ({ page }) => {
    await open(page, path);
    const footer = page.getByRole("contentinfo");
    const lead = footer.getByText(/built for coding agents/);
    const items = footer.getByRole("listitem");
    const licence = items.getByText(/licen/i);
    const links = items.getByRole("link");
    // The licence lines and the trademark sentence after them, then the product and docs links.
    await expect(licence).not.toHaveCount(0);
    await expect(licence.last()).toHaveText(/the licences do not grant them/);
    await expect(links).not.toHaveCount(0);
    for (const paragraph of [lead, ...(await licence.all()), ...(await links.all())]) {
      // oxlint-disable-next-line playwright/no-restricted-matchers -- one size across the footer is the behaviour asked for here; the rest of its look stays the visual check's
      await expect(paragraph).toHaveCSS("font-size", FOOTER_SIZE);
    }
  });
}
