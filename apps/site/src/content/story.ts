/**
 * The suite story: what Slash is for, in plain words, on the home page and on /developers. Plain
 * typed data, no markup. Pages render these strings as they are; the tests in story.test.ts hold the
 * rules (no counted tools, no dashes, no banned words, every tool in the right place), and every sentence
 * about a tool is a Claim that facts.built.test.ts holds to the tools' facts files.
 */

import type { Claim, FactId } from "#/content/facts";
import { PRODUCTS, type Product } from "#/content/products";

/** A tool the story names: every product on the site. */
export type StoryTool = Product["name"];

/** What each of the built tools is, for the claims about the suite as a whole. */
const SUITE: readonly [FactId, ...FactId[]] = [
  "taskslash/what-it-is",
  "flakeslash/what-it-is",
  "pixelslash/what-it-is",
  "toggleslash/what-it-is",
  "uislash/what-it-is",
];

/** The suite and OmniSlash, which carries the work from one step to the next. */
const SUITE_AND_OMNI: readonly [FactId, ...FactId[]] = [...SUITE, "omnislash/what-it-is"];

export const HERO: { title: Claim; lead: Claim; description: Claim } = {
  title: {
    text: "Software tools built for coding agents from the ground up.",
    facts: SUITE_AND_OMNI,
  },
  lead: {
    text: "Dev tools built for one developer opening two pull requests a day break when five coding agents run in parallel on the same machine. Each Slash product solves one step from idea to release, so you can start with the one that hurts most and leave the rest.",
    facts: SUITE_AND_OMNI,
  },
  description: {
    text: "The Slash suite takes agent work from an idea to a merged release, checking the UI, local builds, flaky tests, visual diffs and feature rollouts along the way.",
    facts: SUITE_AND_OMNI,
  },
};

/** The home's h1 without its full stop, for the footer line, which adds its own. */
export const LANDING_HEADLINE = HERO.title.text.replace(/\.$/, "");

/** The title of the ask at the end of the home, where the questions are. */
export const VIEW = {
  title: "I would like your view",
} as const;

/** A step a change goes through, in the order most teams run them. */
type StageName = "Planned" | "Written" | "Built and tested" | "Reviewed" | "Released";

/** A step of the pipeline: its name, what happens there, and the tools that run there. */
type PipelineStage = {
  name: StageName;
  text: Claim;
  tools: readonly { tool: StoryTool; does: Claim }[];
};

/**
 * The one view of the suite: the steps a change goes through, in order, and under each step the products
 * that run there, each saying what it does there. A planned product says what it will do. OmniSlash runs at
 * more than one step, and says what it does at each.
 */
