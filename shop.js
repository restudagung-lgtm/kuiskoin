// ══════════════════════════════════════════════
// LIFELINES & SHOP
// ══════════════════════════════════════════════
function useSkip(){
  if(quiz.answered)return;
  if(cu.coins<50){toast('🪙 Koin tidak cukup!','var(--red)');return;}
  cu.coins-=50; renderCoins(); saveCU();
  clearInterval(quiz.timer); quiz.answered=true; quiz.streak=0;
  toast('⏭ Soal dilewati','var(--muted)'); showCorrect();
  setTimeout(nextQuestion,1200);
}

function getShopHTML(){return `<h2>🛒 Toko Koin</h2><p>Tukar koin untuk power-up!</p><div class="shop-items"><div class="shop-item"><div class="shop-item-info"><span class="shop-item-icon">❤️</span><div><div class="shop-item-name">Tambah Nyawa</div><div class="shop-item-desc">+1 nyawa ekstra</div></div></div><button class="btn-buy" onclick="buyItem('life')">80🪙</button></div><div class="shop-item"><div class="shop-item-info"><span class="shop-item-icon">⚡</span><div><div class="shop-item-name">+10 Detik</div><div class="shop-item-desc">Soal berikutnya</div></div></div><button class="btn-buy" onclick="buyItem('time')">40🪙</button></div><div class="shop-item"><div class="shop-item-info"><span class="shop-item-icon">🔍</span><div><div class="shop-item-name">50/50</div><div class="shop-item-desc">Hapus 2 jawaban salah</div></div></div><button class="btn-buy" onclick="buyItem('5050')">60🪙</button></div></div><button class="btn-close" onclick="closeShop()">Tutup</button>`;}

function openShop(){
  document.getElementById('shopModal').innerHTML=getShopHTML();
  document.getElementById('shopModal').classList.add('active');
}
function closeShop(){document.getElementById('shopModal').classList.remove('active');}
function buyItem(type){
  const prices={life:80,time:40,'5050':60};
  if(cu.coins<prices[type]){toast('🪙 Koin tidak cukup!','var(--red)');return;}
  cu.coins-=prices[type];
  if(type==='life'){cu.lives=Math.min(cu.lives+1,cu.maxLives);renderLives();toast('❤️ Nyawa bertambah!','var(--red)');}
  else if(type==='time'){cu.extraTime=(cu.extraTime||0)+10;toast('⚡ Waktu +10 detik!','var(--gold)');}
  else{apply5050();toast('🔍 2 jawaban dihapus!','var(--blue)');}
  renderCoins(); saveCU();
}
function apply5050(){
  if(quiz.answered)return;
  const q=quiz.questions[quiz.current];
  const opts=document.querySelectorAll('.option'); let rm=0;
  [0,1,2,3].filter(i=>i!==q.ans).sort(()=>Math.random()-.5).forEach(i=>{if(rm<2){opts[i].disabled=true;opts[i].style.opacity='.18';rm++;}});
}

// ══════════════════════════════════════════════
// TROPHY
// ══════════════════════════════════════════════
function renderTrophies(){
  const list=document.getElementById('trophyList'); list.innerHTML='';
  ALL_TROPHIES.forEach(t=>{
    const unlocked=cu.trophies.includes(t.id);
    const claimed=cu.claimedTrophies.includes(t.id);
    const val=Math.min(t.stat==='categoriesPlayed'?(cu.categoriesPlayed?.length||0):(cu[t.stat]||0),t.target);
    const pct=Math.round((val/t.target)*100);
    const item=document.createElement('div');
    item.className='trophy-item'+(claimed?' claimed':unlocked?' unlocked':'');
    let action=claimed?`<span class="claimed-badge">✅ Diklaim</span>`:unlocked?`<button class="btn-claim" onclick="claimTrophy('${t.id}')">+${t.reward}🪙</button>`:`<span class="locked-badge">🔒 ${pct}%</span>`;
    const themeInfo=t.themeUnlock?`<div style="font-size:10px;color:var(--accent);margin-top:2px">🎨 Unlock: ${THEMES.find(x=>x.id===t.themeUnlock)?.name}</div>`:'';
    item.innerHTML=`
      <div class="trophy-icon-wrap">${t.icon}</div>
      <div class="trophy-info">
        <div class="trophy-name">${t.name}</div>
        <div class="trophy-desc">${t.desc}</div>
        ${themeInfo}
        <div class="trophy-prog"><div class="trophy-prog-fill" style="width:${pct}%"></div></div>
        <div class="trophy-prog-text">${val} / ${t.target}</div>
      </div>
      ${action}`;
    list.appendChild(item);
  });
}
function claimTrophy(id){
  const t=ALL_TROPHIES.find(x=>x.id===id);
  if(!t||cu.claimedTrophies.includes(id))return;
  cu.claimedTrophies.push(id); cu.coins+=t.reward; cu.totalCoinsEarned+=t.reward;
  saveCU(); renderCoins();
  document.getElementById('tpIcon').textContent=t.icon;
  document.getElementById('tpTitle').textContent=t.name;
  document.getElementById('tpSub').textContent=t.desc+(t.themeUnlock?' · 🎨 Tema baru terbuka!':'');
  document.getElementById('tpReward').textContent=`+${t.reward} 🪙`+(t.themeUnlock?' · Beli tema sekarang!':'');
  document.getElementById('trophyPopup').classList.add('show');
  setTimeout(()=>renderTrophies(),100);
}
function closeTrophyPopup(){document.getElementById('trophyPopup').classList.remove('show');}

// ══════════════════════════════════════════════
// THEME
// ══════════════════════════════════════════════
function renderThemes(){
  const grid=document.getElementById('themeGrid'); grid.innerHTML='';
  THEMES.forEach(th=>{
    const owned=cu.unlockedThemes.includes(th.id);
    const active=cu.activeTheme===th.id;
    const tn=th.lock?ALL_TROPHIES.find(t=>t.id===th.lock):null;
    const tDone=!tn||cu.claimedTrophies.includes(th.lock);
    const card=document.createElement('div');
    card.className='theme-card'+(active?' active-theme':'');
    const dots=th.colors.map(c=>`<div class="theme-dot" style="background:${c}"></div>`).join('');
    let act='';
    if(active)act=`<div class="theme-active-badge">AKTIF</div>`;
    else if(owned)act=`<button class="btn-p" style="padding:7px;font-size:11px;margin-top:7px" onclick="setTheme('${th.id}')">Pakai</button>`;
    else if(!tDone)act=`<div class="theme-lock-icon">🔒</div><div style="font-size:9px;color:var(--muted);margin-top:7px">Trophy: ${tn?.name}</div>`;
    else act=`<button class="btn-buy" style="margin-top:7px;width:100%;padding:7px" onclick="buyTheme('${th.id}',${th.cost})">${th.cost}🪙</button>`;
    card.innerHTML=`<div class="theme-preview" style="background:${th.colors[0]}">${dots}</div><div class="theme-name">${th.name}</div><div class="theme-cost">${th.desc}</div>${act}`;
    grid.appendChild(card);
  });
}
function setTheme(id){cu.activeTheme=id;applyTheme(id);saveCU();toast('🎨 Tema diubah!');renderThemes();}
function buyTheme(id,cost){
  if(cu.coins<cost){toast('🪙 Koin tidak cukup!','var(--red)');return;}
  cu.coins-=cost; cu.unlockedThemes.push(id); saveCU(); renderCoins();
  toast(`🎨 Tema dibeli!`,'var(--gold)'); renderThemes();
}
