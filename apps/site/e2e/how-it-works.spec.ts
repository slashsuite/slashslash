import { expect, type Locator, test } from "@playwright/test";
import { open } from "./ready.ts";
import { steps } from "./flow.ts";

/*
 * /how-it-works in a real browser, on a desktop and a phone: the planned steps, and only they, have a
 * dashed outline (their data-stage and Planned pill are in src/how-it-works/approved-copy.built.test.ts),
 * and the animated storybook steps through its scenes with its buttons and the arrow keys. Where the
 * steps sit, and the storybook's autoplay, are how-it-works.desktop.spec.ts and how-it-works.phone.spec.ts.
 */

const PLANNED = new Set(["6a", "7a"]);

/** The storybook's button for one scene, by the scene's short label. */
const chapter = (book: Locator, label: string): Locator =>
  book.getByRole("group", { name: "Storybook scenes" }).getByRole("button", { name: new RegExp(`${label}$`) });

/* oxlint-disable ui-testing/no-style-assertions, playwright/no-restricted-matchers -- look test (dashed outline), moves to PixelSlash in SS-17 */
test("the planned steps, and only they, are dashed", async ({ page }) => {
  await open(page, "/how-it-works");
  const nodes = steps(page);
  await expect(nodes).toHaveCount(12);
  for (const node of await nodes.all()) {
    const id = (await node.getAttribute("data-node")) ?? "";
    await expect(node, id).toHaveCSS("border-top-style", PLANNED.has(id) ? "dashed" : "solid");
  }
});
/* oxlint-enable ui-testing/no-style-assertions, playwright/no-restricted-matchers */

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
    await expect(book).toHaveAttribute("data-scene", "muse");
    await expect(book).toHaveAttribute("data-playing", "false");
    await expect(book).toHaveAttribute("data-animated", "false");
    await expect(book.getByText("Scene 1 of 9", { exact: true })).toBeVisible();
  });

  await test.step("the Next and Previous buttons move one scene and announce it", async () => {
    await nextBtn.click();
    await expect(book).toHaveAttribute("data-scene", "architect");
    await expect(book.getByText("Scene 2 of 9", { exact: true })).toBeVisible();
    await expect(book.getByText("Scene 2 of 9: Plan and drill the ticket", { exact: true })).toBeAttached();
    await book.getByRole("button", { name: "Previous scene" }).click();
    await expect(book).toHaveAttribute("data-scene", "muse");
  });

  await test.step("the arrow keys move one scene", async () => {
    await nextBtn.focus();
    await page.keyboard.press("ArrowRight");
    await expect(book).toHaveAttribute("data-scene", "architect");
    await page.keyboard.press("ArrowLeft");
    await expect(book).toHaveAttribute("data-scene", "muse");
  });

  await test.step("a scene's button jumps to it", async () => {
    await chapter(book, "Sentinel").click();
    await expect(book).toHaveAttribute("data-scene", "sentinel");
    await expect(book.getByText("Scene 7 of 9", { exact: true })).toBeVisible();
    await chapter(book, "Retro").click();
    await expect(book).toHaveAttribute("data-scene", "retro");
    await expect(book.getByText("Scene 9 of 9", { exact: true })).toBeVisible();
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
