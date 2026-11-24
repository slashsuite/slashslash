import { expect, type Locator, type Page, test } from "@playwright/test";
import { open } from "./ready.ts";

/*
 * The docs search: the index is one static file on this site's own origin, queried in the browser.
 * Using the box asks for that file and for nothing else, and the / key reaches the box. The field's
 * name, hint and glass as built are in src/pixelslash/doc/search.built.test.ts; that its results never
 * push a phone's page sideways is search.phone.spec.ts, and where the box sits is the visual check's.
 */

const ERROR = 'has no "entries": needs Storybook 7 or later';

const field = (page: Page): Locator => page.getByRole("searchbox", { name: "Search the docs" });

test("search finds an exact error message, and the only request it makes is the index on this origin", async ({
  page,
  baseURL,
}) => {
  const origin = new URL(baseURL ?? "").origin;
  await open(page, "/pixelslash/docs/install");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  const first = page.getByRole("search").getByRole("link").first();

  await test.step("the query finds the troubleshooting entry, from the index alone", async () => {
    await field(page).focus();
    await field(page).fill(ERROR);
    await expect(first).toHaveAttribute("href", /^\/pixelslash\/docs\/troubleshooting#/);
    expect(requests).toEqual([`${origin}/pixelslash/search-index.json`]);
  });

  await test.step("following the hit lands on its heading", async () => {
    const heading = (await first.getAttribute("aria-label")) ?? "";
    await first.click();
    await page.waitForURL("**/pixelslash/docs/troubleshooting#*");
    await expect(page.getByRole("heading", { name: heading, exact: true })).toBeInViewport();
  });
});

test("a search for nothing says so", async ({ page }) => {
  await open(page, "/pixelslash/docs/install");
  await field(page).fill("zzzqqqxxx");
  await expect(page.getByRole("search").getByText('Nothing matches "zzzqqqxxx".')).toBeVisible();
});

/** On `path`, with the focus off any field, / puts it in the empty search field. */
async function slashFocuses(page: Page, path: string): Promise<void> {
  await open(page, path);
  await page.getByRole("heading", { level: 1 }).click();
  await page.keyboard.press("/");
  await expect(field(page), path).toBeFocused();
  await expect(field(page), path).toHaveValue("");
}

test("/ focuses the search field on /pixelslash/docs and on a docs page", async ({ page }) => {
  await slashFocuses(page, "/pixelslash/docs");
  await slashFocuses(page, "/pixelslash/docs/install");
});

test("/ types into a text field, and Ctrl, Alt or Meta with it does nothing", async ({ page }) => {
  await slashFocuses(page, "/pixelslash/docs");

  await test.step("in the field, / is typed", async () => {
    await field(page).click();
    await page.keyboard.press("/");
    await expect(field(page)).toHaveValue("/");
  });

  await test.step("off it, / with a modifier leaves the focus where it is", async () => {
    await page.getByRole("heading", { level: 1 }).click();
    await page.keyboard.press("Control+/");
    await page.keyboard.press("Alt+/");
    await page.keyboard.press("Meta+/");
    await expect(field(page)).not.toBeFocused();
  });
});
