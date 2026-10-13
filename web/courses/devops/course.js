// Код, специфичный для курса «DevOps»: настройки, виджеты, сквозной сценарий, шпаргалки.
import { $, esc } from '../../assets/js/storage.js';
import { Game } from '../../assets/js/game.js';
import { findLesson } from '../../assets/js/engine.js';
export const COURSE = {
  id: 'devops',
  title: 'DevOps для разработчиков',
  tagline: 'От коммита до продакшена: как код собирается, тестируется, упаковывается в контейнер, выкатывается и живёт под наблюдением. Короткая теория, реальные конфиги и тесты после каждого модуля.',
  journeyLabel: 'Путь коммита в прод',
  brand: '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><path d="M3 13c0-3 2-5 4.5-5S11 10 13 13s3.5 5 5.5 5S23 16 23 13s-2-5-4.5-5S15 10 13 13s-3.5 5-5.5 5S3 16 3 13z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="7.5" cy="13" r="2" fill="var(--accent)"/><circle cx="18.5" cy="13" r="2" fill="var(--accent)"/></svg>'
};

function stepWidget(el, steps, head){
  el.className = 'widget';
  let k = 0;
  const draw = () => {
    el.innerHTML = `${head ? head(k) : ''}<div style="display:flex;flex-direction:column;gap:6px;font:13px var(--f-mono)">${steps.map((s, i) => `<div style="display:grid;grid-template-columns:minmax(0,150px) minmax(0,1fr);gap:8px;align-items:center;padding:6px 8px;border-radius:6px;opacity:${i > k ? .2 : 1};background:${i === k ? 'var(--accent-soft)' : 'transparent'}"><b>${esc(s.n)}</b><span>${esc(s.c)}</span></div>`).join('')}</div>
    <p style="margin:12px 0 10px"><b>Шаг ${k + 1}/${steps.length}.</b> ${esc(steps[k].e)}</p>
    <div class="row"><button class="btn ghost" data-d="-1" ${k === 0 ? 'disabled' : ''}>← Назад</button><button class="btn" data-d="1" ${k === steps.length - 1 ? 'disabled' : ''}>Шаг вперёд →</button></div>`;
    el.querySelectorAll('button').forEach(b => b.onclick = () => { k += +b.dataset.d; draw(); });
  };
  draw();
}

const PIPELINE_STEPS = [
  { n:'push', c:'git push origin feature/login', e:'Разработчик отправляет ветку. CI-система получает webhook и ставит пайплайн в очередь.' },
  { n:'checkout', c:'actions/checkout@v4', e:'Раннер — чистая временная машина. Он клонирует репозиторий на нужный коммит.' },
  { n:'deps (cache)', c:'npm ci  # cache hit: node_modules за 4 с', e:'Зависимости ставятся строго по lock-файлу. Кэш по хешу lock-файла экономит минуты.' },
  { n:'lint + unit', c:'npm run lint && npm test', e:'Быстрые проверки идут первыми: упасть за минуту дешевле, чем через двадцать.' },
  { n:'build image', c:'docker build -t app:3f9c2e1 .', e:'Собирается один артефакт, помеченный SHA коммита. Дальше по всем окружениям едет именно он.' },
  { n:'scan', c:'trivy image app:3f9c2e1', e:'Сканер ищет уязвимости в образе и зависимостях. Критичные — повод остановить пайплайн.' },
  { n:'push image', c:'docker push registry/app:3f9c2e1', e:'Артефакт уходит в реестр. Пересобирать его для продакшена нельзя — только продвигать.' },
  { n:'deploy staging', c:'helm upgrade app --set image.tag=3f9c2e1', e:'Выкладка в staging и интеграционные / smoke-тесты против живого окружения.' },
  { n:'deploy prod', c:'canary 5% → 50% → 100%', e:'Продакшен получает тот же образ, постепенно, с автоматическим откатом по метрикам.' }
];
const ROLLOUT_STEPS = [
  { n:'старт', c:'v1 v1 v1 v1  | maxSurge=1, maxUnavailable=0', e:'Deployment с 4 репликами v1. Меняем образ на v2 — запускается rolling update.' },
  { n:'surge', c:'v1 v1 v1 v1 [v2 …]', e:'Kubernetes создаёт один лишний под v2 (maxSurge=1). Пока readiness-проба не прошла, трафик на него не идёт.' },
  { n:'ready', c:'v1 v1 v1 v1  v2✓', e:'Под v2 готов, попадает в endpoints сервиса и начинает получать запросы.' },
  { n:'замена', c:'v1 v1 v1  v2✓ [v2 …]', e:'Один старый под удаляется (сначала уходит из endpoints, получает SIGTERM), создаётся следующий новый.' },
  { n:'…', c:'v1  v2✓ v2✓ v2✓ [v2 …]', e:'Цикл повторяется. Ёмкость ни разу не падает ниже 4 готовых подов.' },
  { n:'готово', c:'v2✓ v2✓ v2✓ v2✓', e:'Все реплики на v2. Старый ReplicaSet сохранён с 0 подов — kubectl rollout undo вернёт его за секунды.' }
];

