/*
 * Lucero (demo) service worker: the PWA shell works offline and loads fast.
 * - Hashed build files (/_next/static/) and images: cache first (they never change under the same name).
 * - Pages: network first, the cached copy when there is no connection.
 * Nothing private is cached: the site is static and public. Bump VERSION to drop old caches.
 */
const VERSION = 'lucero-v1';
const scope = self.registration.scope;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll([new URL('es/local/', scope).href]).catch(() => {})));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const isAsset = url.pathname.includes('/_next/static/') || /\.(webp|png|svg|jpg|woff2?)$/.test(url.pathname);
  if (isAsset) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(VERSION).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
    return;
  }
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match(new URL('es/local/', scope).href))),
    );
  }
});
