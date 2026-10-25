import { useState, useEffect } from "react";
import { getDeferredPrompt, consumeDeferredPrompt } from "../main";
import type { BeforeInstallPromptEvent } from "../main";

interface InstallPromptState {
  canInstall: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  install: () => void;
  dismissed: boolean;
  dismiss: () => void;
}

export function useInstallPrompt(): InstallPromptState {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => getDeferredPrompt());
  const [dismissed, setDismissed] = useState(false);

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const install = () => {
    const prompt = deferredPrompt || consumeDeferredPrompt();
    if (prompt) {
      void prompt.prompt()
        .then(() => prompt.userChoice)
        .then(() => setDeferredPrompt(null))
        .catch(() => setDeferredPrompt(null));
    }
  };

  const dismiss = () => setDismissed(true);

  const canInstall =
    !!deferredPrompt || (isIOS && !isStandalone);

  return { canInstall, isStandalone, isIOS, install, dismissed, dismiss };
}
