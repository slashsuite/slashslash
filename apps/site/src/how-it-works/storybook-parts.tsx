import type { ReactNode, SVGProps } from "react";
import { PALETTE as P } from "#/how-it-works/storybook-data";

export const INK_STROKE: Pick<SVGProps<SVGElement>, "stroke" | "strokeWidth" | "strokeLinecap" | "strokeLinejoin"> = {
  stroke: P.ink,
  strokeWidth: 2.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/** Shared warm paper baseline at y=364 across all eight scenes. */
export function GroundLine(): ReactNode {
  return <line x1={42} y1={364} x2={758} y2={364} stroke={P.taupe} strokeWidth={2.5} strokeLinecap="round" />;
}

/**
 * The recurring blue-with-orange-band story token passed from Muse to Architect, Builder,
 * Checks, and Sentinel, collecting up to three green check seals along the way.
 */
export function StoryToken({
  seals = 0,
  sealClasses,
}: {
  seals?: 0 | 1 | 2 | 3;
  sealClasses?: readonly [string, string, string];
}): ReactNode {
  const xs = [13, 28, 43];
  return (
    <g>
      <rect x={0} y={0} width={56} height={42} rx={7} fill={P.periwinkle} {...INK_STROKE} />
      <rect x={22} y={0} width={12} height={42} fill={P.terracotta} stroke={P.ink} strokeWidth={2} />
      <polyline points="2,4 28,22 54,4" fill="none" stroke={P.ink} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      {xs.slice(0, seals).map((cx, i) => (
        <circle
          key={cx}
          className={sealClasses?.[i]}
          cx={cx}
          cy={31}
          r={5.5}
          fill={P.sage}
          stroke={P.white}
          strokeWidth={1.8}
        />
      ))}
    </g>
  );
}

/** Compact Owner figure used at both the start (Scene 1) and the live rollout finale (Scene 8). */
export function OwnerFigure({ label = "Owner" }: { label?: string }): ReactNode {
  return (
    <g>
      <ellipse cx={44} cy={186} rx={36} ry={7} fill={P.taupe} />
      <path d="M22 182 L24 128 Q44 114 64 128 L66 182 Z" fill={P.taupeLight} {...INK_STROKE} />
      <path d="M18 124 Q44 106 70 124 L66 146 L22 146 Z" fill={P.ink} {...INK_STROKE} />
      <rect x={39} y={102} width={10} height={14} rx={3} fill={P.white} {...INK_STROKE} />
      <circle cx={44} cy={88} r={19} fill={P.white} {...INK_STROKE} />
      <path d="M26 84 Q34 65 56 71 Q63 75 61 83 Q51 77 36 81 Z" fill={P.ink} />
      <g className="sb-blink">
        <circle cx={41} cy={88} r={1.9} fill={P.ink} />
        <circle cx={52} cy={88} r={1.9} fill={P.ink} />
      </g>
      <path d="M42 96 Q47 100 52 96" fill="none" stroke={P.ink} strokeWidth={2} strokeLinecap="round" />
      <text x={44} y={214} textAnchor="middle" fontSize={16} fontWeight={700} fill={P.inkSoft}>
        {label}
      </text>
    </g>
  );
}
