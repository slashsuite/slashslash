/*
 * Every product claim on the site against the products' own facts files, read at the commits
 * facts.sha.json pins (`bunx moon run site:test` fetches and builds first):
 *
 * - every claim cites facts, and every cited id is in its product's FACTS.md;
 * - a claim citing a Planned fact is never under a "today" label, and reads as planned;
 * - a claim about a tool with no repository yet reads as planned;
 * - each product page's licence line is its facts file's licence text, read from the file;
 * - the wrong claims found on 2026-11-17 never come back on the built site.
 *
 * A claim is any object with `text` and `facts` (or `planned`), found by walking every export of the
 * modules below. The types make a product claim an object, so a claim without `facts` fails typecheck.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import * as flakeslash from "#/content/flakeslash";
import * as flow from "#/content/flow";
import * as howItWorks from "#/content/how-it-works";
import * as howItWorksRoles from "#/content/how-it-works-roles";
import * as howItWorksSteps from "#/content/how-it-works-steps";
import * as omnislash from "#/content/omnislash";
import * as products from "#/content/products";
import * as story from "#/content/story";
import * as taskslash from "#/content/taskslash";
import * as toggleslash from "#/content/toggleslash";
import * as developersSelfHost from "#/developers/self-host";
import * as developersToday from "#/developers/today";
import * as developersTools from "#/developers/tools";
import * as homeTools from "#/home/tools";
import * as howItWorksStorybook from "#/how-it-works/storybook-data";
import * as psPages from "#/pixelslash/content/pages";
import * as psPricing from "#/pixelslash/content/pricing";
import * as psCompare from "#/pixelslash/pages/compare";
import * as psHome from "#/pixelslash/pages/home";
import * as psHowItWorks from "#/pixelslash/pages/how-it-works";
import * as tools from "#/tools/tools";
import { FACTS, type FactsProduct, factKind, isFactsProduct, licenceLine, parseFacts } from "./facts";

const SITE = resolve(import.meta.dirname, "../..");
const REPO = resolve(SITE, "../..");
const DIST = resolve(SITE, "dist");

/** Every module that holds product claims, by the name a failure prints. */
const MODULES: Record<string, object> = {
  "content/products": products,
  "content/story": story,
  "content/flow": flow,
  "content/how-it-works": howItWorks,
  "content/how-it-works-roles": howItWorksRoles,
  "content/how-it-works-steps": howItWorksSteps,
  "how-it-works/storybook-data": howItWorksStorybook,
  "content/toggleslash": toggleslash,
  "content/flakeslash": flakeslash,
  "content/taskslash": taskslash,
  "content/omnislash": omnislash,
  "home/tools": homeTools,
  "tools/tools": tools,
  "developers/self-host": developersSelfHost,
  "developers/today": developersToday,
  "developers/tools": developersTools,
  "pixelslash/content/pages": psPages,
  "pixelslash/content/pricing": psPricing,
  "pixelslash/pages/home": psHome,
  "pixelslash/pages/how-it-works": psHowItWorks,
  "pixelslash/pages/compare": psCompare,
};

/** The modules that are only views of claims held elsewhere, so they may hold none of their own. */
const VIEWS = new Set(["home/tools", "tools/tools", "developers/tools"]);

/** A key whose values a page shows under a "today" label: a tool home's "What works today", /developers' Today. */
const TODAY_KEY = /^(works_today|today)$/i;
/** A key whose values are presented as planned. */
const PLANNED_KEY = /planned/i;
/** Words that make a sentence read as not built yet. */
const READS_PLANNED = /\b(planned|will|would|next|not built|not yet|could|coming)\b/i;

type Found = {
  where: string;
  text: string;
  facts: readonly string[];
  planned?: string;
  repo: readonly string[];
  today: boolean;
  plannedContext: boolean;
};

type Context = { today: boolean; planned: boolean };
type ClaimLike = { text: string; facts?: unknown; planned?: unknown; repo?: unknown };

function isClaim(value: object): value is ClaimLike {
  return "text" in value && typeof value.text === "string" && ("facts" in value || "planned" in value);
}

function found(claim: ClaimLike, where: string, context: Context): Found {
  return {
    where,
    text: claim.text,
    facts: Array.isArray(claim.facts) ? claim.facts : [],
    ...(typeof claim.planned === "string" ? { planned: claim.planned } : {}),
    repo: Array.isArray(claim.repo) ? claim.repo : [],
    today: context.today,
    plannedContext: context.planned,
  };
}

