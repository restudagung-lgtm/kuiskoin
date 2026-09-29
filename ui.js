// ══════════════════════════════════════════════
// UI
// ══════════════════════════════════════════════
function showS(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  if(id==='sLB')renderLB();
  if(id==='sProfile')renderProfile();
  if(id==='sTrophy')renderTrophies();
  if(id==='sTheme')renderThemes();
}
function setNav(id){
  document.querySelectorAll('.bnav-btn').forEach(b=>b.classList.remove('active'));
  const el=document.getElementById('nav-'+id); if(el)el.classList.add('active');
}
function toast(msg,color='var(--accent)'){
  const t=document.getElementById('toast'); t.textContent=msg; t.style.color=color;
  t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2200);
}
function renderCoins(){document.getElementById('coinCount').textContent=cu?.coins??0;}
function renderLives(){
  const d=document.getElementById('livesRow'); d.innerHTML='';
  for(let i=0;i<(cu?.maxLives??3);i++){
    const h=document.createElement('span'); h.className='heart'+(i<(cu?.lives??3)?'':' empty'); h.textContent='❤️'; d.appendChild(h);
  }
}
function applyTheme(id){document.body.className=id==='default'?'':'theme-'+id;}
