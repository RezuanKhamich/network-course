import { buildApp } from '../src/app.js';
import { createPool } from '../src/db.js';
import { loadConfig } from '../src/config.js';
import { migrate } from '../src/migrate.js';
import { resetMailThrottle } from '../src/routes/common.js';

export const ORIGIN = 'http://localhost:5173';
export const PASSWORD = 'correct horse battery';

export async function setup({ pwned = async () => false, env = {} } = {}){
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error('Для тестов нужен TEST_DATABASE_URL (см. .env.example)');
  const pool = createPool(url);
  await migrate(pool, () => {});
  await pool.query('TRUNCATE users, sessions, email_tokens, progress, auth_events RESTART IDENTITY CASCADE');
  resetMailThrottle();
  const mails = [];
  const config = loadConfig({ DATABASE_URL: url, APP_ORIGIN: ORIGIN, ...env });
  const app = await buildApp({ config, pool, mailer: { send: async m => { mails.push(m); } }, pwned, logger: false });
  const close = async () => { await app.close(); await pool.end(); };
  return { app, pool, mails, config, close };
}

// Мини-браузер: хранит cookie сессии между запросами и шлёт Origin, как это делает настоящий браузер
export function client(app){
  let sid = null;
  const call = async (method, url, payload, headers = {}) => {
    const res = await app.inject({
      method, url, payload,
      headers: { origin: ORIGIN, ...(sid ? { cookie: 'sid=' + sid } : {}), ...headers }
    });
    const c = res.cookies.find(x => x.name === 'sid');
    if (c) sid = c.value && !(c.expires && c.expires < new Date()) ? c.value : null;
    return res;
  };
  return {
    get: url => call('GET', url),
    post: (url, body, headers) => call('POST', url, body, headers),
    put: (url, body) => call('PUT', url, body),
    patch: (url, body) => call('PATCH', url, body),
    del: (url, body) => call('DELETE', url, body),
    get sid(){ return sid; },
    set sid(v){ sid = v; }
  };
}

export const tokenFrom = (mail, kind) => {
  const m = mail.text.match(new RegExp(`#/auth/${kind}/([A-Za-z0-9_-]{43})`));
  if (!m) throw new Error('в письме нет ссылки ' + kind);
  return m[1];
};

export async function registerAndVerify(env, email = 'user@example.com', password = PASSWORD){
  const c = client(env.app);
  await c.post('/api/auth/register', { email, password, consent: true });
  const mail = env.mails.findLast(m => m.to === email.toLowerCase());
  const res = await c.post('/api/auth/verify', { token: tokenFrom(mail, 'verify') });
  if (res.statusCode !== 200) throw new Error('verify: ' + res.body);
  return c;
}
