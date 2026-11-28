/**
 * Scene data and the shared editorial palette for the /how-it-works storybook: nine scenes that follow one
 * idea, a saved basket for a shop, from a chat to shipped work. Each caption is the approved copy as
 * written, with each product it names linked to its page. Plain English only, no en or em dashes. Every
 * caption that says what a product does is a `Claim` held to the facts files by facts.built.test.ts.
 */
import type { Claim } from "#/content/facts";

export type StorybookSceneId =
  | "explore"
  | "shape"
  | "cold-read"
  | "build"
  | "review"
  | "checks"
  | "ship"
  | "rollout"
  | "retro";

/** Every product the storybook shows, in the order the product bar lists them, each linked to its page. */
export const STORYBOOK_PRODUCTS = [
  { name: "OmniSlash", href: "/omnislash" },
  { name: "TaskSlash", href: "/taskslash" },
  { name: "PixelSlash", href: "/pixelslash" },
  { name: "FlakeSlash", href: "/flakeslash" },
  { name: "UISlash", href: "/uislash" },
  { name: "ToggleSlash", href: "/toggleslash" },
] as const;

/** A product that appears in a scene, by its name in the product bar. */
export type SceneProduct = (typeof STORYBOOK_PRODUCTS)[number]["name"];

/** The page a product in the bar links to. */
export const productHref = (name: SceneProduct): string =>
  STORYBOOK_PRODUCTS.find((product) => product.name === name)?.href ?? "/";

export type StorybookScene = {
  id: StorybookSceneId;
  chapter: number;
  title: string;
  /** The products this scene shows, which the product bar highlights. */
  products: readonly SceneProduct[];
  caption: Claim | string;
  altSummary: string;
};

/** Editorial ink-and-paper palette matched to the role illustrations on /how-it-works. */
export const PALETTE = {
  paper: "#FAF8F2",
  paperShade: "#F1ECE0",
  ink: "#1B1F2E",
  inkSoft: "#4B5066",
  terracotta: "#C8561B",
  terracottaSoft: "#F3D3C1",
  periwinkle: "#788FF2",
  periwinkleSoft: "#DCE2FD",
  taupe: "#DDD7CA",
  taupeLight: "#EBE6DC",
  white: "#FFFFFF",
  gold: "#F2B649",
  goldSoft: "#FDE8B8",
  sage: "#3B8C52",
  sageSoft: "#D5EEDB",
};

/** The storybook's accessible name: it has no visible heading of its own. */
export const STORYBOOK_LABEL = "Storybook";

export const SCENE_DURATION_MS = 6500;


