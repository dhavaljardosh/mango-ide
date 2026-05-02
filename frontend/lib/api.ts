const WORKER_URL =
  process.env.NEXT_PUBLIC_WORKER_URL ||
  "https://ide-worker-production.dhavaljardosh.workers.dev";

export async function runCodeAPI(language: string, code: string, signal?: AbortSignal): Promise<string> {
  const res = await fetch(`${WORKER_URL}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, code }),
    signal,
  });
  return res.text();
}

export async function saveSnippet(language: string, code: string, title?: string): Promise<string> {
  const res = await fetch(`${WORKER_URL}/snippet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, code, title }),
  });
  const data = await res.json() as { id: string };
  return data.id;
}

export async function loadSnippet(id: string): Promise<{ language: string; code: string; title?: string } | null> {
  const res = await fetch(`${WORKER_URL}/snippet/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export function logEvent(language: string, event = "run_code"): void {
  fetch(`${WORKER_URL}/log`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, event }),
  }).catch(() => {});
}

export async function fetchStats(): Promise<{ totalRuns: number; byLanguage: Array<{ language: string; count: number }> }> {
  const res = await fetch(`${WORKER_URL}/stats`);
  return res.json();
}

export async function fetchHealth(): Promise<{ status: string; piston?: string }> {
  const res = await fetch(`${WORKER_URL}/health`);
  return res.json();
}
