/**
 * Scene metadata and shared editorial palette for the /how-it-works animated storybook.
 * Plain English only: no developer jargon, no en or em dashes. Every scene caption is a
 * `Claim` held to the product facts files by facts.test.ts.
 */
import type { Claim } from "#/content/facts";

export type StorybookSceneId =
  | "muse"
  | "architect"
  | "checker"
  | "builder"
  | "checks"
  | "reviewer"
  | "sentinel"
  | "rollout"
  | "retro";

export type StorybookScene = {
  id: StorybookSceneId;
  chapter: number;
  stepsLabel: string;
  shortLabel: string;
  title: string;
  role: string;
  tools: readonly string[];
  caption: Claim;
  altSummary: string;
};

/** Editorial ink-and-paper palette matched to the six role illustrations on /how-it-works. */
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

export const STORYBOOK_TITLE = "Watch it work together";

export const STORYBOOK_INTRO =
  "Follow one idea as it travels from character to character, gathering checks at every scene until it reaches live users.";

export const SCENE_DURATION_MS = 6500;

export const STORYBOOK_SCENES: readonly StorybookScene[] = [
  {
    id: "muse",
    chapter: 1,
    stepsLabel: "Steps 1 and 2",
    shortLabel: "Muse",
    title: "Idea to confirmed design",
    role: "Owner and Muse",
    tools: ["OmniSlash role inbox"],
    caption: {
      text: "The owner shares a rough spark. Muse asks questions, sketches options, and delivers multiple tickets for the confirmed design to the architect's OmniSlash role inbox.",
      facts: ["omnislash/role-inbox"],
    },
    altSummary:
      "Owner sends an idea spark to Muse, which sketches in its open sketchbook and sends five blue design tickets with orange bands into the architect's OmniSlash role inbox.",
  },
  {
    id: "architect",
    chapter: 2,
    stepsLabel: "Step 3",
    shortLabel: "Architect",
    title: "Plan and drill the ticket",
    role: "Architect",
    tools: ["OmniSlash drilled ticket"],
    caption: {
      text: "Architect receives the tickets in the inbox, opens the design into a blueprint, breaks the work into small blocks, and writes drilled tickets with a breakdown and done checklist.",
      facts: ["omnislash/role-inbox", "omnislash/drilled-ticket-gate"],
    },
    altSummary:
      "Architect receives five blue tickets in the OmniSlash role inbox, opens the blueprint on a drafting table, measures with a compass, places orange blocks, and writes a stack of drilled tickets.",
  },
  {
    id: "checker",
    chapter: 3,
    stepsLabel: "Step 4",
    shortLabel: "Checker",
    title: "Verify and stamp go",
    role: "Checker",
    tools: ["OmniSlash ticket gate"],
    caption: {
      text: "Checker verifies the drilled ticket is clear and doable, ticks every item, and records a go sign-off so OmniSlash allows a builder to start.",
      facts: ["omnislash/drilled-ticket-gate"],
    },
    altSummary:
      "Checker ticks three items on the drilled ticket, dips a stamp into an orange ink pad, and stamps GO onto the ticket so the OmniSlash gate lifts open and the stamped ticket glides through.",
  },
  {
    id: "builder",
    chapter: 4,
    stepsLabel: "Steps 5 and 6",
    shortLabel: "Builder",
    title: "Lock and build in isolation",
    role: "Architect and Builder",
    tools: ["OmniSlash lease", "TaskSlash", "UISlash"],
    caption: {
      text: "Architect keeps waiting tickets in the inbox and hands off just one to a builder inside a lease-locked isolated workspace. Builder builds it into a wrapped package with UISlash while TaskSlash queues builds by machine capacity.",
      facts: [
        "omnislash/role-inbox",
        "omnislash/leases",
        "omnislash/agent-build-worktree",
        "taskslash/admission-by-capacity",
        "taskslash/moon-targets",
        "uislash/no-styling-escape",
      ],
    },
    altSummary:
      "Architect keeps four waiting tickets in an inbox and hands off only one ticket to Builder inside a lease-locked isolated workspace while a second agent bumps the boundary and bounces back. Builder builds with UISlash and TaskSlash until the ticket turns into a wrapped blue package.",
  },
  {
    id: "checks",
    chapter: 5,
    stepsLabel: "Step 7",
    shortLabel: "Checks",
    title: "Visual and automated checks",
    role: "Builder handoff",
    tools: ["PixelSlash", "UISlash", "FlakeSlash"],
    caption: {
      text: "Builder submits the built package and steps back. PixelSlash highlights visual changes for human approval, UISlash checks the design system, and FlakeSlash scans connected projects every 10 minutes.",
      facts: [
        "pixelslash/upload-to-review-app",
        "pixelslash/block-ci-on-review",
        "uislash/ui-review-workflow",
        "flakeslash/dashboard-scan",
        "flakeslash/flake-same-commit",
      ],
    },
    altSummary:
      "Builder pushes the wrapped blue package across the handoff line and steps back. PixelSlash highlights a visual change for human approval alongside a UISlash design check and the 10-minute FlakeSlash dashboard scan.",
  },
  {
    id: "reviewer",
    chapter: 6,
    stepsLabel: "Step 8",
    shortLabel: "Reviewer",
    title: "Skeptical review across models",
    role: "Skeptical reviewer",
    tools: ["OmniSlash review"],
    caption: {
      text: "Independent read-only reviewers across different AI models presume every changed line is wrong, flagging flaws for the builder to fix without editing directly.",
      facts: ["omnislash/review-merge-skills"],
    },
    altSummary:
      "Skeptical reviewer sweeps a magnifying glass across the code sheet above the wrapped blue package alongside a second AI model, spots a flaw, sends a read-only flag to Builder, and sees the line turn green once fixed.",
  },
  {
    id: "sentinel",
    chapter: 7,
    stepsLabel: "Step 9",
    shortLabel: "Sentinel",
    title: "Approve, merge and deploy",
    role: "Sentinel",
    tools: ["OmniSlash role inbox"],
    caption: {
      text: "At the gatehouse bridge, Sentinel checks by lantern light that every automated, visual, and skeptical check passed, then merges and deploys the built package.",
      facts: ["omnislash/role-inbox", "omnislash/review-merge-skills", "omnislash/role-delivery"],
    },
    altSummary:
      "Sentinel holds a glowing lantern and magnifying glass over the wrapped blue package on the gatehouse bridge, verifies all three green seals one by one, and lets it cross into the arch to merge and deploy.",
  },
  {
    id: "rollout",
    chapter: 8,
    stepsLabel: "Step 10",
    shortLabel: "Rollout",
    title: "Roll out behind a feature switch",
    role: "Owner and ToggleSlash",
    tools: ["ToggleSlash"],
    caption: {
      text: "The owner watches ToggleSlash turn the feature switch on live, expanding from specific groups to a full rollout with every change recorded in an audit trail.",
      facts: ["toggleslash/targeting", "toggleslash/live-updates", "toggleslash/audit-trail"],
    },
    altSummary:
      "Owner watches as ToggleSlash flips the feature switch live, stepping from 10 to 50 to 100 percent while user app windows light up in waves and an audit trail entry records the change.",
  },
  {
    id: "retro",
    chapter: 9,
    stepsLabel: "End of day",
    shortLabel: "Retro",
    title: "Good night and learn from the day",
    role: "All roles",
    tools: ["OmniSlash good night"],
    caption: {
      text: "At the end of the day, every role gathers for a good-night retro. Together they review what worked, capture lessons from past runs, and update their shared playbook so the next cycle starts smarter.",
      facts: ["omnislash/role-tick", "omnislash/role-brief", "omnislash/role-end"],
    },
    altSummary:
      "Under a crescent moon and stars, Owner, Muse, Architect, Checker, Builder, Reviewer, and Sentinel gather below a good-night retro board. Notes from the day flow into the shared playbook so the next cycle starts smarter.",
  },
];
