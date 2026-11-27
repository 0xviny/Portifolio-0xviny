import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import SectionHeading from "./SectionHeading";
import { stackGroups } from "../data/content";

export default function Stacks() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let played = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !played) {
            played = true;
            animate("[data-chip]", {
              opacity: [0, 1],
              y: [26, 0],
              rotate: ["-4deg", "0deg"],
              scale: [0.92, 1],
              delay: stagger(38, { start: 100 }),
              duration: 700,
              ease: "outExpo",
            });
            animate("[data-group-title]", {
              opacity: [0, 1],
              x: [-18, 0],
              delay: stagger(140),
              duration: 600,
              ease: "outQuad",
            });
          }
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="stacks"
      className="scroll-mt-20 border-t hairline py-24 md:py-32"
      aria-labelledby="stacks-title"
    >
      <div className="mx-auto w-full max-w-350 px-5 md:px-10">
        <span id="stacks-title" className="sr-only">
          Stacks
        </span>
        <SectionHeading index="02" title="Stacks" hint="ferramentas que uso todo dia" />

        <div ref={root} className="grid gap-14 md:grid-cols-3 md:gap-10">
          {stackGroups.map((group) => (
            <div
              key={group.title}
              className="border-t hairline pt-6 md:border-t-0 md:border-l md:pt-0 md:pl-8 md:first:border-l-0 md:first:pl-0"
            >
              <h3 data-group-title className="label mb-6 text-moss-bright">
                {group.title}
              </h3>
              <ul className="flex flex-wrap gap-2 md:flex-col md:gap-0">
                {group.items.map((item) => (
                  <li
                    key={item}
                    data-chip
                    className="group flex items-center justify-between gap-4 border hairline px-4 py-3 text-sm text-bone transition-colors hover:border-moss-mid hover:bg-moss/20 md:border-x-0 md:border-t-0 md:border-b md:last:border-b-0"
                  >
                    <span>{item}</span>
                    <span
                      aria-hidden="true"
                      className="size-1.5 rounded-full bg-line transition-colors group-hover:bg-moss-bright"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
