// Контент курса: модули, уроки, вопросы, глоссарий.
// Структура следует roadmap.sh/devops.
// ====== КОНТЕНТ КУРСА ======
// Типы вопросов: single | multiple | order | match | input | analyze
export const MODULES = [
{
 id: 0, title: 'Что такое DevOps', short: 'Культура, жизненный цикл, метрики DORA',
 lessons: [
 { id:'0-1', title:'Стена между разработкой и эксплуатацией', html:`
<p>Классическая картина без DevOps: разработчики пишут код и раз в квартал «перебрасывают через стену» релиз админам. У разработки цель — <b>изменения</b>, у эксплуатации — <b>стабильность</b>. Интересы противоположны, и каждый релиз превращается в многочасовую ночную операцию с ручным чек-листом.</p>
<p>Что из этого вырастает:</p>
<ul>
<li><b>Большие редкие релизы.</b> В одном релизе сотни изменений. Если что-то сломалось, непонятно, что именно.</li>
<li><b>«У меня работает».</b> Окружение разработчика не похоже на продакшен: другие версии библиотек, ОС, настройки.</li>
<li><b>Долгий цикл обратной связи.</b> Ошибку, сделанную в январе, находят в марте, когда автор уже забыл контекст.</li>
<li><b>Ручной труд.</b> Серверы настраивают руками, никто не помнит, чем они отличаются друг от друга.</li>
</ul>
<p><b>DevOps</b> — это набор практик и культура, при которой одна команда отвечает за весь путь изменения: от идеи до работы в продакшене. Принцип Amazon: <i>you build it, you run it</i> — кто написал сервис, тот и дежурит по нему.</p>
<div class="note why"><b>Зачем это разработчику.</b> DevOps — не должность «человек, который настраивает Jenkins». Это то, как вы пишете код: с тестами, конфигурацией через переменные окружения, логами и метриками, рассчитывая, что выкатывать его будут десятки раз в день.</div>
<p>Главная идея: <b>маленькие изменения, которые часто и автоматически проходят один и тот же проверенный путь в продакшен.</b> Маленькое изменение проще проверить, быстрее откатить и легче понять, если оно сломалось.</p>`,
 check: [
  { id:'q0-1a', type:'single', prompt:'Почему большие редкие релизы рискованнее частых маленьких?', options:['В них много изменений, и при сбое сложно найти виновника и откатить','Они медленнее копируются на сервер','Их нельзя протестировать','Они требуют больше дискового места'], answer:0, explanation:'Чем больше изменений в одном релизе, тем больше точек отказа и тем труднее диагностика.' },
  { id:'q0-1b', type:'single', prompt:'Что означает принцип «you build it, you run it»?', options:['Команда, написавшая сервис, отвечает и за его работу в продакшене','Каждый разработчик сам покупает себе серверы','Сборка выполняется на ноутбуке разработчика','Эксплуатацией занимается отдельный отдел'], answer:0, explanation:'Ответственность за сервис не заканчивается на мерже: команда дежурит и чинит его сама.' }
 ]},
 { id:'0-2', title:'Культура: CALMS', html:`
<p>Купить «DevOps-инструмент» нельзя. Модель <b>CALMS</b> описывает, из чего он состоит:</p>
<ul>
<li><b>Culture</b> — общая ответственность, доверие, безобвинительный разбор ошибок. Сбой — повод улучшить систему, а не найти виноватого.</li>
<li><b>Automation</b> — всё, что повторяется, автоматизировано: сборка, тесты, выкатка, создание инфраструктуры.</li>
<li><b>Lean</b> — маленькие партии работы, ограничение незавершённого, устранение ожиданий и передач между командами.</li>
<li><b>Measurement</b> — решения принимаются по данным: метрики поставки, метрики сервиса, обратная связь пользователей.</li>
<li><b>Sharing</b> — знания не заперты в головах: документация, общие репозитории, открытые постмортемы.</li>
</ul>
<h3>Три пути</h3>
<p>Книга «The Phoenix Project» формулирует DevOps как три пути:</p>
<ol class="steps">
<li><b>Поток</b> — ускорить движение работы слева направо, от разработки к пользователю.</li>
<li><b>Обратная связь</b> — быстро получать сигналы справа налево: тесты, мониторинг, жалобы.</li>
<li><b>Непрерывное обучение</b> — эксперименты, разбор ошибок, время на улучшения.</li>
</ol>
<div class="note"><b>Антипаттерн.</b> Переименовать отдел админов в «DevOps-команду» и оставить стену на месте. Теперь просто тикеты идут в другую очередь.</div>
<p>Здоровая альтернатива — <b>платформенная команда</b>: она строит самообслуживаемые инструменты (шаблоны пайплайнов, кластеры, мониторинг), а продуктовые команды пользуются ими без тикетов.</p>`,
 check: [
  { id:'q0-2a', type:'match', prompt:'Сопоставьте букву CALMS и смысл.', pairs:[['Culture','Общая ответственность и безобвинительность'],['Automation','Повторяемое делает машина'],['Lean','Маленькие партии работы'],['Measurement','Решения по данным']], explanation:'Пятая буква — Sharing: обмен знаниями.' },
  { id:'q0-2b', type:'single', prompt:'Что делает платформенная команда в DevOps-организации?', options:['Строит самообслуживаемые инструменты для продуктовых команд','Выполняет все деплои вместо разработчиков','Пишет бизнес-логику','Согласует каждый релиз'], answer:0, explanation:'Платформа убирает передачи работы: команды сами выкатывают, используя готовые инструменты.' }
 ]},
 { id:'0-3', title:'Жизненный цикл и петли обратной связи', html:`
<p>Цикл DevOps рисуют знаком бесконечности: <b>Plan → Code → Build → Test → Release → Deploy → Operate → Monitor</b> и снова Plan. Левая половина — разработка, правая — эксплуатация, а связь между ними непрерывная.</p>
<div class="tbl"><table><tr><th>Этап</th><th>Что происходит</th><th>Инструменты (примеры)</th></tr>
<tr><td>Plan</td><td>Задачи, приоритеты</td><td>Jira, GitHub Issues</td></tr>
<tr><td>Code</td><td>Код, ревью</td><td>Git, GitHub, GitLab</td></tr>
<tr><td>Build</td><td>Сборка артефакта</td><td>npm, Maven, Docker</td></tr>
<tr><td>Test</td><td>Автотесты</td><td>Jest, pytest, Playwright</td></tr>
<tr><td>Release / Deploy</td><td>Выкатка</td><td>GitHub Actions, Argo CD, Helm</td></tr>
<tr><td>Operate</td><td>Инфраструктура</td><td>Kubernetes, Terraform, облако</td></tr>
<tr><td>Monitor</td><td>Метрики, логи, алерты</td><td>Prometheus, Grafana, Loki</td></tr>
</table></div>
<h3>Скорость обратной связи</h3>
<p>Чем раньше найдена ошибка, тем дешевле её исправить. Примерная шкала:</p>
<ul>
<li>подсветка в редакторе — секунды;</li>
<li>pre-commit-хук и юнит-тесты — минуты;</li>
<li>CI на pull request — 5–15 минут;</li>
<li>staging и ручная проверка — часы;</li>
<li>баг у пользователя — дни, плюс ущерб.</li>
</ul>
<p>Отсюда термин <b>shift left</b> — сдвигать проверки «влево», ближе к моменту написания кода.</p>`,
 check: [
  { id:'q0-3a', type:'order', prompt:'Расставьте этапы цикла DevOps по порядку.', options:['Plan','Code','Build','Test','Deploy','Monitor'], answer:[0,1,2,3,4,5], explanation:'План → код → сборка → тесты → выкатка → наблюдение, и цикл повторяется.' },
  { id:'q0-3b', type:'single', prompt:'Что значит shift left?', options:['Переносить проверки на более ранние этапы','Переносить релизы на более поздний срок','Отдавать задачи другой команде','Переносить серверы в другой регион'], answer:0, explanation:'Ошибки, найденные раньше, исправлять дешевле.' }
 ]},
 { id:'0-4', title:'Метрики DORA', html:`
<p>Исследование DORA (DevOps Research and Assessment) за годы опросов тысяч компаний выделило четыре метрики, которые отличают сильные команды от слабых:</p>
<div class="tbl"><table><tr><th>Метрика</th><th>Что измеряет</th><th>Элита</th></tr>
<tr><td><b>Deployment frequency</b></td><td>Как часто выкатываемся в прод</td><td>По требованию, много раз в день</td></tr>
<tr><td><b>Lead time for changes</b></td><td>От коммита до продакшена</td><td>Меньше дня</td></tr>
<tr><td><b>Change failure rate</b></td><td>Доля выкаток, вызвавших сбой</td><td>0–15%</td></tr>
<tr><td><b>Time to restore (MTTR)</b></td><td>Сколько восстанавливаемся после сбоя</td><td>Меньше часа</td></tr>
</table></div>
<p>Первые две — про <b>скорость</b>, последние две — про <b>стабильность</b>. Главный вывод исследований: это не компромисс. Лучшие команды одновременно быстрее <i>и</i> стабильнее, потому что маленькие частые изменения безопаснее.</p>
<div class="note why"><b>Как считать.</b> Deployment frequency — из истории деплоев CI/CD. Lead time — разница между временем коммита и временем его деплоя. Change failure rate — доля деплоев, после которых был откат, хотфикс или инцидент. MTTR — из системы инцидентов.</div>
<div class="note"><b>Осторожно.</b> Метрика, ставшая целью, перестаёт быть метрикой (закон Гудхарта). Если требовать «20 деплоев в день», команды начнут выкатывать пустые изменения.</div>`,
 check: [
  { id:'q0-4a', type:'multiple', prompt:'Какие метрики DORA описывают стабильность? (несколько ответов)', options:['Change failure rate','Time to restore','Deployment frequency','Lead time for changes'], answer:[0,1], explanation:'Частота и lead time — скорость; доля сбоев и время восстановления — стабильность.' },
  { id:'q0-4b', type:'single', prompt:'Что показали исследования DORA о скорости и стабильности?', options:['Лучшие команды одновременно быстрее и стабильнее','Нужно выбирать одно из двух','Стабильность важнее, поэтому релизы должны быть редкими','Скорость не влияет на бизнес'], answer:0, explanation:'Маленькие частые изменения снижают риск каждого из них.' }
 ]}
 ],
 test: [
  { id:'t0-1', type:'single', prompt:'Что такое DevOps в первую очередь?', options:['Культура и набор практик сквозной ответственности за поставку','Название должности администратора','Конкретный CI-сервер','Язык программирования для инфраструктуры'], answer:0, explanation:'Инструменты важны, но DevOps — это прежде всего способ работы.', difficulty:1 },
  { id:'t0-2', type:'single', prompt:'Какая метрика DORA измеряет время от коммита до продакшена?', options:['Deployment frequency','Lead time for changes','Change failure rate','MTTR'], answer:1, explanation:'Lead time for changes.', difficulty:1 },
  { id:'t0-3', type:'input', prompt:'За месяц было 40 деплоев, 6 из них вызвали откат или инцидент. Какой change failure rate в процентах? Введите число.', answer:['15'], explanation:'6 / 40 = 0,15 = 15%.', difficulty:2 },
  { id:'t0-4', type:'match', prompt:'Сопоставьте путь из «трёх путей» и суть.', pairs:[['Первый путь','Поток работы к пользователю'],['Второй путь','Быстрая обратная связь'],['Третий путь','Непрерывное обучение и эксперименты']], explanation:'Поток, обратная связь, обучение.', difficulty:2 },
  { id:'t0-5', type:'single', prompt:'Компания переименовала отдел админов в «DevOps-отдел», процесс тикетов не изменился. Что это?', options:['Антипаттерн: стена осталась на месте','Правильное внедрение DevOps','Платформенная команда','SRE-подход'], answer:0, explanation:'Название поменялось, передачи работы через тикеты остались.', difficulty:1 },
  { id:'t0-6', type:'multiple', prompt:'Какие проблемы типичны для модели «перебросить через стену»? (несколько ответов)', options:['Большие редкие релизы','«У меня работает»','Долгая обратная связь','Мгновенные откаты'], answer:[0,1,2], explanation:'Мгновенные откаты — как раз признак зрелой практики.', difficulty:1 },
  { id:'t0-7', type:'single', prompt:'Где ошибку исправлять дешевле всего?', options:['В редакторе и юнит-тестах','На staging','В продакшене','После жалобы клиента'], answer:0, explanation:'Чем раньше, тем меньше контекста потеряно и ущерба нанесено.', difficulty:1 },
  { id:'t0-8', type:'single', prompt:'Руководство требует «не меньше 20 деплоев в день» от каждой команды. Какой риск?', options:['Метрика станет целью и потеряет смысл (закон Гудхарта)','Сервер не выдержит нагрузку','Git не поддерживает столько коммитов','Нарушится лицензия CI'], answer:0, explanation:'Команды начнут оптимизировать число, а не результат.', difficulty:2 },
  { id:'t0-9', type:'order', prompt:'Расположите способы обнаружить ошибку от самого быстрого к самому медленному.', options:['Подсветка в IDE','Юнит-тесты локально','CI на pull request','Тестирование на staging','Жалоба пользователя'], answer:[0,1,2,3,4], explanation:'Классическая шкала shift left.', difficulty:2 },
  { id:'t0-10', type:'single', prompt:'Что в CALMS означает Sharing?', options:['Обмен знаниями: документация, открытые постмортемы','Совместное использование серверов','Разделение бюджета','Публикация кода в open source'], answer:0, explanation:'Знания не должны быть заперты в головах отдельных людей.', difficulty:1 }
 ]
},
{
 id: 1, title: 'Язык программирования', short: 'Зачем код, Python, Go, надёжные скрипты',
 lessons: [
 { id:'1-1', title:'Зачем DevOps-инженеру программирование', html:`
<p>Роадмап DevOps начинается не с Docker, а с языка программирования. Причина простая: DevOps — это автоматизация, а автоматизация — это код. Конфигурация CI, Terraform-модули, операторы Kubernetes, скрипты миграций, обработчики алертов — всё это программы.</p>
<div class="tbl"><table><tr><th>Язык</th><th>Сильные стороны</th><th>Где встретите</th></tr>
<tr><td>Python</td><td>Простой синтаксис, огромная экосистема, SDK всех облаков</td><td>Скрипты автоматизации, Ansible-модули, AWS Lambda, утилиты</td></tr>
<tr><td>Go</td><td>Один статический бинарник, быстрый, удобная конкурентность</td><td>Docker, Kubernetes, Terraform, Prometheus, Helm — всё на Go</td></tr>
<tr><td>JavaScript / Node.js</td><td>Тот же язык, что у фронтенда</td><td>Serverless-функции, Pulumi, AWS CDK, GitHub Actions</td></tr>
<tr><td>Ruby</td><td>Выразительный DSL</td><td>Chef, Vagrant, старые проекты Puppet</td></tr>
<tr><td>Rust</td><td>Скорость и безопасность памяти</td><td>Новые инструменты: прокси, агенты сбора логов</td></tr>
</table></div>
<p>Рекомендация роадмапа — начать с <b>Python</b> или <b>Go</b> и выучить один язык хорошо, а остальные читать по мере надобности. Плюс обязательный минимум — Bash (модуль 3).</p>
<div class="note why"><b>Что нужно уметь.</b> Работать с файлами и JSON/YAML, вызывать HTTP API, запускать внешние команды, обрабатывать ошибки, писать небольшие CLI-утилиты и тесты к ним. Подробный курс языка — <a href="../python/">Python</a>.</div>`,
 check: [
  { id:'q1-1a', type:'single', prompt:'На каком языке написаны Docker, Kubernetes, Terraform и Prometheus?', options:['Go','Python','Ruby','Java'], answer:0, explanation:'Go — язык облачной инфраструктуры.' },
  { id:'q1-1b', type:'single', prompt:'Почему DevOps-инженеру нужен язык программирования?', options:['DevOps — это автоматизация, а автоматизацию пишут кодом','Чтобы заменить разработчиков','Только для собеседований','Не нужен, достаточно YAML'], answer:0, explanation:'Скрипты, утилиты, интеграции, операторы.' }
 ]},
 { id:'1-2', title:'Python для автоматизации', html:`
<p>Python — самый частый язык «склейки» в эксплуатации: проверить сертификаты, почистить старые снапшоты, собрать отчёт по расходам облака.</p>
<pre><code>import subprocess, json, sys
import boto3                                   # AWS SDK

def old_snapshots(days: int):
    ec2 = boto3.client("ec2")
    resp = ec2.describe_snapshots(OwnerIds=["self"])
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    return [s for s in resp["Snapshots"] if s["StartTime"] &lt; cutoff]

def kubectl_json(*args):
    out = subprocess.run(["kubectl", *args, "-o", "json"], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)

pods = kubectl_json("get", "pods", "-A")
crashing = [p["metadata"]["name"] for p in pods["items"]
            if any(c.get("restartCount", 0) &gt; 5 for c in p["status"].get("containerStatuses", []))]
print("\\n".join(crashing))
sys.exit(1 if crashing else 0)</code></pre>
<div class="tbl"><table><tr><th>Задача</th><th>Библиотека</th></tr>
<tr><td>HTTP API</td><td><code>requests</code>, <code>httpx</code></td></tr>
<tr><td>Облака</td><td><code>boto3</code> (AWS), <code>google-cloud-*</code>, <code>azure-*</code></td></tr>
<tr><td>Kubernetes</td><td><code>kubernetes</code> (официальный клиент)</td></tr>
<tr><td>YAML</td><td><code>pyyaml</code>, <code>ruamel.yaml</code></td></tr>
<tr><td>CLI</td><td><code>argparse</code>, <code>click</code>, <code>typer</code></td></tr>
<tr><td>SSH</td><td><code>paramiko</code>, <code>fabric</code></td></tr>
</table></div>
<p class="small">Основы языка, виртуальные окружения и стандартная библиотека — <a href="../python/">курс Python</a> (<a href="../python/#/l/7-4">7.4 — командная строка и окружение</a>).</p>`,
 check: [
  { id:'q1-2a', type:'single', prompt:'Какая библиотека — официальный AWS SDK для Python?', options:['boto3','requests','pyyaml','paramiko'], answer:0, explanation:'boto3 работает со всеми сервисами AWS.' },
  { id:'q1-2b', type:'single', prompt:'Зачем скрипту проверки возвращать ненулевой код выхода при проблеме?', options:['Чтобы CI, cron или система мониторинга поняли, что проверка не прошла','Чтобы ускорить скрипт','Так требует Python','Не нужно'], answer:0, explanation:'Код выхода — договор с вызывающей системой.' }
 ]},
 { id:'1-3', title:'Go для инфраструктурных инструментов', html:`
<p>Go создавался в Google для серверного ПО и стал языком облачной инфраструктуры.</p>
<pre><code>package main

import (
    "fmt"
    "net/http"
    "os"
    "time"
)

func main() {
    client := http.Client{Timeout: 3 * time.Second}
    for _, url := range os.Args[1:] {
        resp, err := client.Get(url)
        if err != nil || resp.StatusCode &gt;= 500 {
            fmt.Printf("DOWN %s\\n", url)
            os.Exit(1)
        }
        fmt.Printf("OK   %s %d\\n", url, resp.StatusCode)
    }
}</code></pre>
<pre><code>$ go build -o healthcheck .           # один файл без зависимостей
$ GOOS=linux GOARCH=arm64 go build    # кросс-компиляция под другую платформу
$ ./healthcheck https://shop.example/health</code></pre>
<div class="tbl"><table><tr><th>Почему Go в инфраструктуре</th><th>Что это даёт</th></tr>
<tr><td>Статический бинарник</td><td>Скопировал на сервер или в образ <code>FROM scratch</code> — работает</td></tr>
<tr><td>Горутины и каналы</td><td>Тысячи параллельных проверок или запросов</td></tr>
<tr><td>Быстрая компиляция и запуск</td><td>CLI отвечает мгновенно, мало памяти</td></tr>
<tr><td>Экосистема</td><td>client-go для Kubernetes, провайдеры Terraform, экспортеры Prometheus</td></tr>
</table></div>
<div class="note">Читать Go нужно хотя бы для того, чтобы разбираться в исходниках инструментов, которыми пользуетесь: почему падает оператор, как устроен провайдер Terraform.</div>`,
 check: [
  { id:'q1-3a', type:'single', prompt:'Главное удобство Go-утилиты при развёртывании?', options:['Один статический бинарник без внешних зависимостей','Не нужна компиляция','Работает только в Kubernetes','Нужен установленный runtime'], answer:0, explanation:'Можно положить даже в образ FROM scratch.' },
  { id:'q1-3b', type:'single', prompt:'Как собрать Go-программу под Linux ARM на ноутбуке с macOS?', options:['GOOS=linux GOARCH=arm64 go build','Только на Linux-машине','Через Docker обязательно','Нельзя'], answer:0, explanation:'Кросс-компиляция встроена.' }
 ]},
 { id:'1-4', title:'Надёжные скрипты автоматизации', html:`
<p>Скрипт, который «работает у меня», в автоматизации опасен: его запустят ночью по cron, из CI, на 300 серверах одновременно. Правила хорошего инструмента:</p>
<div class="tbl"><table><tr><th>Свойство</th><th>Что значит</th></tr>
<tr><td><b>Идемпотентность</b></td><td>Повторный запуск не ломает и не дублирует: «создать, если нет», а не «создать»</td></tr>
<tr><td>Явные ошибки</td><td>Падать с понятным сообщением и ненулевым кодом, не продолжать после сбоя</td></tr>
<tr><td>Режим dry-run</td><td>Показать, что будет сделано, ничего не меняя</td></tr>
<tr><td>Конфигурация снаружи</td><td>Аргументы и переменные окружения, а не правка кода</td></tr>
<tr><td>Логи</td><td>Что делается и с каким результатом, без паролей</td></tr>
<tr><td>Таймауты и повторы</td><td>Сеть ненадёжна; повторять только безопасные операции</td></tr>
<tr><td>Тесты и ревью</td><td>Код автоматизации — тоже код, он живёт в Git и проходит CI</td></tr>
</table></div>
<pre><code># Не идемпотентно: второй запуск добавит строку ещё раз
echo "vm.swappiness=10" &gt;&gt; /etc/sysctl.conf

# Идемпотентно
grep -q '^vm.swappiness=' /etc/sysctl.conf || echo "vm.swappiness=10" &gt;&gt; /etc/sysctl.conf</code></pre>
<div class="note why"><b>Когда скрипт перерастает себя.</b> Если скрипт управляет состоянием десятков серверов или облачных ресурсов, вы изобретаете Ansible или Terraform. Переходите на инструмент управления конфигурацией и IaC (модуль 9) — идемпотентность там встроена.</div>`,
 check: [
  { id:'q1-4a', type:'single', prompt:'Что значит «скрипт идемпотентен»?', options:['Повторный запуск даёт тот же результат и ничего не дублирует','Скрипт работает быстро','Скрипт без ошибок','Скрипт запускается только один раз'], answer:0, explanation:'Основа надёжной автоматизации.' },
  { id:'q1-4b', type:'single', prompt:'Зачем режим --dry-run?', options:['Показать планируемые изменения, ничего не выполняя','Ускорить выполнение','Скрыть логи','Удалить временные файлы'], answer:0, explanation:'Как terraform plan.' }
 ]}
 ],
 test: [
  { id:'t1-1', type:'match', prompt:'Сопоставьте язык и типичное применение в DevOps.', pairs:[['Go','Kubernetes, Terraform, CLI-утилиты'],['Python','Скрипты автоматизации, SDK облаков'],['Ruby','Chef, Vagrant'],['JavaScript','Pulumi, CDK, serverless-функции']], explanation:'Языки экосистемы.', difficulty:1 },
  { id:'t1-2', type:'single', prompt:'Скрипт добавляет строку в конфиг при каждом запуске, и после 10 запусков в файле 10 одинаковых строк. Чего ему не хватает?', options:['Идемпотентности','Многопоточности','Типизации','Комментариев'], answer:0, explanation:'Проверяйте состояние перед изменением.', difficulty:1 },
  { id:'t1-3', type:'single', prompt:'Почему Go-утилиты удобно класть в минимальные Docker-образы?', options:['Статический бинарник не требует интерпретатора и библиотек','Go не нужен процессор','Go работает только в контейнерах','Образ получается больше'], answer:0, explanation:'Можно даже FROM scratch.', difficulty:2 },
  { id:'t1-4', type:'single', prompt:'Где хранить код автоматизации?', options:['В Git, с ревью и CI, как любой другой код','На сервере в домашней папке','В чате команды','В заметках'], answer:0, explanation:'Автоматизация — тоже код.', difficulty:1 },
  { id:'t1-5', type:'multiple', prompt:'Какие свойства должны быть у скрипта, запускаемого по cron на сотне серверов? (несколько ответов)', options:['Идемпотентность','Понятные ошибки и код выхода','Таймауты на сетевые вызовы','Пароли прямо в коде'], answer:[0,1,2], explanation:'Секреты — из окружения или хранилища.', difficulty:1 },
  { id:'t1-6', type:'single', prompt:'Какую библиотеку Python использовать для работы с Kubernetes API?', options:['kubernetes (официальный клиент)','boto3','pandas','flask'], answer:0, explanation:'Есть и вызов kubectl через subprocess.', difficulty:2 },
  { id:'t1-7', type:'single', prompt:'Когда пора заменить самописный скрипт на Ansible или Terraform?', options:['Когда скрипт управляет состоянием многих серверов или облачных ресурсов','Никогда','Когда в скрипте больше 10 строк','Когда скрипт на Python'], answer:0, explanation:'Не изобретайте управление конфигурацией заново.', difficulty:2 },
  { id:'t1-8', type:'single', prompt:'Какой язык роадмап рекомендует начать изучать первым?', options:['Python или Go','COBOL','Assembler','Только Bash'], answer:0, explanation:'Bash нужен в дополнение.', difficulty:1 }
 ]
},
{
 id: 2, title: 'Операционные системы', short: 'Дистрибутивы, процессы, права, systemd',
 lessons: [
 { id:'2-1', title:'Операционные системы для серверов', html:`
<p>Подавляющее большинство серверов, контейнеров и облачных машин работает на <b>Linux</b>. Поэтому роадмап делает упор на него, но упоминает и другие системы.</p>
<div class="tbl"><table><tr><th>Семейство</th><th>Примеры</th><th>Пакеты</th><th>Где</th></tr>
<tr><td>Debian</td><td>Debian, Ubuntu</td><td><code>apt</code>, .deb</td><td>Облака, контейнеры, разработка</td></tr>
<tr><td>Red Hat</td><td>RHEL, Rocky Linux, AlmaLinux, Fedora</td><td><code>dnf</code>/<code>yum</code>, .rpm</td><td>Корпоративные серверы, долгая поддержка</td></tr>
<tr><td>SUSE</td><td>SLES, openSUSE</td><td><code>zypper</code></td><td>Европейский enterprise, SAP</td></tr>
<tr><td>Alpine</td><td>Alpine Linux</td><td><code>apk</code></td><td>Маленькие Docker-образы (musl вместо glibc)</td></tr>
<tr><td>BSD</td><td>FreeBSD, OpenBSD, NetBSD</td><td><code>pkg</code>, порты</td><td>Сетевые устройства, файрволы, хранилища</td></tr>
<tr><td>Windows Server</td><td>Windows Server 2022/2025</td><td><code>winget</code>, MSI</td><td>.NET Framework, Active Directory, IIS</td></tr>
</table></div>
<pre><code>$ cat /etc/os-release          # какой дистрибутив
$ uname -r                     # версия ядра
$ sudo apt update &amp;&amp; sudo apt install -y nginx       # Debian/Ubuntu
$ sudo dnf install -y nginx                          # RHEL/Rocky</code></pre>
<ul>
<li><b>Unix</b> — исторический предок: Linux и BSD «Unix-подобны», поэтому навыки переносятся (shell, права, процессы).</li>
<li><b>LTS-версии</b> (Ubuntu 24.04 LTS, RHEL 9) получают обновления безопасности годами — их и ставят на серверы.</li>
<li>Серверы обычно без графики: всё управление — через SSH и терминал.</li>
</ul>
<div class="note why">Выберите для практики один дистрибутив (обычно Ubuntu) и освойте его глубоко; отличия других семейств — в основном пакетный менеджер и пути конфигурации.</div>`,
 check: [
  { id:'q2-1a', type:'match', prompt:'Сопоставьте дистрибутив и пакетный менеджер.', pairs:[['Ubuntu','apt'],['Rocky Linux','dnf'],['Alpine','apk'],['openSUSE','zypper']], explanation:'Главное отличие семейств.' },
  { id:'q2-1b', type:'single', prompt:'Почему на серверы ставят LTS-версии?', options:['Долгий срок поддержки и обновлений безопасности','Они быстрее','В них больше программ','Так требует Docker'], answer:0, explanation:'Стабильность важнее новизны.' }
 ]},
 { id:'2-2', title:'Процессы и сигналы', html:`
<p>Почти весь продакшен работает на Linux, и даже контейнер — это просто процесс Linux с ограничениями. Поэтому базовая грамотность в процессах обязательна.</p>
<p><b>Процесс</b> — запущенная программа: у него есть <b>PID</b>, родитель (PPID), пользователь, открытые файлы и переменные окружения. Процесс с PID 1 — <code>init</code> (обычно systemd) — родитель всех остальных.</p>
<pre><code>$ ps aux --sort=-%cpu | head -4
USER   PID %CPU %MEM    VSZ   RSS STAT COMMAND
app   2314 87.0 12.1 1843220 492k Sl  node dist/server.js
pg     911  6.2  4.0  220144 163k Ss  postgres: checkpointer
root     1  0.0  0.1  168904  12k Ss  /sbin/init</code></pre>
<h3>Сигналы</h3>
<div class="tbl"><table><tr><th>Сигнал</th><th>Номер</th><th>Смысл</th></tr>
<tr><td>SIGTERM</td><td>15</td><td>Вежливая просьба завершиться. Можно перехватить и закончить работу.</td></tr>
<tr><td>SIGKILL</td><td>9</td><td>Немедленное убийство ядром. Перехватить нельзя.</td></tr>
<tr><td>SIGINT</td><td>2</td><td>Ctrl+C в терминале.</td></tr>
<tr><td>SIGHUP</td><td>1</td><td>Часто — «перечитай конфиг» (nginx, многие демоны).</td></tr>
</table></div>
<div class="note why"><b>Graceful shutdown.</b> Kubernetes, Docker и systemd при остановке шлют SIGTERM, ждут (по умолчанию 30 с / 10 с) и только потом SIGKILL. Приложение должно на SIGTERM перестать принимать новые запросы, доделать текущие и выйти. Иначе каждый деплой обрывает пользователям запросы.</div>
<pre><code>process.on('SIGTERM', () => {
  server.close(() => process.exit(0)); // дождаться активных запросов
});</code></pre>
<p><b>Код возврата</b> (exit code): 0 — успех, всё остальное — ошибка. CI, shell и оркестраторы ориентируются именно на него. 137 = 128 + 9 — процесс убит SIGKILL (часто из-за нехватки памяти, OOM).</p>`,
 check: [
  { id:'q2-2a', type:'single', prompt:'Какой сигнал нельзя перехватить в приложении?', options:['SIGKILL','SIGTERM','SIGINT','SIGHUP'], answer:0, explanation:'SIGKILL обрабатывает ядро, процесс не получает шанса отреагировать.' },
  { id:'q2-2b', type:'input', prompt:'Контейнер завершился с кодом 137. Каким сигналом (номер) он был убит? Введите число.', answer:['9'], explanation:'137 − 128 = 9, то есть SIGKILL — часто это OOM killer.' }
 ]},
 { id:'2-3', title:'Файлы, права и пользователи', html:`
<p>В Linux «всё — файл»: конфиги, логи, устройства, даже информация о процессах (<code>/proc</code>). Важные каталоги:</p>
<ul>
<li><code>/etc</code> — конфигурация; <code>/var/log</code> — логи; <code>/var/lib</code> — данные сервисов;</li>
<li><code>/home</code> — домашние каталоги; <code>/tmp</code> — временные файлы; <code>/opt</code> — стороннее ПО.</li>
</ul>
<h3>Права</h3>
<pre><code>$ ls -l deploy.sh
-rwxr-x---  1 app  devops  812 Oct 3 10:12 deploy.sh
 └┬┘└┬┘└┬┘     │     │
 user group other  владелец группа</code></pre>
<p>Три тройки <b>r</b> (чтение, 4), <b>w</b> (запись, 2), <b>x</b> (выполнение, 1) — для владельца, группы и остальных. <code>rwxr-x---</code> = 7, 5, 0 = <code>750</code>.</p>
<pre><code>chmod 640 app.env      # rw-r----- : владелец пишет, группа читает
chown app:app /var/lib/app
chmod +x deploy.sh</code></pre>
<div class="note"><b>Принцип наименьших привилегий.</b> Сервисы не должны работать от root. Создайте отдельного пользователя без shell, дайте ему права только на свои каталоги. Если сервис взломают, атакующий получит лишь эти права.</div>
<p><code>sudo</code> выполняет одну команду от root и пишет это в журнал аудита — это лучше, чем постоянно сидеть под root. Файл с секретами — права <code>600</code> или <code>640</code>, никогда <code>777</code>.</p>`,
 check: [
  { id:'q2-3a', type:'input', prompt:'Какое числовое значение соответствует правам rw-r--r--? Введите три цифры.', answer:['644'], explanation:'rw- = 6, r-- = 4, r-- = 4.' },
  { id:'q2-3b', type:'single', prompt:'Почему сервис не стоит запускать от root?', options:['При взломе атакующий получит полный контроль над системой','root работает медленнее','root не может открыть порты','Так требует лицензия Linux'], answer:0, explanation:'Принцип наименьших привилегий ограничивает ущерб.' }
 ]},
 { id:'2-4', title:'systemd и журналы', html:`
<p><b>systemd</b> — менеджер сервисов в большинстве дистрибутивов. Он запускает демоны, перезапускает упавшие, управляет зависимостями и собирает логи.</p>
<pre><code># /etc/systemd/system/shop.service
[Unit]
Description=Shop API
After=network-online.target

[Service]
User=shop
WorkingDirectory=/opt/shop
EnvironmentFile=/etc/shop/env
ExecStart=/usr/bin/node dist/server.js
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target</code></pre>
<pre><code>sudo systemctl daemon-reload        # перечитать unit-файлы
sudo systemctl enable --now shop    # автозапуск + запуск сейчас
systemctl status shop               # состояние, PID, последние строки лога
journalctl -u shop -f               # логи в реальном времени
journalctl -u shop --since "10 min ago" -p err</code></pre>
<p><code>Restart=on-failure</code> — systemd сам поднимет сервис после падения. Но это не замена разбору причины: если сервис падает в цикле, systemd остановит попытки (<code>StartLimitBurst</code>).</p>
<div class="note why"><b>Логи — в stdout.</b> Приложению не нужно самому писать в файлы и ротировать их. Пишите в stdout/stderr: systemd отправит это в journald, Docker — в свой драйвер логов, Kubernetes — в логи пода. Это один из принципов 12-factor (модуль 15).</div>`,
 check: [
  { id:'q2-4a', type:'single', prompt:'Какая команда покажет логи сервиса shop в реальном времени?', options:['journalctl -u shop -f','systemctl logs shop','tail shop','ps shop'], answer:0, explanation:'-u — unit, -f — follow.' },
  { id:'q2-4b', type:'single', prompt:'Что нужно выполнить после изменения unit-файла?', options:['systemctl daemon-reload','reboot','journalctl --vacuum','chmod +x на unit-файл'], answer:0, explanation:'systemd кэширует unit-файлы, daemon-reload перечитывает их.' }
 ]}
 ],
 test: [
  { id:'t2-1', type:'single', prompt:'Что Kubernetes шлёт процессу контейнера в первую очередь при остановке пода?', options:['SIGTERM','SIGKILL','SIGHUP','SIGSTOP'], answer:0, explanation:'Сначала SIGTERM и время на graceful shutdown, потом SIGKILL.', difficulty:1 },
  { id:'t2-2', type:'input', prompt:'Какие права в числовом виде у rwxr-x---? Введите три цифры.', answer:['750'], explanation:'7, 5, 0.', difficulty:1 },
  { id:'t2-3', type:'analyze', prompt:'Что, скорее всего, случилось с сервисом?', code:'$ systemctl status shop\n● shop.service - Shop API\n   Active: failed (Result: start-limit-hit)\n...\nshop[2210]: Error: Cannot find module \'/opt/shop/dist/server.js\'', options:['Сервис многократно падал при старте: нет собранного файла, systemd прекратил перезапуски','Закончилась память','Неверные права на журнал','Сервис работает нормально'], answer:0, explanation:'start-limit-hit — перезапуски исчерпаны; причина — отсутствующий dist/server.js.', difficulty:2 },
  { id:'t2-4', type:'match', prompt:'Сопоставьте каталог и назначение.', pairs:[['/etc','Конфигурация'],['/var/log','Логи'],['/proc','Информация о процессах'],['/home','Домашние каталоги']], explanation:'Стандартная иерархия файловой системы.', difficulty:1 },
  { id:'t2-5', type:'single', prompt:'Как правильно реагировать приложению на SIGTERM?', options:['Перестать принимать новые запросы, доделать текущие и выйти','Сразу выйти с кодом 1','Проигнорировать','Перезапуститься'], answer:0, explanation:'Это graceful shutdown.', difficulty:1 },
  { id:'t2-6', type:'single', prompt:'Какой файл показывает дистрибутив Linux и его версию?', options:['/etc/os-release','/etc/passwd','/proc/cpuinfo','/var/log/syslog'], answer:0, explanation:'uname -r — версия ядра.', difficulty:1 },
  { id:'t2-7', type:'single', prompt:'Почему в Alpine-образах иногда ломаются бинарники, собранные под Ubuntu?', options:['Alpine использует musl вместо glibc','Alpine — это не Linux','Alpine не поддерживает x86','Нет bash по умолчанию — и только поэтому'], answer:0, explanation:'Разные стандартные библиотеки C.', difficulty:3 },
  { id:'t2-8', type:'single', prompt:'Где чаще всего встречаются FreeBSD и OpenBSD?', options:['Сетевые устройства, файрволы, системы хранения','Смартфоны','Игровые консоли — только там','Нигде'], answer:0, explanation:'pfSense, OPNsense, NetApp и т. п.', difficulty:2 }
 ]
},
{
 id: 3, title: 'Терминал', short: 'Мониторинг, сетевые утилиты, обработка текста, Bash',
 lessons: [
 { id:'3-1', title:'Мониторинг процессов и производительности', html:`
<p>Сервер «тормозит». Первые пять минут диагностики проходят в терминале — по методу USE: для каждого ресурса смотрим <b>утилизацию</b>, <b>насыщение</b> (очередь) и <b>ошибки</b>.</p>
<pre><code>$ uptime                       # load average за 1, 5, 15 минут
 10:42:01 up 12 days,  load average: 7.85, 6.10, 3.02     ← больше числа ядер — очередь на CPU
$ top / htop                   # процессы, CPU, память в реальном времени
$ ps aux --sort=-%mem | head   # самые прожорливые по памяти
$ free -h                      # память: used, available, swap
$ vmstat 1                     # r — очередь на CPU, si/so — swap, wa — ожидание диска
$ iostat -xz 1                 # %util и await дисков
$ df -h ; du -sh /var/log/*    # место на дисках
$ lsof -p 1234                 # открытые файлы и сокеты процесса
$ strace -p 1234 -f            # системные вызовы: где процесс висит
$ dmesg -T | tail              # сообщения ядра: OOM killer, ошибки дисков</code></pre>
<div class="tbl"><table><tr><th>Ресурс</th><th>Признак проблемы</th><th>Инструмент</th></tr>
<tr><td>CPU</td><td>load &gt; ядер, высокий %us/%sy</td><td>top, vmstat, mpstat</td></tr>
<tr><td>Память</td><td>available мало, swap растёт, OOM в dmesg</td><td>free, vmstat, dmesg</td></tr>
<tr><td>Диск</td><td>%util около 100, большой await, место кончилось</td><td>iostat, df, du</td></tr>
<tr><td>Сеть</td><td>Ошибки, переполнение очередей</td><td>ss, ip -s link, nstat</td></tr>
</table></div>
<div class="note why">Терминальные утилиты дают моментальный срез одной машины. Историю и картину по сотне серверов дают системы мониторинга (модуль 13) — но когда алерт сработал, вы всё равно зайдёте на сервер с этими командами.</div>`,
 check: [
  { id:'q3-1a', type:'single', prompt:'На 4-ядерном сервере load average 12. Что это значит?', options:['Очередь процессов на CPU примерно втрое больше, чем ядер','Используется 12% CPU','12 процессов всего','Сервер простаивает'], answer:0, explanation:'Load — среднее число готовых к выполнению и ждущих процессов.' },
  { id:'q3-1b', type:'single', prompt:'Где увидеть, что процесс убил OOM killer?', options:['dmesg / журнал ядра','df -h','uptime','git log'], answer:0, explanation:'Ядро пишет «Out of memory: Killed process».' }
 ]},
 { id:'3-2', title:'Сетевые утилиты', html:`
<pre><code>$ ip a ; ip r                          # адреса интерфейсов и маршруты
$ ping -c 4 10.0.1.5                   # доступен ли хост (ICMP)
$ traceroute / mtr shop.example        # путь пакетов и где теряются
$ dig shop.example +short              # DNS: во что резолвится имя
$ dig @8.8.8.8 shop.example MX         # конкретный тип записи у конкретного сервера
$ curl -sv https://shop.example/health # HTTP с заголовками и TLS-рукопожатием
$ curl -o /dev/null -w "%{time_connect} %{time_starttransfer} %{http_code}\\n" URL
$ ss -tlnp                             # кто слушает какие порты
$ ss -tn state established             # активные соединения
$ nc -zv db.internal 5432              # открыт ли порт
$ sudo tcpdump -i eth0 port 443 -n     # перехват пакетов
$ openssl s_client -connect shop.example:443 -servername shop.example   # сертификат</code></pre>
<h3>Диагностика «сервис недоступен» снизу вверх</h3>
<ol class="steps">
<li>Имя резолвится? — <code>dig</code></li>
<li>Хост доступен по сети? — <code>ping</code>, <code>mtr</code> (ICMP могут резать файрволы)</li>
<li>Порт открыт? — <code>nc -zv</code>, на сервере <code>ss -tlnp</code></li>
<li>TLS в порядке? — <code>openssl s_client</code>, <code>curl -v</code></li>
<li>Приложение отвечает правильно? — <code>curl</code> и логи</li>
</ol>
<p class="small">Подробно о методике и tcpdump — <a href="../network/#/l/12-1">Сети 12.1–12.3</a>.</p>`,
 check: [
  { id:'q3-2a', type:'single', prompt:'Какая команда покажет, какой процесс слушает порт 8080?', options:['ss -tlnp','ping','dig','df -h'], answer:0, explanation:'-t TCP, -l слушающие, -n числами, -p процессы.' },
  { id:'q3-2b', type:'order', prompt:'Расставьте шаги диагностики недоступного сервиса снизу вверх.', options:['DNS-имя резолвится','Хост доступен по сети','Порт открыт','TLS в порядке','Приложение отвечает'], answer:[0,1,2,3,4], explanation:'От сети к приложению.' }
 ]},
 { id:'3-3', title:'Обработка текста и редакторы', html:`
<p>Логи, конфиги и вывод команд — текст. Unix-философия: маленькие утилиты, соединённые конвейером <code>|</code>.</p>
<pre><code>$ grep -i "error" app.log | wc -l                       # сколько ошибок
$ grep -rn "listen" /etc/nginx/                         # где в конфигах
$ tail -f app.log | grep --line-buffered 500            # следить за 500-ми
$ awk '{print $9}' access.log | sort | uniq -c | sort -rn   # статистика кодов ответа
$ awk '$10 &gt; 1000000 {print $7}' access.log             # запросы с ответом больше 1 МБ
$ cut -d: -f1 /etc/passwd                               # первое поле
$ sed -i 's/workers 2/workers 4/' app.conf              # замена в файле
$ sed -n '100,120p' big.log                             # строки 100–120
$ kubectl get pods -o json | jq -r '.items[] | select(.status.phase != "Running") | .metadata.name'
$ yq '.spec.replicas' deployment.yaml                   # jq для YAML</code></pre>
<div class="tbl"><table><tr><th>Утилита</th><th>Для чего</th></tr>
<tr><td><code>grep</code></td><td>Найти строки по шаблону</td></tr>
<tr><td><code>sed</code></td><td>Заменить, удалить, вырезать строки</td></tr>
<tr><td><code>awk</code></td><td>Работа со столбцами, подсчёты</td></tr>
<tr><td><code>sort</code>, <code>uniq</code>, <code>wc</code>, <code>head</code>, <code>tail</code></td><td>Сортировка, уникальные, подсчёт, начало и конец</td></tr>
<tr><td><code>jq</code>, <code>yq</code></td><td>Запросы к JSON и YAML</td></tr>
</table></div>
<h3>Редакторы в терминале</h3>
<p>На сервере не будет VS Code. Нужно уверенно владеть хотя бы одним консольным редактором:</p>
<ul>
<li><b>nano</b> — проще всего: подсказки внизу, <code>Ctrl+O</code> сохранить, <code>Ctrl+X</code> выйти.</li>
<li><b>vim</b> — есть везде. Минимум: <code>i</code> — вставка, <code>Esc</code> — обычный режим, <code>:wq</code> — сохранить и выйти, <code>:q!</code> — выйти без сохранения, <code>/текст</code> — поиск.</li>
<li><b>Emacs</b> — мощный, но на серверах встречается реже.</li>
</ul>`,
 check: [
  { id:'q3-3a', type:'single', prompt:'Какая утилита удобнее всего для выборки полей из JSON-вывода kubectl?', options:['jq','sed','cut','wc'], answer:0, explanation:'jq — язык запросов к JSON.' },
  { id:'q3-3b', type:'single', prompt:'Как выйти из vim без сохранения?', options:[':q!','Ctrl+C','exit','Ctrl+X'], answer:0, explanation:'Из обычного режима после Esc.' }
 ]},
 { id:'3-4', title:'Shell-скрипты и cron', html:`
<p>Bash-скрипт — клей между инструментами. Хороший скрипт падает сразу при первой ошибке, а не продолжает работу в сломанном состоянии:</p>
<pre><code>#!/usr/bin/env bash
set -euo pipefail   # -e: выход при ошибке, -u: неопределённая переменная — ошибка,
                    # pipefail: ошибка в любой части конвейера — ошибка всего
BACKUP="/backups/db-$(date +%F).sql.gz"
pg_dump "$DATABASE_URL" | gzip > "$BACKUP"
find /backups -name 'db-*.sql.gz' -mtime +14 -delete
echo "ok: $BACKUP"</code></pre>
<div class="note"><b>Кавычки.</b> Всегда пишите <code>"$VAR"</code>. Без кавычек пробел в значении разобьёт аргумент на два, а пустая переменная исчезнет совсем. Знаменитый баг: <code>rm -rf $DIR/</code> при пустом <code>DIR</code> превращается в <code>rm -rf /</code>.</div>
<h3>Cron</h3>
<p>Cron запускает команды по расписанию. Пять полей: минута, час, день месяца, месяц, день недели.</p>
<pre><code># crontab -e
30 2 * * *   /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
*/5 * * * *  /opt/scripts/healthcheck.sh</code></pre>
<div data-widget="cron"></div>
<p>Подводные камни: cron запускает команды с минимальным <code>PATH</code> и без вашего окружения; время — в часовом поясе сервера; если задача упала, никто не узнает, пока не настроите мониторинг. В Kubernetes аналог — <b>CronJob</b>, в systemd — <b>таймеры</b>.</p>`,
 check: [
  { id:'q3-4a', type:'single', prompt:'Когда выполнится задача с расписанием 0 3 * * 1?', options:['Каждый понедельник в 03:00','Каждый день в 01:03','3 января','Каждые 3 часа по понедельникам'], answer:0, explanation:'Минута 0, час 3, любой день, любой месяц, день недели 1 — понедельник.' },
  { id:'q3-4b', type:'single', prompt:'Что делает set -e в bash-скрипте?', options:['Завершает скрипт при первой ошибке команды','Включает эхо всех команд','Экспортирует все переменные','Запрещает запуск от root'], answer:0, explanation:'Без -e скрипт продолжит работу после упавшей команды.' }
 ]}
 ],
 test: [
  { id:'t3-1', type:'single', prompt:'Куда приложению лучше всего писать логи в современной инфраструктуре?', options:['В stdout/stderr','В файл в /tmp','В базу данных напрямую','Никуда'], answer:0, explanation:'Сбор и ротацию берёт на себя окружение: journald, Docker, Kubernetes.', difficulty:1 },
  { id:'t3-2', type:'single', prompt:'Почему в скрипте нужно писать "$DIR", а не $DIR?', options:['Чтобы пробелы и пустое значение не ломали аргументы','Так быстрее','Иначе переменная не экспортируется','Кавычки включают set -e'], answer:0, explanation:'Без кавычек значение разбивается по пробелам, а пустое — исчезает.', difficulty:2 },
  { id:'t3-3', type:'single', prompt:'Скрипт работает руками, но по cron падает с «command not found». Самая вероятная причина?', options:['У cron минимальный PATH и нет окружения пользователя','Cron не поддерживает bash','Неверный часовой пояс','Нет прав на /etc/crontab'], answer:0, explanation:'Используйте абсолютные пути или задайте PATH в crontab.', difficulty:2 },
  { id:'t3-4', type:'multiple', prompt:'Что делает set -euo pipefail? (несколько ответов)', options:['Выход при ошибке команды','Ошибка при обращении к неопределённой переменной','Ошибка в любой части конвейера считается ошибкой','Автоматически повторяет упавшие команды'], answer:[0,1,2], explanation:'Повторов set не делает.', difficulty:2 },
  { id:'t3-5', type:'input', prompt:'Сколько раз в час выполнится задача */15 * * * *? Введите число.', answer:['4'], explanation:'В минуты 0, 15, 30 и 45.', difficulty:1 },
  { id:'t3-6', type:'analyze', prompt:'Что делает конвейер?', code:'awk \'{print $9}\' access.log | sort | uniq -c | sort -rn | head -3', options:['Показывает три самых частых кода ответа и их количество','Удаляет 3 строки','Сортирует файл по IP','Считает строки'], answer:0, explanation:'9-е поле combined-лога — код ответа.', difficulty:2 },
  { id:'t3-7', type:'single', prompt:'vmstat показывает большие значения si/so. Что происходит?', options:['Активный своп: памяти не хватает','Диск свободен','Сеть перегружена','CPU простаивает'], answer:0, explanation:'swap in / swap out.', difficulty:2 },
  { id:'t3-8', type:'single', prompt:'Как проверить, открыт ли порт 5432 на db.internal, без клиента PostgreSQL?', options:['nc -zv db.internal 5432','ping db.internal 5432','dig db.internal','df db.internal'], answer:0, explanation:'Проверка TCP-соединения.', difficulty:1 }
 ]
},
{
 id: 4, title: 'Git и VCS-хостинг', short: 'История, ветвление, PR, GitHub и GitLab, релизы',
 lessons: [
 { id:'4-1', title:'Коммиты и хорошая история', html:`
<p>Git — источник правды не только для кода, но в DevOps и для инфраструктуры, конфигурации и пайплайнов. Всё, что меняет продакшен, должно проходить через репозиторий.</p>
<p>Хороший коммит — <b>атомарный</b>: одно логическое изменение, после которого проект собирается и тесты проходят. Тогда <code>git revert</code> и <code>git bisect</code> работают как задумано.</p>
<h3>Conventional Commits</h3>
<pre><code>feat(cart): show discount badge
fix(api): handle empty coupon code
chore(deps): bump express to 4.19.2
feat(auth)!: drop legacy session tokens   # ! — ломающее изменение</code></pre>
<p>Единый формат сообщений позволяет автоматически собирать changelog и вычислять следующую версию (урок 2-4).</p>
<h3>Чего не должно быть в репозитории</h3>
<ul>
<li><b>Секреты</b>: пароли, токены, ключи. Удалённый коммит всё равно остаётся в истории и форках — секрет считается скомпрометированным, его нужно отозвать.</li>
<li><b>Артефакты сборки</b> и <code>node_modules</code> — их создаёт CI.</li>
<li><b>Большие бинарники</b> — для них есть Git LFS или хранилище артефактов.</li>
</ul>
<p>Защитные сети: <code>.gitignore</code>, pre-commit-хуки (форматтер, линтер, поиск секретов через gitleaks) и сканирование на стороне хостинга.</p>`,
 check: [
  { id:'q4-1a', type:'single', prompt:'Вы случайно закоммитили API-ключ и запушили. Что обязательно сделать?', options:['Отозвать и перевыпустить ключ','Достаточно удалить файл следующим коммитом','Сделать репозиторий приватным','Ничего, если никто не заметил'], answer:0, explanation:'Ключ остаётся в истории, кэшах и форках — он скомпрометирован.' },
  { id:'q4-1b', type:'single', prompt:'Какой префикс Conventional Commits означает исправление ошибки?', options:['fix','feat','chore','docs'], answer:0, explanation:'fix — исправление, feat — новая функциональность.' }
 ]},
 { id:'4-2', title:'Стратегии ветвления', html:`
<p>Стратегия ветвления определяет, как быстро код попадает в общую ветку — а значит, как часто команда интегрируется.</p>
<h3>GitFlow</h3>
<p>Ветки <code>develop</code>, <code>feature/*</code>, <code>release/*</code>, <code>hotfix/*</code>, <code>main</code>. Подходит для продуктов с редкими версионными релизами (коробочное ПО, мобильные приложения). Минус: долгоживущие ветки расходятся, слияния болезненны.</p>
<h3>GitHub Flow</h3>
<p>Есть только <code>main</code>, который всегда готов к выкатке, и короткие ветки под задачу. PR → ревью → CI → слияние → деплой.</p>
<h3>Trunk-based development</h3>
<p>Все сливаются в <code>main</code> (trunk) минимум раз в день. Ветки живут часы, не недели. Незаконченная функциональность скрыта <b>feature-флагами</b>. Это рекомендация DORA для высокой скорости поставки.</p>
<div class="tbl"><table><tr><th></th><th>GitFlow</th><th>GitHub Flow</th><th>Trunk-based</th></tr>
<tr><td>Жизнь веток</td><td>недели</td><td>дни</td><td>часы</td></tr>
<tr><td>Релизы</td><td>по расписанию</td><td>после слияния</td><td>непрерывно</td></tr>
<tr><td>Конфликты слияния</td><td>частые и крупные</td><td>умеренные</td><td>мелкие</td></tr></table></div>
<div class="note why"><b>Merge hell.</b> Ветка, прожившая месяц, расходится с main на сотни коммитов. Её слияние — отдельный проект. Частая интеграция превращает один большой конфликт в много крошечных.</div>`,
 check: [
  { id:'q4-2a', type:'single', prompt:'Что характерно для trunk-based development?', options:['Слияние в main хотя бы раз в день, незаконченное — за флагами','Отдельная ветка develop и release-ветки','Ветки живут до релиза','Каждый разработчик работает в своём форке месяцами'], answer:0, explanation:'Короткие ветки и флаги — суть trunk-based.' },
  { id:'q4-2b', type:'single', prompt:'Для какого продукта GitFlow оправдан больше всего?', options:['Коробочное ПО с версиями, которые поддерживаются параллельно','Веб-сервис с деплоем по каждому коммиту','Внутренний скрипт','Лендинг'], answer:0, explanation:'Релизные ветки нужны, когда несколько версий живут одновременно.' }
 ]},
 { id:'4-3', title:'Pull request и code review', html:`
<p>Pull request (merge request в GitLab) — точка, где сходятся ревью, автоматические проверки и история решений.</p>
<h3>Защита основной ветки</h3>
<ul>
<li>прямой push в <code>main</code> запрещён;</li>
<li>обязательные статусы CI: сборка, тесты, линтер;</li>
<li>минимум одно одобрение, а файл <code>CODEOWNERS</code> назначает ревьюеров по путям;</li>
<li>ветка должна быть актуальной относительно main или идти через merge queue.</li>
</ul>
<pre><code># .github/CODEOWNERS
/infra/        @org/platform
/payments/     @org/payments-team
*.tf           @org/platform</code></pre>
<h3>Хороший PR</h3>
<ul>
<li><b>Маленький.</b> 200 строк внимательно читают, 2000 — пролистывают. Эффективность ревью резко падает с размером.</li>
<li><b>Описание:</b> зачем, что изменено, как проверить, риски и план отката.</li>
<li><b>Ревью — про код, не про автора.</b> Стиль и форматирование проверяет машина, человек смотрит на логику, архитектуру и безопасность.</li>
</ul>
<div class="note"><b>Merge queue.</b> Когда много PR сливаются одновременно, каждый может быть зелёным по отдельности, а вместе — ломать main. Очередь слияния проверяет PR поверх уже принятых и сливает только проверенную комбинацию.</div>`,
 check: [
  { id:'q4-3a', type:'single', prompt:'Зачем нужен файл CODEOWNERS?', options:['Автоматически назначать ответственных ревьюеров по путям','Хранить список лицензий','Указывать автора каждого коммита','Запрещать клонирование'], answer:0, explanation:'Изменения в infra/ попадут на ревью платформенной команде.' },
  { id:'q4-3b', type:'single', prompt:'Какую проблему решает merge queue?', options:['PR по отдельности зелёные, но вместе ломают main','Медленный git clone','Конфликты кодировок','Слишком длинные сообщения коммитов'], answer:0, explanation:'Очередь проверяет PR в комбинации с уже принятыми.' }
 ]},
 { id:'4-4', title:'Версионирование и релизы', html:`
<p><b>Семантическое версионирование (SemVer)</b>: <code>MAJOR.MINOR.PATCH</code>.</p>
<ul>
<li><b>MAJOR</b> — ломающие изменения API: <code>2.4.1 → 3.0.0</code>;</li>
<li><b>MINOR</b> — новая функциональность с обратной совместимостью: <code>2.4.1 → 2.5.0</code>;</li>
<li><b>PATCH</b> — исправления: <code>2.4.1 → 2.4.2</code>.</li>
</ul>
<p>С Conventional Commits версию можно вычислять автоматически: есть <code>feat!</code> — major, есть <code>feat</code> — minor, только <code>fix</code> — patch. Так работают semantic-release и release-please.</p>
<pre><code>git tag -a v2.5.0 -m "Release 2.5.0"
git push origin v2.5.0     # тег запускает релизный пайплайн</code></pre>
<h3>Версия для сервиса</h3>
<p>Для веб-сервиса, который выкатывается десять раз в день, SemVer часто избыточен. Удобнее идентифицировать сборку <b>SHA коммита</b>: <code>shop:3f9c2e1</code>. По тегу образа сразу видно, какой код работает в продакшене.</p>
<div class="note"><b>Не используйте latest в продакшене.</b> Тег <code>latest</code> — плавающий: сегодня один образ, завтра другой. Два пода одного деплоймента могут оказаться на разных версиях, а откатиться «на прошлый latest» невозможно.</div>
<p>Ещё один инструмент поиска регрессий — <code>git bisect</code>: двоичный поиск по истории. Отмечаете хороший и плохой коммиты, Git предлагает середину, и за log₂(N) шагов вы находите виновника.</p>`,
 check: [
  { id:'q4-4a', type:'single', prompt:'Библиотека 1.8.3 получила новую функцию без поломки API. Следующая версия?', options:['1.9.0','2.0.0','1.8.4','1.8.3-new'], answer:0, explanation:'Новая совместимая функциональность — MINOR, PATCH сбрасывается.' },
  { id:'q4-4b', type:'input', prompt:'Между хорошим и плохим коммитом 1024 коммита. За сколько шагов git bisect гарантированно найдёт виновника? Введите число.', answer:['10'], explanation:'log₂(1024) = 10.' }
 ]}
 ],
 test: [
  { id:'t4-1', type:'single', prompt:'Какая версия по SemVer следует за 3.2.7 при ломающем изменении API?', options:['4.0.0','3.3.0','3.2.8','3.3.7'], answer:0, explanation:'Ломающие изменения — MAJOR.', difficulty:1 },
  { id:'t4-2', type:'single', prompt:'Почему тег latest плох для продакшена?', options:['Он плавающий: нельзя точно знать версию и откатиться','Он медленнее скачивается','Kubernetes его не поддерживает','Он всегда указывает на пустой образ'], answer:0, explanation:'Используйте неизменяемые теги: SHA или версию.', difficulty:1 },
  { id:'t4-3', type:'match', prompt:'Сопоставьте модель ветвления и описание.', pairs:[['GitFlow','develop, release- и hotfix-ветки'],['GitHub Flow','main + короткие ветки под задачу'],['Trunk-based','Слияние в main несколько раз в день, флаги']], explanation:'Три распространённые модели.', difficulty:1 },
  { id:'t4-4', type:'multiple', prompt:'Что обычно включают в защиту ветки main? (несколько ответов)', options:['Запрет прямого push','Обязательный зелёный CI','Обязательное одобрение ревьюера','Запрет создания тегов'], answer:[0,1,2], explanation:'Теги к защите ветки отношения не имеют.', difficulty:1 },
  { id:'t4-5', type:'single', prompt:'Почему ревью PR на 3000 строк малоэффективно?', options:['Ревьюер не может удержать столько контекста и пролистывает','Git не умеет показывать такие диффы','CI не запустится','Это нарушает SemVer'], answer:0, explanation:'Маленькие PR проверяются внимательнее и сливаются быстрее.', difficulty:1 },
  { id:'t4-6', type:'analyze', prompt:'Какую следующую версию вычислит semantic-release по этим коммитам с релиза 1.4.2?', code:'fix(api): handle null coupon\nfeat(cart): add gift wrap option\nchore(deps): bump lodash', options:['1.5.0','2.0.0','1.4.3','1.4.2'], answer:0, explanation:'Есть feat без ! — minor: 1.5.0.', difficulty:2 },
  { id:'t4-7', type:'single', prompt:'Что произойдёт с секретом, удалённым из файла следующим коммитом?', options:['Он останется в истории и должен считаться скомпрометированным','Он исчезнет отовсюду','Git автоматически его зашифрует','GitHub удалит его из форков'], answer:0, explanation:'История хранит все версии файла.', difficulty:1 },
  { id:'t4-8', type:'single', prompt:'Как trunk-based development позволяет сливать незаконченную функциональность?', options:['Прячет её за feature-флагами','Держит её в отдельной ветке до готовности','Отключает тесты','Сливает только по пятницам'], answer:0, explanation:'Код в main, но выключен до готовности.', difficulty:2 },
  { id:'t4-9', type:'single', prompt:'Каким инструментом искать коммит, после которого появилась регрессия?', options:['git bisect','git blame','git stash','git cherry-pick'], answer:0, explanation:'bisect делает двоичный поиск по истории.', difficulty:2 },
  { id:'t4-10', type:'order', prompt:'Расставьте шаги GitHub Flow по порядку.', options:['Создать ветку от main','Сделать коммиты','Открыть PR','Пройти CI и ревью','Слить в main и выкатить'], answer:[0,1,2,3,4], explanation:'Ветка → коммиты → PR → проверки → слияние и деплой.', difficulty:1 }
 ]
},
{
 id: 5, title: 'Веб-серверы, прокси и балансировщики', short: 'Nginx, forward и reverse proxy, балансировка, кэш, файрвол',
 lessons: [
 { id:'5-1', title:'Веб-серверы', html:`
<p><b>Веб-сервер</b> принимает HTTP-запросы и отдаёт ответ: статический файл или результат работы приложения.</p>
<div class="tbl"><table><tr><th>Сервер</th><th>Особенности</th></tr>
<tr><td>Nginx</td><td>Событийная модель, тысячи соединений на воркер; стандарт для статики, reverse proxy и балансировки</td></tr>
<tr><td>Apache HTTP Server</td><td>Модули, <code>.htaccess</code>; исторически самый популярный, часто с PHP</td></tr>
<tr><td>Caddy</td><td>Автоматический HTTPS через Let's Encrypt из коробки, простой конфиг</td></tr>
<tr><td>IIS</td><td>Веб-сервер Windows Server, ASP.NET</td></tr>
<tr><td>Tomcat</td><td>Контейнер сервлетов для Java-приложений</td></tr>
</table></div>
<pre><code># /etc/nginx/conf.d/shop.conf
server {
    listen 80;
    server_name shop.example;
    root /var/www/shop;                         # статика
    location / {
        try_files $uri $uri/ /index.html;       # SPA
    }
    location /api/ {
        proxy_pass http://127.0.0.1:3000;       # приложение
    }
}</code></pre>
<pre><code>$ sudo nginx -t                # проверить конфиг перед применением!
$ sudo systemctl reload nginx  # перечитать без разрыва соединений
$ tail -f /var/log/nginx/access.log /var/log/nginx/error.log</code></pre>
<div class="note">Сервер приложений (Gunicorn, Kestrel, Node.js, Puma) обычно не выставляют в интернет напрямую: перед ним ставят Nginx или облачный балансировщик, который берёт на себя TLS, статику, сжатие, лимиты и защиту от медленных клиентов.</div>`,
 check: [
  { id:'q5-1a', type:'single', prompt:'Какая команда проверит синтаксис конфигурации Nginx?', options:['nginx -t','nginx --run','systemctl status nginx','curl localhost'], answer:0, explanation:'Проверяйте перед reload.' },
  { id:'q5-1b', type:'single', prompt:'Чем Caddy выделяется среди веб-серверов?', options:['Автоматически получает и продлевает HTTPS-сертификаты','Работает только на Windows','Не поддерживает proxy','Нужен для Java'], answer:0, explanation:'Let\'s Encrypt из коробки.' }
 ]},
 { id:'5-2', title:'Forward и reverse proxy', html:`
<div class="tbl"><table><tr><th></th><th>Forward proxy</th><th>Reverse proxy</th></tr>
<tr><td>Кого представляет</td><td>Клиентов</td><td>Серверы</td></tr>
<tr><td>Кто знает о прокси</td><td>Клиент настроен ходить через него</td><td>Клиент думает, что говорит с сервером</td></tr>
<tr><td>Зачем</td><td>Контроль и фильтрация исходящего трафика, кэш, выход из изолированной сети</td><td>TLS, балансировка, кэш, маршрутизация по путям, защита бэкендов</td></tr>
<tr><td>Примеры</td><td>Squid, корпоративный прокси, <code>HTTPS_PROXY</code> в CI</td><td>Nginx, HAProxy, Traefik, Envoy, облачный LB, Ingress в Kubernetes</td></tr>
</table></div>
<pre><code># Forward: серверы в закрытой сети ходят в интернет только через прокси
export HTTPS_PROXY=http://proxy.corp:3128
export NO_PROXY=localhost,.internal,10.0.0.0/8

# Reverse: один адрес — несколько сервисов
location /api/   { proxy_pass http://api:8080; }
location /admin/ { proxy_pass http://admin:8081; }
proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;</code></pre>
<div class="note warn"><b>X-Forwarded-For.</b> За reverse proxy приложение видит IP прокси. Реальный IP клиента приходит в заголовке — но доверять ему можно, только если запрос пришёл от вашего прокси, иначе клиент подставит любой адрес.</div>
<p class="small">Подробнее — <a href="../network/#/l/11-1">Сети 11.1 «Прокси и reverse proxy»</a>.</p>`,
 check: [
  { id:'q5-2a', type:'single', prompt:'Чьи интересы представляет reverse proxy?', options:['Серверов — клиенты не видят бэкенды напрямую','Клиентов — он скрывает их IP','Провайдера','DNS-сервера'], answer:0, explanation:'Forward — клиентов.' },
  { id:'q5-2b', type:'single', prompt:'Какая переменная окружения направляет HTTPS-запросы утилит через корпоративный прокси?', options:['HTTPS_PROXY','PROXY_PASS','X_FORWARDED_FOR','DNS_PROXY'], answer:0, explanation:'NO_PROXY — исключения.' }
 ]},
 { id:'5-3', title:'Балансировка нагрузки и кэширующие серверы', html:`
<p><b>Балансировщик нагрузки</b> распределяет запросы между несколькими экземплярами приложения: больше пропускная способность и отказоустойчивость — упавший экземпляр исключается по health check.</p>
<div class="tbl"><table><tr><th>Уровень</th><th>Что видит</th><th>Примеры</th></tr>
<tr><td>L4 (транспортный)</td><td>IP и порты, TCP/UDP</td><td>AWS NLB, HAProxy в режиме tcp, IPVS</td></tr>
<tr><td>L7 (прикладной)</td><td>HTTP: пути, заголовки, cookie</td><td>Nginx, HAProxy, AWS ALB, Envoy</td></tr>
</table></div>
<div class="tbl"><table><tr><th>Алгоритм</th><th>Как выбирает</th></tr>
<tr><td>Round robin</td><td>По очереди</td></tr>
<tr><td>Least connections</td><td>Где меньше активных соединений</td></tr>
<tr><td>IP hash / consistent hash</td><td>Один клиент — один бэкенд (липкие сессии, кэши)</td></tr>
<tr><td>Weighted</td><td>Пропорционально весам — так делают канареечные выкатки</td></tr>
</table></div>
<pre><code>upstream app {
    least_conn;
    server 10.0.1.11:3000 max_fails=3 fail_timeout=10s;
    server 10.0.1.12:3000;
    server 10.0.1.13:3000 backup;
}</code></pre>
<h3>Кэширующие серверы</h3>
<p>Кэш между клиентом и приложением отдаёт готовые ответы, не нагружая бэкенд: <b>Varnish</b>, кэш Nginx (<code>proxy_cache</code>), CDN на краю сети. Для данных приложения — <b>Redis</b> и <b>Memcached</b>.</p>
<div class="note warn">Кэш ускоряет и одновременно создаёт риски: устаревшие данные и утечка персональных ответов одного пользователя другому, если ключ кэша не учитывает авторизацию. Кэшируйте явно и по заголовкам Cache-Control.</div>
<p class="small">Подробнее — <a href="../network/#/l/11-2">Сети 11.2 «Балансировщики»</a>, <a href="../network/#/l/11-3">11.3 «CDN»</a>.</p>`,
 check: [
  { id:'q5-3a', type:'single', prompt:'Какой балансировщик может направлять /api и /static на разные бэкенды?', options:['L7 — он видит HTTP-пути','L4 — по портам','Любой DNS','Никакой'], answer:0, explanation:'L4 видит только IP и порты.' },
  { id:'q5-3b', type:'single', prompt:'Какой алгоритм отправит запрос туда, где меньше активных соединений?', options:['Least connections','Round robin','IP hash','Random'], answer:0, explanation:'Учитывает текущую нагрузку.' }
 ]},
 { id:'5-4', title:'Файрвол', html:`
<p><b>Файрвол</b> разрешает или запрещает сетевой трафик по правилам: адрес источника и назначения, порт, протокол, состояние соединения. Базовый принцип — <b>запрещено всё, что не разрешено явно</b>.</p>
<pre><code># ufw (Ubuntu) — простая обёртка
$ sudo ufw default deny incoming
$ sudo ufw allow 22/tcp from 203.0.113.0/24      # SSH только из офиса
$ sudo ufw allow 80,443/tcp
$ sudo ufw enable &amp;&amp; sudo ufw status verbose

# nftables — современный низкоуровневый механизм Linux (вместо iptables)
$ sudo nft list ruleset
# firewalld — в семействе RHEL
$ sudo firewall-cmd --add-service=https --permanent &amp;&amp; sudo firewall-cmd --reload</code></pre>
<div class="tbl"><table><tr><th>Где</th><th>Инструмент</th></tr>
<tr><td>На хосте</td><td>nftables/iptables, ufw, firewalld, Windows Firewall</td></tr>
<tr><td>В облаке</td><td>Security groups (на уровне машины), Network ACL (на уровне подсети)</td></tr>
<tr><td>В Kubernetes</td><td>NetworkPolicy между подами</td></tr>
<tr><td>На периметре</td><td>Аппаратные файрволы, WAF для HTTP-атак</td></tr>
</table></div>
<div class="note warn"><b>Не заблокируйте себя.</b> Включая файрвол на удалённом сервере, сначала разрешите SSH. На облачных машинах держите консоль провайдера как запасной вход.</div>
<p class="small">Как работают файрволы с отслеживанием состояния — <a href="../network/#/l/10-4">Сети 10.4</a>.</p>`,
 check: [
  { id:'q5-4a', type:'single', prompt:'Какая политика по умолчанию безопаснее для входящего трафика?', options:['Запретить всё, разрешить нужное явно','Разрешить всё, запретить опасное','Разрешить всё','Зависит от дня недели'], answer:0, explanation:'Default deny.' },
  { id:'q5-4b', type:'single', prompt:'Что первым делом разрешить перед включением файрвола на удалённом сервере?', options:['SSH (порт 22) с вашего адреса','HTTP','ICMP','Ничего'], answer:0, explanation:'Иначе потеряете доступ.' }
 ]}
 ],
 test: [
  { id:'t5-1', type:'match', prompt:'Сопоставьте инструмент и роль.', pairs:[['Nginx','Веб-сервер и reverse proxy'],['Squid','Forward proxy'],['Varnish','Кэширующий HTTP-сервер'],['HAProxy','Балансировщик L4/L7']], explanation:'Инфраструктура перед приложением.', difficulty:1 },
  { id:'t5-2', type:'single', prompt:'Почему сервер приложений обычно не выставляют в интернет напрямую?', options:['Reverse proxy берёт на себя TLS, статику, лимиты и защиту от медленных клиентов','Так запрещено законом','Приложения не умеют HTTP','Это медленнее'], answer:0, explanation:'Разделение обязанностей.', difficulty:1 },
  { id:'t5-3', type:'single', prompt:'Чем reload Nginx лучше restart?', options:['Перечитывает конфиг без разрыва текущих соединений','Быстрее перезагружает сервер','Удаляет логи','Ничем'], answer:0, explanation:'Старые воркеры дорабатывают запросы.', difficulty:2 },
  { id:'t5-4', type:'single', prompt:'Почему нельзя слепо доверять заголовку X-Forwarded-For?', options:['Клиент может подставить любой IP, если запрос пришёл не от вашего прокси','Он всегда пустой','Его удаляет TLS','Он содержит пароль'], answer:0, explanation:'Доверяйте только своим прокси.', difficulty:2 },
  { id:'t5-5', type:'single', prompt:'Как балансировщик узнаёт, что экземпляр упал?', options:['По health check','По DNS','По логам приложения','Никак'], answer:0, explanation:'Неотвечающие исключаются из пула.', difficulty:1 },
  { id:'t5-6', type:'single', prompt:'Какой облачный механизм работает как файрвол на уровне отдельной машины?', options:['Security group','Route table','DNS zone','IAM role'], answer:0, explanation:'NACL — на уровне подсети.', difficulty:1 },
  { id:'t5-7', type:'single', prompt:'Какой риск у HTTP-кэша перед приложением с авторизацией?', options:['Отдать персональный ответ одного пользователя другому','Слишком быстрые ответы','Потеря TLS','Нет рисков'], answer:0, explanation:'Ключ кэша должен учитывать авторизацию, или не кэшировать.', difficulty:2 },
  { id:'t5-8', type:'multiple', prompt:'Что делает reverse proxy? (несколько ответов)', options:['Терминирует TLS','Распределяет запросы по бэкендам','Маршрутизирует по путям','Скрывает IP клиентов от интернета'], answer:[0,1,2], explanation:'Последнее — задача forward proxy.', difficulty:2 }
 ]
},
{
 id: 6, title: 'Сети и протоколы', short: 'OSI, DNS, HTTP и TLS, SSH, почта',
 lessons: [
 { id:'6-1', title:'Модели OSI и TCP/IP на практике', html:`
<p>Сетевые проблемы удобно раскладывать по уровням: на каком из них сломалось?</p>
<div class="tbl"><table><tr><th>Уровень OSI</th><th>Что там</th><th>Чем проверить / где встретите</th></tr>
<tr><td>7 Прикладной</td><td>HTTP, DNS, SSH, SMTP</td><td>curl, dig, логи приложения; L7-балансировщик, WAF</td></tr>
<tr><td>6 Представления</td><td>TLS, кодировки</td><td>openssl s_client; истёкший сертификат</td></tr>
<tr><td>5 Сеансовый</td><td>Сессии</td><td>Обычно сливается с 6–7</td></tr>
<tr><td>4 Транспортный</td><td>TCP, UDP, порты</td><td>ss, nc; security group, L4-балансировщик</td></tr>
<tr><td>3 Сетевой</td><td>IP, маршрутизация</td><td>ping, ip r, traceroute; подсети VPC, маршруты</td></tr>
<tr><td>2 Канальный</td><td>Ethernet, MAC, VLAN</td><td>ip link, arp</td></tr>
<tr><td>1 Физический</td><td>Кабели, радио</td><td>В облаке — забота провайдера</td></tr>
</table></div>
<p>Модель <b>TCP/IP</b> объединяет уровни в четыре: канальный, интернет (IP), транспортный (TCP/UDP), прикладной. Практики обычно говорят «L4» и «L7» именно в смысле OSI.</p>
<div class="note why"><b>Что нужно DevOps-инженеру</b>: CIDR и подсети (проектирование VPC), порты и TCP-соединения (файрволы, балансировщики), DNS (почти любой инцидент), HTTP и TLS (всё веб-приложение), NAT (выход в интернет из приватных сетей). Полностью эти темы разобраны в <a href="../network/">курсе «Сети для разработчиков»</a> — <a href="../network/#/l/0-3">0.3 OSI и TCP/IP</a>, <a href="../network/#/l/3-2">3.2 CIDR и подсети</a>.</div>`,
 check: [
  { id:'q6-1a', type:'match', prompt:'Сопоставьте проблему и уровень OSI.', pairs:[['Истёк TLS-сертификат','6 — представления (TLS)'],['Порт закрыт security group','4 — транспортный'],['Нет маршрута в подсеть','3 — сетевой'],['Приложение отдаёт 500','7 — прикладной']], explanation:'Раскладывайте проблему по уровням.' },
  { id:'q6-1b', type:'single', prompt:'Что значит «L7-балансировщик»?', options:['Работает на прикладном уровне и понимает HTTP','Имеет 7 бэкендов','Работает на физическом уровне','Работает только с UDP'], answer:0, explanation:'L4 — по портам, L7 — по HTTP.' }
 ]},
 { id:'6-2', title:'DNS, HTTP, HTTPS и TLS', html:`
<h3>DNS</h3>
<div class="tbl"><table><tr><th>Запись</th><th>Назначение</th></tr>
<tr><td>A / AAAA</td><td>Имя → IPv4 / IPv6</td></tr>
<tr><td>CNAME</td><td>Псевдоним другого имени (не на корне домена)</td></tr>
<tr><td>MX</td><td>Почтовые серверы домена</td></tr>
<tr><td>TXT</td><td>Произвольный текст: SPF, DKIM, проверка владения доменом</td></tr>
<tr><td>NS</td><td>Какие серверы отвечают за зону</td></tr>
</table></div>
<p><b>TTL</b> — сколько секунд резолверы кэшируют ответ. Перед переездом на новый IP TTL заранее снижают до 60–300 с, иначе часть пользователей ещё часами будет ходить на старый адрес.</p>
<h3>HTTP и HTTPS</h3>
<p>HTTPS = HTTP поверх <b>TLS</b>: шифрование, целостность и проверка подлинности сервера по сертификату. Задачи DevOps здесь:</p>
<ul>
<li><b>Выпуск и продление сертификатов</b> — Let's Encrypt через certbot, cert-manager в Kubernetes, облачные сертификаты на балансировщике. Срок жизни сертификатов сокращается, поэтому только автоматизация.</li>
<li><b>Терминация TLS</b> — где расшифровывается трафик: на балансировщике или ingress, а до приложения — HTTP во внутренней сети или повторное шифрование (mTLS, модуль 17).</li>
<li><b>Мониторинг сроков</b> — алерт за 2–3 недели до истечения: истёкший сертификат — классическая причина громких аварий.</li>
<li><b>Версии и шифры</b> — только TLS 1.2+ и HSTS.</li>
</ul>
<pre><code>$ echo | openssl s_client -connect shop.example:443 -servername shop.example 2&gt;/dev/null \\
    | openssl x509 -noout -dates -issuer
notAfter=Jan 15 23:59:59 2026 GMT</code></pre>
<p class="small">Подробно — Сети: <a href="../network/#/l/8-2">8.2 DNS и TTL</a>, <a href="../network/#/l/9-1">9.1 HTTP</a>, <a href="../network/#/l/10-2">10.2 TLS 1.3</a>, <a href="../network/#/l/10-3">10.3 сертификаты</a>.</p>`,
 check: [
  { id:'q6-2a', type:'single', prompt:'Что сделать с TTL DNS-записи перед сменой IP сервера?', options:['Заранее уменьшить, чтобы кэши быстро обновились','Увеличить до недели','Удалить запись','Ничего'], answer:0, explanation:'Иначе старый IP будет в кэшах до истечения TTL.' },
  { id:'q6-2b', type:'single', prompt:'Как надёжнее всего избежать аварии из-за истёкшего сертификата?', options:['Автоматический выпуск и продление плюс мониторинг сроков','Напоминание в календаре','Сертификат на 10 лет','Отключить HTTPS'], answer:0, explanation:'certbot, cert-manager, облачные сертификаты.' }
 ]},
 { id:'6-3', title:'SSH и передача файлов', html:`
<p><b>SSH</b> — основной способ управлять серверами: шифрованный удалённый shell, проброс портов и передача файлов.</p>
<pre><code>$ ssh-keygen -t ed25519 -C "anna@laptop"         # пара ключей
$ ssh-copy-id deploy@10.0.1.5                     # положить публичный ключ на сервер
$ ssh deploy@10.0.1.5
$ ssh -J bastion.example deploy@10.0.1.5          # через бастион (jump host)
$ ssh -L 5432:db.internal:5432 bastion.example    # локальный порт → приватная БД

# ~/.ssh/config
Host prod-*
    User deploy
    ProxyJump bastion.example
    IdentityFile ~/.ssh/id_ed25519</code></pre>
<h3>Закалка SSH-сервера</h3>
<pre><code># /etc/ssh/sshd_config
PasswordAuthentication no      # только ключи
PermitRootLogin no
AllowUsers deploy</code></pre>
<p>Дополнительно: доступ только из VPN или через бастион, fail2ban против перебора, короткоживущие SSH-сертификаты вместо вечных ключей, а в облаке — доступ без открытого порта (AWS Session Manager, Google IAP).</p>
<h3>Передача файлов</h3>
<div class="tbl"><table><tr><th>Протокол</th><th>Статус</th></tr>
<tr><td>FTP</td><td>Пароли и данные открытым текстом — не использовать</td></tr>
<tr><td>FTPS</td><td>FTP поверх TLS, встречается в интеграциях со старыми системами</td></tr>
<tr><td>SFTP</td><td>Передача файлов поверх SSH — стандарт</td></tr>
<tr><td>scp / rsync</td><td>Копирование и синхронизация по SSH: <code>rsync -az --delete dist/ deploy@host:/srv/web/</code></td></tr>
</table></div>`,
 check: [
  { id:'q6-3a', type:'single', prompt:'Почему отключают PasswordAuthentication в sshd?', options:['Ключи нельзя подобрать перебором, а пароли — можно','Пароли медленнее','Так требует Linux','Чтобы работал scp'], answer:0, explanation:'Плюс защита от утечки пароля.' },
  { id:'q6-3b', type:'single', prompt:'Какой протокол передачи файлов шифрует и пароль, и данные поверх SSH?', options:['SFTP','FTP','TFTP','HTTP'], answer:0, explanation:'FTP передаёт всё открытым текстом.' }
 ]},
 { id:'6-4', title:'Почтовые протоколы и защита домена', html:`
<p>Даже если вы не держите почтовый сервер, приложение отправляет письма (регистрация, сброс пароля), а домен компании нужно защитить от подделки.</p>
<div class="tbl"><table><tr><th>Протокол</th><th>Для чего</th><th>Порты</th></tr>
<tr><td>SMTP</td><td>Отправка и пересылка между серверами</td><td>25 (между серверами), 587 (отправка клиентами, STARTTLS), 465 (SMTPS)</td></tr>
<tr><td>IMAP / IMAPS</td><td>Чтение почты с сервера, папки синхронизируются</td><td>143 / 993</td></tr>
<tr><td>POP3 / POP3S</td><td>Скачать письма и (обычно) удалить с сервера</td><td>110 / 995</td></tr>
</table></div>
<h3>SPF, DKIM, DMARC</h3>
<div class="tbl"><table><tr><th>Механизм</th><th>Что проверяет</th><th>Где</th></tr>
<tr><td>SPF</td><td>С каких серверов разрешено отправлять почту от имени домена</td><td>TXT: <code>v=spf1 include:_spf.mailgun.org -all</code></td></tr>
<tr><td>DKIM (DomainKeys)</td><td>Письмо подписано ключом домена и не изменено</td><td>TXT с публичным ключом на <code>selector._domainkey</code></td></tr>
<tr><td>DMARC</td><td>Что делать с письмами, не прошедшими SPF/DKIM, и куда слать отчёты</td><td>TXT на <code>_dmarc</code>: <code>v=DMARC1; p=reject; rua=mailto:dmarc@shop.example</code></td></tr>
</table></div>
<p><b>Белые и серые списки</b>: whitelist — доверенные отправители; greylisting — временный отказ незнакомому серверу (настоящий сервер повторит отправку, спам-бот обычно нет).</p>
<div class="note why"><b>Практика.</b> Отправляйте письма приложения через сервис (Amazon SES, Mailgun, Postmark, SMTP провайдера), а не со своего сервера: репутация IP, очереди и отчёты о доставке — их забота. Ваша — правильные SPF, DKIM и DMARC, иначе письма уйдут в спам.</div>`,
 check: [
  { id:'q6-4a', type:'match', prompt:'Сопоставьте механизм и назначение.', pairs:[['SPF','Какие серверы могут слать почту домена'],['DKIM','Подпись письма ключом домена'],['DMARC','Политика для писем, не прошедших проверки'],['IMAP','Чтение почты с синхронизацией папок']], explanation:'Защита почты домена.' },
  { id:'q6-4b', type:'single', prompt:'Почему письма приложения попадают в спам?', options:['Часто не настроены SPF, DKIM и DMARC для домена отправителя','Слишком короткие письма','Используется HTTPS','Из-за TTL'], answer:0, explanation:'Получатели проверяют подлинность отправителя.' }
 ]}
 ],
 test: [
  { id:'t6-1', type:'match', prompt:'Сопоставьте DNS-запись и назначение.', pairs:[['A','Имя → IPv4'],['CNAME','Псевдоним другого имени'],['MX','Почтовые серверы'],['TXT','SPF, DKIM, проверки владения']], explanation:'Основные записи.', difficulty:1 },
  { id:'t6-2', type:'single', prompt:'На каком порту клиенты обычно отправляют почту через SMTP с STARTTLS?', options:['587','25','80','22'], answer:0, explanation:'25 — между серверами.', difficulty:2 },
  { id:'t6-3', type:'single', prompt:'Как попасть на сервер в приватной подсети без публичного IP?', options:['Через бастион: ssh -J bastion host','Нельзя','По FTP','Через DNS'], answer:0, explanation:'Или через Session Manager / IAP.', difficulty:1 },
  { id:'t6-4', type:'single', prompt:'Что произойдёт с письмами, если в DMARC указано p=reject и письмо не прошло SPF и DKIM?', options:['Получатель отклонит письмо','Письмо доставят во входящие','Письмо зашифруют','Ничего'], answer:0, explanation:'Защита от подделки домена.', difficulty:2 },
  { id:'t6-5', type:'single', prompt:'Почему FTP не стоит использовать?', options:['Пароли и данные идут открытым текстом','Он слишком быстрый','Он не работает в Linux','Он требует GPU'], answer:0, explanation:'Используйте SFTP.', difficulty:1 },
  { id:'t6-6', type:'single', prompt:'Где обычно терминируют TLS в веб-инфраструктуре?', options:['На балансировщике или ingress','В базе данных','В DNS','В браузере'], answer:0, explanation:'Дальше — HTTP во внутренней сети или mTLS.', difficulty:1 },
  { id:'t6-7', type:'single', prompt:'Какая команда покажет даты действия сертификата сайта?', options:['openssl s_client ... | openssl x509 -noout -dates','dig +dates','curl --cert-date','ping -t'], answer:0, explanation:'notBefore / notAfter.', difficulty:2 },
  { id:'t6-8', type:'multiple', prompt:'Какие сетевые знания нужны для проектирования VPC? (несколько ответов)', options:['CIDR и подсети','Маршрутизация','NAT','Почтовый протокол POP3'], answer:[0,1,2], explanation:'POP3 к VPC не относится.', difficulty:1 }
 ]
},
{
 id: 7, title: 'Контейнеры', short: 'Изоляция, образы, Dockerfile, compose',
 lessons: [
 { id:'7-1', title:'Контейнеры и виртуальные машины', html:`
<p><b>Виртуальная машина</b> эмулирует целый компьютер: гипервизор, своё ядро ОС, гигабайты образа, загрузка за минуты. <b>Контейнер</b> — обычный процесс на общем ядре хоста, изолированный средствами Linux:</p>
<ul>
<li><b>namespaces</b> — что процесс <i>видит</i>: свои PID, сеть, точки монтирования, hostname, пользователей;</li>
<li><b>cgroups</b> — сколько процесс может <i>потреблять</i>: CPU, память, I/O;</li>
<li><b>overlay-файловая система</b> — слои образа плюс тонкий записываемый слой сверху.</li>
</ul>
<div class="tbl"><table><tr><th></th><th>VM</th><th>Контейнер</th></tr>
<tr><td>Ядро</td><td>своё</td><td>общее с хостом</td></tr>
<tr><td>Старт</td><td>десятки секунд – минуты</td><td>доли секунды</td></tr>
<tr><td>Размер</td><td>гигабайты</td><td>мегабайты</td></tr>
<tr><td>Изоляция</td><td>сильная (аппаратная)</td><td>слабее (общее ядро)</td></tr></table></div>
<p>Контейнер решает проблему «у меня работает»: в образ упаковано приложение со всеми зависимостями и рантаймом, и он одинаково запускается на ноутбуке, в CI и в продакшене.</p>
<div class="note"><b>Контейнер эфемерен.</b> Всё, что записано в его файловую систему, исчезнет при пересоздании. Данные — в томах или внешних сервисах.</div>
<p>Стандарты описывает <b>OCI</b> (Open Container Initiative): формат образа и рантайм. Поэтому образ, собранный Docker, запускают containerd, CRI-O и Podman.</p>`,
 check: [
  { id:'q7-1a', type:'match', prompt:'Сопоставьте механизм Linux и его роль в контейнерах.', pairs:[['namespaces','Изоляция видимости: PID, сеть, ФС'],['cgroups','Ограничение ресурсов: CPU, память'],['overlayfs','Слои образа + записываемый слой']], explanation:'Три кита контейнеризации.' },
  { id:'q7-1b', type:'single', prompt:'Что произойдёт с файлом, записанным внутрь контейнера без тома, после его удаления?', options:['Файл пропадёт','Файл сохранится в образе','Файл переедет на хост','Файл попадёт в реестр'], answer:0, explanation:'Записываемый слой удаляется вместе с контейнером.' }
 ]},
 { id:'7-2', title:'Образы и слои', html:`
<p>Образ — набор <b>слоёв</b> только для чтения. Каждая инструкция Dockerfile, меняющая файловую систему (<code>RUN</code>, <code>COPY</code>, <code>ADD</code>), создаёт новый слой. Слои кэшируются и переиспользуются между образами.</p>
<p>Правило кэша: если слой изменился, пересобираются он и <b>все слои ниже</b>. Попробуйте:</p>
<div data-widget="layers"></div>
<pre><code># плохо: любая правка кода сбрасывает кэш npm ci
COPY . .
RUN npm ci

# хорошо: npm ci пересобирается только при изменении зависимостей
COPY package*.json ./
RUN npm ci
COPY . .</code></pre>
<pre><code>$ docker image history shop:3f9c2e1
IMAGE        CREATED BY                         SIZE
a1f0…        CMD ["node","dist/server.js"]      0B
b72c…        COPY /app/dist ./dist              1.9MB
c3d8…        RUN npm ci --omit=dev              48MB
…            FROM node:20-alpine                135MB</code></pre>
<div class="note why"><b>Удаление в следующем слое не уменьшает образ.</b> Если скачать архив в одном RUN и удалить в другом, архив останется в нижнем слое. Скачивание, распаковка и очистка — в одной инструкции или в отдельной стадии сборки.</div>`,
 check: [
  { id:'q7-2a', type:'single', prompt:'Почему package.json копируют до остального кода?', options:['Чтобы слой с установкой зависимостей кэшировался при правках кода','Так требует Docker','Чтобы уменьшить число слоёв','Иначе npm не найдёт файл'], answer:0, explanation:'Код меняется чаще зависимостей.' },
  { id:'q7-2b', type:'single', prompt:'Архив скачан в RUN №1 и удалён в RUN №2. Уменьшится ли образ?', options:['Нет, архив остался в слое RUN №1','Да, полностью','Да, наполовину','Docker не позволит удалить файл'], answer:0, explanation:'Слои только добавляются; удаление — лишь пометка в верхнем слое.' }
 ]},
 { id:'7-3', title:'Хороший Dockerfile', html:`
<p>Мультистадийная сборка: компиляторы и dev-зависимости живут в стадии <code>build</code>, а в финальный образ попадает только результат.</p>
<pre><code># syntax=docker/dockerfile:1
FROM node:20.17-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && npm prune --omit=dev

FROM node:20.17-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK CMD wget -qO- http://localhost:3000/healthz || exit 1
CMD ["node", "dist/server.js"]</code></pre>
<h3>Чек-лист</h3>
<ul>
<li><b>Закреплённая версия</b> базового образа (<code>node:20.17-alpine</code>, а не <code>node</code>).</li>
<li><b>Маленькая база:</b> alpine, slim или distroless — меньше размер и поверхность атаки.</li>
<li><b>Не root:</b> <code>USER</code> с непривилегированным пользователем.</li>
<li><b>.dockerignore</b>: <code>node_modules</code>, <code>.git</code>, <code>.env</code> — не тащить в контекст сборки.</li>
<li><b>Exec-форма CMD</b> (<code>["node", "…"]</code>): процесс получает PID 1 и сигналы напрямую. В shell-форме <code>CMD node …</code> сигналы получает <code>sh</code>, и SIGTERM может не дойти до приложения.</li>
<li><b>Никаких секретов</b> в <code>ENV</code>, <code>ARG</code> и слоях — их видно в <code>docker history</code>. Для сборки — <code>RUN --mount=type=secret</code>.</li>
</ul>`,
 check: [
  { id:'q7-3a', type:'single', prompt:'Главная выгода мультистадийной сборки?', options:['В финальный образ не попадают инструменты сборки и dev-зависимости','Сборка идёт на нескольких машинах','Образ можно запустить на Windows','Отключается кэш'], answer:0, explanation:'Меньше размер и поверхность атаки.' },
  { id:'q7-3b', type:'single', prompt:'Почему CMD лучше писать в exec-форме ["node","server.js"]?', options:['Приложение становится PID 1 и получает сигналы напрямую','Так быстрее парсится','Shell-форма запрещена','Exec-форма включает healthcheck'], answer:0, explanation:'В shell-форме SIGTERM получает sh и может не передать его.' }
 ]},
 { id:'7-4', title:'Сети, тома и Docker Compose', html:`
<h3>Сеть</h3>
<p>По умолчанию контейнер подключён к мосту <code>bridge</code> и виден хосту только через проброшенный порт: <code>-p 8080:3000</code> — порт хоста 8080 → порт контейнера 3000. В пользовательской сети контейнеры находят друг друга <b>по имени</b> через встроенный DNS.</p>
<h3>Тома</h3>
<ul>
<li><b>Named volume</b> (<code>pgdata:/var/lib/postgresql/data</code>) — управляет Docker, переживает пересоздание контейнера.</li>
<li><b>Bind mount</b> (<code>./src:/app/src</code>) — каталог хоста внутри контейнера, удобно для разработки.</li>
</ul>
<h3>Compose</h3>
<pre><code># compose.yaml
services:
  api:
    build: .
    ports: ["8080:3000"]
    environment:
      DATABASE_URL: postgres://shop:shop@db:5432/shop
    depends_on:
      db: { condition: service_healthy }
  db:
    image: postgres:16
    environment: { POSTGRES_USER: shop, POSTGRES_PASSWORD: shop }
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "shop"]
      interval: 5s
volumes:
  pgdata:</code></pre>
<p><code>docker compose up -d</code> поднимает весь стек, <code>docker compose down</code> — останавливает (с <code>-v</code> удалит и тома). Обратите внимание: api обращается к базе по имени <code>db</code>, а не по <code>localhost</code> — внутри контейнера <code>localhost</code> — это сам контейнер.</p>
<div class="note"><b>Compose — для разработки и простых установок.</b> Для продакшена с несколькими серверами, самовосстановлением и выкаткой без простоя нужен оркестратор — Kubernetes.</div>`,
 check: [
  { id:'q7-4a', type:'single', prompt:'Как сервис api в compose обращается к сервису db?', options:['По имени db через встроенный DNS','Через localhost','По IP хоста','Через проброшенный порт 5432 хоста'], answer:0, explanation:'Внутри контейнера localhost — это он сам.' },
  { id:'q7-4b', type:'single', prompt:'Что означает -p 8080:3000?', options:['Порт хоста 8080 ведёт на порт 3000 контейнера','Порт контейнера 8080 ведёт на порт 3000 хоста','Открыть порты с 3000 по 8080','Ограничить память 8080 МБ'], answer:0, explanation:'Формат хост:контейнер.' }
 ]}
 ],
 test: [
  { id:'t7-1', type:'single', prompt:'Чем контейнер принципиально отличается от VM?', options:['Использует общее ядро хоста','Имеет собственное ядро','Работает только в облаке','Не может использовать сеть'], answer:0, explanation:'Контейнер — изолированный процесс на общем ядре.', difficulty:1 },
  { id:'t7-2', type:'analyze', prompt:'Что не так с этим Dockerfile?', code:'FROM node\nCOPY . .\nRUN npm install\nENV DB_PASSWORD=s3cret\nCMD npm start', options:['Плавающая база, плохой порядок слоёв, секрет в образе, shell-форма CMD','Всё правильно','Не хватает EXPOSE, остальное в порядке','Нельзя использовать npm в Docker'], answer:0, explanation:'Четыре проблемы сразу.', difficulty:2 },
  { id:'t7-3', type:'single', prompt:'Какой механизм ограничивает память контейнера?', options:['cgroups','namespaces','overlayfs','iptables'], answer:0, explanation:'cgroups — учёт и лимиты ресурсов.', difficulty:1 },
  { id:'t7-4', type:'single', prompt:'Где хранить данные PostgreSQL, запущенного в Docker?', options:['В named volume','В записываемом слое контейнера','В образе','В /tmp контейнера'], answer:0, explanation:'Том переживает пересоздание контейнера.', difficulty:1 },
  { id:'t7-5', type:'multiple', prompt:'Что стоит добавить в .dockerignore? (несколько ответов)', options:['node_modules','.git','.env','package.json'], answer:[0,1,2], explanation:'package.json нужен для сборки.', difficulty:1 },
  { id:'t7-6', type:'single', prompt:'Приложение в контейнере слушает 127.0.0.1:3000, проброс -p 8080:3000 не работает. Почему?', options:['Нужно слушать 0.0.0.0: запросы приходят на сетевой интерфейс контейнера','Порт 8080 занят','Docker не поддерживает Node.js','Нужен HTTPS'], answer:0, explanation:'127.0.0.1 внутри контейнера недоступен снаружи.', difficulty:3 },
  { id:'t7-7', type:'single', prompt:'Зачем USER node в Dockerfile?', options:['Чтобы процесс не работал от root','Чтобы установить Node.js','Чтобы ускорить сборку','Чтобы включить логи'], answer:0, explanation:'Наименьшие привилегии и внутри контейнера.', difficulty:1 },
  { id:'t7-8', type:'order', prompt:'Расставьте инструкции Node.js-Dockerfile для лучшего кэширования.', options:['FROM node:20-alpine','COPY package*.json ./','RUN npm ci','COPY . .','RUN npm run build'], answer:[0,1,2,3,4], explanation:'Редко меняющееся — выше.', difficulty:2 },
  { id:'t7-9', type:'single', prompt:'Что делает depends_on с condition: service_healthy?', options:['Ждёт, пока healthcheck зависимости станет успешным','Перезапускает сервис при падении зависимости','Объединяет два сервиса в один','Ничего'], answer:0, explanation:'Без condition compose ждёт только запуска контейнера, а не готовности.', difficulty:2 },
  { id:'t7-10', type:'single', prompt:'Почему образ, собранный Docker, можно запустить в containerd или Podman?', options:['Все следуют стандарту OCI','Они используют код Docker','Это невозможно','Через эмуляцию'], answer:0, explanation:'OCI описывает формат образа и рантайм.', difficulty:2 }
 ]
},
{
 id: 8, title: 'Облака и serverless', short: 'Модели сервисов, VPC, IAM, стоимость, функции',
 lessons: [
 { id:'8-1', title:'IaaS, PaaS, SaaS и serverless', html:`
<p>Облако — аренда вычислений по API с оплатой за использование. Модели отличаются тем, где проходит граница ответственности:</p>
<div class="tbl"><table><tr><th>Модель</th><th>Вы управляете</th><th>Примеры</th></tr>
<tr><td>IaaS</td><td>ОС, рантайм, приложение</td><td>EC2, Compute Engine</td></tr>
<tr><td>CaaS</td><td>контейнеры и манифесты</td><td>EKS, GKE, Cloud Run</td></tr>
<tr><td>PaaS</td><td>код и конфиг</td><td>Heroku, App Engine</td></tr>
<tr><td>FaaS / serverless</td><td>функции</td><td>AWS Lambda, Cloud Functions</td></tr>
<tr><td>SaaS</td><td>только данные и настройки</td><td>Gmail, Slack</td></tr></table></div>
<p>Чем выше уровень, тем меньше эксплуатации и тем меньше контроля. Управляемые сервисы (БД, очереди, кэш) почти всегда выгоднее самостоятельной установки: бэкапы, обновления и отказоустойчивость берёт провайдер.</p>
<h3>Регионы и зоны</h3>
<p><b>Регион</b> — географическое место (eu-central-1). <b>Зона доступности (AZ)</b> — изолированный дата-центр внутри региона. Отказоустойчивый сервис распределяют минимум по двум-трём зонам: пожар в одном ЦОД не должен его уронить.</p>
<div class="note why"><b>Модель разделённой ответственности.</b> Провайдер отвечает за безопасность <i>облака</i> (железо, гипервизор, ЦОД). Вы — за безопасность <i>в облаке</i>: открытые порты, публичные бакеты, права IAM. Почти все громкие утечки — второе.</div>`,
 check: [
  { id:'q8-1a', type:'single', prompt:'В какой модели вы отвечаете за обновления ОС?', options:['IaaS','PaaS','FaaS','SaaS'], answer:0, explanation:'В IaaS вы получаете виртуальную машину целиком.' },
  { id:'q8-1b', type:'single', prompt:'Зачем распределять сервис по нескольким зонам доступности?', options:['Чтобы пережить отказ одного дата-центра','Чтобы снизить цену','Так быстрее DNS','Это требование закона'], answer:0, explanation:'Зоны изолированы друг от друга.' }
 ]},
 { id:'8-2', title:'Сеть в облаке: VPC', html:`
<p><b>VPC</b> (Virtual Private Cloud) — ваша изолированная сеть в облаке с собственным диапазоном адресов, например <code>10.20.0.0/16</code>. Её делят на подсети в разных зонах:</p>
<ul>
<li><b>Публичные подсети</b> — с маршрутом в Internet Gateway: балансировщики, bastion.</li>
<li><b>Приватные подсети</b> — без входящего доступа из интернета: приложения, базы. Наружу ходят через <b>NAT Gateway</b>.</li>
</ul>
<pre><code>Интернет ──▶ ALB (публичная подсеть, 443)
               │
               ▼
            поды/VM (приватная подсеть) ──▶ RDS (приватная, 5432)
               │
               └──▶ NAT ──▶ интернет (обновления, внешние API)</code></pre>
<h3>Фильтрация</h3>
<p><b>Security group</b> — stateful-файрвол на уровне экземпляра. Правило «БД принимает 5432 только от security group приложения» лучше, чем «от 10.20.0.0/16»: оно не зависит от адресов.</p>
<div class="note"><b>Типичная ошибка.</b> Открыть 22 или 5432 на <code>0.0.0.0/0</code> «на минутку». Сканеры находят такие порты за минуты. Для доступа к приватным ресурсам — VPN, bastion или сессии через облачный менеджер (SSM, IAP).</div>`,
 check: [
  { id:'q8-2a', type:'single', prompt:'Где должна находиться база данных?', options:['В приватной подсети без входящего доступа из интернета','В публичной подсети с открытым портом','В той же подсети, что балансировщик, с публичным IP','В отдельном аккаунте с публичным доступом'], answer:0, explanation:'Доступ к БД — только от приложения.' },
  { id:'q8-2b', type:'single', prompt:'Как сервер в приватной подсети скачивает обновления из интернета?', options:['Через NAT Gateway','Через Internet Gateway напрямую','Никак','Через DNS'], answer:0, explanation:'NAT пропускает исходящие соединения, но не входящие.' }
 ]},
 { id:'8-3', title:'IAM: кто что может', html:`
<p><b>IAM</b> (Identity and Access Management) отвечает на вопрос «кто (principal) может выполнить какое действие над каким ресурсом».</p>
<pre><code>{
  "Effect": "Allow",
  "Action": ["s3:GetObject", "s3:PutObject"],
  "Resource": "arn:aws:s3:::shop-uploads/*"
}</code></pre>
<h3>Принципы</h3>
<ul>
<li><b>Наименьшие привилегии.</b> Сервису загрузки картинок — доступ к одному бакету, а не <code>s3:*</code> на всё.</li>
<li><b>Роли вместо ключей.</b> Приложения и CI получают <b>временные</b> креды через роли: роль экземпляра, IRSA / Workload Identity в Kubernetes, <b>OIDC-федерация</b> из GitHub Actions. Долгоживущие ключи доступа утекают.</li>
<li><b>MFA</b> для людей, отсутствие ежедневной работы под root-аккаунтом.</li>
<li><b>Аудит:</b> CloudTrail / Audit Logs записывают каждый вызов API.</li>
</ul>
<div class="note why"><b>OIDC в CI.</b> GitHub Actions предъявляет облаку подписанный токен «я workflow репозитория acme/shop на ветке main», облако выдаёт временные креды на 1 час. В секретах репозитория нет ни одного облачного ключа.</div>`,
 check: [
  { id:'q8-3a', type:'single', prompt:'Как CI лучше всего получить доступ к облаку?', options:['OIDC-федерация с временными кредами','Ключ root-аккаунта в секретах','Ключ администратора в коде','Общий пароль команды'], answer:0, explanation:'Нет долгоживущих секретов, которые могут утечь.' },
  { id:'q8-3b', type:'single', prompt:'Сервису нужно читать один бакет. Какую политику выдать?', options:['s3:GetObject на этот бакет','s3:* на все бакеты','AdministratorAccess','Никакую, бакеты публичны'], answer:0, explanation:'Наименьшие привилегии.' }
 ]},
 { id:'8-4', title:'Масштабирование и стоимость', html:`
<ul>
<li><b>Вертикальное</b> масштабирование — машина побольше. Просто, но есть потолок и простой при смене.</li>
<li><b>Горизонтальное</b> — больше экземпляров за балансировщиком. Требует stateless-приложения.</li>
</ul>
<p><b>Автомасштабирование</b> добавляет экземпляры по метрике: в Kubernetes <b>HPA</b> меняет число подов по CPU или пользовательским метрикам, <b>Cluster Autoscaler</b> / Karpenter — число узлов.</p>
<pre><code>kubectl autoscale deploy/shop --min=3 --max=20 --cpu-percent=70</code></pre>
<h3>FinOps: облако стоит денег</h3>
<div class="tbl"><table><tr><th>Приём</th><th>Экономия</th></tr>
<tr><td>Правильный размер (rightsizing) по реальной загрузке</td><td>частая находка: машины загружены на 10%</td></tr>
<tr><td>Reserved / Savings Plans для постоянной нагрузки</td><td>до ~70%</td></tr>
<tr><td>Spot / preemptible для прерываемых задач (CI, батчи)</td><td>до ~90%</td></tr>
<tr><td>Выключение dev-окружений ночью и в выходные</td><td>~65% времени</td></tr>
<tr><td>Политики жизненного цикла хранилища, удаление забытых дисков и IP</td><td>копится незаметно</td></tr></table></div>
<div class="note"><b>Теги.</b> Помечайте каждый ресурс владельцем, сервисом и окружением (<code>team=payments, env=prod</code>). Без тегов счёт — одна большая цифра, которую никто не может разобрать. Плюс бюджеты с оповещениями: о забытом GPU-кластере лучше узнать в первый день, а не в конце месяца.</div>`,
 check: [
  { id:'q8-4a', type:'single', prompt:'Для каких задач подходят spot-инстансы?', options:['Прерываемых: CI-раннеры, батч-обработка','Основной базы данных','Единственного экземпляра API','Хранения бэкапов'], answer:0, explanation:'Провайдер может забрать spot-машину в любой момент.' },
  { id:'q8-4b', type:'single', prompt:'Что делает HPA в Kubernetes?', options:['Меняет число подов по метрикам','Меняет число узлов кластера','Увеличивает лимиты памяти','Обновляет образы'], answer:0, explanation:'Узлами занимается Cluster Autoscaler или Karpenter.' }
 ]},
 { id:'8-5', title:'Serverless', html:`
<p><b>Serverless</b> — модель, где вы загружаете код или статический сайт, а серверы, масштабирование и простой берёт на себя платформа. Платите за вызовы и время выполнения, а без нагрузки — почти ноль.</p>
<div class="tbl"><table><tr><th>Вид</th><th>Примеры</th><th>Для чего</th></tr>
<tr><td>Функции (FaaS)</td><td>AWS Lambda, Azure Functions, Google Cloud Functions</td><td>Обработчики событий: загрузка файла, сообщение из очереди, webhook, cron</td></tr>
<tr><td>Функции на краю сети</td><td>Cloudflare Workers, Vercel Edge Functions</td><td>Логика рядом с пользователем: редиректы, A/B, авторизация</td></tr>
<tr><td>Платформы фронтенда</td><td>Vercel, Netlify</td><td>Деплой сайта по git push, preview на каждый PR, CDN</td></tr>
<tr><td>Контейнеры без серверов</td><td>Google Cloud Run, AWS Fargate, Azure Container Apps</td><td>Обычный контейнер, но масштабирование до нуля</td></tr>
<tr><td>PaaS</td><td>Heroku, Render, Railway</td><td>Простой хостинг приложений без настройки инфраструктуры</td></tr>
</table></div>
<pre><code># AWS Lambda на Python: обработчик загрузки файла в S3
def handler(event, context):
    for record in event["Records"]:
        key = record["s3"]["object"]["key"]
        make_thumbnail(key)
    return {"status": "ok"}</code></pre>
<div class="tbl"><table><tr><th>Плюсы</th><th>Минусы</th></tr>
<tr><td>Нет серверов для патчей и масштабирования</td><td>Холодный старт: первый вызов после простоя медленнее</td></tr>
<tr><td>Оплата по факту, масштаб до нуля</td><td>Лимиты: время выполнения, память, размер пакета</td></tr>
<tr><td>Быстрый старт проекта</td><td>Привязка к провайдеру, сложнее локальная отладка</td></tr>
<tr><td>Встроенная интеграция с событиями облака</td><td>При постоянной высокой нагрузке может быть дороже серверов</td></tr>
</table></div>
<div class="note why"><b>Serverless — не «без DevOps».</b> Остаются IaC (SAM, Serverless Framework, Terraform), CI/CD, мониторинг, права IAM для каждой функции, секреты и контроль стоимости.</div>`,
 check: [
  { id:'q8-5a', type:'single', prompt:'Что такое холодный старт в serverless?', options:['Задержка первого вызова, пока платформа поднимает окружение функции','Запуск в холодном дата-центре','Перезагрузка базы данных','Ошибка конфигурации'], answer:0, explanation:'После простоя окружение создаётся заново.' },
  { id:'q8-5b', type:'single', prompt:'Для какой задачи AWS Lambda подходит лучше всего?', options:['Обработка событий: загрузка файла, сообщение из очереди, webhook','Постоянно нагруженная база данных','Длительные вычисления на несколько часов','Хранение файлов'], answer:0, explanation:'Короткие обработчики событий.' }
 ]}
 ],
 test: [
  { id:'t8-1', type:'match', prompt:'Сопоставьте модель и пример.', pairs:[['IaaS','Виртуальная машина EC2'],['FaaS','AWS Lambda'],['SaaS','Gmail'],['CaaS','Managed Kubernetes']], explanation:'Разные уровни абстракции.', difficulty:1 },
  { id:'t8-2', type:'single', prompt:'Кто отвечает за публичный доступ к бакету с данными клиентов?', options:['Клиент облака','Облачный провайдер','Никто','Производитель дисков'], answer:0, explanation:'Безопасность «в облаке» — ваша зона ответственности.', difficulty:1 },
  { id:'t8-3', type:'analyze', prompt:'Что не так с этим правилом security group?', code:'type: ingress\nport: 5432\nprotocol: tcp\nsource: 0.0.0.0/0\ndescription: "temp for debugging"', options:['База открыта всему интернету','Неверный протокол','Порт 5432 не используется PostgreSQL','Ничего, правило временное'], answer:0, explanation:'Источник — только security group приложения.', difficulty:1 },
  { id:'t8-4', type:'single', prompt:'Какое масштабирование требует stateless-приложения?', options:['Горизонтальное','Вертикальное','Оба одинаково','Никакое'], answer:0, explanation:'Запрос может попасть на любой экземпляр.', difficulty:1 },
  { id:'t8-5', type:'multiple', prompt:'Что снижает облачный счёт? (несколько ответов)', options:['Rightsizing по реальной загрузке','Spot для CI','Выключение dev ночью','Публичные IP на каждом сервере'], answer:[0,1,2], explanation:'Неиспользуемые IP тоже стоят денег.', difficulty:1 },
  { id:'t8-6', type:'single', prompt:'Чем роли лучше долгоживущих ключей доступа?', options:['Креды временные и автоматически обновляются','Роли бесплатны','Роли дают больше прав','Ключи не работают в CI'], answer:0, explanation:'Утёкший временный токен скоро станет бесполезен.', difficulty:2 },
  { id:'t8-7', type:'single', prompt:'Что такое зона доступности?', options:['Изолированный дата-центр внутри региона','Отдельная страна','Подсеть VPC','Тариф провайдера'], answer:0, explanation:'Регион состоит из нескольких AZ.', difficulty:1 },
  { id:'t8-8', type:'single', prompt:'Где записываются все вызовы облачного API для аудита?', options:['CloudTrail / Audit Logs','В VPC Flow Logs','В state Terraform','В Git'], answer:0, explanation:'Журнал аудита API.', difficulty:2 },
  { id:'t8-9', type:'input', prompt:'Dev-окружение работает только в будни с 9 до 19 (50 ч в неделю) вместо 168 ч. Сколько процентов времени оно выключено? Округлите до целого.', answer:['70'], explanation:'(168 − 50) / 168 ≈ 0,70.', difficulty:2 },
  { id:'t8-10', type:'single', prompt:'Зачем помечать ресурсы тегами team и env?', options:['Чтобы распределять стоимость и находить владельцев','Чтобы ускорить ресурсы','Так требует TCP','Чтобы скрыть их'], answer:0, explanation:'Без тегов счёт не разобрать.', difficulty:1 },
  { id:'t8-11', type:'single', prompt:'Почему serverless может стать дороже серверов?', options:['При постоянной высокой нагрузке оплата за вызовы превышает стоимость постоянно работающих машин','Serverless всегда бесплатен','Из-за холодных стартов','Из-за HTTPS'], answer:0, explanation:'Экономия — при неравномерной или низкой нагрузке.', difficulty:2 },
  { id:'t8-12', type:'single', prompt:'Какая платформа деплоит фронтенд по git push и создаёт preview для каждого PR?', options:['Vercel / Netlify','Zabbix','Ansible','Nexus'], answer:0, explanation:'Платформы фронтенда.', difficulty:1 }
 ]
},
{
 id: 9, title: 'Provisioning и управление конфигурацией', short: 'Terraform, state, Ansible, Pulumi, Chef, Puppet',
 lessons: [
 { id:'9-1', title:'Зачем инфраструктура как код', html:`
<p>Серверы, сети, базы и DNS-записи, созданные кликами в консоли, — <b>снежинки</b>: уникальные, недокументированные, невоспроизводимые. Никто не знает, почему у одного сервера открыт порт 8443.</p>
<p><b>Infrastructure as Code (IaC)</b> — инфраструктура описывается файлами в Git и создаётся инструментом. Это даёт:</p>
<ul>
<li><b>воспроизводимость</b> — staging и prod из одного кода;</li>
<li><b>ревью</b> — изменение сети проходит PR, как изменение кода;</li>
<li><b>историю</b> — кто, когда и зачем открыл порт;</li>
<li><b>восстановление</b> — регион пропал, инфраструктура поднимается заново командой.</li>
</ul>
<h3>Декларативный и императивный подход</h3>
<div class="tbl"><table><tr><th></th><th>Декларативный</th><th>Императивный</th></tr>
<tr><td>Описываете</td><td>что должно быть: «3 сервера»</td><td>шаги: «создай сервер» × 3</td></tr>
<tr><td>Повторный запуск</td><td>ничего не меняет</td><td>может создать ещё 3</td></tr>
<tr><td>Примеры</td><td>Terraform, CloudFormation, Kubernetes</td><td>shell-скрипты с CLI облака</td></tr></table></div>
<p>Ключевое свойство — <b>идемпотентность</b>: повторное применение того же описания приводит к тому же результату.</p>
<div class="note why"><b>Pets vs cattle.</b> Питомца лечат, когда он болеет. Скот заменяют. С IaC и образами сервер перестаёт быть питомцем: сломался — пересоздали из кода. Это и есть <b>неизменяемая инфраструктура</b>: серверы не обновляют на месте, а заменяют новыми.</div>`,
 check: [
  { id:'q9-1a', type:'single', prompt:'Что значит идемпотентность в IaC?', options:['Повторное применение не меняет уже достигнутое состояние','Каждый запуск создаёт новые ресурсы','Код нельзя запускать дважды','Ресурсы удаляются после запуска'], answer:0, explanation:'Это свойство декларативных инструментов.' },
  { id:'q9-1b', type:'single', prompt:'Что такое неизменяемая инфраструктура?', options:['Серверы не правят на месте, а заменяют новыми из образа/кода','Инфраструктура, которую нельзя удалить','Серверы без обновлений безопасности','Только физические серверы'], answer:0, explanation:'Cattle, not pets.' }
 ]},
 { id:'9-2', title:'Terraform: план и применение', html:`
<p><b>Terraform</b> (и его открытый форк <b>OpenTofu</b>) описывает ресурсы на языке HCL и работает с сотнями <b>провайдеров</b>: AWS, GCP, Azure, Cloudflare, GitHub, Kubernetes.</p>
<pre><code>terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

variable "env" { type = string }

resource "aws_sqs_queue" "orders" {
  name                      = "orders-\${var.env}"
  message_retention_seconds = 345600
}

output "queue_url" { value = aws_sqs_queue.orders.url }</code></pre>
<h3>Рабочий цикл</h3>
<pre><code>terraform init                  # скачать провайдеры, подключить backend
terraform plan -out=tfplan      # сравнить код, state и реальность
terraform apply tfplan          # применить ровно сохранённый план</code></pre>
<pre><code>  # aws_sqs_queue.orders will be created
  + resource "aws_sqs_queue" "orders" {
      + name = "orders-prod"
      …
Plan: 1 to add, 0 to change, 0 to destroy.</code></pre>
<p>В плане: <code>+</code> создание, <code>~</code> изменение на месте, <code>-</code> удаление, <code>-/+</code> <b>пересоздание</b>. Последнее особенно опасно: смена некоторых атрибутов (например, имени базы) удаляет ресурс вместе с данными.</p>
<div class="note"><b>План — в PR.</b> Хорошая практика: CI запускает <code>terraform plan</code> на каждый PR и публикует результат комментарием. Ревьюер видит не только код, но и последствия. Применение — после слияния, тем же сохранённым планом.</div>`,
 check: [
  { id:'q9-2a', type:'single', prompt:'Что означает -/+ в выводе terraform plan?', options:['Ресурс будет удалён и создан заново','Ресурс будет изменён на месте','Ресурс не изменится','Ресурс будет импортирован'], answer:0, explanation:'Пересоздание — внимательно проверьте, не потеряются ли данные.' },
  { id:'q9-2b', type:'order', prompt:'Расставьте команды Terraform в рабочем порядке.', options:['terraform init','terraform plan -out=tfplan','terraform apply tfplan'], answer:[0,1,2], explanation:'Инициализация, план, применение плана.' }
 ]},
 { id:'9-3', title:'State, модули и дрейф', html:`
<h3>State</h3>
<p>Terraform хранит в <b>state</b> соответствие между ресурсами в коде и реальными объектами (ID, атрибуты). Без state он не знает, что очередь <code>orders</code> уже создана.</p>
<ul>
<li>Храните state в <b>удалённом backend</b> (S3 + блокировка, GCS, Terraform Cloud), а не локально: им пользуется вся команда и CI.</li>
<li><b>Блокировка</b> не даёт двум <code>apply</code> идти одновременно и испортить state.</li>
<li>State содержит <b>секреты</b> (пароли БД в открытом виде) — шифрование и ограниченный доступ обязательны. В Git его не коммитят.</li>
</ul>
<pre><code>terraform {
  backend "s3" {
    bucket       = "acme-tf-state"
    key          = "shop/prod.tfstate"
    region       = "eu-central-1"
    encrypt      = true
    use_lockfile = true
  }
}</code></pre>
<h3>Модули</h3>
<p>Модуль — переиспользуемый набор ресурсов с входными переменными: «сервис = очередь + бакет + IAM-роль». Окружения вызывают один модуль с разными параметрами.</p>
<h3>Дрейф</h3>
<p><b>Дрейф</b> — реальность разошлась с кодом: кто-то поменял настройку руками в консоли. <code>terraform plan</code> покажет расхождение, следующий <code>apply</code> вернёт значение из кода. Регулярный plan по расписанию обнаруживает дрейф заранее. Существующий ресурс, созданный руками, берут под управление через <code>import</code>.</p>`,
 check: [
  { id:'q9-3a', type:'single', prompt:'Почему state нельзя коммитить в Git?', options:['В нём могут быть секреты, и нет блокировок при параллельной работе','Он слишком маленький','Git не поддерживает JSON','Terraform его не читает из Git'], answer:0, explanation:'Удалённый backend с шифрованием и блокировкой.' },
  { id:'q9-3b', type:'single', prompt:'Что такое дрейф конфигурации?', options:['Реальная инфраструктура разошлась с описанием в коде','Медленный terraform plan','Смена версии провайдера','Перенос ресурса в другой регион'], answer:0, explanation:'Обычно из-за ручных правок.' }
 ]},
 { id:'9-4', title:'Ansible и управление конфигурацией', html:`
<p>Terraform создаёт ресурсы (<b>provisioning</b>), а что установлено <i>внутри</i> серверов — задача <b>управления конфигурацией</b>. Самый популярный инструмент — <b>Ansible</b>: подключается по SSH, агент на сервере не нужен.</p>
<pre><code># playbook.yml
- hosts: web
  become: true
  tasks:
    - name: nginx установлен
      ansible.builtin.apt: { name: nginx, state: present, update_cache: true }
    - name: конфиг на месте
      ansible.builtin.template: { src: nginx.conf.j2, dest: /etc/nginx/nginx.conf }
      notify: reload nginx
  handlers:
    - name: reload nginx
      ansible.builtin.service: { name: nginx, state: reloaded }</code></pre>
<ul>
<li><b>Inventory</b> — список хостов и групп (может строиться динамически из облака).</li>
<li><b>Модули</b> идемпотентны: <code>state: present</code> ничего не делает, если пакет уже стоит.</li>
<li><b>Handlers</b> срабатывают только если задача что-то изменила.</li>
<li><b>Роли</b> — переиспользуемые наборы задач; <b>Ansible Vault</b> шифрует секреты.</li>
</ul>
<div class="note why"><b>Где он нужен сегодня.</b> С контейнерами и Kubernetes многие сервисы обходятся без управления конфигурацией серверов: всё внутри образа. Ansible остаётся для VM, «железа», сетевого оборудования и подготовки базовых образов (вместе с Packer).</div>
<div class="tbl"><table><tr><th>Задача</th><th>Инструмент</th></tr>
<tr><td>Создать VPC, VM, БД, DNS</td><td>Terraform / OpenTofu, Pulumi</td></tr>
<tr><td>Настроить ОС и пакеты на VM</td><td>Ansible, Chef, Puppet</td></tr>
<tr><td>Собрать образ VM</td><td>Packer</td></tr>
<tr><td>Развернуть приложения в K8s</td><td>Helm, Kustomize, Argo CD</td></tr></table></div>`,
 check: [
  { id:'q9-4a', type:'single', prompt:'Как Ansible подключается к управляемым серверам?', options:['По SSH, без агента','Через агент, который нужно установить','Через Kubernetes API','Через HTTP-вебхуки'], answer:0, explanation:'Агентless — одно из главных преимуществ Ansible.' },
  { id:'q9-4b', type:'single', prompt:'Когда сработает handler reload nginx?', options:['Только если задача с notify что-то изменила','При каждом запуске playbook','Только при ошибке','Никогда автоматически'], answer:0, explanation:'Так nginx не перезагружается без нужды.' }
 ]},
 { id:'9-5', title:'Другие инструменты provisioning и конфигурации', html:`
<h3>Provisioning: кроме Terraform</h3>
<div class="tbl"><table><tr><th>Инструмент</th><th>Язык описания</th><th>Особенности</th></tr>
<tr><td>Terraform / OpenTofu</td><td>HCL</td><td>Мультиоблачный стандарт; OpenTofu — открытый форк</td></tr>
<tr><td>Pulumi</td><td>TypeScript, Python, Go, C#</td><td>Инфраструктура на обычных языках: циклы, функции, тесты</td></tr>
<tr><td>AWS CloudFormation</td><td>YAML / JSON</td><td>Родной для AWS, состояние хранит сам AWS</td></tr>
<tr><td>AWS CDK</td><td>TypeScript, Python и др.</td><td>Код генерирует CloudFormation</td></tr>
<tr><td>Azure Bicep, Google Deployment Manager</td><td>DSL провайдера</td><td>Родные инструменты других облаков</td></tr>
<tr><td>Crossplane</td><td>Kubernetes-манифесты</td><td>Облачные ресурсы как объекты Kubernetes</td></tr>
</table></div>
<pre><code>// Pulumi (TypeScript): та же логика, что в Terraform, но на языке программирования
const bucket = new aws.s3.BucketV2("assets", { tags: { team: "shop" } });
for (const env of ["dev", "prod"]) {
    new aws.sqs.Queue(\`orders-\${env}\`);
}</code></pre>
<h3>Управление конфигурацией: кроме Ansible</h3>
<div class="tbl"><table><tr><th>Инструмент</th><th>Модель</th><th>Язык</th></tr>
<tr><td>Ansible</td><td>Push по SSH, без агентов</td><td>YAML</td></tr>
<tr><td>Chef</td><td>Pull: агент на сервере тянет рецепты</td><td>Ruby DSL</td></tr>
<tr><td>Puppet</td><td>Pull, декларативные манифесты</td><td>Puppet DSL</td></tr>
<tr><td>Salt</td><td>Push и pull, быстрый транспорт</td><td>YAML + Jinja</td></tr>
</table></div>
<div class="note why"><b>Где граница.</b> Provisioning создаёт ресурсы (сети, машины, базы), управление конфигурацией настраивает уже созданные серверы (пакеты, файлы, сервисы). С контейнерами и неизменяемыми образами (Packer) вторая часть всё чаще уходит в сборку образа, а серверы не настраивают, а пересоздают.</div>`,
 check: [
  { id:'q9-5a', type:'single', prompt:'Чем Pulumi отличается от Terraform?', options:['Инфраструктура описывается на обычных языках программирования','Работает только в AWS','Не хранит состояние','Это инструмент мониторинга'], answer:0, explanation:'TypeScript, Python, Go, C#.' },
  { id:'q9-5b', type:'single', prompt:'Какая модель у Chef и Puppet в классическом варианте?', options:['Pull: агент на сервере сам забирает конфигурацию','Push по SSH без агентов','Только ручной запуск','Через DNS'], answer:0, explanation:'Ansible — push без агентов.' }
 ]}
 ],
 test: [
  { id:'t9-1', type:'single', prompt:'Главное преимущество IaC перед кликами в консоли?', options:['Воспроизводимость, ревью и история изменений','Ресурсы бесплатны','Не нужен облачный аккаунт','Быстрее интернет'], answer:0, explanation:'Инфраструктура становится кодом со всеми его практиками.', difficulty:1 },
  { id:'t9-2', type:'analyze', prompt:'Что опасного в этом плане?', code:'  # aws_db_instance.main must be replaced\n-/+ resource "aws_db_instance" "main" {\n      ~ identifier = "shop-db" -> "shop-db-prod" # forces replacement\n    }\nPlan: 1 to add, 0 to change, 1 to destroy.', options:['База будет удалена и создана заново — данные потеряются','Ничего, это переименование','Изменится только тег','План не применится'], answer:0, explanation:'forces replacement — пересоздание ресурса с данными.', difficulty:2 },
  { id:'t9-3', type:'single', prompt:'Зачем нужна блокировка state?', options:['Чтобы два apply не шли одновременно и не испортили state','Чтобы зашифровать state','Чтобы ускорить plan','Чтобы запретить destroy'], answer:0, explanation:'Конкурентная запись ломает state.', difficulty:2 },
  { id:'t9-4', type:'match', prompt:'Сопоставьте задачу и инструмент.', pairs:[['Создать VPC и базу','Terraform'],['Установить пакеты на VM','Ansible'],['Собрать образ VM','Packer'],['Развернуть чарт в K8s','Helm']], explanation:'У каждого инструмента своя ниша.', difficulty:1 },
  { id:'t9-5', type:'single', prompt:'Ресурс создан вручную, теперь его нужно описать в Terraform без пересоздания. Что делать?', options:['terraform import','terraform destroy и apply','Удалить ресурс руками','terraform taint'], answer:0, explanation:'import связывает существующий объект с кодом.', difficulty:2 },
  { id:'t9-6', type:'single', prompt:'Что делает команда terraform plan?', options:['Показывает, что изменится, сравнивая код, state и реальность','Применяет изменения','Скачивает провайдеры','Удаляет ресурсы'], answer:0, explanation:'plan — предпросмотр, без изменений.', difficulty:1 },
  { id:'t9-7', type:'multiple', prompt:'Как защитить Terraform state? (несколько ответов)', options:['Удалённый backend','Шифрование','Ограничение доступа','Коммит в публичный репозиторий'], answer:[0,1,2], explanation:'State может содержать секреты.', difficulty:1 },
  { id:'t9-8', type:'single', prompt:'Что значит state: present в задаче Ansible?', options:['Пакет должен быть установлен; если уже стоит — ничего не делать','Переустановить пакет','Удалить пакет','Обновить до последней версии'], answer:0, explanation:'Декларативное описание состояния, идемпотентно.', difficulty:1 },
  { id:'t9-9', type:'single', prompt:'Как обнаружить дрейф до того, как он навредит?', options:['Регулярный terraform plan по расписанию с оповещением','Удалять state раз в неделю','Запретить plan','Только ручные проверки'], answer:0, explanation:'План без изменений = нет дрейфа.', difficulty:2 },
  { id:'t9-10', type:'single', prompt:'Почему в PR полезно публиковать вывод terraform plan?', options:['Ревьюер видит реальные последствия изменения кода','Так требует HCL','Это ускоряет apply','Чтобы скрыть секреты'], answer:0, explanation:'Код может выглядеть безобидно, а план — показать пересоздание.', difficulty:1 },
  { id:'t9-11', type:'single', prompt:'Что такое OpenTofu?', options:['Открытый форк Terraform','Плагин Ansible','Облачный провайдер','Формат логов'], answer:0, explanation:'Совместим с HCL.', difficulty:2 },
  { id:'t9-12', type:'single', prompt:'Какой инструмент генерирует CloudFormation из TypeScript или Python?', options:['AWS CDK','Chef','Packer','Helm'], answer:0, explanation:'Cloud Development Kit.', difficulty:2 }
 ]
},
{
 id: 10, title: 'Непрерывная интеграция', short: 'CI, тесты, GitHub Actions, GitLab CI, Jenkins',
 lessons: [
 { id:'10-1', title:'Что такое CI', html:`
<p><b>Continuous Integration</b> — практика, при которой каждый разработчик сливает изменения в общую ветку часто (минимум раз в день), а каждое изменение автоматически собирается и тестируется.</p>
<p>CI — это не сервер Jenkins. Если ветки живут неделями, а сборка запускается раз в сутки, у вас есть CI-сервер, но нет интеграции.</p>
<h3>Правила CI</h3>
<ul>
<li>каждый push и PR запускает пайплайн;</li>
<li>сборка <b>быстрая</b> — ориентир до 10 минут;</li>
<li>красный main — авария: его чинят немедленно или откатывают изменение;</li>
<li>пайплайн описан кодом в репозитории (<code>.github/workflows/*.yml</code>, <code>.gitlab-ci.yml</code>, <code>Jenkinsfile</code>).</li>
</ul>
<p>Посмотрите, через что проходит коммит в типичном пайплайне:</p>
<div data-widget="pipeline"></div>
<div class="note why"><b>Fail fast.</b> Порядок стадий — от быстрых и дешёвых к медленным: линтер и юнит-тесты за минуту, затем сборка, затем интеграционные тесты. Если линтер упал, незачем ждать 15 минут e2e.</div>`,
 check: [
  { id:'q10-1a', type:'single', prompt:'Main покраснел после слияния. Что правильно сделать?', options:['Немедленно починить или откатить изменение','Продолжить сливать другие PR','Отключить упавший тест','Подождать до конца спринта'], answer:0, explanation:'Красный main блокирует всю команду.' },
  { id:'q10-1b', type:'single', prompt:'Почему линтер ставят в начало пайплайна?', options:['Он быстрый: при ошибке не нужно ждать медленные стадии','Так требует YAML','Он должен проверить собранный образ','Он устанавливает зависимости'], answer:0, explanation:'Принцип fail fast.' }
 ]},
 { id:'10-2', title:'Пирамида тестов', html:`
<p>Автотесты — основа доверия к пайплайну. Без них CI проверяет лишь то, что код компилируется.</p>
<pre><code>          /\\         E2E: браузер, весь стек — мало, медленно, хрупко
         /  \\
        /----\\       Интеграционные: сервис + БД / очередь / API
       /      \\
      /--------\\     Юнит: функции и классы — много, миллисекунды
</code></pre>
<div class="tbl"><table><tr><th>Уровень</th><th>Скорость</th><th>Что ловит</th></tr>
<tr><td>Юнит</td><td>мс</td><td>Ошибки логики</td></tr>
<tr><td>Интеграционные</td><td>секунды</td><td>Ошибки взаимодействия с БД, SQL, сериализацию</td></tr>
<tr><td>Контрактные</td><td>секунды</td><td>Несовместимость API между сервисами</td></tr>
<tr><td>E2E</td><td>минуты</td><td>Сломанные пользовательские сценарии</td></tr></table></div>
<p>Для интеграционных тестов поднимают настоящие зависимости в контейнерах (<b>Testcontainers</b>, services в CI), а не моки: мок PostgreSQL не поймает ошибку в SQL.</p>
<h3>Flaky-тесты</h3>
<p>Тест, который то проходит, то падает без изменений кода, — <b>нестабильный</b> (flaky). Он хуже отсутствия теста: команда привыкает нажимать «перезапустить» и пропускает настоящие падения. Причины: зависимость от времени, порядка выполнения, сети, гонки. Такие тесты помечают, выносят в карантин и чинят.</p>`,
 check: [
  { id:'q10-2a', type:'single', prompt:'Каких тестов в пирамиде должно быть больше всего?', options:['Юнит-тестов','E2E-тестов','Ручных тестов','Нагрузочных тестов'], answer:0, explanation:'Они быстрые и дешёвые.' },
  { id:'q10-2b', type:'single', prompt:'Чем опасны flaky-тесты?', options:['Команда перестаёт доверять CI и пропускает реальные падения','Они слишком медленные','Они увеличивают покрытие','Они удаляют данные'], answer:0, explanation:'Привычка жать «перезапуск» маскирует настоящие баги.' }
 ]},
 { id:'10-3', title:'GitHub Actions на практике', html:`
<p>Пайплайн GitHub Actions — YAML-файл в <code>.github/workflows/</code>. Структура: <b>workflow</b> → <b>jobs</b> (идут параллельно на разных раннерах) → <b>steps</b> (последовательно на одном).</p>
<pre><code>name: ci
on:
  pull_request:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env: { POSTGRES_PASSWORD: test }
        ports: ['5432:5432']
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run lint
      - run: npm test
        env:
          DATABASE_URL: postgres://postgres:test@localhost:5432/postgres
  image:
    needs: test                     # только после успешных тестов
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t ghcr.io/acme/shop:\${{ github.sha }} .</code></pre>
<ul>
<li><code>on</code> — триггеры: push, PR, расписание, ручной запуск, тег.</li>
<li><code>needs</code> — зависимости между jobs; без него jobs стартуют параллельно.</li>
<li><code>\${{ secrets.NAME }}</code> — секреты из настроек репозитория, в логах маскируются.</li>
<li><code>matrix</code> — запуск одной job на нескольких версиях (Node 18/20/22, разные ОС).</li>
</ul>
<div class="note"><b>Безопасность.</b> Закрепляйте сторонние actions на SHA коммита, а не на теге: тег можно перенести на вредоносную версию. И выдавайте <code>GITHUB_TOKEN</code> минимальные права через <code>permissions:</code>.</div>
<p>Аналоги: GitLab CI (stages и jobs в <code>.gitlab-ci.yml</code>), Jenkins (Groovy-пайплайн), CircleCI, Buildkite. Принципы одинаковые.</p>`,
 check: [
  { id:'q10-3a', type:'single', prompt:'Как в GitHub Actions задать, что job image запускается только после test?', options:['needs: test','after: test','depends: test','Расположить её ниже в файле'], answer:0, explanation:'Без needs jobs выполняются параллельно.' },
  { id:'q10-3b', type:'single', prompt:'Почему сторонние actions лучше закреплять на SHA?', options:['Тег можно переназначить на другой, возможно вредоносный, код','SHA работает быстрее','Теги не поддерживаются','Чтобы не платить за минуты'], answer:0, explanation:'SHA неизменен, это защита цепочки поставок.' }
 ]},
 { id:'10-4', title:'Быстрый пайплайн', html:`
<p>Медленный CI убивает частую интеграцию: если проверка идёт 40 минут, разработчики копят изменения и сливают реже. Способы ускорить:</p>
<ul>
<li><b>Кэш зависимостей</b> по хешу lock-файла: <code>node_modules</code>, <code>~/.m2</code>, <code>~/.cache/pip</code>. При неизменном lock-файле установка занимает секунды.</li>
<li><b>Кэш слоёв Docker</b> (<code>--cache-from</code>, BuildKit cache) — модуль 7.</li>
<li><b>Параллельность</b>: разбить тесты на шарды и гонять на нескольких раннерах.</li>
<li><b>Запуск только затронутого</b>: в монорепозитории тестировать только изменившиеся пакеты (Nx, Turborepo, Bazel, <code>paths:</code>-фильтры).</li>
<li><b>Быстрое — раньше</b>: тяжёлые e2e можно запускать после слияния или по расписанию, а на PR — смоук-набор.</li>
</ul>
<pre><code>- uses: actions/cache@v4
  with:
    path: ~/.npm
    key: npm-\${{ hashFiles('package-lock.json') }}
    restore-keys: npm-</code></pre>
<div class="note why"><b>Измеряйте.</b> Посмотрите, какая стадия занимает больше всего времени, прежде чем оптимизировать. Часто 70% пайплайна — одна медленная установка зависимостей без кэша или один тест, ждущий таймаут.</div>`,
 check: [
  { id:'q10-4a', type:'single', prompt:'Что используют в качестве ключа кэша зависимостей?', options:['Хеш lock-файла','Номер сборки','Имя ветки и время','Случайное число'], answer:0, explanation:'Lock-файл не изменился — зависимости те же, кэш валиден.' },
  { id:'q10-4b', type:'multiple', prompt:'Что ускоряет CI-пайплайн? (несколько ответов)', options:['Кэш зависимостей','Шардирование тестов','Тестирование только затронутых пакетов','Увеличение таймаутов тестов'], answer:[0,1,2], explanation:'Таймауты сами по себе ничего не ускоряют.' }
 ]},
 { id:'10-5', title:'Другие CI/CD-системы', html:`
<p>Идеи CI/CD одинаковы везде: пайплайн из стадий, раннеры, кэш, артефакты, секреты. Меняется синтаксис и модель хостинга.</p>
<div class="tbl"><table><tr><th>Система</th><th>Особенности</th></tr>
<tr><td>GitHub Actions</td><td>Встроена в GitHub, маркетплейс готовых действий (модуль 10.3)</td></tr>
<tr><td>GitLab CI</td><td><code>.gitlab-ci.yml</code>, встроена в GitLab, свои раннеры, сильная on-premise история</td></tr>
<tr><td>Jenkins</td><td>Самый старый и гибкий, тысячи плагинов, Jenkinsfile на Groovy; требует поддержки сервера</td></tr>
<tr><td>CircleCI, Buildkite</td><td>Облачные CI; Buildkite — облачная оркестрация с вашими раннерами</td></tr>
<tr><td>TeamCity</td><td>От JetBrains, удобен для .NET и JVM, on-premise</td></tr>
<tr><td>Octopus Deploy</td><td>Специализирован на развёртывании (CD) и релизах по окружениям</td></tr>
<tr><td>Azure DevOps Pipelines</td><td>В экосистеме Microsoft</td></tr>
</table></div>
<pre><code># .gitlab-ci.yml
stages: [test, build, deploy]

test:
  stage: test
  image: node:22
  cache: { key: { files: [package-lock.json] }, paths: [.npm/] }
  script:
    - npm ci --cache .npm
    - npm test

build:
  stage: build
  image: docker:27
  services: [docker:27-dind]
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

deploy:
  stage: deploy
  environment: production
  when: manual
  rules: [{ if: '$CI_COMMIT_BRANCH == "main"' }]
  script: ./deploy.sh $CI_COMMIT_SHA</code></pre>
<pre><code>// Jenkinsfile
pipeline {
  agent any
  stages {
    stage('Test')  { steps { sh 'npm ci &amp;&amp; npm test' } }
    stage('Build') { steps { sh 'docker build -t app:$GIT_COMMIT .' } }
  }
}</code></pre>
<div class="note why"><b>Как выбирать.</b> Обычно CI живёт там же, где код: GitHub → Actions, GitLab → GitLab CI. Jenkins выбирают, когда нужна полная свобода и всё внутри своей сети, — но платят за это поддержкой сервера и плагинов.</div>`,
 check: [
  { id:'q10-5a', type:'single', prompt:'Как называется файл пайплайна GitLab CI?', options:['.gitlab-ci.yml','Jenkinsfile','.github/workflows/ci.yml','pipeline.json'], answer:0, explanation:'В корне репозитория.' },
  { id:'q10-5b', type:'single', prompt:'Главный минус собственного Jenkins?', options:['Сервер и плагины нужно поддерживать и обновлять самим','Нельзя запускать тесты','Работает только с GitHub','Нет пайплайнов'], answer:0, explanation:'Гибкость в обмен на поддержку.' }
 ]}
 ],
 test: [
  { id:'t10-1', type:'single', prompt:'Что важнее всего для CI как практики?', options:['Частая интеграция в общую ветку с автоматической проверкой','Наличие Jenkins','Ночные сборки','Ручное тестирование перед слиянием'], answer:0, explanation:'Сервер без частой интеграции — не CI.', difficulty:1 },
  { id:'t10-2', type:'order', prompt:'Расставьте стадии пайплайна по принципу fail fast.', options:['Линтер','Юнит-тесты','Сборка образа','Интеграционные тесты','E2E-тесты'], answer:[0,1,2,3,4], explanation:'От быстрых к медленным.', difficulty:2 },
  { id:'t10-3', type:'analyze', prompt:'Почему этот пайплайн каждый раз ставит зависимости заново?', code:'- uses: actions/cache@v4\n  with:\n    path: ~/.npm\n    key: npm-${{ github.run_id }}', options:['Ключ кэша уникален для каждого запуска, кэш никогда не совпадает','Неверный путь','actions/cache не поддерживает npm','Нужно указать restore-keys: latest'], answer:0, explanation:'Ключ должен зависеть от lock-файла: hashFiles(\'package-lock.json\').', difficulty:3 },
  { id:'t10-4', type:'match', prompt:'Сопоставьте вид теста и что он ловит.', pairs:[['Юнит','Ошибки логики функции'],['Интеграционный','Ошибки работы с БД'],['Контрактный','Несовместимость API сервисов'],['E2E','Сломанный пользовательский сценарий']], explanation:'Пирамида тестов.', difficulty:1 },
  { id:'t10-5', type:'single', prompt:'Где в GitHub Actions хранить токен для публикации образа?', options:['В secrets репозитория или окружения','Прямо в YAML','В README','В переменной в коде'], answer:0, explanation:'Секреты маскируются в логах и не попадают в репозиторий.', difficulty:1 },
  { id:'t10-6', type:'single', prompt:'Что делает matrix в CI?', options:['Запускает одну job на нескольких комбинациях версий/ОС','Строит граф зависимостей','Шифрует артефакты','Объединяет все jobs в одну'], answer:0, explanation:'Например, Node 18, 20 и 22 параллельно.', difficulty:1 },
  { id:'t10-7', type:'single', prompt:'Как правильно поступить с flaky-тестом?', options:['Изолировать в карантин, найти причину и починить','Добавить автоматический перезапуск 5 раз','Удалить навсегда','Игнорировать'], answer:0, explanation:'Ретраи маскируют проблему, удаление теряет проверку.', difficulty:2 },
  { id:'t10-8', type:'single', prompt:'Почему для интеграционных тестов лучше настоящий PostgreSQL в контейнере, а не мок?', options:['Мок не поймает ошибки в SQL и поведении БД','Мок медленнее','Мок нельзя запустить в CI','Так требует GitHub'], answer:0, explanation:'Testcontainers или services дают настоящую БД.', difficulty:2 },
  { id:'t10-9', type:'input', prompt:'Тесты идут 24 минуты на одном раннере. Сколько минут примерно займут при равномерном разбиении на 4 шарда? Введите число.', answer:['6'], explanation:'24 / 4 = 6 (без учёта накладных расходов).', difficulty:1 },
  { id:'t10-10', type:'single', prompt:'Какие права выдавать GITHUB_TOKEN в workflow?', options:['Минимально необходимые через permissions','Всегда write-all','Права администратора организации','Никакие — он не нужен'], answer:0, explanation:'Принцип наименьших привилегий.', difficulty:2 },
  { id:'t10-11', type:'match', prompt:'Сопоставьте CI-систему и файл конфигурации.', pairs:[['GitHub Actions','.github/workflows/*.yml'],['GitLab CI','.gitlab-ci.yml'],['Jenkins','Jenkinsfile']], explanation:'Конфигурация пайплайна — в репозитории.', difficulty:1 },
  { id:'t10-12', type:'single', prompt:'Для чего специализирован Octopus Deploy?', options:['Развёртывание и релизы по окружениям (CD)','Хранение кода','Мониторинг','Сканирование уязвимостей'], answer:0, explanation:'CI обычно делает другой инструмент.', difficulty:2 }
 ]
},
{
 id: 11, title: 'Непрерывная поставка', short: 'CD, стратегии выкатки, флаги, откаты',
 lessons: [
 { id:'11-1', title:'Continuous delivery и continuous deployment', html:`
<ul>
<li><b>Continuous Delivery</b> — каждое изменение в main автоматически собрано, протестировано и <i>готово</i> к выкатке в прод. Сама выкатка — по кнопке.</li>
<li><b>Continuous Deployment</b> — кнопки нет: каждое изменение, прошедшее пайплайн, уходит в прод автоматически.</li>
</ul>
<pre><code>CI:          commit → build → test
Delivery:    … → staging → [кнопка] → prod
Deployment:  … → staging → auto → prod</code></pre>
<h3>Окружения</h3>
<p>Типичная цепочка: <b>dev</b> (эксперименты) → <b>staging</b> (копия прода для финальной проверки) → <b>production</b>. Часто добавляют <b>preview-окружения</b>: под каждый PR поднимается временная копия приложения со своим URL, её удаляют после слияния.</p>
<div class="note why"><b>Деплой ≠ релиз.</b> Деплой — техническое событие: новый код запущен на серверах. Релиз — бизнес-событие: пользователи получили функцию. Feature-флаги (урок 7-3) разделяют их: код выкатили во вторник, а функцию включили в четверг для 10% пользователей.</div>
<h3>Миграции базы данных</h3>
<p>Код и схема БД выкатываются не одновременно, поэтому изменения схемы делают <b>обратно совместимыми</b> по схеме expand → migrate → contract:</p>
<ol class="steps">
<li><b>Expand:</b> добавить новую колонку, не удаляя старую. Старый код продолжает работать.</li>
<li><b>Migrate:</b> новый код пишет в обе колонки, фоновая задача переносит данные.</li>
<li><b>Contract:</b> когда старый код нигде не работает, удалить старую колонку.</li>
</ol>`,
 check: [
  { id:'q11-1a', type:'single', prompt:'Чем continuous deployment отличается от continuous delivery?', options:['Выкатка в прод происходит автоматически, без ручного шага','Нет тестов','Нет staging','Выкатка раз в неделю'], answer:0, explanation:'В delivery последний шаг ручной.' },
  { id:'q11-1b', type:'order', prompt:'Расставьте шаги безопасного переименования колонки в БД.', options:['Добавить новую колонку','Писать в обе колонки и перенести данные','Перевести чтение на новую колонку','Удалить старую колонку'], answer:[0,1,2,3], explanation:'Expand → migrate → contract.' }
 ]},
 { id:'11-2', title:'Стратегии выкатки', html:`
<div class="tbl"><table><tr><th>Стратегия</th><th>Как работает</th></tr>
<tr><td><b>Recreate</b></td><td>Остановить все старые, запустить новые. Простой неизбежен.</td></tr>
<tr><td><b>Rolling update</b></td><td>Заменять экземпляры по одному-два. По умолчанию в Kubernetes.</td></tr>
<tr><td><b>Blue-green</b></td><td>Рядом с работающей (blue) поднимается полная новая копия (green). Трафик переключается разом, откат — переключение обратно.</td></tr>
<tr><td><b>Canary</b></td><td>Новая версия получает малую долю трафика (1–5%). Метрики в норме — доля растёт; нет — автоматический откат.</td></tr></table></div>
<h3>Rolling update в Kubernetes</h3>
<p>Параметры <code>maxSurge</code> (сколько подов можно создать сверх нормы) и <code>maxUnavailable</code> (сколько может отсутствовать) управляют скоростью и безопасностью.</p>
<div data-widget="rollout"></div>
<pre><code>kubectl set image deploy/shop api=registry.example.com/shop:a81d0e4
kubectl rollout status deploy/shop
kubectl rollout undo deploy/shop     # откат на предыдущий ReplicaSet</code></pre>
<h3>Канарейка с анализом</h3>
<p>Инструменты вроде Argo Rollouts и Flagger автоматизируют канарейку: шаг 5% → пауза 10 минут → запрос к Prometheus «доля 5xx у канарейки не выше, чем у стабильной версии» → следующий шаг или откат. Человек нужен только когда что-то пошло не так.</p>
<div class="note"><b>Две версии одновременно.</b> При rolling и canary старая и новая версии работают параллельно. API, формат сообщений в очереди и схема БД должны быть совместимы в обе стороны.</div>`,
 check: [
  { id:'q11-2a', type:'single', prompt:'Какая стратегия даёт самый быстрый откат ценой двойных ресурсов?', options:['Blue-green','Recreate','Rolling update','Canary 1%'], answer:0, explanation:'Старая копия работает рядом — откат это переключение трафика.' },
  { id:'q11-2b', type:'single', prompt:'Что гарантирует maxUnavailable: 0 при rolling update?', options:['Число готовых подов не опускается ниже желаемого','Выкатка идёт без новых подов','Все поды заменяются одновременно','Откат невозможен'], answer:0, explanation:'Старый под удаляется только когда готов новый.' }
 ]},
 { id:'11-3', title:'Feature-флаги и откаты', html:`
<p><b>Feature flag</b> — условие в коде, которое включает функцию без нового деплоя:</p>
<pre><code>if (flags.isEnabled('discount-badge', { userId, country })) {
  renderDiscountBadge();
}</code></pre>
<p>Флаги управляются из сервиса (LaunchDarkly, Unleash, Flagsmith, OpenFeature-совместимые) и позволяют:</p>
<ul>
<li>сливать незаконченный код в main (trunk-based);</li>
<li>включать функцию для сотрудников, затем 1%, 10%, 100% пользователей;</li>
<li>проводить A/B-эксперименты;</li>
<li><b>выключить сломанное за секунды</b> — kill switch, без отката деплоя.</li>
</ul>
<div class="note"><b>Долг флагов.</b> Каждый флаг удваивает число путей выполнения. Удаляйте флаг сразу после полного включения: ставьте задачу на удаление в момент создания.</div>
<h3>Откат или фикс вперёд?</h3>
<ul>
<li><b>Rollback</b> — вернуть предыдущий артефакт. Быстро и предсказуемо, если артефакты неизменяемы и миграции обратно совместимы.</li>
<li><b>Roll forward</b> — выкатить исправление. Оправдано, если фикс очевиден и пайплайн быстрый.</li>
</ul>
<p>Правило: <b>сначала остановить ущерб, потом разбираться</b>. Выключить флаг или откатиться — почти всегда быстрее, чем дебажить в проде под нагрузкой.</p>`,
 check: [
  { id:'q11-3a', type:'single', prompt:'Новая функция ломает оплату у части пользователей. Самое быстрое действие?', options:['Выключить её feature-флагом','Начать дебажить в проде','Написать фикс и ждать ревью','Перезагрузить серверы'], answer:0, explanation:'Kill switch останавливает ущерб за секунды.' },
  { id:'q11-3b', type:'single', prompt:'Что такое долг флагов?', options:['Старые невыключенные флаги, усложняющие код','Плата сервису флагов','Задержка включения флага','Флаг без названия'], answer:0, explanation:'Флаги нужно удалять после полной выкатки.' }
 ]}
 ],
 test: [
  { id:'t11-1', type:'match', prompt:'Сопоставьте стратегию и главный минус.', pairs:[['Recreate','Простой во время выкатки'],['Blue-green','Двойные ресурсы'],['Canary','Нужны метрики и управление трафиком'],['Rolling','Медленный откат, две версии сразу']], explanation:'Выбор стратегии — компромисс.', difficulty:2 },
  { id:'t11-2', type:'single', prompt:'Что разделяют feature-флаги?', options:['Деплой и релиз','Код и тесты','Dev и Ops','Frontend и backend'], answer:0, explanation:'Код выкачен, но функция включается отдельно.', difficulty:1 },
  { id:'t11-3', type:'single', prompt:'Почему нельзя одной миграцией переименовать колонку при rolling update?', options:['Старые поды, читающие старое имя, начнут падать','PostgreSQL не умеет переименовывать','Миграции запрещены в Kubernetes','Это сломает Git'], answer:0, explanation:'Во время выкатки работают обе версии кода.', difficulty:2 },
  { id:'t11-4', type:'single', prompt:'Какая команда откатит Deployment на предыдущую версию?', options:['kubectl rollout undo deploy/shop','kubectl delete deploy/shop','kubectl rollback shop','kubectl apply --previous'], answer:0, explanation:'Предыдущий ReplicaSet хранится в истории.', difficulty:1 },
  { id:'t11-5', type:'analyze', prompt:'Что сделает инструмент канареечной выкатки на этом шаге?', code:'step: 3/6  weight: 20%\nanalysis: http_5xx_ratio\n  stable: 0.3%\n  canary: 4.8%   threshold: <= 1%\nresult: Failed', options:['Автоматически откатит канарейку и вернёт 100% трафика стабильной версии','Увеличит долю до 50%','Остановится и будет ждать вечно','Удалит стабильную версию'], answer:0, explanation:'Анализ провален — автоматический откат.', difficulty:2 },
  { id:'t11-6', type:'multiple', prompt:'Для чего используют feature-флаги? (несколько ответов)', options:['Постепенное включение для доли пользователей','Kill switch для сломанной функции','A/B-эксперименты','Хранение паролей'], answer:[0,1,2], explanation:'Секреты флагами не управляют.', difficulty:1 },
  { id:'t11-7', type:'single', prompt:'Что такое preview-окружение?', options:['Временная копия приложения под конкретный PR','Продакшен для VIP-пользователей','Окружение для нагрузочных тестов','Локальный docker compose'], answer:0, explanation:'Поднимается на PR и удаляется после слияния.', difficulty:1 },
  { id:'t11-8', type:'single', prompt:'Во время инцидента после выкатки, что делать в первую очередь?', options:['Остановить ущерб: откатить или выключить флаг','Найти виноватого','Написать постмортем','Добавить логи и ждать'], answer:0, explanation:'Сначала восстановление, потом разбор.', difficulty:1 }
 ]
},
{
 id: 12, title: 'Секреты и безопасность поставки', short: 'Shift left, секреты, Vault и SOPS, цепочка поставок',
 lessons: [
 { id:'12-1', title:'Безопасность в каждом этапе', html:`
<p><b>DevSecOps</b> — безопасность встроена в пайплайн, а не проверяется отдельной командой перед релизом. Проверки автоматизированы и идут на каждый PR:</p>
<div class="tbl"><table><tr><th>Проверка</th><th>Что ищет</th><th>Примеры</th></tr>
<tr><td>SAST</td><td>Уязвимости в исходном коде: SQL-инъекции, XSS</td><td>Semgrep, CodeQL</td></tr>
<tr><td>SCA</td><td>Известные CVE в зависимостях</td><td>Dependabot, Snyk, npm audit</td></tr>
<tr><td>Сканирование секретов</td><td>Ключи и пароли в коде</td><td>gitleaks, trufflehog</td></tr>
<tr><td>Сканирование образов</td><td>CVE в пакетах ОС образа</td><td>Trivy, Grype</td></tr>
<tr><td>IaC-сканирование</td><td>Открытые бакеты, 0.0.0.0/0</td><td>Checkov, tfsec</td></tr>
<tr><td>DAST</td><td>Уязвимости работающего приложения</td><td>OWASP ZAP</td></tr></table></div>
<div class="note why"><b>Шум — главный враг.</b> Сканер, выдающий 400 предупреждений, все игнорируют. Начинайте с блокировки только критичных находок с доступным исправлением, остальное — в бэклог. Ужесточайте постепенно.</div>
<p>CVE ранжируют по CVSS (0–10), но важнее контекст: уязвимость в функции, которую ваш код не вызывает, менее срочна, чем средняя уязвимость в публичном эндпоинте.</p>`,
 check: [
  { id:'q12-1a', type:'match', prompt:'Сопоставьте вид проверки и объект.', pairs:[['SAST','Исходный код'],['SCA','Зависимости'],['DAST','Работающее приложение'],['IaC-сканер','Terraform и манифесты']], explanation:'Разные слои — разные инструменты.' },
  { id:'q12-1b', type:'single', prompt:'Как внедрять сканеры, чтобы их не начали игнорировать?', options:['Сначала блокировать только критичные находки с исправлением','Сразу блокировать всё','Запускать раз в год','Не показывать результаты разработчикам'], answer:0, explanation:'Шум разрушает доверие к инструменту.' }
 ]},
 { id:'12-2', title:'Управление секретами', html:`
<p>Секреты — пароли БД, API-ключи, TLS-ключи, токены. Где их <b>нельзя</b> хранить: в коде, в Git, в Docker-образе, в переменных Dockerfile, в незашифрованных конфигах, в чатах.</p>
<h3>Где хранить</h3>
<ul>
<li><b>Менеджеры секретов:</b> HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager, Azure Key Vault.</li>
<li><b>В Kubernetes</b> — синхронизация из менеджера через External Secrets Operator или CSI-драйвер; для GitOps — Sealed Secrets или SOPS (секрет в Git зашифрован, расшифровать может только кластер).</li>
<li><b>В CI</b> — секреты платформы с ограничением по окружениям, а лучше OIDC без секретов вообще.</li>
</ul>
<h3>Хорошие свойства</h3>
<ul>
<li><b>Ротация</b> — регулярная автоматическая смена. Чем короче жизнь секрета, тем меньше ущерб от утечки.</li>
<li><b>Динамические секреты</b> — Vault выдаёт уникальные креды к БД на час для каждого экземпляра приложения.</li>
<li><b>Аудит</b> — кто и когда читал секрет.</li>
<li><b>Наименьший доступ</b> — сервис видит только свои секреты.</li>
</ul>
<div class="note"><b>План на утечку.</b> Утечки случаются. Важно, сколько времени займёт ротация: минуты по кнопке или неделя ручной работы по всем сервисам. Отрепетируйте её заранее.</div>`,
 check: [
  { id:'q12-2a', type:'single', prompt:'Как безопасно хранить Kubernetes-секреты в GitOps-репозитории?', options:['В зашифрованном виде через Sealed Secrets или SOPS','В виде обычного Secret в base64','В ConfigMap','В README'], answer:0, explanation:'Расшифровать может только кластер.' },
  { id:'q12-2b', type:'single', prompt:'В чём выгода динамических секретов?', options:['Креды уникальны и живут недолго, утечка быстро обесценивается','Их не нужно хранить','Они длиннее','Они не требуют сети'], answer:0, explanation:'Короткая жизнь — малый ущерб.' }
 ]},
 { id:'12-3', title:'Хранилища секретов: Vault, SOPS, Sealed Secrets, ESO', html:`
<div class="tbl"><table><tr><th>Инструмент</th><th>Идея</th><th>Когда</th></tr>
<tr><td>HashiCorp Vault / OpenBao</td><td>Централизованное хранилище с политиками доступа, аудитом и <b>динамическими секретами</b> — пароль к БД создаётся на час под конкретный сервис</td><td>Много сервисов и окружений, строгие требования</td></tr>
<tr><td>Облачные менеджеры</td><td>AWS Secrets Manager, GCP Secret Manager, Azure Key Vault; доступ через IAM-роли</td><td>Вы живёте в одном облаке</td></tr>
<tr><td>SOPS</td><td>Файл секретов шифруется (ключи KMS, age, PGP) и хранится в Git; открытыми остаются ключи, зашифрованы значения</td><td>GitOps, небольшие команды</td></tr>
<tr><td>Sealed Secrets</td><td>Секрет шифруется публичным ключом контроллера в кластере; в Git лежит SealedSecret, расшифровать может только кластер</td><td>GitOps в Kubernetes</td></tr>
<tr><td>External Secrets Operator (ESO)</td><td>Контроллер в Kubernetes синхронизирует секреты из Vault или облачного менеджера в обычные Secret</td><td>Kubernetes + внешнее хранилище</td></tr>
</table></div>
<pre><code># SOPS: в Git видно структуру, но не значения
db:
    password: ENC[AES256_GCM,data:Tr7o1...,type:str]
sops:
    kms: [arn: arn:aws:kms:eu-central-1:111122223333:key/...]

$ sops -d secrets.enc.yaml        # расшифровать (нужен доступ к ключу KMS)

# ESO: секрет из AWS Secrets Manager → Kubernetes Secret
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
spec:
  secretStoreRef: { name: aws, kind: ClusterSecretStore }
  target: { name: db-credentials }
  data:
    - secretKey: password
      remoteRef: { key: prod/shop/db, property: password }</code></pre>
<div class="note why"><b>Общие правила</b>: секреты не в коде и не в открытом виде в Git; доступ — по принципу наименьших привилегий; каждое чтение логируется; ротация автоматизирована; короткоживущие учётные данные лучше вечных.</div>`,
 check: [
  { id:'q12-3a', type:'single', prompt:'Что такое динамический секрет в Vault?', options:['Учётные данные, которые создаются по запросу на короткий срок и затем отзываются','Секрет, который меняется каждую секунду','Пароль в переменной окружения','Зашифрованный файл в Git'], answer:0, explanation:'Например, пользователь БД на час.' },
  { id:'q12-3b', type:'single', prompt:'Как Sealed Secrets позволяет хранить секреты в Git?', options:['Секрет шифруется публичным ключом контроллера, расшифровать может только кластер','Секрет хранится в открытом виде в приватном репозитории','Секрет кодируется в base64','Секрет удаляется после коммита'], answer:0, explanation:'Base64 — не шифрование.' }
 ]},
 { id:'12-4', title:'Цепочка поставок ПО', html:`
<p><b>Атака на цепочку поставок</b> — компрометация не вашего кода, а того, из чего и чем он собирается: зависимостей, CI, реестров. Примеры: SolarWinds (вредонос внедрён в сборку), xz-utils (бэкдор от «доверенного» мейнтейнера), typosquatting (<code>reqeusts</code> вместо <code>requests</code>), захват перенесённого тега GitHub Action.</p>
<h3>Защита</h3>
<ul>
<li><b>SBOM</b> (Software Bill of Materials) — опись всех компонентов артефакта в формате SPDX или CycloneDX. Вышла новая CVE — за минуты понятно, какие сервисы затронуты.</li>
<li><b>Подпись артефактов</b> — Sigstore / cosign: образ подписывается в CI, кластер принимает только подписанные (admission-политика).</li>
<li><b>Provenance</b> — подписанная запись, <i>где и из какого коммита</i> собран артефакт. Фреймворк <b>SLSA</b> описывает уровни зрелости.</li>
<li><b>Закрепление</b> зависимостей по lock-файлам и хешам, actions — по SHA, образы — по дайджесту.</li>
<li><b>Изоляция CI</b>: эфемерные раннеры, минимальные права токенов, отдельные креды для публикации.</li>
</ul>
<pre><code>cosign sign registry.example.com/shop@sha256:9b1c…
syft registry.example.com/shop:3f9c2e1 -o cyclonedx-json > sbom.json</code></pre>`,
 check: [
  { id:'q12-4a', type:'single', prompt:'Для чего нужен SBOM?', options:['Быстро узнать, какие артефакты содержат уязвимый компонент','Ускорить сборку','Зашифровать образ','Заменить тесты'], answer:0, explanation:'Опись компонентов — основа реагирования на новые CVE.' },
  { id:'q12-4b', type:'single', prompt:'Что гарантирует проверка подписи образа при деплое?', options:['Образ собран доверенным пайплайном и не подменён','Образ без уязвимостей','Образ маленький','Образ быстро стартует'], answer:0, explanation:'Подпись — про происхождение и целостность, не про CVE.' }
 ]}
 ],
 test: [
  { id:'t12-1', type:'single', prompt:'Какой инструмент найдёт известную CVE в библиотеке из package-lock.json?', options:['SCA-сканер (Dependabot, Snyk)','DAST','Линтер стиля','Профилировщик'], answer:0, explanation:'Software Composition Analysis.', difficulty:1 },
  { id:'t12-2', type:'multiple', prompt:'Где нельзя хранить секреты? (несколько ответов)', options:['В Git','В ENV Dockerfile','В Docker-образе','В менеджере секретов'], answer:[0,1,2], explanation:'Менеджер секретов — правильное место.', difficulty:1 },
  { id:'t12-3', type:'match', prompt:'Сопоставьте инструмент и назначение.', pairs:[['cosign','Подпись образов'],['Trivy','Сканирование образов на CVE'],['gitleaks','Поиск секретов в репозитории'],['Kyverno','Политики допуска в кластер']], explanation:'Набор инструментов DevSecOps.', difficulty:2 },
  { id:'t12-4', type:'single', prompt:'Что такое typosquatting?', options:['Публикация вредоносного пакета с именем, похожим на популярный','Опечатка в коде','Перебор паролей','Атака на DNS'], answer:0, explanation:'reqeusts вместо requests.', difficulty:1 },
  { id:'t12-5', type:'single', prompt:'Что описывает SLSA?', options:['Уровни зрелости защиты цепочки поставок и provenance','Формат логов','Стандарт SLO','Протокол шифрования'], answer:0, explanation:'Supply-chain Levels for Software Artifacts.', difficulty:3 },
  { id:'t12-6', type:'single', prompt:'Почему важна скорость ротации секретов?', options:['Утечки неизбежны, и ущерб зависит от того, как быстро секрет станет недействительным','Секреты устаревают сами','Так требует Git','Чтобы экономить место'], answer:0, explanation:'Готовьтесь к утечке заранее.', difficulty:2 },
  { id:'t12-7', type:'single', prompt:'Что означает «защита в глубину»?', options:['Несколько независимых слоёв защиты, каждый ограничивает ущерб','Одна очень надёжная мера','Шифрование только диска','Скрытие кода'], answer:0, explanation:'Defense in depth.', difficulty:1 },
  { id:'t12-8', type:'order', prompt:'Расставьте проверки по моменту запуска в жизненном цикле, от ранней к поздней.', options:['Сканирование секретов в pre-commit','SAST на pull request','Сканирование собранного образа','Проверка подписи при допуске в кластер','DAST на работающем staging'], answer:[0,1,2,3,4], explanation:'От кода к работающему приложению.', difficulty:3 }
 ]
},
{
 id: 13, title: 'Мониторинг, логи и наблюдаемость', short: 'Метрики, Prometheus, логи, трейсы, платформы',
 lessons: [
 { id:'13-1', title:'Мониторинг и наблюдаемость', html:`
<p><b>Мониторинг</b> отвечает на заранее известные вопросы: «жив ли сервис», «сколько ошибок». <b>Наблюдаемость</b> (observability) — способность ответить на <i>новые</i> вопросы о системе по её внешним сигналам, не выкатывая новый код. Три столпа:</p>
<div class="tbl"><table><tr><th>Сигнал</th><th>Что это</th><th>Отвечает на</th></tr>
<tr><td>Метрики</td><td>Числа во времени</td><td>Что и насколько плохо?</td></tr>
<tr><td>Логи</td><td>События с контекстом</td><td>Что именно произошло?</td></tr>
<tr><td>Трейсы</td><td>Путь запроса через сервисы</td><td>Где тормозит или ломается?</td></tr></table></div>
<h3>Какие метрики собирать</h3>
<ul>
<li><b>RED</b> для сервисов: <b>R</b>ate (запросы в секунду), <b>E</b>rrors (доля ошибок), <b>D</b>uration (латентность, перцентили).</li>
<li><b>USE</b> для ресурсов: <b>U</b>tilization, <b>S</b>aturation (очередь, ожидание), <b>E</b>rrors.</li>
<li><b>Четыре золотых сигнала</b> Google SRE: latency, traffic, errors, saturation.</li>
</ul>
<div class="note why"><b>Перцентили, а не среднее.</b> Среднее 120 мс может скрывать, что каждый сотый запрос идёт 4 секунды. p99 = 4 с означает: 1% пользователей ждёт 4 секунды и дольше. При 100 запросах на страницу почти каждый пользователь хоть раз попадёт в этот хвост.</div>`,
 check: [
  { id:'q13-1a', type:'match', prompt:'Расшифруйте RED.', pairs:[['R','Rate — запросы в секунду'],['E','Errors — доля ошибок'],['D','Duration — латентность']], explanation:'RED — минимальный набор метрик сервиса.' },
  { id:'q13-1b', type:'single', prompt:'Почему для латентности смотрят p99, а не среднее?', options:['Среднее скрывает медленный хвост, который замечают пользователи','Среднее сложно посчитать','p99 всегда меньше','Так требует Prometheus'], answer:0, explanation:'Хвост распределения — реальный опыт заметной доли пользователей.' }
 ]},
 { id:'13-2', title:'Prometheus и PromQL', html:`
<p><b>Prometheus</b> — стандарт метрик в мире Kubernetes. Модель <b>pull</b>: сервер сам опрашивает (<i>скрейпит</i>) эндпоинт <code>/metrics</code> каждые 15–30 секунд.</p>
<pre><code># HELP http_requests_total Total HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/api/cart",status="200"} 184022
http_requests_total{method="GET",route="/api/cart",status="500"} 37
http_request_duration_seconds_bucket{route="/api/cart",le="0.1"} 171550</code></pre>
<h3>Типы метрик</h3>
<ul>
<li><b>Counter</b> — только растёт (запросы, ошибки). Смысл имеет скорость: <code>rate()</code>.</li>
<li><b>Gauge</b> — значение вверх-вниз (память, длина очереди).</li>
<li><b>Histogram</b> — распределение по корзинам, из него считают перцентили.</li>
</ul>
<h3>PromQL</h3>
<pre><code># запросов в секунду за последние 5 минут
sum(rate(http_requests_total[5m]))
# доля ошибок
sum(rate(http_requests_total{status=~"5.."}[5m]))
  / sum(rate(http_requests_total[5m]))
# p99 латентности
histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))</code></pre>
<div class="note"><b>Кардинальность.</b> Каждая уникальная комбинация меток — отдельный временной ряд. Метка <code>user_id</code> или полный URL с ID создаст миллионы рядов и положит Prometheus. Метки — только с ограниченным набором значений: route-шаблон, статус, метод.</div>
<p>Визуализация — <b>Grafana</b>, оповещения — <b>Alertmanager</b> (группировка, тишина, маршрутизация в Slack/PagerDuty). Для долгого хранения — Thanos, Mimir, VictoriaMetrics.</p>`,
 check: [
  { id:'q13-2a', type:'single', prompt:'Какую функцию применяют к counter, чтобы получить запросы в секунду?', options:['rate()','sum()','max()','histogram_quantile()'], answer:0, explanation:'Абсолютное значение счётчика почти бесполезно.' },
  { id:'q13-2b', type:'single', prompt:'Почему нельзя добавлять метку user_id к метрике?', options:['Взрыв кардинальности: миллионы временных рядов','Это запрещено синтаксисом','Метки не могут быть числами','Prometheus не хранит строки'], answer:0, explanation:'Для пользовательских деталей — логи и трейсы.' }
 ]},
 { id:'13-3', title:'Логи', html:`
<p>Лог из строк вида <code>Error processing order</code> трудно искать и агрегировать. <b>Структурированные логи</b> — JSON с полями:</p>
<pre><code>{"ts":"2026-10-12T09:41:07.312Z","level":"error","service":"checkout",
 "msg":"payment declined","order_id":"o-88213","provider":"stripe",
 "duration_ms":812,"trace_id":"4bf92f3577b34da6a3ce929d0e0e4736"}</code></pre>
<p>Теперь можно спросить: «сколько ошибок payment declined по провайдерам за час» — и связать запись с трейсом по <code>trace_id</code>.</p>
<h3>Уровни</h3>
<p><code>debug</code> — подробности для разработки; <code>info</code> — значимые события; <code>warn</code> — нештатное, но обработанное; <code>error</code> — операция не выполнена. В проде обычно info и выше.</p>
<h3>Сбор</h3>
<p>Приложение пишет в stdout → агент на узле (Fluent Bit, Vector, Promtail / Alloy) собирает, обогащает метками пода и отправляет в хранилище: <b>Loki</b>, Elasticsearch / OpenSearch, облачные сервисы.</p>
<div class="note"><b>Чего не писать в логи.</b> Пароли, токены, номера карт, персональные данные. Логи читает много людей и систем, хранятся они долго. Маскируйте на стороне приложения. И не логируйте каждый успешный запрос на высоконагруженном сервисе — для этого есть метрики, а логи стоят денег.</div>`,
 check: [
  { id:'q13-3a', type:'single', prompt:'Главное преимущество структурированных логов?', options:['Их можно фильтровать и агрегировать по полям','Они короче','Их не нужно хранить','Они автоматически исправляют ошибки'], answer:0, explanation:'JSON-поля — это готовые индексы для поиска.' },
  { id:'q13-3b', type:'multiple', prompt:'Что нельзя писать в логи? (несколько ответов)', options:['Пароли','Токены доступа','Номера карт','trace_id'], answer:[0,1,2], explanation:'trace_id, наоборот, полезен для связи сигналов.' }
 ]},
 { id:'13-4', title:'Распределённый трейсинг и OpenTelemetry', html:`
<p>В микросервисах один запрос пользователя проходит через 5–20 сервисов. Метрика говорит «checkout медленный», но где именно теряется время?</p>
<p><b>Трейс</b> — дерево <b>спанов</b>. Спан — одна операция: время начала, длительность, атрибуты, статус. Контекст (trace_id и id родительского спана) передаётся между сервисами в заголовке <code>traceparent</code> (стандарт W3C Trace Context).</p>
<pre><code>POST /checkout                         ████████████████████ 1240 ms
├─ auth.verify                         █ 18 ms
├─ cart.get                            ██ 45 ms
├─ inventory.reserve                   ███ 70 ms
└─ payment.charge                      ███████████████ 1080 ms
   └─ HTTP POST api.stripe.com         ██████████████ 1050 ms</code></pre>
<p>Сразу видно: время уходит во внешний платёжный API.</p>
<h3>OpenTelemetry</h3>
<p><b>OpenTelemetry (OTel)</b> — открытый вендор-нейтральный стандарт: API и SDK для метрик, логов и трейсов, автоинструментирование популярных фреймворков и <b>Collector</b>, который принимает данные и отправляет в любые бэкенды (Jaeger, Tempo, облачные APM).</p>
<div class="note why"><b>Сэмплинг.</b> Хранить трейс каждого запроса дорого. Head-сэмплинг сохраняет, например, 1% случайно. Tail-сэмплинг решает после завершения запроса: оставить все ошибочные и медленные, а из успешных — немного.</div>`,
 check: [
  { id:'q13-4a', type:'single', prompt:'Как контекст трейса передаётся между HTTP-сервисами?', options:['В заголовке traceparent','В теле ответа','Через общую базу','Через DNS'], answer:0, explanation:'Стандарт W3C Trace Context.' },
  { id:'q13-4b', type:'single', prompt:'Что делает tail-сэмплинг?', options:['Решает о сохранении трейса после его завершения, например оставляет все ошибки','Сохраняет только последние спаны','Удаляет логи','Сохраняет 100% трейсов'], answer:0, explanation:'Позволяет не терять интересные трейсы.' }
 ]},
 { id:'13-5', title:'Платформы мониторинга и логов', html:`
<p>Роадмап перечисляет много инструментов; полезно понимать, какую нишу каждый занимает.</p>
<div class="tbl"><table><tr><th>Задача</th><th>Открытые / self-hosted</th><th>SaaS</th></tr>
<tr><td>Метрики инфраструктуры</td><td>Prometheus + Grafana, Zabbix, VictoriaMetrics</td><td>Datadog, New Relic, Grafana Cloud, Dynatrace</td></tr>
<tr><td>Логи</td><td>Elastic Stack (Elasticsearch, Logstash/Beats, Kibana), Grafana Loki, Graylog, OpenSearch</td><td>Splunk, Papertrail, Datadog Logs</td></tr>
<tr><td>Трейсы</td><td>Jaeger, Grafana Tempo, Zipkin</td><td>Datadog APM, New Relic, Honeycomb</td></tr>
<tr><td>Сбор и стандарт</td><td>OpenTelemetry Collector, Fluent Bit, Vector</td><td>Агенты вендоров</td></tr>
</table></div>
<ul>
<li><b>Zabbix</b> — классический мониторинг серверов и сетевого оборудования с агентами и шаблонами; популярен в «железной» инфраструктуре.</li>
<li><b>Prometheus</b> — pull-модель, метки, PromQL; стандарт в Kubernetes (модуль 13.2).</li>
<li><b>Grafana</b> — дашборды поверх любых источников: Prometheus, Loki, Elasticsearch, SQL.</li>
<li><b>Elastic Stack</b> — полнотекстовый поиск по логам, мощный, но ресурсоёмкий. <b>Loki</b> индексирует только метки, а не текст, — дешевле хранить, проще эксплуатировать.</li>
<li><b>SaaS</b> (Datadog, New Relic, Dynatrace) — всё в одном и быстро, но стоимость растёт с объёмом данных и числом хостов.</li>
</ul>
<div class="note why"><b>Совет.</b> Инструментируйте код через <b>OpenTelemetry</b> (модуль 13.4): тогда смена бэкенда — Jaeger на Tempo или self-hosted на SaaS — меняет только настройку коллектора, а не код всех сервисов.</div>`,
 check: [
  { id:'q13-5a', type:'single', prompt:'Чем Loki отличается от Elasticsearch при хранении логов?', options:['Индексирует только метки, а не весь текст — дешевле хранение','Не умеет искать по логам вообще','Хранит только метрики','Работает только в SaaS'], answer:0, explanation:'Полнотекстовый индекс дорог.' },
  { id:'q13-5b', type:'single', prompt:'Почему стоит инструментировать код через OpenTelemetry?', options:['Можно сменить бэкенд наблюдаемости без переписывания сервисов','Это единственный способ получить метрики','OpenTelemetry — это база данных','Так требует Kubernetes'], answer:0, explanation:'Вендор-нейтральный стандарт.' }
 ]}
 ],
 test: [
  { id:'t13-1', type:'match', prompt:'Сопоставьте сигнал и вопрос, на который он отвечает лучше всего.', pairs:[['Метрики','Насколько всё плохо и с какой скоростью'],['Логи','Что именно случилось в конкретном событии'],['Трейсы','На каком сервисе теряется время']], explanation:'Три столпа наблюдаемости.', difficulty:1 },
  { id:'t13-2', type:'single', prompt:'Какой тип метрики подходит для текущей длины очереди?', options:['Gauge','Counter','Histogram','Summary только'], answer:0, explanation:'Значение может расти и уменьшаться.', difficulty:1 },
  { id:'t13-3', type:'analyze', prompt:'Что посчитает этот запрос?', code:'sum(rate(http_requests_total{status=~"5.."}[5m]))\n/\nsum(rate(http_requests_total[5m]))', options:['Долю 5xx-ответов от всех запросов за 5 минут','Число запросов за 5 минут','p95 латентности','Число ошибок с начала работы'], answer:0, explanation:'Классическая метрика error rate.', difficulty:2 },
  { id:'t13-4', type:'single', prompt:'Prometheus получает метрики по модели…', options:['pull — сам опрашивает /metrics','push — сервисы отправляют сами','через Kafka','через логи'], answer:0, explanation:'Для коротких задач есть Pushgateway, но основа — pull.', difficulty:1 },
  { id:'t13-5', type:'single', prompt:'Что значит p99 = 2 с?', options:['1% запросов длится 2 секунды и дольше','Среднее время 2 секунды','99 запросов длились 2 секунды','Максимум 2 секунды'], answer:0, explanation:'99% быстрее, 1% — медленнее или равно.', difficulty:2 },
  { id:'t13-6', type:'multiple', prompt:'Какие метки безопасны по кардинальности? (несколько ответов)', options:['HTTP-метод','Код статуса','Шаблон маршрута /api/users/:id','Полный URL с ID пользователя'], answer:[0,1,2], explanation:'Полный URL с ID — бесконечное число значений.', difficulty:2 },
  { id:'t13-7', type:'single', prompt:'Что связывает запись лога с трейсом?', options:['Поле trace_id','Уровень лога','Имя пода','Время записи'], answer:0, explanation:'Корреляция сигналов по trace_id.', difficulty:1 },
  { id:'t13-8', type:'single', prompt:'Что такое OpenTelemetry?', options:['Вендор-нейтральный стандарт и SDK для метрик, логов и трейсов','База данных для логов','Облачный сервис мониторинга','Плагин Grafana'], answer:0, explanation:'Инструментируйте один раз — отправляйте куда угодно.', difficulty:1 },
  { id:'t13-9', type:'match', prompt:'Сопоставьте методику и объект.', pairs:[['RED','Сервисы и запросы'],['USE','Ресурсы: CPU, диски, сеть']], explanation:'RED — для сервисов, USE — для ресурсов.', difficulty:2 },
  { id:'t13-10', type:'single', prompt:'Чем наблюдаемость отличается от мониторинга?', options:['Позволяет отвечать на новые, заранее не известные вопросы','Это просто новое название','Работает без метрик','Нужна только для фронтенда'], answer:0, explanation:'Мониторинг — известные вопросы, наблюдаемость — исследование.', difficulty:2 },
  { id:'t13-11', type:'match', prompt:'Сопоставьте инструмент и назначение.', pairs:[['Zabbix','Мониторинг серверов и сетевого оборудования'],['Grafana','Дашборды поверх разных источников'],['Jaeger','Распределённые трейсы'],['Graylog','Централизованные логи']], explanation:'Экосистема наблюдаемости.', difficulty:1 },
  { id:'t13-12', type:'single', prompt:'Главный риск SaaS-мониторинга вроде Datadog при росте системы?', options:['Стоимость растёт с объёмом данных и числом хостов','Не умеет метрики','Нельзя ставить в облаке','Не поддерживает Linux'], answer:0, explanation:'Контролируйте объём и кардинальность.', difficulty:2 }
 ]
},
{
 id: 14, title: 'Оркестрация контейнеров', short: 'Kubernetes, managed-кластеры, безопасность кластера',
 lessons: [
 { id:'14-1', title:'Зачем оркестратор и как устроен кластер', html:`
<p>Когда контейнеров десятки и серверов несколько, нужны ответы: на какой узел поставить контейнер? Кто перезапустит упавший? Как выкатить новую версию без простоя? Как контейнеры найдут друг друга? Это работа <b>оркестратора</b>, и стандарт де-факто — <b>Kubernetes</b>.</p>
<h3>Декларативная модель</h3>
<p>Вы не говорите «запусти 3 контейнера». Вы описываете <b>желаемое состояние</b> — «должно работать 3 реплики образа v2» — а контроллеры в бесконечном цикле приводят текущее состояние к желаемому (<b>reconciliation loop</b>). Упал узел — поды пересоздаются на других.</p>
<h3>Компоненты</h3>
<ul>
<li><b>Control plane:</b> <code>kube-apiserver</code> (единая точка входа, всё общение — через него), <code>etcd</code> (хранилище состояния), <code>scheduler</code> (выбирает узел для пода), <code>controller-manager</code> (контроллеры reconciliation).</li>
<li><b>Рабочие узлы:</b> <code>kubelet</code> (запускает поды на узле через container runtime), <code>kube-proxy</code> (сетевые правила для сервисов), container runtime (containerd).</li>
</ul>
<pre><code>kubectl ──▶ API server ──▶ etcd
                │
     scheduler ─┤ controllers
                ▼
         kubelet на узлах ──▶ containerd ──▶ контейнеры</code></pre>
<div class="note why"><b>Управляемые кластеры.</b> В облаке control plane обычно обслуживает провайдер: EKS, GKE, AKS, Yandex Managed Kubernetes. Вы управляете только рабочими узлами и своими манифестами.</div>`,
 check: [
  { id:'q14-1a', type:'single', prompt:'Где Kubernetes хранит состояние кластера?', options:['В etcd','В kubelet','В Docker Hub','В ConfigMap'], answer:0, explanation:'etcd — распределённое key-value-хранилище.' },
  { id:'q14-1b', type:'single', prompt:'Что значит декларативная модель Kubernetes?', options:['Описывается желаемое состояние, контроллеры приводят к нему кластер','Каждую команду нужно выполнить вручную по порядку','Конфигурация пишется на Python','Поды создаются только по расписанию'], answer:0, explanation:'Reconciliation loop постоянно сравнивает желаемое и текущее.' }
 ]},
 { id:'14-2', title:'Поды, ReplicaSet и Deployment', html:`
<p><b>Под (Pod)</b> — минимальная единица: один или несколько контейнеров с общей сетью (один IP) и томами. Поды смертны: их пересоздают с новыми IP, поэтому напрямую с ними не работают.</p>
<p><b>Deployment</b> управляет <b>ReplicaSet</b>, а тот поддерживает нужное число одинаковых подов. При смене образа Deployment создаёт новый ReplicaSet и плавно переносит реплики (модуль 11).</p>
<pre><code>apiVersion: apps/v1
kind: Deployment
metadata:
  name: shop
spec:
  replicas: 3
  selector:
    matchLabels: { app: shop }
  template:
    metadata:
      labels: { app: shop }
    spec:
      containers:
        - name: api
          image: registry.example.com/shop:3f9c2e1
          ports: [{ containerPort: 3000 }]</code></pre>
<pre><code>$ kubectl get pods -l app=shop
NAME                    READY   STATUS             RESTARTS   AGE
shop-7d9f8c6b5-4xkqp    1/1     Running            0          2h
shop-7d9f8c6b5-9mzrt    1/1     Running            0          2h
shop-7d9f8c6b5-tw2lc    0/1     CrashLoopBackOff   7          14m</code></pre>
<div class="tbl"><table><tr><th>Статус</th><th>Что значит</th><th>Куда смотреть</th></tr>
<tr><td>Pending</td><td>Не нашлось узла</td><td><code>describe</code>: ресурсы, taints, PVC</td></tr>
<tr><td>ImagePullBackOff</td><td>Не скачивается образ</td><td>Имя/тег, доступ к реестру</td></tr>
<tr><td>CrashLoopBackOff</td><td>Контейнер падает при старте</td><td><code>logs --previous</code></td></tr>
<tr><td>OOMKilled</td><td>Превышен лимит памяти</td><td>Лимиты, утечки</td></tr></table></div>
<p>Для приложений с состоянием (БД, очереди) есть <b>StatefulSet</b> — стабильные имена и свои тома у каждой реплики; для агента на каждом узле — <b>DaemonSet</b>; для разовых задач — <b>Job</b> и <b>CronJob</b>.</p>`,
 check: [
  { id:'q14-2a', type:'single', prompt:'Под в статусе CrashLoopBackOff. Какая команда первой покажет причину?', options:['kubectl logs <pod> --previous','kubectl get nodes','kubectl scale','kubectl delete namespace'], answer:0, explanation:'Логи предыдущего (упавшего) запуска контейнера.' },
  { id:'q14-2b', type:'match', prompt:'Сопоставьте ресурс и назначение.', pairs:[['Deployment','Stateless-приложение с выкатками'],['StatefulSet','БД со стабильными именами и томами'],['DaemonSet','Агент на каждом узле'],['CronJob','Задача по расписанию']], explanation:'Разные контроллеры под разные нагрузки.' }
 ]},
 { id:'14-3', title:'Service и Ingress', html:`
<p>У подов меняются IP. <b>Service</b> даёт стабильное имя и виртуальный IP, а трафик распределяет по подам, выбранным по <b>меткам</b> (selector).</p>
<pre><code>apiVersion: v1
kind: Service
metadata: { name: shop }
spec:
  selector: { app: shop }
  ports: [{ port: 80, targetPort: 3000 }]</code></pre>
<p>Внутри кластера сервис доступен по DNS-имени <code>shop.default.svc.cluster.local</code> или просто <code>shop</code> из того же namespace.</p>
<div class="tbl"><table><tr><th>Тип Service</th><th>Доступ</th></tr>
<tr><td>ClusterIP</td><td>Только внутри кластера (по умолчанию)</td></tr>
<tr><td>NodePort</td><td>Порт 30000–32767 на каждом узле</td></tr>
<tr><td>LoadBalancer</td><td>Облачный балансировщик с внешним IP</td></tr></table></div>
<h3>Ingress</h3>
<p>Делать по балансировщику на каждый сервис дорого. <b>Ingress</b> — правила L7-маршрутизации по хосту и пути, которые исполняет <b>ingress-контроллер</b> (nginx, Traefik, облачный). Он же терминирует TLS. Новое поколение API — <b>Gateway API</b>.</p>
<pre><code>apiVersion: networking.k8s.io/v1
kind: Ingress
metadata: { name: shop }
spec:
  tls: [{ hosts: [shop.example.com], secretName: shop-tls }]
  rules:
    - host: shop.example.com
      http:
        paths:
          - path: /api
            pathType: Prefix
            backend: { service: { name: shop, port: { number: 80 } } }</code></pre>
<div class="note"><b>Частая ошибка.</b> Метки в selector сервиса не совпадают с метками подов — у сервиса пустые endpoints и все запросы падают. Проверка: <code>kubectl get endpoints shop</code>.</div>`,
 check: [
  { id:'q14-3a', type:'single', prompt:'Как Service понимает, на какие поды слать трафик?', options:['По совпадению меток с selector','По именам подов','По IP-адресам в манифесте','По порядку создания'], answer:0, explanation:'Selector выбирает поды по labels.' },
  { id:'q14-3b', type:'single', prompt:'Какой тип Service по умолчанию доступен только внутри кластера?', options:['ClusterIP','NodePort','LoadBalancer','ExternalName'], answer:0, explanation:'ClusterIP — внутренний виртуальный IP.' }
 ]},
 { id:'14-4', title:'Конфиги, секреты, ресурсы и пробы', html:`
<h3>ConfigMap и Secret</h3>
<p>Конфигурация отделена от образа: <b>ConfigMap</b> для обычных настроек, <b>Secret</b> для чувствительных. Они передаются в контейнер переменными окружения или файлами.</p>
<div class="note"><b>Secret — не шифрование.</b> Значения в нём лишь закодированы в base64. Включите шифрование etcd, ограничьте доступ через RBAC и храните исходники секретов во внешнем хранилище (Vault, облачный Secret Manager, Sealed Secrets) — модуль 12.</div>
<h3>Ресурсы</h3>
<pre><code>resources:
  requests: { cpu: 250m, memory: 256Mi }   # гарантировано, по ним планирует scheduler
  limits:   { memory: 512Mi }              # больше — OOMKilled</code></pre>
<p><code>250m</code> — четверть ядра. Превышение лимита CPU — троттлинг (замедление), превышение лимита памяти — убийство контейнера.</p>
<h3>Пробы</h3>
<ul>
<li><b>readinessProbe</b> — готов ли под принимать трафик. Не готов — убирается из endpoints сервиса, но не перезапускается.</li>
<li><b>livenessProbe</b> — жив ли процесс. Провал — контейнер перезапускается.</li>
<li><b>startupProbe</b> — для медленного старта: пока не прошла, liveness не проверяется.</li>
</ul>
<pre><code>readinessProbe:
  httpGet: { path: /readyz, port: 3000 }
  periodSeconds: 5
livenessProbe:
  httpGet: { path: /healthz, port: 3000 }
  failureThreshold: 3</code></pre>
<div class="note why"><b>Не проверяйте зависимости в liveness.</b> Если liveness ходит в базу и база легла, Kubernetes перезапустит <i>все</i> поды — и сделает аварию хуже. Liveness проверяет только сам процесс; доступность зависимостей — дело readiness и метрик.</div>`,
 check: [
  { id:'q14-4a', type:'single', prompt:'Что произойдёт при провале readinessProbe?', options:['Под исключат из балансировки, но не перезапустят','Под перезапустят','Под удалят навсегда','Узел перезагрузится'], answer:0, explanation:'Перезапуск — реакция на провал liveness.' },
  { id:'q14-4b', type:'single', prompt:'Контейнер превысил limits.memory. Что произойдёт?', options:['Его убьют (OOMKilled)','Его замедлят','Лимит автоматически увеличится','Ничего'], answer:0, explanation:'Память нельзя «затормозить», как CPU.' }
 ]},
 { id:'14-5', title:'Управляемый Kubernetes и альтернативы', html:`
<p>Поднять и обслуживать Kubernetes самостоятельно — отдельная профессия: control plane, etcd, обновления, сертификаты. Поэтому чаще берут управляемый кластер.</p>
<div class="tbl"><table><tr><th>Вариант</th><th>Что это</th></tr>
<tr><td>EKS / GKE / AKS</td><td>Управляемый Kubernetes в AWS, Google Cloud, Azure: control plane — забота провайдера, вы управляете узлами и нагрузкой</td></tr>
<tr><td>GKE Autopilot, EKS Fargate</td><td>Даже узлами управляет провайдер, платите за поды</td></tr>
<tr><td>OpenShift</td><td>Корпоративный дистрибутив Kubernetes от Red Hat: встроенные CI, реестр, строгая безопасность</td></tr>
<tr><td>k3s, k0s, MicroK8s</td><td>Лёгкие дистрибутивы для edge, тестов, небольших кластеров</td></tr>
<tr><td>AWS ECS / Fargate</td><td>Оркестратор контейнеров AWS без Kubernetes: проще, но только AWS</td></tr>
<tr><td>Docker Swarm</td><td>Простой встроенный оркестратор Docker, ниша — небольшие установки</td></tr>
<tr><td>Nomad</td><td>Оркестратор HashiCorp: контейнеры, бинарники, VM</td></tr>
</table></div>
<pre><code>$ eksctl create cluster --name shop --region eu-central-1 --nodes 3
$ gcloud container clusters create-auto shop --region europe-west1
$ aws eks update-kubeconfig --name shop     # kubectl теперь смотрит в новый кластер</code></pre>
<div class="note why"><b>Нужен ли Kubernetes вообще?</b> Для одного-двух сервисов часто достаточно Cloud Run, ECS, App Service или PaaS (модуль 8). Kubernetes окупается, когда сервисов много, нужны единые практики развёртывания и переносимость между облаками.</div>`,
 check: [
  { id:'q14-5a', type:'single', prompt:'За что отвечает провайдер в управляемом Kubernetes (EKS, GKE, AKS)?', options:['За control plane: API-сервер, etcd, обновления мастеров','За код вашего приложения','За ваши Helm-чарты','Ни за что'], answer:0, explanation:'Узлы и нагрузка — обычно ваши.' },
  { id:'q14-5b', type:'single', prompt:'Когда Kubernetes может быть избыточен?', options:['Один-два простых сервиса, которые проще запустить на Cloud Run, ECS или PaaS','Сотня микросервисов','Нужна переносимость между облаками','Много команд с общими практиками'], answer:0, explanation:'Сложность должна окупаться.' }
 ]},
 { id:'14-6', title:'Безопасность контейнеров и кластера', html:`
<h3>Контейнер</h3>
<pre><code>securityContext:
  runAsNonRoot: true
  runAsUser: 10001
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  capabilities: { drop: ["ALL"] }</code></pre>
<ul>
<li>не root, файловая система только для чтения, сброшенные capabilities;</li>
<li>никаких <code>privileged: true</code> и монтирования <code>/var/run/docker.sock</code> — это фактически root на узле;</li>
<li>минимальный базовый образ (distroless): нет shell — нечем воспользоваться атакующему.</li>
</ul>
<h3>Кластер</h3>
<ul>
<li><b>RBAC</b> — роли с минимальными правами; у сервис-аккаунтов приложений обычно нет прав на API вовсе.</li>
<li><b>NetworkPolicy</b> — по умолчанию в Kubernetes любой под может обратиться к любому. Политика default-deny и явные разрешения ограничивают распространение атаки.</li>
<li><b>Pod Security Admission</b> (уровень restricted) и политики (Kyverno, OPA Gatekeeper): запрет root, обязательные лимиты, только подписанные образы из своего реестра.</li>
<li>Обновления узлов и версии Kubernetes; рантайм-детектирование аномалий (Falco).</li>
</ul>
<div class="note why"><b>Защита в глубину.</b> Ни одна мера не идеальна. Уязвимость в приложении не должна давать root в контейнере; root в контейнере не должен давать узел; узел — весь кластер; кластер — облачный аккаунт. Каждый слой ограничивает ущерб от прорыва предыдущего.</div>`,
 check: [
  { id:'q14-6a', type:'single', prompt:'Почему опасно монтировать /var/run/docker.sock в контейнер?', options:['Через него можно управлять Docker и получить root на узле','Он замедляет контейнер','Он занимает много места','Docker перестанет логировать'], answer:0, explanation:'Доступ к сокету = контроль над хостом.' },
  { id:'q14-6b', type:'single', prompt:'Как по умолчанию ведут себя сетевые соединения между подами без NetworkPolicy?', options:['Любой под может обратиться к любому','Всё запрещено','Разрешено только внутри namespace','Только через Ingress'], answer:0, explanation:'Поэтому нужна политика default-deny.' }
 ]}
 ],
 test: [
  { id:'t14-1', type:'single', prompt:'Какой компонент выбирает узел для нового пода?', options:['scheduler','kubelet','etcd','kube-proxy'], answer:0, explanation:'kube-scheduler.', difficulty:1 },
  { id:'t14-2', type:'match', prompt:'Сопоставьте статус пода и вероятную причину.', pairs:[['Pending','Нет узла с достаточными ресурсами'],['ImagePullBackOff','Неверный тег или нет доступа к реестру'],['CrashLoopBackOff','Приложение падает при старте'],['OOMKilled','Превышен лимит памяти']], explanation:'Базовая диагностика подов.', difficulty:2 },
  { id:'t14-3', type:'analyze', prompt:'Почему запросы к сервису не доходят до подов?', code:'$ kubectl get endpoints shop\nNAME   ENDPOINTS   AGE\nshop   <none>      3m\n\n# service selector: app=shop-api\n# pod labels:       app=shop', options:['Selector сервиса не совпадает с метками подов','Неверный порт Ingress','Поды не запущены','Нет DNS в кластере'], answer:0, explanation:'Endpoints пусты, потому что selector никого не выбрал.', difficulty:2 },
  { id:'t14-4', type:'single', prompt:'Как хранятся значения в Kubernetes Secret по умолчанию?', options:['В base64, это не шифрование','Зашифрованы AES-256','Хешированы bcrypt','Вообще не хранятся'], answer:0, explanation:'Нужно отдельно включать шифрование etcd и ограничивать доступ.', difficulty:2 },
  { id:'t14-5', type:'input', prompt:'Сколько миллиядер (m) соответствует половине ядра CPU? Введите число.', answer:['500'], explanation:'1 ядро = 1000m.', difficulty:1 },
  { id:'t14-6', type:'single', prompt:'Почему liveness-проба не должна проверять базу данных?', options:['При падении БД перезапустятся все поды и авария усилится','БД не отвечает на HTTP','Так медленнее','Liveness не поддерживает TCP'], answer:0, explanation:'Liveness — только про сам процесс.', difficulty:3 },
  { id:'t14-7', type:'single', prompt:'Что нужно, чтобы маршрутизировать shop.example.com/api и /admin в разные сервисы через один внешний IP?', options:['Ingress с ingress-контроллером','Два NodePort','Service типа ClusterIP','DaemonSet'], answer:0, explanation:'Ingress — L7-маршрутизация по хостам и путям.', difficulty:1 },
  { id:'t14-8', type:'single', prompt:'Какой ресурс выбрать для PostgreSQL в кластере?', options:['StatefulSet','Deployment','DaemonSet','Job'], answer:0, explanation:'Стабильные имена и собственный том у каждой реплики.', difficulty:1 },
  { id:'t14-9', type:'multiple', prompt:'Что входит в control plane Kubernetes? (несколько ответов)', options:['kube-apiserver','etcd','scheduler','kubelet'], answer:[0,1,2], explanation:'kubelet работает на рабочих узлах.', difficulty:2 },
  { id:'t14-10', type:'single', prompt:'По каким значениям scheduler планирует поды на узлы?', options:['По requests','По limits','По фактическому потреблению','По числу контейнеров'], answer:0, explanation:'requests — гарантированный объём, по нему считается свободное место.', difficulty:2 },
  { id:'t14-11', type:'analyze', prompt:'Что опасного в этом манифесте?', code:'containers:\n  - name: tools\n    image: acme/tools:latest\n    securityContext:\n      privileged: true\n    volumeMounts:\n      - name: dock\n        mountPath: /var/run/docker.sock', options:['Привилегированный контейнер с docker.sock и плавающим тегом — путь к root на узле','Только тег latest','Ничего','Нужен readinessProbe'], answer:0, explanation:'Три проблемы, две из них критичны.', difficulty:2 },
  { id:'t14-12', type:'single', prompt:'Что даёт readOnlyRootFilesystem: true?', options:['Атакующий не может записать файлы в файловую систему контейнера','Ускоряет чтение','Запрещает логи','Шифрует диск'], answer:0, explanation:'Сложнее закрепиться и скачать инструменты.', difficulty:2 },
  { id:'t14-13', type:'single', prompt:'Что выбрать для одного сервиса в AWS, если Kubernetes не нужен?', options:['ECS на Fargate','Собственный кластер kubeadm','OpenShift','Docker Swarm на ноутбуке'], answer:0, explanation:'Проще в эксплуатации.', difficulty:2 },
  { id:'t14-14', type:'single', prompt:'Что такое OpenShift?', options:['Корпоративный дистрибутив Kubernetes от Red Hat','Облачный провайдер','Формат контейнера','CI-система'], answer:0, explanation:'Kubernetes + CI, реестр, политики безопасности.', difficulty:1 }
 ]
},
{
 id: 15, title: 'Сборка и управление артефактами', short: 'Зависимости, воспроизводимость, реестры, 12-factor',
 lessons: [
 { id:'15-1', title:'Зависимости и lock-файлы', html:`
<p>Современное приложение — это 5% вашего кода и 95% чужого. В <code>package.json</code> указаны <b>диапазоны</b> версий, а реально установленное дерево фиксирует <b>lock-файл</b>.</p>
<pre><code>"express": "^4.18.0"   # любая 4.x.x не ниже 4.18.0
"lodash":  "~4.17.20"  # любая 4.17.x не ниже 4.17.20
"left-pad": "1.3.0"    # ровно эта версия</code></pre>
<div class="tbl"><table><tr><th>Экосистема</th><th>Манифест</th><th>Lock-файл</th><th>Установка строго по lock</th></tr>
<tr><td>Node.js</td><td>package.json</td><td>package-lock.json</td><td><code>npm ci</code></td></tr>
<tr><td>Python</td><td>pyproject.toml</td><td>poetry.lock / uv.lock</td><td><code>uv sync --frozen</code></td></tr>
<tr><td>Go</td><td>go.mod</td><td>go.sum</td><td><code>go mod download</code></td></tr>
<tr><td>Rust</td><td>Cargo.toml</td><td>Cargo.lock</td><td><code>cargo build --locked</code></td></tr></table></div>
<div class="note why"><b>Lock-файл коммитят.</b> Без него сборка во вторник и в среду может дать разные деревья зависимостей: вышла новая минорная версия транзитивной зависимости — и в проде другой код, чем на тестах.</div>
<p>В CI используйте команду, которая <b>падает</b>, если lock-файл не соответствует манифесту (<code>npm ci</code>, а не <code>npm install</code>). Обновления зависимостей автоматизируют боты (Dependabot, Renovate): они открывают маленькие PR, CI их проверяет.</p>`,
 check: [
  { id:'q15-1a', type:'single', prompt:'Какую команду использовать в CI для Node.js-проекта?', options:['npm ci','npm install','npm update','npm audit fix --force'], answer:0, explanation:'npm ci ставит строго по lock-файлу и падает при рассинхронизации.' },
  { id:'q15-1b', type:'single', prompt:'Что разрешает диапазон ^4.18.0?', options:['Любую 4.x.x не ниже 4.18.0','Только 4.18.x','Только 4.18.0','Любую версию не ниже 4.18.0, включая 5.0.0'], answer:0, explanation:'Каретка фиксирует major-версию.' }
 ]},
 { id:'15-2', title:'Воспроизводимая сборка', html:`
<p><b>Воспроизводимая сборка</b> — из одного и того же коммита всегда получается один и тот же артефакт, где бы её ни запустили.</p>
<p>Что ломает воспроизводимость:</p>
<ul>
<li>незафиксированные версии зависимостей и базовых образов;</li>
<li>инструменты, установленные «на машине сборщика» руками;</li>
<li>скачивание чего-то из интернета без проверки хеша;</li>
<li>время сборки и случайные данные внутри артефакта.</li>
</ul>
<h3>Собери один раз — разверни везде</h3>
<p>Главный принцип: артефакт собирается <b>один раз</b>, а затем один и тот же бинарник или образ <b>продвигается</b> по окружениям: dev → staging → prod. Различия окружений — только в конфигурации.</p>
<pre><code>build  ──▶  app:3f9c2e1  ──▶ staging (config: staging)
                         └──▶ prod    (config: prod)</code></pre>
<div class="note"><b>Антипаттерн.</b> Отдельная сборка «для прода» из ветки release. Протестирован один артефакт, а выкатывается другой — тесты на staging ничего не гарантируют.</div>
<p>Для инструментов сборки фиксируйте версии рантайма (<code>.nvmrc</code>, <code>.tool-versions</code>, <code>go.mod</code>) и собирайте в контейнере с закреплённым образом. Тогда «у меня работает» превращается в «у всех работает одинаково».</p>`,
 check: [
  { id:'q15-2a', type:'single', prompt:'Что означает принцип «build once, deploy many»?', options:['Один артефакт продвигается по всем окружениям, меняется только конфиг','Для каждого окружения своя сборка','Сборка выполняется один раз в месяц','Деплой выполняется на много серверов вручную'], answer:0, explanation:'Тестируется и выкатывается один и тот же артефакт.' },
  { id:'q15-2b', type:'multiple', prompt:'Что нарушает воспроизводимость сборки? (несколько ответов)', options:['Базовый образ node:latest','Инструменты, установленные на сборщике вручную','Скачивание скрипта curl | bash без проверки хеша','Закоммиченный lock-файл'], answer:[0,1,2], explanation:'Lock-файл, наоборот, помогает.' }
 ]},
 { id:'15-3', title:'Реестры артефактов', html:`
<p>Артефакт — результат сборки: Docker-образ, JAR, npm-пакет, бинарник, Helm-чарт. Хранят их в <b>реестрах</b> (registry), а не в Git.</p>
<ul>
<li><b>Контейнерные реестры:</b> Docker Hub, GitHub Container Registry, Amazon ECR, Google Artifact Registry, Harbor.</li>
<li><b>Универсальные:</b> JFrog Artifactory, Sonatype Nexus, GitLab Package Registry.</li>
</ul>
<h3>Свойства хорошего реестра</h3>
<ul>
<li><b>Неизменяемые теги</b> — однажды опубликованный <code>app:3f9c2e1</code> нельзя перезаписать.</li>
<li><b>Политики хранения</b> — удаление старых сборок, иначе хранилище растёт бесконечно. Но релизные версии хранятся долго, чтобы можно было откатиться.</li>
<li><b>Прокси-кэш</b> публичных реестров — сборки не зависят от доступности npmjs.org или Docker Hub и не упираются в их лимиты.</li>
<li><b>Сканирование</b> уязвимостей и подписи (модуль 12).</li>
</ul>
<div class="note why"><b>Тег и дайджест.</b> Тег — человекочитаемое имя, которое теоретически можно передвинуть. Дайджест <code>sha256:…</code> — хеш содержимого, он неизменен по определению. Самый строгий способ закрепить образ: <code>app@sha256:9b1c…</code>.</div>`,
 check: [
  { id:'q15-3a', type:'single', prompt:'Чем дайджест образа отличается от тега?', options:['Дайджест — хеш содержимого и не может указывать на другой образ','Дайджест короче','Тег нельзя изменить, а дайджест можно','Ничем'], answer:0, explanation:'sha256 вычисляется из содержимого.' },
  { id:'q15-3b', type:'single', prompt:'Зачем нужен прокси-кэш публичного реестра?', options:['Сборки не зависят от доступности и лимитов внешнего реестра','Чтобы ускорить git push','Для шифрования образов','Чтобы обойти лицензии'], answer:0, explanation:'Кэш внутри компании отдаёт уже скачанные пакеты.' }
 ]},
 { id:'15-4', title:'Конфигурация: The Twelve-Factor App', html:`
<p><b>12-factor</b> — набор принципов для сервисов, которые легко разворачивать и масштабировать. Самые важные для DevOps:</p>
<div class="tbl"><table><tr><th>Фактор</th><th>Суть</th></tr>
<tr><td>I. Codebase</td><td>Один репозиторий — много деплоев</td></tr>
<tr><td>II. Dependencies</td><td>Зависимости объявлены явно и изолированы</td></tr>
<tr><td>III. Config</td><td>Конфигурация — в переменных окружения, не в коде</td></tr>
<tr><td>IV. Backing services</td><td>БД, очередь, кэш — подключаемые ресурсы по URL</td></tr>
<tr><td>V. Build, release, run</td><td>Сборка, релиз (сборка + конфиг) и запуск строго разделены</td></tr>
<tr><td>VI. Processes</td><td>Процессы без состояния; состояние — во внешних сервисах</td></tr>
<tr><td>IX. Disposability</td><td>Быстрый старт и graceful shutdown</td></tr>
<tr><td>X. Dev/prod parity</td><td>Окружения максимально похожи</td></tr>
<tr><td>XI. Logs</td><td>Логи — поток событий в stdout</td></tr></table></div>
<pre><code>// плохо
const db = connect('postgres://admin:hunter2@10.0.0.5/shop');
// хорошо
const db = connect(process.env.DATABASE_URL);</code></pre>
<div class="note"><b>Проверка.</b> Можно ли прямо сейчас выложить репозиторий в open source, не раскрыв ни одного секрета? Если нет — конфигурация смешана с кодом.</div>
<p><b>Stateless</b> — ключ к масштабированию: если сессии лежат в памяти процесса, второй экземпляр не узнает пользователя. Храните их в Redis или в подписанной cookie, файлы — в объектном хранилище.</p>`,
 check: [
  { id:'q15-4a', type:'single', prompt:'Где по 12-factor хранится адрес базы данных?', options:['В переменной окружения','В коде приложения','В имени ветки Git','В Dockerfile'], answer:0, explanation:'Фактор III: Config.' },
  { id:'q15-4b', type:'single', prompt:'Почему сессии в памяти процесса мешают горизонтальному масштабированию?', options:['Другой экземпляр не видит эти данные','Память медленная','Сессии нельзя шифровать','Процесс не может хранить больше 1 МБ'], answer:0, explanation:'Процессы должны быть stateless, состояние — во внешнем хранилище.' }
 ]}
 ],
 test: [
  { id:'t15-1', type:'single', prompt:'Зачем коммитить lock-файл?', options:['Чтобы все сборки ставили одинаковое дерево зависимостей','Чтобы ускорить git clone','Чтобы скрыть зависимости','Его коммитить не нужно'], answer:0, explanation:'Lock фиксирует точные версии, включая транзитивные.', difficulty:1 },
  { id:'t15-2', type:'single', prompt:'Команда собирает отдельный образ для прода из ветки release после тестов на staging. В чём проблема?', options:['Выкатывается не тот артефакт, что тестировался','Нет проблемы','Образ будет больше','Нарушается SemVer'], answer:0, explanation:'Build once, deploy many.', difficulty:2 },
  { id:'t15-3', type:'match', prompt:'Сопоставьте экосистему и lock-файл.', pairs:[['Node.js','package-lock.json'],['Go','go.sum'],['Rust','Cargo.lock']], explanation:'У каждой экосистемы свой формат.', difficulty:1 },
  { id:'t15-4', type:'analyze', prompt:'Какой принцип 12-factor нарушен?', code:'if (process.env.NODE_ENV === \'production\') {\n  apiUrl = \'https://api.shop.com\';\n  dbPass = \'Pr0d-p4ss!\';\n}', options:['III. Config: конфиг и секреты зашиты в код','XI. Logs','VI. Processes','I. Codebase'], answer:0, explanation:'Значения должны приходить из окружения.', difficulty:1 },
  { id:'t15-5', type:'single', prompt:'Как жёстче всего закрепить конкретный образ в манифесте?', options:['По дайджесту sha256','По тегу latest','По тегу stable','По имени репозитория'], answer:0, explanation:'Дайджест неизменен.', difficulty:2 },
  { id:'t15-6', type:'multiple', prompt:'Что хранят в реестре артефактов, а не в Git? (несколько ответов)', options:['Docker-образы','Собранные JAR-файлы','Helm-чарты в упакованном виде','Исходный код сервиса'], answer:[0,1,2], explanation:'Исходники — в Git, результаты сборки — в реестре.', difficulty:1 },
  { id:'t15-7', type:'single', prompt:'Что означает фактор Disposability?', options:['Быстрый старт и корректное завершение процессов','Одноразовые пароли','Удаление старых образов','Отказ от тестов'], answer:0, explanation:'Процесс можно в любой момент остановить и запустить новый.', difficulty:2 },
  { id:'t15-8', type:'single', prompt:'Кто обычно открывает PR с обновлением зависимостей?', options:['Боты вроде Dependabot или Renovate','CI-раннер','Реестр артефактов','Kubernetes'], answer:0, explanation:'Маленькие регулярные обновления проще, чем одно огромное раз в год.', difficulty:1 },
  { id:'t15-9', type:'single', prompt:'Что в 12-factor называется «релизом»?', options:['Сборка, объединённая с конфигурацией конкретного окружения','Git-тег','Запись в changelog','Публикация в app store'], answer:0, explanation:'Build → release (build + config) → run.', difficulty:3 },
  { id:'t15-10', type:'single', prompt:'Почему в CI предпочтительнее npm ci, а не npm install?', options:['npm ci падает при расхождении с lock-файлом и не меняет его','npm ci устанавливает последние версии','npm install не работает в CI','npm ci не требует сети'], answer:0, explanation:'Сборка должна быть строгой и воспроизводимой.', difficulty:1 }
 ]
},
{
 id: 16, title: 'GitOps', short: 'Helm, Kustomize, Argo CD, Flux',
 lessons: [
 { id:'16-1', title:'GitOps, Helm и Kustomize', html:`
<h3>Шаблонизация манифестов</h3>
<p>Окружения различаются числом реплик, доменами, ресурсами. Копировать YAML — плохо. Два популярных подхода:</p>
<ul>
<li><b>Helm</b> — пакетный менеджер: <b>чарт</b> — шаблоны с параметрами из <code>values.yaml</code>. <code>helm upgrade --install shop ./chart -f values-prod.yaml</code>.</li>
<li><b>Kustomize</b> — без шаблонов: базовые манифесты + патчи (overlays) для каждого окружения. Встроен в <code>kubectl apply -k</code>.</li>
</ul>
<h3>GitOps</h3>
<p>Принципы GitOps:</p>
<ol class="steps">
<li>Желаемое состояние системы описано <b>декларативно</b>.</li>
<li>Оно хранится в <b>Git</b> — версионируется и проходит ревью.</li>
<li>Изменения применяются <b>автоматически</b>.</li>
<li>Агент <b>постоянно сверяет</b> кластер с Git и исправляет расхождения.</li>
</ol>
<pre><code>app-repo ──CI──▶ образ shop:a81d0e4 ──▶ PR в deploy-repo: image.tag=a81d0e4
                                               │ merge
                     Argo CD / Flux ◀── следит ┘
                          │ pull
                          ▼
                       кластер</code></pre>
<p>Ключевое отличие от классического CD — модель <b>pull</b>: не CI лезет в кластер с админскими правами, а агент внутри кластера тянет изменения. Откат — <code>git revert</code>. Ручные правки <code>kubectl edit</code> агент обнаружит как дрейф и вернёт к состоянию из Git.</p>`,
 check: [
  { id:'q16-1a', type:'single', prompt:'Как выполняется откат в GitOps?', options:['git revert коммита в репозитории конфигурации','kubectl delete deployment','Ручным редактированием кластера','Перезапуском Argo CD'], answer:0, explanation:'Git — источник правды, агент применит предыдущее состояние.' },
  { id:'q16-1b', type:'single', prompt:'Почему pull-модель GitOps безопаснее, чем push из CI?', options:['CI не нужны административные креды кластера','Она быстрее','Она не требует Git','Она шифрует трафик'], answer:0, explanation:'Агент внутри кластера сам тянет изменения.' }
 ]},
 { id:'16-2', title:'Argo CD и Flux', html:`
<p>GitOps-оператор живёт в кластере, следит за Git-репозиторием манифестов и приводит кластер к описанному в нём состоянию (модуль 16.1).</p>
<pre><code># Argo CD: Application — «что развернуть, откуда и куда»
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata: { name: shop-prod, namespace: argocd }
spec:
  project: default
  source:
    repoURL: https://github.com/acme/shop-deploy
    path: envs/prod
    targetRevision: main
  destination: { server: https://kubernetes.default.svc, namespace: shop }
  syncPolicy:
    automated: { prune: true, selfHeal: true }   # удалять лишнее и возвращать ручные правки</code></pre>
<div class="tbl"><table><tr><th></th><th>Argo CD</th><th>Flux</th></tr>
<tr><td>Интерфейс</td><td>Веб-UI: дерево ресурсов, diff, кнопка синхронизации</td><td>CLI и CRD, UI — отдельными проектами</td></tr>
<tr><td>Модель</td><td>Application / ApplicationSet</td><td>Набор контроллеров: GitRepository, Kustomization, HelmRelease</td></tr>
<tr><td>Сильные стороны</td><td>Наглядность, много кластеров из одного места</td><td>Модульность, автоматическое обновление образов</td></tr>
<tr><td>Статус</td><td colspan="2">Оба — выпускники CNCF, широко используются</td></tr>
</table></div>
<h3>Типичный поток</h3>
<ol class="steps">
<li>CI собирает образ <code>shop:3f9c2e1</code> и пушит в реестр.</li>
<li>CI (или Image Updater/Flux image automation) делает коммит в репозиторий манифестов: новый тег образа.</li>
<li>Argo CD/Flux замечает коммит и синхронизирует кластер.</li>
<li>Откат — <code>git revert</code> коммита с тегом.</li>
</ol>
<div class="note warn">Секреты в GitOps-репозитории — только зашифрованные (SOPS, Sealed Secrets) или ссылками на внешнее хранилище через ESO (модуль 12.3).</div>`,
 check: [
  { id:'q16-2a', type:'single', prompt:'Что делает selfHeal в Argo CD?', options:['Возвращает ручные изменения в кластере к состоянию из Git','Перезапускает упавшие поды','Чинит баги в коде','Обновляет Kubernetes'], answer:0, explanation:'Источник истины — Git.' },
  { id:'q16-2b', type:'single', prompt:'Как откатить выкатку в GitOps-подходе?', options:['git revert коммита с новым тегом образа','kubectl edit в проде','Удалить кластер','Перезапустить CI'], answer:0, explanation:'Оператор синхронизирует кластер с Git.' }
 ]}
 ],
 test: [
  { id:'t16-1', type:'single', prompt:'Кто-то поправил реплики через kubectl edit в кластере под управлением Argo CD с self-heal. Что произойдёт?', options:['Argo CD вернёт значение из Git','Изменение сохранится навсегда','Argo CD удалит приложение','Git обновится автоматически'], answer:0, explanation:'Дрейф устраняется в пользу Git.', difficulty:2 },
  { id:'t16-2', type:'single', prompt:'Чем Kustomize отличается от Helm?', options:['Не использует шаблоны: база + патчи для окружений','Работает только в облаке','Не поддерживает YAML','Это то же самое'], answer:0, explanation:'Helm — шаблоны и values, Kustomize — overlays.', difficulty:2 },
  { id:'t16-3', type:'single', prompt:'Что является источником истины в GitOps?', options:['Git-репозиторий с описанием желаемого состояния','Состояние кластера','Ноутбук администратора','Логи CI'], answer:0, explanation:'Кластер приводится к Git.', difficulty:1 },
  { id:'t16-4', type:'single', prompt:'Чем pull-модель GitOps безопаснее push из CI?', options:['CI не нужны права на кластер — оператор внутри кластера сам забирает изменения','Она быстрее','Не нужен Git','Не нужны образы'], answer:0, explanation:'Меньше сильных учётных данных снаружи.', difficulty:2 },
  { id:'t16-5', type:'match', prompt:'Сопоставьте ресурс и инструмент.', pairs:[['Application','Argo CD'],['HelmRelease','Flux'],['Kustomization','Flux'],['ApplicationSet','Argo CD']], explanation:'CRD двух операторов.', difficulty:3 },
  { id:'t16-6', type:'single', prompt:'Как хранить секреты в GitOps-репозитории?', options:['Зашифрованными (SOPS, Sealed Secrets) или ссылками через ESO','В base64 в обычном Secret','Открытым текстом в приватном репо','Нельзя никак'], answer:0, explanation:'base64 — не шифрование.', difficulty:1 },
  { id:'t16-7', type:'single', prompt:'Что делает prune в автоматической синхронизации Argo CD?', options:['Удаляет из кластера ресурсы, которых больше нет в Git','Сжимает образы','Удаляет старые коммиты','Чистит логи'], answer:0, explanation:'Иначе удалённые манифесты оставят «сирот».', difficulty:2 },
  { id:'t16-8', type:'order', prompt:'Расставьте шаги GitOps-выкатки.', options:['CI собирает и пушит образ','Коммит с новым тегом в репозиторий манифестов','Оператор замечает изменение','Кластер синхронизируется'], answer:[0,1,2,3], explanation:'Код → образ → Git → кластер.', difficulty:1 }
 ]
},
{
 id: 17, title: 'Service mesh', short: 'Sidecar, mTLS, Istio, Linkerd, Envoy',
 lessons: [
 { id:'17-1', title:'Что такое service mesh', html:`
<p>В системе из десятков микросервисов каждому нужны одни и те же сетевые возможности: шифрование между сервисами, повторы и таймауты, балансировка, метрики и трейсы, контроль, кто кого может вызывать. Встраивать это в каждый сервис на каждом языке — дорого.</p>
<p><b>Service mesh</b> выносит эти функции в инфраструктуру: рядом с каждым экземпляром сервиса работает прокси (<b>sidecar</b>), и весь трафик идёт через него.</p>
<pre><code>[Сервис A] → [прокси A] ══ mTLS ══ [прокси B] → [Сервис B]
                  ↑                     ↑
             ───── control plane: правила, сертификаты, конфигурация ─────</code></pre>
<div class="tbl"><table><tr><th>Возможность</th><th>Пример</th></tr>
<tr><td>mTLS между сервисами</td><td>Шифрование и взаимная аутентификация без изменения кода</td></tr>
<tr><td>Управление трафиком</td><td>Канарейка 5%, зеркалирование трафика, маршрут по заголовку</td></tr>
<tr><td>Надёжность</td><td>Повторы, таймауты, circuit breaker</td></tr>
<tr><td>Наблюдаемость</td><td>Метрики RED и трейсы для каждого вызова автоматически</td></tr>
<tr><td>Авторизация</td><td>«orders может вызывать payments, а catalog — нет»</td></tr>
</table></div>
<div class="note warn"><b>Цена.</b> Дополнительный прокси на каждом поде — память, задержка и ещё одна сложная система, которую нужно обновлять и отлаживать. Mesh оправдан при большом числе сервисов и требованиях к zero-trust; для пяти сервисов обычно хватает библиотек и ingress. Есть и режимы без sidecar (Istio ambient, Cilium) — меньше накладных расходов.</div>`,
 check: [
  { id:'q17-1a', type:'single', prompt:'Что такое sidecar-прокси в service mesh?', options:['Прокси рядом с каждым экземпляром сервиса, через который идёт весь его трафик','Резервный сервер','Отдельный кластер','Боковая панель дашборда'], answer:0, explanation:'Control plane его настраивает.' },
  { id:'q17-1b', type:'single', prompt:'Какую возможность mesh даёт без изменения кода сервисов?', options:['mTLS между сервисами','Новые функции бизнес-логики','Схему базы данных','Дизайн интерфейса'], answer:0, explanation:'Шифрование и аутентификация на уровне прокси.' }
 ]},
 { id:'17-2', title:'Istio, Linkerd, Consul и Envoy', html:`
<div class="tbl"><table><tr><th>Проект</th><th>Особенности</th></tr>
<tr><td>Envoy</td><td>Высокопроизводительный L7-прокси от Lyft; основа Istio и многих API-шлюзов. Сам по себе не mesh, а «кирпич» для него</td></tr>
<tr><td>Istio</td><td>Самый функциональный mesh: богатые правила трафика, безопасность, режимы sidecar и ambient; сложнее в эксплуатации</td></tr>
<tr><td>Linkerd</td><td>Акцент на простоте и лёгкости: свой прокси на Rust, mTLS «из коробки», меньше настроек</td></tr>
<tr><td>Consul</td><td>От HashiCorp: service discovery и mesh, работает и вне Kubernetes — с VM и Nomad</td></tr>
<tr><td>Cilium</td><td>Сеть Kubernetes на eBPF с возможностями mesh без sidecar</td></tr>
</table></div>
<pre><code># Istio: канарейка — 90% трафика на v1, 10% на v2
apiVersion: networking.istio.io/v1
kind: VirtualService
metadata: { name: reviews }
spec:
  hosts: [reviews]
  http:
    - route:
        - destination: { host: reviews, subset: v1 }
          weight: 90
        - destination: { host: reviews, subset: v2 }
          weight: 10
      retries: { attempts: 3, perTryTimeout: 2s }</code></pre>
<pre><code>$ linkerd install | kubectl apply -f -
$ kubectl get deploy -n shop -o yaml | linkerd inject - | kubectl apply -f -   # добавить прокси
$ linkerd viz stat deploy -n shop      # успешность, RPS, задержки по каждому сервису</code></pre>
<div class="note why"><b>Как выбирать.</b> Нужен минимум (mTLS + метрики) и простота — Linkerd. Нужны сложные правила трафика и мульти-кластер — Istio. Смешанная среда VM и Kubernetes — Consul. Сначала убедитесь, что mesh действительно нужен (урок 17.1).</div>`,
 check: [
  { id:'q17-2a', type:'single', prompt:'Что такое Envoy?', options:['L7-прокси, на котором построены Istio и многие шлюзы','Полноценный оркестратор','База данных','Система CI'], answer:0, explanation:'Кирпич для mesh.' },
  { id:'q17-2b', type:'single', prompt:'Какой mesh известен акцентом на простоте и лёгкости?', options:['Linkerd','Istio','Envoy','Jenkins'], answer:0, explanation:'Меньше настроек, mTLS из коробки.' }
 ]}
 ],
 test: [
  { id:'t17-1', type:'single', prompt:'Какие функции service mesh выносит из кода сервисов? (лучший ответ)', options:['mTLS, повторы, таймауты, балансировку, метрики и трейсы','Бизнес-логику','Схемы БД','Сборку образов'], answer:0, explanation:'Сетевые сквозные задачи.', difficulty:1 },
  { id:'t17-2', type:'single', prompt:'Главный недостаток sidecar-модели?', options:['Дополнительные ресурсы и задержка на каждый под, сложность эксплуатации','Нет шифрования','Не работает в Kubernetes','Требует переписать сервисы'], answer:0, explanation:'Поэтому появились режимы без sidecar.', difficulty:2 },
  { id:'t17-3', type:'match', prompt:'Сопоставьте проект и особенность.', pairs:[['Istio','Самый функциональный, сложнее'],['Linkerd','Простота, прокси на Rust'],['Consul','Работает и с VM, service discovery'],['Envoy','L7-прокси, основа mesh']], explanation:'Экосистема mesh.', difficulty:2 },
  { id:'t17-4', type:'single', prompt:'Как в Istio направить 10% трафика на новую версию?', options:['Весами маршрутов в VirtualService','Изменив DNS','Удалив старую версию','Через cron'], answer:0, explanation:'weight: 90 / 10.', difficulty:2 },
  { id:'t17-5', type:'single', prompt:'Что такое mTLS?', options:['Взаимная аутентификация: обе стороны предъявляют сертификаты','TLS только для мобильных','Модуль Terraform','Метрика задержки'], answer:0, explanation:'Основа zero-trust между сервисами.', difficulty:1 },
  { id:'t17-6', type:'single', prompt:'Нужен ли service mesh для трёх сервисов небольшой команды?', options:['Обычно нет: сложность не окупится, хватит библиотек и ingress','Обязательно','Только в облаке','Только для Java'], answer:0, explanation:'Mesh — для большого числа сервисов.', difficulty:1 },
  { id:'t17-7', type:'single', prompt:'Что делает control plane mesh?', options:['Раздаёт прокси правила, сертификаты и конфигурацию','Обрабатывает пользовательские запросы','Хранит данные приложения','Собирает образы'], answer:0, explanation:'Data plane — прокси.', difficulty:2 },
  { id:'t17-8', type:'multiple', prompt:'Какие возможности даёт mesh для управления трафиком? (несколько ответов)', options:['Канареечное распределение по весам','Зеркалирование трафика','Маршрут по заголовку','Автоматическое написание тестов'], answer:[0,1,2], explanation:'Тесты mesh не пишет.', difficulty:1 }
 ]
},
{
 id: 18, title: 'Облачные паттерны проектирования', short: 'Доступность, данные, проектирование, управление',
 lessons: [
 { id:'18-1', title:'Паттерны доступности', html:`
<p>Облачные паттерны проектирования (по каталогу Azure Architecture Center и AWS Well-Architected) — проверенные решения типовых задач распределённых систем. Первая группа — <b>доступность</b>: система продолжает работать, когда что-то ломается.</p>
<div class="tbl"><table><tr><th>Паттерн</th><th>Идея</th></tr>
<tr><td>Health Endpoint Monitoring</td><td>Эндпойнт <code>/health</code>, который проверяют балансировщик и оркестратор</td></tr>
<tr><td>Retry</td><td>Повтор временных сбоев с экспоненциальной задержкой и jitter</td></tr>
<tr><td>Circuit Breaker</td><td>После серии ошибок перестать вызывать зависимость на время — не добивать её и быстро отвечать</td></tr>
<tr><td>Bulkhead</td><td>Изоляция ресурсов (пулы, очереди) — сбой одной части не топит всю систему, как отсеки корабля</td></tr>
<tr><td>Throttling / Rate limiting</td><td>Ограничить потребление, чтобы один клиент не съел всё</td></tr>
<tr><td>Queue-Based Load Leveling</td><td>Очередь сглаживает пики: сервис обрабатывает с постоянной скоростью</td></tr>
<tr><td>Deployment Stamps / Geodes</td><td>Независимые копии системы в разных регионах</td></tr>
</table></div>
<pre><code>попытка 1 — ошибка → ждём 0.2 с ± jitter
попытка 2 — ошибка → ждём 0.4 с ± jitter
попытка 3 — ошибка → ждём 0.8 с ± jitter → сдаёмся, открываем circuit breaker</code></pre>
<div class="note warn">Повторы без лимита и без jitter превращают кратковременный сбой в шторм запросов, который добивает восстанавливающийся сервис. Повторяйте только идемпотентные операции (урок 1.4).</div>`,
 check: [
  { id:'q18-1a', type:'single', prompt:'Что делает circuit breaker?', options:['После серии ошибок временно прекращает вызовы зависимости','Перезагружает сервер','Шифрует трафик','Удваивает число реплик'], answer:0, explanation:'Защищает и вызывающего, и вызываемого.' },
  { id:'q18-1b', type:'single', prompt:'Зачем добавлять jitter к задержкам повторов?', options:['Чтобы клиенты не повторяли запросы синхронно и не создавали шторм','Чтобы ускорить ответ','Для шифрования','Не нужно'], answer:0, explanation:'Случайный разброс разносит повторы во времени.' }
 ]},
 { id:'18-2', title:'Паттерны управления данными', html:`
<div class="tbl"><table><tr><th>Паттерн</th><th>Идея</th><th>Пример</th></tr>
<tr><td>Cache-Aside</td><td>Приложение сначала ищет в кэше, при промахе читает из БД и кладёт в кэш</td><td>Redis перед PostgreSQL</td></tr>
<tr><td>Sharding</td><td>Данные делятся на части по ключу между несколькими хранилищами</td><td>Пользователи по хешу id на 8 шардов</td></tr>
<tr><td>CQRS</td><td>Раздельные модели и хранилища для записи и чтения</td><td>Запись в PostgreSQL, поиск по Elasticsearch</td></tr>
<tr><td>Event Sourcing</td><td>Хранить не текущее состояние, а журнал событий</td><td>Банковский счёт как цепочка операций</td></tr>
<tr><td>Materialized View</td><td>Заранее посчитанное представление для быстрых запросов</td><td>Дневная сводка продаж</td></tr>
<tr><td>Valet Key</td><td>Клиенту выдаётся временная ссылка с ограниченными правами прямо к хранилищу</td><td>Presigned URL S3 для загрузки файла</td></tr>
<tr><td>Index Table</td><td>Вторичные индексы для хранилищ без них</td><td>Таблица email → user_id в NoSQL</td></tr>
</table></div>
<h3>Согласованность</h3>
<p>В распределённой системе при сетевом разделе приходится выбирать между согласованностью и доступностью (теорема CAP). Многие облачные хранилища выбирают <b>согласованность в конечном счёте</b> (eventual consistency): данные разойдутся по репликам не мгновенно.</p>
<div class="note why"><b>Для DevOps</b> паттерны данных определяют, что нужно эксплуатировать: Redis-кластер, реплики чтения, очереди событий, хранилища объектов, — и как их резервировать (модуль 19.4).</div>`,
 check: [
  { id:'q18-2a', type:'single', prompt:'Как работает Cache-Aside?', options:['При промахе приложение читает из БД и само кладёт данные в кэш','Кэш сам ходит в БД по расписанию','Данные пишутся только в кэш','БД кэширует сама себя'], answer:0, explanation:'Логика кэширования — в приложении.' },
  { id:'q18-2b', type:'single', prompt:'Какой паттерн реализует presigned URL S3 для загрузки файла клиентом?', options:['Valet Key','Sharding','CQRS','Bulkhead'], answer:0, explanation:'Временный ограниченный доступ напрямую к хранилищу.' }
 ]},
 { id:'18-3', title:'Паттерны проектирования и реализации', html:`
<div class="tbl"><table><tr><th>Паттерн</th><th>Идея</th></tr>
<tr><td>Strangler Fig</td><td>Постепенно заменять старую систему: новые части за фасадом забирают маршруты один за другим</td></tr>
<tr><td>Anti-Corruption Layer</td><td>Слой-переводчик между новой системой и устаревшей, чтобы её модель не «протекала»</td></tr>
<tr><td>Ambassador</td><td>Вспомогательный прокси рядом с клиентом берёт на себя сетевые задачи</td></tr>
<tr><td>Sidecar</td><td>Вспомогательный процесс рядом с основным в том же поде: сбор логов, прокси, обновление конфига</td></tr>
<tr><td>Gateway Routing / Aggregation / Offloading</td><td>API-шлюз маршрутизирует, объединяет вызовы и снимает общие задачи (TLS, авторизацию)</td></tr>
<tr><td>Backends for Frontends</td><td>Отдельный бэкенд под каждый тип клиента: веб, мобильное приложение</td></tr>
<tr><td>Competing Consumers</td><td>Несколько обработчиков читают одну очередь — масштабирование обработки</td></tr>
<tr><td>Saga</td><td>Распределённая транзакция как цепочка локальных шагов с компенсациями</td></tr>
</table></div>
<pre><code># Sidecar в Kubernetes: приложение + сборщик логов в одном поде
spec:
  containers:
    - name: app
      image: shop:3f9c2e1
      volumeMounts: [{ name: logs, mountPath: /var/log/app }]
    - name: log-shipper
      image: fluent/fluent-bit:3.1
      volumeMounts: [{ name: logs, mountPath: /var/log/app, readOnly: true }]
  volumes: [{ name: logs, emptyDir: {} }]</code></pre>
<div class="note why"><b>Strangler Fig</b> — главный паттерн миграций: монолит не переписывают «большим взрывом», а постепенно выносят функции, направляя часть маршрутов в новые сервисы через reverse proxy или шлюз (модуль 5).</div>`,
 check: [
  { id:'q18-3a', type:'single', prompt:'Как работает паттерн Strangler Fig?', options:['Новая система постепенно забирает функции старой через общий фасад','Старую систему отключают за одну ночь','Две системы работают без связи','Код копируется целиком'], answer:0, explanation:'Безопасная постепенная миграция.' },
  { id:'q18-3b', type:'single', prompt:'Что такое Competing Consumers?', options:['Несколько обработчиков читают одну очередь, масштабируя обработку','Конкурирующие команды разработки','Два балансировщика','Гонка за ресурсами CPU'], answer:0, explanation:'Каждое сообщение обработает один из них.' }
 ]},
 { id:'18-4', title:'Паттерны управления и мониторинга', html:`
<div class="tbl"><table><tr><th>Паттерн</th><th>Идея</th></tr>
<tr><td>External Configuration Store</td><td>Конфигурация вне пакета приложения: в хранилище или переменных окружения (12-factor, модуль 15.4)</td></tr>
<tr><td>Health Endpoint Monitoring</td><td>Эндпойнты живости и готовности для внешних проверок</td></tr>
<tr><td>Gatekeeper</td><td>Отдельный защищённый слой проверяет и фильтрует запросы до доступа к сервисам</td></tr>
<tr><td>Federated Identity</td><td>Аутентификация через внешнего провайдера (OIDC, SAML) вместо своей базы паролей</td></tr>
<tr><td>Compute Resource Consolidation</td><td>Объединение мелких задач на общих ресурсах для экономии</td></tr>
<tr><td>Scheduler Agent Supervisor</td><td>Координация многошаговой работы с контролем и восстановлением после сбоев</td></tr>
<tr><td>Leader Election</td><td>Из нескольких экземпляров один выбирается ведущим для задач, которые должен делать ровно один</td></tr>
</table></div>
<h3>Well-Architected: пять столпов</h3>
<div class="tbl"><table><tr><th>Столп</th><th>Вопрос</th></tr>
<tr><td>Надёжность</td><td>Переживёт ли система отказ зоны доступности?</td></tr>
<tr><td>Безопасность</td><td>Наименьшие привилегии, шифрование, аудит?</td></tr>
<tr><td>Эффективность затрат</td><td>Платим ли за простаивающие ресурсы?</td></tr>
<tr><td>Операционное совершенство</td><td>Автоматизированы ли выкатки, есть ли runbook?</td></tr>
<tr><td>Производительность</td><td>Подходят ли ресурсы нагрузке, есть ли автомасштабирование?</td></tr>
</table></div>
<p>У AWS, Azure и Google Cloud есть свои Well-Architected Framework с чек-листами. По ним удобно проводить ревью архитектуры перед запуском.</p>
<div class="note why">Паттерны — словарь для обсуждения архитектуры. Фраза «здесь нужен bulkhead и очередь для выравнивания нагрузки» сразу понятна команде — как названия паттернов GoF в коде (см. <a href="../oop/#/l/10-1">ООП 10</a>).</div>`,
 check: [
  { id:'q18-4a', type:'single', prompt:'Зачем паттерн Leader Election?', options:['Чтобы задачу, которую должен делать ровно один экземпляр, выполнял один выбранный ведущий','Для голосования пользователей','Для балансировки нагрузки поровну','Для выбора облака'], answer:0, explanation:'Например, cron-задача в нескольких репликах.' },
  { id:'q18-4b', type:'multiple', prompt:'Какие столпы входят в Well-Architected? (несколько ответов)', options:['Надёжность','Безопасность','Эффективность затрат','Красота кода'], answer:[0,1,2], explanation:'Плюс операционное совершенство и производительность.' }
 ]}
 ],
 test: [
  { id:'t18-1', type:'match', prompt:'Сопоставьте паттерн и группу.', pairs:[['Circuit Breaker','Доступность'],['Sharding','Управление данными'],['Strangler Fig','Проектирование и реализация'],['External Configuration Store','Управление и мониторинг']], explanation:'Группы облачных паттернов.', difficulty:2 },
  { id:'t18-2', type:'single', prompt:'Какой паттерн изолирует ресурсы, чтобы сбой одной части не затопил всю систему?', options:['Bulkhead','Valet Key','Saga','CQRS'], answer:0, explanation:'Как отсеки корабля.', difficulty:1 },
  { id:'t18-3', type:'single', prompt:'Как распределённой системе выполнить «транзакцию» через несколько сервисов?', options:['Saga: цепочка локальных шагов с компенсирующими действиями','Одна транзакция БД на все сервисы','Никак','Через DNS'], answer:0, explanation:'Компенсация отменяет выполненные шаги.', difficulty:2 },
  { id:'t18-4', type:'single', prompt:'Что сглаживает пики нагрузки на обработчик?', options:['Queue-Based Load Leveling — очередь между источником и обработчиком','Увеличение таймаутов','Отключение мониторинга','Cache-Aside'], answer:0, explanation:'Обработчик берёт сообщения в своём темпе.', difficulty:1 },
  { id:'t18-5', type:'single', prompt:'Что такое CQRS?', options:['Разделение моделей записи и чтения','Вид кэша','Алгоритм балансировки','Формат конфигурации'], answer:0, explanation:'Command Query Responsibility Segregation.', difficulty:2 },
  { id:'t18-6', type:'single', prompt:'Почему повторы без лимита и jitter опасны?', options:['Создают шторм запросов, добивающий восстанавливающийся сервис','Они медленные','Нарушают TLS','Не опасны'], answer:0, explanation:'Retry storm.', difficulty:2 },
  { id:'t18-7', type:'single', prompt:'Что такое Well-Architected Framework?', options:['Набор принципов и чек-листов облачных провайдеров для ревью архитектуры','Фреймворк для фронтенда','Система мониторинга','Язык IaC'], answer:0, explanation:'Пять (у AWS — шесть) столпов.', difficulty:1 },
  { id:'t18-8', type:'multiple', prompt:'Какие паттерны относятся к доступности? (несколько ответов)', options:['Retry','Circuit Breaker','Health Endpoint Monitoring','Event Sourcing'], answer:[0,1,2], explanation:'Event Sourcing — управление данными.', difficulty:2 }
 ]
},
{
 id: 19, title: 'SRE и надёжность', short: 'SLO, бюджет ошибок, инциденты, резервирование',
 lessons: [
 { id:'19-1', title:'SLI, SLO и SLA', html:`
<p>Site Reliability Engineering — подход Google: эксплуатация как инженерная задача, а надёжность измеряется числами.</p>
<ul>
<li><b>SLI</b> (indicator) — измеримый показатель с точки зрения пользователя: доля успешных запросов, доля запросов быстрее 300 мс.</li>
<li><b>SLO</b> (objective) — цель для SLI на период: «99,9% запросов успешны за 30 дней».</li>
<li><b>SLA</b> (agreement) — договор с клиентом с последствиями (компенсации). SLA всегда мягче SLO, чтобы был запас.</li>
</ul>
<pre><code>SLI = хорошие события / все события
    = запросы с кодом не 5xx и быстрее 300 мс / все запросы</code></pre>
<p>Посчитайте, сколько простоя допускает каждая «девятка»:</p>
<div data-widget="slo"></div>
<div class="note why"><b>100% — неправильная цель.</b> Пользователь не отличит 99,99% от 100%: его Wi-Fi и телефон менее надёжны. А каждая лишняя девятка стоит кратно дороже и тормозит разработку. Цель выбирают по реальным ожиданиям пользователей.</div>`,
 check: [
  { id:'q19-1a', type:'single', prompt:'Как соотносятся SLO и SLA?', options:['SLA мягче SLO, чтобы был запас до штрафов','SLA строже SLO','Это одно и то же','SLA — внутренняя цель команды'], answer:0, explanation:'Нарушить внутреннюю цель раньше, чем договор.' },
  { id:'q19-1b', type:'input', prompt:'SLO 99,9% за 30 дней. Сколько минут простоя допустимо? Введите число с точностью до десятых через точку или запятую.', answer:['43.2','43,2'], explanation:'43 200 мин × 0,001 = 43,2 мин.' }
 ]},
 { id:'19-2', title:'Бюджет ошибок и алерты', html:`
<p><b>Бюджет ошибок</b> = 1 − SLO. При SLO 99,9% у вас есть 0,1% запросов, которые <i>можно</i> потерять за месяц. Это ресурс, который тратят на риск: выкатки, эксперименты, миграции.</p>
<ul>
<li>Бюджет есть — выкатываемся смело и часто.</li>
<li>Бюджет исчерпан — заморозка рискованных изменений, команда занимается надёжностью.</li>
</ul>
<p>Так спор «скорость против стабильности» превращается в договорённость, основанную на данных.</p>
<h3>Алерты по скорости сжигания</h3>
<p><b>Burn rate</b> — во сколько раз быстрее нормы тратится бюджет. Burn rate 1 — бюджет кончится ровно к концу периода. Burn rate 14,4 — месячный бюджет сгорит за ~2 дня, а 2% бюджета — за час.</p>
<pre><code># пейдж: быстрое сгорание, подтверждённое на двух окнах
(error_ratio[1h] > 14.4 * 0.001) and (error_ratio[5m] > 14.4 * 0.001)
# тикет: медленное сгорание
(error_ratio[3d] > 1 * 0.001)</code></pre>
<h3>Хороший алерт</h3>
<ul>
<li>сигнализирует о <b>влиянии на пользователей</b> (симптом), а не о причине («CPU 90%» — не повод будить человека);</li>
<li>требует <b>действия</b> — если на алерт ничего не делают, его удаляют;</li>
<li>содержит ссылку на <b>runbook</b> — инструкцию «что проверить и что сделать».</li>
</ul>
<div class="note"><b>Усталость от алертов.</b> Дежурный, получающий 50 ложных пейджей в неделю, перестаёт на них реагировать — и пропускает настоящий.</div>`,
 check: [
  { id:'q19-2a', type:'single', prompt:'Бюджет ошибок исчерпан в середине месяца. Что обычно делают?', options:['Замораживают рискованные выкатки и занимаются надёжностью','Повышают SLO','Ускоряют релизы','Отключают мониторинг'], answer:0, explanation:'Такова политика бюджета ошибок.' },
  { id:'q19-2b', type:'single', prompt:'Какой алерт лучше будить человека ночью?', options:['Быстро сгорает бюджет ошибок checkout','CPU узла 85%','Диск заполнен на 60%','Под перезапустился один раз'], answer:0, explanation:'Алерт на симптом, влияющий на пользователей.' }
 ]},
 { id:'19-3', title:'Инциденты и постмортемы', html:`
<h3>Управление инцидентом</h3>
<ul>
<li><b>Incident commander</b> координирует и принимает решения, но сам не чинит.</li>
<li><b>Ответственный за коммуникацию</b> обновляет статус-страницу и стейкхолдеров.</li>
<li><b>Операторы</b> диагностируют и устраняют.</li>
<li>Один канал инцидента, хронология с временными метками.</li>
<li>Приоритет — <b>смягчить</b> (откат, флаг, переключение трафика), а не найти первопричину.</li>
</ul>
<h3>Постмортем</h3>
<p>После значимого инцидента пишут разбор. Принцип — <b>безобвинительность</b> (blameless): люди действовали разумно с той информацией, что у них была. Если один человек одной командой смог уронить прод, проблема в системе, которая это позволила.</p>
<ol class="steps">
<li><b>Итог:</b> что сломалось, длительность, влияние на пользователей и бюджет.</li>
<li><b>Хронология:</b> от изменения до восстановления, включая момент обнаружения.</li>
<li><b>Причины:</b> технические и организационные; техника «5 почему».</li>
<li><b>Что сработало и что нет.</b></li>
<li><b>Задачи</b> с владельцами и сроками: предотвратить, обнаружить раньше, восстановить быстрее.</li>
</ol>
<div class="note why"><b>Обнаружили клиенты?</b> Если о сбое узнали из жалоб, а не от мониторинга, — одна из задач всегда «добавить алерт». Время до обнаружения — часть MTTR.</div>`,
 check: [
  { id:'q19-3a', type:'single', prompt:'Что значит blameless postmortem?', options:['Разбор ищет системные причины, а не виноватого человека','Постмортем без автора','Постмортем пишут только при отсутствии виноватых','Разбор не публикуется'], answer:0, explanation:'Иначе люди начнут скрывать ошибки.' },
  { id:'q19-3b', type:'single', prompt:'Какова роль incident commander?', options:['Координировать и принимать решения, а не чинить самому','Писать код исправления','Общаться только с клиентами','Искать виноватого'], answer:0, explanation:'Кто-то должен видеть картину целиком.' }
 ]},
 { id:'19-4', title:'Резервирование, бэкапы и хаос', html:`
<h3>Резервирование</h3>
<p>Любой компонент в единственном экземпляре — <b>единая точка отказа</b> (SPOF). Против неё: несколько реплик в разных зонах, балансировщик с health-check, реплики БД с автоматическим failover.</p>
<h3>Устойчивость в коде</h3>
<ul>
<li><b>Таймауты</b> на каждом внешнем вызове — без них один зависший сервис занимает все потоки.</li>
<li><b>Ретраи с экспоненциальной задержкой и джиттером</b> — и только для идемпотентных операций.</li>
<li><b>Circuit breaker</b> — перестать дёргать упавшую зависимость, дать ей подняться.</li>
<li><b>Деградация</b> — рекомендации не загрузились? Покажем страницу без них.</li>
</ul>
<h3>Бэкапы</h3>
<p>Правило <b>3-2-1</b>: 3 копии данных, на 2 разных типах носителей, 1 — в другом месте (регион, аккаунт). Две метрики: <b>RPO</b> — сколько данных можно потерять (время с последнего бэкапа), <b>RTO</b> — за сколько нужно восстановиться.</p>
<div class="note"><b>Непроверенный бэкап — не бэкап.</b> Регулярно восстанавливайте из бэкапа в тестовое окружение автоматически. Многие узнают, что бэкапы пустые или не восстанавливаются, в день, когда они нужны.</div>
<h3>Chaos engineering</h3>
<p>Намеренно ломайте систему контролируемо: убить под, добавить 300 мс задержки к базе, отключить зону. Гипотеза «сервис переживёт потерю одной зоны» проверяется экспериментом, а не верой. Начинают со staging и маленького радиуса поражения; инструменты — Chaos Mesh, Litmus, AWS FIS. Плановые учения с людьми называют <b>game day</b>.</p>`,
 check: [
  { id:'q19-4a', type:'match', prompt:'Сопоставьте термин и смысл.', pairs:[['RPO','Сколько данных допустимо потерять'],['RTO','За сколько нужно восстановиться'],['SPOF','Компонент, отказ которого роняет всё']], explanation:'Базовые термины надёжности.' },
  { id:'q19-4b', type:'single', prompt:'Почему ретраи делают с экспоненциальной задержкой и джиттером?', options:['Чтобы клиенты не добили перегруженный сервис синхронными повторами','Чтобы быстрее получить ответ','Так требует HTTP','Чтобы экономить логи'], answer:0, explanation:'Иначе возникает «шторм ретраев».' }
 ]}
 ],
 test: [
  { id:'t19-1', type:'input', prompt:'SLO 99,95%, за месяц 20 000 000 запросов. Сколько неуспешных запросов допускает бюджет? Введите число.', answer:['10000','10 000'], explanation:'20 000 000 × 0,0005 = 10 000.', difficulty:2 },
  { id:'t19-2', type:'single', prompt:'Что является хорошим SLI?', options:['Доля запросов, обслуженных успешно быстрее 300 мс','Загрузка CPU сервера','Число подов','Число коммитов в день'], answer:0, explanation:'SLI отражает опыт пользователя.', difficulty:1 },
  { id:'t19-3', type:'single', prompt:'Burn rate равен 1. Что это значит?', options:['Бюджет закончится ровно к концу периода','Бюджет закончился','Ошибок нет','Бюджет сгорит за час'], answer:0, explanation:'Скорость расхода соответствует норме.', difficulty:2 },
  { id:'t19-4', type:'order', prompt:'Расставьте действия при инциденте по приоритету.', options:['Обнаружить и объявить инцидент','Смягчить влияние: откат или флаг','Подтвердить восстановление','Написать постмортем'], answer:[0,1,2,3], explanation:'Восстановление важнее поиска причины.', difficulty:1 },
  { id:'t19-5', type:'single', prompt:'Почему не стоит ставить цель 100% доступности?', options:['Это недостижимо, бесконечно дорого и блокирует изменения','Это запрещено SLA','Пользователи не любят стабильность','Prometheus не считает 100%'], answer:0, explanation:'Каждая девятка кратно дороже.', difficulty:1 },
  { id:'t19-6', type:'multiple', prompt:'Что входит в постмортем? (несколько ответов)', options:['Хронология','Влияние на пользователей','Задачи с владельцами','Имя виноватого и наказание'], answer:[0,1,2], explanation:'Безобвинительный разбор.', difficulty:1 },
  { id:'t19-7', type:'single', prompt:'Что делает circuit breaker?', options:['Временно прекращает вызовы упавшей зависимости','Отключает электричество','Перезапускает под','Удаляет кэш'], answer:0, explanation:'Даёт зависимости восстановиться и экономит ресурсы вызывающего.', difficulty:2 },
  { id:'t19-8', type:'single', prompt:'Бэкапы делаются каждые 6 часов. Какое RPO в худшем случае?', options:['6 часов','0','1 час','24 часа'], answer:0, explanation:'Можно потерять всё с момента последнего бэкапа.', difficulty:2 },
  { id:'t19-9', type:'single', prompt:'Как убедиться, что бэкап рабочий?', options:['Регулярно восстанавливать из него в тестовое окружение','Проверить размер файла','Посмотреть, что задача cron завершилась','Положиться на провайдера'], answer:0, explanation:'Только восстановление доказывает пригодность.', difficulty:1 },
  { id:'t19-10', type:'single', prompt:'Какова цель chaos engineering?', options:['Экспериментально проверить устойчивость системы к сбоям','Уронить прод ради интереса','Нагрузочно протестировать фронтенд','Найти виноватого'], answer:0, explanation:'Контролируемые эксперименты с малым радиусом поражения.', difficulty:1 }
 ]
}
];

