// Контент курса: модули, уроки, вопросы, глоссарий.
// Загружается до assets/js/engine.js; константы видны движку как глобальные.
// ====== КОНТЕНТ КУРСА ======
// Типы вопросов: single | multiple | order | match | input | analyze
export const MODULES = [
{
 id: 0, title: 'Зачем нужно ООП', short: 'Парадигмы, объект как модель, история, классы и прототипы',
 lessons: [
 { id:'0-1', title:'Парадигмы программирования', html:`
<p><b>Парадигма</b> — способ думать о программе. Один и тот же язык часто поддерживает несколько парадигм, а программист выбирает подходящую под задачу.</p>
<div class="tbl"><table><tr><th>Парадигма</th><th>Из чего состоит программа</th><th>Языки</th></tr>
<tr><td>Процедурная</td><td>Данные + функции, которые их меняют</td><td>C, Pascal, ранний PHP</td></tr>
<tr><td>Объектно-ориентированная</td><td>Объекты, у которых есть состояние и поведение и которые обмениваются сообщениями</td><td>Java, C#, C++, Python, Kotlin, Swift, Ruby</td></tr>
<tr><td>Функциональная</td><td>Чистые функции и неизменяемые данные</td><td>Haskell, F#, Elixir; элементы — почти везде</td></tr>
</table></div>
<p>Вот одна задача — учёт банковского счёта — в процедурном стиле:</p>
<pre><code>balance = 0

def deposit(amount):
    global balance
    balance += amount

def withdraw(amount):
    global balance
    balance -= amount        # ничто не мешает уйти в минус</code></pre>
<p>Данные и функции живут отдельно. Любой код может изменить <code>balance</code> напрямую, а правило «нельзя уйти в минус» нужно помнить в каждом месте, где баланс меняется.</p>
<p>В объектном стиле данные и правила их изменения собраны вместе:</p>
<pre><code>class Account:
    def __init__(self):
        self._balance = 0

    def deposit(self, amount):
        if amount &lt;= 0: raise ValueError("сумма должна быть > 0")
        self._balance += amount

    def withdraw(self, amount):
        if amount &gt; self._balance: raise ValueError("недостаточно средств")
        self._balance -= amount</code></pre>
<div class="note why"><b>Главная идея ООП.</b> Сложную систему проще понимать как набор небольших объектов, каждый из которых отвечает за свой кусок данных и сам следит за их корректностью.</div>`,
 check: [
  { id:'q0-1a', type:'single', prompt:'Чем ООП принципиально отличается от процедурного подхода?', options:['Данные и поведение объединены в объектах, которые сами охраняют своё состояние','В ООП нет функций','ООП-программы всегда быстрее','В ООП нельзя использовать циклы'], answer:0, explanation:'Объект — это данные плюс операции над ними и правила их корректности.' },
  { id:'q0-1b', type:'multiple', prompt:'Какие языки поддерживают ООП? (несколько ответов)', options:['Java','Python','C#','Чистый C'], answer:[0,1,2], explanation:'В C нет классов; ООП на нём можно лишь имитировать структурами и указателями на функции.' }
 ]},
 { id:'0-2', title:'Объект: состояние, поведение, идентичность', html:`
<p>У любого объекта три характеристики:</p>
<ul>
<li><b>Состояние</b> — данные внутри объекта: баланс счёта, цвет машины, текст сообщения.</li>
<li><b>Поведение</b> — что объект умеет делать: <code>deposit()</code>, <code>drive()</code>, <code>send()</code>.</li>
<li><b>Идентичность</b> — объект отличается от другого, даже если состояние одинаковое. Два счёта с балансом 100 — всё равно два разных счёта.</li>
</ul>
<p>Алан Кэй, автор термина «объектно-ориентированное программирование», описывал объекты как маленькие компьютеры, которые <b>обмениваются сообщениями</b>. Вызов метода <code>account.withdraw(50)</code> — это сообщение «сними 50». Как именно объект это сделает — его внутреннее дело.</p>
<h3>Объект как модель</h3>
<p>Объекты моделируют сущности предметной области, но не копируют реальность целиком. У объекта <code>Customer</code> в интернет-магазине есть email и адрес доставки, но нет роста и цвета глаз — они не нужны задаче.</p>
<div class="note"><b>Не только «реальные вещи».</b> Объектами бывают и технические понятия: <code>HttpRequest</code>, <code>Logger</code>, <code>Cache</code>, <code>Iterator</code>. Хорошая модель отвечает на вопрос «кто за что отвечает», а не «что лежит на столе».</div>`,
 check: [
  { id:'q0-2a', type:'match', prompt:'Сопоставьте характеристику объекта и пример.', pairs:[['Состояние','Баланс счёта = 1500'],['Поведение','Метод withdraw()'],['Идентичность','Два счёта с одинаковым балансом — разные объекты']], explanation:'Три характеристики любого объекта.' },
  { id:'q0-2b', type:'single', prompt:'Что означает «объекты обмениваются сообщениями»?', options:['Один объект просит другой что-то сделать, вызывая его метод, и не лезет в его внутренности','Объекты пересылают друг другу email','Объекты общаются только через сеть','Объекты читают поля друг друга напрямую'], answer:0, explanation:'Вызов метода — это сообщение; реализация скрыта внутри получателя.' }
 ]},
 { id:'0-3', title:'Краткая история ООП', html:`
<ol class="steps">
<li><b>1967, Simula 67</b> (Норвегия) — первый язык с классами, объектами, наследованием и виртуальными методами. Создан для моделирования систем.</li>
<li><b>1972–1980, Smalltalk</b> (Xerox PARC, Алан Кэй) — «всё есть объект», обмен сообщениями, графический интерфейс и среда разработки.</li>
<li><b>1985, C++</b> — Бьёрн Страуструп добавил классы Simula к языку C. ООП приходит в индустрию.</li>
<li><b>1994, «Банда четырёх»</b> — книга «Design Patterns» каталогизирует 23 паттерна проектирования.</li>
<li><b>1995, Java и JavaScript</b> — Java делает ООП мейнстримом (сборщик мусора, интерфейсы); JavaScript приносит прототипное ООП в браузер.</li>
<li><b>2000-е, C#, Python, Ruby</b> — ООП становится стандартом для бизнес-приложений и веба.</li>
<li><b>2010-е, Kotlin, Swift, Rust, Go</b> — новые языки берут лучшее: интерфейсы и композицию, неизменяемость, меньше наследования.</li>
</ol>
<div class="note why"><b>Почему это важно.</b> Языки заимствуют идеи друг у друга. Если вы понимаете, откуда взялись классы, интерфейсы и виртуальные методы, то синтаксис нового языка — это просто другая запись тех же понятий.</div>`,
 check: [
  { id:'q0-3a', type:'single', prompt:'Какой язык считают первым объектно-ориентированным?', options:['Simula 67','C++','Java','Smalltalk'], answer:0, explanation:'Simula 67 ввела классы и наследование; Smalltalk развил идею.' },
  { id:'q0-3b', type:'order', prompt:'Расставьте языки по году появления.', options:['Simula','Smalltalk','C++','Java','Kotlin'], answer:[0,1,2,3,4], explanation:'1967, 1972, 1985, 1995, 2011.' }
 ]},
 { id:'0-4', title:'Классовое и прототипное ООП', html:`
<p>Есть два способа создавать объекты.</p>
<p><b>Классовое ООП</b> (Java, C#, C++, Python, Kotlin): сначала описывают <b>класс</b> — шаблон, а затем создают по нему объекты-экземпляры.</p>
<pre><code>class Dog {
    String name;
    Dog(String name) { this.name = name; }
    void bark() { System.out.println(name + ": гав!"); }
}
Dog rex = new Dog("Рекс");
rex.bark();</code></pre>
<p><b>Прототипное ООП</b> (JavaScript, Lua): классов нет, объект создаётся на основе другого объекта-прототипа и делегирует ему то, чего не умеет сам.</p>
<pre><code>const animal = { speak() { console.log(this.name + " издаёт звук"); } };
const cat = Object.create(animal);   // прототип cat — animal
cat.name = "Мурка";
cat.speak();                          // метод найден в прототипе</code></pre>
<p>Ключевое слово <code>class</code> в современном JavaScript — синтаксическая обёртка над прототипами: поведение то же, запись привычнее.</p>
<div class="tbl"><table><tr><th></th><th>Классовое</th><th>Прототипное</th></tr>
<tr><td>Шаблон</td><td>Класс</td><td>Другой объект</td></tr>
<tr><td>Структура</td><td>Обычно фиксирована при компиляции</td><td>Можно менять на лету</td></tr>
<tr><td>Языки</td><td>Java, C#, C++, Kotlin, Swift</td><td>JavaScript, Lua, Self</td></tr>
</table></div>
<p>Дальше в курсе мы говорим о классовом ООП — оно встречается чаще, а все его идеи переносятся и на прототипы.</p>`,
 check: [
  { id:'q0-4a', type:'single', prompt:'Что такое прототип в JavaScript?', options:['Объект, которому другой объект делегирует отсутствующие свойства и методы','Черновик класса','Интерфейс','Тип переменной'], answer:0, explanation:'Поиск свойства идёт по цепочке прототипов.' },
  { id:'q0-4b', type:'single', prompt:'Чем является ключевое слово class в JavaScript?', options:['Синтаксической обёрткой над прототипами','Полноценной заменой прототипов, как в Java','Устаревшей конструкцией','Способом объявить интерфейс'], answer:0, explanation:'Под капотом — те же прототипы.' }
 ]}
 ],
 test: [
  { id:'t0-1', type:'single', prompt:'Какая проблема процедурного кода решается объединением данных и поведения?', options:['Любой код может нарушить правила корректности данных','Код работает медленно','Нельзя писать функции','Невозможно использовать базы данных'], answer:0, explanation:'Объект сам охраняет свои инварианты.', difficulty:1 },
  { id:'t0-2', type:'match', prompt:'Сопоставьте язык и стиль ООП.', pairs:[['Java','Классовое'],['JavaScript','Прототипное'],['C','Нет встроенного ООП'],['Haskell','Функциональный язык']], explanation:'Разные языки — разные подходы.', difficulty:1 },
  { id:'t0-3', type:'single', prompt:'Кто ввёл термин «объектно-ориентированное программирование»?', options:['Алан Кэй','Бьёрн Страуструп','Джеймс Гослинг','Линус Торвальдс'], answer:0, explanation:'Алан Кэй, автор Smalltalk.', difficulty:2 },
  { id:'t0-4', type:'single', prompt:'Два объекта Point(1, 2) созданы отдельно. Что их различает?', options:['Идентичность — это два разных объекта','Ничего, это один объект','Состояние','Поведение'], answer:0, explanation:'Состояние одинаковое, но объекты разные.', difficulty:1 },
  { id:'t0-5', type:'single', prompt:'Что должен содержать класс Customer в интернет-магазине?', options:['Только данные и поведение, нужные задаче: email, адрес, история заказов','Все свойства реального человека','Только методы, без данных','Только данные, без методов'], answer:0, explanation:'Модель — упрощение под задачу.', difficulty:1 },
  { id:'t0-6', type:'single', prompt:'Какая книга описала 23 классических паттерна проектирования?', options:['Design Patterns («Банда четырёх»)','Clean Code','The Phoenix Project','SICP'], answer:0, explanation:'Гамма, Хелм, Джонсон, Влиссидес, 1994.', difficulty:1 },
  { id:'t0-7', type:'analyze', prompt:'Что выведет код?', code:'const base = { greet() { return "привет от " + this.name; } };\nconst obj = Object.create(base);\nobj.name = "obj";\nconsole.log(obj.greet());', options:['привет от obj','привет от undefined','Ошибку: у obj нет greet','привет от base'], answer:0, explanation:'greet найден в прототипе, а this — сам obj.', difficulty:2 },
  { id:'t0-8', type:'multiple', prompt:'Что можно смоделировать объектом? (несколько ответов)', options:['Товар в магазине','HTTP-запрос','Логгер','Только физические предметы'], answer:[0,1,2], explanation:'Объекты моделируют и технические понятия.', difficulty:1 }
 ]
},
{
 id: 1, title: 'Классы и объекты', short: 'Поля, методы, конструкторы, this/self, статические члены',
 lessons: [
 { id:'1-1', title:'Класс и экземпляр', html:`
<p><b>Класс</b> — описание: какие у объектов будут данные и методы. <b>Экземпляр</b> (объект) — конкретная вещь, созданная по этому описанию. Класс — чертёж, экземпляр — дом.</p>
<pre><code>// Java
public class Book {
    String title;          // поле
    int pages;

    void print() {         // метод
        System.out.println(title + ", " + pages + " стр.");
    }
}

Book a = new Book();       // создаём экземпляр
a.title = "Война и мир";
a.pages = 1300;
Book b = new Book();       // другой экземпляр, свои поля
a.print();</code></pre>
<p>Тот же класс на разных языках:</p>
<div class="tbl"><table><tr><th>Язык</th><th>Создание объекта</th></tr>
<tr><td>Java, C#</td><td><code>var b = new Book();</code></td></tr>
<tr><td>C++</td><td><code>Book b;</code> (в стеке) или <code>auto b = std::make_unique&lt;Book&gt;();</code></td></tr>
<tr><td>Python</td><td><code>b = Book()</code></td></tr>
<tr><td>Kotlin</td><td><code>val b = Book()</code></td></tr>
<tr><td>TypeScript</td><td><code>const b = new Book();</code></td></tr>
</table></div>
<div class="note"><b>Именование.</b> Почти во всех языках классы называют существительными в PascalCase: <code>Book</code>, <code>ShoppingCart</code>, <code>HttpClient</code>.</div>`,
 check: [
  { id:'q1-1a', type:'single', prompt:'Как соотносятся класс и объект?', options:['Класс — шаблон, объект — экземпляр, созданный по шаблону','Это синонимы','Объект описывает класс','Класс — это переменная объекта'], answer:0, explanation:'Чертёж и дом.' },
  { id:'q1-1b', type:'single', prompt:'Сколько экземпляров можно создать из одного класса?', options:['Сколько угодно','Только один','Не больше двух','Зависит от числа полей'], answer:0, explanation:'У каждого экземпляра своё состояние.' }
 ]},
 { id:'1-2', title:'Конструкторы', html:`
<p><b>Конструктор</b> — специальный метод, который вызывается при создании объекта и приводит его в корректное начальное состояние.</p>
<pre><code>// Java
public class Book {
    private final String title;
    private final int pages;

    public Book(String title, int pages) {
        if (pages &lt;= 0) throw new IllegalArgumentException("pages");
        this.title = title;
        this.pages = pages;
    }
}
Book b = new Book("Дюна", 600);</code></pre>
<pre><code># Python
class Book:
    def __init__(self, title: str, pages: int):
        if pages &lt;= 0:
            raise ValueError("pages")
        self.title = title
        self.pages = pages</code></pre>
<pre><code>// Kotlin — первичный конструктор прямо в заголовке
class Book(val title: String, val pages: Int) {
    init { require(pages &gt; 0) }
}</code></pre>
<ul>
<li>Если конструктор не написан, компилятор создаёт пустой <b>конструктор по умолчанию</b>.</li>
<li>Конструкторов может быть несколько (перегрузка): <code>Book(String title)</code> и <code>Book(String title, int pages)</code>. Один может вызывать другой через <code>this(...)</code>.</li>
<li>В Python перегрузки нет — вместо неё используют значения по умолчанию: <code>def __init__(self, title, pages=100)</code>.</li>
</ul>
<div class="note why"><b>Правило.</b> После выхода из конструктора объект должен быть полностью готов к работе. Объект, который «нужно ещё донастроить тремя сеттерами», легко использовать неправильно.</div>`,
 check: [
  { id:'q1-2a', type:'single', prompt:'Для чего нужен конструктор?', options:['Чтобы создать объект в корректном начальном состоянии','Чтобы удалить объект','Чтобы скопировать класс','Чтобы вызвать все методы объекта'], answer:0, explanation:'Конструктор устанавливает инварианты с самого начала.' },
  { id:'q1-2b', type:'single', prompt:'Как называется конструктор в Python?', options:['__init__','constructor','Book','new'], answer:0, explanation:'В JavaScript/TypeScript — constructor, в Java/C# — метод с именем класса.' }
 ]},
 { id:'1-3', title:'this и self', html:`
<p>Метод вызывается <b>у конкретного объекта</b>. Чтобы метод знал, с чьими полями он работает, ему передаётся ссылка на этот объект.</p>
<pre><code>// Java, C#, C++, TypeScript, Kotlin — неявная ссылка this
class Counter {
    private int value;
    void increment() { this.value++; }   // this можно опустить: value++
}

# Python — явный первый параметр self
class Counter:
    def __init__(self): self.value = 0
    def increment(self): self.value += 1

c = Counter()
c.increment()          # на деле: Counter.increment(c)</code></pre>
<p>Python делает механизм явным: <code>c.increment()</code> — это вызов функции <code>Counter.increment</code> с <code>c</code> в качестве первого аргумента. В Java то же самое происходит неявно.</p>
<p><code>this</code> особенно нужен, когда имя параметра совпадает с именем поля: <code>this.title = title;</code>.</p>
<div class="note warn"><b>Ловушка JavaScript.</b> В JS <code>this</code> определяется тем, <i>как</i> вызвана функция, а не где она объявлена. Метод, переданный как колбэк, теряет <code>this</code>. Спасают стрелочные функции и <code>bind</code>. В Java, C# и Python такой проблемы нет.</div>`,
 check: [
  { id:'q1-3a', type:'single', prompt:'Что такое this (self) внутри метода?', options:['Ссылка на объект, у которого вызван метод','Ссылка на класс','Глобальная переменная','Родительский класс'], answer:0, explanation:'Через неё метод обращается к полям своего объекта.' },
  { id:'q1-3b', type:'single', prompt:'Во что Python фактически превращает вызов c.increment()?', options:['Counter.increment(c)','increment()','c.__init__()','Counter.increment()'], answer:0, explanation:'Объект передаётся первым аргументом self.' }
 ]},
 { id:'1-4', title:'Статические члены', html:`
<p>Обычные поля и методы принадлежат экземпляру. <b>Статические</b> принадлежат классу целиком и существуют в одном экземпляре.</p>
<pre><code>// Java
class User {
    private static int createdCount = 0;   // общий для всех
    private final String name;              // у каждого свой

    User(String name) { this.name = name; createdCount++; }

    static int getCreatedCount() { return createdCount; }
}
new User("a"); new User("b");
User.getCreatedCount();    // 2 — вызов через класс, без объекта</code></pre>
<pre><code># Python
class MathUtil:
    PI = 3.14159                 # атрибут класса
    @staticmethod
    def square(x): return x * x
    @classmethod
    def from_string(cls, s): ...  # получает класс, а не экземпляр</code></pre>
<p>Где статические члены уместны:</p>
<ul>
<li>Константы: <code>Math.PI</code>, <code>Integer.MAX_VALUE</code>.</li>
<li>Чистые вспомогательные функции: <code>Math.max(a, b)</code>.</li>
<li>Фабричные методы: <code>LocalDate.of(2024, 1, 1)</code>, <code>List.of(1, 2)</code>.</li>
</ul>
<div class="note warn"><b>Осторожно.</b> Изменяемое статическое состояние — это глобальная переменная в красивой обёртке. Его трудно тестировать и опасно использовать из нескольких потоков. В Kotlin вместо static — <code>companion object</code> и функции верхнего уровня.</div>`,
 check: [
  { id:'q1-4a', type:'single', prompt:'Чему принадлежит статическое поле?', options:['Классу — одно на все экземпляры','Каждому экземпляру своё','Только первому созданному объекту','Методу'], answer:0, explanation:'Изменение видно через любой экземпляр и через класс.' },
  { id:'q1-4b', type:'single', prompt:'Почему статический метод не может обращаться к this?', options:['Он вызывается без конкретного объекта','Так быстрее','this доступен только в конструкторе','Это ограничение только Python'], answer:0, explanation:'Нет экземпляра — нет и this.' }
 ]}
 ],
 test: [
  { id:'t1-1', type:'analyze', prompt:'Что выведет код?', code:'class Counter {\n    static int total = 0;\n    int mine = 0;\n    void inc() { total++; mine++; }\n}\nCounter a = new Counter(), b = new Counter();\na.inc(); a.inc(); b.inc();\nSystem.out.println(Counter.total + " " + a.mine);', options:['3 2','2 2','3 3','1 2'], answer:0, explanation:'total общий (3), mine у a свой (2).', difficulty:2 },
  { id:'t1-2', type:'match', prompt:'Сопоставьте язык и обозначение текущего объекта.', pairs:[['Python','self'],['Java','this'],['Swift','self'],['C++','this (указатель)']], explanation:'Swift тоже использует self, C++ — указатель this.', difficulty:2 },
  { id:'t1-3', type:'single', prompt:'Почему стоит проверять аргументы в конструкторе?', options:['Чтобы объект нельзя было создать в некорректном состоянии','Чтобы ускорить программу','Так требует компилятор','Чтобы сэкономить память'], answer:0, explanation:'Объект корректен с момента рождения.', difficulty:1 },
  { id:'t1-4', type:'single', prompt:'Как в Python сделать «несколько конструкторов»?', options:['Параметры по умолчанию или @classmethod-фабрики','Объявить несколько __init__','Это невозможно','Через static'], answer:0, explanation:'Второй __init__ просто заменит первый.', difficulty:2 },
  { id:'t1-5', type:'single', prompt:'Что из перечисленного — хороший кандидат на статический метод?', options:['Math.max(a, b)','account.withdraw(100)','user.getName()','cart.addItem(item)'], answer:0, explanation:'max не зависит от состояния какого-либо объекта.', difficulty:1 },
  { id:'t1-6', type:'single', prompt:'Что произойдёт в Java, если в классе нет ни одного конструктора?', options:['Компилятор добавит пустой конструктор по умолчанию','Объект создать нельзя','Ошибка компиляции','Поля станут статическими'], answer:0, explanation:'Но только пока вы не объявили свой конструктор.', difficulty:1 },
  { id:'t1-7', type:'single', prompt:'Метод JS-объекта передали колбэком: button.onClick(obj.save). Внутри save this оказался undefined. Почему?', options:['В JS this определяется способом вызова, а функция вызвана без объекта','Метод удалён','Ошибка в классе','Колбэки не поддерживают методы'], answer:0, explanation:'Помогут obj.save.bind(obj) или стрелочная функция.', difficulty:2 },
  { id:'t1-8', type:'multiple', prompt:'Чем опасно изменяемое статическое поле? (несколько ответов)', options:['Это скрытое глобальное состояние','Трудно тестировать изолированно','Гонки при работе из нескольких потоков','Оно занимает больше памяти, чем обычное'], answer:[0,1,2], explanation:'Статическое поле как раз одно на всех.', difficulty:2 }
 ]
},
{
 id: 2, title: 'Инкапсуляция', short: 'Модификаторы доступа, свойства, инварианты, неизменяемость',
 lessons: [
 { id:'2-1', title:'Сокрытие состояния', html:`
<p><b>Инкапсуляция</b> — первый из принципов ООП. Объект прячет внутреннее устройство и открывает только операции, которые сохраняют его корректность.</p>
<pre><code>// Плохо: состояние открыто
class Account { public double balance; }
acc.balance = -1_000_000;           // кто угодно может так сделать

// Хорошо: состояние закрыто, изменения — только через методы
class Account {
    private long balanceCents;
    public void deposit(long cents) {
        if (cents &lt;= 0) throw new IllegalArgumentException();
        balanceCents += cents;
    }
    public long getBalanceCents() { return balanceCents; }
}</code></pre>
<p>Что даёт инкапсуляция:</p>
<ul>
<li><b>Защита инвариантов.</b> Баланс не станет отрицательным в обход проверок.</li>
<li><b>Свобода менять реализацию.</b> Можно хранить баланс в копейках или считать его из истории операций — вызывающий код не заметит.</li>
<li><b>Меньше связей.</b> Чем меньше открыто, тем меньше кода зависит от деталей.</li>
</ul>
<div class="note why"><b>Не путайте.</b> Инкапсуляция — не «сделать все поля private и сгенерировать к каждому getter и setter». Публичный сеттер к каждому полю ломает инкапсуляцию так же, как публичное поле.</div>`,
 check: [
  { id:'q2-1a', type:'single', prompt:'Главная цель инкапсуляции?', options:['Скрыть внутреннее устройство и не дать нарушить корректность состояния','Сделать код короче','Ускорить программу','Запретить наследование'], answer:0, explanation:'Объект сам отвечает за свои данные.' },
  { id:'q2-1b', type:'single', prompt:'Класс с private-полями и публичными get/set для каждого из них без проверок. Инкапсулирован ли он?', options:['Фактически нет: состояние можно менять как угодно','Да, полностью','Да, потому что поля private','Зависит от языка'], answer:0, explanation:'Сеттер без правил — то же публичное поле.' }
 ]},
 { id:'2-2', title:'Модификаторы доступа в разных языках', html:`
<div class="tbl"><table><tr><th>Уровень</th><th>Java</th><th>C#</th><th>C++</th><th>Kotlin</th><th>TypeScript</th></tr>
<tr><td>Только сам класс</td><td><code>private</code></td><td><code>private</code></td><td><code>private</code></td><td><code>private</code></td><td><code>private</code> / <code>#field</code></td></tr>
<tr><td>Класс и наследники</td><td><code>protected</code>*</td><td><code>protected</code></td><td><code>protected</code></td><td><code>protected</code></td><td><code>protected</code></td></tr>
<tr><td>Модуль / пакет</td><td>(нет слова) package-private</td><td><code>internal</code></td><td>—</td><td><code>internal</code></td><td>—</td></tr>
<tr><td>Всем</td><td><code>public</code></td><td><code>public</code></td><td><code>public</code></td><td><code>public</code> (по умолч.)</td><td><code>public</code> (по умолч.)</td></tr>
</table></div>
<p class="small">* В Java protected виден ещё и в пределах пакета.</p>
<h3>Python: соглашения вместо запретов</h3>
<pre><code>class Account:
    def __init__(self):
        self.owner = "Анна"      # публичный
        self._balance = 0        # «внутренний»: не трогайте снаружи
        self.__pin = "1234"      # name mangling: превращается в _Account__pin</code></pre>
<p>В Python нет настоящего <code>private</code>: подчёркивание — договорённость «это деталь реализации». Принцип: <i>«мы все взрослые люди»</i>.</p>
<div class="note"><b>Правило по умолчанию.</b> Начинайте с самого закрытого уровня и открывайте только то, что действительно нужно снаружи. Закрыть уже опубликованное намного сложнее, чем открыть.</div>`,
 check: [
  { id:'q2-2a', type:'match', prompt:'Сопоставьте модификатор и видимость.', pairs:[['private','Только внутри класса'],['protected','Класс и наследники'],['public','Всем'],['internal (C#, Kotlin)','В пределах сборки/модуля']], explanation:'Базовая шкала видимости.' },
  { id:'q2-2b', type:'single', prompt:'Что означает одиночное подчёркивание _balance в Python?', options:['Соглашение: это внутренняя деталь, не используйте снаружи','Поле недоступно извне — интерпретатор запретит','Поле статическое','Поле константное'], answer:0, explanation:'Python доверяет программисту, запрета нет.' }
 ]},
 { id:'2-3', title:'Свойства, геттеры и инварианты', html:`
<p><b>Инвариант</b> — условие, которое всегда истинно для корректного объекта. Для <code>Rectangle</code>: ширина и высота положительны. Для <code>DateRange</code>: начало не позже конца.</p>
<p>Многие языки дают <b>свойства</b> — синтаксис поля с логикой метода:</p>
<pre><code>// C#
public class Rectangle {
    private double _width;
    public double Width {
        get =&gt; _width;
        set { if (value &lt;= 0) throw new ArgumentException(); _width = value; }
    }
    public double Area =&gt; _width * Height;  // вычисляемое, только чтение
    public double Height { get; private set; }
}

# Python
class Rectangle:
    def __init__(self, w, h): self.width = w; self.height = h
    @property
    def width(self): return self._width
    @width.setter
    def width(self, v):
        if v &lt;= 0: raise ValueError
        self._width = v
    @property
    def area(self): return self._width * self.height

// Kotlin
class Rectangle(width: Double) {
    var width = width
        set(v) { require(v &gt; 0); field = v }
}</code></pre>
<p>В Java свойств нет, пишут методы <code>getWidth()</code> / <code>setWidth()</code>; записи (<code>record</code>) генерируют геттеры автоматически.</p>
<h3>Tell, don't ask</h3>
<pre><code>// Спрашиваем и решаем за объект:
if (account.getBalance() &gt;= price) account.setBalance(account.getBalance() - price);
// Говорим объекту, что сделать:
account.withdraw(price);</code></pre>
<div class="note why">Логика, которая работает с данными объекта, должна жить в самом объекте. Тогда правило проверяется в одном месте.</div>`,
 check: [
  { id:'q2-3a', type:'single', prompt:'Что такое инвариант класса?', options:['Условие, которое истинно для любого корректного объекта класса','Неизменяемое поле','Статический метод','Тип возвращаемого значения'], answer:0, explanation:'Например, start <= end для диапазона дат.' },
  { id:'q2-3b', type:'single', prompt:'Какой код лучше соответствует принципу «Tell, don\'t ask»?', options:['order.cancel()','if (order.getStatus() == NEW) order.setStatus(CANCELLED)','order.status = "cancelled"','Order.setStatus(order, CANCELLED)'], answer:0, explanation:'Объект сам решает, можно ли отменить заказ.' }
 ]},
 { id:'2-4', title:'Неизменяемые объекты', html:`
<p><b>Неизменяемый</b> (immutable) объект после создания не меняется. Чтобы «изменить», создают новый объект.</p>
<pre><code>// Java 16+: record — неизменяемый класс данных
record Money(long amount, String currency) {
    Money { if (amount &lt; 0) throw new IllegalArgumentException(); }
    Money plus(Money other) { return new Money(amount + other.amount, currency); }
}
// Kotlin
data class Money(val amount: Long, val currency: String)
val b = a.copy(amount = 200)
// C#
public record Money(long Amount, string Currency);
var b = a with { Amount = 200 };
# Python
@dataclass(frozen=True)
class Money:
    amount: int
    currency: str</code></pre>
<p>Почему неизменяемость удобна:</p>
<ul>
<li><b>Безопасно делиться.</b> Объект можно отдать куда угодно — никто его не испортит.</li>
<li><b>Потокобезопасность бесплатно.</b> Нечего синхронизировать.</li>
<li><b>Можно использовать как ключ</b> в словаре и элемент множества: хеш не изменится.</li>
<li><b>Проще рассуждать.</b> Значение в момент создания — значение навсегда.</li>
</ul>
<p>Строки в Java, C#, Python и JS неизменяемы именно поэтому.</p>
<div class="note warn"><b>Поверхностная неизменяемость.</b> <code>final List&lt;Item&gt; items</code> запрещает заменить список, но не менять его содержимое. Отдавайте наружу копию или неизменяемое представление: <code>List.copyOf(items)</code>.</div>`,
 check: [
  { id:'q2-4a', type:'multiple', prompt:'Какие преимущества у неизменяемых объектов? (несколько ответов)', options:['Безопасны при работе из нескольких потоков','Их можно безопасно передавать в любой код','Подходят как ключи словаря','Всегда расходуют меньше памяти'], answer:[0,1,2], explanation:'Память может расходоваться даже больше — из-за новых копий.' },
  { id:'q2-4b', type:'single', prompt:'final List<String> names в Java. Что запрещено?', options:['Присвоить полю другой список','Добавлять элементы в список','Читать элементы','Удалять элементы'], answer:0, explanation:'final защищает ссылку, а не содержимое.' }
 ]}
 ],
 test: [
  { id:'t2-1', type:'single', prompt:'Какой уровень доступа выбирать для нового поля по умолчанию?', options:['private','public','protected','Любой'], answer:0, explanation:'Начинайте с закрытого, открывайте по необходимости.', difficulty:1 },
  { id:'t2-2', type:'analyze', prompt:'Какая проблема у класса?', code:'class Order {\n    private final List<Item> items = new ArrayList<>();\n    public List<Item> getItems() { return items; }\n    public long total() { /* сумма по items */ }\n}\n// где-то снаружи:\norder.getItems().clear();', options:['Геттер отдаёт внутренний изменяемый список — инкапсуляция нарушена','Список должен быть public','final нельзя применять к спискам','Проблем нет'], answer:0, explanation:'Отдавайте копию или неизменяемое представление.', difficulty:2 },
  { id:'t2-3', type:'single', prompt:'Как в Kotlin создать изменённую копию data class?', options:['copy(поле = значение)','clone()','new с теми же полями','with { }'], answer:0, explanation:'with — синтаксис C#.', difficulty:2 },
  { id:'t2-4', type:'single', prompt:'В каком языке private — это соглашение, а не запрет?', options:['Python','Java','C#','C++'], answer:0, explanation:'Подчёркивание — договорённость.', difficulty:1 },
  { id:'t2-5', type:'single', prompt:'Для DateRange(start, end) какой инвариант стоит проверять в конструкторе?', options:['start <= end','start и end — строки','end — сегодняшняя дата','Длина диапазона больше года'], answer:0, explanation:'Иначе объект бессмыслен.', difficulty:1 },
  { id:'t2-6', type:'single', prompt:'Почему изменяемый объект опасно использовать как ключ HashMap?', options:['Если поле, участвующее в hashCode, изменится, ключ невозможно будет найти','Это запрещено компилятором','Ключи должны быть строками','HashMap копирует ключи'], answer:0, explanation:'Объект окажется не в той корзине.', difficulty:2 },
  { id:'t2-7', type:'match', prompt:'Сопоставьте язык и способ объявить неизменяемый класс данных.', pairs:[['Java','record'],['Kotlin','data class с val'],['C#','record'],['Python','@dataclass(frozen=True)']], explanation:'Везде одна идея.', difficulty:2 },
  { id:'t2-8', type:'single', prompt:'Что даёт инкапсуляция при смене способа хранения данных внутри класса?', options:['Вызывающий код не нужно менять','Нужно переписать весь проект','Ничего','Класс перестанет компилироваться'], answer:0, explanation:'Публичный контракт остался прежним.', difficulty:1 }
 ]
},
{
 id: 3, title: 'Наследование', short: 'extends, super, переопределение, абстрактные классы',
 lessons: [
 { id:'3-1', title:'Отношение «является»', html:`
<p><b>Наследование</b> позволяет создать новый класс на основе существующего: подкласс получает поля и методы базового класса и может добавить свои.</p>
<pre><code>// Java
class Animal {
    protected String name;
    Animal(String name) { this.name = name; }
    void eat() { System.out.println(name + " ест"); }
}

class Dog extends Animal {
    Dog(String name) { super(name); }     // вызов конструктора базового класса
    void bark() { System.out.println(name + ": гав"); }
}

Dog d = new Dog("Рекс");
d.eat();   // унаследован
d.bark();  // свой</code></pre>
<p>Синтаксис в разных языках:</p>
<div class="tbl"><table><tr><th>Язык</th><th>Запись</th></tr>
<tr><td>Java, TypeScript</td><td><code>class Dog extends Animal</code></td></tr>
<tr><td>C#</td><td><code>class Dog : Animal</code></td></tr>
<tr><td>C++</td><td><code>class Dog : public Animal</code></td></tr>
<tr><td>Python</td><td><code>class Dog(Animal):</code></td></tr>
<tr><td>Kotlin</td><td><code>class Dog : Animal()</code> (базовый должен быть <code>open</code>)</td></tr>
</table></div>
<p>Наследование выражает отношение <b>«является» (is-a)</b>: собака является животным. Если фраза «X является Y» звучит странно, наследование, скорее всего, неуместно. «Стек является списком»? Нет — у стека не должно быть вставки в середину.</p>
<div class="note">Подкласс также называют <i>производным</i>, <i>дочерним</i> классом; базовый — <i>родительским</i> или <i>суперклассом</i>.</div>`,
 check: [
  { id:'q3-1a', type:'single', prompt:'Какое отношение выражает наследование?', options:['«Является» (is-a)','«Содержит» (has-a)','«Использует»','«Создаёт»'], answer:0, explanation:'has-a выражается композицией (модуль 6).' },
  { id:'q3-1b', type:'single', prompt:'Как в C# записать, что Dog наследует Animal?', options:['class Dog : Animal','class Dog extends Animal','class Dog(Animal)','class Dog inherits Animal'], answer:0, explanation:'Двоеточие — как в C++ и Kotlin.' }
 ]},
 { id:'3-2', title:'Переопределение методов и super', html:`
<p>Подкласс может <b>переопределить</b> (override) метод базового класса — дать свою реализацию.</p>
<pre><code>class Shape {
    double area() { return 0; }
    String describe() { return "Фигура площадью " + area(); }
}
class Circle extends Shape {
    private final double r;
    Circle(double r) { this.r = r; }
    @Override
    double area() { return Math.PI * r * r; }
    @Override
    String describe() { return super.describe() + " (круг)"; }   // дополнить, а не заменить
}</code></pre>
<p><code>super.method()</code> вызывает версию базового класса. В Python — <code>super().method()</code>.</p>
<div class="tbl"><table><tr><th>Язык</th><th>Как разрешить и выполнить переопределение</th></tr>
<tr><td>Java</td><td>Все методы переопределяемы; <code>@Override</code> — проверка компилятором; <code>final</code> запрещает</td></tr>
<tr><td>C#</td><td>В базе <code>virtual</code>, в наследнике <code>override</code>; <code>sealed</code> запрещает</td></tr>
<tr><td>C++</td><td>В базе <code>virtual</code>, в наследнике <code>override</code></td></tr>
<tr><td>Kotlin</td><td>Классы и методы по умолчанию закрыты: <code>open</code> в базе, <code>override</code> в наследнике</td></tr>
<tr><td>Python, JS</td><td>Любой метод можно переопределить, ключевых слов не нужно</td></tr>
</table></div>
<div class="note warn"><b>C++ и C#.</b> Без <code>virtual</code> метод с тем же именем в наследнике лишь <i>скрывает</i> базовый, и вызов через ссылку на базовый тип вызовет базовую версию. Это частая ошибка при переходе с Java.</div>`,
 check: [
  { id:'q3-2a', type:'single', prompt:'Что делает super.describe() внутри переопределённого describe()?', options:['Вызывает реализацию базового класса','Вызывает этот же метод рекурсивно','Создаёт объект базового класса','Удаляет переопределение'], answer:0, explanation:'Так дополняют поведение родителя.' },
  { id:'q3-2b', type:'single', prompt:'Какое ключевое слово в Kotlin нужно базовому методу, чтобы его можно было переопределить?', options:['open','virtual','abstract обязательно','override'], answer:0, explanation:'В Kotlin всё final по умолчанию.' }
 ]},
 { id:'3-3', title:'Абстрактные классы', html:`
<p><b>Абстрактный класс</b> нельзя создать напрямую. Он описывает общее для группы классов и может оставить часть методов без реализации — их обязаны реализовать наследники.</p>
<pre><code>abstract class Shape {
    abstract double area();                       // нет тела
    String describe() { return "Площадь: " + area(); } // общий код
}
class Square extends Shape {
    private final double side;
    Square(double side) { this.side = side; }
    double area() { return side * side; }
}
// new Shape();   — ошибка компиляции</code></pre>
<pre><code># Python
from abc import ABC, abstractmethod
class Shape(ABC):
    @abstractmethod
    def area(self) -&gt; float: ...
    def describe(self): return f"Площадь: {self.area()}"</code></pre>
<p>Обратите внимание: <code>describe()</code> базового класса вызывает <code>area()</code>, которую реализует наследник. Это основа паттерна <b>«Шаблонный метод»</b> (модуль 10): общий алгоритм в базе, изменяемые шаги — в наследниках.</p>
<div class="note why"><b>Когда нужен абстрактный класс.</b> Если у группы классов есть и общий контракт, и общий код или состояние. Если общего кода нет, достаточно интерфейса (модуль 5).</div>`,
 check: [
  { id:'q3-3a', type:'single', prompt:'Что нельзя сделать с абстрактным классом?', options:['Создать его экземпляр напрямую','Унаследоваться от него','Объявить в нём обычный метод','Объявить в нём поле'], answer:0, explanation:'Экземпляры создаются только из конкретных наследников.' },
  { id:'q3-3b', type:'single', prompt:'Что обязан сделать конкретный наследник абстрактного класса?', options:['Реализовать все абстрактные методы','Переопределить все методы','Объявить конструктор без параметров','Сделать все поля public'], answer:0, explanation:'Иначе он сам останется абстрактным.' }
 ]},
 { id:'3-4', title:'Иерархии и множественное наследование', html:`
<p>Классы образуют иерархию. В Java и C# у всех классов есть общий корень — <code>Object</code>, в Python — <code>object</code>.</p>
<pre><code>Object
└─ Animal
   ├─ Mammal
   │  ├─ Dog
   │  └─ Cat
   └─ Bird</code></pre>
<h3>Проблема ромба</h3>
<p>Что если класс наследует сразу от двух классов, у которых общий предок и одинаковый метод?</p>
<pre><code>      Device
      /    \\
 Printer  Scanner     оба переопределили powerOn()
      \\    /
      MFU            какой powerOn() вызвать?</code></pre>
<div class="tbl"><table><tr><th>Язык</th><th>Множественное наследование классов</th></tr>
<tr><td>C++</td><td>Есть; ромб решается виртуальным наследованием</td></tr>
<tr><td>Python</td><td>Есть; порядок поиска методов — MRO (C3-линеаризация), смотреть: <code>MFU.__mro__</code></td></tr>
<tr><td>Java, C#, Kotlin, Swift</td><td>Нет: один базовый класс + сколько угодно интерфейсов</td></tr>
<tr><td>Ruby, Scala, PHP, Rust</td><td>Нет, но есть миксины / трейты</td></tr>
</table></div>
<div class="note warn"><b>Глубокие иерархии — запах.</b> Пять уровней наследования означают, что для понимания одного класса нужно прочитать пять. Современные рекомендации: неглубокие иерархии, композиция и интерфейсы (модуль 6).</div>`,
 check: [
  { id:'q3-4a', type:'single', prompt:'Какие языки запрещают наследовать от двух классов сразу?', options:['Java и C#','C++ и Python','Только Python','Все языки'], answer:0, explanation:'Зато в них можно реализовать много интерфейсов.' },
  { id:'q3-4b', type:'single', prompt:'Как Python решает, чей метод вызвать при множественном наследовании?', options:['По MRO — линеаризованному порядку классов','Случайно','Берёт метод последнего базового класса','Выдаёт ошибку'], answer:0, explanation:'Порядок виден в атрибуте __mro__.' }
 ]}
 ],
 test: [
  { id:'t3-1', type:'single', prompt:'Какой пример — неудачное наследование?', options:['class Stack extends ArrayList','class Dog extends Animal','class Circle extends Shape','class SavingsAccount extends Account'], answer:0, explanation:'Стек унаследует вставку в середину и прочие лишние операции.', difficulty:2 },
  { id:'t3-2', type:'analyze', prompt:'Что выведет код?', code:'class A { String who() { return "A"; }\n          String hi() { return "Я " + who(); } }\nclass B extends A { @Override String who() { return "B"; } }\n\nA x = new B();\nSystem.out.println(x.hi());', options:['Я B','Я A','Ошибку компиляции','Я AB'], answer:0, explanation:'hi() унаследован, но who() вызывается у реального объекта — B.', difficulty:2 },
  { id:'t3-3', type:'match', prompt:'Сопоставьте язык и ключевое слово запрета переопределения.', pairs:[['Java','final'],['C#','sealed'],['Kotlin','отсутствие open'],['C++','final']], explanation:'Разные слова, одна идея.', difficulty:3 },
  { id:'t3-4', type:'single', prompt:'Что должен сделать конструктор Dog, если у Animal нет конструктора без параметров?', options:['Явно вызвать super(name)','Ничего','Объявить поле name заново','Сделать Animal абстрактным'], answer:0, explanation:'Базовая часть объекта инициализируется первой.', difficulty:2 },
  { id:'t3-5', type:'single', prompt:'Зачем писать @Override в Java?', options:['Компилятор проверит, что метод действительно переопределяет базовый','Без него переопределение не работает','Чтобы метод стал быстрее','Чтобы запретить дальнейшее переопределение'], answer:0, explanation:'Опечатка в имени станет ошибкой компиляции, а не новым методом.', difficulty:1 },
  { id:'t3-6', type:'single', prompt:'Что такое «проблема ромба»?', options:['Неоднозначность при наследовании от двух классов с общим предком','Слишком глубокая иерархия','Циклическая зависимость пакетов','Утечка памяти'], answer:0, explanation:'Неясно, чья реализация метода используется.', difficulty:1 },
  { id:'t3-7', type:'single', prompt:'В C++ в базе метод без virtual, в наследнике метод с тем же именем. Base* p = new Derived(); p->f(); — что вызовется?', options:['Base::f','Derived::f','Ошибка компиляции','Оба'], answer:0, explanation:'Без virtual диспетчеризация статическая.', difficulty:3 },
  { id:'t3-8', type:'multiple', prompt:'Когда уместен абстрактный класс? (несколько ответов)', options:['Есть общий код для группы классов','Есть общее состояние (поля)','Нужно запретить создание базового объекта','Нужно унаследоваться от трёх таких классов в Java'], answer:[0,1,2], explanation:'В Java базовый класс может быть только один.', difficulty:2 }
 ]
},
{
 id: 4, title: 'Полиморфизм', short: 'Подтипы, динамическая диспетчеризация, перегрузка, утиная типизация, обобщения',
 lessons: [
 { id:'4-1', title:'Один интерфейс — много реализаций', html:`
<p><b>Полиморфизм</b> («много форм») — возможность работать с объектами разных классов через общий тип, не зная, какой именно класс перед нами.</p>
<pre><code>abstract class Shape { abstract double area(); }
class Circle extends Shape { double r; double area() { return Math.PI * r * r; } }
class Rect   extends Shape { double w, h; double area() { return w * h; } }

double totalArea(List&lt;Shape&gt; shapes) {
    double sum = 0;
    for (Shape s : shapes) sum += s.area();   // какой area()? — решается для каждого объекта
    return sum;
}</code></pre>
<p>Метод <code>totalArea</code> ничего не знает о кругах и прямоугольниках. Добавьте завтра <code>Triangle</code> — <code>totalArea</code> менять не придётся. Это главная ценность полиморфизма: <b>код, который не нужно трогать при добавлении нового варианта</b>.</p>
<h3>Без полиморфизма</h3>
<pre><code>double area(Object s) {
    if (s instanceof Circle c) return Math.PI * c.r * c.r;
    else if (s instanceof Rect r) return r.w * r.h;
    // новый тип — ещё одна ветка, и так в каждом месте программы
    throw new IllegalArgumentException();
}</code></pre>
<div class="note why"><b>Признак.</b> Длинная цепочка <code>if (type == ...)</code> или <code>switch</code> по типу объекта, повторённая в нескольких местах, — сигнал заменить её полиморфизмом.</div>`,
 check: [
  { id:'q4-1a', type:'single', prompt:'Что даёт полиморфизм?', options:['Работать с разными классами через общий тип и добавлять новые классы без изменения существующего кода','Создавать много объектов одного класса','Ускорять выполнение','Скрывать поля'], answer:0, explanation:'Новый вариант — новый класс, а не новая ветка if.' },
  { id:'q4-1b', type:'single', prompt:'Какой код — сигнал применить полиморфизм?', options:['Повторяющийся switch по типу объекта в нескольких местах','Цикл for по списку','Вызов конструктора','Использование private-полей'], answer:0, explanation:'Каждое новое значение типа требует правок во всех switch.' }
 ]},
 { id:'4-2', title:'Динамическая диспетчеризация', html:`
<p>У переменной два типа: <b>статический</b> (объявленный) и <b>динамический</b> (тип реального объекта).</p>
<pre><code>Shape s = new Circle(2);   // статический тип Shape, динамический Circle
s.area();                   // вызовется Circle.area()</code></pre>
<ul>
<li><b>Компилятор</b> по статическому типу проверяет, что метод <code>area()</code> вообще существует у <code>Shape</code>.</li>
<li><b>Во время выполнения</b> по динамическому типу выбирается конкретная реализация. Это <b>позднее связывание</b>.</li>
</ul>
<p>Как это устроено в Java, C#, C++: у каждого класса есть <b>таблица виртуальных методов</b> (vtable) — массив указателей на реализации. Объект хранит ссылку на таблицу своего класса. Вызов <code>s.area()</code> — это «возьми vtable объекта, найди ячейку area, вызови». Одно косвенное обращение, очень быстро.</p>
<div data-widget="dispatch"></div>
<p>В Python и JavaScript метод ищется по имени в словаре объекта, затем класса и его предков (цепочке прототипов). Поэтому там любой метод «виртуальный».</p>
<div class="note warn"><b>Статические методы и поля</b> не участвуют в диспетчеризации — они выбираются по статическому типу. Перегрузка (следующий урок) — тоже.</div>`,
 check: [
  { id:'q4-2a', type:'single', prompt:'Animal a = new Dog(); a.speak(); — по какому типу выбирается реализация speak()?', options:['По динамическому — Dog','По статическому — Animal','Случайно','По первому объявленному классу'], answer:0, explanation:'Если speak виртуальный (в Java — всегда).' },
  { id:'q4-2b', type:'single', prompt:'Что такое vtable?', options:['Таблица указателей на реализации виртуальных методов класса','Таблица в базе данных','Список полей объекта','Таблица переменных стека'], answer:0, explanation:'Через неё работает позднее связывание.' }
 ]},
 { id:'4-3', title:'Перегрузка и утиная типизация', html:`
<p>Полиморфизм бывает разных видов:</p>
<div class="tbl"><table><tr><th>Вид</th><th>Суть</th><th>Когда выбирается</th></tr>
<tr><td>Подтиповой</td><td>Переопределение метода в наследниках</td><td>Во время выполнения</td></tr>
<tr><td>Ad-hoc (перегрузка)</td><td>Методы с одним именем и разными параметрами</td><td>При компиляции</td></tr>
<tr><td>Параметрический</td><td>Обобщённый код для любого типа T</td><td>При компиляции</td></tr>
<tr><td>Утиный</td><td>Подходит любой объект с нужными методами</td><td>Во время выполнения</td></tr>
</table></div>
<h3>Перегрузка</h3>
<pre><code>class Printer {
    void print(int x)    { System.out.println("int " + x); }
    void print(String s) { System.out.println("str " + s); }
}
// перегрузка операторов (C++, C#, Kotlin, Python):
Money operator+(Money a, Money b);      // C++
def __add__(self, other): ...           # Python</code></pre>
<h3>Утиная типизация</h3>
<p><i>«Если что-то ходит как утка и крякает как утка — это утка».</i> В динамических языках общий базовый класс не нужен:</p>
<pre><code>class Duck:  def speak(self): return "кря"
class Robot: def speak(self): return "бип"

for x in [Duck(), Robot()]:
    print(x.speak())        # работает: важен метод, а не класс</code></pre>
<p>Статическая версия той же идеи — <b>структурная типизация</b>: интерфейсы в Go и TypeScript, <code>Protocol</code> в Python. Тип подходит, если у него есть нужные методы, даже без явного <code>implements</code>.</p>`,
 check: [
  { id:'q4-3a', type:'match', prompt:'Сопоставьте вид полиморфизма и пример.', pairs:[['Подтиповой','Circle переопределяет area()'],['Перегрузка','print(int) и print(String)'],['Параметрический','List<T>'],['Утиный','Любой объект с методом speak()']], explanation:'Четыре вида полиморфизма.' },
  { id:'q4-3b', type:'single', prompt:'Когда выбирается перегруженный метод?', options:['При компиляции, по статическим типам аргументов','Во время выполнения','Случайно','При первом вызове'], answer:0, explanation:'Перегрузка — статический полиморфизм.' }
 ]},
 { id:'4-4', title:'Обобщения (generics)', html:`
<p><b>Обобщённый</b> класс или метод пишется один раз и работает с любым типом, сохраняя проверку типов.</p>
<pre><code>// Java
class Box&lt;T&gt; {
    private final T value;
    Box(T value) { this.value = value; }
    T get() { return value; }
}
Box&lt;String&gt; b = new Box&lt;&gt;("hi");
String s = b.get();          // приведение не нужно, тип известен

// ограничение: T должен уметь сравниваться
static &lt;T extends Comparable&lt;T&gt;&gt; T max(List&lt;T&gt; xs) { ... }</code></pre>
<div class="tbl"><table><tr><th>Язык</th><th>Запись</th><th>Особенность</th></tr>
<tr><td>Java</td><td><code>List&lt;T&gt;</code>, <code>&lt;T extends X&gt;</code></td><td>Стирание типов: во время выполнения T неизвестен</td></tr>
<tr><td>C#</td><td><code>List&lt;T&gt;</code>, <code>where T : X</code></td><td>Типы сохраняются во время выполнения</td></tr>
<tr><td>C++</td><td><code>template&lt;typename T&gt;</code></td><td>Код генерируется для каждого T отдельно</td></tr>
<tr><td>TypeScript</td><td><code>Array&lt;T&gt;</code>, <code>T extends X</code></td><td>Только при проверке, в JS исчезают</td></tr>
<tr><td>Python</td><td><code>list[T]</code>, <code>TypeVar</code></td><td>Подсказки для анализаторов</td></tr>
</table></div>
<h3>Вариантность (кратко)</h3>
<p>Является ли <code>List&lt;Dog&gt;</code> подтипом <code>List&lt;Animal&gt;</code>? Нет! Иначе в него можно было бы положить <code>Cat</code>. Но <i>читать</i> животных из списка собак безопасно — это <b>ковариантность</b> (<code>? extends Animal</code> в Java, <code>out T</code> в C# и Kotlin). Подробно разбирается в документации конкретного языка.</p>`,
 check: [
  { id:'q4-4a', type:'single', prompt:'Зачем нужны обобщения?', options:['Писать один код для разных типов с проверкой типов компилятором','Чтобы обойти систему типов','Для ускорения программ','Для наследования от нескольких классов'], answer:0, explanation:'List<String> не позволит положить число.' },
  { id:'q4-4b', type:'single', prompt:'Почему List<Dog> не является подтипом List<Animal>?', options:['Тогда в список собак можно было бы добавить кошку','Потому что Dog не наследует Animal','Так решил автор Java','Обобщения не поддерживают наследование'], answer:0, explanation:'Изменяемые коллекции инвариантны.' }
 ]}
 ],
 test: [
  { id:'t4-1', type:'analyze', prompt:'Что выведет код?', code:'class Animal { String sound() { return "..."; } }\nclass Cat extends Animal { String sound() { return "мяу"; } }\nclass Cow extends Animal { String sound() { return "му"; } }\n\nList<Animal> zoo = List.of(new Cat(), new Cow(), new Animal());\nfor (Animal a : zoo) System.out.print(a.sound() + " ");', options:['мяу му ...','... ... ...','мяу мяу мяу','Ошибку компиляции'], answer:0, explanation:'Каждый объект отвечает своей реализацией.', difficulty:1 },
  { id:'t4-2', type:'single', prompt:'Что проверяет компилятор при вызове shape.area(), если shape имеет тип Shape?', options:['Что метод area() есть у типа Shape','Что объект — Circle','Ничего','Что метод статический'], answer:0, explanation:'Реализацию выбирает уже среда выполнения.', difficulty:2 },
  { id:'t4-3', type:'single', prompt:'Что такое структурная типизация?', options:['Тип подходит, если у него есть нужные члены, без явного объявления implements','Типизация по имени класса','Наследование структур','Типы только во время выполнения'], answer:0, explanation:'Go, TypeScript, Python Protocol.', difficulty:2 },
  { id:'t4-4', type:'single', prompt:'Какой вид полиморфизма есть в Python без всяких базовых классов?', options:['Утиная типизация','Только перегрузка','Только шаблоны','Никакого'], answer:0, explanation:'Важен метод, а не класс.', difficulty:1 },
  { id:'t4-5', type:'analyze', prompt:'Что выведет Java-код?', code:'static void f(Object o) { System.out.println("Object"); }\nstatic void f(String s) { System.out.println("String"); }\n\nObject x = "hello";\nf(x);', options:['Object','String','Ошибку компиляции','Ничего'], answer:0, explanation:'Перегрузка выбирается по статическому типу x — Object.', difficulty:3 },
  { id:'t4-6', type:'multiple', prompt:'Какие виды полиморфизма разрешаются при компиляции? (несколько ответов)', options:['Перегрузка','Параметрический (generics)','Подтиповой (виртуальные методы)','Утиная типизация в Python'], answer:[0,1], explanation:'Подтиповой и утиный — во время выполнения.', difficulty:2 },
  { id:'t4-7', type:'single', prompt:'Добавили класс Triangle extends Shape. Что нужно изменить в методе totalArea(List<Shape>)?', options:['Ничего','Добавить ветку instanceof Triangle','Перекомпилировать с флагом','Сделать Triangle абстрактным'], answer:0, explanation:'В этом и смысл полиморфизма.', difficulty:1 },
  { id:'t4-8', type:'single', prompt:'Что означает стирание типов в Java?', options:['Во время выполнения параметр T неизвестен, List<String> и List<Integer> — один класс','Типы удаляются из исходников','Нельзя использовать generics','Объекты теряют поля'], answer:0, explanation:'Поэтому нельзя написать new T().', difficulty:3 }
 ]
},
{
 id: 5, title: 'Абстракция и интерфейсы', short: 'Контракты, интерфейсы, абстрактный класс или интерфейс, трейты и миксины',
 lessons: [
 { id:'5-1', title:'Абстракция', html:`
<p><b>Абстракция</b> — выделение главного и отбрасывание деталей. Водитель пользуется рулём и педалями, не зная, как устроен двигатель. Объект предлагает простой набор операций и прячет сложную реализацию.</p>
<pre><code>interface PaymentGateway {
    Receipt charge(Money amount, Card card);
}</code></pre>
<p>Коду оформления заказа достаточно знать: «шлюз умеет списать деньги и вернуть чек». Как именно — HTTP-запрос к банку, повторы при таймауте, подпись запроса — скрыто за абстракцией.</p>
<h3>Абстракция и инкапсуляция</h3>
<div class="tbl"><table><tr><th>Абстракция</th><th>Инкапсуляция</th></tr>
<tr><td>Что показать: какие операции нужны пользователю</td><td>Что спрятать: как защитить данные и детали</td></tr>
<tr><td>Уровень проектирования</td><td>Уровень реализации</td></tr>
<tr><td>Интерфейсы, абстрактные классы</td><td>Модификаторы доступа, свойства</td></tr>
</table></div>
<p>Они дополняют друг друга: абстракция определяет «окно», инкапсуляция закрывает всё остальное.</p>
<div class="note why"><b>Четыре столпа ООП</b>: инкапсуляция, наследование, полиморфизм, абстракция. Это стандартный вопрос на собеседовании на любой ООП-язык.</div>`,
 check: [
  { id:'q5-1a', type:'single', prompt:'Что такое абстракция в ООП?', options:['Выделение существенных операций и сокрытие несущественных деталей','Абстрактное искусство в UI','Удаление кода','Синоним наследования'], answer:0, explanation:'Пользователь объекта видит только нужное.' },
  { id:'q5-1b', type:'multiple', prompt:'Какие из этого — «четыре столпа» ООП? (несколько ответов)', options:['Инкапсуляция','Наследование','Полиморфизм','Абстракция','Компиляция'], answer:[0,1,2,3], explanation:'Компиляция к принципам ООП не относится.' }
 ]},
 { id:'5-2', title:'Интерфейсы как контракт', html:`
<p><b>Интерфейс</b> — набор методов без (обычно) реализации. Класс, реализующий интерфейс, обещает предоставить все эти методы.</p>
<pre><code>// Java
interface Notifier {
    void send(String to, String text);
}
class EmailNotifier implements Notifier {
    public void send(String to, String text) { /* SMTP */ }
}
class SmsNotifier implements Notifier {
    public void send(String to, String text) { /* SMS API */ }
}

class OrderService {
    private final Notifier notifier;          // зависим от интерфейса
    OrderService(Notifier n) { notifier = n; }
    void place(Order o) { ...; notifier.send(o.email(), "Заказ принят"); }
}</code></pre>
<p><code>OrderService</code> можно использовать с email, SMS, Telegram или с фейковым уведомителем в тестах — без изменений.</p>
<div class="tbl"><table><tr><th>Язык</th><th>Интерфейс</th><th>Реализация</th></tr>
<tr><td>Java</td><td><code>interface</code></td><td><code>implements</code></td></tr>
<tr><td>C#</td><td><code>interface INotifier</code> (префикс I)</td><td><code>: INotifier</code></td></tr>
<tr><td>Kotlin</td><td><code>interface</code></td><td><code>: Notifier</code></td></tr>
<tr><td>TypeScript, Go</td><td><code>interface</code></td><td>Неявно — по структуре</td></tr>
<tr><td>C++</td><td>Класс из чисто виртуальных методов <code>virtual void f() = 0;</code></td><td>Наследование</td></tr>
<tr><td>Python</td><td><code>ABC</code> или <code>Protocol</code></td><td>Наследование или по структуре</td></tr>
<tr><td>Swift</td><td><code>protocol</code></td><td><code>: Notifier</code></td></tr>
<tr><td>Rust</td><td><code>trait</code></td><td><code>impl Notifier for Email</code></td></tr>
</table></div>
<div class="note"><b>Программируйте на уровне интерфейсов, а не реализаций</b> — главный совет «Банды четырёх». Объявляйте переменные и параметры типом интерфейса: <code>List&lt;X&gt; xs = new ArrayList&lt;&gt;()</code>.</div>`,
 check: [
  { id:'q5-2a', type:'single', prompt:'Что гарантирует класс, реализующий интерфейс?', options:['Что у него есть все методы интерфейса','Что он не имеет полей','Что он наследует Object','Что он неизменяемый'], answer:0, explanation:'Интерфейс — контракт.' },
  { id:'q5-2b', type:'single', prompt:'Почему OrderService лучше принимать Notifier, а не EmailNotifier?', options:['Можно подставить любую реализацию, включая фейковую в тестах','Так быстрее','EmailNotifier нельзя передать в конструктор','Интерфейсы занимают меньше памяти'], answer:0, explanation:'Зависимость от абстракции.' }
 ]},
 { id:'5-3', title:'Абстрактный класс или интерфейс', html:`
<p>Современные интерфейсы умеют больше, чем раньше: в Java 8+, C# 8+, Kotlin у них бывают методы с реализацией по умолчанию.</p>
<pre><code>interface Shape {
    double area();
    default String describe() { return "Площадь " + area(); }   // реализация по умолчанию
}</code></pre>
<p>Чем тогда они отличаются?</p>
<div class="tbl"><table><tr><th></th><th>Абстрактный класс</th><th>Интерфейс</th></tr>
<tr><td>Сколько можно унаследовать</td><td>Один</td><td>Сколько угодно</td></tr>
<tr><td>Состояние (поля экземпляра)</td><td>Да</td><td>Нет</td></tr>
<tr><td>Конструктор</td><td>Да</td><td>Нет</td></tr>
<tr><td>Отношение</td><td>«является» (Dog — Animal)</td><td>«умеет» (Comparable, Serializable)</td></tr>
</table></div>
<p>Практическое правило:</p>
<ol class="steps">
<li>По умолчанию — <b>интерфейс</b>. Он не навязывает иерархию.</li>
<li>Если у реализаций много общего кода и состояния — добавьте <b>абстрактный базовый класс</b>, реализующий интерфейс.</li>
<li>Наружу (в параметры методов) по-прежнему отдавайте интерфейс.</li>
</ol>
<pre><code>interface Repository&lt;T&gt; { T find(long id); void save(T item); }
abstract class JdbcRepository&lt;T&gt; implements Repository&lt;T&gt; { /* общая работа с БД */ }
class UserRepository extends JdbcRepository&lt;User&gt; { ... }</code></pre>`,
 check: [
  { id:'q5-3a', type:'single', prompt:'Что может абстрактный класс, но не может интерфейс?', options:['Хранить поля экземпляра и иметь конструктор','Объявлять методы','Иметь несколько реализаций','Использоваться как тип параметра'], answer:0, explanation:'Интерфейс не хранит состояние.' },
  { id:'q5-3b', type:'single', prompt:'Класс должен уметь сравниваться, сериализоваться и печататься. Что выбрать?', options:['Три интерфейса','Три абстрактных базовых класса','Один большой базовый класс','Скопировать код'], answer:0, explanation:'Это способности «умеет», их много — интерфейсы.' }
 ]},
 { id:'5-4', title:'Трейты, миксины и протоколы', html:`
<p>Многие языки предлагают способ <b>подмешать</b> готовое поведение в класс, не создавая иерархию.</p>
<pre><code># Python — миксин
class JsonMixin:
    def to_json(self): return json.dumps(self.__dict__)

class User(JsonMixin):
    def __init__(self, name): self.name = name

User("Анна").to_json()   # '{"name": "Анна"}'</code></pre>
<pre><code>// Rust — трейт: интерфейс + реализации по умолчанию, классов и наследования нет вовсе
trait Describe { fn name(&amp;self) -&gt; String;
                 fn describe(&amp;self) -&gt; String { format!("Это {}", self.name()) } }
struct Dog;
impl Describe for Dog { fn name(&amp;self) -&gt; String { "пёс".into() } }</code></pre>
<pre><code>// Swift — протокол + расширение
protocol Describable { var name: String { get } }
extension Describable { func describe() -&gt; String { "Это \\(name)" } }</code></pre>
<div class="tbl"><table><tr><th>Механизм</th><th>Языки</th></tr>
<tr><td>Миксины</td><td>Python, Ruby (<code>include Module</code>), Dart (<code>with</code>)</td></tr>
<tr><td>Трейты</td><td>Rust, Scala, PHP</td></tr>
<tr><td>Протоколы с расширениями</td><td>Swift</td></tr>
<tr><td>Методы по умолчанию в интерфейсах</td><td>Java, C#, Kotlin</td></tr>
<tr><td>Встраивание структур</td><td>Go (<code>type Admin struct { User }</code>)</td></tr>
</table></div>
<div class="note why"><b>Общая тенденция.</b> Новые языки (Go, Rust) отказались от наследования классов полностью и обходятся интерфейсами/трейтами и композицией. Понимание интерфейсов переносится между языками лучше всего.</div>`,
 check: [
  { id:'q5-4a', type:'single', prompt:'Что такое миксин?', options:['Класс с готовым поведением, который подмешивают в другие классы','Абстрактный класс с одним методом','Интерфейс без методов','Вид исключения'], answer:0, explanation:'Не «является», а «добавляет умение».' },
  { id:'q5-4b', type:'single', prompt:'Как Rust обходится без наследования классов?', options:['Через трейты и композицию структур','Через множественное наследование','Через прототипы','Никак, Rust не поддерживает полиморфизм'], answer:0, explanation:'Трейты дают и контракт, и реализации по умолчанию.' }
 ]}
 ],
 test: [
  { id:'t5-1', type:'match', prompt:'Сопоставьте язык и аналог интерфейса.', pairs:[['Swift','protocol'],['Rust','trait'],['C++','Класс с чисто виртуальными методами'],['Python','ABC / Protocol']], explanation:'Одна идея — разные названия.', difficulty:2 },
  { id:'t5-2', type:'single', prompt:'Как в C# принято называть интерфейсы?', options:['С префиксом I: IRepository','С суффиксом Interface','Строчными буквами','Так же, как классы, без отличий'], answer:0, explanation:'IDisposable, IEnumerable и т. д.', difficulty:1 },
  { id:'t5-3', type:'single', prompt:'Что означает «программировать на уровне интерфейсов»?', options:['Объявлять зависимости и параметры типами интерфейсов, а не конкретных классов','Писать только интерфейсы без классов','Рисовать UI','Использовать только публичные методы'], answer:0, explanation:'Так реализации можно заменять.', difficulty:1 },
  { id:'t5-4', type:'analyze', prompt:'Какое утверждение о коде верно?', code:'interface Flyable { void fly(); }\ninterface Swimmable { void swim(); }\nclass Duck implements Flyable, Swimmable {\n    public void fly() { }\n    public void swim() { }\n}', options:['Корректно: класс может реализовать несколько интерфейсов','Ошибка: можно реализовать только один интерфейс','Ошибка: интерфейсы должны наследоваться друг от друга','Ошибка: нужен абстрактный класс'], answer:0, explanation:'Множественная реализация интерфейсов разрешена.', difficulty:1 },
  { id:'t5-5', type:'single', prompt:'Что делает default-метод в интерфейсе Java?', options:['Даёт реализацию по умолчанию, которую класс может не переопределять','Делает интерфейс абстрактным классом','Вызывается при создании объекта','Запрещает реализацию интерфейса'], answer:0, explanation:'Позволяет расширять интерфейс, не ломая реализации.', difficulty:2 },
  { id:'t5-6', type:'single', prompt:'В Go тип реализует интерфейс, если…', options:['…у него есть все методы интерфейса — явное объявление не нужно','…он объявлен с implements','…он наследует интерфейс','…он помечен атрибутом'], answer:0, explanation:'Структурная типизация.', difficulty:2 },
  { id:'t5-7', type:'single', prompt:'Чем абстракция отличается от инкапсуляции?', options:['Абстракция решает, что показать; инкапсуляция — что и как спрятать','Это одно и то же','Абстракция — про память, инкапсуляция — про потоки','Абстракция бывает только в Java'], answer:0, explanation:'Они дополняют друг друга.', difficulty:2 },
  { id:'t5-8', type:'multiple', prompt:'Что обычно лучше выразить интерфейсом? (несколько ответов)', options:['Comparable — умеет сравниваться','PaymentGateway — способ оплаты','Logger — умеет писать журнал','Общий код с полями для всех репозиториев'], answer:[0,1,2], explanation:'Общий код с состоянием — для абстрактного класса.', difficulty:2 }
 ]
},
{
 id: 6, title: 'Композиция', short: 'has-a, делегирование, хрупкий базовый класс, композиция вместо наследования',
 lessons: [
 { id:'6-1', title:'Отношение «содержит»', html:`
<p><b>Композиция</b> — объект содержит другие объекты и пользуется ими. Отношение <b>«содержит» (has-a)</b>: у машины есть двигатель, у заказа есть позиции.</p>
<pre><code>class Engine { void start() { ... } }
class Car {
    private final Engine engine;            // машина СОДЕРЖИТ двигатель
    Car(Engine engine) { this.engine = engine; }
    void start() { engine.start(); }         // и делегирует ему работу
}</code></pre>
<p>Связи между объектами на диаграммах UML:</p>
<div class="tbl"><table><tr><th>Связь</th><th>Смысл</th><th>Пример</th></tr>
<tr><td>Ассоциация</td><td>Объекты знают друг о друге</td><td>Студент — курс</td></tr>
<tr><td>Агрегация</td><td>Целое и части, части живут сами по себе</td><td>Команда — игроки</td></tr>
<tr><td>Композиция</td><td>Части не существуют без целого</td><td>Заказ — позиции заказа</td></tr>
<tr><td>Наследование</td><td>Является</td><td>Кошка — животное</td></tr>
<tr><td>Реализация</td><td>Выполняет контракт</td><td>ArrayList — List</td></tr>
</table></div>
<div class="note">В повседневной речи «композицией» называют любой вариант «объект содержит другой объект» — и агрегацию, и строгую композицию.</div>`,
 check: [
  { id:'q6-1a', type:'single', prompt:'Какое отношение выражает композиция?', options:['«Содержит» (has-a)','«Является» (is-a)','«Наследует»','«Перегружает»'], answer:0, explanation:'У машины есть двигатель.' },
  { id:'q6-1b', type:'single', prompt:'Позиции заказа удаляются вместе с заказом. Какая это связь?', options:['Композиция','Агрегация','Наследование','Реализация'], answer:0, explanation:'Части не существуют без целого.' }
 ]},
 { id:'6-2', title:'Проблемы наследования', html:`
<p>Наследование связывает классы сильнее всего: подкласс зависит от деталей реализации родителя.</p>
<h3>Хрупкий базовый класс</h3>
<pre><code>class CountingSet&lt;E&gt; extends HashSet&lt;E&gt; {
    int added = 0;
    @Override public boolean add(E e) { added++; return super.add(e); }
    @Override public boolean addAll(Collection&lt;? extends E&gt; c) {
        added += c.size(); return super.addAll(c);
    }
}
var s = new CountingSet&lt;String&gt;();
s.addAll(List.of("a", "b", "c"));
s.added;   // 6, а не 3!</code></pre>
<p>Внутри <code>HashSet.addAll</code> вызывает <code>add</code> для каждого элемента — и наш счётчик срабатывает дважды. Мы зависим от того, как устроен родитель, хотя это нигде не описано. Пример из книги «Effective Java».</p>
<h3>Взрыв классов</h3>
<pre><code>Coffee → MilkCoffee → SugarMilkCoffee → CaramelSugarMilkCoffee …</code></pre>
<p>Каждое сочетание свойств требует нового класса. С композицией (паттерн «Декоратор») вариантов столько, сколько нужно, а классов — по одному на добавку.</p>
<h3>Негибкость</h3>
<p>Наследование фиксируется при компиляции: нельзя «поменять родителя» объекта на лету. Компонент, переданный в конструктор, можно заменить в любой момент.</p>`,
 check: [
  { id:'q6-2a', type:'single', prompt:'Почему CountingSet насчитал 6 вместо 3?', options:['Родительский addAll внутри вызывает переопределённый add','Ошибка в HashSet','Элементы добавились дважды','Счётчик статический'], answer:0, explanation:'Подкласс зависит от деталей реализации родителя.' },
  { id:'q6-2b', type:'single', prompt:'Что такое проблема хрупкого базового класса?', options:['Изменения в базовом классе неожиданно ломают наследников','Базовый класс нельзя изменять','Базовый класс занимает много памяти','Базовый класс всегда абстрактный'], answer:0, explanation:'Наследование — самая сильная связь.' }
 ]},
 { id:'6-3', title:'Композиция вместо наследования', html:`
<p>Совет «Банды четырёх»: <b>предпочитайте композицию наследованию</b>. Исправим счётчик:</p>
<pre><code>class CountingSet&lt;E&gt; {
    private final Set&lt;E&gt; inner;
    private int added = 0;
    CountingSet(Set&lt;E&gt; inner) { this.inner = inner; }

    boolean add(E e) { added++; return inner.add(e); }
    boolean addAll(Collection&lt;? extends E&gt; c) {
        boolean changed = false;
        for (E e : c) changed |= add(e);
        return changed;
    }
    int added() { return added; }
}</code></pre>
<p>Теперь мы зависим только от публичного контракта <code>Set</code>, а не от того, как устроен <code>HashSet</code>. Бонус: работает с любым <code>Set</code>.</p>
<h3>Стратегии поведения</h3>
<pre><code>// Наследование: поведение зашито в иерархию
class FlyingDuck extends Duck { ... }
class RubberDuck extends Duck { /* не летает — переопределяем fly() пустым */ }

// Композиция: поведение — заменяемая деталь
interface FlyBehavior { void fly(); }
class Duck {
    private FlyBehavior fly;
    Duck(FlyBehavior fly) { this.fly = fly; }
    void setFly(FlyBehavior f) { fly = f; }   // можно сменить на лету
    void performFly() { fly.fly(); }
}</code></pre>
<div class="tbl"><table><tr><th>Наследование уместно</th><th>Композиция уместнее</th></tr>
<tr><td>Настоящее «является» и подкласс полностью заменяет родителя</td><td>Нужно переиспользовать код, а не тип</td></tr>
<tr><td>Родитель спроектирован для расширения</td><td>Поведение должно меняться во время работы</td></tr>
<tr><td>Иерархия мелкая и стабильная</td><td>Много независимых вариаций</td></tr>
</table></div>
<div data-widget="compose"></div>`,
 check: [
  { id:'q6-3a', type:'single', prompt:'Чем композиционная версия CountingSet лучше?', options:['Зависит только от публичного контракта Set и работает с любой его реализацией','Она короче','Она быстрее в 10 раз','Она не требует тестов'], answer:0, explanation:'Детали реализации обёрнутого объекта ей безразличны.' },
  { id:'q6-3b', type:'single', prompt:'Что композиция позволяет, а наследование — нет?', options:['Менять поведение объекта во время выполнения','Переиспользовать код','Использовать полиморфизм','Создавать объекты'], answer:0, explanation:'Компонент можно заменить сеттером или при создании.' }
 ]},
 { id:'6-4', title:'Делегирование и внедрение зависимостей', html:`
<p><b>Делегирование</b> — объект передаёт работу содержащемуся объекту. Писать методы-переходники вручную утомительно, поэтому некоторые языки делают это сами:</p>
<pre><code>// Kotlin: by — автоматическое делегирование
class CountingSet&lt;E&gt;(private val inner: MutableSet&lt;E&gt; = HashSet())
    : MutableSet&lt;E&gt; by inner {
    var added = 0
    override fun add(element: E): Boolean { added++; return inner.add(element) }
}
// Go: встраивание — методы User становятся методами Admin
type Admin struct { User; Level int }</code></pre>
<h3>Внедрение зависимостей (DI)</h3>
<p>Если объект сам создаёт свои зависимости, их нельзя заменить:</p>
<pre><code>class OrderService {
    private final Db db = new PostgresDb("prod-host");   // жёстко зашито
}</code></pre>
<p>Если зависимости передаются снаружи — через конструктор — объект становится гибким и тестируемым:</p>
<pre><code>class OrderService {
    private final Db db;
    private final Notifier notifier;
    OrderService(Db db, Notifier notifier) { this.db = db; this.notifier = notifier; }
}
// в продакшене
new OrderService(new PostgresDb(cfg), new EmailNotifier(smtp));
// в тесте
new OrderService(new InMemoryDb(), new FakeNotifier());</code></pre>
<div class="note why"><b>DI-контейнеры</b> — Spring (Java), ASP.NET Core (C#), Dagger/Koin (Kotlin), NestJS (TypeScript) — автоматически собирают такие графы объектов. Но сама идея — просто «передай зависимости в конструктор».</div>`,
 check: [
  { id:'q6-4a', type:'single', prompt:'Что такое внедрение зависимостей?', options:['Передача объекту его зависимостей извне, обычно через конструктор','Наследование от зависимости','Создание зависимостей внутри конструктора через new','Импорт библиотек'], answer:0, explanation:'Так зависимости можно заменить.' },
  { id:'q6-4b', type:'single', prompt:'Почему new PostgresDb("prod-host") внутри класса мешает тестированию?', options:['Тест не может подменить базу на фейковую','PostgreSQL медленный','Конструкторы нельзя тестировать','Строки нельзя передавать в конструктор'], answer:0, explanation:'Зависимость зашита намертво.' }
 ]}
 ],
 test: [
  { id:'t6-1', type:'single', prompt:'Что значит совет «предпочитайте композицию наследованию»?', options:['Для переиспользования кода по умолчанию выбирайте включение объекта, а наследование — только для настоящего is-a','Никогда не используйте наследование','Всегда наследуйтесь от интерфейсов','Используйте только статические методы'], answer:0, explanation:'Это совет по умолчанию, а не запрет.', difficulty:1 },
  { id:'t6-2', type:'match', prompt:'Сопоставьте пример и отношение.', pairs:[['Кошка — животное','Наследование'],['Машина — двигатель','Композиция'],['Команда — игроки','Агрегация'],['ArrayList — List','Реализация интерфейса']], explanation:'Разные виды связей.', difficulty:2 },
  { id:'t6-3', type:'single', prompt:'Как в Kotlin автоматически делегировать реализацию интерфейса полю?', options:['Ключевым словом by','Аннотацией @Delegate','Через extends','Через companion object'], answer:0, explanation:'class X(inner: Set<E>) : Set<E> by inner.', difficulty:2 },
  { id:'t6-4', type:'analyze', prompt:'Что не так с иерархией?', code:'class Notification\nclass EmailNotification : Notification\nclass UrgentEmailNotification : EmailNotification\nclass SmsNotification : Notification\nclass UrgentSmsNotification : SmsNotification\nclass UrgentEmailWithAttachmentNotification : UrgentEmailNotification\n...', options:['Взрыв классов: сочетания свойств лучше собирать композицией','Слишком мало классов','Нужно больше уровней','Всё правильно'], answer:0, explanation:'Канал, срочность и вложения — независимые оси, их надо комбинировать.', difficulty:2 },
  { id:'t6-5', type:'single', prompt:'Каким способом передачи зависимостей пользоваться по умолчанию?', options:['Через конструктор','Через глобальную переменную','Через статическое поле','Создавать внутри метода'], answer:0, explanation:'Объект сразу полностью готов, зависимости видны в сигнатуре.', difficulty:1 },
  { id:'t6-6', type:'single', prompt:'Почему наследование называют самой сильной связью между классами?', options:['Подкласс зависит даже от деталей реализации родителя','Оно требует больше памяти','Его нельзя отменить в коде','Оно работает только в одном пакете'], answer:0, explanation:'Хрупкий базовый класс.', difficulty:2 },
  { id:'t6-7', type:'multiple', prompt:'Что даёт DI? (несколько ответов)', options:['Подмену зависимостей в тестах','Явные зависимости в сигнатуре конструктора','Смену реализации без правки класса','Автоматическое ускорение кода'], answer:[0,1,2], explanation:'Скорость DI не меняет.', difficulty:1 },
  { id:'t6-8', type:'single', prompt:'Как в Go переиспользуют поведение одной структуры в другой?', options:['Встраиванием (embedding) структуры','Наследованием extends','Миксинами','Множественным наследованием'], answer:0, explanation:'type Admin struct { User }.', difficulty:2 }
 ]
},
{
 id: 7, title: 'Объекты в памяти', short: 'Ссылки и значения, равенство и хеш, копирование, жизненный цикл',
 lessons: [
 { id:'7-1', title:'Ссылки и значения', html:`
<p>Переменная объектного типа в Java, C#, Python, JS, Kotlin хранит не сам объект, а <b>ссылку</b> на него. Объект живёт в куче.</p>
<pre><code>Point a = new Point(1, 2);
Point b = a;          // копируется ссылка, объект тот же
b.x = 10;
System.out.println(a.x);   // 10!</code></pre>
<div data-widget="refs"></div>
<p>Передача в метод работает так же: метод получает копию ссылки и может изменить объект, но не может заставить внешнюю переменную указывать на другой объект.</p>
<div class="tbl"><table><tr><th>Язык</th><th>Значимые типы (копируются целиком)</th><th>Ссылочные</th></tr>
<tr><td>Java</td><td>Примитивы: int, double, boolean</td><td>Все объекты</td></tr>
<tr><td>C#</td><td>int, double, <code>struct</code></td><td><code>class</code>, string, массивы</td></tr>
<tr><td>Swift</td><td><code>struct</code>, enum, Array, String</td><td><code>class</code></td></tr>
<tr><td>C++</td><td>Всё по умолчанию — значения</td><td>Указатели <code>T*</code>, ссылки <code>T&amp;</code>, умные указатели</td></tr>
<tr><td>Python, JS</td><td>—</td><td>Всё — ссылки (неизменяемые int/str ведут себя как значения)</td></tr>
</table></div>
<div class="note warn"><b>C++ наоборот.</b> <code>Point b = a;</code> в C++ <i>копирует объект</i>. Чтобы получить поведение Java, нужна ссылка <code>Point&amp; b = a;</code> или указатель.</div>`,
 check: [
  { id:'q7-1a', type:'single', prompt:'Java: List<Integer> a = new ArrayList<>(); List<Integer> b = a; b.add(1); Чему равен a.size()?', options:['1','0','Ошибка компиляции','2'], answer:0, explanation:'a и b ссылаются на один список.' },
  { id:'q7-1b', type:'single', prompt:'В каком языке Point b = a; копирует сам объект?', options:['C++','Java','Python','JavaScript'], answer:0, explanation:'В C++ объекты по умолчанию — значения.' }
 ]},
 { id:'7-2', title:'Равенство и хеш-код', html:`
<p>Есть два вопроса: «это <b>тот же самый</b> объект?» и «эти объекты <b>равны по содержанию</b>?».</p>
<div class="tbl"><table><tr><th>Язык</th><th>Тот же объект</th><th>Равны по значению</th></tr>
<tr><td>Java</td><td><code>a == b</code></td><td><code>a.equals(b)</code></td></tr>
<tr><td>C#</td><td><code>ReferenceEquals(a, b)</code></td><td><code>a.Equals(b)</code>, <code>==</code> если перегружен</td></tr>
<tr><td>Python</td><td><code>a is b</code></td><td><code>a == b</code> (<code>__eq__</code>)</td></tr>
<tr><td>Kotlin</td><td><code>a === b</code></td><td><code>a == b</code></td></tr>
<tr><td>JavaScript</td><td><code>a === b</code></td><td>Встроенного нет</td></tr>
</table></div>
<pre><code>String s1 = new String("hi"), s2 = new String("hi");
s1 == s2;        // false — разные объекты
s1.equals(s2);   // true  — одинаковое содержимое</code></pre>
<h3>Контракт equals / hashCode</h3>
<p>Хеш-таблицы (HashMap, HashSet, dict) сначала ищут корзину по хеш-коду, потом сравнивают через equals. Поэтому:</p>
<ol class="steps">
<li>Если <code>a.equals(b)</code>, то <code>a.hashCode() == b.hashCode()</code> — <b>обязательно</b>.</li>
<li>Обратное не требуется: у разных объектов хеши могут совпасть (коллизия).</li>
<li>Переопределили <code>equals</code> — переопределите <code>hashCode</code> (в Python — <code>__eq__</code> и <code>__hash__</code>).</li>
</ol>
<pre><code>record Point(int x, int y) {}      // Java record, Kotlin data class, C# record —
new Point(1,2).equals(new Point(1,2));   // true, equals и hashCode сгенерированы</code></pre>
<div class="note why"><b>Сущности и объекты-значения.</b> <code>User</code> с id равен другому <code>User</code> с тем же id (сущность). <code>Money(100, "RUB")</code> равен любому другому <code>Money(100, "RUB")</code> (объект-значение). Это разделение из Domain-Driven Design.</div>`,
 check: [
  { id:'q7-2a', type:'single', prompt:'Переопределили equals, но не hashCode. Что сломается?', options:['Поиск в HashMap/HashSet: равные объекты окажутся в разных корзинах','Ничего','Компиляция','Сортировка списка'], answer:0, explanation:'Контракт: равные объекты — равные хеши.' },
  { id:'q7-2b', type:'match', prompt:'Сопоставьте язык и проверку «тот же объект».', pairs:[['Java','=='],['Python','is'],['Kotlin','==='],['C#','ReferenceEquals']], explanation:'Сравнение идентичности.' }
 ]},
 { id:'7-3', title:'Копирование объектов', html:`
<p>Иногда нужна независимая копия. Есть два вида:</p>
<ul>
<li><b>Поверхностная копия</b> — новый объект, но вложенные объекты общие.</li>
<li><b>Глубокая копия</b> — копируется всё дерево объектов.</li>
</ul>
<pre><code>import copy
order = {"id": 1, "items": ["хлеб", "сыр"]}
shallow = copy.copy(order)
deep = copy.deepcopy(order)
shallow["items"].append("молоко")
order["items"]     # ['хлеб', 'сыр', 'молоко'] — список общий!
deep["items"]      # ['хлеб', 'сыр'] — независимый</code></pre>
<div class="tbl"><table><tr><th>Язык</th><th>Способы</th></tr>
<tr><td>Java</td><td>Конструктор копирования <code>new Order(other)</code>; <code>clone()</code> считается неудачным API</td></tr>
<tr><td>C#</td><td><code>with</code> для record (поверхностно), <code>MemberwiseClone</code></td></tr>
<tr><td>Kotlin</td><td><code>data class.copy()</code> (поверхностно)</td></tr>
<tr><td>C++</td><td>Конструктор копирования и <code>operator=</code>; «правило трёх / пяти»</td></tr>
<tr><td>JavaScript</td><td><code>{...obj}</code> (поверхностно), <code>structuredClone(obj)</code> (глубоко)</td></tr>
</table></div>
<div class="note">Лучший способ избежать проблем с копированием — <b>неизменяемые объекты</b> (модуль 2): их не нужно копировать, ими можно просто делиться.</div>
<h3>Защитное копирование</h3>
<pre><code>class Team {
    private final List&lt;String&gt; members;
    Team(List&lt;String&gt; members) { this.members = List.copyOf(members); } // копия на входе
    List&lt;String&gt; members() { return members; }                         // неизменяемая на выходе
}</code></pre>`,
 check: [
  { id:'q7-3a', type:'single', prompt:'Чем поверхностная копия отличается от глубокой?', options:['Поверхностная разделяет вложенные объекты с оригиналом','Поверхностная копирует только половину полей','Глубокая работает только для строк','Ничем'], answer:0, explanation:'Глубокая рекурсивно копирует всё дерево.' },
  { id:'q7-3b', type:'single', prompt:'Зачем копировать список, переданный в конструктор?', options:['Чтобы внешний код не мог изменить внутреннее состояние объекта через свою ссылку','Для скорости','Так требует компилятор','Чтобы освободить память'], answer:0, explanation:'Защитное копирование сохраняет инкапсуляцию.' }
 ]},
 { id:'7-4', title:'Жизненный цикл: сборка мусора и RAII', html:`
<p>Объект создаётся конструктором. А когда он исчезает?</p>
<div class="tbl"><table><tr><th>Подход</th><th>Как работает</th><th>Языки</th></tr>
<tr><td>Сборщик мусора (GC)</td><td>Среда периодически находит недостижимые объекты и освобождает память</td><td>Java, C#, Go, JS, Kotlin</td></tr>
<tr><td>Подсчёт ссылок</td><td>Объект удаляется, когда счётчик ссылок обнуляется</td><td>Python (+ GC для циклов), Swift (ARC)</td></tr>
<tr><td>Ручное / RAII</td><td>Объект уничтожается при выходе из области видимости, вызывается деструктор</td><td>C++, Rust (владение)</td></tr>
</table></div>
<h3>Ресурсы — не память</h3>
<p>GC освобождает память, но не знает, когда закрыть файл, сокет или соединение с БД. Для этого — детерминированное освобождение:</p>
<pre><code>// Java
try (var reader = new FileReader("data.txt")) { ... }   // close() гарантирован
// C#
using var conn = new SqlConnection(cs);                 // Dispose() при выходе
# Python
with open("data.txt") as f: ...                         # __exit__
// Kotlin
FileReader("data.txt").use { ... }
// C++ — RAII: деструктор вызывается сам
{ std::ifstream f("data.txt"); ... }   // закрыт здесь</code></pre>
<div class="note warn"><b>Утечки бывают и с GC.</b> Объект, на который ссылается статическая коллекция-кэш или забытый подписчик события, никогда не станет недостижимым. Финализаторы (<code>finalize</code>, <code>__del__</code>) для освобождения ресурсов ненадёжны — используйте конструкции выше.</div>`,
 check: [
  { id:'q7-4a', type:'single', prompt:'Когда сборщик мусора может удалить объект?', options:['Когда до него нельзя добраться ни по одной ссылке','Сразу после последнего вызова метода','Через минуту после создания','Только при завершении программы'], answer:0, explanation:'Недостижимые объекты — мусор.' },
  { id:'q7-4b', type:'match', prompt:'Сопоставьте язык и конструкцию гарантированного освобождения ресурса.', pairs:[['Java','try-with-resources'],['C#','using'],['Python','with'],['C++','Деструктор (RAII)']], explanation:'Детерминированная очистка.' }
 ]}
 ],
 test: [
  { id:'t7-1', type:'analyze', prompt:'Что выведет Python-код?', code:'a = [1, 2]\nb = a\nb.append(3)\nc = a[:]\nc.append(4)\nprint(len(a), a is b, a is c)', options:['3 True False','4 True True','2 False False','3 True True'], answer:0, explanation:'b — та же ссылка, c — копия среза.', difficulty:2 },
  { id:'t7-2', type:'single', prompt:'Что сравнивает == для объектов в Java?', options:['Ссылки — тот же ли это объект','Содержимое','Хеш-коды','Типы'], answer:0, explanation:'Для содержимого — equals.', difficulty:1 },
  { id:'t7-3', type:'single', prompt:'a.equals(b) == true. Что обязательно верно?', options:['a.hashCode() == b.hashCode()','a == b','a и b — один объект','a.toString() == b.toString() как ссылки'], answer:0, explanation:'Контракт equals/hashCode.', difficulty:2 },
  { id:'t7-4', type:'single', prompt:'Почему GC не решает проблему незакрытых файлов?', options:['Он освобождает память, но не знает, когда нужно закрыть ресурс','Он не видит файлы','Файлы хранятся в стеке','GC не работает с потоками'], answer:0, explanation:'Ресурсы закрывают через using/with/try-with-resources.', difficulty:1 },
  { id:'t7-5', type:'single', prompt:'Как возможна утечка памяти в языке со сборщиком мусора?', options:['Ненужные объекты остаются достижимыми, например, из статического кэша','Никак','Только при ошибке в GC','Если объектов больше миллиона'], answer:0, explanation:'GC удаляет только недостижимое.', difficulty:2 },
  { id:'t7-6', type:'single', prompt:'Money(100, "RUB") и ещё один Money(100, "RUB") — как их правильно сравнивать?', options:['По значению: они равны','По ссылке: они разные','По хеш-коду строки','Их нельзя сравнивать'], answer:0, explanation:'Это объект-значение.', difficulty:1 },
  { id:'t7-7', type:'multiple', prompt:'Какие способы копирования — поверхностные? (несколько ответов)', options:['{...obj} в JS','copy.copy в Python','data class.copy() в Kotlin','structuredClone в JS'], answer:[0,1,2], explanation:'structuredClone делает глубокую копию.', difficulty:2 },
  { id:'t7-8', type:'single', prompt:'В Swift struct присвоили другой переменной и изменили копию. Что с оригиналом?', options:['Не изменился: struct — значимый тип','Изменился','Ошибка компиляции','Удалился'], answer:0, explanation:'Struct копируется целиком.', difficulty:2 }
 ]
},
{
 id: 8, title: 'Принципы SOLID', short: 'SRP, OCP, LSP, ISP, DIP на примерах',
 lessons: [
 { id:'8-1', title:'S — единственная ответственность', html:`
<p><b>Single Responsibility Principle</b>: у класса должна быть только одна причина для изменения. Роберт Мартин уточняет: класс отвечает перед одним «актором» — одной группой людей, которые могут потребовать изменений.</p>
<pre><code>// Нарушение: три причины для изменения
class Report {
    Data load() { /* SQL */ }               // меняется, когда меняется схема БД
    String format(Data d) { /* HTML */ }    // меняется, когда хочет дизайнер
    void email(String html) { /* SMTP */ }  // меняется, когда меняется почтовый сервис
}

// Разделение
class ReportRepository { Data load() { ... } }
class ReportFormatter  { String format(Data d) { ... } }
class ReportMailer     { void send(String html) { ... } }</code></pre>
<p>Признаки нарушения:</p>
<ul>
<li>В названии есть «And», «Manager», «Util», «Helper» — и класс на тысячу строк.</li>
<li>Изменение в одной фиче ломает тесты другой.</li>
<li>Трудно описать, что делает класс, одним предложением без «и».</li>
</ul>
<div class="note warn"><b>Без фанатизма.</b> SRP не означает «один метод на класс». Десяток классов по три строки, которые всегда меняются вместе, хуже одного связного класса.</div>`,
 check: [
  { id:'q8-1a', type:'single', prompt:'Как сформулирован SRP?', options:['У класса должна быть одна причина для изменения','В классе должен быть один метод','Класс должен иметь одно поле','У класса один наследник'], answer:0, explanation:'Причина изменения = актор, который его запросит.' },
  { id:'q8-1b', type:'single', prompt:'Класс UserService валидирует данные, хеширует пароли, пишет в БД и шлёт письма. Что посоветует SRP?', options:['Разделить на классы по ответственностям','Сделать все методы статическими','Добавить ещё методов','Ничего, это нормально'], answer:0, explanation:'Валидация, безопасность, хранение и уведомления меняются по разным причинам.' }
 ]},
 { id:'8-2', title:'O — открытость/закрытость', html:`
<p><b>Open/Closed Principle</b>: модули открыты для расширения, но закрыты для изменения. Новое поведение добавляют новым кодом, а не правкой старого.</p>
<pre><code>// Нарушение: каждый новый способ доставки — правка метода
double cost(Order o) {
    switch (o.delivery) {
        case "courier": return 300;
        case "pickup":  return 0;
        case "post":    return 150 + o.weight * 20;
        // + новый case для каждого нового способа
    }
}

// OCP: новый способ — новый класс
interface Delivery { double cost(Order o); }
class Courier implements Delivery { public double cost(Order o) { return 300; } }
class Pickup  implements Delivery { public double cost(Order o) { return 0; } }
class Post    implements Delivery { public double cost(Order o) { return 150 + o.weight() * 20; } }</code></pre>
<p>Код, который считает итог заказа, работает с <code>Delivery</code> и не меняется. Механизм — полиморфизм (модуль 4).</p>
<div class="note why"><b>Где проводить границу.</b> Нельзя сделать код открытым для всех мыслимых расширений. Применяйте OCP там, где изменения уже случались или явно ожидаются: способы оплаты, форматы экспорта, правила скидок.</div>`,
 check: [
  { id:'q8-2a', type:'single', prompt:'Что значит «закрыт для изменения»?', options:['Новое поведение добавляется новым кодом без правки существующего','Код нельзя читать','Класс помечен final','Исходники зашифрованы'], answer:0, explanation:'Существующий проверенный код не трогаем.' },
  { id:'q8-2b', type:'single', prompt:'Какой механизм ООП обычно реализует OCP?', options:['Полиморфизм через интерфейс или абстрактный класс','Статические методы','Глобальные переменные','Перегрузка операторов'], answer:0, explanation:'Новый вариант — новая реализация интерфейса.' }
 ]},
 { id:'8-3', title:'L — подстановка Барбары Лисков', html:`
<p><b>Liskov Substitution Principle</b>: объект подкласса должен работать везде, где ожидается базовый класс, не ломая корректность программы.</p>
<h3>Классический пример: квадрат и прямоугольник</h3>
<pre><code>class Rectangle {
    protected int w, h;
    void setWidth(int w)  { this.w = w; }
    void setHeight(int h) { this.h = h; }
    int area() { return w * h; }
}
class Square extends Rectangle {          // математически квадрат — прямоугольник…
    void setWidth(int w)  { this.w = this.h = w; }
    void setHeight(int h) { this.w = this.h = h; }
}

void resize(Rectangle r) {
    r.setWidth(5); r.setHeight(4);
    assert r.area() == 20;                 // для Square — 16. Сломалось!
}</code></pre>
<p>Подкласс нарушил ожидание вызывающего кода: «изменение ширины не меняет высоту». Правила LSP:</p>
<ul>
<li>Подкласс не усиливает предусловия (не требует большего от аргументов).</li>
<li>Не ослабляет постусловия (обещает не меньше).</li>
<li>Сохраняет инварианты базового класса.</li>
<li>Не бросает новых неожиданных исключений: <code>UnsupportedOperationException</code> в переопределённом методе — частый признак нарушения.</li>
</ul>
<div class="note"><b>Решение.</b> Не связывать Square и Rectangle наследованием: сделать обе фигуры неизменяемыми или реализовать общий интерфейс <code>Shape</code> с одним методом <code>area()</code>.</div>`,
 check: [
  { id:'q8-3a', type:'single', prompt:'Почему Square extends Rectangle нарушает LSP?', options:['Код, рассчитанный на независимые ширину и высоту, ломается при подстановке квадрата','Квадрат — не фигура','Нельзя переопределять сеттеры','Площадь квадрата считается иначе'], answer:0, explanation:'Поведение подкласса не соответствует ожиданиям от базового.' },
  { id:'q8-3b', type:'single', prompt:'Подкласс переопределил метод и бросает UnsupportedOperationException. О чём это говорит?', options:['Скорее всего, нарушен LSP: подкласс не умеет того, что обещает базовый тип','Всё хорошо','Нарушен SRP','Это требование Java'], answer:0, explanation:'Например, ReadOnlyList extends List с запретом add.' }
 ]},
 { id:'8-4', title:'I и D — разделение интерфейсов и инверсия зависимостей', html:`
<h3>ISP: Interface Segregation Principle</h3>
<p>Клиенты не должны зависеть от методов, которыми не пользуются. Лучше несколько маленьких интерфейсов, чем один «толстый».</p>
<pre><code>// Нарушение
interface Worker { void work(); void eat(); void sleep(); }
class Robot implements Worker { void eat() { throw new UnsupportedOperationException(); } ... }

// Разделение
interface Workable { void work(); }
interface Eatable  { void eat(); }
class Human implements Workable, Eatable { ... }
class Robot implements Workable { ... }</code></pre>
<h3>DIP: Dependency Inversion Principle</h3>
<p>Модули верхнего уровня (бизнес-логика) не должны зависеть от модулей нижнего уровня (БД, почта, HTTP). Оба должны зависеть от абстракций.</p>
<pre><code>// Без DIP: бизнес-логика зависит от конкретной БД
class OrderService { private MySqlOrderRepo repo = new MySqlOrderRepo(); }

// С DIP: интерфейс принадлежит бизнес-слою, БД его реализует
interface OrderRepository { void save(Order o); }      // в модуле domain
class OrderService { OrderService(OrderRepository repo) { ... } }
class MySqlOrderRepository implements OrderRepository { ... }  // в модуле infrastructure</code></pre>
<p>Стрелка зависимости «перевернулась»: теперь инфраструктура зависит от домена, а не наоборот. На этом построены «чистая архитектура» и «гексагональная архитектура».</p>
<div class="tbl"><table><tr><th>Буква</th><th>Кратко</th></tr>
<tr><td>S</td><td>Одна причина для изменения</td></tr>
<tr><td>O</td><td>Расширять, не изменяя</td></tr>
<tr><td>L</td><td>Подкласс заменяет базовый без сюрпризов</td></tr>
<tr><td>I</td><td>Маленькие специализированные интерфейсы</td></tr>
<tr><td>D</td><td>Зависеть от абстракций, а не от деталей</td></tr>
</table></div>`,
 check: [
  { id:'q8-4a', type:'single', prompt:'Что нарушает класс Robot, вынужденный реализовать eat()?', options:['ISP — интерфейс слишком толстый','DIP','SRP','OCP'], answer:0, explanation:'Клиент зависит от ненужного метода.' },
  { id:'q8-4b', type:'single', prompt:'Где по DIP должен находиться интерфейс OrderRepository?', options:['В слое бизнес-логики, которая его использует','В модуле MySQL','В библиотеке JDBC','Неважно'], answer:0, explanation:'Абстракцией владеет потребитель.' }
 ]}
 ],
 test: [
  { id:'t8-1', type:'match', prompt:'Сопоставьте букву SOLID и принцип.', pairs:[['S','Одна причина для изменения'],['O','Открыт для расширения, закрыт для изменения'],['L','Подстановка подкласса вместо базового'],['I','Разделение интерфейсов'],['D','Зависимость от абстракций']], explanation:'Пять принципов Роберта Мартина.', difficulty:1 },
  { id:'t8-2', type:'analyze', prompt:'Какой принцип нарушен?', code:'double discount(Customer c) {\n    if (c.type.equals("regular")) return 0;\n    if (c.type.equals("silver")) return 0.05;\n    if (c.type.equals("gold")) return 0.1;\n    // маркетинг просит добавить "platinum"...\n}', options:['OCP','LSP','ISP','DIP'], answer:0, explanation:'Каждый новый тип клиента — правка метода.', difficulty:2 },
  { id:'t8-3', type:'analyze', prompt:'Какой принцип нарушен?', code:'class Bird { void fly() { ... } }\nclass Penguin extends Bird {\n    void fly() { throw new UnsupportedOperationException(); }\n}\nfor (Bird b : birds) b.fly();', options:['LSP','SRP','OCP','DIP'], answer:0, explanation:'Пингвин не может заменить птицу там, где ожидается полёт.', difficulty:2 },
  { id:'t8-4', type:'single', prompt:'Класс InvoiceService создаёт внутри new SmtpClient("smtp.corp"). Какой принцип нарушен в первую очередь?', options:['DIP','LSP','ISP','OCP'], answer:0, explanation:'Бизнес-логика зависит от конкретной инфраструктуры.', difficulty:2 },
  { id:'t8-5', type:'single', prompt:'Кто сформулировал набор SOLID?', options:['Роберт Мартин (принципы), Майкл Фэзерс (аббревиатура)','Алан Кэй','Банда четырёх','Бьёрн Страуструп'], answer:0, explanation:'Начало 2000-х.', difficulty:2 },
  { id:'t8-6', type:'single', prompt:'Что из этого — разумное применение SRP?', options:['Вынести форматирование отчёта из класса, который загружает данные','Разбить класс на классы по одному методу','Объединить все сервисы в один','Сделать все поля public'], answer:0, explanation:'Разделяем по причинам изменения.', difficulty:1 },
  { id:'t8-7', type:'single', prompt:'Как связаны DIP и внедрение зависимостей?', options:['DI — практический способ реализовать DIP: зависимости-абстракции передаются извне','Это одно и то же слово','Они противоречат друг другу','DI нарушает DIP'], answer:0, explanation:'DIP — принцип, DI — техника.', difficulty:2 },
  { id:'t8-8', type:'multiple', prompt:'Какие признаки указывают на нарушение SRP? (несколько ответов)', options:['Класс называется DataManagerHelper и на 2000 строк','Изменение формата письма ломает тесты расчёта цены','Описание класса требует нескольких «и»','Класс реализует один интерфейс'], answer:[0,1,2], explanation:'Один интерфейс — нормально.', difficulty:1 }
 ]
},
{
 id: 9, title: 'Принципы проектирования', short: 'Связность и зацепление, DRY, KISS, YAGNI, закон Деметры, GRASP',
 lessons: [
 { id:'9-1', title:'Связность и зацепление', html:`
<p>Две главные метрики качества дизайна:</p>
<ul>
<li><b>Связность (cohesion)</b> — насколько элементы внутри класса относятся к одной задаче. Нужна <b>высокая</b>.</li>
<li><b>Зацепление (coupling)</b> — насколько классы зависят друг от друга. Нужно <b>низкое</b>.</li>
</ul>
<div class="tbl"><table><tr><th></th><th>Плохо</th><th>Хорошо</th></tr>
<tr><td>Связность</td><td><code>Utils</code> с методами для дат, строк, файлов и SQL</td><td><code>DateRange</code> — только про диапазоны дат</td></tr>
<tr><td>Зацепление</td><td>Класс знает внутренние поля пяти других классов</td><td>Класс общается с другими через маленькие интерфейсы</td></tr>
</table></div>
<p>Виды зацепления — от сильного к слабому:</p>
<ol class="steps">
<li>Через содержимое: один класс меняет приватные данные другого (рефлексия, публичные поля).</li>
<li>Через общее глобальное состояние.</li>
<li>Через наследование.</li>
<li>Через конкретный класс в параметре.</li>
<li>Через интерфейс.</li>
<li>Через сообщения/события — отправитель не знает получателя.</li>
</ol>
<div class="note why"><b>Почему это главное.</b> Почти все принципы — SOLID, GRASP, паттерны — это конкретные способы повысить связность и снизить зацепление. Если сомневаетесь в решении, спросите: «что станет с зацеплением?»</div>`,
 check: [
  { id:'q9-1a', type:'single', prompt:'Какое сочетание желательно?', options:['Высокая связность, низкое зацепление','Низкая связность, высокое зацепление','Обе высокие','Обе низкие'], answer:0, explanation:'Внутри класса всё про одно, между классами — мало зависимостей.' },
  { id:'q9-1b', type:'single', prompt:'Класс StringDateFileSqlUtils — пример…', options:['…низкой связности','…низкого зацепления','…высокой связности','…хорошего дизайна'], answer:0, explanation:'Методы ничем не объединены.' }
 ]},
 { id:'9-2', title:'DRY, KISS, YAGNI', html:`
<h3>DRY — Don't Repeat Yourself</h3>
<p>Каждое знание должно иметь одно авторитетное представление в системе. Правило «минимальный заказ — 500 ₽» записано в одном месте, а не в контроллере, сервисе и JS-валидаторе отдельно.</p>
<div class="note warn"><b>Ложное дублирование.</b> Два одинаковых куска кода, которые меняются по разным причинам, — не дублирование. Объединив их, вы свяжете то, что должно развиваться независимо. Правило трёх: обобщайте, когда повтор появился в третий раз.</div>
<h3>KISS — Keep It Simple</h3>
<p>Простое решение предпочтительнее хитрого. Три понятных класса лучше одного «универсального фреймворка» с рефлексией и конфигурацией на XML.</p>
<h3>YAGNI — You Aren't Gonna Need It</h3>
<p>Не пишите то, что «может понадобиться потом». Интерфейс с единственной реализацией и без планов на вторую, параметр <code>options</code> «на будущее», абстрактная фабрика для одного класса — всё это стоит времени на поддержку уже сейчас.</p>
<pre><code>// YAGNI-нарушение
interface IUserServiceFactoryProvider { IUserServiceFactory get(); }

// Достаточно
class UserService { ... }</code></pre>
<div class="tbl"><table><tr><th>Принцип</th><th>Против чего</th></tr>
<tr><td>DRY</td><td>Одно правило в нескольких местах</td></tr>
<tr><td>KISS</td><td>Лишняя сложность</td></tr>
<tr><td>YAGNI</td><td>Код «на вырост»</td></tr>
</table></div>`,
 check: [
  { id:'q9-2a', type:'single', prompt:'Что говорит YAGNI?', options:['Не реализуйте функциональность, пока она действительно не нужна','Повторяйте код, где удобно','Всегда делайте интерфейс для каждого класса','Пишите тесты после релиза'], answer:0, explanation:'Гипотетические требования часто не наступают.' },
  { id:'q9-2b', type:'single', prompt:'Два одинаковых метода валидации для разных доменов меняются по разным причинам. Нужно ли объединять?', options:['Не обязательно: это может быть ложное дублирование','Обязательно, по DRY','Удалить оба','Сделать статическими'], answer:0, explanation:'DRY — про знание, а не про похожие строки.' }
 ]},
 { id:'9-3', title:'Закон Деметры', html:`
<p><b>Закон Деметры</b> («говорите только с ближайшими друзьями»): метод объекта вызывает методы только у:</p>
<ul>
<li>самого объекта (<code>this</code>);</li>
<li>своих полей;</li>
<li>своих параметров;</li>
<li>объектов, которые сам создал.</li>
</ul>
<pre><code>// Нарушение — «поезд» из вызовов
String city = order.getCustomer().getAddress().getCity().toUpperCase();

// Метод знает устройство Order, Customer и Address.
// Поменяли Address — сломался код оплаты.

// Лучше
String city = order.deliveryCity();</code></pre>
<p>Закон снижает зацепление: код зависит только от непосредственных соседей.</p>
<div class="note"><b>Исключения.</b> Цепочки fluent-API и потоков данных (<code>list.stream().filter(...).map(...)</code>, builder) не нарушают закон по смыслу: каждый вызов возвращает объект того же уровня абстракции, а не лезет внутрь чужой структуры.</div>`,
 check: [
  { id:'q9-3a', type:'single', prompt:'Какой вызов нарушает закон Деметры?', options:['order.getCustomer().getWallet().withdraw(sum)','order.total()','this.repository.save(order)','param.getName()'], answer:0, explanation:'Метод лезет через два чужих объекта.' },
  { id:'q9-3b', type:'single', prompt:'Что даёт соблюдение закона Деметры?', options:['Меньше зацепление: изменения внутренних структур не расходятся по системе','Более быстрый код','Меньше классов','Больше наследования'], answer:0, explanation:'Знание о структуре локализовано.' }
 ]},
 { id:'9-4', title:'GRASP: кому дать ответственность', html:`
<p><b>GRASP</b> (Крэг Ларман) — набор подсказок для главного вопроса ООП-дизайна: <i>какой класс должен это делать?</i></p>
<div class="tbl"><table><tr><th>Принцип</th><th>Подсказка</th></tr>
<tr><td>Information Expert</td><td>Дайте обязанность тому, у кого есть данные. Сумму заказа считает <code>Order</code>, у которого есть позиции.</td></tr>
<tr><td>Creator</td><td>Объект B создаёт A, если B содержит A или тесно с ним работает: <code>Order</code> создаёт <code>OrderLine</code>.</td></tr>
<tr><td>Controller</td><td>Системные события (нажатие, HTTP-запрос) принимает отдельный объект-контроллер и передаёт в домен.</td></tr>
<tr><td>Low Coupling</td><td>Из вариантов выбирайте тот, где меньше связей.</td></tr>
<tr><td>High Cohesion</td><td>Обязанности класса должны быть тесно связаны.</td></tr>
<tr><td>Polymorphism</td><td>Различия по типу — полиморфизмом, а не <code>switch</code>.</td></tr>
<tr><td>Pure Fabrication</td><td>Если в предметной области подходящего класса нет, придумайте технический: <code>OrderRepository</code>.</td></tr>
<tr><td>Indirection</td><td>Посредник между двумя классами снижает их связь.</td></tr>
<tr><td>Protected Variations</td><td>Изменчивые места закрывайте стабильным интерфейсом.</td></tr>
</table></div>
<pre><code>// Information Expert
class Order {
    private final List&lt;OrderLine&gt; lines = new ArrayList&lt;&gt;();
    void add(Product p, int qty) { lines.add(new OrderLine(p, qty)); }   // Creator
    Money total() { return lines.stream().map(OrderLine::subtotal).reduce(Money.ZERO, Money::plus); }
}
class OrderLine {
    Money subtotal() { return product.price().times(qty); }   // эксперт по своей строке
}</code></pre>
<div class="note why"><b>Анемичная модель.</b> Если все классы домена — только поля с геттерами, а вся логика в «сервисах», это нарушение Information Expert. Такую модель называют анемичной.</div>`,
 check: [
  { id:'q9-4a', type:'single', prompt:'Кто по Information Expert должен считать итоговую сумму заказа?', options:['Order — у него есть позиции','OrderController','Утилитный класс MathUtils','База данных'], answer:0, explanation:'Обязанность — тому, у кого данные.' },
  { id:'q9-4b', type:'single', prompt:'Что такое анемичная доменная модель?', options:['Классы с данными без поведения, вся логика вынесена в сервисы','Модель без базы данных','Модель с малым числом классов','Неизменяемые объекты'], answer:0, explanation:'Мартин Фаулер считает это антипаттерном для сложного домена.' }
 ]}
 ],
 test: [
  { id:'t9-1', type:'single', prompt:'Что такое зацепление (coupling)?', options:['Степень зависимости классов друг от друга','Степень единства задач внутри класса','Число методов','Глубина наследования'], answer:0, explanation:'Внутреннее единство — связность.', difficulty:1 },
  { id:'t9-2', type:'order', prompt:'Расположите виды зацепления от самого сильного к самому слабому.', options:['Прямой доступ к чужим приватным данным','Общее глобальное состояние','Наследование','Зависимость от интерфейса','Обмен событиями'], answer:[0,1,2,3,4], explanation:'Чем меньше знает один класс о другом, тем слабее связь.', difficulty:3 },
  { id:'t9-3', type:'match', prompt:'Сопоставьте принцип и суть.', pairs:[['DRY','Одно знание — одно место'],['KISS','Предпочитайте простое'],['YAGNI','Не пишите «на будущее»'],['Закон Деметры','Говорите только с ближайшими']], explanation:'Четыре популярных принципа.', difficulty:1 },
  { id:'t9-4', type:'analyze', prompt:'Какой принцип нарушает код?', code:'if (user.getAccount().getSubscription().getPlan().getLimits().getMaxProjects() > count) {\n    ...\n}', options:['Закон Деметры','DRY','YAGNI','LSP'], answer:0, explanation:'Длинная цепочка через чужие объекты.', difficulty:1 },
  { id:'t9-5', type:'single', prompt:'Какой GRASP-принцип оправдывает класс OrderRepository, которого нет в предметной области?', options:['Pure Fabrication','Information Expert','Creator','Polymorphism'], answer:0, explanation:'Технический класс ради связности и низкого зацепления.', difficulty:2 },
  { id:'t9-6', type:'single', prompt:'Кто по GRASP Creator должен создавать OrderLine?', options:['Order','OrderController','Main','Database'], answer:0, explanation:'Order содержит строки заказа.', difficulty:2 },
  { id:'t9-7', type:'single', prompt:'Когда, по «правилу трёх», стоит обобщать повторяющийся код?', options:['Когда повтор появился в третий раз','Сразу при первом повторе','Никогда','После релиза'], answer:0, explanation:'К третьему разу становится понятно, что общего.', difficulty:2 },
  { id:'t9-8', type:'single', prompt:'Почему stream().filter().map() не считают нарушением закона Деметры?', options:['Это fluent-API: каждый вызов возвращает объект того же уровня, а не лезет во внутреннюю структуру','Закон Деметры не относится к Java','Потоки быстрые','Это статические методы'], answer:0, explanation:'Нарушение — когда идём вглубь чужих объектов.', difficulty:3 }
 ]
},
{
 id: 10, title: 'Паттерны проектирования', short: 'Порождающие, структурные и поведенческие паттерны GoF',
 lessons: [
 { id:'10-1', title:'Порождающие: фабрика, строитель, одиночка', html:`
<p><b>Паттерн</b> — типовое решение повторяющейся задачи проектирования, у которого есть имя. Имя важнее кода: «здесь стратегия» — и коллега понимает устройство без объяснений.</p>
<h3>Фабричный метод</h3>
<p>Создание объекта прячется за методом, который решает, какой класс создать.</p>
<pre><code>interface Parser { Data parse(String text); }
class ParserFactory {
    static Parser forFile(String name) {
        if (name.endsWith(".json")) return new JsonParser();
        if (name.endsWith(".csv"))  return new CsvParser();
        throw new IllegalArgumentException(name);
    }
}</code></pre>
<h3>Строитель (Builder)</h3>
<p>Пошаговое создание сложного объекта вместо конструктора с десятью параметрами.</p>
<pre><code>HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.example.com"))
    .header("Accept", "application/json")
    .timeout(Duration.ofSeconds(5))
    .build();</code></pre>
<p>В Kotlin, Python и C# строитель часто заменяют именованные параметры со значениями по умолчанию.</p>
<h3>Одиночка (Singleton)</h3>
<p>Гарантирует один экземпляр класса и глобальную точку доступа.</p>
<pre><code>class Config {
    private static final Config INSTANCE = new Config();
    private Config() {}
    static Config get() { return INSTANCE; }
}
// Kotlin: object Config { ... }</code></pre>
<div class="note warn"><b>Singleton часто считают антипаттерном</b>: это глобальное состояние, скрытая зависимость и проблема для тестов. Вместо него создают один экземпляр в точке сборки приложения и передают через DI («одиночка по соглашению»).</div>`,
 check: [
  { id:'q10-1a', type:'single', prompt:'Когда уместен Builder?', options:['Объект с множеством необязательных параметров собирается пошагово','Нужен ровно один экземпляр','Нужно адаптировать чужой интерфейс','Нужно уведомлять подписчиков'], answer:0, explanation:'Вместо «телескопических» конструкторов.' },
  { id:'q10-1b', type:'single', prompt:'Главная претензия к Singleton?', options:['Это глобальное состояние и скрытая зависимость, мешающая тестам','Он медленный','Его нельзя написать в Java','Он создаёт слишком много объектов'], answer:0, explanation:'Альтернатива — один экземпляр через DI.' }
 ]},
 { id:'10-2', title:'Структурные: адаптер, декоратор, фасад', html:`
<h3>Адаптер</h3>
<p>Приводит чужой интерфейс к нужному вашему коду. Как переходник для розетки.</p>
<pre><code>interface PaymentGateway { void pay(Money m); }
class StripeAdapter implements PaymentGateway {
    private final StripeClient stripe;           // сторонняя библиотека
    public void pay(Money m) { stripe.createCharge(m.cents(), m.currency()); }
}</code></pre>
<h3>Декоратор</h3>
<p>Оборачивает объект, добавляя поведение, и реализует тот же интерфейс. Обёртки можно вкладывать друг в друга.</p>
<pre><code>interface DataSource { String read(); }
class FileSource implements DataSource { ... }
class GzipDecorator implements DataSource {
    private final DataSource inner;
    GzipDecorator(DataSource inner) { this.inner = inner; }
    public String read() { return unzip(inner.read()); }
}
DataSource s = new LoggingDecorator(new GzipDecorator(new FileSource("a.gz")));</code></pre>
<p>Так устроены потоки ввода-вывода Java (<code>new BufferedReader(new InputStreamReader(...))</code>) и middleware в веб-фреймворках. Python-декораторы <code>@cache</code> — та же идея для функций.</p>
<h3>Фасад</h3>
<p>Простой интерфейс к сложной подсистеме.</p>
<pre><code>class VideoConverter {          // внутри — кодеки, буферы, аудио-микшер
    File convert(File in, String format) { ... }
}</code></pre>
<div class="tbl"><table><tr><th>Паттерн</th><th>Интерфейс</th><th>Цель</th></tr>
<tr><td>Адаптер</td><td>Меняет на другой</td><td>Совместимость</td></tr>
<tr><td>Декоратор</td><td>Тот же</td><td>Добавить поведение</td></tr>
<tr><td>Фасад</td><td>Новый, упрощённый</td><td>Скрыть сложность</td></tr>
<tr><td>Прокси</td><td>Тот же</td><td>Контроль доступа, ленивость, кэш</td></tr>
</table></div>`,
 check: [
  { id:'q10-2a', type:'single', prompt:'Чем декоратор отличается от адаптера?', options:['Декоратор сохраняет интерфейс и добавляет поведение, адаптер меняет интерфейс','Ничем','Декоратор работает только с файлами','Адаптер добавляет поведение'], answer:0, explanation:'Адаптер — переходник, декоратор — обёртка.' },
  { id:'q10-2b', type:'single', prompt:'new BufferedReader(new FileReader("a.txt")) — это пример…', options:['…декоратора','…одиночки','…наблюдателя','…фабрики'], answer:0, explanation:'Буферизация добавлена обёрткой с тем же интерфейсом Reader.' }
 ]},
 { id:'10-3', title:'Поведенческие: стратегия, наблюдатель, команда', html:`
<h3>Стратегия</h3>
<p>Семейство взаимозаменяемых алгоритмов за общим интерфейсом.</p>
<pre><code>interface SortStrategy { void sort(int[] a); }
class Sorter {
    private SortStrategy s;
    Sorter(SortStrategy s) { this.s = s; }
    void sort(int[] a) { s.sort(a); }
}
// В языках с функциями первого класса стратегия — просто функция:
list.sort(Comparator.comparing(User::age));
users.sort(key=lambda u: u.age)</code></pre>
<h3>Наблюдатель (Observer)</h3>
<p>Объект уведомляет подписчиков о событиях, не зная, кто они.</p>
<pre><code>interface OrderListener { void onPlaced(Order o); }
class OrderService {
    private final List&lt;OrderListener&gt; listeners = new ArrayList&lt;&gt;();
    void subscribe(OrderListener l) { listeners.add(l); }
    void place(Order o) { ...; listeners.forEach(l -&gt; l.onPlaced(o)); }
}
service.subscribe(o -&gt; mailer.sendConfirmation(o));
service.subscribe(o -&gt; analytics.track(o));</code></pre>
<p>Это события в C# (<code>event</code>), <code>addEventListener</code> в браузере, реактивные потоки (RxJS, Flow).</p>
<h3>Команда</h3>
<p>Запрос превращается в объект: его можно поставить в очередь, сохранить, отменить.</p>
<pre><code>interface Command { void execute(); void undo(); }
class InsertText implements Command { ... }
Deque&lt;Command&gt; history = new ArrayDeque&lt;&gt;();
cmd.execute(); history.push(cmd);
history.pop().undo();   // Ctrl+Z</code></pre>`,
 check: [
  { id:'q10-3a', type:'single', prompt:'Какой паттерн реализует отмену действий (Ctrl+Z)?', options:['Команда','Одиночка','Фасад','Адаптер'], answer:0, explanation:'Каждое действие — объект с execute и undo.' },
  { id:'q10-3b', type:'single', prompt:'Что такое Comparator, передаваемый в list.sort()?', options:['Стратегия сравнения','Наблюдатель','Декоратор','Фабрика'], answer:0, explanation:'Взаимозаменяемый алгоритм.' }
 ]},
 { id:'10-4', title:'Шаблонный метод, итератор, состояние', html:`
<h3>Шаблонный метод</h3>
<p>Базовый класс задаёт скелет алгоритма, наследники переопределяют шаги.</p>
<pre><code>abstract class DataExporter {
    final void export() {           // шаблон — final
        var data = load();
        var text = format(data);    // шаг, который меняется
        write(text);
    }
    abstract String format(Data d);
}
class CsvExporter extends DataExporter { String format(Data d) { ... } }</code></pre>
<p>Стратегия делает то же через композицию, шаблонный метод — через наследование.</p>
<h3>Итератор</h3>
<p>Последовательный обход коллекции, не раскрывая её устройства. Встроен почти во все языки:</p>
<pre><code>for (var x : collection)       // Java: Iterable / Iterator
foreach (var x in collection)  // C#: IEnumerable, yield return
for x in collection:           # Python: __iter__ / __next__, генераторы yield
for (const x of collection)    // JS: Symbol.iterator</code></pre>
<h3>Состояние</h3>
<p>Объект меняет поведение при смене внутреннего состояния — каждое состояние вынесено в свой класс.</p>
<pre><code>interface OrderState { OrderState pay(); OrderState ship(); }
class New     implements OrderState { public OrderState pay() { return new Paid(); }
                                      public OrderState ship() { throw new IllegalStateException(); } }
class Paid    implements OrderState { public OrderState ship() { return new Shipped(); } ... }</code></pre>
<div class="note why"><b>Каталог.</b> Всего у GoF 23 паттерна: 5 порождающих, 7 структурных, 11 поведенческих. Не учите их наизусть — изучайте, какую задачу решает каждый, и узнавайте их в коде фреймворков.</div>
<div data-widget="patterns"></div>`,
 check: [
  { id:'q10-4a', type:'single', prompt:'Чем шаблонный метод отличается от стратегии?', options:['Шаблонный метод меняет шаги через наследование, стратегия — через композицию','Ничем','Стратегия работает только с сортировкой','Шаблонный метод нельзя использовать в Java'], answer:0, explanation:'Одна задача — два механизма.' },
  { id:'q10-4b', type:'single', prompt:'Какой паттерн встроен в цикл foreach почти любого языка?', options:['Итератор','Наблюдатель','Одиночка','Фасад'], answer:0, explanation:'Коллекция отдаёт итератор, цикл его обходит.' }
 ]}
 ],
 test: [
  { id:'t10-1', type:'match', prompt:'Сопоставьте задачу и паттерн.', pairs:[['Подключить чужую библиотеку к своему интерфейсу','Адаптер'],['Уведомить несколько модулей о новом заказе','Наблюдатель'],['Выбирать алгоритм расчёта скидки','Стратегия'],['Создавать объект со множеством опций','Строитель']], explanation:'Паттерн определяется задачей.', difficulty:1 },
  { id:'t10-2', type:'match', prompt:'Сопоставьте паттерн и группу GoF.', pairs:[['Фабричный метод','Порождающий'],['Декоратор','Структурный'],['Команда','Поведенческий'],['Фасад','Структурный']], explanation:'Три группы паттернов.', difficulty:2 },
  { id:'t10-3', type:'analyze', prompt:'Какой паттерн здесь использован?', code:'Logger log = new TimestampLogger(\n               new FilterLogger(Level.WARN,\n                   new ConsoleLogger()));', options:['Декоратор','Одиночка','Состояние','Фабрика'], answer:0, explanation:'Вложенные обёртки с одним интерфейсом.', difficulty:1 },
  { id:'t10-4', type:'single', prompt:'Что делать вместо Singleton для общего объекта конфигурации?', options:['Создать один экземпляр при старте и передавать через конструкторы (DI)','Использовать глобальную переменную','Создавать новый при каждом обращении','Сделать все методы статическими'], answer:0, explanation:'Явная зависимость, легко подменить в тестах.', difficulty:2 },
  { id:'t10-5', type:'single', prompt:'Заказ может быть New, Paid, Shipped, Cancelled, и в каждом статусе по-разному работают pay() и ship(). Какой паттерн?', options:['Состояние','Адаптер','Строитель','Фасад'], answer:0, explanation:'Вместо switch по статусу в каждом методе.', difficulty:2 },
  { id:'t10-6', type:'single', prompt:'Почему в Python и Kotlin паттерн «Стратегия» часто — просто передача функции?', options:['Функции — объекты первого класса, отдельный интерфейс не нужен','Эти языки не поддерживают интерфейсы','Так быстрее компилируется','Паттерны в них запрещены'], answer:0, explanation:'Лямбда и есть стратегия.', difficulty:2 },
  { id:'t10-7', type:'single', prompt:'Сколько паттернов в каталоге «Банды четырёх»?', options:['23','12','40','7'], answer:0, explanation:'5 + 7 + 11.', difficulty:1 },
  { id:'t10-8', type:'single', prompt:'Как называется паттерн «простой интерфейс к сложной подсистеме»?', options:['Фасад','Прокси','Мост','Компоновщик'], answer:0, explanation:'Фасад скрывает сложность.', difficulty:1 }
 ]
},
{
 id: 11, title: 'ООП в разных языках', short: 'Java/C#, C++, Python, JS/TS, Kotlin/Swift, Go/Rust, как учить новый язык',
 lessons: [
 { id:'11-1', title:'Java, C# и Kotlin', html:`
<p>Три близких языка со статической типизацией, сборщиком мусора и классическим классовым ООП.</p>
<pre><code>// Java
public final class User {
    private final String name;
    public User(String name) { this.name = name; }
    public String getName() { return name; }
}
// C#
public sealed class User {
    public string Name { get; }
    public User(string name) =&gt; Name = name;
}
// Kotlin
class User(val name: String)</code></pre>
<div class="tbl"><table><tr><th></th><th>Java</th><th>C#</th><th>Kotlin</th></tr>
<tr><td>Наследование</td><td><code>extends</code>, открыто по умолчанию</td><td><code>:</code>, методы <code>virtual</code></td><td><code>:</code>, закрыто по умолчанию (<code>open</code>)</td></tr>
<tr><td>Свойства</td><td>getX/setX</td><td><code>{ get; set; }</code></td><td><code>val</code> / <code>var</code></td></tr>
<tr><td>Классы данных</td><td><code>record</code></td><td><code>record</code></td><td><code>data class</code></td></tr>
<tr><td>Null-безопасность</td><td>Нет (Optional)</td><td>Nullable reference types</td><td>В системе типов: <code>String?</code></td></tr>
<tr><td>Статика</td><td><code>static</code></td><td><code>static</code></td><td><code>companion object</code>, <code>object</code></td></tr>
<tr><td>Расширение чужих классов</td><td>—</td><td>Extension methods</td><td>Extension functions</td></tr>
<tr><td>Экосистема</td><td>Spring, Android</td><td>ASP.NET, Unity</td><td>Android, Ktor, Spring</td></tr>
</table></div>
<div class="note why"><b>Переход.</b> Зная один из трёх, второй осваивают за пару недель: отличаются в основном синтаксис и стандартная библиотека.</div>
<div class="note">Следующий шаг для C#: <a href="../csharp/">курс «C# и .NET для будущих ASP.NET-разработчиков»</a> — он опирается на этот курс и не повторяет теорию ООП.</div>`,
 check: [
  { id:'q11-1a', type:'single', prompt:'В каком языке классы по умолчанию закрыты для наследования?', options:['Kotlin','Java','Python','JavaScript'], answer:0, explanation:'Нужно явно написать open.' },
  { id:'q11-1b', type:'match', prompt:'Сопоставьте язык и класс данных.', pairs:[['Java','record'],['C#','record'],['Kotlin','data class']], explanation:'Неизменяемые классы с equals/hashCode.' }
 ]},
 { id:'11-2', title:'C++: ООП без сборщика мусора', html:`
<pre><code>class Shape {
public:
    virtual ~Shape() = default;          // виртуальный деструктор обязателен в базе!
    virtual double area() const = 0;     // чисто виртуальный = абстрактный
};
class Circle : public Shape {
    double r_;
public:
    explicit Circle(double r) : r_(r) {}  // список инициализации
    double area() const override { return 3.14159 * r_ * r_; }
};

std::vector&lt;std::unique_ptr&lt;Shape&gt;&gt; shapes;
shapes.push_back(std::make_unique&lt;Circle&gt;(2.0));
for (const auto&amp; s : shapes) std::cout &lt;&lt; s-&gt;area();</code></pre>
<p>Особенности, к которым надо привыкнуть:</p>
<ul>
<li><b>Объекты — значения.</b> Полиморфизм работает только через указатели и ссылки. Присвоение объекта наследника переменной базового типа «срезает» его (<i>object slicing</i>).</li>
<li><b>Методы не виртуальные по умолчанию.</b> Нужно <code>virtual</code>, а в наследнике — <code>override</code>.</li>
<li><b>RAII и умные указатели.</b> <code>unique_ptr</code> — единоличное владение, <code>shared_ptr</code> — подсчёт ссылок. Голые <code>new/delete</code> в современном коде — редкость.</li>
<li><b>Правило трёх/пяти/нуля.</b> Если вы написали деструктор, нужны и копирование, и перемещение — или лучше не писать ни одного (правило нуля).</li>
<li><b>Множественное наследование</b> и <code>const</code>-методы.</li>
</ul>
<div class="note warn">Без <code>virtual ~Shape()</code> удаление <code>Circle</code> через указатель на <code>Shape</code> — неопределённое поведение.</div>`,
 check: [
  { id:'q11-2a', type:'single', prompt:'Как в C++ объявить абстрактный метод?', options:['virtual double area() const = 0;','abstract double area();','double area() abstract;','@abstract area()'], answer:0, explanation:'Чисто виртуальная функция.' },
  { id:'q11-2b', type:'single', prompt:'Что такое object slicing?', options:['Копирование наследника в переменную базового типа теряет его часть и полиморфизм','Разделение класса на файлы','Удаление объекта','Сериализация'], answer:0, explanation:'Shape s = circle; — копия только базовой части.' }
 ]},
 { id:'11-3', title:'Python и JavaScript/TypeScript', html:`
<pre><code># Python
from dataclasses import dataclass
from typing import Protocol

class Shape(Protocol):
    def area(self) -&gt; float: ...

@dataclass
class Circle:
    r: float
    def area(self) -&gt; float: return 3.14159 * self.r ** 2
    def __str__(self): return f"Circle({self.r})"     # магический метод</code></pre>
<pre><code>// TypeScript
interface Shape { area(): number; }
class Circle implements Shape {
    constructor(private readonly r: number) {}       // параметр-свойство
    area(): number { return Math.PI * this.r ** 2; }
}
const s: Shape = { area: () =&gt; 42 };                 // структурная типизация: тоже Shape</code></pre>
<div class="tbl"><table><tr><th></th><th>Python</th><th>JavaScript / TypeScript</th></tr>
<tr><td>Модель</td><td>Классы, всё — объект, даже классы и функции</td><td>Прототипы, class — обёртка</td></tr>
<tr><td>Доступ</td><td>Соглашения <code>_x</code></td><td>TS: <code>private</code> (только проверка), JS: <code>#x</code> (настоящий)</td></tr>
<tr><td>Интерфейсы</td><td>ABC, Protocol (структурно)</td><td>TS interface (структурно, исчезает в JS)</td></tr>
<tr><td>Множественное наследование</td><td>Да, MRO</td><td>Нет, миксины через функции</td></tr>
<tr><td>Перегрузка операторов</td><td><code>__add__</code>, <code>__eq__</code>, <code>__len__</code></td><td>Нет</td></tr>
</table></div>
<div class="note">Python подробно, от основ до Django и ИИ: <a href="../python/">курс «Python: от основ к Django и ИИ»</a> — он опирается на этот курс и не повторяет теорию ООП.</div>
<div class="note why"><b>Pythonic.</b> В Python меньше «церемоний»: модули вместо статических классов, функции вместо однометодных интерфейсов, duck typing вместо иерархий. Не переносите в Python Java-стиль с фабриками фабрик.</div>`,
 check: [
  { id:'q11-3a', type:'single', prompt:'Что делает typing.Protocol в Python?', options:['Описывает интерфейс со структурной проверкой — наследоваться не обязательно','Создаёт сетевой протокол','Запрещает наследование','Делает класс неизменяемым'], answer:0, explanation:'Как интерфейсы в Go и TypeScript.' },
  { id:'q11-3b', type:'single', prompt:'Что происходит с TypeScript-интерфейсами во время выполнения?', options:['Их нет — они стираются при компиляции в JS','Они превращаются в классы','Проверяются при каждом вызове','Становятся прототипами'], answer:0, explanation:'Типы TS существуют только на этапе проверки.' }
 ]},
 { id:'11-4', title:'Go, Rust и как учить новый ООП-язык', html:`
<p>Go и Rust показывают, что ООП-идеи живут и без классов:</p>
<pre><code>// Go: структуры + методы + неявные интерфейсы
type Shape interface { Area() float64 }
type Circle struct { R float64 }
func (c Circle) Area() float64 { return math.Pi * c.R * c.R }   // Circle — Shape автоматически

// Rust: struct + impl + trait
trait Shape { fn area(&amp;self) -&gt; f64; }
struct Circle { r: f64 }
impl Shape for Circle { fn area(&amp;self) -&gt; f64 { 3.14159 * self.r * self.r } }
let shapes: Vec&lt;Box&lt;dyn Shape&gt;&gt; = vec![Box::new(Circle { r: 2.0 })];</code></pre>
<p>Инкапсуляция — через видимость на уровне пакета (в Go имя с заглавной буквы экспортируется), полиморфизм — через интерфейсы и трейты, переиспользование — через композицию и встраивание.</p>
<h3>Чек-лист изучения нового языка</h3>
<ol class="steps">
<li>Как объявить класс (или структуру), поля, конструктор?</li>
<li>Какие модификаторы доступа и что по умолчанию?</li>
<li>Есть ли наследование классов? Одиночное или множественное? Методы виртуальны по умолчанию?</li>
<li>Как выглядят интерфейсы: номинальные или структурные? Есть ли реализации по умолчанию?</li>
<li>Объекты — ссылки или значения? Как работают равенство и хеш?</li>
<li>Как управляется память и освобождаются ресурсы?</li>
<li>Как сделать неизменяемый класс данных?</li>
<li>Как обрабатываются null и ошибки?</li>
<li>Какие идиомы приняты в сообществе (Pythonic, idiomatic Go)?</li>
<li>Какой DI и тестовый фреймворк используют?</li>
</ol>
<div class="note why"><b>Итог курса.</b> Синтаксис меняется, принципы — нет. Инкапсуляция, полиморфизм через интерфейсы, композиция, SOLID и паттерны одинаково работают в Java, C#, Kotlin, Swift, Python, TypeScript, C++, Go и Rust. Выбирайте язык под задачу и пользуйтесь чек-листом выше.</div>`,
 check: [
  { id:'q11-4a', type:'single', prompt:'Как в Go экспортируется (делается публичным) поле или метод?', options:['Имя начинается с заглавной буквы','Ключевым словом public','Аннотацией @Export','Никак'], answer:0, explanation:'Видимость определяется регистром первой буквы.' },
  { id:'q11-4b', type:'multiple', prompt:'Что есть в Rust? (несколько ответов)', options:['Трейты','Структуры с методами (impl)','Динамический полиморфизм через dyn Trait','Наследование классов'], answer:[0,1,2], explanation:'Наследования классов в Rust нет.' }
 ]}
 ],
 test: [
  { id:'t11-1', type:'match', prompt:'Сопоставьте язык и способ объявить интерфейс.', pairs:[['Go','type X interface'],['Rust','trait'],['Swift','protocol'],['C++','Абстрактный класс с = 0']], explanation:'Одна идея — много названий.', difficulty:1 },
  { id:'t11-2', type:'single', prompt:'Почему в C++ базовому полиморфному классу нужен виртуальный деструктор?', options:['Чтобы при удалении через указатель на базу вызвался деструктор наследника','Чтобы класс стал абстрактным','Для ускорения','Так требует компоновщик'], answer:0, explanation:'Иначе — неопределённое поведение.', difficulty:2 },
  { id:'t11-3', type:'analyze', prompt:'Что выведет TypeScript-код (после компиляции)?', code:'interface Named { name: string }\nclass Dog { constructor(public name: string) {} }\nfunction hello(x: Named) { return "Привет, " + x.name; }\nconsole.log(hello(new Dog("Рекс")));', options:['Привет, Рекс','Ошибка: Dog не implements Named','undefined','Ошибка во время выполнения'], answer:0, explanation:'Структурная типизация: у Dog есть name.', difficulty:2 },
  { id:'t11-4', type:'single', prompt:'Какой язык нужно изучать с оглядкой на то, что объекты по умолчанию — значения?', options:['C++','Java','Python','Kotlin'], answer:0, explanation:'И Swift для struct.', difficulty:1 },
  { id:'t11-5', type:'single', prompt:'Какой подход наиболее «питоничен» для однометодного интерфейса стратегии?', options:['Передать функцию','Создать абстрактный класс и фабрику','Использовать Singleton','Написать метакласс'], answer:0, explanation:'Функции — объекты первого класса.', difficulty:2 },
  { id:'t11-6', type:'single', prompt:'В каком из языков есть null-безопасность в системе типов (String и String? — разные типы)?', options:['Kotlin','Java','JavaScript','C++'], answer:0, explanation:'Также Swift (Optional) и C# с nullable reference types.', difficulty:2 },
  { id:'t11-7', type:'multiple', prompt:'Какие принципы ООП переносятся между всеми рассмотренными языками? (несколько ответов)', options:['Полиморфизм через интерфейсы','Композиция','Инкапсуляция','Множественное наследование классов'], answer:[0,1,2], explanation:'Множественное наследование есть только в C++ и Python.', difficulty:1 },
  { id:'t11-8', type:'single', prompt:'Как в Go переиспользуют поля и методы другой структуры?', options:['Встраиванием структуры','extends','Трейтами','Миксинами'], answer:0, explanation:'Композиция вместо наследования.', difficulty:1 }
 ]
}
];

