// ====== ИГРОВЫЕ МЕХАНИКИ ======
// XP, уровни, серия дней, дневная цель и достижения.
// Всё выводится из прогресса курсов: Game.sync() идемпотентно начисляет XP по ключам
// (урок, вопрос, тест…), поэтому повторная отметка урока, импорт или слияние файлов не дают XP дважды.
const PASS = 70;
const SITE_ROOT = window.SITE_ROOT || '';

const XP = { lesson:20, check:5, test:100, perfect:50, exam:300, examPerfect:150, goal:15, journey:30 };
const TIER_XP = { bronze:25, silver:50, gold:100 };
const RANKS = [[1,'Новичок'],[3,'Стажёр'],[5,'Джуниор'],[8,'Мидл'],[11,'Сеньор'],[14,'Лид'],[17,'Архитектор'],[20,'Гуру']];
const AVATARS = ['🦉','🦊','🐱','🐼','🐧','🦄','🐙','🐢','🐝','🦖','👾','🤖','🐸','🧙','🦁','🚀'];

// Сколько XP нужно, чтобы достичь уровня L: шаг растёт на 50 XP с каждым уровнем
const xpForLevel = L => 100 * (L - 1) + 25 * (L - 1) * (L - 2);

function courseProgress(id){
  const c = Store.state.courses[id] || emptyCourse();
  const meta = c.meta || findCourse(id) || { lessons:1, modules:1 };
  const done = Object.values(c.lessons).filter(l => l && l.completed).length;
  const tests = Object.values(c.tests);
  const passed = tests.filter(t => t.bestScore >= PASS).length;
  const units = meta.lessons + meta.modules;
  return {
    done, lessons:meta.lessons, passed, modules:meta.modules,
    pct: units ? Math.min(100, Math.round((done + passed) / units * 100)) : 0,
    perfect: tests.filter(t => t.bestScore === 100).length,
    exam: c.finalExam, examPassed: !!(c.finalExam && c.finalExam.bestScore >= PASS),
    checks: Object.keys(c.checks || {}).length,
    started: done > 0 || tests.length > 0,
    complete: done >= meta.lessons && passed >= meta.modules
  };
}

