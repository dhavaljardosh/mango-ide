export async function handleSnippet(request: Request, env: any) {
  const body = await request.json();

  await env.DB.prepare("INSERT INTO snippets (code, language) VALUES (?, ?)")
    .bind(body.code, body.language)
    .run();

  return new Response("saved");
}
