import { profile, sections } from "../data/content";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="on-night bg-night text-night-ink">
      <div className="wrap border-t border-night-line pt-12 pb-10">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between md:gap-8">
          <div className="space-y-3">
            <p className="text-[16px] font-medium text-night-ink">{profile.fullName}</p>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-11 items-center text-[clamp(1.125rem,1.6vw,1.375rem)] text-night-ink underline decoration-night-muted decoration-1 underline-offset-[6px] transition-colors hover:decoration-night-ink break-all"
            >
              {profile.email}
            </a>
            <p className="text-[15px] text-night-muted">{profile.location}</p>
          </div>

          <nav aria-label="Rodapé" className="flex flex-wrap gap-x-6 gap-y-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="nav-link inline-flex min-h-11 items-center px-3 text-[15px] text-night-muted transition-colors hover:text-night-ink"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-night-line pt-6 text-[13px] text-night-muted md:flex-row md:items-center md:justify-between">
          <span>
            © {year} {profile.fullName}. Todos os direitos reservados.
          </span>
          <span>PHP, Laravel, React e PostgreSQL</span>
        </div>
      </div>
    </footer>
  );
}
