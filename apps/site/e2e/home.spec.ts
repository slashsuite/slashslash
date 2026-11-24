import { expect, type Page, test } from "@playwright/test";
import { open } from "./ready.ts";

/*
 * The home's motion island in a real browser: it arms when the reader allows motion, and arms nothing
 * under reduced motion. How the hero looks, in each theme, is the visual check's (pixelslash.config.ts).
 */

/** Whether the motion island has marked the page ready to animate (src/illustrations/motion.tsx). */
const armed = (page: Page): Promise<boolean> => page.evaluate(() => "motionReady" in document.documentElement.dataset);

test("with motion allowed the hero's motion island arms", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await open(page, "/");
  await expect.poll(() => armed(page)).toBe(true);
});

test("with reduced motion the hero's motion island arms nothing", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "/");
  // The island has hydrated by now (open waits for it), and it arms nothing under reduced motion.
  expect(await armed(page)).toBe(false);
});
