// Модуль 5. Веб-платформа: API браузера
export default {
 id: 5, title: 'Веб-платформа: API браузера', short: 'Хранилища, воркеры, PWA, веб-компоненты, сеть',
 lessons: [
 { id: '5-1', title: 'Хранилища: cookies, Web Storage, IndexedDB, Cache', topics: [], html: `
<p>Все хранилища браузера объединяет одно правило: данные принадлежат <b>origin</b> — тройке «схема + хост + порт». <code>https://shop.example</code> и <code>https://api.shop.example</code> — разные origin и не видят хранилищ друг друга. Это фундамент модели безопасности, о нём подробнее в модуле 10.</p>
<div class="tbl"><table><tr><th></th><th>Cookie</th><th>localStorage</th><th>IndexedDB</th><th>Cache API</th></tr>
<tr><td>Объём</td><td>~4 КБ</td><td>~5 МБ</td><td colspan="2">Доля свободного диска</td></tr>
<tr><td>API</td><td>Строка <code>document.cookie</code></td><td>Синхронный, строки</td><td>Асинхронный, объекты и индексы</td><td>Асинхронный, Request → Response</td></tr>
<tr><td>Видит сервер</td><td>Да, с каждым запросом</td><td colspan="3">Нет</td></tr>
<tr><td>Из воркера</td><td>Нет</td><td>Нет</td><td>Да</td><td>Да</td></tr>
</table></div>
<h3>Cookie — хранилище для сервера</h3>
<p>Cookie задуманы не для данных приложения, а для состояния между браузером и сервером: браузер автоматически прикрепляет их к запросам. Атрибуты <code>HttpOnly</code> (недоступна из JS), <code>Secure</code>, <code>SameSite</code>, <code>Domain</code>, <code>Path</code> и <code>Max-Age</code> решают, когда и куда она уйдёт. Хранить в cookie что-то «для фронтенда» — значит гонять это по сети в каждом запросе, включая картинки.</p>
<h3>Web Storage — просто, но синхронно</h3>
<p><code>localStorage</code> хранит строки и живёт бессрочно, <code>sessionStorage</code> — пока жива вкладка. API синхронный: чтение большого значения блокирует главный поток, а при первом обращении браузер может читать файл с диска. Событие <code>storage</code> позволяет синхронизировать вкладки одного origin — на нём построена синхронизация прогресса между вкладками этого сайта.</p>
<h3>IndexedDB — база данных</h3>
<p>Транзакционное хранилище объектов с индексами, курсорами и версиями схемы. Хранит структурированные данные (structured clone, урок 5.3), файлы и <code>Blob</code>. API низкоуровневый и событийный, поэтому обычно используют обёртку (idb, Dexie). Транзакция автоматически завершается, когда в ней не осталось запросов, и <code>await</code> чего-то постороннего внутри неё её «закрывает» — частая ловушка.</p>
<h3>Cache API и квоты</h3>
<p>Cache API хранит пары «запрос — ответ» и создан для Service Worker (урок 5.4). Для всех «больших» хранилищ браузер ведёт общую <b>квоту</b> на origin; при нехватке места данные «best-effort» могут быть вытеснены целиком. <code>navigator.storage.persist()</code> просит сделать хранилище постоянным, <code>navigator.storage.estimate()</code> показывает объём.</p>
<div class="note"><b>Где протекает.</b> Safari удаляет всё, что записано скриптом, если пользователь не взаимодействовал с сайтом 7 дней (ITP). В приватном режиме хранилища исчезают с окончанием сессии, а иногда вызов бросает исключение. Поэтому браузерное хранилище — кеш и удобство, а не надёжное место для единственной копии данных пользователя.</div>`,
 check: [
  { id:'q5-1a', type:'single', prompt:'Почему не стоит хранить в cookie настройки интерфейса?', options:['Cookie автоматически отправляются с каждым запросом к серверу, раздувая трафик','Cookie нельзя прочитать из JS','Cookie живут только 1 час','Cookie не поддерживают строки'], answer:0, explanation:'Для данных клиента — Web Storage или IndexedDB.', difficulty:1 },
  { id:'q5-1b', type:'single', prompt:'Видят ли https://shop.example и https://api.shop.example общий localStorage?', options:['Нет: это разные origin','Да: домен общий','Да, если оба на HTTPS','Только в Chrome'], answer:0, explanation:'Origin — это схема, хост и порт целиком.', difficulty:1 }
 ]},
 { id: '5-2', title: 'Сеть из браузера: fetch, стримы, WebSocket, SSE', topics: ['streamed-responses'], html: `
<p><code>fetch</code> — не просто «функция запроса», а API из нескольких объектов: <code>Request</code>, <code>Response</code>, <code>Headers</code> и <b>потоки</b>. Те же объекты использует Service Worker, а серверные рантаймы (Node.js, Deno, Cloudflare Workers) переняли их как стандарт.</p>
<h3>Две стадии ответа</h3>
<p>Промис <code>fetch()</code> выполняется, как только пришли <b>заголовки</b>. Тело ещё в пути и читается отдельно: <code>res.json()</code>, <code>res.text()</code>, <code>res.blob()</code> или потоком через <code>res.body</code>. Важно: статус 404 или 500 — не ошибка для fetch. Промис отклоняется только при сетевом сбое, отмене или блокировке CORS. Проверяйте <code>res.ok</code>.</p>
<h3>Стримы</h3>
<p><code>res.body</code> — это <code>ReadableStream</code> байтов. Его можно читать кусками по мере поступления, не дожидаясь конца ответа:</p>
<pre><code>const res = await fetch('/api/chat', { method: 'POST', body });
const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
for (;;) {
  const { value, done } = await reader.read();
  if (done) break;
  output.append(value);           // текст появляется по мере генерации
}</code></pre>
<p>Так работают чаты с LLM, большие экспорты и прогресс загрузки. Потоки поддерживают <b>backpressure</b>: если потребитель не успевает, производитель замедляется, и память не растёт. <code>TransformStream</code> и <code>pipeThrough</code> строят конвейеры: распаковка (<code>DecompressionStream</code>), декодирование, парсинг строк.</p>
<h3>Server-Sent Events</h3>
<p><code>EventSource</code> — однонаправленный поток событий от сервера по обычному HTTP. Протокол текстовый (<code>data: …</code>), браузер сам переподключается и передаёт <code>Last-Event-ID</code>, чтобы сервер продолжил с места обрыва. Идеально для уведомлений и живых лент. Ограничение: только GET и только текст; для POST с телом (как в чатах LLM) используют fetch со стримом.</p>
<h3>WebSocket</h3>
<p>Полнодуплексный канал поверх одного TCP-соединения. Начинается как HTTP-запрос с <code>Upgrade: websocket</code>, дальше — свой протокол кадров. Обе стороны отправляют сообщения когда угодно: чаты, совместное редактирование, игры. Но переподключение, heartbeat, буферизацию при обрыве и масштабирование серверов (липкие сессии, pub/sub между узлами) вы делаете сами. Новый <b>WebTransport</b> поверх HTTP/3 добавляет несколько потоков и ненадёжные датаграммы.</p>
<div class="tbl"><table><tr><th>Задача</th><th>Выбор</th></tr>
<tr><td>Обычный запрос-ответ</td><td>fetch</td></tr>
<tr><td>Длинный ответ по частям</td><td>fetch + ReadableStream</td></tr>
<tr><td>Поток событий от сервера</td><td>SSE</td></tr>
<tr><td>Частый обмен в обе стороны</td><td>WebSocket</td></tr>
</table></div>`,
 check: [
  { id:'q5-2a', type:'single', prompt:'Сервер ответил 500. Что сделает промис fetch?', options:['Выполнится с res.ok === false','Отклонится с ошибкой','Будет ждать вечно','Повторит запрос'], answer:0, explanation:'fetch отклоняется только при сетевом сбое, отмене или блокировке CORS.', difficulty:1 },
  { id:'q5-2b', type:'single', prompt:'Чем SSE удобнее WebSocket для живой ленты уведомлений?', options:['Обычный HTTP, автоматическое переподключение и продолжение с Last-Event-ID','SSE позволяет отправлять данные на сервер','SSE передаёт бинарные данные','SSE работает без сервера'], answer:0, explanation:'Для однонаправленного потока SSE проще.', difficulty:2 }
 ]},
 { id: '5-3', title: 'Воркеры: параллелизм в браузере', topics: [], html: `
<p>Главный поток один (урок 0.4), и всё тяжёлое на нём ухудшает INP. <b>Web Worker</b> — способ выполнить JS в отдельном потоке со своим event loop и своей глобальной областью (<code>self</code>).</p>
<pre><code>// main.js
const worker = new Worker(new URL('./parse.js', import.meta.url), { type: 'module' });
worker.postMessage(hugeCsvText);
worker.onmessage = e =&gt; render(e.data);
// parse.js
self.onmessage = e =&gt; self.postMessage(parse(e.data));</code></pre>
<h3>Чего у воркера нет</h3>
<p>Доступа к DOM, <code>window</code>, <code>document</code>, <code>localStorage</code>. Есть: <code>fetch</code>, IndexedDB, Cache API, таймеры, WebSocket, <code>OffscreenCanvas</code>, WebAssembly. Это осознанное ограничение: DOM не потокобезопасен, и общий доступ к нему потребовал бы блокировок.</p>
<h3>Общение: structured clone</h3>
<p>У потоков нет общей памяти объектов. <code>postMessage</code> <b>копирует</b> данные алгоритмом structured clone: поддерживаются объекты, массивы, Map, Set, Date, RegExp, Blob, типизированные массивы и даже циклические ссылки, но не функции, DOM-узлы и прототипы классов — экземпляр класса приедет обычным объектом. Копирование 50 МБ данных само стоит заметное время.</p>
<p>Поэтому большие бинарные буферы <b>передают</b>, а не копируют: <code>postMessage(buf, [buf])</code>. <code>ArrayBuffer</code> становится доступен получателю за O(1), а у отправителя «отсоединяется» (длина 0). Так же передаются <code>MessagePort</code>, <code>ImageBitmap</code>, <code>OffscreenCanvas</code> и потоки.</p>
<h3>Общая память</h3>
<p><code>SharedArrayBuffer</code> даёт настоящую разделяемую память, а <code>Atomics</code> — атомарные операции и ожидание. Из-за атак класса Spectre он доступен только на страницах в режиме <b>cross-origin isolation</b>: заголовки <code>Cross-Origin-Opener-Policy: same-origin</code> и <code>Cross-Origin-Embedder-Policy: require-corp</code>.</p>
<h3>Виды воркеров</h3>
<ul>
<li><b>Dedicated Worker</b> — принадлежит одной странице.</li>
<li><b>Shared Worker</b> — общий для вкладок одного origin: одно WebSocket-соединение на все вкладки.</li>
<li><b>Service Worker</b> — прокси между страницами и сетью, живёт независимо от вкладок (следующий урок).</li>
<li><b>Worklet</b> — лёгкие скрипты внутри конвейера: Audio, Paint (CSS Houdini).</li>
</ul>
<div class="note why"><b>Когда воркер оправдан.</b> Парсинг больших файлов, обработка изображений, поиск по большому массиву, тяжёлая криптография, синтаксическая подсветка. Для мелких задач накладные расходы на копирование съедят выигрыш. Библиотека Comlink превращает <code>postMessage</code> в вызовы асинхронных функций через прокси.</div>`,
 check: [
  { id:'q5-3a', type:'single', prompt:'Что произойдёт с экземпляром класса User при передаче в воркер через postMessage?', options:['Он придёт обычным объектом без методов прототипа','Он придёт полноценным экземпляром','postMessage выбросит ошибку','Он будет общим для двух потоков'], answer:0, explanation:'Structured clone копирует данные, но не прототипы и функции.', difficulty:2 },
  { id:'q5-3b', type:'single', prompt:'Что значит передать ArrayBuffer как transferable?', options:['Владение переходит получателю мгновенно, у отправителя буфер становится пустым','Буфер копируется в фоне','Буфер становится общим для обоих потоков','Буфер сжимается'], answer:0, explanation:'Передача без копирования, за O(1).', difficulty:2 }
 ]},
 { id: '5-4', title: 'Service Worker и PWA', topics: ['service-workers','pwas'], html: `
<p><b>Service Worker</b> — скрипт, который браузер ставит между вашими страницами и сетью. Он перехватывает все запросы страниц в своей области (scope) и решает: ответить из кеша, сходить в сеть или собрать ответ сам. Этот сайт использует Service Worker, чтобы уроки открывались без интернета.</p>
<h3>Жизненный цикл</h3>
<ol class="steps">
<li><b>Регистрация:</b> <code>navigator.serviceWorker.register('/sw.js')</code>. Только на HTTPS или localhost.</li>
<li><b>install</b> — момент заполнить кеш базовыми файлами.</li>
<li><b>waiting</b> — если страницы уже управляются старой версией, новая ждёт, пока не закроются все вкладки. Так в одной сессии не смешиваются две версии кода. <code>skipWaiting()</code> пропускает ожидание.</li>
<li><b>activate</b> — удалить старые кеши. <code>clients.claim()</code> берёт под контроль уже открытые страницы.</li>
<li><b>fetch</b>, <b>push</b>, <b>sync</b> — события работы.</li>
</ol>
<p>Воркер не живёт постоянно: браузер останавливает его через десятки секунд простоя и запускает заново на следующее событие. Поэтому глобальные переменные в нём — не хранилище состояния.</p>
<h3>Стратегии кеширования</h3>
<div class="tbl"><table><tr><th>Стратегия</th><th>Как</th><th>Для чего</th></tr>
<tr><td>Cache first</td><td>Кеш, при промахе — сеть</td><td>Файлы с хешем в имени, шрифты</td></tr>
<tr><td>Network first</td><td>Сеть, при сбое — кеш</td><td>HTML-страницы, свежие данные</td></tr>
<tr><td>Stale-while-revalidate</td><td>Сразу кеш, параллельно обновить</td><td>Аватары, иконки, некритичные данные</td></tr>
<tr><td>Network only</td><td>Не трогать</td><td>API с личными данными, POST</td></tr>
</table></div>
<pre><code>self.addEventListener('fetch', e =&gt; {
  if (e.request.mode === 'navigate') e.respondWith(networkFirst(e.request));
});</code></pre>
<div class="note"><b>Где протекает.</b> Ошибка в стратегии кеширования переживает деплой: если воркер отдаёт HTML из кеша без проверки сети, пользователи застрянут на старой версии, пока не обновится сам воркер. Сам файл <code>sw.js</code> браузер проверяет на изменения при навигациях, минуя HTTP-кеш не дольше чем на 24 часа, но лучше отдавать его с <code>Cache-Control: no-cache</code>.</div>
<h3>PWA</h3>
<p><b>Progressive Web App</b> — сайт, который можно установить как приложение. Минимум: HTTPS, <b>манифест</b> (<code>manifest.webmanifest</code> с именем, иконками, <code>start_url</code> и <code>display: standalone</code>) и, для офлайна, Service Worker. Установленное приложение запускается в своём окне без адресной строки, получает иконку на рабочем столе и в списке приложений.</p>
<p>Дополнительно доступны push-уведомления (Push API через сервер браузера; на iOS — только для установленных PWA), фоновая синхронизация, бейджи на иконке, обработка файлов и ссылок, шаринг. Ограничения зависят от платформы: Safari поддерживает меньше API, чем Chromium.</p>`,
 check: [
  { id:'q5-4a', type:'single', prompt:'Почему новая версия Service Worker не активируется сразу после установки?', options:['Она ждёт, пока закроются все вкладки со старой версией, чтобы не смешивать две версии кода','Браузер проверяет её антивирусом','Она активируется только через 24 часа','Нужна перезагрузка браузера'], answer:0, explanation:'Это состояние waiting; skipWaiting() его пропускает.', difficulty:2 },
  { id:'q5-4b', type:'match', prompt:'Сопоставьте ресурс и стратегию кеширования.', pairs:[['app.3f9c2e1.js','Cache first'],['HTML-страница','Network first'],['Аватар пользователя','Stale-while-revalidate'],['POST /api/order','Network only']], explanation:'Неизменяемое — из кеша, свежее — из сети, некритичное — из кеша с фоновым обновлением.', difficulty:2 }
 ]},
 { id: '5-5', title: 'Веб-компоненты: Custom Elements, Shadow DOM, шаблоны', topics: ['web-components','custom-elements','shadow-dom','html-templates'], html: `
<p>У платформы есть своя компонентная модель, не зависящая от фреймворков. Это три независимых стандарта, которые обычно используют вместе.</p>
<h3>Custom Elements</h3>
<p>Собственный тег с жизненным циклом. Имя обязано содержать дефис — так оно никогда не столкнётся с будущими стандартными тегами.</p>
<pre><code>class UserCard extends HTMLElement {
  static observedAttributes = ['name'];
  connectedCallback() { this.render(); }          // вставлен в документ
  disconnectedCallback() { /* отписаться */ }     // удалён
  attributeChangedCallback() { this.render(); }   // изменился атрибут
  render() { this.textContent = 'Привет, ' + this.getAttribute('name'); }
}
customElements.define('user-card', UserCard);</code></pre>
<p>Если тег встретился в HTML до вызова <code>define</code>, браузер создаст «неопознанный» элемент, а после регистрации <b>апгрейдит</b> его — заменит прототип и вызовет колбэки. Псевдокласс <code>:not(:defined)</code> позволяет скрыть такие элементы до апгрейда.</p>
<h3>Shadow DOM</h3>
<p><code>this.attachShadow({ mode: 'open' })</code> создаёт у элемента скрытое поддерево — <b>shadow root</b>. Оно изолировано в обе стороны:</p>
<ul>
<li>Стили снаружи не проникают внутрь (кроме наследуемых свойств вроде <code>color</code> и <b>custom properties</b> — главный способ темизации).</li>
<li>Стили изнутри не вытекают наружу; селектор <code>.title</code> внутри не заденет страницу.</li>
<li><code>document.querySelector</code> не видит узлы внутри.</li>
<li>События, всплывающие из shadow root, <b>ретаргетятся</b>: снаружи <code>e.target</code> указывает на сам компонент, а не на внутреннюю кнопку. Это сохраняет инкапсуляцию.</li>
</ul>
<p>Для управляемой стилизации снаружи компонент помечает части атрибутом <code>part="label"</code>, а пользователь пишет <code>user-card::part(label) { … }</code>. Declarative Shadow DOM (<code>&lt;template shadowrootmode="open"&gt;</code>) позволяет создать shadow root прямо в HTML — это делает возможным SSR веб-компонентов.</p>
<h3>Шаблоны и слоты</h3>
<p><code>&lt;template&gt;</code> — инертный фрагмент: его содержимое распарсено, но не отрисовано, картинки не грузятся, скрипты не выполняются. Клонирование <code>template.content.cloneNode(true)</code> быстрее, чем парсинг строки через innerHTML. <code>&lt;slot&gt;</code> внутри shadow root — место, куда браузер «проецирует» дочерние элементы компонента из light DOM. Узлы физически остаются снаружи, но отображаются внутри.</p>
<div class="note why"><b>Когда выбирать.</b> Веб-компоненты хороши там, где компонент должен работать в любом окружении: дизайн-системы для нескольких фреймворков, встраиваемые виджеты, микрофронтенды. Как замена фреймворку для целого приложения они менее удобны: нет встроенной реактивности, шаблонизации и SSR «из коробки» — это добавляют библиотеки вроде Lit.</div>`,
 check: [
  { id:'q5-5a', type:'single', prompt:'Как стилизовать внутренности веб-компонента с Shadow DOM снаружи?', options:['Через custom properties и ::part()','Обычным селектором user-card .title','Через !important','Никак'], answer:0, explanation:'Shadow DOM изолирует стили, но пропускает наследуемые свойства и CSS-переменные; ::part открывает помеченные части.', difficulty:2 },
  { id:'q5-5b', type:'single', prompt:'Почему имя пользовательского элемента обязано содержать дефис?', options:['Чтобы никогда не совпасть с будущими стандартными тегами','Так требует CSS','Для поддержки старых браузеров','Чтобы отличать от атрибутов'], answer:0, explanation:'Стандартные HTML-теги дефисов не содержат.', difficulty:1 }
 ]}
 ],
 test: [
  { id:'t5-1', type:'single', prompt:'Что определяет origin?', options:['Схема, хост и порт','Только домен','Домен и путь','IP-адрес сервера'], answer:0, explanation:'http://a.com и https://a.com — разные origin.', difficulty:1 },
  { id:'t5-2', type:'multiple', prompt:'Какие хранилища доступны из Web Worker? (несколько ответов)', options:['IndexedDB','Cache API','localStorage','document.cookie'], answer:[0,1], explanation:'Синхронные хранилища и cookie — только на главном потоке.', difficulty:2 },
  { id:'t5-3', type:'single', prompt:'Почему localStorage плохо подходит для больших данных?', options:['API синхронный и блокирует главный поток','Он очищается при закрытии вкладки','Он отправляется на сервер','Он не поддерживает JSON'], answer:0, explanation:'Для больших данных — асинхронный IndexedDB.', difficulty:1 },
  { id:'t5-4', type:'single', prompt:'Когда выполняется промис fetch()?', options:['Когда пришли заголовки ответа, тело может ещё загружаться','Когда загружено всё тело','Сразу после отправки запроса','После парсинга JSON'], answer:0, explanation:'Тело читается отдельно — целиком или потоком.', difficulty:2 },
  { id:'t5-5', type:'single', prompt:'Что такое backpressure в потоках?', options:['Замедление производителя, когда потребитель не успевает читать','Сжатие данных','Повторная отправка','Обратный порядок чанков'], answer:0, explanation:'Благодаря этому поток не копит данные в памяти.', difficulty:2 },
  { id:'t5-6', type:'match', prompt:'Сопоставьте задачу и инструмент.', pairs:[['Ответ LLM по мере генерации','fetch + ReadableStream'],['Лента уведомлений от сервера','SSE'],['Совместное редактирование в реальном времени','WebSocket']], explanation:'Выбор зависит от направления и частоты обмена.', difficulty:1 },
  { id:'t5-7', type:'single', prompt:'Почему у Web Worker нет доступа к DOM?', options:['DOM не потокобезопасен, общий доступ потребовал бы блокировок','Это ограничение безопасности CORS','Воркеры выполняются на сервере','DOM слишком большой для копирования'], answer:0, explanation:'Воркер общается со страницей сообщениями.', difficulty:2 },
  { id:'t5-8', type:'single', prompt:'Что нужно для использования SharedArrayBuffer?', options:['Cross-origin isolation: заголовки COOP same-origin и COEP require-corp','Только HTTPS','Service Worker','Разрешение пользователя'], answer:0, explanation:'Ограничение введено после атак Spectre.', difficulty:3 },
  { id:'t5-9', type:'order', prompt:'Расположите этапы жизненного цикла Service Worker.', options:['register','install','waiting','activate','fetch'], answer:[0,1,2,3,4], explanation:'Waiting пропускается, если старой версии нет или вызван skipWaiting.', difficulty:2 },
  { id:'t5-10', type:'multiple', prompt:'Что минимально нужно, чтобы сайт можно было установить как PWA? (несколько ответов)', options:['HTTPS','Манифест с именем и иконками','Push-уведомления','Публикация в магазине приложений'], answer:[0,1], explanation:'Service Worker нужен для офлайна, а в части браузеров и для установки.', difficulty:2 },
  { id:'t5-11', type:'single', prompt:'Куда указывает e.target снаружи компонента, если клик был по кнопке внутри его shadow root?', options:['На сам компонент — событие ретаргетится','На внутреннюю кнопку','На document','Событие не выходит наружу'], answer:0, explanation:'Ретаргетинг сохраняет инкапсуляцию.', difficulty:2 },
  { id:'t5-12', type:'single', prompt:'Что делает <slot> в Shadow DOM?', options:['Показывает дочерние элементы компонента из light DOM в нужном месте','Создаёт копию элемента','Загружает внешний шаблон','Изолирует стили'], answer:0, explanation:'Узлы остаются в light DOM, но отображаются внутри.', difficulty:1 }
 ]
};

