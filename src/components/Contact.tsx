import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { profile, socials } from "../data/content";

type Status = "idle" | "sending" | "ok" | "error";

const fields = [
  { name: "name", label: "Nome", type: "text", placeholder: "Como devo te chamar" },
  { name: "email", label: "E-mail", type: "email", placeholder: "voce@empresa.com" },
  { name: "subject", label: "Assunto", type: "text", placeholder: "Projeto, vaga ou parceria" },
] as const;

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setError("");

    try {
      // Sem backend: o Web3Forms recebe no front e entrega em contato@0xviny.com.br
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      if (!accessKey) {
        throw new Error("Formulário ainda não configurado (falta a chave do Web3Forms).");
      }

      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...data,
          access_key: accessKey,
          subject: `Portfólio — ${data.subject}`,
          from_name: "Portfólio 0xviny.com.br",
          honeypot: "",
        }),
      });

      const body = await res.json().catch(() => ({}) as Record<string, unknown>);
      if (!res.ok || body.success === false) {
        throw new Error(
          typeof body.message === "string" && body.message
            ? body.message
            : "Não foi possível enviar agora. Tente de novo em instantes.",
        );
      }

      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Falha de conexão.");
    }
  }

  return (
    <section
      id="contato"
      className="on-night scroll-mt-20 bg-night pt-20 pb-16 text-night-ink md:pt-28 md:pb-20"
      aria-labelledby="contato-title"
    >
      <div className="wrap">
        <div className="mb-10 md:mb-14">
          <span className="tick" aria-hidden="true" />
          <div className="mt-5 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-10">
            <h2 id="contato-title" className="text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05]">
              Contato
            </h2>
            <p className="text-[15px] text-night-muted md:text-right">
              resposta em até 24h úteis
            </p>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-5">
            <p className="font-display text-[clamp(1.625rem,2.7vw,2.375rem)] leading-[1.24] tracking-[-0.01em] text-night-ink">
              Tem um projeto, uma vaga ou só uma dúvida difícil? Escreve aí.
            </p>

            <a
              href={`mailto:${profile.email}`}
              className="mt-9 inline-flex min-h-11 items-center text-[clamp(1.125rem,1.6vw,1.375rem)] text-night-ink underline decoration-night-muted decoration-1 underline-offset-[6px] transition-colors hover:decoration-night-ink break-all"
            >
              {profile.email}
            </a>
            <p className="mt-3 text-[15px] text-night-muted">{profile.location}</p>

            {socials.some((s) => s.href) && (
              <ul className="mt-8 flex flex-wrap gap-3">
                {socials
                  .filter((s) => s.href)
                  .map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="me noreferrer noopener"
                        className="inline-flex min-h-11 items-center rounded-lg border border-night-line px-4 text-[14px] text-night-muted transition-colors hover:border-night-muted hover:text-night-ink"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
              </ul>
            )}

            <p className="mt-8 max-w-sm text-[15px] leading-[1.65] text-night-muted">
              Mensagens passam por proteção anti-spam e chegam direto no meu e-mail, sem cadastro,
              sem newsletter e sem repasse para terceiros.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate={false} className="space-y-5 lg:col-span-6 lg:col-start-7">
            {/* honeypot — invisível para humanos, ignorado pelo Web3Forms */}
            <input
              type="text"
              name="honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-px w-px opacity-0"
            />

            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map((field, i) => (
                <div key={field.name} className={i === 2 ? "sm:col-span-2" : ""}>
                  <label htmlFor={field.name} className="mb-2 block text-[14px] text-night-muted">
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    required
                    minLength={2}
                    maxLength={field.name === "email" ? 190 : 120}
                    placeholder={field.placeholder}
                    disabled={status === "sending"}
                    className="w-full rounded-lg bg-night-surface px-4 py-3.5 text-[16px] text-night-ink transition-shadow placeholder:text-night-muted/70 focus:outline-none focus:ring-2 focus:ring-night-ink/60 disabled:opacity-50"
                  />
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-[14px] text-night-muted">
                Mensagem
              </label>
              <textarea
                id="message"
                name="message"
                required
                minLength={10}
                maxLength={4000}
                rows={5}
                disabled={status === "sending"}
                placeholder="Conta um pouco sobre o que você precisa"
                className="w-full resize-y rounded-lg bg-night-surface px-4 py-3.5 text-[16px] text-night-ink transition-shadow placeholder:text-night-muted/70 focus:outline-none focus:ring-2 focus:ring-night-ink/60 disabled:opacity-50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-1">
              <button type="submit" disabled={status === "sending" || status === "ok"} className="btn btn-primary">
                {status === "sending"
                  ? "Enviando…"
                  : status === "ok"
                    ? "Enviado ✓"
                    : "Enviar mensagem"}
              </button>

              <AnimatePresence mode="wait">
                {status === "ok" && (
                  <motion.p
                    key="ok"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    role="status"
                    className="text-[14px] text-night-ink"
                  >
                    Mensagem recebida. Em breve retorno.
                  </motion.p>
                )}
                {status === "error" && (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    role="alert"
                    className="max-w-xs text-[14px] text-alarm"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
