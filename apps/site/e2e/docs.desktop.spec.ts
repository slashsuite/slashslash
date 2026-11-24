import { test } from "@playwright/test";
import { DOCS_PAGES, THEMES, shootDocs } from "./docs-shots.ts";

/* PixelSlash's docs at 1440px, each theme, with a full-page shot of each (see docs-shots.ts). */

test.use({ viewport: { width: 1440, height: 900 } });

for (const path of DOCS_PAGES) {
  for (const theme of THEMES) {
    test(`${path} in ${theme}`, async ({ page }) => {
      await shootDocs(page, path, theme, "1440");
    });
  }
}
