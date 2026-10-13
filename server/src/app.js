import Fastify from 'fastify';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import { sessionStore } from './sessions.js';
import { createMailer } from './mailer.js';
import { isPwned } from './passwords.js';
import authRoutes from './routes/auth.js';
import accountRoutes from './routes/account.js';
import progressRoutes from './routes/progress.js';
import friendsRoutes from './routes/friends.js';

const FIELD_MESSAGES = {
  email: 'Некорректный email',
  password: 'Пароль должен быть от 10 до 128 символов',
  newPassword: 'Пароль должен быть от 10 до 128 символов',
  consent: 'Нужно согласие на обработку персональных данных',
  token: 'Ссылка недействительна или устарела',
  nickname: 'Ник: от 3 до 20 символов — латинские буквы, цифры и _'
};

export async function buildApp({ config, pool, mailer, pwned = isPwned, logger = true }){
  const app = Fastify({
    logger: logger && {
      level: config.production ? 'info' : 'debug',
      redact: ['req.headers.cookie', 'req.headers.authorization', 'res.headers["set-cookie"]']
    },
    trustProxy: config.trustProxy,
    bodyLimit: 1024 * 1024
  });

  app.decorate('config', config);
  app.decorate('db', pool);
  app.decorate('mailer', mailer || createMailer(config, app.log));
  app.decorate('pwned', pwned);
  app.decorate('sessions', sessionStore(config));
  app.decorateRequest('user', null);

  await app.register(cookie);
  await app.register(rateLimit, {
    global: false,
    errorResponseBuilder: () => ({ statusCode: 429, error: 'rate_limit', message: 'Слишком много попыток. Попробуйте позже.' })
  });

  // CSRF: браузер всегда шлёт Origin с POST/PUT/DELETE, так что запрос со страницы чужого сайта отсекается здесь.
  // Вторая линия — SameSite=Lax у cookie сессии и приём только application/json.
  app.addHook('onRequest', async (req, reply) => {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return;
    const origin = req.headers.origin;
    if (origin && origin !== config.appOrigin) return reply.code(403).send({ error: 'bad_origin', message: 'Запрос с чужого сайта отклонён' });
  });
  app.addHook('onSend', async (req, reply, payload) => {
    reply.header('Cache-Control', 'no-store');
    reply.header('X-Content-Type-Options', 'nosniff');
    return payload;
  });

  app.decorate('requireAuth', async (req, reply) => {
    const s = await app.sessions.lookup(pool, req);
    if (!s){
      if (req.cookies[config.cookieName]) app.sessions.clear(reply);
      return reply.code(401).send({ error: 'unauthorized', message: 'Нужно войти' });
    }
    req.user = { id: s.userId, sessionHash: s.tokenHash };
  });

  app.decorate('audit', (type, req, userId = null) =>
    pool.query('INSERT INTO auth_events (user_id, type, ip, user_agent) VALUES ($1, $2, $3, $4)',
      [userId, type, req.ip, (req.headers['user-agent'] || '').slice(0, 300)])
      .catch(err => req.log.error({ err }, 'не удалось записать auth_event')));

  app.setErrorHandler((err, req, reply) => {
    if (err.validation){
      const field = (err.validation[0]?.instancePath || '').split('/')[1] || err.validation[0]?.params?.missingProperty;
      return reply.code(400).send({ error: 'validation', field, message: FIELD_MESSAGES[field] || 'Проверьте введённые данные' });
    }
    if (err.statusCode === 429) return reply.code(429).send({ error: 'rate_limit', message: err.message });
    if (err.statusCode && err.statusCode < 500) return reply.code(err.statusCode).send({ error: 'bad_request', message: 'Некорректный запрос' });
    req.log.error({ err }, 'необработанная ошибка');
    return reply.code(500).send({ error: 'internal', message: 'Внутренняя ошибка сервера' });
  });

  app.get('/api/health', async () => {
    await pool.query('SELECT 1');
    return { ok: true };
  });
  await app.register(authRoutes, { prefix: '/api' });
  await app.register(accountRoutes, { prefix: '/api' });
  await app.register(progressRoutes, { prefix: '/api' });
  await app.register(friendsRoutes, { prefix: '/api' });
  return app;
}
