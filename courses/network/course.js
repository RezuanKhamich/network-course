// Код, специфичный для курса «Сети»: настройки, виджеты, сквозной сценарий, шпаргалки.
const COURSE = {
  id: 'network',
  title: 'Сети для разработчиков',
  tagline: 'От кабеля до HTTP/3: как данные на самом деле доходят от браузера до сервера. Короткая теория, схемы, реальные команды и тесты после каждого модуля.',
  journeyLabel: 'Открываем сайт',
  brand: '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><rect x="1" y="6" width="24" height="14" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="7" cy="13" r="2" fill="var(--accent)"/><circle cx="13" cy="13" r="2" fill="var(--accent)"/><circle cx="19" cy="13" r="2" fill="currentColor" opacity=".35"/></svg>'
};

function flowWidget(el, steps){
  el.className = 'widget';
  let k = 0;
    const draw = () => {
      el.innerHTML = `<div style="display:flex;flex-direction:column;gap:6px;font:13px var(--f-mono)">${steps.map((s, i) => `<div style="display:grid;grid-template-columns:minmax(0,130px) minmax(0,1fr) minmax(0,150px);gap:8px;align-items:center;padding:6px 8px;border-radius:6px;opacity:${i > k ? .2 : 1};background:${i === k ? 'var(--accent-soft)' : 'transparent'}"><b>${esc(s.from)}</b><span>${s.q ? '→ ' + esc(s.q) : ''}${s.a ? `<br><span style="color:var(--accent)">← ${esc(s.a)}</span>` : ''}</span><b style="text-align:right">${esc(s.to)}</b></div>`).join('')}</div>
      <p style="margin:12px 0 10px"><b>Шаг ${k + 1}/${steps.length}.</b> ${esc(steps[k].e)}</p>
      <div class="row"><button class="btn ghost" data-d="-1" ${k === 0 ? 'disabled' : ''}>← Назад</button><button class="btn" data-d="1" ${k === steps.length - 1 ? 'disabled' : ''}>Шаг вперёд →</button></div>`;
      el.querySelectorAll('button').forEach(b => b.onclick = () => { k += +b.dataset.d; draw(); });
    };
    draw();
}
const DNS_STEPS = [
      { from:'Браузер', to:'ОС (stub)', q:'www.example.com?', a:'', e:'Браузер и ОС не нашли имя в своих кэшах и в hosts.' },
      { from:'ОС (stub)', to:'Резолвер', q:'www.example.com? (рекурсивно)', a:'', e:'Stub-резолвер просит рекурсивный резолвер найти окончательный ответ.' },
      { from:'Резолвер', to:'Корень .', q:'www.example.com?', a:'Не знаю. Серверы com: a.gtld-servers.net…', e:'Корень отвечает направлением (referral) на серверы зоны com.' },
      { from:'Резолвер', to:'Сервер com', q:'www.example.com?', a:'Не знаю. Серверы example.com: ns1.example.com…', e:'Сервер TLD знает только NS-записи доменов второго уровня.' },
      { from:'Резолвер', to:'ns1.example.com', q:'www.example.com?', a:'www.example.com A 93.184.215.14, TTL 300', e:'Авторитетный сервер даёт окончательный ответ (флаг aa).' },
      { from:'Резолвер', to:'ОС → Браузер', q:'', a:'93.184.215.14', e:'Резолвер кэширует ответ на 300 секунд и возвращает клиенту. Следующий запрос будет обслужен из кэша за миллисекунды.' }
    ];
