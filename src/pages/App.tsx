import { AppProvider, useApp } from "../context/AppContext";
import FolderTree, { CreateMenu } from "../components/notes/FolderTree";
import NoteEditor from "../components/notes/NoteEditor";
import ChecklistEditor from "../components/notes/ChecklistEditor";
import ReminderEditor from "../components/notes/ReminderEditor";
import BrowsePanel from "../components/notes/BrowsePanel";
import GlassSurface from "../components/GlassSurface";
import NotificationToast from "../components/NotificationToast";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Cloud,
  CloudOff,
  RefreshCw,
  User,
  FileText,
  CheckSquare,
  Bell,
  Sun,
  Moon,
  Menu,
  X,
} from "lucide-react";
import logo from "../assets/logo.png";
import type { Reminder } from "../types";
import { useReminderWatcher } from "../hooks/useReminderWatcher";

function AppContent() {
  const {
    allNotes,
    folders,
    reminders,
    selectedNote,
    selectedFolderId,
    selectedView,
    syncStatus,
    setSelectedNote,
    setSelectedFolderId,
    setSelectedView,
    createNote,
    updateNote,
    createFolder,
    deleteFolder,
    deleteNote,
    addReminder,
    deleteReminder,
    syncNow,
  } = useApp();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderParent, setNewFolderParent] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [browseClosing, setBrowseClosing] = useState(false);
  const [browseType, setBrowseType] = useState<"notes" | "checklists" | "reminders">("notes");
  const [browseFolderId, setBrowseFolderId] = useState<string | null>(null);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [createMenu, setCreateMenu] = useState<{
    position: { top: number; left: number };
    folderId: string;
  } | null>(null);
  const [profileRect, setProfileRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const { toasts, dismissToast } = useReminderWatcher(reminders, addReminder);
  const [syncToasts, setSyncToasts] = useState<Array<{id: string; title: string; description: string; type: "sync" | "sync-offline"}>>([]);

  const dismissSyncToast = useCallback((id: string) => {
    setSyncToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addSyncToast = (item: string, online: boolean) => {
    const id = crypto.randomUUID();
    const t = online ? "sync" : "sync-offline";
    const status = online ? "synced online" : "saved locally";
    setSyncToasts(prev => [...prev, { id, title: `${item} ${status}`, description: online ? "Changes saved locally and synced to cloud" : "You are offline. Changes saved locally.", type: t }]);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileButtonRef.current && !profileButtonRef.current.contains(e.target as Node) &&
          profileRef.current && !profileRef.current.contains(e.target as Node) &&
          menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleAddFolder = (parentId?: string | null) => {
    setNewFolderParent(parentId ?? null);
    setShowNewFolder(true);
    setNewFolderName("");
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim(), newFolderParent);
      setShowNewFolder(false);
      setNewFolderName("");
    }
  };

  const handleToggleCollapse = (id: string) => {
    setCollapsedFolders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandFolderPath = (folderId: string) => {
    const path: string[] = [];
    let current = folders.find((f) => f.id === folderId);
    while (current) {
      path.unshift(current.id);
      current = current.parentId ? folders.find((f) => f.id === current!.parentId) : undefined;
    }
    if (path.length > 0) {
      setCollapsedFolders((prev) => {
        const next = { ...prev };
        for (const id of path) next[id] = false;
        return next;
      });
    }
  };

  const handleAddNote = (folderId: string, type: "note" | "checklist") => {
    createNote(folderId, type);
    expandFolderPath(folderId);
  };

  const handleOpenCreateMenu = (e: React.MouseEvent, folderId: string) => {
    if (createMenu && createMenu.folderId === folderId) {
      setCreateMenu(null);
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    setCreateMenu({ position: { top: r.bottom + 4, left: r.left }, folderId });
  };

  const handleLogout = async () => {
    try {
      await logout();
      setProfileOpen(false);
    } catch (e) {
      setProfileOpen(false);
    }
  };

  const handleSyncNow = async () => {
    if (!syncStatus.isSyncing) {
      try {
        await syncNow();
        addSyncToast("Sync", navigator.onLine);
      } catch {
        setSyncToasts(prev => [...prev, { id: crypto.randomUUID(), title: "Sync failed", description: "Could not sync with cloud", type: "sync-offline" }]);
      }
    }
  };

  const handleCloseNote = () => {
    if (selectedNote && !selectedNote.title) deleteNote(selectedNote.id);
    setSelectedNote(null);
  };

  const handleCancelReminder = () => {
    if (editingReminder && !editingReminder.title && !editingReminder.description) deleteReminder(editingReminder.id);
    setEditingReminder(null);
  };

  const handleSelectNote = (id: string) => {
    const note = allNotes.find((n) => n.id === id);
    if (note) {
      setSelectedNote(note);
      setCreateMenu(null);
      setBrowseOpen(false);
      setBrowseClosing(false);
    }
  };

  const handleSelectReminder = (id: string) => {
    const r = reminders.find((rem) => rem.id === id);
    if (r) {
      setEditingReminder(r);
      setCreateMenu(null);
      setSelectedView("reminders");
      setBrowseOpen(false);
      setBrowseClosing(false);
    }
  };

  const handleSaveReminder = (reminder: Reminder) => {
    addReminder(reminder);
    setEditingReminder(null);
  };

  const handleDeleteReminder = (id: string) => {
    deleteReminder(id);
    setEditingReminder(null);
  };

  const handleOpenBrowse = (type: "notes" | "checklists" | "reminders", folderId: string | null) => {
    setCreateMenu(null);
    setBrowseType(type);
    setBrowseFolderId(folderId);
    setBrowseClosing(false);
    setBrowseOpen(true);
  };

  const handleCloseBrowse = () => {
    setBrowseClosing(true);
    setTimeout(() => {
      setBrowseOpen(false);
      setBrowseClosing(false);
    }, 200);
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!sidebarOpen) {
      setSidebarOpen(true);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setProfileRect({ top: rect.top, left: rect.left, width: rect.width });
    setProfileOpen(!profileOpen);
  };

  const handleSidebarClick = () => {
    if (!sidebarOpen) {
      setSidebarOpen(true);
    }
  };

  const filteredNotes = browseFolderId
    ? allNotes.filter((n) => n.folderId === browseFolderId && (browseType !== "notes" || n.type === "note"))
    : browseType === "checklists"
      ? allNotes.filter((n) => n.type === "checklist")
      : browseType === "notes"
        ? allNotes.filter((n) => n.type === "note")
        : allNotes;

  const showReminderList = editingReminder || (!browseOpen && selectedView === "reminders");

  return (
    <div className="h-screen overflow-hidden relative">
      <div className="h-full p-3 flex gap-3">
        <div className="relative group shrink-0 h-full hidden md:block">
          <aside
            onClick={handleSidebarClick}
            className={`${sidebarOpen ? "w-60" : "w-14"} flex flex-col transition-all duration-300 relative z-20 h-full`}
          >
            <div className="flex flex-col h-full rounded-2xl backdrop-blur-2xl bg-[var(--surface-bg)] border border-white/10 shadow-xl overflow-hidden">
            <div className={`flex items-center ${sidebarOpen ? "justify-between h-14 px-3" : "justify-center h-14"} border-b border-white/10`}>
              {sidebarOpen && (
                <div className="flex items-center gap-2">
                  <img src={logo} alt="J" className="w-7 h-7 object-contain" />
                  <span className="font-bold text-base">
                    <span className="text-[var(--accent)]">J</span>ournalZ.
                  </span>
                </div>
              )}
              {!sidebarOpen && (
                <img src={logo} alt="J" className="w-6 h-6 object-contain" />
              )}
              {sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-[var(--elevated-bg)]/50 hover-pop transition-colors cursor-pointer"
                  title="Collapse"
                >
                  <ChevronLeft size={16} />
                </button>
              )}
            </div>

        <FolderTree
          folders={folders}
          notes={allNotes}
          reminders={reminders}
          selectedFolderId={selectedFolderId}
          selectedView={selectedView}
          selectedReminderId={editingReminder?.id || null}
          collapsed={!sidebarOpen}
          collapsedFolders={collapsedFolders}
          onToggleCollapse={handleToggleCollapse}
          onSelectFolder={(id) => setSelectedFolderId(id)}
          onSelectView={(view) => setSelectedView(view)}
          onAddFolder={handleAddFolder}
          onDeleteFolder={deleteFolder}
          onSelectNote={handleSelectNote}
          onSelectReminder={handleSelectReminder}
          onOpenCreateMenu={handleOpenCreateMenu}
          onOpenBrowse={handleOpenBrowse}
        />

        <div className="border-t border-white/10 p-2 relative">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <button
                  ref={profileButtonRef}
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl hover:bg-[var(--elevated-bg)]/50 hover-pop transition-all duration-200 cursor-pointer"
                  title="Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} className="text-[var(--accent)]" />
                    )}
                  </div>
                  <span className="truncate max-w-[100px]">
                    {user?.displayName || user?.email?.split("@")[0] || "Account"}
                  </span>
                </button>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 shrink-0 rounded-lg hover:bg-[var(--elevated-bg)]/50 hover-pop transition-colors cursor-pointer"
                title={theme === "dark" ? "Light mode" : "Dark mode"}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-[var(--elevated-bg)]/50 hover-pop transition-colors cursor-pointer"
                title={theme === "dark" ? "Light mode" : "Dark mode"}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <div className="relative">
                <button
                  ref={profileButtonRef}
                  onClick={handleProfileClick}
                  className="p-2 rounded-lg hover:bg-[var(--elevated-bg)]/50 hover-pop transition-colors cursor-pointer"
                  title="Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} className="text-[var(--accent)]" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
        </div>
        </aside>

          {!sidebarOpen && (
            <div className="absolute top-1/2 -translate-y-1/2 -right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
              <button
                onClick={() => setSidebarOpen(true)}
                className="w-5 h-12 flex items-center justify-center rounded-r-xl backdrop-blur-2xl bg-[var(--surface-bg)] border border-white/10 shadow-xl hover:bg-[var(--elevated-bg)]/50 transition-colors cursor-pointer"
                title="Expand"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}

        </div>

        {/* Mobile sidebar drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
            <div className="fixed left-0 top-0 bottom-0 w-60">
            <aside className="flex flex-col h-full relative z-20">
            <div className="flex flex-col h-full rounded-2xl backdrop-blur-2xl bg-[var(--surface-bg)] border border-white/10 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between h-14 px-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <img src={logo} alt="J" className="w-7 h-7 object-contain" />
                <span className="font-bold text-base">
                  <span className="text-[var(--accent)]">J</span>ournalZ.
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[var(--elevated-bg)]/50 hover-pop transition-colors cursor-pointer"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

        <FolderTree
          folders={folders}
          notes={allNotes}
          reminders={reminders}
          selectedFolderId={selectedFolderId}
          selectedView={selectedView}
          selectedReminderId={editingReminder?.id || null}
          collapsed={false}
          collapsedFolders={collapsedFolders}
          onToggleCollapse={handleToggleCollapse}
          onSelectFolder={(id) => setSelectedFolderId(id)}
          onSelectView={(view) => setSelectedView(view)}
          onAddFolder={handleAddFolder}
          onDeleteFolder={deleteFolder}
          onSelectNote={handleSelectNote}
          onSelectReminder={handleSelectReminder}
          onOpenCreateMenu={handleOpenCreateMenu}
          onOpenBrowse={handleOpenBrowse}
        />

        <div className="border-t border-white/10 p-2 relative">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <button
                  ref={profileButtonRef}
                  onClick={handleProfileClick}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-xl hover:bg-[var(--elevated-bg)]/50 hover-pop transition-all duration-200 cursor-pointer"
                  title="Profile"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0 overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} className="text-[var(--accent)]" />
                    )}
                  </div>
                  <span className="truncate max-w-[100px]">
                    {user?.displayName || user?.email?.split("@")[0] || "Account"}
                  </span>
                </button>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 shrink-0 rounded-lg hover:bg-[var(--elevated-bg)]/50 hover-pop transition-colors cursor-pointer"
                title={theme === "dark" ? "Light mode" : "Dark mode"}
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
        </div>
        </div>
        </aside>
        </div>
        </div>
        )}

        {/* Mobile floating toggle button */}
        {!sidebarOpen && !selectedNote && !editingReminder && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-3 left-3 z-40 md:hidden p-2.5 rounded-xl backdrop-blur-2xl bg-[var(--surface-bg)] border border-white/10 shadow-xl hover:bg-[var(--elevated-bg)]/50 transition-all cursor-pointer hover-pop"
            title="Open sidebar"
          >
            <Menu size={20} />
          </button>
        )}

        <div className="flex-1 overflow-hidden rounded-2xl backdrop-blur-2xl bg-[var(--surface-bg)]/60 border border-white/10 shadow-xl">
          {showReminderList && editingReminder ? (
            <ReminderEditor
              reminder={editingReminder}
              onSave={handleSaveReminder}
              onDelete={handleDeleteReminder}
              onCancel={handleCancelReminder}
            />
          ) : selectedNote ? (
            selectedNote.type === "checklist" ? (
              <ChecklistEditor note={selectedNote} onUpdate={updateNote} onClose={handleCloseNote} />
            ) : (
              <NoteEditor note={selectedNote} onUpdate={updateNote} onClose={handleCloseNote} />
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8">
              <div className="flex items-center justify-center gap-3 md:gap-6 mb-8 flex-wrap">
                <button onClick={() => handleOpenBrowse("notes", null)} className="w-20 h-20 md:w-28 md:h-28 flex flex-col items-center justify-center gap-1 md:gap-2 rounded-xl backdrop-blur-2xl bg-[var(--surface-bg)] border border-white/10 hover:border-[var(--accent)]/30 hover-pop transition-all duration-200 cursor-pointer">
                  <FileText size={24} className="md:w-8 md:h-8 text-[var(--accent)]" />
                  <span className="text-[11px] md:text-sm">Notes</span>
                </button>
                <button onClick={() => handleOpenBrowse("checklists", null)} className="w-20 h-20 md:w-28 md:h-28 flex flex-col items-center justify-center gap-1 md:gap-2 rounded-xl backdrop-blur-2xl bg-[var(--surface-bg)] border border-white/10 hover:border-[var(--accent)]/30 hover-pop transition-all duration-200 cursor-pointer">
                  <CheckSquare size={24} className="md:w-8 md:h-8 text-green-400" />
                  <span className="text-[11px] md:text-sm">Checklists</span>
                </button>
                <button onClick={() => handleOpenBrowse("reminders", null)} className="w-20 h-20 md:w-28 md:h-28 flex flex-col items-center justify-center gap-1 md:gap-2 rounded-xl backdrop-blur-2xl bg-[var(--surface-bg)] border border-white/10 hover:border-[var(--accent)]/30 hover-pop transition-all duration-200 cursor-pointer">
                  <Bell size={24} className="md:w-8 md:h-8 text-yellow-400" />
                  <span className="text-[11px] md:text-sm">Reminders</span>
                </button>
              </div>
              <p className="text-lg font-medium mb-1">Select or create a note</p>
              <p className="text-sm">Choose an item from the sidebar to get started</p>
            </div>
          )}
        </div>
      </div>

      {createMenu && (
        <CreateMenu
          position={createMenu.position}
          onSelect={(type) => {
            const fid = createMenu.folderId;
            setCreateMenu(null);
            if (type === "folder") handleAddFolder(fid);
            else if (type === "reminder") {
              setEditingReminder({
                id: crypto.randomUUID(),
                folderId: fid || undefined,
                title: "",
                description: "",
                dueDate: Date.now() + 86400000,
                isCompleted: false,
                createdAt: Date.now(),
              });
            } else handleAddNote(fid, type === "note" ? "note" : "checklist");
          }}
          onClose={() => setCreateMenu(null)}
        />
      )}

      {(browseOpen || browseClosing) && (
        <>
          <div className={`absolute top-3 left-0 right-0 bottom-3 md:left-3 md:w-80 z-40 rounded-2xl bg-[var(--surface-bg)]/20 backdrop-blur-[2px] ${browseClosing ? "animate-fade-out" : "animate-fade-in"}`} />
          <div className={`absolute top-3 left-0 right-0 bottom-3 md:left-3 md:w-80 z-50 rounded-2xl overflow-hidden shadow-2xl ${browseClosing ? "animate-slide-out" : "animate-slide-in"}`}>
          <BrowsePanel
            type={browseType}
            folderId={browseFolderId}
            items={filteredNotes}
            reminders={reminders}
            folders={folders}
            selectedNoteId={selectedNote?.id || null}
            onSelectNote={handleSelectNote}
            onSelectReminder={handleSelectReminder}
            onClose={handleCloseBrowse}
          />
        </div>
        </>
      )}

      {showNewFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0" onClick={() => setShowNewFolder(false)} />
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
            <div className="relative z-20">
          <GlassSurface borderRadius={16} width="auto" height="auto" dark={theme === "dark"} padding={24}>
            <div className="w-full">
            <h3 className="font-semibold mb-4">New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              placeholder="Folder name..."
              autoFocus
              className="w-full px-3 py-2 rounded-xl bg-[var(--surface-bg)]/50 border border-gray-200/40 dark:border-white/10 outline-none focus:border-[var(--accent)] transition-colors text-sm"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCreateFolder}
                className="flex-1 px-3 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 hover-pop transition-all duration-200 cursor-pointer"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewFolder(false)}
                className="px-3 py-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 hover-pop transition-all duration-200 text-sm cursor-pointer"
              >
                Cancel
              </button>
              </div>
            </div>
          </GlassSurface>
          </div>
        </div>
        </div>
      )}

      {profileOpen && profileRect && (
        <div ref={menuRef} className="fixed inset-0 z-50">
          <div className="fixed inset-0" onClick={() => setProfileOpen(false)} />
          <div className="relative" style={{ position: 'fixed', top: profileRect.top - 8, left: Math.max(120, Math.min(profileRect.left + profileRect.width / 2, window.innerWidth - 120)), transform: 'translateX(-50%) translateY(-100%)' }}>
            <div className="absolute inset-0 rounded-xl bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
            <div className="relative z-20">
          <GlassSurface borderRadius={12} width="auto" height="auto" dark={theme === "dark"} padding={0}>
            <div className="w-56">
              <div ref={profileRef} className="p-3 border-b border-gray-200/20 dark:border-white/10">
                <p className="text-sm font-medium truncate">{user?.displayName || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
              </div>
              <div className="p-3 border-b border-gray-200/20 dark:border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {navigator.onLine ? (
                    <Cloud size={12} className="text-green-400" />
                  ) : (
                    <CloudOff size={12} className="text-yellow-400" />
                  )}
                  {navigator.onLine ? "Online" : "Offline"}
                  {syncStatus.lastSynced && (
                    <span className="ml-auto">{new Date(syncStatus.lastSynced).toLocaleTimeString()}</span>
                  )}
                </div>
                <button
                  onClick={handleSyncNow}
                  disabled={syncStatus.isSyncing}
                  className="flex items-center gap-2 text-xs text-[var(--accent)] hover:underline disabled:opacity-50 hover-pop cursor-pointer"
                >
                  <RefreshCw size={12} className={syncStatus.isSyncing ? "animate-spin" : ""} />
                  {syncStatus.isSyncing ? "Syncing..." : "Sync now"}
                </button>
              </div>
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover-pop cursor-pointer"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          </GlassSurface>
          </div>
          </div>
        </div>
      )}

      {/* Notification toasts */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <NotificationToast key={t.id} id={t.id} title={t.title} description={t.description} onDismiss={dismissToast} />
        ))}
        {syncToasts.map((t) => (
          <NotificationToast key={t.id} id={t.id} title={t.title} description={t.description} type={t.type} onDismiss={dismissSyncToast} />
        ))}
      </div>
    </div>
  );
}

export default function AppPage() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
