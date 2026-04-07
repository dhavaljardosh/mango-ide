"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CodeEditor } from "./CodeEditor";
import { LanguageSelector } from "./LanguageSelector";
import { OutputPanel } from "./OutputPanel";
import { RunButton } from "./RunButton";
import { ThemeToggle } from "./ThemeToggle";

type Language = "javascript" | "python";

type RunnerResponse =
  | { type: "output"; entries: Array<{ type: "log" | "error"; text: string }> }
  | { type: "done" };

const defaultCodeByLanguage: Record<Language, string> = {
  javascript: `const greeting = "Hello from your JS IDE";
console.log(greeting);
console.log({ time: new Date().toISOString() });`,
  python: `print("Python execution is not available in the browser worker yet.")`,
};

export function IdeShell() {
  const [language, setLanguage] = useState<Language>("javascript");
  const [codeByLanguage, setCodeByLanguage] = useState<
    Record<Language, string>
  >(defaultCodeByLanguage);
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return true;
    }
    return localStorage.getItem("theme") !== "light";
  });
  const workerRef = useRef<Worker | null>(null);

  const currentCode = useMemo(
    () => codeByLanguage[language],
    [codeByLanguage, language],
  );

  useEffect(() => {
    const worker = new Worker(
      new URL("../../workers/codeRunner.worker.ts", import.meta.url),
    );

    worker.onmessage = (event: MessageEvent<RunnerResponse>) => {
      if (event.data.type === "output") {
        const lines = event.data.entries.map((entry) =>
          entry.type === "error" ? `[error] ${entry.text}` : entry.text,
        );
        setOutputLines(lines);
      }

      if (event.data.type === "done") {
        setIsRunning(false);
      }
    };

    workerRef.current = worker;

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const handleRun = useCallback(async () => {
    if (isRunning) {
      return;
    }

    setOutputLines([]);
    setIsRunning(true);

    // JS → Web Worker
    if (language === "javascript") {
      workerRef.current?.postMessage({
        type: "run",
        code: currentCode,
      });
      return;
    }

    // 🐍 Python → Worker API
    try {
      const res = await fetch("http://localhost:8787/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language: "python",
          code: currentCode,
        }),
      });

      const text = await res.text();
      console.log(text);

      setOutputLines(text.split("\n"));
    } catch (err) {
      setOutputLines([`[error] ${err}`]);
    }

    setIsRunning(false);
  }, [currentCode, isRunning, language]);

  const handleCodeChange = (nextCode: string) => {
    setCodeByLanguage((prev) => ({ ...prev, [language]: nextCode }));
  };

  useEffect(() => {
    const isTypingInNonEditorField = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) {
        return false;
      }

      // Monaco editor uses a textarea internally; keep shortcut active there.
      if (target.closest(".monaco-editor")) {
        return false;
      }

      const tagName = target.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") {
        return true;
      }

      return Boolean(target.closest('[contenteditable="true"], [role="textbox"]'));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const isRunShortcut = event.key === "Enter" && (event.metaKey || event.ctrlKey);
      if (!isRunShortcut || isRunning || isTypingInNonEditorField(event.target)) {
        return;
      }

      event.preventDefault();
      void handleRun();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleRun, isRunning]);

  return (
    <div
      className={`flex h-screen w-full flex-col overflow-hidden transition-all duration-200 ${
        isDark ? "bg-[#0f0f0f] text-zinc-100" : "bg-[#f7f7f8] text-zinc-900"
      }`}
    >
      <header
        className={`flex flex-wrap items-center justify-between gap-3 border-b px-6 py-4 backdrop-blur-sm transition-all duration-200 ${
          isDark ? "border-white/10 bg-white/[0.02]" : "border-black/10 bg-white/80"
        }`}
      >
        <div className="flex min-w-0 flex-1 items-center">
          <span className="text-base font-semibold leading-6 tracking-tight bg-gradient-to-r from-orange-400 to-yellow-500 bg-clip-text text-transparent">
            🥭 Mango IDE
          </span>
        </div>

        <div className="flex flex-none items-center justify-center">
          <LanguageSelector value={language} onChange={setLanguage} isDark={isDark} />
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2.5">
          <RunButton onClick={handleRun} isRunning={isRunning} isDark={isDark} />
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </div>
      </header>

      <main
        className={`grid min-h-0 flex-1 grid-cols-1 gap-4 p-4 md:grid-cols-10 md:p-5 ${
          isDark ? "bg-[#0c0c0d]" : "bg-[#f1f2f4]"
        }`}
      >
        <section
          className={`min-h-0 h-full rounded-2xl p-1 md:col-span-7 ${
            isDark ? "bg-white/[0.02]" : "bg-black/[0.03]"
          }`}
        >
          <CodeEditor
            value={currentCode}
            language={language}
            onChange={handleCodeChange}
            isDark={isDark}
          />
        </section>
        <section
          className={`min-h-0 h-full rounded-2xl p-1 md:col-span-3 ${
            isDark ? "bg-white/[0.02]" : "bg-black/[0.03]"
          }`}
        >
          <OutputPanel lines={outputLines} isRunning={isRunning} isDark={isDark} />
        </section>
      </main>
    </div>
  );
}
