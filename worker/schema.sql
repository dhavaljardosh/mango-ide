CREATE TABLE IF NOT EXISTS snippets (
  id TEXT PRIMARY KEY,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  title TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'unknown',
  request_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
