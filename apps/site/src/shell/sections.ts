/**
 * The site's sections: the suite and each tool with a page. Each names the pair of @slashsuite/themes
 * scopes its pages wear (light and dark), its mark, its home and, for a tool, its own pages for the
 * second header row. The shell, the layout and the head script read only this.
 */
import { FLAKESLASH_REPO_URL } from "#/content/flakeslash";
import { SITE_NAME } from "#/content/site";

export type SubPage = {
  label: string;
  href: string;
  /** A page on another site (the tool's docs), opened in a new tab. */
  external?: boolean;
};

export type Section = {
  /** The scope class on <html> in Slash Day (the light scheme) and in Slash Night (the dark one). */
  day: string;
  night: string;
  /** The 16 px mark, under public/. */
  mark: string;
  name: string;
  home: string;
  /** The tool's own pages, the header's second row. Empty for the suite. */
  pages: readonly SubPage[];
};

/** A product's mark by its name, under public/brand: every section and every product in PRODUCTS has one. */
export const markFor = (name: string): string => `/brand/${name.toLowerCase()}-mark.svg`;

export const SECTIONS = {
  suite: {
    day: "slash-suite",
    night: "slash-suite-dark",
    mark: "/brand/slash-mark.svg",
    name: SITE_NAME,
    home: "/",
    pages: [],
  },
  pixelslash: {
    // Becomes slash-pixelslash / slash-pixelslash-dark when @slashsuite/themes ships slash-pixelslash.css.
    day: "slash-suite",
    night: "slash-suite-dark",
    mark: markFor("PixelSlash"),
    name: "PixelSlash",
    home: "/pixelslash",
    pages: [
      { label: "Overview", href: "/pixelslash" },
      { label: "How it works", href: "/pixelslash/how-it-works" },
      { label: "Compare", href: "/pixelslash/compare" },
      { label: "Pricing", href: "/pixelslash/pricing" },
      { label: "Docs", href: "/pixelslash/docs" },
    ],
  },
  flakeslash: {
    // Becomes slash-flakeslash / slash-flakeslash-dark when @slashsuite/themes ships slash-flakeslash.css.
    day: "slash-suite",
    night: "slash-suite-dark",
    mark: markFor("FlakeSlash"),
    name: "FlakeSlash",
    home: "/flakeslash",
    pages: [
      { label: "Overview", href: "/flakeslash" },
      { label: "Docs", href: `${FLAKESLASH_REPO_URL}/blob/main/docs/getting-started.md`, external: true },
    ],
  },
  toggleslash: {
    // Becomes slash-toggleslash / slash-toggleslash-dark when @slashsuite/themes ships slash-toggleslash.css.
    day: "slash-suite",
    night: "slash-suite-dark",
    mark: markFor("ToggleSlash"),
    name: "ToggleSlash",
    home: "/toggleslash",
    pages: [{ label: "Overview", href: "/toggleslash" }],
  },
  taskslash: {
    // Becomes slash-taskslash / slash-taskslash-dark when @slashsuite/themes ships slash-taskslash.css.
    day: "slash-suite",
    night: "slash-suite-dark",
    mark: markFor("TaskSlash"),
    name: "TaskSlash",
    home: "/taskslash",
    pages: [{ label: "Overview", href: "/taskslash" }],
  },
  omnislash: {
    // Becomes slash-omnislash / slash-omnislash-dark when @slashsuite/themes ships slash-omnislash.css.
    day: "slash-suite",
    night: "slash-suite-dark",
    mark: markFor("OmniSlash"),
    name: "OmniSlash",
    home: "/omnislash",
    pages: [{ label: "Overview", href: "/omnislash" }],
  },
  uislash: {
    // Becomes slash-uislash / slash-uislash-dark when @slashsuite/themes ships slash-uislash.css.
    day: "slash-suite",
    night: "slash-suite-dark",
    mark: markFor("UISlash"),
    name: "UISlash",
    home: "/uislash",
    pages: [
      { label: "Components", href: "/uislash" },
      { label: "llms.txt", href: "/uislash/llms.txt" },
    ],
  },
} as const satisfies Record<string, Section>;

export type SectionKey = keyof typeof SECTIONS;

/** Whether a string names a section: a tool's lowercase name, or "suite". */
export function isSectionKey(key: string): key is SectionKey {
  return Object.hasOwn(SECTIONS, key);
}

/** The tools in the switcher: every section but the suite, in SECTIONS' order. */
export const TOOL_KEYS = Object.keys(SECTIONS)
  .filter(isSectionKey)
  .filter((key): key is Exclude<SectionKey, "suite"> => key !== "suite");

