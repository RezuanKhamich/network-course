// ====== ГЛАВНАЯ САЙТА: каталог, профиль, данные ======

// Ссылки старой одностраничной версии курса «Сети» (index.html#/l/0-1 и т. п.) ведут в новый курс
{
  const r = (location.hash || '').split('/')[1];
  if (['m','l','t','exam','journey','tools','glossary','cheats','progress'].includes(r)) location.replace('courses/network/' + location.hash);
}

$('#themeBtn').onclick = cycleTheme;
$('#menuBtn').onclick = () => $('#side').classList.toggle('open');

let newerNotified = false, pendingImport = null, confirmReset = false, achFilter = 'all', avatarPicker = false;

function renderStatus(){
  const el = $('#saveStatus'); el.className = 'status';
  let txt;
  switch (Store.fileStatus){
    case 'ok': el.classList.add('ok'); txt = 'Сохранено в файл' + (Store.lastFileSave ? ' · ' + fmtTime(Store.lastFileSave) : ''); break;
    case 'denied': el.classList.add('warn'); txt = 'Нет доступа к файлу — нажмите'; break;
    case 'error': el.classList.add('warn'); txt = 'Ошибка записи в файл'; break;
    case 'unsupported': txt = 'Сохранено в браузере'; break;
    default: txt = 'Файл не привязан';
  }
  el.lastElementChild.textContent = txt;
  $('#player').innerHTML = Game.chip();
}
$('#saveStatus').addEventListener('click', e => { if (Store.fileStatus === 'denied'){ e.preventDefault(); Store.requestAccess(); } });

function renderSide(){
  const h = location.hash || '#/';
  const link = (href, label) => `<a href="${href}" class="${h === href ? 'active' : ''}">${label}</a>`;
  let html = `<a class="brand" href="#/"><svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><rect x="2" y="4" width="22" height="18" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7 10l3 3-3 3M12 16h7" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Курсы для разработчиков</a>`;
  html += '<nav class="nav">' + link('#/', '<span class="port">~</span>Главная') + link('#/profile', '<span class="port">★</span>Профиль и достижения') + link('#/data', '<span class="port">↓</span>Данные и настройки');
  html += '<div class="nav-label">Курсы</div>';
  for (const c of COURSES){
    const p = courseProgress(c.id);
    html += `<a href="${c.path}"><span class="led ${p.complete ? 'on' : p.started ? 'part' : ''}"></span><span class="port">${c.icon}</span>${esc(c.title)}</a>`;
  }
  $('#side').innerHTML = html + '</nav>';
}

function render(){
  $('#side').classList.remove('open');
  renderSide(); renderStatus();
  const r = (location.hash || '#/').slice(1).split('/').filter(Boolean)[0];
  const v = $('#view');
  if (!r){ v.innerHTML = viewHome(); }
  else if (r === 'profile'){ v.innerHTML = viewProfile(); mountProfile(); }
  else if (r === 'data'){ v.innerHTML = viewData(); mountData(); }
  else v.innerHTML = '<h1>Страница не найдена</h1><p><a href="#/">На главную</a></p>';
}
window.addEventListener('hashchange', () => { render(); window.scrollTo(0, 0); });

