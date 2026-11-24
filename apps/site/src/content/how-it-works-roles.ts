/**
 * /how-it-works: the six illustrated roles and the nine plain-English terms introduced before the flow diagram.
 * Written for non-technical readers (founders, CEOs, product owners): every concept used on the page is defined
 * here, with no git or command-line jargon. Every sentence that says what a product does is a `Claim`, held to
 * the facts files by facts.built.test.ts.
 */
import type { Claim } from "#/content/facts";

/** One illustrated role introduced before the flow diagram. */
export type FlowRole = {
  id: string;
  name: string;
  role: string;
  image: string;
  alt: string;
  summary: Claim;
};

export const ROLES: {
  title: string;
  intro: string;
  items: readonly FlowRole[];
} = {
  title: "The roles",
  intro: "Before the diagram, meet the six roles that carry an idea to a live release.",
  items: [
    {
      id: "muse",
      name: "Muse",
      role: "Explores the idea",
      image: "/how-it-works/muse.webp",
      alt: "Illustration of the muse: a creative explorer in an orange sweater sketching at a desk beneath starry sparks while handing over a blue design envelope.",
      summary: {
        text: "The muse is the agent you talk through a rough idea with before anyone plans or builds. It asks questions, explores options, and once you confirm a design, sends it to the architect's role inbox.",
        facts: ["omnislash/role-skills", "omnislash/role-inbox"],
      },
    },
    {
      id: "architect",
      name: "Architect",
      role: "Plans, drills and assigns",
      image: "/how-it-works/architect.webp",
      alt: "Illustration of the architect: a planner in round glasses and a blue overshirt standing at a drafting table, arranging orange blocks on an unrolled blueprint with a compass.",
      summary: {
        text: "The architect turns a confirmed design into a clear plan broken into small tasks. It writes out each drilled ticket, assigns a builder once checked, and steps in to merge and deploy when there is no sentinel.",
        facts: ["omnislash/role-skills", "omnislash/drilled-ticket-gate"],
      },
    },
    {
      id: "checker",
      name: "Checker",
      role: "Verifies the ticket is doable",
      image: "/how-it-works/checker.webp",
      alt: "Illustration of the checker: a spec reviewer in a blue sweater vest holding up a checked specification card while poising a round approval stamp over an orange ink pad.",
      summary: {
        text: "Before any builder starts, the checker inspects the architect's drilled ticket to make sure the work is clear and doable. Once satisfied, it records a go sign-off; without it, OmniSlash blocks the task from starting unless overridden.",
        facts: ["omnislash/drilled-ticket-gate"],
      },
    },
    {
      id: "builder",
      name: "Builder",
      role: "Builds in an isolated workspace",
      image: "/how-it-works/builder.webp",
      alt: "Illustration of a builder: a craftsperson in an orange workshop apron seated inside a dotted boundary, typing at a code monitor beside a wrench and a branch card.",
      summary: {
        text: "A builder is an agent given one checked task to build inside its own isolated workspace, protected by a lease so two agents cannot collide on the same work. It submits a proposed change for review; it can never merge or deploy its own work.",
        facts: ["omnislash/agent-build-worktree", "omnislash/leases", "omnislash/review-merge-skills"],
      },
    },
    {
      id: "skeptical-reviewer",
      name: "Skeptical reviewer",
      role: "Presumes every changed line is wrong",
      image: "/how-it-works/skeptical-reviewer.webp",
      alt: "Illustration of a skeptical reviewer: a sharp-eyed critic in glasses and a dark blazer inspecting a sheet of code bars with a magnifying glass.",
      summary: {
        text: "Independent, read-only reviewers running across different AI models inspect a builder's proposed change before it can merge. They presume every changed line has a flaw and report problems without editing anything themselves.",
        facts: ["omnislash/review-merge-skills"],
      },
    },
    {
      id: "sentinel",
      name: "Sentinel",
      role: "Approves, merges and deploys",
      image: "/how-it-works/sentinel.webp",
      alt: "Illustration of the sentinel: a gatekeeper in a blue coat and orange scarf holding a glowing lantern and magnifying glass beside a stone gatehouse, inspecting parcels on a bridge.",
      summary: {
        text: "The sentinel is the dedicated gatekeeper that oversees every proposed change before it reaches users. It runs skeptical reviews, waits for automated and visual checks to pass, then merges and deploys the release.",
        facts: ["omnislash/role-skills", "omnislash/review-merge-skills", "omnislash/role-delivery"],
      },
    },
  ],
};

