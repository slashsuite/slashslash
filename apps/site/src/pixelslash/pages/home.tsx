import {
  Button,
  Card,
  CardGrid,
  CodeBlock,
  Container,
  Lead,
  Pill,
  Section,
  Stack,
  Step,
  Steps,
  Text,
  TextLink,
} from "@slashsuite/ui-react";
import type { ComponentProps, ReactNode } from "react";
import type { Claim } from "#/content/facts";
import { STAGES, STAGE_TONE } from "#/content/stages";
import { REPO_PUBLIC, REPO_URL } from "#/pixelslash/content/links";
import { STAGE } from "#/pixelslash/content/stage";
import { psHref } from "#/pixelslash/paths";
import { LicenceLine } from "#/shell/licence-line";
import { Rich } from "#/shell/rich-text";
import { SECTIONS } from "#/shell/sections";
import { SlashDemo } from "#/pixelslash/demo";
import { CentredHero, CentredRow } from "#/stand-ins/centred-hero";

/*
 * The PixelSlash home on the Slash shell: the hero (the PixelSlash lockup, the promise, the stage it
 * is at, the way in), the slash demo, then what it does, on the kit's parts. The copy is the live
 * home's; the art is the theme's.
 */

/** The promise: the page's h1. */
export const PROMISE: Claim = { text: "See what your change did to the page.", facts: ["pixelslash/what-it-is"] };

/** The hero's lead, before the licence line, which is read from the facts file. */
export const LEAD: Claim = {
  text: "PixelSlash pixel-diffs Main against Branch and writes a report of what changed. It runs on your machine, for free.",
  facts: ["pixelslash/what-it-is", "pixelslash/compare-two-urls", "pixelslash/local-unless-upload"],
};

/** Why it runs in place of a hosted service; the link after it is the compare page. */
export const IN_PLACE: Claim = {
  text: "PixelSlash runs in place of a hosted visual-review service such as Chromatic, Percy or Argos. It is a source-available CLI that needs no Storybook and no account, with no paid plan to buy.",
  facts: ["pixelslash/what-it-is", "pixelslash/licence", "pixelslash/compare-two-urls"],
};

/** How it installs, and how it runs from a clone. */
export const INSTALL: { npm: Claim; clone: Claim } = {
  npm: {
    text: "It is on npm as `@hackcove/pixelslash`, and the command is `pixelslash`. The CLI runs on [Bun](https://bun.sh), so Bun must be on your PATH; `npx` starts it. PNG mode needs no browser; for URL capture run `install-browser` once per machine.",
    facts: ["pixelslash/npm-cli", "pixelslash/compare-two-pngs", "pixelslash/compare-two-urls"],
  },
  clone: {
    text: "To run it from a clone instead, `bun install` and then `bun run pixelslash -- …` in a checkout of",
    facts: ["pixelslash/from-source"],
  },
};

/** Where a shot goes. */
export const LOCAL_CLAIM: Claim = {
  text: "Shots leave the machine only through `pixelslash upload` or `--upload`, and only to the server you name. A model your project sets sees crops of a changed region, never a whole shot.",
  facts: ["pixelslash/local-unless-upload", "pixelslash/server-ai-explanations"],
};

/** What the CLI does, each one a section of PixelSlash's docs. */
export const FEATURES: readonly {
  title: string;
  body: Claim;
  href: string;
  icon: NonNullable<ComponentProps<typeof Card>["icon"]>;
}[] = [
  {
    title: "Two pages, one diff",
    body: {
      text: "Shoot Main and Branch with Playwright, or hand it PNGs you already have. It writes a report.html that shows what changed.",
      facts: ["pixelslash/compare-two-urls", "pixelslash/compare-two-pngs"],
    },
    href: "/how-it-works",
    icon: "capture",
  },
  {
    title: "A perceptual diff",
    body: {
      text: "Your visual tests flag real changes, not rendering noise. A Rust crate compiled to WebAssembly tells anti-aliasing, faint noise and sub-pixel shifts apart from a real change, and reports changed regions. The command line tool and the review app run the same module, with no JavaScript fallback.",
      facts: ["pixelslash/perceptual-diff", "pixelslash/wasm-diff-engine"],
    },
    href: "/how-it-works",
    icon: "diff",
  },
  {
    title: "Your agent drives it",
    body: {
      text: "Your coding agent can check what its own change did to the screens. `pixelslash mcp` is an MCP server. A coding agent reads builds and changed shots, then accepts or rejects a change.",
      facts: ["pixelslash/mcp-server"],
    },
    href: "/docs/mcp",
    icon: "branch",
  },
  {
    title: "Many pages",
    body: {
      text: "Point it at a file of paths and it compares each page. The compare command diffs two snapshot directories.",
      facts: ["pixelslash/many-pages"],
    },
    href: "/docs/compare-dirs#comparing-two-snapshot-dirs",
    icon: "baseline",
  },
  {
    title: "Snapshots in CI",
    body: {
      text: "Every route is shot in a pinned image. Each shot records what rendered it, so one from a different setup is named as such.",
      facts: ["pixelslash/pinned-capture-image"],
    },
    href: "/docs/capture#snapshot-capture-the-pinned-image",
    icon: "ci",
  },
  {
    title: "A review app",
    body: {
      text: "A person sees every visual change and says yes or no to it. `pixelslash upload` sends shots to a PixelSlash review app, which diffs them against the default branch and holds the build for a person to accept or reject each change. Name an OpenAI-compatible model in the project and the app explains each change from crops of the changed regions.",
      facts: ["pixelslash/upload-to-review-app", "pixelslash/server-ai-explanations"],
    },
    href: "/docs/upload#uploading-to-a-server",
    icon: "self-host",
  },
  {
    title: "A design-system judge",
    body: {
      text: "Each shot can be checked against your component images by a vision model. With no judge installed, it says so and invents nothing.",
      facts: ["pixelslash/design-system-judge"],
    },
    href: "/docs/judge",
    icon: "review",
  },
];

