"use client";

import { FaPlay, FaStop } from "react-icons/fa";

type RunButtonProps = {
  onClick: () => void;
  isRunning: boolean;
  disabled?: boolean;
  isDark?: boolean;
};

export function RunButton({
  onClick,
  isRunning,
  disabled = false,
  isDark = true,
}: RunButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold leading-5 text-white shadow-[0_8px_20px_rgba(234,88,12,0.35)] transition-all duration-200 will-change-transform hover:-translate-y-0.5 hover:scale-105 active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60 focus-visible:ring-offset-1 ${
        isRunning
          ? "border-white/10 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500"
          : isDark
          ? "border-white/10 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400"
          : "border-black/10 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400"
      } disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100`}
    >
      {isRunning ? (
        <>
          <FaStop className="h-3 w-3" />
          <span>Stop</span>
        </>
      ) : (
        <>
          <FaPlay className="h-3 w-3" />
          <span>Run</span>
        </>
      )}
    </button>
  );
}
