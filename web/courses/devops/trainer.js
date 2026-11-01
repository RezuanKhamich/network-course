// Тренажёр терминала: упражнения проверяются по результату, а не по тексту команды, поэтому подходит любое верное решение.
// Упражнение без check: вывод команды сравнивается с выводом эталона sol. С check: проверяется состояние стенда после команды.
import { createLab } from './lab-engine.js';

const FS = {
  '/home/student/notes.txt': 'купить диск\nнастроить nginx\nпрочитать про systemd\nнастроить бэкап\nпозвонить тимлиду\n',
  '/home/student/.secret': 'token=abc123\n',
  '/home/student/app.log': '10:00:01 INFO запуск службы\n10:00:05 INFO подключение к базе\n10:01:12 WARN медленный запрос\n10:02:30 ERROR нет соединения с базой\n10:02:31 ERROR нет соединения с базой\n10:03:00 INFO повторное подключение\n10:04:44 ERROR таймаут платежа\n10:05:10 INFO запрос выполнен\n',
  '/home/student/project/README.md': '# Shop\nУчебный проект\n',
  '/home/student/project/deploy.sh': '#!/bin/bash\necho deploy\n',
  '/home/student/project/src/main.py': 'print("hello")\n',
  '/home/student/project/src/util.py': 'def add(a, b):\n    return a + b\n',
  '/home/student/project/old/backup.tar': 'архив\n',
  '/etc/hostname': 'lab-01\n',
  '/etc/passwd': 'root:x:0:0:root:/root:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nstudent:x:1000:1000:Student:/home/student:/bin/bash\nshop:x:998:998:Shop:/opt/app:/usr/sbin/nologin\n',
  '/var/log/access.log': '203.0.113.5 GET /api/orders 200\n198.51.100.7 GET /api/orders 502\n203.0.113.5 GET /index.html 200\n192.0.2.44 POST /login 401\n198.51.100.7 GET /api/cart 502\n203.0.113.5 GET /api/cart 200\n203.0.113.9 GET /admin 403\n203.0.113.5 GET /about 404\n'
};
const PS = 'USER PID %CPU %MEM COMMAND\nroot 1 0.0 0.3 /sbin/init\nroot 512 0.0 0.1 sshd\nroot 840 0.0 0.1 nginx-master\nwww-data 841 0.1 0.3 nginx-worker\nshop 1204 6.2 28.0 java\nstudent 4471 97.0 0.2 old-backup.sh\n';

