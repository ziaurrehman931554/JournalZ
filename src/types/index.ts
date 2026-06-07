export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  tags: string[];
  isEncrypted: boolean;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
  type: "note" | "checklist";
  checklist?: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  color?: string;
  icon?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Reminder {
  id: string;
  noteId: string;
  title: string;
  description?: string;
  dueDate: number;
  isCompleted: boolean;
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  accentColor: string;
  createdAt: number;
}

export type ThemeMode = "light" | "dark";

export interface SyncStatus {
  lastSynced: number | null;
  isSyncing: boolean;
  pendingChanges: number;
}

export type NoteType = "note" | "checklist";
