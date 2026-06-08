interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function GlassCard({ children, className = "", onClick, style }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`backdrop-blur-xl bg-[var(--surface-bg)] border border-gray-200/40 dark:border-white/10 rounded-2xl shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
