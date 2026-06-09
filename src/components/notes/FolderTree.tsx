import type { Folder, Note, Reminder } from "../../types";
import GlassSurface from "../GlassSurface";
import { useTheme } from "../../context/ThemeContext";
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
  onSelectNote: (id: string) => void;
  onOpenCreateMenu: (e: React.MouseEvent, folderId: string) => void;
  onOpenBrowse: (type: "notes" | "checklists" | "reminders", folderId: string | null) => void;
}

const iconBtnClass = (isSelected: boolean) =>
  `w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer hover-pop ${
    isSelected
      ? "bg-[var(--accent)]/15 text-[var(--accent)]"
      : "text-gray-400 hover:text-gray-300 hover:bg-[var(--elevated-bg)]/50"
  }`;

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
  onSelectNote,
  onOpenCreateMenu,
  onOpenBrowse,
}: FolderTreeProps) {
  if (collapsed) {
    const rootFolders = folders.filter((f) => !f.parentId);
    return (
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col items-center gap-1 py-3 px-1">
        <button
          onClick={() => { onSelectView("notes"); onOpenBrowse("notes", null); }}
          className={`${iconBtnClass(selectedView === "notes" && !selectedFolderId)} relative`}
          title={`All Notes (${notes.filter(n => n.type === "note").length})`}
        >
          <FileText size={16} />
        </button>
        <button
          onClick={() => { onSelectView("checklists"); onOpenBrowse("checklists", null); }}
          className={`${iconBtnClass(selectedView === "checklists")} relative`}
          title={`Checklists (${notes.filter(n => n.type === "checklist").length})`}
        >
          <CheckSquare size={16} />
        </button>
        <button
          onClick={() => { onOpenBrowse("reminders", null); }}
          className={`${iconBtnClass(selectedView === "reminders")} relative`}
          title={`Reminders (${reminders.length})`}
        >
          <Bell size={16} />
        </button>

        {rootFolders.length > 0 && (
          <div className="w-8 border-t border-white/10 my-2" />
        )}

        <div className="flex flex-col items-center gap-1 w-full">
          {rootFolders.map((folder) => (
            <button
              key={folder.id}
          onClick={() => { onSelectFolder(folder.id); onToggleCollapse(folder.id); }}
              className={`${iconBtnClass(selectedFolderId === folder.id)} relative`}
              title={folder.name}
            >
              <FolderIcon size={16} />
            </button>
          ))}
        </div>

        <button
          onClick={() => onAddFolder(null)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-[var(--elevated-bg)]/50 transition-all duration-200 cursor-pointer relative"
          title="New folder"
        >
          <Plus size={16} />
        </button>
      </div>
    );
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
          className={`flex items-center gap-1 px-2 py-1.5 text-sm cursor-pointer transition-all duration-200 group ${
            selectedFolderId === folder.id ? "bg-[var(--accent)]/10 font-medium" : "hover:bg-[var(--elevated-bg)]/50"
          } rounded-lg hover-pop`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
          onClick={() => { onSelectFolder(folder.id); onToggleCollapse(folder.id); }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCollapse(folder.id); }}
            className="p-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded cursor-pointer hover-pop"
          >
            <ChevronRight
              size={14}
              className={`transition-transform duration-200 ${!isCollapsed ? "rotate-90" : ""}`}
            />
          </button>
          <FolderIcon size={14} className="shrink-0 text-yellow-400" />
          <span className="truncate flex-1">{folder.name}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onOpenCreateMenu(e, folder.id); }}
            className="p-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded cursor-pointer opacity-0 group-hover:opacity-100 hover-pop"
          >
            <Plus size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteFolder(folder.id); }}
            className="p-0.5 hover:bg-red-500/20 rounded cursor-pointer opacity-0 group-hover:opacity-100 mr-1 hover-pop"
            title="Delete"
          >
            <Trash2 size={12} className="text-red-400" />
          </button>
          <span className="text-xs text-gray-500">{totalItems}</span>
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
    <div className="flex flex-col min-h-0 flex-1 px-2 py-2">
      <div className="space-y-0.5 shrink-0">
        <div
          className={`flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer rounded-lg transition-all duration-200 mb-1 ${
            selectedView === "notes" && !selectedFolderId ? "bg-[var(--accent)]/10 font-medium" : "hover:bg-[var(--elevated-bg)]/50"
          } hover-pop`}
          onClick={() => { onSelectView("notes"); onOpenBrowse("notes", null); }}
        >
          <FileText size={14} className="text-[var(--accent)]" />
          <span>All Notes</span>
          <span className="ml-auto text-xs text-gray-500">{notes.filter((n) => n.type === "note").length}</span>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer rounded-lg transition-all duration-200 ${
            selectedView === "checklists" ? "bg-[var(--accent)]/10 font-medium" : "hover:bg-[var(--elevated-bg)]/50"
          } hover-pop`}
          onClick={() => { onSelectView("checklists"); onOpenBrowse("checklists", null); }}
        >
          <CheckSquare size={14} className="text-green-400" />
          <span>Checklists</span>
          <span className="ml-auto text-xs text-gray-500">{notes.filter((n) => n.type === "checklist").length}</span>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer rounded-lg transition-all duration-200 ${
            selectedView === "reminders" ? "bg-[var(--accent)]/10 font-medium" : "hover:bg-[var(--elevated-bg)]/50"
          } hover-pop`}
          onClick={() => onOpenBrowse("reminders", null)}
        >
          <Bell size={14} className="text-yellow-400" />
          <span>Reminders</span>
          <span className="ml-auto text-xs text-gray-500">{reminders.length}</span>
        </div>
      </div>

      <div className="mt-3 border-t border-white/10 pt-2 flex flex-col min-h-0 flex-1">
        <div className="flex items-center justify-between px-2 py-1 shrink-0">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Folders</span>
          <button
            onClick={() => onAddFolder(null)}
            className="p-0.5 hover:bg-black/5 dark:hover:bg-white/10 rounded cursor-pointer hover-pop"
            title="New folder"
          >
            <Plus size={14} />
          </button>
        </div>
        <div className="overflow-y-auto min-h-0 flex-1 -mx-2 px-2">
          {rootFolders.map((f) => renderFolder(f, 0))}
        </div>
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
  const { theme } = useTheme();
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="relative" style={{ top: position.top, left: position.left, position: 'fixed', zIndex: 50, minWidth: 140 }}>
        <div className="absolute inset-0 rounded-xl bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
        <div className="relative z-20">
      <GlassSurface
        borderRadius={12}
        width="auto"
        height="auto"
        className="overflow-hidden animate-slide-down"
        dark={theme === "dark"}
        padding={0}
      >
        <div className="flex flex-col w-full">
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
      </GlassSurface>
      </div>
      </div>
    </>
  );
}
