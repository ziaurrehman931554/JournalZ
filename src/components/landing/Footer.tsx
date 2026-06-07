import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold text-lg">
          <span className="text-[var(--accent)]">J</span>ournalZ.
        </div>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          Made with <Heart size={14} className="text-red-400" /> for privacy lovers
        </p>
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} JournalZ. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
