import { describe, it, expect } from "vitest";
import { handleStats } from "../routes/stats";

function makeDb(totalCount: number, byLanguage: Array<{ language: string; count: number }>) {
  let callIndex = 0;
  return {
    prepare: () => ({
      first: async () => {
        callIndex++;
        return { count: totalCount };
      },
      all: async () => ({ results: byLanguage }),
    }),
  };
}

describe("handleStats", () => {
  it("returns totalRuns and byLanguage", async () => {
    const db = makeDb(42, [
      { language: "python", count: 30 },
      { language: "javascript", count: 12 },
    ]);
    const res = await handleStats({ ide_db: db });
    expect(res.status).toBe(200);
    const body = await res.json() as { totalRuns: number; byLanguage: unknown[] };
    expect(body.totalRuns).toBe(42);
    expect(body.byLanguage).toHaveLength(2);
  });

  it("returns empty byLanguage when no events", async () => {
    const db = makeDb(0, []);
    const res = await handleStats({ ide_db: db });
    const body = await res.json() as { totalRuns: number; byLanguage: unknown[] };
    expect(body.totalRuns).toBe(0);
    expect(body.byLanguage).toHaveLength(0);
  });
});
