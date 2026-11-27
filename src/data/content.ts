export const profile = {
  name: "Vinicius",
  fullName: "Vinicius Gabriel",
  role: "Full Stack Developer",
  location: "Brasil · Remoto",
  email: "contato@0xviny.com.br",
  availability: "Disponível para projetos",
  about: {
    lead: "Construo sistemas que começam num banco de dados bem modelado e terminam numa interface que as pessoas não esquecem.",
    body: [
      "Há mais de 3 anos trabalho na fronteira entre back-end e front-end: APIs em Laravel que aguentam carga, consultas em PostgreSQL pensadas para o problema real e aplicações React que resolvem em vez de enfeitar.",
      "Gosto de código legível, de perguntar o porquê antes de implementar e de entregar menos coisas, mas afiadas. Fora do editor: automação de tarefas chatas, tipografia e jogos retrô.",
    ],
    stats: [
      { value: "3+", label: "anos de código" },
      { value: "10+", label: "projetos entregues" },
      { value: "12+", label: "sistemas em produção" },
      { value: "99.9%", label: "uptime médio" },
    ],
  },
};

export const socials = [
  { label: "GitHub", href: "https://github.com/0xviny" },
  { label: "LinkedIn", href: "" },
  { label: "Instagram", href: "https://www.instagram.com/0xviny" },
] as const;

export const sections = [
  { id: "sobre", index: "01", label: "Sobre mim" },
  { id: "stacks", index: "02", label: "Stacks" },
  { id: "projetos", index: "03", label: "Projetos" },
  { id: "carreira", index: "04", label: "Carreira" },
  { id: "certificados", index: "05", label: "Certificados" },
  { id: "contato", index: "06", label: "Contato" },
] as const;

export const stackGroups = [
  {
    title: "Back-end",
    items: ["PHP 8", "Laravel", "PostgreSQL", "MySQL", "Redis", "REST APIs"],
  },
  {
    title: "Front-end",
    items: ["React", "TypeScript", "Tailwind CSS", "Vite", "GSAP", "Motion"],
  },
  {
    title: "Ferramentas",
    items: ["Git", "Docker", "Linux", "Nginx", "CI/CD", "Figma"],
  },
] as const;

export const projects = [
  {
    year: "2026",
    name: "Nimbus Fleet",
    kind: "SaaS logística",
    description:
      "Painel de gestão de frota com telemetria em tempo real, motoristas e rotas otimizadas. API em Laravel com filas Redis e front React.",
    stack: ["Laravel", "PostgreSQL", "React", "Redis"],
    href: "#",
  },
  {
    year: "2025",
    name: "Raiz Analytics",
    kind: "Dashboard financeiro",
    description:
      "Consolidação de recebíveis de pequenos negócios com relatórios exportáveis e alertas por e-mail.",
    stack: ["PHP", "PostgreSQL", "TypeScript", "Charts"],
    href: "#",
  },
  {
    year: "2025",
    name: "Estúdio Órbita",
    kind: "Site institucional",
    description:
      "Site de estúdio de design com animações coordenadas em GSAP e CMS em Laravel para o time atualizar conteúdo.",
    stack: ["Laravel", "GSAP", "Tailwind"],
    href: "#",
  },
  {
    year: "2024",
    name: "Cacto Tasks",
    kind: "Productividade",
    description:
      "Gerenciador de tarefas offline-first com sync em background e atalhos de teclado em tudo.",
    stack: ["React", "IndexedDB", "TypeScript"],
    href: "#",
  },
] as const;

export const education = [
  {
    period: "2026 — 2030",
    title: "Bacharelado em Engenharia de Software",
    place: "Ensino Superior",
    status: "Em andamento",
    notes:
      "Foco em algoritmos, estruturas de dados, sistemas distribuídos e engenharia de software.",
  },
  {
    period: "2026",
    title: "Formação especializada em PHP e Laravel",
    place: "Formação Continuada",
    status: "Concluído",
    notes:
      "Aprofundamento em tecnologias web modernas e práticas de desenvolvimento utilizando PHP e Laravel.",
  },
  {
    period: "2024 — 2026",
    title: "Análise e Desenvolvimento de Sistemas",
    place: "Ensino Médio + Formação Técnica",
    status: "Concluído",
    notes:
      "TCC sobre desenvolvimento de um aplicativo de gestão de advertências e organização de equipamentos da sala de informática da escola.",
  },
  {
    period: "2023 — 2024",
    title: "Especialização em Full Stack Development",
    place: "Formação intensiva",
    status: "Concluído",
    notes: "Filas, cache, testes automatizados e modelagem relacional avançada.",
  },
  {
    period: "2022 — 2023",
    title: "Fundamentos de Front-end",
    place: "Autodidata + cursos online",
    status: "Concluído",
    notes: "HTML semântico, CSS de layout, JavaScript moderno e React.",
  },
] as const;

export const certificates = [
  { name: "Curso de PHP Moderno", issuer: "Curso em Video", year: "2026" },
  { name: "Fundamentos do PHP", issuer: "Rocketseat", year: "2026" },
  { name: "Laravel: dos fundamentos à prática em projetos reais", issuer: "Rocketseat", year: "2026" },
  { name: "NLW Operator - Fullstack", issuer: "Rocketseat", year: "2026" },
  { name: "Curso Online de PHP", issuer: "Rocketseat", year: "2024" },
  { name: "NLW Pocket: JavaScript - Fullstack Intermediário", issuer: "Rocketseat", year: "2024" },
  { name: "Semana do Python na prática", issuer: "EmpowerData", year: "2024" },
  { name: "Imersão Inteligência Artificial 2° Edição", issuer: "Alura", year: "2024" },
  { name: "Imersão Dev Com Google Gemini", issuer: "Alura", year: "2024" },
] as const;
