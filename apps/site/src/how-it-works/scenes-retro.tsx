import type { ReactNode } from "react";
import { PALETTE as P } from "#/how-it-works/storybook-data";
import { GroundLine, INK_STROKE } from "#/how-it-works/storybook-parts";

/* ==========================================================================
   SCENE 9: GOOD-NIGHT RETRO -> ALL ROLES LEARN FROM PAST RUNS
   ========================================================================== */

function NightSkyAccents(): ReactNode {
  return (
    <g>
      <g transform="translate(86 58)">
        <circle cx={0} cy={0} r={24} fill={P.goldSoft} fillOpacity={0.7} />
        <path
          d="M8 -14 A15 15 0 1 0 8 14 C-1 11 -1 -11 8 -14 Z"
          fill={P.gold}
          stroke={P.ink}
          strokeWidth={2.2}
          strokeLinejoin="round"
        />
      </g>
      <g transform="translate(142 42)">
        <g className="sb-twinkle-a" stroke={P.terracotta} strokeWidth={2} strokeLinecap="round">
          <line x1={0} y1={-8} x2={0} y2={8} />
          <line x1={-8} y1={0} x2={8} y2={0} />
        </g>
      </g>
      <g transform="translate(684 48)">
        <g className="sb-twinkle-b" stroke={P.terracotta} strokeWidth={2} strokeLinecap="round">
          <line x1={0} y1={-10} x2={0} y2={10} />
          <line x1={-10} y1={0} x2={10} y2={0} />
          <line x1={-6} y1={-6} x2={6} y2={6} />
          <line x1={6} y1={-6} x2={-6} y2={6} />
        </g>
      </g>
      <g transform="translate(734 86)">
        <g className="sb-twinkle-c" stroke={P.periwinkle} strokeWidth={2} strokeLinecap="round">
          <line x1={0} y1={-7} x2={0} y2={7} />
          <line x1={-7} y1={0} x2={7} y2={0} />
        </g>
      </g>
    </g>
  );
}

