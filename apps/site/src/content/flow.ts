/**
 * One feature's trip from ticket to cleanup, and where each tool would plug in. Plain data. What each tool
 * does at a stop is a Claim citing its facts (facts.test.ts).
 */
import type { Claim } from "#/content/facts";
import type { Product } from "#/content/products";
import type { StageId } from "#/content/stages";
import { psAsset } from "#/pixelslash/paths";

/**
 * What the reader sees back from a tool at this stop. `real` was captured by running the tool for this
 * page, `quoted` is printed in the tool's own docs, `idea` is imagined and no tool prints it.
 */
export type Output = {
  kind: "real" | "quoted" | "idea";
  title: string;
  lines?: readonly string[];
  image?: { src: string; width: number; height: number; alt: string };
};

type Fit = {
  tool: Product["name"];
  /** The stage of the tool this fit is for, from the shared `STAGES` table. */
  stage: StageId;
  text: Claim;
  output?: Output;
};

type FlowStep = {
  id: string;
  label: string;
  title: string;
  story: string;
  fits: readonly Fit[];
};

const CHECKOUT = "run from a checkout on a test project";

export const FLOW: readonly FlowStep[] = [
  {
    id: "brief",
    label: "Brief",
    title: "A ticket arrives",
    story:
      "The ticket asks for a new checkout, shipped behind a flag so it can reach production switched off.",
    fits: [
      {
        tool: "ToggleSlash",
        stage: "alpha",
        text: {
          text: "The flag starts off everywhere, and the audit trail begins before any code exists.",
          facts: ["toggleslash/cli", "toggleslash/audit-trail"],
        },
        output: {
          kind: "real",
          title: CHECKOUT,
          lines: [
            "$ toggleslash flags create new-checkout --project shop",
            "created flag new-checkout in shop",
            "$ toggleslash flags list --project shop",
            "KEY           NAME          VARIATIONS    TAGS  STATE   LAST EVALUATED",
            "new-checkout  new-checkout  [true,false]  -     active  -",
          ],
        },
      },
    ],
  },
  {
    id: "build",
    label: "Build",
    title: "Development starts",
    story:
      "The developer builds the page and checks it against the design, flag on and then off.",
    fits: [
      {
        tool: "ToggleSlash",
        stage: "alpha",
        text: {
          text: "The app reads the flag with the TypeScript SDK.",
          facts: ["toggleslash/typescript-server-sdk"],
        },
        output: {
          kind: "real",
          title: "a small script reading the flag through the SDK, flag off",
          lines: [
            "ready: true",
            "variation: false",
            'detail: {"value":false,"variationIndex":1,"reason":{"kind":"OFF"}}',
          ],
        },
      },
      {
        tool: "PixelSlash",
        stage: "alpha",
        text: {
          text: "Comparing Main and Branch shows a change elsewhere on the page before others see it.",
          facts: ["pixelslash/compare-two-urls"],
        },
        output: {
          kind: "real",
          title: "a toy checkout page, flag off against flag on; path shortened",
          lines: [
            "$ npx @slashsuite/pixelslash --live http://localhost:4111 --local http://localhost:4112 --out out",
            "pixelslash: 52368 changed pixels",
            "report: file:///.../out/report.html",
            "timing: 1 shot, capture 0.6s, diff 0.1s, total 0.7s",
          ],
        },
      },
      {
        tool: "TaskSlash",
        stage: "alpha",
        text: {
          text: "The developer's builds and tests queue with everything else on the machine and start only when they fit, so a test that times out does so because of the code.",
          facts: ["taskslash/run-command", "taskslash/admission-by-capacity"],
        },
      },
    ],
  },
  {
    id: "pr",
    label: "Pull request",
    title: "The pull request opens",
    story:
      "The diff shows the line that checks the flag, but not how the page looks or how the run will be configured.",
    fits: [
      {
        tool: "PixelSlash",
        stage: "alpha",
        text: {
          text: "With a review server you run and a GitHub App, a pull request check stays pending until a person accepts or rejects the change. The build waits only if CI waits for that verdict.",
          facts: ["pixelslash/upload-to-review-app", "pixelslash/github-status-and-comment", "pixelslash/block-ci-on-review", "pixelslash/self-host-docker"],
        },
        output: {
          kind: "quoted",
          title: "the review server guide, trimmed; exit code 5 means still waiting",
          lines: [
            "$ npx pixelslash upload snapshots/branch --branch my-change --base main --wait --timeout 20s",
            "changes: 12 waiting · 0 accepted · 0 rejected",
            "still waiting after 20s",
          ],
        },
      },
    ],
  },
  {
    id: "ci",
    label: "CI",
    title: "CI runs",
    story:
      "When a run fails, nothing in the diff shows whether the code or the configuration is to blame.",
    fits: [
      {
        tool: "PixelSlash",
        stage: "alpha",
        text: {
          text: "A comparison alone exits 0 however many pixels changed, so the guide adds a script to fail the job.",
          facts: ["pixelslash/exit-codes"],
        },
        output: {
          kind: "quoted",
          title: "the GitHub Actions guide, from its tested failing run",
          lines: [
            "visual gate: differences found, read the report",
            "pixelslash: 1 changed, 0 unchanged, 0 new, 0 removed",
            "changed:",
            "  index (chromium 1280x720)",
            "##[error]Process completed with exit code 1.",
          ],
        },
      },
      {
        tool: "BundleSlash",
        stage: "planned",
        text: { text: "It would report how much the flagged code added to the bundle.", planned: "BundleSlash" },
      },
    ],
  },
  {
    id: "review",
    label: "Review",
    title: "A reviewer reads it",
    story: "Working from the diff alone, the reviewer approves code they have not seen run.",
    fits: [
      {
        tool: "PixelSlash",
        stage: "alpha",
        text: {
          text: "The report shows Main, Branch and the Diff side by side. The review server lets a reviewer accept the change or reject it.",
          facts: ["pixelslash/compare-two-pngs", "pixelslash/upload-to-review-app", "pixelslash/review-app-keyboard"],
        },
        output: {
          kind: "quoted",
          title: "the review app's compare view of one change",
          image: {
            src: psAsset("/report.png"),
            width: 2560,
            height: 1600,
            alt: "PixelSlash's review app comparing one change: a card on Main and on Branch side by side, the changed area outlined in red and a yellow bar on Branch",
          },
        },
      },
    ],
  },
  {
    id: "release",
    label: "Release",
    title: "The flag goes on",
    story: "The code ships with the flag off, and someone switches it on later.",
    fits: [
      {
        tool: "ToggleSlash",
        stage: "alpha",
        text: {
          text: "The flag can be switched from the dashboard or the command line. Each change enters the audit trail, and daily counts show how often each variation is served, never who received it.",
          facts: ["toggleslash/dashboard", "toggleslash/cli", "toggleslash/audit-trail", "toggleslash/usage-counts"],
        },
        output: {
          kind: "real",
          title: CHECKOUT,
          lines: [
            "$ toggleslash flags on new-checkout --project shop --env production",
            "flag new-checkout is on in production (version 2)",
            "(the same script again, now flag on)",
            "ready: true",
            "variation: true",
            'detail: {"value":true,"variationIndex":0,"reason":{"kind":"FALLTHROUGH"}}',
          ],
        },
      },
    ],
  },
  {
    id: "cleanup",
    label: "Cleanup",
    title: "Weeks later",
    story: "The flag is on for everyone and still in the code, and nobody owns removing it.",
    fits: [
      {
        tool: "ToggleSlash",
        stage: "alpha",
        text: {
          text: "A person can use the audit trail and counts to decide whether to remove the flag. The tool does not recommend removal.",
          facts: ["toggleslash/audit-trail", "toggleslash/usage-counts", "toggleslash/flag-lifecycle"],
        },
        output: {
          kind: "real",
          title: "a test project minutes old, so both variations show; columns and rows trimmed to fit",
          lines: [
            "$ toggleslash flags history new-checkout --project shop",
            "2026-11-05T14:40:10Z  toggled  flag_config new-checkout/production",
            "2026-11-05T14:39:55Z  created  flag new-checkout",
            "(the usage counts behind the dashboard, trimmed)",
            '"variations":[{"variationIndex":0,"count":2},{"variationIndex":1,"count":2}]',
          ],
        },
      },
    ],
  },
];