/** One plain-English term defined before the flow diagram. */
export type FlowTerm = {
  id: string;
  name: string;
  tagline: string;
  summary: Claim;
};

export const TERMS: {
  title: string;
  intro: string;
  items: readonly FlowTerm[];
} = {
  title: "The terms",
  intro: "Every concept used in the diagram and steps below, explained in plain English.",
  items: [
    {
      id: "drilled-ticket",
      name: "Drilled ticket",
      tagline: "Worked out before building starts",
      summary: {
        text: "A task written out in full before any agent begins building: a clear breakdown of the work, a checklist of what done looks like, and a recorded go sign-off from the checker. OmniSlash refuses to start a builder without all three unless overridden.",
        facts: ["omnislash/drilled-ticket-gate"],
      },
    },
    {
      id: "written-rule",
      name: "Written rule",
      tagline: "The playbook each role follows",
      summary: {
        text: "A written set of instructions that guides each AI role on how to do its job, which checks to run, and what it is not allowed to do, such as preventing a builder from merging its own work.",
        facts: ["omnislash/role-skills", "omnislash/review-merge-skills"],
      },
    },
    {
      id: "isolated-workspace",
      name: "Isolated workspace",
      tagline: "One private copy per builder",
      summary: {
        text: "Every builder works inside its own separate copy of the project, split cleanly from the live version. Multiple builders can work at the same time without overwriting or stepping on each other's changes.",
        facts: ["omnislash/agent-build-worktree"],
      },
    },
    {
      id: "lease",
      name: "Lease",
      tagline: "One agent per task at a time",
      summary: {
        text: "A time-limited lock OmniSlash places on an active task and its isolated workspace. Only one agent can hold it at a time; a second request is refused until the lease is released or expires.",
        facts: ["omnislash/leases"],
      },
    },
    {
      id: "role-inbox",
      name: "Role inbox",
      tagline: "Clean handoffs between roles",
      summary: {
        text: "A dedicated inbox for each role that stores unread messages and handoff notes oldest first. Confirmed designs from the muse and finished work from builders land here without holding up the sender.",
        facts: ["omnislash/role-inbox", "omnislash/role-delivery"],
      },
    },
    {
      id: "design-system",
      name: "Design system",
      tagline: "Approved visual building blocks",
      summary: {
        text: "A shared library of pre-approved screen components and colour themes. Builders compose pages strictly from these building blocks, and automated checks fail any proposed change that tries to invent ad-hoc styling.",
        facts: ["uislash/what-it-is", "uislash/no-styling-escape", "uislash/ui-review-workflow"],
      },
    },
    {
      id: "proposed-change",
      name: "Proposed change",
      tagline: "Finished work waiting for review",
      summary: {
        text: "The bundle of finished edits a builder submits once it completes a task. Automated checks, visual comparisons, and skeptical reviews all run against this proposed change before anything touches the live product.",
        facts: ["omnislash/review-merge-skills", "pixelslash/block-ci-on-review", "uislash/ui-review-workflow"],
      },
    },
    {
      id: "merge-and-deploy",
      name: "Merge and deploy",
      tagline: "Approved work going live",
      summary: {
        text: "Merging brings an approved proposed change from its isolated workspace into the main project; deploying publishes that updated version so users can reach it. Only the sentinel (or architect) can merge, never the builder.",
        facts: ["omnislash/role-skills", "omnislash/review-merge-skills"],
      },
    },
    {
      id: "feature-switch",
      name: "Feature switch",
      tagline: "Controls who sees a new change",
      summary: {
        text: "A live control built into the app that turns a new feature on or off for specific customers, user groups, or a growing percentage of users while the app is running, without rebuilding the software.",
        facts: ["toggleslash/what-it-is", "toggleslash/targeting", "toggleslash/live-updates"],
      },
    },
  ],
};
