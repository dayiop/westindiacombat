/* WEST INDIA KOMBAT — browser multiplayer via PeerJS WebRTC data channels.
   The host is authoritative. Peers exchange gameplay inputs and 20Hz snapshots.
   GitHub Pages hosts only the static files. PeerJS Cloud brokers WebRTC sessions. */
'use strict';

const network = {
  role: 'offline', kind: 'online-vs', peer: null, conn: null,
  room: '', remoteInput: {}, lastRemoteAt: 0, online: false,
  snapshotTick: 0, inputTick: 0, latency: 0, lastSeq: -1, seq: 0,
  bossIndex: -1, coopWin: false, choice: 0, uiBusy: false
};
const INPUT_FIELDS = ['left','right','jump','block','punch','kick','special','heavy','grab','parry','dash','uppercut','sweep'];
const PLAYER_FIELDS = ['index','x','elev','vy','dir','hp','energy','block','stun','action','actionT','actionLen','hasHit','cooldown','move','anim','combo','lastHit','blink','superGlow','dead','hitFlash','parryWindow','dashT','dashCooldown','invuln','finisherPose','comboChain','crouch'];
const safeIndex = n => Math.max(0, Math.min(fighters.length-1, Number.isInteger(n)?n:0));
const netActive = () => network.online && network.conn && network.conn.open;
const netHost = () => netActive() && network.role === 'host';
const netGuest = () => netActive() && network.role === 'guest';
const netCoop = () => netHost() && runMode === 'online-coop';
function statusNet(s, bad=false){ $('onlineStatus').textContent=s; $('onlineStatus').style.color=bad?'#ff817b':'#ffe0a2'; }
function sendNet(obj){ if(!netActive())return; try {network.conn.send(obj)} catch (e){statusNet('Ошибка передачи данных: '+e.message,true)} }
function urlRoom(room){const u=new URL(window.location.href);u.searchParams.set('room',room);u.hash='';return u.toString()}
function showOnlinePanel(){ $('onlineModal').classList.remove('hidden'); $('joinCode').value ||= new URL(window.location.href).searchParams.get('room') || ''; }
function hideOnlinePanel(){ $('onlineModal').classList.add('hidden'); }
function setOnlineButtons(){
  $('createRoomBtn').disabled=network.role!=='offline';
  $('joinRoomBtn').disabled=network.role!=='offline';
  $('goOnlineBtn').disabled=!(netHost() && !['fight','intro','finisher'].includes(gameMode));
  $('goOnlineBtn').textContent=netCoop() || network.kind==='online-coop'?'⚔ НАЧАТЬ СОВМЕСТНЫЙ БОЙ':'⚔ НАЧАТЬ СЕТЕВОЙ БОЙ';
  $('roomLink').readOnly=true;
}
function resetNet(msg='Комната закрыта.'){
  network.online=false; network.role='offline';network.remoteInput={};network.room='';network.lastSeq=-1;network.seq=0;
  try{network.conn?.close()}catch{} try{network.peer?.destroy()}catch{}
  network.conn=null;network.peer=null;
  $('roomLink').value='';$('onlineRoomCode').textContent='—';
  statusNet(msg); setOnlineButtons();
  if(['online-vs','online-coop'].includes(runMode) && gameMode!=='select'){
    gameMode='paused';show('pauseScreen',true);show('announcement',false);
    $('pauseScreen').querySelector('p').textContent='Соединение потеряно. Вернитесь в меню, чтобы начать заново.';
  }
}
function cloudPeerError(err){ statusNet('Сервис связи: '+(err?.message||'не удалось установить соединение'),true);if(!netActive()) resetNet('Не удалось подключиться. Попробуй ещё раз.'); }
function makePeer(){if(typeof Peer!=='function'){statusNet('PeerJS не загрузился: нужен интернет и доступ к unpkg.com.',true);return null}
  const peer=new Peer(undefined,{debug:0,config:{iceServers:[{urls:'stun:stun.l.google.com:19302'},{urls:'stun:stun1.l.google.com:19302'}]}});
  peer.on('error',cloudPeerError);return peer;
}
function normalizeInput(obj){let out={};for(const k of INPUT_FIELDS)out[k]=obj?.[k]===true;return out}
function broadcastLobby(){if(!netHost())return;sendNet({type:'lobby',kind:network.kind,host:selected[0],guest:selected[1],status:'waiting'})}
function sendFighterSelection(){if(netGuest()){network.choice=selected[0];sendNet({type:'fighter',index:network.choice})}else if(netHost())broadcastLobby()}
function bindConnection(conn){
  network.conn=conn;let opened=false;
  conn.on('open',()=>{
    opened=true; network.online=true;network.lastRemoteAt=Date.now();
    if(network.role==='host'){
      statusNet('Друг подключился! Выбери своего бойца и начинай бой.');
      $('roomLink').value=urlRoom(network.room);broadcastLobby();
    } else {
      statusNet('Подключено! Ты — ИГРОК 2. Выбери персонажа, затем жди хозяина.');
      sendNet({type:'hello',fighter:network.choice});
    }
    setOnlineButtons();
  });
  conn.on('data',onNetMessage);
  conn.on('error',(e)=>statusNet('Ошибка соединения: '+e.message,true));
  conn.on('close',()=>{
    if(network.conn!==conn)return;
    const hadConnection=opened;
    resetNet(hadConnection?'Друг отключился.':'Соединение не установлено.');
  });
}
function createRoom(){
  if(network.role!=='offline')return;
  network.kind=$('onlineKind').value;
  const peer=makePeer();if(!peer)return;
  network.peer=peer;network.role='host';network.online=false;
  statusNet('Создаю комнату...');setOnlineButtons();
  peer.on('open',(id)=>{
    network.room=id; $('onlineRoomCode').textContent=id;
    $('roomLink').value=urlRoom(id);
    statusNet('Комната создана. Скопируй приглашение и дождись друга.');
  });
  peer.on('connection',(conn)=>{
    if(network.conn && network.conn.open){conn.close();return}
    bindConnection(conn);
  });
}
function joinRoom(){
  if(network.role!=='offline')return;
  const room=$('joinCode').value.trim();
  if(!/^[A-Za-z0-9_-]{1,128}$/.test(room)){statusNet('Некорректный код комнаты.',true);return}
  const peer=makePeer();if(!peer)return;
  network.role='guest';network.peer=peer;network.room=room;network.online=false;network.choice=selected[0];network.lastSeq=-1;
  statusNet('Подключаюсь к хозяину...');setOnlineButtons();
  peer.on('open',()=>{const conn=peer.connect(room,{reliable:true,serialization:'json'});bindConnection(conn)});
}
function netBattleStart(){
  if(!netHost()){statusNet('Сначала дождись подключения друга.',true);return}
  $('matchMode').value=network.kind;
  originalNetStartGame();
  hideOnlinePanel();
  if(network.kind==='online-coop'){
    const taken=new Set([selected[0],selected[1]]);
    let bossIdx=fighters.findIndex((_,i)=>!taken.has(i) && i>=4);
    if(bossIdx<0)bossIdx=fighters.findIndex((_,i)=>!taken.has(i));
    network.bossIndex=Math.max(0,bossIdx);
    const boss=fighterObject(network.bossIndex,655,-1);
    boss.hp=265;boss.energy=100;boss.x=700;boss.stun=0;boss.cooldown=0;
    players[0].x=235;players[1].x=455;
    players.push(boss);
    $('bossMeter').classList.remove('hidden');
    $('bossName').textContent='БОСС · '+boss.f.name;
    announce('CO-OP BOSS FIGHT','ДВОЕ ПРОТИВ ОДНОГО',140);
  } else {$('bossMeter').classList.add('hidden')}
  updateRunHUD();
  snapshotNet(true);
}
const originalNetStartGame=startGame;
startGame = function(){
  if(netGuest()){statusNet('Бой запускает хозяин комнаты.');showOnlinePanel();return}
  const mode=$('matchMode').value;
  if(mode==='online-vs'||mode==='online-coop'){
    network.kind=mode;
    $('onlineKind').value=mode;
    if(netHost()){netBattleStart()} else {showOnlinePanel();statusNet('Сначала создай комнату или введи код друга.')}
    return;
  }
  $('bossMeter').classList.add('hidden');originalNetStartGame();
};
const originalCpu=gameIsCpu;
gameIsCpu=function(){if(['online-vs','online-coop'].includes(runMode))return false;return originalCpu()};
const originalControls=getControls;
getControls = function(i){if(netHost()&&i===1){
  if(Date.now()-network.lastRemoteAt>1000)return normalizeInput({});
  return network.remoteInput;
}return originalControls(i)};
const originalRunHUD=updateRunHUD;
updateRunHUD=function(){originalRunHUD();if(runMode==='online-vs'){$('modeLabel').textContent='🌐 ОНЛАЙН 1 НА 1';$('fightStatus').textContent='HOST + GUEST'}
else if(runMode==='online-coop'){$('modeLabel').textContent='🌐 КООПЕРАТИВ';$('fightStatus').textContent='ПОБЕДИТЕ БОССА'}};
const originalMenu=menu;
menu=function(){if(netGuest() && gameMode!=='select'){showOnlinePanel();statusNet('Матчем управляет хозяин. Чтобы выйти, нажми «Отключиться».');return}
 $('bossMeter').classList.add('hidden');originalMenu()};
