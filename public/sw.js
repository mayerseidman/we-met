// ══════════════════════════════════════════════════════════════
// public/sw.js
// ══════════════════════════════════════════════════════════════
// Service worker — caches static assets for offline use.
// Keeps the app working at festivals with no signal.

const CACHE_NAME = 'we-met-v1'

const STATIC_ASSETS = [
    '/',
    '/meets',
    '/profile',
    '/connect',
    '/manifest.json',
    '/icons/icon-192.png',
    '/icons/icon-512.png',
]

// Install — cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS)
        })
    )
    self.skipWaiting()
})

// Activate — clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        })
    )
    self.clients.claim()
})

// Fetch — serve from cache, fall back to network
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests and browser extensions
    if (event.request.method !== 'GET') return
    if (!event.request.url.startsWith(self.location.origin)) return

    // Skip Supabase API calls — always go to network
    if (event.request.url.includes('supabase.co')) return

    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request)
        })
    )
})