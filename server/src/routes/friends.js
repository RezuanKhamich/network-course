import { randomInt } from 'node:crypto';
import { tx } from '../db.js';
import { catalog } from '../stats.js';
import { isUniqueViolation } from './common.js';

// без похожих символов: 0/O, 1/I/L
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const newCode = () => Array.from({ length: 8 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join('');
const normCode = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const MAX_FRIENDS = 200, MAX_OUTGOING = 50;
const WEEK_START = `date_trunc('week', now() AT TIME ZONE 'Europe/Moscow') AT TIME ZONE 'Europe/Moscow'`;
const id = { type: 'object', required: ['id'], properties: { id: { type: 'integer', minimum: 1 } } };
const pair = (a, b) => (a < b ? [a, b] : [b, a]);

// Даты из базы приходят строками YYYY-MM-DD (день по Москве), чтобы часовой пояс Node их не сдвигал
const DAY = d => `to_char((${d} AT TIME ZONE 'Europe/Moscow')::date, 'YYYY-MM-DD')`;
const prevDay = s => new Date(Date.parse(s + 'T00:00:00Z') - 864e5).toISOString().slice(0, 10);

// Серия: дни подряд с прогрессом, считая от сегодня или вчера
function streakOf(days, today){
  const set = new Set(days);
  let d = set.has(today) ? today : prevDay(today), n = 0;
  while (set.has(d)){ n++; d = prevDay(d); }
  return n;
}

export default async function friendsRoutes(app){
  const { db, config } = app;
  const userLimit = (max, timeWindow) => ({ max, timeWindow, keyGenerator: req => req.cookies[config.cookieName] || req.ip });
  const me = async userId => (await db.query('SELECT id, nickname, avatar, friend_code, hide_from_rating, hide_activity FROM users WHERE id = $1', [userId])).rows[0];
  const friendIds = async userId => (await db.query(
    'SELECT user_b AS id FROM friendships WHERE user_a = $1 UNION ALL SELECT user_a FROM friendships WHERE user_b = $1', [userId]
  )).rows.map(r => Number(r.id));
  const areFriends = async (a, b) => (await db.query('SELECT 1 FROM friendships WHERE user_a = $1 AND user_b = $2', pair(a, b))).rowCount > 0;

  // Карточки пользователей: ник, аватар, уровень, XP за неделю и всего, серия, последняя активность
  async function cards(ids){
    if (!ids.length) return [];
    const { rows } = await db.query(
      `SELECT u.id, u.nickname, u.avatar, u.hide_from_rating, u.hide_activity,
              coalesce(s.level, 1) AS level, coalesce(s.xp_total, 0) AS xp_total, coalesce(s.courses, '{}') AS courses,
              coalesce((SELECT sum(xp) FROM progress_events e WHERE e.user_id = u.id AND e.counted AND e.at >= ${WEEK_START}), 0) AS xp_week,
              (SELECT max(at) FROM progress_events e WHERE e.user_id = u.id AND e.live) AS last_active,
              ARRAY(SELECT DISTINCT ${DAY('e.at')} FROM progress_events e
                    WHERE e.user_id = u.id AND e.live AND e.xp > 0 AND e.at > now() - interval '400 days') AS days,
              ${DAY('now()')} AS today
       FROM users u LEFT JOIN user_stats s ON s.user_id = u.id WHERE u.id = ANY($1)`, [ids]
    );
    return rows.map(r => ({
      id: Number(r.id), nickname: r.nickname, avatar: r.avatar || '🦉', level: r.level,
      xpTotal: r.xp_total, xpWeek: Number(r.xp_week), streak: streakOf(r.days, r.today), lastActiveAt: r.last_active,
      courses: r.courses, hideFromRating: r.hide_from_rating, hideActivity: r.hide_activity
    }));
  }

  // ---- профиль ----
  app.get('/profile', { preHandler: app.requireAuth }, async req => {
    let u = await me(req.user.id);
    if (!u.friend_code){
      // код создаётся при первом заходе; при совпадении с чужим просто пробуем ещё раз
      for (let i = 0; i < 5 && !u.friend_code; i++){
        try { u = (await db.query('UPDATE users SET friend_code = $2 WHERE id = $1 RETURNING id, nickname, avatar, friend_code, hide_from_rating, hide_activity', [req.user.id, newCode()])).rows[0]; }
        catch (e){ if (!isUniqueViolation(e)) throw e; }
      }
    }
    const incoming = (await db.query('SELECT count(*)::int AS n FROM friend_requests WHERE to_user = $1', [req.user.id])).rows[0].n;
    return { nickname: u.nickname, avatar: u.avatar || '🦉', friendCode: u.friend_code, hideFromRating: u.hide_from_rating, hideActivity: u.hide_activity, incomingRequests: incoming };
  });

  app.patch('/profile', {
    preHandler: app.requireAuth,
    config: { rateLimit: userLimit(30, '1 minute') },
    schema: { body: { type: 'object', additionalProperties: false, minProperties: 1, properties: {
      nickname: { type: 'string', pattern: '^[A-Za-z0-9_]{3,20}$' },
      hideFromRating: { type: 'boolean' },
      hideActivity: { type: 'boolean' }
    } } }
  }, async (req, reply) => {
    const b = req.body;
    try {
      await db.query(
        `UPDATE users SET nickname = coalesce($2, nickname), hide_from_rating = coalesce($3, hide_from_rating), hide_activity = coalesce($4, hide_activity) WHERE id = $1`,
        [req.user.id, b.nickname ?? null, b.hideFromRating ?? null, b.hideActivity ?? null]
      );
    } catch (e){
      if (isUniqueViolation(e)) return reply.code(409).send({ error: 'nickname_taken', field: 'nickname', message: 'Этот ник уже занят' });
      throw e;
    }
    return reply.code(204).send();
  });

  app.post('/profile/friend-code', { preHandler: app.requireAuth, config: { rateLimit: userLimit(10, '1 hour') } }, async req => {
    for (;;){
      try { return { friendCode: (await db.query('UPDATE users SET friend_code = $2 WHERE id = $1 RETURNING friend_code', [req.user.id, newCode()])).rows[0].friend_code }; }
      catch (e){ if (!isUniqueViolation(e)) throw e; }
    }
  });

  // ---- всё ниже требует ника: без него друзьям нечего показать вместо email ----
  const needNick = async (req, reply) => {
    const u = await me(req.user.id);
    if (!u.nickname) return reply.code(409).send({ error: 'nickname_required', message: 'Сначала придумайте ник' });
    req.me = u;
  };
  const auth = [app.requireAuth, needNick];

  app.get('/friends', { preHandler: auth }, async req => {
    const uid = req.user.id;
    const friends = await cards(await friendIds(uid));
    const reqs = async (sql) => (await db.query(sql, [uid])).rows.map(r => ({ id: Number(r.id), nickname: r.nickname, avatar: r.avatar || '🦉', createdAt: r.created_at }));
    return {
      friends: friends.map(({ hideFromRating, hideActivity, ...f }) => f).sort((a, b) => b.xpWeek - a.xpWeek || a.nickname.localeCompare(b.nickname)),
      incoming: await reqs('SELECT u.id, u.nickname, u.avatar, r.created_at FROM friend_requests r JOIN users u ON u.id = r.from_user WHERE r.to_user = $1 ORDER BY r.created_at DESC'),
      outgoing: await reqs('SELECT u.id, u.nickname, u.avatar, r.created_at FROM friend_requests r JOIN users u ON u.id = r.to_user WHERE r.from_user = $1 ORDER BY r.created_at DESC')
    };
  });

  app.post('/friends/requests', {
    preHandler: auth,
    config: { rateLimit: userLimit(20, '1 hour') },
    schema: { body: { type: 'object', required: ['code'], additionalProperties: false, properties: { code: { type: 'string', maxLength: 20 } } } }
  }, async (req, reply) => {
    const uid = req.user.id;
    const target = (await db.query('SELECT id, nickname, avatar FROM users WHERE friend_code = $1 AND nickname IS NOT NULL', [normCode(req.body.code)])).rows[0];
    if (!target) return reply.code(404).send({ error: 'code_not_found', field: 'code', message: 'Код не найден. Проверьте его или попросите друга прислать новый.' });
    const tid = Number(target.id);
    if (tid === uid) return reply.code(400).send({ error: 'own_code', field: 'code', message: 'Это ваш собственный код' });
    if (await areFriends(uid, tid)) return reply.code(409).send({ error: 'already_friends', message: `${target.nickname} уже у вас в друзьях` });
    const user = { id: tid, nickname: target.nickname, avatar: target.avatar || '🦉' };
    return tx(db, async c => {
      // встречная заявка уже есть — значит, оба хотят дружить
      if ((await c.query('DELETE FROM friend_requests WHERE from_user = $1 AND to_user = $2', [tid, uid])).rowCount){
        await c.query('INSERT INTO friendships (user_a, user_b) VALUES ($1, $2) ON CONFLICT DO NOTHING', pair(uid, tid));
        return { status: 'friends', user };
      }
      const counts = (await c.query(
        `SELECT (SELECT count(*) FROM friend_requests WHERE from_user = $1)::int AS outgoing,
                (SELECT count(*) FROM friendships WHERE user_a = $1 OR user_b = $1)::int AS friends`, [uid]
      )).rows[0];
      if (counts.friends >= MAX_FRIENDS) return reply.code(409).send({ error: 'too_many_friends', message: `Друзей может быть не больше ${MAX_FRIENDS}` });
      if (counts.outgoing >= MAX_OUTGOING) return reply.code(409).send({ error: 'too_many_requests', message: 'Слишком много неотвеченных заявок. Отмените старые.' });
      await c.query('INSERT INTO friend_requests (from_user, to_user) VALUES ($1, $2) ON CONFLICT DO NOTHING', [uid, tid]);
      return { status: 'requested', user };
    });
  });

  app.post('/friends/requests/:id/accept', { preHandler: auth, schema: { params: id } }, async (req, reply) => {
    const uid = req.user.id, from = req.params.id;
    const ok = await tx(db, async c => {
      if (!(await c.query('DELETE FROM friend_requests WHERE from_user = $1 AND to_user = $2', [from, uid])).rowCount) return false;
      await c.query('DELETE FROM friend_requests WHERE from_user = $1 AND to_user = $2', [uid, from]);
      await c.query('INSERT INTO friendships (user_a, user_b) VALUES ($1, $2) ON CONFLICT DO NOTHING', pair(uid, from));
      return true;
    });
    return ok ? reply.code(204).send() : reply.code(404).send({ error: 'not_found', message: 'Заявка не найдена' });
  });

  app.post('/friends/requests/:id/decline', { preHandler: auth, schema: { params: id } }, async (req, reply) => {
    await db.query('DELETE FROM friend_requests WHERE from_user = $1 AND to_user = $2', [req.params.id, req.user.id]);
    return reply.code(204).send();
  });

  app.delete('/friends/requests/:id', { preHandler: auth, schema: { params: id } }, async (req, reply) => {
    await db.query('DELETE FROM friend_requests WHERE from_user = $1 AND to_user = $2', [req.user.id, req.params.id]);
    return reply.code(204).send();
  });

  app.delete('/friends/:id', { preHandler: auth, schema: { params: id } }, async (req, reply) => {
    await db.query('DELETE FROM friendships WHERE user_a = $1 AND user_b = $2', pair(req.user.id, req.params.id));
    return reply.code(204).send();
  });

  app.get('/friends/rating', {
    preHandler: auth,
    schema: { querystring: { type: 'object', properties: { period: { type: 'string', enum: ['week', 'all'], default: 'week' } } } }
  }, async req => {
    const uid = req.user.id;
    const list = await cards([uid, ...await friendIds(uid)]);
    const key = req.query.period === 'all' ? 'xpTotal' : 'xpWeek';
    return {
      period: req.query.period,
      rows: list.filter(u => u.id === uid || !u.hideFromRating)
        .sort((a, b) => b[key] - a[key] || a.nickname.localeCompare(b.nickname))
        .map((u, i) => ({ place: i + 1, id: u.id, nickname: u.nickname, avatar: u.avatar, level: u.level, xp: u[key], streak: u.streak, me: u.id === uid, hidden: u.id === uid && u.hideFromRating }))
    };
  });

  // Лента: что друзья прошли за две недели. Уроки и самопроверка одного дня сворачиваются в одну запись.
  app.get('/friends/feed', { preHandler: auth }, async req => {
    const ids = await friendIds(req.user.id);
    if (!ids.length) return { items: [] };
    const { rows } = await db.query(
      `SELECT e.user_id, u.nickname, u.avatar, e.kind, e.course, e.ref, e.data, e.at, ${DAY('e.at')} AS day
       FROM progress_events e JOIN users u ON u.id = e.user_id
       WHERE e.user_id = ANY($1) AND e.live AND NOT u.hide_activity AND e.at > now() - interval '14 days'
       ORDER BY e.at DESC LIMIT 1000`, [ids]
    );
    const items = [], groups = new Map();
    const perfect = new Set(rows.filter(r => r.kind === 'perfect').map(r => `${r.user_id}:${r.course}:${r.ref}`));
    for (const r of rows){
      const user = { id: Number(r.user_id), nickname: r.nickname, avatar: r.avatar || '🦉' };
      if (r.kind === 'lesson' || r.kind === 'check'){
        const k = `${r.user_id}:${r.day}:${r.course}`;
        let g = groups.get(k);
        if (!g){ g = { type: 'study', user, course: r.course, lessons: 0, checks: 0, at: r.at }; groups.set(k, g); items.push(g); }
        g[r.kind === 'lesson' ? 'lessons' : 'checks']++;
      } else if (r.kind === 'test'){
        items.push({ type: 'test', user, course: r.course, module: catalog[r.course]?.modules[r.ref], score: r.data?.score, perfect: perfect.has(`${r.user_id}:${r.course}:${r.ref}`), at: r.at });
      } else if (r.kind === 'exam' || r.kind === 'journey' || r.kind === 'achievement'){
        items.push({ type: r.kind, user, course: r.course, achievement: r.kind === 'achievement' ? r.ref : undefined, score: r.data?.score, at: r.at });
      }
    }
    return { items: items.slice(0, 60) };
  });

  // Профиль друга для сравнения: курсы, достижения, карта активности за год
  app.get('/friends/:id', { preHandler: auth, schema: { params: id } }, async (req, reply) => {
    const fid = req.params.id;
    if (!(await areFriends(req.user.id, fid))) return reply.code(404).send({ error: 'not_found', message: 'Такого друга нет' });
    const [card] = await cards([fid]);
    const stats = (await db.query('SELECT achievements FROM user_stats WHERE user_id = $1', [fid])).rows[0];
    const days = (await db.query(
      `SELECT ${DAY('at')} AS day, sum(xp)::int AS xp FROM progress_events
       WHERE user_id = $1 AND live AND at > now() - interval '371 days' GROUP BY 1`, [fid]
    )).rows;
    const { hideFromRating, hideActivity, ...pub } = card;
    return { ...pub, achievements: stats ? stats.achievements : [], days: Object.fromEntries(days.map(d => [d.day, d.xp])) };
  });
}
