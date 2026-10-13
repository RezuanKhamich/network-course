// Каталог курсов для сервера: какие уроки, вопросы самопроверки и модули существуют.
// Сервер по нему пересчитывает XP рейтинга и не верит выдуманным идентификаторам.
// npm run catalog — перегенерировать после изменения контента; CI проверяет, что файл актуален.
import { readdirSync, writeFileSync } from 'node:fs';

const root = new URL('../courses/', import.meta.url);
const out = new URL('../../server/src/catalog.json', import.meta.url);
const courses = {};
for (const id of readdirSync(root, { withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name).sort()){
  const { MODULES } = await import(new URL(`${id}/content.js`, root));
  const c = { modules: {}, lessons: {}, checks: [] };
  for (const m of [...MODULES].sort((a, b) => a.id - b.id)){
    c.modules[m.id] = m.title;
    for (const l of m.lessons){
      c.lessons[l.id] = m.id;
      for (const q of l.check || []) c.checks.push(q.id);
    }
  }
  courses[id] = c;
}
writeFileSync(out, JSON.stringify({ courses }, null, 1) + '\n');
console.log('catalog:', Object.entries(courses).map(([id, c]) => `${id} ${Object.keys(c.lessons).length} уроков`).join(', '));
