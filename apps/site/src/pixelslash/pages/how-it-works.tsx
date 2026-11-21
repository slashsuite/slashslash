import {
  Text,
  CodeBlock,
  Image,
  ProseLayout,
  Section,
  Step,
  Steps,
  TextLink,
} from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import type { Claim } from "#/content/facts";
import { psAsset, psHref } from "#/pixelslash/paths";
import { Rich } from "#/shell/rich-text";

/** The page's product claims, each citing PixelSlash's facts; the components below render them. */
export const HOW_IT_WORKS: {
  description: Claim;
  whoFor: readonly Claim[];
  steps: readonly { title: string; body: Claim }[];
  exitCodes: Claim;
  upload: Claim;
} = {
  description: { text: "One run: two shots, a diff, a report.", facts: ["pixelslash/compare-two-urls"] },
  whoFor: [
    {
      text: "PixelSlash is for developers and teams who ship web pages and want to see what a change did to them before it merges, without writing stories or signing up for a service.",
      facts: ["pixelslash/what-it-is", "pixelslash/compare-two-urls"],
    },
    {
      text: `It replaces a hosted visual-review service such as Chromatic, Percy or Argos: the run above on your machine or CI runner, and the review on a server. [The comparison](${psHref("/compare")}) lists where it is still behind.`,
      facts: ["pixelslash/compare-two-urls", "pixelslash/upload-to-review-app", "pixelslash/hosted-review-app"],
    },
    {
      text: "It is free: source available under the Elastic License 2.0, with all of it in the repository and no paid plan to buy.",
      facts: ["pixelslash/licence"],
    },
    {
      text: "It differs in where the work happens: a local run needs no server, and its design-system judge runs on your machine, with a local vision model. Screenshots leave the machine only when you upload them, and then only to the server you name. On the held-out half of our own benchmark, measured 2026-10-20, it caught 42 of 45 real changes and wrongly flagged 11 of 36 noise pairs; Argos, on the same pairs, caught 37 and flagged 24.",
      facts: ["pixelslash/local-unless-upload", "pixelslash/design-system-judge", "pixelslash/perceptual-diff"],
    },
  ],
  steps: [
    {
      title: "Capture Main and Branch",
      body: {
        text: "Playwright opens both URLs, or you hand it two PNGs. Each capture waits for the page to settle (fonts, images, the network, two animation frames) and fails after a timeout rather than shooting early or hanging. The command does not start a dev server: both URLs must already be up.",
        facts: ["pixelslash/compare-two-urls", "pixelslash/compare-two-pngs", "pixelslash/waits-for-page-to-settle"],
      },
    },
    {
      title: "Diff the pixels, perceptually",
      body: {
        text: "A pixel counts as changed only when its colour moves by more than a small threshold and it is not an anti-aliased edge in either shot. If the two shots differ in size, only the overlapping rectangle is diffed and the report states both sizes.",
        facts: ["pixelslash/perceptual-diff", "pixelslash/size-change-overlap-only"],
      },
    },
    {
      title: "Group the change into regions",
      body: {
        text: "Changed pixels with up to 48 px clear between them are one region; a box under 4 px is a speck and is dropped. A faint, uneven region is labelled noise and a sub-pixel move is labelled shift: both stay in the report, and neither makes the run count as changed.",
        facts: ["pixelslash/perceptual-diff"],
      },
    },
    {
      title: "Write the report",
      body: {
        text: "report.html shows Main, Branch and the Diff, cropped to the changed region, with the counts and both sizes. It opens from disk: nothing is uploaded.",
        facts: ["pixelslash/compare-two-pngs", "pixelslash/local-unless-upload"],
      },
    },
  ],
  exitCodes: {
    text: `0 means the run finished, whatever it found in pixels. 1 means a design-system judge found new violations on Branch. 2 is a usage error. A crash never exits 1, so CI can read the code. [The full list](${psHref("/docs/signing-in#exit-codes-and-the-failed-line")}) is in the docs.`,
    facts: ["pixelslash/exit-codes"],
  },
  upload: {
    text: "pixelslash upload sends the shots to a PixelSlash review server. It diffs them against the default branch, holds the build for review and reports a GitHub check, and pixelslash status --wait blocks CI until someone accepts or rejects it.",
    facts: [
      "pixelslash/upload-to-review-app",
      "pixelslash/github-status-and-comment",
      "pixelslash/block-ci-on-review",
    ],
  },
};

/** The four questions a visitor comes with; the figures are bench/results/2026-10-20.md. */
function WhoFor(): ReactNode {
  return (
    <Section title="Who it is for, and what it costs">
      {HOW_IT_WORKS.whoFor.map((claim) => (
        <Text key={claim.text}>
          <Rich text={claim.text} />
        </Text>
      ))}
    </Section>
  );
}

/** Each step is what docs/cli.md says the run does, in its order; the numbers are the engine's defaults. */
export function HowItWorksPage(): ReactNode {
  return (
    <ProseLayout title="How it works" description={HOW_IT_WORKS.description.text} gap="lg">
      <Steps>
        {HOW_IT_WORKS.steps.map((step) => (
          <Step key={step.title} title={step.title}>
            {step.body.text}
          </Step>
        ))}
      </Steps>
      <Section title="A real report">
        <Image
          src={psAsset("/report.png")}
          alt="PixelSlash's review app for one change: a card on Main and on Branch side by side, the changed area outlined in red and a yellow bar on Branch"
          aspect="natural"
          width="full"
        />
        {/* The numbers below come from apps/site/src/content/report.json in PixelSlash at the pinned commit (not fetched here); re-read them when the pin moves. */}
        <Text>
          A real run, not a mock-up: the repository's own fixtures/pages/live.html against
          local.html, shot in Chromium at 1280×720. It printed 19033 changed pixels and one changed
          region.
        </Text>
        <CodeBlock language="bash" label="bash" copy>
          {[
            "bun run pixelslash -- --live http://localhost:4391/live.html \\",
            "  --local http://localhost:4391/local.html --out out",
            "pixelslash: 19033 changed pixels",
          ].join("\n")}
        </CodeBlock>
      </Section>
      <Section title="Exit codes">
        <Text>
          <Rich text={HOW_IT_WORKS.exitCodes.text} />
        </Text>
      </Section>
      <Section title="Then, if you want a person to decide">
        <Text>
          {HOW_IT_WORKS.upload.text}{" "}
          <TextLink href={psHref("/self-host")}>Self-host the server</TextLink> or{" "}
          <TextLink href={psHref("/docs/upload#uploading-to-a-server")}>read how uploads work</TextLink>.
        </Text>
      </Section>
      <WhoFor />
    </ProseLayout>
  );
}
