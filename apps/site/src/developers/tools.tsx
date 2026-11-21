import { Card, CardGrid, Pill, Stack, SubsectionHeading, Text, TextLink } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { PRODUCTS, type Product } from "#/content/products";
import { TOGGLESLASH_REPO_URL } from "#/content/site";
import { STAGES, STAGE_TONE } from "#/content/stages";
import { DevSection } from "#/developers/section";
import { Rich } from "#/shell/rich-text";

/** "Not public yet" until the constant holds a URL, then the link in its place. */
function ToggleSlashAccess(): ReactNode {
  if (!TOGGLESLASH_REPO_URL) return <Text>Not public yet.</Text>;
  return (
    <Text>
      <TextLink href={TOGGLESLASH_REPO_URL} external>
        Repository on GitHub
      </TextLink>
    </Text>
  );
}

const IDEA_NOTES: Partial<Record<Product["name"], string>> = {
  BundleSlash:
    "Research so far is light and no tool has been tried. RelativeCI, Codecov Bundle Analysis and BundleMon are hosted, and bundle-stats is the closest open source tool found. It is not yet known whether one more tool is needed.",
};

function ToggleSlashDetail(): ReactNode {
  return (
    <>
      <SubsectionHeading as="h4" size="sm">
        The problem: flag debt
      </SubsectionHeading>
      <Text>Many flags stay on, and nobody knows what they do.</Text>
      <Text tone="muted">
        <strong>One team's experience with LaunchDarkly, in 2025:</strong> code-reference and cleanup features that
        barely worked for them, pricing that felt very high, limited seats, and usage so deep that moving off was nearly
        impossible. Things may have changed since, and it is not a claim about the market.
      </Text>
      <ToggleSlashAccess />
    </>
  );
}

/** /developers: a card per tool with its full summary, ToggleSlash's detail and the research notes. */
export function ToolsInDetail(): ReactNode {
  return (
    <DevSection id="tools-detail" title="The tools in detail">
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
              {product.name === "ToggleSlash" ? <ToggleSlashDetail /> : null}
              {IDEA_NOTES[product.name] ? <Text>{IDEA_NOTES[product.name]}</Text> : null}
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
