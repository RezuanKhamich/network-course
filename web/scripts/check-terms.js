// Термины, которые встречаются в уроках раньше урока, где они введены: node scripts/check-terms.js <курс>
// Такие места подсвечиваются подсказкой (assets/js/terms.js), но если без термина не понять мысль — поясните его в тексте.
const id = process.argv[2] || 'network';
const { MODULES, GLOSSARY } = await import(`../courses/${id}/content.js`);
const order = MODULES.flatMap(m => m.lessons);
const pos = Object.fromEntries(order.map((l, i) => [l.id, i]));
const text = l => l.html.replace(/<[^>]+>/g, ' ');
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let total = 0; const perLesson = {}; const examples = [];
for (const [term, , where] of GLOSSARY) {
  const intro = pos[where]; if (intro == null) continue;
  const key = term.split(/[ (/]/)[0]; if (key.length < 3) continue;
  const re = new RegExp(`(^|[^\\p{L}])${esc(key)}`, 'u');
  const early = order.slice(0, intro).filter(l => re.test(text(l)));
  if (early.length) {
    total++; perLesson[early[0].id] = (perLesson[early[0].id] || 0) + 1;
    examples.push(`${term} — введён в ${where}, встречается раньше: ${early.slice(0, 3).map(l => l.id).join(', ')}`);
  }
}
console.log(id, '| терминов:', GLOSSARY.length, '| используются до объяснения:', total);
console.log(examples.slice(0, 30).join('\n'));
console.log('больше всего забеганий:', Object.entries(perLesson).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => k + ':' + v).join(' '));
