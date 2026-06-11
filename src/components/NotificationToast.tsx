import { useEffect } from "react";
import { Bell, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import GlassSurface from "./GlassSurface";

interface NotificationToastProps {
  id: string;
  title: string;
  description?: string;
  onDismiss: (id: string) => void;
}

export default function NotificationToast({ id, title, description, onDismiss }: NotificationToastProps) {
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 5000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <div className="animate-slide-down">
      <div className="absolute inset-0 rounded-2xl bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
      <div className="relative z-20">
        <GlassSurface borderRadius={16} width="auto" height="auto" dark={theme === "dark"} padding={0}>
          <div className="flex items-start gap-3 p-4 w-80">
            <div className="shrink-0 w-9 h-9 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Bell size={16} className="text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{title}</p>
              {description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{description}</p>}
            </div>
            <button
              onClick={() => onDismiss(id)}
              className="shrink-0 p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </GlassSurface>
      </div>
    </div>
  );
}
