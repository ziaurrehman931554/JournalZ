export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export async function registerServiceWorker(): Promise<void> {
  if (!("serviceWorker" in navigator)) return;

  try {
    const baseUrl = new URL(import.meta.env.BASE_URL, window.location.origin);
    const serviceWorkerUrl = new URL("sw.js", baseUrl);
    const registration = await navigator.serviceWorker.register(serviceWorkerUrl, {
      scope: baseUrl.pathname,
    });

    // Let the browser update the worker on its normal cadence, and check again
    // when connectivity returns. Taking control must not force a page reload.
    window.addEventListener("online", () => {
      registration.update().catch(() => undefined);
    });
    registration.update().catch(() => undefined);
  } catch {
    // service worker registration failed
  }
}
