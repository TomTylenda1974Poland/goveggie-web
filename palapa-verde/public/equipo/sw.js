// Update the cache name together with the pilot kit assets.
const cacheName = "palapa-cocina-757ff38136";
const assets = [
  "./prueba-de-cocina.html", "./hummus-de-zanahoria.html", "./piloto.css", "./piloto.js", "./offline.js",
  "./zip.min.js", "./plantilla-etiqueta.pdf", "../brand/palapa-verde-es.svg",
].map(path => new URL(path, self.location.href).href);

self.addEventListener("install", event => {
  event.waitUntil(caches.open(cacheName).then(cache => cache.addAll(
    assets.map(url => new Request(url, {cache: "reload"}))
  )));
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith("palapa-cocina-") && name !== cacheName) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || !assets.includes(event.request.url)) return;
  event.respondWith((async () => {
    const stored = await (await caches.open(cacheName)).match(event.request.url);
    return stored || fetch(event.request);
  })());
});
