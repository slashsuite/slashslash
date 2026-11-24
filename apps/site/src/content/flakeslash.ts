/**
 * The /flakeslash page, as plain data so a test can check it. Written by hand from flakeslash 61f9697:
 * packages/cli/src/cli.ts and packages/cli/src/issue.ts (the CLI help) for what works today, and
 * docs/product.md for what is planned. Nothing is fetched at build time, so a change in that repo
 * changes this file by hand. Every product claim here cites the product's FACTS.md (facts.built.test.ts).
 *
 * Commands stay free of `&` and quotes. The one placeholder, `<your key>`, stands where a reader puts
 * their own key; a test decodes the page's `&lt;` and `&gt;` before it looks for a command.
 */

import type { Claim } from "#/content/facts";
import { FLAKESLASH_DASHBOARD_URL, FLAKESLASH_REPO_URL } from "#/content/site";

export { FLAKESLASH_REPO_URL };
const DOCS = `${FLAKESLASH_REPO_URL}/blob/main/docs`;

export const FLAKESLASH_TITLE: Claim = {
  text: "FlakeSlash: know which test failures are real and which are flakes.",
  facts: ["flakeslash/what-it-is", "flakeslash/flake-same-commit"],
};

export const FLAKESLASH_INTRO: { title: string; lead: Claim } = {
  title: "FlakeSlash",
  lead: {
    text: "FlakeSlash scans GitHub Actions history with no change to your pipeline and marks a job flaky only when it both failed and passed on the exact same commit. Run the CLI locally against SQLite, use the hosted dashboard at flakeslash.slashslash.build, or self-host it on Cloudflare Workers.",
    facts: [
      "flakeslash/scan-github-actions",
      "flakeslash/flake-same-commit",
      "flakeslash/local-store",
      "flakeslash/hosted-dashboard",
      "flakeslash/self-hosted-dashboard",
    ],
  },
};

/** The page's description in search results and link previews. */
export const FLAKESLASH_DESCRIPTION: Claim = {
  text: "FlakeSlash scans GitHub Actions history and proves which jobs failed and passed on the same commit, grouping failures into issues locally or on its dashboard.",
  facts: ["flakeslash/scan-github-actions", "flakeslash/flake-same-commit", "flakeslash/issue-grouping", "flakeslash/hosted-dashboard"],
};

export type Feature = {
  title: string;
  /** The command, flag or file that does it, as the CLI help writes it. Shown on the page and checked by a test. */
  command: string;
  text: Claim;
};

/** What works today. */
export const WORKS_TODAY: readonly Feature[] = [
  {
    title: "Same-commit flake proof",
    command: "flakeslash scan owner/repo",
    text: {
      text: "Reads up to 90 days of GitHub Actions history (set `--since` to change) into a local SQLite file, fetching only new runs on later scans. Only a job that failed and passed on the same commit is reported as a flake.",
      facts: ["flakeslash/scan-github-actions", "flakeslash/local-store", "flakeslash/flake-same-commit"],
    },
  },
  {
    title: "Suspects kept separate",
    command: "report.html",
    text: {
      text: "When a job fails on one commit and passes on the next commit of its branch without touching any file named in the failure, FlakeSlash lists it as a suspect. Suspects are never counted as proven flakes.",
      facts: ["flakeslash/suspects", "flakeslash/report-html"],
    },
  },
  {
    title: "Hosted or self-hosted dashboard",
    command: "flakeslash.slashslash.build",
    text: {
      text: "Sign in with GitHub and install the GitHub App. The dashboard scans installed repos every 10 minutes with no webhook, ranks flake candidates per organisation, and expires raw runs and excerpts after 90 days while keeping flake records and daily totals. Or self-host on Cloudflare Workers and D1.",
      facts: [
        "flakeslash/dashboard-sign-in",
        "flakeslash/dashboard-scan",
        "flakeslash/dashboard-ranking",
        "flakeslash/dashboard-expiry",
        "flakeslash/hosted-dashboard",
        "flakeslash/self-hosted-dashboard",
      ],
    },
  },
  {
    title: "Deterministic grouping without a model",
    command: "flakeslash issue list",
    text: {
      text: "Groups matching failures into issues across repos with no AI model required, with ports and timestamps stripped. Built-in patterns name common browser crashes, out-of-memory errors and lost runners.",
      facts: ["flakeslash/issue-grouping", "flakeslash/issue-corrections"],
    },
  },
  {
    title: "Human corrections that stick",
    command: "flakeslash issue confirm|dismiss|rename|merge|split",
    text: {
      text: "Fix any misgrouped issue by hand: confirm a real flake, dismiss noise, rename, merge two issues, or split matching failures into a new issue. Every correction survives future scans.",
      facts: ["flakeslash/issue-corrections"],
    },
  },
  {
    title: "Redacted excerpts, never full logs",
    command: "--store",
    text: {
      text: "Reads each failed job log once, keeps only the redacted lines around the failure with secrets stripped, and links to the full log on GitHub. Writes `report.html` or `--json`. With no model configured, nothing leaves your machine.",
      facts: ["flakeslash/redacted-excerpts", "flakeslash/local-store", "flakeslash/report-html", "flakeslash/json-output"],
    },
  },
  {
    title: "Optional model explanations with a hard cap",
    command: "--model-url / --model-via claude-code",
    text: {
      text: "Off by default. Explain unrecognised issues using your own OpenAI-compatible endpoint or the local `claude` CLI under a hard `--cap-usd` limit. One redacted excerpt is sent per unexplained issue, and the answer never decides what is a flake.",
      facts: ["flakeslash/model-explanations"],
    },
  },
];

