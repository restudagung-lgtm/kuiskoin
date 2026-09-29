// ═══════════════════════════════════════════════════════
// 🔥 FIREBASE OVERLAY — Ganti placeholder di bawah ini!
// ═══════════════════════════════════════════════════════

var FIREBASE_CONFIG = {
   apiKey: "AIzaSyBWEPgW8fpHte6xU4XfM3XMXDRLu1BGjt8",
  authDomain: "kuiskoin.firebaseapp.com",
  projectId: "kuiskoin",
  storageBucket: "kuiskoin.firebasestorage.app",
  messagingSenderId: "1023003281263",
  appId: "1:1023003281263:web:56a7a247de273963cd4a9a",
  measurementId: "G-VHBYJEVQZR"
};

// Init Firebase
if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
var fbAuth = firebase.auth();
var fbDb   = firebase.firestore();
var fbUID  = null;
var lbUnsub = null;
var fbReady = false;

// ── Loading helpers ──
function fbShow(msg) {
  var el = document.getElementById('fbLoading');
  var ml = document.getElementById('fbLoadingMsg');
  if (el) el.style.display = 'flex';
  if (ml && msg) ml.textContent = msg;
}
function fbHide() {
  var el = document.getElementById('fbLoading');
  if (el) el.style.display = 'none';
}

// ── Status bar ──
function fbStatus(msg, color) {
  var bar = document.getElementById('fbStatusBar');
  if (!bar) return;
  bar.style.display = msg ? 'block' : 'none';
  bar.style.background = color || 'rgba(0,212,170,.15)';
  bar.style.color = color ? '#fff' : 'var(--accent)';
  bar.textContent = msg;
  if (msg) setTimeout(function(){ bar.style.display='none'; }, 3000);
}

// ── Online/Offline detection ──
function updateFBStatus() {
  var bar = document.getElementById('offlineBar');
  if (!bar) return;
  if (!navigator.onLine) {
    bar.style.display = 'block';
    bar.textContent = '📡 Offline — data tersimpan lokal, sync saat online kembali';
  } else {
    bar.style.display = 'none';
  }
}
window.addEventListener('online',  function(){ updateFBStatus(); if(fbUID && cu) saveCU(); });
window.addEventListener('offline', updateFBStatus);
updateFBStatus();

// ── LOGIN via Firebase Auth ──
function doLogin() {
  var u   = document.getElementById('lUser').value.trim();
  var p   = document.getElementById('lPass').value;
  var err = document.getElementById('lErr');
  if (!u || !p) { err.textContent = 'Isi username dan password!'; return; }
  fbShow('Login...');
  fbAuth.signInWithEmailAndPassword(u.toLowerCase() + '@kuiskoin.app', p)
    .then(function(r) {
      fbUID = r.user.uid;
      return fbDb.collection('users').doc(fbUID).get();
    })
    .then(function(doc) {
      if (doc.exists) {
        var acc = doc.data();
        setSess(u.toLowerCase());
        // Cache ke localStorage
        var local = getDB(); local[u.toLowerCase()] = acc; saveDB(local);
        loginSuccess(u.toLowerCase(), acc);
        fbStatus('✅ Login berhasil!');
      } else {
        err.textContent = 'Data akun tidak ditemukan!';
        fbAuth.signOut();
      }
    })
    .catch(function(e) {
      var code = e.code || '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential' || code === 'auth/invalid-email')
        err.textContent = 'Akun tidak ditemukan.';
      else if (code === 'auth/wrong-password')
        err.textContent = 'Password salah!';
      else if (code === 'auth/network-request-failed') {
        // Fallback ke localStorage
        var acc = getAcc(u);
        if (acc) { setSess(u.toLowerCase()); loginSuccess(u.toLowerCase(), acc); fbStatus('📡 Login offline (data lokal)', '#e6a817'); }
        else err.textContent = 'Tidak ada koneksi & akun belum tersimpan lokal.';
      } else {
        err.textContent = 'Login gagal: ' + (e.message || code);
      }
    })
    .finally(fbHide);
}

