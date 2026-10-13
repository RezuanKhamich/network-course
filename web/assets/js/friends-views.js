// ====== ДРУЗЬЯ: код дружбы, заявки, рейтинг, лента, профиль друга ======
import { Store, $, esc, toast, plural } from './storage.js';
import { COURSES, findCourse } from './courses.js';
import { Game, ACHIEVEMENTS, SITE_ROOT, courseProgress, heatmapHtml } from './game.js';
import { Account, api } from './sync.js';

const PENDING_KEY = 'dev-courses-friend-code';
let period = 'week', confirmRemove = false, confirmRotate = false;

// Счётчик входящих заявок для значка в меню
export const Social = {
  incoming: 0,
  async refresh(){
    if (Account.status !== 'user'){ this.incoming = 0; return; }
    const r = await api('GET', '/profile');
    if (r.ok) this.incoming = r.data.incomingRequests;
  }
};

const fmtCode = c => c ? c.slice(0, 4) + '-' + c.slice(4) : '';
const inviteLink = code => `${location.origin}${SITE_ROOT}#/friends/add/${code}`;
const ava = (a, cls = '') => `<span class="fr-ava ${cls}">${esc(a || '🦉')}</span>`;
const courseTitle = id => (findCourse(id) || { title: id }).title;
function ago(iso){
  if (!iso) return 'пока без активности';
  const days = Math.floor((Date.now() - new Date(iso)) / 864e5);
  return days <= 0 ? 'занимался сегодня' : days === 1 ? 'вчера' : `${days} ${plural(days, 'день', 'дня', 'дней')} назад`;
}
const crumbs = last => `<div class="crumbs"><a href="#/">главная</a> / ${last}</div>`;

function copy(text, input){
  // navigator.clipboard работает только по HTTPS; по HTTP — через выделение в поле
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text).then(() => toast('Скопировано'));
  input.value = text; input.select();
  try { document.execCommand('copy'); toast('Скопировано'); } catch(e){ toast('Скопируйте вручную: Ctrl+C'); }
}
function formError(f, r){
  const box = f.querySelector('.form-msg'); box.className = 'form-msg err'; box.textContent = r.data.message;
}

