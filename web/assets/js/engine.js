// ====== ДВИЖОК КУРСА ======
// Общий для всех курсов SPA на hash-роутинге. Ожидает глобальные объекты курса:
// COURSE (настройки), MODULES, UPCOMING, GLOSSARY (content.js), WIDGETS, viewTools, viewJourney,
// mountJourney, viewCheats и, по желанию, readMore (course.js).

// Прогресс текущего курса. Геттер, потому что Store.state заменяется при импорте и синхронизации вкладок.
const P = { get state(){ return Store.course(COURSE.id); } };

const allLessons = () => MODULES.flatMap(m => m.lessons.map(l => ({ ...l, module:m })));
const findLesson = id => allLessons().find(l => l.id === id);
const findModule = id => MODULES.find(m => m.id === +id);
const allModsSorted = () => [...MODULES, ...UPCOMING.map(u => ({ ...u, soon:true }))].sort((x, y) => x.id - y.id);
const HUB = SITE_ROOT + 'index.html';

function moduleStats(m){
  const done = m.lessons.filter(l => P.state.lessons[l.id] && P.state.lessons[l.id].completed).length;
  const t = P.state.tests['m' + m.id];
  return { done, total:m.lessons.length, test:t, passed: !!(t && t.bestScore >= PASS) };
}
function isUnlocked(m){
  if (P.state.unlockAll || m.id === 0) return true;
  // предыдущий опубликованный модуль: номера могут идти с пропусками, если курс пишется частями
  const prev = MODULES[MODULES.indexOf(m) - 1];
  // уже начатый модуль не закрываем, даже если перед ним появились новые
  const started = m.lessons.some(l => P.state.lessons[l.id]) || P.state.tests['m' + m.id];
  return !prev || moduleStats(prev).passed || !!started;
}
function overall(){
  const ls = allLessons(); const done = ls.filter(l => P.state.lessons[l.id] && P.state.lessons[l.id].completed).length;
  const passed = MODULES.filter(m => moduleStats(m).passed).length;
  const units = ls.length + MODULES.length;
  return { pct: Math.round((done + passed) / units * 100), done, lessons: ls.length, passed };
}

$('#themeBtn').onclick = cycleTheme;
$('#menuBtn').onclick = () => $('#side').classList.toggle('open');

