import type { ReactNode } from "react";
import { PALETTE as P } from "#/how-it-works/storybook-data";
import { BuiltPackage, GroundLine, INK_STROKE, OwnerFigure, RoleInboxStack } from "#/how-it-works/storybook-parts";

/* ==========================================================================
   SCENE 7: INBOX, GATE AND SHIP (SENTINEL)
   ========================================================================== */

function GatehouseBridge(): ReactNode {
  return (
    <g transform="translate(64 66)">
      <polygon points="10,74 116,12 184,74 10,74" fill={P.ink} {...INK_STROKE} />
      <polygon points="10,74 100,74 100,298 10,298" fill={P.taupeLight} {...INK_STROKE} />
      <polygon points="100,74 236,74 236,246 100,246" fill={P.white} {...INK_STROKE} />
      <rect x={42} y={120} width={22} height={46} rx={11} fill={P.ink} />
      <rect x={24} y={196} width={26} height={10} rx={2} fill={P.white} stroke={P.ink} strokeWidth={2} />
      <rect x={58} y={244} width={26} height={10} rx={2} fill={P.white} stroke={P.ink} strokeWidth={2} />
      <path d="M126 246 V148 A42 42 0 0 1 210 148 V246 Z" fill={P.ink} {...INK_STROKE} />
      <path
        className="sb-sent-portal-glow"
        d="M134 246 V150 A34 34 0 0 1 202 150 V246 Z"
        fill={P.goldSoft}
        fillOpacity={0.68}
      />
      <path d="M100 230 Q236 224 360 298 L100 298 Z" fill={P.taupe} {...INK_STROKE} />
      <path d="M100 216 Q236 210 370 288 L360 298 Q236 224 100 230 Z" fill={P.white} {...INK_STROKE} />
      <path d="M134 298 A58 58 0 0 1 250 298 Z" fill={P.ink} />
      <g transform="translate(136 178)">
        <g className="sb-sent-parcel">
          <BuiltPackage seals={3} sealClasses={["sb-sent-seal-1", "sb-sent-seal-2", "sb-sent-seal-3"]} />
        </g>
      </g>
      <g transform="translate(114 -24)">
        <g className="sb-sent-merged-badge">
          <rect x={0} y={0} width={220} height={38} rx={19} fill={P.sageSoft} stroke={P.sage} strokeWidth={2.2} />
          <path d="M16 19 L21 24 L31 13" fill="none" stroke={P.sage} strokeWidth={2.8} strokeLinecap="round" />
          <text x={40} y={25} fontSize={16} fontWeight={800} fill={P.ink}>
            Merged and shipped
          </text>
        </g>
      </g>
    </g>
  );
}

