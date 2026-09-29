// ══════════════════════════════════════════════
// DAILY BANNER
// ══════════════════════════════════════════════
function renderDailyBanner(){
  const today=new Date().toDateString();
  const done=cu.lastDailyDate===today;
  const ms=new Date(); ms.setHours(24,0,0,0);
  const diff=ms-Date.now(); const h=Math.floor(diff/3600000),m=Math.floor((diff%3600000)/60000);
  document.getElementById('dailyBanner').innerHTML=`
    <div class="daily-banner">
      <div class="daily-info">
        <h3>📅 Challenge Harian</h3>
        <p>${done?'Sudah dimainkan hari ini!':'10 soal khusus setiap hari · Bonus koin extra'}</p>
      </div>
      <div>
        <div class="daily-timer">Reset: ${h}j ${m}m</div>
        <button class="btn-daily" ${done?'disabled':''} onclick="selectMode('daily');startGame()">${done?'✅ Selesai':'Mainkan!'}</button>
      </div>
    </div>`;
}

// ══════════════════════════════════════════════
// CHEST
// ══════════════════════════════════════════════
function renderChestBanner(){
  const now=Date.now(), interval=8*3600*1000;
  const ready=now-cu.lastChestTime>=interval;
  const next=cu.lastChestTime+interval-now;
  const h=Math.floor(next/3600000),m=Math.floor((next%3600000)/60000);
  document.getElementById('chestBanner').innerHTML=`
    <div class="chest-banner" onclick="${ready?'openChestModal()':''}">
      <span class="chest-icon">${ready?'🎁':'📦'}</span>
      <div class="chest-info">
        <h3>${ready?'Peti Hadiah Tersedia!':'Peti Hadiah'}</h3>
        <p>${ready?'Klik untuk buka peti gratis!':'Koin, tema hint, dan bonus menunggumu'}</p>
      </div>
      ${ready?'':'<span class="chest-timer">'+h+'j '+m+'m</span>'}
    </div>`;
}
function openChestModal(){
  const now=Date.now(), interval=8*3600*1000;
  if(now-cu.lastChestTime<interval){toast('Peti belum tersedia!','var(--red)');return;}
  document.getElementById('chestContent').innerHTML=`
    <div class="chest-open-wrap">
      <span class="chest-open-icon" onclick="openChest()">🎁</span>
      <div class="chest-open-hint">Ketuk peti untuk membuka!</div>
    </div>`;
  document.getElementById('chestModal').classList.add('active');
}
function openChest(){
  const rewards=[
    {icon:'🪙',title:'Koin x50',sub:'Tambah 50 koin',action:()=>{cu.coins+=50;cu.totalCoinsEarned+=50;}},
    {icon:'🪙',title:'Koin x100',sub:'Tambah 100 koin',action:()=>{cu.coins+=100;cu.totalCoinsEarned+=100;}},
    {icon:'❤️',title:'Nyawa Ekstra',sub:'Tambah 1 nyawa',action:()=>{cu.lives=Math.min(cu.lives+1,cu.maxLives);}},
    {icon:'⚡',title:'Waktu Ekstra',sub:'+15 detik soal berikutnya',action:()=>{cu.extraTime+=15;}},
    {icon:'🪙',title:'Koin x200',sub:'Jackpot! 200 koin',action:()=>{cu.coins+=200;cu.totalCoinsEarned+=200;}},
  ];
  const r=rewards[Math.floor(Math.random()*rewards.length)];
  r.action(); cu.lastChestTime=Date.now(); renderCoins(); renderLives(); saveCU();
  document.getElementById('chestContent').innerHTML=`
    <div class="chest-reward">
      <div class="chest-reward-icon">${r.icon}</div>
      <div class="chest-reward-title">${r.title}</div>
      <div class="chest-reward-sub">${r.sub}</div>
    </div>`;
  renderChestBanner();
  checkTrophies();
}
function closeChest(){document.getElementById('chestModal').classList.remove('active');}

// ══════════════════════════════════════════════
// MODE SELECT
// ══════════════════════════════════════════════
function selectMode(mode){
  gameMode=mode;
  document.querySelectorAll('.mode-btn').forEach(b=>{
    b.style.borderColor=b.querySelector('.mode-name')?.textContent.toLowerCase().includes(mode)?'var(--accent)':'var(--border)';
  });
  const catLabel=document.getElementById('catLabel');
  const catGrid=document.getElementById('catGrid');
  const btnStart=document.getElementById('btnStart');
  if(mode==='daily'){
    catLabel.style.display='none'; catGrid.style.display='none';
    btnStart.style.display='none';
  } else if(mode==='duel'){
    catLabel.style.display='block'; catGrid.style.display='grid';
    btnStart.textContent='⚔️ SETUP DUEL';
    btnStart.style.display='block';
  } else {
    catLabel.style.display='block'; catGrid.style.display='grid';
    btnStart.textContent='▶ MULAI'; btnStart.style.display='block';
  }
}