export const WIDGETS = {
  pipeline(el){ stepWidget(el, PIPELINE_STEPS); },
  rollout(el){ stepWidget(el, ROLLOUT_STEPS); },
  slo(el){
    el.className = 'widget';
    const id = 'slo' + Math.random().toString(36).slice(2, 6);
    el.innerHTML = `<div class="row"><label class="small" for="${id}">SLO, %</label><input type="text" id="${id}" value="99.9" style="font-family:var(--f-mono);max-width:120px" autocomplete="off"><label class="small" for="${id}r">запросов в месяц</label><input type="text" id="${id}r" value="10000000" style="font-family:var(--f-mono);max-width:160px" autocomplete="off"></div><div class="out"></div>`;
    const a = el.querySelector('#' + id), r = el.querySelector('#' + id + 'r'), out = el.querySelector('.out');
    const fmt = min => min >= 1440 ? (min / 1440).toFixed(2) + ' дн' : min >= 60 ? Math.floor(min / 60) + ' ч ' + Math.round(min % 60) + ' мин' : min >= 1 ? min.toFixed(1) + ' мин' : (min * 60).toFixed(1) + ' с';
    const calc = () => {
      const s = parseFloat(a.value.replace(',', '.')), n = parseFloat(r.value.replace(/\s/g, ''));
      if (!(s > 0 && s < 100)){ out.innerHTML = '<p class="small" style="color:var(--bad)">Введите SLO от 0 до 100, например 99.95.</p>'; return; }
      const b = 1 - s / 100;
      out.innerHTML = `<div class="calc"><div><span>Бюджет ошибок</span><b>${(b * 100).toFixed(4).replace(/0+$/, '').replace(/\.$/, '')}%</b></div>
      <div><span>Простой в сутки</span><b>${fmt(1440 * b)}</b></div><div><span>Простой за 30 дней</span><b>${fmt(43200 * b)}</b></div>
      <div><span>Простой за год</span><b>${fmt(525600 * b)}</b></div>${n > 0 ? `<div><span>Допустимо ошибок в месяц</span><b>${Math.floor(Math.round(n * b * 1e6) / 1e6).toLocaleString('ru-RU')}</b></div>` : ''}
      <div><span>Burn rate 14,4× съест месяц за</span><b>${fmt(43200 / 14.4)}</b></div></div>`;
    };
    a.addEventListener('input', calc); r.addEventListener('input', calc); calc();
  },
  layers(el){
    el.className = 'widget';
    const L = [
      ['FROM node:20-alpine', 'базовый образ'],
      ['WORKDIR /app', ''],
      ['COPY package*.json ./', 'меняется при обновлении зависимостей'],
      ['RUN npm ci', 'долго: ~60 с'],
      ['COPY . .', 'меняется при каждом коммите'],
      ['RUN npm run build', '~20 с'],
      ['CMD ["node","dist/server.js"]', '']
    ];
    const changes = [['Ничего не менялось', 99], ['Поменяли код в src/', 4], ['Обновили зависимость в package.json', 2], ['Сменили базовый образ', 0]];
    el.innerHTML = `<div class="row">${changes.map((c, i) => `<button class="btn ghost" data-i="${i}">${c[0]}</button>`).join('')}</div><div class="out" style="margin-top:12px"></div>`;
    const out = el.querySelector('.out');
    const draw = i => {
      const from = changes[i][1];
      el.querySelectorAll('[data-i]').forEach(b => b.className = 'btn' + (+b.dataset.i === i ? '' : ' ghost'));
      out.innerHTML = `<div style="font:13px var(--f-mono);display:flex;flex-direction:column;gap:4px">${L.map((l, k) => { const hit = k < from; return `<div style="display:flex;justify-content:space-between;gap:10px;padding:5px 8px;border-radius:6px;background:${hit ? 'var(--ok-soft)' : 'var(--warn-soft)'}"><span>${esc(l[0])}</span><span class="small">${hit ? 'CACHED' : 'пересборка'}${l[1] ? ' · ' + esc(l[1]) : ''}</span></div>`; }).join('')}</div>
      <p class="small" style="margin-top:8px">Изменение слоя инвалидирует кэш этого слоя и всех слоёв ниже. Поэтому редко меняющееся копируют раньше, а исходники — в самом конце.</p>`;
    };
    el.querySelectorAll('[data-i]').forEach(b => b.onclick = () => draw(+b.dataset.i)); draw(1);
  },
  cron(el){
    el.className = 'widget';
    const id = 'cr' + Math.random().toString(36).slice(2, 6);
    el.innerHTML = `<label for="${id}" class="small">Cron-выражение (минута час день месяц день_недели)</label><div class="row"><input type="text" id="${id}" value="*/15 9-18 * * 1-5" style="font-family:var(--f-mono);max-width:280px" autocomplete="off"><span class="small">попробуйте 0 3 * * *, 30 2 1 * *, 0 */6 * * 0</span></div><div class="out"></div>`;
    const inp = el.querySelector('input'), out = el.querySelector('.out');
    const names = ['минута', 'час', 'день месяца', 'месяц', 'день недели'], lim = [[0, 59], [0, 23], [1, 31], [1, 12], [0, 7]];
    const part = (f, i) => {
      if (f === '*') return 'любой';
      let m;
      if ((m = f.match(/^\*\/(\d+)$/))) return 'каждые ' + m[1];
      return f.split(',').map(x => {
        if ((m = x.match(/^(\d+)-(\d+)(?:\/(\d+))?$/))) { if (+m[1] < lim[i][0] || +m[2] > lim[i][1]) throw 0; return 'с ' + m[1] + ' по ' + m[2] + (m[3] ? ' шаг ' + m[3] : ''); }
        if (/^\d+$/.test(x)) { if (+x < lim[i][0] || +x > lim[i][1]) throw 0; return x; }
        throw 0;
      }).join(', ');
    };
    const calc = () => {
      const f = inp.value.trim().split(/\s+/);
      try {
        if (f.length !== 5) throw 0;
        out.innerHTML = `<div class="calc">${f.map((x, i) => `<div><span>${names[i]}</span><b>${esc(part(x, i))}</b></div>`).join('')}</div><p class="small">День недели: 0 и 7 — воскресенье, 1 — понедельник. Время — в часовом поясе демона (часто UTC).</p>`;
      } catch (e) { out.innerHTML = '<p class="small" style="color:var(--bad)">Нужно 5 полей: числа, диапазоны 1-5, списки 1,3 и шаги */10.</p>'; }
    };
    inp.addEventListener('input', calc); calc();
  }
};

