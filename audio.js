// ══════════════════════════════════════════════
// WEB AUDIO ENGINE
// ══════════════════════════════════════════════
let audioCtx=null;
let soundEnabled=true;

function getAudioCtx(){
  if(!audioCtx){
    try{ audioCtx=new(window.AudioContext||window.webkitAudioContext)(); }catch(e){}
  }
  return audioCtx;
}

function playSound(type){
  if(!soundEnabled)return;
  const ctx=getAudioCtx();
  if(!ctx)return;

  // Resume context if suspended (browser autoplay policy)
  if(ctx.state==='suspended')ctx.resume();

  const now=ctx.currentTime;

  const sounds={
    correct:()=>{
      // Happy ascending ding
      [523,659,784].forEach((freq,i)=>{
        const o=ctx.createOscillator();
        const g=ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type='sine'; o.frequency.value=freq;
        g.gain.setValueAtTime(0,now+i*0.1);
        g.gain.linearRampToValueAtTime(0.18,now+i*0.1+0.02);
        g.gain.exponentialRampToValueAtTime(0.001,now+i*0.1+0.25);
        o.start(now+i*0.1); o.stop(now+i*0.1+0.3);
      });
    },
    wrong:()=>{
      // Low buzzer
      const o=ctx.createOscillator();
      const g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type='sawtooth'; o.frequency.setValueAtTime(220,now);
      o.frequency.exponentialRampToValueAtTime(110,now+0.3);
      g.gain.setValueAtTime(0.15,now);
      g.gain.exponentialRampToValueAtTime(0.001,now+0.35);
      o.start(now); o.stop(now+0.4);
    },
    timeout:()=>{
      // Ticking + buzz
      [0,0.1,0.2].forEach(t=>{
        const o=ctx.createOscillator();
        const g=ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type='square'; o.frequency.value=880;
        g.gain.setValueAtTime(0.08,now+t);
        g.gain.exponentialRampToValueAtTime(0.001,now+t+0.08);
        o.start(now+t); o.stop(now+t+0.1);
      });
    },
    coin:()=>{
      // Coin pickup sound
      [1047,1319,1568,2093].forEach((freq,i)=>{
        const o=ctx.createOscillator();
        const g=ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type='sine'; o.frequency.value=freq;
        g.gain.setValueAtTime(0,now+i*0.06);
        g.gain.linearRampToValueAtTime(0.12,now+i*0.06+0.01);
        g.gain.exponentialRampToValueAtTime(0.001,now+i*0.06+0.15);
        o.start(now+i*0.06); o.stop(now+i*0.06+0.2);
      });
    },
    streak:()=>{
      // Excited ascending fanfare
      [523,659,784,1047].forEach((freq,i)=>{
        const o=ctx.createOscillator();
        const g=ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type='triangle'; o.frequency.value=freq;
        g.gain.setValueAtTime(0,now+i*0.08);
        g.gain.linearRampToValueAtTime(0.2,now+i*0.08+0.03);
        g.gain.exponentialRampToValueAtTime(0.001,now+i*0.08+0.2);
        o.start(now+i*0.08); o.stop(now+i*0.08+0.25);
      });
    },
    levelup:()=>{
      // Victory fanfare
      [[523,659],[659,784],[784,1047],[1047,1319]].forEach(([f1,f2],i)=>{
        [f1,f2].forEach(freq=>{
          const o=ctx.createOscillator();
          const g=ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.type='sine'; o.frequency.value=freq;
          g.gain.setValueAtTime(0,now+i*0.12);
          g.gain.linearRampToValueAtTime(0.12,now+i*0.12+0.03);
          g.gain.exponentialRampToValueAtTime(0.001,now+i*0.12+0.3);
          o.start(now+i*0.12); o.stop(now+i*0.12+0.35);
        });
      });
    },
    click:()=>{
      // Soft UI click
      const o=ctx.createOscillator();
      const g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type='sine'; o.frequency.setValueAtTime(600,now);
      o.frequency.exponentialRampToValueAtTime(400,now+0.05);
      g.gain.setValueAtTime(0.1,now);
      g.gain.exponentialRampToValueAtTime(0.001,now+0.08);
      o.start(now); o.stop(now+0.1);
    },
    chest:()=>{
      // Magical chest open
      [392,523,659,784,1047].forEach((freq,i)=>{
        const o=ctx.createOscillator();
        const g=ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type='sine'; o.frequency.setValueAtTime(freq,now+i*0.08);
        o.frequency.exponentialRampToValueAtTime(freq*1.5,now+i*0.08+0.15);
        g.gain.setValueAtTime(0,now+i*0.08);
        g.gain.linearRampToValueAtTime(0.15,now+i*0.08+0.04);
        g.gain.exponentialRampToValueAtTime(0.001,now+i*0.08+0.2);
        o.start(now+i*0.08); o.stop(now+i*0.08+0.25);
      });
    },
    trophy:()=>{
      // Trophy earned fanfare
      const melody=[523,659,784,659,784,1047];
      melody.forEach((freq,i)=>{
        const o=ctx.createOscillator();
        const g=ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.type='triangle'; o.frequency.value=freq;
        g.gain.setValueAtTime(0,now+i*0.1);
        g.gain.linearRampToValueAtTime(0.15,now+i*0.1+0.03);
        g.gain.exponentialRampToValueAtTime(0.001,now+i*0.1+0.22);
        o.start(now+i*0.1); o.stop(now+i*0.1+0.25);
      });
    },
    tick:()=>{
      // Timer tick warning
      const o=ctx.createOscillator();
      const g=ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.type='square'; o.frequency.value=440;
      g.gain.setValueAtTime(0.06,now);
      g.gain.exponentialRampToValueAtTime(0.001,now+0.05);
      o.start(now); o.stop(now+0.06);
    },
  };

  try{ sounds[type]&&sounds[type](); }catch(e){}
}

