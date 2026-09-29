// ══════════════════════════════════════════════
// AUTH
// ══════════════════════════════════════════════
function switchTab(tab){
  document.querySelectorAll('.auth-tab').forEach((t,i)=>t.classList.toggle('active',(i===0&&tab==='login')||(i===1&&tab==='register')));
  document.getElementById('fLogin').style.display=tab==='login'?'block':'none';
  document.getElementById('fReg').style.display=tab==='register'?'block':'none';
  document.getElementById('lErr').textContent='';
  document.getElementById('rErr').textContent='';
  // reset eye icons on tab switch
  ['lPass','rPass'].forEach(id=>{const el=document.getElementById(id);if(el)el.type='password';});
  ['lEye','rEye'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent='👁️';});
}

function togglePass(inputId, btnId){
  const input=document.getElementById(inputId);
  const btn=document.getElementById(btnId);
  if(!input||!btn)return;
  const isHidden=input.type==='password';
  input.type=isHidden?'text':'password';
  btn.textContent=isHidden?'🙈':'👁️';
  btn.style.color=isHidden?'var(--accent)':'var(--muted)';
}
function doLogin(){
  const u=document.getElementById('lUser').value.trim();
  const p=document.getElementById('lPass').value;
  const err=document.getElementById('lErr');
  if(!u||!p){err.textContent='Isi username dan password!';return;}
  const acc=getAcc(u);
  if(!acc){err.textContent='Akun tidak ditemukan.';return;}
  if(acc.password!==btoa(p)){err.textContent='Password salah!';return;}
  setSess(u.toLowerCase()); loginSuccess(u.toLowerCase(),acc);
}
function doRegister(){
  const u=document.getElementById('rUser').value.trim();
  const p=document.getElementById('rPass').value;
  const err=document.getElementById('rErr');
  if(!u||!p){err.textContent='Isi username dan password!';return;}
  if(u.length<3){err.textContent='Username minimal 3 karakter!';return;}
  if(p.length<4){err.textContent='Password minimal 4 karakter!';return;}
  if(getAcc(u)){err.textContent='Username sudah dipakai!';return;}
  const av=document.querySelector('.av-opt.selected')?.textContent||'🦊';
  const acc={
    password:btoa(p),avatar:av,
    coins:100,lives:3,maxLives:3,
    badges:[],trophies:[],claimedTrophies:[],
    unlockedThemes:['default'],activeTheme:'default',
    history:[],gamesPlayed:0,totalScore:0,bestScore:0,
    totalCoinsEarned:100,perfectCount:0,bestStreak:0,
    bestSurvival:0,duelWins:0,dailyStreak:0,dailyPlayed:0,
    lastDailyDate:'',categoriesPlayed:[],
    lastChestTime:0,joinDate:new Date().toLocaleDateString('id'),extraTime:0,
  };
  saveAcc(u,acc); setSess(u.toLowerCase()); loginSuccess(u.toLowerCase(),acc);
}
function loginSuccess(username,acc){
  cun=username; cu=acc;
  // migrate
  ['trophies','claimedTrophies','badges','history','categoriesPlayed'].forEach(k=>{if(!cu[k])cu[k]=[];});
  if(!cu.unlockedThemes)cu.unlockedThemes=['default'];
  if(!cu.activeTheme)cu.activeTheme='default';
  if(!cu.totalCoinsEarned)cu.totalCoinsEarned=cu.coins||0;
  ['perfectCount','bestStreak','bestSurvival','duelWins','dailyStreak','dailyPlayed','lastChestTime'].forEach(k=>{if(!cu[k])cu[k]=0;});
  if(!cu.lastDailyDate)cu.lastDailyDate='';
  applyTheme(cu.activeTheme);
  document.getElementById('navR').style.display='flex';
  document.getElementById('bottomNav').style.display='flex';
  document.getElementById('btnAv').textContent=cu.avatar;
  renderCoins(); renderLives();
  document.getElementById('welcomeChip').textContent=`${cu.avatar} Halo, ${username}!`;
  renderDailyBanner();
  renderChestBanner();
  checkTrophies();
  showS('sHome'); setNav('home');
}
function saveCU(){if(cun&&cu)saveAcc(cun,cu);}
function doLogout(){
  saveCU(); setSess(''); cu=null; cun=null;
  applyTheme('default');
  document.getElementById('navR').style.display='none';
  document.getElementById('bottomNav').style.display='none';
  document.getElementById('lUser').value=''; document.getElementById('lPass').value='';
  showS('sAuth'); switchTab('login');
}
