import { describe, expect, test } from "vitest";
import { PRODUCTS } from "#/content/products";
import { HERO, PIPELINE, STANDS } from "#/content/story";

const written = PIPELINE.stages.find((stage) => stage.name === "Written");

describe("UISlash on the site, in the approved words", () => {
  test("its home row under Written is the approved paragraph, word for word, after OmniSlash's", () => {
    expect(written?.tools.map(({ tool, does }) => ({ tool, does: does.text }))).toEqual([
      {
        tool: "OmniSlash",
        does: "Opens each coding agent in its own git worktree on the ticket's branch, locked with a lease so two agents cannot edit the same ticket or checkout at once.",
      },
      {
        tool: "UISlash",
        does: "React 19 components and seven WCAG AA checked themes where no exported component accepts className or style. Switching one CSS class on the page reskins the whole site with no component change.",
      },
    ]);
  });

  test("its PRODUCTS entry is the approved question and summary, word for word", () => {
    const entry = PRODUCTS.find((product) => product.name === "UISlash");
    expect({ ...entry, question: entry?.question.text, summary: entry?.summary.map((claim) => claim.text) }).toEqual({
      name: "UISlash",
      stage: "alpha",
      facts: "uislash",
      page: "/uislash",
      question: "UI components your agents cannot style wrong.",
      summary: [
        "React 19 components (`@slashsuite/ui-react`) and seven WCAG AA checked themes (`@slashsuite/themes`: four light, three dark, one CSS file each). No exported component accepts `className` or `style`, so people and coding agents compose pages from props alone.",
        "Open source under the MIT licence. Includes status pages, a reusable GitHub Actions PR review workflow, component docs at `/uislash` and a plain-text `/uislash/llms.txt` reference for coding agents.",
      ],
    });
  });

  test("the Written step's text is the approved line, word for word", () => {
    expect(written?.text.text).toBe(
      "An agent writes the code in its own git worktree using UI components it cannot style off-brand.",
    );
  });

  test("the hero lead describes the suite's parallel agent focus, word for word", () => {
    expect(HERO.lead.text).toBe(
      "Dev tools built for one developer opening two pull requests a day break when five coding agents run in parallel on the same machine. Each Slash product solves one step from idea to release, so you can start with the one that hurts most and leave the rest.",
    );
  });

  test("the alphas paragraph names every alpha in pipeline order and says UISlash stores nothing", () => {
    expect(STANDS.stages.text).toBe(
      "OmniSlash, UISlash, TaskSlash, FlakeSlash, PixelSlash and ToggleSlash are alphas. Expect commands, screens and components to change, and expect bugs. Between alpha versions, stored state may be reset: OmniSlash tickets, TaskSlash job history, FlakeSlash scans and grouped issues, PixelSlash builds and approvals, and ToggleSlash flags and audit trail. UISlash stores nothing.",
    );
  });
});
