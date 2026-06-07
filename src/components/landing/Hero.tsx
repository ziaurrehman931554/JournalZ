import { Link } from "react-router-dom";
import { Pen, Shield, Cloud, Bell, CheckSquare, Layers } from "lucide-react";
import AnimatedSection from "../ui/AnimatedSection";
import logo from "../../assets/logo.png";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-[var(--accent)]/5 pointer-events-none" />
      <AnimatedSection className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="JournalZ" className="w-20 h-20 md:w-24 md:h-24 object-contain animate-float" />
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Your thoughts, encrypted & synced
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Write with{" "}
          <span className="text-[var(--accent)]">Peace of Mind</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          JournalZ is a privacy-first notes app with end-to-end encryption,
          offline support, smart reminders, and seamless cloud sync.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <Link
            to="/join"
            className="px-8 py-3.5 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition-all duration-200 shadow-lg shadow-[var(--accent)]/25"
          >
            Start Writing Free
          </Link>
          <Link
            to="/join"
            className="px-8 py-3.5 rounded-xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 font-semibold hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-200"
          >
            Log in
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-3xl mx-auto">
          {[
            { icon: Shield, label: "Encrypted" },
            { icon: Cloud, label: "Cloud Sync" },
            { icon: Bell, label: "Reminders" },
            { icon: CheckSquare, label: "Checklists" },
            { icon: Layers, label: "Folders" },
            { icon: Pen, label: "Rich Notes" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-4 rounded-xl backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10"
            >
              <Icon size={24} className="text-[var(--accent)]" />
              <span className="text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
