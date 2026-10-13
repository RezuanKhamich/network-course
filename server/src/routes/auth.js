import { tx } from '../db.js';
import { letters } from '../mailer.js';
import { hashPassword, verifyPassword, verifyAgainstDummy } from '../passwords.js';
import { newToken, tokenHash } from '../tokens.js';
import { schemas, normEmail, loadMe, mailAllowed, isUniqueViolation } from './common.js';

const ACCEPTED = { ok: true, message: 'Если адрес указан верно, на него придёт письмо.' };
const PWNED = { error: 'pwned_password', field: 'password', message: 'Этот пароль встречается в утечках данных. Выберите другой.' };
const BAD_TOKEN = { error: 'invalid_token', message: 'Ссылка недействительна или устарела. Запросите новую.' };

export default async function authRoutes(app){
  const { db, config, mailer, sessions } = app;
  const link = path => `${config.appOrigin}/#/auth/${path}`;
  const send = async (req, to, letter) => {
    try { await mailer.send({ to, ...letter }); return true; }
    catch (err){ req.log.error({ err }, 'не удалось отправить письмо'); return false; }
  };
  const mailFailed = reply => reply.code(503).send({ error: 'mail_failed', message: 'Не удалось отправить письмо. Попробуйте позже.' });

  app.post('/auth/register', {
    config: { rateLimit: { max: 5, timeWindow: '1 hour' } },
    schema: { body: { type: 'object', required: ['email', 'password', 'consent'], additionalProperties: false,
      properties: { email: schemas.email, password: schemas.password, consent: { const: true } } } }
  }, async (req, reply) => {
    const email = normEmail(req.body.email);
    if (config.pwnedCheck && await app.pwned(req.body.password, req.log)) return reply.code(400).send(PWNED);
    // хеш считается при любом исходе, чтобы время ответа не выдавало, есть ли такой адрес
    const passwordHash = await hashPassword(req.body.password);
    if (!mailAllowed(email)) return reply.code(202).send(ACCEPTED);
    const existing = (await db.query('SELECT id FROM users WHERE email = $1', [email])).rows[0];
    let ok;
    if (existing){
      app.audit('register_existing', req, existing.id);
      ok = await send(req, email, letters.alreadyRegistered(link('forgot')));
    } else {
      const token = newToken();
      await db.query(
        `INSERT INTO email_tokens (token_hash, purpose, email, password_hash, expires_at) VALUES ($1, 'verify', $2, $3, $4)`,
        [tokenHash(token), email, passwordHash, new Date(Date.now() + config.verifyTtlMs)]
      );
      ok = await send(req, email, letters.verify(link('verify/' + token)));
    }
    return ok ? reply.code(202).send(ACCEPTED) : mailFailed(reply);
  });

  app.post('/auth/verify', {
    config: { rateLimit: { max: 20, timeWindow: '1 hour' } },
    schema: { body: { type: 'object', required: ['token'], additionalProperties: false, properties: { token: schemas.token } } }
  }, async (req, reply) => {
    try {
      const userId = await tx(db, async c => {
        const t = (await c.query(
          `SELECT * FROM email_tokens WHERE token_hash = $1 AND purpose = 'verify' FOR UPDATE`, [tokenHash(req.body.token)]
        )).rows[0];
        if (!t || t.used_at || t.expires_at < new Date()) return null;
        await c.query(`UPDATE email_tokens SET used_at = now() WHERE purpose = 'verify' AND email = $1 AND used_at IS NULL`, [t.email]);
        const exists = (await c.query('SELECT 1 FROM users WHERE email = $1', [t.email])).rowCount;
        if (exists) return 'exists';
        const id = (await c.query(
          `INSERT INTO users (email, password_hash, email_verified_at, privacy_consent_at) VALUES ($1, $2, now(), $3) RETURNING id`,
          [t.email, t.password_hash, t.created_at]
        )).rows[0].id;
        await sessions.create(c, req, reply, id);
        return Number(id);
      });
      if (!userId) return reply.code(400).send(BAD_TOKEN);
      if (userId === 'exists') return reply.code(409).send({ error: 'already_verified', message: 'Аккаунт уже подтверждён. Войдите с паролем.' });
      app.audit('register', req, userId);
      return { user: await loadMe(db, userId) };
    } catch (e){
      if (isUniqueViolation(e)) return reply.code(409).send({ error: 'already_verified', message: 'Аккаунт уже подтверждён. Войдите с паролем.' });
      throw e;
    }
  });

  app.post('/auth/login', {
    config: { rateLimit: { max: 10, timeWindow: '15 minutes', hook: 'preHandler', keyGenerator: req => req.ip + '|' + normEmail(req.body?.email) } },
    schema: { body: { type: 'object', required: ['email', 'password'], additionalProperties: false,
      properties: { email: { type: 'string', maxLength: 254 }, password: { type: 'string', maxLength: 128 } } } }
  }, async (req, reply) => {
    const email = normEmail(req.body.email);
    const user = (await db.query('SELECT id, password_hash FROM users WHERE email = $1', [email])).rows[0];
    const ok = user ? await verifyPassword(user.password_hash, req.body.password) : await verifyAgainstDummy(req.body.password);
    if (!ok){
      app.audit('login_failed', req, user?.id);
      return reply.code(401).send({ error: 'invalid_credentials', message: 'Неверный email или пароль' });
    }
    await sessions.create(db, req, reply, user.id);
    app.audit('login', req, user.id);
    return { user: await loadMe(db, user.id) };
  });

  app.post('/auth/logout', async (req, reply) => {
    await sessions.destroy(db, req, reply);
    return reply.code(204).send();
  });

  app.post('/auth/forgot', {
    config: { rateLimit: { max: 5, timeWindow: '1 hour' } },
    schema: { body: { type: 'object', required: ['email'], additionalProperties: false, properties: { email: schemas.email } } }
  }, async (req, reply) => {
    const email = normEmail(req.body.email);
    const user = (await db.query('SELECT id FROM users WHERE email = $1', [email])).rows[0];
    if (!user || !mailAllowed(email)) return reply.code(202).send(ACCEPTED);
    const token = newToken();
    await db.query(
      `INSERT INTO email_tokens (token_hash, purpose, email, user_id, expires_at) VALUES ($1, 'reset', $2, $3, $4)`,
      [tokenHash(token), email, user.id, new Date(Date.now() + config.resetTtlMs)]
    );
    app.audit('reset_requested', req, user.id);
    return await send(req, email, letters.reset(link('reset/' + token))) ? reply.code(202).send(ACCEPTED) : mailFailed(reply);
  });

  app.post('/auth/reset', {
    config: { rateLimit: { max: 20, timeWindow: '1 hour' } },
    schema: { body: { type: 'object', required: ['token', 'password'], additionalProperties: false,
      properties: { token: schemas.token, password: schemas.password } } }
  }, async (req, reply) => {
    if (config.pwnedCheck && await app.pwned(req.body.password, req.log)) return reply.code(400).send(PWNED);
    const passwordHash = await hashPassword(req.body.password);
    const user = await tx(db, async c => {
      const t = (await c.query(
        `SELECT * FROM email_tokens WHERE token_hash = $1 AND purpose = 'reset' FOR UPDATE`, [tokenHash(req.body.token)]
      )).rows[0];
      if (!t || t.used_at || t.expires_at < new Date()) return null;
      await c.query(`UPDATE email_tokens SET used_at = now() WHERE purpose = 'reset' AND user_id = $1 AND used_at IS NULL`, [t.user_id]);
      await c.query('UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2', [passwordHash, t.user_id]);
      // все старые сессии, в том числе возможно украденные, завершаются
      await c.query('DELETE FROM sessions WHERE user_id = $1', [t.user_id]);
      await sessions.create(c, req, reply, t.user_id);
      return { id: Number(t.user_id), email: t.email };
    });
    if (!user) return reply.code(400).send(BAD_TOKEN);
    app.audit('password_reset', req, user.id);
    await send(req, user.email, letters.passwordChanged());
    return { user: await loadMe(db, user.id) };
  });
}
