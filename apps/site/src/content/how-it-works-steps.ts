/**
 * /how-it-works: the ten steps in plain English and the today and planned lists, written for non-technical
 * readers using the six roles and nine terms in how-it-works-roles.ts. Every sentence that says what a
 * product does is a `Claim`, held to the facts files by facts.built.test.ts.
 */
import type { Claim } from "#/content/facts";

/** A run of a step's text: plain words, or a claim. Runs are shown one after another, a space between. */
export type Run = string | Claim;

/** One step in words: its bold title, its text, any list of checks, and the text after that list. */
export type FlowStep = {
  title: string;
  text: readonly Run[];
  checks?: readonly Claim[];
  after?: readonly Run[];
};

export const STEPS: { title: string; steps: readonly FlowStep[] } = {
  title: "The steps in words",
  steps: [
    { title: "1. Idea.", text: ["The owner has an idea.", "Next: the muse."] },
    {
      title: "2. Explore the design.",
      text: [
        "Role: muse. Written rule: explore the problem, ask questions, and hand over a design once it is confirmed.",
        {
          text: "The handoff goes through OmniSlash's role inbox, which stores messages and lists unread handoffs oldest first.",
          facts: ["omnislash/role-inbox"],
        },
        "Next: the architect.",
      ],
    },
    {
      title: "3. Drill the ticket.",
      text: [
        "Role: architect. Written rule: turn the confirmed design into a plan and break it into drilled tickets.",
        {
          text: "Every drilled ticket carries a written breakdown and a clear checklist of what done looks like before anyone starts building.",
          facts: ["omnislash/drilled-ticket-gate"],
        },
        "Next: the checker.",
      ],
    },
    {
      title: "4. Check the ticket.",
      text: [
        "Role: checker.",
        {
          text: "Check: review the architect's drilled ticket to verify the work is clear and doable, then record a go sign-off on its current text. OmniSlash refuses to start a builder without the breakdown, the done checklist, and that recorded go sign-off unless overridden.",
          facts: ["omnislash/drilled-ticket-gate"],
        },
        "Next: assign and lock.",
      ],
    },
    {
      title: "5. Assign and lock.",
      text: [
        "Role: architect. Written rule: assign a builder to the checked ticket.",
        {
          text: "Check: leases. OmniSlash allows only one live holder per active task or isolated workspace; a second agent is refused until the lease is released or expires.",
          facts: ["omnislash/leases", "omnislash/drilled-ticket-gate"],
        },
        "Next: a builder.",
      ],
    },
    {
      title: "6. Build in an isolated workspace.",
      text: [
        "Role: builder.",
        {
          text: "OmniSlash opens the builder inside its own isolated workspace, split cleanly from the live version so parallel builders never collide.",
          facts: ["omnislash/agent-build-worktree"],
        },
        "Checks while building:",
      ],
      checks: [
        {
          text: "TaskSlash: runs build and test steps in the right order, waiting for earlier steps to pass first and starting each job only when the machine has spare capacity, with a live view of what is running and waiting.",
          facts: ["taskslash/moon-targets", "taskslash/admission-by-capacity", "taskslash/run-command", "taskslash/top"],
        },
        {
          text: "UISlash: builds every screen strictly from the design system's approved components, so a builder cannot invent ad-hoc styling.",
          facts: ["uislash/no-styling-escape", "uislash/what-it-is"],
        },
        {
          text: "BundleSlash (planned): will compare app size before and after, check whether security flaws in third-party packages reach your code, and prepare releases.",
          planned: "BundleSlash",
        },
      ],
      after: ["Next: automated and visual checks."],
    },
    {
      title: "7. Automated and visual checks.",
      text: ["Role: builder submits a proposed change and hands off. It never merges or deploys its own work. Checks:"],
      checks: [
        {
          text: "PixelSlash: sends screenshots to a review app that highlights every visual difference against the live version. A person accepts or rejects each change, and automated checks wait for that decision. Any changed screenshot is retaken and flagged when shots disagree.",
          facts: [
            "pixelslash/upload-to-review-app",
            "pixelslash/review-app-keyboard",
            "pixelslash/block-ci-on-review",
            "pixelslash/flaky-shot-detection",
          ],
        },
        {
          text: "UISlash: an automated check fails any proposed change that breaks design system rules, alongside an advisory AI review.",
          facts: ["uislash/ui-review-workflow"],
        },
        {
          text: "FlakeSlash: scans connected projects every 10 minutes. A test that both failed and passed on the exact same version is flagged as unreliable; nothing else is.",
          facts: ["flakeslash/dashboard-scan", "flakeslash/flake-same-commit"],
        },
        {
          text: "FlakeSlash reliability check (planned): one informational summary on each proposed change, never blocking the release and linking straight to the dashboard.",
          facts: ["flakeslash/pr-check"],
        },
      ],
      after: [
        "Next: the handoff note goes to the sentinel's role inbox (or the architect's when there is no sentinel) without blocking the builder.",
      ],
    },
    {
      title: "8. Skeptical review.",
      text: [
        "Role: skeptical reviewer.",
        {
          text: "Independent, read-only reviewers running across different AI models inspect the builder's proposed change before it can merge. They presume every changed line is wrong and report flaws without editing anything themselves.",
          facts: ["omnislash/review-merge-skills"],
        },
        "Next: merge and deploy.",
      ],
    },
    {
      title: "9. Merge and deploy.",
      text: [
        "Role: sentinel, else architect. Never the builder.",
        {
          text: "The sentinel confirms that every automated check, visual review, and skeptical review passed, then merges and deploys the proposed change.",
          facts: ["omnislash/role-skills", "omnislash/review-merge-skills", "omnislash/role-delivery"],
        },
        "Next: rollout.",
      ],
    },
    {
      title: "10. Roll out behind a feature switch.",
      text: [
        "Product: ToggleSlash.",
        {
          text: "A feature switch decides which users see the new version: by environment, by customer, by user attributes, by segment, when another switch is already on, or by gradual percentage.",
          facts: ["toggleslash/what-it-is", "toggleslash/targeting"],
        },
        {
          text: "Running apps receive feature switch updates live, and check automatically if the live connection drops.",
          facts: ["toggleslash/live-updates"],
        },
        {
          text: "Every change is recorded in an audit trail with before and after values.",
          facts: ["toggleslash/audit-trail"],
        },
      ],
    },
  ],
};

