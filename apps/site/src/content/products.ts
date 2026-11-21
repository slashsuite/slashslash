/**
 * The tools, each with the label that is shown next to its name. Plain data, so a test can check it. Every
 * sentence about a tool is a Claim citing the facts that back it (facts.test.ts).
 */

import type { Claim, FactsProduct } from "#/content/facts";
import { OMNISLASH_HEADLINE, OMNISLASH_INTRO } from "#/content/omnislash";
import type { StageId } from "#/content/stages";

export type Product = {
  name: "PixelSlash" | "ToggleSlash" | "BundleSlash" | "FlakeSlash" | "TaskSlash" | "UISlash" | "OmniSlash";
  /** The release stage, from the shared `STAGES` table. */
  stage: StageId;
  /** The one question it answers about a CI run. */
  question: Claim;
  /** What it is and where it stands, in plain words. */
  summary: Claim[];
  /** The tool's own page on this site, linked from its entry on /developers. */
  page?: string;
  /** Its facts file, which holds its licence; left out for a tool with no repository yet. The footer lists the licences. */
  facts?: FactsProduct;
};

export const PRODUCTS: readonly Product[] = [
  {
    name: "PixelSlash",
    stage: "alpha",
    facts: "pixelslash",
    question: { text: "Does the page look different?", facts: ["pixelslash/what-it-is"] },
    summary: [
      {
        text: "It compares screenshots from before and after a change and points out what really changed.",
        facts: ["pixelslash/compare-two-pngs", "pixelslash/compare-two-urls", "pixelslash/perceptual-diff"],
      },
      {
        text: "Small visual changes are easy to miss by eye. This tool spots them and tells real changes apart from tiny differences nobody would notice, so a redesign doesn't ship by accident.",
        facts: ["pixelslash/perceptual-diff"],
      },
      {
        text: "The diff is a Rust crate compiled to WebAssembly, the same module in the command line tool and the review app. `pixelslash mcp` is an MCP server, so a coding agent can read builds and changed shots and accept or reject a change.",
        facts: ["pixelslash/wasm-diff-engine", "pixelslash/mcp-server"],
      },
    ],
  },
  {
    name: "ToggleSlash",
    stage: "alpha",
    facts: "toggleslash",
    question: {
      text: "Which features are switched on, and for whom?",
      facts: ["toggleslash/what-it-is", "toggleslash/targeting"],
    },
    summary: [
      {
        text: "ToggleSlash is a feature flag service you run yourself: it decides which users see which version of a feature, and you change those decisions from a command line or a web dashboard while the application runs.",
        facts: ["toggleslash/what-it-is"],
      },
      {
        text: "It is being built now. Its source is public under the Elastic License 2.0, and you host it yourself. Today it has a C# server on SQLite with an audit trail of every admin change, a command line, a dashboard, and server SDKs in TypeScript, Python, Go, Java, C# and Ruby that pass the same conformance tests (only the TypeScript one is on npm). Evaluation is one written spec with shared test vectors.",
        facts: [
          "toggleslash/what-it-is",
          "toggleslash/licence",
          "toggleslash/server",
          "toggleslash/audit-trail",
          "toggleslash/cli",
          "toggleslash/typescript-server-sdk",
          "toggleslash/other-server-sdks",
          "toggleslash/dashboard",
          "toggleslash/evaluation-spec",
        ],
      },
    ],
    page: "/toggleslash",
  },
  {
    name: "FlakeSlash",
    stage: "alpha",
    facts: "flakeslash",
    question: { text: "Can the test results be trusted?", facts: ["flakeslash/what-it-is"] },
    summary: [
      {
        text: "It spots automated checks that pass and fail at random, so a failure means something.",
        facts: ["flakeslash/what-it-is", "flakeslash/flake-same-commit"],
      },
      {
        text: "It is being built now. Its source is public under the Elastic License 2.0. Today its command line tool scans GitHub Actions history and lists the jobs that failed and passed on the same commit, grouped into issues with their log excerpts. Readers for other CI systems are planned.",
        facts: [
          "flakeslash/what-it-is",
          "flakeslash/licence",
          "flakeslash/scan-github-actions",
          "flakeslash/flake-same-commit",
          "flakeslash/issue-grouping",
          "flakeslash/redacted-excerpts",
          "flakeslash/later-features",
        ],
      },
    ],
    page: "/flakeslash",
  },
  {
    name: "TaskSlash",
    stage: "alpha",
    facts: "taskslash",
    question: { text: "Why did the tests time out?", facts: ["taskslash/what-it-is"] },
    summary: [
      {
        text: "It queues builds and tests on one machine, so a test fails because of the code, not because everything ran at once.",
        facts: ["taskslash/what-it-is", "taskslash/admission-by-capacity"],
      },
      {
        text: "It is being built now. Its source is public under the MIT license. Today it is a daemon and a command line for Linux that run each job in its own systemd scope, measure what it cost, and start a job only when your computer has capacity for it. There is no release you can install yet: you build it from source with cargo.",
        facts: [
          "taskslash/what-it-is",
          "taskslash/licence",
          "taskslash/daemon-queue",
          "taskslash/measured-runs",
          "taskslash/admission-by-capacity",
          "taskslash/linux-systemd",
          "taskslash/no-release",
        ],
      },
    ],
    page: "/taskslash",
  },
  {
    name: "UISlash",
    stage: "alpha",
    facts: "uislash",
    question: { text: "Can the agent build the UI without writing its own CSS?", facts: ["uislash/what-it-is"] },
    summary: [
      {
        text: "React components (@slashsuite/ui-react) and seven themes (@slashsuite/themes: four light, three dark, one CSS file each), and a site is built from them with props alone because no exported component accepts className or style.",
        facts: [
          "uislash/what-it-is",
          "uislash/react-components",
          "uislash/themes-package",
          "uislash/seven-themes",
          "uislash/no-styling-escape",
        ],
      },
      {
        text: "Early (every package at 0.x) and MIT licensed. Every theme is tested against WCAG AA contrast, a reusable GitHub workflow runs a rule check that fails the pull request plus an advisory model review, and the docs and an llms.txt for agents are at hack-cove.com/ui/.",
        facts: [
          "uislash/what-it-is",
          "uislash/licence",
          "uislash/contrast-checked",
          "uislash/ui-review-workflow",
          "uislash/component-docs",
        ],
      },
    ],
  },
  {
    name: "OmniSlash",
    stage: "alpha",
    facts: "omnislash",
    question: { text: OMNISLASH_HEADLINE, facts: ["omnislash/what-it-is"] },
    summary: [OMNISLASH_INTRO.lead],
    page: "/omnislash",
  },
  {
    name: "BundleSlash",
    stage: "planned",
    question: { text: "Does the app take longer to load?", planned: "BundleSlash" },
    summary: [
      { text: "It measures how much code customers have to download after a change.", planned: "BundleSlash" },
      {
        text: "It would compare the JavaScript bundles of two commits locally, before CI does, for Bun, Vite and webpack builds.",
        planned: "BundleSlash",
      },
    ],
  },
];
