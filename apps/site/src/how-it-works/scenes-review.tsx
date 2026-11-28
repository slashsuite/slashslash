import type { ReactNode } from "react";
import { PALETTE as P } from "#/how-it-works/storybook-data";
import { BuiltPackage, GroundLine, INK_STROKE } from "#/how-it-works/storybook-parts";

/* ==========================================================================
   SCENE 6: CHECKS (PIXELSLASH, FLAKESLASH, UISLASH)
   ========================================================================== */

function BuilderHandoff(): ReactNode {
  return (
    <g>
      <g transform="translate(42 126)">
        <g className="sb-chk5-builder">
          <path d="M40 38 C40 18 76 18 76 40 C76 56 68 66 58 66 C48 66 40 56 40 38 Z" fill={P.white} {...INK_STROKE} />
          <path d="M38 38 C36 14 78 12 78 34 C66 26 50 28 38 38 Z" fill={P.ink} />
          <g className="sb-blink">
            <circle cx={56} cy={41} r={1.9} fill={P.ink} />
            <circle cx={67} cy={41} r={1.9} fill={P.ink} />
          </g>
          <path d="M58 52 Q63 55 68 51" fill="none" stroke={P.ink} strokeWidth={2} strokeLinecap="round" />
          <path d="M82 94 L118 112 L134 106" fill="none" stroke={P.ink} strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M82 94 L118 112 L134 106" fill="none" stroke={P.white} strokeWidth={13} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={136} cy={106} r={6.5} fill={P.white} {...INK_STROKE} />
          <path d="M32 76 Q58 66 84 78 L88 184 L28 184 Z" fill={P.white} {...INK_STROKE} />
          <path d="M40 78 L78 78 L84 184 L34 184 Z" fill={P.terracotta} {...INK_STROKE} />
          <rect x={36} y={184} width={18} height={54} fill={P.ink} {...INK_STROKE} />
          <rect x={60} y={184} width={18} height={54} fill={P.ink} {...INK_STROKE} />
        </g>
      </g>
      <line x1={226} y1={72} x2={226} y2={358} stroke={P.inkSoft} strokeWidth={2.2} strokeDasharray="6 6" />
      <g transform="translate(190 190)">
        <g className="sb-chk5-parcel">
          <BuiltPackage seals={2} />
        </g>
      </g>
      <text x={136} y={392} textAnchor="middle" fontSize={15} fontWeight={700} fill={P.inkSoft}>
        Fixes before handoff
      </text>
    </g>
  );
}

function PixelSlashWindow(): ReactNode {
  return (
    <g transform="translate(260 72)">
      <rect x={0} y={0} width={280} height={258} rx={12} fill={P.white} {...INK_STROKE} />
      <path d="M0 12 Q0 0 12 0 L268 0 Q280 0 280 12 L280 38 L0 38 Z" fill={P.taupeLight} {...INK_STROKE} />
      <circle cx={18} cy={19} r={4.5} fill={P.terracotta} />
      <circle cx={34} cy={19} r={4.5} fill={P.gold} />
      <circle cx={50} cy={19} r={4.5} fill={P.sage} />
      <text x={68} y={24} fontSize={15} fontWeight={800} fill={P.ink}>
        PixelSlash review
      </text>
      <rect x={16} y={52} width={248} height={144} rx={8} fill={P.paper} stroke={P.taupe} strokeWidth={2} />
      <rect x={30} y={68} width={96} height={14} rx={4} fill={P.ink} />
      <rect x={30} y={92} width={148} height={10} rx={3} fill={P.taupe} />
      <rect x={30} y={110} width={118} height={10} rx={3} fill={P.taupe} />
      <rect x={30} y={138} width={88} height={34} rx={8} fill={P.periwinkle} {...INK_STROKE} />
      <rect
        className="sb-chk5-diff-box"
        x={24}
        y={132}
        width={100}
        height={46}
        rx={10}
        fill="none"
        stroke={P.terracotta}
        strokeWidth={3}
        strokeDasharray="6 4"
      />
      <line
        className="sb-chk5-slash"
        x1={74}
        y1={52}
        x2={44}
        y2={196}
        stroke={P.terracotta}
        strokeWidth={4}
        strokeLinecap="round"
        opacity={0}
      />
      <g transform="translate(138 136)">
        <g className="sb-chk5-approve">
          <rect x={0} y={0} width={116} height={36} rx={18} fill={P.sageSoft} stroke={P.sage} strokeWidth={2.2} />
          <path d="M14 18 L19 23 L29 12" fill="none" stroke={P.sage} strokeWidth={2.8} strokeLinecap="round" />
          <text x={36} y={23} fontSize={15} fontWeight={800} fill={P.ink}>
            Approved
          </text>
        </g>
      </g>
      <g transform="translate(58 212)">
        <rect x={0} y={0} width={28} height={28} rx={6} fill={P.white} {...INK_STROKE} />
        <text x={14} y={20} textAnchor="middle" fontSize={16} fontWeight={800} fill={P.ink}>
          a
        </text>
        <text x={36} y={20} fontSize={14} fontWeight={700} fill={P.inkSoft}>
          accept
        </text>
        <rect x={98} y={0} width={28} height={28} rx={6} fill={P.white} {...INK_STROKE} />
        <text x={112} y={20} textAnchor="middle" fontSize={16} fontWeight={800} fill={P.ink}>
          r
        </text>
        <text x={134} y={20} fontSize={14} fontWeight={700} fill={P.inkSoft}>
          reject
        </text>
      </g>
    </g>
  );
}

