import type { ReactNode } from "react";
import { PALETTE as P } from "#/how-it-works/storybook-data";
import { GroundLine, INK_STROKE, OwnerFigure, RoleInboxStack } from "#/how-it-works/storybook-parts";

function Starburst({ cx, cy, r, className }: { cx: number; cy: number; r: number; className?: string }): ReactNode {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g className={className} stroke={P.terracotta} strokeWidth={2} strokeLinecap="round">
        <line x1={0} y1={-r} x2={0} y2={-r * 0.42} />
        <line x1={0} y1={r * 0.42} x2={0} y2={r} />
        <line x1={-r} y1={0} x2={-r * 0.42} y2={0} />
        <line x1={r * 0.42} y1={0} x2={r} y2={0} />
        <line x1={-r * 0.68} y1={-r * 0.68} x2={-r * 0.34} y2={-r * 0.34} />
        <line x1={r * 0.34} y1={r * 0.34} x2={r * 0.68} y2={r * 0.68} />
        <line x1={r * 0.68} y1={-r * 0.68} x2={r * 0.34} y2={-r * 0.34} />
        <line x1={-r * 0.34} y1={r * 0.34} x2={-r * 0.68} y2={r * 0.68} />
      </g>
    </g>
  );
}

/* ==========================================================================
   SCENE 1: IDEA & MUSE -> OMNISLASH ROLE INBOX
   ========================================================================== */

function OwnerSpark(): ReactNode {
  return (
    <g transform="translate(52 175)">
      <OwnerFigure label="Owner" />
      <g className="sb-muse-spark-bulb">
        <circle cx={90} cy={46} r={21} fill={P.goldSoft} stroke={P.terracotta} strokeWidth={2.2} />
        <path
          d="M90 34 C82 34 78 41 81 48 C83 51 84 53 85 56 L95 56 C96 53 97 51 99 48 C102 41 98 34 90 34 Z"
          fill={P.gold}
          stroke={P.ink}
          strokeWidth={2}
        />
        <line x1={86} y1={60} x2={94} y2={60} stroke={P.ink} strokeWidth={2} strokeLinecap="round" />
      </g>
      <path
        className="sb-muse-idea-trail"
        d="M116 48 Q164 26 218 52"
        fill="none"
        stroke={P.terracotta}
        strokeWidth={2.4}
        strokeDasharray="5 6"
        strokeLinecap="round"
      />
    </g>
  );
}

function MuseDeskCharacter(): ReactNode {
  return (
    <g transform="translate(216 86)">
      <Starburst cx={76} cy={38} r={11} className="sb-twinkle-a" />
      <Starburst cx={142} cy={22} r={13} className="sb-twinkle-b" />
      <Starburst cx={198} cy={40} r={10} className="sb-twinkle-c" />
      <path d="M98 40 L114 26 L124 44 Z" fill="none" stroke={P.terracotta} strokeWidth={1.6} className="sb-twinkle-a" />
      <circle cx={170} cy={28} r={3} fill={P.terracotta} className="sb-twinkle-c" />
      <rect x={44} y={142} width={52} height={82} rx={8} fill={P.ink} {...INK_STROKE} />
      <g className="sb-muse-head">
        <path d="M104 94 C94 114 90 132 106 140 L158 138 C166 122 162 102 154 90 Z" fill={P.ink} {...INK_STROKE} />
        <path d="M112 96 C112 72 154 72 154 98 C154 116 144 128 132 128 C120 128 112 116 112 96 Z" fill={P.white} {...INK_STROKE} />
        <path d="M110 92 C112 66 154 66 158 92 C148 80 126 84 110 92 Z" fill={P.ink} />
        <g className="sb-blink">
          <circle cx={129} cy={99} r={2.2} fill={P.ink} />
          <circle cx={143} cy={99} r={2.2} fill={P.ink} />
        </g>
        <path d="M132 111 Q137 115 142 111" fill="none" stroke={P.ink} strokeWidth={2.2} strokeLinecap="round" />
      </g>
      <path d="M118 128 L146 128 L148 144 L116 144 Z" fill={P.terracotta} {...INK_STROKE} />
      <g className="sb-muse-send-arm">
        <path d="M162 156 L204 170 L226 154" fill="none" stroke={P.ink} strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M162 156 L204 170 L226 154" fill="none" stroke={P.terracotta} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={228} cy={152} r={7} fill={P.white} {...INK_STROKE} />
      </g>
      <path d="M84 146 C96 134 156 134 168 150 L184 198 L72 198 Z" fill={P.terracotta} {...INK_STROKE} />
      <polygon points="32,204 268,184 268,196 32,216" fill={P.white} {...INK_STROKE} />
      <rect x={44} y={214} width={10} height={64} fill={P.taupeLight} {...INK_STROKE} />
      <rect x={242} y={196} width={10} height={82} fill={P.taupeLight} {...INK_STROKE} />
      <polygon points="104,197 190,189 208,205 122,213" fill={P.white} {...INK_STROKE} />
      <line x1={154} y1={193} x2={166} y2={209} stroke={P.ink} strokeWidth={2} />
      <path
        className="sb-muse-sketch"
        pathLength={1}
        d="M126 205 Q138 196 148 203 T162 200"
        fill="none"
        stroke={P.terracotta}
        strokeWidth={2.6}
        strokeLinecap="round"
      />
      <g className="sb-muse-draw-arm">
        <path d="M92 156 L124 190 L144 196" fill="none" stroke={P.ink} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M92 156 L124 190 L144 196" fill="none" stroke={P.terracotta} strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={148} cy={196} r={7} fill={P.white} {...INK_STROKE} />
        <line x1={149} y1={196} x2={136} y2={176} stroke={P.ink} strokeWidth={2.8} strokeLinecap="round" />
      </g>
      <circle cx={96} cy={156} r={10} fill={P.terracotta} />
      <text x={148} y={303} textAnchor="middle" fontSize={16} fontWeight={700} fill={P.inkSoft}>
        Muse
      </text>
    </g>
  );
}

