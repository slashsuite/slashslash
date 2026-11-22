import { describe, expect, test } from "vitest";
import { STORYBOOK_INTRO, STORYBOOK_SCENES, STORYBOOK_TITLE } from "./storybook-data";

/** The en dash and the em dash, written by code point so this file carries neither. */
const LONG_DASHES = new RegExp(`[${String.fromCodePoint(0x2013, 0x2014)}]`);
const BANNED_JARGON = /\b(worktree|git|spinoff|className|origin\/main|cargo|npm|polling|repositories|self-hosted)\b/i;

describe("how-it-works storybook data", () => {
  test("covers all eight chapters in sequence with non-empty alt summaries and tools", () => {
    expect(STORYBOOK_SCENES).toHaveLength(8);
    for (const [index, scene] of STORYBOOK_SCENES.entries()) {
      expect(scene.chapter, scene.id).toBe(index + 1);
      expect(scene.altSummary.length, `${scene.id} altSummary`).toBeGreaterThan(20);
      expect(scene.tools.length, `${scene.id} tools`).toBeGreaterThan(0);
    }
  });

  test("keeps long dashes, banned names, and developer jargon out of every scene", () => {
    const texts = [
      STORYBOOK_TITLE,
      STORYBOOK_INTRO,
      ...STORYBOOK_SCENES.flatMap((scene) => [
        scene.shortLabel,
        scene.stepsLabel,
        scene.title,
        scene.role,
        scene.caption.text,
        scene.altSummary,
        ...scene.tools,
      ]),
    ];
    for (const value of texts) {
      expect(value).not.toMatch(LONG_DASHES);
      expect(value).not.toMatch(/tesla|whatsapp/i);
      expect(value).not.toMatch(BANNED_JARGON);
    }
  });
});
