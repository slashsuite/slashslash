import { Card, Icon, Stack, SubsectionHeading, Text, TextLink } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { EXTRA_NAV, GROUPS, LISTED_PAGES } from "#/pixelslash/doc/docs-map";
import { DOCS } from "#/pixelslash/doc/resolve-links";

/** A group with more than this many listed links spans the row and lists them in two columns. */
const LONG_GROUP = 8;

/**
 * The /pixelslash/docs landing's groups, in `GROUPS` order, on a two-column grid, ported from
 * PixelSlash's site. A group with more than 8 listed links spans the row and lists its links in two
 * columns; Get started spans the first row. The rest pair up: walking in order, a group that would
 * sit alone in a row (the next group spans, or it is the last) spans too, so no half row is left
 * empty. Each group is a grid of its heading over a card that fills the rest, so the cards in one
 * row end level. Each link is the quiet ink with an accent chevron, so the landing is not a wall of
 * accent where everything looks clickable at once. A site page that sits in the docs nav (`EXTRA_NAV`) is a link in its group's card
 * after the group's pages, drawn as a page link is, and counts towards the group's length.
 */
export function DocsGroupGrid(): ReactNode {
  const links = GROUPS.map((group) => [
    ...LISTED_PAGES.filter((page) => page.group === group.id).map((page) => ({
      key: page.slug,
      href: `${DOCS}/${page.slug}`,
      title: page.title,
    })),
    ...EXTRA_NAV.filter((extra) => extra.group === group.id).map((extra) => ({
      key: extra.href,
      href: extra.href,
      title: extra.title,
    })),
  ]);
  const long = links.map((list) => list.length > LONG_GROUP);
  const spans: boolean[] = [];
  let column = 0;
  GROUPS.forEach((_, index) => {
    const last = index === GROUPS.length - 1;
    const nextSpans = !last && long[index + 1] === true;
    const span = index === 0 || long[index] === true || (column === 0 && (last || nextSpans));
    spans.push(span);
    column = span ? 0 : column + 1;
    if (column === 2) column = 0;
  });
  return (
    <ul data-testid="docs-index" className="m-0 grid list-none gap-6 p-0 md:grid-cols-2">
      {GROUPS.map((group, index) => (
        <li
          key={group.id}
          className={spans[index] ? "grid grid-rows-[auto_1fr] md:col-span-2" : "grid grid-rows-[auto_1fr]"}
        >
          <div className="mb-3">
            <SubsectionHeading as="h2" size="lg">
              {group.title}
            </SubsectionHeading>
          </div>
          <Card>
            <Stack gap="xs">
              <Text as="p">{group.summary}</Text>
              <ul className={long[index] ? "flex flex-col gap-1 md:block md:columns-2 md:gap-x-6" : "flex flex-col gap-1"}>
                {links[index]?.map((link) => (
                  <li key={link.key} className={long[index] ? "break-inside-avoid md:mb-1" : undefined}>
                    <TextLink href={link.href} tone="quiet" data-testid="docs-index-link">
                      {link.title}
                      <span className="ml-1 inline-block align-[-0.1em]" data-testid="docs-index-marker">
                        <Icon name="chevron-right" size="sm" tone="accent" />
                      </span>
                    </TextLink>
                  </li>
                ))}
              </ul>
            </Stack>
          </Card>
        </li>
      ))}
    </ul>
  );
}