export const STORYBOOK_SCENES: readonly StorybookScene[] = [
  {
    id: "explore",
    chapter: 1,
    title: "Explore and confirm",
    products: ["OmniSlash"],
    caption: {
      text: "You open a chat with the Muse and tell it about the saved basket. The Muse asks questions until the idea looks whole, then asks you whether it is complete. Say no, and you keep talking. Say yes, and only then does it become a ticket.",
      facts: ["omnislash/role-skills", "omnislash/role-state-machine"],
    },
    altSummary: "The Owner talks with the Muse in a chat. A card asks Complete? with a No and a Yes, and once Yes is picked a single blue ticket appears.",
  },
  {
    id: "shape",
    chapter: 2,
    title: "Shape the ticket",
    products: ["OmniSlash"],
    caption: {
      text: "The Architect picks up your saved basket and turns it into a ticket. The ticket records the details the Architect dug into and a list of what done means. A build cannot start without both.",
      facts: ["omnislash/drilled-ticket-gate", "omnislash/role-skills"],
    },
    altSummary: "The Architect works at a drafting table and fills in one ticket, with a Details section and a Done means checklist.",
  },
  {
    id: "cold-read",
    chapter: 3,
    title: "Cold read the brief",
    products: ["OmniSlash"],
    caption: {
      text: "A Reviewer reads the brief on its own, with none of your chat behind it. Any question the brief leaves open sends it back to the Architect to fix. When the open question is one only you can answer, the Architect brings it to you. When only trying can answer a question, the Architect runs a small trial first, and what it learns goes back into the ticket.",
      facts: ["omnislash/drilled-ticket-gate", "omnislash/role-state-machine"],
    },
    altSummary: "A Reviewer reads the ticket alone and marks it with a question. Three paths lead from it: back to the Architect, to you when only you can answer, and to a small trial whose result goes back into the ticket.",
  },
  {
    id: "build",
    chapter: 4,
    title: "Parallel builds",
    products: ["OmniSlash", "TaskSlash"],
    caption: {
      text: "Your saved basket gets a Builder of its own, in its own copy of the code, beside builders on other tickets. Before it starts, the files it plans to touch are compared with theirs. When two builds clash, the lower priority one pauses until the other lands, then picks up from the new code. On the computer they share, [TaskSlash](/taskslash) holds each build and test in a queue until there is room for it.",
      facts: ["omnislash/agent-build-worktree", "omnislash/parallel-conflict-checks", "omnislash/branch-conflicts", "taskslash/admission-by-capacity"],
    },
    altSummary: "A Builder works in its own copy of the code beside builders on other tickets. A badge shows the files were compared, one other build is paused at lower priority, and a TaskSlash queue lets each build and test run when there is room.",
  },
  {
    id: "review",
    chapter: 5,
    title: "Skeptical review",
    products: ["OmniSlash"],
    caption: {
      text: "Before the change goes up for merging, Reviewers read it and presume every changed line is wrong. They read and never edit. The Builder fixes each finding or answers it, and the review goes another round. Only when no finding is left open does the Builder open a pull request, the proposed change to the live code.",
      facts: ["omnislash/review-merge-skills", "omnislash/review-run"],
    },
    altSummary: "Two Reviewers look over the built change with a magnifying glass. A finding goes to the Builder, who fixes it, and the line turns green once no finding is open.",
  },
  {
    id: "checks",
    chapter: 6,
    title: "Visual and automated checks",
    products: ["PixelSlash", "FlakeSlash", "UISlash", "OmniSlash"],
    caption: {
      text: "The project's checks run in order and stop at the first one that fails. [PixelSlash](/pixelslash) shows what changed on screen between the old pages and the new ones, and you go through the changes with a few keys: a to accept, r to reject. [FlakeSlash](/flakeslash) names the tests that pass and fail on the same code. [UISlash](/uislash) components take no custom styling, and a check fails any pull request that breaks its rules. When a check fails, the Builder fixes it before it can hand off.",
      facts: ["omnislash/gate-file", "pixelslash/upload-to-review-app", "pixelslash/review-app-keyboard", "flakeslash/flake-same-commit", "uislash/no-styling-escape", "uislash/ui-review-workflow"],
    },
    altSummary: "The built change passes three checks. PixelSlash shows a before and after with the keys a to accept and r to reject, FlakeSlash names one flaky test, and UISlash confirms no custom styling. The Builder fixes what fails before it hands off.",
  },
  {
    id: "ship",
    chapter: 7,
    title: "Inbox, gate and ship",
    products: ["OmniSlash"],
    caption: {
      text: "Every build ends with one of four verdicts: ready to merge, needs you, blocked, or partly done. Only the first two reach the Sentinel. The Builder hands off and stops. It never merges its own work. Its note lands in the Sentinel's inbox with the notes of every other builder on the team, read oldest first. The Sentinel checks each claim for itself. Red checks, an unmet item on the done list or a claim it cannot reproduce go back to the Builder. When the change clashes with newer work, the Sentinel brings it up to date itself. When every answer is yes, it merges, deploys and closes the ticket.",
      facts: ["omnislash/role-state-machine", "omnislash/role-inbox", "omnislash/role-delivery", "omnislash/review-merge-skills"],
    },
    altSummary: "Handoff notes stack in the Sentinel's inbox, oldest first. The Sentinel checks the built change by lantern light at a gatehouse, sends a red check back to the Builder, and lets the passing change cross to be merged and shipped.",
  },
  {
    id: "rollout",
    chapter: 8,
    title: "Live rollout",
    products: ["ToggleSlash"],
    caption: {
      text: "Your saved basket is shipped. The agents stop here. If you want some customers to see a feature before others, [ToggleSlash](/toggleslash) lets you turn it on for a share of users and off again while your app runs, from its dashboard or its command line. That step is yours.",
      facts: ["toggleslash/targeting", "toggleslash/dashboard", "toggleslash/cli"],
    },
    altSummary: "The Owner holds a ToggleSlash switch that turns a feature on for a share of users, from its dashboard or its command line, while some app windows light up.",
  },
  {
    id: "retro",
    chapter: 9,
    title: "Good night retro",
    products: [],
    caption: "The day ends, and you see what shipped today, your saved basket with it.",
    altSummary: "Under a crescent moon, the Owner and the team gather below a Good night board listing what shipped today, the saved basket with it.",
  },
];