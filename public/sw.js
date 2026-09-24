// v2: перестали кешувати особисті сторінки — activate видалить старий кеш v1,
// у якому вони могли залишитися.
const CACHE_NAME = "eventsphere-v2";
const PRECACHE = ["/", "/catalog", "/daily", "/manifest.webmanifest", "/icon.svg"];

// Сторінки з персональними даними не кладемо в кеш: на спільному пристрої
// після виходу з акаунта офлайн-копія показала б їх наступній людині.
const PRIVATE_PREFIXES = [
  "/me", "/dashboard", "/planner", "/messages", "/vendor", "/payment", "/login", "/register",
];

function isPrivate(url) {
  const { pathname } = new URL(url);
  return PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE).catch(() => {}))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Network-first for API and pages, cache fallback offline
self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;
  if (request.url.includes("/api/")) return; // never cache API
  if (new URL(request.url).origin !== self.location.origin) return;
  if (isPrivate(request.url)) return; // особисте — лише з мережі

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, copy).catch(() => {});
          });
        }
        return response;
      })
      .catch(() => caches.match(request).then((r) => r || caches.match("/")))
  );
});
