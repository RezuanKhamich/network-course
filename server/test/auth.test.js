import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { setup, client, tokenFrom, registerAndVerify, PASSWORD } from './helpers.js';

let env;
beforeEach(async () => { env = await setup(); });
afterEach(async () => { await env.close(); });

test('регистрация: письмо, подтверждение, вход в аккаунт и флаги cookie', async () => {
  const c = client(env.app);
  const r = await c.post('/api/auth/register', { email: '  User@Example.com ', password: PASSWORD, consent: true });
  assert.equal(r.statusCode, 400, 'пробелы вокруг email отсекает схема, клиент обрезает их сам');

  const ok = await c.post('/api/auth/register', { email: 'User@Example.com', password: PASSWORD, consent: true });
  assert.equal(ok.statusCode, 202);
  assert.equal(c.sid, null, 'до подтверждения сессии нет');
  assert.equal((await env.pool.query('SELECT count(*)::int n FROM users')).rows[0].n, 0, 'пользователь создаётся только после подтверждения');

  const mail = env.mails.at(-1);
  assert.equal(mail.to, 'user@example.com');
  const v = await c.post('/api/auth/verify', { token: tokenFrom(mail, 'verify') });
  assert.equal(v.statusCode, 200);
  assert.equal(v.json().user.email, 'user@example.com');
  const cookie = v.cookies.find(x => x.name === 'sid');
  assert.ok(cookie.httpOnly);
  assert.equal(cookie.sameSite, 'Lax');
  assert.equal(cookie.path, '/');

  const me = await c.get('/api/me');
  assert.equal(me.statusCode, 200);
  assert.equal(me.json().user.email, 'user@example.com');
  const u = (await env.pool.query('SELECT password_hash, privacy_consent_at FROM users')).rows[0];
  assert.match(u.password_hash, /^\$argon2id\$/);
  assert.ok(u.privacy_consent_at);
});

test('регистрация требует согласия и нормального пароля', async () => {
  const c = client(env.app);
  const noConsent = await c.post('/api/auth/register', { email: 'a@example.com', password: PASSWORD, consent: false });
  assert.equal(noConsent.statusCode, 400);
  assert.equal(noConsent.json().field, 'consent');
  const short = await c.post('/api/auth/register', { email: 'a@example.com', password: 'short', consent: true });
  assert.equal(short.statusCode, 400);
  assert.equal(short.json().field, 'password');
  assert.equal(env.mails.length, 0);
});

test('пароль из утечек отклоняется', async () => {
  await env.close();
  env = await setup({ pwned: async () => true });
  const r = await client(env.app).post('/api/auth/register', { email: 'a@example.com', password: PASSWORD, consent: true });
  assert.equal(r.statusCode, 400);
  assert.equal(r.json().error, 'pwned_password');
});

