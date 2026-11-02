// Лаборатории этапа 2: Nginx, JVM, Docker, PostgreSQL.
const ACCESS = [
  ['203.0.113.5', '/', 200, 0.012], ['203.0.113.9', '/api/products', 200, 0.081], ['198.51.100.7', '/api/orders', 502, 0.002],
  ['203.0.113.5', '/api/orders', 502, 0.001], ['192.0.2.44', '/static/app.js', 200, 0.001], ['198.51.100.7', '/api/orders', 504, 60.001],
  ['203.0.113.9', '/api/cart', 200, 0.143], ['192.0.2.44', '/wp-login.php', 404, 0.001], ['203.0.113.5', '/api/orders', 502, 0.002],
  ['192.0.2.44', '/admin', 403, 0.001], ['203.0.113.9', '/api/products', 200, 0.077], ['198.51.100.7', '/api/orders', 502, 0.001]
].map(([ip, p, c, t]) => `${ip} - - [01/Nov/2026:11:5${c % 10}:00 +0000] "GET ${p} HTTP/1.1" ${c} 512 "-" "curl/8.5" ${t}`).join('\n') + '\n';

export const LABS2 = {
lab_http: {
  title: 'HTTP руками: curl', host: 'web-01',
  intro: 'Посмотрите на настоящий диалог клиента с сервером: метод, заголовки, коды, редиректы.',
  cmds: [
    { re: /^curl -I http:\/\/shop\.lab\/?$/, out: 'HTTP/1.1 301 Moved Permanently\nServer: nginx\nLocation: https://shop.lab/' },
    { re: /^curl -I https:\/\/shop\.lab\/?$/, out: 'HTTP/2 200\nserver: nginx\ncontent-type: text/html\ncache-control: no-cache' },
    { re: /^curl -v https:\/\/shop\.lab\/api\/health$/, out: '> GET /api/health HTTP/2\n> Host: shop.lab\n> User-Agent: curl/8.5\n> Accept: */*\n>\n< HTTP/2 200\n< content-type: application/json\n<\n{"status":"UP"}' },
    { re: /^curl -s -o \/dev\/null -w .*https:\/\/shop\.lab\/nope$/, out: '404' },
    { re: /^curl -s -X POST https:\/\/shop\.lab\/api\/orders$/, out: '{"status":401,"error":"Unauthorized"}' },
    { re: /^curl -s -X DELETE https:\/\/shop\.lab\/api\/products$/, out: '{"status":405,"error":"Method Not Allowed"}' }
  ],
  tasks: [
    { t: 'curl -I http://shop.lab — какой код ответа?', sol: ['curl -I http://shop.lab', 'answer 301'], ans: ['301'], why: 'Постоянный редирект с HTTP на HTTPS.' },
    { t: 'curl -v https://shop.lab/api/health. Каким символом отмечены строки запроса: > или <?', sol: ['curl -v https://shop.lab/api/health', 'answer >'], ans: ['>'] },
    { t: "Получите только код: curl -s -o /dev/null -w '%{http_code}' https://shop.lab/nope", sol: ["curl -s -o /dev/null -w '%{http_code}' https://shop.lab/nope", 'answer 404'], ans: ['404'] },
    { t: 'curl -s -X POST https://shop.lab/api/orders. Что означает код: answer auth или answer server?', sol: ['curl -s -X POST https://shop.lab/api/orders', 'answer auth'], ans: ['auth'], why: '4xx — проблема запроса (нет авторизации). 5xx — проблема сервера.' }
  ]
},
lab_nginx: {
  title: 'Ошибка 502: чиним reverse proxy', host: 'web-01',
  intro: 'Пользователи получают 502 на /api. Разберите лог, найдите неверный upstream и исправьте конфиг без простоя.',
  state: { reloaded: '' },
  dirs: ['/etc/nginx', '/etc/nginx/sites-enabled', '/var/log/nginx'],
  fs: {
    '/etc/nginx/sites-enabled/shop.conf': 'upstream backend {\n    server 127.0.0.1:8081;\n}\n\nserver {\n    listen 443 ssl;\n    server_name shop.lab;\n    ssl_certificate     /etc/letsencrypt/live/shop.lab/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/shop.lab/privkey.pem;\n\n    location /api/ {\n        proxy_pass http://backend;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n        proxy_read_timeout 60s;\n    }\n\n    location / {\n        root /var/www/shop;\n        try_files $uri /index.html;\n    }\n}\n',
    '/var/log/nginx/access.log': ACCESS,
    '/var/log/nginx/error.log': '2026/11/01 11:52:00 [error] 841#841: *102 connect() failed (111: Connection refused) while connecting to upstream, client: 198.51.100.7, server: shop.lab, request: "GET /api/orders HTTP/1.1", upstream: "http://127.0.0.1:8081/api/orders"\n2026/11/01 11:54:00 [error] 841#841: *109 upstream timed out (110: Connection timed out) while reading response header from upstream, client: 198.51.100.7, request: "GET /api/orders HTTP/1.1"\n'
  },
  cmds: [
    { re: /^ss -tlnp$/, out: 'State  Local Address:Port  Process\nLISTEN 0.0.0.0:443   users:(("nginx",pid=840))\nLISTEN 127.0.0.1:8080 users:(("java",pid=1204))' },
    { re: /^curl -s(I)? (http:\/\/)?(127\.0\.0\.1|localhost):8080\/\S*$/, out: '{"status":"UP"}' },
    { re: /^curl -s(I)? (http:\/\/)?(127\.0\.0\.1|localhost):8081\/\S*$/, out: 'curl: (7) Failed to connect to 127.0.0.1 port 8081: Connection refused', fail: true },
    { re: /^nginx -t$/, when: (s, fs) => /listen 443 ssl;/.test(fs['/etc/nginx/sites-enabled/shop.conf']), out: (s) => { s.tested = true; return 'nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful'; } },
    { re: /^nginx -t$/, out: 'nginx: [emerg] invalid parameter in /etc/nginx/sites-enabled/shop.conf\nnginx: configuration file /etc/nginx/nginx.conf test failed', fail: true },
    { re: /^(systemctl reload nginx|nginx -s reload)$/, out: '', set: (s, m, a) => { s.reloaded = a.fs['/etc/nginx/sites-enabled/shop.conf']; } },
    { re: /^systemctl restart nginx$/, out: 'Служба перезапущена, активные соединения разорваны. На production используйте reload.', set: (s, m, a) => { s.reloaded = a.fs['/etc/nginx/sites-enabled/shop.conf']; } },
    { re: /^curl -s(I)? https:\/\/shop\.lab\/api\/\S*$/, out: s => /127\.0\.0\.1:8080/.test(s.reloaded) ? 'HTTP/2 200\ncontent-type: application/json' : 'HTTP/2 502\nserver: nginx' }
  ],
  tasks: [
    { t: 'Прочитайте access.log: tail /var/log/nginx/access.log', sol: 'tail /var/log/nginx/access.log', ok: /access\.log/ },
    { t: "Посчитайте коды ответа: awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c. Сколько ответов 502?", sol: ["awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c", 'answer 4'], ans: ['4'], why: 'Эта связка команд — стандарт быстрого анализа логов.' },
    { t: "Какой URL чаще всего даёт 502? awk '$9==502 {print $7}' /var/log/nginx/access.log | sort | uniq -c", sol: ["awk '$9==502 {print $7}' /var/log/nginx/access.log | sort | uniq -c", 'answer /api/orders'], ans: ['/api/orders'] },
    { t: 'Прочитайте error.log (grep 111 /var/log/nginx/error.log). Какой адрес и порт upstream указан?', sol: ['grep 111 /var/log/nginx/error.log', 'answer 127.0.0.1:8081'], ans: ['127.0.0.1:8081', '8081'], why: '111: Connection refused — по этому адресу никто не слушает. Это и есть 502.' },
    { t: 'ss -tlnp: на каком порту слушает java?', sol: ['ss -tlnp', 'answer 8080'], ans: ['8080', '127.0.0.1:8080'] },
    { t: 'Проверьте backend напрямую, минуя nginx: curl -s http://127.0.0.1:8080/actuator/health', sol: 'curl -s http://127.0.0.1:8080/actuator/health', ok: /curl -s.*8080/, why: 'Приложение живое, значит, проблема в связи nginx → приложение.' },
    { t: 'Исправьте порт в /etc/nginx/sites-enabled/shop.conf (nano или sed).', sol: "sed -i 's/127.0.0.1:8081/127.0.0.1:8080/' /etc/nginx/sites-enabled/shop.conf", check: (s, fs) => /127\.0\.0\.1:8080/.test(fs['/etc/nginx/sites-enabled/shop.conf']) },
    { t: 'Проверьте синтаксис: nginx -t', sol: 'nginx -t', check: s => s.tested, why: 'Всегда проверяйте конфиг перед применением: ошибка при reload не уронит nginx, но при restart — уронит.' },
    { t: 'Примените без разрыва соединений: systemctl reload nginx', sol: 'systemctl reload nginx', check: s => /127\.0\.0\.1:8080/.test(s.reloaded) },
    { t: 'Убедитесь, что всё работает: curl -sI https://shop.lab/api/orders. Какой код?', sol: ['curl -sI https://shop.lab/api/orders', 'answer 200'], ans: ['200'] }
  ]
},
lab_jvm: {
  title: 'Приложение зависло: диагностика JVM', host: 'web-01',
  intro: 'shop-api отвечает 504, процесс жив, CPU почти не тратит. Разберитесь, чем заняты его потоки.',
  dirs: ['/var/log/shop'],
  fs: {
    '/var/log/shop/app.log': '2026-11-01 11:40:01 INFO  OrderController - GET /api/orders 200 41ms\n2026-11-01 11:49:12 WARN  HikariPool-1 - Thread starvation or clock leap detected\n2026-11-01 11:50:30 ERROR OrderController - GET /api/orders failed\njava.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30000ms (total=10, active=10, idle=0, waiting=186)\n\tat com.zaxxer.hikari.pool.HikariPool.createTimeoutException(HikariPool.java:696)\n\tat shop.orders.OrderRepository.findAll(OrderRepository.kt:31)\n2026-11-01 11:51:00 ERROR OrderController - GET /api/orders failed\njava.sql.SQLTransientConnectionException: HikariPool-1 - Connection is not available, request timed out after 30000ms (total=10, active=10, idle=0, waiting=201)\n',
    '/tmp/threads.txt': '"http-nio-8080-exec-1" #41 daemon prio=5 RUNNABLE\n\tat shop.reports.ReportService.buildExternal(ReportService.kt:88)\n\t- waiting on socket read: partner-api.example.lab:443\n"http-nio-8080-exec-2" #42 daemon TIMED_WAITING (parking)\n\tat com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:162)\n"http-nio-8080-exec-3" #43 daemon TIMED_WAITING (parking)\n\tat com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:162)\n"http-nio-8080-exec-4" #44 daemon TIMED_WAITING (parking)\n\tat com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:162)\n"GC Thread#0" os_prio=0 runnable\n'
  },
  cmds: [
    { re: /^jps( -l)?$/, out: '1204 shop-api.jar\n5533 jdk.jcmd/sun.tools.jps.Jps' },
    { re: /^jcmd 1204 VM\.flags$/, out: '1204:\n-XX:InitialHeapSize=536870912 -XX:MaxHeapSize=2147483648 -XX:+UseG1GC' },
    { re: /^jcmd 1204 GC\.heap_info$/, out: '1204:\n garbage-first heap   total 2097152K, used 812344K\n  region size 1024K, 120 young, 12 survivors\n Metaspace       used 141022K, committed 142080K' },
    { re: /^jstat -gcutil 1204( \d+)?( \d+)?$/, out: '  S0     S1     E      O      M     CCS    YGC   YGCT   FGC   FGCT     GCT\n  0.00  42.10  61.33  38.92  97.81  95.20   812  9.120     0  0.000   9.120' },
    { re: /^jcmd 1204 Thread\.print( > \S+)?$/, out: (s) => { s.dump = true; return 'Дамп потоков сохранён в /tmp/threads.txt (в реальной системе он печатается на экран).'; } },
    { re: /^curl -s (http:\/\/)?(127\.0\.0\.1|localhost):8080\/actuator\/metrics\/hikaricp\.connections\.active$/, out: '{"name":"hikaricp.connections.active","measurements":[{"statistic":"VALUE","value":10.0}]}' },
    { re: /^curl -s (http:\/\/)?(127\.0\.0\.1|localhost):8080\/actuator\/health$/, out: '{"status":"DOWN","components":{"db":{"status":"DOWN","details":{"error":"Connection is not available"}}}}' }
  ],
  tasks: [
    { t: 'Найдите Java-процессы: jps -l. Какой PID у shop-api?', sol: ['jps -l', 'answer 1204'], ans: ['1204'] },
    { t: 'Настройки JVM: jcmd 1204 VM.flags. Какой сборщик мусора используется? (например G1)', sol: ['jcmd 1204 VM.flags', 'answer G1'], ans: ['g1', 'g1gc', 'useg1gc'] },
    { t: 'jstat -gcutil 1204: сколько было полных сборок (столбец FGC)?', sol: ['jstat -gcutil 1204', 'answer 0'], ans: ['0'], why: 'Old занят на 39%, FGC = 0. Память и GC здесь ни при чём: одну гипотезу исключили.' },
    { t: 'Посмотрите лог: grep ERROR /var/log/shop/app.log, затем grep Hikari /var/log/shop/app.log. Сколько соединений в пуле всего (total)?', sol: ['grep Hikari /var/log/shop/app.log', 'answer 10'], ans: ['10'], why: 'total=10, active=10, idle=0, waiting=201: все соединения заняты, сотни запросов ждут.' },
    { t: 'Снимите дамп потоков: jcmd 1204 Thread.print', sol: 'jcmd 1204 Thread.print', check: s => s.dump },
    { t: 'Посчитайте потоки, которые ждут соединение: grep -c getConnection /tmp/threads.txt', sol: ['grep -c getConnection /tmp/threads.txt', 'answer 3'], ans: ['3'] },
    { t: 'cat /tmp/threads.txt: какой класс держит соединение и ждёт внешний API?', sol: ['cat /tmp/threads.txt', 'answer ReportService'], ans: ['reportservice', 'shop.reports.reportservice'], why: 'Корень проблемы: сервис держит соединение с БД, пока ждёт ответа внешнего API. Решение: не вызывать внешние API внутри транзакции, задать таймаут на чтение, настроить maxLifetime и leakDetectionThreshold.' },
    { t: 'Проблема инфраструктуры или приложения? Ответьте: приложение или инфраструктура', sol: 'answer приложение', ans: ['приложение', 'application', 'app'], why: 'CPU, память и диск в норме, GC в норме. Это логика работы с пулом, такую задачу вы приносите разработчикам вместе с дампом и точной строкой кода.' }
  ]
},
lab_docker: {
  title: 'Docker: образ, сеть, Compose', host: 'lab-docker',
  intro: 'В проекте лежит compose.yaml. Приложение постоянно перезапускается. Поднимите стек, найдите причину и почините.',
  cwd: '/home/student/shop',
  state: { up: false, built: false, applied: '' },
  fs: {
    '/home/student/shop/Dockerfile': 'FROM eclipse-temurin:21-jre-alpine\nWORKDIR /app\nCOPY build/libs/shop-api.jar app.jar\nUSER 1000\nEXPOSE 8080\nENTRYPOINT ["java","-XX:MaxRAMPercentage=75","-jar","app.jar"]\n',
    '/home/student/shop/compose.yaml': 'services:\n  app:\n    build: .\n    environment:\n      DB_URL: jdbc:postgresql://localhost:5432/shop\n      DB_PASSWORD: ${DB_PASSWORD}\n    ports:\n      - "8080:8080"\n    depends_on:\n      db:\n        condition: service_healthy\n    restart: unless-stopped\n    mem_limit: 512m\n\n  db:\n    image: postgres:17-alpine\n    environment:\n      POSTGRES_DB: shop\n      POSTGRES_PASSWORD: ${DB_PASSWORD}\n    volumes:\n      - dbdata:/var/lib/postgresql/data\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U postgres"]\n      interval: 5s\n      retries: 10\n\nvolumes:\n  dbdata:\n',
    '/home/student/shop/.env': 'DB_PASSWORD=devpass\n'
  },
  cmds: [
    { re: /^docker images$/, out: s => `REPOSITORY  TAG        IMAGE ID      SIZE\npostgres    17-alpine  a1b2c3d4e5f6  278MB${s.built ? '\nshop-app    latest     f6e5d4c3b2a1  214MB' : ''}` },
    { re: /^docker build -t \S+ \.$/, out: '[1/3] FROM eclipse-temurin:21-jre-alpine\n[2/3] WORKDIR /app\n[3/3] COPY build/libs/shop-api.jar app.jar\nexporting to image — done', set: s => { s.built = true; } },
    { re: /^docker history \S+$/, out: 'CREATED BY                                  SIZE\nENTRYPOINT ["java" ...]                     0B\nCOPY build/libs/shop-api.jar app.jar        48MB\nWORKDIR /app                                0B\n(базовый образ eclipse-temurin:21-jre-alpine) 166MB' },
    { re: /^docker compose config( -q)?$/, out: 'Конфигурация корректна.' },
    { re: /^docker compose up -d( --build)?$/, out: ' ✔ Network shop_default  Created\n ✔ Volume shop_dbdata    Created\n ✔ Container shop-db-1   Healthy\n ✔ Container shop-app-1  Started', set: (s, m, a) => { s.up = true; s.applied = a.fs['/home/student/shop/compose.yaml']; } },
    { re: /^docker compose ps$/, when: s => !s.up, out: 'NAME  IMAGE  STATUS' },
    { re: /^docker compose ps$/, when: s => /db:5432/.test(s.applied), out: 'NAME        IMAGE               STATUS\nshop-app-1  shop-app            Up 20 seconds\nshop-db-1   postgres:17-alpine  Up 40 seconds (healthy)' },
    { re: /^docker compose ps$/, out: 'NAME        IMAGE               STATUS\nshop-app-1  shop-app            Restarting (1) 4 seconds ago\nshop-db-1   postgres:17-alpine  Up 40 seconds (healthy)' },
    { re: /^docker compose logs( --tail[= ]\d+)? app$/, when: s => /db:5432/.test(s.applied), out: 'app-1  | Started ShopApplication in 7.4 seconds' },
    { re: /^docker compose logs( --tail[= ]\d+)? app$/, out: 'app-1  | HikariPool-1 - Exception during pool initialization.\napp-1  | org.postgresql.util.PSQLException: Connection to localhost:5432 refused.\napp-1  | Application run failed' },
    { re: /^docker network ls$/, out: 'NETWORK ID   NAME          DRIVER\n1c2d3e4f     bridge        bridge\n5a6b7c8d     shop_default  bridge' },
    { re: /^docker network inspect shop_default.*$/, out: '"Containers": {\n  "shop-db-1":  {"IPv4Address": "172.20.0.2/16"},\n  "shop-app-1": {"IPv4Address": "172.20.0.3/16"}\n}' },
    { re: /^docker stats --no-stream$/, out: 'NAME        CPU %   MEM USAGE / LIMIT    MEM %\nshop-app-1  1.40%   388MiB / 512MiB      75.8%\nshop-db-1   0.20%   42MiB / 3.8GiB       1.1%' },
    { re: /^docker inspect shop-app-1 --format .*OOMKilled.*$/, out: 'false' },
    { re: /^docker compose down$/, out: 'Контейнеры и сеть удалены. Том dbdata сохранён.', set: s => { s.up = false; } },
    { re: /^docker volume ls$/, out: 'DRIVER  VOLUME NAME\nlocal   shop_dbdata' },
    { re: /^curl -s (http:\/\/)?localhost:8080\/\S*$/, when: s => /db:5432/.test(s.applied), out: '{"status":"UP"}' }
  ],
  tasks: [
    { t: 'cat Dockerfile. От какого пользователя (номер) работает приложение?', sol: ['cat Dockerfile', 'answer 1000'], ans: ['1000'], why: 'USER не root: взлом приложения не даёт root внутри контейнера.' },
    { t: 'Соберите образ: docker build -t shop-app .', sol: 'docker build -t shop-app .', check: s => s.built },
    { t: 'docker history shop-app. Сколько весит слой с вашим jar?', sol: ['docker history shop-app', 'answer 48MB'], ans: ['48mb', '48'] },
    { t: 'Поднимите стек: docker compose up -d', sol: 'docker compose up -d', check: s => s.up },
    { t: 'docker compose ps: какой контейнер перезапускается? (shop-app-1 или shop-db-1)', sol: ['docker compose ps', 'answer shop-app-1'], ans: ['shop-app-1', 'app'] },
    { t: 'docker compose logs app. К какому адресу пытается подключиться приложение?', sol: ['docker compose logs app', 'answer localhost:5432'], ans: ['localhost:5432', 'localhost'], why: 'Внутри контейнера localhost — это сам контейнер, а не сервер и не соседний контейнер.' },
    { t: 'Посмотрите сеть: docker network inspect shop_default. Контейнеры в одной сети находят друг друга по имени сервиса. Замените localhost на db в compose.yaml.', sol: ['docker network inspect shop_default', "sed -i 's/localhost:5432/db:5432/' compose.yaml"], check: (s, fs) => /db:5432/.test(fs['/home/student/shop/compose.yaml']) },
    { t: 'Примените: docker compose up -d и проверьте docker compose ps.', sol: ['docker compose up -d', 'docker compose ps'], ok: /^docker compose ps$/, check: null },
    { t: 'Ресурсы: docker stats --no-stream. Сколько процентов лимита памяти занимает app?', sol: ['docker stats --no-stream', 'answer 75.8'], ans: ['75.8', '75.8%'], why: 'MaxRAMPercentage=75 в Dockerfile: JVM видит лимит контейнера и рассчитывает heap от него.' },
    { t: 'Остановите стек: docker compose down. Сохранятся ли данные БД? (да/нет)', sol: ['docker compose down', 'answer да'], ans: ['да', 'yes'], why: 'Том живёт отдельно от контейнера. Удалит его только docker compose down -v, с этим флагом будьте очень осторожны.' }
  ]
},
lab_pg: {
  title: 'PostgreSQL: блокировка и медленный запрос', host: 'db-01',
  intro: 'Запросы к заказам висят, а поиск медленный. Посмотрите, что происходит внутри базы. Команды SQL передаются как psql -c "...".',
  state: { locked: true, indexed: false, dumped: false, restored: false },
  cmds: [
    { re: /^psql -c ['"]?select count\(\*\) from pg_stat_activity;?['"]?$/i, out: ' count\n-------\n   47\n(1 row)' },
    { re: /^psql -c ['"]?show max_connections;?['"]?$/i, out: ' max_connections\n-----------------\n 100' },
    { re: /^psql -c ['"]?select state, count\(\*\) from pg_stat_activity group by state;?['"]?$/i, out: '        state        | count\n---------------------+-------\n active              |     6\n idle                |    40\n idle in transaction |     1' },
    { re: /^psql -c ['"]?select pid, state, wait_event_type, now\(\) ?- ?xact_start as age, query from pg_stat_activity where state ?<> ?'idle';?['"]?$/i, out: s => s.locked ? '  pid  |        state        | wait_event_type |   age    | query\n-------+---------------------+-----------------+----------+-----------------------------------\n  8120 | idle in transaction | Client          | 00:47:12 | UPDATE orders SET status=\'paid\' WHERE id=77\n  8344 | active              | Lock            | 00:03:40 | UPDATE orders SET total=10 WHERE id=77\n  8350 | active              | Lock            | 00:02:11 | UPDATE orders SET note=\'x\' WHERE id=77' : '  pid  | state | wait_event_type | age | query\n-------+-------+-----------------+-----+-------\n(0 rows)' },
    { re: /^psql -c ['"]?select pid, pg_blocking_pids\(pid\) from pg_stat_activity where wait_event_type ?= ?'lock';?['"]?$/i, out: s => s.locked ? '  pid  | pg_blocking_pids\n-------+------------------\n  8344 | {8120}\n  8350 | {8344}' : '(0 rows)' },
    { re: /^psql -c ['"]?select pg_terminate_backend\(8120\);?['"]?$/i, out: ' pg_terminate_backend\n----------------------\n t', set: s => { s.locked = false; } },
    { re: /^psql -c ['"]?select pg_terminate_backend\(\d+\);?['"]?$/i, out: ' Это жертва блокировки, а не её причина. Ищите процесс, который ничего не ждёт.', fail: true },
    { re: /^psql -c ['"]?explain analyze select \* from orders where email ?= ?'a@b\.c';?['"]?$/i, out: s => s.indexed ? ' Index Scan using idx_orders_email on orders  (cost=0.42..8.44 rows=1) (actual time=0.031..0.032 rows=1)\n Execution Time: 0.058 ms' : ' Seq Scan on orders  (cost=0.00..48210.00 rows=1) (actual time=412.2..820.7 rows=1)\n   Filter: (email = \'a@b.c\')\n   Rows Removed by Filter: 2399999\n Execution Time: 820.9 ms' },
    { re: /^psql -c ['"]?create index concurrently idx_orders_email on orders ?\(email\);?['"]?$/i, out: 'CREATE INDEX', set: s => { s.indexed = true; } },
    { re: /^psql -c ['"]?create index idx_orders_email on orders ?\(email\);?['"]?$/i, out: 'CREATE INDEX\n(На работающей системе обычный CREATE INDEX блокирует запись на всё время создания. Используйте CONCURRENTLY.)', set: s => { s.indexed = true; } },
    { re: /^pg_dump -Fc shop -f \S+$/, out: '', set: (s, m, a) => { s.dumped = true; a.fs['/home/student/shop.dump'] = '(архив pg_dump, 412 МБ)\n'; } },
    { re: /^createdb shop_restore$/, out: '', set: s => { s.db = true; } },
    { re: /^pg_restore -d shop_restore \S+$/, when: s => s.db && s.dumped, out: '', set: s => { s.restored = true; } },
    { re: /^pg_restore .*$/, out: 'pg_restore: error: сначала создайте базу и снимите копию', fail: true },
    { re: /^psql -d shop_restore -c ['"]?select count\(\*\) from orders;?['"]?$/i, when: s => s.restored, out: ' count\n---------\n 2400000' },
    { re: /^psql -c ['"]?select count\(\*\) from orders;?['"]?$/i, out: ' count\n---------\n 2400000' }
  ],
  tasks: [
    { t: 'psql -c "select count(*) from pg_stat_activity" и psql -c "show max_connections". Какой лимит соединений?', sol: ['psql -c "select count(*) from pg_stat_activity"', 'psql -c "show max_connections"', 'answer 100'], ans: ['100'] },
    { t: 'psql -c "select state, count(*) from pg_stat_activity group by state". Сколько сеансов idle in transaction?', sol: ['psql -c "select state, count(*) from pg_stat_activity group by state"', 'answer 1'], ans: ['1'], why: 'Сеанс в транзакции, который ничего не делает, держит блокировки и мешает VACUUM.' },
    { t: 'Посмотрите активность: psql -c "select pid, state, wait_event_type, now()-xact_start as age, query from pg_stat_activity where state<>\'idle\'". Сколько минут открыта самая старая транзакция?', sol: ["psql -c \"select pid, state, wait_event_type, now()-xact_start as age, query from pg_stat_activity where state<>'idle'\"", 'answer 47'], ans: ['47'] },
    { t: 'Кто кого блокирует: psql -c "select pid, pg_blocking_pids(pid) from pg_stat_activity where wait_event_type=\'Lock\'". Какой PID в начале цепочки?', sol: ["psql -c \"select pid, pg_blocking_pids(pid) from pg_stat_activity where wait_event_type='Lock'\"", 'answer 8120'], ans: ['8120'] },
    { t: 'На учебном стенде завершите виновника: psql -c "select pg_terminate_backend(8120)"', sol: 'psql -c "select pg_terminate_backend(8120)"', check: s => !s.locked, why: 'В production сначала выясните, что это за клиент. Завершение откатит его незафиксированную транзакцию.' },
    { t: 'Медленный запрос: psql -c "explain analyze select * from orders where email=\'a@b.c\'". Какой тип сканирования? (Seq Scan / Index Scan)', sol: ["psql -c \"explain analyze select * from orders where email='a@b.c'\"", 'answer Seq Scan'], ans: ['seq scan', 'seq'], why: 'База прочитала 2,4 млн строк ради одной.' },
    { t: 'Создайте индекс без блокировки записи: psql -c "create index concurrently idx_orders_email on orders(email)"', sol: 'psql -c "create index concurrently idx_orders_email on orders(email)"', check: s => s.indexed },
    { t: 'Повторите explain analyze. Сколько миллисекунд теперь занимает запрос?', sol: ["psql -c \"explain analyze select * from orders where email='a@b.c'\"", 'answer 0.058'], ans: ['0.058', '0.058 ms', '0.058ms'] },
    { t: 'Снимите копию: pg_dump -Fc shop -f shop.dump', sol: 'pg_dump -Fc shop -f shop.dump', check: s => s.dumped },
    { t: 'Восстановите в новую базу: createdb shop_restore, затем pg_restore -d shop_restore shop.dump', sol: ['createdb shop_restore', 'pg_restore -d shop_restore shop.dump'], check: s => s.restored },
    { t: 'Проверьте копию: psql -d shop_restore -c "select count(*) from orders". Сколько строк?', sol: ['psql -d shop_restore -c "select count(*) from orders"', 'answer 2400000'], ans: ['2400000', '2 400 000'], why: 'Копия, которую ни разу не восстанавливали, — это не копия, а надежда.' }
  ]
}
};
// Задание с compose засчитывается после применения исправления
LABS2.lab_docker.tasks[7].check = s => /db:5432/.test(s.applied);
