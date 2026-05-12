const CACHE_NAME = 'al-faisaliah-v2';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  // skip cross-origin requests unless they are images
  if (!event.request.url.startsWith(self.location.origin) && !event.request.destination.includes('image')) return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if(!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
      }).catch(() => {
        // Fallback for offline if failing
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});

// Push Notifications Support
self.addEventListener('push', (event) => {
  const title = 'Al-Faisaliah Store';
  const options = {
    body: event.data ? event.data.text() : 'Check out our new premium collections!',
    icon: 'https://placehold.co/192x192/0a0a0a/d4af37.png?text=AF',
    badge: 'https://placehold.co/192x192/0a0a0a/d4af37.png?text=AF'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Background Sync Support
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-updates') {
    console.log('Background sync triggered');
  }
});

// Periodic Background Sync Support
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'content-sync') {
    console.log('Periodic content sync triggered');
  }
});
