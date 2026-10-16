// Контент курса: модули, уроки, вопросы, глоссарий.
// Загружается до assets/js/engine.js; константы видны движку как глобальные.
// ====== КОНТЕНТ КУРСА ======
// Типы вопросов: single | multiple | order | match | input | analyze
export const MODULES = [
{
 id: 0, title: 'Как устроен ASP.NET Core', short: 'Путь запроса, Kestrel, WebApplication, Program.cs, окружения',
 lessons: [
 { id:'0-1', title:'Что такое ASP.NET Core', html:`
<p><b>ASP.NET Core</b> — фреймворк для серверных веб-приложений на .NET: REST и gRPC API, сайты с серверным рендерингом, приложения реального времени.</p>
<div class="note"><b>Курс опирается на два предыдущих.</b> Принципы проектирования, интерфейсы, DIP и паттерны — в <a href="../oop/">курсе ООП</a>. Язык C#, LINQ, async/await, DI-контейнер, конфигурация, логирование, EF Core и xUnit — в <a href="../csharp/">курсе C#</a>. Здесь мы их не повторяем, а сразу применяем; в уроках есть ссылки на нужные разделы. Если какая-то ссылка ведёт на незнакомую тему, вернитесь к ней.</div>
<p>Из чего состоит фреймворк:</p>
<div class="tbl"><table><tr><th>Часть</th><th>Что даёт</th></tr>
<tr><td>Хост</td><td>DI, конфигурация, логирование, жизненный цикл — <a href="../csharp/#/l/9-4">C# 9.4 «Generic Host»</a></td></tr>
<tr><td>Kestrel</td><td>Встроенный кроссплатформенный HTTP-сервер</td></tr>
<tr><td>Middleware</td><td>Конвейер обработки запроса: ошибки, HTTPS, аутентификация, CORS</td></tr>
<tr><td>Маршрутизация</td><td>Сопоставление URL с обработчиком (эндпойнтом)</td></tr>
<tr><td>Модели программирования</td><td>Minimal API, контроллеры, Razor Pages, MVC, Blazor, SignalR, gRPC</td></tr>
</table></div>
<p>Какую модель выбрать:</p>
<div class="tbl"><table><tr><th>Задача</th><th>Модель</th></tr>
<tr><td>JSON API для SPA или мобильного приложения</td><td>Minimal API или контроллеры</td></tr>
<tr><td>Сайт с HTML, формируемым на сервере</td><td>Razor Pages / MVC</td></tr>
<tr><td>Интерактивный UI на C# вместо JavaScript</td><td>Blazor</td></tr>
<tr><td>Чат, уведомления, живые дашборды</td><td>SignalR</td></tr>
<tr><td>Быстрое общение сервисов между собой</td><td>gRPC</td></tr>
</table></div>
<p>Основной фокус курса — <b>Web API</b>: это самый частый сценарий для бэкенд-разработчика. Остальные модели разобраны обзорно в модуле 10.</p>`,
 check: [
  { id:'q0-1a', type:'single', prompt:'Что такое Kestrel?', options:['Встроенный HTTP-сервер ASP.NET Core','ORM для баз данных','Шаблонизатор HTML','Система логирования'], answer:0, explanation:'Kestrel принимает HTTP-соединения и передаёт запросы в конвейер.' },
  { id:'q0-1b', type:'single', prompt:'Какую модель выбрать для JSON API мобильного приложения?', options:['Minimal API или контроллеры','Razor Pages','Blazor','SignalR'], answer:0, explanation:'Обе модели предназначены для Web API.' }
 ]},
 { id:'0-2', title:'Путь HTTP-запроса', html:`
<p>Что происходит, когда клиент вызывает <code>GET https://shop.example/api/products/42</code>:</p>
<ol class="steps">
<li><b>Сеть.</b> DNS, TCP, TLS — подробно в <a href="../network/">курсе «Сети»</a>. Часто перед приложением стоит обратный прокси или балансировщик (nginx, облачный LB, Kubernetes Ingress).</li>
<li><b>Kestrel</b> принимает соединение, разбирает HTTP и создаёт объект <code>HttpContext</code>: запрос, ответ, пользователь, сервисы.</li>
<li><b>Создаётся DI-область</b> (scope) — в ней будут жить Scoped-сервисы этого запроса (<a href="../csharp/#/l/9-2">C# 9.2</a>).</li>
<li><b>Middleware-конвейер</b>: обработка ошибок → HTTPS → статические файлы → маршрутизация → CORS → аутентификация → авторизация…</li>
<li><b>Маршрутизация</b> находит эндпойнт по шаблону <code>/api/products/{id}</code> и извлекает <code>id = 42</code>.</li>
<li><b>Привязка модели</b>: параметры обработчика заполняются из маршрута, query, тела, заголовков и DI.</li>
<li><b>Ваш код</b> выполняется и возвращает результат.</li>
<li><b>Сериализация</b> результата в JSON, ответ идёт обратно через middleware в обратном порядке.</li>
<li><b>Scope освобождается</b> — DbContext и другие Scoped-сервисы получают Dispose.</li>
</ol>
<div data-widget="request"></div>
<div class="note why"><b>HttpContext</b> — центральный объект запроса. В Minimal API и контроллерах он обычно не нужен напрямую: фреймворк сам достаёт из него параметры. Но в middleware вы работаете именно с ним: <code>context.Request.Path</code>, <code>context.Response.StatusCode</code>, <code>context.User</code>.</div>`,
 check: [
  { id:'q0-2a', type:'order', prompt:'Расставьте этапы обработки запроса.', options:['Kestrel принимает соединение','Middleware-конвейер','Маршрутизация находит эндпойнт','Привязка параметров','Выполнение вашего кода','Сериализация ответа'], answer:[0,1,2,3,4,5], explanation:'Сервер → конвейер → маршрут → параметры → код → ответ.' },
  { id:'q0-2b', type:'single', prompt:'Когда освобождаются Scoped-сервисы, например DbContext?', options:['В конце обработки HTTP-запроса','При остановке приложения','Сразу после создания','Никогда'], answer:0, explanation:'Scope живёт ровно один запрос.' }
 ]},
 { id:'0-3', title:'Program.cs: сборка приложения', html:`
<pre><code>$ dotnet new webapi -n Shop.Api
$ cd Shop.Api &amp;&amp; dotnet run
Now listening on: http://localhost:5123</code></pre>
<pre><code>var builder = WebApplication.CreateBuilder(args);     // 1. хост: конфигурация, логирование, DI

// 2. регистрация сервисов
builder.Services.AddOpenApi();
builder.Services.AddDbContext&lt;ShopDb&gt;(o =&gt; o.UseSqlite(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddScoped&lt;IProductService, ProductService&gt;();

var app = builder.Build();                             // 3. граница: сервисы зафиксированы

// 4. конвейер middleware и эндпойнты
if (app.Environment.IsDevelopment())
    app.MapOpenApi();
app.UseHttpsRedirection();

app.MapGet("/api/products/{id:int}", async (int id, IProductService svc, CancellationToken ct) =&gt;
    await svc.GetAsync(id, ct) is { } p ? Results.Ok(p) : Results.NotFound());

app.Run();                                             // 5. запуск сервера</code></pre>
<p>Две фазы, которые нельзя смешивать:</p>
<div class="tbl"><table><tr><th>До Build()</th><th>После Build()</th></tr>
<tr><td><code>builder.Services.Add…</code> — что существует в приложении</td><td><code>app.Use…</code>, <code>app.Map…</code> — как обрабатываются запросы</td></tr>
<tr><td><code>builder.Configuration</code>, <code>builder.Logging</code></td><td><code>app.Environment</code>, <code>app.Services</code></td></tr>
</table></div>
<p class="small">Все <code>AddXxx</code>/<code>UseXxx</code> — методы расширения (<a href="../csharp/#/l/5-4">C# 5.4</a>); лямбда с параметрами из DI — делегат (<a href="../csharp/#/l/5-2">C# 5.2</a>).</p>
<div class="note"><b>Растущий Program.cs.</b> Когда регистраций становится много, выносите их в свои методы расширения: <code>builder.Services.AddCatalog();</code>, <code>app.MapCatalogEndpoints();</code>.</div>`,
 check: [
  { id:'q0-3a', type:'single', prompt:'Где регистрируются сервисы в DI?', options:['В builder.Services до вызова Build()','После app.Run()','В app.Use…','В appsettings.json'], answer:0, explanation:'После Build() коллекция сервисов заморожена.' },
  { id:'q0-3b', type:'single', prompt:'Что делает app.Run() в конце Program.cs?', options:['Запускает веб-сервер и блокируется до остановки приложения','Регистрирует middleware','Выполняет один запрос','Компилирует проект'], answer:0, explanation:'Это точка, где приложение начинает принимать запросы.' }
 ]},
 { id:'0-4', title:'Окружения и launchSettings', html:`
<p>Приложение ведёт себя по-разному в разработке и продакшене. Окружение задаёт переменная <code>ASPNETCORE_ENVIRONMENT</code>: <code>Development</code>, <code>Staging</code>, <code>Production</code> (по умолчанию).</p>
<pre><code>// Properties/launchSettings.json — только для локального запуска, в продакшен не попадает
{
  "profiles": {
    "http": {
      "commandName": "Project",
      "applicationUrl": "http://localhost:5123",
      "environmentVariables": { "ASPNETCORE_ENVIRONMENT": "Development" }
    }
  }
}</code></pre>
<p>Что зависит от окружения:</p>
<ul>
<li>Загружается <code>appsettings.{Environment}.json</code> поверх <code>appsettings.json</code> (<a href="../csharp/#/l/9-3">C# 9.3</a>).</li>
<li>В Development подключаются User Secrets и подробные страницы ошибок.</li>
<li>В Development DI проверяет захваченные зависимости при старте.</li>
<li>Ваш код: <code>if (app.Environment.IsDevelopment()) app.MapOpenApi();</code></li>
</ul>
<h3>Адреса и порты</h3>
<pre><code>$ dotnet run --urls "http://0.0.0.0:8080"
$ ASPNETCORE_URLS=http://+:8080 dotnet Shop.Api.dll
$ ASPNETCORE_HTTP_PORTS=8080                   # так задан порт в официальных Docker-образах .NET 8+</code></pre>
<div class="note warn"><b>Никогда не включайте Development в продакшене.</b> Страница исключений покажет стек вызовов, пути на сервере и фрагменты кода любому пользователю.</div>
<h3>Горячая перезагрузка</h3>
<p><code>dotnet watch</code> пересобирает и перезапускает приложение при изменении файлов, а многие правки применяет без перезапуска.</p>`,
 check: [
  { id:'q0-4a', type:'single', prompt:'Какое окружение используется, если ASPNETCORE_ENVIRONMENT не задана?', options:['Production','Development','Staging','Test'], answer:0, explanation:'Безопасное значение по умолчанию.' },
  { id:'q0-4b', type:'single', prompt:'Попадает ли launchSettings.json в продакшен?', options:['Нет, он только для локального запуска из IDE и dotnet run','Да, он обязателен на сервере','Только в Docker','Только его секция Production'], answer:0, explanation:'На сервере используются переменные окружения и appsettings.' }
 ]}
 ],
 test: [
  { id:'t0-1', type:'match', prompt:'Сопоставьте задачу и модель программирования ASP.NET Core.', pairs:[['JSON API','Minimal API / контроллеры'],['HTML на сервере','Razor Pages'],['Живые уведомления','SignalR'],['Межсервисные вызовы с Protobuf','gRPC']], explanation:'Модели под разные задачи.', difficulty:1 },
  { id:'t0-2', type:'analyze', prompt:'Почему приложение падает при старте?', code:'var builder = WebApplication.CreateBuilder(args);\nvar app = builder.Build();\nbuilder.Services.AddScoped<IProductService, ProductService>();\napp.MapGet("/p", (IProductService s) => s.All());\napp.Run();', options:['Сервис регистрируется после Build() — коллекция уже заморожена','MapGet должен быть до Build','Нужно AddSingleton','Нет app.UseRouting()'], answer:0, explanation:'Регистрации — строго до Build().', difficulty:2 },
  { id:'t0-3', type:'single', prompt:'Какой объект описывает текущий HTTP-запрос и ответ?', options:['HttpContext','DbContext','WebApplication','IConfiguration'], answer:0, explanation:'Request, Response, User, RequestServices.', difficulty:1 },
  { id:'t0-4', type:'single', prompt:'Как запустить приложение на порту 8080 на всех интерфейсах?', options:['dotnet run --urls "http://0.0.0.0:8080"','dotnet run 8080','dotnet build --port 8080','Изменить launchSettings на сервере'], answer:0, explanation:'Или переменные ASPNETCORE_URLS / ASPNETCORE_HTTP_PORTS.', difficulty:2 },
  { id:'t0-5', type:'single', prompt:'Почему опасно запускать продакшен в окружении Development?', options:['Подробные страницы ошибок раскроют стек, пути и код','Он медленнее в 100 раз','Не работает HTTPS','Не загружается appsettings.json'], answer:0, explanation:'Это утечка внутренней информации.', difficulty:1 },
  { id:'t0-6', type:'single', prompt:'Что делает dotnet watch?', options:['Перезапускает или горячо обновляет приложение при изменении файлов','Следит за логами продакшена','Мониторит CPU','Запускает тесты по расписанию'], answer:0, explanation:'Ускоряет цикл разработки.', difficulty:1 },
  { id:'t0-7', type:'multiple', prompt:'Что настраивается на builder до Build()? (несколько ответов)', options:['builder.Services','builder.Configuration','builder.Logging','app.MapGet'], answer:[0,1,2], explanation:'Эндпойнты — после Build.', difficulty:1 },
  { id:'t0-8', type:'single', prompt:'Где обычно завершается TLS, если приложение работает за nginx или облачным балансировщиком?', options:['На прокси/балансировщике, а до Kestrel может идти HTTP','Всегда только в Kestrel','В браузере','В базе данных'], answer:0, explanation:'Тогда нужна настройка ForwardedHeaders (модуль 11).', difficulty:2 }
 ]
},
{
 id: 1, title: 'Конвейер middleware', short: 'Use, Run, Map, порядок, свой middleware, встроенные компоненты',
 lessons: [
 { id:'1-1', title:'Что такое middleware', html:`
<p><b>Middleware</b> — компонент конвейера. Каждый получает <code>HttpContext</code>, может что-то сделать, вызвать следующий компонент и что-то сделать после него.</p>
<pre><code>app.Use(async (context, next) =&gt;
{
    var sw = Stopwatch.StartNew();
    await next(context);                                 // передать дальше по конвейеру
    var ms = sw.ElapsedMilliseconds;                     // ответ уже сформирован
    app.Logger.LogInformation("{Method} {Path} → {Status} за {Ms} мс",
        context.Request.Method, context.Request.Path, context.Response.StatusCode, ms);
});

app.Run(async context =&gt;                                 // терминальный: next нет
    await context.Response.WriteAsync("Hello"));</code></pre>
<p>Конвейер похож на матрёшку: запрос идёт внутрь через все компоненты, ответ — обратно наружу.</p>
<pre><code>запрос →  [Ошибки → [HTTPS → [Auth → [Эндпойнт] ] ] ]
ответ  ←  [Ошибки ← [HTTPS ← [Auth ← [Эндпойнт] ] ] ]</code></pre>
<div class="tbl"><table><tr><th>Метод</th><th>Смысл</th></tr>
<tr><td><code>app.Use(...)</code></td><td>Middleware, который может вызвать следующий</td></tr>
<tr><td><code>app.Run(...)</code></td><td>Терминальный: конвейер на нём заканчивается</td></tr>
<tr><td><code>app.Map("/path", ...)</code></td><td>Ветка конвейера для пути</td></tr>
<tr><td><code>app.UseWhen(cond, ...)</code></td><td>Условная ветка, возвращающаяся в основной конвейер</td></tr>
</table></div>
<p class="small">Конвейер — это вариация «Цепочки обязанностей» и «Декоратора» (<a href="../oop/#/l/10-2">ООП 10.2</a>): каждый компонент оборачивает следующий. Технически это делегат <code>RequestDelegate</code> = <code>Func&lt;HttpContext, Task&gt;</code> (<a href="../csharp/#/l/5-2">C# 5.2</a>).</p>`,
 check: [
  { id:'q1-1a', type:'single', prompt:'Что произойдёт, если middleware не вызовет await next(context)?', options:['Конвейер прервётся: следующие компоненты и эндпойнт не выполнятся','Next вызовется автоматически','Будет ошибка компиляции','Запрос выполнится дважды'], answer:0, explanation:'Это «короткое замыкание» конвейера — так работают, например, статические файлы.' },
  { id:'q1-1b', type:'single', prompt:'Чем app.Run отличается от app.Use?', options:['Run — терминальный компонент без next','Run запускает сервер','Use нельзя использовать с async','Ничем'], answer:0, explanation:'Не путайте с app.Run() без аргументов в конце Program.cs.' }
 ]},
 { id:'1-2', title:'Порядок имеет значение', html:`
<p>Middleware выполняются в том порядке, в котором добавлены. Рекомендуемый порядок для API:</p>
<pre><code>app.UseExceptionHandler();      // 1. ловит исключения всех следующих
app.UseHsts();                  // 2. в продакшене
app.UseHttpsRedirection();      // 3.
app.UseStaticFiles();           // 4. отдаёт файлы и прерывает конвейер
app.UseRouting();               // 5. выбирает эндпойнт (неявно, если не указан)
app.UseCors();                  // 6. после Routing, до Auth
app.UseAuthentication();        // 7. кто ты?
app.UseAuthorization();         // 8. что тебе можно?
app.UseRateLimiter();           // 9.
app.MapControllers();           // эндпойнты
app.MapGet(...);</code></pre>
<div data-widget="pipeline"></div>
<p>Типичные ошибки порядка:</p>
<ul>
<li><code>UseExceptionHandler</code> не первым — исключения из более ранних компонентов не будут обработаны.</li>
<li><code>UseAuthorization</code> раньше <code>UseAuthentication</code> — пользователь ещё неизвестен, все запросы считаются анонимными.</li>
<li><code>UseCors</code> после авторизации — preflight-запрос OPTIONS получит 401.</li>
</ul>
<div class="note"><b>Маршрутизация и эндпойнты разделены.</b> <code>UseRouting</code> только <i>выбирает</i> эндпойнт, а выполняется он в конце конвейера. Поэтому middleware между ними (CORS, авторизация) уже знают, какой эндпойнт будет вызван, и могут прочитать его атрибуты — например, <code>[Authorize]</code>.</div>`,
 check: [
  { id:'q1-2a', type:'single', prompt:'Что должно идти раньше?', options:['UseAuthentication, затем UseAuthorization','UseAuthorization, затем UseAuthentication','Неважно','Только один из них'], answer:0, explanation:'Сначала узнаём пользователя, потом проверяем права.' },
  { id:'q1-2b', type:'single', prompt:'Почему UseExceptionHandler ставят первым?', options:['Чтобы он оборачивал все остальные компоненты и ловил их исключения','Так быстрее','Иначе не работает HTTPS','Он обязан быть последним'], answer:0, explanation:'Он ловит только то, что выброшено «внутри» него.' }
 ]},
 { id:'1-3', title:'Свой middleware', html:`
<p>Для чего-то большего, чем пара строк, middleware оформляют классом:</p>
<pre><code>public sealed class CorrelationIdMiddleware(RequestDelegate next, ILogger&lt;CorrelationIdMiddleware&gt; logger)
{
    private const string Header = "X-Correlation-Id";

    public async Task InvokeAsync(HttpContext context)          // можно внедрять Scoped-сервисы параметрами
    {
        var id = context.Request.Headers[Header].FirstOrDefault() ?? Guid.NewGuid().ToString("N");
        context.Response.Headers[Header] = id;

        using (logger.BeginScope(new Dictionary&lt;string, object&gt; { ["CorrelationId"] = id }))
            await next(context);
    }
}

// регистрация
app.UseMiddleware&lt;CorrelationIdMiddleware&gt;();</code></pre>
<ul>
<li>Конструктор вызывается <b>один раз</b> — middleware фактически Singleton. В конструктор внедряйте только Singleton-сервисы.</li>
<li>Scoped-сервисы (DbContext) принимайте параметрами <code>InvokeAsync</code> — они создаются на каждый запрос.</li>
<li>После того как ответ начал отправляться (<code>Response.HasStarted</code>), менять заголовки и статус нельзя.</li>
</ul>
<div class="note why"><b>Middleware или фильтр?</b> Middleware видит каждый запрос, включая статические файлы и 404. Если логика нужна только для определённых эндпойнтов и ей нужен доступ к аргументам действия — используйте фильтры эндпойнтов (модуль 2) или контроллеров (модуль 3).</div>`,
 check: [
  { id:'q1-3a', type:'single', prompt:'Куда внедрять DbContext в классе middleware?', options:['Параметром метода InvokeAsync','В конструктор','В статическое поле','Никуда, это запрещено'], answer:0, explanation:'Конструктор вызывается один раз — Scoped-сервис оказался бы захвачен.' },
  { id:'q1-3b', type:'single', prompt:'Почему нельзя поменять статус ответа после await next(context), если тело уже пишется?', options:['Заголовки и статус уже отправлены клиенту','Это ограничение C#','Статус всегда 200','Так требует CORS'], answer:0, explanation:'Проверяйте context.Response.HasStarted.' }
 ]},
 { id:'1-4', title:'Встроенные компоненты', html:`
<div class="tbl"><table><tr><th>Middleware</th><th>Задача</th></tr>
<tr><td><code>UseExceptionHandler</code></td><td>Перехват необработанных исключений → ProblemDetails (модуль 4)</td></tr>
<tr><td><code>UseHttpsRedirection</code>, <code>UseHsts</code></td><td>Принудительный HTTPS (модуль 8)</td></tr>
<tr><td><code>UseStaticFiles</code></td><td>Отдача файлов из <code>wwwroot</code></td></tr>
<tr><td><code>UseCors</code></td><td>Разрешение кросс-доменных запросов из браузера (модуль 8)</td></tr>
<tr><td><code>UseAuthentication</code> / <code>UseAuthorization</code></td><td>Кто пользователь и что ему можно (модули 7–8)</td></tr>
<tr><td><code>UseRateLimiter</code></td><td>Ограничение частоты запросов (модуль 8)</td></tr>
<tr><td><code>UseResponseCompression</code></td><td>gzip/brotli (модуль 9)</td></tr>
<tr><td><code>UseOutputCache</code></td><td>Кэш готовых ответов (модуль 9)</td></tr>
<tr><td><code>UseForwardedHeaders</code></td><td>Реальный IP и схема за прокси (модуль 11)</td></tr>
<tr><td><code>UseHttpLogging</code></td><td>Логирование запросов и ответов</td></tr>
</table></div>
<pre><code>// раздача SPA-фронтенда из wwwroot вместе с API
app.UseDefaultFiles();          // / → /index.html
app.UseStaticFiles();
app.MapFallbackToFile("index.html");   // клиентская маршрутизация React/Vue</code></pre>
<div class="note">Большинство middleware требуют регистрации сервисов: <code>builder.Services.AddCors(...)</code> + <code>app.UseCors()</code>, <code>AddRateLimiter</code> + <code>UseRateLimiter</code>. Пара <b>Add + Use</b> — общий шаблон ASP.NET Core.</div>`,
 check: [
  { id:'q1-4a', type:'single', prompt:'Из какой папки UseStaticFiles отдаёт файлы по умолчанию?', options:['wwwroot','bin','static','public'], answer:0, explanation:'Её можно переопределить.' },
  { id:'q1-4b', type:'single', prompt:'Что нужно для включения CORS?', options:['builder.Services.AddCors(...) и app.UseCors()','Только атрибут [Cors]','Ничего, включён по умолчанию','Настройка в nginx обязательно'], answer:0, explanation:'Шаблон Add + Use.' }
 ]}
 ],
 test: [
  { id:'t1-1', type:'analyze', prompt:'Что выведет в ответ запрос GET /?', code:'app.Use(async (ctx, next) => { await ctx.Response.WriteAsync("A"); await next(ctx); await ctx.Response.WriteAsync("D"); });\napp.Use(async (ctx, next) => { await ctx.Response.WriteAsync("B"); await next(ctx); });\napp.Run(async ctx => await ctx.Response.WriteAsync("C"));', options:['ABCD','ABDC','ACBD','DCBA'], answer:0, explanation:'Внутрь: A, B, C; на обратном пути — D.', difficulty:2 },
  { id:'t1-2', type:'single', prompt:'Почему preflight-запрос CORS получает 401?', options:['UseCors стоит после авторизации','CORS не поддерживает OPTIONS','Нет HTTPS','Неверный порт'], answer:0, explanation:'CORS должен обработать preflight раньше проверки прав.', difficulty:2 },
  { id:'t1-3', type:'single', prompt:'Каким временем жизни фактически обладает экземпляр класса middleware?', options:['Singleton — создаётся один раз','Scoped','Transient','Создаётся на каждый вызов next'], answer:0, explanation:'Поэтому Scoped-зависимости — в InvokeAsync.', difficulty:2 },
  { id:'t1-4', type:'order', prompt:'Расставьте middleware в рекомендуемом порядке.', options:['UseExceptionHandler','UseHttpsRedirection','UseRouting','UseCors','UseAuthentication','UseAuthorization'], answer:[0,1,2,3,4,5], explanation:'Ошибки → HTTPS → маршрут → CORS → кто → права.', difficulty:2 },
  { id:'t1-5', type:'single', prompt:'Что делает MapFallbackToFile("index.html")?', options:['Для неизвестных путей отдаёт index.html — нужно для клиентской маршрутизации SPA','Удаляет index.html','Перенаправляет на 404','Кэширует все файлы'], answer:0, explanation:'React/Vue-роутер сам разберёт путь.', difficulty:2 },
  { id:'t1-6', type:'single', prompt:'Какой тип у делегата, которым представлен конвейер?', options:['RequestDelegate (HttpContext → Task)','Action<string>','Func<int>','EventHandler'], answer:0, explanation:'Каждый middleware получает следующий RequestDelegate.', difficulty:2 },
  { id:'t1-7', type:'multiple', prompt:'Для чего подходит собственный middleware? (несколько ответов)', options:['Correlation ID для всех запросов','Замер времени каждого запроса','Добавление заголовков безопасности','Валидация аргумента конкретного эндпойнта'], answer:[0,1,2], explanation:'Последнее — задача фильтра эндпойнта.', difficulty:2 },
  { id:'t1-8', type:'single', prompt:'Как называется прерывание конвейера без вызова next?', options:['Короткое замыкание (short-circuit)','Deadlock','Boxing','Rollback'], answer:0, explanation:'Например, отдача статического файла.', difficulty:1 }
 ]
},
{
 id: 2, title: 'Маршрутизация и Minimal API', short: 'MapGet/MapPost, шаблоны маршрутов, привязка, группы, TypedResults, фильтры',
 lessons: [
 { id:'2-1', title:'Эндпойнты и шаблоны маршрутов', html:`
<pre><code>app.MapGet("/api/products", () =&gt; ...);                 // GET
app.MapPost("/api/products", (CreateProduct dto) =&gt; ...); // POST
app.MapPut("/api/products/{id}", ...);
app.MapPatch("/api/products/{id}", ...);
app.MapDelete("/api/products/{id}", ...);
app.MapMethods("/api/ping", ["HEAD", "OPTIONS"], ...);</code></pre>
<p>Шаблон маршрута:</p>
<div class="tbl"><table><tr><th>Шаблон</th><th>Совпадает с</th><th>Значения</th></tr>
<tr><td><code>/products/{id}</code></td><td><code>/products/42</code>, <code>/products/abc</code></td><td>id = "42"</td></tr>
<tr><td><code>/products/{id:int}</code></td><td><code>/products/42</code>; <code>/products/abc</code> → 404</td><td>id = 42</td></tr>
<tr><td><code>/files/{*path}</code></td><td><code>/files/a/b/c.txt</code></td><td>path = "a/b/c.txt"</td></tr>
<tr><td><code>/posts/{year:int}/{slug?}</code></td><td><code>/posts/2024</code>, <code>/posts/2024/hello</code></td><td>slug необязателен</td></tr>
<tr><td><code>/items/{id:guid}</code></td><td>только GUID</td><td></td></tr>
</table></div>
<p>Ограничения: <code>int</code>, <code>long</code>, <code>guid</code>, <code>bool</code>, <code>datetime</code>, <code>min(1)</code>, <code>max(100)</code>, <code>range(1,100)</code>, <code>length(3,20)</code>, <code>alpha</code>, <code>regex(...)</code>.</p>
<div data-widget="route"></div>
<div class="note warn"><b>Ограничения маршрута — не валидация.</b> <code>{id:int}</code> помогает выбрать нужный эндпойнт, но при несовпадении клиент получит 404, а не понятную 400. Бизнес-проверки делайте валидацией (модуль 4).</div>
<p>Если подходят несколько шаблонов, выигрывает более конкретный: литерал важнее параметра, параметр с ограничением важнее параметра без него.</p>`,
 check: [
  { id:'q2-1a', type:'single', prompt:'Что вернёт GET /products/abc при шаблоне /products/{id:int}?', options:['404 — маршрут не совпал','400 — ошибка валидации','id = 0','500'], answer:0, explanation:'Ограничение участвует в выборе маршрута.' },
  { id:'q2-1b', type:'single', prompt:'Какой шаблон поймает путь любой глубины /docs/a/b/c?', options:['/docs/{*path}','/docs/{path}','/docs/{path?}','/docs/*'], answer:0, explanation:'catch-all параметр со звёздочкой.' }
 ]},
 { id:'2-2', title:'Привязка параметров', html:`
<p>Параметры лямбды заполняются автоматически. Источник определяется по правилам:</p>
<pre><code>app.MapGet("/api/products/{id:int}",
    async (int id,                       // из маршрута — имя совпадает с {id}
           [FromQuery] string? fields,   // ?fields=name,price
           int page = 1,                 // простой тип не из маршрута → query
           [FromHeader(Name = "Accept-Language")] string? lang = null,
           IProductService svc,          // зарегистрирован в DI → из сервисов
           ClaimsPrincipal user,         // текущий пользователь
           CancellationToken ct) =&gt;      // отмена при обрыве соединения
    { ... });

app.MapPost("/api/products",
    async (CreateProductRequest body,    // сложный тип → тело запроса JSON
           IProductService svc) =&gt; { ... });</code></pre>
<div class="tbl"><table><tr><th>Атрибут</th><th>Источник</th></tr>
<tr><td><code>[FromRoute]</code></td><td>Значение из шаблона маршрута</td></tr>
<tr><td><code>[FromQuery]</code></td><td>Строка запроса</td></tr>
<tr><td><code>[FromBody]</code></td><td>Тело (JSON)</td></tr>
<tr><td><code>[FromHeader]</code></td><td>Заголовок</td></tr>
<tr><td><code>[FromForm]</code></td><td>Форма, файлы <code>IFormFile</code></td></tr>
<tr><td><code>[FromServices]</code></td><td>DI-контейнер</td></tr>
<tr><td><code>[AsParameters]</code></td><td>Свойства record'а собираются из разных источников</td></tr>
</table></div>
<pre><code>public record ProductQuery(string? Search, decimal? MaxPrice, int Page = 1, int Size = 20);
app.MapGet("/api/products", ([AsParameters] ProductQuery q, IProductService s) =&gt; s.Search(q));</code></pre>
<p class="small">Nullable-аннотации (<a href="../csharp/#/l/4-3">C# 4.3</a>) определяют обязательность: <code>string search</code> без значения в запросе → 400, <code>string? search</code> → null.</p>`,
 check: [
  { id:'q2-2a', type:'single', prompt:'Откуда Minimal API возьмёт параметр сложного типа CreateOrder в POST-обработчике?', options:['Из JSON-тела запроса','Из query','Из заголовков','Из DI'], answer:0, explanation:'Сложные типы по умолчанию — из тела.' },
  { id:'q2-2b', type:'single', prompt:'Параметр IOrderService зарегистрирован в DI. Откуда он будет взят?', options:['Из контейнера сервисов','Из тела запроса','Из маршрута','Будет ошибка'], answer:0, explanation:'Зарегистрированные сервисы распознаются автоматически.' }
 ]},
 { id:'2-3', title:'Результаты: Results и TypedResults', html:`
<pre><code>app.MapGet("/api/products/{id:int}",
    async Task&lt;Results&lt;Ok&lt;ProductDto&gt;, NotFound&gt;&gt; (int id, IProductService s, CancellationToken ct) =&gt;
    {
        var p = await s.GetAsync(id, ct);
        return p is null ? TypedResults.NotFound() : TypedResults.Ok(p);
    });

app.MapPost("/api/products", async (CreateProductRequest req, IProductService s, CancellationToken ct) =&gt;
{
    var created = await s.CreateAsync(req, ct);
    return TypedResults.Created($"/api/products/{created.Id}", created);   // 201 + Location
});</code></pre>
<div class="tbl"><table><tr><th>Результат</th><th>Код</th><th>Когда</th></tr>
<tr><td><code>Ok(value)</code></td><td>200</td><td>Успешное чтение / изменение с телом</td></tr>
<tr><td><code>Created(uri, value)</code></td><td>201</td><td>Ресурс создан</td></tr>
<tr><td><code>Accepted()</code></td><td>202</td><td>Принято в фоновую обработку</td></tr>
<tr><td><code>NoContent()</code></td><td>204</td><td>Успех без тела: DELETE, PUT</td></tr>
<tr><td><code>BadRequest()</code> / <code>ValidationProblem(...)</code></td><td>400</td><td>Неверные данные</td></tr>
<tr><td><code>Unauthorized()</code> / <code>Forbid()</code></td><td>401 / 403</td><td>Не аутентифицирован / нет прав</td></tr>
<tr><td><code>NotFound()</code></td><td>404</td><td>Ресурса нет</td></tr>
<tr><td><code>Conflict()</code></td><td>409</td><td>Конфликт состояния</td></tr>
<tr><td><code>Problem(...)</code></td><td>4xx/5xx</td><td>Ошибка в формате ProblemDetails</td></tr>
</table></div>
<p><code>TypedResults</code> лучше <code>Results</code>: тип возврата <code>Results&lt;Ok&lt;T&gt;, NotFound&gt;</code> известен компилятору, его проверяют тесты, и он автоматически попадает в OpenAPI-описание.</p>
<div class="note">Вернули из обработчика обычный объект — он сериализуется в JSON со статусом 200. Вернули <code>string</code> — уйдёт как <code>text/plain</code>.</div>`,
 check: [
  { id:'q2-3a', type:'single', prompt:'Какой код вернуть при успешном создании ресурса?', options:['201 Created с заголовком Location','200 OK','204 No Content','302 Found'], answer:0, explanation:'Location указывает адрес нового ресурса.' },
  { id:'q2-3b', type:'single', prompt:'Чем TypedResults лучше Results?', options:['Тип результата известен статически: проще тестировать и он попадает в OpenAPI','Он быстрее в 10 раз','Results устарел и не работает','TypedResults поддерживает только JSON'], answer:0, explanation:'Results<Ok<T>, NotFound> — проверяемая сигнатура.' }
 ]},
 { id:'2-4', title:'Группы, фильтры и организация кода', html:`
<pre><code>// Endpoints/ProductEndpoints.cs
public static class ProductEndpoints
{
    public static RouteGroupBuilder MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var g = app.MapGroup("/api/products")
                   .WithTags("Products")
                   .RequireAuthorization();          // применится ко всем эндпойнтам группы

        g.MapGet("/", GetAll).AllowAnonymous();
        g.MapGet("/{id:int}", GetById).WithName("GetProduct");
        g.MapPost("/", Create).AddEndpointFilter&lt;ValidationFilter&lt;CreateProductRequest&gt;&gt;();
        g.MapDelete("/{id:int}", Delete).RequireAuthorization("Admin");
        return g;
    }

    static async Task&lt;Ok&lt;List&lt;ProductDto&gt;&gt;&gt; GetAll(IProductService s, CancellationToken ct) =&gt;
        TypedResults.Ok(await s.AllAsync(ct));
    // GetById, Create, Delete — обычные статические методы: их легко тестировать
}

// Program.cs
app.MapProductEndpoints();</code></pre>
<h3>Фильтры эндпойнтов</h3>
<pre><code>public class ValidationFilter&lt;T&gt;(IValidator&lt;T&gt; validator) : IEndpointFilter
{
    public async ValueTask&lt;object?&gt; InvokeAsync(EndpointFilterInvocationContext ctx, EndpointFilterDelegate next)
    {
        var arg = ctx.Arguments.OfType&lt;T&gt;().First();
        var result = await validator.ValidateAsync(arg);
        if (!result.IsValid) return TypedResults.ValidationProblem(result.ToDictionary());
        return await next(ctx);                      // как middleware, но для одного эндпойнта
    }
}</code></pre>
<p>Фильтр видит аргументы обработчика, поэтому подходит для валидации, проверки владельца ресурса, аудита.</p>
<div class="note why"><b>Структура проекта на Minimal API.</b> Один файл <code>XxxEndpoints.cs</code> на ресурс, методы — тонкие: принять, вызвать сервис, вернуть результат. Логика — в сервисах (<a href="../oop/#/l/8-1">ООП 8.1 — SRP</a>).</div>`,
 check: [
  { id:'q2-4a', type:'single', prompt:'Что даёт MapGroup("/api/orders")?', options:['Общий префикс и общие настройки (авторизация, теги, фильтры) для набора эндпойнтов','Создаёт новый процесс','Объединяет базы данных','Кэширует ответы'], answer:0, explanation:'Меньше повторов и единые правила.' },
  { id:'q2-4b', type:'single', prompt:'Чем фильтр эндпойнта отличается от middleware?', options:['Работает только для своих эндпойнтов и видит их аргументы','Ничем','Выполняется до UseRouting','Не может вернуть ответ'], answer:0, explanation:'Middleware видит все запросы, но не аргументы.' }
 ]}
 ],
 test: [
  { id:'t2-1', type:'match', prompt:'Сопоставьте ситуацию и результат.', pairs:[['Товар удалён','204 NoContent'],['Товар не найден','404 NotFound'],['Заказ создан','201 Created'],['Email уже занят','409 Conflict']], explanation:'Коды отражают исход операции.', difficulty:1 },
  { id:'t2-2', type:'analyze', prompt:'Какой эндпойнт обработает GET /api/products/featured?', code:'app.MapGet("/api/products/{id}", ...);       // A\napp.MapGet("/api/products/featured", ...);   // B', options:['B — литерал конкретнее параметра','A — объявлен первым','Оба, будет ошибка неоднозначности','Никакой'], answer:0, explanation:'Порядок объявления не важен, важна конкретность.', difficulty:2 },
  { id:'t2-3', type:'single', prompt:'Как собрать параметры поиска (search, page, size) из query в один объект?', options:['[AsParameters] с record','[FromBody]','[FromServices]','Только по одному параметру'], answer:0, explanation:'Свойства record привязываются по своим правилам.', difficulty:2 },
  { id:'t2-4', type:'single', prompt:'Параметр string search (без ?) не передан в query. Что ответит Minimal API?', options:['400 Bad Request','search = null','search = ""','500'], answer:0, explanation:'Nullable-аннотации определяют обязательность.', difficulty:2 },
  { id:'t2-5', type:'input', prompt:'Сколько маршрутов совпадёт с /posts/2024 для шаблона /posts/{year:int}/{slug?}? Введите 0 или 1.', answer:['1'], explanation:'slug необязателен.', difficulty:1 },
  { id:'t2-6', type:'single', prompt:'Зачем WithName("GetProduct") у эндпойнта?', options:['Чтобы ссылаться на него при генерации URL, например в CreatedAtRoute','Для логов','Для авторизации','Для сортировки в Swagger'], answer:0, explanation:'Имя маршрута используется генератором ссылок.', difficulty:2 },
  { id:'t2-7', type:'multiple', prompt:'Что можно навесить на группу эндпойнтов? (несколько ответов)', options:['RequireAuthorization','WithTags','AddEndpointFilter','Отдельный порт Kestrel'], answer:[0,1,2], explanation:'Порт — настройка сервера.', difficulty:1 },
  { id:'t2-8', type:'single', prompt:'Какой код возвращает GET-эндпойнт, вернувший обычный объект?', options:['200 и JSON','201','204','text/plain всегда'], answer:0, explanation:'Объект сериализуется System.Text.Json.', difficulty:1 }
 ]
},
{
 id: 3, title: 'Контроллеры', short: 'ApiController, атрибутная маршрутизация, ActionResult, привязка, фильтры',
 lessons: [
 { id:'3-1', title:'Контроллер API', html:`
<p>Контроллеры — второй способ писать API: эндпойнты группируются в класс, маршруты задаются атрибутами. Многие существующие проекты написаны именно так.</p>
<pre><code>builder.Services.AddControllers();
...
app.MapControllers();</code></pre>
<pre><code>[ApiController]
[Route("api/[controller]")]                    // [controller] → "products"
public class ProductsController(IProductService service) : ControllerBase
{
    [HttpGet]                                    // GET api/products
    public Task&lt;List&lt;ProductDto&gt;&gt; GetAll(CancellationToken ct) =&gt; service.AllAsync(ct);

    [HttpGet("{id:int}")]                        // GET api/products/42
    public async Task&lt;ActionResult&lt;ProductDto&gt;&gt; Get(int id, CancellationToken ct)
    {
        var p = await service.GetAsync(id, ct);
        return p is null ? NotFound() : p;       // неявное преобразование в Ok(p)
    }

    [HttpPost]
    public async Task&lt;ActionResult&lt;ProductDto&gt;&gt; Create(CreateProductRequest req, CancellationToken ct)
    {
        var p = await service.CreateAsync(req, ct);
        return CreatedAtAction(nameof(Get), new { id = p.Id }, p);
    }

    [HttpDelete("{id:int}")]
    public async Task&lt;IActionResult&gt; Delete(int id, CancellationToken ct) =&gt;
        await service.DeleteAsync(id, ct) ? NoContent() : NotFound();
}</code></pre>
<p>Атрибут <code>[ApiController]</code> включает поведение для API:</p>
<ul>
<li>Обязательная атрибутная маршрутизация.</li>
<li>Автоматический ответ 400 с <code>ValidationProblemDetails</code>, если модель не прошла валидацию.</li>
<li>Выведение источников: сложные типы — из тела, простые — из маршрута/query.</li>
<li>Ошибки 4xx оформляются как ProblemDetails.</li>
</ul>
<p class="small">Контроллер — обычный класс с первичным конструктором (<a href="../csharp/#/l/3-2">C# 3.2</a>). Он создаётся на каждый запрос, поэтому в него можно внедрять Scoped-сервисы.</p>`,
 check: [
  { id:'q3-1a', type:'single', prompt:'Что подставится вместо [controller] в маршруте для класса OrdersController?', options:['orders','OrdersController','controller','api'], answer:0, explanation:'Имя класса без суффикса Controller.' },
  { id:'q3-1b', type:'single', prompt:'Что делает [ApiController] при невалидной модели?', options:['Автоматически возвращает 400 с описанием ошибок','Бросает исключение 500','Пропускает в действие с null','Ничего'], answer:0, explanation:'Проверять ModelState вручную не нужно.' }
 ]},
 { id:'3-2', title:'ActionResult и коды ответов', html:`
<div class="tbl"><table><tr><th>Тип возврата</th><th>Когда</th></tr>
<tr><td><code>T</code> / <code>Task&lt;T&gt;</code></td><td>Всегда 200 с телом</td></tr>
<tr><td><code>IActionResult</code></td><td>Разные коды без единого типа тела</td></tr>
<tr><td><code>ActionResult&lt;T&gt;</code></td><td>Тело типа T или другой результат (404, 400) — самый частый</td></tr>
<tr><td><code>Results&lt;Ok&lt;T&gt;, NotFound&gt;</code></td><td>TypedResults работают и в контроллерах</td></tr>
</table></div>
<p>Вспомогательные методы <code>ControllerBase</code>: <code>Ok()</code>, <code>Created()</code>, <code>CreatedAtAction()</code>, <code>NoContent()</code>, <code>BadRequest()</code>, <code>NotFound()</code>, <code>Conflict()</code>, <code>Unauthorized()</code>, <code>Forbid()</code>, <code>Problem()</code>, <code>ValidationProblem()</code>, <code>File()</code>, <code>Redirect()</code>.</p>
<h3>Документирование ответов</h3>
<pre><code>[HttpGet("{id:int}")]
[ProducesResponseType&lt;ProductDto&gt;(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status404NotFound)]
public async Task&lt;ActionResult&lt;ProductDto&gt;&gt; Get(int id) { ... }</code></pre>
<p>Атрибуты <code>ProducesResponseType</code> попадают в OpenAPI-описание (модуль 6), и клиенты видят, какие коды возможны.</p>
<h3>Файлы</h3>
<pre><code>[HttpGet("{id:int}/invoice")]
public async Task&lt;IActionResult&gt; Invoice(int id)
{
    var stream = await _pdf.RenderAsync(id);
    return File(stream, "application/pdf", $"invoice-{id}.pdf");
}</code></pre>`,
 check: [
  { id:'q3-2a', type:'single', prompt:'Какой тип возврата позволяет вернуть и ProductDto, и NotFound()?', options:['ActionResult<ProductDto>','ProductDto','void','string'], answer:0, explanation:'Неявные преобразования от T и от ActionResult.' },
  { id:'q3-2b', type:'single', prompt:'Зачем [ProducesResponseType]?', options:['Описать возможные ответы для OpenAPI и клиентов','Изменить код ответа','Включить кэш','Проверить права'], answer:0, explanation:'Документация контракта.' }
 ]},
 { id:'3-3', title:'Привязка моделей в контроллерах', html:`
<p>Правила те же, что в Minimal API (<a href="#/l/2-2">урок 2.2</a>), с атрибутами <code>[FromRoute]</code>, <code>[FromQuery]</code>, <code>[FromBody]</code>, <code>[FromHeader]</code>, <code>[FromForm]</code>, <code>[FromServices]</code>.</p>
<pre><code>[HttpGet]
public Task&lt;PagedResult&lt;ProductDto&gt;&gt; Search([FromQuery] ProductQuery q, CancellationToken ct) =&gt; ...;
// GET api/products?search=книга&amp;maxPrice=1000&amp;page=2

[HttpPost("{id:int}/image")]
[RequestSizeLimit(5_000_000)]
public async Task&lt;IActionResult&gt; Upload(int id, IFormFile file, CancellationToken ct)
{
    if (file.ContentType is not ("image/png" or "image/jpeg")) return BadRequest("Только PNG/JPEG");
    await using var s = file.OpenReadStream();
    await _storage.SaveAsync($"products/{id}", s, ct);
    return NoContent();
}

[HttpGet("me")]
public ActionResult&lt;UserDto&gt; Me() =&gt; new UserDto(User.Identity!.Name!);   // User — ClaimsPrincipal</code></pre>
<div class="note warn"><b>Overposting.</b> Если принимать в POST/PUT сущность EF напрямую (<code>Create(Product p)</code>), клиент может прислать поля, которые менять нельзя: <code>IsAdmin</code>, <code>Price</code>, <code>OwnerId</code>. Всегда принимайте отдельный DTO-запрос (<a href="../csharp/#/l/10-2">C# 10.2</a>).</div>
<p>Что доступно в контроллере: <code>HttpContext</code>, <code>Request</code>, <code>Response</code>, <code>User</code>, <code>ModelState</code>, <code>Url</code> (генерация ссылок).</p>`,
 check: [
  { id:'q3-3a', type:'single', prompt:'Что такое overposting?', options:['Клиент присылает поля, которые не должен менять, и они попадают в сущность','Слишком частые POST-запросы','Слишком большое тело запроса','Двойная отправка формы'], answer:0, explanation:'Защита — отдельные DTO для входа.' },
  { id:'q3-3b', type:'single', prompt:'Какой тип параметра принимает загруженный файл?', options:['IFormFile','Stream','byte[] из [FromQuery]','FileInfo'], answer:0, explanation:'Файл приходит в multipart/form-data.' }
 ]},
 { id:'3-4', title:'Фильтры и выбор: контроллеры или Minimal API', html:`
<p>Фильтры контроллеров выполняются вокруг действия — аналог middleware, но с доступом к контексту MVC:</p>
<div class="tbl"><table><tr><th>Фильтр</th><th>Когда</th></tr>
<tr><td>Authorization</td><td>Первым: можно ли вообще выполнять</td></tr>
<tr><td>Resource</td><td>До привязки модели — кэш, короткое замыкание</td></tr>
<tr><td>Action</td><td>До и после действия, видит аргументы</td></tr>
<tr><td>Exception</td><td>Необработанное исключение действия</td></tr>
<tr><td>Result</td><td>До и после формирования результата</td></tr>
</table></div>
<pre><code>public class AuditAttribute : ActionFilterAttribute
{
    public override async Task OnActionExecutionAsync(ActionExecutingContext ctx, ActionExecutionDelegate next)
    {
        var log = ctx.HttpContext.RequestServices.GetRequiredService&lt;ILogger&lt;AuditAttribute&gt;&gt;();
        log.LogInformation("{User} → {Action}", ctx.HttpContext.User.Identity?.Name, ctx.ActionDescriptor.DisplayName);
        await next();
    }
}

[Audit]
[HttpDelete("{id:int}")]
public Task&lt;IActionResult&gt; Delete(int id) { ... }</code></pre>
<h3>Что выбрать</h3>
<div class="tbl"><table><tr><th></th><th>Minimal API</th><th>Контроллеры</th></tr>
<tr><td>Шаблонный код</td><td>Минимум</td><td>Больше</td></tr>
<tr><td>Производительность</td><td>Немного выше, поддерживает AOT</td><td>Хорошая</td></tr>
<tr><td>Организация</td><td>Группы и свои классы</td><td>Классы по соглашению</td></tr>
<tr><td>Экосистема</td><td>Растёт; новые возможности появляются здесь</td><td>Огромная: фильтры, соглашения, OData</td></tr>
<tr><td>Где встретите</td><td>Новые сервисы, микросервисы</td><td>Большинство существующих проектов</td></tr>
</table></div>
<div class="note why">Знать нужно оба: Minimal API для новых проектов, контроллеры — потому что вы их встретите в работе. Сервисный слой, DTO, валидация и EF Core от выбора не зависят.</div>`,
 check: [
  { id:'q3-4a', type:'single', prompt:'Какой фильтр контроллеров видит аргументы действия до его выполнения?', options:['Action-фильтр','Authorization-фильтр','Result-фильтр','Middleware'], answer:0, explanation:'OnActionExecuting получает ActionArguments.' },
  { id:'q3-4b', type:'multiple', prompt:'Что одинаково для Minimal API и контроллеров? (несколько ответов)', options:['DI и сервисный слой','Привязка из маршрута, query и тела','Middleware-конвейер','Обязательный базовый класс ControllerBase'], answer:[0,1,2], explanation:'Базовый класс — только у контроллеров.' }
 ]}
 ],
 test: [
  { id:'t3-1', type:'analyze', prompt:'Какой URL у действия?', code:'[ApiController]\n[Route("api/[controller]")]\npublic class OrdersController : ControllerBase\n{\n    [HttpGet("{id:guid}/items")]\n    public IActionResult Items(Guid id) => Ok();\n}', options:['GET api/orders/{guid}/items','GET api/OrdersController/items','GET orders/items/{id}','POST api/orders/items'], answer:0, explanation:'Маршрут контроллера + маршрут действия.', difficulty:1 },
  { id:'t3-2', type:'single', prompt:'Что вернёт CreatedAtAction(nameof(Get), new { id = p.Id }, p)?', options:['201 с Location, указывающим на действие Get','200','204','302 редирект'], answer:0, explanation:'URL генерируется по имени действия.', difficulty:2 },
  { id:'t3-3', type:'single', prompt:'Какое время жизни у экземпляра контроллера?', options:['Создаётся на каждый запрос','Singleton','Создаётся при старте','Один на пользователя'], answer:0, explanation:'Поэтому в него безопасно внедрять Scoped-сервисы.', difficulty:1 },
  { id:'t3-4', type:'analyze', prompt:'В чём уязвимость?', code:'[HttpPut("{id:int}")]\npublic async Task<IActionResult> Update(int id, User user)\n{\n    user.Id = id;\n    _db.Users.Update(user);\n    await _db.SaveChangesAsync();\n    return NoContent();\n}', options:['Overposting: клиент может изменить любое поле User, включая роль','Нет await','Неверный код ответа','Нужен [FromQuery]'], answer:0, explanation:'Принимайте UpdateUserRequest с разрешёнными полями.', difficulty:2 },
  { id:'t3-5', type:'match', prompt:'Сопоставьте тип фильтра и момент выполнения.', pairs:[['Authorization','Первым, до всего'],['Resource','До привязки модели'],['Action','Вокруг вызова действия'],['Exception','При необработанном исключении']], explanation:'Конвейер фильтров MVC.', difficulty:3 },
  { id:'t3-6', type:'single', prompt:'Как в контроллере получить текущего пользователя?', options:['Свойство User (ClaimsPrincipal)','Статический Thread.CurrentPrincipal','Из DbContext','Через Request.Body'], answer:0, explanation:'Заполняется middleware аутентификации.', difficulty:1 },
  { id:'t3-7', type:'single', prompt:'Что нужно добавить в Program.cs для работы контроллеров?', options:['builder.Services.AddControllers() и app.MapControllers()','Только [ApiController]','app.UseControllers()','Ничего'], answer:0, explanation:'Регистрация сервисов MVC и маршрутов.', difficulty:1 },
  { id:'t3-8', type:'single', prompt:'Какую модель стоит выбрать для нового небольшого микросервиса?', options:['Minimal API — меньше кода и поддержка AOT','Только контроллеры','Razor Pages','WebForms'], answer:0, explanation:'Но и контроллеры — нормальный выбор.', difficulty:1 }
 ]
},
{
 id: 4, title: 'Валидация и обработка ошибок', short: 'DataAnnotations, FluentValidation, ProblemDetails, IExceptionHandler',
 lessons: [
 { id:'4-1', title:'Валидация входных данных', html:`
<h3>DataAnnotations</h3>
<pre><code>public record CreateProductRequest(
    [Required, StringLength(100, MinimumLength = 2)] string Name,
    [Range(0.01, 1_000_000)] decimal Price,
    [Url] string? ImageUrl,
    [MaxLength(10)] string[] Tags);</code></pre>
<p>В контроллерах с <code>[ApiController]</code> проверка выполняется автоматически. В Minimal API (.NET 10) — после <code>builder.Services.AddValidation()</code>; в более ранних версиях — через фильтр эндпойнта.</p>
<h3>FluentValidation</h3>
<p>Для сложных правил удобнее отдельный класс-валидатор:</p>
<pre><code>$ dotnet add package FluentValidation.DependencyInjectionExtensions</code></pre>
<pre><code>public class CreateOrderValidator : AbstractValidator&lt;CreateOrderRequest&gt;
{
    public CreateOrderValidator(IProductRepository products)
    {
        RuleFor(x =&gt; x.Items).NotEmpty();
        RuleForEach(x =&gt; x.Items).ChildRules(i =&gt;
        {
            i.RuleFor(x =&gt; x.Quantity).InclusiveBetween(1, 100);
            i.RuleFor(x =&gt; x.ProductId).MustAsync((id, ct) =&gt; products.ExistsAsync(id, ct))
                .WithMessage("Товар не найден");
        });
        RuleFor(x =&gt; x.DeliveryDate).GreaterThan(DateOnly.FromDateTime(DateTime.UtcNow));
    }
}
builder.Services.AddValidatorsFromAssemblyContaining&lt;Program&gt;();</code></pre>
<p>Ответ клиенту при ошибке — стандартный <code>ValidationProblemDetails</code>:</p>
<pre><code>HTTP/1.1 400 Bad Request
Content-Type: application/problem+json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": { "Price": ["The field Price must be between 0,01 and 1000000."] }
}</code></pre>
<div class="note why"><b>Где какие проверки.</b> Формат и границы входных данных — валидация на входе API. Бизнес-правила («нельзя отменить отгруженный заказ») — в доменной модели (<a href="../oop/#/l/2-3">ООП 2.3 — инварианты</a>). Клиентская валидация в браузере — только для удобства, не для безопасности.</div>`,
 check: [
  { id:'q4-1a', type:'single', prompt:'Какой формат ответа ASP.NET использует для ошибок валидации?', options:['ValidationProblemDetails (application/problem+json)','Простой текст','HTML-страница','XML'], answer:0, explanation:'Стандарт RFC 9457.' },
  { id:'q4-1b', type:'single', prompt:'Достаточно ли валидации в JavaScript на клиенте?', options:['Нет — сервер обязан проверять всё сам','Да, сервер может доверять','Да, если включён HTTPS','Только для POST'], answer:0, explanation:'Запрос можно отправить в обход фронтенда.' }
 ]},
 { id:'4-2', title:'ProblemDetails', html:`
<p><b>ProblemDetails</b> (RFC 9457) — стандартный JSON-формат ошибок HTTP API. Клиенту не нужно угадывать структуру ошибки для каждого эндпойнта.</p>
<pre><code>{
  "type": "https://shop.example/errors/out-of-stock",
  "title": "Товар закончился",
  "status": 409,
  "detail": "Товара SKU-42 осталось 1 шт., запрошено 3",
  "instance": "/api/orders",
  "traceId": "00-4bf92f35…-01",
  "sku": "SKU-42"                    // расширения — любые дополнительные поля
}</code></pre>
<pre><code>builder.Services.AddProblemDetails(o =&gt;
    o.CustomizeProblemDetails = ctx =&gt;
        ctx.ProblemDetails.Extensions["traceId"] = Activity.Current?.Id ?? ctx.HttpContext.TraceIdentifier);

app.UseExceptionHandler();      // необработанные исключения → 500 ProblemDetails
app.UseStatusCodePages();       // пустые 404/405 → ProblemDetails</code></pre>
<p>Вернуть проблему вручную:</p>
<pre><code>return TypedResults.Problem(
    title: "Товар закончился",
    detail: $"Осталось {stock} шт.",
    statusCode: StatusCodes.Status409Conflict,
    type: "https://shop.example/errors/out-of-stock");</code></pre>
<div class="note warn"><b>Не раскрывайте внутренности.</b> В продакшене <code>detail</code> для 500 не должен содержать текст исключения, SQL или стек. Отдайте traceId — по нему ошибка найдётся в логах.</div>`,
 check: [
  { id:'q4-2a', type:'single', prompt:'Какой Content-Type у ответа ProblemDetails?', options:['application/problem+json','text/html','application/xml','text/plain'], answer:0, explanation:'Отдельный медиатип для ошибок.' },
  { id:'q4-2b', type:'single', prompt:'Что стоит отдать клиенту при 500 в продакшене вместо текста исключения?', options:['traceId для поиска в логах','Полный стек вызовов','SQL-запрос','Строку подключения'], answer:0, explanation:'Детали — только в логах.' }
 ]},
 { id:'4-3', title:'Глобальная обработка исключений', html:`
<p class="small">Когда бросать исключения, а когда возвращать результат — <a href="../csharp/#/l/7-2">C# 7.2</a>. Здесь — как превратить исключения в HTTP-ответы в одном месте.</p>
<pre><code>public sealed class DomainExceptionHandler(ILogger&lt;DomainExceptionHandler&gt; log, IProblemDetailsService problems)
    : IExceptionHandler
{
    public async ValueTask&lt;bool&gt; TryHandleAsync(HttpContext ctx, Exception ex, CancellationToken ct)
    {
        var (status, title) = ex switch
        {
            NotFoundException       =&gt; (404, "Не найдено"),
            ConflictException       =&gt; (409, "Конфликт"),
            DomainException         =&gt; (422, "Нарушено бизнес-правило"),
            OperationCanceledException =&gt; (499, "Запрос отменён"),
            _ =&gt; (0, null)
        };
        if (status == 0) return false;                          // пусть обработает следующий (500)

        log.LogWarning(ex, "Обработано доменное исключение");
        ctx.Response.StatusCode = status;
        return await problems.TryWriteAsync(new()
        {
            HttpContext = ctx,
            ProblemDetails = { Status = status, Title = title, Detail = ex.Message }
        });
    }
}

builder.Services.AddExceptionHandler&lt;DomainExceptionHandler&gt;();
builder.Services.AddProblemDetails();
app.UseExceptionHandler();</code></pre>
<p>Теперь обработчики эндпойнтов не содержат try/catch: сервис бросает <code>NotFoundException</code>, клиент получает 404 в едином формате.</p>
<div class="note"><b>Исключения или Result?</b> Многие команды вместо доменных исключений возвращают из сервисов тип-результат (<code>Result&lt;T&gt;</code>, библиотеки OneOf, ErrorOr) и переводят его в HTTP в эндпойнте. Оба подхода рабочие — главное, единообразие в проекте.</div>`,
 check: [
  { id:'q4-3a', type:'single', prompt:'Что означает return false из IExceptionHandler.TryHandleAsync?', options:['Этот обработчик не взялся, исключение передаётся следующему','Исключение подавлено','Приложение остановится','Ответ 200'], answer:0, explanation:'Последний рубеж — стандартный 500.' },
  { id:'q4-3b', type:'single', prompt:'Что даёт глобальный обработчик исключений?', options:['Единый формат ошибок и отсутствие try/catch в каждом эндпойнте','Ускорение запросов','Отключение логирования','Повтор запросов'], answer:0, explanation:'Ответственность в одном месте.' }
 ]},
 { id:'4-4', title:'Коды состояния: шпаргалка API', html:`
<div data-widget="codes"></div>
<p>Частые вопросы:</p>
<ul>
<li><b>400 или 422?</b> 400 — запрос синтаксически неверен или не прошёл валидацию полей. 422 — формально корректен, но нарушает бизнес-правило. Многие API используют только 400 — договоритесь в команде.</li>
<li><b>401 или 403?</b> 401 — «я не знаю, кто вы» (нет или неверный токен). 403 — «знаю, но нельзя».</li>
<li><b>404 вместо 403?</b> Если само существование ресурса — секрет (чужой заказ), отвечайте 404, чтобы не подтверждать, что id существует.</li>
<li><b>200 с ошибкой в теле</b> — антипаттерн: ломает мониторинг, ретраи и кэширование.</li>
<li><b>500</b> — только для непредвиденных ошибок сервера. Ошибка клиента, ставшая 500, — баг.</li>
</ul>
<p class="small">Подробнее о семантике HTTP — в <a href="../network/">курсе «Сети для разработчиков»</a>.</p>`,
 check: [
  { id:'q4-4a', type:'single', prompt:'Пользователь с валидным токеном пытается удалить чужой проект. Что вернуть?', options:['403 или 404, если существование проекта нужно скрыть','401','200','500'], answer:0, explanation:'Он аутентифицирован, но прав нет.' },
  { id:'q4-4b', type:'single', prompt:'Почему плохо отвечать 200 { "error": "..." }?', options:['Мониторинг, ретраи, кэши и клиенты считают ответ успешным','Это слишком длинно','JSON не поддерживает поле error','Браузер не покажет ответ'], answer:0, explanation:'Код ответа — часть контракта.' }
 ]}
 ],
 test: [
  { id:'t4-1', type:'match', prompt:'Сопоставьте ситуацию и код.', pairs:[['Нет токена','401'],['Нет прав','403'],['Поле Email пустое','400'],['Дубликат уникального номера','409']], explanation:'Семантика кодов.', difficulty:1 },
  { id:'t4-2', type:'single', prompt:'Где проверять правило «нельзя отменить отгруженный заказ»?', options:['В доменной модели / сервисе, не в атрибутах DTO','Только в JavaScript','В атрибуте [Required]','В middleware CORS'], answer:0, explanation:'Это инвариант предметной области.', difficulty:2 },
  { id:'t4-3', type:'analyze', prompt:'Что не так с ответом в продакшене?', code:'HTTP/1.1 500\n{\n  "title": "Internal Server Error",\n  "detail": "Npgsql.PostgresException: 23505: duplicate key value violates\\n unique constraint \\"ix_users_email\\" at Shop.Data.UserRepo.AddAsync() in /src/Shop/Data/UserRepo.cs:line 42"\n}', options:['Раскрыты детали БД и пути к коду; кроме того, это ошибка клиента (409), а не 500','Нет поля type','Должен быть 200','Всё нормально'], answer:0, explanation:'Дубликат email — ожидаемая ситуация, ответ 409 без внутренностей.', difficulty:2 },
  { id:'t4-4', type:'single', prompt:'Какой middleware превращает пустые ответы 404/405 в ProblemDetails?', options:['UseStatusCodePages','UseRouting','UseStaticFiles','UseHsts'], answer:0, explanation:'Вместе с AddProblemDetails.', difficulty:2 },
  { id:'t4-5', type:'single', prompt:'Как зарегистрировать все FluentValidation-валидаторы сборки?', options:['AddValidatorsFromAssemblyContaining<Program>()','Создавать вручную в каждом действии','Через [Validator] атрибут','Ничего не нужно'], answer:0, explanation:'Сканирование сборки.', difficulty:1 },
  { id:'t4-6', type:'single', prompt:'Какой RFC описывает ProblemDetails?', options:['RFC 9457 (ранее 7807)','RFC 2616','RFC 1918','RFC 7519'], answer:0, explanation:'7519 — это JWT.', difficulty:3 },
  { id:'t4-7', type:'multiple', prompt:'Что стоит включить в ProblemDetails? (несколько ответов)', options:['status и title','traceId','Понятный detail для клиента','Строку подключения к БД'], answer:[0,1,2], explanation:'Секреты — никогда.', difficulty:1 },
  { id:'t4-8', type:'single', prompt:'Почему иногда отвечают 404 вместо 403 на чужой ресурс?', options:['Чтобы не раскрывать факт существования ресурса','404 быстрее','403 запрещён в REST','Так требует CORS'], answer:0, explanation:'Защита от перебора id.', difficulty:2 }
 ]
},
{
 id: 5, title: 'EF Core в веб-приложении', short: 'DbContext в DI, связи, миграции, AsNoTracking, N+1, транзакции, конкурентность',
 lessons: [
 { id:'5-1', title:'DbContext и модель', html:`
<p class="small">Основы EF Core — <a href="../csharp/#/l/10-4">C# 10.4</a>, LINQ к IQueryable — <a href="../csharp/#/l/6-4">C# 6.4</a>. Здесь — то, что важно именно в вебе.</p>
<pre><code>builder.Services.AddDbContext&lt;ShopDb&gt;(o =&gt;
    o.UseNpgsql(builder.Configuration.GetConnectionString("Default"))
     .UseSnakeCaseNamingConvention());                 // пакет EFCore.NamingConventions

public class ShopDb(DbContextOptions&lt;ShopDb&gt; options) : DbContext(options)
{
    public DbSet&lt;Product&gt; Products =&gt; Set&lt;Product&gt;();
    public DbSet&lt;Order&gt; Orders =&gt; Set&lt;Order&gt;();

    protected override void OnModelCreating(ModelBuilder b) =&gt;
        b.ApplyConfigurationsFromAssembly(typeof(ShopDb).Assembly);
}

public class ProductConfig : IEntityTypeConfiguration&lt;Product&gt;
{
    public void Configure(EntityTypeBuilder&lt;Product&gt; e)
    {
        e.Property(p =&gt; p.Name).HasMaxLength(200).IsRequired();
        e.Property(p =&gt; p.Price).HasPrecision(12, 2);
        e.HasIndex(p =&gt; p.Sku).IsUnique();
        e.HasOne(p =&gt; p.Category).WithMany(c =&gt; c.Products).HasForeignKey(p =&gt; p.CategoryId);
    }
}</code></pre>
<ul>
<li><code>DbContext</code> — Scoped: один на запрос, не потокобезопасен. Никогда не делайте его Singleton и не используйте параллельно в <code>Task.WhenAll</code>.</li>
<li>Конфигурация в отдельных классах держит сущности чистыми от атрибутов БД.</li>
<li>Провайдеры: SQL Server, PostgreSQL (Npgsql), SQLite, MySQL; для тестов — SQLite in-memory или Testcontainers.</li>
</ul>
<div class="note">Для фоновых задач и Singleton-сервисов используйте <code>IDbContextFactory&lt;T&gt;</code> (<code>AddDbContextFactory</code>) и создавайте контекст на каждую единицу работы.</div>`,
 check: [
  { id:'q5-1a', type:'single', prompt:'Почему нельзя выполнять два запроса через один DbContext параллельно через Task.WhenAll?', options:['DbContext не потокобезопасен','Это медленно','EF не поддерживает async','Так нельзя только в SQLite'], answer:0, explanation:'Будет InvalidOperationException о второй операции.' },
  { id:'q5-1b', type:'single', prompt:'Как получить DbContext в Singleton-сервисе или фоновой задаче?', options:['Через IDbContextFactory<T> — создать на единицу работы','Внедрить DbContext в конструктор','Сделать DbContext static','Никак'], answer:0, explanation:'Захват Scoped-сервиса запрещён.' }
 ]},
 { id:'5-2', title:'Миграции и развёртывание', html:`
<pre><code>$ dotnet ef migrations add AddProductSku
$ dotnet ef migrations script --idempotent -o migrate.sql   # SQL для ревью и применения
$ dotnet ef migrations bundle -o efbundle                   # исполняемый файл миграций для CI/CD</code></pre>
<p>Способы применить миграции в продакшене:</p>
<div class="tbl"><table><tr><th>Способ</th><th>Плюсы</th><th>Минусы</th></tr>
<tr><td><code>db.Database.Migrate()</code> при старте</td><td>Просто</td><td>Гонки при нескольких репликах, права DDL у приложения</td></tr>
<tr><td>SQL-скрипт <code>--idempotent</code></td><td>Ревью DBA, контроль</td><td>Ручной шаг</td></tr>
<tr><td>Migration bundle в пайплайне</td><td>Автоматизация, отдельный шаг до деплоя</td><td>Настройка CI/CD</td></tr>
</table></div>
<div class="note warn"><b>Совместимость версий.</b> При rolling-деплое старая и новая версии приложения работают с одной базой одновременно (<a href="../devops/">курс DevOps</a>). Переименование колонки делают в несколько шагов: добавить новую → писать в обе → перенести данные → перестать читать старую → удалить её.</div>
<h3>Начальные данные</h3>
<pre><code>e.HasData(new Category { Id = 1, Name = "Книги" });   // попадает в миграцию</code></pre>`,
 check: [
  { id:'q5-2a', type:'single', prompt:'Почему Database.Migrate() при старте опасен с несколькими репликами?', options:['Реплики могут одновременно применять миграции','Он не работает в Docker','Он удаляет данные','Он медленный'], answer:0, explanation:'Лучше отдельный шаг в пайплайне.' },
  { id:'q5-2b', type:'single', prompt:'Что делает флаг --idempotent у migrations script?', options:['Генерирует скрипт, безопасный для повторного применения к БД в любом состоянии','Удаляет миграции','Применяет миграции немедленно','Сжимает скрипт'], answer:0, explanation:'Проверяет таблицу __EFMigrationsHistory.' }
 ]},
 { id:'5-3', title:'Эффективные запросы', html:`
<h3>Проекция вместо загрузки сущностей</h3>
<pre><code>// Плохо: загружаются все колонки и связанные сущности, плюс отслеживание
var list = await db.Products.Include(p =&gt; p.Category).ToListAsync(ct);
return list.Select(p =&gt; new ProductDto(p.Id, p.Name, p.Price, p.Category.Name));

// Хорошо: SQL выбирает только нужное
return await db.Products
    .Select(p =&gt; new ProductDto(p.Id, p.Name, p.Price, p.Category.Name))
    .ToListAsync(ct);</code></pre>
<h3>Проблема N+1</h3>
<pre><code>var orders = await db.Orders.ToListAsync();
foreach (var o in orders)
    total += o.Items.Sum(i =&gt; i.Price);   // при lazy loading — отдельный SQL на каждый заказ!</code></pre>
<p>Решение: <code>Include</code>, проекция или агрегирование в SQL (<code>db.Orders.Select(o =&gt; o.Items.Sum(...))</code>). Ленивую загрузку в веб-API лучше не включать.</p>
<h3>Чтение без отслеживания</h3>
<pre><code>var p = await db.Products.AsNoTracking().FirstOrDefaultAsync(x =&gt; x.Id == id, ct);</code></pre>
<p>Для запросов только на чтение <code>AsNoTracking</code> экономит память и время. Проекции в DTO не отслеживаются автоматически.</p>
<h3>Пагинация</h3>
<pre><code>// offset — просто, но медленно на далёких страницах
.OrderBy(p =&gt; p.Id).Skip((page - 1) * size).Take(size)
// keyset (курсор) — быстро на любой глубине
.Where(p =&gt; p.Id &gt; afterId).OrderBy(p =&gt; p.Id).Take(size)</code></pre>
<div class="note why"><b>Смотрите SQL.</b> В Development включите логирование <code>Microsoft.EntityFrameworkCore.Database.Command</code> на уровень Information — каждый запрос появится в консоли. Неожиданно много запросов на один HTTP-вызов — почти всегда N+1.</div>`,
 check: [
  { id:'q5-3a', type:'single', prompt:'Что такое проблема N+1?', options:['Один запрос за списком и ещё по запросу на каждый элемент','Один лишний столбец','Нумерация страниц с единицы','Двойная вставка'], answer:0, explanation:'Типично для ленивой загрузки в цикле.' },
  { id:'q5-3b', type:'single', prompt:'Когда полезен AsNoTracking()?', options:['Для запросов только на чтение','Перед SaveChanges','Для удаления','Никогда'], answer:0, explanation:'Не нужно отслеживать изменения.' }
 ]},
 { id:'5-4', title:'Транзакции и конкурентность', html:`
<p><code>SaveChangesAsync</code> сохраняет все изменения в одной транзакции. Явная транзакция нужна, если между сохранениями есть другие действия:</p>
<pre><code>await using var tx = await db.Database.BeginTransactionAsync(ct);
order.MarkPaid();
await db.SaveChangesAsync(ct);
await db.Outbox.AddAsync(new OutboxMessage("OrderPaid", order.Id), ct);   // паттерн Outbox
await db.SaveChangesAsync(ct);
await tx.CommitAsync(ct);</code></pre>
<h3>Оптимистичная конкурентность</h3>
<p>Два менеджера одновременно открыли товар и поменяли цену. Без защиты второй молча перезапишет первого (lost update).</p>
<pre><code>public class Product
{
    public uint Version { get; set; }           // PostgreSQL: xmin; SQL Server: [Timestamp] byte[]
}
e.Property(p =&gt; p.Version).IsRowVersion();

try { await db.SaveChangesAsync(ct); }
catch (DbUpdateConcurrencyException)
{
    return TypedResults.Problem(statusCode: 409, title: "Товар изменён другим пользователем");
}</code></pre>
<p>EF добавляет в <code>UPDATE</code> условие <code>WHERE version = @old</code>. Если строк обновлено 0 — кто-то успел раньше. В HTTP это часто отражают заголовками <code>ETag</code> / <code>If-Match</code> и ответом 412.</p>
<h3>Массовые операции</h3>
<pre><code>await db.Products.Where(p =&gt; p.CategoryId == 5)
    .ExecuteUpdateAsync(s =&gt; s.SetProperty(p =&gt; p.Price, p =&gt; p.Price * 1.1m), ct);   // один UPDATE
await db.Sessions.Where(s =&gt; s.ExpiresAt &lt; now).ExecuteDeleteAsync(ct);</code></pre>`,
 check: [
  { id:'q5-4a', type:'single', prompt:'Что делает оптимистичная блокировка при одновременном изменении?', options:['Второе сохранение обнаруживает изменённую версию и получает исключение','Блокирует строку на время редактирования','Объединяет изменения','Сохраняет оба изменения'], answer:0, explanation:'DbUpdateConcurrencyException → 409.' },
  { id:'q5-4b', type:'single', prompt:'Как обновить цену у тысяч товаров одним SQL без загрузки в память?', options:['ExecuteUpdateAsync','Загрузить все и SaveChanges','foreach с Update','Raw SQL обязательно'], answer:0, explanation:'Массовая операция EF Core 7+.' }
 ]}
 ],
 test: [
  { id:'t5-1', type:'analyze', prompt:'Сколько SQL-запросов выполнится при 100 заказах и включённой ленивой загрузке?', code:'var orders = await db.Orders.ToListAsync();\nvar dto = orders.Select(o => new { o.Id, Customer = o.Customer.Name }).ToList();', options:['101','1','2','100'], answer:0, explanation:'N+1: один за заказами и по одному на каждого клиента.', difficulty:2 },
  { id:'t5-2', type:'single', prompt:'Как исправить код из предыдущего вопроса?', options:['Сделать проекцию в Select прямо в IQueryable до ToListAsync','Добавить Thread.Sleep','Вызвать ToList дважды','Сделать DbContext Singleton'], answer:0, explanation:'Один SQL с JOIN.', difficulty:2 },
  { id:'t5-3', type:'match', prompt:'Сопоставьте инструмент и задачу.', pairs:[['AsNoTracking','Быстрое чтение'],['Include','Загрузка связанных данных'],['IsRowVersion','Оптимистичная конкурентность'],['ExecuteDeleteAsync','Массовое удаление']], explanation:'Инструменты EF Core.', difficulty:2 },
  { id:'t5-4', type:'single', prompt:'Какой вид пагинации быстрее на глубоких страницах?', options:['Keyset (по курсору: WHERE id > last)','Offset (Skip/Take)','Одинаково','Загрузка всего и фильтр в памяти'], answer:0, explanation:'OFFSET заставляет БД пропускать строки.', difficulty:2 },
  { id:'t5-5', type:'single', prompt:'Где правильно применять миграции при деплое нескольких реплик?', options:['Отдельным шагом пайплайна до раскатки (bundle/скрипт)','В каждой реплике при старте','Вручную раз в год','В браузере'], answer:0, explanation:'Без гонок и с контролем.', difficulty:2 },
  { id:'t5-6', type:'single', prompt:'Что гарантирует один вызов SaveChangesAsync?', options:['Все изменения сохраняются в одной транзакции','Сохраняется только первое изменение','Каждое изменение — своя транзакция','Ничего'], answer:0, explanation:'Атомарность пачки изменений.', difficulty:1 },
  { id:'t5-7', type:'single', prompt:'Как переименовать колонку без простоя при rolling-деплое?', options:['В несколько шагов: новая колонка, запись в обе, перенос, удаление старой','Одной миграцией RENAME','Остановить всё и переименовать','Это невозможно'], answer:0, explanation:'Старая версия должна продолжать работать.', difficulty:3 },
  { id:'t5-8', type:'multiple', prompt:'Что верно про DbContext в ASP.NET? (несколько ответов)', options:['Регистрируется как Scoped','Не потокобезопасен','Освобождается в конце запроса','Должен быть Singleton для скорости'], answer:[0,1,2], explanation:'Singleton — ошибка.', difficulty:1 }
 ]
},
{
 id: 6, title: 'Проектирование API', short: 'REST-ресурсы, DTO и маппинг, слои, OpenAPI, версионирование',
 lessons: [
 { id:'6-1', title:'REST: ресурсы и методы', html:`
<p>REST-API строится вокруг <b>ресурсов</b> (существительных) и стандартных <b>методов HTTP</b> (глаголов).</p>
<div class="tbl"><table><tr><th>Операция</th><th>Запрос</th><th>Ответ</th></tr>
<tr><td>Список</td><td><code>GET /api/products?category=books&amp;page=2</code></td><td>200 + массив/страница</td></tr>
<tr><td>Один</td><td><code>GET /api/products/42</code></td><td>200 / 404</td></tr>
<tr><td>Создать</td><td><code>POST /api/products</code></td><td>201 + Location</td></tr>
<tr><td>Заменить</td><td><code>PUT /api/products/42</code></td><td>204 / 200</td></tr>
<tr><td>Изменить часть</td><td><code>PATCH /api/products/42</code></td><td>204 / 200</td></tr>
<tr><td>Удалить</td><td><code>DELETE /api/products/42</code></td><td>204 / 404</td></tr>
<tr><td>Вложенный ресурс</td><td><code>GET /api/orders/7/items</code></td><td>200</td></tr>
<tr><td>Действие</td><td><code>POST /api/orders/7/cancel</code></td><td>200 / 409</td></tr>
</table></div>
<ul>
<li>Имена ресурсов — во множественном числе, строчными: <code>/api/order-items</code>.</li>
<li>Глаголы в URL (<code>/getProducts</code>, <code>/deleteOrder</code>) — признак RPC-стиля, а не REST.</li>
<li>Действия, которые не ложатся на CRUD, оформляют подресурсом с POST.</li>
</ul>
<h3>Безопасность и идемпотентность</h3>
<div class="tbl"><table><tr><th>Метод</th><th>Безопасный (не меняет данные)</th><th>Идемпотентный (повтор = тот же результат)</th></tr>
<tr><td>GET, HEAD</td><td>да</td><td>да</td></tr>
<tr><td>PUT, DELETE</td><td>нет</td><td>да</td></tr>
<tr><td>POST, PATCH</td><td>нет</td><td>нет</td></tr>
</table></div>
<div class="note why"><b>Почему это важно.</b> Клиенты, прокси и библиотеки повторов (<a href="../csharp/#/l/10-3">C# 10.3</a>) автоматически повторяют идемпотентные запросы при сбоях. Для безопасного повтора POST (например, оплаты) используют заголовок <code>Idempotency-Key</code>: сервер запоминает ключ и не создаёт дубликат.</div>`,
 check: [
  { id:'q6-1a', type:'single', prompt:'Какой URL соответствует REST-стилю для удаления заказа 7?', options:['DELETE /api/orders/7','POST /api/deleteOrder?id=7','GET /api/orders/7/delete','PUT /api/orders/delete/7'], answer:0, explanation:'Ресурс в URL, действие — методом.' },
  { id:'q6-1b', type:'multiple', prompt:'Какие методы идемпотентны? (несколько ответов)', options:['GET','PUT','DELETE','POST'], answer:[0,1,2], explanation:'Повтор POST может создать дубликат.' }
 ]},
 { id:'6-2', title:'DTO, маппинг и слои', html:`
<p>Сущности БД и контракт API — разные вещи. Между ними — DTO (<a href="../csharp/#/l/10-2">C# 10.2</a>).</p>
<pre><code>// Контракт API
public record ProductDto(int Id, string Name, decimal Price, string Category);
public record CreateProductRequest(string Name, decimal Price, int CategoryId);
public record UpdateProductRequest(string Name, decimal Price);

// Маппинг — явный, в одном месте
public static class ProductMapping
{
    public static ProductDto ToDto(this Product p) =&gt; new(p.Id, p.Name, p.Price, p.Category.Name);

    public static Expression&lt;Func&lt;Product, ProductDto&gt;&gt; Projection =&gt;
        p =&gt; new ProductDto(p.Id, p.Name, p.Price, p.Category.Name);   // переводится в SQL
}

var list = await db.Products.Select(ProductMapping.Projection).ToListAsync(ct);</code></pre>
<p>Библиотеки маппинга (Mapster, Mapperly — генерация кода при компиляции; AutoMapper — на рефлексии) экономят строки, но прячут логику. Для небольших проектов ручной маппинг проще отлаживать.</p>
<h3>Слои</h3>
<pre><code>Endpoint / Controller   ← HTTP: привязка, коды ответов, авторизация
        ↓
Service / Handler        ← сценарий: транзакция, вызовы, правила
        ↓
Domain                   ← сущности и инварианты
        ↓
DbContext / Repository   ← хранение</code></pre>
<p>Эндпойнт не должен содержать бизнес-логику, а сервис — знать про <code>HttpContext</code> и коды ответов. Так сервис можно переиспользовать из фоновой задачи и тестировать без HTTP (<a href="../oop/#/l/8-1">ООП 8.1 — SRP</a>, <a href="../csharp/#/l/11-3">C# 11.3 — структура решения</a>).</p>
<div class="note"><b>Нужен ли репозиторий поверх EF Core?</b> DbContext уже является «единицей работы», а DbSet — репозиторием. Многие команды внедряют DbContext прямо в сервисы и абстрагируют только сложные запросы. Делайте отдельный репозиторий, когда он реально упрощает тесты или прячет сложность.</div>`,
 check: [
  { id:'q6-2a', type:'single', prompt:'Почему Projection объявлен как Expression<Func<...>>, а не Func<...>?', options:['Чтобы EF Core мог перевести его в SQL','Так быстрее компилируется','Func нельзя использовать с record','Это требование System.Text.Json'], answer:0, explanation:'Дерево выражений анализируется провайдером.' },
  { id:'q6-2b', type:'single', prompt:'Чего не должен знать сервисный слой?', options:['HttpContext и HTTP-коды ответов','Бизнес-правил','Репозиториев','Логгера'], answer:0, explanation:'Это забота слоя эндпойнтов.' }
 ]},
 { id:'6-3', title:'OpenAPI и документация', html:`
<p><b>OpenAPI</b> — машиночитаемое описание API: эндпойнты, параметры, схемы, коды ответов. По нему генерируют документацию, клиентов и тесты.</p>
<pre><code>builder.Services.AddOpenApi();                // встроенная генерация (.NET 9+)
...
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();                          // /openapi/v1.json
    app.MapScalarApiReference();               // UI документации (пакет Scalar.AspNetCore)
}</code></pre>
<p>Обогащаем описание:</p>
<pre><code>g.MapGet("/{id:int}", GetById)
 .WithName("GetProduct")
 .WithSummary("Получить товар")
 .WithDescription("Возвращает товар по идентификатору")
 .Produces&lt;ProductDto&gt;()
 .ProducesProblem(404);

/// &lt;summary&gt;Цена в рублях&lt;/summary&gt;     ← XML-комментарии тоже попадают в схему
public decimal Price { get; init; }</code></pre>
<p>Генерация клиентов: NSwag и Kiota (C#, TypeScript), openapi-generator (любые языки). Фронтенд получает типизированный клиент, который меняется вместе с API.</p>
<div class="note">До .NET 9 шаблон использовал пакет <b>Swashbuckle</b> (<code>AddSwaggerGen</code>, <code>UseSwaggerUI</code>) — его вы встретите во многих проектах. Идея та же.</div>
<div class="note warn">Публиковать документацию в продакшене или нет — решение команды. Для внутренних API её часто закрывают авторизацией.</div>`,
 check: [
  { id:'q6-3a', type:'single', prompt:'Что такое OpenAPI?', options:['Стандарт машиночитаемого описания HTTP API','Открытый исходный код ASP.NET','Протокол аутентификации','Формат логов'], answer:0, explanation:'Бывший Swagger Specification.' },
  { id:'q6-3b', type:'single', prompt:'Что можно сделать по OpenAPI-описанию?', options:['Сгенерировать документацию и типизированных клиентов','Сгенерировать базу данных','Задеплоить приложение','Зашифровать трафик'], answer:0, explanation:'NSwag, Kiota, openapi-generator.' }
 ]},
 { id:'6-4', title:'Версионирование и эволюция API', html:`
<p>Опубликованный API нельзя менять как угодно: у него есть клиенты. Правила совместимых изменений:</p>
<div class="tbl"><table><tr><th>Безопасно</th><th>Ломает клиентов</th></tr>
<tr><td>Новый эндпойнт</td><td>Удаление или переименование эндпойнта</td></tr>
<tr><td>Новое необязательное поле в запросе</td><td>Новое обязательное поле в запросе</td></tr>
<tr><td>Новое поле в ответе</td><td>Удаление/переименование поля ответа, смена типа</td></tr>
<tr><td>Новое значение кода ошибки с документацией</td><td>Изменение смысла существующего поля</td></tr>
</table></div>
<p>Когда без ломающего изменения не обойтись — новая версия:</p>
<pre><code>$ dotnet add package Asp.Versioning.Http</code></pre>
<pre><code>builder.Services.AddApiVersioning(o =&gt;
{
    o.DefaultApiVersion = new ApiVersion(1);
    o.ApiVersionReader = new UrlSegmentApiVersionReader();
});

var api = app.NewVersionedApi("Products");
var v1 = api.MapGroup("/api/v{version:apiVersion}/products").HasApiVersion(1);
var v2 = api.MapGroup("/api/v{version:apiVersion}/products").HasApiVersion(2);
v1.MapGet("/", GetV1);
v2.MapGet("/", GetV2);</code></pre>
<div class="tbl"><table><tr><th>Способ</th><th>Пример</th></tr>
<tr><td>Сегмент URL</td><td><code>/api/v2/products</code> — самый наглядный</td></tr>
<tr><td>Query</td><td><code>/api/products?api-version=2</code></td></tr>
<tr><td>Заголовок</td><td><code>X-Api-Version: 2</code></td></tr>
</table></div>
<div class="note why"><b>Жизненный цикл версии.</b> Объявите старую версию устаревшей (<code>Deprecated</code>, заголовок <code>Sunset</code>), дайте клиентам срок, отслеживайте её использование по логам и только потом удаляйте.</div>`,
 check: [
  { id:'q6-4a', type:'single', prompt:'Какое изменение API совместимо с существующими клиентами?', options:['Добавить новое поле в ответ','Переименовать поле ответа','Сделать необязательное поле запроса обязательным','Удалить эндпойнт'], answer:0, explanation:'Клиенты игнорируют неизвестные поля.' },
  { id:'q6-4b', type:'single', prompt:'Что делать со старой версией API перед удалением?', options:['Объявить устаревшей, сообщить срок, отследить использование','Удалить сразу','Тихо поменять её поведение','Ничего'], answer:0, explanation:'Дайте клиентам время на миграцию.' }
 ]}
 ],
 test: [
  { id:'t6-1', type:'match', prompt:'Сопоставьте операцию и запрос.', pairs:[['Создать заказ','POST /api/orders'],['Отменить заказ','POST /api/orders/7/cancel'],['Позиции заказа','GET /api/orders/7/items'],['Изменить email частично','PATCH /api/users/3']], explanation:'Ресурсы и действия.', difficulty:1 },
  { id:'t6-2', type:'single', prompt:'Клиент повторил POST /payments из-за таймаута, и деньги списались дважды. Как предотвратить?', options:['Ключ идемпотентности Idempotency-Key','Использовать GET','Убрать таймауты','Вернуть 500'], answer:0, explanation:'Сервер распознаёт повтор по ключу.', difficulty:2 },
  { id:'t6-3', type:'analyze', prompt:'Что не так с эндпойнтом?', code:'app.MapPost("/api/orders", async (Order order, ShopDb db, HttpContext ctx) =>\n{\n    if (order.Items.Sum(i => i.Price * i.Qty) > 100000 && !ctx.User.IsInRole("Vip"))\n        return Results.BadRequest();\n    order.Status = "New";\n    foreach (var i in order.Items) { var p = await db.Products.FindAsync(i.ProductId); p!.Stock -= i.Qty; }\n    db.Orders.Add(order);\n    await db.SaveChangesAsync();\n    return Results.Ok(order);\n});', options:['Бизнес-логика в эндпойнте, сущность на входе и выходе, нет 201','Нет проблем','Нужно больше await','Нужно использовать контроллер'], answer:0, explanation:'Вынесите логику в сервис, примите DTO, верните 201 с DTO.', difficulty:2 },
  { id:'t6-4', type:'single', prompt:'Какой пакет давно используется для Swagger UI в ASP.NET?', options:['Swashbuckle','Serilog','Polly','Dapper'], answer:0, explanation:'Встроенный AddOpenApi появился в .NET 9.', difficulty:1 },
  { id:'t6-5', type:'single', prompt:'Где в URL REST допустим глагол?', options:['В подресурсе-действии, которое не ложится на CRUD: /orders/7/cancel','Везде: /getProducts','Нигде и никогда','Только в GET'], answer:0, explanation:'Исключение для действий над ресурсом.', difficulty:2 },
  { id:'t6-6', type:'single', prompt:'Какой способ версионирования самый наглядный?', options:['Сегмент URL /api/v2/...','Cookie','Тело запроса','IP-адрес клиента'], answer:0, explanation:'Видно в логах и ссылках.', difficulty:1 },
  { id:'t6-7', type:'single', prompt:'Почему Mapperly предпочтительнее AutoMapper с точки зрения отладки?', options:['Генерирует обычный C#-код при компиляции, ошибки видны сразу','Он поддерживает больше типов','AutoMapper не работает в .NET 8','Mapperly использует рефлексию'], answer:0, explanation:'Source generator против рефлексии во время выполнения.', difficulty:3 },
  { id:'t6-8', type:'multiple', prompt:'Какие изменения ломают существующих клиентов? (несколько ответов)', options:['Переименовать поле ответа','Сменить тип поля с number на string','Добавить обязательное поле запроса','Добавить новый эндпойнт'], answer:[0,1,2], explanation:'Новый эндпойнт ничего не ломает.', difficulty:1 }
 ]
},
{
 id: 7, title: 'Аутентификация', short: 'Cookies и токены, JWT Bearer, ASP.NET Core Identity, claims',
 lessons: [
 { id:'7-1', title:'Кто вы: схемы аутентификации', html:`
<p><b>Аутентификация</b> отвечает на вопрос «кто вы?», <b>авторизация</b> — «что вам можно?» (модуль 8). Теория угроз и паролей — в <a href="../cyber-security/">курсе «Информационная безопасность»</a>.</p>
<p>Результат аутентификации в ASP.NET — <code>ClaimsPrincipal</code>, набор утверждений (claims) о пользователе:</p>
<pre><code>User.Identity.IsAuthenticated          // true
User.FindFirstValue(ClaimTypes.NameIdentifier)   // "42"
User.FindFirstValue(ClaimTypes.Email)            // "anna@shop.example"
User.IsInRole("Admin")
User.HasClaim("subscription", "pro")</code></pre>
<div class="tbl"><table><tr><th>Схема</th><th>Где хранится</th><th>Для чего</th></tr>
<tr><td>Cookie</td><td>Зашифрованная cookie, браузер отправляет сам</td><td>Сайты, SPA на том же домене (BFF)</td></tr>
<tr><td>JWT Bearer</td><td>Заголовок <code>Authorization: Bearer …</code></td><td>Мобильные приложения, межсервисные вызовы, SPA</td></tr>
<tr><td>OpenID Connect</td><td>Внешний провайдер: Google, Entra ID, Keycloak</td><td>Единый вход (SSO)</td></tr>
<tr><td>API-ключ</td><td>Заголовок</td><td>Простая интеграция машина–машина</td></tr>
</table></div>
<pre><code>builder.Services.AddAuthentication(...)    // какие схемы и как проверять
    .AddJwtBearer(...);
builder.Services.AddAuthorization();
...
app.UseAuthentication();                    // заполняет HttpContext.User
app.UseAuthorization();                     // проверяет [Authorize] / RequireAuthorization</code></pre>
<div class="note why"><b>Не пишите свою криптографию и хранение паролей.</b> Используйте Identity, внешнего провайдера (Keycloak, Auth0, Entra ID) или как минимум проверенный алгоритм хеширования паролей — <code>PasswordHasher&lt;T&gt;</code> из Identity.</div>`,
 check: [
  { id:'q7-1a', type:'single', prompt:'Чем аутентификация отличается от авторизации?', options:['Аутентификация — кто вы, авторизация — что вам можно','Это синонимы','Авторизация всегда первая','Аутентификация — только для админов'], answer:0, explanation:'Сначала личность, потом права.' },
  { id:'q7-1b', type:'single', prompt:'Что такое claim?', options:['Утверждение о пользователе: id, email, роль','Пароль','Cookie','Сессия в БД'], answer:0, explanation:'ClaimsPrincipal — набор claims.' }
 ]},
 { id:'7-2', title:'JWT Bearer', html:`
<p><b>JWT</b> (JSON Web Token) — подписанный токен из трёх частей <code>header.payload.signature</code> в Base64URL.</p>
<div data-widget="jwt"></div>
<pre><code>builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =&gt;
    {
        o.Authority = "https://auth.shop.example";       // OIDC-провайдер: ключи подтянутся сами
        o.Audience = "shop-api";
        // или вручную, если токены выпускаете вы:
        // o.TokenValidationParameters = new()
        // {
        //     ValidIssuer = "shop", ValidAudience = "shop-api",
        //     IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(cfg["Jwt:Key"]!)),
        //     ClockSkew = TimeSpan.FromSeconds(30)
        // };
    });</code></pre>
<p>Что проверяет middleware: подпись, срок (<code>exp</code>, <code>nbf</code>), издателя (<code>iss</code>), аудиторию (<code>aud</code>).</p>
<div class="note warn"><b>Payload не зашифрован</b> — его может прочитать любой. Не кладите туда секреты и персональные данные. Подпись гарантирует только, что токен не изменён.</div>
<h3>Жизненный цикл</h3>
<ul>
<li><b>Access token</b> живёт коротко (5–15 минут): отозвать JWT до истечения нельзя.</li>
<li><b>Refresh token</b> живёт дольше, хранится на сервере и обменивается на новый access token. Его можно отозвать.</li>
<li>В браузерной SPA безопаснее не хранить токены в <code>localStorage</code> (XSS их украдёт), а использовать паттерн BFF: бэкенд держит токены, браузер — HttpOnly-cookie.</li>
</ul>`,
 check: [
  { id:'q7-2a', type:'single', prompt:'Можно ли прочитать содержимое payload JWT без ключа?', options:['Да, это Base64URL, а не шифрование','Нет, он зашифрован','Только сервер может','Только с паролем пользователя'], answer:0, explanation:'Подпись защищает от изменения, не от чтения.' },
  { id:'q7-2b', type:'single', prompt:'Почему access token делают короткоживущим?', options:['Его нельзя отозвать до истечения срока','Длинные токены не помещаются в заголовок','Так быстрее проверка','Так требует HTTP'], answer:0, explanation:'Короткий срок ограничивает ущерб от кражи.' }
 ]},
 { id:'7-3', title:'ASP.NET Core Identity', html:`
<p><b>Identity</b> — готовая система учётных записей: пользователи, хеши паролей, роли, подтверждение email, сброс пароля, двухфакторная аутентификация, блокировка после неудачных попыток.</p>
<pre><code>builder.Services.AddDbContext&lt;AppDb&gt;(...);
builder.Services.AddIdentityApiEndpoints&lt;AppUser&gt;(o =&gt;
    {
        o.Password.RequiredLength = 10;
        o.Lockout.MaxFailedAccessAttempts = 5;
        o.User.RequireUniqueEmail = true;
    })
    .AddRoles&lt;IdentityRole&gt;()
    .AddEntityFrameworkStores&lt;AppDb&gt;();

public class AppUser : IdentityUser { public string? DisplayName { get; set; } }
public class AppDb(DbContextOptions&lt;AppDb&gt; o) : IdentityDbContext&lt;AppUser&gt;(o) { }

app.MapGroup("/api/auth").MapIdentityApi&lt;AppUser&gt;();   // /register, /login, /refresh, /manage/…</code></pre>
<p>Основные сервисы:</p>
<div class="tbl"><table><tr><th>Сервис</th><th>Задачи</th></tr>
<tr><td><code>UserManager&lt;T&gt;</code></td><td>Создание, поиск, пароли, роли, claims</td></tr>
<tr><td><code>SignInManager&lt;T&gt;</code></td><td>Вход, выход, 2FA, блокировка</td></tr>
<tr><td><code>RoleManager&lt;T&gt;</code></td><td>Управление ролями</td></tr>
</table></div>
<div class="note"><b>Identity или внешний провайдер?</b> Identity хорош для одного приложения. Если сервисов несколько, нужен SSO, вход через Google/корпоративный каталог или федерация — используйте OpenID Connect провайдер (Keycloak, Duende IdentityServer, Auth0, Entra ID), а API лишь проверяет JWT.</div>`,
 check: [
  { id:'q7-3a', type:'single', prompt:'Какой сервис Identity создаёт пользователей и меняет пароли?', options:['UserManager<T>','SignInManager<T>','RoleManager<T>','DbContext'], answer:0, explanation:'SignInManager — вход и выход.' },
  { id:'q7-3b', type:'single', prompt:'Когда лучше внешний OIDC-провайдер, чем встроенный Identity?', options:['Нужен единый вход для нескольких приложений или вход через корпоративный каталог','Всегда для одного маленького сайта','Когда нет базы данных','Никогда'], answer:0, explanation:'SSO и федерация — задача провайдера.' }
 ]},
 { id:'7-4', title:'Cookies, BFF и текущий пользователь', html:`
<pre><code>builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(o =&gt;
    {
        o.Cookie.HttpOnly = true;                       // недоступна из JavaScript
        o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        o.Cookie.SameSite = SameSiteMode.Lax;           // защита от CSRF
        o.ExpireTimeSpan = TimeSpan.FromHours(8);
        o.SlidingExpiration = true;
        o.Events.OnRedirectToLogin = ctx =&gt; { ctx.Response.StatusCode = 401; return Task.CompletedTask; }; // API: 401 вместо редиректа
    });

// вход
var claims = new[] { new Claim(ClaimTypes.NameIdentifier, user.Id), new Claim(ClaimTypes.Role, "Customer") };
await HttpContext.SignInAsync(new ClaimsPrincipal(new ClaimsIdentity(claims, "Cookies")));</code></pre>
<h3>Текущий пользователь в сервисах</h3>
<pre><code>public interface ICurrentUser { string Id { get; } bool IsAdmin { get; } }

public class HttpCurrentUser(IHttpContextAccessor accessor) : ICurrentUser
{
    private ClaimsPrincipal User =&gt; accessor.HttpContext!.User;
    public string Id =&gt; User.FindFirstValue(ClaimTypes.NameIdentifier)!;
    public bool IsAdmin =&gt; User.IsInRole("Admin");
}
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped&lt;ICurrentUser, HttpCurrentUser&gt;();</code></pre>
<p>Сервисы зависят от <code>ICurrentUser</code>, а не от <code>HttpContext</code> — их легко тестировать с фейковым пользователем (<a href="../csharp/#/l/11-2">C# 11.2</a>).</p>
<div class="note why"><b>BFF (Backend for Frontend).</b> Для SPA: браузер общается только со своим бэкендом по cookie, а бэкенд хранит токены и ходит с ними к API. Токены не попадают в JavaScript — XSS не может их украсть.</div>`,
 check: [
  { id:'q7-4a', type:'single', prompt:'Что даёт флаг HttpOnly у cookie?', options:['JavaScript страницы не может прочитать cookie','Cookie передаётся только по HTTP, не HTTPS','Cookie не отправляется на сервер','Cookie живёт вечно'], answer:0, explanation:'Защита от кражи через XSS.' },
  { id:'q7-4b', type:'single', prompt:'Зачем абстракция ICurrentUser вместо HttpContext в сервисах?', options:['Сервисы не зависят от HTTP и легко тестируются','Так быстрее','HttpContext нельзя внедрять','Это требование Identity'], answer:0, explanation:'DIP в действии.' }
 ]}
 ],
 test: [
  { id:'t7-1', type:'match', prompt:'Сопоставьте часть JWT и содержимое.', pairs:[['header','Алгоритм подписи и тип'],['payload','Claims: sub, exp, роли'],['signature','Подпись header и payload']], explanation:'Три части через точку.', difficulty:1 },
  { id:'t7-2', type:'single', prompt:'Почему в API-проекте cookie-аутентификация по умолчанию отвечает 302 на /Account/Login?', options:['Это поведение для сайтов; для API нужно переопределить на 401','Так требует HTTP','Это баг','Cookie не работает в API'], answer:0, explanation:'Events.OnRedirectToLogin.', difficulty:2 },
  { id:'t7-3', type:'analyze', prompt:'Что опасного в payload токена?', code:'{\n  "sub": "42",\n  "email": "anna@shop.example",\n  "role": "Customer",\n  "passport": "4510 123456",\n  "exp": 1767225600\n}', options:['Паспортные данные видны любому, кто получит токен','Нет поля iss','exp в прошлом','role должна быть массивом'], answer:0, explanation:'Payload не шифруется.', difficulty:1 },
  { id:'t7-4', type:'single', prompt:'Где хранить токены SPA безопаснее всего?', options:['На бэкенде (BFF), браузеру — HttpOnly cookie','В localStorage','В URL','В обычной cookie, доступной JS'], answer:0, explanation:'XSS не украдёт то, чего нет в JS.', difficulty:2 },
  { id:'t7-5', type:'single', prompt:'Что проверяет JwtBearer при каждом запросе? (лучший ответ)', options:['Подпись, срок действия, издателя и аудиторию','Только формат','Пароль пользователя','IP-адрес'], answer:0, explanation:'Плюс nbf и алгоритм.', difficulty:1 },
  { id:'t7-6', type:'single', prompt:'Зачем нужен refresh token?', options:['Получать новые короткие access-токены без повторного входа, с возможностью отзыва','Ускорять проверку подписи','Шифровать payload','Заменить пароль'], answer:0, explanation:'Он хранится и отзывается на сервере.', difficulty:2 },
  { id:'t7-7', type:'multiple', prompt:'Что из коробки даёт ASP.NET Core Identity? (несколько ответов)', options:['Хеширование паролей','Блокировку после неудачных попыток','Двухфакторную аутентификацию','Единый вход для десятка сторонних приложений'], answer:[0,1,2], explanation:'SSO — задача OIDC-провайдера.', difficulty:2 },
  { id:'t7-8', type:'order', prompt:'Расставьте шаги входа по JWT.', options:['Клиент отправляет логин и пароль','Сервер проверяет и выпускает токен','Клиент шлёт Authorization: Bearer','Middleware проверяет подпись и заполняет User'], answer:[0,1,2,3], explanation:'Дальше работает авторизация.', difficulty:1 }
 ]
},
{
 id: 8, title: 'Авторизация и защита API', short: 'Политики, ресурсная авторизация, CORS, HTTPS, rate limiting, заголовки',
 lessons: [
 { id:'8-1', title:'Роли, claims и политики', html:`
<pre><code>builder.Services.AddAuthorizationBuilder()
    .AddPolicy("Admin", p =&gt; p.RequireRole("Admin"))
    .AddPolicy("ProSubscriber", p =&gt; p.RequireClaim("subscription", "pro", "enterprise"))
    .AddPolicy("Adult", p =&gt; p.AddRequirements(new MinimumAgeRequirement(18)))
    .SetFallbackPolicy(new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build());

// Minimal API
g.MapDelete("/{id:int}", Delete).RequireAuthorization("Admin");
g.MapGet("/", List).AllowAnonymous();

// Контроллеры
[Authorize(Policy = "ProSubscriber")]
public class ReportsController : ControllerBase { ... }</code></pre>
<p><b>Fallback-политика</b> «требовать аутентификацию» закрывает все эндпойнты по умолчанию. Публичные помечаются явно <code>AllowAnonymous</code> — забытый атрибут не откроет данные.</p>
<h3>Собственное требование</h3>
<pre><code>public record MinimumAgeRequirement(int Age) : IAuthorizationRequirement;

public class MinimumAgeHandler(TimeProvider time) : AuthorizationHandler&lt;MinimumAgeRequirement&gt;
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext ctx, MinimumAgeRequirement req)
    {
        if (DateOnly.TryParse(ctx.User.FindFirstValue(ClaimTypes.DateOfBirth), out var dob)
            &amp;&amp; dob.AddYears(req.Age) &lt;= DateOnly.FromDateTime(time.GetUtcNow().UtcDateTime))
            ctx.Succeed(req);
        return Task.CompletedTask;
    }
}
builder.Services.AddSingleton&lt;IAuthorizationHandler, MinimumAgeHandler&gt;();</code></pre>
<div class="note why">Политики отделяют правила доступа от кода эндпойнтов. Роль — простой случай политики; для сложных правил — claims и требования.</div>`,
 check: [
  { id:'q8-1a', type:'single', prompt:'Что делает fallback-политика RequireAuthenticatedUser?', options:['Требует аутентификацию для всех эндпойнтов без явных атрибутов','Разрешает всё анонимно','Требует роль Admin','Отключает авторизацию'], answer:0, explanation:'Безопасно по умолчанию.' },
  { id:'q8-1b', type:'single', prompt:'Как сделать эндпойнт публичным при включённой fallback-политике?', options:['AllowAnonymous()','RequireAuthorization()','[Authorize]','Убрать UseAuthorization'], answer:0, explanation:'Явное исключение.' }
 ]},
 { id:'8-2', title:'Ресурсная авторизация', html:`
<p>Роль «Customer» разрешает смотреть заказы, но <b>только свои</b>. Самая частая уязвимость API — <b>IDOR / BOLA</b>: <code>GET /api/orders/1002</code> отдаёт чужой заказ, потому что проверили только «пользователь вошёл».</p>
<pre><code>// Плохо
var order = await db.Orders.FindAsync(id);
return order is null ? NotFound() : Ok(order.ToDto());

// Хорошо: фильтр по владельцу прямо в запросе
var order = await db.Orders
    .Where(o =&gt; o.Id == id &amp;&amp; o.CustomerId == currentUser.Id)
    .Select(OrderMapping.Projection)
    .FirstOrDefaultAsync(ct);
return order is null ? NotFound() : Ok(order);       // 404: не раскрываем, что заказ существует</code></pre>
<p>Для сложных правил — <code>IAuthorizationService</code> с ресурсом:</p>
<pre><code>public class OrderOwnerHandler : AuthorizationHandler&lt;OperationAuthorizationRequirement, Order&gt;
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext ctx,
        OperationAuthorizationRequirement op, Order order)
    {
        var uid = ctx.User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (order.CustomerId == uid || ctx.User.IsInRole("Support")) ctx.Succeed(op);
        return Task.CompletedTask;
    }
}

var result = await auth.AuthorizeAsync(User, order, new OperationAuthorizationRequirement { Name = "Cancel" });
if (!result.Succeeded) return Forbid();</code></pre>
<div class="note warn"><b>Глобальные фильтры запросов</b> EF Core (<code>HasQueryFilter(o =&gt; o.TenantId == _tenant.Id)</code>) помогают в мультиарендных системах: забытый Where не отдаст данные чужого клиента.</div>`,
 check: [
  { id:'q8-2a', type:'single', prompt:'Что такое IDOR/BOLA?', options:['Доступ к чужому объекту подстановкой его id, когда не проверен владелец','Подбор пароля','Межсайтовый скриптинг','Перегрузка сервера'], answer:0, explanation:'OWASP API Security Top 10 №1.' },
  { id:'q8-2b', type:'single', prompt:'Где надёжнее всего проверить владельца при чтении заказа?', options:['В условии запроса к БД: Where(o => o.CustomerId == currentUser.Id)','Только во фронтенде','В названии маршрута','Никак'], answer:0, explanation:'Чужие данные даже не загружаются.' }
 ]},
 { id:'8-3', title:'CORS и HTTPS', html:`
<h3>CORS</h3>
<p>Браузер запрещает JavaScript с <code>https://app.shop.example</code> читать ответы <code>https://api.shop.example</code>, если сервер явно не разрешил. CORS — это разрешение для браузера, а <b>не защита API</b>: curl и мобильное приложение его игнорируют.</p>
<pre><code>builder.Services.AddCors(o =&gt; o.AddPolicy("Frontend", p =&gt; p
    .WithOrigins("https://app.shop.example")          // конкретные источники, не "*"
    .WithMethods("GET", "POST", "PUT", "DELETE")
    .WithHeaders("Content-Type", "Authorization")
    .AllowCredentials()));                             // для cookie; несовместимо с AllowAnyOrigin
...
app.UseCors("Frontend");</code></pre>
<p>Для «непростых» запросов (JSON, Authorization) браузер сначала шлёт preflight <code>OPTIONS</code> — поэтому <code>UseCors</code> стоит до аутентификации (<a href="#/l/1-2">урок 1.2</a>).</p>
<h3>HTTPS</h3>
<pre><code>if (!app.Environment.IsDevelopment()) app.UseHsts();   // Strict-Transport-Security: браузер не пойдёт по HTTP
app.UseHttpsRedirection();                              // 307 на https://</code></pre>
<pre><code>$ dotnet dev-certs https --trust     # доверенный сертификат для localhost</code></pre>
<div class="note">За обратным прокси TLS часто завершается на прокси. Тогда приложению нужно знать исходную схему и IP — <code>UseForwardedHeaders</code> (модуль 11), иначе редирект на HTTPS зациклится.</div>`,
 check: [
  { id:'q8-3a', type:'single', prompt:'Защищает ли CORS API от запросов из curl или Postman?', options:['Нет: CORS соблюдает только браузер','Да, полностью','Только для POST','Только с HTTPS'], answer:0, explanation:'Для защиты нужны аутентификация и авторизация.' },
  { id:'q8-3b', type:'single', prompt:'Что делает HSTS?', options:['Говорит браузеру всегда обращаться к сайту только по HTTPS','Сжимает ответы','Ограничивает частоту запросов','Шифрует базу данных'], answer:0, explanation:'Заголовок Strict-Transport-Security.' }
 ]},
 { id:'8-4', title:'Rate limiting и защита по OWASP', html:`
<pre><code>builder.Services.AddRateLimiter(o =&gt;
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    o.AddFixedWindowLimiter("api", w =&gt; { w.PermitLimit = 100; w.Window = TimeSpan.FromMinutes(1); });
    o.AddPolicy("login", ctx =&gt; RateLimitPartition.GetSlidingWindowLimiter(
        ctx.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ =&gt; new() { PermitLimit = 5, Window = TimeSpan.FromMinutes(1), SegmentsPerWindow = 6 }));
});
app.UseRateLimiter();
app.MapPost("/api/auth/login", Login).RequireRateLimiting("login");</code></pre>
<p>Алгоритмы: фиксированное окно, скользящее окно, token bucket, ограничение одновременных запросов.</p>
<h3>Чек-лист безопасности API</h3>
<div class="tbl"><table><tr><th>Угроза (OWASP API Top 10)</th><th>Защита в ASP.NET</th></tr>
<tr><td>Доступ к чужим объектам</td><td>Фильтр по владельцу, ресурсная авторизация</td></tr>
<tr><td>Сломанная аутентификация</td><td>Identity / OIDC, короткие токены, rate limit на вход</td></tr>
<tr><td>Лишние поля / overposting</td><td>DTO на вход и выход</td></tr>
<tr><td>Отсутствие ограничений</td><td>Rate limiting, пагинация с максимумом, <code>RequestSizeLimit</code></td></tr>
<tr><td>Функции администратора доступны всем</td><td>Fallback-политика, политики на группы</td></tr>
<tr><td>SSRF</td><td>Белый список адресов для HttpClient</td></tr>
<tr><td>Ошибки конфигурации</td><td>Production-окружение, нет детальных ошибок, секреты вне репозитория</td></tr>
<tr><td>Инъекции</td><td>Параметризованные запросы EF Core; осторожно с <code>FromSqlRaw</code> — используйте <code>FromSql($"...")</code></td></tr>
</table></div>
<p class="small">Подробно об атаках и защите — <a href="../cyber-security/">курс «Информационная безопасность»</a>.</p>`,
 check: [
  { id:'q8-4a', type:'single', prompt:'Какой код ответа при превышении лимита запросов?', options:['429 Too Many Requests','403','503','400'], answer:0, explanation:'Можно добавить заголовок Retry-After.' },
  { id:'q8-4b', type:'single', prompt:'Почему FromSql($"... {id}") безопасен, а FromSqlRaw("... " + id) — нет?', options:['FromSql превращает интерполяцию в параметры, а конкатенация допускает SQL-инъекцию','FromSqlRaw медленнее','FromSql не поддерживает строки','Разницы нет'], answer:0, explanation:'Параметризация защищает от инъекций.' }
 ]}
 ],
 test: [
  { id:'t8-1', type:'analyze', prompt:'Какая уязвимость?', code:'app.MapGet("/api/invoices/{id:int}", async (int id, ShopDb db) =>\n    await db.Invoices.FindAsync(id) is { } inv ? Results.Ok(inv.ToDto()) : Results.NotFound())\n   .RequireAuthorization();', options:['IDOR: любой вошедший пользователь читает любые счета','SQL-инъекция','Нет HTTPS','Нет CORS'], answer:0, explanation:'Нужна проверка владельца.', difficulty:2 },
  { id:'t8-2', type:'single', prompt:'Почему нельзя совмещать AllowAnyOrigin и AllowCredentials?', options:['Тогда любой сайт мог бы отправлять запросы с cookie пользователя и читать ответы','Это медленно','Браузер не поддерживает credentials','Так требует JWT'], answer:0, explanation:'ASP.NET запрещает эту комбинацию.', difficulty:2 },
  { id:'t8-3', type:'match', prompt:'Сопоставьте угрозу и защиту.', pairs:[['Подбор пароля','Rate limiting на /login'],['Overposting','DTO на вход'],['Чтение чужих данных','Проверка владельца'],['Перехват трафика','HTTPS + HSTS']], explanation:'Базовые меры.', difficulty:1 },
  { id:'t8-4', type:'single', prompt:'Что надёжнее: [Authorize] на каждом контроллере или fallback-политика + AllowAnonymous для публичных?', options:['Fallback-политика: забытый атрибут не откроет эндпойнт','Атрибуты на каждом','Одинаково','Ни то ни другое'], answer:0, explanation:'Закрыто по умолчанию.', difficulty:2 },
  { id:'t8-5', type:'single', prompt:'Как ограничить максимальный размер страницы в API?', options:['Clamp параметра size: Math.Min(size, 100)','Довериться клиенту','Ограничить в JavaScript','Никак'], answer:0, explanation:'Иначе запрос size=1000000 положит БД.', difficulty:1 },
  { id:'t8-6', type:'single', prompt:'Где в ASP.NET описывают правило «доступ только подписчикам pro»?', options:['В политике авторизации с RequireClaim','В appsettings.json','В Dockerfile','В CORS'], answer:0, explanation:'Политики отделяют правила доступа.', difficulty:1 },
  { id:'t8-7', type:'single', prompt:'Зачем HasQueryFilter в мультиарендной системе?', options:['Автоматически добавлять фильтр по арендатору во все запросы','Ускорить индексы','Шифровать данные','Логировать запросы'], answer:0, explanation:'Защита от забытого Where.', difficulty:2 },
  { id:'t8-8', type:'multiple', prompt:'Что относится к защите от «отсутствия ограничений ресурсов»? (несколько ответов)', options:['Rate limiting','Максимальный размер страницы','RequestSizeLimit для загрузок','Включить Development в продакшене'], answer:[0,1,2], explanation:'Development — наоборот, проблема.', difficulty:1 }
 ]
},
{
 id: 9, title: 'Производительность и фоновая работа', short: 'Кэширование, output cache, сжатие, фоновые задачи, устойчивые HTTP-вызовы',
 lessons: [
 { id:'9-1', title:'Кэширование данных', html:`
<div class="tbl"><table><tr><th>Вид</th><th>Где хранится</th><th>Когда</th></tr>
<tr><td><code>IMemoryCache</code></td><td>Память процесса</td><td>Одна реплика, небольшие данные</td></tr>
<tr><td><code>IDistributedCache</code></td><td>Redis, SQL Server</td><td>Несколько реплик, общий кэш</td></tr>
<tr><td><code>HybridCache</code> (.NET 9+)</td><td>Память + распределённый</td><td>Рекомендуемый вариант по умолчанию</td></tr>
</table></div>
<pre><code>builder.Services.AddStackExchangeRedisCache(o =&gt; o.Configuration = cfg.GetConnectionString("Redis"));
builder.Services.AddHybridCache();

public class CatalogService(HybridCache cache, ShopDb db)
{
    public ValueTask&lt;List&lt;CategoryDto&gt;&gt; CategoriesAsync(CancellationToken ct) =&gt;
        cache.GetOrCreateAsync("categories",
            async token =&gt; await db.Categories.Select(c =&gt; new CategoryDto(c.Id, c.Name)).ToListAsync(token),
            new HybridCacheEntryOptions { Expiration = TimeSpan.FromMinutes(10) },
            tags: ["catalog"],
            cancellationToken: ct);

    public ValueTask InvalidateAsync() =&gt; cache.RemoveByTagAsync("catalog");
}</code></pre>
<p><code>HybridCache</code> решает проблему «stampede»: если 500 запросов одновременно не нашли ключ, в БД пойдёт только один.</p>
<div class="note warn"><b>Две трудные вещи в программировании</b> — инвалидация кэша и именование. Решите заранее: сколько данные могут быть устаревшими (TTL) и кто сбрасывает кэш при изменении. Не кэшируйте данные, зависящие от пользователя, под общим ключом.</div>`,
 check: [
  { id:'q9-1a', type:'single', prompt:'Почему IMemoryCache плохо подходит для нескольких реплик?', options:['У каждой реплики свой кэш: данные расходятся и инвалидация сложнее','Он медленный','Его нельзя очистить','Он хранит данные на диске'], answer:0, explanation:'Нужен распределённый или гибридный кэш.' },
  { id:'q9-1b', type:'single', prompt:'Что такое cache stampede?', options:['Множество одновременных промахов кэша, каждый из которых идёт в БД','Переполнение кэша','Удаление кэша при деплое','Кэширование ошибок'], answer:0, explanation:'HybridCache пропускает к источнику один запрос.' }
 ]},
 { id:'9-2', title:'Кэширование ответов и сжатие', html:`
<h3>Output cache — кэш готовых ответов на сервере</h3>
<pre><code>builder.Services.AddOutputCache(o =&gt;
{
    o.AddBasePolicy(b =&gt; b.Expire(TimeSpan.FromSeconds(30)));
    o.AddPolicy("Catalog", b =&gt; b.Expire(TimeSpan.FromMinutes(5)).SetVaryByQuery("category", "page").Tag("catalog"));
});
app.UseOutputCache();

g.MapGet("/", List).CacheOutput("Catalog");
// при изменении товара
await outputCache.EvictByTagAsync("catalog", ct);</code></pre>
<p>По умолчанию кэшируются только GET/HEAD-ответы 200 без аутентификации и без cookie.</p>
<h3>HTTP-кэширование у клиента и CDN</h3>
<pre><code>ctx.Response.Headers.CacheControl = "public, max-age=300";   // браузер и CDN хранят 5 минут
ctx.Response.Headers.ETag = $"\\"{product.Version}\\"";        // условный GET → 304 Not Modified</code></pre>
<h3>Сжатие</h3>
<pre><code>builder.Services.AddResponseCompression(o =&gt; { o.EnableForHttps = true; o.Providers.Add&lt;BrotliCompressionProvider&gt;(); });
app.UseResponseCompression();</code></pre>
<div class="note">Если перед приложением стоит nginx или CDN, сжатие и кэширование статики обычно делают там. Подробнее о кэшах HTTP и CDN — в <a href="../network/">курсе «Сети»</a>.</div>`,
 check: [
  { id:'q9-2a', type:'single', prompt:'Кэширует ли output cache по умолчанию ответы для аутентифицированных пользователей?', options:['Нет — чтобы не отдать чужие данные','Да, всегда','Только POST','Только 500'], answer:0, explanation:'Безопасное поведение по умолчанию.' },
  { id:'q9-2b', type:'single', prompt:'Что вернёт сервер на условный GET с совпадающим ETag?', options:['304 Not Modified без тела','200 с телом','412','404'], answer:0, explanation:'Клиент использует свою копию.' }
 ]},
 { id:'9-3', title:'Фоновые задачи', html:`
<p>Долгие операции (отправка писем, генерация отчёта) не стоит выполнять внутри HTTP-запроса. Примите задачу, ответьте 202 и обработайте в фоне.</p>
<pre><code>public sealed class EmailQueue
{
    private readonly Channel&lt;EmailMessage&gt; _ch = Channel.CreateBounded&lt;EmailMessage&gt;(1000);
    public ValueTask EnqueueAsync(EmailMessage m, CancellationToken ct) =&gt; _ch.Writer.WriteAsync(m, ct);
    public IAsyncEnumerable&lt;EmailMessage&gt; ReadAllAsync(CancellationToken ct) =&gt; _ch.Reader.ReadAllAsync(ct);
}

public sealed class EmailWorker(EmailQueue queue, IServiceScopeFactory scopes, ILogger&lt;EmailWorker&gt; log)
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var msg in queue.ReadAllAsync(stoppingToken))
        {
            try
            {
                using var scope = scopes.CreateScope();              // свой scope на каждую задачу
                var sender = scope.ServiceProvider.GetRequiredService&lt;IEmailSender&gt;();
                await sender.SendAsync(msg, stoppingToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                log.LogError(ex, "Не удалось отправить письмо {To}", msg.To);
            }
        }
    }
}

builder.Services.AddSingleton&lt;EmailQueue&gt;();
builder.Services.AddHostedService&lt;EmailWorker&gt;();</code></pre>
<p class="small">BackgroundService — <a href="../csharp/#/l/9-4">C# 9.4</a>. Почему нужен scope — захваченные зависимости, <a href="../csharp/#/l/9-2">C# 9.2</a>.</p>
<div class="note warn"><b>In-memory очередь теряет задачи</b> при перезапуске. Для важных задач — надёжная очередь (RabbitMQ, Azure Service Bus, Kafka) или библиотека с хранилищем (Hangfire, Quartz.NET), а для согласованности с БД — паттерн Outbox (<a href="#/l/5-4">урок 5.4</a>).</div>`,
 check: [
  { id:'q9-3a', type:'single', prompt:'Почему BackgroundService создаёт scope на каждую задачу?', options:['Он Singleton, а сервисы вроде DbContext — Scoped','Так быстрее','Чтобы задачи шли параллельно','Это требование Channel'], answer:0, explanation:'Каждая единица работы получает свежие Scoped-сервисы.' },
  { id:'q9-3b', type:'single', prompt:'Какой код вернуть, если задача поставлена в очередь на фоновую обработку?', options:['202 Accepted','200 OK с результатом','201 Created','204'], answer:0, explanation:'Результат будет позже.' }
 ]},
 { id:'9-4', title:'Устойчивость и производительность', html:`
<h3>Вызовы других сервисов</h3>
<pre><code>builder.Services.AddHttpClient&lt;PaymentClient&gt;(c =&gt; c.BaseAddress = new("https://pay.example/"))
    .AddStandardResilienceHandler();    // повторы с backoff, таймауты, circuit breaker</code></pre>
<p>Повторять можно только идемпотентные операции или с ключом идемпотентности (<a href="#/l/6-1">урок 6.1</a>).</p>
<h3>Правила производительности</h3>
<ul>
<li><b>Async до конца</b> (<a href="../csharp/#/l/8-4">C# 8.4</a>): никакого <code>.Result</code> — иначе голодание пула потоков.</li>
<li><b>Не читайте лишнего из БД</b>: проекции, пагинация, индексы (<a href="#/l/5-3">урок 5.3</a>).</li>
<li><b>Потоковая выдача</b> больших списков: возвращайте <code>IAsyncEnumerable&lt;T&gt;</code> — сериализатор будет писать по мере чтения.</li>
<li><b>Не держите большие объекты</b> в памяти: файлы читайте и пишите потоками.</li>
<li><b>Измеряйте</b>, а не угадывайте: <code>dotnet-counters</code>, <code>dotnet-trace</code>, метрики OpenTelemetry, нагрузочные тесты (k6, NBomber).</li>
</ul>
<pre><code>$ dotnet-counters monitor -n Shop.Api --counters Microsoft.AspNetCore.Hosting,System.Runtime
  Requests / sec           1 250
  Current Requests            38
  ThreadPool Queue Length      0      ← растёт? ищите блокирующие вызовы</code></pre>
<div class="note"><b>Native AOT</b> (<code>&lt;PublishAot&gt;true&lt;/PublishAot&gt;</code>) компилирует Minimal API в нативный бинарник: старт за десятки миллисекунд и меньше памяти. Ограничения: нет рефлексии, нужны source generators для JSON.</div>`,
 check: [
  { id:'q9-4a', type:'single', prompt:'Что делает AddStandardResilienceHandler?', options:['Добавляет повторы, таймауты и circuit breaker к HttpClient','Шифрует запросы','Кэширует ответы','Логирует тела запросов'], answer:0, explanation:'Пакет Microsoft.Extensions.Http.Resilience.' },
  { id:'q9-4b', type:'single', prompt:'Растёт ThreadPool Queue Length при низкой загрузке CPU. Что вероятнее всего?', options:['Блокирующие вызовы (.Result, .Wait) в асинхронном коде','Слишком мощный сервер','Медленный JSON','Неверный порт'], answer:0, explanation:'Голодание пула потоков.' }
 ]}
 ],
 test: [
  { id:'t9-1', type:'match', prompt:'Сопоставьте инструмент и задачу.', pairs:[['HybridCache','Кэш данных в памяти и Redis'],['OutputCache','Кэш готовых HTTP-ответов'],['ResponseCompression','Сжатие ответов'],['BackgroundService','Фоновая обработка']], explanation:'Инструменты производительности.', difficulty:1 },
  { id:'t9-2', type:'analyze', prompt:'Что не так?', code:'app.MapPost("/api/reports", async (ReportRequest r, ReportService s) =>\n{\n    var pdf = await s.BuildAsync(r);          // 3–5 минут\n    return Results.File(pdf, "application/pdf");\n});', options:['Долгая операция внутри запроса: таймауты прокси и клиента, лучше очередь и 202','Нужен GET','Неверный Content-Type','Всё правильно'], answer:0, explanation:'Поставьте задачу в очередь и отдайте ссылку на статус.', difficulty:2 },
  { id:'t9-3', type:'single', prompt:'Почему нельзя кэшировать персональный ответ /api/me под общим ключом?', options:['Пользователи получат чужие данные','Кэш переполнится','Ответ станет медленнее','Нельзя кэшировать JSON'], answer:0, explanation:'Ключ должен учитывать пользователя — или не кэшировать.', difficulty:1 },
  { id:'t9-4', type:'single', prompt:'Чем плоха in-memory очередь Channel для отправки счетов клиентам?', options:['Задачи теряются при перезапуске процесса','Она медленная','Её нельзя читать асинхронно','Она не работает в Docker'], answer:0, explanation:'Для важных задач — надёжная очередь или Outbox.', difficulty:2 },
  { id:'t9-5', type:'single', prompt:'Какой тип вернуть, чтобы большой список отдавался потоково по мере чтения из БД?', options:['IAsyncEnumerable<T>','List<T>','T[]','string'], answer:0, explanation:'Сериализатор пишет элементы по одному.', difficulty:2 },
  { id:'t9-6', type:'single', prompt:'Какой POST безопасно повторять автоматически?', options:['С ключом идемпотентности, который сервер проверяет','Любой','Никакой и никогда','Только с пустым телом'], answer:0, explanation:'Иначе возможны дубликаты.', difficulty:2 },
  { id:'t9-7', type:'single', prompt:'Что даёт Native AOT для Minimal API?', options:['Быстрый старт и меньше памяти','Автоматический кэш','Больше рефлексии','Поддержку WebForms'], answer:0, explanation:'Цена — ограничения на рефлексию.', difficulty:2 },
  { id:'t9-8', type:'multiple', prompt:'Какие инструменты помогают измерить производительность? (несколько ответов)', options:['dotnet-counters','dotnet-trace','k6 / NBomber','Console.ReadLine'], answer:[0,1,2], explanation:'Измеряйте, а не угадывайте.', difficulty:1 }
 ]
},
{
 id: 10, title: 'Другие модели: SignalR, Razor, Blazor, gRPC', short: 'Реальное время, серверный HTML, UI на C#, межсервисное RPC',
 lessons: [
 { id:'10-1', title:'SignalR: реальное время', html:`
<p><b>SignalR</b> — двусторонняя связь сервер ↔ клиент поверх WebSocket (с откатом на Server-Sent Events и long polling).</p>
<pre><code>public interface IOrderClient { Task StatusChanged(Guid orderId, string status); }

[Authorize]
public class OrdersHub : Hub&lt;IOrderClient&gt;
{
    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier!;
        await Groups.AddToGroupAsync(Context.ConnectionId, $"user-{userId}");
    }
}

builder.Services.AddSignalR();
app.MapHub&lt;OrdersHub&gt;("/hubs/orders");

// отправка из любого сервиса
public class OrderNotifier(IHubContext&lt;OrdersHub, IOrderClient&gt; hub)
{
    public Task NotifyAsync(Order o) =&gt;
        hub.Clients.Group($"user-{o.CustomerId}").StatusChanged(o.Id, o.Status.ToString());
}</code></pre>
<pre><code>// JavaScript-клиент (@microsoft/signalr)
const conn = new signalR.HubConnectionBuilder().withUrl("/hubs/orders").withAutomaticReconnect().build();
conn.on("StatusChanged", (id, status) =&gt; updateBadge(id, status));
await conn.start();</code></pre>
<div class="note">При нескольких репликах сообщение должно дойти до клиента, подключённого к другой реплике: нужен backplane (Redis) или Azure SignalR Service.</div>`,
 check: [
  { id:'q10-1a', type:'single', prompt:'Какой транспорт SignalR использует в первую очередь?', options:['WebSocket','FTP','SMTP','gRPC'], answer:0, explanation:'С откатом на SSE и long polling.' },
  { id:'q10-1b', type:'single', prompt:'Что нужно SignalR при нескольких репликах приложения?', options:['Backplane, например Redis','Ничего','Отдельная база для каждого клиента','Sticky sessions не помогут ни в каком случае'], answer:0, explanation:'Иначе сообщения не дойдут до клиентов других реплик.' }
 ]},
 { id:'10-2', title:'Razor Pages и MVC', html:`
<p>Если сервер сам формирует HTML, используют Razor — смесь HTML и C#.</p>
<pre><code>// Pages/Products/Index.cshtml.cs
public class IndexModel(ShopDb db) : PageModel
{
    public List&lt;ProductDto&gt; Products { get; private set; } = [];
    public async Task OnGetAsync(string? q) =&gt;
        Products = await db.Products.Where(p =&gt; q == null || p.Name.Contains(q))
                                    .Select(ProductMapping.Projection).ToListAsync();
}</code></pre>
<pre><code>@* Pages/Products/Index.cshtml *@
@page
@model IndexModel
&lt;h1&gt;Каталог&lt;/h1&gt;
&lt;form method="get"&gt;&lt;input name="q" /&gt;&lt;button&gt;Найти&lt;/button&gt;&lt;/form&gt;
&lt;ul&gt;
@foreach (var p in Model.Products)
{
    &lt;li&gt;@p.Name — @p.Price.ToString("N0") ₽&lt;/li&gt;     @* вывод автоматически экранируется *@
}
&lt;/ul&gt;</code></pre>
<div class="tbl"><table><tr><th></th><th>Razor Pages</th><th>MVC</th></tr>
<tr><td>Организация</td><td>Страница = .cshtml + PageModel</td><td>Контроллер + представления + модели</td></tr>
<tr><td>Когда</td><td>Страничные сайты, админки, формы</td><td>Сложная навигация, много действий на контроллер</td></tr>
</table></div>
<p>Razor экранирует вывод (<code>@p.Name</code>) — защита от XSS по умолчанию. Формы защищены от CSRF антиподделочным токеном автоматически.</p>
<div class="note why">Для небольшой админки или внутреннего инструмента Razor Pages часто быстрее, чем отдельные SPA + API.</div>`,
 check: [
  { id:'q10-2a', type:'single', prompt:'Что защищает Razor-вывод @p.Name от XSS?', options:['Автоматическое HTML-экранирование','HTTPS','CORS','Rate limiting'], answer:0, explanation:'@Html.Raw отключает экранирование — используйте осторожно.' },
  { id:'q10-2b', type:'single', prompt:'Какой метод PageModel обрабатывает GET-запрос страницы?', options:['OnGet / OnGetAsync','Index','HandleGet','Get'], answer:0, explanation:'OnPost — для POST.' }
 ]},
 { id:'10-3', title:'Blazor', html:`
<p><b>Blazor</b> — компонентный UI на C# вместо JavaScript. Компонент — файл <code>.razor</code> с разметкой и кодом.</p>
<pre><code>@* Components/Counter.razor *@
@page "/counter"
@rendermode InteractiveServer

&lt;p&gt;Нажато: @count&lt;/p&gt;
&lt;button @onclick="Increment"&gt;+1&lt;/button&gt;

@code {
    private int count;
    private void Increment() =&gt; count++;
}</code></pre>
<div class="tbl"><table><tr><th>Режим</th><th>Где выполняется C#</th><th>Особенности</th></tr>
<tr><td>Static SSR</td><td>Сервер, только HTML</td><td>Как Razor Pages, без интерактивности</td></tr>
<tr><td>Interactive Server</td><td>Сервер, события по SignalR</td><td>Быстрый старт, нужно постоянное соединение</td></tr>
<tr><td>Interactive WebAssembly</td><td>Браузер (.NET в WASM)</td><td>Работает офлайн, долгая первая загрузка</td></tr>
<tr><td>Interactive Auto</td><td>Сначала сервер, потом WASM</td><td>Лучшее из двух, сложнее</td></tr>
</table></div>
<p>Код компонентов — тот же C#: DI (<code>@inject IProductService Products</code>), async, LINQ, record. Можно делить модели и валидацию между сервером и клиентом.</p>
<div class="note">Blazor хорош, когда команда пишет на C# и не хочет поддерживать отдельный JS-стек. Для публичных сайтов с жёсткими требованиями к скорости первой загрузки чаще выбирают SSR или JS-фреймворк + API.</div>`,
 check: [
  { id:'q10-3a', type:'single', prompt:'Как Blazor Interactive Server передаёт события кнопок на сервер?', options:['По SignalR-соединению','Отправкой формы с перезагрузкой страницы','Через gRPC','По email'], answer:0, explanation:'Сервер присылает обратно изменения DOM.' },
  { id:'q10-3b', type:'single', prompt:'Где выполняется C#-код в режиме Interactive WebAssembly?', options:['В браузере пользователя','На сервере','В базе данных','В CDN'], answer:0, explanation:'.NET runtime скомпилирован в WebAssembly.' }
 ]},
 { id:'10-4', title:'gRPC', html:`
<p><b>gRPC</b> — RPC-фреймворк поверх HTTP/2 с бинарной сериализацией Protobuf. Контракт описывается в <code>.proto</code>, код клиента и сервера генерируется.</p>
<pre><code>// Protos/inventory.proto
syntax = "proto3";
service Inventory {
  rpc GetStock (StockRequest) returns (StockReply);
  rpc WatchStock (StockRequest) returns (stream StockReply);   // серверный стрим
}
message StockRequest { string sku = 1; }
message StockReply   { string sku = 1; int32 quantity = 2; }</code></pre>
<pre><code>public class InventoryService(ShopDb db) : Inventory.InventoryBase
{
    public override async Task&lt;StockReply&gt; GetStock(StockRequest req, ServerCallContext ctx) =&gt;
        new() { Sku = req.Sku, Quantity = await db.Stock.Where(s =&gt; s.Sku == req.Sku).SumAsync(s =&gt; s.Qty, ctx.CancellationToken) };
}
builder.Services.AddGrpc();
app.MapGrpcService&lt;InventoryService&gt;();

// клиент в другом сервисе
builder.Services.AddGrpcClient&lt;Inventory.InventoryClient&gt;(o =&gt; o.Address = new("https://inventory"));</code></pre>
<div class="tbl"><table><tr><th></th><th>REST + JSON</th><th>gRPC</th></tr>
<tr><td>Формат</td><td>Текст, читаемый человеком</td><td>Бинарный, компактный</td></tr>
<tr><td>Контракт</td><td>OpenAPI (опционально)</td><td>.proto (обязательно), строгая типизация</td></tr>
<tr><td>Стриминг</td><td>Ограниченно</td><td>В обе стороны</td></tr>
<tr><td>Браузер</td><td>Нативно</td><td>Через gRPC-Web</td></tr>
<tr><td>Где</td><td>Публичные API</td><td>Межсервисное общение</td></tr>
</table></div>`,
 check: [
  { id:'q10-4a', type:'single', prompt:'Какой формат сериализации использует gRPC?', options:['Protocol Buffers','JSON','XML','YAML'], answer:0, explanation:'Бинарный и компактный.' },
  { id:'q10-4b', type:'single', prompt:'Где gRPC особенно уместен?', options:['Во внутреннем общении микросервисов','В публичном API для браузеров без прокси','Для отдачи статических файлов','Для HTML-страниц'], answer:0, explanation:'Браузерам нужен gRPC-Web.' }
 ]}
 ],
 test: [
  { id:'t10-1', type:'match', prompt:'Сопоставьте задачу и технологию.', pairs:[['Живой статус заказа в браузере','SignalR'],['Админка с формами на сервере','Razor Pages'],['Интерактивный UI на C#','Blazor'],['Вызов склада из сервиса заказов','gRPC']], explanation:'Модели ASP.NET Core.', difficulty:1 },
  { id:'t10-2', type:'single', prompt:'Как отправить сообщение SignalR из обычного сервиса, а не из хаба?', options:['Через IHubContext<THub>','Создать new Hub()','Через HttpClient','Это невозможно'], answer:0, explanation:'IHubContext внедряется через DI.', difficulty:2 },
  { id:'t10-3', type:'single', prompt:'Что делает @Html.Raw(userInput) в Razor?', options:['Выводит HTML без экранирования — опасно для пользовательского ввода (XSS)','Экранирует ввод','Шифрует ввод','Удаляет HTML'], answer:0, explanation:'Используйте только для доверенного HTML.', difficulty:2 },
  { id:'t10-4', type:'single', prompt:'Какой протокол нужен gRPC?', options:['HTTP/2 (или HTTP/3)','HTTP/1.0','FTP','SMTP'], answer:0, explanation:'Мультиплексирование и стримы HTTP/2.', difficulty:2 },
  { id:'t10-5', type:'single', prompt:'Главный недостаток Blazor WebAssembly?', options:['Долгая первая загрузка из-за скачивания runtime','Нет C#','Нужен постоянный SignalR','Не работает в браузере'], answer:0, explanation:'Зато потом работает без сервера.', difficulty:2 },
  { id:'t10-6', type:'single', prompt:'Как Razor Pages защищает формы от CSRF?', options:['Автоматическим антиподделочным токеном','Через CORS','Через HSTS','Никак'], answer:0, explanation:'Скрытое поле + cookie, проверка на POST.', difficulty:2 },
  { id:'t10-7', type:'single', prompt:'Что такое серверный стрим в gRPC?', options:['Сервер отправляет последовательность сообщений в ответ на один запрос','Видео-трансляция','Логи сервера','Резервная копия'], answer:0, explanation:'returns (stream T).', difficulty:2 },
  { id:'t10-8', type:'multiple', prompt:'Что общего у всех моделей ASP.NET Core? (несколько ответов)', options:['DI-контейнер','Middleware-конвейер','Аутентификация и авторизация','Обязательный JavaScript'], answer:[0,1,2], explanation:'Инфраструктура одна.', difficulty:1 }
 ]
},
{
 id: 11, title: 'Тестирование, наблюдаемость, деплой', short: 'WebApplicationFactory, Testcontainers, health checks, OpenTelemetry, Docker',
 lessons: [
 { id:'11-1', title:'Интеграционные тесты', html:`
<p class="small">Модульные тесты и моки — <a href="../csharp/#/l/11-1">C# 11.1–11.2</a>. Здесь — тесты всего приложения через HTTP.</p>
<pre><code>$ dotnet add package Microsoft.AspNetCore.Mvc.Testing
$ dotnet add package Testcontainers.PostgreSql</code></pre>
<pre><code>public class ApiFactory : WebApplicationFactory&lt;Program&gt;, IAsyncLifetime
{
    private readonly PostgreSqlContainer _db = new PostgreSqlBuilder().WithImage("postgres:16").Build();

    protected override void ConfigureWebHost(IWebHostBuilder b) =&gt;
        b.ConfigureTestServices(s =&gt;
        {
            s.RemoveAll&lt;DbContextOptions&lt;ShopDb&gt;&gt;();
            s.AddDbContext&lt;ShopDb&gt;(o =&gt; o.UseNpgsql(_db.GetConnectionString()));
            s.AddSingleton&lt;IEmailSender, FakeEmailSender&gt;();          // внешние сервисы — подменяем
        });

    public async Task InitializeAsync()
    {
        await _db.StartAsync();
        using var scope = Services.CreateScope();
        await scope.ServiceProvider.GetRequiredService&lt;ShopDb&gt;().Database.MigrateAsync();
    }
    public new Task DisposeAsync() =&gt; _db.DisposeAsync().AsTask();
}

public class ProductsApiTests(ApiFactory factory) : IClassFixture&lt;ApiFactory&gt;
{
    [Fact]
    public async Task Create_then_Get_returns_product()
    {
        var client = factory.CreateClient();
        var created = await client.PostAsJsonAsync("/api/products", new { name = "Книга", price = 500, categoryId = 1 });
        Assert.Equal(HttpStatusCode.Created, created.StatusCode);

        var p = await client.GetFromJsonAsync&lt;ProductDto&gt;(created.Headers.Location);
        Assert.Equal("Книга", p!.Name);
    }
}

// в конце Program.cs, чтобы тесты видели класс:
public partial class Program;</code></pre>
<div class="note why"><b>Что это проверяет.</b> Маршруты, привязку, валидацию, авторизацию, сериализацию, EF Core и настоящий SQL — всё то, что мокированные модульные тесты пропускают. Testcontainers поднимает настоящую PostgreSQL в Docker на время тестов.</div>`,
 check: [
  { id:'q11-1a', type:'single', prompt:'Что делает WebApplicationFactory<Program>?', options:['Поднимает приложение в памяти и даёт HttpClient к нему','Генерирует контроллеры','Деплоит в облако','Создаёт базу данных в продакшене'], answer:0, explanation:'Тесты идут через настоящий конвейер.' },
  { id:'q11-1b', type:'single', prompt:'Зачем Testcontainers вместо EF InMemory-провайдера?', options:['Тесты идут против настоящей СУБД с её SQL, ограничениями и транзакциями','Так быстрее','InMemory запрещён','Testcontainers не требует Docker'], answer:0, explanation:'InMemory не проверяет уникальность, транзакции и SQL.' }
 ]},
 { id:'11-2', title:'Health checks и наблюдаемость', html:`
<pre><code>builder.Services.AddHealthChecks()
    .AddDbContextCheck&lt;ShopDb&gt;(tags: ["ready"])
    .AddRedis(cfg.GetConnectionString("Redis")!, tags: ["ready"]);   // пакет AspNetCore.HealthChecks.Redis

app.MapHealthChecks("/health/live", new() { Predicate = _ =&gt; false });            // процесс жив
app.MapHealthChecks("/health/ready", new() { Predicate = c =&gt; c.Tags.Contains("ready") }); // готов принимать трафик</code></pre>
<p>Оркестратор (<a href="../devops/">курс DevOps</a>) перезапускает под при провале liveness и убирает его из балансировки при провале readiness.</p>
<h3>OpenTelemetry: логи, метрики, трейсы</h3>
<pre><code>builder.Services.AddOpenTelemetry()
    .ConfigureResource(r =&gt; r.AddService("shop-api"))
    .WithTracing(t =&gt; t.AddAspNetCoreInstrumentation().AddHttpClientInstrumentation()
                       .AddEntityFrameworkCoreInstrumentation().AddOtlpExporter())
    .WithMetrics(m =&gt; m.AddAspNetCoreInstrumentation().AddRuntimeInstrumentation().AddOtlpExporter());
builder.Logging.AddOpenTelemetry(o =&gt; o.AddOtlpExporter());</code></pre>
<p>Каждый HTTP-запрос получает trace: видно, сколько времени заняли SQL-запросы и вызовы других сервисов. Логи связаны с трейсом через <code>TraceId</code> — тот же, что вы отдаёте в ProblemDetails (<a href="#/l/4-2">урок 4.2</a>).</p>
<div class="note"><b>.NET Aspire</b> — набор инструментов для локальной разработки распределённых приложений: один проект запускает API, БД, Redis и очередь в контейнерах и открывает дашборд с логами, трейсами и метриками.</div>`,
 check: [
  { id:'q11-2a', type:'single', prompt:'Чем readiness отличается от liveness?', options:['Readiness — готов ли принимать трафик, liveness — жив ли процесс','Это одно и то же','Liveness проверяет БД','Readiness перезапускает процесс'], answer:0, explanation:'Недоступная БД — повод убрать из балансировки, но не перезапускать.' },
  { id:'q11-2b', type:'multiple', prompt:'Какие сигналы собирает OpenTelemetry? (несколько ответов)', options:['Трейсы','Метрики','Логи','Исходный код'], answer:[0,1,2], explanation:'Три столпа наблюдаемости.' }
 ]},
 { id:'11-3', title:'Конфигурация для продакшена', html:`
<pre><code>// За обратным прокси (nginx, ingress, облачный LB)
builder.Services.Configure&lt;ForwardedHeadersOptions&gt;(o =&gt;
{
    o.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    o.KnownNetworks.Clear(); o.KnownProxies.Clear();       // или перечислите адреса прокси
});
app.UseForwardedHeaders();     // первым: реальный IP клиента и схема https</code></pre>
<p>Чек-лист перед выкладкой:</p>
<ul>
<li><code>ASPNETCORE_ENVIRONMENT=Production</code>, нет детальных ошибок.</li>
<li>Секреты — из переменных окружения или хранилища секретов, не из <code>appsettings.json</code> (<a href="../csharp/#/l/9-3">C# 9.3</a>).</li>
<li>Строки подключения с минимальными правами (приложение не должно иметь прав DDL, если миграции — отдельный шаг).</li>
<li>HTTPS и HSTS, CORS только для нужных источников, rate limiting.</li>
<li>Структурные логи без персональных данных и токенов.</li>
<li>Health checks, метрики и трейсы подключены к мониторингу.</li>
<li>Корректная остановка: приложение обрабатывает SIGTERM и завершает текущие запросы (<code>HostOptions.ShutdownTimeout</code>).</li>
<li>Data Protection keys хранятся в общем месте при нескольких репликах — иначе cookie, выпущенные одной репликой, не прочитает другая.</li>
</ul>
<pre><code>builder.Services.AddDataProtection()
    .PersistKeysToStackExchangeRedis(redis, "DataProtection-Keys")
    .SetApplicationName("shop");</code></pre>`,
 check: [
  { id:'q11-3a', type:'single', prompt:'Зачем UseForwardedHeaders за прокси?', options:['Чтобы приложение видело реальный IP клиента и исходную схему https','Для сжатия','Для CORS','Для кэша'], answer:0, explanation:'Иначе все запросы будут «с IP прокси по http».' },
  { id:'q11-3b', type:'single', prompt:'Почему при нескольких репликах нужно общее хранилище ключей Data Protection?', options:['Иначе cookie и токены одной реплики не расшифрует другая','Для ускорения','Для логов','Ключи не нужны'], answer:0, explanation:'Ключи шифруют cookie аутентификации и антиподделочные токены.' }
 ]},
 { id:'11-4', title:'Docker и дальнейший путь', html:`
<pre><code># Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY *.sln .
COPY src/Shop.Api/*.csproj src/Shop.Api/
RUN dotnet restore                               # слой кэшируется, пока не изменились .csproj
COPY . .
RUN dotnet publish src/Shop.Api -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
USER app                                          # не root
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "Shop.Api.dll"]</code></pre>
<pre><code>$ docker build -t shop-api .
$ docker run -p 8080:8080 -e ConnectionStrings__Default="Host=db;..." shop-api
# или без Dockerfile:
$ dotnet publish --os linux --arch x64 /t:PublishContainer</code></pre>
<p class="small">Multi-stage сборка, слои и кэш — <a href="../devops/">курс DevOps</a>.</p>
<h3>Куда двигаться дальше</h3>
<div class="tbl"><table><tr><th>Направление</th><th>Что изучить</th></tr>
<tr><td>Архитектура</td><td>Clean Architecture, Vertical Slice, CQRS (MediatR), DDD — <a href="../oop/#/l/9-4">ООП 9</a></td></tr>
<tr><td>Распределённые системы</td><td>Очереди (MassTransit + RabbitMQ), Outbox, саги, .NET Aspire</td></tr>
<tr><td>Данные</td><td>Индексы и планы запросов, Dapper для сложных отчётов, Redis</td></tr>
<tr><td>Безопасность</td><td>OAuth 2.1 / OIDC глубже, Keycloak, OWASP ASVS</td></tr>
<tr><td>Эксплуатация</td><td>Kubernetes, CI/CD, SLO и алерты — курс DevOps</td></tr>
</table></div>
<div class="note why"><b>Итоговый проект.</b> API интернет-магазина: каталог с фильтрами и кэшем, корзина и заказы с ресурсной авторизацией, JWT/Identity, валидация и ProblemDetails, EF Core + PostgreSQL с миграциями, фоновая отправка писем, SignalR-уведомления о статусе, интеграционные тесты на Testcontainers, OpenTelemetry, Dockerfile и health checks. Всё необходимое для него разобрано в трёх курсах.</div>`,
 check: [
  { id:'q11-4a', type:'single', prompt:'Зачем в Dockerfile сначала копируют только .csproj и делают restore?', options:['Чтобы слой с зависимостями кэшировался и не пересобирался при каждом изменении кода','Так требует dotnet','Чтобы уменьшить образ в 10 раз','Для безопасности'], answer:0, explanation:'Кэш слоёв Docker.' },
  { id:'q11-4b', type:'single', prompt:'Почему финальный образ основан на aspnet, а не на sdk?', options:['Runtime-образ меньше и не содержит компилятора — меньше поверхность атаки','sdk не умеет запускать приложения','aspnet быстрее компилирует','Так требует Kestrel'], answer:0, explanation:'Multi-stage: сборка в sdk, запуск в aspnet.' }
 ]}
 ],
 test: [
  { id:'t11-1', type:'single', prompt:'Зачем public partial class Program; в конце Program.cs?', options:['Чтобы тестовый проект мог сослаться на Program в WebApplicationFactory','Чтобы ускорить запуск','Так требует Docker','Чтобы разделить файл'], answer:0, explanation:'Класс top-level statements по умолчанию internal.', difficulty:2 },
  { id:'t11-2', type:'match', prompt:'Сопоставьте инструмент и назначение.', pairs:[['WebApplicationFactory','Интеграционные тесты в памяти'],['Testcontainers','Настоящая БД в Docker для тестов'],['MapHealthChecks','Пробы для оркестратора'],['OpenTelemetry','Трейсы, метрики, логи']], explanation:'Инструменты качества и эксплуатации.', difficulty:1 },
  { id:'t11-3', type:'analyze', prompt:'Почему пользователей «выкидывает» из системы после деплоя на 3 реплики?', code:'// Program.cs\nbuilder.Services.AddAuthentication().AddCookie();\n// Data Protection не настроен,\n// каждая реплика генерирует ключи у себя в контейнере', options:['Ключи Data Protection разные и теряются при перезапуске — cookie не расшифровываются','Cookie слишком большие','Нет HTTPS','Неверный порт'], answer:0, explanation:'Храните ключи в Redis, БД или blob-хранилище.', difficulty:3 },
  { id:'t11-4', type:'single', prompt:'Что сделает Kubernetes при провале readiness-пробы?', options:['Уберёт под из балансировки, не перезапуская','Перезапустит под','Удалит деплоймент','Ничего'], answer:0, explanation:'Перезапуск — при провале liveness.', difficulty:2 },
  { id:'t11-5', type:'single', prompt:'Как задать строку подключения в контейнере без изменения образа?', options:['Переменной окружения ConnectionStrings__Default','Пересобрать образ с новым appsettings','Через launchSettings.json','Никак'], answer:0, explanation:'Двойное подчёркивание — разделитель секций.', difficulty:1 },
  { id:'t11-6', type:'single', prompt:'Зачем USER app в Dockerfile?', options:['Запуск не от root ограничивает ущерб при взломе','Чтобы ускорить запуск','Это имя приложения','Так требует .NET'], answer:0, explanation:'Принцип наименьших привилегий.', difficulty:1 },
  { id:'t11-7', type:'single', prompt:'Какой middleware должен идти первым при работе за обратным прокси?', options:['UseForwardedHeaders','UseAuthorization','UseOutputCache','MapControllers'], answer:0, explanation:'Остальные должны видеть реальные IP и схему.', difficulty:2 },
  { id:'t11-8', type:'multiple', prompt:'Что подменяют в интеграционных тестах? (несколько ответов)', options:['Отправку email','Платёжный шлюз','Внешние HTTP-API','Маршрутизацию ASP.NET'], answer:[0,1,2], explanation:'Своё приложение тестируют целиком.', difficulty:1 }
 ]
}
];

