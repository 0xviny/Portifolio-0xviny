import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { profile } from "../data/content";

type Status = "idle" | "sending" | "ok" | "error";

const fields = [
  { name: "name", label: "Nome", type: "text", placeholder: "Como devo te chamar" },
  { name: "email", label: "E-mail", type: "email", placeholder: "voce@empresa.com" },
  { name: "subject", label: "Assunto", type: "text", placeholder: "Projeto, vaga, parceria…" },
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
      className="bg-ember scroll-mt-20 border-t hairline py-24 md:py-32"
      aria-labelledby="contato-title"
    >
      <div className="mx-auto w-full max-w-350 px-5 md:px-10">
        <span id="contato-title" className="sr-only">
          Contato
        </span>
        <SectionHeading index="06" title="Contato" hint="resposta em até 24h úteis" />

        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal className="space-y-8">
            <p className="text-balance text-2xl leading-snug font-medium tracking-tight md:text-3xl">
              Tem um projeto, uma vaga ou só uma dúvida difícil? Escreve aí.
            </p>
            <div className="space-y-4">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex min-h-11 items-center font-mono text-sm text-moss-bright underline decoration-moss-mid underline-offset-4 transition-colors hover:text-bone break-all"
              >
                {profile.email}
              </a>
              <p className="label">{profile.location}</p>
            </div>
            <div className="border-t hairline pt-6">
              <p className="max-w-sm text-sm leading-relaxed text-ash">
                Mensagens passam por proteção anti-spam e chegam direto em contato@0xviny.com.br —
                sem cadastro, sem newsletter e sem repasse para terceiros.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} noValidate={false} className="space-y-6">
              {/* honeypot — invisible to humans, ignored by the Web3Forms */}
              <input
                type="text"
                name="honeypot"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute left-[-9999px] h-px w-px opacity-0"
              />

              <div className="grid gap-6 sm:grid-cols-2">
                {fields.map((field, i) => (
                  <div key={field.name} className={i === 2 ? "sm:col-span-2" : ""}>
                    <label htmlFor={field.name} className="label mb-2 block">
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
                      className="w-full border-b hairline bg-transparent py-3 text-bone placeholder:text-ash/50 transition-colors focus:border-moss-bright focus:outline-none disabled:opacity-50"
                    />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="label mb-2 block">
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
                    placeholder="Conta um pouco sobre o que você precisa…"
                    className="w-full resize-y border-b hairline bg-transparent py-3 text-bone placeholder:text-ash/50 transition-colors focus:border-moss-bright focus:outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-5">
                <button
                  type="submit"
                  disabled={status === "sending" || status === "ok"}
                  className="border border-moss-mid bg-moss/40 px-8 py-3.5 font-mono text-xs tracking-[0.16em] text-bone uppercase transition-all hover:bg-moss disabled:cursor-not-allowed disabled:opacity-50 md:text-[11px]"
                >
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
                      className="font-mono text-xs tracking-[0.12em] text-moss-bright uppercase md:text-[11px]"
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
                      className="max-w-xs font-mono text-xs tracking-[0.12em] text-red-400 uppercase md:text-[11px]"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
