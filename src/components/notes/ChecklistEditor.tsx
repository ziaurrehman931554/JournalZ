import type { Note, ChecklistItem } from "../../types";
import { Plus, Trash2, CheckSquare } from "lucide-react";
import { useState } from "react";

interface ChecklistEditorProps {
  note: Note;
  onUpdate: (note: Note) => void;
}

export default function ChecklistEditor({ note, onUpdate }: ChecklistEditorProps) {
  const [newItem, setNewItem] = useState("");
  const items = note.checklist || [];

  const addItem = () => {
    if (!newItem.trim()) return;
    const item: ChecklistItem = {
      id: crypto.randomUUID(),
      text: newItem.trim(),
      checked: false,
    };
    onUpdate({
      ...note,
      checklist: [...items, item],
      updatedAt: Date.now(),
    });
    setNewItem("");
  };

  const toggleItem = (id: string) => {
    onUpdate({
      ...note,
      checklist: items.map((i) =>
        i.id === id ? { ...i, checked: !i.checked } : i
      ),
      updatedAt: Date.now(),
    });
  };

  const deleteItem = (id: string) => {
    onUpdate({
      ...note,
      checklist: items.filter((i) => i.id !== id),
      updatedAt: Date.now(),
    });
  };

  const updateItemText = (id: string, text: string) => {
    onUpdate({
      ...note,
      checklist: items.map((i) => (i.id === id ? { ...i, text } : i)),
      updatedAt: Date.now(),
    });
  };

  const progress = items.length > 0 ? Math.round((items.filter((i) => i.checked).length / items.length) * 100) : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-2">
        <input
          type="text"
          value={note.title}
          onChange={(e) => onUpdate({ ...note, title: e.target.value, updatedAt: Date.now() })}
          placeholder="Checklist title..."
          className="w-full text-2xl font-bold bg-transparent border-none outline-none mb-4 placeholder-gray-500"
        />
        {items.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>{progress}% complete</span>
              <span className="text-xs">({items.filter((i) => i.checked).length}/{items.length})</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-6 space-y-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 group py-1">
            <button
              onClick={() => toggleItem(item.id)}
              className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 cursor-pointer ${
                item.checked
                  ? "bg-[var(--accent)] border-[var(--accent)]"
                  : "border-gray-500 hover:border-[var(--accent)]"
              }`}
            >
              {item.checked && <CheckSquare size={14} className="text-white" />}
            </button>
            <input
              type="text"
              value={item.text}
              onChange={(e) => updateItemText(item.id, e.target.value)}
              className={`flex-1 bg-transparent border-none outline-none text-sm py-1 ${
                item.checked ? "line-through text-gray-500" : ""
              }`}
            />
            <button
              onClick={() => deleteItem(item.id)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all cursor-pointer"
            >
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>
        ))}
      </div>
      <div className="p-6 pt-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Add an item..."
            className="flex-1 px-4 py-2.5 rounded-xl backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-gray-200/40 dark:border-white/10 outline-none focus:border-[var(--accent)] transition-colors text-sm"
          />
          <button
            onClick={addItem}
            className="px-4 py-2.5 rounded-xl bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-all duration-200 cursor-pointer"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
