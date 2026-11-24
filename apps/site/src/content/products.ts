/**
 * The tools, each with the label that is shown next to its name. Plain data, so a test can check it. Every
 * sentence about a tool is a Claim citing the facts that back it (facts.built.test.ts).
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
    name: "OmniSlash",
    stage: "alpha",
    facts: "omnislash",
    question: { text: OMNISLASH_HEADLINE, facts: ["omnislash/what-it-is"] },
    summary: [OMNISLASH_INTRO.lead],
    page: "/omnislash",
  },
  {
    name: "UISlash",
    stage: "alpha",
    facts: "uislash",
    question: { text: "UI components your agents cannot style wrong.", facts: ["uislash/what-it-is"] },
    summary: [
      {
        text: "React 19 components (`@slashsuite/ui-react`) and seven WCAG AA checked themes (`@slashsuite/themes`: four light, three dark, one CSS file each). No exported component accepts `className` or `style`, so people and coding agents compose pages from props alone.",
        facts: [
          "uislash/what-it-is",
          "uislash/react-components",
          "uislash/themes-package",
          "uislash/seven-themes",
          "uislash/contrast-checked",
          "uislash/no-styling-escape",
        ],
      },
      {
        text: "Open source under the MIT licence. Includes status pages, a reusable GitHub Actions PR review workflow, component docs at `/uislash` and a plain-text `/uislash/llms.txt` reference for coding agents.",
        facts: [
          "uislash/licence",
          "uislash/status-pages",
          "uislash/ui-review-workflow",
          "uislash/component-docs",
        ],
      },
    ],
    page: "/uislash",
  },
  {
    name: "TaskSlash",
    stage: "alpha",
    facts: "taskslash",
    question: { text: "Admission control for builds and tests on one machine.", facts: ["taskslash/what-it-is", "taskslash/admission-by-capacity"] },
    summary: [
      {
        text: "Queues builds, tests and browser runs on one Linux machine so a test fails because of the code, not because parallel agents ran everything at once.",
        facts: ["taskslash/what-it-is", "taskslash/admission-by-capacity"],
      },
      {
        text: "Open source under the MIT licence. A local daemon runs each job in its own systemd scope, measures CPU, memory and disk writes, schedules moon targets by dependency order, and exposes `taskslash top`, `taskslash cancel` and per-job logs. Build from source with cargo.",
        facts: [
          "taskslash/licence",
          "taskslash/daemon-queue",
          "taskslash/measured-runs",
          "taskslash/moon-targets",
          "taskslash/top",
          "taskslash/cancel",
          "taskslash/job-logs",
          "taskslash/no-release",
        ],
      },
    ],
    page: "/taskslash",
  },
  {
    name: "FlakeSlash",
    stage: "alpha",
    facts: "flakeslash",
    question: { text: "Know which test failures are real and which are flakes.", facts: ["flakeslash/what-it-is", "flakeslash/flake-same-commit"] },
    summary: [
      {
        text: "Scans GitHub Actions history with no change to your pipeline and marks a job flaky only when it both failed and passed on the same commit, keeping suspects separate.",
        facts: ["flakeslash/what-it-is", "flakeslash/scan-github-actions", "flakeslash/flake-same-commit", "flakeslash/suspects"],
      },
      {
        text: "Source available under the Elastic License 2.0. Groups failures into issues with redacted log excerpts and no model required. Run locally from a checkout against SQLite, use the hosted dashboard at flakeslash.slashslash.build, or self-host on Cloudflare Workers.",
        facts: [
          "flakeslash/licence",
          "flakeslash/issue-grouping",
          "flakeslash/redacted-excerpts",
          "flakeslash/cli-from-checkout",
          "flakeslash/hosted-dashboard",
          "flakeslash/self-hosted-dashboard",
        ],
      },
    ],
    page: "/flakeslash",
  },
  {
    name: "PixelSlash",
    stage: "alpha",
    facts: "pixelslash",
    question: { text: "See what your change did to the page.", facts: ["pixelslash/what-it-is"] },
    summary: [
      {
        text: "Compares Main and Branch shots with a Rust WebAssembly perceptual diff that ignores anti-aliasing, faint noise and sub-pixel shifts, using the same module in the CLI (`@slashsuite/pixelslash`) and the review app.",
        facts: [
          "pixelslash/compare-two-pngs",
          "pixelslash/compare-two-urls",
          "pixelslash/perceptual-diff",
          "pixelslash/wasm-diff-engine",
          "pixelslash/npm-cli",
        ],
      },
      {
        text: "Source available under the Elastic License 2.0. Runs locally for free, checks flaky shots, Storybook stories and native PNGs, exposes an MCP server (`pixelslash mcp`) for coding agents, and uploads to pixelslash.dev or your own self-hosted server.",
        facts: [
          "pixelslash/licence",
          "pixelslash/local-unless-upload",
          "pixelslash/flaky-shot-detection",
          "pixelslash/storybook-stories",
          "pixelslash/native-screenshots",
          "pixelslash/mcp-server",
          "pixelslash/hosted-review-app",
          "pixelslash/self-host-docker",
        ],
      },
    ],
    page: "/pixelslash",
  },
  {
    name: "ToggleSlash",
    stage: "alpha",
    facts: "toggleslash",
    question: {
      text: "Feature flags you self-host, with one spec across languages.",
      facts: ["toggleslash/what-it-is", "toggleslash/evaluation-spec"],
    },
    summary: [
      {
        text: "Self-hosted feature flags backed by one C# (.NET 10) server on SQLite, with in-process evaluation across six server SDK languages (TypeScript on npm at 0.2.0; Python, Go, Java, C# and Ruby from checkout) built from one evaluation spec and shared test vectors.",
        facts: [
          "toggleslash/what-it-is",
          "toggleslash/server",
          "toggleslash/typescript-server-sdk",
          "toggleslash/typescript-packages-npm",
          "toggleslash/other-server-sdks",
          "toggleslash/evaluation-spec",
        ],
      },
      {
        text: "Source available under the Elastic License 2.0. Includes a CLI, web dashboard, browser SDK with secure mode, OpenTelemetry tracing hook, live stream updates, privacy-safe usage counts and a full audit trail of every admin write.",
        facts: [
          "toggleslash/licence",
          "toggleslash/cli",
          "toggleslash/dashboard",
          "toggleslash/browser-sdk",
          "toggleslash/secure-mode",
          "toggleslash/opentelemetry-tracing",
          "toggleslash/live-updates",
          "toggleslash/usage-counts",
          "toggleslash/audit-trail",
        ],
      },
    ],
    page: "/toggleslash",
  },
  {
    name: "BundleSlash",
    stage: "planned",
    question: { text: "Does the app take longer to load, or ship vulnerable packages?", planned: "BundleSlash" },
    summary: [
      {
        text: "Will compare JavaScript bundle sizes between commits locally before CI, for Bun, Vite and webpack builds.",
        planned: "BundleSlash",
      },
      {
        text: "Will also track a package catalogue with vulnerability and compromise alerts checked for reachability in your code, and cut Conventional Commit releases on command.",
        planned: "BundleSlash",
      },
    ],
  },
];