const MUSE_ENVELOPE_CLASSES = [
  "sb-muse-envelope-1",
  "sb-muse-envelope-2",
  "sb-muse-envelope-3",
  "sb-muse-envelope-4",
  "sb-muse-envelope-5",
] as const;

function RoleInboxTray(): ReactNode {
  return (
    <g transform="translate(574 236)">
      <g className="sb-muse-inbox">
        <g transform="scale(1.08)">
          <RoleInboxStack
            label="Architect inbox"
            ticketCount={5}
            badgeCount={5}
            ticketClasses={MUSE_ENVELOPE_CLASSES}
            badgeClass="sb-muse-badge"
          />
        </g>
        <text x={84} y={153} textAnchor="middle" fontSize={15} fontWeight={700} fill={P.inkSoft}>
          OmniSlash inbox
        </text>
      </g>
    </g>
  );
}

export function SceneMuse(): ReactNode {
  return (
    <g>
      <GroundLine />
      <OwnerSpark />
      <MuseDeskCharacter />
      <RoleInboxTray />
    </g>
  );
}

/* ==========================================================================
   SCENE 2: ARCHITECT -> DRILL THE TICKET
   ========================================================================== */

function ArchitectFigure(): ReactNode {
  return (
    <g transform="translate(132 54)">
      <g className="sb-arch-head">
        <path d="M168 48 C168 24 214 24 214 52 C214 72 204 86 190 86 C176 86 168 72 168 48 Z" fill={P.white} {...INK_STROKE} />
        <path d="M166 48 C164 20 218 16 218 46 C206 34 182 40 166 48 Z" fill={P.ink} />
        <circle cx={182} cy={55} r={8.5} fill="none" stroke={P.ink} strokeWidth={2.2} />
        <circle cx={202} cy={55} r={8.5} fill="none" stroke={P.ink} strokeWidth={2.2} />
        <line x1={190.5} y1={55} x2={193.5} y2={55} stroke={P.ink} strokeWidth={2.2} />
        <g className="sb-blink">
          <circle cx={182} cy={55} r={1.8} fill={P.ink} />
          <circle cx={202} cy={55} r={1.8} fill={P.ink} />
        </g>
        <path d="M188 70 Q193 73 197 69" fill="none" stroke={P.ink} strokeWidth={2} strokeLinecap="round" />
      </g>
      <path d="M148 94 Q192 80 244 100 L256 196 L142 196 Z" fill={P.periwinkle} {...INK_STROKE} />
      <rect x={178} y={92} width={28} height={104} fill={P.white} {...INK_STROKE} />
      <polygon points="36,214 346,192 384,234 74,264" fill={P.white} {...INK_STROKE} />
      <rect x={64} y={258} width={11} height={52} fill={P.taupeLight} {...INK_STROKE} />
      <rect x={338} y={232} width={11} height={78} fill={P.taupeLight} {...INK_STROKE} />
      <g className="sb-arch-blueprint">
        <polygon points="84,218 312,200 338,228 112,248" fill={P.periwinkle} {...INK_STROKE} />
        <ellipse cx={86} cy={233} rx={11} ry={16} fill={P.periwinkleSoft} {...INK_STROKE} />
        <ellipse cx={326} cy={214} rx={10} ry={15} fill={P.periwinkleSoft} {...INK_STROKE} />
      </g>
      <g className="sb-arch-block-1">
        <rect x={172} y={208} width={36} height={16} rx={3} fill={P.terracotta} {...INK_STROKE} />
      </g>
      <g className="sb-arch-block-2">
        <rect x={214} y={202} width={38} height={16} rx={3} fill={P.terracotta} {...INK_STROKE} />
      </g>
      <g className="sb-arch-block-3">
        <rect x={194} y={224} width={44} height={16} rx={3} fill={P.terracotta} {...INK_STROKE} />
      </g>
      <g className="sb-arch-compass-arm">
        <path d="M150 114 L114 156 L124 184" fill="none" stroke={P.ink} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M150 114 L114 156 L124 184" fill="none" stroke={P.periwinkle} strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={124} cy={184} r={7} fill={P.white} {...INK_STROKE} />
        <line x1={124} y1={186} x2={112} y2={224} stroke={P.terracotta} strokeWidth={3.2} strokeLinecap="round" />
        <line x1={124} y1={186} x2={138} y2={220} stroke={P.terracotta} strokeWidth={3.2} strokeLinecap="round" />
        <circle cx={124} cy={190} r={4} fill={P.ink} />
      </g>
      <circle cx={155} cy={114} r={9.5} fill={P.periwinkle} />
      <g className="sb-arch-place-arm">
        <path d="M238 116 L252 162 L218 192" fill="none" stroke={P.ink} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M238 116 L252 162 L218 192" fill="none" stroke={P.periwinkle} strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={216} cy={194} r={7} fill={P.white} {...INK_STROKE} />
      </g>
      <circle cx={233} cy={116} r={9.5} fill={P.periwinkle} />
      <text x={204} y={335} textAnchor="middle" fontSize={16} fontWeight={700} fill={P.inkSoft}>
        Architect
      </text>
    </g>
  );
}