const ACHIEVEMENTS = [
  { id:'first-lesson', icon:'📖', title:'Первый шаг', desc:'Пройдите первый урок', tier:'bronze', test:x => x.lessons >= 1 },
  { id:'lessons-10', icon:'📚', title:'Втянулся', desc:'Пройдите 10 уроков', tier:'bronze', test:x => x.lessons >= 10, goal:x => [x.lessons, 10] },
  { id:'lessons-50', icon:'🏃', title:'Марафонец', desc:'Пройдите 50 уроков', tier:'silver', test:x => x.lessons >= 50, goal:x => [x.lessons, 50] },
  { id:'lessons-all', icon:'🏛️', title:'Энциклопедист', desc:'Пройдите все уроки всех курсов', tier:'gold', test:x => x.lessons >= x.lessonsTotal, goal:x => [x.lessons, x.lessonsTotal] },
  { id:'checks-25', icon:'✅', title:'Сам себе экзаменатор', desc:'25 верных ответов в самопроверке уроков', tier:'bronze', test:x => x.checks >= 25, goal:x => [x.checks, 25] },
  { id:'checks-100', icon:'🎯', title:'Снайпер', desc:'100 верных ответов в самопроверке', tier:'silver', test:x => x.checks >= 100, goal:x => [x.checks, 100] },
  { id:'test-first', icon:'🧪', title:'Зачёт', desc:'Сдайте первый тест модуля', tier:'bronze', test:x => x.passed >= 1 },
  { id:'tests-10', icon:'🗂️', title:'Десять из десяти', desc:'Сдайте 10 тестов модулей', tier:'silver', test:x => x.passed >= 10, goal:x => [x.passed, 10] },
  { id:'test-perfect', icon:'💯', title:'Без единой ошибки', desc:'Сдайте тест модуля на 100%', tier:'silver', test:x => x.perfect >= 1 },
  { id:'perfect-5', icon:'🌟', title:'Отличник', desc:'Пять тестов модулей на 100%', tier:'gold', test:x => x.perfect >= 5, goal:x => [x.perfect, 5] },
  { id:'persistent', icon:'🔁', title:'Упорство', desc:'Сдайте тест, который не получился с первых двух попыток', tier:'bronze', test:x => x.persistent },
  { id:'errors-fixed', icon:'🩹', title:'Работа над ошибками', desc:'Исправьте все ошибки теста в режиме «работа над ошибками»', tier:'bronze', test:x => x.flags['errors-fixed'] },
  { id:'course-network', icon:'🌐', title:'Сетевой инженер', desc:'Сдайте все тесты курса «Сети»', tier:'gold', test:x => x.course.network && x.course.network.passed >= x.course.network.modules },
  { id:'course-ai', icon:'🤖', title:'Агентостроитель', desc:'Сдайте все тесты курса «AI-агенты»', tier:'gold', test:x => x.course['ai-agents'] && x.course['ai-agents'].passed >= x.course['ai-agents'].modules },
  { id:'course-devops', icon:'🚀', title:'Инженер поставки', desc:'Сдайте все тесты курса «DevOps»', tier:'gold', test:x => x.course.devops && x.course.devops.passed >= x.course.devops.modules },
  { id:'exam-first', icon:'🏁', title:'Экзамен сдан', desc:'Сдайте финальный экзамен любого курса', tier:'silver', test:x => x.exams >= 1 },
  { id:'exam-all', icon:'👑', title:'Все дипломы', desc:'Сдайте финальные экзамены всех курсов', tier:'gold', test:x => x.exams >= COURSES.length },
  { id:'exam-fast', icon:'⚡', title:'Блиц', desc:'Сдайте финальный экзамен быстрее чем за 20 минут', tier:'gold', test:x => x.flags['exam-fast'] },
  { id:'polyglot', icon:'🔀', title:'Широкий профиль', desc:'Начните оба курса', tier:'bronze', test:x => x.started >= 2 },
  { id:'journey', icon:'🧭', title:'Путешественник', desc:'Дойдите до конца сквозного сценария курса', tier:'bronze', test:x => COURSES.some(c => x.flags[c.id + ':journey']) },
  { id:'tools', icon:'🛠️', title:'Экспериментатор', desc:'Откройте страницу интерактивных инструментов', tier:'bronze', test:x => COURSES.some(c => x.flags[c.id + ':tools']) },
  { id:'streak-3', icon:'🔥', title:'Разогрев', desc:'Занимайтесь 3 дня подряд', tier:'bronze', test:x => x.streakBest >= 3, goal:x => [x.streakBest, 3] },
  { id:'streak-7', icon:'📅', title:'Неделя в ритме', desc:'Занимайтесь 7 дней подряд', tier:'silver', test:x => x.streakBest >= 7, goal:x => [x.streakBest, 7] },
  { id:'streak-30', icon:'☄️', title:'Привычка', desc:'Занимайтесь 30 дней подряд', tier:'gold', test:x => x.streakBest >= 30, goal:x => [x.streakBest, 30] },
  { id:'goal-1', icon:'🎯', title:'Цель дня', desc:'Выполните дневную цель по XP', tier:'bronze', test:x => x.goals >= 1 },
  { id:'goal-10', icon:'🏹', title:'Целеустремлённость', desc:'Выполните дневную цель 10 раз', tier:'silver', test:x => x.goals >= 10, goal:x => [x.goals, 10] },
  { id:'level-5', icon:'⬆️', title:'Уровень 5', desc:'Наберите опыт до 5 уровня', tier:'bronze', test:x => x.level >= 5, goal:x => [x.level, 5] },
  { id:'level-10', icon:'🚀', title:'Уровень 10', desc:'Наберите опыт до 10 уровня', tier:'silver', test:x => x.level >= 10, goal:x => [x.level, 10] },
  { id:'level-15', icon:'🛸', title:'Уровень 15', desc:'Наберите опыт до 15 уровня', tier:'gold', test:x => x.level >= 15, goal:x => [x.level, 15] },
  // скрытые: условие видно только после получения
  { id:'night-owl', icon:'🌙', title:'Ночная сова', desc:'Учитесь между полуночью и пятью утра', tier:'bronze', hidden:true, test:x => x.flags.night },
  { id:'early-bird', icon:'🐦', title:'Ранняя пташка', desc:'Учитесь между пятью и семью утра', tier:'bronze', hidden:true, test:x => x.flags.morning },
  { id:'weekend', icon:'🛋️', title:'Выходные с пользой', desc:'Занимайтесь и в субботу, и в воскресенье', tier:'bronze', hidden:true, test:x => x.flags.weekend },
  { id:'comeback', icon:'🔙', title:'Возвращение', desc:'Вернитесь к учёбе после перерыва в неделю и больше', tier:'bronze', hidden:true, test:x => x.flags.comeback }
];

