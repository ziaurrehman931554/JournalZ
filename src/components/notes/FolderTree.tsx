import type { Folder, Note, Reminder } from "../../types";
import {
  Folder as FolderIcon,
  FileText,
  CheckSquare,
  Bell,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";

interface FolderTreeProps {
  folders: Folder[];
  notes: Note[];
  reminders: Reminder[];
  selectedFolderId: string | null;
  selectedView: string;
  collapsed: boolean;
  collapsedFolders: Record<string, boolean>;
  onToggleCollapse: (id: string) => void;
  onSelectFolder: (id: string) => void;
  onSelectView: (view: "notes" | "checklists" | "reminders") => void;
  onAddFolder: (parentId: string | null) => void;
  onDeleteFolder: (id: string) => void;
  onAddReminder: () => void;
  onSelectNote: (id: string) => void;
  onOpenCreateMenu: (e: React.MouseEvent, folderId: string) => void;
}

export default function FolderTree({
  folders,
  notes,
  reminders,
  selectedFolderId,
  selectedView,
  collapsed,
  collapsedFolders,
  onToggleCollapse,
  onSelectFolder,
  onSelectView,
  onAddFolder,
  onDeleteFolder,
  onAddReminder,
  onSelectNote,
  onOpenCreateMenu,
}: FolderTreeProps) {
  if (collapsed) {
    return null;
  }

  const rootFolders = folders.filter((f) => !f.parentId);

  const renderFolder = (folder: Folder, depth: number) => {
    const isCollapsed = collapsedFolders[folder.id] ?? true;
    const subfolders = folders.filter((f) => f.parentId === folder.id);
    const folderNotes = notes.filter((n) => n.folderId === folder.id);
    const totalItems = folderNotes.length + subfolders.reduce((sum, sf) => sum + countItems(sf), 0);

    return (
      <div key={folder.id}>
        <div
          className={`flex items-center gap-1 px-2 py-1.5 text-sm cursor-pointer transition-all duration-200 animate-slide-down ${
            selectedFolderId === folder.id ? "bg-[var(--accent)]/10 font-medium" : "hover:bg-[var(--elevated-bg)]/50"
          } rounded-lg hover-pop`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
          onClick={() => onSelectFolder(folder.id)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCollapse(folder.id); }}
            className="p-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded cursor-pointer"
          >
            <ChevronRight
              size={14}
              className={`transition-transform duration-200 ${!isCollapsed ? "rotate-90" : ""}`}
            />
          </button>
          <FolderIcon size={14} className="shrink-0 text-yellow-400" />
          <span className="truncate flex-1">{folder.name}</span>
          <span className="text-xs text-gray-500 mr-1">{totalItems}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onOpenCreateMenu(e, folder.id); }}
            className="p-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            title="Add"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }}
            className="p-0.5 hover:bg-red-500/20 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            title="Delete"
          >
            <Trash2 size={12} className="text-red-400" />
          </button>
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            {subfolders.map((sf) => renderFolder(sf, depth + 1))}
            {folderNotes.length > 0 && (
              <div className="pt-0.5">
                {folderNotes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer hover:bg-[var(--elevated-bg)]/50 hover-pop rounded-lg transition-all duration-200 animate-slide-down"
                    style={{ paddingLeft: `${12 + (depth + 1) * 16}px` }}
                    onClick={(e) => { e.stopPropagation(); onSelectNote(note.id); }}
                  >
                    {note.type === "checklist" ? (
                      <CheckSquare size={14} className="shrink-0 text-yellow-400" />
                    ) : (
                      <FileText size={14} className="shrink-0 text-[var(--accent)]" />
                    )}
                    <span className="truncate text-gray-700 dark:text-gray-300">{note.title || "Untitled"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const countItems = (folder: Folder): number => {
    const subfolders = folders.filter((f) => f.parentId === folder.id);
    const folderNotes = notes.filter((n) => n.folderId === folder.id);
    return folderNotes.length + subfolders.reduce((sum, sf) => sum + countItems(sf), 0);
  };

  return (
    <div className="flex-1 overflow-y-auto min-h-0 px-2 py-2">
      <div className="space-y-0.5">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer rounded-lg transition-all duration-200 mb-1 ${
            selectedView === "notes" && !selectedFolderId ? "bg-[var(--accent)]/10 font-medium" : "hover:bg-[var(--elevated-bg)]/50"
          } hover-pop`}
          onClick={() => onSelectView("notes")}
        >
          <FileText size={14} className="text-[var(--accent)]" />
          <span>All Notes</span>
          <span className="ml-auto text-xs text-gray-500">{notes.filter((n) => n.type === "note").length}</span>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer rounded-lg transition-all duration-200 ${
            selectedView === "checklists" ? "bg-[var(--accent)]/10 font-medium" : "hover:bg-[var(--elevated-bg)]/50"
          } hover-pop`}
          onClick={() => onSelectView("checklists")}
        >
          <CheckSquare size={14} className="text-green-400" />
          <span>Checklists</span>
          <span className="ml-auto text-xs text-gray-500">{notes.filter((n) => n.type === "checklist").length}</span>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer rounded-lg transition-all duration-200 ${
            selectedView === "reminders" ? "bg-[var(--accent)]/10 font-medium" : "hover:bg-[var(--elevated-bg)]/50"
          } hover-pop`}
          onClick={onAddReminder}
        >
          <Bell size={14} className="text-yellow-400" />
          <span>Reminders</span>
          <span className="ml-auto text-xs text-gray-500">{reminders.length}</span>
        </div>
      </div>

      <div className="mt-3 border-t border-white/10 pt-2">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Folders</span>
          <button
            onClick={() => onAddFolder(null)}
            className="p-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded cursor-pointer hover-pop"
            title="New folder"
          >
            <Plus size={14} />
          </button>
        </div>
        {rootFolders.map((f) => renderFolder(f, 0))}
      </div>
    </div>
  );
}

export function CreateMenu({
  onSelect,
  onClose,
  position,
}: {
  onSelect: (type: "folder" | "note" | "checklist" | "reminder") => void;
  onClose: () => void;
  position: { top: number; left: number };
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 rounded-xl backdrop-blur-2xl bg-[var(--surface-bg)] border border-gray-200/40 dark:border-white/10 shadow-xl overflow-hidden animate-slide-down"
        style={{ top: position.top, left: position.left, minWidth: 140 }}
      >
        <button
          onClick={() => onSelect("folder")}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--elevated-bg)]/70 hover-pop transition-colors cursor-pointer"
        >
          <FolderIcon size={14} className="text-yellow-400" />
          Folder
        </button>
        <button
          onClick={() => onSelect("note")}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--elevated-bg)]/70 hover-pop transition-colors cursor-pointer"
        >
          <FileText size={14} className="text-[var(--accent)]" />
          Note
        </button>
        <button
          onClick={() => onSelect("checklist")}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--elevated-bg)]/70 hover-pop transition-colors cursor-pointer"
        >
          <CheckSquare size={14} className="text-green-400" />
          Checklist
        </button>
        <button
          onClick={() => onSelect("reminder")}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--elevated-bg)]/70 hover-pop transition-colors cursor-pointer"
        >
          <Bell size={14} className="text-yellow-400" />
          Reminder
        </button>
      </div>
    </>
  );
}
