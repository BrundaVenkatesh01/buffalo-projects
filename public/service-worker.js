// Service Worker for Buffalo Projects PWA
// Version 1.0.0 - Student-First Edition

const CACHE_NAME = "buffalo-projects-v1";
const DYNAMIC_CACHE = "buffalo-projects-dynamic-v1";

// Core files to cache for offline use - only real files
const STATIC_ASSETS = ["/", "/manifest.json"];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[Service Worker] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error("[Service Worker] Failed to cache static assets:", error);
      }),
  );

  // Force the new service worker to activate
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE;
          })
          .map((cacheName) => {
            console.log("[Service Worker] Removing old cache:", cacheName);
            return caches.delete(cacheName);
          }),
      );
    }),
  );

  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip external requests (like analytics, external APIs)
  if (!url.origin.includes(self.location.origin)) {
    return;
  }

  // Handle API calls differently (network first)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // For everything else, use cache first strategy
  event.respondWith(cacheFirst(request));
});

// Cache first strategy - ideal for static assets
async function cacheFirst(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
      // Return cached version
      return cached;
    }

    // If not in cache, fetch from network
    const response = await fetch(request);

    // Cache successful responses
    if (response.ok) {
      const dynamicCache = await caches.open(DYNAMIC_CACHE);
      dynamicCache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.error("[Service Worker] Cache first failed:", error);

    // Return offline page if available
    const cache = await caches.open(CACHE_NAME);
    const offline = await cache.match("/offline.html");
    if (offline) {
      return offline;
    }

    // Return a basic offline response
    return new Response("Offline - Please check your connection", {
      status: 503,
      statusText: "Service Unavailable",
      headers: new Headers({
        "Content-Type": "text/plain",
      }),
    });
  }
}

// Network first strategy - ideal for API calls
async function networkFirst(request) {
  try {
    // Try network first
    const response = await fetch(request);

    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // If network fails, try cache
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    // Return error response
    return new Response(
      JSON.stringify({
        error: "Offline - Data may be outdated",
        cached: false,
      }),
      {
        status: 503,
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      },
    );
  }
}

// Handle background sync for offline form submissions
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-workspace") {
    event.waitUntil(syncWorkspaceData());
  }
});

async function syncWorkspaceData() {
  try {
    // Get any pending workspace updates from IndexedDB
    // This would sync with your backend when it's available
    console.log("[Service Worker] Syncing workspace data...");
    // Implementation depends on your backend
  } catch (error) {
    console.error("[Service Worker] Sync failed:", error);
  }
}

// Handle push notifications (for future use)
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New update from Buffalo Projects",
    icon: "/icon-192x192.png",
    badge: "/icon-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  event.waitUntil(
    self.registration.showNotification("Buffalo Projects", options),
  );
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(clients.openWindow("/"));
});

console.log("[Service Worker] Loaded successfully");
