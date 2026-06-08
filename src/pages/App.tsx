import { AppProvider, useApp } from "../context/AppContext";
import FolderTree from "../components/notes/FolderTree";
import NoteList from "../components/notes/NoteList";
import NoteEditor from "../components/notes/NoteEditor";
import ChecklistEditor from "../components/notes/ChecklistEditor";
import ReminderList from "../components/notes/ReminderList";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Cloud,
  CloudOff,
  RefreshCw,
  User,
} from "lucide-react";
import logo from "../assets/logo.png";

function AppContent() {
  const {
    notes,
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
    deleteNote,
    togglePinNote,
    createFolder,
    deleteFolder,
    completeReminder,
    deleteReminder,
    syncNow,
  } = useApp();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleAddFolder = () => {
    setShowNewFolder(true);
    setNewFolderName("");
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim(), null);
      setShowNewFolder(false);
      setNewFolderName("");
    }
  };

  const handleSelectNote = (id: string) => {
    const note = allNotes.find((n) => n.id === id);
    if (note) setSelectedNote(note);
  };

  const sidebarWidth = sidebarOpen ? "w-64" : "w-12";

  return (
    <div className="h-screen flex">
      <aside
        className={`${sidebarWidth} flex flex-col border-r border-white/10 transition-all duration-300 relative shrink-0`}
      >
        <div className="flex items-center justify-between h-14 px-3 border-b border-white/10">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <img src={logo} alt="JournalZ" className="w-7 h-7 object-contain" />
              <span className="font-bold text-base">
                <span className="text-[var(--accent)]">J</span>ournalZ.
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ml-auto"
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {sidebarOpen && (
          <FolderTree
            folders={folders}
            notes={allNotes}
            reminders={reminders}
            selectedFolderId={selectedFolderId}
            selectedView={selectedView}
            onSelectFolder={setSelectedFolderId}
            onSelectView={setSelectedView}
            onAddFolder={handleAddFolder}
            onDeleteFolder={deleteFolder}
            onAddNote={createNote}
          />
        )}

        <div ref={profileRef} className="mt-auto border-t border-white/10 p-2 relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 transition-all duration-200 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0 overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={16} className="text-[var(--accent)]" />
              )}
            </div>
            {sidebarOpen && (
              <span className="flex-1 truncate text-left">
                {user?.displayName || user?.email?.split("@")[0] || "Account"}
              </span>
            )}
          </button>

          {profileOpen && sidebarOpen && (
            <div className="absolute bottom-full left-2 right-2 mb-2 rounded-xl backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 border border-gray-200/40 dark:border-white/10 shadow-xl overflow-hidden">
              <div className="p-3 border-b border-gray-200/20 dark:border-white/10">
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
                    <span className="ml-auto">
                      {new Date(syncStatus.lastSynced).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <button
                  onClick={syncNow}
                  disabled={syncStatus.isSyncing}
                  className="flex items-center gap-2 text-xs text-[var(--accent)] hover:underline disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw size={12} className={syncStatus.isSyncing ? "animate-spin" : ""} />
                  {syncStatus.isSyncing ? "Syncing..." : "Sync now"}
                </button>
              </div>
              <div className="p-2">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex overflow-hidden">
          {selectedView === "reminders" ? (
            <div className="flex-1 overflow-hidden">
              <ReminderList
                reminders={reminders}
                onComplete={completeReminder}
                onDelete={deleteReminder}
              />
            </div>
          ) : (
            <>
              <div className="w-72 border-r border-white/10 overflow-y-auto">
                <NoteList
                  notes={notes}
                  selectedNoteId={selectedNote?.id || null}
                  onSelectNote={handleSelectNote}
                  onDeleteNote={deleteNote}
                  onTogglePin={togglePinNote}
                />
              </div>
              <div className="flex-1 overflow-hidden">
                {selectedNote ? (
                  selectedNote.type === "checklist" ? (
                    <ChecklistEditor note={selectedNote} onUpdate={updateNote} />
                  ) : (
                    <NoteEditor note={selectedNote} onUpdate={updateNote} />
                  )
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 p-8">
                    <Plus size={48} className="mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-1">Select or create a note</p>
                    <p className="text-sm">
                      Choose a folder and hover over it to create a new note
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {showNewFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="p-6 rounded-2xl backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 border border-gray-200/40 dark:border-white/10 shadow-xl w-80">
            <h3 className="font-semibold mb-4">New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
              placeholder="Folder name..."
              autoFocus
              className="w-full px-3 py-2 rounded-xl bg-blue-100/80 dark:bg-white/5 border border-gray-200/40 dark:border-white/10 outline-none focus:border-[var(--accent)] transition-colors text-sm"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCreateFolder}
                className="flex-1 px-3 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-medium cursor-pointer"
              >
                Create
              </button>
              <button
                onClick={() => setShowNewFolder(false)}
                className="px-3 py-2 rounded-xl hover:bg-white/10 text-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