export const UPCOMING = [];

export const GLOSSARY = [
 ['ASP.NET Core','Фреймворк для веб-приложений и API на .NET.','0-1'],
 ['Kestrel','Встроенный кроссплатформенный HTTP-сервер ASP.NET Core.','0-1'],
 ['HttpContext','Объект текущего запроса: Request, Response, User, сервисы.','0-2'],
 ['Эндпойнт','Обработчик, сопоставленный с маршрутом и методом HTTP.','0-2'],
 ['WebApplication','Хост веб-приложения: сервисы, конвейер, эндпойнты.','0-3'],
 ['ASPNETCORE_ENVIRONMENT','Переменная, задающая окружение: Development, Staging, Production.','0-4'],
 ['launchSettings.json','Профили локального запуска, не используются в продакшене.','0-4'],
 ['Middleware','Компонент конвейера обработки запроса.','1-1'],
 ['RequestDelegate','Делегат HttpContext → Task, из которого строится конвейер.','1-1'],
 ['Short-circuit','Прерывание конвейера без вызова следующего компонента.','1-1'],
 ['Minimal API','Описание эндпойнтов лямбдами через MapGet/MapPost.','2-1'],
 ['Шаблон маршрута','Строка вида /products/{id:int} с параметрами и ограничениями.','2-1'],
 ['Привязка модели','Заполнение параметров из маршрута, query, тела, заголовков и DI.','2-2'],
 ['TypedResults','Типизированные результаты эндпойнтов для тестов и OpenAPI.','2-3'],
 ['MapGroup','Группа эндпойнтов с общим префиксом и настройками.','2-4'],
 ['Фильтр эндпойнта','Логика вокруг конкретного эндпойнта с доступом к аргументам.','2-4'],
 ['Контроллер','Класс с действиями, маршрутизируемыми атрибутами.','3-1'],
 ['[ApiController]','Атрибут, включающий поведение для API: автоматическая 400 и др.','3-1'],
 ['ActionResult<T>','Тип возврата действия: тело T или другой результат.','3-2'],
 ['Overposting','Изменение полей, которые клиент не должен менять, через привязку сущности.','3-3'],
 ['DataAnnotations','Атрибуты валидации: Required, Range, StringLength.','4-1'],
 ['FluentValidation','Библиотека валидации с правилами в отдельных классах.','4-1'],
 ['ProblemDetails','Стандартный JSON-формат ошибок HTTP API (RFC 9457).','4-2'],
 ['IExceptionHandler','Интерфейс глобального преобразования исключений в ответы.','4-3'],
 ['Migration bundle','Исполняемый файл для применения миграций EF Core в CI/CD.','5-2'],
 ['N+1','Отдельный запрос к БД на каждый элемент списка.','5-3'],
 ['AsNoTracking','Запрос EF Core без отслеживания изменений.','5-3'],
 ['Оптимистичная конкурентность','Обнаружение одновременных изменений по версии строки.','5-4'],
 ['Outbox','Запись событий в БД в той же транзакции для надёжной отправки.','5-4'],
 ['REST','Стиль API вокруг ресурсов и стандартных методов HTTP.','6-1'],
 ['Идемпотентность','Повтор запроса даёт тот же результат.','6-1'],
 ['Idempotency-Key','Заголовок для безопасного повтора неидемпотентных запросов.','6-1'],
 ['OpenAPI','Машиночитаемое описание HTTP API.','6-3'],
 ['Версионирование API','Поддержка нескольких несовместимых версий контракта.','6-4'],
 ['Аутентификация','Установление личности пользователя.','7-1'],
 ['Claim','Утверждение о пользователе в ClaimsPrincipal.','7-1'],
 ['JWT','Подписанный токен header.payload.signature.','7-2'],
 ['Refresh token','Долгоживущий отзываемый токен для получения новых access-токенов.','7-2'],
 ['ASP.NET Core Identity','Готовая система пользователей, паролей, ролей и 2FA.','7-3'],
 ['BFF','Backend for Frontend: бэкенд хранит токены, браузер получает cookie.','7-4'],
 ['Авторизация','Проверка, что пользователю разрешено действие.','8-1'],
 ['Политика авторизации','Именованный набор требований к пользователю.','8-1'],
 ['Fallback-политика','Политика для эндпойнтов без явных атрибутов авторизации.','8-1'],
 ['IDOR / BOLA','Доступ к чужому объекту подстановкой идентификатора.','8-2'],
 ['CORS','Механизм, позволяющий браузеру читать ответы другого источника.','8-3'],
 ['HSTS','Заголовок, обязывающий браузер использовать только HTTPS.','8-3'],
 ['Rate limiting','Ограничение частоты запросов.','8-4'],
 ['HybridCache','Двухуровневый кэш .NET 9 с защитой от stampede.','9-1'],
 ['Output cache','Серверный кэш готовых HTTP-ответов.','9-2'],
 ['ETag','Версия ресурса для условных запросов и кэширования.','9-2'],
 ['Channel','Потокобезопасная асинхронная очередь в памяти.','9-3'],
 ['Circuit breaker','Временное прекращение вызовов отказавшей зависимости.','9-4'],
 ['Native AOT','Компиляция приложения в нативный бинарник без JIT.','9-4'],
 ['SignalR','Библиотека двусторонней связи в реальном времени.','10-1'],
 ['Hub','Класс SignalR, через который сервер и клиенты вызывают методы друг друга.','10-1'],
 ['Razor Pages','Модель страниц с серверным HTML и PageModel.','10-2'],
 ['Blazor','Компонентный UI на C# с серверным или WebAssembly-выполнением.','10-3'],
 ['gRPC','RPC-фреймворк поверх HTTP/2 с Protobuf.','10-4'],
 ['WebApplicationFactory','Запуск приложения в памяти для интеграционных тестов.','11-1'],
 ['Testcontainers','Библиотека для запуска зависимостей тестов в Docker.','11-1'],
 ['Health check','Эндпойнт проверки живости и готовности.','11-2'],
 ['OpenTelemetry','Стандарт сбора трейсов, метрик и логов.','11-2'],
 ['Forwarded headers','Заголовки X-Forwarded-* от обратного прокси.','11-3'],
 ['Data Protection','Подсистема ключей для шифрования cookie и токенов.','11-3']
];
