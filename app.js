/* ============================================================
   Bé Học · Little Learners
   Offline no-fail early-math + English for a 2.5yo (Dino) & 4yo (Pony).
   Reward meta-game: Dino badge album / Pony jigsaw. Numberblocks add,
   balance-scale measurement, give-N "feed" — grounded in Monkey Math /
   Numberblocks / collectible-puzzle research.
   ============================================================ */
'use strict';

/* ---------- State ---------- */
const DEFAULTS = { profile:'toddler', lang:'vi', subject:'math', voice:true, breakMins:15,
  dino:{ badges:0, prog:0 }, pony:{ done:0, pieces:0 } };
const state = Object.assign({}, DEFAULTS, load());
// backfill nested objects if an older save existed
state.dino = Object.assign({badges:0,prog:0}, state.dino);
state.pony = Object.assign({done:0,pieces:0}, state.pony);
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
    games:{count:'Đếm', feed:'Cho ăn', numeral:'Học số', add:'Phép cộng', balance:'Cân nặng',
           shapes:'Hình khối', bigsmall:'To & Nhỏ', colors:'Màu sắc', odd:'Tìm cái khác', pattern:'Tiếp theo',
           abc:'Chữ cái ABC', words:'Từ vựng', colorsEN:'Màu sắc', shapesEN:'Hình khối'},
    prompt:{
      count:'Đếm xem có bao nhiêu?',
      feed:(n)=>`Cho bạn ấy ăn ${n} cái nào!`, feedSpeak:(w)=>`Cho ăn ${w} cái`,
      add:'Có tất cả bao nhiêu khối?', addSpeak:(a,b)=>`${a} cộng ${b} bằng mấy?`,
      balance:'Thêm cho hai bên bằng nhau!', balanceSpeak:'Thêm cho hai bên bằng nhau', balanceHint:'Chạm để thêm — chạm vật trên đĩa để bớt',
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
    reward:{ dinoTitle:'Bộ sưu tập Khủng long', ponyTitle:'Tranh của Pony', newBadge:'Huy hiệu mới!',
      picDone:'Xong một bức tranh!', gallery:'Tranh đã ghép', collectHint:(n)=>`Đúng thêm ${n} câu để mở huy hiệu!`,
      pieceHint:(n)=>`Còn ${n} mảnh nữa là xong tranh!`, allDino:'Sưu tầm đủ hết rồi, siêu ghê!' },
    breakT:'Nghỉ một chút nhé!', breakS:'Con chơi giỏi lắm. Đứng dậy vươn vai nào!', breakOk:'Chơi tiếp',
    parentTitle:'Dành cho ba mẹ', gate:'Chạm vào số', langLabel:'Ngôn ngữ', voiceLabel:'Giọng đọc',
    breakLabel:'Nhắc nghỉ sau', reset:'Đặt lại phần thưởng', done:'Xong',
    note:'Khuyến nghị (AAP): trẻ 2–5 tuổi nên dùng màn hình khoảng 1 giờ/ngày và có ba mẹ chơi cùng. Ứng dụng cố ý không có điểm hay tính giờ để bé chơi thoải mái.'
  },
  en:{
    appTitle:'Little Learners',
    subjects:{math:'Math & Thinking', english:'English'},
    profiles:{toddler:'Little one', preschool:'Big kid'},
    games:{count:'Count', feed:'Feed', numeral:'Numbers', add:'Add', balance:'Weigh',
           shapes:'Shapes', bigsmall:'Big & Small', colors:'Colors', odd:'Odd one out', pattern:'What’s next',
           abc:'ABC Letters', words:'First Words', colorsEN:'Colors', shapesEN:'Shapes'},
    prompt:{
      count:'How many are there?',
      feed:(n)=>`Feed your friend ${n}!`, feedSpeak:(w)=>`Feed ${w}`,
      add:'How many blocks altogether?', addSpeak:(a,b)=>`${a} plus ${b} is?`,
      balance:'Add to make both sides equal!', balanceSpeak:'Make both sides equal', balanceHint:'Tap to add — tap an item on the tray to remove',
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
    reward:{ dinoTitle:'Dino Collection', ponyTitle:'Pony Picture', newBadge:'New badge!',
      picDone:'Picture complete!', gallery:'Finished pictures', collectHint:(n)=>`${n} more right to unlock a badge!`,
      pieceHint:(n)=>`${n} more pieces to finish the picture!`, allDino:'You collected them all, amazing!' },
    breakT:'Time for a little break!', breakS:'You played so well. Stand up and stretch!', breakOk:'Keep playing',
    parentTitle:'For grown-ups', gate:'Tap the number', langLabel:'Language', voiceLabel:'Voice',
    breakLabel:'Break reminder', reset:'Reset rewards', done:'Done',
    note:'AAP guidance: ages 2–5 do best with ~1 hour/day of screens and a grown-up playing along. No scores or timers on purpose, so play stays relaxed.'
  }
};
const tt = ()=>T[state.lang];
const word = (n)=> NUM[state.lang][n] || String(n);

