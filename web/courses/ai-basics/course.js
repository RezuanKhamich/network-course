// Код, специфичный для курса «Основы ИИ»: настройки, виджеты, сквозной сценарий, шпаргалки.
import { $, esc } from '../../assets/js/storage.js';
import { Game } from '../../assets/js/game.js';
import { findLesson } from '../../assets/js/engine.js';
export const COURSE = {
  id: 'ai-basics',
  title: 'Основы ИИ: теория машинного обучения',
  tagline: 'Как и почему учатся модели: математика без страха, классическое ML, оценка качества, нейросети, внимание и трансформеры, генеративные модели, обучение с подкреплением и ответственный ИИ.',
  journeyLabel: 'Жизненный цикл модели',
  brand: '<svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><circle cx="5" cy="7" r="2.2" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="5" cy="19" r="2.2" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="13" cy="5" r="2.2" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="13" cy="13" r="2.2" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="13" cy="21" r="2.2" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="21" cy="13" r="2.6" fill="var(--accent)"/><path d="M7 7.6l4 4.6M7 7l4-1.6M7 18.4l4-4.6M7 19l4 1.6M15 6l4 5.5M15 13h3.4M15 20l4-5.5" fill="none" stroke="currentColor" stroke-width="1"/></svg>'
};

const num = v => parseFloat(String(v).replace(',', '.'));
const fmt = (x, d = 3) => Number.isFinite(x) ? (Math.abs(x) > 1e6 ? x.toExponential(2) : +x.toFixed(d)) + '' : '∞';

// точки для k-means: три облака
const KM_POINTS = [[18,22],[24,30],[30,20],[22,14],[34,28],[28,36],[70,24],[78,18],[82,30],[74,34],[66,16],[86,22],[44,72],[52,80],[40,84],[56,70],[48,64],[60,82]];
const KM_START = [[40,50],[60,50],[50,10]];

const ATT_TOKENS = ['Животное', 'не', 'перешло', 'улицу', 'потому', 'что', 'оно', 'устало'];
// условные веса внимания одной «головы» для каждого токена (сумма ≈ 1)
const ATT_WEIGHTS = {
  'оно':     [0.52, 0.03, 0.08, 0.14, 0.02, 0.03, 0.10, 0.08],
  'устало':  [0.33, 0.04, 0.05, 0.06, 0.03, 0.04, 0.30, 0.15],
  'перешло': [0.30, 0.18, 0.20, 0.25, 0.01, 0.01, 0.02, 0.03],
  'улицу':   [0.10, 0.04, 0.38, 0.40, 0.02, 0.02, 0.02, 0.02],
  'не':      [0.12, 0.40, 0.38, 0.05, 0.01, 0.01, 0.01, 0.02]
};