function toggleSound(){
  soundEnabled=!soundEnabled;
  const btn=document.getElementById('btnSound');
  if(btn)btn.textContent=soundEnabled?'🔊 Suara: ON':'🔇 Suara: OFF';
  if(soundEnabled)playSound('click');
  if(cu){cu.soundEnabled=soundEnabled;saveCU();}
}

// ══════════════════════════════════════════════
// PATCH renderProfile to include catStats
// ══════════════════════════════════════════════
var _origRenderProfile=renderProfile;
renderProfile=function(){
  _origRenderProfile();
  renderCatStats();
  // sync sound button
  const btn=document.getElementById('btnSound');
  if(btn)btn.textContent=soundEnabled?'🔊 Suara: ON':'🔇 Suara: OFF';
};

// ══════════════════════════════════════════════
// PATCH answer() to play sounds
// ══════════════════════════════════════════════
var _origAnswer=answer;
answer=function(idx){
  // We need to intercept — call original but also play sound
  // Since original is complex, we hook via monkey-patching the option click
  // Instead we override here fully:
  if(quiz.answered)return;
  quiz.answered=true; clearInterval(quiz.timer);
  const elapsed=15-quiz.timeLeft; quiz.avgTime.push(elapsed);
  const q=quiz.questions[quiz.current];
  const opts=document.querySelectorAll('.option'); opts.forEach(b=>b.disabled=true);

  if(idx===q.ans){
    opts[idx].classList.add('correct'); quiz.correct++; quiz.streak++; quiz.survivalCount++;
    quiz.bestStreak=Math.max(quiz.bestStreak,quiz.streak);
    const bonus=quiz.streak>=3?20:0;
    const earned=10+bonus+Math.max(0,10-elapsed);
    quiz.score+=earned;
    if(gameMode==='duel'){const curr=duel.turn===1?duel.p1:duel.p2;curr.score+=earned;}
    // SOUND
    if(quiz.streak>=3)playSound('streak');
    else playSound('correct');
    toast(bonus?`🔥 Streak! +${earned}🪙`:`✅ Benar! +${earned}🪙`,'var(--green)');
  } else {
    opts[idx].classList.add('wrong'); quiz.streak=0;
    playSound('wrong');
    toast('❌ Salah!','var(--red)'); showCorrect();
    if(gameMode==='survival'){setTimeout(()=>endSurvival(),1500);return;}
  }
  document.getElementById('qScore').textContent=`🪙 ${quiz.score}`;
  setTimeout(nextQuestion,1600);
};

// Patch timeUp for sound
var _origTimeUp=timeUp;
timeUp=function(){
  if(quiz.answered)return;
  playSound('timeout');
  quiz.answered=true; quiz.streak=0;
  showCorrect(); toast('⏰ Waktu habis!','var(--red)');
  if(gameMode==='survival'){setTimeout(()=>endSurvival(),1500);return;}
  setTimeout(nextQuestion,1700);
};

// Patch endGame for victory sound
var _origEndGame=endGame;
endGame=function(){
  _origEndGame();
  const pct=(quiz.correct||0)/(quiz.questions?.length||10);
  if(pct===1)playSound('levelup');
  else playSound('coin');
  // update category stats
  if(gameMode==='solo'||gameMode==='daily'){
    updateCatStats(selectedCat, quiz.correct, quiz.questions.length, quiz.score);
    saveCU();
  }
};

// Patch claimTrophy for trophy sound
var _origClaimTrophy=claimTrophy;
claimTrophy=function(id){
  _origClaimTrophy(id);
  playSound('trophy');
};

// Patch openChest for chest sound
var _origOpenChest=openChest;
openChest=function(){
  playSound('chest');
  _origOpenChest();
};

// Play click sound on nav buttons
document.querySelectorAll('.bnav-btn,.btn-p,.btn-s,.mode-btn,.cat-btn').forEach(b=>{
  b.addEventListener('click',()=>playSound('click'),{passive:true});
});

// Timer tick warning (hook into updateTimer)
var _origUpdateTimer=updateTimer;
updateTimer=function(t,max){
  _origUpdateTimer(t,max);
  if(t<=5&&t>0&&!quiz.answered)playSound('tick');
};

// Load sound preference
(function(){
  const sess=getSess();
  if(sess){const acc=getAcc(sess);if(acc&&acc.soundEnabled===false){soundEnabled=false;}}
})();
