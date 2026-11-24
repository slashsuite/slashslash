import { expect, test } from "@playwright/test";
import { open } from "./ready.ts";

/*
 * UISlash on a phone: the component menu, once opened, stays open when the viewport's height changes, as
 * it does when a phone's address bar slides away.
 */

test("phone component menu stays open when viewport height changes", async ({ page }) => {
  await open(page, "/uislash/button");
  const menu = page.getByRole("complementary", { name: "All components" });
  const button = menu.getByRole("link", { name: "Button", exact: true });
  // Once hydrated, the menu's summary names the list and the page it is on.
  await menu.getByText("All components: Button", { exact: true }).click();
  await expect(button).toBeVisible();
  // Shorter, as when the phone's toolbar or keyboard comes up.
  const { width, height } = page.viewportSize() ?? { width: 393, height: 659 };
  await page.setViewportSize({ width, height: height - 144 });
  await expect(button).toBeVisible();
});
