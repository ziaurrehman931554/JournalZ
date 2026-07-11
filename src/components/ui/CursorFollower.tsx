import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function CursorFollower() {
  const { theme } = useTheme();
  const [isTouch, setIsTouch] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches
  );
  const dotRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mq = window.matchMedia('(hover: none) and (pointer: coarse)');
    setIsTouch(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isTouch) return;
    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouse);
    return () => window.removeEventListener("mousemove", onMouse);
  }, [isTouch]);

  useEffect(() => {
    if (isTouch) return;
    let frame = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      const p = posRef.current;
      const m = mouseRef.current;
      p.x = lerp(p.x, m.x, 0.08);
      p.y = lerp(p.y, m.y, 0.08);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${p.x - 100}px, ${p.y - 100}px)`;
      }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div
      ref={dotRef}
      className="fixed top-0 left-0 pointer-events-none z-[9998] w-[200px] h-[200px] rounded-full transition-opacity duration-500"
      style={{
        background:
          theme === "dark"
            ? "radial-gradient(circle at center, rgba(96,165,250,0.12) 0%, transparent 70%)"
            : "radial-gradient(circle at center, rgba(30,64,175,0.2) 0%, transparent 70%)",
      }}
    />
  );
}
