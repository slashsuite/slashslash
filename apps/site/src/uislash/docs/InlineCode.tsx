import { Code } from "@slashsuite/ui-react";
import { Fragment, type ReactNode } from "react";

/**
 * Text with `backticked` runs drawn as `Code`, as a list of parts. Put straight into a `TableCell`,
 * the plain words stay visible to it, so the cell reads as prose and wraps.
 */
export function inlineCode(text: string): ReactNode[] {
  return text.split("`").map((part, i) =>
    // The odd parts are between backticks.
    i % 2 === 1 ? <Code key={i}>{part}</Code> : <Fragment key={i}>{part}</Fragment>,
  );
}

/** Text with `backticked` runs drawn as `Code`: how a prop's JSDoc and the page copy name code. */
export function InlineCode({ text }: { text: string }): ReactNode {
  return <>{inlineCode(text)}</>;
}
