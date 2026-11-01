// Движок учебного терминала: виртуальная ФС, небольшой shell и задания. Без DOM, поэтому лабы проверяются и в Node (scripts/check-labs.js).
// Описание лабы: { title, intro, host, cwd, fs:{путь:текст}, state:{}, cmds:[{re, out, when, set}], tasks:[{t, sol, ok|check|ans, why}] }
const clone = o => JSON.parse(JSON.stringify(o));

function tokenize(s){
  const out = []; let cur = '', q = null, has = false;
  for (const ch of s){
    if (q){ if (ch === q) q = null; else cur += ch; continue; }
    if (ch === "'" || ch === '"'){ q = ch; has = true; continue; }
    if (/\s/.test(ch)){ if (cur || has) out.push(cur); cur = ''; has = false; continue; }
    cur += ch;
  }
  if (cur || has) out.push(cur);
  return out;
}
// Делит строку по разделителю вне кавычек
function splitTop(s, seps){
  const parts = []; let cur = '', q = null;
  for (let i = 0; i < s.length; i++){
    const ch = s[i];
    if (q){ if (ch === q) q = null; cur += ch; continue; }
    if (ch === "'" || ch === '"'){ q = ch; cur += ch; continue; }
    const sep = seps.find(x => s.startsWith(x, i));
    if (sep){ parts.push(cur, sep); cur = ''; i += sep.length - 1; continue; }
    cur += ch;
  }
  parts.push(cur);
  return parts;
}
const lines = t => t === '' ? [] : t.replace(/\n$/, '').split('\n');
const modeStr = m => !m ? '-rw-r--r--' : '-' + [...m].map(d => (+d & 4 ? 'r' : '-') + (+d & 2 ? 'w' : '-') + (+d & 1 ? 'x' : '-')).join('');
const norm = s => String(s).trim().toLowerCase().replace(/\s+/g, ' ').replace(/,/g, '.');

