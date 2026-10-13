// ====== ХРАНЕНИЕ ПРОГРЕССА ======
// Один объект состояния на все курсы. Лежит в localStorage (общий для всех страниц сайта,
// т. к. они на одном origin) и, по желанию, автоматически пишется в JSON-файл через File System Access API.
export const APP_ID = 'dev-courses';
export const APP_VERSION = 2;
export const LS_KEY = 'dev-courses-progress';
export const LS_BACKUP = 'dev-courses-last-backup';
export const FILE_NAME = 'dev-courses-progress.json';
export const FS_SUPPORTED = typeof window.showSaveFilePicker === 'function';
// Ключи и id файлов из старых одностраничных версий курсов (version 1)
export const LEGACY = { 'network-course':'network', 'ai-agents-course':'ai-agents' };

export function lsGet(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }
export function lsSet(k,v){ try { localStorage.setItem(k,v); } catch(e){} }
export const clone = o => JSON.parse(JSON.stringify(o));
export const dayKey = (d = new Date()) => { d = new Date(d); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); };

export function emptyCourse(){ return { lessons:{}, tests:{}, finalExam:null, checks:{}, unlockAll:false }; }
export function emptyState(){
  return {
    app:APP_ID, version:APP_VERSION, savedAt:new Date().toISOString(),
    settings:{ theme:'system', dailyGoal:50, effects:true },
    profile:{ name:'', avatar:'🦉', createdAt:new Date().toISOString() },
    game:{ awarded:{}, days:{}, achievements:{}, flags:{} },
    courses:{}, last:null
  };
}

