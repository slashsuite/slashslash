import type { ReactNode } from "react";
import { PALETTE as P } from "#/how-it-works/storybook-data";
import { GroundLine, INK_STROKE, StoryToken } from "#/how-it-works/storybook-parts";

/* ==========================================================================
   SCENE 4: LOCK & BUILD IN ISOLATION (ARCHITECT, BUILDER, LEASE, UISLASH, TASKSLASH)
   ========================================================================== */

function ArchitectLeaseAndOtherAgent(): ReactNode {
  return (
    <g>
      <g transform="translate(26 62)">
        <circle cx={34} cy={38} r={16} fill={P.white} {...INK_STROKE} />
        <path d="M18 36 C18 18 52 16 52 34 C42 26 28 30 18 36 Z" fill={P.ink} />
        <circle cx={29} cy={39} r={5} fill="none" stroke={P.ink} strokeWidth={1.8} />
        <circle cx={41} cy={39} r={5} fill="none" stroke={P.ink} strokeWidth={1.8} />
        <path d="M18 62 Q34 52 50 62 L54 110 L14 110 Z" fill={P.periwinkle} {...INK_STROKE} />
        <text x={34} y={130} textAnchor="middle" fontSize={14} fontWeight={700} fill={P.inkSoft}>
          Architect
        </text>
      </g>
      <g transform="translate(94 42)">
        <g className="sb-bld-lease-badge">
          <rect x={0} y={0} width={164} height={42} rx={21} fill={P.white} {...INK_STROKE} />
          <g transform="translate(14 9)">
            <path d="M6 11 V7 A5.5 5.5 0 0 1 17 7 V11" fill="none" stroke={P.terracotta} strokeWidth={2.6} strokeLinecap="round" />
            <rect x={2} y={11} width={19} height={13} rx={3} fill={P.terracotta} stroke={P.ink} strokeWidth={1.8} />
          </g>
          <text x={44} y={27} fontSize={16} fontWeight={800} fill={P.ink}>
            Lease locked
          </text>
        </g>
      </g>
      <g transform="translate(104 106)">
        <g transform="translate(0 6) rotate(-5) scale(0.68)">
          <StoryToken seals={1} />
        </g>
        <g transform="translate(10 14) rotate(3) scale(0.68)">
          <StoryToken seals={1} />
        </g>
        <text x={26} y={64} textAnchor="middle" fontSize={13} fontWeight={700} fill={P.inkSoft}>
          2 waiting
        </text>
      </g>
      <path
        className="sb-bld-handoff-arc"
        d="M158 124 Q312 36 452 216"
        fill="none"
        stroke={P.terracotta}
        strokeWidth={2.2}
        strokeDasharray="5 6"
        strokeLinecap="round"
      />
      <text x={324} y={76} textAnchor="middle" fontSize={13} fontWeight={700} fill={P.terracotta}>
        1 assigned
      </text>
      <g transform="translate(76 206)">
        <g className="sb-bld-second-agent">
          <circle cx={34} cy={46} r={16} fill={P.paperShade} stroke={P.inkSoft} strokeWidth={2.2} strokeDasharray="4 3" />
          <path
            d="M14 82 Q34 66 54 82 L58 142 L10 142 Z"
            fill={P.paperShade}
            stroke={P.inkSoft}
            strokeWidth={2.2}
            strokeDasharray="4 3"
          />
          <text x={34} y={178} textAnchor="middle" fontSize={15} fontWeight={700} fill={P.inkSoft}>
            Other agent
          </text>
        </g>
      </g>
      <g transform="translate(184 294)">
        <g className="sb-bld-bump-spark" stroke={P.terracotta} strokeWidth={2.6} strokeLinecap="round" opacity={0}>
          <line x1={-12} y1={-12} x2={-4} y2={-4} />
          <line x1={-14} y1={0} x2={-5} y2={0} />
          <line x1={-12} y1={12} x2={-4} y2={4} />
        </g>
      </g>
    </g>
  );
}

