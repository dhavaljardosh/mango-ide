"use client";

type Language = "javascript" | "python";

type LanguageSelectorProps = {
  value: Language;
  onChange: (language: Language) => void;
  isDark?: boolean;
};

const options: Array<{ label: string; value: Language }> = [
  { label: "JavaScript", value: "javascript" },
  { label: "Python", value: "python" },
];

export function LanguageSelector({
  value,
  onChange,
  isDark = true,
}: LanguageSelectorProps) {
  return (
    <label
      className={`inline-flex items-center gap-2.5 text-sm ${
        isDark ? "text-zinc-400" : "text-zinc-600"
      }`}
    >
      <span className="text-xs font-medium leading-5 uppercase tracking-[0.12em]">Language</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as Language)}
        className={`cursor-pointer rounded-xl border px-3.5 py-2 text-sm leading-5 shadow-sm outline-none transition-all duration-200 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-orange-400/40 focus-visible:ring-offset-1 ${
          isDark
            ? "border-white/10 bg-[#121212] text-zinc-100 hover:bg-[#181818] focus:border-white/20"
            : "border-black/10 bg-white text-zinc-900 hover:bg-zinc-50 focus:border-zinc-500"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