// ── REGISTER via Firebase Auth ──
function doRegister() {
  var u   = document.getElementById('rUser').value.trim();
  var p   = document.getElementById('rPass').value;
  var err = document.getElementById('rErr');
  if (!u || !p)        { err.textContent = 'Isi username dan password!'; return; }
  if (u.length < 3)    { err.textContent = 'Username minimal 3 karakter!'; return; }
  if (p.length < 4)    { err.textContent = 'Password minimal 4 karakter!'; return; }
  var av  = (document.querySelector('.av-opt.selected') || {textContent:'🦊'}).textContent;
  fbShow('Mendaftarkan akun...');
  // Cek username unik
  fbDb.collection('usernames').doc(u.toLowerCase()).get()
    .then(function(snap) {
      if (snap.exists) { err.textContent = 'Username sudah dipakai!'; fbHide(); throw 'taken'; }
      return fbAuth.createUserWithEmailAndPassword(u.toLowerCase() + '@kuiskoin.app', p);
    })
    .then(function(r) {
      fbUID = r.user.uid;
      var acc = {
        username: u.toLowerCase(), avatar: av,
        coins: 100, lives: 3, maxLives: 3,
        badges: [], trophies: [], claimedTrophies: [],
        unlockedThemes: ['default'], activeTheme: 'default',
        history: [], gamesPlayed: 0, totalScore: 0, bestScore: 0,
        totalCoinsEarned: 100, perfectCount: 0, bestStreak: 0,
        bestSurvival: 0, duelWins: 0, dailyStreak: 0, dailyPlayed: 0,
        lastDailyDate: '', categoriesPlayed: [], lastChestTime: 0,
        joinDate: new Date().toLocaleDateString('id'), extraTime: 0,
        rp: 0, rankHistory: [], catStats: {},
        soundEnabled: true, godMode: false, isDev: false
      };
      return Promise.all([
        fbDb.collection('users').doc(fbUID).set(acc),
        fbDb.collection('usernames').doc(u.toLowerCase()).set({ uid: fbUID })
      ]).then(function() { return acc; });
    })
    .then(function(acc) {
      setSess(u.toLowerCase());
      var local = getDB(); local[u.toLowerCase()] = acc; saveDB(local);
      loginSuccess(u.toLowerCase(), acc);
      fbStatus('🎉 Akun berhasil dibuat!');
    })
    .catch(function(e) {
      if (e === 'taken') return;
      var code = e.code || '';
      if (code === 'auth/email-already-in-use') err.textContent = 'Username sudah dipakai!';
      else if (code === 'auth/network-request-failed') err.textContent = 'Tidak ada koneksi internet!';
      else err.textContent = 'Registrasi gagal: ' + (e.message || code);
    })
    .finally(fbHide);
}

// ── LOGOUT ──
function doLogout() {
  saveCU();
  setSess('');
  if (lbUnsub) { lbUnsub(); lbUnsub = null; }
  fbAuth.signOut().catch(function(){});
  fbUID = null; cu = null; cun = null;
  applyTheme('default');
  document.getElementById('navR').style.display = 'none';
  document.getElementById('bottomNav').style.display = 'none';
  document.getElementById('lUser').value = '';
  document.getElementById('lPass').value = '';
  showS('sAuth'); switchTab('login');
}

// ── DUAL SAVE: localStorage + Firestore ──
function saveCU() {
  if (!cun || !cu) return;
  // 1. Simpan ke localStorage (instan)
  var local = getDB(); local[cun] = cu; saveDB(local);
  // 2. Sinkron ke Firestore di background
  if (fbUID && navigator.onLine) {
    fbDb.collection('users').doc(fbUID).set(cu)
      .catch(function(e) { console.warn('[FB] saveCU:', e.message); });
  }
}

