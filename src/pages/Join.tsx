import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import GoogleSignIn from "../components/auth/GoogleSignIn";
import AppleSignIn from "../components/auth/AppleSignIn";
import EmailSignIn from "../components/auth/EmailSignIn";
import { Mail, Sparkles, Shield, Server, Globe, ArrowLeft, Ban, CheckCircle } from "lucide-react";
import logo from "../assets/logo.png";

const stats = [
  { icon: Shield, label: "End-to-End Encrypted" },
  { icon: Server, label: "Offline Support" },
  { icon: Globe, label: "Open Source" },
];

export default function Join() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [hoveredZiD, setHoveredZiD] = useState(false);

  useEffect(() => {
    if (user) navigate("/app", { replace: true });
  }, [user, navigate]);

  const handleSelectMethod = (method: string) => {
    if (method === "zid") return;
    if (method === "email") setSelectedMethod("email");
  };

  const staggerDelay = (i: number) => ({
    animationDelay: `${0.1 + i * 0.08}s`,
  });

  return (
    <div className="min-h-screen flex">
      {/* LEFT — Info section (35%) */}
      <div className="hidden lg:flex w-[35%] bg-gradient-to-br from-[var(--accent)]/20 via-[var(--accent)]/5 to-[var(--accent)]/10 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-1/4 -left-16 w-64 h-64 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        <div className="absolute bottom-1/3 -right-16 w-48 h-48 rounded-full bg-[var(--accent)]/8 blur-3xl" />

        <div className="flex-1 flex items-center justify-center p-12 relative z-10">
          <div className="max-w-xs w-full animate-fade-in-up">
            {/* Logo */}
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 mb-10 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <img src={logo} alt="JournalZ" className="w-9 h-9 object-contain" />
              <span className="font-bold text-2xl tracking-tight">
                <span className="text-[var(--accent)]">J</span>ournalZ.
              </span>
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
                Your thoughts,{" "}
                <span className="text-[var(--accent)]">fully yours</span>
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                JournalZ combines the elegance of note-taking with military-grade
                encryption. Every note, checklist, and reminder is protected so
                only you can access it.
              </p>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-10">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex items-center gap-3 animate-fade-in-up"
                    style={staggerDelay(i)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                      <Icon size={15} className="text-[var(--accent)]" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {stat.label}
                    </span>
                    <CheckCircle size={14} className="ml-auto text-[var(--accent)]/60 shrink-0" />
                  </div>
                );
              })}
            </div>

            {/* Trust note */}
            <div className="p-4 rounded-2xl border border-[var(--accent)]/20 bg-[var(--accent)]/[0.06] backdrop-blur-sm">
              <div className="flex gap-2.5">
                <Sparkles size={14} className="mt-0.5 shrink-0 text-[var(--accent)]" />
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  We don't store your password. Your encryption key never leaves
                  your device.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — Auth panel (65%) */}
      <div className="flex-1 lg:w-[65%] bg-[var(--surface-bg)] border-l border-gray-200/40 dark:border-white/5 flex items-center justify-center p-12">
        <div className="w-full max-w-sm flex flex-col min-h-0">
          {/* Logo + back button */}
          <div className="flex items-center justify-between mb-8">
            {selectedMethod ? (
              <button
                onClick={() => setSelectedMethod(null)}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[var(--accent)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            ) : (
              <div />
            )}
            <Link
              to="/"
              className="inline-flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <img src={logo} alt="JournalZ" className="w-7 h-7 object-contain" />
              <span className="font-bold text-base">
                <span className="text-[var(--accent)]">J</span>ournalZ.
              </span>
            </Link>
          </div>

          {/* Center content */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedMethod === "email"
                ? mode === "signin"
                  ? "Sign in with Email"
                  : "Create Account"
                : "Welcome"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              {selectedMethod === "email"
                ? mode === "signin"
                  ? "Enter your credentials to access your notes"
                  : "Fill in the details to get started"
                : "Choose your preferred sign-in method"}
            </p>

            {/* Options or form */}
            <div className="space-y-3">
              {!selectedMethod && (
                <>
                  <div className="animate-fade-in-up" style={staggerDelay(0)}>
                    <GoogleSignIn />
                  </div>
                  <div className="animate-fade-in-up" style={staggerDelay(1)}>
                    <AppleSignIn />
                  </div>
                  <div
                    className="relative animate-fade-in-up"
                    style={staggerDelay(2)}
                    onMouseEnter={() => setHoveredZiD(true)}
                    onMouseLeave={() => setHoveredZiD(false)}
                  >
                    <button
                      disabled
                      className="w-full py-3 px-4 rounded-xl backdrop-blur-xl bg-[var(--surface-bg)] transition-all duration-200 border border-gray-200/40 dark:border-white/10 font-medium flex items-center justify-center gap-3 opacity-50 cursor-not-allowed"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                        <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <circle cx="12" cy="16" r="1.5" fill="currentColor" />
                      </svg>
                      Continue with ZiD
                    </button>
                    <div
                      className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                        hoveredZiD
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-1 pointer-events-none"
                      } bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg`}
                    >
                      <Ban size={10} className="inline mr-1" />
                      Coming Soon
                    </div>
                  </div>
                  <div className="animate-fade-in-up" style={staggerDelay(3)}>
                    <button
                      onClick={() => handleSelectMethod("email")}
                      className="w-full py-3 px-4 rounded-xl backdrop-blur-xl bg-[var(--accent)] text-white font-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
                    >
                      <Mail size={18} />
                      Continue with Email
                    </button>
                  </div>
                </>
              )}

              {selectedMethod === "email" && (
                <div className="animate-fade-in-up">
                  <EmailSignIn
                    mode={mode}
                    onToggleMode={() => setMode(mode === "signin" ? "signup" : "signin")}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          {!selectedMethod && (
            <p className="mt-8 text-xs text-gray-500 text-center leading-relaxed">
              By continuing, you agree to our{" "}
              <a href="#" className="text-[var(--accent)] hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-[var(--accent)] hover:underline">
                Privacy Policy
              </a>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
