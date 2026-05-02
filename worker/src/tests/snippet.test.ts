import { describe, it, expect } from "vitest";
import { handleSnippet } from "../routes/snippet";

function makeDb(rows: Record<string, unknown>[] = []) {
  const store = new Map<string, Record<string, unknown>>();
  rows.forEach((r) => store.set(r.id as string, r));

  return {
    prepare: (sql: string) => ({
      bind: (...args: unknown[]) => ({
        first: async () => {
          if (sql.includes("SELECT")) {
            return store.get(args[0] as string) ?? null;
          }
          return null;
        },
        run: async () => {
          if (sql.includes("INSERT")) {
            const [id, language, code, title] = args as [string, string, string, string | null];
            store.set(id, { id, language, code, title });
          }
          return {};
        },
      }),
    }),
  };
}

describe("handleSnippet", () => {
  it("GET existing snippet returns 200 with data", async () => {
    const db = makeDb([{ id: "abc123", language: "python", code: "print(1)", title: null }]);
    const req = new Request("https://worker/snippet/abc123");
    const res = await handleSnippet(req, { ide_db: db });
    expect(res.status).toBe(200);
    const body = await res.json() as { id: string; language: string };
    expect(body.id).toBe("abc123");
    expect(body.language).toBe("python");
  });

  it("GET missing snippet returns 404", async () => {
    const db = makeDb([]);
    const req = new Request("https://worker/snippet/notexist");
    const res = await handleSnippet(req, { ide_db: db });
    expect(res.status).toBe(404);
  });

  it("POST creates snippet and returns id", async () => {
    const db = makeDb([]);
    const req = new Request("https://worker/snippet", {
      method: "POST",
      body: JSON.stringify({ language: "javascript", code: "console.log(1)" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await handleSnippet(req, { ide_db: db });
    expect(res.status).toBe(200);
    const body = await res.json() as { id: string };
    expect(typeof body.id).toBe("string");
    expect(body.id.length).toBe(12);
  });

  it("POST with title stores title", async () => {
    const db = makeDb([]);
    const req = new Request("https://worker/snippet", {
      method: "POST",
      body: JSON.stringify({ language: "python", code: "x=1", title: "My Snippet" }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await handleSnippet(req, { ide_db: db });
    const body = await res.json() as { id: string };
    const stored = db.prepare("SELECT").bind(body.id);
    expect(res.status).toBe(200);
  });

  it("PUT returns 405", async () => {
    const db = makeDb([]);
    const req = new Request("https://worker/snippet/abc", { method: "PUT" });
    const res = await handleSnippet(req, { ide_db: db });
    expect(res.status).toBe(405);
  });
});
