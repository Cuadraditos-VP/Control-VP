const CACHE = 'vp-jefes-202609162139';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', (e) => { if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  const isNav = e.request.mode === 'navigate' || (e.request.headers.get('accept') || '').includes('text/html') || url.pathname.endsWith('.html') || url.pathname.endsWith('/');
  if (isNav) {
    e.respondWith(fetch(e.request).then((res) => {
      try { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); } catch (err) {}
      return res;
    }).catch(() => caches.match(e.request).then((c) => c || caches.match('./index.html'))));
    return;
  }
  e.respondWith(fetch(e.request).then((res) => {
    try { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); } catch (err) {}
    return res;
  }).catch(() => caches.match(e.request)));
});
