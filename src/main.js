import './style.css';
import { units, lessons } from './data.js';
import { readings } from './readings.js';
import { classics } from './classics.js';
import { declensions, conjugations, verbTenses } from './reference.js';
import { activities, achievements, completeLesson, dueReviews, flagForReview, grade, HEART_WAIT, levelFor, loadState, localDay, normalize, practiceQueue, rankFor, readingActivities, recordAnswer, refreshState, saveState, validateState } from './engine.js';

const app=document.querySelector('#app');
let state=refreshState(loadState());
let view='home', session=null, feedback=null, bank=[], matched=[], selectedMatch=null, voices=[], notice='', noticeTimer, openReading=null;
const classicById=id=>classics.find(text=>text.id===id);
const readingById=id=>readings.find(text=>text.id===id);
const nativeApp=window.LegioAndroid;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const lessonById=id=>lessons.find(l=>l.id===id);
const unitFor=l=>units.find(u=>u.id===l.unitId);
const persist=()=>{if(!saveState(state)) notice='Não foi possível salvar neste navegador. Exporte seu progresso regularmente.';};
const pct=(a,b)=>Math.min(100,Math.round(a/b*100));
const basePath=import.meta.env.BASE_URL;
const icon=(name)=>({home:'⌂',course:'▦',review:'⟲',library:'▤',lexicon:'⌕',stats:'◈',settings:'⚙'})[name]||'•';
const nav=[['home','Início'],['course','Campanha'],['review','Revisão'],['library','Leituras'],['lexicon','Vocabulário'],['stats','Progresso'],['settings','Ajustes']];
function setView(next) {
  view=next; feedback=null; session=null;
  const pendingUnit=window.pendingUnit;
  render();
  if(!pendingUnit)window.scrollTo({top:0});
}
function toast(message) {
  notice=message;
  document.querySelector('#notice-slot').innerHTML=banner();
  clearTimeout(noticeTimer);
  noticeTimer=setTimeout(()=>{
    notice='';
    document.querySelector('#notice-slot')?.replaceChildren();
  },4200);
}
function saveSession() {
  if(session?.mode==='lesson') {
    state.session={
      lessonId:session.lesson.id,index:session.index,correct:session.correct,
      wrong:session.wrong,feedback
    };
  }
  persist();
}
function leavePlay() {
  setView(session.mode==='reading'?'library':session.mode==='lesson'?'course':session.back??'review');
}
if(nativeApp)window.legioBack=()=>{
  const dialog=document.querySelector('dialog[open]');
  if(dialog)dialog.close();
  else if(view==='play')leavePlay();
  else if(view==='library'&&openReading){openReading=null;setView('library');}
  else if(view!=='home')setView('home');
  else return false;
  return true;
};
function current(){return session?.queue[session.index];}
function startLesson(id) {
  const lesson=lessonById(id);
  if(!lesson)return;
  const idx=lessons.indexOf(lesson);
  if(idx>0&&!state.completed.includes(lessons[idx-1].id)){
    toast('Conclua a lição anterior para avançar.');
    return;
  }
  refreshState(state);
  const old=state.session?.lessonId===id?state.session:null;
  if(!old&&state.hearts===0){
    setView('review');
    toast('Treine para recuperar um coração e começar outra lição.');
    return;
  }
  startSession({
    mode:'lesson',lesson,queue:activities(lesson),index:old?.index??0,
    correct:old?.correct??0,wrong:old?.wrong??0
  },old?.feedback??null);
  saveSession();
}
function startSession(config, savedFeedback=null) {
  session={index:0,correct:0,wrong:0,...config};
  view='play'; feedback=savedFeedback; bank=[]; matched=[]; selectedMatch=null;
  render();
  window.scrollTo({top:0});
}
function startReview(practice=false) {
  refreshState(state);
  const queue=dueReviews(state).slice(0,12);
  startSession(practice||!queue.length ? {mode:'practice',queue:practiceQueue(state)} : {mode:'review',queue});
}
function startReading(id) {
  const reading=readingById(id);
  if(reading) startSession({mode:'reading',reading,queue:readingActivities(reading)});
}
function finish() {
  const {mode,correct,queue}=session;
  let title,body;
  const score=`${correct} de ${queue.length} atividades corretas.`;
  if(mode==='lesson'){
    const first=completeLesson(state,session.lesson.id);
    title=first?'Lição conquistada':'Treino concluído';
    body=score+(first?' Bônus de 20 XP!':'');
  }else if(mode==='reading'){
    if(correct===queue.length&&!state.readings.includes(session.reading.id))state.readings.push(session.reading.id);
    title=correct===queue.length?'Leitura dominada':'Leitura concluída';
    body=score;
  }else if(mode==='practice'&&correct>=3&&state.hearts<5){
    state.hearts++;
    if(state.hearts===5)state.heartAt=null;
    title='Coração recuperado';
    body=score+' Você recebeu 1 coração.';
  }else{
    title=mode==='practice'?'Treino concluído':'Revisão concluída';
    body=score;
  }
  persist();
  session={mode:'done',title,body,back:mode==='reading'?'library':mode==='lesson'?'course':'review'};
  feedback=null;
  render();
  document.querySelector('.result h1')?.focus();
}
function next() {
  if(!feedback||feedback.status==='compare')return;
  feedback=null;bank=[];matched=[];selectedMatch=null;
  session.index++;
  if(session.index>=session.queue.length)finish();
  else{
    saveSession();
    render();
    document.querySelector('#question-title')?.focus();
  }
}
function finalizeAnswer(correct,response) {
  recordAnswer(state,current(),correct,session.mode!=='lesson');
  session[correct?'correct':'wrong']++;
  feedback={status:correct?'correct':'wrong',response};
  saveSession();
  render();
  document.querySelector('#answer-feedback')?.focus();
}
function submit(response) {
  const item=current();
  if(!item||feedback)return;
  const display=typeof response==='string'?response.trim().slice(0,350):'';
  if(['text','cloze','build'].includes(item.type)&&!normalize(display)){
    toast('Digite ou monte uma resposta antes de verificar.');
    return;
  }
  const correct=grade(item,response);
  if(!correct&&item.type==='text'){
    feedback={status:'compare',response:display};
    saveSession();
    render();
    document.querySelector('#answer-feedback')?.focus();
    return;
  }
  finalizeAnswer(correct,display);
}
function speak(text){if(nativeApp){nativeApp.speak(text,state.settings.rate);return;}if(!('speechSynthesis' in window)){toast('Síntese de voz indisponível neste navegador.');return;}const selected=state.settings.voice;let voice=voices.find(v=>v.voiceURI===selected);if(!voice){voice=voices.find(v=>/^la[-_]/i.test(v.lang))||voices.find(v=>/^it[-_]/i.test(v.lang))||voices.find(v=>/^pt[-_]/i.test(v.lang));}if(!voice){toast('Nenhuma voz instalada foi encontrada.');return;}speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=state.settings.rate;speechSynthesis.speak(utterance);}
function voiceStatus(){if(nativeApp)return 'Áudio do sintetizador do Android. A pronúncia depende da voz instalada.';const v=voices.find(v=>v.voiceURI===state.settings.voice)||voices.find(v=>/^la[-_]/i.test(v.lang));if(v)return /^la[-_]/i.test(v.lang)?`Voz latina detectada: ${v.name}. A pronúncia clássica ainda não é garantida.`:`Voz ${v.name} (${v.lang}): leitura aproximada, não avalia a pronúncia clássica.`;return voices.length?'Nenhuma voz latina detectada. O áudio usa uma voz italiana ou portuguesa aproximada.':'Nenhuma voz disponível neste navegador.';}
function header(){return `<aside class="sidebar"><div class="brand"><span class="brand-mark">LL</span><div><strong>LEGIO LATINA</strong><small>AD VICTORIAM</small></div></div><nav aria-label="Navegação principal">${nav.map(([id,label])=>`<button type="button" data-view="${id}" class="nav-item ${view===id?'active':''}" ${view==='play'?'':'aria-current="'+(view===id?'page':'false')+'"'}><span aria-hidden="true">${icon(id)}</span>${label}</button>`).join('')}</nav><div class="side-foot"><span>✦</span> Disciplina vence o tempo.</div></aside>`;}
function top(){return `<header class="topbar"><button type="button" class="mobile-brand" data-view="home" aria-label="Ir para início"><span class="brand-mark">LL</span><strong>LEGIO LATINA</strong></button><div class="topbar-right"><span class="stat-pill" title="Sequência de dias">🔥 ${state.streak}</span><span class="stat-pill" title="Experiência">✦ ${state.xp} XP</span><span class="stat-pill hearts" title="Corações">♥ ${state.hearts}/5</span></div></header>`;}
function banner(){return notice?`<div class="notice" role="status">${esc(notice)}</div>`:'';}
function home(){const next=lessons.find(l=>!state.completed.includes(l.id))||lessons.at(-1);const done=state.completed.length;const due=dueReviews(state).length;return `<div class="page-head"><span class="eyebrow">CAMPANHA DE LATIM CLÁSSICO</span><h1>Salvē, <em>recruta.</em></h1><p>Uma palavra por vez. Uma conquista por dia.</p></div><section class="hero"><div class="hero-copy"><span class="chapter-label">✦ SUA PRÓXIMA MISSÃO</span><h2>${esc(next.title)}</h2><p>${esc(unitFor(next).title)} · ${esc(next.focus)}</p><div class="hero-actions"><button class="primary" data-lesson="${next.id}">${done===lessons.length?'Repetir última lição':'Continuar campanha'} <span>→</span></button>${due?`<button class="ghost" data-action="review">Revisar ${due} item${due>1?'s':''}</button>`:''}</div></div><div class="hero-emblem" aria-hidden="true"><div class="laurel">❧</div><span>VI</span><small>LEGIO</small></div></section><div class="dashboard-grid"><section class="panel progress-panel"><div class="section-heading"><div><span class="eyebrow">JORNADA</span><h2>Seu avanço</h2></div><span class="badge">${rankFor(state.xp)}</span></div><div class="big-progress"><strong>${done}<small> / ${lessons.length}</small></strong><span>lições concluídas</span></div><div class="progress-track"><div style="width:${pct(done,lessons.length)}%"></div></div><div class="micro-stats"><span>Nível ${levelFor(state.xp)}</span><span>${pct(done,lessons.length)}% da campanha</span></div></section><section class="panel mission-panel"><div class="section-heading"><div><span class="eyebrow">ORDENS DO DIA</span><h2>Missões</h2></div><span class="medallion">✧</span></div>${mission('Ganhe 30 XP hoje',state.daily.xp,30)}${mission('Conclua 1 lição',state.daily.lessons,1)}${mission('Revise 3 atividades',state.daily.reviews,3)}</section></div><section class="panel reading-callout"><div><span class="eyebrow">BIBLIOTHECA</span><h2>Sêneca no original</h2><p>Toque nas palavras e acompanhe o sentido e a gramática de cada trecho.</p></div><button class="outline" data-view="library">Abrir leituras →</button></section><section class="panel roadmap-preview"><div class="section-heading"><div><span class="eyebrow">ITINERÁRIO</span><h2>Capítulos da campanha</h2></div><button class="text-button" data-view="course">Ver campanha →</button></div><div class="chapter-row">${units.map((u,i)=>`<button data-view="course" data-unit="${u.id}" class="chapter-mini ${u.lessons.every(l=>state.completed.includes(l.id))?'done':''}"><b>${u.numeral}</b><span>${esc(u.title)}</span><small>${u.lessons.filter(l=>state.completed.includes(l.id)).length}/${u.lessons.length}</small></button>`).join('')}</div></section>`;}
function mission(title,value,target){return `<div class="mission"><div class="mission-check ${value>=target?'complete':''}">${value>=target?'✓':'○'}</div><div><strong>${title}</strong><small>${Math.min(value,target)} / ${target}</small></div><div class="tiny-track"><div style="width:${pct(value,target)}%"></div></div></div>`;}
function course(){return `<div class="page-head"><span class="eyebrow">${units.length} CAPÍTULOS · ${lessons.length} LIÇÕES</span><h1>A campanha</h1><p>Avance pela língua passo a passo. Cada lição traz explicação, exemplos e nove desafios.</p></div><div class="course-list">${units.map((u,ui)=>`<section class="unit panel" id="unit-${u.id}"><div class="unit-head"><div class="unit-roman">${u.numeral}</div><div><span class="eyebrow">CAPÍTULO ${u.numeral}</span><h2>${esc(u.title)}</h2><p>${esc(u.subtitle)}</p></div><div class="unit-progress">${u.lessons.filter(l=>state.completed.includes(l.id)).length} / ${u.lessons.length}</div></div><div class="lesson-grid">${u.lessons.map(l=>{const idx=lessons.findIndex(x=>x.id===l.id),done=state.completed.includes(l.id),locked=idx>0&&!state.completed.includes(lessons[idx-1].id);return `<button class="lesson-card ${done?'done':''} ${locked?'locked':''}" data-lesson="${l.id}" ${locked?'disabled aria-label="'+esc(l.title)+' bloqueada"':''}><span class="lesson-number">${String(l.lessonIndex+1).padStart(2,'0')}</span><span class="lesson-icon">${done?'✓':locked?'⌁':'⚔'}</span><strong>${esc(l.title)}</strong><small>${esc(l.focus)}</small><span class="lesson-state">${done?'Concluída':locked?'Bloqueada':'Iniciar →'}</span></button>`}).join('')}</div></section>`).join('')}</div>`;}
function review(){const due=dueReviews(state).length;const nextHeart=state.heartAt?Math.max(0,Math.ceil((HEART_WAIT-(Date.now()-state.heartAt))/60000)):0;return `<div class="page-head"><span class="eyebrow">MEMÓRIA EM MARCHA</span><h1>Revisão</h1><p>Reveja os pontos no momento certo. Erros voltam imediatamente; acertos reaparecem em intervalos crescentes.</p></div><div class="dashboard-grid"><section class="panel review-card"><div class="review-icon">⟲</div><h2>${due} ${due===1?'item pendente':'itens pendentes'}</h2><p>${due?'Sua próxima rodada está pronta.':'Você está em dia. Pode praticar mesmo assim.'}</p><button class="primary" data-action="review" >${due?'Iniciar revisão':'Praticar agora'} →</button></section><section class="panel review-card"><div class="review-icon heart-icon">♥</div><h2>${state.hearts} de 5 corações</h2><p>${state.hearts<5?`Um coração regenera a cada 20 minutos${nextHeart?`; próximo em cerca de ${nextHeart} min`:''}. Uma prática com 3 acertos recupera mais um.`:'Seus corações estão completos.'}</p><button class="outline" data-action="practice">Treinar por coração</button></section></div><section class="panel lesson-note"><span class="eyebrow">COMO FUNCIONA</span><h2>Repetição espaçada</h2><p>Após um acerto, a atividade retorna em 1, 3, 7, 14 e 30 dias. Se errar, ela volta à lista de hoje. Revisões não gastam corações. O progresso fica salvo neste dispositivo.</p></section>`;}
function lexicon(){const found=new Map();for(const l of lessons){if(state.completed.includes(l.id))for(const [latin,pt] of l.words)found.set(latin,pt);}return `<div class="page-head"><span class="eyebrow">ARQUIVO DA LEGIO</span><h1>Vocabulário</h1><p>Formas vistas nas lições concluídas. Aprenda a reconhecer terminações e funções.</p></div><section class="panel"><div class="section-heading"><h2>${found.size} formas conhecidas</h2><span class="badge">${state.completed.length} lições</span></div>${found.size?`<label class="search-label">Buscar palavra<input id="vocab-search" type="search" placeholder="Ex.: puella" autocomplete="off"></label><div class="vocab-grid" id="vocab-results">${[...found].sort((a,b)=>a[0].localeCompare(b[0])).map(([latin,pt])=>`<div class="vocab-item" data-search="${esc((latin+' '+pt).toLowerCase())}"><strong>${esc(latin)}</strong><span>${esc(pt)}</span><button data-speak="${esc(latin)}" aria-label="Ouvir ${esc(latin)}">◖))</button></div>`).join('')}</div>`:`<div class="empty">Conclua sua primeira lição para abrir o arquivo de palavras. <button data-lesson="i-1" class="text-button">Começar →</button></div>`}</section>${referenceTables()}`;}
function referenceTables(){return `<section class="reference-section"><div class="section-heading"><div><span class="eyebrow">FORMA E FUNÇÃO</span><h2>Declinações e conjugações</h2></div></div><p class="muted">Use estas tabelas como apoio. As terminações indicam a função na frase; o genitivo ajuda a identificar a declinação.</p><div class="reference-grid">${declensions.map(d=>`<div class="panel reference-card"><h3>${esc(d.title)}</h3><p>${esc(d.note)}</p><div class="table-scroll"><table><thead><tr><th scope="col">Caso</th><th scope="col">Singular</th><th scope="col">Plural</th></tr></thead><tbody>${d.rows.map(row=>`<tr><th scope="row">${esc(row[0])}</th><td>${esc(row[1])}</td><td>${esc(row[2])}</td></tr>`).join('')}</tbody></table></div></div>`).join('')}</div><div class="panel reference-card verb-card"><h3>Presente do indicativo</h3><p>Compare o verbo irregular esse com a 1ª conjugação (amāre) e a 2ª (vidēre).</p><div class="table-scroll"><table><thead><tr><th scope="col">Pessoa</th><th scope="col">esse · ser</th><th scope="col">amāre · amar</th><th scope="col">vidēre · ver</th></tr></thead><tbody>${conjugations.map(row=>`<tr><th scope="row">${esc(row[0])}</th><td>${esc(row[1])}</td><td>${esc(row[2])}</td><td>${esc(row[3])}</td></tr>`).join('')}</tbody></table></div></div><div class="panel reference-card verb-card"><h3>Quatro tempos de scrībere</h3><p>Compare “escreve”, “escrevia”, “escreveu” e “escreverá”.</p><div class="table-scroll"><table><thead><tr><th scope="col">Pessoa</th><th scope="col">Presente</th><th scope="col">Imperfeito</th><th scope="col">Perfeito</th><th scope="col">Futuro</th></tr></thead><tbody>${verbTenses.map(([person,...forms])=>`<tr><th scope="row">${esc(person)}</th>${forms.map(form=>`<td lang="la">${esc(form)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div></section>`; }
function library() {
  const classic=classicById(openReading);
  const reading=readingById(openReading);
  const back='<button class="text-button" data-view="library">← Todas as leituras</button>';
  if(classic){
    let index=0;
    return `<div class="page-head">${back}<span class="eyebrow">${esc(classic.author)} · ${esc(classic.reference)}</span><h1>${esc(classic.title)}</h1><p>${esc(classic.intro)}</p></div>
      <section class="panel reading-panel"><p class="muted">Toque em qualquer palavra para abrir a ficha. Cada ocorrência é analisada dentro da própria frase.</p>
        ${classic.paragraphs.map((paragraph,i)=>`<article class="classic-paragraph">
          <p class="classic-latin" lang="la">${paragraph.words.map(token=>`<button class="reading-word" data-word="${index++}" aria-haspopup="dialog">${esc(token.word)}</button>${esc(token.surface.slice(token.word.length))}`).join(' ')}</p>
          <details class="reading-translation"><summary>Mostrar tradução · parágrafo ${i+1}</summary><p>${esc(paragraph.translation)}</p></details>
        </article>`).join('')}
        <p class="small-note"><a class="text-button" href="${esc(classic.source)}" target="_blank" rel="noopener">Consultar o texto latino ↗</a> · Tradução e análise do Legio Latina</p>
      </section>
      <dialog class="word-dialog" id="word-dialog" aria-labelledby="word-title">
        <form method="dialog"><button class="back-button word-close" aria-label="Fechar ficha">×</button></form>
        <div id="word-detail"></div>
        <div class="word-nav"><button class="outline" data-word-prev>← Anterior</button><button class="outline" data-word-next>Próxima →</button></div>
      </dialog>`;
  }
  if(reading)return `<div class="page-head">${back}<span class="eyebrow">LEITURA GUIADA · CAPÍTULO ${reading.level}</span><h1>${esc(reading.title)}</h1><p>${esc(reading.intro)}</p></div>
    <section class="panel reading-panel">
      ${reading.lines.map(line=>`<article class="guided-line"><p lang="la">${esc(line.latin)}</p><button class="audio-button" data-speak="${esc(line.latin)}">◖)) Ouvir</button>
        <details class="reading-translation"><summary>Tradução e análise</summary><p>${esc(line.pt)}</p><p class="muted">${esc(line.note)}</p></details></article>`).join('')}
      ${reading.source?`<p><a class="text-button" href="${esc(reading.source.url)}" target="_blank" rel="noopener">${esc(reading.source.label)} ↗</a></p>`:''}
      <button class="primary" data-read-quiz="${reading.id}">Testar compreensão · ${reading.lines.length} desafios →</button>
    </section>`;
  return `<div class="page-head"><span class="eyebrow">BIBLIOTHECA</span><h1>Leituras</h1><p>Abra uma cena guiada ou leia Sêneca no original com análise palavra por palavra.</p></div>
    <section class="panel reading-panel"><div class="section-heading"><h2>Filosofia no original</h2><span class="badge">Palavra por palavra</span></div>
      <div class="reading-grid">${classics.map(text=>`<button class="lesson-card" data-reading="${text.id}"><span class="eyebrow">${esc(text.author)}</span><strong>${esc(text.title)}</strong><small>${esc(text.reference)}</small><span class="lesson-state">${text.paragraphs.reduce((sum,p)=>sum+p.words.length,0)} palavras anotadas →</span></button>`).join('')}</div></section>
    <section class="panel reading-panel"><div class="section-heading"><h2>Leituras guiadas</h2><span class="badge">${state.readings.length}/${readings.length} dominadas</span></div>
      <div class="reading-grid">${readings.map(reading=>`<button class="lesson-card ${state.readings.includes(reading.id)?'done':''}" data-reading="${reading.id}"><span class="eyebrow">CAPÍTULO ${reading.level}</span><strong>${esc(reading.title)}</strong><small>${esc(reading.intro)}</small><span class="lesson-state">${state.readings.includes(reading.id)?'✓ Dominada':'Ler →'}</span></button>`).join('')}</div></section>`;
}
function openWord(index) {
  const dialog=document.querySelector('#word-dialog');
  const words=classicById(openReading)?.paragraphs.flatMap(paragraph=>paragraph.words);
  const token=words?.[index];
  if(!dialog||!token)return;
  dialog.querySelector('#word-detail').innerHTML=`<p class="eyebrow">PALAVRA ${index+1} DE ${words.length}</p>
    <h2 id="word-title" lang="la">${esc(token.word)}</h2>
    <p class="muted">Forma de dicionário <b lang="la">${esc(token.lemma)}</b></p>
    <dl class="word-gloss">
      <dt>Sentido geral</dt><dd>${esc(token.general)}</dd>
      <dt>Neste trecho</dt><dd>${esc(token.context)}</dd>
      <dt>Função na frase</dt><dd>${esc(token.role)}</dd>
    </dl>`;
  const previous=dialog.querySelector('[data-word-prev]');
  const nextWord=dialog.querySelector('[data-word-next]');
  previous.disabled=index===0;
  previous.onclick=()=>openWord(index-1);
  nextWord.disabled=index===words.length-1;
  nextWord.onclick=()=>openWord(index+1);
  if(!dialog.open)dialog.showModal();
}
function stats(){const done=state.completed.length;const total=state.stats.correct+state.stats.wrong;return `<div class="page-head"><span class="eyebrow">TABULARIUM</span><h1>Seu progresso</h1><p>Suas vitórias, sem atalhos.</p></div><div class="stat-grid"><div class="panel stat-card"><span>EXPERIÊNCIA</span><strong>${state.xp}</strong><small>XP conquistados</small></div><div class="panel stat-card"><span>PATENTE</span><strong class="rank-name">${rankFor(state.xp)}</strong><small>Nível ${levelFor(state.xp)}</small></div><div class="panel stat-card"><span>SEQUÊNCIA</span><strong>${state.streak}</strong><small>${state.streak===1?'dia':'dias'} de estudo</small></div><div class="panel stat-card"><span>PRECISÃO</span><strong>${total?pct(state.stats.correct,total):0}%</strong><small>${state.stats.correct} acertos · ${state.stats.wrong} erros</small></div></div><section class="panel achievements"><div class="section-heading"><div><span class="eyebrow">HONRARIAS</span><h2>Conquistas</h2></div><span class="badge">${achievements(state).filter(a=>a[2]).length}/6</span></div><div class="achievement-grid">${achievements(state).map(([name,desc,won])=>`<div class="achievement ${won?'won':''}"><span>${won?'✦':'◇'}</span><div><strong>${name}</strong><small>${desc}</small></div></div>`).join('')}</div></section>`;}
function settings(){const options=voices.map(v=>`<option value="${esc(v.voiceURI)}" ${state.settings.voice===v.voiceURI?'selected':''}>${esc(v.name)} (${esc(v.lang)})${/^la[-_]/i.test(v.lang)?' · latim':''}</option>`).join('');return `<div class="page-head"><span class="eyebrow">EQUIPAMENTO</span><h1>Ajustes</h1><p>Personalize o áudio e mantenha uma cópia do progresso.</p></div><section class="panel settings-panel"><h2>Pronúncia</h2><p class="muted">A pronúncia clássica reconstruída distingue, entre outras coisas, c sempre como /k/ e v consonantal próximo de /w/. Vozes de latim eclesiástico podem soar diferentes.</p>${nativeApp?'<p class="small-note">O Android escolhe a voz no sintetizador do aparelho.</p>':'<label>Voz disponível<select id="voice-select"><option value="auto">Automática (latim se houver)</option>'+options+'</select></label>'}<label>Velocidade <output id="rate-output">${state.settings.rate.toFixed(2)}×</output><input id="rate-input" type="range" min="0.65" max="1.1" step="0.05" value="${state.settings.rate}"></label><p class="voice-status" role="status">${esc(voiceStatus())}</p><button class="outline" data-speak="Salvē, amīce!">Testar áudio ◖))</button> ${nativeApp?'':'<button class="outline" data-action="mic">Treinar fala</button>'}<div class="pronounce-note"><strong>Guia rápido da pronúncia clássica</strong><span>Caesar ≈ “Kái-sar” · vīnum ≈ “uí-num” · ae ≈ “ai”. É um guia aproximado; a quantidade vocálica e a acentuação também importam.</span></div>${nativeApp?'':'<p class="small-note">O treino de fala tenta reconhecer “Salvē, amīce!”. O navegador pode não aceitar latim; a transcrição não recebe nota.</p>'}</section><section class="panel settings-panel"><h2>Seu progresso</h2><p class="muted">Os dados ficam no armazenamento local deste navegador e não são sincronizados entre dispositivos.</p><div class="settings-actions"><button class="outline" data-action="export">Exportar JSON</button><button class="outline" data-action="import">Importar JSON</button><input id="import-file" type="file" accept="application/json,.json" hidden></div><p class="small-note">Importar substitui o progresso atual após você escolher o arquivo. Guarde uma exportação antes de trocar de aparelho ou limpar o navegador.</p></section><section class="panel settings-panel"><h2>Sobre o curso</h2><p class="muted">${lessons.length} lições de latim clássico, revisão espaçada, cinco declinações e uma biblioteca de leituras graduadas e textos originais de autores antigos.</p><a class="text-button" href="https://dcc.dickinson.edu/grammar/latin" target="_blank" rel="noopener">Referência gramatical: Dickinson College Commentaries ↗</a></section>`;}
function examples(lesson) {
  return `<details class="lesson-tip" ${session.index===0?'open':''}>
    <summary>Explicação · ${esc(lesson.focus)}</summary>
    <p>${esc(lesson.tip)}</p>
    <details class="worked-examples"><summary>Frases comentadas e glossário</summary>
      <dl>${lesson.phrases.map(([la,pt])=>`<dt lang="la">${esc(la)}</dt><dd>${esc(pt)}</dd>`).join('')}</dl>
      <p>${lesson.words.map(([la,pt])=>`<b lang="la">${esc(la)}</b> = ${esc(pt)}`).join(' · ')}</p>
    </details>
  </details>`;
}
function feedbackPanel(item) {
  if(!feedback)return '';
  const {status,response}=feedback;
  const title={correct:'Bene! Resposta aceita.',wrong:'Confira a forma esperada',compare:'Compare a sua tradução'}[status];
  return `<div class="feedback ${status==='correct'?'correct':status==='wrong'?'incorrect':'comparison'}" id="answer-feedback" tabindex="-1">
    <strong>${title}</strong>
    ${response?`<p>Sua resposta <b>${esc(response)}</b></p>`:''}
    ${item.type!=='match'?`<p>Modelo <b>${esc(item.answer)}</b></p>`:''}
    ${status==='compare'?'<p>Sua versão pode ser válida. Compare quem faz a ação, o que acontece e em que tempo. Se o sentido for o mesmo, avance e guarde a frase para revisão.</p>':''}
    <p>${esc(item.explain)}</p>
    ${item.alternatives?.length?`<details><summary>Outras traduções aceitas</summary><ul>${item.alternatives.map(answer=>`<li>${esc(answer)}</li>`).join('')}</ul></details>`:''}
  </div>`;
}
function play() {
  if(session.mode==='done')return `<div class="result panel"><div class="result-seal">✦</div><span class="eyebrow">RELATÓRIO</span><h1 tabindex="-1">${esc(session.title)}</h1><p>${esc(session.body)}</p><button class="primary" data-view="${session.back}">Voltar →</button></div>`;
  const item=current(), active=session.mode==='lesson';
  const label=active?session.lesson.title:session.mode==='reading'?session.reading.title:session.mode==='practice'?'Treino misto':'Revisão';
  const hint=item.hint || (item.type==='text'?'Ache o verbo primeiro. Confira quem age, se o sujeito é singular ou plural e o que recebe a ação.':item.type==='match'?'Procure primeiro as formas cuja terminação você reconhece.':'Use a explicação da lição para eliminar as outras opções.');
  const actions=!feedback
    ? (['choice','match'].includes(item.type)?'':'<button class="primary" data-action="check">Verificar</button>')
    : feedback.status==='compare'
      ? '<button class="primary" data-action="compare">Mesmo sentido · guardar para revisão</button><button class="ghost" data-action="retry">Reescrever</button><button class="ghost" data-action="mistake">Errei o sentido</button>'
      : '<button class="primary" data-action="next">Continuar →</button>';
  return `<div class="play-shell">
    <div class="play-top"><button class="back-button" data-action="leave" aria-label="Sair da atividade">←</button><div class="play-progress" role="progressbar" aria-valuenow="${session.index}" aria-valuemin="0" aria-valuemax="${session.queue.length}" aria-label="Atividades concluídas"><div style="width:${pct(session.index,session.queue.length)}%"></div></div><span class="play-count">${session.index+1}/${session.queue.length}</span></div>
    <div class="play-heading"><span class="eyebrow">${active?`LIÇÃO ${session.lesson.lessonIndex+1} · CAPÍTULO ${unitFor(session.lesson).numeral}`:'TREINAMENTO'}</span><h1>${esc(label)}</h1></div>
    ${active?examples(session.lesson):''}
    <section class="question panel">
      <div class="question-kind">${({choice:'ESCOLHA',build:'MONTE A FRASE',text:'TRADUÇÃO',cloze:'COMPLETE',match:'ASSOCIE'})[item.type]}</div>
      <h2 id="question-title" tabindex="-1">${esc(item.prompt)}</h2>
      ${item.passage?`<blockquote lang="la">${esc(item.passage)}</blockquote>`:''}
      ${item.audio?`<button class="audio-button" data-speak="${esc(item.audio)}" title="${esc(voiceStatus())}">◖)) Ouvir voz do aparelho</button>`:''}
      ${item.context?`<p class="context">Significado ${esc(item.context)}</p>`:''}
      ${!feedback?`<details class="question-hint"><summary>Dica</summary><p>${esc(hint)}</p></details>`:''}
      ${renderInput(item)}${feedbackPanel(item)}
      <div class="question-actions">${actions}</div>
    </section><p class="play-footnote">${active?`♥ ${state.hearts}/5 corações · Erros confirmados reduzem 1 coração`:'Este treino não gasta corações'}</p>
  </div>`;
}
function renderInput(item){if(item.type==='choice')return `<div class="choices">${item.choices.map((x,i)=>`<button class="choice" data-choice="${esc(x)}" ${feedback?'disabled':''}><span>${i+1}</span>${esc(x)}</button>`).join('')}</div>`;if(item.type==='build')return `<div><div class="answer-area" aria-label="Frase montada">${bank.map((x,i)=>`<button class="word-token selected" data-remove-token="${i}">${esc(x.text)}</button>`).join('')||'<span class="placeholder">Toque nas palavras para montar a frase</span>'}</div><div class="word-bank">${item.tokens.map((x,i)=>`<button class="word-token" data-add-token="${i}" ${bank.some(t=>t.index===i)?'disabled':''}>${esc(x)}</button>`).join('')}</div></div>`;if(item.type==='text'||item.type==='cloze')return `<div class="text-answer"><label for="answer-input">Sua resposta</label><input id="answer-input" type="text" maxlength="350" enterkeyhint="done" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Digite sua resposta" ${feedback?'disabled':''}><small>Maiúsculas, pontuação e acentos não alteram a correção.</small></div>`;if(item.type==='match')return `<div class="match-grid"><div>${item.pairs.map(([a],i)=>`<button class="match-button ${matched.some(x=>x[0]===a)?'matched':''} ${selectedMatch===i?'selected':''}" data-left="${i}" ${matched.some(x=>x[0]===a)||!!feedback?'disabled':''}>${esc(a)}</button>`).join('')}</div><div>${[...item.pairs].reverse().map(([,b],i)=>`<button class="match-button ${matched.some(x=>x[1]===b)?'matched':''}" data-right="${item.pairs.length-1-i}" ${matched.some(x=>x[1]===b)||!!feedback?'disabled':''}>${esc(b)}</button>`).join('')}</div></div><p class="small-note" id="match-help">Escolha uma forma à esquerda e seu significado à direita.</p>`;return '';}
function render(){refreshState(state);app.innerHTML=`${header()}<div class="main-shell">${top()}<div id="notice-slot">${banner()}</div><main id="main" tabindex="-1">${({home,course,review,library,lexicon,stats,settings,play})[view]()}</main><footer class="footer">LEGIO LATINA · Estudo privado, progresso local · <span>MMXXVI</span></footer></div><nav class="bottom-nav" aria-label="Navegação móvel">${nav.map(([id,label])=>`<button data-view="${id}" class="${view===id?'active':''}"><span>${icon(id)}</span><small>${label}</small></button>`).join('')}</nav>`;if(nativeApp)app.querySelectorAll('a[target]').forEach(link=>link.removeAttribute('target'));if(view==='course'&&window.pendingUnit){document.querySelector(`#unit-${window.pendingUnit}`)?.scrollIntoView();window.pendingUnit=null;}}
app.addEventListener('click',e=>{const button=e.target.closest('button,[data-action],.file-label');if(!button)return;if(button.dataset.view){if(button.dataset.view==='library')openReading=null;if(button.dataset.unit)window.pendingUnit=button.dataset.unit;setView(button.dataset.view);return;}if(button.dataset.reading){openReading=button.dataset.reading;setView('library');return;}
if(button.dataset.readQuiz){startReading(button.dataset.readQuiz);return;}
if(button.dataset.word){openWord(Number(button.dataset.word));return;}
if(button.dataset.lesson){startLesson(button.dataset.lesson);return;}if(button.dataset.speak){speak(button.dataset.speak);return;}if(button.dataset.choice){submit(button.dataset.choice);return;}if(button.dataset.addToken!==undefined){const item=current();const i=Number(button.dataset.addToken);bank.push({text:item.tokens[i],index:i});render();return;}if(button.dataset.removeToken!==undefined){bank.splice(Number(button.dataset.removeToken),1);render();return;}if(button.dataset.left!==undefined){selectedMatch=Number(button.dataset.left);render();return;}if(button.dataset.right!==undefined){if(selectedMatch===null)return;const item=current(),a=item.pairs[selectedMatch][0],b=item.pairs[Number(button.dataset.right)][1];if(item.pairs[selectedMatch][1]===b){matched.push([a,b]);selectedMatch=null;if(matched.length===item.pairs.length)submit(matched);else render();}else{recordAnswer(state,item,false,session.mode!=='lesson');session.wrong++;saveSession();selectedMatch=null;render();const help=document.querySelector('#match-help');if(help){help.textContent='Essa associação não corresponde. Tente outra vez.';help.setAttribute('role','status');}}return;}switch(button.dataset.action){case 'review':startReview(false);break;case 'practice':startReview(true);break;case 'mic':{const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;if(!Recognition){toast('Reconhecimento de fala indisponível neste navegador.');break;}const rec=new Recognition();rec.lang='la-VA';rec.interimResults=false;rec.onresult=event=>toast(`Transcrição: “${event.results[0][0].transcript}”. Compare com “Salvē, amīce!”.`);rec.onerror=event=>toast(`O reconhecimento não funcionou (${event.error}). O navegador pode não aceitar latim.`);try{rec.start();toast('Diga “Salvē, amīce!” quando o microfone ativar.');}catch{toast('Não foi possível iniciar o microfone.');}break;}case 'check':{const item=current();if(item.type==='build')submit(bank.map(x=>x.text).join(' '));else submit(document.querySelector('#answer-input')?.value||'');break;}case 'retry':{
  const response=feedback.response;
  feedback=null;
  saveSession();
  render();
  const input=document.querySelector('#answer-input');
  input.value=response;
  input.focus();
  break;
}case 'compare':
  flagForReview(state,current());
  feedback.status='review';
  next();
  break;
case 'mistake':finalizeAnswer(false,feedback.response);break;
case 'next':next();break;
case 'leave':leavePlay();break;case 'import':document.querySelector('#import-file')?.click();break;case 'export':{
  if(nativeApp){nativeApp.exportProgress(JSON.stringify(state,null,2));break;}
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`legio-latina-progresso-${localDay()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);break;}}});
app.addEventListener('input',e=>{if(e.target.id==='vocab-search'){const term=normalize(e.target.value);document.querySelectorAll('.vocab-item').forEach(row=>row.hidden=!normalize(row.dataset.search).includes(term));}if(e.target.id==='rate-input'){state.settings.rate=Number(e.target.value);document.querySelector('#rate-output').value=state.settings.rate.toFixed(2)+'×';persist();}});
app.addEventListener('change',async e=>{if(e.target.id==='voice-select'){state.settings.voice=e.target.value;persist();render();}if(e.target.id==='import-file'&&e.target.files?.[0]){try{if(e.target.files[0].size>1_000_000)throw new Error('O arquivo excede 1 MB.');const incoming=validateState(JSON.parse(await e.target.files[0].text()));if(!confirm('Substituir o progresso atual pelo arquivo selecionado?'))return;state=refreshState(incoming);persist();toast('Progresso importado com sucesso.');}catch(err){toast(err.message||'Não foi possível importar o arquivo.');}}});
app.addEventListener('keydown',e=>{if(e.isComposing)return;if(e.key==='Enter'&&e.target.id==='answer-input'){e.preventDefault();submit(e.target.value);}if(view==='play'&&current()?.type==='choice'&&!feedback&&/^[1-3]$/.test(e.key)&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){const chosen=current().choices[Number(e.key)-1];if(chosen)submit(chosen);}});
function updateVoices(){voices='speechSynthesis' in window?speechSynthesis.getVoices():[];if(view==='settings')render();}
if('speechSynthesis' in window){updateVoices();speechSynthesis.addEventListener?.('voiceschanged',updateVoices);}
if(!nativeApp&&'serviceWorker' in navigator&&import.meta.env.PROD)window.addEventListener('load',()=>navigator.serviceWorker.register(`${basePath}sw.js`).catch(()=>{}));
setInterval(()=>{const old=state.hearts;refreshState(state);if(old!==state.hearts){persist();document.querySelector('.stat-pill.hearts').textContent=`♥ ${state.hearts}/5`;}},30_000);
render();
