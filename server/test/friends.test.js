import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { setup, registerAndVerify } from './helpers.js';
import { DAILY_CAP, RATING_XP } from '../src/stats.js';

let env;
beforeEach(async () => { env = await setup(); });
afterEach(async () => { await env.close(); });

// пользователь с ником и кодом дружбы
async function person(nick){
  const c = await registerAndVerify(env, nick.toLowerCase() + '@example.com');
  assert.equal((await c.patch('/api/profile', { nickname: nick })).statusCode, 204);
  c.code = (await c.get('/api/profile')).json().friendCode;
  c.version = 0;
  c.save = async data => {
    const r = await c.put('/api/progress', { data: { app: 'dev-courses', version: 2, ...data }, baseVersion: c.version });
    assert.equal(r.statusCode, 200, r.body);
    c.version = r.json().version;
  };
  return c;
}
async function befriend(a, b){
  assert.equal((await a.post('/api/friends/requests', { code: b.code })).json().status, 'requested');
  const from = (await b.get('/api/friends')).json().incoming[0].id;
  assert.equal((await b.post(`/api/friends/requests/${from}/accept`)).statusCode, 204);
}
const lessons = (...ids) => ({ courses: { network: { lessons: Object.fromEntries(ids.map(id => [id, { completed: true }])) } } });

test('ник обязателен и уникален, код дружбы выдаётся и перевыпускается', async () => {
  const c = await registerAndVerify(env, 'a@example.com');
  assert.equal((await c.get('/api/friends')).json().error, 'nickname_required');
  assert.equal((await c.patch('/api/profile', { nickname: 'Аня' })).statusCode, 400, 'только латиница');
  assert.equal((await c.patch('/api/profile', { nickname: 'anya_01' })).statusCode, 204);
  const b = await registerAndVerify(env, 'b@example.com');
  const taken = await b.patch('/api/profile', { nickname: 'ANYA_01' });
  assert.equal(taken.statusCode, 409, 'регистр не важен');
  const p = (await c.get('/api/profile')).json();
  assert.match(p.friendCode, /^[A-HJKMNP-Z2-9]{8}$/);
  assert.equal((await c.get('/api/profile')).json().friendCode, p.friendCode, 'код постоянный');
  const fresh = (await c.post('/api/profile/friend-code')).json().friendCode;
  assert.notEqual(fresh, p.friendCode);
});

test('заявка по коду, подтверждение, удаление из друзей', async () => {
  const anya = await person('anya'), boris = await person('boris');
  const r = await anya.post('/api/friends/requests', { code: boris.code.toLowerCase().replace(/(.{4})/, '$1-') });
  assert.equal(r.json().status, 'requested', 'код принимается в любом регистре и с дефисом');
  assert.equal(r.json().user.nickname, 'boris');
  assert.equal((await anya.get('/api/friends')).json().outgoing.length, 1);
  assert.equal((await boris.get('/api/profile')).json().incomingRequests, 1);

  const inc = (await boris.get('/api/friends')).json().incoming;
  assert.deepEqual(inc.map(x => x.nickname), ['anya']);
  assert.equal(JSON.stringify(inc).includes('@'), false, 'email не виден');
  assert.equal((await boris.post(`/api/friends/requests/${inc[0].id}/accept`)).statusCode, 204);
  assert.deepEqual((await anya.get('/api/friends')).json().friends.map(f => f.nickname), ['boris']);
  assert.equal((await anya.post('/api/friends/requests', { code: boris.code })).statusCode, 409, 'уже друзья');

  assert.equal((await anya.del(`/api/friends/${inc[0].id === 1 ? 2 : 1}`)).statusCode, 204);
  assert.deepEqual((await boris.get('/api/friends')).json().friends, []);
});

test('встречные заявки превращаются в дружбу; отклонение и отмена', async () => {
  const a = await person('alpha'), b = await person('bravo'), c = await person('charlie');
  await a.post('/api/friends/requests', { code: b.code });
  assert.equal((await b.post('/api/friends/requests', { code: a.code })).json().status, 'friends');
  assert.equal((await a.get('/api/friends')).json().friends.length, 1);

  await c.post('/api/friends/requests', { code: a.code });
  const cid = (await a.get('/api/friends')).json().incoming[0].id;
  assert.equal((await a.post(`/api/friends/requests/${cid}/decline`)).statusCode, 204);
  assert.deepEqual((await c.get('/api/friends')).json().outgoing, [], 'отклонённая заявка исчезает');

  await c.post('/api/friends/requests', { code: b.code });
  const bid = (await c.get('/api/friends')).json().outgoing[0].id;
  await c.del(`/api/friends/requests/${bid}`);
  assert.deepEqual((await b.get('/api/friends')).json().incoming, [], 'отменённая заявка исчезает');
});

test('нельзя добавить себя и несуществующий код; чужой профиль закрыт', async () => {
  const a = await person('alpha'), b = await person('bravo');
  assert.equal((await a.post('/api/friends/requests', { code: a.code })).json().error, 'own_code');
  assert.equal((await a.post('/api/friends/requests', { code: 'ZZZZZZZZ' })).statusCode, 404);
  const bid = (await a.post('/api/friends/requests', { code: b.code })).json().user.id;
  assert.equal((await a.get(`/api/friends/${bid}`)).statusCode, 404, 'пока не друзья — профиль не виден');
});