/** A try-it step: its commands in one copy block, after the line that leads into them, where there is one. */
export type TryStep = { lead?: string; commands: readonly string[] };

/** How to try it today, from a clone or the hosted dashboard. */
export const TRY_IT: { lead: Claim; steps: readonly TryStep[] } = {
  lead: {
    text: "Sign in with GitHub at flakeslash.slashslash.build, or run the CLI from a checkout with Bun 1.4 or newer (not published on npm yet):",
    facts: ["flakeslash/hosted-dashboard", "flakeslash/cli-not-on-npm", "flakeslash/cli-from-checkout"],
  },
  steps: [
    {
      lead: "Clone it and install:",
      commands: [`git clone ${FLAKESLASH_REPO_URL}`, "cd flakeslash", "bun install"],
    },
    {
      lead: "Give it a GitHub access key that can read your repo. Put your own key where it says <your key>:",
      commands: ["export GITHUB_TOKEN=<your key>"],
    },
    {
      lead: "Then scan the repo:",
      commands: ["bun run flakeslash scan owner/repo"],
    },
  ],
};

/** Planned in flakeslash/FACTS.md. */
export const PLANNED: readonly Claim[] = [
  {
    text: "flakeslash upload and flakeslash scan --upload with project tokens, plus JUnit XML parsing for test-level names and retries.",
    facts: ["flakeslash/upload", "flakeslash/scan-upload-flag", "flakeslash/project-tokens", "flakeslash/junit-reader"],
  },
  {
    text: "Dashboard pages per issue and per pull request, plus a reliability overview by team, repo, provider and runner.",
    facts: ["flakeslash/issue-page", "flakeslash/pr-page", "flakeslash/reliability-overview"],
  },
  {
    text: "One non-blocking GitHub check per pull request showing whether a failure is new or already flaking on main.",
    facts: ["flakeslash/pr-check", "flakeslash/pr-page"],
  },
  {
    text: "Team ownership from CODEOWNERS and optional whole-log storage on self-hosted servers.",
    facts: ["flakeslash/teams-from-codeowners", "flakeslash/whole-log-storage"],
  },
  {
    text: "Later, once detection has earned trust: test quarantine, automatic retries, chat alerts, timing screens, a blocking PR check, and CircleCI and Jenkins readers.",
    facts: ["flakeslash/later-features"],
  },
];

export const LINKS: readonly { label: string; href: string }[] = [
  { label: "Hosted dashboard", href: FLAKESLASH_DASHBOARD_URL },
  { label: "Repository on GitHub", href: FLAKESLASH_REPO_URL },
  { label: "Getting started", href: `${DOCS}/getting-started.md` },
  { label: "Self-hosting the dashboard", href: `${DOCS}/deploying.md` },
];
