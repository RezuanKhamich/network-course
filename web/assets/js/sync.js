// ====== АККАУНТ И СИНХРОНИЗАЦИЯ ПРОГРЕССА ======
// Гость: всё как раньше, прогресс только в браузере. После входа локальный прогресс сливается с серверным,
// дальше каждое изменение уходит на сервер с задержкой. Сервер принимает запись, только если клиент видел
// его текущую версию (baseVersion); иначе отвечает 409 со своими данными — сливаем и отправляем снова.
import { Store, emptyState, lsGet, lsSet, applyTheme, fmtTime } from './storage.js';
import { Game } from './game.js';

const API = import.meta.env.VITE_API_URL || '/api';
// чей прогресс лежит в браузере и какую версию серверной копии он учитывает
const META_KEY = 'dev-courses-sync';
const DEBOUNCE = 1500;
// fetch с keepalive при закрытии страницы ограничен 64 КБ
const KEEPALIVE_LIMIT = 60000;

function meta(){ try { return JSON.parse(lsGet(META_KEY)) || {}; } catch(e){ return {}; } }
function setMeta(m){ lsSet(META_KEY, JSON.stringify(m)); }
// jsonb в PostgreSQL переставляет ключи, поэтому сравниваем копии с отсортированными ключами
const canon = v => Array.isArray(v) ? '[' + v.map(canon).join(',') + ']'
  : v && typeof v === 'object' ? '{' + Object.keys(v).filter(k => v[k] !== undefined).sort().map(k => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}'
  : JSON.stringify(v);
const fingerprint = s => canon({ ...s, savedAt: null });

