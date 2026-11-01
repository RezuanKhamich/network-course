// Лаборатории этапа 3 и итогового проекта.
const LOG_GW = ['{"ts":"11:50:01","level":"INFO","service":"gateway","trace_id":"a1f3","path":"/api/orders","status":200,"ms":84}',
  '{"ts":"11:50:02","level":"INFO","service":"gateway","trace_id":"b7c2","path":"/api/cart","status":200,"ms":41}',
  '{"ts":"11:50:04","level":"ERROR","service":"gateway","trace_id":"c9d4","path":"/api/orders","status":500,"ms":3012}'].join('\n') + '\n';
const LOG_OR = ['{"ts":"11:50:01","level":"INFO","service":"orders","trace_id":"a1f3","msg":"order created","ms":62}',
  '{"ts":"11:50:01","level":"INFO","service":"orders","trace_id":"c9d4","msg":"order accepted"}',
  '{"ts":"11:50:04","level":"ERROR","service":"orders","trace_id":"c9d4","msg":"payment call failed","error":"read timeout","ms":3001}'].join('\n') + '\n';
const LOG_PAY = ['{"ts":"11:50:01","level":"INFO","service":"payments","trace_id":"a1f3","msg":"charged","ms":31}',
  '{"ts":"11:50:01","level":"WARN","service":"payments","trace_id":"c9d4","msg":"bank api slow","bank_ms":2980}'].join('\n') + '\n';

const PLAYBOOK = `- hosts: lab
  become: true
  tasks:
    - name: Установить nginx
      apt:
        name: nginx
        state: present

    - name: Положить конфиг
      copy:
        src: shop.conf
        dest: /etc/nginx/sites-enabled/shop.conf
      notify: reload nginx

    - name: Добавить строку в motd
      shell: echo "Managed by Ansible" >> /etc/motd

  handlers:
    - name: reload nginx
      service:
        name: nginx
        state: reloaded
`;

