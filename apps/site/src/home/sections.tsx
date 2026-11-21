import { Container, Section, Text } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { STANDS, VIEW, VIEW_QUESTIONS } from "#/content/story";
import { ContactLine } from "#/shell/contact-line";
import { Rich } from "#/shell/rich-text";

/*
 * The rest of the suite home, after the pipeline: where it stands, and the ask. Each is a kit Section
 * whose title is an h2. Nothing here runs in the browser.
 */

/** One home section: the kit's Section in the page's column, its title an h2. */
export function HomeSection({ id, title, children }: { id: string; title: string; children: ReactNode }): ReactNode {
  return (
    <div className="py-12" data-home-section={id}>
      <Container>
        <Section id={id} title={title} level={2}>
          {children}
        </Section>
      </Container>
    </div>
  );
}

/** Where it stands: which tools are alphas, what may be reset, and where to start with each. */
export function Stands(): ReactNode {
  return (
    <HomeSection id="stands" title={STANDS.title}>
      <Text>{STANDS.stages.text}</Text>
      <Text>{STANDS.start.title}</Text>
      <ul className="list-disc space-y-2 pl-6" data-stands-start="">
        {STANDS.start.items.map((item) => (
          <li key={item.text}>
            <Text>
              <Rich text={item.text} external={STANDS.start.external} />
            </Text>
          </li>
        ))}
      </ul>
      <Text>
        <Rich text={STANDS.selfHost.text} />
      </Text>
    </HomeSection>
  );
}

/** The ask, at #your-view, where the questions are. */
export function YourView(): ReactNode {
  return (
    <HomeSection id="your-view" title={VIEW.title}>
      <ol className="list-decimal space-y-2 pl-6">
        {VIEW_QUESTIONS.map((question) => (
          <li key={question}>
            <Text>{question}</Text>
          </li>
        ))}
      </ol>
      <ContactLine />
    </HomeSection>
  );
}
