import { expect, type Page, test } from "@playwright/test";
import { resolve } from "node:path";
import { open } from "./ready.ts";

/*
 * Where the docs search box sits, shared by search.desktop.spec.ts and search.phone.spec.ts: the box's,
 * the All docs link's and the page title's boxes, and a shot before a query and with its results, kept in
 * test-results/search-shots for a person to look at.
 */

export const PLACES = ["/pixelslash/docs", "/pixelslash/docs/upload"];
export const THEMES = ["light", "dark"] as const;

type Box = { x: number; y: number; width: number; height: number };

/* oxlint-disable no-restricted-properties -- look test (where the box sits), moves to PixelSlash in SS-17 */
/** Opens `path` in `theme` and reads where the box, the All docs link and the page title are. */
export async function place(
  page: Page,
  path: string,
  theme: (typeof THEMES)[number],
): Promise<{ box: Box; allDocs: Box; title: Box }> {
  await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
  await open(page, path);
  const [box, allDocs, title] = await Promise.all([
    page.getByRole("searchbox", { name: "Search the docs" }).boundingBox(),
    page.getByRole("navigation", { name: "Docs" }).getByRole("link", { name: "All docs" }).boundingBox(),
    page.getByRole("heading", { level: 1 }).boundingBox(),
  ]);
  const none = { x: Number.NaN, y: Number.NaN, width: Number.NaN, height: Number.NaN };
  return { box: box ?? none, allDocs: allDocs ?? none, title: title ?? none };
}
/* oxlint-enable no-restricted-properties */

/** How far the page scrolls sideways. */
export const sideways = (page: Page): Promise<number> =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

/** A shot of the box before a query and with its results, named `name`. */
export async function shoot(page: Page, name: string): Promise<void> {
  const shots = resolve(import.meta.dirname, "../test-results/search-shots");
  await page.screenshot({ path: `${shots}/${name}-place.png` });
  await test.step("with results", async () => {
    await page.getByRole("searchbox", { name: "Search the docs" }).fill("baseline");
    await expect(page.getByRole("search").getByRole("link").first()).toBeVisible();
    await page.screenshot({ path: `${shots}/${name}-results.png` });
  });
}
