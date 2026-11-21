/**
 * The /toggleslash page, as plain data so a test can check it. Written by hand from toggleslash 335fcf3:
 * README.md, docs/quickstart.md, docs/self-hosting.md and the CLI commands in packages/cli/src/commands
 * for what works today. A change in that repo changes this file by hand, except the Planned list, which is
 * read from ToggleSlash's FACTS.md at the commit facts.sha.json pins. Every product claim here cites those facts.
 *
 * Commands stay free of `&` and quotes. The one placeholder, `<your key>`, stands where a reader puts
 * their own key; a test decodes the page's `&lt;` and `&gt;` before it looks for a command. Prose says "admin key": the variable that holds it appears only as code.
 */

import { type Claim, FACTS } from "#/content/facts";
import { TOGGLESLASH_REPO_URL } from "#/content/site";

const DOCS = `${TOGGLESLASH_REPO_URL}/blob/main/docs`;

export const TOGGLESLASH_TITLE: Claim = {
  text: "ToggleSlash: feature flags you self-host, with one spec across languages.",
  facts: ["toggleslash/what-it-is", "toggleslash/evaluation-spec"],
};

export const TOGGLESLASH_INTRO: { title: string; lead: Claim } = {
  title: "ToggleSlash",
  lead: {
    text: "ToggleSlash is a self-hosted feature flag service. You run one C# server on SQLite, evaluate flags in process with no network call per check, and change targeting live from the CLI or web dashboard. Every npm package is at 0.2.0 under @slashsuite/*, and there is no public hosted service.",
    facts: [
      "toggleslash/what-it-is",
      "toggleslash/server",
      "toggleslash/typescript-server-sdk",
      "toggleslash/cli",
      "toggleslash/dashboard",
      "toggleslash/cli-npm",
      "toggleslash/typescript-packages-npm",
      "toggleslash/dashboard-cloudflare-workers",
    ],
  },
};

/** The page's description in search results and link previews. */
export const TOGGLESLASH_DESCRIPTION: Claim = {
  text: "ToggleSlash is a self-hosted feature flag service: a C# server on SQLite, CLI and TypeScript SDKs on npm, five more server SDKs, a dashboard and a full audit trail.",
  facts: [
    "toggleslash/what-it-is",
    "toggleslash/server",
    "toggleslash/cli-npm",
    "toggleslash/typescript-packages-npm",
    "toggleslash/other-server-sdks",
    "toggleslash/dashboard",
    "toggleslash/audit-trail",
  ],
};

export type Feature = {
  title: string;
  /** The command, flag or path that does it, as the repository writes it. Shown on the page and checked by a test. */
  command: string;
  text: Claim;
};