/* ---------- Themes & rewards ---------- */
const theme = ()=> state.profile==='toddler' ? 'dino' : 'pony';
const DINO_SET = [
  {e:'🦖',vi:'Khủng long T-Rex',en:'T-Rex'}, {e:'🦕',vi:'Cổ dài',en:'Long-neck'},
  {e:'🥚',vi:'Trứng khủng long',en:'Dino egg'}, {e:'🦴',vi:'Hoá thạch',en:'Fossil'},
  {e:'🌋',vi:'Núi lửa',en:'Volcano'}, {e:'🐊',vi:'Cá sấu',en:'Croc'},
  {e:'🐢',vi:'Rùa',en:'Turtle'}, {e:'🦎',vi:'Thằn lằn',en:'Lizard'},
  {e:'🐉',vi:'Rồng',en:'Dragon'}, {e:'🦣',vi:'Voi ma mút',en:'Mammoth'},
  {e:'🦈',vi:'Cá mập',en:'Shark'}, {e:'🦤',vi:'Chim Dodo',en:'Dodo'}
];
const DINO_UNLOCK = 4;
const PONY_SET = ['🦄','🐴','🎠','🌈','🦋','🌸','💖','🐝','🌟','🍭','🎀','🦩'];
const PONY_TILES = 6;

/* ---------- Game catalog ---------- */
const GAMES = [
  { id:'count',   gen:'count',   icon:'🍎', color:'#ff6f91', subject:'math', profiles:['toddler','preschool'] },
  { id:'feed',    gen:'feed',    icon:'🍖', color:'#20c997', subject:'math', profiles:['toddler'] },
  { id:'add',     gen:'add',     icon:'➕', color:'#4dabf7', subject:'math', profiles:['preschool'] },
  { id:'balance', gen:'balance', icon:'⚖️', color:'#7c83ff', subject:'math', profiles:['preschool'] },
  { id:'shapes',  gen:'shapes',  icon:'🔺', color:'#ff9f5a', subject:'math', profiles:['toddler','preschool'] },
  { id:'bigsmall',gen:'bigsmall',icon:'📏', color:'#2fc19e', subject:'math', profiles:['toddler'] },
  { id:'colors',  gen:'colors',  icon:'🎨', color:'#c77dff', subject:'math', profiles:['toddler','preschool'] },
  { id:'odd',     gen:'odd',     icon:'🔍', color:'#ffb14e', subject:'math', profiles:['toddler'] },
  { id:'pattern', gen:'pattern', icon:'🧩', color:'#39b7e5', subject:'math', profiles:['preschool'] },
  { id:'abc',     gen:'abc',     icon:'🔤', color:'#8a7cff', subject:'english', profiles:['toddler','preschool'] },
  { id:'words',   gen:'words',   icon:'🐾', color:'#3ec9a7', subject:'english', profiles:['toddler','preschool'] },
  { id:'colorsEN',gen:'colors',  icon:'🌈', color:'#ff6f91', subject:'english', profiles:['toddler','preschool'], en:true },
  { id:'shapesEN',gen:'shapes',  icon:'⭐', color:'#ffc24b', subject:'english', profiles:['toddler','preschool'], en:true }
];
const CFG = {
  toddler:  { countMax:3, choices:2, colorCount:3, shapeCount:3, bigCount:2, oddCount:4, patternUnit:2, feedMax:4 },
  preschool:{ countMax:10,choices:3, colorCount:4, shapeCount:4, bigCount:3, oddCount:6, patternUnit:3, feedMax:6 }
};
const cfg = ()=> CFG[state.profile];

