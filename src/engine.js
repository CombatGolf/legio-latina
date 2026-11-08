import { lessons, ranks } from './data.js';
import { translations } from './translations.js';
import { readings } from './readings.js';

export const STORAGE_KEY = 'legio-latina-progress-v1';
export const DAY = 86_400_000;
export const HEART_WAIT = 20 * 60_000;
const lessonMap = new Map(lessons.map(l => [l.id, l]));
export const localDay = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const dayDistance = (a,b) => Math.round((new Date(`${b}T12:00:00`) - new Date(`${a}T12:00:00`))/DAY);
export const normalize = text => String(text).normalize('NFD').replace(/\p{M}/gu,'')
  .toLowerCase().replace(/[\p{P}\p{Z}]+/gu,' ').replace(/\s+/g,' ').trim();
export const rankFor = xp => ranks.filter(([min]) => xp >= min).at(-1)[1];
export const levelFor = xp => Math.floor(xp / 100) + 1;

function shuffled(items, seed) {
  const result = [...items];
  let hash = 2166136261;
  for (const char of seed) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  for (let i = result.length - 1; i > 0; i--) {
    hash = (Math.imul(hash, 1664525) + 1013904223) >>> 0;
    const j = hash % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function choice(id, prompt, answer, options, explain, extra = {}) {
  return { id, type:'choice', prompt, answer, choices:shuffled(options,id), explain, ...extra };
}

export function activities(lesson) {
  const [a,b,c,d] = lesson.phrases;
  const words = phrase => phrase.match(/[\p{L}\p{M}]+/gu);
  const read = (phrase, suffix) => choice(
    lesson.id+suffix, `O que significa “${phrase[0]}”?`, phrase[1],
    [phrase[1], ...lesson.phrases.filter(p=>p!==phrase).slice(0,2).map(p=>p[1])],
    lesson.tip, { audio:phrase[0] }
  );
  const translate = (phrase, suffix, index) => ({
    id:lesson.id+suffix, type:'text', prompt:`Traduza para português: “${phrase[0]}”`,
    answer:phrase[1], alternatives:phrase[2] ?? translations[lesson.id]?.[index] ?? [],
    audio:phrase[0], explain:lesson.tip
  });
  const dWords = words(d[0]);
  const blank = dWords.length > 3 ? 2 : dWords.length - 1;
  const target = dWords[blank];
  let position = 0;
  const masked = d[0].replace(/[\p{L}\p{M}]+/gu,word=>position++===blank?'_____':word);
  const [word, meaning] = lesson.words[lesson.lessonIndex % lesson.words.length];
  return [
    read(a,'-read'),
    {id:lesson.id+'-build',type:'build',prompt:`Reconstrua o exemplo: “${b[1]}”`,
      answer:b[0],tokens:shuffled(words(b[0]),lesson.id+'-tokens'),explain:lesson.tip,
      hint:`O exemplo começa com “${words(b[0])[0]}”. A ordem pode variar em latim; aqui você reconstrói a frase da lição.`},
    translate(c,'-translate',0),
    {id:lesson.id+'-cloze',type:'cloze',prompt:`Complete a frase: ${masked}`,answer:target,
      context:d[1],explain:lesson.tip,hint:`A forma começa com “${target[0].toLowerCase()}” e tem ${target.length} letras. Confira a terminação.`},
    {id:lesson.id+'-match',type:'match',prompt:'Associe as formas aos significados',pairs:lesson.words,
      answer:'all',explain:'Compare as terminações e a função de cada forma.'},
    choice(lesson.id+'-grammar',lesson.quiz[0],lesson.quiz[2],lesson.quiz[1],lesson.quiz[3]),
    read(b,'-read-second'),
    choice(lesson.id+'-recall',`Qual forma do glossário corresponde a “${meaning}”?`,word,
      [word,...lesson.words.filter(([form])=>form!==word).slice(0,2).map(([form])=>form)],
      `${word} corresponde a “${meaning}”. ${lesson.tip}`),
    translate(d,'-translate-second',1)
  ];
}

export function readingActivities(reading) {
  return reading.lines.map((line,index)=>choice(
    `lectio-${reading.id}-${index}`, line.question, line.answer,
    [line.answer,...line.distractors], line.note,
    { passage:line.latin, audio:line.latin, hint:'Localize no trecho a palavra ou a forma verbal que justifica a resposta.' }
  ));
}

const activityMap = new Map([
  ...lessons.flatMap(activities),
  ...readings.flatMap(readingActivities)
].map(activity=>[activity.id,activity]));

export function practiceQueue(state, now = new Date()) {
  const seen = lessons.filter(lesson=>state.completed.includes(lesson.id) || lesson.id===state.session?.lessonId);
  const pool = (seen.length ? seen : [lessons[0]]).flatMap(activities);
  const due = dueReviews(state,now.getTime());
  const fresh = shuffled(pool,localDay(now)+state.stats.correct+':'+state.stats.wrong);
  return [...new Map([...due,...fresh].map(item=>[item.id,item])).values()].slice(0,12);
}

export function freshState() {
  return {version:1,completed:[],xp:0,hearts:5,heartAt:null,lastDay:null,streak:0,daily:{day:localDay(),xp:0,lessons:0,reviews:0},reviews:{},readings:[],stats:{correct:0,wrong:0},session:null,settings:{voice:'auto',rate:0.85}};
}
export function validateState(raw) {
  if (!raw || typeof raw !== 'object' || raw.version !== 1 || !Array.isArray(raw.completed) || !Number.isFinite(raw.xp) || typeof raw.reviews !== 'object' || !raw.reviews) throw new Error('Arquivo de progresso inválido ou incompatível.');
  const base = freshState();
  const completed = [...new Set(raw.completed.filter(id=>lessonMap.has(id)))];
  const reviews = {};
  for (const [id,v] of Object.entries(raw.reviews)) if (/^[a-z0-9-]+$/.test(id) && v && Number.isFinite(v.due) && Number.isInteger(v.stage)) reviews[id] = {due:Math.max(0,v.due),stage:Math.max(0,Math.min(5,v.stage))};
  const active = raw.session;
  const lesson = lessonMap.get(active?.lessonId);
  const count = lesson ? activities(lesson).length : 0;
  const session = Number.isInteger(active?.index) && active.index>=0 && active.index<count ? {
    lessonId:lesson.id,index:active.index,
    correct:Math.max(0,Math.min(count,Number(active.correct)||0)),
    wrong:Math.max(0,Math.min(999,Number(active.wrong)||0)),
    feedback:['correct','wrong','compare'].includes(active.feedback?.status) ? {
      status:active.feedback.status,response:typeof active.feedback.response==='string' ? active.feedback.response.slice(0,350) : ''
    } : null
  } : null;
  return {...base,completed,readings:[...new Set(Array.isArray(raw.readings)?raw.readings.filter(id=>readings.some(reading=>reading.id===id)):[])],xp:Math.max(0,Math.floor(raw.xp)),hearts:Math.max(0,Math.min(5,Math.floor(Number(raw.hearts)||0))),heartAt:Number.isFinite(raw.heartAt)?raw.heartAt:null,lastDay:/^\d{4}-\d{2}-\d{2}$/.test(raw.lastDay)?raw.lastDay:null,streak:Math.max(0,Math.floor(Number(raw.streak)||0)),daily:raw.daily?.day && /^\d{4}-\d{2}-\d{2}$/.test(raw.daily.day)?{day:raw.daily.day,xp:Math.max(0,Number(raw.daily.xp)||0),lessons:Math.max(0,Number(raw.daily.lessons)||0),reviews:Math.max(0,Number(raw.daily.reviews)||0)}:base.daily,reviews,stats:{correct:Math.max(0,Number(raw.stats?.correct)||0),wrong:Math.max(0,Number(raw.stats?.wrong)||0)},session,settings:{voice:typeof raw.settings?.voice==='string'?raw.settings.voice:'auto',rate:Math.max(.65,Math.min(1.1,Number(raw.settings?.rate)||.85))}};
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
  return Object.entries(state.reviews)
    .filter(([id,entry])=>entry.due<=now && activityMap.has(id))
    .sort(([,a],[,b])=>a.stage-b.stage || a.due-b.due)
    .map(([id])=>activityMap.get(id));
}
export function findActivity(id) { return activityMap.get(id) ?? null; }
export function grade(activity,response) {
  if (activity.type==='match') {
    return Array.isArray(response) && response.length===activity.pairs.length &&
      activity.pairs.every(([left,right])=>response.some(pair=>pair?.[0]===left && pair?.[1]===right));
  }
  const submitted = normalize(response);
  return !!submitted && [activity.answer,...(activity.alternatives ?? [])].some(answer=>normalize(answer)===submitted);
}
export function flagForReview(state,activity,now=Date.now()) {
  state.reviews[activity.id] = { stage:0, due:now };
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
    ['Campanha concluída',`Conclua as ${lessons.length} lições`,state.completed.length===lessons.length],
    ['Disciplina','Mantenha uma sequência de 7 dias',state.streak>=7],
    ['Erudito','Alcance 1.000 XP',state.xp>=1000],
    ['Sem recuar','Acerte 100 atividades',state.stats.correct>=100]
  ];
}