/** What works today, grounded in toggleslash/FACTS.md. */
export const WORKS_TODAY: readonly Feature[] = [
  {
    title: "One C# server on SQLite",
    command: "dotnet run --project apps/server/ToggleSlash.Server",
    text: {
      text: "An ASP.NET Core (.NET 10) server keeps projects, environments, flags and segments in one SQLite file, migrates its schema on startup, describes its API in OpenAPI, and enforces rate limits and security headers.",
      facts: ["toggleslash/server", "toggleslash/server-from-source", "toggleslash/openapi-document", "toggleslash/rate-limits"],
    },
  },
  {
    title: "Flags, targeting and multi-context rules",
    command: "toggleslash flags show|create|on|off|archive|delete",
    text: {
      text: "Flags serve boolean or arbitrary JSON variations per environment. Target individual keys, rules on context attributes (string, number, semver, date, regex), multi-context subjects (such as user and organisation), reusable segments, prerequisite flags and percentage rollouts. Version checks prevent stale overwrites.",
      facts: [
        "toggleslash/flag-variations",
        "toggleslash/targeting",
        "toggleslash/targeting-operators",
        "toggleslash/multi-context",
        "toggleslash/targeting-concurrency",
        "toggleslash/archive-and-delete",
      ],
    },
  },
  {
    title: "One evaluation spec, six server SDK languages",
    command: "@slashsuite/toggleslash-sdk",
    text: {
      text: "Evaluation is written once in `docs/evaluation.md` with shared test vectors in `fixtures/evaluation/`. The TypeScript server SDK (0.2.0 on npm) syncs rulesets over a live stream with polling fallback and evaluates in process with zero network call per check. Python, Go, Java, C# and Ruby server SDKs pass the same conformance tests from a repo checkout.",
      facts: [
        "toggleslash/evaluation-spec",
        "toggleslash/typescript-server-sdk",
        "toggleslash/typescript-packages-npm",
        "toggleslash/live-updates",
        "toggleslash/other-server-sdks",
        "toggleslash/server-sdks-from-checkout",
      ],
    },
  },
  {
    title: "Browser SDK, secure mode and tracing",
    command: "@slashsuite/toggleslash-sdk-browser",
    text: {
      text: "The browser SDK (0.2.0 on npm) caches server-evaluated flags for one context and updates on change. Browser keys see only flags marked visible, and secure mode requires contexts signed by your own server. `@slashsuite/toggleslash-sdk-otel` adds every evaluation and ruleset hash to active OpenTelemetry spans.",
      facts: [
        "toggleslash/browser-sdk",
        "toggleslash/typescript-packages-npm",
        "toggleslash/client-visibility",
        "toggleslash/secure-mode",
        "toggleslash/opentelemetry-tracing",
      ],
    },
  },
  {
    title: "CLI and scoped tokens",
    command: "@slashsuite/toggleslash",
    text: {
      text: "Install the CLI from npm (requires Bun 1.4+) to manage projects, environments, flags, targeting, segments, SDK keys (stored hashed, shown once) and expiring project-scoped API tokens so the admin key stays out of CI.",
      facts: ["toggleslash/cli", "toggleslash/cli-npm", "toggleslash/sdk-keys", "toggleslash/scoped-tokens"],
    },
  },
  {
    title: "Audit trail and privacy-safe usage counts",
    command: "toggleslash flags history",
    text: {
      text: "Every admin API write enters the audit trail with credential, before and after. Daily usage counts record how often each variation was served and never store a user's key or context. Each flag tracks lifecycle state (new, active, inactive, archived) and tags.",
      facts: ["toggleslash/audit-trail", "toggleslash/usage-counts", "toggleslash/flag-lifecycle", "toggleslash/flag-tags"],
    },
  },
  {
    title: "Diagnose any evaluation, now or in the past",
    command: "toggleslash diagnose",
    text: {
      text: "Explains why a flag answered as it did for a context without counting usage. Pass `--etag` to ask under an earlier ruleset hash, `rulesets show` to inspect past rulesets, and `runtime` to inspect what the server serves now.",
      facts: ["toggleslash/diagnose", "toggleslash/ruleset-lookup", "toggleslash/cli"],
    },
  },
  {
    title: "Web dashboard",
    command: "apps/web",
    text: {
      text: "Runs over the same admin API with single-operator password sign-in: list, search, create, toggle and archive flags, edit targeting, inspect flag history and usage, and manage environments, SDK keys, segments, ruleset hashes and the audit trail.",
      facts: ["toggleslash/dashboard", "toggleslash/dashboard-sign-in"],
    },
  },
  {
    title: "Self-hosting as a container",
    command: "docker compose up -d --build --wait",
    text: {
      text: "Build one Docker container from the repository (SQLite in a volume, port 8080 on loopback behind your TLS proxy), or run ToggleSlash alongside PixelSlash in the combined `ghcr.io/slashsuite/slashslash` image.",
      facts: ["toggleslash/server-container"],
      repo: ["self-host/README.md"],
    },
  },
];

export type TryStep = { lead: string; commands: readonly string[] };

/** How to try it today: one-command local stack, or npm packages. */
export const TRY_IT: { lead: Claim; steps: readonly TryStep[] } = {
  lead: {
    text: "You need Bun 1.4+ and the .NET 10 SDK (or Docker for the server). Fastest way: one command starts the server, seeded flags, dashboard and an example shop checkout on loopback:",
    facts: ["toggleslash/server-from-source", "toggleslash/server-container", "toggleslash/local-stack", "toggleslash/example-app"],
  },
  steps: [
    {
      lead: "Clone and start the full local stack (server, seeded flags, dashboard and example shop):",
      commands: [`git clone ${TOGGLESLASH_REPO_URL}`, "cd toggleslash", "bun install", "bun run stack"],
    },
    {
      lead: "Or install the CLI and TypeScript SDK from npm (0.2.0):",
      commands: ["bun add @slashsuite/toggleslash-sdk", "bunx @slashsuite/toggleslash --help"],
    },
  ],
};

/**
 * Planned: the facts file's own Planned list, read from it.
 */
export const PLANNED: readonly Claim[] = [...FACTS.toggleslash.planned].map(([id, text]) => ({
  text: `${text.charAt(0).toUpperCase()}${text.slice(1)}`,
  facts: [`toggleslash/${id}`],
}));

export const LINKS: readonly { label: string; href: string }[] = [
  { label: "Repository on GitHub", href: TOGGLESLASH_REPO_URL },
  { label: "Quickstart", href: `${DOCS}/quickstart.md` },
  { label: "Self-hosting", href: `${DOCS}/self-hosting.md` },
  { label: "Feature parity", href: `${DOCS}/feature-parity.md` },
];