const Game = {
  queue: [],
  totalXP(){ return Object.values(Store.state.game.awarded).reduce((a, v) => a + (v.xp || 0), 0); },
  level(xp = this.totalXP()){
    let L = 1; while (xp >= xpForLevel(L + 1)) L++;
    const from = xpForLevel(L), to = xpForLevel(L + 1);
    return { level:L, xp, into:xp - from, need:to - from, pct:Math.round((xp - from) / (to - from) * 100), rank:this.rank(L) };
  },
  rank(L){ let r = RANKS[0][1]; for (const [l, n] of RANKS) if (L >= l) r = n; return r; },
  today(){ return Store.state.game.days[dayKey()] || 0; },
  goal(){ return Store.state.settings.dailyGoal || 50; },
  streak(){
    const days = Store.state.game.days;
    const active = d => (days[dayKey(d)] || 0) > 0;
    const d = new Date(); let cur = 0, atRisk = false;
    if (!active(d)){ d.setDate(d.getDate() - 1); atRisk = active(d); }
    while (active(d)){ cur++; d.setDate(d.getDate() - 1); }
    // лучшая серия по всей истории
    const keys = Object.keys(days).filter(k => days[k] > 0).sort();
    let best = 0, run = 0, prev = null;
    for (const k of keys){
      const t = new Date(k + 'T12:00:00');
      run = prev && Math.round((t - prev) / 864e5) === 1 ? run + 1 : 1;
      best = Math.max(best, run); prev = t;
    }
    return { current:cur, best:Math.max(best, cur), atRisk };
  },

  award(key, xp, when){
    const g = Store.state.game;
    if (g.awarded[key]) return false;
    const at = when || new Date().toISOString();
    g.awarded[key] = { xp, at };
    const d = dayKey(at); g.days[d] = (g.days[d] || 0) + xp;
    if (!when) this.activity();
    return true;
  },
  // флаги для скрытых достижений, связанные со временем «живой» активности
  activity(){
    const g = Store.state.game, now = new Date(), h = now.getHours();
    if (h < 5) g.flags.night = true;
    else if (h >= 5 && h < 7) g.flags.morning = true;
    const wd = now.getDay();
    if (wd === 0 || wd === 6){
      const other = new Date(now); other.setDate(now.getDate() + (wd === 0 ? -1 : 1));
      if ((g.days[dayKey(other)] || 0) > 0) g.flags.weekend = true;
    }
    const past = Object.keys(g.days).filter(k => k < dayKey(now) && g.days[k] > 0).sort().pop();
    if (past && (now - new Date(past + 'T23:59:59')) / 864e5 >= 7 && (g.days[dayKey(now)] || 0) === 0) g.flags.comeback = true;
  },
  flag(name){
    if (Store.state.game.flags[name]) return;
    Store.state.game.flags[name] = true;
    this.sync();
  },

  context(){
    const course = {}; let lessons = 0, lessonsTotal = 0, passed = 0, perfect = 0, exams = 0, checks = 0, started = 0, persistent = false;
    for (const c of COURSES){
      const p = courseProgress(c.id); course[c.id] = p;
      lessons += p.done; lessonsTotal += p.lessons; passed += p.passed; perfect += p.perfect; checks += p.checks;
      if (p.examPassed) exams++; if (p.started) started++;
      const st = Store.state.courses[c.id];
      if (st && Object.values(st.tests).some(t => t.bestScore >= PASS && t.attempts >= 3)) persistent = true;
    }
    const goals = Object.keys(Store.state.game.awarded).filter(k => k.startsWith('goal:')).length;
    return { course, lessons, lessonsTotal, passed, perfect, exams, checks, started, persistent, goals,
      level:this.level().level, streakBest:this.streak().best, flags:Store.state.game.flags };
  },

  // Начисляет всё, что положено по текущему прогрессу. silent — без поздравлений (загрузка, импорт).
  sync(silent){
    const st = Store.state; const before = this.level().level;
    let changed = false; const aw = (k, xp, when) => { if (this.award(k, xp, when)) changed = true; };
    for (const [cid, c] of Object.entries(st.courses)){
      for (const [id, l] of Object.entries(c.lessons)) if (l && l.completed) aw(`${cid}:l:${id}`, XP.lesson, l.completedAt);
      for (const [id, at] of Object.entries(c.checks || {})) aw(`${cid}:c:${id}`, XP.check, typeof at === 'string' ? at : null);
      for (const [id, t] of Object.entries(c.tests)){
        if (t.bestScore >= PASS) aw(`${cid}:t:${id}`, XP.test, t.lastAttemptAt);
        if (t.bestScore === 100) aw(`${cid}:tp:${id}`, XP.perfect, t.lastAttemptAt);
      }
      if (c.finalExam && c.finalExam.bestScore >= PASS) aw(`${cid}:exam`, XP.exam, c.finalExam.lastAttemptAt);
      if (c.finalExam && c.finalExam.bestScore === 100) aw(`${cid}:examp`, XP.examPerfect, c.finalExam.lastAttemptAt);
      if (st.game.flags[cid + ':journey']) aw(`${cid}:journey`, XP.journey);
    }
    const today = dayKey();
    if (this.today() >= this.goal()) aw(`goal:${today}`, XP.goal);
    // достижения могут давать XP, а XP — открывать новые достижения: крутим до устойчивого состояния
    const fresh = [];
    for (let guard = 0; guard < 5; guard++){
      const ctx = this.context(); let any = false;
      for (const a of ACHIEVEMENTS){
        if (st.game.achievements[a.id] || !a.test(ctx)) continue;
        st.game.achievements[a.id] = new Date().toISOString();
        aw('ach:' + a.id, TIER_XP[a.tier]); fresh.push(a); any = true;
      }
      if (!any) break;
    }
    if (changed || fresh.length) Store.save('game');
    if (silent) return;
    const after = this.level().level;
    for (const a of fresh) this.queue.push({ kind:'ach', a });
    if (after > before) this.queue.push({ kind:'level', level:after });
    this.flush();
  },
  // ---- отображение ----
  flush(){
    if (this.showing || !this.queue.length) return;
    const n = this.queue.shift(); this.showing = true;
    const el = document.createElement('div'); el.className = 'ach-pop ' + (n.kind === 'level' ? 'gold' : n.a.tier);
    if (n.kind === 'level'){
      el.innerHTML = `<span class="ach-ico">⭐</span><span><small>Новый уровень</small><b>Уровень ${n.level} · ${esc(this.rank(n.level))}</b></span>`;
      confetti(140);
    } else {
      el.innerHTML = `<span class="ach-ico">${n.a.icon}</span><span><small>Достижение · +${TIER_XP[n.a.tier]} XP</small><b>${esc(n.a.title)}</b><em>${esc(n.a.desc)}</em></span>`;
      if (n.a.tier !== 'bronze') confetti(n.a.tier === 'gold' ? 140 : 70);
    }
    el.onclick = () => close();
    document.body.appendChild(el);
    const close = () => { if (!el.isConnected) return; el.classList.add('out'); setTimeout(() => { el.remove(); this.showing = false; this.flush(); }, 250); };
    setTimeout(close, 4200);
  },
  floatXP(xp, anchor){
    if (!xp) return;
    const el = document.createElement('div'); el.className = 'xp-float'; el.textContent = '+' + xp + ' XP';
    const r = anchor && anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : null;
    if (r && r.width){ el.style.left = (r.left + r.width / 2) + 'px'; el.style.top = (r.top) + 'px'; }
    else { el.style.right = '24px'; el.style.top = '70px'; }
    document.body.appendChild(el); setTimeout(() => el.remove(), 1300);
  },
  // Обёртка для действий пользователя: считает, сколько XP принесло действие, и показывает это
  track(fn, anchor){
    const x0 = this.totalXP();
    fn(); this.sync();
    const gained = this.totalXP() - x0;
    this.floatXP(gained, anchor);
    return gained;
  },

  // Компактная плашка игрока: уровень, XP, серия, дневная цель
  chip(){
    const L = this.level(), s = this.streak(), today = this.today(), goal = this.goal();
    const gp = Math.min(100, Math.round(today / goal * 100));
    const pr = Store.state.profile;
    return `<a class="player" href="${SITE_ROOT}index.html#/profile" title="Профиль и достижения">
      <span class="ava">${esc(pr.avatar || '🦉')}</span>
      <span class="pl-main"><span class="pl-top"><b>Ур. ${L.level}</b><span class="muted">${L.into}/${L.need} XP</span></span><span class="xpbar"><i style="width:${L.pct}%"></i></span></span>
      <span class="pl-streak ${s.current ? 'on' : ''} ${s.atRisk ? 'risk' : ''}" title="${s.atRisk ? 'Серия прервётся, если сегодня не заниматься' : 'Дней подряд'}">🔥${s.current}</span>
      <span class="ring" style="--p:${gp}" title="Дневная цель: ${today}/${goal} XP"><span>${gp >= 100 ? '✓' : gp + '%'}</span></span>
    </a>`;
  }
};

// Небольшой фейерверк из конфетти на canvas, без библиотек
function confetti(n = 100){
  if (!Store.state.settings.effects || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas'); c.className = 'confetti';
  const W = c.width = innerWidth, H = c.height = innerHeight; document.body.appendChild(c);
  const ctx = c.getContext('2d');
  const colors = ['#f0a33a','#3cc4a0','#6b7cff','#ef7a72','#e3b04b','#52c372','#c46ad1'];
  const ps = Array.from({ length:n }, () => ({ x:W / 2 + (Math.random() - .5) * W * .3, y:H * .35, vx:(Math.random() - .5) * 14, vy:-Math.random() * 12 - 4, s:Math.random() * 6 + 4, r:Math.random() * 6, vr:(Math.random() - .5) * .3, c:colors[Math.floor(Math.random() * colors.length)] }));
  let t = 0;
  const frame = () => {
    ctx.clearRect(0, 0, W, H); t++;
    for (const p of ps){ p.x += p.vx; p.y += p.vy; p.vy += .35; p.vx *= .99; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.globalAlpha = Math.max(0, 1 - t / 110); ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); ctx.restore(); }
    if (t < 110) requestAnimationFrame(frame); else c.remove();
  };
  frame();
}
