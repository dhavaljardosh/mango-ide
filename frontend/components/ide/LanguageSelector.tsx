"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { LANGUAGES } from "@/lib/languages";

type LanguageSelectorProps = {
  value: string;
  onChange: (languageId: string) => void;
  isDark?: boolean;
};

export function LanguageSelector({ value, onChange, isDark = true }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selected = LANGUAGES.find((l) => l.id === value) ?? LANGUAGES[0];

  const positionMenu = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMenuStyle({
      position: "fixed",
      top: rect.bottom + 6,
      left: rect.left,
      minWidth: rect.width,
      zIndex: 9999,
    });
  }, []);

  const handleOpen = () => {
    positionMenu();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        buttonRef.current && !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleScroll() { positionMenu(); }
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", positionMenu);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", positionMenu);
    };
  }, [open, positionMenu]);

  const SelectedIcon = selected.icon;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        className={`inline-flex items-center gap-2.5 rounded-xl border px-3.5 py-2 text-sm leading-5 shadow-sm outline-none transition-all duration-200 hover:scale-[1.01] focus-visible:ring-2 focus-visible:ring-orange-400/40 ${
          isDark
            ? "border-white/10 bg-[#121212] text-zinc-100 hover:bg-[#181818]"
            : "border-black/10 bg-white text-zinc-900 hover:bg-zinc-50"
        }`}
      >
        <SelectedIcon size={15} color={selected.color} />
        <span className="font-medium">{selected.label}</span>
        <svg
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""} ${isDark ? "text-zinc-500" : "text-zinc-400"}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && typeof document !== "undefined" && createPortal(
        <div
          ref={menuRef}
          style={menuStyle}
          className={`w-52 rounded-2xl border shadow-2xl overflow-hidden ${
            isDark
              ? "border-white/10 bg-[#141414]/98 backdrop-blur-xl"
              : "border-black/10 bg-white/98 backdrop-blur-xl"
          }`}
        >
          <div className="py-1">
            {LANGUAGES.map((lang) => {
              const Icon = lang.icon;
              const isActive = lang.id === value;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => { onChange(lang.id); setOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-sm transition-colors duration-100 ${
                    isActive
                      ? isDark
                        ? "bg-white/8 text-white"
                        : "bg-orange-50 text-zinc-900"
                      : isDark
                      ? "text-zinc-300 hover:bg-white/5 hover:text-white"
                      : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  <span
                    className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md"
                    style={{ backgroundColor: `${lang.color}18` }}
                  >
                    <Icon size={14} color={lang.color} />
                  </span>
                  <span className="font-medium">{lang.label}</span>
                  {isActive && (
                    <svg className="ml-auto h-3.5 w-3.5 text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
