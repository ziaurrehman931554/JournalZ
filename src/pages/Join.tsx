import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleSignIn from "../components/auth/GoogleSignIn";
import AppleSignIn from "../components/auth/AppleSignIn";
import EmailSignIn from "../components/auth/EmailSignIn";

export default function Join() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  useEffect(() => {
    if (user) navigate("/app", { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-8">
            <span className="text-[var(--accent)]">J</span>ournalZ.
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            {mode === "signin" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-gray-500 mb-8">
            {mode === "signin"
              ? "Sign in to access your encrypted notes"
              : "Start your private note-taking journey"}
          </p>

          <div className="space-y-4">
            <GoogleSignIn />
            <AppleSignIn />

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-sm text-gray-500">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <EmailSignIn
              mode={mode}
              onToggleMode={() => setMode(mode === "signin" ? "signup" : "signin")}
            />
          </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5 items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="text-6xl mb-6">🔐</div>
          <h2 className="text-2xl font-bold mb-4">Your notes, your privacy</h2>
          <p className="text-gray-500 leading-relaxed">
            End-to-end encryption ensures that only you can read your notes.
            Not even we have access to your content.
          </p>
        </div>
      </div>
    </div>
  );
}
