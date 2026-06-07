import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ui/ThemeToggle";
import { LogOut, User, ChevronLeft, Menu } from "lucide-react";

interface SidebarProps {
  children: React.ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-full">
      <div
        className={`flex flex-col transition-all duration-300 border-r border-white/10 ${
          collapsed ? "w-14" : "w-64"
        }`}
      >
        <div className="p-3 flex items-center justify-between border-b border-white/10">
          {!collapsed && (
            <span className="font-bold text-lg">
              <span className="text-[var(--accent)]">J</span>Z
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer"
          >
            {collapsed ? <Menu size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <div className="flex-1 overflow-hidden">{children}</div>

        <div className="p-3 border-t border-white/10">
          {!collapsed && user && (
            <div className="flex items-center gap-2 px-2 py-1.5 mb-2 rounded-xl bg-white/5">
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full" />
              ) : (
                <User size={16} />
              )}
              <span className="text-xs truncate">{user.email}</span>
            </div>
          )}
          <div className="flex items-center gap-1 justify-center">
            <ThemeToggle />
            <button
              onClick={() => logout()}
              className="p-2 rounded-xl hover:bg-red-500/20 transition-all duration-200 cursor-pointer"
              title="Sign out"
            >
              <LogOut size={16} className="text-red-400" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">{/* Note content rendered by parent */}</div>
    </div>
  );
}
