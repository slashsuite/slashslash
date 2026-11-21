import {
  BulletItem,
  BulletList,
  Button,
  Card,
  CardGrid,
  Cluster,
  Code,
  Container,
  Lead,
  Pill,
  Section,
  Stack,
  Text,
} from "@slashsuite/ui-react";
import { Fragment, type ReactNode } from "react";
import type { Claim } from "#/content/facts";
import { STAGES, STAGE_TONE } from "#/content/stages";
import { LicenceLine } from "#/shell/licence-line";
import { SECTIONS } from "#/shell/sections";
import { CentredHero, CentredRow } from "#/stand-ins/centred-hero";
import { promiseOf, stageOf, type Tool } from "#/tools/tools";

/*
 * A tool's home on the Slash shell, on the kit's parts: the hero (the lockup, the stage, the promise,
 * the way in), what works today, how to try it, what is planned and where to read more. Every tool
 * home differs only in the Tool it passes. The copy blocks are islands: the page hands them in
 * hydrated, through `heroCode` and `tryIt`, and nothing else here runs in the browser.
 */

/** The tool's lockup: its mark and its name. */
function Lockup({ tool }: { tool: Tool }): ReactNode {
  const { mark, name } = SECTIONS[tool.key];
  return (
    <span className="inline-flex items-center gap-2" data-testid="lockup">
      <img src={mark} alt="" width={24} height={24} />
      {name}
    </span>
  );
}

/** The stage the tool is at, as a Pill, and the sentence that says what it means for a user. */
function StageLine({ tool }: { tool: Tool }): ReactNode {
  const stage = stageOf(tool);
  const { label, sentence } = STAGES[stage];
  return (
    <p data-testid="stage">
      <Pill tone={STAGE_TONE[stage]} dot round>
        {label}
      </Pill>{" "}
      <Text as="span" tone="muted">
        {sentence}
      </Text>
    </p>
  );
}

/** A text with the words its copy marks in backticks set as code, and the backticks dropped. */
function Words({ text }: { text: string }): ReactNode {
  return text.split("`").map((run, index) =>
    // The runs of one text never move, so their place is their key.
    index % 2 === 1 ? <Code key={index}>{run}</Code> : <Fragment key={index}>{run}</Fragment>,
  );
}

/** The hero's licence line: the copy's own words where the tool has them, else the facts file's. */
function Licence({ tool, licence }: { tool: Tool; licence: Claim | undefined }): ReactNode {
  if (licence === undefined) return <LicenceLine product={tool.facts} />;
  return <Text tone="muted">Licence: {licence.text}</Text>;
}

function Hero({ tool, heroCode }: { tool: Tool; heroCode: ReactNode }): ReactNode {
  return (
    <section id={tool.key} className="hero-ground">
      <Container>
        <div className="pt-12 pb-4 md:pt-16">
          <CentredHero overline={<Lockup tool={tool} />} title={promiseOf(tool)}>
            <StageLine tool={tool} />
            <Lead>{tool.lead.text}</Lead>
            <Licence tool={tool} licence={tool.licence} />
            <CentredRow>
              <Button href="#try-it" size="lg">
                Try it
              </Button>
              {tool.heroLink === undefined ? null : (
                <Button href={tool.heroLink.href} variant="outline" size="lg">
                  {tool.heroLink.label}
                </Button>
              )}
              <Button href={tool.repo} variant="outline" size="lg">
                Repository on GitHub
              </Button>
            </CentredRow>
            {heroCode === undefined ? null : <div className="min-w-0 text-left">{heroCode}</div>}
          </CentredHero>
        </div>
      </Container>
    </section>
  );
}

function WorksToday({ tool }: { tool: Tool }): ReactNode {
  return (
    <Section id="works-today" size="lg" title={tool.headings?.today ?? "What works today"}>
      <CardGrid columns={2}>
        {tool.today.map((feature) => (
          <Card key={feature.title} title={feature.title} titleStyle="name" size="lg">
            <Stack gap="sm">
              {feature.command === undefined ? null : (
                <span className="block max-w-full break-words">
                  <Code>{feature.command}</Code>
                </span>
              )}
              <Text>
                <Words text={feature.text.text} />
              </Text>
              {feature.list === undefined ? null : (
                <BulletList>
                  {feature.list.map((item) => (
                    <BulletItem key={item.text}>{item.text}</BulletItem>
                  ))}
                </BulletList>
              )}
            </Stack>
          </Card>
        ))}
      </CardGrid>
    </Section>
  );
}

function TryItSection({ tool, tryIt }: { tool: Tool; tryIt: ReactNode }): ReactNode {
  return (
    <Section
      id="try-it"
      size="lg"
      title={tool.tryOn === undefined ? "Try it" : `Try it on ${tool.tryOn}`}
      description={tool.tryIt.lead.text}
    >
      {tool.tryIt.after === undefined ? (
        tryIt
      ) : (
        <Stack gap="lg">
          {tryIt}
          <Text>
            <Words text={tool.tryIt.after.text} />
          </Text>
        </Stack>
      )}
    </Section>
  );
}

export function ToolHome({
  tool,
  heroCode,
  tryIt,
}: {
  tool: Tool;
  /** The hydrated HeroCode, handed in by the page as a named slot. */
  heroCode?: ReactNode;
  /** The hydrated TryIt, handed in by the page as a named slot. */
  tryIt?: ReactNode;
}): ReactNode {
  return (
    <>
      <Hero tool={tool} heroCode={heroCode} />
      <div className="py-16">
        <Container>
          <Stack gap="xl">
            {tool.proof === undefined ? null : (
              <Section id="proof" size="lg" title={tool.proof.title}>
                <Card size="lg">
                  <Text>
                    <Words text={tool.proof.text.text} />
                  </Text>
                </Card>
              </Section>
            )}
            <WorksToday tool={tool} />
            {tool.compared === undefined ? null : (
              <Section id="compared" size="lg" title={tool.compared.title}>
                <Text>{tool.compared.text.text}</Text>
              </Section>
            )}
            <TryItSection tool={tool} tryIt={tryIt} />
            <Section id="planned" size="lg" title={tool.headings?.planned ?? "Planned, not built"} description={tool.planned.lead}>
              <Card>
                <BulletList>
                  {tool.planned.items.map((item) => (
                    <BulletItem key={item.text}>{item.text}</BulletItem>
                  ))}
                </BulletList>
              </Card>
            </Section>
            <Section id="docs" size="lg" title="Read more">
              <Cluster gap="sm">
                {tool.links.map((link) => (
                  <Button key={link.href} href={link.href} variant="outline">
                    {link.label}
                  </Button>
                ))}
              </Cluster>
            </Section>
          </Stack>
        </Container>
      </div>
    </>
  );
}