const TLS_STEPS = [
  { from:'Клиент', to:'Сервер', q:'ClientHello: версии TLS, шифры, key_share (X25519), SNI=example.com, ALPN=h2,http/1.1', a:'', e:'Клиент сразу отправляет свою часть обмена ключами Диффи–Хеллмана, угадывая алгоритм. Поэтому TLS 1.3 укладывается в один RTT.' },
  { from:'Клиент', to:'Сервер', q:'', a:'ServerHello: выбран TLS_AES_128_GCM_SHA256, key_share сервера', e:'Сервер выбирает шифр и отправляет свою часть обмена. Теперь обе стороны вычисляют общий секрет, и всё дальнейшее шифруется.' },
  { from:'Клиент', to:'Сервер', q:'', a:'🔒 EncryptedExtensions: ALPN=h2', e:'Уже зашифровано. Сервер подтверждает выбранный прикладной протокол.' },
  { from:'Клиент', to:'Сервер', q:'', a:'🔒 Certificate: цепочка сертификатов example.com', e:'Клиент проверяет цепочку до доверенного корня, срок действия и что example.com есть в SAN.' },
  { from:'Клиент', to:'Сервер', q:'', a:'🔒 CertificateVerify: подпись рукопожатия закрытым ключом', e:'Сервер доказывает, что владеет закрытым ключом от сертификата: подписывает всю историю рукопожатия.' },
  { from:'Клиент', to:'Сервер', q:'', a:'🔒 Finished', e:'Контрольная сумма рукопожатия: никто не подменил сообщения по пути.' },
  { from:'Клиент', to:'Сервер', q:'🔒 Finished + GET / HTTP/2', a:'', e:'Клиент подтверждает рукопожатие и сразу отправляет первый запрос. Прошёл ровно один RTT.' }
];
const WIDGETS = {
  encap(el){
    const layers = [
      { n:'Прикладной (HTTP)', h:'GET /index.html HTTP/1.1', c:'var(--accent)' },
      { n:'Транспортный (TCP)', h:'TCP: порт 51000 → 443, seq, ack', c:'#3b82c4' },
      { n:'Сетевой (IP)', h:'IP: 192.168.1.10 → 93.184.215.14, TTL 64', c:'#a46ad1' },
      { n:'Канальный (Ethernet)', h:'Ethernet: MAC 3c:22:… → a4:bb:…, FCS', c:'#d0802b' }
    ];
    let lvl = 0;
    el.className = 'widget';
    const draw = () => {
      let inner = `<div class="data">данные</div>`;
      for (let i = 0; i <= lvl; i++){
        const L = layers[i];
        inner = `<div class="layer" style="border-color:${L.c}"><span class="lbl" style="color:${L.c}">${i === 0 ? 'HTTP-запрос' : L.h}</span>${i === 0 ? `<div class="data">${L.h}</div>` : inner}</div>`;
      }
      el.innerHTML = `<div class="encap">${inner}</div><p class="small" style="text-align:center">Уровень: <b>${layers[lvl].n}</b></p><div class="row" style="justify-content:center"><button class="btn ghost" data-d="-1" ${lvl === 0 ? 'disabled' : ''}>← Снять заголовок</button><button class="btn" data-d="1" ${lvl === layers.length - 1 ? 'disabled' : ''}>Следующий уровень →</button></div>`;
      el.querySelectorAll('button').forEach(b => b.onclick = () => { lvl += +b.dataset.d; draw(); });
    };
    draw();
  },
  subnet(el){
    el.className = 'widget';
    const id = 'sn' + Math.random().toString(36).slice(2, 6);
    el.innerHTML = `<label for="${id}" class="small">IP-адрес и префикс</label><div class="row"><input type="text" id="${id}" value="10.0.5.77/26" style="font-family:var(--f-mono);flex:1;max-width:280px" autocomplete="off"></div><div class="out"></div>`;
    const inp = el.querySelector('input'), out = el.querySelector('.out');
    const toIp = n => [24, 16, 8, 0].map(s => (n >>> s) & 255).join('.');
    const bin = n => [24, 16, 8, 0].map(s => ((n >>> s) & 255).toString(2).padStart(8, '0')).join('.');
    const calc = () => {
      const m = inp.value.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\s*\/\s*(\d{1,2})$/);
      if (!m || m.slice(1, 5).some(x => +x > 255) || +m[5] > 32){ out.innerHTML = '<p class="small" style="color:var(--bad)">Введите адрес в формате 192.168.1.10/24 (префикс 0–32).</p>'; return; }
      const ip = ((+m[1] << 24) | (+m[2] << 16) | (+m[3] << 8) | +m[4]) >>> 0, p = +m[5];
      const mask = p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0;
      const net = (ip & mask) >>> 0, bc = (net | (~mask >>> 0)) >>> 0, size = 2 ** (32 - p);
      const hosts = p === 32 ? 1 : p === 31 ? 2 : size - 2;
      const first = p >= 31 ? net : net + 1, last = p >= 31 ? bc : bc - 1;
      const priv = (ip >>> 24 === 10) || (ip >>> 20 === 0xAC1) || (ip >>> 16 === 0xC0A8);
      const ipBin = bin(ip); let pos = 0, colored = '';
      for (const ch of ipBin){ if (ch === '.'){ colored += '.'; continue; } colored += pos < p ? `<span class="n">${ch}</span>` : ch; pos++; }
      out.innerHTML = `<div class="calc">
        <div><span>Адрес сети</span><b>${toIp(net)}/${p}</b></div><div><span>Маска</span><b>${toIp(mask)}</b></div>
        <div><span>Broadcast</span><b>${p >= 31 ? '—' : toIp(bc)}</b></div><div><span>Диапазон хостов</span><b>${toIp(first)} – ${toIp(last)}</b></div>
        <div><span>Всего адресов</span><b>${size.toLocaleString('ru-RU')}</b></div><div><span>Хостов</span><b>${hosts.toLocaleString('ru-RU')}</b></div>
        <div><span>Тип</span><b>${priv ? 'частный (RFC 1918)' : (ip >>> 24 === 127 ? 'loopback' : (ip >>> 16 === 0xA9FE ? 'link-local' : ((ip >>> 22) === 0x191 ? 'CGNAT' : 'публичный / особый')))}</b></div></div>
        <div class="bits">IP: ${colored} <span class="small">— сетевая часть выделена</span><br>Маска: ${bin(mask)}</div>${p === 31 ? '<p class="small">/31 используется для линков точка-точка (RFC 3021): оба адреса — хосты.</p>' : ''}`;
    };
    inp.addEventListener('input', calc); calc();
  },
  dns(el){ flowWidget(el, DNS_STEPS); },
  tls(el){ flowWidget(el, TLS_STEPS); },
  ipv6(el){
    el.className = 'widget';
    const id = 'v6' + Math.random().toString(36).slice(2, 6);
    el.innerHTML = `<label for="${id}" class="small">IPv6-адрес (полный или сокращённый)</label><div class="row"><input type="text" id="${id}" value="2001:0db8:0000:0000:0000:ff00:0042:8329" style="font-family:var(--f-mono);flex:1;max-width:460px" autocomplete="off"></div><div class="out"></div>`;
    const inp = el.querySelector('input'), out = el.querySelector('.out');
    const expand = s => {
      s = s.trim().toLowerCase().split('/')[0];
      if (!/^[0-9a-f:]+$/.test(s) || (s.match(/::/g) || []).length > 1) return null;
      let parts;
      if (s.includes('::')){ const [l, r] = s.split('::'); const L = l ? l.split(':') : [], R = r ? r.split(':') : []; const miss = 8 - L.length - R.length; if (miss < 1) return null; parts = [...L, ...Array(miss).fill('0'), ...R]; }
      else parts = s.split(':');
      if (parts.length !== 8 || parts.some(p => !/^[0-9a-f]{1,4}$/.test(p))) return null;
      return parts.map(p => p.padStart(4, '0'));
    };
    const compress = g => {
      const h = g.map(p => p.replace(/^0+(?=.)/, ''));
      let best = -1, bl = 0;
      for (let i = 0; i < 8;){ if (h[i] === '0'){ let j = i; while (j < 8 && h[j] === '0') j++; if (j - i > bl){ best = i; bl = j - i; } i = j; } else i++; }
      if (bl < 2) return h.join(':');
      return h.slice(0, best).join(':') + '::' + h.slice(best + bl).join(':');
    };
    const type = g => { const f = parseInt(g[0], 16);
      if (g.every(x => x === '0000')) return 'неопределённый (::)';
      if (g.slice(0, 7).every(x => x === '0000') && g[7] === '0001') return 'loopback (::1)';
      if ((f & 0xffc0) === 0xfe80) return 'link-local';
      if ((f & 0xfe00) === 0xfc00) return 'ULA (локальный)';
      if ((f & 0xff00) === 0xff00) return 'multicast';
      if (g[0] === '2001' && g[1] === '0db8') return 'документация';
      if ((f & 0xe000) === 0x2000) return 'global unicast';
      return 'другой / зарезервированный'; };
    const calc = () => { const g = expand(inp.value);
      if (!g){ out.innerHTML = '<p class="small" style="color:var(--bad)">Это не похоже на IPv6-адрес. Проверьте: 8 групп до 4 hex-цифр, :: не больше одного раза.</p>'; return; }
      out.innerHTML = `<div class="calc"><div style="grid-column:1/-1"><span>Сокращённая форма (RFC 5952)</span><b>${compress(g)}</b></div><div style="grid-column:1/-1"><span>Полная форма</span><b>${g.join(':')}</b></div><div><span>Префикс сети /64</span><b>${compress([...g.slice(0, 4), '0000', '0000', '0000', '0000'])}/64</b></div><div><span>Идентификатор интерфейса</span><b>${g.slice(4).join(':')}</b></div><div><span>Тип</span><b>${type(g)}</b></div><div><span>EUI-64 (из MAC)?</span><b>${g[5].endsWith('ff') && g[6].startsWith('fe') ? 'да, ff:fe в середине' : 'нет'}</b></div></div>`; };
    inp.addEventListener('input', calc); calc();
  },
  route(el){
    el.className = 'widget';
    const table = [['0.0.0.0/0','via 192.168.1.1 dev wlan0','маршрут по умолчанию'],['10.0.0.0/8','dev tun0','корпоративный VPN'],['10.8.0.0/24','dev wg0','WireGuard'],['172.17.0.0/16','dev docker0','Docker'],['192.168.1.0/24','dev wlan0','домашняя сеть']];
    const id = 'rt' + Math.random().toString(36).slice(2, 6);
    el.innerHTML = `<label for="${id}" class="small">Адрес назначения</label><div class="row"><input type="text" id="${id}" value="10.8.0.15" style="font-family:var(--f-mono);max-width:220px" autocomplete="off"><span class="small">попробуйте 8.8.8.8, 10.1.2.3, 172.17.0.5, 192.168.1.40</span></div><div class="tbl"><table><tr><th>Сеть</th><th>Куда</th><th>Что это</th><th>Подходит?</th></tr><tbody class="rows"></tbody></table></div><p class="res"></p>`;
    const inp = el.querySelector('input');
    const toN = s => { const m = s.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/); if (!m || m.slice(1).some(x => +x > 255)) return null; return ((+m[1] << 24) | (+m[2] << 16) | (+m[3] << 8) | +m[4]) >>> 0; };
    const calc = () => { const ip = toN(inp.value); let best = null;
      const rows = table.map(([net, via, d]) => { const [n, p] = net.split('/'); const mask = +p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0; const ok = ip !== null && ((ip & mask) >>> 0) === ((toN(n) & mask) >>> 0); if (ok && (!best || +p > best.p)) best = { net, via, p:+p }; return { net, via, d, ok }; });
      el.querySelector('.rows').innerHTML = rows.map(r => `<tr style="${best && r.net === best.net ? 'background:var(--ok-soft);font-weight:600' : ''}"><td><code>${r.net}</code></td><td><code>${r.via}</code></td><td>${r.d}</td><td>${ip === null ? '—' : (r.ok ? 'да' : 'нет')}</td></tr>`).join('');
      el.querySelector('.res').innerHTML = ip === null ? '<span style="color:var(--bad)">Введите IPv4-адрес.</span>' : (best.p === 0 ? `Конкретных маршрутов нет — пакет уходит по маршруту по умолчанию → <code>${best.via}</code>.` : `Выбран маршрут <b>${best.net}</b> → <code>${best.via}</code>: среди подходящих у него самый длинный префикс (/${best.p}).`); };
    inp.addEventListener('input', calc); calc();
  },
  tcp(el){
    el.className = 'widget';
    const steps = [
      { d:'→', t:'SYN, seq=1000', e:'Клиент просит открыть соединение и сообщает свой начальный номер последовательности.' },
      { d:'←', t:'SYN-ACK, seq=5000, ack=1001', e:'Сервер соглашается, сообщает свой номер и подтверждает номер клиента + 1.' },
      { d:'→', t:'ACK, ack=5001', e:'Клиент подтверждает. Соединение ESTABLISHED, можно передавать данные.' },
      { d:'→', t:'данные: GET / HTTP/1.1', e:'Обмен данными. Каждый байт нумеруется и подтверждается.' },
      { d:'→', t:'FIN', e:'Клиент закончил отправку и закрывает свою половину соединения.' },
      { d:'←', t:'ACK', e:'Сервер подтверждает. Клиент в состоянии FIN_WAIT_2, сервер — CLOSE_WAIT.' },
      { d:'←', t:'FIN', e:'Сервер тоже закрывает свою половину.' },
      { d:'→', t:'ACK', e:'Клиент подтверждает и ждёт в TIME_WAIT (2×MSL), чтобы опоздавшие пакеты не попали в новое соединение.' }
    ];
    let k = 0;
    const draw = () => {
      el.innerHTML = `<div class="tcp">${steps.map((s, i) => `<div class="host" style="visibility:${i ? 'hidden' : 'visible'}">Клиент</div><div class="arrow ${i > k ? 'dim' : ''}" style="background:${i === k ? 'var(--accent-soft)' : 'transparent'}">${s.d === '→' ? '' : '◀── '}${esc(s.t)}${s.d === '→' ? ' ──▶' : ''}</div><div class="host" style="visibility:${i ? 'hidden' : 'visible'}">Сервер</div>`).join('')}</div>
      <p style="margin:14px 0 10px"><b>Шаг ${k + 1}/${steps.length}.</b> ${esc(steps[k].e)}</p>
      <div class="row"><button class="btn ghost" data-d="-1" ${k === 0 ? 'disabled' : ''}>← Назад</button><button class="btn" data-d="1" ${k === steps.length - 1 ? 'disabled' : ''}>Шаг вперёд →</button></div>`;
      el.querySelectorAll('button').forEach(b => b.onclick = () => { k += +b.dataset.d; draw(); });
    };
    draw();
  }
};

