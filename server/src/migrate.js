import { readdir, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createPool, tx } from './db.js';

const dir = new URL('../migrations/', import.meta.url);

export async function migrate(pool, log = console.log){
  await pool.query('CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())');
  const done = new Set((await pool.query('SELECT name FROM schema_migrations')).rows.map(r => r.name));
  const files = (await readdir(dir)).filter(f => f.endsWith('.sql')).sort();
  for (const name of files){
    if (done.has(name)) continue;
    const sql = await readFile(new URL(name, dir), 'utf8');
    await tx(pool, async c => {
      await c.query(sql);
      await c.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name]);
    });
    log(`миграция применена: ${name}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href){
  const pool = createPool(process.env.DATABASE_URL);
  try { await migrate(pool); } finally { await pool.end(); }
}
