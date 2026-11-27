// Validação de SEO do portfólio — roda com: node scripts/seo-check.mjs
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOMAIN = "https://0xviny.com.br/";
const files = {
  vite: join(root, "index.html"),
  built: join(root, "dist/index.html"),
};
const publicDir = join(root, "public");
const buildDir = join(root, "dist");

let fail = 0;
let warn = 0;
const ok = (m) => console.log(`  ok   ${m}`);
const bad = (m) => {
  fail++;
  console.log(`  FAIL ${m}`);
};
const wrn = (m) => {
  warn++;
  console.log(`  warn ${m}`);
};

const get = (html, re) => html.match(re)?.[1] ?? null;

console.log("\n== Head: título, description, canonical ==");
const expectedTitle = "Vinicius Gabriel — Desenvolvedor Full Stack React e Laravel";
const expectedDesc =
  "Portfólio de Vinicius Gabriel, desenvolvedor full stack com 3+ anos em React, TypeScript, Laravel e PostgreSQL. Conheça os projetos e entre em contato.";

for (const [name, path] of Object.entries(files)) {
  const html = readFileSync(path, "utf8");
  const title = get(html, /<title>([^<]*)<\/title>/);
  const desc = get(html, /<meta[^>]*name="description"[^>]*content="([^"]*)"/s);
  const canon = get(html, /<link rel="canonical" href="([^"]*)"/);

  if (title === expectedTitle) {
    if (title.length <= 60) ok(`${name}: title ${title.length}/60 chars`);
    else bad(`${name}: title ${title.length} > 60`);
  } else {
    bad(`${name}: title diferente do esperado → "${title}"`);
  }

  if (desc === expectedDesc) {
    if (desc.length >= 140 && desc.length <= 160) ok(`${name}: description ${desc.length}/160 chars`);
    else wrn(`${name}: description ${desc.length} chars (alvo 140–160)`);
  } else {
    bad(`${name}: description diferente → "${desc}"`);
  }

  if (canon === DOMAIN) ok(`${name}: canonical self-referencing`);
  else bad(`${name}: canonical → ${canon}`);

  if (!/name="robots" content="[^"]*noindex/.test(html)) ok(`${name}: sem noindex`);
  else bad(`${name}: contém noindex`);

  const lang = get(html, /<html[^>]*lang="([^"]*)"/);
  if (lang === "pt-BR") ok(`${name}: lang=pt-BR`);
  else bad(`${name}: lang=${lang}`);

  for (const tag of ["og:title", "og:description", "og:url", "og:image", "og:type", "og:locale"]) {
    if (html.includes(`property="${tag}"`)) ok(`${name}: ${tag}`);
    else bad(`${name}: falta ${tag}`);
  }

  // A imagem social precisa existir na raiz do domínio (nada de /build/)
  const ogImage = get(html, /property="og:image" content="([^"]*)"/);
  if (ogImage) {
    if (ogImage === `${DOMAIN}og.jpg`) ok(`${name}: og:image na raiz (${ogImage})`);
    else bad(`${name}: og:image errada → ${ogImage}`);
    const arquivo = ogImage.replace(DOMAIN, "");
    if (existsSync(join(buildDir, arquivo))) ok(`${name}: arquivo da og.image existe em dist/`);
    else bad(`${name}: arquivo da og.image NÃO existe em dist/ (${arquivo})`);
  }

  if (html.includes('name="twitter:card" content="summary_large_image"')) ok(`${name}: twitter:card`);
  else bad(`${name}: falta twitter:card`);

  const ldBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!ldBlocks.length) bad(`${name}: sem JSON-LD`);
  for (const [, raw] of ldBlocks) {
    try {
      const data = JSON.parse(raw);
      const flat = JSON.stringify(data);
      if (flat.includes("Person") && flat.includes("WebSite")) ok(`${name}: JSON-LD válido (Person + WebSite)`);
      else bad(`${name}: JSON-LD sem Person/WebSite`);
      if (!flat.includes("0xviny.com.br")) bad(`${name}: JSON-LD sem domínio`);
    } catch (e) {
      bad(`${name}: JSON-LD inválido → ${e.message}`);
    }
  }

  for (const tag of html.match(/<img[^>]*>/g) ?? []) {
    if (!/\balt=/.test(tag)) bad(`${name}: <img> sem alt → ${tag.slice(0, 70)}`);
  }
}