function viewTools(){
  return `<div class="crumbs"><a href="#/">главная</a> / инструменты</div><h1>Инструменты</h1>
  <h2 style="margin-top:26px">Калькулятор подсетей</h2><div data-widget="subnet"></div>
  <h2 style="margin-top:26px">IPv6: сокращение и разбор адреса</h2><div data-widget="ipv6"></div>
  <h2 style="margin-top:26px">Выбор маршрута (longest prefix match)</h2><div data-widget="route"></div>
  <h2 style="margin-top:26px">TCP: установка и закрытие соединения</h2><p class="small">Подробно — в модуле 7.</p><div data-widget="tcp"></div>
  <h2 style="margin-top:26px">Путь DNS-запроса</h2><p class="small">Подробно — в модуле 8.</p><div data-widget="dns"></div>
  <h2 style="margin-top:26px">Инкапсуляция</h2><div data-widget="encap"></div>`;
}


// ====== СКВОЗНОЙ СЦЕНАРИЙ ======
const JOURNEY = [
 { t:'Подключение к сети', l:'L3 · DHCP', d:'Ноутбук подключился к Wi-Fi и по DHCP (Discover → Offer → Request → Ack) получил адрес 192.168.1.10/24, шлюз 192.168.1.1 и DNS-сервер.', code:'inet 192.168.1.10/24 brd 192.168.1.255 scope global dynamic wlan0', lesson:'3-4' },
 { t:'Ввод адреса', l:'L7 · URL', d:'Вы вводите shop.example.com. Браузер понимает, что нужен https:// (или знает это по HSTS), и выделяет имя хоста.', lesson:'10-3' },
 { t:'Поиск в кэшах', l:'L7 · DNS', d:'Браузер проверяет свой DNS-кэш, затем кэш ОС и файл hosts. Записи нет — запрос уходит резолверу.', lesson:'8-4' },
 { t:'Поиск MAC шлюза', l:'L2 · ARP', d:'Резолвер находится в другой сети, поэтому пакет нужно отдать шлюзу. Его MAC ноутбук узнаёт через ARP (или берёт из кэша).', code:'192.168.1.1 dev wlan0 lladdr a4:bb:6d:21:0f:01 REACHABLE', lesson:'2-4' },
 { t:'Разрешение имени', l:'L7 · DNS', d:'Рекурсивный резолвер опрашивает корень → серверы .com → авторитетный сервер example.com и получает A-запись. CDN через GeoDNS или anycast отдаёт адрес ближайшего узла.', code:'shop.example.com. 300 IN A 203.0.113.80', lesson:'8-2' },
 { t:'Выход в интернет', l:'L3 · NAT', d:'Роутер подменяет частный адрес 192.168.1.10:51544 на свой публичный и запоминает соответствие в таблице NAT.', lesson:'3-5' },
 { t:'Путь по сетям', l:'L3 · маршрутизация', d:'Каждый роутер по таблице маршрутизации (longest prefix match) передаёт пакет дальше. Между провайдерами путь выбирает BGP. TTL уменьшается на каждом прыжке.', lesson:'5-1' },
 { t:'TCP-соединение', l:'L4 · TCP', d:'SYN → SYN-ACK → ACK с узлом CDN на порт 443. Стоит один RTT. Договорились о MSS и окне.', lesson:'7-2' },
 { t:'TLS-рукопожатие', l:'L6/7 · TLS 1.3', d:'ClientHello с SNI shop.example.com и ALPN h2 → сервер присылает сертификат, браузер проверяет цепочку и имя. Ещё один RTT, дальше всё зашифровано.', lesson:'10-2' },
 { t:'HTTP-запрос', l:'L7 · HTTP/2', d:'GET / с заголовками Host, cookies, Accept-Encoding. По одному соединению HTTP/2 параллельно пойдут запросы CSS, JS и картинок.', code:'GET / HTTP/2\nHost: shop.example.com\nCookie: sid=9x2k', lesson:'9-1' },
 { t:'CDN и origin', l:'L7 · CDN', d:'Статика с хешем в имени отдаётся из кэша узла (HIT). HTML с персональными данными CDN проксирует на origin: балансировщик → reverse proxy → приложение → база.', lesson:'11-3' },
 { t:'Ответ и рендер', l:'L7 · браузер', d:'Сервер отвечает 200 OK, HTML приходит сжатым. Браузер строит страницу, а для следующих запросов к тому же хосту переиспользует соединение: без DNS, TCP и TLS.', lesson:'9-3' }
];
let journeyStep = 0;
function viewJourney(){
  return `<div class="crumbs"><a href="#/">главная</a> / сквозной сценарий</div><h1>Открываем сайт</h1>
  <p style="margin:10px 0 20px;max-width:75ch">Всё, что происходит между нажатием Enter и появлением страницы, — по шагам и по уровням. Каждый шаг ведёт в урок, где он разобран подробно.</p>
  <div class="journey"><ol class="jlist" id="jlist"></ol><div class="jcard" id="jcard"></div></div>`;
}
function mountJourney(){
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
function viewCheats(){
  const t = (head, rows) => `<div class="tbl"><table><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
  return `<div class="crumbs"><a href="#/">главная</a> / шпаргалки</div><h1>Шпаргалки</h1>
  <h2 style="margin-top:26px">Известные порты</h2>${t(['Порт','Протокол','Транспорт'], [['20/21','FTP','TCP'],['22','SSH, SFTP','TCP'],['25','SMTP','TCP'],['53','DNS','UDP/TCP'],['67/68','DHCP','UDP'],['80','HTTP','TCP'],['123','NTP','UDP'],['143 / 993','IMAP / IMAPS','TCP'],['443','HTTPS, HTTP/3','TCP / UDP'],['465 / 587','SMTP с TLS / submission','TCP'],['3306','MySQL','TCP'],['5432','PostgreSQL','TCP'],['6379','Redis','TCP'],['8080','HTTP (альтернативный)','TCP'],['27017','MongoDB','TCP']])}
  <h2 style="margin-top:26px">Коды ответа HTTP</h2>${t(['Код','Значение'], [['200','OK'],['201','Created'],['204','No Content'],['301 / 308','Постоянный редирект'],['302 / 307','Временный редирект'],['304','Not Modified (кэш актуален)'],['400','Bad Request'],['401','Нужна аутентификация'],['403','Доступ запрещён'],['404','Не найдено'],['409','Конфликт'],['429','Слишком много запросов'],['500','Ошибка сервера'],['502','Bad Gateway: прокси получил плохой ответ'],['503','Сервис недоступен'],['504','Gateway Timeout: апстрим не ответил']])}
  <h2 style="margin-top:26px">Типы DNS-записей</h2>${t(['Тип','Назначение'], [['A','Имя → IPv4'],['AAAA','Имя → IPv6'],['CNAME','Псевдоним другого имени'],['MX','Почтовый сервер домена'],['TXT','Произвольный текст: SPF, верификация'],['NS','Авторитетные серверы зоны'],['SOA','Параметры зоны'],['SRV','Сервис: хост и порт'],['PTR','IP → имя (обратная зона)']])}
  <h2 style="margin-top:26px">CIDR</h2>${t(['Префикс','Маска','Адресов','Хостов'], [['/8','255.0.0.0','16 777 216','16 777 214'],['/16','255.255.0.0','65 536','65 534'],['/20','255.255.240.0','4 096','4 094'],['/22','255.255.252.0','1 024','1 022'],['/24','255.255.255.0','256','254'],['/25','255.255.255.128','128','126'],['/26','255.255.255.192','64','62'],['/27','255.255.255.224','32','30'],['/28','255.255.255.240','16','14'],['/29','255.255.255.248','8','6'],['/30','255.255.255.252','4','2'],['/32','255.255.255.255','1','1']])}
  <h2 style="margin-top:26px">Команды диагностики</h2>${t(['Команда','Что делает'], [['<code>ip a</code> / <code>ipconfig</code>','Адреса интерфейсов'],['<code>ip route</code> / <code>route print</code>','Таблица маршрутов'],['<code>ip neigh</code> / <code>arp -a</code>','ARP-кэш'],['<code>ping host</code>','Доступность и RTT'],['<code>traceroute host</code> / <code>tracert</code>','Путь пакета'],['<code>mtr host</code>','traceroute + ping в реальном времени'],['<code>dig example.com</code>','DNS-запрос'],['<code>curl -v https://…</code>','HTTP-запрос с заголовками и TLS'],['<code>ss -tlnp</code>','Какие порты слушаются'],['<code>tcpdump -i eth0 port 443</code>','Захват трафика']])}`;
}
