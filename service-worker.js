const CACHE_NAME = 'investor-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/login.html',
  '/dashboard.html',
  '/profil.html',
  '/penjualan.html',
  '/grafikpenjualan.html',
  '/profilperusahaan.html',
  '/game.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install: cache file-file penting
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: bersihkan cache lama jika ada
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Fetch: jawab dari cache dulu, kalau tidak ada fetch dari jaringan
self.addEventListener('fetch', (evt) => {
  evt.respondWith(
    caches.match(evt.request).then((cached) => {
      return cached || fetch(evt.request).then((response) => {
        // optional: simpan response ke cache dinamis
        return response;
      }).catch(() => {
        // fallback untuk navigation (HTML) jika offline
        if (evt.request.mode === 'navigate' || (evt.request.method === 'GET' && evt.request.headers.get('accept').includes('text/html'))) {
          return caches.match('/login.html');
        }
      });
    })
  );
});