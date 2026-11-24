import { expect, test } from "@playwright/test";
import { open } from "./ready.ts";

/*
 * /how-it-works on a desktop: the storybook plays its scenes on its own while in view and pauses when
 * scrolled away.
 */

test("the storybook autoplays in view and pauses when scrolled away", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await open(page, "/how-it-works");

  // The storybook's scene and playback state are attributes on its root, which has no role of its own.
  const book = page.getByTestId("how-it-works-storybook");
  await book.scrollIntoViewIfNeeded();
  await expect(book).toHaveAttribute("data-ready", "true");
  await expect(book).toHaveAttribute("data-playing", "true");
  await expect(book).toHaveAttribute("data-animated", "true");
  await expect(book).toHaveAttribute("data-paused", "false");
  await expect(book).toHaveAttribute("data-scene", "muse");

  // Scene 1 (muse) stays active for its full 6500ms duration, then advances to Scene 2 (architect)
  await page.clock.runFor(6000);
  await expect(book).toHaveAttribute("data-scene", "muse");
  await page.clock.runFor(600);
  await expect(book).toHaveAttribute("data-scene", "architect");

  // Scene 2 (architect) must also get its full 6500ms duration (regression test against 50ms skip)
  await page.clock.runFor(500);
  await expect(book).toHaveAttribute("data-scene", "architect");
  await page.clock.runFor(5500);
  await expect(book).toHaveAttribute("data-scene", "architect");
  await page.clock.runFor(700);
  await expect(book).toHaveAttribute("data-scene", "checker");

  // Selecting a scene mid-way through Scene 3 resets the timer to a full 6500ms for the chosen scene
  await page.clock.runFor(4000);
  await expect(book).toHaveAttribute("data-scene", "checker");
  await book.getByRole("group", { name: "Storybook scenes" }).getByRole("button", { name: /Builder$/ }).click();
  await expect(book).toHaveAttribute("data-scene", "builder");
  await page.clock.runFor(6000);
  await expect(book).toHaveAttribute("data-scene", "builder");
  await page.clock.runFor(700);
  await expect(book).toHaveAttribute("data-scene", "checks");

  // Scrolling away pauses playback so the scene does not advance while off-screen
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(book).toHaveAttribute("data-paused", "true");
  await page.clock.runFor(7000);
  await expect(book).toHaveAttribute("data-scene", "checks");
});
