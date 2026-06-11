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

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(r.title, { body: r.description || undefined, icon: "/icon-192.png" });
        }

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
