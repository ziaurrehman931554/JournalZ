import { useState, useEffect, useRef } from "react";
import { X, Share2, ExternalLink } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import GlassSurface from "../GlassSurface";

export default function ShareBanner() {
  const [stage, setStage] = useState<"hidden" | "visible" | "exiting">("hidden");
  const { theme } = useTheme();
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsTouch(mq.matches);
  }, []);

  const clear = () => { timersRef.current.forEach(clearTimeout); timersRef.current = []; };
  const timer = (fn: () => void, ms: number) => {
    const id = setTimeout(() => { timersRef.current = timersRef.current.filter(t => t !== id); fn(); }, ms);
    timersRef.current.push(id);
    return id;
  };

  useEffect(() => {
    let dismissed = false;
    try { dismissed = !!sessionStorage.getItem("journalz-banner-dismissed"); } catch {}
    if (dismissed) return;

    timer(() => setStage("visible"), 3000);
    return clear;
  }, []);

  useEffect(() => {
    if (stage !== "visible") return;
    timer(() => setStage("exiting"), 5000);
    return clear;
  }, [stage]);

  useEffect(() => {
    if (stage !== "exiting") return;
    timer(() => {
      setStage("hidden");
      try { sessionStorage.setItem("journalz-banner-dismissed", "true"); } catch {}
    }, 300);
    return clear;
  }, [stage]);

  const dismiss = () => {
    clear();
    setStage("exiting");
    try { sessionStorage.setItem("journalz-banner-dismissed", "true"); } catch {}
  };

  if (stage === "hidden") return null;

  const inner = (
    <div className="flex items-center gap-3 w-full px-1">
      <Share2 size={18} className="text-[var(--accent)] shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          Love JournalZ? ⭐ Star it on{" "}
          <a
            href="https://github.com/ziaurrehman931554/JournalZ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] hover:scale-105 active:scale-95 transition-all duration-200 inline-flex items-center gap-1"
          >
            <ExternalLink size={14} />
            GitHub
          </a>{" "}
          and share it with friends!
        </p>
      </div>
      <button
        onClick={dismiss}
        className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );

  if (isTouch) {
    return (
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-lg transition-all duration-300 ${
          stage === "exiting"
            ? "opacity-0 translate-y-4 pointer-events-none"
            : "animate-fade-in-up"
        }`}
      >
        <div className="rounded-2xl backdrop-blur-2xl bg-[var(--surface-bg)]/70 border border-white/10 shadow-xl px-4 py-3">
          {inner}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-lg transition-all duration-300 ${
        stage === "exiting"
          ? "opacity-0 translate-y-4 pointer-events-none"
          : "animate-fade-in-up"
      }`}
    >
      <GlassSurface borderRadius={16} width="100%" height="auto" dark={theme === "dark"}>
        {inner}
      </GlassSurface>
    </div>
  );
}