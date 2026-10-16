// Код, специфичный для курса «ООП»: настройки, виджеты, сквозной сценарий, шпаргалки.
import { $, esc } from '../../assets/js/storage.js';
import { Game } from '../../assets/js/game.js';
import { findLesson } from '../../assets/js/engine.js';
export const COURSE = {
  id: 'oop',
  title: 'Объектно-ориентированное программирование',
  tagline: 'Классы, инкапсуляция, наследование, полиморфизм, композиция, SOLID и паттерны — на примерах из Java, Python, C#, C++, Kotlin и TypeScript, чтобы потом легко перейти на любой ООП-язык.',
  journeyLabel: 'Проектируем систему',
  brand: '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><rect x="3" y="3" width="9" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><rect x="14" y="14" width="9" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 7.5h4.5V14" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="7.5" cy="7.5" r="2" fill="var(--accent)"/><circle cx="18.5" cy="18.5" r="2" fill="var(--accent)"/></svg>'
};

function stepWidget(el, steps){
  el.className = 'widget';
  let k = 0;
  const draw = () => {
    el.innerHTML = `<div style="display:flex;flex-direction:column;gap:6px;font:13px var(--f-mono)">${steps.map((s, i) => `<div style="display:grid;grid-template-columns:minmax(0,150px) minmax(0,1fr);gap:8px;align-items:center;padding:6px 8px;border-radius:6px;opacity:${i > k ? .2 : 1};background:${i === k ? 'var(--accent-soft)' : 'transparent'}"><b>${esc(s.n)}</b><span>${esc(s.c)}</span></div>`).join('')}</div>
    <p style="margin:12px 0 10px"><b>Шаг ${k + 1}/${steps.length}.</b> ${esc(steps[k].e)}</p>
    <div class="row"><button class="btn ghost" data-d="-1" ${k === 0 ? 'disabled' : ''}>← Назад</button><button class="btn" data-d="1" ${k === steps.length - 1 ? 'disabled' : ''}>Шаг вперёд →</button></div>`;
    el.querySelectorAll('button').forEach(b => b.onclick = () => { k += +b.dataset.d; draw(); });
  };
  draw();
}

const REF_STEPS = [
  { n:'Point a = new', c:'a ──► [Point x=1 y=2]   (куча)', e:'new создаёт объект в куче, переменная a хранит ссылку на него.' },
  { n:'Point b = a', c:'a ──► [Point x=1 y=2] ◄── b', e:'Присваивание копирует ссылку. Объект по-прежнему один.' },
  { n:'b.x = 10', c:'a ──► [Point x=10 y=2] ◄── b', e:'Меняем объект через b — изменение видно и через a.' },
  { n:'b = new Point', c:'a ──► [x=10 y=2]   b ──► [x=0 y=0]', e:'Новое присваивание переводит b на другой объект; a не затронута.' },
  { n:'a = null', c:'[x=10 y=2] — ссылок нет', e:'На первый объект больше никто не ссылается: сборщик мусора может его удалить.' }
];

