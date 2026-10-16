// Контент курса: модули, уроки, вопросы, глоссарий.
// Загружается до assets/js/engine.js; константы видны движку как глобальные.
// ====== КОНТЕНТ КУРСА ======
// Типы вопросов: single | multiple | order | match | input | analyze
const MODULES = [
{
 id: 0, title: 'Платформа .NET', short: 'CLR, SDK, dotnet CLI, первая программа',
 lessons: [
 { id:'0-1', title:'Что такое .NET и C#', html:`
<p><b>C#</b> — язык программирования со статической типизацией, а <b>.NET</b> — платформа, на которой он работает: среда выполнения, стандартная библиотека и инструменты. На C# пишут веб-бэкенды (ASP.NET Core), десктоп, игры (Unity), облачные функции и консольные утилиты.</p>
<p>Как исходник превращается в работающую программу:</p>
<ol class="steps">
<li><b>Компилятор Roslyn</b> переводит <code>.cs</code>-файлы не в машинный код, а в промежуточный язык <b>IL</b> (Intermediate Language). Результат — сборка <code>.dll</code>.</li>
<li><b>CLR</b> (Common Language Runtime) загружает сборку и при первом вызове метода компилирует его IL в машинный код процессора — это <b>JIT</b>-компиляция.</li>
<li>CLR же управляет памятью (сборщик мусора), проверяет типы, обрабатывает исключения и потоки.</li>
</ol>
<div class="tbl"><table><tr><th>Название</th><th>Что это</th></tr>
<tr><td>.NET Framework</td><td>Старая версия только для Windows (до 4.8). Новые проекты на ней не начинают.</td></tr>
<tr><td>.NET (Core) 5, 6, 8, 9, 10…</td><td>Современная кроссплатформенная версия: Windows, Linux, macOS. LTS-релизы (8, 10) поддерживаются 3 года.</td></tr>
<tr><td>BCL</td><td>Base Class Library — стандартная библиотека: коллекции, файлы, сеть, JSON, потоки.</td></tr>
</table></div>
<div class="note why"><b>Зачем это для ASP.NET.</b> ASP.NET Core — это просто набор библиотек поверх того же .NET. Всё, что вы узнаете в этом курсе — типы, коллекции, LINQ, async/await, DI — каждый день используется в контроллерах и сервисах веб-приложения.</div>
<div class="note"><b>Курс опирается на курс ООП.</b> Здесь мы не объясняем заново, что такое инкапсуляция, полиморфизм, интерфейсы, SOLID и паттерны, — только то, как это записывается и работает в C#. Если эти слова пока незнакомы, сначала пройдите <a href="../oop/">курс «Объектно-ориентированное программирование»</a>; в уроках будут ссылки на нужные его разделы.</div>`,
 check: [
  { id:'q0-1a', type:'single', prompt:'Во что компилятор C# переводит исходный код?', options:['В промежуточный язык IL внутри сборки .dll','Сразу в машинный код x86','В JavaScript','В байткод Java'], answer:0, explanation:'Машинный код получается позже, JIT-компиляцией в CLR.' },
  { id:'q0-1b', type:'single', prompt:'Какую версию платформы выбрать для нового веб-проекта?', options:['Актуальный LTS-релиз современного .NET (например, .NET 8 или 10)','.NET Framework 4.8','.NET Core 1.0','Mono 2'], answer:0, explanation:'.NET Framework — только Windows и только поддержка; новые проекты делают на современном .NET.' }
 ]},
 { id:'0-2', title:'SDK и dotnet CLI', html:`
<p>Для разработки ставят <b>.NET SDK</b> — он включает компилятор, среду выполнения и утилиту <code>dotnet</code>. Для запуска готовых программ на сервере достаточно <b>runtime</b> (а для веба — ASP.NET Core Runtime).</p>
<pre><code>$ dotnet --version
8.0.403
$ dotnet new console -n Hello     # создать проект из шаблона
$ cd Hello
$ dotnet run                      # собрать и запустить
Hello, World!
$ dotnet build -c Release         # собрать в Release
$ dotnet new list                 # все шаблоны: console, classlib, webapi, xunit…</code></pre>
<p>Основные команды:</p>
<div class="tbl"><table><tr><th>Команда</th><th>Что делает</th></tr>
<tr><td><code>dotnet new</code></td><td>Создаёт проект или файл по шаблону</td></tr>
<tr><td><code>dotnet build</code></td><td>Компилирует в <code>bin/Debug/net8.0/</code></td></tr>
<tr><td><code>dotnet run</code></td><td>Собирает и запускает</td></tr>
<tr><td><code>dotnet test</code></td><td>Запускает тесты</td></tr>
<tr><td><code>dotnet add package X</code></td><td>Добавляет NuGet-пакет</td></tr>
<tr><td><code>dotnet publish</code></td><td>Готовит приложение к развёртыванию</td></tr>
</table></div>
<div class="note"><b>IDE.</b> Visual Studio (Windows), JetBrains Rider (все ОС) или VS Code с расширением C# Dev Kit. Все они под капотом вызывают тот же dotnet CLI.</div>`,
 check: [
  { id:'q0-2a', type:'single', prompt:'Какая команда создаёт новый консольный проект?', options:['dotnet new console','dotnet run console','dotnet create app','dotnet init'], answer:0, explanation:'dotnet new <шаблон> создаёт проект из шаблона.' },
  { id:'q0-2b', type:'single', prompt:'Что нужно установить на сервер, чтобы только запускать готовое веб-приложение?', options:['ASP.NET Core Runtime','Полный .NET SDK обязательно','Visual Studio','Ничего'], answer:0, explanation:'SDK нужен для разработки и сборки; для запуска хватает runtime.' }
 ]},
 { id:'0-3', title:'Первая программа', html:`
<p>Шаблон <code>console</code> создаёт файл <code>Program.cs</code> из одной строки:</p>
<pre><code>Console.WriteLine("Hello, World!");</code></pre>
<p>Это <b>top-level statements</b>: компилятор сам заворачивает код в класс и метод <code>Main</code>. Полная классическая форма выглядит так:</p>
<pre><code>using System;

namespace Hello;

class Program
{
    static void Main(string[] args)
    {
        Console.Write("Как вас зовут? ");
        string? name = Console.ReadLine();
        Console.WriteLine($"Привет, {name}!");
    }
}</code></pre>
<ul>
<li><code>using System;</code> — подключает пространство имён, чтобы писать <code>Console</code>, а не <code>System.Console</code>. В новых проектах частые using подключены неявно (<i>implicit usings</i>).</li>
<li><code>namespace</code> — логическая группа типов, обычно совпадает с путём папок.</li>
<li><code>static void Main</code> — точка входа. Может возвращать <code>int</code> (код выхода) или <code>Task</code> (для async).</li>
<li><code>$"..."</code> — интерполированная строка: выражения в фигурных скобках подставляются в текст.</li>
</ul>
<div class="note why"><b>В ASP.NET.</b> <code>Program.cs</code> веб-приложения тоже пишется top-level statements: <code>var app = WebApplication.Create(args); app.MapGet("/", () =&gt; "Hi"); app.Run();</code></div>`,
 check: [
  { id:'q0-3a', type:'single', prompt:'Что такое top-level statements?', options:['Код без явного класса и Main — компилятор генерирует их сам','Глобальные переменные','Код, который выполняется до компиляции','Атрибуты верхнего уровня'], answer:0, explanation:'Такой файл в проекте может быть только один — он и есть точка входа.' },
  { id:'q0-3b', type:'input', prompt:'Что выведет Console.WriteLine($"{2 + 3}x");? Введите результат.', answer:['5x'], explanation:'Выражение в фигурных скобках вычисляется: 5, затем дописывается x.' }
 ]},
 { id:'0-4', title:'Проект, решение и сборка', html:`
<p>Проект описывает файл <code>.csproj</code> в формате MSBuild:</p>
<pre><code>&lt;Project Sdk="Microsoft.NET.Sdk"&gt;
  &lt;PropertyGroup&gt;
    &lt;OutputType&gt;Exe&lt;/OutputType&gt;
    &lt;TargetFramework&gt;net8.0&lt;/TargetFramework&gt;
    &lt;Nullable&gt;enable&lt;/Nullable&gt;
    &lt;ImplicitUsings&gt;enable&lt;/ImplicitUsings&gt;
  &lt;/PropertyGroup&gt;
  &lt;ItemGroup&gt;
    &lt;PackageReference Include="Serilog" Version="4.0.0" /&gt;
    &lt;ProjectReference Include="..\\Shop.Core\\Shop.Core.csproj" /&gt;
  &lt;/ItemGroup&gt;
&lt;/Project&gt;</code></pre>
<ul>
<li><b>Sdk</b> — тип проекта: <code>Microsoft.NET.Sdk</code> для консоли и библиотек, <code>Microsoft.NET.Sdk.Web</code> для ASP.NET.</li>
<li><b>TargetFramework</b> — под какую версию .NET собирать.</li>
<li><b>Nullable</b> — включает анализ null-ссылок (модуль 4).</li>
<li>Все <code>.cs</code>-файлы в папке проекта подключаются автоматически.</li>
</ul>
<p><b>Решение</b> (<code>.sln</code> / <code>.slnx</code>) объединяет несколько проектов. Типичная структура веб-приложения:</p>
<pre><code>Shop.sln
├─ src/Shop.Api        (webapi — контроллеры, Program.cs)
├─ src/Shop.Core       (classlib — модели и бизнес-логика)
└─ tests/Shop.Tests    (xunit)</code></pre>
<pre><code>$ dotnet new sln -n Shop
$ dotnet new classlib -o src/Shop.Core
$ dotnet sln add src/Shop.Core
$ dotnet add src/Shop.Api reference src/Shop.Core</code></pre>
<div class="note"><b>Debug и Release.</b> Debug — без оптимизаций, с отладочной информацией. Release — оптимизированная сборка для продакшена. Публикуйте всегда Release.</div>`,
 check: [
  { id:'q0-4a', type:'single', prompt:'Какой Sdk указывают в .csproj веб-приложения ASP.NET Core?', options:['Microsoft.NET.Sdk.Web','Microsoft.NET.Sdk','Microsoft.AspNet.Mvc','System.Web'], answer:0, explanation:'Web SDK подключает ASP.NET Core и настройки для веба.' },
  { id:'q0-4b', type:'single', prompt:'Как один проект получает доступ к классам другого проекта решения?', options:['Через ProjectReference (dotnet add reference)','Копированием .cs-файлов','Через PackageReference на папку','Через using с путём к файлу'], answer:0, explanation:'Ссылка на проект добавляет его сборку в зависимости.' }
 ]}
 ],
 test: [
  { id:'t0-1', type:'single', prompt:'Что делает JIT-компилятор?', options:['Переводит IL в машинный код во время выполнения','Проверяет орфографию','Переводит C# в IL','Удаляет неиспользуемые объекты'], answer:0, explanation:'C# → IL делает Roslyn, IL → машинный код — JIT в CLR.', difficulty:1 },
  { id:'t0-2', type:'order', prompt:'Расставьте этапы от исходника до выполнения.', options:['Исходник .cs','Компиляция Roslyn','Сборка .dll с IL','Загрузка в CLR','JIT в машинный код'], answer:[0,1,2,3,4], explanation:'Исходник → компилятор → IL → CLR → машинный код.', difficulty:1 },
  { id:'t0-3', type:'match', prompt:'Сопоставьте команду и действие.', pairs:[['dotnet new','Создать проект по шаблону'],['dotnet run','Собрать и запустить'],['dotnet test','Запустить тесты'],['dotnet publish','Подготовить к развёртыванию']], explanation:'Базовые команды CLI.', difficulty:1 },
  { id:'t0-4', type:'single', prompt:'Что управляет памятью .NET-программы?', options:['Сборщик мусора CLR','Программист вручную через free()','Операционная система напрямую','Компилятор Roslyn'], answer:0, explanation:'GC освобождает объекты, на которые больше нет ссылок.', difficulty:1 },
  { id:'t0-5', type:'analyze', prompt:'Почему проект не собирается?', code:'error CS0246: The type or namespace name \'Product\'\ncould not be found (are you missing a using directive\nor an assembly reference?)\n\n// Product объявлен в проекте Shop.Core', options:['Нет ProjectReference на Shop.Core или нужного using','Ошибка в JIT','Неверная версия Windows','Нужно запустить dotnet run дважды'], answer:0, explanation:'Тип не виден: нет ссылки на проект или пространство имён не подключено.', difficulty:2 },
  { id:'t0-6', type:'single', prompt:'Сколько файлов с top-level statements может быть в одном проекте?', options:['Один','Сколько угодно','Два: для Debug и Release','Ни одного в .NET 8'], answer:0, explanation:'Это точка входа, а она одна.', difficulty:2 },
  { id:'t0-7', type:'single', prompt:'Какой тип возврата Main нужен, чтобы использовать внутри await?', options:['Task или Task<int>','void','string','object'], answer:0, explanation:'Асинхронный Main возвращает Task.', difficulty:2 },
  { id:'t0-8', type:'single', prompt:'Где по умолчанию окажется результат dotnet build?', options:['bin/Debug/<версия>/','obj/Release/','src/','В глобальном кэше NuGet'], answer:0, explanation:'По умолчанию конфигурация Debug.', difficulty:1 }
 ]
},
{
 id: 1, title: 'Основы синтаксиса', short: 'Типы, переменные, операторы, строки, ветвления, циклы',
 lessons: [
 { id:'1-1', title:'Переменные и встроенные типы', html:`
<p>C# — <b>статически типизированный</b> язык: тип каждой переменной известен при компиляции, и ошибка типов не доживёт до продакшена.</p>
<pre><code>int count = 10;            // 32-битное целое
long big = 9_000_000_000L; // 64-битное
double price = 19.99;      // число с плавающей точкой
decimal money = 19.99m;    // точная десятичная арифметика — для денег
bool isActive = true;
char letter = 'A';
string name = "Анна";

var total = count * 2;     // тип выводится: int
const double Pi = 3.14159; // константа времени компиляции</code></pre>
<div class="tbl"><table><tr><th>Тип</th><th>Размер</th><th>Когда использовать</th></tr>
<tr><td><code>int</code></td><td>4 байта, ±2,1 млрд</td><td>Счётчики, индексы, id</td></tr>
<tr><td><code>long</code></td><td>8 байт</td><td>Большие id, время в тиках</td></tr>
<tr><td><code>double</code></td><td>8 байт</td><td>Физика, статистика, координаты</td></tr>
<tr><td><code>decimal</code></td><td>16 байт</td><td>Деньги и всё, где важна точность</td></tr>
<tr><td><code>bool</code></td><td>1 байт</td><td>Флаги</td></tr>
<tr><td><code>string</code></td><td>—</td><td>Текст (UTF-16)</td></tr>
</table></div>
<p><code>var</code> — не динамический тип: компилятор выводит тип из правой части и дальше он фиксирован. <code>var x = 5; x = "a";</code> — ошибка компиляции.</p>
<div class="note warn"><b>Деньги — только decimal.</b> <code>0.1 + 0.2</code> в double даёт <code>0.30000000000000004</code>. В интернет-магазине это копейки, которые не сходятся в отчёте.</div>
<h3>Преобразования</h3>
<pre><code>int i = 42;
long l = i;               // неявно: без потери данных
int back = (int)l;        // явное приведение — может переполниться
int parsed = int.Parse("123");
bool ok = int.TryParse("abc", out int value); // false, value = 0</code></pre>
<p>Для пользовательского ввода (а в вебе это query-параметры и формы) используйте <code>TryParse</code>: он не бросает исключение на мусоре.</p>`,
 check: [
  { id:'q1-1a', type:'single', prompt:'Какой тип выбрать для цены товара?', options:['decimal','double','float','int'], answer:0, explanation:'decimal хранит десятичные дроби точно.' },
  { id:'q1-1b', type:'single', prompt:'Что произойдёт: var x = 5; x = "пять";', options:['Ошибка компиляции: x имеет тип int','x станет строкой','Ошибка во время выполнения','x станет object'], answer:0, explanation:'var выводит тип один раз — int.' }
 ]},
 { id:'1-2', title:'Операторы и выражения', html:`
<pre><code>int a = 7, b = 2;
Console.WriteLine(a / b);    // 3   — целочисленное деление
Console.WriteLine(a % b);    // 1   — остаток
Console.WriteLine(a / 2.0);  // 3.5 — один операнд double
a += 3;                      // 10
a++;                         // 11

bool adult = age &gt;= 18 &amp;&amp; hasPassport;  // &amp;&amp; и || — «ленивые»
string label = count == 1 ? "товар" : "товаров"; // тернарный оператор</code></pre>
<h3>Операторы для null</h3>
<pre><code>string? city = user.Address?.City;   // ?. — если Address null, результат null
string shown = city ?? "не указан";  // ?? — значение по умолчанию
settings.Timeout ??= 30;              // ??= — присвоить, если null</code></pre>
<p>Эти три оператора встречаются в каждом ASP.NET-проекте: данные из запроса и БД часто бывают неполными.</p>
<h3>Переполнение</h3>
<pre><code>int max = int.MaxValue;
int boom = max + 1;            // -2147483648, без ошибки!
checked { int x = max + 1; }   // OverflowException</code></pre>
<div class="note"><b>Сравнение строк.</b> <code>==</code> для строк сравнивает содержимое, а не ссылки. Для сравнения без учёта регистра: <code>string.Equals(a, b, StringComparison.OrdinalIgnoreCase)</code>.</div>`,
 check: [
  { id:'q1-2a', type:'input', prompt:'Чему равно 17 / 5 для двух переменных типа int? Введите число.', answer:['3'], explanation:'Целочисленное деление отбрасывает дробную часть.' },
  { id:'q1-2b', type:'single', prompt:'Что вернёт выражение user?.Name ?? "Гость", если user == null?', options:['"Гость"','null','Исключение NullReferenceException','Пустую строку'], answer:0, explanation:'?. даёт null, ?? подставляет значение по умолчанию.' }
 ]},
 { id:'1-3', title:'Строки', html:`
<p>Строка в .NET — <b>неизменяемый</b> объект. Любая «модификация» создаёт новую строку.</p>
<pre><code>string s = "  Hello, World  ";
s.Trim();                       // "Hello, World"  (s не изменилась!)
s = s.Trim().ToUpper();         // "HELLO, WORLD"
s.Contains("WORLD");            // true
s.Replace("WORLD", "C#");
s.Split(", ");                  // ["HELLO", "WORLD"]
s.Substring(0, 5);              // "HELLO"
s[0];                           // 'H'
string.IsNullOrWhiteSpace(s);   // проверка ввода

string path = @"C:\\temp\\file.txt"; // verbatim: \\ не экранирует
string msg = $"Итого: {total:N2} ₽, скидка {discount:P0}";
string json = """
    { "name": "Анна" }
    """;                         // raw string literal (C# 11)</code></pre>
<h3>StringBuilder</h3>
<p>Склеивание строк в цикле создаёт новый объект на каждой итерации. Для сотен и тысяч фрагментов используют <code>StringBuilder</code>:</p>
<pre><code>var sb = new StringBuilder();
foreach (var item in items)
    sb.Append(item.Name).Append(';');
string csv = sb.ToString();</code></pre>
<div class="note why"><b>Форматирование.</b> <code>{price:N2}</code>, <code>{date:yyyy-MM-dd}</code> зависят от текущей культуры. На сервере, где культура может отличаться, для машиночитаемых форматов используйте <code>CultureInfo.InvariantCulture</code>.</div>`,
 check: [
  { id:'q1-3a', type:'single', prompt:'Что выведет: var s = "abc"; s.ToUpper(); Console.WriteLine(s);', options:['abc','ABC','Ошибка компиляции','Пустую строку'], answer:0, explanation:'Строки неизменяемы: ToUpper вернул новую строку, которую никто не сохранил.' },
  { id:'q1-3b', type:'single', prompt:'Когда стоит использовать StringBuilder?', options:['При многократном добавлении фрагментов в цикле','Для любой конкатенации двух строк','Для сравнения строк','Для хранения паролей'], answer:0, explanation:'Он изменяемый и не создаёт промежуточных строк.' }
 ]},
 { id:'1-4', title:'Ветвления и циклы', html:`
<pre><code>if (stock == 0)
    Console.WriteLine("Нет в наличии");
else if (stock &lt; 5)
    Console.WriteLine("Осталось мало");
else
    Console.WriteLine("В наличии");

// switch-выражение (C# 8+) — возвращает значение
string status = code switch
{
    200 =&gt; "OK",
    404 =&gt; "Not Found",
    &gt;= 500 and &lt; 600 =&gt; "Server Error",
    _ =&gt; "Other"
};</code></pre>
<h3>Циклы</h3>
<pre><code>for (int i = 0; i &lt; 5; i++) { ... }

foreach (var product in products)   // по любой коллекции
    Console.WriteLine(product.Name);

while (!queue.IsEmpty) { ... }

do { input = Console.ReadLine(); } while (input != "q");</code></pre>
<p><code>break</code> выходит из цикла, <code>continue</code> переходит к следующей итерации, <code>return</code> выходит из метода.</p>
<div class="note"><b>Совет.</b> <code>foreach</code> — самый частый цикл в прикладном коде. Внутри него нельзя добавлять и удалять элементы перебираемой коллекции: будет <code>InvalidOperationException</code>.</div>`,
 check: [
  { id:'q1-4a', type:'single', prompt:'Что вернёт выражение 503 switch { 200 => "OK", >= 500 and < 600 => "Server Error", _ => "Other" }?', options:['"Server Error"','"Other"','"OK"','Ошибку'], answer:0, explanation:'503 попадает в диапазон 500–599.' },
  { id:'q1-4b', type:'input', prompt:'Сколько раз выполнится тело for (int i = 0; i < 10; i += 3)? Введите число.', answer:['4'], explanation:'i = 0, 3, 6, 9.' }
 ]}
 ],
 test: [
  { id:'t1-1', type:'single', prompt:'Что выведет Console.WriteLine(0.1 + 0.2 == 0.3) для double?', options:['False','True','Ошибка компиляции','0.3'], answer:0, explanation:'Двоичная дробь неточна; для денег — decimal.', difficulty:2 },
  { id:'t1-2', type:'match', prompt:'Сопоставьте оператор и смысл.', pairs:[['?.','Доступ к члену, если объект не null'],['??','Значение по умолчанию для null'],['%','Остаток от деления'],['&&','Логическое И с ленивым вычислением']], explanation:'Базовые операторы.', difficulty:1 },
  { id:'t1-3', type:'single', prompt:'Как безопасно превратить строку из query-параметра в int?', options:['int.TryParse(s, out var n)','int.Parse(s) без проверки','(int)s','Convert.ToInt32 в цикле'], answer:0, explanation:'TryParse не бросает исключение на некорректном вводе.', difficulty:1 },
  { id:'t1-4', type:'analyze', prompt:'Что выведет код?', code:'int sum = 0;\nfor (int i = 1; i <= 5; i++)\n{\n    if (i % 2 == 0) continue;\n    sum += i;\n}\nConsole.WriteLine(sum);', options:['9','15','6','5'], answer:0, explanation:'Складываются нечётные: 1 + 3 + 5 = 9.', difficulty:2 },
  { id:'t1-5', type:'input', prompt:'Что выведет Console.WriteLine(7 / 2 * 2); ? Введите число.', answer:['6'], explanation:'7 / 2 = 3 (целочисленно), 3 * 2 = 6.', difficulty:2 },
  { id:'t1-6', type:'single', prompt:'Чем var отличается от dynamic?', options:['var — тип выводится при компиляции и фиксирован, dynamic проверяется во время выполнения','Ничем','var медленнее','dynamic нельзя использовать в методах'], answer:0, explanation:'var — статическая типизация, просто без явного имени типа.', difficulty:2 },
  { id:'t1-7', type:'multiple', prompt:'Какие утверждения о string верны? (несколько ответов)', options:['Строки неизменяемы','== сравнивает содержимое','Replace меняет исходную строку','Можно получить символ по индексу s[0]'], answer:[0,1,3], explanation:'Replace возвращает новую строку.', difficulty:1 },
  { id:'t1-8', type:'single', prompt:'Что произойдёт при int.MaxValue + 1 без checked?', options:['Тихое переполнение в отрицательное число','OverflowException','Результат станет long','Ошибка компиляции'], answer:0, explanation:'По умолчанию арифметика unchecked.', difficulty:2 }
 ]
},
{
 id: 2, title: 'Методы и коллекции', short: 'Методы, параметры, массивы, List, Dictionary',
 lessons: [
 { id:'2-1', title:'Методы', html:`
<p>Метод — именованный блок кода с параметрами и возвращаемым значением.</p>
<pre><code>static decimal ApplyDiscount(decimal price, int percent)
{
    if (percent is &lt; 0 or &gt; 100)
        throw new ArgumentOutOfRangeException(nameof(percent));
    return price * (100 - percent) / 100;
}

// тело-выражение для коротких методов
static bool IsAdult(int age) =&gt; age &gt;= 18;

var p = ApplyDiscount(1000m, 15);   // 850</code></pre>
<h3>Необязательные и именованные параметры</h3>
<pre><code>static string Greet(string name, string greeting = "Привет") =&gt; $"{greeting}, {name}!";

Greet("Анна");                       // "Привет, Анна!"
Greet("Анна", greeting: "Здравствуйте");</code></pre>
<h3>Перегрузка</h3>
<p>Несколько методов с одним именем и разными параметрами:</p>
<pre><code>static int Area(int side) =&gt; side * side;
static int Area(int w, int h) =&gt; w * h;</code></pre>
<div class="note why"><b>Хороший метод</b> делает одну вещь, имеет понятное имя-глагол (<code>CalculateTotal</code>, <code>SendEmail</code>) и проверяет аргументы в начале. Методы в C# называют в PascalCase.</div>`,
 check: [
  { id:'q2-1a', type:'single', prompt:'Что такое перегрузка методов?', options:['Несколько методов с одним именем и разными параметрами','Метод, вызывающий сам себя','Слишком длинный метод','Переопределение метода в наследнике'], answer:0, explanation:'Компилятор выбирает версию по типам аргументов.' },
  { id:'q2-1b', type:'single', prompt:'Как в C# принято называть методы?', options:['PascalCase: CalculateTotal','camelCase: calculateTotal','snake_case: calculate_total','UPPER_CASE'], answer:0, explanation:'PascalCase для методов, типов и свойств; camelCase — для локальных переменных и параметров.' }
 ]},
 { id:'2-2', title:'Передача параметров: ref, out, in', html:`
<p>По умолчанию аргумент передаётся <b>по значению</b>: метод получает копию. Для значимых типов (<code>int</code>, <code>struct</code>) это копия данных, для ссылочных — копия ссылки на тот же объект (подробно в модуле 4).</p>
<pre><code>static void Inc(int x) { x++; }
int n = 1; Inc(n);          // n всё ещё 1

static void IncRef(ref int x) { x++; }
IncRef(ref n);              // n == 2

static bool TryDivide(int a, int b, out int result)
{
    if (b == 0) { result = 0; return false; }
    result = a / b; return true;
}
if (TryDivide(10, 2, out var r)) Console.WriteLine(r);</code></pre>
<div class="tbl"><table><tr><th>Модификатор</th><th>Смысл</th></tr>
<tr><td><code>ref</code></td><td>Метод работает с самой переменной вызывающего; она должна быть инициализирована</td></tr>
<tr><td><code>out</code></td><td>Метод обязан присвоить значение; так возвращают второй результат (паттерн Try…)</td></tr>
<tr><td><code>in</code></td><td>Передача по ссылке только для чтения — для больших структур</td></tr>
<tr><td><code>params</code></td><td>Переменное число аргументов: <code>Sum(1, 2, 3)</code></td></tr>
</table></div>
<p>Вернуть несколько значений проще кортежем:</p>
<pre><code>static (int Min, int Max) MinMax(int[] xs) =&gt; (xs.Min(), xs.Max());
var (min, max) = MinMax(new[] { 3, 9, 1 });</code></pre>`,
 check: [
  { id:'q2-2a', type:'single', prompt:'Чем out отличается от ref?', options:['out-параметр метод обязан присвоить, а переменную не нужно инициализировать заранее','Ничем','out быстрее','ref работает только со строками'], answer:0, explanation:'out — для дополнительных выходных значений, как в TryParse.' },
  { id:'q2-2b', type:'input', prompt:'static void F(int x) { x = 10; } int a = 5; F(a); Чему равно a? Введите число.', answer:['5'], explanation:'int передан по значению — метод изменил копию.' }
 ]},
 { id:'2-3', title:'Массивы и List<T>', html:`
<p><b>Массив</b> — фиксированное число элементов одного типа:</p>
<pre><code>int[] scores = { 90, 75, 88 };
int[] zeros = new int[10];        // десять нулей
scores[0] = 95;
Console.WriteLine(scores.Length); // 3
int last = scores[^1];            // индекс с конца: 88
int[] firstTwo = scores[..2];     // диапазон: 95, 75</code></pre>
<p><b>List&lt;T&gt;</b> — динамический список, самая используемая коллекция:</p>
<pre><code>var cart = new List&lt;string&gt; { "хлеб", "молоко" };
cart.Add("сыр");
cart.Insert(0, "вода");
cart.Remove("молоко");
bool has = cart.Contains("сыр");
int count = cart.Count;
cart.Sort();
List&lt;string&gt; names = ["a", "b"];  // collection expression (C# 12)</code></pre>
<p><code>&lt;T&gt;</code> — параметр типа (обобщения, модуль 5): <code>List&lt;int&gt;</code> хранит только int, <code>List&lt;Product&gt;</code> — только товары. Ошибку «положил не то» поймает компилятор.</p>
<div class="note"><b>Массив или список?</b> Если размер известен и не меняется — массив. Если элементы добавляются — <code>List&lt;T&gt;</code>. Внутри List — массив, который удваивается при заполнении, поэтому <code>Add</code> в среднем быстрый.</div>`,
 check: [
  { id:'q2-3a', type:'single', prompt:'Что вернёт scores[^1] для массива { 4, 8, 15 }?', options:['15','4','8','Ошибку'], answer:0, explanation:'^1 — первый элемент с конца.' },
  { id:'q2-3b', type:'single', prompt:'Какое свойство даёт число элементов List<T>?', options:['Count','Length','Size','Total'], answer:0, explanation:'У массива Length, у коллекций Count.' }
 ]},
 { id:'2-4', title:'Dictionary, HashSet и другие коллекции', html:`
<p><b>Dictionary&lt;TKey, TValue&gt;</b> — хеш-таблица: поиск по ключу за O(1).</p>
<pre><code>var prices = new Dictionary&lt;string, decimal&gt;
{
    ["хлеб"] = 50m,
    ["сыр"] = 400m
};
prices["молоко"] = 90m;           // добавить или заменить
decimal p = prices["сыр"];        // KeyNotFoundException, если нет ключа
if (prices.TryGetValue("кофе", out var coffee)) { ... }
foreach (var (name, price) in prices)
    Console.WriteLine($"{name}: {price}");</code></pre>
<div class="tbl"><table><tr><th>Коллекция</th><th>Для чего</th></tr>
<tr><td><code>List&lt;T&gt;</code></td><td>Упорядоченный список с доступом по индексу</td></tr>
<tr><td><code>Dictionary&lt;K,V&gt;</code></td><td>Поиск значения по ключу</td></tr>
<tr><td><code>HashSet&lt;T&gt;</code></td><td>Уникальные элементы, быстрая проверка Contains</td></tr>
<tr><td><code>Queue&lt;T&gt;</code></td><td>Очередь FIFO</td></tr>
<tr><td><code>Stack&lt;T&gt;</code></td><td>Стек LIFO</td></tr>
<tr><td><code>ConcurrentDictionary</code></td><td>Безопасен при доступе из нескольких потоков</td></tr>
</table></div>
<h3>Интерфейсы коллекций</h3>
<p>Методы принимают не конкретный <code>List</code>, а самый общий подходящий интерфейс:</p>
<pre><code>IEnumerable&lt;T&gt;          // можно перебрать foreach
IReadOnlyCollection&lt;T&gt;  // + Count
IReadOnlyList&lt;T&gt;        // + доступ по индексу
ICollection&lt;T&gt; / IList&lt;T&gt; // + изменение</code></pre>
<div class="note why"><b>В ASP.NET</b> контроллер обычно возвращает <code>IEnumerable&lt;ProductDto&gt;</code> или <code>IReadOnlyList</code> — так вызывающий не может случайно изменить вашу внутреннюю коллекцию.</div>`,
 check: [
  { id:'q2-4a', type:'single', prompt:'Какая коллекция подходит для хранения уникальных тегов с быстрой проверкой наличия?', options:['HashSet<string>','List<string>','Queue<string>','string[]'], answer:0, explanation:'HashSet хранит уникальные значения и проверяет Contains за O(1).' },
  { id:'q2-4b', type:'single', prompt:'Что произойдёт при dict["нет-такого"] для Dictionary?', options:['KeyNotFoundException','Вернётся null','Вернётся 0','Ключ создастся автоматически'], answer:0, explanation:'Для безопасного чтения — TryGetValue.' }
 ]}
 ],
 test: [
  { id:'t2-1', type:'match', prompt:'Сопоставьте задачу и коллекцию.', pairs:[['Корзина товаров по порядку','List<T>'],['Цена по артикулу','Dictionary<K,V>'],['Уникальные email','HashSet<T>'],['Задачи в порядке поступления','Queue<T>']], explanation:'Выбор коллекции по операции.', difficulty:1 },
  { id:'t2-2', type:'analyze', prompt:'Что выведет код?', code:'static void AddItem(List<int> list) => list.Add(4);\n\nvar xs = new List<int> { 1, 2, 3 };\nAddItem(xs);\nConsole.WriteLine(xs.Count);', options:['4','3','Ошибка компиляции','0'], answer:0, explanation:'Передана копия ссылки на тот же список — изменение видно снаружи.', difficulty:2 },
  { id:'t2-3', type:'single', prompt:'Как вернуть из метода сразу минимальное и максимальное значение без out?', options:['Кортежем (int Min, int Max)','Только через глобальные переменные','Это невозможно','Через два return'], answer:0, explanation:'Кортежи с именованными элементами.', difficulty:1 },
  { id:'t2-4', type:'single', prompt:'Почему параметр метода лучше объявить как IEnumerable<T>, а не List<T>?', options:['Метод сможет принимать любую перебираемую коллекцию','Так быстрее','List нельзя передавать в методы','IEnumerable занимает меньше памяти'], answer:0, explanation:'Принимайте самый общий тип, возвращайте конкретный.', difficulty:2 },
  { id:'t2-5', type:'input', prompt:'Чему равен Length массива new int[5]? Введите число.', answer:['5'], explanation:'Пять элементов со значением 0.', difficulty:1 },
  { id:'t2-6', type:'single', prompt:'Что будет при удалении элемента из списка внутри foreach по этому же списку?', options:['InvalidOperationException','Элемент удалится корректно','Цикл начнётся заново','Ошибка компиляции'], answer:0, explanation:'Коллекция изменилась во время перебора. Используйте RemoveAll или цикл for с конца.', difficulty:2 },
  { id:'t2-7', type:'multiple', prompt:'Какие модификаторы передают аргумент по ссылке? (несколько ответов)', options:['ref','out','in','params'], answer:[0,1,2], explanation:'params — про переменное число аргументов.', difficulty:2 },
  { id:'t2-8', type:'single', prompt:'Какое значение по умолчанию у элементов new bool[3]?', options:['false','true','null','Неопределено'], answer:0, explanation:'Массив заполняется значениями по умолчанию типа.', difficulty:1 }
 ]
},
{
 id: 3, title: 'ООП в C#', short: 'Классы, свойства, конструкторы, наследование, интерфейсы — синтаксис C#',
 lessons: [
 { id:'3-1', title:'Классы, поля и свойства', html:`
<p class="small">Теория: <a href="../oop/#/l/1-1">ООП 1.1 «Класс и экземпляр»</a>, <a href="../oop/#/l/2-3">ООП 2.3 «Свойства и инварианты»</a>. Здесь — только как это пишется в C#.</p>
<pre><code>public class Product
{
    private decimal _price;                       // поле: camelCase с подчёркиванием

    public int Id { get; init; }                  // авто-свойство, задаётся только при создании
    public required string Name { get; set; }     // required: обязательно в инициализаторе
    public string? Description { get; set; }      // может быть null
    public decimal Price
    {
        get =&gt; _price;
        set =&gt; _price = value &gt;= 0 ? value : throw new ArgumentOutOfRangeException(nameof(value));
    }
    public bool IsFree =&gt; Price == 0;             // вычисляемое свойство только для чтения
}

var p = new Product { Id = 1, Name = "Книга", Price = 500m };   // инициализатор объекта
p.Id = 2;   // ошибка компиляции: init-свойство</code></pre>
<div class="tbl"><table><tr><th>Запись</th><th>Смысл</th></tr>
<tr><td><code>{ get; set; }</code></td><td>Читать и писать можно всем</td></tr>
<tr><td><code>{ get; private set; }</code></td><td>Менять может только сам класс</td></tr>
<tr><td><code>{ get; init; }</code></td><td>Задаётся только при создании объекта</td></tr>
<tr><td><code>{ get; }</code></td><td>Задаётся только в конструкторе</td></tr>
<tr><td><code>required</code></td><td>Компилятор требует задать при создании</td></tr>
</table></div>
<div class="note why"><b>В ASP.NET</b> классы-модели запросов и ответов (DTO) — это как раз классы с авто-свойствами. JSON-сериализатор и привязка моделей работают со свойствами, а не с полями.</div>
<p>Соглашения об именовании: типы, методы, свойства — <code>PascalCase</code>; параметры и локальные переменные — <code>camelCase</code>; приватные поля — <code>_camelCase</code>; интерфейсы — <code>IName</code>.</p>`,
 check: [
  { id:'q3-1a', type:'single', prompt:'Что означает { get; init; } у свойства?', options:['Значение можно задать только при создании объекта','Свойство можно менять всегда','Свойство только для записи','Свойство статическое'], answer:0, explanation:'init разрешает присваивание в конструкторе и инициализаторе объекта.' },
  { id:'q3-1b', type:'single', prompt:'Почему в DTO для ASP.NET используют свойства, а не публичные поля?', options:['Сериализатор и привязка моделей по умолчанию работают со свойствами','Поля в C# запрещены','Свойства занимают меньше памяти','Поля нельзя сделать публичными'], answer:0, explanation:'System.Text.Json по умолчанию игнорирует поля.' }
 ]},
 { id:'3-2', title:'Конструкторы и создание объектов', html:`
<p class="small">Теория: <a href="../oop/#/l/1-2">ООП 1.2 «Конструкторы»</a>.</p>
<pre><code>public class Order
{
    private readonly List&lt;OrderLine&gt; _lines = new();   // readonly: присваивается один раз

    public Guid Id { get; }
    public DateTime CreatedAt { get; }

    public Order() : this(Guid.NewGuid()) { }          // цепочка конструкторов

    public Order(Guid id)
    {
        Id = id;
        CreatedAt = DateTime.UtcNow;
    }
}

// Первичный конструктор (C# 12): параметры видны во всём классе
public class OrderService(IOrderRepository repo, ILogger&lt;OrderService&gt; logger)
{
    public void Place(Order o)
    {
        logger.LogInformation("Order {Id}", o.Id);
        repo.Save(o);
    }
}</code></pre>
<p>Первичные конструкторы — самый частый способ писать сервисы в современном ASP.NET: зависимости приходят через DI (модуль 9) и сразу доступны в методах.</p>
<div class="tbl"><table><tr><th>Способ создания</th><th>Пример</th></tr>
<tr><td>Конструктор</td><td><code>new Order(id)</code></td></tr>
<tr><td>Target-typed new</td><td><code>Order o = new(id);</code></td></tr>
<tr><td>Инициализатор</td><td><code>new Product { Name = "X" }</code></td></tr>
<tr><td>Фабричный метод</td><td><code>Money.FromRubles(100)</code></td></tr>
</table></div>
<div class="note"><b>static-конструктор</b> <code>static Order() { ... }</code> выполняется один раз при первом обращении к типу. <b>Финализатор</b> <code>~Order()</code> почти никогда не нужен — для ресурсов есть IDisposable (модуль 7).</div>`,
 check: [
  { id:'q3-2a', type:'single', prompt:'Что делает public class Svc(IRepo repo) { ... }?', options:['Объявляет первичный конструктор: repo доступен во всём классе','Наследует Svc от IRepo','Создаёт record','Объявляет статическое поле repo'], answer:0, explanation:'Primary constructor, C# 12.' },
  { id:'q3-2b', type:'single', prompt:'Что значит readonly у поля?', options:['Значение присваивается только при объявлении или в конструкторе','Поле нельзя читать','Поле статическое','Поле нельзя изменять даже внутри объекта-списка'], answer:0, explanation:'readonly защищает ссылку, а не содержимое списка.' }
 ]},
 { id:'3-3', title:'Наследование: virtual, override, sealed', html:`
<p class="small">Теория: <a href="../oop/#/l/3-2">ООП 3.2 «Переопределение»</a>, <a href="../oop/#/l/3-3">ООП 3.3 «Абстрактные классы»</a>, <a href="../oop/#/l/4-2">ООП 4.2 «Диспетчеризация»</a>.</p>
<p>В отличие от Java, методы C# <b>не виртуальные по умолчанию</b>. Базовый класс должен явно разрешить переопределение.</p>
<pre><code>public abstract class Notification
{
    protected Notification(string to) =&gt; To = to;
    public string To { get; }

    public abstract Task SendAsync(string text);           // обязаны реализовать
    public virtual string Format(string text) =&gt; text;     // можно переопределить
    public override string ToString() =&gt; $"{GetType().Name} → {To}";  // переопределяем object
}

public sealed class EmailNotification : Notification      // sealed: дальше наследовать нельзя
{
    public EmailNotification(string to) : base(to) { }     // base(...) — конструктор родителя
    public override Task SendAsync(string text) =&gt; Task.CompletedTask;
    public override string Format(string text) =&gt; $"&lt;p&gt;{base.Format(text)}&lt;/p&gt;";
}</code></pre>
<div class="tbl"><table><tr><th>Ключевое слово</th><th>Где</th><th>Смысл</th></tr>
<tr><td><code>abstract</code></td><td>класс / метод</td><td>Нельзя создать / нет реализации</td></tr>
<tr><td><code>virtual</code></td><td>метод базового класса</td><td>Разрешает переопределение</td></tr>
<tr><td><code>override</code></td><td>метод наследника</td><td>Переопределяет virtual/abstract</td></tr>
<tr><td><code>sealed</code></td><td>класс / override-метод</td><td>Запрещает дальнейшее наследование</td></tr>
<tr><td><code>base</code></td><td>внутри наследника</td><td>Обращение к реализации родителя</td></tr>
<tr><td><code>new</code></td><td>метод наследника</td><td>Скрывает (не переопределяет!) метод родителя</td></tr>
</table></div>
<div class="note warn"><b>Ловушка.</b> Метод с тем же именем без <code>override</code> скрывает базовый: через переменную базового типа вызовется версия родителя. Компилятор предупредит (CS0108) — не игнорируйте.</div>`,
 check: [
  { id:'q3-3a', type:'single', prompt:'Что нужно базовому методу в C#, чтобы его можно было переопределить?', options:['virtual или abstract','Ничего, все методы виртуальны','open','override'], answer:0, explanation:'В отличие от Java, по умолчанию методы невиртуальные.' },
  { id:'q3-3b', type:'single', prompt:'Как из конструктора наследника вызвать конструктор базового класса?', options:[': base(args)','super(args)','this.base(args)','parent(args)'], answer:0, explanation:'Синтаксис C#: public B(int x) : base(x) { }.' }
 ]},
 { id:'3-4', title:'Интерфейсы и статические члены', html:`
<p class="small">Теория: <a href="../oop/#/l/5-2">ООП 5.2 «Интерфейсы как контракт»</a>, <a href="../oop/#/l/5-3">ООП 5.3 «Абстрактный класс или интерфейс»</a>.</p>
<pre><code>public interface IOrderRepository
{
    Task&lt;Order?&gt; FindAsync(Guid id);
    Task SaveAsync(Order order);
    Task&lt;bool&gt; ExistsAsync(Guid id) =&gt; FindAsync(id).ContinueWith(t =&gt; t.Result != null); // реализация по умолчанию
}

public class SqlOrderRepository : IOrderRepository, IDisposable
{
    public Task&lt;Order?&gt; FindAsync(Guid id) { ... }
    public Task SaveAsync(Order order) { ... }
    public void Dispose() { ... }
}</code></pre>
<p>Стандартные интерфейсы .NET, которые встречаются постоянно:</p>
<div class="tbl"><table><tr><th>Интерфейс</th><th>Что умеет тип</th></tr>
<tr><td><code>IEnumerable&lt;T&gt;</code></td><td>Перебираться в foreach, работать с LINQ</td></tr>
<tr><td><code>IDisposable</code> / <code>IAsyncDisposable</code></td><td>Освобождать ресурсы в using</td></tr>
<tr><td><code>IComparable&lt;T&gt;</code></td><td>Сравниваться для сортировки</td></tr>
<tr><td><code>IEquatable&lt;T&gt;</code></td><td>Сравниваться на равенство без упаковки</td></tr>
</table></div>
<h3>Статические члены и классы</h3>
<pre><code>public static class PriceRules            // static class: только статические члены, нельзя создать
{
    public const decimal MinOrder = 500m;  // константа времени компиляции
    public static decimal WithVat(decimal p) =&gt; p * 1.2m;
}</code></pre>
<h3>partial</h3>
<p><code>partial class</code> разбивает класс на несколько файлов. Так генераторы кода (EF Core, Razor, source generators) дописывают свою часть к вашей.</p>
<div class="note why"><b>В ASP.NET</b> почти каждый сервис регистрируется по интерфейсу: <code>services.AddScoped&lt;IOrderRepository, SqlOrderRepository&gt;()</code>. Это DIP из <a href="../oop/#/l/8-4">ООП 8.4</a> на практике.</div>`,
 check: [
  { id:'q3-4a', type:'single', prompt:'Чем static class отличается от обычного?', options:['Его нельзя создать и в нём только статические члены','Он быстрее','Его можно наследовать от нескольких классов','Он неизменяемый'], answer:0, explanation:'Подходит для чистых вспомогательных функций и методов расширения.' },
  { id:'q3-4b', type:'single', prompt:'Какой интерфейс нужен типу, чтобы его можно было использовать в using?', options:['IDisposable','IEnumerable','IComparable','ICloneable'], answer:0, explanation:'using вызывает Dispose() при выходе из блока.' }
 ]}
 ],
 test: [
  { id:'t3-1', type:'analyze', prompt:'Что выведет код?', code:'class A { public string Who() => "A"; }\nclass B : A { public new string Who() => "B"; }\n\nA x = new B();\nConsole.WriteLine(x.Who());', options:['A','B','Ошибку компиляции','AB'], answer:0, explanation:'new скрывает метод, а не переопределяет; вызов идёт по статическому типу A.', difficulty:3 },
  { id:'t3-2', type:'analyze', prompt:'А теперь?', code:'class A { public virtual string Who() => "A"; }\nclass B : A { public override string Who() => "B"; }\n\nA x = new B();\nConsole.WriteLine(x.Who());', options:['B','A','Ошибку компиляции','AB'], answer:0, explanation:'virtual + override — позднее связывание.', difficulty:2 },
  { id:'t3-3', type:'match', prompt:'Сопоставьте объявление свойства и смысл.', pairs:[['{ get; set; }','Читать и менять всем'],['{ get; private set; }','Менять только внутри класса'],['{ get; init; }','Задать только при создании'],['=> выражение','Вычисляемое только для чтения']], explanation:'Варианты авто-свойств.', difficulty:1 },
  { id:'t3-4', type:'single', prompt:'Что запрещает sealed у класса?', options:['Наследоваться от него','Создавать экземпляры','Переопределять ToString','Использовать его в интерфейсах'], answer:0, explanation:'Аналог final в Java.', difficulty:1 },
  { id:'t3-5', type:'single', prompt:'Как C# сообщит о забытом обязательном свойстве при new Product { }?', options:['Ошибкой компиляции, если свойство помечено required','Исключением во время выполнения','Никак','Предупреждением в логах'], answer:0, explanation:'required проверяется компилятором.', difficulty:2 },
  { id:'t3-6', type:'single', prompt:'Как принято называть приватное поле в C#?', options:['_camelCase','PascalCase','m_PascalCase обязательно','UPPER_CASE'], answer:0, explanation:'Соглашение .NET runtime и большинства команд.', difficulty:1 },
  { id:'t3-7', type:'single', prompt:'Зачем partial-классы?', options:['Разделить класс на файлы, в том числе с генерируемым кодом','Для множественного наследования','Чтобы сделать класс абстрактным','Для ускорения компиляции'], answer:0, explanation:'Генераторы дописывают свою часть.', difficulty:2 },
  { id:'t3-8', type:'multiple', prompt:'Что можно объявить в интерфейсе C# 8+? (несколько ответов)', options:['Методы без реализации','Методы с реализацией по умолчанию','Свойства','Поля экземпляра'], answer:[0,1,2], explanation:'Состояния экземпляра у интерфейса нет.', difficulty:2 }
 ]
},
{
 id: 4, title: 'Система типов C#', short: 'struct и class, record, enum, nullable, pattern matching',
 lessons: [
 { id:'4-1', title:'Значимые и ссылочные типы', html:`
<p class="small">Теория: <a href="../oop/#/l/7-1">ООП 7.1 «Ссылки и значения»</a>. В C# выбор делается при объявлении типа: <code>class</code> или <code>struct</code>.</p>
<pre><code>public struct Point { public int X; public int Y; }     // значимый тип
public class  Box   { public int X; }                   // ссылочный тип

var p1 = new Point { X = 1 };
var p2 = p1;  p2.X = 99;      // p1.X == 1 — скопировано значение

var b1 = new Box { X = 1 };
var b2 = b1;  b2.X = 99;      // b1.X == 99 — общая ссылка</code></pre>
<div class="tbl"><table><tr><th></th><th>struct</th><th>class</th></tr>
<tr><td>Присваивание</td><td>Копирует данные</td><td>Копирует ссылку</td></tr>
<tr><td>Может быть null</td><td>Нет (только <code>Point?</code>)</td><td>Да</td></tr>
<tr><td>Наследование</td><td>Нет (только интерфейсы)</td><td>Да</td></tr>
<tr><td>Где обычно лежит</td><td>Внутри переменной/объекта-владельца, часто в стеке</td><td>В управляемой куче</td></tr>
<tr><td>Примеры</td><td><code>int</code>, <code>DateTime</code>, <code>Guid</code>, <code>decimal</code></td><td><code>string</code>, <code>List&lt;T&gt;</code>, ваши сервисы</td></tr>
</table></div>
<h3>Упаковка (boxing)</h3>
<pre><code>int n = 42;
object o = n;        // boxing: значение копируется в новый объект в куче
int m = (int)o;      // unboxing</code></pre>
<p>Упаковка незаметна, но стоит выделения памяти. Обобщения (<code>List&lt;int&gt;</code>) её избегают, а старые <code>ArrayList</code> — нет.</p>
<div class="note why"><b>Правило выбора.</b> По умолчанию — <code>class</code>. <code>struct</code> — для маленьких (до ~16 байт) неизменяемых значений: координаты, деньги, идентификаторы. Делайте структуры <code>readonly struct</code>.</div>`,
 check: [
  { id:'q4-1a', type:'single', prompt:'Point — struct. var a = new Point { X = 1 }; var b = a; b.X = 5; Чему равен a.X?', options:['1','5','0','Ошибка компиляции'], answer:0, explanation:'struct копируется целиком.' },
  { id:'q4-1b', type:'single', prompt:'Что такое boxing?', options:['Копирование значимого типа в объект в куче при приведении к object или интерфейсу','Сжатие данных','Сериализация в JSON','Создание массива'], answer:0, explanation:'Скрытое выделение памяти.' }
 ]},
 { id:'4-2', title:'record, enum и кортежи', html:`
<p class="small">Теория: <a href="../oop/#/l/2-4">ООП 2.4 «Неизменяемые объекты»</a>, <a href="../oop/#/l/7-2">ООП 7.2 «Равенство и хеш-код»</a>.</p>
<pre><code>public record Money(decimal Amount, string Currency)       // record class
{
    public Money Add(Money other) =&gt; this with { Amount = Amount + other.Amount };
}
public readonly record struct Coord(double Lat, double Lon); // record struct

var a = new Money(100, "RUB");
var b = new Money(100, "RUB");
a == b;                         // true — равенство по значению
a.ToString();                   // "Money { Amount = 100, Currency = RUB }"
var (amount, cur) = a;          // деконструкция</code></pre>
<p>Компилятор генерирует для record: конструктор, init-свойства, <code>Equals</code>, <code>GetHashCode</code>, <code>==</code>, <code>ToString</code>, деконструкцию и поддержку <code>with</code>.</p>
<div class="note why"><b>В ASP.NET</b> record — идеальный DTO: <code>public record CreateOrderRequest(Guid ProductId, int Quantity);</code> — одна строка, неизменяемый, корректно сравнивается.</div>
<h3>enum</h3>
<pre><code>public enum OrderStatus { New, Paid, Shipped, Cancelled }   // под капотом int: 0, 1, 2, 3

[Flags]
public enum Permissions { None = 0, Read = 1, Write = 2, Delete = 4 }
var p = Permissions.Read | Permissions.Write;
p.HasFlag(Permissions.Write);   // true

Enum.TryParse&lt;OrderStatus&gt;("Paid", out var s);</code></pre>
<h3>Кортежи</h3>
<pre><code>(string Name, int Age) person = ("Анна", 30);
var (name, age) = person;</code></pre>
<p>Кортежи хороши для локальных и приватных результатов. Для публичного API заводите record — у него есть имя.</p>`,
 check: [
  { id:'q4-2a', type:'single', prompt:'Два record с одинаковыми значениями свойств. Что вернёт a == b?', options:['true','false','Ошибку компиляции','Зависит от порядка создания'], answer:0, explanation:'record сравнивается по значению.' },
  { id:'q4-2b', type:'single', prompt:'Что делает выражение order with { Status = "Paid" } для record?', options:['Создаёт копию с изменённым свойством','Меняет исходный объект','Сравнивает объекты','Удаляет свойство'], answer:0, explanation:'Неразрушающее изменение.' }
 ]},
 { id:'4-3', title:'Nullable: борьба с null', html:`
<p>NullReferenceException — самая частая ошибка в .NET. С C# 8 компилятор помогает её избегать: включите <code>&lt;Nullable&gt;enable&lt;/Nullable&gt;</code> (в новых проектах включено).</p>
<pre><code>string name = null;          // предупреждение CS8600: string не допускает null
string? nick = null;         // OK: явно допускает null

int len = nick.Length;       // предупреждение CS8602: возможно null
int len2 = nick?.Length ?? 0;

if (nick is not null)
    Console.WriteLine(nick.Length);   // компилятор знает: здесь не null

string s = nick!;            // ! — «поверь мне», подавляет предупреждение. Используйте редко.</code></pre>
<div class="tbl"><table><tr><th>Запись</th><th>Смысл</th></tr>
<tr><td><code>string</code></td><td>Никогда не null (компилятор следит)</td></tr>
<tr><td><code>string?</code></td><td>Может быть null — проверьте перед использованием</td></tr>
<tr><td><code>int?</code></td><td><code>Nullable&lt;int&gt;</code>: значимый тип с возможностью null (<code>.HasValue</code>, <code>.Value</code>)</td></tr>
</table></div>
<p>Проверки аргументов:</p>
<pre><code>public OrderService(IOrderRepository repo)
{
    ArgumentNullException.ThrowIfNull(repo);
    ArgumentException.ThrowIfNullOrWhiteSpace(name);
}</code></pre>
<div class="note why"><b>В ASP.NET</b> nullable-аннотации влияют на валидацию: необязательное поле запроса объявляют <code>string?</code>, а обязательное — <code>string</code> или <code>required</code>. Метод поиска возвращает <code>Task&lt;Product?&gt;</code>, и контроллер обязан обработать «не найдено» → 404.</div>`,
 check: [
  { id:'q4-3a', type:'single', prompt:'Что означает тип string? при включённом Nullable?', options:['Строка, которая может быть null','Необязательный параметр','Пустая строка','Строка только для чтения'], answer:0, explanation:'Компилятор потребует проверку перед разыменованием.' },
  { id:'q4-3b', type:'single', prompt:'Что делает оператор ! в выражении nick!.Length?', options:['Подавляет предупреждение компилятора о возможном null','Проверяет на null и бросает исключение','Инвертирует значение','Делает строку обязательной'], answer:0, explanation:'Во время выполнения ничего не проверяется.' }
 ]},
 { id:'4-4', title:'Сопоставление с образцом', html:`
<p>Pattern matching позволяет проверять тип и форму данных в одном выражении.</p>
<pre><code>// проверка типа с объявлением переменной
if (shape is Circle c)
    Console.WriteLine(c.Radius);

// switch-выражение с образцами
decimal Shipping(Order o) =&gt; o switch
{
    { Total: &gt;= 5000 }                     =&gt; 0,          // образец свойства
    { Address.Country: "RU", Weight: &lt; 1 } =&gt; 200,
    { Address.Country: "RU" }              =&gt; 350,
    null                                   =&gt; throw new ArgumentNullException(nameof(o)),
    _                                      =&gt; 1200
};

// образцы списков (C# 11)
string Describe(int[] xs) =&gt; xs switch
{
    []          =&gt; "пусто",
    [var x]     =&gt; $"один: {x}",
    [var first, .., var last] =&gt; $"от {first} до {last}"
};</code></pre>
<div class="tbl"><table><tr><th>Образец</th><th>Пример</th></tr>
<tr><td>Тип</td><td><code>is Circle c</code></td></tr>
<tr><td>Константа</td><td><code>is null</code>, <code>is "admin"</code></td></tr>
<tr><td>Отношение</td><td><code>&gt;= 18</code>, <code>&lt; 0</code></td></tr>
<tr><td>Логические</td><td><code>and</code>, <code>or</code>, <code>not</code></td></tr>
<tr><td>Свойства</td><td><code>{ Status: OrderStatus.Paid }</code></td></tr>
<tr><td>Позиционный</td><td><code>(0, 0)</code> для деконструируемых типов</td></tr>
</table></div>
<div class="note warn"><b>Не заменяйте полиморфизм.</b> <code>switch</code> по типам одной иерархии в нескольких местах — сигнал, описанный в <a href="../oop/#/l/4-1">ООП 4.1</a>. Pattern matching хорош для данных (DTO, record, JSON), а поведение лучше держать в виртуальных методах.</div>`,
 check: [
  { id:'q4-4a', type:'single', prompt:'Что делает if (obj is Product p)?', options:['Проверяет тип и, если подходит, объявляет переменную p этого типа','Приводит тип и бросает исключение при неудаче','Создаёт новый Product','Сравнивает ссылки'], answer:0, explanation:'Type pattern с объявлением.' },
  { id:'q4-4b', type:'input', prompt:'Что вернёт 15 switch { < 0 => "neg", 0 => "zero", < 10 => "small", _ => "big" }? Введите строку без кавычек.', answer:['big'], explanation:'15 не подходит под первые три ветки.' }
 ]}
 ],
 test: [
  { id:'t4-1', type:'single', prompt:'Какой тип лучше сделать struct?', options:['Маленькое неизменяемое значение, например координаты','Сервис работы с БД','Большую модель заказа со списком позиций','Контроллер'], answer:0, explanation:'struct — для маленьких значений.', difficulty:1 },
  { id:'t4-2', type:'analyze', prompt:'Что выведет код?', code:'public record User(string Name, int Age);\n\nvar a = new User("Анна", 30);\nvar b = a with { Age = 31 };\nConsole.WriteLine($"{a.Age} {a == b} {a == new User("Анна", 30)}");', options:['30 False True','31 False True','30 True True','30 False False'], answer:0, explanation:'with создаёт копию; сравнение по значению.', difficulty:2 },
  { id:'t4-3', type:'single', prompt:'Как проверить, что у int? есть значение?', options:['x.HasValue или x is not null','x.Length > 0','x != 0','x.IsEmpty'], answer:0, explanation:'Nullable<T>.HasValue.', difficulty:1 },
  { id:'t4-4', type:'single', prompt:'Зачем атрибут [Flags] у enum?', options:['Значения комбинируются побитово, ToString выводит их через запятую','Делает enum неизменяемым','Разрешает строки в enum','Запрещает приведение к int'], answer:0, explanation:'Значения — степени двойки.', difficulty:2 },
  { id:'t4-5', type:'match', prompt:'Сопоставьте образец и пример.', pairs:[['Тип','is Circle c'],['Свойство','{ Status: "Paid" }'],['Отношение','>= 18'],['Список','[var first, ..]']], explanation:'Виды образцов.', difficulty:2 },
  { id:'t4-6', type:'single', prompt:'Метод репозитория может не найти запись. Какой тип возврата честнее?', options:['Task<Product?>','Task<Product>','Product[]','object'], answer:0, explanation:'? явно говорит вызывающему: проверь на null.', difficulty:1 },
  { id:'t4-7', type:'multiple', prompt:'Что генерирует компилятор для record? (несколько ответов)', options:['Equals и GetHashCode по значениям','ToString с перечнем свойств','Поддержку with','Реализацию IDisposable'], answer:[0,1,2], explanation:'IDisposable — нет.', difficulty:2 },
  { id:'t4-8', type:'single', prompt:'Почему List<int> лучше ArrayList для чисел?', options:['Нет упаковки и есть проверка типов','ArrayList нельзя перебрать','List быстрее только для строк','ArrayList не поддерживает Add'], answer:0, explanation:'Обобщённая коллекция хранит int без boxing.', difficulty:2 }
 ]
},
{
 id: 5, title: 'Обобщения, делегаты и события', short: 'Generics, Func/Action, лямбды, события, методы расширения',
 lessons: [
 { id:'5-1', title:'Обобщения в C#', html:`
<p class="small">Теория: <a href="../oop/#/l/4-4">ООП 4.4 «Обобщения»</a>. В C# обобщённые типы сохраняются во время выполнения, поэтому <code>typeof(T)</code> и <code>new T()</code> работают.</p>
<pre><code>public interface IRepository&lt;T&gt; where T : class, IEntity
{
    Task&lt;T?&gt; FindAsync(Guid id);
    Task AddAsync(T entity);
}

public class InMemoryRepository&lt;T&gt; : IRepository&lt;T&gt; where T : class, IEntity
{
    private readonly Dictionary&lt;Guid, T&gt; _items = new();
    public Task&lt;T?&gt; FindAsync(Guid id) =&gt; Task.FromResult(_items.GetValueOrDefault(id));
    public Task AddAsync(T e) { _items[e.Id] = e; return Task.CompletedTask; }
}

// обобщённый метод: тип выводится из аргументов
static T Max&lt;T&gt;(T a, T b) where T : IComparable&lt;T&gt; =&gt; a.CompareTo(b) &gt;= 0 ? a : b;
Max(3, 7);           // 7, T = int</code></pre>
<div class="tbl"><table><tr><th>Ограничение</th><th>Смысл</th></tr>
<tr><td><code>where T : class</code></td><td>Ссылочный тип</td></tr>
<tr><td><code>where T : struct</code></td><td>Значимый тип</td></tr>
<tr><td><code>where T : new()</code></td><td>Есть конструктор без параметров</td></tr>
<tr><td><code>where T : IEntity</code></td><td>Реализует интерфейс / наследует класс</td></tr>
<tr><td><code>where T : notnull</code></td><td>Не допускает null</td></tr>
</table></div>
<p>Вариантность в интерфейсах: <code>IEnumerable&lt;out T&gt;</code> ковариантен — <code>IEnumerable&lt;string&gt;</code> можно передать туда, где ждут <code>IEnumerable&lt;object&gt;</code>. <code>List&lt;T&gt;</code> — нет.</p>`,
 check: [
  { id:'q5-1a', type:'single', prompt:'Что значит where T : IEntity?', options:['T обязан реализовывать IEntity','T — это IEntity и ничего больше','T не может быть IEntity','IEntity наследует T'], answer:0, explanation:'Ограничение позволяет вызывать члены IEntity у T.' },
  { id:'q5-1b', type:'single', prompt:'Почему IEnumerable<string> можно передать как IEnumerable<object>?', options:['Интерфейс ковариантен по T (out T)','Так работают все обобщённые типы','string наследует IEnumerable','Это ошибка компиляции'], answer:0, explanation:'Из него только читают, поэтому подстановка безопасна.' }
 ]},
 { id:'5-2', title:'Делегаты, Func и лямбды', html:`
<p><b>Делегат</b> — тип, значение которого — ссылка на метод. Это «функция как объект»: её можно передать, сохранить, вызвать позже.</p>
<pre><code>Func&lt;int, int, int&gt; add = (a, b) =&gt; a + b;      // принимает два int, возвращает int
Action&lt;string&gt; log = msg =&gt; Console.WriteLine(msg);  // ничего не возвращает
Predicate&lt;Product&gt; isCheap = p =&gt; p.Price &lt; 100;    // возвращает bool

add(2, 3);            // 5
log("привет");

// передача поведения в метод — паттерн «Стратегия» без интерфейса
decimal Total(IEnumerable&lt;Product&gt; items, Func&lt;Product, decimal&gt; price)
    =&gt; items.Sum(price);
Total(cart, p =&gt; p.Price * 0.9m);</code></pre>
<p class="small">Связь с теорией: делегат — короткая запись паттерна «Стратегия» (<a href="../oop/#/l/10-3">ООП 10.3</a>) для однометодного интерфейса.</p>
<div class="tbl"><table><tr><th>Тип</th><th>Сигнатура</th></tr>
<tr><td><code>Action</code>, <code>Action&lt;T1,…&gt;</code></td><td>Параметры → void</td></tr>
<tr><td><code>Func&lt;TResult&gt;</code>, <code>Func&lt;T1,…,TResult&gt;</code></td><td>Параметры → результат (последний тип)</td></tr>
<tr><td><code>Predicate&lt;T&gt;</code></td><td>T → bool</td></tr>
</table></div>
<h3>Замыкания</h3>
<pre><code>int counter = 0;
Action inc = () =&gt; counter++;   // лямбда «захватила» переменную
inc(); inc();
Console.WriteLine(counter);     // 2</code></pre>
<div class="note why"><b>В ASP.NET</b> лямбды повсюду: <code>app.MapGet("/products/{id}", (int id, IProductService s) =&gt; s.Get(id));</code>, настройка опций <code>services.AddCors(o =&gt; ...)</code>, middleware <code>app.Use(async (ctx, next) =&gt; ...)</code>.</div>`,
 check: [
  { id:'q5-2a', type:'single', prompt:'Какой делегат подходит для метода decimal Calc(Product p)?', options:['Func<Product, decimal>','Action<Product, decimal>','Func<decimal, Product>','Predicate<Product>'], answer:0, explanation:'Последний параметр Func — тип результата.' },
  { id:'q5-2b', type:'single', prompt:'Что такое замыкание?', options:['Лямбда, которая захватывает переменные из окружающего метода','Закрытый класс','Финальный метод','Метод без параметров'], answer:0, explanation:'Захваченная переменная живёт, пока жив делегат.' }
 ]},
 { id:'5-3', title:'События', html:`
<p class="small">Теория: паттерн «Наблюдатель», <a href="../oop/#/l/10-3">ООП 10.3</a>. В C# он встроен в язык ключевым словом <code>event</code>.</p>
<pre><code>public class OrderService
{
    public event EventHandler&lt;OrderPlacedEventArgs&gt;? OrderPlaced;

    public void Place(Order order)
    {
        // ... сохранить
        OrderPlaced?.Invoke(this, new OrderPlacedEventArgs(order));
    }
}
public record OrderPlacedEventArgs(Order Order);

var svc = new OrderService();
svc.OrderPlaced += (sender, e) =&gt; Console.WriteLine($"Новый заказ {e.Order.Id}");
svc.OrderPlaced += (sender, e) =&gt; mailer.Send(e.Order);
svc.OrderPlaced -= handler;     // отписка</code></pre>
<ul>
<li>Снаружи можно только подписаться (<code>+=</code>) и отписаться (<code>-=</code>). Вызвать событие может лишь объект-владелец.</li>
<li><code>?.Invoke</code> — если подписчиков нет, событие равно null.</li>
<li>Стандартная сигнатура: <code>(object? sender, TEventArgs e)</code>.</li>
</ul>
<div class="note warn"><b>Утечки.</b> Издатель держит ссылки на подписчиков. Долгоживущий объект с событием не даст сборщику мусора удалить подписавшиеся объекты, пока они не отпишутся (<a href="../oop/#/l/7-4">ООП 7.4</a>).</div>
<p>В веб-приложениях события внутри одного объекта встречаются реже. Чаще используют доменные события через MediatR, очереди сообщений или <code>IHostedService</code>, но идея та же.</p>`,
 check: [
  { id:'q5-3a', type:'single', prompt:'Что может сделать внешний код с event-полем другого класса?', options:['Только подписаться и отписаться','Вызвать событие','Присвоить ему null','Прочитать список подписчиков'], answer:0, explanation:'event ограничивает доступ к делегату.' },
  { id:'q5-3b', type:'single', prompt:'Зачем писать OrderPlaced?.Invoke(...)?', options:['Если подписчиков нет, событие равно null','Так быстрее','Чтобы вызвать асинхронно','Чтобы отписать всех'], answer:0, explanation:'Иначе NullReferenceException.' }
 ]},
 { id:'5-4', title:'Методы расширения', html:`
<p><b>Метод расширения</b> — статический метод, который вызывается как метод экземпляра чужого типа. Класс при этом не меняется.</p>
<pre><code>public static class StringExtensions
{
    public static string Truncate(this string s, int max) =&gt;
        s.Length &lt;= max ? s : s[..max] + "…";

    public static bool IsValidEmail(this string s) =&gt; s.Contains('@');
}

"Очень длинный заголовок статьи".Truncate(10);   // "Очень длин…"</code></pre>
<p>Условия: статический класс, статический метод, первый параметр с <code>this</code>, пространство имён подключено через <code>using</code>.</p>
<p>На методах расширения построены:</p>
<ul>
<li><b>LINQ</b> — <code>Where</code>, <code>Select</code>, <code>OrderBy</code> это расширения <code>IEnumerable&lt;T&gt;</code> (модуль 6).</li>
<li><b>Конфигурация ASP.NET</b> — <code>builder.Services.AddControllers()</code>, <code>app.UseAuthentication()</code>, <code>services.AddDbContext&lt;T&gt;()</code>.</li>
</ul>
<pre><code>// Ваш модуль регистрирует свои сервисы одной строкой — частый приём в ASP.NET
public static class OrdersModule
{
    public static IServiceCollection AddOrders(this IServiceCollection services)
    {
        services.AddScoped&lt;IOrderRepository, SqlOrderRepository&gt;();
        services.AddScoped&lt;OrderService&gt;();
        return services;
    }
}
builder.Services.AddOrders();</code></pre>
<div class="note">Методы расширения не получают доступа к приватным членам и не участвуют в полиморфизме. Если у типа есть свой метод с той же сигнатурой, вызовется он.</div>`,
 check: [
  { id:'q5-4a', type:'single', prompt:'Что делает this перед первым параметром статического метода?', options:['Превращает метод в метод расширения для типа этого параметра','Делает метод экземплярным','Передаёт параметр по ссылке','Ничего'], answer:0, explanation:'Тогда можно писать value.Method().' },
  { id:'q5-4b', type:'single', prompt:'Чем являются builder.Services.AddControllers() и app.UseRouting() в ASP.NET?', options:['Методами расширения','Конструкторами','Событиями','Атрибутами'], answer:0, explanation:'Каждая библиотека добавляет свои расширения.' }
 ]}
 ],
 test: [
  { id:'t5-1', type:'match', prompt:'Сопоставьте делегат и сигнатуру.', pairs:[['Action<string>','string → void'],['Func<int>','() → int'],['Func<string, int>','string → int'],['Predicate<int>','int → bool']], explanation:'У Func результат — последний параметр типа.', difficulty:1 },
  { id:'t5-2', type:'analyze', prompt:'Что выведет код?', code:'var actions = new List<Action>();\nfor (int i = 0; i < 3; i++)\n{\n    int copy = i;\n    actions.Add(() => Console.Write(copy));\n}\nforeach (var a in actions) a();', options:['012','333','222','000'], answer:0, explanation:'Каждая лямбда захватила свою переменную copy.', difficulty:3 },
  { id:'t5-3', type:'single', prompt:'Где в .NET используют методы расширения массово?', options:['LINQ и настройка ASP.NET','Только в тестах','В конструкторах','В enum'], answer:0, explanation:'Where/Select и AddXxx/UseXxx.', difficulty:1 },
  { id:'t5-4', type:'single', prompt:'Что нельзя сделать в методе расширения?', options:['Обратиться к private-членам расширяемого типа','Вернуть значение','Принять дополнительные параметры','Вызвать другие методы'], answer:0, explanation:'Это обычный статический метод снаружи типа.', difficulty:2 },
  { id:'t5-5', type:'single', prompt:'Какое ограничение позволит написать new T() внутри обобщённого метода?', options:['where T : new()','where T : class','where T : struct не нужно','where T : notnull'], answer:0, explanation:'new() требует конструктор без параметров.', difficulty:2 },
  { id:'t5-6', type:'single', prompt:'Почему долгоживущий издатель события может вызвать утечку памяти?', options:['Он хранит ссылки на подписчиков, и те не собираются GC','События хранятся на диске','Делегаты нельзя удалить','Каждое событие создаёт поток'], answer:0, explanation:'Отписывайтесь через -=.', difficulty:2 },
  { id:'t5-7', type:'single', prompt:'Какой код — «Стратегия» без отдельного интерфейса?', options:['Метод принимает Func<Order, decimal> для расчёта скидки','Метод с switch по типу скидки','Статический класс скидок','Наследование от Order'], answer:0, explanation:'Делегат — однометодная стратегия.', difficulty:2 },
  { id:'t5-8', type:'multiple', prompt:'Что верно про event в C#? (несколько ответов)', options:['Подписка через +=','Вызвать событие может только класс-владелец','Без подписчиков событие равно null','Событие обязательно асинхронное'], answer:[0,1,2], explanation:'Обработчики выполняются синхронно по очереди.', difficulty:1 }
 ]
},
{
 id: 6, title: 'LINQ', short: 'Запросы к коллекциям: фильтрация, проекция, группировка, отложенное выполнение',
 lessons: [
 { id:'6-1', title:'Where, Select, OrderBy', html:`
<p><b>LINQ</b> (Language Integrated Query) — набор методов расширения для работы с последовательностями. Вместо циклов с условиями вы описываете, <i>что</i> нужно получить.</p>
<pre><code>var products = new List&lt;Product&gt; { ... };

// Цикл
var result = new List&lt;string&gt;();
foreach (var p in products)
    if (p.Price &lt; 1000 &amp;&amp; p.InStock)
        result.Add(p.Name);
result.Sort();

// LINQ
var names = products
    .Where(p =&gt; p.Price &lt; 1000 &amp;&amp; p.InStock)   // фильтр
    .OrderBy(p =&gt; p.Name)                       // сортировка
    .Select(p =&gt; p.Name)                        // проекция
    .ToList();                                  // материализация</code></pre>
<div data-widget="linq"></div>
<div class="tbl"><table><tr><th>Метод</th><th>Что делает</th></tr>
<tr><td><code>Where</code></td><td>Оставляет элементы, удовлетворяющие условию</td></tr>
<tr><td><code>Select</code></td><td>Преобразует каждый элемент</td></tr>
<tr><td><code>OrderBy</code> / <code>OrderByDescending</code>, <code>ThenBy</code></td><td>Сортировка, дополнительный ключ</td></tr>
<tr><td><code>Skip</code> / <code>Take</code></td><td>Пропустить / взять N — пагинация</td></tr>
<tr><td><code>Distinct</code>, <code>DistinctBy</code></td><td>Уникальные элементы</td></tr>
<tr><td><code>SelectMany</code></td><td>«Расплющить» вложенные коллекции</td></tr>
</table></div>
<p>Есть и синтаксис запросов, похожий на SQL; компилятор превращает его в те же методы:</p>
<pre><code>var q = from p in products where p.Price &lt; 1000 orderby p.Name select p.Name;</code></pre>`,
 check: [
  { id:'q6-1a', type:'single', prompt:'Какой метод LINQ преобразует каждый элемент в другое значение?', options:['Select','Where','OrderBy','Any'], answer:0, explanation:'Select — проекция, Where — фильтр.' },
  { id:'q6-1b', type:'single', prompt:'Как получить третью страницу по 20 элементов?', options:['.Skip(40).Take(20)','.Take(20).Skip(40)','.Skip(60).Take(20)','.Page(3, 20)'], answer:0, explanation:'Пропустить 2 страницы по 20 и взять 20.' }
 ]},
 { id:'6-2', title:'Агрегаты, поиск и группировка', html:`
<pre><code>products.Count();                     // количество
products.Count(p =&gt; p.InStock);       // с условием
products.Sum(p =&gt; p.Price);
products.Average(p =&gt; p.Price);
products.Max(p =&gt; p.Price);
products.MaxBy(p =&gt; p.Price);         // сам элемент, а не значение

products.Any(p =&gt; p.Price == 0);      // есть ли хоть один
products.All(p =&gt; p.Price &gt; 0);       // все ли

products.First(p =&gt; p.Id == id);          // InvalidOperationException, если нет
products.FirstOrDefault(p =&gt; p.Id == id); // null, если нет
products.Single(p =&gt; p.Sku == sku);       // ошибка, если 0 или больше 1</code></pre>
<h3>Группировка и словари</h3>
<pre><code>var byCategory = products
    .GroupBy(p =&gt; p.Category)
    .Select(g =&gt; new { Category = g.Key, Count = g.Count(), Total = g.Sum(p =&gt; p.Price) });

var byId = products.ToDictionary(p =&gt; p.Id);          // быстрый поиск по ключу
var lookup = products.ToLookup(p =&gt; p.Category);      // ключ → несколько значений</code></pre>
<h3>Соединение</h3>
<pre><code>var lines = orders.Join(customers,
    o =&gt; o.CustomerId, c =&gt; c.Id,
    (o, c) =&gt; new { o.Id, c.Name, o.Total });</code></pre>
<div class="note"><code>new { ... }</code> — <b>анонимный тип</b>: компилятор сам создаёт класс со свойствами. Удобно внутри метода, но вернуть его из публичного метода нельзя — заведите record.</div>`,
 check: [
  { id:'q6-2a', type:'single', prompt:'Чем FirstOrDefault отличается от First?', options:['Возвращает значение по умолчанию (null) вместо исключения, если ничего не найдено','Работает быстрее','Возвращает последний элемент','Ничем'], answer:0, explanation:'First бросает InvalidOperationException.' },
  { id:'q6-2b', type:'single', prompt:'Какой метод проверит, есть ли в корзине хотя бы один товар без наличия?', options:['Any(p => !p.InStock)','All(p => !p.InStock)','Count() > 0','Where(p => !p.InStock)'], answer:0, explanation:'Any останавливается на первом найденном.' }
 ]},
 { id:'6-3', title:'Отложенное выполнение', html:`
<p>Большинство методов LINQ <b>не выполняются сразу</b>. Они строят описание запроса, а работа происходит при переборе.</p>
<pre><code>var list = new List&lt;int&gt; { 1, 2, 3 };
var query = list.Where(x =&gt; x &gt; 1);   // ничего не вычислено
list.Add(10);
Console.WriteLine(query.Count());     // 3 — запрос выполнился сейчас и увидел 10</code></pre>
<div class="tbl"><table><tr><th>Отложенные (возвращают IEnumerable)</th><th>Немедленные</th></tr>
<tr><td><code>Where</code>, <code>Select</code>, <code>OrderBy</code>, <code>Skip</code>, <code>Take</code>, <code>GroupBy</code></td><td><code>ToList</code>, <code>ToArray</code>, <code>ToDictionary</code>, <code>Count</code>, <code>Sum</code>, <code>First</code>, <code>Any</code></td></tr>
</table></div>
<h3>Двойное выполнение</h3>
<pre><code>IEnumerable&lt;Report&gt; reports = ids.Select(id =&gt; LoadReportFromDisk(id));
if (reports.Any())                   // загрузка №1
    foreach (var r in reports) ...   // загрузка №2 — всё читается заново!

var list = ids.Select(LoadReportFromDisk).ToList();  // материализовали один раз</code></pre>
<p>Анализаторы (Rider, Visual Studio) предупреждают о «possible multiple enumeration».</p>
<h3>yield return</h3>
<p>Свои ленивые последовательности пишут через итератор (паттерн из <a href="../oop/#/l/10-4">ООП 10.4</a>):</p>
<pre><code>static IEnumerable&lt;int&gt; Evens()
{
    for (int i = 0; ; i += 2)
        yield return i;          // бесконечная, но ленивая
}
Evens().Take(3);   // 0, 2, 4</code></pre>`,
 check: [
  { id:'q6-3a', type:'single', prompt:'Когда выполняется var q = list.Where(x => x > 0);?', options:['При переборе q или вызове немедленного метода вроде ToList','Сразу в этой строке','При сборке мусора','Никогда'], answer:0, explanation:'Отложенное выполнение.' },
  { id:'q6-3b', type:'single', prompt:'Как избежать повторного выполнения дорогого запроса?', options:['Материализовать результат через ToList()/ToArray()','Вызвать Where ещё раз','Использовать foreach дважды','Добавить AsEnumerable()'], answer:0, explanation:'Список хранит готовые элементы.' }
 ]},
 { id:'6-4', title:'IEnumerable и IQueryable', html:`
<p>Тот же синтаксис LINQ работает и с базами данных через Entity Framework Core. Но там под капотом другой интерфейс.</p>
<div class="tbl"><table><tr><th></th><th>IEnumerable&lt;T&gt;</th><th>IQueryable&lt;T&gt;</th></tr>
<tr><td>Где выполняется</td><td>В памяти процесса</td><td>Переводится в SQL и выполняется в БД</td></tr>
<tr><td>Лямбды</td><td>Скомпилированные делегаты <code>Func</code></td><td>Деревья выражений <code>Expression&lt;Func&gt;</code></td></tr>
<tr><td>Пример</td><td><code>List</code>, массивы</td><td><code>db.Products</code> в EF Core</td></tr>
</table></div>
<pre><code>// EF Core: фильтр и пагинация превратятся в SQL WHERE / ORDER BY / OFFSET / FETCH
var page = await db.Products
    .Where(p =&gt; p.Price &lt; 1000)
    .OrderBy(p =&gt; p.Name)
    .Skip(20).Take(20)
    .ToListAsync();

// Ошибка: AsEnumerable/ToList раньше фильтра — вся таблица уходит в память
var bad = db.Products.ToList().Where(p =&gt; p.Price &lt; 1000);</code></pre>
<div class="note warn"><b>Не всё переводится в SQL.</b> Вызов вашего метода внутри <code>Where</code> для IQueryable может вызвать исключение «could not be translated». Фильтруйте выражениями над свойствами.</div>
<div class="note why"><b>В ASP.NET</b> почти каждый GET-эндпойнт со списком — это LINQ к EF Core: фильтр по параметрам запроса, сортировка, <code>Skip/Take</code> и <code>Select</code> в DTO. Модуль 10 вернётся к этому.</div>`,
 check: [
  { id:'q6-4a', type:'single', prompt:'Что произойдёт при db.Orders.ToList().Where(o => o.Total > 1000)?', options:['Вся таблица загрузится в память, фильтр выполнится в C#','Фильтр выполнится в SQL','Ошибка компиляции','Загрузятся только подходящие строки'], answer:0, explanation:'После ToList работает уже IEnumerable.' },
  { id:'q6-4b', type:'single', prompt:'Во что EF Core превращает LINQ-запрос к IQueryable?', options:['В SQL-запрос к базе данных','В JavaScript','В цикл foreach','В JSON'], answer:0, explanation:'Через деревья выражений.' }
 ]}
 ],
 test: [
  { id:'t6-1', type:'analyze', prompt:'Что выведет код?', code:'var xs = new[] { 5, 3, 8, 1, 9 };\nvar r = xs.Where(x => x > 2).OrderBy(x => x).Take(2);\nConsole.WriteLine(string.Join(",", r));', options:['3,5','5,3','3,5,8','8,9'], answer:0, explanation:'Больше 2: 5,3,8,9 → по возрастанию 3,5,8,9 → первые два.', difficulty:1 },
  { id:'t6-2', type:'input', prompt:'new[] { 2, 4, 6 }.Select(x => x * 10).Sum() — чему равно? Введите число.', answer:['120'], explanation:'20 + 40 + 60.', difficulty:1 },
  { id:'t6-3', type:'match', prompt:'Сопоставьте задачу и метод.', pairs:[['Есть ли хоть один','Any'],['Сгруппировать по категории','GroupBy'],['Самый дорогой товар целиком','MaxBy'],['Список заказов → все позиции','SelectMany']], explanation:'Основные операторы.', difficulty:2 },
  { id:'t6-4', type:'analyze', prompt:'Что выведет код?', code:'var list = new List<int> { 1, 2 };\nvar q = list.Select(x => x * 2);\nlist.Add(3);\nConsole.WriteLine(q.Count());', options:['3','2','6','Ошибку'], answer:0, explanation:'Запрос выполнился при Count и увидел 3 элемента.', difficulty:2 },
  { id:'t6-5', type:'single', prompt:'Single(p => p.Email == e) бросит исключение, если…', options:['…найдено 0 или больше одного элемента','…найден ровно один','…коллекция List','…email в верхнем регистре'], answer:0, explanation:'Single гарантирует ровно одно совпадение.', difficulty:2 },
  { id:'t6-6', type:'single', prompt:'Почему внутри Where для EF Core нельзя вызвать произвольный C#-метод?', options:['Его нельзя перевести в SQL','C#-методы медленные','Where принимает только строки','Это ограничение List'], answer:0, explanation:'Запрос выполняется базой данных.', difficulty:2 },
  { id:'t6-7', type:'multiple', prompt:'Какие методы выполняются немедленно? (несколько ответов)', options:['ToList','Count','First','Select'], answer:[0,1,2], explanation:'Select — отложенный.', difficulty:1 },
  { id:'t6-8', type:'single', prompt:'Что такое new { p.Name, p.Price } в Select?', options:['Анонимный тип','record','Кортеж','Словарь'], answer:0, explanation:'Компилятор создаёт класс сам.', difficulty:1 }
 ]
},
{
 id: 7, title: 'Исключения и ресурсы', short: 'try/catch/finally, свои исключения, using, IDisposable, GC',
 lessons: [
 { id:'7-1', title:'try, catch, finally', html:`
<pre><code>try
{
    var text = File.ReadAllText(path);
    var order = JsonSerializer.Deserialize&lt;Order&gt;(text);
}
catch (FileNotFoundException ex)
{
    logger.LogWarning(ex, "Файл {Path} не найден", path);
}
catch (JsonException ex) when (ex.LineNumber &gt; 0)   // фильтр исключений
{
    logger.LogError(ex, "Битый JSON в строке {Line}", ex.LineNumber);
    throw;                                             // пробросить дальше, сохранив стек
}
finally
{
    // выполнится всегда: и при успехе, и при исключении
}</code></pre>
<ul>
<li>Блоки <code>catch</code> проверяются сверху вниз — более конкретные типы пишут раньше.</li>
<li><code>throw;</code> сохраняет исходный стек вызовов. <code>throw ex;</code> его обрезает — так не делайте.</li>
<li>Все исключения наследуют <code>System.Exception</code>: <code>Message</code>, <code>StackTrace</code>, <code>InnerException</code>.</li>
</ul>
<div class="tbl"><table><tr><th>Исключение</th><th>Когда</th></tr>
<tr><td><code>ArgumentException</code>, <code>ArgumentNullException</code></td><td>Неверный аргумент метода</td></tr>
<tr><td><code>InvalidOperationException</code></td><td>Операция недопустима в текущем состоянии</td></tr>
<tr><td><code>NullReferenceException</code></td><td>Обращение к null — ошибка программиста</td></tr>
<tr><td><code>KeyNotFoundException</code></td><td>Нет ключа в словаре</td></tr>
<tr><td><code>OperationCanceledException</code></td><td>Операция отменена (модуль 8)</td></tr>
</table></div>`,
 check: [
  { id:'q7-1a', type:'single', prompt:'Чем throw; отличается от throw ex; внутри catch?', options:['throw; сохраняет исходный стек вызовов','Ничем','throw ex; быстрее','throw; не пробрасывает исключение'], answer:0, explanation:'throw ex; начинает стек заново с текущей строки.' },
  { id:'q7-1b', type:'single', prompt:'Когда выполняется блок finally?', options:['Всегда — и при успехе, и при исключении','Только при исключении','Только при успехе','Только в Debug'], answer:0, explanation:'Для гарантированной очистки.' }
 ]},
 { id:'7-2', title:'Когда бросать и когда ловить', html:`
<h3>Бросать</h3>
<p>Исключение — для <b>исключительных</b> ситуаций: нарушен контракт, недоступна внешняя система. Ожидаемые варианты (пользователь ввёл неверный email, товар не найден) лучше выражать результатом:</p>
<pre><code>// Ожидаемый исход — через возвращаемое значение
public Product? Find(int id) =&gt; ...;
public bool TryParse(string s, out Money result) =&gt; ...;

// Нарушение контракта — исключением
public void Ship(Order o)
{
    if (o.Status != OrderStatus.Paid)
        throw new InvalidOperationException($"Заказ {o.Id} не оплачен");
}</code></pre>
<h3>Свои исключения</h3>
<pre><code>public class DomainException(string message) : Exception(message);
public class InsufficientStockException(string sku, int requested)
    : DomainException($"Недостаточно товара {sku}: запрошено {requested}")
{
    public string Sku { get; } = sku;
}</code></pre>
<h3>Ловить</h3>
<ul>
<li>Ловите только то, что умеете обработать: повторить, вернуть значение по умолчанию, перевести в понятную ошибку.</li>
<li>Не глотайте исключения: пустой <code>catch { }</code> прячет баги.</li>
<li>Не ловите <code>Exception</code> посреди бизнес-логики — пусть дойдёт до верхнего уровня.</li>
</ul>
<div class="note why"><b>В ASP.NET</b> верхний уровень — middleware обработки ошибок. Он ловит необработанные исключения, логирует их и возвращает клиенту <code>500</code> или <code>ProblemDetails</code>. Свои доменные исключения часто переводят там в <code>400</code>/<code>404</code>/<code>409</code>.</div>`,
 check: [
  { id:'q7-2a', type:'single', prompt:'Пользователь искал товар, которого нет. Что лучше?', options:['Вернуть null/пустой результат — это ожидаемая ситуация','Бросить Exception','Завершить программу','Записать в лог и молчать'], answer:0, explanation:'Исключения — для нарушений контракта.' },
  { id:'q7-2b', type:'single', prompt:'Что плохо в catch (Exception) { }?', options:['Исключение молча проглатывается, ошибка скрыта','Ничего','Это ошибка компиляции','Ловится слишком мало'], answer:0, explanation:'Баг станет невидимым.' }
 ]},
 { id:'7-3', title:'IDisposable и using', html:`
<p class="small">Теория: <a href="../oop/#/l/7-4">ООП 7.4 «Жизненный цикл»</a>. Сборщик мусора освобождает память, а файлы, сокеты и соединения с БД закрывают через <code>IDisposable</code>.</p>
<pre><code>// using-объявление: Dispose() вызовется в конце блока/метода
using var file = File.OpenRead("data.csv");
using var reader = new StreamReader(file);
string? line = reader.ReadLine();

// using-блок
using (var conn = new SqlConnection(cs))
{
    conn.Open();
} // conn.Dispose() здесь, даже при исключении

// асинхронный вариант
await using var stream = new FileStream(path, FileMode.Create);</code></pre>
<p><code>using</code> — сокращение для <code>try { ... } finally { x.Dispose(); }</code>.</p>
<h3>Свой IDisposable</h3>
<pre><code>public sealed class TempFile : IDisposable
{
    public string Path { get; } = System.IO.Path.GetTempFileName();
    public void Dispose() =&gt; File.Delete(Path);
}</code></pre>
<div class="note warn"><b>HttpClient — исключение из правила.</b> Создавать <code>new HttpClient()</code> в <code>using</code> на каждый запрос нельзя: закончатся сокеты. Используйте один экземпляр или <code>IHttpClientFactory</code> (модуль 10).</div>
<div class="note why"><b>В ASP.NET</b> DI-контейнер сам вызывает <code>Dispose</code> у созданных им сервисов в конце запроса (для Scoped) — поэтому <code>DbContext</code> вручную обычно не освобождают.</div>`,
 check: [
  { id:'q7-3a', type:'single', prompt:'Во что разворачивается using var x = ...;?', options:['try/finally с вызовом x.Dispose() в конце области','Вызов GC.Collect()','Создание статической переменной','Импорт пространства имён'], answer:0, explanation:'Гарантированная очистка ресурса.' },
  { id:'q7-3b', type:'single', prompt:'Почему нельзя создавать HttpClient в using на каждый запрос?', options:['Сокеты освобождаются не сразу, и под нагрузкой они заканчиваются','HttpClient не реализует IDisposable','Так медленнее компилируется','Это запрещено лицензией'], answer:0, explanation:'Используйте IHttpClientFactory.' }
 ]},
 { id:'7-4', title:'Сборщик мусора .NET', html:`
<p>GC в .NET — <b>поколенческий</b>: большинство объектов умирает молодыми, поэтому молодые проверяются часто, а старые — редко.</p>
<div class="tbl"><table><tr><th>Поколение</th><th>Что там</th><th>Сборка</th></tr>
<tr><td>Gen 0</td><td>Только что созданные объекты</td><td>Очень часто, быстро</td></tr>
<tr><td>Gen 1</td><td>Пережившие одну сборку</td><td>Буфер между 0 и 2</td></tr>
<tr><td>Gen 2</td><td>Долгоживущие: кэши, синглтоны</td><td>Редко, дорого</td></tr>
<tr><td>LOH</td><td>Объекты больше 85 КБ</td><td>Вместе с Gen 2</td></tr>
</table></div>
<p>Что полезно знать прикладному разработчику:</p>
<ul>
<li>Не вызывайте <code>GC.Collect()</code> — среда лучше знает, когда собирать.</li>
<li>Меньше выделений — меньше пауз: <code>StringBuilder</code> вместо склейки в цикле, без лишних <code>ToList()</code>, <code>ArrayPool</code> для больших буферов.</li>
<li>Утечки в .NET — это «забытые» ссылки: статические коллекции, неотписанные события, кэши без ограничения.</li>
<li>Для серверов включён <b>Server GC</b> — отдельная куча на ядро и параллельная сборка.</li>
</ul>
<pre><code>$ dotnet-counters monitor -n MyApi   # live-метрики: gc-heap-size, gen-0-gc-count, alloc-rate</code></pre>
<div class="note"><b>Span&lt;T&gt;</b> и <b>Memory&lt;T&gt;</b> позволяют работать с частью массива или строки без копирования. Ими построены быстрые части ASP.NET Core (парсинг HTTP, JSON), но в прикладном коде они нужны редко.</div>`,
 check: [
  { id:'q7-4a', type:'single', prompt:'Почему GC в .NET делит объекты на поколения?', options:['Большинство объектов живёт недолго, их выгодно собирать часто и быстро','Чтобы ограничить число объектов','Для сериализации','Так требует Windows'], answer:0, explanation:'Гипотеза поколений.' },
  { id:'q7-4b', type:'single', prompt:'Какой из вариантов — типичная утечка памяти в .NET?', options:['Статический Dictionary-кэш, в который только добавляют','Локальная переменная в методе','Использование using','Вызов ToString()'], answer:0, explanation:'Объекты остаются достижимыми навсегда.' }
 ]}
 ],
 test: [
  { id:'t7-1', type:'analyze', prompt:'Что выведет код?', code:'try\n{\n    Console.Write("A");\n    throw new InvalidOperationException();\n}\ncatch (ArgumentException) { Console.Write("B"); }\ncatch (InvalidOperationException) { Console.Write("C"); }\nfinally { Console.Write("D"); }', options:['ACD','ABCD','AD','ACBD'], answer:0, explanation:'Подходит второй catch, finally выполняется всегда.', difficulty:1 },
  { id:'t7-2', type:'single', prompt:'Какое исключение бросить, если метод Ship вызван для неоплаченного заказа?', options:['InvalidOperationException','ArgumentNullException','NullReferenceException','StackOverflowException'], answer:0, explanation:'Операция недопустима в текущем состоянии объекта.', difficulty:2 },
  { id:'t7-3', type:'single', prompt:'Что делает catch (HttpRequestException ex) when (ex.StatusCode == HttpStatusCode.NotFound)?', options:['Ловит исключение, только если условие истинно','Ловит все HttpRequestException','Бросает новое исключение','Ошибка синтаксиса'], answer:0, explanation:'Фильтр исключений.', difficulty:2 },
  { id:'t7-4', type:'match', prompt:'Сопоставьте конструкцию и назначение.', pairs:[['finally','Код, выполняемый всегда'],['using','Гарантированный вызов Dispose'],['throw;','Проброс с сохранением стека'],['InnerException','Исходная причина ошибки']], explanation:'Основы обработки ошибок.', difficulty:1 },
  { id:'t7-5', type:'single', prompt:'Кто в ASP.NET обычно обрабатывает необработанные исключения?', options:['Middleware обработки ошибок на верхнем уровне конвейера','Каждый метод сам','GC','База данных'], answer:0, explanation:'Он логирует и возвращает 500/ProblemDetails.', difficulty:1 },
  { id:'t7-6', type:'single', prompt:'Зачем await using вместо using?', options:['Для объектов IAsyncDisposable, которые освобождаются асинхронно','Для ускорения','Для объектов без Dispose','Для статических полей'], answer:0, explanation:'Например, потоки и соединения.', difficulty:2 },
  { id:'t7-7', type:'single', prompt:'Стоит ли вызывать GC.Collect() после обработки каждого запроса?', options:['Нет, это ухудшит производительность','Да, это освобождает память','Да, иначе будет утечка','Только в Release'], answer:0, explanation:'GC сам решает, когда собирать.', difficulty:1 },
  { id:'t7-8', type:'multiple', prompt:'Какие ситуации лучше выразить возвращаемым значением, а не исключением? (несколько ответов)', options:['Товар по id не найден','Строка не парсится в число (TryParse)','Пользователь ввёл неверный пароль','Нет соединения с базой данных'], answer:[0,1,2], explanation:'Отказ БД — исключительная ситуация.', difficulty:2 }
 ]
},
{
 id: 8, title: 'Асинхронность', short: 'Task, async/await, отмена, параллелизм, частые ошибки',
 lessons: [
 { id:'8-1', title:'Зачем async и что такое Task', html:`
<p>Веб-сервер большую часть времени <b>ждёт</b>: ответа БД, другого сервиса, диска. Если поток при этом заблокирован, он не обслуживает других клиентов, и под нагрузкой потоки заканчиваются.</p>
<pre><code>// Синхронно: поток стоит и ждёт
string html = client.GetString(url);        // поток занят 300 мс

// Асинхронно: на время ожидания поток возвращается в пул
string html = await client.GetStringAsync(url);</code></pre>
<p><b>Task</b> — обещание результата, который появится позже:</p>
<div class="tbl"><table><tr><th>Тип</th><th>Смысл</th></tr>
<tr><td><code>Task</code></td><td>Операция без результата (аналог void)</td></tr>
<tr><td><code>Task&lt;T&gt;</code></td><td>Операция, которая вернёт T</td></tr>
<tr><td><code>ValueTask&lt;T&gt;</code></td><td>То же, но без выделения памяти, если результат часто готов сразу</td></tr>
</table></div>
<div data-widget="async"></div>
<div class="note why"><b>В ASP.NET</b> асинхронные обработчики — стандарт: <code>public async Task&lt;IActionResult&gt; Get(int id)</code>. Благодаря этому сервер с небольшим пулом потоков держит тысячи одновременных запросов.</div>`,
 check: [
  { id:'q8-1a', type:'single', prompt:'Что происходит с потоком на await при ожидании ответа сети?', options:['Он возвращается в пул и может обслуживать другую работу','Он блокируется до ответа','Он завершается навсегда','Создаётся новый процесс'], answer:0, explanation:'Продолжение выполнится позже, возможно на другом потоке.' },
  { id:'q8-1b', type:'single', prompt:'Какой тип вернёт асинхронный метод, получающий строку?', options:['Task<string>','string','async string','Thread<string>'], answer:0, explanation:'Task<T> — будущий результат типа T.' }
 ]},
 { id:'8-2', title:'async и await', html:`
<pre><code>public async Task&lt;OrderDto&gt; GetOrderAsync(Guid id, CancellationToken ct)
{
    var order = await _repo.FindAsync(id, ct);           // ждём БД
    if (order is null) throw new NotFoundException(id);

    var customer = await _customers.GetAsync(order.CustomerId, ct);
    return new OrderDto(order.Id, customer.Name, order.Total);
}</code></pre>
<p>Правила:</p>
<ul>
<li><code>async</code> в сигнатуре разрешает <code>await</code> внутри. Возвращаемый тип — <code>Task</code> / <code>Task&lt;T&gt;</code>.</li>
<li>Имя асинхронного метода заканчивается на <code>Async</code>.</li>
<li>Исключение внутри async-метода сохраняется в Task и выбрасывается на <code>await</code> — обычный try/catch работает.</li>
<li><code>async void</code> — только для обработчиков событий. Исключение из него не поймать, и оно может уронить процесс.</li>
</ul>
<h3>Параллельное ожидание</h3>
<pre><code>// Последовательно: 300 + 300 = 600 мс
var a = await GetUserAsync(id);
var b = await GetOrdersAsync(id);

// Одновременно: ~300 мс
var userTask = GetUserAsync(id);
var ordersTask = GetOrdersAsync(id);
await Task.WhenAll(userTask, ordersTask);
var user = userTask.Result;      // уже завершено — безопасно</code></pre>
<div class="note warn"><b>Async до конца.</b> Если метод вызывает асинхронный код, он сам становится асинхронным, и так вверх по стеку до контроллера. Не останавливайте цепочку через <code>.Result</code> или <code>.Wait()</code>.</div>`,
 check: [
  { id:'q8-2a', type:'single', prompt:'Почему async void опасен?', options:['Исключение нельзя поймать вызывающим кодом, оно может уронить процесс','Он медленнее','Он не компилируется','Он всегда синхронный'], answer:0, explanation:'Используйте async Task.' },
  { id:'q8-2b', type:'single', prompt:'Как запустить два независимых запроса одновременно и дождаться обоих?', options:['Запустить оба и await Task.WhenAll(t1, t2)','await первый, потом await второй','Вызвать .Result у обоих','Использовать Thread.Sleep'], answer:0, explanation:'Время ≈ максимуму из двух, а не сумме.' }
 ]},
 { id:'8-3', title:'Отмена и таймауты', html:`
<p>Клиент закрыл вкладку — продолжать тяжёлый запрос к БД бессмысленно. Для отмены в .NET используется <b>CancellationToken</b>.</p>
<pre><code>public async Task&lt;Report&gt; BuildAsync(CancellationToken ct)
{
    foreach (var chunk in chunks)
    {
        ct.ThrowIfCancellationRequested();               // кооперативная проверка
        await ProcessAsync(chunk, ct);                   // передаём токен дальше
    }
    ...
}

// Таймаут
using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
try { var r = await BuildAsync(cts.Token); }
catch (OperationCanceledException) { /* истекло время */ }

await Task.Delay(1000, ct);       // асинхронная пауза, а не Thread.Sleep</code></pre>
<ul>
<li>Отмена <b>кооперативная</b>: код сам проверяет токен или передаёт его методам, которые проверяют.</li>
<li>Принимайте <code>CancellationToken ct = default</code> последним параметром и передавайте его во все вложенные async-вызовы.</li>
</ul>
<div class="note why"><b>В ASP.NET</b> токен приходит бесплатно: добавьте параметр <code>CancellationToken ct</code> в действие контроллера или Minimal API — он сработает, если клиент оборвёт соединение. EF Core и HttpClient принимают его во все методы.</div>`,
 check: [
  { id:'q8-3a', type:'single', prompt:'Как отменяется операция с CancellationToken?', options:['Кооперативно: код сам проверяет токен или передаёт его дальше','Поток принудительно убивается','Процесс перезапускается','Никак'], answer:0, explanation:'Принудительной остановки нет.' },
  { id:'q8-3b', type:'single', prompt:'Чем заменить Thread.Sleep(1000) в асинхронном коде?', options:['await Task.Delay(1000, ct)','Task.Wait(1000)','while (true) {}','GC.Collect()'], answer:0, explanation:'Delay не блокирует поток.' }
 ]},
 { id:'8-4', title:'Частые ошибки и потокобезопасность', html:`
<h3>Блокировка асинхронного кода</h3>
<pre><code>var data = GetDataAsync().Result;     // блокирует поток; в старых UI/ASP.NET — дедлок
GetDataAsync().Wait();                // то же самое

var data = await GetDataAsync();      // правильно</code></pre>
<h3>Забытый await</h3>
<pre><code>SaveAsync(order);                     // fire-and-forget: ошибка потеряется,
                                      // а запрос может закончиться раньше записи
await SaveAsync(order);</code></pre>
<h3>Общие данные из нескольких потоков</h3>
<p>В ASP.NET один экземпляр Singleton-сервиса обслуживает запросы параллельно. Изменяемое состояние в нём должно быть потокобезопасным:</p>
<pre><code>// Плохо: Dictionary не потокобезопасен
private readonly Dictionary&lt;string, int&gt; _hits = new();

// Хорошо
private readonly ConcurrentDictionary&lt;string, int&gt; _hits = new();
_hits.AddOrUpdate(path, 1, (_, n) =&gt; n + 1);

private int _count;
Interlocked.Increment(ref _count);    // атомарный счётчик

private readonly object _lock = new();
lock (_lock) { /* короткая критическая секция, без await внутри */ }

private readonly SemaphoreSlim _sem = new(1);
await _sem.WaitAsync(ct); try { ... } finally { _sem.Release(); }   // асинхронный «lock»</code></pre>
<div class="note"><b>CPU-нагрузка.</b> async ускоряет ожидание ввода-вывода, но не вычисления. Тяжёлые расчёты распараллеливают через <code>Parallel.ForEach</code> или <code>Task.Run</code> — но в ASP.NET обычно лучше вынести их в фоновую очередь.</div>`,
 check: [
  { id:'q8-4a', type:'single', prompt:'Что не так с var x = GetAsync().Result; в веб-приложении?', options:['Поток блокируется, растёт риск дедлоков и исчерпания пула потоков','Ничего','Ошибка компиляции','Результат всегда null'], answer:0, explanation:'Используйте await.' },
  { id:'q8-4b', type:'single', prompt:'Какую коллекцию использовать в Singleton-сервисе, который меняют параллельные запросы?', options:['ConcurrentDictionary','Dictionary','List','Array'], answer:0, explanation:'Она потокобезопасна.' }
 ]}
 ],
 test: [
  { id:'t8-1', type:'analyze', prompt:'Сколько примерно займёт метод, если каждый вызов длится 1 с?', code:'var a = LoadAAsync();\nvar b = LoadBAsync();\nvar c = LoadCAsync();\nawait Task.WhenAll(a, b, c);', options:['≈1 с','≈3 с','≈0 с','≈2 с'], answer:0, explanation:'Все три выполняются одновременно.', difficulty:2 },
  { id:'t8-2', type:'single', prompt:'Какое имя дать асинхронному методу загрузки пользователя?', options:['GetUserAsync','GetUser','AsyncGetUser','GetUserTask'], answer:0, explanation:'Суффикс Async — соглашение .NET.', difficulty:1 },
  { id:'t8-3', type:'single', prompt:'Где в ASP.NET взять токен отмены запроса?', options:['Добавить параметр CancellationToken в метод контроллера/эндпойнта','Создать new CancellationToken() в каждом методе','Из статического поля','Он недоступен'], answer:0, explanation:'Фреймворк связывает его с соединением клиента.', difficulty:1 },
  { id:'t8-4', type:'single', prompt:'Почему нельзя использовать await внутри lock?', options:['Компилятор запрещает: продолжение может выполниться на другом потоке','Это медленно','lock не работает с async-методами вообще','Можно, ограничений нет'], answer:0, explanation:'Для асинхронной синхронизации — SemaphoreSlim.WaitAsync.', difficulty:3 },
  { id:'t8-5', type:'match', prompt:'Сопоставьте инструмент и задачу.', pairs:[['Task.WhenAll','Дождаться нескольких задач'],['CancellationTokenSource','Таймаут или отмена'],['Interlocked.Increment','Атомарный счётчик'],['SemaphoreSlim','Ограничить параллелизм в async-коде']], explanation:'Базовые примитивы.', difficulty:2 },
  { id:'t8-6', type:'single', prompt:'Что произойдёт с исключением внутри async Task-метода, если результат ожидают через await?', options:['Оно будет выброшено в точке await и поймано обычным try/catch','Потеряется','Уронит процесс сразу','Превратится в null'], answer:0, explanation:'Task хранит исключение.', difficulty:2 },
  { id:'t8-7', type:'single', prompt:'Ускорит ли async/await тяжёлый расчёт хеша на процессоре?', options:['Нет: async помогает ждать ввод-вывод, а не считать','Да, в разы','Да, если добавить ConfigureAwait','Только в Release'], answer:0, explanation:'CPU-работа требует других подходов.', difficulty:2 },
  { id:'t8-8', type:'multiple', prompt:'Какие практики правильны? (несколько ответов)', options:['async Task вместо async void','Передавать CancellationToken во вложенные вызовы','await вместо .Result','Fire-and-forget для записи в БД'], answer:[0,1,2], explanation:'Fire-and-forget теряет ошибки.', difficulty:1 }
 ]
},
{
 id: 9, title: 'Мост к ASP.NET: хост, DI, конфигурация', short: 'Microsoft.Extensions: DI, время жизни, IConfiguration, IOptions, ILogger, Generic Host',
 lessons: [
 { id:'9-1', title:'Внедрение зависимостей в .NET', html:`
<p class="small">Теория: <a href="../oop/#/l/6-4">ООП 6.4 «Делегирование и внедрение зависимостей»</a>, <a href="../oop/#/l/8-4">ООП 8.4 «DIP»</a>. Здесь — встроенный DI-контейнер .NET, тот самый, что лежит в основе ASP.NET Core.</p>
<pre><code>$ dotnet add package Microsoft.Extensions.DependencyInjection</code></pre>
<pre><code>using Microsoft.Extensions.DependencyInjection;

var services = new ServiceCollection();
services.AddSingleton&lt;IClock, SystemClock&gt;();
services.AddScoped&lt;IOrderRepository, InMemoryOrderRepository&gt;();
services.AddTransient&lt;OrderService&gt;();

using var provider = services.BuildServiceProvider();
using var scope = provider.CreateScope();
var svc = scope.ServiceProvider.GetRequiredService&lt;OrderService&gt;();

public class OrderService(IOrderRepository repo, IClock clock)   // контейнер сам подставит
{
    public Task PlaceAsync(Order o) =&gt; repo.SaveAsync(o with { CreatedAt = clock.Now });
}</code></pre>
<p>Контейнер смотрит на конструктор <code>OrderService</code>, находит зарегистрированные реализации параметров и создаёт весь граф объектов.</p>
<div class="note why"><b>В ASP.NET</b> вместо <code>new ServiceCollection()</code> будет <code>builder.Services</code>, а <code>GetRequiredService</code> вызывать не придётся: контроллеры и эндпойнты получают сервисы через параметры.</div>`,
 check: [
  { id:'q9-1a', type:'single', prompt:'Как DI-контейнер узнаёт, что передать в конструктор OrderService?', options:['По типам параметров конструктора ищет зарегистрированные реализации','По именам параметров','Из файла конфигурации XML','Никак, нужно передавать вручную'], answer:0, explanation:'Регистрация «интерфейс → реализация».' },
  { id:'q9-1b', type:'single', prompt:'Что делает services.AddScoped<IRepo, SqlRepo>()?', options:['Регистрирует SqlRepo как реализацию IRepo со временем жизни Scoped','Создаёт SqlRepo сразу','Наследует SqlRepo от IRepo','Удаляет регистрацию'], answer:0, explanation:'Экземпляр создаётся по требованию.' }
 ]},
 { id:'9-2', title:'Время жизни сервисов', html:`
<div class="tbl"><table><tr><th>Время жизни</th><th>Экземпляр</th><th>Для чего</th></tr>
<tr><td><code>Singleton</code></td><td>Один на всё приложение</td><td>Кэши, конфигурация, HttpClient-фабрика, часы</td></tr>
<tr><td><code>Scoped</code></td><td>Один на область (в вебе — на HTTP-запрос)</td><td><code>DbContext</code>, репозитории, сервисы бизнес-логики</td></tr>
<tr><td><code>Transient</code></td><td>Новый при каждом запросе к контейнеру</td><td>Лёгкие сервисы без состояния</td></tr>
</table></div>
<div data-widget="lifetimes"></div>
<h3>Захваченная зависимость</h3>
<pre><code>services.AddSingleton&lt;ReportCache&gt;();     // живёт вечно
services.AddScoped&lt;AppDbContext&gt;();       // должен жить один запрос

public class ReportCache(AppDbContext db) { }   // ошибка: Singleton держит Scoped</code></pre>
<p>Singleton захватит первый <code>DbContext</code> и будет использовать его из всех запросов параллельно — а DbContext не потокобезопасен. В режиме разработки ASP.NET проверяет это и падает при старте с понятной ошибкой.</p>
<div class="note"><b>Правило:</b> сервис может зависеть только от сервисов с таким же или более длинным временем жизни. Singleton → только Singleton; Scoped → Scoped и Singleton; Transient → любые.</div>`,
 check: [
  { id:'q9-2a', type:'single', prompt:'Какое время жизни у DbContext в веб-приложении?', options:['Scoped — один на запрос','Singleton','Transient','Static'], answer:0, explanation:'Отслеживание изменений привязано к единице работы — запросу.' },
  { id:'q9-2b', type:'single', prompt:'Почему Singleton не должен зависеть от Scoped-сервиса?', options:['Он захватит один экземпляр и будет использовать его во всех запросах','Это быстрее','Scoped нельзя внедрять','Singleton не имеет конструктора'], answer:0, explanation:'Захваченная зависимость (captive dependency).' }
 ]},
 { id:'9-3', title:'Конфигурация и Options', html:`
<p>Настройки берутся из нескольких источников; более поздние перекрывают ранние:</p>
<ol class="steps">
<li><code>appsettings.json</code></li>
<li><code>appsettings.{Environment}.json</code> (Development, Production)</li>
<li>User Secrets (только в разработке, вне репозитория)</li>
<li>Переменные окружения (<code>Smtp__Host</code> → <code>Smtp:Host</code>)</li>
<li>Аргументы командной строки</li>
</ol>
<pre><code>// appsettings.json
{
  "ConnectionStrings": { "Default": "Host=localhost;Database=shop" },
  "Smtp": { "Host": "smtp.example.com", "Port": 587 }
}</code></pre>
<pre><code>public class SmtpOptions
{
    public required string Host { get; init; }
    public int Port { get; init; } = 25;
}

services.AddOptions&lt;SmtpOptions&gt;()
    .Bind(configuration.GetSection("Smtp"))
    .ValidateDataAnnotations()
    .ValidateOnStart();

public class Mailer(IOptions&lt;SmtpOptions&gt; options)
{
    private readonly SmtpOptions _o = options.Value;
}</code></pre>
<div class="tbl"><table><tr><th>Интерфейс</th><th>Когда</th></tr>
<tr><td><code>IOptions&lt;T&gt;</code></td><td>Значения читаются один раз — для большинства случаев</td></tr>
<tr><td><code>IOptionsSnapshot&lt;T&gt;</code></td><td>Перечитываются на каждый запрос (Scoped)</td></tr>
<tr><td><code>IOptionsMonitor&lt;T&gt;</code></td><td>Уведомления об изменениях, для Singleton</td></tr>
</table></div>
<div class="note warn"><b>Секреты</b> — пароли, ключи API — не кладут в <code>appsettings.json</code> в репозитории. В разработке — <code>dotnet user-secrets set "Smtp:Password" "..."</code>, в продакшене — переменные окружения или хранилище секретов.</div>`,
 check: [
  { id:'q9-3a', type:'single', prompt:'Как переменной окружения задать настройку Smtp:Host?', options:['Smtp__Host','Smtp.Host','SMTP-HOST','Smtp:Host нельзя задать'], answer:0, explanation:'Двойное подчёркивание заменяет двоеточие.' },
  { id:'q9-3b', type:'single', prompt:'Зачем привязывать секцию конфигурации к классу SmtpOptions?', options:['Строгая типизация, валидация и внедрение через IOptions','Так быстрее читать JSON','Чтобы зашифровать настройки','Это обязательное требование .NET'], answer:0, explanation:'Вместо строк config["Smtp:Host"] по всему коду.' }
 ]},
 { id:'9-4', title:'Логирование и Generic Host', html:`
<h3>ILogger</h3>
<pre><code>public class OrderService(ILogger&lt;OrderService&gt; logger)
{
    public void Place(Order o)
    {
        logger.LogInformation("Заказ {OrderId} на сумму {Total}", o.Id, o.Total);  // структурный лог
        logger.LogWarning("Мало товара {Sku}", sku);
        logger.LogError(ex, "Не удалось оплатить {OrderId}", o.Id);
    }
}</code></pre>
<p>Используйте шаблон с именованными плейсхолдерами, а не интерполяцию <code>$"..."</code>: значения сохраняются как поля, по ним можно искать в Seq, Elastic, Grafana Loki.</p>
<h3>Generic Host</h3>
<p><b>Хост</b> собирает вместе DI, конфигурацию, логирование и управляет жизнью приложения: запуск, корректная остановка по Ctrl+C или SIGTERM.</p>
<pre><code>// Program.cs консольного сервиса (шаблон dotnet new worker)
var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddHostedService&lt;QueueWorker&gt;();
builder.Services.AddSingleton&lt;IClock, SystemClock&gt;();
var host = builder.Build();
await host.RunAsync();

public class QueueWorker(ILogger&lt;QueueWorker&gt; log) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            log.LogInformation("Работаю");
            await Task.Delay(5000, stoppingToken);
        }
    }
}</code></pre>
<p>Сравните с веб-приложением:</p>
<pre><code>var builder = WebApplication.CreateBuilder(args);   // тот же хост + веб-сервер Kestrel
builder.Services.AddScoped&lt;OrderService&gt;();
var app = builder.Build();
app.MapGet("/orders/{id}", (Guid id, OrderService s) =&gt; s.GetAsync(id));
app.Run();</code></pre>
<div class="note why"><b>Это и есть мост.</b> ASP.NET Core = Generic Host + HTTP-сервер + маршрутизация. Если вы понимаете DI, Options, ILogger и BackgroundService, Program.cs веб-приложения уже читается.</div>`,
 check: [
  { id:'q9-4a', type:'single', prompt:'Почему logger.LogInformation("Заказ {Id}", id) лучше, чем $"Заказ {id}"?', options:['Значение сохраняется как отдельное поле — по нему можно искать и фильтровать','Так короче','Интерполяция не компилируется','Нет разницы'], answer:0, explanation:'Структурное логирование.' },
  { id:'q9-4b', type:'single', prompt:'Чем WebApplication отличается от Generic Host?', options:['Это тот же хост с добавленным веб-сервером и маршрутизацией','Это совершенно другой механизм без DI','Он не поддерживает конфигурацию','Он работает только на Windows'], answer:0, explanation:'Все сервисы хоста доступны и в вебе.' }
 ]}
 ],
 test: [
  { id:'t9-1', type:'match', prompt:'Сопоставьте время жизни и пример сервиса.', pairs:[['Singleton','Кэш курсов валют на всё приложение'],['Scoped','DbContext на запрос'],['Transient','Лёгкий форматтер без состояния']], explanation:'Выбор по природе сервиса.', difficulty:1 },
  { id:'t9-2', type:'order', prompt:'Расставьте источники конфигурации по приоритету (от низшего к высшему) по умолчанию.', options:['appsettings.json','appsettings.Production.json','Переменные окружения','Аргументы командной строки'], answer:[0,1,2,3], explanation:'Поздние перекрывают ранние.', difficulty:2 },
  { id:'t9-3', type:'analyze', prompt:'Что не так в регистрации?', code:'services.AddSingleton<PriceCache>();\nservices.AddScoped<ShopDbContext>();\n\npublic class PriceCache(ShopDbContext db) { ... }', options:['Singleton захватывает Scoped DbContext','Нужно AddTransient для DbContext','PriceCache должен быть static','Всё правильно'], answer:0, explanation:'Захваченная зависимость.', difficulty:2 },
  { id:'t9-4', type:'single', prompt:'Где хранить пароль SMTP при локальной разработке?', options:['В User Secrets','В appsettings.json в репозитории','В коде','В README'], answer:0, explanation:'Секреты — вне репозитория.', difficulty:1 },
  { id:'t9-5', type:'single', prompt:'Какой базовый класс удобен для фонового сервиса в хосте?', options:['BackgroundService','Controller','DbContext','Thread'], answer:0, explanation:'Реализуйте ExecuteAsync.', difficulty:1 },
  { id:'t9-6', type:'single', prompt:'Что сделает ValidateOnStart() у Options?', options:['Проверит настройки при запуске приложения, а не при первом использовании','Отключит валидацию','Перезагрузит конфигурацию','Зашифрует значения'], answer:0, explanation:'Ошибка конфигурации видна сразу.', difficulty:2 },
  { id:'t9-7', type:'single', prompt:'Как получить логгер в сервисе?', options:['Внедрить ILogger<T> через конструктор','Создать new Logger()','Использовать Console.WriteLine','Через статический класс Log'], answer:0, explanation:'Категория лога — имя типа T.', difficulty:1 },
  { id:'t9-8', type:'multiple', prompt:'Что предоставляет Generic Host? (несколько ответов)', options:['DI-контейнер','Конфигурацию','Логирование','HTTP-маршрутизацию без дополнительных пакетов'], answer:[0,1,2], explanation:'Маршрутизацию добавляет ASP.NET Core.', difficulty:2 }
 ]
},
{
 id: 10, title: 'Данные: файлы, JSON, HTTP, EF Core', short: 'System.Text.Json, HttpClient, введение в Entity Framework Core',
 lessons: [
 { id:'10-1', title:'Файлы и потоки', html:`
<pre><code>// простые случаи — всё сразу в память
string text = await File.ReadAllTextAsync("config.txt");
string[] lines = await File.ReadAllLinesAsync("data.csv");
await File.WriteAllTextAsync("out.txt", text);

// большие файлы — построчно, без загрузки целиком
await foreach (var line in File.ReadLinesAsync("big.log"))
    if (line.Contains("ERROR")) errors++;

// пути — только через Path, не склейкой строк
var path = Path.Combine(AppContext.BaseDirectory, "data", "orders.json");
Directory.CreateDirectory(Path.GetDirectoryName(path)!);</code></pre>
<p><b>Stream</b> — абстракция последовательности байт: файл, сетевое соединение, тело HTTP-запроса, память. Один и тот же код работает с любым источником:</p>
<pre><code>async Task&lt;string&gt; ReadAllAsync(Stream s)
{
    using var reader = new StreamReader(s);
    return await reader.ReadToEndAsync();
}
await ReadAllAsync(File.OpenRead("a.txt"));
await ReadAllAsync(httpRequest.Body);       // в ASP.NET</code></pre>
<p class="small">Обёртки над потоками (<code>StreamReader</code>, <code>GZipStream</code>, <code>BufferedStream</code>) — паттерн «Декоратор» из <a href="../oop/#/l/10-2">ООП 10.2</a>.</p>`,
 check: [
  { id:'q10-1a', type:'single', prompt:'Как правильно собрать путь к файлу?', options:['Path.Combine(dir, "data", "file.json")','dir + "/data/file.json"','dir + "\\\\data\\\\file.json"','string.Concat без разделителей'], answer:0, explanation:'Path учитывает разделители ОС.' },
  { id:'q10-1b', type:'single', prompt:'Как обработать лог на 10 ГБ, не загружая его в память целиком?', options:['Читать построчно через File.ReadLinesAsync','File.ReadAllText','File.ReadAllBytes','Увеличить память'], answer:0, explanation:'Построчное чтение держит в памяти одну строку.' }
 ]},
 { id:'10-2', title:'JSON: System.Text.Json', html:`
<pre><code>public record ProductDto(int Id, string Name, decimal Price, string[] Tags);

var options = new JsonSerializerOptions(JsonSerializerDefaults.Web)   // camelCase, без учёта регистра
{
    WriteIndented = true
};

string json = JsonSerializer.Serialize(new ProductDto(1, "Книга", 500m, ["new"]), options);
// { "id": 1, "name": "Книга", "price": 500, "tags": ["new"] }

ProductDto? dto = JsonSerializer.Deserialize&lt;ProductDto&gt;(json, options);</code></pre>
<p>Настройка через атрибуты:</p>
<pre><code>public class User
{
    [JsonPropertyName("user_name")] public string Name { get; set; } = "";
    [JsonIgnore] public string PasswordHash { get; set; } = "";
    [JsonConverter(typeof(JsonStringEnumConverter))] public Role Role { get; set; }
}</code></pre>
<div class="note warn"><b>Не отдавайте наружу доменные сущности.</b> Сериализовав <code>User</code> целиком, легко случайно отправить клиенту хеш пароля или внутренние поля. Для API заводят отдельные DTO-record'ы.</div>
<div class="note why"><b>В ASP.NET</b> сериализация происходит автоматически: вернули объект из эндпойнта — он стал JSON; параметр с <code>[FromBody]</code> — JSON из тела запроса стал объектом. Используются те же <code>JsonSerializerOptions</code> с <code>JsonSerializerDefaults.Web</code>.</div>`,
 check: [
  { id:'q10-2a', type:'single', prompt:'Что делает атрибут [JsonIgnore]?', options:['Исключает свойство из сериализации','Делает свойство обязательным','Переименовывает свойство','Шифрует значение'], answer:0, explanation:'Например, для хеша пароля.' },
  { id:'q10-2b', type:'single', prompt:'Почему API лучше возвращать DTO, а не доменную сущность?', options:['Чтобы контролировать, какие данные уходят клиенту, и не ломать API при изменении модели','DTO сериализуются быстрее','Сущности нельзя сериализовать','Так требует HTTP'], answer:0, explanation:'Отдельный контракт для внешнего мира.' }
 ]},
 { id:'10-3', title:'HttpClient', html:`
<pre><code>// регистрация типизированного клиента
services.AddHttpClient&lt;WeatherClient&gt;(c =&gt;
{
    c.BaseAddress = new Uri("https://api.weather.example/");
    c.Timeout = TimeSpan.FromSeconds(10);
});

public class WeatherClient(HttpClient http)
{
    public async Task&lt;Forecast?&gt; GetAsync(string city, CancellationToken ct)
    {
        using var resp = await http.GetAsync($"forecast?city={Uri.EscapeDataString(city)}", ct);
        if (resp.StatusCode == HttpStatusCode.NotFound) return null;
        resp.EnsureSuccessStatusCode();                           // иначе исключение
        return await resp.Content.ReadFromJsonAsync&lt;Forecast&gt;(ct);
    }

    public Task CreateAsync(Alert a, CancellationToken ct) =&gt;
        http.PostAsJsonAsync("alerts", a, ct);
}</code></pre>
<ul>
<li><code>IHttpClientFactory</code> (через <code>AddHttpClient</code>) правильно переиспользует соединения и следит за DNS.</li>
<li>Всегда задавайте таймаут и передавайте <code>CancellationToken</code>.</li>
<li>Параметры в URL экранируйте: <code>Uri.EscapeDataString</code>.</li>
<li>Для повторов и circuit breaker — пакет <code>Microsoft.Extensions.Http.Resilience</code>: <code>.AddStandardResilienceHandler()</code>.</li>
</ul>
<div class="note">Курс <a href="../network/">«Сети для разработчиков»</a> подробно объясняет, что происходит под капотом каждого такого запроса: DNS, TCP, TLS, HTTP.</div>`,
 check: [
  { id:'q10-3a', type:'single', prompt:'Как правильно получать HttpClient в приложении?', options:['Через IHttpClientFactory / AddHttpClient','new HttpClient() в using на каждый вызов','Статический HttpClient без таймаута в каждом классе','Через WebClient'], answer:0, explanation:'Фабрика управляет пулом соединений.' },
  { id:'q10-3b', type:'single', prompt:'Что делает EnsureSuccessStatusCode()?', options:['Бросает исключение, если код ответа не 2xx','Повторяет запрос','Проверяет SSL-сертификат','Возвращает true/false'], answer:0, explanation:'HttpRequestException с кодом статуса.' }
 ]},
 { id:'10-4', title:'Entity Framework Core: первое знакомство', html:`
<p><b>EF Core</b> — ORM: вы работаете с классами C#, а он генерирует SQL.</p>
<pre><code>$ dotnet add package Microsoft.EntityFrameworkCore.Sqlite
$ dotnet tool install --global dotnet-ef</code></pre>
<pre><code>public class Product
{
    public int Id { get; set; }                       // первичный ключ по соглашению
    public required string Name { get; set; }
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;   // навигационное свойство
}

public class ShopDb(DbContextOptions&lt;ShopDb&gt; options) : DbContext(options)
{
    public DbSet&lt;Product&gt; Products =&gt; Set&lt;Product&gt;();
    public DbSet&lt;Category&gt; Categories =&gt; Set&lt;Category&gt;();
}

services.AddDbContext&lt;ShopDb&gt;(o =&gt; o.UseSqlite("Data Source=shop.db"));   // Scoped</code></pre>
<pre><code>$ dotnet ef migrations add Initial     # C#-описание изменений схемы
$ dotnet ef database update            # применить к БД</code></pre>
<pre><code>// запросы — LINQ к IQueryable (модуль 6)
var cheap = await db.Products
    .Where(p =&gt; p.Price &lt; 1000)
    .Select(p =&gt; new ProductDto(p.Id, p.Name, p.Price, p.Category.Name))
    .ToListAsync(ct);

// изменения — через отслеживание
var p = await db.Products.FindAsync([id], ct);
p!.Price = 900;
db.Products.Add(new Product { Name = "Новинка", Price = 100, CategoryId = 1 });
await db.SaveChangesAsync(ct);         // один SQL-транзакционный пакет</code></pre>
<div class="note why"><b>В ASP.NET</b> DbContext внедряется в сервис или эндпойнт на время запроса. Связка «EF Core + LINQ + DTO + async» — основа большинства CRUD-API, которые вы будете писать.</div>`,
 check: [
  { id:'q10-4a', type:'single', prompt:'Что делает SaveChangesAsync()?', options:['Отправляет в БД все отслеженные изменения','Загружает данные','Создаёт миграцию','Закрывает соединение'], answer:0, explanation:'Добавления, изменения и удаления — одним вызовом.' },
  { id:'q10-4b', type:'single', prompt:'Зачем нужны миграции EF Core?', options:['Версионировать и применять изменения схемы БД','Переносить данные между серверами','Ускорять запросы','Шифровать базу'], answer:0, explanation:'Схема меняется вместе с кодом.' }
 ]}
 ],
 test: [
  { id:'t10-1', type:'single', prompt:'Какой JsonSerializerDefaults использует ASP.NET по умолчанию?', options:['Web: camelCase и нечувствительность к регистру','General','Strict','Никакой'], answer:0, explanation:'Поэтому свойство Name превращается в "name".', difficulty:2 },
  { id:'t10-2', type:'analyze', prompt:'Что не так с кодом?', code:'public async Task<string> GetAsync(string url)\n{\n    using var client = new HttpClient();\n    return await client.GetStringAsync(url);\n}', options:['HttpClient создаётся на каждый вызов — под нагрузкой закончатся сокеты','Нужно .Result вместо await','using нельзя использовать с async','Всё правильно'], answer:0, explanation:'Используйте IHttpClientFactory.', difficulty:2 },
  { id:'t10-3', type:'match', prompt:'Сопоставьте команду и действие.', pairs:[['dotnet ef migrations add X','Создать миграцию'],['dotnet ef database update','Применить миграции'],['dotnet add package','Добавить NuGet-пакет'],['dotnet user-secrets set','Сохранить секрет разработки']], explanation:'Инструменты CLI.', difficulty:1 },
  { id:'t10-4', type:'single', prompt:'Какое время жизни у DbContext, зарегистрированного через AddDbContext?', options:['Scoped','Singleton','Transient','Static'], answer:0, explanation:'Один на запрос.', difficulty:1 },
  { id:'t10-5', type:'single', prompt:'Зачем Select в DTO в запросе EF Core?', options:['Из БД выбираются только нужные столбцы, и наружу уходит безопасный контракт','Чтобы отключить SQL','Чтобы включить отслеживание','Это обязательный синтаксис'], answer:0, explanation:'Меньше данных и никаких лишних полей.', difficulty:2 },
  { id:'t10-6', type:'single', prompt:'Какой метод читает JSON из HTTP-ответа сразу в объект?', options:['ReadFromJsonAsync<T>()','ReadAsStringAsync() + Parse','GetObject<T>()','ToJson()'], answer:0, explanation:'Расширение из System.Net.Http.Json.', difficulty:1 },
  { id:'t10-7', type:'single', prompt:'Что такое ORM?', options:['Инструмент, отображающий таблицы БД на классы и генерирующий SQL','Формат JSON','Веб-сервер','Система логирования'], answer:0, explanation:'Object-Relational Mapping.', difficulty:1 },
  { id:'t10-8', type:'multiple', prompt:'Что стоит делать при вызове внешнего HTTP-API? (несколько ответов)', options:['Задавать таймаут','Передавать CancellationToken','Экранировать параметры URL','Создавать новый HttpClient на каждый запрос'], answer:[0,1,2], explanation:'Последнее — антипаттерн.', difficulty:1 }
 ]
},
{
 id: 11, title: 'Тесты и переход к ASP.NET', short: 'xUnit, моки, структура решения, что учить дальше',
 lessons: [
 { id:'11-1', title:'Модульные тесты на xUnit', html:`
<pre><code>$ dotnet new xunit -o tests/Shop.Tests
$ dotnet add tests/Shop.Tests reference src/Shop.Core
$ dotnet test</code></pre>
<pre><code>public class MoneyTests
{
    [Fact]
    public void Add_SameCurrency_SumsAmounts()
    {
        // Arrange
        var a = new Money(100, "RUB");
        var b = new Money(50, "RUB");
        // Act
        var sum = a.Add(b);
        // Assert
        Assert.Equal(new Money(150, "RUB"), sum);
    }

    [Theory]
    [InlineData(0, 0)]
    [InlineData(10, 9)]
    [InlineData(100, 90)]
    public void Discount_TenPercent(decimal price, decimal expected) =&gt;
        Assert.Equal(expected, Pricing.WithDiscount(price, 10));

    [Fact]
    public void Ship_Unpaid_Throws() =&gt;
        Assert.Throws&lt;InvalidOperationException&gt;(() =&gt; new Order().Ship());
}</code></pre>
<ul>
<li><code>[Fact]</code> — тест без параметров, <code>[Theory]</code> + <code>[InlineData]</code> — один тест на набор данных.</li>
<li>Структура <b>Arrange — Act — Assert</b>.</li>
<li>Имя теста описывает поведение: <code>Метод_Условие_Результат</code>.</li>
<li>Асинхронный тест: <code>public async Task ...</code> с <code>await</code>.</li>
</ul>
<div class="note">Популярные альтернативы: NUnit, MSTest; для читаемых проверок — FluentAssertions или Shouldly: <code>sum.Should().Be(new Money(150, "RUB"))</code>.</div>`,
 check: [
  { id:'q11-1a', type:'single', prompt:'Чем [Theory] отличается от [Fact]?', options:['Theory запускается для нескольких наборов входных данных','Theory не проверяет результат','Fact асинхронный','Ничем'], answer:0, explanation:'Данные — через InlineData, MemberData.' },
  { id:'q11-1b', type:'order', prompt:'Расставьте части теста по порядку.', options:['Arrange — подготовка','Act — действие','Assert — проверка'], answer:[0,1,2], explanation:'AAA.', }
 ]},
 { id:'11-2', title:'Моки и тестируемый дизайн', html:`
<p>Сервис с зависимостями через интерфейсы (модуль 9) легко тестировать: зависимости подменяются.</p>
<pre><code>$ dotnet add package NSubstitute</code></pre>
<pre><code>public class OrderServiceTests
{
    private readonly IOrderRepository _repo = Substitute.For&lt;IOrderRepository&gt;();
    private readonly INotifier _notifier = Substitute.For&lt;INotifier&gt;();
    private readonly OrderService _sut;

    public OrderServiceTests() =&gt; _sut = new OrderService(_repo, _notifier);

    [Fact]
    public async Task Place_SavesAndNotifies()
    {
        var order = new Order(Guid.NewGuid(), "a@b.ru");
        await _sut.PlaceAsync(order, CancellationToken.None);

        await _repo.Received(1).SaveAsync(order, Arg.Any&lt;CancellationToken&gt;());
        await _notifier.Received(1).SendAsync("a@b.ru", Arg.Any&lt;string&gt;());
    }

    [Fact]
    public async Task Get_Missing_ReturnsNull()
    {
        _repo.FindAsync(Arg.Any&lt;Guid&gt;(), default).Returns((Order?)null);
        Assert.Null(await _sut.GetAsync(Guid.NewGuid(), default));
    }
}</code></pre>
<div class="tbl"><table><tr><th>Подмена</th><th>Что делает</th></tr>
<tr><td>Stub</td><td>Возвращает заготовленные ответы</td></tr>
<tr><td>Mock</td><td>Проверяет, что его вызвали нужным образом</td></tr>
<tr><td>Fake</td><td>Упрощённая рабочая реализация: InMemoryRepository</td></tr>
</table></div>
<div class="note why"><b>Время и случайность</b> — тоже зависимости. <code>DateTime.Now</code> внутри метода делает тест нестабильным; в .NET 8 есть абстракция <code>TimeProvider</code>, которую внедряют и подменяют <code>FakeTimeProvider</code>.</div>
<p class="small">Почему так работает: <a href="../oop/#/l/8-4">ООП 8.4 — DIP</a>, <a href="../oop/#/l/6-4">ООП 6.4 — DI</a>.</p>`,
 check: [
  { id:'q11-2a', type:'single', prompt:'Почему сервис с зависимостями-интерфейсами легко тестировать?', options:['В тесте вместо реальных реализаций можно подставить подмены','Интерфейсы выполняются быстрее','Тесты не нужны','Компилятор сам проверит логику'], answer:0, explanation:'Это прямое следствие DIP.' },
  { id:'q11-2b', type:'single', prompt:'Как сделать тестируемым код, зависящий от текущего времени?', options:['Внедрить TimeProvider и подменить его в тесте','Запускать тесты в полночь','Использовать DateTime.Now','Отключить тест'], answer:0, explanation:'Время — внешняя зависимость.' }
 ]},
 { id:'11-3', title:'Структура решения', html:`
<p>Типичное решение, с которого начинается ASP.NET-проект:</p>
<pre><code>Shop.sln
├─ src/
│  ├─ Shop.Domain          классы предметной области, правила (без зависимостей)
│  ├─ Shop.Application     сервисы сценариев, интерфейсы репозиториев, DTO
│  ├─ Shop.Infrastructure  EF Core, HttpClient-ы, почта — реализации интерфейсов
│  └─ Shop.Api             ASP.NET Core: Program.cs, эндпойнты, конфигурация
└─ tests/
   ├─ Shop.Domain.Tests
   └─ Shop.Api.Tests       интеграционные тесты через WebApplicationFactory</code></pre>
<p>Зависимости направлены внутрь: <code>Api → Application → Domain</code>, <code>Infrastructure → Application</code>. Домен не знает ни про EF Core, ни про HTTP. Это «чистая архитектура» — DIP в масштабе проекта.</p>
<div class="note"><b>Не усложняйте раньше времени</b> (YAGNI, <a href="../oop/#/l/9-2">ООП 9.2</a>). Для учебного или небольшого проекта хватит одного проекта Api с папками <code>Domain/</code>, <code>Data/</code>, <code>Endpoints/</code> и одного тестового проекта.</div>
<h3>Полезные настройки для всех проектов</h3>
<pre><code>// Directory.Build.props в корне решения
&lt;Project&gt;
  &lt;PropertyGroup&gt;
    &lt;TargetFramework&gt;net8.0&lt;/TargetFramework&gt;
    &lt;Nullable&gt;enable&lt;/Nullable&gt;
    &lt;ImplicitUsings&gt;enable&lt;/ImplicitUsings&gt;
    &lt;TreatWarningsAsErrors&gt;true&lt;/TreatWarningsAsErrors&gt;
  &lt;/PropertyGroup&gt;
&lt;/Project&gt;</code></pre>
<p>Плюс <code>.editorconfig</code> со стилем кода и <code>dotnet format</code> в CI.</p>`,
 check: [
  { id:'q11-3a', type:'single', prompt:'От каких проектов должен зависеть Shop.Domain?', options:['Ни от каких проектов решения','От Shop.Api','От Shop.Infrastructure','От EF Core'], answer:0, explanation:'Домен — центр, зависимости направлены к нему.' },
  { id:'q11-3b', type:'single', prompt:'Зачем Directory.Build.props?', options:['Общие настройки сборки для всех проектов решения','Хранить пароли','Описывать маршруты API','Запускать тесты'], answer:0, explanation:'Не нужно повторять свойства в каждом .csproj.' }
 ]},
 { id:'11-4', title:'Что дальше: дорожная карта ASP.NET', html:`
<p>Вы знаете язык и инфраструктуру .NET. Вот что изучать в ASP.NET Core и на какие темы курса это опирается:</p>
<div class="tbl"><table><tr><th>Тема ASP.NET Core</th><th>Опирается на</th></tr>
<tr><td>Minimal API и контроллеры, маршрутизация</td><td>Лямбды, атрибуты, async (модули 5, 8)</td></tr>
<tr><td>Привязка моделей и валидация</td><td>Свойства, record, nullable, DataAnnotations (модули 3, 4)</td></tr>
<tr><td>Middleware-конвейер</td><td>Делегаты, async, «Декоратор» (модули 5, 8)</td></tr>
<tr><td>DI, конфигурация, Options, логирование</td><td>Модуль 9 — уже знакомо</td></tr>
<tr><td>EF Core: связи, миграции, транзакции</td><td>LINQ, IQueryable (модули 6, 10)</td></tr>
<tr><td>Обработка ошибок, ProblemDetails</td><td>Исключения (модуль 7)</td></tr>
<tr><td>Аутентификация и авторизация (JWT, cookies, Identity)</td><td>Атрибуты, DI, курс «Информационная безопасность»</td></tr>
<tr><td>Интеграционные тесты WebApplicationFactory</td><td>xUnit, моки (модуль 11)</td></tr>
<tr><td>Фоновые задачи, кэширование, SignalR</td><td>BackgroundService, Singleton, async</td></tr>
<tr><td>Развёртывание: Docker, health checks, OpenTelemetry</td><td>Курс «DevOps»</td></tr>
</table></div>
<h3>Первый проект для практики</h3>
<pre><code>$ dotnet new webapi -n TodoApi
$ cd TodoApi
$ dotnet add package Microsoft.EntityFrameworkCore.Sqlite
$ dotnet run</code></pre>
<ol class="steps">
<li>CRUD для задач: <code>GET/POST/PUT/DELETE /todos</code> с DTO-record'ами.</li>
<li>Хранение в SQLite через EF Core, миграции.</li>
<li>Валидация входных данных, 400 и 404 с ProblemDetails.</li>
<li>Фильтрация и пагинация через LINQ.</li>
<li>Сервисный слой с интерфейсами и xUnit-тесты к нему.</li>
<li>Аутентификация по JWT, у каждого пользователя свои задачи.</li>
<li>Dockerfile и запуск в контейнере.</li>
</ol>
<div class="note"><b>Следующий шаг</b> — <a href="../aspnet/">курс «ASP.NET Core: веб-API на .NET»</a>. Он опирается на этот курс и курс ООП и не повторяет их.</div>
<div class="note why"><b>Ресурсы.</b> Официальная документация learn.microsoft.com/aspnet/core — учебники «Create a minimal API» и «Create a web API with controllers»; книга Эндрю Лока «ASP.NET Core in Action»; исходники ASP.NET Core на GitHub (dotnet/aspnetcore) — отличный пример идиоматичного C#.</div>`,
 check: [
  { id:'q11-4a', type:'single', prompt:'Какой шаблон dotnet new создаёт проект веб-API?', options:['webapi','console','classlib','xunit'], answer:0, explanation:'dotnet new webapi.' },
  { id:'q11-4b', type:'single', prompt:'На какую тему курса опирается middleware-конвейер ASP.NET?', options:['Делегаты и async/await','Только enum','Только struct','Файлы и потоки'], answer:0, explanation:'Middleware — делегат RequestDelegate, вызывающий следующий асинхронно.' }
 ]}
 ],
 test: [
  { id:'t11-1', type:'analyze', prompt:'Какую проблему тестируемости содержит класс?', code:'public class SubscriptionService\n{\n    public bool IsExpired(Subscription s) => s.EndsAt < DateTime.Now;\n    public void Notify(User u) => new SmtpClient("smtp.corp").Send(u.Email, "...");\n}', options:['Жёсткие зависимости от текущего времени и SMTP — их нельзя подменить','Нет проблем','Методы слишком короткие','Нужно больше static'], answer:0, explanation:'Внедрите TimeProvider и INotifier.', difficulty:2 },
  { id:'t11-2', type:'single', prompt:'Какой метод NSubstitute проверяет, что метод мока вызвали один раз?', options:['Received(1)','Verify(Times.Once)','Called()','Assert.Once'], answer:0, explanation:'Verify(Times.Once) — синтаксис Moq.', difficulty:2 },
  { id:'t11-3', type:'single', prompt:'Как называется тестовая подмена — упрощённая рабочая реализация в памяти?', options:['Fake','Mock','Spy','Dummy'], answer:0, explanation:'Например, InMemoryRepository.', difficulty:1 },
  { id:'t11-4', type:'single', prompt:'Что используют для интеграционных тестов ASP.NET-приложения целиком?', options:['WebApplicationFactory','Thread.Sleep','Console.ReadLine','NSubstitute для всех классов'], answer:0, explanation:'Поднимает приложение в памяти с HTTP-клиентом.', difficulty:2 },
  { id:'t11-5', type:'match', prompt:'Сопоставьте слой решения и содержимое.', pairs:[['Domain','Сущности и бизнес-правила'],['Application','Сценарии и интерфейсы репозиториев'],['Infrastructure','EF Core и внешние API'],['Api','Эндпойнты и Program.cs']], explanation:'Слои чистой архитектуры.', difficulty:2 },
  { id:'t11-6', type:'single', prompt:'Как назвать тест, проверяющий исключение при отгрузке неоплаченного заказа?', options:['Ship_Unpaid_Throws','Test1','ShipTest','CheckOrder'], answer:0, explanation:'Метод_Условие_Результат.', difficulty:1 },
  { id:'t11-7', type:'single', prompt:'Что из курса понадобится, чтобы понять builder.Services.AddScoped<IOrderService, OrderService>()?', options:['DI, интерфейсы и методы расширения','Только строки','Только struct','Только LINQ'], answer:0, explanation:'Модули 3, 5 и 9.', difficulty:1 },
  { id:'t11-8', type:'multiple', prompt:'Что стоит включить для всех проектов решения? (несколько ответов)', options:['Nullable','TreatWarningsAsErrors','Единый TargetFramework','Отключение всех анализаторов'], answer:[0,1,2], explanation:'Анализаторы помогают ловить ошибки.', difficulty:1 }
 ]
}
];

