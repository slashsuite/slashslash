import { componentPages } from "@uislash-src/packages/ui-react/docs/components/index";
import { LISTED_PAGES } from "#/pixelslash/doc/docs-map";

/**
 * Every real page on the site, in sitemap order: its public address (no trailing slash except the home page's) and its
 * source file under src/pages. The sitemap lists these and the tests read them; the 404 page is not a page here.
 * A test fails when a .astro page under src/pages is missing from this list.
 */
export const PAGES: readonly { path: string; file: string }[] = [
  { path: "/", file: "index.astro" },
  { path: "/developers", file: "developers.astro" },
  { path: "/flakeslash", file: "flakeslash.astro" },
  { path: "/how-it-works", file: "how-it-works.astro" },
  { path: "/omnislash", file: "omnislash.astro" },
  { path: "/pixelslash", file: "pixelslash/index.astro" },
  { path: "/pixelslash/compare", file: "pixelslash/compare.astro" },
  // PixelSlash's docs: the landing, then each listed page in nav order. Unlisted pages are built but left out.
  { path: "/pixelslash/docs", file: "pixelslash/docs/index.astro" },
  ...LISTED_PAGES.map((page) => ({ path: `/pixelslash/docs/${page.slug}`, file: "pixelslash/docs/[slug].astro" })),
  { path: "/pixelslash/how-it-works", file: "pixelslash/how-it-works.astro" },
  { path: "/pixelslash/pricing", file: "pixelslash/pricing.astro" },
  { path: "/pixelslash/security", file: "pixelslash/security.astro" },
  { path: "/pixelslash/self-host", file: "pixelslash/self-host.astro" },
  { path: "/taskslash", file: "taskslash.astro" },
  { path: "/toggleslash", file: "toggleslash.astro" },
  { path: "/uislash", file: "uislash/index.astro" },
  ...componentPages.map((page) => ({ path: `/uislash/${page.slug}`, file: "uislash/[slug].astro" })),
];
