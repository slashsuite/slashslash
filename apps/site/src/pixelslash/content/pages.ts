import type { Claim } from "#/content/facts";

/**
 * Every page of the PixelSlash site, in nav order. This site serves the four marketing pages, each with a
 * description (a Claim citing PixelSlash's facts), and the security and self-host pages, which take theirs
 * from their own document (pixelslash/doc/docs.ts). The docs are built from the docs map (pixelslash/doc/docs-map.ts).
 */
type Page = { to: string; label: string; title: string; description?: Claim };

const LIST = [
  {
    to: "/",
    label: "Home",
    title: "PixelSlash: visual review for the web",
    description: {
      text: "PixelSlash diffs Main and Branch shots with a Rust WebAssembly perceptual engine, writes a local report, and works with a review app and MCP server.",
      facts: ["pixelslash/what-it-is", "pixelslash/wasm-diff-engine", "pixelslash/compare-two-pngs", "pixelslash/upload-to-review-app", "pixelslash/mcp-server"],
    },
  },
  {
    to: "/how-it-works",
    label: "How it works",
    title: "How it works · PixelSlash",
    description: {
      text: "One PixelSlash run, step by step: capture Main and Branch, diff the pixels perceptually, and read the report it writes.",
      facts: ["pixelslash/compare-two-urls", "pixelslash/perceptual-diff", "pixelslash/compare-two-pngs"],
    },
  },
  {
    to: "/docs",
    label: "Docs",
    title: "Docs · PixelSlash",
  },
  {
    to: "/self-host",
    label: "Self-host",
    title: "Self-host · PixelSlash",
  },
  {
    to: "/compare",
    label: "Compare",
    title: "How we compare · PixelSlash",
    description: {
      text: "PixelSlash against five other visual testing tools, capability by capability, with the rows where it is behind left in.",
      facts: ["pixelslash/what-it-is"],
    },
  },
  {
    to: "/pricing",
    label: "Pricing",
    title: "Pricing · PixelSlash",
    description: {
      text: "PixelSlash is free and you can run all of it yourself. There is no paid plan to buy; the whole product is in the source-available repository.",
      facts: ["pixelslash/licence", "pixelslash/self-host-docker", "pixelslash/self-host-cloudflare", "pixelslash/from-source"],
    },
  },
  {
    to: "/security",
    label: "Security",
    title: "Security · PixelSlash",
  },
] as const satisfies readonly Page[];

/** A PixelSlash page's path, as the ported code names it (`/pricing`). */
export type SitePath = (typeof LIST)[number]["to"];

export const PAGES: readonly (Page & { to: SitePath })[] = LIST;
