import { useEffect, useRef } from "react";

type Bubble = {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  depth: number;
  hue: number;
};

export default function BubbleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    let width = 0;
    let height = 0;
    let bubbles: Bubble[] = [];
    let raf = 0;
    let running = true;
    let rect = canvas.getBoundingClientRect();

    const pointer = { x: -9999, y: -9999, active: false };

    const makeBubbles = () => {
      const count = Math.round(Math.min(44, Math.max(16, width / 32)));
      bubbles = Array.from({ length: count }, () => {
        const depth = 0.25 + Math.random() * 0.75;
        return {
          x: Math.random() * width,
          y: Math.random() * (height + 300) - 150,
          r: 5 + Math.random() * 36 * depth,
          vx: (Math.random() - 0.5) * 0.28,
          vy: -0.1 - Math.random() * 0.24,
          depth,
          hue: Math.random(),
        };
      });
    };

    const resize = () => {
      rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeBubbles();
      if (reduced) draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const scrollLag = -rect.top;

      for (const b of bubbles) {
        if (!reduced) {
          b.x += b.vx;
          b.y += b.vy;

          const px = b.x;
          const py = b.y - scrollLag * b.depth * 0.18;

          if (pointer.active) {
            const dx = px - pointer.x;
            const dy = py - pointer.y;
            const dist = Math.hypot(dx, dy);
            const radius = 160;
            if (dist < radius && dist > 0.001) {
              const force = (1 - dist / radius) * 0.9 * b.depth;
              b.vx += (dx / dist) * force;
              b.vy += (dy / dist) * force;
            }
          }

          b.vx += (Math.random() - 0.5) * 0.014;
          b.vy += -0.005;
          b.vx *= 0.985;
          b.vy = Math.max(-1.5, Math.min(1.5, b.vy)) * 0.995;

          if (b.x < -70) b.x = width + 70;
          if (b.x > width + 70) b.x = -70;
          if (b.y < -200) b.y = height + 150;
          if (b.y > height + 250) b.y = -150;
        }

        const py =
          ((((b.y - scrollLag * b.depth * 0.18) % (height + 300)) + height + 300) %
            (height + 300)) -
          150;
        const px = b.x;

        const green = b.hue > 0.5;
        ctx.beginPath();
        ctx.arc(px, py, b.r, 0, Math.PI * 2);
        if (green) {
          ctx.strokeStyle = `rgba(23, 160, 109, ${0.25 + b.depth * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = `rgba(13, 122, 84, ${0.05 + b.depth * 0.06})`;
          ctx.fill();
        } else {
          ctx.strokeStyle = `rgba(216, 219, 217, ${0.06 + b.depth * 0.08})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        if (b.r > 14) {
          ctx.beginPath();
          ctx.arc(px - b.r * 0.34, py - b.r * 0.34, b.r * 0.16, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.10)";
          ctx.fill();
        }
      }
    };

    const loop = () => {
      if (!running) return;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active =
        pointer.x > -100 && pointer.x < width + 100 && pointer.y > -100 && pointer.y < height + 100;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onScroll = () => {
      rect = canvas.getBoundingClientRect();
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running && !reduced) loop();
      else cancelAnimationFrame(raf);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    if (!reduced) raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
    />
  );
}
