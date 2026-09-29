// ══════════════════════════════════════════════
// DEVELOPER PANEL
// ══════════════════════════════════════════════

// ⚠️ GANTI kode ini sebelum deploy!
var DEV_CODE = 'KUISKOIN_DEV_2024';
var DEV_ACCOUNTS = ['dev', 'admin', 'developer']; // username yg otomatis dapat akses dev

let devVerified = false;
let devLog = [];

function isDev(){
  return cu && (cu.isDev === true || DEV_ACCOUNTS.includes(cun?.toLowerCase()));
}

function addDevLog(msg, type='ok'){
  const now = new Date().toLocaleTimeString('id');
  devLog.unshift({msg, type, time:now});
  devLog = devLog.slice(0, 50);
  refreshDevLog();
}

function refreshDevLog(){
  const el = document.getElementById('devLogContent');
  if(!el) return;
  el.innerHTML = devLog.map(e=>
    `<div class="entry ${e.type}">[${e.time}] ${e.msg}</div>`
  ).join('') || '<div style="color:var(--muted)">Belum ada aktivitas...</div>';
}

function verifyDevCode(){
  const input = document.getElementById('devCodeInput');
  const err = document.getElementById('devCodeErr');
  if(!input) return;
  if(input.value.trim() === DEV_CODE){
    devVerified = true;
    document.getElementById('devVerifyWrap').style.display='none';
    renderDevPanel();
    addDevLog(`Login dev: ${cun}`, 'ok');
  } else {
    err.textContent = '❌ Kode salah!';
    playSound('wrong');
    setTimeout(()=>err.textContent='', 2000);
  }
}