export const WIDGETS = {
  gradient(el){
    el.className = 'widget';
    const id = 'gd' + Math.random().toString(36).slice(2, 6);
    el.innerHTML = `<p class="small">Минимизируем L(w) = (w − 3)² градиентным спуском: w ← w − η·L′(w), где L′(w) = 2(w − 3).</p>
    <div class="row"><label class="small" for="${id}">Скорость обучения η</label><input type="text" id="${id}" value="0.1" style="font-family:var(--f-mono);max-width:90px" autocomplete="off">
    <label class="small" for="${id}w">Старт w₀</label><input type="text" id="${id}w" value="-4" style="font-family:var(--f-mono);max-width:90px" autocomplete="off"></div>
    <p class="small">Попробуйте η = 0.01 (медленно), 0.5 (сразу в минимум), 0.9 (колебания), 1.1 (расходится).</p><div class="out"></div>`;
    const lr = el.querySelector('#' + id), w0 = el.querySelector('#' + id + 'w'), out = el.querySelector('.out');
    const calc = () => {
      const eta = num(lr.value); let w = num(w0.value);
      if (!(eta > 0 && eta < 5) || !Number.isFinite(w)) { out.innerHTML = '<p class="small" style="color:var(--bad)">η — число от 0 до 5, w₀ — любое число.</p>'; return; }
      const rows = [], ws = [w];
      for (let i = 0; i < 12; i++) { const g = 2 * (w - 3); rows.push([i, w, (w - 3) ** 2, g]); w = w - eta * g; ws.push(w); if (!Number.isFinite(w) || Math.abs(w) > 1e9) break; }
      const W = 300, H = 120, X = v => 10 + (Math.max(-10, Math.min(16, v)) + 10) / 26 * (W - 20), Y = v => H - 10 - Math.min(v, 169) / 169 * (H - 20);
      const curve = Array.from({ length: 53 }, (_, i) => { const v = -10 + i * 0.5; return `${X(v)},${Y((v - 3) ** 2)}`; }).join(' ');
      const pts = ws.filter(Number.isFinite).map(v => `${X(v)},${Y((v - 3) ** 2)}`);
      const last = rows[rows.length - 1], diverged = !Number.isFinite(ws[ws.length - 1]) || Math.abs(ws[ws.length - 1] - 3) > Math.abs(ws[0] - 3);
      out.innerHTML = `<svg viewBox="0 0 ${W} ${H}" style="width:100%;max-width:520px;margin:10px 0;display:block" role="img" aria-label="Траектория градиентного спуска"><polyline points="${curve}" fill="none" stroke="var(--muted)" stroke-width="1.5"/><polyline points="${pts.join(' ')}" fill="none" stroke="var(--accent)" stroke-width="1.2" stroke-dasharray="3 2"/>${pts.map((p, i) => `<circle cx="${p.split(',')[0]}" cy="${p.split(',')[1]}" r="${i === 0 ? 4 : 2.8}" fill="var(--accent)"/>`).join('')}<line x1="${X(3)}" x2="${X(3)}" y1="${H - 10}" y2="${H - 4}" stroke="var(--ok)" stroke-width="2"/></svg>
      <div class="tbl"><table><tr><th>Шаг</th><th>w</th><th>L(w)</th><th>L′(w)</th></tr>${rows.map(r => `<tr><td>${r[0]}</td><td>${fmt(r[1])}</td><td>${fmt(r[2])}</td><td>${fmt(r[3])}</td></tr>`).join('')}</table></div>
      <p class="small">${diverged ? '<b style="color:var(--bad)">Расходится:</b> шаг слишком большой, каждый прыжок уводит дальше от минимума.' : Math.abs(last[1] - 3) < 0.01 ? '<b style="color:var(--ok)">Сошлось</b> к минимуму w = 3.' : 'Движемся к минимуму w = 3; при маленьком η нужно больше шагов.'}</p>`;
    };
    lr.addEventListener('input', calc); w0.addEventListener('input', calc); calc();
  },
  confusion(el){
    el.className = 'widget';
    const f = { tp: 40, fn: 10, fp: 20, tn: 930 };
    const lbl = { tp: 'TP — верно нашли', fn: 'FN — пропустили', fp: 'FP — ложная тревога', tn: 'TN — верно отклонили' };
    const id = 'cm' + Math.random().toString(36).slice(2, 6);
    el.innerHTML = `<div class="row">${Object.keys(f).map(k => `<label class="small" for="${id}${k}">${lbl[k]}</label><input type="text" id="${id}${k}" value="${f[k]}" style="font-family:var(--f-mono);max-width:80px" autocomplete="off">`).join('')}</div>
    <p class="small">Попробуйте модель «всегда нет»: TP = 0, FN = 50, FP = 0, TN = 950.</p><div class="out"></div>`;
    const out = el.querySelector('.out');
    const calc = () => {
      const v = {}; for (const k in f) v[k] = Math.max(0, Math.round(num(el.querySelector('#' + id + k).value) || 0));
      const all = v.tp + v.fn + v.fp + v.tn, p = v.tp / (v.tp + v.fp), r = v.tp / (v.tp + v.fn), f1 = 2 * p * r / (p + r);
      const pct = x => Number.isFinite(x) ? (x * 100).toFixed(1) + '%' : '—';
      out.innerHTML = `<div class="calc"><div><span>Accuracy (TP+TN)/всё</span><b>${pct((v.tp + v.tn) / all)}</b></div><div><span>Precision TP/(TP+FP)</span><b>${pct(p)}</b></div>
      <div><span>Recall TP/(TP+FN)</span><b>${pct(r)}</b></div><div><span>F1</span><b>${pct(f1)}</b></div><div><span>Доля положительных в данных</span><b>${pct((v.tp + v.fn) / all)}</b></div></div>
      ${(v.tp + v.tn) / all > 0.9 && !(r > 0.5) ? '<p class="small" style="color:var(--bad)">Высокая accuracy при низком recall: модель почти не находит положительные объекты. Классическая ловушка несбалансированных данных.</p>' : ''}`;
    };
    el.querySelectorAll('input').forEach(i => i.addEventListener('input', calc)); calc();
  },
  neuron(el){
    el.className = 'widget';
    const id = 'nr' + Math.random().toString(36).slice(2, 6);
    const fields = [['x1', 'x₁', '1'], ['x2', 'x₂', '2'], ['w1', 'w₁', '0.8'], ['w2', 'w₂', '-0.5'], ['b', 'b', '0.3']];
    let act = 'relu';
    const acts = { relu: ['ReLU', z => Math.max(0, z)], sigmoid: ['Sigmoid', z => 1 / (1 + Math.exp(-z))], tanh: ['Tanh', Math.tanh], linear: ['Линейная', z => z] };
    el.innerHTML = `<div class="row">${fields.map(([k, l, v]) => `<label class="small" for="${id}${k}">${l}</label><input type="text" id="${id}${k}" value="${v}" style="font-family:var(--f-mono);max-width:70px" autocomplete="off">`).join('')}</div><div class="row acts" style="margin-top:8px"></div><div class="out"></div>`;
    const out = el.querySelector('.out'), ab = el.querySelector('.acts');
    const calc = () => {
      ab.innerHTML = Object.entries(acts).map(([k, a]) => `<button class="btn${k === act ? '' : ' ghost'}" data-a="${k}">${a[0]}</button>`).join('');
      ab.querySelectorAll('button').forEach(b => b.onclick = () => { act = b.dataset.a; calc(); });
      const v = {}; for (const [k] of fields) v[k] = num(el.querySelector('#' + id + k).value);
      if (Object.values(v).some(x => !Number.isFinite(x))) { out.innerHTML = '<p class="small" style="color:var(--bad)">Введите числа.</p>'; return; }
      const z = v.w1 * v.x1 + v.w2 * v.x2 + v.b, a = acts[act][1](z);
      out.innerHTML = `<pre style="margin-top:10px"><code>z = w₁·x₁ + w₂·x₂ + b = ${fmt(v.w1)}·${fmt(v.x1)} + ${fmt(v.w2)}·${fmt(v.x2)} + ${fmt(v.b)} = ${fmt(z)}
a = ${acts[act][0]}(z) = ${fmt(a, 4)}</code></pre><p class="small">${act === 'relu' && z < 0 ? 'z &lt; 0 — ReLU «выключает» нейрон: выход 0 и нулевой градиент.' : act === 'sigmoid' ? 'Выход можно читать как вероятность.' : act === 'linear' ? 'Без нелинейности стопка таких нейронов остаётся линейной функцией.' : 'Нелинейная активация позволяет сети моделировать сложные зависимости.'}</p>`;
    };
    el.querySelectorAll('input').forEach(i => i.addEventListener('input', calc)); calc();
  },
  kmeans(el){
    el.className = 'widget';
    const colors = ['var(--accent)', 'var(--ok)', 'var(--bad)'];
    let cent = KM_START.map(c => [...c]), assign = null, step = 0, phase = 'assign';
    const dist = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
    const draw = (msg) => {
      const inertia = assign ? KM_POINTS.reduce((s, p, i) => s + dist(p, cent[assign[i]]), 0) : null;
      el.innerHTML = `<svg viewBox="0 0 100 100" style="width:100%;max-width:300px;display:block;margin:0 auto;border:1px solid var(--line);border-radius:8px" role="img" aria-label="Точки и центры кластеров">
      ${KM_POINTS.map((p, i) => `<circle cx="${p[0]}" cy="${100 - p[1]}" r="2.2" fill="${assign ? colors[assign[i]] : 'var(--muted)'}" opacity=".85"/>`).join('')}
      ${cent.map((c, k) => `<g><line x1="${c[0] - 3.5}" y1="${100 - c[1] - 3.5}" x2="${c[0] + 3.5}" y2="${100 - c[1] + 3.5}" stroke="${colors[k]}" stroke-width="1.6"/><line x1="${c[0] - 3.5}" y1="${100 - c[1] + 3.5}" x2="${c[0] + 3.5}" y2="${100 - c[1] - 3.5}" stroke="${colors[k]}" stroke-width="1.6"/></g>`).join('')}</svg>
      <p style="margin:10px 0"><b>Итерация ${step}.</b> ${esc(msg)}${inertia !== null ? ` Внутрикластерный разброс: ${Math.round(inertia)}.` : ''}</p>
      <div class="row"><button class="btn" data-s="1">${phase === 'assign' ? 'Отнести точки к центрам' : 'Пересчитать центры'}</button><button class="btn ghost" data-r="1">Сначала</button></div>`;
      el.querySelector('[data-s]').onclick = next; el.querySelector('[data-r]').onclick = reset;
    };
    const next = () => {
      if (phase === 'assign') {
        const prev = assign && assign.join();
        assign = KM_POINTS.map(p => cent.map(c => dist(p, c)).reduce((bi, d, i, a) => d < a[bi] ? i : bi, 0));
        phase = 'update'; step++;
        draw(prev === assign.join() ? 'Назначения не изменились — алгоритм сошёлся.' : 'Каждая точка окрашена в цвет ближайшего центра (крестик).');
      } else {
        cent = cent.map((c, k) => { const ps = KM_POINTS.filter((_, i) => assign[i] === k); return ps.length ? [ps.reduce((s, p) => s + p[0], 0) / ps.length, ps.reduce((s, p) => s + p[1], 0) / ps.length] : c; });
        phase = 'assign';
        draw('Каждый центр переместился в среднее своих точек.');
      }
    };
    const reset = () => { cent = KM_START.map(c => [...c]); assign = null; step = 0; phase = 'assign'; draw('Три центра выбраны в случайных местах.'); };
    reset();
  },
  attention(el){
    el.className = 'widget';
    let q = 'оно';
    const draw = () => {
      const w = ATT_WEIGHTS[q];
      el.innerHTML = `<p class="small">Выберите токен-запрос — увидите, на какие токены он «смотрит» (условные веса одной головы внимания после softmax).</p>
      <div class="row">${Object.keys(ATT_WEIGHTS).map(t => `<button class="btn${t === q ? '' : ' ghost'}" data-q="${esc(t)}">${esc(t)}</button>`).join('')}</div>
      <div style="display:flex;flex-direction:column;gap:4px;margin-top:12px;font:13px var(--f-mono)">${ATT_TOKENS.map((t, i) => `<div style="display:grid;grid-template-columns:90px minmax(0,1fr) 46px;gap:8px;align-items:center"><span style="${t === q ? 'font-weight:700' : ''}">${esc(t)}</span><span style="height:14px;border-radius:4px;background:var(--accent);opacity:.85;width:${Math.max(2, w[i] * 100)}%"></span><span class="small">${w[i].toFixed(2)}</span></div>`).join('')}</div>
      <p class="small" style="margin-top:10px">Новое представление «${esc(q)}» = Σ вес × value токена. ${q === 'оно' ? 'Местоимение «смотрит» прежде всего на «Животное» — так модель связывает ссылку с объектом.' : 'Сумма весов равна 1 — это распределение внимания по контексту.'}</p>`;
      el.querySelectorAll('[data-q]').forEach(b => b.onclick = () => { q = b.dataset.q; draw(); });
    };
    draw();
  }
};

