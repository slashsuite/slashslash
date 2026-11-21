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
