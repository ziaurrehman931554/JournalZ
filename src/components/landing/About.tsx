import { Sparkles, Lock, Globe, Heart } from "lucide-react";
import AnimatedSection from "../ui/AnimatedSection";

const highlights = [
  {
    icon: Lock,
    title: "Privacy Built In",
    desc: "Every note is encrypted end-to-end. Your data never touches our servers in plain text.",
  },
  {
    icon: Globe,
    title: "Offline & Online",
    desc: "Works seamlessly offline. Syncs automatically when you reconnect — no buttons to press.",
  },
  {
    icon: Heart,
    title: "Made with Love",
    desc: "Built for people who care about their digital privacy and want a serene writing experience.",
  },
];

export default function About() {
  return (
    <AnimatedSection id="about">
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-sm text-[var(--accent)] mb-6">
                <Sparkles size={14} />
                About JournalZ
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                A modern notes app built for{" "}
                <span className="text-[var(--accent)]">peace of mind</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                JournalZ started with a simple idea: note-taking should be private, beautiful, and
                reliable. We combined AES-256 encryption with offline-first architecture to create a
                notes app that respects your privacy while delivering a premium experience.
              </p>
              <div className="space-y-4">
                {highlights.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                      <Icon size={18} className="text-[var(--accent)]" />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{title}</h4>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-3xl backdrop-blur-xl bg-blue-100/80 hover-pop transition-all duration-200 dark:bg-white/5 border border-gray-200/40 dark:border-white/10 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔐</div>
                  <h3 className="text-xl font-bold mb-2">Your Key, Your Data</h3>
                  <p className="text-sm text-gray-500">
                    Encryption happens on your device. We never see your content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}