export const PIPELINE: { title: string; lead: string; stages: readonly PipelineStage[]; next: Claim } = {
  title: "Where each product fits",
  lead: "A change moves through the same steps from idea to release. Each Slash product owns one check along the way, and works on its own.",
  stages: [
    {
      name: "Planned",
      text: {
        text: "An idea becomes a ticket with clear requirements and acceptance criteria before any agent starts coding.",
        facts: ["omnislash/drilled-ticket-gate"],
      },
      tools: [
        {
          tool: "OmniSlash",
          does: {
            text: "Refuses to start an agent on a ticket until it has a written breakdown, acceptance criteria and a recorded sign-off, unless you explicitly override it with a reason. Planned: conflict checks between coding agents working in parallel.",
            facts: ["omnislash/drilled-ticket-gate", "omnislash/parallel-conflict-checks"],
          },
        },
      ],
    },
    {
      name: "Written",
      text: {
        text: "An agent writes the code in its own git worktree using UI components it cannot style off-brand.",
        facts: ["omnislash/agent-build-worktree", "uislash/no-styling-escape"],
      },
      tools: [
        {
          tool: "OmniSlash",
          does: {
            text: "Opens each coding agent in its own git worktree on the ticket's branch, locked with a lease so two agents cannot edit the same ticket or checkout at once.",
            facts: ["omnislash/agent-build-worktree", "omnislash/leases"],
          },
        },
        {
          tool: "UISlash",
          does: {
            text: "React 19 components and seven WCAG AA checked themes where no exported component accepts className or style. Switching one CSS class on the page reskins the whole site with no component change.",
            facts: [
              "uislash/what-it-is",
              "uislash/react-components",
              "uislash/seven-themes",
              "uislash/contrast-checked",
              "uislash/no-styling-escape",
              "uislash/theme-reskins-all",
            ],
          },
        },
      ],
    },
    {
      name: "Built and tested",
      text: {
        text: "Builds, typechecks and tests run when the machine has room, and a pass means the code works.",
        facts: ["taskslash/what-it-is", "flakeslash/what-it-is"],
      },
      tools: [
        {
          tool: "TaskSlash",
          does: {
            text: "Queues builds, tests and browser runs on one Linux machine and starts each job only when its measured CPU, memory and disk writes fit what is free. Planned: scheduling across a pool of machines and CI runners.",
            facts: [
              "taskslash/daemon-queue",
              "taskslash/measured-runs",
              "taskslash/admission-by-capacity",
              "taskslash/machine-pool",
              "taskslash/ci-runners",
            ],
          },
        },
        {
          tool: "FlakeSlash",
          does: {
            text: "Scans GitHub Actions history and proves which jobs both failed and passed on the same commit, grouping failures into issues with redacted log excerpts and no AI model required.",
            facts: [
              "flakeslash/scan-github-actions",
              "flakeslash/flake-same-commit",
              "flakeslash/issue-grouping",
              "flakeslash/redacted-excerpts",
            ],
          },
        },
        {
          tool: "BundleSlash",
          does: {
            text: "Will compare JavaScript bundle sizes between commits locally, track dependencies for vulnerabilities that actually reach your code, and cut Conventional Commit releases on command.",
            planned: "BundleSlash",
          },
        },
      ],
    },
    {
      name: "Reviewed",
      text: {
        text: "A separate reviewer checks the pull request before merge, and reviewers see every visual change.",
        facts: ["omnislash/review-merge-skills", "pixelslash/what-it-is"],
      },
      tools: [
        {
          tool: "OmniSlash",
          does: {
            text: "Hands the pull request to a separate review agent (never the one that wrote the code) for read-only code review across multiple AI models, CI monitoring and merge.",
            facts: ["omnislash/role-delivery", "omnislash/review-merge-skills"],
          },
        },
        {
          tool: "PixelSlash",
          does: {
            text: "Compares page shots between your main branch and your pull request with a Rust WebAssembly perceptual diff that ignores anti-aliasing, noise and sub-pixel shifts. Reviewers accept or reject changes in the review app, and coding agents can read builds through its MCP server.",
            facts: [
              "pixelslash/compare-two-urls",
              "pixelslash/wasm-diff-engine",
              "pixelslash/perceptual-diff",
              "pixelslash/upload-to-review-app",
              "pixelslash/mcp-server",
            ],
          },
        },
      ],
    },
    {
      name: "Released",
      text: {
        text: "Code ships behind a flag, rolled out to some users first and turned off without a redeploy.",
        facts: ["toggleslash/targeting"],
      },
      tools: [
        {
          tool: "ToggleSlash",
          does: {
            text: "Self-hosted feature flags backed by a single C# server and SQLite, with in-process evaluation across six server SDK languages, live stream updates and a full audit trail of every change.",
            facts: [
              "toggleslash/what-it-is",
              "toggleslash/server",
              "toggleslash/typescript-server-sdk",
              "toggleslash/other-server-sdks",
              "toggleslash/live-updates",
              "toggleslash/audit-trail",
            ],
          },
        },
      ],
    },
  ],
  next: {
    text: "Next: what each product finds feeds back to the coding agent so it can fix its own change before a person has to review it.",
    facts: ["pixelslash/mcp-server"],
  },
};

/**
 * Where it stands: the alphas paragraph, where to start with each product, and the combined self-host
 * container. The items are Rich text: `code` renders as inline code and [words](href) as a link.
 */
