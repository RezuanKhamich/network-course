// Service worker: сайт открывается без сети на уже посещённых страницах.
// Страницы — сначала сеть (свежая версия после деплоя), файлы с хешем — сначала кеш, /api/ не трогаем.
const VERSION = 'v1';
const CACHE = `devcourses-${VERSION}`;
const scope = new URL(self.registration.scope);
const OFFLINE = new URL('offline.html', scope).href;

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll([OFFLINE, scope.href])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('devcourses-') && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

async function networkFirst(req){
  const cache = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch {
    return (await cache.match(req, { ignoreSearch: true })) || (await cache.match(OFFLINE));
  }
}

async function cacheFirst(req){
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res.ok) cache.put(req, res.clone());
  return res;
}

async function staleWhileRevalidate(req, e){
  const cache = await caches.open(CACHE);
  const hit = await cache.match(req);
  const fresh = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; });
  if (hit) { e.waitUntil(fresh.catch(() => {})); return hit; }
  return fresh;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // чужие origin (шрифты Google) и API идут мимо: их кеширует браузер, а прогресс — только живой
  if (url.origin !== scope.origin || url.pathname.startsWith(scope.pathname + 'api/')) return;
  if (req.mode === 'navigate') e.respondWith(networkFirst(req));
  else if (url.pathname.startsWith(scope.pathname + 'assets/')) e.respondWith(cacheFirst(req));
  else e.respondWith(staleWhileRevalidate(req, e));
});
