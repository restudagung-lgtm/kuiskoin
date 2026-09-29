// ══════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════
(function(){
  // Avatar picker
  const pick=document.getElementById('avPick');
  AVATARS.forEach((av,i)=>{
    const b=document.createElement('button');
    b.className='av-opt'+(i===0?' selected':''); b.textContent=av; b.type='button';
    b.onclick=()=>{document.querySelectorAll('.av-opt').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');};
    pick.appendChild(b);
  });
  // Category grid
  buildCatGrid();
  // Auto-login
  const sess=getSess();
  if(sess){const acc=getAcc(sess);if(acc){loginSuccess(sess,acc);return;}}
  showS('sAuth');
})();

function buildCatGrid(){
  const grid=document.getElementById('catGrid'); grid.innerHTML='';
  CATEGORIES.forEach((c,i)=>{
    const b=document.createElement('button');
    b.className='cat-btn'+(i===0?' selected':''); b.dataset.cat=c.id;
    b.innerHTML=`<span class="cat-icon">${c.icon}</span><span class="cat-name">${c.name}</span>`;
    b.onclick=()=>{
      document.querySelectorAll('.cat-btn').forEach(x=>x.classList.remove('selected'));
      b.classList.add('selected'); selectedCat=c.id;
    };
    grid.appendChild(b);
  });
}
