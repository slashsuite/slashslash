/**
 * /how-it-works: one cycle from an idea to a live release, written for non-technical readers using the six
 * roles and nine terms in how-it-works-roles.ts. The steps in words and the today and planned lists are in
 * how-it-works-steps.ts. Every sentence that says what a product does is a `Claim`, held to the facts files
 * by facts.built.test.ts.
 */
import type { Claim } from "#/content/facts";
import { OMNISLASH_REPO_URL } from "#/content/site";

/** The page's h1, its title and its share card's headline. */
export const HOW_IT_WORKS_HEADLINE = "From idea to live release, and what checks each step";

/** The page's meta description: the share card description. */
export const HOW_IT_WORKS_DESCRIPTION =
  "How an idea becomes a live software release: six clear AI roles, written rules, and Slash checks at every step, with planned parts marked planned.";

/** The two paragraphs under the h1. */
export const HOW_IT_WORKS_LEAD: readonly string[] = [
  "Every change here is built by one AI agent, then checked by separate agents and by the Slash products before it reaches users.",
  "One cycle, ten steps. Each step names the role doing the work, the written rule it follows, and the Slash product checking the result. Solid cards run today. Dashed cards are planned.",
];

/** A node of the diagram: one step in the cycle, optionally linked to a personified role avatar. */
export type FlowNode = {
  /** The step's number, `6a` and `7a` for the planned branches off 6 and 7. */
  id: string;
  label: string;
  /** Optional role id matching an illustrated role in how-it-works-roles.ts. */
  roleId?: string;
  /** The Role and rule cell. */
  role: string;
  /** The Tool at this step cell: a claim, or a plain word when no tool acts. */
  tool: Claim | string;
  stage: "today" | "planned";
};

export const DIAGRAM: {
  title: string;
  nodes: readonly FlowNode[];
  caption: string;
} = {
  title: "The flow diagram",
  nodes: [
    { id: "1", label: "Idea", role: "The owner", tool: "None", stage: "today" },
    {
      id: "2",
      label: "Explore the design",
      roleId: "muse",
      role: "Muse. Explores the idea and hands over a confirmed design",
      tool: { text: "OmniSlash: delivers the design to the architect's role inbox", facts: ["omnislash/role-inbox"] },
      stage: "today",
    },
    {
      id: "3",
      label: "Drill the ticket",
      roleId: "architect",
      role: "Architect. Turns the design into a drilled ticket",
      tool: {
        text: "OmniSlash: requires a written breakdown and what-done-looks-like checklist on every ticket",
        facts: ["omnislash/drilled-ticket-gate"],
      },
      stage: "today",
    },
    {
      id: "4",
      label: "Check the ticket",
      roleId: "checker",
      role: "Checker. Verifies the drilled ticket is clear and doable",
      tool: {
        text: "OmniSlash: refuses to start a builder without a recorded go sign-off unless overridden",
        facts: ["omnislash/drilled-ticket-gate"],
      },
      stage: "today",
    },
    {
      id: "5",
      label: "Assign and lock",
      roleId: "architect",
      role: "Architect. Starts a builder on the checked ticket",
      tool: {
        text: "OmniSlash: claims a lease on the task and isolated workspace so no two agents collide",
        facts: ["omnislash/drilled-ticket-gate", "omnislash/leases"],
      },
      stage: "today",
    },
    {
      id: "6",
      label: "Build in isolation",
      roleId: "builder",
      role: "Builder. Works inside its own isolated workspace",
      tool: {
        text: "OmniSlash: private copy of the project per task. TaskSlash: paces builds and tests to fit machine capacity. UISlash: locks screens to the design system",
        facts: [
          "omnislash/agent-build-worktree",
          "taskslash/moon-targets",
          "taskslash/admission-by-capacity",
          "uislash/no-styling-escape",
        ],
      },
      stage: "today",
    },
    {
      id: "6a",
      label: "Size and security check",
      roleId: "builder",
      role: "Builder",
      tool: {
        text: "BundleSlash (planned): will compare app size before and after, check whether security flaws in third-party packages reach your code, and prepare releases",
        planned: "BundleSlash",
      },
      stage: "planned",
    },
    {
      id: "7",
      label: "Automated and visual checks",
      roleId: "builder",
      role: "Builder submits a proposed change and hands off. Never merges its own work",
      tool: {
        text: "PixelSlash: before-and-after screenshots for human sign-off and inconsistent shot detection. UISlash: automated design system check. FlakeSlash: scans for unreliable tests every 10 minutes",
        facts: [
          "pixelslash/upload-to-review-app",
          "pixelslash/block-ci-on-review",
          "pixelslash/flaky-shot-detection",
          "uislash/ui-review-workflow",
          "flakeslash/dashboard-scan",
        ],
      },
      stage: "today",
    },
    {
      id: "7a",
      label: "Reliability check per change",
      role: "Automated check",
      tool: {
        text: "FlakeSlash (planned): will post an informational test reliability summary on each proposed change without blocking the release",
        facts: ["flakeslash/pr-check"],
      },
      stage: "planned",
    },
    {
      id: "8",
      label: "Skeptical review",
      roleId: "skeptical-reviewer",
      role: "Skeptical reviewer. Independent reviewers across models presume every changed line is wrong",
      tool: {
        text: "OmniSlash: read-only skeptical review across multiple AI models",
        facts: ["omnislash/review-merge-skills"],
      },
      stage: "today",
    },
    {
      id: "9",
      label: "Merge and deploy",
      roleId: "sentinel",
      role: "Sentinel, else architect. Never the builder",
      tool: {
        text: "OmniSlash: handoff delivered to the sentinel's role inbox, then merged and deployed once every check passes",
        facts: ["omnislash/role-inbox", "omnislash/role-delivery", "omnislash/review-merge-skills"],
      },
      stage: "today",
    },
    {
      id: "10",
      label: "Roll out behind a feature switch",
      role: "Live rollout",
      tool: {
        text: "ToggleSlash: audience targeting, gradual percentage rollouts, live updates, full audit trail",
        facts: ["toggleslash/targeting", "toggleslash/live-updates", "toggleslash/audit-trail"],
      },
      stage: "today",
    },
  ],
  caption:
    "Solid: runs today. Dashed: planned. Each role follows a written rule; each Slash product checks that step's output.",
};

