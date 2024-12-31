const CACHE_NAME = 'thingspeak-pwa-cache-v1';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './icon-192x192.png',
    './icon-512x512.png',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
