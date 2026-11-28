import { useEffect, useRef } from "react";
import { statement } from "../data/content";

/* momento da página: a frase descansa a meio tom e acende palavra por palavra
   conforme cruza o meio da tela (e volta a apagar na subida). */
export default function Statement() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const spans = Array.from(el.querySelectorAll<HTMLElement>("[data-word]"));
    if (!spans.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      spans.forEach((s) => {
        s.style.opacity = "1";
        if (s.dataset.accent === "1") s.style.color = "var(--color-accent)";
      });
      return;
    }

    let raf = 0;
    let pending = false;

    const paint = () => {
      pending = false;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const raw = (vh * 0.88 - rect.top) / (vh * 0.5);
      const p = Math.min(1, Math.max(0, raw)) * spans.length;

      spans.forEach((span, i) => {
        const local = Math.min(1, Math.max(0, p - i));
        span.style.opacity = `${0.45 + 0.55 * local}`;
        span.style.color =
          span.dataset.accent === "1" && local > 0.55 ? "var(--color-accent)" : "";
      });
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const words = statement.text.split(" ");

  return (
    <section aria-label="Como eu trabalho" className="py-20 md:py-28">
      <div className="wrap">
        <div ref={root} className="max-w-[62rem]">
          <span className="tick" aria-hidden="true" />
          <p className="mt-6 font-display text-[clamp(1.75rem,4vw,3.5rem)] leading-[1.1] tracking-[-0.02em]">
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                data-word
                data-accent={word === statement.accentWord ? "1" : "0"}
                className="inline-block text-ink"
                style={{ opacity: 0.45 }}
              >
                {word}
                {i < words.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
