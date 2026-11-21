import { Overline, Pill, Step, Steps, SubsectionHeading, Text } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { FLOW, type Output } from "#/content/flow";
import { STAGES, STAGE_TONE } from "#/content/stages";
import { Evidence, Terminal } from "#/developers/evidence";
import { DevSection } from "#/developers/section";

/*
 * One feature from ticket to cleanup, one kit Step per stop. A tool's output sits in its evidence frame:
 * its commands in copy blocks and what they printed in plain ones. The page hydrates this when it scrolls
 * into view, for the copy buttons.
 */

function Artefact({ output, tool }: { output: Output; tool: string }): ReactNode {
  return (
    <Evidence kind={output.kind} title={output.title}>
      {output.lines ? <Terminal lines={output.lines} tool={tool} /> : null}
      {output.image ? (
        <img
          className="h-auto w-full rounded-md"
          src={output.image.src}
          width={output.image.width}
          height={output.image.height}
          alt={output.image.alt}
        />
      ) : null}
    </Evidence>
  );
}

export function Walkthrough(): ReactNode {
  return (
    <DevSection
      id="walkthrough"
      title="One feature goes from ticket to cleanup."
      lead="Solid frames hold real output or text from a tool's docs. Dashed frames are imagined."
    >
      <Steps>
        {FLOW.map((step) => (
          <Step
            key={step.id}
            id={step.id}
            title={
              <>
                <Overline mono>{step.label}</Overline>
                <SubsectionHeading>{step.title}</SubsectionHeading>
              </>
            }
          >
            <div className="space-y-6 pb-8">
              <Text>{step.story}</Text>
              {step.fits.map((fit) => (
                <div className="min-w-0 space-y-3" key={fit.tool}>
                  <SubsectionHeading as="h4" size="sm">
                    {fit.tool} <Pill tone={STAGE_TONE[fit.stage]}>{STAGES[fit.stage].label}</Pill>
                  </SubsectionHeading>
                  <Text>{fit.text.text}</Text>
                  {fit.output ? <Artefact output={fit.output} tool={fit.tool} /> : null}
                </div>
              ))}
            </div>
          </Step>
        ))}
      </Steps>
    </DevSection>
  );
}