function SentinelFigure(): ReactNode {
  return (
    <g transform="translate(466 66)">
      <path
        className="sb-sent-scarf"
        d="M114 96 Q164 114 202 152 L182 164 Q146 130 104 114 Z"
        fill={P.terracotta}
        {...INK_STROKE}
      />
      <rect x={68} y={258} width={22} height={40} fill={P.ink} {...INK_STROKE} />
      <rect x={102} y={258} width={22} height={40} fill={P.ink} {...INK_STROKE} />
      <g className="sb-sent-lantern-arm">
        <path d="M62 124 L12 146 L-18 114" fill="none" stroke={P.ink} strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M62 124 L12 146 L-18 114" fill="none" stroke={P.periwinkle} strokeWidth={19} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={-20} cy={112} r={7.5} fill={P.white} {...INK_STROKE} />
        <g transform="translate(-40 116)">
          <circle className="sb-sent-glow" cx={20} cy={46} r={40} fill={P.goldSoft} fillOpacity={0.6} />
          <path d="M8 14 Q20 -2 32 14" fill="none" stroke={P.ink} strokeWidth={2.4} />
          <rect x={8} y={14} width={24} height={10} rx={4} fill={P.terracotta} {...INK_STROKE} />
          <rect x={6} y={24} width={28} height={38} rx={10} fill={P.white} {...INK_STROKE} />
          <path className="sb-sent-flame" d="M20 32 Q28 44 20 54 Q12 44 20 32 Z" fill={P.gold} stroke={P.terracotta} strokeWidth={2} />
          <rect x={4} y={60} width={32} height={12} rx={5} fill={P.terracotta} {...INK_STROKE} />
        </g>
      </g>
      <path d="M56 112 Q96 96 136 114 L152 260 L44 260 Z" fill={P.periwinkle} {...INK_STROKE} />
      <line x1={96} y1={116} x2={96} y2={260} stroke={P.ink} strokeWidth={2.2} />
      <circle cx={104} cy={160} r={3} fill={P.ink} />
      <circle cx={104} cy={190} r={3} fill={P.ink} />
      <circle cx={104} cy={220} r={3} fill={P.ink} />
      <g className="sb-sent-glass-arm">
        <path d="M130 124 L94 196 L0 210" fill="none" stroke={P.ink} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M130 124 L94 196 L0 210" fill="none" stroke={P.periwinkle} strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={-4} cy={210} r={7.5} fill={P.white} {...INK_STROKE} />
        <line x1={-10} y1={212} x2={-30} y2={216} stroke={P.ink} strokeWidth={5} strokeLinecap="round" />
        <circle cx={-46} cy={220} r={18} fill={P.periwinkleSoft} fillOpacity={0.65} stroke={P.ink} strokeWidth={2.8} />
      </g>
      <circle cx={125} cy={124} r={9.5} fill={P.periwinkle} />
      <path d="M68 96 Q96 114 124 96 L128 114 Q96 132 64 114 Z" fill={P.terracotta} {...INK_STROKE} />
      <g className="sb-sent-head">
        <circle cx={126} cy={62} r={12} fill={P.ink} />
        <path d="M74 58 C74 34 118 34 118 62 C118 82 108 96 96 96 C84 96 74 82 74 58 Z" fill={P.white} {...INK_STROKE} />
        <path d="M72 60 C72 30 120 30 122 56 C108 46 88 50 72 60 Z" fill={P.ink} />
        <g className="sb-blink">
          <circle cx={88} cy={64} r={2.2} fill={P.ink} />
          <circle cx={102} cy={64} r={2.2} fill={P.ink} />
        </g>
        <path d="M90 78 Q95 81 100 78" fill="none" stroke={P.ink} strokeWidth={2} strokeLinecap="round" />
      </g>
      <text x={96} y={324} textAnchor="middle" fontSize={16} fontWeight={700} fill={P.inkSoft}>
        Sentinel
      </text>
    </g>
  );
}

export function SceneSentinel(): ReactNode {
  return (
    <g>
      <GroundLine />
      <GatehouseBridge />
      <SentinelFigure />
      <g transform="translate(640 22)">
        <g className="sb-sent-inbox">
          <g transform="scale(0.7)">
            <RoleInboxStack label="Sentinel inbox" ticketCount={5} badgeCount={5} seals={1} />
          </g>
          <text x={55} y={96} textAnchor="middle" fontSize={14} fontWeight={700} fill={P.inkSoft}>
            Oldest first
          </text>
        </g>
      </g>
      <g transform="translate(42 376)">
        <g className="sb-sent-red-check">
          <rect x={0} y={0} width={292} height={36} rx={18} fill={P.terracottaSoft} stroke={P.terracotta} strokeWidth={2.2} />
          <circle cx={20} cy={18} r={7} fill={P.terracotta} />
          <text x={36} y={24} fontSize={15} fontWeight={800} fill={P.ink}>
            Red check: back to the Builder
          </text>
        </g>
      </g>
    </g>
  );
}

/* ==========================================================================
   SCENE 8: LIVE ROLLOUT (OWNER AND TOGGLESLASH)
   ========================================================================== */

function TogglePanel(): ReactNode {
  return (
    <g transform="translate(124 76)">
      <rect x={0} y={0} width={258} height={260} rx={14} fill={P.white} {...INK_STROKE} />
      <text x={20} y={34} fontSize={17} fontWeight={800} fill={P.ink}>
        ToggleSlash
      </text>
      <text x={20} y={56} fontSize={14} fontWeight={700} fill={P.inkSoft}>
        Live feature switch
      </text>
      <g transform="translate(20 76)">
        <rect className="sb-rol-track" x={0} y={0} width={104} height={46} rx={23} fill={P.sage} {...INK_STROKE} />
        <circle className="sb-rol-knob" cx={80} cy={23} r={17} fill={P.white} {...INK_STROKE} />
        <text x={120} y={29} fontSize={17} fontWeight={800} fill={P.ink}>
          Live ON
        </text>
      </g>
      <text x={20} y={156} fontSize={14} fontWeight={700} fill={P.inkSoft}>
        Audience rollout
      </text>
      <rect x={20} y={168} width={218} height={15} rx={7.5} fill={P.paperShade} stroke={P.ink} strokeWidth={2} />
      <rect x={22} y={170} width={40} height={11} rx={5.5} fill={P.terracotta} />
      <text x={42} y={204} textAnchor="middle" fontSize={14} fontWeight={800} fill={P.terracotta}>
        10%
      </text>
      <text x={129} y={204} textAnchor="middle" fontSize={14} fontWeight={700} fill={P.inkSoft}>
        50%
      </text>
      <text x={238} y={204} textAnchor="end" fontSize={14} fontWeight={700} fill={P.inkSoft}>
        100%
      </text>
      <g transform="translate(20 220)">
        <g className="sb-rol-audit">
          <circle cx={10} cy={10} r={9} fill={P.sageSoft} stroke={P.sage} strokeWidth={2} />
          <path d="M6 10 L9 13 L14 7" fill="none" stroke={P.sage} strokeWidth={2.2} strokeLinecap="round" />
          <text x={26} y={15} fontSize={14} fontWeight={700} fill={P.ink}>
            Dashboard or command line
          </text>
        </g>
      </g>
    </g>
  );
}

