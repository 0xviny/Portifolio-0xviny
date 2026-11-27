import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const layer = useRef<HTMLDivElement>(null);
  const raf = useRef(0);

  useEffect(() => {
    const el = layer.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const root = document.documentElement;
    let x = window.innerWidth / 2;
    let y = window.innerHeight * 0.35;
    let pending = false;

    const paint = () => {
      pending = false;
      const rect = el.getBoundingClientRect();
      root.style.setProperty("--gx", `${Math.round(x - rect.left)}px`);
      root.style.setProperty("--gy", `${Math.round(y - rect.top)}px`);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!pending) {
        pending = true;
        raf.current = requestAnimationFrame(paint);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <div
      ref={layer}
      aria-hidden="true"
      className="cursor-glow pointer-events-none absolute inset-0 -z-10"
    />
  );
}
