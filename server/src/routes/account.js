import { letters } from '../mailer.js';
import { hashPassword, verifyPassword } from '../passwords.js';
import { schemas, loadMe } from './common.js';

const WRONG_PASSWORD = { error: 'wrong_password', field: 'password', message: 'Неверный пароль' };

export default async function accountRoutes(app){
  const { db, config, sessions } = app;
  const userLimit = { max: 10, timeWindow: '15 minutes', keyGenerator: req => req.cookies[config.cookieName] || req.ip };
  const currentHash = async userId => (await db.query('SELECT password_hash FROM users WHERE id = $1', [userId])).rows[0]?.password_hash;

  app.get('/me', { preHandler: app.requireAuth }, async req => ({ user: await loadMe(db, req.user.id) }));

  // Проверка входа при загрузке страницы: гость — это не ошибка, поэтому 200 с user: null
  app.get('/session', async (req, reply) => {
    const s = await sessions.lookup(db, req);
    if (!s && req.cookies[config.cookieName]) sessions.clear(reply);
    return { user: s ? await loadMe(db, s.userId) : null };
  });

  app.post('/auth/password', {
    preHandler: app.requireAuth,
    config: { rateLimit: userLimit },
    schema: { body: { type: 'object', required: ['currentPassword', 'newPassword'], additionalProperties: false,
      properties: { currentPassword: { type: 'string', maxLength: 128 }, newPassword: schemas.password } } }
  }, async (req, reply) => {
    const hash = await currentHash(req.user.id);
    if (!hash || !await verifyPassword(hash, req.body.currentPassword)){
      app.audit('password_change_failed', req, req.user.id);
      return reply.code(400).send({ ...WRONG_PASSWORD, field: 'currentPassword', message: 'Текущий пароль неверен' });
    }
    if (config.pwnedCheck && await app.pwned(req.body.newPassword, req.log)){
      return reply.code(400).send({ error: 'pwned_password', field: 'newPassword', message: 'Этот пароль встречается в утечках данных. Выберите другой.' });
    }
    await db.query('UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2', [await hashPassword(req.body.newPassword), req.user.id]);
    await sessions.destroyOthers(db, req.user.id, req.user.sessionHash);
    app.audit('password_changed', req, req.user.id);
    const me = await loadMe(db, req.user.id);
    app.mailer.send({ to: me.email, ...letters.passwordChanged() }).catch(err => req.log.error({ err }, 'не удалось отправить письмо'));
    return reply.code(204).send();
  });

  app.delete('/me', {
    preHandler: app.requireAuth,
    config: { rateLimit: userLimit },
    schema: { body: { type: 'object', required: ['password'], additionalProperties: false, properties: { password: { type: 'string', maxLength: 128 } } } }
  }, async (req, reply) => {
    const hash = await currentHash(req.user.id);
    if (!hash || !await verifyPassword(hash, req.body.password)) return reply.code(400).send(WRONG_PASSWORD);
    // сессии, токены и прогресс удаляются каскадом; в журнале событий остаётся запись без привязки к человеку
    await db.query('DELETE FROM users WHERE id = $1', [req.user.id]);
    app.audit('account_deleted', req, null);
    sessions.clear(reply);
    return reply.code(204).send();
  });
}
