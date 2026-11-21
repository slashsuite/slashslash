import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { licenceLine } from "#/content/facts";
import { OMNISLASH_REPO_URL, SITE_NAME, SITE_URL } from "#/content/site";
import { STAGES } from "#/content/stages";
import { SECTIONS } from "#/shell/sections";
import { promiseOf, stageOf, TOOLS, type Tool } from "#/tools/tools";

/*
 * The tool homes as the site builds them, read from dist (`bunx moon run site:test` builds
 * first): each from ToolHome, on the shell in their own section, with every command they name, the
 * sections in order, keys set in a step of their own and a copy button on every block.
 */

const DIST = resolve(import.meta.dirname, "../../dist");
const PAGES_DIR = resolve(import.meta.dirname, "../pages");

function read(file: string): string {
  const path = resolve(DIST, file);
  if (!existsSync(path)) throw new Error(`No built page at ${path}. Run the build first: bunx moon run site:build.`);
  return readFileSync(path, "utf8");
}

/**
 * Visible text: tags and scripts dropped, the escapes React and Astro write undone, spaces folded. A
 * span goes with no space, since the code colouring splits a command into spans.
 */
function text(html: string): string {
  return html
    .replace(/<(script|style|template)[\s\S]*?<\/\1>/g, " ")
    .replace(/<\/?span[^>]*>/g, "")
    .replace(/<\/?code[^>]*>/g, "")
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

/** The HTML between the element with one id and the element with the next. */
const between = (html: string, from: string, to: string): string =>
  html.slice(html.indexOf(`id="${from}"`), html.indexOf(`id="${to}"`));

/** The variable each tool's try-it sets to the reader's own key. ToggleSlash (local stack), TaskSlash and OmniSlash need no key. */
const KEY_VARIABLE: Record<Tool["key"], string | undefined> = {
  flakeslash: "GITHUB_TOKEN",
  toggleslash: undefined,
  taskslash: undefined,
  omnislash: undefined,
};

const ORDER = (tool: Tool): string[] => [
  tool.key,
  ...(tool.proof === undefined ? [] : ["proof"]),
  "works-today",
  ...(tool.compared === undefined ? [] : ["compared"]),
  "try-it",
  "planned",
  "docs",
];

/** The tools whose home shows a command on every feature, a lead on every step and a command in the hero. */
const WITH_COMMANDS = [TOOLS.flakeslash, TOOLS.toggleslash, TOOLS.taskslash] as const satisfies readonly Tool[];

describe.each(Object.values(TOOLS))("/$key", (tool: Tool) => {
  const html = read(`${tool.key}.html`);

  test("is built from ToolHome, through the one tool page", () => {
    const source = readFileSync(resolve(PAGES_DIR, `${tool.key}.astro`), "utf8");
    expect(source).toContain(`<ToolPage tool="${tool.key}" />`);
  });

  test("sits on the shell in its own section", () => {
    const classes = html.match(/<html[^>]*\sclass="([^"]*)"/)?.[1]?.split(/\s+/) ?? [];
    expect(classes).toContain(SECTIONS[tool.key].day);
    expect(html).toContain(`<link rel="icon" href="${SECTIONS[tool.key].mark}"`);
  });

  test("has its own canonical address, title and exactly one h1, the promise", () => {
    expect(html).toContain(`<link rel="canonical" href="${SITE_URL}/${tool.key}">`);
    expect(text(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "")).toBe(`${tool.title.text} | ${SITE_NAME}`);
    const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1] ?? ""));
    expect(h1s).toEqual([promiseOf(tool)]);
  });

  test("keeps the sections in order: what it is, today, any comparison, try it, planned, docs", () => {
    const at = ORDER(tool).map((id) => html.indexOf(`id="${id}"`));
    expect(at.every((i) => i >= 0)).toBe(true);
    expect(at.toSorted((a, b) => a - b)).toEqual(at);
  });

  test("lists what is planned under the planned heading, after what works today", () => {
    const planned = text(between(html, "planned", "docs"));
    expect(planned).toContain(tool.planned.lead);
    for (const item of tool.planned.items) expect(planned).toContain(item.text);
  });

  test("links the docs in the tool's repository, and the repository from the hero", () => {
    const docs = html.slice(html.indexOf('id="docs"'));
    for (const link of tool.links) expect(docs).toContain(`href="${link.href}"`);
    expect(between(html, tool.key, "works-today")).toContain(`href="${tool.repo}"`);
    expect(between(html, tool.key, "works-today")).toContain('href="#try-it"');
  });

  test("links /developers, where the suite's tools are told apart", () => {
    expect(html).toContain('href="/developers"');
  });

  test("names its release stage from the shared table, once, in the hero under the h1", () => {
    const { label, sentence } = STAGES[stageOf(tool)];
    expect(html.match(/data-testid="stage"/g)).toHaveLength(1);
    const hero = between(html, tool.key, "works-today");
    const stage = hero.match(/<p data-testid="stage">([\s\S]*?)<\/p>/)?.[1];
    expect(stage).toBeDefined();
    expect(hero.indexOf('data-testid="stage"')).toBeGreaterThan(hero.indexOf("<h1"));
    expect(text(stage ?? "")).toBe(`${label} ${sentence}`);
  });

  test("sets the access key in a step of its own, never to a literal placeholder", () => {
    const lines = text(between(html, "try-it", "planned"));
    expect(lines).not.toContain("=...");
    const variable = KEY_VARIABLE[tool.key];
    const steps = variable === undefined ? [] : [`export ${variable}=<your key>`];
    for (const step of steps) expect(lines).toContain(step);
  });
});