export const STEPS: readonly { title: string; body: Claim }[] = [
  {
    title: "Capture",
    body: {
      text: "Main and Branch, shot by Playwright once each page has settled.",
      facts: ["pixelslash/compare-two-urls", "pixelslash/waits-for-page-to-settle"],
    },
  },
  {
    title: "Diff",
    body: { text: "A perceptual diff, clustered into regions you can read.", facts: ["pixelslash/perceptual-diff"] },
  },
  {
    title: "Review",
    body: {
      text: "A report.html on your machine, or a build on your own server.",
      facts: ["pixelslash/compare-two-pngs", "pixelslash/upload-to-review-app", "pixelslash/self-host-docker"],
    },
  },
];

const COMMANDS = [
  "npm i -D @hackcove/pixelslash",
  "npx @hackcove/pixelslash --live-png main.png --local-png branch.png --out out",
  "npx @hackcove/pixelslash install-browser",
] as const;

/** PixelSlash's direction C lockup: its mark and its name. */
function Lockup(): ReactNode {
  const { mark, name } = SECTIONS.pixelslash;
  return (
    <span className="inline-flex items-center gap-2" data-testid="lockup">
      <img src={mark} alt="" width={24} height={24} />
      {name}
    </span>
  );
}

/** The stage PixelSlash is at, as a Pill, and the sentence that says what it means for a user. */
function StageLine(): ReactNode {
  const { label, sentence } = STAGES[STAGE];
  return (
    <p data-testid="stage">
      <Pill tone={STAGE_TONE[STAGE]} dot round>
        {label}
      </Pill>{" "}
      <Text as="span" tone="muted">
        {sentence}
      </Text>
    </p>
  );
}

function Hero(): ReactNode {
  return (
    <div className="hero-ground">
      <Container>
        <Stack gap="xl">
          <div className="pt-12 md:pt-16">
            <CentredHero overline={<Lockup />} title={PROMISE.text}>
              <StageLine />
              <Lead>{LEAD.text}</Lead>
              <LicenceLine product="pixelslash" />
              <CentredRow>
                <Button href={psHref("/self-host")} size="lg">
                  Get started
                </Button>
                <Button href={psHref("/docs")} variant="outline" size="lg">
                  Docs
                </Button>
              </CentredRow>
            </CentredHero>
          </div>
          <SlashDemo />
        </Stack>
      </Container>
    </div>
  );
}

function HowItRuns(): ReactNode {
  return (
    <Section size="lg" title="Three steps, all on your machine">
      <Text>
        {IN_PLACE.text} <TextLink href={psHref("/compare")}>Where it is still behind</TextLink>.
      </Text>
      <Steps size="lg">
        {STEPS.map((step) => (
          <Step key={step.title} title={step.title}>
            {step.body.text}
          </Step>
        ))}
      </Steps>
    </Section>
  );
}

function Features(): ReactNode {
  return (
    <Section size="lg" title="What it does">
      <CardGrid columns={3}>
        {FEATURES.map((feature) => (
          <Card key={feature.title} href={psHref(feature.href)} icon={feature.icon} size="lg" title={feature.title}>
            <Rich text={feature.body.text} />
          </Card>
        ))}
      </CardGrid>
    </Section>
  );
}

function Install(): ReactNode {
  return (
    <Section size="lg" title="Install it from npm">
      <div className="grid items-start gap-10 lg:grid-cols-[2fr_3fr]">
        <Stack gap="sm">
          <Text>
            <Rich text={INSTALL.npm.text} />
          </Text>
          <Text>
            <Rich text={INSTALL.clone.text} />{" "}
            {REPO_PUBLIC ? <TextLink href={REPO_URL}>the repository</TextLink> : "the repository"}.
          </Text>
        </Stack>
        <div className="min-w-0">
          <CodeBlock label="bash" language="bash" lines={[...COMMANDS]} overflow="wrap" copy />
        </div>
      </div>
    </Section>
  );
}

function Local(): ReactNode {
  return (
    <Section
      size="lg"
      title="Your pixels stay on your machine."
      description={<Rich text={LOCAL_CLAIM.text} />}
      actions={
        <>
          <Button href={psHref("/how-it-works")}>How it works</Button>
          <Button href={psHref("/security")} variant="outline">
            Security
          </Button>
        </>
      }
    />
  );
}

export function PixelSlashHome(): ReactNode {
  return (
    <>
      <Hero />
      <div className="py-16">
        <Container>
          <Stack gap="xl">
            <HowItRuns />
            <Features />
            <Install />
            <Local />
          </Stack>
        </Container>
      </div>
    </>
  );
}
