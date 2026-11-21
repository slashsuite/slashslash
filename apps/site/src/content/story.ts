/**
 * The suite story: what Slash is for, in plain words, on the home page and on /developers. Plain
 * typed data, no markup. Pages render these strings as they are; the tests in story.test.ts hold the
 * rules (no counted tools, no dashes, no banned words, every tool in the right place), and every sentence
 * about a tool is a Claim that facts.test.ts holds to the tools' facts files.
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

export const HERO: { title: Claim; lead: Claim } = {
  title: {
    text: "Slash takes agent work from an idea to a merged change, and checks it at every step.",
    facts: SUITE_AND_OMNI,
  },
  lead: {
    text: "OmniSlash carries the work. It refuses to start an agent on a ticket that nobody has drilled. It builds each ticket on its own branch. It has the pull request gated before it merges. The other tools check the work on the way: the parts it is built from, the builds and tests, the screens it changes and the release. Each tool does one job, so you can start with one and leave the rest.",
    facts: [
      ...SUITE_AND_OMNI,
      "omnislash/drilled-ticket-gate",
      "omnislash/agent-build-worktree",
      "omnislash/review-merge-skills",
    ],
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
 * The one view of the suite: the steps a change goes through, in order, and under each step the tools
 * that run there, each saying what it does there. A planned tool says what it will do. OmniSlash runs at
 * more than one step, and says what it does at each.
 */
export const PIPELINE: { title: string; lead: string; stages: readonly PipelineStage[]; next: Claim } = {
  title: "Where each tool fits",
  lead: "A change goes through the same steps, from the idea to the release. Each Slash product does one job at one of those steps. Start with the one that hurts most.",
  stages: [
    {
      name: "Planned",
      text: {
        text: "An idea becomes a ticket, and the ticket is drilled before any agent starts on it.",
        facts: ["omnislash/drilled-ticket-gate"],
      },
      tools: [
        {
          tool: "OmniSlash",
          does: {
            text: "OmniSlash refuses to dispatch a ticket that has no drilled section, no done-when item or no recorded check, unless you override it and give a reason. Planned: builders working in parallel are checked for conflicts.",
            facts: [
              "omnislash/drilled-ticket-gate",
              "omnislash/parallel-conflict-checks",
            ],
          },
        },
      ],
    },
    {
      name: "Written",
      text: {
        text: "An agent builds the ticket on its own branch, in its own worktree, from ready parts.",
        facts: ["omnislash/agent-build-worktree", "uislash/react-components"],
      },
      tools: [
        {
          tool: "OmniSlash",
          does: {
            text: "OmniSlash opens each builder in a git worktree on the ticket's own branch, and a lease lets only one holder work a ticket or a worktree at a time.",
            facts: ["omnislash/agent-build-worktree", "omnislash/leases"],
          },
        },
        {
          tool: "UISlash",
          does: {
            text: "UISlash gives the agent React components that take props alone and accept no className or style, so it cannot style a page off the design. Switching theme changes the whole site with no component change. It has seven themes, each checked against WCAG AA contrast.",
            facts: [
              "uislash/what-it-is",
              "uislash/react-components",
              "uislash/no-styling-escape",
              "uislash/theme-reskins-all",
              "uislash/seven-themes",
              "uislash/contrast-checked",
            ],
          },
        },
      ],
    },
    {
      name: "Built and tested",
      text: {
        text: "The change is built and the automated tests run. A pass should mean the change works, not that the run got lucky.",
        facts: ["taskslash/what-it-is", "flakeslash/what-it-is"],
      },
      tools: [
        {
          tool: "TaskSlash",
          does: {
            text: "TaskSlash queues builds and tests and starts each one when your computer has capacity, on one machine today and across your CI runners next, so a test fails because of the code, not because everything ran at once.",
            facts: ["taskslash/admission-by-capacity", "taskslash/ci-runners"],
          },
        },
        {
          tool: "FlakeSlash",
          does: {
            text: "FlakeSlash finds the checks that both failed and passed on the same commit, so a failure means something and is not just a reason to run it again.",
            facts: ["flakeslash/flake-same-commit"],
          },
        },
        {
          tool: "BundleSlash",
          does: {
            text: "BundleSlash will measure how much code your customers download after each build, so a page cannot get slower to load one change at a time.",
            planned: "BundleSlash",
          },
        },
      ],
    },
    {
      name: "Reviewed",
      text: {
        text: "The pull request is gated before it merges, and the reviewer sees what the change does to each page.",
        facts: ["omnislash/review-merge-skills", "pixelslash/what-it-is"],
      },
      tools: [
        {
          tool: "OmniSlash",
          does: {
            text: "Agent skills gate the pull request before merge: reviewers that presume every changed line is wrong, a watch on the pull request, and a merge made by a different role than the one that built it.",
            facts: ["omnislash/review-merge-skills"],
          },
        },
        {
          tool: "PixelSlash",
          does: {
            text: "PixelSlash takes screenshots of each page before and after the change and shows the reviewer every one that looks different. Anti-aliasing, noise and sub-pixel shifts are not changes. A person accepts or rejects each change in the review app.",
            facts: [
              "pixelslash/compare-two-urls",
              "pixelslash/many-pages",
              "pixelslash/perceptual-diff",
              "pixelslash/upload-to-review-app",
            ],
          },
        },
      ],
    },
    {
      name: "Released",
      text: {
        text: "The change goes live, to every customer at once or to some first.",
        facts: ["toggleslash/targeting"],
      },
      tools: [
        {
          tool: "ToggleSlash",
          does: {
            text: "ToggleSlash is feature flags you run yourself: choose which customers get a feature, switch it off again without a new release, and keep a record of every switch.",
            facts: ["toggleslash/what-it-is", "toggleslash/targeting", "toggleslash/audit-trail"],
          },
        },
      ],
    },
  ],
  next: {
    text: "Next, what the tools find goes back to the agent that made the change, so it can fix its own work before a person has to look.",
    facts: ["pixelslash/mcp-server"],
  },
};

