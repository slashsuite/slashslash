import { Text } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { DEVELOPER_QUESTIONS } from "#/developers/questions";
import { DevSection } from "#/developers/section";
import { ContactLine } from "#/shell/contact-line";

/** The ask: the developer questions, then how to answer. */
export function Ask(): ReactNode {
  return (
    <DevSection id="ask" title="I would like your view">
      <ol className="list-decimal space-y-2 pl-6">
        {DEVELOPER_QUESTIONS.map((question) => (
          <li key={question}>
            <Text>{question}</Text>
          </li>
        ))}
      </ol>
      <ContactLine />
    </DevSection>
  );
}
