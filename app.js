/* ============================================================
   Bé Học · Little Learners
   Offline, no-fail early-math + English game for a 2.5yo & 4yo.
   ============================================================ */
'use strict';

/* ---------- State ---------- */
const DEFAULTS = { profile:'toddler', lang:'vi', subject:'math', voice:true, breakMins:15, stars:0 };
const state = Object.assign({}, DEFAULTS, load());
function load(){ try { return JSON.parse(localStorage.getItem('ll_state')) || {}; } catch(e){ return {}; } }
function save(){ localStorage.setItem('ll_state', JSON.stringify(state)); }

/* ---------- i18n ---------- */
const NUM = {
  vi:['không','một','hai','ba','bốn','năm','sáu','bảy','tám','chín','mười'],
  en:['zero','one','two','three','four','five','six','seven','eight','nine','ten']
};
const T = {
  vi:{
    appTitle:'Bé Học',
    subjects:{math:'Toán & Tư duy', english:'Tiếng Anh'},
    profiles:{toddler:'Bé nhỏ', preschool:'Bé lớn'},
    games:{count:'Đếm số', numeral:'Học số', shapes:'Hình khối', bigsmall:'To & Nhỏ', colors:'Màu sắc',
           odd:'Tìm cái khác', pattern:'Tiếp theo', abc:'Chữ cái ABC', words:'Từ vựng', colorsEN:'Màu sắc', shapesEN:'Hình khối'},
    prompt:{
      count:'Đếm xem có bao nhiêu?',
      numeral:(w)=>`Tìm số ${w}`,
      shapesFind:(s)=>`Chạm vào hình ${s}`,
      biggest:'Chạm vào cái TO nhất', smallest:'Chạm vào cái NHỎ nhất',
      colorFind:(c)=>`Chạm vào màu ${c}`,
      odd:'Cái nào KHÁC?', pattern:'Tiếp theo là gì?',
      abcFind:(l)=>`Tìm chữ ${l}`, wordFind:'Nghe rồi chạm vào hình đúng'
    },
    colors:{red:'đỏ', blue:'xanh dương', green:'xanh lá', yellow:'vàng', orange:'cam', purple:'tím', pink:'hồng'},
    shapes:{circle:'tròn', square:'vuông', triangle:'tam giác', star:'ngôi sao', heart:'trái tim', rect:'chữ nhật'},
    praise:['Giỏi quá!','Đúng rồi!','Tuyệt vời!','Con giỏi lắm!','Hay lắm!','Xuất sắc!'],
    tryagain:['Thử lại nhé!','Gần đúng rồi!','Chạm cái khác xem!'],
    hasCount:(w)=>`Đúng rồi, có ${w}!`,
    breakT:'Nghỉ một chút nhé!', breakS:'Con chơi giỏi lắm. Đứng dậy vươn vai nào!', breakOk:'Chơi tiếp',
    parentTitle:'Dành cho ba mẹ', gate:'Chạm vào số', langLabel:'Ngôn ngữ', voiceLabel:'Giọng đọc',
    breakLabel:'Nhắc nghỉ sau', reset:'Đặt lại số sao', done:'Xong',
    note:'Khuyến nghị (AAP): trẻ 2–5 tuổi nên dùng màn hình khoảng 1 giờ/ngày và có ba mẹ chơi cùng. Ứng dụng cố ý không có điểm hay tính giờ để bé chơi thoải mái.'
  },
  en:{
    appTitle:'Little Learners',
    subjects:{math:'Math & Thinking', english:'English'},
    profiles:{toddler:'Little one', preschool:'Big kid'},
    games:{count:'Count', numeral:'Numbers', shapes:'Shapes', bigsmall:'Big & Small', colors:'Colors',
           odd:'Odd one out', pattern:'What’s next', abc:'ABC Letters', words:'First Words', colorsEN:'Colors', shapesEN:'Shapes'},
    prompt:{
      count:'How many are there?',
      numeral:(w)=>`Find the number ${w}`,
      shapesFind:(s)=>`Tap the ${s}`,
      biggest:'Tap the BIGGEST one', smallest:'Tap the SMALLEST one',
      colorFind:(c)=>`Tap the ${c} one`,
      odd:'Which one is DIFFERENT?', pattern:'What comes next?',
      abcFind:(l)=>`Find the letter ${l}`, wordFind:'Listen, then tap the right picture'
    },
    colors:{red:'red', blue:'blue', green:'green', yellow:'yellow', orange:'orange', purple:'purple', pink:'pink'},
    shapes:{circle:'circle', square:'square', triangle:'triangle', star:'star', heart:'heart', rect:'rectangle'},
    praise:['Great job!','That’s right!','Awesome!','You did it!','Well done!','Fantastic!'],
    tryagain:['Try again!','Almost!','Tap another one!'],
    hasCount:(w)=>`Yes, there are ${w}!`,
    breakT:'Time for a little break!', breakS:'You played so well. Stand up and stretch!', breakOk:'Keep playing',
    parentTitle:'For grown-ups', gate:'Tap the number', langLabel:'Language', voiceLabel:'Voice',
    breakLabel:'Break reminder', reset:'Reset stars', done:'Done',
    note:'AAP guidance: ages 2–5 do best with ~1 hour/day of screens and a grown-up playing along. No scores or timers on purpose, so play stays relaxed.'
  }
};
const tt = ()=>T[state.lang];
const word = (n)=> NUM[state.lang][n] || String(n);

