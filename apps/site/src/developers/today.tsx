import { CodeBlock, Cluster, Step, Steps, SubsectionHeading, Text, TextLink } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import type { Claim } from "#/content/facts";
import {
  FLAKESLASH_DASHBOARD_URL,
  FLAKESLASH_REPO_URL,
  OMNISLASH_REPO_URL,
  PIXELSLASH_COMMAND,
  PIXELSLASH_SITE_URL,
  TASKSLASH_REPO_URL,
  TOGGLESLASH_REPO_URL,
} from "#/content/site";
import { DevSection } from "#/developers/section";

type TodayEntry = {
  id: string;
  title: string;
  commands: readonly string[];
  note: Claim;
  links: readonly { label: string; href: string; external?: boolean }[];
};

/** Product claims for the /developers try-today quick-start steps, held to each product's FACTS.md. */
export const TODAY: {
  title: string;
  lead: string;
  entries: readonly TodayEntry[];
} = {
  title: "Try any product today",
  lead: "No account or credit card required to run the command-line tools locally.",
  entries: [
    {
      id: "pixelslash",
      title: "PixelSlash (npm, requires Bun)",
      commands: [PIXELSLASH_COMMAND],
      note: {
        text: "Writes a standalone out/report.html with no browser. For live URLs, run npx @slashsuite/pixelslash install-browser once first.",
        facts: ["pixelslash/compare-two-pngs", "pixelslash/compare-two-urls", "pixelslash/npm-cli"],
      },
      links: [
        { label: "PixelSlash overview", href: "/pixelslash" },
        { label: "Docs", href: "/pixelslash/docs" },
        { label: "Hosted review app", href: PIXELSLASH_SITE_URL, external: true },
      ],
    },
    {
      id: "uislash",
      title: "UISlash (npm, React 19 and Tailwind v4)",
      commands: ["bun add @slashsuite/ui-react @slashsuite/themes"],
      note: {
        text: "Import one theme CSS file and set its scope class on html. No component accepts className or style.",
        facts: ["uislash/npm-install", "uislash/themes-package", "uislash/theme-reskins-all", "uislash/no-styling-escape"],
      },
      links: [
        { label: "Component docs", href: "/uislash" },
        { label: "llms.txt", href: "/uislash/llms.txt" },
      ],
    },
    {
      id: "toggleslash",
      title: "ToggleSlash (npm or one-command local stack)",
      commands: [`git clone ${TOGGLESLASH_REPO_URL}`, "cd toggleslash && bun install && bun run stack"],
      note: {
        text: "Starts the C# server, seeded flags, dashboard and example shop on loopback. CLI and TypeScript SDKs are on npm under @slashsuite/* (0.2.0).",
        facts: ["toggleslash/local-stack", "toggleslash/example-app", "toggleslash/cli-npm", "toggleslash/typescript-packages-npm"],
      },
      links: [{ label: "ToggleSlash overview", href: "/toggleslash" }],
    },
    {
      id: "taskslash",
      title: "TaskSlash (Linux, build from source with cargo and Bun)",
      commands: [
        `git clone ${TASKSLASH_REPO_URL}`,
        "cd taskslash && rustup toolchain install && bun install",
        "bun scripts/install-service.ts",
        "taskslash run -- bun run test",
      ],
      note: {
        text: "Installs the systemd user daemon, measures each job in its own scope, and queues runs against free CPU, memory and disk writes.",
        facts: ["taskslash/linux-systemd", "taskslash/measured-runs", "taskslash/admission-by-capacity"],
      },
      links: [{ label: "TaskSlash overview", href: "/taskslash" }],
    },
    {
      id: "flakeslash",
      title: "FlakeSlash (local CLI from checkout, or hosted dashboard)",
      commands: [
        `git clone ${FLAKESLASH_REPO_URL}`,
        "cd flakeslash && bun install",
        "export GITHUB_TOKEN=<your key>",
        "bun run flakeslash scan owner/repo",
      ],
      note: {
        text: "Reads GitHub Actions history into SQLite and writes report.html. Or sign in with GitHub at flakeslash.slashslash.build.",
        facts: ["flakeslash/cli-from-checkout", "flakeslash/local-store", "flakeslash/report-html", "flakeslash/hosted-dashboard"],
      },
      links: [
        { label: "FlakeSlash overview", href: "/flakeslash" },
        { label: "Hosted dashboard", href: FLAKESLASH_DASHBOARD_URL, external: true },
      ],
    },
    {
      id: "omnislash",
      title: "OmniSlash (Linux, from checkout with Bun 1.4.2)",
      commands: [
        `git clone ${OMNISLASH_REPO_URL}`,
        "cd omnislash && bun install",
        "bun apps/cli/src/index.ts --help",
      ],
      note: {
        text: "Tracks tickets, leases and agent dispatches. Uses Postgres by default, or SQLite with OMNISLASH_STORE=sqlite. Builder dispatch requires T3 Code.",
        facts: ["omnislash/checkout-linux", "omnislash/help-command", "omnislash/item-tracking", "omnislash/agent-build-worktree"],
      },
      links: [{ label: "OmniSlash overview", href: "/omnislash" }],
    },
  ],
};

/** Hands-on quick-start commands for every alpha product. Hydrates on scroll for CodeBlock copy buttons. */
export function Today(): ReactNode {
  return (
    <DevSection id="try-today" title={TODAY.title} lead={TODAY.lead}>
      <Steps>
        {TODAY.entries.map((entry) => (
          <Step key={entry.id} title={<SubsectionHeading>{entry.title}</SubsectionHeading>}>
            <div className="space-y-3">
              <CodeBlock label="bash" language="bash" lines={[...entry.commands]} copy />
              <Text>{entry.note.text}</Text>
              <Cluster gap="md">
                {entry.links.map((link) => (
                  <TextLink key={link.href} href={link.href} external={link.external}>
                    {link.label}
                  </TextLink>
                ))}
              </Cluster>
            </div>
          </Step>
        ))}
      </Steps>
    </DevSection>
  );
}
