import type { SiteSearchItem } from "@slashsuite/ui-react";
import { componentPages } from "@uislash-src/packages/ui-react/docs/components/index";

/** Every UISlash component page, in rail order, for the header's SiteSearch dialog. */
export const UISLASH_SEARCH_ITEMS: readonly SiteSearchItem[] = componentPages.map((page) => ({
  label: page.name,
  description: page.summary.replaceAll("`", ""),
  href: `/uislash/${page.slug}`,
  keywords: page.api,
}));
