// Код, специфичный для курса «DevOps»: настройки, учебный терминал, виджеты, сквозной сценарий, шпаргалки.
import { $, esc } from '../../assets/js/storage.js';
import { Game } from '../../assets/js/game.js';
import { findLesson } from '../../assets/js/engine.js';
import { createLab } from './lab-engine.js';
import { LABS } from './labs.js';
import { DRILLS, newDrillLab, drillPassed } from './trainer.js';
import { sandboxDef, newSandbox, cleanLine, runnable } from './sandbox.js';
export const COURSE = {
  id: 'devops',
  title: 'От DevOps к Systems Engineering и SRE',
  tagline: 'Программа на 90 дней для тех, кто хочет понимать инфраструктуру и самостоятельно расследовать неисправности: Linux, сети, Nginx, JVM, Docker, PostgreSQL, мониторинг, логи, автоматизация и надёжность. Вся теория и практика — прямо здесь: 20 лабораторий во встроенном терминале и итоговый проект.',
  journeyLabel: 'Путь запроса и где он ломается',
  brand: '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><path d="M3 13c0-3 2-5 4.5-5S11 10 13 13s3.5 5 5.5 5S23 16 23 13s-2-5-4.5-5S15 10 13 13s-3.5 5-5.5 5S3 16 3 13z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="7.5" cy="13" r="2" fill="var(--accent)"/><circle cx="18.5" cy="13" r="2" fill="var(--accent)"/></svg>'
};

// ====== УЧЕБНЫЙ ТЕРМИНАЛ ======
const LAB_KEY = id => 'devops-lab:' + id;
function labLoad(id){ try { return JSON.parse(localStorage.getItem(LAB_KEY(id))) || []; } catch (e){ return []; } }
function labStore(id, log){ try { localStorage.setItem(LAB_KEY(id), JSON.stringify(log)); } catch (e){ /* прогресс лабы просто не сохранится */ } }
function mountLab(el, id){
  const def = LABS[id];
  el.className = 'widget lab';
  const history = [];
  let histPos = 0, lab, editing = null;
  const prompt = () => `student@${def.host || 'lab'}:${lab.cwd.replace(/^\/home\/student/, '~')}$`;
  el.innerHTML = `<div class="lab-head"><b>🖥 Лаборатория: ${esc(def.title)}</b><p>${esc(def.intro)}</p></div><ol class="lab-tasks"></ol>
    <div class="lab-term" role="log" aria-live="polite"><div class="lab-out"></div><div class="lab-line"><span></span><input type="text" aria-label="Команда" autocomplete="off" autocapitalize="off" spellcheck="false"></div></div>
    <div class="lab-edit" hidden><p class="small lab-edit-name"></p><textarea spellcheck="false" aria-label="Содержимое файла"></textarea><div class="row" style="margin-top:8px"><button class="btn" data-a="save">Сохранить</button><button class="btn ghost" data-a="cancel">Отмена</button></div></div>
    <div class="lab-foot"><button class="btn ghost" data-a="hint">Подсказка</button><button class="btn ghost" data-a="reset">Сначала</button><span class="small lab-count"></span></div>`;
  const out = el.querySelector('.lab-out'), term = el.querySelector('.lab-term'), input = el.querySelector('.lab-line input'), pr = el.querySelector('.lab-line span');
  const box = el.querySelector('.lab-edit'), area = box.querySelector('textarea');
  const print = (text, cls = '') => { if (!text) return; const p = document.createElement('pre'); p.className = cls; p.textContent = text; out.appendChild(p); };
  const scroll = () => { term.scrollTop = term.scrollHeight; };
  const drawTasks = () => {
    el.querySelector('.lab-tasks').innerHTML = def.tasks.map((t, i) => `<li class="${i < lab.step ? 'ok' : i === lab.step ? 'cur' : ''}"><span>${i < lab.step ? '✓' : i === lab.step ? '▸' : '○'}</span><span>${esc(t.t)}</span></li>`).join('');
    el.querySelector('.lab-count').textContent = lab.finished ? 'Лаборатория пройдена. Повторите её без подсказок.' : `Задание ${lab.step + 1} из ${def.tasks.length}`;
    pr.textContent = prompt();
  };
  const report = done => {
    for (const t of done) print('✓ Задание выполнено.' + (t.why ? ' ' + t.why : ''), 'good');
    if (done.length && lab.finished){ print('🎉 Все задания выполнены!', 'good'); Game.flag('devops:lab:' + id); }
    if (done.length) drawTasks();
  };
  const start = () => {
    lab = createLab(def); out.innerHTML = ''; editing = null; box.hidden = true;
    print('Введите help — справка, tasks — задания, hint — подсказка.', 'info');
    const saved = labLoad(id);
    if (saved.length){ lab.replay(saved); print('Прогресс восстановлен: стенд в том состоянии, в каком вы его оставили.', 'info'); }
    drawTasks();
  };
  const exec = line => {
    print(prompt() + ' ' + line, 'cmd');
    const r = lab.run(line);
    labStore(id, lab.state.log);
    if (r.clear) out.innerHTML = '';
    print(r.out);
    if (r.edit){ editing = r.edit.path; box.querySelector('.lab-edit-name').textContent = 'Редактор: ' + editing; area.value = r.edit.content; box.hidden = false; area.focus(); }
    report(r.done);
    pr.textContent = prompt();
    scroll();
  };
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter'){ const v = input.value; input.value = ''; if (v.trim()){ history.push(v); histPos = history.length; exec(v); } }
    else if (e.key === 'ArrowUp' && histPos > 0){ input.value = history[--histPos]; e.preventDefault(); }
    else if (e.key === 'ArrowDown'){ histPos = Math.min(history.length, histPos + 1); input.value = history[histPos] || ''; e.preventDefault(); }
  });
  // Клик по терминалу ставит курсор в поле ввода, но не мешает выделять текст
  term.addEventListener('click', () => { if (!String(window.getSelection())) input.focus({ preventScroll:true }); });
  el.addEventListener('click', e => {
    const a = e.target.closest('[data-a]'); if (!a) return;
    const k = a.dataset.a;
    if (k === 'hint') exec('hint');
    if (k === 'reset'){ labStore(id, []); start(); }
    if (k === 'cancel'){ box.hidden = true; editing = null; input.focus({ preventScroll:true }); }
    if (k === 'save'){ const done = lab.save(editing, area.value); labStore(id, lab.state.log); print('Файл сохранён: ' + editing, 'info'); box.hidden = true; editing = null; report(done); scroll(); input.focus({ preventScroll:true }); }
  });
  start();
}