export function viewTools(){
  return `<div class="crumbs"><a href="#/">главная</a> / инструменты</div><h1>Инструменты</h1>
  <p class="small" style="margin-top:8px">Практика на Python — <a href="../python/">курс Python</a>; приложения на LLM — <a href="../ai-agents/">курс «AI-агенты»</a>.</p>
  <h2 style="margin-top:26px">Градиентный спуск</h2><p class="small">Подробно — в модуле 2.</p><div data-widget="gradient"></div>
  <h2 style="margin-top:26px">k-means по шагам</h2><p class="small">Подробно — в модуле 5.</p><div data-widget="kmeans"></div>
  <h2 style="margin-top:26px">Матрица ошибок и метрики</h2><p class="small">Подробно — в модуле 6.</p><div data-widget="confusion"></div>
  <h2 style="margin-top:26px">Искусственный нейрон</h2><p class="small">Подробно — в модуле 7.</p><div data-widget="neuron"></div>
  <h2 style="margin-top:26px">Внимание</h2><p class="small">Подробно — в модуле 9.</p><div data-widget="attention"></div>`;
}

// ====== СКВОЗНОЙ СЦЕНАРИЙ ======
const JOURNEY = [
 { t:'Постановка задачи', l:'Задача', d:'Банк хочет заранее находить клиентов, которые уйдут. Это бинарная классификация; пропуск дороже ложной тревоги.', lesson:'0-4' },
 { t:'Данные', l:'Данные', d:'Выгрузка за два года: 50 тысяч клиентов, 40 признаков, 4% ушедших. Разведочный анализ: пропуски, выбросы, корреляции.', lesson:'1-4' },
 { t:'Признаки', l:'Данные', d:'One-hot для региона, стандартизация сумм, новые признаки: «дней с последней операции», «доля онлайн-платежей».', lesson:'2-2' },
 { t:'Разбиение', l:'Эксперимент', d:'Train — первые 20 месяцев, validation и test — последующие периоды. Клиенты не пересекаются между частями.', lesson:'6-3' },
 { t:'Baseline', l:'Модель', d:'Логистическая регрессия с L2: recall 0.55, precision 0.20. Это точка отсчёта.', code:'LogisticRegression(C=1.0, class_weight="balanced")', lesson:'3-3' },
 { t:'Сильная модель', l:'Модель', d:'Градиентный бустинг: recall 0.71 при той же precision. Гиперпараметры — по кросс-валидации, тест не трогаем.', lesson:'4-3' },
 { t:'Проверка на утечки', l:'Эксперимент', d:'Признак «дата закрытия счёта» давал 99% — это утечка, удалён. Препроцессинг перенесён в pipeline.', lesson:'6-4' },
 { t:'Порог и метрики', l:'Оценка', d:'Порог выбран вместе с бизнесом: удержанием занимаются 500 человек в месяц — этим определяется precision.', lesson:'6-1' },
 { t:'Объяснения', l:'Ответственность', d:'SHAP показывает менеджеру, почему клиент в зоне риска. Метрики проверены отдельно по возрастным группам.', lesson:'11-2' },
 { t:'Тест и запуск', l:'Запуск', d:'Однократная оценка на тесте подтверждает валидацию. Модель запущена, метрики и дрейф данных мониторятся.', lesson:'6-4' },
 { t:'Нейросеть?', l:'Развитие', d:'Добавились тексты обращений в поддержку: их эмбеддинги от предобученного трансформера стали новыми признаками.', lesson:'8-4' }
];
let journeyStep = 0;
export function viewJourney(){
  return `<div class="crumbs"><a href="#/">главная</a> / сквозной сценарий</div><h1>Жизненный цикл модели</h1>
  <p style="margin:10px 0 20px;max-width:75ch">Прогноз оттока клиентов от постановки задачи до запуска: где в реальном проекте встречается каждая идея курса. Каждый шаг ведёт в урок, где он разобран подробно.</p>
  <div class="journey"><ol class="jlist" id="jlist"></ol><div class="jcard" id="jcard"></div></div>`;
}
export function mountJourney(){
  const draw = () => {
    $('#jlist').innerHTML = JOURNEY.map((s, i) => `<li><button class="${i === journeyStep ? 'on' : ''} ${i < journeyStep ? 'past' : ''}" data-i="${i}"><span class="port">${String(i + 1).padStart(2, '0')}</span><span>${esc(s.t)}</span><span class="tag muted">${esc(s.l)}</span></button></li>`).join('');
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
  <h2 style="margin-top:26px">Ключевые формулы</h2>${t(['Что','Формула'], [['Линейная модель','ŷ = w·x + b'],['Сигмоида','σ(z) = 1 / (1 + e^(−z))'],['Softmax','pᵢ = e^zᵢ / Σ e^zⱼ'],['MSE','(1/n) Σ (y − ŷ)²'],['Кросс-энтропия','−Σ y·log p'],['Градиентный спуск','w ← w − η·∇L(w)'],['Байес','P(A|B) = P(B|A)·P(A) / P(B)'],['Внимание','softmax(Q·Kᵀ / √d)·V'],['L1 / L2','λ·Σ|w| / λ·Σw²']])}
  <h2 style="margin-top:26px">Метрики</h2>${t(['Метрика','Формула','Когда'], [['Accuracy','(TP+TN)/всё','Классы сбалансированы'],['Precision','TP/(TP+FP)','Дорога ложная тревога'],['Recall','TP/(TP+FN)','Дорог пропуск'],['F1','2PR/(P+R)','Баланс P и R'],['ROC-AUC','площадь под ROC','Сравнение моделей без порога'],['MAE','среднее |y−ŷ|','Ошибка в единицах задачи'],['RMSE','√ среднее (y−ŷ)²','Большие ошибки важнее'],['R²','1 − SSE/SST','Доля объяснённой дисперсии']])}
  <h2 style="margin-top:26px">Выбор модели</h2>${t(['Данные и цель','С чего начать'], [['Таблицы, нужна точность','Градиентный бустинг'],['Нужна объяснимость','Линейная / логистическая регрессия, неглубокое дерево'],['Изображения','Предобученная CNN или ViT + дообучение'],['Текст','Предобученный трансформер: эмбеддинги или дообучение'],['Нет меток','k-means, DBSCAN, PCA, UMAP'],['Аномалии','Isolation Forest, автоэнкодер'],['Последовательные решения','Обучение с подкреплением']])}
  <h2 style="margin-top:26px">Диагностика обучения</h2>${t(['Симптом','Вероятная причина','Что делать'], [['Ошибка высокая и на train, и на val','Недообучение','Сложнее модель, лучше признаки, дольше учить'],['Train низкая, val высокая','Переобучение','Данные, регуляризация, ранняя остановка'],['Потери растут до NaN','Большой learning rate','Уменьшить lr, отсечение градиентов'],['Потери стоят на месте','Маленький lr или баг','Проверить переобучение на 10 примерах'],['Подозрительно высокое качество','Утечка данных','Проверить признаки и разбиение'],['Качество падает после запуска','Дрейф данных','Мониторинг, переобучение']])}
  <h2 style="margin-top:26px">Архитектуры</h2>${t(['Архитектура','Ключевая идея','Где'], [['Полносвязная сеть','Слои W·x + b и активации','Табличные признаки, головы моделей'],['CNN','Свёртки с общими весами','Изображения'],['RNN / LSTM','Скрытое состояние по шагам','Временные ряды, старые NLP-системы'],['Трансформер','Внимание по всем позициям','Текст, код, зрение, мультимодальность'],['Автоэнкодер / VAE','Сжатие в латентное пространство','Сжатие, аномалии, генерация'],['GAN','Генератор против дискриминатора','Генерация изображений'],['Диффузия','Пошаговое удаление шума','Генерация изображений, видео, звука']])}`;
}
