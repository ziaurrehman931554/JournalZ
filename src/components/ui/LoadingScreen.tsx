import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";

interface LoadingScreenProps {
  onFinished: () => void;
}

export default function LoadingScreen({ onFinished }: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);
  const [start, setStart] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStart(true), 100);
    return () => clearTimeout(startTimer);
  }, []);

  useEffect(() => {
    if (!start) return;
    const finishTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onFinished, 600);
    }, 1500);
    return () => clearTimeout(finishTimer);
  }, [start, onFinished]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-700 ${
        visible
          ? "opacity-100 scale-100 backdrop-blur-2xl bg-white/80 dark:bg-[#0a0a0f]/90"
          : "opacity-0 scale-110 pointer-events-none"
      }`}
    >
      <img
        src={logo}
        alt="JournalZ"
        className="w-24 h-24 md:w-28 md:h-28 object-contain mb-6 animate-float"
      />
      <h1 className="text-3xl font-bold tracking-tight">
        <span className="text-[var(--accent)]">J</span>ournalZ.
      </h1>
      <div className="mt-12 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[var(--accent)]"
            style={{ animation: `loadPulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}