export function viewTools(){
  return `<div class="crumbs"><a href="#/">главная</a> / инструменты</div><h1>Инструменты</h1>
  <h2 style="margin-top:26px">Калькулятор SLO и бюджета ошибок</h2><div data-widget="slo"></div>
  <h2 style="margin-top:26px">Кэш слоёв Docker</h2><p class="small">Подробно — в модуле 5.</p><div data-widget="layers"></div>
  <h2 style="margin-top:26px">Разбор cron-выражения</h2><div data-widget="cron"></div>
  <h2 style="margin-top:26px">CI/CD-пайплайн по шагам</h2><p class="small">Подробно — в модуле 4.</p><div data-widget="pipeline"></div>
  <h2 style="margin-top:26px">Rolling update в Kubernetes</h2><p class="small">Подробно — в модуле 7.</p><div data-widget="rollout"></div>`;
}

// ====== СКВОЗНОЙ СЦЕНАРИЙ ======
const JOURNEY = [
 { t:'Задача и ветка', l:'Plan · Git', d:'Задача в трекере. Разработчик создаёт короткоживущую ветку от свежего main, чтобы через день-два влить её обратно.', code:'git switch -c feat/discount-badge', lesson:'2-2' },
 { t:'Коммит', l:'Code · Git', d:'Небольшой атомарный коммит с понятным сообщением. pre-commit-хук прогоняет форматтер и ищет случайно добавленные секреты.', code:'git commit -m "feat(cart): show discount badge"', lesson:'2-1' },
 { t:'Pull request', l:'Review', d:'PR запускает CI и уведомляет ревьюеров. Ветку main защищает правило: без зелёного CI и одобрения слить нельзя.', lesson:'2-3' },
 { t:'CI: проверки', l:'CI', d:'Раннер ставит зависимости из кэша, гоняет линтер, юнит-тесты и сборку. Всё укладывается в 6 минут.', code:'lint ✓  unit 412/412 ✓  build ✓', lesson:'4-1' },
 { t:'Образ', l:'Build · Docker', d:'Multi-stage Dockerfile собирает маленький образ без компилятора, тег — SHA коммита. Образ подписывается и сканируется.', code:'registry.example.com/shop:3f9c2e1', lesson:'5-3' },
 { t:'Инфраструктура', l:'IaC · Terraform', d:'Новой фиче нужна очередь. Её описали в Terraform, план приложен к PR, применение — после ревью.', code:'Plan: 1 to add, 0 to change, 0 to destroy.', lesson:'8-2' },
 { t:'Staging', l:'CD · GitOps', d:'CI обновляет тег образа в репозитории манифестов. Argo CD замечает изменение и синхронизирует staging-кластер.', lesson:'7-4' },
 { t:'Выкатка в прод', l:'CD · canary', d:'Канарейка получает 5% трафика. Анализ сравнивает долю ошибок и p99-латентность с основной версией, потом 50%, потом 100%.', lesson:'7-2' },
 { t:'Наблюдение', l:'Ops · метрики', d:'Дашборд RED по сервису: запросы, ошибки, длительность. Логи и трейсы связаны trace_id.', lesson:'10-1' },
 { t:'Алерт', l:'Ops · SRE', d:'Через час быстро сгорает бюджет ошибок: новая фича ломает оплату у части клиентов. Дежурный получает пейдж.', code:'ALERT CheckoutErrorBudgetBurn  burn_rate=16.2', lesson:'11-2' },
 { t:'Откат и фикс', l:'Ops · инцидент', d:'Фичу выключают флагом за секунды — без деплоя. Фикс уходит обычным путём через CI.', lesson:'7-3' },
 { t:'Постмортем', l:'Learn', d:'Безобвинительный разбор: хронология, причины, задачи. Добавили контрактный тест с платёжным сервисом — цикл замкнулся.', lesson:'11-3' }
];
let journeyStep = 0;
export function viewJourney(){
  return `<div class="crumbs"><a href="#/">главная</a> / сквозной сценарий</div><h1>Путь коммита в прод</h1>
  <p style="margin:10px 0 20px;max-width:75ch">Одна небольшая фича от задачи до постмортема: что происходит на каждом этапе поставки. Каждый шаг ведёт в урок, где он разобран подробно.</p>
  <div class="journey"><ol class="jlist" id="jlist"></ol><div class="jcard" id="jcard"></div></div>`;
}
export function mountJourney(){
  const draw = () => {
    $('#jlist').innerHTML = JOURNEY.map((s, i) => `<li><button class="${i === journeyStep ? 'on' : ''} ${i < journeyStep ? 'past' : ''}" data-i="${i}"><span class="port">${String(i + 1).padStart(2, '0')}</span><span>${esc(s.t)}</span><span class="tag muted">${esc(s.l.split(' · ')[0])}</span></button></li>`).join('');
    const s = JOURNEY[journeyStep];
    if (journeyStep === JOURNEY.length - 1) Game.flag(COURSE.id + ':journey'); const L = findLesson(s.lesson);
    $('#jcard').innerHTML = `<div class="crumbs">шаг ${journeyStep + 1} из ${JOURNEY.length} · ${esc(s.l)}</div><h2>${esc(s.t)}</h2><p style="margin-top:10px">${esc(s.d)}</p>${s.code ? `<pre><code>${esc(s.code)}</code></pre>` : ''}<p class="small">Подробно: <a href="#/l/${s.lesson}">урок ${s.lesson.replace('-', '.')} «${esc(L ? L.title : '')}»</a></p><div class="row" style="margin-top:14px"><button class="btn ghost" data-d="-1" ${journeyStep === 0 ? 'disabled' : ''}>← Назад</button><button class="btn" data-d="1" ${journeyStep === JOURNEY.length - 1 ? 'disabled' : ''}>Следующий шаг →</button></div>`;
    $('#jlist').querySelectorAll('button').forEach(b => b.onclick = () => { journeyStep = +b.dataset.i; draw(); });
    $('#jcard').querySelectorAll('button[data-d]').forEach(b => b.onclick = () => { journeyStep += +b.dataset.d; draw(); });
  };
  draw();
}

