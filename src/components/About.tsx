import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { profile } from "../data/content";

export default function About() {
  const { about, fullName, role } = profile;

  return (
    <section id="sobre" className="scroll-mt-20 py-24 md:py-32" aria-labelledby="sobre-title">
      <div className="mx-auto w-full max-w-350 px-5 md:px-10">
        <span id="sobre-title" className="sr-only">
          Sobre mim
        </span>
        <SectionHeading index="01" title="Sobre mim" hint="quem está por trás do código" />

        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div className="space-y-6">
            <Reveal>
              <p className="text-balance text-2xl leading-snug font-medium tracking-tight text-bone md:text-4xl">
                {about.lead}
              </p>
            </Reveal>
            {about.body.map((para, i) => (
              <Reveal key={i} delay={0.08 * (i + 1)}>
                <p className="max-w-[62ch] leading-relaxed text-ash">{para}</p>
              </Reveal>
            ))}
            <Reveal delay={0.25}>
              <p className="font-mono text-xs tracking-[0.14em] text-moss-bright uppercase">
                {fullName} · {role}
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="border-t hairline lg:border-t-0 lg:border-l lg:pl-12">
            <div className="mb-10 w-full max-w-76">
              <img
                src={`${import.meta.env.BASE_URL}vinicius-gabriel-retrato.jpg`}
                srcSet={`${import.meta.env.BASE_URL}vinicius-gabriel-retrato-400.jpg 400w, ${import.meta.env.BASE_URL}vinicius-gabriel-retrato.jpg 640w`}
                sizes="(min-width: 1024px) 304px, calc(100vw - 40px)"
                alt="Retrato de Vinicius Gabriel, desenvolvedor full stack"
                width={640}
                height={640}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full rounded-full border hairline object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
              />
            </div>
            <dl className="grid grid-cols-2 gap-px overflow-hidden bg-line/60">
              {about.stats.map((stat) => (
                <div key={stat.label} className="bg-void px-4 py-8 md:px-6">
                  <dt className="label mb-3">{stat.label}</dt>
                  <dd className="text-4xl font-semibold tracking-tight text-bone md:text-5xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ash">
              Números de quem prefere sistemas pequenos que funcionam a sistemas gigantes que
              quebram às terças-feiras.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
