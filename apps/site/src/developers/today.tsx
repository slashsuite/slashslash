import { CodeBlock, Cluster, Step, Steps, SubsectionHeading, Text, TextLink } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { PIXELSLASH_COMMAND, PIXELSLASH_NPM_URL, PIXELSLASH_REPO_URL, PIXELSLASH_SITE_URL } from "#/content/site";
import type { Claim } from "#/content/facts";
import { DevSection } from "#/developers/section";
import { Rich } from "#/shell/rich-text";

/* How to run PixelSlash today, each command in a kit CodeBlock with a copy button. The page hydrates this when it scrolls into view. */

const DOCS = `${PIXELSLASH_REPO_URL}/blob/main/docs/ci`;

const GUIDES = [`${DOCS}/github-actions.md`, `${DOCS}/any-ci.md`];

/** The section's product claims, each citing PixelSlash's facts. Its licence line is read from the facts file. */
export const TODAY: { title: Claim; lead: Claim; pngs: Claim; urls: Claim; ci: Claim } = {
  title: {
    text: "PixelSlash can run on your machine today.",
    facts: ["pixelslash/compare-two-pngs", "pixelslash/compare-two-urls", "pixelslash/npm-cli"],
  },
  lead: { text: "It is published on npm at a 0.x version, and requires Bun.", facts: ["pixelslash/npm-cli"] },
  pngs: { text: "This writes the report to out/report.html.", facts: ["pixelslash/compare-two-pngs"] },
  urls: {
    text: "The first command runs once and fetches the browser that takes the screenshots.",
    facts: ["pixelslash/compare-two-urls"],
  },
  ci: {
    text: `The [GitHub Actions guide](${GUIDES[0]}) was tested on GitHub Actions. The [guide for any other CI](${GUIDES[1]}) was tested as a GitHub Actions step and on a desktop; its CircleCI, GitLab and Jenkins examples are not tested on those systems.`,
    facts: ["pixelslash/exit-codes", "pixelslash/block-ci-on-review"],
  },
};

function Command({ text }: { text: string }): ReactNode {
  return <CodeBlock label="bash" language="bash" lines={[text]} copy />;
}

/**
 * `licence` is PixelSlash's licence line, read from its facts file by the page and passed in, so this island's
 * browser bundle does not carry the facts files.
 */
export function Today({ licence }: { licence: string }): ReactNode {
  return (
    <DevSection
      id="today"
      title={TODAY.title.text}
      lead={TODAY.lead.text}
    >
      <Text tone="muted">
        <span data-licence-line="pixelslash">{licence}</span>
      </Text>
      <Steps>
        <Step title={<SubsectionHeading>From two existing screenshots</SubsectionHeading>}>
          <div className="space-y-3">
            <Command text={PIXELSLASH_COMMAND} />
            <Text>{TODAY.pngs.text}</Text>
          </div>
        </Step>
        <Step title={<SubsectionHeading>From two running versions of a page</SubsectionHeading>}>
          <div className="space-y-3">
            <Command text="npx @hackcove/pixelslash install-browser" />
            <Command text="npx @hackcove/pixelslash --live http://localhost:3000 --local http://localhost:3001 --out out" />
            <Text>{TODAY.urls.text}</Text>
          </div>
        </Step>
        <Step title={<SubsectionHeading>In your own pipeline</SubsectionHeading>}>
          <Text>
            <Rich text={TODAY.ci.text} external={GUIDES} />
          </Text>
        </Step>
      </Steps>
      <Cluster gap="md">
        <TextLink href={PIXELSLASH_SITE_URL} external>
          pixelslash.dev
        </TextLink>
        <TextLink href={PIXELSLASH_REPO_URL} external>
          Repository on GitHub
        </TextLink>
        <TextLink href={PIXELSLASH_NPM_URL} external>
          Package on npm
        </TextLink>
      </Cluster>
    </DevSection>
  );
}
