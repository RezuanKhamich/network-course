// ====== СТРАНИЦЫ АККАУНТА НА ГЛАВНОЙ ======
import { $, esc, toast, fmtTime } from './storage.js';
import { Account, api } from './sync.js';

let tab = 'login', sentTo = null, notice = null, confirmDelete = false, resetToken = null;

// Ссылки из писем несут токен в адресе: забираем его и сразу убираем из адресной строки и истории
export function takeTokenFromHash(){
  const [, , kind, token] = (location.hash || '').split('/');
  if (!token || (kind !== 'verify' && kind !== 'reset')) return null;
  history.replaceState(null, '', '#/auth/' + kind);
  return { kind, token };
}

function field(label, attrs, hint = ''){
  return `<label class="fld"><span>${label}</span><input ${attrs}>${hint ? `<small>${hint}</small>` : ''}</label>`;
}
const EMAIL = field('Email', 'type="email" name="email" autocomplete="email" required maxlength="254"');
const msg = '<div class="form-msg" role="alert" aria-live="polite"></div>';

function bindForm(id, handler){
  const f = document.getElementById(id); if (!f) return;
  f.onsubmit = async e => {
    e.preventDefault();
    f.querySelectorAll('[aria-invalid]').forEach(x => x.removeAttribute('aria-invalid'));
    const box = f.querySelector('.form-msg'); box.className = 'form-msg'; box.textContent = '';
    const btn = f.querySelector('button[type=submit]'); btn.disabled = true;
    try { await handler(Object.fromEntries(new FormData(f)), f); }
    finally { if (btn.isConnected) btn.disabled = false; }
  };
}
function showError(f, r){
  const el = r.data.field && f.querySelector(`[name="${r.data.field}"]`);
  if (el){ el.setAttribute('aria-invalid', 'true'); el.focus(); }
  const box = f.querySelector('.form-msg'); box.className = 'form-msg err'; box.textContent = r.data.message;
}
const crumbs = last => `<div class="crumbs"><a href="#/">главная</a> / ${last}</div>`;
const noticeHtml = () => { const n = notice; notice = null; return n ? `<div class="note">${esc(n)}</div>` : ''; };

// ---- #/account ----
export function viewAccount(){
  if (Account.status === 'loading') return crumbs('аккаунт') + '<h1>Аккаунт</h1><p class="small">Проверяем вход…</p>';
  if (Account.status === 'user') return viewSignedIn();
  const offline = Account.status === 'offline' ? '<div class="note warn">Сервер аккаунтов сейчас недоступен. Прогресс продолжает сохраняться в браузере — войти можно будет позже.</div>' : '';
  const expired = Account.error ? `<div class="note warn">${esc(Account.error)}</div>` : '';
  let body;
  if (tab === 'login'){
    body = `<form id="loginForm" class="auth-form">${EMAIL}${field('Пароль', 'type="password" name="password" autocomplete="current-password" required maxlength="128"')}${msg}
      <div class="row"><button class="btn" type="submit">Войти</button><a href="#/auth/forgot">Забыли пароль?</a></div></form>`;
  } else if (sentTo){
    body = `<div class="auth-sent"><b>Проверьте почту</b><p>Мы отправили ссылку для подтверждения на <b>${esc(sentTo)}</b>. Она действует 24 часа. Письмо может попасть в «Спам».</p><button class="btn ghost small-btn" id="again">Указать другой адрес</button></div>`;
  } else {
    body = `<form id="regForm" class="auth-form">${EMAIL}${field('Пароль', 'type="password" name="password" autocomplete="new-password" required minlength="10" maxlength="128"', 'Не короче 10 символов. Пароли из известных утечек не принимаются.')}
      <label class="opt"><input type="checkbox" name="consent" required><span>Я даю согласие на <a href="#/privacy" target="_blank">обработку персональных данных</a></span></label>${msg}
      <div class="row"><button class="btn" type="submit">Зарегистрироваться</button></div></form>`;
  }
  return `${crumbs('аккаунт')}<h1>Вход и регистрация</h1>${noticeHtml()}${offline}${expired}
  <p class="small" style="margin-top:8px">С аккаунтом прогресс, XP и достижения хранятся на сервере и доступны на любом устройстве. Без входа всё работает как раньше — данные остаются в этом браузере.</p>
  <div class="auth-tabs" role="tablist"><button role="tab" data-tab="login" aria-selected="${tab === 'login'}">Вход</button><button role="tab" data-tab="register" aria-selected="${tab === 'register'}">Регистрация</button></div>
  <div class="card auth-card">${body}</div>
  <p class="small">Прогресс, который уже есть в этом браузере, не пропадёт: после входа он объединится с прогрессом аккаунта.</p>`;
}

