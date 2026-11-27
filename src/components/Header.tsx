import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sections, profile } from "../data/content";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
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

  const go = (id: string) => {
    setOpen(false);
    history.replaceState(null, "", `#${id}`);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b hairline bg-void/70 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-350 items-center justify-between px-5 md:px-10">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex min-h-11 min-w-11 items-center gap-3"
            aria-label="Voltar ao topo"
          >
            <span className="grid size-9 place-items-center border hairline font-mono text-sm text-moss-bright transition-colors group-hover:bg-moss">
              V
            </span>
            <span className="hidden font-mono text-xs tracking-[0.2em] text-ash uppercase sm:block">
              {profile.fullName}
            </span>
          </button>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Seções">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`relative inline-flex min-h-11 items-center px-3 py-2 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors ${
                  active === s.id ? "text-bone" : "text-ash hover:text-bone"
                }`}
              >
                {active === s.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 border border-moss-mid/60 bg-moss/30"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {s.label}
              </a>
            ))}
            <a
              href={`mailto:${profile.email}`}
              className="ml-3 inline-flex min-h-11 items-center border border-moss-mid px-4 py-2 font-mono text-[11px] tracking-[0.14em] text-moss-bright uppercase transition-colors hover:bg-moss hover:text-bone"
            >
              Fale comigo
            </a>
          </nav>

          <button
            onClick={() => setOpen(true)}
            className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 p-2 lg:hidden"
            aria-label="Abrir menu"
            aria-expanded={open}
          >
            <span className="block h-px w-6 bg-bone" />
            <span className="block h-px w-6 bg-bone" />
            <span className="block h-px w-4 self-end bg-moss-bright" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-50 flex flex-col bg-void lg:hidden"
          >
            <div className="flex h-16 items-center justify-between border-b hairline px-5">
              <span className="label">Menu</span>
              <button
                onClick={() => setOpen(false)}
                className="grid min-h-11 min-w-11 place-items-center p-2 text-2xl leading-none"
                aria-label="Fechar menu"
              >
                ×
              </button>
            </div>
            <nav className="flex flex-1 flex-col justify-center gap-1 px-5">
              {sections.map((s, i) => (
                <motion.a
                  key={s.id}
                  href={`#${s.id}`}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.45 }}
                  onClick={(e) => {
                    e.preventDefault();
                    go(s.id);
                  }}
                  className="flex items-baseline gap-4 border-b hairline py-4 text-left"
                >
                  <span className="label text-moss-bright">{s.index}</span>
                  <span className="text-3xl font-medium tracking-tight">{s.label}</span>
                </motion.a>
              ))}
            </nav>
            <div className="border-t hairline px-5 py-6">
              <a
                href={`mailto:${profile.email}`}
                className="label inline-flex min-h-11 items-center text-moss-bright"
              >
                {profile.email}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
