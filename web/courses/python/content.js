// Контент курса: модули, уроки, вопросы, глоссарий.
// ====== КОНТЕНТ КУРСА ======
// Типы вопросов: single | multiple | order | match | input | analyze
export const MODULES = [
{
 id: 0, title: 'Знакомство с Python', short: 'Где применяется, интерпретатор, окружения, пакеты, стиль кода',
 lessons: [
 { id:'0-1', title:'Что такое Python', html:`
<p><b>Python</b> — язык с динамической типизацией и очень читаемым синтаксисом. Блоки кода выделяются отступами, а не фигурными скобками, поэтому программы на Python выглядят почти как псевдокод.</p>
<pre><code>def greet(name):
    if name:
        return f"Привет, {name}!"
    return "Привет, гость!"

print(greet("Анна"))</code></pre>
<p>Где применяется:</p>
<div class="tbl"><table><tr><th>Область</th><th>Инструменты</th></tr>
<tr><td>Веб-бэкенд</td><td>Django, FastAPI, Flask</td></tr>
<tr><td>Данные и аналитика</td><td>NumPy, pandas, Jupyter, matplotlib</td></tr>
<tr><td>Машинное обучение и ИИ</td><td>scikit-learn, PyTorch, Hugging Face, SDK языковых моделей</td></tr>
<tr><td>Автоматизация и DevOps</td><td>Скрипты, Ansible, CLI-утилиты</td></tr>
<tr><td>Наука и образование</td><td>SciPy, SymPy, учебные курсы во многих вузах</td></tr>
</table></div>
<div class="note"><b>Курс опирается на курс ООП.</b> Классы, инкапсуляция, наследование, полиморфизм, интерфейсы, SOLID и паттерны подробно разобраны в <a href="../oop/">курсе «Объектно-ориентированное программирование»</a>. Здесь мы не объясняем их заново, а показываем, как они устроены в Python; в уроках есть ссылки на нужные разделы.</div>
<div class="note why"><b>Куда дальше.</b> Курс заканчивается двумя дорожками: веб на <b>Django</b> и <b>данные/ИИ</b>. Всё, что для них нужно из самого языка — декораторы, классы, контекстные менеджеры, пакеты, типизация, асинхронность, NumPy и pandas, — разобрано здесь.</div>`,
 check: [
  { id:'q0-1a', type:'single', prompt:'Чем в Python выделяются блоки кода?', options:['Отступами','Фигурными скобками','Ключевыми словами begin/end','Точкой с запятой'], answer:0, explanation:'Отступ — часть синтаксиса; принято 4 пробела.' },
  { id:'q0-1b', type:'multiple', prompt:'Где Python — один из главных языков? (несколько ответов)', options:['Машинное обучение','Анализ данных','Веб-бэкенд','Драйверы ядра ОС'], answer:[0,1,2], explanation:'Драйверы пишут на C и Rust.' }
 ]},
 { id:'0-2', title:'Интерпретатор и запуск кода', html:`
<p>Python — интерпретируемый язык. Эталонная реализация <b>CPython</b> компилирует исходник в байткод (<code>.pyc</code>) и выполняет его в виртуальной машине построчно — без отдельного шага сборки.</p>
<pre><code>$ python --version          # Windows: py --version
Python 3.13.1
$ python hello.py           # запустить файл
$ python                    # интерактивная консоль (REPL)
&gt;&gt;&gt; 2 ** 100
1267650600228229401496703205376
&gt;&gt;&gt; help(str.split)        # справка по любому объекту
&gt;&gt;&gt; exit()
$ python -m http.server     # запустить модуль стандартной библиотеки как программу</code></pre>
<div class="tbl"><table><tr><th>Способ</th><th>Для чего</th></tr>
<tr><td>REPL / IPython</td><td>Быстро проверить выражение, поисследовать объект</td></tr>
<tr><td>Скрипт <code>.py</code></td><td>Программы и утилиты</td></tr>
<tr><td>Jupyter Notebook</td><td>Анализ данных и эксперименты: код, результаты и графики в одном документе (модуль 10)</td></tr>
<tr><td>IDE</td><td>VS Code с расширением Python или PyCharm: отладчик, автодополнение, тесты</td></tr>
</table></div>
<div class="note"><b>Версии.</b> Используйте Python 3 актуальной версии (3.12+). Python 2 не поддерживается с 2020 года. Новая минорная версия выходит каждый октябрь.</div>
<div class="note why"><b>Цена удобства.</b> Интерпретируемый Python медленнее компилируемых языков в чистых вычислениях. На практике тяжёлую работу делают библиотеки на C/C++/Rust (NumPy, PyTorch), а Python «склеивает» их — поэтому он и стал языком ИИ.</div>`,
 check: [
  { id:'q0-2a', type:'single', prompt:'Как называется эталонная реализация Python?', options:['CPython','Jython','PyPy','IronPython'], answer:0, explanation:'Остальные — альтернативные реализации.' },
  { id:'q0-2b', type:'single', prompt:'Почему Python быстр в машинном обучении, хотя сам интерпретатор медленный?', options:['Тяжёлые вычисления выполняют библиотеки на C/C++/CUDA, а Python их вызывает','Python компилируется в машинный код заранее','В ML не нужны вычисления','Python использует видеокарту для любого кода'], answer:0, explanation:'NumPy, PyTorch — «быстрое ядро + удобная обёртка».' }
 ]},
 { id:'0-3', title:'Виртуальные окружения и пакеты', html:`
<p>У каждого проекта свои зависимости и их версии. Чтобы они не конфликтовали, проект живёт в <b>виртуальном окружении</b> — отдельной папке со своим интерпретатором и пакетами.</p>
<pre><code>$ python -m venv .venv                 # создать окружение
$ source .venv/bin/activate            # Linux/macOS
&gt; .venv\\Scripts\\activate               # Windows
(.venv) $ pip install requests         # пакет из PyPI
(.venv) $ pip freeze &gt; requirements.txt
(.venv) $ pip install -r requirements.txt
(.venv) $ deactivate</code></pre>
<p><b>PyPI</b> — центральный репозиторий пакетов (более полумиллиона проектов). Современный стандарт описания проекта — <code>pyproject.toml</code> (модуль 6).</p>
<h3>uv — быстрый менеджер проектов</h3>
<pre><code>$ uv init shop &amp;&amp; cd shop        # проект с pyproject.toml
$ uv add httpx pydantic          # зависимости + lock-файл uv.lock
$ uv add --dev pytest ruff
$ uv run python main.py          # запуск в окружении проекта (создаётся само)</code></pre>
<div class="tbl"><table><tr><th>Инструмент</th><th>Когда</th></tr>
<tr><td><code>venv</code> + <code>pip</code></td><td>Встроены в Python, работают везде</td></tr>
<tr><td><code>uv</code></td><td>Быстрый, управляет версиями Python и lock-файлом — хороший выбор для новых проектов</td></tr>
<tr><td>Poetry</td><td>Популярен в существующих проектах</td></tr>
<tr><td>conda</td><td>Data science: умеет ставить не-Python зависимости (CUDA, системные библиотеки)</td></tr>
</table></div>
<div class="note warn"><b>Не ставьте пакеты в системный Python</b> через <code>sudo pip install</code> — можно сломать утилиты ОС. Папку <code>.venv</code> добавьте в <code>.gitignore</code>.</div>`,
 check: [
  { id:'q0-3a', type:'single', prompt:'Зачем нужно виртуальное окружение?', options:['Изолировать зависимости проекта от других проектов и системы','Ускорить Python','Запускать Python в браузере','Шифровать код'], answer:0, explanation:'У каждого проекта — свои версии пакетов.' },
  { id:'q0-3b', type:'single', prompt:'Какая команда создаёт окружение встроенными средствами?', options:['python -m venv .venv','pip create env','python --new-env','venv install'], answer:0, explanation:'Модуль venv входит в стандартную библиотеку.' }
 ]},
 { id:'0-4', title:'Стиль кода: PEP 8 и инструменты', html:`
<p><b>PEP 8</b> — официальное руководство по стилю. Сообщество Python очень ценит единообразие: «код читают чаще, чем пишут».</p>
<div class="tbl"><table><tr><th>Что</th><th>Как</th><th>Пример</th></tr>
<tr><td>Переменные, функции, модули</td><td>snake_case</td><td><code>total_price</code>, <code>load_orders()</code></td></tr>
<tr><td>Классы</td><td>PascalCase</td><td><code>OrderService</code></td></tr>
<tr><td>Константы</td><td>UPPER_CASE</td><td><code>MAX_RETRIES = 3</code></td></tr>
<tr><td>«Внутреннее»</td><td>Префикс <code>_</code></td><td><code>_cache</code></td></tr>
<tr><td>Отступ</td><td>4 пробела</td><td></td></tr>
<tr><td>Длина строки</td><td>79–100 символов (договорённость команды)</td><td></td></tr>
</table></div>
<p>Руками стиль никто не поддерживает — для этого есть инструменты:</p>
<pre><code>$ ruff check .          # линтер: ошибки, неиспользуемые импорты, подозрительный код
$ ruff check --fix .    # исправить автоматически
$ ruff format .         # форматтер (совместим с black)</code></pre>
<h3>Дзен Python</h3>
<pre><code>&gt;&gt;&gt; import this
Beautiful is better than ugly.
Explicit is better than implicit.
Simple is better than complex.
...
There should be one-- and preferably only one --obvious way to do it.</code></pre>
<div class="note why"><b>«Pythonic»</b> — код, написанный в духе языка: простой, явный, использующий встроенные возможности (comprehensions, распаковку, контекстные менеджеры), а не перенесённые из Java конструкции. Сравнение стилей разных языков — в <a href="../oop/#/l/11-3">ООП 11.3</a>.</div>`,
 check: [
  { id:'q0-4a', type:'single', prompt:'Как по PEP 8 называть функцию, которая считает итоговую цену?', options:['calculate_total','CalculateTotal','calculateTotal','CALCULATE_TOTAL'], answer:0, explanation:'Функции и переменные — snake_case.' },
  { id:'q0-4b', type:'single', prompt:'Что делает ruff format?', options:['Автоматически форматирует код по единому стилю','Удаляет файлы','Компилирует проект','Запускает тесты'], answer:0, explanation:'ruff check — линтер, ruff format — форматтер.' }
 ]}
 ],
 test: [
  { id:'t0-1', type:'match', prompt:'Сопоставьте сущность и стиль имени по PEP 8.', pairs:[['Класс','PascalCase'],['Функция','snake_case'],['Константа','UPPER_CASE'],['Внутренний атрибут','_prefix']], explanation:'Основные соглашения.', difficulty:1 },
  { id:'t0-2', type:'order', prompt:'Расставьте шаги начала проекта по порядку.', options:['Создать окружение python -m venv .venv','Активировать окружение','Установить зависимости pip install','Запустить python main.py'], answer:[0,1,2,3], explanation:'Сначала окружение, потом пакеты.', difficulty:1 },
  { id:'t0-3', type:'single', prompt:'Что такое PyPI?', options:['Центральный репозиторий пакетов Python','Интерпретатор Python','Стандарт стиля кода','IDE'], answer:0, explanation:'Python Package Index.', difficulty:1 },
  { id:'t0-4', type:'single', prompt:'Что выполняет python -m json.tool data.json?', options:['Запускает модуль стандартной библиотеки json.tool как программу','Устанавливает пакет json','Компилирует data.json','Ошибка: -m не существует'], answer:0, explanation:'-m запускает модуль как скрипт; json.tool форматирует JSON.', difficulty:2 },
  { id:'t0-5', type:'single', prompt:'Какой инструмент удобнее всего для разведочного анализа данных с графиками?', options:['Jupyter Notebook','Обычный .py-скрипт без вывода','Только REPL','Блокнот Windows'], answer:0, explanation:'Код, результаты и графики в одном документе.', difficulty:1 },
  { id:'t0-6', type:'single', prompt:'Почему не стоит делать sudo pip install в системный Python?', options:['Можно сломать системные утилиты, зависящие от определённых версий пакетов','Это медленно','pip не работает с sudo','Пакеты удалятся после перезагрузки'], answer:0, explanation:'Используйте виртуальные окружения.', difficulty:1 },
  { id:'t0-7', type:'multiple', prompt:'Что из этого — менеджеры зависимостей/окружений Python? (несколько ответов)', options:['uv','Poetry','conda','npm'], answer:[0,1,2], explanation:'npm — для JavaScript.', difficulty:1 },
  { id:'t0-8', type:'single', prompt:'Что делает CPython с исходником перед выполнением?', options:['Компилирует в байткод для своей виртуальной машины','Компилирует в машинный код и создаёт .exe','Переводит в Java','Ничего — читает текст посимвольно при каждом шаге'], answer:0, explanation:'Байткод кэшируется в __pycache__/*.pyc.', difficulty:2 }
 ]
},
{
 id: 1, title: 'Основы синтаксиса', short: 'Переменные и типы, числа, строки, f-строки, None, ветвления, циклы',
 lessons: [
 { id:'1-1', title:'Переменные и динамическая типизация', html:`
<p>Переменная в Python — это <b>имя, привязанное к объекту</b>. Тип есть у объекта, а не у имени, поэтому одно имя может указывать на объекты разных типов.</p>
<pre><code>count = 10            # int
price = 19.99         # float
name = "Анна"         # str
is_active = True      # bool
nothing = None        # «нет значения»

count = "десять"      # можно: имя теперь указывает на строку
type(count)           # &lt;class 'str'&gt;
isinstance(price, float)   # True

a, b = 1, 2           # множественное присваивание
a, b = b, a           # обмен без временной переменной</code></pre>
<div class="tbl"><table><tr><th>Тип</th><th>Пример</th><th>Особенности</th></tr>
<tr><td><code>int</code></td><td><code>10</code>, <code>1_000_000</code></td><td>Произвольная точность — переполнения нет</td></tr>
<tr><td><code>float</code></td><td><code>3.14</code>, <code>1e-3</code></td><td>Двоичная дробь: <code>0.1 + 0.2 != 0.3</code></td></tr>
<tr><td><code>decimal.Decimal</code></td><td><code>Decimal("19.99")</code></td><td>Точная десятичная — для денег</td></tr>
<tr><td><code>bool</code></td><td><code>True</code>, <code>False</code></td><td>Подтип int</td></tr>
<tr><td><code>str</code></td><td><code>"текст"</code></td><td>Неизменяемая строка Unicode</td></tr>
<tr><td><code>NoneType</code></td><td><code>None</code></td><td>Единственное значение «ничего»</td></tr>
</table></div>
<p class="small">Почему присваивание не копирует объект — ссылки, <a href="../oop/#/l/7-1">ООП 7.1</a>. В Python всё — ссылки.</p>
<div class="note"><b>Динамическая, но строгая.</b> Python не превращает типы молча: <code>"5" + 3</code> — ошибка <code>TypeError</code>, а не <code>"53"</code>, как в JavaScript. Нужно явно: <code>int("5") + 3</code>.</div>`,
 check: [
  { id:'q1-1a', type:'single', prompt:'Что произойдёт при выполнении "5" + 3?', options:['TypeError','"53"','8','None'], answer:0, explanation:'Python строго типизирован, приведения нужно делать явно.' },
  { id:'q1-1b', type:'single', prompt:'Чему равно 2 ** 64 в Python?', options:['18446744073709551616 — int не переполняется','Переполнение, отрицательное число','OverflowError','Бесконечность'], answer:0, explanation:'int имеет произвольную точность.' }
 ]},
 { id:'1-2', title:'Числа и операторы', html:`
<pre><code>7 / 2      # 3.5   — обычное деление всегда даёт float
7 // 2     # 3     — целочисленное деление (округление вниз)
-7 // 2    # -4    — именно вниз, а не к нулю!
7 % 2      # 1     — остаток
2 ** 10    # 1024  — степень
abs(-5), round(2.675, 2), max(3, 9), min(3, 9)

x = 5
x += 1             # x++ в Python нет
0 &lt; x &lt; 10        # цепочка сравнений: True

from decimal import Decimal
Decimal("0.1") + Decimal("0.2") == Decimal("0.3")   # True</code></pre>
<h3>Логические операторы</h3>
<pre><code>age &gt;= 18 and has_ticket
is_admin or is_owner
not is_blocked

name = user_input or "Гость"     # or возвращает первый «истинный» операнд</code></pre>
<p><b>Ложными</b> считаются: <code>False</code>, <code>None</code>, <code>0</code>, <code>0.0</code>, <code>""</code>, пустые коллекции <code>[]</code>, <code>{}</code>, <code>set()</code>. Всё остальное — истинно.</p>
<pre><code>if items:            # вместо if len(items) &gt; 0
    process(items)</code></pre>
<h3>is и ==</h3>
<pre><code>a == b      # равны ли значения (__eq__)
a is b      # один ли это объект
x is None   # с None сравнивают только через is</code></pre>
<p class="small">Идентичность и равенство — <a href="../oop/#/l/7-2">ООП 7.2</a>.</p>`,
 check: [
  { id:'q1-2a', type:'input', prompt:'Чему равно 17 // 5? Введите число.', answer:['3'], explanation:'Целочисленное деление.' },
  { id:'q1-2b', type:'single', prompt:'Как правильно проверить переменную на None?', options:['x is None','x == None','x.isNone()','None(x)'], answer:0, explanation:'None — единственный объект, проверка идентичности надёжнее.' }
 ]},
 { id:'1-3', title:'Строки и f-строки', html:`
<p>Строки неизменяемы; все методы возвращают новую строку.</p>
<pre><code>s = "  Hello, World  "
s.strip()               # "Hello, World"
s.lower(), s.upper()
s.replace("World", "Python")
"a,b,c".split(",")      # ['a', 'b', 'c']
", ".join(["a", "b"])   # "a, b"
s.startswith("  He"), "World" in s
len(s)

word = "Python"
word[0], word[-1]       # 'P', 'n'
word[1:4]               # 'yth' — срез [start:stop)
word[::-1]              # 'nohtyP' — разворот</code></pre>
<div data-widget="slice"></div>
<h3>f-строки</h3>
<pre><code>name, total = "Анна", 1234.5
f"Привет, {name}!"                 # подстановка
f"Итого: {total:,.2f} ₽"           # 'Итого: 1,234.50 ₽'
f"{0.256:.1%}"                     # '25.6%'
f"{name!r}"                        # "'Анна'" — repr
f"{total=}"                        # 'total=1234.5' — удобно для отладки
f"{'да' if total &gt; 1000 else 'нет'}"</code></pre>
<p>Многострочные строки — в тройных кавычках <code>"""..."""</code>. «Сырые» строки <code>r"C:\\temp"</code> не обрабатывают обратную косую черту — удобно для путей Windows и регулярных выражений.</p>
<div class="note"><b>Строки и байты.</b> <code>str</code> — текст в Unicode, <code>bytes</code> — сырые байты. Перевод: <code>"текст".encode("utf-8")</code> и <code>b"...".decode("utf-8")</code>. Читая файлы и сеть, всегда указывайте кодировку (модуль 7).</div>`,
 check: [
  { id:'q1-3a', type:'input', prompt:'Что вернёт "Python"[1:3]? Введите результат без кавычек.', answer:['yt'], explanation:'Индексы 1 и 2; stop не включается.' },
  { id:'q1-3b', type:'single', prompt:'Как вывести число 0.4567 как процент с одним знаком: 45.7%?', options:['f"{0.4567:.1%}"','f"{0.4567:%1}"','f"{0.4567*100}%"','format("%", 0.4567)'], answer:0, explanation:'Спецификатор % умножает на 100.' }
 ]},
 { id:'1-4', title:'Ветвления и циклы', html:`
<pre><code>if stock == 0:
    status = "Нет в наличии"
elif stock &lt; 5:
    status = "Осталось мало"
else:
    status = "В наличии"

label = "товар" if count == 1 else "товаров"    # условное выражение</code></pre>
<h3>match (Python 3.10+)</h3>
<pre><code>match command.split():
    case ["go", direction]:
        move(direction)
    case ["take", *items]:
        take(items)
    case ["quit" | "exit"]:
        stop()
    case _:
        print("Не понял")</code></pre>
<p><code>match</code> — сопоставление с образцом: проверяет форму данных и сразу распаковывает их. Особенно удобен для разбора JSON и команд.</p>
<h3>Циклы</h3>
<pre><code>for item in cart:                       # по любой коллекции
    print(item)

for i in range(5):            # 0, 1, 2, 3, 4
for i in range(2, 10, 2):     # 2, 4, 6, 8

for i, item in enumerate(cart, start=1):   # индекс и элемент
    print(i, item)

for name, price in zip(names, prices):      # параллельный обход
    print(name, price)

while queue:
    task = queue.pop()

for n in numbers:
    if n &lt; 0:
        break
else:                       # выполнится, если цикл не прерван break
    print("все неотрицательные")</code></pre>
<div class="note why"><b>Pythonic.</b> Не пишите <code>for i in range(len(items)): items[i]</code> — перебирайте элементы напрямую, а индекс берите через <code>enumerate</code>.</div>`,
 check: [
  { id:'q1-4a', type:'single', prompt:'Как перебрать список с индексами по-питоновски?', options:['for i, x in enumerate(items)','for i in range(len(items))','items.forEach(...)','for (i = 0; i < len; i++)'], answer:0, explanation:'enumerate возвращает пары (индекс, элемент).' },
  { id:'q1-4b', type:'input', prompt:'Сколько чисел выдаст range(1, 10, 3)? Введите число.', answer:['3'], explanation:'1, 4, 7.' }
 ]}
 ],
 test: [
  { id:'t1-1', type:'analyze', prompt:'Что выведет код?', code:'x = 0\nfor n in [3, -1, 4]:\n    if n < 0:\n        continue\n    x += n\nprint(x)', options:['7','6','3','8'], answer:0, explanation:'3 + 4; -1 пропущено.', difficulty:1 },
  { id:'t1-2', type:'single', prompt:'Что выведет print(bool([]), bool("0"))?', options:['False True','True False','False False','True True'], answer:0, explanation:'Пустой список ложен, непустая строка "0" истинна.', difficulty:2 },
  { id:'t1-3', type:'input', prompt:'Чему равно -7 // 2? Введите число.', answer:['-4'], explanation:'Округление вниз, к минус бесконечности.', difficulty:2 },
  { id:'t1-4', type:'match', prompt:'Сопоставьте выражение и результат.', pairs:[['7 / 2','3.5'],['7 // 2','3'],['7 % 2','1'],['2 ** 3','8']], explanation:'Арифметические операторы.', difficulty:1 },
  { id:'t1-5', type:'single', prompt:'Что вернёт выражение "" or "Гость"?', options:['"Гость"','""','True','None'], answer:0, explanation:'or возвращает первый истинный операнд.', difficulty:1 },
  { id:'t1-6', type:'analyze', prompt:'Когда выполнится блок else?', code:'for user in users:\n    if user.is_admin:\n        print("найден админ")\n        break\nelse:\n    print("админов нет")', options:['Если цикл завершился без break','Всегда','Если users пуст — и только тогда','Никогда'], answer:0, explanation:'else у цикла — «не было break».', difficulty:2 },
  { id:'t1-7', type:'single', prompt:'Как точно сложить денежные суммы 0.1 и 0.2?', options:['Decimal("0.1") + Decimal("0.2")','0.1 + 0.2','float("0.3")','round(0.1 + 0.2)'], answer:0, explanation:'Decimal из строки хранит десятичную дробь точно.', difficulty:2 },
  { id:'t1-8', type:'multiple', prompt:'Какие значения ложны в Python? (несколько ответов)', options:['0','None','""','"False"'], answer:[0,1,2], explanation:'Строка "False" непустая — истинна.', difficulty:1 }
 ]
},
{
 id: 2, title: 'Коллекции', short: 'list, tuple, dict, set, срезы, распаковка, comprehensions',
 lessons: [
 { id:'2-1', title:'Списки и кортежи', html:`
<pre><code>cart = ["хлеб", "молоко"]
cart.append("сыр")           # в конец
cart.insert(0, "вода")
cart.extend(["чай", "кофе"])
cart.remove("молоко")        # по значению
last = cart.pop()            # снять последний
cart.sort()                  # на месте
sorted(cart, key=len, reverse=True)   # новый список
len(cart), "сыр" in cart, cart.index("чай")
cart[1:3], cart[-1]</code></pre>
<p><b>Кортеж</b> (<code>tuple</code>) — неизменяемая последовательность. Используют для записей фиксированной структуры и как ключи словаря.</p>
<pre><code>point = (3, 4)
x, y = point                 # распаковка
first, *rest = [1, 2, 3, 4]  # first = 1, rest = [2, 3, 4]
def min_max(xs): return min(xs), max(xs)    # «несколько значений» — это кортеж

from collections import namedtuple
Point = namedtuple("Point", "x y")
Point(3, 4).x</code></pre>
<div class="tbl"><table><tr><th></th><th>list</th><th>tuple</th></tr>
<tr><td>Изменяемость</td><td>Да</td><td>Нет</td></tr>
<tr><td>Ключ словаря</td><td>Нельзя</td><td>Можно (если элементы хешируемы)</td></tr>
<tr><td>Смысл</td><td>Однородная коллекция переменной длины</td><td>Запись: позиция имеет значение</td></tr>
</table></div>`,
 check: [
  { id:'q2-1a', type:'single', prompt:'Чем sorted(xs) отличается от xs.sort()?', options:['sorted возвращает новый список, sort меняет исходный и возвращает None','Ничем','sort работает только с числами','sorted медленнее в 10 раз'], answer:0, explanation:'Частая ошибка: xs = xs.sort() даст None.' },
  { id:'q2-1b', type:'analyze', prompt:'Чему равны a и rest?', code:'a, *rest = (10, 20, 30)', options:['a = 10, rest = [20, 30]','a = 10, rest = (20, 30)','Ошибка','a = (10,), rest = 20'], answer:0, explanation:'Звёздочка собирает остаток в список.' }
 ]},
 { id:'2-2', title:'Словари и множества', html:`
<pre><code>prices = {"хлеб": 50, "сыр": 400}
prices["молоко"] = 90          # добавить / заменить
prices["сыр"]                  # KeyError, если ключа нет
prices.get("кофе")             # None
prices.get("кофе", 0)          # 0 — значение по умолчанию
"хлеб" in prices               # проверка ключа
del prices["хлеб"]
prices.setdefault("чай", 120)

for name, price in prices.items():
    print(name, price)
list(prices.keys()), list(prices.values())

merged = defaults | overrides  # объединение (3.9+): правый побеждает</code></pre>
<p>Словари сохраняют порядок вставки. Ключ должен быть <b>хешируемым</b>: str, int, tuple — да; list, dict — нет (<a href="../oop/#/l/7-2">ООП 7.2</a> — почему изменяемый ключ ломает хеш-таблицу).</p>
<h3>Множества</h3>
<pre><code>tags = {"python", "web", "python"}   # {'python', 'web'} — дубликаты исчезли
tags.add("ai")
"web" in tags                         # O(1)
a | b, a &amp; b, a - b, a ^ b            # объединение, пересечение, разность, симм. разность
unique = list(set(items))             # убрать дубликаты (порядок не сохраняется)
unique_ordered = list(dict.fromkeys(items))   # с сохранением порядка</code></pre>
<div class="note why"><b>В Django и ИИ</b> словари — основной формат данных: JSON-ответы, параметры моделей, настройки, контекст шаблона. Уверенная работа с dict — обязательный навык.</div>`,
 check: [
  { id:'q2-2a', type:'single', prompt:'Как безопасно прочитать ключ, которого может не быть?', options:['d.get("key", default)','d["key"]','d.key','d.read("key")'], answer:0, explanation:'d["key"] бросит KeyError.' },
  { id:'q2-2b', type:'single', prompt:'Почему список нельзя использовать как ключ словаря?', options:['Он изменяемый и не хешируется','Он слишком большой','Ключи могут быть только строками','Можно, ограничений нет'], answer:0, explanation:'Кортеж из неизменяемых элементов — можно.' }
 ]},
 { id:'2-3', title:'Comprehensions', html:`
<p>Comprehension — короткая запись «построить коллекцию из другой»:</p>
<pre><code># список
squares = [x * x for x in range(10)]
evens = [x for x in numbers if x % 2 == 0]
names = [u.name.title() for u in users if u.is_active]

# словарь
price_by_id = {p.id: p.price for p in products}
inverted = {v: k for k, v in mapping.items()}

# множество
domains = {email.split("@")[1] for email in emails}

# генераторное выражение — без построения списка в памяти (модуль 5)
total = sum(p.price for p in cart)

# вложенный цикл: читается слева направо, как обычные for
pairs = [(x, y) for x in range(3) for y in range(3) if x != y]</code></pre>
<div data-widget="comprehension"></div>
<div class="note warn"><b>Не злоупотребляйте.</b> Если comprehension не помещается в одну-две строки или в нём два уровня условий — напишите обычный цикл. Читаемость важнее краткости.</div>
<div class="note why"><b>Связь с другими языками.</b> Это то же, что <code>filter/map</code> в функциональном стиле или LINQ <code>Where/Select</code> в C#.</div>`,
 check: [
  { id:'q2-3a', type:'single', prompt:'Что создаст {n: n * n for n in range(3)}?', options:['{0: 0, 1: 1, 2: 4}','[0, 1, 4]','{0, 1, 4}','Ошибку'], answer:0, explanation:'Словарь: ключ n, значение n*n.' },
  { id:'q2-3b', type:'single', prompt:'Почему sum(x for x in data) лучше, чем sum([x for x in data]) для огромных данных?', options:['Генератор не строит промежуточный список в памяти','Он короче на две скобки — и всё','Квадратные скобки запрещены в sum','Нет разницы'], answer:0, explanation:'Элементы вычисляются по одному.' }
 ]},
 { id:'2-4', title:'Изменяемость и копирование', html:`
<p>Самый частый источник багов у новичков — изменяемые объекты, на которые смотрят несколько имён.</p>
<pre><code>a = [1, 2, 3]
b = a           # то же самое имя для того же списка
b.append(4)
print(a)        # [1, 2, 3, 4]

c = a.copy()    # или a[:], list(a) — поверхностная копия
import copy
d = copy.deepcopy(nested)   # глубокая копия вложенных структур</code></pre>
<div data-widget="refs"></div>
<h3>Ловушка: изменяемое значение по умолчанию</h3>
<pre><code>def add_item(item, cart=[]):     # список создаётся ОДИН раз при определении функции
    cart.append(item)
    return cart

add_item("хлеб")    # ['хлеб']
add_item("сыр")     # ['хлеб', 'сыр'] — сюрприз!

def add_item(item, cart=None):   # правильно
    if cart is None:
        cart = []
    cart.append(item)
    return cart</code></pre>
<div class="tbl"><table><tr><th>Неизменяемые</th><th>Изменяемые</th></tr>
<tr><td>int, float, str, bool, None, tuple, frozenset, bytes</td><td>list, dict, set, bytearray, большинство пользовательских объектов</td></tr>
</table></div>
<p class="small">Поверхностные и глубокие копии в разных языках — <a href="../oop/#/l/7-3">ООП 7.3</a>.</p>`,
 check: [
  { id:'q2-4a', type:'analyze', prompt:'Что выведет код?', code:'def f(x=[]):\n    x.append(1)\n    return len(x)\n\nf(); f()\nprint(f())', options:['3','1','0','Ошибку'], answer:0, explanation:'Значение по умолчанию одно на все вызовы.' },
  { id:'q2-4b', type:'single', prompt:'Какой тип неизменяемый?', options:['tuple','list','dict','set'], answer:0, explanation:'Остальные можно менять на месте.' }
 ]}
 ],
 test: [
  { id:'t2-1', type:'match', prompt:'Сопоставьте задачу и коллекцию.', pairs:[['Корзина товаров по порядку','list'],['Цена по названию','dict'],['Уникальные теги','set'],['Координаты точки','tuple']], explanation:'Выбор по операции.', difficulty:1 },
  { id:'t2-2', type:'analyze', prompt:'Что выведет код?', code:'words = ["a", "bb", "ccc", "dd"]\nprint({len(w) for w in words})', options:['{1, 2, 3}','[1, 2, 3, 2]','{1: "a", 2: "bb"}','3'], answer:0, explanation:'Множество убирает повтор длины 2.', difficulty:2 },
  { id:'t2-3', type:'input', prompt:'Что вернёт len({"a": 1, "b": 2, "a": 3})? Введите число.', answer:['2'], explanation:'Повторный ключ "a" перезаписывает значение.', difficulty:2 },
  { id:'t2-4', type:'analyze', prompt:'Что выведет код?', code:'grid = [[0] * 2] * 2\ngrid[0][0] = 5\nprint(grid)', options:['[[5, 0], [5, 0]]','[[5, 0], [0, 0]]','[[5, 5], [0, 0]]','Ошибку'], answer:0, explanation:'Обе строки — один и тот же список. Правильно: [[0] * 2 for _ in range(2)].', difficulty:3 },
  { id:'t2-5', type:'single', prompt:'Как объединить два словаря в новый, где значения второго важнее?', options:['a | b','a + b','a & b','a.join(b)'], answer:0, explanation:'Оператор | для dict с Python 3.9.', difficulty:2 },
  { id:'t2-6', type:'single', prompt:'Как убрать дубликаты из списка с сохранением порядка?', options:['list(dict.fromkeys(items))','list(set(items))','items.unique()','sorted(set(items))'], answer:0, explanation:'set порядок не сохраняет.', difficulty:2 },
  { id:'t2-7', type:'single', prompt:'Как правильно задать список по умолчанию для параметра функции?', options:['def f(x=None): x = [] if x is None else x','def f(x=[])','def f(x=list)','def f(x=[]): x.clear()'], answer:0, explanation:'None как маркер «не передано».', difficulty:1 },
  { id:'t2-8', type:'multiple', prompt:'Что может быть ключом словаря? (несколько ответов)', options:['"name"','42','(1, 2)','[1, 2]'], answer:[0,1,2], explanation:'Список нехешируем.', difficulty:1 }
 ]
},
{
 id: 3, title: 'Функции', short: 'Параметры, области видимости, функции как объекты, замыкания, декораторы',
 lessons: [
 { id:'3-1', title:'Определение функций и параметры', html:`
<pre><code>def discount(price, percent=10):
    """Вернуть цену со скидкой.  ← docstring: видна в help() и IDE"""
    return price * (100 - percent) / 100

discount(1000)               # 900.0
discount(1000, 25)           # позиционно
discount(percent=25, price=1000)   # по именам — порядок не важен</code></pre>
<h3>Гибкие параметры</h3>
<pre><code>def log(message, *args, level="INFO", **kwargs):
    print(level, message, args, kwargs)

log("старт", 1, 2, level="DEBUG", user="anna")
# DEBUG старт (1, 2) {'user': 'anna'}

def create_user(name, *, email, is_admin=False):   # после * — только по имени
    ...
create_user("Анна", email="a@b.ru")        # create_user("Анна", "a@b.ru") — ошибка

def ratio(a, b, /):           # до / — только позиционно
    return a / b

values = [3, 4]
options = {"level": "WARN"}
log("x", *values, **options)  # распаковка при вызове</code></pre>
<div class="tbl"><table><tr><th>Запись</th><th>Смысл</th></tr>
<tr><td><code>*args</code></td><td>Лишние позиционные аргументы → кортеж</td></tr>
<tr><td><code>**kwargs</code></td><td>Лишние именованные аргументы → словарь</td></tr>
<tr><td><code>*</code> в сигнатуре</td><td>Дальше — только именованные</td></tr>
<tr><td><code>/</code> в сигнатуре</td><td>До него — только позиционные</td></tr>
</table></div>
<div class="note why"><b>В Django</b> вы постоянно будете встречать <code>*args, **kwargs</code>: <code>def save(self, *args, **kwargs): ... super().save(*args, **kwargs)</code>. Так метод наследника передаёт родителю все параметры, не перечисляя их.</div>`,
 check: [
  { id:'q3-1a', type:'single', prompt:'Что попадёт в kwargs при вызове f(1, x=2) для def f(a, **kwargs)?', options:['{"x": 2}','(2,)','{"a": 1, "x": 2}','Ничего'], answer:0, explanation:'a — 1, лишние именованные — в kwargs.' },
  { id:'q3-1b', type:'single', prompt:'Что означает * в def f(a, *, b)?', options:['b можно передать только по имени','b — список','a необязательный','f принимает любые аргументы'], answer:0, explanation:'Keyword-only параметры.' }
 ]},
 { id:'3-2', title:'Области видимости', html:`
<p>Имя ищется по правилу <b>LEGB</b>: Local → Enclosing (объемлющая функция) → Global (модуль) → Built-in.</p>
<pre><code>rate = 0.2                     # global

def outer():
    count = 0                  # enclosing для inner
    def inner():
        nonlocal count         # изменить переменную объемлющей функции
        count += 1
        return count * rate    # rate найдено в global
    return inner

def reset():
    global rate                # изменить глобальную (обычно — плохая идея)
    rate = 0</code></pre>
<ul>
<li>Присваивание внутри функции создаёт <b>локальную</b> переменную. Без <code>nonlocal</code>/<code>global</code> внешнюю переменную изменить нельзя — будет <code>UnboundLocalError</code>.</li>
<li>Блоки <code>if</code>/<code>for</code>/<code>with</code> <b>не</b> создают области видимости: переменная цикла доступна после него.</li>
</ul>
<pre><code>def counter():
    total += 1     # UnboundLocalError: total локальная, но ещё не присвоена</code></pre>
<div class="note warn">Изменяемое глобальное состояние затрудняет тестирование и чтение кода. Передавайте данные параметрами и возвращайте результат.</div>`,
 check: [
  { id:'q3-2a', type:'single', prompt:'В каком порядке Python ищет имя?', options:['Local → Enclosing → Global → Built-in','Global → Local','Built-in → Global → Local','Только Local'], answer:0, explanation:'Правило LEGB.' },
  { id:'q3-2b', type:'single', prompt:'Как изменить переменную объемлющей функции из вложенной?', options:['nonlocal имя','global имя','self.имя','Невозможно'], answer:0, explanation:'global — для переменных модуля.' }
 ]},
 { id:'3-3', title:'Функции как объекты и замыкания', html:`
<p>Функции — обычные объекты: их можно присвоить, передать, вернуть, положить в словарь.</p>
<pre><code>def by_price(p): return p.price

products.sort(key=by_price)                  # передать функцию
products.sort(key=lambda p: (p.category, -p.price))   # lambda — короткая анонимная функция

handlers = {"csv": export_csv, "json": export_json}
handlers[fmt](data)                          # диспетчеризация через словарь

from operator import attrgetter, itemgetter
sorted(users, key=attrgetter("age"))
sorted(rows, key=itemgetter("price"))</code></pre>
<p class="small">Передача функции вместо интерфейса с одним методом — это паттерн «Стратегия» (<a href="../oop/#/l/10-3">ООП 10.3</a>) в питоническом виде.</p>
<h3>Замыкания</h3>
<pre><code>def make_multiplier(k):
    def multiply(x):
        return x * k          # k «захвачено» из внешней функции
    return multiply

double = make_multiplier(2)
double(21)                     # 42

from functools import partial
pow2 = partial(pow, exp=2)     # «зафиксировать» часть аргументов
pow2(9)                        # 81</code></pre>
<div class="note warn"><b>Поздняя привязка.</b> <code>[lambda: i for i in range(3)]</code> — все три функции вернут 2: переменная <code>i</code> читается в момент вызова. Решение: <code>lambda i=i: i</code>.</div>`,
 check: [
  { id:'q3-3a', type:'single', prompt:'Что такое замыкание?', options:['Функция, которая запоминает переменные из объемлющей области','Закрытый класс','Функция без параметров','Генератор'], answer:0, explanation:'Захваченные переменные живут вместе с функцией.' },
  { id:'q3-3b', type:'single', prompt:'Как отсортировать пользователей по возрасту по убыванию?', options:['sorted(users, key=lambda u: u.age, reverse=True)','users.sort(age)','sorted(users.age)','users.sort(key="age")'], answer:0, explanation:'key — функция, вычисляющая ключ сортировки.' }
 ]},
 { id:'3-4', title:'Декораторы', html:`
<p><b>Декоратор</b> — функция, которая принимает функцию и возвращает новую, обёрнутую. Синтаксис <code>@</code> — сокращение для <code>f = decorator(f)</code>.</p>
<pre><code>import functools, time

def timed(func):
    @functools.wraps(func)                 # сохранить имя и docstring оригинала
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            return func(*args, **kwargs)
        finally:
            print(f"{func.__name__}: {time.perf_counter() - start:.3f} с")
    return wrapper

@timed
def load_report(month):
    ...

load_report(5)      # load_report: 0.412 с</code></pre>
<div data-widget="decorator"></div>
<h3>Декоратор с параметрами</h3>
<pre><code>def retry(times=3):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except ConnectionError:
                    if attempt == times:
                        raise
        return wrapper
    return decorator

@retry(times=5)
def fetch(url): ...</code></pre>
<p>Встроенные и популярные декораторы: <code>@property</code>, <code>@staticmethod</code>, <code>@classmethod</code>, <code>@dataclass</code> (модуль 4), <code>@functools.cache</code>, <code>@pytest.fixture</code>.</p>
<div class="note why"><b>В Django</b> декораторы повсюду: <code>@login_required</code>, <code>@require_POST</code>, <code>@admin.register(Model)</code>, <code>@receiver(signal)</code>. В PyTorch — <code>@torch.no_grad()</code>. Идея та же, что у паттерна «Декоратор» (<a href="../oop/#/l/10-2">ООП 10.2</a>), но для функций.</div>`,
 check: [
  { id:'q3-4a', type:'single', prompt:'Чему эквивалентна запись @timed над def f()?', options:['f = timed(f)','timed = f(timed)','f.timed()','timed(f())'], answer:0, explanation:'Декоратор применяется один раз при определении.' },
  { id:'q3-4b', type:'single', prompt:'Зачем functools.wraps в декораторе?', options:['Чтобы обёртка сохранила имя, docstring и другие атрибуты исходной функции','Чтобы ускорить вызов','Чтобы декоратор стал асинхронным','Обязателен синтаксически'], answer:0, explanation:'Иначе у всех функций будет имя wrapper.' }
 ]}
 ],
 test: [
  { id:'t3-1', type:'analyze', prompt:'Что выведет код?', code:'def f(a, b=2, *args, c=3, **kw):\n    return a + b + c + len(args) + len(kw)\n\nprint(f(1, 1, 5, 5, c=0, d=9))', options:['5','4','17','Ошибку'], answer:0, explanation:'a=1, b=1, args=(5,5) → 2, c=0, kw={d:9} → 1: 1+1+0+2+1 = 5.', difficulty:3 },
  { id:'t3-2', type:'single', prompt:'Что произойдёт: x = 1; def f(): x += 1; f()?', options:['UnboundLocalError','x станет 2','NameError на этапе определения','Ничего'], answer:0, explanation:'Присваивание делает x локальной.', difficulty:2 },
  { id:'t3-3', type:'analyze', prompt:'Что выведет код?', code:'fs = [lambda: i for i in range(3)]\nprint([f() for f in fs])', options:['[2, 2, 2]','[0, 1, 2]','[0, 0, 0]','Ошибку'], answer:0, explanation:'Поздняя привязка: i читается при вызове.', difficulty:3 },
  { id:'t3-4', type:'match', prompt:'Сопоставьте запись и смысл.', pairs:[['*args','Лишние позиционные → кортеж'],['**kwargs','Лишние именованные → словарь'],['lambda','Анонимная функция-выражение'],['@decorator','f = decorator(f)']], explanation:'Основы функций.', difficulty:1 },
  { id:'t3-5', type:'single', prompt:'Что делает @functools.cache?', options:['Запоминает результаты вызовов с одинаковыми аргументами','Кэширует файлы на диске','Ускоряет циклы','Сохраняет функцию в базе'], answer:0, explanation:'Мемоизация.', difficulty:2 },
  { id:'t3-6', type:'single', prompt:'Сколько уровней вложенных функций у декоратора с параметрами @retry(times=3)?', options:['Три: retry → decorator → wrapper','Один','Два','Зависит от times'], answer:0, explanation:'retry(times) возвращает декоратор.', difficulty:2 },
  { id:'t3-7', type:'single', prompt:'Какой код вызова корректен для def create(name, *, email)?', options:['create("Анна", email="a@b.ru")','create("Анна", "a@b.ru")','create(email="a@b.ru")','create()'], answer:0, explanation:'email — только по имени, name обязателен.', difficulty:1 },
  { id:'t3-8', type:'multiple', prompt:'Что можно сделать с функцией в Python? (несколько ответов)', options:['Передать как аргумент','Вернуть из другой функции','Сохранить в словарь','Унаследовать от неё класс'], answer:[0,1,2], explanation:'Функции — объекты первого класса.', difficulty:1 }
 ]
},
{
 id: 4, title: 'ООП в Python', short: 'Классы и self, property, наследование и MRO, ABC и Protocol, dunder-методы, dataclass, Enum',
 lessons: [
 { id:'4-1', title:'Классы, атрибуты и self', html:`
<p class="small">Теория: <a href="../oop/#/l/1-1">ООП 1.1–1.4</a> — классы, конструкторы, <code>self</code>, статические члены. Обзор Python среди других языков — <a href="../oop/#/l/11-3">ООП 11.3</a>.</p>
<pre><code>class Account:
    bank_name = "Python Bank"            # атрибут класса — общий для всех

    def __init__(self, owner: str, balance: int = 0):
        self.owner = owner               # атрибуты экземпляра создаются присваиванием
        self._balance = balance          # «внутренний» по соглашению

    def deposit(self, amount: int) -&gt; None:
        if amount &lt;= 0:
            raise ValueError("Сумма должна быть положительной")
        self._balance += amount

    @classmethod
    def from_dict(cls, data: dict) -&gt; "Account":     # альтернативный конструктор
        return cls(data["owner"], data.get("balance", 0))

    @staticmethod
    def is_valid_iban(iban: str) -&gt; bool:           # просто функция в пространстве класса
        return iban.startswith("RU") and len(iban) == 22

acc = Account("Анна")
acc.deposit(100)
Account.from_dict({"owner": "Борис", "balance": 50})</code></pre>
<div class="tbl"><table><tr><th>Что</th><th>Первый параметр</th><th>Когда</th></tr>
<tr><td>Обычный метод</td><td><code>self</code> — экземпляр</td><td>Работа с состоянием объекта</td></tr>
<tr><td><code>@classmethod</code></td><td><code>cls</code> — класс</td><td>Альтернативные конструкторы, учитывают наследников</td></tr>
<tr><td><code>@staticmethod</code></td><td>—</td><td>Вспомогательная функция, логически связанная с классом</td></tr>
</table></div>
<div class="note"><b>Особенности Python.</b> Нет <code>private</code> — только соглашение <code>_name</code> и name mangling <code>__name</code> (<a href="../oop/#/l/2-2">ООП 2.2</a>). Атрибуты можно добавить объекту в любой момент — поэтому все атрибуты принято задавать в <code>__init__</code>, чтобы структура класса была видна сразу.</div>`,
 check: [
  { id:'q4-1a', type:'single', prompt:'Что получает первым аргументом @classmethod?', options:['Класс (cls)','Экземпляр (self)','Ничего','Модуль'], answer:0, explanation:'Поэтому cls(...) создаст экземпляр нужного наследника.' },
  { id:'q4-1b', type:'single', prompt:'Где принято создавать все атрибуты экземпляра?', options:['В __init__','В любом методе по мере надобности','Только в атрибутах класса','В __new__'], answer:0, explanation:'Тогда структура объекта видна в одном месте.' }
 ]},
 { id:'4-2', title:'Свойства и dunder-методы', html:`
<h3>@property</h3>
<p>В Python не пишут геттеры и сеттеры заранее: начните с обычного атрибута, а если понадобится логика — превратите его в свойство, не меняя вызывающий код (<a href="../oop/#/l/2-3">ООП 2.3</a>).</p>
<pre><code>class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price              # вызовет сеттер ниже

    @property
    def price(self):
        return self._price

    @price.setter
    def price(self, value):
        if value &lt; 0:
            raise ValueError("Цена не может быть отрицательной")
        self._price = value

    @property
    def is_free(self):                  # вычисляемое, только чтение
        return self._price == 0</code></pre>
<h3>Магические (dunder) методы</h3>
<p>Методы вида <code>__имя__</code> встраивают ваш класс в синтаксис языка:</p>
<pre><code>class Money:
    def __init__(self, amount, currency="RUB"):
        self.amount, self.currency = amount, currency
    def __repr__(self):  return f"Money({self.amount!r}, {self.currency!r})"   # для разработчика
    def __str__(self):   return f"{self.amount} {self.currency}"             # для пользователя
    def __eq__(self, o): return (self.amount, self.currency) == (o.amount, o.currency)
    def __hash__(self):  return hash((self.amount, self.currency))
    def __add__(self, o): return Money(self.amount + o.amount, self.currency)
    def __lt__(self, o): return self.amount &lt; o.amount
    def __bool__(self):  return self.amount != 0</code></pre>
<div class="tbl"><table><tr><th>Метод</th><th>Что включает</th></tr>
<tr><td><code>__repr__</code>, <code>__str__</code></td><td><code>repr(x)</code>, <code>print(x)</code>, f-строки</td></tr>
<tr><td><code>__eq__</code>, <code>__hash__</code></td><td><code>==</code>, ключи dict, элементы set (<a href="../oop/#/l/7-2">ООП 7.2</a>)</td></tr>
<tr><td><code>__lt__</code> и др.</td><td><code>&lt;</code>, <code>sorted()</code></td></tr>
<tr><td><code>__add__</code>, <code>__mul__</code></td><td>Арифметика</td></tr>
<tr><td><code>__len__</code>, <code>__getitem__</code>, <code>__contains__</code>, <code>__iter__</code></td><td><code>len()</code>, <code>x[i]</code>, <code>in</code>, <code>for</code></td></tr>
<tr><td><code>__call__</code></td><td>Объект можно вызвать как функцию</td></tr>
<tr><td><code>__enter__</code>, <code>__exit__</code></td><td><code>with</code> (модуль 5)</td></tr>
</table></div>`,
 check: [
  { id:'q4-2a', type:'single', prompt:'Какой метод определяет, что выведет print(obj)?', options:['__str__ (а если его нет — __repr__)','__print__','__init__','__call__'], answer:0, explanation:'repr — для разработчика, str — для пользователя.' },
  { id:'q4-2b', type:'single', prompt:'Зачем превращать атрибут в @property?', options:['Добавить проверку или вычисление, не меняя код obj.attr у вызывающих','Сделать атрибут статическим','Ускорить доступ','Запретить чтение'], answer:0, explanation:'Синтаксис доступа остаётся прежним.' }
 ]},
 { id:'4-3', title:'Наследование, super и MRO', html:`
<p class="small">Теория: <a href="../oop/#/l/3-2">ООП 3.2 «Переопределение и super»</a>, <a href="../oop/#/l/3-4">ООП 3.4 «Множественное наследование и ромб»</a>, <a href="../oop/#/l/5-4">ООП 5.4 «Миксины»</a>.</p>
<pre><code>class Notification:
    def __init__(self, to):
        self.to = to
    def send(self, text):
        raise NotImplementedError
    def format(self, text):
        return text

class EmailNotification(Notification):
    def __init__(self, to, subject):
        super().__init__(to)                       # инициализация родителя
        self.subject = subject
    def send(self, text):                          # все методы переопределяемы
        smtp_send(self.to, self.subject, self.format(text))
    def format(self, text):
        return f"&lt;p&gt;{super().format(text)}&lt;/p&gt;"

isinstance(n, Notification), issubclass(EmailNotification, Notification)</code></pre>
<h3>Миксины и MRO</h3>
<pre><code>class JsonMixin:
    def to_json(self):
        return json.dumps(self.__dict__)

class TimestampMixin:
    def touch(self):
        self.updated_at = datetime.now()

class Order(JsonMixin, TimestampMixin, Model):
    ...

Order.__mro__     # (Order, JsonMixin, TimestampMixin, Model, object)</code></pre>
<p><code>super()</code> вызывает <b>следующий класс в MRO</b>, а не обязательно прямого родителя. Поэтому миксины, которые сами вызывают <code>super()</code>, корректно выстраиваются в цепочку.</p>
<div class="note why"><b>В Django</b> миксины — основа class-based views: <code>class OrderList(LoginRequiredMixin, PermissionRequiredMixin, ListView)</code>. Порядок важен: миксины слева, базовое представление справа.</div>`,
 check: [
  { id:'q4-3a', type:'single', prompt:'Что вызывает super().method() в Python?', options:['Метод следующего класса в MRO','Всегда метод прямого родителя','Метод object','Тот же метод рекурсивно'], answer:0, explanation:'При множественном наследовании это важно.' },
  { id:'q4-3b', type:'single', prompt:'Где смотреть порядок поиска методов класса?', options:['Cls.__mro__ или Cls.mro()','Cls.__bases__ только','dir(Cls)','Cls.__dict__'], answer:0, explanation:'C3-линеаризация.' }
 ]},
 { id:'4-4', title:'ABC, Protocol, dataclass и Enum', html:`
<h3>Абстрактные классы и протоколы</h3>
<p class="small">Теория: <a href="../oop/#/l/5-2">ООП 5.2 «Интерфейсы»</a>, <a href="../oop/#/l/4-3">ООП 4.3 «Утиная и структурная типизация»</a>.</p>
<pre><code>from abc import ABC, abstractmethod
class Storage(ABC):                      # номинальный интерфейс: нужно наследоваться
    @abstractmethod
    def save(self, key: str, data: bytes) -&gt; None: ...

from typing import Protocol
class Notifier(Protocol):                # структурный: достаточно иметь метод
    def send(self, to: str, text: str) -&gt; None: ...

class SmsNotifier:                       # не наследует Notifier, но подходит
    def send(self, to, text): ...

def notify_all(n: Notifier, users): ...  # mypy проверит совместимость (модуль 8)</code></pre>
<h3>dataclass</h3>
<pre><code>from dataclasses import dataclass, field

@dataclass
class OrderLine:
    sku: str
    qty: int = 1
    tags: list[str] = field(default_factory=list)   # изменяемое значение по умолчанию — только так

@dataclass(frozen=True, slots=True)
class Money:                                        # неизменяемый объект-значение
    amount: int
    currency: str = "RUB"

Money(100) == Money(100)       # True — __eq__ сгенерирован
# также __init__, __repr__, __hash__ (для frozen), порядок — order=True</code></pre>
<h3>Enum</h3>
<pre><code>from enum import Enum, StrEnum, auto
class Status(StrEnum):
    NEW = auto()          # "new"
    PAID = auto()
    SHIPPED = auto()

Status.PAID == "paid"     # True
Status("new")             # Status.NEW</code></pre>
<div class="note why"><b>Куда это ведёт.</b> Модели Django и схемы Pydantic (модуль 8) выглядят как dataclass: аннотированные поля класса превращаются в столбцы БД или правила валидации. Поняв dataclass, вы легко прочитаете оба.</div>`,
 check: [
  { id:'q4-4a', type:'single', prompt:'Как задать список по умолчанию в поле dataclass?', options:['field(default_factory=list)','tags: list = []','tags = list','Нельзя'], answer:0, explanation:'Иначе все экземпляры делили бы один список.' },
  { id:'q4-4b', type:'single', prompt:'Чем Protocol отличается от ABC?', options:['Protocol проверяет совместимость по наличию методов, наследоваться не нужно','Protocol быстрее','ABC работает только в рантайме, Protocol — нигде','Ничем'], answer:0, explanation:'Структурная типизация против номинальной.' }
 ]}
 ],
 test: [
  { id:'t4-1', type:'analyze', prompt:'Что выведет код?', code:'class A:\n    def hi(self): return "A"\nclass B(A):\n    def hi(self): return "B" + super().hi()\nclass C(A):\n    def hi(self): return "C" + super().hi()\nclass D(B, C):\n    pass\n\nprint(D().hi())', options:['BCA','BA','BAC','CBA'], answer:0, explanation:'MRO: D, B, C, A — super() в B ведёт к C.', difficulty:3 },
  { id:'t4-2', type:'match', prompt:'Сопоставьте dunder-метод и синтаксис.', pairs:[['__len__','len(x)'],['__getitem__','x[i]'],['__contains__','a in x'],['__call__','x()']], explanation:'Магические методы.', difficulty:2 },
  { id:'t4-3', type:'single', prompt:'Что вернёт Money(5) == Money(5) для @dataclass Money?', options:['True','False','Ошибку','None'], answer:0, explanation:'dataclass генерирует __eq__ по полям.', difficulty:1 },
  { id:'t4-4', type:'single', prompt:'Что произойдёт при создании экземпляра ABC-класса с нереализованным @abstractmethod?', options:['TypeError','Создастся объект','Предупреждение','Метод вернёт None'], answer:0, explanation:'Абстрактный класс нельзя инстанцировать.', difficulty:1 },
  { id:'t4-5', type:'single', prompt:'Переопределили __eq__ в обычном классе. Что случится с хешем?', options:['__hash__ станет None — объект нельзя положить в set или dict','Ничего','Хеш будет случайным','Ошибка при определении класса'], answer:0, explanation:'Python защищает от нарушения контракта eq/hash.', difficulty:3 },
  { id:'t4-6', type:'single', prompt:'Как сделать dataclass неизменяемым?', options:['@dataclass(frozen=True)','@dataclass(final=True)','@dataclass(readonly=True)','Нельзя'], answer:0, explanation:'Присваивание поля бросит FrozenInstanceError.', difficulty:1 },
  { id:'t4-7', type:'single', prompt:'Зачем альтернативный конструктор делают @classmethod, а не @staticmethod?', options:['cls создаст экземпляр нужного наследника','Так быстрее','staticmethod не может возвращать объект','Нет разницы'], answer:0, explanation:'Учитывается фактический класс.', difficulty:2 },
  { id:'t4-8', type:'multiple', prompt:'Что генерирует @dataclass по умолчанию? (несколько ответов)', options:['__init__','__repr__','__eq__','__lt__'], answer:[0,1,2], explanation:'Сравнение порядка — только с order=True.', difficulty:2 }
 ]
},
{
 id: 5, title: 'Итераторы, генераторы, контекстные менеджеры', short: 'Протокол итерации, yield, itertools, with и contextlib',
 lessons: [
 { id:'5-1', title:'Протокол итерации', html:`
<p>Цикл <code>for</code> работает с любым <b>итерируемым</b> объектом. Под капотом:</p>
<pre><code>it = iter(collection)      # вызывает collection.__iter__() → итератор
while True:
    try:
        x = next(it)       # it.__next__()
    except StopIteration:
        break
    ...</code></pre>
<p>Итерируемое (list, dict, str, файл) умеет выдать итератор. Итератор помнит позицию и выдаёт элементы по одному; пройти его можно <b>один раз</b>.</p>
<pre><code>class Countdown:
    def __init__(self, start):
        self.start = start
    def __iter__(self):
        n = self.start
        while n &gt; 0:
            yield n             # проще всего реализовать __iter__ генератором
            n -= 1

for x in Countdown(3):
    print(x)                    # 3 2 1</code></pre>
<p class="small">Это паттерн «Итератор» (<a href="../oop/#/l/10-4">ООП 10.4</a>), встроенный в язык.</p>
<div class="note warn"><b>Одноразовость.</b> <code>m = map(str, nums)</code> — итератор. После <code>list(m)</code> он пуст, и второй <code>list(m)</code> вернёт <code>[]</code>. Так же ведут себя <code>zip</code>, <code>filter</code>, генераторы, файлы.</div>`,
 check: [
  { id:'q5-1a', type:'single', prompt:'Что бросает next() у исчерпанного итератора?', options:['StopIteration','IndexError','None','KeyError'], answer:0, explanation:'for ловит его и завершает цикл.' },
  { id:'q5-1b', type:'analyze', prompt:'Что выведет код?', code:'z = zip([1, 2], ["a", "b"])\nprint(len(list(z)), len(list(z)))', options:['2 0','2 2','0 0','Ошибку'], answer:0, explanation:'zip — итератор, второй проход пуст.' }
 ]},
 { id:'5-2', title:'Генераторы', html:`
<p>Функция с <code>yield</code> — <b>генератор</b>: при вызове она не выполняется, а возвращает итератор, который вычисляет значения лениво, по одному.</p>
<pre><code>def read_large_log(path):
    with open(path, encoding="utf-8") as f:
        for line in f:                  # файл тоже читается построчно
            if "ERROR" in line:
                yield line.rstrip()

errors = read_large_log("app.log")      # ещё ничего не прочитано
for e in errors:                         # строки читаются по мере перебора
    print(e)

# конвейер ленивых шагов: память не растёт, даже если файл 50 ГБ
lines = read_large_log("app.log")
codes = (line.split()[3] for line in lines)          # генераторное выражение
top = Counter(codes).most_common(5)</code></pre>
<pre><code>def chunks(items, size):
    for i in range(0, len(items), size):
        yield items[i:i + size]

def walk(tree):
    yield tree.value
    for child in tree.children:
        yield from walk(child)          # делегировать вложенному генератору</code></pre>
<div class="note why"><b>В ИИ</b> генераторы — основа загрузки данных: датасет читается пачками (batch) и не помещается в память целиком. <code>torch.utils.data.DataLoader</code> и стриминговые ответы языковых моделей работают по тому же принципу.</div>`,
 check: [
  { id:'q5-2a', type:'single', prompt:'Что вернёт вызов функции-генератора?', options:['Объект-генератор (итератор); тело ещё не выполнялось','Список всех значений','Первое значение','None'], answer:0, explanation:'Выполнение начнётся при первом next().' },
  { id:'q5-2b', type:'single', prompt:'Главное преимущество генератора для больших данных?', options:['Значения вычисляются по одному, весь набор не хранится в памяти','Он быстрее любого цикла','Его можно перебрать сколько угодно раз','Он многопоточный'], answer:0, explanation:'Ленивые вычисления.' }
 ]},
 { id:'5-3', title:'itertools и встроенные помощники', html:`
<pre><code>any(p.price == 0 for p in cart)       # хоть один
all(u.email for u in users)           # все
sum(x.qty for x in lines), max(items, key=len), min(...)
sorted(users, key=lambda u: (u.city, -u.age))
list(map(str.upper, names)), list(filter(None, values))
dict(zip(keys, values))
reversed(seq), enumerate(seq, 1)</code></pre>
<pre><code>import itertools as it
it.chain(a, b, c)                     # склеить последовательности
it.islice(gen, 10)                    # первые 10 из бесконечного генератора
it.groupby(sorted(rows, key=k), key=k)   # группы подряд идущих (сначала отсортируйте!)
it.batched(range(10), 3)              # (0,1,2) (3,4,5) (6,7,8) (9,) — Python 3.12
it.product("AB", repeat=2)            # AA AB BA BB
it.combinations([1, 2, 3], 2)         # (1,2) (1,3) (2,3)
it.count(1), it.cycle("ab"), it.accumulate([1, 2, 3])   # 1 2 3 …, a b a …, 1 3 6</code></pre>
<pre><code>from collections import Counter, defaultdict, deque
Counter("abracadabra").most_common(2)     # [('a', 5), ('b', 2)]
by_city = defaultdict(list)
for u in users: by_city[u.city].append(u)
last5 = deque(maxlen=5)                    # хранит только 5 последних</code></pre>
<div class="note"><b>Совет.</b> Прежде чем писать цикл с флагами и счётчиками, проверьте: нет ли готовой функции в builtins, <code>itertools</code> или <code>collections</code>. Чаще всего есть.</div>`,
 check: [
  { id:'q5-3a', type:'single', prompt:'Что нужно сделать перед itertools.groupby, чтобы группы были полными?', options:['Отсортировать по тому же ключу','Перевернуть список','Ничего','Преобразовать в set'], answer:0, explanation:'groupby объединяет только подряд идущие элементы.' },
  { id:'q5-3b', type:'single', prompt:'Как посчитать частоту слов в списке одной строкой?', options:['Counter(words)','dict(words)','set(words)','len(words)'], answer:0, explanation:'Counter — словарь «значение → количество».' }
 ]},
 { id:'5-4', title:'Контекстные менеджеры', html:`
<p>Конструкция <code>with</code> гарантирует освобождение ресурса — даже при исключении (<a href="../oop/#/l/7-4">ООП 7.4</a>).</p>
<pre><code>with open("data.csv", encoding="utf-8") as f, open("out.csv", "w") as out:
    for line in f:
        out.write(line.upper())
# здесь оба файла закрыты</code></pre>
<p>Свой менеджер — класс с <code>__enter__</code>/<code>__exit__</code> или, проще, генератор:</p>
<pre><code>from contextlib import contextmanager
import time

@contextmanager
def timer(label):
    start = time.perf_counter()
    try:
        yield                                   # здесь выполняется тело with
    finally:
        print(f"{label}: {time.perf_counter() - start:.2f} с")

with timer("обучение"):
    model.fit(X, y)

class Transaction:
    def __init__(self, conn): self.conn = conn
    def __enter__(self): return self.conn.cursor()
    def __exit__(self, exc_type, exc, tb):
        if exc_type: self.conn.rollback()
        else: self.conn.commit()
        return False                            # не подавлять исключение</code></pre>
<p>Полезное из <code>contextlib</code>: <code>suppress(FileNotFoundError)</code>, <code>redirect_stdout</code>, <code>ExitStack</code> (переменное число ресурсов).</p>
<div class="note why"><b>Где встретите.</b> Django: <code>with transaction.atomic():</code>. PyTorch: <code>with torch.no_grad():</code>. Тесты: <code>with pytest.raises(ValueError):</code>. Блокировки: <code>with lock:</code>.</div>`,
 check: [
  { id:'q5-4a', type:'single', prompt:'Что гарантирует with open(...) as f?', options:['Файл будет закрыт при выходе из блока, даже при исключении','Файл откроется быстрее','Файл заблокируется для других процессов','Кодировка будет UTF-8'], answer:0, explanation:'__exit__ вызывается всегда.' },
  { id:'q5-4b', type:'single', prompt:'Что значит return True из __exit__?', options:['Исключение будет подавлено','Ресурс не закроется','Блок выполнится снова','Ничего'], answer:0, explanation:'Обычно возвращают False, чтобы ошибка ушла дальше.' }
 ]}
 ],
 test: [
  { id:'t5-1', type:'analyze', prompt:'Что выведет код?', code:'def gen():\n    print("старт")\n    yield 1\n    yield 2\n\ng = gen()\nprint("создан")\nprint(next(g))', options:['создан, старт, 1','старт, создан, 1','создан, 1','старт, 1, создан'], answer:0, explanation:'Тело генератора начинает выполняться при первом next().', difficulty:2 },
  { id:'t5-2', type:'match', prompt:'Сопоставьте инструмент и задачу.', pairs:[['Counter','Подсчёт частот'],['defaultdict(list)','Группировка в списки'],['deque(maxlen=N)','Последние N элементов'],['itertools.chain','Склейка последовательностей']], explanation:'Стандартная библиотека.', difficulty:1 },
  { id:'t5-3', type:'single', prompt:'Чем (x * 2 for x in data) отличается от [x * 2 for x in data]?', options:['Первое — ленивый генератор, второе — готовый список','Ничем','Первое — кортеж','Второе ленивое'], answer:0, explanation:'Круглые скобки — генераторное выражение.', difficulty:1 },
  { id:'t5-4', type:'single', prompt:'Что делает yield from walk(child)?', options:['Передаёт наружу все значения вложенного генератора','Возвращает генератор как одно значение','Останавливает генерацию','Вызывает рекурсию без результата'], answer:0, explanation:'Делегирование генератору.', difficulty:2 },
  { id:'t5-5', type:'input', prompt:'Сколько элементов выдаст itertools.combinations([1, 2, 3, 4], 2)? Введите число.', answer:['6'], explanation:'C(4,2) = 6.', difficulty:2 },
  { id:'t5-6', type:'single', prompt:'Как проще всего написать свой контекстный менеджер?', options:['Генератор с @contextlib.contextmanager и yield','Метакласс','Декоратор @property','Через threading'], answer:0, explanation:'До yield — вход, после — выход.', difficulty:1 },
  { id:'t5-7', type:'single', prompt:'Чем полезен with transaction.atomic() в Django (по смыслу)?', options:['Все операции блока фиксируются вместе или откатываются при ошибке','Ускоряет запросы','Шифрует данные','Создаёт таблицы'], answer:0, explanation:'Контекстный менеджер транзакции.', difficulty:1 },
  { id:'t5-8', type:'multiple', prompt:'Какие объекты — одноразовые итераторы? (несколько ответов)', options:['Результат zip(...)','Генератор','Открытый файл','Список'], answer:[0,1,2], explanation:'Список можно перебирать многократно.', difficulty:2 }
 ]
},
{
 id: 6, title: 'Ошибки, модули и пакеты', short: 'Исключения, свои исключения, import, пакеты, pyproject.toml, logging',
 lessons: [
 { id:'6-1', title:'Исключения', html:`
<pre><code>try:
    value = int(user_input)
    result = 100 / value
except ValueError:
    print("Это не число")
except ZeroDivisionError as e:
    print("Деление на ноль:", e)
else:
    print("Успех:", result)        # если исключений не было
finally:
    print("Выполнится всегда")</code></pre>
<div class="tbl"><table><tr><th>Исключение</th><th>Когда</th></tr>
<tr><td><code>ValueError</code></td><td>Правильный тип, неверное значение: <code>int("abc")</code></td></tr>
<tr><td><code>TypeError</code></td><td>Неверный тип: <code>"a" + 1</code></td></tr>
<tr><td><code>KeyError</code>, <code>IndexError</code></td><td>Нет ключа / индекса</td></tr>
<tr><td><code>AttributeError</code></td><td>Нет атрибута: часто у <code>None</code></td></tr>
<tr><td><code>FileNotFoundError</code>, <code>PermissionError</code></td><td>Ошибки файловой системы (<code>OSError</code>)</td></tr>
</table></div>
<h3>Свои исключения</h3>
<pre><code>class ShopError(Exception):
    """Базовое исключение приложения."""

class OutOfStock(ShopError):
    def __init__(self, sku, requested):
        super().__init__(f"Нет товара {sku}: запрошено {requested}")
        self.sku = sku

try:
    reserve(sku, 3)
except OutOfStock as e:
    log.warning("Мало товара %s", e.sku)
except Exception as e:
    raise ShopError("Не удалось оформить заказ") from e   # цепочка причин</code></pre>
<div class="note why"><b>EAFP.</b> В Python принято «проще попросить прощения, чем разрешения»: попробовать операцию и поймать исключение (<code>try: d[k] except KeyError</code>), а не проверять всё заранее. Но не ловите голый <code>except:</code> — он поймает даже Ctrl+C.</div>`,
 check: [
  { id:'q6-1a', type:'single', prompt:'Когда выполняется блок else в try?', options:['Если в try не было исключения','Всегда','При любом исключении','Перед finally при ошибке'], answer:0, explanation:'Код «успешного» продолжения.' },
  { id:'q6-1b', type:'single', prompt:'Что делает raise NewError(...) from e?', options:['Сохраняет исходное исключение как причину (__cause__)','Подавляет e','Выбрасывает оба одновременно','Преобразует тип e'], answer:0, explanation:'Трассировка покажет оба исключения.' }
 ]},
 { id:'6-2', title:'Модули и импорт', html:`
<p>Каждый <code>.py</code>-файл — <b>модуль</b>. Папка с модулями — <b>пакет</b>.</p>
<pre><code>shop/
├─ pyproject.toml
├─ src/
│  └─ shop/
│     ├─ __init__.py       # делает папку пакетом, выполняется при импорте
│     ├─ models.py
│     ├─ services/
│     │  ├─ __init__.py
│     │  └─ orders.py
│     └─ __main__.py       # python -m shop
└─ tests/
   └─ test_orders.py</code></pre>
<pre><code>import json                           # модуль целиком
from pathlib import Path              # конкретное имя
from shop.models import Order         # абсолютный импорт — предпочтительно
from .models import Order             # относительный — внутри пакета
import numpy as np                    # общепринятый псевдоним</code></pre>
<h3>Точка входа</h3>
<pre><code>def main():
    ...

if __name__ == "__main__":     # True при запуске файла, False при импорте
    main()</code></pre>
<ul>
<li>Модуль выполняется <b>один раз</b> при первом импорте и кэшируется в <code>sys.modules</code>.</li>
<li>Порядок поиска модулей — <code>sys.path</code>: папка скрипта, установленные пакеты.</li>
<li>Не называйте свои файлы как модули стандартной библиотеки: свой <code>json.py</code> или <code>random.py</code> перекроет настоящий.</li>
<li>Избегайте <code>from x import *</code> — непонятно, откуда взялись имена.</li>
</ul>`,
 check: [
  { id:'q6-2a', type:'single', prompt:'Зачем if __name__ == "__main__":?', options:['Выполнить код только при запуске файла, но не при импорте','Ускорить импорт','Объявить пакет','Сделать функцию публичной'], answer:0, explanation:'При импорте __name__ равен имени модуля.' },
  { id:'q6-2b', type:'single', prompt:'Вы создали файл random.py, и import random ведёт себя странно. Почему?', options:['Ваш файл перекрыл модуль стандартной библиотеки','Модуль random удалён','Python кэширует старую версию','Так работает только в Windows'], answer:0, explanation:'Папка скрипта стоит в sys.path первой.' }
 ]},
 { id:'6-3', title:'pyproject.toml и структура проекта', html:`
<pre><code># pyproject.toml — единый файл описания проекта
[project]
name = "shop"
version = "0.3.0"
requires-python = "&gt;=3.12"
dependencies = [
    "httpx&gt;=0.27",
    "pydantic&gt;=2.7",
]

[project.optional-dependencies]
dev = ["pytest", "ruff", "mypy"]

[project.scripts]
shop = "shop.cli:main"            # после установки появится команда shop

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.ruff]
line-length = 100

[tool.pytest.ini_options]
testpaths = ["tests"]</code></pre>
<pre><code>$ pip install -e ".[dev]"         # установка в режиме разработки
$ uv sync                         # то же с uv по lock-файлу
$ python -m build                 # собрать wheel для публикации
$ uv publish                      # опубликовать на PyPI</code></pre>
<div class="tbl"><table><tr><th>Файл</th><th>Назначение</th></tr>
<tr><td><code>pyproject.toml</code></td><td>Метаданные, зависимости, настройки инструментов</td></tr>
<tr><td><code>uv.lock</code> / <code>poetry.lock</code></td><td>Точные версии всех зависимостей</td></tr>
<tr><td><code>requirements.txt</code></td><td>Старый, но всё ещё распространённый формат списка зависимостей</td></tr>
<tr><td><code>.python-version</code></td><td>Версия Python проекта</td></tr>
</table></div>
<div class="note">Структура <code>src/</code> защищает от случайного импорта неустановленного кода из корня репозитория. Django-проекты имеют свою структуру, которую создаёт <code>django-admin startproject</code>.</div>`,
 check: [
  { id:'q6-3a', type:'single', prompt:'Где в современном проекте описывают зависимости и настройки инструментов?', options:['pyproject.toml','setup.cfg обязательно','README.md','__init__.py'], answer:0, explanation:'Единый стандартный файл.' },
  { id:'q6-3b', type:'single', prompt:'Что даёт pip install -e .?', options:['Устанавливает проект в режиме разработки: правки кода видны без переустановки','Удаляет проект','Публикует на PyPI','Создаёт окружение'], answer:0, explanation:'editable install.' }
 ]},
 { id:'6-4', title:'Логирование', html:`
<pre><code>import logging

logger = logging.getLogger(__name__)          # логгер модуля — иерархия по пакетам

def place_order(order):
    logger.info("Заказ %s на сумму %s", order.id, order.total)   # ленивое форматирование
    try:
        charge(order)
    except PaymentError:
        logger.exception("Оплата заказа %s не прошла", order.id)  # + трассировка
        raise

# настройка — один раз, в точке входа приложения
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)</code></pre>
<div class="tbl"><table><tr><th>Уровень</th><th>Когда</th></tr>
<tr><td>DEBUG</td><td>Детали для отладки</td></tr>
<tr><td>INFO</td><td>Нормальные события: старт, обработан заказ</td></tr>
<tr><td>WARNING</td><td>Что-то необычное, но работа продолжается</td></tr>
<tr><td>ERROR</td><td>Операция не удалась</td></tr>
<tr><td>CRITICAL</td><td>Приложение не может продолжать</td></tr>
</table></div>
<ul>
<li>В библиотечном коде используйте <code>logging</code>, а не <code>print</code>: приложение само решит, куда и что выводить.</li>
<li>Передавайте значения аргументами (<code>"%s", x</code>), а не f-строкой — форматирование выполнится, только если уровень включён.</li>
<li>Для структурных JSON-логов — <code>structlog</code> или <code>python-json-logger</code>.</li>
</ul>
<div class="note why"><b>В Django</b> логирование настраивается словарём <code>LOGGING</code> в settings.py — это та же стандартная библиотека logging.</div>`,
 check: [
  { id:'q6-4a', type:'single', prompt:'Как правильно получить логгер в модуле?', options:['logging.getLogger(__name__)','print','logging.Logger()','import log'], answer:0, explanation:'Имя модуля даёт иерархию логгеров.' },
  { id:'q6-4b', type:'single', prompt:'Что делает logger.exception(...) внутри except?', options:['Пишет ERROR вместе с трассировкой стека','Бросает исключение','Подавляет исключение','Пишет DEBUG'], answer:0, explanation:'Удобно для логирования пойманных ошибок.' }
 ]}
 ],
 test: [
  { id:'t6-1', type:'analyze', prompt:'Что выведет код?', code:'def f():\n    try:\n        return "try"\n    finally:\n        print("finally")\n\nprint(f())', options:['finally, затем try','try','finally','try, затем finally'], answer:0, explanation:'finally выполняется перед фактическим возвратом.', difficulty:2 },
  { id:'t6-2', type:'match', prompt:'Сопоставьте ошибку и пример.', pairs:[['ValueError','int("abc")'],['TypeError','"a" + 1'],['KeyError','{}["x"]'],['AttributeError','None.upper()']], explanation:'Частые исключения.', difficulty:1 },
  { id:'t6-3', type:'single', prompt:'Почему плох голый except:?', options:['Ловит всё, включая KeyboardInterrupt и SystemExit','Он медленный','Он не ловит ValueError','Это синтаксическая ошибка'], answer:0, explanation:'Ловите конкретные исключения или хотя бы Exception.', difficulty:2 },
  { id:'t6-4', type:'single', prompt:'Сколько раз выполнится код модуля utils.py при трёх import utils в разных файлах?', options:['Один','Три','Ни разу','Зависит от ОС'], answer:0, explanation:'Модули кэшируются в sys.modules.', difficulty:2 },
  { id:'t6-5', type:'single', prompt:'Как сделать так, чтобы после установки пакета появилась консольная команда shop?', options:['[project.scripts] shop = "shop.cli:main"','Добавить shop.exe в репозиторий','__main__.py обязательно в корне','Это невозможно'], answer:0, explanation:'Точка входа в pyproject.toml.', difficulty:2 },
  { id:'t6-6', type:'single', prompt:'Почему logger.info("x=%s", x) лучше, чем logger.info(f"x={x}")?', options:['Форматирование выполнится только если уровень INFO включён','f-строки запрещены в логах','Так короче','Нет разницы'], answer:0, explanation:'И агрегаторы логов могут группировать по шаблону.', difficulty:2 },
  { id:'t6-7', type:'single', prompt:'Что такое EAFP?', options:['Стиль: пробовать и ловить исключения вместо предварительных проверок','Формат файлов','Менеджер пакетов','Вид импорта'], answer:0, explanation:'Easier to Ask Forgiveness than Permission.', difficulty:1 },
  { id:'t6-8', type:'multiple', prompt:'Что обычно лежит в pyproject.toml? (несколько ответов)', options:['Имя и версия проекта','Зависимости','Настройки ruff и pytest','Пароли от базы данных'], answer:[0,1,2], explanation:'Секретам место в переменных окружения.', difficulty:1 }
 ]
},
{
 id: 7, title: 'Стандартная библиотека', short: 'pathlib и файлы, json и csv, дата и время, регулярные выражения, argparse',
 lessons: [
 { id:'7-1', title:'Файлы и pathlib', html:`
<pre><code>from pathlib import Path

base = Path(__file__).parent          # папка текущего файла
data = base / "data" / "orders.json"  # пути склеиваются оператором /
data.exists(), data.suffix, data.stem, data.name
data.parent.mkdir(parents=True, exist_ok=True)

text = data.read_text(encoding="utf-8")
data.write_text("…", encoding="utf-8")

for p in Path("logs").glob("*.log"):  # rglob — рекурсивно
    print(p, p.stat().st_size)

with data.open("a", encoding="utf-8") as f:   # режимы: r, w, a, x, rb, wb
    f.write("строка\\n")</code></pre>
<div class="tbl"><table><tr><th>Режим</th><th>Смысл</th></tr>
<tr><td><code>r</code></td><td>Чтение (по умолчанию)</td></tr>
<tr><td><code>w</code></td><td>Запись с очисткой файла</td></tr>
<tr><td><code>a</code></td><td>Дозапись в конец</td></tr>
<tr><td><code>x</code></td><td>Создать; ошибка, если файл уже есть</td></tr>
<tr><td><code>b</code></td><td>Бинарный режим: читаются <code>bytes</code></td></tr>
</table></div>
<div class="note warn"><b>Всегда указывайте encoding="utf-8".</b> Без него Python берёт кодировку системы: на Windows это может быть cp1251, и русский текст превратится в «кракозябры» или вызовет UnicodeDecodeError.</div>`,
 check: [
  { id:'q7-1a', type:'single', prompt:'Как собрать путь data/orders.json относительно папки base в pathlib?', options:['base / "data" / "orders.json"','base + "/data/orders.json"','Path.join(base, data)','base.add("data")'], answer:0, explanation:'Оператор / перегружен для путей.' },
  { id:'q7-1b', type:'single', prompt:'Какой режим open дописывает в конец файла?', options:['"a"','"w"','"r"','"x"'], answer:0, explanation:'"w" очистит файл.' }
 ]},
 { id:'7-2', title:'JSON и CSV', html:`
<pre><code>import json

order = {"id": 7, "items": [{"sku": "A1", "qty": 2}], "paid": True, "coupon": None}
s = json.dumps(order, ensure_ascii=False, indent=2)   # объект → строка
data = json.loads(s)                                 # строка → объект

with open("order.json", "w", encoding="utf-8") as f:
    json.dump(order, f, ensure_ascii=False)
with open("order.json", encoding="utf-8") as f:
    order = json.load(f)</code></pre>
<div class="tbl"><table><tr><th>JSON</th><th>Python</th></tr>
<tr><td>object</td><td>dict</td></tr><tr><td>array</td><td>list</td></tr>
<tr><td>string / number</td><td>str / int, float</td></tr>
<tr><td>true / false / null</td><td>True / False / None</td></tr>
</table></div>
<p>Даты, <code>Decimal</code>, dataclass-объекты стандартный json не умеет — нужен <code>default=</code> или Pydantic (модуль 8).</p>
<pre><code>import csv
with open("sales.csv", newline="", encoding="utf-8") as f:
    for row in csv.DictReader(f):              # каждая строка — dict по заголовку
        total += float(row["amount"])

with open("report.csv", "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=["city", "total"])
    w.writeheader()
    w.writerows(rows)</code></pre>
<div class="note">Для серьёзной работы с табличными данными используют pandas (<a href="#/l/10-4">урок 10.4</a>): <code>pd.read_csv("sales.csv")</code>.</div>`,
 check: [
  { id:'q7-2a', type:'single', prompt:'Во что превращается JSON null при json.loads?', options:['None','"null"','0','False'], answer:0, explanation:'И обратно.' },
  { id:'q7-2b', type:'single', prompt:'Зачем ensure_ascii=False в json.dumps?', options:['Чтобы кириллица осталась читаемой, а не \\uXXXX','Чтобы ускорить запись','Чтобы удалить не-ASCII символы','Для валидации'], answer:0, explanation:'По умолчанию не-ASCII экранируется.' }
 ]},
 { id:'7-3', title:'Дата и время', html:`
<pre><code>from datetime import datetime, date, timedelta, timezone
from zoneinfo import ZoneInfo

now = datetime.now(timezone.utc)                  # всегда «осознанное» время с зоной
moscow = now.astimezone(ZoneInfo("Europe/Moscow"))
deadline = now + timedelta(days=3, hours=2)
(deadline - now).total_seconds()

d = date(2025, 3, 8)
d.isoformat()                                      # '2025-03-08'
datetime.fromisoformat("2025-03-08T10:30:00+03:00")
now.strftime("%d.%m.%Y %H:%M")                     # формат для людей
datetime.strptime("08.03.2025", "%d.%m.%Y")        # разбор строки</code></pre>
<ul>
<li><b>Храните и передавайте время в UTC</b>, переводите в локальную зону только для показа.</li>
<li>«Наивный» <code>datetime</code> без <code>tzinfo</code> — источник ошибок с часовыми поясами и переходом на летнее время.</li>
<li>Для замеров длительности — <code>time.perf_counter()</code>, а не <code>datetime.now()</code>.</li>
</ul>
<h3>Регулярные выражения</h3>
<pre><code>import re
re.findall(r"\\d+", "заказ 12 и 345")                  # ['12', '345']
m = re.search(r"(?P&lt;user&gt;[\\w.]+)@(?P&lt;domain&gt;[\\w.]+)", text)
m["domain"] if m else None
re.sub(r"\\s+", " ", messy).strip()
EMAIL = re.compile(r"^[^@\\s]+@[^@\\s]+\\.[a-z]{2,}$", re.I)</code></pre>
<div class="note">Сырые строки <code>r"..."</code> обязательны для регулярных выражений: иначе <code>\\d</code> и <code>\\s</code> пришлось бы экранировать дважды.</div>`,
 check: [
  { id:'q7-3a', type:'single', prompt:'В каком часовом поясе лучше хранить время в базе и API?', options:['UTC','Локальном часовом поясе сервера','Часовом поясе пользователя','Без пояса'], answer:0, explanation:'Перевод в локальное — только при показе.' },
  { id:'q7-3b', type:'single', prompt:'Что найдёт re.findall(r"\\d+", "a1b22c333")?', options:['["1", "22", "333"]','["1", "2", "2", "3", "3", "3"]','["a", "b", "c"]','6'], answer:0, explanation:'\\d+ — одна и более цифр подряд.' }
 ]},
 { id:'7-4', title:'Командная строка и окружение', html:`
<pre><code>import argparse

def main():
    p = argparse.ArgumentParser(description="Отчёт по продажам")
    p.add_argument("path", type=Path, help="CSV-файл с продажами")
    p.add_argument("--month", type=int, choices=range(1, 13), required=True)
    p.add_argument("--top", type=int, default=5)
    p.add_argument("-v", "--verbose", action="store_true")
    args = p.parse_args()
    report(args.path, args.month, args.top)

if __name__ == "__main__":
    main()</code></pre>
<pre><code>$ python report.py sales.csv --month 3 --top 10 -v
$ python report.py --help             # справка генерируется автоматически</code></pre>
<p>Для больших CLI удобны библиотеки <code>click</code> и <code>typer</code> (на аннотациях типов).</p>
<h3>Переменные окружения и процессы</h3>
<pre><code>import os, sys, subprocess
api_key = os.environ["API_KEY"]                     # KeyError, если не задана — и правильно
debug = os.getenv("DEBUG", "0") == "1"
sys.argv, sys.exit(1)

result = subprocess.run(["git", "log", "-1", "--oneline"], capture_output=True, text=True, check=True)
print(result.stdout)</code></pre>
<div class="note warn"><b>Секреты</b> — ключи API, пароли БД — берут из переменных окружения (часто через файл <code>.env</code> и пакет <code>python-dotenv</code>), но никогда не пишут в код. Этот подход вы встретите и в Django (<code>SECRET_KEY</code>), и в SDK языковых моделей (<code>ANTHROPIC_API_KEY</code>).</div>`,
 check: [
  { id:'q7-4a', type:'single', prompt:'Как прочитать необязательную переменную окружения со значением по умолчанию?', options:['os.getenv("NAME", "default")','os.environ.NAME','sys.env("NAME")','env["NAME"] or default обязательно'], answer:0, explanation:'os.environ["NAME"] бросит KeyError.' },
  { id:'q7-4b', type:'single', prompt:'Почему subprocess.run лучше передавать список ["git", "log"], а не строку с shell=True?', options:['Нет интерпретации оболочкой — нет риска инъекции команд','Так быстрее','Строки запрещены','Нет разницы'], answer:0, explanation:'Особенно если в команде есть пользовательский ввод.' }
 ]}
 ],
 test: [
  { id:'t7-1', type:'single', prompt:'Почему open("f.txt") без encoding может сломаться на Windows?', options:['Будет использована системная кодировка, например cp1251, вместо UTF-8','Windows не поддерживает текстовые файлы','Нужен режим b','Файл откроется только для записи'], answer:0, explanation:'Указывайте encoding="utf-8" явно.', difficulty:1 },
  { id:'t7-2', type:'analyze', prompt:'Что не так?', code:'import json\nfrom datetime import datetime\njson.dumps({"created": datetime.now()})', options:['TypeError: datetime не сериализуется стандартным json','Нужно ensure_ascii','Ключ должен быть числом','Всё работает'], answer:0, explanation:'Преобразуйте в isoformat() или используйте default=.', difficulty:2 },
  { id:'t7-3', type:'match', prompt:'Сопоставьте модуль и задачу.', pairs:[['pathlib','Пути и файлы'],['zoneinfo','Часовые пояса'],['argparse','Аргументы командной строки'],['re','Регулярные выражения']], explanation:'Стандартная библиотека.', difficulty:1 },
  { id:'t7-4', type:'single', prompt:'Какой класс csv даёт каждую строку как словарь по заголовкам?', options:['csv.DictReader','csv.reader','csv.Sniffer','csv.writer'], answer:0, explanation:'Удобно обращаться по имени столбца.', difficulty:1 },
  { id:'t7-5', type:'single', prompt:'Чем измерять длительность операции?', options:['time.perf_counter()','datetime.now()','time.sleep()','date.today()'], answer:0, explanation:'Монотонные часы высокой точности.', difficulty:2 },
  { id:'t7-6', type:'single', prompt:'Где хранить API-ключ для скрипта?', options:['В переменной окружения (.env вне репозитория)','В коде константой','В README','В имени файла'], answer:0, explanation:'Секреты — вне кода и репозитория.', difficulty:1 },
  { id:'t7-7', type:'input', prompt:'Сколько дней в timedelta(weeks=2, days=3).days? Введите число.', answer:['17'], explanation:'14 + 3.', difficulty:1 },
  { id:'t7-8', type:'multiple', prompt:'Что умеет pathlib.Path? (несколько ответов)', options:['Склеивать пути оператором /','Читать и писать текст','Искать файлы по шаблону glob','Отправлять файлы по HTTP'], answer:[0,1,2], explanation:'HTTP — задача других библиотек.', difficulty:1 }
 ]
},
{
 id: 8, title: 'Типизация и тесты', short: 'Аннотации типов, mypy, обобщения, Pydantic, pytest',
 lessons: [
 { id:'8-1', title:'Аннотации типов', html:`
<p>Python остаётся динамическим, но к коду можно добавить <b>аннотации типов</b>. Интерпретатор их не проверяет — это делают IDE и анализаторы (mypy, pyright).</p>
<pre><code>def total(prices: list[float], discount: float = 0.0) -&gt; float:
    return sum(prices) * (1 - discount)

user_id: int = 42
tags: set[str] = set()
scores: dict[str, list[int]] = {}
point: tuple[float, float] = (0.0, 0.0)

def find_user(uid: int) -&gt; User | None:        # может вернуть None
    ...

def parse(value: str | bytes) -&gt; dict: ...</code></pre>
<div class="tbl"><table><tr><th>Запись</th><th>Смысл</th></tr>
<tr><td><code>list[int]</code>, <code>dict[str, float]</code></td><td>Коллекции с типом элементов</td></tr>
<tr><td><code>X | None</code></td><td>Значение или None (раньше <code>Optional[X]</code>)</td></tr>
<tr><td><code>A | B</code></td><td>Одно из (раньше <code>Union[A, B]</code>)</td></tr>
<tr><td><code>Callable[[int], str]</code></td><td>Функция int → str</td></tr>
<tr><td><code>Iterable[T]</code>, <code>Sequence[T]</code>, <code>Mapping[K, V]</code></td><td>Абстрактные типы для параметров (<code>collections.abc</code>)</td></tr>
<tr><td><code>Any</code></td><td>«Не проверять» — используйте как можно реже</td></tr>
<tr><td><code>Literal["asc", "desc"]</code></td><td>Только перечисленные значения</td></tr>
</table></div>
<div class="note why"><b>Зачем, если не проверяется при запуске?</b> Автодополнение и навигация в IDE, раннее обнаружение ошибок, документация прямо в сигнатуре. А ещё аннотации читают библиотеки: FastAPI, Pydantic, dataclasses, Django Ninja строят по ним валидацию и схемы.</div>`,
 check: [
  { id:'q8-1a', type:'single', prompt:'Что сделает интерпретатор при вызове f("a") для def f(x: int)?', options:['Выполнит код — аннотации не проверяются при запуске','Бросит TypeError до вызова','Преобразует "a" в int','Откажется запускать файл'], answer:0, explanation:'Проверяют mypy/pyright и IDE.' },
  { id:'q8-1b', type:'single', prompt:'Как аннотировать функцию, которая может вернуть пользователя или ничего?', options:['-> User | None','-> User?','-> Optional','-> None | Any'], answer:0, explanation:'Современная запись Union.' }
 ]},
 { id:'8-2', title:'mypy, обобщения и протоколы', html:`
<pre><code>$ pip install mypy
$ mypy src/                          # или pyright — встроен в VS Code (Pylance)
src/shop/orders.py:14: error: Item "None" of "User | None" has no attribute "email"</code></pre>
<pre><code>def notify(uid: int) -&gt; None:
    user = find_user(uid)
    send(user.email)          # mypy: user может быть None!
    if user is not None:      # сужение типа (narrowing)
        send(user.email)      # здесь user: User</code></pre>
<h3>Обобщения</h3>
<p class="small">Теория: <a href="../oop/#/l/4-4">ООП 4.4 «Обобщения»</a>.</p>
<pre><code>def first[T](items: Sequence[T]) -&gt; T | None:          # синтаксис Python 3.12
    return items[0] if items else None

class Repository[T]:
    def __init__(self) -&gt; None:
        self._items: dict[int, T] = {}
    def get(self, id: int) -&gt; T | None:
        return self._items.get(id)

repo = Repository[Product]()
p = repo.get(1)               # IDE знает: Product | None</code></pre>
<h3>TypedDict</h3>
<pre><code>from typing import TypedDict
class OrderJson(TypedDict):
    id: int
    items: list[str]
    coupon: str | None</code></pre>
<p>TypedDict описывает форму словаря — удобно для JSON, который не хочется превращать в класс.</p>
<div class="note"><b>Постепенная типизация.</b> Типы можно добавлять постепенно: начните с публичных функций и новых модулей, включите <code>mypy --strict</code> для них, а старый код оставьте как есть.</div>`,
 check: [
  { id:'q8-2a', type:'single', prompt:'Что такое сужение типа (narrowing)?', options:['Анализатор уточняет тип после проверки вроде if x is not None','Удаление типов из кода','Приведение int к float','Ограничение длины строки'], answer:0, explanation:'Внутри if тип уже без None.' },
  { id:'q8-2b', type:'single', prompt:'Для чего TypedDict?', options:['Описать ключи и типы значений словаря','Создать неизменяемый словарь','Ускорить словарь','Сортировать словарь'], answer:0, explanation:'Типизация JSON-подобных данных.' }
 ]},
 { id:'8-3', title:'Pydantic: валидация данных', html:`
<p><b>Pydantic</b> превращает аннотации типов в проверку и преобразование данных во время выполнения. Это стандарт де-факто для внешних данных: JSON от API, настройки, ответы языковых моделей.</p>
<pre><code>$ pip install pydantic pydantic-settings</code></pre>
<pre><code>from pydantic import BaseModel, Field, EmailStr, ValidationError
from datetime import datetime

class OrderItem(BaseModel):
    sku: str = Field(min_length=2)
    qty: int = Field(gt=0, le=100)

class Order(BaseModel):
    id: int
    email: EmailStr                     # нужен пакет email-validator
    items: list[OrderItem]
    created_at: datetime                # строка ISO → datetime
    coupon: str | None = None

raw = '{"id": "7", "email": "a@b.ru", "items": [{"sku": "A1", "qty": 2}], "created_at": "2025-03-08T10:00:00Z"}'
order = Order.model_validate_json(raw)      # "7" → 7, строка → datetime
order.items[0].qty
order.model_dump()                          # → dict
Order.model_json_schema()                   # JSON Schema

try:
    Order.model_validate({"id": 1, "email": "нет", "items": [], "created_at": "вчера"})
except ValidationError as e:
    print(e.errors())                       # список ошибок по полям</code></pre>
<pre><code>from pydantic_settings import BaseSettings
class Settings(BaseSettings):
    database_url: str
    debug: bool = False
    openai_api_key: str
settings = Settings()                       # читает переменные окружения и .env</code></pre>
<div class="note why"><b>Почему это важно для ИИ.</b> Pydantic описывает структурированный вывод языковых моделей и схемы инструментов агентов (см. <a href="../ai-agents/">курс «AI-агенты»</a>). FastAPI строит на нём весь API. В Django аналогичную роль играют формы и сериализаторы DRF.</div>`,
 check: [
  { id:'q8-3a', type:'single', prompt:'Что сделает Pydantic со значением "7" для поля id: int?', options:['Преобразует в 7 (режим по умолчанию — lax)','Бросит ошибку всегда','Оставит строку','Удалит поле'], answer:0, explanation:'В strict-режиме это была бы ошибка.' },
  { id:'q8-3b', type:'single', prompt:'Как получить JSON Schema модели Pydantic?', options:['Model.model_json_schema()','Model.schema_json_file()','json.dumps(Model)','Model.__dict__'], answer:0, explanation:'Её отдают языковой модели как описание формата.' }
 ]},
 { id:'8-4', title:'Тестирование с pytest', html:`
<pre><code>$ pip install pytest pytest-cov
$ pytest                         # найдёт tests/test_*.py
$ pytest -k discount -x -q       # по имени, остановиться на первой ошибке
$ pytest --cov=shop              # покрытие кода</code></pre>
<pre><code># tests/test_pricing.py
import pytest
from shop.pricing import apply_discount, Cart

def test_discount_reduces_price():
    assert apply_discount(1000, 10) == 900          # обычный assert — pytest покажет детали

@pytest.mark.parametrize("price, percent, expected", [
    (100, 0, 100),
    (100, 50, 50),
    (0, 10, 0),
])
def test_discount_table(price, percent, expected):
    assert apply_discount(price, percent) == expected

def test_negative_percent_rejected():
    with pytest.raises(ValueError, match="процент"):
        apply_discount(100, -5)

@pytest.fixture
def cart():                      # фикстура: подготовка данных, внедряется по имени параметра
    c = Cart()
    c.add("A1", qty=2, price=100)
    return c

def test_total(cart):
    assert cart.total() == 200

def test_report_saved(tmp_path):         # встроенная фикстура: временная папка
    save_report(tmp_path / "r.csv")
    assert (tmp_path / "r.csv").exists()</code></pre>
<h3>Подмена зависимостей</h3>
<pre><code>def test_fetch_rate(monkeypatch):
    monkeypatch.setattr("shop.rates.http_get", lambda url: {"rate": 92.5})
    assert get_usd_rate() == 92.5

from unittest.mock import Mock
notifier = Mock()
OrderService(notifier=notifier).place(order)
notifier.send.assert_called_once()</code></pre>
<p class="small">Почему зависимости удобно передавать параметром — <a href="../oop/#/l/6-4">ООП 6.4 «Внедрение зависимостей»</a>.</p>
<div class="note why"><b>В Django</b> тесты пишут на pytest с плагином <code>pytest-django</code>: те же фикстуры и assert, плюс тестовая база и клиент.</div>`,
 check: [
  { id:'q8-4a', type:'single', prompt:'Как проверить, что функция бросает ValueError?', options:['with pytest.raises(ValueError): ...','assert raises ValueError','try/except и pass','@pytest.error'], answer:0, explanation:'Контекстный менеджер pytest.' },
  { id:'q8-4b', type:'single', prompt:'Как pytest передаёт фикстуру в тест?', options:['По имени параметра тестовой функции','Через глобальную переменную','Через import','Через наследование'], answer:0, explanation:'def test_total(cart) получит фикстуру cart.' }
 ]}
 ],
 test: [
  { id:'t8-1', type:'match', prompt:'Сопоставьте аннотацию и смысл.', pairs:[['list[str]','Список строк'],['int | None','Число или None'],['Callable[[int], str]','Функция int → str'],['Literal["asc", "desc"]','Одно из двух значений']], explanation:'Основные типы.', difficulty:1 },
  { id:'t8-2', type:'single', prompt:'Какой инструмент проверяет аннотации типов без запуска программы?', options:['mypy или pyright','pytest','pip','venv'], answer:0, explanation:'Статический анализ.', difficulty:1 },
  { id:'t8-3', type:'analyze', prompt:'Что произойдёт?', code:'from pydantic import BaseModel, Field\nclass Item(BaseModel):\n    qty: int = Field(gt=0)\n\nItem(qty=0)', options:['ValidationError: qty должно быть больше 0','Создастся объект с qty=0','qty станет 1','TypeError'], answer:0, explanation:'Ограничение gt=0.', difficulty:1 },
  { id:'t8-4', type:'single', prompt:'Зачем @pytest.mark.parametrize?', options:['Запустить один тест на нескольких наборах данных','Пропустить тест','Задать порядок тестов','Подменить зависимость'], answer:0, explanation:'Каждый набор — отдельный случай в отчёте.', difficulty:1 },
  { id:'t8-5', type:'single', prompt:'Что даёт встроенная фикстура tmp_path?', options:['Временную папку, уникальную для теста','Путь к проекту','Путь к Python','Случайное имя файла без папки'], answer:0, explanation:'Тесты не мусорят на диске и не мешают друг другу.', difficulty:2 },
  { id:'t8-6', type:'single', prompt:'Как Pydantic-settings находит значение поля openai_api_key?', options:['В переменной окружения OPENAI_API_KEY (и в .env)','Только в коде','В pyproject.toml','Запрашивает у пользователя'], answer:0, explanation:'Регистр не важен по умолчанию.', difficulty:2 },
  { id:'t8-7', type:'single', prompt:'Как в 3.12 объявить обобщённую функцию first?', options:['def first[T](items: Sequence[T]) -> T | None','def first<T>(items)','def first(items: T) where T','generic def first(items)'], answer:0, explanation:'Новый синтаксис параметров типа.', difficulty:3 },
  { id:'t8-8', type:'multiple', prompt:'Какие библиотеки используют аннотации типов во время выполнения? (несколько ответов)', options:['Pydantic','FastAPI','dataclasses','math'], answer:[0,1,2], explanation:'math аннотации не читает.', difficulty:2 }
 ]
},
{
 id: 9, title: 'Конкурентность и asyncio', short: 'GIL, потоки и процессы, concurrent.futures, async/await, asyncio',
 lessons: [
 { id:'9-1', title:'GIL, потоки и процессы', html:`
<p>В CPython есть <b>GIL</b> (Global Interpreter Lock): в каждый момент байткод Python выполняет только один поток процесса. Отсюда правило выбора:</p>
<div class="tbl"><table><tr><th>Задача</th><th>Узкое место</th><th>Инструмент</th></tr>
<tr><td>Много HTTP-запросов, файлов, обращений к БД</td><td>Ожидание ввода-вывода</td><td>Потоки или asyncio — GIL отпускается на время ожидания</td></tr>
<tr><td>Тяжёлые вычисления на чистом Python</td><td>Процессор</td><td>Процессы (<code>multiprocessing</code>) — у каждого свой GIL</td></tr>
<tr><td>Вычисления в NumPy/PyTorch</td><td>Процессор/GPU</td><td>Библиотека сама распараллеливает в C/CUDA и отпускает GIL</td></tr>
</table></div>
<pre><code>import threading
lock = threading.Lock()
counter = 0

def work():
    global counter
    for _ in range(100_000):
        with lock:                   # без блокировки результат будет «плавать»
            counter += 1

threads = [threading.Thread(target=work) for _ in range(4)]
for t in threads: t.start()
for t in threads: t.join()</code></pre>
<div class="note"><b>Python без GIL.</b> С 3.13 есть экспериментальная сборка «free-threaded» без GIL. Пока она не основная, но направление развития языка понятно: потоки станут полезны и для вычислений.</div>`,
 check: [
  { id:'q9-1a', type:'single', prompt:'Что ускорит обработку 1000 изображений чистым Python-кодом на 8 ядрах?', options:['Процессы (multiprocessing / ProcessPoolExecutor)','Потоки','asyncio','Ничего не ускорит'], answer:0, explanation:'Из-за GIL потоки не ускоряют вычисления.' },
  { id:'q9-1b', type:'single', prompt:'Почему потоки помогают при множестве HTTP-запросов, несмотря на GIL?', options:['Во время ожидания сети GIL отпускается','GIL не действует на сеть','Потоки обходят GIL всегда','Не помогают'], answer:0, explanation:'Ожидание ввода-вывода параллелится.' }
 ]},
 { id:'9-2', title:'concurrent.futures', html:`
<p>Высокоуровневый интерфейс к пулам потоков и процессов:</p>
<pre><code>from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor, as_completed
import httpx

urls = [f"https://api.example.com/items/{i}" for i in range(100)]

def fetch(url):
    return httpx.get(url, timeout=10).json()

with ThreadPoolExecutor(max_workers=20) as pool:        # ввод-вывод → потоки
    results = list(pool.map(fetch, urls))

def heavy(n):
    return sum(i * i for i in range(n))

if __name__ == "__main__":                              # обязательно для процессов на Windows/macOS
    with ProcessPoolExecutor() as pool:                 # вычисления → процессы
        futures = {pool.submit(heavy, n): n for n in [10**7] * 8}
        for f in as_completed(futures):
            print(futures[f], f.result())</code></pre>
<ul>
<li><code>map</code> возвращает результаты в исходном порядке; <code>as_completed</code> — по мере готовности.</li>
<li>Исключение внутри задачи выбрасывается при вызове <code>f.result()</code>.</li>
<li>Аргументы и результаты процессов передаются через pickle — передавайте простые данные, а не открытые файлы и соединения.</li>
</ul>`,
 check: [
  { id:'q9-2a', type:'single', prompt:'Зачем if __name__ == "__main__" при использовании процессов?', options:['Дочерние процессы импортируют модуль заново и иначе запустили бы пул рекурсивно','Для скорости','Так требует GIL','Не нужно'], answer:0, explanation:'На Windows и macOS процессы стартуют через spawn.' },
  { id:'q9-2b', type:'single', prompt:'Как получить результаты пула по мере готовности, а не по порядку?', options:['as_completed(futures)','pool.map','sorted(futures)','pool.wait_all'], answer:0, explanation:'map сохраняет порядок входа.' }
 ]},
 { id:'9-3', title:'async и await', html:`
<p><b>asyncio</b> — однопоточная кооперативная многозадачность: тысячи операций ввода-вывода переключаются в одном потоке в точках <code>await</code>.</p>
<pre><code>import asyncio

async def fetch_price(sku: str) -&gt; float:     # корутина
    await asyncio.sleep(1)                      # имитация сетевого ожидания
    return 100.0

async def main():
    p = await fetch_price("A1")                 # последовательно: 1 с
    prices = await asyncio.gather(              # одновременно: ~1 с для всех трёх
        fetch_price("A1"), fetch_price("B2"), fetch_price("C3"),
    )
    print(prices)

asyncio.run(main())                             # точка входа: запускает цикл событий</code></pre>
<div data-widget="eventloop"></div>
<ul>
<li>Вызов <code>fetch_price("A1")</code> без <code>await</code> только создаёт корутину — ничего не выполняется.</li>
<li><code>await</code> можно писать только внутри <code>async def</code>.</li>
<li>Блокирующий вызов (<code>time.sleep</code>, <code>requests.get</code>, тяжёлый цикл) внутри корутины останавливает <b>весь</b> цикл событий. Используйте async-библиотеки или <code>await asyncio.to_thread(func)</code>.</li>
</ul>
<p class="small">Модель async/await одинакова в Python, C#, JavaScript; в Python цикл событий запускается явно через <code>asyncio.run</code>.</p>`,
 check: [
  { id:'q9-3a', type:'single', prompt:'Что произойдёт при вызове async-функции без await?', options:['Создастся объект-корутина, код не выполнится','Функция выполнится синхронно','Ошибка синтаксиса','Функция выполнится в фоне'], answer:0, explanation:'Python предупредит: coroutine was never awaited.' },
  { id:'q9-3b', type:'single', prompt:'Что будет, если внутри корутины вызвать time.sleep(5)?', options:['Заблокируется весь цикл событий на 5 секунд','Заснёт только эта корутина','Ошибка','Вызов будет пропущен'], answer:0, explanation:'Нужно await asyncio.sleep(5).' }
 ]},
 { id:'9-4', title:'asyncio на практике', html:`
<pre><code>import asyncio, httpx

async def fetch(client: httpx.AsyncClient, url: str, sem: asyncio.Semaphore) -&gt; dict:
    async with sem:                                   # не больше N запросов одновременно
        r = await client.get(url, timeout=10)
        r.raise_for_status()
        return r.json()

async def main(urls: list[str]):
    sem = asyncio.Semaphore(10)
    async with httpx.AsyncClient() as client:         # асинхронный контекстный менеджер
        results = await asyncio.gather(
            *(fetch(client, u, sem) for u in urls),
            return_exceptions=True,                   # ошибки вернуть, а не прервать всё
        )
    ok = [r for r in results if not isinstance(r, Exception)]
    print(len(ok), "успешно")

async def with_timeout():
    try:
        async with asyncio.timeout(5):                # Python 3.11+
            await slow_operation()
    except TimeoutError:
        print("Не дождались")

async def producer_consumer():
    q: asyncio.Queue[str] = asyncio.Queue()
    async with asyncio.TaskGroup() as tg:             # структурная конкурентность 3.11+
        tg.create_task(producer(q))
        tg.create_task(consumer(q))</code></pre>
<div class="tbl"><table><tr><th>Синхронно</th><th>Асинхронно</th></tr>
<tr><td><code>requests</code></td><td><code>httpx.AsyncClient</code>, <code>aiohttp</code></td></tr>
<tr><td><code>time.sleep</code></td><td><code>asyncio.sleep</code></td></tr>
<tr><td><code>open()</code></td><td><code>aiofiles</code> или <code>asyncio.to_thread</code></td></tr>
<tr><td><code>psycopg</code> (sync)</td><td><code>psycopg</code> async, <code>asyncpg</code></td></tr>
</table></div>
<div class="note why"><b>Где это нужно дальше.</b> SDK языковых моделей имеют async-клиенты (<code>AsyncAnthropic</code>, <code>AsyncOpenAI</code>) и потоковые ответы через <code>async for</code>. Django поддерживает async-представления и async ORM-запросы, FastAPI построен на asyncio целиком.</div>`,
 check: [
  { id:'q9-4a', type:'single', prompt:'Как ограничить число одновременных запросов в asyncio?', options:['asyncio.Semaphore','time.sleep','threading.Lock','Нельзя'], answer:0, explanation:'async with sem вокруг запроса.' },
  { id:'q9-4b', type:'single', prompt:'Что делает return_exceptions=True в gather?', options:['Возвращает исключения в списке результатов вместо прерывания всех задач','Подавляет исключения навсегда','Повторяет упавшие задачи','Ускоряет gather'], answer:0, explanation:'Удобно, когда часть запросов может упасть.' }
 ]}
 ],
 test: [
  { id:'t9-1', type:'match', prompt:'Сопоставьте задачу и инструмент.', pairs:[['1000 HTTP-запросов','asyncio или потоки'],['Перебор чисел на чистом Python на 8 ядрах','Процессы'],['Матричное умножение','NumPy'],['Ожидание с таймаутом в async-коде','asyncio.timeout']], explanation:'Выбор по узкому месту.', difficulty:2 },
  { id:'t9-2', type:'analyze', prompt:'Сколько примерно займёт main()?', code:'async def job():\n    await asyncio.sleep(2)\n\nasync def main():\n    await asyncio.gather(job(), job(), job())\n\nasyncio.run(main())', options:['≈2 с','≈6 с','≈0 с','≈4 с'], answer:0, explanation:'Три ожидания идут одновременно.', difficulty:1 },
  { id:'t9-3', type:'analyze', prompt:'А теперь?', code:'async def job():\n    time.sleep(2)\n\nasync def main():\n    await asyncio.gather(job(), job(), job())', options:['≈6 с — time.sleep блокирует цикл событий','≈2 с','≈0 с','Ошибка'], answer:0, explanation:'Блокирующий вызов не отдаёт управление.', difficulty:2 },
  { id:'t9-4', type:'single', prompt:'Что такое GIL?', options:['Блокировка, позволяющая только одному потоку выполнять байткод Python одновременно','Менеджер пакетов','Сборщик мусора','Формат файлов'], answer:0, explanation:'Global Interpreter Lock в CPython.', difficulty:1 },
  { id:'t9-5', type:'single', prompt:'Как вызвать блокирующую функцию из async-кода, не останавливая цикл?', options:['await asyncio.to_thread(func, *args)','func() напрямую','asyncio.block(func)','await func'], answer:0, explanation:'Функция выполнится в пуле потоков.', difficulty:2 },
  { id:'t9-6', type:'single', prompt:'Почему counter += 1 в нескольких потоках без Lock даёт неверный итог?', options:['Операция не атомарна: чтение, сложение и запись могут перемежаться','GIL запрещает потоки','Python округляет числа','Так не бывает'], answer:0, explanation:'GIL не делает составные операции атомарными.', difficulty:2 },
  { id:'t9-7', type:'single', prompt:'Как запустить асинхронную функцию main из обычного скрипта?', options:['asyncio.run(main())','main()','await main()','asyncio.start(main)'], answer:0, explanation:'Точка входа в цикл событий.', difficulty:1 },
  { id:'t9-8', type:'multiple', prompt:'Что верно про TaskGroup (3.11+)? (несколько ответов)', options:['Дожидается всех задач при выходе из блока','При ошибке одной задачи отменяет остальные','Это async-контекстный менеджер','Запускает задачи в отдельных процессах'], answer:[0,1,2], explanation:'Всё в одном цикле событий.', difficulty:3 }
 ]
},
{
 id: 10, title: 'Данные: HTTP, SQL, NumPy, pandas', short: 'Работа с API, sqlite3, массивы NumPy, таблицы pandas, Jupyter',
 lessons: [
 { id:'10-1', title:'HTTP-клиенты и работа с API', html:`
<pre><code>import httpx                 # или requests — синхронный и очень популярный

with httpx.Client(base_url="https://api.github.com", timeout=10,
                  headers={"Accept": "application/vnd.github+json"}) as client:
    r = client.get("/repos/python/cpython", params={"per_page": 5})
    r.raise_for_status()                 # 4xx/5xx → исключение
    repo = r.json()
    print(repo["stargazers_count"])

    r = client.post("/some/endpoint", json={"name": "test"})   # тело в JSON
    r.status_code, r.headers["content-type"]</code></pre>
<ul>
<li>Всегда задавайте <b>таймаут</b> — иначе зависший сервер подвесит программу.</li>
<li>Переиспользуйте <code>Client</code>/<code>Session</code> — он держит пул соединений.</li>
<li>Ответ сразу превращайте в модель: <code>Repo.model_validate(r.json())</code> (Pydantic).</li>
<li>Ключи API — из переменных окружения, в заголовке <code>Authorization</code>.</li>
<li>Повторы с паузой при 429/503 — библиотека <code>tenacity</code> или транспорт httpx с retries.</li>
</ul>
<p class="small">Что происходит под капотом запроса — DNS, TCP, TLS, HTTP — в <a href="../network/">курсе «Сети»</a>.</p>
<div class="note why"><b>Почти весь «ИИ в приложении»</b> — это HTTP-вызовы API языковых моделей. Официальные SDK (<code>anthropic</code>, <code>openai</code>) — удобные обёртки над тем же httpx.</div>`,
 check: [
  { id:'q10-1a', type:'single', prompt:'Что делает r.raise_for_status()?', options:['Бросает исключение, если код ответа 4xx или 5xx','Повторяет запрос','Печатает статус','Возвращает True/False'], answer:0, explanation:'Иначе ошибку легко пропустить.' },
  { id:'q10-1b', type:'single', prompt:'Почему важно указать timeout?', options:['Без него запрос к зависшему серверу может ждать бесконечно','Так быстрее','Без него не работает HTTPS','Это требование JSON'], answer:0, explanation:'Таймаут — обязательная часть надёжного кода.' }
 ]},
 { id:'10-2', title:'SQL и sqlite3', html:`
<p>Python содержит встроенную базу <b>SQLite</b> — файл на диске без отдельного сервера.</p>
<pre><code>import sqlite3

with sqlite3.connect("shop.db") as conn:          # with: commit при успехе, rollback при ошибке
    conn.row_factory = sqlite3.Row                # строки как словари
    conn.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            price REAL NOT NULL
        )""")
    conn.executemany("INSERT INTO products(name, price) VALUES (?, ?)",
                     [("Книга", 500), ("Ручка", 50)])

    max_price = 100
    rows = conn.execute("SELECT name, price FROM products WHERE price &lt; ?", (max_price,)).fetchall()
    for r in rows:
        print(r["name"], r["price"])</code></pre>
<div class="note warn"><b>SQL-инъекция.</b> Никогда не подставляйте значения в SQL f-строкой: <code>f"... WHERE name = '{name}'"</code>. Только параметры <code>?</code> (или <code>%s</code> в PostgreSQL-драйверах) — драйвер экранирует их сам.</div>
<h3>ORM</h3>
<p>В приложениях SQL чаще пишут через <b>ORM</b> — классы вместо таблиц:</p>
<pre><code># так выглядит ORM в Django (подробно — уже в курсе Django)
class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)

Product.objects.filter(price__lt=100).order_by("name")</code></pre>
<p>Понимание SQL и того, что ORM генерирует под капотом, отличает уверенного разработчика: так находят медленные запросы и проблему N+1. Вне Django популярен <b>SQLAlchemy</b>.</p>`,
 check: [
  { id:'q10-2a', type:'single', prompt:'Как безопасно подставить значение в SQL-запрос sqlite3?', options:['Параметром: execute("... WHERE id = ?", (uid,))','f-строкой','Через % форматирование строки','Конкатенацией'], answer:0, explanation:'Иначе — SQL-инъекция.' },
  { id:'q10-2b', type:'single', prompt:'Что такое ORM?', options:['Слой, позволяющий работать с таблицами как с классами и объектами','Формат базы данных','Сервер БД','Язык запросов вместо SQL на сервере'], answer:0, explanation:'Django ORM, SQLAlchemy.' }
 ]},
 { id:'10-3', title:'NumPy: массивы и векторизация', html:`
<p><b>NumPy</b> — фундамент научного Python и ИИ: многомерные массивы одного типа и быстрые операции над ними, реализованные на C.</p>
<pre><code>import numpy as np

a = np.array([1, 2, 3, 4])
a * 2                    # array([2, 4, 6, 8]) — без цикла
a + np.array([10, 20, 30, 40])
a.mean(), a.std(), a.sum(), a.max()
a[a &gt; 2]                 # фильтр маской: array([3, 4])

m = np.arange(12).reshape(3, 4)    # матрица 3×4
m.shape                  # (3, 4)
m[0], m[:, 1]            # первая строка, второй столбец
m.T                      # транспонирование
m @ m.T                  # матричное умножение 3×3
m.sum(axis=0)            # суммы по столбцам

np.zeros((2, 3)), np.ones(5), np.linspace(0, 1, 5)
rng = np.random.default_rng(42)
rng.normal(size=(1000,))</code></pre>
<div class="tbl"><table><tr><th>Понятие</th><th>Смысл</th></tr>
<tr><td>Векторизация</td><td>Операция над всем массивом вместо цикла — в десятки раз быстрее</td></tr>
<tr><td><code>shape</code>, <code>dtype</code></td><td>Размерности и тип элементов (<code>float32</code>, <code>int64</code>)</td></tr>
<tr><td>Broadcasting</td><td>Массивы разной формы автоматически «растягиваются»: <code>m + np.array([1, 2, 3, 4])</code></td></tr>
<tr><td><code>axis</code></td><td>Вдоль какой оси агрегировать</td></tr>
</table></div>
<div class="note why"><b>Мост к ИИ.</b> Тензоры PyTorch и TensorFlow — это «NumPy-массивы на GPU с автоматическим дифференцированием». Понимание shape, axis и broadcasting — половина отладки нейросетей: большинство ошибок там — «формы не совпадают».</div>`,
 check: [
  { id:'q10-3a', type:'single', prompt:'Какая shape у np.arange(12).reshape(3, 4).T?', options:['(4, 3)','(3, 4)','(12,)','(4, 4)'], answer:0, explanation:'Транспонирование меняет оси местами.' },
  { id:'q10-3b', type:'single', prompt:'Почему a * 2 для массива NumPy быстрее цикла Python?', options:['Операция выполняется в скомпилированном C-коде над всем массивом сразу','NumPy использует asyncio','Python кэширует результат','Не быстрее'], answer:0, explanation:'Векторизация.' }
 ]},
 { id:'10-4', title:'pandas и Jupyter', html:`
<p><b>pandas</b> — таблицы (<code>DataFrame</code>) в памяти: загрузка, очистка, группировка, объединение. Основной инструмент анализа данных и подготовки датасетов.</p>
<pre><code>import pandas as pd

df = pd.read_csv("sales.csv", parse_dates=["date"])
df.head(), df.info(), df.describe()
df["amount"].mean()
df[df["city"] == "Москва"]                          # фильтр строк
df[["date", "amount"]]                              # выбор столбцов
df["month"] = df["date"].dt.month                   # новый столбец
df = df.dropna(subset=["amount"])                   # убрать пропуски

by_city = (df.groupby("city")["amount"]
             .agg(["count", "sum", "mean"])
             .sort_values("sum", ascending=False))

merged = df.merge(customers, on="customer_id", how="left")   # как JOIN в SQL
by_city.to_csv("report.csv")
df.plot(x="date", y="amount")                       # график через matplotlib</code></pre>
<h3>Jupyter</h3>
<pre><code>$ pip install jupyterlab pandas matplotlib
$ jupyter lab</code></pre>
<p>Блокнот состоит из ячеек: код выполняется по ячейкам, таблицы и графики показываются прямо под ними. Идеально для исследования данных и экспериментов с моделями; для продакшен-кода переносите проверенную логику в модули и покрывайте тестами.</p>
<div class="note warn"><b>Ловушка блокнотов</b> — порядок выполнения ячеек. Перед тем как делиться блокнотом, выполните «Restart &amp; Run All»: результат должен воспроизводиться сверху вниз.</div>
<div class="note why"><b>В ML</b> pandas готовит признаки, а затем данные уходят в scikit-learn (<code>model.fit(df[features], df["target"])</code>) или превращаются в тензоры. Альтернатива для очень больших таблиц — <b>Polars</b>.</div>`,
 check: [
  { id:'q10-4a', type:'single', prompt:'Как посчитать сумму продаж по городам в pandas?', options:['df.groupby("city")["amount"].sum()','df.sum("city")','df["city"].amount()','df.group("city")'], answer:0, explanation:'groupby → выбор столбца → агрегат.' },
  { id:'q10-4b', type:'single', prompt:'Что сделать перед тем, как отправить блокнот коллеге?', options:['Restart & Run All — проверить воспроизводимость сверху вниз','Удалить все ячейки с кодом','Сохранить как PDF обязательно','Ничего'], answer:0, explanation:'Ячейки могли выполняться в произвольном порядке.' }
 ]}
 ],
 test: [
  { id:'t10-1', type:'analyze', prompt:'Что опасного в коде?', code:'name = request_args["name"]\nconn.execute(f"SELECT * FROM users WHERE name = \'{name}\'")', options:['SQL-инъекция: значение подставлено в строку запроса','Нет commit','Неверный синтаксис f-строки','Ничего'], answer:0, explanation:'Используйте параметры ?.', difficulty:1 },
  { id:'t10-2', type:'single', prompt:'Что выведет np.array([1, 2, 3]) + 10?', options:['array([11, 12, 13])','array([1, 2, 3, 10])','Ошибку','13'], answer:0, explanation:'Broadcasting скаляра.', difficulty:1 },
  { id:'t10-3', type:'match', prompt:'Сопоставьте библиотеку и назначение.', pairs:[['httpx','HTTP-запросы'],['NumPy','Массивы и линейная алгебра'],['pandas','Табличные данные'],['sqlite3','Встроенная база SQL']], explanation:'Экосистема данных.', difficulty:1 },
  { id:'t10-4', type:'input', prompt:'Какая будет shape у np.zeros((2, 3)).sum(axis=0)? Введите как (n,).', answer:['(3,)','(3, )','3'], explanation:'Сумма по строкам оставляет 3 столбца.', difficulty:2 },
  { id:'t10-5', type:'single', prompt:'Как объединить две таблицы pandas по customer_id, сохранив все строки левой?', options:['df.merge(other, on="customer_id", how="left")','df + other','pd.concat([df, other]) всегда','df.join_all(other)'], answer:0, explanation:'Аналог LEFT JOIN.', difficulty:2 },
  { id:'t10-6', type:'single', prompt:'Зачем переиспользовать httpx.Client вместо httpx.get в цикле?', options:['Пул соединений: не устанавливается новое TCP/TLS-соединение на каждый запрос','Так требует JSON','Client работает только с GitHub','Нет разницы'], answer:0, explanation:'Заметно быстрее при множестве запросов.', difficulty:2 },
  { id:'t10-7', type:'single', prompt:'Что такое тензор PyTorch по отношению к NumPy-массиву?', options:['Похожий многомерный массив, который может жить на GPU и поддерживает автодифференцирование','Таблица pandas','Список Python','Файл модели'], answer:0, explanation:'Навыки NumPy переносятся напрямую.', difficulty:2 },
  { id:'t10-8', type:'multiple', prompt:'Что делает DataFrame.groupby(...).agg(["count", "sum"])? (несколько ответов)', options:['Группирует строки по ключу','Считает количество в каждой группе','Считает сумму в каждой группе','Удаляет исходный DataFrame'], answer:[0,1,2], explanation:'Исходные данные не меняются.', difficulty:1 }
 ]
},
{
 id: 11, title: 'Что дальше: Django и ИИ', short: 'Инструменты проекта, дорожка в Django, дорожка в данные и ИИ, итоговый проект',
 lessons: [
 { id:'11-1', title:'Инструменты профессионального проекта', html:`
<p>Перед переходом к фреймворкам соберите «джентльменский набор» проекта:</p>
<pre><code>myproject/
├─ pyproject.toml          зависимости, ruff, mypy, pytest
├─ uv.lock                 точные версии
├─ .python-version
├─ .env.example            какие переменные окружения нужны (без значений)
├─ .gitignore              .venv/, __pycache__/, .env
├─ .pre-commit-config.yaml проверки перед коммитом
├─ src/myproject/...
└─ tests/...</code></pre>
<pre><code># .pre-commit-config.yaml
repos:
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.8.0
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format</code></pre>
<pre><code>$ pre-commit install            # проверки запускаются при каждом git commit
$ uv run ruff check . &amp;&amp; uv run mypy src &amp;&amp; uv run pytest   # то же — в CI</code></pre>
<h3>Python в контейнере</h3>
<pre><code>FROM python:3.13-slim
WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN pip install uv &amp;&amp; uv sync --frozen --no-dev
COPY src ./src
USER nobody
CMD ["uv", "run", "python", "-m", "myproject"]</code></pre>
<p class="small">Контейнеры и CI/CD подробно — в <a href="../devops/">курсе DevOps</a>.</p>`,
 check: [
  { id:'q11-1a', type:'single', prompt:'Зачем файл .env.example?', options:['Показать, какие переменные окружения нужны, без реальных секретов','Хранить пароли','Заменить pyproject.toml','Для Docker обязательно'], answer:0, explanation:'Сам .env — в .gitignore.' },
  { id:'q11-1b', type:'single', prompt:'Что делает pre-commit?', options:['Запускает проверки (линтер, форматтер) перед каждым коммитом','Публикует пакет','Создаёт окружение','Запускает сервер'], answer:0, explanation:'Ошибки ловятся до того, как попадут в репозиторий.' }
 ]},
 { id:'11-2', title:'Дорожка в Django', html:`
<p><b>Django</b> — веб-фреймворк «с батарейками»: ORM, миграции, админка, формы, аутентификация, шаблоны, защита от типичных атак — всё из коробки.</p>
<p>Что из этого курса понадобится в Django в первый же день:</p>
<div class="tbl"><table><tr><th>В Django</th><th>Основа из курса</th></tr>
<tr><td>Модели <code>class Product(models.Model)</code></td><td>Классы и наследование, атрибуты класса (<a href="#/l/4-1">4.1</a>, <a href="#/l/4-3">4.3</a>)</td></tr>
<tr><td>QuerySet: <code>.filter().order_by()</code>, ленивость</td><td>Итераторы, ленивые вычисления, SQL (<a href="#/l/5-1">5.1</a>, <a href="#/l/10-2">10.2</a>)</td></tr>
<tr><td>Class-based views и миксины</td><td>MRO, <code>super()</code>, миксины (<a href="#/l/4-3">4.3</a>)</td></tr>
<tr><td><code>@login_required</code>, <code>@admin.register</code></td><td>Декораторы (<a href="#/l/3-4">3.4</a>)</td></tr>
<tr><td><code>def save(self, *args, **kwargs)</code></td><td>Гибкие параметры (<a href="#/l/3-1">3.1</a>)</td></tr>
<tr><td><code>transaction.atomic()</code></td><td>Контекстные менеджеры (<a href="#/l/5-4">5.4</a>)</td></tr>
<tr><td>settings.py, приложения, импорт</td><td>Модули, пакеты, переменные окружения (<a href="#/l/6-2">6.2</a>, <a href="#/l/7-4">7.4</a>)</td></tr>
<tr><td>Шаблоны и контекст</td><td>Словари (<a href="#/l/2-2">2.2</a>)</td></tr>
<tr><td>Тесты pytest-django</td><td>pytest, фикстуры (<a href="#/l/8-4">8.4</a>)</td></tr>
<tr><td>Async views, Channels</td><td>asyncio (<a href="#/l/9-3">9.3</a>)</td></tr>
</table></div>
<pre><code>$ pip install django
$ django-admin startproject config .
$ python manage.py startapp shop
$ python manage.py runserver</code></pre>
<h3>Порядок изучения</h3>
<ol class="steps">
<li>Официальный учебник Django «Writing your first Django app» (части 1–8).</li>
<li>Модели, миграции, админка, ORM-запросы, связи.</li>
<li>Представления, URL, шаблоны, формы.</li>
<li>Аутентификация и права.</li>
<li>Django REST Framework (или Django Ninja) — API для фронтенда и мобильных приложений.</li>
<li>Тесты, кэширование, фоновые задачи (Celery), деплой.</li>
</ol>
<div class="note"><b>Соседи по экосистеме.</b> <b>FastAPI</b> — для лёгких API на аннотациях типов и Pydantic; <b>Flask</b> — минималистичный фреймворк. Знание основ из этого курса переносится на все три.</div>`,
 check: [
  { id:'q11-2a', type:'single', prompt:'Какая тема курса нужна, чтобы понимать class OrderList(LoginRequiredMixin, ListView)?', options:['Множественное наследование, миксины и MRO','Только строки','Только asyncio','NumPy'], answer:0, explanation:'Порядок базовых классов важен.' },
  { id:'q11-2b', type:'single', prompt:'Какой командой создают новый Django-проект?', options:['django-admin startproject','pip new django','python -m venv django','django init'], answer:0, explanation:'startapp — для приложения внутри проекта.' }
 ]},
 { id:'11-3', title:'Дорожка в данные и ИИ', html:`
<p>У «ИИ на Python» две большие ветки. Обе опираются на этот курс.</p>
<div class="tbl"><table><tr><th>Ветка</th><th>Что делают</th><th>Инструменты</th></tr>
<tr><td>Машинное обучение</td><td>Обучают модели на своих данных: прогнозы, классификация, рекомендации, компьютерное зрение</td><td>NumPy, pandas, scikit-learn, PyTorch, Jupyter</td></tr>
<tr><td>Приложения на LLM</td><td>Используют готовые языковые модели: чат-боты, RAG, агенты, извлечение данных</td><td>SDK Anthropic/OpenAI, Pydantic, asyncio, векторные БД</td></tr>
</table></div>
<h3>Классическое ML за 10 строк</h3>
<pre><code>from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

X, y = df[["age", "income", "visits"]], df["churned"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestClassifier().fit(X_train, y_train)
print(accuracy_score(y_test, model.predict(X_test)))</code></pre>
<h3>Вызов языковой модели</h3>
<pre><code>import anthropic                         # pip install anthropic; ключ — в ANTHROPIC_API_KEY

client = anthropic.Anthropic()
msg = client.messages.create(
    model="claude-sonnet-5-5",
    max_tokens=500,
    messages=[{"role": "user", "content": "Объясни генераторы Python в двух предложениях"}],
)
print(msg.content[0].text)</code></pre>
<p>Всё, что здесь использовано, — словари, клиент-объект, переменные окружения, а для серьёзных задач ещё Pydantic, asyncio и генераторы для стриминга — вы уже знаете.</p>
<h3>Порядок изучения</h3>
<ol class="steps">
<li>Математика по необходимости: линейная алгебра, вероятности, производные — на уровне интуиции.</li>
<li>Анализ данных: NumPy, pandas, визуализация (matplotlib, seaborn) — на реальных датасетах Kaggle.</li>
<li>Классическое ML: scikit-learn, валидация, метрики, переобучение.</li>
<li>Глубокое обучение: PyTorch, тензоры, обучение на GPU, Hugging Face.</li>
<li>Приложения на LLM: <a href="../ai-agents/">курс «AI-агенты для разработчиков»</a> — промптинг, RAG, инструменты, оценка качества.</li>
</ol>`,
 check: [
  { id:'q11-3a', type:'single', prompt:'Какая библиотека — стандарт для классического машинного обучения?', options:['scikit-learn','Django','httpx','pytest'], answer:0, explanation:'fit / predict / метрики.' },
  { id:'q11-3b', type:'single', prompt:'Где хранить ключ API языковой модели?', options:['В переменной окружения','В коде','В блокноте Jupyter открытым текстом','В имени модели'], answer:0, explanation:'SDK читают его из окружения сами.' }
 ]},
 { id:'11-4', title:'Итоговый проект и ресурсы', html:`
<p>Закрепите курс проектом, который пригодится на обеих дорожках: <b>«Трекер расходов»</b>.</p>
<ol class="steps">
<li>Проект на uv: <code>pyproject.toml</code>, ruff, mypy, pytest, pre-commit.</li>
<li>Модели <code>@dataclass</code> или Pydantic: <code>Expense(amount: Decimal, category: str, date: date, note: str | None)</code>.</li>
<li>Хранение в SQLite через <code>sqlite3</code> с параметризованными запросами.</li>
<li>CLI на argparse или typer: добавить расход, отчёт за месяц, импорт из CSV банка.</li>
<li>Курсы валют из публичного API через httpx с таймаутом и кэшем (<code>@functools.cache</code>).</li>
<li>Асинхронная загрузка курсов за несколько дат через <code>asyncio.gather</code>.</li>
<li>Jupyter-блокнот с анализом: траты по категориям и месяцам в pandas, график.</li>
<li>Бонус для ИИ: автоматическая категоризация трат по описанию через LLM со структурированным ответом в Pydantic-модель.</li>
<li>Тесты: расчёты, импорт CSV (фикстура <code>tmp_path</code>), подмена HTTP-клиента.</li>
</ol>
<p>Дальше этот же проект естественно превращается в веб-приложение на Django (модели, админка, формы) — или в ML-задачу «предсказать траты следующего месяца».</p>
<h3>Ресурсы</h3>
<ul>
<li>docs.python.org — официальный учебник (Tutorial) и справочник стандартной библиотеки.</li>
<li>Лусиану Рамальо, «Python. К вершинам мастерства» (Fluent Python) — как устроен язык изнутри.</li>
<li>Real Python — практические статьи по любой теме.</li>
<li>docs.djangoproject.com — учебник Django; scikit-learn.org и pytorch.org — учебники по ML.</li>
</ul>
<div class="note why"><b>Итог.</b> Вы знаете Python на уровне, достаточном для любого фреймворка: язык, ООП в его питоническом варианте (теория — в <a href="../oop/">курсе ООП</a>), стандартную библиотеку, типы, тесты, асинхронность и основы работы с данными.</div>`,
 check: [
  { id:'q11-4a', type:'single', prompt:'Какой тип выбрать для суммы расхода в трекере?', options:['Decimal','float','str','bool'], answer:0, explanation:'Точная десятичная арифметика для денег (int в копейках тоже допустим).' },
  { id:'q11-4b', type:'multiple', prompt:'Какие темы курса задействованы в итоговом проекте? (несколько ответов)', options:['dataclass / Pydantic','sqlite3','asyncio','Множественное наследование классов обязательно'], answer:[0,1,2], explanation:'Наследование там не требуется.' }
 ]}
 ],
 test: [
  { id:'t11-1', type:'match', prompt:'Сопоставьте задачу и инструмент.', pairs:[['Веб-приложение с админкой и ORM','Django'],['Лёгкий API на аннотациях типов','FastAPI'],['Классическое ML','scikit-learn'],['Нейросети','PyTorch']], explanation:'Экосистема Python.', difficulty:1 },
  { id:'t11-2', type:'single', prompt:'Что должно лежать в .gitignore Python-проекта?', options:['.venv/, __pycache__/, .env','pyproject.toml','tests/','uv.lock'], answer:0, explanation:'Lock-файл и конфигурация коммитятся.', difficulty:1 },
  { id:'t11-3', type:'single', prompt:'Какой навык курса поможет понять, почему queryset Django не выполняет SQL до перебора?', options:['Ленивые вычисления и итераторы','f-строки','Enum','argparse'], answer:0, explanation:'QuerySet ленив, как генератор.', difficulty:2 },
  { id:'t11-4', type:'single', prompt:'Какой курс этой серии продолжает тему приложений на языковых моделях?', options:['«AI-агенты для разработчиков»','«Сети для разработчиков»','«DevOps»','«ASP.NET Core»'], answer:0, explanation:'Промптинг, RAG, инструменты, оценка.', difficulty:1 },
  { id:'t11-5', type:'single', prompt:'Почему в Dockerfile сначала копируют pyproject.toml и uv.lock, а потом исходники?', options:['Слой с зависимостями кэшируется и не переустанавливается при изменении кода','Так требует Python','Чтобы уменьшить образ вдвое','Для безопасности'], answer:0, explanation:'Кэш слоёв Docker.', difficulty:2 },
  { id:'t11-6', type:'order', prompt:'Расставьте этапы изучения ML по порядку.', options:['NumPy и pandas','Классическое ML (scikit-learn)','Глубокое обучение (PyTorch)','Продвинутые модели и fine-tuning'], answer:[0,1,2,3], explanation:'От данных к моделям.', difficulty:1 },
  { id:'t11-7', type:'single', prompt:'Какая тема курса нужна для @login_required в Django?', options:['Декораторы','Генераторы','NumPy','Регулярные выражения'], answer:0, explanation:'Декоратор оборачивает представление.', difficulty:1 },
  { id:'t11-8', type:'multiple', prompt:'Какие проверки стоит запускать в CI Python-проекта? (несколько ответов)', options:['ruff check','mypy','pytest','pip uninstall всего'], answer:[0,1,2], explanation:'Линтер, типы, тесты.', difficulty:1 }
 ]
}
];

