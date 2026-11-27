// Offline support: every file the game needs is cached on install, then served from the
// cache. A new deploy changes VERSION, which installs a fresh cache and drops the old one.
const VERSION = 'f496f678ca';
const CACHE = 'starlantern-' + VERSION;
const START = '/game';
const FILES = ['index.html', 'app.js?v=' + VERSION, 'game.js?v=' + VERSION, 'game.wasm?v=' + VERSION, 'vt323.woff2',
  'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'og.png'];

self.addEventListener('install', (e) => {
  const base = new URL('./', self.location);
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(FILES.map((f) => new URL(f, base).href));
    // The page itself, under the address it is opened at.
    const page = await fetch(new URL(START, base).href, { cache: 'reload' });
    if (page.ok) await c.put(new URL(START, base).href, page);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('starlantern-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    if (req.mode === 'navigate') {
      // Fresh page when online (so updates show up), cached page when not.
      try {
        const r = await fetch(req);
        if (r.ok) c.put(new URL(START, new URL('./', self.location)).href, r.clone());
        return r;
      } catch (err) {
        return (await c.match(new URL(START, new URL('./', self.location)).href)) || (await c.match(new URL('index.html', new URL('./', self.location)).href)) || Response.error();
      }
    }
    const hit = await c.match(req);
    if (hit) return hit;
    return fetch(req);
  })());
});
