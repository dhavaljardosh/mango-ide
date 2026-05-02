"use client";

import MonacoEditor, { type BeforeMount, loader } from "@monaco-editor/react";

// Load Monaco from CDN with workers enabled
loader.config({
  paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs" },
});

type CodeEditorProps = {
  value: string;
  language: string;
  onChange: (value: string) => void;
  isDark?: boolean;
};

const handleBeforeMount: BeforeMount = (monaco) => {
  monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    allowJs: true,
    checkJs: true,
  });
  monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
    strict: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  });
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
        beforeMount={handleBeforeMount}
        onChange={(next) => onChange(next ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 22,
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 2,
          fontFamily: "JetBrains Mono, Menlo, Monaco, monospace",
          quickSuggestions: { other: true, comments: false, strings: true },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          tabCompletion: "on",
          wordBasedSuggestions: "currentDocument",
          parameterHints: { enabled: true },
          inlineSuggest: { enabled: true },
          suggest: {
            showKeywords: true,
            showSnippets: true,
            showFunctions: true,
            showVariables: true,
            showClasses: true,
            showModules: true,
            showProperties: true,
            showMethods: true,
            insertMode: "insert",
          },
        }}
      />
    </div>
  );
}