// ====== ПЕСОЧНИЦА УРОКА ======
// Кнопки ▶ у команд в теории запускают их здесь же: терминал переезжает под блок, из которого нажали
const INLINE_SKIP = new Set(['id', 'date', 'help', 'tasks', 'hint', 'clear', 'top', 'mount']);
function mountSandbox(el){
  const def = sandboxDef((el.dataset.labs || '').split(',').filter(Boolean));
  const prose = el.closest('.prose');
  let lab = newSandbox(def);
  el.className = 'widget lab sandbox';
  el.innerHTML = `<div class="lab-head"><b>🖥 Терминал урока</b><p>Нажимайте ▶ у команд в тексте или вводите свои. Это учебный стенд, ничего не сломается.</p></div>
    <div class="lab-term" role="log" aria-live="polite"><div class="lab-out"></div><div class="lab-line"><span></span><input type="text" aria-label="Команда" autocomplete="off" autocapitalize="off" spellcheck="false"></div></div>
    <div class="lab-foot"><button class="btn ghost" data-a="reset">Сбросить стенд</button></div>`;
  const out = el.querySelector('.lab-out'), term = el.querySelector('.lab-term'), input = el.querySelector('input'), pr = el.querySelector('.lab-line span');
  const prompt = () => `student@sandbox:${lab.cwd.replace(/^\/home\/student/, '~')}$`;
  const print = (t, c = '') => { if (!t) return; const p = document.createElement('pre'); p.className = c; p.textContent = t; out.appendChild(p); };
  const exec = line => {
    print(prompt() + ' ' + line, 'cmd');
    const r = lab.run(line);
    if (r.clear) out.innerHTML = '';
    print(r.out);
    if (r.edit) print('В терминале урока редактора нет: меняйте файлы через sed и echo. Редактор есть в лабораториях.', 'info');
    pr.textContent = prompt();
    term.scrollTop = term.scrollHeight;
  };
  const history = []; let histPos = 0;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter'){ const v = input.value; input.value = ''; if (v.trim()){ history.push(v); histPos = history.length; exec(v); } }
    else if (e.key === 'ArrowUp' && histPos > 0){ input.value = history[--histPos]; e.preventDefault(); }
    else if (e.key === 'ArrowDown'){ histPos = Math.min(history.length, histPos + 1); input.value = history[histPos] || ''; e.preventDefault(); }
  });
  term.addEventListener('click', () => { if (!String(window.getSelection())) input.focus({ preventScroll:true }); });
  el.querySelector('[data-a=reset]').onclick = () => { lab = newSandbox(def); out.innerHTML = ''; pr.textContent = prompt(); };
  pr.textContent = prompt();
  if (!prose) return;
  const runFrom = (cmd, anchor) => {
    anchor.after(el);
    exec(cmd);
    el.scrollIntoView({ block:'nearest', behavior:'smooth' });
  };
  for (const pre of prose.querySelectorAll('pre')){
    if (pre.closest('.widget')) continue;
    const code = pre.querySelector('code') || pre;
    code.innerHTML = code.textContent.split('\n').map(raw => {
      const cmd = cleanLine(raw);
      return runnable(def, cmd) ? `<button class="run-line" data-cmd="${esc(cmd)}" title="Выполнить в терминале" aria-label="Выполнить: ${esc(cmd)}">▶</button>${esc(raw)}` : esc(raw);
    }).join('\n');
    code.addEventListener('click', e => { const b = e.target.closest('.run-line'); if (b) runFrom(b.dataset.cmd, pre); });
  }
  for (const c of prose.querySelectorAll('code')){
    if (c.closest('pre, .widget, a')) continue;
    const cmd = c.textContent.trim();
    if (INLINE_SKIP.has(cmd) || !/^[a-z]/.test(cmd) || !runnable(def, cmd) || !lab.dry(cmd)) continue;
    const b = document.createElement('button');
    b.className = 'run-inline'; b.textContent = '▶'; b.title = 'Выполнить в терминале'; b.setAttribute('aria-label', 'Выполнить: ' + cmd);
    b.onclick = () => runFrom(cmd, c.closest('.tbl, p, ul, ol, .note') || c);
    c.after(b);
  }
}

