// ====== ТЕРМИНЫ В ТЕКСТЕ УРОКА ======
// Первое упоминание термина из глоссария курса подчёркивается; по наведению или нажатию — короткое
// определение и ссылка на урок, где термин разобран. Текст уроков не меняется: разметка добавляется при показе.
import { esc } from './storage.js';

const SKIP = 'pre, code, a, button, h1, h2, h3, h4, .widget, .term, kbd, script, style';
const VOWEL_END = /[аяоеёиыйьуюэ]$/i;

// «MAC-адрес» должен находить «MAC-адреса», «MAC-адресом»: у русских слов от 4 букв
// отбрасываем окончание и разрешаем до 4 букв после основы
function pattern(term){
  const base = term.split(' (')[0].trim();
  const src = base.split(/(\s+)/).map(part => {
    if (/^\s+$/.test(part)) return '\\s+';
    const e = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (/[а-яё]$/i.test(part) && part.length >= 4) return e.replace(VOWEL_END, '') + '[а-яё]{0,4}';
    return e;
  }).join('');
  // аббревиатуры (ARP, TTL) — с учётом регистра, чтобы не цеплять случайные совпадения
  const flags = /^[A-Z0-9-]{2,6}$/.test(base) ? 'u' : 'iu';
  return new RegExp(`(?<![\\p{L}\\p{N}_])(?:${src})(?![\\p{L}\\p{N}_])`, flags);
}

let index = null;
function build(glossary){
  index = glossary
    .map(([term, def, lesson], i) => ({ term, def, lesson, i, re: pattern(term) }))
    .sort((a, b) => b.term.length - a.term.length); // длинные раньше: «MAC-адрес» важнее «MAC»
}

function textNodes(root){
  const out = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: n => n.nodeValue.trim() && !n.parentElement.closest(SKIP) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
  });
  while (w.nextNode()) out.push(w.currentNode);
  return out;
}

// Оборачивает первое упоминание каждого термина в кнопку-подсказку
export function markTerms(root, lessonId, glossary){
  if (!root || !glossary || !glossary.length) return;
  if (!index) build(glossary);
  const seen = new Set();
  for (const t of index){
    if (t.lesson === lessonId || seen.has(t.term)) continue; // в своём уроке термин и так объясняется
    for (const node of textNodes(root)){
      const m = t.re.exec(node.nodeValue);
      if (!m) continue;
      const after = node.splitText(m.index);
      after.splitText(m[0].length);
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'term'; b.dataset.t = t.i;
      b.textContent = after.nodeValue;
      after.replaceWith(b);
      seen.add(t.term);
      break;
    }
  }
}

let pop = null, anchor = null;
function hide(){ if (pop) pop.hidden = true; if (anchor) anchor.setAttribute('aria-expanded', 'false'); anchor = null; }

// Подписка один раз на страницу: подсказки показываются для любых .term в документе
export function initTerms({ glossary, findLesson, lessonIndex, currentLesson }){
  if (pop) return;
  pop = document.createElement('div');
  pop.className = 'term-pop'; pop.hidden = true; pop.setAttribute('role', 'tooltip'); pop.id = 'termPop';
  document.body.appendChild(pop);
  const show = b => {
    const [term, def, lesson] = glossary[+b.dataset.t];
    const L = findLesson(lesson), here = currentLesson();
    const ahead = L && here && lessonIndex(lesson) > lessonIndex(here);
    const num = lesson.replace('-', '.');
    pop.innerHTML = `<b>${esc(term)}</b> — ${esc(def.charAt(0).toLowerCase() + def.slice(1))}${L ? `<a href="#/l/${lesson}">${ahead ? 'Разберём' : 'Подробно'} в уроке ${num} «${esc(L.title)}» →</a>` : ''}`;
    pop.hidden = false;
    anchor = b; b.setAttribute('aria-expanded', 'true'); b.setAttribute('aria-describedby', 'termPop');
    const r = b.getBoundingClientRect(), w = Math.min(320, innerWidth - 24);
    pop.style.width = w + 'px';
    pop.style.left = Math.max(12, Math.min(r.left, innerWidth - w - 12)) + scrollX + 'px';
    const below = r.bottom + 8, h = pop.offsetHeight;
    pop.style.top = (below + h > innerHeight && r.top - h - 8 > 0 ? r.top - h - 8 : below) + scrollY + 'px';
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('.term');
    if (b){ if (anchor === b) hide(); else show(b); return; }
    if (!e.target.closest('.term-pop') || e.target.closest('a')) hide();
  });
  const hover = matchMedia('(hover: hover)');
  // между термином и подсказкой зазор: прячем с задержкой, чтобы курсор успел дойти до ссылки в подсказке
  let hideTimer = 0;
  document.addEventListener('mouseover', e => {
    if (!hover.matches) return;
    const b = e.target.closest('.term');
    if (b || e.target.closest('.term-pop')) clearTimeout(hideTimer);
    if (b && anchor !== b) show(b);
  });
  document.addEventListener('mouseout', e => {
    if (!hover.matches || !anchor || !e.target.closest('.term, .term-pop')) return;
    const to = e.relatedTarget;
    if (to && (to.closest('.term-pop') || to.closest('.term') === anchor)) return;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, 300);
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
  addEventListener('hashchange', hide);
}
