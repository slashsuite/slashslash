import { expect, test, type APIRequestContext } from "@playwright/test";
import { NotFound } from "@slashsuite/ui-react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BUILD_COMMIT_PATTERN } from "../src/content/build-commit.ts";
import { PAGES } from "../src/content/pages.ts";

/*
 * After a deploy, against the live host (SMOKE_BASE_URL): robots.txt names the sitemap, the sitemap lists
 * every page, and each page it lists answers 200 itself (no redirect) with its canonical the same URL; the
 * home page names the commit it was built from, and the deployed one when SMOKE_EXPECT_COMMIT is set; and
 * an unknown path answers a real 404 with the site's 404 page, not a 200 fallback. The host has no
 * redirect table, so there is no 301 check.
 */

const h1 = (html: string): string | undefined => /<h1[^>]*>(.*?)<\/h1>/s.exec(html)?.[1];
const heading = h1(renderToStaticMarkup(createElement(NotFound)));

const buildCommitOf = (html: string): string | undefined =>
  /<meta name="build-commit" content="([^"]*)"/.exec(html)?.[1];
const canonicalOf = (html: string): string | undefined => /<link rel="canonical" href="([^"]*)"/.exec(html)?.[1];

/** The sitemap's `<loc>`s, read once per worker. */
let locs: Promise<string[]> | undefined;
function sitemapLocs(request: APIRequestContext): Promise<string[]> {
  locs ??= request
    .get("/sitemap.xml", { maxRedirects: 0 })
    .then((response) => response.text())
    .then((xml) => [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((match) => match[1] ?? ""));
  return locs;
}

test("an unknown path answers 404 with the site's 404 page", async ({ request }) => {
  expect(heading).toBeTruthy();
  const response = await request.get(`/no-such-page-${crypto.randomUUID()}`, { maxRedirects: 0 });
  expect(response.status()).toBe(404);
  // The h1 itself: the 404 page's <title> carries the same words.
  expect(h1(await response.text())).toBe(heading);
});

test("robots.txt answers as plain text and names the sitemap", async ({ request }) => {
  const response = await request.get("/robots.txt", { maxRedirects: 0 });
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/^text\/plain\b/);
  expect(await response.text()).toMatch(/^Sitemap: https:\/\/\S+\/sitemap\.xml$/m);
});

test("the sitemap answers as XML and lists every page", async ({ request }) => {
  const response = await request.get("/sitemap.xml", { maxRedirects: 0 });
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toMatch(/^(application|text)\/xml\b/);
  const paths = (await sitemapLocs(request)).map((loc) => new URL(loc).pathname);
  expect(paths.toSorted()).toEqual(PAGES.map((page) => page.path).toSorted());
});

for (const { path } of PAGES) {
  test(`${path}, as the sitemap lists it, answers 200 with itself as canonical`, async ({ request }) => {
    const loc = (await sitemapLocs(request)).find((url) => new URL(url).pathname === path);
    expect(loc, `the sitemap lists ${path}`).toBeDefined();
    // The loc is the live URL; its path is asked of the host under test.
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status()).toBe(200);
    expect(canonicalOf(await response.text())).toBe(loc);
  });
}

/**
 * One fresh read of the home page's build commit: a new query each time, so no cache answers with an
 * older copy.
 */
async function readCommit(request: APIRequestContext): Promise<{ status: number; seen: string | undefined }> {
  const response = await request.get(`/?commit-check=${crypto.randomUUID()}`, { timeout: 15_000 });
  return { status: response.status(), seen: response.ok() ? buildCommitOf(await response.text()) : undefined };
}

test("the home page names the commit it was built from", async ({ request }) => {
  const { status, seen } = await readCommit(request);
  expect(status, `HTTP ${status}, build-commit ${seen ?? "(none)"}`).toBe(200);
  expect(seen).toMatch(BUILD_COMMIT_PATTERN);
});

const EXPECT_COMMIT = process.env["SMOKE_EXPECT_COMMIT"];
/** How long an edge may keep serving the previous page after the upload before the check fails. */
const COMMIT_WAIT_MS = 120_000;

// Only after a deploy, which says what it deployed.
if (EXPECT_COMMIT !== undefined && EXPECT_COMMIT !== "") {
  test("the home page names the deployed commit", async ({ request }) => {
    test.setTimeout(COMMIT_WAIT_MS + 30_000);
    await expect
      // A dropped connection while the edge switches over counts as not yet, like an older sha.
      .poll(async () => (await readCommit(request).catch(() => undefined))?.seen, {
        message: `the live home page never named the deployed ${EXPECT_COMMIT}`,
        intervals: [5_000],
        timeout: COMMIT_WAIT_MS,
      })
      .toBe(EXPECT_COMMIT);
  });
}
