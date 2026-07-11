import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";

interface Shape {
  el: HTMLDivElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export default function AnimatedBackground() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<Shape[]>([]);
  const frameRef = useRef<number>(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
    setIsTouch(mq.matches);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const darkColors = ["#151515", "#181818", "#1c1c1c"];
    const lightColors = ["#92C7CF", "#AAD7D9", "#E5E1DA"];
    const shapeTypes = ["circle", "rounded", "blob"];

    const count = 8;
    const items: Shape[] = [];
    const isDark = document.documentElement.classList.contains("dark");
    const colors = isDark ? darkColors : lightColors;

    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      const size = 80 + Math.random() * 200;
      const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
      const color = colors[i % colors.length];

      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.position = "absolute";
      el.style.borderRadius =
        type === "circle" ? "50%" : type === "rounded" ? "30%" : "60% 40% 30% 70% / 40% 60% 70% 30%";
      el.style.background = `radial-gradient(circle at 30% 30%, ${color}, transparent)`;
      el.style.filter = "blur(60px)";
      el.style.pointerEvents = "none";
      el.style.left = `${Math.random() * 100}%`;
      el.style.top = `${Math.random() * 100}%`;
      el.style.transform = "translate(-50%, -50%)";
      el.style.opacity = isDark ? "0.2" : "0.5";

      container.appendChild(el);

      items.push({
        el,
        x: parseFloat(el.style.left),
        y: parseFloat(el.style.top),
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size,
      });
    }

    shapesRef.current = items;

    if (isTouch) {
      return () => {
        for (const s of items) s.el.remove();
      };
    }

    const animate = () => {
      for (const s of items) {
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < -5 || s.x > 105) s.vx *= -1;
        if (s.y < -5 || s.y > 105) s.vy *= -1;

        s.el.style.left = `${s.x}%`;
        s.el.style.top = `${s.y}%`;

        const rot = parseFloat(s.el.dataset.rot || "0") + 0.1;
        s.el.dataset.rot = String(rot);
        s.el.style.transform = `translate(-50%, -50%) rotate(${rot}deg)`;
      }
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameRef.current);
      for (const s of items) s.el.remove();
    };
  }, [theme, isTouch]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  );
}