/**
 * One product in The products: its name, its page here when it has one, and its line, which starts with the
 * name (the page shows the name in bold, linked to the page).
 */
export type FlowTool = { name: string; href?: string; line: Claim };

export const TOOLS: { title: string; tools: readonly FlowTool[] } = {
  title: "The products",
  tools: [
    {
      name: "OmniSlash",
      href: "/omnislash",
      line: {
        text: "OmniSlash: keeps track of tasks, projects, and the AI agents working on them.",
        facts: ["omnislash/what-it-is"],
      },
    },
    {
      name: "UISlash",
      href: "/uislash",
      line: {
        text: "UISlash: a design system of approved components and themes that keeps every page consistent without ad-hoc styling.",
        facts: ["uislash/what-it-is"],
      },
    },
    {
      name: "TaskSlash",
      href: "/taskslash",
      line: {
        text: "TaskSlash: queues builds and tests until the machine has spare capacity for each.",
        facts: ["taskslash/what-it-is"],
      },
    },
    {
      name: "FlakeSlash",
      href: "/flakeslash",
      line: {
        text: "FlakeSlash: finds unreliable tests that pass and fail on the same version, grouped into issues.",
        facts: ["flakeslash/what-it-is"],
      },
    },
    {
      name: "PixelSlash",
      href: "/pixelslash",
      line: {
        text: "PixelSlash: shows what changed visually on a web page so a person can accept or reject each change.",
        facts: ["pixelslash/what-it-is"],
      },
    },
    {
      name: "ToggleSlash",
      href: "/toggleslash",
      line: {
        text: "ToggleSlash: feature switches you run on your own servers to control who sees new changes while the app runs.",
        facts: ["toggleslash/what-it-is"],
      },
    },
    {
      name: "BundleSlash",
      line: {
        text: "BundleSlash (planned): app size checks between versions, security flaw reachability, and release preparation.",
        planned: "BundleSlash",
      },
    },
  ],
};

/** The close: where to go next, and where the source is. */
export const CLOSE: { next: string; source: Claim; external: readonly string[] } = {
  next: "Next: [the home page](/), [technical details for developers](/developers), or any product page.",
  source: {
    text: `Source: OmniSlash at [github.com/slashsuite/omnislash](${OMNISLASH_REPO_URL}) (Elastic License 2.0, source available). UISlash and TaskSlash are MIT. PixelSlash, FlakeSlash and ToggleSlash are Elastic License 2.0. Docs: [slashslash.build/uislash](/uislash) (UISlash), [slashslash.build/pixelslash/docs](/pixelslash/docs) (PixelSlash).`,
    facts: [
      "omnislash/public-repo",
      "omnislash/licence",
      "uislash/licence",
      "taskslash/licence",
      "pixelslash/licence",
      "flakeslash/licence",
      "toggleslash/licence",
      "uislash/docs-site",
      "pixelslash/docs-site",
    ],
  },
  external: [OMNISLASH_REPO_URL],
};
