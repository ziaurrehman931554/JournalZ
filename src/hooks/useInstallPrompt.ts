import { useState, useEffect } from "react";
import { getDeferredPrompt } from "../main";

interface InstallPromptState {
  canInstall: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  install: () => void;
  dismissed: boolean;
  dismiss: () => void;
}

export function useInstallPrompt(): InstallPromptState {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(() => getDeferredPrompt());
  const [dismissed, setDismissed] = useState(false);

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = () => {
    if (deferredPrompt) {
      (deferredPrompt as any).prompt();
      (deferredPrompt as any).userChoice.then(() => setDeferredPrompt(null));
    }
  };

  const dismiss = () => setDismissed(true);

  const canInstall =
    !!deferredPrompt || (isIOS && !isStandalone);

  return { canInstall, isStandalone, isIOS, install, dismissed, dismiss };
}