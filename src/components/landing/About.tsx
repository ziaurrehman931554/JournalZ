import { Heart, Shield, Zap } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Built with Love",
    description: "Every feature is crafted with care to make your journaling experience joyful and meaningful.",
    color: "text-red-500",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your thoughts are private. We use industry-standard encryption to keep your data safe.",
    color: "text-blue-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed. JournalZ loads instantly and responds to every action without delay.",
    color: "text-yellow-500",
  },
];

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why JournalZ?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              JournalZ was born from the belief that journaling should be a pleasure, not a chore.
              We combined the best aspects of note-taking apps with intelligent features to create
              a companion that adapts to your lifestyle.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
              Whether you're jotting down daily thoughts, managing tasks, or setting reminders,
              JournalZ provides a seamless experience across all your devices.
            </p>
            <div className="flex flex-wrap gap-3">
              {["Note-Taking", "Task Management", "Reminders", "Organization", "Privacy", "Speed"].map((tag) => (
                <span key={tag} className="block px-3 py-1 text-sm rounded-full border border-[var(--accent)]/30 bg-[var(--surface-bg)]/60 backdrop-blur-xl text-gray-700 dark:text-gray-300 hover:scale-105 active:scale-95 transition-all duration-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-2xl border border-white/30 dark:border-white/10 bg-[var(--surface-bg)]/60 backdrop-blur-xl"
                >
                  <div className="p-6">
                    <div className="flex gap-4">
                      <Icon size={24} className={`${value.color} shrink-0 mt-1`} />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{value.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
