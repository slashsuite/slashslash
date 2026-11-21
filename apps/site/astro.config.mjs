import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { realpathSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = (path) => fileURLToPath(new URL(path, import.meta.url));

// bunfig.toml links every package into Bun's one global store (~/.bun/install/cache/links), outside
// the repo. The dev server only serves files under the repo by default, so it refused (403) the React
// runtime the islands load, and nothing hydrated: no motion, no copy buttons. It may also read the
// store, found from where react really lives.
const store = (() => {
  const real = realpathSync(here("./node_modules/react"));
  return dirname(real.slice(0, real.indexOf("/node_modules/")));
})();

// The slashslash pages and the PixelSlash pages under /pixelslash, built to static HTML on the Slash
// shell. React renders the pages at build time; only the colour scheme toggle, the copy buttons, the
// motion, the tool home blocks and the docs search are hydrated in the browser.
export default defineConfig({
  site: "https://slashslash.build",
  trailingSlash: "never",
  integrations: [react()],
  build: {
    // developers.html, not developers/index.html: Cloudflare Pages serves it at /developers with no redirect.
    format: "file",
    // The stylesheet stays a file, so the tests can read it and the browser can cache it.
    inlineStylesheets: "never",
  },
  vite: {
    plugins: [tailwindcss()],
    // Astro has no --strictPort flag. A busy port fails the dev server and the browser tests instead of
    // moving the server to a port nobody leased or the tests do not look at.
    server: { strictPort: true, fs: { allow: [here("../.."), store] } },
    preview: { strictPort: true },
    resolve: {
      alias: {
        // The PixelSlash files scripts/fetch-sources.ts downloads at the pinned commit.
        "@pixelslash-src": here("./.sources/pixelslash"),
        // Each product's FACTS.md, at the commit facts.sha.json pins.
        "@facts": here("./.sources/facts"),
        // The UISlash docs data and story closure scripts/fetch-sources.ts downloads at uislash.sha.json's commit.
        "@uislash-src": here("./.sources/uislash"),
      },
    },
  },
});