function DrilledTicketCard(): ReactNode {
  return (
    <g transform="translate(534 94)">
      <g className="sb-arch-ticket">
        <g transform="translate(18 -18)">
          <rect x={0} y={0} width={226} height={228} rx={12} fill={P.paperShade} {...INK_STROKE} />
          <rect x={14} y={14} width={198} height={32} rx={7} fill={P.terracottaSoft} stroke={P.terracotta} strokeWidth={1.8} />
        </g>
        <g transform="translate(9 -9)">
          <rect x={0} y={0} width={226} height={228} rx={12} fill={P.white} {...INK_STROKE} />
          <rect x={14} y={14} width={198} height={32} rx={7} fill={P.terracottaSoft} stroke={P.terracotta} strokeWidth={1.8} />
        </g>
        <rect x={0} y={0} width={226} height={228} rx={12} fill={P.white} {...INK_STROKE} />
        <rect x={14} y={14} width={198} height={32} rx={7} fill={P.terracotta} />
        <text x={26} y={36} fontSize={16} fontWeight={800} fill={P.white}>
          Drilled ticket
        </text>
        <text x={202} y={35} textAnchor="end" fontSize={12} fontWeight={700} fill={P.terracottaSoft}>
          1 of 5
        </text>
        <text x={18} y={70} fontSize={15} fontWeight={700} fill={P.inkSoft}>
          Breakdown
        </text>
        <line className="sb-arch-line-1" pathLength={1} x1={18} y1={86} x2={200} y2={86} stroke={P.ink} strokeWidth={3.2} strokeLinecap="round" />
        <line
          className="sb-arch-line-2"
          pathLength={1}
          x1={18}
          y1={104}
          x2={172}
          y2={104}
          stroke={P.periwinkle}
          strokeWidth={3.2}
          strokeLinecap="round"
        />
        <text x={18} y={136} fontSize={15} fontWeight={700} fill={P.inkSoft}>
          Done checklist
        </text>
        <g className="sb-arch-check-row-1">
          <rect x={18} y={148} width={14} height={14} rx={3} fill={P.paperShade} stroke={P.ink} strokeWidth={2} />
          <line x1={40} y1={155} x2={196} y2={155} stroke={P.ink} strokeWidth={2.8} strokeLinecap="round" />
        </g>
        <g className="sb-arch-check-row-2">
          <rect x={18} y={172} width={14} height={14} rx={3} fill={P.paperShade} stroke={P.ink} strokeWidth={2} />
          <line x1={40} y1={179} x2={178} y2={179} stroke={P.ink} strokeWidth={2.8} strokeLinecap="round" />
        </g>
        <g className="sb-arch-check-row-3">
          <rect x={18} y={196} width={14} height={14} rx={3} fill={P.paperShade} stroke={P.ink} strokeWidth={2} />
          <line x1={40} y1={203} x2={160} y2={203} stroke={P.ink} strokeWidth={2.8} strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

export function SceneArchitect(): ReactNode {
  return (
    <g>
      <GroundLine />
      <path
        className="sb-arch-inbox-arc"
        d="M120 268 Q154 224 206 238"
        fill="none"
        stroke={P.terracotta}
        strokeWidth={2.2}
        strokeDasharray="5 6"
        strokeLinecap="round"
      />
      <g transform="translate(20 278) scale(0.86)">
        <g className="sb-arch-inbox">
          <RoleInboxStack label="Architect inbox" ticketCount={5} badgeCount={5} />
        </g>
      </g>
      <text x={87} y={389} textAnchor="middle" fontSize={14} fontWeight={700} fill={P.inkSoft}>
        OmniSlash inbox
      </text>
      <ArchitectFigure />
      <DrilledTicketCard />
    </g>
  );
}