function renderDevPanel(){
  const wrap = document.getElementById('devPanelContent');
  if(!wrap) return;
  wrap.style.display = 'block';
  const db = getDB();
  const players = Object.entries(db);

  wrap.innerHTML = `
    <!-- HEADER -->
    <div style="background:linear-gradient(135deg,rgba(255,77,109,.1),rgba(188,140,255,.08));border:1px solid rgba(255,77,109,.3);border-radius:var(--radius);padding:14px 16px;margin-bottom:14px;display:flex;align-items:center;gap:12px;">
      <span style="font-size:32px">🛠️</span>
      <div>
        <div style="font-family:'Righteous',sans-serif;font-size:18px;">Developer Panel</div>
        <div style="font-size:11px;color:var(--muted);margin-top:2px;">Login sebagai: <strong style="color:var(--red)">${cun}</strong> · ${players.length} akun terdaftar</div>
      </div>
    </div>

    <!-- AKUN SAYA -->
    <div class="dev-section">
      <h3>👤 Akun Saya (${cun})</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
        <div style="background:var(--surface2);border-radius:9px;padding:10px;text-align:center;">
          <div style="font-family:'Righteous',sans-serif;font-size:20px;color:var(--gold)">${cu.coins}</div>
          <div style="font-size:10px;color:var(--muted)">🪙 Koin</div>
        </div>
        <div style="background:var(--surface2);border-radius:9px;padding:10px;text-align:center;">
          <div style="font-family:'Righteous',sans-serif;font-size:20px;color:var(--red)">${cu.lives}</div>
          <div style="font-size:10px;color:var(--muted)">❤️ Nyawa</div>
        </div>
        <div style="background:var(--surface2);border-radius:9px;padding:10px;text-align:center;">
          <div style="font-family:'Righteous',sans-serif;font-size:20px;color:var(--accent)">${cu.rp||0}</div>
          <div style="font-size:10px;color:var(--muted)">⚔️ RP</div>
        </div>
        <div style="background:var(--surface2);border-radius:9px;padding:10px;text-align:center;">
          <div style="font-family:'Righteous',sans-serif;font-size:20px;color:var(--purple)">${cu.gamesPlayed||0}</div>
          <div style="font-size:10px;color:var(--muted)">🎮 Game</div>
        </div>
      </div>

      <div class="sec-title">⚡ Quick Actions</div>
      <div class="dev-quick-btns" style="margin-bottom:12px;">
        <button class="btn-dev gold" onclick="devQuick('coin',100)">+100 🪙</button>
        <button class="btn-dev gold" onclick="devQuick('coin',500)">+500 🪙</button>
        <button class="btn-dev gold" onclick="devQuick('coin',1000)">+1000 🪙</button>
        <button class="btn-dev green" onclick="devQuick('life',1)">+1 ❤️</button>
        <button class="btn-dev green" onclick="devQuick('life',3)">Full ❤️</button>
        <button class="btn-dev blue" onclick="devQuick('rp',500)">+500 RP</button>
        <button class="btn-dev blue" onclick="devQuick('rp',2000)">+2000 RP</button>
        <button class="btn-dev purple" onclick="devQuick('time',30)">+30s ⏱️</button>
        <button class="btn-dev" onclick="devQuick('unlock_all_themes')">🎨 Unlock Semua Tema</button>
        <button class="btn-dev" onclick="devQuick('all_badges')">🎖 Semua Badge</button>
        <button class="btn-dev" onclick="devQuick('all_trophies')">🏅 Semua Trophy</button>
        <button class="btn-dev" onclick="devQuick('reset_daily')">📅 Reset Daily</button>
        <button class="btn-dev" onclick="devQuick('reset_chest')">🎁 Reset Peti</button>
        <button class="btn-dev" onclick="devQuick('maxlives')">💪 Max Lives +1</button>
      </div>

      <div class="sec-title">🎛️ Set Nilai Custom</div>
      <div class="dev-input-row">
        <select id="devStatType">
          <option value="coins">🪙 Koin</option>
          <option value="lives">❤️ Nyawa</option>
          <option value="rp">⚔️ RP</option>
          <option value="maxLives">💪 Max Nyawa</option>
          <option value="bestScore">🏆 Best Score</option>
          <option value="gamesPlayed">🎮 Games Played</option>
          <option value="dailyStreak">📅 Daily Streak</option>
          <option value="duelWins">⚔️ Duel Wins</option>
          <option value="bestSurvival">💀 Best Survival</option>
        </select>
        <input type="number" id="devStatVal" placeholder="Nilai..." min="0" style="width:90px;flex:none;">
        <button class="btn-dev blue" onclick="devSetStat()">Set</button>
      </div>
    </div>

    <!-- MANAJEMEN PEMAIN -->
    <div class="dev-section">
      <h3>👥 Manajemen Pemain</h3>
      <div class="dev-input-row" style="margin-bottom:12px;">
        <select id="devTargetUser" style="flex:1">
          ${players.map(([u,a])=>`<option value="${u}">${a.avatar||'🦊'} ${u} (${a.coins||0}🪙 · ${a.lives||0}❤️)</option>`).join('')}
        </select>
        <button class="btn-dev" onclick="refreshDevPanel()">🔄</button>
      </div>

      <div class="dev-quick-btns" style="margin-bottom:12px;">
        <button class="btn-dev gold" onclick="devTargetAction('coin',100)">+100 🪙</button>
        <button class="btn-dev gold" onclick="devTargetAction('coin',500)">+500 🪙</button>
        <button class="btn-dev green" onclick="devTargetAction('life',1)">+1 ❤️</button>
        <button class="btn-dev green" onclick="devTargetAction('life_full')">Full ❤️</button>
        <button class="btn-dev blue" onclick="devTargetAction('rp',500)">+500 RP</button>
        <button class="btn-dev" onclick="devTargetAction('reset_coins')">🔄 Reset Koin</button>
        <button class="btn-dev" style="background:var(--red)" onclick="devTargetAction('ban')">🚫 Ban Akun</button>
        <button class="btn-dev green" onclick="devTargetAction('unban')">✅ Unban</button>
        <button class="btn-dev" style="background:#333" onclick="devTargetAction('delete')">🗑️ Hapus Akun</button>
      </div>

      <div class="sec-title">📋 Semua Pemain</div>
      <div id="devPlayerList">
        ${players.map(([u,a])=>`
          <div class="dev-player-card" style="${a.banned?'opacity:.4;border-color:var(--red)':''}">
            <div>
              <div class="dev-player-name">${a.avatar||'🦊'} ${u} ${a.isDev?'<span class="dev-badge">DEV</span>':''} ${a.banned?'🚫':''}</div>
              <div class="dev-player-stats">🪙${a.coins||0} · ❤️${a.lives||0} · ⚔️${a.rp||0}RP · 🎮${a.gamesPlayed||0}x · ${a.joinDate||'-'}</div>
            </div>
            <button class="btn-dev blue" style="font-size:10px;padding:5px 8px" onclick="devSelectPlayer('${u}')">Pilih</button>
          </div>`).join('')}
      </div>
    </div>

    <!-- DATABASE -->
    <div class="dev-section">
      <h3>🗄️ Database</h3>
      <div class="dev-quick-btns" style="margin-bottom:12px;">
        <button class="btn-dev blue" onclick="devExportDB()">📤 Export DB</button>
        <button class="btn-dev green" onclick="devImportDB()">📥 Import DB</button>
        <button class="btn-dev" onclick="devClearLB()">🏆 Reset Leaderboard</button>
        <button class="btn-dev" style="background:var(--red)" onclick="devNukeDB()">💥 Hapus Semua Data</button>
      </div>
      <div style="font-size:11px;color:var(--muted)">Total akun: ${players.length} · DB size: ~${Math.round(JSON.stringify(db).length/1024)} KB</div>
    </div>

    <!-- GAME SETTINGS -->
    <div class="dev-section">
      <h3>⚙️ Game Settings</h3>
      <div class="dev-quick-btns" style="margin-bottom:10px;">
        <button class="btn-dev" onclick="devToggleGodMode()">⚡ God Mode: ${cu.godMode?'ON':'OFF'}</button>
        <button class="btn-dev gold" onclick="devSetRP(5500)">👑 Set ke Master</button>
        <button class="btn-dev" onclick="devResetAllStats()">🔄 Reset Statistik Saya</button>
        <button class="btn-dev purple" onclick="devGrantDevStatus()">🛠️ Tandai Akun Ini Dev</button>
      </div>
      <div style="font-size:11px;color:var(--muted);margin-top:4px">
        God Mode: ${cu.godMode?'<span style="color:var(--green)">AKTIF — nyawa tidak berkurang</span>':'<span style="color:var(--muted)">Nonaktif</span>'}
      </div>
    </div>

    <!-- LOG -->
    <div class="dev-section">
      <h3>📜 Activity Log</h3>
      <div class="dev-log" id="devLogContent"></div>
      <button class="btn-dev" style="margin-top:8px;width:100%" onclick="devLog=[];refreshDevLog()">🗑️ Clear Log</button>
    </div>
  `;

  refreshDevLog();
}

