// Mediflow-AI Service Worker
// This file enables PWA install on desktop (Chrome/Edge/Brave requires a SW with fetch handler)
const CACHE_NAME = "mediflow-ai-v1";

const PRECACHE_URLS = [
  "/",
  "/offline",
];

// Install: pre-cache critical assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(() => {
        // Don't fail install if precache fails
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
  );
  self.clients.claim();
});

// Fetch: Network-first strategy with cache fallback
self.addEventListener("fetch", (event) => {
  // Only handle GET requests for same-origin and CDN assets
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Skip Chrome extensions, firebase, and non-http requests
  if (!url.protocol.startsWith("http")) return;
  if (url.hostname.includes("firebaseapp.com")) return;
  if (url.hostname.includes("googleapis.com")) return;
  if (url.hostname.includes("firebase.com")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses for static assets
        if (response.ok && (
          url.pathname.startsWith("/_next/static/") ||
          url.pathname.startsWith("/icons/") ||
          url.pathname.startsWith("/images/") ||
          url.pathname === "/manifest.json"
        )) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache on network failure
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Last resort: return cached root for navigation requests
          if (event.request.mode === "navigate") {
            return caches.match("/") || new Response("Offline", { status: 503 });
          }
          return new Response("Network error", { status: 503 });
        });
      })
  );
});