/* ---------- Game catalog ---------- */
const GAMES = [
  { id:'count',   gen:'count',   icon:'🍎', color:'#ff6f91', subject:'math', profiles:['toddler','preschool'] },
  { id:'numeral', gen:'numeral', icon:'🔢', color:'#7c83ff', subject:'math', profiles:['toddler','preschool'] },
  { id:'shapes',  gen:'shapes',  icon:'🔺', color:'#ff9f5a', subject:'math', profiles:['toddler','preschool'] },
  { id:'bigsmall',gen:'bigsmall',icon:'📏', color:'#2fc19e', subject:'math', profiles:['toddler','preschool'] },
  { id:'colors',  gen:'colors',  icon:'🎨', color:'#c77dff', subject:'math', profiles:['toddler','preschool'] },
  { id:'odd',     gen:'odd',     icon:'🔍', color:'#ffb14e', subject:'math', profiles:['toddler'] },
  { id:'pattern', gen:'pattern', icon:'🧩', color:'#39b7e5', subject:'math', profiles:['preschool'] },
  { id:'abc',     gen:'abc',     icon:'🔤', color:'#8a7cff', subject:'english', profiles:['toddler','preschool'] },
  { id:'words',   gen:'words',   icon:'🐾', color:'#3ec9a7', subject:'english', profiles:['toddler','preschool'] },
  { id:'colorsEN',gen:'colors',  icon:'🌈', color:'#ff6f91', subject:'english', profiles:['toddler','preschool'], en:true },
  { id:'shapesEN',gen:'shapes',  icon:'⭐', color:'#ffc24b', subject:'english', profiles:['toddler','preschool'], en:true }
];

const CFG = {
  toddler:  { countMax:3, choices:2, numeralMax:5, colorCount:3, shapeCount:3, bigCount:2, oddCount:4, patternUnit:2 },
  preschool:{ countMax:6, choices:3, numeralMax:9, colorCount:4, shapeCount:4, bigCount:3, oddCount:6, patternUnit:3 }
};
const cfg = ()=> CFG[state.profile];

