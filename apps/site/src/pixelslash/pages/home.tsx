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
import { PIXELSLASH_SITE_URL } from "#/content/site";
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
 * is at, the way in), the slash demo, then what it does, on the kit's parts.
 */

/** The promise: the page's h1. */
export const PROMISE: Claim = { text: "See what your change did to the page.", facts: ["pixelslash/what-it-is"] };

/** The hero's lead, before the licence line, which is read from the facts file. */
export const LEAD: Claim = {
  text: "PixelSlash compares Main and Branch shots and writes a report of every real visual change. Run it locally for free, upload to the hosted review app at pixelslash.dev, or self-host the whole stack.",
  facts: [
    "pixelslash/what-it-is",
    "pixelslash/compare-two-urls",
    "pixelslash/local-unless-upload",
    "pixelslash/hosted-review-app",
    "pixelslash/self-host-docker",
  ],
};

/** Why it runs in place of a hosted service; the link after it is the compare page. */
export const IN_PLACE: Claim = {
  text: "PixelSlash runs in place of a hosted visual-review service such as Chromatic, Percy or Argos. It is a source-available CLI that needs no Storybook and no account, with no paid plan to buy.",
  facts: ["pixelslash/what-it-is", "pixelslash/licence", "pixelslash/compare-two-urls"],
};

/** How it installs, and how it runs from a clone. */
export const INSTALL: { npm: Claim; clone: Claim } = {
  npm: {
    text: "Install from npm as `@slashsuite/pixelslash` (CLI, runs on [Bun](https://bun.sh)) or `@slashsuite/pixelslash-playwright` (Playwright helper, runs on Node). PNG mode needs no browser; for URL capture run `install-browser` once per machine.",
    facts: [
      "pixelslash/npm-cli",
      "pixelslash/npm-playwright-helper",
      "pixelslash/compare-two-pngs",
      "pixelslash/compare-two-urls",
    ],
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
      text: "Shoot Main and Branch with Playwright Chromium (waiting for fonts, images, network and two animation frames), or pass two PNGs you already have. Writes a standalone report.html.",
      facts: ["pixelslash/compare-two-urls", "pixelslash/waits-for-page-to-settle", "pixelslash/compare-two-pngs"],
    },
    href: "/how-it-works",
    icon: "capture",
  },
  {
    title: "Rust WebAssembly perceptual diff",
    body: {
      text: "Your visual tests flag real changes, not rendering noise. One Rust crate compiled to WebAssembly separates anti-aliasing, faint noise and sub-pixel shifts from real changes and clusters regions. CLI and review app run the same module, with no JavaScript fallback.",
      facts: ["pixelslash/perceptual-diff", "pixelslash/wasm-diff-engine"],
    },
    href: "/how-it-works",
    icon: "diff",
  },
  {
    title: "Your coding agent drives it",
    body: {
      text: "`pixelslash mcp` runs an MCP server so a coding agent can inspect builds and changed shots and accept or reject changes directly.",
      facts: ["pixelslash/mcp-server"],
    },
    href: "/docs/mcp",
    icon: "branch",
  },
  {
    title: "Many pages, Storybook and native",
    body: {
      text: "Compare a route list (`--routes`), two shot directories (`compare`), every story of a running Storybook 7+ index, or Android and iOS PNGs paired with web shots. `pixelslash dev` re-shoots on every save.",
      facts: ["pixelslash/many-pages", "pixelslash/storybook-stories", "pixelslash/native-screenshots", "pixelslash/dev-mode"],
    },
    href: "/docs/compare-dirs#comparing-two-snapshot-dirs",
    icon: "baseline",
  },
  {
    title: "Deterministic CI and flaky shots",
    body: {
      text: "`pixelslash capture` shoots inside a pinned container image (`ghcr.io/slashsuite/pixelslash-capture`) and records each shot's render fingerprint. Changed shots are re-shot and flagged as flaky shots when recaptures disagree; `pixelslash flake` reproduces them locally.",
      facts: ["pixelslash/pinned-capture-image", "pixelslash/capture-image", "pixelslash/flaky-shot-detection"],
    },
    href: "/docs/capture#snapshot-capture-the-pinned-image",
    icon: "ci",
  },
  {
    title: "Hosted or self-hosted review app",
    body: {
      text: "`pixelslash upload` sends shots to pixelslash.dev (GitHub or Google sign-in) or your own Docker or Cloudflare Workers server. Reviewers step through changes with `j`/`k` and `a`/`r`, block CI with `pixelslash status --wait`, and optionally explain changes with an OpenAI-compatible model that sees only changed-region crops.",
      facts: [
        "pixelslash/upload-to-review-app",
        "pixelslash/hosted-review-app",
        "pixelslash/self-host-docker",
        "pixelslash/self-host-cloudflare",
        "pixelslash/review-app-keyboard",
        "pixelslash/block-ci-on-review",
        "pixelslash/server-ai-explanations",
      ],
    },
    href: "/docs/upload#uploading-to-a-server",
    icon: "self-host",
  },
  {
    title: "Local design-system judge and axe-core",
    body: {
      text: "Optionally check each shot against component reference images using a local vision model (mlx or ollama), or run axe-core to list WCAG A and AA violations new on Branch.",
      facts: ["pixelslash/design-system-judge", "pixelslash/accessibility-checks"],
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
      text: "A report.html on your machine, on pixelslash.dev, or on your own server.",
      facts: ["pixelslash/compare-two-pngs", "pixelslash/upload-to-review-app", "pixelslash/hosted-review-app", "pixelslash/self-host-docker"],
    },
  },
];

const COMMANDS = [
  "npm i -D @slashsuite/pixelslash",
  "npx @slashsuite/pixelslash --live-png main.png --local-png branch.png --out out",
  "npx @slashsuite/pixelslash install-browser",
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
                <Button href={PIXELSLASH_SITE_URL} variant="outline" size="lg">
                  Hosted review app
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
