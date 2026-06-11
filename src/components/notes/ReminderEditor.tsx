import { useState, useEffect } from "react";
import type { Reminder } from "../../types";
import { Trash2, Calendar, Clock, MapPin, Tag, Save, X } from "lucide-react";
import { requestNotificationPermission } from "../../services/notifications";

interface ReminderEditorProps {
  reminder: Reminder;
  onSave: (reminder: Reminder) => void;
  onDelete?: (id: string) => void;
  onCancel?: () => void;
}

export default function ReminderEditor({ reminder, onSave, onDelete, onCancel }: ReminderEditorProps) {
  const [title, setTitle] = useState(reminder.title || "");
  const [description, setDescription] = useState(reminder.description || "");

  useEffect(() => { requestNotificationPermission(); }, []);
  const [dueDate, setDueDate] = useState(
    reminder.dueDate ? new Date(reminder.dueDate).toISOString().slice(0, 10) : ""
  );
  const [dueTime, setDueTime] = useState(
    reminder.dueDate
      ? new Date(reminder.dueDate).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })
      : ""
  );
  const [location, setLocation] = useState(reminder.location || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(reminder.tags || []);

  const handleSave = () => {
    if (!title.trim()) return;
    const due = dueDate
      ? new Date(`${dueDate}T${dueTime || "12:00"}`).getTime()
      : Date.now() + 86400000;
    onSave({
      ...reminder,
      title: title.trim(),
      description: description.trim(),
      dueDate: due,
      location: location.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    });
  };

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (t: string) => setTags(tags.filter((x) => x !== t));

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <h2 className="font-semibold">{reminder.id ? "Edit Reminder" : "New Reminder"}</h2>
        <div className="flex gap-2">
          {onDelete && (
            <button onClick={() => onDelete(reminder.id)} className="p-2 rounded-xl hover:bg-red-500/20 hover-pop transition-colors cursor-pointer" title="Delete">
              <Trash2 size={16} className="text-red-400" />
            </button>
          )}
          {onCancel && (
            <button onClick={onCancel} className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 hover-pop transition-colors cursor-pointer">
              <X size={16} />
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 disabled:opacity-50 hover-pop transition-all cursor-pointer"
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <input
          type="text"
          placeholder="Reminder title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-xl font-bold bg-transparent outline-none placeholder-gray-500"
          autoFocus
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full bg-transparent outline-none placeholder-gray-500 resize-none text-sm leading-relaxed"
        />
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-gray-500 shrink-0" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-[var(--surface-bg)] border border-gray-200/40 dark:border-white/10 outline-none focus:border-[var(--accent)] transition-colors text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <Clock size={16} className="text-gray-500 shrink-0" />
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-[var(--surface-bg)] border border-gray-200/40 dark:border-white/10 outline-none focus:border-[var(--accent)] transition-colors text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={16} className="text-gray-500 shrink-0" />
            <input
              type="text"
              placeholder="Location (optional)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl bg-[var(--surface-bg)] border border-gray-200/40 dark:border-white/10 outline-none focus:border-[var(--accent)] transition-colors text-sm"
            />
          </div>
          <div className="flex items-start gap-3">
            <Tag size={16} className="text-gray-500 shrink-0 mt-3" />
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  className="flex-1 px-3 py-2 rounded-xl bg-[var(--surface-bg)] border border-gray-200/40 dark:border-white/10 outline-none focus:border-[var(--accent)] transition-colors text-sm"
                />
                <button onClick={addTag} className="px-3 py-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium hover:bg-[var(--accent)]/20 transition-colors cursor-pointer">
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-xs text-[var(--accent)]">
                      {t}
                      <button onClick={() => removeTag(t)} className="hover:text-red-400 cursor-pointer">&times;</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
