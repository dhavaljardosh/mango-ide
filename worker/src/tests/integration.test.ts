import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import worker from "../index";

const snippetStore = new Map<string, Record<string, unknown>>();

const mockEnv = {
  PISTON_URL: "https://piston.test/api/v2",
  RATE_LIMIT: undefined,
  ide_db: {
    prepare: (sql: string) => ({
      bind: (...args: unknown[]) => ({
        first: async () => snippetStore.get(args[0] as string) ?? null,
        run: async () => {
          if (sql.includes("INSERT INTO snippets")) {
            const [id, language, code, title] = args as [string, string, string, string | null];
            snippetStore.set(id, { id, language, code, title });
          }
          return {};
        },
        all: async () => ({ results: [] }),
      }),
      first: async () => ({ count: 0 }),
      all: async () => ({ results: [] }),
    }),
  },
};

describe("Worker integration", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    snippetStore.clear();
  });
  afterEach(() => vi.unstubAllGlobals());

  it("OPTIONS returns 200 with CORS headers", async () => {
    const req = new Request("https://worker/run", {
      method: "OPTIONS",
      headers: { Origin: "http://localhost:3000" },
    });
    const res = await worker.fetch(req, mockEnv);
    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBeTruthy();
  });

  it("/health returns ok", async () => {
    const req = new Request("https://worker/health");
    const res = await worker.fetch(req, mockEnv);
    expect(res.status).toBe(200);
    const body = await res.json() as { status: string };
    expect(body.status).toBe("ok");
  });

  it("/run proxies to Piston and returns output", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({
        run: { stdout: "hello\n", stderr: "", code: 0, signal: null, output: "hello\n" },
        language: "python",
        version: "3.10.0",
      }), { status: 200 })
    );
    const req = new Request("https://worker/run", {
      method: "POST",
      body: JSON.stringify({ language: "python", code: 'print("hello")' }),
      headers: { "Content-Type": "application/json", "CF-Connecting-IP": "1.2.3.4" },
    });
    const res = await worker.fetch(req, mockEnv);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("hello\n");
    expect(res.headers.get("X-RateLimit-Remaining")).toBeTruthy();
  });

  it("/snippet POST then GET round-trips", async () => {
    const postReq = new Request("https://worker/snippet", {
      method: "POST",
      body: JSON.stringify({ language: "python", code: "x=42" }),
      headers: { "Content-Type": "application/json" },
    });
    const postRes = await worker.fetch(postReq, mockEnv);
    expect(postRes.status).toBe(200);
    const { id } = await postRes.json() as { id: string };

    const getReq = new Request(`https://worker/snippet/${id}`);
    const getRes = await worker.fetch(getReq, mockEnv);
    expect(getRes.status).toBe(200);
    const body = await getRes.json() as { language: string; code: string };
    expect(body.language).toBe("python");
    expect(body.code).toBe("x=42");
  });

  it("/stats returns JSON with totalRuns", async () => {
    const req = new Request("https://worker/stats");
    const res = await worker.fetch(req, mockEnv);
    expect(res.status).toBe(200);
    const body = await res.json() as { totalRuns: number };
    expect(typeof body.totalRuns).toBe("number");
  });

  it("unknown route returns 404", async () => {
    const req = new Request("https://worker/unknown");
    const res = await worker.fetch(req, mockEnv);
    expect(res.status).toBe(404);
  });
});
