import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

/*
 * The approved copy for the home page and the PixelSlash how-it-works page, typed here word for word and
 * read against the built pages (`bunx moon run site:test` builds first). It does not import the content
 * modules, so a word changed there fails here. Text in backticks is inline code on the page.
 */

const DIST = resolve(import.meta.dirname, "../../dist");

/** A built page's visible body text: tags and scripts dropped, escapes undone, spaces folded. */
function words(file: string): string {
  const path = resolve(DIST, file);
  if (!existsSync(path)) throw new Error(`No built page at ${path}. Run the build first: bunx moon run site:build.`);
  const html = readFileSync(path, "utf8");
  // From the body on: the head's title repeats the headline, and must not stand in for the h1.
  return html
    .slice(html.indexOf("<body"))
    .replace(/<(script|style|template)[\s\S]*?<\/\1>/g, " ")
    .replace(/<\/(a|span|code|strong|em)>/g, "")
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

const HOME = {
  hero: [
    "Slash takes agent work from an idea to a merged change, and checks it at every step.",
    "OmniSlash carries the work. It refuses to start an agent on a ticket that nobody has drilled. It builds each ticket on its own branch. It has the pull request gated before it merges. The other tools check the work on the way: the parts it is built from, the builds and tests, the screens it changes and the release. Each tool does one job, so you can start with one and leave the rest.",
  ],
  steps: [
    "Where each tool fits",
    "A change goes through the same steps, from the idea to the release. Each Slash product does one job at one of those steps. Start with the one that hurts most.",
    "Planned",
    "An idea becomes a ticket, and the ticket is drilled before any agent starts on it.",
    "OmniSlash refuses to dispatch a ticket that has no drilled section, no done-when item or no recorded check, unless you override it and give a reason. Planned: builders working in parallel are checked for conflicts.",
    "Written",
    "An agent builds the ticket on its own branch, in its own worktree, from ready parts.",
    "OmniSlash opens each builder in a git worktree on the ticket's own branch, and a lease lets only one holder work a ticket or a worktree at a time.",
    "UISlash gives the agent React components that take props alone and accept no className or style, so it cannot style a page off the design. Switching theme changes the whole site with no component change. It has seven themes, each checked against WCAG AA contrast.",
    "Built and tested",
    "The change is built and the automated tests run. A pass should mean the change works, not that the run got lucky.",
    "TaskSlash queues builds and tests and starts each one when your computer has capacity, on one machine today and across your CI runners next, so a test fails because of the code, not because everything ran at once.",
    "FlakeSlash finds the checks that both failed and passed on the same commit, so a failure means something and is not just a reason to run it again.",
    "BundleSlash will measure how much code your customers download after each build, so a page cannot get slower to load one change at a time.",
    "Reviewed",
    "The pull request is gated before it merges, and the reviewer sees what the change does to each page.",
    "Agent skills gate the pull request before merge: reviewers that presume every changed line is wrong, a watch on the pull request, and a merge made by a different role than the one that built it.",
    "PixelSlash takes screenshots of each page before and after the change and shows the reviewer every one that looks different. Anti-aliasing, noise and sub-pixel shifts are not changes. A person accepts or rejects each change in the review app.",
    "Released",
    "The change goes live, to every customer at once or to some first.",
    "ToggleSlash is feature flags you run yourself: choose which customers get a feature, switch it off again without a new release, and keep a record of every switch.",
    "Next, what the tools find goes back to the agent that made the change, so it can fix its own work before a person has to look.",
  ],
  stands: [
    "UISlash, TaskSlash, FlakeSlash, PixelSlash, ToggleSlash and OmniSlash are alphas. Expect the screens, the components and the commands to change, and expect bugs. Between alpha versions, what a tool has stored may be reset: TaskSlash's job history, FlakeSlash's scans and issue corrections, PixelSlash's builds and approvals, ToggleSlash's flags and audit trail, and OmniSlash's work items. UISlash stores nothing.",
    "Where to start:",
    "UISlash: install `@slashsuite/ui-react` and `@slashsuite/themes` from npm into a React 19 app that uses Tailwind v4, and read the docs at hack-cove.com/ui/.",
    "TaskSlash: build it from source with cargo on Linux and run a command through `taskslash run`.",
    "FlakeSlash: run `flakeslash scan` from a checkout against your GitHub Actions history, or sign in to the dashboard at flakeslash.slashslash.build with GitHub.",
    "PixelSlash: install `@hackcove/pixelslash` from npm and compare two URLs that are already running, or start with how it works in CI.",
    "ToggleSlash: run `bun run stack` from a checkout to start the server, the dashboard and an example app on one machine.",
    "OmniSlash: clone it, run `bun install`, then `bun apps/cli/src/index.ts --help`.",
  ],
};

const HOW_IT_WORKS =
  "It differs in where the work happens: a local run needs no server, and its design-system judge runs on your machine, with a local vision model. Screenshots leave the machine only when you upload them, and then only to the server you name. On the held-out half of our own benchmark, measured 2026-10-20, it caught 42 of 45 real changes and wrongly flagged 11 of 36 noise pairs; Argos, on the same pairs, caught 37 and flagged 24.";

describe("the approved copy, word for word on the built pages", () => {
  const home = words("index.html");

  for (const [block, lines] of Object.entries(HOME)) {
    test(`the home carries the ${block} block in order`, () => {
      let from = 0;
      for (const line of lines) {
        const at = home.indexOf(line.replaceAll("`", ""), from);
        expect(at, line).toBeGreaterThan(-1);
        from = at + 1;
      }
    });
  }

  test("the how-it-works page carries the corrected sentence and the benchmark after it, and no hosted judge", () => {
    const page = words("pixelslash/how-it-works.html");
    expect(page).toContain(HOW_IT_WORKS);
    expect(page).not.toContain("hosted judge");
  });

  // The SS-110 copy (Draft C, approved 2026-11-19), word for word, on the page each claim sits on.
  const SS110: [string, string, string][] = [
    ["pixelslash.html", "P1", "Your visual tests flag real changes, not rendering noise. A Rust crate compiled to WebAssembly tells anti-aliasing, faint noise and sub-pixel shifts apart from a real change, and reports changed regions. The command line tool and the review app run the same module, with no JavaScript fallback."],
    ["pixelslash.html", "P2", "Your coding agent can check what its own change did to the screens. pixelslash mcp is an MCP server. A coding agent reads builds and changed shots, then accepts or rejects a change."],
    ["pixelslash.html", "P3", "A person sees every visual change and says yes or no to it. pixelslash upload sends shots to a PixelSlash review app, which diffs them against the default branch and holds the build for a person to accept or reject each change. Name an OpenAI-compatible model in the project and the app explains each change from crops of the changed regions."],
    ["pixelslash.html", "P4", "Shots leave the machine only through pixelslash upload or --upload, and only to the server you name. A model your project sets sees crops of a changed region, never a whole shot."],
    ["toggleslash.html", "T1", "Today it is a server, a command line, server SDKs in TypeScript, Python, Go, Java, C# and Ruby, and a dashboard, and there is no hosted service."],
    ["toggleslash.html", "T2", "Check a flag inside your own process, with no network call per check. The TypeScript SDK installs from npm, keeps an environment's ruleset current and evaluates flags in your process. The Python, Go, Java, C# and Ruby SDKs also evaluate locally and pass the same conformance tests. None of those five is published: they run from a checkout of the repository."],
    ["toggleslash.html", "T3", "A flag should give the same answer whichever language asks. Evaluation is written down once, with shared test vectors in fixtures/evaluation/. The TypeScript engine and the C# evaluator pass every vector."],
    ["developers.html", "D1", "The diff is a Rust crate compiled to WebAssembly, the same module in the command line tool and the review app. pixelslash mcp is an MCP server, so a coding agent can read builds and changed shots and accept or reject a change."],
    ["developers.html", "D2", "Today it has a C# server on SQLite with an audit trail of every admin change, a command line, a dashboard, and server SDKs in TypeScript, Python, Go, Java, C# and Ruby that pass the same conformance tests (only the TypeScript one is on npm). Evaluation is one written spec with shared test vectors."],
  ];
  for (const [file, id, sentence] of SS110) {
    test(`${id} is on ${file}, word for word`, () => {
      expect(words(file)).toContain(sentence);
    });
  }
});
