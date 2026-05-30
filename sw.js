const CACHE_NAME = 'nano-transformer-v2';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './transformer.js',
    './manifest.json',
    './icon.svg'
];

self.addEventListener('install', (evt) => {
    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (evt) => {
    evt.respondWith(
        caches.match(evt.request).then((cachedResponse) => {
            return cachedResponse || fetch(evt.request);
        })
    );
});
