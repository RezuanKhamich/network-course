// Код, специфичный для курса «Frontend»: настройки, виджеты, сквозной сценарий, шпаргалки.
import { $, esc } from '../../assets/js/storage.js';
import { Game } from '../../assets/js/game.js';
import { findLesson } from '../../assets/js/engine.js';
import { RES } from './content.js';
export const COURSE = {
  id: 'frontend',
  title: 'Frontend для разработчиков',
  tagline: 'Как на самом деле работают браузер, CSS, JavaScript и фреймворки: что прячет каждая абстракция, как она устроена внутри и где «протекает» багами и тормозами. Основы — обзорно, упор на механизмы. Программа основана на роадмапе roadmap.sh/frontend.',
  journeyLabel: 'Путь клика',
  brand: '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><rect x="2.5" y="4" width="21" height="16" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M2.5 8.5h21" stroke="currentColor" stroke-width="1.6"/><path d="M10 12.5l-2.5 2.5 2.5 2.5M16 12.5l2.5 2.5-2.5 2.5" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

const RES_LABEL = { article:'статья', video:'видео', official:'документация', course:'курс', opensource:'код', book:'книга', podcast:'подкаст', roadmap:'роадмап', feed:'лента' };
export function readMore(l){
  const links = (l.topics || []).flatMap(t => (RES[t] ? RES[t].links : []));
  if (!links.length) return '';
  const seen = new Set();
  const items = links.filter(x => !seen.has(x[2]) && seen.add(x[2]));
  return `<h3 id="readmore">Читать дальше</h3><p class="small">Материалы из роадмапа roadmap.sh, в основном на английском.</p><ul class="rm">${items.map(x => `<li><span class="tag muted">${esc(RES_LABEL[x[0]] || x[0])}</span> <a href="${esc(x[2])}" target="_blank" rel="noopener">${esc(x[1])}</a></li>`).join('')}</ul>`;
}

// ====== ВИДЖЕТЫ ======

// Какие этапы конвейера запускает изменение свойства (по данным Blink, упрощённо)
const PIPE_STAGES = ['JS', 'Style', 'Layout', 'Paint', 'Composite'];
const PIPE_PROPS = [
  ['width', 2, 'Меняется геометрия: браузер пересчитывает раскладку элемента, соседей и, возможно, всего документа.'],
  ['top (position: relative)', 2, 'Смещение через top/left — тоже геометрия. Для анимации движения берите transform.'],
  ['font-size', 2, 'Текст меняет размер, строки переносятся заново — полный layout.'],
  ['color', 3, 'Геометрия не меняется, но пиксели надо перерисовать: layout пропускается, paint остаётся.'],
  ['box-shadow', 3, 'Тень рисуется в paint. Большие размытые тени дорогие: анимируйте opacity псевдоэлемента с тенью.'],
  ['background-color', 3, 'Только перерисовка слоя.'],
  ['transform', 4, 'Если у элемента свой композитный слой, compositor просто двигает готовую текстуру на GPU — без layout и paint, даже когда главный поток занят.'],
  ['opacity', 4, 'Как и transform, обрабатывается compositor-ом на отдельном слое.']
];

// Event loop: состояние на каждом шаге примера
const EL_CODE = `console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
queueMicrotask(() => console.log('D'));
requestAnimationFrame(() => console.log('E'));
console.log('F');`;
const EL_STEPS = [
  { line:1, stack:['script'], micro:[], macro:[], raf:[], out:'A', e:'Синхронный код выполняется сразу: A в консоли.' },
  { line:2, stack:['script'], micro:[], macro:['timer → B'], raf:[], out:'A', e:'setTimeout отдаёт колбэк браузеру. Через 0 мс таймер ставит задачу в очередь задач (macrotask), но выполнится она не раньше, чем освободится стек.' },
  { line:3, stack:['script'], micro:['then → C'], macro:['timer → B'], raf:[], out:'A', e:'Промис уже выполнен, поэтому реакция then сразу попадает в очередь микрозадач.' },
  { line:4, stack:['script'], micro:['then → C', 'micro → D'], macro:['timer → B'], raf:[], out:'A', e:'queueMicrotask — прямой способ поставить микрозадачу. Она встаёт после C.' },
  { line:5, stack:['script'], micro:['then → C', 'micro → D'], macro:['timer → B'], raf:['rAF → E'], out:'A', e:'Колбэк requestAnimationFrame сработает перед следующей отрисовкой кадра.' },
  { line:6, stack:['script'], micro:['then → C', 'micro → D'], macro:['timer → B'], raf:['rAF → E'], out:'A F', e:'Последняя синхронная строка: F.' },
  { line:0, stack:[], micro:['then → C', 'micro → D'], macro:['timer → B'], raf:['rAF → E'], out:'A F', e:'Скрипт закончился, стек пуст. Это точка, где event loop обязан выполнить все микрозадачи.' },
  { line:3, stack:['C'], micro:['micro → D'], macro:['timer → B'], raf:['rAF → E'], out:'A F C', e:'Микрозадачи выполняются по порядку, до полного опустошения очереди. Новые микрозадачи, добавленные по ходу, тоже выполнятся сейчас.' },
  { line:4, stack:['D'], micro:[], macro:['timer → B'], raf:['rAF → E'], out:'A F C D', e:'Очередь микрозадач пуста. Теперь браузер может отрисовать кадр, если пора.' },
  { line:5, stack:['E'], micro:[], macro:['timer → B'], raf:[], out:'A F C D E', e:'Шаг рендеринга: сначала колбэки rAF, потом style, layout, paint. Порядок E и B зависит от того, наступил ли момент кадра: в реальном браузере B часто печатается раньше E.' },
  { line:2, stack:['B'], micro:[], macro:[], raf:[], out:'A F C D E B', e:'Следующая итерация берёт одну задачу из очереди задач — колбэк таймера. После каждой задачи снова опустошаются микрозадачи.' }
];

// Специфичность: упрощённый разбор селектора (a = id, b = классы/атрибуты/псевдоклассы, c = типы/псевдоэлементы)
function specificity(sel){
  let a = 0, b = 0, c = 0, s = sel.trim();
  const add = v => { a += v[0]; b += v[1]; c += v[2]; };
  const max = list => list.split(',').map(specificity).reduce((m, v) => (v[0] > m[0] || (v[0] === m[0] && (v[1] > m[1] || (v[1] === m[1] && v[2] > m[2])))) ? v : m, [0, 0, 0]);
  const inner = (str, i) => { let d = 0, j = i; for (; j < str.length; j++){ if (str[j] === '(') d++; else if (str[j] === ')' && --d === 0) break; } return [str.slice(i + 1, j), j + 1]; };
  let i = 0;
  while (i < s.length){
    const ch = s[i];
    if (ch === '#'){ a++; i++; while (i < s.length && /[\w-]/.test(s[i])) i++; }
    else if (ch === '.'){ b++; i++; while (i < s.length && /[\w-]/.test(s[i])) i++; }
    else if (ch === '['){ b++; i = s.indexOf(']', i) + 1 || s.length; }
    else if (ch === ':'){
      if (s[i + 1] === ':'){ c++; i += 2; while (i < s.length && /[\w-]/.test(s[i])) i++; if (s[i] === '(') i = inner(s, i)[1]; continue; }
      i++; const st = i; while (i < s.length && /[\w-]/.test(s[i])) i++;
      const name = s.slice(st, i).toLowerCase();
      if (s[i] === '('){
        const [arg, nx] = inner(s, i); i = nx;
        if (name === 'where') continue;
        if (['is', 'not', 'has', 'matches'].includes(name)){ add(max(arg)); continue; }
        if (/^nth-(last-)?child$/.test(name) && / of /.test(arg)){ b++; add(max(arg.split(/ of /)[1])); continue; }
        b++;
      } else if (['before', 'after', 'first-line', 'first-letter'].includes(name)) c++;
      else b++;
    }
    else if (/[a-zA-Z]/.test(ch)){ c++; while (i < s.length && /[\w-]/.test(s[i])) i++; }
    else i++;
  }
  return [a, b, c];
}

// Реконсиляция списка: по индексу и по ключам
function diffByIndex(prev, next){
  const ops = [];
  for (let i = 0; i < Math.min(prev.length, next.length); i++) if (prev[i] !== next[i]) ops.push(['upd', `li[${i}]: текст «${prev[i]}» → «${next[i]}»`]);
  for (let i = prev.length; i < next.length; i++) ops.push(['add', `создать li[${i}] «${next[i]}» в конце`]);
  for (let i = next.length; i < prev.length; i++) ops.push(['del', `удалить li[${i}] «${prev[i]}»`]);
  return ops;
}
function diffByKey(prev, next){
  const ops = [], keep = next.filter(k => prev.includes(k));
  prev.filter(k => !next.includes(k)).forEach(k => ops.push(['del', `удалить узел key=${k}`]));
  // узлы на месте — наибольшая возрастающая подпоследовательность старых индексов
  const idx = keep.map(k => prev.indexOf(k)), lis = [], par = [], pos = [];
  idx.forEach((v, i) => { let lo = 0, hi = lis.length; while (lo < hi){ const m = (lo + hi) >> 1; if (idx[lis[m]] < v) lo = m + 1; else hi = m; } par[i] = lo ? lis[lo - 1] : -1; lis[lo] = i; });
  for (let k = lis.length ? lis[lis.length - 1] : -1; k >= 0; k = par[k]) pos.push(keep[k]);
  next.forEach((k, i) => {
    if (!prev.includes(k)) ops.push(['add', `создать узел key=${k} на позиции ${i}`]);
    else if (!pos.includes(k)) ops.push(['mov', `переместить узел key=${k} на позицию ${i}`]);
  });
  return ops;
}
const RECON = [
  ['Добавить в начало', ['Аня', 'Боря', 'Вика'], ['Женя', 'Аня', 'Боря', 'Вика']],
  ['Удалить из середины', ['Аня', 'Боря', 'Вика', 'Гоша'], ['Аня', 'Вика', 'Гоша']],
  ['Перевернуть', ['Аня', 'Боря', 'Вика'], ['Вика', 'Боря', 'Аня']],
  ['Добавить в конец', ['Аня', 'Боря'], ['Аня', 'Боря', 'Вика']]
];

// Спектр рендеринга: сегменты таймлайна (мс) и вехи
const RENDER = {
  CSR: { segs:[['Сервер', 30, 'srv'], ['Пустой HTML', 40, 'net'], ['Загрузка JS', 450, 'net'], ['Выполнение и fetch данных', 600, 'js']], fcp:1120, tti:1120, note:'Сервер отдаёт пустую оболочку. Пока бандл не скачан, не выполнен и не получил данные, пользователь видит белый экран. Плюс — дешёвый хостинг статики; минус — медленный первый показ и SEO.' },
  SSR: { segs:[['Рендер на сервере с данными', 280, 'srv'], ['HTML с контентом', 80, 'net'], ['Загрузка JS', 450, 'net'], ['Гидратация', 300, 'js']], fcp:360, tti:1110, note:'Контент виден быстро, но кнопки «мёртвые» до гидратации. Каждый запрос нагружает сервер, TTFB зависит от самого медленного источника данных.' },
  SSG: { segs:[['CDN отдаёт готовый файл', 20, 'srv'], ['HTML с контентом', 60, 'net'], ['Загрузка JS', 450, 'net'], ['Гидратация', 300, 'js']], fcp:80, tti:830, note:'HTML собран при сборке и лежит в CDN — самый быстрый первый показ. Подходит, если данные одинаковы для всех и меняются редко.' },
  ISR: { segs:[['CDN: страница из кеша', 20, 'srv'], ['HTML с контентом', 60, 'net'], ['Загрузка JS', 450, 'net'], ['Гидратация', 300, 'js']], fcp:80, tti:830, note:'Как SSG, но страница перегенерируется в фоне по таймеру или по событию. Пользователь получает кешированную версию, следующий — обновлённую (stale-while-revalidate).' },
  'Острова': { segs:[['CDN: статичный HTML', 20, 'srv'], ['HTML с контентом', 60, 'net'], ['JS только для виджетов', 90, 'net'], ['Гидратация островов', 60, 'js']], fcp:80, tti:230, note:'Страница — статичный HTML, интерактивны только отдельные «острова» (поиск, корзина). JS грузится и гидратируется точечно. Подход Astro.' }
};

// CORS: решает, будет ли preflight и пропустит ли браузер ответ
const SIMPLE_CT = ['—', 'text/plain', 'application/x-www-form-urlencoded', 'multipart/form-data'];
function corsVerdict(o){
  const simpleMethod = ['GET', 'HEAD', 'POST'].includes(o.method);
  const simpleCT = SIMPLE_CT.includes(o.ct);
  const custom = o.header !== '—';
  const preflight = !simpleMethod || !simpleCT || custom;
  const steps = [];
  const originOk = o.acao === '*' ? !o.cred : o.acao === 'https://shop.example';
  if (preflight){
    const need = [!simpleMethod && `метод ${o.method}`, !simpleCT && `Content-Type: ${o.ct}`, custom && `заголовок ${o.header}`].filter(Boolean).join(', ');
    steps.push(['info', `Запрос не «простой» (${need}) — браузер сначала отправит OPTIONS (preflight).`]);
    if (!originOk) return [...steps, ['bad', o.acao === 'нет' ? 'В ответе на preflight нет Access-Control-Allow-Origin — запрос даже не отправится.' : o.cred ? 'С credentials нельзя использовать «*» — нужен точный origin.' : 'Origin не совпадает — запрос не отправится.']];
    if (o.cred && !o.acac) return [...steps, ['bad', 'Запрос с cookie, а сервер не ответил Access-Control-Allow-Credentials: true — браузер остановится на preflight.']];
    if ((custom || !simpleCT) && !o.acah) return [...steps, ['bad', 'Сервер не перечислил нестандартный заголовок в Access-Control-Allow-Headers — preflight провален.']];
    if (!simpleMethod && !o.acam) return [...steps, ['bad', `Метода ${o.method} нет в Access-Control-Allow-Methods — preflight провален.`]];
    steps.push(['ok', 'Preflight пройден, браузер отправляет настоящий запрос.']);
  } else steps.push(['info', 'Простой запрос: браузер отправляет его сразу, без preflight. Сервер получит и выполнит его в любом случае.']);
  if (!originOk) return [...steps, ['bad', `Ответ пришёл, но браузер не отдаст его JS: ${o.acao === 'нет' ? 'нет Access-Control-Allow-Origin' : o.cred ? '«*» несовместим с credentials' : 'origin не совпадает'}. Побочные эффекты на сервере (например, POST) уже произошли.`]];
  if (o.cred && !o.acac) return [...steps, ['bad', 'Ответ получен, но без Access-Control-Allow-Credentials: true браузер скроет его от JS.']];
  return [...steps, ['ok', 'Браузер отдаёт ответ в JS.']];
}

const uid = p => p + Math.random().toString(36).slice(2, 7);
function choice(name, opts, val){ return `<select data-k="${name}">${opts.map(o => `<option${o === val ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`; }

export const WIDGETS = {
  pipeline(el){
    el.className = 'widget';
    el.innerHTML = `<div class="row">${PIPE_PROPS.map((p, i) => `<button class="btn ghost small-btn" data-i="${i}">${esc(p[0])}</button>`).join('')}</div><div class="out" style="margin-top:12px"></div>`;
    const draw = i => {
      const [name, from, note] = PIPE_PROPS[i];
      el.querySelectorAll('[data-i]').forEach(b => b.className = 'btn small-btn' + (+b.dataset.i === i ? '' : ' ghost'));
      const skip = s => (from === 3 && s === 2) || (from === 4 && (s === 2 || s === 3));
      el.querySelector('.out').innerHTML = `<div class="pipe">${PIPE_STAGES.map((s, k) => `<div class="pipe-st ${skip(k) ? 'skip' : 'run'}">${s}</div>`).join('<span class="pipe-ar">→</span>')}</div><p class="small" style="margin-top:10px"><code>${esc(name)}</code>: ${esc(note)}</p>`;
    };
    el.querySelectorAll('[data-i]').forEach(b => b.onclick = () => draw(+b.dataset.i)); draw(0);
  },
  eventloop(el){
    el.className = 'widget';
    let k = 0;
    const lines = EL_CODE.split('\n');
    const q = (t, items) => `<div class="el-q"><b>${t}</b><div>${items.length ? items.map(x => `<span class="el-item">${esc(x)}</span>`).join('') : '<span class="small">пусто</span>'}</div></div>`;
    const draw = () => {
      const s = EL_STEPS[k];
      el.innerHTML = `<pre class="el-code"><code>${lines.map((l, i) => `<span class="${s.line === i + 1 ? 'el-on' : ''}">${esc(l)}</span>`).join('\n')}</code></pre>
      <div class="el-grid">${q('Стек вызовов', s.stack)}${q('Микрозадачи', s.micro)}${q('Колбэки rAF', s.raf)}${q('Очередь задач', s.macro)}</div>
      <p style="margin:10px 0 4px"><b>Консоль:</b> <code>${esc(s.out)}</code></p>
      <p style="margin:0 0 10px"><b>Шаг ${k + 1}/${EL_STEPS.length}.</b> ${esc(s.e)}</p>
      <div class="row"><button class="btn ghost" data-d="-1" ${k === 0 ? 'disabled' : ''}>← Назад</button><button class="btn" data-d="1" ${k === EL_STEPS.length - 1 ? 'disabled' : ''}>Шаг вперёд →</button></div>`;
      el.querySelectorAll('[data-d]').forEach(b => b.onclick = () => { k += +b.dataset.d; draw(); });
    };
    draw();
  },
  specificity(el){
    el.className = 'widget';
    const a = uid('sa'), b = uid('sb');
    el.innerHTML = `<div class="spec-in"><label class="small" for="${a}">Селектор 1</label><input type="text" id="${a}" value="#cart .item:hover" autocomplete="off" spellcheck="false">
    <label class="small" for="${b}">Селектор 2</label><input type="text" id="${b}" value="main ul li.item.active" autocomplete="off" spellcheck="false"></div>
    <p class="small">Попробуйте <code>:where(#cart) .item</code>, <code>:is(#a, .b) p</code>, <code>a::before</code>, <code>[type="text"]</code>.</p><div class="out"></div>`;
    const A = el.querySelector('#' + a), B = el.querySelector('#' + b), out = el.querySelector('.out');
    const cmp = (x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
    const calc = () => {
      const x = specificity(A.value), y = specificity(B.value), c = cmp(x, y);
      const cell = (s, v, win) => `<div class="${win ? 'spec-win' : ''}"><span>${esc(s || '—')}</span><b>(${v.join(', ')})</b></div>`;
      out.innerHTML = `<div class="calc">${cell(A.value, x, c > 0)}${cell(B.value, y, c < 0)}</div><p class="small" style="margin-top:8px">${c === 0 ? 'Специфичность равна — побеждает правило, объявленное позже.' : `Побеждает селектор ${c > 0 ? 1 : 2}: веса сравниваются слева направо, (1, 0, 0) сильнее (0, 99, 99).`} Но сначала каскад сравнивает происхождение, <code>!important</code> и слои <code>@layer</code> — специфичность решает только внутри одного слоя.</p>`;
    };
    A.addEventListener('input', calc); B.addEventListener('input', calc); calc();
  },
  bubbling(el){
    el.className = 'widget';
    const sid = uid('st');
    el.innerHTML = `<div class="bub" data-n="div.card"><span class="bub-l">div.card</span><div class="bub" data-n="ul.list"><span class="bub-l">ul.list</span><div class="bub" data-n="li.item"><span class="bub-l">li.item</span><button class="btn small-btn" data-n="button">Купить</button></div></div></div>
    <div class="row" style="margin-top:10px"><label class="small"><input type="checkbox" id="${sid}"> stopPropagation() на ul.list (всплытие)</label></div><ol class="bub-log small"></ol>`;
    const log = el.querySelector('.bub-log'), stop = el.querySelector('#' + sid), PH = ['', 'захват', 'цель', 'всплытие'];
    let n = 0;
    // новый клик — новый журнал (слушатель зарегистрирован первым, поэтому срабатывает раньше остальных)
    el.querySelector('.bub').addEventListener('click', () => { log.innerHTML = ''; n = 0; }, true);
    // настоящие слушатели: порядок в журнале — это порядок, в котором браузер их вызвал
    const hit = (node, phase) => {
      const li = document.createElement('li'); li.textContent = `${node.dataset.n} — ${PH[phase]}`; li.className = 'ph' + phase; log.appendChild(li);
      setTimeout(() => node.classList.add('bub-hit'), 140 * n);
      setTimeout(() => node.classList.remove('bub-hit'), 140 * n++ + 260);
    };
    el.querySelectorAll('[data-n]').forEach(node => {
      node.addEventListener('click', e => hit(node, e.eventPhase), true);
      node.addEventListener('click', e => {
        if (e.eventPhase !== Event.AT_TARGET) hit(node, e.eventPhase); // на цели оба слушателя срабатывают в фазе «цель» — второй не дублируем
        if (node.dataset.n === 'ul.list' && stop.checked) e.stopPropagation();
      });
    });
  },
  reconcile(el){
    el.className = 'widget';
    let s = 0, keyed = false;
    const draw = () => {
      const [, prev, next] = RECON[s], ops = keyed ? diffByKey(prev, next) : diffByIndex(prev, next);
      el.innerHTML = `<div class="row">${RECON.map((r, i) => `<button class="btn small-btn ${i === s ? '' : 'ghost'}" data-s="${i}">${esc(r[0])}</button>`).join('')}</div>
      <div class="row" style="margin-top:8px"><button class="btn small-btn ${keyed ? 'ghost' : ''}" data-k="0">Без ключей (по индексу)</button><button class="btn small-btn ${keyed ? '' : 'ghost'}" data-k="1">С key</button></div>
      <div class="rc"><div><b class="small">Было</b><ul>${prev.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div><div><b class="small">Стало</b><ul>${next.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <div><b class="small">DOM-операции: ${ops.length}</b><ul class="rc-ops">${ops.map(o => `<li class="op-${o[0]}">${esc(o[1])}</li>`).join('') || '<li>ничего</li>'}</ul></div></div>
      <p class="small">${keyed ? 'С ключами узлы сохраняют идентичность: состояние полей ввода, фокус и анимации остаются у «своего» элемента.' : 'Без ключей сравнение идёт по позиции: элементы «переиспользуются» с чужим содержимым. Если в li есть input, его значение останется на старой позиции — классический баг.'}</p>`;
      el.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { s = +b.dataset.s; draw(); });
      el.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { keyed = b.dataset.k === '1'; draw(); });
    };
    draw();
  },
  rendering(el){
    el.className = 'widget';
    let cur = 'CSR';
    const total = 1200;
    const draw = () => {
      const r = RENDER[cur]; let t = 0;
      el.innerHTML = `<div class="row">${Object.keys(RENDER).map(k => `<button class="btn small-btn ${k === cur ? '' : 'ghost'}" data-r="${k}">${k}</button>`).join('')}</div>
      <div class="rt">${r.segs.map(s => { const x = t; t += s[1]; return `<div class="rt-seg rt-${s[2]}" style="left:${x / total * 100}%;width:${s[1] / total * 100}%" title="${esc(s[0])}: ${s[1]} мс"></div>`; }).join('')}
      <div class="rt-mark" style="left:${r.fcp / total * 100}%"><span>контент</span></div><div class="rt-mark tti" style="left:${Math.min(r.tti, total) / total * 100}%"><span>интерактивно</span></div></div>
      <ul class="rt-legend small">${r.segs.map(s => `<li><i class="rt-${s[2]}"></i>${esc(s[0])} — ${s[1]} мс</li>`).join('')}</ul>
      <p class="small">${esc(r.note)} Цифры условные: важна форма таймлайна, а не миллисекунды.</p>`;
      el.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { cur = b.dataset.r; draw(); });
    };
    draw();
  },
  cors(el){
    el.className = 'widget';
    const o = { method:'GET', ct:'—', header:'—', cred:false, acao:'https://shop.example', acac:false, acah:false, acam:false };
    el.innerHTML = `<p class="small">Страница <code>https://shop.example</code> делает <code>fetch('https://api.example/cart')</code>.</p>
    <div class="cors-grid"><b>Запрос</b><b>Ответ сервера</b>
    <label>Метод ${choice('method', ['GET', 'POST', 'PUT', 'DELETE'], o.method)}</label><label>Allow-Origin ${choice('acao', ['https://shop.example', '*', 'нет'], o.acao)}</label>
    <label>Content-Type ${choice('ct', ['—', 'text/plain', 'application/x-www-form-urlencoded', 'application/json'], o.ct)}</label><label><input type="checkbox" data-k="acac"> Allow-Credentials: true</label>
    <label>Доп. заголовок ${choice('header', ['—', 'Authorization', 'X-Request-Id'], o.header)}</label><label><input type="checkbox" data-k="acah"> Allow-Headers: нужные заголовки</label>
    <label><input type="checkbox" data-k="cred"> credentials: 'include'</label><label><input type="checkbox" data-k="acam"> Allow-Methods: PUT, DELETE</label></div><div class="out"></div>`;
    const out = el.querySelector('.out');
    const calc = () => { out.innerHTML = `<ul class="cors-res">${corsVerdict(o).map(([c, t]) => `<li class="${c}">${esc(t)}</li>`).join('')}</ul>`; };
    el.querySelectorAll('[data-k]').forEach(c => c.addEventListener('change', () => { o[c.dataset.k] = c.type === 'checkbox' ? c.checked : c.value; calc(); }));
    calc();
  }
};

