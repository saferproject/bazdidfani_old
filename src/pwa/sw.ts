import { precacheAndRoute } from 'workbox-precaching';
import { cleanupOutdatedCaches } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();

precacheAndRoute(self.__WB_MANIFEST);

// Activate a newly installed build without waiting for every open tab to close.
self.skipWaiting();

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
