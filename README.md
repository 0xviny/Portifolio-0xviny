# Portfólio — 0xviny.com.br

Portfólio **100% estático** (React + TypeScript + Tailwind via Vite), servido por **nginx dentro do
Docker** e publicado pelo **Traefik** da VPS. **Não existe backend próprio**: o formulário usa
[Web3Forms](https://web3forms.com) e o e-mail `contato@0xviny.com.br` é atendido pelo **servidor de
e-mail que já roda na VPS** (o do seu projeto `amandagdesigner`) — um servidor de e-mail por IP.

> Este repositório é a pasta do frontend inteira: `compose.yml`, `Dockerfile`, `nginx.conf`,
> `.github/` e `.env.example` moram aqui de propósito, para você subir **só esta pasta** e gerenciar
> tudo pela VPS com um único `docker compose up`.

Paleta: preto (`#050706`), verde jade (`#0D7A54` / `#17A06D` / `#34C88B`) e cinza claro (`#D8DBD9`).

## Estrutura

```
compose.yml          serviço site (labels do Traefik)
Dockerfile           build (node:22-slim) → nginx:alpine
nginx.conf           gzip, cache, headers de segurança, 404 com status 404
.github/workflows/   deploy.yml — push em main → SSH na VPS → docker compose up
scripts/seo-check.mjs  validação de SEO (roda local)
public/              robots.txt, sitemap.xml, favicon, og.jpg, retrato, 404.html
src/                 componentes React (src/data/content.ts é o conteúdo)
.env.example         a chave que o .env real precisa ter
```

## Requisitos

- Node 20+
- Docker + Docker Compose na VPS
- A rede externa `proxy` criada pelo Traefik (a mesma dos seus outros projetos)

## Rodando local

```bash
npm install
npm run dev          # http://127.0.0.1:5173

npm run build        # sai em dist/
npm run preview      # serve o dist em http://127.0.0.1:4173
npm run lint
node scripts/seo-check.mjs   # tem que terminar em SEO CHECK: PASS
```

## Formulário de contato (Web3Forms — sem backend)

1. Crie a conta em <https://web3forms.com> (login com GitHub) e um **Access Key**.
2. No formulário, defina o destino **contato@0xviny.com.br**.
3. Adicione o domínio `0xviny.com.br` no painel e conclua a verificação (registro TXT — ver Cloudflare).
4. Cole a chave no `.env` da raiz:

```bash
cp .env.example .env
# edite .env → VITE_WEB3FORMS_ACCESS_KEY=sua_chave
```

5. Redeploy (ou `npm run build` para testar local).

Enquanto a chave não existir, o botão avisa *"Formulário ainda não configurado"* em vez de quebrar.
O honeypot e o `connect-src https://api.web3forms.com` do CSP já estão prontos.

## Deploy (GitHub → VPS)

### 1. Git

```bash
git add .
git commit -m "site estático + docker"
git push origin main
```

### 2. Segredos do GitHub (Settings → Secrets and variables → Actions)

| Segredo | Valor |
|---|---|
| `VPS_HOST` | IP da VPS |
| `VPS_USER` | usuário SSH (ex.: `root`) |
| `VPS_SSH_KEY` | chave privada SSH inteira |
| `VPS_PORT` | `22` |

### 3. Na VPS — primeira vez

```bash
cd /opt/projects/0xviny

# limpa a tentativa anterior, que subia mail/certs/webmail junto
docker compose down 2>/dev/null || true
docker rm -f 0xviny-mail 0xviny-webmail 0xviny-mail-certs 2>/dev/null || true
docker volume rm 0xviny_mail-data 0xviny_mail-state 0xviny_mail-config \
  0xviny_mail-certs 0xviny_acme-home 0xviny_webmail-db 2>/dev/null || true
docker network rm 0xviny_backend 0xviny_outbound 2>/dev/null || true

cat > .env <<'EOF'
VITE_WEB3FORMS_ACCESS_KEY=COLE_AQUI_A_CHAVE
EOF

docker compose up -d --build     # só o site
docker compose ps                # 0xviny-site Started
```

A partir daí, **todo push em `main` deploya sozinho** (`.github/workflows/deploy.yml`).
O workflow já roda `docker compose up -d --build`, que agora sobe apenas o `site`.

### 4. Traefik

Se a VPS já serve os seus outros projetos, o Traefik e a rede `proxy` **já existem** — nada a fazer.
Só confirme que ele foi iniciado com `--providers.docker.network=proxy` e com o certresolver
`letsencrypt` (é o que os labels deste compose usam).

## Cloudflare — passo a passo

Você já adicionou a zona `0xviny.com.br`. Agora são só os registros:

**Painel → 0xviny.com.br → DNS → Records → Add record**, um por linha:

| # | Type | Name | Content | Proxy status |
|---|---|---|---|---|
| 1 | A | `@` | IP da VPS | **DNS only** (nuvem cinza) |
| 2 | CNAME | `www` | `0xviny.com.br` | **DNS only** |
| 3 | A | `mail` | IP da VPS | **DNS only** |
| 4 | MX | `@` | `mail.amandagdesigner.com.br` — **Priority 10** | sempre DNS only |
| 5 | TXT | `@` | `v=spf1 a mx -all` | sempre DNS only |
| 6 | TXT | `mail._domainkey` | `v=DKIM1; k=rsa; p=...` (comando no bloco E-mail) | sempre DNS only |
| 7 | TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:postmaster@0xviny.com.br` | sempre DNS only |
| 8 | TXT | `@` | verificação do domínio no **Web3Forms** (o painel mostra o valor) | sempre DNS only |

**Por que tudo "DNS only" (nuvem cinza):** o **Let's Encrypt do Traefik** valida o certificado
direto na VPS (TLS-ALPN/HTTP-01); com a nuvem laranja a validação passaria pela borda da Cloudflare
e pode falhar. Depois que o site estiver no ar com certificado, você *pode* ligar o proxy em `@` e
`www` — teste a renovação antes de deixar ligado.

## E-mail (`contato@0xviny.com.br`)

O servidor de e-mail da VPS é o do projeto `amandagdesigner` (`amandagdesigner-mail`,
docker-mailserver) — ele já publica **25/465/587/993** e agora atende também o domínio novo.
(Dois servidores de e-mail não dividem a mesma porta no mesmo IP.)

```bash
# 1) caixas do domínio novo
docker exec -it amandagdesigner-mail setup email add contato@0xviny.com.br
docker exec -it amandagdesigner-mail setup email add postmaster@0xviny.com.br

# 2) chave DKIM do domínio novo (o DMS exige uma chave por domínio)
docker exec -it amandagdesigner-mail setup config dkim domain 0xviny.com.br

# 3) pegar a chave pública → colar no TXT mail._domainkey do Cloudflare
docker exec amandagdesigner-mail cat /tmp/docker-mailserver/opendkim/keys/0xviny.com.br/mail.txt
```

- Webmail: <https://webmail.amandagdesigner.com.br> (login `contato@0xviny.com.br`).
- **Firewall da VPS**: as portas já estão abertas para o projeto antigo (`80, 443, 25, 465, 587, 993`).
- **rDNS/PTR** do IP: se já aponta para `mail.amandagdesigner.com.br`, está resolvido.
- O MX aponta para `mail.amandagdesigner.com.br` de propósito: é o nome no qual o certificado TLS
  daquele servidor é válido (o mesmo vale para envio por SMTP e leitura por IMAP).

## Segurança (no nginx)

- **Headers**: CSP (com `connect-src https://api.web3forms.com`), `X-Frame-Options DENY`, `nosniff`,
  Referrer-Policy, Permissions-Policy, HSTS.
- **404 real**: `try_files ... =404` + `error_page 404 /404.html` → sem soft-404 no Google.
- **Cache**: `index.html` sempre revalida; `/assets/*` (com hash) por 1 ano.
- **Honeypot** no formulário + anti-spam do próprio Web3Forms.

## Seções

Sobre mim · Stacks · Projetos · Carreira · Certificados · Contato · Footer

## Fundos (minimalista)

Só três pontos têm fundo desenhado — o resto fica liso sobre `#050706`:

| Seção | Fundo |
|---|---|
| Hero | bolhas interativas + vinheta + brilho que segue o cursor (`CursorGlow`, só aqui) |
| Projetos | aurora verde assimétrica (bem sutil) |
| Contato | brilho verde ascendente (bem sutil) |

## Foto e ícones

O original é `public/eu.png`; o build usa versões otimizadas:

| Arquivo | Uso | Tamanho |
|---|---|---|
| `vinicius-gabriel-retrato.jpg` / `-400.jpg` | seção Sobre (`srcset`, redonda) | 640×640 (45 KB) / 400×400 (18 KB) |
| `og.jpg` | Open Graph / Twitter | 1200×630 (52 KB) |
| `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`, `icon-192/512.png`, `site.webmanifest` | ícones | — |
| `404.html` | página de erro do nginx | — |

## SEO

- Head completo em **um único arquivo**: `index.html` (título 59 chars, description 151 chars,
  canonical autorreferente, Open Graph, Twitter Card, JSON-LD `WebSite` + `Person` com `sameAs`,
  `lang="pt-BR"`).
- `robots.txt` aponta `https://0xviny.com.br/sitemap.xml`; o sitemap lista só a home.
- Navegação em links reais (`<a href="#secao">`) para o Google rastrear as âncoras.
- Validar: `node scripts/seo-check.mjs` → `SEO CHECK: PASS`.
- Depois do primeiro deploy: **Google Search Console → adicionar domínio → enviar o sitemap**.

## Animações

| Onde | Biblioteca |
|---|---|
| Entrada do hero, reveals no scroll, linha da timeline | GSAP + ScrollTrigger |
| Stagger da grade de stacks | anime.js v4 |
| Menu mobile, hover dos projetos, estados do formulário, barra de progresso | Motion (motion.dev) |
| Fundo de bolhas **apenas no hero** | Canvas 2D próprio |

Todas respeitam `prefers-reduced-motion`.

## Conteúdo

Edite `src/data/content.ts` (nome, projetos, stacks, estudos, certificados, `socials`) e
`src/components/Hero.tsx` (nome no hero). Rode `npm run build` após alterações.
