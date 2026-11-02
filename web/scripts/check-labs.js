// Проверка курса DevOps: каждую лабу проходим по эталонным командам, сверяем виджеты в уроках, вопросы и глоссарий.
// node scripts/check-labs.js
import { createLab } from '../courses/devops/lab-engine.js';
import { LABS } from '../courses/devops/labs.js';
import { DRILLS, newDrillLab, drillPassed } from '../courses/devops/trainer.js';
import { MODULES, GLOSSARY } from '../courses/devops/content.js';

const errs = [];
const used = new Set();
const known = new Set(['slo', 'layers', 'cron', 'trainer', 'sandbox']);
for (const [id, def] of Object.entries(LABS)){
  const lab = createLab(def);
  def.tasks.forEach((t, i) => {
    if (lab.step !== i){ errs.push(`${id}: задание ${i + 1} засчитано раньше времени`); return; }
    if (!t.sol) errs.push(`${id}: задание ${i + 1} без эталона`);
    for (const line of [].concat(t.sol)){
      const r = lab.run(line);
      if (/команда недоступна|нет такого/.test(r.out || '') && !t.allowErr) errs.push(`${id}: «${line}» → ${r.out}`);
    }
    if (lab.step <= i) errs.push(`${id}: задание ${i + 1} не засчитано по эталону «${[].concat(t.sol).join(' ; ')}»`);
  });
  if (!lab.finished) errs.push(`${id}: лаба не завершается`);
}
// Упражнения тренажёра: эталон проходит, а бездействие и чужая команда — нет
for (const ex of DRILLS.flatMap(d => d.items)){
  const lab = newDrillLab(); const r = lab.run(ex.sol);
  if (/недоступна|нет такого|доступны формы/.test(r.out || '')) errs.push(`тренажёр: «${ex.sol}» → ${r.out}`);
  if (!drillPassed(ex, lab, r.out)) errs.push(`тренажёр: эталон не проходит: ${ex.t}`);
  const idle = newDrillLab(); const w = idle.run('echo неверно');
  if (drillPassed(ex, idle, w.out)) errs.push(`тренажёр: засчитан неверный ответ: ${ex.t}`);
  if (!ex.check && !r.out) errs.push(`тренажёр: пустой вывод эталона: ${ex.t}`);
}
const ids = new Set(); const lessons = new Set();
for (const m of MODULES){
  if (m.test.length < 6) errs.push(`m${m.id}: мало вопросов`);
  for (const l of m.lessons){
    lessons.add(l.id);
    for (const w of l.html.matchAll(/data-widget="(\w+)"/g)){
      used.add(w[1]);
      if (!LABS[w[1]] && !known.has(w[1])) errs.push(`${l.id}: нет виджета ${w[1]}`);
    }
    // Курс самодостаточен: в тексте не должно быть ссылок на внешние материалы (адреса в примерах кода допустимы)
    if (/https?:\/\//.test(l.html.replace(/<(pre|code)>[\s\S]*?<\/\1>/g, ''))) errs.push(`${l.id}: внешняя ссылка в тексте`);
  }
  for (const q of [...m.lessons.flatMap(l => l.check), ...m.test]){
    if (ids.has(q.id)) errs.push('повтор id ' + q.id);
    ids.add(q.id);
    if (!q.prompt || !q.explanation) errs.push(q.id + ': нет текста или объяснения');
    if ((q.type === 'single' || q.type === 'analyze') && !(q.answer >= 0 && q.answer < q.options.length)) errs.push(q.id + ': ответ вне вариантов');
    if (q.type === 'analyze' && !q.code) errs.push(q.id + ': analyze без кода');
    if (q.type === 'multiple' && q.answer.some(a => a >= q.options.length)) errs.push(q.id + ': ответ вне вариантов');
    if (q.type === 'order' && JSON.stringify(q.answer) !== JSON.stringify(q.options.map((_, i) => i))) errs.push(q.id + ': порядок');
    if (q.type === 'match' && new Set(q.pairs.map(p => p[1])).size !== q.pairs.length) errs.push(q.id + ': одинаковые пары');
    if (q.type === 'input' && !q.answer.length) errs.push(q.id + ': нет ответа');
  }
}
for (const id of Object.keys(LABS)) if (!used.has(id)) errs.push(`лаба ${id} не встроена ни в один урок`);
for (const g of GLOSSARY) if (!lessons.has(g[2])) errs.push(`глоссарий: ${g[0]} → ${g[2]}`);
console.log(`модулей ${MODULES.length}, уроков ${lessons.size}, вопросов ${ids.size}, лаб ${Object.keys(LABS).length}, заданий ${Object.values(LABS).reduce((n, l) => n + l.tasks.length, 0)}, терминов ${GLOSSARY.length}`);
console.log(errs.length ? errs.join('\n') : 'OK');
if (errs.length) process.exitCode = 1;
