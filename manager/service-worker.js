// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open("my-cache").then((cache) => {
//       return cache.addAll([
//         /* Добавьте другие ресурсы, которые вы хотите кэшировать */
//       ]);
//     })
//   );
// });

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch((error) => {
      console.error("Fetch error:", error);
      // Вернуть запасной ресурс или другой fallback
    })
  );
});
