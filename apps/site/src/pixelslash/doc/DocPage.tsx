import { Overline, ProseLayout, Stack, TextLink } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { DocBody, type Doc } from "#/pixelslash/doc/markdown";

/** The document's H2 and H3, each a plain link to its heading in the body. */
export function OnThisPage({ doc }: { doc: Doc }): ReactNode {
  const shown = doc.headings.filter((heading) => heading.depth <= 3);
  return (
    <nav aria-label="On this page" data-testid="on-this-page">
      <Stack gap="xs">
        <Overline>On this page</Overline>
        <ul className="flex flex-col gap-1 text-sm/6">
          {shown.map((heading) => (
            <li key={heading.id} className={heading.depth === 3 ? "pl-3" : undefined}>
              <TextLink href={`#${heading.id}`}>{heading.text}</TextLink>
            </li>
          ))}
        </ul>
      </Stack>
    </nav>
  );
}

/** A PixelSlash repository document as a page: its own first heading as the h1, then its contents and body. */
export function DocPage({ doc }: { doc: Doc }): ReactNode {
  return (
    <ProseLayout title={doc.title} gap="lg">
      <OnThisPage doc={doc} />
      <DocBody doc={doc} />
    </ProseLayout>
  );
}
