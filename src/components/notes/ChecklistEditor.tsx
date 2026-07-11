import type { Note, ChecklistItem } from "../../types";
import {
  Trash2, X, MoreHorizontal, Check, Loader, AlertCircle,
  Lock, Share2, Search, Pin, Bold, Italic, Underline, ShoppingCart,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import GlassSurface from "../GlassSurface";

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
      <div className="absolute inset-0 rounded-xl bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
      <div className="relative z-20">
        <GlassSurface borderRadius={10} width="auto" height="auto" dark={theme === "dark"} padding={0}>
          <button
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded-xl cursor-pointer transition-all hover-pop [&>svg]:stroke-[2.5] ${active
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

interface ChecklistEditorProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onClose?: () => void;
  onDelete?: (id: string) => void;
}

export default function ChecklistEditor({ note, onUpdate, onClose, onDelete }: ChecklistEditorProps) {
  const { theme } = useTheme();
  const [title, setTitle] = useState(note.title);
  const [items, setItems] = useState<ChecklistItem[]>(note.checklist || []);
  const [groceryMode, setGroceryMode] = useState(note.checklistGrocery || false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [displayStatus, setDisplayStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [showMenu, setShowMenu] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const menuRef = useRef<HTMLDivElement>(null);
  const moreBtnRef = useRef<HTMLButtonElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const prevPositionsRef = useRef<Map<string, number>>(new Map());
  const noteRef = useRef(note);
  noteRef.current = note;
  const onUpdateRef = useRef(onUpdate);
  onUpdateRef.current = onUpdate;

  const sortedItems = [...items].sort((a, b) => {
    if (a.checked === b.checked) return 0;
    return a.checked ? 1 : -1;
  });

  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus("saving");
    saveTimer.current = setTimeout(async () => {
      try {
        const n = noteRef.current;
        const updater = onUpdateRef.current;
        await updater({
          ...n,
          title,
          content: "",
          checklist: items,
          checklistGrocery: groceryMode,
          updatedAt: Date.now(),
        });
        setSaveStatus("saved");
        if (hideTimer.current) clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
      }
    }, 800);
  }, [title, items, groceryMode]);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, checked: !i.checked } : i));
    scheduleSave();
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    scheduleSave();
  };

  const updateItemText = (id: string, html: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, text: html } : i));
    scheduleSave();
  };

  const updateItemSpecs = (id: string, html: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, specs: html } : i));
    scheduleSave();
  };

  const insertItemAfter = (afterId: string) => {
    const idx = items.findIndex(i => i.id === afterId);
    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      text: "",
      checked: false,
    };
    const next = [...items];
    next.splice(idx + 1, 0, newItem);
    setItems(next);
    scheduleSave();
    setTimeout(() => focusItemAtEnd(newItem.id), 0);
  };

  const focusItemAtEnd = (id: string) => {
    const el = document.querySelector(`[data-item-id="${id}"][contenteditable]`) as HTMLElement | null;
    if (!el) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    if (sel) { sel.removeAllRanges(); sel.addRange(range); }
  };

  const focusItemSpecsAtEnd = (id: string) => {
    const el = document.querySelector(`[data-item-specs-id="${id}"][contenteditable]`) as HTMLElement | null;
    if (!el) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    if (sel) { sel.removeAllRanges(); sel.addRange(range); }
  };

  const toggleGroceryMode = () => {
    const next = !groceryMode;
    setGroceryMode(next);
    const n = noteRef.current;
    const updater = onUpdateRef.current;
    updater({ ...n, checklistGrocery: next, updatedAt: Date.now() });
  };

  const execFormat = (command: string, value?: string) => {
    const el = document.activeElement;
    if (el && el.hasAttribute("contentEditable")) {
      document.execCommand(command, false, value);
      (el as HTMLElement).focus();
    }
  };

  const firstLine = title || "Checklist";

  const menuItems = [
    { icon: Lock, label: "Lock", action: () => {} },
    { icon: Share2, label: "Share", action: () => {
      const text = items.map(i => `[${i.checked ? "x" : " "}] ${i.text}`).join("\n");
      if (navigator.share) navigator.share({ title, text });
    }},
    { icon: Trash2, label: "Delete", danger: true, action: () => {
      setShowMenu(false);
      onDelete?.(note.id);
      onClose?.();
    }},
    { icon: Search, label: "Find in notes", action: () => {} },
    { icon: Pin, label: note.isPinned ? "Unpin" : "Pin", action: () => {
      onUpdate({ ...note, isPinned: !note.isPinned, updatedAt: Date.now() });
    }},
  ];

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const children = list.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const id = child.dataset.itemId;
      if (!id) continue;
      const prevTop = prevPositionsRef.current.get(id);
      const newTop = child.offsetTop;
      if (prevTop !== undefined && prevTop !== newTop) {
        const delta = prevTop - newTop;
        child.style.transition = "none";
        child.style.transform = `translateY(${delta}px)`;
        requestAnimationFrame(() => {
          child.style.transition = "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)";
          child.style.transform = "";
        });
      } else {
        child.style.transition = "";
        child.style.transform = "";
      }
    }

    const newPositions = new Map<string, number>();
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const id = child.dataset.itemId;
      if (id) newPositions.set(id, child.offsetTop);
    }
    prevPositionsRef.current = newPositions;
  }, [sortedItems]);

  useEffect(() => {
    setTitle(note.title);
    setItems(note.checklist || []);
    setSaveStatus("idle");
    setDisplayStatus("idle");
    setShowMenu(false);
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
      const target = e.target as Node;
      if (showMenu &&
          menuRef.current && !menuRef.current.contains(target) &&
          moreBtnRef.current && !moreBtnRef.current.contains(target)) {
        setShowMenu(false);
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

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const handler = () => {
      const diff = window.innerHeight - vv.height;
      setKeyboardHeight(diff > 0 ? diff : 0);
    };
    vv.addEventListener("resize", handler);
    return () => vv.removeEventListener("resize", handler);
  }, []);

  return (
    <div className="relative h-full flex flex-col">
      {/* Top toolbar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 md:px-16 pt-3">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
          <div className="relative z-20">
            <GlassSurface borderRadius={20} width="auto" height="auto" dark={theme === "dark"} padding={0}>
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
            <GlassSurface borderRadius={20} width="auto" height="auto" dark={theme === "dark"} padding={0}>
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
                <GlassSurface borderRadius={20} width="auto" height="auto" dark={theme === "dark"} padding={0}>
                  <button
                    ref={moreBtnRef}
                    onClick={() => showMenu ? setShowMenu(false) : setShowMenu(true)}
                    className="flex items-center justify-center p-2 rounded-full cursor-pointer hover-pop"
                  >
                    <MoreHorizontal size={22} />
                  </button>
                </GlassSurface>
              </div>
            </div>

            {showMenu && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0" onClick={() => setShowMenu(false)} />
                <div className="relative w-56" onClick={(e) => e.stopPropagation()}>
                  <div className="absolute inset-0 rounded-xl bg-[var(--surface-bg)]/20 backdrop-blur-[2px] z-10" />
                  <div className="relative z-20">
                    <GlassSurface ref={menuRef} borderRadius={12} width="auto" height="auto" dark={theme === "dark"} padding={0}>
                      <div className="p-4 space-y-1">
                        {menuItems.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => { item.action(); setShowMenu(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors hover-pop cursor-pointer [&>svg]:stroke-[2.5] ${
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 pl-4 md:pl-16 pt-20 pr-4 md:pr-16 overflow-y-auto" style={{ paddingBottom: `${64 + keyboardHeight}px` }}>
        {/* Title */}
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); scheduleSave(); }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (items.length === 0) {
                const newItem: ChecklistItem = { id: crypto.randomUUID(), text: "", checked: false };
                setItems([newItem]);
                scheduleSave();
                setTimeout(() => focusItemAtEnd(newItem.id), 0);
              } else {
                const lastId = items[items.length - 1].id;
                insertItemAfter(lastId);
              }
            }
          }}
          placeholder="Checklist"
          className="w-full text-3xl font-bold bg-transparent outline-none placeholder-gray-500 mb-3"
        />

        {/* Checklist items */}
        <div ref={listRef} className="space-y-0.5">
          {sortedItems.map((item, index) => (
            <div key={item.id} data-item-id={item.id} className="flex items-start gap-3 py-1 group will-change-transform">
              <button
                onClick={() => toggleItem(item.id)}
                className="mt-1.5 shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 cursor-pointer hover-pop"
                style={{
                  borderColor: item.checked ? "var(--accent)" : "#888",
                  backgroundColor: item.checked ? "var(--accent)" : "transparent",
                }}
              >
                {item.checked && <Check size={12} className="text-white" strokeWidth={3} />}
              </button>

              {groceryMode ? (
                <div className="flex-1 flex items-start gap-2 min-w-0">
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    data-item-id={item.id}
                    onBlur={(e) => {
                      const html = e.currentTarget.innerHTML === "<br>" ? "" : e.currentTarget.innerHTML;
                      if (html !== item.text) updateItemText(item.id, html);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); if (groceryMode) { focusItemSpecsAtEnd(item.id); } else { insertItemAfter(item.id); } }
                      if (e.key === "ArrowUp") { e.preventDefault(); if (index > 0) focusItemAtEnd(sortedItems[index - 1].id); }
                      if (e.key === "ArrowDown") { e.preventDefault(); if (index < sortedItems.length - 1) focusItemAtEnd(sortedItems[index + 1].id); }
                      if (e.key === "ArrowRight") { e.preventDefault(); focusItemSpecsAtEnd(item.id); }
                      if (e.key === "Backspace") {
                        const text = e.currentTarget.textContent || "";
                        if (text.trim() === "") {
                          e.preventDefault();
                          const prevId = index > 0 ? sortedItems[index - 1].id : null;
                          deleteItem(item.id);
                          if (prevId) {
                            setTimeout(() => groceryMode ? focusItemSpecsAtEnd(prevId) : focusItemAtEnd(prevId), 0);
                          } else {
                            setTimeout(() => titleRef.current?.focus(), 0);
                          }
                        }
                      }
                    }}
                    className="flex-1 min-w-0 text-base outline-none py-1 rounded px-1 -mx-1 focus:bg-white/5 transition-colors [&:empty:before]:content-['Item'] [&:empty:before]:text-gray-500"
                  >
                    {item.text}
                  </div>
                  <div className="shrink-0 w-px self-stretch bg-white/10 mt-1.5 mb-1" />
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    data-item-specs-id={item.id}
                    onBlur={(e) => {
                      const html = e.currentTarget.innerHTML === "<br>" ? "" : e.currentTarget.innerHTML;
                      if (html !== item.specs) updateItemSpecs(item.id, html);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); insertItemAfter(item.id); }
                      if (e.key === "ArrowUp") { e.preventDefault(); if (index > 0) focusItemSpecsAtEnd(sortedItems[index - 1].id); }
                      if (e.key === "ArrowDown") { e.preventDefault(); if (index < sortedItems.length - 1) focusItemSpecsAtEnd(sortedItems[index + 1].id); }
                      if (e.key === "ArrowLeft") { e.preventDefault(); focusItemAtEnd(item.id); }
                      if (e.key === "Backspace") {
                        const text = e.currentTarget.textContent || "";
                        if (text.trim() === "") {
                          e.preventDefault();
                          focusItemAtEnd(item.id);
                        }
                      }
                    }}
                    className="w-24 shrink-0 text-sm text-right outline-none py-1 rounded px-1 -mx-1 focus:bg-white/5 transition-colors text-gray-400 [&:empty:before]:content-['Qty'] [&:empty:before]:text-gray-600"
                  >
                    {item.specs}
                  </div>
                </div>
              ) : (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  data-item-id={item.id}
                  onBlur={(e) => {
                    const html = e.currentTarget.innerHTML === "<br>" ? "" : e.currentTarget.innerHTML;
                    if (html !== item.text) updateItemText(item.id, html);
                  }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); if (groceryMode) { focusItemSpecsAtEnd(item.id); } else { insertItemAfter(item.id); } }
                    if (e.key === "ArrowUp") { e.preventDefault(); if (index > 0) focusItemAtEnd(sortedItems[index - 1].id); }
                    if (e.key === "ArrowDown") { e.preventDefault(); if (index < sortedItems.length - 1) focusItemAtEnd(sortedItems[index + 1].id); }
                    if (e.key === "Backspace") {
                      const text = e.currentTarget.textContent || "";
                      if (text.trim() === "") {
                        e.preventDefault();
                        const prevId = index > 0 ? sortedItems[index - 1].id : null;
                        deleteItem(item.id);
                        if (prevId) { setTimeout(() => focusItemAtEnd(prevId), 0); } else { setTimeout(() => titleRef.current?.focus(), 0); }
                      }
                    }
                  }}
                  className={`flex-1 text-base outline-none py-1 rounded px-1 -mx-1 focus:bg-white/5 transition-colors [&:empty:before]:content-['Item'] [&:empty:before]:text-gray-500 ${
                    item.checked ? "line-through text-gray-500" : ""
                  }`}
                >
                  {item.text}
                </div>
              )}

              <button
                onClick={() => deleteItem(item.id)}
                className="p-1 mt-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded transition-all cursor-pointer hover-pop shrink-0"
              >
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom toolbar */}
      <div className="absolute left-0 right-0 z-10 px-4 md:px-16 pb-3 flex justify-center" style={{ bottom: `${keyboardHeight}px` }}>
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
          <GlassBtn
            title="Bold"
            active={false}
            onClick={() => execFormat("bold")}
          >
            <Bold size={15} />
          </GlassBtn>

          <GlassBtn
            title="Italic"
            active={false}
            onClick={() => execFormat("italic")}
          >
            <Italic size={15} />
          </GlassBtn>

          <GlassBtn
            title="Underline"
            active={false}
            onClick={() => execFormat("underline")}
          >
            <Underline size={15} />
          </GlassBtn>

          <div className="w-px h-6 bg-white/10 mx-1" />

          <GlassBtn
            title="Grocery mode"
            active={groceryMode}
            onClick={toggleGroceryMode}
          >
            <ShoppingCart size={15} />
          </GlassBtn>
        </div>
      </div>
    </div>
  );
}
