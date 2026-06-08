import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-purple-500/5" />
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[var(--accent)]/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float-delayed" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-2xl bg-[var(--surface-bg)] border border-white/10 mb-8 animate-slide-down">
          <Sparkles size={16} className="text-[var(--accent)]" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Your Intelligent Journaling Companion</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          <span className="text-gray-900 dark:text-white">Capture Your</span>
          <br />
          <span className="bg-gradient-to-r from-[var(--accent)] to-purple-500 bg-clip-text text-transparent">
            Thoughts Beautifully
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          JournalZ combines the elegance of note-taking with intelligent reminders,
          checklists, and organization tools — all wrapped in a stunning, modern interface.
        </p>

        <div className="flex items-center justify-center gap-4">
          {user ? (
            <Link
              to="/app"
              className="group inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[var(--accent)] text-white font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Go to App
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <Link
              to="/auth"
              className="group inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-[var(--accent)] text-white font-medium transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Get Started Free
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
          <Link
            to="/about"
            className="px-8 py-3 rounded-xl backdrop-blur-2xl bg-[var(--surface-bg)] border border-white/10 font-medium transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Learn More
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          {[
            { value: "10K+", label: "Active Users" },
            { value: "50K+", label: "Notes Created" },
            { value: "4.9★", label: "User Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
