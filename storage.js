// ══════════════════════════════════════════════
// STORAGE
// ══════════════════════════════════════════════
function getDB(){try{return JSON.parse(localStorage.getItem('kk4_db')||'{}')}catch(e){return{}}}
function saveDB(db){try{localStorage.setItem('kk4_db',JSON.stringify(db))}catch(e){}}
function getAcc(u){return getDB()[u.toLowerCase()]||null;}
function saveAcc(u,d){const db=getDB();db[u.toLowerCase()]=d;saveDB(db);}
function getSess(){try{return localStorage.getItem('kk4_sess')||null}catch(e){return null}}
function setSess(u){try{localStorage.setItem('kk4_sess',u||'')}catch(e){}}

// ══════════════════════════════════════════════
// STATE
// ══════════════════════════════════════════════
let cu=null,cun=null;
let gameMode='solo'; // solo|survival|duel|daily
let selectedCat='umum';
let quiz={questions:[],current:0,score:0,correct:0,streak:0,bestStreak:0,avgTime:[],timer:null,timeLeft:15,answered:false,survivalCount:0};
let duel={p1:{name:'',av:'',score:0},p2:{name:'',av:'',score:0},turn:1,round:0,totalRounds:5};