// ====== ТРЕНАЖЁР ТЕРМИНАЛА ======
const TRAINER_KEY = 'devops-trainer';
function mountTrainer(el){
  el.className = 'widget lab';
  const all = DRILLS.flatMap(d => d.items.map(x => ({ ...x, level: d.level })));
  let solved = [];
  try { solved = JSON.parse(localStorage.getItem(TRAINER_KEY)) || []; } catch (e){ /* начнём с нуля */ }
  const id = ex => all.indexOf(ex);
  let cur = all.find(x => !solved.includes(id(x))) || all[0], lab, passed = false;
  const history = []; let histPos = 0;
  el.innerHTML = `<div class="lab-head"><b>⌨ Тренажёр терминала Linux</b><p>Подходит любая верная команда: проверяется результат. Стенд перед каждым упражнением возвращается в исходное состояние.</p></div>
    <div class="lab-foot lab-levels"></div><p class="lab-task"></p>
    <div class="lab-term" role="log" aria-live="polite"><div class="lab-out"></div><div class="lab-line"><span></span><input type="text" aria-label="Команда" autocomplete="off" autocapitalize="off" spellcheck="false"></div></div>
    <div class="lab-foot"><button class="btn" data-a="next">Дальше →</button><button class="btn ghost" data-a="hint">Подсказка</button><button class="btn ghost" data-a="random">Случайное</button><button class="btn ghost" data-a="reset">Сбросить прогресс</button><span class="small lab-count"></span></div>`;
  const out = el.querySelector('.lab-out'), term = el.querySelector('.lab-term'), input = el.querySelector('input'), pr = el.querySelector('.lab-line span');
  const print = (t, c = '') => { if (!t) return; const p = document.createElement('pre'); p.className = c; p.textContent = t; out.appendChild(p); term.scrollTop = term.scrollHeight; };
  const prompt = () => `student@trainer:${lab.cwd.replace(/^\/home\/student/, '~')}$`;
  const draw = () => {
    el.querySelector('.lab-levels').innerHTML = DRILLS.map((d, i) => { const n = d.items.filter(x => solved.includes(all.findIndex(a => a.t === x.t))).length; return `<button class="btn ${cur.level === d.level ? '' : 'ghost'}" data-l="${i}">${esc(d.level)} ${n}/${d.items.length}</button>`; }).join('');
    el.querySelector('.lab-task').innerHTML = `<b>${esc(cur.level)}.</b> ${esc(cur.t)}${solved.includes(id(cur)) ? ' <span class="tag ok">решено</span>' : ''}`;
    el.querySelector('.lab-count').textContent = `Решено ${solved.length} из ${all.length}`;
    pr.textContent = prompt();
  };
  const open = ex => { cur = ex; lab = newDrillLab(); passed = false; out.innerHTML = ''; draw(); };
  const next = () => { const i = id(cur); open(all.slice(i + 1).concat(all.slice(0, i + 1)).find(x => !solved.includes(id(x))) || all[(i + 1) % all.length]); };
  const exec = line => {
    print(prompt() + ' ' + line, 'cmd');
    const r = lab.run(line);
    if (r.clear) out.innerHTML = '';
    print(r.out);
    if (r.edit) print('Редактор в тренажёре недоступен: используйте echo, sed и перенаправление.', 'info');
    if (!passed && drillPassed(cur, lab, r.out)){
      passed = true;
      if (!solved.includes(id(cur))){ solved.push(id(cur)); try { localStorage.setItem(TRAINER_KEY, JSON.stringify(solved)); } catch (e){ /* прогресс не сохранится */ } }
      if (solved.length === all.length) Game.flag('devops:trainer');
      print('✓ Верно! Нажмите Enter на пустой строке или «Дальше».', 'good');
    }
    draw();
  };
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter'){ const v = input.value; input.value = ''; if (v.trim()){ history.push(v); histPos = history.length; exec(v); } else if (passed) next(); }
    else if (e.key === 'ArrowUp' && histPos > 0){ input.value = history[--histPos]; e.preventDefault(); }
    else if (e.key === 'ArrowDown'){ histPos = Math.min(history.length, histPos + 1); input.value = history[histPos] || ''; e.preventDefault(); }
  });
  term.addEventListener('click', () => { if (!String(window.getSelection())) input.focus({ preventScroll:true }); });
  el.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.l !== undefined) open(all.find(x => x.level === DRILLS[+b.dataset.l].level));
    else if (b.dataset.a === 'next') next();
    else if (b.dataset.a === 'hint') print('Подсказка: ' + cur.sol, 'info');
    else if (b.dataset.a === 'random') open(all[Math.floor(Math.random() * all.length)]);
    else if (b.dataset.a === 'reset'){ solved = []; try { localStorage.removeItem(TRAINER_KEY); } catch (err){ /* нечего сбрасывать */ } open(all[0]); }
  });
  open(cur);
}

