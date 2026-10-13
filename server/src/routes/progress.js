import { tx } from '../db.js';
import { isUniqueViolation } from './common.js';
import { recordProgress } from '../stats.js';

const conflict = (reply, row) => reply.code(409).send({
  error: 'conflict', message: 'Прогресс изменился на другом устройстве',
  data: row ? row.data : null, version: row ? row.version : 0
});

export default async function progressRoutes(app){
  const { db, config } = app;

  app.get('/progress', { preHandler: app.requireAuth }, async req => {
    const row = (await db.query('SELECT data, version, updated_at FROM progress WHERE user_id = $1', [req.user.id])).rows[0];
    return row ? { data: row.data, version: row.version, updatedAt: row.updated_at } : { data: null, version: 0, updatedAt: null };
  });

  // Оптимистичная блокировка: запись принимается, только если клиент видел текущую версию.
  // Иначе 409 с данными сервера — клиент сливает их со своими и отправляет снова.
  app.put('/progress', {
    preHandler: app.requireAuth,
    config: { rateLimit: { max: 120, timeWindow: '1 minute', keyGenerator: req => req.cookies[config.cookieName] || req.ip } },
    schema: { body: { type: 'object', required: ['data', 'baseVersion'], additionalProperties: false, properties: {
      data: { type: 'object', required: ['app', 'version'], properties: { app: { const: 'dev-courses' }, version: { const: 2 } } },
      baseVersion: { type: 'integer', minimum: 0 }
    } } }
  }, async (req, reply) => {
    const { data, baseVersion } = req.body;
    try {
      const res = await tx(db, async c => {
        const row = (await c.query('SELECT data, version FROM progress WHERE user_id = $1 FOR UPDATE', [req.user.id])).rows[0];
        if ((row ? row.version : 0) !== baseVersion) return { conflict: row };
        const q = row
          ? await c.query('UPDATE progress SET data = $2, version = version + 1, updated_at = now() WHERE user_id = $1 RETURNING version, updated_at', [req.user.id, data])
          : await c.query('INSERT INTO progress (user_id, data, version) VALUES ($1, $2, 1) RETURNING version, updated_at', [req.user.id, data]);
        await recordProgress(c, req.user.id, data, !row);
        return { saved: q.rows[0] };
      });
      if (res.saved) return { version: res.saved.version, updatedAt: res.saved.updated_at };
      return conflict(reply, res.conflict);
    } catch (e){
      // две вкладки одновременно создали первую запись
      if (!isUniqueViolation(e)) throw e;
      const row = (await db.query('SELECT data, version FROM progress WHERE user_id = $1', [req.user.id])).rows[0];
      return conflict(reply, row);
    }
  });
}
