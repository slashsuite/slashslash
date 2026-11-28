import {
  Button,
  Callout,
  Card,
  CardGrid,
  Cluster,
  Display,
  Lead,
  PageHeading,
  Stack,
  TextLink,
} from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { psHref } from "#/pixelslash/paths";
import { ContactLine } from "#/shell/contact-line";
import { LicenceLine } from "#/shell/licence-line";
import { REPO_PUBLIC, REPO_URL } from "#/pixelslash/content/links";
import {
  ACTION,
  CARDS,
  COMMITMENT,
  LEAD,
  LICENCE_BRIEF,
  STATEMENT,
} from "#/pixelslash/content/pricing";

/**
 * The statement, its lead and the one action; then the facts and the commitment as one row of three
 * cards, so the row is full and no box stands alone beside the hero with blank space under it. The
 * licence brief follows, and the contact line ends the page.
 */
export function PricingPage(): ReactNode {
  return (
    <Stack width="full" gap="lg">
      <Stack gap="sm">
        <PageHeading>
          <Display as="span">{STATEMENT.text}</Display>
        </PageHeading>
        <Lead>{LEAD.text}</Lead>
        <Cluster gap="xs">
          <Button href={psHref(ACTION.href)} size="lg" data-testid="pricing-action">
            {ACTION.label} <span aria-hidden="true">→</span>
          </Button>
        </Cluster>
      </Stack>
      <CardGrid columns={3} data-testid="pricing-facts">
        {CARDS.map((fact) => (
          <Card key={fact.title} title={fact.title} icon={fact.icon}>
            {"licence" in fact.body ? <LicenceLine product={fact.body.licence} inline /> : fact.body.text}
          </Card>
        ))}
        <Card title="Our commitment" icon="check">
          {COMMITMENT.text}
        </Card>
      </CardGrid>
      <Callout tone="neutral" title="The licence in brief" data-testid="licence-brief">
        <Stack gap="sm">
          <span data-testid="licence-brief-text">{LICENCE_BRIEF.text}</span>
          {REPO_PUBLIC ? (
            <span>
              <TextLink href={`${REPO_URL}/blob/main/LICENSE`}>Read the licence</TextLink>
            </span>
          ) : null}
        </Stack>
      </Callout>
      <ContactLine />
    </Stack>
  );
}
