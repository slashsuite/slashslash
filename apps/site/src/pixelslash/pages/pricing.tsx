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
 * The statement, its lead and the one action on the left of a hero, the commitment beside them on the
 * right; the facts follow, and the contact line ends the page. Below lg the hero is one column, in
 * that order. From lg the hero is the facts' own three columns with the same gap, the headline over
 * two of them and the commitment over the third, so its left edge meets the third card's.
 */
export function PricingPage(): ReactNode {
  return (
    <Stack width="full" gap="lg">
      <div className="grid gap-8 lg:grid-cols-3 lg:gap-4 lg:items-start" data-testid="pricing-hero">
        <div className="lg:col-span-2">
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
        </div>
        <Callout tone="neutral" title="Our commitment" data-testid="commitment">
          {COMMITMENT.text}
        </Callout>
      </div>
      <CardGrid columns={3} data-testid="pricing-facts">
        {CARDS.map((fact) => (
          <Card key={fact.title} title={fact.title} icon={fact.icon}>
            {"licence" in fact.body ? <LicenceLine product={fact.body.licence} /> : fact.body.text}
          </Card>
        ))}
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
