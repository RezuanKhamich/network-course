// Код, специфичный для курса «ASP.NET Core»: настройки, виджеты, сквозной сценарий, шпаргалки.
const COURSE = {
  id: 'aspnet',
  title: 'ASP.NET Core: веб-API на .NET',
  tagline: 'Конвейер middleware, Minimal API и контроллеры, валидация и ProblemDetails, EF Core в вебе, проектирование API, аутентификация и авторизация, кэш, фоновые задачи, SignalR, тесты и деплой. Опирается на курсы ООП и C#.',
  journeyLabel: 'Строим API магазина',
  brand: '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><circle cx="13" cy="13" r="10" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 13h20M13 3c3 3 4.5 6.5 4.5 10S16 20 13 23M13 3c-3 3-4.5 6.5-4.5 10S10 20 13 23" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="13" cy="13" r="2.4" fill="var(--accent)"/></svg>'
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

const REQUEST_STEPS = [
  { n:'Kestrel', c:'GET /api/products/42  Authorization: Bearer eyJ…', e:'Сервер принял соединение, разобрал HTTP и создал HttpContext.' },
  { n:'DI scope', c:'scope #1873: ShopDb, ProductService…', e:'Создана область для Scoped-сервисов этого запроса.' },
  { n:'ExceptionHandler', c:'try { await next(ctx); } catch → ProblemDetails', e:'Первый middleware оборачивает всё остальное и превратит исключение в 500 / ProblemDetails.' },
  { n:'Routing', c:'/api/products/{id:int} → GetById, id = 42', e:'Выбран эндпойнт; его метаданные (авторизация, CORS) теперь видны следующим middleware.' },
  { n:'Authentication', c:'JWT валиден → User: sub=7, role=Customer', e:'Токен проверен, HttpContext.User заполнен claims.' },
  { n:'Authorization', c:'RequireAuthorization() → ✓', e:'Политика эндпойнта выполнена; иначе — 401 или 403 без вызова вашего кода.' },
  { n:'Привязка', c:'int id = 42, IProductService (DI), CancellationToken', e:'Параметры обработчика заполнены из маршрута, DI и контекста.' },
  { n:'Ваш код', c:'await svc.GetAsync(42, ct) → ProductDto', e:'Сервис идёт в БД через EF Core и возвращает DTO.' },
  { n:'Ответ', c:'200 OK  application/json  { "id": 42, … }', e:'Результат сериализован в JSON и уходит назад через конвейер; scope освобождён, DbContext получил Dispose.' }
];

const MW = [
  { id:'ex', name:'UseExceptionHandler', rank:1 },
  { id:'https', name:'UseHttpsRedirection', rank:2 },
  { id:'routing', name:'UseRouting', rank:3 },
  { id:'cors', name:'UseCors', rank:4 },
  { id:'authn', name:'UseAuthentication', rank:5 },
  { id:'authz', name:'UseAuthorization', rank:6 }
];

const CODES = [
  ['200', 'OK', 'Успешный GET или изменение с телом ответа.'],
  ['201', 'Created', 'Ресурс создан. Добавьте Location с адресом нового ресурса.'],
  ['202', 'Accepted', 'Задача принята в фоновую обработку, результат будет позже.'],
  ['204', 'No Content', 'Успех без тела: DELETE, PUT.'],
  ['304', 'Not Modified', 'Условный GET: у клиента актуальная копия (ETag).'],
  ['400', 'Bad Request', 'Неверный формат или не прошла валидация полей. ValidationProblemDetails.'],
  ['401', 'Unauthorized', 'Нет или неверная аутентификация: «я не знаю, кто вы».'],
  ['403', 'Forbidden', 'Пользователь известен, но прав нет.'],
  ['404', 'Not Found', 'Ресурса нет — или его существование нужно скрыть.'],
  ['409', 'Conflict', 'Конфликт состояния: дубликат, устаревшая версия.'],
  ['412', 'Precondition Failed', 'If-Match не совпал с текущей версией ресурса.'],
  ['422', 'Unprocessable Content', 'Формально корректно, но нарушено бизнес-правило.'],
  ['429', 'Too Many Requests', 'Превышен лимит частоты, смотрите Retry-After.'],
  ['500', 'Internal Server Error', 'Непредвиденная ошибка сервера — это баг.'],
  ['503', 'Service Unavailable', 'Временно недоступно: перегрузка, обслуживание, зависимость лежит.']
];

const ROUTES = [
  { t:'/api/products', re:/^\/api\/products\/?$/, vals:() => ({}) },
  { t:'/api/products/featured', re:/^\/api\/products\/featured$/, vals:() => ({}) },
  { t:'/api/products/{id:int}', re:/^\/api\/products\/(-?\d+)$/, vals:m => ({ id:+m[1] }) },
  { t:'/api/products/{slug}', re:/^\/api\/products\/([^/]+)$/, vals:m => ({ slug:decodeURIComponent(m[1]) }) },
  { t:'/api/orders/{id:guid}/items', re:/^\/api\/orders\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/items$/i, vals:m => ({ id:m[1] }) },
  { t:'/files/{*path}', re:/^\/files\/(.+)$/, vals:m => ({ path:m[1] }) }
];

const b64u = s => btoa(unescape(encodeURIComponent(s))).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
const SAMPLE_JWT = [b64u('{"alg":"HS256","typ":"JWT"}'), b64u('{"sub":"42","email":"anna@shop.example","role":"Customer","iss":"https://auth.shop.example","aud":"shop-api","iat":1767222000,"exp":1767222900}'), 'SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'].join('.');

const WIDGETS = {
  request(el){ stepWidget(el, REQUEST_STEPS); },
  pipeline(el){
    el.className = 'widget';
    let order = ['authz', 'ex', 'routing', 'authn', 'cors', 'https'];
    const draw = () => {
      const items = order.map(id => MW.find(m => m.id === id));
      const problems = [];
      const pos = id => order.indexOf(id);
      if (pos('ex') !== 0) problems.push('UseExceptionHandler не первым: исключения более ранних компонентов не превратятся в ProblemDetails.');
      if (pos('authz') < pos('authn')) problems.push('Авторизация раньше аутентификации: пользователь ещё анонимный, защищённые эндпойнты вернут 401.');
      if (pos('cors') > pos('authn')) problems.push('CORS после аутентификации: preflight OPTIONS без токена может получить 401.');
      if (pos('authz') < pos('routing')) problems.push('Авторизация до маршрутизации: неизвестно, какой эндпойнт и какая у него политика.');
      if (pos('https') > pos('authn')) problems.push('Редирект на HTTPS после аутентификации: учётные данные уже могли уйти по HTTP.');
      el.innerHTML = `<p class="small">Перемещайте компоненты стрелками, пока конвейер не станет корректным.</p>
      <div style="display:flex;flex-direction:column;gap:6px;font:13px var(--f-mono)">${items.map((m, i) => `<div style="display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;background:var(--accent-soft)"><span style="flex:1">${i + 1}. app.${m.name}()</span><button class="btn ghost" data-u="${i}" ${i === 0 ? 'disabled' : ''} aria-label="Выше">↑</button><button class="btn ghost" data-dn="${i}" ${i === items.length - 1 ? 'disabled' : ''} aria-label="Ниже">↓</button></div>`).join('')}</div>
      <div style="margin-top:12px">${problems.length ? problems.map(p => `<div style="padding:6px 8px;margin-top:4px;border-radius:6px;background:var(--bad-soft)">${esc(p)}</div>`).join('') : '<div style="padding:8px;border-radius:6px;background:var(--ok-soft)"><b>Порядок корректный.</b> Запрос пройдёт: ошибки → HTTPS → маршрут → CORS → кто → права → эндпойнт.</div>'}</div>`;
      const swap = (i, j) => { [order[i], order[j]] = [order[j], order[i]]; draw(); };
      el.querySelectorAll('[data-u]').forEach(b => b.onclick = () => swap(+b.dataset.u, +b.dataset.u - 1));
      el.querySelectorAll('[data-dn]').forEach(b => b.onclick = () => swap(+b.dataset.dn, +b.dataset.dn + 1));
    };
    draw();
  },
  route(el){
    el.className = 'widget';
    const id = 'rt' + Math.random().toString(36).slice(2, 6);
    el.innerHTML = `<p class="small">Зарегистрированные маршруты:</p><pre><code>${ROUTES.map(r => esc(r.t)).join('\n')}</code></pre>
    <label for="${id}" class="small">Путь запроса</label><div class="row"><input type="text" id="${id}" value="/api/products/42" style="font-family:var(--f-mono);max-width:360px" autocomplete="off"></div>
    <p class="small">Попробуйте: /api/products/featured, /api/products/kniga, /api/orders/3f2504e0-4f89-11d3-9a0c-0305e82c3301/items, /files/img/a.png, /api/users</p><div class="out"></div>`;
    const inp = el.querySelector('input'), out = el.querySelector('.out');
    const calc = () => {
      const path = inp.value.trim().split('?')[0];
      const hits = ROUTES.map((r, i) => ({ r, i, m: path.match(r.re) })).filter(x => x.m);
      if (!hits.length) { out.innerHTML = '<div style="padding:8px;border-radius:6px;background:var(--bad-soft)"><b>404 Not Found</b> — ни один шаблон не совпал.</div>'; return; }
      const win = hits[0];
      out.innerHTML = `<div style="padding:8px;border-radius:6px;background:var(--ok-soft);font:13px var(--f-mono)">Эндпойнт: <b>${esc(win.r.t)}</b><br>Значения: ${esc(JSON.stringify(win.r.vals(win.m)))}</div>
      ${hits.length > 1 ? `<p class="small" style="margin-top:8px">Подходили также: ${hits.slice(1).map(h => esc(h.r.t)).join(', ')}. Выбран более конкретный: литерал важнее параметра, параметр с ограничением важнее параметра без него.</p>` : ''}`;
    };
    inp.addEventListener('input', calc); calc();
  },
  codes(el){
    el.className = 'widget';
    el.innerHTML = `<div class="row">${CODES.map((c, i) => `<button class="btn ghost" data-i="${i}" style="font-family:var(--f-mono)">${c[0]}</button>`).join('')}</div><div class="out" style="margin-top:12px"></div>`;
    const show = i => {
      el.querySelectorAll('[data-i]').forEach(b => b.className = 'btn' + (+b.dataset.i === i ? '' : ' ghost'));
      const c = CODES[i], cls = c[0][0] === '2' || c[0][0] === '3' ? 'ok' : c[0][0] === '4' ? 'warn' : 'bad';
      el.querySelector('.out').innerHTML = `<div style="padding:10px;border-radius:6px;background:var(--${cls}-soft)"><b style="font-family:var(--f-mono)">${c[0]} ${esc(c[1])}</b><br>${esc(c[2])}</div>`;
    };
    el.querySelectorAll('[data-i]').forEach(b => b.onclick = () => show(+b.dataset.i)); show(0);
  },
  jwt(el){
    el.className = 'widget';
    const id = 'jw' + Math.random().toString(36).slice(2, 6);
    el.innerHTML = `<label for="${id}" class="small">JWT (вставьте свой или используйте пример)</label><textarea id="${id}" rows="3" style="width:100%;font-family:var(--f-mono);font-size:12px" spellcheck="false">${SAMPLE_JWT}</textarea><div class="out"></div>`;
    const ta = el.querySelector('textarea'), out = el.querySelector('.out');
    const dec = s => decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '='))));
    const calc = () => {
      const parts = ta.value.trim().split('.');
      try {
        if (parts.length !== 3) throw 0;
        const h = JSON.parse(dec(parts[0])), p = JSON.parse(dec(parts[1]));
        const t = v => typeof v === 'number' ? new Date(v * 1000).toISOString().replace('T', ' ').slice(0, 19) + ' UTC' : '';
        out.innerHTML = `<div class="calc"><div><span>header</span><b style="font-size:12px">${esc(JSON.stringify(h))}</b></div>${Object.entries(p).map(([k, v]) => `<div><span>${esc(k)}</span><b style="font-size:12px">${esc(String(v))}${['exp', 'iat', 'nbf'].includes(k) ? ' · ' + t(v) : ''}</b></div>`).join('')}<div><span>signature</span><b style="font-size:12px">${esc(parts[2].slice(0, 16))}…</b></div></div>
        <p class="small">Payload прочитан без всякого ключа — это просто Base64URL. Проверить подпись может только сервер, знающий ключ. Срок жизни этого токена: ${p.exp && p.iat ? Math.round((p.exp - p.iat) / 60) + ' мин' : '—'}.</p>`;
      } catch (e) { out.innerHTML = '<p class="small" style="color:var(--bad)">Это не похоже на JWT: нужно три части Base64URL через точку.</p>'; }
    };
    ta.addEventListener('input', calc); calc();
  }
};

