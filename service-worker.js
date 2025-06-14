const CACHE_NAME = 'woodworking-demo-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install event: cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())  // Αμέσως activate μετά το install
  );
});

// Activate event: καθάρισμα παλιών caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())  // Άμεσα έλεγχος των clients
  );
});

// Fetch event: προσπαθούμε από cache, μετά fallback σε δίκτυο
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(() => {
        // Προαιρετικό fallback αν θέλεις, πχ για offline σελίδα
        // return caches.match('/offline.html');
      })
  );
});
