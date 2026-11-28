import { expect, test } from "vitest";
import { groupSpans } from "#/pixelslash/doc/DocsGroups";

test("groupSpans pairs close groups and spans the first, a long one, a lopsided one and one left over", () => {
  // 1 beside 7 is the near-empty card beside a full one, so the 1 spans; 14 is past 8, so it spans.
  expect(groupSpans([3, 1, 7, 6, 14, 2, 2, 5])).toEqual([true, true, false, false, true, false, false, true]);
});