function viewTools(){
  return `<div class="crumbs"><a href="#/">главная</a> / инструменты</div><h1>Инструменты</h1>
  <p class="small" style="margin-top:8px">Курс опирается на <a href="../oop/">курс ООП</a> и <a href="../csharp/">курс C#</a>.</p>
  <h2 style="margin-top:26px">Путь запроса</h2><p class="small">Подробно — в модуле 0.</p><div data-widget="request"></div>
  <h2 style="margin-top:26px">Собери конвейер middleware</h2><p class="small">Подробно — в модуле 1.</p><div data-widget="pipeline"></div>
  <h2 style="margin-top:26px">Сопоставление маршрутов</h2><p class="small">Подробно — в модуле 2.</p><div data-widget="route"></div>
  <h2 style="margin-top:26px">Коды ответов API</h2><p class="small">Подробно — в модуле 4.</p><div data-widget="codes"></div>
  <h2 style="margin-top:26px">Разбор JWT</h2><p class="small">Подробно — в модуле 7.</p><div data-widget="jwt"></div>`;
}

// ====== СКВОЗНОЙ СЦЕНАРИЙ ======
const JOURNEY = [
 { t:'Новый проект', l:'Хост', d:'dotnet new webapi, решение со слоями Api / Application / Domain / Infrastructure и тестами.', code:'dotnet new webapi -n Shop.Api', lesson:'0-3' },
 { t:'Конвейер', l:'Middleware', d:'Обработчик ошибок, HTTPS, CORS для фронтенда, аутентификация и авторизация — в правильном порядке.', lesson:'1-2' },
 { t:'Каталог', l:'Minimal API', d:'Группа /api/products: список с фильтрами, товар по id, создание и удаление. TypedResults и DTO.', code:'app.MapGroup("/api/products").MapProductEndpoints();', lesson:'2-4' },
 { t:'Валидация', l:'Ошибки', d:'FluentValidation для запросов, единый ProblemDetails и IExceptionHandler для доменных исключений.', lesson:'4-3' },
 { t:'База данных', l:'EF Core', d:'PostgreSQL, конфигурации сущностей, миграции через bundle в пайплайне, проекции без N+1.', lesson:'5-3' },
 { t:'Контракт', l:'Дизайн API', d:'REST-ресурсы, OpenAPI-описание, сгенерированный TypeScript-клиент для фронтенда.', lesson:'6-3' },
 { t:'Вход', l:'Аутентификация', d:'Identity с JWT-эндпойнтами /login и /refresh; ICurrentUser для сервисов.', lesson:'7-3' },
 { t:'Свои заказы', l:'Авторизация', d:'Fallback-политика «только вошедшие», проверка владельца заказа, политика Admin для управления каталогом, rate limit на вход.', code:'.Where(o => o.Id == id && o.CustomerId == user.Id)', lesson:'8-2' },
 { t:'Скорость', l:'Кэш', d:'HybridCache для категорий, output cache для каталога со сбросом по тегу при изменении товара.', lesson:'9-1' },
 { t:'Письма', l:'Фон', d:'Подтверждение заказа уходит из BackgroundService через очередь; запрос не ждёт SMTP.', lesson:'9-3' },
 { t:'Живой статус', l:'SignalR', d:'Когда склад меняет статус заказа, клиент видит это сразу через хаб.', lesson:'10-1' },
 { t:'Проверка', l:'Тесты', d:'Интеграционные тесты на WebApplicationFactory и Testcontainers: создание заказа, чужой заказ → 404.', lesson:'11-1' },
 { t:'Продакшен', l:'Деплой', d:'Dockerfile, health checks, OpenTelemetry, ForwardedHeaders, Data Protection в Redis. Готово к выкладке.', lesson:'11-4' }
];
let journeyStep = 0;
function viewJourney(){
  return `<div class="crumbs"><a href="#/">главная</a> / сквозной сценарий</div><h1>Строим API магазина</h1>
  <p style="margin:10px 0 20px;max-width:75ch">Интернет-магазин от пустого шаблона до готового к продакшену API. Каждый шаг ведёт в урок, где он разобран подробно.</p>
  <div class="journey"><ol class="jlist" id="jlist"></ol><div class="jcard" id="jcard"></div></div>`;
}
function mountJourney(){
  const draw = () => {
    $('#jlist').innerHTML = JOURNEY.map((s, i) => `<li><button class="${i === journeyStep ? 'on' : ''} ${i < journeyStep ? 'past' : ''}" data-i="${i}"><span class="port">${String(i + 1).padStart(2, '0')}</span><span>${esc(s.t)}</span><span class="tag muted">${esc(s.l)}</span></button></li>`).join('');
    const s = JOURNEY[journeyStep];
    if (journeyStep === JOURNEY.length - 1) Game.flag(COURSE.id + ':journey'); const L = findLesson(s.lesson);
    $('#jcard').innerHTML = `<div class="crumbs">шаг ${journeyStep + 1} из ${JOURNEY.length} · ${esc(s.l)}</div><h2>${esc(s.t)}</h2><p style="margin-top:10px">${esc(s.d)}</p>${s.code ? `<pre><code>${esc(s.code)}</code></pre>` : ''}<p class="small">Подробно: <a href="#/l/${s.lesson}">урок ${s.lesson.replace('-', '.')} «${esc(L ? L.title : '')}»</a></p><div class="row" style="margin-top:14px"><button class="btn ghost" data-d="-1" ${journeyStep === 0 ? 'disabled' : ''}>← Назад</button><button class="btn" data-d="1" ${journeyStep === JOURNEY.length - 1 ? 'disabled' : ''}>Следующий шаг →</button></div>`;
    $('#jlist').querySelectorAll('button').forEach(b => b.onclick = () => { journeyStep = +b.dataset.i; draw(); });
    $('#jcard').querySelectorAll('button[data-d]').forEach(b => b.onclick = () => { journeyStep += +b.dataset.d; draw(); });
  };
  draw();
}

