import { expect, test } from "@playwright/test";
import { open, reload } from "./ready.ts";

/*
 * The shell in a real browser, on the 404 page (the suite's section), on the desktop: the theme
 * toggle switches Slash Day and Slash Night and the choice survives a reload, and with no choice
 * stored the page follows the system. The phone's toggle is the same one. How the header looks at
 * each width is the visual check's (pixelslash.config.ts). What a reader with JavaScript off gets is
 * in src/shell/shell.built.test.tsx.
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

test("with no choice stored, the page follows the system switching between light and dark", async ({ page }) => {
  const toDark = page.getByRole("button", { name: "Switch to dark theme" });
  const toLight = page.getByRole("button", { name: "Switch to light theme" });
  await page.emulateMedia({ colorScheme: "light" });
  await open(page, PAGE);
  await expect(toDark).toBeVisible();
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(toLight).toBeVisible();
});

test("choosing the system's own scheme forgets the stored choice, so the page follows the system again", async ({ page }) => {
  const toDark = page.getByRole("button", { name: "Switch to dark theme" });
  const toLight = page.getByRole("button", { name: "Switch to light theme" });
  await page.emulateMedia({ colorScheme: "light" });
  await open(page, PAGE);
  await toDark.click();
  await toLight.click();
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(toLight).toBeVisible();
});
