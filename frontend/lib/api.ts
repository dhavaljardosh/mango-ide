export async function runCodeAPI(language: string, code: string) {
  const res = await fetch("https://ide-worker.dhavaljardosh.workers.dev/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ language, code }),
  });

  return await res.text();
}
