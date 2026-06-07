/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Note, Folder, Reminder, SyncStatus } from "../types";
import {
  saveNoteLocally,
  getAllLocalNotes,
  deleteLocalNote,
  saveFolderLocally,
  getAllLocalFolders,
  deleteLocalFolder,
  syncToFirestore,
  pullFromFirestore,
  addToSyncQueue,
} from "../services/storage";
import { useAuth } from "./AuthContext";

interface AppContextType {
  notes: Note[];
  allNotes: Note[];
  folders: Folder[];
  reminders: Reminder[];
  selectedNote: Note | null;
  selectedFolderId: string | null;
  selectedView: "notes" | "reminders" | "checklists";
  syncStatus: SyncStatus;
  setSelectedNote: (note: Note | null) => void;
  setSelectedFolderId: (id: string | null) => void;
  setSelectedView: (view: "notes" | "reminders" | "checklists") => void;
  createNote: (folderId: string | null, type: "note" | "checklist") => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  createFolder: (name: string, parentId?: string | null) => void;
  deleteFolder: (id: string) => void;
  addReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
  syncNow: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<"notes" | "reminders" | "checklists">("notes");
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    lastSynced: null,
    isSyncing: false,
    pendingChanges: 0,
  });

  const loadLocalData = useCallback(async () => {
    const [localNotes, localFolders] = await Promise.all([
      getAllLocalNotes(),
      getAllLocalFolders(),
    ]);
    setNotes(localNotes);
    setFolders(localFolders);
  }, []);

  useEffect(() => {
    loadLocalData();
  }, [loadLocalData]);

  useEffect(() => {
    if (user && navigator.onLine) {
      pullFromFirestore(user.uid).then(({ notes: fbNotes, folders: fbFolders }) => {
        if (fbNotes.length) setNotes(fbNotes);
        if (fbFolders.length) setFolders(fbFolders);
      });
    }
  }, [user]);

  const createNote = useCallback(
    async (folderId: string | null, type: "note" | "checklist") => {
      const note: Note = {
        id: crypto.randomUUID(),
        title: "",
        content: "",
        folderId,
        tags: [],
        isEncrypted: false,
        isPinned: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        type,
        checklist: type === "checklist" ? [] : undefined,
      };
      await saveNoteLocally(note);
      setNotes((prev) => [note, ...prev]);
      setSelectedNote(note);
      if (user) {
        await addToSyncQueue("notes", note.id, "create", note);
      }
    },
    [user]
  );

  const updateNote = useCallback(
    async (note: Note) => {
      await saveNoteLocally(note);
      setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
      setSelectedNote(note);
      if (user) {
        await addToSyncQueue("notes", note.id, "update", note);
      }
    },
    [user]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      await deleteLocalNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (selectedNote?.id === id) setSelectedNote(null);
      if (user) {
        await addToSyncQueue("notes", id, "delete");
      }
    },
    [user, selectedNote]
  );

  const togglePinNote = useCallback(
    async (id: string) => {
      const note = notes.find((n) => n.id === id);
      if (note) {
        await updateNote({ ...note, isPinned: !note.isPinned });
      }
    },
    [notes, updateNote]
  );

  const createFolder = useCallback(
    async (name: string, parentId: string | null = null) => {
      const folder: Folder = {
        id: crypto.randomUUID(),
        name,
        parentId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await saveFolderLocally(folder);
      setFolders((prev) => [...prev, folder]);
      if (user) {
        await addToSyncQueue("folders", folder.id, "create", folder);
      }
    },
    [user]
  );

  const deleteFolder = useCallback(
    async (id: string) => {
      await deleteLocalFolder(id);
      setFolders((prev) => prev.filter((f) => f.id !== id));
      setNotes((prev) => prev.map((n) => (n.folderId === id ? { ...n, folderId: null } : n)));
      if (selectedFolderId === id) setSelectedFolderId(null);
      if (user) {
        await addToSyncQueue("folders", id, "delete");
      }
    },
    [user, selectedFolderId]
  );

  const addReminder = useCallback(
    async (reminder: Reminder) => {
      setReminders((prev) => [...prev, reminder]);
      if (user) {
        await addToSyncQueue("reminders", reminder.id, "create", reminder);
      }
    },
    [user]
  );

  const deleteReminder = useCallback(
    async (id: string) => {
      setReminders((prev) => prev.filter((r) => r.id !== id));
      if (user) {
        await addToSyncQueue("reminders", id, "delete");
      }
    },
    [user]
  );

  const syncNow = useCallback(async () => {
    if (!user) return;
    setSyncStatus((prev) => ({ ...prev, isSyncing: true }));
    try {
      await syncToFirestore(user.uid);
      await pullFromFirestore(user.uid);
      setSyncStatus({ lastSynced: Date.now(), isSyncing: false, pendingChanges: 0 });
    } catch {
      setSyncStatus((prev) => ({ ...prev, isSyncing: false }));
    }
  }, [user]);

  const filteredNotes = selectedFolderId
    ? notes.filter((n) => n.folderId === selectedFolderId)
    : notes;

  const viewNotes =
    selectedView === "checklists"
      ? filteredNotes.filter((n) => n.type === "checklist")
      : selectedView === "notes"
        ? filteredNotes
        : filteredNotes;

  return (
    <AppContext.Provider
      value={{
        notes: viewNotes,
        allNotes: notes,
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
        addReminder,
        deleteReminder,
        syncNow,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
