import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/*
 * The site's visual check: every page in the built sitemap (which holds exactly the page list in
 * src/content/pages.ts, see site.built.test.ts) plus the 404 page, in Slash Day and Slash Night, on a
 * desktop and a phone. Run it after `bunx moon run site:build`; it serves dist with `astro preview`.
 * The upload's server and token come from the environment, never from here (README, "Visual check").
 */

const PORT = 4332;
const BASE = `http://127.0.0.1:${PORT}`;

const sitemap = readFileSync(resolve(import.meta.dirname, "dist/sitemap.xml"), "utf8");
const paths = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map((match) => new URL(match[1] ?? "").pathname);
if (paths.length === 0) throw new Error("dist/sitemap.xml lists no pages: run `bunx moon run site:build` first");

const DESKTOP = { width: 1440, height: 900 };
const PHONE = { width: 393, height: 852 };

export default {
  baseUrl: BASE,
  start: {
    command: `bun run astro preview --host 127.0.0.1 --port ${PORT} --ignore-lock`,
    readyUrl: `${BASE}/`,
  },
  // The 404 page answers 200 at its own address under `astro preview`; an unknown path answers 404,
  // which capture refuses.
  routes: [...paths, "/404"],
  variants: [
    { name: "desktop-light", viewport: DESKTOP, theme: "light", browser: "chromium" },
    { name: "desktop-dark", viewport: DESKTOP, theme: "dark", browser: "chromium" },
    { name: "phone-light", viewport: PHONE, theme: "light", browser: "chromium" },
    { name: "phone-dark", viewport: PHONE, theme: "dark", browser: "chromium" },
  ],
  upload: { baseBranch: "main", project: "slashslash-site" },
};