export const WIDGETS = {
  refs(el){ stepWidget(el, REF_STEPS); },
  dispatch(el){
    el.className = 'widget';
    const types = { Shape:{ area:'Shape.area()', describe:'Shape.describe()' }, Circle:{ area:'Circle.area()', describe:'Shape.describe() (унаследован)' }, Square:{ area:'Square.area()', describe:'Square.describe()' } };
    let st = 'Shape', dyn = 'Circle', meth = 'area';
    const ok = () => st === 'Shape' || st === dyn;
    const draw = () => {
      const btns = (name, cur, list) => list.map(v => `<button class="btn${v === cur ? '' : ' ghost'}" data-${name}="${v}">${v}</button>`).join('');
      const vt = types[dyn];
      el.innerHTML = `<p class="small">Объявленный тип переменной</p><div class="row">${btns('st', st, ['Shape', 'Circle', 'Square'])}</div>
      <p class="small" style="margin-top:10px">Реальный объект (new …)</p><div class="row">${btns('dyn', dyn, ['Circle', 'Square'])}</div>
      <p class="small" style="margin-top:10px">Вызываемый метод</p><div class="row">${btns('m', meth, ['area', 'describe'])}</div>
      <pre style="margin-top:12px"><code>${esc(st)} s = new ${esc(dyn)}();\ns.${meth}();</code></pre>
      ${ok() ? `<div style="font:13px var(--f-mono);display:flex;flex-direction:column;gap:4px">
        <div style="padding:5px 8px;border-radius:6px;background:var(--ok-soft)">1. Компиляция: у типа ${esc(st)} есть ${meth}() ✓</div>
        <div style="padding:5px 8px;border-radius:6px;background:var(--accent-soft)">2. Выполнение: объект → vtable класса ${esc(dyn)}</div>
        <div style="padding:5px 8px;border-radius:6px;background:var(--accent-soft)">3. Ячейка ${meth} → <b>${esc(vt[meth])}</b></div></div>
        <p class="small" style="margin-top:8px">Реализация выбирается по реальному объекту, а не по объявленному типу.</p>`
      : `<div style="padding:8px;border-radius:6px;background:var(--bad-soft);font:13px var(--f-mono)">Ошибка компиляции: ${esc(dyn)} нельзя присвоить переменной типа ${esc(st)}</div><p class="small" style="margin-top:8px">Circle и Square — «братья», а не родитель и потомок.</p>`}`;
      el.querySelectorAll('[data-st]').forEach(b => b.onclick = () => { st = b.dataset.st; draw(); });
      el.querySelectorAll('[data-dyn]').forEach(b => b.onclick = () => { dyn = b.dataset.dyn; draw(); });
      el.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { meth = b.dataset.m; draw(); });
    };
    draw();
  },
  compose(el){
    el.className = 'widget';
    const opts = [['milk', 'молоко', 30], ['sugar', 'сахар', 10], ['caramel', 'карамель', 40], ['cream', 'сливки', 50]];
    const on = new Set(['milk']);
    const draw = () => {
      const sel = opts.filter(o => on.has(o[0]));
      const cls = sel.length ? sel.map(o => o[1][0].toUpperCase() + o[1].slice(1)).join('') + 'Coffee' : 'Coffee';
      const code = sel.reduce((acc, o) => `new ${o[0][0].toUpperCase() + o[0].slice(1)}(${acc})`, 'new Coffee()');
      const price = 150 + sel.reduce((s, o) => s + o[2], 0);
      el.innerHTML = `<div class="row">${opts.map(o => `<button class="btn${on.has(o[0]) ? '' : ' ghost'}" data-o="${o[0]}">${o[1]}</button>`).join('')}</div>
      <div class="calc" style="margin-top:12px"><div><span>Наследование: нужен класс</span><b>${esc(cls)}</b></div><div><span>Классов на все сочетания</span><b>${2 ** opts.length}</b></div>
      <div><span>Композиция (декораторы): классов</span><b>${opts.length + 1}</b></div><div><span>Цена</span><b>${price} ₽</b></div></div>
      <pre><code>${esc(code)}</code></pre><p class="small">Каждая добавка — обёртка с тем же интерфейсом Beverage. Сочетания собираются на лету, а не заранее.</p>`;
      el.querySelectorAll('[data-o]').forEach(b => b.onclick = () => { on.has(b.dataset.o) ? on.delete(b.dataset.o) : on.add(b.dataset.o); draw(); });
    };
    draw();
  },
  patterns(el){
    el.className = 'widget';
    const P = [
      ['Нужно подключить стороннюю библиотеку с неудобным API', 'Адаптер', 'Оберните её классом, реализующим ваш интерфейс.'],
      ['Добавить логирование и кэш к сервису, не меняя его', 'Декоратор', 'Обёртки с тем же интерфейсом, вкладываются друг в друга.'],
      ['Несколько способов расчёта скидки, выбирается по настройке', 'Стратегия', 'Интерфейс DiscountPolicy и по классу (или функции) на способ.'],
      ['Новый заказ должен уведомить почту, аналитику и склад', 'Наблюдатель', 'Сервис заказов рассылает событие подписчикам, не зная их.'],
      ['Объект с десятком необязательных параметров', 'Строитель', 'Пошаговая сборка с понятными именами шагов.'],
      ['Поведение заказа зависит от статуса: New, Paid, Shipped', 'Состояние', 'Класс на каждый статус вместо switch в каждом методе.'],
      ['Нужна история действий с отменой', 'Команда', 'Каждое действие — объект с execute() и undo().'],
      ['Сложная подсистема, а клиенту нужны две операции', 'Фасад', 'Один простой класс поверх многих внутренних.'],
      ['Тип создаваемого объекта зависит от входных данных', 'Фабричный метод', 'Метод решает, какой класс создать, и возвращает интерфейс.']
    ];
    el.innerHTML = `<p class="small">Выберите задачу — какой паттерн подходит?</p><div style="display:flex;flex-direction:column;gap:6px">${P.map((p, i) => `<button class="btn ghost" style="text-align:left" data-i="${i}">${esc(p[0])}</button>`).join('')}</div><div class="out" style="margin-top:12px"></div>`;
    el.querySelectorAll('[data-i]').forEach(b => b.onclick = () => {
      const p = P[+b.dataset.i];
      el.querySelectorAll('[data-i]').forEach(x => x.className = 'btn' + (x === b ? '' : ' ghost'));
      el.querySelector('.out').innerHTML = `<div class="note"><b>${esc(p[1])}.</b> ${esc(p[2])}</div>`;
    });
  }
};

