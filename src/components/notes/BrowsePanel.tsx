import type { Note, Folder, Reminder } from "../../types";
import { FileText, CheckSquare, Bell, Folder as FolderIcon, Search, X, Pin, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import GlassSurface from "../GlassSurface";

interface BrowsePanelProps {
  type: "notes" | "checklists" | "reminders";
  folderId: string | null;
  items: Note[];
  reminders: Reminder[];
  folders: Folder[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onSelectReminder: (id: string) => void;
  onClose: () => void;
}

function getFolderPath(folders: Folder[], folderId: string | null): string {
  if (!folderId) return "";
  const folder = folders.find((f) => f.id === folderId);
  if (!folder) return "";
  const parent = folder.parentId ? getFolderPath(folders, folder.parentId) + " > " : "";
  return parent + folder.name;
}

export default function BrowsePanel({
  type,
  folderId,
  items,
  reminders,
  folders,
  selectedNoteId,
  onSelectNote,
  onSelectReminder,
  onClose,
}: BrowsePanelProps) {
  const { theme } = useTheme();
  const [search, setSearch] = useState("");

  let title = type === "notes" ? "All Notes" : type === "checklists" ? "Checklists" : "Reminders";
  if (folderId) {
    const f = folders.find((x) => x.id === folderId);
    if (f) title = f.name;
  }

  const noteFilter = (n: Note) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      (n.folderId && getFolderPath(folders, n.folderId).toLowerCase().includes(q))
    );
  };

  const reminderFilter = (r: Reminder) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return r.title.toLowerCase().includes(q) || (r.description || "").toLowerCase().includes(q) || (r.location || "").toLowerCase().includes(q) || (r.tags || []).some((t) => t.includes(q));
  };

  const sortedNotes = [...items].filter(noteFilter).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  const sortedReminders = [...reminders].filter(reminderFilter).sort((a, b) => a.dueDate - b.dueDate);

  return (
    <GlassSurface borderRadius={16} width="100%" height="100%" dark={theme === "dark"} padding={0}>
      <div className="h-full w-full flex flex-col">
        <div className="flex items-center justify-between px-3 md:px-4 py-3 border-b border-white/10">
        <h2 className="font-semibold text-sm">{title}</h2>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--elevated-bg)]/50 hover-pop transition-colors cursor-pointer">
          <X size={16} />
        </button>
      </div>

      <div className="px-3 md:px-4 py-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--surface-bg)] border border-gray-200/40 dark:border-white/10">
          <Search size={14} className="text-gray-500 shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-500 hover:text-gray-300 cursor-pointer">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 md:px-4 pb-4 space-y-1">
        {type === "reminders" ? (
          sortedReminders.length === 0 ? (
            <p className="text-sm text-gray-500 text-center pt-8">No reminders found</p>
          ) : (
            sortedReminders.map((r) => (
              <button
                key={r.id}
                onClick={() => onSelectReminder(r.id)}
                className="w-full text-left p-3 rounded-xl hover:bg-[var(--elevated-bg)]/50 hover-pop transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <Bell size={16} className="mt-0.5 shrink-0 text-yellow-400" />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${r.isCompleted ? "line-through opacity-50" : ""}`}>
                      {r.title || "Untitled"}
                    </p>
                    {r.description && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{r.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(r.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {r.location && (
                        <span className="flex items-center gap-1">
                          <MapPin size={10} />
                          {r.location}
                        </span>
                      )}
                    </div>
                    {r.tags && r.tags.length > 0 && (
                      <div className="flex gap-1 mt-1.5">
                        {r.tags.map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded-full bg-[var(--accent)]/10 text-[10px] text-[var(--accent)]">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))
          )
        ) : (
          sortedNotes.length === 0 ? (
            <p className="text-sm text-gray-500 text-center pt-8">No notes found</p>
          ) : (
            sortedNotes.map((n) => (
              <button
                key={n.id}
                onClick={() => onSelectNote(n.id)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 hover-pop cursor-pointer group ${
                  selectedNoteId === n.id ? "bg-[var(--accent)]/10" : "hover:bg-[var(--elevated-bg)]/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  {n.type === "checklist" ? (
                    <CheckSquare size={16} className="mt-0.5 shrink-0 text-yellow-400" />
                  ) : (
                    <FileText size={16} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-sm font-medium truncate">{n.title || "Untitled"}</p>
                      {n.isPinned && <Pin size={10} className="text-[var(--accent)] shrink-0" />}
                    </div>
                    {n.folderId && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        <FolderIcon size={10} className="inline mr-1" />
                        {getFolderPath(folders, n.folderId)}
                      </p>
                    )}
                    <p className="text-xs text-gray-600 mt-1">
                      {new Date(n.updatedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )
        )}
      </div>
      </div>
    </GlassSurface>
  );
}
