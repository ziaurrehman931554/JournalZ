import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ui/ThemeToggle";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/join");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-[var(--accent)]">J</span>ournalZ.
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/app" className="px-4 py-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] font-medium text-sm hover:bg-[var(--accent)]/20 transition-all duration-200">
                My Notes
              </Link>
              <ThemeToggle />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <User size={16} />
                )}
                <span className="text-sm max-w-[100px] truncate">{user.displayName || user.email}</span>
              </div>
              <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-red-500/20 transition-all duration-200 cursor-pointer" title="Sign out">
                <LogOut size={16} className="text-red-400" />
              </button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link to="/join" className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white font-medium text-sm hover:opacity-90 transition-all duration-200">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
