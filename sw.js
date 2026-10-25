const CACHE_NAME = "journalz-v4";

self.addEventListener("install", (event) => {
  // Keep a copy of the app shell so a first offline visit after installation
  // can still start. A failed pre-cache must not prevent the worker installing.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.add(new URL("./", self.registration.scope)))
      .catch(() => undefined)
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Never intercept writes, cross-origin requests, or non-HTTP schemes. In
  // particular, Firebase requests must keep their normal network behavior.
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  const isNavigation = request.mode === "navigate";
  const isAppAsset = ["script", "style", "image", "font", "manifest"].includes(request.destination);
  if (!isNavigation && !isAppAsset) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(request);
      if (response.ok && response.type === "basic") {
        await cache.put(request, response.clone()).catch(() => undefined);
      }
      return response;
    } catch {
      const cached = await cache.match(request);
      if (cached) return cached;

      if (isNavigation) {
        const appShell = await cache.match(new URL("./", self.registration.scope));
        if (appShell) return appShell;
      }

      return new Response("You are offline and this page is not available yet.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key.startsWith("journalz-") && key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("push", (event) => {
  let data = { title: "JournalZ", body: "" };
  if (event.data) {
    try { data = event.data.json(); } catch { data.body = event.data.text(); }
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: new URL("icon-192.png", self.registration.scope).href,
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(new URL("app", self.registration.scope).href));
});
