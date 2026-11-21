import { CodeBlock, Pill, Text } from "@slashsuite/ui-react";
import type { ReactNode } from "react";

type EvidenceKind = "real" | "quoted" | "made-up" | "idea";

const TAGS: Record<Exclude<EvidenceKind, "idea">, string> = {
  real: "Real output, captured by running it",
  quoted: "Printed in its docs, not re-run here",
  "made-up": "Made up",
};

/**
 * What the reader is looking at, shown the same way everywhere: a solid frame for output that exists,
 * a dashed one for anything imagined, and the words saying which on every one. On a phone it takes half
 * the page's gutter, so the FS_ table fits without scrolling sideways.
 */
export function Evidence({
  kind,
  title,
  tag,
  children,
}: {
  kind: EvidenceKind;
  title?: string | undefined;
  /** Replaces the standard words when the label needs to say more. */
  tag?: string;
  children: ReactNode;
}): ReactNode {
  const imagined = kind === "idea" || kind === "made-up";
  return (
    <figure
      data-kind={kind}
      className={`-mx-2 min-w-0 space-y-3 rounded-lg border border-[var(--hc-line)] p-2 sm:mx-0 sm:p-3 ${imagined ? "border-dashed" : ""}`}
    >
      <figcaption className="flex flex-wrap items-center gap-2">
        {kind === "idea" ? (
          <Pill>Planned</Pill>
        ) : (
          <Text as="span" strong>
            {tag ?? TAGS[kind]}
          </Text>
        )}
        {title === undefined ? null : (
          <Text as="span" tone="muted">
            {title}
          </Text>
        )}
      </figcaption>
      {children}
    </figure>
  );
}

/** A run of terminal lines: commands (`$ ` lines) or the output between them. */
type Run = { command: boolean; lines: string[] };

/** Terminal lines cut into runs, in order: each run of commands, then the output it printed. */
function runsOf(lines: readonly string[]): Run[] {
  const runs: Run[] = [];
  for (const line of lines) {
    const command = line.startsWith("$ ");
    const last = runs.at(-1);
    if (last?.command === command) last.lines.push(line);
    else runs.push({ command, lines: [line] });
  }
  return runs;
}

/**
 * A terminal session as kit CodeBlocks: each run of commands in a block with a copy button (a console
 * block, so the `$ ` is dimmed and left out of the copy), and each run of output in a block without one.
 */
export function Terminal({ lines, tool }: { lines: readonly string[]; tool: string }): ReactNode {
  return (
    <div className="space-y-2">
      {runsOf(lines).map((run, i) =>
        run.command ? (
          // Runs repeat in real output; their place in the list is their identity.
          <CodeBlock key={i} label="command" language="console" lines={run.lines} copy />
        ) : (
          <CodeBlock key={i} label="output" aria-label={`${tool} output`} lines={run.lines} />
        ),
      )}
    </div>
  );
}
