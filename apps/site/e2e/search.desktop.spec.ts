import { expect, test } from "@playwright/test";
import { open } from "./ready.ts";
import { PLACES, THEMES, place, shoot } from "./search-place.ts";

/*
 * The docs search on a desktop: from lg up the hint fits the field, and at 1440px the box heads the docs
 * nav column, above All docs and beside the page.
 */

/* oxlint-disable no-restricted-globals -- look test (the hint's measured width), moves to PixelSlash in SS-17 */
test("the hint fits the field from lg up", async ({ page }) => {
  for (const width of [1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await open(page, "/pixelslash/docs");
    const fit = await page.getByRole("searchbox", { name: "Search the docs" }).evaluate(async (input: HTMLInputElement) => {
      // Measure with Inter, not a fallback: wait for the page's fonts before reading the metrics.
      await document.fonts.ready;
      const style = getComputedStyle(input);
      const context = document.createElement("canvas").getContext("2d");
      if (!context) throw new Error("no 2D canvas context");
      context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      const textWidth = context.measureText(input.placeholder).width;
      // The room between the paddings and borders, from the border-box width. clientWidth is not used: Chromium
      // 158 (Playwright 1.65) already leaves the paddings out of an input's clientWidth, Chromium 156 did not.
      const contentWidth =
        input.offsetWidth -
        parseFloat(style.borderLeftWidth) -
        parseFloat(style.borderRightWidth) -
        parseFloat(style.paddingLeft) -
        parseFloat(style.paddingRight);
      return { textWidth, contentWidth, placeholder: input.placeholder };
    });
    expect(fit.placeholder, `at ${width}px`).toBe("Search the docs (press /)");
    expect(
      fit.textWidth,
      `the hint at ${width}px needs ${fit.textWidth}px but the field has ${fit.contentWidth}px`,
    ).toBeLessThanOrEqual(fit.contentWidth);
  }
});
/* oxlint-enable no-restricted-globals */

for (const path of PLACES) {
  for (const theme of THEMES) {
    test(`the box's place on ${path} in ${theme}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const { box, allDocs, title } = await place(page, path, theme);
      expect(box.y + box.height, "the box is above All docs").toBeLessThan(allDocs.y);
      expect(Math.abs(box.x - allDocs.x), "the box heads the nav column").toBeLessThan(24);
      expect(box.x + box.width, "the box is beside the page").toBeLessThan(title.x);
      await shoot(page, `${path.split("/").at(-1)}-${theme}-1440`);
    });
  }
}
