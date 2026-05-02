import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { handleRun } from "../routes/run";

const mockEnv = {
  PISTON_URL: "https://piston.test/api/v2",
  ide_db: {
    prepare: () => ({
      bind: () => ({ run: async () => ({}) }),
    }),
  },
};

function pistonResponse(stdout: string, stderr = "") {
  return {
    run: { stdout, stderr, code: 0, signal: null, output: stdout },
    language: "python",
    version: "3.10.0",
  };
}

describe("handleRun", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns stdout from Piston", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(pistonResponse("hello\n")), { status: 200 })
    );
    const req = new Request("https://worker/run", {
      method: "POST",
      body: JSON.stringify({ language: "python", code: 'print("hello")' }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await handleRun(req, mockEnv);
    expect(await res.text()).toBe("hello\n");
  });

  it("includes stderr in output", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(pistonResponse("", "error msg\n")), { status: 200 })
    );
    const req = new Request("https://worker/run", {
      method: "POST",
      body: JSON.stringify({ language: "python", code: "bad code" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await handleRun(req, mockEnv);
    expect(await res.text()).toBe("error msg\n");
  });

  it("returns 500 when Piston is down", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("Network error"));
    const req = new Request("https://worker/run", {
      method: "POST",
      body: JSON.stringify({ language: "python", code: "x" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await handleRun(req, mockEnv);
    expect(res.status).toBe(500);
  });

  it("returns 500 when Piston returns non-200", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("", { status: 503 }));
    const req = new Request("https://worker/run", {
      method: "POST",
      body: JSON.stringify({ language: "python", code: "x" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await handleRun(req, mockEnv);
    expect(res.status).toBe(500);
  });

  it("includes X-Request-Id header on success", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(pistonResponse("ok\n")), { status: 200 })
    );
    const req = new Request("https://worker/run", {
      method: "POST",
      body: JSON.stringify({ language: "python", code: "x" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await handleRun(req, mockEnv);
    expect(res.headers.get("X-Request-Id")).toBeTruthy();
  });
});
