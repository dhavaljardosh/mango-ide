export async function handleStats(env: any) {
  const total = await env.DB.prepare(
    "SELECT COUNT(*) as count FROM events",
  ).first();

  const js = await env.DB.prepare(
    "SELECT COUNT(*) as count FROM events WHERE language='javascript'",
  ).first();

  const python = await env.DB.prepare(
    "SELECT COUNT(*) as count FROM events WHERE language='python'",
  ).first();

  return Response.json({
    totalRuns: total.count,
    jsRuns: js.count,
    pythonRuns: python.count,
  });
}
