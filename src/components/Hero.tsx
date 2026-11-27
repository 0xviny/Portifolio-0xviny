import { useEffect, useRef } from "react";
import gsap from "gsap";
import BubbleField from "./BubbleField";
import CursorGlow from "./CursorGlow";
import { profile } from "../data/content";

const lines = ["Full", "Stack", "Developer"];

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        "[data-hero-line]",
        { yPercent: 115, rotate: 4 },
        { yPercent: 0, rotate: 0, duration: 1.1, stagger: 0.09 },
      )
        .fromTo(
          "[data-hero-meta]",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
          "-=0.55",
        )
        .fromTo(
          "[data-hero-rule]",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, transformOrigin: "left center" },
          "-=0.6",
        );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-svh flex-col justify-end pt-28 pb-10"
      aria-label="Apresentação"
    >
      <CursorGlow />
      <BubbleField />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_50%_120%,rgba(5,7,6,0)_40%,rgba(5,7,6,0.85)_100%)]"
      />
      <div className="relative mx-auto w-full max-w-350 px-5 md:px-10">
        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2" data-hero-meta>
          <span className="flex items-center gap-2 font-mono text-xs tracking-[0.16em] text-moss-bright uppercase md:text-[11px]">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-moss-bright opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-moss-bright" />
            </span>
            {profile.availability}
          </span>
          <span className="label">{profile.location}</span>
        </div>

        <h1
          className="text-[clamp(3.4rem,15vw,13rem)] leading-[0.82] font-semibold tracking-[-0.04em] text-bone"
          aria-label={lines.join(" ")}
        >
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span
                data-hero-line
                className={`block ${i === 1 ? "text-moss-bright/90 italic" : ""}`}
                aria-hidden="true"
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div
          data-hero-rule
          className="mt-8 h-px w-full bg-linear-to-r from-moss-mid via-line to-transparent"
        />

        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p
            data-hero-meta
            className="max-w-md text-balance text-sm leading-relaxed text-ash md:text-base"
          >
            {profile.about.lead}
          </p>
          <div data-hero-meta className="flex items-center gap-4">
            <a
              href="#projetos"
              className="inline-flex min-h-11 items-center border border-moss-mid bg-moss/40 px-6 py-3 font-mono text-xs tracking-[0.16em] text-bone uppercase transition-all hover:bg-moss md:text-[11px]"
            >
              Ver projetos
            </a>
            <a
              href="#contato"
              className="inline-flex min-h-11 items-center px-2 py-3 font-mono text-xs tracking-[0.16em] text-ash uppercase underline decoration-moss-mid underline-offset-4 transition-colors hover:text-bone md:text-[11px]"
            >
              Entrar em contato
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