export const STANDS: {
  title: string;
  stages: Claim;
  start: { title: string; items: readonly Claim[]; external: readonly string[] };
  selfHost: Claim;
} = {
  title: "Where it stands",
  stages: {
    text: "OmniSlash, UISlash, TaskSlash, FlakeSlash, PixelSlash and ToggleSlash are alphas. Expect commands, screens and components to change, and expect bugs. Between alpha versions, stored state may be reset: OmniSlash tickets, TaskSlash job history, FlakeSlash scans and grouped issues, PixelSlash builds and approvals, and ToggleSlash flags and audit trail. UISlash stores nothing.",
    facts: SUITE_AND_OMNI,
  },
  start: {
    title: "Start with any product today:",
    items: [
      {
        text: "OmniSlash: clone the repo, run `bun install`, then `bun apps/cli/src/index.ts --help`.",
        facts: ["omnislash/checkout-linux"],
      },
      {
        text: "UISlash: install `@slashsuite/ui-react` and `@slashsuite/themes` from npm into a React 19 and Tailwind v4 app, and browse [the component docs](/uislash) or [/uislash/llms.txt](/uislash/llms.txt).",
        facts: ["uislash/npm-install", "uislash/themes-package", "uislash/component-docs"],
      },
      {
        text: "TaskSlash: build from source with `cargo` on Linux, install the systemd user daemon, and run any command through `taskslash run`.",
        facts: ["taskslash/no-release", "taskslash/linux-systemd", "taskslash/run-command"],
      },
      {
        text: "FlakeSlash: run `flakeslash scan` from a checkout against your GitHub Actions history, or sign in with GitHub at [flakeslash.slashslash.build](https://flakeslash.slashslash.build).",
        facts: [
          "flakeslash/scan-github-actions",
          "flakeslash/cli-from-checkout",
          "flakeslash/hosted-dashboard",
          "flakeslash/dashboard-sign-in",
        ],
      },
      {
        text: "PixelSlash: install `@slashsuite/pixelslash` from npm to diff two URLs or PNGs locally, or upload shots to the hosted review app at [pixelslash.dev](https://pixelslash.dev).",
        facts: [
          "pixelslash/npm-cli",
          "pixelslash/compare-two-urls",
          "pixelslash/compare-two-pngs",
          "pixelslash/hosted-review-app",
        ],
      },
      {
        text: "ToggleSlash: install `@slashsuite/toggleslash` and `@slashsuite/toggleslash-sdk` from npm, or run `bun run stack` from a checkout to start the server, dashboard and example app on one machine.",
        facts: ["toggleslash/cli-npm", "toggleslash/typescript-packages-npm", "toggleslash/local-stack"],
      },
    ],
    external: ["https://flakeslash.slashslash.build", "https://pixelslash.dev"],
  },
  selfHost: {
    text: "Want to self-host PixelSlash and ToggleSlash together? One rootless Docker image (`ghcr.io/slashsuite/slashslash:latest`) runs both on one volume, with a Proxmox installer and a Kubernetes Helm chart. [See self-hosting details](/developers#self-host).",
    facts: ["pixelslash/self-host-docker", "toggleslash/server-container"],
    repo: ["self-host/README.md", "self-host/proxmox/install.sh"],
  },
};

export const DEVELOPERS: { title: string; next: Claim } = {
  title: "Built for working with agents",
  next: {
    text: "Next, point your agent at it and let it fix its own change first.",
    facts: ["pixelslash/mcp-server"],
  },
};

export const VIEW_QUESTIONS = [
  "When you run several coding agents at once, which step breaks first?",
  "Which Slash product would you try first on your own machine?",
  "Was anything on this page unclear or missing?",
  "Would you adopt these products together or one at a time?",
] as const;

/** The product names the story must place, for the tests: every PRODUCTS entry. */
export const STORY_TOOLS: readonly StoryTool[] = PRODUCTS.map((product) => product.name);
