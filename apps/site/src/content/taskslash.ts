/**
 * The /taskslash page, as plain data so a test can check it. Written by hand from taskslash a59d7fa:
 * README.md, kept beside this file as taskslash-readme.md so a test can check every command against it, and
 * scripts/install-service.ts for what the install step does (it cargo installs the binary into ~/.cargo/bin).
 * Nothing is fetched at build time, so a change in that repo changes this file, and that copy, by hand.
 * Every product claim here cites TaskSlash's FACTS.md (facts.test.ts).
 *
 * Commands stay free of `&` and quotes, and each is written exactly as the README writes it.
 */

import type { Claim } from "#/content/facts";
import { TASKSLASH_REPO_URL } from "#/content/site";

export const TASKSLASH_TITLE: Claim = {
  text: "TaskSlash: admission control for builds and tests on one machine.",
  facts: ["taskslash/what-it-is", "taskslash/admission-by-capacity"],
};

export const TASKSLASH_INTRO: { title: string; lead: Claim } = {
  title: "TaskSlash",
  lead: {
    text: "Running several coding agents in parallel means builds, typechecks and browser runs hit the same machine at once until tests time out for reasons that have nothing to do with the code. TaskSlash puts a small daemon in front of them, measures what each job costs in its own systemd scope, and starts each job only when the machine has room.",
    facts: [
      "taskslash/what-it-is",
      "taskslash/daemon-queue",
      "taskslash/measured-runs",
      "taskslash/admission-by-capacity",
      "taskslash/linux-systemd",
    ],
  },
};

/** The page's description in search results and link previews. */
export const TASKSLASH_DESCRIPTION: Claim = {
  text: "TaskSlash queues builds, tests and browser runs on Linux, measures each job in its own systemd scope, and starts a job only when your machine has capacity.",
  facts: ["taskslash/what-it-is", "taskslash/measured-runs", "taskslash/admission-by-capacity", "taskslash/linux-systemd"],
};

export const TASKSLASH_PROOF: { title: string; text: Claim } = {
  title: "Proof on a real desktop",
  text: {
    text: "Measured on a real desktop (`docs/proof/phase-1.md`): three full gates and two browser runs started at the same time stayed below the machine's CPU, memory and I/O pressure lines through TaskSlash, and the whole batch finished sooner than running unconstrained (while each individual browser run took longer).",
    facts: ["taskslash/desktop-proof"],
  },
};

export type Feature = {
  title: string;
  /** The command, exactly as the README writes it. Shown on the page and checked by a test. */
  command: string;
  text: Claim;
};

