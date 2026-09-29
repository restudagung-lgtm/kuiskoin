// ══════════════════════════════════════════════
// LEADERBOARD
// ══════════════════════════════════════════════
function renderLB(){
  const db=getDB();
  const entries=Object.entries(db).map(([u,acc])=>({
    name:u,avatar:acc.avatar||'🦊',
    bestScore:acc.bestScore||0,gamesPlayed:acc.gamesPlayed||0,
    trophyCount:(acc.claimedTrophies||[]).length,
    bestSurvival:acc.bestSurvival||0,
  })).sort((a,b)=>b.bestScore-a.bestScore);
  const list=document.getElementById('lbList'); list.innerHTML='';
  if(!entries.length){list.innerHTML='<div style="color:var(--muted);text-align:center;padding:30px">Belum ada pemain</div>';return;}
  entries.forEach((e,i)=>{
    const isMe=e.name===cun;
    const el=document.createElement('div'); el.className='lb-item'+(isMe?' me':'');
    const rc=i===0?'gold':i===1?'silver':i===2?'bronze':'';
    const medal=i===0?'🥇':i===1?'🥈':i===2?'🥉':'';
    el.innerHTML=`
      <div class="lb-rank ${rc}">${medal||i+1}</div>
      <div style="font-size:17px">${e.avatar}</div>
      <div class="lb-name">${e.name}${isMe?' (Kamu)':''}<div style="font-size:9px;color:var(--muted)">🏅${e.trophyCount} · 💀${e.bestSurvival}</div></div>
      <div><div class="lb-score">${e.bestScore}</div><div class="lb-coins">${e.gamesPlayed} game</div></div>`;
    list.appendChild(el);
  });
}

// ══════════════════════════════════════════════
// PROFILE
// ══════════════════════════════════════════════
function renderProfile(){
  if(!cu)return;
  const tm=THEMES.find(t=>t.id===cu.activeTheme)?.name||'Default';
  document.getElementById('profHeader').innerHTML=`
    <div class="profile-av">${cu.avatar}</div>
    <div class="profile-info">
      <h2>${cun}</h2>
      <div class="since">Bergabung: ${cu.joinDate}</div>
      <div style="margin-top:4px;font-size:11px;color:var(--accent)">🪙 ${cu.coins} · ❤️ ${cu.lives} · 🎨 ${tm}</div>
    </div>`;
  document.getElementById('profStats').innerHTML=`
    <div class="p-stat"><div class="val">${cu.gamesPlayed}</div><div class="lbl">Game Main</div></div>
    <div class="p-stat"><div class="val">${cu.bestScore||0}</div><div class="lbl">Skor Terbaik</div></div>
    <div class="p-stat"><div class="val">${cu.bestSurvival||0}</div><div class="lbl">Survival Terbaik</div></div>
    <div class="p-stat"><div class="val">${cu.duelWins||0}</div><div class="lbl">Duel Menang</div></div>
    <div class="p-stat"><div class="val">${cu.dailyStreak||0}</div><div class="lbl">Daily Streak</div></div>
    <div class="p-stat"><div class="val">${cu.claimedTrophies?.length||0}</div><div class="lbl">Trophy</div></div>`;
  const bg=document.getElementById('profBadges'); bg.innerHTML='';
  ALL_BADGES.forEach(b=>{
    const el=document.createElement('div');
    el.className='badge'+(cu.badges.includes(b.id)?' earned':' locked');
    el.innerHTML=`${b.icon} ${b.name}`; bg.appendChild(el);
  });
  const hl=document.getElementById('profHistory'); hl.innerHTML='';
  const hist=cu.history||[];
  if(!hist.length){hl.innerHTML='<div style="color:var(--muted);font-size:12px;padding:6px 0">Belum ada riwayat</div>';return;}
  hist.slice(0,10).forEach(h=>{
    const el=document.createElement('div'); el.className='history-item';
    el.innerHTML=`<div><div class="h-cat">${typeof h.category==='string'?h.category.toUpperCase():h.category}</div><div style="font-size:11px;margin-top:1px">${h.correct}/${h.total} benar</div><div class="h-date">${h.date}</div></div><div class="h-score">+${h.score}🪙</div>`;
    hl.appendChild(el);
  });
}

// ══════════════════════════════════════════════
// STATISTIK PER KATEGORI
// ══════════════════════════════════════════════
function renderCatStats(){
  const wrap=document.getElementById('catStats');
  if(!wrap)return;
  const cs=cu.catStats||{};
  const played=CATEGORIES.filter(c=>cs[c.id]&&cs[c.id].played>0);

  if(!played.length){
    wrap.innerHTML=`<div class="cat-stat-empty">Belum ada data. Main dulu di berbagai kategori!</div>`;
    return;
  }

  wrap.innerHTML=`<div class="cat-stat-list" id="catStatList"></div>`;
  const list=document.getElementById('catStatList');

  played.forEach(cat=>{
    const d=cs[cat.id];
    const acc=d.played>0?Math.round((d.correct/d.totalQ)*100):0;
    const avgScore=d.played>0?Math.round(d.totalScore/d.played):0;
    const bestScore=d.bestScore||0;

    const item=document.createElement('div');
    item.className='cat-stat-item';
    item.innerHTML=`
      <div class="cat-stat-top">
        <div class="cat-stat-name">${cat.icon} ${cat.name}</div>
        <div class="cat-stat-played">${d.played}× main</div>
      </div>
      <div class="cat-stat-bars">
        <div class="cat-bar-row">
          <div class="cat-bar-lbl">Akurasi</div>
          <div class="cat-bar-wrap"><div class="cat-bar-fill" style="width:${acc}%;background:${acc>=80?'var(--green)':acc>=50?'var(--gold)':'var(--red)'}"></div></div>
          <div class="cat-bar-val" style="color:${acc>=80?'var(--green)':acc>=50?'var(--gold)':'var(--red)'}">${acc}%</div>
        </div>
        <div class="cat-bar-row">
          <div class="cat-bar-lbl">Rata Skor</div>
          <div class="cat-bar-wrap"><div class="cat-bar-fill" style="width:${Math.min(avgScore/5,100)}%;background:var(--blue)"></div></div>
          <div class="cat-bar-val" style="color:var(--blue)">${avgScore}</div>
        </div>
        <div class="cat-bar-row">
          <div class="cat-bar-lbl">Best</div>
          <div class="cat-bar-wrap"><div class="cat-bar-fill" style="width:${Math.min(bestScore/5,100)}%;background:var(--gold)"></div></div>
          <div class="cat-bar-val" style="color:var(--gold)">${bestScore}</div>
        </div>
      </div>`;
    list.appendChild(item);
  });
}

// Track category stats during game
function updateCatStats(category, correct, totalQ, score){
  if(!cu.catStats)cu.catStats={};
  if(!cu.catStats[category])cu.catStats[category]={played:0,correct:0,totalQ:0,totalScore:0,bestScore:0};
  const d=cu.catStats[category];
  d.played++;
  d.correct+=correct;
  d.totalQ+=totalQ;
  d.totalScore+=score;
  d.bestScore=Math.max(d.bestScore,score);
}
