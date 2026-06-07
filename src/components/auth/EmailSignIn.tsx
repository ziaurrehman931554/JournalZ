import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

interface EmailSignInProps {
  mode: "signin" | "signup";
  onToggleMode: () => void;
}

export default function EmailSignIn({ mode, onToggleMode }: EmailSignInProps) {
  const { signInWithEmail, signUpWithEmail, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError.code === "auth/user-not-found") setError("No account found with this email");
      else if (firebaseError.code === "auth/wrong-password") setError("Incorrect password");
      else if (firebaseError.code === "auth/email-already-in-use") setError("Email already in use");
      else if (firebaseError.code === "auth/weak-password") setError("Password should be at least 6 characters");
      else setError(firebaseError.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Enter your email first");
      return;
    }
    setError("");
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch {
      setError("Failed to send reset email");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full pl-10 pr-4 py-3 rounded-xl backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-gray-200/40 dark:border-white/10 outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>
      <div className="relative">
        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full pl-10 pr-10 py-3 rounded-xl backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-gray-200/40 dark:border-white/10 outline-none focus:border-[var(--accent)] transition-colors"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {resetSent && <p className="text-green-400 text-sm">Reset email sent. Check your inbox.</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-xl bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition-all duration-200 disabled:opacity-50 cursor-pointer"
      >
        {loading ? "Please wait..." : mode === "signin" ? "Sign In" : "Create Account"}
      </button>
      {mode === "signin" && (
        <button
          type="button"
          onClick={handleResetPassword}
          className="text-sm text-gray-400 hover:text-[var(--accent)] transition-colors w-full text-center cursor-pointer"
        >
          Forgot password?
        </button>
      )}
      <p className="text-sm text-gray-400 text-center">
        {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={onToggleMode}
          className="text-[var(--accent)] hover:underline cursor-pointer"
        >
          {mode === "signin" ? "Sign Up" : "Sign In"}
        </button>
      </p>
    </form>
  );
}
