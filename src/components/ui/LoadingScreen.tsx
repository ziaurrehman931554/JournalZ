import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onFinished: () => void;
}

function IOSpinner() {
  const segments = 12;
  return (
    <div className="relative w-10 h-10">
      {Array.from({ length: segments }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 left-1/2 -translate-x-1/2 origin-[50%_20px]"
          style={{ transform: `rotate(${i * 30}deg)` }}
        >
          <div
            className="w-[3px] h-[9px] rounded-full bg-[var(--accent)]"
            style={{
              opacity: 0.2 + (i / segments) * 0.8,
              animation: `iosSpin 1s linear infinite`,
              animationDelay: `${(i / segments) * -1}s`,
            }}
          />
        </div>
      ))}
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
          ? "opacity-100 scale-100 backdrop-blur-2xl bg-white/80 dark:bg-[#0a0a0f]/90"
          : "opacity-0 scale-110 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-[var(--accent)]/10 flex items-center justify-center mb-6 animate-float">
          <span className="text-5xl md:text-6xl font-black text-[var(--accent)]">Z</span>
        </div>
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
