/* Service worker: offline app shell + best-effort background backup */
const CACHE = 'wa-clone-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      if (res.ok && new URL(e.request.url).origin === location.origin){
        const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});

/* Background backup: copies current chats over the single internal backup record. */
function openDb(){
  return new Promise((res, rej) => {
    const r = indexedDB.open('wa-clone', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function backupInBackground(){
  const d = await openDb();
  const get = k => new Promise((res, rej) => { const q = d.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); });
  const state = await get('state'); if (!state) return;
  const meta = (await get('meta')) || {};
  if (meta.auto === false) return;
  const now = new Date();
  const payload = { app: 'wa-clone-backup', version: 1, createdAt: now.toISOString(), reason: 'background', state };
  meta.lastBackupAt = payload.createdAt;
  meta.lastBackupDay = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  await new Promise((res, rej) => {
    const t = d.transaction('kv', 'readwrite'), s = t.objectStore('kv');
    s.delete('backup:latest'); s.put(payload, 'backup:latest'); s.put(meta, 'meta');
    t.oncomplete = res; t.onerror = t.onabort = () => rej(t.error);
  });
}
self.addEventListener('periodicsync', e => { if (e.tag === 'midnight-backup') e.waitUntil(backupInBackground()); });