function refreshDevPanel(){
  if(devVerified) renderDevPanel();
}

function devSelectPlayer(username){
  document.getElementById('devTargetUser').value = username;
  toast(`👤 Dipilih: ${username}`,'var(--blue)');
}

function devQuick(action, val=0){
  if(!cu) return;
  let msg = '';
  switch(action){
    case 'coin':
      cu.coins+=val; cu.totalCoinsEarned+=val;
      msg=`+${val} koin untuk ${cun} → total ${cu.coins}`;
      renderCoins(); break;
    case 'life':
      cu.lives=Math.min(cu.lives+val, cu.maxLives);
      msg=`+${val} nyawa untuk ${cun} → total ${cu.lives}`;
      renderLives(); break;
    case 'rp':
      cu.rp=(cu.rp||0)+val;
      msg=`+${val} RP untuk ${cun} → total ${cu.rp}`;
      break;
    case 'time':
      cu.extraTime=(cu.extraTime||0)+val;
      msg=`+${val} detik waktu soal disiapkan`;
      break;
    case 'maxlives':
      cu.maxLives=(cu.maxLives||3)+1;
      cu.lives=cu.maxLives;
      msg=`Max nyawa → ${cu.maxLives}`;
      renderLives(); break;
    case 'unlock_all_themes':
      cu.unlockedThemes=THEMES.map(t=>t.id);
      msg='Semua tema di-unlock!';
      break;
    case 'all_badges':
      cu.badges=ALL_BADGES.map(b=>b.id);
      msg='Semua badge diberikan!';
      break;
    case 'all_trophies':
      cu.trophies=ALL_TROPHIES.map(t=>t.id);
      cu.claimedTrophies=ALL_TROPHIES.map(t=>t.id);
      cu.coins+=ALL_TROPHIES.reduce((s,t)=>s+t.reward,0);
      msg='Semua trophy diklaim!';
      renderCoins(); break;
    case 'reset_daily':
      cu.lastDailyDate='';
      msg='Daily challenge di-reset!';
      renderDailyBanner(); break;
    case 'reset_chest':
      cu.lastChestTime=0;
      msg='Peti hadiah di-reset!';
      renderChestBanner(); break;
  }
  saveCU(); addDevLog(msg, 'ok');
  toast('✅ '+msg.slice(0,40),'var(--green)');
  renderDevPanel();
}

