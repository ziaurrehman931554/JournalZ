import type { Note } from "../../types";
import { FileText, CheckSquare, Pin, Trash2 } from "lucide-react";

interface NoteListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export default function NoteList({
  notes,
  selectedNoteId,
  onSelectNote,
  onDeleteNote,
  onTogglePin,
}: NoteListProps) {
  const sorted = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <FileText size={48} className="mb-4 opacity-30" />
        <p className="text-lg font-medium mb-1">No notes yet</p>
        <p className="text-sm">Create your first note to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 p-3 overflow-y-auto h-full">
      {sorted.map((note) => (
        <div
          key={note.id}
          onClick={() => onSelectNote(note.id)}
          className={`group flex items-start gap-3 p-3 rounded-xl hover-pop cursor-pointer transition-all duration-200 ${
            selectedNoteId === note.id
              ? "bg-[var(--accent)]/10 border border-[var(--accent)]/20"
              : "hover:bg-black/5 dark:hover:bg-white/10 border border-transparent"
          }`}
        >
          <div className="mt-0.5">
            {note.type === "checklist" ? <CheckSquare size={16} className="text-yellow-400" /> : <FileText size={16} className="text-[var(--accent)]" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-medium truncate">{note.title || "Untitled"}</h3>
              {note.isPinned && <Pin size={12} className="text-[var(--accent)] shrink-0" />}
            </div>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              {note.content.replace(/<[^>]*>/g, "").slice(0, 80) || "Empty note"}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {new Date(note.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onTogglePin(note.id); }}
              className="p-1 hover:bg-black/5 dark:hover:bg-white/10 hover-pop rounded-lg transition-colors cursor-pointer"
            >
              <Pin size={14} className={note.isPinned ? "text-[var(--accent)]" : ""} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }}
              className="p-1 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
