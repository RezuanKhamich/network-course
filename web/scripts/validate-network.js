// Структурная проверка курса. Смысловую связь вопроса с теорией проверяет редактор.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { MODULES, GLOSSARY } from '../courses/network/content.js';

const expectedLessons = [4, 4, 4, 5, 4, 5, 4, 6, 5, 6, 6, 5, 5];
const expectedTests = [12, 12, 12, 13, 12, 12, 12, 13, 13, 13, 13, 12, 13];
const ids = new Set(), lessons = new Map();
const courseSource = await readFile(new URL('../courses/network/course.js', import.meta.url), 'utf8');
const widgets = new Set([...courseSource.matchAll(/^  (\w+)\(el\)/gm)].map(m => m[1]));
const voidTags = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'wbr', 'source', 'area', 'base', 'embed', 'col', 'param', 'track']);

function htmlCheck(html, id) {
  const stack = [];
  for (const match of html.matchAll(/<\/?([a-z][\w-]*)\b[^>]*>/gi)) {
    const tag = match[1].toLowerCase();
    if (voidTags.has(tag) || match[0].endsWith('/>')) continue;
    if (match[0].startsWith('</')) assert.equal(stack.pop(), tag, `${id}: неверная вложенность ${match[0]}`);
    else stack.push(tag);
  }
  assert.equal(stack.length, 0, `${id}: незакрытые теги ${stack}`);
  for (const [, name] of html.matchAll(/data-widget="(\w+)"/g)) assert(widgets.has(name), `${id}: неизвестный виджет ${name}`);
  assert(!html.includes('${'), `${id}: необработанная подстановка`);
}

function questionCheck(q, module, selfLesson) {
  assert(!ids.has(q.id), `Повтор id: ${q.id}`); ids.add(q.id);
  assert(q.prompt?.trim() && q.explanation?.trim(), `${q.id}: нет условия или объяснения`);
  assert(module.lessons.some(l => l.id === q.lessonId), `${q.id}: неверный источник ${q.lessonId}`);
  if (selfLesson) assert.equal(q.lessonId, selfLesson.id, `${q.id}: самопроверка другого урока`);
  else assert([1, 2, 3].includes(q.difficulty), `${q.id}: сложность`);
  if (['single', 'analyze', 'multiple', 'order'].includes(q.type)) {
    assert(q.options?.length >= 2 && new Set(q.options).size === q.options.length, `${q.id}: варианты`);
  }
  const indexValid = i => Number.isInteger(i) && i >= 0 && i < q.options.length;
  switch (q.type) {
    case 'analyze': assert(q.code?.trim(), `${q.id}: нет фрагмента для анализа`);
      // falls through
    case 'single': assert(indexValid(q.answer), `${q.id}: индекс ответа`); break;
    case 'multiple':
      assert(q.answer.length > 1 && q.answer.every(indexValid), `${q.id}: ответы`);
      assert.equal(new Set(q.answer).size, q.answer.length, `${q.id}: дубли ответов`); break;
    case 'order': assert.deepEqual([...q.answer].sort((a,b) => a-b), q.options.map((_,i) => i), `${q.id}: порядок`); break;
    case 'match':
      assert(q.pairs.length >= 2 && q.pairs.every(p => p.length === 2 && p.every(Boolean)), `${q.id}: пары`);
      assert.equal(new Set(q.pairs.map(p => p[1])).size, q.pairs.length, `${q.id}: неоднозначные пары`); break;
    case 'input': assert(q.answer?.length && q.answer.every(a => typeof a === 'string' && a.trim()), `${q.id}: ответ для ввода`); break;
    default: assert.fail(`${q.id}: неизвестный тип ${q.type}`);
  }
}

assert.equal(MODULES.length, expectedLessons.length);
for (const [i,m] of MODULES.entries()) {
  assert.equal(m.id, i);
  assert.equal(m.lessons.length, expectedLessons[i]);
  assert.equal(m.test.length, expectedTests[i]);
  for (const [j,l] of m.lessons.entries()) {
    assert.equal(l.id, `${i}-${j+1}`); lessons.set(l.id,l);
    htmlCheck(l.html,l.id);
    assert(l.html.includes('class="lead"'), `${l.id}: нет вводной связи`);
    assert.equal(l.check.length, 2);
    l.check.forEach((q,k) => {
      assert.equal(q.id, `q${l.id}${'ab'[k]}`);
      questionCheck(q,m,l);
    });
  }
  m.test.forEach((q,k) => {
    assert.equal(q.id, `t${m.id}-${k+1}`);
    questionCheck(q,m);
  });
}
for (const [name,,id] of GLOSSARY) assert(lessons.has(id), `Глоссарий ${name}: ${id}`);
assert.equal(new Set(GLOSSARY.map(([name]) => name.toLowerCase())).size, GLOSSARY.length, 'Повтор названия термина в глоссарии');
console.log(`Сети: ${MODULES.length} модулей, ${lessons.size} урока, ${ids.size} вопросов; HTML, ответы, источники и виджеты — OK.`);
