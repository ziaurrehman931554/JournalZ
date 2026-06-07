/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

type ThemeContextType = {
  theme: ThemeMode;
  accentColor: string;
  setAccentColor: (color: string) => void;
  toggleTheme: () => void;
  toDark: () => void;
  toLight: () => void;
};

const DEFAULT_ACCENT = "#818cf8";

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  accentColor: DEFAULT_ACCENT,
  setAccentColor: () => {},
  toggleTheme: () => {},
  toDark: () => {},
  toLight: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [accentColor, setAccentColor] = useState<string>(DEFAULT_ACCENT);

  useEffect(() => {
    const savedTheme = localStorage.getItem("journalz-theme") as ThemeMode | null;
    const savedAccent = localStorage.getItem("journalz-accent");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    setTheme(savedTheme === "dark" || (!savedTheme && prefersDark) ? "dark" : "light");
    if (savedAccent) setAccentColor(savedAccent);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("journalz-theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("journalz-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accentColor);
    localStorage.setItem("journalz-accent", accentColor);
  }, [accentColor]);

  const toggleTheme = () => setTheme((p) => (p === "light" ? "dark" : "light"));
  const toDark = () => setTheme("dark");
  const toLight = () => setTheme("light");

  return (
    <ThemeContext.Provider value={{ theme, accentColor, setAccentColor, toggleTheme, toDark, toLight }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
