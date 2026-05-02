export async function handleStats(env: any) {
  const total = await env.ide_db.prepare(
    "SELECT COUNT(*) as count FROM events WHERE event = 'run_code'",
  ).first() as { count: number };

  const byLanguage = await env.ide_db.prepare(
    "SELECT language, COUNT(*) as count FROM events WHERE event = 'run_code' GROUP BY language ORDER BY count DESC",
  ).all() as { results: Array<{ language: string; count: number }> };

  return Response.json({
    totalRuns: total.count,
    byLanguage: byLanguage.results,
  });
}
