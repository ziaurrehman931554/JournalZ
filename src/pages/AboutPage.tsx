import Navbar from "../components/layout/Navbar";
import Footer from "../components/landing/Footer";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import CursorFollower from "../components/ui/CursorFollower";
import AnimatedSection from "../components/ui/AnimatedSection";
import { Lock, Globe, Heart, Sparkles, Shield, ExternalLink } from "lucide-react";

const values = [
  { icon: Lock, title: "Privacy First", desc: "Your data never leaves your device unencrypted. We built JournalZ so you never have to trust us — only the math." },
  { icon: Globe, title: "Offline Native", desc: "Works everywhere, even on a plane. Your notes are always accessible, with or without internet." },
  { icon: Heart, title: "User Obsessed", desc: "Every feature is designed with your peace of mind in mind. No clutter, no distractions, no ads." },
  { icon: Shield, title: "Open Source", desc: "Our code is open for review. Transparency builds trust, and we believe you deserve both." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <CursorFollower />
      <Navbar />
      <main className="relative z-10 pt-24">
        <AnimatedSection>
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-sm text-[var(--accent)] mb-6">
                <Sparkles size={14} />
                About JournalZ
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Built for people who{" "}
                <span className="text-[var(--accent)]">value privacy</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-12">
                JournalZ was created to solve a simple problem: most notes apps either lack privacy,
                lack offline support, or lack a beautiful experience. We wanted all three.
              </p>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-12">Our Values</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {values.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="p-6 rounded-2xl backdrop-blur-xl bg-blue-100/80 hover-pop transition-all duration-200 dark:bg-white/5 border border-gray-200/40 dark:border-white/10 h-full flex flex-col">
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center mb-4">
                      <Icon size={20} className="text-[var(--accent)]" />
                    </div>
                    <h3 className="font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        <AnimatedSection>
          <section className="py-16 px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="p-8 rounded-2xl backdrop-blur-xl bg-blue-100/80 hover-pop transition-all duration-200 dark:bg-white/5 border border-gray-200/40 dark:border-white/10">
                <ExternalLink size={32} className="mx-auto mb-4 text-[var(--accent)]" />
                <h2 className="text-2xl font-bold mb-4">Open Source</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  JournalZ is open source. You can inspect every line of code, suggest improvements,
                  or fork it for your own projects. No black boxes, no closed protocols.
                </p>
                <a
                  href="https://github.com/ziaurrehman931554/JournalZ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent)] text-white font-medium hover:opacity-90 transition-all duration-200"
                >
                  <ExternalLink size={18} />
                  View on GitHub
                </a>
              </div>
            </div>
          </section>
        </AnimatedSection>
      </main>
      <Footer />
    </div>
  );
}