/** Every claim under a value, with the labels it sits under. */
function* claimsIn(value: unknown, where: string, context: Context, seen: Set<unknown>): Generator<Found> {
  if (typeof value !== "object" || value === null || seen.has(value)) return;
  if (isClaim(value)) {
    yield found(value, where, context);
    return;
  }
  seen.add(value);
  const planned = context.planned || ("stage" in value && value.stage === "planned");
  for (const [key, child] of Object.entries(value)) {
    const inner = { today: context.today || TODAY_KEY.test(key), planned: planned || PLANNED_KEY.test(key) };
    yield* claimsIn(child, `${where}.${key}`, inner, seen);
  }
}

const CLAIMS: { module: string; claims: Found[] }[] = Object.entries(MODULES).map(([module, namespace]) => ({
  module,
  claims: [...claimsIn(namespace, module, { today: false, planned: false }, new Set())],
}));
const ALL = CLAIMS.flatMap((entry) => entry.claims);

describe("the facts files", () => {
  test("each parses into its sections, with a licence", () => {
    for (const facts of Object.values(FACTS)) {
      expect(facts.whatItIs, facts.product).not.toBe("");
      expect(facts.today.size, facts.product).toBeGreaterThan(0);
      expect(facts.licence, facts.product).not.toBe("");
      expect(facts.whereItRuns.size, facts.product).toBeGreaterThan(0);
    }
  });

  test("UISlash's facts resolve by id: its What it is paragraph and a Where it runs fact", () => {
    expect(factKind("uislash/what-it-is")).toBe("what");
    expect(factKind("uislash/tested-in-chromium")).toBe("where");
  });

  test("OmniSlash's facts resolve by id", () => {
    expect(factKind("omnislash/what-it-is")).toBe("what");
    expect(factKind("omnislash/item-tracking")).toBe("today");
    expect(factKind("omnislash/checkout-linux")).toBe("where");
    expect(factKind("omnislash/drilled-ticket-gate")).toBe("today");
    expect(factKind("omnislash/team-server")).toBe("planned");
  });

  test("a file of another shape fails, naming the product and the line", () => {
    const good = readFileSync(resolve(SITE, ".sources/facts/taskslash.md"), "utf8");
    expect(() => parseFacts("taskslash", good.replace("## Planned", "## Later"))).toThrow(
      /^taskslash FACTS\.md line \d+: expected the heading "## Planned"/,
    );
    expect(() => parseFacts("taskslash", good.replace("- `run-command`:", "- run-command:"))).toThrow(
      /^taskslash FACTS\.md line \d+: expected a fact line/,
    );
  });
});

describe("every product claim", () => {
  test("is found in each module that holds claims", () => {
    const empty = CLAIMS.filter(({ module, claims }) => !VIEWS.has(module) && claims.length === 0);
    expect(empty.map(({ module }) => `${module} holds no claim objects`)).toEqual([]);
  });

  test("cites at least one fact, or names an unbuilt tool", () => {
    for (const claim of ALL) {
      expect(claim.facts.length > 0 || claim.planned !== undefined, `${claim.where}: "${claim.text}"`).toBe(true);
    }
  });

  test("cites only ids that are in its product's facts file at the pinned commit", () => {
    for (const claim of ALL) {
      for (const id of claim.facts) {
        expect(factKind(id), `${claim.where} cites ${id}, which is in no facts file`).toBeDefined();
      }
    }
  });

  test("names only files of this repository that exist", () => {
    for (const claim of ALL) {
      for (const path of claim.repo) expect(existsSync(resolve(REPO, path)), `${claim.where}: ${path}`).toBe(true);
    }
  });

  test("never puts a Planned fact under a today label", () => {
    const wrong = ALL.flatMap((claim) => {
      const planned = claim.facts.filter((id) => factKind(id) === "planned");
      return claim.today && planned.length > 0 ? [`${claim.where} cites ${planned.join(", ")}`] : [];
    });
    expect(wrong).toEqual([]);
  });

  test("reads as planned when it cites a Planned fact or names an unbuilt tool", () => {
    const wrong = ALL.filter(
      (claim) =>
        (claim.facts.some((id) => factKind(id) === "planned") || claim.planned !== undefined) &&
        !(claim.plannedContext || READS_PLANNED.test(claim.text)),
    );
    expect(wrong.map((claim) => `${claim.where}: "${claim.text}"`)).toEqual([]);
  });
});