// ---- сегодняшние задания: считаются по XP, начисленному сегодня ----
function todayStats(){
  const t = dayKey(); const out = { lessons:0, checks:0, tests:0 };
  for (const [k, v] of Object.entries(Store.state.game.awarded)){
    if (dayKey(v.at) !== t) continue;
    if (k.includes(':l:')) out.lessons++; else if (k.includes(':c:')) out.checks++; else if (k.includes(':t:')) out.tests++;
  }
  return out;
}
function quests(){
  const t = todayStats(), xp = Game.today(), goal = Game.goal();
  return [
    { done: t.lessons >= 1, text: `Пройдите урок (${Math.min(t.lessons, 1)}/1)` },
    { done: t.checks >= 3, text: `Ответьте верно на 3 вопроса самопроверки (${Math.min(t.checks, 3)}/3)` },
    { done: xp >= goal, text: `Наберите дневную цель: ${Math.min(xp, goal)}/${goal} XP` }
  ];
}
function nextAchievements(n){
  const ctx = Game.context(); const got = Store.state.game.achievements;
  return ACHIEVEMENTS.filter(a => !got[a.id] && !a.hidden && a.goal)
    .map(a => { const [cur, max] = a.goal(ctx); return { a, cur:Math.min(cur, max), max, r:cur / max }; })
    .sort((x, y) => y.r - x.r).slice(0, n);
}
function achCard(a, opts = {}){
  const at = Store.state.game.achievements[a.id];
  const hide = a.hidden && !at;
  let prog = '';
  if (!at && a.goal && !hide){ const [cur, max] = a.goal(Game.context()); prog = `<div class="meter"><i style="width:${Math.min(100, Math.round(cur / max * 100))}%"></i></div><small>${Math.min(cur, max)} / ${max}</small>`; }
  return `<div class="ach ${a.tier} ${at ? '' : 'locked'}"><span class="ai">${hide ? '❔' : a.icon}</span><div style="min-width:0"><span class="tier ${a.tier}">${{ bronze:'бронза', silver:'серебро', gold:'золото' }[a.tier]} · +${TIER_XP[a.tier]} XP</span><b>${hide ? 'Секретное достижение' : esc(a.title)}</b><p>${hide ? 'Условие откроется, когда вы его выполните.' : esc(a.desc)}</p>${at ? `<small>получено ${new Date(at).toLocaleDateString('ru-RU')}</small>` : prog}</div></div>`;
}

// ====== ГЛАВНАЯ ======
function viewHome(){
  const L = Game.level(), s = Game.streak(), xp = Game.today(), goal = Game.goal();
  const name = Store.state.profile.name;
  const got = Object.keys(Store.state.game.achievements).length;
  const last = Store.state.last; const lc = last && findCourse(last.course);
  const greet = (() => { const h = new Date().getHours(); return h < 5 ? 'Доброй ночи' : h < 12 ? 'Доброе утро' : h < 18 ? 'Добрый день' : 'Добрый вечер'; })();
  let html = `<section class="hub-hero">
   <div class="card hello"><h1>${greet}${name ? ', ' + esc(name) : ''}!</h1>
    <p>${s.current ? `Серия ${s.current} ${plural(s.current, 'день', 'дня', 'дней')} подряд. ${s.atRisk ? 'Позанимайтесь сегодня, чтобы её не потерять.' : 'Так держать!'}` : 'Короткое занятие каждый день работает лучше, чем марафон раз в месяц. Начните серию сегодня.'}</p>
    <div class="lvl"><span class="ava">${esc(Store.state.profile.avatar)}</span><div style="flex:1;min-width:0"><div><span class="lvl-num">Уровень ${L.level}</span> <span class="lvl-rank">· ${esc(L.rank)}</span></div>
    <div class="bigbar"><i style="width:${L.pct}%"></i></div><div class="small">${L.into} / ${L.need} XP до уровня ${L.level + 1} · всего ${L.xp} XP</div></div></div>
    <div class="today"><div><b>${xp}<small style="font-size:.6em;color:var(--muted)">/${goal}</small></b><span>XP сегодня</span></div><div><b>🔥 ${s.current}</b><span>дней подряд</span></div><div><b>🏆 ${got}</b><span>из ${ACHIEVEMENTS.length} достижений</span></div></div>
   </div>
   <div class="card"><h2 style="font-size:1.1rem">Задания на сегодня</h2>
    <ul class="quests">${quests().map(q => `<li class="${q.done ? 'done' : ''}"><span class="chk">${q.done ? '✓' : ''}</span><span>${q.text}</span></li>`).join('')}</ul>
    <h2 style="font-size:1.1rem;margin-top:20px">Ближайшие достижения</h2>
    <ul class="quests">${nextAchievements(3).map(x => `<li><span style="font-size:20px">${x.a.icon}</span><span style="flex:1;min-width:0"><b style="font-weight:600">${esc(x.a.title)}</b> <span class="small">${x.cur}/${x.max}</span><span class="meter" style="display:block;height:5px;margin-top:4px"><i style="width:${Math.round(x.r * 100)}%"></i></span></span></li>`).join('') || '<li class="small">Все открытые достижения получены!</li>'}</ul>
   </div></section>`;
  if (lc) html += `<div class="continue"><div><small>Вы остановились здесь · ${esc(lc.title)}</small><b>${esc(last.title)}</b></div><a class="btn" href="${lc.path}${last.hash}">Продолжить →</a></div>`;
  html += `<h2 style="margin-bottom:14px">Курсы</h2><div class="courses">`;
  for (const c of COURSES){
    const p = courseProgress(c.id);
    html += `<a class="course" href="${c.path}" style="--c:${c.color}"><span class="ci">${c.icon}</span><h3>${esc(c.title)}</h3><p>${esc(c.short)}</p>
      <div class="tags">${c.tags.map(t => `<span>${esc(t)}</span>`).join('')}</div>
      <div class="meter"><i style="width:${p.pct}%"></i></div>
      <div class="cfoot"><span>${p.pct}% · ${p.done}/${p.lessons} уроков · ${p.passed}/${p.modules} тестов</span><span>${p.examPassed ? '🎓 экзамен сдан' : p.started ? 'продолжить →' : 'начать →'}</span></div></a>`;
  }
  html += '</div>';
  const recent = ACHIEVEMENTS.filter(a => Store.state.game.achievements[a.id]).sort((a, b) => Store.state.game.achievements[b.id].localeCompare(Store.state.game.achievements[a.id])).slice(0, 4);
  if (recent.length) html += `<h2 style="margin:30px 0 14px">Последние достижения</h2><div class="achs">${recent.map(a => achCard(a)).join('')}</div><p style="margin-top:12px"><a href="#/profile">Все достижения →</a></p>`;
  return html;
}

