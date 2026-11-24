import { useEffect } from "react";
import type { ReactNode } from "react";
import { Island } from "#/shell/island";

/**
 * Motion on scroll. It only adds classes. `.motion` itself is set before first
 * paint by the page's head script (MOTION_SCRIPT), and only when the reader allows motion; with no JS,
 * or with reduced motion, it is never set, so every drawing shows its finished state.
 * `data-motion-ready` tells that script the island has hydrated.
 *
 * - `[data-lit]` gets `.lit` while it is in view, and loses it again.
 * - `[data-play]` gets `.played` the first time it comes into view, and keeps it: its animation plays
 *   once and ends in the finished state, which is also its base style.
 */
export function Motion(): ReactNode {
  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return undefined;
    document.documentElement.dataset["motionReady"] = "";
    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("lit", entry.isIntersecting);
        }
      },
      { rootMargin: "-20% 0px -20% 0px" },
    );
    for (const element of document.querySelectorAll("[data-lit]")) seen.observe(element);
    const once = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("played");
          once.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    for (const element of document.querySelectorAll("[data-play]")) once.observe(element);
    return () => {
      seen.disconnect();
      once.disconnect();
    };
  }, []);
  return <Island />;
}

/**
 * Before first paint: `motion` on <html> when the reader allows motion, so a drawing starts in its start
 * frame. If the Motion island has not mounted within 3 s (bundle blocked or broken), it takes `motion`
 * off again, so the drawing is never stuck in its start frame.
 */
export const MOTION_SCRIPT = `(function(){var r=document.documentElement;if(matchMedia("(prefers-reduced-motion: no-preference)").matches){r.classList.add("motion");setTimeout(function(){if(!("motionReady" in r.dataset))r.classList.remove("motion")},3000)}})()`;
