import { handleRun } from "./routes/run";
// import { handleSnippet } from "./routes/snippet";
// import { handleTrack } from "./routes/track";
// import { handleStats } from "./routes/stats";

// export default {
//   async fetch(request: Request, env: any) {
//     const url = new URL(request.url);

//     if (url.pathname === "/run") return handleRun(request, env);
//     if (url.pathname === "/snippet") return handleSnippet(request, env);
//     if (url.pathname === "/track") return handleTrack(request, env);
//     if (url.pathname === "/stats") return handleStats(env);

//     return new Response("Not Found", { status: 404 });
//   },
// };

import { corsHeaders } from "./utils/cors";

export default {
  async fetch(request: Request, env: any) {
    // 🔥 Handle OPTIONS (preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders(),
      });
    }

    const url = new URL(request.url);

    if (url.pathname === "/run") {
      const res = await handleRun(request, env);

      return new Response(await res.text(), {
        headers: corsHeaders(),
      });
    }

    // repeat for other routes if needed

    return new Response("Not Found", { status: 404 });
  },
};
