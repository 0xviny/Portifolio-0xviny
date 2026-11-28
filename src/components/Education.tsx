import SectionHeading from "./SectionHeading";
import { education } from "../data/content";

export default function Education() {
  return (
    <section id="carreira" className="scroll-mt-20 py-20 md:py-28" aria-labelledby="carreira-title">
      <div className="wrap">
        <span id="carreira-title" className="sr-only">
          Carreira de estudos
        </span>
        <SectionHeading title="Carreira" hint="trajetória de estudos" />

        <ol>
          {education.map((item, i) => (
            <li key={item.title} className="grid gap-2 md:grid-cols-[10rem_1fr] md:gap-8">
              <span className="font-mono text-[13px] leading-6 text-faint">{item.period}</span>
              <div
                className={`relative md:border-l md:hairline md:pl-8 ${
                  i < education.length - 1 ? "pb-10 md:pb-12" : "pb-0"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 left-0 hidden size-2.5 -translate-x-1/2 rounded-full bg-accent md:block"
                />
                <h3 className="text-[clamp(1.25rem,2vw,1.75rem)] leading-tight text-ink">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[14px] text-muted">
                  {item.place}, {item.status.toLowerCase()}
                </p>
                <p className="mt-2.5 max-w-[58ch] text-[16px] leading-[1.65] text-muted">
                  {item.notes}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