/** Visible text: tags and scripts dropped, the escapes React and Astro write undone, spaces folded. */
function text(html: string): string {
  return html
    .replace(/<(script|style|template)[\s\S]*?<\/\1>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replaceAll("&#39;", "'")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replace(/\s+/g, " ")
    .trim();
}

function built(file: string): string {
  const path = resolve(DIST, file);
  if (!existsSync(path)) throw new Error(`No built page at ${path}. Run the build first: bunx moon run site:build.`);
  return readFileSync(path, "utf8");
}

const PAGES = readdirSync(DIST, { recursive: true, encoding: "utf8" }).filter((file) => file.endsWith(".html"));

describe("the licence lines", () => {
  /** The pages that must state a product's licence, and whose. */
  const REQUIRED: Record<string, FactsProduct> = {
    "omnislash.html": "omnislash",
    "uislash.html": "uislash",
    "taskslash.html": "taskslash",
    "flakeslash.html": "flakeslash",
    "pixelslash.html": "pixelslash",
    "pixelslash/pricing.html": "pixelslash",
    "toggleslash.html": "toggleslash",
    "developers.html": "pixelslash",
  };

  test("each product page states its product's licence in the facts file's words", () => {
    for (const [file, product] of Object.entries(REQUIRED)) {
      const lines = [...built(file).matchAll(new RegExp(`data-licence-line="${product}"[^>]*>([\\s\\S]*?)</`, "g"))];
      expect(lines.length, `${file} has no ${product} licence line`).toBeGreaterThan(0);
    }
  });

  test("every licence line on the site is its facts file's licence text", () => {
    for (const file of PAGES) {
      for (const match of built(file).matchAll(/data-licence-line="([a-z]+)"[^>]*>([\s\S]*?)<\//g)) {
        const product = match[1] ?? "";
        const want = isFactsProduct(product) ? licenceLine(product) : `(${product} has no facts file)`;
        expect(text(match[2] ?? ""), `${file}: ${product}`).toBe(want);
      }
    }
  });
});

/**
 * The wrong claims found on 2026-11-17, each with the fact it broke. A regression guard only: the checks
 * above are the main ones.
 */
const WRONG: readonly { phrase: string; why: string }[] = [
  { phrase: "open source (MIT)", why: "pixelslash/licence is Elastic-2.0" },
  { phrase: "Run it in CI today", why: "true of PixelSlash only" },
  { phrase: "so you know what turning one on will do", why: "no toggleslash fact backs a verdict" },
  { phrase: "and you host it yourself. Today its command line tool", why: "flakeslash/hosted-dashboard" },
  { phrase: "A dashboard and readers for other CI systems are planned", why: "flakeslash/dashboard-scan is today" },
  { phrase: "A dashboard, hosted or self-hosted, with GitHub sign-in", why: "flakeslash/dashboard-sign-in is today" },
  { phrase: "It would report whether a failure happens only with the flag on", why: "no flakeslash fact backs it" },
  { phrase: "nothing is published yet", why: "toggleslash/cli-npm and typescript-packages-npm" },
  { phrase: "It is not published as a package", why: "toggleslash/typescript-packages-npm" },
  { phrase: "probably safe to remove", why: "no toggleslash fact, today or planned, backs the verdict" },
  { phrase: "A migration path from LaunchDarkly", why: "not in toggleslash's Planned" },
  { phrase: "A release you can install is planned", why: "taskslash/no-release is today; no Planned fact" },
  { phrase: "Today that means running the review server yourself", why: "pixelslash/hosted-review-app" },
  { phrase: "Paid hosting is planned, not available", why: "pixelslash/hosted-review-app" },
];

describe("the built site", () => {
  test("carries none of the wrong claims found on 2026-11-17", () => {
    expect(PAGES.length).toBeGreaterThan(0);
    for (const file of PAGES) {
      const words = text(built(file));
      for (const { phrase, why } of WRONG) expect(words, `${file}: "${phrase}" (${why})`).not.toContain(phrase);
    }
  });
});
