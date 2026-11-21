import type { APIRoute } from "astro";
import { renderLlms } from "#/uislash/docs/llms";

// /uislash/llms.txt: the full UISlash component reference as plain text, built from the same
// pinned docs data and stories as the HTML pages.
export const GET: APIRoute = () =>
  new Response(renderLlms(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
