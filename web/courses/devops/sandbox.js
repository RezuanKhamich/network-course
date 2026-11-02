// Песочница урока: стенд из лабораторий модуля плюс общая база диагностических команд. Без DOM, проверяется и в Node.
import { createLab } from './lab-engine.js';
import { LABS } from './labs.js';

const ACCESS = ['203.0.113.5 - - [01/Nov/2026:11:50:00 +0000] "GET / HTTP/1.1" 200 512', '198.51.100.7 - - [01/Nov/2026:11:50:01 +0000] "GET /api/orders HTTP/1.1" 502 157', '203.0.113.5 - - [01/Nov/2026:11:50:02 +0000] "GET /api/cart HTTP/1.1" 200 340', '198.51.100.7 - - [01/Nov/2026:11:50:03 +0000] "GET /api/orders HTTP/1.1" 502 157', '192.0.2.44 - - [01/Nov/2026:11:50:04 +0000] "GET /admin HTTP/1.1" 403 98'].join('\n') + '\n';
const BASE_FS = {
  '/home/student/access.log': ACCESS,
  '/home/student/error.log': '2026/11/01 11:50:01 [error] 841#841: connect() failed (111: Connection refused) while connecting to upstream\n',
  '/etc/nginx/nginx.conf': 'http {\n    include sites-enabled/*;\n}\n',
  '/etc/nginx/sites-enabled/shop.conf': 'server {\n    listen 443 ssl;\n    server_name shop.lab;\n}\n',
  '/var/log/syslog': 'Nov  1 11:50:00 lab systemd[1]: Started Session.\n',
  '/home/student/app.env': 'DB_PASSWORD=secret\n',
  '/home/student/deploy.sh': '#!/bin/bash\necho deploy\n'
};
const BASE = [
  [/^uname -a$/, 'Linux lab 6.8.0-45-generic #45-Ubuntu SMP x86_64 GNU/Linux'],
  [/^cat \/etc\/os-release$/, 'PRETTY_NAME="Ubuntu 24.04.1 LTS"\nVERSION_ID="24.04"\nID=ubuntu'],
  [/^uptime$/, ' 12:00:00 up 41 days,  3:12,  1 user,  load average: 0.42, 0.38, 0.35'],
  [/^nproc$/, '2'],
  [/^id$/, 'uid=1000(student) gid=1000(student) groups=1000(student),27(sudo)'],
  [/^which ls$/, '/usr/bin/ls'],
  [/^free -h$/, '               total        used        free      shared  buff/cache   available\nMem:           3.8Gi       1.6Gi       310Mi        24Mi       2.1Gi       2.2Gi\nSwap:          2.0Gi          0B       2.0Gi'],
  [/^df -h$/, 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/vda2        79G   31G   44G  42% /\n/dev/vda1       974M  180M  727M  20% /boot'],
  [/^df -i$/, 'Filesystem      Inodes  IUsed   IFree IUse% Mounted on\n/dev/vda2      5242880 412003 4830877    8% /'],
  [/^du -sh .*$/, '8.0G\t/usr\n3.1G\t/var\n1.2G\t/home'],
  [/^find \/var -size \+1G$/, '/var/log/journal/system.journal'],
  [/^lsof \+L1$/, 'COMMAND PID USER FD TYPE SIZE/OFF NLINK NAME'],
  [/^lsblk( -f)?$/, 'NAME   SIZE TYPE FSTYPE MOUNTPOINTS\nvda     80G disk\n├─vda1   1G part ext4   /boot\n└─vda2  79G part ext4   /'],
  [/^mount$/, '/dev/vda2 on / type ext4 (rw,relatime)\n/dev/vda1 on /boot type ext4 (rw,relatime)'],
  [/^vmstat 1( \d+)?$/, 'procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----\n r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st\n 1  0      0 310000  2100 2100000    0    0    12    40  210  480  8  2 89  1  0'],
  [/^iostat -xz 1( \d+)?$/, 'Device  r/s  w/s r_await w_await aqu-sz %util\nvda      12   30    0.8     1.2    0.1   4.0'],
  [/^mpstat -P ALL 1$/, 'CPU  %usr %sys %iowait %idle\nall   8.0  2.0     1.0  89.0\n  0   9.0  2.0     1.0  88.0\n  1   7.0  2.0     1.0  90.0'],
  [/^pidstat( -d)? 1$/, 'PID  %usr %system  %CPU Command\n1204  6.0    1.0   7.0 java\n 841  0.5    0.2   0.7 nginx'],
  [/^(top|htop|top -bn1)$/, 'top - 12:00:00 up 41 days, load average: 0.42, 0.38, 0.35\n%Cpu(s):  8.0 us,  2.0 sy, 89.0 id,  1.0 wa,  0.0 st\nMiB Mem: 3891 total, 310 free, 1640 used, 2150 buff/cache\n  PID USER  %CPU %MEM COMMAND\n 1204 shop   7.0 28.0 java\n  841 www    0.7  0.3 nginx'],
  [/^iotop$/, 'PID  DISK READ  DISK WRITE  COMMAND\n3090  0.00 B/s  120 K/s    postgres'],
  [/^ps aux( --sort=-%(cpu|mem))?$/, 'USER PID %CPU %MEM COMMAND\nroot 1 0.0 0.3 /sbin/init\nroot 512 0.0 0.1 sshd\nroot 840 0.0 0.1 nginx: master\nwww-data 841 0.1 0.3 nginx: worker\nshop 1204 6.2 28.0 java -jar shop-api.jar'],
  [/^ps -o pid,ppid,stat,cmd -p 1204$/, '  PID  PPID STAT CMD\n 1204     1 Sl   java -jar shop-api.jar'],
  [/^ps -eLf$/, 'UID PID LWP CMD\nshop 1204 1204 java\nshop 1204 1205 java\nshop 1204 1206 java'],
  [/^pstree( -p)?$/, 'systemd(1)─┬─sshd(512)\n           ├─nginx(840)───nginx(841)\n           └─java(1204)─┬─{java}(1205)\n                        └─{java}(1206)'],
  [/^pgrep -a java$/, '1204 java -jar shop-api.jar'],
  [/^ls -l \/proc\/1204\/fd$/, 'lrwx------ 0 -> /dev/null\nl-wx------ 1 -> /var/log/shop/app.log\nlrwx------ 7 -> socket:[8812]'],
  [/^dmesg -T$/, '[Sun Nov  1 03:14:02 2026] Out of memory: Killed process 1102 (java)\n[Sun Nov  1 03:20:11 2026] EXT4-fs (vda2): re-mounted'],
  [/^journalctl( -b( -1)?| -k| -p err -b)$/, 'Nov 01 11:52:03 lab systemd[1]: shop-api.service: Failed with result \'exit-code\'.\nNov 01 11:52:09 lab sshd[512]: Accepted publickey for student'],
  [/^journalctl -u \S+.*$/, 'Nov 01 11:52:02 lab systemd[1]: Started service.\nNov 01 11:52:03 lab java[5120]: Started ShopApplication in 7.4 seconds'],
  [/^journalctl --disk-usage$/, 'Archived and active journals take up 2.1G in the file system.'],
  [/^systemd-analyze blame$/, '12.4s shop-api.service\n 3.1s postgresql.service\n 0.8s nginx.service'],
  [/^systemctl --failed$/, '0 loaded units listed.'],
  [/^systemctl status \S+$/, '● Служба\n     Active: active (running) since Sun 2026-11-01 09:00:00 UTC\n   Main PID: 1204'],
  [/^systemctl (start|stop|restart|reload|enable|disable|daemon-reload|reset-failed)( \S+)?$/, 'Команда выполнена на учебном стенде.'],
  [/^systemctl cat \S+$/, '[Service]\nUser=shop\nExecStart=/usr/bin/java -jar /opt/app/shop-api.jar\nRestart=on-failure'],
  [/^systemctl list-units --type=service$/, 'nginx.service loaded active running\nshop-api.service loaded active running\nssh.service loaded active running'],
  [/^ip (a|addr)$/, '2: eth0: <UP,LOWER_UP> mtu 1500\n    inet 10.0.1.25/24 scope global eth0'],
  [/^ip r(oute)?$/, 'default via 10.0.1.1 dev eth0\n10.0.1.0/24 dev eth0 src 10.0.1.25'],
  [/^ip route get \S+$/, '8.8.8.8 via 10.0.1.1 dev eth0 src 10.0.1.25'],
  [/^ping( -c ?\d+)? \S+$/, '64 bytes: icmp_seq=1 ttl=57 time=8.2 ms\n3 packets transmitted, 3 received, 0% packet loss'],
  [/^(traceroute|mtr) \S+$/, ' 1  10.0.1.1  0.5 ms\n 2  172.16.0.1  2.1 ms\n 3  * * *\n 4  1.1.1.1  8.1 ms'],
  [/^ss -tlnp$/, 'LISTEN 0.0.0.0:443 users:(("nginx",pid=840))\nLISTEN 0.0.0.0:22 users:(("sshd",pid=512))\nLISTEN 127.0.0.1:8080 users:(("java",pid=1204))\nLISTEN 127.0.0.1:5432 users:(("postgres",pid=3090))'],
  [/^ss -tan( state time-wait)?$/, 'ESTAB 10.0.1.25:22 198.51.100.7:50122\nTIME-WAIT 127.0.0.1:44012 127.0.0.1:8080'],
  [/^ss -s$/, 'TCP: 42 (estab 12, closed 20, timewait 18)'],
  [/^nc -zv \S+ \d+$/, 'Connection succeeded!'],
  [/^tcpdump -ni eth0 port 443$/, '12:00:01 IP 198.51.100.7.50122 > 10.0.1.25.443: Flags [S]\n12:00:01 IP 10.0.1.25.443 > 198.51.100.7.50122: Flags [S.]'],
  [/^dig \+short \S+$/, '203.0.113.40'],
  [/^dig( @\S+)? \S+$/, ';; ANSWER SECTION:\nshop.lab. 300 IN A 203.0.113.40\n;; Query time: 11 msec'],
  [/^dig \+trace \S+$/, '. NS a.root-servers.net.\nlab. NS ns1.nic.lab.\nshop.lab. 300 IN A 203.0.113.40'],
  [/^getent hosts \S+$/, '203.0.113.40 shop.lab'],
  [/^resolvectl status$/, 'Current DNS Server: 10.0.0.53'],
  [/^(ufw status( verbose)?)$/, 'Status: active\n22/tcp ALLOW Anywhere\n443/tcp ALLOW Anywhere'],
  [/^ufw (allow|default) .*$/, 'Rule added (учебный стенд)'],
  [/^iptables -L -n -v$/, 'Chain INPUT (policy DROP)\n pkts target prot dpt\n 1200 ACCEPT tcp dpt:22\n 8400 ACCEPT tcp dpt:443'],
  [/^nft list ruleset$/, 'table inet filter { chain input { policy drop; tcp dport { 22, 443 } accept } }'],
  [/^curl -I \S+$/, 'HTTP/2 200\nserver: nginx\ncontent-type: text/html'],
  [/^curl -v \S+$/, '* Connected\n* SSL certificate verify ok.\n> GET / HTTP/2\n< HTTP/2 200'],
  [/^curl -sv? \S+$/, '{"status":"UP"}'],
  [/^openssl s_client -connect .*$/, 'subject=CN=shop.lab\nissuer=O=Let\'s Encrypt\nnotAfter=Dec 30 23:59:59 2026 GMT'],
  [/^nginx -t$/, 'nginx: configuration file /etc/nginx/nginx.conf test is successful'],
  [/^nginx -T$/, 'server { listen 443 ssl; server_name shop.lab; }'],
  [/^certbot renew --dry-run$/, 'Congratulations, all simulated renewals succeeded'],
  [/^jps( -l)?$/, '1204 shop-api.jar'],
  [/^jcmd \d+ VM\.flags$/, '-XX:MaxHeapSize=2147483648 -XX:+UseG1GC'],
  [/^jcmd \d+ GC\.heap_info$/, 'garbage-first heap total 2097152K, used 812344K'],
  [/^jcmd \d+ Thread\.print$/, '"http-nio-8080-exec-1" RUNNABLE\n"http-nio-8080-exec-2" TIMED_WAITING (parking)'],
  [/^jstat -gcutil \d+( \d+)?$/, ' S0 S1 E O M YGC FGC GCT\n 0.0 42.1 61.3 38.9 97.8 812 0 9.120'],
  [/^docker ps( -a)?$/, 'NAMES IMAGE STATUS\napi shop-api:1.0 Up 2 hours'],
  [/^docker images$/, 'REPOSITORY TAG SIZE\nshop-api 1.0 214MB'],
  [/^docker history \S+$/, 'COPY app.jar 48MB\nбазовый образ 166MB'],
  [/^docker build .*$/, 'Образ собран (учебный стенд).'],
  [/^docker run .*$/, 'a1b2c3d4e5f6'],
  [/^docker stats --no-stream$/, 'NAME CPU % MEM USAGE / LIMIT\napi 1.4% 388MiB / 512MiB'],
  [/^docker logs .*$/, 'Started ShopApplication in 7.4 seconds'],
  [/^docker compose (up -d|up -d --build|down|ps|logs -f app)$/, 'Команда выполнена на учебном стенде.'],
  [/^ansible -i \S+ \S+ -m ping$/, 'web-01 | SUCCESS => {"ping": "pong"}'],
  [/^ansible-playbook -i \S+ \S+.*$/, 'PLAY RECAP\nweb-01 : ok=4 changed=0 failed=0'],
  [/^bash -n \S+$/, ''],
  [/^chown \S+ \S+$/, ''],
  [/^sudo -u shop whoami$/, 'shop'],
  [/^-u shop whoami$/, 'shop'],
  [/^cat \/proc\/\d+\/oom_score$/, '742'],
  [/^ssh-keygen -t ed25519$/, 'Your public key has been saved in /home/student/.ssh/id_ed25519.pub'],
  [/^ssh-copy-id \S+$/, 'Number of key(s) added: 1'],
  [/^ssh( -v| -J \S+| -L \S+)? \S+$/, 'Подключение по SSH установлено (учебный стенд). Здесь вы остаётесь на том же стенде.'],
  [/^(scp|rsync) .*$/, 'sent 48 MB, скорость 112 MB/s'],
  [/^curl -X POST .*$/, '{"status":201}'],
  [/^curl -s -o \/dev\/null -w .*$/, '200 0.081'],
  [/^docker exec -it \S+ sh$/, 'В учебном стенде интерактивный вход в контейнер недоступен.'],
  [/^docker inspect \S+ --format .*$/, '0 false'],
  [/^docker compose exec db psql .*$/, 'psql (17.0)'],
  [/^psql -U postgres -d \S+$/, 'psql (17.0). Здесь запросы выполняйте так: psql -c "SELECT 1"'],
  [/^psql -d \S+ -c .*count.*$/, ' count\n---------\n 2400000'],
  [/^ansible-vault (create|edit) \S+$/, 'Файл зашифрован (учебный стенд).'],
  [/^ansible-playbook \S+ --ask-vault-pass$/, 'PLAY RECAP\nweb-01 : ok=4 changed=0 failed=0']
].map(([re, out]) => ({ re, out }));

// Определение стенда из лаб, перечисленных через запятую
export function sandboxDef(ids){
  const labs = ids.map(id => LABS[id]).filter(Boolean);
  const cwd = (labs.find(l => l.cwd) || {}).cwd;
  // Примеры из теории ссылаются на логи без пути: они должны находиться в стартовом каталоге
  const logs = cwd ? { [cwd + '/access.log']: BASE_FS['/home/student/access.log'], [cwd + '/error.log']: BASE_FS['/home/student/error.log'] } : {};
  return {
    host: 'sandbox', tasks: [], cwd,
    fs: Object.assign({}, BASE_FS, logs, ...labs.map(l => l.fs || {})),
    dirs: labs.flatMap(l => l.dirs || []),
    state: Object.assign({}, ...labs.map(l => l.state || {})),
    cmds: [...labs.flatMap(l => l.cmds || []), ...BASE]
  };
}
export const newSandbox = def => createLab(def);
// Команда из текста урока: без приглашения $ и комментария в конце
export const cleanLine = line => line.trim().replace(/^\$\s+/, '').replace(/\s+#\s.*$/, '');
// Понимает ли стенд эту команду: пробуем на одноразовой копии
export function runnable(def, line){
  if (!line || /^[#\-/{}[\]<]/.test(line) || /[а-яё]+:$/i.test(line) || /"\$|\$\(/.test(line)) return false; // строки скриптов с переменными не запускаем
  try { return !createLab(def).run(line).blocked; } catch (e){ return false; }
}
