import {
  Card,
  CodeBlock,
  MetaList,
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

/** Getting started: the purpose, install, themes, the component docs and where to find it. */
export function UiPage(): ReactNode {
  return (
    <Prose>
      <Stack gap="xl">
        <Stack gap="md">
          {UISLASH_UI.intro.map((paragraph) => (
            <Text key={paragraph}>{paragraph}</Text>
          ))}
        </Stack>
        <Install />
        <Themes />
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
