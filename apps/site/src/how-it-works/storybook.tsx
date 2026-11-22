import { Text } from "@slashsuite/ui-react";
import { type CSSProperties, type KeyboardEvent, type ReactNode, useRef, useSyncExternalStore } from "react";
import { HomeSection } from "#/home/sections";
import { SceneBuilder } from "#/how-it-works/scenes-builder";
import { SceneArchitect, SceneMuse } from "#/how-it-works/scenes-early";
import { SceneChecker } from "#/how-it-works/scenes-middle";
import { SceneRollout, SceneSentinel } from "#/how-it-works/scenes-release";
import { SceneChecks, SceneReviewer } from "#/how-it-works/scenes-review";
import {
  PALETTE,
  SCENE_DURATION_MS,
  STORYBOOK_INTRO,
  STORYBOOK_SCENES,
  STORYBOOK_TITLE,
  type StorybookScene,
  type StorybookSceneId,
} from "#/how-it-works/storybook-data";
import { useStorybookPlayback } from "#/how-it-works/storybook-playback";

const NOOP_SUBSCRIBE = (): (() => void) => () => {};
const CLIENT_READY = (): boolean => true;
const SERVER_READY = (): boolean => false;

const SCENE_COMPONENTS: Record<StorybookSceneId, () => ReactNode> = {
  muse: SceneMuse,
  architect: SceneArchitect,
  checker: SceneChecker,
  builder: SceneBuilder,
  checks: SceneChecks,
  reviewer: SceneReviewer,
  sentinel: SceneSentinel,
  rollout: SceneRollout,
};

function vars(style: CSSProperties & Record<`--${string}`, number | string>): CSSProperties {
  return style;
}

function StorybookHeader({
  scene,
  total,
  isPlaying,
  onPrev,
  onTogglePlay,
  onNext,
}: {
  scene: StorybookScene;
  total: number;
  isPlaying: boolean;
  onPrev: () => void;
  onTogglePlay: () => void;
  onNext: () => void;
}): ReactNode {
  return (
    <div className="sb-header">
      <div className="sb-meta">
        <span className="sb-chapter-pill">
          Scene {scene.chapter} of {total}
        </span>
        <span className="sb-steps-label">{scene.stepsLabel}</span>
      </div>
      <div className="sb-controls" role="group" aria-label="Storybook playback controls">
        <button type="button" className="sb-btn" onClick={onPrev} aria-label="Previous scene">
          Previous
        </button>
        <button
          type="button"
          className="sb-btn sb-btn-primary"
          onClick={onTogglePlay}
          aria-label={isPlaying ? "Pause animation" : "Play animation"}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button type="button" className="sb-btn" onClick={onNext} aria-label="Next scene">
          Next
        </button>
      </div>
    </div>
  );
}

function StorybookCaption({ scene }: { scene: StorybookScene }): ReactNode {
  return (
    <figcaption className="sb-caption-bar">
      <div className="sb-caption-head">
        <h3 className="sb-scene-title">
          {scene.title} ({scene.role})
        </h3>
        <ul className="sb-tools" aria-label="Slash tools in this scene">
          {scene.tools.map((tool) => (
            <li key={tool} className="sb-tool-chip">
              {tool}
            </li>
          ))}
        </ul>
      </div>
      <Text>{scene.caption.text}</Text>
    </figcaption>
  );
}

function StorybookChapters({
  activeIndex,
  onSelect,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
}): ReactNode {
  return (
    <div className="sb-chapters" role="group" aria-label="Storybook scenes">
      {STORYBOOK_SCENES.map((item, idx) => (
        <button
          key={item.id}
          type="button"
          className="sb-chapter-btn"
          data-storybook-chapter={item.id}
          aria-current={idx === activeIndex ? "step" : undefined}
          onClick={() => onSelect(idx)}
        >
          <span className="sb-chapter-num">0{item.chapter}</span>
          <span className="sb-chapter-name">{item.shortLabel}</span>
        </button>
      ))}
    </div>
  );
}

function StorybookNoScript(): ReactNode {
  return (
    <noscript>
      <style>{".sb-controls,.sb-chapters,.sb-progress-track{display:none}"}</style>
      <ol className="sb-noscript-list">
        {STORYBOOK_SCENES.map((item) => (
          <li key={item.id}>
            <strong>
              {item.title} ({item.role}):
            </strong>{" "}
            {item.caption.text}
          </li>
        ))}
      </ol>
    </noscript>
  );
}

export function Storybook(): ReactNode {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ready = useSyncExternalStore(NOOP_SUBSCRIBE, CLIENT_READY, SERVER_READY);
  const total = STORYBOOK_SCENES.length;
  const { index, isPlaying, stageAnimated, stagePaused, liveText, runKey, selectScene, togglePlay } =
    useStorybookPlayback(containerRef, total);

  const scene = STORYBOOK_SCENES[index] ?? STORYBOOK_SCENES[0];
  if (scene === undefined) return null;
  const SceneIllustration = SCENE_COMPONENTS[scene.id];

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key === "ArrowRight") selectScene(index + 1);
    else if (event.key === "ArrowLeft") selectScene(index - 1);
  };

  const stageClass = ["sb-stage", stageAnimated ? "is-animated" : "", stageAnimated && stagePaused ? "is-paused" : ""]
    .filter(Boolean)
    .join(" ");
  const fillClass = [
    "sb-progress-fill",
    stageAnimated ? "is-running" : "",
    stageAnimated && stagePaused ? "is-paused" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      className="sb-theatre"
      data-testid="how-it-works-storybook"
      data-ready={ready ? "true" : undefined}
      data-scene={scene.id}
      data-playing={String(isPlaying)}
      data-animated={String(stageAnimated)}
      data-paused={String(stagePaused)}
      onKeyDown={handleKeyDown}
    >
      <StorybookHeader
        scene={scene}
        total={total}
        isPlaying={isPlaying}
        onPrev={() => selectScene(index - 1)}
        onTogglePlay={togglePlay}
        onNext={() => selectScene(index + 1)}
      />
      <figure className="sb-figure">
        <div className="sb-stage-wrap">
          <svg
            key={`${scene.id}-${runKey}`}
            className={stageClass}
            viewBox="0 0 800 420"
            role="img"
            aria-label={scene.altSummary}
          >
            <rect x={0} y={0} width={800} height={420} fill={PALETTE.paper} />
            <SceneIllustration />
          </svg>
          <div className="sb-progress-track" aria-hidden="true">
            <div
              key={`bar-${scene.id}-${runKey}`}
              className={fillClass}
              style={vars({ "--sb-duration": `${SCENE_DURATION_MS}ms` })}
            />
          </div>
        </div>
        <StorybookCaption scene={scene} />
      </figure>
      <StorybookChapters activeIndex={index} onSelect={selectScene} />
      <p className="sb-sr-only" aria-live="polite" aria-atomic="true">
        {liveText}
      </p>
      <StorybookNoScript />
    </div>
  );
}

export function StorybookSection(): ReactNode {
  return (
    <HomeSection id="storybook" title={STORYBOOK_TITLE}>
      <Text>{STORYBOOK_INTRO}</Text>
      <Storybook />
    </HomeSection>
  );
}
