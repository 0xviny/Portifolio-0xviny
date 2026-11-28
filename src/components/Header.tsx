import { useEffect, useState } from "react";
import { AnimatePresence, motion, type MotionValue } from "motion/react";
import { sections, profile } from "../data/content";

function Mark({ className = "size-8" }: { className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-[7px] bg-ink ${className}`}>
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-1/2 w-1/2">
        <path
          d="M15 17 L32 49 L49 17"
          fill="none"
          stroke="#e9e6e1"
          strokeWidth="9"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
      </svg>
    </span>
  );
}

export default function Header({ progress }: { progress: MotionValue<number> }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = sections.find((s) => visible.has(s.id));
        setActive(first ? first.id : "");
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b hairline bg-paper/85 backdrop-blur-md">
        <div className="wrap flex h-16 items-center justify-between gap-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex min-h-11 items-center gap-2.5"
            aria-label="Voltar ao topo"
          >
            <img src="/vg-black.png" alt="Favicon" className="h-6 w-6" />
            <span className="text-[15px] font-medium tracking-[-0.01em] text-ink">
              {profile.fullName}
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Seções">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                data-active={active === s.id}
                aria-current={active === s.id ? "true" : undefined}
                className={`nav-link inline-flex min-h-11 items-center px-3 py-2 text-[15px] transition-colors ${
                  active === s.id ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {s.label}
              </a>
            ))}
            <a href={`mailto:${profile.email}`} className="btn btn-primary ml-4 min-h-10 px-4">
              Fale comigo
            </a>
          </nav>

          <button
            onClick={() => setOpen(true)}
            className="flex min-h-11 min-w-11 flex-col items-end justify-center gap-1.5 py-2 lg:hidden"
            aria-label="Abrir menu"
            aria-expanded={open}
          >
            <span className="block h-px w-6 bg-ink" />
            <span className="block h-px w-6 bg-ink" />
          </button>
        </div>

        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="h-0.5 origin-left bg-accent"
        />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-paper lg:hidden"
          >
            <div className="flex h-16 items-center justify-between px-6">
              <span className="flex items-center gap-2.5">
                <Mark className="size-7" />
                <span className="text-[15px] font-medium tracking-[-0.01em]">
                  {profile.fullName}
                </span>
              </span>
              <button
                onClick={() => setOpen(false)}
                className="grid min-h-11 min-w-11 place-items-center p-2 text-2xl leading-none text-muted"
                aria-label="Fechar menu"
              >
                ×
              </button>
            </div>

            <nav className="flex flex-1 flex-col justify-center gap-1 px-6">
              {sections.map((s, i) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.45 }}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    history.replaceState(null, "", `#${s.id}`);
                    document
                      .getElementById(s.id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="border-b hairline py-4 font-display text-[clamp(1.75rem,7vw,2.25rem)] leading-tight text-ink"
                >
                  {s.label}
                </motion.a>
              ))}
            </nav>

            <div className="border-t hairline px-6 py-6">
              <a href={`mailto:${profile.email}`} className="min-h-11 text-accent break-all">
                {profile.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
