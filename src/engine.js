import { lessons, ranks } from './data.js';

export const STORAGE_KEY = 'legio-latina-progress-v1';
export const DAY = 86_400_000;
export const HEART_WAIT = 20 * 60_000;
const lessonMap = new Map(lessons.map(l => [l.id, l]));
export const localDay = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const dayDistance = (a,b) => Math.round((new Date(`${b}T12:00:00`) - new Date(`${a}T12:00:00`))/DAY);
export const normalize = text => String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[.!?;,]/g,'').replace(/\s+/g,' ').trim();
export const rankFor = xp => ranks.filter(([min]) => xp >= min).at(-1)[1];
export const levelFor = xp => Math.floor(xp / 100) + 1;

export function activities(lesson) {
  const [a,b,c,d] = lesson.phrases;
  const rotated = (items,seed) => { const offset=[...seed].reduce((n,c)=>n+c.charCodeAt(0),0)%items.length; return [...items.slice(offset),...items.slice(0,offset)]; };
  const options = (index) => rotated([lesson.phrases[index][1], ...lesson.phrases.filter((_,i)=>i!==index).slice(0,2).map(p=>p[1])],lesson.id);
  const dWords = d[0].replace(/[.!?]/g,'').split(' ');
  const blankIndex = dWords.length > 3 ? 2 : dWords.length-1;
  const missing = dWords[blankIndex];
  const masked = dWords.map((w,i)=>i===blankIndex?'_____':w).join(' ') + (/[.!?]$/.test(d[0])?d[0].at(-1):'');
  return [
    {id:`${lesson.id}-read`,type:'choice',prompt:`O que significa “${a[0]}”?`,choices:options(0),answer:a[1],audio:a[0],explain:lesson.tip},
    {id:`${lesson.id}-build`,type:'build',prompt:`Monte em latim: “${b[1]}”`,answer:b[0],tokens:b[0].replace(/[.!?]/g,'').split(' ').reverse(),explain:lesson.tip},
    {id:`${lesson.id}-translate`,type:'text',prompt:`Traduza para português: “${c[0]}”`,answer:c[1],audio:c[0],explain:lesson.tip},
    {id:`${lesson.id}-cloze`,type:'cloze',prompt:`Complete a frase: ${masked}`,answer:missing,context:d[1],explain:lesson.tip},
    {id:`${lesson.id}-match`,type:'match',prompt:'Associe as formas aos significados',pairs:lesson.words,answer:'all',explain:'Observe a forma e a função de cada palavra.'},
    {id:`${lesson.id}-grammar`,type:'choice',prompt:lesson.quiz[0],choices:rotated(lesson.quiz[1],lesson.id+'q'),answer:lesson.quiz[2],explain:lesson.quiz[3]}
  ];
}

