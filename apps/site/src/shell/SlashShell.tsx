import { AppShell, AppShellBrand, Caption, Cluster, ColourSchemeToggle, Show, Tabs, Text, TextLink } from "@slashsuite/ui-react";
import type { ReactNode } from "react";
import { licenceOf } from "#/content/facts";
import { PRODUCTS } from "#/content/products";
import { SELF_HOST_REPO_URL, SITE_NAME } from "#/content/site";
import { LANDING_HEADLINE } from "#/content/story";
import { TRADEMARK } from "#/pixelslash/content/trademark";
import { FooterColumns } from "#/stand-ins/footer-columns";
import { SECTIONS, TOOL_KEYS, isSectionKey, markFor, type SectionKey } from "#/shell/sections";

/** A mark beside a name: decoration, so the name alone is read out. */
function Marked({ mark, children }: { mark: string; children: ReactNode }): ReactNode {
  return (
    <Cluster as="span" gap="xs" wrap={false}>
      <img src={mark} alt="" width={16} height={16} />
      {children}
    </Cluster>
  );
}

/** The suite's lockup: its mark and its name, one link home. In the header, the wordmark folds at tablet widths (md to lg) so all six tools fit one row. */
function Lockup({ compactOnTablet = false }: { compactOnTablet?: boolean }): ReactNode {
  return (
    <AppShellBrand
      href="/"
      logo={<img src={SECTIONS.suite.mark} alt="" width={24} height={24} />}
      label={compactOnTablet ? <span className="md:sr-only lg:not-sr-only">{SITE_NAME}</span> : SITE_NAME}
    />
  );
}

/** Every product with its mark: a tool with a page links there, a planned one says so, any other is named only. */
function productItems(): ReactNode[] {
  return PRODUCTS.map((product) => {
    const key = product.name.toLowerCase();
    const home = isSectionKey(key) ? SECTIONS[key].home : product.page;
    const name = (
      <Marked key={product.name} mark={markFor(product.name)}>
        {product.name}
      </Marked>
    );
    if (product.stage === "planned")
      return (
        <Cluster key={product.name} as="span" gap="xs">
          {name}
          <Caption as="span">Planned</Caption>
        </Cluster>
      );
    if (home === undefined) return name;
    return (
      <TextLink key={product.name} href={home}>
        {name}
      </TextLink>
    );
  });
}

/** Each licence with the tools under it, in PRODUCTS order, in each tool's facts file's words. */
function licenceItems(): ReactNode[] {
  const byLicence = new Map<string, string[]>();
  for (const { name, facts } of PRODUCTS) {
    if (facts === undefined) continue;
    const licence = licenceOf(facts);
    byLicence.set(licence, [...(byLicence.get(licence) ?? []), name]);
  }
  return [...byLicence].map(([licence, names]) => (
    <span key={licence} data-licence={licence}>
      {`${licence}: ${names.join(", ")}`}
    </span>
  ));
}

function Footer(): ReactNode {
  return (
    <FooterColumns
      lead={
        <>
          <Lockup />
          <Text>{LANDING_HEADLINE}.</Text>
        </>
      }
      columns={[
        { title: "Products", items: productItems() },
        {
          title: "Docs and code",
          items: [
            <TextLink key="/how-it-works" href="/how-it-works">
              How it works
            </TextLink>,
            <TextLink key="/developers" href="/developers">
              For developers
            </TextLink>,
            <TextLink key="/pixelslash/docs" href="/pixelslash/docs">
              PixelSlash docs
            </TextLink>,
            <TextLink key="/uislash" href="/uislash">
              UISlash docs
            </TextLink>,
            <TextLink key="self-host" href={SELF_HOST_REPO_URL} external>
              Self-host image
            </TextLink>,
            <TextLink key="github" href="https://github.com/slashsuite" external>
              Source on GitHub
            </TextLink>,
          ],
        },
        {
          title: "Licence",
          items: [
            ...licenceItems(),
            // A bare span like the licence lines, so the column's paragraphs share one size.
            <span key="trademark" data-trademark>
              {TRADEMARK}
            </span>,
          ],
        },
      ]}
    />
  );
}

/**
 * The one shell every Slash page sits in: the suite's lockup home, the tool switcher, the controls,
 * then on a tool's page its own pages as a second row, and one footer. Below md the switcher and
 * the second row fold into the kit's Menu. Rendered to static HTML: the theme toggle is wired by
 * the layout's inline script, so the shell hydrates nothing.
 */
export function SlashShell({
  section,
  path,
  controls,
  children,
}: {
  section: SectionKey;
  /** The page's own path, to mark its sub-nav entry current. */
  path: string;
  /** Optional extra header controls placed before the colour scheme toggle (e.g. SiteSearch on /uislash). */
  controls?: ReactNode;
  children: ReactNode;
}): ReactNode {
  const current = SECTIONS[section];
  const light = current.day;
  const dark = current.night;
  const switcher = (
    <Tabs
      label="Tools"
      items={TOOL_KEYS.map((key) => ({
        // The marks show from lg; below it the names stand alone, so every tool fits one row on a tablet.
        label: (
          <Cluster as="span" gap="xs" wrap={false}>
            <Show from="lg" as="span">
              <img src={SECTIONS[key].mark} alt="" width={16} height={16} />
            </Show>
            {SECTIONS[key].name}
          </Cluster>
        ),
        href: SECTIONS[key].home,
        selected: key === section,
      }))}
    />
  );
  const subnav =
    current.pages.length > 0 ? (
      <Tabs
        label={current.name}
        items={current.pages.map((page) => ({
          label: page.label,
          href: page.href,
          // A tab is current on its own page and, but for the section's home, on the pages under it (each docs page under Docs).
          selected: page.href === path || (page.href !== current.home && path.startsWith(`${page.href}/`)),
          ...("external" in page ? { external: true } : {}),
        }))}
      />
    ) : undefined;
  const toggle = <ColourSchemeToggle schemes={{ light, dark }} size="sm" data-scheme-toggle="" />;
  return (
    <AppShell
      brand={<Lockup compactOnTablet />}
      nav={switcher}
      {...(subnav ? { subnav } : {})}
      controls={
        controls !== undefined ? (
          <Cluster as="span" gap="xs" wrap={false}>
            {controls}
            {toggle}
          </Cluster>
        ) : (
          toggle
        )
      }
      footer={<Footer />}
      bleed
    >
      {children}
    </AppShell>
  );
}
