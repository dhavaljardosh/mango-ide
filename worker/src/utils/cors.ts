export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin":
      "https://ide-worker.dhavaljardosh.workers.dev",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
