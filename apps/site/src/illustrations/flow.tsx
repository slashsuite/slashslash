import { Pill, Text } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import type { FlowNode } from "#/content/how-it-works";
import { STAGES, STAGE_TONE } from "#/content/stages";
import { Rich } from "#/shell/rich-text";

/*
 * The /how-it-works flow diagram, drawn as boxes in an ordered list (flow.css places them). One item per
 * step, in order, each with its number, optional circular role avatar, label, role and rule, and the tool
 * at that step. A step that runs today has a solid outline; a planned one a dashed outline and a Planned
 * pill. The arrows are decoration. On a phone, and at 200% zoom, the steps stack top to bottom; on desktop
 * they run left to right in two 5-step rows, with the planned branches (6a, 7a) directly beneath their steps.
 */

/** A down arrow; flow.css turns it to point right where the next step is beside this one. */
function Arrow(): ReactNode {
  return (
    <span className="flow-arrow" aria-hidden="true">
      <svg viewBox="0 0 16 24" width="16" height="24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 2v18M2 14l6 6 6-6" />
      </svg>
    </span>
  );
}

function Node({ node, last }: { node: FlowNode; last: boolean }): ReactNode {
  const planned = node.stage === "planned";
  return (
    <li
      data-node={node.id}
      data-stage={node.stage}
      className={`flow-node min-w-0 space-y-2 rounded-lg border-2 border-[var(--hc-line)] bg-[var(--hc-surface)] p-3 ${planned ? "border-dashed" : ""}`}
    >
      <span className="flex flex-wrap items-center gap-2">
        <span className="flow-num">{node.id}</span>
        {node.roleId === undefined ? null : (
          <img
            src={`/how-it-works/${node.roleId}.webp`}
            alt=""
            aria-hidden="true"
            width={32}
            height={32}
            loading="lazy"
            decoding="async"
            className="h-8 w-8 shrink-0 rounded-full border border-[var(--hc-line)] object-cover object-top"
          />
        )}
        <Text as="span" strong>
          {node.label}
        </Text>
        {planned ? <Pill tone={STAGE_TONE.planned}>{STAGES.planned.label}</Pill> : null}
      </span>
      <Text>{node.role}</Text>
      <Text tone="muted" breakWords>
        <Rich text={typeof node.tool === "string" ? node.tool : node.tool.text} />
      </Text>
      {last ? null : <Arrow />}
    </li>
  );
}

export function FlowDiagram({ nodes, caption }: { nodes: readonly FlowNode[]; caption: string }): ReactNode {
  return (
    <figure className="m-0 space-y-6">
      <ol className="flow">
        {nodes.map((node, index) => (
          <Node key={node.id} node={node} last={index === nodes.length - 1} />
        ))}
      </ol>
      <figcaption>
        <Text tone="muted">{caption}</Text>
      </figcaption>
    </figure>
  );
}
