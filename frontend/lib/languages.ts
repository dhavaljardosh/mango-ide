import {
  SiJavascript,
  SiPython,
  SiTypescript,
  SiGo,
  SiRust,
  SiCplusplus,
  SiRuby,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";
import type { IconType } from "react-icons";

export interface Language {
  id: string;
  label: string;
  monacoLanguage: string;
  pistonLanguage: string;
  pistonVersion: string;
  defaultCode: string;
  runInBrowser: boolean;
  icon: IconType;
  color: string;
}

export const LANGUAGES: Language[] = [
  {
    id: "javascript",
    label: "JavaScript",
    monacoLanguage: "javascript",
    pistonLanguage: "javascript",
    pistonVersion: "18.15.0",
    defaultCode: `const greeting = "Hello from Mango IDE";\nconsole.log(greeting);\nconsole.log({ time: new Date().toISOString() });`,
    runInBrowser: true,
    icon: SiJavascript,
    color: "#F7DF1E",
  },
  {
    id: "python",
    label: "Python",
    monacoLanguage: "python",
    pistonLanguage: "python",
    pistonVersion: "3.10.0",
    defaultCode: `print("Hello from Mango IDE!")`,
    runInBrowser: false,
    icon: SiPython,
    color: "#3776AB",
  },
  {
    id: "typescript",
    label: "TypeScript",
    monacoLanguage: "typescript",
    pistonLanguage: "typescript",
    pistonVersion: "5.0.3",
    defaultCode: `const greet = (name: string): string => \`Hello, \${name}!\`;\nconsole.log(greet("Mango IDE"));`,
    runInBrowser: false,
    icon: SiTypescript,
    color: "#3178C6",
  },
  {
    id: "go",
    label: "Go",
    monacoLanguage: "go",
    pistonLanguage: "go",
    pistonVersion: "1.16.2",
    defaultCode: `package main\n\nimport "fmt"\n\nfunc main() {\n\tfmt.Println("Hello from Mango IDE!")\n}`,
    runInBrowser: false,
    icon: SiGo,
    color: "#00ADD8",
  },
  {
    id: "rust",
    label: "Rust",
    monacoLanguage: "rust",
    pistonLanguage: "rust",
    pistonVersion: "1.68.2",
    defaultCode: `fn main() {\n    println!("Hello from Mango IDE!");\n}`,
    runInBrowser: false,
    icon: SiRust,
    color: "#CE422B",
  },
  {
    id: "java",
    label: "Java",
    monacoLanguage: "java",
    pistonLanguage: "java",
    pistonVersion: "15.0.2",
    defaultCode: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Mango IDE!");\n    }\n}`,
    runInBrowser: false,
    icon: FaJava,
    color: "#ED8B00",
  },
  {
    id: "cpp",
    label: "C++",
    monacoLanguage: "cpp",
    pistonLanguage: "c++",
    pistonVersion: "10.2.0",
    defaultCode: `#include <iostream>\n\nint main() {\n    std::cout << "Hello from Mango IDE!" << std::endl;\n    return 0;\n}`,
    runInBrowser: false,
    icon: SiCplusplus,
    color: "#00599C",
  },
  {
    id: "ruby",
    label: "Ruby",
    monacoLanguage: "ruby",
    pistonLanguage: "ruby",
    pistonVersion: "3.0.1",
    defaultCode: `puts "Hello from Mango IDE!"`,
    runInBrowser: false,
    icon: SiRuby,
    color: "#CC342D",
  },
];

export const LANGUAGE_MAP = Object.fromEntries(LANGUAGES.map((l) => [l.id, l]));

export const DEFAULT_LANGUAGE_ID = "javascript";
