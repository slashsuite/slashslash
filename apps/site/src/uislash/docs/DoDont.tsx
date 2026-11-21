import { Pill, Stack } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { Example } from "./Example";
import { pairOf } from "./pairs";
import type { DocStory } from "./stories";

const SIDE = {
  positive: "Do",
  danger: "Don't",
} as const;

/** One side: a pill, the framed example, its caption. Both sides are this, so they line up. */
function Side({ story, tone }: { story: DocStory; tone: "positive" | "danger" }): ReactNode {
  return (
    <Stack gap="xs">
      <div>
        <Pill tone={tone}>{SIDE[tone]}</Pill>
      </div>
      <Example of={story.id} copy={tone === "positive"} />
    </Stack>
  );
}

/**
 * The right way, then the wrong way under it, each at the page's full width so neither example nor
 * its code clips or wraps, from the stories `Do<Topic>` and `Dont<Topic>` of `of="<File>/<Topic>"`.
 * A topic with only one side shows just that one. A topic with neither fails the build.
 */
export function DoDont({ of }: { of: string }): ReactNode {
  const { do: right, dont: wrong } = pairOf(of);
  if (right === undefined && wrong === undefined) {
    throw new Error(`<DoDont of="${of}">: neither Do nor Dont story has a render`);
  }
  if (right === undefined && wrong !== undefined) return <Side story={wrong} tone="danger" />;
  if (wrong === undefined && right !== undefined) return <Side story={right} tone="positive" />;
  if (right === undefined || wrong === undefined) return null;
  return (
    <Stack gap="md">
      <Side story={right} tone="positive" />
      <Side story={wrong} tone="danger" />
    </Stack>
  );
}
