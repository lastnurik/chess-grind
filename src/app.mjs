import { Chess } from '../vendor/chess.js';
import { TrainingSession, describeMove } from './training.mjs';
import { buildCourses } from './courses.mjs';
import { boardHtml, bindBoard, escapeHtml as esc, pieceNames } from './board.mjs';

const app = document.querySelector('#app');
const overlay = document.querySelector('#overlay');
const defaults = {theme:'Default',sound:false,notes:'Auto',arrows:'Off',evaluation:true,textSize:'Default',skipShared:false,confetti:true};
let settings = {...defaults};
try { settings = {...defaults,...JSON.parse(localStorage.getItem('chess-grind-settings')||'{}')}; } catch { /* Defaults preserve usability when storage is unavailable. */ }
let courses = [], openings = [], course = null, session = null, selected = '', flipped = false, reviewPly = null, opponentTimer = null;
let page='catalog', category='all', query='', color='', modal=null, depthChoice='Essentials', modalSearch='', lastFocus=null;
let completed = {}, depths = {}, completionRecorded=false, toastTimer;
const modes = {Learn:['e1078b01ad580f01','discover new lines'],Practice:['48e8447082266cf3','perfect your lines'],Drill:['552f6a801c7c4fe7','build your muscle memory'],Time:['3a66737523485508','race against the clock'],Puzzles:['22c2ed67c1c2f1a5','find the tactical finish'],Arena:['1c3e98321717864b','put your opening to the test']};
const icons = {
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',filter:'<path d="M4 6h16M7 12h10M10 18h4"/>',down:'<path d="m7 10 5 5 5-5"/>',left:'<path d="m15 18-6-6 6-6"/>',right:'<path d="m9 18 6-6-6-6"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',settings:'<path d="m9 3-1 3-3 1-2 3 2 2-1 3 3 3 3-1 2 2 3-1 1-3 3-1 1-3-2-2 1-3-3-3-3 1-2-2Z"/><circle cx="12" cy="12" r="3"/>',bulb:'<path d="M9 18h6M10 22h4M9 14c0-2-3-3-3-6a6 6 0 0 1 12 0c0 3-3 4-3 6"/>',game:'<path d="M7 5h10c4 0 5 12 3 14s-5-3-6-3h-4c-1 0-4 5-6 3S3 5 7 5Z"/><path d="M6 10h4M8 8v4M16 9h.01M18 12h.01"/>',flip:'<path d="M4 7h14l-4-4M20 17H6l4 4M4 7v5M20 17v-5"/>',book:'<path d="M12 6c-3-3-7-2-10-1v15c4-2 7-2 10 0 3-2 6-2 10 0V5c-3-1-7-2-10 1Zm0 0v14"/>',plus:'<path d="M12 5v14M5 12h14"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',upload:'<path d="M12 16V4m-5 5 5-5 5 5M4 16v5h16v-5"/>',chart:'<path d="M4 4v16h16M8 16v-4M13 16V8M18 16V5"/>',trophy:'<path d="M8 3h8v8a4 4 0 0 1-8 0ZM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4M12 15v5M8 21h8"/>',menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',check:'<path d="m5 12 4 4L19 6"/>'
};
const icon = (name, cls='')=>`<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.book}</svg>`;
const modeIcon = name=>`<img class="mode-icon" src="./assets/${modes[name][0]}.avif" alt="">`;

