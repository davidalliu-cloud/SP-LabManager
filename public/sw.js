// Offline support for the technician app.
//
// The manifest promises "Log in, find your assigned tests, and submit results
// from the field." The previous version cached four icons and nothing else, and
// its offline fallback pointed at "/tech" — a URL nothing ever put in the cache,
// so the fallback resolved to nothing and a technician underground got a blank
// screen. This version caches the app shell as it is used, and actually stores
// the /tech document so the fallback has something to serve.

const VERSION = "v2";
const SHELL_CACHE = `sarp-lab-shell-${VERSION}`;
const ASSET_CACHE = `sarp-lab-assets-${VERSION}`;
const OFFLINE_URL = "/tech";

const STATIC_ASSETS = [
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/brand/sarp-logo.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const assets = await caches.open(ASSET_CACHE);
      await assets.addAll(STATIC_ASSETS).catch(() => undefined);
      // Seed the offline fallback so it exists before the first outage,
      // rather than only after a lucky online visit.
      const shell = await caches.open(SHELL_CACHE);
      await shell.add(new Request(OFFLINE_URL, { cache: "reload" })).catch(() => undefined);
    })()
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== SHELL_CACHE && key !== ASSET_CACHE).map((key) => caches.delete(key)));
      await self.clients.claim();
    })()
  );
});

/** Next.js build output is content-hashed, so it can be cached hard. */
function isBuildAsset(url) {
  return url.pathname.startsWith("/_next/static/");
}

function isStaticAsset(url) {
  return STATIC_ASSETS.includes(url.pathname) || url.pathname.startsWith("/icons/") || url.pathname.startsWith("/brand/");
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache API or auth traffic - stale lab data is worse than none.
  if (url.pathname.startsWith("/api/")) return;

  // Page loads: network first so technicians always get the current app, with
  // the cached copy as the fallback. Successful responses refresh the fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          const shell = await caches.open(SHELL_CACHE);
          shell.put(OFFLINE_URL, response.clone()).catch(() => undefined);
          return response;
        } catch (error) {
          const cached = (await caches.match(request)) || (await caches.match(OFFLINE_URL));
          if (cached) return cached;
          throw error;
        }
      })()
    );
    return;
  }

  // Hashed build assets: cache first, and fill the cache as they are requested.
  // Without these the shell cannot boot offline, however well the page is cached.
  if (isBuildAsset(url)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(SHELL_CACHE);
          cache.put(request, response.clone()).catch(() => undefined);
        }
        return response;
      })()
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(ASSET_CACHE);
          cache.put(request, response.clone()).catch(() => undefined);
        }
        return response;
      })()
    );
  }
});
