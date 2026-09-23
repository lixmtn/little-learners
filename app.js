/* ============================================================
   Bé Học · Little Learners
   Offline no-fail early-math + English for a 2.5yo (Dino) & 4yo (Pony).
   Reward meta-game: Dino badge album / Pony jigsaw. Numberblocks add,
   balance-scale measurement, give-N "feed" — grounded in Monkey Math /
   Numberblocks / collectible-puzzle research.
   ============================================================ */
'use strict';

/* ---------- State ---------- */
const DEFAULTS = { profile:'toddler', lang:'vi', subject:'math', voice:true, breakMins:15, matchDiff:'easy', flashDiff:'easy',
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
    subjects:{math:'Toán & Tư duy', english:'Tiếng Anh', play:'Chơi vui', phonics:'Phonics'},
    profiles:{toddler:'Bé nhỏ', preschool:'Bé lớn'},
    games:{count:'Đếm', feed:'Cho ăn', numeral:'Học số', add:'Phép cộng', balance:'Cân nặng',
           shapes:'Hình khối', bigsmall:'To & Nhỏ', colors:'Màu sắc', odd:'Tìm cái khác', pattern:'Tiếp theo',
           abc:'Chữ cái ABC', words:'Từ vựng', colorsEN:'Màu sắc', shapesEN:'Hình khối',
           match:'Ghép hình', trace:'Tập viết số', sub:'Phép trừ', flash:'Nhớ ô sáng'},
    diff:{easy:'Dễ', mid:'Vừa', hard:'Khó'},
    prompt:{
      count:'Đếm xem có bao nhiêu?',
      feed:(n)=>`Cho bạn ấy ăn ${n} cái nào!`, feedSpeak:(w)=>`Cho ăn ${w} cái`,
      add:'Có tất cả bao nhiêu khối?', addSpeak:(a,b)=>`${a} cộng ${b} bằng mấy?`, addCombine:'Chạm để ghép 2 khối lại!',
      addDrag:'Kéo 2 tháp khối lại với nhau!', addEq:(s)=>`Bằng ${s}!`,
      sub:(m)=>`Bớt đi ${m} khối`, subSpeak:(m)=>`Bớt đi ${m} khối`, subHint:'Chạm khối để bỏ ra',
      subEq:(n,m)=>`${n} bớt ${m} bằng mấy?`, subCount:'Đếm lại còn mấy khối?', subPick:'Còn lại mấy khối?',
      flashStudy:'Nhìn kỹ các ô sáng!', flashRecall:'Ô nào vừa sáng? Chạm vào!',
      balance:'Cho hai bên bằng nhau nào!', balanceAsk:(x,t)=>`${x} thêm mấy bằng ${t}?`, balancePick:'Thêm mấy cái để bằng nhau?',
      match:'Lật tìm 2 hình giống nhau!', matchSpeak:'Tìm hai hình giống nhau', trace:(n)=>`Tô theo số ${n}`, traceSpeak:(w)=>`Viết số ${w}`, traceHint:'Đưa ngón tay theo nét',
      pLearn:'Nghe âm nào!', pFind:(L)=>`Hình nào bắt đầu bằng "${L}"?`, pRead:'Đọc từ — chọn hình đúng!', pNext:'Tiếp →', pSoon:'Sắp có', pLevel:(n)=>`Sách ${n}`,
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
    subjects:{math:'Math & Thinking', english:'English', play:'Fun', phonics:'Phonics'},
    profiles:{toddler:'Little one', preschool:'Big kid'},
    games:{count:'Count', feed:'Feed', numeral:'Numbers', add:'Add', balance:'Weigh',
           shapes:'Shapes', bigsmall:'Big & Small', colors:'Colors', odd:'Odd one out', pattern:'What’s next',
           abc:'ABC Letters', words:'First Words', colorsEN:'Colors', shapesEN:'Shapes',
           match:'Memory', trace:'Trace', sub:'Subtract', flash:'Flash memory'},
    diff:{easy:'Easy', mid:'Medium', hard:'Hard'},
    prompt:{
      count:'How many are there?',
      feed:(n)=>`Feed your friend ${n}!`, feedSpeak:(w)=>`Feed ${w}`,
      add:'How many blocks altogether?', addSpeak:(a,b)=>`${a} plus ${b} is?`, addCombine:'Tap to join the two blocks!',
      addDrag:'Drag the two towers together!', addEq:(s)=>`Equals ${s}!`,
      sub:(m)=>`Take away ${m} blocks`, subSpeak:(m)=>`Take away ${m}`, subHint:'Tap a block to remove it',
      subEq:(n,m)=>`${n} take away ${m} is?`, subCount:'Count what’s left', subPick:'How many are left?',
      flashStudy:'Look carefully at the bright cells!', flashRecall:'Which cells were lit? Tap them!',
      balance:'Make both sides equal!', balanceAsk:(x,t)=>`${x} plus how many makes ${t}?`, balancePick:'How many more to make it equal?',
      match:'Flip to find 2 that match!', matchSpeak:'Find two that match', trace:(n)=>`Trace the number ${n}`, traceSpeak:(w)=>`Write ${w}`, traceHint:'Move your finger along the line',
      pLearn:'Listen to the sound!', pFind:(L)=>`Which one starts with "${L}"?`, pRead:'Read the word — tap the picture!', pNext:'Next →', pSoon:'Soon', pLevel:(n)=>`Book ${n}`,
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
  { id:'sub',     gen:'sub',     icon:'➖', color:'#f783ac', subject:'math', profiles:['preschool'] },
  { id:'balance', gen:'balance', icon:'⚖️', color:'#7c83ff', subject:'math', profiles:['preschool'] },
  { id:'shapes',  gen:'shapes',  icon:'🔺', color:'#ff9f5a', subject:'math', profiles:['toddler','preschool'] },
  { id:'bigsmall',gen:'bigsmall',icon:'📏', color:'#2fc19e', subject:'math', profiles:['toddler'] },
  { id:'colors',  gen:'colors',  icon:'🎨', color:'#c77dff', subject:'math', profiles:['toddler'] },
  { id:'odd',     gen:'odd',     icon:'🔍', color:'#ffb14e', subject:'math', profiles:['toddler'] },
  { id:'pattern', gen:'pattern', icon:'🧩', color:'#39b7e5', subject:'math', profiles:['preschool'] },
  { id:'match',   gen:'match',   icon:'🃏', color:'#ff8fab', subject:'play', profiles:['toddler','preschool'] },
  { id:'trace',   gen:'trace',   icon:'✏️', color:'#5cc8b8', subject:'play', profiles:['toddler','preschool'] },
  { id:'flash',   gen:'flash',   icon:'🧠', color:'#ffa94d', subject:'play', profiles:['toddler','preschool'] },
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
const MATCH_POOL = { dino:['🦖','🦕','🥚','🦴','🌋','🐊','🐢','🦎','🐉','🦣'], pony:['🦄','🐴','🌈','🌸','⭐','🦋','💖','🎀','🍭','☁️'] };
/* single-stroke-ish digit guide paths in a 0..100 box (for tracing) */
const DIGIT_D = {
  0:'M50 20 Q32 20 32 50 Q32 80 50 80 Q68 80 68 50 Q68 20 50 20',
  1:'M40 30 L52 20 L52 82',
  2:'M32 34 Q48 12 66 30 Q72 48 42 66 L34 82 L70 82',
  3:'M34 26 Q64 12 62 38 Q60 50 46 50 Q64 50 64 66 Q60 86 32 76',
  4:'M60 20 L32 60 L72 60 M58 40 L58 82',
  5:'M64 22 L40 22 L38 48 Q64 40 64 64 Q60 84 34 78',
  6:'M62 24 Q40 26 38 54 Q36 82 56 82 Q70 80 68 62 Q64 48 44 52',
  7:'M32 24 L70 24 L46 82',
  8:'M50 48 Q30 46 32 30 Q36 16 50 18 Q66 20 66 33 Q66 46 50 48 Q30 50 30 66 Q32 84 50 84 Q70 84 70 66 Q68 50 50 48',
  9:'M62 42 Q62 20 44 22 Q30 24 32 40 Q34 54 54 50 Q62 48 62 40 M62 42 L58 82'
};
/* hand-drawn SVG mascots (chibi) */
function svgDino(){ return `<svg viewBox="0 0 100 100" class="mascot-svg" aria-hidden="true">
  <path d="M22 72 Q4 70 9 54 Q17 62 28 62 Z" fill="#3fb877"/>
  <ellipse cx="50" cy="64" rx="30" ry="26" fill="#4ecb8b"/>
  <path d="M40 40 l6 -13 6 13 Z M52 41 l6 -13 6 13 Z M64 44 l5 -11 5 11 Z" fill="#2fa96f"/>
  <ellipse cx="50" cy="72" rx="17" ry="14" fill="#c4f2d9"/>
  <rect x="38" y="82" width="11" height="15" rx="5" fill="#3fb877"/><rect x="55" y="82" width="11" height="15" rx="5" fill="#3fb877"/>
  <circle cx="66" cy="42" r="24" fill="#4ecb8b"/>
  <circle cx="60" cy="40" r="8.5" fill="#fff"/><circle cx="62" cy="41" r="4.2" fill="#22223b"/>
  <circle cx="76" cy="40" r="7.5" fill="#fff"/><circle cx="78" cy="41" r="3.7" fill="#22223b"/>
  <circle cx="55" cy="52" r="4" fill="#ff9ec7" opacity=".55"/>
  <path d="M60 54 Q68 60 78 53" stroke="#2f8f5f" stroke-width="3.2" fill="none" stroke-linecap="round"/>
</svg>`; }
function svgPony(){ return `<svg viewBox="0 0 100 100" class="mascot-svg" aria-hidden="true">
  <path d="M22 60 Q6 58 10 82 Q20 74 30 76 Z" fill="#ffb3d9"/>
  <ellipse cx="48" cy="64" rx="29" ry="23" fill="#ffd9ec"/>
  <rect x="34" y="80" width="10" height="16" rx="4" fill="#ffc2e2"/><rect x="54" y="80" width="10" height="16" rx="4" fill="#ffc2e2"/>
  <ellipse cx="70" cy="46" rx="21" ry="18" fill="#ffe6f2"/>
  <path d="M78 26 L82 8 L86 26 Z" fill="#ffd23f"/>
  <path d="M56 30 Q64 22 74 26 Q66 34 72 42 Q62 38 58 46 Q54 36 56 30 Z" fill="#7c83ff"/>
  <path d="M58 34 Q66 30 73 33" stroke="#ff6f91" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M60 40 Q68 38 74 41" stroke="#3ec9a7" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="78" cy="46" r="6.5" fill="#fff"/><circle cx="79" cy="47" r="3.3" fill="#5b3a5b"/>
  <circle cx="66" cy="52" r="4" fill="#ff8fbf" opacity=".6"/>
  <path d="M60 56 Q66 60 72 56" stroke="#c76" stroke-width="2.6" fill="none" stroke-linecap="round"/>
</svg>`; }
const mascotSVG = ()=> theme()==='dino' ? svgDino() : svgPony();
/* ---- Oxford-style phonics data ---- */
const PHONICS_L1 = [
  {L:'A',w:'apple',e:'🍎'},{L:'B',w:'ball',e:'⚽'},{L:'C',w:'cat',e:'🐱'},{L:'D',w:'dog',e:'🐶'},
  {L:'E',w:'egg',e:'🥚'},{L:'F',w:'fish',e:'🐟'},{L:'G',w:'goat',e:'🐐'},{L:'H',w:'hat',e:'🎩'},
  {L:'I',w:'insect',e:'🐛'},{L:'J',w:'juice',e:'🧃'},{L:'K',w:'key',e:'🔑'},{L:'L',w:'lion',e:'🦁'},
  {L:'M',w:'moon',e:'🌙'},{L:'N',w:'nest',e:'🪺'},{L:'O',w:'octopus',e:'🐙'},{L:'P',w:'pig',e:'🐷'},
  {L:'Q',w:'queen',e:'👸'},{L:'R',w:'rabbit',e:'🐰'},{L:'S',w:'sun',e:'☀️'},{L:'T',w:'tiger',e:'🐯'},
  {L:'U',w:'umbrella',e:'☂️'},{L:'V',w:'van',e:'🚐'},{L:'W',w:'watch',e:'⌚'},{L:'X',w:'fox',e:'🦊'},
  {L:'Y',w:'yoyo',e:'🪀'},{L:'Z',w:'zebra',e:'🦓'}
];
const PHONICS_L2 = [
  {w:'cat',e:'🐱'},{w:'hat',e:'🎩'},{w:'bag',e:'👜'},{w:'map',e:'🗺️'},
  {w:'hen',e:'🐔'},{w:'bed',e:'🛏️'},{w:'net',e:'🥅'},{w:'pen',e:'🖊️'},
  {w:'pig',e:'🐷'},{w:'six',e:'6️⃣'},{w:'pin',e:'📌'},{w:'lips',e:'👄'},
  {w:'dog',e:'🐶'},{w:'box',e:'📦'},{w:'mop',e:'🧹'},{w:'pot',e:'🍲'},
  {w:'bus',e:'🚌'},{w:'sun',e:'☀️'},{w:'cup',e:'☕'},{w:'bug',e:'🐛'}
];
const PHONICS_LEVELS = [
  {n:1, vi:'Chữ & Âm',        en:'Letter Sounds',      sub:'A–Z',        icon:'🅰️', color:'#ff8fab', locked:false},
  {n:2, vi:'Nguyên âm ngắn',  en:'Short Vowels',       sub:'cat · dog',  icon:'🐱', color:'#4dabf7', locked:false},
  {n:3, vi:'Nguyên âm dài',   en:'Long Vowels',        sub:'cake · bike',icon:'🎂', color:'#20c997', locked:true},
  {n:4, vi:'Ghép phụ âm',     en:'Blends & Digraphs',  sub:'sh · bl',    icon:'🚀', color:'#c77dff', locked:true},
  {n:5, vi:'Ghép nguyên âm',  en:'Letter Teams',       sub:'ai · ee',    icon:'🌈', color:'#ffb14e', locked:true}
];

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
  const hm=$('#homeMascot'); if(hm) hm.innerHTML=mascotSVG();
  $('#homeTitle').textContent = tt().appTitle;
  $('#langBtn').textContent = state.lang==='vi' ? '🇻🇳' : '🇬🇧';
  $('#subMath').textContent = tt().subjects.math;
  $('#subEng').textContent  = tt().subjects.english;
  $('#subPlay').textContent = tt().subjects.play;
  $('#subPhonics').textContent = tt().subjects.phonics;
  updateReward();
  document.querySelectorAll('#subjectTabs .seg-btn').forEach(b=> b.classList.toggle('on', b.dataset.subject===state.subject));
  document.querySelectorAll('#profileSeg .seg-btn').forEach(b=>{
    b.classList.toggle('on', b.dataset.profile===state.profile);
    b.querySelector('.lbl-main').textContent = tt().profiles[b.dataset.profile];
  });
  const grid = $('#gameGrid'); grid.innerHTML='';
  if(state.subject==='phonics'){ renderPhonicsLevels(grid); return; }
  const list = GAMES.filter(g=>g.profiles.includes(state.profile) && g.subject===state.subject);
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
function renderPhonicsLevels(grid){
  grid.style.gridTemplateColumns = 'repeat(3,1fr)'; grid.style.maxWidth='1040px';
  PHONICS_LEVELS.forEach(lv=>{
    const c = el('button','card'+(lv.locked?' locked':''));
    c.style.background = `linear-gradient(160deg, ${shade(lv.color,15)}, ${shade(lv.color,-8)})`;
    c.style.setProperty('--card-shade', shade(lv.color,-32));
    const name = state.lang==='vi'?lv.vi:lv.en;
    c.innerHTML = `<div class="ico-plate"><div class="ico">${lv.icon}</div></div><div class="label">${tt().prompt.pLevel(lv.n)}: ${name}</div><div class="card-sub">${lv.locked?tt().prompt.pSoon:lv.sub}</div>`;
    if(!lv.locked) c.onclick = ()=>{ prime(); sTap(); startGame({id:'phonics'+lv.n, gen:'phonics', level:lv.n, subject:'phonics', profiles:['toddler','preschool']}); };
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
const GEN = { count:rCount, feed:rFeed, add:rAdd, sub:rSub, balance:rBalance, shapes:rShapes, bigsmall:rBigSmall, colors:rColors, odd:rOdd, pattern:rPattern, abc:rABC, words:rWords, match:rMatch, trace:rTrace, flash:rFlash, phonics:rPhonics };
let curDef=null, locked=false, playStart=0, inGame=false, flashTimer=null, pendingReload=false;
function clearFlashTimer(){ if(flashTimer){ clearTimeout(flashTimer); clearInterval(flashTimer); flashTimer=null; } }

function startGame(def){ curDef=def; inGame=true; armBreak(); document.body.classList.add('playing'); show('game'); nextRound(); }
function exitGame(){ inGame=false; clearFlashTimer(); document.body.classList.remove('playing'); try{ speechSynthesis.cancel(); }catch(e){} renderHome(); show('home');
  if(pendingReload){ pendingReload=false; location.reload(); } }

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
    if(it.onRight) it.onRight();
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
  clearFlashTimer();
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
  setPrompt(tt().prompt.feed(`<b>${N}</b>`), tt().prompt.feedSpeak(word(N)));
  const wrap=el('div','feed-wrap','');
  const fm=el('div','feed-mascot',''); fm.innerHTML=mascotSVG(); wrap.appendChild(fm);
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
/* ADD: drag one tower onto the other → cubes merge into one tower, count up (no multiple-choice) */
function rAdd(){
  const max = state.profile==='toddler' ? 5 : 10;
  const a=rint(1,max-1), b=rint(1,max-a), sum=a+b;
  setPrompt(tt().prompt.addDrag, tt().prompt.addSpeak(word(a),word(b)));
  const wrap=el('div','add-wrap','');
  const row=el('div','add-row','');
  const tA=nbStack(a,'#4dabf7'), op=el('div','nb-op','+'), tB=nbStack(b,'#ff6f91');
  tB.classList.add('draggable');
  row.appendChild(tA); row.appendChild(op); row.appendChild(tB);
  const badge=el('div','nb-total',''); wrap.appendChild(row); wrap.appendChild(badge);
  wrap.appendChild(el('div','bal-hint', tt().prompt.addDrag));
  $('#stage').appendChild(wrap);
  let dragging=false, sx=0, sy=0, merged=false;
  tB.addEventListener('pointerdown',(ev)=>{ if(merged||locked)return; dragging=true; sx=ev.clientX; sy=ev.clientY; try{tB.setPointerCapture(ev.pointerId);}catch(e){} ev.preventDefault(); });
  tB.addEventListener('pointermove',(ev)=>{ if(!dragging)return; tB.style.transform=`translate(${ev.clientX-sx}px,${ev.clientY-sy}px)`; });
  const drop=()=>{ if(!dragging)return; dragging=false;
    const ra=tA.getBoundingClientRect(), rb=tB.getBoundingClientRect();
    const dist=Math.hypot((ra.left+ra.width/2)-(rb.left+rb.width/2),(ra.top+ra.height/2)-(rb.top+rb.height/2));
    if(dist < ra.width+70) doMerge(); else { tB.style.transition='transform .3s'; tB.style.transform=''; setTimeout(()=>tB.style.transition='',300); } };
  tB.addEventListener('pointerup',drop); tB.addEventListener('pointercancel',drop);
  function doMerge(){ if(merged)return; merged=true; locked=true; sTap();
    op.style.display='none'; tB.style.display='none'; tA.innerHTML='';
    const cubes=[]; for(let i=0;i<sum;i++){ const u=el('div','nb-unit',''); u.style.background=i<a?'#4dabf7':'#ff6f91'; u.style.opacity='.45'; tA.appendChild(u); cubes.push(u); }
    let i=0; const step=()=>{ if(i<sum){ cubes[i].style.opacity='1'; cubes[i].classList.add('nb-merge'); sTap(); speak(word(i+1)); i++; setTimeout(step,400); }
      else { badge.textContent=sum; badge.classList.add('show'); speak(tt().prompt.addEq(word(sum))); setTimeout(()=>winRound({}),1000); } };
    setTimeout(step,300);
  }
}

/* SUBTRACT: take-away — tap cubes off the tower until M removed, remaining = answer */
function rSub(){
  const N=rint(3, state.profile==='toddler'?6:10), M=rint(1,N-1), ans=N-M;
  setPrompt(`<span class="eq">${N} − ${M} = <b class="q">?</b></span>`, tt().prompt.subEq(word(N),word(M)));
  const wrap=el('div','add-wrap','');
  const tower=nbStack(N,'#7c83ff');
  const row=el('div','add-row',''); row.appendChild(tower); wrap.appendChild(row);
  const hint=el('div','bal-hint', tt().prompt.subHint); wrap.appendChild(hint);
  $('#stage').appendChild(wrap);
  const cubes=[...tower.children]; let removed=0; locked=false;
  cubes.forEach(u=>{ u.style.cursor='pointer';
    u.onclick=()=>{ if(locked||u.dataset.gone||removed>=M)return; u.dataset.gone=1; u.classList.add('fly'); removed++; sTap();
      setTimeout(()=>{ u.style.display='none'; },340);
      if(removed>=M){ locked=true; setTimeout(recount,650); } }; });
  function recount(){                                // count what's left, out loud
    const left=cubes.filter(u=>!u.dataset.gone);
    hint.textContent=tt().prompt.subCount; speak(tt().prompt.subCount);
    let i=0; const step=()=>{ if(i<left.length){ left[i].classList.add('nb-merge'); left[i].style.background='#4dabf7'; sTap(); speak(word(i+1)); i++; setTimeout(step,440); } else { pickAnswer(); } };
    setTimeout(step,350);
  }
  function pickAnswer(){                              // choose the result, then reveal it in the equation
    hint.textContent=tt().prompt.subPick;
    const reveal=()=>{ const q=$('#promptText').querySelector('.q'); if(q){ q.textContent=ans; q.classList.add('hi'); } };
    mountChoices(numberChoices(ans,N).map(v=>({ node:el('button',null,String(v)), correct:v===ans, onRight:reveal })));
  }
}

/* FLASH & RECALL: show lit cells for a few seconds, hide, then tap where they were */
const FLASH_CFG = {
  toddler:  { easy:{n:3,expo:6,c:3,r:2}, mid:{n:4,expo:5,c:3,r:3}, hard:{n:5,expo:5,c:4,r:3} },
  preschool:{ easy:{n:4,expo:5,c:3,r:3}, mid:{n:5,expo:5,c:4,r:3}, hard:{n:6,expo:4,c:4,r:4} }
};
function rFlash(){
  const table=FLASH_CFG[state.profile]; if(!table[state.flashDiff]) state.flashDiff='easy';
  const c=table[state.flashDiff];
  const stage=$('#stage');
  const col=el('div',''); col.style.cssText='display:flex;flex-direction:column;align-items:center;gap:12px;width:100%;';
  const sel=el('div','match-diff','');
  ['easy','mid','hard'].forEach(k=>{ const btn=el('button','db'+(k===state.flashDiff?' on':''), tt().diff[k]); btn.onclick=()=>{ state.flashDiff=k; save(); nextRound(); }; sel.appendChild(btn); });
  col.appendChild(sel);
  const grid=el('div','flash-grid',''); grid.style.gridTemplateColumns=`repeat(${c.c},1fr)`; grid.style.width=`min(90vw, ${c.c*108}px)`;
  const total=c.c*c.r, cells=[]; for(let i=0;i<total;i++){ const cell=el('div','fcell',''); grid.appendChild(cell); cells.push(cell); }
  col.appendChild(grid); stage.appendChild(col);
  const litArr = shuffle([...Array(total).keys()]).slice(0,c.n);   // ordered lit cells
  const orderOf={}; litArr.forEach((idx,n)=>orderOf[idx]=n+1);
  const litSet = new Set(litArr);
  locked=true; clearFlashTimer();
  setPrompt(tt().prompt.flashStudy, tt().prompt.flashStudy);
  let k=0;                                                          // reveal cells ONE BY ONE, numbered + blinking
  const revealNext=()=>{
    if(k<litArr.length){ const cell=cells[litArr[k]]; cell.classList.add('lit','blink'); cell.textContent=String(k+1); sTap(); speak(word(k+1)); k++;
      flashTimer=setTimeout(revealNext, 850); }
    else { flashTimer=setTimeout(hideAndRecall, Math.max(1400, c.expo*250)); }
  };
  revealNext();
  function hideAndRecall(){
    litArr.forEach(i=>{ cells[i].classList.remove('lit','blink'); cells[i].textContent=''; });
    setPrompt(tt().prompt.flashRecall, tt().prompt.flashRecall);
    locked=false; let found=0;
    cells.forEach((cell,i)=>{ cell.onclick=()=>{ if(locked||cell.dataset.done)return;
      if(litSet.has(i)){ cell.dataset.done=1; cell.classList.add('lit','ok'); cell.textContent=String(orderOf[i]); found++; sStar();
        if(found===litArr.length){ locked=true; setTimeout(()=>winRound({}),500); } }
      else { cell.classList.add('miss'); sWrong(); speak(pick(tt().tryagain)); setTimeout(()=>cell.classList.remove('miss'),450); } }; });
  }
}

/* ---------- Memory match (flip 2, selectable difficulty) ---------- */
function rMatch(){
  const pool = MATCH_POOL[theme()];
  const diffs = state.profile==='toddler'
    ? [{k:'easy',pairs:3,cols:3},{k:'mid',pairs:4,cols:4},{k:'hard',pairs:6,cols:4}]
    : [{k:'easy',pairs:4,cols:4},{k:'mid',pairs:6,cols:4},{k:'hard',pairs:8,cols:4}];
  if(!diffs.find(d=>d.k===state.matchDiff)) state.matchDiff='easy';
  setPrompt(tt().prompt.match, tt().prompt.matchSpeak);
  const stage=$('#stage');
  const col=el('div',''); col.style.cssText='display:flex;flex-direction:column;align-items:center;gap:4px;width:100%;';
  const sel=el('div','match-diff','');
  diffs.forEach(d=>{ const btn=el('button','db'+(d.k===state.matchDiff?' on':''), tt().diff[d.k]);
    btn.onclick=()=>{ state.matchDiff=d.k; save(); document.querySelectorAll('.match-diff .db').forEach(x=>x.classList.toggle('on',x===btn)); deal(); };
    sel.appendChild(btn); });
  col.appendChild(sel);
  const gridWrap=el('div','',''); col.appendChild(gridWrap);
  stage.appendChild(col);
  let first=null, busy=false, matched=0, totalPairs=0;
  function deal(){
    const d=diffs.find(x=>x.k===state.matchDiff)||diffs[0]; totalPairs=d.pairs; matched=0; first=null; busy=false; locked=false;
    const faces=shuffle(pool).slice(0,d.pairs);
    const cards=shuffle([...faces,...faces]);
    const grid=el('div','match-grid',''); grid.style.gridTemplateColumns=`repeat(${d.cols},1fr)`;
    grid.style.width=`min(90vw, ${d.cols*120}px)`;
    cards.forEach(face=>{
      const card=el('div','mcard','');
      card.innerHTML=`<div class="inner"><div class="mface mback">${theme()==='dino'?'🦖':'🦄'}</div><div class="mface mfront">${face}</div></div>`;
      card.dataset.face=face;
      card.onclick=()=>{ if(busy||locked||card.classList.contains('flip')||card.classList.contains('done')) return;
        card.classList.add('flip'); sTap(); prime();
        if(!first){ first=card; return; }
        busy=true;
        if(first.dataset.face===card.dataset.face){
          const f=first; setTimeout(()=>{ f.classList.add('done'); card.classList.add('done'); matched++; sStar(); busy=false;
            if(matched===totalPairs){ locked=true; setTimeout(()=>winRound({}),550); } },350); first=null;
        } else { const f=first; first=null; setTimeout(()=>{ f.classList.remove('flip'); card.classList.remove('flip'); busy=false; },850); }
      };
      grid.appendChild(card);
    });
    gridWrap.innerHTML=''; gridWrap.appendChild(grid);
  }
  deal();
}

/* ---------- Number tracing (finger writing) ---------- */
function rTrace(){
  const pool = state.profile==='toddler' ? [1,2,3] : [1,2,3,4,5,6,7,8,9];
  const n = pick(pool);
  setPrompt(tt().prompt.trace(`<b>${n}</b>`), tt().prompt.traceSpeak(word(n)));
  const NS='http://www.w3.org/2000/svg';
  const wrap=el('div','trace-wrap',''); const box=el('div','trace-box','');
  const svg=document.createElementNS(NS,'svg'); svg.setAttribute('viewBox','0 0 100 100');
  svg.innerHTML=`<defs><linearGradient id="tgrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c5cff"/><stop offset="1" stop-color="#ff6f91"/></linearGradient></defs>`;
  const guide=document.createElementNS(NS,'path'); guide.setAttribute('d',DIGIT_D[n]); guide.setAttribute('class','tc-guide'); svg.appendChild(guide);
  const userPath=document.createElementNS(NS,'path'); userPath.setAttribute('class','tc-fill'); userPath.setAttribute('d',''); svg.appendChild(userPath);
  box.appendChild(svg); wrap.appendChild(box); wrap.appendChild(el('div','bal-hint', tt().prompt.traceHint));
  $('#stage').appendChild(wrap);
  const total=guide.getTotalLength(); const steps=Math.max(10,Math.round(total/6)); const pts=[];
  for(let i=0;i<=steps;i++){ const q=guide.getPointAtLength(total*i/steps); const dot=document.createElementNS(NS,'circle');
    dot.setAttribute('cx',q.x); dot.setAttribute('cy',q.y); dot.setAttribute('r', i===0?4.2:2.6); dot.setAttribute('class', i===0?'tc-start':'tc-dot'); svg.appendChild(dot);
    pts.push({x:q.x,y:q.y,hit:false,el:dot}); }
  let drawing=false, hit=0, dstr='';
  const toSvg=(ev)=>{ const r=box.getBoundingClientRect(); return {x:(ev.clientX-r.left)/r.width*100, y:(ev.clientY-r.top)/r.height*100}; };
  const check=(x,y)=>{ pts.forEach(p=>{ if(!p.hit && Math.hypot(p.x-x,p.y-y)<10){ p.hit=true; hit++; p.el.classList.add('hit'); } });
    // must trace almost the whole stroke AND reach the very end
    if(hit>=Math.ceil(pts.length*0.9) && pts[pts.length-1].hit && !locked){ locked=true; userPath.setAttribute('d',DIGIT_D[n]); sStar(); setTimeout(()=>winRound({}),500); } };
  box.addEventListener('pointerdown',(ev)=>{ if(locked)return; drawing=true; const p=toSvg(ev); dstr=`M${p.x} ${p.y}`; userPath.setAttribute('d',dstr); check(p.x,p.y); ev.preventDefault(); });
  box.addEventListener('pointermove',(ev)=>{ if(!drawing||locked)return; const p=toSvg(ev); dstr+=` L${p.x} ${p.y}`; userPath.setAttribute('d',dstr); check(p.x,p.y); ev.preventDefault(); });
  const stop=()=>{ drawing=false; };
  box.addEventListener('pointerup',stop); box.addEventListener('pointerleave',stop); box.addEventListener('pointercancel',stop);
}

/* ---------- Phonics (Oxford-style: learn → find sound → read CVC) ---------- */
let phonicsCount=0;
function phonicsLearn(big, wordText, emoji, isWord){
  setPrompt(tt().prompt.pLearn, `${big}. ${wordText}`, true);
  const card=el('div','p-card','');
  card.innerHTML=`<div class="p-big${isWord?' word':''}">${isWord?big.toLowerCase():big}</div><div class="p-emoji">${emoji}</div><div class="p-word2">${wordText}</div>`;
  card.onclick=()=>{ prime(); speakEN(`${big}. ${wordText}`); };
  $('#stage').appendChild(card);
  const next=el('button','choice wide',tt().prompt.pNext); next.style.minWidth='200px';
  next.onclick=()=>{ prime(); sTap(); if(inGame) nextRound(); };
  $('#choices').appendChild(next); locked=false;
}
function rPhonics(){
  const lvl=curDef.level; phonicsCount++;
  const learn = phonicsCount%3===1;
  const picChoice=(list,keyOf,target)=>{ const distract=shuffle(list.filter(x=>keyOf(x)!==keyOf(target))).slice(0,2);
    return shuffle([target,...distract]).map(o=>{ const b=el('button',null,''); const g=el('div','obj',o.e); g.style.fontSize='clamp(50px,11vw,100px)'; b.appendChild(g);
      return { node:b, correct:keyOf(o)===keyOf(target), rightSpeakEN:target.w }; }); };
  if(lvl===1){
    const t=pick(PHONICS_L1);
    if(learn) return phonicsLearn(t.L, t.w, t.e);
    setPrompt(tt().prompt.pFind(t.L), `${t.L}. ${t.w}`, true);
    const big=el('div','p-big',t.L); $('#stage').appendChild(big);
    mountChoices(picChoice(PHONICS_L1, x=>x.L, t));
  } else {
    const t=pick(PHONICS_L2);
    if(learn) return phonicsLearn(t.w.toUpperCase(), t.w, t.e, true);
    setPrompt(tt().prompt.pRead, t.w, true);
    const wd=el('div','p-big word',t.w); $('#stage').appendChild(wd);
    mountChoices(picChoice(PHONICS_L2, x=>x.w, t));
  }
}

/* ---------- Balance: missing addend to make both sides equal ("T = X + ?") ---------- */
function rBalance(){
  const obj = pick(['🎂','🧁','🍎','🍪','⭐','🍩']);
  const T = state.profile==='preschool' ? rint(5,10) : rint(3,6);   // total (up to 10)
  const X = rint(1, T-1), ans = T - X;                              // known part, missing part
  setPrompt(`<span class="eq">${T} = ${X} + <b class="q">?</b></span>`, tt().prompt.balanceAsk(word(X),word(T)));
  const wrap=el('div','','');
  const scale=el('div','scale tilt-right','');                      // right (X) is lighter → dips... left heavier so tilt-left; X on right lighter → right up
  scale.classList.remove('tilt-right'); scale.classList.add('tilt-left');
  scale.appendChild(el('div','post','')); scale.appendChild(el('div','base','')); scale.appendChild(el('div','beam',''));
  const panL=el('div','pan left',''), panR=el('div','pan right','');
  panL.appendChild(el('div','pan-count',String(T)));
  const lblR=el('div','pan-count',String(X)); panR.appendChild(lblR);
  for(let i=0;i<T;i++) panL.appendChild(el('div','pi',obj));
  for(let i=0;i<X;i++) panR.appendChild(el('div','pi',obj));
  scale.appendChild(panL); scale.appendChild(panR);
  wrap.appendChild(scale);
  wrap.appendChild(el('div','bal-hint', tt().prompt.balancePick));
  $('#stage').appendChild(wrap);
  const set=new Set([ans]); let guard=0;
  while(set.size<3 && guard++<40){ const c=rint(1, Math.max(3,T-1)); set.add(c); }
  mountChoices(shuffle([...set]).map(v=>{
    const b=el('button','wide',''); const g=el('div',''); g.style.cssText='display:flex;gap:3px;flex-wrap:wrap;justify-content:center;max-width:160px;';
    for(let i=0;i<v;i++){ const e=el('span','',obj); e.style.fontSize='clamp(18px,3.2vw,28px)'; g.appendChild(e); } b.appendChild(g);
    return { node:b, correct:v===ans, onRight:()=>{
      const q=$('#promptText').querySelector('.q'); if(q){ q.textContent=ans; q.classList.add('hi'); }
      for(let i=0;i<ans;i++){ const pi=el('div','pi',obj); pi.classList.add('nb-merge'); panR.appendChild(pi); }
      lblR.textContent=String(T); scale.classList.remove('tilt-left'); scale.classList.add('balanced');
    } };
  }));
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
  const pool=['🔴','🔵','🟡','🟢','🟣','🟠','⭐','❤️','🔺','🟩','🍎','🐱'];
  const templates = state.profile==='toddler'
    ? [[0,1],[0,0,1],[0,1,1]]                                   // AB · AAB · ABB
    : [[0,1],[0,1,2],[0,0,1],[0,1,1],[0,1,1,2],[0,0,1,2]];      // + ABC · ABBC · AABC
  const tpl=pick(templates), kinds=Math.max(...tpl)+1;
  const toks=shuffle(pool).slice(0,kinds);
  const unit=tpl.map(i=>toks[i]), unitLen=unit.length;
  const full=[]; for(let i=0;i<unitLen*3+2;i++) full.push(unit[i%unitLen]);
  let visible=Math.min(7, rint(unitLen+1, unitLen*2));          // varied length
  if(state.profile==='preschool' && visible%unitLen===0) visible=Math.min(7, visible+1); // never end on a full repeat → answer isn't the first token
  const seq=full.slice(0,visible), answer=full[visible];
  setPrompt(tt().prompt.pattern);
  const row=el('div',''); row.style.cssText='display:flex;gap:clamp(6px,1.5vw,12px);flex-wrap:wrap;align-items:center;justify-content:center;';
  seq.forEach(t=>{ const o=el('div','obj',t); o.style.fontSize='clamp(36px,7vw,66px)'; row.appendChild(o); });
  const q=el('div','obj','❓'); q.style.fontSize='clamp(36px,7vw,66px)'; q.style.opacity='.7'; row.appendChild(q);
  $('#stage').appendChild(row);
  const choiceToks=new Set(unit);
  if(state.profile==='preschool'){ const extra=pool.find(t=>!choiceToks.has(t)); if(extra) choiceToks.add(extra); }
  mountChoices(shuffle([...choiceToks]).map(t=>{ const btn=el('button',''); const o=el('div','obj',t); o.style.fontSize='clamp(40px,8vw,72px)'; btn.appendChild(o);
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
/* auto-update: when a new service worker takes over, reload once so the newest
   version shows without the user having to remove/re-add the app */
if('serviceWorker' in navigator){
  const hadController = !!navigator.serviceWorker.controller;
  let reloaded=false;
  navigator.serviceWorker.addEventListener('controllerchange', ()=>{ if(reloaded||!hadController) return;
    if(inGame){ pendingReload=true; } else { reloaded=true; location.reload(); } });
  window.addEventListener('load', ()=> navigator.serviceWorker.register('sw.js').then(reg=>{ reg.update(); setInterval(()=>reg.update(), 60000); }).catch(()=>{}));
}
