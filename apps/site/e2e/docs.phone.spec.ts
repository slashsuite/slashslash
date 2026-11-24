import { test } from "@playwright/test";
import { DOCS_PAGES, THEMES, shootDocs } from "./docs-shots.ts";

/* PixelSlash's docs on a phone, each theme, with a full-page shot of each (see docs-shots.ts). */

for (const path of DOCS_PAGES) {
  for (const theme of THEMES) {
    test(`${path} in ${theme}`, async ({ page }) => {
      await shootDocs(page, path, theme, "phone");
    });
  }
}
