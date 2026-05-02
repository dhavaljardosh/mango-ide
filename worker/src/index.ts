import { handleRun } from "./routes/run";
import { handleSnippet } from "./routes/snippet";
import { handleStats } from "./routes/stats";
import { corsHeaders } from "./utils/cors";
import { checkRateLimit } from "./utils/rateLimit";

export default {
  async fetch(request: Request, env: any) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(request) });
    }

    const url = new URL(request.url);

    if (url.pathname === "/run") {
      const ip = request.headers.get("CF-Connecting-IP") ?? request.headers.get("x-forwarded-for") ?? "unknown";
      const { allowed, remaining } = await checkRateLimit(ip, env.RATE_LIMIT);
      if (!allowed) {
        return new Response("Rate limit exceeded. Max 20 runs per minute.", {
          status: 429,
          headers: { ...corsHeaders(request), "Retry-After": "60" },
        });
      }
      const res = await handleRun(request, env);
      return new Response(await res.text(), {
        status: res.status,
        headers: { ...corsHeaders(request), "X-Request-Id": res.headers.get("X-Request-Id") ?? "", "X-RateLimit-Remaining": String(remaining) },
      });
    }

    if (url.pathname.startsWith("/snippet")) {
      const res = await handleSnippet(request, env);
      return new Response(await res.text(), {
        status: res.status,
        headers: { ...corsHeaders(request), "Content-Type": res.headers.get("Content-Type") ?? "application/json" },
      });
    }

    if (url.pathname === "/stats") {
      const res = await handleStats(env);
      return new Response(await res.text(), {
        headers: { ...corsHeaders(request), "Content-Type": "application/json" },
      });
    }

    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "ok", service: "worker" }), {
        headers: { ...corsHeaders(request), "Content-Type": "application/json" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
