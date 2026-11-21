import { CodeBlock, Stack, Text } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import type { TryStep } from "#/content/flakeslash";

/*
 * A tool home's two islands, the copy blocks, in a module of their own so their browser bundle carries
 * neither the rest of the page nor the facts files its licence line reads.
 */

/** The hero's command, with a copy button. */
export function HeroCode({ command }: { command: string }): ReactNode {
  return <CodeBlock label="bash" language="bash" overflow="wrap" lines={[command]} copy />;
}

/** Each try-it step: its lead line, where it has one, and its commands in one block with a copy button. */
export function TryIt({ steps }: { steps: readonly TryStep[] }): ReactNode {
  return (
    <Stack gap="lg">
      {steps.map((step) => (
        <Stack key={step.commands.join("\n")} gap="sm">
          {step.lead === undefined ? null : <Text>{step.lead}</Text>}
          <CodeBlock label="bash" language="bash" overflow="wrap" lines={[...step.commands]} copy />
        </Stack>
      ))}
    </Stack>
  );
}