export function viewTools(){
  return `<div class="crumbs"><a href="#/">главная</a> / инструменты</div><h1>Инструменты</h1>
  <h2 style="margin-top:26px">Динамическая диспетчеризация</h2><p class="small">Подробно — в модуле 4.</p><div data-widget="dispatch"></div>
  <h2 style="margin-top:26px">Ссылки на объекты</h2><p class="small">Подробно — в модуле 7.</p><div data-widget="refs"></div>
  <h2 style="margin-top:26px">Наследование или композиция</h2><p class="small">Подробно — в модуле 6.</p><div data-widget="compose"></div>
  <h2 style="margin-top:26px">Подбор паттерна</h2><p class="small">Подробно — в модуле 10.</p><div data-widget="patterns"></div>`;
}

// ====== СКВОЗНОЙ СЦЕНАРИЙ ======
const JOURNEY = [
 { t:'Требования', l:'Анализ', d:'Нужна система онлайн-библиотеки: читатели берут книги, у каждой выдачи есть срок, за просрочку начисляется штраф, о возврате приходит уведомление.', lesson:'0-2' },
 { t:'Ищем объекты', l:'Модель · классы', d:'Существительные из требований — кандидаты в классы: Reader, Book, Loan, Fine. Глаголы — кандидаты в методы: borrow, return, notify.', code:'class Book { String isbn; String title; }\nclass Reader { long id; String email; }', lesson:'1-1' },
 { t:'Конструкторы и инварианты', l:'Модель · инкапсуляция', d:'Loan нельзя создать без книги, читателя и срока; срок не раньше даты выдачи. Проверки — в конструкторе, поля — private.', code:'Loan(Book b, Reader r, LocalDate due) {\n  if (due.isBefore(LocalDate.now())) throw ...\n}', lesson:'2-3' },
 { t:'Поведение там, где данные', l:'GRASP · Expert', d:'Просрочку считает сам Loan, у которого есть срок. Сервис не вычисляет дни за него.', code:'long overdueDays(LocalDate today)', lesson:'9-4' },
 { t:'Объекты-значения', l:'Неизменяемость', d:'Штраф — Money(amount, currency): неизменяемый record, сравнивается по значению, безопасен для передачи.', code:'record Money(long cents, String currency) {}', lesson:'2-4' },
 { t:'Разные виды изданий', l:'Наследование?', d:'Книги, журналы и аудиокниги различаются сроком выдачи. Иерархия LibraryItem уместна только если все виды действительно взаимозаменяемы (LSP).', lesson:'8-3' },
 { t:'Правила штрафов', l:'Полиморфизм · OCP', d:'Для студентов штраф меньше, для премиум-читателей — нет вовсе. Интерфейс FinePolicy и по классу на правило — новые правила без правки старого кода.', code:'interface FinePolicy { Money fine(Loan l, LocalDate today); }', lesson:'8-2' },
 { t:'Хранение', l:'DIP · интерфейсы', d:'Бизнес-логике нужен LoanRepository — интерфейс в слое домена. Реализация на PostgreSQL живёт в инфраструктуре.', code:'interface LoanRepository { void save(Loan l); List<Loan> overdue(); }', lesson:'8-4' },
 { t:'Уведомления', l:'Паттерн · Наблюдатель', d:'При возврате книги LibraryService рассылает событие; почтовый и push-уведомитель подписаны независимо друг от друга.', lesson:'10-3' },
 { t:'Сборка зависимостей', l:'Композиция · DI', d:'Все зависимости передаются в конструктор LibraryService. В продакшене — PostgreSQL и SMTP, в тестах — InMemory и Fake.', code:'new LibraryService(repo, finePolicy, notifier, clock)', lesson:'6-4' },
 { t:'Проверка дизайна', l:'SOLID · связность', d:'У каждого класса одна причина для изменения, зависимости направлены к домену, нет цепочек a.getB().getC(). Дизайн готов к росту.', lesson:'9-1' },
 { t:'На другом языке', l:'Перенос', d:'Та же модель на Kotlin — data class и интерфейсы, на Python — dataclass и Protocol, на Go — struct и неявные интерфейсы. Меняется синтаксис, не дизайн.', lesson:'11-4' }
];
let journeyStep = 0;
export function viewJourney(){
  return `<div class="crumbs"><a href="#/">главная</a> / сквозной сценарий</div><h1>Проектируем систему</h1>
  <p style="margin:10px 0 20px;max-width:75ch">От требований к объектной модели онлайн-библиотеки: где появляется каждый принцип курса. Каждый шаг ведёт в урок, где он разобран подробно.</p>
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
  <h2 style="margin-top:26px">Синтаксис по языкам</h2>${t(['','Java','C#','Kotlin','Python','TypeScript','C++'], [
    ['Класс','<code>class A</code>','<code>class A</code>','<code>class A</code>','<code>class A:</code>','<code>class A</code>','<code>class A {};</code>'],
    ['Наследование','<code>extends B</code>','<code>: B</code>','<code>: B()</code>','<code>(B)</code>','<code>extends B</code>','<code>: public B</code>'],
    ['Интерфейс','<code>implements I</code>','<code>: I</code>','<code>: I</code>','<code>Protocol</code> / ABC','<code>implements I</code>','чисто виртуальный класс'],
    ['Конструктор','<code>A(...)</code>','<code>A(...)</code>','<code>class A(...)</code>','<code>__init__</code>','<code>constructor</code>','<code>A(...)</code>'],
    ['Текущий объект','<code>this</code>','<code>this</code>','<code>this</code>','<code>self</code>','<code>this</code>','<code>this</code> (указатель)'],
    ['Вызов базового','<code>super.f()</code>','<code>base.F()</code>','<code>super.f()</code>','<code>super().f()</code>','<code>super.f()</code>','<code>B::f()</code>'],
    ['Переопределение','<code>@Override</code>','<code>virtual</code>/<code>override</code>','<code>open</code>/<code>override</code>','просто определить','просто определить / <code>override</code>','<code>virtual</code>/<code>override</code>'],
    ['Класс данных','<code>record</code>','<code>record</code>','<code>data class</code>','<code>@dataclass</code>','—','<code>struct</code>']])}
  <h2 style="margin-top:26px">Четыре столпа</h2>${t(['Принцип','Суть','Механизм'], [['Инкапсуляция','Скрыть устройство, защитить состояние','private, свойства, неизменяемость'],['Абстракция','Показать только существенное','Интерфейсы, абстрактные классы'],['Наследование','Новый класс на основе существующего (is-a)','extends, :, super'],['Полиморфизм','Один интерфейс — разные реализации','Виртуальные методы, интерфейсы, generics']])}
  <h2 style="margin-top:26px">SOLID</h2>${t(['Буква','Принцип','Признак нарушения'], [['S','Одна причина для изменения','Класс-«комбайн», Manager на 2000 строк'],['O','Расширять без изменения','switch по типу, правка при каждом новом варианте'],['L','Подкласс заменяет базовый','UnsupportedOperationException в наследнике'],['I','Маленькие интерфейсы','Пустые реализации ненужных методов'],['D','Зависеть от абстракций','new КонкретныйКласс() внутри бизнес-логики']])}
  <h2 style="margin-top:26px">Паттерны GoF</h2>${t(['Группа','Паттерн','Когда'], [['Порождающий','Фабричный метод','Класс объекта выбирается по условию'],['Порождающий','Строитель','Много необязательных параметров'],['Порождающий','Одиночка','Ровно один экземпляр (лучше — через DI)'],['Структурный','Адаптер','Чужой интерфейс → ваш'],['Структурный','Декоратор','Добавить поведение обёрткой'],['Структурный','Фасад','Простой вход в сложную подсистему'],['Поведенческий','Стратегия','Взаимозаменяемые алгоритмы'],['Поведенческий','Наблюдатель','Уведомить подписчиков о событии'],['Поведенческий','Команда','Очередь, история, отмена'],['Поведенческий','Шаблонный метод','Общий скелет, разные шаги'],['Поведенческий','Состояние','Поведение зависит от статуса']])}
  <h2 style="margin-top:26px">Равенство и ресурсы</h2>${t(['Язык','Тот же объект','Равны по значению','Освобождение ресурса'], [['Java','<code>==</code>','<code>equals</code> + <code>hashCode</code>','try-with-resources'],['C#','<code>ReferenceEquals</code>','<code>Equals</code> + <code>GetHashCode</code>','<code>using</code>'],['Python','<code>is</code>','<code>__eq__</code> + <code>__hash__</code>','<code>with</code>'],['Kotlin','<code>===</code>','<code>==</code>','<code>.use { }</code>'],['C++','сравнение адресов','<code>operator==</code>','RAII, деструктор']])}`;
}
