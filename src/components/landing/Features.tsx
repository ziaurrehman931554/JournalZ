import { FileText, CheckSquare, Bell, FolderTree, Search, Sparkles } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Rich Notes",
    description: "Write beautifully formatted notes with Markdown support and real-time preview.",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: CheckSquare,
    title: "Smart Checklists",
    description: "Create interactive checklists that adapt to your workflow and sync across devices.",
    color: "from-green-400 to-green-600",
  },
  {
    icon: Bell,
    title: "Intelligent Reminders",
    description: "Set location-based and time-based reminders that keep you on track.",
    color: "from-yellow-400 to-yellow-600",
  },
  {
    icon: FolderTree,
    title: "Organized Folders",
    description: "Keep your notes tidy with nested folders and powerful organization tools.",
    color: "from-purple-400 to-purple-600",
  },
  {
    icon: Search,
    title: "Quick Search",
    description: "Find anything instantly with lightning-fast search across all your content.",
    color: "from-pink-400 to-pink-600",
  },
  {
    icon: Sparkles,
    title: "Beautiful Design",
    description: "Enjoy a stunning glass-morphism interface with smooth animations and dark mode.",
    color: "from-[var(--accent)] to-purple-500",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful features designed to make journaling a delightful daily habit.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group hover:scale-105 transition-all duration-300 rounded-2xl border border-white/30 dark:border-white/10 bg-[var(--surface-bg)]/60 backdrop-blur-xl"
              >
                <div className="p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
