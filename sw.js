const CACHE = 'unsigned-v3';
const FILES = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './js/audio.js',
  './js/data.js',
  './js/engine.js',
  './js/fonts.js',
  './js/games.js',
  './js/lineage.js',
  './js/main.js',
  './js/panels.js',
  './js/scenes-a.js',
  './js/scenes-b.js',
  './js/scenes-c.js',
  './js/story-0-prologue.js',
  './js/story-1-london.js',
  './js/story-2-paris.js',
  './js/story-3-marseille.js',
  './js/story-4-newyork.js',
  './js/story-5-tokyo.js',
  './js/story-6-hongkong.js',
  './js/story-7-jura.js',
  './js/watch.js',
  './icons/icon.svg',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request)));
});
