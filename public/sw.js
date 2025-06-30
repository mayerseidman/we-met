const CACHE_NAME = 'festival-connect-v3';

// Install - just activate, don't pre-cache anything
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  self.skipWaiting();
});

// Activate - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch - simple network-first strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip non-HTTP requests  
  if (!event.request.url.startsWith('http')) return;
  
  // Skip Next.js hot reload files
  if (event.request.url.includes('_next/static/chunks/webpack') ||
      event.request.url.includes('react-refresh') ||
      event.request.url.includes('_buildManifest') ||
      event.request.url.includes('_ssgManifest')) {
    return; // Let these go to network normally
  }

  event.respondWith(
    // Try network first
    fetch(event.request)
      .then((response) => {
        // If successful, cache it for later
        if (response && response.status === 200) {
          // Only cache our main pages and basic assets
          if (event.request.url.includes(self.location.origin) &&
              (event.request.url.endsWith('/') || 
               event.request.url.endsWith('/profile') ||
               event.request.url.endsWith('/scan') ||
               event.request.url.includes('.css') ||
               (event.request.url.includes('.js') && 
                !event.request.url.includes('_next/static/chunks/pages') &&
                !event.request.url.includes('webpack')))) {
            
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
        }
        return response;
      })
      .catch(() => {
        // Network failed - try cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] Serving from cache:', event.request.url);
            return cachedResponse;
          }
          
          // If it's a page navigation and we have nothing cached, 
          // return a basic offline page
          if (event.request.mode === 'navigate') {
            return new Response(`
              <!DOCTYPE html>
              <html>
                <head><title>Festival Connect - Offline</title></head>
                <body style="font-family: Arial; text-align: center; padding: 50px;">
                  <h1>You're Offline</h1>
                  <p>Festival Connect will work once you're back online!</p>
                  <p>Your saved connections are safe in your device storage.</p>
                </body>
              </html>
            `, {
              headers: { 'Content-Type': 'text/html' }
            });
          }
          
          // For other requests, just fail
          return new Response('Offline', { status: 503 });
        });
      })
  );
});