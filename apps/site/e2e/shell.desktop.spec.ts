import { expect, test } from "@playwright/test";
import { open, reload } from "./ready.ts";

/*
 * The shell in a real browser, on the 404 page (the suite's section), on the desktop: the theme
 * toggle switches Slash Day and Slash Night and the choice survives a reload, and from md the tool
 * switcher is one row that never scrolls sideways. The phone folds the switcher into the Menu, and
 * its toggle is the same one. What a reader with JavaScript off gets is in src/shell/shell.built.test.tsx.
 */

const PAGE = "/no-such-page";

test("the toggle switches Slash Day and Slash Night, and the choice survives a reload", async ({ page }) => {
  // The toggle is named for what it does next, so its name says which theme is on.
  const toDark = page.getByRole("button", { name: "Switch to dark theme" });
  const toLight = page.getByRole("button", { name: "Switch to light theme" });
  await page.emulateMedia({ colorScheme: "light" });
  await open(page, PAGE);
  await expect(toDark).toBeVisible();

  await test.step("to Slash Night, kept over a reload", async () => {
    await toDark.click();
    await expect(toLight).toBeVisible();
    await reload(page);
    await expect(toLight).toBeVisible();
  });

  await test.step("back to Slash Day, kept over a reload", async () => {
    await toLight.click();
    await expect(toDark).toBeVisible();
    await reload(page);
    await expect(toDark).toBeVisible();
  });
});

for (const width of [768, 820, 1024, 1440]) {
  test(`at ${width}px the switcher is one row and nothing in the header scrolls sideways`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await open(page, PAGE);
    const nav = page.getByRole("banner").getByRole("navigation", { name: "Tools" });
    await expect(nav).toBeVisible();
    const reading = await nav.evaluate((el) => {
      const row = el.closest<HTMLElement>("header > *");
      const tops = new Set([...el.querySelectorAll("a")].map((a) => Math.round(a.getBoundingClientRect().top)));
      return {
        rows: tops.size,
        nav: [el.scrollWidth, el.clientWidth],
        header: row ? [row.scrollWidth, row.clientWidth] : [],
        page: [document.documentElement.scrollWidth, document.documentElement.clientWidth],
      };
    });
    expect(reading.rows).toBe(1);
    expect(reading.nav[0]).toBe(reading.nav[1]);
    expect(reading.header[0]).toBe(reading.header[1]);
    expect(reading.page[0]).toBe(reading.page[1]);
  });
}
