# slashslash

The source of **[slashslash.build](https://slashslash.build)**, the public site for the Slash suite
(PixelSlash, ToggleSlash, FlakeSlash, TaskSlash, UISlash, OmniSlash and BundleSlash).

Built to static HTML with [Astro](https://astro.build). The pages in `apps/site/src/pages/`:

- `/` is written for a CEO, COO or CFO: "See what a change really does, before your customers do." It
  explains, with no code on screen, how a change reaches customers today, what nobody checks, what that
  costs and what slashslash adds, then asks four questions.
- `/developers` holds the developer detail: the seven stops of one feature, environment variables, the
  effect of one flag, the tools with their status labels, how to run PixelSlash today, and its own
  questions.
- one home per tool: `/flakeslash`, `/toggleslash`, `/taskslash` and `/omnislash`, each built from the
  same tool page layout (`src/tools/ToolPage.astro`).
- `/pixelslash` and its subpages: `/pixelslash/how-it-works`, `/pixelslash/compare`, `/pixelslash/pricing`,
  `/pixelslash/security`, `/pixelslash/self-host`, and the docs under `/pixelslash/docs`, which have a search box.
- `/404` and the generated `sitemap.xml` and PixelSlash `search-index.json`.

The home pages are read by scrolling, with nothing to click. No database, accounts, form or cookie.

## Layout

A [Bun workspaces](https://bun.sh/docs/install/workspaces) monorepo run with [moon](https://moonrepo.dev):

- `apps/site`: the site (moon project `site`).
- `scripts`: repo checks, such as `scripts/check-slop.ts` (moon project `scripts`).
- `packages/`: shared packages, none yet.
- `self-host`: the one self-host image and the Proxmox install script (moon project `self-host`).
- `skills/`: guides for coding agents, such as `skills/self-host` for running your own instance.

`.moon/workspace.yml` lists the projects, each project's `moon.yml` holds its tasks, and
`.moon/tasks/all.yml` the root files every task depends on. moon caches each task in `.moon/cache`, so an
unchanged task is a cache hit. From here on, a path such as `src/content/site.ts` is under `apps/site/`.

## Develop

Needs [Bun](https://bun.sh).

```bash
bun install
bun run dev                     # the site's dev server, http://localhost:4321
bunx moon run site:build        # static output in apps/site/dist/
cd apps/site && bun run preview # serve apps/site/dist/
```

The `/pixelslash` pages are built from PixelSlash files fetched at the commit in `apps/site/pixelslash.sha`.
`.github/workflows/pixelslash-pin.yml` moves that pin: every hour, when a fetched file has changed on PixelSlash
main, it opens a pull request that moves the pin, gates it, merges it when green and starts the deploy. Run it
by hand with `gh workflow run pixelslash-pin.yml`.

## Check

```bash
bun run lint       # every project's lint: site:lint (oxlint --type-aware, warnings fail), scripts:lint
                   # (oxlint --type-aware, scripts/check-slop.ts, personas.ts --check) and self-host:lint
bun run typecheck  # site:typecheck (astro check), scripts:typecheck (tsc) and self-host:typecheck
bun run build      # site:build
bun run test       # site:test, which builds first
```

Each runs `moon run --concurrency 3 :<task>` across the projects; CI runs `bunx moon run --concurrency 3
:lint :typecheck :build :test` as its gate. It then runs the browser tests as its own step,
`bunx moon run site:e2e` (Playwright, the production build on a Chromium desktop and a Chromium phone), after
installing Chromium.

The tests read `apps/site/dist/` and check the agreed copy and its order, that every product shows its status label,
that made-up material says so, that no privacy claim and no forbidden word is present, that nothing is hidden
or in a start state without motion, that every page links the one stylesheet, and that the site is open to
search engines (`robots.txt`, `sitemap.xml`, a canonical address per page, no robots meta tag).

## How the page is built

Astro renders every page to HTML at build time (`src/pages/`), on one layout, `src/layouts/Slash.astro`, which
puts each page on the Slash shell (`src/shell/`): the header, the tool switcher and the footer, in the page's
section (the suite or one tool). The pages are React components grouped by page (`src/home/`,
`src/developers/`, `src/tools/` for the tool homes, `src/pixelslash/`), the drawings are
in `src/illustrations/`, and the words are in `src/content/`. Only a few things run in the browser:

- the light/dark toggle (an inline script in the layout),
- the motion island (`src/illustrations/motion.tsx`, `client:load`) on `/` and `/developers`, which plays each
  drawing once as it scrolls into view,
- the walkthrough and the today block on `/developers` (`client:visible`), with their copy buttons,
- the hero command and the try-it block on each tool home (`HeroCode` and `TryIt`, `client:visible`),
- the docs search on the PixelSlash docs pages (`DocsSearch`, `client:idle`).

The layout carries an inline script that runs before first paint: it applies the stored or system colour
scheme, so there is no flash. The home adds its own guard that sets the `motion` class when the reader allows
motion and takes it off again if the motion island has not started within 3 seconds, so no start state can hide
the copy.

**Motion only decorates.** Everything is SVG and CSS. The base style of every element is its finished state;
start states sit under `.motion ...:not(.played)`, and every animation is inside
`@media (prefers-reduced-motion: no-preference)`. A test refuses one outside it.

**Real and imagined look different.** `Evidence` in `src/developers/evidence.tsx` draws four kinds: `real`
(captured by running the tool), `quoted` (printed in the tool's docs), `made-up` and `idea` (dashed,
labelled where they appear). Never give something unbuilt a `real` frame; a test refuses it.

## Things to change in one place

- `src/content/site.ts`: the name, the address (`SITE_URL`, which makes the share image's URL absolute) and
  the contact line. Never put an email address or a phone number there.
- `src/content/products.ts`: the seven products and their status labels. `src/content/flow.ts`: the seven stops.
- `TOGGLESLASH_REPO_URL` in `src/content/site.ts` names the public ToggleSlash repository, and the page links it.

## Design system

The shell, the type, the pills, the code blocks, the links and the theme toggle come from `@slashsuite/ui-react`,
on the Slash Day and Slash Night themes of `@slashsuite/themes`. `src/styles.css` is the one stylesheet: Tailwind,
the themes, and the plain CSS of the one-off drawings (`src/illustrations/`), each on the themes' variables.

Fonts are self-hosted and subset (`apps/site/public/fonts/`, licences beside them): Inter for text,
JetBrains Mono for code. The mono subset holds ASCII plus nbsp and the middle dot, so code on the page must
stay within those; a missing glyph means re-subsetting.

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: it checks and builds on a GitHub-hosted runner, then a
second job, the only one that holds the Cloudflare token (in the `production` environment), uploads
`apps/site/dist/` to Cloudflare Pages with `wrangler pages deploy`. Pull requests run only `ci.yml`, which gets
the moon cache read token and nothing else; the Cloudflare token stays with the deploy job.

Every page names the commit it was built from in a hidden `<meta name="build-commit">` in its head. To see
which commit is live:

```sh
curl -s https://slashslash.build/ | grep build-commit
```

The workflow passes its commit to the build as `BUILD_COMMIT`, and after the upload its `smoke` job checks
that the live home page names that commit, retrying for up to two minutes while the edge catches up. A
local build without `BUILD_COMMIT` reads `git rev-parse HEAD` (with `-dirty` on a dirty tree), and a moon
cache hit there can carry an older commit; only CI deploys, so that never reaches the live site.

## Shared build cache

moon reads a shared remote cache when `MOON_REMOTE_TOKEN` holds a read token: `export MOON_REMOTE_TOKEN=<read
token>` before `bunx moon run`. Without it moon logs a warning about the remote and uses the local cache only.
Only a push to `main` writes to the shared cache.

## Licence

Code: MIT, see [LICENSE](LICENSE). The copy, images, logos and product names are not licensed for reuse; see
[NOTICE](NOTICE).
