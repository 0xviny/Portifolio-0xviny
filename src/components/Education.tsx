import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "./SectionHeading";
import { education } from "../data/content";

gsap.registerPlugin(ScrollTrigger);

export default function Education() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-line]",
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: "[data-timeline]",
            start: "top 75%",
            end: "bottom 65%",
            scrub: 0.6,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>("[data-entry]").forEach((entry) => {
        gsap.fromTo(
          entry,
          { opacity: 0, x: -28 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: entry, start: "top 85%", once: true },
          },
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="carreira"
      className="scroll-mt-20 border-t hairline py-24 md:py-32"
      aria-labelledby="carreira-title"
    >
      <div className="mx-auto w-full max-w-350 px-5 md:px-10">
        <span id="carreira-title" className="sr-only">
          Carreira de estudos
        </span>
        <SectionHeading index="04" title="Carreira" hint="trajetória de estudos" />

        <div ref={root} data-timeline className="relative pl-6 md:pl-10">
          <div
            data-line
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-0 w-px bg-linear-to-b from-moss-bright via-moss-mid to-transparent md:left-1"
          />
          <ol className="space-y-12 md:space-y-16">
            {education.map((item) => (
              <li key={item.title} data-entry className="relative">
                <span
                  aria-hidden="true"
                  className="absolute top-2 -left-6 size-2.5 rounded-full border border-moss-bright bg-void md:-left-10"
                />
                <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-8">
                  <span className="label w-44 shrink-0 text-moss-bright">{item.period}</span>
                  <div>
                    <h3 className="text-2xl font-medium tracking-tight text-bone md:text-3xl">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-ash">
                      {item.place} · {item.status}
                    </p>
                    <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-ash/90">
                      {item.notes}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