export const WIDGETS = {
  trainer: mountTrainer,
  sandbox: mountSandbox,
  ...Object.fromEntries(Object.keys(LABS).map(id => [id, el => mountLab(el, id)])),
  slo(el){
    el.className = 'widget';
    const id = 'slo' + Math.random().toString(36).slice(2, 6);
    el.innerHTML = `<div class="row"><label class="small" for="${id}">SLO, %</label><input type="text" id="${id}" value="99.9" style="font-family:var(--f-mono);max-width:120px" autocomplete="off"><label class="small" for="${id}r">запросов в месяц</label><input type="text" id="${id}r" value="10000000" style="font-family:var(--f-mono);max-width:160px" autocomplete="off"></div><div class="out"></div>`;
    const a = el.querySelector('#' + id), r = el.querySelector('#' + id + 'r'), out = el.querySelector('.out');
    const fmt = min => min >= 1440 ? (min / 1440).toFixed(2) + ' дн' : min >= 60 ? Math.floor(min / 60) + ' ч ' + Math.round(min % 60) + ' мин' : min >= 1 ? min.toFixed(1) + ' мин' : (min * 60).toFixed(1) + ' с';
    const calc = () => {
      const s = parseFloat(a.value.replace(',', '.')), n = parseFloat(r.value.replace(/\s/g, ''));
      if (!(s > 0 && s < 100)){ out.innerHTML = '<p class="small" style="color:var(--bad)">Введите SLO от 0 до 100, например 99.95.</p>'; return; }
      const b = 1 - s / 100;
      out.innerHTML = `<div class="calc"><div><span>Бюджет ошибок</span><b>${(b * 100).toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}%</b></div>
      <div><span>Простой в сутки</span><b>${fmt(1440 * b)}</b></div><div><span>Простой за 30 дней</span><b>${fmt(43200 * b)}</b></div>
      <div><span>Простой за год</span><b>${fmt(525600 * b)}</b></div>${n > 0 ? `<div><span>Допустимо ошибок в месяц</span><b>${Math.floor(Math.round(n * b * 1e6) / 1e6).toLocaleString('ru-RU')}</b></div>` : ''}
      <div><span>Burn rate 14,4× съест месяц за</span><b>${fmt(43200 / 14.4)}</b></div></div>`;
    };
    a.addEventListener('input', calc); r.addEventListener('input', calc); calc();
  },
  layers(el){
    el.className = 'widget';
    const L = [
      ['FROM node:20-alpine', 'базовый образ'],
      ['WORKDIR /app', ''],
      ['COPY package*.json ./', 'меняется при обновлении зависимостей'],
      ['RUN npm ci', 'долго: ~60 с'],
      ['COPY . .', 'меняется при каждом коммите'],
      ['RUN npm run build', '~20 с'],
      ['CMD ["node","dist/server.js"]', '']
    ];
    const changes = [['Ничего не менялось', 99], ['Поменяли код в src/', 4], ['Обновили зависимость в package.json', 2], ['Сменили базовый образ', 0]];
    el.innerHTML = `<div class="row">${changes.map((c, i) => `<button class="btn ghost" data-i="${i}">${c[0]}</button>`).join('')}</div><div class="out" style="margin-top:12px"></div>`;
    const out = el.querySelector('.out');
    const draw = i => {
      const from = changes[i][1];
      el.querySelectorAll('[data-i]').forEach(b => b.className = 'btn' + (+b.dataset.i === i ? '' : ' ghost'));
      out.innerHTML = `<div style="font:13px var(--f-mono);display:flex;flex-direction:column;gap:4px">${L.map((l, k) => { const hit = k < from; return `<div style="display:flex;justify-content:space-between;gap:10px;padding:5px 8px;border-radius:6px;background:${hit ? 'var(--ok-soft)' : 'var(--warn-soft)'}"><span>${esc(l[0])}</span><span class="small">${hit ? 'CACHED' : 'пересборка'}${l[1] ? ' · ' + esc(l[1]) : ''}</span></div>`; }).join('')}</div>
      <p class="small" style="margin-top:8px">Изменение слоя инвалидирует кэш этого слоя и всех слоёв ниже. Поэтому редко меняющееся копируют раньше, а исходники — в самом конце.</p>`;
    };
    el.querySelectorAll('[data-i]').forEach(b => b.onclick = () => draw(+b.dataset.i)); draw(1);
  },
  cron(el){
    el.className = 'widget';
    const id = 'cr' + Math.random().toString(36).slice(2, 6);
    el.innerHTML = `<label for="${id}" class="small">Cron-выражение (минута час день месяц день_недели)</label><div class="row"><input type="text" id="${id}" value="*/15 9-18 * * 1-5" style="font-family:var(--f-mono);max-width:280px" autocomplete="off"><span class="small">попробуйте 0 3 * * *, 30 2 1 * *, 0 */6 * * 0</span></div><div class="out"></div>`;
    const inp = el.querySelector('input'), out = el.querySelector('.out');
    const names = ['минута', 'час', 'день месяца', 'месяц', 'день недели'], lim = [[0, 59], [0, 23], [1, 31], [1, 12], [0, 7]];
    const part = (f, i) => {
      if (f === '*') return 'любой';
      let m;
      if ((m = f.match(/^\*\/(\d+)$/))) return 'каждые ' + m[1];
      return f.split(',').map(x => {
        if ((m = x.match(/^(\d+)-(\d+)(?:\/(\d+))?$/))) { if (+m[1] < lim[i][0] || +m[2] > lim[i][1]) throw 0; return 'с ' + m[1] + ' по ' + m[2] + (m[3] ? ' шаг ' + m[3] : ''); }
        if (/^\d+$/.test(x)) { if (+x < lim[i][0] || +x > lim[i][1]) throw 0; return x; }
        throw 0;
      }).join(', ');
    };
    const calc = () => {
      const f = inp.value.trim().split(/\s+/);
      try {
        if (f.length !== 5) throw 0;
        out.innerHTML = `<div class="calc">${f.map((x, i) => `<div><span>${names[i]}</span><b>${esc(part(x, i))}</b></div>`).join('')}</div><p class="small">День недели: 0 и 7 — воскресенье, 1 — понедельник. Время — в часовом поясе демона (часто UTC).</p>`;
      } catch (e) { out.innerHTML = '<p class="small" style="color:var(--bad)">Нужно 5 полей: числа, диапазоны 1-5, списки 1,3 и шаги */10.</p>'; }
    };
    inp.addEventListener('input', calc); calc();
  }
};

