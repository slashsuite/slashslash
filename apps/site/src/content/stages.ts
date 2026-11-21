/**
 * The release stages every Hack Cove site uses, with the one sentence that says what each means for
 * a user. A visitor learns one vocabulary across the suite's pages, so every page reads these
 * strings and none of them is written again elsewhere.
 */
export type StageId = "alpha" | "beta" | "release-candidate" | "stable" | "planned";

export const STAGES: Record<StageId, { label: string; sentence: string }> = {
  alpha: {
    label: "Alpha",
    sentence: "Changing fast. Expect breaking changes between versions.",
  },
  beta: {
    label: "Beta",
    sentence:
      "Settling. Breaking changes are still possible and are called out in the release notes.",
  },
  "release-candidate": {
    label: "Release candidate",
    sentence: "Feature complete. Breaking changes are rare and announced ahead.",
  },
  stable: {
    label: "Stable",
    sentence: "No breaking changes within a major version.",
  },
  planned: {
    label: "Planned",
    sentence: "Not built yet.",
  },
};

/** The pill tone for each stage. Each name is a tone `@slashsuite/ui-react` Pill accepts. */
export const STAGE_TONE: Record<StageId, "warn" | "info" | "accent" | "positive" | "neutral"> = {
  alpha: "warn",
  beta: "info",
  "release-candidate": "accent",
  stable: "positive",
  planned: "neutral",
};