const originalPause=togglePause;
togglePause=function(){if(netGuest())return;originalPause()};
const originalFinish=finishNow;
finishNow=function(){if(netGuest())return;originalFinish()};
const originalTrigger=triggerFinisher;
triggerFinisher=function(attacker,loser){
  if(!netCoop()){originalTrigger(attacker,loser);return}
  loser.dead=true;loser.hp=0;loser.finisherPose=1;
  spawnBlood(loser.x,GROUND-145,attacker.dir,35,1.4);
  if(loser===players[2])completeBossBattle(true);
  else if(players[0].dead&&players[1].dead)completeBossBattle(false);
  else {announce(loser.f.name+' В НОКАУТЕ','ВТОРОЙ ИГРОК, ДЕРЖИСЬ!',95)}
};
function completeBossBattle(win){
  if(gameMode==='result')return;
  network.coopWin=win;gameMode='result';
  show('resultScreen',true);show('announcement',false);
  $('resultTitle').textContent=win?'ПОБЕДА КОМАНДЫ!':'КОМАНДА ПРОИГРАЛА';
  $('resultSub').textContent=win?'Вы вместе одолели босса! Нажмите «Реванш» для новой битвы.':'Оба бойца потеряли здоровье. Попробуйте снова.';
  $('againBtn').textContent='⚔ ЕЩЁ РАЗ';
  $('bossMeter').classList.add('hidden');
}
const originalProjectiles=updateProjectiles;
updateProjectiles=function(dt){
  if(!netCoop())return originalProjectiles(dt);
  for(let i=projectiles.length-1;i>=0;i--){
    let q=projectiles[i];q.x+=q.vx*dt;q.life-=dt;q.phase+=dt*.18;
    let opponents=q.owner===players[2] ? players.slice(0,2):[players[2]];
    const target=opponents.filter(x=>!x.dead).find(x=>Math.abs(q.x-x.x)<52&&Math.abs(q.y-(GROUND-x.elev-145))<101);
    if(target){takeHit(q.owner,target,q.kind==='orb'?19:16,29,true);spawnSparks(q.x,q.y,q.color,20,1.1);q.life=0}
    if(q.life<=0||q.x<-50||q.x>W+50)projectiles.splice(i,1)
  }
};
const originalUpdate=update;
update=function(dt){
  if(netGuest()){worldTime+=dt; // Guest draws host snapshots; no independent damage calculation.
    if(gameMode==='select'||gameMode==='result'||gameMode==='paused')return;
    for(const p of players){if(p) p.anim+=dt*.04}
    for(let i=particles.length-1;i>=0;i--){let p=particles[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;if(p.life<0)particles.splice(i,1)}
    return;
  }
  if(!netCoop()){originalUpdate(dt);return}
  worldTime+=dt;updateEffects(dt);roundFrame+=dt;
  if(announce.life>0){} // updateEffects controls announcements.
  if(gameMode==='paused'||gameMode==='select'||gameMode==='result')return;
  if(hitStop>0){hitStop-=dt;return}
  if(gameMode==='intro'){
    intro-=dt;players.forEach(p=>p.anim+=dt*.05);
    if(intro<=0){gameMode='fight';show('announcement',false)}return
  }
  if(gameMode!=='fight')return;
  const boss=players[2],a=players[0],b=players[1];
  const nearest=[a,b].filter(p=>!p.dead).sort((x,y)=>Math.abs(x.x-boss.x)-Math.abs(y.x-boss.x))[0];
  if(!nearest){completeBossBattle(false);return}
  if(!a.dead) updateFighter(a,boss,getControls(0),dt);
  if(gameMode!=='fight')return;
  if(!b.dead) updateFighter(b,boss,getControls(1),dt);
  if(gameMode!=='fight')return;
  aiThink(boss,nearest,dt);
  updateFighter(boss,nearest,aiKeys,dt);
  if(gameMode!=='fight')return;
  updateProjectiles(dt);
  for(const p of [a,b]){if(p.dead)continue;let d=boss.x-p.x;if(Math.abs(d)<75){let change=(75-Math.abs(d))/2;p.x=clamp(p.x-Math.sign(d||1)*change,65,W-65);boss.x=clamp(boss.x+Math.sign(d||1)*change,65,W-65)}}
  timer=Math.max(0,timer-dt/60);
  if(timer<=0)completeBossBattle(false);
  $('bossFill').style.width=Math.max(0,boss.hp/265*100)+'%';
  updateHUD();
};

function snapshotPlayer(p){let out={};for(const key of PLAYER_FIELDS)out[key]=p[key];return out}
function buildSnapshot(){
  return {type:'state',seq:++network.seq,gameMode,runMode,selected:[...selected],players:players.map(snapshotPlayer),round,
    score:[...score],timer,arenaIndex,finisherWinner,finisherTime,finished,stage,
    projectiles:projectiles.slice(-12).map(q=>({x:q.x,y:q.y,vx:q.vx,size:q.size,life:q.life,color:q.color,accent:q.accent,kind:q.kind,phase:q.phase,owner:players.indexOf(q.owner)})),
    particles:particles.slice(-25),bloodDrops:bloodDrops.slice(-35),bloodPools:bloodPools.slice(-25),rings:rings.slice(-10),
    announcement:{hidden:$('announcement').classList.contains('hidden'),main:$('announcementMain').textContent,sub:$('announcementSub').textContent},
    results:{title:$('resultTitle').textContent,sub:$('resultSub').textContent},bossHp:players[2]?.hp??null,
    paused:gameMode==='paused',timestamp:Date.now()};
}
function snapshotNet(force=false){if(!netHost())return;if(!force&&['select'].includes(gameMode))return;sendNet(buildSnapshot())}
function applySnapshot(data){
  if(!netGuest()||!Array.isArray(data.players)||data.players.length<2||data.players.length>3)return;
  if(!Number.isSafeInteger(data.seq)||data.seq<=network.lastSeq)return;network.lastSeq=data.seq;
  gameMode=data.gameMode;runMode=data.runMode;
  if(Array.isArray(data.selected))selected=data.selected.map(safeIndex).slice(0,2);
  round=data.round;score=data.score||[0,0];timer=data.timer;arenaIndex=data.arenaIndex;
  finisherWinner=data.finisherWinner;finisherTime=data.finisherTime;finished=!!data.finished;
  players=data.players.map(p=>{
    let actor=fighterObject(safeIndex(p.index),Number(p.x)||0,Number(p.dir)||1);
    for(const key of PLAYER_FIELDS){if(Object.prototype.hasOwnProperty.call(p,key))actor[key]=p[key]}
    actor.index=safeIndex(p.index);actor.f=fighters[actor.index];return actor
  });
  projectiles=(Array.isArray(data.projectiles)?data.projectiles:[]).map(q=>({...q,owner:players[q.owner]||players[0]}));
  bloodDrops=Array.isArray(data.bloodDrops)?data.bloodDrops:[];
  bloodPools=Array.isArray(data.bloodPools)?data.bloodPools:[];
  particles=Array.isArray(data.particles)?data.particles:[];
  rings=Array.isArray(data.rings)?data.rings:[];
  show('selectScreen',gameMode==='select');$('shell').classList.toggle('selecting',gameMode==='select');
  show('hud',gameMode!=='select');show('fightStrip',gameMode!=='select');
  show('pauseScreen',gameMode==='paused');show('resultScreen',gameMode==='result');
  if(data.announcement){$('announcementMain').textContent=data.announcement.main||'';$('announcementSub').textContent=data.announcement.sub||'';show('announcement',!data.announcement.hidden)}
  if(data.results){$('resultTitle').textContent=data.results.title||'';$('resultSub').textContent=data.results.sub||''}
  if(players[2]&&data.bossHp!==null){$('bossMeter').classList.toggle('hidden',gameMode==='result');$('bossName').textContent='БОСС · '+players[2].f.name;$('bossFill').style.width=Math.max(0,data.bossHp/265*100)+'%'}else $('bossMeter').classList.add('hidden');
  updateHUD();updateRunHUD();
}
function onNetMessage(data){
  if(!data || typeof data!=='object' || typeof data.type!=='string')return;
  if(network.role==='host'){
    if(data.type==='hello'||data.type==='fighter'){
      selected[1]=safeIndex(data.fighter??data.index);updateSelection();broadcastLobby();
    }
    if(data.type==='input'){
      network.remoteInput=normalizeInput(data.buttons);network.lastRemoteAt=Date.now();
      if(data.finisher && gameMode==='finisher' && finisherWinner===1)finishNow();
    }
    if(data.type==='restart'&&gameMode==='result'){statusNet('Друг просит реванш. Нажми «Реванш».')}
  } else if(network.role==='guest'){
    if(data.type==='lobby'){
      network.kind=data.kind==='online-coop'?'online-coop':'online-vs';$('onlineKind').value=network.kind;
      statusNet('Соединено! Ты игрок 2 — '+(network.kind==='online-coop'?'сражаешься вместе с другом против босса.':'сражаешься против хозяина.'));
    }
    if(data.type==='state')applySnapshot(data);
  }
}
function buildMyInput(){const state=originalControls(0);return normalizeInput(state)}
setInterval(()=>{
 if(!netActive())return;
 if(network.role==='guest'){
   const buttons=buildMyInput();
   const finisher=(gameMode==='finisher' && (buttons.punch||buttons.special||buttons.heavy));
   sendNet({type:'input',buttons,finisher});
 } else snapshotNet();
},55);

$('onlineOpenBtn').addEventListener('click',showOnlinePanel);
$('closeOnlineBtn').addEventListener('click',hideOnlinePanel);
$('createRoomBtn').addEventListener('click',createRoom);
$('joinRoomBtn').addEventListener('click',joinRoom);
$('goOnlineBtn').addEventListener('click',netBattleStart);
$('leaveRoomBtn').addEventListener('click',()=>{resetNet('Ты отключился.');hideOnlinePanel();originalMenu()});
$('copyLinkBtn').addEventListener('click',async()=>{
 const str=$('roomLink').value;if(!str)return;
 try{await navigator.clipboard.writeText(str);statusNet('Приглашение скопировано!')}catch{$('roomLink').select();statusNet('Скопируй выделенную ссылку вручную.')}
});
$('onlineKind').addEventListener('change',()=>{network.kind=$('onlineKind').value;setOnlineButtons();broadcastLobby()});
$('matchMode').insertAdjacentHTML('beforeend','<option value="online-vs">🌐 ОНЛАЙН 1 НА 1</option><option value="online-coop">🌐 КООП ПРОТИВ БОССА</option>');
$('roster').addEventListener('click',()=>{setTimeout(sendFighterSelection,0)});
$('previewOne').addEventListener('click',()=>{setTimeout(sendFighterSelection,0)});
$('againBtn').addEventListener('click',()=>{if(netGuest())sendNet({type:'restart'})});
const originalRestart=startNextFight;
startNextFight=function(){if(netGuest()){sendNet({type:'restart'});showOnlinePanel();statusNet('Ожидай повторного боя от хозяина.');return}if(netHost()){
 $('matchMode').value=network.kind;netBattleStart();return
}originalRestart()};
setOnlineButtons();
const roomParam=new URL(location.href).searchParams.get('room');
if(roomParam){$('joinCode').value=roomParam;showOnlinePanel();statusNet('Приглашение получено. Выбери персонажа и нажми «Подключиться».')}
// Earlier game version stored bare function references in onclick properties.
// Rebind those buttons to the multiplayer-aware wrappers.
$('startBtn').onclick=()=>startGame();
$('againBtn').onclick=()=>startNextFight();
$('backBtn').onclick=()=>menu();
$('toMenuBtn').onclick=()=>menu();
$('resumeBtn').onclick=()=>togglePause();