/* ---------- Content pools ---------- */
const THEMES = [
  ['🍎','🍓','🍊','🍌','🍇','🍑'], ['🐶','🐱','🐰','🐸','🐥','🐷'],
  ['⭐','🎈','🚗','⚽','🌸','🍪'], ['🦆','🐟','🦋','🐝','🐞','🐠']
];
const BIG_OBJS = ['🎈','🍎','🐘','🌳','⭐','🚗','🐻','🍄','🌻','🐟'];
const ODD_PAIRS = [
  ['🐶','🐱'],['🍎','🍊'],['⭐','🌙'],['🐸','🐢'],['🚗','🚌'],['🌸','🌻'],['🐥','🦆'],['🍓','🍇'],['😺','🐭'],['🔵','🟢']
];
const COLOR_HEX = { red:'#ff4d4f', blue:'#3b82f6', green:'#22c55e', yellow:'#facc15', orange:'#fb923c', purple:'#a855f7', pink:'#f472b6' };
const COLOR_KEYS = Object.keys(COLOR_HEX);
const WORDS = [
  {e:'🐶',w:'dog'},{e:'🐱',w:'cat'},{e:'🐦',w:'bird'},{e:'🐠',w:'fish'},{e:'🐰',w:'rabbit'},{e:'🐻',w:'bear'},
  {e:'🦁',w:'lion'},{e:'🐘',w:'elephant'},{e:'🐵',w:'monkey'},{e:'🐸',w:'frog'},{e:'🐷',w:'pig'},{e:'🐮',w:'cow'},
  {e:'🍎',w:'apple'},{e:'🍌',w:'banana'},{e:'🍊',w:'orange'},{e:'🍇',w:'grapes'},{e:'🍓',w:'strawberry'},{e:'🥕',w:'carrot'},
  {e:'🚗',w:'car'},{e:'🚌',w:'bus'},{e:'✈️',w:'airplane'},{e:'🚲',w:'bike'},{e:'🚂',w:'train'},{e:'⛵',w:'boat'},
  {e:'☀️',w:'sun'},{e:'🌙',w:'moon'},{e:'⭐',w:'star'},{e:'🌸',w:'flower'},{e:'🌳',w:'tree'},{e:'🏠',w:'house'},
  {e:'⚽',w:'ball'},{e:'🎈',w:'balloon'},{e:'📖',w:'book'},{e:'👟',w:'shoe'},{e:'🎩',w:'hat'},{e:'🧦',w:'sock'}
];
const LETTERS_EASY = ['A','B','C','D','E','F'];
const LETTERS_ALL  = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','R','S','T','U','V','W'];

/* ---------- Utils ---------- */
const $ = (s)=>document.querySelector(s);
const rint = (a,b)=> a + Math.floor(Math.random()*(b-a+1));
const pick = (a)=> a[Math.floor(Math.random()*a.length)];
function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function el(tag,cls,html){ const e=document.createElement(tag); if(cls)e.className=cls; if(html!=null)e.innerHTML=html; return e; }
function shade(hex,pct){ const n=parseInt(hex.slice(1),16); const cl=v=>Math.max(0,Math.min(255,Math.round(v)));
  const r=cl((n>>16)+pct*2.55), g=cl(((n>>8)&255)+pct*2.55), b=cl((n&255)+pct*2.55); return `#${(r<<16|g<<8|b).toString(16).padStart(6,'0')}`; }

/* ---------- Audio ---------- */
let AC=null;
function audio(){ if(!AC){ try{ AC=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} } if(AC&&AC.state==='suspended') AC.resume(); return AC; }
function tone(freq,dur,type='sine',vol=0.18,delay=0){ const c=audio(); if(!c) return; const o=c.createOscillator(),g=c.createGain(); o.type=type; o.frequency.value=freq; const t=c.currentTime+delay; o.connect(g); g.connect(c.destination); g.gain.setValueAtTime(0,t); g.gain.linearRampToValueAtTime(vol,t+0.02); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); o.start(t); o.stop(t+dur+0.02); }
const sGood = ()=>{ tone(523,0.14,'triangle',0.2,0); tone(659,0.14,'triangle',0.2,0.11); tone(784,0.22,'triangle',0.22,0.22); };
const sWrong= ()=>{ tone(300,0.16,'sine',0.12,0); tone(240,0.2,'sine',0.12,0.08); };
const sTap  = ()=> tone(660,0.08,'triangle',0.12);
const sStar = ()=>{ tone(1046,0.1,'triangle',0.15,0); tone(1318,0.14,'triangle',0.15,0.08); };

