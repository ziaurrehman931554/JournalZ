import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";

interface LoadingScreenProps {
  onFinished: () => void;
}

function IOSpinner() {
  return (
    <div className="relative w-10 h-10">
      <svg className="w-10 h-10 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.1" className="text-[var(--accent)]" />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function LoadingScreen({ onFinished }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinished, 600);
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-700 ${
        visible
          ? "opacity-100 scale-100 backdrop-blur-2xl bg-[var(--surface-bg)]"
          : "opacity-0 scale-110 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center justify-center flex-1">
        <img
          src={logo}
          alt="JournalZ"
          className="w-24 h-24 md:w-28 md:h-28 object-contain mb-6 animate-float"
        />
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="text-[var(--accent)]">J</span>ournalZ.
        </h1>
      </div>
      <div className="pb-16">
        <IOSpinner />
      </div>
    </div>
  );
}
