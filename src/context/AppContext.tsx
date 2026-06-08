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
  getAllLocalReminders,
  saveReminderLocally,
  deleteLocalReminder,
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
  createNote: (folderId: string, type: "note" | "checklist") => void;
  updateNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;
  createFolder: (name: string, parentId?: string | null) => void;
  deleteFolder: (id: string) => void;
  addReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
  completeReminder: (id: string) => void;
  syncNow: () => Promise<void>;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

function getAllDescendantFolderIds(folders: Folder[], parentId: string): string[] {
  const ids: string[] = [parentId];
  for (const f of folders) {
    if (f.parentId && ids.includes(f.parentId)) {
      ids.push(...getAllDescendantFolderIds(folders, f.id));
    }
  }
  return ids;
}

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
    const [localNotes, localFolders, localReminders] = await Promise.all([
      getAllLocalNotes(),
      getAllLocalFolders(),
      getAllLocalReminders(),
    ]);
    setNotes(localNotes);
    setFolders(localFolders);
    setReminders(localReminders);
  }, []);

  useEffect(() => {
    loadLocalData();
  }, [loadLocalData]);

  useEffect(() => {
    if (user && navigator.onLine) {
      pullFromFirestore(user.uid).then(({ notes: fbNotes, folders: fbFolders, reminders: fbReminders }) => {
        if (fbNotes.length) setNotes(fbNotes);
        if (fbFolders.length) setFolders(fbFolders);
        if (fbReminders.length) setReminders(fbReminders);
      });
    }
  }, [user]);

  const createNote = useCallback(
    async (folderId: string, type: "note" | "checklist") => {
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
      const allFolderIds = getAllDescendantFolderIds(folders, id);
      const noteIdsToDelete = notes
        .filter((n) => n.folderId && allFolderIds.includes(n.folderId))
        .map((n) => n.id);

      for (const fid of allFolderIds) {
        await deleteLocalFolder(fid);
        if (user) await addToSyncQueue("folders", fid, "delete");
      }

      for (const nid of noteIdsToDelete) {
        await deleteLocalNote(nid);
        if (user) await addToSyncQueue("notes", nid, "delete");
      }

      setFolders((prev) => prev.filter((f) => !allFolderIds.includes(f.id)));
      setNotes((prev) => prev.filter((n) => !noteIdsToDelete.includes(n.id)));

      if (selectedFolderId && allFolderIds.includes(selectedFolderId)) {
        setSelectedFolderId(null);
      }
      if (selectedNote && noteIdsToDelete.includes(selectedNote.id)) {
        setSelectedNote(null);
      }
    },
    [user, selectedFolderId, selectedNote, notes, folders]
  );

  const addReminder = useCallback(
    async (reminder: Reminder) => {
      await saveReminderLocally(reminder);
      setReminders((prev) => [...prev, reminder]);
      if (user) {
        await addToSyncQueue("reminders", reminder.id, "create", reminder);
      }
    },
    [user]
  );

  const deleteReminder = useCallback(
    async (id: string) => {
      await deleteLocalReminder(id);
      setReminders((prev) => prev.filter((r) => r.id !== id));
      if (user) {
        await addToSyncQueue("reminders", id, "delete");
      }
    },
    [user]
  );

  const completeReminder = useCallback(
    async (id: string) => {
      const reminder = reminders.find((r) => r.id === id);
      if (reminder) {
        await addReminder({ ...reminder, isCompleted: !reminder.isCompleted });
      }
    },
    [reminders, addReminder]
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
        completeReminder,
        syncNow,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