describe.each(WITH_COMMANDS)("/$key, with a command on every feature", (tool: Tool) => {
  const html = read(`${tool.key}.html`);

  test("shows every command it says works today, and every try-it step", () => {
    const today = text(between(html, "works-today", "try-it"));
    for (const feature of tool.today) {
      expect(today).toContain(feature.command);
      expect(today).toContain(feature.text.text.replaceAll("`", ""));
    }
    const tryIt = text(between(html, "try-it", "planned"));
    expect(tryIt).toContain(tool.tryIt.lead.text);
    for (const step of tool.tryIt.steps) {
      expect(tryIt).toContain(step.lead);
      for (const command of step.commands) expect(tryIt).toContain(command);
    }
  });

  test("gives every code block a copy button, and hydrates only the two copy islands", () => {
    const main = html.slice(html.indexOf(`id="${tool.key}"`));
    const figures = main.split("<figure").slice(1).map((chunk) => chunk.slice(0, chunk.indexOf("</figure>")));
    // The hero's command, and one block per try-it step.
    expect(figures).toHaveLength(1 + tool.tryIt.steps.length);
    for (const figure of figures) expect(figure).toMatch(/<button[^>]*aria-label="Copy"/);
    expect(main.match(/aria-label="Copy"/g)).toHaveLength(figures.length);
    const islands = [...html.matchAll(/<astro-island[^>]*component-export="([^"]+)"[^>]*>/g)];
    expect(islands.map((m) => m[1])).toEqual(["HeroCode", "TryIt"]);
    for (const island of islands) expect(island[0]).toContain('client="visible"');
  });
});

/** Visible text with inline code and spans joined to the words around them, as a reader sees them. */
const prose = (part: string): string => text(part.replace(/<\/?(code|strong|span)[^>]*>/g, ""));

/** An island's props, which Astro writes as JSON with each value wrapped as [type, value]: 0 a plain value, 1 an array. */
function unwrap(value: unknown): unknown {
  if (Array.isArray(value)) {
    const [kind, inner]: unknown[] = value;
    return kind === 1 && Array.isArray(inner) ? inner.map(unwrap) : unwrap(inner);
  }
  if (typeof value === "object" && value !== null)
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, unwrap(child)]));
  return value;
}

/*
 * /omnislash against its approved copy, written out here word for word rather than read from content/omnislash.ts,
 * so the test checks the page against the copy and not against itself.
 */
