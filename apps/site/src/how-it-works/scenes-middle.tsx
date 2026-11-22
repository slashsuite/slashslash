import type { ReactNode } from "react";
import { PALETTE as P } from "#/how-it-works/storybook-data";
import { GroundLine, INK_STROKE, StoryToken } from "#/how-it-works/storybook-parts";

/* ==========================================================================
   SCENE 3: CHECKER -> VERIFY & STAMP GO
   ========================================================================== */

function CheckerDeskAndTicket(): ReactNode {
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
            <text x={0} y={6} textAnchor="middle" fontSize={17} fontWeight={800} fill={P.terracotta}>
              GO
            </text>
          </g>
        </g>
      </g>
    </g>
  );
}

function CheckerFigure(): ReactNode {
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
        Checker
      </text>
    </g>
  );
}

function OmniGate(): ReactNode {
  return (
    <g transform="translate(432 148)">
      <path
        className="sb-chk-lane-arrow"
        d="M36 184 L312 184"
        fill="none"
        stroke={P.taupe}
        strokeWidth={3}
        strokeDasharray="6 6"
        strokeLinecap="round"
      />
      <path d="M304 177 L314 184 L304 191" fill="none" stroke={P.taupe} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={122} y={88} width={34} height={128} rx={6} fill={P.taupeLight} {...INK_STROKE} />
      <circle className="sb-chk-gate-lamp" cx={139} cy={110} r={9} fill={P.sage} {...INK_STROKE} />
      <g transform="translate(234 162)">
        <g className="sb-chk-ticket-pass">
          <StoryToken seals={1} sealClasses={["sb-chk-seal", "", ""]} />
        </g>
      </g>
      <g transform="translate(148 108)">
        <g transform="rotate(-48)">
          <g className="sb-chk-gate-arm">
            <rect x={-6} y={-7} width={122} height={14} rx={7} fill={P.white} {...INK_STROKE} />
            <line x1={22} y1={-7} x2={12} y2={7} stroke={P.terracotta} strokeWidth={5} />
            <line x1={54} y1={-7} x2={44} y2={7} stroke={P.terracotta} strokeWidth={5} />
            <line x1={86} y1={-7} x2={76} y2={7} stroke={P.terracotta} strokeWidth={5} />
            <circle cx={0} cy={0} r={4} fill={P.ink} />
          </g>
        </g>
      </g>
      <rect x={200} y={184} width={18} height={32} rx={4} fill={P.taupeLight} {...INK_STROKE} />
      <text x={166} y={242} textAnchor="middle" fontSize={16} fontWeight={700} fill={P.ink}>
        OmniSlash gate
      </text>
      <g transform="translate(106 -58)">
        <g className="sb-chk-gate-badge">
          <rect x={0} y={0} width={142} height={36} rx={18} fill={P.sageSoft} stroke={P.sage} strokeWidth={2.2} />
          <text x={71} y={24} textAnchor="middle" fontSize={16} fontWeight={800} fill={P.ink}>
            Go recorded
          </text>
        </g>
      </g>
    </g>
  );
}

export function SceneChecker(): ReactNode {
  return (
    <g>
      <GroundLine />
      <CheckerDeskAndTicket />
      <CheckerFigure />
      <OmniGate />
    </g>
  );
}
