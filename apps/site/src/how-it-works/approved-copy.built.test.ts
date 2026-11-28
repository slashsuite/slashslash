import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";

/*
 * The approved copy for /how-it-works, checked word for word against the built page (`bunx moon run site:test`
 * builds first). It does not import the content modules, so an accidental wording change fails here. Links in
 * the copy are written here as their text alone, since the page shows only the text.
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
      // React marks text joins with empty comments, which add nothing a reader sees.
      .replace(/<!--[\s\S]*?-->/g, "")
      // Code spans and links sit inside a sentence, so their tags add no space; other closing inline tags neither.
      .replace(/<\/?(a|code)\b[^>]*>/g, "")
      .replace(/<\/(span|strong|em)>/g, "")
      .replace(/<[^>]+>/g, " "),
  );
}

/** The en dash and the em dash, written by code point so this file carries neither. */
const LONG_DASHES = new RegExp(`[${String.fromCodePoint(0x2013, 0x2014)}]`);

const HEADLINE = "Bring the idea. Agents ship it, and the calls that matter stay yours.";
const DESCRIPTION =
  "Follow one idea from a chat to shipped work. Agents plan, build, check and ship it, and stop for you at each decision only you can make.";

const HERO = "It starts as a thought you type into a chat. Say it is a saved basket for your shop, so customers can come back to what they picked. A small team of agents turns that thought into a plan, builds it, checks it and ships it. At each decision only you can make, the work stops and waits for you.";

/** The nine scenes, each as its title and caption, as the page lists them for readers without scripts. */
const FILMSTRIP = [
  "Explore and confirm: You open a chat with the Muse and tell it about the saved basket. The Muse asks questions until the idea looks whole, then asks you whether it is complete. Say no, and you keep talking. Say yes, and only then does it become a ticket.",
  "Shape the ticket: The Architect picks up your saved basket and turns it into a ticket. The ticket records the details the Architect dug into and a list of what done means. A build cannot start without both.",
  "Cold read the brief: A Reviewer reads the brief on its own, with none of your chat behind it. Any question the brief leaves open sends it back to the Architect to fix. When the open question is one only you can answer, the Architect brings it to you. When only trying can answer a question, the Architect runs a small trial first, and what it learns goes back into the ticket.",
  "Parallel builds: Your saved basket gets a Builder of its own, in its own copy of the code, beside builders on other tickets. Before it starts, the files it plans to touch are compared with theirs. When two builds clash, the lower priority one pauses until the other lands, then picks up from the new code. On the computer they share, TaskSlash holds each build and test in a queue until there is room for it.",
  "Skeptical review: Before the change goes up for merging, Reviewers read it and presume every changed line is wrong. They read and never edit. The Builder fixes each finding or answers it, and the review goes another round. Only when no finding is left open does the Builder open a pull request, the proposed change to the live code.",
  "Visual and automated checks: The project's checks run in order and stop at the first one that fails. PixelSlash shows what changed on screen between the old pages and the new ones, and you go through the changes with a few keys: a to accept, r to reject. FlakeSlash names the tests that pass and fail on the same code. UISlash components take no custom styling, and a check fails any pull request that breaks its rules. When a check fails, the Builder fixes it before it can hand off.",
  "Inbox, gate and ship: Every build ends with one of four verdicts: ready to merge, needs you, blocked, or partly done. Only the first two reach the Sentinel. The Builder hands off and stops. It never merges its own work. Its note lands in the Sentinel's inbox with the notes of every other builder on the team, read oldest first. The Sentinel checks each claim for itself. Red checks, an unmet item on the done list or a claim it cannot reproduce go back to the Builder. When the change clashes with newer work, the Sentinel brings it up to date itself. When every answer is yes, it merges, deploys and closes the ticket.",
  "Live rollout: Your saved basket is shipped. The agents stop here. If you want some customers to see a feature before others, ToggleSlash lets you turn it on for a share of users and off again while your app runs, from its dashboard or its command line. That step is yours.",
  "Good night retro: The day ends, and you see what shipped today, your saved basket with it.",
];

/** Meet the team: id, name, image path, line. */
const ROLES: [string, string, string, string][] = [
  ["muse","Muse","/how-it-works/muse.webp","Talks your idea through with you and asks whether it is complete before anything is ticketed."],
  ["architect","Architect","/how-it-works/architect.webp","One per team. Turns your idea into a ticket that says what done means, then starts each build."],
  ["builder","Builder","/how-it-works/builder.webp","One per ticket, in its own copy of the code. Builds the change, runs its checks, opens the pull request and hands off. It never merges."],
  ["reviewer","Reviewer","/how-it-works/skeptical-reviewer.webp","Reads the brief before the build and the change after it, presumes every changed line is wrong, and never edits."],
  ["sentinel","Sentinel","/how-it-works/sentinel.webp","One per team. Reads every builder's handoff from one inbox, checks the work for itself, then merges and ships it. A team with no Sentinel has its Architect do this."],
];

const CONTROL = [
  "Where you stay in control",
  "The agents do the shaping, building and checking. These are the moments the work stops for you.",
  "The idea. You say whether it is complete. Nothing is ticketed for building before your yes.",
  "A planning question. When the Architect hits a question only you can decide, it asks you and waits.",
  "A builder that needs you. A Builder missing a decision or access stops and asks for it. A Builder that marks its change as needing your eyes, for feel, wording or anything visual, waits while you judge it, then hands it on or makes the change you ask for.",
  "The merge call. A taste call, a check someone wants to skip, or merging past a known flaky test goes to you before anything merges.",
  "What changed on screen. You accept or reject each change in PixelSlash. A review you have not done yet does not hold up the handoff. A failed one stops it.",
  "Anything sent outside. Nothing goes to anyone outside without you.",
  "On the dashboard, the Machine page draws the whole flow, tags every step that needs a person, and counts how many are waiting on one.",
];

