// Change this version number (e.g., v2, v3, v4) every time you make a big update to force devices to clear the old cache.
const CACHE_NAME = 'anvg-cache-v2'; 

const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

// 1. Install the Service Worker and save the initial files
self.addEventListener('install', event => {
  self.skipWaiting(); // Forces the new service worker to activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Activate and clear out any old caches immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If the cache name doesn't match our current version, delete it
          if (cacheName !== CACHE_NAME) {
            console.log('Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim(); // Take control of all pages immediately
    })
  );
});

// 3. Network-First Strategy (Always get the latest updates)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // If we successfully got a new version from the internet, save a copy to the cache
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        // ONLY if the user has no internet, load the saved cache
        return caches.match(event.request);
      })
  );
});
