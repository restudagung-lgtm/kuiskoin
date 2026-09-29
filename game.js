// ══════════════════════════════════════════════
// GAME START
// ══════════════════════════════════════════════
function startGame(){
  if(!cu){toast('Login dulu!','var(--red)');return;}

  if(gameMode==='daily'){
    const today=new Date().toDateString();
    if(cu.lastDailyDate===today){toast('Sudah main challenge harian hari ini!','var(--gold)');return;}
    quiz.questions=getDailyQuestions();
  } else if(gameMode==='survival'){
    const pool=Object.values(QUESTIONS).flat().sort(()=>Math.random()-.5);
    quiz.questions=pool;
  } else if(gameMode==='duel'){
    setupDuel(); return;
  } else {
    quiz.questions=[...QUESTIONS[selectedCat]].sort(()=>Math.random()-.5).slice(0,10);
  }

  if(cu.lives<=0){toast('❌ Nyawa habis! Beli di toko.','var(--red)');openShop();return;}

  quiz.current=0;quiz.score=0;quiz.correct=0;quiz.streak=0;quiz.bestStreak=0;
  quiz.avgTime=[];quiz.answered=false;quiz.survivalCount=0;
  cu.gamesPlayed++;

  // track categories
  if(gameMode==='solo'||gameMode==='daily'){
    if(!cu.categoriesPlayed.includes(selectedCat))cu.categoriesPlayed.push(selectedCat);
  }

  showS('sQuiz'); setupQuizUI(); loadQuestion();
}

function setupQuizUI(){
  const tag=document.getElementById('qModeTag');
  tag.className='q-mode-tag '+gameMode;
  const labels={solo:'SOLO',survival:'SURVIVAL',daily:'HARIAN',duel:'DUEL'};
  tag.textContent=labels[gameMode]||'SOLO';
  document.getElementById('survivalStreak').innerHTML='';
  document.getElementById('duelHeader').innerHTML='';
  document.getElementById('duelTurn').innerHTML='';
}

