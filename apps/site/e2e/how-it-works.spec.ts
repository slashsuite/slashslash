import { expect, type Locator, test } from "@playwright/test";
import { open } from "./ready.ts";

/*
 * /how-it-works in a real browser, on a desktop and a phone: the animated storybook steps through its
 * scenes with its buttons, the arrow keys and the product bar. Its autoplay is how-it-works.desktop.spec.ts.
 * The words are in src/how-it-works/approved-copy.built.test.ts; how the scenes look is the visual check's
 * (pixelslash.config.ts).
 */

/** The storybook's button for one scene, by the scene's title. */
const chapter = (book: Locator, label: string): Locator =>
  book.getByRole("group", { name: "Storybook scenes" }).getByRole("button", { name: new RegExp(`${label}$`) });

test("the animated storybook steps through scenes with buttons and arrow keys", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await open(page, "/how-it-works");
  // The storybook's scene and playback state are attributes on its root, which has no role of its own.
  const book = page.getByTestId("how-it-works-storybook");
  const nextBtn = book.getByRole("button", { name: "Next scene" });

  await test.step("opens still, on the first scene", async () => {
    await book.scrollIntoViewIfNeeded();
    await expect(book).toBeVisible();
    await expect(book).toHaveAttribute("data-ready", "true");
    await expect(book).toHaveAttribute("data-scene", "explore");
    await expect(book).toHaveAttribute("data-playing", "false");
    await expect(book).toHaveAttribute("data-animated", "false");
    await expect(book.getByText("Scene 1 of 9", { exact: true })).toBeVisible();
  });

  await test.step("the Next and Previous buttons move one scene and announce it", async () => {
    await nextBtn.click();
    await expect(book).toHaveAttribute("data-scene", "shape");
    await expect(book.getByText("Scene 2 of 9", { exact: true })).toBeVisible();
    await expect(book.getByText("Scene 2 of 9: Shape the ticket", { exact: true })).toBeAttached();
    await book.getByRole("button", { name: "Previous scene" }).click();
    await expect(book).toHaveAttribute("data-scene", "explore");
  });

  await test.step("the arrow keys move one scene", async () => {
    await nextBtn.focus();
    await page.keyboard.press("ArrowRight");
    await expect(book).toHaveAttribute("data-scene", "shape");
    await page.keyboard.press("ArrowLeft");
    await expect(book).toHaveAttribute("data-scene", "explore");
  });

  await test.step("a scene's button jumps to it", async () => {
    await chapter(book, "Inbox, gate and ship").click();
    await expect(book).toHaveAttribute("data-scene", "ship");
    await expect(book.getByText("Scene 7 of 9", { exact: true })).toBeVisible();
    await chapter(book, "Good night retro").click();
    await expect(book).toHaveAttribute("data-scene", "retro");
    await expect(book.getByText("Scene 9 of 9", { exact: true })).toBeVisible();
  });

  await test.step("a product in the bar marks its scenes and jumps to the first", async () => {
    const bar = book.getByRole("group", { name: "Show the scenes a product appears in" });
    const toggle = bar.getByRole("button", { name: "ToggleSlash" });
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(book).toHaveAttribute("data-scene", "rollout");
    await expect(chapter(book, "Live rollout")).toHaveAttribute("data-highlight", "true");
    await expect(chapter(book, "Inbox, gate and ship")).not.toHaveAttribute("data-highlight", "true");
    await bar.getByRole("button", { name: "TaskSlash" }).click();
    await expect(book).toHaveAttribute("data-scene", "build");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await bar.getByRole("button", { name: "TaskSlash" }).click();
    await expect(chapter(book, "Parallel builds")).not.toHaveAttribute("data-highlight", "true");
  });

  await test.step("Play and Pause start and stop the animation", async () => {
    await book.getByRole("button", { name: "Play animation" }).click();
    await expect(book).toHaveAttribute("data-playing", "true");
    await expect(book).toHaveAttribute("data-animated", "true");
    await expect(book).toHaveAttribute("data-paused", "false");
    await book.getByRole("button", { name: "Pause animation" }).click();
    await expect(book).toHaveAttribute("data-playing", "false");
    await expect(book).toHaveAttribute("data-paused", "true");
  });
});
