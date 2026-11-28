import { Card, Icon, Stack, SubsectionHeading, Text, TextLink } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { EXTRA_NAV, GROUPS, LISTED_PAGES } from "#/pixelslash/doc/docs-map";
import { DOCS } from "#/pixelslash/doc/resolve-links";

/** A group with more than this many listed links always spans the row. */
const LONG_GROUP = 8;

/** A group that spans the row lists its links in two columns when it has more than this many. */
const TWO_COLUMN_LIST = 4;

/**
 * Two groups share a row only when the shorter has at least this share of the longer's links, so a
 * card with one link never stands beside a full one with its lower half empty.
 */
const PAIR_RATIO = 0.5;

/**
 * Which groups span the row, walking in order: Get started and every long group span; any other
 * group pairs with the next one when neither is long and their lengths are close (`PAIR_RATIO`), and
 * spans otherwise. So no group sits alone in half a row, and no row holds a near-empty card beside
 * a full one.
 */
export function groupSpans(lengths: readonly number[]): boolean[] {
  const spans: boolean[] = [];
  let index = 0;
  while (index < lengths.length) {
    const here = lengths[index] ?? 0;
    const next = lengths[index + 1];
    const pairs =
      index > 0 &&
      here <= LONG_GROUP &&
      next !== undefined &&
      next <= LONG_GROUP &&
      Math.min(here, next) >= PAIR_RATIO * Math.max(here, next);
    if (pairs) {
      spans.push(false, false);
      index += 2;
    } else {
      spans.push(true);
      index += 1;
    }
  }
  return spans;
}

/**
 * The /pixelslash/docs landing's groups, in `GROUPS` order, on a two-column grid, ported from
 * PixelSlash's site. Which groups share a row is `groupSpans`'s; a group that spans the row lists
 * more than 4 links in two columns. Each group is a grid of its heading over a card that fills the
 * rest, so the cards in one row end level. Each link is the quiet ink with an accent chevron, so the landing is not a wall of
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
  const spans = groupSpans(links.map((list) => list.length));
  const long = links.map((list, index) => spans[index] === true && list.length > TWO_COLUMN_LIST);
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
          <Card data-testid="docs-group-card">
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