// ══════════════════════════════════════════════
// DUEL SETUP
// ══════════════════════════════════════════════
function setupDuel(){
  document.getElementById('shopModal').classList.remove('active');
  const modal=document.getElementById('shopModal');
  modal.innerHTML=`
    <div class="modal">
      <h2>⚔️ Setup Duel</h2>
      <p>Masukkan nama kedua pemain!</p>
      <div class="af"><label>Pemain 1 (Kamu)</label><input type="text" id="dp1" placeholder="Nama pemain 1..." maxlength="12" value="${cu.avatar} ${cun}"></div>
      <div class="af"><label>Pilih Avatar P1</label><div id="dp1av" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px"></div></div>
      <div class="af" style="margin-top:12px"><label>Pemain 2</label><input type="text" id="dp2" placeholder="Nama pemain 2..." maxlength="12"></div>
      <div class="af"><label>Pilih Avatar P2</label><div id="dp2av" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px"></div></div>
      <button class="btn-p" style="margin-top:14px" onclick="startDuel()">⚔️ MULAI DUEL</button>
      <button class="btn-close" style="margin-top:8px" onclick="closeDuelSetup()">Batal</button>
    </div>`;
  ['dp1av','dp2av'].forEach((id,pi)=>{
    const wrap=document.getElementById(id);
    AVATARS.forEach((av,i)=>{
      const b=document.createElement('button');
      b.className='av-opt'+(i===(pi===0?0:3)?' selected':''); b.textContent=av; b.type='button';
      b.onclick=()=>{wrap.querySelectorAll('.av-opt').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');};
      wrap.appendChild(b);
    });
  });
  document.getElementById('shopModal').classList.add('active');
}
function closeDuelSetup(){
  document.getElementById('shopModal').classList.remove('active');
  document.getElementById('shopModal').innerHTML=getShopHTML();
}
function startDuel(){
  const n1=document.getElementById('dp1').value.trim()||`${cu.avatar} ${cun}`;
  const n2=document.getElementById('dp2').value.trim()||'Pemain 2';
  const av1=document.querySelector('#dp1av .av-opt.selected')?.textContent||cu.avatar;
  const av2=document.querySelector('#dp2av .av-opt.selected')?.textContent||'🐯';
  duel.p1={name:n1,av:av1,score:0};
  duel.p2={name:n2,av:av2,score:0};
  duel.turn=1; duel.round=0; duel.totalRounds=5;
  document.getElementById('shopModal').classList.remove('active');
  document.getElementById('shopModal').innerHTML=getShopHTML();

  quiz.questions=[...QUESTIONS[selectedCat]].sort(()=>Math.random()-.5);
  quiz.current=0;quiz.score=0;quiz.correct=0;quiz.streak=0;quiz.bestStreak=0;
  quiz.avgTime=[];quiz.answered=false;quiz.survivalCount=0;
  cu.gamesPlayed++;
  showS('sQuiz'); setupQuizUI(); loadDuelTurnUI(); loadQuestion();
}
function loadDuelTurnUI(){
  document.getElementById('duelHeader').innerHTML=`
    <div class="duel-header">
      <div class="duel-player"><span class="av">${duel.p1.av}</span><div class="name">${duel.p1.name}</div><div class="score">${duel.p1.score}</div></div>
      <div class="duel-vs">VS</div>
      <div class="duel-player"><span class="av">${duel.p2.av}</span><div class="name">${duel.p2.name}</div><div class="score">${duel.p2.score}</div></div>
    </div>`;
  const curr=duel.turn===1?duel.p1:duel.p2;
  document.getElementById('duelTurn').innerHTML=`<div class="duel-turn">${curr.av} Giliran: ${curr.name} · Ronde ${duel.round+1}/${duel.totalRounds}</div>`;
}

// ══════════════════════════════════════════════
// QUESTION
// ══════════════════════════════════════════════
function loadQuestion(){
  clearInterval(quiz.timer);
  const q=quiz.questions[quiz.current]; quiz.answered=false;

  if(gameMode==='survival'){
    document.getElementById('survivalStreak').innerHTML=`
      <div class="survival-streak"><div class="num">🔥${quiz.survivalCount}</div><div class="lbl">Jawaban Benar</div></div>`;
    document.getElementById('qCounter').textContent=`Soal #${quiz.current+1}`;
    document.getElementById('progressFill').style.width='0%';
  } else if(gameMode==='duel'){
    loadDuelTurnUI();
    const total=duel.totalRounds*2;
    document.getElementById('qCounter').textContent=`Ronde ${duel.round+1}/${duel.totalRounds}`;
    document.getElementById('progressFill').style.width=`${(duel.round/duel.totalRounds)*100}%`;
  } else {
    document.getElementById('qCounter').textContent=`Soal ${quiz.current+1}/${quiz.questions.length}`;
    document.getElementById('progressFill').style.width=`${(quiz.current/quiz.questions.length)*100}%`;
  }

  document.getElementById('qScore').textContent=`🪙 ${quiz.score}`;
  document.getElementById('qCat').textContent=(q.cat||selectedCat||gameMode).toUpperCase();
  document.getElementById('qText').textContent=q.q;

  const opts=document.getElementById('optsCont'); opts.innerHTML='';
  q.opts.forEach((opt,i)=>{
    const b=document.createElement('button'); b.className='option'; b.textContent=opt;
    b.onclick=()=>answer(i); opts.appendChild(b);
  });

  quiz.timeLeft=15+(cu.extraTime||0); cu.extraTime=0;
  updateTimer(quiz.timeLeft,quiz.timeLeft);
  quiz.timer=setInterval(()=>{
    quiz.timeLeft--; updateTimer(quiz.timeLeft,15);
    if(quiz.timeLeft<=0){clearInterval(quiz.timer);timeUp();}
  },1000);
}

function updateTimer(t,max){
  document.getElementById('timerN').textContent=t;
  const c=document.getElementById('timerC');
  c.style.strokeDashoffset=126*(1-t/max);
  c.style.stroke=t>8?'var(--accent)':t>4?'var(--gold)':'var(--red)';
}

function timeUp(){
  if(quiz.answered)return;
  quiz.answered=true; quiz.streak=0;
  showCorrect(); toast('⏰ Waktu habis!','var(--red)');
  if(gameMode==='survival'){setTimeout(()=>endSurvival(),1500);return;}
  setTimeout(nextQuestion,1700);
}

function answer(idx){
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
    if(gameMode==='duel'){
      const curr=duel.turn===1?duel.p1:duel.p2; curr.score+=earned;
    }
    toast(bonus?`🔥 Streak! +${earned}🪙`:`✅ Benar! +${earned}🪙`,'var(--green)');
  } else {
    opts[idx].classList.add('wrong'); quiz.streak=0;
    toast('❌ Salah!','var(--red)'); showCorrect();
    if(gameMode==='survival'){setTimeout(()=>endSurvival(),1500);return;}
  }

  document.getElementById('qScore').textContent=`🪙 ${quiz.score}`;
  setTimeout(nextQuestion,1600);
}

