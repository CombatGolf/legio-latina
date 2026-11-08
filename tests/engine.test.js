import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { lessons, units } from '../src/data.js';
import { declensions, conjugations } from '../src/reference.js';
import { activities, completeLesson, dayDistance, dueReviews, freshState, grade, rankFor, recordAnswer, refreshState, validateState } from '../src/engine.js';

test('curso contém 6 unidades, 24 lições e 144 atividades válidas',()=>{
  assert.equal(units.length,6);assert.equal(lessons.length,24);
  const ids=new Set();
  for(const l of lessons){assert.equal(l.phrases.length,4);assert.equal(l.words.length,4);assert.ok(l.tip.length>40);const qs=activities(l);assert.equal(qs.length,6);for(const q of qs){assert.ok(!ids.has(q.id));ids.add(q.id);assert.ok(q.prompt);assert.ok(q.explain);if(q.type==='choice'){assert.equal(new Set(q.choices).size,3);assert.ok(q.choices.includes(q.answer));}if(q.type==='build')assert.equal(q.tokens.length,q.answer.replace(/[.!?]/g,'').split(' ').length);if(q.type==='match'){assert.equal(new Set(q.pairs.map(p=>p[0])).size,4);assert.equal(new Set(q.pairs.map(p=>p[1])).size,4);}assert.ok(grade(q,q.type==='match'?q.pairs:q.answer),q.id);}}
  assert.equal(ids.size,144);
});
test('erros geram revisão imediata e acertos espaçam a próxima',()=>{
  const s=freshState(),q=activities(lessons[0])[0],now=Date.now();
  recordAnswer(s,q,false,false,now);assert.equal(s.hearts,4);assert.equal(dueReviews(s,now).length,1);
  recordAnswer(s,q,true,true,now);assert.equal(s.hearts,4);assert.equal(s.reviews[q.id].stage,1);assert.equal(dueReviews(s,now).length,0);assert.equal(dueReviews(s,now+86_400_001).length,1);
});
test('corações regeneram em passos de 20 minutos até cinco',()=>{
  const s=freshState();s.hearts=2;s.heartAt=1_000;refreshState(s,1_000+40*60_000);assert.equal(s.hearts,4);refreshState(s,1_000+60*60_000);assert.equal(s.hearts,5);assert.equal(s.heartAt,null);
});
test('conclusão concede bônus uma vez e sequência respeita dia local',()=>{
  const s=freshState();const first=new Date(2026,10,7,12);const second=new Date(2026,10,8,12);assert.equal(completeLesson(s,lessons[0].id,first),true);assert.equal(completeLesson(s,lessons[0].id,first),false);assert.equal(s.xp,20);completeLesson(s,lessons[1].id,second);assert.equal(s.streak,2);assert.equal(dayDistance('2026-11-07','2026-11-08'),1);assert.equal(rankFor(600),'Centurião');
});
test('importação rejeita estrutura inválida e filtra lições desconhecidas',()=>{
  assert.throws(()=>validateState({version:2}),/inválido/);
  const s=freshState();s.completed=['i-1','inexistente'];s.reviews={'i-1-read':{stage:99,due:0},'fake':{stage:1,due:0}};const clean=validateState(s);assert.deepEqual(clean.completed,['i-1']);assert.equal(clean.reviews['i-1-read'].stage,5);
});
test('manifesto PWA inclui ícones raster compatíveis com instalação',()=>{
  const manifest=JSON.parse(readFileSync(new URL('../public/manifest.webmanifest',import.meta.url),'utf8'));
  for(const size of ['192x192','512x512']){
    const icon=manifest.icons.find(item=>item.sizes===size&&item.type==='image/png');
    assert.ok(icon,`ícone ${size}`);
    assert.ok(existsSync(new URL(`../public/${icon.src}`,import.meta.url)));
  }
});
test('tabelas de consulta cobrem casos e pessoas dos modelos ensinados',()=>{
  assert.equal(declensions.length,4);
  for(const table of declensions){assert.equal(table.rows.length,6);assert.deepEqual(table.rows.map(row=>row[0]),['Nominativo','Vocativo','Genitivo','Dativo','Acusativo','Ablativo']);}
  assert.deepEqual(declensions[2].rows[0].slice(1),declensions[2].rows[4].slice(1));
  assert.equal(conjugations.length,6);
  assert.deepEqual(conjugations[3],['nós','sumus','amāmus','vidēmus']);
});