console.log("\n== Imagens e ícones servidos ==");
for (const f of ["favicon.ico", "sitemap.xml", "robots.txt"]) {
  const p = join(publicDir, f);
  if (existsSync(p)) ok(`${f} (${statSync(p).size} bytes)`);
  else bad(`${f} ausente`);
}

const mustBuild = [
  "og.jpg", "favicon.svg", "apple-touch-icon.png", "icon-192.png", "icon-512.png",
  "site.webmanifest", "404.html", "robots.txt", "sitemap.xml", "favicon.ico",
  "vinicius-gabriel-retrato.jpg", "vinicius-gabriel-retrato-400.jpg",
];
for (const f of mustBuild) {
  const p = join(buildDir, f);
  if (existsSync(p)) ok(`dist/${f} (${statSync(p).size} bytes)`);
  else bad(`dist/${f} ausente (não copiado pelo Vite)`);
}

console.log("\n== robots.txt / sitemap ==");
const robots = readFileSync(join(publicDir, "robots.txt"), "utf8");
if (robots.includes("Sitemap: https://0xviny.com.br/sitemap.xml")) ok("robots.txt aponta o sitemap");
else bad("robots.txt sem Sitemap");
if (/Disallow:\s*\//.test(robots)) bad("robots.txt bloqueia tudo");
else ok("robots.txt não bloqueia");

const sitemap = readFileSync(join(publicDir, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (locs.includes(DOMAIN)) ok(`sitemap: ${locs.join(", ")}`);
else bad("sitemap sem a home");
if (locs.every((l) => l.startsWith(DOMAIN))) ok("sitemap: URLs canônicas");
else bad("sitemap: URL fora do domínio");

console.log("\n== Fonte (alt, dimensões, links) ==");
const src = (p) => {
  try {
    return readFileSync(join(root, p), "utf8");
  } catch {
    return "";
  }
};

const about = src("src/components/About.tsx");
const header = src("src/components/Header.tsx");
const hero = src("src/components/Hero.tsx");
const footer = src("src/components/Footer.tsx");

for (const [name, code] of [["About", about], ["Header", header]]) {
  const imgs = [...code.matchAll(/<img[\s\S]*?\/>/g)].map((m) => m[0]);
  for (const tag of imgs) {
    if (!/alt=/.test(tag)) bad(`${name}: <img> sem alt`);
    if (!/width=/.test(tag) || !/height=/.test(tag)) bad(`${name}: <img> sem width/height (CLS)`);
    else ok(`${name}: <img> com alt + width/height`);
  }
}

const h1s = [...hero.matchAll(/<h1[\s\S]*?<\/h1>/g)];
if (h1s.length === 1) ok("Hero: exatamente um <h1>");
else bad(`Hero: ${h1s.length} <h1>`);

const allSrc = ["Header", "Footer", "Projects", "About", "Stacks", "Education", "Certificates", "Contact"]
  .map((c) => src(`src/components/${c}.tsx`))
  .join("\n");
const deadLinks = [...allSrc.matchAll(/href=["']#["']/g)].length;
if (deadLinks) wrn(`${deadLinks} link(s) href="#" na fonte`);
else ok("nenhum href=\"#\"");

const content = src("src/data/content.ts");
const fakeProjectLinks = [...content.matchAll(/href: ['#"]/g)].length;
if (fakeProjectLinks) wrn(`${fakeProjectLinks} projeto(s) com href '#' — falta a URL real`);
else ok("nenhum link falso em projetos");

const navAnchors =
  (header.match(/href=\{`#\$\{s\.id\}`\}/g) ?? []).length +
  (footer.match(/href=\{`#\$\{s\.id\}`\}/g) ?? []).length;
if (navAnchors >= 3) ok(`links internos rastreáveis: ${navAnchors} blocos de navegação (#seção)`);
else wrn(`apenas ${navAnchors} blocos de navegação`);

console.log(`\n${fail === 0 ? "SEO CHECK: PASS" : `SEO CHECK: ${fail} FALHA(S)`} (${warn} aviso(s))\n`);
process.exit(fail === 0 ? 0 : 1);