/* ---------- Speech ---------- */
let voices=[];
function loadVoices(){ try{ voices = speechSynthesis.getVoices()||[]; }catch(e){ voices=[]; } }
if('speechSynthesis' in window){ loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }
function voiceFor(pref){ return voices.find(v=>/female|linh|samantha|karen|moira|zira|nova/i.test(v.name) && v.lang.toLowerCase().startsWith(pref))
    || voices.find(v=> v.lang.toLowerCase().startsWith(pref)) || null; }
function say(text, lang){ if(!state.voice || !('speechSynthesis' in window) || !text) return;
  try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);
    u.lang = lang==='vi' ? 'vi-VN' : 'en-US'; u.rate = lang==='vi'?0.92:0.85; u.pitch=1.12;
    const v=voiceFor(lang==='vi'?'vi':'en'); if(v) u.voice=v; speechSynthesis.speak(u);
  }catch(e){} }
const speak   = (t)=> say(t, state.lang);
const speakEN = (t)=> say(t, 'en');
let primed=false;
function prime(){ if(primed) return; primed=true; audio(); if('speechSynthesis' in window){ try{ const u=new SpeechSynthesisUtterance(' '); u.volume=0; speechSynthesis.speak(u); }catch(e){} } }

/* ---------- Screen nav ---------- */
function show(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active', s.id===id)); }

/* ============================================================
   HOME
   ============================================================ */
function renderHome(){
  $('#homeTitle').textContent = tt().appTitle;
  $('#starNum').textContent = state.stars;
  $('#langBtn').textContent = state.lang==='vi' ? '🇻🇳' : '🇬🇧';
  $('#subMath').textContent = tt().subjects.math;
  $('#subEng').textContent  = tt().subjects.english;
  document.querySelectorAll('#subjectTabs .seg-btn').forEach(b=> b.classList.toggle('on', b.dataset.subject===state.subject));
  document.querySelectorAll('#profileSeg .seg-btn').forEach(b=>{
    b.classList.toggle('on', b.dataset.profile===state.profile);
    b.querySelector('.lbl-main').textContent = tt().profiles[b.dataset.profile];
  });
  const list = GAMES.filter(g=>g.profiles.includes(state.profile) && g.subject===state.subject);
  const grid = $('#gameGrid'); grid.innerHTML='';
  const cols = list.length===4 ? 2 : list.length<=3 ? list.length : 3;
  grid.style.gridTemplateColumns = `repeat(${cols},1fr)`;
  grid.style.maxWidth = list.length===4 ? '720px' : '1040px'; // keep 2×2 from overflowing
  list.forEach(g=>{
    const c = el('button','card');
    c.style.background = `linear-gradient(160deg, ${shade(g.color,15)}, ${shade(g.color,-8)})`;
    c.style.setProperty('--card-shade', shade(g.color,-32));
    c.innerHTML = `<div class="ico-plate"><div class="ico">${g.icon}</div></div><div class="label">${tt().games[g.id]}</div>`;
    c.onclick = ()=>{ prime(); sTap(); startGame(g); };
    grid.appendChild(c);
  });
}

/* ============================================================
   GAME LOOP
   ============================================================ */
const GEN = { count:rCount, numeral:rNumeral, shapes:rShapes, bigsmall:rBigSmall, colors:rColors, odd:rOdd, pattern:rPattern, abc:rABC, words:rWords };
let curDef=null, locked=false, playStart=0, inGame=false;

function startGame(def){ curDef=def; inGame=true; armBreak(); document.body.classList.add('playing'); show('game'); nextRound(); }
function exitGame(){ inGame=false; document.body.classList.remove('playing'); try{ speechSynthesis.cancel(); }catch(e){} renderHome(); show('home'); }

function setPrompt(html, speakText, en){
  const p=$('#promptText'); p.innerHTML=html;
  p.dataset.speak = speakText!=null?speakText : p.textContent;
  p.dataset.en = en?'1':'0';
  $('#speakBtn').classList.add('pulse');
  en ? speakEN(p.dataset.speak) : speak(p.dataset.speak);
}
$('#speakBtn').onclick = ()=>{ prime(); if(!curDef) return; const p=$('#promptText'); p.dataset.en==='1'?speakEN(p.dataset.speak):speak(p.dataset.speak); };

function mountChoices(items){
  const box=$('#choices'); box.innerHTML=''; locked=false;
  items.forEach(it=>{ const c = it.node; c.classList.add('choice'); if(it.wide) c.classList.add('wide');
    c.onclick = ()=> handleChoice(c, it); box.appendChild(c); });
}
function handleChoice(node, it){
  if(locked) return; prime();
  if(it.correct){
    locked=true; node.classList.add('right');
    document.querySelectorAll('#choices .choice').forEach(x=>{ if(x!==node) x.classList.add('dim'); });
    sGood();
    if(it.rightSpeakEN) speakEN(it.rightSpeakEN);
    else speak(pick(tt().praise) + (it.rightSay? ' '+it.rightSay : ''));
    awardStar(); celebrate();
    setTimeout(()=>{ if(inGame) nextRound(); }, 1350);
  } else {
    node.classList.add('wrong','dim'); sWrong(); speak(pick(tt().tryagain));
    setTimeout(()=>node.classList.remove('wrong'),500);
  }
}
function nextRound(){
  $('#speakBtn').classList.remove('pulse');
  $('#stage').innerHTML=''; $('#choices').innerHTML='';
  GEN[curDef.gen]();
  maybeBreak();
}

/* ---------- number-choice helper ---------- */
function numberChoices(answer, max){
  const n = cfg().choices; const set = new Set([answer]); let guard=0;
  while(set.size<n && guard++<50){ const cand = rint(Math.max(1,answer-2), Math.min(max, answer+2)); if(cand!==answer) set.add(cand); }
  while(set.size<n && guard++<80){ set.add(rint(1,max)); }
  return shuffle([...set]);
}

/* ---------- GAME: Count ---------- */
function rCount(){
  const theme=pick(THEMES), obj=pick(theme), max=cfg().countMax, n=rint(1,max);
  setPrompt(tt().prompt.count);
  const stage=$('#stage'); let counted=0;
  for(let i=0;i<n;i++){ const o=el('div','obj tappable',obj);
    o.onclick=()=>{ if(o.dataset.done) return; o.dataset.done=1; counted++; o.classList.add('counted'); sTap(); speak(word(counted)); };
    stage.appendChild(o); }
  mountChoices(numberChoices(n,max).map(v=>({ node: el('button',null,String(v)), correct: v===n, rightSay: tt().hasCount(word(n)) })));
}

/* ---------- GAME: Numeral ---------- */
function rNumeral(){
  const max=cfg().numeralMax, n=rint(1,max);
  setPrompt(tt().prompt.numeral(`<b>${n}</b>`), tt().prompt.numeral(word(n)));
  const dots=el('div','',''); dots.style.cssText='display:flex;gap:10px;flex-wrap:wrap;justify-content:center;max-width:560px;';
  for(let i=0;i<n;i++){ const d=el('div','obj','🟣'); d.style.fontSize='clamp(30px,6vw,56px)'; dots.appendChild(d); }
  $('#stage').appendChild(dots);
  mountChoices(numberChoices(n,max).map(v=>({ node: el('button',null,String(v)), correct: v===n })));
}

/* ---------- GAME: Shapes (en flag → English name) ---------- */
function shapeSVG(kind,color){
  const m={
    circle:`<circle cx="50" cy="50" r="42" fill="${color}"/>`,
    square:`<rect x="10" y="10" width="80" height="80" rx="8" fill="${color}"/>`,
    triangle:`<polygon points="50,10 92,88 8,88" fill="${color}"/>`,
    star:`<polygon points="50,6 61,38 95,38 68,59 78,92 50,72 22,92 32,59 5,38 39,38" fill="${color}"/>`,
    heart:`<path d="M50 88 C10 58 12 20 38 20 C48 20 50 30 50 33 C50 30 52 20 62 20 C88 20 90 58 50 88 Z" fill="${color}"/>`,
    rect:`<rect x="6" y="26" width="88" height="48" rx="8" fill="${color}"/>`
  };
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${m[kind]}</svg>`;
}
function rShapes(){
  const en = curDef && curDef.en;
  const kinds=['circle','square','triangle','star','heart','rect'];
  const chosen=shuffle(kinds).slice(0,cfg().shapeCount); const target=pick(chosen);
  const palette=['#ff6b6b','#4dabf7','#20c997','#f59f00','#cc5de8','#5c7cfa'];
  const name = en ? T.en.shapes[target] : tt().shapes[target];
  setPrompt(tt().prompt.shapesFind(`<b>${name}</b>`), name, en);
  mountChoices(shuffle(chosen).map((k,i)=>{
    const b=el('button',null,''); b.appendChild(el('div','shape',shapeSVG(k,palette[i%palette.length]))); b.style.padding='10px';
    return { node:b, correct:k===target, rightSpeakEN: en?name:null };
  }));
}

/* ---------- GAME: Big & Small ---------- */
function rBigSmall(){
  const obj=pick(BIG_OBJS), n=cfg().bigCount, wantBig=Math.random()<0.5;
  setPrompt(wantBig?tt().prompt.biggest:tt().prompt.smallest);
  const sizes=[]; const base=54, step=n===2?54:40; for(let i=0;i<n;i++) sizes.push(base+i*step);
  const target = wantBig ? Math.max(...sizes) : Math.min(...sizes);
  mountChoices(shuffle(sizes).map(sz=>{
    const b=el('button',null,''); const o=el('div','obj',obj); o.style.fontSize=sz+'px'; b.appendChild(o);
    b.style.background='transparent'; b.style.boxShadow='none';
    return { node:b, correct:sz===target };
  }));
}

/* ---------- GAME: Colors (en flag → English name) ---------- */
function rColors(){
  const en = curDef && curDef.en;
  const keys=shuffle(COLOR_KEYS).slice(0,cfg().colorCount); const target=pick(keys);
  const name = en ? T.en.colors[target] : tt().colors[target];
  setPrompt(tt().prompt.colorFind(`<b>${name}</b>`), name, en);
  mountChoices(shuffle(keys).map(k=>{
    const b=el('button',null,''); const dot=el('div','','');
    dot.style.cssText=`width:clamp(80px,14vw,120px);height:clamp(80px,14vw,120px);border-radius:50%;background:${COLOR_HEX[k]};box-shadow:inset 0 -8px 14px rgba(0,0,0,.15);`;
    b.appendChild(dot); b.style.padding='12px';
    return { node:b, correct:k===target, rightSpeakEN: en?name:null };
  }));
}

/* ---------- GAME: Odd one out ---------- */
function rOdd(){
  const pair=pick(ODD_PAIRS); const [a,b]=Math.random()<0.5?pair:[pair[1],pair[0]];
  const n=cfg().oddCount, items=[];
  for(let i=0;i<n-1;i++) items.push({e:a,correct:false}); items.push({e:b,correct:true});
  setPrompt(tt().prompt.odd);
  mountChoices(shuffle(items).map(it=>{
    const btn=el('button',null,''); const o=el('div','obj',it.e); o.style.fontSize='clamp(46px,9vw,86px)'; btn.appendChild(o);
    return { node:btn, correct:it.correct };
  }));
}

/* ---------- GAME: Pattern ---------- */
function rPattern(){
  const pool=['🔴','🔵','🟡','🟢','🟣','🟠','⭐','❤️'];
  const unitLen=cfg().patternUnit, unit=shuffle(pool).slice(0,unitLen), visible=unitLen*2;
  const seq=[]; for(let i=0;i<visible;i++) seq.push(unit[i%unitLen]);
  const answer=unit[visible%unitLen];
  setPrompt(tt().prompt.pattern);
  const row=el('div','',''); row.style.cssText='display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:center;';
  seq.forEach(t=>{ const o=el('div','obj',t); o.style.fontSize='clamp(40px,8vw,74px)'; row.appendChild(o); });
  const q=el('div','obj','❓'); q.style.fontSize='clamp(40px,8vw,74px)'; q.style.opacity='.7'; row.appendChild(q);
  $('#stage').appendChild(row);
  mountChoices(shuffle(unit).map(t=>{
    const btn=el('button',null,''); const o=el('div','obj',t); o.style.fontSize='clamp(40px,8vw,72px)'; btn.appendChild(o);
    return { node:btn, correct:t===answer };
  }));
}

/* ---------- GAME: ABC ---------- */
function rABC(){
  const pool = state.profile==='toddler' ? LETTERS_EASY : LETTERS_ALL;
  const target=pick(pool); const cap=Math.min(cfg().choices+1, pool.length);
  const opts=new Set([target]); while(opts.size<cap) opts.add(pick(pool));
  setPrompt(tt().prompt.abcFind(`<b>${target}</b>`), target, true);
  mountChoices(shuffle([...opts]).map(L=>({ node: el('button','glyph-choice',L), correct:L===target, rightSpeakEN:L })));
}

/* ---------- GAME: First Words (listen → picture) ---------- */
function rWords(){
  const n = state.profile==='toddler'?2:3;
  const chosen = shuffle(WORDS).slice(0,n); const target=pick(chosen);
  setPrompt(tt().prompt.wordFind, target.w, true);
  mountChoices(shuffle(chosen).map(o=>{
    const b=el('button',null,''); const g=el('div','obj',o.e); g.style.fontSize='clamp(56px,13vw,120px)'; b.appendChild(g);
    return { node:b, correct:o.w===target.w, rightSpeakEN:target.w };
  }));
}

/* ============================================================
   REWARDS / BREAK / PARENT
   ============================================================ */
function awardStar(){ state.stars++; save(); $('#starNum').textContent=state.stars; sStar(); }
function celebrate(){
  const ov=$('#celebrate'); ov.classList.add('show'); ov.innerHTML='';
  ov.appendChild(el('div','cheer', pick(['🎉','🌟','👏','🥳','💫','🏆'])));
  const bits=['🎈','⭐','🎊','💛','💙','🌈','🍬','✨'];
  for(let i=0;i<22;i++){ const c=el('div','confetti',pick(bits));
    c.style.left=Math.random()*100+'%'; c.style.animationDuration=(1.2+Math.random()*1.2)+'s'; c.style.animationDelay=(Math.random()*0.2)+'s'; c.style.fontSize=(18+Math.random()*18)+'px'; ov.appendChild(c); }
  setTimeout(()=>{ ov.classList.remove('show'); ov.innerHTML=''; }, 1500);
}
function armBreak(){ playStart=Date.now(); }
function maybeBreak(){ if(!inGame || !state.breakMins) return; if(Date.now()-playStart >= state.breakMins*60000) showBreak(); }
function showBreak(){ const t=tt(); $('#breakTitle').textContent=t.breakT; $('#breakSub').textContent=t.breakS; $('#breakOk').textContent=t.breakOk; $('#breakScreen').classList.add('show'); speak(t.breakT); }
$('#breakOk').onclick=()=>{ $('#breakScreen').classList.remove('show'); armBreak(); };

function openParentGate(){
  const t=tt(); $('#parentPanel').classList.add('show');
  $('#parentGateTitle').textContent=t.parentTitle; $('#parentBody').hidden=true;
  $('#parentGateSub').style.display=''; $('#gateNums').style.display='';
  const target=rint(5,9); $('#gateNum').textContent=target; $('#parentGateSub').firstChild.textContent=t.gate+' ';
  const box=$('#gateNums'); box.innerHTML='';
  const opts=new Set([target]); while(opts.size<3) opts.add(rint(1,9));
  shuffle([...opts]).forEach(v=>{ const b=el('button','gate-num',String(v)); b.onclick=()=>{ if(v===target) revealParent(); else b.style.opacity='.3'; }; box.appendChild(b); });
}
function revealParent(){ $('#parentGateSub').style.display='none'; $('#gateNums').style.display='none'; $('#parentBody').hidden=false; syncParent(); }
function syncParent(){
  const t=tt();
  $('#parentPanel [data-i18n="langLabel"]').textContent=t.langLabel;
  $('#parentPanel [data-i18n="voiceLabel"]').textContent=t.voiceLabel;
  $('#parentPanel [data-i18n="breakLabel"]').textContent=t.breakLabel;
  $('#resetStars').textContent=t.reset; $('#parentClose').textContent=t.done; $('#parentNote').textContent=t.note;
  document.querySelectorAll('#langSeg .seg-btn').forEach(b=>b.classList.toggle('on', b.dataset.lang===state.lang));
  document.querySelectorAll('#voiceSeg .seg-btn').forEach(b=>b.classList.toggle('on', (b.dataset.voice==='on')===state.voice));
  document.querySelectorAll('#breakSeg .seg-btn').forEach(b=>b.classList.toggle('on', +b.dataset.break===state.breakMins));
}
document.querySelectorAll('#langSeg .seg-btn').forEach(b=> b.onclick=()=>{ state.lang=b.dataset.lang; save(); document.documentElement.lang=state.lang; syncParent(); });
document.querySelectorAll('#voiceSeg .seg-btn').forEach(b=> b.onclick=()=>{ state.voice=(b.dataset.voice==='on'); save(); syncParent(); if(state.voice) speak(pick(tt().praise)); });
document.querySelectorAll('#breakSeg .seg-btn').forEach(b=> b.onclick=()=>{ state.breakMins=+b.dataset.break; save(); armBreak(); syncParent(); });
$('#resetStars').onclick=()=>{ state.stars=0; save(); $('#starNum').textContent=0; };
$('#parentClose').onclick=()=>{ $('#parentPanel').classList.remove('show'); renderHome(); };
$('#parentPanel').addEventListener('click', (e)=>{ if(e.target===$('#parentPanel')){ $('#parentPanel').classList.remove('show'); renderHome(); } });

/* ============================================================
   WIRING
   ============================================================ */
$('#backBtn').onclick=()=>{ sTap(); exitGame(); };
$('#parentBtn').onclick=()=>{ prime(); openParentGate(); };
$('#langBtn').onclick=()=>{ state.lang = state.lang==='vi'?'en':'vi'; save(); document.documentElement.lang=state.lang; renderHome(); if(inGame) exitGame(); };
document.querySelectorAll('#profileSeg .seg-btn').forEach(b=> b.onclick=()=>{ prime(); sTap(); state.profile=b.dataset.profile; save(); renderHome(); });
document.querySelectorAll('#subjectTabs .seg-btn').forEach(b=> b.onclick=()=>{ prime(); sTap(); state.subject=b.dataset.subject; save(); renderHome(); });
document.addEventListener('pointerdown', prime, { once:true });

document.documentElement.lang=state.lang;
renderHome();
if('serviceWorker' in navigator){ window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{})); }
