import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { resolve } from "node:path";
import { PAGES } from "../src/content/pages.ts";

/*
 * Every page, plus one unknown path, in each theme, on a desktop and a phone:
 * it answers its status and loads, never scrolls sideways on the phone, passes axe, and makes no
 * request off the site. The suite home, the
 * PixelSlash home, pricing, security and self-host pages, the FlakeSlash home, /developers and /how-it-works also leave a full-page shot in each theme and
 * viewport, for a person to look at.
 */

const THEMES = ["light", "dark"] as const;

/** The pages whose full-page shot is kept for the flip review, by path, with the shot's name. */
const FLIP_SHOTS: Partial<Record<string, string>> = {
  "/": "home-full",
  "/pixelslash": "pixelslash-home",
  "/pixelslash/pricing": "pixelslash-pricing",
  "/pixelslash/security": "pixelslash-security",
  "/pixelslash/self-host": "pixelslash-self-host",
  "/flakeslash": "flakeslash-home",
  "/developers": "developers",
  "/how-it-works": "how-it-works",
};
const UNKNOWN = "/no-such-page";

const ROUTES = [
  ...PAGES.map((page) => ({ path: page.path, status: 200 })),
  { path: UNKNOWN, status: 404 },
];

for (const { path, status } of ROUTES) {
  for (const theme of THEMES) {
    test(`${path} in ${theme}`, async ({ page, context, baseURL }, info) => {
      const origin = new URL(baseURL ?? "").origin;
      const leaked: string[] = [];
      await context.route("**/*", async (route) => {
        const url = new URL(route.request().url());
        if (url.origin === origin || url.hostname === "127.0.0.1") return route.fallback();
        leaked.push(url.href);
        return route.abort();
      });
      await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });

      const response = await page.goto(path, { waitUntil: "load" });
      expect(response?.status()).toBe(status);
      if (status === 404) await expect(page.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/");

      // UISlash Table's overflow-x-auto wrapper does not yet set tabindex="0"; remove this
      // exclusion once @slashsuite/ui-react makes Table's scroll container keyboard-focusable.
      const axeBuilder = new AxeBuilder({ page });
      if (path === "/uislash" || path.startsWith("/uislash/")) {
        axeBuilder.disableRules(["scrollable-region-focusable"]);
      }
      const axe = await axeBuilder.analyze();
      const violations = axe.violations.flatMap((v) =>
        v.nodes.map((n) => `${v.id}: ${n.target.join(" ")} (${n.any.map((c) => c.message).join("; ")})`),
      );
      expect(violations).toEqual([]);

      // Down one viewport at a time, so every lazy loader fires, then wait for the images to settle.
      // scrollBy, not mouse.wheel: it scrolls the same on a touch phone and a desktop.
      while (
        await page.evaluate(
          () => window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 1,
        )
      ) {
        const before = await page.evaluate(() => window.scrollY);
        await page.evaluate(() => window.scrollBy(0, window.innerHeight));
        await expect.poll(() => page.evaluate(() => window.scrollY)).not.toBe(before);
      }
      await expect
        .poll(() =>
          page.evaluate(() =>
            [...document.images].filter((i) => i.getClientRects().length > 0).every((i) => i.complete),
          ),
        )
        .toBe(true);
      expect(leaked).toEqual([]);

      // After the scroll, so lazy content that loaded on the way down counts too.

      if (info.project.name === "phone") {
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, "the page scrolls sideways").toBe(0);
      }

      // The pages a person looks at before the flip: the whole page, kept in test-results/flip-shots.
      const shot = FLIP_SHOTS[path];
      if (shot !== undefined) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: resolve(import.meta.dirname, `../test-results/flip-shots/${shot}-${theme}-${info.project.name}.png`),
          fullPage: true,
        });
      }
    });
  }
}
