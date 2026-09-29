// ══════════════════════════════════════════════
// RANK SYSTEM
// ══════════════════════════════════════════════
var RANKS=[
  {id:'iron',     name:'Iron',     icon:'⚙️',  color:'#9a9ab0', minRP:0,    maxRP:200,  cls:'rank-iron',     reward:0},
  {id:'bronze',   name:'Bronze',   icon:'🥉',  color:'#cd7f32', minRP:200,  maxRP:500,  cls:'rank-bronze',   reward:50},
  {id:'silver',   name:'Silver',   icon:'🥈',  color:'#c0c0c0', minRP:500,  maxRP:1000, cls:'rank-silver',   reward:100},
  {id:'gold',     name:'Gold',     icon:'🥇',  color:'#f0c040', minRP:1000, maxRP:2000, cls:'rank-gold',     reward:200},
  {id:'platinum', name:'Platinum', icon:'💠',  color:'#67e8f9', minRP:2000, maxRP:3500, cls:'rank-platinum', reward:350},
  {id:'diamond',  name:'Diamond',  icon:'💎',  color:'#a78bfa', minRP:3500, maxRP:5500, cls:'rank-diamond',  reward:500},
  {id:'master',   name:'Master',   icon:'👑',  color:'#ff4d6d', minRP:5500, maxRP:99999,cls:'rank-master',   reward:1000},
];

// RP gained per game based on performance
function calcRP(correct, total, score, mode){
  const acc=correct/total;
  let base=Math.round(score * 0.3);          // 30% of score → RP
  if(acc===1) base+=30;                       // perfect bonus
  if(mode==='daily') base=Math.round(base*1.5); // daily bonus
  if(mode==='survival') base=Math.round(base*1.2);
  return Math.max(5, base);                   // minimum 5 RP
}

function getRank(rp){
  for(let i=RANKS.length-1;i>=0;i--){
    if(rp>=RANKS[i].minRP) return RANKS[i];
  }
  return RANKS[0];
}

function getRankProgress(rp){
  const rank=getRank(rp);
  if(rank.id==='master') return {rank, pct:100, current:rp-rank.minRP, needed:0};
  const current=rp-rank.minRP;
  const needed=rank.maxRP-rank.minRP;
  const pct=Math.min(100, Math.round((current/needed)*100));
  return {rank, pct, current, needed};
}

function awardRP(correct, total, score, mode){
  if(!cu) return 0;
  if(!cu.rp) cu.rp=0;
  if(!cu.rankHistory) cu.rankHistory=[];
  const oldRank=getRank(cu.rp);
  const gained=calcRP(correct, total, score, mode);
  cu.rp+=gained;
  const newRank=getRank(cu.rp);
  // check rank up
  if(newRank.id!==oldRank.id){
    cu.rankHistory.push({from:oldRank.name,to:newRank.name,date:new Date().toLocaleDateString('id')});
    cu.coins+=newRank.reward; cu.totalCoinsEarned+=newRank.reward;
    saveCU(); renderCoins();
    setTimeout(()=>showRankUp(oldRank, newRank), 1200);
  } else {
    saveCU();
  }
  return gained;
}

function showRankUp(from, to){
  playSound('levelup');
  document.getElementById('ruFrom').textContent=`${from.icon} ${from.name} → ${to.icon} ${to.name}`;
  document.getElementById('ruIcon').textContent=to.icon;
  document.getElementById('ruTitle').innerHTML=`<span style="color:${to.color}">RANK UP!</span>`;
  document.getElementById('ruSub').textContent=`Selamat! Kamu sekarang ${to.name}! +${to.reward}🪙`;
  document.getElementById('rankUpPopup').classList.add('show');
}
function closeRankUp(){document.getElementById('rankUpPopup').classList.remove('show');}

