"use client";

import { useState } from "react";
import { FiShare2, FiCheck } from "react-icons/fi";

type ShareButtonProps = {
  onShare: () => Promise<string>;
  isDark?: boolean;
};

export function ShareButton({ onShare, isDark = true }: ShareButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "copied">("idle");

  const handleClick = async () => {
    if (state !== "idle") return;
    setState("loading");
    try {
      const url = await onShare();
      await navigator.clipboard.writeText(url);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    } catch {
      setState("idle");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === "loading"}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold leading-5 transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 active:translate-y-0 active:scale-95 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
        state === "copied"
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : isDark
          ? "border-white/10 bg-white/[0.06] text-zinc-300 hover:bg-white/10 hover:text-zinc-100"
          : "border-black/10 bg-black/[0.04] text-zinc-600 hover:bg-black/[0.08] hover:text-zinc-900"
      }`}
    >
      {state === "copied" ? (
        <>
          <FiCheck className="h-3.5 w-3.5" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <FiShare2 className="h-3.5 w-3.5" />
          <span>{state === "loading" ? "Saving..." : "Share"}</span>
        </>
      )}
    </button>
  );
}
