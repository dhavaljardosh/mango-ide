"use client";

type OutputPanelProps = {
  lines: string[];
  isRunning: boolean;
  isDark?: boolean;
};

export function OutputPanel({ lines, isRunning, isDark = true }: OutputPanelProps) {
  return (
    <section
      className={`flex h-full min-h-0 flex-col rounded-2xl border shadow-[0_12px_40px_rgba(0,0,0,0.22)] transition-all duration-200 ${
        isDark ? "border-white/10 bg-[#161617]" : "border-black/10 bg-[#fcfcfd]"
      }`}
    >
      <header
        className={`border-b px-4 py-3 text-xs font-medium leading-5 uppercase tracking-[0.12em] ${
          isDark ? "border-white/10 text-zinc-400" : "border-black/10 text-zinc-500"
        }`}
      >
        Output
      </header>
      <div className="min-h-0 flex-1 overflow-auto px-4 py-3.5 font-mono text-sm leading-6 text-[#22c55e]">
        {isRunning ? <p className={isDark ? "text-zinc-400" : "text-zinc-500"}>Running...</p> : null}
        {!isRunning && lines.length === 0 ? (
          <p className={isDark ? "text-zinc-400" : "text-zinc-500"}>Press Run to execute code.</p>
        ) : null}
        {lines.map((line, index) => (
          <p key={`${line}-${index}`} className="animate-output-fade break-words whitespace-pre-wrap">
            {line}
          </p>
        ))}
      </div>
    </section>
  );
}
