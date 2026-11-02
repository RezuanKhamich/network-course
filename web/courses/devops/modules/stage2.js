// Этап 2: Production Engineering (дни 31–60).
import { S, M, P, I, A, lab, en } from './h.js';

export const STAGE2 = [
{
 id: 5, title: 'HTTP и Nginx', short: 'Неделя 5: запросы и коды, reverse proxy, TLS, логи, ошибки 502/503/504',
 lessons: [
 { id:'5-1', title:'Как устроен HTTP', html:`
<p>HTTP — текстовый протокол «запрос-ответ» поверх TCP (или QUIC в HTTP/3). Запрос и ответ состоят из стартовой строки, заголовков и необязательного тела.</p>
<pre><code>GET /api/orders?page=2 HTTP/1.1     ← метод, путь, версия
Host: shop.lab                      ← обязательно: какой сайт
Authorization: Bearer eyJ...
Accept: application/json

HTTP/1.1 200 OK                     ← код ответа
Content-Type: application/json
Content-Length: 512

{"orders":[...]}</code></pre>
<h3>Методы</h3>
<div class="tbl"><table><tr><th>Метод</th><th>Назначение</th><th>Безопасно повторить?</th></tr>
<tr><td>GET</td><td>Получить</td><td>Да</td></tr><tr><td>POST</td><td>Создать, выполнить действие</td><td>Нет: возможен второй заказ</td></tr>
<tr><td>PUT</td><td>Заменить</td><td>Да</td></tr><tr><td>PATCH</td><td>Частично изменить</td><td>Не всегда</td></tr><tr><td>DELETE</td><td>Удалить</td><td>Да</td></tr></table></div>
<p>Свойство «можно повторить без вреда» называется <b>идемпотентностью</b>. Оно определяет, можно ли автоматически повторять запрос при сбое: прокси и клиенты не должны повторять POST.</p>
<h3>Коды состояния</h3>
<div class="tbl"><table><tr><th>Класс</th><th>Смысл</th><th>Примеры</th></tr>
<tr><td>2xx</td><td>Успех</td><td>200 OK, 201 Created, 204 No Content</td></tr>
<tr><td>3xx</td><td>Перенаправление</td><td>301 постоянно, 302 временно, 304 не изменилось</td></tr>
<tr><td>4xx</td><td><b>Ошибка клиента</b></td><td>400, 401 нет входа, 403 запрещено, 404, 405, 413 тело велико, 429 слишком часто</td></tr>
<tr><td>5xx</td><td><b>Ошибка сервера</b></td><td>500 ошибка приложения, 502, 503, 504</td></tr></table></div>
<div class="note why"><b>Первый шаг диагностики.</b> Рост 4xx обычно проблема клиента или новой версии фронтенда. Рост 5xx — ваша проблема, и за неё должен срабатывать алерт.</div>
<pre><code>curl -I URL                 # только заголовки
curl -v URL                 # весь диалог
curl -X POST -d '{"a":1}' -H 'Content-Type: application/json' URL
curl -s -o /dev/null -w '%{http_code} %{time_total}\\n' URL   # код и время</code></pre>
${lab('lab_http')}`,
  check:[
   S('q5-1a','Что означает 401 в отличие от 403?',['401 — не аутентифицирован, 403 — известен, но доступ запрещён','Это одно и то же','401 — ошибка сервера','403 — редирект'],'401: кто вы? 403: вам нельзя.'),
   S('q5-1b','Почему прокси не должен сам повторять POST при сбое?',['Метод не идемпотентен, можно создать заказ дважды','POST нельзя отправить дважды технически','POST не содержит заголовков','POST быстрее GET'],'Повтор допустим для идемпотентных методов или при ключах идемпотентности.')
  ]},
 { id:'5-2', title:'Reverse proxy и конфигурация Nginx', html:`
<p><b>Reverse proxy</b> стоит перед приложением и принимает запросы от клиентов. Зачем он нужен:</p>
<ul>
<li>Завершает TLS, чтобы приложению не заниматься сертификатами.</li>
<li>Раздаёт статику быстрее приложения.</li>
<li>Распределяет нагрузку между копиями приложения.</li>
<li>Защищает: лимиты, таймауты, буферизация медленных клиентов.</li>
<li>Единая точка логов и маршрутизации по домену и пути.</li>
</ul>
<pre><code>Клиент ──HTTPS──▶ Nginx :443 ──HTTP──▶ Java :8080 ──▶ PostgreSQL
                     └── статика из /var/www</code></pre>
<h3>Структура конфигурации</h3>
<pre><code>upstream backend {                     # группа серверов приложения
    server 127.0.0.1:8080;
    keepalive 32;
}
server {                               # виртуальный хост
    listen 443 ssl;
    server_name shop.lab;              # по этому имени выбирается server
    ssl_certificate     /etc/letsencrypt/live/shop.lab/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/shop.lab/privkey.pem;
    client_max_body_size 10m;          # иначе 413 при загрузке файлов

    location /api/ {                   # по префиксу пути
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 3s;
        proxy_read_timeout 60s;
    }
    location / {
        root /var/www/shop;
        try_files $uri /index.html;
    }
}
server {                               # редирект с HTTP
    listen 80;
    server_name shop.lab;
    return 301 https://$host$request_uri;
}</code></pre>
<div class="note why"><b>Зачем X-Forwarded-*.</b> Приложение видит соединение от nginx (127.0.0.1). Настоящий адрес и схема передаются заголовками. Без них в логах будет один IP, а приложение может строить ссылки с http вместо https.</div>
<div class="note warn"><b>Ловушка: слеш в proxy_pass.</b> <code>proxy_pass http://backend;</code> передаёт путь как есть (<code>/api/orders</code>). А <code>proxy_pass http://backend/;</code> заменяет совпавшую часть <code>/api/</code> и приложение получит <code>/orders</code>. Причина многих внезапных 404.</div>
<p>Конфиг лежит в <code>/etc/nginx/nginx.conf</code> и подключаемых файлах. Посмотреть итоговый: <code>nginx -T</code>. Порядок применения всегда такой: <code>nginx -t</code>, затем <code>systemctl reload nginx</code>. При reload старые worker-процессы дорабатывают свои запросы, новые берут уже новую конфигурацию.</p>
<p>Сертификаты обычно выпускает <code>certbot</code> (Let's Encrypt, срок 90 дней). Обновление должно быть автоматическим; проверка: <code>certbot renew --dry-run</code>.</p>`,
  check:[
   M('q5-2a','Зачем нужен reverse proxy? (несколько ответов)',['Завершение TLS','Балансировка','Раздача статики','Выполнение SQL-запросов'],[0,1,2],'SQL выполняет база.'),
   S('q5-2b','Какая команда обязательна перед reload?',['nginx -t','nginx -s stop','curl -I','systemctl enable nginx'],'Она проверяет конфигурацию на ошибки.')
  ]},
 { id:'5-3', title:'Логи Nginx и ошибки 502, 503, 504', html:`
<p>У nginx два журнала. <b>access.log</b> — каждый запрос: кто, что, код, размер, время. <b>error.log</b> — проблемы и их причины.</p>
<pre><code>log_format timed '$remote_addr - $remote_user [$time_local] "$request" '
                 '$status $body_bytes_sent "$http_referer" "$http_user_agent" '
                 'rt=$request_time urt=$upstream_response_time';
</code></pre>
<p>Добавьте время: <code>request_time</code> — всего, <code>upstream_response_time</code> — ответ приложения. Если первое велико, а второе мало, медленный клиент или сеть; если оба велики, медленное приложение.</p>
<h3>Три похожих кода — три разные причины</h3>
<div class="tbl"><table><tr><th>Код</th><th>Значение</th><th>Частые причины</th><th>Что проверить</th></tr>
<tr><td><b>502</b> Bad Gateway</td><td>Backend не дал корректного ответа</td><td>Приложение упало или не запущено, неверный порт, оборвало соединение</td><td><code>error.log</code>: «Connection refused», <code>ss -tlnp</code>, статус службы</td></tr>
<tr><td><b>503</b> Service Unavailable</td><td>Сервис сознательно отказывает</td><td>Лимит <code>limit_req</code>, нет живых upstream, режим обслуживания, приложение перегружено</td><td><code>error.log</code>, health-check</td></tr>
<tr><td><b>504</b> Gateway Timeout</td><td>Backend не ответил вовремя</td><td>Медленный запрос к базе, блокировки, зависание, внешний API, исчерпан пул</td><td><code>upstream timed out</code>, дамп потоков, база</td></tr></table></div>
<p>Запомните просто: <b>502 — приложение недоступно или сломало ответ, 504 — приложение слишком долго думает</b>. Не решайте 504 простым увеличением <code>proxy_read_timeout</code>: так вы спрячете симптом, а потоки и соединения по-прежнему будут заняты.</p>
<h3>Шаблоны анализа</h3>
<pre><code># Распределение кодов
awk '{print $9}' access.log | sort | uniq -c | sort -rn
# Топ URL с ошибкой 502
awk '$9==502 {print $7}' access.log | sort | uniq -c | sort -rn | head
# Топ IP
awk '{print $1}' access.log | sort | uniq -c | sort -rn | head
# Последние ошибки в реальном времени
tail -f error.log</code></pre>
${lab('lab_nginx')}
${en('If the upstream server does not respond within the timeout, nginx returns a 504 error. A 502 indicates that an invalid response was received from the upstream.','<code>upstream</code> — вышестоящий сервер (ваше приложение за nginx), <code>within</code> — в пределах, <code>invalid</code> — некорректный.','504 — приложение не успело ответить. 502 — получен некорректный ответ или его нет вовсе.')}`,
  check:[
   A('q5-3a','Что случилось?','connect() failed (111: Connection refused) while connecting to upstream',['Приложение не слушает указанный порт: клиент получит 502','Запрос к базе слишком долгий: 504','Истёк сертификат','Клиент не авторизован'],'Nginx не смог подключиться к backend.'),
   S('q5-3b','Клиенты получают 504 на отчётах. Лучший первый шаг?',['Узнать, чем занято приложение: логи, потоки, база','Увеличить таймаут до часа','Перезапустить nginx','Удалить access.log'],'Сначала поймите причину, увеличение таймаута лишь скроет её.')
  ]}
 ],
 test:[
  P('t5-1','Сопоставьте код и смысл.',[['301','Постоянный редирект'],['404','Не найдено'],['429','Слишком много запросов'],['504','Таймаут ответа backend']],'Классы кодов сразу указывают сторону проблемы.'),
  S('t5-2','Для чего нужен заголовок Host?',['Выбрать сайт на одном IP','Передать IP клиента','Сжать ответ','Авторизоваться'],'По нему nginx выбирает server_name.'),
  A('t5-3','Что покажет эта команда?',"awk '{print $9}' access.log | sort | uniq -c | sort -rn",['Сколько ответов с каждым кодом','Топ IP','Размер лога','Список URL'],'В стандартном формате девятое поле — код.'),
  S('t5-4','Загрузка файла 20 МБ получает 413. Что поправить?',['client_max_body_size','proxy_read_timeout','worker_processes','ssl_certificate'],'Лимит размера тела по умолчанию всего 1 МБ.'),
  S('t5-5','Чем reload отличается от restart?',['reload не разрывает соединения','Ничем','reload останавливает сервер','restart проверяет синтаксис'],'Старые worker-процессы дорабатывают свои запросы.'),
  S('t5-6','Приложение строит ссылки http:// за HTTPS-прокси. Что забыли?',['Заголовок X-Forwarded-Proto','client_max_body_size','Запись MX','Правило firewall'],'Приложение не видит исходную схему.'),
  S('t5-7','request_time большой, upstream_response_time маленький. Где искать?',['Медленный клиент или сеть','Медленная база','Сбой приложения','Истёк сертификат'],'Приложение ответило быстро, задержка до клиента.',3),
  S('t5-8','После смены proxy_pass на http://backend/; появились 404. Почему?',['Слеш заменил префикс location и изменил путь','Сломался TLS','Закончилась память','Перестал работать DNS'],'Приложение получает другой путь.',3)
 ]
},
{
 id: 6, title: 'Java и JVM', short: 'Неделя 6: heap, GC, потоки, пулы, OutOfMemoryError, дампы',
 lessons: [
 { id:'6-1', title:'Память JVM и сборка мусора', html:`
<p>Backend на Java и Kotlin работает внутри <b>JVM</b> — виртуальной машины, которая выполняет байт-код и управляет памятью. Kotlin компилируется в тот же байт-код, поэтому вся диагностика одинакова.</p>
<pre><code>Память процесса java
├── Heap (-Xmx)         объекты; здесь работает GC
│   ├── Young: Eden, Survivor    новые объекты
│   └── Old                      пережившие несколько сборок
├── Metaspace           описания классов
├── Стеки потоков       ~1 МБ на поток (-Xss)
├── Code cache          скомпилированный код
└── Direct buffers      память вне heap (сеть, Netty)</code></pre>
<ul>
<li><b>Heap</b> — общая память объектов. <b>Stack</b> — у каждого потока свой, хранит вызовы методов и локальные переменные.</li>
<li><b>GC</b> находит объекты, на которые больше нет ссылок, и освобождает память. Большинство объектов умирает молодыми, поэтому молодое поколение собирается часто и быстро (Minor GC).</li>
<li>Сборка может вызывать <b>паузы</b> (stop-the-world), когда приложение останавливается. G1 (по умолчанию на серверах) старается держать паузы короткими; ZGC даёт очень короткие паузы.</li>
</ul>
<h3>Как выглядят проблемы с памятью</h3>
<div class="tbl"><table><tr><th>Картина в jstat</th><th>Вывод</th></tr>
<tr><td>Old растёт и падает после сборок, FGC редко</td><td>Норма: «пила»</td></tr>
<tr><td>Old только растёт, не падает даже после Full GC</td><td>Вероятна утечка памяти</td></tr>
<tr><td>Full GC один за другим, CPU высокий, запросы висят</td><td>Heap почти заполнен: приложение тратит время на GC</td></tr></table></div>
<h3>OutOfMemoryError — читайте сообщение</h3>
<div class="tbl"><table><tr><th>Сообщение</th><th>Причина</th></tr>
<tr><td><code>Java heap space</code></td><td>Не хватает heap: утечка или слишком большие данные (весь результат запроса в память)</td></tr>
<tr><td><code>Metaspace</code></td><td>Много классов, утечка загрузчиков</td></tr>
<tr><td><code>unable to create native thread</code></td><td>Слишком много потоков или лимит ОС</td></tr>
<tr><td><code>GC overhead limit exceeded</code></td><td>Почти всё время уходит на сборку</td></tr></table></div>
<div class="note why"><b>OutOfMemoryError ≠ OOM Killer.</b> Первое — ошибка внутри JVM: есть стек в логе, процесс может продолжить работу. Второе — действие ядра: процесс убит SIGKILL без единой записи в лог приложения, след только в <code>dmesg</code>. Различайте их.</div>
<p>Настройки для production: <code>-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/var/tmp</code> (сохранить снимок памяти при падении) и <code>-Xlog:gc*:file=/var/log/shop/gc.log</code> (журнал GC). В контейнере задавайте <code>-XX:MaxRAMPercentage=75</code> вместо жёсткого -Xmx.</p>`,
  check:[
   S('q6-1a','Процесс внезапно исчез, в логе приложения пусто, код выхода 137. Что это?',['Вероятно, OOM Killer ядра','Java heap space','Ошибка компиляции','Нормальное завершение'],'SIGKILL нельзя перехватить. Проверьте dmesg.'),
   S('q6-1b','Что ограничивает -Xmx?',['Только heap, не всю память процесса','Всю память процесса','Только стек','Размер jar'],'Поэтому RSS может быть заметно больше Xmx.')
  ]},
 { id:'6-2', title:'Потоки, пулы потоков и соединений', html:`
<p>Веб-приложение обслуживает запросы в пуле потоков. У Tomcat (Spring Boot по умолчанию) это 200 потоков <code>http-nio-8080-exec-N</code>. Каждый запрос занимает поток, пока не будет ответа.</p>
<pre><code>Запрос ─▶ поток из пула Tomcat (200) ─▶ соединение из HikariCP (10) ─▶ PostgreSQL</code></pre>
<p><b>Thread pool</b> ограничивает параллелизм: создание потока дорого, бесконечно создавать их нельзя. <b>Connection pool</b> (HikariCP) держит готовые соединения с базой, потому что установка каждого занимает время и ресурсы базы.</p>
<h3>Главный сценарий аварий</h3>
<ol>
<li>Что-то стало медленным: база или внешний API.</li>
<li>Потоки дольше держат соединения.</li>
<li>Соединений в пуле не хватает, запросы встают в очередь.</li>
<li>Заняты все 200 потоков Tomcat, новые запросы ждут.</li>
<li>Снаружи: 504, health-check не отвечает, при этом CPU низкий.</li>
</ol>
<div class="note why"><b>Низкий CPU и зависшее приложение.</b> Классический признак того, что потоки чего-то <i>ждут</i>. Не добавляйте CPU и не увеличивайте пул вслепую: большой пул переносит перегрузку на базу. Нужно понять, чего именно ждут потоки.</div>
<h3>Состояния потоков</h3>
<div class="tbl"><table><tr><th>Состояние</th><th>Что делает поток</th></tr>
<tr><td>RUNNABLE</td><td>Выполняется либо ждёт данные из сети (чтение сокета тоже RUNNABLE)</td></tr>
<tr><td>BLOCKED</td><td>Ждёт монитор (synchronized)</td></tr>
<tr><td>WAITING / TIMED_WAITING</td><td>Ждёт сигнала: очередь, пул, sleep</td></tr></table></div>
<p><b>Deadlock</b> — потоки держат ресурсы и ждут друг друга бесконечно. Дамп потоков прямо сообщает: <code>Found one Java-level deadlock</code>.</p>
<p>Защита: таймауты на все внешние вызовы, никаких внешних API внутри транзакции, предохранители (circuit breaker). Без таймаута одна медленная зависимость останавливает весь сервис.</p>`,
  check:[
   S('q6-2a','Приложение не отвечает, CPU 3%, пул Hikari: active=10, waiting=180. Что это?',['Потоки ждут соединения с базой: ищите причину долгих запросов','Нехватка CPU','Переполнение диска','Ошибка DNS'],'Занятость соединений указывает на зависимость.'),
   S('q6-2b','Зачем нужны таймауты на вызовы внешних сервисов?',['Чтобы медленная зависимость не заняла все потоки','Чтобы ускорить внешний сервис','Чтобы уменьшить размер jar','Чтобы отключить GC'],'Иначе сбой расходится каскадом.')
  ]},
 { id:'6-3', title:'Инструменты диагностики', html:`
<p>Эти инструменты входят в JDK. На сервере с одной лишь JRE их нет, там поможет сигнал: <code>kill -3 PID</code> печатает дамп потоков в stdout приложения. Команды запускают от того же пользователя, что и приложение: <code>sudo -u shop jcmd ...</code>.</p>
<div class="tbl"><table><tr><th>Команда</th><th>Что даёт</th></tr>
<tr><td><code>jps -l</code></td><td>Java-процессы и их PID</td></tr>
<tr><td><code>jcmd PID VM.flags</code></td><td>Настройки JVM</td></tr>
<tr><td><code>jcmd PID VM.command_line</code></td><td>Строка запуска</td></tr>
<tr><td><code>jcmd PID GC.heap_info</code></td><td>Состояние heap</td></tr>
<tr><td><code>jstat -gcutil PID 1000</code></td><td>GC каждую секунду</td></tr>
<tr><td><code>jcmd PID Thread.print</code></td><td>Дамп потоков</td></tr>
<tr><td><code>jcmd PID GC.heap_dump /tmp/h.hprof</code></td><td>Снимок памяти для анализа</td></tr></table></div>
<div class="note warn"><b>Heap dump опасен на production.</b> Приложение останавливается на время снятия (иногда минуты), а файл размером с heap может заполнить диск. Дамп потоков, наоборот, почти безвреден: снимайте смело.</div>
<h3>Как читать jstat -gcutil</h3>
<pre><code>S0    S1    E     O     M     YGC  YGCT  FGC FGCT  GCT
0.00 42.10 61.33 38.92 97.81  812 9.120   0 0.000 9.120</code></pre>
<p><code>E</code> — заполнение Eden, <code>O</code> — Old, в процентах. <code>YGC/FGC</code> — число сборок, <code>GCT</code> — суммарное время. Смотрите на динамику: быстрый рост FGC и GCT — признак беды.</p>
<h3>Как читать дамп потоков</h3>
<pre><code>"http-nio-8080-exec-7" #48 daemon TIMED_WAITING (parking)
    at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:162)
    at shop.orders.OrderRepository.findAll(OrderRepository.kt:31)</code></pre>
<ol>
<li>Снимите <b>2–3 дампа с интервалом 5–10 секунд</b>. Поток, стоящий на одной строке во всех снимках, действительно завис.</li>
<li>Читайте стек снизу вверх: снизу — вход, сверху — текущее действие.</li>
<li>Ищите много одинаковых стеков: это и есть узкое место.</li>
<li>Для высокого CPU: <code>top -H -p PID</code> покажет самый занятый поток; его номер в шестнадцатеричном виде — это <code>nid</code> в дампе.</li>
</ol>
<h3>Spring Boot Actuator</h3>
<p>Если подключён, отдаёт диагностику по HTTP. Никогда не публикуйте эти пути наружу, закрывайте их в nginx.</p>
<pre><code>curl -s localhost:8080/actuator/health
curl -s localhost:8080/actuator/metrics/hikaricp.connections.active
curl -s localhost:8080/actuator/threaddump
curl -s localhost:8080/actuator/prometheus</code></pre>
<h3>Приложение или инфраструктура?</h3>
<div class="tbl"><table><tr><th>Признак</th><th>Скорее всего</th></tr>
<tr><td>Высокий wa, ошибки в dmesg, полный диск</td><td>Инфраструктура</td></tr>
<tr><td>Ресурсы в норме, стек указывает на один метод</td><td>Приложение</td></tr>
<tr><td>Началось сразу после деплоя</td><td>Новая версия</td></tr>
<tr><td>Запросы в базу медленные, база перегружена</td><td>База или запрос (модуль 8)</td></tr></table></div>
${lab('lab_jvm')}
${en('A thread dump is a snapshot of the state of all threads in the JVM. Taking several dumps a few seconds apart helps identify threads that are stuck.','<code>snapshot</code> — снимок, <code>a few seconds apart</code> — с разницей в несколько секунд, <code>stuck</code> — зависший.','Один дамп показывает момент, несколько позволяют увидеть, какие потоки не двигаются.')}`,
  check:[
   S('q6-3a','Почему полезно снять несколько дампов потоков?',['Чтобы отличить зависшие потоки от случайно занятых','Чтобы занять диск','Один дамп запрещён','Чтобы перезапустить JVM'],'Поток на той же строке в каждом снимке действительно стоит.'),
   S('q6-3b','Какая операция наиболее рискованна на production?',['jcmd GC.heap_dump','jps -l','jcmd VM.flags','jstat -gcutil'],'Снятие heap dump приостанавливает приложение и требует много места.')
  ]}
 ],
 test:[
  P('t6-1','Сопоставьте область памяти и содержимое.',[['Heap','Объекты'],['Stack','Вызовы методов потока'],['Metaspace','Описания классов']],'Только heap ограничивается -Xmx.'),
  A('t6-2','Как оценить ситуацию?','  O      FGC   FGCT\n 99.8    412   380.2\n 99.9    419   388.7   (через 10 секунд)',['Heap заполнен, приложение почти постоянно в Full GC','Всё хорошо, GC редкий','Проблема с диском','Сломана сеть'],'За 10 секунд 7 полных сборок и 8,5 секунды пауз.',3),
  I('t6-3','Какая команда показывает Java-процессы?',['jps','jps -l'],'jps входит в JDK.'),
  S('t6-4','Какой сигнал напечатает дамп потоков без остановки JVM?',['kill -3','kill -9','kill -15','kill -1'],'SIGQUIT: JVM выводит дамп в stdout и продолжает работу.'),
  S('t6-5','Сообщение: «HikariPool-1 - Connection is not available, request timed out». Что это значит?',['В пуле не нашлось свободного соединения за отведённое время','База удалена','Закончился heap','Неверный пароль'],'Причина часто в долгих запросах или утечке соединений.'),
  S('t6-6','Что значит «unable to create native thread»?',['Лимит потоков ОС или очень много потоков','Переполнен heap','Сломан GC','Нет Metaspace'],'Смотрите число потоков и лимиты.',3),
  S('t6-7','Что безопаснее сделать при высоком CPU у Java?',['top -H и несколько дампов потоков','Сразу kill -9','Heap dump каждую минуту','Удалить логи'],'Так вы найдёте занятый поток без остановки.'),
  S('t6-8','Почему нельзя открывать /actuator наружу?',['Там раскрываются внутренние данные и возможны опасные действия','Он слишком медленный','Он потребляет много диска','Этого требует TLS'],'Закройте его в nginx или вынесите на отдельный порт.')
 ]
},
{
 id: 7, title: 'Docker', short: 'Неделя 7: образы и слои, контейнеры, тома, сети, Compose, лимиты',
 lessons: [
 { id:'7-1', title:'Контейнеры, образы и слои', html:`
<p>Контейнер — это <b>обычный процесс Linux</b> с двумя ограничениями ядра:</p>
<ul>
<li><b>Namespaces</b> изолируют то, что процесс видит: свои PID, сеть, файловую систему, hostname.</li>
<li><b>Cgroups</b> ограничивают то, что он может потратить: CPU и память.</li>
</ul>
<p>В отличие от виртуальной машины, у контейнера нет своего ядра, поэтому он запускается мгновенно. С сервера его процесс виден в обычном <code>ps aux</code>.</p>
<p><b>Образ</b> (image) — неизменяемый шаблон файловой системы и настроек запуска. <b>Контейнер</b> — запущенный экземпляр образа с тонким записываемым слоем поверх него. Этот слой исчезнет при удалении контейнера.</p>
<h3>Dockerfile и слои</h3>
<p>Каждая инструкция создаёт слой, и слои кэшируются. Изменение слоя пересобирает его и всё, что ниже.</p>
<pre><code># Сборочная стадия: здесь есть компилятор
FROM gradle:8-jdk21 AS build
WORKDIR /src
COPY build.gradle.kts settings.gradle.kts ./   # сначала зависимости
RUN gradle dependencies --no-daemon
COPY src ./src                                 # код меняется чаще
RUN gradle bootJar --no-daemon

# Итоговая стадия: только среда выполнения
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /src/build/libs/*.jar app.jar
USER 1000                                      # не root
ENTRYPOINT ["java","-XX:MaxRAMPercentage=75","-jar","app.jar"]</code></pre>
<p>Такая многоэтапная (multi-stage) сборка оставляет компилятор за пределами итогового образа. Посмотрите, как порядок инструкций влияет на кэш:</p>
<div data-widget="layers"></div>
<div class="note warn"><b>Пишите ENTRYPOINT в форме массива.</b> В форме строки процесс запускается через sh, тот становится PID 1 и не передаёт сигналы приложению. Docker stop будет ждать 10 секунд и убьёт его SIGKILL, вместо корректного завершения.</div>
<pre><code>docker build -t shop-api:1.0 .
docker images
docker history shop-api:1.0     # слои и их размер
docker run -d --name api -p 8080:8080 shop-api:1.0
docker ps -a                    # включая остановленные
docker exec -it api sh          # зайти внутрь</code></pre>
<p>Не используйте тег <code>latest</code> в production: нельзя понять, что именно запущено и на что откатываться. Используйте версию или SHA коммита.</p>`,
  check:[
   S('q7-1a','Что отличает контейнер от виртуальной машины?',['Контейнер использует ядро хоста','У контейнера своё ядро','Контейнер не использует CPU','Контейнер не процесс'],'Изоляция обеспечивается namespaces и cgroups.'),
   S('q7-1b','Почему зависимости копируют раньше исходников?',['Чтобы их слой брался из кэша при изменении кода','Так требует Docker','Чтобы образ стал больше','Иначе нет сети'],'Изменение слоя инвалидирует все слои ниже.')
  ]},
 { id:'7-2', title:'Тома, сети и лимиты', html:`
<h3>Volumes: где жить данным</h3>
<div class="tbl"><table><tr><th>Вид</th><th>Пример</th><th>Для чего</th></tr>
<tr><td>Именованный том</td><td><code>-v dbdata:/var/lib/postgresql/data</code></td><td>Данные баз</td></tr>
<tr><td>Bind mount</td><td><code>-v ./nginx.conf:/etc/nginx/nginx.conf:ro</code></td><td>Конфиги с хоста</td></tr>
<tr><td>Слой контейнера</td><td>Запись без тома</td><td>Исчезнет вместе с контейнером</td></tr></table></div>
<h3>Сети</h3>
<p>Контейнеры в одной пользовательской сети находят друг друга <b>по имени сервиса</b> через встроенный DNS. Внутри контейнера <code>localhost</code> — это сам контейнер, а не хост. Это самая частая ошибка новичков.</p>
<pre><code>-p 8080:8080              # опубликовать на всех интерфейсах хоста
-p 127.0.0.1:8080:8080    # только локально, например за nginx</code></pre>
<div class="note warn"><b>Docker и firewall.</b> Опубликованные через -p порты Docker открывает своими правилами iptables, в обход ufw. Базу наружу не публикуйте вообще, а приложение за nginx привязывайте к 127.0.0.1.</div>
<h3>Логи</h3>
<pre><code>docker logs -f --tail 100 api
docker inspect api --format '{{.State.ExitCode}} {{.State.OOMKilled}}'</code></pre>
<p>Приложение в контейнере должно писать в stdout. По умолчанию логи копятся в JSON-файле на хосте без ограничений и могут заполнить диск. Настройте ротацию в <code>/etc/docker/daemon.json</code>: <code>"log-opts": {"max-size": "50m", "max-file": "3"}</code>.</p>
<h3>Лимиты и политика перезапуска</h3>
<pre><code>docker run --memory=512m --cpus=1.5 ...
docker stats --no-stream</code></pre>
<p>Превышение лимита памяти — OOM-убийство внутри cgroup: код выхода <b>137</b> и <code>OOMKilled=true</code>. Лимит CPU приводит не к смерти, а к торможению (throttling).</p>
<div class="tbl"><table><tr><th>restart</th><th>Поведение</th></tr>
<tr><td><code>no</code></td><td>Не перезапускать</td></tr><tr><td><code>on-failure</code></td><td>Только при ненулевом коде</td></tr>
<tr><td><code>unless-stopped</code></td><td>Всегда, кроме ручной остановки. Обычный выбор</td></tr><tr><td><code>always</code></td><td>Всегда</td></tr></table></div>
<p>Статус <code>Restarting</code> в цикле означает, что приложение падает при запуске. Смотрите <code>docker logs</code> и код выхода.</p>`,
  check:[
   S('q7-2a','Приложение в контейнере подключается к localhost:5432, база в другом контейнере. Что будет?',['Отказ: localhost внутри контейнера — это он сам','Подключится к базе','Подключится к хосту','Docker сам исправит адрес'],'Используйте имя сервиса: db:5432.'),
   I('q7-2b','Контейнер убит за превышение лимита памяти. Какой код выхода?',['137'],'128 + 9 (SIGKILL).')
  ]},
 { id:'7-3', title:'Docker Compose', html:`
<p>Compose описывает несколько контейнеров одним файлом и поднимает их как единое целое. Для одного сервера это часто лучший и самый простой способ.</p>
<pre><code>services:
  app:
    build: .                     # или image: registry/shop-api:1.4.2
    environment:
      DB_URL: jdbc:postgresql://db:5432/shop   # db — имя сервиса!
      DB_PASSWORD: \${DB_PASSWORD}              # значение из файла .env
    ports:
      - "127.0.0.1:8080:8080"
    depends_on:
      db:
        condition: service_healthy   # ждать готовности, а не только запуска
    restart: unless-stopped
    mem_limit: 768m

  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: shop
      POSTGRES_PASSWORD: \${DB_PASSWORD}
    volumes:
      - dbdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 10

volumes:
  dbdata:</code></pre>
<div class="tbl"><table><tr><th>Команда</th><th>Действие</th></tr>
<tr><td><code>docker compose up -d</code></td><td>Поднять; пересоздаёт только изменённое</td></tr>
<tr><td><code>docker compose up -d --build</code></td><td>С пересборкой образов</td></tr>
<tr><td><code>docker compose ps</code></td><td>Состояние</td></tr>
<tr><td><code>docker compose logs -f app</code></td><td>Логи сервиса</td></tr>
<tr><td><code>docker compose exec db psql -U postgres</code></td><td>Команда внутри контейнера</td></tr>
<tr><td><code>docker compose down</code></td><td>Убрать контейнеры и сеть. Тома сохраняются</td></tr>
<tr><td><code>docker compose down -v</code></td><td>⚠ Также <b>удалить тома с данными</b></td></tr></table></div>
<div class="note warn"><b>Файл .env не коммитьте.</b> Держите его в <code>.gitignore</code>, а в репозитории — <code>.env.example</code> без значений.</div>
<p>Алгоритм, когда контейнер не работает: <code>ps</code> (какой статус и код) → <code>logs</code> (текст ошибки) → <code>inspect</code> (OOM, переменные, сеть) → <code>exec</code> (что видно изнутри) → <code>stats</code> (ресурсы).</p>
${lab('lab_docker')}
${en('Containers on the same user-defined network can resolve each other by service name. Named volumes persist data after a container is removed.','<code>resolve</code> — разрешить имя в адрес, <code>persist</code> — сохраняться, <code>removed</code> — удалён.','В одной сети контейнеры находят друг друга по имени, а данные в томах переживают удаление контейнера.')}`,
  check:[
   S('q7-3a','Какая команда уничтожит данные в томах?',['docker compose down -v','docker compose down','docker compose restart','docker compose stop'],'Флаг -v удаляет именованные тома.'),
   S('q7-3b','Зачем condition: service_healthy?',['Ждать реальной готовности базы, а не только старта контейнера','Для ускорения сборки','Для открытия порта','Для ротации логов'],'Запуск контейнера ещё не означает, что база принимает соединения.')
  ]}
 ],
 test:[
  P('t7-1','Сопоставьте механизм и роль.',[['Namespaces','Изолируют видимое'],['Cgroups','Ограничивают ресурсы'],['Слой образа','Неизменяемая часть ФС'],['Том','Постоянные данные']],'Контейнер — процесс с этими ограничениями.'),
  A('t7-2','Что происходит?','$ docker ps -a\nshop-app  Exited (137) 2 minutes ago\n$ docker inspect shop-app --format "{{.State.OOMKilled}}"\ntrue',['Контейнер убит за превышение лимита памяти','Приложение завершилось успешно','Ошибка сборки','Нет сети'],'OOMKilled=true и код 137.'),
  S('t7-3','Почему не использовать тег latest в production?',['Неясно, какая версия запущена, сложно откатиться','Он медленнее','Он запрещён Docker','Он занимает больше места'],'Используйте неизменяемый тег.'),
  S('t7-4','docker stop ждёт 10 секунд, затем убивает контейнер. Вероятная причина?',['Приложение не получает SIGTERM: ENTRYPOINT в строковой форме через sh','Мало памяти','Закрыт порт','Нет тома'],'Форма-массив делает приложение PID 1.',3),
  S('t7-5','Что произойдёт с файлами, записанными в контейнер без тома, после его удаления?',['Они исчезнут','Сохранятся навсегда','Попадут в образ','Перейдут в другой контейнер'],'Записываемый слой удаляется с контейнером.'),
  I('t7-6','Какая подкоманда покажет использование CPU и памяти контейнерами?',['docker stats','stats'],'Добавьте --no-stream для одного снимка.'),
  S('t7-7','Диск заполнился, контейнеры работают. Что может занять место в /var/lib/docker?',['JSON-логи контейнеров без ротации и старые образы','Сертификаты','Unit-файлы','Таблица маршрутов'],'Проверяйте docker system df и настройте log-opts.',3),
  S('t7-8','Порт 5432 опубликован через -p, правила ufw его запрещают. Что будет?',['Порт может оказаться открытым: Docker обходит ufw','Точно закрыт','Контейнер не стартует','Будет 502'],'Не публикуйте порт базы.',3)
 ]
},
{
 id: 8, title: 'PostgreSQL', short: 'Неделя 8: процессы, соединения, индексы, блокировки, транзакции, копии',
 lessons: [
 { id:'8-1', title:'Архитектура и соединения', html:`
<p>PostgreSQL — многопроцессная СУБД. Главный процесс (postmaster) принимает подключения и на <b>каждое соединение запускает отдельный процесс</b> (backend). Рядом работают служебные: checkpointer, WAL writer, autovacuum.</p>
<pre><code>Клиент ──▶ postmaster ──fork──▶ backend (процесс на соединение)
                                  │
                         Shared Buffers (кэш страниц в RAM)
                                  │
                  WAL (журнал) ──▶ файлы данных на диске</code></pre>
<p><b>WAL</b> (Write-Ahead Log): изменение сначала пишется в журнал, а потом в файлы данных. Если сервер упал, база восстанавливается, проигрывая WAL. На этом также основана репликация.</p>
<h3>Почему соединения дорогие</h3>
<p>Каждое соединение — это процесс и несколько мегабайт памяти. Поэтому <code>max_connections</code> обычно ~100, а поднимать его до тысяч нельзя. Когда лимит достигнут, новые клиенты получают: <code>FATAL: sorry, too many clients already</code>.</p>
<p><b>Connection pooling</b> решает это: пул держит ограниченный набор соединений и переиспользует их. На стороне приложения это HikariCP, централизованно — PgBouncer. Оцените сумму: 5 копий приложения по 30 соединений = 150, что уже превышает лимит.</p>
<h3>Что происходит сейчас</h3>
<pre><code>psql -U postgres -d shop
\\l                  -- базы
\\dt                 -- таблицы
\\d orders           -- структура таблицы

SELECT count(*) FROM pg_stat_activity;
SELECT state, count(*) FROM pg_stat_activity GROUP BY state;
SELECT pid, state, wait_event_type, now()-query_start AS dur, query
FROM pg_stat_activity WHERE state <> 'idle' ORDER BY dur DESC;</code></pre>
<div class="tbl"><table><tr><th>state</th><th>Смысл</th></tr>
<tr><td><code>active</code></td><td>Выполняет запрос</td></tr><tr><td><code>idle</code></td><td>Ждёт команду. Занимает соединение, но не блокировки</td></tr>
<tr><td><code>idle in transaction</code></td><td>⚠ Открыл транзакцию и ничего не делает: держит блокировки</td></tr></table></div>`,
  check:[
   S('q8-1a','Почему нельзя просто поставить max_connections = 5000?',['Каждое соединение — процесс с памятью и накладными расходами','Это не поддерживается','Тогда отключится WAL','Сломается DNS'],'Правильное решение — пул соединений.'),
   S('q8-1b','Что опасно в состоянии idle in transaction?',['Сеанс бездействует, но держит блокировки и мешает очистке','Он потребляет 100% CPU','Он удаляет данные','Это нормальное состояние простоя'],'Настройка idle_in_transaction_session_timeout ограничивает такие сеансы.')
  ]},
 { id:'8-2', title:'Индексы и медленные запросы', html:`
<p>Без индекса база читает всю таблицу (<b>Seq Scan</b>). Индекс (обычно B-tree) позволяет быстро найти нужные строки. Цена: занимает диск и замедляет запись, поэтому создавайте индексы под реальные запросы.</p>
<h3>Как читать EXPLAIN</h3>
<pre><code>EXPLAIN ANALYZE SELECT * FROM orders WHERE email = 'a@b.c';

Seq Scan on orders (cost=0.00..48210.00 rows=1)
                   (actual time=412.2..820.7 rows=1)
  Filter: (email = 'a@b.c')
  Rows Removed by Filter: 2399999      ← прочитали миллионы ради одной строки
Execution Time: 820.9 ms</code></pre>
<ul>
<li><code>EXPLAIN</code> показывает план. <code>EXPLAIN ANALYZE</code> <b>реально выполняет запрос</b>: для UPDATE и DELETE заворачивайте в транзакцию с ROLLBACK.</li>
<li><code>rows</code> — ожидание, <code>actual rows</code> — факт. Большое расхождение означает устаревшую статистику, поможет <code>ANALYZE</code>.</li>
<li>Индекс не всегда лучше: если нужна большая часть таблицы, Seq Scan быстрее.</li>
</ul>
<pre><code>CREATE INDEX CONCURRENTLY idx_orders_email ON orders(email);</code></pre>
<div class="note warn"><b>На работающей базе только CONCURRENTLY.</b> Обычный CREATE INDEX блокирует запись в таблицу на всё время построения.</div>
<h3>Как найти медленные запросы</h3>
<pre><code># postgresql.conf: писать запросы дольше 500 мс в лог
log_min_duration_statement = 500

-- Расширение pg_stat_statements: что в сумме дороже всего
SELECT calls, round(total_exec_time) total_ms, round(mean_exec_time) mean_ms, query
FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;</code></pre>
<p>Запрос на 50 мс, вызываемый миллион раз, тяжелее отчёта на 10 секунд раз в день. Также ищите проблему <b>N+1</b>: приложение делает 1 запрос за списком и ещё N за деталями; её часто создаёт ORM (Hibernate), и она хорошо видна по числу вызовов.</p>
<p>Логи базы: <code>/var/log/postgresql/</code> или вывод контейнера. Искать: <code>FATAL</code>, <code>deadlock detected</code>, <code>duration:</code>, <code>checkpoints are occurring too frequently</code>.</p>
<p>Удалённые строки физически очищает <b>autovacuum</b>. Если транзакция висит часами, очистка не может продвинуться, и таблицы разбухают.</p>`,
  check:[
   S('q8-2a','Что значит большой Rows Removed by Filter в Seq Scan?',['База читает много лишних строк: возможно, нужен индекс','Строки удалены из таблицы','Запрос завершился ошибкой','Индекс используется'],'Строки отфильтрованы при чтении, а не удалены.'),
   S('q8-2b','Почему EXPLAIN ANALYZE нужно использовать осторожно с DELETE?',['Он реально выполняет запрос','Он блокирует сеть','Он удаляет индекс','Он не работает с DELETE'],'Заворачивайте в BEGIN ... ROLLBACK.')
  ]},
 { id:'8-3', title:'Транзакции и блокировки', html:`
<p><b>Транзакция</b> объединяет операции: либо всё применится (COMMIT), либо ничего (ROLLBACK). Чтобы читатели и писатели не мешали друг другу, PostgreSQL использует <b>MVCC</b>: хранит несколько версий строки. Чтение не блокирует запись, а запись не блокирует чтение. Но два изменения одной строки конфликтуют: второе ждёт завершения первого.</p>
<pre><code>Сеанс A: BEGIN; UPDATE orders SET status='paid' WHERE id=77;   (забыл COMMIT)
Сеанс B: UPDATE orders SET total=10 WHERE id=77;   ← ждёт A
Сеанс C: UPDATE orders SET note='x' WHERE id=77;   ← ждёт B</code></pre>
<p>Одна незакрытая транзакция собирает очередь, очередь занимает весь пул соединений, приложение отдаёт 504. Цепочка из модуля 6 начинается вот так.</p>
<h3>Как найти виновника</h3>
<pre><code>SELECT pid, pg_blocking_pids(pid) AS blocked_by, state, query
FROM pg_stat_activity WHERE wait_event_type = 'Lock';

SELECT pid, now()-xact_start AS age, state, query
FROM pg_stat_activity
WHERE xact_start IS NOT NULL ORDER BY age DESC LIMIT 5;</code></pre>
<p>Идите по цепочке <code>blocked_by</code> к началу: виновник сам ничего не ждёт. Завершение:</p>
<pre><code>SELECT pg_cancel_backend(8120);    -- отменить текущий запрос
SELECT pg_terminate_backend(8120); -- разорвать соединение, транзакция откатится</code></pre>
<div class="note warn"><b>Опасные миграции.</b> <code>ALTER TABLE</code> берёт самую сильную блокировку. Если он сам ждёт долгий запрос, за ним встают все остальные, даже чтение. Защита перед миграцией: <code>SET lock_timeout = '3s';</code></div>
<p><b>Deadlock</b> — две транзакции ждут друг друга. PostgreSQL обнаруживает это сам и отменяет одну (<code>deadlock detected</code> в логе). Решение на стороне кода: менять строки в едином порядке.</p>
<p>Причина, которую часто находят: внешний HTTP-вызов внутри транзакции. Пока внешний сервис думает, строка заблокирована.</p>`,
  check:[
   S('q8-3a','Как определить начало цепочки блокировок?',['С помощью pg_blocking_pids найти процесс, который сам не ждёт','Завершить самый новый процесс','Посмотреть df -h','Перезагрузить сервер'],'Жертвы не виноваты, ищите начало цепочки.'),
   S('q8-3b','Чем pg_cancel_backend отличается от pg_terminate_backend?',['Первый отменяет запрос, второй разрывает соединение','Ничем','Первый удаляет таблицу','Второй останавливает весь сервер'],'Начинайте с мягкого варианта.')
  ]},
 { id:'8-4', title:'Резервное копирование и восстановление', html:`
<div class="tbl"><table><tr><th>Способ</th><th>Что это</th><th>Плюсы</th><th>Минусы</th></tr>
<tr><td><code>pg_dump</code></td><td>Логическая копия одной базы</td><td>Просто, переносимо, можно восстановить таблицу</td><td>Медленно на больших базах, потери с момента копии</td></tr>
<tr><td><code>pg_basebackup</code></td><td>Физическая копия кластера</td><td>Быстро для больших баз</td><td>Та же версия PostgreSQL</td></tr>
<tr><td>WAL-архив + базовая копия</td><td>Восстановление на момент времени (PITR)</td><td>Потери измеряются минутами или секундами</td><td>Сложнее настроить, нужны инструменты вроде pgBackRest</td></tr></table></div>
<pre><code>pg_dump -Fc shop -f shop.dump      # сжатый формат для pg_restore
pg_restore -l shop.dump            # оглавление архива
createdb shop_restore
pg_restore -d shop_restore -j 4 shop.dump   # в 4 потока
psql -d shop_restore -c "SELECT count(*) FROM orders"</code></pre>
<div class="note warn"><b>Копия не считается, пока не проверена.</b> Частая беда — скрипт годами пишет пустые файлы или копия лежит на том же диске. Минимальные правила: хранить копию на другом сервере или в другом хранилище; следить за размером и возрастом; регулярно выполнять настоящее восстановление; замерять, сколько оно занимает.</div>
<p>Правило <b>3-2-1</b>: 3 копии данных, на 2 разных носителях, 1 вне основной площадки. Репликация — это не резервная копия: случайный <code>DELETE</code> мгновенно приедет и на реплику.</p>
${lab('lab_pg')}
${en('A backup is only useful if it can be restored. pg_dump takes a consistent snapshot of a database while it is in use and does not block other users.','<code>restored</code> — восстановлена, <code>consistent</code> — согласованный, <code>while in use</code> — во время работы.','Копия ценна, только если из неё можно восстановиться. pg_dump делает согласованный снимок, не мешая работе.')}
<div class="note recap"><b>Контрольная точка этапа 2.</b> Сможете ли вы объяснить:
<ul><li>путь HTTP-запроса от клиента до backend и роль reverse proxy;</li><li>как читать журналы Nginx и различать 502, 503, 504;</li><li>механизмы JVM и как получить диагностику Java-приложения;</li><li>как работать с Docker и Compose;</li><li>как найти медленный запрос и блокировку в PostgreSQL?</li></ul></div>`,
  check:[
   S('q8-4a','Почему реплика не заменяет резервную копию?',['Ошибочное удаление сразу реплицируется','Реплика медленная','Реплика не содержит данных','Реплику нельзя читать'],'Копия даёт возможность вернуться в прошлое.'),
   M('q8-4b','Что входит в проверку резервного копирования?',['Настоящее восстановление','Проверка возраста и размера файлов','Замер времени восстановления','Отключение WAL'],[0,1,2],'Только восстановление доказывает пригодность.')
  ]}
 ],
 test:[
  A('t8-1','О чём говорит этот вывод?',"  pid | blocked_by\n 8344 | {8120}\n 8350 | {8344}",['8120 блокирует 8344, а тот — 8350','8350 виновник','Блокировок нет','Deadlock'],'Цепочка начинается с 8120.'),
  S('t8-2','Что такое WAL?',['Журнал изменений, который пишется раньше данных','Индекс','Вид соединения','Формат копии'],'Он обеспечивает восстановление после сбоя и репликацию.'),
  S('t8-3','Ошибка «sorry, too many clients already». Лучшее решение?',['Проверить утечки и настроить пул соединений','Удалить таблицы','Отключить autovacuum','Перезапустить DNS'],'Сначала выясните, кто и зачем держит соединения.'),
  I('t8-4','Какое ключевое слово создаёт индекс без блокировки записи?',['CONCURRENTLY'],'CREATE INDEX CONCURRENTLY.'),
  S('t8-5','Какой файл pg_dump нужно восстанавливать через pg_restore?',['Созданный с -Fc','Только текстовый SQL','Любой файл журнала','WAL'],'Текстовый дамп восстанавливают через psql.'),
  S('t8-6','Миграция ALTER TABLE ждёт долгий SELECT, и всё приложение встало. Почему?',['Запросы выстроились в очередь за блокировкой ALTER','Закончился диск','SELECT блокирует всё само','Сломался пул'],'Поставьте lock_timeout перед миграцией.',3),
  S('t8-7','Запрос 40 мс вызывается 2 млн раз в день. Другой — 30 с раз в день. Что важнее оптимизировать по нагрузке?',['Первый: суммарно намного дороже','Второй','Оба одинаковы','Никакой'],'Смотрите total_exec_time в pg_stat_statements.'),
  P('t8-8','Сопоставьте термин и смысл.',[['MVCC','Версии строк для параллельной работы'],['Autovacuum','Очистка мёртвых строк'],['PITR','Восстановление на момент времени'],['PgBouncer','Пул соединений']],'Все эти термины встречаются в реальной эксплуатации.')
 ]
}
];
