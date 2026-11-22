import { expect, type Page, test } from "@playwright/test";

/*
 * The /how-it-works flow diagram in a real browser: on a phone, and on a desktop at 200% zoom (a 1280 px
 * window is then 640 px wide), every step sits under the one before it at the same left edge and the page
 * never scrolls sideways; on a full desktop the steps run left to right; the planned steps, and only
 * they, have a dashed outline and the word Planned.
 */

const PLANNED = new Set(["6a", "7a"]);

async function boxes(page: Page): Promise<{ id: string; x: number; y: number; bottom: number }[]> {
  return page.locator("[data-node]").evaluateAll((nodes) =>
    nodes.map((node) => {
      const box = node.getBoundingClientRect();
      return { id: node.getAttribute("data-node") ?? "", x: box.left, y: box.top, bottom: box.bottom };
    }),
  );
}

async function expectStacked(page: Page): Promise<void> {
  await page.goto("/how-it-works");
  const nodes = await boxes(page);
  expect(nodes.map((node) => node.id)).toEqual(["1", "2", "3", "4", "5", "6", "6a", "7", "7a", "8", "9", "10"]);
  for (const [index, node] of nodes.entries()) {
    const before = nodes[index - 1];
    if (before === undefined) continue;
    expect(node.y, `${node.id} is below ${before.id}`).toBeGreaterThanOrEqual(before.bottom);
    expect(Math.abs(node.x - before.x), `${node.id} lines up with ${before.id}`).toBeLessThan(1);
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, "the page scrolls sideways").toBe(0);
}

test("on a phone the steps stack top to bottom", async ({ page }, info) => {
  test.skip(info.project.name !== "phone", "phone only");
  await expectStacked(page);
});

test("on a desktop at 200% zoom the steps stack top to bottom", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "desktop only");
  await page.setViewportSize({ width: 640, height: 720 });
  await expectStacked(page);
});

test("on a desktop the steps run left to right", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "desktop only");
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/how-it-works");
  const [one, two] = await boxes(page);
  if (one === undefined || two === undefined) throw new Error("the diagram has fewer than two steps");
  expect([one.id, two.id]).toEqual(["1", "2"]);
  expect(two.x).toBeGreaterThan(one.x);
  expect(Math.abs(two.y - one.y)).toBeLessThan(1);
});

test("the planned steps, and only they, are dashed and say Planned", async ({ page }) => {
  await page.goto("/how-it-works");
  const nodes = page.locator("[data-node]");
  await expect(nodes).toHaveCount(12);
  for (const node of await nodes.all()) {
    const id = (await node.getAttribute("data-node")) ?? "";
    const planned = PLANNED.has(id);
    await expect(node, id).toHaveAttribute("data-stage", planned ? "planned" : "today");
    await expect(node, id).toHaveCSS("border-top-style", planned ? "dashed" : "solid");
    if (planned) await expect(node.getByText("Planned", { exact: true }), id).toBeVisible();
    else await expect(node.getByText("Planned", { exact: true }), id).toHaveCount(0);
  }
});

test("the animated storybook steps through scenes with buttons and arrow keys", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/how-it-works");
  const book = page.getByTestId("how-it-works-storybook");
  await book.scrollIntoViewIfNeeded();
  await expect(book).toBeVisible();
  await expect(book).toHaveAttribute("data-ready", "true");
  await expect(book).toHaveAttribute("data-scene", "muse");
  await expect(book).toHaveAttribute("data-playing", "false");
  await expect(book).toHaveAttribute("data-animated", "false");
  await expect(book.getByText("Scene 1 of 9", { exact: true })).toBeVisible();

  const nextBtn = book.getByRole("button", { name: "Next scene" });
  await nextBtn.click();
  await expect(book).toHaveAttribute("data-scene", "architect");
  await expect(book.getByText("Scene 2 of 9", { exact: true })).toBeVisible();
  await expect(book.locator('[aria-live="polite"]')).toHaveText("Scene 2 of 9: Plan and drill the ticket");

  await book.getByRole("button", { name: "Previous scene" }).click();
  await expect(book).toHaveAttribute("data-scene", "muse");

  await nextBtn.focus();
  await page.keyboard.press("ArrowRight");
  await expect(book).toHaveAttribute("data-scene", "architect");
  await page.keyboard.press("ArrowLeft");
  await expect(book).toHaveAttribute("data-scene", "muse");

  await book.locator('[data-storybook-chapter="sentinel"]').click();
  await expect(book).toHaveAttribute("data-scene", "sentinel");
  await expect(book.getByText("Scene 7 of 9", { exact: true })).toBeVisible();

  await book.locator('[data-storybook-chapter="retro"]').click();
  await expect(book).toHaveAttribute("data-scene", "retro");
  await expect(book.getByText("Scene 9 of 9", { exact: true })).toBeVisible();

  const playBtn = book.getByRole("button", { name: "Play animation" });
  await playBtn.click();
  await expect(book).toHaveAttribute("data-playing", "true");
  await expect(book).toHaveAttribute("data-animated", "true");
  await expect(book).toHaveAttribute("data-paused", "false");

  const pauseBtn = book.getByRole("button", { name: "Pause animation" });
  await pauseBtn.click();
  await expect(book).toHaveAttribute("data-playing", "false");
  await expect(book).toHaveAttribute("data-paused", "true");
});

test("the storybook autoplays in view and pauses when scrolled away", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "desktop only");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/how-it-works");

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
  await book.locator('[data-storybook-chapter="builder"]').click();
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
