import { AxeBuilder } from "@axe-core/playwright";
import { type BrowserContext, expect, type Page, test } from "@playwright/test";
import { resolve } from "node:path";
import { PAGES } from "../src/content/pages.ts";
import { open } from "./ready.ts";

/*
 * Every page, plus one unknown path, in each theme, on a desktop and a phone: it answers its status
 * and loads, never scrolls sideways, passes axe, and makes no request off the site. What a page
 * contains (its title, meta, canonical, headings and links) is checked on the built files in Vitest
 * (the src/**\/*.built.test.* files). The suite home, the PixelSlash home, pricing, security and
 * self-host pages, the FlakeSlash home, /developers and /how-it-works also leave a full-page shot in
 * each theme and viewport, for a person to look at.
 */

const THEMES = ["light", "dark"] as const;
type Theme = (typeof THEMES)[number];

/** The pages whose full-page shot is kept for the flip review, by path, with the shot's name. */
const FLIP_SHOTS: Record<string, string> = {
  "/": "home-full",
  "/pixelslash": "pixelslash-home",
  "/pixelslash/pricing": "pixelslash-pricing",
  "/pixelslash/security": "pixelslash-security",
  "/pixelslash/self-host": "pixelslash-self-host",
  "/flakeslash": "flakeslash-home",
  "/developers": "developers",
  "/how-it-works": "how-it-works",
};

const ROUTES = [...PAGES.map((page) => ({ path: page.path, status: 200 })), { path: "/no-such-page", status: 404 }];

/** Whether the page has more below the fold. */
const moreBelow = (page: Page): Promise<boolean> =>
  page.evaluate(() => window.scrollY + window.innerHeight < document.documentElement.scrollHeight - 1);

/**
 * Down one viewport at a time, so every lazy loader fires, then waits for the images to settle.
 * scrollBy, not mouse.wheel: it scrolls the same on a touch phone and a desktop.
 */
async function scrollToBottom(page: Page): Promise<void> {
  while (await moreBelow(page)) {
    const before = await page.evaluate(() => window.scrollY);
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await expect.poll(() => page.evaluate(() => window.scrollY)).not.toBe(before);
  }
  await expect
    .poll(() =>
      page.evaluate(() => [...document.images].filter((i) => i.getClientRects().length > 0).every((i) => i.complete)),
    )
    .toBe(true);
}

type Route = { path: string; status: number };
type Fixtures = { page: Page; context: BrowserContext; baseURL: string | undefined };

/** The page at `path` in `theme`: its status, axe, the load to the bottom with no request off the site, no sideways scroll. */
async function checkPage(fixtures: Fixtures, route: Route, theme: Theme): Promise<void> {
  const { page, context, baseURL } = fixtures;
  const { path, status } = route;
  // UISlash Table's overflow-x-auto wrapper does not yet set tabindex="0"; drop this exclusion once
  // @slashsuite/ui-react makes Table's scroll container keyboard-focusable.
  const axeExcluded = path === "/uislash" || path.startsWith("/uislash/") ? ["scrollable-region-focusable"] : [];
  const origin = new URL(baseURL ?? "").origin;
  const leaked: string[] = [];
  await context.route("**/*", async (request) => {
    const url = new URL(request.request().url());
    if (url.origin === origin || url.hostname === "127.0.0.1") return request.fallback();
    leaked.push(url.href);
    return request.abort();
  });
  await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });

  await test.step("answers its status and hydrates", async () => {
    const response = await open(page, path);
    expect(response?.status()).toBe(status);
  });

  await test.step("passes axe", async () => {
    const axe = await new AxeBuilder({ page }).disableRules(axeExcluded).analyze();
    const violations = axe.violations.flatMap((v) =>
      v.nodes.map((n) => `${v.id}: ${n.target.join(" ")} (${n.any.map((c) => c.message).join("; ")})`),
    );
    expect(violations).toEqual([]);
  });

  await test.step("loads to the bottom without leaving the site", async () => {
    await scrollToBottom(page);
    expect(leaked).toEqual([]);
  });

  // After the scroll, so lazy content that loaded on the way down counts too.
  await test.step("never scrolls sideways", async () => {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, "the page scrolls sideways").toBe(0);
  });
}

for (const route of ROUTES.filter((r) => !Object.hasOwn(FLIP_SHOTS, r.path))) {
  for (const theme of THEMES) {
    test(`${route.path} in ${theme}`, async ({ page, context, baseURL }) => {
      await checkPage({ page, context, baseURL }, route, theme);
    });
  }
}

// The pages a person looks at before the flip also leave the whole page in test-results/flip-shots.
for (const [path, shot] of Object.entries(FLIP_SHOTS)) {
  const route = { path, status: 200 };
  for (const theme of THEMES) {
    test(`${path} in ${theme}`, async ({ page, context, baseURL }, info) => {
      await checkPage({ page, context, baseURL }, route, theme);
      await test.step("leaves a full-page shot", async () => {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: resolve(import.meta.dirname, `../test-results/flip-shots/${shot}-${theme}-${info.project.name}.png`),
          fullPage: true,
        });
      });
    });
  }
}