function showCorrect(){
  const q=quiz.questions[quiz.current];
  const opts=document.querySelectorAll('.option');
  if(opts[q.ans])opts[q.ans].classList.add('correct');
}

function nextQuestion(){
  if(gameMode==='duel'){
    // swap turn
    duel.turn=duel.turn===1?2:1;
    if(duel.turn===1)duel.round++;
    if(duel.round>=duel.totalRounds){endDuel();return;}
    quiz.current++; quiz.answered=false;
    if(quiz.current>=quiz.questions.length) quiz.current=0;
    loadQuestion(); return;
  }
  quiz.current++;
  const maxQ=gameMode==='survival'?quiz.questions.length:quiz.questions.length;
  if(gameMode!=='survival'&&quiz.current>=quiz.questions.length){endGame();return;}
  if(gameMode==='survival'&&quiz.current>=quiz.questions.length){quiz.current=0;}
  loadQuestion();
}

function endSurvival(){
  clearInterval(quiz.timer);
  const best=quiz.survivalCount;
  cu.bestSurvival=Math.max(cu.bestSurvival||0,best);
  const earned=best*8;
  cu.coins+=earned; cu.totalCoinsEarned+=earned;
  cu.gamesPlayed++;
  if(cu.lives>0)cu.lives=Math.max(0,cu.lives-1);
  renderLives(); renderCoins();

  checkBadges(); checkTrophies();
  cu.history=cu.history||[];
  cu.history.unshift({category:'Survival',score:earned,correct:best,total:'∞',date:new Date().toLocaleDateString('id')});
  cu.history=cu.history.slice(0,20); saveCU();

  document.getElementById('rEmoji').textContent='💀';
  document.getElementById('rTitle').textContent=`Survival: ${best} Soal!`;
  document.getElementById('rSub').textContent='Bertahan selama mungkin adalah kuncinya!';
  document.getElementById('rCorrect').textContent=best;
  document.getElementById('rScore').textContent=earned;
  document.getElementById('rCoins').textContent=`+${earned}`;
  renderResultBadges();
  showS('sResult');
  const newT=ALL_TROPHIES.filter(t=>cu.trophies.includes(t.id)&&!cu.claimedTrophies.includes(t.id));
  if(newT.length)setTimeout(()=>toast('🏅 Trophy baru! Klaim di tab Trophy','var(--gold)'),800);
}

function endDuel(){
  clearInterval(quiz.timer);
  const winner=duel.p1.score>duel.p2.score?duel.p1:duel.p2.score>duel.p1.score?duel.p2:null;
  if(winner&&winner.name.includes(cun)){cu.duelWins=(cu.duelWins||0)+1;}
  cu.coins+=quiz.score; cu.totalCoinsEarned+=quiz.score;
  checkBadges(); checkTrophies(); saveCU();
  renderCoins();

  const isDraw=!winner;
  document.getElementById('rEmoji').textContent=isDraw?'🤝':winner.av;
  document.getElementById('rTitle').textContent=isDraw?'Seri!':winner.name+' Menang!';
  document.getElementById('rSub').textContent=`${duel.p1.name}: ${duel.p1.score} vs ${duel.p2.name}: ${duel.p2.score}`;
  document.getElementById('rCorrect').textContent=duel.p1.score;
  document.getElementById('rScore').textContent=duel.p2.score;
  document.getElementById('rCoins').textContent=`+${quiz.score}`;
  renderResultBadges();
  showS('sResult');
}

