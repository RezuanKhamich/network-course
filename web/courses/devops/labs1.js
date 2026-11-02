// Лаборатории этапа 1: Linux и сети.
export const LABS1 = {
lab_intro: {
  title: 'Первые шаги в терминале', host: 'lab-00',
  intro: 'Учебный сервер прямо в странице. Ничего не сломается: кнопка «Сначала» всегда вернёт исходное состояние.',
  fs: {
    '/home/student/notes.txt': 'день 1: понять архитектуру linux\nдень 2: процессы\nдень 3: сигналы\nошибка: перепутал kill и killall\nдень 4: systemd\nошибка: забыл daemon-reload\n',
    '/home/student/readme.md': 'Это домашний каталог учебного пользователя.\n'
  },
  tasks: [
    { t: 'Узнайте, в каком каталоге вы находитесь (pwd).', sol: 'pwd', ok: /^pwd$/ },
    { t: 'Посмотрите, какие файлы лежат рядом (ls).', sol: 'ls', ok: /^ls( -\w+)?$/ },
    { t: 'Прочитайте файл notes.txt целиком.', sol: 'cat notes.txt', ok: /^cat (\.\/)?notes\.txt$/ },
    { t: 'Оставьте только строки со словом «ошибка» с помощью grep.', sol: 'grep ошибка notes.txt', ok: /grep .*ошибка/, why: 'grep — главный инструмент расследования: из тысячи строк лога он оставляет нужные.' },
    { t: 'Посчитайте эти строки конвейером: вывод grep передайте в wc -l.', sol: 'grep ошибка notes.txt | wc -l', ok: /grep .*ошибка.*\| *wc -l/, why: 'Конвейер | передаёт вывод одной команды на вход другой.' },
    { t: 'Ответьте командой answer: сколько строк с ошибками в файле?', sol: 'answer 2', ans: ['2'] }
  ]
},
lab_firstday: {
  title: 'Первый день: паспорт сервера', host: 'web-01',
  intro: 'Вы впервые зашли на незнакомый сервер. Соберите о нём главное за пять минут.',
  cmds: [
    { re: /^uname -a$/, out: 'Linux web-01 6.8.0-45-generic #45-Ubuntu SMP PREEMPT_DYNAMIC x86_64 x86_64 x86_64 GNU/Linux' },
    { re: /^uname -r$/, out: '6.8.0-45-generic' },
    { re: /^cat \/etc\/os-release$/, out: 'PRETTY_NAME="Ubuntu 24.04.1 LTS"\nNAME="Ubuntu"\nVERSION_ID="24.04"\nVERSION_CODENAME=noble\nID=ubuntu' },
    { re: /^uptime$/, out: ' 12:00:00 up 41 days,  3:12,  1 user,  load average: 0.42, 0.38, 0.35' },
    { re: /^free -h$/, out: '               total        used        free      shared  buff/cache   available\nMem:           3.8Gi       1.6Gi       310Mi        24Mi       2.1Gi       2.2Gi\nSwap:          2.0Gi          0B       2.0Gi' },
    { re: /^lsblk$/, out: 'NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS\nvda    252:0    0   80G  0 disk\n├─vda1 252:1    0    1G  0 part /boot\n└─vda2 252:2    0   79G  0 part /\nvdb    252:16   0  200G  0 disk /var/lib/postgresql' },
    { re: /^nproc$/, out: '2' },
    { re: /^systemctl list-units --type=service( --state=running)?( --no-pager)?$/, out: '  UNIT                 LOAD   ACTIVE SUB     DESCRIPTION\n  cron.service         loaded active running Regular background program processing\n  nginx.service        loaded active running A high performance web server\n  postgresql.service   loaded active exited  PostgreSQL RDBMS\n  shop-api.service     loaded active running Shop API (Kotlin)\n  ssh.service          loaded active running OpenBSD Secure Shell server\n  systemd-journald.service loaded active running Journal Service\n\n6 loaded units listed.' }
  ],
  tasks: [
    { t: 'Выполните uname -a. Какая версия ядра? Ответьте через answer.', sol: ['uname -a', 'answer 6.8.0-45-generic'], ans: ['6.8.0-45-generic', '6.8.0-45', '6.8', '6.8.0'], why: 'Ядро важно для совместимости драйверов и известных ошибок.' },
    { t: 'cat /etc/os-release: какой дистрибутив и версия? Ответьте, например: ubuntu 24.04', sol: ['cat /etc/os-release', 'answer ubuntu 24.04'], ans: ['ubuntu 24.04', 'ubuntu 24.04.1', '24.04'], why: 'От дистрибутива зависят пакетный менеджер и пути к конфигам.' },
    { t: 'uptime: сколько дней сервер работает без перезагрузки?', sol: ['uptime', 'answer 41'], ans: ['41'], why: 'Маленький uptime без плановых работ — повод спросить, почему сервер перезагрузился.' },
    { t: 'free -h: сколько памяти реально доступно приложениям (колонка available)?', sol: ['free -h', 'answer 2.2Gi'], ans: ['2.2gi', '2.2', '2.2 gi', '2.2g', '2.2гб'], why: 'free маленький (310 МБ), но это норма: большая часть занята кэшем, который ядро отдаст по первому требованию. Смотреть надо на available.' },
    { t: 'lsblk: на каком диске лежат данные PostgreSQL (vda или vdb)?', sol: ['lsblk', 'answer vdb'], ans: ['vdb'], why: 'База на отдельном диске — её заполнение не положит корневую файловую систему.' },
    { t: 'systemctl list-units --type=service: как называется служба backend-приложения?', sol: ['systemctl list-units --type=service', 'answer shop-api'], ans: ['shop-api', 'shop-api.service'], why: 'Теперь вы знаете, что здесь работает: nginx → shop-api → PostgreSQL.' }
  ]
},
lab_perms: {
  title: 'Права доступа: Permission denied', host: 'web-01',
  intro: 'Коллега оставил скрипт деплоя, но он не запускается. Разберитесь с пользователями и правами.',
  state: { x: false, ownerFixed: false },
  cwd: '/opt/app',
  dirs: ['/opt', '/opt/app'],
  fs: {
    '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nsshd:x:110:65534::/run/sshd:/usr/sbin/nologin\nstudent:x:1000:1000:Student:/home/student:/bin/bash\nshop:x:998:998:Shop API:/opt/app:/usr/sbin/nologin\n',
    '/etc/group': 'root:x:0:\nsudo:x:27:student\nwww-data:x:33:\nshop:x:998:student\n',
    '/opt/app/deploy.sh': '#!/bin/bash\necho "Deploy OK"\n',
    '/opt/app/app.env': 'DB_PASSWORD=secret\n'
  },
  cmds: [
    { re: /^id$/, out: 'uid=1000(student) gid=1000(student) groups=1000(student),27(sudo),998(shop)' },
    { re: /^groups$/, out: 'student sudo shop' },
    { re: /^ls -l(a)?$/, out: s => `total 8\n-rw${s.x ? 'x' : '-'}r-${s.x ? 'x' : '-'}r-${s.x ? 'x' : '-'} 1 student shop   30 Nov  1 11:00 deploy.sh\n-rw-${s.ownerFixed ? 'r-----' : 'r--r--'} 1 shop    shop   19 Nov  1 11:00 app.env` },
    { re: /^stat deploy\.sh$/, out: s => `  File: deploy.sh\nAccess: (${s.x ? '0755/-rwxr-xr-x' : '0644/-rw-r--r--'})  Uid: ( 1000/ student)   Gid: (  998/ shop)` },
    { re: /^\.\/deploy\.sh$/, when: s => !s.x, out: 'bash: ./deploy.sh: Permission denied', fail: true },
    { re: /^\.\/deploy\.sh$/, out: 'Deploy OK', set: s => { s.ran = true; } },
    { re: /^chmod (\+x|u\+x|a\+x|755|750|775|744) deploy\.sh$/, out: '', set: s => { s.x = true; } },
    { re: /^chmod (640|o-r|o-rwx|750) app\.env$/, out: '', set: s => { s.ownerFixed = true; } }
  ],
  tasks: [
    { t: 'Посмотрите в /etc/passwd через grep: какая оболочка у пользователя shop?', sol: ['grep shop /etc/passwd', 'answer /usr/sbin/nologin'], ans: ['/usr/sbin/nologin', 'nologin'], why: 'nologin означает, что это служебная учётная запись: под ней запускают приложение, но войти по SSH нельзя.' },
    { t: 'Выполните id. В какие группы вы входите? Назовите группу с gid 998.', sol: ['id', 'answer shop'], ans: ['shop'] },
    { t: 'Посмотрите права файлов: ls -l', sol: 'ls -l', ok: /^ls -la?$/ },
    { t: 'Попробуйте запустить ./deploy.sh и увидьте ошибку.', sol: './deploy.sh', ok: /^\.\/deploy\.sh$/ },
    { t: 'Дайте файлу право на выполнение через chmod +x.', sol: 'chmod +x deploy.sh', check: s => s.x, why: 'Без бита x файл нельзя запустить как программу, даже если он читается.' },
    { t: 'Запустите скрипт ещё раз.', sol: './deploy.sh', check: s => s.ran },
    { t: 'В app.env лежит пароль, и его может читать кто угодно (r-- для others). Закройте: chmod 640 app.env', sol: 'chmod 640 app.env', check: s => s.ownerFixed, why: '640: владелец читает и пишет, группа читает, остальные не имеют доступа. Так и должны храниться секреты.' }
  ]
},
lab_proc: {
  title: 'Процессы и сигналы', host: 'web-01',
  intro: 'Сервер жив, но подозрительный скрипт копирует файлы и не даёт работать. Найдите его и корректно остановите.',
  state: { backup: 'run', term: false },
  cmds: [
    { re: /^ps aux$/, out: s => `USER       PID %CPU %MEM    VSZ   RSS TTY  STAT START   TIME COMMAND\nroot         1  0.0  0.3 168000 12000 ?   Ss   Sep21   0:32 /sbin/init\nroot       512  0.0  0.1  15420  5600 ?   Ss   Sep21   0:00 sshd: /usr/sbin/sshd -D\nroot       840  0.0  0.1  55200  3200 ?   Ss   Sep21   0:00 nginx: master process /usr/sbin/nginx\nwww-data   841  0.1  0.3  55800 12800 ?   S    Sep21   9:11 nginx: worker process\nshop      1204  6.2 28.0 3890000 1120000 ? Sl  Sep21 610:03 java -Xmx2g -jar /opt/app/shop-api.jar\n${s.backup === 'run' ? 'student   4471 97.0  0.2  12000  8000 ?   R    11:40  19:44 /bin/bash /home/student/old-backup.sh\n' : ''}student   4602  0.0  0.1  10000  3400 pts/0 Ss 11:58   0:00 -bash` },
    { re: /^pstree( -p)?$/, out: s => `systemd(1)─┬─sshd(512)───sshd(4600)───bash(4602)\n           ├─nginx(840)───nginx(841)\n           ├─java(1204)─┬─{java}(1205)\n           │            └─{java}(1206)\n           ${s.backup === 'run' ? '└─old-backup.sh(4471)' : '└─cron(301)'}` },
    { re: /^cat \/proc\/4471\/status$/, when: s => s.backup === 'run', out: 'Name:\told-backup.sh\nState:\tR (running)\nPid:\t4471\nPPid:\t1\nThreads:\t1' },
    { re: /^kill (-15 |-TERM |-SIGTERM )?4471$/, when: s => s.backup === 'run', out: '', set: s => { s.backup = 'stop'; s.term = true; } },
    { re: /^kill -(9|KILL|SIGKILL) 4471$/, when: s => s.backup === 'run', out: '', set: s => { s.backup = 'stop'; s.killed = true; } },
    { re: /^kill .*4471$/, out: 'bash: kill: (4471) - No such process', fail: true },
    { re: /^kill -(HUP|1) 840$/, out: '', set: s => { s.hup = true; } }
  ],
  tasks: [
    { t: 'Выполните ps aux. Какой PID у процесса, который ест 97% CPU?', sol: ['ps aux', 'answer 4471'], ans: ['4471'] },
    { t: 'Отфильтруйте вывод: ps aux | grep backup', sol: 'ps aux | grep backup', ok: /ps aux *\| *grep/ },
    { t: 'Посмотрите дерево процессов pstree -p. Какой PID у родителя всех процессов?', sol: ['pstree -p', 'answer 1'], ans: ['1'], why: 'PID 1 — systemd. Осиротевшие процессы «усыновляет» именно он.' },
    { t: 'Откройте /proc/4471/status. Чему равен PPid?', sol: ['cat /proc/4471/status', 'answer 1'], ans: ['1'], why: 'Родитель скрипта умер, поэтому PPid=1. Каталог /proc — это окно в ядро: процесс описан в нём обычными файлами.' },
    { t: 'Остановите процесс вежливо: сигналом SIGTERM (обычный kill).', sol: 'kill 4471', check: s => s.backup === 'stop', why: 'Сначала SIGTERM: процесс может закрыть файлы и соединения. SIGKILL (-9) — только если он не реагирует.' },
    { t: 'Проверьте, что процесса больше нет: ps aux | grep backup — ответ answer нет', sol: ['ps aux | grep backup', 'answer нет'], ans: ['нет', 'no'] },
    { t: 'Попросите nginx перечитать конфиг сигналом HUP: kill -HUP 840', sol: 'kill -HUP 840', check: s => s.hup, why: 'Сигнал — не только «умри». SIGHUP у nginx означает «перечитай конфиг без разрыва соединений».' }
  ]
},
lab_unit: {
  title: 'Служба не запускается', host: 'web-01',
  intro: 'После обновления перестал стартовать shop-api. Найдите причину в журнале, исправьте unit-файл, запустите службу и включите автозапуск.',
  state: { reload: false, active: false, enabled: false },
  fs: {
    '/etc/systemd/system/shop-api.service': '[Unit]\nDescription=Shop API (Kotlin)\nAfter=network.target postgresql.service\n\n[Service]\nUser=shop\nWorkingDirectory=/opt/app\nExecStart=/usr/bin/java -Xmx2g -jar /opt/app/shop-api-1.8.jar\nRestart=on-failure\nRestartSec=5\n\n[Install]\nWantedBy=multi-user.target\n',
    '/opt/app/shop-api-1.9.jar': '(jar)\n'
  },
  cmds: [
    { re: /^systemctl status shop-api(\.service)?( --no-pager)?$/, when: s => !s.active, out: '× shop-api.service - Shop API (Kotlin)\n     Loaded: loaded (/etc/systemd/system/shop-api.service; disabled)\n     Active: failed (Result: exit-code) since Sun 2026-11-01 11:52:03 UTC\n    Process: 5120 ExecStart=/usr/bin/java -Xmx2g -jar /opt/app/shop-api-1.8.jar (code=exited, status=1/FAILURE)\n   Main PID: 5120 (code=exited, status=1/FAILURE)' },
    { re: /^systemctl status shop-api(\.service)?( --no-pager)?$/, out: s => `● shop-api.service - Shop API (Kotlin)\n     Loaded: loaded (/etc/systemd/system/shop-api.service; ${s.enabled ? 'enabled' : 'disabled'})\n     Active: active (running) since Sun 2026-11-01 12:01:12 UTC\n   Main PID: 5301 (java)` },
    { re: /^journalctl -u shop-api(\.service)?( -n \d+| --no-pager| -e| -f| --since .*)*$/, out: 'Nov 01 11:52:02 web-01 systemd[1]: Started Shop API (Kotlin).\nNov 01 11:52:03 web-01 java[5120]: Error: Unable to access jarfile /opt/app/shop-api-1.8.jar\nNov 01 11:52:03 web-01 systemd[1]: shop-api.service: Main process exited, code=exited, status=1/FAILURE\nNov 01 11:52:03 web-01 systemd[1]: shop-api.service: Failed with result \'exit-code\'.' },
    { re: /^systemctl cat shop-api(\.service)?$/, out: (s, m, a) => a.fs['/etc/systemd/system/shop-api.service'] },
    { re: /^systemctl daemon-reload$/, out: '', set: s => { s.reload = true; } },
    { re: /^systemctl (re)?start shop-api(\.service)?$/, when: (s, fs) => /shop-api-1\.9\.jar/.test(fs['/etc/systemd/system/shop-api.service']) && s.reload, out: '', set: s => { s.active = true; } },
    { re: /^systemctl (re)?start shop-api(\.service)?$/, when: (s, fs) => /shop-api-1\.9\.jar/.test(fs['/etc/systemd/system/shop-api.service']), out: 'Warning: The unit file changed on disk. Run \'systemctl daemon-reload\' to reload units.\nЗапустилась старая версия описания, служба снова упала.', fail: true },
    { re: /^systemctl (re)?start shop-api(\.service)?$/, out: 'Job for shop-api.service failed because the control process exited with error code.\nSee "systemctl status shop-api.service" and "journalctl -xeu shop-api.service" for details.', fail: true },
    { re: /^systemctl enable shop-api(\.service)?$/, out: 'Created symlink /etc/systemd/system/multi-user.target.wants/shop-api.service → /etc/systemd/system/shop-api.service.', set: s => { s.enabled = true; } },
    { re: /^systemctl is-enabled shop-api(\.service)?$/, out: s => s.enabled ? 'enabled' : 'disabled' }
  ],
  tasks: [
    { t: 'Посмотрите состояние: systemctl status shop-api', sol: 'systemctl status shop-api', ok: /^systemctl status shop-api/ },
    { t: 'Прочитайте журнал: journalctl -u shop-api -n 20. Какого файла не хватает? Ответьте именем файла.', sol: ['journalctl -u shop-api -n 20', 'answer shop-api-1.8.jar'], ans: ['shop-api-1.8.jar', '/opt/app/shop-api-1.8.jar'], why: 'status показывает, что упало. Журнал показывает, почему.' },
    { t: 'Посмотрите, какие jar-файлы есть: ls /opt/app. Какая версия лежит на диске?', sol: ['ls /opt/app', 'answer 1.9'], ans: ['1.9', 'shop-api-1.9.jar'] },
    { t: 'Исправьте путь в unit-файле (nano или sed).', sol: "sed -i 's/shop-api-1.8.jar/shop-api-1.9.jar/' /etc/systemd/system/shop-api.service", check: (s, fs) => /shop-api-1\.9\.jar/.test(fs['/etc/systemd/system/shop-api.service']) },
    { t: 'Сообщите systemd об изменении файла.', sol: 'systemctl daemon-reload', check: s => s.reload, why: 'systemd держит описания в памяти. Без daemon-reload правка не применяется.' },
    { t: 'Запустите службу.', sol: 'systemctl start shop-api', check: s => s.active },
    { t: 'Служба была disabled: после перезагрузки она не поднимется. Включите автозапуск.', sol: 'systemctl enable shop-api', check: s => s.enabled, why: 'start — запустить сейчас, enable — запускать при загрузке. Это разные действия.' }
  ]
},
lab_disk: {
  title: 'Диск заполнен: No space left on device', host: 'web-01',
  intro: 'Приложение пишет в лог «No space left on device». Найдите, что заняло место, и освободите его без вреда для работы.',
  state: { cleared: false, rotated: false },
  cmds: [
    { re: /^df -h$/, out: s => `Filesystem      Size  Used Avail Use% Mounted on\n/dev/vda2        79G  ${s.cleared ? '31G   44G  42%' : '75G     0 100%'} /\n/dev/vda1       974M  180M  727M  20% /boot\n/dev/vdb        197G   52G  135G  28% /var/lib/postgresql` },
    { re: /^df -i$/, out: 'Filesystem      Inodes  IUsed   IFree IUse% Mounted on\n/dev/vda2      5242880 412003 4830877    8% /\n/dev/vdb      13107200  12044 13095156    1% /var/lib/postgresql' },
    { re: /^du -(sh|hs) \/\*( *\| *.*)?$/, out: '12M\t/boot\n8.0G\t/usr\n62G\t/var\n1.2G\t/home\n4.0K\t/tmp' },
    { re: /^du -(sh|hs) \/var\/\*$/, out: '60G\t/var/log\n1.1G\t/var/cache\n52G\t/var/lib\n' },
    { re: /^du -(sh|hs) \/var\/log\/\*$/, out: s => `${s.cleared ? '1.0K' : '44G'}\t/var/log/shop/app.log\n120M\t/var/log/nginx\n2.1G\t/var/log/journal\n` },
    { re: /^lsof \+L1$/, out: s => s.cleared ? 'COMMAND PID USER FD TYPE DEVICE SIZE/OFF NLINK NODE NAME' : 'COMMAND PID USER FD TYPE DEVICE SIZE/OFF NLINK NODE NAME\nrsyslogd 620 syslog 7w REG 252,2 14G 0 8812 /var/log/old-syslog.1 (deleted)' },
    { re: /^rm .*\/var\/log\/shop\/app\.log$/, out: 'Файл удалён из каталога, но приложение держит его открытым: df всё ещё показывает 100%.\nПодсказка: используйте truncate, файл нельзя удалять, пока он открыт. Команду rm в этой лабе мы откатили.', fail: true },
    { re: /^(truncate -s ?0|: *>|>) *\/var\/log\/shop\/app\.log$/, out: '', set: s => { s.cleared = true; } },
    { re: /^systemctl restart rsyslog$/, out: '', set: s => { s.rsys = true; } }
  ],
  dirs: ['/var', '/var/log', '/var/log/shop'],
  fs: {
    '/etc/logrotate.d/shop': '/var/log/shop/app.log {\n    daily\n    rotate 7\n    compress\n    missingok\n    copytruncate\n    size 100M\n}\n'
  },
  tasks: [
    { t: 'Проверьте заполнение дисков: df -h. Какая файловая система заполнена?', sol: ['df -h', 'answer /'], ans: ['/', '/dev/vda2', 'vda2'] },
    { t: 'Убедитесь, что не кончились inode: df -i. Какой IUse% у корня?', sol: ['df -i', 'answer 8%'], ans: ['8%', '8'], why: 'Если IUse% = 100, место есть, а новые файлы создать нельзя. Здесь не тот случай.' },
    { t: 'Спускайтесь вниз: du -sh /*, затем du -sh /var/*, затем du -sh /var/log/*. Какой файл самый большой?', sol: ['du -sh /*', 'du -sh /var/*', 'du -sh /var/log/*', 'answer /var/log/shop/app.log'], ans: ['/var/log/shop/app.log', 'app.log'] },
    { t: 'Очистите файл, не удаляя его: truncate -s 0 /var/log/shop/app.log', sol: 'truncate -s 0 /var/log/shop/app.log', check: s => s.cleared, why: 'Удалённый, но открытый файл продолжает занимать место до закрытия. truncate обнуляет его содержимое и сразу освобождает диск.' },
    { t: 'Проверьте результат: df -h', sol: 'df -h', ok: /^df -h$/ },
    { t: 'Прочитайте /etc/logrotate.d/shop. Сколько старых логов хранится (rotate)?', sol: ['cat /etc/logrotate.d/shop', 'answer 7'], ans: ['7'], why: 'Настроенная ротация логов не даёт проблеме повториться: это и есть устранение первопричины.' },
    { t: 'Проверьте, держит ли кто-то удалённые файлы: lsof +L1. Какой процесс держит 14G?', sol: ['lsof +L1', 'answer rsyslogd'], ans: ['rsyslogd'] },
    { t: 'Перезапустите его, чтобы освободить место.', sol: 'systemctl restart rsyslog', check: s => s.rsys }
  ]
},
lab_oom: {
  title: 'Кто убил приложение? OOM Killer', host: 'web-01',
  intro: 'Ночью Java-приложение перезапустилось. Выясните, кто его остановил и почему.',
  cmds: [
    { re: /^free -h$/, out: '               total        used        free      shared  buff/cache   available\nMem:           3.8Gi       3.4Gi       110Mi        24Mi       290Mi       180Mi\nSwap:             0B          0B          0B' },
    { re: /^vmstat 1( \d+)?$/, out: 'procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----\n r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st\n 6  0      0 110000  2100 290000    0    0  3800   120 2100 4800 62 11  4 23  0\n 7  1      0  98000  2100 280000    0    0  4100    90 2200 5100 66 12  2 20  0' },
    { re: /^uptime$/, out: ' 12:00:00 up 41 days, load average: 7.81, 6.20, 4.02' },
    { re: /^nproc$/, out: '2' },
    { re: /^top -bn1( *\|.*)?$/, out: 'top - 12:00:00 up 41 days, load average: 7.81, 6.20, 4.02\nTasks: 142 total, 3 running\n%Cpu(s): 62.0 us, 11.0 sy, 0.0 ni, 4.0 id, 23.0 wa\nMiB Mem : 3891.0 total, 110.0 free, 3481.0 used, 290.0 buff/cache\n\n  PID USER  %CPU %MEM COMMAND\n 1204 shop  148.0 71.0 java\n 3090 postgres 12.0 9.0 postgres\n 3188 root   8.0 6.0 report-gen' },
    { re: /^dmesg -T( *\|.*)?$/, out: '[Sun Nov  1 03:14:02 2026] report-gen invoked oom-killer: gfp_mask=0x140cca, order=0\n[Sun Nov  1 03:14:02 2026] Out of memory: Killed process 1102 (java) total-vm:3890000kB, anon-rss:2812000kB\n[Sun Nov  1 03:14:02 2026] oom_reaper: reaped process 1102 (java)', },
    { re: /^dmesg -T *\| *grep .*$/, out: '[Sun Nov  1 03:14:02 2026] Out of memory: Killed process 1102 (java) total-vm:3890000kB, anon-rss:2812000kB' },
    { re: /^journalctl -u shop-api --since .*$/, out: 'Nov 01 03:14:03 web-01 systemd[1]: shop-api.service: Main process exited, code=killed, status=9/KILL\nNov 01 03:14:08 web-01 systemd[1]: shop-api.service: Scheduled restart job, restart counter is at 1.' },
    { re: /^systemctl cat report-gen\.timer$/, out: '[Timer]\nOnCalendar=*-*-* 03:10:00' },
    { re: /^ps aux --sort=-%mem( *\|.*)?$/, out: 'USER   PID %CPU %MEM COMMAND\nshop  1204 148  71.0 java -Xmx2g -jar shop-api.jar\npostgres 3090 12 9.0 postgres\nroot  3188 8 6.0 report-gen' }
  ],
  tasks: [
    { t: 'Оцените нагрузку: uptime и nproc. Load 7.81 на сколько ядрах?', sol: ['uptime', 'nproc', 'answer 2'], ans: ['2'], why: 'Load намного выше числа ядер означает очередь. Но одна эта цифра ещё не говорит, что дефицит именно в CPU.' },
    { t: 'vmstat 1: столбец wa показывает ожидание диска. Какое значение в первой строке?', sol: ['vmstat 1', 'answer 23'], ans: ['23', '23%'], why: 'Высокий wa при почти нулевой свободной памяти: кэш вытеснен, и данные снова читаются с диска.' },
    { t: 'free -h: сколько swap настроено? Ответьте 0, если его нет.', sol: ['free -h', 'answer 0'], ans: ['0', '0b'] },
    { t: 'Прочитайте журнал ядра: dmesg -T. Какой процесс был убит?', sol: ['dmesg -T', 'answer java'], ans: ['java'], why: 'Сообщение «Out of memory: Killed process» — отпечаток OOM Killer. Приложение не падало само: его убило ядро.' },
    { t: 'Подтвердите через journalctl -u shop-api --since 03:00. С каким сигналом завершилась служба (номер)?', sol: ['journalctl -u shop-api --since 03:00', 'answer 9'], ans: ['9', 'kill', 'sigkill'] },
    { t: 'Кто спровоцировал нехватку памяти? Посмотрите первую строку dmesg и назовите процесс.', sol: ['dmesg -T', 'answer report-gen'], ans: ['report-gen'], why: 'Убитый процесс не обязан быть виновным. Запрос памяти сделал report-gen, а ядро выбрало самого большого — java. Решение: перенести отчёт или ограничить его через MemoryMax.' }
  ]
},
lab_net: {
  title: 'Сайт не открывается: сетевая диагностика', host: 'web-02',
  intro: 'На новом сервере приложение не может обратиться к api.example.lab, а снаружи не открывается порт 443. Проходите уровни снизу вверх.',
  state: { dnsFixed: false, fw: false },
  fs: { '/etc/resolv.conf': 'nameserver 10.0.0.53\n' },
  dirs: ['/etc'],
  cmds: [
    { re: /^ip (a|addr)( show)?$/, out: '1: lo: <LOOPBACK,UP> mtu 65536\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500\n    inet 10.0.1.25/24 brd 10.0.1.255 scope global eth0' },
    { re: /^ip r(oute)?( show)?$/, out: 'default via 10.0.1.1 dev eth0\n10.0.1.0/24 dev eth0 proto kernel scope link src 10.0.1.25' },
    { re: /^ping( -c ?\d+)? 10\.0\.1\.1$/, out: '64 bytes from 10.0.1.1: icmp_seq=1 ttl=64 time=0.4 ms\n--- 10.0.1.1 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss' },
    { re: /^ping( -c ?\d+)? 1\.1\.1\.1$/, out: '64 bytes from 1.1.1.1: icmp_seq=1 ttl=57 time=8.2 ms\n--- 1.1.1.1 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss' },
    { re: /^ping( -c ?\d+)? api\.example\.lab$/, when: (s, fs) => !/1\.1\.1\.1/.test(fs['/etc/resolv.conf']), out: 'ping: api.example.lab: Temporary failure in name resolution', fail: true },
    { re: /^ping( -c ?\d+)? api\.example\.lab$/, out: '64 bytes from 203.0.113.40: icmp_seq=1 ttl=55 time=12 ms\n3 packets transmitted, 3 received, 0% packet loss' },
    { re: /^dig( \+short)? api\.example\.lab$/, when: (s, fs) => !/1\.1\.1\.1/.test(fs['/etc/resolv.conf']), out: ';; communications error to 10.0.0.53#53: timed out\n;; no servers could be reached' },
    { re: /^dig \+short api\.example\.lab$/, out: '203.0.113.40' },
    { re: /^dig api\.example\.lab$/, out: ';; ANSWER SECTION:\napi.example.lab.  300  IN  A  203.0.113.40\n\n;; Query time: 11 msec\n;; SERVER: 1.1.1.1#53(1.1.1.1)' },
    { re: /^dig @1\.1\.1\.1( \+short)? api\.example\.lab$/, out: '203.0.113.40' },
    { re: /^traceroute 1\.1\.1\.1$/, out: ' 1  10.0.1.1  0.5 ms\n 2  172.16.0.1  2.1 ms\n 3  * * *\n 4  1.1.1.1  8.1 ms' },
    { re: /^ss -tlnp?$/, out: 'State   Recv-Q Send-Q Local Address:Port  Peer Address:Port Process\nLISTEN  0      511    0.0.0.0:443       0.0.0.0:*  users:(("nginx",pid=840))\nLISTEN  0      128    0.0.0.0:22        0.0.0.0:*  users:(("sshd",pid=512))\nLISTEN  0      100    127.0.0.1:8080    0.0.0.0:*  users:(("java",pid=1204))\nLISTEN  0      244    127.0.0.1:5432    0.0.0.0:*  users:(("postgres",pid=3090))' },
    { re: /^ss -tan( *\|.*)?$/, out: 'State      Local:Port        Peer:Port\nSYN-SENT   10.0.1.25:51234   10.0.0.53:53\nESTAB      10.0.1.25:22      198.51.100.7:50122\nTIME-WAIT  127.0.0.1:44012   127.0.0.1:8080' },
    { re: /^(ufw status|ufw status verbose)$/, out: s => `Status: active\n\nTo          Action      From\n--          ------      ----\n22/tcp      ALLOW       Anywhere${s.fw ? '\n443/tcp     ALLOW       Anywhere' : ''}` },
    { re: /^ufw allow (443|443\/tcp|https)$/, out: 'Rule added', set: s => { s.fw = true; } },
    { re: /^nc -zv(w ?\d+)? 203\.0\.113\.40 443$/, out: 'Connection to 203.0.113.40 443 port [tcp/https] succeeded!' },
    { re: /^check-from-outside$/, out: s => s.fw ? 'Снаружи: порт 443 открыт, TCP-соединение установлено.' : 'Снаружи: порт 443 — timeout. Пакеты молча отбрасываются.' },
    { re: /^curl -v(s)? https:\/\/api\.example\.lab\S*$/, when: (s, fs) => /1\.1\.1\.1/.test(fs['/etc/resolv.conf']), out: '*   Trying 203.0.113.40:443...\n* Connected to api.example.lab (203.0.113.40) port 443\n* TLSv1.3 (OUT), TLS handshake, Client hello\n* TLSv1.3 (IN), TLS handshake, Server hello\n* SSL certificate verify ok.\n> GET / HTTP/2\n< HTTP/2 200\n< content-type: application/json' },
    { re: /^curl .*api\.example\.lab\S*$/, out: 'curl: (6) Could not resolve host: api.example.lab', fail: true },
    { re: /^openssl s_client -connect api\.example\.lab:443.*$/, out: 'subject=CN=api.example.lab\nissuer=C=US, O=Let\'s Encrypt, CN=R11\nnotBefore=Oct  1 00:00:00 2026 GMT\nnotAfter=Dec 30 23:59:59 2026 GMT' }
  ],
  tasks: [
    { t: 'Какой IP-адрес у интерфейса eth0? (ip a)', sol: ['ip a', 'answer 10.0.1.25'], ans: ['10.0.1.25', '10.0.1.25/24'] },
    { t: 'Какой шлюз по умолчанию? (ip route)', sol: ['ip route', 'answer 10.0.1.1'], ans: ['10.0.1.1'] },
    { t: 'Проверьте шлюз и внешний IP: ping 10.0.1.1 и ping 1.1.1.1', sol: ['ping 10.0.1.1', 'ping 1.1.1.1'], ok: /^ping( -c ?\d+)? 1\.1\.1\.1$/, why: 'IP-связность есть. Значит, проблема выше.' },
    { t: 'Теперь по имени: ping api.example.lab. Какой уровень сломан: ответьте dns или ip.', sol: ['ping api.example.lab', 'answer dns'], ans: ['dns'], why: 'По IP работает, по имени нет: классический симптом проблемы DNS.' },
    { t: 'cat /etc/resolv.conf, затем проверьте, что другой резолвер работает: dig @1.1.1.1 +short api.example.lab', sol: ['cat /etc/resolv.conf', 'dig @1.1.1.1 +short api.example.lab'], ok: /^dig @1\.1\.1\.1/ },
    { t: 'Замените резолвер в /etc/resolv.conf на 1.1.1.1.', sol: "sed -i 's/10.0.0.53/1.1.1.1/' /etc/resolv.conf", check: (s, fs) => /1\.1\.1\.1/.test(fs['/etc/resolv.conf']) },
    { t: 'Проверьте полный путь: curl -v https://api.example.lab. Какой код ответа?', sol: ['curl -v https://api.example.lab', 'answer 200'], ans: ['200'], why: 'В выводе видно все этапы: DNS → TCP (Connected) → TLS (handshake) → HTTP.' },
    { t: 'Срок действия сертификата: openssl s_client -connect api.example.lab:443. В каком месяце он истекает? (англ., три буквы)', sol: ['openssl s_client -connect api.example.lab:443', 'answer Dec'], ans: ['dec', 'december', 'декабрь'] },
    { t: 'Теперь вторая проблема. ss -tlnp: на каком адресе слушает nginx 443 — 0.0.0.0 или 127.0.0.1?', sol: ['ss -tlnp', 'answer 0.0.0.0'], ans: ['0.0.0.0'], why: 'Служба слушает на всех интерфейсах, значит, дело не в ней. PostgreSQL и java на 127.0.0.1 снаружи недоступны, и так и должно быть.' },
    { t: 'Смоделируйте проверку снаружи: check-from-outside. Затем ufw status: есть ли правило для 443? Ответ да/нет.', sol: ['check-from-outside', 'ufw status', 'answer нет'], ans: ['нет', 'no'] },
    { t: 'Откройте порт: ufw allow 443/tcp, затем повторите check-from-outside.', sol: ['ufw allow 443/tcp', 'check-from-outside'], ok: /^check-from-outside$/, check: null, why: 'Timeout обычно означает, что пакеты отбрасывает firewall. Connection refused — что до хоста дошли, но порт никто не слушает.' }
  ]
}
};
// Последнее задание засчитывается только после открытия порта
LABS1.lab_net.tasks[10].check = s => s.fw && s.checked;
LABS1.lab_net.cmds.find(c => String(c.re).includes('check-from-outside')).set = s => { if (s.fw) s.checked = true; };
