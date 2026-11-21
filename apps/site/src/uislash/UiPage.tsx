import {
  BulletItem,
  BulletList,
  Card,
  CodeBlock,
  MetaList,
  Pill,
  Prose,
  Section,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  TextLink,
} from "@slashsuite/ui-react";
import { componentSections } from "@uislash-src/packages/ui-react/docs/components/index";
import type { ReactNode } from "react";
import { STAGES, STAGE_TONE } from "#/content/stages";
import { StatusCard } from "./StatusCard";
import { UISLASH_THEMES } from "./themes";
import { UISLASH_UI } from "./ui";

function Install(): ReactNode {
  return (
    <Section title={UISLASH_UI.install.title} gap="md">
      {UISLASH_UI.install.steps.map((step) => (
        <Stack key={step.text} gap="xs">
          <Text>{step.text}</Text>
          {step.code !== undefined && (
            <CodeBlock
              lines={[step.code].flat()}
              label={step.label ?? "bash"}
              {...(step.language !== undefined ? { language: step.language } : {})}
              copy
            />
          )}
        </Stack>
      ))}
    </Section>
  );
}

function Themes(): ReactNode {
  return (
    <Section title={UISLASH_UI.themes.title} gap="md">
      <Text>{UISLASH_UI.themes.intro}</Text>
      <Table label={UISLASH_UI.themes.title}>
        <TableHead>
          <TableRow>
            <TableHeaderCell>{UISLASH_UI.themes.themeLabel}</TableHeaderCell>
            <TableHeaderCell>{UISLASH_UI.themes.scopeLabel}</TableHeaderCell>
            <TableHeaderCell>{UISLASH_UI.themes.importLabel}</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {UISLASH_THEMES.map((theme) => (
            <TableRow key={theme.id}>
              <TableCell tone="strong">{theme.title}</TableCell>
              <TableCell mono>{theme.scopeClass}</TableCell>
              <TableCell mono>{theme.specifier}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
}

function Included(): ReactNode {
  return (
    <Section title="What else is included" gap="md">
      <BulletList>
        <BulletItem>
          Whole status pages: built-in pages for error, not found, forbidden, maintenance and offline states.
        </BulletItem>
        <BulletItem>
          PR review workflow: a reusable GitHub Actions workflow runs a deterministic rule check that fails a pull
          request on design-system violations, plus an advisory model review.
        </BulletItem>
        <BulletItem>
          Agent-ready docs: every component page below leads with Do and Don&apos;t rules, accessibility guidance and
          props. <TextLink href="/uislash/llms.txt">/uislash/llms.txt</TextLink> serves the same reference as plain text
          for coding agents.
        </BulletItem>
        <BulletItem>
          Planned: @slashsuite/ui-react-native, built natively for React Native (not built yet).
        </BulletItem>
      </BulletList>
    </Section>
  );
}

function Components(): ReactNode {
  return (
    <Section title={UISLASH_UI.components.title} gap="md">
      <Text>{UISLASH_UI.components.intro}</Text>
      <Stack gap="sm">
        {componentSections.map((section) => (
          <Card
            key={section.title}
            as="article"
            icon={section.icon}
            title={section.title}
            count={section.pages.length}
          >
            <Stack gap="sm">
              <Text>{section.description}</Text>
              <MetaList>
                {section.pages.map((page) => (
                  <TextLink key={page.slug} href={`/uislash/${page.slug}`}>
                    {page.name}
                  </TextLink>
                ))}
              </MetaList>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Section>
  );
}

/** Getting started: stage, licence, intro, install, themes, highlights, component docs and links. */
export function UiPage({ licence }: { licence?: string }): ReactNode {
  return (
    <Prose>
      <Stack gap="xl">
        <Stack gap="sm">
          <p data-testid="stage">
            <Pill tone={STAGE_TONE.alpha} dot round>
              {STAGES.alpha.label}
            </Pill>{" "}
            <Text as="span" tone="muted">
              {STAGES.alpha.sentence}
            </Text>
          </p>
          {licence !== undefined ? (
            <Text tone="muted">
              <span data-licence-line="uislash">{licence}</span>
            </Text>
          ) : null}
          {UISLASH_UI.intro.map((paragraph) => (
            <Text key={paragraph}>{paragraph}</Text>
          ))}
        </Stack>
        <Install />
        <Themes />
        <Included />
        <Components />
        <StatusCard
          title={UISLASH_UI.docs.title}
          status={UISLASH_UI.docs.status}
          summary={UISLASH_UI.docs.text}
          links={UISLASH_UI.docs.links}
        />
        <Section title={UISLASH_UI.links.title}>
          <MetaList>
            {UISLASH_UI.links.items.map((link) => (
              <TextLink key={link.href} href={link.href}>
                {link.label}
              </TextLink>
            ))}
          </MetaList>
        </Section>
      </Stack>
    </Prose>
  );
}
