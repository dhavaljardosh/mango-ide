import { describe, it, expect } from "vitest";
import { checkRateLimit } from "../utils/rateLimit";

// Mock KV namespace
function makeKV(): KVNamespace {
  const store = new Map<string, string>();
  return {
    async get(key: string) { return store.get(key) ?? null; },
    async put(key: string, value: string) { store.set(key, value); },
    async delete(key: string) { store.delete(key); },
    async list() { return { keys: [], list_complete: true, cursor: "" }; },
    async getWithMetadata(key: string) { return { value: store.get(key) ?? null, metadata: null }; },
  } as unknown as KVNamespace;
}

describe("checkRateLimit", () => {
  it("allows first request", async () => {
    const kv = makeKV();
    const result = await checkRateLimit("1.2.3.4", kv);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(19);
  });

  it("tracks count across requests", async () => {
    const kv = makeKV();
    for (let i = 0; i < 19; i++) {
      await checkRateLimit("1.2.3.4", kv);
    }
    const result = await checkRateLimit("1.2.3.4", kv);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(0);
  });

  it("blocks after 20 requests", async () => {
    const kv = makeKV();
    for (let i = 0; i < 20; i++) {
      await checkRateLimit("1.2.3.4", kv);
    }
    const result = await checkRateLimit("1.2.3.4", kv);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("different IPs have separate limits", async () => {
    const kv = makeKV();
    for (let i = 0; i < 20; i++) {
      await checkRateLimit("1.2.3.4", kv);
    }
    const result = await checkRateLimit("9.9.9.9", kv);
    expect(result.allowed).toBe(true);
  });

  it("falls back to in-memory when KV undefined", async () => {
    const result = await checkRateLimit("5.5.5.5", undefined);
    expect(result.allowed).toBe(true);
  });
});