function toast(text) {
  const el=document.querySelector('#toast'); el.textContent=text; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),3500);
}
function saveSettings() {
  try {localStorage.setItem('chess-grind-settings',JSON.stringify(settings));}
  catch {toast('Could not save preferences. Browser storage may be full or disabled.');}
}
function setTheme() {
  const themes = {Default:['#eedbb4','#c3a074'],Lichess:['#f0d9b5','#b58863'],Green:['#ebecd0','#779556'],Blue:['#dee3e6','#8ca2ad'],'Dark Blue':['#b9c8d4','#56758a']};
  const colors=themes[settings.theme]||themes.Default;
  document.documentElement.style.setProperty('--light-square',colors[0]);
  document.documentElement.style.setProperty('--dark-square',colors[1]);
  document.documentElement.style.setProperty('--coach-size',settings.textSize==='Extra large'?'22px':settings.textSize==='Large'?'19px':'16px');
}
function header() {
  return `<header class="site-header"><a class="brand" href="#/" aria-label="Chess Grind home"><img src="./assets/icon.svg" alt=""><span>chess grind</span></a><nav class="header-nav" aria-label="Main navigation"><a class="${page==='catalog'&&category!=='strategy'?'active':''}" href="#/">Openings</a><a class="${category==='strategy'?'active':''}" href="#/strategies">Strategies</a><button data-action="analysis">Analysis board</button></nav><div class="header-actions"><button class="secondary small" data-action="progress">${icon('chart')}<span>Your progress</span></button><span class="badge local-badge">Local</span><button class="streak" data-action="progress" aria-label="Training progress">${icon('trophy')}<span>${Object.keys(completed).length}</span></button><button class="icon-button mobile-menu" data-action="navigation" aria-label="Navigation menu">${icon('menu')}</button></div></header>`;
}
function coursePreview(c) {
  const game=new Chess(c.lines[0].fen);
  c.lines[0].moves.slice(0,c.previewPly||6).forEach(m=>game.move(m));
  return boardHtml(game.fen(),{flipped:c.side==='b',miniature:true});
}
function visibleCourses() {
  return courses.filter(c=>(category==='all'||c.category===category||(category==='custom'&&c.custom))&&(!color||c.side===color)&&(!query||`${c.title} ${c.description} ${c.lines.map(l=>`${l.title} ${l.moves.join(' ')}`).join(' ')}`.toLowerCase().includes(query.toLowerCase().replace(/\d+\.+\s*/g,'').trim())));
}
function catalog() {
  document.title='Chess Grind — Learn your openings';
  const title=category==='strategy'?'Understand the Position.<br>Find the Right Plan.':category==='custom'?'Your Courses.<br>Your Repertoire.':'Chess Opening Courses<br>Built for Your Next Game';
  const subtitle=category==='strategy'?'Train the ideas that turn an opening into a middlegame.':category==='custom'?'Import, create, and train the lines you want to play.':'Train your openings until the right move is automatic.';
  app.innerHTML=`${header()}<main class="catalog"><section class="hero"><h1>${title}</h1><p>${subtitle}</p></section><div class="catalog-actions"><button class="secondary" data-action="creator">${icon('plus')} Create a Course</button><button class="secondary" data-action="mycourses">🌐 My Courses ${icon('right')}</button></div><div class="search-row"><button class="filter-button ${color?'active':''}" data-action="filters" aria-label="Filters">${icon('filter')}</button><div class="searchbox">${icon('search','search-icon')}<input id="course-search" placeholder="Search openings…" aria-label="Search openings" value="${esc(query)}" autocomplete="off"><button class="position-search" data-action="searchmoves" aria-label="Search by moves" title="Search by moves">▦</button></div></div><div id="course-results">${courseList()}</div><footer class="site-footer"><div><a class="brand" href="#/"><img src="./assets/icon.svg" alt=""><span>chess grind</span></a><p>Your repertoire. Your rhythm. Every line, always free.</p></div><div><button data-action="sources">Theory & sources</button><button data-action="progress">Your progress</button><button data-action="backup">Backup & restore</button></div><p class="small muted">Private local trainer · No account needed</p></footer></main>`;
  document.querySelector('#course-search').addEventListener('input',e=>{query=e.target.value;document.querySelector('#course-results').innerHTML=courseList();});
}
function courseList() {
  const list=visibleCourses();
  if(!list.length) return `<div class="empty-state"><h3>No courses found</h3><p>Try another opening name, or create your own course.</p><button class="secondary" data-action="clearfilters">Clear filters</button></div>`;
  return `<div class="course-list">${list.map(c=>{const done=c.lines.filter(l=>completed[`${c.id}:${l.id}`]).length;return `<a class="course-card" href="#/opening/${esc(c.id)}"><div class="preview">${coursePreview(c)}</div><div class="course-body"><h3>${esc(c.title)}</h3><p>${esc(c.description||c.intro)}</p><div class="course-meta"><span class="side-dot ${c.side==='w'?'white':'black'}"></span><span>${c.side==='w'?'White':'Black'} repertoire</span><span class="badge">${c.category==='strategy'?'Strategy':c.custom?'Your course':'Opening theory'}</span></div><div class="course-bottom"><span>${done?`${done} / `:''}${c.lines.length} lines total</span><strong>${done?'Continue learning':'Start learning'} ${icon('right')}</strong></div><div class="course-progress"><span style="width:${done/c.lines.length*100}%"></span></div></div></a>`}).join('')}</div>`;
}
function activeLines() {
  if(!course) return [];
  const depth=depths[course.id]||'Essentials';
  return course.lines.slice(0,depth==='Essentials'?10:depth==='Advanced'?30:course.lines.length);
}
function startLine(index=0, mode='Learn', startPly=0) {
  clearTimeout(opponentTimer);
  selected=''; reviewPly=null; completionRecorded=false;
  session=new TrainingSession(course,{lineIndex:index,mode,startPly});
  renderTrainer(); scheduleOpponent();
}
function enterCourse(id) {
  clearTimeout(opponentTimer);
  course=courses.find(c=>c.id===id);
  if(!course) {location.hash='#/';return;}
  page='trainer'; flipped=course.side==='b';
  const first=activeLines().findIndex(l=>!completed[`${course.id}:${l.id}`]);
  startLine(Math.max(0,first));
  if(!depths[course.id]) {depthChoice='Essentials';openModal('depth');}
}
function currentView() {
  const s=session.snapshot();
  if(reviewPly===null) return s;
  const game=new Chess(s.line.fen);
  s.line.moves.slice(0,reviewPly).forEach(m=>game.move(m));
  return {...s,fen:game.fen(),ply:reviewPly,history:game.history({verbose:true})};
}
function coachNote(s) {
  if(s.status==='complete') return `<strong>Line complete. Nicely done!</strong><p>You’ve reached the end of ${esc(s.line.title)}.</p><button class="primary purple" data-action="completion">See your results ${icon('right')}</button>`;
  if(reviewPly!==null) return `<strong>Reviewing move ${Math.ceil(reviewPly/2)}</strong><p>Use the arrows to explore what you played.</p><button class="secondary" data-action="returnlive">Return to training</button>`;
  if(s.turn!==s.side) return '<p>Okay, your opponent’s turn.</p>';
  const expected=s.expected;
  if(!expected) return '';
  let note=s.line.notes?.[s.ply];
  if(s.ply===0) note=`${course.intro}\n\n${course.plans?.slice(0,2).join('\n\n')||''}${note?`\n\n${note}`:''}`;
  if(!note) {
    if(expected.san.startsWith('O-O')) note='Bring your king to safety and connect your rooks. After castling, look for the right central pawn break.';
    else if(expected.san.includes('x')) note='Resolve the tension. Before exchanging, check which files and diagonals will open and which piece can recapture.';
    else if(expected.piece==='n'||expected.piece==='b') note='Improve a minor piece and increase your control of the center. Keep the next pawn break in mind as you develop.';
    else note=course.plans?.[Math.floor(s.ply/2)%course.plans.length]||'Coordinate your pieces and follow the plan for this position.';
  }
  const showNotes=settings.notes!=='On tap'||s.mistakes>0||s.hintLevel>0;
  return `${showNotes?esc(note).split('\n\n').map(p=>`<p>${p.replace(/\n/g,'<br>')}</p>`).join(''):''}<strong>${esc(describeMove(expected))}</strong><div class="coach-links"><button data-action="plans">Plans & ideas</button><span>·</span><button data-action="lineinfo">${esc(s.line.title)}</button></div>`;
}
function modeCards(s) {
  const count=activeLines().length, done=activeLines().filter(l=>completed[`${course.id}:${l.id}`]).length;
  return `<div class="mode-cards"><button class="mode-card primary purple" data-mode="Learn">${modeIcon('Learn')}<span><span class="mode-title">Learn</span><span class="mode-description">discover new lines</span></span><span class="mode-count"><b>${done}/${count}</b><small>discovered</small></span></button><button class="mode-card secondary" data-mode="Practice" disabled>${modeIcon('Practice')}<span><span class="mode-title">Practice</span><span class="mode-description">perfect your lines</span></span><span class="mode-count small">Coming next</span></button><div class="mode-grid">${['Drill','Time','Puzzles','Arena'].map(name=>`<button class="mode-card secondary" data-mode="${name}" disabled>${modeIcon(name)}<span class="mode-title">${name}</span><span class="muted">•••</span></button>`).join('')}</div></div>`;
}
function renderTrainer() {
  if(!session) return;
  const s=currentView(), actual=session.snapshot();
  document.title=`${course.title} · Chess Grind`;
  const hint=actual.expected&&(actual.hintLevel>0||settings.arrows!=='Off')?{from:actual.expected.from,...(actual.hintLevel>1||settings.arrows!=='Off'?{to:actual.expected.to}:{})}:null;
  app.innerHTML=`${header()}<div class="session-progress" aria-label="Line progress" role="progressbar" aria-valuemin="0" aria-valuemax="${s.line.moves.length}" aria-valuenow="${actual.ply}"><span class="session-progress-fill" style="width:${actual.ply/s.line.moves.length*100}%"></span></div><main class="trainer"><section class="board-column"><div class="board-wrap">${settings.evaluation?'<div class="evaluation" aria-label="Engine evaluation unavailable until enabled"><div class="eval-white" style="height:50%"></div><span class="eval-score">—</span></div>':''}<div class="board-mount" id="board-mount">${boardHtml(s.fen,{flipped,selected,lastMove:s.history.at(-1),hint:reviewPly===null?hint:null,interactive:true})}</div></div><div class="board-caption"><span>${reviewPly===null?`${s.side==='w'?'White':'Black'} repertoire · ${esc(s.line.title)}`:'Reviewing position'}</span><button data-action="flip" title="Flip board (F)" aria-label="Flip board">${icon('flip')}</button></div></section><aside class="trainer-panel"><div class="trainer-heading"><button class="mode-selector" data-action="modes">${modeIcon(actual.mode||'Learn')} <span>${esc(actual.mode||'Learn')}</span></button><button class="course-selector" data-action="courses">${esc(course.title)}</button><button class="line-selector" data-action="lines">#${actual.lineIndex+1} ${icon('down')}</button></div><div class="coach"><div class="coach-avatar"><img src="./assets/icon.svg" alt="Coach"></div><div class="coach-bubble" aria-live="polite">${coachNote(s)}</div></div>${actual.feedback?`<div class="feedback ${actual.feedback==='Correct!'?'success':'error'}" role="status">${esc(actual.feedback)}</div>`:''}${actual.ply===0?modeCards(actual):''}<div class="panel-spacer"></div><div class="trainer-controls"><button class="control-button icon-button" data-action="settings" aria-label="Settings" title="Settings">${icon('settings')}</button><button class="control-button" data-action="modes">${icon('game')}<span>Mode</span></button><button class="control-button" data-action="hint" aria-label="${actual.hintLevel>1?'Solve':actual.hintLevel===1?'Show move':'Show hint'}" ${actual.status==='complete'||reviewPly!==null?'disabled':''}>${icon('bulb')}<span>${actual.hintLevel>1?'Solve':actual.hintLevel===1?'Show move':'Hint'}</span></button><div class="nav-controls"><button class="control-button icon-button" data-action="previous" aria-label="Previous move" ${s.ply===0?'disabled':''}>${icon('left')}</button><button class="control-button icon-button" data-action="next" aria-label="Next move" ${reviewPly===null?'disabled':''}>${icon('right')}</button></div></div></aside></main>`;
  bindBoard(document.querySelector('#board-mount'),{getGame:()=>new Chess(currentView().fen),onSelect:selectSquare,onMove:makeMove});
}
function selectSquare(square) {
  const s=session.snapshot();
  if(reviewPly!==null||s.status==='complete'||s.turn!==s.side||modal) return;
  const game=new Chess(s.fen), piece=game.get(square);
  if(selected&&square!==selected&&game.moves({square:selected,verbose:true}).some(m=>m.to===square)) return makeMove(selected,square);
  selected=piece?.color===s.side?(selected===square?'':square):'';
  renderTrainer();
}
function makeMove(from,to,promotion=null) {
  const s=session.snapshot();
  if(reviewPly!==null||s.status==='complete'||s.turn!==s.side||modal) return;
  const game=new Chess(s.fen), piece=game.get(from);
  if(piece?.type==='p'&&(to[1]==='8'||to[1]==='1')&&!promotion) {openModal('promotion',{from,to});return;}
  const before=s.ply;
  const result=session.play(from,to,promotion||'q'); selected='';
  if(result.ply>before) playSound();
  renderTrainer(); finishIfComplete(); scheduleOpponent();
}
function scheduleOpponent() {
  clearTimeout(opponentTimer);
  const current=session, s=current.snapshot();
  if(s.status==='complete'||s.turn===s.side) return;
  opponentTimer=setTimeout(()=>{if(session!==current||page!=='trainer')return;session.advanceOpponent();playSound();renderTrainer();finishIfComplete();},420);
}
function finishIfComplete() {
  const s=session.snapshot();
  if(s.status!=='complete'||completionRecorded) return;
  completionRecorded=true;completed[`${course.id}:${s.line.id}`]={mistakes:s.mistakes,hints:s.hints,at:Date.now()};
  const finishedSession=session;
  setTimeout(()=>{if(page==='trainer'&&session===finishedSession&&session.snapshot().status==='complete')openModal('completion');},250);
}
let audio;
function playSound() {
  if(!settings.sound) return;
  try {audio||=new AudioContext(); const osc=audio.createOscillator(),gain=audio.createGain();osc.connect(gain);gain.connect(audio.destination);osc.frequency.value=420;gain.gain.setValueAtTime(.045,audio.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+.08);osc.start();osc.stop(audio.currentTime+.08);} catch {/* Sound is optional. */}
}
function openModal(type,data=null) {lastFocus=document.activeElement;modal={type,data};modalSearch='';renderModal();}
function closeModal() {modal=null;overlay.innerHTML='';lastFocus?.focus?.();}
function modalShell(title,body,cls='',footer='') {
  return `<div class="modal-backdrop"><section class="modal ${cls}" role="dialog" aria-modal="true" aria-label="${esc(title)}" tabindex="-1"><header class="modal-header"><h2>${esc(title)}</h2><button class="close-modal icon-button" data-action="close" aria-label="Close">${icon('close')}</button></header>${body}${footer?`<footer class="modal-footer">${footer}</footer>`:''}</section></div>`;
}
function depthOptions() {
  const total=course.lines.length;
  return `<div class="depth-options">${[['Essentials','3e739f7f0364d1ba','Most players start here',Math.min(10,total)],['Advanced','3e237cc9a2d6d02c','Explore more responses',Math.min(30,total)],['Full Mastery','c32de7d3f42da928','Know every branch',total]].map(([name,img,copy,count])=>`<button class="depth-option ${depthChoice===name?'active':''}" data-depth="${name}" role="radio" aria-checked="${depthChoice===name}"><img class="depth-icon" src="./assets/${img}.avif" alt=""><span class="depth-copy"><strong>${name}</strong><small>${copy}</small></span><span class="depth-count"><b>${count}</b><small>lines</small></span></button>`).join('')}</div>`;
}
function lineList() {
  return `<div class="line-list">${activeLines().map((l,i)=>({l,i})).filter(({l})=>`${l.title} ${l.moves.join(' ')}`.toLowerCase().includes(modalSearch.toLowerCase())).map(({l,i})=>`<button class="line-option ${session.snapshot().lineIndex===i?'active':''}" data-line="${i}"><span class="line-number">${i+1}</span><span class="line-text"><strong>${esc(l.title)}</strong><small>${esc(formatMoves(l.moves))}</small></span><span class="line-status">${completed[`${course.id}:${l.id}`]?'✓':'›'}</span></button>`).join('')}</div>`;
}
function formatMoves(moves) {return moves.map((m,i)=>`${i%2===0?`${Math.floor(i/2)+1}. `:''}${m}`).join(' ');}
function renderSettings() {
  const segmented=(key,values)=>`<div class="segmented">${values.map(v=>`<button class="${settings[key]===v?'active':''}" data-setting="${key}" data-value="${v}">${v}</button>`).join('')}</div>`;
  const toggle=(key,label,description='')=>`<label class="setting-label"><span><strong>${label}</strong>${description?`<small>${description}</small>`:''}</span><input type="checkbox" role="switch" data-toggle="${key}" ${settings[key]?'checked':''}></label>`;
  return `<div class="settings-section"><h3>Help <small>Every course</small></h3><label class="field">Coach notes${segmented('notes',['Auto','Every move','On tap'])}</label><p class="small muted">Auto explains new positions and mistakes. On tap keeps notes hidden until you ask for a hint.</p><label class="field">Arrows${segmented('arrows',['Off','With notes','Always'])}</label>${toggle('evaluation','Evaluation bar','Shows the local engine’s evaluation when available')}</div><div class="settings-section"><h3>Looks <small>Every course</small></h3><label class="field">Board${segmented('theme',['Default','Lichess','Green','Blue','Dark Blue'])}</label><label class="field">Coach text size${segmented('textSize',['Default','Large','Extra large'])}</label></div><div class="settings-section"><h3>This course <small>${esc(course.title)}</small></h3><button class="secondary row" data-action="depth">Training depth <b>${depths[course.id]||'Essentials'}</b> ${icon('right')}</button></div><div class="settings-section"><h3>Sound and feel</h3>${toggle('sound','Sound on','A soft click for every move')}</div><div class="settings-section"><h3>Share this position</h3><div class="row"><button class="secondary" data-action="copypgn">Copy PGN</button><button class="secondary" data-action="copyfen">Copy FEN</button><button class="secondary" data-action="exportpgn">Download PGN</button></div></div><div class="settings-section"><h3>Start over</h3><button class="danger" data-action="resetcourse">Reset course progress</button></div>`;
}
function renderModal() {
  if(!modal) {overlay.innerHTML='';return;}
  const {type,data}=modal;
  let html='';
  if(type==='depth') html=modalShell('How deep do you want to go?',`<p class="muted depth-subtitle">${esc(course.title)} · ${course.lines.length} lines</p>${depthOptions()}`,'depth-modal',`<button class="primary purple" data-action="startdepth">🌱 Start with ${depthChoice} ${icon('right')}</button><p class="small muted">You can change this anytime</p>`);
  if(type==='lines') html=modalShell('Select a line',`<input class="modal-search" id="line-search" aria-label="Search lines" placeholder="Search lines or moves…"><div id="line-results">${lineList()}</div>`, 'wide-modal', `<button class="secondary" data-action="depth">Training depth: ${depths[course.id]||'Essentials'} ${icon('down')}</button>`);
  if(type==='courses') html=modalShell('Choose a course',`<div class="line-list">${courses.map(c=>`<a class="line-option" href="#/opening/${esc(c.id)}"><span class="side-dot ${c.side==='w'?'white':'black'}"></span><span class="line-text"><strong>${esc(c.title)}</strong><small>${c.lines.length} lines · ${c.side==='w'?'White':'Black'}</small></span>${icon('right')}</a>`).join('')}</div>`);
  if(type==='settings') html=modalShell('Settings',renderSettings(),'settings-modal');
  if(type==='modes') html=modalShell('Choose a training mode',`<div class="mode-menu">${Object.entries(modes).map(([name,[,desc]])=>`<button class="line-option" data-mode="${name}" ${name!=='Learn'?'disabled':''}>${modeIcon(name)}<span class="line-text"><strong>${name}</strong><small>${desc}</small></span>${name==='Learn'?'✓':'Coming next'}</button>`).join('')}</div>`);
  if(type==='plans') html=modalShell('Plans & ideas',`<p class="muted">${esc(course.title)}</p><div class="stack"><p>${esc(course.intro)}</p>${course.plans.map((p,i)=>`<div class="plan"><h3>${i+1}. The plan</h3><p>${esc(p)}</p></div>`).join('')}<button class="secondary" data-action="sources">Theory & sources ${icon('right')}</button></div>`);
  if(type==='lineinfo') {const s=session.snapshot();html=modalShell(s.line.title,`<p class="muted">${esc(course.title)} · Line ${s.lineIndex+1}</p><p class="pgn-text">${esc(formatMoves(s.line.moves))}</p><p>${esc(course.plans[0]||'')}</p><button class="secondary" data-action="restart">Restart this line</button>`);}
  if(type==='completion') {const s=session.snapshot();html=modalShell('Line complete!',`<div class="completion"><div class="completion-icon">${s.mistakes===0&&s.hints===0?'🏆':'✨'}</div><h3>${esc(s.line.title)}</h3><p class="muted">${s.mistakes===0&&s.hints===0?'Perfect recall. Keep it going.':'Every repetition makes the next one easier.'}</p><div class="result-grid"><div><b class="result-number">${Math.ceil(s.line.moves.length/2)}</b><span>moves</span></div><div><b class="result-number">${s.mistakes}</b><span>mistakes</span></div><div><b class="result-number">${s.hints}</b><span>hints</span></div></div></div>`,'completion-modal',`<button class="primary purple" data-action="nextline">Learn next line ${icon('right')}</button><button class="secondary" data-action="restart">Repeat this line</button>`);}
  if(type==='filters') html=modalShell('Filters',`<label class="field">Color<div class="segmented">${[['','All'],['w','White'],['b','Black']].map(([v,l])=>`<button class="${color===v?'active':''}" data-color="${v}">${l}</button>`).join('')}</div></label>`);
  if(type==='searchmoves') html=modalShell('Search by moves',`<p class="muted">Enter a move sequence in standard notation.</p><input id="moves-query" aria-label="Opening moves" placeholder="1. e4 e5 2. Nf3 Nc6" value="${esc(query)}"><button class="primary purple" data-action="applymoves">Search openings ${icon('search')}</button>`);
  if(type==='promotion') html=modalShell('Promote your pawn',`<div class="row promotion-options">${['q','r','b','n'].map(p=>`<button class="secondary" data-promote="${p}" aria-label="Promote to ${pieceNames[p]}"><svg viewBox="0 0 40 40"><use href="./assets/pieces.svg#${session.snapshot().side}${p}"/></svg></button>`).join('')}</div>`);
  if(type==='progress') html=modalShell('Your progress',`<div class="result-grid"><div><b class="result-number">${Object.keys(completed).length}</b><span>lines learned</span></div><div><b class="result-number">${new Set(Object.keys(completed).map(k=>k.split(':')[0])).size}</b><span>courses started</span></div></div><p class="muted">Your training stays on this device. Persistent spaced review and backups are the next development ticket.</p><button class="primary purple" data-action="close">Back to training</button>`);
  if(type==='navigation') html=modalShell('Chess Grind',`<div class="line-list"><a class="line-option" href="#/">Openings ${icon('right')}</a><a class="line-option" href="#/strategies">Strategies ${icon('right')}</a><button class="line-option" data-action="analysis">Analysis board ${icon('right')}</button><button class="line-option" data-action="mycourses">My courses ${icon('right')}</button></div>`);
  if(type==='sources') html=modalShell('Theory & sources',`<div class="stack"><p>Opening names and factual move sequences come from the public-domain <a href="https://github.com/lichess-org/chess-openings" target="_blank" rel="noreferrer">Lichess opening database</a>. This copy contains ${openings.length.toLocaleString()} entries.</p><p>Coach notes and exercises are written for Chess Grind. They are not copied grandmaster annotations or a reproduction of paid courses.</p><h3>Literature for further study</h3><p><b>Paul van der Sterren · Fundamental Chess Openings</b><br>A reference for opening families and their ideas. Listed as further reading; full text was not accessed.</p><p><a href="https://www.newinchess.com/mastering-opening-strategy" target="_blank" rel="noreferrer">Johan Hellsten · Mastering Opening Strategy</a><br>Development, the center, pawn breaks and practical opening play.</p><p><a href="https://www.qualitychess.co.uk/ebooks/Flores_Rios_Chess_Structures-excerpt.pdf" target="_blank" rel="noreferrer">Mauricio Flores Rios · Chess Structures</a><br>Structure-based plans and transitions to the middlegame.</p><p class="small muted">ChessReps inspired the visible training interface. Chess Grind is a private local project. Reference flows behind trial restrictions have not been verified for exact parity.</p></div>`,'wide-modal');
  if(type==='coming') html=modalShell(data.title,`<p>${esc(data.message)}</p><button class="primary purple" data-action="close">Got it</button>`);
  if(type==='confirmreset') html=modalShell('Reset this course?',`<p>This will clear the learned-line records for ${esc(course.title)} on this device.</p><div class="row"><button class="danger" data-action="confirmreset">Reset progress</button><button class="secondary" data-action="close">Keep progress</button></div>`);
  overlay.innerHTML=html;
  overlay.querySelector('[role="dialog"]')?.focus();
  overlay.querySelector('#line-search')?.addEventListener('input',e=>{modalSearch=e.target.value;document.querySelector('#line-results').innerHTML=lineList();});
}
async function copyText(text) {try {await navigator.clipboard.writeText(text);toast('Copied to clipboard');} catch {openModal('coming',{title:'Copy this text',message:text});}}
function download(filename,text,type='text/plain') {const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
function currentPgn() {const s=session.snapshot(),g=new Chess(s.line.fen);s.line.moves.slice(0,s.ply).forEach(m=>g.move(m));g.setHeader('Event','Chess Grind — '+course.title);return g.pgn();}
function action(name) {
  if(name==='close') return closeModal();
  if(name==='navigation'||name==='sources'||name==='progress'||name==='searchmoves'||name==='filters') return openModal(name);
  if(name==='clearfilters') {query='';color='';catalog();return;}
  if(name==='mycourses') {location.hash='#/my-courses';return;}
  if(name==='creator'||name==='backup'||name==='analysis') return openModal('coming',{title:name==='analysis'?'Local engine':name==='creator'?'Create a course':'Backup & restore',message:'This feature is being built in the next ticket. The core trainer is ready to use.'});
  if(name==='applymoves') {query=document.querySelector('#moves-query').value;closeModal();catalog();return;}
  if(name==='startdepth') {depths[course.id]=depthChoice;closeModal();startLine(0);return;}
  if(!session) return;
  const s=session.snapshot();
  if(['settings','modes','lines','courses','plans','lineinfo','completion'].includes(name)) return openModal(name);
  if(name==='depth') {depthChoice=depths[course.id]||'Essentials';openModal('depth');return;}
  if(name==='hint') {if(s.hintLevel>1) {session.solve();renderTrainer();finishIfComplete();scheduleOpponent();} else {session.hint();renderTrainer();}return;}
  if(name==='flip') {flipped=!flipped;renderTrainer();return;}
  if(name==='previous') {reviewPly=Math.max(0,(reviewPly??s.ply)-1);selected='';renderTrainer();return;}
  if(name==='next') {reviewPly=(reviewPly??s.ply)+1;if(reviewPly>=s.ply)reviewPly=null;renderTrainer();return;}
  if(name==='returnlive') {reviewPly=null;renderTrainer();return;}
  if(name==='restart') {closeModal();startLine(s.lineIndex);return;}
  if(name==='nextline') {closeModal();startLine((s.lineIndex+1)%activeLines().length);return;}
  if(name==='copypgn') return copyText(currentPgn());
  if(name==='copyfen') return copyText(currentView().fen);
  if(name==='exportpgn') return download('chess-grind-line.pgn',currentPgn(),'application/x-chess-pgn');
  if(name==='resetcourse') return openModal('confirmreset');
  if(name==='confirmreset') {Object.keys(completed).filter(k=>k.startsWith(`${course.id}:`)).forEach(k=>delete completed[k]);closeModal();startLine(0);toast('Course progress reset');}
}
function onClick(e) {
  const depth=e.target.closest('[data-depth]');if(depth) {depthChoice=depth.dataset.depth;renderModal();return;}
  const line=e.target.closest('[data-line]');if(line) {closeModal();startLine(Number(line.dataset.line));return;}
  const setting=e.target.closest('[data-setting]');if(setting) {settings[setting.dataset.setting]=setting.dataset.value;saveSettings();setTheme();renderTrainer();renderModal();return;}
  const colorButton=e.target.closest('[data-color]');if(colorButton) {color=colorButton.dataset.color;closeModal();catalog();return;}
  const mode=e.target.closest('[data-mode]');if(mode&&!mode.disabled) {closeModal();startLine(session.snapshot().lineIndex,mode.dataset.mode);return;}
  const promotion=e.target.closest('[data-promote]');if(promotion){const {from,to}=modal.data;closeModal();makeMove(from,to,promotion.dataset.promote);return;}
  const button=e.target.closest('[data-action]');if(button&&!button.disabled)action(button.dataset.action);
  if(e.target.classList.contains('modal-backdrop'))closeModal();
}
app.addEventListener('click',onClick);overlay.addEventListener('click',onClick);
overlay.addEventListener('change',e=>{if(e.target.dataset.toggle){settings[e.target.dataset.toggle]=e.target.checked;saveSettings();renderTrainer();}});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&modal){closeModal();return;}
  if(modal&&e.key==='Tab') {const focusable=[...overlay.querySelectorAll('button:not([disabled]),a[href],input,textarea,select')];if(!focusable.length)return;const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&(document.activeElement===first||document.activeElement===overlay.querySelector('[role="dialog"]'))){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}return;}
  if(modal||e.target.matches('input,textarea,select')||page!=='trainer')return;
  if(e.key==='ArrowLeft'){e.preventDefault();action('previous');}
  if(e.key==='ArrowRight'){e.preventDefault();action('next');}
  if(e.key.toLowerCase()==='f')action('flip');
  if(e.key.toLowerCase()==='h')action('hint');
});
function route() {
  closeModal();clearTimeout(opponentTimer);const path=location.hash.replace(/^#\/?/,'').split('/');
  if(path[0]==='opening'&&path[1])return enterCourse(decodeURIComponent(path[1]));
  page='catalog';category=path[0]==='strategies'?'strategy':path[0]==='my-courses'?'custom':'all';query='';catalog();
}
async function init() {
  try {const r=await fetch('./src/openings.json');if(!r.ok)throw Error('Opening database could not be loaded');openings=await r.json();courses=buildCourses(openings);setTheme();window.addEventListener('hashchange',route);route();}
  catch(error){app.innerHTML=`<main class="empty-state"><h1>Chess Grind could not start</h1><p>${esc(error.message)}</p><p>Start the local server with <code>python3 server.py</code>, then open its address.</p></main>`;console.error(error);}
}
init();
