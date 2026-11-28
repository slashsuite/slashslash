import { Text } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { type FactsProduct, licenceLine } from "#/content/facts";

/**
 * A product page's licence line, in the product's facts file's own words, read from the file at the pinned
 * commit. facts.built.test.ts finds every one by its data-licence-line and holds it to the file. On its own
 * it is a muted line under a hero; `inline` gives the words alone, in the ink around them, for a card body
 * that must read as its neighbours do.
 */
export function LicenceLine({ product, inline = false }: { product: FactsProduct; inline?: boolean }): ReactNode {
  const words = <span data-licence-line={product}>{licenceLine(product)}</span>;
  if (inline) return words;
  return <Text tone="muted">{words}</Text>;
}