export const TRAINER_DEF = {
  host: 'trainer', dirs: ['/opt', '/opt/app', '/var', '/var/log'], fs: FS, tasks: [],
  cmds: [{ re: /^ps aux$/, out: PS.trimEnd() }]
};
const P = '/home/student/project';
export const DRILLS = [
  { level: 'Навигация', items: [
    { t: 'Покажите, в каком каталоге вы находитесь.', sol: 'pwd' },
    { t: 'Покажите файлы в текущем каталоге.', sol: 'ls' },
    { t: 'Покажите все файлы, включая скрытые.', sol: 'ls -a' },
    { t: 'Перейдите в каталог project/src.', sol: 'cd project/src', check: l => l.cwd === P + '/src' },
    { t: 'Перейдите в /var/log, указав полный путь.', sol: 'cd /var/log', check: l => l.cwd === '/var/log' },
    { t: 'Покажите содержимое каталога /etc, не переходя в него.', sol: 'ls /etc' }
  ]},
  { level: 'Чтение файлов', items: [
    { t: 'Выведите файл notes.txt целиком.', sol: 'cat notes.txt' },
    { t: 'Выведите первые 2 строки app.log.', sol: 'head -n 2 app.log' },
    { t: 'Выведите последние 3 строки app.log.', sol: 'tail -n 3 app.log' },
    { t: 'Посчитайте число строк в app.log.', sol: 'wc -l app.log', same: o => o.split(' ')[0] },
    { t: 'Выведите скрытый файл .secret.', sol: 'cat .secret' }
  ]},
  { level: 'Файлы и каталоги', items: [
    { t: 'Создайте каталог tmpdir.', sol: 'mkdir tmpdir', check: l => l.state.dirs.has('/home/student/tmpdir') },
    { t: 'Создайте пустой файл todo.txt.', sol: 'touch todo.txt', check: l => l.state.fs['/home/student/todo.txt'] === '' },
    { t: 'Скопируйте notes.txt в notes.bak.', sol: 'cp notes.txt notes.bak', check: l => l.state.fs['/home/student/notes.bak'] === FS['/home/student/notes.txt'] },
    { t: 'Переименуйте notes.txt в ideas.txt.', sol: 'mv notes.txt ideas.txt', check: l => l.state.fs['/home/student/ideas.txt'] && !l.state.fs['/home/student/notes.txt'] },
    { t: 'Удалите файл project/old/backup.tar.', sol: 'rm project/old/backup.tar', check: l => l.state.fs[P + '/old/backup.tar'] === undefined },
    { t: 'Удалите каталог project/old вместе с содержимым.', sol: 'rm -r project/old', check: l => !l.state.dirs.has(P + '/old') && l.state.fs[P + '/old/backup.tar'] === undefined }
  ]},
  { level: 'Поиск', items: [
    { t: 'Найдите в app.log все строки с ERROR.', sol: 'grep ERROR app.log' },
    { t: 'Посчитайте строки с ERROR в app.log.', sol: 'grep -c ERROR app.log' },
    { t: 'Найдите строки с «error» без учёта регистра.', sol: 'grep -i error app.log' },
    { t: 'Выведите строки app.log, где нет INFO.', sol: 'grep -v INFO app.log' },
    { t: 'Найдите в /etc/passwd строку пользователя shop.', sol: 'grep shop /etc/passwd' },
    { t: 'Найдите все файлы .py в каталоге project.', sol: 'find project -name "*.py"', same: o => o.split('\n').map(x => x.split('/').pop()).join('\n') }
  ]},
  { level: 'Запись и права', items: [
    { t: 'Запишите слово готово в файл done.txt.', sol: 'echo готово > done.txt', check: l => l.state.fs['/home/student/done.txt'] === 'готово\n' },
    { t: 'Допишите строку купить кофе в конец notes.txt, сохранив остальное.', sol: 'echo купить кофе >> notes.txt', check: l => l.state.fs['/home/student/notes.txt'] === FS['/home/student/notes.txt'] + 'купить кофе\n' },
    { t: 'Сохраните все строки с ERROR из app.log в файл errors.txt.', sol: 'grep ERROR app.log > errors.txt', check: l => (l.state.fs['/home/student/errors.txt'] || '').trim().split('\n').length === 3 },
    { t: 'Разрешите запуск файла project/deploy.sh.', sol: 'chmod +x project/deploy.sh', check: l => /[1357]/.test(l.state.modes[P + '/deploy.sh'] || '') },
    { t: 'Закройте .secret: чтение и запись только владельцу (цифрами).', sol: 'chmod 600 .secret', check: l => l.state.modes['/home/student/.secret'] === '600' },
    { t: 'Замените в notes.txt слово nginx на apache прямо в файле.', sol: "sed -i 's/nginx/apache/' notes.txt", check: l => /настроить apache/.test(l.state.fs['/home/student/notes.txt']) }
  ]},
  { level: 'Конвейеры', items: [
    { t: 'Посчитайте конвейером, сколько файлов в /home/student (видимых).', sol: 'ls | wc -l' },
    { t: 'Выведите только имена пользователей из /etc/passwd.', sol: 'cut -d: -f1 /etc/passwd' },
    { t: 'Выведите отсортированный по алфавиту notes.txt.', sol: 'sort notes.txt' },
    { t: 'Выведите из access.log только IP-адреса (первый столбец).', sol: "awk '{print $1}' /var/log/access.log" },
    { t: 'Посчитайте, сколько раз встречается каждый код ответа (последний, 4-й столбец).', sol: "awk '{print $4}' /var/log/access.log | sort | uniq -c" },
    { t: 'Выведите URL (3-й столбец) запросов с кодом 502.', sol: "awk '$4==502 {print $3}' /var/log/access.log" },
    { t: 'Покажите IP, сделавший больше всего запросов: только первую строку рейтинга с числом.', sol: "awk '{print $1}' /var/log/access.log | sort | uniq -c | sort -rn | head -n 1" }
  ]},
  { level: 'Процессы', items: [
    { t: 'Покажите все процессы.', sol: 'ps aux' },
    { t: 'Оставьте из списка процессов только строки с nginx.', sol: 'ps aux | grep nginx' },
    { t: 'Выведите только PID процесса java.', sol: "ps aux | grep java | awk '{print $2}'" }
  ]}
];

const clean = (s, f) => { const t = (s || '').split('\n').map(x => x.trim().replace(/\s+/g, ' ')).filter(Boolean).join('\n'); return f ? f(t) : t; };
export const newDrillLab = () => createLab(TRAINER_DEF);
// Верно ли решено упражнение после запуска команды на стенде lab с выводом out
export function drillPassed(ex, lab, out){
  if (ex.check) return !!ex.check(lab);
  const ref = newDrillLab().run(ex.sol).out;
  return clean(out, ex.same) === clean(ref, ex.same);
}
