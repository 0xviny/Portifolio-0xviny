import { motion, useReducedMotion } from "motion/react";
import { profile } from "../data/content";

const lines = ["Desenvolvedor", "Full Stack"];
const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const reduced = useReducedMotion();

  // entrada única ao carregar; com movimento reduzido tudo já nasce no lugar
  const rise = (delay = 0) =>
    reduced
      ? { initial: false as const, animate: { yPercent: 0 } }
      : {
          initial: { yPercent: 112 },
          animate: { yPercent: 0 },
          transition: { duration: 1, delay, ease: EASE },
        };

  const fade = (delay = 0, y = 16) =>
    reduced
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.75, delay, ease: EASE },
        };

  return (
    <section
      id="top"
      className="flex min-h-[100svh] flex-col pt-24 pb-16 md:pt-28 md:pb-28"
      aria-label="Apresentação"
    >
      <div className="wrap flex flex-1 flex-col justify-between gap-12">
        <div>
          <motion.p
            {...fade(0.05, 10)}
            className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-muted"
          >
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-breathe rounded-full bg-accent" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              {profile.availability}
            </span>
            <span aria-hidden="true" className="hidden h-3 w-px bg-line sm:block" />
            <span>{profile.location}</span>
          </motion.p>

          <h1
            className="mt-7 text-[clamp(2.75rem,10vw,9rem)] leading-[0.94] tracking-[-0.035em] text-balance text-ink"
            aria-label={lines.join(" ")}
          >
            {lines.map((line, i) => (
              <span key={line} className="block overflow-hidden pt-[0.12em] -mt-[0.12em] pb-[0.03em]">
                <motion.span {...rise(0.12 + i * 0.09)} className="block" aria-hidden="true">
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-x-6">
            <motion.p
              {...fade(0.4)}
              className="max-w-[46ch] text-[17px] leading-[1.62] text-muted lg:col-span-5"
            >
              {profile.about.lead}
            </motion.p>

            <motion.ul
              {...fade(0.5, 12)}
              className="lg:col-span-5 lg:col-start-8"
              aria-label="O que eu faço"
            >
              {profile.services.map((service) => (
                <li
                  key={service}
                  className="flex items-center gap-3 border-t hairline py-3 text-[16px] text-ink last:border-b"
                >
                  <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-accent" />
                  {service}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>

        <motion.div
          {...fade(0.6, 12)}
          className="flex flex-col gap-5 border-t hairline pt-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-wrap items-center gap-4">
            <a href="#projetos" className="btn btn-primary">
              Ver projetos
            </a>
            <a href="#contato" className="btn btn-ghost">
              Entrar em contato
            </a>
          </div>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[15px] text-muted">
            <span>Respondo em até 24 horas úteis</span>
            <span aria-hidden="true" className="hidden h-3 w-px bg-line sm:block" />
            <a href={`mailto:${profile.email}`} className="btn-link text-ink break-all">
              {profile.email}
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