// ---- #/friends/add/КОД: код запоминаем, адрес чистим, дальше обычная страница с заполненной формой ----
export function takeInviteFromHash(){
  const m = (location.hash || '').match(/^#\/friends\/add\/([A-Za-z0-9-]{4,20})$/);
  if (!m) return;
  try { sessionStorage.setItem(PENDING_KEY, m[1]); } catch(e){ /* приватный режим — просто не запомним */ }
  history.replaceState(null, '', '#/friends');
}
const pendingCode = () => { try { return sessionStorage.getItem(PENDING_KEY) || ''; } catch(e){ return ''; } };
const clearPending = () => { try { sessionStorage.removeItem(PENDING_KEY); } catch(e){ /* нечего чистить */ } };

// ---- главная страница друзей ----
export async function mountFriends(view, render){
  if (Account.status === 'loading'){ view.innerHTML = crumbs('друзья') + '<h1>Друзья</h1><p class="small">Загрузка…</p>'; return; }
  if (Account.status !== 'user'){
    view.innerHTML = `${crumbs('друзья')}<h1>Друзья</h1><div class="note">Соревноваться с друзьями можно после входа: рейтинг и лента строятся по прогрессу, сохранённому на сервере. <a href="#/account">Войти или зарегистрироваться</a>${pendingCode() ? '. Код приглашения запомнили — после входа он будет подставлен.' : ''}</div>`;
    return;
  }
  view.innerHTML = crumbs('друзья') + '<h1>Друзья</h1><p class="small">Загрузка…</p>';
  const profile = await api('GET', '/profile');
  if (!profile.ok){ view.innerHTML = crumbs('друзья') + `<h1>Друзья</h1><div class="note warn">${esc(profile.data.message)}</div>`; return; }
  const p = profile.data;
  if (!p.nickname) return mountNickname(view, render);

  const [fr, rating, feed] = await Promise.all([api('GET', '/friends'), api('GET', '/friends/rating?period=' + period), api('GET', '/friends/feed')]);
  if (!fr.ok || !rating.ok || !feed.ok){ view.innerHTML = crumbs('друзья') + `<h1>Друзья</h1><div class="note warn">${esc((fr.ok ? rating.ok ? feed : rating : fr).data.message)}</div>`; return; }
  if (!location.hash.startsWith('#/friends')) return;
  Social.incoming = fr.data.incoming.length;
  const { friends, incoming, outgoing } = fr.data;

  view.innerHTML = `${crumbs('друзья')}<h1>Друзья</h1>
  <div class="fr-top">
   <div class="card"><h2 class="fr-h">Ваш код дружбы</h2>
    <div class="fr-code">${esc(fmtCode(p.friendCode))}</div>
    <p class="small">Отправьте код или ссылку другу. Он пришлёт заявку, вы её подтвердите.</p>
    <input class="fr-copybox" id="copyBox" readonly aria-label="Ссылка-приглашение" value="${esc(inviteLink(p.friendCode))}">
    <div class="row"><button class="btn small-btn" id="copyLink">Скопировать ссылку</button><button class="btn ghost small-btn" id="copyCode">Скопировать код</button>
     ${confirmRotate ? '<span class="small">Старый код перестанет работать.</span><button class="btn danger small-btn" id="rotateYes">Выпустить новый</button><button class="btn ghost small-btn" id="rotateNo">Отмена</button>' : '<button class="btn ghost small-btn" id="rotate">Новый код</button>'}</div>
   </div>
   <div class="card"><h2 class="fr-h">Добавить друга</h2>
    <form id="addForm" class="auth-form"><label class="fld"><span>Код друга</span><input type="text" name="code" required maxlength="20" autocomplete="off" placeholder="K7Q2-M9XD" value="${esc(pendingCode())}"></label><div class="form-msg" role="alert"></div>
     <div class="row"><button class="btn" type="submit">Отправить заявку</button></div></form>
    ${incoming.length ? `<h3 class="fr-sub">Заявки вам</h3><ul class="fr-list">${incoming.map(u => `<li>${ava(u.avatar)}<b>${esc(u.nickname)}</b><span class="row"><button class="btn small-btn" data-accept="${u.id}">Принять</button><button class="btn ghost small-btn" data-decline="${u.id}">Отклонить</button></span></li>`).join('')}</ul>` : ''}
    ${outgoing.length ? `<h3 class="fr-sub">Ждут ответа</h3><ul class="fr-list">${outgoing.map(u => `<li>${ava(u.avatar)}<b>${esc(u.nickname)}</b><button class="btn ghost small-btn" data-cancel="${u.id}">Отменить</button></li>`).join('')}</ul>` : ''}
   </div>
  </div>

  <h2 style="margin:28px 0 10px">Рейтинг</h2>
  <div class="auth-tabs" role="tablist">${[['week', 'Эта неделя'], ['all', 'Всё время']].map(([k, l]) => `<button role="tab" data-period="${k}" aria-selected="${period === k}">${l}</button>`).join('')}</div>
  <div class="card fr-rating">${rating.data.rows.length > 1 || friends.length
    ? `<ol class="fr-rows">${rating.data.rows.map(r => `<li class="${r.me ? 'me' : ''}"><span class="fr-place">${r.place <= 3 ? ['🥇', '🥈', '🥉'][r.place - 1] : r.place}</span>${ava(r.avatar)}<span class="fr-name">${r.me ? '<a href="#/profile">' : `<a href="#/friends/u/${r.id}">`}${esc(r.nickname)}</a>${r.me ? ' <span class="small">(вы' + (r.hidden ? ', скрыты от друзей' : '') + ')</span>' : ''}<small>Ур. ${r.level} · 🔥${r.streak}</small></span><b class="fr-xp">${r.xp} XP</b></li>`).join('')}</ol>`
    : '<p class="small">Добавьте друзей — здесь появится рейтинг.</p>'}
   <p class="small fr-note">${period === 'week' ? 'Неделя начинается в понедельник по Москве.' : 'За всё время.'} В рейтинг идёт XP за уроки, верные ответы самопроверки, тесты, экзамен и сценарий — по прогрессу, сохранённому на сервере. Прогресс, набранный до входа в аккаунт, идёт только в общий зачёт; за день в недельный зачёт идёт не больше 1500 XP.</p></div>

  <div class="fr-cols">
   <section><h2 style="margin:28px 0 10px">Друзья · ${friends.length}</h2>
    ${friends.length ? `<div class="fr-cards">${friends.map(f => `<a class="card fr-card" href="#/friends/u/${f.id}">${ava(f.avatar, 'big')}<span><b>${esc(f.nickname)}</b><small>Ур. ${f.level} · 🔥${f.streak} · ${f.xpWeek} XP за неделю</small><small>${ago(f.lastActiveAt)}</small></span></a>`).join('')}</div>` : '<p class="small">Пока никого. Поделитесь своим кодом.</p>'}
   </section>
   <section><h2 style="margin:28px 0 10px">Лента</h2>
    ${feed.data.items.length ? `<ul class="fr-feed">${feed.data.items.map(feedItem).join('')}</ul>` : '<p class="small">За последние две недели у друзей ничего нового.</p>'}
   </section>
  </div>

  <h2 style="margin:28px 0 10px">Приватность</h2>
  <p class="small">Ваш ник: <b>${esc(p.nickname)}</b>. Друзья видят ник, аватар, уровень, прогресс по курсам и активность — но не ваш email.</p>
  <label class="opt" style="max-width:560px"><input type="checkbox" id="showRating" ${p.hideFromRating ? '' : 'checked'}><span>Показывать меня в рейтинге друзей</span></label>
  <label class="opt" style="max-width:560px"><input type="checkbox" id="showActivity" ${p.hideActivity ? '' : 'checked'}><span>Показывать мою активность в ленте друзей</span></label>`;

  const box = $('#copyBox');
  $('#copyLink').onclick = () => copy(inviteLink(p.friendCode), box);
  $('#copyCode').onclick = () => copy(fmtCode(p.friendCode), box);
  const on = (id, fn) => { const e = document.getElementById(id); if (e) e.onclick = fn; };
  on('rotate', () => { confirmRotate = true; render(); });
  on('rotateNo', () => { confirmRotate = false; render(); });
  on('rotateYes', async () => { confirmRotate = false; const r = await api('POST', '/profile/friend-code'); toast(r.ok ? 'Новый код выпущен' : r.data.message); render(); });

  const f = $('#addForm');
  f.onsubmit = async e => {
    e.preventDefault();
    const btn = f.querySelector('button'); btn.disabled = true;
    const r = await api('POST', '/friends/requests', { code: f.code.value });
    btn.disabled = false;
    if (!r.ok) return formError(f, r);
    clearPending();
    toast(r.data.status === 'friends' ? `${r.data.user.nickname} теперь у вас в друзьях` : `Заявка отправлена: ${r.data.user.nickname}`);
    render();
  };
  if (pendingCode()) f.code.focus();

  const act = async (sel, method, path, msg) => document.querySelectorAll(`[${sel}]`).forEach(b => b.onclick = async () => {
    b.disabled = true;
    const r = await api(method, path(b.getAttribute(sel)));
    if (!r.ok) toast(r.data.message); else if (msg) toast(msg);
    await Social.refresh(); render();
  });
  act('data-accept', 'POST', id => `/friends/requests/${id}/accept`, 'Теперь вы друзья');
  act('data-decline', 'POST', id => `/friends/requests/${id}/decline`);
  act('data-cancel', 'DELETE', id => `/friends/requests/${id}`);
  document.querySelectorAll('[data-period]').forEach(b => b.onclick = () => { period = b.dataset.period; render(); });

  const privacy = (id, field) => { const el = document.getElementById(id); el.onchange = async () => {
    const r = await api('PATCH', '/profile', { [field]: !el.checked });
    if (!r.ok){ el.checked = !el.checked; toast(r.data.message); }
  }; };
  privacy('showRating', 'hideFromRating');
  privacy('showActivity', 'hideActivity');
}

function feedItem(i){
  const who = `${ava(i.user.avatar)}<a href="#/friends/u/${i.user.id}"><b>${esc(i.user.nickname)}</b></a>`;
  let what;
  if (i.type === 'study'){
    const parts = [];
    if (i.lessons) parts.push(`${i.lessons} ${plural(i.lessons, 'урок', 'урока', 'уроков')}`);
    if (i.checks) parts.push(`${i.checks} ${plural(i.checks, 'верный ответ', 'верных ответа', 'верных ответов')}`);
    what = `${parts.join(' и ')} в курсе «${esc(courseTitle(i.course))}»`;
  } else if (i.type === 'test') what = `тест «${esc(i.module || '')}» — ${i.score}%${i.perfect ? ' 💯' : ''}`;
  else if (i.type === 'exam') what = `финальный экзамен курса «${esc(courseTitle(i.course))}» — ${i.score}% 🎓`;
  else if (i.type === 'journey') what = `сквозной сценарий курса «${esc(courseTitle(i.course))}» пройден до конца`;
  else if (i.type === 'achievement'){
    const a = ACHIEVEMENTS.find(x => x.id === i.achievement);
    if (!a) return '';
    what = `достижение ${a.icon} «${esc(a.title)}»`;
  }
  return `<li>${who}<span>${what}</span><small>${new Date(i.at).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</small></li>`;
}

function mountNickname(view, render){
  view.innerHTML = `${crumbs('друзья')}<h1>Друзья</h1>
  <div class="card auth-card"><form id="nickForm" class="auth-form">
   <p>Придумайте ник — его увидят друзья вместо вашего email.</p>
   <label class="fld"><span>Ник</span><input type="text" name="nickname" required minlength="3" maxlength="20" pattern="[A-Za-z0-9_]{3,20}" autocomplete="nickname" value="${esc((Store.state.profile.name || '').replace(/[^A-Za-z0-9_]/g, '').slice(0, 20))}"><small>3–20 символов: латинские буквы, цифры и _</small></label>
   <div class="form-msg" role="alert"></div><div class="row"><button class="btn" type="submit">Сохранить</button></div></form></div>`;
  const f = $('#nickForm');
  f.onsubmit = async e => {
    e.preventDefault();
    const r = await api('PATCH', '/profile', { nickname: f.nickname.value.trim() });
    if (!r.ok) return formError(f, r);
    render();
  };
}

// ---- #/friends/u/ID: профиль друга рядом с вашим прогрессом ----
export async function mountFriend(view, render, id){
  view.innerHTML = crumbs('<a href="#/friends">друзья</a> / профиль') + '<p class="small" style="margin-top:12px">Загрузка…</p>';
  const r = await api('GET', '/friends/' + encodeURIComponent(id));
  if (!location.hash.startsWith('#/friends/u/')) return;
  if (!r.ok){ view.innerHTML = crumbs('<a href="#/friends">друзья</a> / профиль') + `<div class="note warn">${esc(r.data.message)}</div>`; return; }
  const f = r.data;
  const mine = new Set(Object.keys(Store.state.game.achievements));
  const onlyThem = ACHIEVEMENTS.filter(a => f.achievements.includes(a.id) && !mine.has(a.id));
  view.innerHTML = `${crumbs('<a href="#/friends">друзья</a> / ' + esc(f.nickname))}
  <div class="profile-head" style="margin-top:12px">${ava(f.avatar, 'huge')}<div style="min-width:0;flex:1"><h1>${esc(f.nickname)}</h1><div class="small">Уровень ${f.level} · ${ago(f.lastActiveAt)}</div></div></div>
  <div class="kpis">
   <div class="kpi"><b>${f.xpWeek}</b><span>XP за неделю</span></div>
   <div class="kpi"><b>${f.xpTotal}</b><span>XP за всё время</span></div>
   <div class="kpi"><b>🔥 ${f.streak}</b><span>дней подряд</span></div>
   <div class="kpi"><b>${f.achievements.length}</b><span>достижений</span></div>
  </div>
  <h2>Курсы: ${esc(f.nickname)} и вы</h2>
  <div class="tbl"><table><tr><th>Курс</th><th>${esc(f.nickname)}</th><th>Вы</th></tr>${COURSES.map(c => {
    const t = f.courses[c.id] || { lessons: 0, lessonsTotal: c.lessons, tests: 0, modulesTotal: c.modules };
    const m = courseProgress(c.id);
    return `<tr><td>${c.icon} ${esc(c.title)}</td><td>${t.lessons}/${t.lessonsTotal} уроков · ${t.tests}/${t.modulesTotal} тестов${t.exam ? ` · 🎓 ${t.exam}%` : ''}</td><td>${m.done}/${m.lessons} уроков · ${m.passed}/${m.modules} тестов${m.examPassed ? ' · 🎓' : ''}</td></tr>`;
  }).join('')}</table></div>
  <h2 style="margin-top:28px">Активность</h2><p class="small">XP по дням за последний год.</p>${heatmapHtml(f.days, Game.goal())}
  ${onlyThem.length ? `<h2 style="margin-top:28px">Есть у ${esc(f.nickname)}, нет у вас</h2><div class="fr-achs">${onlyThem.map(a => `<span class="fr-ach" title="${esc(a.desc)}">${a.icon} ${esc(a.title)}</span>`).join('')}</div>` : ''}
  <h2 style="margin-top:28px">Дружба</h2>
  ${confirmRemove ? `<div class="confirm">Удалить ${esc(f.nickname)} из друзей? Друг не получит уведомления, но вы пропадёте из рейтингов друг друга.<div class="row" style="margin-top:10px"><button class="btn danger" id="rmYes">Удалить</button><button class="btn ghost" id="rmNo">Отмена</button></div></div>` : '<button class="btn danger" id="rm">Удалить из друзей</button>'}`;
  const hw = view.querySelector('.heat-wrap'); if (hw) hw.scrollLeft = hw.scrollWidth;
  const on = (bid, fn) => { const e = document.getElementById(bid); if (e) e.onclick = fn; };
  on('rm', () => { confirmRemove = true; render(); });
  on('rmNo', () => { confirmRemove = false; render(); });
  on('rmYes', async () => {
    confirmRemove = false;
    const d = await api('DELETE', '/friends/' + encodeURIComponent(id));
    toast(d.ok ? `${f.nickname} удалён из друзей` : d.data.message);
    location.hash = '#/friends';
  });
}
