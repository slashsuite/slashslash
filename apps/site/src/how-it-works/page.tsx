import { Container, Lead, PageHeading, Stack, Text, TextLink } from "@slashsuite/ui-react";
import { Fragment, type ReactNode } from "react";
import type { Claim } from "#/content/facts";
import { CLOSE, DIAGRAM, type FlowTool, HOW_IT_WORKS_HEADLINE, HOW_IT_WORKS_LEAD, TOOLS } from "#/content/how-it-works";
import { type FlowRole, type FlowTerm, ROLES, TERMS } from "#/content/how-it-works-roles";
import { type FlowStep, type Run, STATUS, STEPS } from "#/content/how-it-works-steps";
import { HomeSection } from "#/home/sections";
import { FlowDiagram } from "#/illustrations/flow";
import { Rich } from "#/shell/rich-text";

/*
 * /how-it-works static sections: the h1 and its two paragraphs, the illustrated roles, and the terms
 * before the interactive storybook island; the flow diagram, the steps in words, today and planned,
 * the tools, and the close after it.
 */

const words = (run: Run): string => (typeof run === "string" ? run : run.text);

/** A step's runs as one run of prose, a space between each. */
function Runs({ runs }: { runs: readonly Run[] }): ReactNode {
  return runs.map((run, i) => (
    <Fragment key={i}>
      {i > 0 ? " " : null}
      <Rich text={words(run)} />
    </Fragment>
  ));
}

function List({ items }: { items: readonly Claim[] }): ReactNode {
  return (
    <ul className="list-disc space-y-2 pl-6">
      {items.map((item) => (
        <li key={item.text}>
          <Text>
            <Rich text={item.text} />
          </Text>
        </li>
      ))}
    </ul>
  );
}

function RoleCard({ role }: { role: FlowRole }): ReactNode {
  return (
    <li
      data-role={role.id}
      className="flex min-w-0 flex-col overflow-hidden rounded-lg border-2 border-[var(--hc-line)] bg-[var(--hc-surface)]"
    >
      <div className="border-b border-[var(--hc-line)] bg-[var(--hc-surface)]">
        <img
          src={role.image}
          alt={role.alt}
          width={800}
          height={597}
          loading="lazy"
          decoding="async"
          className="block aspect-[4/3] w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="space-y-0.5">
          <h3 className="text-lg font-semibold leading-snug">{role.name}</h3>
          <Text tone="muted">{role.role}</Text>
        </div>
        <Text>
          <Rich text={role.summary.text} />
        </Text>
      </div>
    </li>
  );
}

function TermCard({ term }: { term: FlowTerm }): ReactNode {
  return (
    <li
      data-term={term.id}
      className="flex min-w-0 flex-col gap-2 rounded-lg border-2 border-[var(--hc-line)] bg-[var(--hc-surface)] p-4"
    >
      <div className="space-y-0.5">
        <h3 className="text-lg font-semibold leading-snug">{term.name}</h3>
        <Text tone="muted">{term.tagline}</Text>
      </div>
      <Text>
        <Rich text={term.summary.text} />
      </Text>
    </li>
  );
}

function StepInWords({ step }: { step: FlowStep }): ReactNode {
  return (
    <div className="space-y-3">
      <Text>
        <strong>{step.title}</strong> <Runs runs={step.text} />
      </Text>
      {step.checks === undefined ? null : <List items={step.checks} />}
      {step.after === undefined ? null : (
        <Text>
          <Runs runs={step.after} />
        </Text>
      )}
    </div>
  );
}

/** A tool's line: its name in bold, linked to its page here when it has one, then the rest of the line. */
function ToolLine({ tool }: { tool: FlowTool }): ReactNode {
  const { text } = tool.line;
  if (!text.startsWith(tool.name)) throw new Error(`The line for ${tool.name} does not start with its name.`);
  return (
    <li data-tool={tool.name}>
      <Text>
        <strong>{tool.href === undefined ? tool.name : <TextLink href={tool.href}>{tool.name}</TextLink>}</strong>
        {text.slice(tool.name.length)}
      </Text>
    </li>
  );
}

export function HowItWorksBeforeStory(): ReactNode {
  return (
    <>
      <div className="pt-12 md:pt-16">
        <Container>
          <Stack gap="sm">
            <PageHeading id="how-it-works">{HOW_IT_WORKS_HEADLINE}</PageHeading>
            {HOW_IT_WORKS_LEAD.map((line) => (
              <Lead key={line}>{line}</Lead>
            ))}
          </Stack>
        </Container>
      </div>
      <HomeSection id="roles" title={ROLES.title}>
        <Text>{ROLES.intro}</Text>
        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.items.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </ul>
      </HomeSection>
      <HomeSection id="terms" title={TERMS.title}>
        <Text>{TERMS.intro}</Text>
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {TERMS.items.map((term) => (
            <TermCard key={term.id} term={term} />
          ))}
        </ul>
      </HomeSection>
    </>
  );
}

export function HowItWorksAfterStory(): ReactNode {
  return (
    <>
      <HomeSection id="flow" title={DIAGRAM.title}>
        <FlowDiagram nodes={DIAGRAM.nodes} caption={DIAGRAM.caption} />
      </HomeSection>
      <HomeSection id="steps" title={STEPS.title}>
        {STEPS.steps.map((step) => (
          <StepInWords key={step.title} step={step} />
        ))}
      </HomeSection>
      <HomeSection id="status" title={STATUS.title}>
        <Text>{STATUS.legend}</Text>
        <h3 className="font-semibold">{STATUS.todayTitle}</h3>
        <List items={STATUS.today} />
        <h3 className="font-semibold">{STATUS.plannedTitle}</h3>
        <List items={STATUS.planned} />
      </HomeSection>
      <HomeSection id="tools" title={TOOLS.title}>
        <ul className="list-disc space-y-2 pl-6">
          {TOOLS.tools.map((tool) => (
            <ToolLine key={tool.name} tool={tool} />
          ))}
        </ul>
      </HomeSection>
      <div className="pb-16">
        <Container>
          <Stack gap="sm">
            <Text>
              <Rich text={CLOSE.next} />
            </Text>
            <Text>
              <Rich text={CLOSE.source.text} external={CLOSE.external} />
            </Text>
          </Stack>
        </Container>
      </div>
    </>
  );
}
