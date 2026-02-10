// Service Worker pour EPS PRO - Mode hors ligne
const CACHE_NAME = 'eps-pro-v1';
const urlsToCache = [
  '/',
  '/index.html'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('[Service Worker] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activation...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourne la réponse en cache si elle existe
        if (response) {
          return response;
        }
        
        // Sinon, fait la requête réseau
        return fetch(event.request).then(response => {
          // Ne pas mettre en cache si ce n'est pas une réponse valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone la réponse
          const responseToCache = response.clone();
          
          // Met en cache pour la prochaine fois
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // En cas d'erreur réseau, retourne la page en cache
        return caches.match('/index.html');
      })
  );
});