// ══════════════════════════════════════════════
// END GAME (solo/daily)
// ══════════════════════════════════════════════
function endGame(){
  clearInterval(quiz.timer);
  const earned=quiz.score;
  cu.coins+=earned; cu.totalCoinsEarned+=earned;
  cu.totalScore=(cu.totalScore||0)+quiz.score;
  cu.bestScore=Math.max(cu.bestScore||0,quiz.score);
  cu.bestStreak=Math.max(cu.bestStreak||0,quiz.bestStreak);
  if(quiz.correct===quiz.questions.length)cu.perfectCount=(cu.perfectCount||0)+1;
  if(quiz.correct<3)cu.lives=Math.max(0,cu.lives-1);

  if(gameMode==='daily'){
    cu.lastDailyDate=new Date().toDateString();
    cu.dailyPlayed=(cu.dailyPlayed||0)+1;
    cu.dailyStreak=(cu.dailyStreak||0)+1;
    cu.coins+=50; cu.totalCoinsEarned+=50; // daily bonus
    toast('📅 +50 bonus koin harian!','var(--gold)');
  }

  renderLives(); renderCoins();
  checkBadges(); checkTrophies();

  cu.history=cu.history||[];
  cu.history.unshift({category:gameMode==='daily'?'Daily':selectedCat,score:quiz.score,correct:quiz.correct,total:quiz.questions.length,date:new Date().toLocaleDateString('id')});
  cu.history=cu.history.slice(0,20); saveCU();

  const pct=quiz.correct/quiz.questions.length;
  let emoji='💀',title='Coba Lagi!',sub='Terus berlatih ya!';
  if(pct===1){emoji='🏆';title='SEMPURNA!';sub='Kamu luar biasa!';}
  else if(pct>=.8){emoji='🎉';title='Hebat!';sub='Hampir sempurna!';}
  else if(pct>=.6){emoji='😊';title='Bagus!';sub='Terus tingkatkan!';}
  else if(pct>=.4){emoji='😅';title='Lumayan';sub='Masih bisa lebih baik!';}

  document.getElementById('rEmoji').textContent=emoji;
  document.getElementById('rTitle').textContent=title;
  document.getElementById('rSub').textContent=sub+(gameMode==='daily'?' · +50🪙 Bonus Harian!':'');
  document.getElementById('rCorrect').textContent=`${quiz.correct}/${quiz.questions.length}`;
  document.getElementById('rScore').textContent=quiz.score;
  document.getElementById('rCoins').textContent=`+${earned}`;
  renderResultBadges();
  showS('sResult');

  if(gameMode==='daily')renderDailyBanner();
  const newT=cu.trophies.filter(id=>!cu.claimedTrophies.includes(id));
  if(newT.length)setTimeout(()=>toast('🏅 Trophy baru! Klaim di tab Trophy','var(--gold)'),1000);
}

// ══════════════════════════════════════════════
// BADGES & TROPHIES
// ══════════════════════════════════════════════
function checkBadges(){
  const chk=(id,cond)=>{if(cond&&!cu.badges.includes(id))cu.badges.push(id);};
  chk('first',cu.gamesPlayed>=1);
  chk('perfect',quiz.correct===quiz.questions?.length&&gameMode!=='survival');
  chk('fast',quiz.avgTime?.length&&quiz.avgTime.reduce((a,b)=>a+b,0)/quiz.avgTime.length<5);
  chk('rich',cu.coins>=500);
  chk('streak3',quiz.streak>=3||quiz.bestStreak>=3);
  chk('veteran',cu.gamesPlayed>=5);
  chk('survivor',cu.bestSurvival>=10);
  chk('duelist',cu.duelWins>=1);
  chk('daily7',cu.dailyStreak>=7);
}
function checkTrophies(){
  if(!cu)return;
  ALL_TROPHIES.forEach(t=>{
    if(cu.trophies.includes(t.id))return;
    const val=t.stat==='categoriesPlayed'?(cu.categoriesPlayed?.length||0):(cu[t.stat]||0);
    if(val>=t.target)cu.trophies.push(t.id);
  });
  saveCU();
}
function renderResultBadges(){
  const bg=document.getElementById('rBadges'); bg.innerHTML='';
  ALL_BADGES.forEach(b=>{
    const el=document.createElement('div');
    el.className='badge'+(cu.badges.includes(b.id)?' earned':' locked');
    el.innerHTML=`${b.icon} ${b.name}`; bg.appendChild(el);
  });
}
