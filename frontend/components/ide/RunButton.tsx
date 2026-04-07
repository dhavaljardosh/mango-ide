"use client";

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
      disabled={disabled || isRunning}
      className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold leading-5 text-white shadow-[0_8px_20px_rgba(234,88,12,0.35)] transition-all duration-200 will-change-transform hover:-translate-y-0.5 hover:scale-105 active:translate-y-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/60 focus-visible:ring-offset-1 ${
        isDark
          ? "border-white/10 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400"
          : "border-black/10 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400"
      } disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:active:scale-100`}
    >
      {isRunning ? (
        <>
          <span className="inline-block animate-pulse">⚡</span>
          <span className="animate-pulse">Running...</span>
        </>
      ) : (
        "Run"
      )}
    </button>
  );
}
