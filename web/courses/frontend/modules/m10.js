// Модуль 10. Безопасность фронтенда
export default {
 id: 10, title: 'Безопасность фронтенда', short: 'Same-origin, CORS, XSS, CSP, аутентификация',
 lessons: [
 { id: '10-1', title: 'Same-origin policy и CORS', topics: ['web-security','cors'], html: `
<p>Браузер одновременно выполняет код с десятков сайтов и хранит ваши сессии во всех них. Чтобы <code>evil.example</code> не мог прочитать вашу почту, открытую в соседней вкладке, действует <b>same-origin policy</b> (SOP): скрипт одного origin не может читать данные другого.</p>
<h3>Что SOP запрещает, а что нет</h3>
<ul>
<li><b>Запрещено:</b> читать ответ <code>fetch</code> к чужому origin, DOM чужого iframe, хранилища и cookie другого origin.</li>
<li><b>Разрешено:</b> <i>отправлять</i> запросы куда угодно (формы, картинки, <code>fetch</code>), встраивать чужие скрипты, стили, картинки, iframe. Исторически веб на этом построен.</li>
</ul>
<p>Отсюда важнейший вывод: SOP защищает <b>чтение ответа</b>, а не отправку запроса. Чужой сайт может отправить POST на ваш API, и сервер его выполнит. Защита от этого — отдельная задача (CSRF, урок 10.3).</p>
<h3>CORS — контролируемое ослабление SOP</h3>
<p>Ваш фронтенд на <code>https://shop.example</code> и API на <code>https://api.example</code> — разные origin. Чтобы браузер отдал ответ API вашему JS, сервер должен явно разрешить это заголовками <b>CORS</b>.</p>
<ol class="steps">
<li>Браузер добавляет к запросу <code>Origin: https://shop.example</code>.</li>
<li>Для <b>простых</b> запросов (GET, HEAD, POST с content-type форм или text/plain и без нестандартных заголовков) запрос уходит сразу.</li>
<li>Для остальных (JSON, PUT/DELETE, заголовок <code>Authorization</code>) сначала идёт <b>preflight</b> — запрос <code>OPTIONS</code> с описанием будущего запроса. Только если сервер его разрешил, отправляется настоящий.</li>
<li>Браузер проверяет <code>Access-Control-Allow-Origin</code> в ответе. Не совпадает — ответ скрывается от JS, в консоли ошибка CORS.</li>
</ol>
<p>Попробуйте разные сочетания:</p>
<div data-widget="cors"></div>
<h3>Частые недоразумения</h3>
<ul>
<li><b>CORS не защищает сервер.</b> Это механизм браузера. curl, Postman и чужой бэкенд заголовки CORS игнорируют. Авторизацию и проверку прав делает сервер.</li>
<li><b>Ошибка CORS при статусе 200.</b> Запрос дошёл и выполнился, просто браузер не отдал ответ. Для простых запросов побочные эффекты уже случились.</li>
<li><b>С cookie нельзя <code>*</code>.</b> При <code>credentials: 'include'</code> сервер обязан вернуть точный origin и <code>Access-Control-Allow-Credentials: true</code>.</li>
<li><b>Отражать любой Origin обратно</b> вместе с credentials — значит разрешить чтение личных данных любому сайту. Используйте белый список.</li>
</ul>
<div class="note why"><b>Проще всего — без CORS.</b> Если фронтенд и API на одном origin (как <code>/api</code> за nginx на этом сайте), CORS не нужен вовсе: ни preflight, ни настройки, ни рисков ошибиться в белом списке.</div>`,
 check: [
  { id:'q10-1a', type:'single', prompt:'Что защищает same-origin policy?', options:['Чтение ответов и данных чужого origin из скриптов','Отправку любых запросов на чужие сайты','Сервер от атак','Загрузку чужих картинок'], answer:0, explanation:'Отправлять запросы можно, читать ответы — нет.', difficulty:1 },
  { id:'q10-1b', type:'single', prompt:'fetch с Content-Type: application/json на другой origin. Что сделает браузер перед запросом?', options:['Отправит preflight OPTIONS','Ничего, запрос простой','Спросит разрешения пользователя','Переключится на HTTP/1.1'], answer:0, explanation:'JSON не входит в список «простых» content-type.', difficulty:2 }
 ]},
 { id: '10-2', title: 'XSS, CSP и OWASP для фронтенда', topics: ['csp','owasp-risks'], html: `
<p><b>XSS</b> (cross-site scripting) — внедрение чужого скрипта в вашу страницу. Скрипт выполняется в вашем origin со всеми правами: читает данные страницы, делает запросы от имени пользователя, подменяет интерфейс, крадёт токены из localStorage. Same-origin policy здесь бессильна — атакующий уже внутри.</p>
<h3>Три вида</h3>
<ul>
<li><b>Хранимая</b> — вредоносный текст сохранён в базе (комментарий, имя) и показывается другим пользователям.</li>
<li><b>Отражённая</b> — приходит в параметре URL и сразу выводится в ответе сервера.</li>
<li><b>DOM-based</b> — целиком на клиенте: JS берёт данные из <code>location.hash</code>, <code>postMessage</code> или localStorage и вставляет как HTML.</li>
</ul>
<h3>Корень проблемы — контекст</h3>
<p>Данные становятся кодом, когда попадают в контекст, где их интерпретируют как разметку или скрипт. Опасные «синки»: <code>innerHTML</code>, <code>outerHTML</code>, <code>insertAdjacentHTML</code>, <code>document.write</code>, <code>eval</code>, <code>new Function</code>, <code>setTimeout('строка')</code>, атрибуты <code>href</code> и <code>src</code> со схемой <code>javascript:</code>, обработчики <code>on*</code>.</p>
<p>Фреймворки защищают по умолчанию: JSX, шаблоны Vue, Svelte и Angular <b>экранируют</b> текст. Защита пропадает в люках: <code>dangerouslySetInnerHTML</code>, <code>v-html</code>, <code>{@html}</code>, <code>bypassSecurityTrust…</code>, а также <code>href={userUrl}</code> без проверки схемы. Если HTML от пользователя действительно нужен (редактор статей), его пропускают через санитайзер (DOMPurify, Sanitizer API), который удаляет всё, кроме разрешённого.</p>
<h3>CSP — вторая линия обороны</h3>
<p><b>Content Security Policy</b> — заголовок, которым сервер сообщает браузеру, откуда разрешено загружать и выполнять ресурсы. Даже если XSS-уязвимость есть, CSP не даст выполниться внедрённому скрипту.</p>
<pre><code>Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-r4nd0m';
  object-src 'none'; base-uri 'self'; frame-ancestors 'none'</code></pre>
<ul>
<li>Без <code>'unsafe-inline'</code> в <code>script-src</code> не работают inline-скрипты и атрибуты <code>onclick</code> — основной вектор XSS.</li>
<li><b>nonce</b> — случайное значение на каждый ответ: выполняются только <code>&lt;script nonce="…"&gt;</code> с ним. <code>'strict-dynamic'</code> доверяет скриптам, загруженным доверенными.</li>
<li><code>frame-ancestors 'none'</code> запрещает встраивать сайт в iframe — защита от кликджекинга.</li>
<li><code>Content-Security-Policy-Report-Only</code> — режим наблюдения: нарушения отправляются в отчёт, но не блокируются. Так CSP внедряют на существующий сайт.</li>
</ul>
<p><b>Trusted Types</b> (<code>require-trusted-types-for 'script'</code>) запрещают передавать строки в опасные синки: <code>innerHTML</code> принимает только объект, созданный политикой-санитайзером. Это переводит XSS из «где-то в коде» в несколько проверяемых мест.</p>
<h3>Другие риски OWASP на стороне клиента</h3>
<ul>
<li><b>Уязвимые и вредоносные зависимости</b> — npm-пакеты, сторонние скрипты аналитики и виджетов. Для скриптов с CDN — Subresource Integrity (<code>integrity="sha384-…"</code>).</li>
<li><b>Секреты в бандле</b> — всё, что попало в JS, публично.</li>
<li><b>Проверки только на клиенте</b> — скрытая кнопка не запрещает действие на сервере.</li>
<li><b>Открытые редиректы</b> — <code>?next=https://evil.example</code> после логина.</li>
</ul>`,
 check: [
  { id:'q10-2a', type:'single', prompt:'Почему <a href={user.website}> в React может быть опасен?', options:['Значение javascript:alert(1) выполнится при клике: React экранирует текст, но не проверяет схему URL','React не экранирует атрибуты','href всегда опасен','Ссылки не работают в JSX'], answer:0, explanation:'Проверяйте, что URL начинается с http: или https:.', difficulty:2 },
  { id:'q10-2b', type:'single', prompt:'Зачем CSP, если код уже экранирует вывод?', options:['Это вторая линия обороны: даже при пропущенной уязвимости внедрённый скрипт не выполнится','CSP ускоряет загрузку','CSP заменяет экранирование','CSP шифрует страницу'], answer:0, explanation:'Глубокая защита: одна ошибка не должна приводить к компрометации.', difficulty:1 }
 ]},
 { id: '10-3', title: 'Аутентификация в браузере', topics: ['auth-strategies'], html: `
<p>После входа браузер должен как-то доказывать серверу, кто вы, в каждом запросе. Два основных способа — cookie сессии и токен в заголовке — по-разному распределяют риски.</p>
<h3>Cookie-сессия</h3>
<p>Сервер создаёт сессию и ставит cookie: <code>Set-Cookie: sid=…; HttpOnly; Secure; SameSite=Lax; Path=/</code>. Браузер сам прикладывает её к запросам на этот сайт.</p>
<ul>
<li><code>HttpOnly</code> — JS не может прочитать cookie. XSS не украдёт её (но сможет делать запросы, пока пользователь на странице).</li>
<li><code>Secure</code> — только по HTTPS. Префикс <code>__Host-</code> дополнительно запрещает <code>Domain</code> и требует <code>Path=/</code> — cookie не подменит поддомен.</li>
<li><code>SameSite</code> решает, прикладывать ли cookie к запросам, инициированным <b>другим сайтом</b>: <code>Strict</code> — никогда, <code>Lax</code> (по умолчанию в браузерах) — только при обычной навигации верхнего уровня (переход по ссылке), <code>None</code> — всегда (требует Secure).</li>
</ul>
<h3>CSRF</h3>
<p>Поскольку браузер прикладывает cookie автоматически, чужой сайт может отправить форму на <code>bank.example/transfer</code>, и запрос уйдёт с вашей сессией — это <b>CSRF</b>. <code>SameSite=Lax</code> блокирует большинство сценариев (кроме GET с побочными эффектами — их не должно быть). Дополнительно сервер проверяет заголовок <code>Origin</code> или <code>Sec-Fetch-Site</code>, либо CSRF-токен в форме. Этот сайт делает именно так: cookie <code>__Host-sid</code> с <code>SameSite=Lax</code> плюс проверка Origin на сервере.</p>
<h3>Токены</h3>
<p>Сервер выдаёт токен (часто JWT — подписанный JSON с идентификатором пользователя и сроком), клиент хранит его и отправляет в <code>Authorization: Bearer …</code>. CSRF не страшен — браузер сам токен не приложит. Но где хранить?</p>
<ul>
<li><b>localStorage</b> — доступен любому JS на странице, то есть любой XSS украдёт долгоживущий токен и унесёт его на свой сервер.</li>
<li><b>Память</b> — пропадает при перезагрузке, нужен механизм обновления.</li>
</ul>
<p>Распространённый компромисс — короткоживущий access token в памяти и долгоживущий refresh token в HttpOnly-cookie. Или паттерн <b>BFF</b> (Backend for Frontend): токены вообще не попадают в браузер, их держит свой сервер, а браузер общается с ним через cookie-сессию.</p>
<h3>OAuth 2 и OpenID Connect</h3>
<p>«Войти через Google» — это <b>OIDC</b> поверх OAuth 2. Для браузерных приложений используется <b>Authorization Code с PKCE</b>:</p>
<ol class="steps">
<li>Клиент генерирует случайный <code>code_verifier</code> и отправляет его хеш (<code>code_challenge</code>) вместе с перенаправлением на провайдера.</li>
<li>Пользователь входит у провайдера и возвращается с одноразовым <code>code</code>.</li>
<li>Клиент обменивает <code>code</code> на токены, предъявляя исходный <code>code_verifier</code>.</li>
</ol>
<p>Перехвативший <code>code</code> не сможет его обменять — у него нет verifier. Старый Implicit flow, возвращавший токен прямо в URL, больше не рекомендуется. Параметр <code>state</code> защищает от подделки ответа.</p>
<div class="note why"><b>Новое.</b> Passkeys (WebAuthn) заменяют пароль парой ключей в устройстве пользователя: приватный ключ не покидает устройство, а подпись привязана к домену, поэтому фишинговый сайт не получит ничего полезного.</div>`,
 check: [
  { id:'q10-3a', type:'single', prompt:'Почему хранить долгоживущий токен в localStorage рискованно?', options:['Любой XSS на странице прочитает его и унесёт на свой сервер','localStorage очищается каждый час','Токен уходит с каждым запросом','localStorage не поддерживает строки'], answer:0, explanation:'HttpOnly-cookie недоступна из JS.', difficulty:1 },
  { id:'q10-3b', type:'single', prompt:'От чего защищает PKCE?', options:['От использования перехваченного authorization code: без code_verifier его не обменять на токены','От XSS','От DDoS','От подбора пароля'], answer:0, explanation:'Verifier знает только клиент, начавший вход.', difficulty:2 }
 ]}
 ],
 test: [
  { id:'t10-1', type:'single', prompt:'Сайт evil.example отправил fetch POST на ваш API без CORS-заголовков в ответе. Что произошло на сервере?', options:['Запрос мог дойти и выполниться; браузер лишь не отдал ответ скрипту evil.example','Запрос заблокирован браузером до отправки','Сервер получил запрос без тела','Запрос отправлен на evil.example'], answer:0, explanation:'Простые запросы отправляются без preflight.', difficulty:2 },
  { id:'t10-2', type:'multiple', prompt:'Что сделает запрос «непростым» и вызовет preflight? (несколько ответов)', options:['Метод PUT','Content-Type: application/json','Заголовок Authorization','Метод GET без заголовков'], answer:[0,1,2], explanation:'GET без нестандартных заголовков — простой запрос.', difficulty:1 },
  { id:'t10-3', type:'single', prompt:'Почему сервер не может ответить Access-Control-Allow-Origin: * на запрос с credentials: "include"?', options:['Спецификация запрещает: для запросов с cookie нужен точный origin','* работает только для GET','* устарел','Браузер не отправляет Origin'], answer:0, explanation:'Иначе любой сайт читал бы ответы с вашими cookie.', difficulty:2 },
  { id:'t10-4', type:'single', prompt:'Защищает ли CORS API от запросов из curl?', options:['Нет: CORS — механизм браузера, curl его игнорирует','Да, сервер отклонит запрос','Только для POST','Только при HTTPS'], answer:0, explanation:'Защита сервера — авторизация и проверка прав.', difficulty:1 },
  { id:'t10-5', type:'match', prompt:'Сопоставьте вид XSS и источник данных.', pairs:[['Хранимая','Комментарий из базы данных'],['Отражённая','Параметр URL в ответе сервера'],['DOM-based','location.hash, вставленный через innerHTML']], explanation:'DOM-based XSS не доходит до сервера.', difficulty:2 },
  { id:'t10-6', type:'multiple', prompt:'Какие места в коде — опасные синки для XSS? (несколько ответов)', options:['el.innerHTML = data','dangerouslySetInnerHTML','eval(data)','el.textContent = data'], answer:[0,1,2], explanation:'textContent вставляет текст, не разметку.', difficulty:1 },
  { id:'t10-7', type:'single', prompt:'Что делает CSP script-src без "unsafe-inline"?', options:['Запрещает inline-скрипты и атрибуты-обработчики вроде onclick','Запрещает все скрипты','Запрещает внешние скрипты','Включает HTTPS'], answer:0, explanation:'Это блокирует основной вектор XSS.', difficulty:2 },
  { id:'t10-8', type:'single', prompt:'Зачем режим Content-Security-Policy-Report-Only?', options:['Наблюдать нарушения без блокировки при внедрении политики на существующий сайт','Отключить CSP','Ускорить загрузку','Проверить сертификат'], answer:0, explanation:'Сначала собирают отчёты, потом включают блокировку.', difficulty:1 },
  { id:'t10-9', type:'single', prompt:'Что защищает от подмены скрипта на стороннем CDN?', options:['Subresource Integrity: атрибут integrity с хешем файла','Атрибут async','HttpOnly','SameSite'], answer:0, explanation:'Браузер не выполнит файл с другим хешем.', difficulty:2 },
  { id:'t10-10', type:'single', prompt:'Какой cookie-атрибут делает cookie недоступной из JavaScript?', options:['HttpOnly','Secure','SameSite','Path'], answer:0, explanation:'Защищает от кражи cookie через XSS.', difficulty:1 },
  { id:'t10-11', type:'single', prompt:'Как SameSite=Lax защищает от CSRF?', options:['Не прикладывает cookie к запросам с чужих сайтов, кроме навигации верхнего уровня','Шифрует cookie','Проверяет пароль','Запрещает POST'], answer:0, explanation:'Поэтому GET не должен менять данные.', difficulty:2 },
  { id:'t10-12', type:'order', prompt:'Расположите шаги OAuth 2 Authorization Code с PKCE.', options:['Сгенерировать code_verifier и code_challenge','Перенаправить на провайдера с code_challenge','Получить code при возврате','Обменять code на токены вместе с code_verifier'], answer:[0,1,2,3], explanation:'Verifier предъявляется только на последнем шаге.', difficulty:2 }
 ]
};

