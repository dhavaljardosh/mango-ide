const ALLOWED_PATTERNS = [
  /^https:\/\/[a-z0-9-]+\.mango-ide\.pages\.dev$/,
  /^https:\/\/mango-ide\.pages\.dev$/,
  /^https:\/\/ide-worker[a-z0-9-]*\.dhavaljardosh\.workers\.dev$/,
  /^http:\/\/localhost:\d+$/,
];

function isAllowedOrigin(origin: string): boolean {
  return ALLOWED_PATTERNS.some((pattern) => pattern.test(origin));
}

export function corsHeaders(request?: Request) {
  const origin = request?.headers.get("Origin") ?? "";
  const allowedOrigin = isAllowedOrigin(origin)
    ? origin
    : "https://mango-ide.pages.dev";

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
