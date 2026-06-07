import { AppProvider, useApp } from "../context/AppContext";
import FolderTree from "../components/notes/FolderTree";
import NoteList from "../components/notes/NoteList";
import NoteEditor from "../components/notes/NoteEditor";
import ChecklistEditor from "../components/notes/ChecklistEditor";
import Navbar from "../components/layout/Navbar";
import { Plus } from "lucide-react";
import { useState } from "react";

function AppContent() {
  const {
    notes,
    allNotes,
    folders,
    selectedNote,
    selectedFolderId,
    selectedView,
    setSelectedNote,
    setSelectedFolderId,
    setSelectedView,
    createNote,
    updateNote,
    deleteNote,
    togglePinNote,
    createFolder,
    deleteFolder,
  } = useApp();
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

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
    const note = notes.find((n) => n.id === id);
    if (note) setSelectedNote(note);
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden pt-20">
        <div className="w-64 border-r border-white/10 flex flex-col">
          <FolderTree
            folders={folders}
            notes={allNotes}
            selectedFolderId={selectedFolderId}
            selectedView={selectedView}
            onSelectFolder={setSelectedFolderId}
            onSelectView={setSelectedView}
            onAddFolder={handleAddFolder}
            onDeleteFolder={deleteFolder}
            onAddNote={createNote}
          />
          {showNewFolder && (
            <div className="p-3 border-t border-white/10">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
                placeholder="Folder name..."
                autoFocus
                className="w-full px-3 py-2 rounded-xl backdrop-blur-xl bg-blue-100/80 hover-pop transition-all duration-200 dark:bg-white/5 border border-gray-200/40 dark:border-white/10 outline-none focus:border-[var(--accent)] transition-colors text-sm"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleCreateFolder}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-medium cursor-pointer"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowNewFolder(false)}
                  className="px-3 py-1.5 rounded-lg hover:bg-white/10 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

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
                Choose a note from the sidebar or create a new one
              </p>
            </div>
          )}
        </div>
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
