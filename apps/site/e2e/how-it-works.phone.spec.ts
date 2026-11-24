import { test } from "@playwright/test";
import { expectStacked } from "./flow.ts";

/* The /how-it-works flow diagram on a phone: every step sits under the one before it (see flow.ts). */

test("on a phone the steps stack top to bottom", async ({ page }) => {
  await expectStacked(page);
});
