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
      className={`backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}
