import { expect, type Page } from "@playwright/test";
import { resolve } from "node:path";
import { open } from "./ready.ts";

/*
 * PixelSlash's docs on the shell, shared by docs.desktop.spec.ts and docs.phone.spec.ts: the landing, a
 * docs file with a screenshot, a cut of docs/cli.md and the generated command index, in each theme, each
 * under the site's header and over its footer, with a full-page shot kept in test-results/docs-shots for a
 * person to look at. What each page contains (its groups, previous and next, screenshots) is in
 * src/pixelslash/doc/docs.built.test.tsx; that it answers, loads and never scrolls sideways is
 * pages.spec.ts.
 */

export const DOCS_PAGES = ["/pixelslash/docs", "/pixelslash/docs/getting-started", "/pixelslash/docs/upload", "/pixelslash/docs/cli"];
export const THEMES = ["light", "dark"] as const;

/** Opens `path` in `theme` and keeps its full-page shot as `<page>-<theme>-<viewport>.png`. */
export async function shootDocs(page: Page, path: string, theme: (typeof THEMES)[number], viewport: string): Promise<void> {
  await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
  await open(page, path);
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeAttached();
  const name = `${path.split("/").at(-1)}-${theme}-${viewport}`;
  await page.screenshot({ path: resolve(import.meta.dirname, `../test-results/docs-shots/${name}.png`), fullPage: true });
}
