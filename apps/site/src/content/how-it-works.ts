/**
 * /how-it-works: one idea, a saved basket for a shop, followed from a chat to shipped work. The page
 * opens on the hero, then the nine scene storybook, then the team (how-it-works-roles.ts), where you stay
 * in control, the five stages, what runs today and next, and the close. The words are the approved copy,
 * transcribed as written. Every sentence that says what a product does is a `Claim`, held to the facts
 * files by facts.built.test.ts.
 */
import type { Claim } from "#/content/facts";

/** The page's h1, its title, its share card's headline and the close's heading. */
export const HOW_IT_WORKS_HEADLINE = "Bring the idea. Agents ship it, and the calls that matter stay yours.";

/** The page's meta description: the share card description. */
export const HOW_IT_WORKS_DESCRIPTION =
  "Follow one idea from a chat to shipped work. Agents plan, build, check and ship it, and stop for you at each decision only you can make.";

/** The paragraph under the h1. */
export const HOW_IT_WORKS_HERO =
  "It starts as a thought you type into a chat. Say it is a saved basket for your shop, so customers can come back to what they picked. A small team of agents turns that thought into a plan, builds it, checks it and ships it. At each decision only you can make, the work stops and waits for you.";

/**
 * A list line that opens with a bold label: the line's text starts with the label, which the page shows in
 * bold, and the rest follows as written.
 */
export type BoldLine = { bold: string; line: Claim | string };

/** Where you stay in control: the moments the work stops for you. */
export const CONTROL: {
  title: string;
  intro: string;
  items: readonly BoldLine[];
  after: Claim;
} = {
  title: "Where you stay in control",
  intro: "The agents do the shaping, building and checking. These are the moments the work stops for you.",
  items: [
    {
      bold: "The idea.",
      line: {
        text: "The idea. You say whether it is complete. Nothing is ticketed for building before your yes.",
        facts: ["omnislash/role-state-machine"],
      },
    },
    {
      bold: "A planning question.",
      line: {
        text: "A planning question. When the Architect hits a question only you can decide, it asks you and waits.",
        facts: ["omnislash/role-state-machine"],
      },
    },
    {
      bold: "A builder that needs you.",
      line: {
        text: "A builder that needs you. A Builder missing a decision or access stops and asks for it. A Builder that marks its change as needing your eyes, for feel, wording or anything visual, waits while you judge it, then hands it on or makes the change you ask for.",
        facts: ["omnislash/role-state-machine"],
      },
    },
    {
      bold: "The merge call.",
      line: {
        text: "The merge call. A taste call, a check someone wants to skip, or merging past a known flaky test goes to you before anything merges.",
        facts: ["omnislash/role-state-machine"],
      },
    },
    {
      bold: "What changed on screen.",
      line: {
        text: "What changed on screen. You accept or reject each change in PixelSlash. A review you have not done yet does not hold up the handoff. A failed one stops it.",
        facts: ["omnislash/role-state-machine", "omnislash/handoff-pixelslash-owed", "pixelslash/upload-to-review-app"],
      },
    },
    {
      bold: "Anything sent outside.",
      line: "Anything sent outside. Nothing goes to anyone outside without you.",
    },
  ],
  after: {
    text: "On the dashboard, the Machine page draws the whole flow, tags every step that needs a person, and counts how many are waiting on one.",
    facts: ["omnislash/dashboard-machine"],
  },
};

/** The five stages, each naming the products behind it, linked to their pages. */
export const STAGES: { title: string; items: readonly BoldLine[] } = {
  title: "Five stages",
  items: [
    {
      bold: "Idea.",
      line: {
        text: "Idea. You and the Muse talk the thought through until you call it complete. Behind it: [OmniSlash](/omnislash), which keeps track of tickets, projects and the agents that work on them.",
        facts: ["omnislash/what-it-is", "omnislash/role-state-machine"],
      },
    },
    {
      bold: "Plan.",
      line: {
        text: "Plan. The Architect shapes the ticket and a Reviewer reads the brief cold. Behind it: [OmniSlash](/omnislash).",
        facts: ["omnislash/drilled-ticket-gate", "omnislash/role-state-machine"],
      },
    },
    {
      bold: "Build.",
      line: {
        text: "Build. Builders work side by side, each in its own copy of the code. Behind it: [TaskSlash](/taskslash), which stops builds and tests that start at the same time from overloading one computer, and [UISlash](/uislash), screen parts and themes a site is built from as they are, with no styling of its own.",
        facts: ["omnislash/agent-build-worktree", "taskslash/what-it-is", "uislash/what-it-is", "uislash/no-styling-escape"],
      },
    },
    {
      bold: "Ship.",
      line: {
        text: "Ship. The checks run, you review what changed on screen, and the Sentinel merges and deploys. Behind it: [PixelSlash](/pixelslash), which shows what changed on a web page between two versions and lets a person accept or reject each change, and [FlakeSlash](/flakeslash), which finds the tests that pass and fail on the same code.",
        facts: ["pixelslash/what-it-is", "flakeslash/what-it-is", "omnislash/role-skills"],
      },
    },
    {
      bold: "Done.",
      line: {
        text: "Done. The ticket closes. If you then want to let a feature out to a share of users first, there is [ToggleSlash](/toggleslash), a feature flag service you run yourself that decides which users see which version of a feature.",
        facts: ["toggleslash/what-it-is", "toggleslash/targeting"],
      },
    },
  ],
};