const STAGES = [
  "Five stages",
  "Idea. You and the Muse talk the thought through until you call it complete. Behind it: OmniSlash, which keeps track of tickets, projects and the agents that work on them.",
  "Plan. The Architect shapes the ticket and a Reviewer reads the brief cold. Behind it: OmniSlash.",
  "Build. Builders work side by side, each in its own copy of the code. Behind it: TaskSlash, which stops builds and tests that start at the same time from overloading one computer, and UISlash, screen parts and themes a site is built from as they are, with no styling of its own.",
  "Ship. The checks run, you review what changed on screen, and the Sentinel merges and deploys. Behind it: PixelSlash, which shows what changed on a web page between two versions and lets a person accept or reject each change, and FlakeSlash, which finds the tests that pass and fail on the same code.",
  "Done. The ticket closes. If you then want to let a feature out to a share of users first, there is ToggleSlash, a feature flag service you run yourself that decides which users see which version of a feature.",
];

/** Where each stage's product names link, in order. */
const STAGE_LINKS: [string, string[]][] = [
  ["Idea.",["/omnislash"]],
  ["Plan.",["/omnislash"]],
  ["Build.",["/taskslash","/uislash"]],
  ["Ship.",["/pixelslash","/flakeslash"]],
  ["Done.",["/toggleslash"]],
];

const STATUS = [
  "Running today and next",
  "Every product here is alpha. It runs today, and any of it may change.",
  "Today",
  "OmniSlash, alpha. A command line tool that runs from a checkout of its public source, with a dashboard whose Machine page places every live ticket on the flow.",
  "TaskSlash, alpha, version 0.1.0. Runs on Linux. There is no installable release yet; you build it from source.",
  "PixelSlash, alpha, version 0.8. Installs from npm. The review app is hosted at pixelslash.dev, or you run it yourself.",
  "UISlash, alpha, every package at version 0.x. Installs from npm, with its docs at hack-cove.com/ui.",
  "FlakeSlash, alpha, version 0.1.0. Its dashboard is hosted at flakeslash.slashslash.build. The command line tool runs from a checkout.",
  "ToggleSlash, alpha, version 0.2.0. You run the server yourself. There is no public hosted service.",
  "Next",
  "These are planned, with no dates.",
  "OmniSlash: a team server where each person has their own access.",
  "TaskSlash: scheduling across a pool of machines, and for the automated checks that run on each change.",
  "ToggleSlash: rollouts that raise the share of users in automatic steps, and user accounts and roles so a team stops sharing one admin token.",
  "FlakeSlash: one check on each pull request that links to its dashboard and never blocks.",
];

const CLOSE = [
  "Bring the idea. Agents ship it, and the calls that matter stay yours.",
  "Your saved basket started as a sentence in a chat. Your next idea starts the same way.",
  "Meet the products",
];

/** The markup of the first `<li>` carrying `attribute`. */
function item(page: string, attribute: string): string {
  const match = page.match(new RegExp(`<li[^>]*${attribute}[\\s\\S]*?</li>`));
  if (!match) throw new Error(`No list item with ${attribute}`);
  return match[0];
}

/** The markup of the `<ul>` carrying `data-list="name"`. */
function list(page: string, name: string): string {
  const match = page.match(new RegExp(`<ul[^>]*data-list="${name}"[\\s\\S]*?</ul>`));
  if (!match) throw new Error(`No list ${name}`);
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
      HERO,
      ...FILMSTRIP,
      "Meet the team",
      ...ROLES.flatMap(([, name, , line]) => [name, line]),
      ...CONTROL,
      ...STAGES,
      ...STATUS,
      ...CLOSE,
    ];
    let from = 0;
    for (const line of lines) {
      const at = body.indexOf(line, from);
      expect(at, line).toBeGreaterThan(-1);
      from = at + 1;
    }
  });

  test("each role card carries its image in dist/ and non-empty alt text", () => {
    for (const [id, name, image, line] of ROLES) {
      const markup = item(page, `data-role="${id}"`);
      expect(markup, id).toContain(`src="${image}"`);
      const alt = markup.match(/alt="([^"]+)"/)?.[1] ?? "";
      expect(alt.length, `${id} alt`).toBeGreaterThan(10);
      expect(existsSync(resolve(DIST, image.slice(1))), image).toBe(true);
      const text = words(`<body>${markup}`);
      for (const field of [name, line]) expect(text, `${id}: ${field}`).toContain(field);
    }
  });

  test("each stage links its product names to their pages", () => {
    const items = list(page, "stages").split("</li>");
    for (const [bold, hrefs] of STAGE_LINKS) {
      const markup = items.find((li) => li.includes(`>${bold}</strong>`)) ?? "";
      const links = [...markup.matchAll(/<a[^>]*href="([^"]*)"/g)].map((m) => m[1]);
      expect(links, bold).toEqual(hrefs);
    }
  });

  test("the close leads on to the products", () => {
    expect(page).toMatch(/<a[^>]*href="\/#tools"[^>]*>[\s\S]*?Meet the products/);
  });

  test("keeps developer jargon, long dashes, and banned names off /how-it-works", () => {
    expect(page).not.toMatch(LONG_DASHES);
    expect(page).not.toMatch(/tesla|whatsapp/i);
    expect(body).not.toMatch(/\b(worktree|git|spinoff|className|origin\/main|cargo|polling|repositories|self-hosted)\b/i);
  });
});
