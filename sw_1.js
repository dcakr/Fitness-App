const VERSION = 'fitness-v5';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => clients.claim())
      .then(() => {
        // Force all open tabs to reload
        return clients.matchAll({type:'window'}).then(cls => {
          cls.forEach(c => c.navigate(c.url));
        });
      })
  );
});

// Network first, no caching — always fresh
self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request.clone(), {cache:'no-store'})
      .catch(() => caches.match(e.request))
  );
});
