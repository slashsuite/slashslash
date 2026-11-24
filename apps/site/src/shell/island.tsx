import { type ReactNode, useEffect, useRef } from "react";

/** The attribute an eager island carries in the HTML until it has hydrated. */
export const PENDING = "data-island-pending";

/**
 * Wraps an eager island (`client:load`, `client:idle`) so the page can tell when it has hydrated: the
 * server renders the marker, and the first effect in the browser takes it off the DOM (React never sets
 * it again: the prop does not change). HYDRATED_SCRIPT sets
 * `data-hydrated` on <html> once no marker is left, which is what a browser test waits for.
 * `display: contents` keeps the wrapper out of the layout.
 */
export function Island({ children }: { children?: ReactNode }): ReactNode {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.removeAttribute(PENDING), []);
  return (
    <div ref={ref} data-island-pending="" style={{ display: "contents" }}>
      {children}
    </div>
  );
}

/**
 * At the end of <body>: `data-hydrated` on <html> once every Island has hydrated, at once on a page
 * with none. A `client:visible` island is not wrapped, so it never holds this back.
 */
export const HYDRATED_SCRIPT = `(function(){var r=document.documentElement,q="[${PENDING}]";function d(){if(document.querySelector(q))return false;r.dataset.hydrated="";return true}if(d())return;var o=new MutationObserver(function(){if(d())o.disconnect()});o.observe(document.body,{subtree:true,attributes:true,attributeFilter:["${PENDING}"]})})()`;