test('ссылка подтверждения одноразовая; повторная регистрация не выдаёт, что адрес занят', async () => {
  const c = client(env.app);
  await c.post('/api/auth/register', { email: 'a@example.com', password: PASSWORD, consent: true });
  const token = tokenFrom(env.mails.at(-1), 'verify');
  assert.equal((await c.post('/api/auth/verify', { token })).statusCode, 200);
  assert.equal((await client(env.app).post('/api/auth/verify', { token })).statusCode, 400);

  const again = await client(env.app).post('/api/auth/register', { email: 'a@example.com', password: 'other password 123', consent: true });
  assert.equal(again.statusCode, 202, 'ответ такой же, как для нового адреса');
  assert.match(env.mails.at(-1).subject, /повторной регистрации/);
  assert.doesNotMatch(env.mails.at(-1).text, /#\/auth\/verify\//);
});

test('чужая незавершённая регистрация не перехватывает аккаунт', async () => {
  const attacker = client(env.app);
  await attacker.post('/api/auth/register', { email: 'victim@example.com', password: 'attacker password', consent: true });
  const victim = client(env.app);
  await victim.post('/api/auth/register', { email: 'victim@example.com', password: PASSWORD, consent: true });
  const victimMail = env.mails.at(-1);
  assert.equal((await victim.post('/api/auth/verify', { token: tokenFrom(victimMail, 'verify') })).statusCode, 200);
  const stale = await attacker.post('/api/auth/verify', { token: tokenFrom(env.mails[0], 'verify') });
  assert.equal(stale.statusCode, 400, 'после подтверждения остальные ссылки на этот адрес гаснут');
  const login = await client(env.app).post('/api/auth/login', { email: 'victim@example.com', password: 'attacker password' });
  assert.equal(login.statusCode, 401);
});

test('просроченная ссылка не работает', async () => {
  const c = client(env.app);
  await c.post('/api/auth/register', { email: 'a@example.com', password: PASSWORD, consent: true });
  await env.pool.query(`UPDATE email_tokens SET expires_at = now() - interval '1 minute'`);
  assert.equal((await c.post('/api/auth/verify', { token: tokenFrom(env.mails.at(-1), 'verify') })).statusCode, 400);
});

test('вход: одинаковый ответ для неверного пароля и неизвестного адреса', async () => {
  await registerAndVerify(env, 'a@example.com');
  const wrong = await client(env.app).post('/api/auth/login', { email: 'a@example.com', password: 'wrong password' });
  const unknown = await client(env.app).post('/api/auth/login', { email: 'nobody@example.com', password: 'wrong password' });
  assert.equal(wrong.statusCode, 401);
  assert.deepEqual(wrong.json(), unknown.json());

  const c = client(env.app);
  const ok = await c.post('/api/auth/login', { email: 'A@Example.com', password: PASSWORD });
  assert.equal(ok.statusCode, 200);
  assert.equal((await c.get('/api/me')).statusCode, 200);
  const events = (await env.pool.query('SELECT type FROM auth_events ORDER BY id')).rows.map(r => r.type);
  assert.deepEqual(events, ['register', 'login_failed', 'login_failed', 'login']);
});

test('выход завершает сессию на сервере', async () => {
  const c = await registerAndVerify(env);
  const sid = c.sid;
  assert.equal((await c.post('/api/auth/logout')).statusCode, 204);
  assert.equal(c.sid, null);
  c.sid = sid;
  assert.equal((await c.get('/api/me')).statusCode, 401, 'старая cookie больше не действует');
});

test('перебор пароля упирается в лимит', async () => {
  await registerAndVerify(env, 'a@example.com');
  const c = client(env.app);
  const codes = [];
  for (let i = 0; i < 11; i++) codes.push((await c.post('/api/auth/login', { email: 'a@example.com', password: 'guess ' + i })).statusCode);
  assert.deepEqual(codes.slice(0, 10), Array(10).fill(401));
  assert.equal(codes[10], 429);
});

test('восстановление пароля завершает все старые сессии', async () => {
  const old = await registerAndVerify(env, 'a@example.com');
  const anon = client(env.app);
  assert.equal((await anon.post('/api/auth/forgot', { email: 'nobody@example.com' })).statusCode, 202);
  const before = env.mails.length;
  assert.equal((await anon.post('/api/auth/forgot', { email: 'a@example.com' })).statusCode, 202);
  assert.equal(env.mails.length, before + 1, 'письмо уходит только существующему пользователю');

  const token = tokenFrom(env.mails.at(-1), 'reset');
  const r = await anon.post('/api/auth/reset', { token, password: 'brand new password' });
  assert.equal(r.statusCode, 200);
  assert.ok(anon.sid, 'после сброса пользователь сразу вошёл');
  assert.match(env.mails.at(-1).subject, /Пароль изменён/);
  assert.equal((await old.get('/api/me')).statusCode, 401);
  assert.equal((await client(env.app).post('/api/auth/reset', { token, password: 'another password 1' })).statusCode, 400);
  assert.equal((await client(env.app).post('/api/auth/login', { email: 'a@example.com', password: PASSWORD })).statusCode, 401);
  assert.equal((await client(env.app).post('/api/auth/login', { email: 'a@example.com', password: 'brand new password' })).statusCode, 200);
});

test('не больше трёх писем на адрес в час', async () => {
  await registerAndVerify(env, 'a@example.com');
  const before = env.mails.length;
  for (let i = 0; i < 5; i++) await client(env.app).post('/api/auth/forgot', { email: 'a@example.com' });
  assert.equal(env.mails.length - before, 2, 'одно письмо уже ушло при регистрации');
});

test('смена пароля: нужен текущий, остальные сессии завершаются', async () => {
  const a = await registerAndVerify(env, 'a@example.com');
  const b = client(env.app);
  await b.post('/api/auth/login', { email: 'a@example.com', password: PASSWORD });
  const bad = await a.post('/api/auth/password', { currentPassword: 'wrong', newPassword: 'brand new password' });
  assert.equal(bad.statusCode, 400);
  assert.equal(bad.json().field, 'currentPassword');
  assert.equal((await a.post('/api/auth/password', { currentPassword: PASSWORD, newPassword: 'brand new password' })).statusCode, 204);
  assert.equal((await a.get('/api/me')).statusCode, 200, 'текущая сессия остаётся');
  assert.equal((await b.get('/api/me')).statusCode, 401, 'другое устройство разлогинено');
});

test('удаление аккаунта удаляет данные и сессию', async () => {
  const c = await registerAndVerify(env, 'a@example.com');
  await c.put('/api/progress', { data: { app: 'dev-courses', version: 2 }, baseVersion: 0 });
  assert.equal((await c.del('/api/me', { password: 'wrong' })).statusCode, 400);
  assert.equal((await c.del('/api/me', { password: PASSWORD })).statusCode, 204);
  assert.equal(c.sid, null);
  const counts = (await env.pool.query('SELECT (SELECT count(*) FROM users)::int u, (SELECT count(*) FROM progress)::int p, (SELECT count(*) FROM sessions)::int s')).rows[0];
  assert.deepEqual(counts, { u: 0, p: 0, s: 0 });
});

test('CSRF: запрос со страницы чужого сайта отклоняется', async () => {
  const c = await registerAndVerify(env);
  const r = await c.post('/api/auth/logout', undefined, { origin: 'https://evil.example' });
  assert.equal(r.statusCode, 403);
  assert.equal((await c.get('/api/me')).statusCode, 200, 'сессия не тронута');
  const form = await c.post('/api/auth/login', 'email=a&password=b', { 'content-type': 'application/x-www-form-urlencoded' });
  assert.equal(form.statusCode, 415, 'формы не принимаются, только JSON');
});

test('без сессии закрытые маршруты отвечают 401, ответы не кешируются', async () => {
  const c = client(env.app);
  for (const url of ['/api/me', '/api/progress']){
    const r = await c.get(url);
    assert.equal(r.statusCode, 401);
    assert.equal(r.headers['cache-control'], 'no-store');
  }
  c.sid = 'forged-session-token';
  assert.equal((await c.get('/api/me')).statusCode, 401);
});