function RetroBoard(): ReactNode {
  return (
    <g transform="translate(186 28)">
      <rect x={0} y={0} width={428} height={172} rx={14} fill={P.white} {...INK_STROKE} />
      <path d="M0 14 Q0 0 14 0 L414 0 Q428 0 428 14 L428 38 L0 38 Z" fill={P.ink} {...INK_STROKE} />
      <text x={18} y={24} fontSize={15} fontWeight={800} fill={P.white}>
        Good-night retro
      </text>
      <text x={410} y={24} textAnchor="end" fontSize={13} fontWeight={700} fill={P.goldSoft}>
        Learning for next time
      </text>
      <text x={20} y={60} fontSize={13} fontWeight={700} fill={P.inkSoft}>
        Notes from today
      </text>
      <g transform="translate(18 68)">
        <g className="sb-retro-note-1">
          <rect x={0} y={0} width={152} height={26} rx={6} fill={P.goldSoft} stroke={P.ink} strokeWidth={1.8} />
          <path d="M10 13 L14 17 L21 9" fill="none" stroke={P.terracotta} strokeWidth={2.4} strokeLinecap="round" />
          <text x={28} y={17} fontSize={13} fontWeight={700} fill={P.ink}>
            Clearer steps
          </text>
        </g>
      </g>
      <g transform="translate(18 100)">
        <g className="sb-retro-note-2">
          <rect x={0} y={0} width={152} height={26} rx={6} fill={P.periwinkleSoft} stroke={P.ink} strokeWidth={1.8} />
          <path d="M10 13 L14 17 L21 9" fill="none" stroke={P.periwinkle} strokeWidth={2.4} strokeLinecap="round" />
          <text x={28} y={17} fontSize={13} fontWeight={700} fill={P.ink}>
            Earlier checks
          </text>
        </g>
      </g>
      <g transform="translate(18 132)">
        <g className="sb-retro-note-3">
          <rect x={0} y={0} width={152} height={26} rx={6} fill={P.terracottaSoft} stroke={P.ink} strokeWidth={1.8} />
          <path d="M10 13 L14 17 L21 9" fill="none" stroke={P.terracotta} strokeWidth={2.4} strokeLinecap="round" />
          <text x={28} y={17} fontSize={13} fontWeight={700} fill={P.ink}>
            Fewer surprises
          </text>
        </g>
      </g>
      <path
        className="sb-retro-arrow"
        d="M178 112 Q200 100 222 112"
        fill="none"
        stroke={P.terracotta}
        strokeWidth={2.4}
        strokeDasharray="5 5"
        strokeLinecap="round"
      />
      <path d="M216 106 L224 112 L216 118" fill="none" stroke={P.terracotta} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
      <g transform="translate(234 52)">
        <g className="sb-retro-playbook">
          <rect x={0} y={0} width={176} height={106} rx={10} fill={P.paper} stroke={P.ink} strokeWidth={2.2} />
          <text x={14} y={24} fontSize={14} fontWeight={800} fill={P.ink}>
            Shared playbook
          </text>
          <line className="sb-retro-rule-1" pathLength={1} x1={14} y1={40} x2={156} y2={40} stroke={P.ink} strokeWidth={2.8} strokeLinecap="round" />
          <line className="sb-retro-rule-2" pathLength={1} x1={14} y1={54} x2={138} y2={54} stroke={P.periwinkle} strokeWidth={2.8} strokeLinecap="round" />
          <line className="sb-retro-rule-3" pathLength={1} x1={14} y1={68} x2={148} y2={68} stroke={P.terracotta} strokeWidth={2.8} strokeLinecap="round" />
          <g transform="translate(12 76)">
            <g className="sb-retro-badge">
              <rect x={0} y={0} width={152} height={22} rx={11} fill={P.sageSoft} stroke={P.sage} strokeWidth={1.8} />
              <path d="M11 11 L15 15 L22 7" fill="none" stroke={P.sage} strokeWidth={2.4} strokeLinecap="round" />
              <text x={28} y={15} fontSize={12} fontWeight={800} fill={P.ink}>
                Smarter next cycle
              </text>
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

function RetroMember({
  x,
  label,
  nodClass,
  children,
}: {
  x: number;
  label: string;
  nodClass: string;
  children: ReactNode;
}): ReactNode {
  return (
    <g transform={`translate(${x} 230)`}>
      <ellipse cx={0} cy={134} rx={32} ry={5.5} fill={P.taupe} />
      <g className={nodClass}>{children}</g>
      <text x={0} y={158} textAnchor="middle" fontSize={13} fontWeight={700} fill={P.inkSoft}>
        {label}
      </text>
    </g>
  );
}

function RetroEyes({ lx = -6, rx = 6, y = 44 }: { lx?: number; rx?: number; y?: number }): ReactNode {
  return (
    <g className="sb-blink">
      <circle cx={lx} cy={y} r={1.8} fill={P.ink} />
      <circle cx={rx} cy={y} r={1.8} fill={P.ink} />
    </g>
  );
}

function LeftRetroGroup(): ReactNode {
  return (
    <g>
      <RetroMember x={76} label="Owner" nodClass="sb-retro-nod-a">
        <path d="M-20 132 L-18 82 Q0 68 18 82 L20 132 Z" fill={P.taupeLight} {...INK_STROKE} />
        <path d="M-24 78 Q0 64 24 78 L20 100 L-20 100 Z" fill={P.ink} {...INK_STROKE} />
        <rect x={-5} y={56} width={10} height={17} rx={3} fill={P.white} {...INK_STROKE} />
        <circle cx={0} cy={43} r={18} fill={P.white} {...INK_STROKE} />
        <path d="M-17 40 Q-10 22 12 28 Q19 32 17 39 Q7 33 -8 37 Z" fill={P.ink} />
        <RetroEyes lx={-4} rx={7} y={44} />
        <path d="M-3 52 Q2 55 7 52" fill="none" stroke={P.ink} strokeWidth={2} strokeLinecap="round" />
      </RetroMember>
      <RetroMember x={184} label="Muse" nodClass="sb-retro-nod-b">
        <path d="M-24 78 Q0 64 24 78 L28 132 L-28 132 Z" fill={P.terracotta} {...INK_STROKE} />
        <path d="M-22 44 C-26 64 -24 76 -12 78 L14 78 C24 70 24 54 18 40 Z" fill={P.ink} {...INK_STROKE} />
        <rect x={-7} y={57} width={14} height={17} rx={3} fill={P.terracotta} {...INK_STROKE} />
        <circle cx={0} cy={43} r={18} fill={P.white} {...INK_STROKE} />
        <path d="M-18 39 C-16 20 18 20 19 39 C10 30 -6 32 -18 39 Z" fill={P.ink} />
        <RetroEyes lx={-5} rx={6} y={44} />
        <path d="M-4 52 Q1 55 6 52" fill="none" stroke={P.ink} strokeWidth={2} strokeLinecap="round" />
      </RetroMember>
      <RetroMember x={292} label="Architect" nodClass="sb-retro-nod-a">
        <path d="M-24 78 Q0 64 24 78 L28 132 L-28 132 Z" fill={P.periwinkle} {...INK_STROKE} />
        <rect x={-9} y={71} width={18} height={61} fill={P.white} {...INK_STROKE} />
        <rect x={-5} y={56} width={10} height={18} rx={3} fill={P.white} {...INK_STROKE} />
        <circle cx={0} cy={43} r={18} fill={P.white} {...INK_STROKE} />
        <path d="M-18 40 C-18 21 18 21 18 38 C8 30 -6 33 -18 40 Z" fill={P.ink} />
        <circle cx={-6.5} cy={44} r={5.5} fill="none" stroke={P.ink} strokeWidth={1.9} />
        <circle cx={6.5} cy={44} r={5.5} fill="none" stroke={P.ink} strokeWidth={1.9} />
        <line x1={-1} y1={44} x2={1} y2={44} stroke={P.ink} strokeWidth={1.9} />
        <RetroEyes lx={-6.5} rx={6.5} y={44} />
        <path d="M-4 53 Q0 56 4 53" fill="none" stroke={P.ink} strokeWidth={2} strokeLinecap="round" />
      </RetroMember>
      <RetroMember x={400} label="Checker" nodClass="sb-retro-nod-b">
        <path d="M-24 78 Q0 64 24 78 L26 132 L-26 132 Z" fill={P.periwinkle} {...INK_STROKE} />
        <polygon points="-12,73 0,94 12,73" fill={P.white} {...INK_STROKE} />
        <rect x={-5} y={56} width={10} height={18} rx={3} fill={P.white} {...INK_STROKE} />
        <path
          d="M-24 40 C-28 26 -14 16 0 16 C16 16 28 28 24 44 C24 52 16 58 10 56 L-10 56 C-18 58 -26 50 -24 40 Z"
          fill={P.white}
          {...INK_STROKE}
        />
        <circle cx={0} cy={44} r={16} fill={P.white} {...INK_STROKE} />
        <RetroEyes lx={-5.5} rx={5.5} y={43} />
        <path d="M-4 51 Q0 54 4 51" fill="none" stroke={P.ink} strokeWidth={2} strokeLinecap="round" />
      </RetroMember>
    </g>
  );
}

function RightRetroGroup(): ReactNode {
  return (
    <g>
      <RetroMember x={508} label="Builder" nodClass="sb-retro-nod-a">
        <path d="M-24 78 Q0 64 24 78 L26 132 L-26 132 Z" fill={P.white} {...INK_STROKE} />
        <path d="M-16 76 L16 76 L20 132 L-20 132 Z" fill={P.terracotta} {...INK_STROKE} />
        <rect x={-5} y={56} width={10} height={18} rx={3} fill={P.white} {...INK_STROKE} />
        <circle cx={0} cy={43} r={18} fill={P.white} {...INK_STROKE} />
        <path d="M-18 41 Q-10 22 12 27 Q19 31 17 39 Q7 33 -8 37 Z" fill={P.ink} />
        <RetroEyes lx={-6} rx={5} y={44} />
        <path d="M-5 52 Q0 55 5 52" fill="none" stroke={P.ink} strokeWidth={2} strokeLinecap="round" />
      </RetroMember>
      <RetroMember x={616} label="Reviewer" nodClass="sb-retro-nod-b">
        <path d="M-26 132 L-20 76 Q0 64 20 76 L26 132 Z" fill={P.ink} {...INK_STROKE} />
        <path d="M-10 72 L10 72 L8 132 L-8 132 Z" fill={P.terracotta} {...INK_STROKE} />
        <rect x={-5} y={56} width={10} height={18} rx={3} fill={P.white} {...INK_STROKE} />
        <circle cx={0} cy={43} r={18} fill={P.white} {...INK_STROKE} />
        <path d="M-18 39 C-18 21 18 21 18 37 C8 29 -6 32 -18 39 Z" fill={P.ink} />
        <rect x={-14} y={39} width={11} height={8} rx={2.5} fill={P.white} stroke={P.ink} strokeWidth={2} />
        <rect x={3} y={39} width={11} height={8} rx={2.5} fill={P.white} stroke={P.ink} strokeWidth={2} />
        <line x1={-3} y1={43} x2={3} y2={43} stroke={P.ink} strokeWidth={2} />
        <RetroEyes lx={-8.5} rx={8.5} y={43} />
        <path d="M-5 53 Q0 55 5 53" fill="none" stroke={P.ink} strokeWidth={2} strokeLinecap="round" />
      </RetroMember>
      <RetroMember x={724} label="Sentinel" nodClass="sb-retro-nod-a">
        <circle cx={18} cy={39} r={7.5} fill={P.ink} />
        <path d="M-24 78 Q0 64 24 78 L28 132 L-28 132 Z" fill={P.periwinkle} {...INK_STROKE} />
        <path d="M-18 61 Q0 74 18 61 L20 76 Q0 88 -20 76 Z" fill={P.terracotta} {...INK_STROKE} />
        <circle cx={0} cy={43} r={18} fill={P.white} {...INK_STROKE} />
        <path d="M-18 40 C-18 21 18 21 18 38 C8 30 -6 33 -18 40 Z" fill={P.ink} />
        <RetroEyes lx={-6} rx={5} y={44} />
        <path d="M-5 52 Q0 55 5 52" fill="none" stroke={P.ink} strokeWidth={2} strokeLinecap="round" />
        <g transform="translate(-44 68)">
          <circle className="sb-sent-glow" cx={10} cy={24} r={22} fill={P.goldSoft} fillOpacity={0.65} />
          <path d="M3 8 Q10 -2 17 8" fill="none" stroke={P.ink} strokeWidth={2} />
          <rect x={3} y={8} width={14} height={6} rx={3} fill={P.terracotta} stroke={P.ink} strokeWidth={2} />
          <rect x={2} y={14} width={16} height={22} rx={5} fill={P.white} stroke={P.ink} strokeWidth={2} />
          <path className="sb-sent-flame" d="M10 18 Q15 25 10 31 Q5 25 10 18 Z" fill={P.gold} stroke={P.terracotta} strokeWidth={1.6} />
          <rect x={1} y={35} width={18} height={6} rx={3} fill={P.terracotta} stroke={P.ink} strokeWidth={2} />
        </g>
      </RetroMember>
    </g>
  );
}

export function SceneRetro(): ReactNode {
  return (
    <g>
      <GroundLine />
      <NightSkyAccents />
      <RetroBoard />
      <LeftRetroGroup />
      <RightRetroGroup />
    </g>
  );
}
