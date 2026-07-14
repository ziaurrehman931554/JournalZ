const APP_VERSION = "v3.1";

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
    const registration = await navigator.serviceWorker.register("/sw.js");

    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });

    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "version-mismatch") {
        window.location.reload();
      }
    });

    if (registration.active) {
      registration.active.postMessage({ type: "check-version", version: APP_VERSION });
    }
    registration.installing?.postMessage({ type: "check-version", version: APP_VERSION });

    const checkForUpdates = () => {
      registration.update().catch(() => {});
    };
    checkForUpdates();
    setInterval(checkForUpdates, 5 * 60 * 1000);
  } catch {
    // service worker registration failed
  }
}