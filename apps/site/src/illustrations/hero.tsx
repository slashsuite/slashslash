import type { ReactNode } from "react";
import { PRODUCTS } from "#/content/products";
import { PIPELINE } from "#/content/story";
import { markFor } from "#/shell/sections";

/*
 * The suite home's hero visual (hero.css): a compact horizontal strip of the five pipeline stages
 * (Planned, Written, Built and tested, Reviewed, Released) showing each Slash product's mark at the
 * stage it owns. Uses only theme variables so it follows Slash Day and Slash Night. With no script or
 * reduced motion, every stage sits in its finished state.
 */

export const HERO_STRIP_LABEL =
  "The Slash pipeline from idea to release: Planned, Written, Built and tested, Reviewed, and Released, with the products at each step.";

export function HeroPanes(): ReactNode {
  return (
    <ol className="pipeline-strip" data-play="" data-testid="hero-pipeline" aria-label={HERO_STRIP_LABEL}>
      {PIPELINE.stages.map((stage, index) => (
        <li className="pipeline-stage" key={stage.name} style={{ "--i": index }}>
          <div className="pipeline-stage-head">
            <span className="pipeline-stage-num" aria-hidden="true">
              {index + 1}
            </span>
            <span className="pipeline-stage-name">{stage.name}</span>
          </div>
          <ul className="pipeline-stage-tools">
            {stage.tools.map(({ tool }) => {
              const planned = PRODUCTS.find((item) => item.name === tool)?.stage === "planned";
              return (
                <li
                  key={tool}
                  className={planned ? "pipeline-chip is-planned" : "pipeline-chip"}
                >
                  <img src={markFor(tool)} alt="" width={16} height={16} />
                  <span>{tool}</span>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ol>
  );
}
