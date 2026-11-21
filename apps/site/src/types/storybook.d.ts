/**
 * Minimal ambient type stub for @storybook/react-vite so fetched story files typecheck without
 * adding Storybook as a dependency.
 */
declare module "@storybook/react-vite" {
  import type { ComponentProps, ComponentType, ReactNode } from "react";

  type PropsOf<T> = T extends ComponentType<infer P> ? Partial<P> : Record<string, unknown>;
  type StoryContext = {
    canvasElement: HTMLElement;
    args: Record<string, unknown>;
    parameters?: Record<string, unknown>;
    globals?: Record<string, unknown>;
  };

  export type Decorator = (Story: ComponentType, context: StoryContext) => ReactNode;

  type Common<T> = {
    decorators?: Decorator[];
    args?: PropsOf<T> & Record<string, unknown>;
    parameters?: Record<string, unknown>;
    globals?: Record<string, unknown>;
    beforeEach?: (context: StoryContext) => unknown;
    play?: (context: StoryContext) => unknown;
    tags?: string[];
  };

  export type Meta<T = ComponentType<Record<string, unknown>>> = Common<T> & {
    title?: string;
    component?: T;
    render?: (args: ComponentProps<T & ComponentType>, context?: StoryContext) => ReactNode;
  };

  export type StoryObj<T = ComponentType<Record<string, unknown>>> = Common<T> & {
    name?: string;
    render?: (args: PropsOf<T> & Record<string, unknown>, context?: StoryContext) => ReactNode;
  };
}