function UserWindow({
  x,
  y,
  wave,
  label,
}: {
  x: number;
  y: number;
  wave: 1 | 2 | 3;
  label: string;
}): ReactNode {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={`sb-rol-win-${wave}`}>
        <rect x={0} y={0} width={102} height={82} rx={10} fill={P.white} {...INK_STROKE} />
        <path d="M0 10 Q0 0 10 0 L92 0 Q102 0 102 10 L102 20 L0 20 Z" fill={P.taupeLight} {...INK_STROKE} />
        <rect className={`sb-rol-accent-${wave}`} x={12} y={30} width={44} height={18} rx={4} fill={P.terracotta} />
        <rect className={`sb-rol-block-${wave}`} x={62} y={30} width={28} height={18} rx={4} fill={P.periwinkle} />
        <rect className={`sb-rol-bar-${wave}`} x={12} y={56} width={78} height={12} rx={4} fill={P.sageSoft} stroke={P.sage} strokeWidth={1.6} />
        <text x={51} y={104} textAnchor="middle" fontSize={14} fontWeight={700} fill={P.inkSoft}>
          {label}
        </text>
      </g>
    </g>
  );
}

function UserHorizon(): ReactNode {
  return (
    <g>
      <path className="sb-rol-wave-arc" d="M384 156 Q400 130 416 136" fill="none" stroke={P.terracotta} strokeWidth={2.5} strokeDasharray="5 5" />
      <path className="sb-rol-wave-arc" d="M384 206 Q400 220 416 244" fill="none" stroke={P.periwinkle} strokeWidth={2.5} strokeDasharray="5 5" />
      <UserWindow x={418} y={88} wave={1} label="Early" />
      <UserWindow x={534} y={88} wave={2} label="Team A" />
      <UserWindow x={650} y={88} wave={3} label="Team B" />
      <UserWindow x={418} y={222} wave={2} label="West" />
      <UserWindow x={534} y={222} wave={3} label="East" />
      <UserWindow x={650} y={222} wave={3} label="All users" />
      <g transform="translate(466 52)">
        <g className="sb-twinkle-a" stroke={P.terracotta} strokeWidth={2} strokeLinecap="round">
          <line x1={0} y1={-10} x2={0} y2={10} />
          <line x1={-10} y1={0} x2={10} y2={0} />
        </g>
      </g>
      <g transform="translate(586 40)">
        <g className="sb-twinkle-b" stroke={P.terracotta} strokeWidth={2} strokeLinecap="round">
          <line x1={0} y1={-12} x2={0} y2={12} />
          <line x1={-12} y1={0} x2={12} y2={0} />
          <line x1={-7} y1={-7} x2={7} y2={7} />
          <line x1={7} y1={-7} x2={-7} y2={7} />
        </g>
      </g>
      <g transform="translate(702 54)">
        <g className="sb-twinkle-c" stroke={P.periwinkle} strokeWidth={2} strokeLinecap="round">
          <line x1={0} y1={-9} x2={0} y2={9} />
          <line x1={-9} y1={0} x2={9} y2={0} />
        </g>
      </g>
    </g>
  );
}

export function SceneRollout(): ReactNode {
  return (
    <g>
      <GroundLine />
      <g transform="translate(20 176)">
        <g className="sb-rol-owner">
          <OwnerFigure label="Owner" />
        </g>
      </g>
      <TogglePanel />
      <UserHorizon />
    </g>
  );
}
