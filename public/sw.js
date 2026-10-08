// sw.js - Service Worker pour RainRadar Pro (Cache offline et tuiles)
const CACHE_NAME = 'rainradar-pro-v2.1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Stratégie pour les tuiles radar RainViewer (Cache avec fallback réseau)
  if (request.url.includes('tilecache.rainviewer.com') || request.url.includes('arcgisonline.com')) {
    event.respondWith(
      caches.open('rainradar-tiles').then((cache) =>
        fetch(request)
          .then((response) => {
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cache.match(request))
      )
    );
    return;
  }

  // Requêtes standard : Network-first avec fallback cache
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