export const UPCOMING = [];

export const GLOSSARY = [
 ['Парадигма','Способ структурировать программу: процедурный, объектный, функциональный.','0-1'],
 ['Объект','Сущность с состоянием, поведением и идентичностью.','0-2'],
 ['Идентичность','Свойство объекта отличаться от другого даже при одинаковом состоянии.','0-2'],
 ['Сообщение','Запрос к объекту выполнить операцию — вызов метода.','0-2'],
 ['Прототип','Объект, которому другой объект делегирует отсутствующие свойства (JavaScript).','0-4'],
 ['Класс','Шаблон, описывающий поля и методы объектов.','1-1'],
 ['Экземпляр','Конкретный объект, созданный по классу.','1-1'],
 ['Поле','Переменная, хранящая часть состояния объекта.','1-1'],
 ['Метод','Функция, принадлежащая классу и работающая с объектом.','1-1'],
 ['Конструктор','Метод, приводящий новый объект в корректное начальное состояние.','1-2'],
 ['this / self','Ссылка на текущий объект внутри метода.','1-3'],
 ['Статический член','Поле или метод, принадлежащий классу, а не экземпляру.','1-4'],
 ['Инкапсуляция','Сокрытие внутреннего устройства объекта и защита его состояния.','2-1'],
 ['Модификатор доступа','Ключевое слово, задающее видимость члена: private, protected, public.','2-2'],
 ['Свойство','Член класса с синтаксисом поля и логикой геттера/сеттера.','2-3'],
 ['Инвариант','Условие, истинное для любого корректного объекта класса.','2-3'],
 ['Tell, don\'t ask','Принцип: говорить объекту, что сделать, а не расспрашивать о данных.','2-3'],
 ['Неизменяемый объект','Объект, состояние которого не меняется после создания.','2-4'],
 ['Наследование','Создание класса на основе другого с отношением «является».','3-1'],
 ['Переопределение','Своя реализация унаследованного метода в подклассе.','3-2'],
 ['super','Обращение к реализации базового класса.','3-2'],
 ['Абстрактный класс','Класс, который нельзя создать напрямую; может содержать абстрактные методы.','3-3'],
 ['Проблема ромба','Неоднозначность при множественном наследовании от общего предка.','3-4'],
 ['MRO','Порядок поиска методов при множественном наследовании в Python.','3-4'],
 ['Полиморфизм','Работа с объектами разных классов через общий тип.','4-1'],
 ['Позднее связывание','Выбор реализации метода во время выполнения по реальному типу объекта.','4-2'],
 ['vtable','Таблица виртуальных методов класса для динамической диспетчеризации.','4-2'],
 ['Перегрузка','Несколько методов с одним именем и разными параметрами.','4-3'],
 ['Утиная типизация','Подходит любой объект с нужными методами, независимо от класса.','4-3'],
 ['Структурная типизация','Совместимость типов по набору членов, а не по объявлению.','4-3'],
 ['Обобщения','Код, параметризованный типом: List<T>.','4-4'],
 ['Абстракция','Выделение существенного и сокрытие деталей.','5-1'],
 ['Интерфейс','Контракт — набор методов, которые обязуется предоставить класс.','5-2'],
 ['Миксин','Класс с поведением, подмешиваемым в другие классы.','5-4'],
 ['Трейт','Набор методов с реализациями по умолчанию (Rust, Scala, PHP).','5-4'],
 ['Композиция','Объект содержит другие объекты и делегирует им работу (has-a).','6-1'],
 ['Агрегация','Слабая форма композиции: части живут независимо от целого.','6-1'],
 ['Хрупкий базовый класс','Изменения базового класса неожиданно ломают наследников.','6-2'],
 ['Делегирование','Передача работы содержащемуся объекту.','6-4'],
 ['Внедрение зависимостей','Передача объекту его зависимостей извне.','6-4'],
 ['Ссылочный тип','Тип, переменная которого хранит ссылку на объект в куче.','7-1'],
 ['Значимый тип','Тип, значение которого копируется целиком при присваивании.','7-1'],
 ['equals / hashCode','Пара методов для сравнения по значению и работы в хеш-таблицах.','7-2'],
 ['Объект-значение','Объект, равенство которого определяется содержимым (Money, Point).','7-2'],
 ['Глубокая копия','Копия объекта вместе со всеми вложенными объектами.','7-3'],
 ['Сборщик мусора','Механизм автоматического освобождения недостижимых объектов.','7-4'],
 ['RAII','Привязка освобождения ресурса к времени жизни объекта (C++).','7-4'],
 ['SOLID','Пять принципов объектного проектирования Роберта Мартина.','8-1'],
 ['SRP','У класса одна причина для изменения.','8-1'],
 ['OCP','Открыт для расширения, закрыт для изменения.','8-2'],
 ['LSP','Подкласс должен заменять базовый без нарушения корректности.','8-3'],
 ['ISP','Клиенты не зависят от методов, которые не используют.','8-4'],
 ['DIP','Модули зависят от абстракций, а не от деталей.','8-4'],
 ['Связность','Степень единства задач внутри модуля.','9-1'],
 ['Зацепление','Степень зависимости модулей друг от друга.','9-1'],
 ['DRY','Каждое знание имеет одно представление в системе.','9-2'],
 ['YAGNI','Не реализуйте то, что пока не нужно.','9-2'],
 ['Закон Деметры','Объект общается только с ближайшими «друзьями».','9-3'],
 ['GRASP','Принципы распределения обязанностей между классами.','9-4'],
 ['Анемичная модель','Доменные классы без поведения, логика вынесена в сервисы.','9-4'],
 ['Паттерн проектирования','Именованное типовое решение повторяющейся задачи дизайна.','10-1'],
 ['Фабричный метод','Порождающий паттерн: создание объекта через метод, выбирающий класс.','10-1'],
 ['Строитель','Порождающий паттерн пошаговой сборки сложного объекта.','10-1'],
 ['Одиночка','Паттерн с единственным экземпляром класса и глобальным доступом.','10-1'],
 ['Адаптер','Структурный паттерн, приводящий интерфейс к ожидаемому.','10-2'],
 ['Декоратор','Обёртка с тем же интерфейсом, добавляющая поведение.','10-2'],
 ['Фасад','Упрощённый интерфейс к сложной подсистеме.','10-2'],
 ['Стратегия','Взаимозаменяемые алгоритмы за общим интерфейсом.','10-3'],
 ['Наблюдатель','Подписчики получают уведомления о событиях объекта.','10-3'],
 ['Команда','Запрос, оформленный объектом: очередь, история, отмена.','10-3'],
 ['Шаблонный метод','Скелет алгоритма в базовом классе, шаги — в наследниках.','10-4'],
 ['Итератор','Последовательный обход коллекции без раскрытия её устройства.','10-4'],
 ['Состояние','Поведение объекта зависит от класса-состояния.','10-4'],
 ['Object slicing','Потеря части объекта наследника при копировании в переменную базового типа (C++).','11-2'],
 ['Protocol','Структурный интерфейс в Python и Swift.','11-3']
];
