import { describe, expect, test } from "vitest";
import { CLI_SPLIT } from "#/pixelslash/doc/cli";
import { COMMAND_SUMMARY, buildCommandIndex, commandIndexMarkdown, flagsOf } from "#/pixelslash/doc/cli-index";
import { findPage } from "#/pixelslash/doc/docs-map";

/*
 * Ported from PixelSlash's site. There the index is also checked against the CLI's own command table
 * (packages/cli/src/run.ts); this site fetches only the docs, so the index is checked against the
 * synopsis blocks of the fetched docs/cli.md it is built from.
 */

const INDEX = buildCommandIndex(CLI_SPLIT.pages);
const COMMANDS = INDEX.map((entry) => entry.command);
type Entry = (typeof INDEX)[number];
type Flag = Entry["flags"][number];

/** Whether an entry's owner is a real page that shows its synopsis. `compare` is the bare `pixelslash --live …` form: it has no word after `pixelslash`. */
function ownerShowsSynopsis(entry: Entry): boolean {
  const shown = entry.command === "compare" ? "pixelslash" : `pixelslash ${entry.command}`;
  const tokens = JSON.stringify(CLI_SPLIT.pages.get(entry.page));
  return findPage(entry.page) !== undefined && tokens.includes(shown);
}

/** Whether a flag starts with -- and says what it does. */
const flagIsSound = ({ flag, what }: Flag): boolean => /^--[a-z]/.test(flag) && what !== "";

describe("the command index", () => {
  test("finds the commands in cli.md, each once", () => {
    expect(COMMANDS.length).toBeGreaterThan(15);
    expect(new Set(COMMANDS).size).toBe(COMMANDS.length);
  });

  test("every command has a one-line summary, and none is for a command cli.md lacks", () => {
    expect(Object.keys(COMMAND_SUMMARY).toSorted()).toEqual(COMMANDS.toSorted());
    for (const summary of Object.values(COMMAND_SUMMARY)) expect(summary).toMatch(/\.$/);
  });

  test("each command's owner is a real page that shows its synopsis", () => {
    const wrong = INDEX.filter((entry) => !ownerShowsSynopsis(entry)).map((entry) => `${entry.command} on ${entry.page}`);
    expect(wrong).toEqual([]);
  });

  test("every flag starts with -- and says what it does", () => {
    const flags = INDEX.flatMap((entry) =>
      entry.flags.map((flag) => ({ ...flag, command: entry.command })),
    );
    expect(flags.length).toBeGreaterThan(40);
    const bad = flags
      .filter((flag) => !flagIsSound(flag))
      .map(({ command, flag }) => `pixelslash ${command} ${flag}`);
    expect(bad).toEqual([]);
  });

  test("the markdown has the table, a section per command and a flag table", () => {
    const markdown = commandIndexMarkdown(INDEX);
    for (const entry of INDEX) {
      expect(markdown).toContain(`| \`pixelslash ${entry.command}\` |`);
      expect(markdown).toContain(`### pixelslash ${entry.command}`);
    }
    expect(markdown).toContain("| Flag | Takes | What it does |");
  });
});

const MARKDOWN = commandIndexMarkdown(INDEX);
const flagOf = (command: string, flag: string): string =>
  INDEX.find((entry) => entry.command === command)?.flags.find((f) => f.flag === flag)?.what ?? "";
/** One command's section of the markdown, from its heading to the next. */
const sectionOf = (command: string): string =>
  MARKDOWN.split("\n### ").find((part) => part.startsWith(`pixelslash ${command}\n`)) ?? "";

