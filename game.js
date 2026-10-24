
'use strict';
const PORTRAITS=["assets/portraits/01.jpg", "assets/portraits/02.jpg", "assets/portraits/03.jpg", "assets/portraits/04.jpg", "assets/portraits/05.jpg", "assets/portraits/06.jpg", "assets/portraits/07.jpg", "assets/portraits/08.jpg", "assets/portraits/09.jpg"];
const HEADS=["assets/heads/01.png", "assets/heads/02.png", "assets/heads/03.png", "assets/heads/04.png", "assets/heads/05.png", "assets/heads/06.png", "assets/heads/07.png", "assets/heads/08.png", "assets/heads/09.png"];
const fighters=[
 {name:'БУЛЬДОЗЕР',title:'Железный натиск',desc:'Неудержимый ближний бой. Спецприём: Таран.',color:'#ff994d',accent:'#ffe4a0',spd:3.55,pow:9,special:'dash',quote:'Кто здесь главный? Сразу станет ясно.'},
 {name:'СТРАННИК',title:'Тайна длинных волос',desc:'Точный и быстрый. Спецприём: Лезвие ветра.',color:'#b7b2e8',accent:'#e2e3ff',spd:4.35,pow:7,special:'wave',quote:'Молчание перед бурей.'},
 {name:'ДИПЛОМАТ',title:'Холодный расчёт',desc:'Контратаки и превосходная техника. Спецприём: Импульс.',color:'#4caeea',accent:'#b3eeff',spd:4.1,pow:7.6,special:'wave',quote:'Я уже просчитал твой следующий ход.'},
 {name:'КРАСНЫЙ 607',title:'Неизвестный в маске',desc:'Сокрушительный рывок. Спецприём: Красный разрез.',color:'#e3494e',accent:'#ff9a79',spd:4.5,pow:8.2,special:'dash',quote:'Лицо неважно. Важен результат.'},
 {name:'КОСМОС',title:'Повелитель орбиты',desc:'Метает планетарные сферы. Спецприём: Орбита.',color:'#7cc9ff',accent:'#c5f7ff',spd:3.8,pow:8.1,special:'orb',quote:'Вся вселенная на моей ладони.'},
 {name:'КАМЕНЬ',title:'Непоколебимый',desc:'Тяжёлые удары и крепкая броня. Спецприём: Гром.',color:'#8ecb83',accent:'#e5f7a5',spd:3.6,pow:9.1,special:'slam',quote:'Не сдвинешь меня с места.'},
 {name:'ПРИЗРАК',title:'Медвежья тень',desc:'Ускользает в темноту. Спецприём: Телепорт.',color:'#d9a7d9',accent:'#ffd5f5',spd:4.35,pow:7.8,special:'blink',quote:'Ты сражаешься с собственной тенью.'},
 {name:'СИНИЙ',title:'Спокойный шторм',desc:'Стремительные комбинации. Спецприём: Разряд.',color:'#65a9f7',accent:'#b1deff',spd:4.7,pow:6.9,special:'wave',quote:'Действую быстро. Говорю мало.'},
 {name:'ШЕСТЬ-СЕМЬ',title:'Хаос 67',desc:'Непредсказуемый трюкач. Спецприём: Сфера 67.',color:'#e6bd54',accent:'#fff6ae',spd:4.4,pow:7.5,special:'orb',quote:'Шесть! Семь! Сюрприз!'}
];
const $=id=>document.getElementById(id);
const pics=PORTRAITS.map(src=>{let i=new Image();i.src=src;return i});
const heads=HEADS.map(src=>{let i=new Image();i.src=src;return i});
const canvas=$('game'), screenCtx=canvas.getContext('2d');const renderCanvas=document.createElement('canvas'), ctx=renderCanvas.getContext('2d');const pixelCanvas=document.createElement('canvas'), pixelCtx=pixelCanvas.getContext('2d');const W=1280,H=720,GROUND=574,PIXEL_W=320,PIXEL_H=180;renderCanvas.width=W;renderCanvas.height=H;pixelCanvas.width=PIXEL_W;pixelCanvas.height=PIXEL_H;canvas.width=W;canvas.height=H;ctx.imageSmoothingEnabled=false;screenCtx.imageSmoothingEnabled=false;pixelCtx.imageSmoothingEnabled=false;
let selected=[0,4],side=0,matchMode='cpu',arenaIndex=0,gameMode='select',round=1,score=[0,0],players=[],timer=99,intro=0,roundEndDelay=0,finisherTime=0,finisherWinner=0,finished=false,last=0,worldTime=0,shake=0,flash=0,particles=[],projectiles=[],rings=[],floating=[],bloodDrops=[],bloodPools=[],inputs={},aiKeys={},soundOn=true,audioCtx=null,comboHits=0,comboTimer=0,matchWinner=0;
const randSeed=n=>(Math.sin(n*124.733)*43758.5453)%1<0?((Math.sin(n*124.733)*43758.5453)%1)+1:(Math.sin(n*124.733)*43758.5453)%1;
const rand=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
function show(el,visible){$(el).classList.toggle('hidden',!visible)}
function setupRoster(){const grid=$('roster');grid.innerHTML='';fighters.forEach((f,i)=>{let b=document.createElement('button');b.className='fighter-tile';b.setAttribute('aria-label','Выбрать '+f.name);b.innerHTML=`<img src="${PORTRAITS[i]}" alt="${f.name}"><span class="fname">${f.name}</span>`;b.onclick=()=>{selected[side]=i;updateSelection();tone(240,0.07,'triangle')};grid.append(b)});document.querySelectorAll('[data-side]').forEach(b=>{if(b.classList.contains('fighter-tile'))return;b.addEventListener('click',()=>{side=+b.dataset.side;updateSelection();tone(500,.05)})});updateSelection()}
function updateSelection(){for(let s=0;s<2;s++){const f=fighters[selected[s]], n=s===0?'One':'Two';$('preview'+n+'Img').src=PORTRAITS[selected[s]];$('preview'+n+'Name').textContent=f.name;$('preview'+n+'Desc').textContent=f.desc;$(s===0?'p1Pow':'p2Pow').style.width=f.pow*10+'%';$(s===0?'p1Spd':'p2Spd').style.width=(f.spd/5.2*100)+'%'}$('previewOne').classList.toggle('active',side===0);$('previewTwo').classList.toggle('active',side===1);document.querySelectorAll('.roster-tabs button').forEach(b=>b.classList.toggle('active',+b.dataset.side===side));Array.from($('roster').children).forEach((b,i)=>{b.classList.toggle('picked1',selected[0]===i);b.classList.toggle('picked2',selected[1]===i);b.querySelectorAll('.flag').forEach(x=>x.remove());if(selected[0]===i){let f=document.createElement('span');f.className='flag';f.textContent='P1';b.append(f)}if(selected[1]===i){let f=document.createElement('span');f.className='flag p2';f.textContent='P2';b.append(f)}})}
function initAudio(){try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume()}catch(e){}}
function tone(freq=220,duration=.12,type='sawtooth',volume=.05){if(!soundOn)return;try{initAudio();let osc=audioCtx.createOscillator(),gain=audioCtx.createGain(),now=audioCtx.currentTime;osc.type=type;osc.frequency.setValueAtTime(freq,now);osc.frequency.exponentialRampToValueAtTime(Math.max(40,freq*.63),now+duration);gain.gain.setValueAtTime(volume,now);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);osc.connect(gain).connect(audioCtx.destination);osc.start(now);osc.stop(now+duration+.01)}catch(e){}}
function impactSound(strong=false){tone(strong?85:130,strong?.3:.13,'sawtooth',strong?.11:.065);setTimeout(()=>tone(strong?185:240,.07,'triangle',.027),38)}
function announce(main,sub='',duration=110){$('announcementMain').textContent=main;$('announcementSub').textContent=sub;show('announcement',true);announce.life=duration}
function fighterObject(index,x,dir){let f=fighters[index];return{index,f,x,elev:0,vy:0,dir,hp:100,energy:43,block:false,stun:0,action:null,actionT:0,actionLen:0,hasHit:false,cooldown:0,move:0,anim:Math.random()*9,combo:0,lastHit:0,blink:0,superGlow:0,dead:false,aiDecision:0,aiAction:'',aiCounter:0,hitFlash:0}}
function startGame(){document.activeElement?.blur?.();initAudio();matchMode=$('matchMode').value;arenaIndex=+$('arenaSelect').value;round=1;score=[0,0];resetRound();show('selectScreen',false);$('shell').classList.remove('selecting');show('resultScreen',false);show('pauseScreen',false);show('hud',true);gameMode='intro';tone(290,.2);setTimeout(()=>tone(420,.18),110)}
function resetRound(){players=[fighterObject(selected[0],365,1),fighterObject(selected[1],915,-1)];timer=99;intro=154;roundEndDelay=0;finisherTime=0;finished=false;projectiles=[];rings=[];floating=[];particles=[];bloodDrops=[];bloodPools=[];flash=0;comboHits=0;comboTimer=0;gameMode='intro';updateHUD();announce('РАУНД '+round,'ПРИГОТОВЬСЯ К БОЮ',155)}
function updateHUD(){$('p1Name').textContent=players[0].f.name;$('p2Name').textContent=players[1].f.name;$('clock').textContent=Math.max(0,Math.ceil(timer));$('roundNum').textContent=round;for(let i=0;i<2;i++){const p=players[i],pre=i===0?'p1':'p2';$(pre+'Life').style.transform=`scaleX(${clamp(p.hp,0,100)/100})`;$(pre+'Lag').style.transform=`scaleX(${clamp(p.hp,0,100)/100})`;$(pre+'Energy').style.width=clamp(p.energy,0,100)+'%';Array.from($(pre+'Pips').children).forEach((n,j)=>n.classList.toggle('on',j<score[i]))}}
function menu(){$('shell').classList.add('selecting');gameMode='select';show('selectScreen',true);show('hud',false);show('pauseScreen',false);show('resultScreen',false);show('announcement',false);show('combo',false);inputs={};updateSelection()}
function togglePause(){if(gameMode==='fight'||gameMode==='intro'||gameMode==='finisher'){gameMode='paused';show('pauseScreen',true);show('announcement',false)}else if(gameMode==='paused'){show('pauseScreen',false);gameMode=finisherTime>0?'finisher':intro>0?'intro':'fight';if(gameMode==='intro')announce('РАУНД '+round,'ПРИГОТОВЬСЯ К БОЮ',intro)}}
$('startBtn').onclick=startGame;$('againBtn').onclick=startGame;$('backBtn').onclick=menu;$('toMenuBtn').onclick=menu;$('resumeBtn').onclick=togglePause;
$('soundBtn').onclick=()=>{soundOn=!soundOn;$('soundBtn').textContent='♫ ЗВУК: '+(soundOn?'ВКЛ':'ВЫКЛ');if(soundOn)tone(440,.09)};
$('fullscreenBtn').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen?.();else $('shell').requestFullscreen?.()};
const mappings=[{left:'a',right:'d',jump:'w',block:'s',punch:'j',kick:'k',special:'l'},{left:'arrowleft',right:'arrowright',jump:'arrowup',block:'arrowdown',punch:'1',kick:'2',special:'3'}];
const knownKeys=new Set(['a','d','w','s','j','k','l','arrowleft','arrowright','arrowup','arrowdown','1','2','3','numpad1','numpad2','numpad3','escape',' ']);
function normalizedKey(e){let key=e.key.toLowerCase();if(e.code.startsWith('Numpad'))key=e.code.toLowerCase();if(key==='numpad1')key='1';if(key==='numpad2')key='2';if(key==='numpad3')key='3';return key}
document.addEventListener('keydown',e=>{if(['SELECT','INPUT','TEXTAREA'].includes(document.activeElement?.tagName)&&e.key!=='Escape')return;const key=normalizedKey(e);if(knownKeys.has(key))e.preventDefault();if(key==='escape'&&!e.repeat){togglePause();return}inputs[key]=true;if(!e.repeat && gameMode==='finisher' && (key==='l'||key==='3'||key==='j'||key==='1')){if((finisherWinner===0&&['j','l'].includes(key))||(finisherWinner===1&&['1','3'].includes(key)))finishNow()}});
document.addEventListener('keyup',e=>{inputs[normalizedKey(e)]=false});window.addEventListener('blur',()=>{inputs={};if(gameMode==='fight')togglePause()});
document.querySelectorAll('.touch-button').forEach(b=>{const key=b.dataset.key;function down(e){e.preventDefault();inputs[key]=true;b.classList.add('pressed');if(gameMode==='finisher'&&finisherWinner===0&&(key==='l'||key==='j'))finishNow()}function up(e){e.preventDefault();inputs[key]=false;b.classList.remove('pressed')}b.addEventListener('pointerdown',down);b.addEventListener('pointerup',up);b.addEventListener('pointercancel',up);b.addEventListener('lostpointercapture',up)});
function getControls(i){if(i===1&&matchMode==='cpu')return aiKeys;const map=mappings[i],out={};for(const [action,key] of Object.entries(map))out[action]=!!inputs[key];return out}
function aiThink(p,target,dt){aiKeys={};p.aiDecision-=dt;const dist=Math.abs(target.x-p.x);if(p.aiDecision<=0){p.aiDecision=rand(7,18);if(target.action&&dist<144&&Math.random()<.45){p.aiAction='block';p.aiDecision=rand(12,26)}else if(dist>120){p.aiAction=Math.random()<.84?'advance':'special';}else{let r=Math.random();p.aiAction=r<.38?'punch':r<.71?'kick':r<.84?'block':'special'}}if(p.stun>0)return;const a=p.aiAction;if(a==='advance'){aiKeys[p.x<target.x?'left':'right']=false;aiKeys[p.x<target.x?'right':'left']=true;if(Math.random()<.006)aiKeys.jump=true}else if(a==='block'){aiKeys.block=true}else if(a==='punch')aiKeys.punch=true;else if(a==='kick')aiKeys.kick=true;else if(a==='special')aiKeys.special=true;if(dist>135&&['punch','kick','special'].includes(a)&&Math.random()<.55)aiKeys[p.x<target.x?'right':'left']=true;if(dist<52&&Math.random()<.012)aiKeys.jump=true}
function attackStart(p,type){if(p.cooldown>0||p.stun>0||p.action||p.dead||gameMode!=='fight')return;if(type==='special'&&p.energy<35)return;const len=type==='punch'?23:type==='kick'?32:48;p.action=type;p.actionT=0;p.actionLen=len;p.hasHit=false;p.cooldown=len+(type==='special'?9:5);p.block=false;if(type==='special'){p.energy-=35;p.superGlow=40;spawnRing(p.x,GROUND-p.elev-146,p.f.color,23);tone(340,.24,'sawtooth',.052)}else tone(type==='punch'?160:120,.055,'triangle',.026)}
function spawnSparks(x,y,color,n=14,power=1){for(let i=0;i<n;i++){let a=rand(0,Math.PI*2),speed=rand(1,9)*power;particles.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed-1,life:rand(13,33),max:33,size:rand(1,4),color,gravity:rand(.11,.36)})}if(particles.length>370)particles.splice(0,particles.length-370)}
function spawnRing(x,y,color,size=10){rings.push({x,y,r:size,life:25,max:25,color})}
function floatText(text,x,y,color='#ffdc83'){floating.push({text,x,y,life:45,color})}
function isFacing(p,target){return(p.dir>0&&target.x>p.x)||(p.dir<0&&target.x<p.x)}
function takeHit(attacker,defender,damage,push,fromSpecial=false){if(defender.dead||gameMode!=='fight')return;const guarding=defender.block&&defender.elev<22&&isFacing(defender,attacker);let dmg=guarding?Math.max(1,Math.round(damage*.17)):damage;defender.hp=clamp(defender.hp-dmg,0,100);defender.energy=clamp(defender.energy+6,0,100);attacker.energy=clamp(attacker.energy+6,0,100);defender.stun=guarding?5:fromSpecial?23:13;defender.hitFlash=12;defender.x=clamp(defender.x+attacker.dir*(guarding?push*.35:push),70,W-70);if(!guarding){defender.action=null;defender.actionT=0;defender.cooldown=Math.max(defender.cooldown,10)}let x=(attacker.x+defender.x)/2,y=GROUND-defender.elev-135;spawnSparks(x,y,guarding?'#a0daff':attacker.f.accent,guarding?10:23,fromSpecial?1.55:1.0);spawnRing(x,y,guarding?'#7fdbff':'#f8ba74',15);if(!guarding){spawnBlood(x+attacker.dir*12,y-4,attacker.dir,Math.round(fromSpecial?22:11),fromSpecial?1.5:1);if(Math.random()<.35)depositBlood(defender.x+rand(-18,18),rand(4,10),.15+Math.random()*.12)}shake=Math.max(shake,guarding?2:fromSpecial?15:7);flash=Math.max(flash,fromSpecial?.17:.07);impactSound(fromSpecial);if(guarding){floatText('БЛОК',x,y-35,'#9ce4ff')}else{attacker.combo=(attacker.lastHit>0?attacker.combo:0)+1;attacker.lastHit=75;if(attacker.combo>=2){comboHits=attacker.combo;comboTimer=80;$('combo').textContent=attacker.combo+' HITS / КОМБО';$('combo').style.left=attacker===players[0]?'6%':'auto';$('combo').style.right=attacker===players[1]?'6%':'auto';show('combo',true)}floatText('-'+Math.round(dmg),defender.x,y-60,'#ffd788')}if(defender.hp<=0){defender.dead=true;spawnBlood(defender.x,GROUND-150,attacker.dir,34,2.1);depositBlood(defender.x,18,.42);triggerFinisher(attacker,defender)}}
function triggerFinisher(attacker,loser){gameMode='finisher';finisherWinner=attacker===players[0]?0:1;finisherTime=210;annouceFinish();attacker.action=null;attacker.cooldown=0;attacker.energy=100;loser.stun=999;loser.hitFlash=20;spawnRing(loser.x,GROUND-120,'#ff7a36',60);tone(110,.7,'sawtooth',.1)}
function annouceFinish(){announce('FINISH HIM!','НАЖМИ СПЕЦПРИЁМ ИЛИ УДАР',205)}
function finishNow(){if(gameMode!=='finisher'||finished)return;finished=true;const a=players[finisherWinner],d=players[1-finisherWinner];a.x=clamp(d.x-a.dir*116,100,1180);spawnRing(d.x,GROUND-145,a.f.color,35);spawnRing(d.x,GROUND-145,'#fff6bd',8);spawnSparks(d.x,GROUND-148,a.f.color,110,3.0);spawnBlood(d.x,GROUND-152,a.dir,110,2.8);spawnBlood(d.x+rand(-30,30),GROUND-106,a.dir,60,2.1);for(let i=0;i<8;i++)depositBlood(d.x+rand(-65,65),rand(8,20),.24+Math.random()*.24);for(let i=0;i<10;i++)spawnRing(d.x+rand(-70,70),GROUND-rand(70,250),a.f.color,rand(6,45));shake=25;flash=.65;d.hitFlash=140;d.finisherPose=1;announce('BRUTAL FINISH','ПОБЕДИТЕЛЬ: '+a.f.name,115);tone(62,.8,'sawtooth',.15);finisherTime=110}
function settleRound(winner){score[winner]++;tone(390,.32,'triangle',.06);tone(600,.42,'sine',.04);if(score[winner]>=2){matchWinner=winner;gameMode='result';show('resultScreen',true);$('resultTitle').textContent=players[winner].f.name+' ПОБЕДИЛ!';$('resultSub').textContent='🏆 Чемпион турнира! Счёт '+score[0]+' : '+score[1]+'. '+players[winner].f.quote;show('announcement',false)}else{round++;resetRound()}}
function updateFighter(p,target,c,dt){p.anim+=dt*(.08+Math.abs(p.move)*.08);p.cooldown=Math.max(0,p.cooldown-dt);p.stun=Math.max(0,p.stun-dt);p.hitFlash=Math.max(0,p.hitFlash-dt);p.lastHit=Math.max(0,p.lastHit-dt);p.superGlow=Math.max(0,p.superGlow-dt);p.blink=Math.max(0,p.blink-dt);p.energy=clamp(p.energy+dt*.052,0,100);p.dir=target.x>=p.x?1:-1;p.block=!!c.block&&!p.action&&p.elev===0&&p.stun===0;if(p.stun<=0&&!p.dead){let m=(c.right?1:0)-(c.left?1:0);p.move=(p.action&&p.action!=='special')||p.block?0:m;if(p.action==='special'&&p.f.special==='dash')p.move=0;if(p.move)p.x+=p.move*p.f.spd*dt*(p.elev>0?1.08:1);if(c.jump&&p.elev===0&&!p.block&&!p.action){p.vy=17.3;p.elev=1;tone(315,.06,'sine',.02)}if(!p.action&&!p.block){if(c.punch)attackStart(p,'punch');else if(c.kick)attackStart(p,'kick');else if(c.special)attackStart(p,'special')}}else p.move=0;
 if(p.elev>0||p.vy>0){p.elev+=p.vy*dt;p.vy-=.95*dt;if(p.elev<=0){p.elev=0;p.vy=0;spawnSparks(p.x,GROUND,'#b2a3a5',4,.55)}}
 p.x=clamp(p.x,65,W-65);
 if(p.action){p.actionT+=dt;let t=p.actionT,typ=p.action;if(typ==='special'&&t>12&&!p.hasHit){p.hasHit=true;useSpecial(p,target)}if((typ==='punch'||typ==='kick')&&t>=(typ==='punch'?8:12)&&!p.hasHit){p.hasHit=true;const dist=Math.abs(p.x-target.x),reach=typ==='punch'?110:143; if(dist<=reach&&Math.abs(p.elev-target.elev)<105&&isFacing(p,target))takeHit(p,target,(typ==='punch'?9:14)*p.f.pow/8,typ==='punch'?24:34,false)}if(t>=p.actionLen){p.action=null;p.actionT=0}}}