function renderStatus(){
  const el = $('#saveStatus'); el.className = 'status'; el.href = HUB + '#/data';
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

// ====== НАВИГАЦИЯ ======
function renderSide(){
  const h = location.hash || '#/';
  const link = (href, label, extra='') => `<a href="${href}" class="${h === href ? 'active' : ''} ${extra}">${label}</a>`;
  let html = `<a class="back" href="${HUB}">← Все курсы</a><a class="brand" href="#/">${COURSE.brand}${esc(COURSE.title)}</a>`;
  html += '<nav class="nav">' + link('#/', '<span class="port">~</span>Главная курса');
  html += '<div class="nav-label">Модули</div>';
  for (const m of allModsSorted()){
    if (m.soon){ html += `<a class="locked" href="#/m/${m.id}"><span class="led"></span><span class="port">${String(m.id).padStart(2,'0')}</span>${esc(m.title)}</a>`; continue; }
    const s = moduleStats(m); const un = isUnlocked(m);
    const led = s.passed ? 'on' : (s.done ? 'part' : '');
    html += link('#/m/' + m.id, `<span class="led ${led}"></span><span class="port">${String(m.id).padStart(2,'0')}</span>${esc(m.title)}${un ? '' : ' 🔒'}`, un ? '' : 'locked');
  }
  html += '<div class="nav-label">Практика</div>' + link('#/journey', '<span class="port">→</span>' + esc(COURSE.journeyLabel)) + link('#/exam', '<span class="port">∑</span>Финальный экзамен') + link('#/tools', '<span class="port">⚙</span>Инструменты');
  html += '<div class="nav-label">Справка</div>' + link('#/glossary', '<span class="port">A</span>Глоссарий') + link('#/cheats', '<span class="port">#</span>Шпаргалки') + link('#/progress', '<span class="port">↓</span>Прогресс курса');
  html += `<div class="nav-label">Профиль</div><a href="${HUB}#/profile"><span class="port">★</span>Достижения</a>`;
  html += '</nav>';
  $('#side').innerHTML = html;
}

let examTimer = null;
function render(){
  clearInterval(examTimer);
  $('#side').classList.remove('open');
  renderSide(); renderStatus();
  const h = (location.hash || '#/').slice(1).split('/').filter(Boolean);
  const v = $('#view');
  const [r, a] = h;
  if (!r) v.innerHTML = viewHome();
  else if (r === 'm') v.innerHTML = viewModule(a);
  else if (r === 'l') { v.innerHTML = viewLesson(a); mountLesson(a); }
  else if (r === 't') { v.innerHTML = '<div id="testRoot"></div>'; startTest(a, h[2] === 'errors'); }
  else if (r === 'exam') { v.innerHTML = '<div id="testRoot"></div>'; viewExamIntro(); }
  else if (r === 'journey') { v.innerHTML = viewJourney(); mountJourney(); }
  else if (r === 'tools') { v.innerHTML = viewTools(); mountWidgets(v); Game.flag(COURSE.id + ':tools'); }
  else if (r === 'glossary') { v.innerHTML = viewGlossary(); mountGlossary(); }
  else if (r === 'cheats') v.innerHTML = viewCheats();
  else if (r === 'progress') { v.innerHTML = viewProgress(); mountProgress(); }
  else v.innerHTML = '<h1>Страница не найдена</h1><p><a href="#/">На главную</a></p>';
  rememberPlace(r, a);
  window.scrollTo(0, 0);
}
window.addEventListener('hashchange', render);

// Запоминаем, где остановились, чтобы на главной сайта была кнопка «Продолжить»
function rememberPlace(r, a){
  let title;
  if (r === 'l'){ const l = findLesson(a); if (l) title = l.title; }
  else if (r === 'm'){ const m = findModule(a); if (m) title = m.title; }
  else if (r === 't'){ const m = findModule(a); if (m) title = 'Тест: ' + m.title; }
  if (!title) return;
  Store.state.last = { course:COURSE.id, hash:location.hash, title, at:new Date().toISOString() };
  lsSet(LS_KEY, JSON.stringify(Store.state));
}

// ====== БАННЕРЫ ======
function banners(){
  let html = '';
  if (Store.newerFileData){
    html += `<div class="banner"><span>В привязанном файле прогресс новее, чем в браузере (${new Date(Store.newerFileData.savedAt).toLocaleString('ru-RU')}).</span><span class="row"><button class="btn" data-act="load-newer">Загрузить из файла</button><button class="btn ghost" data-act="skip-newer">Оставить текущий</button></span></div>`;
  }
  const last = lsGet(LS_BACKUP);
  const done = overall().done;
  const stale = !last ? done > 3 : (Date.now() - new Date(last)) > 7 * 864e5;
  if (Store.fileStatus !== 'ok' && stale){
    html += `<div class="banner"><span>Прогресс хранится только в этом браузере. Сохраните его в файл, чтобы не потерять.</span><a class="btn ghost" href="${HUB}#/data">Сохранить в файл</a></div>`;
  }
  const s = Game.streak();
  if (s.atRisk && s.current >= 2) html += `<div class="banner streak"><span>🔥 Серия ${s.current} ${plural(s.current, 'день', 'дня', 'дней')} подряд прервётся в полночь. Пройдите урок или ответьте на пару вопросов, чтобы её сохранить.</span></div>`;
  return html;
}
document.addEventListener('click', e => {
  const act = e.target.closest('[data-act]'); if (!act) return;
  const k = act.dataset.act;
  if (k === 'load-newer'){ Store.apply(Store.newerFileData, 'replace'); Store.newerFileData = null; toast('Прогресс загружен из файла.'); render(); }
  if (k === 'skip-newer'){ Store.newerFileData = null; Store.writeFile(); render(); }
});

// ====== ГЛАВНАЯ КУРСА ======
function viewHome(){
  const o = overall();
  const next = allLessons().find(l => !(P.state.lessons[l.id] && P.state.lessons[l.id].completed) && isUnlocked(l.module));
  const nextModTest = MODULES.find(m => isUnlocked(m) && !moduleStats(m).passed && moduleStats(m).done === m.lessons.length);
  const cont = nextModTest ? `#/t/${nextModTest.id}` : (next ? `#/l/${next.id}` : '#/exam');
  const contLbl = nextModTest ? `тест модуля «${nextModTest.title}»` : (next ? next.title : 'финальный экзамен');
  let html = banners() + `<section class="hero"><div class="crumbs"><a href="${HUB}">все курсы</a> / курс · ${MODULES.length + UPCOMING.length} модулей</div>
  <h1>${esc(COURSE.title)}</h1>
  <p>${esc(COURSE.tagline)}</p>
  <div class="stats"><div class="stat"><b>${o.pct}%</b><span>курса пройдено</span></div><div class="stat"><b>${o.done}/${o.lessons}</b><span>уроков</span></div><div class="stat"><b>${o.passed}/${MODULES.length}</b><span>тестов сдано</span></div></div>
  <div class="meter" aria-label="Прогресс"><i style="width:${o.pct}%"></i></div>
  <div class="row" style="margin-top:20px"><a class="btn" href="${cont}">${o.done ? 'Продолжить' : 'Начать обучение'} →</a><a class="btn ghost" href="#/journey">${esc(COURSE.journeyLabel)}</a><a class="btn ghost" href="#/tools">Инструменты</a></div>
  ${o.done ? `<p class="small" style="margin-top:10px">Дальше: ${esc(contLbl)}</p>` : ''}</section>
  <h2 style="margin-bottom:14px">Карта курса</h2><div class="mods">`;
  for (const m of allModsSorted()){
    if (m.soon){ html += `<a class="mod soon" href="#/m/${m.id}"><div class="num"><span>МОДУЛЬ ${String(m.id).padStart(2,'0')}</span><span class="tag muted">скоро</span></div><h3>${esc(m.title)}</h3><p>${esc(m.short)}</p></a>`; continue; }
    const s = moduleStats(m); const un = isUnlocked(m);
    const tag = s.passed ? `<span class="tag ok">тест ${s.test.bestScore}%</span>` : (un ? `<span class="tag">${s.done}/${s.total}</span>` : '<span class="tag muted">закрыт</span>');
    html += `<a class="mod ${un ? '' : 'locked'} ${s.passed ? 'passed' : ''}" href="#/m/${m.id}"><div class="num"><span>МОДУЛЬ ${String(m.id).padStart(2,'0')}</span>${tag}</div><h3>${esc(m.title)}</h3><p>${esc(m.short)}</p><div class="meter"><i style="width:${Math.round(s.done / s.total * 100)}%"></i></div></a>`;
  }
  return html + '</div>';
}

// ====== МОДУЛЬ ======
function viewModule(id){
  const up = UPCOMING.find(m => m.id === +id);
  if (up) return `<div class="crumbs"><a href="#/">главная</a> / модуль ${id}</div><h1>${esc(up.title)}</h1><p class="small" style="margin-top:8px">${esc(up.short)}</p><div class="note">Модуль в разработке и появится в следующем обновлении сайта.</div>`;
  const m = findModule(id); if (!m) return '<h1>Модуль не найден</h1>';
  const s = moduleStats(m); const un = isUnlocked(m);
  let html = `<div class="crumbs"><a href="#/">главная</a> / модуль ${String(m.id).padStart(2,'0')}</div><h1>${esc(m.title)}</h1><p class="small" style="margin:8px 0 20px">${esc(m.short)} · ${s.done} из ${s.total} уроков</p>`;
  if (!un) return html + `<div class="note warn">Модуль откроется после сдачи теста предыдущего модуля на ${PASS}% и выше. Блокировку можно отключить на странице <a href="#/progress">«Прогресс курса»</a>.</div>`;
  html += '<div class="list">';
  m.lessons.forEach((l, i) => {
    const d = P.state.lessons[l.id] && P.state.lessons[l.id].completed;
    html += `<a href="#/l/${l.id}"><span class="led ${d ? 'on' : ''}"></span><span class="port">${m.id}.${i + 1}</span><span class="grow">${esc(l.title)}</span>${d ? '<span class="tag ok">пройден</span>' : `<span class="tag muted">+${XP.lesson} XP</span>`}</a>`;
  });
  html += '</div><h2 style="margin:28px 0 10px">Тест модуля</h2>';
  html += `<p class="small">${m.test.length} вопросов, порог — ${PASS}%. За сдачу +${XP.test} XP, за 100% ещё +${XP.perfect} XP. ${s.test ? `Лучший результат: <b>${s.test.bestScore}%</b>, попыток: ${s.test.attempts}.` : 'Ещё не проходили.'}</p><div class="row"><a class="btn" href="#/t/${m.id}">${s.test ? 'Пройти снова' : 'Начать тест'}</a>${s.test && s.test.wrongQuestionIds.length ? `<a class="btn ghost" href="#/t/${m.id}/errors">Повторить ошибки (${s.test.wrongQuestionIds.length})</a>` : ''}</div>`;
  return html;
}

// ====== УРОК ======
function viewLesson(id){
  const l = findLesson(id); if (!l) return '<h1>Урок не найден</h1>';
  if (!isUnlocked(l.module)) return `<h1>${esc(l.title)}</h1><div class="note warn">Урок откроется после сдачи теста предыдущего модуля.</div>`;
  const ls = l.module.lessons; const i = ls.findIndex(x => x.id === id);
  const prev = ls[i - 1], next = ls[i + 1];
  const done = P.state.lessons[id] && P.state.lessons[id].completed;
  const extra = typeof readMore === 'function' ? readMore(l) : '';
  return `<div class="crumbs"><a href="#/">главная</a> / <a href="#/m/${l.module.id}">${esc(l.module.title.toLowerCase())}</a> / урок ${l.module.id}.${i + 1}</div>
  <h1>${esc(l.title)}</h1><div class="lesson-grid"><div style="min-width:0"><article class="prose" style="margin-top:18px">${l.html}${extra}</article>
  <h2 style="margin-top:34px" id="selfcheck">Самопроверка</h2><p class="small">+${XP.check} XP за каждый верный ответ.</p><div id="checkRoot"></div>
  <div class="row" style="margin-top:24px;justify-content:space-between">
   ${prev ? `<a class="btn ghost" href="#/l/${prev.id}">← ${esc(prev.title)}</a>` : '<span></span>'}
   <span class="row"><button class="btn ${done ? 'ghost' : ''}" id="doneBtn">${done ? '✓ Урок пройден' : `Отметить как пройденный · +${XP.lesson} XP`}</button>
   ${next ? `<a class="btn ghost" href="#/l/${next.id}">Далее →</a>` : `<a class="btn ghost" href="#/t/${l.module.id}">К тесту модуля →</a>`}</span></div></div>
  <aside class="toc"><div class="nav-label">Модуль ${l.module.id}</div>${ls.map((x, j) => `<a href="#/l/${x.id}" class="${x.id === id ? 'active' : ''}"><span class="led ${P.state.lessons[x.id] && P.state.lessons[x.id].completed ? 'on' : ''}" style="margin-top:7px"></span>${esc(x.title)}</a>`).join('')}<a href="#/t/${l.module.id}"><span class="port">✓</span>Тест модуля</a><div class="nav-label" style="margin-top:12px">На странице</div><div id="tocSecs"></div></aside></div>`;
}
function mountLesson(id){
  const l = findLesson(id); if (!l || !isUnlocked(l.module)) return;
  mountWidgets($('#view'));
  const secs = [...document.querySelectorAll('.prose h3'), $('#selfcheck')];
  $('#tocSecs').innerHTML = secs.map((h, i) => { h.id = h.id || 'sec' + i; return `<a class="sub" href="javascript:void 0" data-sec="${h.id}">${esc(h.textContent)}</a>`; }).join('');
  $('#tocSecs').onclick = e => { const t = e.target.closest('[data-sec]'); if (t) document.getElementById(t.dataset.sec).scrollIntoView({ behavior:'smooth' }); };
  const root = $('#checkRoot');
  l.check.forEach((q, i) => { const c = document.createElement('div'); root.appendChild(c); mountQuestion(c, q, i + 1, l.check.length, 'instant'); });
  $('#doneBtn').onclick = e => {
    const d = P.state.lessons[id] && P.state.lessons[id].completed;
    if (d) delete P.state.lessons[id]; else P.state.lessons[id] = { completed:true, completedAt:new Date().toISOString() };
    const gained = Game.track(() => Store.save(), e.currentTarget);
    render();
    if (!d) toast(gained ? `Урок пройден: +${gained} XP` : 'Урок отмечен как пройденный.');
  };
}

// ====== ВОПРОСЫ ======
function mountQuestion(el, q, n, total, mode){
  const st = { q, el, answered:false };
  const typeLbl = { single:'один ответ', multiple:'несколько ответов', order:'порядок', match:'сопоставление', input:'ввод ответа', analyze:'анализ вывода' }[q.type];
  const name = 'q_' + q.id + '_' + Math.random().toString(36).slice(2, 7);
  let body = '';
  if (q.type === 'single' || q.type === 'analyze' || q.type === 'multiple'){
    st.perm = shuffle(q.options.map((_, i) => i));
    const t = q.type === 'multiple' ? 'checkbox' : 'radio';
    body = st.perm.map(i => `<label class="opt" data-i="${i}"><input type="${t}" name="${name}" value="${i}"><span>${esc(q.options[i])}</span></label>`).join('');
  } else if (q.type === 'order'){
    st.cur = shuffle(q.options.map((_, i) => i));
    if (st.cur.every((v, i) => v === i) && st.cur.length > 1) st.cur.reverse();
    body = '<div class="ordlist"></div>';
  } else if (q.type === 'match'){
    st.right = shuffle(q.pairs.map((_, i) => i));
    body = q.pairs.map((p, i) => `<div class="mrow" data-i="${i}"><span class="l">${esc(p[0])}</span><select id="${name}_${i}" aria-label="${esc(p[0])}"><option value="">— выберите —</option>${st.right.map(j => `<option value="${j}">${esc(q.pairs[j][1])}</option>`).join('')}</select></div>`).join('');
  } else if (q.type === 'input'){
    body = `<input type="text" id="${name}" placeholder="Ваш ответ" autocomplete="off" style="width:100%;max-width:320px;font-family:var(--f-mono)">`;
  }
  el.className = 'q';
  el.innerHTML = `<div class="qh"><span>ВОПРОС ${n}/${total}</span><span>${typeLbl}</span></div><p class="qp">${esc(q.prompt)}</p>${q.code ? `<pre><code>${esc(q.code)}</code></pre>` : ''}<div class="qb">${body}</div>${mode === 'instant' ? '<div class="row" style="margin-top:12px"><button class="btn ghost chk">Проверить</button></div>' : ''}<div class="fbw"></div>`;
  if (q.type === 'order') renderOrder(st);
  if (mode === 'instant') el.querySelector('.chk').onclick = () => { if (!hasResponse(st)){ toast('Сначала выберите ответ.'); return; } const ok = grade(st); showFeedback(st, ok); el.querySelector('.chk').disabled = true; if (ok) awardCheck(q, el.querySelector('.chk')); };
  return st;
}
// Верный ответ в самопроверке урока: +XP один раз за вопрос
function awardCheck(q, anchor){
  const c = P.state; if (!c.checks) c.checks = {};
  if (c.checks[q.id]) return;
  c.checks[q.id] = new Date().toISOString();
  Game.track(() => Store.save(), anchor);
}
function renderOrder(st){
  const box = st.el.querySelector('.ordlist');
  box.innerHTML = st.cur.map((i, pos) => `<div class="ord" data-i="${i}"><span class="port">${pos + 1}.</span><span class="t">${esc(st.q.options[i])}</span><button aria-label="Выше" data-d="-1" ${pos === 0 || st.answered ? 'disabled' : ''}>↑</button><button aria-label="Ниже" data-d="1" ${pos === st.cur.length - 1 || st.answered ? 'disabled' : ''}>↓</button></div>`).join('');
  box.querySelectorAll('button').forEach(b => b.onclick = () => {
    const pos = [...box.children].indexOf(b.closest('.ord')); const to = pos + +b.dataset.d;
    [st.cur[pos], st.cur[to]] = [st.cur[to], st.cur[pos]]; renderOrder(st);
  });
}
function response(st){
  const q = st.q, el = st.el;
  if (q.type === 'single' || q.type === 'analyze'){ const c = el.querySelector('input:checked'); return c ? +c.value : null; }
  if (q.type === 'multiple') return [...el.querySelectorAll('input:checked')].map(x => +x.value);
  if (q.type === 'order') return st.cur.slice();
  if (q.type === 'match') return [...el.querySelectorAll('select')].map(s => s.value === '' ? null : +s.value);
  if (q.type === 'input') return el.querySelector('input').value;
}
function hasResponse(st){
  const r = response(st);
  if (st.q.type === 'multiple') return r.length > 0;
  if (st.q.type === 'match') return r.some(x => x !== null);
  if (st.q.type === 'input') return r.trim() !== '';
  return r !== null;
}
const norm = s => String(s).trim().toLowerCase().replace(/\s+/g, '').replace(',', '.');
function grade(st){
  const q = st.q, r = response(st);
  switch (q.type){
    case 'single': case 'analyze': return r === q.answer;
    case 'multiple': return r.length === q.answer.length && q.answer.every(a => r.includes(a));
    case 'order': return r.every((v, i) => v === q.answer[i]);
    case 'match': return r.every((v, i) => v === i);
    case 'input': return q.answer.some(a => norm(a) === norm(r));
  }
}
function showFeedback(st, ok){
  st.answered = true; const q = st.q, el = st.el;
  el.querySelectorAll('input,select').forEach(x => x.disabled = true);
  if (q.type === 'single' || q.type === 'analyze' || q.type === 'multiple'){
    const right = Array.isArray(q.answer) ? q.answer : [q.answer];
    el.querySelectorAll('.opt').forEach(o => {
      const i = +o.dataset.i; const chosen = o.querySelector('input').checked;
      if (right.includes(i)) o.classList.add('right'); else if (chosen) o.classList.add('wrong');
    });
  }
  if (q.type === 'order'){ renderOrder(st); el.querySelectorAll('.ord').forEach((o, pos) => o.classList.add(+o.dataset.i === q.answer[pos] ? 'right' : 'wrong')); }
  if (q.type === 'match') el.querySelectorAll('.mrow select').forEach((s, i) => { s.style.borderColor = +s.value === i && s.value !== '' ? 'var(--ok)' : 'var(--bad)'; });
  let correct = '';
  if (!ok){
    if (q.type === 'order') correct = 'Правильный порядок: ' + q.answer.map(i => q.options[i]).join(' → ');
    if (q.type === 'match') correct = 'Правильно: ' + q.pairs.map(p => p[0] + ' — ' + p[1]).join('; ');
    if (q.type === 'input') correct = 'Правильный ответ: ' + q.answer[0];
  }
  const lesson = q.lessonId || (q.id.startsWith('q') ? null : null);
  el.querySelector('.fbw').innerHTML = `<div class="fb ${ok ? 'ok' : 'bad'}"><b>${ok ? 'Верно.' : 'Неверно.'}</b>${correct ? esc(correct) + '<br>' : ''}${esc(q.explanation)}${lesson ? ` <a href="#/l/${lesson}">Перечитать урок</a>` : ''}</div>`;
}

// ====== ТЕСТ МОДУЛЯ / ЭКЗАМЕН ======
function startTest(id, errorsOnly){
  const m = findModule(id); const root = $('#testRoot');
  if (!m){ root.innerHTML = '<h1>Тест не найден</h1>'; return; }
  if (!isUnlocked(m)){ root.innerHTML = `<h1>Тест: ${esc(m.title)}</h1><div class="note warn">Тест откроется после сдачи предыдущего модуля.</div>`; return; }
  let qs = m.test.map(q => ({ ...q, lessonId: q.lessonId || guessLesson(m, q) }));
  const rec = P.state.tests['m' + m.id];
  if (errorsOnly && rec) qs = qs.filter(q => rec.wrongQuestionIds.includes(q.id));
  if (!qs.length){ location.hash = '#/m/' + m.id; return; }
  runQuiz(root, shuffle(qs), {
    title: (errorsOnly ? 'Работа над ошибками: ' : 'Тест: ') + m.title,
    crumbs: `<a href="#/">главная</a> / <a href="#/m/${m.id}">${esc(m.title.toLowerCase())}</a> / тест`,
    onFinish: (score, wrong) => {
      const key = 'm' + m.id; const old = P.state.tests[key];
      const wasPassed = old && old.bestScore >= PASS;
      if (errorsOnly){
        // работа над ошибками не меняет оценку, только список ошибок
        if (old){ old.wrongQuestionIds = old.wrongQuestionIds.filter(x => wrong.includes(x)); Store.save(); }
        if (!wrong.length) Game.flag('errors-fixed');
        return { msg: wrong.length ? `Осталось ошибок: ${wrong.length}.` : 'Все ошибки исправлены!', back:`#/m/${m.id}` };
      }
      P.state.tests[key] = { bestScore: Math.max(score, old ? old.bestScore : 0), attempts:(old ? old.attempts : 0) + 1, lastScore:score, lastAttemptAt:new Date().toISOString(), wrongQuestionIds:wrong };
      Store.save();
      const nm = MODULES[MODULES.indexOf(m) + 1];
      const msg = score >= PASS ? (wasPassed ? 'Тест сдан.' : 'Тест сдан! ' + (nm ? `Открыт модуль «${nm.title}».` : '')) : `Нужно ${PASS}% для сдачи. Перечитайте уроки по ссылкам в разборе и попробуйте снова.`;
      return { msg, back:`#/m/${m.id}`, next: score >= PASS && nm ? `#/m/${nm.id}` : null, errors: wrong.length ? `#/t/${m.id}/errors` : null };
    }
  });
}
function guessLesson(m, q){ return m.lessons[Math.min(m.lessons.length - 1, Math.floor(m.test.indexOf(q) / Math.ceil(m.test.length / m.lessons.length)))].id; }

function viewExamIntro(){
  const root = $('#testRoot'); const fe = P.state.finalExam;
  const pool = MODULES.flatMap(m => [...m.test.map(q => ({ ...q, lessonId: guessLesson(m, q) })), ...m.lessons.flatMap(l => l.check.map(q => ({ ...q, lessonId:l.id })))]);
  const n = Math.min(40, pool.length);
  root.innerHTML = `<div class="crumbs"><a href="#/">главная</a> / экзамен</div><h1>Финальный экзамен</h1>
  <p style="margin-top:10px">${n} случайных вопросов из всех открытых модулей, 60 минут. Порог — ${PASS}%. Всего в банке ${pool.length} вопросов.</p>
  ${fe ? `<p class="small">Лучший результат: <b>${fe.bestScore}%</b>, попыток: ${fe.attempts}.</p>` : ''}
  <button class="btn" id="examGo">Начать экзамен</button>`;
  $('#examGo').onclick = () => {
    const qs = shuffle(pool).slice(0, n);
    const started = Date.now(), deadline = started + 60 * 60 * 1000;
    runQuiz(root, qs, { title:'Финальный экзамен', crumbs:'<a href="#/">главная</a> / экзамен', deadline,
      onFinish: (score) => {
        const o = P.state.finalExam;
        P.state.finalExam = { bestScore:Math.max(score, o ? o.bestScore : 0), attempts:(o ? o.attempts : 0) + 1, lastAttemptAt:new Date().toISOString() };
        Store.save();
        if (score >= PASS && Date.now() - started < 20 * 60 * 1000) Store.state.game.flags['exam-fast'] = true;
        return { msg: score >= PASS ? 'Экзамен сдан. Отличная работа!' : 'Экзамен пока не сдан. Разбор ошибок ниже.', back:'#/exam' };
      } });
  };
}

function runQuiz(root, qs, opts){
  root.innerHTML = `<div class="crumbs">${opts.crumbs}</div><div class="row" style="justify-content:space-between"><h1>${esc(opts.title)}</h1>${opts.deadline ? '<span class="timer" id="timer"></span>' : ''}</div><p class="small" style="margin-top:6px">${qs.length} вопросов. Ответы проверяются после нажатия «Завершить».</p><div id="qs"></div><div class="row" style="margin-top:20px"><button class="btn" id="finish">Завершить тест</button><span class="small" id="answeredCnt"></span></div>`;
  const box = $('#qs');
  const states = qs.map((q, i) => { const c = document.createElement('div'); box.appendChild(c); return mountQuestion(c, q, i + 1, qs.length, 'test'); });
  const upd = () => { const a = states.filter(hasResponse).length; $('#answeredCnt').textContent = `Отвечено ${a} из ${qs.length}`; };
  box.addEventListener('change', upd); box.addEventListener('input', upd); box.addEventListener('click', upd); upd();
  let finished = false;
  const finish = () => {
    if (finished) return; finished = true; clearInterval(examTimer);
    let ok = 0; const wrong = [];
    states.forEach(st => { const g = grade(st); showFeedback(st, g); if (g) ok++; else wrong.push(st.q.id); });
    const score = Math.round(ok / qs.length * 100);
    let res;
    const gained = Game.track(() => { res = opts.onFinish(score, wrong); }, $('#finish'));
    $('#finish').remove(); $('#answeredCnt').remove();
    if (score >= PASS) confetti(score === 100 ? 120 : 50);
    const head = document.createElement('div'); head.className = 'result';
    head.innerHTML = `<div class="big" style="color:${score >= PASS ? 'var(--ok)' : 'var(--bad)'}">${score}%</div><p>${ok} из ${qs.length} верно. ${esc(res.msg)}</p>${gained ? `<p class="xp-gain">+${gained} XP</p>` : ''}<div class="row" style="justify-content:center">${res.errors ? `<a class="btn" href="${res.errors}">Повторить только ошибки</a>` : ''}${res.next ? `<a class="btn" href="${res.next}">Следующий модуль →</a>` : ''}<a class="btn ghost" href="${res.back}">Назад</a></div>`;
    box.before(head);
    const h2 = document.createElement('h2'); h2.textContent = 'Разбор ответов'; h2.style.marginTop = '10px'; box.before(h2);
    renderSide(); window.scrollTo(0, 0);
  };
  $('#finish').onclick = () => {
    const un = states.length - states.filter(hasResponse).length;
    if (un && !$('#finishConfirm')){
      const c = document.createElement('div'); c.id = 'finishConfirm'; c.className = 'confirm';
      c.innerHTML = `Без ответа осталось ${un} вопр. Они будут засчитаны как неверные. <button class="btn danger" style="margin-left:8px">Всё равно завершить</button>`;
      c.querySelector('button').onclick = finish; $('#finish').parentElement.after(c); return;
    }
    finish();
  };
  if (opts.deadline){
    const tick = () => { const left = Math.max(0, opts.deadline - Date.now()); const mm = Math.floor(left / 60000), ss = Math.floor(left % 60000 / 1000); const t = $('#timer'); if (t) t.textContent = `${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}`; if (!left){ toast('Время вышло.'); finish(); } };
    tick(); examTimer = setInterval(tick, 1000);
  }
}

// ====== ВИДЖЕТЫ ======
function mountWidgets(scope){
  scope.querySelectorAll('[data-widget]').forEach(el => { const w = WIDGETS[el.dataset.widget]; if (w) w(el); });
}
// ====== ГЛОССАРИЙ ======
function viewGlossary(){
  return `<div class="crumbs"><a href="#/">главная</a> / глоссарий</div><h1>Глоссарий</h1><input type="text" id="glq" placeholder="Поиск термина" style="width:100%;max-width:400px;margin:16px 0" aria-label="Поиск"><div id="gl"></div>`;
}
function mountGlossary(){
  const draw = () => {
    const s = $('#glq').value.trim().toLowerCase();
    const items = GLOSSARY.filter(g => !s || (g[0] + ' ' + g[1]).toLowerCase().includes(s)).sort((a, b) => a[0].localeCompare(b[0], 'ru'));
    $('#gl').innerHTML = items.map(g => `<div class="gl-item"><b>${esc(g[0])}</b> — ${esc(g[1])} <a href="#/l/${g[2]}" class="small">урок ${g[2].replace('-', '.')}</a></div>`).join('') || '<p class="small">Ничего не найдено.</p>';
  };
  $('#glq').oninput = draw; draw();
}

// ====== ПРОГРЕСС КУРСА ======
let confirmReset = false;
function viewProgress(){
  const o = overall();
  const xp = Object.entries(Store.state.game.awarded).filter(([k]) => k.startsWith(COURSE.id + ':')).reduce((a, [, v]) => a + v.xp, 0);
  return `<div class="crumbs"><a href="#/">главная</a> / прогресс</div><h1>Прогресс курса</h1>
  <div class="stats"><div class="stat"><b>${o.pct}%</b><span>курса</span></div><div class="stat"><b>${o.done}/${o.lessons}</b><span>уроков</span></div><div class="stat"><b>${o.passed}/${MODULES.length}</b><span>тестов</span></div><div class="stat"><b>${P.state.finalExam ? P.state.finalExam.bestScore + '%' : '—'}</b><span>экзамен</span></div><div class="stat"><b>${xp}</b><span>XP в курсе</span></div></div>
  <p class="small">Прогресс всех курсов хранится вместе. Сохранить его в файл, перенести на другой компьютер или загрузить копию можно на странице <a href="${HUB}#/data">«Данные»</a>.</p>
  <h2 style="margin-top:28px">Результаты тестов</h2>
  <div class="tbl"><table><tr><th>Модуль</th><th>Лучший</th><th>Последний</th><th>Попыток</th></tr>${MODULES.map(m => { const t = P.state.tests['m' + m.id]; return `<tr><td>${m.id}. ${esc(m.title)}</td><td>${t ? t.bestScore + '%' : '—'}</td><td>${t ? t.lastScore + '%' : '—'}</td><td>${t ? t.attempts : 0}</td></tr>`; }).join('')}</table></div>
  <h2 style="margin-top:28px">Настройки</h2>
  <label class="opt" style="max-width:520px"><input type="checkbox" id="unlockAll" ${P.state.unlockAll ? 'checked' : ''}><span>Открыть все модули без сдачи тестов</span></label>
  <h2 style="margin-top:28px">Сброс</h2>
  <button class="btn danger" id="resetBtn">Сбросить прогресс этого курса</button>
  ${confirmReset ? `<div class="confirm">Уроки и результаты тестов этого курса будут удалены. Полученные XP и достижения останутся.<div class="row" style="margin-top:10px"><button class="btn ghost" id="resetExport">Скачать копию</button><button class="btn danger" id="resetYes">Да, сбросить</button><button class="btn ghost" id="resetNo">Отмена</button></div></div>` : ''}`;
}
function mountProgress(){
  const on = (id, fn) => { const e = document.getElementById(id); if (e) e.onclick = fn; };
  const u = $('#unlockAll'); if (u) u.onchange = () => { P.state.unlockAll = u.checked; Store.save(); renderSide(); };
  on('resetBtn', () => { confirmReset = true; render(); });
  on('resetNo', () => { confirmReset = false; render(); });
  on('resetExport', () => Store.exportFile());
  on('resetYes', () => { confirmReset = false; Store.reset(COURSE.id); toast('Прогресс курса сброшен.'); render(); });
}

// ====== СТАРТ ======
Store.load(); applyTheme();
{
  // Каталог на главной сайта считает проценты по этим числам, не загружая контент курса
  const meta = { lessons:allLessons().length, modules:MODULES.length }; const cur = P.state.meta;
  if (!cur || cur.lessons !== meta.lessons || cur.modules !== meta.modules){ P.state.meta = meta; Store.save('game'); }
}
Game.sync(true);
render(); Store.restoreHandle();
Store.onChange(kind => {
  if (kind === 'external'){ renderSide(); renderStatus(); return; }
  renderStatus();
  // restoreHandle нашёл более свежий файл — показываем баннер, если пользователь на главной курса
  if (Store.newerFileData && (location.hash || '#/') === '#/' && !document.querySelector('[data-act="load-newer"]')) render();
});
