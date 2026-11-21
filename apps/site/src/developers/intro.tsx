import { Container, Lead, PageHeading, Stack, Text } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { DEVELOPERS_DESCRIPTION } from "#/content/site";
import { DEVELOPERS } from "#/content/story";
import { DevSection } from "#/developers/section";

/** The page's own heading and lead, then the story's section for developers. */
export function Intro(): ReactNode {
  return (
    <>
      <div className="pt-12 md:pt-16">
        <Container>
          <Stack gap="sm">
            <PageHeading id="for-developers">For developers</PageHeading>
            <Lead>{DEVELOPERS_DESCRIPTION}</Lead>
          </Stack>
        </Container>
      </div>
      <DevSection id="agents" title={DEVELOPERS.title}>
        <Text>{DEVELOPERS.next.text}</Text>
      </DevSection>
    </>
  );
}
