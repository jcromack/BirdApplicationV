/**
 * service worker handles offline functionality by opening offline.html
 * when user is offline
 *
 */


let cache = null;
let dataCacheName = 'offlineData-v1';
let cacheName = 'offline-cache-v1';
let filesToCache = [
    '/',
    '/favicon.ico',
    '/scripts/offline_post_form.js',
    '/scripts/chatroom.js'
];


self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cacheX) {
            // cache offline page
            cache = cacheX;
            cache.add(new Request("/offline.html")).then(() => {
                console.log('[ServiceWorker] Caching app shell');
                return cache.addAll(filesToCache);
            });
        }).catch((err) => {
            console.log(`Error: ${err}`);
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
    return self.clients.claim();
});

/**
 * fetch for offline, make sure it only runs on appropriate sites
 *
 */
self.addEventListener('fetch', function (event) {
    // Get the request URL pathname
    const requestUrl = new URL(event.request.url);
    const requestPathname = requestUrl.pathname;

    // Make sure it doesnt run on wrong pages to not break other features like chat
    if ((requestPathname.includes('/homepage')) || (requestPathname.includes('/home')) || (requestPathname.includes('/offline')) || (requestPathname.includes('/create'))) {
        // Service worker logic for the specific page
        event.respondWith(
            caches.match(event.request).then(function (response) {
                // Serve the cached response if it exists, otherwise fetch it from the network
                return response || fetch(event.request).then(function (networkResponse) {
                    var responseClone = networkResponse.clone();
                    caches.open(cacheName).then(function (cache) {
                        cache.put(event.request, responseClone);
                    });
                    return networkResponse;
                });
            }).catch(function () {
                return caches.match('/offline.html');
            })
        );
    }
});


self.addEventListener('sync', function (event) {
    if (event.tag === 'sync-data') {
        event.waitUntil(sendDataToServer());
    }
});

function sendDataToServer() {
    return new Promise((resolve, reject) => {

        const transaction = db.transaction('posts', 'readwrite');
        const objectStore = transaction.objectStore('posts');
        const getAllRequest = objectStore.getAll();
        console.log("Is this function called??")
        getAllRequest.onsuccess = function (event) {
            const data = event.target.result;
            console.log("Is data sent to server??")
            fetch('/createpost', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                // Handle the response from the server if needed
                resolve();
            }).catch(function (error) {
                // Handle the error if the request fails
                console.error('Error sending data to server:', error);
                reject(error);
            });
        };

        getAllRequest.onerror = function (event) {
            reject(event.target.error);
        };
    });
}

