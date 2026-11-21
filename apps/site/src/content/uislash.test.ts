import { describe, expect, test } from "vitest";
import { PRODUCTS } from "#/content/products";
import { HERO, PIPELINE, STANDS } from "#/content/story";

const written = PIPELINE.stages.find((stage) => stage.name === "Written");

describe("UISlash on the site, in the approved words", () => {
  test("its home row under Written is the approved paragraph, word for word, after OmniSlash's", () => {
    expect(written?.tools.map(({ tool, does }) => ({ tool, does: does.text }))).toEqual([
      {
        tool: "OmniSlash",
        does: "OmniSlash opens each builder in a git worktree on the ticket's own branch, and a lease lets only one holder work a ticket or a worktree at a time.",
      },
      {
        tool: "UISlash",
        does: "UISlash gives the agent React components that take props alone and accept no className or style, so it cannot style a page off the design. Switching theme changes the whole site with no component change. It has seven themes, each checked against WCAG AA contrast.",
      },
    ]);
  });

  test("its PRODUCTS entry is the approved question and summary, word for word", () => {
    const entry = PRODUCTS.find((product) => product.name === "UISlash");
    expect({ ...entry, question: entry?.question.text, summary: entry?.summary.map((claim) => claim.text) }).toEqual({
      name: "UISlash",
      stage: "alpha",
      facts: "uislash",
      question: "Can the agent build the UI without writing its own CSS?",
      summary: [
        "React components (@slashsuite/ui-react) and seven themes (@slashsuite/themes: four light, three dark, one CSS file each), and a site is built from them with props alone because no exported component accepts className or style.",
        "Early (every package at 0.x) and MIT licensed. Every theme is tested against WCAG AA contrast, a reusable GitHub workflow runs a rule check that fails the pull request plus an advisory model review, and the docs and an llms.txt for agents are at hack-cove.com/ui/.",
      ],
    });
  });

  test("the Written step's text is the approved line, word for word", () => {
    expect(written?.text.text).toBe(
      "An agent builds the ticket on its own branch, in its own worktree, from ready parts.",
    );
  });

  test("the hero lead names the parts UISlash supplies, word for word", () => {
    expect(HERO.lead.text).toBe(
      "OmniSlash carries the work. It refuses to start an agent on a ticket that nobody has drilled. It builds each ticket on its own branch. It has the pull request gated before it merges. The other tools check the work on the way: the parts it is built from, the builds and tests, the screens it changes and the release. Each tool does one job, so you can start with one and leave the rest.",
    );
  });

  test("the alphas paragraph names UISlash first and says it stores nothing, word for word", () => {
    expect(STANDS.stages.text).toBe(
      "UISlash, TaskSlash, FlakeSlash, PixelSlash, ToggleSlash and OmniSlash are alphas. Expect the screens, the components and the commands to change, and expect bugs. Between alpha versions, what a tool has stored may be reset: TaskSlash's job history, FlakeSlash's scans and issue corrections, PixelSlash's builds and approvals, ToggleSlash's flags and audit trail, and OmniSlash's work items. UISlash stores nothing.",
    );
  });
});
