import { useState, useEffect, useRef, useCallback } from "react";
import type { Reminder } from "../types";
import { playNotificationSound } from "../services/notificationSound";
import { requestNotificationPermission } from "../services/notifications";

interface Toast {
  id: string;
  reminderId: string;
  title: string;
  description?: string;
}

function showOsNotification(title: string, body: string | undefined, tag: string) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.ready.then((reg) => {
      reg.showNotification(title, { body, icon: "/icon-192.png", tag });
    });
  } else {
    new Notification(title, { body, icon: "/icon-192.png" });
  }
}

export function useReminderWatcher(reminders: Reminder[], onUpdate: (r: Reminder) => void) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const notifiedRef = useRef<Set<string>>(new Set());
  const permCheckedRef = useRef(false);

  useEffect(() => {
    if (!permCheckedRef.current) {
      permCheckedRef.current = true;
      requestNotificationPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      for (const r of reminders) {
        if (r.isCompleted) continue;
        if (r.notifiedAt) continue;
        if (r.dueDate > now) continue;
        if (notifiedRef.current.has(r.id)) continue;

        notifiedRef.current.add(r.id);
        playNotificationSound();

        const toastId = crypto.randomUUID();
        setToasts(prev => [...prev, { id: toastId, reminderId: r.id, title: r.title, description: r.description || undefined }]);

        showOsNotification(r.title, r.description || undefined, r.id);

        onUpdate({ ...r, notifiedAt: now });
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [reminders, onUpdate]);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, dismissToast };
}
