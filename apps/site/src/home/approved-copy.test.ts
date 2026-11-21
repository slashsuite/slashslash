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
    .replace(/<\/?(a|code)\b[^>]*>/g, "")
    .replace(/<\/(span|strong|em)>/g, "")
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
    "Software tools built for coding agents from the ground up.",
    "Dev tools built for one developer opening two pull requests a day break when five coding agents run in parallel on the same machine. Each Slash product solves one step from idea to release, so you can start with the one that hurts most and leave the rest.",
  ],
  steps: [
    "Where each product fits",
    "A change moves through the same steps from idea to release. Each Slash product owns one check along the way, and works on its own.",
    "Planned",
    "An idea becomes a ticket with clear requirements and acceptance criteria before any agent starts coding.",
    "Refuses to start an agent on a ticket until it has a written breakdown, acceptance criteria and a recorded sign-off, unless you explicitly override it with a reason. Planned: conflict checks between coding agents working in parallel.",
    "Written",
    "An agent writes the code in its own git worktree using UI components it cannot style off-brand.",
    "Opens each coding agent in its own git worktree on the ticket's branch, locked with a lease so two agents cannot edit the same ticket or checkout at once.",
    "React 19 components and seven WCAG AA checked themes where no exported component accepts className or style. Switching one CSS class on the page reskins the whole site with no component change.",
    "Built and tested",
    "Builds, typechecks and tests run when the machine has room, and a pass means the code works.",
    "Queues builds, tests and browser runs on one Linux machine and starts each job only when its measured CPU, memory and disk writes fit what is free. Planned: scheduling across a pool of machines and CI runners.",
    "Scans GitHub Actions history and proves which jobs both failed and passed on the same commit, grouping failures into issues with redacted log excerpts and no AI model required.",
    "Will compare JavaScript bundle sizes between commits locally, track dependencies for vulnerabilities that actually reach your code, and cut Conventional Commit releases on command.",
    "Reviewed",
    "A separate reviewer checks the pull request before merge, and reviewers see every visual change.",
    "Hands the pull request to a separate review agent (never the one that wrote the code) for read-only code review across multiple AI models, CI monitoring and merge.",
    "Compares page shots between your main branch and your pull request with a Rust WebAssembly perceptual diff that ignores anti-aliasing, noise and sub-pixel shifts. Reviewers accept or reject changes in the review app, and coding agents can read builds through its MCP server.",
    "Released",
    "Code ships behind a flag, rolled out to some users first and turned off without a redeploy.",
    "Self-hosted feature flags backed by a single C# server and SQLite, with in-process evaluation across six server SDK languages, live stream updates and a full audit trail of every change.",
    "Next: what each product finds feeds back to the coding agent so it can fix its own change before a person has to review it.",
  ],
  stands: [
    "OmniSlash, UISlash, TaskSlash, FlakeSlash, PixelSlash and ToggleSlash are alphas. Expect commands, screens and components to change, and expect bugs. Between alpha versions, stored state may be reset: OmniSlash tickets, TaskSlash job history, FlakeSlash scans and grouped issues, PixelSlash builds and approvals, and ToggleSlash flags and audit trail. UISlash stores nothing.",
    "Start with any product today:",
    "OmniSlash: clone the repo, run `bun install`, then `bun apps/cli/src/index.ts --help`.",
    "UISlash: install `@slashsuite/ui-react` and `@slashsuite/themes` from npm into a React 19 and Tailwind v4 app, and browse the component docs or `/uislash/llms.txt`.",
    "TaskSlash: build from source with `cargo` on Linux, install the systemd user daemon, and run any command through `taskslash run`.",
    "FlakeSlash: run `flakeslash scan` from a checkout against your GitHub Actions history, or sign in with GitHub at flakeslash.slashslash.build.",
    "PixelSlash: install `@slashsuite/pixelslash` from npm to diff two URLs or PNGs locally, or upload shots to the hosted review app at pixelslash.dev.",
    "ToggleSlash: install `@slashsuite/toggleslash` and `@slashsuite/toggleslash-sdk` from npm, or run `bun run stack` from a checkout to start the server, dashboard and example app on one machine.",
    "Want to self-host PixelSlash and ToggleSlash together? One rootless Docker image (`ghcr.io/slashsuite/slashslash:latest`) runs both on one volume, with a Proxmox installer and a Kubernetes Helm chart. See self-hosting details.",
  ],
};

const HOW_IT_WORKS =
  "It differs in where the work happens: a local run needs no server, and its design-system judge runs on your machine, with a local vision model. Shots leave the machine only when you upload them, and then only to the server you name. On the held-out half of our own benchmark, measured 2026-10-20, it caught 42 of 45 real changes and wrongly flagged 11 of 36 noise pairs; Argos, on the same pairs, caught 37 and flagged 24.";

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

  // Key product copy claims checked word for word on the built pages.
  const PRODUCT_CLAIMS: [string, string, string][] = [
    ["pixelslash.html", "P1", "Your visual tests flag real changes, not rendering noise. One Rust crate compiled to WebAssembly separates anti-aliasing, faint noise and sub-pixel shifts from real changes and clusters regions. CLI and review app run the same module, with no JavaScript fallback."],
    ["pixelslash.html", "P2", "pixelslash mcp runs an MCP server so a coding agent can inspect builds and changed shots and accept or reject changes directly."],
    ["pixelslash.html", "P3", "pixelslash upload sends shots to pixelslash.dev (GitHub or Google sign-in) or your own Docker or Cloudflare Workers server. Reviewers step through changes with j/k and a/r, block CI with pixelslash status --wait, and optionally explain changes with an OpenAI-compatible model that sees only changed-region crops."],
    ["pixelslash.html", "P4", "Shots leave the machine only through pixelslash upload or --upload, and only to the server you name. A model your project sets sees crops of a changed region, never a whole shot."],
    ["toggleslash.html", "T1", "ToggleSlash is a self-hosted feature flag service. You run one C# server on SQLite, evaluate flags in process with no network call per check, and change targeting live from the CLI or web dashboard. Every npm package is at 0.2.0 under @slashsuite/*, and there is no public hosted service."],
    ["toggleslash.html", "T2", "Evaluation is written once in docs/evaluation.md with shared test vectors in fixtures/evaluation/. The TypeScript server SDK (0.2.0 on npm) syncs rulesets over a live stream with polling fallback and evaluates in process with zero network call per check. Python, Go, Java, C# and Ruby server SDKs pass the same conformance tests from a repo checkout."],
    ["developers.html", "D1", "Compares Main and Branch shots with a Rust WebAssembly perceptual diff that ignores anti-aliasing, faint noise and sub-pixel shifts, using the same module in the CLI (@slashsuite/pixelslash) and the review app."],
    ["developers.html", "D2", "Self-hosted feature flags backed by one C# (.NET 10) server on SQLite, with in-process evaluation across six server SDK languages (TypeScript on npm at 0.2.0; Python, Go, Java, C# and Ruby from checkout) built from one evaluation spec and shared test vectors."],
  ];
  for (const [file, id, sentence] of PRODUCT_CLAIMS) {
    test(`${id} is on ${file}, word for word`, () => {
      expect(words(file)).toContain(sentence);
    });
  }
});