/** Running today and next: each product's state today, then what is planned. */
export const STATUS: {
  title: string;
  intro: string;
  todayTitle: string;
  today: readonly BoldLine[];
  nextTitle: string;
  nextIntro: string;
  planned: readonly BoldLine[];
} = {
  title: "Running today and next",
  intro: "Every product here is alpha. It runs today, and any of it may change.",
  todayTitle: "Today",
  today: [
    {
      bold: "OmniSlash",
      line: {
        text: "OmniSlash, alpha. A command line tool that runs from a checkout of its public source, with a dashboard whose Machine page places every live ticket on the flow.",
        facts: ["omnislash/what-it-is", "omnislash/checkout-linux", "omnislash/public-repo", "omnislash/dashboard-machine"],
      },
    },
    {
      bold: "TaskSlash",
      line: {
        text: "TaskSlash, alpha, version 0.1.0. Runs on Linux. There is no installable release yet; you build it from source.",
        facts: ["taskslash/what-it-is", "taskslash/no-release", "taskslash/linux-systemd"],
      },
    },
    {
      bold: "PixelSlash",
      line: {
        text: "PixelSlash, alpha, version 0.8. Installs from npm. The review app is hosted at pixelslash.dev, or you run it yourself.",
        facts: ["pixelslash/what-it-is", "pixelslash/npm-cli", "pixelslash/hosted-review-app", "pixelslash/self-host-docker"],
      },
    },
    {
      bold: "UISlash",
      line: {
        text: "UISlash, alpha, every package at version 0.x. Installs from npm, with its docs at hack-cove.com/ui.",
        facts: ["uislash/what-it-is", "uislash/npm-install", "uislash/docs-site"],
      },
    },
    {
      bold: "FlakeSlash",
      line: {
        text: "FlakeSlash, alpha, version 0.1.0. Its dashboard is hosted at flakeslash.slashslash.build. The command line tool runs from a checkout.",
        facts: ["flakeslash/what-it-is", "flakeslash/hosted-dashboard", "flakeslash/cli-from-checkout"],
      },
    },
    {
      bold: "ToggleSlash",
      line: {
        text: "ToggleSlash, alpha, version 0.2.0. You run the server yourself. There is no public hosted service.",
        facts: ["toggleslash/what-it-is", "toggleslash/server-from-source", "toggleslash/dashboard-cloudflare-workers"],
      },
    },
  ],
  nextTitle: "Next",
  nextIntro: "These are planned, with no dates.",
  planned: [
    {
      bold: "OmniSlash:",
      line: {
        text: "OmniSlash: a team server where each person has their own access.",
        facts: ["omnislash/team-server"],
      },
    },
    {
      bold: "TaskSlash:",
      line: {
        text: "TaskSlash: scheduling across a pool of machines, and for the automated checks that run on each change.",
        facts: ["taskslash/machine-pool", "taskslash/ci-runners"],
      },
    },
    {
      bold: "ToggleSlash:",
      line: {
        text: "ToggleSlash: rollouts that raise the share of users in automatic steps, and user accounts and roles so a team stops sharing one admin token.",
        facts: ["toggleslash/progressive-rollouts", "toggleslash/user-accounts-and-roles"],
      },
    },
    {
      bold: "FlakeSlash:",
      line: {
        text: "FlakeSlash: one check on each pull request that links to its dashboard and never blocks.",
        facts: ["flakeslash/pr-check"],
      },
    },
  ],
};

/** The close: the headline again as an h2, one line, and the way on to the products. */
export const CLOSE: { text: string; button: string; href: string } = {
  text: "Your saved basket started as a sentence in a chat. Your next idea starts the same way.",
  button: "Meet the products",
  href: "/#tools",
};
