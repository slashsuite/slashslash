/**
 * The /uislash Getting started copy, read directly from uislash's fetched packages/ui-react/docs/ui.ts with only
 * references to the old site and package scope replaced.
 */
import { ui as rawUi } from "@uislash-src/packages/ui-react/docs/ui";

/** Replaces old site and package references without rewriting any prose. */
export function swapUiReferences(text: string): string {
  return text
    .replaceAll("hack-cove.com/ui/", "slashslash.build/uislash/")
    .replaceAll("/ui/", "/uislash/")
    .replaceAll("@hackcove", "@slashsuite");
}

function swapCode(code: string | readonly string[]): string | string[] {
  return typeof code === "string" ? swapUiReferences(code) : code.map(swapUiReferences);
}

export const UISLASH_UI = {
  subtitle: swapUiReferences(rawUi.subtitle),
  intro: rawUi.intro.map(swapUiReferences),
  install: {
    title: swapUiReferences(rawUi.install.title),
    steps: rawUi.install.steps.map((step) => ({
      text: swapUiReferences(step.text),
      ...("label" in step ? { label: step.label } : {}),
      ...("language" in step ? { language: step.language } : {}),
      ...("code" in step ? { code: swapCode(step.code) } : {}),
    })),
  },
  themes: {
    title: swapUiReferences(rawUi.themes.title),
    intro: swapUiReferences(rawUi.themes.intro),
    themeLabel: swapUiReferences(rawUi.themes.themeLabel),
    importLabel: swapUiReferences(rawUi.themes.importLabel),
    scopeLabel: swapUiReferences(rawUi.themes.scopeLabel),
  },
  links: {
    title: swapUiReferences(rawUi.links.title),
    items: rawUi.links.items.map((item) => ({
      label: swapUiReferences(item.label),
      href: swapUiReferences(item.href),
    })),
  },
  components: {
    title: swapUiReferences(rawUi.components.title),
    intro: swapUiReferences(rawUi.components.intro),
  },
  docs: {
    title: swapUiReferences(rawUi.docs.title),
    status: rawUi.docs.status,
    text: swapUiReferences(rawUi.docs.text),
    links: rawUi.docs.links.map((item) => ({
      label: swapUiReferences(item.label),
      href: swapUiReferences(item.href),
    })),
  },
};
