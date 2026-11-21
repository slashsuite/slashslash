import manifest from "@pixelslash-src/apps/web/github-app/manifest.json";

/** The repository sits behind one switch, so no link leads somewhere a visitor cannot open. It opened on 2026-11-03 (PS-257, PS-292). */
export const REPO_PUBLIC = true;

/** The repository, from the same file `docs/capabilities/build.py` reads it from. */
export const REPO_URL: string = manifest.url;