function viewSignedIn(){
  const u = Account.user;
  const syncText = { saving: 'идёт…', error: 'ошибка', ok: 'актуально' + (Account.lastSync ? ', ' + fmtTime(Account.lastSync) : '') }[Account.sync] || '—';
  return `${crumbs('аккаунт')}<h1>Аккаунт</h1>${noticeHtml()}
  <div class="card acc-card"><div><small>Email</small><b>${esc(u.email)}</b></div><div><small>Синхронизация прогресса</small><b>${syncText}</b></div><button class="btn ghost small-btn" id="syncNow">Синхронизировать сейчас</button></div>
  ${Account.error ? `<div class="note warn">${esc(Account.error)}</div>` : ''}
  <h2 style="margin-top:28px">Смена пароля</h2>
  <form id="pwForm" class="auth-form">${field('Текущий пароль', 'type="password" name="currentPassword" autocomplete="current-password" required maxlength="128"')}${field('Новый пароль', 'type="password" name="newPassword" autocomplete="new-password" required minlength="10" maxlength="128"', 'Не короче 10 символов. На других устройствах потребуется войти заново.')}${msg}
   <div class="row"><button class="btn" type="submit">Сменить пароль</button></div></form>
  <h2 style="margin-top:28px">Выход</h2>
  <p class="small">После выхода прогресс удаляется из этого браузера и остаётся в аккаунте.</p>
  <div class="row"><button class="btn ghost" id="logoutBtn">Выйти</button></div><div class="form-msg" id="logoutMsg" role="alert"></div>
  <h2 style="margin-top:28px">Удаление аккаунта</h2>
  <p class="small">Аккаунт и прогресс на сервере удаляются без возможности восстановления. В этом браузере прогресс останется.</p>
  ${confirmDelete ? `<form id="delForm" class="auth-form confirm">${field('Введите пароль для подтверждения', 'type="password" name="password" autocomplete="current-password" required maxlength="128"')}${msg}
   <div class="row"><button class="btn danger" type="submit">Удалить навсегда</button><button class="btn ghost" type="button" id="delNo">Отмена</button></div></form>`
    : '<button class="btn danger" id="delBtn">Удалить аккаунт</button>'}`;
}

export function mountAccount(render){
  document.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; render(); });
  const again = $('#again'); if (again) again.onclick = () => { sentTo = null; render(); };
  bindForm('loginForm', async (d, f) => {
    const r = await api('POST', '/auth/login', { email: d.email.trim(), password: d.password });
    if (!r.ok) return showError(f, r);
    await Account.signedIn(r.data.user);
    notice = 'Вы вошли. Прогресс этого браузера объединён с аккаунтом.';
    render();
  });
  bindForm('regForm', async (d, f) => {
    const email = d.email.trim();
    const r = await api('POST', '/auth/register', { email, password: d.password, consent: d.consent === 'on' });
    if (!r.ok) return showError(f, r);
    sentTo = email; render();
  });
  const sn = $('#syncNow'); if (sn) sn.onclick = async () => { await Account.pull(); render(); };
  bindForm('pwForm', async (d, f) => {
    const r = await api('POST', '/auth/password', d);
    if (!r.ok) return showError(f, r);
    notice = 'Пароль изменён. На других устройствах нужно войти заново.'; render();
  });
  const lo = $('#logoutBtn'); if (lo) lo.onclick = async () => {
    lo.disabled = true;
    const r = await Account.logout();
    if (!r.ok){ lo.disabled = false; const m = $('#logoutMsg'); m.className = 'form-msg err'; m.textContent = r.message; return; }
    tab = 'login'; notice = 'Вы вышли из аккаунта.'; render();
  };
  const db = $('#delBtn'); if (db) db.onclick = () => { confirmDelete = true; render(); };
  const dn = $('#delNo'); if (dn) dn.onclick = () => { confirmDelete = false; render(); };
  bindForm('delForm', async (d, f) => {
    const r = await api('DELETE', '/me', { password: d.password });
    if (!r.ok) return showError(f, r);
    confirmDelete = false; Account.forget(); tab = 'register';
    notice = 'Аккаунт удалён. Прогресс остался в этом браузере.'; render();
  });
}