// ====== ПРОФИЛЬ ======
function heatmap(){
  const days = Store.state.game.days, goal = Game.goal();
  const weeks = 53, end = new Date(); end.setHours(12, 0, 0, 0);
  // начинаем с понедельника, чтобы строки сетки были днями недели
  const start = new Date(end); start.setDate(end.getDate() - (weeks - 1) * 7);
  while (start.getDay() !== 1) start.setDate(start.getDate() - 1);
  let cells = '';
  for (const d = new Date(start); d <= end || d.getDay() !== 1; d.setDate(d.getDate() + 1)){
    if (d > end){ cells += '<i class="fut"></i>'; continue; }
    const xp = days[dayKey(d)] || 0;
    const lv = !xp ? '' : xp >= goal * 2 ? 'l4' : xp >= goal ? 'l3' : xp >= goal / 2 ? 'l2' : 'l1';
    cells += `<i class="${lv}" title="${d.toLocaleDateString('ru-RU')}: ${xp} XP"></i>`;
  }
  return `<div class="heat-wrap"><div class="heat">${cells}</div></div><div class="heat-legend">меньше <i style="background:var(--line)"></i><i class="l1" style="background:color-mix(in srgb,var(--ok) 30%,var(--line))"></i><i style="background:color-mix(in srgb,var(--ok) 55%,var(--line))"></i><i style="background:color-mix(in srgb,var(--ok) 80%,var(--line))"></i><i style="background:var(--ok)"></i> больше</div>`;
}
function viewProfile(){
  const pr = Store.state.profile, L = Game.level(), s = Game.streak(), ctx = Game.context();
  const got = Object.keys(Store.state.game.achievements).length;
  const activeDays = Object.values(Store.state.game.days).filter(x => x > 0).length;
  const list = ACHIEVEMENTS.filter(a => achFilter === 'all' || (achFilter === 'got') === !!Store.state.game.achievements[a.id]);
  return `<div class="crumbs"><a href="#/">главная</a> / профиль</div>
  <div class="profile-head" style="margin-top:12px"><button class="ava" id="avaBtn" title="Сменить аватар">${esc(pr.avatar)}</button>
   <div style="min-width:0;flex:1"><input id="nameInp" value="${esc(pr.name)}" placeholder="Как вас зовут?" maxlength="40" aria-label="Имя">
   <div class="small" style="padding-left:8px">Уровень ${L.level} · ${esc(L.rank)} · ${L.xp} XP · с ${new Date(pr.createdAt).toLocaleDateString('ru-RU')}</div>
   <div class="bigbar" style="max-width:420px;margin-left:8px"><i style="width:${L.pct}%"></i></div></div></div>
  ${avatarPicker ? `<div class="avatars">${AVATARS.map(a => `<button data-ava="${a}" class="${a === pr.avatar ? 'on' : ''}">${a}</button>`).join('')}</div>` : ''}
  <div class="kpis">
   <div class="kpi"><b>${ctx.lessons}</b><span>уроков пройдено</span></div>
   <div class="kpi"><b>${ctx.passed}</b><span>тестов сдано</span></div>
   <div class="kpi"><b>${ctx.perfect}</b><span>тестов на 100%</span></div>
   <div class="kpi"><b>${ctx.checks}</b><span>верных самопроверок</span></div>
   <div class="kpi"><b>🔥 ${s.current}</b><span>серия (рекорд ${s.best})</span></div>
   <div class="kpi"><b>${activeDays}</b><span>дней с занятиями</span></div>
  </div>
  <h2>Активность</h2><p class="small">Последний год. Насыщенность — сколько XP набрано за день относительно дневной цели.</p>${heatmap()}
  <h2 style="margin-top:28px">Курсы</h2>
  <div class="tbl"><table><tr><th>Курс</th><th>Прогресс</th><th>Уроки</th><th>Тесты</th><th>Экзамен</th></tr>${COURSES.map(c => { const p = courseProgress(c.id); return `<tr><td><a href="${c.path}">${c.icon} ${esc(c.title)}</a></td><td>${p.pct}%</td><td>${p.done}/${p.lessons}</td><td>${p.passed}/${p.modules}</td><td>${p.exam ? p.exam.bestScore + '%' : '—'}</td></tr>`; }).join('')}</table></div>
  <h2 style="margin-top:28px" id="achievements">Достижения · ${got} из ${ACHIEVEMENTS.length}</h2>
  <div class="ach-filter">${[['all','Все'],['got','Полученные'],['left','Ещё не получены']].map(([k, l]) => `<button class="btn ${achFilter === k ? '' : 'ghost'} small-btn" data-filter="${k}">${l}</button>`).join('')}</div>
  <div class="achs">${list.map(a => achCard(a)).join('') || '<p class="small">Пока пусто — всё впереди.</p>'}</div>
  <h2 style="margin-top:28px">Как начисляется опыт</h2>
  <div class="tbl rules"><table><tr><th>Действие</th><th>XP</th></tr>
   <tr><td>Урок пройден</td><td>+${XP.lesson}</td></tr><tr><td>Верный ответ в самопроверке (один раз за вопрос)</td><td>+${XP.check}</td></tr>
   <tr><td>Тест модуля сдан (≥ ${PASS}%)</td><td>+${XP.test}</td></tr><tr><td>Тест модуля на 100%</td><td>+${XP.perfect}</td></tr>
   <tr><td>Финальный экзамен сдан / на 100%</td><td>+${XP.exam} / +${XP.examPerfect}</td></tr><tr><td>Сквозной сценарий пройден до конца</td><td>+${XP.journey}</td></tr>
   <tr><td>Дневная цель выполнена</td><td>+${XP.goal}</td></tr><tr><td>Достижение: бронза / серебро / золото</td><td>+${TIER_XP.bronze} / +${TIER_XP.silver} / +${TIER_XP.gold}</td></tr></table></div>
  <p class="small">XP начисляется один раз: повторная отметка урока или пересдача теста опыт не удваивают.</p>`;
}
function mountProfile(){
  const n = $('#nameInp');
  n.onchange = () => { Store.state.profile.name = n.value.trim(); Store.save(); renderStatus(); };
  // на узком экране карта прокручивается — показываем последние недели
  const hw = $('.heat-wrap'); if (hw) hw.scrollLeft = hw.scrollWidth;
  $('#avaBtn').onclick = () => { avatarPicker = !avatarPicker; render(); };
  document.querySelectorAll('[data-ava]').forEach(b => b.onclick = () => { Store.state.profile.avatar = b.dataset.ava; avatarPicker = false; Store.save(); render(); });
  document.querySelectorAll('[data-filter]').forEach(b => b.onclick = () => { achFilter = b.dataset.filter; render(); });
}