export const glossary = [
 ['Same-origin policy', 'Запрет скриптам одного origin читать данные другого.', '10-1'],
 ['CORS', 'Механизм, которым сервер разрешает браузеру отдать ответ скрипту другого origin.', '10-1'],
 ['Preflight', 'Предварительный OPTIONS-запрос CORS для непростых запросов.', '10-1'],
 ['Простой запрос', 'Запрос CORS без preflight: GET, HEAD или POST с безопасными заголовками.', '10-1'],
 ['Access-Control-Allow-Origin', 'Заголовок ответа с origin, которому разрешено читать ответ.', '10-1'],
 ['XSS', 'Внедрение чужого скрипта в страницу сайта.', '10-2'],
 ['Синк', 'API, интерпретирующий данные как разметку или код: innerHTML, eval и др.', '10-2'],
 ['Санитайзер', 'Инструмент очистки HTML от опасных элементов и атрибутов.', '10-2'],
 ['CSP', 'Content Security Policy: заголовок с разрешёнными источниками ресурсов и скриптов.', '10-2'],
 ['Nonce', 'Случайное значение на ответ, разрешающее выполнение конкретных скриптов по CSP.', '10-2'],
 ['Trusted Types', 'API, запрещающий передачу строк в опасные синки без политики.', '10-2'],
 ['Subresource Integrity', 'Проверка хеша загружаемого скрипта или стиля.', '10-2'],
 ['Кликджекинг', 'Атака через встраивание сайта в невидимый iframe поверх чужого интерфейса.', '10-2'],
 ['HttpOnly', 'Атрибут cookie, запрещающий доступ к ней из JavaScript.', '10-3'],
 ['SameSite', 'Атрибут cookie, управляющий её отправкой в межсайтовых запросах.', '10-3'],
 ['CSRF', 'Подделка межсайтового запроса с автоматически приложенной сессией пользователя.', '10-3'],
 ['JWT', 'Подписанный токен в формате JSON с утверждениями о пользователе.', '10-3'],
 ['BFF', 'Backend for Frontend: свой сервер, хранящий токены вместо браузера.', '10-3'],
 ['OAuth 2', 'Протокол делегирования доступа к ресурсам.', '10-3'],
 ['OpenID Connect', 'Слой аутентификации поверх OAuth 2.', '10-3'],
 ['PKCE', 'Proof Key for Code Exchange: защита authorization code от перехвата.', '10-3'],
 ['Passkey', 'Вход по паре ключей WebAuthn, привязанной к домену, вместо пароля.', '10-3']
];