export const glossary = [
 ['Origin', 'Схема, хост и порт: граница доступа к данным в браузере.', '5-1'],
 ['localStorage', 'Синхронное бессрочное хранилище строк для origin.', '5-1'],
 ['IndexedDB', 'Асинхронная транзакционная база объектов в браузере.', '5-1'],
 ['Квота хранилища', 'Лимит места для всех хранилищ origin, при нехватке данные могут вытесняться.', '5-1'],
 ['ITP', 'Intelligent Tracking Prevention: механизм Safari, ограничивающий хранилища и cookie.', '5-1'],
 ['Fetch API', 'Стандартный API запросов из объектов Request, Response, Headers и потоков.', '5-2'],
 ['ReadableStream', 'Поток данных, читаемый кусками по мере поступления.', '5-2'],
 ['Backpressure', 'Механизм замедления производителя данных под скорость потребителя.', '5-2'],
 ['SSE', 'Server-Sent Events: однонаправленный поток событий от сервера по HTTP.', '5-2'],
 ['WebSocket', 'Полнодуплексный канал сообщений поверх одного TCP-соединения.', '5-2'],
 ['Web Worker', 'Скрипт в отдельном потоке со своим event loop и без доступа к DOM.', '5-3'],
 ['Structured clone', 'Алгоритм глубокого копирования данных между потоками и в хранилища.', '5-3'],
 ['Transferable', 'Объект, владение которым передаётся между потоками без копирования.', '5-3'],
 ['SharedArrayBuffer', 'Буфер общей памяти между потоками, требующий cross-origin isolation.', '5-3'],
 ['Service Worker', 'Скрипт-прокси между страницами origin и сетью.', '5-4'],
 ['Stale-while-revalidate', 'Стратегия: сразу отдать кеш и параллельно обновить его.', '5-4'],
 ['PWA', 'Progressive Web App: сайт с манифестом, который можно установить как приложение.', '5-4'],
 ['Web App Manifest', 'JSON-файл с именем, иконками и параметрами запуска PWA.', '5-4'],
 ['Custom Elements', 'API регистрации собственных HTML-тегов с жизненным циклом.', '5-5'],
 ['Shadow DOM', 'Изолированное скрытое поддерево элемента со своими стилями.', '5-5'],
 ['::part()', 'Псевдоэлемент для стилизации помеченных частей shadow-дерева снаружи.', '5-5'],
 ['<template>', 'Инертный фрагмент разметки для клонирования.', '5-5'],
 ['<slot>', 'Место проекции дочерних элементов в shadow-дереве.', '5-5'],
 ['Declarative Shadow DOM', 'Создание shadow root прямо в HTML через template с shadowrootmode.', '5-5']
];
