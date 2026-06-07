import { useState, useEffect } from "react";
import { X, Share2, ExternalLink } from "lucide-react";

export default function ShareBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("journalz-banner-dismissed");
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("journalz-banner-dismissed", "true");
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-lg animate-fade-in-up">
      <div className="rounded-2xl backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-white/30 dark:border-white/10 shadow-xl px-5 py-4 flex items-start gap-3">
        <Share2 size={18} className="text-[var(--accent)] shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            Love JournalZ? ⭐ Star it on{" "}
            <a
              href="https://github.com/ziaurrehman931554/JournalZ"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent)] hover:underline inline-flex items-center gap-1"
            >
              <ExternalLink size={14} />
              GitHub
            </a>{" "}
            and share it with friends!
          </p>
        </div>
        <button
          onClick={dismiss}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
