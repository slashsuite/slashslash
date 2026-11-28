import { Callout, TextLink } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { CONTACT } from "#/content/site";

/**
 * How to answer the page's questions, at the end of the home, /developers and PixelSlash's pricing. A
 * neutral note, so its link is the one accent on it: an info tint would set a second, blue accent beside
 * the link's.
 */
export function ContactLine(): ReactNode {
  return (
    <Callout tone="neutral" data-testid="contact-line">
      {CONTACT.lead}
      <TextLink href={CONTACT.href} external>
        {CONTACT.link}
      </TextLink>
      {CONTACT.end}
    </Callout>
  );
}