/* ---------- Content pools ---------- */
const THEMES = [
  ['🍎','🍓','🍊','🍌','🍇','🍑'], ['🐶','🐱','🐰','🐸','🐥','🐷'],
  ['⭐','🎈','🚗','⚽','🌸','🍪'], ['🦆','🐟','🦋','🐝','🐞','🐠']
];
const DINO_OBJS = ['🦖','🦕','🥚','🦴','🌿','🍖'];
const BIG_OBJS = ['🎈','🍎','🐘','🌳','⭐','🚗','🐻','🍄','🌻','🐟'];
const ODD_PAIRS = [['🐶','🐱'],['🍎','🍊'],['⭐','🌙'],['🐸','🐢'],['🚗','🚌'],['🌸','🌻'],['🐥','🦆'],['🍓','🍇'],['😺','🐭'],['🦖','🐊']];
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
const sStar = ()=>{ tone(1046,0.1,'triangle',0.15,0); tone(1318,0.14,'triangle',0.15,0.08); tone(1568,0.18,'triangle',0.15,0.16); };

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

/* ---------- Screen nav / theme ---------- */
function show(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active', s.id===id)); }
function applyTheme(){ document.body.classList.toggle('theme-dino', theme()==='dino'); document.body.classList.toggle('theme-pony', theme()==='pony'); renderScenery(); }
function renderScenery(){
  const box=$('#scenery'); if(!box) return; box.innerHTML='';
  const items = theme()==='dino' ? ['🌿','🌴','🦴','🌋','🥚','🦕'] : ['☁️','🌈','⭐','🌸','💗','🦋'];
  const spots=[[5,16],[89,10],[10,78],[92,74],[49,88],[80,38],[18,44],[70,66]];
  spots.forEach((s,i)=>{ const d=el('div','sc',items[i%items.length]);
    d.style.left=s[0]+'%'; d.style.top=s[1]+'%'; d.style.fontSize=(42+(i%3)*24)+'px';
    d.style.transform='rotate('+(((i*37)%40)-20)+'deg)'; d.style.animationDelay=(i*0.5)+'s'; box.appendChild(d); });
}

/* ============================================================
   HOME
   ============================================================ */
function renderHome(){
  applyTheme();
  $('#homeTitle').textContent = tt().appTitle;
  $('#langBtn').textContent = state.lang==='vi' ? '🇻🇳' : '🇬🇧';
  $('#subMath').textContent = tt().subjects.math;
  $('#subEng').textContent  = tt().subjects.english;
  updateReward();
  document.querySelectorAll('#subjectTabs .seg-btn').forEach(b=> b.classList.toggle('on', b.dataset.subject===state.subject));
  document.querySelectorAll('#profileSeg .seg-btn').forEach(b=>{
    b.classList.toggle('on', b.dataset.profile===state.profile);
    b.querySelector('.lbl-main').textContent = tt().profiles[b.dataset.profile];
  });
  const list = GAMES.filter(g=>g.profiles.includes(state.profile) && g.subject===state.subject);
  const grid = $('#gameGrid'); grid.innerHTML='';
  const cols = list.length===4 ? 2 : list.length<=3 ? list.length : 3;
  grid.style.gridTemplateColumns = `repeat(${cols},1fr)`;
  grid.style.maxWidth = list.length===4 ? '720px' : '1040px';
  list.forEach(g=>{
    const c = el('button','card');
    c.style.background = `linear-gradient(160deg, ${shade(g.color,15)}, ${shade(g.color,-8)})`;
    c.style.setProperty('--card-shade', shade(g.color,-32));
    c.innerHTML = `<div class="ico-plate"><div class="ico">${g.icon}</div></div><div class="label">${tt().games[g.id]}</div>`;
    c.onclick = ()=>{ prime(); sTap(); startGame(g); };
    grid.appendChild(c);
  });
}

/* ---------- Reward button + collection ---------- */
function updateReward(){
  if(theme()==='dino'){ $('#rbEmo').textContent='🦖'; $('#rbTxt').textContent=`${state.dino.badges}/${DINO_SET.length}`;
    $('#rbFill').style.width = (100*state.dino.prog/DINO_UNLOCK)+'%'; }
  else { $('#rbEmo').textContent='🦄'; $('#rbTxt').textContent=`${state.pony.pieces}/${PONY_TILES}`;
    $('#rbFill').style.width = (100*state.pony.pieces/PONY_TILES)+'%'; }
}
function reward(){
  let rev=null;
  if(theme()==='dino'){ const d=state.dino; if(d.badges<DINO_SET.length){ d.prog++; if(d.prog>=DINO_UNLOCK){ d.prog=0; d.badges++; rev={type:'dino', item:DINO_SET[d.badges-1]}; } } }
  else { const p=state.pony; p.pieces++; if(p.pieces>=PONY_TILES){ p.pieces=0; p.done++; rev={type:'pony', item:PONY_SET[(p.done-1)%PONY_SET.length]}; } }
  save(); updateReward(); return rev;
}
function openCollection(){
  const t=tt(), body=$('#collBody'); body.innerHTML='';
  if(theme()==='dino'){
    $('#collTitle').textContent=t.reward.dinoTitle;
    const grid=el('div','coll-grid','');
    DINO_SET.forEach((d,i)=>{ const unlocked=i<state.dino.badges;
      const cell=el('div','badge'+(unlocked?'':' locked'),'');
      const disc=el('div','disc', unlocked?d.e:'❓'); disc.style.background = unlocked? `linear-gradient(160deg,${pick(['#ffe3a3','#c7f5e2','#d7e3ff','#ffd6e6'])},#fff)` : '#eee';
      cell.appendChild(disc); cell.appendChild(el('div','bname', unlocked?d[state.lang]:'???')); grid.appendChild(cell); });
    body.appendChild(grid);
    const hint = state.dino.badges<DINO_SET.length ? t.reward.collectHint(DINO_UNLOCK-state.dino.prog) : t.reward.allDino;
    body.appendChild(el('div','panel-sub',hint));
  } else {
    $('#collTitle').textContent=t.reward.ponyTitle;
    const cur = PONY_SET[state.pony.done % PONY_SET.length];
    const pz=el('div','puzzle',''); pz.appendChild(el('div','pic',cur));
    const tiles=el('div','tiles',''); tiles.style.gridTemplateColumns='repeat(3,1fr)'; tiles.style.gridTemplateRows='repeat(2,1fr)';
    for(let i=0;i<PONY_TILES;i++){ const tile=el('div','tile'+(i<state.pony.pieces?' gone':''),''); tiles.appendChild(tile); }
    pz.appendChild(tiles); body.appendChild(pz);
    body.appendChild(el('div','panel-sub', t.reward.pieceHint(PONY_TILES-state.pony.pieces)));
    if(state.pony.done>0){ body.appendChild(el('div','panel-title',t.reward.gallery));
      const g=el('div','gallery',''); for(let i=0;i<state.pony.done;i++){ g.appendChild(el('div','g-pic',PONY_SET[i%PONY_SET.length])); } body.appendChild(g); }
  }
  $('#collection').classList.add('show');
}

/* ============================================================
   GAME LOOP
   ============================================================ */
const GEN = { count:rCount, feed:rFeed, add:rAdd, balance:rBalance, shapes:rShapes, bigsmall:rBigSmall, colors:rColors, odd:rOdd, pattern:rPattern, abc:rABC, words:rWords };
let curDef=null, locked=false, playStart=0, inGame=false;

function startGame(def){ curDef=def; inGame=true; armBreak(); document.body.classList.add('playing'); show('game'); nextRound(); }
function exitGame(){ inGame=false; document.body.classList.remove('playing'); try{ speechSynthesis.cancel(); }catch(e){} renderHome(); show('home'); }

function setPrompt(html, speakText, en){
  const p=$('#promptText'); p.innerHTML=html;
  p.dataset.speak = speakText!=null?speakText : p.textContent; p.dataset.en = en?'1':'0';
  $('#speakBtn').classList.add('pulse'); en ? speakEN(p.dataset.speak) : speak(p.dataset.speak);
}
$('#speakBtn').onclick = ()=>{ prime(); if(!curDef) return; const p=$('#promptText'); p.dataset.en==='1'?speakEN(p.dataset.speak):speak(p.dataset.speak); };

function mountChoices(items){
  const box=$('#choices'); box.innerHTML=''; locked=false;
  items.forEach(it=>{ const c = it.node; c.classList.add('choice'); if(it.wide) c.classList.add('wide');
    c.onclick = ()=> handleChoice(c, it); box.appendChild(c); });
}
function handleChoice(node, it){
  if(locked) return; prime();
  if(it.correct){ locked=true; node.classList.add('right');
    document.querySelectorAll('#choices .choice').forEach(x=>{ if(x!==node) x.classList.add('dim'); });
    winRound(it);
  } else { node.classList.add('wrong','dim'); sWrong(); speak(pick(tt().tryagain)); setTimeout(()=>node.classList.remove('wrong'),500); }
}
/* shared success: reward → reveal or normal celebrate → next */
function winRound(it){ it=it||{};
  sGood();
  if(it.rightSpeakEN) speakEN(it.rightSpeakEN);
  else speak(pick(tt().praise) + (it.rightSay? ' '+it.rightSay : ''));
  const rev = reward();
  if(rev){ showReveal(rev, ()=>{ if(inGame) nextRound(); }); }
  else { celebrate(); setTimeout(()=>{ if(inGame) nextRound(); }, 1350); }
}
function nextRound(){
  $('#speakBtn').classList.remove('pulse'); $('#stage').innerHTML=''; $('#choices').innerHTML=''; locked=false;
  GEN[curDef.gen](); maybeBreak();
}
function numberChoices(answer, max){
  const n = cfg().choices; const set = new Set([answer]); let guard=0;
  while(set.size<n && guard++<50){ const cand = rint(Math.max(1,answer-2), Math.min(max, answer+2)); if(cand!==answer) set.add(cand); }
  while(set.size<n && guard++<80){ set.add(rint(1,max)); }
  return shuffle([...set]);
}

/* ---------- Count ---------- */
function rCount(){
  const theme=pick(THEMES), obj=pick(theme), max=cfg().countMax, n=rint(1,Math.min(max,6));
  setPrompt(tt().prompt.count);
  const stage=$('#stage'); let counted=0;
  for(let i=0;i<n;i++){ const o=el('div','obj tappable',obj);
    o.onclick=()=>{ if(o.dataset.done) return; o.dataset.done=1; counted++; o.classList.add('counted'); sTap(); speak(word(counted)); };
    stage.appendChild(o); }
  mountChoices(numberChoices(n,Math.min(max,9)).map(v=>({ node: el('button',null,String(v)), correct: v===n, rightSay: tt().hasCount(word(n)) })));
}

/* ---------- Feed (give-N) ---------- */
function rFeed(){
  const N = rint(1, cfg().feedMax);
  const food = pick(['🍖','🥩','🍃','🌿','🍎','🍪']);
  const mascot = theme()==='dino' ? '🦖' : '🐴';
  setPrompt(tt().prompt.feed(`<b>${N}</b>`), tt().prompt.feedSpeak(word(N)));
  const wrap=el('div','feed-wrap','');
  wrap.appendChild(el('div','feed-mascot',mascot));
  const target=el('div','feed-target',''); const setT=(g)=>target.innerHTML=`${g} / <b>${N}</b>`; setT(0);
  wrap.appendChild(target);
  const basket=el('div','feed-basket',''); wrap.appendChild(basket);
  const pile=el('div','feed-pile',''); const total=N + (state.profile==='toddler'?1:2);
  let given=0;
  for(let i=0;i<total;i++){ const f=el('div','feed-food',food);
    f.onclick=()=>{ if(locked||f.dataset.used||given>=N) return; f.dataset.used=1; f.style.visibility='hidden';
      given++; basket.appendChild(el('div','fed',food)); sTap(); speak(word(given)); setT(given);
      if(given>=N){ locked=true; setTimeout(()=>winRound({}),500); } };
    pile.appendChild(f); }
  wrap.appendChild(pile); $('#stage').appendChild(wrap);
}

/* ---------- Add (Numberblocks) ---------- */
function nbStack(n,color){ const s=el('div','nb-stack',''); for(let i=0;i<n;i++){ const u=el('div','nb-unit',''); u.style.background=color; s.appendChild(u);} return s; }
function rAdd(){
  const a=rint(1,4), b=rint(1,Math.min(4,8-a)), sum=a+b;
  setPrompt(tt().prompt.add, tt().prompt.addSpeak(word(a),word(b)));
  const row=el('div','nb-row','');
  row.appendChild(nbStack(a,'#4dabf7')); row.appendChild(el('div','nb-op','+'));
  row.appendChild(nbStack(b,'#ff6f91')); row.appendChild(el('div','nb-op','= ?'));
  $('#stage').appendChild(row);
  mountChoices(numberChoices(sum,10).map(v=>({ node: el('button',null,String(v)), correct: v===sum })));
}

/* ---------- Balance: make both sides EQUAL (drag/tap beads in) ---------- */
function rBalance(){
  const obj = pick(['🍎','🫘','🧱','⭐','🔵','🍪']);       // one consistent object per round
  const L = rint(2, state.profile==='preschool' ? 6 : 4); // fixed left count (the target)
  setPrompt(tt().prompt.balance, tt().prompt.balanceSpeak);
  const wrap = el('div','','');
  const scale = el('div','scale','');
  scale.appendChild(el('div','post','')); scale.appendChild(el('div','base',''));
  scale.appendChild(el('div','beam',''));
  const panL = el('div','pan left',''), panR = el('div','pan right','');
  const lblL = el('div','pan-count',String(L)), lblR = el('div','pan-count','0');
  panL.appendChild(lblL); panR.appendChild(lblR);
  for(let i=0;i<L;i++) panL.appendChild(el('div','pi',obj));
  scale.appendChild(panL); scale.appendChild(panR);
  wrap.appendChild(scale);
  wrap.appendChild(el('div','bal-hint', tt().prompt.balanceHint));

  let right = 0;
  const update = ()=>{
    lblR.textContent = String(right);
    scale.classList.remove('tilt-left','tilt-right','balanced');
    if(right < L) scale.classList.add('tilt-left');        // left heavier → dips left
    else if(right > L) scale.classList.add('tilt-right');
    else scale.classList.add('balanced');
  };
  const removeOne = (pi)=>{ if(locked) return; pi.remove(); right--; sTap(); update(); };
  const addOne = ()=>{ const pi = el('div','pi',obj); pi.onclick = ()=> removeOne(pi); panR.insertBefore(pi, null); right++; sTap(); speak(word(right)); update();
    if(right===L){ locked=true; update(); sStar(); setTimeout(()=>winRound({}), 750); } };

  const pile = el('div','bal-pile','');
  const supply = L + 2;
  for(let i=0;i<supply;i++){ const f = el('div','bal-src',obj); f.onclick = ()=>{ if(locked) return; addOne(); }; pile.appendChild(f); }
  wrap.appendChild(pile);
  $('#stage').appendChild(wrap);
  update();
}

/* ---------- Shapes ---------- */
function shapeSVG(kind,color){ const m={
  circle:`<circle cx="50" cy="50" r="42" fill="${color}"/>`, square:`<rect x="10" y="10" width="80" height="80" rx="8" fill="${color}"/>`,
  triangle:`<polygon points="50,10 92,88 8,88" fill="${color}"/>`,
  star:`<polygon points="50,6 61,38 95,38 68,59 78,92 50,72 22,92 32,59 5,38 39,38" fill="${color}"/>`,
  heart:`<path d="M50 88 C10 58 12 20 38 20 C48 20 50 30 50 33 C50 30 52 20 62 20 C88 20 90 58 50 88 Z" fill="${color}"/>`,
  rect:`<rect x="6" y="26" width="88" height="48" rx="8" fill="${color}"/>` }; return `<svg viewBox="0 0 100 100" aria-hidden="true">${m[kind]}</svg>`; }
function rShapes(){
  const en = curDef && curDef.en;
  const kinds=['circle','square','triangle','star','heart','rect'];
  const chosen=shuffle(kinds).slice(0,cfg().shapeCount); const target=pick(chosen);
  const palette=['#ff6b6b','#4dabf7','#20c997','#f59f00','#cc5de8','#5c7cfa'];
  const name = en ? T.en.shapes[target] : tt().shapes[target];
  setPrompt(tt().prompt.shapesFind(`<b>${name}</b>`), name, en);
  mountChoices(shuffle(chosen).map((k,i)=>{ const b=el('button',null,''); b.appendChild(el('div','shape',shapeSVG(k,palette[i%palette.length]))); b.style.padding='10px';
    return { node:b, correct:k===target, rightSpeakEN: en?name:null }; }));
}

/* ---------- Big & Small ---------- */
function rBigSmall(){
  const obj=pick(BIG_OBJS), n=cfg().bigCount, wantBig=Math.random()<0.5;
  setPrompt(wantBig?tt().prompt.biggest:tt().prompt.smallest);
  const sizes=[]; const base=54, step=n===2?54:40; for(let i=0;i<n;i++) sizes.push(base+i*step);
  const target = wantBig ? Math.max(...sizes) : Math.min(...sizes);
  mountChoices(shuffle(sizes).map(sz=>{ const b=el('button',null,''); const o=el('div','obj',obj); o.style.fontSize=sz+'px'; b.appendChild(o);
    b.style.background='transparent'; b.style.boxShadow='none'; return { node:b, correct:sz===target }; }));
}

/* ---------- Colors ---------- */
function rColors(){
  const en = curDef && curDef.en;
  const keys=shuffle(COLOR_KEYS).slice(0,cfg().colorCount); const target=pick(keys);
  const name = en ? T.en.colors[target] : tt().colors[target];
  setPrompt(tt().prompt.colorFind(`<b>${name}</b>`), name, en);
  mountChoices(shuffle(keys).map(k=>{ const b=el('button',null,''); const dot=el('div','','');
    dot.style.cssText=`width:clamp(80px,14vw,120px);height:clamp(80px,14vw,120px);border-radius:50%;background:${COLOR_HEX[k]};box-shadow:inset 0 -8px 14px rgba(0,0,0,.15);`;
    b.appendChild(dot); b.style.padding='12px'; return { node:b, correct:k===target, rightSpeakEN: en?name:null }; }));
}

/* ---------- Odd one out ---------- */
function rOdd(){
  const pair=pick(ODD_PAIRS); const [a,b]=Math.random()<0.5?pair:[pair[1],pair[0]];
  const n=cfg().oddCount, items=[];
  for(let i=0;i<n-1;i++) items.push({e:a,correct:false}); items.push({e:b,correct:true});
  setPrompt(tt().prompt.odd);
  mountChoices(shuffle(items).map(it=>{ const btn=el('button',null,''); const o=el('div','obj',it.e); o.style.fontSize='clamp(46px,9vw,86px)'; btn.appendChild(o);
    return { node:btn, correct:it.correct }; }));
}

/* ---------- Pattern ---------- */
function rPattern(){
  const pool=['🔴','🔵','🟡','🟢','🟣','🟠','⭐','❤️'];
  const unitLen=cfg().patternUnit, unit=shuffle(pool).slice(0,unitLen), visible=unitLen*2;
  const seq=[]; for(let i=0;i<visible;i++) seq.push(unit[i%unitLen]); const answer=unit[visible%unitLen];
  setPrompt(tt().prompt.pattern);
  const row=el('div','',''); row.style.cssText='display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:center;';
  seq.forEach(t=>{ const o=el('div','obj',t); o.style.fontSize='clamp(40px,8vw,74px)'; row.appendChild(o); });
  const q=el('div','obj','❓'); q.style.fontSize='clamp(40px,8vw,74px)'; q.style.opacity='.7'; row.appendChild(q);
  $('#stage').appendChild(row);
  mountChoices(shuffle(unit).map(t=>{ const btn=el('button',null,''); const o=el('div','obj',t); o.style.fontSize='clamp(40px,8vw,72px)'; btn.appendChild(o);
    return { node:btn, correct:t===answer }; }));
}

/* ---------- ABC ---------- */
function rABC(){
  const pool = state.profile==='toddler' ? LETTERS_EASY : LETTERS_ALL;
  const target=pick(pool); const cap=Math.min(cfg().choices+1, pool.length);
  const opts=new Set([target]); while(opts.size<cap) opts.add(pick(pool));
  setPrompt(tt().prompt.abcFind(`<b>${target}</b>`), target, true);
  mountChoices(shuffle([...opts]).map(L=>({ node: el('button','glyph-choice',L), correct:L===target, rightSpeakEN:L })));
}

/* ---------- First Words ---------- */
function rWords(){
  const n = state.profile==='toddler'?2:3;
  const chosen = shuffle(WORDS).slice(0,n); const target=pick(chosen);
  setPrompt(tt().prompt.wordFind, target.w, true);
  mountChoices(shuffle(chosen).map(o=>{ const b=el('button',null,''); const g=el('div','obj',o.e); g.style.fontSize='clamp(56px,13vw,120px)'; b.appendChild(g);
    return { node:b, correct:o.w===target.w, rightSpeakEN:target.w }; }));
}

/* ============================================================
   CELEBRATIONS
   ============================================================ */
function confettiInto(ov){ const bits=['🎈','⭐','🎊','💛','💙','🌈','🍬','✨'];
  for(let i=0;i<22;i++){ const c=el('div','confetti',pick(bits)); c.style.left=Math.random()*100+'%';
    c.style.animationDuration=(1.2+Math.random()*1.2)+'s'; c.style.animationDelay=(Math.random()*0.2)+'s'; c.style.fontSize=(18+Math.random()*18)+'px'; ov.appendChild(c); } }
function celebrate(){
  const ov=$('#celebrate'); ov.classList.add('show'); ov.innerHTML='';
  ov.appendChild(el('div','cheer', pick(['🎉','🌟','👏','🥳','💫','🏆']))); confettiInto(ov);
  setTimeout(()=>{ ov.classList.remove('show'); ov.innerHTML=''; }, 1450);
}
function showReveal(rev, cb){
  sStar();
  const ov=el('div','reveal',''); const card=el('div','card2','');
  if(rev.type==='dino'){ card.innerHTML=`<div class="big">${rev.item.e}</div><div class="rv-title">${tt().reward.newBadge}</div><div class="rv-sub">${rev.item[state.lang]}</div>`; speak(tt().reward.newBadge); }
  else { card.innerHTML=`<div class="big">${rev.item}</div><div class="rv-title">${tt().reward.picDone}</div>`; speak(tt().reward.picDone); }
  ov.appendChild(card); confettiInto(ov); document.body.appendChild(ov);
  const done=()=>{ if(ov._done) return; ov._done=1; ov.remove(); cb&&cb(); };
  ov.onclick=done; setTimeout(done, 2400);
}

/* ============================================================
   BREAK / PARENT / COLLECTION wiring
   ============================================================ */
function armBreak(){ playStart=Date.now(); }
function maybeBreak(){ if(!inGame || !state.breakMins) return; if(Date.now()-playStart >= state.breakMins*60000) showBreak(); }
function showBreak(){ const t=tt(); $('#breakTitle').textContent=t.breakT; $('#breakSub').textContent=t.breakS; $('#breakOk').textContent=t.breakOk; $('#breakScreen').classList.add('show'); speak(t.breakT); }
$('#breakOk').onclick=()=>{ $('#breakScreen').classList.remove('show'); armBreak(); };

$('#rewardBtn').onclick=()=>{ prime(); sTap(); openCollection(); };
$('#collClose').onclick=()=>{ $('#collection').classList.remove('show'); };
$('#collection').addEventListener('click',(e)=>{ if(e.target===$('#collection')) $('#collection').classList.remove('show'); });

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
$('#resetStars').onclick=()=>{ state.dino={badges:0,prog:0}; state.pony={done:0,pieces:0}; save(); updateReward(); };
$('#parentClose').onclick=()=>{ $('#parentPanel').classList.remove('show'); renderHome(); };
$('#parentPanel').addEventListener('click', (e)=>{ if(e.target===$('#parentPanel')){ $('#parentPanel').classList.remove('show'); renderHome(); } });

/* ---------- Top nav ---------- */
$('#backBtn').onclick=()=>{ sTap(); exitGame(); };
$('#parentBtn').onclick=()=>{ prime(); openParentGate(); };
$('#langBtn').onclick=()=>{ state.lang = state.lang==='vi'?'en':'vi'; save(); document.documentElement.lang=state.lang; renderHome(); if(inGame) exitGame(); };
document.querySelectorAll('#profileSeg .seg-btn').forEach(b=> b.onclick=()=>{ prime(); sTap(); state.profile=b.dataset.profile; save(); renderHome(); });
document.querySelectorAll('#subjectTabs .seg-btn').forEach(b=> b.onclick=()=>{ prime(); sTap(); state.subject=b.dataset.subject; save(); renderHome(); });
document.addEventListener('pointerdown', prime, { once:true });

document.documentElement.lang=state.lang;
renderHome();
if('serviceWorker' in navigator){ window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{})); }