// ====== ШПАРГАЛКИ ======
function viewCheats(){
  const t = (head, rows) => `<div class="tbl"><table><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
  return `<div class="crumbs"><a href="#/">главная</a> / шпаргалки</div><h1>Шпаргалки</h1>
  <p class="small" style="margin-top:8px">Язык, LINQ, async и DI — в <a href="../csharp/#/cheats">шпаргалках курса C#</a>; SOLID и паттерны — в <a href="../oop/#/cheats">шпаргалках курса ООП</a>.</p>
  <h2 style="margin-top:26px">Порядок middleware</h2>${t(['#','Middleware','Зачем'], [['1','<code>UseForwardedHeaders</code>','За прокси: реальный IP и схема'],['2','<code>UseExceptionHandler</code>','Ловит всё, что ниже'],['3','<code>UseHsts</code> / <code>UseHttpsRedirection</code>','Только HTTPS'],['4','<code>UseStaticFiles</code>','Файлы из wwwroot'],['5','<code>UseRouting</code>','Выбор эндпойнта'],['6','<code>UseCors</code>','До аутентификации'],['7','<code>UseAuthentication</code>','Кто вы'],['8','<code>UseAuthorization</code>','Что можно'],['9','<code>UseRateLimiter</code>, <code>UseOutputCache</code>','Ограничения и кэш'],['10','<code>Map…</code>','Эндпойнты']])}
  <h2 style="margin-top:26px">Minimal API</h2>${t(['Задача','Код'], [['Группа','<code>app.MapGroup("/api/x").WithTags("X")</code>'],['Авторизация','<code>.RequireAuthorization("Policy")</code> / <code>.AllowAnonymous()</code>'],['Параметры из query в объект','<code>[AsParameters] Query q</code>'],['Типизированный результат','<code>Results&lt;Ok&lt;T&gt;, NotFound&gt;</code>'],['Создан','<code>TypedResults.Created(uri, dto)</code>'],['Ошибка','<code>TypedResults.Problem(statusCode: 409, title: …)</code>'],['Фильтр','<code>.AddEndpointFilter&lt;F&gt;()</code>'],['Кэш / лимит','<code>.CacheOutput("P")</code>, <code>.RequireRateLimiting("P")</code>']])}
  <h2 style="margin-top:26px">Атрибуты контроллеров</h2>${t(['Атрибут','Смысл'], [['<code>[ApiController]</code>','Поведение API, автоматическая 400'],['<code>[Route("api/[controller]")]</code>','Маршрут класса'],['<code>[HttpGet("{id:int}")]</code>','Метод и маршрут действия'],['<code>[FromBody]</code>, <code>[FromQuery]</code>, <code>[FromRoute]</code>, <code>[FromHeader]</code>','Источник параметра'],['<code>[Authorize(Policy = "…")]</code>, <code>[AllowAnonymous]</code>','Авторизация'],['<code>[ProducesResponseType]</code>','Документация ответа']])}
  <h2 style="margin-top:26px">Коды ответов</h2>${t(['Код','Когда'], CODES.map(c => ['<code>' + c[0] + '</code> ' + esc(c[1]), esc(c[2])]))}
  <h2 style="margin-top:26px">EF Core в вебе</h2>${t(['Правильно','Неправильно'], [['DbContext — Scoped','DbContext — Singleton или в Task.WhenAll'],['<code>Select</code> в DTO в запросе','<code>ToList()</code>, потом фильтр в памяти'],['<code>AsNoTracking</code> для чтения','Отслеживание всего подряд'],['Проверка владельца в <code>Where</code>','<code>FindAsync(id)</code> без проверки'],['Миграции отдельным шагом CI/CD','<code>Migrate()</code> в каждой реплике'],['<code>IsRowVersion</code> + 409','Тихая перезапись чужих изменений']])}
  <h2 style="margin-top:26px">Безопасность API</h2>${t(['Мера','Как'], [['Закрыто по умолчанию','Fallback-политика RequireAuthenticatedUser'],['Чужие данные','Фильтр по владельцу / ресурсная авторизация'],['Overposting','Отдельные DTO на вход'],['Подбор','Rate limiting на /login'],['Транспорт','HTTPS + HSTS'],['Браузер','CORS только для своих источников'],['Ошибки','ProblemDetails без внутренностей, traceId'],['Секреты','Переменные окружения / хранилище, не appsettings']])}`;
}
