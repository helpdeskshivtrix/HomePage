/* RoyalRoom service worker: offline app shell. The QR and network libraries are
   built into index.html, so nothing else needs to be cached. Bump VERSION whenever
   you change any file. Chat traffic (WebRTC and the PeerJS signaling socket) never
   goes through the cache. */
const VERSION = 'royalroom-v3';
const SHELL = ['./', './index.html', './manifest.json', './icon.svg'];

self.addEventListener('install', e => {
  // one missing file must not break the install
  e.waitUntil(
    caches.open(VERSION)
      .then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;          // never touch other sites

  // Pages: network first (with a timeout) so updates arrive immediately; cache when offline or slow.
  if (req.mode === 'navigate') {
    e.respondWith(
      new Promise((resolve, reject) => {
        const t = setTimeout(() => caches.match('./index.html').then(h => h && resolve(h)), 6000);
        fetch(req).then(res => {
          clearTimeout(t);
          if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); }
          resolve(res);
        }).catch(() => { clearTimeout(t); caches.match('./index.html').then(h => h ? resolve(h) : reject()); });
      })
    );
    return;
  }

  // Own static files: cache first, refresh in the background.
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res && res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
