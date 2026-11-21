import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { PRODUCTS } from "#/content/products";
import { TASKSLASH_REPO_URL } from "#/content/site";
import { TRY_IT, WORKS_TODAY } from "#/content/taskslash";

/** taskslash's README.md at the commit content/taskslash.ts was written from, kept beside it. */
const README = readFileSync(resolve(import.meta.dirname, "taskslash-readme.md"), "utf8");

describe("the /taskslash content", () => {
  test("every command it says works today is in taskslash's README, as the README writes it", () => {
    for (const feature of WORKS_TODAY) expect(README, feature.title).toContain(feature.command);
  });

  test("every try-it command is in the README, bar the clone and the cd that the repository URL makes", () => {
    const clone = [`git clone ${TASKSLASH_REPO_URL}`, "cd taskslash"];
    for (const command of TRY_IT.steps.flatMap((step) => step.commands)) {
      if (clone.includes(command)) continue;
      expect(README, command).toContain(command);
    }
  });

  test("says plainly that it needs Linux and a systemd user session to measure", () => {
    expect(TRY_IT.lead.text).toMatch(/Linux/);
    expect(TRY_IT.lead.text).toMatch(/systemd user session/);
  });

  test("its PRODUCTS entry matches the approved copy", () => {
    const entry = PRODUCTS.find((product) => product.name === "TaskSlash");
    expect({ ...entry, question: entry?.question.text, summary: entry?.summary.map((claim) => claim.text) }).toEqual({
      name: "TaskSlash",
      stage: "alpha",
      facts: "taskslash",
      question: "Admission control for builds and tests on one machine.",
      summary: [
        "Queues builds, tests and browser runs on one Linux machine so a test fails because of the code, not because parallel agents ran everything at once.",
        "Open source under the MIT licence. A local daemon runs each job in its own systemd scope, measures CPU, memory and disk writes, schedules moon targets by dependency order, and exposes `taskslash top`, `taskslash cancel` and per-job logs. Build from source with cargo.",
      ],
      page: "/taskslash",
    });
  });
});
