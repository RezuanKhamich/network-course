import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { setup, client, registerAndVerify } from './helpers.js';

let env;
beforeEach(async () => { env = await setup(); });
afterEach(async () => { await env.close(); });

const state = lessons => ({ app: 'dev-courses', version: 2, courses: { network: { lessons } } });

test('первая запись, чтение и рост версии', async () => {
  const c = await registerAndVerify(env);
  assert.deepEqual((await c.get('/api/progress')).json(), { data: null, version: 0, updatedAt: null });
  const w1 = await c.put('/api/progress', { data: state({ '0-1': { completed: true } }), baseVersion: 0 });
  assert.equal(w1.statusCode, 200);
  assert.equal(w1.json().version, 1);
  const w2 = await c.put('/api/progress', { data: state({ '0-1': { completed: true }, '0-2': { completed: true } }), baseVersion: 1 });
  assert.equal(w2.json().version, 2);
  const r = (await c.get('/api/progress')).json();
  assert.equal(r.version, 2);
  assert.deepEqual(Object.keys(r.data.courses.network.lessons), ['0-1', '0-2']);
});

test('устаревшая версия — 409 с данными сервера', async () => {
  const laptop = await registerAndVerify(env);
  await laptop.put('/api/progress', { data: state({ '0-1': { completed: true } }), baseVersion: 0 });
  const phone = laptop; // та же учётка, клиент ещё не видел запись ноутбука
  const r = await phone.put('/api/progress', { data: state({ '5-1': { completed: true } }), baseVersion: 0 });
  assert.equal(r.statusCode, 409);
  assert.equal(r.json().version, 1);
  assert.ok(r.json().data.courses.network.lessons['0-1']);
});

test('прогресс одного пользователя не виден другому', async () => {
  const a = await registerAndVerify(env, 'a@example.com');
  const b = await registerAndVerify(env, 'b@example.com');
  await a.put('/api/progress', { data: state({ '0-1': { completed: true } }), baseVersion: 0 });
  assert.deepEqual((await b.get('/api/progress')).json().data, null);
});

test('чужой формат данных отклоняется', async () => {
  const c = await registerAndVerify(env);
  for (const data of [{ app: 'other', version: 2 }, { app: 'dev-courses', version: 1 }, 'string']){
    assert.equal((await c.put('/api/progress', { data, baseVersion: 0 })).statusCode, 400);
  }
  assert.equal((await c.put('/api/progress', { data: state({}) })).statusCode, 400, 'без baseVersion');
});
