export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  const permission = await Notification.requestPermission();
  return permission === "granted";
}

export function scheduleNotification(
  title: string,
  options?: NotificationOptions,
  delayMs?: number
): void {
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  if (delayMs && delayMs > 0) {
    setTimeout(() => {
      new Notification(title, options);
    }, delayMs);
  } else {
    new Notification(title, options);
  }
}

export function scheduleDailyReminder(
  title: string,
  body: string,
  hour: number,
  minute: number
): () => void {
  const now = new Date();
  const target = new Date();
  target.setHours(hour, minute, 0, 0);

  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }

  const msUntilTarget = target.getTime() - now.getTime();
  const intervalId = setTimeout(() => {
    scheduleNotification(title, { body });
    scheduleDailyReminder(title, body, hour, minute);
  }, msUntilTarget);

  return () => clearTimeout(intervalId);
}

export async function registerServiceWorker(): Promise<void> {
  if ("serviceWorker" in navigator && "SyncManager" in window) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("SW registered:", registration);
    } catch (err) {
      console.error("SW registration failed:", err);
    }
  }
}