// ====== ДАННЫЕ И НАСТРОЙКИ ======
function viewData(){
  const last = lsGet(LS_BACKUP);
  let fileBlock;
  if (!FS_SUPPORTED){
    fileBlock = `<p>Ваш браузер не умеет автоматически сохранять в файл (это доступно в Chrome, Edge, Opera, Яндекс Браузере). Используйте кнопки ниже: скачайте копию и откройте её, когда нужно.</p>`;
  } else if (Store.handle){
    fileBlock = `<p>Файл привязан: <b>${esc(Store.handle.name)}</b>. Статус: ${{ ok:'сохраняется автоматически', denied:'нужен доступ', error:'ошибка записи' }[Store.fileStatus] || '—'}${Store.lastFileSave ? ', последнее сохранение в ' + fmtTime(Store.lastFileSave) : ''}.</p>
    <div class="row">${Store.fileStatus !== 'ok' ? '<button class="btn" id="reqAccess">Разрешить доступ к файлу</button>' : '<button class="btn ghost" id="saveNow">Сохранить сейчас</button>'}<button class="btn ghost" id="relink">Выбрать другой файл</button><button class="btn ghost" id="unlink">Отвязать</button></div>`;
  } else {
    fileBlock = `<p>Привяжите файл один раз, и каждое изменение прогресса во всех курсах будет сохраняться в него автоматически. После перезапуска браузера может понадобиться один клик, чтобы снова разрешить доступ.</p>
    <div class="row"><button class="btn" id="link">Создать файл прогресса</button><button class="btn ghost" id="openLinked">Открыть существующий файл</button></div>`;
  }
  let imp = '';
  if (pendingImport || Store.newerFileData){
    const pd = pendingImport || Store.newerFileData;
    const done = Object.values(pd.courses).reduce((a, c) => a + Object.values(c.lessons).filter(x => x.completed).length, 0);
    const tests = Object.values(pd.courses).reduce((a, c) => a + Object.keys(c.tests).length, 0);
    imp = `<div class="banner"><span>${pendingImport ? 'Загружен файл' : 'В привязанном файле прогресс новее'} от ${new Date(pd.savedAt).toLocaleString('ru-RU')}: ${done} уроков, ${tests} тестов. Что сделать с текущим прогрессом?</span><span class="row"><button class="btn" id="impReplace">Заменить</button><button class="btn ghost" id="impMerge">Объединить</button><button class="btn ghost" id="impCancel">Отмена</button></span></div>`;
  }
  const st = Store.state.settings;
  return `<div class="crumbs"><a href="#/">главная</a> / данные</div><h1>Данные и настройки</h1>${imp}
  <p class="small" style="margin-top:8px">Сайт статический: прогресс, XP и достижения хранятся только у вас — в браузере и, если хотите, в файле на диске.</p>
  <h2 style="margin-top:20px">Автосохранение в файл</h2>${fileBlock}
  <h2 style="margin-top:28px">Копия вручную</h2>
  <p class="small">Последняя копия: ${last ? new Date(last).toLocaleString('ru-RU') : 'ещё не сохранялась'}. Можно загрузить и файл прогресса из старых версий курсов — он будет перенесён.</p>
  <div class="row"><button class="btn ghost" id="export">Скачать копию (.json)</button><label class="btn ghost" for="impFile" style="cursor:pointer">Загрузить из файла</label><input type="file" id="impFile" accept=".json,application/json" hidden></div>
  <h2 style="margin-top:28px">Настройки</h2>
  <label class="small" for="goalSel">Дневная цель</label>
  <div class="row" style="margin:6px 0 14px">${[[20,'Лёгкая · 20 XP'],[50,'Обычная · 50 XP'],[100,'Серьёзная · 100 XP'],[200,'Интенсив · 200 XP']].map(([v, l]) => `<button class="btn ${st.dailyGoal === v ? '' : 'ghost'}" data-goal="${v}">${l}</button>`).join('')}</div>
  <label class="opt" style="max-width:520px"><input type="checkbox" id="effects" ${st.effects ? 'checked' : ''}><span>Конфетти и анимации наград</span></label>
  <h2 style="margin-top:28px">Сброс</h2>
  <button class="btn danger" id="resetBtn">Сбросить весь прогресс</button>
  ${confirmReset ? `<div class="confirm">Прогресс всех курсов, XP и достижения будут удалены без возможности восстановления. Сначала скачайте копию, если она может понадобиться.<div class="row" style="margin-top:10px"><button class="btn ghost" id="resetExport">Скачать копию</button><button class="btn danger" id="resetYes">Да, сбросить</button><button class="btn ghost" id="resetNo">Отмена</button></div></div>` : ''}`;
}
function mountData(){
  const on = (id, fn) => { const e = document.getElementById(id); if (e) e.onclick = fn; };
  on('link', () => Store.linkFile()); on('relink', () => Store.linkFile());
  on('openLinked', async () => { const d = await Store.openLinkedFile(); if (d){ pendingImport = d; } render(); });
  on('unlink', () => Store.unlink()); on('reqAccess', () => Store.requestAccess()); on('saveNow', async () => { await Store.writeFile(); toast('Сохранено в файл.'); render(); });
  on('export', () => Store.exportFile());
  const f = $('#impFile'); if (f) f.onchange = () => { if (f.files[0]) Store.importFile(f.files[0], d => { pendingImport = d; render(); }); };
  const take = mode => { Store.apply(pendingImport || Store.newerFileData, mode); pendingImport = null; Store.newerFileData = null; toast(mode === 'merge' ? 'Прогресс объединён.' : 'Прогресс заменён.'); render(); };
  on('impReplace', () => take('replace')); on('impMerge', () => take('merge'));
  on('impCancel', () => { if (!pendingImport && Store.newerFileData) Store.writeFile(); pendingImport = null; Store.newerFileData = null; render(); });
  document.querySelectorAll('[data-goal]').forEach(b => b.onclick = () => { Store.state.settings.dailyGoal = +b.dataset.goal; Store.save(); Game.sync(); render(); });
  const ef = $('#effects'); ef.onchange = () => { Store.state.settings.effects = ef.checked; Store.save(); if (ef.checked) confetti(60); };
  on('resetBtn', () => { confirmReset = true; render(); });
  on('resetNo', () => { confirmReset = false; render(); });
  on('resetExport', () => Store.exportFile());
  on('resetYes', () => { confirmReset = false; Store.reset(); toast('Прогресс сброшен.'); render(); });
}

// ====== СТАРТ ======
Store.load(); applyTheme(); Game.sync(true);
render(); Store.restoreHandle();
Store.onChange(kind => {
  renderStatus();
  // на главной и в профиле всё зависит от прогресса — перерисовываем; на странице данных не трогаем поле ввода
  if (kind === 'external' || (Store.newerFileData && location.hash === '#/data')) render();
  else if (Store.newerFileData && !newerNotified && !(location.hash || '').startsWith('#/data')){ newerNotified = true; toast('В привязанном файле прогресс новее — откройте «Данные», чтобы загрузить его.'); }
});
