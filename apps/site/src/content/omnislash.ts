/**
 * The /omnislash page, as plain data so a test can check it. Every word is the approved copy, transcribed as it was
 * written: change it only through new approved copy. A word in backticks is set as code, as the copy marks it; the
 * backticks themselves are not shown. Every product claim here cites OmniSlash's FACTS.md (facts.built.test.ts).
 */

import type { Claim } from "#/content/facts";
import type { TryStep } from "#/content/flakeslash";
import { OMNISLASH_REPO_URL } from "#/content/site";

/** The headline: the page's h1 and its share card. */
export const OMNISLASH_HEADLINE = "From an idea to a merged change, in one tool.";

/** The page title, its promise after the colon, as the other tool pages write theirs. */
export const OMNISLASH_TITLE: Claim = {
  text: "OmniSlash: from an idea to a merged change, in one tool.",
  facts: ["omnislash/what-it-is"],
};

export const OMNISLASH_INTRO: { title: string; lead: Claim } = {
  title: "OmniSlash",
  lead: {
    text: "OmniSlash (Omni for short) tracks tickets, projects and the coding agents that work on them. It refuses to start an agent on a ticket until it has a written breakdown and acceptance criteria, builds each ticket in its own git worktree, and hands pull requests to a separate review agent before merge.",
    facts: [
      "omnislash/what-it-is",
      "omnislash/drilled-ticket-gate",
      "omnislash/agent-build-worktree",
      "omnislash/review-merge-skills",
      "omnislash/role-skills",
    ],
  },
};

/** The page's description in search results and link previews. */
export const OMNISLASH_DESCRIPTION: Claim = {
  text: "OmniSlash is a command-line tool that tracks tickets, projects and the coding agents that work on them.",
  facts: ["omnislash/what-it-is"],
};

export type Step = {
  title: string;
  command?: string;
  text: Claim;
  /** A list under the text, as the Three standing roles step has. */
  list?: readonly Claim[];
};

export const HOW_A_TICKET_MOVES_TITLE = "How a ticket moves";

/** How a ticket moves: what works today. */
export const HOW_A_TICKET_MOVES: readonly Step[] = [
  {
    title: "Ticket readiness gate",
    command: "spinoff <ticket>",
    text: {
      text: "Before an agent can start, a ticket needs a written breakdown (`## Drilled`), acceptance criteria (`## Done when`) and a recorded `go` sign-off on its current text. Without them, OmniSlash refuses to start the agent and queues nothing. You can override with `--no-check` and a reason. Research spikes follow their own rule: `## Questions`, `## Box`, `## Done when` and a link to the ticket they serve.",
      facts: ["omnislash/drilled-ticket-gate"],
    },
  },
  {
    title: "Its own branch and worktree",
    command: "git worktree add <path> -b <branch>",
    text: {
      text: "Dispatch opens each builder as a T3 Code thread in its own git worktree. If a worktree already exists on the ticket's branch, OmniSlash reuses it; otherwise it creates one from `origin/main`.",
      facts: ["omnislash/agent-build-worktree"],
    },
  },
  {
    title: "Resource leases",
    command: "lease acquire|run|release",
    text: {
      text: "A lease on `ticket:<ref>` or `worktree:<path>` allows one live holder at a time. A second holder is refused until the first releases it or the lease expires, so two agents cannot edit the same ticket or checkout at once.",
      facts: ["omnislash/leases"],
    },
  },
  {
    title: "Three standing roles",
    command: "role start|status|end <team> <role>",
    text: {
      text: "Agent skills prime a thread for each team role, with one active role run per team role:",
      facts: ["omnislash/role-skills", "omnislash/role-runs"],
    },
    list: [
      {
        text: "Architect: plans, specifies and dispatches every build, then gates and merges.",
        facts: ["omnislash/role-skills"],
      },
      { text: "Sentinel: verifies, merges and deploys every pull request.", facts: ["omnislash/role-skills"] },
      { text: "Muse: explores an idea and hands over a design once confirmed.", facts: ["omnislash/role-skills"] },
    ],
  },
  {
    title: "Role inbox and watchdog ticks",
    command: 'send <team> <role> "<text>"',
    text: {
      text: "Messages and builder handoffs go into a role's inbox and deliver to its open run, or start a fresh run seeded with `role brief` (in-flight work, unread inbox, open questions and the prior run's handoff note). `role tick` checks every 15 minutes for stalled builders, unassigned flakes and idle queues, and rotates runs cleanly when idle or at 200,000 tokens.",
      facts: ["omnislash/role-inbox", "omnislash/role-delivery", "omnislash/role-brief", "omnislash/role-tick", "omnislash/role-end"],
    },
  },
  {
    title: "A gated merge",
    command: "ob-skeptical-review",
    text: {
      text: "The builder opens the pull request and stops. Another role runs read-only skeptical reviewers across models (defaulting to Neon and Opus) that presume every changed line is wrong, watches the pull request, and merges it.",
      facts: ["omnislash/review-merge-skills"],
    },
  },
];

export const AGAINST: { title: string; text: Claim } = {
  title: "Against Jira and Linear",
  text: {
    text: "OmniSlash refuses to start an agent on a ticket that has no written breakdown, no acceptance criteria or no recorded sign-off, unless you override it. The Jira and Linear docs name no such check before an agent takes the work.",
    facts: ["omnislash/drilled-ticket-gate", "omnislash/compared-jira", "omnislash/compared-linear"],
  },
};

export const PLANNED_TITLE = "Planned";
export const PLANNED_LEAD = "These are planned, not built.";

/** Planned, each item in the facts file's Planned list. */
export const PLANNED: readonly Claim[] = [
  {
    text: "Conflict checks between builders working in parallel.",
    facts: ["omnislash/parallel-conflict-checks"],
  },
  { text: "A team server with per-user access.", facts: ["omnislash/team-server"] },
];

/** Try it: the lead, the clone and run commands in one block, and what comes after them. */
export const TRY_IT: { lead: Claim; steps: readonly TryStep[]; after: Claim } = {
  lead: {
    text: "OmniSlash runs from a fresh clone on Linux with Bun 1.4.2:",
    facts: ["omnislash/checkout-linux"],
  },
  steps: [
    {
      commands: [
        `git clone ${OMNISLASH_REPO_URL}`,
        "cd omnislash",
        "bun install",
        "bun apps/cli/src/index.ts --help",
      ],
    },
  ],
  after: {
    text: "The last command prints the command reference. Postgres is the default store and needs a connection URL. To try it without Postgres, set `OMNISLASH_STORE=sqlite`, `OMNISLASH_DB_CREATE=1` and `OMNISLASH_DB` to a new path, then `add` and `list` work items in that file. Dispatching a builder requires T3 Code.",
    facts: ["omnislash/help-command", "omnislash/item-tracking", "omnislash/agent-build-worktree"],
  },
};

/** The licence, in the copy's words. */
export const LICENCE: Claim = {
  text: "OmniSlash is source available under the Elastic License 2.0.",
  facts: ["omnislash/licence"],
};

export const LINKS: readonly { label: string; href: string }[] = [
  { label: "Repository on GitHub", href: OMNISLASH_REPO_URL },
];