export const UPCOMING = [];

export const GLOSSARY = [
 ['DevOps','Культура и практики сквозной ответственности команды за поставку и работу сервиса.','0-1'],
 ['CALMS','Culture, Automation, Lean, Measurement, Sharing — модель составляющих DevOps.','0-2'],
 ['Shift left','Перенос проверок на более ранние этапы разработки.','0-3'],
 ['DORA','Четыре метрики поставки: частота деплоев, lead time, доля сбоев, время восстановления.','0-4'],
 ['Lead time','Время от коммита до работы изменения в продакшене.','0-4'],
 ['MTTR','Среднее время восстановления после сбоя.','0-4'],
 ['PID','Идентификатор процесса в Linux.','2-2'],
 ['SIGTERM','Сигнал вежливого завершения процесса; можно перехватить.','2-2'],
 ['SIGKILL','Сигнал немедленного убийства процесса ядром; перехватить нельзя.','2-2'],
 ['Graceful shutdown','Корректное завершение: доделать текущие запросы и выйти.','2-2'],
 ['systemd','Менеджер сервисов и система инициализации Linux.','2-4'],
 ['Cron','Планировщик запуска команд по расписанию.','3-4'],
 ['Conventional Commits','Соглашение о формате сообщений коммитов: feat, fix, chore…','4-1'],
 ['Trunk-based development','Модель, при которой все сливаются в main минимум раз в день.','4-2'],
 ['Pull request','Запрос на слияние ветки с ревью и автоматическими проверками.','4-3'],
 ['CODEOWNERS','Файл, назначающий ответственных ревьюеров по путям.','4-3'],
 ['SemVer','Семантическое версионирование MAJOR.MINOR.PATCH.','4-4'],
 ['Lock-файл','Файл с точными версиями всех установленных зависимостей.','15-1'],
 ['Артефакт','Результат сборки: образ, пакет, бинарник.','15-2'],
 ['Дайджест','Хеш sha256 содержимого образа, неизменный идентификатор.','15-3'],
 ['12-factor','Принципы построения облачных сервисов: конфиг в окружении, stateless и др.','15-4'],
 ['CI','Continuous Integration: частая интеграция с автоматической сборкой и тестами.','10-1'],
 ['Пайплайн','Автоматическая последовательность стадий сборки, проверки и выкатки.','10-1'],
 ['Flaky-тест','Тест, нестабильно падающий без изменений кода.','10-2'],
 ['Раннер','Машина, выполняющая задания CI.','10-3'],
 ['Контейнер','Изолированный процесс с собственной файловой системой на общем ядре.','7-1'],
 ['namespaces','Механизм Linux, изолирующий видимость ресурсов процесса.','7-1'],
 ['cgroups','Механизм Linux, ограничивающий потребление ресурсов.','7-1'],
 ['OCI','Open Container Initiative — стандарты образов и рантаймов контейнеров.','7-1'],
 ['Слой образа','Неизменяемая часть образа, создаваемая инструкцией Dockerfile.','7-2'],
 ['Multi-stage build','Сборка в несколько стадий, финальный образ содержит только результат.','7-3'],
 ['Docker Compose','Описание и запуск многоконтейнерного приложения из одного файла.','7-4'],
 ['Kubernetes','Оркестратор контейнеров с декларативной моделью.','14-1'],
 ['etcd','Хранилище состояния кластера Kubernetes.','14-1'],
 ['Pod','Минимальная единица Kubernetes: контейнеры с общей сетью.','14-2'],
 ['Deployment','Ресурс Kubernetes для stateless-приложений с выкатками.','14-2'],
 ['CrashLoopBackOff','Статус пода, контейнер которого постоянно падает при старте.','14-2'],
 ['Service','Стабильное имя и IP для группы подов.','14-3'],
 ['Ingress','Правила L7-маршрутизации внешнего трафика в сервисы.','14-3'],
 ['ConfigMap','Объект Kubernetes с конфигурацией приложения.','14-4'],
 ['Readiness probe','Проверка готовности пода принимать трафик.','14-4'],
 ['Liveness probe','Проверка, жив ли процесс; провал — перезапуск.','14-4'],
 ['Continuous Delivery','Каждое изменение готово к выкатке в прод по кнопке.','11-1'],
 ['Continuous Deployment','Каждое прошедшее пайплайн изменение выкатывается автоматически.','11-1'],
 ['Blue-green','Выкатка с полной параллельной копией и переключением трафика.','11-2'],
 ['Canary','Выкатка новой версии на малую долю трафика с анализом метрик.','11-2'],
 ['Rolling update','Постепенная замена экземпляров старой версии новыми.','11-2'],
 ['Feature flag','Переключатель, включающий функцию без нового деплоя.','11-3'],
 ['GitOps','Желаемое состояние в Git, агент в кластере синхронизирует его автоматически.','16-1'],
 ['Helm','Пакетный менеджер Kubernetes с шаблонами-чартами.','16-1'],
 ['IaC','Infrastructure as Code — инфраструктура, описанная кодом.','9-1'],
 ['Идемпотентность','Повторное применение даёт тот же результат.','9-1'],
 ['Terraform','Инструмент декларативного описания облачной инфраструктуры.','9-2'],
 ['State','Файл Terraform с соответствием кода и реальных ресурсов.','9-3'],
 ['Дрейф','Расхождение реальной инфраструктуры с кодом.','9-3'],
 ['Ansible','Безагентный инструмент управления конфигурацией серверов по SSH.','9-4'],
 ['VPC','Изолированная виртуальная сеть в облаке.','8-2'],
 ['Security group','Stateful-файрвол облачного экземпляра.','8-2'],
 ['IAM','Управление идентификацией и правами доступа в облаке.','8-3'],
 ['OIDC-федерация','Получение временных облачных кредов по подписанному токену, например из CI.','8-3'],
 ['HPA','Horizontal Pod Autoscaler: масштабирование числа подов по метрикам.','8-4'],
 ['FinOps','Практики управления стоимостью облака.','8-4'],
 ['Наблюдаемость','Способность понимать состояние системы по её внешним сигналам.','13-1'],
 ['RED','Rate, Errors, Duration — метрики сервиса.','13-1'],
 ['Перцентиль','Значение, ниже которого лежит заданная доля измерений: p99.','13-1'],
 ['Prometheus','Система сбора метрик по pull-модели с языком PromQL.','13-2'],
 ['Кардинальность','Число уникальных временных рядов, порождаемых метками.','13-2'],
 ['Структурированный лог','Запись лога в виде полей (обычно JSON).','13-3'],
 ['Трейс','Дерево спанов, описывающее путь запроса через сервисы.','13-4'],
 ['OpenTelemetry','Открытый стандарт и SDK для метрик, логов и трейсов.','13-4'],
 ['SLI','Измеримый показатель качества сервиса с точки зрения пользователя.','19-1'],
 ['SLO','Целевое значение SLI на период.','19-1'],
 ['SLA','Договор с клиентом об уровне сервиса с последствиями.','19-1'],
 ['Бюджет ошибок','Допустимая доля сбоев: 1 − SLO.','19-2'],
 ['Burn rate','Во сколько раз быстрее нормы расходуется бюджет ошибок.','19-2'],
 ['Runbook','Инструкция по реагированию на конкретный алерт.','19-2'],
 ['Постмортем','Безобвинительный разбор инцидента с задачами на улучшение.','19-3'],
 ['RPO','Допустимый объём потери данных во времени.','19-4'],
 ['RTO','Допустимое время восстановления.','19-4'],
 ['Circuit breaker','Механизм прекращения вызовов отказавшей зависимости.','19-4'],
 ['Chaos engineering','Контролируемые эксперименты со сбоями для проверки устойчивости.','19-4'],
 ['DevSecOps','Встраивание проверок безопасности в каждый этап поставки.','12-1'],
 ['SAST','Статический анализ исходного кода на уязвимости.','12-1'],
 ['CVE','Идентификатор публично известной уязвимости.','12-1'],
 ['Vault','Менеджер секретов HashiCorp с динамическими секретами.','12-2'],
 ['SBOM','Опись всех компонентов программного артефакта.','12-4'],
 ['Supply chain attack','Атака через зависимости, инструменты сборки или реестры.','12-4'],
 ['RBAC','Управление доступом на основе ролей.','14-6'],
 ['NetworkPolicy','Правила сетевого доступа между подами в Kubernetes.','14-6'],
 ['Дистрибутив','Сборка Linux: ядро, пакеты и пакетный менеджер.','2-1'],
 ['Load average','Среднее число процессов, готовых к выполнению или ждущих.','3-1'],
 ['jq','Утилита запросов к JSON в терминале.','3-3'],
 ['Веб-сервер','Программа, отвечающая на HTTP-запросы.','5-1'],
 ['Reverse proxy','Прокси перед серверами: TLS, маршрутизация, балансировка.','5-2'],
 ['Forward proxy','Прокси для исходящих запросов клиентов.','5-2'],
 ['Балансировщик нагрузки','Распределяет запросы между экземплярами сервиса.','5-3'],
 ['Файрвол','Фильтрует трафик по правилам.','5-4'],
 ['OSI','Семиуровневая модель сетевого взаимодействия.','6-1'],
 ['TTL DNS','Время кэширования DNS-ответа.','6-2'],
 ['Бастион','Промежуточный хост для SSH-доступа в приватную сеть.','6-3'],
 ['SPF / DKIM / DMARC','Механизмы защиты почтового домена от подделки.','6-4'],
 ['Serverless','Модель, где платформа управляет серверами и масштабированием.','8-5'],
 ['Холодный старт','Задержка первого вызова функции после простоя.','8-5'],
 ['Pulumi','IaC на языках программирования.','9-5'],
 ['GitLab CI','Встроенная CI/CD-система GitLab.','10-5'],
 ['Jenkins','Самостоятельно размещаемый CI-сервер с плагинами.','10-5'],
 ['SOPS','Шифрование значений в файлах секретов для хранения в Git.','12-3'],
 ['Sealed Secrets','Зашифрованные секреты Kubernetes для GitOps.','12-3'],
 ['External Secrets Operator','Синхронизация внешних секретов в Kubernetes.','12-3'],
 ['Zabbix','Система мониторинга серверов и сетевого оборудования.','13-5'],
 ['Elastic Stack','Elasticsearch, Logstash/Beats и Kibana для логов.','13-5'],
 ['EKS / GKE / AKS','Управляемый Kubernetes в AWS, Google Cloud и Azure.','14-5'],
 ['Argo CD','GitOps-оператор с веб-интерфейсом.','16-2'],
 ['Flux','GitOps-оператор из набора контроллеров.','16-2'],
 ['Service mesh','Инфраструктурный слой для связи сервисов через прокси.','17-1'],
 ['Sidecar','Вспомогательный контейнер рядом с основным в поде.','17-1'],
 ['mTLS','Взаимная TLS-аутентификация сторон.','17-1'],
 ['Envoy','Высокопроизводительный L7-прокси.','17-2'],
 ['Bulkhead','Изоляция ресурсов против каскадных сбоев.','18-1'],
 ['Cache-Aside','Кэширование данных по запросу приложением.','18-2'],
 ['Strangler Fig','Постепенная замена старой системы новой.','18-3'],
 ['Well-Architected','Принципы облачных провайдеров для ревью архитектуры.','18-4']
];