function SideCheckCards(): ReactNode {
  return (
    <g transform="translate(558 72)">
      <g className="sb-chk5-uislash">
        <rect x={0} y={0} width={202} height={120} rx={12} fill={P.white} {...INK_STROKE} />
        <text x={16} y={30} fontSize={16} fontWeight={800} fill={P.ink}>
          UISlash check
        </text>
        <rect x={16} y={44} width={46} height={26} rx={5} fill={P.periwinkleSoft} stroke={P.periwinkle} strokeWidth={2} />
        <rect x={70} y={44} width={58} height={26} rx={5} fill={P.terracottaSoft} stroke={P.terracotta} strokeWidth={2} />
        <rect x={136} y={44} width={50} height={26} rx={5} fill={P.sageSoft} stroke={P.sage} strokeWidth={2} />
        <text x={16} y={100} fontSize={14} fontWeight={700} fill={P.sage}>
          No custom styling
        </text>
      </g>
      <g transform="translate(0 138)">
        <g className="sb-chk5-flakeslash">
          <rect x={0} y={0} width={202} height={120} rx={12} fill={P.white} {...INK_STROKE} />
          <text x={16} y={30} fontSize={16} fontWeight={800} fill={P.ink}>
            FlakeSlash
          </text>
          <g transform="translate(18 48)">
            <circle cx={14} cy={14} r={8} fill={P.sage} />
            <circle cx={46} cy={14} r={8} fill={P.sage} />
            <circle cx={78} cy={14} r={8} fill={P.sage} />
            <circle className="sb-chk5-flaky-dot" cx={110} cy={14} r={8} fill={P.terracotta} />
            <circle cx={142} cy={14} r={8} fill={P.sage} />
            <rect className="sb-chk5-scanbar" x={4} y={2} width={20} height={24} rx={4} fill={P.periwinkle} fillOpacity={0.35} />
          </g>
          <text x={16} y={100} fontSize={14} fontWeight={700} fill={P.terracotta}>
            Flaky test named
          </text>
        </g>
      </g>
    </g>
  );
}

export function SceneChecks(): ReactNode {
  return (
    <g>
      <GroundLine />
      <BuilderHandoff />
      <PixelSlashWindow />
      <SideCheckCards />
    </g>
  );
}

/* ==========================================================================
   SCENE 5: SKEPTICAL REVIEW (FINDINGS GO TO THE BUILDER)
   ========================================================================== */

function BuilderFixRecipient(): ReactNode {
  return (
    <g transform="translate(34 176)">
      <g className="sb-rev-builder">
        <ellipse cx={46} cy={186} rx={36} ry={7} fill={P.taupe} />
        <path d="M26 118 Q46 106 66 118 L70 182 L22 182 Z" fill={P.white} {...INK_STROKE} />
        <path d="M32 120 L60 120 L64 182 L28 182 Z" fill={P.terracotta} {...INK_STROKE} />
        <rect x={41} y={96} width={10} height={16} rx={3} fill={P.white} {...INK_STROKE} />
        <circle cx={46} cy={84} r={19} fill={P.white} {...INK_STROKE} />
        <path d="M28 82 Q36 62 58 68 Q65 72 63 80 Q53 74 38 78 Z" fill={P.ink} />
        <g className="sb-blink">
          <circle cx={43} cy={85} r={1.9} fill={P.ink} />
          <circle cx={54} cy={85} r={1.9} fill={P.ink} />
        </g>
        <path d="M44 93 Q49 97 54 93" fill="none" stroke={P.ink} strokeWidth={2} strokeLinecap="round" />
        <text x={46} y={214} textAnchor="middle" fontSize={16} fontWeight={700} fill={P.inkSoft}>
          Builder
        </text>
      </g>
    </g>
  );
}

function SecondReviewer(): ReactNode {
  return (
    <g transform="translate(560 100)" opacity={0.82}>
      <g className="sb-rev-peer">
        <circle cx={90} cy={60} r={24} fill={P.paperShade} stroke={P.periwinkle} strokeWidth={2.5} />
        <path d="M44 166 Q90 120 136 166 L146 264 L34 264 Z" fill={P.periwinkleSoft} stroke={P.periwinkle} strokeWidth={2.5} />
        <circle cx={20} cy={140} r={18} fill={P.white} stroke={P.periwinkle} strokeWidth={2.6} />
        <line x1={33} y1={154} x2={52} y2={174} stroke={P.periwinkle} strokeWidth={5} strokeLinecap="round" />
        <path d="M-2 138 Q-36 132 -70 144" fill="none" stroke={P.periwinkle} strokeWidth={2.2} strokeDasharray="5 5" />
        <text x={90} y={290} textAnchor="middle" fontSize={15} fontWeight={700} fill={P.inkSoft}>
          Second reviewer
        </text>
      </g>
    </g>
  );
}