export function viewTools(){
  return `<div class="crumbs"><a href="#/">главная</a> / инструменты</div><h1>Инструменты</h1>
  <h2 style="margin-top:26px">Калькулятор специфичности</h2><p class="small">Подробно — в уроке 2.1.</p><div data-widget="specificity"></div>
  <h2 style="margin-top:26px">Конвейер рендеринга</h2><p class="small">Подробно — в уроках 3.1 и 3.2.</p><div data-widget="pipeline"></div>
  <h2 style="margin-top:26px">Event loop по шагам</h2><p class="small">Подробно — в уроке 4.4.</p><div data-widget="eventloop"></div>
  <h2 style="margin-top:26px">Фазы события</h2><p class="small">Подробно — в уроке 1.3.</p><div data-widget="bubbling"></div>
  <h2 style="margin-top:26px">Реконсиляция списка</h2><p class="small">Подробно — в уроке 7.2.</p><div data-widget="reconcile"></div>
  <h2 style="margin-top:26px">Спектр рендеринга</h2><p class="small">Подробно — в уроке 9.1.</p><div data-widget="rendering"></div>
  <h2 style="margin-top:26px">Проверка CORS</h2><p class="small">Подробно — в уроке 10.1.</p><div data-widget="cors"></div>`;
}

// ====== СКВОЗНОЙ СЦЕНАРИЙ ======
const JOURNEY = [
 { t:'Клик', l:'DOM · события', d:'Пользователь нажимает «Добавить в корзину». Браузер определяет цель хит-тестом и отправляет событие по пути window → … → button и обратно. Фреймворк ловит его одним слушателем на корне — делегирование.', code:'click: capture → target → bubble', lesson:'1-3' },
 { t:'Обработчик', l:'Фреймворк · состояние', d:'Обработчик вызывает setState. Ничего не перерисовывается немедленно: фреймворк лишь помечает компонент «грязным» и планирует обновление.', code:'setCart(c => [...c, item])', lesson:'7-3' },
 { t:'Батчинг', l:'JS · event loop', d:'Все обновления в рамках одного события объединяются. Рендер выполняется после обработчика — в микрозадаче или в задаче планировщика, а не на каждый setState.', lesson:'4-4' },
 { t:'Рендер и реконсиляция', l:'Фреймворк', d:'Компонент вызывается заново и возвращает новое описание UI. Реконсиляция сравнивает его с прошлым и находит минимальный набор DOM-операций: изменить текст счётчика и добавить строку.', lesson:'7-2' },
 { t:'Оптимистичное обновление', l:'Данные', d:'Кеш серверного состояния сразу показывает товар в корзине, не дожидаясь ответа. Параллельно уходит запрос POST /api/cart.', code:"fetch('/api/cart', { method:'POST', body })", lesson:'8-2' },
 { t:'Сеть и безопасность', l:'Браузер · CORS', d:'API на другом origin: JSON-запрос не «простой», поэтому сначала идёт preflight. Cookie сессии с SameSite=Lax прикрепляется, только если API — тот же сайт.', lesson:'10-1' },
 { t:'Мутация DOM', l:'DOM · CSSOM', d:'Фреймворк выполняет операции над DOM. Браузер помечает затронутые узлы и пересчитывает для них стили.', lesson:'2-2' },
 { t:'Кадр', l:'Рендеринг', d:'На ближайшем кадре: style → layout (новая строка сдвинула соседей) → paint → composite. Анимация бейджа через transform идёт на compositor-е и не дёргается.', lesson:'3-2' },
 { t:'Ответ сервера', l:'Данные', d:'Сервер подтвердил — кеш помечается свежим. Если бы вернулась ошибка, оптимистичное изменение откатилось бы и показалось уведомление.', lesson:'8-2' },
 { t:'Метрика', l:'Производительность', d:'Время от клика до следующей отрисовки попадает в INP. Если обработчик блокировал главный поток 300 мс, это увидит и пользователь, и отчёт Core Web Vitals.', code:'INP: 120 ms — good', lesson:'3-3' }
];
let journeyStep = 0;
export function viewJourney(){
  return `<div class="crumbs"><a href="#/">главная</a> / сквозной сценарий</div><h1>Путь клика</h1>
  <p style="margin:10px 0 20px;max-width:75ch">Одно нажатие кнопки «Добавить в корзину», прослеженное через все слои: события, фреймворк, event loop, сеть, DOM и пиксели. Каждый шаг ведёт в урок, где он разобран подробно.</p>
  <div class="journey"><ol class="jlist" id="jlist"></ol><div class="jcard" id="jcard"></div></div>`;
}
export function mountJourney(){
  const draw = () => {
    $('#jlist').innerHTML = JOURNEY.map((s, i) => `<li><button class="${i === journeyStep ? 'on' : ''} ${i < journeyStep ? 'past' : ''}" data-i="${i}"><span class="port">${String(i + 1).padStart(2, '0')}</span><span>${esc(s.t)}</span><span class="tag muted">${esc(s.l.split(' · ')[0])}</span></button></li>`).join('');
    const s = JOURNEY[journeyStep];
    if (journeyStep === JOURNEY.length - 1) Game.flag(COURSE.id + ':journey'); const L = findLesson(s.lesson);
    $('#jcard').innerHTML = `<div class="crumbs">шаг ${journeyStep + 1} из ${JOURNEY.length} · ${esc(s.l)}</div><h2>${esc(s.t)}</h2><p style="margin-top:10px">${esc(s.d)}</p>${s.code ? `<pre><code>${esc(s.code)}</code></pre>` : ''}${L ? `<p class="small">Подробно: <a href="#/l/${s.lesson}">урок ${s.lesson.replace('-', '.')} «${esc(L.title)}»</a></p>` : ''}<div class="row" style="margin-top:14px"><button class="btn ghost" data-d="-1" ${journeyStep === 0 ? 'disabled' : ''}>← Назад</button><button class="btn" data-d="1" ${journeyStep === JOURNEY.length - 1 ? 'disabled' : ''}>Следующий шаг →</button></div>`;
    $('#jlist').querySelectorAll('button').forEach(b => b.onclick = () => { journeyStep = +b.dataset.i; draw(); });
    $('#jcard').querySelectorAll('button[data-d]').forEach(b => b.onclick = () => { journeyStep += +b.dataset.d; draw(); });
  };
  draw();
}