function devSetStat(){
  const type=document.getElementById('devStatType').value;
  const val=parseInt(document.getElementById('devStatVal').value);
  if(isNaN(val)){toast('Masukkan nilai yang valid!','var(--red)');return;}
  cu[type]=val;
  if(type==='coins')renderCoins();
  if(type==='lives'||type==='maxLives')renderLives();
  saveCU();
  addDevLog(`Set ${type}=${val} untuk ${cun}`, 'ok');
  toast(`✅ ${type} → ${val}`,'var(--green)');
  renderDevPanel();
}

function devSetRP(val){
  cu.rp=val; saveCU();
  addDevLog(`Set RP=${val} untuk ${cun}`, 'ok');
  toast(`⚔️ RP → ${val}`,'var(--blue)');
  renderDevPanel();
}

function devTargetAction(action, val=0){
  const target=document.getElementById('devTargetUser')?.value;
  if(!target){toast('Pilih pemain dulu!','var(--red)');return;}
  const db=getDB();
  const acc=db[target];
  if(!acc){toast('Akun tidak ditemukan!','var(--red)');return;}

  let msg='';
  switch(action){
    case 'coin':
      acc.coins=(acc.coins||0)+val; acc.totalCoinsEarned=(acc.totalCoinsEarned||0)+val;
      msg=`+${val} koin untuk ${target}`; break;
    case 'life':
      acc.lives=Math.min((acc.lives||0)+val, acc.maxLives||3);
      msg=`+${val} nyawa untuk ${target}`; break;
    case 'life_full':
      acc.lives=acc.maxLives||3;
      msg=`Full nyawa untuk ${target}`; break;
    case 'rp':
      acc.rp=(acc.rp||0)+val;
      msg=`+${val} RP untuk ${target}`; break;
    case 'reset_coins':
      acc.coins=0;
      msg=`Reset koin ${target}`; break;
    case 'ban':
      if(!confirm(`Ban akun ${target}?`))return;
      acc.banned=true;
      msg=`BAN: ${target}`; break;
    case 'unban':
      acc.banned=false;
      msg=`Unban: ${target}`; break;
    case 'delete':
      if(!confirm(`HAPUS akun ${target}? Tidak bisa dibatalkan!`))return;
      delete db[target]; saveDB(db);
      msg=`DELETE: ${target}`;
      addDevLog(msg, 'err'); toast('🗑️ Akun dihapus','var(--red)');
      renderDevPanel(); return;
  }
  db[target]=acc; saveDB(db);
  // Sync if target is current user
  if(target===cun){ cu=acc; renderCoins(); renderLives(); }
  addDevLog(msg, 'warn'); toast('✅ '+msg,'var(--green)');
  renderDevPanel();
}

function devToggleGodMode(){
  cu.godMode=!cu.godMode; saveCU();
  addDevLog(`God Mode: ${cu.godMode?'ON':'OFF'}`, cu.godMode?'ok':'warn');
  toast(`⚡ God Mode: ${cu.godMode?'ON':'OFF'}`, cu.godMode?'var(--green)':'var(--muted)');
  renderDevPanel();
}

function devGrantDevStatus(){
  cu.isDev=true; saveCU();
  addDevLog(`Akun ${cun} ditandai sebagai DEV`, 'ok');
  toast('🛠️ Akun ditandai sebagai Developer!','var(--purple)');
  renderDevPanel();
}