const UPCOMING = [];

const GLOSSARY = [
 ['.NET','Платформа: среда выполнения, стандартная библиотека и инструменты для C#.','0-1'],
 ['CLR','Common Language Runtime — среда выполнения .NET: JIT, GC, исключения.','0-1'],
 ['IL','Промежуточный язык, в который компилируется C#.','0-1'],
 ['JIT','Компиляция IL в машинный код во время выполнения.','0-1'],
 ['BCL','Base Class Library — стандартная библиотека .NET.','0-1'],
 ['SDK','Набор для разработки: компилятор, runtime, утилита dotnet.','0-2'],
 ['dotnet CLI','Командная утилита для создания, сборки, запуска и тестирования проектов.','0-2'],
 ['Top-level statements','Код точки входа без явного класса Program и метода Main.','0-3'],
 ['.csproj','Файл проекта MSBuild: целевая платформа, пакеты, ссылки.','0-4'],
 ['Решение (.sln)','Набор связанных проектов.','0-4'],
 ['var','Вывод типа локальной переменной компилятором.','1-1'],
 ['decimal','Десятичный тип с точной арифметикой, для денег.','1-1'],
 ['TryParse','Безопасное преобразование строки без исключения.','1-1'],
 ['Интерполяция строк','Подстановка выражений в строку: $"Итого {sum}".','1-3'],
 ['StringBuilder','Изменяемый буфер для эффективной сборки строк.','1-3'],
 ['switch-выражение','switch, возвращающий значение, с образцами.','1-4'],
 ['ref / out','Передача аргумента по ссылке; out — для выходных значений.','2-2'],
 ['Кортеж','Лёгкая группа значений: (int Min, int Max).','2-2'],
 ['List<T>','Динамический обобщённый список.','2-3'],
 ['Dictionary<K,V>','Хеш-таблица для поиска по ключу.','2-4'],
 ['IEnumerable<T>','Интерфейс перебираемой последовательности.','2-4'],
 ['Авто-свойство','Свойство с автоматически созданным полем: { get; set; }.','3-1'],
 ['init','Аксессор свойства, разрешающий присваивание только при создании.','3-1'],
 ['required','Модификатор: свойство обязательно задать при создании объекта.','3-1'],
 ['Первичный конструктор','Параметры конструктора в заголовке класса (C# 12).','3-2'],
 ['virtual / override','Разрешение и выполнение переопределения метода.','3-3'],
 ['sealed','Запрет наследования класса или переопределения метода.','3-3'],
 ['partial','Разделение класса на несколько файлов.','3-4'],
 ['struct','Значимый тип: копируется при присваивании.','4-1'],
 ['Boxing','Упаковка значимого типа в объект в куче.','4-1'],
 ['record','Тип с равенством по значению, ToString и with.','4-2'],
 ['with','Создание копии record с изменёнными свойствами.','4-2'],
 ['Nullable reference types','Анализ null-безопасности: string и string? различаются.','4-3'],
 ['Pattern matching','Проверка типа и формы данных в выражениях is и switch.','4-4'],
 ['where','Ограничение параметра типа обобщения.','5-1'],
 ['Делегат','Тип-ссылка на метод.','5-2'],
 ['Func / Action','Стандартные делегаты с результатом и без.','5-2'],
 ['Лямбда','Анонимная функция: x => x * 2.','5-2'],
 ['Замыкание','Лямбда, захватившая переменные окружения.','5-2'],
 ['event','Член класса для подписки на уведомления.','5-3'],
 ['Метод расширения','Статический метод, вызываемый как метод экземпляра чужого типа.','5-4'],
 ['LINQ','Встроенный язык запросов к последовательностям.','6-1'],
 ['Отложенное выполнение','Запрос LINQ вычисляется при переборе, а не при объявлении.','6-3'],
 ['yield return','Создание ленивой последовательности в методе-итераторе.','6-3'],
 ['IQueryable<T>','Запрос, который переводится в SQL или другой язык источника.','6-4'],
 ['Фильтр исключений','catch (X ex) when (условие).','7-1'],
 ['IDisposable','Интерфейс детерминированного освобождения ресурсов.','7-3'],
 ['using','Конструкция, гарантирующая вызов Dispose.','7-3'],
 ['Поколения GC','Gen0/1/2: молодые объекты собираются чаще старых.','7-4'],
 ['Task','Представление асинхронной операции и её результата.','8-1'],
 ['async / await','Ключевые слова для написания асинхронного кода последовательно.','8-2'],
 ['Task.WhenAll','Ожидание завершения нескольких задач одновременно.','8-2'],
 ['CancellationToken','Токен кооперативной отмены операции.','8-3'],
 ['ConcurrentDictionary','Потокобезопасный словарь.','8-4'],
 ['DI-контейнер','Объект, создающий сервисы и подставляющий их зависимости.','9-1'],
 ['Singleton / Scoped / Transient','Времена жизни сервисов в DI.','9-2'],
 ['Захваченная зависимость','Долгоживущий сервис удерживает короткоживущий.','9-2'],
 ['IConfiguration','Объединённая конфигурация из JSON, окружения и аргументов.','9-3'],
 ['IOptions<T>','Типизированный доступ к секции конфигурации.','9-3'],
 ['User Secrets','Хранилище секретов разработки вне репозитория.','9-3'],
 ['ILogger<T>','Интерфейс структурного логирования.','9-4'],
 ['Generic Host','Хост приложения: DI, конфигурация, логирование, жизненный цикл.','9-4'],
 ['BackgroundService','Базовый класс долгоживущей фоновой задачи.','9-4'],
 ['Stream','Абстракция последовательности байт.','10-1'],
 ['System.Text.Json','Встроенная библиотека сериализации JSON.','10-2'],
 ['DTO','Data Transfer Object — объект для передачи данных через границу API.','10-2'],
 ['IHttpClientFactory','Фабрика HttpClient с правильным управлением соединениями.','10-3'],
 ['EF Core','ORM от Microsoft для работы с БД через классы и LINQ.','10-4'],
 ['DbContext','Сеанс работы с БД в EF Core.','10-4'],
 ['Миграция','Описание изменения схемы БД в коде.','10-4'],
 ['xUnit','Популярный фреймворк модульных тестов для .NET.','11-1'],
 ['Мок','Тестовая подмена, проверяющая вызовы.','11-2'],
 ['TimeProvider','Абстракция времени для тестируемого кода.','11-2'],
 ['WebApplicationFactory','Инструмент интеграционных тестов ASP.NET Core.','11-3'],
 ['ASP.NET Core','Фреймворк для веб-приложений и API на .NET.','11-4']
];
