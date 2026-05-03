/* ═══════════════════════════════════════════════
   SHIVTRIX DASHBOARD PRO — Service Worker v5.0
   Offline-first PWA with network-fallback cache
   ═══════════════════════════════════════════════ */
const CACHE_VER  = 'shivtrix-v5.0';
const STATIC_RES = [
  './',
  './index.html',
  './services.js',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js'
];

// Install — cache static shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VER).then(c => c.addAll(STATIC_RES).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// Activate — purge old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VER).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch — cache-first for static, network-first for APIs
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Never intercept chrome-extension or non-http
  if (!url.protocol.startsWith('http')) return;
  // Fonts & CDN — cache first
  if (url.hostname.includes('fonts.') || url.hostname.includes('cloudflare')) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok) { const c = res.clone(); caches.open(CACHE_VER).then(ca => ca.put(e.request, c)); }
      return res;
    }).catch(() => new Response('', {status: 503}))));
    return;
  }
  // App shell — cache first, network fallback
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok && e.request.method === 'GET') {
        const c = res.clone();
        caches.open(CACHE_VER).then(ca => ca.put(e.request, c));
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});

// Background sync stub (cloud-sync ready)
self.addEventListener('sync', e => {
  if (e.tag === 'shivtrix-sync') {
    e.waitUntil(Promise.resolve()); // Hook cloud sync here
  }
});

// Push notifications stub
self.addEventListener('push', e => {
  if (!e.data) return;
  self.registration.showNotification('Shivtrix', { body: e.data.text(), icon: './icon-192.png' });
});