export async function api(method, path, body, opts = {}){
  let res;
  try {
    res = await fetch(API + path, {
      method, credentials: 'same-origin', keepalive: !!opts.keepalive,
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch(e){
    return { ok: false, status: 0, data: { message: 'Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.' } };
  }
  let data = {};
  if (res.status !== 204){ try { data = await res.json(); } catch(e){ /* не JSON — например, 502 от nginx */ } }
  if (!res.ok && !data.message) data.message = 'Сервер временно недоступен. Попробуйте позже.';
  return { ok: res.ok, status: res.status, data };
}

export const Account = {
  user: null,
  status: 'loading', // loading | guest | user | offline
  sync: 'idle',      // idle | saving | ok | error
  lastSync: null,
  error: null,
  timer: null, inflight: false, again: false, synced: null,
  listeners: [],

  onChange(fn){ this.listeners.push(fn); },
  emit(){ this.listeners.forEach(fn => { try { fn(); } catch(e){ console.error(e); } }); },
  setSync(s, error = null){ this.sync = s; this.error = error; if (s === 'ok') this.lastSync = new Date(); this.emit(); },

  async init(){
    Store.onChange(kind => { if (kind !== 'sync' && kind !== 'external') this.schedule(); });
    addEventListener('online', () => { if (this.status === 'offline') this.init(); else if (this.status === 'user') this.push(); });
    addEventListener('pagehide', () => this.flush());
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') this.flush(); });
    await this.refresh();
  },
  async refresh(){
    const r = await api('GET', '/session');
    if (r.ok && r.data.user) return this.signedIn(r.data.user);
    this.user = null;
    this.status = r.ok ? 'guest' : 'offline';
    this.emit();
  },

  // После входа, подтверждения почты или сброса пароля
  async signedIn(user){
    const m = meta();
    // в браузере прогресс другого аккаунта (сессия истекла, вошёл другой человек) — не смешиваем его с этим
    if (m.userId && m.userId !== user.id) this.wipeLocal();
    setMeta({ userId: user.id, version: m.userId === user.id ? m.version || 0 : 0 });
    this.user = user; this.status = 'user'; this.emit();
    await this.pull();
  },

  async pull(){
    this.setSync('saving');
    const r = await api('GET', '/progress');
    if (!r.ok) return this.failed(r);
    await this.reconcile(r.data);
  },

  // Сливает серверную копию с локальной и записывает результат на сервер
  async reconcile(server){
    for (let attempt = 0; attempt < 3; attempt++){
      if (server.data){
        const merged = Store.merge(Store.state, Store.normalize(server.data));
        if (fingerprint(merged) !== fingerprint(Store.state)){
          Store.state = merged; applyTheme(); Game.sync(true); Store.save('sync');
        }
        if (fingerprint(Store.state) === fingerprint(Store.normalize(server.data))){
          setMeta({ ...meta(), version: server.version });
          this.synced = fingerprint(Store.state);
          return this.setSync('ok');
        }
      }
      const w = await api('PUT', '/progress', { data: Store.state, baseVersion: server.version });
      if (w.ok){
        setMeta({ ...meta(), version: w.data.version });
        this.synced = fingerprint(Store.state);
        return this.setSync('ok');
      }
      if (w.status !== 409) return this.failed(w);
      server = { data: w.data.data, version: w.data.version };
    }
    this.setSync('error', 'Не удалось согласовать прогресс с сервером. Обновите страницу.');
  },

  schedule(){
    if (this.status !== 'user') return;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.push(), DEBOUNCE);
  },
  async push(){
    clearTimeout(this.timer); this.timer = null;
    if (this.status !== 'user') return;
    if (this.inflight){ this.again = true; return; }
    if (fingerprint(Store.state) === this.synced) return;
    this.inflight = true; this.setSync('saving');
    const w = await api('PUT', '/progress', { data: Store.state, baseVersion: meta().version || 0 });
    if (w.ok){
      setMeta({ ...meta(), version: w.data.version });
      this.synced = fingerprint(Store.state);
      this.setSync('ok');
    } else if (w.status === 409){
      await this.reconcile({ data: w.data.data, version: w.data.version });
    } else this.failed(w);
    this.inflight = false;
    if (this.again){ this.again = false; this.push(); }
  },
  // Страница закрывается: отправляем то, что не успело уйти
  flush(){
    if (this.status !== 'user' || !this.timer) return;
    clearTimeout(this.timer); this.timer = null;
    const body = { data: Store.state, baseVersion: meta().version || 0 };
    if (JSON.stringify(body).length < KEEPALIVE_LIMIT) api('PUT', '/progress', body, { keepalive: true });
  },
  failed(r){
    if (r.status === 401){
      this.user = null; this.status = 'guest';
      return this.setSync('error', 'Сессия истекла. Войдите снова, чтобы продолжить синхронизацию.');
    }
    this.setSync('error', r.data.message);
  },

  // Прогресс другого аккаунта уходит из браузера; настройки темы и цели остаются
  wipeLocal(){
    const settings = Store.state.settings;
    if (Store.handle) Store.unlink();
    Store.state = emptyState(); Store.state.settings = settings;
    this.synced = null;
    Game.sync(true); Store.save('sync');
  },

  async logout(){
    if (this.timer || this.sync === 'error'){
      await this.push();
      if (this.sync === 'error') return { ok: false, message: 'Последние изменения не сохранились на сервере: ' + this.error + ' Выйти всё равно нельзя — иначе они пропадут.' };
    }
    const r = await api('POST', '/auth/logout');
    if (!r.ok && r.status !== 401) return { ok: false, message: r.data.message };
    this.wipeLocal(); setMeta({});
    this.user = null; this.status = 'guest'; this.setSync('idle');
    return { ok: true };
  },
  // Аккаунт удалён: прогресс в браузере остаётся, но уже как гостевой
  forget(){
    setMeta({}); this.synced = null;
    this.user = null; this.status = 'guest'; this.setSync('idle');
  },

  // Плашка в шапке для вошедшего пользователя; для гостя — null, показывается статус файла
  pill(){
    if (this.status !== 'user'){
      return this.sync === 'error' && this.error ? { cls: 'warn', text: 'Войдите снова' } : null;
    }
    if (this.sync === 'saving') return { cls: '', text: 'Синхронизация…' };
    if (this.sync === 'error') return { cls: 'warn', text: 'Не синхронизировано' };
    return { cls: 'ok', text: 'Синхронизировано' + (this.lastSync ? ' · ' + fmtTime(this.lastSync) : '') };
  }
};
