import { describe, it, expect } from "vitest";
import { corsHeaders } from "../utils/cors";

function makeRequest(origin: string) {
  return new Request("https://example.com", {
    headers: { Origin: origin },
  });
}

describe("corsHeaders", () => {
  it("allows mango-ide.pages.dev subdomains", () => {
    const headers = corsHeaders(makeRequest("https://abc123.mango-ide.pages.dev"));
    expect(headers["Access-Control-Allow-Origin"]).toBe("https://abc123.mango-ide.pages.dev");
  });

  it("allows mango-ide.pages.dev root", () => {
    const headers = corsHeaders(makeRequest("https://mango-ide.pages.dev"));
    expect(headers["Access-Control-Allow-Origin"]).toBe("https://mango-ide.pages.dev");
  });

  it("allows localhost on any port", () => {
    const headers = corsHeaders(makeRequest("http://localhost:3002"));
    expect(headers["Access-Control-Allow-Origin"]).toBe("http://localhost:3002");
  });

  it("denies unknown origins with fallback", () => {
    const headers = corsHeaders(makeRequest("https://evil.com"));
    expect(headers["Access-Control-Allow-Origin"]).toBe("https://mango-ide.pages.dev");
  });

  it("returns required CORS methods and headers", () => {
    const headers = corsHeaders();
    expect(headers["Access-Control-Allow-Methods"]).toContain("POST");
    expect(headers["Access-Control-Allow-Headers"]).toContain("Content-Type");
  });
});
