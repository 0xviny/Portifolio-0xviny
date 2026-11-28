import SectionHeading from "./SectionHeading";
import { profile } from "../data/content";

export default function About() {
  const { about } = profile;

  return (
    <section id="sobre" className="scroll-mt-20 py-20 md:py-28" aria-labelledby="sobre-title">
      <div className="wrap">
        <span id="sobre-title" className="sr-only">
          Sobre mim
        </span>
        <SectionHeading title="Sobre mim" hint="quem está por trás do código" />

        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-x-6 lg:gap-y-12">
          <div className="lg:col-span-4">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-surface shadow-card">
              <img
                src={`${import.meta.env.BASE_URL}eu.png`}
                alt="Vinicius Gabriel, desenvolvedor full stack"
                width={1086}
                height={1448}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover object-[50%_34%]"
              />
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <p className="font-display text-[clamp(1.5rem,2.7vw,2.375rem)] leading-[1.24] tracking-[-0.02em] text-ink">
              {about.lead}
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              {about.body.map((para, i) => (
                <p key={i} className="text-[16px] leading-[1.68] text-muted">
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="panel mt-12 px-6 py-8 md:mt-14 md:px-8 md:py-9">
          <ul className="grid grid-cols-2 gap-y-8 md:grid-cols-4 md:gap-y-0">
            {about.stats.map((stat, i) => (
              <li
                key={stat.label}
                className={`md:px-6 md:first:pl-0 md:last:pr-0 ${
                  i > 0 ? "md:border-l md:hairline" : ""
                }`}
              >
                <span className="block text-[clamp(2rem,3vw,2.75rem)] leading-none tracking-[-0.03em] text-ink">
                  {stat.value}
                </span>
                <span className="mt-3 block text-[14px] text-muted">{stat.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
