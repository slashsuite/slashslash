import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { open } from "./ready.ts";

/*
 * UISlash in the Slash shell, with the viewport set here: the component list is shown from md up, every
 * example frame on /uislash/button holds visible DOM, and the SiteSearch dialog finds components. When
 * WRITE_PR_SHOTS=1 is set, it also captures full-page light and dark shots at 1440px and 390px under
 * apps/site/pr-shots/. The phone's menu is uislash.phone.spec.ts.
 */

const SHOTS_DIR = resolve(import.meta.dirname, "../pr-shots");

const TARGETS = [
  { path: "/uislash", slug: "uislash" },
  { path: "/uislash/button", slug: "uislash-button" },
] as const;

const THEMES = ["light", "dark"] as const;
const WIDTHS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
] as const;

/** Every target, in each theme, at each width. */
const CASES = TARGETS.flatMap((target) =>
  THEMES.flatMap((theme) => WIDTHS.map((size) => ({ ...target, theme, ...size }))),
);

test("SiteSearch on /uislash finds Button and links to /uislash/button", async ({ page }) => {
  await open(page, "/uislash");
  const dialog = page.getByRole("dialog");

  await test.step("the Search button opens the dialog", async () => {
    await page.getByRole("button", { name: /^Search$/ }).click();
    await expect(dialog).toBeVisible();
  });

  await test.step("a query for Button links to its page", async () => {
    await dialog.getByRole("searchbox").fill("Button");
    const hit = dialog.getByRole("link", { name: /Button/ }).first();
    await expect(hit).toBeVisible();
    await expect(hit).toHaveAttribute("href", "/uislash/button");
  });
});

for (const target of TARGETS) {
  test(`${target.path} shows the component list from md up`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await open(page, target.path);
    await expect(page.getByRole("complementary", { name: "All components" }).getByRole("link", { name: "Button", exact: true })).toBeVisible();
  });
}

/* oxlint-disable playwright/no-raw-locators -- look test (each example frame drawn), moves to PixelSlash in SS-17 */
for (const theme of THEMES) {
  for (const { width, height } of WIDTHS) {
    test(`every example on /uislash/button (${theme}, ${width}px) holds visible DOM`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await open(page, "/uislash/button");
      const frames = await page.locator("[data-uislash-preview]").evaluateAll((elements) =>
        elements.map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            id: el.getAttribute("data-uislash-preview") ?? "",
            children: el.children.length,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          };
        }),
      );
      expect(frames.length).toBeGreaterThan(0);
      for (const frame of frames) {
        expect(frame.children, `${frame.id} DOM children`).toBeGreaterThan(0);
        expect(frame.width, `${frame.id} width`).toBeGreaterThan(0);
        expect(frame.height, `${frame.id} height`).toBeGreaterThan(0);
      }
    });
  }
}
/* oxlint-enable playwright/no-raw-locators */

// Shots for a PR description, only when asked for.
if (process.env["WRITE_PR_SHOTS"] === "1") {
  for (const { path, slug, theme, width, height } of CASES) {
    test(`${path} (${theme}, ${width}px) shot`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
      await open(page, path);
      mkdirSync(SHOTS_DIR, { recursive: true });
      await page.screenshot({ path: resolve(SHOTS_DIR, `${slug}-${theme}-${width}.png`), fullPage: true });
    });
  }
}
