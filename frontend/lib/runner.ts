import { runCodeAPI } from "./api";

export async function runCode(
  language: string,
  code: string,
  worker: Worker | null,
) {
  if (language === "javascript") {
    return new Promise((resolve) => {
      if (!worker) return resolve("Worker not initialized");

      worker.onmessage = (e) => {
        resolve(e.data);
      };

      worker.postMessage(code);
    });
  }

  if (language === "python") {
    return await runCodeAPI(language, code);
  }

  return "Unsupported language";
}