/**
 * Where it stands: the alphas paragraph, then where to start with each tool. The items are Rich text: `code`
 * renders as inline code and [words](href) as a link; `external` lists the links that leave the site.
 */
export const STANDS: {
  title: string;
  stages: Claim;
  start: { title: string; items: readonly Claim[]; external: readonly string[] };
} = {
  title: "Where it stands",
  stages: {
    text: "UISlash, TaskSlash, FlakeSlash, PixelSlash, ToggleSlash and OmniSlash are alphas. Expect the screens, the components and the commands to change, and expect bugs. Between alpha versions, what a tool has stored may be reset: TaskSlash's job history, FlakeSlash's scans and issue corrections, PixelSlash's builds and approvals, ToggleSlash's flags and audit trail, and OmniSlash's work items. UISlash stores nothing.",
    facts: SUITE_AND_OMNI,
  },
  start: {
    title: "Where to start:",
    items: [
      {
        text: "UISlash: install `@slashsuite/ui-react` and `@slashsuite/themes` from npm into a React 19 app that uses Tailwind v4, and read the docs at [hack-cove.com/ui/](https://hack-cove.com/ui/).",
        facts: ["uislash/npm-install", "uislash/themes-package", "uislash/docs-site"],
      },
      {
        text: "TaskSlash: build it from source with cargo on Linux and run a command through `taskslash run`.",
        facts: ["taskslash/no-release"],
      },
      {
        text: "FlakeSlash: run `flakeslash scan` from a checkout against your GitHub Actions history, or sign in to the dashboard at [flakeslash.slashslash.build](https://flakeslash.slashslash.build) with GitHub.",
        facts: [
          "flakeslash/scan-github-actions",
          "flakeslash/cli-from-checkout",
          "flakeslash/hosted-dashboard",
          "flakeslash/dashboard-sign-in",
        ],
      },
      {
        text: "PixelSlash: install `@hackcove/pixelslash` from npm and compare two URLs that are already running, or start with [how it works in CI](/developers).",
        facts: ["pixelslash/npm-cli", "pixelslash/compare-two-urls"],
      },
      {
        text: "ToggleSlash: run `bun run stack` from a checkout to start the server, the dashboard and an example app on one machine.",
        facts: ["toggleslash/local-stack"],
      },
      {
        text: "OmniSlash: clone it, run `bun install`, then `bun apps/cli/src/index.ts --help`.",
        facts: ["omnislash/checkout-linux"],
      },
    ],
    external: ["https://hack-cove.com/ui/", "https://flakeslash.slashslash.build"],
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
  "Has a change made by an agent ever surprised you or your customers?",
  "Which of these tools would you most want running on every change?",
  "Was anything on this page hard to follow?",
  "Would you want these tools together or separately?",
] as const;

/** The product names the story must place, for the tests: every PRODUCTS entry. */
export const STORY_TOOLS: readonly StoryTool[] = PRODUCTS.map((product) => product.name);
