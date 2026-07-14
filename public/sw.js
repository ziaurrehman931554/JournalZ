const CACHE_NAME = "journalz-v3";
let appVersion = null;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).then((response) => {
      if (response && response.status === 200) {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
      }
      return response;
    }).catch(async () => {
      const cached = await caches.match(event.request);
      return cached || new Response("Offline", { status: 503 });
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      ),
    ])
  );
});

self.addEventListener("message", (event) => {
  const { type, version } = event.data || {};
  if (type === "check-version") {
    if (appVersion !== null && appVersion !== version) {
      caches.delete(CACHE_NAME).then(() => {
        clients.matchAll().then((clients) => {
          clients.forEach((c) => c.postMessage({ type: "version-mismatch" }));
        });
      });
    }
    appVersion = version;
  }
});

self.addEventListener("push", (event) => {
  let data = { title: "JournalZ", body: "" };
  if (event.data) {
    try { data = event.data.json(); } catch { data.body = event.data.text(); }
  }
  event.waitUntil(
    self.registration.showNotification(data.title, { body: data.body, icon: "/icon-192.png" })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/app"));
});