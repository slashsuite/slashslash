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
 * The recurring blue-with-orange-band story ticket passed from Muse to Architect, Checker,
 * and Builder before it is built into a physical package.
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

/**
 * Physical 3D wrapped package that replaces the paper ticket once Builder has built it,
 * making the shift from planned idea to tangible shipped artifact unmistakable.
 */
export function BuiltPackage({
  seals = 0,
  sealClasses,
}: {
  seals?: 0 | 1 | 2 | 3;
  sealClasses?: readonly [string, string, string];
}): ReactNode {
  const sealPos = [
    { cx: 15, cy: 42 },
    { cx: 32, cy: 49 },
    { cx: 49, cy: 42 },
  ] as const;
  return (
    <g>
      <polygon points="32,4 60,17 32,30 4,17" fill={P.periwinkleSoft} {...INK_STROKE} />
      <polygon points="4,17 32,30 32,60 4,47" fill={P.periwinkle} {...INK_STROKE} />
      <polygon points="32,30 60,17 60,47 32,60" fill={P.periwinkle} {...INK_STROKE} />
      <polygon points="32,30 60,17 60,47 32,60" fill={P.ink} fillOpacity={0.14} />
      <polygon points="14,12.4 22,8.6 50,21.6 42,25.4" fill={P.terracotta} stroke={P.ink} strokeWidth={1.8} strokeLinejoin="round" />
      <polygon points="42,25.4 50,21.6 50,51.6 42,55.4" fill={P.terracotta} stroke={P.ink} strokeWidth={1.8} strokeLinejoin="round" />
      <polygon points="42,8.6 50,12.4 22,25.4 14,21.6" fill={P.terracotta} stroke={P.ink} strokeWidth={1.8} strokeLinejoin="round" />
      <polygon points="14,21.6 22,25.4 22,55.4 14,51.6" fill={P.terracotta} stroke={P.ink} strokeWidth={1.8} strokeLinejoin="round" />
      <ellipse cx={32} cy={17} rx={6} ry={3.5} fill={P.terracottaSoft} stroke={P.ink} strokeWidth={1.6} />
      {sealPos.slice(0, seals).map((pos, i) => (
        <circle
          key={pos.cx}
          className={sealClasses?.[i]}
          cx={pos.cx}
          cy={pos.cy}
          r={5.5}
          fill={P.sage}
          stroke={P.white}
          strokeWidth={1.8}
        />
      ))}
    </g>
  );
}

const INBOX_SLOTS_4 = [
  "translate(10 14) rotate(-8) scale(0.76)",
  "translate(52 8) rotate(-1) scale(0.76)",
  "translate(98 14) rotate(7) scale(0.76)",
  "translate(56 26) rotate(3) scale(0.78)",
] as const;

const INBOX_SLOTS_5 = [
  "translate(8 12) rotate(-8) scale(0.74)",
  "translate(54 6) rotate(-1) scale(0.74)",
  "translate(102 12) rotate(7) scale(0.74)",
  "translate(28 25) rotate(-3) scale(0.76)",
  "translate(80 25) rotate(4) scale(0.76)",
] as const;

/** Shared OmniSlash role inbox tray holding four or five tickets behind its cutaway lip. */
export function RoleInboxStack({
  label = "Architect inbox",
  ticketCount = 5,
  badgeCount = ticketCount,
  seals = 0,
  ticketClasses,
  badgeClass,
}: {
  label?: string;
  ticketCount?: 4 | 5;
  badgeCount?: number;
  seals?: 0 | 1;
  ticketClasses?: readonly string[];
  badgeClass?: string;
}): ReactNode {
  const slots = ticketCount === 5 ? INBOX_SLOTS_5 : INBOX_SLOTS_4;
  return (
    <g>
      <rect x={0} y={40} width={156} height={60} rx={9} fill={P.white} {...INK_STROKE} />
      {slots.map((transform, i) => (
        <g key={transform} transform={transform}>
          <g className={ticketClasses?.[i]}>
            <StoryToken seals={seals} />
          </g>
        </g>
      ))}
      <path
        d="M0 64 L44 64 L52 75 L104 75 L112 64 L156 64 L156 91 Q156 100 147 100 L9 100 Q0 100 0 91 Z"
        fill={P.taupeLight}
        {...INK_STROKE}
      />
      <text x={78} y={92} textAnchor="middle" fontSize={14} fontWeight={700} fill={P.ink}>
        {label}
      </text>
      <g transform="translate(148 40)">
        <g className={badgeClass}>
          <circle cx={0} cy={0} r={14} fill={P.terracotta} {...INK_STROKE} />
          <text x={0} y={5} textAnchor="middle" fontSize={14} fontWeight={800} fill={P.white}>
            {badgeCount}
          </text>
        </g>
      </g>
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
