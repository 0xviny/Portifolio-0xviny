import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { certificates } from "../data/content";

export default function Certificates() {
  return (
    <section
      id="certificados"
      className="scroll-mt-20 border-t hairline py-24 md:py-32"
      aria-labelledby="certificados-title"
    >
      <div className="mx-auto w-full max-w-350 px-5 md:px-10">
        <span id="certificados-title" className="sr-only">
          Certificados
        </span>
        <SectionHeading index="05" title="Certificados" hint="provas de estudo contínuo" />

        <ul className="grid gap-px overflow-hidden bg-line/60 sm:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert, i) => (
            <Reveal as="li" key={cert.name} delay={(i % 3) * 0.06}>
              <article className="group flex h-full flex-col justify-between gap-8 bg-void p-6 transition-colors hover:bg-card md:p-8">
                <div className="flex items-start justify-between gap-4">
                  <span className="label text-moss-bright">{cert.year}</span>
                  <span
                    aria-hidden="true"
                    className="grid size-9 place-items-center border hairline text-sm text-ash transition-all group-hover:border-moss-mid group-hover:text-moss-bright"
                  >
                    ✓
                  </span>
                </div>
                <div>
                  <h3 className="text-lg leading-snug font-medium text-bone">{cert.name}</h3>
                  <p className="mt-2 font-mono text-xs tracking-[0.12em] text-ash uppercase md:text-[11px]">
                    {cert.issuer}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
