import type { Note, ChecklistItem } from "../../types";
import {
  Plus, Trash2, X, MoreHorizontal, Check, Loader, AlertCircle,
  Lock, Share2, Search, Pin, Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, Table
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";
import GlassSurface from "../GlassSurface";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import UnderlineExt from "@tiptap/extension-underline";
import { Table as TableExt } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";

const FontSize = TextStyle.extend({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el: HTMLElement) => el.style.fontSize?.replace(/['"]+/g, ""),
            renderHTML: (attrs: Record<string, unknown>) => {
              if (!attrs.fontSize) return {};
              return { style: `font-size: ${attrs.fontSize}` };
            },
          },
        },
      },
    ];
  },
});

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
  const menuRef = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const noteRef = useRef(note);
  noteRef.current = note;
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const isChecklist = note.type === "checklist";

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExt,
      TableExt.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      TextStyle,
      FontFamily,
      FontSize,
      Placeholder.configure({ placeholder: "Start writing..." }),
    ],
    content: note.content || "",
    onUpdate: () => {
      const n = noteRef.current;
      const updater = onUpdateRef.current;
      if (!n || isChecklist) return;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      setSaveStatus("saving");
      saveTimer.current = setTimeout(async () => {
        if (!editor) return;
        try {
          const fullText = editor.getText();
          const firstBreak = fullText.indexOf("\n");
          const newTitle = firstBreak >= 0 ? fullText.slice(0, firstBreak).trim() : fullText.trim();
          const newContent = editor.getHTML();
          await updater({
            ...n,
            title: newTitle,
            content: newContent,
            updatedAt: Date.now(),
          });
          setSaveStatus("saved");
          if (hideTimer.current) clearTimeout(hideTimer.current);
          hideTimer.current = setTimeout(() => setSaveStatus("idle"), 2000);
        } catch {
          setSaveStatus("error");
        }
      }, 800);
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-full text-base leading-relaxed",
      },
    },
  });

  useEffect(() => {
    if (editor && note.type === "note") {
      const targetHtml = note.content || "";
      if (editor.getHTML() !== targetHtml) {
        editor.commands.setContent(targetHtml);
      }
    }
  }, [note.id]);

  useEffect(() => {
    if (editor && note.type === "note") {
      const t = setTimeout(() => {
        editor.commands.focus("end");
      }, 100);
      return () => clearTimeout(t);
    }
  }, [note.id, !!editor]);

  useEffect(() => {
    setText(note.title + (note.content ? "\n" + note.content : ""));
    setTitle(note.title);
    setChecklist(note.checklist || []);
    setSaveStatus("idle");
    setDisplayStatus("idle");
    setShowMenu(false);
    setMenuClosing(false);
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

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

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
        if (isChecklist) {
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
  }, [note, text, title, checklist, isChecklist, onUpdate]);

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

  const firstLine = note.type === "note"
    ? (editor ? editor.getText().split("\n")[0] || "" : note.title)
    : title;

  const menuItems = [
    { icon: Lock, label: "Lock" },
    { icon: Share2, label: "Share" },
    { icon: Trash2, label: "Delete", danger: true },
    { icon: Search, label: "Find in notes" },
    { icon: Pin, label: "Pin" },
  ];

  if (isChecklist) {
    return (
      <div className="h-full flex flex-col p-4">
        <div className="flex items-center gap-3 mb-6">
          <input
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
          className="flex items-center gap-3 p-3 mt-2 border-t border-[var(--elevated-bg)]/20"
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

  const btn = (label: string, active: boolean, onClick: () => void, children: React.ReactNode) => (
    <button
      onClick={onClick}
      className={`p-1.5 rounded transition-colors cursor-pointer hover-pop ${
        active ? "bg-[var(--accent)]/20 text-[var(--accent)]" : "hover:bg-white/10"
      }`}
      title={label}
    >
      {children}
    </button>
  );

  const fontSizes = ["12px", "14px", "16px", "18px", "24px", "36px"];
  const fontFamilies = [
    { label: "Sans", value: "sans-serif" },
    { label: "Serif", value: "serif" },
    { label: "Mono", value: "monospace" },
  ];

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
              <span className="block px-6 py-2 text-base font-medium truncate max-w-[400px] rounded-full cursor-default">
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

      <div className="flex-1 pl-16 pt-20 pr-16 pb-14 overflow-y-auto">
        <EditorContent editor={editor} className="Tiptap min-h-full" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 px-16 pb-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-xl bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
          <div className="relative z-20">
            <GlassSurface borderRadius={12} width="auto" height="auto" dark={theme === "dark"} padding={0}>
              <div className="flex items-center gap-0.5 px-2 py-1.5 overflow-x-auto">
                {btn("Bold", editor?.isActive("bold") ?? false, () => editor?.chain().focus().toggleBold().run(), <Bold size={15} />)}
                {btn("Italic", editor?.isActive("italic") ?? false, () => editor?.chain().focus().toggleItalic().run(), <Italic size={15} />)}
                {btn("Underline", editor?.isActive("underline") ?? false, () => editor?.chain().focus().toggleUnderline().run(), <Underline size={15} />)}
                {btn("Strikethrough", editor?.isActive("strike") ?? false, () => editor?.chain().focus().toggleStrike().run(), <Strikethrough size={15} />)}

                <div className="w-px h-5 bg-white/10 mx-1 shrink-0" />

                {btn("Bullet List", editor?.isActive("bulletList") ?? false, () => editor?.chain().focus().toggleBulletList().run(), <List size={15} />)}
                {btn("Ordered List", editor?.isActive("orderedList") ?? false, () => editor?.chain().focus().toggleOrderedList().run(), <ListOrdered size={15} />)}

                <div className="w-px h-5 bg-white/10 mx-1 shrink-0" />

                {btn("Insert Table", editor?.isActive("table") ?? false, () => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(), <Table size={15} />)}

                <div className="w-px h-5 bg-white/10 mx-1 shrink-0" />

                {fontFamilies.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => {
                      if (editor?.getAttributes("textStyle").fontFamily === f.value) {
                        editor?.chain().focus().unsetMark("textStyle").run();
                      } else {
                        editor?.chain().focus().setMark("textStyle", { fontFamily: f.value }).run();
                      }
                    }}
                    className={`px-2 py-1 text-xs rounded transition-colors cursor-pointer hover-pop ${
                      editor?.getAttributes("textStyle").fontFamily === f.value
                        ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                        : "hover:bg-white/10"
                    }`}
                    title={`Font: ${f.label}`}
                  >
                    {f.label}
                  </button>
                ))}

                <div className="w-px h-5 bg-white/10 mx-1 shrink-0" />

                {fontSizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      if (editor?.getAttributes("textStyle").fontSize === s) {
                        editor?.chain().focus().unsetMark("textStyle").run();
                      } else {
                        editor?.chain().focus().setMark("textStyle", { fontSize: s }).run();
                      }
                    }}
                    className={`px-1.5 py-1 text-xs rounded transition-colors cursor-pointer hover-pop ${
                      editor?.getAttributes("textStyle").fontSize === s
                        ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                        : "hover:bg-white/10"
                    }`}
                    title={`Size: ${s}`}
                  >
                    {s.replace("px", "")}
                  </button>
                ))}
              </div>
            </GlassSurface>
          </div>
        </div>
      </div>
    </div>
  );
}