function BuilderWorkspace(): ReactNode {
  return (
    <g transform="translate(172 62)">
      <polygon
        className="sb-bld-boundary"
        points="16,246 206,174 388,246 206,318"
        fill={P.paperShade}
        fillOpacity={0.55}
        stroke={P.ink}
        strokeWidth={2.5}
        strokeDasharray="5 7"
        strokeLinejoin="round"
      />
      <rect x={64} y={176} width={44} height={54} rx={8} fill={P.ink} {...INK_STROKE} />
      <line x1={92} y1={246} x2={92} y2={278} stroke={P.ink} strokeWidth={4} />
      <line x1={72} y1={284} x2={112} y2={284} stroke={P.ink} strokeWidth={3} strokeLinecap="round" />
      <g className="sb-bld-head">
        <path d="M94 78 C94 54 136 54 136 82 C136 100 128 112 114 112 C100 112 94 100 94 78 Z" fill={P.white} {...INK_STROKE} />
        <path d="M92 80 C88 50 140 48 140 74 C128 64 108 68 92 80 Z" fill={P.ink} />
        <g className="sb-blink">
          <circle cx={114} cy={83} r={2.1} fill={P.ink} />
          <circle cx={127} cy={83} r={2.1} fill={P.ink} />
        </g>
        <path d="M116 96 Q122 99 127 95" fill="none" stroke={P.ink} strokeWidth={2} strokeLinecap="round" />
      </g>
      <g className="sb-bld-type-right">
        <path d="M126 134 L160 152 L196 156" fill="none" stroke={P.ink} strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M126 134 L160 152 L196 156" fill="none" stroke={P.white} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={198} cy={156} r={6.5} fill={P.white} {...INK_STROKE} />
      </g>
      <path d="M80 120 Q110 108 134 124 L144 228 L74 218 Z" fill={P.white} {...INK_STROKE} />
      <path d="M92 122 L130 128 L152 234 L84 222 Z" fill={P.terracotta} {...INK_STROKE} />
      <polygon points="142,164 264,128 360,174 238,216" fill={P.taupeLight} {...INK_STROKE} />
      <rect x={238} y={214} width={9} height={64} fill={P.white} {...INK_STROKE} />
      <rect x={342} y={176} width={9} height={62} fill={P.white} {...INK_STROKE} />
      <polygon points="208,64 312,96 312,174 208,140" fill={P.ink} {...INK_STROKE} />
      <polygon points="214,72 306,100 306,166 214,136" fill={P.white} />
      <polygon className="sb-bld-ui-1" points="220,84 262,97 262,120 220,106" fill={P.terracotta} />
      <polygon className="sb-bld-ui-2" points="266,98 300,109 300,132 266,121" fill={P.periwinkle} />
      <polygon className="sb-bld-ui-3" points="220,112 300,138 300,158 220,131" fill={P.periwinkleSoft} stroke={P.periwinkle} strokeWidth={1.6} />
      <polygon points="174,166 222,152 242,164 194,178" fill={P.white} {...INK_STROKE} />
      <g transform="translate(274 166) scale(0.74)">
        <g className="sb-bld-handoff-token">
          <StoryToken seals={1} />
        </g>
      </g>
      <g className="sb-bld-type-left">
        <path d="M88 134 L136 164 L178 164" fill="none" stroke={P.ink} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
        <path d="M88 134 L136 164 L178 164" fill="none" stroke={P.white} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={180} cy={164} r={6.5} fill={P.white} {...INK_STROKE} />
      </g>
      <circle cx={86} cy={130} r={7.5} fill={P.white} />
      <text x={206} y={336} textAnchor="middle" fontSize={16} fontWeight={700} fill={P.ink}>
        Isolated workspace
      </text>
    </g>
  );
}

function TaskSlashQueueCard(): ReactNode {
  return (
    <g transform="translate(570 86)">
      <rect x={0} y={0} width={190} height={224} rx={12} fill={P.white} {...INK_STROKE} />
      <text x={16} y={30} fontSize={16} fontWeight={800} fill={P.ink}>
        TaskSlash
      </text>
      <text x={16} y={52} fontSize={14} fontWeight={700} fill={P.inkSoft}>
        Machine capacity
      </text>
      <rect x={16} y={62} width={158} height={13} rx={6.5} fill={P.paperShade} stroke={P.ink} strokeWidth={1.8} />
      <rect className="sb-bld-capacity" x={18} y={64} width={124} height={9} rx={4.5} fill={P.periwinkle} />
      <g transform="translate(16 90)">
        <g className="sb-bld-step-1">
          <rect x={0} y={0} width={158} height={34} rx={8} fill={P.sageSoft} stroke={P.sage} strokeWidth={1.8} />
          <text x={12} y={23} fontSize={15} fontWeight={700} fill={P.ink}>
            1. Build
          </text>
          <path d="M132 17 L137 22 L147 11" fill="none" stroke={P.sage} strokeWidth={2.8} strokeLinecap="round" />
        </g>
      </g>
      <g transform="translate(16 132)">
        <g className="sb-bld-step-2">
          <rect x={0} y={0} width={158} height={34} rx={8} fill={P.sageSoft} stroke={P.sage} strokeWidth={1.8} />
          <text x={12} y={23} fontSize={15} fontWeight={700} fill={P.ink}>
            2. Design
          </text>
          <path d="M132 17 L137 22 L147 11" fill="none" stroke={P.sage} strokeWidth={2.8} strokeLinecap="round" />
        </g>
      </g>
      <g transform="translate(16 174)">
        <g className="sb-bld-step-3">
          <rect x={0} y={0} width={158} height={34} rx={8} fill={P.sageSoft} stroke={P.sage} strokeWidth={1.8} />
          <text x={12} y={23} fontSize={15} fontWeight={700} fill={P.ink}>
            3. Tests
          </text>
          <path d="M132 17 L137 22 L147 11" fill="none" stroke={P.sage} strokeWidth={2.8} strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

export function SceneBuilder(): ReactNode {
  return (
    <g>
      <GroundLine />
      <ArchitectLeaseAndOtherAgent />
      <BuilderWorkspace />
      <TaskSlashQueueCard />
    </g>
  );
}