function renderRankScreen(){
  if(!cu)return;
  if(!cu.rp)cu.rp=0;
  const {rank, pct, current, needed}=getRankProgress(cu.rp);
  const nextRank=RANKS[RANKS.indexOf(rank)+1];

  // Rank card
  document.getElementById('rankCard').innerHTML=`
    <div class="rank-card" style="border-color:${rank.color}40">
      <div class="rank-card-top">
        <div class="rank-card-left">
          <span class="rank-badge ${rank.cls}">${rank.icon} ${rank.name}</span>
          <h3 style="margin-top:8px;font-family:'Righteous',sans-serif;font-size:22px">${cu.rp} RP</h3>
          <p>${rank.id==='master'?'Rank Tertinggi!':nextRank?`${needed-current} RP lagi ke ${nextRank.icon} ${nextRank.name}`:''}</p>
        </div>
        <div class="rank-icon">${rank.icon}</div>
      </div>
      ${rank.id!=='master'?`
      <div class="rank-progress-wrap">
        <div class="rank-progress-bar">
          <div class="rank-progress-fill" style="width:${pct}%;background:linear-gradient(90deg,${rank.color},${nextRank?.color||rank.color})"></div>
        </div>
        <div class="rank-progress-labels">
          <span>${rank.icon} ${rank.name}</span>
          <span style="font-weight:700">${pct}%</span>
          <span>${nextRank?.icon} ${nextRank?.name}</span>
        </div>
      </div>`:'<div style="text-align:center;color:var(--gold);font-weight:700;margin-top:8px">👑 Rank Tertinggi Dicapai!</div>'}
      ${cu.rankHistory?.length?`
      <div class="rank-history">
        <div style="font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px">Riwayat Naik Rank</div>
        ${cu.rankHistory.slice(-3).reverse().map(h=>`
          <div class="rank-history-item"><div class="dot"></div>${h.from} → <strong>${h.to}</strong> · ${h.date}</div>
        `).join('')}
      </div>`:''}
    </div>`;

  // All tiers
  const tiersEl=document.getElementById('rankTiers');
  tiersEl.innerHTML='';
  RANKS.forEach(r=>{
    const isCurrentRank=r.id===rank.id;
    const achieved=cu.rp>=r.minRP;
    const div=document.createElement('div');
    div.style.cssText=`background:var(--surface);border:1px solid ${isCurrentRank?r.color+'80':'var(--border)'};border-radius:12px;padding:12px 14px;margin-bottom:8px;display:flex;align-items:center;gap:12px;opacity:${achieved?1:.45};`;
    div.innerHTML=`
      <div style="font-size:28px">${r.icon}</div>
      <div style="flex:1">
        <div style="font-weight:800;font-size:13px;color:${achieved?r.color:'var(--muted)'}">${r.name} ${isCurrentRank?'← Kamu':''}</div>
        <div style="font-size:10px;color:var(--muted);margin-top:2px">${r.minRP} – ${r.id==='master'?'∞':r.maxRP} RP · Bonus naik: ${r.reward}🪙</div>
      </div>
      ${achieved?`<div style="font-size:16px">✅</div>`:`<div style="font-size:11px;color:var(--muted)">${r.minRP} RP</div>`}`;
    tiersEl.appendChild(div);
  });
}

// Patch showS to render rank screen
var _origShowS=showS;
showS=function(id){
  _origShowS(id);
  if(id==='sRank')renderRankScreen();
};

// Patch endGame to award RP and show rank change in result
var _origEndGame2=endGame;
endGame=function(){
  // Store pre-RP for diff
  const preRP=cu?.rp||0;
  _origEndGame2();
  // Award RP
  const gained=awardRP(quiz.correct, quiz.questions?.length||10, quiz.score, gameMode);
  const postRP=cu?.rp||0;
  // Show RP change in result card
  const rrc=document.getElementById('rRankChange');
  if(rrc){
    const {rank}=getRankProgress(postRP);
    rrc.innerHTML=`
      <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin:10px 0;background:var(--surface2);border-radius:10px;padding:10px;">
        <span class="rank-badge ${rank.cls}">${rank.icon} ${rank.name}</span>
        <span style="font-size:13px;color:var(--green);font-weight:700">+${gained} RP</span>
        <span style="font-size:11px;color:var(--muted)">(${postRP} RP total)</span>
      </div>`;
  }
};

// Show rank badge in profile header
var _origRenderProfile2=renderProfile;
renderProfile=function(){
  _origRenderProfile2();
  // Inject rank into profile header
  if(cu){
    const {rank}=getRankProgress(cu.rp||0);
    const ph=document.getElementById('profHeader');
    if(ph){
      const existing=ph.querySelector('.rank-in-profile');
      if(!existing){
        const rankEl=document.createElement('div');
        rankEl.className='rank-in-profile';
        rankEl.style.cssText='margin-top:6px;';
        rankEl.innerHTML=`<span class="rank-badge ${rank.cls}">${rank.icon} ${rank.name} · ${cu.rp||0} RP</span>`;
        ph.querySelector('.profile-info')?.appendChild(rankEl);
      }
    }
  }
};

// Show rank in leaderboard
var _origRenderLB=renderLB;
renderLB=function(){
  _origRenderLB();
  // Enhance LB items with rank badges
  const db=getDB();
  document.querySelectorAll('.lb-item').forEach((el,i)=>{
    const entries=Object.entries(db).sort((a,b)=>(b[1].bestScore||0)-(a[1].bestScore||0));
    if(entries[i]){
      const acc=entries[i][1];
      const {rank}=getRankProgress(acc.rp||0);
      const nameEl=el.querySelector('.lb-name');
      if(nameEl&&!nameEl.querySelector('.rank-badge')){
        nameEl.insertAdjacentHTML('beforeend',`<br><span class="rank-badge ${rank.cls}" style="font-size:9px;padding:2px 7px">${rank.icon} ${rank.name}</span>`);
      }
    }
  });
};
