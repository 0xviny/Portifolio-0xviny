import SectionHeading from "./SectionHeading";
import { certificates } from "../data/content";

export default function Certificates() {
  return (
    <section
      id="certificados"
      className="scroll-mt-20 py-20 md:py-28"
      aria-labelledby="certificados-title"
    >
      <div className="wrap">
        <span id="certificados-title" className="sr-only">
          Certificados
        </span>
        <SectionHeading title="Certificados" hint="provas de estudo contínuo" />

        <ul className="grid gap-x-10 sm:grid-cols-2">
          {certificates.map((cert) => (
            <li
              key={cert.name}
              className="flex items-baseline justify-between gap-6 border-t hairline py-4"
            >
              <div className="min-w-0">
                <p className="text-[16px] leading-snug text-ink">{cert.name}</p>
                <p className="mt-1 text-[14px] text-muted">{cert.issuer}</p>
              </div>
              <span className="shrink-0 font-mono text-[13px] text-faint">{cert.year}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
