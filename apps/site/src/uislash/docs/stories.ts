/**
 * Composes fetched UISlash story files from the pinned uislash commit without any @storybook
 * dependency: runs the story's render with its args wrapped by story decorators then meta decorators.
 */
import { createElement, type ComponentType, type ReactNode } from "react";
import { storyParts, type StoryParts } from "./source";

type Decorator = (Story: ComponentType, context: unknown) => ReactNode;

type StoryObj = {
  render?: (args: Record<string, unknown>, context: unknown) => ReactNode;
  args?: Record<string, unknown>;
  decorators?: Decorator[];
  parameters?: Record<string, unknown>;
};

type MetaObj = {
  decorators?: Decorator[];
  args?: Record<string, unknown>;
  parameters?: Record<string, unknown>;
};

type Csf = { default: MetaObj } & Record<string, unknown>;

const modules = import.meta.glob<Csf>("../../../.sources/uislash/apps/storybook/src/**/*.stories.tsx", {
  eager: true,
});
const sources = import.meta.glob<string>("../../../.sources/uislash/apps/storybook/src/**/*.stories.tsx", {
  eager: true,
  query: "?raw",
  import: "default",
});

const stemOf = (path: string): string => path.split("/").at(-1)?.replace(/\.stories\.tsx$/, "") ?? path;
const byStem = new Map(Object.entries(modules).map(([path, mod]) => [stemOf(path), mod]));
const rawByStem = new Map(Object.entries(sources).map(([path, raw]) => [stemOf(path), raw]));

function isStoryObj(value: unknown): value is StoryObj {
  return typeof value === "object" && value !== null && "render" in value && typeof value.render === "function";
}

function compose(meta: MetaObj, story: StoryObj): ComponentType {
  const args = { ...meta.args, ...story.args };
  const context = { args, parameters: { ...meta.parameters, ...story.parameters }, globals: {} };
  let Current: ComponentType = () => story.render?.(args, context) ?? null;
  for (const decorate of [...(story.decorators ?? []), ...(meta.decorators ?? [])]) {
    const Inner = Current;
    Current = (): ReactNode => decorate(Inner, context);
  }
  const Composed = Current;
  return () => createElement(Composed);
}

export type DocStory = StoryParts & { id: string; Story: ComponentType };

export function findStory(id: string): DocStory | undefined {
  const [stem, name] = id.split("/");
  if (stem === undefined || name === undefined) return undefined;
  const mod = byStem.get(stem);
  const candidate = mod?.[name];
  const raw = rawByStem.get(stem);
  const parts = raw === undefined ? undefined : storyParts(raw, name);
  if (mod === undefined || !isStoryObj(candidate) || parts === undefined) return undefined;
  return { id, Story: compose(mod.default, candidate), ...parts };
}
