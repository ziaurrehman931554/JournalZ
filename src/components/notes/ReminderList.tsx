import type { Reminder } from "../../types";
import { Bell, CheckCircle, Trash2, Clock } from "lucide-react";

interface ReminderListProps {
  reminders: Reminder[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ReminderList({ reminders, onComplete, onDelete }: ReminderListProps) {
  const sorted = [...reminders].sort((a, b) => a.dueDate - b.dueDate);
  const upcoming = sorted.filter((r) => !r.isCompleted);
  const completed = sorted.filter((r) => r.isCompleted);

  if (reminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <Bell size={48} className="mb-4 opacity-30" />
        <p className="text-lg font-medium mb-1">No reminders</p>
        <p className="text-sm">Add reminders to stay on track</p>
      </div>
    );
  }

  return (
    <div className="space-y-1 p-3 overflow-y-auto h-full">
      {upcoming.length > 0 && (
        <>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mb-2">Upcoming</p>
          {upcoming.map((r) => (
            <ReminderItem key={r.id} reminder={r} onComplete={onComplete} onDelete={onDelete} />
          ))}
        </>
      )}
      {completed.length > 0 && (
        <>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-1 mt-4 mb-2">Completed</p>
          {completed.map((r) => (
            <ReminderItem key={r.id} reminder={r} onComplete={onComplete} onDelete={onDelete} />
          ))}
        </>
      )}
    </div>
  );
}

function ReminderItem({
  reminder,
  onComplete,
  onDelete,
}: {
  reminder: Reminder;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const isOverdue = !reminder.isCompleted && reminder.dueDate < Date.now();
  const dueDate = new Date(reminder.dueDate);
  const now = new Date();
  const isToday = dueDate.toDateString() === now.toDateString();
  const isTomorrow = new Date(now.getTime() + 86400000).toDateString() === dueDate.toDateString();

  let dateLabel: string;
  if (isToday) dateLabel = "Today";
  else if (isTomorrow) dateLabel = "Tomorrow";
  else dateLabel = dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div
      className={`group flex items-start gap-3 p-3 rounded-xl transition-all duration-200 ${
        reminder.isCompleted
          ? "opacity-50"
          : isOverdue
            ? "bg-red-500/5 border border-red-500/10"
            : "hover:bg-white/10"
      }`}
    >
      <button
        onClick={() => onComplete(reminder.id)}
        className="mt-0.5 cursor-pointer"
      >
        <CheckCircle
          size={16}
          className={reminder.isCompleted ? "text-green-400" : "text-gray-500 hover:text-green-400 transition-colors"}
        />
      </button>
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${reminder.isCompleted ? "line-through" : ""}`}>
          {reminder.title}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <Clock size={10} className={isOverdue ? "text-red-400" : "text-gray-500"} />
          <span className={`text-xs ${isOverdue ? "text-red-400" : "text-gray-500"}`}>
            {dateLabel} {dueDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
      <button
        onClick={() => onDelete(reminder.id)}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded-lg transition-all cursor-pointer"
      >
        <Trash2 size={12} className="text-red-400" />
      </button>
    </div>
  );
}