export function freshState() {
  return {version:1,completed:[],xp:0,hearts:5,heartAt:null,lastDay:null,streak:0,daily:{day:localDay(),xp:0,lessons:0,reviews:0},reviews:{},stats:{correct:0,wrong:0},session:null,settings:{voice:'auto',rate:0.85}};
}
export function validateState(raw) {
  if (!raw || typeof raw !== 'object' || raw.version !== 1 || !Array.isArray(raw.completed) || !Number.isFinite(raw.xp) || typeof raw.reviews !== 'object' || !raw.reviews) throw new Error('Arquivo de progresso inválido ou incompatível.');
  const base = freshState();
  const completed = [...new Set(raw.completed.filter(id=>lessonMap.has(id)))];
  const reviews = {};
  for (const [id,v] of Object.entries(raw.reviews)) if (/^[a-z0-9-]+$/.test(id) && v && Number.isFinite(v.due) && Number.isInteger(v.stage)) reviews[id] = {due:Math.max(0,v.due),stage:Math.max(0,Math.min(5,v.stage))};
  const session = raw.session && lessonMap.has(raw.session.lessonId) && Number.isInteger(raw.session.index) && raw.session.index>=0 && raw.session.index<6 ? {lessonId:raw.session.lessonId,index:raw.session.index,correct:Math.max(0,Math.min(6,Number(raw.session.correct)||0)),wrong:Math.max(0,Math.min(99,Number(raw.session.wrong)||0))} : null;
  return {...base,completed,xp:Math.max(0,Math.floor(raw.xp)),hearts:Math.max(0,Math.min(5,Math.floor(Number(raw.hearts)||0))),heartAt:Number.isFinite(raw.heartAt)?raw.heartAt:null,lastDay:/^\d{4}-\d{2}-\d{2}$/.test(raw.lastDay)?raw.lastDay:null,streak:Math.max(0,Math.floor(Number(raw.streak)||0)),daily:raw.daily?.day && /^\d{4}-\d{2}-\d{2}$/.test(raw.daily.day)?{day:raw.daily.day,xp:Math.max(0,Number(raw.daily.xp)||0),lessons:Math.max(0,Number(raw.daily.lessons)||0),reviews:Math.max(0,Number(raw.daily.reviews)||0)}:base.daily,reviews,stats:{correct:Math.max(0,Number(raw.stats?.correct)||0),wrong:Math.max(0,Number(raw.stats?.wrong)||0)},session,settings:{voice:typeof raw.settings?.voice==='string'?raw.settings.voice:'auto',rate:Math.max(.65,Math.min(1.1,Number(raw.settings?.rate)||.85))}};
}
export function loadState() { try { return validateState(JSON.parse(localStorage.getItem(STORAGE_KEY))); } catch { return freshState(); } }
export function saveState(state) { try { localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); return true; } catch { return false; } }
export function refreshState(state,now=Date.now()) {
  if (state.daily.day!==localDay(new Date(now))) state.daily={day:localDay(new Date(now)),xp:0,lessons:0,reviews:0};
  if (state.hearts<5 && state.heartAt) {
    const earned=Math.floor((now-state.heartAt)/HEART_WAIT);
    if (earned>0) { state.hearts=Math.min(5,state.hearts+earned); state.heartAt=state.hearts===5?null:state.heartAt+earned*HEART_WAIT; }
  }
  return state;
}
export function dueReviews(state,now=Date.now()) {
  return Object.entries(state.reviews).filter(([id,v])=>v.due<=now && findActivity(id)).map(([id])=>findActivity(id));
}
export function findActivity(id) { const lesson=lessonMap.get(id.replace(/-(read|build|translate|cloze|match|grammar)$/,'')); return lesson ? activities(lesson).find(a=>a.id===id) : null; }
export function grade(activity,response) {
  if (activity.type==='match') return Array.isArray(response) && response.length===activity.pairs.length && response.every(([a,b])=>activity.pairs.some(([x,y])=>x===a&&y===b));
  return normalize(response)===normalize(activity.answer);
}
export function recordAnswer(state,activity,correct,reviewMode=false,now=Date.now()) {
  refreshState(state,now);
  state.stats[correct?'correct':'wrong']++;
  const prev=state.reviews[activity.id] || {stage:0,due:now};
  const stage=correct?Math.min(5,prev.stage+1):0;
  const intervals=[0,1,3,7,14,30];
  state.reviews[activity.id]={stage,due:now+(correct?intervals[stage]*DAY:0)};
  if (correct) { const points=reviewMode?4:10; state.xp+=points;state.daily.xp+=points; if(reviewMode)state.daily.reviews++; }
  else if (!reviewMode) { if(state.hearts===5) state.heartAt=now; state.hearts=Math.max(0,state.hearts-1); }
  return state;
}
export function completeLesson(state,id,now=new Date()) {
  if (!lessonMap.has(id)) throw new Error('Lição desconhecida.');
  const first=!state.completed.includes(id);
  if(first) { state.completed.push(id);state.xp+=20;state.daily.xp+=20;state.daily.lessons++; }
  const today=localDay(now);
  if(state.lastDay!==today) { state.streak=state.lastDay&&dayDistance(state.lastDay,today)===1?state.streak+1:1;state.lastDay=today; }
  state.session=null;
  return first;
}
export function achievements(state) {
  return [
    ['Primeira marcha','Conclua a primeira lição',state.completed.length>=1],
    ['Legionário dedicado','Conclua 10 lições',state.completed.length>=10],
    ['Campanha concluída','Conclua as 24 lições',state.completed.length===lessons.length],
    ['Disciplina','Mantenha uma sequência de 7 dias',state.streak>=7],
    ['Erudito','Alcance 1.000 XP',state.xp>=1000],
    ['Sem recuar','Acerte 100 atividades',state.stats.correct>=100]
  ];
}
