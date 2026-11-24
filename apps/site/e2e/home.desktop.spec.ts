import { expect, test } from "@playwright/test";
import { open } from "./ready.ts";

/*
 * On Slash Day a tool card's mark is drawn in the tool's deep text tone even when the system is dark,
 * never in the pastel one. On the desktop only: the mark is the same image on a phone.
 */

const STORED = "hackcove:colour-scheme";

/* oxlint-disable playwright/no-raw-locators -- look test (a pixel of the mark), moves to PixelSlash in SS-17 */
test("on Slash Day a tool's mark is its deep tone, even on a dark system", async ({ page }) => {
  await page.addInitScript((key) => localStorage.setItem(key, "light"), STORED);
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await open(page, "/");
  const mark = page.locator('[data-tool="PixelSlash"] img');
  await mark.scrollIntoViewIfNeeded();
  const shot = (await mark.screenshot()).toString("base64");
  // The mark's most saturated pixel, read back through a canvas.
  const pixel = await page.evaluate(async (png) => {
    const img = new Image();
    img.src = `data:image/png;base64,${png}`;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    const ctx = c.getContext("2d");
    if (!ctx) throw new Error("no canvas");
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    let best = [0, 0, 0];
    let spread = -1;
    for (let i = 0; i < d.length; i += 4) {
      const p = [d[i] ?? 0, d[i + 1] ?? 0, d[i + 2] ?? 0];
      const s = Math.max(...p) - Math.min(...p);
      if (s > spread) [best, spread] = [p, s];
    }
    return best;
  }, shot);
  // PixelSlash's deep tone is #8839ef; its pastel #cba6f7 would read near 203.
  expect(pixel[0]).toBeLessThan(160);
});
/* oxlint-enable playwright/no-raw-locators */
