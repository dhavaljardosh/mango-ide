const WINDOW_SEC = 60;
const MAX_RUNS = 20;

// In-memory fallback for local dev (no KV)
const localStore = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(
  ip: string,
  kv: KVNamespace | undefined,
): Promise<{ allowed: boolean; remaining: number }> {
  if (!kv) {
    // Local dev fallback
    const now = Date.now();
    const entry = localStore.get(ip);
    if (!entry || now > entry.resetAt) {
      localStore.set(ip, { count: 1, resetAt: now + WINDOW_SEC * 1000 });
      return { allowed: true, remaining: MAX_RUNS - 1 };
    }
    if (entry.count >= MAX_RUNS) return { allowed: false, remaining: 0 };
    entry.count++;
    return { allowed: true, remaining: MAX_RUNS - entry.count };
  }

  const key = `rl:${ip}:${Math.floor(Date.now() / (WINDOW_SEC * 1000))}`;
  const raw = await kv.get(key);
  const count = raw ? parseInt(raw, 10) : 0;

  if (count >= MAX_RUNS) return { allowed: false, remaining: 0 };

  await kv.put(key, String(count + 1), { expirationTtl: WINDOW_SEC * 2 });
  return { allowed: true, remaining: MAX_RUNS - count - 1 };
}
