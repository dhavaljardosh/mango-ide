export async function handleTrack(request: Request, env: any) {
  const body = await request.json();

  await env.DB.prepare("INSERT INTO events (event, language) VALUES (?, ?)")
    .bind(body.event, body.language || "unknown")
    .run();

  return new Response("tracked");
}
