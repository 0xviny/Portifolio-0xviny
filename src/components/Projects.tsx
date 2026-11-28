import SectionHeading from "./SectionHeading";
import { projects } from "../data/content";

export default function Projects() {
  return (
    <section
      id="projetos"
      className="relative scroll-mt-20 bg-navy py-20 text-paper md:py-28"
      aria-labelledby="projetos-title"
    >
      {/* a faixa entra e sai do azul em vez de começar em uma borda dura */}
      <div
        aria-hidden="true"
        className="fade-to-navy pointer-events-none absolute inset-x-0 -top-20 h-20 md:-top-28 md:h-28"
      />
      <div
        aria-hidden="true"
        className="fade-from-navy pointer-events-none absolute inset-x-0 -bottom-20 h-20 md:-bottom-28 md:h-28"
      />

      <div className="wrap">
        <span id="projetos-title" className="sr-only">
          Projetos
        </span>
        <SectionHeading tone="deep" title="Projetos" hint="seleção de trabalhos recentes" />

        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li key={project.name} className="h-full">
              <a href={project.href} className="card group h-full p-6 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-[13px] text-faint">{project.year}</span>
                  <span
                    aria-hidden="true"
                    className="text-xl leading-none text-faint transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-accent"
                  >
                    ↗
                  </span>
                </div>

                <h3 className="mt-6 text-[1.625rem] leading-[1.15] text-ink">{project.name}</h3>
                <p className="mt-2 text-[15px] text-muted">{project.kind}</p>
                <p className="mt-4 text-[15px] leading-[1.6] text-muted">{project.description}</p>

                <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                  {project.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border hairline px-3 py-1 text-[13px] text-muted"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
