"use client";

import { useEffect, useState } from "react";
import { fetchStats, fetchHealth } from "@/lib/api";

type Stats = {
  totalRuns: number;
  byLanguage: Array<{ language: string; count: number }>;
};

type Health = {
  status: string;
  piston?: string;
};

const LANG_COLORS: Record<string, string> = {
  python: "#3b82f6",
  javascript: "#f59e0b",
  typescript: "#06b6d4",
  java: "#f97316",
  rust: "#ef4444",
  go: "#10b981",
  "c++": "#8b5cf6",
  cpp: "#8b5cf6",
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-zinc-100">{value}</p>
      {sub && <p className="mt-1 text-xs text-zinc-500">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [health, setHealth] = useState<Health | null>(null);
  const [error, setError] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  async function load() {
    try {
      const [s, h] = await Promise.all([fetchStats(), fetchHealth()]);
      setStats(s);
      setHealth(h);
      setLastRefresh(new Date());
      setError(false);
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 30_000);
    return () => clearInterval(id);
  }, []);

  const topLang = stats?.byLanguage[0]?.language ?? "—";
  const workerUp = health?.status === "ok";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Mango IDE — Observability</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Refreshes every 30s &middot; Last: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${workerUp ? "bg-emerald-500" : "bg-red-500"}`}
            />
            <span className="text-sm text-zinc-400">Worker {workerUp ? "healthy" : "down"}</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-950/40 p-4 text-sm text-red-400">
            Failed to reach worker. Check that it is deployed and CORS allows this origin.
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <StatCard
            label="Total runs"
            value={stats ? stats.totalRuns.toLocaleString() : "—"}
            sub="all time"
          />
          <StatCard
            label="Languages used"
            value={stats ? stats.byLanguage.length : "—"}
            sub="distinct"
          />
          <StatCard
            label="Top language"
            value={topLang}
            sub={
              stats?.byLanguage[0]
                ? `${stats.byLanguage[0].count.toLocaleString()} runs`
                : undefined
            }
          />
        </div>

        {/* Runs by language */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <h2 className="mb-4 text-sm font-medium uppercase tracking-widest text-zinc-500">
            Runs by language
          </h2>
          {!stats || stats.byLanguage.length === 0 ? (
            <p className="text-sm text-zinc-600">No data yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.byLanguage.map(({ language, count }) => {
                const pct = Math.round((count / stats.totalRuns) * 100);
                const color = LANG_COLORS[language] ?? "#71717a";
                return (
                  <div key={language}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="capitalize text-zinc-300">{language}</span>
                      <span className="text-zinc-500">
                        {count.toLocaleString()} &middot; {pct}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-zinc-800">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-700">
          <a href="/" className="hover:text-zinc-400 transition-colors">
            ← Back to IDE
          </a>
        </p>
      </div>
    </div>
  );
}
