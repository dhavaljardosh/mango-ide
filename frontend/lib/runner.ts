import { runCodeAPI } from "./api";
import { LANGUAGE_MAP } from "./languages";

export async function runCode(
  languageId: string,
  code: string,
  browserWorker: Worker | null,
): Promise<void> {
  const lang = LANGUAGE_MAP[languageId];
  if (!lang) throw new Error(`Unknown language: ${languageId}`);

  if (lang.runInBrowser) {
    browserWorker?.postMessage({ type: "run", code });
    return;
  }

  throw new Error("Use runCodeAPI for non-browser languages");
}

export { runCodeAPI };