export const LABS3 = {
lab_prom: {
  title: 'Prometheus: метрики и алерты', host: 'mon-01',
  intro: 'Подключите Node Exporter, разберите метрики запросами PromQL и почините правило алерта. Команда promql — учебный клиент: он выполняет запрос так же, как вкладка Graph в веб-интерфейсе Prometheus.',
  cwd: '/etc/prometheus',
  state: { reloaded: false },
  fs: {
    '/etc/prometheus/prometheus.yml': 'global:\n  scrape_interval: 15s\n\nrule_files:\n  - alerts.yml\n\nscrape_configs:\n  - job_name: prometheus\n    static_configs:\n      - targets: ["localhost:9090"]\n',
    '/etc/prometheus/alerts.yml': 'groups:\n  - name: host\n    rules:\n      - alert: DiskAlmostFull\n        expr: node_filesystem_avail_bytes / node_filesystem_size_bytes < 0.10\n        for: 0m\n        labels:\n          severity: critical\n        annotations:\n          summary: "Диск {{ $labels.mountpoint }} на {{ $labels.instance }} заполнен более чем на 90%"\n'
  },
  cmds: [
    { re: /^curl -s (http:\/\/)?localhost:9100\/metrics( *\|.*)?$/, out: '# HELP node_load1 1m load average.\n# TYPE node_load1 gauge\nnode_load1 0.42\n# TYPE node_cpu_seconds_total counter\nnode_cpu_seconds_total{cpu="0",mode="idle"} 3.8e+06\nnode_memory_MemAvailable_bytes 2.3e+09\nnode_filesystem_avail_bytes{mountpoint="/"} 4.1e+09' },
    { re: /^promtool check config prometheus\.yml$/, when: (s, fs) => /9100/.test(fs['/etc/prometheus/prometheus.yml']), out: 'SUCCESS: prometheus.yml is valid prometheus config file syntax' },
    { re: /^promtool check config prometheus\.yml$/, out: 'SUCCESS: prometheus.yml is valid prometheus config file syntax\n(но job для node не настроен)' },
    { re: /^promtool check rules alerts\.yml$/, out: 'SUCCESS: 1 rules found' },
    { re: /^systemctl reload prometheus$/, out: '', set: (s, m, a) => { s.cfg = a.fs['/etc/prometheus/prometheus.yml']; s.rules = a.fs['/etc/prometheus/alerts.yml']; s.reloaded = true; } },
    { re: /^promql ['"]?up['"]?$/, out: s => 'up{job="prometheus",instance="localhost:9090"} 1' + (/9100/.test(s.cfg || '') ? '\nup{job="node",instance="localhost:9100"} 1' : '') },
    { re: /^promql ['"]?node_load1['"]?$/, out: s => /9100/.test(s.cfg || '') ? 'node_load1{instance="localhost:9100"} 0.42' : '(пусто: метрика ещё не собирается)' },
    { re: /^promql ['"]?100 ?- ?\(?avg\(rate\(node_cpu_seconds_total\{mode="idle"\}\[5m\]\)\) ?\* ?100\)?['"]?$/, out: '{} 37.5' },
    { re: /^promql ['"]?node_filesystem_avail_bytes ?\/ ?node_filesystem_size_bytes['"]?$/, out: '{mountpoint="/"} 0.052\n{mountpoint="/boot"} 0.74' },
    { re: /^promql ['"]?sum\(rate\(http_requests_total\{status=~"5\.\."\}\[5m\]\)\) ?\/ ?sum\(rate\(http_requests_total\[5m\]\)\)['"]?$/, out: '{} 0.0183' },
    { re: /^promql ['"]?ALERTS['"]?$/, out: s => /for: 5m/.test(s.rules || '') ? 'ALERTS{alertname="DiskAlmostFull",alertstate="firing",mountpoint="/"} 1' : 'ALERTS{alertname="DiskAlmostFull",alertstate="firing",mountpoint="/"} 1  # срабатывал 14 раз за час: всплески при архивации' }
  ],
  tasks: [
    { t: 'Посмотрите, что отдаёт Node Exporter: curl -s localhost:9100/metrics. Какой тип у метрики node_cpu_seconds_total?', sol: ['curl -s localhost:9100/metrics', 'answer counter'], ans: ['counter'], why: 'Counter только растёт. Сам по себе он бесполезен, поэтому к нему применяют rate().' },
    { t: 'promql up — сколько целей сейчас собирается?', sol: ['promql up', 'answer 1'], ans: ['1'] },
    { t: 'Добавьте цель Node Exporter в prometheus.yml через nano: новый job_name: node с target localhost:9100, по образцу уже существующего job.', sol: `sed -i 's/^scrape_configs:$/scrape_configs:\\n  - job_name: node\\n    static_configs:\\n      - targets: ["localhost:9100"]/' prometheus.yml`, hint: 'Откройте nano prometheus.yml и добавьте в scrape_configs:  - job_name: node / static_configs: / - targets: ["localhost:9100"]', check: (s, fs) => /localhost:9100/.test(fs['/etc/prometheus/prometheus.yml']) },
    { t: 'Проверьте и примените: promtool check config prometheus.yml, затем systemctl reload prometheus', sol: ['promtool check config prometheus.yml', 'systemctl reload prometheus'], check: s => /9100/.test(s.cfg || '') },
    { t: 'promql node_load1 — какое значение?', sol: ['promql node_load1', 'answer 0.42'], ans: ['0.42'] },
    { t: 'Загрузка CPU: promql \'100 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100\'. Сколько процентов?', sol: ['promql \'100 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100\'', 'answer 37.5'], ans: ['37.5', '37.5%'] },
    { t: 'Доля свободного места: promql \'node_filesystem_avail_bytes / node_filesystem_size_bytes\'. Какая файловая система близка к заполнению?', sol: ["promql 'node_filesystem_avail_bytes / node_filesystem_size_bytes'", 'answer /'], ans: ['/'] },
    { t: 'promql ALERTS: алерт «дребезжит» из-за for: 0m. Измените в alerts.yml на for: 5m.', sol: "sed -i 's/for: 0m/for: 5m/' alerts.yml", check: (s, fs) => /for: 5m/.test(fs['/etc/prometheus/alerts.yml']), why: 'for — условие должно держаться заданное время. Это отсекает короткие всплески и спасает дежурного от шума.' },
    { t: 'Проверьте правила и примените: promtool check rules alerts.yml, systemctl reload prometheus', sol: ['promtool check rules alerts.yml', 'systemctl reload prometheus'], check: s => /for: 5m/.test(s.rules || '') },
    { t: 'RED-метрика: promql \'sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))\'. Сколько процентов ошибок?', sol: ['promql \'sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))\'', 'answer 1.83'], ans: ['1.83', '1.83%', '0.0183'] }
  ]
},
lab_logs: {
  title: 'Найти запрос по trace_id', host: 'log-01',
  intro: 'Пользователь пожаловался на ошибку 500 при заказе. Логи трёх сервисов собраны централизованно. Пройдите по цепочке и найдите первопричину. logcli — клиент Loki, ему передают запрос на языке LogQL.',
  cwd: '/var/log/apps',
  dirs: ['/var/log/apps'],
  fs: { '/var/log/apps/gateway.log': LOG_GW, '/var/log/apps/orders.log': LOG_OR, '/var/log/apps/payments.log': LOG_PAY },
  cmds: [
    { re: /^logcli query ['"]?\{app="shop"\} \|= "c9d4"['"]?$/, out: 'gateway  ERROR path=/api/orders status=500 ms=3012 trace_id=c9d4\norders   INFO  order accepted trace_id=c9d4\norders   ERROR payment call failed error="read timeout" ms=3001 trace_id=c9d4\npayments WARN  bank api slow bank_ms=2980 trace_id=c9d4' },
    { re: /^logcli query ['"]?\{app="shop"\} \| json \| level="ERROR"['"]?$/, out: 'gateway ERROR status=500 trace_id=c9d4\norders  ERROR payment call failed trace_id=c9d4' },
    { re: /^logcli query ['"]?sum by \(service\) \(count_over_time\(\{app="shop"\} \| json \| level="ERROR" \[5m\]\)\)['"]?$/, out: '{service="gateway"} 1\n{service="orders"} 1' }
  ],
  tasks: [
    { t: 'Найдите в логе шлюза запись с ошибкой: grep ERROR gateway.log. Какой trace_id?', sol: ['grep ERROR gateway.log', 'answer c9d4'], ans: ['c9d4'] },
    { t: 'Пройдите по всем сервисам: grep c9d4 *.log — в лаборатории: grep -r c9d4 /var/log/apps', sol: 'grep -r c9d4 /var/log/apps', ok: /grep -\w*r\w* c9d4/, why: 'Один идентификатор связывает записи разных сервисов в одну историю.' },
    { t: 'То же через Loki: logcli query \'{app="shop"} |= "c9d4"\'', sol: 'logcli query \'{app="shop"} |= "c9d4"\'', ok: /^logcli query/ },
    { t: 'Какой сервис первым заметил проблему (самая ранняя запись уровня WARN или ERROR)?', sol: 'answer payments', ans: ['payments'] },
    { t: 'Сколько миллисекунд отвечал банк (bank_ms)?', sol: 'answer 2980', ans: ['2980'] },
    { t: 'Почему gateway вернул 500? Ответьте кратко: timeout или database', sol: 'answer timeout', ans: ['timeout', 'read timeout'], why: 'Цепочка: банк медленный (2980 мс) → у orders таймаут 3000 мс → gateway отдаёт 500. Виден не «сломанный gateway», а первопричина далеко за ним.' },
    { t: 'Сколько в orders.log всего записей уровня INFO? grep -c INFO orders.log', sol: ['grep -c INFO orders.log', 'answer 2'], ans: ['2'] }
  ]
},
lab_ansible: {
  title: 'Ansible: идемпотентность', host: 'ctl-01',
  intro: 'Плейбук настраивает сервер, но при каждом запуске что-то меняет. Сделайте так, чтобы второй запуск показывал changed=0.',
  cwd: '/home/student/infra',
  state: { runs: 0 },
  fs: {
    '/home/student/infra/inventory.ini': '[lab]\ntest-vps-1 ansible_host=10.0.1.50 ansible_user=deploy\n',
    '/home/student/infra/playbook.yml': PLAYBOOK,
    '/home/student/infra/shop.conf': 'server { listen 80; }\n',
    '/home/student/infra/backup.sh': '#!/bin/bash\nset -euo pipefail\nDIR=/var/backups/pg\nmkdir -p "$DIR"\nFILE="$DIR/shop-$(date +%F).dump"\npg_dump -Fc shop -f "$FILE"\ntest -s "$FILE" || { echo "Пустая копия"; exit 1; }\nfind "$DIR" -name "*.dump" -mtime +7 -delete\necho "OK $FILE"\n'
  },
  cmds: [
    { re: /^ansible -i inventory\.ini lab -m ping$/, out: 'test-vps-1 | SUCCESS => {\n    "changed": false,\n    "ping": "pong"\n}' },
    { re: /^ansible-playbook -i inventory\.ini playbook\.yml --check( --diff)?$/, out: 'PLAY RECAP\ntest-vps-1 : ok=4 changed=2 unreachable=0 failed=0\n(режим --check: на сервере ничего не изменено)', set: s => { s.checked = true; } },
    { re: /^ansible-playbook -i inventory\.ini playbook\.yml$/, out: (s, m, a) => {
      s.runs++; const good = !/shell:/.test(a.fs['/home/student/infra/playbook.yml']);
      const changed = s.runs === 1 ? 3 : (good && s.goodRun ? 0 : 1);
      s.lastChanged = changed; if (good) s.goodRun = true;
      return `TASK [Установить nginx] ${s.runs === 1 ? 'changed' : 'ok'}\nTASK [Положить конфиг] ${s.runs === 1 ? 'changed' : 'ok'}\nTASK [Добавить строку в motd] ${changed ? 'changed' : 'ok'}\n\nPLAY RECAP\ntest-vps-1 : ok=4 changed=${changed} unreachable=0 failed=0`;
    } },
    { re: /^ssh test-vps-1 cat \/etc\/motd$/, out: s => Array(Math.max(1, s.runs)).fill('Managed by Ansible').join('\n') },
    { re: /^bash -n backup\.sh$/, out: '' , set: s => { s.syntax = true; } },
    { re: /^(\.\/backup\.sh|bash backup\.sh)$/, out: 'OK /var/backups/pg/shop-2026-11-01.dump' },
    { re: /^ansible-vault encrypt secrets\.yml$/, out: 'Encryption successful', set: (s, m, a) => { a.fs['/home/student/infra/secrets.yml'] = '$ANSIBLE_VAULT;1.1;AES256\n6236383936613237...\n'; s.vault = true; } }
  ],
  tasks: [
    { t: 'Проверьте связь: ansible -i inventory.ini lab -m ping', sol: 'ansible -i inventory.ini lab -m ping', ok: /-m ping$/ },
    { t: 'Прогон без изменений: ansible-playbook -i inventory.ini playbook.yml --check', sol: 'ansible-playbook -i inventory.ini playbook.yml --check', check: s => s.checked },
    { t: 'Запустите плейбук дважды. Чему равно changed во втором запуске?', sol: ['ansible-playbook -i inventory.ini playbook.yml', 'ansible-playbook -i inventory.ini playbook.yml', 'answer 1'], ans: ['1'] },
    { t: 'Посмотрите результат: ssh test-vps-1 cat /etc/motd. Сколько одинаковых строк?', sol: ['ssh test-vps-1 cat /etc/motd', 'answer 2'], ans: ['2'], why: 'Задача с shell и >> не идемпотентна: каждый запуск дописывает строку.' },
    { t: 'Замените shell на модуль lineinfile: строку задачи замените на  lineinfile: { path: /etc/motd, line: "Managed by Ansible" }', sol: `sed -i 's|shell: echo "Managed by Ansible" >> /etc/motd|lineinfile: { path: /etc/motd, line: "Managed by Ansible" }|' playbook.yml`, check: (s, fs) => /lineinfile/.test(fs['/home/student/infra/playbook.yml']) && !/shell:/.test(fs['/home/student/infra/playbook.yml']), why: 'Модуль сначала проверяет состояние и меняет его, только если оно отличается.' },
    { t: 'Запустите плейбук два раза и добейтесь changed=0.', sol: ['ansible-playbook -i inventory.ini playbook.yml', 'ansible-playbook -i inventory.ini playbook.yml'], check: s => s.goodRun && s.lastChanged === 0, why: 'changed=0 при повторе — главный признак правильной автоматизации.' },
    { t: 'Посмотрите скрипт: cat backup.sh. Какая опция bash останавливает его при первой ошибке? (буква после set -)', sol: ['cat backup.sh', 'answer e'], ans: ['e', '-e'] },
    { t: 'Проверьте синтаксис и запустите: bash -n backup.sh, затем ./backup.sh', sol: ['bash -n backup.sh', './backup.sh'], ok: /backup\.sh$/, check: null },
    { t: 'Секрет нельзя хранить в открытом виде. Создайте файл: echo "db_password: s3cret" > secrets.yml и зашифруйте: ansible-vault encrypt secrets.yml', sol: ['echo "db_password: s3cret" > secrets.yml', 'ansible-vault encrypt secrets.yml'], check: s => s.vault }
  ]
},
lab_incident: {
  title: 'Симуляция инцидента: падает оформление заказов', host: 'web-01',
  intro: 'Алерт: доля ошибок 5xx выше 20%. Вы дежурный. Сначала стабилизируйте, потом разбирайтесь. В конце соберите данные для постмортема.',
  state: { rolled: false },
  fs: {
    '/var/log/deploy.log': '2026-11-01 11:30 deploy shop-api 2.4.0 (user: ci)\n2026-11-01 11:31 deploy finished OK\n',
    '/var/log/shop/app.log': '11:30:40 INFO  Started ShopApplication\n11:31:12 ERROR GET /api/orders 500\norg.postgresql.util.PSQLException: ERROR: column "discount_code" does not exist\n11:31:13 ERROR GET /api/orders 500\norg.postgresql.util.PSQLException: ERROR: column "discount_code" does not exist\n'
  },
  cmds: [
    { re: /^promql ['"]?error_rate['"]?$/, out: s => s.rolled ? 'error_rate 0.002' : 'error_rate 0.23' },
    { re: /^systemctl status shop-api$/, out: s => `● shop-api.service\n     Active: active (running)\n     Version: ${s.rolled ? '2.3.9' : '2.4.0'}` },
    { re: /^df -h$/, out: '/dev/vda2  79G  31G  44G  42% /' },
    { re: /^free -h$/, out: 'Mem: 3.8Gi 1.9Gi 300Mi 24Mi 1.6Gi 1.8Gi' },
    { re: /^uptime$/, out: ' load average: 0.61, 0.58, 0.40' },
    { re: /^deploy-tool rollback shop-api$/, out: 'Откат на 2.3.9... OK', set: s => { s.rolled = true; } },
    { re: /^psql -c ['"]?\\d orders['"]?$/, out: ' id | email | total | status\n(колонки discount_code нет)' }
  ],
  tasks: [
    { t: 'Оцените масштаб: promql error_rate. Какая доля ошибок?', sol: ['promql error_rate', 'answer 0.23'], ans: ['0.23', '23', '23%'] },
    { t: 'Исключите ресурсы: df -h, free -h, uptime. Ресурсы в норме? (да/нет)', sol: ['df -h', 'free -h', 'uptime', 'answer да'], ans: ['да', 'yes'] },
    { t: 'Что менялось недавно? cat /var/log/deploy.log. Какая версия выкачена?', sol: ['cat /var/log/deploy.log', 'answer 2.4.0'], ans: ['2.4.0'], why: 'Большинство инцидентов связаны с изменением. «Что менялось?» — первый вопрос.' },
    { t: 'Смягчите влияние: deploy-tool rollback shop-api', sol: 'deploy-tool rollback shop-api', check: s => s.rolled, why: 'Сначала вернуть работу пользователям, потом искать причину. Откат не требует понимания бага.' },
    { t: 'Проверьте: promql error_rate. Ошибок стало меньше 1%? (да/нет)', sol: ['promql error_rate', 'answer да'], ans: ['да', 'yes'] },
    { t: 'Теперь причина: grep ERROR /var/log/shop/app.log и grep discount /var/log/shop/app.log. Какой колонки не хватило?', sol: ['grep discount /var/log/shop/app.log', 'answer discount_code'], ans: ['discount_code'] },
    { t: 'Подтвердите: psql -c "\\d orders". Первопричина: answer миграция или answer диск', sol: ['psql -c "\\d orders"', 'answer миграция'], ans: ['миграция'], why: 'Код 2.4.0 ждёт колонку, а миграция не была применена. В постмортем: пайплайн должен применять миграции до выкладки кода, а проверка /health должна проверять схему.' }
  ]
},
lab_restore: {
  title: 'Проверка восстановления: RTO и RPO', host: 'db-01',
  intro: 'Учебная база потеряна. Восстановите её из последней копии и посчитайте фактические RPO и RTO.',
  state: { db: false, restored: false },
  dirs: ['/var/backups/pg'],
  fs: { '/var/backups/pg/shop-2026-11-01-0300.dump': '(архив)\n', '/var/backups/pg/shop-2026-10-31-0300.dump': '(архив)\n', '/var/log/incident.txt': 'База потеряна в 11:00. Начало восстановления 11:10. Сервис снова работает в 11:35.\n' },
  cmds: [
    { re: /^ls -l \/var\/backups\/pg$/, out: '-rw-r----- 1 postgres postgres 412M Oct 31 03:00 shop-2026-10-31-0300.dump\n-rw-r----- 1 postgres postgres 415M Nov  1 03:00 shop-2026-11-01-0300.dump' },
    { re: /^pg_restore -l \/var\/backups\/pg\/\S+( *\|.*)?$/, out: ';     Archive created at 2026-11-01 03:00:02\n;     dbname: shop\n;     TOC Entries: 212' },
    { re: /^createdb shop$/, out: '', set: s => { s.db = true; } },
    { re: /^pg_restore -d shop \/var\/backups\/pg\/shop-2026-11-01-0300\.dump$/, when: s => s.db, out: '', set: s => { s.restored = true; } },
    { re: /^pg_restore .*$/, out: 'pg_restore: error: connection to database "shop" failed: database does not exist', fail: true },
    { re: /^psql -d shop -c ['"]?select max\(created_at\) from orders;?['"]?$/, when: s => s.restored, out: '        max\n---------------------\n 2026-11-01 02:59:48' }
  ],
  tasks: [
    { t: 'Посмотрите копии: ls -l /var/backups/pg', sol: 'ls -l /var/backups/pg', ok: /^ls -l \/var\/backups\/pg$/ },
    { t: 'Проверьте архив без восстановления: pg_restore -l /var/backups/pg/shop-2026-11-01-0300.dump', sol: 'pg_restore -l /var/backups/pg/shop-2026-11-01-0300.dump', ok: /^pg_restore -l/ },
    { t: 'Создайте базу и восстановите последнюю копию.', sol: ['createdb shop', 'pg_restore -d shop /var/backups/pg/shop-2026-11-01-0300.dump'], check: s => s.restored },
    { t: 'psql -d shop -c "select max(created_at) from orders". Прочитайте /var/log/incident.txt. За сколько часов потеряны данные (RPO, округлите до часов)?', sol: ['psql -d shop -c "select max(created_at) from orders"', 'cat /var/log/incident.txt', 'answer 8'], ans: ['8', '8 ч', '8ч'], why: 'Копия от 03:00, сбой в 11:00: заказы за 8 часов потеряны. Это и есть фактический RPO.' },
    { t: 'Сколько минут занял простой от сбоя до восстановления (RTO)?', sol: 'answer 35', ans: ['35'], why: 'От 11:00 до 11:35. Если бизнес хочет RPO 15 минут, ночного pg_dump недостаточно: нужно непрерывное архивирование WAL.' }
  ]
},
lab_final: {
  title: 'Итоговый проект: сборка стенда', host: 'prod-lab',
  intro: 'Соберите Production Reliability Lab: Nginx → приложение → PostgreSQL, мониторинг, логи, автоматизация, резервная копия.',
  cwd: '/home/student/reliability-lab',
  state: { up: false, play: 0 },
  fs: {
    '/home/student/reliability-lab/compose.yaml': 'services:\n  nginx:\n    image: nginx:1.27-alpine\n    ports: ["80:80"]\n    depends_on: [app]\n  app:\n    image: shop-app:1.0\n    environment:\n      DB_URL: jdbc:postgresql://db:5432/shop\n    depends_on:\n      db: { condition: service_healthy }\n    mem_limit: 512m\n    restart: unless-stopped\n  db:\n    image: postgres:17-alpine\n    volumes: [dbdata:/var/lib/postgresql/data]\n    healthcheck: { test: ["CMD-SHELL","pg_isready -U postgres"], interval: 5s }\n  prometheus:\n    image: prom/prometheus:v3.0.0\n    ports: ["9090:9090"]\n  node-exporter:\n    image: prom/node-exporter:v1.8.2\n  grafana:\n    image: grafana/grafana:11.3.0\n    ports: ["3000:3000"]\n  loki:\n    image: grafana/loki:3.3.0\n  promtail:\n    image: grafana/promtail:3.3.0\nvolumes:\n  dbdata:\n'
  },
  cmds: [
    { re: /^ansible-playbook -i inventory\.ini site\.yml$/, out: s => { s.play++; return `PLAY RECAP\nlab : ok=9 changed=${s.play === 1 ? 7 : 0} failed=0`; } },
    { re: /^docker compose up -d$/, out: ' ✔ 8 контейнеров запущено', set: s => { s.up = true; } },
    { re: /^docker compose ps$/, out: 'nginx Up | app Up | db Up (healthy) | prometheus Up | node-exporter Up | grafana Up | loki Up | promtail Up' },
    { re: /^curl -s (http:\/\/)?localhost\/api\/health$/, when: s => s.up, out: '{"status":"UP"}' },
    { re: /^promql ['"]?up['"]?$/, when: s => s.up, out: 'up{job="app"} 1\nup{job="node"} 1\nup{job="nginx"} 1\nup{job="prometheus"} 1' },
    { re: /^logcli query ['"]?\{service="app"\}['"]?$/, when: s => s.up, out: 'app INFO Started ShopApplication trace_id=-' },
    { re: /^grafana-import dashboards\/node\.json$/, out: 'Дашборд «Сервер и приложение» импортирован.', set: s => { s.dash = true; } },
    { re: /^docker compose exec db pg_dump -U postgres -Fc shop -f \/backup\/shop\.dump$/, out: '', set: s => { s.bak = true; } },
    { re: /^docker compose exec db createdb -U postgres shop_check$/, out: '', set: s => { s.chk = true; } },
    { re: /^docker compose exec db pg_restore -U postgres -d shop_check \/backup\/shop\.dump$/, when: s => s.chk && s.bak, out: '', set: s => { s.rest = true; } }
  ],
  tasks: [
    { t: 'Посмотрите архитектуру: cat compose.yaml. Сколько сервисов описано?', sol: ['cat compose.yaml', 'answer 8'], ans: ['8'] },
    { t: 'Подготовьте сервер: ansible-playbook -i inventory.ini site.yml дважды. Второй запуск должен дать changed=0.', sol: ['ansible-playbook -i inventory.ini site.yml', 'ansible-playbook -i inventory.ini site.yml'], check: s => s.play >= 2 },
    { t: 'Поднимите стенд: docker compose up -d', sol: 'docker compose up -d', check: s => s.up },
    { t: 'Проверьте весь путь запроса: curl -s localhost/api/health', sol: 'curl -s localhost/api/health', ok: /api\/health$/ },
    { t: 'Проверьте мониторинг: promql up. Сколько целей активно?', sol: ['promql up', 'answer 4'], ans: ['4'] },
    { t: 'Импортируйте дашборд: grafana-import dashboards/node.json', sol: 'grafana-import dashboards/node.json', check: s => s.dash },
    { t: 'Проверьте логи: logcli query \'{service="app"}\'', sol: 'logcli query \'{service="app"}\'', ok: /^logcli query/ },
    { t: 'Снимите копию: docker compose exec db pg_dump -U postgres -Fc shop -f /backup/shop.dump', sol: 'docker compose exec db pg_dump -U postgres -Fc shop -f /backup/shop.dump', check: s => s.bak },
    { t: 'Проверьте восстановление в отдельную базу: createdb и pg_restore через docker compose exec db.', sol: ['docker compose exec db createdb -U postgres shop_check', 'docker compose exec db pg_restore -U postgres -d shop_check /backup/shop.dump'], check: s => s.rest, why: 'Стенд собран. Теперь самое важное: ломаем его и расследуем.' }
  ]
},
lab_final2: {
  title: 'Итоговый проект: три неисправности', host: 'prod-lab',
  intro: 'Стенд сломан тремя разными способами. Для каждого симптома найдите слой и причину. Опирайтесь на метрики и логи, а не на догадки.',
  cwd: '/home/student/reliability-lab',
  state: { a: false, b: false, c: false },
  cmds: [
    { re: /^curl -sI (http:\/\/)?localhost\/api\/orders$/, out: s => !s.a ? 'HTTP/1.1 502 Bad Gateway' : !s.b ? 'HTTP/1.1 504 Gateway Time-out' : !s.c ? 'HTTP/1.1 500 Internal Server Error' : 'HTTP/1.1 200 OK' },
    { re: /^docker compose ps$/, out: s => !s.a ? 'nginx Up | app Exited (137) | db Up (healthy)' : 'nginx Up | app Up | db Up (healthy)' },
    { re: /^docker inspect app --format .*OOMKilled.*$/, out: s => s.a ? 'false' : 'true' },
    { re: /^docker stats --no-stream$/, out: 'app 380MiB / 1GiB\ndb 90MiB / 3.8GiB' },
    { re: /^sed-limit$/, out: '' },
    { re: /^docker compose up -d app$/, out: (s, m, a) => { if (/mem_limit: 1g/.test(a.fs['/home/student/reliability-lab/compose.yaml'])) s.a = true; return s.a ? ' ✔ Container app Started' : ' ✔ Container app Started (вскоре снова убит: лимит прежний)'; } },
    { re: /^docker compose exec db psql -U postgres -c ['"]?select pid, state, query from pg_stat_activity where wait_event_type ?= ?'lock';?['"]?$/, out: s => s.b ? '(0 rows)' : ' 412 | active | UPDATE orders ... (ждёт)\n 418 | active | UPDATE orders ... (ждёт)' },
    { re: /^docker compose exec db psql -U postgres -c ['"]?select pid, state from pg_stat_activity where state ?= ?'idle in transaction';?['"]?$/, out: s => s.b ? '(0 rows)' : ' 399 | idle in transaction' },
    { re: /^docker compose exec db psql -U postgres -c ['"]?select pg_terminate_backend\(399\);?['"]?$/, out: ' t', set: s => { s.b = true; } },
    { re: /^docker compose logs( --tail[= ]\d+)? app$/, out: s => !s.a ? 'app | (последняя запись) GC overhead… контейнер убит' : !s.b ? 'app | HikariPool: Connection is not available (active=10, waiting=52)' : 'app | ERROR password authentication failed for user "shop"' },
    { re: /^cat \.env$/, out: 'DB_PASSWORD=old-password' },
    { re: /^rotate-db-password --sync-env$/, out: 'Пароль синхронизирован: .env и роль shop совпадают.', set: s => { s.c = s.b; } }
  ],
  fs: { '/home/student/reliability-lab/compose.yaml': 'services:\n  app:\n    image: shop-app:1.0\n    mem_limit: 256m\n    environment:\n      JAVA_OPTS: "-XX:MaxRAMPercentage=75"\n' },
  tasks: [
    { t: 'Симптом 1. curl -sI localhost/api/orders. Какой код?', sol: ['curl -sI localhost/api/orders', 'answer 502'], ans: ['502'] },
    { t: 'docker compose ps: код выхода app? Код 137 = 128 + 9, то есть SIGKILL.', sol: ['docker compose ps', 'answer 137'], ans: ['137'] },
    { t: "docker inspect app --format '{{.State.OOMKilled}}'. Причина: память контейнера. Поднимите лимит в compose.yaml до 1g и выполните docker compose up -d app.", sol: ["docker inspect app --format '{{.State.OOMKilled}}'", "sed -i 's/mem_limit: 256m/mem_limit: 1g/' compose.yaml", 'docker compose up -d app'], check: s => s.a },
    { t: 'Симптом 2. Снова curl -sI localhost/api/orders. Какой код теперь?', sol: ['curl -sI localhost/api/orders', 'answer 504'], ans: ['504'], why: 'Код изменился: первую проблему вы решили и обнаружили следующую.' },
    { t: 'docker compose logs app: что закончилось? (пул или диск)', sol: ['docker compose logs app', 'answer пул'], ans: ['пул', 'pool', 'hikari'] },
    { t: 'Найдите блокировщика: docker compose exec db psql -U postgres -c "select pid, state from pg_stat_activity where state=\'idle in transaction\'" и завершите его через pg_terminate_backend.', sol: ["docker compose exec db psql -U postgres -c \"select pid, state from pg_stat_activity where state='idle in transaction'\"", 'docker compose exec db psql -U postgres -c "select pg_terminate_backend(399)"'], check: s => s.b },
    { t: 'Симптом 3. curl -sI, потом docker compose logs app. Что не прошло? (пароль или сеть)', sol: ['curl -sI localhost/api/orders', 'docker compose logs app', 'answer пароль'], ans: ['пароль', 'password'] },
    { t: 'Выровняйте секрет: rotate-db-password --sync-env и проверьте curl -sI localhost/api/orders', sol: ['rotate-db-password --sync-env', 'curl -sI localhost/api/orders'], check: s => s.c, why: 'Все три причины на разных слоях: контейнер, база, конфигурация. Коды 502, 504 и 500 сразу подсказывали, куда смотреть.' }
  ]
}
};
// Задание со скриптом засчитывается, когда запуск прошёл синтаксическую проверку
LABS3.lab_ansible.tasks[7].check = null;
LABS3.lab_ansible.tasks[7].ok = /^(\.\/backup\.sh|bash backup\.sh)$/;