/** What works today. Every command here is verbatim in taskslash-readme.md. */
export const WORKS_TODAY: readonly Feature[] = [
  {
    title: "A daemon that holds the queue",
    command: "taskslash daemon",
    text: {
      text: "Samples host CPU, memory, disk writes and kernel pressure once a second, manages the waiting queue, and stores every run in one SQLite file. Normally runs as a systemd user service.",
      facts: ["taskslash/daemon-queue", "taskslash/measured-runs", "taskslash/linux-systemd"],
    },
  },
  {
    title: "Any command, run as a job",
    command: "taskslash run -- bun run test",
    text: {
      text: "Runs your command in your directory with your environment and terminal (preserving colours, PTY resize and Ctrl-C signals) and exits with the command's own exit code. Refuses to run when no daemon is active.",
      facts: ["taskslash/run-command"],
    },
  },
  {
    title: "Measured in its own scope",
    command: "taskslash history gate",
    text: {
      text: "Under a systemd user session, every job runs in its own systemd scope while the daemon records wall time, CPU, peak memory, disk writes and exit code without capping it. `taskslash history` lists every recorded key; `taskslash history <name>` prints its estimate and last runs (including `project:task` inside moon workspaces). Without systemd, jobs run unmeasured with wall time and exit code.",
      facts: ["taskslash/measured-runs", "taskslash/history", "taskslash/linux-no-systemd"],
    },
  },
  {
    title: "Starts only when it fits",
    command: "taskslash why",
    text: {
      text: "CPU, memory and disk writes each have a budget. A job starts when its learned estimate fits in free headroom and host pressure stays below the pressure gate. Waiting jobs print their job number and the three biggest jobs holding them; `taskslash why` lists every waiting job and why.",
      facts: ["taskslash/admission-by-capacity", "taskslash/waiting-reason"],
    },
  },
  {
    title: "Cost classes and learned estimates",
    command: "taskslash run --kind browser --name visual -- bun run visual",
    text: {
      text: "`--kind` picks a default cost class (`test`, `typecheck`, `build`, `browser`, `command`) until a job's name has recorded history. After that, estimates come from its own past runs.",
      facts: ["taskslash/learned-estimates"],
    },
  },
  {
    title: "Priority classes and fair share",
    command: "taskslash run --class urgent -- bun run test",
    text: {
      text: "Five classes (`urgent`, `flake`, `interactive`, `normal`, `background`) order the queue; within a class, the worktree using the least of the machine goes first. A job waiting over 15 minutes promotes one class. Higher classes never kill or freeze running jobs.",
      facts: ["taskslash/priority-classes"],
    },
  },
  {
    title: "moon targets, one job each",
    command: "taskslash moon :typecheck :test",
    text: {
      text: "Replaces `moon run --concurrency N`, which cannot see other worktrees on the machine. Submits each target as its own job in dependency order, runs each target once across the workspace, and prints each failed target's log command.",
      facts: ["taskslash/moon-targets"],
    },
  },
  {
    title: "Live terminal view and cancellation",
    command: "taskslash top",
    text: {
      text: "`taskslash top` shows host pressure, running and waiting jobs, finished jobs, and the selected job's live output on one screen. `taskslash cancel <job>` stops a waiting or running job from any terminal (SIGTERM, then SIGKILL after a grace period).",
      facts: ["taskslash/top", "taskslash/cancel"],
    },
  },
  {
    title: "Every job's output is kept",
    command: "taskslash logs --failed",
    text: {
      text: "Streams output to your terminal unchanged and writes a per-job log kept for 7 days (under 1 GiB). `taskslash logs` reads any running or finished job by number, run id, key, or newest failure in your worktree (`--all` for the whole machine).",
      facts: ["taskslash/job-logs"],
    },
  },
  {
    title: "Status, JSON events and plugins",
    command: "taskslash status --json",
    text: {
      text: "`taskslash status` shows machine health, running jobs and worktrees (`--json` for scripts). `taskslash events` streams one JSON line per queued, started and finished job. Any `taskslash-<name>` executable on PATH runs as `taskslash <name>`.",
      facts: ["taskslash/status", "taskslash/events", "taskslash/command-plugins"],
    },
  },
];

export type TryStep = { lead: string; commands: readonly string[] };

/** How to try it today, from a clone: the README's Develop and install sections in short. */
export const TRY_IT: { lead: Claim; steps: readonly TryStep[] } = {
  lead: {
    text: "No prebuilt release yet. Build from source on Linux with Bun and rustup. Jobs are measured under a systemd user session; without one they still queue and run unmeasured.",
    facts: ["taskslash/no-release", "taskslash/linux-systemd", "taskslash/linux-no-systemd"],
  },
  steps: [
    {
      lead: "Clone it, install the Rust toolchain it pins, and install:",
      commands: [`git clone ${TASKSLASH_REPO_URL}`, "cd taskslash", "rustup toolchain install", "bun install"],
    },
    {
      lead: "Install the daemon as a systemd user unit. The script builds the taskslash command into ~/.cargo/bin first, and the same command upgrades it after you pull a new main.",
      commands: ["bun scripts/install-service.ts"],
    },
    {
      lead: "See what the machine is doing, watch jobs live, and run a command as a job:",
      commands: ["taskslash status", "taskslash top", "taskslash run -- bun run test"],
    },
  ],
};

/** Planned, all items from taskslash/FACTS.md. */
export const PLANNED: readonly Claim[] = [
  {
    text: "Filter plugins that rewrite a job's output on its way to the log and terminal, such as secret redaction.",
    facts: ["taskslash/filter-plugins"],
  },
  {
    text: "Scheduling across a pool of machines.",
    facts: ["taskslash/machine-pool"],
  },
  {
    text: "Scheduling for CI runners.",
    facts: ["taskslash/ci-runners"],
  },
];

export const LINKS: readonly { label: string; href: string }[] = [
  { label: "Repository on GitHub", href: TASKSLASH_REPO_URL },
  { label: "Every command", href: `${TASKSLASH_REPO_URL}#use` },
  { label: "When a job starts", href: `${TASKSLASH_REPO_URL}#admission` },
  { label: "Install as a systemd user unit", href: `${TASKSLASH_REPO_URL}#install-the-daemon-as-a-systemd-user-unit` },
];
