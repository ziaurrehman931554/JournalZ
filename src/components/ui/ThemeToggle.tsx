import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl cursor-pointer border border-white/30 dark:border-white/10 bg-[var(--surface-bg)]/60 backdrop-blur-xl text-gray-600 dark:text-gray-400 hover:text-[var(--accent)] hover:scale-110 active:scale-95 transition-all duration-200"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
