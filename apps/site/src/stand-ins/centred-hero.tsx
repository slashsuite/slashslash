// Stands in for @slashsuite/ui-react Hero centred and Cluster justify="center" (HC-331): the kit's Hero
// sits at its parent's left edge and a Cluster cannot centre its row. CentredHero centres the Hero's
// column and its text; CentredRow centres a row of actions under it. Layout only: the Hero, its glow
// and every colour are the kit's.
import { Hero } from "@slashsuite/ui-react";
import type { ComponentProps, ReactNode } from "react";

export function CentredHero(props: ComponentProps<typeof Hero>): ReactNode {
  return (
    <div className="mx-auto flex max-w-3xl justify-center text-center">
      <Hero {...props} />
    </div>
  );
}

/** A row of items centred on the line, wrapping on a phone, the kit's sm gap apart. */
export function CentredRow({ children }: { children: ReactNode }): ReactNode {
  return <div className="flex flex-wrap items-center justify-center gap-3">{children}</div>;
}
