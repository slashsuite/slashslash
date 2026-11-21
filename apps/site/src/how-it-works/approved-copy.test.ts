import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

/*
 * The approved copy for /how-it-works, checked word for word against the built page (`bunx moon run site:test`
 * builds first). It does not import the content modules, so an accidental wording change fails here.
 */

const DIST = resolve(import.meta.dirname, "../../dist");

function html(): string {
  const path = resolve(DIST, "how-it-works.html");
  if (!existsSync(path)) throw new Error(`No built page at ${path}. Run the build first: bunx moon run site:build.`);
  return readFileSync(path, "utf8");
}

/** Escapes undone, spaces folded. */
function unescape(text: string): string {
  return text
    .replaceAll("&#39;", "'")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** The page's visible body text: tags and scripts dropped, escapes undone, spaces folded. */
function words(page: string): string {
  // From the body on: the head's title repeats the headline, and must not stand in for the h1.
  return unescape(
    page
      .slice(page.indexOf("<body"))
      .replace(/<(script|style|template)[\s\S]*?<\/\1>/g, " ")
      // Code spans and links sit inside a sentence, so their tags add no space; other closing inline tags neither.
      .replace(/<\/?(a|code)\b[^>]*>/g, "")
      .replace(/<\/(span|strong|em)>/g, "")
      .replace(/<[^>]+>/g, " "),
  );
}

/** The en dash and the em dash, written by code point so this file carries neither. */
const LONG_DASHES = new RegExp(`[${String.fromCodePoint(0x2013, 0x2014)}]`);

const HEADLINE = "From idea to live release, and what checks each step";
const DESCRIPTION =
  "How an idea becomes a live software release: six clear AI roles, written rules, and Slash checks at every step, with planned parts marked planned.";

const LEAD = [
  "Every change here is built by one AI agent, then checked by separate agents and by the Slash products before it reaches users.",
  "One cycle, ten steps. Each step names the role doing the work, the written rule it follows, and the Slash product checking the result. Solid cards run today. Dashed cards are planned.",
];

/** The illustrated roles: id, heading, subtitle, image path, explanation. */
const ROLES: [string, string, string, string, string][] = [
  [
    "muse",
    "Muse",
    "Explores the idea",
    "/how-it-works/muse.webp",
    "The muse is the agent you talk through a rough idea with before anyone plans or builds. It asks questions, explores options, and once you confirm a design, sends it to the architect's role inbox.",
  ],
  [
    "architect",
    "Architect",
    "Plans, drills and assigns",
    "/how-it-works/architect.webp",
    "The architect turns a confirmed design into a clear plan broken into small tasks. It writes out each drilled ticket, assigns a builder once checked, and steps in to merge and deploy when there is no sentinel.",
  ],
  [
    "checker",
    "Checker",
    "Verifies the ticket is doable",
    "/how-it-works/checker.webp",
    "Before any builder starts, the checker inspects the architect's drilled ticket to make sure the work is clear and doable. Once satisfied, it records a go sign-off; without it, OmniSlash blocks the task from starting unless overridden.",
  ],
  [
    "builder",
    "Builder",
    "Builds in an isolated workspace",
    "/how-it-works/builder.webp",
    "A builder is an agent given one checked task to build inside its own isolated workspace, protected by a lease so two agents cannot collide on the same work. It submits a proposed change for review; it can never merge or deploy its own work.",
  ],
  [
    "skeptical-reviewer",
    "Skeptical reviewer",
    "Presumes every changed line is wrong",
    "/how-it-works/skeptical-reviewer.webp",
    "Independent, read-only reviewers running across different AI models inspect a builder's proposed change before it can merge. They presume every changed line has a flaw and report problems without editing anything themselves.",
  ],
  [
    "sentinel",
    "Sentinel",
    "Approves, merges and deploys",
    "/how-it-works/sentinel.webp",
    "The sentinel is the dedicated gatekeeper that oversees every proposed change before it reaches users. It runs skeptical reviews, waits for automated and visual checks to pass, then merges and deploys the release.",
  ],
];

/** The nine plain-English terms: id, heading, tagline, explanation. */
const TERMS: [string, string, string, string][] = [
  [
    "drilled-ticket",
    "Drilled ticket",
    "Worked out before building starts",
    "A task written out in full before any agent begins building: a clear breakdown of the work, a checklist of what done looks like, and a recorded go sign-off from the checker. OmniSlash refuses to start a builder without all three unless overridden.",
  ],
  [
    "written-rule",
    "Written rule",
    "The playbook each role follows",
    "A written set of instructions that guides each AI role on how to do its job, which checks to run, and what it is not allowed to do, such as preventing a builder from merging its own work.",
  ],
  [
    "isolated-workspace",
    "Isolated workspace",
    "One private copy per builder",
    "Every builder works inside its own separate copy of the project, split cleanly from the live version. Multiple builders can work at the same time without overwriting or stepping on each other's changes.",
  ],
  [
    "lease",
    "Lease",
    "One agent per task at a time",
    "A time-limited lock OmniSlash places on an active task and its isolated workspace. Only one agent can hold it at a time; a second request is refused until the lease is released or expires.",
  ],
  [
    "role-inbox",
    "Role inbox",
    "Clean handoffs between roles",
    "A dedicated inbox for each role that stores unread messages and handoff notes oldest first. Confirmed designs from the muse and finished work from builders land here without holding up the sender.",
  ],
  [
    "design-system",
    "Design system",
    "Approved visual building blocks",
    "A shared library of pre-approved screen components and colour themes. Builders compose pages strictly from these building blocks, and automated checks fail any proposed change that tries to invent ad-hoc styling.",
  ],
  [
    "proposed-change",
    "Proposed change",
    "Finished work waiting for review",
    "The bundle of finished edits a builder submits once it completes a task. Automated checks, visual comparisons, and skeptical reviews all run against this proposed change before anything touches the live product.",
  ],
  [
    "merge-and-deploy",
    "Merge and deploy",
    "Approved work going live",
    "Merging brings an approved proposed change from its isolated workspace into the main project; deploying publishes that updated version so users can reach it. Only the sentinel (or architect) can merge, never the builder.",
  ],
  [
    "feature-switch",
    "Feature switch",
    "Controls who sees a new change",
    "A live control built into the app that turns a new feature on or off for specific customers, user groups, or a growing percentage of users while the app is running, without rebuilding the software.",
  ],
];

/** The diagram's rows: number, node label, role and rule, tool at this step. */
const NODES: [string, string, string, string][] = [
  ["1", "Idea", "The owner", "None"],
  ["2", "Explore the design", "Muse. Explores the idea and hands over a confirmed design", "OmniSlash: delivers the design to the architect's role inbox"],
  ["3", "Drill the ticket", "Architect. Turns the design into a drilled ticket", "OmniSlash: requires a written breakdown and what-done-looks-like checklist on every ticket"],
  ["4", "Check the ticket", "Checker. Verifies the drilled ticket is clear and doable", "OmniSlash: refuses to start a builder without a recorded go sign-off unless overridden"],
  ["5", "Assign and lock", "Architect. Starts a builder on the checked ticket", "OmniSlash: claims a lease on the task and isolated workspace so no two agents collide"],
  ["6", "Build in isolation", "Builder. Works inside its own isolated workspace", "OmniSlash: private copy of the project per task. TaskSlash: paces builds and tests to fit machine capacity. UISlash: locks screens to the design system"],
  ["6a", "Size and security check", "Builder", "BundleSlash (planned): will compare app size before and after, check whether security flaws in third-party packages reach your code, and prepare releases"],
  ["7", "Automated and visual checks", "Builder submits a proposed change and hands off. Never merges its own work", "PixelSlash: before-and-after screenshots for human sign-off and inconsistent shot detection. UISlash: automated design system check. FlakeSlash: scans for unreliable tests every 10 minutes"],
  ["7a", "Reliability check per change", "Automated check", "FlakeSlash (planned): will post an informational test reliability summary on each proposed change without blocking the release"],
  ["8", "Skeptical review", "Skeptical reviewer. Independent reviewers across models presume every changed line is wrong", "OmniSlash: read-only skeptical review across multiple AI models"],
  ["9", "Merge and deploy", "Sentinel, else architect. Never the builder", "OmniSlash: handoff delivered to the sentinel's role inbox, then merged and deployed once every check passes"],
  ["10", "Roll out behind a feature switch", "Live rollout", "ToggleSlash: audience targeting, gradual percentage rollouts, live updates, full audit trail"],
];
const PLANNED_NODES = new Set(["6a", "7a"]);

/** Everything after the diagram's rows, in order. */
const REST = [
  "Solid: runs today. Dashed: planned. Each role follows a written rule; each Slash product checks that step's output.",
  "The steps in words",
  "1. Idea. The owner has an idea. Next: the muse.",
  "2. Explore the design. Role: muse. Written rule: explore the problem, ask questions, and hand over a design once it is confirmed. The handoff goes through OmniSlash's role inbox, which stores messages and lists unread handoffs oldest first. Next: the architect.",
  "3. Drill the ticket. Role: architect. Written rule: turn the confirmed design into a plan and break it into drilled tickets. Every drilled ticket carries a written breakdown and a clear checklist of what done looks like before anyone starts building. Next: the checker.",
  "4. Check the ticket. Role: checker. Check: review the architect's drilled ticket to verify the work is clear and doable, then record a go sign-off on its current text. OmniSlash refuses to start a builder without the breakdown, the done checklist, and that recorded go sign-off unless overridden. Next: assign and lock.",
  "5. Assign and lock. Role: architect. Written rule: assign a builder to the checked ticket. Check: leases. OmniSlash allows only one live holder per active task or isolated workspace; a second agent is refused until the lease is released or expires. Next: a builder.",
  "6. Build in an isolated workspace. Role: builder. OmniSlash opens the builder inside its own isolated workspace, split cleanly from the live version so parallel builders never collide. Checks while building:",
  "TaskSlash: runs build and test steps in the right order, waiting for earlier steps to pass first and starting each job only when the machine has spare capacity, with a live view of what is running and waiting.",
  "UISlash: builds every screen strictly from the design system's approved components, so a builder cannot invent ad-hoc styling.",
  "BundleSlash (planned): will compare app size before and after, check whether security flaws in third-party packages reach your code, and prepare releases.",
  "Next: automated and visual checks.",
  "7. Automated and visual checks. Role: builder submits a proposed change and hands off. It never merges or deploys its own work. Checks:",
  "PixelSlash: sends screenshots to a review app that highlights every visual difference against the live version. A person accepts or rejects each change, and automated checks wait for that decision. Any changed screenshot is retaken and flagged when shots disagree.",
  "UISlash: an automated check fails any proposed change that breaks design system rules, alongside an advisory AI review.",
  "FlakeSlash: scans connected projects every 10 minutes. A test that both failed and passed on the exact same version is flagged as unreliable; nothing else is.",
  "FlakeSlash reliability check (planned): one informational summary on each proposed change, never blocking the release and linking straight to the dashboard.",
  "Next: the handoff note goes to the sentinel's role inbox (or the architect's when there is no sentinel) without blocking the builder.",
  "8. Skeptical review. Role: skeptical reviewer. Independent, read-only reviewers running across different AI models inspect the builder's proposed change before it can merge. They presume every changed line is wrong and report flaws without editing anything themselves. Next: merge and deploy.",
  "9. Merge and deploy. Role: sentinel, else architect. Never the builder. The sentinel confirms that every automated check, visual review, and skeptical review passed, then merges and deploys the proposed change. Next: rollout.",
  "10. Roll out behind a feature switch. Product: ToggleSlash. A feature switch decides which users see the new version: by environment, by customer, by user attributes, by segment, when another switch is already on, or by gradual percentage. Running apps receive feature switch updates live, and check automatically if the live connection drops. Every change is recorded in an audit trail with before and after values.",
  "Today and planned",
  'Legend: solid outline, runs today. Dashed outline and the word "planned", not built yet.',
  "Today",
  "OmniSlash: drilled-ticket gate, isolated workspace per builder, leases, written rules per role, multi-model skeptical review, merge and deploy rules, and role inboxes. Alpha.",
  "UISlash: design system with no ad-hoc styling escapes, seven checked themes, and automated design system checks on proposed changes. Version 0.x.",
  "TaskSlash: capacity-aware build and test queue, step ordering, live progress view, and stopping running jobs on demand. Alpha.",
  "FlakeSlash: proves when a test fails and passes on the same version and scans connected projects on a dashboard. Alpha.",
  "PixelSlash: visual before-and-after comparison, human approval app, automated check waiting, and inconsistent screenshot detection. Alpha.",
  "ToggleSlash: feature switches you run on your own servers, audience targeting, percentage rollouts, and live updates. Alpha.",
  "Planned",
  "OmniSlash: conflict checks between parallel builders; a team server with per-user access.",
  "UISlash: a mobile app component package.",
  "TaskSlash: custom output filters; scheduling across a pool of machines; scheduling for automated test servers.",
  "FlakeSlash: an informational reliability summary on each proposed change; a dashboard view per change; direct result uploads.",
  "PixelSlash: one combined visual review across all parts of a multi-app project.",
  "ToggleSlash: automatic step-by-step percentage rollouts; approvals before a feature switch goes live; scheduled changes.",
  "BundleSlash: compares app size between versions before review, checks whether security flaws in third-party packages reach your code, and prepares releases.",
  "The products",
  "OmniSlash: keeps track of tasks, projects, and the AI agents working on them.",
  "UISlash: a design system of approved components and themes that keeps every page consistent without ad-hoc styling.",
  "TaskSlash: queues builds and tests until the machine has spare capacity for each.",
  "FlakeSlash: finds unreliable tests that pass and fail on the same version, grouped into issues.",
  "PixelSlash: shows what changed visually on a web page so a person can accept or reject each change.",
  "ToggleSlash: feature switches you run on your own servers to control who sees new changes while the app runs.",
  "BundleSlash (planned): app size checks between versions, security flaw reachability, and release preparation.",
  "Next: the home page, technical details for developers, or any product page.",
  "Source: OmniSlash at github.com/slashsuite/omnislash (Elastic License 2.0, source available). UISlash and TaskSlash are MIT. PixelSlash, FlakeSlash and ToggleSlash are Elastic License 2.0. Docs: slashslash.build/uislash (UISlash), slashslash.build/pixelslash/docs (PixelSlash).",
];

/** Where each name in The products links, and the names that link nowhere. */
const TOOL_LINKS: Record<string, string | undefined> = {
  OmniSlash: "/omnislash",
  UISlash: "/uislash",
  TaskSlash: "/taskslash",
  FlakeSlash: "/flakeslash",
  PixelSlash: "/pixelslash",
  ToggleSlash: "/toggleslash",
  BundleSlash: undefined,
};

/** The markup of the first `<li>` carrying `attribute`. */
function item(page: string, attribute: string): string {
  const match = page.match(new RegExp(`<li[^>]*${attribute}[\\s\\S]*?</li>`));
  if (!match) throw new Error(`No list item with ${attribute}`);
  return match[0];
}

describe("the approved copy, word for word on /how-it-works", () => {
  const page = html();
  const body = words(page);

  test("the h1 is the headline, once", () => {
    const h1s = [...page.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => unescape((m[1] ?? "").replace(/<[^>]+>/g, "")));
    expect(h1s).toEqual([HEADLINE]);
  });

  test("the title and the meta description are the headline and the share card description", () => {
    expect(unescape(page.match(/<title>([^<]*)<\/title>/)?.[1] ?? "")).toBe(`${HEADLINE} | slashslash.build`);
    expect(unescape(page.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "")).toBe(DESCRIPTION);
  });

  test("every line of the copy is on the page, in order", () => {
    const lines = [
      HEADLINE,
      ...LEAD,
      "The roles",
      "Before the diagram, meet the six roles that carry an idea to a live release.",
      ...ROLES.flatMap(([, name, role, , summary]) => [name, role, summary]),
      "The terms",
      "Every concept used in the diagram and steps below, explained in plain English.",
      ...TERMS.flatMap(([, name, tagline, summary]) => [name, tagline, summary]),
      "The flow diagram",
      ...NODES.flatMap(([id, label, role, tool]) => [`${id} ${label}`, role, tool]),
      ...REST,
    ];
    let from = 0;
    for (const line of lines) {
      const at = body.indexOf(line.replaceAll("`", ""), from);
      expect(at, line).toBeGreaterThan(-1);
      from = at + 1;
    }
  });

  test("each illustrated role carries its image in dist/ and non-empty alt text", () => {
    for (const [id, name, role, image, summary] of ROLES) {
      const markup = item(page, `data-role="${id}"`);
      expect(markup, id).toContain(`src="${image}"`);
      const alt = markup.match(/alt="([^"]+)"/)?.[1] ?? "";
      expect(alt.length, `${id} alt`).toBeGreaterThan(10);
      expect(existsSync(resolve(DIST, image.slice(1))), image).toBe(true);
      const text = words(`<body>${markup}`);
      for (const field of [name, role, summary]) expect(text, `${id}: ${field}`).toContain(field.replaceAll("`", ""));
    }
  });

  test("each term renders in its own card without an image", () => {
    for (const [id, name, tagline, summary] of TERMS) {
      const markup = item(page, `data-term="${id}"`);
      expect(markup, id).not.toContain("<img");
      const text = words(`<body>${markup}`);
      for (const field of [name, tagline, summary]) expect(text, `${id}: ${field}`).toContain(field.replaceAll("`", ""));
    }
  });

  test("each diagram node holds its own row, and only 6a and 7a are planned", () => {
    for (const [id, label, role, tool] of NODES) {
      const markup = item(page, `data-node="${id}"`);
      const text = words(`<body>${markup}`);
      for (const field of [label, role, tool]) expect(text, `${id}: ${field}`).toContain(field.replaceAll("`", ""));
      const planned = PLANNED_NODES.has(id);
      expect(markup, id).toContain(`data-stage="${planned ? "planned" : "today"}"`);
      expect(text.includes("Planned"), id).toBe(planned);
    }
  });

  test("each built product's name links to its page here, and BundleSlash links nowhere", () => {
    for (const [name, href] of Object.entries(TOOL_LINKS)) {
      const links = [...item(page, `data-tool="${name}"`).matchAll(/<a[^>]*href="([^"]*)"/g)].map((m) => m[1]);
      expect(links, name).toEqual(href === undefined ? [] : [href]);
    }
  });

  test("keeps developer jargon, long dashes, and banned names off /how-it-works", () => {
    expect(page).not.toMatch(LONG_DASHES);
    expect(page).not.toMatch(/tesla|whatsapp/i);
    expect(body).not.toMatch(/\b(worktree|git|spinoff|className|origin\/main|cargo|npm|polling|repositories|self-hosted)\b/i);
  });
});
