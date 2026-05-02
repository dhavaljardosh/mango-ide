export async function handleSnippet(request: Request, env: any) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const snippetId = segments[1]; // /snippet/:id

  if (request.method === "GET" && snippetId) {
    const row = await env.ide_db.prepare(
      "SELECT id, language, code, title FROM snippets WHERE id = ?",
    )
      .bind(snippetId)
      .first();

    if (!row) return new Response("Not Found", { status: 404 });
    return Response.json(row);
  }

  if (request.method === "POST") {
    const body = await request.json() as { language: string; code: string; title?: string };
    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);

    await env.ide_db.prepare(
      "INSERT INTO snippets (id, language, code, title) VALUES (?, ?, ?, ?)",
    )
      .bind(id, body.language, body.code, body.title ?? null)
      .run();

    return Response.json({ id });
  }

  return new Response("Method Not Allowed", { status: 405 });
}
