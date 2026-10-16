// Код, специфичный для курса «Python»: настройки, виджеты, сквозной сценарий, шпаргалки.
import { $, esc } from '../../assets/js/storage.js';
import { Game } from '../../assets/js/game.js';
import { findLesson } from '../../assets/js/engine.js';
export const COURSE = {
  id: 'python',
  title: 'Python: от основ к Django и ИИ',
  tagline: 'Синтаксис, коллекции, функции и декораторы, ООП по-питоновски, генераторы, пакеты, типизация и тесты, asyncio, работа с данными в NumPy и pandas. Опирается на курс ООП и ведёт к Django и машинному обучению.',
  journeyLabel: 'От скрипта к проекту',
  brand: '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><path d="M12.8 2.5c-4.2 0-4 1.8-4 1.8v2.4h4.1v.8H7.1S4.3 7.2 4.3 11.6s2.4 4.2 2.4 4.2h1.5v-2.1s-.1-2.4 2.4-2.4h4.1s2.3 0 2.3-2.2V5s.4-2.5-4.2-2.5z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M13.2 23.5c4.2 0 4-1.8 4-1.8v-2.4h-4.1v-.8h5.8s2.8.3 2.8-4.1-2.4-4.2-2.4-4.2h-1.5v2.1s.1 2.4-2.4 2.4h-4.1s-2.3 0-2.3 2.2V21s-.4 2.5 4.2 2.5z" fill="none" stroke="var(--accent)" stroke-width="1.4"/><circle cx="10.6" cy="4.8" r=".9" fill="currentColor"/><circle cx="15.4" cy="21.2" r=".9" fill="var(--accent)"/></svg>'
};

function stepWidget(el, steps){
  el.className = 'widget';
  let k = 0;
  const draw = () => {
    el.innerHTML = `<div style="display:flex;flex-direction:column;gap:6px;font:13px var(--f-mono)">${steps.map((s, i) => `<div style="display:grid;grid-template-columns:minmax(0,150px) minmax(0,1fr);gap:8px;align-items:center;padding:6px 8px;border-radius:6px;opacity:${i > k ? .2 : 1};background:${i === k ? 'var(--accent-soft)' : 'transparent'}"><b>${esc(s.n)}</b><span style="white-space:pre-wrap">${esc(s.c)}</span></div>`).join('')}</div>
    <p style="margin:12px 0 10px"><b>Шаг ${k + 1}/${steps.length}.</b> ${esc(steps[k].e)}</p>
    <div class="row"><button class="btn ghost" data-d="-1" ${k === 0 ? 'disabled' : ''}>← Назад</button><button class="btn" data-d="1" ${k === steps.length - 1 ? 'disabled' : ''}>Шаг вперёд →</button></div>`;
    el.querySelectorAll('button').forEach(b => b.onclick = () => { k += +b.dataset.d; draw(); });
  };
  draw();
}

const REF_STEPS = [
  { n:'a = [1, 2]', c:'a ──► [1, 2]', e:'Создан список, имя a привязано к нему.' },
  { n:'b = a', c:'a ──► [1, 2] ◄── b', e:'Присваивание не копирует: b — второе имя того же объекта.' },
  { n:'b.append(3)', c:'a ──► [1, 2, 3] ◄── b', e:'Изменяем объект через b — изменение видно и через a.' },
  { n:'c = a.copy()', c:'a ──► [1, 2, 3] ◄── b    c ──► [1, 2, 3]', e:'copy() создаёт новый список. Теперь у c свой объект.' },
  { n:'c.append(4)', c:'a, b ──► [1, 2, 3]    c ──► [1, 2, 3, 4]', e:'Изменение копии не затрагивает оригинал (но вложенные объекты при поверхностной копии общие).' },
  { n:'a = [9]', c:'a ──► [9]    b ──► [1, 2, 3]', e:'Новое присваивание лишь перепривязывает имя a; список, на который смотрит b, не изменился.' }
];