// ====== ШПАРГАЛКИ ======
export function viewCheats(){
  const t = (head, rows) => `<div class="tbl"><table><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
  return `<div class="crumbs"><a href="#/">главная</a> / шпаргалки</div><h1>Шпаргалки</h1>
  <h2 style="margin-top:26px">Linux</h2>${t(['Команда','Что делает'], [['<code>systemctl status app</code>','Состояние сервиса'],['<code>journalctl -u app -f</code>','Логи сервиса в реальном времени'],['<code>ps aux --sort=-%mem | head</code>','Самые прожорливые процессы'],['<code>df -h</code> / <code>du -sh *</code>','Место на дисках / в каталоге'],['<code>free -h</code>','Память'],['<code>ss -tlnp</code>','Слушающие порты и процессы'],['<code>chmod 640 f</code>','Права rw-r-----'],['<code>tail -f /var/log/syslog</code>','Следить за логом']])}
  <h2 style="margin-top:26px">Git</h2>${t(['Команда','Что делает'], [['<code>git switch -c feat/x</code>','Новая ветка'],['<code>git rebase origin/main</code>','Переложить ветку на свежий main'],['<code>git revert &lt;sha&gt;</code>','Отменить коммит новым коммитом'],['<code>git bisect start</code>','Двоичный поиск коммита с багом'],['<code>git tag -a v1.4.0</code>','Аннотированный тег релиза'],['<code>git log --oneline --graph</code>','История графом']])}
  <h2 style="margin-top:26px">Docker</h2>${t(['Команда','Что делает'], [['<code>docker build -t app:1.0 .</code>','Собрать образ'],['<code>docker run -d -p 8080:80 app:1.0</code>','Запустить с пробросом порта'],['<code>docker ps</code> / <code>docker logs -f id</code>','Контейнеры / логи'],['<code>docker exec -it id sh</code>','Shell внутри контейнера'],['<code>docker image history app</code>','Слои образа'],['<code>docker compose up -d</code>','Поднять стек из compose.yaml'],['<code>docker system prune</code>','Удалить неиспользуемое']])}
  <h2 style="margin-top:26px">kubectl</h2>${t(['Команда','Что делает'], [['<code>kubectl get pods -o wide</code>','Поды и узлы'],['<code>kubectl describe pod p</code>','События и причины проблем'],['<code>kubectl logs p -c c --previous</code>','Логи упавшего контейнера'],['<code>kubectl apply -f k8s/</code>','Применить манифесты'],['<code>kubectl rollout status deploy/app</code>','Ход выкатки'],['<code>kubectl rollout undo deploy/app</code>','Откат'],['<code>kubectl port-forward svc/app 8080:80</code>','Доступ к сервису локально'],['<code>kubectl top pods</code>','Потребление CPU/памяти']])}
  <h2 style="margin-top:26px">Terraform</h2>${t(['Команда','Что делает'], [['<code>terraform init</code>','Скачать провайдеры, подключить backend'],['<code>terraform plan -out=tfplan</code>','Показать и сохранить план'],['<code>terraform apply tfplan</code>','Применить ровно этот план'],['<code>terraform state list</code>','Ресурсы в state'],['<code>terraform import</code>','Взять существующий ресурс под управление'],['<code>terraform fmt</code> / <code>validate</code>','Формат и проверка синтаксиса']])}
  <h2 style="margin-top:26px">Доступность</h2>${t(['SLO','Простой в месяц (30 дн)','Простой в год'], [['99%','7 ч 12 мин','3,65 дн'],['99,5%','3 ч 36 мин','1,83 дн'],['99,9%','43,2 мин','8 ч 46 мин'],['99,95%','21,6 мин','4 ч 23 мин'],['99,99%','4,3 мин','52,6 мин'],['99,999%','26 с','5,3 мин']])}
  <h2 style="margin-top:26px">Стратегии выкатки</h2>${t(['Стратегия','Плюсы','Минусы'], [['Recreate','Просто, нет двух версий сразу','Простой'],['Rolling','Без простоя, без лишних ресурсов','Две версии одновременно, медленный откат'],['Blue-green','Мгновенное переключение и откат','Двойные ресурсы, сложно с БД'],['Canary','Риск на малой доле трафика','Нужны метрики и маршрутизация'],['Feature flag','Отделяет релиз от деплоя','Долг из старых флагов']])}`;
}
