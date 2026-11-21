import { CodeExample } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { InlineCode } from "./InlineCode";
import { findStory } from "./stories";

/**
 * A real story rendered, with its source attached under it in one frame. An unknown `of` fails the
 * build. The preview is server-rendered HTML and `inert`: it is a picture, so it takes no focus and
 * no click. `copy` adds the copy button to the source; the page body is never hydrated, so it works
 * through `copyScript` in the layout.
 */
export function Example({ of, copy = false }: { of: string; copy?: boolean }): ReactNode {
  const story = findStory(of);
  if (story === undefined) throw new Error(`<Example of="${of}">: no such story with a render`);
  const { Story, code, caption } = story;
  return (
    <CodeExample
      data-uislash-example={of}
      code={code}
      copy={copy}
      caption={caption ? <InlineCode text={caption} /> : undefined}
    >
      <div inert data-uislash-preview={of}>
        <Story />
      </div>
    </CodeExample>
  );
}
