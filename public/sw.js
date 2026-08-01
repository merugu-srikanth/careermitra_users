// Self-destroying Service Worker
// This cleans up the old PWA caches and unregisters itself for all users

self.addEventListener('install', (event) => {
  console.log("Installing self-destroying service worker...");
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log("Activating self-destroying service worker...");
  event.waitUntil(
    // 1. Delete all caches
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log("Deleting cache:", cacheName);
          return caches.delete(cacheName);
        })
      );
    })
    // 2. Unregister this service worker
    .then(() => {
      console.log("Unregistering self...");
      return self.registration.unregister();
    })
    // 3. Force all open pages to reload to get the fresh content
    .then(() => {
      return self.clients.matchAll({ type: 'window' });
    })
    .then((clients) => {
      clients.forEach((client) => {
        if (client.url && 'navigate' in client) {
          console.log("Reloading client page:", client.url);
          client.navigate(client.url);
        }
      });
    })
  );
});
