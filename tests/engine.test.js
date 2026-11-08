import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { classics } from '../src/classics.js';
import { readings } from '../src/readings.js';
import { lessons, units } from '../src/data.js';
import { declensions, conjugations } from '../src/reference.js';
import { activities, completeLesson, dayDistance, dueReviews, flagForReview, freshState, grade, practiceQueue, rankFor, readingActivities, recordAnswer, refreshState, validateState } from '../src/engine.js';

test('campanha e leituras têm atividades únicas, válidas e jogáveis',()=>{
  assert.equal(units.length,9);
  assert.equal(lessons.length,36);
  const ids=new Set();
  const verify=q=>{
    assert.ok(!ids.has(q.id),q.id);
    ids.add(q.id);
    assert.ok(q.prompt && q.explain,q.id);
    if(q.type==='choice'){
      assert.equal(new Set(q.choices).size,3,q.id);
      assert.ok(q.choices.includes(q.answer),q.id);
    }
    if(q.type==='build'){
      assert.equal(q.tokens.length,q.answer.match(/\p{L}+/gu).length,q.id);
    }
    if(q.type==='match'){
      assert.equal(new Set(q.pairs.map(p=>p[0])).size,4,q.id);
      assert.equal(new Set(q.pairs.map(p=>p[1])).size,4,q.id);
      assert.equal(grade(q,Array(4).fill(q.pairs[0])),false);
    }
    assert.ok(grade(q,q.type==='match'?q.pairs:q.answer),q.id);
  };
  for(const lesson of lessons){
    assert.equal(lesson.phrases.length,4);
    assert.equal(lesson.words.length,4);
    assert.ok(lesson.tip.length>40);
    const queue=activities(lesson);
    assert.equal(queue.length,9);
    queue.forEach(verify);
    assert.ok(queue.filter(q=>q.type==='text').every(q=>q.alternatives.length>0),lesson.id);
  }
  assert.equal(ids.size,324);
  readings.flatMap(readingActivities).forEach(verify);
  assert.equal(ids.size,355);
});

test('traduções aceitam variantes contextualizadas sem confundir pessoa, número ou negação',()=>{
  const queue=id=>activities(lessons.find(lesson=>lesson.id===id));
  const dativo=queue('vi-3')[2];
  assert.equal(grade(dativo,'Ao soldado, o rei dá uma espada!'),true);
  assert.equal(grade(dativo,'O soldado entrega uma espada ao rei.'),false);
  const imperfeito=queue('viii-2')[2];
  assert.equal(grade(imperfeito,'O SOLDADO estava escrevendo uma carta'),true);
  assert.equal(grade(imperfeito,'O soldado escreveu uma carta'),false);
  assert.equal(grade(imperfeito,'O soldado não escrevia uma carta'),false);
  const writing=queue('iv-3')[2];
  assert.equal(grade(writing,'Vemos um templo.'),true);
  assert.equal(grade(writing,'Vê um templo.'),false);
  assert.equal(grade(writing,'!'),false);
  assert.equal(grade(queue('vii-4')[3],''),false);
});

test('comparação neutra põe o item em revisão sem débito ou XP',()=>{
  const state=freshState();
  const item=activities(lessons[0])[2];
  flagForReview(state,item);
  assert.equal(state.xp,0);
  assert.equal(state.hearts,5);
  assert.equal(state.stats.wrong,0);
  assert.equal(dueReviews(state)[0].id,item.id);
  assert.equal(practiceQueue(state)[0].id,item.id);
  assert.ok(practiceQueue(state).length>5);
});

test('progresso antigo e resposta pendente sobrevivem à migração',()=>{
  const legacy=freshState();
  delete legacy.readings;
  legacy.session={lessonId:'ii-1',index:5,correct:5,wrong:0};
  assert.equal(validateState(legacy).session.index,5);
  assert.deepEqual(validateState(legacy).readings,[]);
  legacy.session={lessonId:'ii-1',index:8,correct:7,wrong:1,feedback:{status:'compare',response:'A estrada é comprida.'}};
  assert.deepEqual(validateState(legacy).session,legacy.session);
});

test('todas as palavras dos clássicos têm análise no próprio contexto',()=>{
  for(const text of classics){
    assert.ok(text.paragraphs.length>=2);
    assert.ok(text.paragraphs.flatMap(p=>p.words).length>=80);
    for(const {translation,words} of text.paragraphs){
      assert.ok(translation.length>100);
      for(const token of words){
        for(const field of ['word','lemma','general','context','role'])assert.ok(token[field],token.surface);
        assert.match(token.word,/^\p{L}+$/u);
      }
    }
  }
  const quod=classics[0].paragraphs.flatMap(p=>p.words).filter(token=>token.word==='quod');
  assert.equal(quod.length,2);
  assert.notEqual(quod[0].role,quod[1].role);
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
  assert.equal(declensions.length,6);
  for(const table of declensions){assert.equal(table.rows.length,6);assert.deepEqual(table.rows.map(row=>row[0]),['Nominativo','Vocativo','Genitivo','Dativo','Acusativo','Ablativo']);}
  assert.deepEqual(declensions[2].rows[0].slice(1),declensions[2].rows[4].slice(1));
  assert.equal(conjugations.length,6);
  assert.deepEqual(conjugations[3],['nós','sumus','amāmus','vidēmus']);
});
