import { Callout, SubsectionHeading, Table, TableBody, TableCell, TableRow, Text } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { Evidence } from "#/developers/evidence";
import { DevSection } from "#/developers/section";
import { CombinationGrid } from "#/illustrations/combinations";

/*
 * What one flag does: the made-up note as one kit Table, the combination problem beside its drawing, and
 * the catch. Static: the counts are the final numbers, and only the drawing moves, through Motion.
 */

const DIFF: readonly { sign: string; kind: string; key: string; value: string }[] = [
  { sign: "~", kind: "page", key: "/checkout", value: "looks different" },
  { sign: "+", kind: "size", key: "bundle", value: "the code behind the flag adds to it" },
  { sign: "!", kind: "test", key: "checkout", value: "fails only with the flag on" },
];

function Stat({ count, text, lit }: { count: string; text: string; lit?: boolean }): ReactNode {
  return (
    <p className="mt-5">
      <span
        className={`block text-6xl leading-none font-extrabold tracking-tight tabular-nums sm:text-8xl ${lit ? "text-[var(--hc-accent)]" : ""}`}
      >
        {count}
      </span>
      <span className="mt-1 block max-w-md">
        <Text as="span" tone="muted">
          {text}
        </Text>
      </span>
    </p>
  );
}

export function Flags(): ReactNode {
  return (
    <DevSection
      id="flags"
      title="What does turning this flag on do?"
      lead="With all four built and connected, the answer could be a short note per flag."
    >
      <div className="max-w-3xl">
        <Evidence kind="made-up" tag="Made up: no tool produces this today">
          <Table label="flag new-checkout: off -> on">
            <TableBody>
              {DIFF.map((row) => (
                <TableRow key={row.kind} data-sign={row.sign}>
                  <TableCell mono>
                    <span aria-hidden="true">{row.sign}</span>
                  </TableCell>
                  <TableCell mono>{row.kind}</TableCell>
                  <TableCell mono>{row.key}</TableCell>
                  <TableCell>
                    {/* An element, not bare text: the kit gives a text cell a 12rem floor, too wide for a phone. */}
                    <span>{row.value}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Evidence>
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16" data-lit>
        <div>
          <SubsectionHeading size="lg">The combination problem</SubsectionHeading>
          <Stat count="1,024" text="on and off combinations of 10 flags, too many to run." />
          <Stat
            count="11"
            lit
            text="runs measure each flag alone against a baseline, which misses what goes wrong only when flags interact."
          />
        </div>
        <CombinationGrid />
      </div>

      <Callout>
        <strong>A runtime flag usually ships both versions of the code.</strong> Builds with the flag on and off can
        be the same size, so what can be measured is the code behind the flag.
      </Callout>
    </DevSection>
  );
}
