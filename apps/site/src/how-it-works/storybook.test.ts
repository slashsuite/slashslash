import { describe, expect, test } from "vitest";
import { STORYBOOK_LABEL, STORYBOOK_PRODUCTS, STORYBOOK_SCENES } from "./storybook-data";

/** The en dash and the em dash, written by code point so this file carries neither. */
const LONG_DASHES = new RegExp(`[${String.fromCodePoint(0x2013, 0x2014)}]`);
const BANNED_JARGON = /\b(worktree|git|spinoff|className|origin\/main|npm|cargo|polling|repositories|self-hosted)\b/i;

const captionText = (caption: string | { text: string }): string => (typeof caption === "string" ? caption : caption.text);

describe("how-it-works storybook data", () => {
  test("covers all nine chapters in sequence with non-empty alt summaries", () => {
    expect(STORYBOOK_SCENES).toHaveLength(9);
    for (const [index, scene] of STORYBOOK_SCENES.entries()) {
      expect(scene.chapter, scene.id).toBe(index + 1);
      expect(scene.altSummary.length, `${scene.id} altSummary`).toBeGreaterThan(20);
    }
  });

  test("every product in the bar appears in at least one scene", () => {
    for (const product of STORYBOOK_PRODUCTS) {
      expect(STORYBOOK_SCENES.some((scene) => scene.products.includes(product.name)), product.name).toBe(true);
    }
  });

  test("keeps long dashes, banned names, and developer jargon out of every scene", () => {
    const texts = [
      STORYBOOK_LABEL,
      ...STORYBOOK_SCENES.flatMap((scene) => [
        scene.title,
        captionText(scene.caption),
        scene.altSummary,
        ...scene.products,
      ]),
    ];
    for (const value of texts) {
      expect(value).not.toMatch(LONG_DASHES);
      expect(value).not.toMatch(/tesla|whatsapp/i);
      expect(value).not.toMatch(BANNED_JARGON);
    }
  });
});