export function createLab(def){
  const L = {
    fs: clone(def.fs || {}), cwd: def.cwd || '/home/student', s: clone(def.state || {}), step: 0, log: [], modes: {},
    dirs: new Set(['/', '/home', '/home/student', '/tmp', ...(def.dirs || [])])
  };
  for (const p of Object.keys(L.fs)) addParents(p);
  function addParents(p){ const a = p.split('/'); while (a.length > 2){ a.pop(); L.dirs.add(a.join('/')); } }
  const abs = p => {
    if (!p) return L.cwd;
    const raw = (p[0] === '/' ? p : L.cwd + '/' + p).replace(/^~/, '/home/student').split('/');
    const st = [];
    for (const x of raw){ if (!x || x === '.') continue; if (x === '..') st.pop(); else st.push(x); }
    return '/' + st.join('/');
  };
  const children = d => {
    const pre = d === '/' ? '/' : d + '/'; const names = new Set();
    for (const p of [...Object.keys(L.fs), ...L.dirs]) if (p.startsWith(pre) && p !== pre) names.add(p.slice(pre.length).split('/')[0]);
    return [...names].sort();
  };
  const readArgs = (files, input, name) => {
    if (!files.length) return { text: input };
    let text = '';
    for (const f of files){
      const p = abs(f);
      if (L.fs[p] === undefined) return { err: `${name}: ${f}: ${L.dirs.has(p) ? 'это каталог' : 'нет такого файла или каталога'}` };
      text += L.fs[p].endsWith('\n') || L.fs[p] === '' ? L.fs[p] : L.fs[p] + '\n';
    }
    return { text };
  };

  const BUILTIN = {
    pwd: () => L.cwd,
    whoami: () => 'student',
    hostname: () => def.host || 'lab',
    date: () => 'Sun Nov  1 12:00:00 UTC 2026',
    echo: a => a.join(' '),
    clear: () => ({ clear: true }),
    cd(a){ const p = abs(a[0] || '/home/student'); if (!L.dirs.has(p)) return { err: `cd: ${a[0]}: нет такого каталога` }; L.cwd = p; return ''; },
    ls(a){
      const flags = a.filter(x => x[0] === '-').join(''); const t = a.find(x => x[0] !== '-');
      const p = abs(t);
      if (L.fs[p] !== undefined) return t;
      if (!L.dirs.has(p)) return { err: `ls: ${t}: нет такого файла или каталога` };
      let names = children(p);
      if (!/a/.test(flags)) names = names.filter(n => n[0] !== '.');
      if (!/l/.test(flags)) return names.join('  ');
      return names.map(n => { const f = (p === '/' ? '' : p) + '/' + n; const isD = L.dirs.has(f); const size = isD ? 4096 : L.fs[f].length; return `${isD ? 'drwxr-xr-x' : modeStr(L.modes[f])} 1 student student ${String(size).padStart(6)} Nov  1 12:00 ${n}`; }).join('\n');
    },
    cat(a, input){ const r = readArgs(a, input, 'cat'); return r.err ? r : r.text.replace(/\n$/, ''); },
    head(a, input){ return slice(a, input, 'head'); },
    tail(a, input){ return slice(a, input, 'tail'); },
    wc(a, input){ const fl = a.filter(x => x[0] === '-'); const r = readArgs(a.filter(x => x[0] !== '-'), input, 'wc'); if (r.err) return r; const n = lines(r.text).length; return fl.includes('-l') || !fl.length ? String(n) : String(r.text.length); },
    grep(a, input){
      const fl = a.filter(x => /^-[a-zA-Z]+$/.test(x)).join(''); const rest = a.filter(x => !/^-[a-zA-Z]+$/.test(x));
      const pat = rest.shift();
      if (pat === undefined) return { err: 'grep: укажите шаблон' };
      let re; try { re = new RegExp(pat, /i/.test(fl) ? 'i' : ''); } catch (e){ return { err: 'grep: неверный шаблон' }; }
      let items = [];
      if (rest.length){
        for (const f of rest){
          const p = abs(f);
          if (L.dirs.has(p) && /r/.test(fl)){ for (const k of Object.keys(L.fs).filter(x => x.startsWith(p + '/'))) items.push([k, L.fs[k]]); }
          else if (L.fs[p] === undefined) return { err: `grep: ${f}: нет такого файла или каталога` };
          else items.push([f, L.fs[p]]);
        }
      } else items = [[null, input]];
      const multi = items.length > 1 || /r/.test(fl); const out = []; let count = 0;
      for (const [name, txt] of items) lines(txt).forEach((ln, i) => {
        if (re.test(ln) === /v/.test(fl)) return;
        count++; out.push((multi ? name + ':' : '') + (/n/.test(fl) ? (i + 1) + ':' : '') + ln);
      });
      if (/c/.test(fl)) return String(count);
      return { text: out.join('\n'), fail: !out.length };
    },
    sort(a, input){
      const fl = a.filter(x => x[0] === '-').join(''); const r = readArgs(a.filter(x => x[0] !== '-'), input, 'sort'); if (r.err) return r;
      const v = lines(r.text);
      v.sort(/n/.test(fl) ? (x, y) => parseFloat(x) - parseFloat(y) : (x, y) => (x < y ? -1 : x > y ? 1 : 0));
      if (/r/.test(fl)) v.reverse();
      return v.join('\n');
    },
    uniq(a, input){
      const c = a.includes('-c'); const r = readArgs(a.filter(x => x[0] !== '-'), input, 'uniq'); if (r.err) return r;
      const out = []; for (const ln of lines(r.text)){ const l = out[out.length - 1]; if (l && l[1] === ln) l[0]++; else out.push([1, ln]); }
      return out.map(([n, ln]) => c ? String(n).padStart(7) + ' ' + ln : ln).join('\n');
    },
    cut(a, input){
      let d = '\t', f = null; const files = [];
      for (let i = 0; i < a.length; i++){
        if (a[i] === '-d') d = a[++i]; else if (a[i].startsWith('-d')) d = a[i].slice(2);
        else if (a[i] === '-f') f = a[++i]; else if (a[i].startsWith('-f')) f = a[i].slice(2);
        else files.push(a[i]);
      }
      if (!f) return { err: 'cut: укажите поле: -f N' };
      const r = readArgs(files, input, 'cut'); if (r.err) return r;
      const idx = f.split(',').map(x => +x - 1);
      return lines(r.text).map(ln => { const p = ln.split(d); return idx.map(i => p[i] ?? '').join(d); }).join('\n');
    },
    // Подмножество awk: '{print $1,$2}' и '$9==502 {print $7}'
    awk(a, input){
      const prog = a[0] || ''; const m = prog.match(/^\s*(?:\$(\d+)\s*(==|!=|>|<)\s*"?([^"\s{]+)"?\s*)?\{\s*print\s*([^}]*)\}\s*$/);
      if (!m) return { err: "awk: в лаборатории доступны формы '{print $1,$2}' и '$9==502 {print $7}'" };
      const r = readArgs(a.slice(1), input, 'awk'); if (r.err) return r;
      const out = [];
      for (const ln of lines(r.text)){
        const p = ln.trim().split(/\s+/); const get = n => n === 0 ? ln : (p[n - 1] ?? '');
        if (m[1]){
          const v = get(+m[1]); const num = !isNaN(+m[3]) && !isNaN(+v);
          const x = num ? +v : v, y = num ? +m[3] : m[3];
          if (!(m[2] === '==' ? x === y : m[2] === '!=' ? x !== y : m[2] === '>' ? x > y : x < y)) continue;
        }
        const f = m[4].trim() || '$0';
        out.push(f.split(',').map(t => { const k = t.trim().match(/^\$(\d+)$/); return k ? get(+k[1]) : t.trim().replace(/"/g, ''); }).join(' '));
      }
      return out.join('\n');
    },
    // sed: только замена s/a/b/ и s/a/b/g, с -i правит файл
    sed(a, input){
      const inplace = a.includes('-i'); const rest = a.filter(x => x !== '-i');
      const m = (rest[0] || '').match(/^s(.)(.*?)\1(.*?)\1(g?)$/);
      if (!m) return { err: "sed: в лаборатории доступна замена: sed -i 's/было/стало/' файл" };
      let re; try { re = new RegExp(m[2], m[4]); } catch (e){ return { err: 'sed: неверный шаблон' }; }
      m[3] = m[3].replace(/\\n/g, '\n');
      if (inplace){
        for (const f of rest.slice(1)){ const p = abs(f); if (L.fs[p] === undefined) return { err: `sed: ${f}: нет такого файла` }; L.fs[p] = L.fs[p].split('\n').map(x => x.replace(re, m[3])).join('\n'); }
        return '';
      }
      const r = readArgs(rest.slice(1), input, 'sed'); if (r.err) return r;
      return lines(r.text).map(x => x.replace(re, m[3])).join('\n');
    },
    find(a){
      const root = abs(a[0] && a[0][0] !== '-' ? a[0] : '.'); const i = a.indexOf('-name');
      let re = null; if (i >= 0) re = new RegExp('^' + (a[i + 1] || '*').replace(/[.+^$()]/g, '\\$&').replace(/\*/g, '.*') + '$');
      return Object.keys(L.fs).concat([...L.dirs]).filter(p => (p === root || p.startsWith(root === '/' ? '/' : root + '/')) && (!re || re.test(p.split('/').pop()))).sort().join('\n');
    },
    mkdir(a){ for (const x of a.filter(v => v[0] !== '-')){ const p = abs(x); L.dirs.add(p); addParents(p + '/x'); } return ''; },
    touch(a){ for (const x of a){ const p = abs(x); if (L.fs[p] === undefined){ L.fs[p] = ''; addParents(p); } } return ''; },
    rm(a){
      const rec = a.some(v => /^-\w*r/i.test(v));
      for (const x of a.filter(v => v[0] !== '-')){
        const p = abs(x);
        if (L.dirs.has(p)){
          if (!rec) return { err: `rm: ${x}: это каталог, используйте rm -r` };
          for (const k of Object.keys(L.fs)) if (k.startsWith(p + '/')) delete L.fs[k];
          for (const k of [...L.dirs]) if (k === p || k.startsWith(p + '/')) L.dirs.delete(k);
        } else if (L.fs[p] === undefined) return { err: `rm: ${x}: нет такого файла` };
        else delete L.fs[p];
      }
      return '';
    },
    chmod(a){
      const [mode, ...files] = a;
      if (!files.length || !/^([0-7]{3}|[ugoa]*[+-][rwx]+)$/.test(mode)) return { err: 'chmod: в лаборатории доступны формы chmod 640 файл и chmod +x файл' };
      for (const f of files){
        const p = abs(f);
        if (L.fs[p] === undefined && !L.dirs.has(p)) return { err: `chmod: ${f}: нет такого файла` };
        if (/^\d/.test(mode)){ L.modes[p] = mode; continue; }
        const add = mode.includes('+'), bits = (mode.includes('r') ? 4 : 0) + (mode.includes('w') ? 2 : 0) + (mode.includes('x') ? 1 : 0);
        const who = mode.split(/[+-]/)[0] || 'a'; const cur = [...(L.modes[p] || '644')].map(Number);
        ['u', 'g', 'o'].forEach((w, i) => { if (who.includes('a') || who.includes(w)) cur[i] = add ? cur[i] | bits : cur[i] & ~bits; });
        L.modes[p] = cur.join('');
      }
      return '';
    },
    cp(a){ const [x, y] = a.filter(v => v[0] !== '-'); const p = abs(x); if (L.fs[p] === undefined) return { err: `cp: ${x}: нет такого файла` }; L.fs[abs(y)] = L.fs[p]; addParents(abs(y)); return ''; },
    mv(a){ const [x, y] = a.filter(v => v[0] !== '-'); const p = abs(x); if (L.fs[p] === undefined) return { err: `mv: ${x}: нет такого файла` }; L.fs[abs(y)] = L.fs[p]; addParents(abs(y)); delete L.fs[p]; return ''; },
    help(){ return 'Служебные команды лаборатории: tasks — задания, hint — подсказка, answer ТЕКСТ — ответить, nano ФАЙЛ — редактор, clear — очистить экран.\nРаботают: pwd ls cd cat head tail wc grep sort uniq cut awk sed find echo mkdir touch rm cp mv, конвейеры |, перенаправление > и >>, а также команды по теме лабы.'; },
    tasks(){ return def.tasks.map((t, i) => `${i < L.step ? '[x]' : i === L.step ? '[>]' : '[ ]'} ${i + 1}. ${t.t}`).join('\n'); },
    hint(){ const t = def.tasks[L.step]; if (!t) return 'Все задания выполнены.'; return 'Подсказка: ' + (t.hint || [].concat(t.sol).join('  затем  ')); },
    nano(a){ const p = abs(a[0]); if (!a[0]) return { err: 'nano: укажите файл' }; return { edit: p, content: L.fs[p] ?? '' }; }
  };
  BUILTIN.vim = BUILTIN.vi = BUILTIN.nano;
  function slice(a, input, name){
    let n = 10; const files = [];
    for (let i = 0; i < a.length; i++){
      if (a[i] === '-n') n = +a[++i]; else if (/^-\d+$/.test(a[i])) n = +a[i].slice(1); else if (/^-n\d+$/.test(a[i])) n = +a[i].slice(2);
      else if (a[i] === '-f') continue; else files.push(a[i]);
    }
    const r = readArgs(files, input, name); if (r.err) return r;
    const v = lines(r.text);
    return (name === 'head' ? v.slice(0, n) : v.slice(Math.max(0, v.length - n))).join('\n');
  }

  function execOne(seg, input){
    let s = seg.trim().replace(/\s+/g, ' ');
    if (s.startsWith('sudo ')) s = s.slice(5);
    const api = { fs: L.fs, s: L.s };
    for (const c of def.cmds || []){
      const m = s.match(c.re);
      if (!m || (c.when && !c.when(L.s, L.fs))) continue;
      const out = typeof c.out === 'function' ? c.out(L.s, m, api) : (c.out ?? '');
      if (c.set) c.set(L.s, m, api);
      return c.fail ? { err: out, custom: true } : out;
    }
    const t = tokenize(s); const name = t[0];
    if (BUILTIN[name]) return BUILTIN[name](t.slice(1), input);
    return { err: `${name}: в этой лаборатории команда недоступна или написана с другими аргументами. Введите hint, если не знаете, что делать.`, unknown: true };
  }
  function execPipeline(text){
    const parts = splitTop(text, ['|']).filter(x => x !== '|');
    let input = '', res = null;
    for (const p of parts){
      res = execOne(p, input);
      if (res && typeof res === 'object' && (res.err || res.clear || res.edit)) return res;
      input = (typeof res === 'object' ? res.text : res) ?? '';
      if (input && !input.endsWith('\n')) input += '\n';
    }
    return { text: input.replace(/\n$/, ''), fail: res && res.fail };
  }
  function execChain(line){
    const parts = splitTop(line, ['&&', ';']); const out = []; let skip = false, extra = {};
    for (let i = 0; i < parts.length; i += 2){
      if (i > 0 && parts[i - 1] === ';') skip = false;
      if (skip || !parts[i].trim()) continue;
      let seg = parts[i], target = null, append = false;
      const r = seg.match(/^(.*?)(>>|>)\s*([^\s>]+)\s*$/);
      if (r && !/^\s*(curl|psql|promql)/.test(seg)){ seg = r[1]; append = r[2] === '>>'; target = abs(r[3]); }
      const res = execPipeline(seg);
      if (res.clear) extra.clear = true;
      if (res.edit) extra.edit = { path: res.edit, content: res.content };
      if (res.err){ out.push(res.err); skip = true; if (!res.custom) extra.blocked = true; continue; }
      if (res.fail) skip = true;
      if (target){ L.fs[target] = (append && L.fs[target] ? L.fs[target] : '') + res.text + '\n'; addParents(target); }
      else if (res.text) out.push(res.text);
    }
    return { out: out.join('\n'), ...extra };
  }
  function advance(line, ansText){
    const done = [];
    for (;;){
      const t = def.tasks[L.step];
      if (!t) break;
      let hit = false;
      if (t.ans) hit = ansText !== null && t.ans.some(a => norm(a) === norm(ansText));
      else if (t.check) hit = !!t.check(L.s, L.fs);
      else if (t.ok) hit = line !== null && t.ok.test(line.trim().replace(/\s+/g, ' '));
      if (!hit) break;
      L.step++; done.push(t); ansText = null; line = null;
    }
    return done;
  }

  return {
    get step(){ return L.step; },
    get cwd(){ return L.cwd; },
    get finished(){ return L.step >= def.tasks.length; },
    state: L,
    run(line){
      line = line.trim();
      if (!line) return { out: '', done: [] };
      L.log.push({ l: line });
      const am = line.match(/^answer\s+(.+)$/);
      if (am){
        const t = def.tasks[L.step];
        if (!t) return { out: 'Все задания выполнены.', done: [] };
        if (!t.ans) return { out: 'Текущее задание выполняется командой, а не ответом. Введите tasks.', done: [] };
        const done = advance(null, am[1].replace(/^["']|["']$/g, ''));
        return { out: done.length ? '' : 'Пока неверно. Проверьте вывод ещё раз или введите hint.', done };
      }
      const r = execChain(line);
      return { ...r, done: advance(line, null) };
    },
    // Даёт ли команда вывод на чистой копии стенда (для кнопок у коротких команд в тексте)
    dry(line){ return !!createLab(def).run(line).out; },
    save(path, content){ L.fs[path] = content; addParents(path); L.log.push({ f: path, c: content }); return advance(null, null); },
    replay(log){ for (const e of log){ if (e.f) this.save(e.f, e.c); else this.run(e.l); } }
  };
}
