"use client";

import MonacoEditor from "@monaco-editor/react";

type CodeEditorProps = {
  value: string;
  language: "javascript" | "python";
  onChange: (value: string) => void;
  isDark?: boolean;
};

export function CodeEditor({
  value,
  language,
  onChange,
  isDark = false,
}: CodeEditorProps) {
  return (
    <div
      className={`h-full w-full overflow-hidden rounded-2xl border shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all duration-200 ${
        isDark ? "border-white/10 bg-[#161617]" : "border-black/10 bg-[#fcfcfd]"
      }`}
    >
      <MonacoEditor
        height="100%"
        language={language}
        value={value}
        theme={isDark ? "vs-dark" : "vs"}
        onChange={(next) => onChange(next ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 22,
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
          fontFamily: "var(--font-geist-mono), Menlo, Monaco, monospace",
        }}
      />
    </div>
  );
}
