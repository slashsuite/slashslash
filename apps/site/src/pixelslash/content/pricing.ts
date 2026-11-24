import type { Claim, FactsProduct } from "#/content/facts";

/*
 * The pricing page's words. Each product claim cites PixelSlash's facts (facts.built.test.ts); the licence card
 * shows the facts file's own licence line. PixelSlash costs nothing today and there is no paid plan to buy.
 */

/** The page's one statement, and the sentence under it. */
export const STATEMENT: Claim = {
  text: "Free, and you can run all of it yourself.",
  facts: ["pixelslash/self-host-docker", "pixelslash/self-host-cloudflare", "pixelslash/from-source"],
};
export const LEAD: Claim = {
  text: "Try the hosted review app at pixelslash.dev for free, or run the whole stack yourself. There is no paid plan to buy and no feature held back.",
  facts: ["pixelslash/licence", "pixelslash/hosted-review-app", "pixelslash/self-host-docker"],
};

/** The one action the page asks for, and where it goes. */
export const ACTION = { label: "Self-host it", href: "/self-host" } as const;

/** The one promise about paying: no feature sits behind a paid plan. */
export const COMMITMENT: Claim = {
  text: "No feature will ever sit behind a paid plan.",
  facts: ["pixelslash/licence"],
};

/** What the licence allows and forbids, in the callout after the facts (PS-386). */
export const LICENCE_BRIEF: Claim = {
  text: "The CLI, the diff engine and the review app are all in the repository, with nothing held back. You may use, copy and modify it. You may not offer it to others as a hosted or managed service that gives them a substantial set of its features.",
  facts: ["pixelslash/licence"],
};

/** The cards after the hero: the licence, read from the facts file, then where it runs. */
export const CARDS = [
  { title: "Free, and source available", icon: "branch", body: { licence: "pixelslash" satisfies FactsProduct } },
  {
    title: "Self-host all of it",
    icon: "self-host",
    body: {
      text: "The review app runs in Docker, on your own Cloudflare account or on your own box. The self-host guide covers each.",
      facts: ["pixelslash/self-host-docker", "pixelslash/self-host-cloudflare"],
    } satisfies Claim,
  },
] as const;
