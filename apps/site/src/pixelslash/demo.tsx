import { Code, Text } from "@slashsuite/ui-react";
import type { CSSProperties, ReactNode } from "react";
import hero from "@pixelslash-src/apps/site/src/content/hero.json";
import { psAsset } from "#/pixelslash/paths";

/*
 * The slash demo on the PixelSlash home: the run's Main shot wiped into its Branch shot by the slash,
 * with a box on each region the run found. The two shots and their description (hero.json) are
 * fetched from PixelSlash at the pinned commit. Every colour is the theme's (demo.css), so it follows
 * Slash Day and Slash Night.
 */

/** A style with CSS custom properties, which CSSProperties does not list. */
function vars(style: CSSProperties & Record<`--${string}`, number | string>): CSSProperties {
  return style;
}

const CHANGES = hero.regions.filter((region) => region.kind === "change");
const pct = (value: number, of: number): string => `${(value / of) * 100}%`;

/** Shot pixels of room kept around the change regions in the phone crop. */
const CROP_MARGIN = 32;

/**
 * The part of the shot a phone frames: the union of the change regions plus a margin, grown about its
 * centre to the shot's aspect ratio, then shifted (never shrunk) to lie inside the shot. If it
 * would not fit, the whole shot.
 */
function cropOf(regions: readonly { x: number; y: number; w: number; h: number }[]): {
  x: number;
  y: number;
  w: number;
  h: number;
} {
  const whole = { x: 0, y: 0, w: hero.width, h: hero.height };
  if (regions.length === 0) return whole;
  const left = Math.min(...regions.map((region) => region.x)) - CROP_MARGIN;
  const top = Math.min(...regions.map((region) => region.y)) - CROP_MARGIN;
  const right = Math.max(...regions.map((region) => region.x + region.w)) + CROP_MARGIN;
  const bottom = Math.max(...regions.map((region) => region.y + region.h)) + CROP_MARGIN;
  const ratio = hero.width / hero.height;
  const w = Math.max(right - left, (bottom - top) * ratio);
  const h = w / ratio;
  if (w >= hero.width || h >= hero.height) return whole;
  const x = Math.min(Math.max((left + right) / 2 - w / 2, 0), hero.width - w);
  const y = Math.min(Math.max((top + bottom) / 2 - h / 2, 0), hero.height - h);
  return { x, y, w, h };
}

const CROP = cropOf(CHANGES);

/** Main, wiped into Branch by the slash; the boxes are where the run found its regions. */
export function SlashDemo(): ReactNode {
  return (
    <figure className="ps-demo-figure" data-testid="slash-demo">
      <div className="ps-window">
        <div className="ps-window-bar">
          <span />
          <span />
          <span />
          <p>northwind.test/billing</p>
        </div>
        <div
          className="ps-demo"
          style={vars({
            aspectRatio: `${hero.width} / ${hero.height}`,
            "--shot-w": hero.width,
            "--shot-h": hero.height,
            "--crop-x": CROP.x,
            "--crop-y": CROP.y,
            "--crop-w": CROP.w,
            "--crop-h": CROP.h,
          })}
        >
          <div className="ps-stage">
            <img src={psAsset("/hero/main.png")} alt="" width={hero.width} height={hero.height} />
            <div className="ps-demo-branch">
              <img src={psAsset("/hero/branch.png")} alt="" width={hero.width} height={hero.height} />
              {CHANGES.map((region) => (
                <span
                  key={`${region.x},${region.y}`}
                  className="ps-region"
                  style={{
                    left: pct(region.x, hero.width),
                    top: pct(region.y, hero.height),
                    width: pct(region.w, hero.width),
                    height: pct(region.h, hero.height),
                  }}
                />
              ))}
            </div>
            <div className="ps-slash" aria-hidden="true" />
          </div>
          <span className="ps-chip ps-chip-main">Main</span>
          <span className="ps-chip ps-chip-branch">Branch</span>
        </div>
      </div>
      <div className="ps-readout" aria-hidden="true">
        <span className="ps-count" style={vars({ "--to": hero.changedPixels })} />
        <span>changed pixels</span>
        <span className="ps-dot" />
        <span>{CHANGES.length} regions</span>
      </div>
      <Text as="figcaption" align="center">
        A real run, not a mock-up: <Code>pixelslash --live --local</Code> on a billing page at {hero.width}×
        {hero.height}. It found {hero.changedPixels} changed pixels in {CHANGES.length} regions: the price, the
        button, the storage bar and its label.
      </Text>
    </figure>
  );
}
