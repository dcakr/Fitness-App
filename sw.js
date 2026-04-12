const VERSION = 'fitness-v4';

// Install – skip waiting so new SW activates immediately
self.addEventListener('install', e => {
  self.skipWaiting();
});

// Activate – delete old caches, take control of all tabs
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== VERSION).map(k => caches.delete(k))
      ))
      .then(() => clients.claim())
  );
});

// Fetch – Network first, cache as fallback (always fresh when online)
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(VERSION).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
