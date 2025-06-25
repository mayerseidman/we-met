// public/sw.js
const CACHE_NAME = "festival-connect-v1";
const STATIC_CACHE_URLS = [
    "/",
    "/profile",
    "/scan",
    "/_next/static/css/",
    "/_next/static/chunks/",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
    console.log("[SW] Installing Service Worker");
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[SW] Caching app shell");
            // Don't fail if some resources don't cache
            return Promise.allSettled(
                STATIC_CACHE_URLS.map((url) =>
                    cache
                        .add(url)
                        .catch((err) =>
                            console.log(`[SW] Failed to cache ${url}:`, err),
                        ),
                ),
            );
        }),
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
    console.log("[SW] Activating Service Worker");
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log("[SW] Deleting old cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                }),
            );
        }),
    );
    self.clients.claim();
});

// Fetch event - serve from cache when offline
self.addEventListener("fetch", (event) => {
    // Only handle GET requests
    if (event.request.method !== "GET") {
        return;
    }

    // Skip non-HTTP requests
    if (!event.request.url.startsWith("http")) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // If we have a cached response, use it
            if (cachedResponse) {
                console.log("[SW] Serving from cache:", event.request.url);
                return cachedResponse;
            }

            // Otherwise, try to fetch from network
            return fetch(event.request)
                .then((response) => {
                    // Don't cache non-successful responses
                    if (
                        !response ||
                        response.status !== 200 ||
                        response.type !== "basic"
                    ) {
                        return response;
                    }

                    // Clone the response for caching
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        // Only cache GET requests for our domain
                        if (
                            event.request.url.startsWith(self.location.origin)
                        ) {
                            console.log("[SW] Caching:", event.request.url);
                            cache.put(event.request, responseToCache);
                        }
                    });

                    return response;
                })
                .catch(() => {
                    // Network failed - if it's a navigation request, serve a basic page
                    if (event.request.mode === "navigate") {
                        return caches.match("/").then((response) => {
                            return (
                                response ||
                                new Response(
                                    "Offline - Service Worker Working!",
                                    {
                                        headers: {
                                            "Content-Type": "text/html",
                                        },
                                    },
                                )
                            );
                        });
                    }

                    // For other requests, just fail
                    throw new Error("Network failed and no cache available");
                });
        }),
    );
});