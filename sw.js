// KuisKoin Service Worker v2.0 — Modular Structure
const CACHE = 'kuiskoin-v2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/variables.css',
  './css/layout.css',
  './css/auth.css',
  './css/game.css',
  './css/panels.css',
  './css/base.css',
  './js/config.js',
  './js/constants.js',
  './js/questions.js',
  './js/storage.js',
  './js/auth.js',
  './js/ui.js',
  './js/home.js',
  './js/game.js',
  './js/shop.js',
  './js/profile.js',
  './js/audio.js',
  './js/dev.js',
  './js/rank.js',
  './js/firebase.js',
  './js/pwa.js',
  './js/init.js',
  'https://fonts.googleapis.com/css2?family=Righteous&family=Nunito:wght@400;600;700;800&display=swap',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS).catch(err => console.warn('[SW]', err)))
    .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (e.request.url.startsWith('chrome-extension')) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fresh = fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => null);
      return cached || fresh || caches.match('./index.html');
    })
  );
});
