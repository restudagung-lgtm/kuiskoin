// ══════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════
var AVATARS=['🦊','🐯','🐼','🦁','🐸','🐧','🦄','🐙','🐻','🐨'];

var CATEGORIES=[
  {id:'umum',   icon:'🌍', name:'Pengetahuan Umum'},
  {id:'sains',  icon:'🔬', name:'Sains'},
  {id:'sejarah',icon:'🏛️', name:'Sejarah'},
  {id:'hiburan',icon:'🎬', name:'Hiburan'},
  {id:'teknologi',icon:'💻',name:'Teknologi'},
  {id:'matematika',icon:'🔢',name:'Matematika'},
  {id:'geografi',icon:'🗺️',name:'Geografi'},
  {id:'kuliner',icon:'🍜', name:'Kuliner'},
  {id:'olahraga',icon:'⚽',name:'Olahraga'},
  {id:'musik',  icon:'🎵', name:'Musik'},
];

var ALL_BADGES=[
  {id:'first',icon:'🌟',name:'Pertama Kali'},
  {id:'perfect',icon:'💎',name:'Sempurna'},
  {id:'fast',icon:'⚡',name:'Kilat'},
  {id:'rich',icon:'💰',name:'Sultan'},
  {id:'streak3',icon:'🔥',name:'Streak 3'},
  {id:'veteran',icon:'🎖',name:'Veteran'},
  {id:'survivor',icon:'💀',name:'Survivor'},
  {id:'duelist',icon:'⚔️',name:'Duelist'},
  {id:'daily7',icon:'📅',name:'Konsisten'},
];

var ALL_TROPHIES=[
  {id:'t_play5',   icon:'🎮',name:'Pemain Aktif', desc:'Main 5 kali',          stat:'gamesPlayed',     target:5,   reward:100},
  {id:'t_play20',  icon:'🕹️',name:'Addict',       desc:'Main 20 kali',         stat:'gamesPlayed',     target:20,  reward:250, themeUnlock:'ocean'},
  {id:'t_play50',  icon:'👾',name:'Legenda',       desc:'Main 50 kali',         stat:'gamesPlayed',     target:50,  reward:500, themeUnlock:'purple'},
  {id:'t_score100',icon:'🥉',name:'Pejuang',       desc:'Skor 100 dalam 1 sesi',stat:'bestScore',       target:100, reward:50},
  {id:'t_score200',icon:'🥈',name:'Jagoan',        desc:'Skor 200 dalam 1 sesi',stat:'bestScore',       target:200, reward:150, themeUnlock:'sunset'},
  {id:'t_score400',icon:'🥇',name:'Master',        desc:'Skor 400 dalam 1 sesi',stat:'bestScore',       target:400, reward:300, themeUnlock:'rose'},
  {id:'t_coin200', icon:'💵',name:'Kolektor',      desc:'Kumpulkan 200 koin',   stat:'totalCoinsEarned',target:200, reward:80},
  {id:'t_coin1000',icon:'💰',name:'Jutawan',       desc:'Kumpulkan 1000 koin',  stat:'totalCoinsEarned',target:1000,reward:300, themeUnlock:'gold'},
  {id:'t_perfect3',icon:'💎',name:'Triple Perfect',desc:'Sempurna 3 kali',      stat:'perfectCount',    target:3,   reward:400},
  {id:'t_streak10',icon:'🔥',name:'On Fire',       desc:'Streak 10 beruntun',   stat:'bestStreak',      target:10,  reward:200},
  {id:'t_survival20',icon:'💀',name:'Survival King',desc:'Survival 20 soal',   stat:'bestSurvival',    target:20,  reward:300},
  {id:'t_duel5',   icon:'⚔️',name:'Gladiator',    desc:'Menang duel 5 kali',   stat:'duelWins',        target:5,   reward:200},
  {id:'t_daily7',  icon:'📅',name:'Dedikasi',      desc:'Challenge harian 7 kali',stat:'dailyStreak',   target:7,   reward:350},
  {id:'t_allcat',  icon:'🌈',name:'Penjelajah',    desc:'Main semua kategori',  stat:'categoriesPlayed',target:10,  reward:500},
];

var THEMES=[
  {id:'default',name:'Dark Classic',colors:['#0d1117','#00d4aa','#f0c040'],cost:0,   desc:'Tema bawaan'},
  {id:'ocean',  name:'Ocean Blue',  colors:['#0a1628','#0ea5e9','#60a5fa'],cost:200, desc:'Biru laut yang tenang',  lock:'t_play20'},
  {id:'sunset', name:'Sunset Fire', colors:['#0f0a08','#f97316','#fbbf24'],cost:300, desc:'Hangat seperti senja',   lock:'t_score200'},
  {id:'purple', name:'Galaxy',      colors:['#0d0b14','#a855f7','#c084fc'],cost:350, desc:'Misterius seperti galaksi',lock:'t_play50'},
  {id:'rose',   name:'Rose Red',    colors:['#100b0d','#f43f5e','#fb7185'],cost:400, desc:'Berani dan elegan',      lock:'t_score400'},
  {id:'gold',   name:'Gold Rush',   colors:['#0f0e08','#eab308','#fde047'],cost:500, desc:'Mewah seperti emas',     lock:'t_coin1000'},
];
