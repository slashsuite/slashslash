import { Text } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { type FactsProduct, licenceLine } from "#/content/facts";

/**
 * A product page's licence line, in the product's facts file's own words, read from the file at the pinned
 * commit. facts.built.test.ts finds every one by its data-licence-line and holds it to the file.
 */
export function LicenceLine({ product }: { product: FactsProduct }): ReactNode {
  return (
    <Text tone="muted">
      <span data-licence-line={product}>{licenceLine(product)}</span>
    </Text>
  );
}
