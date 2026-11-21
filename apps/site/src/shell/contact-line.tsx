import { Callout, TextLink } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { CONTACT } from "#/content/site";

/** How to answer the page's questions, at the end of the home and of /developers. */
export function ContactLine(): ReactNode {
  return (
    <Callout tone="info">
      {CONTACT.lead}
      <TextLink href={CONTACT.href} external>
        {CONTACT.link}
      </TextLink>
      {CONTACT.end}
    </Callout>
  );
}