// ====== ШПАРГАЛКИ ======
export function viewCheats(){
  const t = (head, rows) => `<div class="tbl"><table><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
  return `<div class="crumbs"><a href="#/">главная</a> / шпаргалки</div><h1>Шпаргалки</h1>
  <h2 style="margin-top:26px">Конвейер рендеринга: что запускает свойство</h2>${t(['Этапы','Свойства'], [['Layout → Paint → Composite','<code>width</code>, <code>height</code>, <code>margin</code>, <code>padding</code>, <code>top/left</code>, <code>font-size</code>, <code>display</code>, <code>border-width</code>; чтение <code>offsetWidth</code>, <code>getBoundingClientRect()</code> после записи'],['Paint → Composite','<code>color</code>, <code>background</code>, <code>box-shadow</code>, <code>border-color</code>, <code>outline</code>, <code>visibility</code>'],['Только Composite','<code>transform</code>, <code>opacity</code> (на своём слое), <code>filter</code> во многих случаях']])}
  <h2 style="margin-top:26px">Порядок event loop</h2>${t(['Шаг','Что выполняется'], [['1','Одна задача: скрипт, событие, таймер, сообщение'],['2','Все микрозадачи: <code>then</code>, <code>await</code>, <code>queueMicrotask</code>, MutationObserver'],['3','Если пора рисовать кадр: события resize/scroll, колбэки <code>requestAnimationFrame</code>'],['4','Style → Layout → Paint → Composite'],['5','<code>requestIdleCallback</code>, если осталось время до кадра'],['→','Следующая задача']])}
  <h2 style="margin-top:26px">Каскад: порядок приоритетов</h2>${t(['Приоритет (сверху сильнее)','Комментарий'], [['Переходы (transition)','Значение в процессе анимации'],['<code>!important</code> браузера → пользователя → автора','У important порядок происхождения и слоёв обратный'],['Анимации (@keyframes)',''],['Обычные стили автора: inline → стили без слоя → слои в обратном порядке объявления','Внутри одного уровня — специфичность, затем порядок в коде'],['Стили пользователя, затем браузера','User agent stylesheet — самый слабый']])}
  <h2 style="margin-top:26px">Хранилища браузера</h2>${t(['Хранилище','Объём','API','Из воркера','Срок жизни'], [['Cookie','~4 КБ на штуку','синхронное, строка','нет (кроме Cookie Store API)','до Expires; уходит с каждым запросом'],['localStorage','~5 МБ на origin','синхронное, строки','нет','бессрочно'],['sessionStorage','~5 МБ','синхронное','нет','пока жива вкладка'],['IndexedDB','до доли диска','асинхронное, объекты, индексы','да','бессрочно, может быть вытеснено'],['Cache API','до доли диска','асинхронное, Request/Response','да','бессрочно, может быть вытеснено'],['OPFS','до доли диска','файлы, синхронный доступ в воркере','да','бессрочно']])}
  <h2 style="margin-top:26px">HTTP-кеширование фронтенда</h2>${t(['Ресурс','Заголовки','Почему'], [['HTML','<code>Cache-Control: no-cache</code> + <code>ETag</code>','Каждый раз проверять: в нём ссылки на актуальные бандлы'],['JS/CSS с хешем в имени','<code>Cache-Control: public, max-age=31536000, immutable</code>','Новое содержимое — новое имя, старое можно хранить вечно'],['Картинки без хеша','<code>max-age=86400</code> + <code>ETag</code>','Компромисс свежести и трафика'],['API с личными данными','<code>Cache-Control: private, no-store</code>','Нельзя класть в общие кеши'],['Shared-кеш CDN','<code>s-maxage</code>, <code>stale-while-revalidate</code>','Отдельное время жизни для CDN']])}
  <h2 style="margin-top:26px">Стратегии рендеринга</h2>${t(['Стратегия','HTML формируется','Плюсы','Минусы'], [['CSR','В браузере','Простой хостинг, богатая интерактивность','Белый экран до загрузки JS, SEO'],['SSR','На сервере на каждый запрос','Быстрый контент, персонализация','Нагрузка на сервер, гидратация'],['SSG','При сборке','Максимально быстро и дёшево','Сборка растёт с числом страниц, данные устаревают'],['ISR','При сборке и в фоне по таймеру','Скорость SSG и свежесть','Пользователь может увидеть устаревшую версию'],['Острова','При сборке/на сервере, JS точечно','Минимум JS','Сложнее делить состояние между островами'],['RSC','На сервере, по компонентам','Ноль JS для серверных компонентов, стриминг','Новая ментальная модель, границы client/server']])}
  <h2 style="margin-top:26px">Заголовки безопасности</h2>${t(['Заголовок','Защищает от'], [['<code>Content-Security-Policy: script-src \'self\'</code>','Выполнения внедрённых скриптов (XSS)'],['<code>frame-ancestors \'none\'</code> (CSP)','Кликджекинга'],['<code>Strict-Transport-Security</code>','Понижения до HTTP'],['<code>X-Content-Type-Options: nosniff</code>','Угадывания MIME-типа'],['<code>Set-Cookie: …; HttpOnly; Secure; SameSite=Lax</code>','Кражи cookie из JS, отправки по HTTP, CSRF'],['<code>Access-Control-Allow-Origin</code>','Это не защита сервера, а разрешение браузеру отдать ответ JS'],['<code>Cross-Origin-Opener-Policy: same-origin</code>','Доступа чужих окон к вашему window']])}
  <h2 style="margin-top:26px">Core Web Vitals</h2>${t(['Метрика','Хорошо','Плохо','Частые причины'], [['LCP — отрисовка крупнейшего элемента','≤ 2,5 с','> 4 с','Медленный TTFB, блокирующие CSS/JS, тяжёлая hero-картинка без приоритета'],['INP — задержка отклика','≤ 200 мс','> 500 мс','Долгие задачи на главном потоке, тяжёлые обработчики, большой рендер'],['CLS — сдвиги макета','≤ 0,1','> 0,25','Картинки без размеров, поздние шрифты, вставка баннеров над контентом']])}`;
}
