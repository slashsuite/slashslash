import { Button, Container, Lead, PageHeading, Stack, Text } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import {
  type BoldLine,
  CLOSE,
  CONTROL,
  HOW_IT_WORKS_HEADLINE,
  HOW_IT_WORKS_HERO,
  STAGES,
  STATUS,
} from "#/content/how-it-works";
import { ROLES, type TeamRole } from "#/content/how-it-works-roles";
import { HomeSection } from "#/home/sections";
import { Rich } from "#/shell/rich-text";

/*
 * /how-it-works static sections: the h1 and the hero paragraph before the storybook island; the team,
 * where you stay in control, the five stages, running today and next, and the close after it.
 */

const words = (line: BoldLine["line"]): string => (typeof line === "string" ? line : line.text);

/** A line whose text opens with its bold label: the label in bold, then the rest as written. */
function Bold({ item }: { item: BoldLine }): ReactNode {
  const text = words(item.line);
  if (!text.startsWith(item.bold)) throw new Error(`The line "${text}" does not start with "${item.bold}".`);
  return (
    <Text>
      <strong>{item.bold}</strong>
      <Rich text={text.slice(item.bold.length)} />
    </Text>
  );
}

function BoldList({ items, name }: { items: readonly BoldLine[]; name: string }): ReactNode {
  return (
    <ul className="list-disc space-y-2 pl-6" data-list={name}>
      {items.map((item) => (
        <li key={item.bold}>
          <Bold item={item} />
        </li>
      ))}
    </ul>
  );
}

function RoleCard({ role }: { role: TeamRole }): ReactNode {
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
        <h3 className="text-lg font-semibold leading-snug">{role.name}</h3>
        <Text>
          <Rich text={role.summary.text} />
        </Text>
      </div>
    </li>
  );
}

export function HowItWorksHero(): ReactNode {
  return (
    <div className="pt-12 md:pt-16">
      <Container>
        <Stack gap="sm">
          <PageHeading id="how-it-works">{HOW_IT_WORKS_HEADLINE}</PageHeading>
          <Lead>{HOW_IT_WORKS_HERO}</Lead>
        </Stack>
      </Container>
    </div>
  );
}

export function HowItWorksAfterStory(): ReactNode {
  return (
    <>
      <HomeSection id="team" title={ROLES.title}>
        <ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.items.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </ul>
      </HomeSection>
      <HomeSection id="control" title={CONTROL.title}>
        <Text>{CONTROL.intro}</Text>
        <BoldList items={CONTROL.items} name="control" />
        <Text>{CONTROL.after.text}</Text>
      </HomeSection>
      <HomeSection id="stages" title={STAGES.title}>
        <BoldList items={STAGES.items} name="stages" />
      </HomeSection>
      <HomeSection id="status" title={STATUS.title}>
        <Text>{STATUS.intro}</Text>
        <h3 className="font-semibold">{STATUS.todayTitle}</h3>
        <BoldList items={STATUS.today} name="today" />
        <h3 className="font-semibold">{STATUS.nextTitle}</h3>
        <Text>{STATUS.nextIntro}</Text>
        <BoldList items={STATUS.planned} name="next" />
      </HomeSection>
      <div className="pb-16">
        <HomeSection id="close" title={HOW_IT_WORKS_HEADLINE}>
          <Text>{CLOSE.text}</Text>
          <div>
            <Button href={CLOSE.href} variant="outline" size="lg">
              {CLOSE.button}
            </Button>
          </div>
        </HomeSection>
      </div>
    </>
  );
}
