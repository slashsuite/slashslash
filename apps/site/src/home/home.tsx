import { Button, Card, Container, Lead, ListRow, Pill, Stack, Step, Steps, Text } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import type { Claim } from "#/content/facts";
import { STAGES, STAGE_TONE } from "#/content/stages";
import { HERO, PIPELINE } from "#/content/story";
import { HomeSection } from "#/home/sections";
import { TOOL_CARDS, type ToolCard } from "#/home/tools";
import { HeroPanes } from "#/illustrations/hero";
import { CentredHero, CentredRow } from "#/stand-ins/centred-hero";

/*
 * The suite home's first screen, on the kit's parts: the hero (the story's title, lead, CTAs and the
 * five-stage pipeline strip), then the pipeline: the steps a change goes through, in order, each with
 * the products that run there and what each does there. Nothing here runs in the browser; the page
 * adds the Motion island beside it.
 */

function HomeHero(): ReactNode {
  return (
    <section className="hero-ground" aria-label="Introduction">
      <Container>
        <div className="pt-12 pb-8 md:pt-16">
          <CentredHero title={HERO.title.text}>
            <Lead>{HERO.lead.text}</Lead>
            <CentredRow>
              <Button href="/how-it-works" size="lg">
                See how it works
              </Button>
              <Button href="#tools" variant="outline" size="lg">
                Explore the products
              </Button>
            </CentredRow>
          </CentredHero>
          {/* The full column, so the strip lines up with the pipeline below. */}
          <HeroPanes />
        </div>
      </Container>
    </section>
  );
}

/**
 * A tool's row: its mark, its name and release stage, and what it does at this step; a link to its page here
 * if it has one.
 */
function ToolRow({ tool, does }: { tool: ToolCard; does: Claim }): ReactNode {
  return (
    // On a linked row the kit puts data-* on the stretched link, not the row, so the name rides a wrapper.
    <div data-tool={tool.name}>
      <ListRow
        {...(tool.href === undefined ? {} : { href: tool.href })}
        leading={<img src={tool.mark} alt="" width={28} height={28} />}
        secondary={does.text}
      >
        <span className="inline-flex flex-wrap items-center gap-2">
          <strong>{tool.name}</strong>
          <Pill tone={STAGE_TONE[tool.stage]} dot round>
            {STAGES[tool.stage].label}
          </Pill>
        </span>
      </ListRow>
    </div>
  );
}

/** A tool's card by name: every tool in the pipeline has one. */
function cardFor(name: ToolCard["name"]): ToolCard {
  const card = TOOL_CARDS.find((tool) => tool.name === name);
  if (card === undefined) throw new Error(`No tool card for ${name}.`);
  return card;
}

/** The pipeline, at #tools: one numbered step per stage, in order, with the tools that run at it. */
function Pipeline(): ReactNode {
  return (
    <HomeSection id="tools" title={PIPELINE.title}>
      <Text>{PIPELINE.lead}</Text>
      <Steps>
        {PIPELINE.stages.map((stage) => (
          <Step key={stage.name} title={<h3 className="font-semibold">{stage.name}</h3>} data-step={stage.name}>
            <div className="space-y-4">
              <Text>{stage.text.text}</Text>
              {stage.tools.length === 0 ? null : (
                <Card flush>
                  <Stack divided>
                    {stage.tools.map((row) => (
                      <ToolRow key={row.tool} tool={cardFor(row.tool)} does={row.does} />
                    ))}
                  </Stack>
                </Card>
              )}
            </div>
          </Step>
        ))}
      </Steps>
      <Text>{PIPELINE.next.text}</Text>
    </HomeSection>
  );
}

export function Home(): ReactNode {
  return (
    <>
      <HomeHero />
      <Pipeline />
    </>
  );
}
