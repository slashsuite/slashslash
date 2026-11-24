import { SiteSearch } from "@slashsuite/ui-react";
import type { ComponentProps, ReactNode } from "react";
import { Island } from "#/shell/island";

/** The kit's SiteSearch as an eager island that reports its hydration (see Island). */
export function SearchIsland(props: ComponentProps<typeof SiteSearch>): ReactNode {
  return (
    <Island>
      <SiteSearch {...props} />
    </Island>
  );
}
