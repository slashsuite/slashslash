import { Container, Section } from "@slashsuite/ui-react";
import type { ReactNode } from "react";

/**
 * One /developers section: the kit's landing Section in the page's column, its title an h2, with no
 * overline.
 */
export function DevSection({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
}): ReactNode {
  return (
    <div className="py-12" data-dev-section={id}>
      <Container>
        <Section
          id={id}
          size="lg"
          level={2}
          title={title}
          description={lead}
        >
          {children}
        </Section>
      </Container>
    </div>
  );
}
