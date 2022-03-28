const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

const self = this;
//install serviceworker service
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("opened cache"); //清除cache后的第一次刷新才会有
      return cache.addAll(urlsToCache);
    })
  );
});
//listen for requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(() => {
      return fetch(event.request).catch(() => {
        caches.match("offline.html");
      });
    })
  );
});
//Acitivate the serviceworker
//只保留最新的指定的cache
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
