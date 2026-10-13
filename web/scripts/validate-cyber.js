// Проверка контента курса ИБ: npm run validate
// Сверяет модули со structure.json, формат и id вопросов, длину уроков, ссылки глоссария и наличие ссылок roadmap.sh.
import { readFileSync } from 'node:fs';
const { MODULES, GLOSSARY, RES } = await import('../courses/cyber-security/content.js');
const st = JSON.parse(readFileSync(new URL('../../docs/cyber-security/structure.json', import.meta.url), 'utf8'));
const ctx = { MODULES, GLOSSARY, RES, __w: [] };
const errs=[];const ids=new Set();const E=m=>errs.push(m);
const chkQ=(q,where)=>{
  if(ids.has(q.id))E('dup id '+q.id);ids.add(q.id);
  if(!q.prompt||!q.explanation)E(q.id+' no prompt/explanation');
  if(![1,2,3].includes(q.difficulty))E(q.id+' difficulty');
  switch(q.type){
    case 'single':case 'analyze': if(!Array.isArray(q.options)||q.options.length<3||!(q.answer>=0&&q.answer<q.options.length))E(q.id+' bad single');if(q.type==='analyze'&&!q.code)E(q.id+' analyze w/o code');break;
    case 'multiple': if(!Array.isArray(q.answer)||q.answer.length<2||q.answer.some(a=>a>=q.options.length))E(q.id+' bad multiple');break;
    case 'order': if(JSON.stringify(q.answer)!==JSON.stringify(q.options.map((_,i)=>i)))E(q.id+' bad order');break;
    case 'match': if(!Array.isArray(q.pairs)||q.pairs.length<3||new Set(q.pairs.map(p=>p[1])).size!==q.pairs.length)E(q.id+' bad match');break;
    case 'input': if(!Array.isArray(q.answer)||!q.answer.length)E(q.id+' bad input');break;
    default:E(q.id+' unknown type '+q.type);
  }
};
const lessonIds=new Set();const types={};let len=0,n=0;
for(const m of ctx.MODULES){
  const sm=st.modules.find(x=>x.id===m.id);if(!sm){E('module not in structure '+m.id);continue;}
  if(m.title!==sm.title)E('title mismatch m'+m.id);
  if(m.lessons.length!==sm.lessons.length)E('lesson count m'+m.id);
  m.lessons.forEach((l,i)=>{const sl=sm.lessons[i];lessonIds.add(l.id);
    if(!sl||l.id!==sl.id||l.title!==sl.title||JSON.stringify(l.topics)!==JSON.stringify(sl.topics))E('lesson mismatch '+l.id);
    if(l.check.length!==2)E(l.id+' checks '+l.check.length);
    l.check.forEach((q,j)=>{if(q.id!==`q${l.id}${'ab'[j]}`)E('check id '+q.id);chkQ(q)});
    len+=l.html.length;n++;
    if(l.html.length<1400||l.html.length>4200)E(l.id+' html length '+l.html.length);
    for(const w of l.html.matchAll(/data-widget="(\w+)"/g))ctx.__w.push(w[1]);
    for(const t of l.topics)if(!ctx.RES[t])E('no RES '+t);
  });
  if(m.test.length!==12)E('m'+m.id+' tests '+m.test.length);
  m.test.forEach((q,i)=>{if(q.id!==`t${m.id}-${i+1}`)E('test id '+q.id);types[q.type]=(types[q.type]||0)+1;chkQ(q)});
}
for(const g of ctx.GLOSSARY)if(!lessonIds.has(g[2]))E('glossary ref '+g[0]+' '+g[2]);
const gn=ctx.GLOSSARY.map(g=>g[0].toLowerCase());if(new Set(gn).size!==gn.length)E('glossary dup');
console.log('modules',ctx.MODULES.length,'lessons',n,'avg html',Math.round(len/n),'questions',ids.size,'glossary',ctx.GLOSSARY.length,'test types',types,'widgets',ctx.__w);
console.log(errs.length?errs.join('\n'):'OK');
