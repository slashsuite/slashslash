import { Card, CardGrid, Pill, Stack, Text, TextLink } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import type { FactsProduct } from "#/content/facts";
import { PRODUCTS } from "#/content/products";
import { STAGES, STAGE_TONE } from "#/content/stages";
import { DevSection } from "#/developers/section";
import { Rich } from "#/shell/rich-text";

/** /developers: a card per product with its full summary, licence line, and link to its page. */
export function ToolsInDetail({ licences }: { licences: Record<FactsProduct, string> }): ReactNode {
  return (
    <DevSection id="tools-detail" title="Every product in detail">
      <CardGrid columns={2} align="start">
        {PRODUCTS.map((product) => (
          <Card
            key={product.name}
            as="article"
            size="lg"
            title={product.name}
            titleStyle="name"
            data-status={product.stage}
            status={
              <Pill tone={STAGE_TONE[product.stage]} dot round data-status-for={product.name}>
                {STAGES[product.stage].label}
              </Pill>
            }
          >
            <Stack gap="sm">
              <Text tone="muted">{STAGES[product.stage].sentence}</Text>
              <Text strong>{product.question.text}</Text>
              {product.summary.map((paragraph) => (
                <Text key={paragraph.text}>
                  <Rich text={paragraph.text} />
                </Text>
              ))}
              {product.facts ? (
                <Text tone="muted">
                  <span data-licence-line={product.facts}>{licences[product.facts]}</span>
                </Text>
              ) : null}
              {product.page ? (
                <Text>
                  <TextLink href={product.page}>More about {product.name}</TextLink>
                </Text>
              ) : null}
            </Stack>
          </Card>
        ))}
      </CardGrid>
    </DevSection>
  );
}
