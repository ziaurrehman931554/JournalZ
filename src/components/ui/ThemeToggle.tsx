import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl backdrop-blur-xl bg-blue-100/80 hover-pop transition-all duration-200 dark:bg-white/5 border border-gray-200/40 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200 cursor-pointer"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
