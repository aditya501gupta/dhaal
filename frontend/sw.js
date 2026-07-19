// Minimal offline-friendly cache for the DHAAL shell.
const C = "dhaal-v1";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => { self.clients.claim(); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (u.origin === location.origin && e.request.method === "GET") {
    e.respondWith(
      caches.open(C).then(c => c.match(e.request).then(hit =>
        hit || fetch(e.request).then(res => { c.put(e.request, res.clone()); return res; }).catch(() => hit)
      ))
    );
  }
});