function useSpecial(p,target){const spec=p.f.special;if(spec==='wave'||spec==='orb'){projectiles.push({owner:p,x:p.x+p.dir*57,y:GROUND-p.elev-147,vx:p.dir*(spec==='orb'?8.4:12),size:spec==='orb'?29:18,life:150,color:p.f.color,accent:p.f.accent,kind:spec,phase:rand(0,8),hasHit:false});spawnSparks(p.x+p.dir*80,GROUND-p.elev-150,p.f.color,26,1.4)}else if(spec==='dash'){let oldX=p.x;p.x=clamp(p.x+p.dir*Math.min(180,Math.abs(target.x-p.x)),65,W-65);for(let j=0;j<10;j++)spawnSparks(lerp(oldX,p.x,j/10),GROUND-rand(65,210),p.f.color,3,.65);if(Math.abs(p.x-target.x)<155)takeHit(p,target,22*p.f.pow/8.3,48,true);shake=10}else if(spec==='slam'){spawnRing(p.x,GROUND-28,p.f.color,30);spawnSparks(p.x,GROUND-30,p.f.color,65,1.8);if(Math.abs(p.x-target.x)<225)takeHit(p,target,19*p.f.pow/8,55,true)}else if(spec==='blink'){let old=p.x;p.x=clamp(target.x+(p.dir*54),65,W-65);p.dir=target.x>p.x?1:-1;p.blink=23;spawnRing(old,GROUND-130,p.f.color,30);spawnRing(p.x,GROUND-130,p.f.color,25);spawnSparks(old,GROUND-125,'#e39bdc',25);if(Math.abs(p.x-target.x)<120)takeHit(p,target,22*p.f.pow/8,30,true)}}
function updateProjectiles(dt){for(let i=projectiles.length-1;i>=0;i--){let q=projectiles[i];q.x+=q.vx*dt;q.life-=dt;q.phase+=dt*.18;if(Math.random()<.64)spawnSparks(q.x-rand(-7,7),q.y,q.color,1,.55);let target=players[1-players.indexOf(q.owner)];if(!q.hasHit&&Math.abs(q.x-target.x)<50&&Math.abs(q.y-(GROUND-target.elev-145))<100){q.hasHit=true;takeHit(q.owner,target,q.kind==='orb'?20:17,30,true);spawnSparks(q.x,q.y,q.color,28,1.4);q.life=0}if(q.life<=0||q.x<-50||q.x>W+50)projectiles.splice(i,1)}}
function updateEffects(dt){for(let i=particles.length-1;i>=0;i--){let p=particles[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.gravity*dt;p.vx*=Math.pow(.986,dt);p.life-=dt;if(p.life<=0)particles.splice(i,1)}for(let i=bloodDrops.length-1;i>=0;i--){let b=bloodDrops[i];b.x+=b.vx*dt;b.y+=b.vy*dt;b.vy+=b.gravity*dt;b.vx*=Math.pow(.994,dt);b.life-=dt;if(b.y>=GROUND+6){depositBlood(b.x,rand(2.5,7.5)*Math.max(.8,b.size*.5),.12+Math.random()*.18);bloodDrops.splice(i,1);continue}if(b.life<=0)bloodDrops.splice(i,1)}for(let i=bloodPools.length-1;i>=0;i--){let bp=bloodPools[i];bp.life-=dt*0.35;if(bp.life<=0)bloodPools.splice(i,1)}for(let i=rings.length-1;i>=0;i--){rings[i].r+=4.7*dt;rings[i].life-=dt;if(rings[i].life<=0)rings.splice(i,1)}for(let i=floating.length-1;i>=0;i--){floating[i].y-=dt*1.3;floating[i].life-=dt;if(floating[i].life<=0)floating.splice(i,1)}shake*=Math.pow(.85,dt);flash*=Math.pow(.87,dt);if(comboTimer>0){comboTimer-=dt;if(comboTimer<=0)show('combo',false)}if(announce.life>0){announce.life-=dt;if(announce.life<=0)show('announcement',false)}}
function update(dt){worldTime+=dt;updateEffects(dt);if(gameMode==='paused'||gameMode==='select'||gameMode==='result')return;if(gameMode==='intro'){intro-=dt;players.forEach((p)=>{p.anim+=dt*.055});if(intro<50&&announce.life>48){announce('FIGHT!','НАЧИНАЙ БОЙ',48);tone(88,.44,'sawtooth',.12)}if(intro<=0){gameMode='fight';show('announcement',false)}return}if(gameMode==='finisher'){finisherTime-=dt;players.forEach(p=>p.anim+=dt*.06);if(!finished &&(finisherWinner===1&&matchMode==='cpu')&&finisherTime<157)finishNow();if(finisherTime<=0)settleRound(finisherWinner);return}if(gameMode!=='fight')return;
 if(matchMode==='cpu')aiThink(players[1],players[0],dt);const a=getControls(0),b=getControls(1);updateFighter(players[0],players[1],a,dt);if(gameMode==='fight')updateFighter(players[1],players[0],b,dt);if(gameMode==='fight'){let d=players[1].x-players[0].x,minD=76;if(Math.abs(d)<minD){let delta=(minD-Math.abs(d))/2;players[0].x-=Math.sign(d||1)*delta;players[1].x+=Math.sign(d||1)*delta}updateProjectiles(dt);timer-=dt/60;if(timer<=0){let winner=players[0].hp===players[1].hp?Math.floor(Math.random()*2):players[0].hp>players[1].hp?0:1;gameMode='finisher';finisherWinner=winner;finisherTime=115;finished=true;announce('ВРЕМЯ ВЫШЛО!','ПОБЕДА ПО ОЧКАМ: '+players[winner].f.name,104)}}updateHUD()}
function drawPoly(points,color){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fill()}
function line(x1,y1,x2,y2,width,color){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
function roundRect(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function glow(x,y,r,color){let g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'#00000000');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
const SKIN_TONES=['#f2c7a3','#ddb08a','#c98b68','#9f6749','#6e4734','#e7c5b4','#b57759','#8f573f','#d7af8f'];
function spawnBlood(x,y,dir=1,amount=12,power=1){for(let i=0;i<amount;i++){let vx=dir*rand(1.5,6.8)*power + rand(-2.5,2.5), vy=rand(-7.6,-1.4)*power; bloodDrops.push({x:x+rand(-10,10),y:y+rand(-8,8),vx,vy,life:rand(28,58),max:58,size:rand(1.2,3.8)*power,gravity:rand(.24,.48),color:Math.random()<.25?'#ff5a5a':Math.random()<.6?'#cc1018':'#78060c'});} if(bloodDrops.length>520)bloodDrops.splice(0,bloodDrops.length-520)}
function depositBlood(x,size=8,alpha=.32){bloodPools.push({x:clamp(x,40,W-40),y:GROUND+7,r:size,life:720,max:720,alpha}); if(bloodPools.length>45)bloodPools.splice(0,bloodPools.length-45)}
function drawStrokePoly(points,fill,stroke='#0c0d12',lineWidth=4){ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=lineWidth;ctx.lineJoin='round';ctx.stroke()}
function drawCapsule(x1,y1,x2,y2,thick,fill,stroke='#101117'){ctx.strokeStyle=stroke;ctx.lineWidth=thick+6;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.strokeStyle=fill;ctx.lineWidth=thick;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
function roundFill(x,y,w,h,r,fill,stroke='#111',lw=3){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.lineWidth=lw;ctx.strokeStyle=stroke;ctx.stroke()}}

function drawArena(){if(arenaIndex>=3){drawNewArena();return;}const cosmic=arenaIndex===1,throne=arenaIndex===2;let sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,cosmic?'#0d1634':throne?'#231225':'#210d1b');sky.addColorStop(.65,cosmic?'#1b2340':throne?'#47242b':'#4a1d26');sky.addColorStop(1,'#0c0b13');ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);glow(640,260,570,cosmic?'#356aa827':throne?'#ae406022':'#d85f2f29');
 const moonX=cosmic?670:640,moonY=cosmic?134:146,moonR=cosmic?91:66;ctx.save();ctx.shadowBlur=cosmic?75:37;ctx.shadowColor=cosmic?'#b8dbff':'#df9b75';ctx.fillStyle=cosmic?'#b5d7ef':'#ac7580';ctx.beginPath();ctx.arc(moonX,moonY,moonR,0,Math.PI*2);ctx.fill();ctx.restore();ctx.fillStyle=cosmic?'#c3e5f5':'#e1a695';ctx.globalAlpha=.13;for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(moonX+Math.sin(i*19)*moonR*.55,moonY+Math.cos(i*8)*moonR*.45,randSeed(i+12)*15+5,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
 // far mountains
 drawPoly([[0,414],[100,324],[197,388],[290,300],[380,394],[484,321],[591,394],[700,308],[830,399],[943,298],[1056,382],[1177,315],[1280,394],[1280,550],[0,550]],cosmic?'#131f39':'#2a1b29');drawPoly([[0,470],[138,384],[242,450],[395,349],[524,443],[670,381],[802,457],[1010,356],[1150,449],[1280,383],[1280,600],[0,600]],cosmic?'#16233a':'#1b1421');
 // pillars and temple
 function pillar(x){ctx.save();ctx.translate(x,0);ctx.fillStyle=cosmic?'#1e2d44':'#201a20';ctx.fillRect(-39,165,78,430);ctx.fillStyle=cosmic?'#31465a':'#392a2b';ctx.fillRect(-44,153,88,26);ctx.fillRect(-48,395,96,31);ctx.fillRect(-48,546,96,36);for(let i=0;i<4;i++)line(-25+i*15,186,-25+i*15,395,3,cosmic?'#55709042':'#a66b4b35');ctx.fillStyle='#0a101b99';ctx.fillRect(-31,183,12,354);ctx.restore()}
 pillar(166);pillar(1114);ctx.fillStyle='#17121c';ctx.fillRect(227,195,826,22);drawPoly([[254,199],[328,146],[955,146],[1026,199]],cosmic?'#263147':'#30212b');drawPoly([[326,139],[386,111],[894,111],[953,139]],cosmic?'#1c263a':'#26151e');ctx.fillStyle=cosmic?'#111b30':'#170e18';ctx.fillRect(347,213,586,331);ctx.strokeStyle=cosmic?'#607c9960':'#ba704953';ctx.lineWidth=9;ctx.strokeRect(346,212,588,337);
 // central portal
 let pg=ctx.createRadialGradient(640,351,24,640,351,315);pg.addColorStop(0,cosmic?'#2a5a88b9':throne?'#8b3458bd':'#be482d88');pg.addColorStop(1,'#050811');ctx.fillStyle=pg;ctx.fillRect(360,229,560,309);ctx.beginPath();ctx.ellipse(640,400,210,260,0,Math.PI,0);ctx.fillStyle='#090a17';ctx.fill();ctx.lineWidth=17;ctx.strokeStyle=cosmic?'#496578':'#55352f';ctx.stroke();ctx.beginPath();ctx.ellipse(640,400,185,235,0,Math.PI,0);ctx.strokeStyle=cosmic?'#5bc1ff44':'#ff8c4d44';ctx.lineWidth=5;ctx.stroke();
 for(const s of [-1,1]){ctx.save();ctx.translate(640+s*301,400);ctx.scale(s,1);drawPoly([[0,-95],[60,-81],[76,17],[27,9],[0,40]],cosmic?'#3c657c':'#6e3934');line(30,-63,34,-4,7,cosmic?'#75bed08c':'#fd99576c');ctx.restore()}
 for(let i=0;i<4;i++){let x=273+i*245;ctx.fillStyle='#120f19';ctx.fillRect(x,466,44,92);glow(x+19,474,64,cosmic?'#559fdd33':'#f57b313b');ctx.fillStyle=cosmic?'#74c2ec':'#ff9138';ctx.beginPath();ctx.moveTo(x+19,446+Math.sin(worldTime*.12+i)*7);ctx.quadraticCurveTo(x-3,482,x+19,492);ctx.quadraticCurveTo(x+42,477,x+19,446);ctx.fill()}
 // ground plane
 drawPoly([[0,557],[1280,557],[1280,720],[0,720]],cosmic?'#19273a':'#271b22');ctx.fillStyle=cosmic?'#52657944':'#b2876b28';ctx.fillRect(0,565,1280,3);for(let j=0;j<11;j++){let y=575+j*j*1.55;ctx.strokeStyle=cosmic?'#96c3de14':'#e7b28e1c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1280,y);ctx.stroke()}for(let x=-450;x<1700;x+=145){line(640,556,x,720,2,cosmic?'#b1dafa15':'#e3b39b20')}
 ctx.fillStyle='#02030c35';ctx.fillRect(0,680,1280,40);
 // falling embers, deterministic positions
 for(let i=0;i<39;i++){let x=(i*149+worldTime*(i%3+1)*.28)%1300,y=(i*271+worldTime*(i%4+2)*-.53)%720;if(y<0)y+=720;let r=(i%3)+.8;ctx.globalAlpha=.12+(i%6)*.075;ctx.fillStyle=cosmic?'#a6dcff':'#ffb075';ctx.fillRect(x,y,r,r*1.8)}ctx.globalAlpha=1;
 // vignette
 let vig=ctx.createRadialGradient(640,330,150,640,350,780);vig.addColorStop(0,'#00000000');vig.addColorStop(1,'#000000a1');ctx.fillStyle=vig;ctx.fillRect(0,0,W,H)}
function drawLimb(points,w,base,edge){ctx.strokeStyle=edge;ctx.lineWidth=w+6;ctx.lineJoin='round';ctx.lineCap='round';ctx.beginPath();ctx.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)ctx.lineTo(points[i][0],points[i][1]);ctx.stroke();ctx.strokeStyle=base;ctx.lineWidth=w;ctx.stroke()}
function drawFighter(p){let x=p.x,y=GROUND-p.elev,f=p.f;let t=p.actionT/p.actionLen||0;const attack=p.action,hitSwing=Math.sin(Math.min(1,t*1.7)*Math.PI),extension=(attack==='punch'?68:attack==='heavy'?100:attack==='grab'?65:attack==='uppercut'?42:0)*hitSwing,kick=(attack==='kick'?94:attack==='sweep'?125:0)*hitSwing,special=attack==='special'?Math.sin(Math.min(1,t*1.7)*Math.PI)*52:0;let run=p.move!==0?Math.sin(p.anim*1.8)*13:Math.sin(p.anim)*1.6;const base=f.color,accent=f.accent,costume=['#678dad','#1f1e2c','#304f77','#381822','#d5d4c5','#46535c','#28222b','#537d9e','#8f9191'][p.index],skin=SKIN_TONES[p.index%SKIN_TONES.length],darkSkin='#5d3828';ctx.save();ctx.globalAlpha=.48;ctx.fillStyle='#04030a';ctx.beginPath();ctx.ellipse(x,GROUND+9,66-Math.min(26,p.elev*.1),13,0,0,Math.PI*2);ctx.fill();ctx.restore();ctx.save();ctx.translate(x,y+Math.sin(p.anim)*((p.elev===0&&p.move===0)?1.5:0));ctx.scale(p.dir,1);if(p.finisherPose)ctx.rotate(-.91);else if(p.stun>0)ctx.rotate(-.09);if(p.crouch && !['uppercut','sweep'].includes(attack))ctx.scale(1,.77);if(p.dashT>0){ctx.globalAlpha=.7;glow(-24,-118,110,p.f.color+'55')}if(p.blink>0)ctx.globalAlpha=.68;if(p.superGlow>0)glow(0,-162,150,base+'55');
 // back ribbons / silhouette
 drawStrokePoly([[-34,-184],[-74,-165],[-58,-112],[-85,-42],[-17,-93]],'#171319','#090a0e',3);line(-53,-151,-79,-70,4,base+'77');
 // back leg
 drawCapsule(-18,-80,-22-run*.6,-34,25,'#1a1c24');drawCapsule(-22-run*.6,-34,-26+run*.6,11,22,'#2a2d39');roundFill(-42+run*.6,-4,36,15,4,'#d9dce8','#0b0d14',3);
 // back arm
 drawCapsule(-32,-174,-44-run*.2,-138,19,skin);drawCapsule(-44-run*.2,-138,-38+run*.3,-103,17,'#3d404f');roundFill(-51,-112,22,18,5,'#2c2e3a','#0b0d13',3);
 // pelvis + torso
 let torsoGrad=ctx.createLinearGradient(-48,-192,46,-86);torsoGrad.addColorStop(0,costume);torsoGrad.addColorStop(.45,'#3a3a44');torsoGrad.addColorStop(1,'#181923');drawStrokePoly([[-41,-191],[-3,-203],[45,-182],[39,-88],[0,-74],[-37,-88]],torsoGrad,'#0c0d12',5);drawStrokePoly([[-17,-188],[14,-188],[12,-153],[-12,-153]],'#2a2320','#0b0d12',3);drawStrokePoly([[-30,-88],[31,-88],[21,-72],[-19,-72]],'#11131a','#080a11',3);line(-26,-101,28,-101,3,accent+'99');line(0,-185,0,-81,2,'#00000066');
 // chest strap / emblem
 ctx.save();ctx.translate(0,-148);ctx.rotate(.13);roundFill(-15,-10,30,20,4,'#13151d','#a47a43',2);ctx.strokeStyle=accent;ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(-7,-2);ctx.lineTo(7,2);ctx.moveTo(7,-2);ctx.lineTo(-7,2);ctx.stroke();ctx.restore();drawCostumeDetail(p,skin,base);
 // back shoulder
 ctx.beginPath();ctx.ellipse(-34,-177,18,16,-.3,0,Math.PI*2);ctx.fillStyle=base;ctx.fill();ctx.strokeStyle='#0c0d12';ctx.lineWidth=4;ctx.stroke();
 // front leg
 if(kick>0){drawCapsule(16,-80,34+kick*.35,-72,28,'#1d2028');drawCapsule(34+kick*.35,-72,41+kick,-66,24,'#2b2e3a');roundFill(40+kick,-75,38,18,4,'#e4e6ef','#0b0d14',3);glow(50+kick,-66,52,base+'55')}else{drawCapsule(14,-80,24+run,-32,28,'#1e2029');drawCapsule(24+run,-32,22-run,9,25,'#2f3240');roundFill(4-run,-4,40,16,4,'#e5e7f0','#0a0c13',3)}
 // front arm positions
 let elbowX=43+extension*.25+special*.2, elbowY=-136-(extension>0?extension*.18:0), handX=58+extension+special, handY=-111-(extension>0?extension*.32:0)-(attack==='uppercut'?105*hitSwing:0);
 if(p.block){drawCapsule(31,-176,48,-188,20,skin);drawCapsule(48,-188,31,-220,18,'#414553');roundFill(16,-228,34,26,6,'#8f939f','#13161e',3);glow(32,-200,35,base+'66')}else{drawCapsule(32,-176,elbowX,-138,21,skin);drawCapsule(elbowX,-138,handX,handY,18,'#3d4050');roundFill(handX-14,handY-12,28,22,6,'#232633','#0f1118',3);line(handX-6,handY-4,handX+8,handY-4,2.5,accent)}
 // front shoulder
 ctx.beginPath();ctx.ellipse(32,-178,20,17,.25,0,Math.PI*2);ctx.fillStyle=base;ctx.fill();ctx.strokeStyle='#0c0d12';ctx.lineWidth=4;ctx.stroke();
 // neck
 roundFill(-16,-205,32,20,4,skin,darkSkin,2);
 // head frame
 ctx.beginPath();ctx.ellipse(0,-232,38,47,0,0,Math.PI*2);ctx.fillStyle=p.index===3?'#171922':skin;ctx.fill();ctx.strokeStyle=p.index===3?base:'#9b785e';ctx.lineWidth=p.index===3?5:2;ctx.stroke();
 const img=heads[p.index];if(img.complete&&img.naturalWidth){ctx.save();ctx.beginPath();ctx.ellipse(0,-232,35,44,0,0,Math.PI*2);ctx.clip();ctx.drawImage(img,-39,-282,78,98);ctx.restore()}
 ctx.strokeStyle=p.hitFlash>0?'#fff2da':'#f2d6b8';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(0,-240,19,Math.PI*.1,Math.PI*.9);ctx.stroke();
 // hair/visor outline
 line(-35,-191,31,-191,6,'#0b1017');ctx.strokeStyle=p.hitFlash>0?'#fff9d1':(p.index===3?base:'#8f6c56');ctx.lineWidth=p.hitFlash>0?7:2;ctx.beginPath();ctx.arc(0,-232,38,Math.PI*.22,Math.PI*.78);ctx.stroke();
 // low hp blood smears
 if(p.hp<38){ctx.globalAlpha=.65;ctx.fillStyle='#7d0710';ctx.fillRect(-8,-156,14,8);ctx.fillRect(17,-169,11,6);ctx.globalAlpha=1}
 if(attack==='heavy' || attack==='uppercut'){glow(handX,handY,38,accent+'8a')}if(attack==='special'){glow(handX,handY,60,base+'80');ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.beginPath();ctx.arc(handX,handY,18+Math.sin(p.anim*4)*5,0,Math.PI*2);ctx.stroke()}
 if(p.hitFlash>0){ctx.globalAlpha=Math.min(.58,p.hitFlash/18);ctx.fillStyle='#fff2db';ctx.beginPath();ctx.ellipse(0,-132,50,70,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1}
 if(p.stun>0){ctx.globalAlpha=.8;for(let i=0;i<3;i++){glow(Math.sin(worldTime*.24+i*2)*31,-292+Math.cos(worldTime*.2+i*2)*9,13,'#fff0a888')}}ctx.restore()}
function drawEffects(){for(const bp of bloodPools){ctx.save();ctx.globalAlpha=Math.min(.55,bp.alpha*(bp.life/bp.max+.15));let g=ctx.createRadialGradient(bp.x,bp.y,1,bp.x,bp.y,bp.r);g.addColorStop(0,'#a90f16');g.addColorStop(.5,'#58050b');g.addColorStop(1,'#00000000');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(bp.x,bp.y,bp.r,bp.r*.45,0,0,Math.PI*2);ctx.fill();ctx.restore()}for(const q of projectiles){ctx.save();ctx.translate(q.x,q.y);let sz=q.size+Math.sin(q.phase)*4;glow(0,0,sz*3,q.color+'77');ctx.rotate(q.phase);ctx.strokeStyle=q.accent;ctx.lineWidth=4;ctx.beginPath();ctx.arc(0,0,sz+5,0,Math.PI*1.8);ctx.stroke();ctx.fillStyle=q.color;ctx.beginPath();ctx.arc(0,0,sz,0,Math.PI*2);ctx.fill();glow(-4,-5,sz,'#ffffffaa');if(q.kind==='orb'){ctx.strokeStyle='#ffffffa6';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,0,sz+14,sz*.39,.55,0,Math.PI*2);ctx.stroke()}ctx.restore()}for(const r of rings){ctx.save();ctx.globalAlpha=r.life/r.max;ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,Math.PI*2);ctx.strokeStyle=r.color;ctx.lineWidth=5*(r.life/r.max);ctx.shadowBlur=20;ctx.shadowColor=r.color;ctx.stroke();ctx.restore()}for(const p of particles){ctx.globalAlpha=Math.max(0,Math.min(1,p.life/p.max));ctx.fillStyle=p.color;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(Math.atan2(p.vy,p.vx));ctx.fillRect(-p.size,0,p.size*4,p.size*.65);ctx.restore()}for(const b of bloodDrops){ctx.globalAlpha=Math.max(0,Math.min(1,b.life/b.max));ctx.fillStyle=b.color;ctx.beginPath();ctx.ellipse(b.x,b.y,b.size*1.1,b.size*1.6,0,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;for(const f of floating){ctx.globalAlpha=clamp(f.life/25,0,1);ctx.font='900 34px Courier New,monospace';ctx.textAlign='center';ctx.strokeStyle='#0b0e17';ctx.lineWidth=5;ctx.strokeText(f.text,f.x,f.y);ctx.fillStyle=f.color;ctx.fillText(f.text,f.x,f.y)}ctx.globalAlpha=1}
function drawMenuDemo(){let t=worldTime;const demoL=fighterObject(selected[0],375,1),demoR=fighterObject(selected[1],904,-1);demoL.anim=t;demoR.anim=t+2;demoL.move=Math.sin(t*.018)>.8?1:0;demoR.move=Math.sin(t*.018+2)>.8?-1:0;drawFighter(demoL);drawFighter(demoR)}
function presentFrame(){pixelCtx.clearRect(0,0,PIXEL_W,PIXEL_H);pixelCtx.drawImage(renderCanvas,0,0,PIXEL_W,PIXEL_H);screenCtx.clearRect(0,0,W,H);screenCtx.drawImage(pixelCanvas,0,0,W,H);screenCtx.save();screenCtx.globalAlpha=.16;screenCtx.fillStyle='#000';for(let y=0;y<H;y+=4)screenCtx.fillRect(0,y,W,1);screenCtx.globalAlpha=.06;screenCtx.fillStyle='#ffb56b';screenCtx.fillRect(0,0,W,H);screenCtx.restore()}
function draw(){ctx.clearRect(0,0,W,H);ctx.save();if(shake>0.4)ctx.translate(rand(-shake,shake),rand(-shake,shake));drawArena();for(const bp of bloodPools){ctx.save();ctx.globalAlpha=Math.min(.26,bp.alpha*(bp.life/bp.max+.15));let g=ctx.createRadialGradient(bp.x,bp.y,1,bp.x,bp.y,bp.r);g.addColorStop(0,'#7e0911');g.addColorStop(.6,'#330106');g.addColorStop(1,'#00000000');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(bp.x,bp.y,bp.r,bp.r*.4,0,0,Math.PI*2);ctx.fill();ctx.restore()}if(gameMode==='select'||!players.length)drawMenuDemo();else{const ordered=[...players].sort((a,b)=>a.x-b.x);for(const p of ordered)drawFighter(p)}drawEffects();drawFightExtras();ctx.restore();if(flash>.01){ctx.fillStyle='rgba(255,231,194,'+Math.min(.38,flash)+')';ctx.fillRect(0,0,W,H)}presentFrame()}
function loop(ts){let dt=Math.min(2,Math.max(.01,(ts-last)/16.667||1));last=ts;update(dt);draw();requestAnimationFrame(loop)}
/* ===============================================================
   WEST INDIA KOMBAT // OVERDRIVE combat expansion
   Everything lives in this single HTML file — no libraries/assets.
   =============================================================== */
let runMode='cpu',stage=0,ladderOrder=[],tournamentCleared=false,
    challengeDifficulty='normal',survivalCarry=100,gameWins=0,
    hitStop=0,impactText='',impactTextT=0,toasty=0,
    cameraX=0,roundFrame=0,trainingBestCombo=0;
const TOTAL_STAGES=8;
const difficultyConfig={
  easy:{think:[18,39],aggression:.33,block:.18,damage:.74,regen:.045},
  normal:{think:[10,23],aggression:.57,block:.36,damage:1,regen:.066},
  hard:{think:[5,12],aggression:.8,block:.65,damage:1.13,regen:.094}
};
function safeGet(k,fallback='0'){try{return localStorage.getItem('wiko2_'+k)||fallback}catch(e){return fallback}}
function safeSet(k,v){try{localStorage.setItem('wiko2_'+k,String(v))}catch(e){}}
function refreshRecords(){if($('bestArcade'))$('bestArcade').textContent=safeGet('arcade');if($('bestSurvival'))$('bestSurvival').textContent=safeGet('survival');if($('totalWins'))$('totalWins').textContent=safeGet('wins')}
function showToast(message,frames=140){$('toast').textContent=message;show('toast',true);toasty=frames}
function shuffledOpponents(hero){let arr=fighters.map((_,i)=>i).filter(i=>i!==hero);for(let i=arr.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]]}return arr}
function gameIsCpu(){return runMode!=='pvp'}
function trainingDummyControls(){const beh=$('dummyMode').value;if(beh==='guard')return {block:true};if(beh==='attack'){return {punch:Math.sin(worldTime*.03)>0.7,kick:Math.cos(worldTime*.035)>.89}}return {}}
function applyStage(){if(runMode==='arcade'){selected[1]=ladderOrder[Math.min(stage,ladderOrder.length-1)];}else if(runMode==='survival'){let pool=fighters.map((_,i)=>i).filter(i=>i!==selected[0]);selected[1]=pool[stage%pool.length]}
 if(+$('arenaSelect').value===5)arenaIndex=(stage+Math.floor(Math.random()*5))%5;else arenaIndex=+$('arenaSelect').value}
function startGame(){document.activeElement?.blur?.();initAudio();runMode=$('matchMode').value;matchMode=runMode==='pvp'?'pvp':'cpu';challengeDifficulty=$('difficulty').value;
 stage=0;survivalCarry=100;tournamentCleared=false;gameWins=0;ladderOrder=shuffledOpponents(selected[0]);applyStage();score=[0,0];round=1;resetRound();
 show('selectScreen',false);$('shell').classList.remove('selecting');show('resultScreen',false);show('pauseScreen',false);show('hud',true);show('fightStrip',true);gameMode='intro';tone(320,.16);tone(260,.2,'square',.022);updateRunHUD();
 if(runMode==='arcade')showToast('АРКАДНЫЙ ПУТЬ: ПОБЕДИ ВСЕХ ВОСЬМЕРЫХ',150);
 else if(runMode==='survival')showToast('ВЫЖИВАНИЕ: ЗДОРОВЬЕ НЕ ВОССТАНАВЛИВАЕТСЯ ПОЛНОСТЬЮ',150);
 else if(runMode==='training')showToast('ТРЕНИРОВКА: БЕСКОНЕЧНОЕ ЗДОРОВЬЕ — T ДЛЯ СБРОСА',150);
}
function resetRound(){players=[fighterObject(selected[0],360,1),fighterObject(selected[1],920,-1)];for(let p of players){p.parryWindow=0;p.dashT=0;p.dashCooldown=0;p.invuln=0;p.finisherPose=0;p.combo=0;p.lastHit=0;p.aiDecision=0;p.aiAction='advance';p.comboChain=0;p.crouch=false;p.wasJump=false;p.wasDash=false;p.wasParry=false;p.wasGrab=false;}
 if(runMode==='survival' && stage>0)players[0].hp=survivalCarry;
 if((runMode==='survival'||runMode==='arcade')&&stage>0){players[1].energy=Math.min(95,43+stage*5);players[1].fightingSpirit=stage;}
 if(runMode==='training'){players[0].energy=100;players[1].energy=100}
 timer=99;intro=133;finisherTime=0;roundEndDelay=0;finished=false;projectiles=[];rings=[];floating=[];particles=[];bloodDrops=[];bloodPools=[];flash=0;shake=0;hitStop=0;roundFrame=0;comboTimer=0;comboHits=0;gameMode='intro';show('combo',false);updateHUD();
 let msg=runMode==='arcade'?'ЭТАП '+(stage+1)+' / '+TOTAL_STAGES:runMode==='survival'?'ВОЛНА '+(stage+1):runMode==='training'?'ТРЕНИРОВКА':'РАУНД '+round;
 announce(msg,runMode==='training'?'ОТРАБАТЫВАЙ КОМБИНАЦИИ':'ПРИГОТОВЬСЯ К БОЮ',125);updateRunHUD()}
function updateRunHUD(){let label=runMode==='arcade'?'АРКАДНЫЙ ТУРНИР':runMode==='survival'?'ВЫЖИВАНИЕ':runMode==='training'?'РЕЖИМ ТРЕНИРОВКИ':runMode==='pvp'?'ЛОКАЛЬНЫЙ VS':'VS КОМПЬЮТЕР';
 $('modeLabel').textContent=label;
 $('fightStatus').textContent=runMode==='arcade'?`БИТВА ${stage+1} / ${TOTAL_STAGES}`:runMode==='survival'?`ПОБЕДЫ ${stage}`:runMode==='training'?`ЛУЧШЕЕ КОМБО ${trainingBestCombo}`:'ПЕРВЫЙ ДО ДВУХ';
}
function menu(){$('shell').classList.add('selecting');gameMode='select';show('selectScreen',true);show('hud',false);show('fightStrip',false);show('pauseScreen',false);show('resultScreen',false);show('announcement',false);show('combo',false);show('toast',false);inputs={};refreshRecords();updateSelection()}
function getControls(i){if(i===1){if(runMode==='training')return trainingDummyControls();if(gameIsCpu())return aiKeys}
 const map=mappings[i],out={};for(const [action,key] of Object.entries(map))out[action]=!!inputs[key];
 if(i===0){out.punch ||=combatMouse.left;out.block ||=combatMouse.right}
 const pads=typeof navigator!=='undefined'&&navigator.getGamepads?navigator.getGamepads():[];const pad=pads[i];if(pad){const pressed=n=>!!pad.buttons?.[n]?.pressed;const axis=pad.axes?.[0]||0;out.left ||=axis<-.28||pressed(14);out.right ||=axis>.28||pressed(15);out.jump ||=pressed(12);out.block ||=pressed(4)||pressed(13);out.punch ||=pressed(0);out.kick ||=pressed(1);out.special ||=pressed(3);}
 out.heavy=!!inputs[i===0?'i':'4']||!!pad?.buttons?.[2]?.pressed;out.grab=!!inputs[i===0?'u':'5']||!!pad?.buttons?.[5]?.pressed;out.parry=!!inputs[i===0?'q':'0']||!!pad?.buttons?.[6]?.pressed;out.dash=!!inputs[i===0?' ':'6']||!!pad?.buttons?.[7]?.pressed;
 out.uppercut=out.block&&out.punch;out.sweep=out.block&&out.kick;
 return out}
function aiThink(p,target,dt){aiKeys={};if(runMode==='training')return;const spec=difficultyConfig[challengeDifficulty]||difficultyConfig.normal;const dist=Math.abs(target.x-p.x);p.aiDecision-=dt;
 const danger=target.action||projectiles.some(z=>z.owner!==p&&Math.abs(z.x-p.x)<215);
 if(p.aiDecision<=0){p.aiDecision=rand(...spec.think)*Math.max(.62,1-stage*.045);const r=Math.random();if(danger&&dist<155&&r<spec.block)p.aiAction=r<spec.block*.22?'parry':'block';
 else if(dist>260)p.aiAction=r<.19?'special':'advance';
 else if(dist>150)p.aiAction=r<.28?'special':r<.48?'dash':'advance';
 else if(dist>85)p.aiAction=r<.14?'block':r<.32?'heavy':r<.5?'kick':r<.65?'special':r<.83?'punch':'uppercut';
 else p.aiAction=r<.18?'grab':r<.31?'sweep':r<.48?'punch':r<.63?'heavy':r<.77?'uppercut':r<.9?'block':'special';}
 let a=p.aiAction;if((a==='advance'||dist>165&&a!=='special')&&Math.abs(p.x-target.x)>68)aiKeys[p.x<target.x?'right':'left']=true;
 if(a==='dash'&&dist>135){aiKeys[p.x<target.x?'right':'left']=true;aiKeys.dash=true}
 if(['block','parry'].includes(a)){if(a==='parry')aiKeys.parry=true;else aiKeys.block=true}
 if(['punch','kick','special','heavy','grab','uppercut','sweep'].includes(a))aiKeys[a]=true;
 if(a==='sweep'||a==='uppercut')aiKeys.block=true;
 if(Math.random()<.004+spec.aggression*.005 && dist>130)aiKeys.jump=true;
 if(danger&&dist<88&&Math.random() <.02*spec.aggression)aiKeys.block=true;
}
function attackStart(p,type){if(p.cooldown>0||p.stun>0||p.action||p.dead||gameMode!=='fight')return;
 const cost={special:35,parry:14}[type]||0;if(p.energy<cost)return;
 const lens={punch:22,kick:30,heavy:41,uppercut:36,sweep:37,grab:38,special:48,parry:23};const len=lens[type]||30;
 p.action=type;p.actionT=0;p.actionLen=len;p.hasHit=false;p.cooldown=len+(type==='heavy'||type==='special'?8:3);p.block=false;
 if(type==='special'||type==='parry'){p.energy-=cost;p.superGlow=type==='parry'?20:40;spawnRing(p.x,GROUND-p.elev-(type==='parry'?175:145),p.f.color,type==='parry'?16:26)}
 if(type==='parry'){p.parryWindow=11;tone(560,.17,'sine',.04)}
 else if(type==='heavy'){tone(115,.15,'sawtooth',.055)}
 else if(type==='grab'){tone(175,.12,'sawtooth',.05)}
 else if(type==='uppercut'){tone(290,.12,'triangle',.045)}
 else if(type==='sweep'){tone(93,.12,'triangle',.046)}
 else tone(type==='punch'?180:type==='kick'?135:340,type==='special'?.24:.085,'triangle',.033)
}
function startDash(p,c){if(p.dashCooldown>0||p.stun>0||p.action||p.block||p.elev>0||p.energy<12||gameMode!=='fight')return;
 p.dashT=11;p.dashCooldown=36;p.invuln=6;p.energy-=12;p.move=c.left?-1:c.right?1:p.dir;
 spawnRing(p.x,GROUND-86,p.f.color,14);spawnSparks(p.x,GROUND-30,p.f.color,14,1.1);tone(110,.12,'triangle',.028);
}
function takeHit(attacker,defender,damage,push,fromSpecial=false){if(defender.dead||gameMode!=='fight'||defender.invuln>0)return;
 let x=(attacker.x+defender.x)/2,y=GROUND-defender.elev-145;
 if(defender.parryWindow>0){defender.parryWindow=0;defender.energy=clamp(defender.energy+20,0,100);attacker.stun=31;attacker.cooldown=37;attacker.action=null;defender.combo=0;
 spawnRing(x,y,'#d4edff',24);spawnSparks(x,y,'#b6f1ff',44,1.5);floatText('PARRY!',x,y-60,'#bafff0');hitStop=8;shake=7;tone(790,.33,'square',.07);return}
 const guarding=defender.block&&defender.elev<22&&isFacing(defender,attacker);let dmg=guarding?Math.max(1,damage*.16):damage;
 if(gameIsCpu()&&attacker===players[1])dmg*=difficultyConfig[challengeDifficulty].damage*(1+Math.min(stage,12)*.025);
 defender.hp=clamp(defender.hp-dmg,0,100);attacker.energy=clamp(attacker.energy+(guarding?4:9),0,100);defender.energy=clamp(defender.energy+(guarding?5:7),0,100);
 defender.stun=guarding?7:fromSpecial?25:16;defender.hitFlash=guarding?5:13;defender.x=clamp(defender.x+attacker.dir*(guarding?push*.22:push),65,W-65);
 if(!guarding){defender.action=null;defender.actionT=0;defender.cooldown=Math.max(defender.cooldown,10)}
 spawnSparks(x,y,guarding?'#a5deff':attacker.f.accent,guarding?14:27,fromSpecial?1.75:1.2);spawnRing(x,y,guarding?'#aee7ff':'#ffbf7c',guarding?12:19);
 if(!guarding){spawnBlood(x+attacker.dir*12,y,attacker.dir,fromSpecial?19:12,fromSpecial?1.6:1);if(Math.random()<.48)depositBlood(defender.x+rand(-20,20),rand(4,11),.2)}
 shake=Math.max(shake,guarding?3:fromSpecial?16:9);flash=Math.max(flash,fromSpecial?.23:.105);hitStop=Math.max(hitStop,guarding?3:fromSpecial?8:5);impactSound(fromSpecial);
 if(guarding){floatText('БЛОК',x,y-60,'#99edff')}else{attacker.combo=(attacker.lastHit>0?attacker.combo:0)+1;attacker.lastHit=100;
 attacker.comboChain=attacker.combo; if(attacker.combo>=2){comboHits=attacker.combo;comboTimer=110;$('combo').textContent=attacker.combo+' HIT COMBO!';$('combo').style.left=attacker===players[0]?'8%':'auto';$('combo').style.right=attacker===players[1]?'8%':'auto';show('combo',true);if(attacker.combo%3===0){spawnRing(x,y,attacker.f.color,38);tone(580,.08,'square',.04)}}
 if(runMode==='training'){trainingBestCombo=Math.max(trainingBestCombo,attacker.combo);updateRunHUD()}
 floatText('-'+Math.round(dmg),defender.x,y-70,'#fff1b3');}
 if(defender.hp<=0){if(runMode==='training'){defender.hp=100;defender.stun=45;spawnRing(defender.x,GROUND-120,'#81ffc4',40);showToast('МАНЕКЕН ВОССТАНОВЛЕН • ПРОДОЛЖАЙ КОМБО',90);return}
 defender.dead=true;spawnBlood(defender.x,GROUND-155,attacker.dir,32,1.8);depositBlood(defender.x,20,.39);triggerFinisher(attacker,defender)}
}
function updateFighter(p,target,c,dt){p.anim+=dt*(.075+Math.abs(p.move)*.078);p.cooldown=Math.max(0,p.cooldown-dt);p.stun=Math.max(0,p.stun-dt);p.hitFlash=Math.max(0,p.hitFlash-dt);p.lastHit=Math.max(0,p.lastHit-dt);p.superGlow=Math.max(0,p.superGlow-dt);p.blink=Math.max(0,p.blink-dt);p.parryWindow=Math.max(0,(p.parryWindow||0)-dt);p.dashCooldown=Math.max(0,(p.dashCooldown||0)-dt);p.invuln=Math.max(0,(p.invuln||0)-dt);
 p.energy=clamp(p.energy+dt*(runMode==='training'?.24:.079),0,100);p.dir=target.x>=p.x?1:-1;
 const attacking=!!(c.punch||c.kick||c.heavy||c.grab||c.special||c.uppercut||c.sweep);
 p.block=!!c.block&&!attacking&&!p.action&&p.elev===0&&p.stun===0;p.crouch=p.block;
 if(p.dashT>0){p.x+=p.move*18*dt;p.dashT-=dt;if(p.dashT<=0){p.dashT=0;p.move=0}}
 if(p.stun<=0&&!p.dead){let m=(c.right?1:0)-(c.left?1:0);
 if(p.dashT<=0){p.move=(p.action&&p.action!=='special')||p.block?0:m;if(p.action==='special'&&p.f.special==='dash')p.move=0;if(p.move)p.x+=p.move*p.f.spd*dt*(p.elev>0?1.18:1)}
 if(c.jump&&!p.wasJump&&p.elev===0&&!p.block&&!p.action&&!p.dashT){p.vy=18.2;p.elev=1;tone(330,.07,'sine',.02)}
 if(c.dash&&!p.wasDash)startDash(p,c);
 if(!p.action&&!p.block&&!p.dashT){if(c.parry&&!p.wasParry)attackStart(p,'parry');else if(c.uppercut)attackStart(p,'uppercut');else if(c.sweep)attackStart(p,'sweep');else if(c.grab&&!p.wasGrab)attackStart(p,'grab');else if(c.heavy)attackStart(p,'heavy');else if(c.punch)attackStart(p,'punch');else if(c.kick)attackStart(p,'kick');else if(c.special)attackStart(p,'special')}
 }else if(p.dashT<=0)p.move=0;
 p.wasJump=!!c.jump;p.wasDash=!!c.dash;p.wasParry=!!c.parry;p.wasGrab=!!c.grab;
 if(p.elev>0||p.vy>0){p.elev+=p.vy*dt;p.vy-=.97*dt;if(p.elev<=0){p.elev=0;p.vy=0;spawnSparks(p.x,GROUND,'#b0a5aa',6,.55)}}
 p.x=clamp(p.x,65,W-65);
 if(p.action){p.actionT+=dt;let t=p.actionT,typ=p.action;
 if(typ==='special'&&t>=12&&!p.hasHit){p.hasHit=true;useSpecial(p,target)}
 const timing={punch:8,kick:12,heavy:15,uppercut:12,sweep:14,grab:11};
 if(timing[typ]&&t>=timing[typ]&&!p.hasHit){p.hasHit=true;
 const reach={punch:119,kick:152,heavy:150,uppercut:118,sweep:163,grab:94}[typ],damage={punch:8.5,kick:13.5,heavy:21,uppercut:16,sweep:11,grab:16.5}[typ],push={punch:25,kick:35,heavy:64,uppercut:22,sweep:49,grab:70}[typ];
 let dist=Math.abs(p.x-target.x);if(dist<=reach&&Math.abs(p.elev-target.elev)<118&&isFacing(p,target)){
 if(typ==='grab')target.block=false;
 takeHit(p,target,damage*p.f.pow/8,push,typ==='heavy'||typ==='uppercut'||typ==='grab');
 if(typ==='uppercut'&&gameMode==='fight'&&!target.block){target.vy=12;target.elev=Math.max(target.elev,13);target.stun=Math.max(target.stun,26);}
 if(typ==='sweep'&&gameMode==='fight'&&!target.block){target.stun=Math.max(target.stun,24);}
 if(typ==='grab'){p.x=clamp(p.x+p.dir*10,65,W-65);spawnRing(target.x,GROUND-130,p.f.accent,32)}
 }}
 if(t>=p.actionLen){p.action=null;p.actionT=0}
 }
}
function update(dt){worldTime+=dt;updateEffects(dt);roundFrame+=dt;if(toasty>0){toasty-=dt;if(toasty<=0)show('toast',false)}
 if(impactTextT>0)impactTextT-=dt;
 if(gameMode==='paused'||gameMode==='select'||gameMode==='result')return;
 if(hitStop>0){hitStop-=dt;return}
 if(gameMode==='intro'){intro-=dt;players.forEach(p=>p.anim+=dt*.06);if(intro<48&&announce.life>46){announce('FIGHT!','НАЧИНАЙ БОЙ',45);tone(115,.38,'sawtooth',.09)}if(intro<=0){gameMode='fight';show('announcement',false)}return}
 if(gameMode==='finisher'){finisherTime-=dt;players.forEach(p=>p.anim+=dt*.045);if(!finished&&finisherWinner===1&&gameIsCpu()&&finisherTime<156)finishNow();if(finisherTime<=0)settleRound(finisherWinner);return}
 if(gameMode!=='fight')return;
 if(gameIsCpu()&&runMode!=='training')aiThink(players[1],players[0],dt);
 const a=getControls(0),b=getControls(1);updateFighter(players[0],players[1],a,dt);
 if(gameMode==='fight')updateFighter(players[1],players[0],b,dt);
 if(gameMode==='fight'){
 let d=players[1].x-players[0].x,minD=83;if(Math.abs(d)<minD){let delta=(minD-Math.abs(d))/2;players[0].x=clamp(players[0].x-Math.sign(d||1)*delta,62,W-62);players[1].x=clamp(players[1].x+Math.sign(d||1)*delta,62,W-62)}
 updateProjectiles(dt);
 if(runMode==='training'){timer=99;for(let p of players){p.hp=Math.min(100,p.hp+dt*.22);p.energy=Math.min(100,p.energy+dt*.12)}}
 else {timer-=dt/60;if(timer<=0){const winner=players[0].hp>=players[1].hp?0:1;gameMode='finisher';finisherWinner=winner;finisherTime=111;finished=true;announce('TIME OVER','ПОБЕДА ПО ОЧКАМ: '+players[winner].f.name,101)}}
 }
 updateHUD();
}
function settleRound(winner){if(runMode==='training'){resetRound();return}
 score[winner]++;tone(395,.3,'triangle',.075);tone(650,.4,'sine',.025);updateHUD();if(score[winner]<2){round++;resetRound();return}
 matchWinner=winner;gameMode='result';show('resultScreen',true);show('announcement',false);show('combo',false);show('toast',false);
 const win=(winner===0),hero=players[0],champ=players[winner];
 if(runMode==='arcade' && win){stage++;safeSet('arcade',Math.max(+safeGet('arcade'),stage));if(stage>=TOTAL_STAGES){tournamentCleared=true;safeSet('wins',+safeGet('wins')+1);$('resultTitle').textContent='♛ ТЫ — ЧЕМПИОН!';$('resultSub').textContent='Весь турнир пройден! Ты победил восьмерых бойцов. '+champ.f.quote;$('againBtn').textContent='↻ НОВЫЙ ТУРНИР';}else{$('resultTitle').textContent='ПОБЕДА!';$('resultSub').textContent='Соперник повержен. Следующая битва: '+fighters[ladderOrder[stage]].name+'.';$('againBtn').textContent='▶ СЛЕДУЮЩИЙ БОЙ';}}
 else if(runMode==='survival'&&win){stage++;survivalCarry=Math.max(32,Math.min(95,hero.hp+15));safeSet('survival',Math.max(+safeGet('survival'),stage));$('resultTitle').textContent='ВОЛНА '+stage+' ПРОЙДЕНА';$('resultSub').textContent='Осталось '+Math.ceil(hero.hp)+' HP. Перед следующей волной восстановится часть здоровья. Продержись как можно дольше!';$('againBtn').textContent='▶ СЛЕДУЮЩАЯ ВОЛНА';}
 else {if(win)safeSet('wins',+safeGet('wins')+1);$('resultTitle').textContent=win?'ПОБЕДА!':'ПОРАЖЕНИЕ';$('resultSub').textContent=champ.f.name+' побеждает со счётом '+score[0]+' : '+score[1]+'. '+champ.f.quote;$('againBtn').textContent='⚔ РЕВАНШ';}
 renderLadder();refreshRecords();
}
function renderLadder(){const el=$('progressPanel');if(!['arcade','survival'].includes(runMode)){el.classList.remove('active');return}el.classList.add('active');let total=runMode==='arcade'?TOTAL_STAGES:Math.max(stage+1,8);$('progressTitle').textContent=runMode==='arcade'?`АРКАДНЫЙ ПУТЬ • ${Math.min(stage,TOTAL_STAGES)}/${TOTAL_STAGES}`:`ВЫЖИВАНИЕ • ВОЛН ПРОЙДЕНО: ${stage}`;
 $('ladder').innerHTML=Array.from({length:Math.min(total,16)},(_,i)=>`<span class="${i<stage?'cleared':i===stage?'now':''}">${i<stage?'✓':i+1}</span>`).join('');}
function startNextFight(){if((runMode==='arcade'||runMode==='survival')&&matchWinner===0&&!tournamentCleared){applyStage();round=1;score=[0,0];resetRound();show('resultScreen',false);show('hud',true);gameMode='intro';updateRunHUD();return}startGame()}
$('againBtn').onclick=startNextFight;
$('matchMode').addEventListener('change',()=>{$('dummyMode').parentElement.style.display=$('matchMode').value==='training'?'flex':'none'});
$('dummyMode').parentElement.style.display='none';
// Mouse combat controls: left button punches, right button guards (player one only).
// Independent state is used so keyboard and touch inputs do not overwrite mouse buttons.
const combatMouse={left:false,right:false};
function clearCombatMouse(){combatMouse.left=false;combatMouse.right=false}
canvas.addEventListener('pointerdown',e=>{
 if(e.pointerType!=='mouse' || !['fight','intro','finisher'].includes(gameMode))return;
 if(e.button===0){combatMouse.left=true;e.preventDefault();if(gameMode==='finisher'&&finisherWinner===0)finishNow()}
 if(e.button===2){combatMouse.right=true;e.preventDefault()}
});
document.addEventListener('pointerup',e=>{
 if(e.pointerType!=='mouse')return;
 if(e.button===0)combatMouse.left=false;
 if(e.button===2)combatMouse.right=false;
});
document.addEventListener('pointercancel',clearCombatMouse);
window.addEventListener('blur',clearCombatMouse);
document.addEventListener('visibilitychange',()=>{if(document.hidden)clearCombatMouse()});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
const overdriveKeys=new Set(['i','u','q','4','5','6','0','t','shift',' ']);
document.addEventListener('keydown',e=>{const key=normalizedKey(e);if(overdriveKeys.has(key))e.preventDefault();if(key==='t'&&runMode==='training'&&gameMode==='fight'){players.forEach(p=>{p.hp=100;p.energy=100;p.stun=0;p.cooldown=0;p.action=null;p.combo=0});trainingBestCombo=0;updateHUD();updateRunHUD();showToast('ТРЕНИРОВКА СБРОШЕНА',75)}});
function presentFrame(){let w=480,h=270;const preset=$('pixelPreset').value;if(preset==='retro'){w=320;h=180}else if(preset==='sharp'){w=960;h=540}
 if(pixelCanvas.width!==w){pixelCanvas.width=w;pixelCanvas.height=h;pixelCtx.imageSmoothingEnabled=false}
 pixelCtx.clearRect(0,0,w,h);pixelCtx.drawImage(renderCanvas,0,0,w,h);screenCtx.clearRect(0,0,W,H);screenCtx.imageSmoothingEnabled=false;screenCtx.drawImage(pixelCanvas,0,0,W,H);
 screenCtx.save();screenCtx.globalAlpha=.12;screenCtx.fillStyle='#000';for(let y=0;y<H;y+=4)screenCtx.fillRect(0,y,W,1);screenCtx.globalAlpha=.028;screenCtx.fillStyle='#ffb56b';screenCtx.fillRect(0,0,W,H);screenCtx.restore()}
function spawnBlood(x,y,dir=1,amount=12,power=1){if(!$('bloodToggle').checked)return;for(let i=0;i<amount;i++){let vx=dir*rand(1.3,7.4)*power+rand(-2.4,2.4),vy=rand(-8,-1.2)*power;bloodDrops.push({x:x+rand(-9,9),y:y+rand(-7,7),vx,vy,life:rand(28,54),max:54,size:rand(1.1,3.9)*power,gravity:rand(.24,.53),color:Math.random()<.23?'#ff5558':Math.random()<.6?'#c9101a':'#70040b'})}if(bloodDrops.length>520)bloodDrops.splice(0,bloodDrops.length-520)}
function depositBlood(x,size=8,alpha=.32){if(!$('bloodToggle').checked)return;bloodPools.push({x:clamp(x,40,W-40),y:GROUND+7,r:size,life:720,max:720,alpha});if(bloodPools.length>50)bloodPools.splice(0,bloodPools.length-50)}
function finishNow(){if(gameMode!=='finisher'||finished)return;finished=true;const a=players[finisherWinner],d=players[1-finisherWinner];a.x=clamp(d.x-a.dir*110,100,1180);d.finisherPose=1;
 spawnRing(d.x,GROUND-145,a.f.color,42);spawnRing(d.x,GROUND-145,'#fff0b0',10);spawnSparks(d.x,GROUND-146,a.f.color,105,2.2);spawnBlood(d.x,GROUND-152,a.dir,70,2.3);for(let i=0;i<5;i++)depositBlood(d.x+rand(-70,70),rand(7,17),.23);shake=23;flash=.55;hitStop=7;d.hitFlash=90;
 const endings=['TOTAL DOMINATION','FINAL STRIKE','BRUTAL FINISH','PERFECT EXECUTION','SHADOW VICTORY','NOVA IMPACT','OUT OF CONTROL','TOTAL KNOCKOUT','CHAOS 67'];
 announce(endings[a.index]||'BRUTAL FINISH','ПОБЕДИТЕЛЬ: '+a.f.name,115);tone(74,.6,'sawtooth',.13);finisherTime=115;
}
function drawNewArena(){let neon=arenaIndex===3;
 const sky=ctx.createLinearGradient(0,0,0,H);if(neon){sky.addColorStop(0,'#08112e');sky.addColorStop(.55,'#351b48');sky.addColorStop(1,'#0f0c1a')}else{sky.addColorStop(0,'#392026');sky.addColorStop(.55,'#77432e');sky.addColorStop(1,'#1c151a')}
 ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);glow(800,170,380,neon?'#b248c842':'#ffb05640');
 if(neon){ // distant neon city / rain
 for(let i=0;i<42;i++){let x=(i*117)%1320,h=80+(i*59)%240,y=567-h;ctx.fillStyle=i%2===0?'#090d27':'#15112b';ctx.fillRect(x-8,y,42+(i%5)*11,h);for(let j=0;j<Math.floor(h/20);j++){if((i*7+j)%4===0){ctx.fillStyle=j%3?'#e060be':'#6acde5';ctx.globalAlpha=.27;ctx.fillRect(x+2,y+6+j*19,7,5)}}ctx.globalAlpha=1}
 drawPoly([[0,340],[125,255],[201,271],[310,208],[408,221],[542,155],[768,167],[885,260],[1050,210],[1190,293],[1280,340],[1280,556],[0,556]],'#130f25aa');
 for(let k=0;k<6;k++){let x=82+k*217;ctx.fillStyle='#13172e';ctx.fillRect(x,272,39,299);ctx.fillStyle=k%2?'#ff4ac7':'#42e8f5';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=19;ctx.fillRect(x-7,275,52,8);ctx.shadowBlur=0;ctx.fillStyle='#141124';ctx.fillRect(x-1,293,42,164);ctx.strokeStyle=k%2?'#ff50c1':'#43cde8';ctx.lineWidth=3;ctx.strokeRect(x+4,315,32,121)}
 for(let i=0;i<95;i++){let x=(i*131+worldTime*2.7)%1320,y=(i*91+worldTime*8)%650;ctx.strokeStyle=i%2?'#bcd7f145':'#f28ad42c';ctx.lineWidth=1.8;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-8,y+25);ctx.stroke()}
 }else{// sand, temple columns and banners
 ctx.fillStyle='#dd955c';ctx.beginPath();ctx.arc(925,170,84,0,Math.PI*2);ctx.fill();glow(925,170,210,'#f9bd654d');drawPoly([[0,420],[140,315],[288,389],[412,267],[591,372],[753,278],[940,374],[1153,300],[1280,408],[1280,590],[0,590]],'#63403a');
 for(let i=0;i<5;i++){let x=72+i*285;ctx.fillStyle='#31242b';ctx.fillRect(x,222,79,362);ctx.fillStyle='#825a45';ctx.fillRect(x-13,207,106,20);ctx.fillRect(x-18,549,115,37);for(let j=0;j<4;j++){ctx.fillStyle=j%2?'#4e3534':'#725041';ctx.fillRect(x+j*18+2,240,7,290)}ctx.fillStyle='#693037';ctx.fillRect(x+26,235,18,162);drawPoly([[x+30,255],[x+84,277],[x+36,352]],'#8c2b35')}
 for(let i=0;i<70;i++){ctx.globalAlpha=.28;ctx.fillStyle='#ffe2a9';let x=(i*293+worldTime*1.2)%1280,y=(i*117+worldTime*.33)%565;ctx.fillRect(x,y,2,2)}ctx.globalAlpha=1
 }
 drawPoly([[0,553],[1280,553],[1280,720],[0,720]],neon?'#202034':'#35262a');ctx.fillStyle=neon?'#71d1db':'#e8bc7f';ctx.globalAlpha=.4;ctx.fillRect(0,559,1280,4);ctx.globalAlpha=1;
 for(let i=0;i<12;i++){ctx.strokeStyle=neon?'#65cee31e':'#f4c89824';ctx.lineWidth=2;let y=565+i*i*1.2;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(1280,y);ctx.stroke()}
 for(let x=-600;x<1850;x+=137){line(640,550,x,720,2,neon?'#e7dfff18':'#ffe6aa22')}
}
function drawFightExtras(){if(!players.length||gameMode==='select')return;
 for(const p of players){if((p.dashT||0)>0){ctx.save();ctx.globalAlpha=.34;ctx.strokeStyle=p.f.accent;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(p.x-p.move*90,GROUND-118);ctx.lineTo(p.x-p.move*35,GROUND-118);ctx.stroke();ctx.restore()}
 if(p.action==='uppercut'){ctx.save();ctx.globalAlpha=.5;ctx.strokeStyle=p.f.accent;ctx.lineWidth=5;ctx.beginPath();ctx.arc(p.x+p.dir*36,GROUND-p.elev-148,54,-2.1,-.25);ctx.stroke();ctx.restore()}
 if(p.action==='sweep'){ctx.save();ctx.globalAlpha=.24;ctx.fillStyle=p.f.accent;ctx.beginPath();ctx.ellipse(p.x+p.dir*64,GROUND-12,82,9,0,0,Math.PI*2);ctx.fill();ctx.restore()}}
 // Stage decorations and combat info are painted in the canvas, under HTML HUD.
 if(runMode==='training'){ctx.save();ctx.font='bold 15px monospace';ctx.fillStyle='#fff0a7';ctx.textAlign='left';ctx.fillText('TRAINING • DUMMY: '+$('dummyMode').value.toUpperCase(),32,651);ctx.restore()}
}
function togglePause(){if(gameMode==='fight'||gameMode==='intro'||gameMode==='finisher'){gameMode='paused';show('pauseScreen',true);show('announcement',false)}else if(gameMode==='paused'){show('pauseScreen',false);gameMode=finisherTime>0?'finisher':intro>0?'intro':'fight';if(gameMode==='intro')announce('РАУНД '+round,'ПРИГОТОВЬСЯ К БОЮ',intro)}}
function updateHUD(){$('p1Name').textContent=players[0]?.f?.name||'БОЕЦ';$('p2Name').textContent=players[1]?.f?.name||'БОЕЦ';$('clock').textContent=runMode==='training'?'∞':Math.max(0,Math.ceil(timer));$('roundNum').textContent=round;
 for(let i=0;i<2;i++){const p=players[i];if(!p)continue;const pre=i===0?'p1':'p2';$(pre+'Life').style.transform=`scaleX(${clamp(p.hp,0,100)/100})`;$(pre+'Lag').style.transform=`scaleX(${clamp(p.hp,0,100)/100})`;$(pre+'Energy').style.width=clamp(p.energy,0,100)+'%';Array.from($(pre+'Pips').children).forEach((n,j)=>n.classList.toggle('on',j<score[i]))}}
