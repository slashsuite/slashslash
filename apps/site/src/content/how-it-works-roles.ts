/**
 * /how-it-works: Meet the team, the five roles that carry an idea to shipped work. Each card shows the
 * role's name as its heading and the approved line under it. Every sentence that says what a product does
 * is a `Claim`, held to the facts files by facts.built.test.ts.
 */
import type { Claim } from "#/content/facts";

/** One illustrated role on the team. */
export type TeamRole = {
  id: string;
  name: string;
  image: string;
  alt: string;
  summary: Claim;
};

export const ROLES: { title: string; items: readonly TeamRole[] } = {
  title: "Meet the team",
  items: [
    {
      id: "muse",
      name: "Muse",
      image: "/how-it-works/muse.webp",
      alt: "Illustration of the muse: a creative explorer in an orange sweater sketching at a desk beneath starry sparks while handing over a blue design envelope.",
      summary: {
        text: "Talks your idea through with you and asks whether it is complete before anything is ticketed.",
        facts: ["omnislash/role-skills", "omnislash/role-state-machine"],
      },
    },
    {
      id: "architect",
      name: "Architect",
      image: "/how-it-works/architect.webp",
      alt: "Illustration of the architect: a planner in round glasses and a blue overshirt standing at a drafting table, arranging orange blocks on an unrolled blueprint with a compass.",
      summary: {
        text: "One per team. Turns your idea into a ticket that says what done means, then starts each build.",
        facts: ["omnislash/role-skills", "omnislash/drilled-ticket-gate"],
      },
    },
    {
      id: "builder",
      name: "Builder",
      image: "/how-it-works/builder.webp",
      alt: "Illustration of a builder: a craftsperson in an orange workshop apron seated inside a dotted boundary, typing at a code monitor beside a wrench and a branch card.",
      summary: {
        text: "One per ticket, in its own copy of the code. Builds the change, runs its checks, opens the pull request and hands off. It never merges.",
        facts: ["omnislash/agent-build-worktree", "omnislash/review-merge-skills"],
      },
    },
    {
      id: "reviewer",
      name: "Reviewer",
      image: "/how-it-works/skeptical-reviewer.webp",
      alt: "Illustration of a skeptical reviewer: a sharp-eyed critic in glasses and a dark blazer inspecting a sheet of code bars with a magnifying glass.",
      summary: {
        text: "Reads the brief before the build and the change after it, presumes every changed line is wrong, and never edits.",
        facts: ["omnislash/review-merge-skills"],
      },
    },
    {
      id: "sentinel",
      name: "Sentinel",
      image: "/how-it-works/sentinel.webp",
      alt: "Illustration of the sentinel: a gatekeeper in a blue coat and orange scarf holding a glowing lantern and magnifying glass beside a stone gatehouse, inspecting parcels on a bridge.",
      summary: {
        text: "One per team. Reads every builder's handoff from one inbox, checks the work for itself, then merges and ships it. A team with no Sentinel has its Architect do this.",
        facts: ["omnislash/role-skills", "omnislash/role-inbox", "omnislash/role-delivery"],
      },
    },
  ],
};