function devResetAllStats(){
  if(!confirm('Reset semua statistik kamu? Data game akan hilang!')) return;
  cu.gamesPlayed=0; cu.totalScore=0; cu.bestScore=0;
  cu.bestStreak=0; cu.bestSurvival=0; cu.duelWins=0;
  cu.dailyStreak=0; cu.history=[]; cu.catStats={};
  cu.rp=0; cu.trophies=[]; cu.claimedTrophies=[]; cu.badges=[];
  saveCU();
  addDevLog(`Reset statistik ${cun}`, 'warn');
  toast('🔄 Statistik di-reset!','var(--gold)');
  renderDevPanel();
}

function devExportDB(){
  const db=getDB();
  const blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url; a.download=`kuiskoin_db_${Date.now()}.json`; a.click();
  URL.revokeObjectURL(url);
  addDevLog('Export DB berhasil', 'ok');
  toast('📤 Database di-export!','var(--blue)');
}

function devImportDB(){
  const input=document.createElement('input');
  input.type='file'; input.accept='.json';
  input.onchange=e=>{
    const file=e.target.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        const data=JSON.parse(ev.target.result);
        if(!confirm(`Import ${Object.keys(data).length} akun? Data lama akan digabung!`))return;
        const existing=getDB();
        const merged={...existing,...data};
        saveDB(merged);
        addDevLog(`Import DB: ${Object.keys(data).length} akun`, 'ok');
        toast('📥 Database di-import!','var(--green)');
        renderDevPanel();
      }catch(e){
        toast('❌ File tidak valid!','var(--red)');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function devClearLB(){
  if(!confirm('Reset leaderboard? (tidak menghapus akun)'))return;
  const db=getDB();
  Object.values(db).forEach(acc=>{acc.bestScore=0;acc.totalScore=0;});
  saveDB(db);
  addDevLog('Leaderboard di-reset','warn');
  toast('🏆 Leaderboard di-reset!','var(--gold)');
  renderDevPanel();
}

function devNukeDB(){
  if(!prompt('Ketik "HAPUS SEMUA" untuk konfirmasi:')?.trim()==='HAPUS SEMUA') return;
  if(!confirm('YAKIN? Semua data akan hilang permanen!'))return;
  localStorage.clear();
  toast('💥 Semua data dihapus!','var(--red)');
  setTimeout(()=>location.reload(), 1500);
}

// Patch loginSuccess to show dev button
var _origLoginSuccessDev = loginSuccess;
loginSuccess = function(username, acc){
  _origLoginSuccessDev(username, acc);
  renderDevButton();
};

function renderDevButton(){
  const wrap = document.getElementById('devBtnWrap');
  if(!wrap) return;
  if(isDev()){
    wrap.innerHTML=`<button class="btn-s" onclick="openDevPanel()" style="margin-top:4px;border-color:rgba(255,77,109,.4);color:var(--red);">🛠️ Developer Panel <span class="dev-badge">DEV</span></button>`;
  } else {
    wrap.innerHTML=`<button class="btn-s" onclick="openDevPanel()" style="margin-top:4px;color:var(--muted);font-size:12px;">🔐 Developer Access</button>`;
  }
}

function openDevPanel(){
  showS('sDev');
  // If already dev, skip verify
  if(isDev() || devVerified){
    devVerified=true;
    document.getElementById('devVerifyWrap').style.display='none';
    renderDevPanel();
  } else {
    document.getElementById('devVerifyWrap').style.display='block';
    document.getElementById('devPanelContent').style.display='none';
    document.getElementById('devCodeInput').value='';
    document.getElementById('devCodeErr').textContent='';
  }
}

// God mode - skip life loss
var _origEndGameGod = endGame;
endGame = function(){
  _origEndGameGod();
  if(cu?.godMode){
    // Restore lives if god mode
    cu.lives = cu.maxLives||3;
    renderLives(); saveCU();
    addDevLog('God Mode: nyawa dipulihkan', 'ok');
  }
};
let deferredInstallPrompt = null;

// Register Service Worker
if('serviceWorker' in navigator){
  window.addEventListener('load', ()=>{
    navigator.serviceWorker.register('./sw.js')
      .then(reg=>{
        console.log('[PWA] SW registered:', reg.scope);
        // Check for updates
        reg.addEventListener('updatefound', ()=>{
          const newWorker = reg.installing;
          newWorker.addEventListener('statechange', ()=>{
            if(newWorker.state==='installed' && navigator.serviceWorker.controller){
              toast('🔄 Update tersedia! Refresh untuk versi terbaru.','var(--blue)');
            }
          });
        });
      })
      .catch(err=>console.warn('[PWA] SW registration failed:', err));
  });
}

// Capture install prompt
window.addEventListener('beforeinstallprompt', e=>{
  e.preventDefault();
  deferredInstallPrompt = e;
  // Show install banner
  const banner = document.getElementById('installBanner');
  if(banner){ banner.style.display='flex'; }
});

// App installed
window.addEventListener('appinstalled', ()=>{
  deferredInstallPrompt = null;
  dismissInstall();
  toast('🎉 KuisKoin berhasil diinstall!','var(--green)');
});

function installApp(){
  if(!deferredInstallPrompt){ return; }
  deferredInstallPrompt.prompt();
  deferredInstallPrompt.userChoice.then(choice=>{
    if(choice.outcome==='accepted'){
      toast('📲 Menginstall KuisKoin...','var(--accent)');
    }
    deferredInstallPrompt = null;
    dismissInstall();
  });
}

function dismissInstall(){
  const banner = document.getElementById('installBanner');
  if(banner) banner.style.display='none';
}

// ── OFFLINE DETECTION ──
function updateOnlineStatus(){
  const bar = document.getElementById('offlineBar');
  if(!bar) return;
  if(!navigator.onLine){
    bar.style.display='block';
    toast('📡 Offline — mode offline aktif','var(--gold)');
  } else {
    bar.style.display='none';
  }
}
window.addEventListener('online',  updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus(); // check on load

// ── PUSH NOTIFICATION PERMISSION ──
function requestNotifPermission(){
  if(!('Notification' in window)) return;
  if(Notification.permission === 'default'){
    Notification.requestPermission().then(perm=>{
      if(perm==='granted'){
        toast('🔔 Notifikasi aktif! Kamu akan diingatkan setiap hari.','var(--green)');
        scheduleDailyNotif();
      }
    });
  }
}

function scheduleDailyNotif(){
  // Schedule via SW — kirim reminder jam 8 pagi
  if(!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.ready.then(reg=>{
    // Cek apakah Push API tersedia
    if('PushManager' in window){
      console.log('[PWA] Push notification ready');
    }
  });
}

// Ask notification permission after login (with delay)
var _origLoginSuccess = loginSuccess;
loginSuccess = function(username, acc){
  _origLoginSuccess(username, acc);
  // Ask for notification after 3 seconds
  setTimeout(requestNotifPermission, 3000);
};

// ── SHARE SCORE ──
function shareScore(score, rank){
  if(navigator.share){
    navigator.share({
      title: 'KuisKoin — Skor Saya!',
      text: `Aku baru dapat skor ${score} di KuisKoin dengan rank ${rank}! Coba kalahkan aku! 🎯🪙`,
      url: window.location.href,
    }).catch(()=>{});
  } else {
    // Fallback — copy to clipboard
    navigator.clipboard?.writeText(
      `Aku baru dapat skor ${score} di KuisKoin! Rank: ${rank} 🎯🪙`
    ).then(()=> toast('📋 Skor disalin ke clipboard!','var(--accent)'));
  }
}

// Add share button to result screen
var _origEndGame3 = endGame;
endGame = function(){
  _origEndGame3();
  // Add share button after result renders
  setTimeout(()=>{
    const resultScreen = document.getElementById('sResult');
    if(resultScreen && !resultScreen.querySelector('.btn-share')){
      const {rank} = getRankProgress(cu?.rp||0);
      const shareBtn = document.createElement('button');
      shareBtn.className = 'btn-s btn-share';
      shareBtn.style.marginTop = '7px';
      shareBtn.innerHTML = '📤 Bagikan Skor';
      shareBtn.onclick = ()=> shareScore(quiz.score, rank.name);
      // Insert after trophy button
      const trophyBtn = resultScreen.querySelector('.btn-s');
      if(trophyBtn) trophyBtn.insertAdjacentElement('afterend', shareBtn);
    }
  }, 200);
};
