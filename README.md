# Portfólio — 0xviny.com.br

Portfólio **100% estático** (React + TypeScript + Tailwind via Vite), servido por **nginx dentro do
Docker** e publicado pelo **Traefik** da VPS. **Não existe backend próprio**: o formulário usa
[Web3Forms](https://web3forms.com) e o e-mail `contato@0xviny.com.br` roda no **docker-mailserver** —
tudo declarado no **mesmo `compose.yml`**.

> Este repositório é a pasta do frontend inteira: `compose.yml`, `Dockerfile`, `nginx.conf`, `mail/`,
> `.github/` e `.env.example` moram aqui de propósito, para você subir **só esta pasta** e gerenciar
> tudo pela VPS com um único `docker compose up`.

Paleta: preto (`#050706`), verde jade (`#0D7A54` / `#17A06D` / `#34C88B`) e cinza claro (`#D8DBD9`).

## Estrutura

```
compose.yml          site + certs + mail + webmail (um compose só)
Dockerfile           build (node:22-slim) → nginx:alpine
nginx.conf           gzip, cache, headers de segurança, 404 com status 404
mail/user-patches.sh patch do docker-mailserver (TLS de saída)
.github/workflows/   deploy.yml — push em main → SSH na VPS → docker compose up
scripts/seo-check.mjs  validação de SEO (roda local)
public/              robots.txt, sitemap.xml, favicon, og.jpg, retrato, 404.html
src/                 componentes React (src/data/content.ts é o conteúdo)
.env.example         as duas chaves que o .env real precisa ter
```

## Requisitos

- Node 20+
- Docker + Docker Compose na VPS
- A rede externa `proxy` criada pelo Traefik (a mesma do seu outro projeto)

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
3. Adicione o domínio `0xviny.com.br` no painel e conclua a verificação (registro TXT — ver Cloudflare abaixo).
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
git init -b main
git add .
git commit -m "portfólio estático + docker"
git remote add origin git@github.com:SEU_USUARIO/0xviny.git
git push -u origin main
```

### 2. Segredos do GitHub (Settings → Secrets and variables → Actions)

| Segredo | Valor |
|---|---|
| `VPS_HOST` | IP da VPS |
| `VPS_USER` | usuário SSH (ex.: `root`) |
| `VPS_SSH_KEY` | chave privada SSH inteira |
| `VPS_PORT` | `22` |

### 3. Na VPS

```bash
mkdir -p /opt/projects && cd /opt/projects
git clone git@github.com:SEU_USUARIO/0xviny.git 0xviny
cd 0xviny

cat > .env <<'EOF'
VITE_WEB3FORMS_ACCESS_KEY=COLE_AQUI_A_CHAVE
CF_API_TOKEN=COLE_AQUI_O_TOKEN_DO_CLOUDFLARE
EOF

docker compose up -d --build     # sobe site + mail + webmail de uma vez
```

Depois disso, **todo push em `main` deploya sozinho** (`.github/workflows/deploy.yml`).

### 4. Traefik

Se a VPS já serve o seu outro projeto, o Traefik e a rede `proxy` **já existem** — nada a fazer.
Só confirme que o Traefik foi iniciado com `--providers.docker.network=proxy` e com o
certresolver `letsencrypt` (é o que os labels deste compose usam).

## Cloudflare — passo a passo

Você já adicionou a zona `0xviny.com.br`. Agora são só os registros:

**Painel → 0xviny.com.br → DNS → Records → Add record**, um por linha:

| # | Type | Name | IPv4 address / Content | Proxy status | TTL |
|---|---|---|---|---|---|
| 1 | A | `@` | IP da VPS | **DNS only** (nuvem cinza) | Auto |
| 2 | CNAME | `www` | `0xviny.com.br` | **DNS only** | Auto |
| 3 | A | `mail` | IP da VPS | **DNS only** | Auto |
| 4 | CNAME | `webmail` | `mail.0xviny.com.br` | **DNS only** | Auto |
| 5 | MX | `@` | `mail.0xviny.com.br` — **Priority 10** | (sempre DNS only) | Auto |
| 6 | TXT | `@` | `v=spf1 mx a:mail.0xviny.com.br -all` | (sempre DNS only) | Auto |
| 7 | TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:postmaster@0xviny.com.br` | (sempre DNS only) | Auto |
| 8 | TXT | `mail._domainkey` | `v=DKIM1; k=rsa; p=...` ← **depois** (ver E-mail) | (sempre DNS only) | Auto |
| 9 | TXT | `@` | valor de verificação do **Web3Forms** (o painel mostra) | (sempre DNS only) | Auto |

**Por que tudo "DNS only" (nuvem cinza):**
- A Cloudflare **não proxyia portas de e-mail** (25/465/587/993) — se `mail` ficar laranja, ninguém
  consegue entregar mensagem para você.
- O **Let's Encrypt do Traefik** valida o certificado direto na VPS (TLS-ALPN/HTTP-01). Com a nuvem
  laranja a validação passaria pela borda da Cloudflare e pode falhar.

Depois que o site estiver no ar com certificado, você *pode* ligar o proxy (nuvem laranja) em
`@` e `www` — mas teste a renovação do certificado antes de deixar ligado.

**Token da Cloudflare (para o certificado do e-mail):**
1. Avatar → **My Profile** → **API Tokens** → **Create Token**.
2. Template **Edit zone DNS** → Zone Resources: `0xviny.com.br` → Continue → **Create Token**.
3. Copie e cole no `.env` como `CF_API_TOKEN=`.

## E-mail (`contato@0xviny.com.br`)

```bash
cd /opt/projects/0xviny
docker compose up -d                 # certs emite o certificado de mail.0xviny.com.br (DNS-01)
docker compose ps                    # esperar "healthy" no 0xviny-mail-certs

# caixas de entrada
docker compose exec -it mail setup email add contato@0xviny.com.br
docker compose exec -it mail setup email add postmaster@0xviny.com.br

# chave pública do DKIM → cole no registro TXT mail._domainkey do Cloudflare
docker compose exec -it mail sh -c \
  'find /tmp/docker-mailserver -path "*opendkim*" -name "*.txt" -exec sh -c "echo --- {}; cat {}" \;'
```

- **Firewall da VPS**: `80, 443` (site) e `25, 465, 587, 993` (e-mail). A **porta 25 é obrigatória
  para receber** e alguns provedores bloqueiam de fábrica — libere no painel deles.
- **rDNS/PTR**: aponte o IP da VPS para `mail.0xviny.com.br` no painel do provedor (ajuda a não cair
  em spam).
- Webmail: <https://webmail.0xviny.com.br>

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
