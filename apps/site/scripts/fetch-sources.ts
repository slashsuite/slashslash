/**
 * Downloads the few PixelSlash repository files the /pixelslash pages need, at the commit pinned in
 * pixelslash.sha (PIXELSLASH_SHA overrides it, for trying another commit locally). Each file lands in
 * .sources/pixelslash/<path>; those under apps/site/public/ are also copied to public/pixelslash/, so
 * the built site serves them under /pixelslash/. Both folders are gitignored. A failed download exits
 * non-zero naming the path and the commit.
 *
 * It also downloads each product's FACTS.md, at the commit facts.sha.json pins for that product, into
 * .sources/facts/<product>.md. The site's tests check every product claim against these files.
 *
 * `--list` prints PIXELSLASH_FILES, one per line, and exits without fetching or deleting anything. The
 * pin bot (.github/workflows/pixelslash-pin.yml) reads it to decide whether a PixelSlash change matters.
 */
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DOC_PAGES } from "#/pixelslash/doc/docs-map";
import { assertUiReactVersionMatches, fetchUislashSources } from "./fetch-uislash";

/** The screenshots the docs show, every file of PixelSlash's apps/site/public/docs-images/. */
const DOCS_IMAGES = [
  "ci-index.png",
  "ci-report.png",
  "ds-judge.png",
  "ds-nojudge.png",
  "gs-labelled.png",
  "png-android.png",
  "png-compare.png",
  "png-report.png",
  "pw-index.png",
  "pw-report.png",
  "sb-index.png",
  "sb-report.png",
  "server-report.png",
  "url-compare.png",
  "url-dashboard.png",
  "url-ignore.png",
  "url-index.png",
] as const;

/** Every PixelSlash file the pages read, by its path in that repository. */
export const PIXELSLASH_FILES: readonly string[] = [
  "apps/web/github-app/manifest.json",
  "apps/site/public/hero/main.png",
  "apps/site/public/hero/branch.png",
  "apps/site/public/report.png",
  // Imported, not served: hero.json describes the two hero images, so it comes from the same commit.
  "apps/site/src/content/hero.json",
  "docs/capabilities/data.json",
  // Rendered as /pixelslash/security and /pixelslash/self-host.
  "SECURITY.md",
  "apps/web/SELF-HOST.md",
  // The docs under /pixelslash/docs: docs/cli.md, cut into pages, and each page that is a file of its
  // own, read from the docs map so the two lists cannot drift; then the screenshots they show.
  "docs/cli.md",
  ...DOC_PAGES.flatMap((page) => (page.file === undefined ? [] : [page.file])),
  ...DOCS_IMAGES.map((name) => `apps/site/public/docs-images/${name}`),
];

/** The products whose FACTS.md the site reads, each by its repository name. */
export const FACTS_PRODUCTS = ["pixelslash", "toggleslash", "flakeslash", "taskslash", "uislash", "omnislash"] as const;
export type FactsProduct = (typeof FACTS_PRODUCTS)[number];

/** The repository each product's FACTS.md comes from, as owner/repo. */
const FACTS_REPOS: Record<FactsProduct, string> = {
  pixelslash: "slashsuite/pixelslash",
  toggleslash: "slashsuite/toggleslash",
  flakeslash: "slashsuite/flakeslash",
  taskslash: "slashsuite/taskslash",
  uislash: "slashsuite/uislash",
  omnislash: "slashsuite/omnislash",
};
const REPO = FACTS_REPOS.pixelslash;
const SITE = resolve(import.meta.dirname, "..");
const SOURCES = resolve(SITE, ".sources/pixelslash");
const FACTS = resolve(SITE, ".sources/facts");
const FACTS_PATH = "FACTS.md";
const PUBLIC = resolve(SITE, "public/pixelslash");
const PUBLIC_PREFIX = "apps/site/public/";

function pinnedSha(): string {
  // An empty PIXELSLASH_SHA counts as unset.
  const fromEnv = process.env.PIXELSLASH_SHA?.trim();
  const source = fromEnv ? "PIXELSLASH_SHA" : "pixelslash.sha";
  const sha = fromEnv || readFileSync(resolve(SITE, "pixelslash.sha"), "utf8").trim();
  // A full commit SHA: a short one is not a stable pin.
  if (!/^[0-9a-f]{40}$/.test(sha)) throw new Error(`${source} is not a full commit SHA: "${sha}"`);
  return sha;
}

/** Each product's facts pin from facts.sha.json, in FACTS_PRODUCTS' order, every one a full commit SHA. */
function factsPins(): readonly (readonly [FactsProduct, string])[] {
  const pins: Record<string, unknown> = JSON.parse(readFileSync(resolve(SITE, "facts.sha.json"), "utf8"));
  return FACTS_PRODUCTS.map((product): [FactsProduct, string] => {
    const sha = pins[product];
    if (typeof sha !== "string" || !/^[0-9a-f]{40}$/.test(sha)) {
      throw new Error(`facts.sha.json: ${product} is not a full commit SHA: "${String(sha)}"`);
    }
    return [product, sha];
  });
}

async function download(sha: string, path: string, repo = REPO, name = "PixelSlash"): Promise<Uint8Array> {
  const url = `https://raw.githubusercontent.com/${repo}/${sha}/${path}`;
  let response: Response;
  let body: ArrayBuffer;
  try {
    response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status} from ${url}`);
    body = await response.arrayBuffer();
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`could not fetch ${path} at ${name} ${sha}: ${reason}`, { cause: error });
  }
  return new Uint8Array(body);
}

async function main(): Promise<void> {
  // Check the vendored package version before any network call so a mismatch fails fast.
  assertUiReactVersionMatches(SITE);
  const sha = pinnedSha();
  const pins = factsPins();
  const [bodies, facts, uislash] = await Promise.all([
    Promise.all(PIXELSLASH_FILES.map((path) => download(sha, path))),
    Promise.all(pins.map(([product, pin]) => download(pin, FACTS_PATH, FACTS_REPOS[product], product))),
    fetchUislashSources(SITE),
  ]);
  // Written only once every file has arrived, so a failure leaves no half-updated folder behind.
  rmSync(SOURCES, { recursive: true, force: true });
  rmSync(PUBLIC, { recursive: true, force: true });
  rmSync(FACTS, { recursive: true, force: true });
  mkdirSync(FACTS, { recursive: true });
  pins.forEach(([product], i) => writeFileSync(resolve(FACTS, `${product}.md`), facts[i] ?? new Uint8Array()));
  PIXELSLASH_FILES.forEach((path, i) => {
    const target = resolve(SOURCES, path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, bodies[i] ?? new Uint8Array());
    if (path.startsWith(PUBLIC_PREFIX)) {
      const served = resolve(PUBLIC, path.slice(PUBLIC_PREFIX.length));
      mkdirSync(dirname(served), { recursive: true });
      copyFileSync(target, served);
    }
  });
  console.log(`fetched ${PIXELSLASH_FILES.length} PixelSlash files at ${sha}`);
  for (const [product, pin] of pins) console.log(`fetched ${product} ${FACTS_PATH} at ${pin}`);
  console.log(`fetched ${uislash.docsCount} UISlash docs files and ${uislash.storyCount} story files at ${uislash.sha}`);
}

// Run only as a script, so a test can import PIXELSLASH_FILES without a fetch.
if (import.meta.main) {
  if (process.argv.includes("--list")) {
    console.log(PIXELSLASH_FILES.join("\n"));
  } else {
    try {
      await main();
    } catch (error) {
      console.error(`fetch-sources: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  }
}
