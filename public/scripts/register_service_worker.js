/**
 *  service worker registration
 */


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../service-worker.js')
        .then((registration) => {
            console.log('Service Worker registered:', registration);
            return navigator.serviceWorker.ready;
        })
        .then((registration) => {
            console.log('SyncManager supported');

            // Manually trigger the sync event
            registration.sync.register('sync-data')
                .then(() => {
                    console.log('Sync registered');
                    registration.sync.register('sync-data');
                    console.log('Sync event triggered');
                })
                .catch((error) => {
                    console.error('Failed to trigger sync event:', error);
                });
        })
        .catch((error) => {
            console.error('Service Worker registration or sync registration failed:', error);
        });
} else {
    console.log('Service Worker or SyncManager not supported');
}