const DECORATOR_STEPS = [
  { n:'определение', c:'def load(month): ...', e:'Создана обычная функция load.' },
  { n:'@timed', c:'load = timed(load)', e:'Сразу после определения Python вызывает декоратор и привязывает имя load к его результату.' },
  { n:'внутри timed', c:'def wrapper(*args, **kwargs): ...\nreturn wrapper', e:'timed создаёт функцию-обёртку, которая замыкает исходную функцию func, и возвращает её.' },
  { n:'вызов load(5)', c:'wrapper(5)', e:'Теперь имя load указывает на wrapper. Вызов попадает в обёртку.' },
  { n:'до', c:'start = perf_counter()', e:'Обёртка выполняет свой код до вызова оригинала.' },
  { n:'оригинал', c:'return func(5)', e:'Вызывается исходная load с теми же аргументами.' },
  { n:'после', c:'finally: print(elapsed)', e:'Код после — даже если оригинал бросил исключение. Результат возвращается вызывающему.' }
];

const LOOP_STEPS = [
  { n:'asyncio.run', c:'цикл событий: [main]', e:'Создаётся цикл событий, и в нём запускается корутина main.' },
  { n:'gather', c:'очередь: [job A, job B, job C]', e:'gather превращает три корутины в задачи и ставит их в очередь цикла.' },
  { n:'A до await', c:'A: await sleep(1) → ждёт', e:'Задача A выполняется до первого await и отдаёт управление циклу.' },
  { n:'B и C', c:'B: ждёт   C: ждёт', e:'Цикл тут же запускает B и C — они тоже доходят до await. Поток один, но никто не простаивает.' },
  { n:'таймеры', c:'… 1 секунда …', e:'Цикл ждёт, пока какая-нибудь операция завершится (таймер, ответ сети, сокет).' },
  { n:'продолжение', c:'A ✓  B ✓  C ✓', e:'Задачи продолжаются с места await и возвращают результаты.' },
  { n:'результат', c:'gather → [r1, r2, r3]   ≈ 1 с', e:'Три ожидания по 1 секунде заняли около секунды. Блокирующий time.sleep сломал бы эту картину — цикл бы встал.' }
];

const COMP_DATA = [
  { name:'Книга', price:500, cat:'books' }, { name:'Ручка', price:50, cat:'office' },
  { name:'Наушники', price:3500, cat:'audio' }, { name:'Блокнот', price:150, cat:'office' },
  { name:'Комикс', price:900, cat:'books' }
];

