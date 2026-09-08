// LOCAL2BRAND Ultra-Fast PWA Service Worker
const CACHE_NAME = 'l2b-pwa-v3';
const STATIC_ASSETS = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-192-maskable.png',
  '/icon-512-maskable.png',
  '/favicon.jpg',
  '/favicon.svg',
  '/logo.jpg'
];

// Install: Pre-cache static icons & manifest only (do NOT pre-cache index.html to avoid stale chunk hashes)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate: Clean up all old caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First for HTML navigation and JS/CSS scripts (prevents MIME type mismatch on new deploys)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Always bypass API calls and analytics
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/socket.io/')) {
    return;
  }

  // 1. Navigation (HTML pages): Network-First with offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 2. Scripts and Styles: Always Network-First (Never return index.html for .js/.css to prevent MIME error)
  if (
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.includes('/assets/')
  ) {
    event.respondWith(
      fetch(event.request).catch((err) => {
        // Return 404 or network error response, NEVER return index.html for JS scripts
        return new Response('Network error loading asset', {
          status: 404,
          statusText: 'Asset Not Found',
          headers: { 'Content-Type': 'text/plain' }
        });
      })
    );
    return;
  }

  // 3. Static Media / Icons: Cache-First
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request);
    })
  );
});