// ── UPDATE LEADERBOARD di Firestore ──
function updateLeaderboard() {
  if (!fbUID || !cu) return;
  fbDb.collection('leaderboard').doc(fbUID).set({
    username:     cun,
    avatar:       cu.avatar || '🦊',
    bestScore:    cu.bestScore || 0,
    rp:           cu.rp || 0,
    gamesPlayed:  cu.gamesPlayed || 0,
    trophyCount:  (cu.claimedTrophies || []).length,
    bestSurvival: cu.bestSurvival || 0,
    updatedAt:    firebase.firestore.FieldValue.serverTimestamp()
  }).catch(function(e){ console.warn('[FB] LB:', e.message); });
}

// ── REAL-TIME LEADERBOARD ──
function renderLB() {
  var list = document.getElementById('lbList');
  list.innerHTML = '<div style="color:var(--muted);text-align:center;padding:24px">⏳ Memuat leaderboard global...</div>';
  if (lbUnsub) lbUnsub();
  if (!navigator.onLine) { renderLBLocal(); return; }
  lbUnsub = fbDb.collection('leaderboard')
    .orderBy('bestScore', 'desc').limit(20)
    .onSnapshot(function(snap) {
      renderLBData(snap.docs.map(function(d){ return Object.assign({}, d.data(), {uid:d.id}); }));
    }, function() { renderLBLocal(); });
}

function renderLBData(entries) {
  var list = document.getElementById('lbList'); list.innerHTML = '';
  if (!entries.length) {
    list.innerHTML = '<div style="color:var(--muted);text-align:center;padding:30px">Belum ada pemain</div>';
    return;
  }
  entries.forEach(function(e, i) {
    var isMe = e.username === cun;
    var el = document.createElement('div'); el.className = 'lb-item' + (isMe ? ' me' : '');
    var rc = i===0?'gold':i===1?'silver':i===2?'bronze':'';
    var medal = i===0?'🥇':i===1?'🥈':i===2?'🥉':'';
    var rnk = typeof getRankProgress === 'function' ? getRankProgress(e.rp||0).rank : {icon:'⚙️',name:'Iron'};
    el.innerHTML = '<div class="lb-rank '+rc+'">'+(medal||i+1)+'</div>'+
      '<div style="font-size:17px">'+(e.avatar||'🦊')+'</div>'+
      '<div class="lb-name">'+e.username+(isMe?' (Kamu)':'')+
        '<div style="font-size:9px;color:var(--muted)">🏅'+(e.trophyCount||0)+
        ' · '+rnk.icon+' '+rnk.name+'</div></div>'+
      '<div><div class="lb-score">'+(e.bestScore||0)+'</div>'+
      '<div class="lb-coins">'+(e.gamesPlayed||0)+' game</div></div>';
    list.appendChild(el);
  });
}

function renderLBLocal() {
  var db = getDB();
  var entries = Object.keys(db).map(function(u){
    var a = db[u];
    return {username:u, avatar:a.avatar||'🦊', bestScore:a.bestScore||0,
            gamesPlayed:a.gamesPlayed||0, trophyCount:(a.claimedTrophies||[]).length,
            rp:a.rp||0};
  }).sort(function(a,b){ return b.bestScore - a.bestScore; });
  renderLBData(entries);
}

// ── PATCH endGame → update leaderboard setelah selesai ──
var _fbOrigEndGame = endGame;
function endGame() { _fbOrigEndGame(); updateLeaderboard(); }

// ── AUTO-LOGIN via Firebase Auth State ──
fbAuth.onAuthStateChanged(function(user) {
  fbReady = true;
  if (user && !cu) {
    fbUID = user.uid;
    fbShow('Memuat data akun...');
    fbDb.collection('users').doc(fbUID).get()
      .then(function(doc) {
        if (doc.exists) {
          var acc = doc.data();
          var uname = acc.username || user.email.replace('@kuiskoin.app','');
          setSess(uname);
          var local = getDB(); local[uname] = acc; saveDB(local);
          loginSuccess(uname, acc);
        }
      })
      .catch(function() {
        // Fallback offline
        var s = getSess(); if (s) { var a = getAcc(s); if (a) loginSuccess(s, a); }
      })
      .finally(fbHide);
  }
});