export const WIDGETS = {
  refs(el){ stepWidget(el, REF_STEPS); },
  decorator(el){ stepWidget(el, DECORATOR_STEPS); },
  eventloop(el){ stepWidget(el, LOOP_STEPS); },
  slice(el){
    el.className = 'widget';
    const id = 'sl' + Math.random().toString(36).slice(2, 6);
    el.innerHTML = `<div class="row"><label class="small" for="${id}">Строка</label><input type="text" id="${id}" value="Python 3.13" style="font-family:var(--f-mono);max-width:200px" autocomplete="off">
      <label class="small" for="${id}s">start</label><input type="text" id="${id}s" value="0" style="font-family:var(--f-mono);max-width:60px" autocomplete="off">
      <label class="small" for="${id}e">stop</label><input type="text" id="${id}e" value="6" style="font-family:var(--f-mono);max-width:60px" autocomplete="off">
      <label class="small" for="${id}p">step</label><input type="text" id="${id}p" value="" style="font-family:var(--f-mono);max-width:60px" autocomplete="off"></div>
      <p class="small">Пустое поле — значение по умолчанию. Попробуйте отрицательные индексы: start=-4, или step=-1.</p><div class="out"></div>`;
    const [s, a, b, c] = ['', 's', 'e', 'p'].map(x => el.querySelector('#' + id + x));
    const out = el.querySelector('.out');
    const num = v => v.trim() === '' ? null : (/^-?\d+$/.test(v.trim()) ? +v : NaN);
    const calc = () => {
      const str = s.value, n = str.length;
      let start = num(a.value), stop = num(b.value), step = num(c.value);
      if ([start, stop, step].some(Number.isNaN) || step === 0) { out.innerHTML = '<p class="small" style="color:var(--bad)">Индексы — целые числа, step не может быть 0.</p>'; return; }
      step = step ?? 1;
      const norm = (v, def, lo, hi) => v === null ? def : Math.min(Math.max(v < 0 ? v + n : v, lo), hi);
      const st = step > 0 ? norm(start, 0, 0, n) : norm(start, n - 1, -1, n - 1);
      const en = step > 0 ? norm(stop, n, 0, n) : norm(stop, -1, -1, n - 1);
      const idx = [];
      for (let i = st; step > 0 ? i < en : i > en; i += step) idx.push(i);
      const res = idx.map(i => str[i]).join('');
      const lbl = `${a.value.trim()}:${b.value.trim()}${c.value.trim() ? ':' + c.value.trim() : ''}`;
      out.innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:3px;margin:10px 0;font:13px var(--f-mono)">${[...str].map((ch, i) => `<div style="text-align:center;min-width:26px;padding:4px 2px;border-radius:4px;background:${idx.includes(i) ? 'var(--accent-soft)' : 'transparent'};border:1px solid var(--line)"><div>${esc(ch === ' ' ? '␣' : ch)}</div><div class="small">${i}</div><div class="small">${i - n}</div></div>`).join('')}</div>
      <pre><code>${esc(JSON.stringify(str))}[${esc(lbl)}]  →  ${esc(JSON.stringify(res))}</code></pre>`;
    };
    [s, a, b, c].forEach(x => x.addEventListener('input', calc)); calc();
  },
  comprehension(el){
    el.className = 'widget';
    const exprs = { name:['p.name', p => JSON.stringify(p.name)], upper:['p.name.upper()', p => JSON.stringify(p.name.toUpperCase())], price:['p.price', p => String(p.price)], vat:['p.price * 1.2', p => String(Math.round(p.price * 12) / 10)] };
    const conds = { none:['', () => true], cheap:['if p.price < 1000', p => p.price < 1000], books:['if p.cat == "books"', p => p.cat === 'books'], office:['if p.cat != "office"', p => p.cat !== 'office'] };
    const kinds = { list:['[', ']'], set:['{', '}'], dict:['{', '}'], gen:['sum(', ')'] };
    let e = 'name', c = 'cheap', k = 'list';
    const draw = () => {
      const rows = COMP_DATA.filter(conds[c][1]);
      let code, result;
      if (k === 'dict') { code = `{p.name: ${exprs[e][0]} for p in products${conds[c][0] ? ' ' + conds[c][0] : ''}}`; result = '{' + rows.map(p => `${JSON.stringify(p.name)}: ${exprs[e][1](p)}`).join(', ') + '}'; }
      else if (k === 'gen') { code = `sum(p.price for p in products${conds[c][0] ? ' ' + conds[c][0] : ''})`; result = String(rows.reduce((s, p) => s + p.price, 0)); }
      else { code = `${kinds[k][0]}${exprs[e][0]} for p in products${conds[c][0] ? ' ' + conds[c][0] : ''}${kinds[k][1]}`; const vals = rows.map(exprs[e][1]); result = k === 'set' ? (vals.length ? '{' + [...new Set(vals)].join(', ') + '}' : 'set()') : '[' + vals.join(', ') + ']'; }
      const btns = (key, cur, obj, lbl) => Object.keys(obj).map(x => `<button class="btn${x === cur ? '' : ' ghost'}" data-${key}="${x}" style="font-family:var(--f-mono)">${esc(lbl(x, obj[x]))}</button>`).join('');
      el.innerHTML = `<p class="small">products: ${COMP_DATA.map(p => `${esc(p.name)} ${p.price} (${p.cat})`).join(', ')}</p>
      <p class="small">Вид</p><div class="row">${btns('k', k, kinds, x => ({ list:'список', set:'множество', dict:'словарь', gen:'генератор в sum' })[x])}</div>
      ${k === 'gen' ? '' : `<p class="small" style="margin-top:8px">Выражение</p><div class="row">${btns('e', e, exprs, (x, v) => v[0])}</div>`}
      <p class="small" style="margin-top:8px">Условие</p><div class="row">${btns('c', c, conds, (x, v) => v[0] || 'без условия')}</div>
      <pre style="margin-top:12px"><code>${esc(code)}</code></pre><div style="font:13px var(--f-mono);padding:8px;border-radius:6px;background:var(--accent-soft)">${esc(result)}</div>`;
      el.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { k = b.dataset.k; draw(); });
      el.querySelectorAll('[data-e]').forEach(b => b.onclick = () => { e = b.dataset.e; draw(); });
      el.querySelectorAll('[data-c]').forEach(b => b.onclick = () => { c = b.dataset.c; draw(); });
    };
    draw();
  }
};

export function viewTools(){
  return `<div class="crumbs"><a href="#/">главная</a> / инструменты</div><h1>Инструменты</h1>
  <p class="small" style="margin-top:8px">Теория ООП, на которую опирается курс: <a href="../oop/">курс «Объектно-ориентированное программирование»</a>.</p>
  <h2 style="margin-top:26px">Срезы строк и списков</h2><p class="small">Подробно — в модуле 1.</p><div data-widget="slice"></div>
  <h2 style="margin-top:26px">Конструктор comprehension</h2><p class="small">Подробно — в модуле 2.</p><div data-widget="comprehension"></div>
  <h2 style="margin-top:26px">Имена и объекты</h2><p class="small">Подробно — в модуле 2.</p><div data-widget="refs"></div>
  <h2 style="margin-top:26px">Как работает декоратор</h2><p class="small">Подробно — в модуле 3.</p><div data-widget="decorator"></div>
  <h2 style="margin-top:26px">Цикл событий asyncio</h2><p class="small">Подробно — в модуле 9.</p><div data-widget="eventloop"></div>`;
}

// ====== СКВОЗНОЙ СЦЕНАРИЙ ======
const JOURNEY = [
 { t:'Окружение', l:'Старт', d:'Новый проект трекера расходов: uv init, окружение, ruff и pytest как dev-зависимости.', code:'uv init expenses && uv add --dev pytest ruff', lesson:'0-3' },
 { t:'Первый скрипт', l:'Синтаксис', d:'Скрипт читает траты из списка словарей и печатает сумму с f-строкой и форматированием.', code:'print(f"Итого: {total:,.2f} ₽")', lesson:'1-3' },
 { t:'Отчёт по категориям', l:'Коллекции', d:'Словарь категорий, comprehension для фильтра по месяцу, Counter для топа.', code:'by_cat = Counter({c: sum(e.amount for e in xs) for c, xs in groups.items()})', lesson:'2-3' },
 { t:'Функции', l:'Функции', d:'Код разбит на функции с понятными параметрами; @functools.cache для курсов валют.', lesson:'3-4' },
 { t:'Модель данных', l:'ООП', d:'Expense — dataclass с Decimal и date; Category — StrEnum. Протокол Storage для хранилищ.', code:'@dataclass(frozen=True)\nclass Expense:\n    amount: Decimal\n    category: Category\n    date: date', lesson:'4-4' },
 { t:'Импорт выписки', l:'Генераторы', d:'CSV банка на 100 тысяч строк читается генератором — память не растёт.', lesson:'5-2' },
 { t:'Пакет', l:'Модули', d:'Код переехал в src/expenses: модули models, storage, cli; точка входа в pyproject.toml.', lesson:'6-3' },
 { t:'CLI и файлы', l:'Стандартная библиотека', d:'argparse-команды add/report/import, pathlib, JSON-настройки, время в UTC.', lesson:'7-4' },
 { t:'Типы и тесты', l:'Качество', d:'Аннотации и mypy, Pydantic для настроек и данных API, pytest с фикстурами и parametrize.', lesson:'8-4' },
 { t:'Курсы валют', l:'asyncio', d:'Курсы за 30 дат загружаются одновременно через httpx.AsyncClient и gather с семафором.', lesson:'9-4' },
 { t:'Хранение и анализ', l:'Данные', d:'SQLite с параметризованными запросами; блокнот Jupyter с pandas и графиком трат.', lesson:'10-4' },
 { t:'Дальше', l:'Django · ИИ', d:'Модели становятся моделями Django с админкой — или признаками для прогноза трат в scikit-learn, а категоризацию делает LLM.', lesson:'11-2' }
];
let journeyStep = 0;
export function viewJourney(){
  return `<div class="crumbs"><a href="#/">главная</a> / сквозной сценарий</div><h1>От скрипта к проекту</h1>
  <p style="margin:10px 0 20px;max-width:75ch">Трекер расходов растёт от десяти строк до проекта с пакетом, тестами, асинхронной загрузкой и анализом данных — и готов стать Django-приложением или ML-задачей. Каждый шаг ведёт в урок, где он разобран подробно.</p>
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
  <p class="small" style="margin-top:8px">Синтаксис ООП в сравнении с другими языками, SOLID и паттерны — в <a href="../oop/#/cheats">шпаргалках курса ООП</a>.</p>
  <h2 style="margin-top:26px">Окружение и пакеты</h2>${t(['Команда','Что делает'], [['<code>python -m venv .venv</code>','Создать окружение'],['<code>source .venv/bin/activate</code> / <code>.venv\\Scripts\\activate</code>','Активировать'],['<code>pip install -r requirements.txt</code>','Установить зависимости'],['<code>uv init</code> / <code>uv add x</code> / <code>uv run</code>','Проект, зависимость, запуск'],['<code>pip install -e ".[dev]"</code>','Проект в режиме разработки'],['<code>ruff check --fix . &amp;&amp; ruff format .</code>','Линтер и форматтер'],['<code>mypy src</code>','Проверка типов'],['<code>pytest -x -q</code>','Тесты']])}
  <h2 style="margin-top:26px">Коллекции</h2>${t(['Операция','list','dict','set'], [['Создать','<code>[1, 2]</code>','<code>{"a": 1}</code>','<code>{1, 2}</code> / <code>set()</code>'],['Добавить','<code>append</code>, <code>extend</code>, <code>insert</code>','<code>d[k] = v</code>, <code>update</code>, <code>setdefault</code>','<code>add</code>, <code>update</code>'],['Удалить','<code>pop</code>, <code>remove</code>','<code>pop(k)</code>, <code>del d[k]</code>','<code>discard</code>, <code>remove</code>'],['Проверить','<code>x in xs</code> — O(n)','<code>k in d</code> — O(1)','<code>x in s</code> — O(1)'],['Comprehension','<code>[f(x) for x in xs]</code>','<code>{k: v for k, v in ...}</code>','<code>{f(x) for x in xs}</code>']])}
  <h2 style="margin-top:26px">Строки и f-строки</h2>${t(['Код','Результат'], [['<code>f"{x:,.2f}"</code>','1,234.50'],['<code>f"{x:.1%}"</code>','45.7%'],['<code>f"{n:05d}"</code>','00042'],['<code>f"{s:&gt;10}"</code>','выравнивание вправо на 10'],['<code>f"{x=}"</code>','x=1234.5 — для отладки'],['<code>" ".join(xs)</code> / <code>s.split(",")</code>','склеить / разбить'],['<code>s.strip()</code>, <code>s.lower()</code>, <code>s.replace(a, b)</code>','очистка и замена']])}
  <h2 style="margin-top:26px">Функции</h2>${t(['Запись','Смысл'], [['<code>def f(a, b=1, *args, c, **kw)</code>','позиционные, по умолчанию, лишние, только по имени, лишние именованные'],['<code>lambda x: x * 2</code>','короткая анонимная функция'],['<code>@decorator</code>','<code>f = decorator(f)</code>'],['<code>yield</code>','функция становится генератором'],['<code>async def</code> / <code>await</code>','корутина / ожидание']])}
  <h2 style="margin-top:26px">Dunder-методы</h2>${t(['Метод','Синтаксис'], [['<code>__init__</code>','<code>Cls(...)</code>'],['<code>__repr__</code> / <code>__str__</code>','<code>repr(x)</code> / <code>str(x)</code>, <code>print</code>'],['<code>__eq__</code>, <code>__hash__</code>','<code>==</code>, ключи dict'],['<code>__lt__</code>','<code>&lt;</code>, <code>sorted</code>'],['<code>__len__</code>, <code>__getitem__</code>, <code>__iter__</code>, <code>__contains__</code>','<code>len</code>, <code>x[i]</code>, <code>for</code>, <code>in</code>'],['<code>__enter__</code> / <code>__exit__</code>','<code>with</code>'],['<code>__call__</code>','<code>x()</code>']])}
  <h2 style="margin-top:26px">Что выбрать для параллельной работы</h2>${t(['Задача','Инструмент'], [['Много сетевых запросов','<code>asyncio</code> + <code>httpx.AsyncClient</code> или <code>ThreadPoolExecutor</code>'],['Вычисления на чистом Python','<code>ProcessPoolExecutor</code>'],['Массивы и матрицы','NumPy (векторизация)'],['Блокирующий вызов из async','<code>await asyncio.to_thread(f)</code>']])}
  <h2 style="margin-top:26px">NumPy и pandas</h2>${t(['Код','Смысл'], [['<code>a.shape</code>, <code>a.dtype</code>','форма и тип массива'],['<code>a[a &gt; 0]</code>','фильтр маской'],['<code>m.sum(axis=0)</code>','агрегат по столбцам'],['<code>m @ n</code>','матричное умножение'],['<code>pd.read_csv(path)</code>','загрузить таблицу'],['<code>df[df.x &gt; 0][["a", "b"]]</code>','фильтр строк и выбор столбцов'],['<code>df.groupby("k")["v"].agg(["sum", "mean"])</code>','группировка'],['<code>df.merge(o, on="id", how="left")</code>','соединение таблиц']])}`;
}
