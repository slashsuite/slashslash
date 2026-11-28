import type { ReactNode } from "react";
import { PALETTE as P } from "#/how-it-works/storybook-data";
import { GroundLine, INK_STROKE } from "#/how-it-works/storybook-parts";

/* ==========================================================================
   SCENE 3: COLD READ THE BRIEF
   ========================================================================== */

function ReviewerDeskAndTicket(): ReactNode {
  return (
    <g>
      <rect x={62} y={272} width={204} height={92} fill={P.taupeLight} {...INK_STROKE} />
      <rect x={54} y={262} width={220} height={14} rx={3} fill={P.white} {...INK_STROKE} />
      <g transform="translate(180 240)">
        <ellipse cx={24} cy={14} rx={25} ry={9} fill={P.white} {...INK_STROKE} />
        <ellipse cx={24} cy={12} rx={19} ry={6} fill={P.terracotta} {...INK_STROKE} />
      </g>
      <g transform="translate(88 116) rotate(-8)">
        <rect x={0} y={0} width={112} height={138} rx={8} fill={P.white} {...INK_STROKE} />
        <rect x={14} y={14} width={84} height={16} rx={4} fill={P.terracotta} />
        <path
          className="sb-chk-mark-1"
          pathLength={1}
          d="M18 52 L25 59 L37 44"
          fill="none"
          stroke={P.terracotta}
          strokeWidth={3.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1={46} y1={54} x2={94} y2={54} stroke={P.ink} strokeWidth={2.8} strokeLinecap="round" />
        <path
          className="sb-chk-mark-2"
          pathLength={1}
          d="M18 78 L25 85 L37 70"
          fill="none"
          stroke={P.terracotta}
          strokeWidth={3.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1={46} y1={80} x2={90} y2={80} stroke={P.ink} strokeWidth={2.8} strokeLinecap="round" />
        <path
          className="sb-chk-mark-3"
          pathLength={1}
          d="M18 104 L25 111 L37 96"
          fill="none"
          stroke={P.terracotta}
          strokeWidth={3.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1={46} y1={106} x2={82} y2={106} stroke={P.ink} strokeWidth={2.8} strokeLinecap="round" />
        <g transform="translate(76 92)">
          <g className="sb-chk-go-seal">
            <circle cx={0} cy={0} r={24} fill={P.terracottaSoft} stroke={P.terracotta} strokeWidth={3} />
            <text x={0} y={8} textAnchor="middle" fontSize={24} fontWeight={800} fill={P.terracotta}>
              ?
            </text>
          </g>
        </g>
      </g>
    </g>
  );
}

function ColdReaderFigure(): ReactNode {
  return (
    <g transform="translate(228 52)">
      <path d="M48 122 L-14 154 L-34 134" fill="none" stroke={P.ink} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M48 122 L-14 154 L-34 134" fill="none" stroke={P.white} strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={-36} cy={132} r={7.5} fill={P.white} {...INK_STROKE} />
      <path d="M44 218 L138 218 L146 312 L38 312 Z" fill={P.inkSoft} {...INK_STROKE} />
      <path d="M44 104 Q92 88 138 106 L138 218 L44 218 Z" fill={P.periwinkle} {...INK_STROKE} />
      <polygon points="72,102 92,130 112,102" fill={P.white} {...INK_STROKE} />
      <rect x={82} y={82} width={14} height={24} rx={4} fill={P.white} {...INK_STROKE} />
      <g className="sb-chk-head">
        <path
          d="M52 54 C42 36 58 14 84 14 C112 14 134 32 132 58 C134 72 122 80 114 78 L62 78 C50 80 44 68 52 54 Z"
          fill={P.white}
          {...INK_STROKE}
        />
        <path d="M68 48 C68 30 110 30 110 54 C110 74 100 88 88 88 C76 88 68 74 68 48 Z" fill={P.white} {...INK_STROKE} />
        <g className="sb-blink">
          <circle cx={81} cy={57} r={2.2} fill={P.ink} />
          <circle cx={96} cy={57} r={2.2} fill={P.ink} />
        </g>
        <path d="M84 70 Q89 74 94 70" fill="none" stroke={P.ink} strokeWidth={2} strokeLinecap="round" />
      </g>
      <g className="sb-chk-stamp-arm">
        <path d="M134 122 L92 174 L-38 158" fill="none" stroke={P.ink} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M134 122 L92 174 L-38 158" fill="none" stroke={P.white} strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={-42} cy={158} r={7.5} fill={P.white} {...INK_STROKE} />
        <path d="M-52 172 L-32 172 L-36 152 L-48 152 Z" fill={P.taupe} {...INK_STROKE} />
        <rect x={-58} y={172} width={32} height={8} rx={3} fill={P.terracotta} {...INK_STROKE} />
      </g>
      <text x={92} y={337} textAnchor="middle" fontSize={16} fontWeight={700} fill={P.inkSoft}>
        Reviewer
      </text>
    </g>
  );
}

const COLD_READ_PATHS = [
  { label: "Back to the Architect", fill: P.periwinkleSoft, stroke: P.periwinkle },
  { label: "Only you can answer", fill: P.goldSoft, stroke: P.gold },
  { label: "Small trial, then the ticket", fill: P.sageSoft, stroke: P.sage },
] as const;

/** Where an open question in the brief goes: back to the Architect, to you, or to a small trial. */
function OpenQuestionPaths(): ReactNode {
  return (
    <g transform="translate(450 118)">
      {COLD_READ_PATHS.map((path, i) => (
        <g key={path.label} className={`sb-cold-path-${i + 1}`}>
          <path
            d={`M-34 74 Q-10 ${i * 72 + 22} 14 ${i * 72 + 22}`}
            fill="none"
            stroke={P.taupe}
            strokeWidth={2.6}
            strokeDasharray="5 6"
            strokeLinecap="round"
          />
          <rect x={18} y={i * 72} width={292} height={44} rx={22} fill={path.fill} stroke={path.stroke} strokeWidth={2.2} />
          <text x={164} y={i * 72 + 28} textAnchor="middle" fontSize={16} fontWeight={800} fill={P.ink}>
            {path.label}
          </text>
        </g>
      ))}
    </g>
  );
}

export function SceneColdRead(): ReactNode {
  return (
    <g>
      <GroundLine />
      <ReviewerDeskAndTicket />
      <ColdReaderFigure />
      <OpenQuestionPaths />
    </g>
  );
}
