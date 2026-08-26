const CACHE_NAME = 'polimata-os-v5-network-first';
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
      console.log('📦 Instalando nuevo Service Worker v5 (Network-First)...');
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
            console.log('🧹 Limpiando caché antigua:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia Network-First: intentar siempre red primero cuando hay conexión para obtener las últimas mejoras y Flashcards
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback a memoria local cuando no hay conexión a internet
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
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
