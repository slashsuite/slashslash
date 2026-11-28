import { expect, test } from "@playwright/test";
import { open } from "./ready.ts";

/*
 * The PixelSlash home hero at 1440 wide leads with one action: exactly one of its actions is drawn in
 * the primary style, a filled button, and the others are links with no fill. The fill is read from the
 * computed background, since the kit marks no variant in the DOM.
 */

test.use({ viewport: { width: 1440, height: 900 } });

for (const theme of ["light", "dark"] as const) {
  test(`exactly one hero action is primary at 1440 wide in ${theme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme });
    await open(page, "/pixelslash");
    // The hero's action row has no role of its own; its test id names it.
    const actions = page.getByTestId("hero-actions").getByRole("link");
    await expect(actions).toHaveCount(3);
    const filled = await actions.evaluateAll((links) =>
      links.map((link) => {
        // oxlint-disable-next-line no-restricted-globals -- which action is primary is what the ticket asks of the hero, and the kit marks no variant in the DOM; the rest of the look stays the visual check's
        const fill = getComputedStyle(link).backgroundColor;
        return fill !== "transparent" && !/^rgba\(.*,\s*0\)$/.test(fill);
      }),
    );
    expect(filled).toEqual([true, false, false]);
  });

  test(`the demo's pause holds the slash still in ${theme}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: theme, reducedMotion: "no-preference" });
    await open(page, "/pixelslash");
    const pause = page.getByRole("checkbox", { name: "Pause the demo" });
    const demo = page.getByRole("figure").filter({ has: pause });
    await expect(pause).not.toBeChecked();
    // Space on the focused box, as a keyboard reader toggles it; a pointer lands on the icon its label draws.
    await pause.focus();
    await page.keyboard.press("Space");
    await expect(pause).toBeChecked();
    const state = await demo.evaluate((figure) => figure.getAnimations({ subtree: true }).map((a) => a.playState));
    expect(state.length).toBeGreaterThan(0);
    expect(state.every((s) => s === "paused")).toBe(true);
  });
}
