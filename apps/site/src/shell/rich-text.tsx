import { TextLink } from "@slashsuite/ui-react";
import { Fragment, type ReactNode } from "react";

/**
 * A claim's words as the page shows them, for prose that carries code or links: `code` becomes a code span
 * and [words](href) a link. Everything else is plain text, so the claim's text
 * is the page's text once the marks are taken out. A link opens as external only when its address is in
 * `external`, as the prose marked it before it became a claim.
 */
export function Rich({ text, external = [] }: { text: string; external?: readonly string[] }): ReactNode {
  const parts = text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\))/);
  return parts.map((part, i) => {
    const code = part.match(/^`([^`]+)`$/);
    if (code) return <code key={i}>{code[1]}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link?.[1] && link[2])
      return (
        <TextLink key={i} href={link[2]} {...(external.includes(link[2]) ? { external: true } : {})}>
          {link[1]}
        </TextLink>
      );
    return <Fragment key={i}>{part}</Fragment>;
  });
}