function CodeReviewSheet(): ReactNode {
  return (
    <g transform="translate(182 112)">
      <polygon points="0,0 138,0 154,184 16,184" fill={P.white} {...INK_STROKE} />
      <rect x={20} y={22} width={40} height={8} rx={2} fill={P.terracotta} />
      <rect x={22} y={38} width={66} height={8} rx={2} fill={P.periwinkle} />
      <rect x={24} y={54} width={92} height={8} rx={2} fill={P.ink} />
      <rect x={26} y={70} width={58} height={8} rx={2} fill={P.periwinkle} />
      <rect x={28} y={86} width={86} height={8} rx={2} fill={P.ink} />
      <circle className="sb-rev-flaw-dot" cx={74} cy={104} r={11} fill={P.sage} />
      <rect x={30} y={102} width={92} height={8} rx={2} fill={P.ink} fillOpacity={0.75} />
      <rect x={32} y={122} width={68} height={8} rx={2} fill={P.periwinkle} />
      <rect x={34} y={138} width={88} height={8} rx={2} fill={P.ink} />
      <rect x={36} y={154} width={54} height={8} rx={2} fill={P.taupe} />
    </g>
  );
}

function SkepticalReviewerFigure(): ReactNode {
  return (
    <g transform="translate(332 74)">
      <path d="M24 290 L68 144 Q116 124 164 150 L202 290 Z" fill={P.ink} {...INK_STROKE} />
      <path d="M90 144 L142 144 L132 290 L98 290 Z" fill={P.terracotta} {...INK_STROKE} />
      <rect x={107} y={110} width={14} height={28} rx={4} fill={P.white} {...INK_STROKE} />
      <g className="sb-rev-head">
        <path d="M84 62 C84 26 146 26 146 66 C146 96 132 114 114 114 C96 114 84 96 84 62 Z" fill={P.white} {...INK_STROKE} />
        <path d="M80 62 C78 20 152 18 152 56 C138 42 106 46 80 62 Z" fill={P.ink} />
        <rect x={80} y={62} width={24} height={16} rx={4} fill={P.white} stroke={P.ink} strokeWidth={2.5} />
        <rect x={110} y={62} width={24} height={16} rx={4} fill={P.white} stroke={P.ink} strokeWidth={2.5} />
        <line x1={104} y1={68} x2={110} y2={68} stroke={P.ink} strokeWidth={2.5} />
        <g className="sb-blink">
          <circle cx={92} cy={70} r={2.2} fill={P.ink} />
          <circle cx={122} cy={70} r={2.2} fill={P.ink} />
        </g>
        <path d="M100 94 Q108 92 116 95" fill="none" stroke={P.ink} strokeWidth={2.2} strokeLinecap="round" />
      </g>
      <g className="sb-rev-lens-arm">
        <path d="M152 166 L92 208 L-26 186" fill="none" stroke={P.ink} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={-30} cy={184} r={9} fill={P.white} {...INK_STROKE} />
        <line x1={-36} y1={178} x2={-58} y2={156} stroke={P.periwinkle} strokeWidth={6} strokeLinecap="round" />
        <circle cx={-76} cy={142} r={25} fill={P.periwinkle} fillOpacity={0.35} stroke={P.ink} strokeWidth={3} />
        <path d="M-88 134 Q-80 124 -68 128" fill="none" stroke={P.white} strokeWidth={2.5} strokeLinecap="round" />
      </g>
      <text x={112} y={316} textAnchor="middle" fontSize={16} fontWeight={700} fill={P.inkSoft}>
        Reviewer
      </text>
    </g>
  );
}

export function SceneReviewer(): ReactNode {
  return (
    <g>
      <GroundLine />
      <BuilderFixRecipient />
      <SecondReviewer />
      <CodeReviewSheet />
      <g transform="translate(226 300) scale(0.92)">
        <BuiltPackage seals={2} />
      </g>
      <SkepticalReviewerFigure />
      <g transform="translate(36 34)">
        <g className="sb-rev-flag-note">
          <rect x={0} y={0} width={224} height={50} rx={12} fill={P.terracottaSoft} stroke={P.terracotta} strokeWidth={2.2} />
          <text x={16} y={22} fontSize={15} fontWeight={800} fill={P.ink}>
            Finding
          </text>
          <text x={16} y={40} fontSize={14} fontWeight={700} fill={P.inkSoft}>
            Builder fixes or answers
          </text>
        </g>
      </g>
      <g transform="translate(556 38)">
        <g className="sb-rev-clear-badge">
          <rect x={0} y={0} width={190} height={40} rx={20} fill={P.sageSoft} stroke={P.sage} strokeWidth={2.2} />
          <path d="M18 20 L23 25 L33 14" fill="none" stroke={P.sage} strokeWidth={2.8} strokeLinecap="round" />
          <text x={44} y={26} fontSize={16} fontWeight={800} fill={P.ink}>
            No finding open
          </text>
        </g>
      </g>
    </g>
  );
}
