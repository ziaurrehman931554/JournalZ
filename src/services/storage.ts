import { openDB, type IDBPDatabase } from "idb";
import { db as firestore } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  writeBatch,
} from "firebase/firestore";
import type { Note, Folder, Reminder } from "../types";

const DB_NAME = "journalz";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("notes")) {
          db.createObjectStore("notes", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("folders")) {
          db.createObjectStore("folders", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("reminders")) {
          db.createObjectStore("reminders", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("syncQueue")) {
          db.createObjectStore("syncQueue", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveNoteLocally(note: Note): Promise<void> {
  const db = await getDB();
  await db.put("notes", { ...note, updatedAt: Date.now() });
}

export async function getLocalNote(id: string): Promise<Note | undefined> {
  const db = await getDB();
  return db.get("notes", id);
}

export async function getAllLocalNotes(): Promise<Note[]> {
  const db = await getDB();
  return db.getAll("notes");
}

export async function deleteLocalNote(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("notes", id);
}

export async function saveFolderLocally(folder: Folder): Promise<void> {
  const db = await getDB();
  await db.put("folders", { ...folder, updatedAt: Date.now() });
}

export async function getAllLocalFolders(): Promise<Folder[]> {
  const db = await getDB();
  return db.getAll("folders");
}

export async function deleteLocalFolder(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("folders", id);
}

export async function saveReminderLocally(reminder: Reminder): Promise<void> {
  const db = await getDB();
  await db.put("reminders", reminder);
}

export async function getAllLocalReminders(): Promise<Reminder[]> {
  const db = await getDB();
  return db.getAll("reminders");
}

export async function deleteLocalReminder(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("reminders", id);
}

type SyncAction = "create" | "update" | "delete";

export async function addToSyncQueue(
  collection: string,
  docId: string,
  action: SyncAction,
  data?: unknown
): Promise<void> {
  const db = await getDB();
  await db.add("syncQueue", { collection, docId, action, data, timestamp: Date.now() });
}

export async function getSyncQueue(): Promise<unknown[]> {
  const db = await getDB();
  return db.getAll("syncQueue");
}

export async function clearSyncQueue(): Promise<void> {
  const db = await getDB();
  await db.clear("syncQueue");
}

export async function clearAllLocalData(): Promise<void> {
  const db = await getDB();
  await db.clear("notes");
  await db.clear("folders");
  await db.clear("reminders");
  await db.clear("syncQueue");
}

export async function syncToFirestore(userId: string): Promise<void> {
  const queue = await getSyncQueue();
  if (queue.length === 0) return;

  const batch = writeBatch(firestore);

  for (const item of queue as Array<{
    collection: string;
    docId: string;
    action: SyncAction;
    data?: Note | Folder | Reminder;
  }>) {
    const ref = doc(firestore, `users/${userId}/${item.collection}`, item.docId);
    if (item.action === "delete") {
      batch.delete(ref);
    } else if (item.data) {
      batch.set(ref, { ...item.data, userId, syncedAt: Date.now() });
    }
  }

  await batch.commit();
  await clearSyncQueue();
}

export async function pullFromFirestore(userId: string): Promise<{
  notes: Note[];
  folders: Folder[];
  reminders: Reminder[];
}> {
  const results = { notes: [] as Note[], folders: [] as Folder[], reminders: [] as Reminder[] };

  for (const coll of ["notes", "folders", "reminders"] as const) {
    const q = query(collection(firestore, `users/${userId}/${coll}`));
    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Note & Folder & Reminder));

    const db = await getDB();
    for (const item of items) {
      await db.put(coll, item);
    }

    if (coll === "notes") results.notes = items as Note[];
    else if (coll === "folders") results.folders = items as Folder[];
    else results.reminders = items as Reminder[];
  }

  return results;
}
