// ====== ПОВТОРЕНИЕ С ИНТЕРВАЛАМИ ======
// Вопрос, на который ответили неверно (в тесте, экзамене, самопроверке или повторении), попадает в колоду
// и возвращается через 1 день. Верный ответ переносит его в следующую коробку: 3, 7, 21 день, затем «усвоено».
// Верные ответы при повторении дают XP (до DAILY_ANSWERS в день), а недельная цель — бонус.
// Состояние: Store.state.review = { items: { 'курс/вопрос': { box, due, at } }, log: { 'YYYY-MM-DD': ['курс/вопрос', …] } }
import { Store, dayKey } from './storage.js';

export const INTERVALS = [1, 3, 7, 21];
export const BOXES = ['1 день', '3 дня', '7 дней', '21 день'];
export const REVIEW_XP = { answer: 3, dailyAnswers: 10, weekGoal: 15, weekBonus: 50 };
const LOG_DAYS = 28;

export const addDays = (day, n) => { const d = new Date(day + 'T12:00:00'); d.setDate(d.getDate() + n); return dayKey(d); };
// неделя с понедельника: ключ — дата понедельника
export function weekKey(day){ const d = new Date(day + 'T12:00:00'); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return dayKey(d); }

export const review = () => {
  if (!Store.state.review) Store.state.review = { items: {}, log: {} };
  return Store.state.review;
};

// Итог ответа на вопрос. counts — засчитывать ли верный ответ как повторение (сессия повторения),
// иначе засчитывается, только если вопрос был в колоде.
export function recordAnswer(courseId, qid, ok, counts = false){
  const r = review(), key = courseId + '/' + qid, today = dayKey(), it = r.items[key];
  const at = new Date().toISOString();
  if (!ok){ r.items[key] = { box: 0, due: addDays(today, INTERVALS[0]), at }; return; }
  if (it){
    const box = it.box + 1;
    if (box >= INTERVALS.length) delete r.items[key];
    else r.items[key] = { box, due: addDays(today, INTERVALS[box]), at };
  }
  if (it || counts){
    const log = r.log[today] || (r.log[today] = []);
    if (!log.includes(key)) log.push(key);
  }
  for (const d of Object.keys(r.log)) if (d < addDays(today, -LOG_DAYS)) delete r.log[d];
}

const inCourse = (courseId, key) => key.startsWith(courseId + '/');
export const qidOf = key => key.slice(key.indexOf('/') + 1);

export function dueKeys(courseId, day = dayKey()){
  return Object.entries(review().items).filter(([k, v]) => (!courseId || inCourse(courseId, k)) && v.due <= day).map(([k]) => k);
}
export function deckStats(courseId){
  const today = dayKey(), boxes = INTERVALS.map(() => 0), forecast = Array(7).fill(0);
  for (const [k, v] of Object.entries(review().items)){
    if (courseId && !inCourse(courseId, k)) continue;
    boxes[v.box]++;
    const i = Math.max(0, Math.round((new Date(v.due + 'T12:00:00') - new Date(today + 'T12:00:00')) / 864e5));
    if (i < 7) forecast[i]++;
  }
  return { boxes, forecast, total: boxes.reduce((a, b) => a + b, 0), due: forecast[0] };
}
export function todayAnswers(){ return (review().log[dayKey()] || []).length; }
export function weekAnswers(day = dayKey()){
  const w = weekKey(day);
  return Object.entries(review().log).filter(([d]) => weekKey(d) === w).reduce((a, [, l]) => a + l.length, 0);
}

// Начисления для Game.sync: ключи идемпотентны, повторный пересчёт XP не удваивает
export function reviewAwards(log){
  const out = [], weeks = {};
  for (const [day, list] of Object.entries(log || {})){
    const n = Math.min(list.length, REVIEW_XP.dailyAnswers);
    for (let i = 0; i < n; i++) out.push([`rv:${day}:${i}`, REVIEW_XP.answer, day + 'T12:00:00']);
    const w = weekKey(day); weeks[w] = (weeks[w] || 0) + list.length;
  }
  for (const [w, n] of Object.entries(weeks)) if (n >= REVIEW_XP.weekGoal) out.push([`rvw:${w}`, REVIEW_XP.weekBonus, null]);
  return out;
}

// Слияние двух копий (два устройства): по каждому вопросу — более свежая запись, журнал — объединение
export function mergeReview(a, b){
  const out = { items: { ...(a?.items || {}) }, log: {} };
  for (const [k, v] of Object.entries(b?.items || {})) if (!out.items[k] || v.at > out.items[k].at) out.items[k] = v;
  for (const src of [a?.log, b?.log]) for (const [d, l] of Object.entries(src || {})) out.log[d] = [...new Set([...(out.log[d] || []), ...l])];
  return out;
}
