import { Container, Text, TextLink } from "@slashsuite/ui-react";
import { type CSSProperties, type KeyboardEvent, type ReactNode, useRef, useState, useSyncExternalStore } from "react";
import { SceneBuilder } from "#/how-it-works/scenes-builder";
import { SceneArchitect, SceneMuse } from "#/how-it-works/scenes-early";
import { SceneColdRead } from "#/how-it-works/scenes-middle";
import { SceneRollout, SceneSentinel } from "#/how-it-works/scenes-release";
import { SceneRetro } from "#/how-it-works/scenes-retro";
import { SceneChecks, SceneReviewer } from "#/how-it-works/scenes-review";
import {
  PALETTE,
  SCENE_DURATION_MS,
  STORYBOOK_LABEL,
  STORYBOOK_PRODUCTS,
  STORYBOOK_SCENES,
  productHref,
  type StorybookScene,
  type StorybookSceneId,
} from "#/how-it-works/storybook-data";
import { useStorybookPlayback } from "#/how-it-works/storybook-playback";
import { Rich } from "#/shell/rich-text";

const NOOP_SUBSCRIBE = (): (() => void) => () => {};
const CLIENT_READY = (): boolean => true;
const SERVER_READY = (): boolean => false;

const SCENE_COMPONENTS: Record<StorybookSceneId, () => ReactNode> = {
  explore: SceneMuse,
  shape: SceneArchitect,
  "cold-read": SceneColdRead,
  build: SceneBuilder,
  review: SceneReviewer,
  checks: SceneChecks,
  ship: SceneSentinel,
  rollout: SceneRollout,
  retro: SceneRetro,
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

const captionText = (scene: StorybookScene): string =>
  typeof scene.caption === "string" ? scene.caption : scene.caption.text;

function StorybookCaption({ scene }: { scene: StorybookScene }): ReactNode {
  return (
    <figcaption className="sb-caption-bar">
      <div className="sb-caption-head">
        <h2 className="sb-scene-title">{scene.title}</h2>
        {scene.products.length === 0 ? null : (
          <ul className="sb-tools" aria-label="Products in this scene">
            {scene.products.map((product) => (
              <li key={product} className="sb-tool-chip">
                <TextLink href={productHref(product)}>{product}</TextLink>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Text>
        <Rich text={captionText(scene)} />
      </Text>
    </figcaption>
  );
}

/** The product bar: pick a product to mark the scenes it appears in and jump to the first of them. */
function StorybookProducts({
  highlight,
  onPick,
}: {
  highlight: string | null;
  onPick: (name: string) => void;
}): ReactNode {
  return (
    <div className="sb-products" role="group" aria-label="Show the scenes a product appears in">
      {STORYBOOK_PRODUCTS.map((product) => (
        <button
          key={product.name}
          type="button"
          className="sb-product-btn"
          data-storybook-product={product.name}
          aria-pressed={highlight === product.name}
          onClick={() => onPick(product.name)}
        >
          {product.name}
        </button>
      ))}
    </div>
  );
}

function StorybookChapters({
  activeIndex,
  highlight,
  onSelect,
}: {
  activeIndex: number;
  highlight: string | null;
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
          data-highlight={
            highlight !== null && item.products.some((product) => product === highlight) ? "true" : undefined
          }
          aria-current={idx === activeIndex ? "step" : undefined}
          onClick={() => onSelect(idx)}
        >
          <span className="sb-chapter-num">0{item.chapter}</span>
          <span className="sb-chapter-name">{item.title}</span>
        </button>
      ))}
    </div>
  );
}

function StorybookNoScript(): ReactNode {
  return (
    <noscript>
      <style>{".sb-controls,.sb-chapters,.sb-products,.sb-progress-track{display:none}"}</style>
      <ol className="sb-noscript-list">
        {STORYBOOK_SCENES.map((item) => (
          <li key={item.id}>
            <strong>{item.title}:</strong> <Rich text={captionText(item)} />
          </li>
        ))}
      </ol>
    </noscript>
  );
}

/** The product the bar has picked, if any; picking one jumps to its first scene, picking it again clears it. */
function useProductHighlight(selectScene: (index: number) => void): [string | null, (name: string) => void] {
  const [highlight, setHighlight] = useState<string | null>(null);
  const pickProduct = (name: string): void => {
    if (highlight === name) {
      setHighlight(null);
      return;
    }
    setHighlight(name);
    const first = STORYBOOK_SCENES.findIndex((item) => item.products.some((product) => product === name));
    if (first >= 0) selectScene(first);
  };
  return [highlight, pickProduct];
}

export function Storybook(): ReactNode {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ready = useSyncExternalStore(NOOP_SUBSCRIBE, CLIENT_READY, SERVER_READY);
  const total = STORYBOOK_SCENES.length;
  const { index, isPlaying, stageAnimated, stagePaused, liveText, runKey, selectScene, togglePlay } =
    useStorybookPlayback(containerRef, total);

  const [highlight, pickProduct] = useProductHighlight(selectScene);

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
      <StorybookProducts highlight={highlight} onPick={pickProduct} />
      <StorybookChapters activeIndex={index} highlight={highlight} onSelect={selectScene} />
      <p className="sb-sr-only" aria-live="polite" aria-atomic="true">
        {liveText}
      </p>
      <StorybookNoScript />
    </div>
  );
}

export function StorybookSection(): ReactNode {
  return (
    <section className="py-12" aria-label={STORYBOOK_LABEL} data-home-section="storybook">
      <Container>
        <Storybook />
      </Container>
    </section>
  );
}
