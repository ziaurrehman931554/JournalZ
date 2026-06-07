import { Shield, Cloud, Bell, CheckSquare, Layers, Pen, Wifi, Lock } from "lucide-react";
import AnimatedSection from "../ui/AnimatedSection";

const features = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "Your notes are encrypted before they leave your device. Not even we can read them.",
  },
  {
    icon: Wifi,
    title: "Offline First",
    description: "Create and edit notes without internet. Changes sync automatically when you're back online.",
  },
  {
    icon: Cloud,
    title: "Seamless Sync",
    description: "Access your notes from any device. Real-time sync keeps everything up to date.",
  },
  {
    icon: Layers,
    title: "Smart Folders",
    description: "Organize notes with a flexible folder structure. Nest folders for deeper organization.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never forget an important note. Set reminders with desktop and push notifications.",
  },
  {
    icon: CheckSquare,
    title: "Interactive Checklists",
    description: "Create and track checklists within your notes. Perfect for tasks and shopping lists.",
  },
  {
    icon: Pen,
    title: "Rich Text Editor",
    description: "Format your notes with headings, bold, italic, tables, lists, and more.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "No data mining, no ads. Your data belongs to you, period.",
  },
];

export default function Features() {
  return (
    <AnimatedSection id="features">
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need for{" "}
              <span className="text-[var(--accent)]">peaceful writing</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              JournalZ combines the best of note-taking with modern security and privacy practices.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map(({ icon: Icon, title, description }, idx) => (
              <AnimatedSection key={title}>
                <div
                  className="p-6 rounded-2xl backdrop-blur-xl bg-blue-100/80 hover-pop transition-all duration-200 dark:bg-white/5 border border-gray-200/40 dark:border-white/10 hover:bg-white/15 dark:hover:bg-white/10 transition-all duration-200 h-full flex flex-col"
                  style={{ transitionDelay: `${idx * 50}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mb-4 shrink-0">
                    <Icon size={20} className="text-[var(--accent)]" />
                  </div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">
                    {description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
