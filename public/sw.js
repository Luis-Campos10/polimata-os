const CACHE_NAME = 'polimata-os-v4';
const ASSETS_TO_CACHE = [
  '/',
  '/hoy',
  '/ruta',
  '/saber',
  '/yo',
  '/manifest.json',
  '/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Guardando respaldo offline PWA en memoria local...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Servir inmediatamente desde memoria local (Cache-First para uso offline sin internet)
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // Si no está en caché, intentar red
      return fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback offline garantizado cuando no hay internet
          return caches.match('/').then((mainCache) => {
            if (mainCache) return mainCache;
            return new Response(
              '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Polímata OS Offline</title></head><body style="background-color:#0f172a;color:#f8fafc;font-family:system-ui,sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;padding:1rem;text-align:center;"><h2>📶 Polímata OS Offline</h2><p style="color:#94a3b8;max-width:400px;">Estás en modo sin conexión. Toda tu información de estudio está guardada localmente en tu celular.</p></body></html>',
              { headers: { 'Content-Type': 'text/html' } }
            );
          });
        });
    })
  );
});
