import type { Note, ChecklistItem } from "../../types";
import { useState, useEffect, useRef, useCallback } from "react";
import { Save, Plus, Trash2, GripVertical } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface NoteEditorProps {
  note: Note;
  onUpdate: (note: Note) => void;
}

export default function NoteEditor({ note, onUpdate }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(note.checklist || []);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    setChecklist(note.checklist || []);
    setPreview(false);
    titleRef.current?.focus();
  }, [note.id]);

  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSaving(true);
      onUpdate({
        ...note,
        title,
        content,
        checklist: note.type === "checklist" ? checklist : undefined,
        updatedAt: Date.now(),
      });
      setTimeout(() => setSaving(false), 400);
    }, 800);
  }, [note, title, content, checklist, onUpdate]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
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

  if (note.type === "checklist") {
    return (
      <div className="h-full flex flex-col p-4 md:p-6 max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-6">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => { setTitle(e.target.value); scheduleSave(); }}
            placeholder="Checklist title..."
            className="flex-1 text-2xl font-bold bg-transparent outline-none placeholder-gray-500"
          />
          <div className="flex items-center gap-2">
            {saving && <span className="text-xs text-gray-500 animate-pulse">Saving...</span>}
            <Save size={16} className="text-gray-500" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1">
          {checklist.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--elevated-bg)]/50 transition-colors group"
            >
              <button
                onClick={() => moveItem(index, "up")}
                className="p-0.5 hover:bg-white/10 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
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
                className="p-1 hover:bg-red-500/20 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
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
    <div className="h-full flex flex-col p-4 md:p-6 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <input
          ref={titleRef}
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); scheduleSave(); }}
          placeholder="Note title..."
          className="flex-1 text-2xl font-bold bg-transparent outline-none placeholder-gray-500"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview(!preview)}
            className={`text-xs px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
              preview
                ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                : "border-white/10 hover:border-[var(--accent)]/30"
            }`}
          >
            {preview ? "Edit" : "Preview"}
          </button>
          {saving && <span className="text-xs text-gray-500 animate-pulse">Saving...</span>}
          <Save size={16} className="text-gray-500" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {preview ? (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); scheduleSave(); }}
            placeholder="Start writing..."
            className="w-full h-full bg-transparent outline-none resize-none text-sm leading-relaxed placeholder-gray-500"
          />
        )}
      </div>
    </div>
  );
}
