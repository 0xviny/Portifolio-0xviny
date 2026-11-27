import { profile, sections, socials } from "../data/content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t hairline pt-16 pb-10">
      <div className="mx-auto w-full max-w-350 px-5 md:px-10">
        <p
          aria-hidden="true"
          className="select-none text-center text-[clamp(3rem,14vw,12rem)] leading-none font-semibold tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(52,200,139,0.45)]"
        >
          {profile.fullName.split(" ")[0]}
        </p>

        <div className="mt-12 flex flex-col gap-10 border-t hairline pt-8 md:flex-row md:justify-between">
          <div className="space-y-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-11 items-center text-xl font-medium text-bone transition-colors hover:text-moss-bright break-all"
            >
              {profile.email}
            </a>
            <p className="label">{profile.location}</p>
          </div>

          <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="label inline-flex min-h-11 items-center transition-colors hover:text-bone"
              >
                {s.label}
              </a>
            ))}
          </nav>

          {socials.some((s) => s.href) && (
            <ul className="flex gap-4">
              {socials
                .filter((s) => s.href)
                .map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="me noreferrer noopener"
                      className="inline-flex min-h-11 items-center border hairline px-3 py-2 font-mono text-xs tracking-[0.14em] text-ash uppercase transition-colors hover:border-moss-mid hover:text-moss-bright md:text-[11px]"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t hairline pt-6 font-mono text-xs tracking-[0.14em] text-ash uppercase md:flex-row md:items-center md:justify-between md:text-[10px]">
          <span>
            © {year} {profile.fullName}. Todos os direitos reservados.
          </span>
          <span className="text-moss-bright">PHP · Laravel · React · PostgreSQL</span>
        </div>
      </div>
    </footer>
  );
}