/** Today and planned: the legend, then each list under its own heading. */
export const STATUS: {
  title: string;
  legend: string;
  todayTitle: string;
  today: readonly Claim[];
  plannedTitle: string;
  planned: readonly Claim[];
} = {
  title: "Today and planned",
  legend: 'Legend: solid outline, runs today. Dashed outline and the word "planned", not built yet.',
  todayTitle: "Today",
  today: [
    {
      text: "OmniSlash: drilled-ticket gate, isolated workspace per builder, leases, written rules per role, multi-model skeptical review, merge and deploy rules, and role inboxes. Alpha.",
      facts: [
        "omnislash/drilled-ticket-gate",
        "omnislash/agent-build-worktree",
        "omnislash/leases",
        "omnislash/role-skills",
        "omnislash/review-merge-skills",
        "omnislash/role-inbox",
        "omnislash/role-runs",
        "omnislash/role-delivery",
        "omnislash/what-it-is",
      ],
    },
    {
      text: "UISlash: design system with no ad-hoc styling escapes, seven checked themes, and automated design system checks on proposed changes. Version 0.x.",
      facts: [
        "uislash/react-components",
        "uislash/no-styling-escape",
        "uislash/seven-themes",
        "uislash/ui-review-workflow",
        "uislash/what-it-is",
      ],
    },
    {
      text: "TaskSlash: capacity-aware build and test queue, step ordering, live progress view, and stopping running jobs on demand. Alpha.",
      facts: [
        "taskslash/daemon-queue",
        "taskslash/admission-by-capacity",
        "taskslash/moon-targets",
        "taskslash/top",
        "taskslash/cancel",
        "taskslash/what-it-is",
      ],
    },
    {
      text: "FlakeSlash: proves when a test fails and passes on the same version and scans connected projects on a dashboard. Alpha.",
      facts: ["flakeslash/flake-same-commit", "flakeslash/dashboard-scan", "flakeslash/what-it-is"],
    },
    {
      text: "PixelSlash: visual before-and-after comparison, human approval app, automated check waiting, and inconsistent screenshot detection. Alpha.",
      facts: [
        "pixelslash/compare-two-pngs",
        "pixelslash/upload-to-review-app",
        "pixelslash/block-ci-on-review",
        "pixelslash/flaky-shot-detection",
        "pixelslash/what-it-is",
      ],
    },
    {
      text: "ToggleSlash: feature switches you run on your own servers, audience targeting, percentage rollouts, and live updates. Alpha.",
      facts: ["toggleslash/server", "toggleslash/targeting", "toggleslash/live-updates", "toggleslash/what-it-is"],
    },
  ],
  plannedTitle: "Planned",
  planned: [
    {
      text: "OmniSlash: conflict checks between parallel builders; a team server with per-user access.",
      facts: ["omnislash/parallel-conflict-checks", "omnislash/team-server"],
    },
    { text: "UISlash: a mobile app component package.", facts: ["uislash/react-native"] },
    {
      text: "TaskSlash: custom output filters; scheduling across a pool of machines; scheduling for automated test servers.",
      facts: ["taskslash/filter-plugins", "taskslash/machine-pool", "taskslash/ci-runners"],
    },
    {
      text: "FlakeSlash: an informational reliability summary on each proposed change; a dashboard view per change; direct result uploads.",
      facts: ["flakeslash/pr-check", "flakeslash/pr-page", "flakeslash/upload"],
    },
    {
      text: "PixelSlash: one combined visual review across all parts of a multi-app project.",
      facts: ["pixelslash/combined-subproject-review"],
    },
    {
      text: "ToggleSlash: automatic step-by-step percentage rollouts; approvals before a feature switch goes live; scheduled changes.",
      facts: ["toggleslash/progressive-rollouts", "toggleslash/approvals", "toggleslash/scheduled-changes"],
    },
    {
      text: "BundleSlash: compares app size between versions before review, checks whether security flaws in third-party packages reach your code, and prepares releases.",
      planned: "BundleSlash",
    },
  ],
};