export const UPCOMING = [];

export const GLOSSARY = [
 ['CPython','Эталонная реализация Python на C.','0-2'],
 ['REPL','Интерактивная консоль: прочитать, выполнить, вывести.','0-2'],
 ['Байткод','Промежуточное представление, которое выполняет виртуальная машина CPython.','0-2'],
 ['Виртуальное окружение','Изолированная папка с интерпретатором и пакетами проекта.','0-3'],
 ['pip','Стандартный установщик пакетов Python.','0-3'],
 ['PyPI','Центральный репозиторий пакетов Python.','0-3'],
 ['uv','Быстрый менеджер проектов, окружений и зависимостей.','0-3'],
 ['PEP 8','Официальное руководство по стилю кода Python.','0-4'],
 ['ruff','Быстрый линтер и форматтер Python.','0-4'],
 ['Pythonic','Код в духе языка: простой, явный, использующий его идиомы.','0-4'],
 ['Динамическая типизация','Тип принадлежит объекту, а не имени переменной.','1-1'],
 ['None','Единственное значение «отсутствие значения».','1-1'],
 ['Decimal','Тип точной десятичной арифметики.','1-1'],
 ['Истинность','Правила, по которым объект считается True или False в условиях.','1-2'],
 ['f-строка','Строковый литерал с подстановкой выражений: f"{x}".','1-3'],
 ['Срез','Подпоследовательность seq[start:stop:step].','1-3'],
 ['match','Оператор сопоставления с образцом.','1-4'],
 ['list','Изменяемый упорядоченный список.','2-1'],
 ['tuple','Неизменяемая последовательность.','2-1'],
 ['Распаковка','Присваивание элементов последовательности нескольким именам.','2-1'],
 ['dict','Словарь: отображение ключей на значения.','2-2'],
 ['set','Множество уникальных хешируемых элементов.','2-2'],
 ['Хешируемый','Объект с неизменным хешем, пригодный как ключ словаря.','2-2'],
 ['Comprehension','Выражение для построения коллекции: [x for x in xs if ...].','2-3'],
 ['*args / **kwargs','Сбор лишних позиционных и именованных аргументов.','3-1'],
 ['LEGB','Порядок поиска имён: Local, Enclosing, Global, Built-in.','3-2'],
 ['lambda','Анонимная функция-выражение.','3-3'],
 ['Замыкание','Функция, запомнившая переменные объемлющей области.','3-3'],
 ['Декоратор','Функция, оборачивающая другую функцию: @decorator.','3-4'],
 ['self','Ссылка на экземпляр — первый параметр обычного метода.','4-1'],
 ['classmethod','Метод, получающий класс первым аргументом.','4-1'],
 ['property','Атрибут с логикой чтения и записи.','4-2'],
 ['Dunder-метод','Специальный метод вида __имя__, встраивающий класс в синтаксис.','4-2'],
 ['MRO','Порядок разрешения методов при наследовании.','4-3'],
 ['Миксин','Класс с поведением для подмешивания через множественное наследование.','4-3'],
 ['ABC','Абстрактный базовый класс из модуля abc.','4-4'],
 ['Protocol','Структурный интерфейс для статической типизации.','4-4'],
 ['dataclass','Декоратор, генерирующий __init__, __repr__, __eq__ по полям.','4-4'],
 ['Итератор','Объект с __next__, выдающий элементы по одному.','5-1'],
 ['Генератор','Функция с yield, лениво производящая значения.','5-2'],
 ['yield from','Делегирование значений вложенному генератору.','5-2'],
 ['itertools','Модуль функций для эффективной работы с итераторами.','5-3'],
 ['Контекстный менеджер','Объект для with, гарантирующий освобождение ресурса.','5-4'],
 ['EAFP','Стиль: пробовать и обрабатывать исключения, а не проверять заранее.','6-1'],
 ['Модуль','Файл .py с кодом, который можно импортировать.','6-2'],
 ['Пакет','Папка с модулями и __init__.py.','6-2'],
 ['__name__','Имя модуля; "__main__" при прямом запуске.','6-2'],
 ['pyproject.toml','Стандартный файл описания проекта и настроек инструментов.','6-3'],
 ['logging','Стандартный модуль журналирования.','6-4'],
 ['pathlib','Объектная работа с путями файловой системы.','7-1'],
 ['JSON','Текстовый формат обмена данными.','7-2'],
 ['UTC','Всемирное координированное время — стандарт хранения времени.','7-3'],
 ['Регулярное выражение','Шаблон для поиска и разбора текста.','7-3'],
 ['argparse','Модуль разбора аргументов командной строки.','7-4'],
 ['Аннотация типа','Подсказка о типе в сигнатуре или объявлении переменной.','8-1'],
 ['mypy','Статический анализатор типов Python.','8-2'],
 ['Pydantic','Библиотека валидации и сериализации данных по аннотациям.','8-3'],
 ['pytest','Популярный фреймворк тестирования.','8-4'],
 ['Фикстура','Подготовка данных для тестов pytest, внедряемая по имени.','8-4'],
 ['GIL','Глобальная блокировка интерпретатора CPython.','9-1'],
 ['ThreadPoolExecutor','Пул потоков для задач ввода-вывода.','9-2'],
 ['ProcessPoolExecutor','Пул процессов для вычислительных задач.','9-2'],
 ['Корутина','Функция async def, выполняемая циклом событий.','9-3'],
 ['Цикл событий','Механизм asyncio, переключающий корутины в точках await.','9-3'],
 ['asyncio.gather','Одновременное ожидание нескольких корутин.','9-4'],
 ['httpx','HTTP-клиент с синхронным и асинхронным API.','10-1'],
 ['SQLite','Встроенная файловая база данных.','10-2'],
 ['ORM','Отображение таблиц БД на классы и объекты.','10-2'],
 ['NumPy','Библиотека многомерных массивов и вычислений.','10-3'],
 ['Векторизация','Операции над целыми массивами без циклов Python.','10-3'],
 ['Broadcasting','Автоматическое согласование форм массивов NumPy.','10-3'],
 ['pandas','Библиотека табличных данных DataFrame.','10-4'],
 ['Jupyter','Интерактивные блокноты с кодом, результатами и графиками.','10-4'],
 ['pre-commit','Запуск проверок перед каждым коммитом.','11-1'],
 ['Django','Веб-фреймворк «с батарейками».','11-2'],
 ['scikit-learn','Библиотека классического машинного обучения.','11-3'],
 ['PyTorch','Фреймворк глубокого обучения.','11-3']
];
