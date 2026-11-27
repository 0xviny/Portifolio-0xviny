import { motion } from "motion/react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { projects } from "../data/content";

export default function Projects() {
  return (
    <section
      id="projetos"
      className="bg-aurora scroll-mt-20 border-t hairline py-24 md:py-32"
      aria-labelledby="projetos-title"
    >
      <div className="mx-auto w-full max-w-350 px-5 md:px-10">
        <span id="projetos-title" className="sr-only">
          Projetos
        </span>
        <SectionHeading index="03" title="Projetos" hint="seleção de trabalhos recentes" />

        <ul className="border-t hairline">
          {projects.map((project, i) => (
            <Reveal as="li" key={project.name} delay={i * 0.05}>
              <motion.a
                href={project.href}
                whileHover="hover"
                initial="rest"
                className="group relative block overflow-hidden border-b hairline"
              >
                <motion.span
                  aria-hidden="true"
                  variants={{ rest: { y: "100%" }, hover: { y: "0%" } }}
                  transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute inset-0 bg-moss/25"
                />
                <div className="relative flex flex-col gap-5 px-1 py-8 md:flex-row md:items-center md:gap-10 md:py-10">
                  <span className="label w-14 shrink-0 text-moss-bright">{project.year}</span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h3 className="text-3xl font-medium tracking-tight text-bone transition-transform duration-500 group-hover:translate-x-2 md:text-5xl">
                        {project.name}
                      </h3>
                      <span className="label">{project.kind}</span>
                    </div>
                    <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-ash">
                      {project.description}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className="border hairline px-2.5 py-1 font-mono text-xs tracking-[0.12em] text-ash uppercase md:text-[10px]"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <motion.span
                    aria-hidden="true"
                    variants={{
                      rest: { x: -8, opacity: 0.4 },
                      hover: { x: 0, opacity: 1 },
                    }}
                    transition={{ duration: 0.35 }}
                    className="hidden shrink-0 text-3xl text-moss-bright md:block"
                  >
                    ↗
                  </motion.span>
                </div>
              </motion.a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