export const Store = {
  state: emptyState(),
  handle: null,
  fileStatus: FS_SUPPORTED ? 'none' : 'unsupported', // none | ok | denied | error | unsupported
  lastFileSave: null,
  writeTimer: null,
  newerFileData: null,
  listeners: [],

  onChange(fn){ this.listeners.push(fn); },
  emit(kind){ this.listeners.forEach(fn => { try { fn(kind); } catch(e){ console.error(e); } }); },

  load(){
    const raw = lsGet(LS_KEY);
    if (raw){ try { const p = JSON.parse(raw); if (p && p.app === APP_ID) this.state = this.normalize(p); } catch(e){} }
    else this.migrateLegacyStorage();
  },
  // Переносим прогресс из старых версий, где у каждого курса был свой ключ в localStorage
  migrateLegacyStorage(){
    let found = false;
    for (const app of Object.keys(LEGACY)){
      const raw = lsGet(app + '-progress'); if (!raw) continue;
      try { const d = this.fromLegacy(JSON.parse(raw)); if (d){ this.state = this.merge(this.state, d); found = true; } } catch(e){}
    }
    if (found) lsSet(LS_KEY, JSON.stringify(this.state));
  },
  fromLegacy(p){
    const cid = p && LEGACY[p.app]; if (!cid || p.version !== 1) return null;
    const s = emptyState();
    s.savedAt = p.savedAt || s.savedAt;
    s.settings.theme = (p.settings && p.settings.theme) || 'system';
    s.courses[cid] = { ...emptyCourse(), lessons:p.lessons || {}, tests:p.tests || {}, finalExam:p.finalExam || null, unlockAll:!!(p.settings && p.settings.unlockAll) };
    return s;
  },
  normalize(p){
    const e = emptyState();
    const out = { ...e, ...p, settings:{ ...e.settings, ...(p.settings || {}) }, profile:{ ...e.profile, ...(p.profile || {}) }, game:{ ...e.game, ...(p.game || {}) }, courses:{} };
    for (const [id, c] of Object.entries(p.courses || {})) out.courses[id] = { ...emptyCourse(), ...c };
    return out;
  },
  course(id){
    if (!this.state.courses[id]) this.state.courses[id] = emptyCourse();
    return this.state.courses[id];
  },
  save(kind){
    this.state.savedAt = new Date().toISOString();
    lsSet(LS_KEY, JSON.stringify(this.state));
    this.scheduleFileWrite();
    this.emit(kind);
  },

  // ---- файл ----
  scheduleFileWrite(){
    if (!this.handle || this.fileStatus === 'denied') return;
    clearTimeout(this.writeTimer);
    this.writeTimer = setTimeout(() => this.writeFile(), 1200);
  },
  async writeFile(){
    if (!this.handle) return;
    try {
      const perm = await this.handle.queryPermission({ mode:'readwrite' });
      if (perm !== 'granted'){ this.fileStatus = 'denied'; this.emit(); return; }
      const w = await this.handle.createWritable();
      await w.write(JSON.stringify(this.state, null, 2));
      await w.close();
      this.fileStatus = 'ok'; this.lastFileSave = new Date();
      lsSet(LS_BACKUP, new Date().toISOString());
    } catch(e){ this.fileStatus = 'error'; }
    this.emit();
  },
  async linkFile(){
    if (!FS_SUPPORTED) return;
    try {
      const h = await window.showSaveFilePicker({ suggestedName:FILE_NAME, types:[{ description:'Прогресс курсов', accept:{ 'application/json':['.json'] } }] });
      this.handle = h; await idbSet('handle', h);
      this.fileStatus = 'ok'; await this.writeFile();
      toast('Файл привязан. Прогресс сохраняется автоматически.');
    } catch(e){ if (e.name !== 'AbortError') toast('Не удалось привязать файл: ' + e.message); }
    this.emit();
  },
  // Возвращает данные из выбранного файла; применять их решает вызывающий код
  async openLinkedFile(){
    if (!FS_SUPPORTED) return null;
    try {
      const [h] = await window.showOpenFilePicker({ types:[{ description:'Прогресс курсов', accept:{ 'application/json':['.json'] } }] });
      const data = this.parse(await (await h.getFile()).text());
      if (!data) return null;
      this.handle = h; await idbSet('handle', h);
      const perm = await h.requestPermission({ mode:'readwrite' });
      this.fileStatus = perm === 'granted' ? 'ok' : 'denied';
      return data;
    } catch(e){ if (e.name !== 'AbortError') toast('Не удалось открыть файл: ' + e.message); return null; }
  },
  async restoreHandle(){
    if (!FS_SUPPORTED) return;
    try {
      const h = await idbGet('handle');
      if (!h) return;
      this.handle = h;
      const perm = await h.queryPermission({ mode:'readwrite' });
      if (perm !== 'granted'){ this.fileStatus = 'denied'; this.emit(); return; }
      this.fileStatus = 'ok';
      const data = this.parse(await (await h.getFile()).text(), true);
      if (data && data.savedAt > this.state.savedAt) this.newerFileData = data;
      this.emit();
    } catch(e){ this.fileStatus = 'error'; this.emit(); }
  },
  async requestAccess(){
    if (!this.handle) return this.linkFile();
    try {
      const perm = await this.handle.requestPermission({ mode:'readwrite' });
      this.fileStatus = perm === 'granted' ? 'ok' : 'denied';
      if (perm === 'granted'){
        const data = this.parse(await (await this.handle.getFile()).text(), true);
        if (data && data.savedAt > this.state.savedAt) this.newerFileData = data;
        else await this.writeFile();
      }
    } catch(e){ this.fileStatus = 'error'; toast('Файл недоступен. Привяжите его заново.'); }
    this.emit();
  },
  async unlink(){ this.handle = null; this.fileStatus = FS_SUPPORTED ? 'none' : 'unsupported'; await idbSet('handle', null); this.emit(); },
  parse(text, silent){
    let data;
    try { data = JSON.parse(text); } catch(e){ if (!silent) toast('Файл повреждён: это не JSON.'); return null; }
    if (data && LEGACY[data.app]) return this.fromLegacy(data) || (silent ? null : (toast('Версия файла не поддерживается.'), null));
    if (!data || data.app !== APP_ID){ if (!silent) toast('Это не файл прогресса курсов.'); return null; }
    if (data.version !== APP_VERSION){ if (!silent) toast('Версия файла ' + data.version + ' не поддерживается.'); return null; }
    return this.normalize(data);
  },
  exportFile(){
    const d = dayKey();
    const blob = new Blob([JSON.stringify(this.state, null, 2)], { type:'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'dev-courses-progress-' + d + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    lsSet(LS_BACKUP, new Date().toISOString());
    toast('Копия прогресса скачана.'); this.emit();
  },
  importFile(file, cb){
    const r = new FileReader();
    r.onload = () => { const data = this.parse(r.result); if (data) cb(data); };
    r.readAsText(file);
  },

  // ---- слияние ----
  mergeCourse(a, b){
    const out = { ...emptyCourse(), ...clone(a) };
    for (const [id, l] of Object.entries(b.lessons || {})){
      if (l.completed && !(out.lessons[id] && out.lessons[id].completed)) out.lessons[id] = l;
    }
    for (const [id, t] of Object.entries(b.tests || {})){
      const o = out.tests[id];
      if (!o){ out.tests[id] = t; continue; }
      const newer = t.lastAttemptAt > o.lastAttemptAt ? t : o;
      out.tests[id] = { bestScore:Math.max(o.bestScore, t.bestScore), attempts:Math.max(o.attempts, t.attempts), lastScore:newer.lastScore, lastAttemptAt:newer.lastAttemptAt, wrongQuestionIds:newer.wrongQuestionIds };
    }
    if (b.finalExam){
      const o = out.finalExam;
      out.finalExam = !o ? b.finalExam : { bestScore:Math.max(o.bestScore, b.finalExam.bestScore), attempts:Math.max(o.attempts, b.finalExam.attempts), lastAttemptAt: o.lastAttemptAt > b.finalExam.lastAttemptAt ? o.lastAttemptAt : b.finalExam.lastAttemptAt };
    }
    out.checks = { ...(b.checks || {}), ...out.checks };
    out.unlockAll = out.unlockAll || !!b.unlockAll;
    return out;
  },
  merge(a, b){
    const out = this.normalize(clone(a));
    for (const [id, c] of Object.entries(b.courses || {})) out.courses[id] = this.mergeCourse(out.courses[id] || emptyCourse(), c);
    const g = out.game, h = b.game || {};
    for (const [k, v] of Object.entries(h.awarded || {})) if (!g.awarded[k]) g.awarded[k] = v;
    for (const [k, v] of Object.entries(h.days || {})) g.days[k] = Math.max(g.days[k] || 0, v);
    for (const [k, v] of Object.entries(h.achievements || {})) if (!g.achievements[k] || v < g.achievements[k]) g.achievements[k] = v;
    Object.assign(g.flags, h.flags || {});
    if (!out.profile.name && b.profile && b.profile.name) out.profile = { ...out.profile, ...b.profile };
    if (b.last && (!out.last || b.last.at > out.last.at)) out.last = b.last;
    return out;
  },
  apply(data, mode){
    const keep = this.state.settings;
    this.state = mode === 'merge' ? this.merge(this.state, data) : this.normalize(data);
    if (mode === 'merge') this.state.settings = { ...this.state.settings, ...keep };
    applyTheme(); this.save();
  },
  reset(courseId){
    if (courseId){ this.state.courses[courseId] = emptyCourse(); }
    else { const s = this.state.settings, pr = this.state.profile; this.state = emptyState(); this.state.settings = s; this.state.profile = pr; }
    this.save();
  }
};

// IndexedDB для дескриптора файла
export function idb(){ return new Promise((res, rej) => { const r = indexedDB.open(APP_ID, 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
export async function idbSet(k, v){ try { const db = await idb(); await new Promise((res, rej) => { const tx = db.transaction('kv','readwrite'); tx.objectStore('kv').put(v, k); tx.oncomplete = res; tx.onerror = () => rej(tx.error); }); } catch(e){} }
export async function idbGet(k){ try { const db = await idb(); return await new Promise((res, rej) => { const r = db.transaction('kv').objectStore('kv').get(k); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); } catch(e){ return null; } }

// ====== ОБЩИЕ УТИЛИТЫ ======
export const $ = s => document.querySelector(s);
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
export function shuffle(a){ a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
export function toast(msg){ const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 3200); }
export function fmtTime(d){ return d.toLocaleTimeString('ru-RU', { hour:'2-digit', minute:'2-digit' }); }
export function plural(n, one, few, many){ const a = Math.abs(n) % 100, b = a % 10; return a > 10 && a < 20 ? many : b === 1 ? one : b >= 2 && b <= 4 ? few : many; }

export function applyTheme(){
  const t = Store.state.settings.theme;
  if (t === 'system') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
}
export function cycleTheme(){
  const order = ['system','light','dark']; const cur = Store.state.settings.theme;
  Store.state.settings.theme = order[(order.indexOf(cur) + 1) % 3];
  applyTheme(); Store.save();
  toast('Тема: ' + ({ system:'как в системе', light:'светлая', dark:'тёмная' }[Store.state.settings.theme]));
}
// Синхронизация между вкладками: прогресс, набранный в другой вкладке, сразу виден здесь
window.addEventListener('storage', e => {
  if (e.key !== LS_KEY || !e.newValue) return;
  try { const p = JSON.parse(e.newValue); if (p && p.app === APP_ID){ Store.state = Store.normalize(p); applyTheme(); Store.emit('external'); } } catch(err){}
});