export function viewTools(){
  return `<div class="crumbs"><a href="#/">главная</a> / инструменты</div><h1>Инструменты</h1>
  <h2 style="margin-top:26px">Тренажёр терминала Linux</h2><p class="small">Подробно — в уроке 1.7.</p><div data-widget="trainer"></div>
  <h2 style="margin-top:26px">Калькулятор SLO и бюджета ошибок</h2><p class="small">Подробно — в модуле 12.</p><div data-widget="slo"></div>
  <h2 style="margin-top:26px">Кэш слоёв Docker</h2><p class="small">Подробно — в модуле 7.</p><div data-widget="layers"></div>
  <h2 style="margin-top:26px">Разбор cron-выражения</h2><p class="small">Подробно — в модуле 2.</p><div data-widget="cron"></div>`;
}

// ====== СКВОЗНОЙ СЦЕНАРИЙ ======
const JOURNEY = [
 { t:'Имя в адрес', l:'DNS', d:'Браузер спрашивает резолвер адрес shop.lab. Если DNS не работает, дальше ничего не случится: «Could not resolve host». Проверяют через dig.', code:'dig +short shop.lab', lesson:'4-3' },
 { t:'Маршрут', l:'IP', d:'Пакеты идут к серверу через шлюзы. Проблемы маршрута или провайдера видны по mtr и traceroute.', code:'ip route; traceroute 203.0.113.40', lesson:'4-1' },
 { t:'TCP-соединение', l:'TCP', d:'SYN, SYN+ACK, ACK на порт 443. Refused — порт никто не слушает, timeout — скорее всего, firewall.', code:'nc -zv shop.lab 443', lesson:'4-2' },
 { t:'TLS', l:'TLS', d:'Сервер предъявляет сертификат. Истёк срок, не то имя или нет промежуточной цепочки — соединение прервётся здесь.', code:'openssl s_client -connect shop.lab:443', lesson:'4-5' },
 { t:'Nginx принимает запрос', l:'Reverse proxy', d:'По Host и пути выбираются server и location. Запись появляется в access.log, проблемы — в error.log.', code:'tail -f /var/log/nginx/error.log', lesson:'5-2' },
 { t:'Передача приложению', l:'502 / 504', d:'Nginx подключается к upstream. Приложение не слушает — 502. Не ответило вовремя — 504.', code:"awk '{print $9}' access.log | sort | uniq -c", lesson:'5-3' },
 { t:'Служба или контейнер', l:'systemd · Docker', d:'Жив ли процесс? systemd или Docker перезапускают упавшее. Код 137 означает SIGKILL, часто из-за памяти.', code:'systemctl status shop-api; docker compose ps', lesson:'2-4' },
 { t:'Ресурсы сервера', l:'CPU · RAM · диск', d:'Хватает ли ресурсов? Метод USE: занятость, очередь, ошибки. Высокий wa — диск, нулевой available — память.', code:'uptime; vmstat 1 5; free -h; df -h', lesson:'3-4' },
 { t:'Поток JVM', l:'JVM', d:'Запрос занимает поток Tomcat. Если все потоки чего-то ждут, CPU низкий, а приложение не отвечает. Ответ даст дамп потоков.', code:'jcmd 1204 Thread.print', lesson:'6-3' },
 { t:'Соединение с базой', l:'Пул', d:'Поток берёт соединение из пула HikariCP. Пул исчерпан — запрос ждёт и получает таймаут.', code:'active=10, idle=0, waiting=186', lesson:'6-2' },
 { t:'Запрос в PostgreSQL', l:'SQL', d:'Медленно из-за отсутствия индекса? Или строка заблокирована незакрытой транзакцией? Смотрите pg_stat_activity и EXPLAIN.', code:'SELECT pid, pg_blocking_pids(pid) FROM pg_stat_activity;', lesson:'8-3' },
 { t:'Метрики', l:'Prometheus', d:'Рост ошибок и p99 виден на дашборде RED ещё до звонка клиента.', code:'sum(rate(http_requests_total{status=~"5.."}[5m]))', lesson:'9-2' },
 { t:'Алерт', l:'Alerting', d:'Симптом держится 5 минут — дежурный получает вызов с понятным описанием.', code:'ALERT HighErrorRate', lesson:'9-3' },
 { t:'Логи по trace_id', l:'Loki', d:'Один идентификатор собирает всю историю запроса со всех сервисов и указывает на первопричину.', code:'{service=~".+"} |= "c9d4"', lesson:'10-2' },
 { t:'Инцидент и разбор', l:'SRE', d:'Сначала вернуть работу пользователям, затем RCA и постмортем с конкретными действиями, чтобы это не повторилось.', lesson:'12-3' }
];
let journeyStep = 0;
export function viewJourney(){
  return `<div class="crumbs"><a href="#/">главная</a> / сквозной сценарий</div><h1>Путь запроса и где он ломается</h1>
  <p style="margin:10px 0 20px;max-width:75ch">Один запрос от браузера до базы и обратно. На каждом шаге показано, что может сломаться и чем это проверить. Шаг ведёт в урок, где тема разобрана подробно.</p>
  <div class="journey"><ol class="jlist" id="jlist"></ol><div class="jcard" id="jcard"></div></div>`;
}
export function mountJourney(){
  const draw = () => {
    $('#jlist').innerHTML = JOURNEY.map((s, i) => `<li><button class="${i === journeyStep ? 'on' : ''} ${i < journeyStep ? 'past' : ''}" data-i="${i}"><span class="port">${String(i + 1).padStart(2, '0')}</span><span>${esc(s.t)}</span><span class="tag muted">${esc(s.l.split(' · ')[0])}</span></button></li>`).join('');
    const s = JOURNEY[journeyStep];
    if (journeyStep === JOURNEY.length - 1) Game.flag(COURSE.id + ':journey'); const L = findLesson(s.lesson);
    $('#jcard').innerHTML = `<div class="crumbs">шаг ${journeyStep + 1} из ${JOURNEY.length} · ${esc(s.l)}</div><h2>${esc(s.t)}</h2><p style="margin-top:10px">${esc(s.d)}</p>${s.code ? `<pre><code>${esc(s.code)}</code></pre>` : ''}<p class="small">Подробно: <a href="#/l/${s.lesson}">урок ${s.lesson.replace('-', '.')} «${esc(L ? L.title : '')}»</a></p><div class="row" style="margin-top:14px"><button class="btn ghost" data-d="-1" ${journeyStep === 0 ? 'disabled' : ''}>← Назад</button><button class="btn" data-d="1" ${journeyStep === JOURNEY.length - 1 ? 'disabled' : ''}>Следующий шаг →</button></div>`;
    $('#jlist').querySelectorAll('button').forEach(b => b.onclick = () => { journeyStep = +b.dataset.i; draw(); });
    $('#jcard').querySelectorAll('button[data-d]').forEach(b => b.onclick = () => { journeyStep += +b.dataset.d; draw(); });
  };
  draw();
}

