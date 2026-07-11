import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../ui/ThemeToggle";
import GlassSurface from "../GlassSurface";
import { useEffect, useState } from "react";
import { LogOut, User, ExternalLink, LogIn } from "lucide-react";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsTouch(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/join");
  };

  const links = [
    { label: "Features", href: "/#features" },
    { label: "FAQ", href: "/#faq" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "GitHub", href: "https://github.com/ziaurrehman931554/JournalZ", icon: ExternalLink },
  ];

  const inner = (
    <div className="w-full max-w-7xl h-12 flex items-center justify-between px-3">
      <Link to="/" className="flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all duration-200">
        <img src={logo} alt="JournalZ" className="w-8 h-8 object-contain" />
        <span className="font-bold text-lg">
          <span className="text-[var(--accent)]">J</span>ournalZ.
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-1">
        {links.map((l) => {
          const Icon = l.icon;
          const isExternal = l.href.startsWith("http") || l.href.startsWith("mailto");
          const isRoute = l.href.startsWith("/");
          if (isExternal) {
            return (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[var(--accent)] hover:bg-black/5 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                {Icon && <Icon size={14} />}
                {l.label}
              </a>
            );
          }
          if (isRoute) {
            return (
              <Link
                key={l.label}
                to={l.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[var(--accent)] hover:bg-black/5 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                {l.label}
              </Link>
            );
          }
          return (
            <a
              key={l.label}
              href={l.href}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[var(--accent)] hover:bg-black/5 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              {l.label}
            </a>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        {user ? (
          <>
            <Link
              to="/app"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-[var(--accent)] text-white font-medium text-sm hover:scale-105 active:scale-95 transition-all duration-200"
            >
              My Notes
            </Link>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-2xl bg-[var(--surface-bg)] border border-white/10">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
              ) : (
                <User size={16} />
              )}
              <span className="text-sm max-w-[100px] truncate">
                {user.displayName || user.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-red-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              title="Sign out"
            >
              <LogOut size={16} className="text-red-400" />
            </button>
          </>
        ) : (
          <>
            <Link
              to="/join"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[var(--accent)] hover:bg-black/5 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <LogIn size={14} />
              Log in
            </Link>
            <Link
              to="/join"
              className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white font-medium text-sm hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Join for Free
            </Link>
          </>
        )}
      </div>
    </div>
  );

  if (isTouch) {
    return (
      <div className="fixed top-4 left-4 right-4 z-50 rounded-2xl backdrop-blur-2xl bg-[var(--surface-bg)]/70 border border-white/10 shadow-xl">
        {inner}
      </div>
    );
  }

  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <GlassSurface borderRadius={16} dark={theme === "dark"}>
        {inner}
      </GlassSurface>
    </nav>
  );
}