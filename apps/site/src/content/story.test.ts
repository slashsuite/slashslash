import { describe, expect, test } from "vitest";
import { PRODUCTS } from "#/content/products";
import * as story from "#/content/story";

/** Every string in the story module, found by walking each export, so a string added later is checked too. */
function collectStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) for (const item of value) collectStrings(item, out);
  else if (value !== null && typeof value === "object")
    for (const item of Object.values(value)) collectStrings(item, out);
  return out;
}

const strings = collectStrings(story);

/** Splits a paragraph into its sentences, so a test can read one sentence at a time. */
const sentences = (text: string): string[] => text.split(/(?<=\.)\s+/);

/** The tools a sentence names, in the story's own list of tools. */
const namedIn = (text: string): StoryToolName[] =>
  story.STORY_TOOLS.filter((tool) => text.includes(tool));

type StoryToolName = (typeof story.STORY_TOOLS)[number];

const sentenceWith = (text: string, phrase: string): string => {
  const found = sentences(text).find((sentence) => sentence.includes(phrase));
  if (found === undefined) throw new Error(`no sentence contains "${phrase}"`);
  return found;
};

const placedAt = (tool: StoryToolName): string[] =>
  story.PIPELINE.stages.filter((stage) => stage.tools.some((row) => row.tool === tool)).map((stage) => stage.name);

describe("suite story copy", () => {
  test("no string counts the tools", () => {
    const counted =
      /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|all (two|three|four|five|six))\s+(Slash\s+)?(tools?|products?)\b/i;
    expect(strings.filter((text) => counted.test(text))).toEqual([]);
  });

  test("no string contains an en dash or an em dash", () => {
    expect(strings.filter((text) => /[\u2013\u2014]/.test(text))).toEqual([]);
  });

  test("no string uses a word the live site rules out (the live ban, less agent and token)", () => {
    const forbidden =
      /salary|\bclients?\b|employer|job hunt|notice period|Unleash|Flagsmith|GrowthBook|PostHog|Piranha|OpenFeature|LaunchDarkly MCP/i;
    expect(strings.filter((text) => forbidden.test(text))).toEqual([]);
  });

  test("OmniSlash sits at Planned, Written and Reviewed, and every other tool at exactly one step", () => {
    expect(placedAt("OmniSlash")).toEqual(["Planned", "Written", "Reviewed"]);
    for (const tool of story.STORY_TOOLS.filter((name) => name !== "OmniSlash")) {
      expect(placedAt(tool), tool).toHaveLength(1);
    }
    for (const stage of story.PIPELINE.stages) {
      const tools = stage.tools.map((row) => row.tool);
      expect(new Set(tools).size, stage.name).toBe(tools.length);
    }
  });

  test("the pipeline runs in one order: planned, written, built and tested, reviewed, released", () => {
    expect(story.PIPELINE.stages.map((stage) => stage.name)).toEqual([
      "Planned",
      "Written",
      "Built and tested",
      "Reviewed",
      "Released",
    ]);
  });

  test("each tool's row ends with a full stop, and a planned tool says what it will do", () => {
    const planned = new Set<string>(PRODUCTS.filter((p) => p.stage === "planned").map((p) => p.name));
    const rows = story.PIPELINE.stages.flatMap((stage) => stage.tools);
    for (const row of rows) {
      expect(row.does.text.endsWith("."), row.tool).toBe(true);
      expect(row.does.text.includes("?"), row.tool).toBe(false);
    }
    const plannedRows = rows.filter((row) => planned.has(row.tool));
    expect(plannedRows.filter((row) => !/\bwill\b/i.test(row.does.text)).map((row) => row.tool)).toEqual([]);
    const builtRows = rows.filter((row) => !planned.has(row.tool));
    expect(builtRows.filter((row) => row.does.text.startsWith("Will ")).map((row) => row.tool)).toEqual([]);
  });

  test("the alphas sentence names exactly the alpha tools", () => {
    const alpha = PRODUCTS.filter((p) => p.stage === "alpha").map((p) => p.name);
    const alphaSentence = sentenceWith(story.STANDS.stages.text, "are alphas");
    expect(namedIn(alphaSentence).toSorted()).toEqual(alpha.toSorted());
  });

  test("where to start has one item per alpha tool, each opening with its name", () => {
    const alpha = PRODUCTS.filter((p) => p.stage === "alpha").map((p) => p.name);
    const opened = story.STANDS.start.items.map((item) => item.text.slice(0, item.text.indexOf(":")));
    expect(opened.toSorted()).toEqual(alpha.toSorted());
  });

});