describe("/omnislash, the approved copy", () => {
  const tool: Tool = TOOLS.omnislash;
  const html = read("omnislash.html");

  const heading = (id: string): string => text(html.match(new RegExp(`<h2 id="${id}"[^>]*>([\\s\\S]*?)</h2>`))?.[1] ?? "");

  test("its only h1 is the copy's headline", () => {
    const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => text(m[1] ?? ""));
    expect(h1s).toEqual(["From an idea to a merged change, in one tool."]);
  });

  test("the hero carries the lead and the licence, and no command", () => {
    const hero = prose(between(html, "omnislash", "works-today"));
    expect(hero).toContain(
      "OmniSlash (Omni for short) tracks tickets, projects and the coding agents that work on them. It refuses to start an agent on a ticket until it has a written breakdown and acceptance criteria, builds each ticket in its own git worktree, and hands pull requests to a separate review agent before merge.",
    );
    expect(hero).toContain(licenceLine("omnislash"));
    expect(between(html, "omnislash", "works-today")).not.toContain("<figure");
  });

  test("How a ticket moves: the six steps, each with its command, and the three roles as a list", () => {
    expect(heading("works-today")).toBe("How a ticket moves");
    const section = between(html, "works-today", "compared");
    const today = prose(section);
    const steps: [string, string, string][] = [
      [
        "Ticket readiness gate",
        "spinoff <ticket>",
        "Before an agent can start, a ticket needs a written breakdown (## Drilled), acceptance criteria (## Done when) and a recorded go sign-off on its current text. Without them, OmniSlash refuses to start the agent and queues nothing. You can override with --no-check and a reason. Research spikes follow their own rule: ## Questions, ## Box, ## Done when and a link to the ticket they serve.",
      ],
      [
        "Its own branch and worktree",
        "git worktree add <path> -b <branch>",
        "Dispatch opens each builder as a T3 Code thread in its own git worktree. If a worktree already exists on the ticket's branch, OmniSlash reuses it; otherwise it creates one from origin/main.",
      ],
      [
        "Resource leases",
        "lease acquire|run|release",
        "A lease on ticket:<ref> or worktree:<path> allows one live holder at a time. A second holder is refused until the first releases it or the lease expires, so two agents cannot edit the same ticket or checkout at once.",
      ],
      [
        "Three standing roles",
        "role start|status|end <team> <role>",
        "Agent skills prime a thread for each team role, with one active role run per team role:",
      ],
      [
        "Role inbox and watchdog ticks",
        'send <team> <role> "<text>"',
        "Messages and builder handoffs go into a role's inbox and deliver to its open run, or start a fresh run seeded with role brief (in-flight work, unread inbox, open questions and the prior run's handoff note). role tick checks every 15 minutes for stalled builders, unassigned flakes and idle queues, and rotates runs cleanly when idle or at 200,000 tokens.",
      ],
      [
        "A gated merge",
        "ob-skeptical-review",
        "The builder opens the pull request and stops. Another role runs read-only skeptical reviewers across models (defaulting to Neon and Opus) that presume every changed line is wrong, watches the pull request, and merges it.",
      ],
    ];
    for (const [title, command, body] of steps) {
      expect(today, title).toContain(title);
      expect(today, title).toContain(command);
      expect(today, title).toContain(body);
    }
    expect(tool.today.every((step) => step.command !== undefined)).toBe(true);
    const roles = [...section.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => text(m[1] ?? ""));
    expect(roles).toEqual([
      "Architect: plans, specifies and dispatches every build, then gates and merges.",
      "Sentinel: verifies, merges and deploys every pull request.",
      "Muse: explores an idea and hands over a design once confirmed.",
    ]);
    // The words the copy marks as code are set as code.
    for (const word of ["## Drilled", "## Done when", "go", "--no-check", "## Questions", "## Box", "origin/main"]) {
      expect(section).toMatch(new RegExp(`<code[^>]*>${word}</code>`));
    }
  });

  test("Against Jira and Linear sits between the steps and try it", () => {
    expect(heading("compared")).toBe("Against Jira and Linear");
    expect(prose(between(html, "compared", "try-it"))).toContain(
      "Against Jira and Linear OmniSlash refuses to start an agent on a ticket that has no written breakdown, no acceptance criteria or no recorded sign-off, unless you override it. The Jira and Linear docs name no such check before an agent takes the work.",
    );
  });

  test("Try it: the lead, the clone-and-run block with a copy button, then the sentences after it", () => {
    expect(heading("try-it")).toBe("Try it");
    const section = between(html, "try-it", "planned");
    const words = prose(section);
    const lead = "OmniSlash runs from a fresh clone on Linux with Bun 1.4.2:";
    const after =
      "The last command prints the command reference. Postgres is the default store and needs a connection URL. To try it without Postgres, set OMNISLASH_STORE=sqlite, OMNISLASH_DB_CREATE=1 and OMNISLASH_DB to a new path, then add and list work items in that file. Dispatching a builder requires T3 Code.";
    expect(words).toContain(lead);
    expect(words).toContain(after);
    expect(words.indexOf(lead)).toBeLessThan(words.indexOf("bun install"));
    expect(words.indexOf("bun apps/cli/src/index.ts --help")).toBeLessThan(words.indexOf(after));
    const figures = section.split("<figure").slice(1);
    expect(figures).toHaveLength(1);
    expect(figures[0]).toMatch(/<button[^>]*aria-label="Copy"/);
  });

  test("the TryIt island is handed the four clone-and-run commands, in one block with no lead line", () => {
    const islands = [...html.matchAll(/<astro-island[^>]*component-export="([^"]+)"[^>]*>/g)];
    expect(islands.map((m) => m[1])).toEqual(["TryIt"]);
    const raw = islands[0]?.[0].match(/\sprops="([^"]*)"/)?.[1] ?? "{}";
    const props = unwrap(JSON.parse(raw.replaceAll("&quot;", '"').replaceAll("&amp;", "&")));
    expect(props).toHaveProperty("steps", [
      {
        commands: [
          `git clone ${OMNISLASH_REPO_URL}`,
          "cd omnislash",
          "bun install",
          "bun apps/cli/src/index.ts --help",
        ],
      },
    ]);
  });

  test("Planned: its heading, its lead and the two items", () => {
    expect(heading("planned")).toBe("Planned");
    expect(prose(between(html, "planned", "docs"))).toContain(
      "Planned These are planned, not built. Conflict checks between builders working in parallel. A team server with per-user access.",
    );
  });
});

describe("/developers lists OmniSlash", () => {
  test("with its product list entry and the lead", () => {
    const words = text(read("developers.html"));
    expect(words).toContain(
      "OmniSlash Alpha Changing fast. Expect breaking changes between versions. From an idea to a merged change, in one tool. OmniSlash (Omni for short) tracks tickets, projects and the coding agents that work on them. It refuses to start an agent on a ticket until it has a written breakdown and acceptance criteria, builds each ticket in its own git worktree, and hands pull requests to a separate review agent before merge.",
    );
  });
});
