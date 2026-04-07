const CACHE_NAME = "pour-and-serve-v8";

const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
    ])
  );
});

self.addEventListener("fetch", (event) => {
  const requestURL = new URL(event.request.url);

  // Always try network first for app files that change often
  if (
    requestURL.pathname.endsWith("/index.html") ||
    requestURL.pathname.endsWith("index.html") ||
    requestURL.pathname.endsWith("/style.css") ||
    requestURL.pathname.endsWith("style.css") ||
    requestURL.pathname.endsWith("/script.js") ||
    requestURL.pathname.endsWith("script.js") ||
    requestURL.pathname.endsWith("/drinks.json") ||
    requestURL.pathname.endsWith("drinks.json")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache first for more static files
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});