var cacheName = 'weatherPWA-v1';
var dataCacheName = 'data-weatherPWA-v1';
var baseUrl = 'https://api.openweathermap.org/data/2.5/weather?APPID=3acf6a94d226fdbd6fffc6d6ff885385&units=metric&q=';
var filesToCache = [
    '/',
    '/index.html',
    '/app.js',
    '/js/localforage.js',
];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', function (e) {
    if (e.request.url.startsWith(baseUrl)) {
        e.respondWith(
            fetch(e.request).then(function (respone) {
                return caches.open(dataCacheName).then(function (cache) {
                    cache.put(e.request.url, respone.clone());
                    console.log('[Service Worker] Fetched and Cached', e.request.url);
                    return respone;
                })
            })
        )
    }
    else {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                console.log('[Service Worker] fetched');
                return response || fetch(e.request);
            })
        );
    }


});