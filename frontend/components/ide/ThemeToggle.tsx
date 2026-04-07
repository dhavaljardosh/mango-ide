"use client";

type ThemeToggleProps = {
  isDark: boolean;
  onToggle: () => void;
};

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`cursor-pointer rounded-xl border px-3.5 py-2 text-sm font-medium leading-5 shadow-sm transition-all duration-200 hover:scale-[1.01] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400/40 focus-visible:ring-offset-1 ${
        isDark
          ? "border-white/10 bg-white/[0.03] text-zinc-100 hover:bg-white/[0.08]"
          : "border-black/10 bg-white text-zinc-700 hover:bg-zinc-100"
      }`}
    >
      {isDark ? "Dark" : "Light"}
    </button>
  );
}