// ====== ШПАРГАЛКИ ======
export function viewCheats(){
  const t = (head, rows) => `<div class="tbl"><table><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
  return `<div class="crumbs"><a href="#/">главная</a> / шпаргалки</div><h1>Шпаргалки</h1>
  <h2 style="margin-top:26px">Linux</h2>${t(['Команда','Что делает'], [['<code>systemctl status app</code>','Состояние сервиса'],['<code>journalctl -u app -f</code>','Логи сервиса в реальном времени'],['<code>ps aux --sort=-%mem | head</code>','Самые прожорливые процессы'],['<code>df -h</code> / <code>du -sh *</code>','Место на дисках / в каталоге'],['<code>free -h</code>','Память'],['<code>ss -tlnp</code>','Слушающие порты и процессы'],['<code>chmod 640 f</code>','Права rw-r-----'],['<code>tail -f /var/log/syslog</code>','Следить за логом']])}
  <h2 style="margin-top:26px">Диагностика в терминале</h2>${t(['Команда','Что показывает'], [['<code>uptime</code>, <code>top</code>','Нагрузка и процессы'],['<code>vmstat 1</code>, <code>iostat -xz 1</code>','CPU, память, своп, диски'],['<code>dmesg -T</code>','Ядро: OOM, ошибки дисков'],['<code>dig name +short</code>','DNS'],['<code>curl -sv URL</code>','HTTP и TLS'],['<code>nc -zv host port</code>','Открыт ли порт'],['<code>grep</code> / <code>awk</code> / <code>sed</code> / <code>jq</code>','Поиск, столбцы, замена, JSON']])}
  <h2 style="margin-top:26px">Nginx и SSH</h2>${t(['Команда','Что делает'], [['<code>nginx -t</code>','Проверить конфиг'],['<code>systemctl reload nginx</code>','Применить без разрыва соединений'],['<code>ssh-keygen -t ed25519</code>','Создать ключ'],['<code>ssh -J bastion host</code>','Через бастион'],['<code>ssh -L 5432:db:5432 bastion</code>','Проброс порта'],['<code>rsync -az dist/ host:/srv/</code>','Синхронизация файлов по SSH']])}
  <h2 style="margin-top:26px">Docker</h2>${t(['Команда','Что делает'], [['<code>docker build -t app:1.0 .</code>','Собрать образ'],['<code>docker run -d -p 8080:80 app:1.0</code>','Запустить с пробросом порта'],['<code>docker ps</code> / <code>docker logs -f id</code>','Контейнеры / логи'],['<code>docker exec -it id sh</code>','Shell внутри контейнера'],['<code>docker image history app</code>','Слои образа'],['<code>docker compose up -d</code>','Поднять стек из compose.yaml'],['<code>docker system prune</code>','Удалить неиспользуемое']])}
  <h2 style="margin-top:26px">JVM</h2>${t(['Команда','Что делает'], [['<code>jps -l</code>','Java-процессы'],['<code>jstat -gcutil PID 1000</code>','Сборка мусора каждую секунду'],['<code>jcmd PID Thread.print</code>','Дамп потоков'],['<code>jcmd PID VM.flags</code>','Настройки JVM'],['<code>jcmd PID GC.heap_info</code>','Состояние heap'],['<code>kill -3 PID</code>','Дамп потоков без JDK']])}
  <h2 style="margin-top:26px">PostgreSQL</h2>${t(['Запрос','Что показывает'], [['<code>SELECT state, count(*) FROM pg_stat_activity GROUP BY state;</code>','Соединения по состояниям'],['<code>SELECT pid, pg_blocking_pids(pid) FROM pg_stat_activity WHERE wait_event_type=\'Lock\';</code>','Кто кого блокирует'],['<code>EXPLAIN ANALYZE ...</code>','План и реальное время'],['<code>CREATE INDEX CONCURRENTLY ...</code>','Индекс без блокировки записи'],['<code>pg_dump -Fc db -f f.dump</code>','Резервная копия'],['<code>pg_restore -d db f.dump</code>','Восстановление']])}
  <h2 style="margin-top:26px">PromQL и LogQL</h2>${t(['Запрос','Что показывает'], [['<code>up == 0</code>','Недоступные цели'],['<code>rate(metric[5m])</code>','Скорость счётчика'],['<code>histogram_quantile(0.99, ...)</code>','p99'],['<code>predict_linear(metric[6h], 86400) &lt; 0</code>','Прогноз заполнения за сутки'],['<code>{service="app"} |= "текст"</code>','Логи с текстом'],['<code>{service="app"} | json | level="ERROR"</code>','Фильтр по полю JSON']])}
  <h2 style="margin-top:26px">Ansible</h2>${t(['Команда','Что делает'], [['<code>ansible -i inv all -m ping</code>','Проверить связь'],['<code>ansible-playbook -i inv site.yml --check --diff</code>','Показать изменения'],['<code>ansible-playbook -i inv site.yml --limit web-01</code>','Применить к одному хосту'],['<code>ansible-vault edit file.yml</code>','Изменить секреты']])}
  <h2 style="margin-top:26px">Коды, по которым понятен слой</h2>${t(['Симптом','Вероятная причина'], [['502','Приложение не слушает или упало'],['503','Перегрузка или намеренный отказ'],['504','Приложение не ответило вовремя'],['Код выхода 137','SIGKILL, часто нехватка памяти'],['Код выхода 143','SIGTERM, обычная остановка'],['Connection refused','Порт никто не слушает'],['Timeout','Firewall или сеть']])}
  <h2 style="margin-top:26px">Доступность</h2>${t(['SLO','Простой в месяц (30 дн)','Простой в год'], [['99%','7 ч 12 мин','3,65 дн'],['99,5%','3 ч 36 мин','1,83 дн'],['99,9%','43,2 мин','8 ч 46 мин'],['99,95%','21,6 мин','4 ч 23 мин'],['99,99%','4,3 мин','52,6 мин'],['99,999%','26 с','5,3 мин']])}`;
}
