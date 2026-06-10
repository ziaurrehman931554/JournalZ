import type { Note, ChecklistItem } from "../../types";
import { Plus, Trash2, GripVertical, X, MoreHorizontal, Check, Loader, AlertCircle, Lock, Share2, Search, Pin } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";
import GlassSurface from "../GlassSurface";

interface NoteEditorProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onClose?: () => void;
}

export default function NoteEditor({ note, onUpdate, onClose }: NoteEditorProps) {
  const { theme } = useTheme();
  const [text, setText] = useState(note.title + (note.content ? "\n" + note.content : ""));
  const [title, setTitle] = useState(note.title);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(note.checklist || []);
  const [newItemText, setNewItemText] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [displayStatus, setDisplayStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showMenu, setShowMenu] = useState(false);
  const [menuClosing, setMenuClosing] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setText(note.title + (note.content ? "\n" + note.content : ""));
    setTitle(note.title);
    setChecklist(note.checklist || []);
    setSaveStatus("idle");
    setDisplayStatus("idle");
    setShowMenu(false);
    setMenuClosing(false);
    textareaRef.current?.focus();
  }, [note.id]);

  useEffect(() => {
    if (saveStatus !== "idle") {
      setDisplayStatus(saveStatus);
    } else {
      const t = setTimeout(() => setDisplayStatus("idle"), 150);
      return () => clearTimeout(t);
    }
  }, [saveStatus]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (showMenu &&
          menuRef.current && !menuRef.current.contains(e.target as Node) &&
          moreBtnRef.current && !moreBtnRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMenu]);

  const closeMenu = () => {
    setMenuClosing(true);
    setTimeout(() => {
      setShowMenu(false);
      setMenuClosing(false);
    }, 150);
  };

  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus("saving");
    saveTimer.current = setTimeout(async () => {
      try {
        if (note.type === "checklist") {
          await onUpdate({
            ...note,
            title,
            content: "",
            checklist,
            updatedAt: Date.now(),
          });
        } else {
          const lines = text.split("\n");
          const newTitle = lines[0] || "";
          const newContent = lines.slice(1).join("\n");
          await onUpdate({
            ...note,
            title: newTitle,
            content: newContent,
            updatedAt: Date.now(),
          });
        }
        setSaveStatus("saved");
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
      }
    }, 800);
  }, [note, text, title, checklist, onUpdate]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const addChecklistItem = () => {
    if (!newItemText.trim()) return;
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText,
      checked: false,
    };
    setChecklist([...checklist, newItem]);
    setNewItemText("");
    scheduleSave();
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
    scheduleSave();
  };

  const deleteChecklistItem = (id: string) => {
    setChecklist(checklist.filter((item) => item.id !== id));
    scheduleSave();
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newItems = [...checklist];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setChecklist(newItems);
    scheduleSave();
  };

  const firstLine = text.split("\n")[0] || "";

  const menuItems = [
    { icon: Lock, label: "Lock" },
    { icon: Share2, label: "Share" },
    { icon: Trash2, label: "Delete", danger: true },
    { icon: Search, label: "Find in notes" },
    { icon: Pin, label: "Pin" },
  ];

  if (note.type === "checklist") {
    return (
      <div className="h-full flex flex-col p-4">
        <div className="flex items-center gap-3 mb-6">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); scheduleSave(); }}
            placeholder="Checklist title..."
            className="flex-1 text-2xl font-bold bg-transparent outline-none placeholder-gray-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {checklist.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--elevated-bg)]/50 transition-colors group"
            >
              <button
                onClick={() => moveItem(index, "up")}
                className="p-0.5 hover:bg-white/10 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover-pop"
                disabled={index === 0}
              >
                <GripVertical size={14} className="text-gray-500" />
              </button>
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleChecklistItem(item.id)}
                className="w-5 h-5 rounded accent-[var(--accent)] cursor-pointer shrink-0"
              />
              <span
                className={`flex-1 text-sm ${
                  item.checked ? "line-through text-gray-500" : ""
                }`}
              >
                {item.text}
              </span>
              <button
                onClick={() => deleteChecklistItem(item.id)}
                className="p-1 hover:bg-red-500/20 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover-pop"
              >
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); addChecklistItem(); }}
          className="flex items-center gap-3 p-3 mt-2"
        >
          <Plus size={16} className="text-gray-500" />
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Add item..."
            className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500"
          />
        </form>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col">
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-16 pt-3">
        <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
            <div className="relative z-20">
          <GlassSurface borderRadius={9999} width="auto" height="auto" dark={theme === "dark"} padding={0}>
            <button
              onClick={onClose}
              className="flex items-center justify-center p-2 rounded-full cursor-pointer hover-pop"
            >
              <X size={22} />
            </button>
          </GlassSurface>
            </div>
          </div>

        <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
            <div className="relative z-20">
          <GlassSurface borderRadius={9999} width="auto" height="auto" dark={theme === "dark"} padding={0}>
            <span className="block px-6 py-2 text-base font-medium truncate max-w-[400px] rounded-full hover-pop cursor-default">
              {firstLine || "Untitled"}
            </span>
          </GlassSurface>
            </div>
          </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            {displayStatus !== "idle" && (
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
                  <div className="relative z-20">
              <GlassSurface
                borderRadius={9999}
                width="auto"
                height="auto"
                dark={theme === "dark"}
                padding={0}
                className={saveStatus === "idle" ? "animate-scale-out" : "animate-scale-in"}
              >
                <div className="p-2">
                  {displayStatus === "saving" && (
                    <Loader size={16} className="text-gray-400 animate-spin" />
                  )}
                  {displayStatus === "saved" && (
                    <Check size={16} className="text-green-400" />
                  )}
                  {displayStatus === "error" && (
                    <AlertCircle size={16} className="text-red-400" />
                  )}
                </div>
              </GlassSurface>
                  </div>
                </div>
            )}
          </div>

          <div className="relative">
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
                <div className="relative z-20">
            <GlassSurface borderRadius={9999} width="auto" height="auto" dark={theme === "dark"} padding={0}>
              <button
                ref={moreBtnRef}
                onClick={() => showMenu ? closeMenu() : setShowMenu(true)}
                className="flex items-center justify-center p-2 rounded-full cursor-pointer hover-pop"
              >
                <MoreHorizontal size={22} />
              </button>
            </GlassSurface>
                </div>
              </div>

            {(showMenu || menuClosing) && (
              <div className={`absolute right-0 top-full mt-2 min-w-[180px] ${menuClosing ? "animate-menu-out" : "animate-menu-in"}`}>
                <div className="absolute inset-0 rounded-xl bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
                <div className="relative z-20">
              <GlassSurface
                ref={menuRef}
                borderRadius={12}
                width="auto"
                height="auto"
                dark={theme === "dark"}
                padding={0}
              >
                <div className="py-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={closeMenu}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover-pop cursor-pointer ${
                        item.danger ? "text-red-400 hover:bg-red-500/10" : "hover:bg-white/5"
                      }`}
                    >
                      <item.icon size={16} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </GlassSurface>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 pl-16">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => { setText(e.target.value); scheduleSave(); }}
          placeholder="Start writing..."
          className="w-full h-full bg-transparent outline-none resize-none text-base leading-relaxed placeholder-gray-500 pt-20 pr-16"
        />
      </div>
    </div>
  );
}