// Always cap shake if accessibility setting is disabled.
const originalLoopTime=0;
function loop(ts){let dt=Math.min(2,Math.max(.01,(ts-last)/16.667||1));last=ts;if(!$('shakeToggle').checked)shake=0;update(dt);draw();requestAnimationFrame(loop)}
// Per-character costume paint: the sprites reflect clothing and motifs from
// the reference portraits instead of sharing one generic fighter uniform.
function drawCostumeDetail(p,skin,base){
 const k=p.index;ctx.save();
 if(k===0){ // striped polo
  ctx.fillStyle='#678dad';ctx.fillRect(-32,-178,65,83);ctx.fillStyle='#d1dce8';for(let y=-172;y<-102;y+=14){ctx.fillRect(-32,y,65,5)}
  drawStrokePoly([[-17,-185],[0,-167],[17,-185],[13,-197],[-13,-197]],'#d9e2e9','#253344',2);line(0,-166,0,-125,2,'#e3e1d8')
 }else if(k===1){ctx.fillStyle='#0a0d16';ctx.fillRect(-28,-185,58,88);line(-23,-169,13,-116,5,'#5c5666');line(-11,-154,20,-109,2,'#9690a6')
 }else if(k===2){ctx.fillStyle='#25395c';ctx.fillRect(-29,-182,59,84);drawStrokePoly([[-27,-178],[-9,-180],[1,-137],[-18,-147]],'#456c9d','#12192a',2);drawStrokePoly([[27,-178],[11,-181],[-1,-137],[19,-148]],'#426b9b','#12192a',2);ctx.fillStyle='#30323f';ctx.fillRect(-9,-164,17,63)
 }else if(k===3){ctx.fillStyle='#150c17';ctx.fillRect(-31,-182,60,86);drawStrokePoly([[-31,-172],[-19,-189],[31,-116],[14,-103]],'#9e232c','#310a10',3);line(-27,-157,22,-112,3,'#ee5e60');ctx.fillStyle='#d33b3b';ctx.fillRect(-13,-152,26,9)
 }else if(k===4){ctx.fillStyle='#e5e4dd';ctx.fillRect(-31,-184,61,92);ctx.fillStyle='#357bbc';ctx.fillRect(-31,-107,62,7);ctx.fillStyle='#d7af38';ctx.font='bold 35px serif';ctx.textAlign='center';ctx.fillText('♜',0,-116);ctx.strokeStyle='#e4c06c';ctx.lineWidth=4;ctx.strokeRect(-26,-182,52,80)
 }else if(k===5){ctx.fillStyle='#303b44';ctx.fillRect(-31,-183,62,87);ctx.strokeStyle='#86909c66';ctx.lineWidth=1;for(let y=-178;y<-99;y+=8){ctx.beginPath();ctx.moveTo(-28,y);ctx.lineTo(28,y);ctx.stroke()}
 }else if(k===6){ctx.fillStyle='#25232b';ctx.fillRect(-31,-180,62,82);line(-25,-169,-12,-104,8,'#57505c');line(25,-169,10,-104,8,'#51434f');ctx.fillStyle='#d8c798';ctx.font='24px serif';ctx.textAlign='center';ctx.fillText('✧',0,-120)
 }else if(k===7){ctx.fillStyle='#557b9d';ctx.fillRect(-32,-182,64,85);line(-26,-160,-19,-113,2,'#a9c1d5');line(25,-160,15,-109,2,'#a7c1d5');ctx.fillStyle='#202834';ctx.fillRect(-24,-89,48,13)
 }else if(k===8){ctx.fillStyle='#828381';ctx.fillRect(-31,-181,62,83);line(-20,-184,-11,-136,3,'#bbb4b4');line(20,-184,10,-136,3,'#bbb4b4');ctx.fillStyle='#131012';ctx.font='bold 25px Impact,Arial';ctx.textAlign='center';ctx.fillText('67',0,-127)
 }
 ctx.restore();
}

$('shell').classList.add('selecting');setupRoster();refreshRecords();requestAnimationFrame(loop);
