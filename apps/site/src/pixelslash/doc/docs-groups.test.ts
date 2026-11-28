import { describe, expect, test } from "vitest";
import { groupSpans } from "#/pixelslash/doc/DocsGroups";

describe("groupSpans", () => {
  test("the first group spans, and two close groups share a row", () => {
    expect(groupSpans([3, 6, 8])).toEqual([true, false, false]);
  });

  test("a short group beside a much longer one spans instead of pairing", () => {
    // 1 link beside 7 is the near-empty card beside a full one.
    expect(groupSpans([3, 1, 7, 2, 2])).toEqual([true, true, true, false, false]);
  });

  test("a group longer than 8 links always spans, and so does one left without a partner", () => {
    expect(groupSpans([3, 5, 14, 4])).toEqual([true, true, true, true]);
  });
});
