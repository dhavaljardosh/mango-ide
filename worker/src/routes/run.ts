export async function handleRun(request: Request, env: any) {
  try {
    const body = await request.json();
    console.log("Incoming request:", body);
    console.log("DB:", env.DB);
    if (env.DB) {
      await env.DB.prepare("INSERT INTO events (event, language) VALUES (?, ?)")
        .bind("run_code", body.language)
        .run();
    }

    if (body.language === "python") {
      const res = await fetch(env.EXECUTION_URL + "/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      console.log("Python response:", text);

      return new Response(text);
    }

    return Response.json({ message: "JS handled in browser" });
  } catch (err: any) {
    console.error("ERROR:", err);
    return new Response("Worker error: " + err.message, { status: 500 });
  }
}
