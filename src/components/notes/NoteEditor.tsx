import type { Note, ChecklistItem } from "../../types";
import {
  Plus, Trash2, X, MoreHorizontal, Check, Loader, AlertCircle,
  Lock, Share2, Search, Pin, Bold, Italic, Underline, Strikethrough,
  List, ListOrdered, Table, ChevronDown, ArrowUpFromLine, ArrowDownToLine,
  ArrowLeftFromLine, ArrowRightFromLine, TableProperties
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

const FONT_FAMILIES = [
  { label: "System UI", value: "system-ui, -apple-system, sans-serif" },
  { label: "Sans Serif", value: "sans-serif" },
  { label: "Serif", value: "serif" },
  { label: "Monospace", value: "monospace" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Helvetica", value: "Helvetica, sans-serif" },
  { label: "Times New Roman", value: '"Times New Roman", serif' },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier New", value: '"Courier New", monospace' },
  { label: "Verdana", value: "Verdana, sans-serif" },
  { label: "Trebuchet MS", value: '"Trebuchet MS", sans-serif' },
  { label: "Comic Sans MS", value: '"Comic Sans MS", cursive' },
  { label: "Impact", value: "Impact, sans-serif" },
  { label: "Palatino", value: '"Palatino Linotype", "Book Antiqua", Palatino, serif' },
  { label: "Garamond", value: "Garamond, serif" },
  { label: "Bookman", value: "Bookman, serif" },
  { label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
  { label: "Segoe UI", value: '"Segoe UI", sans-serif' },
  { label: "Roboto", value: "Roboto, sans-serif" },
  { label: "Open Sans", value: '"Open Sans", sans-serif' },
  { label: "Lato", value: "Lato, sans-serif" },
  { label: "Montserrat", value: "Montserrat, sans-serif" },
  { label: "Merriweather", value: "Merriweather, serif" },
  { label: "Playfair Display", value: '"Playfair Display", serif' },
  { label: "Fira Code", value: '"Fira Code", monospace' },
  { label: "JetBrains Mono", value: '"JetBrains Mono", monospace' },
];

interface NoteEditorProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onClose?: () => void;
}

function GlassBtn({ children, active, onClick, title, className = "" }: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  title: string;
  className?: string;
}) {
  const { theme } = useTheme();
  return (
    <div className="relative shrink-0">
      <div className="absolute inset-0 rounded-lg bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
      <div className="relative z-20">
        <GlassSurface borderRadius={8} width="auto" height="auto" dark={theme === "dark"} padding={0}>
          <button
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded-lg cursor-pointer transition-all hover-pop ${active
              ? "bg-[var(--accent)]/70 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]"
              : "hover:bg-white/10"} ${className}`}
          >
            {children}
          </button>
        </GlassSurface>
      </div>
    </div>
  );
}

function GlassDropdownTrigger({ children, title, onClick }: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
}) {
  const { theme } = useTheme();
  return (
    <div className="relative shrink-0">
      <div className="absolute inset-0 rounded-lg bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
      <div className="relative z-20">
        <GlassSurface borderRadius={8} width="auto" height="auto" dark={theme === "dark"} padding={0}>
          <button
            onClick={onClick}
            title={title}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer hover-pop hover:bg-white/10 text-xs whitespace-nowrap"
          >
            {children}
            <ChevronDown size={12} className="opacity-60" />
          </button>
        </GlassSurface>
      </div>
    </div>
  );
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
  const [showFontFamily, setShowFontFamily] = useState(false);
  const [fontFamilyClosing, setFontFamilyClosing] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [fontSizeClosing, setFontSizeClosing] = useState(false);
  const [showCustomFontSize, setShowCustomFontSize] = useState(false);
  const [customFontSize, setCustomFontSize] = useState("");
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [tableDialogClosing, setTableDialogClosing] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [showCustomFont, setShowCustomFont] = useState(false);
  const [customFont, setCustomFont] = useState("");
  const [fontFamilyPos, setFontFamilyPos] = useState({ left: 0, top: 0 });
  const [fontSizePos, setFontSizePos] = useState({ left: 0, top: 0 });
  const [tableDialogPos, setTableDialogPos] = useState({ left: 0, top: 0 });
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const menuRef = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const fontFamilyRef = useRef<HTMLDivElement>(null);
  const fontFamilyBtnRef = useRef<HTMLButtonElement>(null);
  const fontSizeRef = useRef<HTMLDivElement>(null);
  const fontSizeBtnRef = useRef<HTMLButtonElement>(null);
  const tableDialogRef = useRef<HTMLDivElement>(null);
  const tableBtnRef = useRef<HTMLButtonElement>(null);
  const customFontSizeInputRef = useRef<HTMLInputElement>(null);
  const customFontInputRef = useRef<HTMLInputElement>(null);
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

  const closeMenu = () => {
    setMenuClosing(true);
    setTimeout(() => {
      setShowMenu(false);
      setMenuClosing(false);
    }, 150);
  };

  const closeFontFamily = () => {
    setFontFamilyClosing(true);
    setTimeout(() => {
      setShowFontFamily(false);
      setFontFamilyClosing(false);
    }, 150);
  };

  const closeFontSize = () => {
    setFontSizeClosing(true);
    setTimeout(() => {
      setShowFontSize(false);
      setFontSizeClosing(false);
    }, 150);
  };

  const closeTableDialog = () => {
    setTableDialogClosing(true);
    setTimeout(() => {
      setShowTableDialog(false);
      setTableDialogClosing(false);
    }, 150);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (showMenu &&
          menuRef.current && !menuRef.current.contains(target) &&
          moreBtnRef.current && !moreBtnRef.current.contains(target)) {
        closeMenu();
      }
      if (showFontFamily &&
          fontFamilyRef.current && !fontFamilyRef.current.contains(target) &&
          fontFamilyBtnRef.current && !fontFamilyBtnRef.current.contains(target)) {
        closeFontFamily();
      }
      if (showFontSize &&
          fontSizeRef.current && !fontSizeRef.current.contains(target) &&
          fontSizeBtnRef.current && !fontSizeBtnRef.current.contains(target)) {
        closeFontSize();
      }
      if (showTableDialog &&
          tableDialogRef.current && !tableDialogRef.current.contains(target) &&
          tableBtnRef.current && !tableBtnRef.current.contains(target)) {
        closeTableDialog();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMenu, showFontFamily, showFontSize, showTableDialog]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

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

  const inTable = editor?.isActive("table") ?? false;

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
          {checklist.map((item) => (
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

      <div className="flex-1 pl-16 pt-20 pr-16 overflow-y-auto">
        <EditorContent editor={editor} className="Tiptap min-h-full" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 px-16 pb-3 flex justify-center">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          <GlassBtn
            title="Bold"
            active={editor?.isActive("bold") ?? false}
            onClick={() => editor?.chain().focus().toggleBold().run()}
          >
            <Bold size={15} />
          </GlassBtn>

          <GlassBtn
            title="Italic"
            active={editor?.isActive("italic") ?? false}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
          >
            <Italic size={15} />
          </GlassBtn>

          <GlassBtn
            title="Underline"
            active={editor?.isActive("underline") ?? false}
            onClick={() => editor?.chain().focus().toggleUnderline().run()}
          >
            <Underline size={15} />
          </GlassBtn>

          <GlassBtn
            title="Strikethrough"
            active={editor?.isActive("strike") ?? false}
            onClick={() => editor?.chain().focus().toggleStrike().run()}
          >
            <Strikethrough size={15} />
          </GlassBtn>

          <div className="w-px h-5 bg-white/10 mx-0.5 shrink-0" />

          <GlassBtn
            title="Bullet List"
            active={editor?.isActive("bulletList") ?? false}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
          >
            <List size={15} />
          </GlassBtn>

          <GlassBtn
            title="Ordered List"
            active={editor?.isActive("orderedList") ?? false}
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={15} />
          </GlassBtn>

          <div className="w-px h-5 bg-white/10 mx-0.5 shrink-0" />

          <div ref={tableBtnRef}>
            <GlassBtn
              title="Insert Table"
              active={inTable}
              onClick={() => {
                if (showTableDialog) { closeTableDialog(); return; }
                if (tableBtnRef.current) {
                  const r = tableBtnRef.current.getBoundingClientRect();
                  setTableDialogPos({ left: r.left + r.width / 2, top: r.top });
                }
                setShowTableDialog(true);
              }}
            >
              <Table size={15} />
            </GlassBtn>
          </div>

          {inTable && (
            <>
              <div className="w-px h-5 bg-white/10 mx-0.5 shrink-0" />

              <GlassBtn title="Insert Row Above" active={false} onClick={() => editor?.chain().focus().addRowBefore().run()}>
                <ArrowUpFromLine size={13} />
              </GlassBtn>
              <GlassBtn title="Insert Row Below" active={false} onClick={() => editor?.chain().focus().addRowAfter().run()}>
                <ArrowDownToLine size={13} />
              </GlassBtn>
              <GlassBtn title="Insert Column Left" active={false} onClick={() => editor?.chain().focus().addColumnBefore().run()}>
                <ArrowLeftFromLine size={13} />
              </GlassBtn>
              <GlassBtn title="Insert Column Right" active={false} onClick={() => editor?.chain().focus().addColumnAfter().run()}>
                <ArrowRightFromLine size={13} />
              </GlassBtn>
              <GlassBtn title="Delete Row" active={false} onClick={() => editor?.chain().focus().deleteRow().run()}>
                <Trash2 size={13} />
              </GlassBtn>
              <GlassBtn title="Delete Column" active={false} onClick={() => editor?.chain().focus().deleteColumn().run()}>
                <Trash2 size={13} className="rotate-90" />
              </GlassBtn>
              <GlassBtn title="Delete Table" active={false} onClick={() => editor?.chain().focus().deleteTable().run()}>
                <TableProperties size={13} />
              </GlassBtn>
            </>
          )}

          <div className="w-px h-5 bg-white/10 mx-0.5 shrink-0" />

          <div ref={fontFamilyBtnRef}>
            <GlassDropdownTrigger title="Font Family" onClick={() => {
              if (showFontFamily) { closeFontFamily(); return; }
              if (fontFamilyBtnRef.current) {
                const r = fontFamilyBtnRef.current.getBoundingClientRect();
                setFontFamilyPos({ left: r.left, top: r.top });
              }
              setShowFontFamily(true);
            }}>
              <span style={{ fontFamily: editor?.getAttributes("textStyle").fontFamily || "inherit" }} className="text-xs">
                {FONT_FAMILIES.find(f => f.value === editor?.getAttributes("textStyle").fontFamily)?.label || "Font"}
              </span>
            </GlassDropdownTrigger>
          </div>

          <div className="w-px h-5 bg-white/10 mx-0.5 shrink-0" />

          <div ref={fontSizeBtnRef}>
            <GlassDropdownTrigger title="Font Size" onClick={() => {
              if (showFontSize) { closeFontSize(); return; }
              if (fontSizeBtnRef.current) {
                const r = fontSizeBtnRef.current.getBoundingClientRect();
                setFontSizePos({ left: r.left, top: r.top });
              }
              setShowFontSize(true);
            }}>
              <span className="text-xs min-w-[20px] text-center">
                {editor?.getAttributes("textStyle").fontSize?.replace("px", "") || "16"}
              </span>
            </GlassDropdownTrigger>
          </div>
        </div>
      </div>

      {/* Fixed-position dropdowns (outside overflow-x-auto context) */}
      {(showTableDialog || tableDialogClosing) && (
        <div
          ref={tableDialogRef}
          className={`fixed z-[100] ${tableDialogClosing ? "animate-menu-out" : "animate-menu-in"}`}
          style={{ left: tableDialogPos.left, bottom: window.innerHeight - tableDialogPos.top + 8, transform: "translateX(-50%)", transformOrigin: "bottom center" }}
        >
          <div className="absolute inset-0 rounded-xl bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
          <div className="relative z-20">
            <GlassSurface borderRadius={12} width="auto" height="auto" dark={theme === "dark"} padding={0}>
              <div className="p-3 space-y-3">
                <div className="flex items-center gap-3">
                  <label className="text-xs text-gray-400 w-16">Rows:</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={tableRows}
                    onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-xs text-gray-400 w-16">Columns:</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={tableCols}
                    onChange={(e) => setTableCols(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <button
                  onClick={() => {
                    editor?.chain().focus().insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: true }).run();
                    closeTableDialog();
                  }}
                  className="w-full text-xs bg-[var(--accent)]/20 hover:bg-[var(--accent)]/30 text-[var(--accent)] rounded-lg px-3 py-1.5 cursor-pointer transition-colors"
                >
                  Create Table
                </button>
              </div>
            </GlassSurface>
          </div>
        </div>
      )}

      {(showFontFamily || fontFamilyClosing) && (
        <div
          ref={fontFamilyRef}
          className={`fixed z-[100] min-w-[180px] max-h-[300px] ${fontFamilyClosing ? "animate-menu-out" : "animate-menu-in"}`}
          style={{ left: fontFamilyPos.left, bottom: window.innerHeight - fontFamilyPos.top + 4, transformOrigin: "bottom left" }}
        >
          <div className="absolute inset-0 rounded-xl bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
          <div className="relative z-20">
            <GlassSurface borderRadius={12} width="auto" height="auto" dark={theme === "dark"} padding={0}>
              <div className="overflow-y-auto max-h-[280px] py-1">
                {FONT_FAMILIES.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => {
                      editor?.chain().focus().setMark("textStyle", { fontFamily: f.value }).run();
                      closeFontFamily();
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs cursor-pointer hover:bg-white/5 transition-colors hover-pop ${
                      editor?.getAttributes("textStyle").fontFamily === f.value
                        ? "text-[var(--accent)] bg-[var(--accent)]/10"
                        : ""
                    }`}
                    style={{ fontFamily: f.value }}
                  >
                    {f.label}
                  </button>
                ))}
                <div className="border-t border-white/10 my-1" />
                <button
                  onClick={() => {
                    closeFontFamily();
                    setShowCustomFont(true);
                    setTimeout(() => customFontInputRef.current?.focus(), 200);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs cursor-pointer hover:bg-white/5 transition-colors hover-pop text-gray-400"
                >
                  Custom font...
                </button>
              </div>
            </GlassSurface>
          </div>
        </div>
      )}

      {(showFontSize || fontSizeClosing) && (
        <div
          ref={fontSizeRef}
          className={`fixed z-[100] min-w-[120px] max-h-[300px] ${fontSizeClosing ? "animate-menu-out" : "animate-menu-in"}`}
          style={{ left: fontSizePos.left, bottom: window.innerHeight - fontSizePos.top + 4, transformOrigin: "bottom left" }}
        >
          <div className="absolute inset-0 rounded-xl bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
          <div className="relative z-20">
            <GlassSurface borderRadius={12} width="auto" height="auto" dark={theme === "dark"} padding={0}>
              <div className="overflow-y-auto max-h-[280px] py-1">
                {Array.from({ length: 72 }, (_, i) => i + 9).map((s) => {
                  const px = `${s}px`;
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        editor?.chain().focus().setMark("textStyle", { fontSize: px }).run();
                        closeFontSize();
                      }}
                      className={`w-full text-left px-3 py-1 cursor-pointer hover:bg-white/5 transition-colors hover-pop ${
                        editor?.getAttributes("textStyle").fontSize === px
                          ? "text-[var(--accent)] bg-[var(--accent)]/10"
                          : ""
                      }`}
                    >
                      <span className="text-xs">{s}</span>
                    </button>
                  );
                })}
                <div className="border-t border-white/10 my-1" />
                <button
                  onClick={() => {
                    closeFontSize();
                    setShowCustomFontSize(true);
                    setTimeout(() => customFontSizeInputRef.current?.focus(), 200);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs cursor-pointer hover:bg-white/5 transition-colors hover-pop text-gray-400"
                >
                  Custom size...
                </button>
              </div>
            </GlassSurface>
          </div>
        </div>
      )}

      {(showCustomFontSize || showCustomFont) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => { setShowCustomFontSize(false); setShowCustomFont(false); }}>
          <div className="relative min-w-[240px]" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 rounded-xl bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
            <div className="relative z-20">
              <GlassSurface borderRadius={12} width="auto" height="auto" dark={theme === "dark"} padding={0}>
                <div className="p-4 space-y-3">
                  {showCustomFontSize && (
                    <>
                      <div className="text-xs text-gray-400 font-medium">Custom Font Size</div>
                      <input
                        ref={customFontSizeInputRef}
                        type="number"
                        min={1}
                        max={500}
                        value={customFontSize}
                        onChange={(e) => setCustomFontSize(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && customFontSize) {
                            editor?.chain().focus().setMark("textStyle", { fontSize: `${customFontSize}px` }).run();
                            setShowCustomFontSize(false);
                            setCustomFontSize("");
                          }
                        }}
                        placeholder="e.g. 42"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                      />
                      <button
                        onClick={() => {
                          if (customFontSize) {
                            editor?.chain().focus().setMark("textStyle", { fontSize: `${customFontSize}px` }).run();
                            setShowCustomFontSize(false);
                            setCustomFontSize("");
                          }
                        }}
                        className="w-full text-xs bg-[var(--accent)]/20 hover:bg-[var(--accent)]/30 text-[var(--accent)] rounded-lg px-3 py-1.5 cursor-pointer transition-colors"
                      >
                        Apply
                      </button>
                    </>
                  )}
                  {showCustomFont && (
                    <>
                      <div className="text-xs text-gray-400 font-medium">Custom Font Family</div>
                      <input
                        ref={customFontInputRef}
                        type="text"
                        value={customFont}
                        onChange={(e) => setCustomFont(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && customFont) {
                            editor?.chain().focus().setMark("textStyle", { fontFamily: customFont }).run();
                            setShowCustomFont(false);
                            setCustomFont("");
                          }
                        }}
                        placeholder="e.g. 'My Font', sans-serif"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                      />
                      <button
                        onClick={() => {
                          if (customFont) {
                            editor?.chain().focus().setMark("textStyle", { fontFamily: customFont }).run();
                            setShowCustomFont(false);
                            setCustomFont("");
                          }
                        }}
                        className="w-full text-xs bg-[var(--accent)]/20 hover:bg-[var(--accent)]/30 text-[var(--accent)] rounded-lg px-3 py-1.5 cursor-pointer transition-colors"
                      >
                        Apply
                      </button>
                    </>
                  )}
                </div>
              </GlassSurface>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
