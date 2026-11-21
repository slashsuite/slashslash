import { Container, Lead, PageHeading, Stack, Text, TextLink } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { DEVELOPERS_HEADLINE } from "#/content/site";

/** The page's own heading, concise lead, and pointer to /how-it-works. */
export function Intro(): ReactNode {
  return (
    <div className="pt-12 pb-4 md:pt-16">
      <Container>
        <Stack gap="sm">
          <PageHeading id="for-developers">{DEVELOPERS_HEADLINE}</PageHeading>
          <Lead>
            Every built Slash product runs locally or on infrastructure you control. Start with one command-line tool,
            or self-host the server apps in one container.
          </Lead>
          <Text tone="muted">
            Looking for how the agent roles and products fit together from ticket to merge? Read{" "}
            <TextLink href="/how-it-works">how it works</TextLink>.
          </Text>
        </Stack>
      </Container>
    </div>
  );
}
