import { useScrollAnimation } from "../../hooks/useScrollAnimation";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export default function AnimatedSection({ children, className = "", id }: AnimatedSectionProps) {
  const { ref, isVisible } = useScrollAnimation(0.05);

  return (
    <div
      id={id}
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-12 scale-[0.97]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
