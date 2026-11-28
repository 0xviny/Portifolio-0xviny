export const profile = {
  name: "Vinicius",
  fullName: "Vinicius Gabriel",
  role: "Full Stack Developer",
  location: "Brasil, trabalho remoto",
  email: "contato@0xviny.com.br",
  availability: "Disponível para projetos",
  services: [
    "Back-end com Laravel e APIs REST",
    "Front-end com React e TypeScript",
    "Banco de dados, Docker e Nginx",
  ],
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

/* momento tipográfico da página: uma frase que acende palavra por palavra */
export const statement = {
  text: "Perguntar o porquê antes de implementar e entregar menos coisas, mas afiadas.",
  accentWord: "afiadas.",
};

export const socials = [
  { label: "GitHub", href: "https://github.com/0xviny" },
  { label: "LinkedIn", href: "" },
  { label: "Instagram", href: "https://www.instagram.com/0xviny" },
] as const;

export const sections = [
  { id: "sobre", label: "Sobre mim" },
  { id: "stacks", label: "Stacks" },
  { id: "projetos", label: "Projetos" },
  { id: "carreira", label: "Carreira" },
  { id: "certificados", label: "Certificados" },
  { id: "contato", label: "Contato" },
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
    name: "LifeLine",
    kind: "Sistema de lifecycle para aplicações Node.js",
    description:
      "Gerenciamento de ciclo de vida para aplicações Node.js: inicialização sequencial de recursos, rollback em caso de falha e encerramento ordenado, com dependências entre recursos e um contrato de erros explícito.",
    stack: ["JavaScript", "TypeScript", "Node.js"],
    href: "https://github.com/lifeline-js-org/lifeline-js",
  },
  {
    year: "2026",
    name: "Azura.js",
    kind: "TypeScript Framework",
    description:
      "Framework TypeScript para aplicações web modernas, com renderização no servidor, roteamento, gerenciamento de estado e integração com APIs REST.",
    stack: ["TypeScript", "JavaScript", "Node.js"],
    href: "https://github.com/azurajs/azura",
  },
  {
    year: "2025",
    name: "Educa Dashboard",
    kind: "Site institucional",
    description:
      "Sistema para gerenciamento de advertências e manuseios de equipamentos de informática para escolas.",
    stack: ["TypeScript", "React", "Tailwind CSS", "Next.js", "PostgreSQL"],
    href: "https://github.com/0xviny/educa-dashboard",
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
  {
    name: "Laravel: dos fundamentos à prática em projetos reais",
    issuer: "Rocketseat",
    year: "2026",
  },
  { name: "NLW Operator - Fullstack", issuer: "Rocketseat", year: "2026" },
  { name: "Curso Online de PHP", issuer: "Rocketseat", year: "2024" },
  { name: "NLW Pocket: JavaScript - Fullstack Intermediário", issuer: "Rocketseat", year: "2024" },
  { name: "Semana do Python na prática", issuer: "EmpowerData", year: "2024" },
  { name: "Imersão Inteligência Artificial 2° Edição", issuer: "Alura", year: "2024" },
  { name: "Imersão Dev Com Google Gemini", issuer: "Alura", year: "2024" },
] as const;