test('XP рейтинга считает сервер: выдуманные уроки и тесты не засчитываются', async () => {
  const a = await person('alpha');
  await a.save({});
  await a.save({ courses: {
    network: { lessons: { '0-1': { completed: true }, 'fake-1': { completed: true } }, checks: { 'q0-1a': 'x', 'q-fake': 'x' },
      tests: { m0: { bestScore: 100 }, m999: { bestScore: 100 }, m1: { bestScore: 50 } }, finalExam: null },
    hacked: { lessons: { '0-1': { completed: true } } }
  }, game: { awarded: { x: { xp: 999999 } } } });
  const me = (await a.get('/api/friends/rating?period=all')).json().rows[0];
  const expected = RATING_XP.lesson + RATING_XP.check + RATING_XP.test + RATING_XP.perfect;
  assert.equal(me.xp, expected);
  assert.ok(me.level < 10, 'заявленный клиентом XP не раздувает уровень');
});

test('прогресс первой синхронизации идёт в общий зачёт, но не в неделю', async () => {
  const a = await person('alpha');
  await a.save(lessons('0-1', '0-2', '0-3'));
  const rate = async p => (await a.get('/api/friends/rating?period=' + p)).json().rows[0].xp;
  assert.equal(await rate('all'), 60);
  assert.equal(await rate('week'), 0);
  await a.save(lessons('0-1', '0-2', '0-3', '0-4'));
  assert.equal(await rate('week'), 20, 'новый урок после первой синхронизации — в неделю');
});

test('дневной лимит недельного XP', async () => {
  const a = await person('alpha');
  await a.save({});
  const { catalog } = await import('../src/stats.js');
  const courses = {}; let total = 0;
  for (const [cid, c] of Object.entries(catalog)){
    courses[cid] = { lessons: Object.fromEntries(Object.keys(c.lessons).map(id => [id, { completed: true }])) };
    total += Object.keys(c.lessons).length * RATING_XP.lesson;
  }
  assert.ok(total > DAILY_CAP);
  await a.save({ courses });
  const week = (await a.get('/api/friends/rating?period=week')).json().rows[0].xp;
  assert.ok(week <= DAILY_CAP && week > DAILY_CAP - RATING_XP.lesson, `неделя: ${week}`);
  assert.equal((await a.get('/api/friends/rating?period=all')).json().rows[0].xp, total, 'в общий зачёт идёт всё');
});

test('рейтинг и лента среди друзей, настройки приватности', async () => {
  const a = await person('alpha'), b = await person('bravo'), stranger = await person('xray');
  await befriend(a, b);
  for (const p of [a, b, stranger]) await p.save({});
  await b.save({ ...lessons('0-1', '0-2'), courses: { network: { lessons: { '0-1': { completed: true }, '0-2': { completed: true } }, tests: { m0: { bestScore: 100 } } } } });
  await stranger.save(lessons('0-1'));

  const rating = (await a.get('/api/friends/rating?period=week')).json().rows;
  assert.deepEqual(rating.map(r => [r.nickname, r.xp, r.me]), [['bravo', 190, false], ['alpha', 0, true]], 'чужие не попадают');

  const feed = (await a.get('/api/friends/feed')).json().items;
  const study = feed.find(i => i.type === 'study'), testItem = feed.find(i => i.type === 'test');
  assert.equal(study.lessons, 2, 'уроки дня свёрнуты в одну запись');
  assert.equal(testItem.module, 'Общая картина');
  assert.equal(testItem.perfect, true);

  const friend = (await a.get('/api/friends')).json().friends[0];
  assert.equal(friend.xpWeek, 190);
  assert.equal(friend.streak, 1);
  assert.equal(friend.courses.network.lessons, 2);
  const profile = (await a.get(`/api/friends/${friend.id}`)).json();
  assert.equal(Object.values(profile.days)[0], 190);

  await b.patch('/api/profile', { hideFromRating: true, hideActivity: true });
  assert.deepEqual((await a.get('/api/friends/rating?period=week')).json().rows.map(r => r.nickname), ['alpha']);
  assert.deepEqual((await a.get('/api/friends/feed')).json().items, []);
  const own = (await b.get('/api/friends/rating?period=week')).json().rows.find(r => r.me);
  assert.equal(own.hidden, true, 'скрытый видит себя с пометкой');
});

test('аватар принимается только из списка', async () => {
  const a = await person('alpha'), b = await person('bravo');
  await befriend(a, b);
  await b.save({ profile: { avatar: '🦊' } });
  assert.equal((await a.get('/api/friends')).json().friends[0].avatar, '🦊');
  await b.save({ profile: { avatar: 'ADMIN' } });
  assert.equal((await a.get('/api/friends')).json().friends[0].avatar, '🦊', 'произвольный текст игнорируется');
});

test('удаление аккаунта убирает человека у друзей', async () => {
  const a = await person('alpha'), b = await person('bravo');
  await befriend(a, b);
  const { PASSWORD } = await import('./helpers.js');
  assert.equal((await b.del('/api/me', { password: PASSWORD })).statusCode, 204);
  assert.deepEqual((await a.get('/api/friends')).json().friends, []);
});
