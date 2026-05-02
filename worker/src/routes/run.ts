async function runViaPiston(pistonUrl: string, language: string, code: string) {
  const res = await fetch(`${pistonUrl}/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language,
      version: "*",
      files: [{ content: code }],
    }),
  });
  if (!res.ok) throw new Error(`Piston error: ${res.status}`);
  const data = await res.json() as { run: { stdout: string; stderr: string } };
  return data.run.stdout + data.run.stderr;
}

async function runViaFlask(executionUrl: string, language: string, code: string) {
  const res = await fetch(`${executionUrl}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ language, code }),
  });
  if (!res.ok) throw new Error(`Execution server error: ${res.status}`);
  return res.text();
}

export async function handleRun(request: Request, env: any) {
  const requestId = crypto.randomUUID();
  try {
    const body = await request.json() as { language: string; code: string };

    if (env.ide_db) {
      await env.ide_db.prepare(
        "INSERT INTO events (event, language, request_id) VALUES (?, ?, ?)",
      )
        .bind("run_code", body.language, requestId)
        .run();
    }

    let output: string;
    if (env.PISTON_URL) {
      output = await runViaPiston(env.PISTON_URL as string, body.language, body.code);
    } else if (env.EXECUTION_URL) {
      output = await runViaFlask(env.EXECUTION_URL as string, body.language, body.code);
    } else {
      throw new Error("No execution backend configured");
    }

    return new Response(output, {
      headers: { "X-Request-Id": requestId },
    });
  } catch (err: any) {
    console.error(JSON.stringify({ requestId, event: "error", message: err.message }));
    return new Response("error", { status: 500 });
  }
}
