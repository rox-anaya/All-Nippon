// Change this version number (e.g., v3, v4, v5) whenever you make updates to force devices to clear old cache.
const CACHE_NAME = 'anvg-cache-v3';

// Relative paths ensure offline assets work on custom domains, sub-paths, or Vercel
const urlsToCache = [
  './',
  './index.html',
  './about.html',
  './staff.html',
  './fleet.html',
  './routes.html',
  './ranks.html',
  './training.html',
  './roster.html',
  './events.html',
  './codeshare.html',
  './changelog.html',
  './settings.html',
  './apply.html',
  './style.css',
  './script.js',
  './manifest.json'
];

// 1. Install Event: Cache critical shell files
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 2. Activate Event: Wipe old cache versions instantly
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Network-First with safe fallback for non-GET and cross-origin requests
self.addEventListener('fetch', event => {
  // Only handle standard GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Cache valid first-party responses
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic'
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache when offline
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Fallback to home page if navigating offline
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
