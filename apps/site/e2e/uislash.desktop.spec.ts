import { expect, test } from "@playwright/test";
import { open } from "./ready.ts";

/*
 * UISlash in the Slash shell, with the viewport set here: the component list is shown from md up, and
 * the SiteSearch dialog finds components. How each example looks is the visual check's
 * (pixelslash.config.ts). The phone's menu is uislash.phone.spec.ts.
 */

const TARGETS = ["/uislash", "/uislash/button"] as const;

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

for (const path of TARGETS) {
  test(`${path} shows the component list from md up`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await open(page, path);
    await expect(page.getByRole("complementary", { name: "All components" }).getByRole("link", { name: "Button", exact: true })).toBeVisible();
  });
}
