/**
 * The few values that change when the name or the address changes. Nothing else in the site
 * hard-codes them.
 */

/** The name, as the page shows it. The address is SITE_URL below. */
export const SITE_NAME = "slashslash.build";

/** The /developers page h1 and title. */
export const DEVELOPERS_HEADLINE = "Run the Slash suite on your own machine";

/** The /developers page lead, also its description in search results and link previews. */
export const DEVELOPERS_DESCRIPTION =
  "Install commands, self-hosting with Docker, Proxmox or Helm, licences and release stages for every Slash product.";

/** The title of the /developers page, in the tab and in link previews. */
export const DEVELOPERS_TITLE = DEVELOPERS_HEADLINE;

/** The site's own address with no trailing slash, for the share image's absolute URL. */
export const SITE_URL = "https://slashslash.build";

/**
 * Where a reader gets in touch, as shown at the end of the page: the sender of the link, or an issue on
 * the site's public repo for a reader nobody sent. Never an email address or a phone number.
 */
export const CONTACT = {
  lead: "Reply to whoever sent you this link, or ",
  link: "open an issue on GitHub",
  href: "https://github.com/slashsuite/slashslash/issues",
  end: ".",
} as const;

export const SELF_HOST_REPO_URL = "https://github.com/slashsuite/slashslash/tree/main/self-host";
export const PIXELSLASH_REPO_URL = "https://github.com/slashsuite/pixelslash";
export const PIXELSLASH_SITE_URL = "https://pixelslash.dev";
export const PIXELSLASH_NPM_URL = "https://www.npmjs.com/package/@slashsuite/pixelslash";
export const PIXELSLASH_COMMAND =
  "npx @slashsuite/pixelslash --live-png main.png --local-png branch.png --out out";
export const FLAKESLASH_REPO_URL = "https://github.com/slashsuite/flakeslash";
export const FLAKESLASH_DASHBOARD_URL = "https://flakeslash.slashslash.build";
export const UISLASH_REPO_URL = "https://github.com/slashsuite/uislash";

/**
 * The ToggleSlash repository, public under the Elastic License 2.0. /developers links it, and /toggleslash builds its
 * clone command and docs links from it, so it must stay a full URL.
 */
export const TOGGLESLASH_REPO_URL: string = "https://github.com/slashsuite/toggleslash";

/** The TaskSlash repository, public under the MIT license. /taskslash builds its clone command and docs links from it. */
export const TASKSLASH_REPO_URL = "https://github.com/slashsuite/taskslash";

/** The OmniSlash repository, public under the Elastic License 2.0. /omnislash links it from its hero. */
export const OMNISLASH_REPO_URL = "https://github.com/slashsuite/omnislash";
