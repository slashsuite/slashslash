import { expect, type Page, type Response } from "@playwright/test";

/**
 * Opens `path` and waits until the page is ready to use: the layout sets `html[data-hydrated]` once
 * every eager island has hydrated (src/shell/island.tsx), at once on a page with none.
 */
export async function open(page: Page, path: string): Promise<Response | null> {
  const response = await page.goto(path);
  await hydrated(page);
  return response;
}

/** Reloads the page and waits until it is ready to use again, as `open` does. */
export async function reload(page: Page): Promise<void> {
  await page.reload();
  await hydrated(page);
}

const hydrated = (page: Page): Promise<void> => expect(page.locator("html[data-hydrated]")).toBeAttached();
