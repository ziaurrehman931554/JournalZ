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

    const checkForUpdates = () => {
      registration.update().catch(() => {});
    };
    checkForUpdates();
    setInterval(checkForUpdates, 30 * 60 * 1000);
  } catch {
    // service worker registration failed
  }
}