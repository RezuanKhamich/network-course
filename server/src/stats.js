// Серверный пересчёт прогресса для друзей и рейтинга.
// Клиент присылает весь прогресс целиком, поэтому верить его XP нельзя: здесь XP считается заново
// и только за то, что есть в каталоге курсов (catalog.json генерирует web/scripts/build-catalog.js).
import { readFileSync } from 'node:fs';

const raw = JSON.parse(readFileSync(new URL('./catalog.json', import.meta.url), 'utf8'));
export const catalog = Object.fromEntries(Object.entries(raw.courses).map(([id, c]) => [id, { ...c, checks: new Set(c.checks) }]));

// те же правила, что web/assets/js/game.js, но без XP за дневные цели и достижения — их не проверить
export const RATING_XP = { lesson: 20, check: 5, test: 100, perfect: 50, exam: 300, examPerfect: 150, journey: 30 };
// больше этого за день в недельный зачёт не идёт: столько честно не набрать
export const DAILY_CAP = 1500;
const PASS = 70;

// те же аватары, что в web/assets/js/game.js: в чужом профиле не должно быть произвольного текста
const AVATARS = new Set(['🦉','🦊','🐱','🐼','🐧','🦄','🐙','🐢','🐝','🦖','👾','🤖','🐸','🧙','🦁','🚀']);
const score = v => (Number.isInteger(v) && v >= 0 && v <= 100 ? v : 0);
const xpForLevel = L => 100 * (L - 1) + 25 * (L - 1) * (L - 2);
export function levelFromXP(xp){ let L = 1; while (xp >= xpForLevel(L + 1)) L++; return L; }

// Проверенные элементы прогресса: ключ → { kind, course, ref, xp, data }
export function ratingItems(data){
  const items = new Map();
  const put = (key, v) => items.set(key, v);
  for (const [cid, c] of Object.entries(data?.courses || {})){
    const cat = catalog[cid];
    if (!cat || !c || typeof c !== 'object') continue;
    for (const [lid, l] of Object.entries(c.lessons || {})){
      if (l && l.completed === true && cat.lessons[lid] !== undefined) put(`${cid}:l:${lid}`, { kind: 'lesson', course: cid, ref: lid, xp: RATING_XP.lesson });
    }
    for (const qid of Object.keys(c.checks || {})){
      if (cat.checks.has(qid)) put(`${cid}:c:${qid}`, { kind: 'check', course: cid, ref: qid, xp: RATING_XP.check });
    }
    for (const [tid, t] of Object.entries(c.tests || {})){
      const mid = tid.startsWith('m') ? tid.slice(1) : null;
      if (mid === null || cat.modules[mid] === undefined) continue;
      const s = score(t?.bestScore);
      if (s >= PASS) put(`${cid}:t:${tid}`, { kind: 'test', course: cid, ref: mid, xp: RATING_XP.test, data: { score: s } });
      if (s === 100) put(`${cid}:tp:${tid}`, { kind: 'perfect', course: cid, ref: mid, xp: RATING_XP.perfect });
    }
    const exam = score(c.finalExam?.bestScore);
    if (exam >= PASS) put(`${cid}:exam`, { kind: 'exam', course: cid, xp: RATING_XP.exam, data: { score: exam } });
    if (exam === 100) put(`${cid}:examp`, { kind: 'examPerfect', course: cid, xp: RATING_XP.examPerfect });
    if (data?.game?.flags?.[cid + ':journey'] === true) put(`${cid}:journey`, { kind: 'journey', course: cid, xp: RATING_XP.journey });
  }
  for (const id of Object.keys(data?.game?.achievements || {}).slice(0, 200)){
    if (/^[a-z0-9-]{1,40}$/.test(id)) put('ach:' + id, { kind: 'achievement', ref: id, xp: 0 });
  }
  return items;
}

export function summarize(items, data){
  const courses = {};
  for (const [cid, cat] of Object.entries(catalog)){
    courses[cid] = { lessons: 0, lessonsTotal: Object.keys(cat.lessons).length, tests: 0, modulesTotal: Object.keys(cat.modules).length, exam: 0 };
  }
  let xp = 0;
  const achievements = [];
  for (const it of items.values()){
    xp += it.xp;
    if (it.kind === 'lesson') courses[it.course].lessons++;
    else if (it.kind === 'test') courses[it.course].tests++;
    else if (it.kind === 'exam') courses[it.course].exam = it.data.score;
    else if (it.kind === 'achievement') achievements.push(it.ref);
  }
  // уровень показывается как у самого пользователя — по его XP вместе с наградами; на рейтинг не влияет
  const claimed = Object.values(data?.game?.awarded || {}).reduce((a, v) => a + (Number.isFinite(v?.xp) ? Math.max(0, v.xp) : 0), 0);
  return { xpTotal: xp, level: levelFromXP(Math.min(claimed, xp * 3 + 2000)), courses, achievements };
}

// Записывает новые элементы прогресса и обновляет сводку. Вызывается в транзакции сохранения прогресса.
// firstSync — у пользователя ещё не было сохранённого прогресса (например, при входе пришёл гостевой).
export async function recordProgress(c, userId, data, firstSync){
  const items = ratingItems(data);
  const known = new Set((await c.query('SELECT item FROM progress_events WHERE user_id = $1', [userId])).rows.map(r => r.item));
  // прогресс первой синхронизации набран неизвестно когда — только в общий зачёт, не в неделю
  const live = !firstSync;
  let today = Number((await c.query(
    `SELECT coalesce(sum(xp), 0) AS xp FROM progress_events
     WHERE user_id = $1 AND counted AND at >= date_trunc('day', now() AT TIME ZONE 'Europe/Moscow') AT TIME ZONE 'Europe/Moscow'`, [userId]
  )).rows[0].xp);
  const rows = [];
  for (const [item, it] of items){
    if (known.has(item)) continue;
    const counted = live && today + it.xp <= DAILY_CAP;
    if (counted) today += it.xp;
    rows.push([item, it.kind, it.course || null, it.ref || null, it.xp, it.data ? JSON.stringify(it.data) : null, live, counted]);
  }
  if (rows.length){
    const params = [], values = [];
    rows.forEach((r, i) => {
      values.push(`($1, $${i * 8 + 2}, $${i * 8 + 3}, $${i * 8 + 4}, $${i * 8 + 5}, $${i * 8 + 6}, $${i * 8 + 7}, $${i * 8 + 8}, $${i * 8 + 9})`);
      params.push(...r);
    });
    await c.query(`INSERT INTO progress_events (user_id, item, kind, course, ref, xp, data, live, counted) VALUES ${values.join(', ')} ON CONFLICT DO NOTHING`, [userId, ...params]);
  }
  const s = summarize(items, data);
  await c.query(
    `INSERT INTO user_stats (user_id, xp_total, level, courses, achievements, updated_at) VALUES ($1, $2, $3, $4, $5, now())
     ON CONFLICT (user_id) DO UPDATE SET xp_total = $2, level = $3, courses = $4, achievements = $5, updated_at = now()`,
    [userId, s.xpTotal, s.level, JSON.stringify(s.courses), JSON.stringify(s.achievements)]
  );
  const avatar = data?.profile?.avatar;
  if (AVATARS.has(avatar)) await c.query('UPDATE users SET avatar = $2 WHERE id = $1', [userId, avatar]);
}
