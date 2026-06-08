import { useState } from "react";
import type { Folder, Note, Reminder } from "../../types";
import { Folder as FolderIcon, FileText, CheckSquare, Bell, ChevronRight, Plus, Trash2 } from "lucide-react";

interface FolderTreeProps {
  folders: Folder[];
  notes: Note[];
  reminders: Reminder[];
  selectedFolderId: string | null;
  selectedView: "notes" | "reminders" | "checklists";
  onSelectFolder: (id: string | null) => void;
  onSelectView: (view: "notes" | "reminders" | "checklists") => void;
  onAddFolder: () => void;
  onDeleteFolder: (id: string) => void;
  onAddNote: (folderId: string, type: "note" | "checklist") => void;
}

export default function FolderTree({
  folders,
  notes,
  reminders,
  selectedFolderId,
  selectedView,
  onSelectFolder,
  onSelectView,
  onAddFolder,
  onDeleteFolder,
  onAddNote,
}: FolderTreeProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const rootFolders = folders.filter((f) => !f.parentId);

  const sidebarItems = [
    { id: "notes" as const, label: "All Notes", icon: FileText, count: notes.length },
    { id: "checklists" as const, label: "Checklists", icon: CheckSquare, count: notes.filter((n) => n.type === "checklist").length },
    { id: "reminders" as const, label: "Reminders", icon: Bell, count: reminders.length },
  ];

  return (
    <div className="flex flex-col h-full gap-1 p-3">
      {sidebarItems.map(({ id, label, icon: Icon, count }) => (
        <button
          key={id}
          onClick={() => { onSelectView(id); onSelectFolder(null); }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
            selectedView === id && !selectedFolderId
              ? "bg-[var(--accent)]/10 text-[var(--accent)]"
              : "hover:bg-white/10"
          }`}
        >
          <Icon size={18} />
          <span className="flex-1 text-left">{label}</span>
          <span className="text-xs text-gray-500">{count}</span>
        </button>
      ))}

      <div className="mt-4 mb-2 flex items-center justify-between px-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Folders</span>
        <button
          onClick={onAddFolder}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-0.5">
        {rootFolders.map((folder) => (
          <FolderRow
            key={folder.id}
            folder={folder}
            folders={folders}
            notes={notes}
            collapsed={collapsed}
            selectedFolderId={selectedFolderId}
            onToggleCollapse={(id) => setCollapsed({ ...collapsed, [id]: !collapsed[id] })}
            onSelectFolder={onSelectFolder}
            onDeleteFolder={onDeleteFolder}
            onAddNote={onAddNote}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
}

function FolderRow({
  folder,
  folders,
  notes,
  collapsed,
  selectedFolderId,
  onToggleCollapse,
  onSelectFolder,
  onDeleteFolder,
  onAddNote,
  depth,
}: {
  folder: Folder;
  folders: Folder[];
  notes: Note[];
  collapsed: Record<string, boolean>;
  selectedFolderId: string | null;
  onToggleCollapse: (id: string) => void;
  onSelectFolder: (id: string | null) => void;
  onDeleteFolder: (id: string) => void;
  onAddNote: (folderId: string, type: "note" | "checklist") => void;
  depth: number;
}) {
  const children = folders.filter((f) => f.parentId === folder.id);
  const hasChildren = children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-200 cursor-pointer group ${
          selectedFolderId === folder.id
            ? "bg-[var(--accent)]/10 text-[var(--accent)]"
            : "hover:bg-white/10"
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => onToggleCollapse(folder.id)}
            className="cursor-pointer"
          >
            <ChevronRight
              size={14}
              className={`transition-transform ${collapsed[folder.id] ? "" : "rotate-90"}`}
            />
          </button>
        ) : (
          <span className="w-[14px]" />
        )}
        <FolderIcon size={16} className="shrink-0" />
        <span
          className="flex-1 truncate"
          onClick={() => onSelectFolder(folder.id)}
        >
          {folder.name}
        </span>
        <span className="text-xs text-gray-500">{notes.filter((n) => n.folderId === folder.id).length}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onAddNote(folder.id, "note"); }}
          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[var(--accent)]/20 rounded transition-all cursor-pointer"
          title="New note"
        >
          <Plus size={12} className="text-[var(--accent)]" />
        </button>
        <button
          onClick={() => onDeleteFolder(folder.id)}
          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-500/20 rounded transition-all cursor-pointer"
        >
          <Trash2 size={12} className="text-red-400" />
        </button>
      </div>
      {!collapsed[folder.id] &&
        children.map((child) => (
          <FolderRow
            key={child.id}
            folder={child}
            folders={folders}
            notes={notes}
            collapsed={collapsed}
            selectedFolderId={selectedFolderId}
            onToggleCollapse={onToggleCollapse}
            onSelectFolder={onSelectFolder}
            onDeleteFolder={onDeleteFolder}
            onAddNote={onAddNote}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}
