import { expect, test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

/*
 * UISlash in the Slash shell: /uislash and /uislash/button render with the site's header and footer,
 * every example frame on /uislash/button contains visible non-empty DOM, the SiteSearch dialog finds
 * components, and neither page scrolls horizontally at 390px. When WRITE_PR_SHOTS=1 is set, captures
 * full-page light and dark shots at 1440px and 390px under apps/site/pr-shots/.
 */

const SHOTS_DIR = resolve(import.meta.dirname, "../pr-shots");
const WRITE_SHOTS = process.env["WRITE_PR_SHOTS"] === "1";

const TARGETS = [
  { path: "/uislash", slug: "uislash", expectExamples: false },
  { path: "/uislash/button", slug: "uislash-button", expectExamples: true },
] as const;

const THEMES = ["light", "dark"] as const;
const WIDTHS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
] as const;

test("SiteSearch on /uislash finds Button and links to /uislash/button", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "one viewport covers the dialog interaction");
  await page.goto("/uislash", { waitUntil: "load" });
  await page.getByRole("button", { name: /^Search$/ }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("searchbox").fill("Button");
  const hit = dialog.locator('a[href="/uislash/button"]').first();
  await expect(hit).toBeVisible();
});

test("phone component menu stays open when viewport height changes", async ({ page }, info) => {
  test.skip(info.project.name !== "phone", "mobile address-bar height resize regression");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/uislash/button", { waitUntil: "load" });
  const details = page.locator("main aside details").first();
  await details.locator("summary").click();
  await expect(details).toHaveAttribute("open", "");
  await page.setViewportSize({ width: 390, height: 700 });
  await expect(details).toHaveAttribute("open", "");
});

for (const target of TARGETS) {
  for (const theme of THEMES) {
    for (const { width, height } of WIDTHS) {
      test(`${target.path} (${theme}, ${width}px) renders in the Slash shell with visible examples and no overflow`, async ({
        page,
      }, info) => {
        test.skip(info.project.name !== "desktop", "explicit 1440 and 390 viewports are tested here");
        await page.setViewportSize({ width, height });
        await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
        await page.goto(target.path, { waitUntil: "load" });

        await expect(page.locator("header")).toBeVisible();
        await expect(page.locator("footer")).toBeVisible();
        await expect(page.locator('header a[href="/"]').first()).toBeVisible();
        if (width >= 768) {
          await expect(page.locator("main aside details").first()).toHaveAttribute("open", "");
        }

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${target.path} overflows horizontally at ${width}px`).toBe(0);

        if (target.expectExamples) {
          const frames = await page.evaluate(() =>
            [...document.querySelectorAll<HTMLElement>("[data-uislash-preview]")].map((el) => {
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
        }

        if (WRITE_SHOTS) {
          mkdirSync(SHOTS_DIR, { recursive: true });
          await page.screenshot({
            path: resolve(SHOTS_DIR, `${target.slug}-${theme}-${width}.png`),
            fullPage: true,
          });
        }
      });
    }
  }
}
