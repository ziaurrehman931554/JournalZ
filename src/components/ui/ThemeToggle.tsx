import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl backdrop-blur-xl bg-[var(--elevated-bg)] hover-pop transition-all duration-200 border border-gray-200/40 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
