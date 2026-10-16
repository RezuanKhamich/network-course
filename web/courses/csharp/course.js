// Код, специфичный для курса «C#»: настройки, виджеты, сквозной сценарий, шпаргалки.
import { $, esc } from '../../assets/js/storage.js';
import { Game } from '../../assets/js/game.js';
import { findLesson } from '../../assets/js/engine.js';
export const COURSE = {
  id: 'csharp',
  title: 'C# и .NET для будущих ASP.NET-разработчиков',
  tagline: 'Язык C# и платформа .NET: типы, коллекции, LINQ, async/await, DI, конфигурация, JSON, HTTP, EF Core и тесты. Курс опирается на курс ООП и готовит к изучению ASP.NET Core.',
  journeyLabel: 'Путь к ASP.NET',
  brand: '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><path d="M13 2.5l9 5.2v10.6l-9 5.2-9-5.2V7.7z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M15.5 10.2a3.6 3.6 0 1 0 0 5.6" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round"/></svg>'
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

const ASYNC_STEPS = [
  { n:'запрос пришёл', c:'GET /orders/42 → поток #7 из пула', e:'Kestrel берёт свободный поток из пула и вызывает ваш обработчик.' },
  { n:'до await', c:'var order = await db.Orders.FindAsync(42);', e:'Код выполняется синхронно до первого await, который не завершился сразу: EF Core отправил SQL в базу.' },
  { n:'поток свободен', c:'поток #7 → обслуживает другой запрос', e:'Пока база отвечает 30 мс, метод «приостановлен», а поток вернулся в пул и работает на других клиентов.' },
  { n:'ответ БД', c:'продолжение → поток #3', e:'Когда пришёл ответ, продолжение метода ставится в очередь и выполняется на любом свободном потоке.' },
  { n:'второй await', c:'await http.GetAsync(...)', e:'Каждый await с реальным ожиданием снова освобождает поток.' },
  { n:'ответ клиенту', c:'200 OK { "id": 42, ... }', e:'Task завершается, фреймворк сериализует результат в JSON. Ни один поток не простаивал в ожидании.' }
];

const LINQ_DATA = [
  { name:'Книга', price:500, cat:'books', stock:true },
  { name:'Наушники', price:3500, cat:'audio', stock:true },
  { name:'Колонка', price:7000, cat:'audio', stock:false },
  { name:'Блокнот', price:150, cat:'books', stock:true },
  { name:'Кабель', price:300, cat:'audio', stock:true },
  { name:'Комикс', price:900, cat:'books', stock:false }
];
const LINQ_OPS = [
  { id:'where', code:'.Where(p => p.InStock)', f:xs => xs.filter(p => p.stock) },
  { id:'cheap', code:'.Where(p => p.Price < 1000)', f:xs => xs.filter(p => p.price < 1000) },
  { id:'order', code:'.OrderBy(p => p.Price)', f:xs => [...xs].sort((a, b) => a.price - b.price) },
  { id:'desc', code:'.OrderByDescending(p => p.Price)', f:xs => [...xs].sort((a, b) => b.price - a.price) },
  { id:'take', code:'.Take(2)', f:xs => xs.slice(0, 2) }
];

export const WIDGETS = {
  async(el){ stepWidget(el, ASYNC_STEPS); },
  linq(el){
    el.className = 'widget';
    const on = new Set(['where', 'order']);
    let tail = 'list';
    const tails = { list:['.ToList()', 'список'], names:['.Select(p => p.Name).ToList()', 'имена'], count:['.Count()', 'число'], sum:['.Sum(p => p.Price)', 'сумма'], groups:['.GroupBy(p => p.Category)', 'группы'] };
    const draw = () => {
      let xs = LINQ_DATA;
      LINQ_OPS.forEach(o => { if (on.has(o.id)) xs = o.f(xs); });
      let out;
      if (tail === 'count') out = `<b>${xs.length}</b>`;
      else if (tail === 'sum') out = `<b>${xs.reduce((s, p) => s + p.price, 0)}</b>`;
      else if (tail === 'names') out = `[ ${xs.map(p => '"' + esc(p.name) + '"').join(', ')} ]`;
      else if (tail === 'groups') { const g = {}; xs.forEach(p => (g[p.cat] = g[p.cat] || []).push(p.name)); out = Object.entries(g).map(([k, v]) => `${k}: ${v.map(esc).join(', ')}`).join('<br>') || '—'; }
      else out = xs.map(p => `{ ${esc(p.name)}, ${p.price}, ${p.cat}, ${p.stock ? 'в наличии' : 'нет'} }`).join('<br>') || '[ ]';
      const code = 'products' + LINQ_OPS.filter(o => on.has(o.id)).map(o => '\n    ' + o.code).join('') + '\n    ' + tails[tail][0];
      el.innerHTML = `<p class="small">Операторы цепочки (порядок фиксирован)</p><div class="row">${LINQ_OPS.map(o => `<button class="btn${on.has(o.id) ? '' : ' ghost'}" data-o="${o.id}">${esc(o.code)}</button>`).join('')}</div>
      <p class="small" style="margin-top:10px">Завершение</p><div class="row">${Object.entries(tails).map(([k, v]) => `<button class="btn${k === tail ? '' : ' ghost'}" data-t="${k}">${v[1]}</button>`).join('')}</div>
      <pre style="margin-top:12px"><code>${esc(code)}</code></pre><div style="font:13px var(--f-mono);padding:8px;border-radius:6px;background:var(--accent-soft)">${out}</div>`;
      el.querySelectorAll('[data-o]').forEach(b => b.onclick = () => { on.has(b.dataset.o) ? on.delete(b.dataset.o) : on.add(b.dataset.o); draw(); });
      el.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { tail = b.dataset.t; draw(); });
    };
    draw();
  },
  lifetimes(el){
    el.className = 'widget';
    let life = 'Scoped';
    const draw = () => {
      let n = 0; const single = life === 'Singleton' ? ++n : 0; const ids = [];
      for (let r = 1; r <= 2; r++) {
        const scoped = life === 'Scoped' ? ++n : 0;
        const row = [];
        for (let k = 0; k < 2; k++) row.push(life === 'Singleton' ? single : life === 'Scoped' ? scoped : ++n);
        ids.push(row);
      }
      const desc = { Singleton:'Один экземпляр на всё приложение: оба запроса и оба потребителя получают #1.', Scoped:'Внутри одного запроса — общий экземпляр, у следующего запроса — свой.', Transient:'Каждое внедрение создаёт новый экземпляр.' };
      el.innerHTML = `<div class="row">${['Singleton', 'Scoped', 'Transient'].map(l => `<button class="btn${l === life ? '' : ' ghost'}" data-l="${l}">${l}</button>`).join('')}</div>
      <pre style="margin-top:12px"><code>services.Add${life}&lt;ICart, Cart&gt;();</code></pre>
      <div class="calc">${ids.map((row, r) => `<div><span>HTTP-запрос ${r + 1}: Controller / Service</span><b>Cart #${row[0]} / #${row[1]}</b></div>`).join('')}</div>
      <p class="small">${desc[life]}</p>`;
      el.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { life = b.dataset.l; draw(); });
    };
    draw();
  }
};

export function viewTools(){
  return `<div class="crumbs"><a href="#/">главная</a> / инструменты</div><h1>Инструменты</h1>
  <p class="small" style="margin-top:8px">Теория ООП, на которую опирается курс: <a href="../oop/">курс «Объектно-ориентированное программирование»</a>.</p>
  <h2 style="margin-top:26px">LINQ-песочница</h2><p class="small">Подробно — в модуле 6.</p><div data-widget="linq"></div>
  <h2 style="margin-top:26px">Время жизни сервисов DI</h2><p class="small">Подробно — в модуле 9.</p><div data-widget="lifetimes"></div>
  <h2 style="margin-top:26px">async/await в веб-запросе</h2><p class="small">Подробно — в модуле 8.</p><div data-widget="async"></div>`;
}

// ====== СКВОЗНОЙ СЦЕНАРИЙ ======
const JOURNEY = [
 { t:'Проект и решение', l:'.NET · CLI', d:'Создаём решение каталога товаров: библиотека Shop.Core, консольное приложение и тесты. Всё — командами dotnet.', code:'dotnet new sln -n Shop\ndotnet new classlib -o src/Shop.Core', lesson:'0-4' },
 { t:'Модель товара', l:'C# · типы', d:'Product — класс со свойствами и required Name; цена в decimal; Money — неизменяемый record.', code:'public record Money(decimal Amount, string Currency);', lesson:'4-2' },
 { t:'Без null-сюрпризов', l:'C# · nullable', d:'Описание товара необязательно — string?. Поиск возвращает Product?, и компилятор заставляет обработать «не найдено».', lesson:'4-3' },
 { t:'Каталог в памяти', l:'Коллекции', d:'Dictionary по id для быстрого поиска, List для порядка показа.', code:'private readonly Dictionary<int, Product> _byId = new();', lesson:'2-4' },
 { t:'Интерфейс репозитория', l:'ООП в C#', d:'IProductRepository отделяет логику от хранения. Сейчас реализация InMemory, потом — EF Core.', code:'public interface IProductRepository { Task<Product?> FindAsync(int id, CancellationToken ct); }', lesson:'3-4' },
 { t:'Поиск и фильтры', l:'LINQ', d:'Фильтр по цене и категории, сортировка, пагинация Skip/Take и проекция в DTO.', code:'.Where(p => p.Price < max).OrderBy(p => p.Name).Skip(skip).Take(20)', lesson:'6-1' },
 { t:'Асинхронность', l:'async/await', d:'Все методы репозитория асинхронные и принимают CancellationToken — так же будет в API.', lesson:'8-2' },
 { t:'Ошибки', l:'Исключения', d:'Нарушения правил — доменные исключения; «не найдено» — null. Ресурсы закрываются через using.', lesson:'7-2' },
 { t:'Сборка через DI', l:'Host · DI', d:'Generic Host регистрирует сервисы, читает настройки в IOptions и пишет структурные логи.', code:'builder.Services.AddScoped<IProductRepository, InMemoryProductRepository>();', lesson:'9-1' },
 { t:'База данных', l:'EF Core', d:'Вторая реализация репозитория на EF Core и SQLite, миграции. Логика не изменилась — DIP работает.', lesson:'10-4' },
 { t:'Тесты', l:'xUnit', d:'Сервис каталога тестируется с подменой репозитория; правила цен — Theory с набором данных.', lesson:'11-2' },
 { t:'Это уже ASP.NET', l:'Web API', d:'Меняем Host на WebApplication и добавляем эндпойнты. DI, конфигурация, логи, EF Core и async остаются теми же.', code:'app.MapGet("/products/{id}", async (int id, IProductRepository r, CancellationToken ct) =>\n    await r.FindAsync(id, ct) is { } p ? Results.Ok(p) : Results.NotFound());', lesson:'11-4' }
];
let journeyStep = 0;
export function viewJourney(){
  return `<div class="crumbs"><a href="#/">главная</a> / сквозной сценарий</div><h1>Путь к ASP.NET</h1>
  <p style="margin:10px 0 20px;max-width:75ch">Каталог товаров от пустого решения до веб-API: как каждая тема курса превращается в часть будущего ASP.NET-приложения. Каждый шаг ведёт в урок, где он разобран подробно.</p>
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
  <p class="small" style="margin-top:8px">Общие принципы ООП, SOLID и паттерны — в <a href="../oop/#/cheats">шпаргалках курса ООП</a>.</p>
  <h2 style="margin-top:26px">dotnet CLI</h2>${t(['Команда','Что делает'], [['<code>dotnet new console|classlib|webapi|xunit -n X</code>','Новый проект'],['<code>dotnet new sln</code> / <code>dotnet sln add p</code>','Решение и добавление проекта'],['<code>dotnet add reference ../X</code>','Ссылка на проект'],['<code>dotnet add package X</code>','NuGet-пакет'],['<code>dotnet build</code> / <code>run</code> / <code>test</code>','Сборка / запуск / тесты'],['<code>dotnet publish -c Release</code>','Публикация'],['<code>dotnet ef migrations add X</code>','Миграция EF Core'],['<code>dotnet user-secrets set K V</code>','Секрет разработки']])}
  <h2 style="margin-top:26px">ООП-синтаксис C#</h2>${t(['Задача','Запись'], [['Наследование','<code>class B : A</code>, <code>: base(x)</code>'],['Переопределение','<code>virtual</code> в базе, <code>override</code> в наследнике'],['Запрет наследования','<code>sealed</code>'],['Интерфейс','<code>interface IRepo</code>, <code>class Repo : IRepo</code>'],['Свойства','<code>{ get; set; }</code>, <code>{ get; init; }</code>, <code>required</code>'],['Первичный конструктор','<code>class Svc(IRepo repo)</code>'],['Класс-значение','<code>record Money(decimal Amount, string Cur)</code>'],['Копия с изменением','<code>m with { Amount = 5 }</code>']])}
  <h2 style="margin-top:26px">LINQ</h2>${t(['Метод','Что делает'], [['<code>Where</code>','Фильтр'],['<code>Select</code> / <code>SelectMany</code>','Проекция / расплющивание'],['<code>OrderBy</code>, <code>ThenBy</code>','Сортировка'],['<code>Skip</code>, <code>Take</code>','Пагинация'],['<code>GroupBy</code>, <code>ToDictionary</code>','Группировка, словарь'],['<code>Any</code>, <code>All</code>, <code>Count</code>','Проверки и подсчёт'],['<code>First(OrDefault)</code>, <code>Single</code>','Один элемент'],['<code>Sum</code>, <code>Max</code>, <code>MaxBy</code>','Агрегаты'],['<code>ToList</code>, <code>ToArray</code>','Материализация']])}
  <h2 style="margin-top:26px">async/await</h2>${t(['Правильно','Неправильно'], [['<code>async Task</code>','<code>async void</code> (кроме обработчиков событий)'],['<code>await x</code>','<code>x.Result</code>, <code>x.Wait()</code>'],['<code>await Task.Delay(ms, ct)</code>','<code>Thread.Sleep(ms)</code>'],['<code>await Task.WhenAll(a, b)</code>','последовательные await для независимых задач'],['передавать <code>CancellationToken</code>','игнорировать отмену'],['<code>SemaphoreSlim.WaitAsync</code>','<code>await</code> внутри <code>lock</code>']])}
  <h2 style="margin-top:26px">DI: время жизни</h2>${t(['Время жизни','Экземпляр','Примеры'], [['Singleton','Один на приложение','Кэш, TimeProvider, конфигурация'],['Scoped','Один на HTTP-запрос','DbContext, репозитории, сервисы'],['Transient','Новый при каждом внедрении','Лёгкие сервисы без состояния']])}
  <h2 style="margin-top:26px">Типы</h2>${t(['Тип','Когда'], [['<code>int</code>, <code>long</code>','Целые, счётчики, id'],['<code>decimal</code>','Деньги'],['<code>double</code>','Измерения, математика'],['<code>string</code> / <code>string?</code>','Текст / может отсутствовать'],['<code>DateTime</code> (UTC), <code>DateTimeOffset</code>','Время'],['<code>Guid</code>','Уникальные идентификаторы'],['<code>record</code>','DTO, объекты-значения'],['<code>struct</code>','Маленькие значения']])}`;
}
