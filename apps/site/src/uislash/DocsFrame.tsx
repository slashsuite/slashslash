import { DocsLayout, type DocsHeading, type DocsNeighbour } from "@slashsuite/ui-react";
import { componentSections } from "@uislash-src/packages/ui-react/docs/components/index";
import type { ReactNode } from "react";
import { InlineCode } from "./docs/InlineCode";

const plain = (path: string): string => {
  const clean = path.replace(/\.html$/, "").replace(/(^|\/)index$/, "");
  return clean.length > 1 ? clean.replace(/\/+$/, "") : clean || "/";
};

/** The /uislash pages' frame: a `DocsLayout` whose nav is Getting started, then the components grouped by section. */
export function DocsFrame({
  pathname,
  title,
  description,
  contents,
  previous,
  next,
  children,
}: {
  pathname: string;
  title: ReactNode;
  description?: string | undefined;
  contents?: DocsHeading[] | undefined;
  previous?: DocsNeighbour | undefined;
  next?: DocsNeighbour | undefined;
  children: ReactNode;
}): ReactNode {
  const here = plain(pathname);
  const nav = [
    { items: [{ label: "Getting started", href: "/uislash", selected: here === "/uislash" }] },
    ...componentSections.map((section) => ({
      title: section.title,
      items: section.pages.map((page) => ({
        label: page.name,
        href: `/uislash/${page.slug}`,
        selected: here === `/uislash/${page.slug}`,
      })),
    })),
  ];
  return (
    <DocsLayout
      nav={nav}
      navLabel="All components"
      title={title}
      description={description !== undefined ? <InlineCode text={description} /> : undefined}
      contents={contents}
      previous={previous}
      next={next}
    >
      {children}
    </DocsLayout>
  );
}