describe("the reference text", () => {
  test("compare says the subcommand can be left out for a pair, and shows that form", () => {
    const compare = sectionOf("compare");
    expect(compare).toContain("`pixelslash --live URL --local URL`");
    expect(compare).toContain("leave the subcommand out");
    expect(compare).not.toMatch(/^pixelslash compare \(/m);
    expect(compare).toMatch(/^pixelslash \(--live URL/m);
  });

  test("init --routes is a comma list and compare --routes is a file", () => {
    expect(flagOf("init", "--routes")).toBe("The paths to shoot, separated by commas.");
    expect(flagOf("compare", "--routes")).toMatch(/file of paths/i);
  });

  test("install-browser is under Install, not under signing in", () => {
    expect(INDEX.find((entry) => entry.command === "install-browser")?.page).toBe("install");
    const signingIn = JSON.stringify(CLI_SPLIT.pages.get("signing-in"));
    expect(signingIn).not.toContain("install-browser [");
  });

  test("--wait names what it waits for and the exit codes it maps to", () => {
    const wait = flagOf("status", "--wait");
    expect(wait).toMatch(/waits? until the server decides the build/i);
    for (const code of ["0", "3", "4", "5"]) expect(wait).toMatch(new RegExp(`\\b${code}\\b`));
  });

  test("--threshold and --flake-retries name their defaults", () => {
    expect(flagOf("compare", "--threshold")).toContain("0.01");
    expect(flagOf("upload", "--flake-retries")).toContain("default 2");
  });

  test("the reference links the exit codes page", () => {
    expect(MARKDOWN).toContain("](/docs/exit-codes)");
  });
});

describe("flagsOf", () => {
  test("takes the placeholder after a flag and none for a switch", () => {
    expect(flagsOf("pixelslash upload [--dir DIR] [--wait] [--timeout SECONDS]")).toEqual([
      { flag: "--dir", takes: "DIR" },
      { flag: "--wait", takes: "" },
      { flag: "--timeout", takes: "SECONDS" },
    ]);
  });
});

const takesOfRow = (command: string, flag: string): string | undefined =>
  INDEX.find((entry) => entry.command === command)?.flags.find((f) => f.flag === flag)?.takes;

describe("the Takes column", () => {
  const ATOM = String.raw`(?:[A-Z][A-Z0-9_]*|WxH|<[^<>\s"']+>)`;
  const OPTION = String.raw`(?:${ATOM}|[a-z][a-z-]*)`;
  const PLACEHOLDER = new RegExp(
    String.raw`^(?:${OPTION}(?:\|${OPTION})+|0\.\.1|x,y,w,h|${ATOM}(?:,${ATOM})*(?:,\.\.\.)?)$`,
  );
  /** A flag row's Takes cell: nothing, or a placeholder. */
  const takesPlaceholder = (takes: string): boolean => takes === "" || PLACEHOLDER.test(takes);

  test("every flag row takes nothing or a placeholder, never an example value", () => {
    const rows = INDEX.flatMap((entry) =>
      entry.flags.map((flag) => ({ command: entry.command, ...flag })),
    );
    const bad = rows
      .filter(({ takes }) => !takesPlaceholder(takes))
      .map(({ command, flag, takes }) => `pixelslash ${command} ${flag} shows ${takes}`);
    expect(bad).toEqual([]);
    for (const { takes } of rows) {
      expect(takes).not.toMatch(/["'`]/);
      expect(takes.replace("0..1", "")).not.toMatch(/\d/);
    }
  });

  test.each([
    ["import", "--device", "LABEL", '"Pixel'],
    ["import", "--platform", "web|android|ios", "android"],
    ["import", "--scale", "N", "3"],
    ["dev", "--against", "main|previous", "main"],
    ["init", "--routes", "PATH,...", "/,/about"],
    ["init", "--viewports", "WxH,...", "1280x720,375x812"],
    ["init", "--themes", "THEME,...", "light,dark"],
    ["upload", "--timeout", "DURATION", "30m"],
    ["status", "--timeout", "DURATION", "30m"],
    ["upload", "--interval", "DURATION", "15s"],
    ["status", "--interval", "DURATION", "15s"],
    ["compare", "--width", "PX", "1280"],
  ])("pixelslash %s %s takes %s, not %s", (command, flag, takes, was) => {
    expect(takesOfRow(command, flag)).toBe(takes);
    expect(takesOfRow(command, flag)).not.toBe(was);
  });
});

describe("flagsOf placeholders", () => {
  test("an example value gives an empty takes, a placeholder is kept", () => {
    expect(
      flagsOf("pixelslash x --a 3 --b 30m --c light,dark --d /x --e PATH,... --f main|previous"),
    ).toEqual([
      { flag: "--a", takes: "" },
      { flag: "--b", takes: "" },
      { flag: "--c", takes: "" },
      { flag: "--d", takes: "" },
      { flag: "--e", takes: "PATH,..." },
      { flag: "--f", takes: "main|previous" },
    ]);
  });
});