// ---- ссылки из писем ----
export function viewVerify(){ return `${crumbs('подтверждение')}<h1>Подтверждение почты</h1><p class="small">Подтверждаем адрес…</p>`; }
export async function mountVerify(token){
  const r = await api('POST', '/auth/verify', { token });
  if (r.ok){
    await Account.signedIn(r.data.user);
    notice = 'Почта подтверждена, вы вошли в аккаунт.';
  } else {
    tab = r.status === 409 ? 'login' : 'register';
    notice = r.data.message;
  }
  location.hash = '#/account';
}

export function viewReset(token){
  if (token) resetToken = token;
  if (!resetToken) return `${crumbs('новый пароль')}<h1>Новый пароль</h1><div class="note warn">Ссылка недействительна. <a href="#/auth/forgot">Запросите новую</a>.</div>`;
  return `${crumbs('новый пароль')}<h1>Новый пароль</h1><div class="card auth-card"><form id="resetForm" class="auth-form">
   ${field('Новый пароль', 'type="password" name="password" autocomplete="new-password" required minlength="10" maxlength="128"', 'Не короче 10 символов. После смены пароля вход на других устройствах сбросится.')}${msg}
   <div class="row"><button class="btn" type="submit">Сохранить пароль</button></div></form></div>`;
}
export function mountReset(){
  bindForm('resetForm', async (d, f) => {
    const r = await api('POST', '/auth/reset', { token: resetToken, password: d.password });
    if (!r.ok){
      if (r.data.error === 'invalid_token'){ resetToken = null; toast(r.data.message); location.hash = '#/auth/forgot'; return; }
      return showError(f, r);
    }
    resetToken = null;
    await Account.signedIn(r.data.user);
    notice = 'Пароль изменён, вы вошли в аккаунт.';
    location.hash = '#/account';
  });
}

let forgotSent = false;
export function viewForgot(){
  return `${crumbs('восстановление пароля')}<h1>Восстановление пароля</h1>
  <div class="card auth-card">${forgotSent ? '<div class="auth-sent"><b>Проверьте почту</b><p>Если аккаунт с таким адресом есть, мы отправили ссылку для смены пароля. Она действует 1 час.</p></div>'
    : `<form id="forgotForm" class="auth-form"><p class="small">Пришлём ссылку, по которой можно задать новый пароль.</p>${EMAIL}${msg}<div class="row"><button class="btn" type="submit">Отправить ссылку</button><a href="#/account">Вспомнил пароль</a></div></form>`}</div>`;
}
export function mountForgot(render){
  bindForm('forgotForm', async (d, f) => {
    const r = await api('POST', '/auth/forgot', { email: d.email.trim() });
    if (!r.ok) return showError(f, r);
    forgotSent = true; render();
  });
}

// ---- политика обработки персональных данных ----
// Реквизиты оператора в квадратных скобках нужно заполнить до запуска.
export function viewPrivacy(){
  return `${crumbs('персональные данные')}<h1>Политика обработки персональных данных</h1><article class="prose" style="margin-top:14px">
  <div class="note warn">Шаблон: перед публикацией заполните реквизиты оператора в квадратных скобках и сверьте текст с юристом.</div>
  <p><b>Оператор:</b> [ФИО или наименование], [ИНН/ОГРН], [адрес]. Контакт по вопросам персональных данных: [email].</p>
  <h3>Какие данные обрабатываются</h3>
  <ul><li>адрес электронной почты;</li><li>хеш пароля (сам пароль не хранится);</li><li>прогресс обучения, имя и аватар, если вы их указали в профиле;</li><li>IP-адрес и сведения о браузере — в журнале входов и списке активных сессий.</li></ul>
  <h3>Цели</h3>
  <p>Регистрация и вход, сохранение и синхронизация прогресса между устройствами, защита аккаунта от взлома, отправка служебных писем (подтверждение адреса, восстановление пароля, уведомление о смене пароля). Рекламных рассылок нет.</p>
  <h3>Сроки хранения</h3>
  <p>Данные аккаунта хранятся до его удаления. Журнал входов — 90 дней. Сессии — до выхода или 30 дней.</p>
  <h3>Где хранятся</h3>
  <p>На серверах в Российской Федерации. Третьим лицам данные не передаются, кроме почтового сервиса для доставки писем.</p>
  <h3>Ваши права</h3>
  <p>Вы можете в любой момент удалить аккаунт на странице «Аккаунт» — данные на сервере удаляются сразу. По другим вопросам (уточнение, получение сведений, отзыв согласия) напишите на [email].</p>
  </article>`;
}
