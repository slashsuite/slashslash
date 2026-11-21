// Stands in for @slashsuite/ui-react link columns: a footer's lead block, then its titled columns of
// links, side by side from md and stacked on a phone. Layout only; every colour is the kit's.
import { Caption, Stack } from "@slashsuite/ui-react";
import type { ReactNode } from "react";

export type FooterColumn = {
  title: string;
  /** Each entry one line: a link, or plain text for one with nowhere to go. */
  items: ReactNode[];
};

export function FooterColumns({ lead, columns }: { lead: ReactNode; columns: FooterColumn[] }): ReactNode {
  return (
    <div className="grid gap-8 py-4 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
      <Stack gap="sm">{lead}</Stack>
      {columns.map((column) => (
        <Stack key={column.title} gap="xs">
          <Caption as="h2">{column.title}</Caption>
          <Stack as="ul" gap="xs">
            {column.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </Stack>
        </Stack>
      ))}
    </div>
  );
}
