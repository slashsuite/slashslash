/**
 * The themes the /uislash page lists, read from the installed @slashsuite/themes package at build
 * time: one per CSS file, with each theme's scope class read from its CSS.
 */
import { readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";

export type UislashTheme = {
  /** The theme's id: its file name without `.css`. */
  id: string;
  /** What a consumer imports. */
  specifier: string;
  /** The id as a title. */
  title: string;
  /** The class that goes on `<html>`: the first top-level class rule in the theme's CSS file. */
  scopeClass: string;
};

const require = createRequire(import.meta.url);
const THEMES_DIR = dirname(require.resolve("@slashsuite/themes/package.json"));

const titleOf = (slug: string): string =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

function themeScope(css: string): string {
  return /(?:^|[;}])\s*\.([\w-]+)\s*\{/.exec(css.replace(/\/\*[\s\S]*?\*\//g, ""))?.[1] ?? "";
}

export const UISLASH_THEMES: readonly UislashTheme[] = readdirSync(THEMES_DIR)
  .filter((name) => name.endsWith(".css"))
  .map((name) => name.slice(0, -".css".length))
  .toSorted((a, b) => a.localeCompare(b, "en"))
  .map((id) => ({
    id,
    specifier: `@slashsuite/themes/${id}.css`,
    title: titleOf(id),
    scopeClass: themeScope(readFileSync(resolve(THEMES_DIR, `${id}.css`), "utf8")),
  }));
