import { ResolutionError } from "./atproto";
import { buildCard } from "./card";
import { renderCard, renderError, renderHome } from "./render/html";
import { renderVCard } from "./render/vcard";

interface Env {
  PUBLIC_ORIGIN?: string;
}

type Format = "html" | "json" | "vcf";

const CACHE_CONTROL = "public, max-age=60, s-maxage=300, stale-while-revalidate=600";

function parsePath(pathname: string): { identifier: string; format: Format } | null {
  const raw = pathname.replace(/^\/+|\/+$/g, "");
  if (!raw || raw.includes("/")) return null;
  const identifier = decodeURIComponent(raw);
  if (identifier.endsWith(".vcf")) return { identifier: identifier.slice(0, -4), format: "vcf" };
  if (identifier.endsWith(".json")) return { identifier: identifier.slice(0, -5), format: "json" };
  return { identifier, format: "html" };
}

function html(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": status === 200 ? CACHE_CONTROL : "no-store" },
  });
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": "*",
      "cache-control": status === 200 ? CACHE_CONTROL : "no-store",
    },
  });
}

function errorResponse(format: Format, status: number, message: string): Response {
  if (format === "html") return html(renderError(status, message), status);
  return json({ error: message }, status);
}

async function handle(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const origin = env.PUBLIC_ORIGIN ?? url.origin;

  if (url.pathname === "/") {
    const query = url.searchParams.get("q")?.trim().replace(/^@/, "");
    if (query) return new Response(null, { status: 302, headers: { location: `/${encodeURIComponent(query)}` } });
    return html(renderHome());
  }

  if (url.pathname === "/favicon.ico" || url.pathname === "/robots.txt") {
    return new Response(url.pathname === "/robots.txt" ? "User-agent: *\nAllow: /\n" : null, {
      status: url.pathname === "/robots.txt" ? 200 : 204,
      headers: { "cache-control": "public, max-age=86400" },
    });
  }

  const route = parsePath(url.pathname);
  if (!route) return errorResponse("html", 404, "That page does not exist.");

  try {
    const card = await buildCard(route.identifier.replace(/^@/, ""));
    const slug = encodeURIComponent(card.handle ?? card.did);
    switch (route.format) {
      case "json":
        return json({ ...card, links: { html: `${origin}/${slug}`, vcard: `${origin}/${slug}.vcf` } });
      case "vcf":
        return new Response(renderVCard(card, `${origin}/${slug}.vcf`), {
          headers: {
            "content-type": "text/vcard; charset=utf-8",
            "content-disposition": `attachment; filename="${slug}.vcf"`,
            "cache-control": CACHE_CONTROL,
          },
        });
      default:
        return html(renderCard(card, origin));
    }
  } catch (error) {
    if (error instanceof ResolutionError) return errorResponse(route.format, error.status, error.message);
    console.error(error);
    return errorResponse(route.format, 502, "Could not fetch data from the network. Try again shortly.");
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { allow: "GET, HEAD" } });
    }

    const url = new URL(request.url);
    if (url.pathname === "/" && url.searchParams.has("q")) return handle(request, env);

    const bypassCache = url.searchParams.has("refresh");
    url.search = "";
    const cacheKey = new Request(url.toString(), { method: "GET" });
    const cache = caches.default;

    if (!bypassCache) {
      const cached = await cache.match(cacheKey);
      if (cached) return cached;
    }

    const response = await handle(request, env);
    if (response.status === 200 && response.headers.get("cache-control")?.includes("s-maxage")) {
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
    }
    return response;
  },
} satisfies ExportedHandler<Env>;
