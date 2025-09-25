/* sw.js - place at site root (/) */
const CACHE_NAME = 'app-shell-v1';
const PRECACHE_URLS = [
  '/',                // adjust if your root index is different
  '/index.html',
  '/styles.css',
  '/common.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install: pre-cache app shell
self.addEventListener('install', (event) => {
  self.skipWaiting(); // activate worker immediately after install (optional)
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

// Activate: cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  return self.clients.claim();
});

// Fetch: Cache-first, then network (for same-origin GET requests)
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((response) => {
        // optionally cache runtime GET responses for same-origin
        if (req.url.startsWith(self.location.origin)) {
          caches.open(CACHE_NAME).then((cache) => {
            // put a clone (so response can be used by browser)
            try { cache.put(req, response.clone()); } catch (err) { /* ignore */ }
          });
        }
        return response;
      }).catch(() => {
        // fallback to cached root / offline page if you add one
        return caches.match('/offline.html');
      });
    })
  );
});

// Listen for messages (skip waiting)
self.addEventListener('message', (evt) => {
  if (!evt.data) return;
  if (evt.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
