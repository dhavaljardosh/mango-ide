type RunnerMessage = {
  type: "run";
  code: string;
};

type OutputEntry = {
  type: "log" | "error";
  text: string;
};

type RunnerResponse =
  | { type: "output"; entries: OutputEntry[] }
  | { type: "done" };

type WorkerContext = {
  console: Console;
  postMessage: (message: RunnerResponse) => void;
  onmessage: ((event: MessageEvent<RunnerMessage>) => void) | null;
};

const workerContext = self as unknown as WorkerContext;

const formatValue = (value: unknown): string => {
  if (typeof value === "string") {
    return value;
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const runUserCode = async (code: string) => {
  const captured: OutputEntry[] = [];

  const capture = (type: "log" | "error", args: unknown[]) => {
    captured.push({
      type,
      text: args.map((arg) => formatValue(arg)).join(" "),
    });
  };

  const originalConsole = workerContext.console;
  const patchedConsole: Console = {
    ...originalConsole,
    log: (...args: unknown[]) => capture("log", args),
    error: (...args: unknown[]) => capture("error", args),
  };

  try {
    workerContext.console = patchedConsole;

    const AsyncFunction = Object.getPrototypeOf(async function () {
      // noop
    }).constructor as new (...args: string[]) => () => Promise<void>;

    const fn = new AsyncFunction(code);
    await fn();
  } catch (error) {
    capture("error", [error instanceof Error ? error.message : String(error)]);
  } finally {
    workerContext.console = originalConsole;
  }

  workerContext.postMessage({
    type: "output",
    entries: captured,
  } satisfies RunnerResponse);
  workerContext.postMessage({
    type: "done",
  } satisfies RunnerResponse);
};

workerContext.onmessage = (event: MessageEvent<RunnerMessage>) => {
  if (event.data.type === "run") {
    void runUserCode(event.data.code);
  }
};
