"use client";

import { useState } from "react";

type SubjectId = "matematica" | "fisica" | "robotica" | "digital";

type TimelineEntry = {
  code: string;
  stage: string;
  title: string;
  description: string;
  current?: boolean;
};

type ClassRecord = {
  name: string;
  path: string;
  summary: string;
  tags: string[];
  status?: string;
  timeline?: TimelineEntry[];
};

type SubjectRecord = {
  name: string;
  symbol: string;
  thesis: string;
  years: Record<string, ClassRecord[]>;
};

const accessibilityTimeline: TimelineEntry[] = [
  {
    code: "REGISTRO 01",
    stage: "Observar e Maturar",
    title: "O desafio foi lançado",
    description: "A turma começou a investigar como Física e Robótica podem responder a necessidades reais de mobilidade e acessibilidade.",
  },
  {
    code: "REGISTRO 02",
    stage: "Modelar",
    title: "Ideias em construção",
    description: "Os grupos delimitaram problemas, discutiram usuários e começaram a desenhar soluções, estruturas e mecanismos.",
  },
  {
    code: "AGORA",
    stage: "Materializar e Testar",
    title: "Protótipos em andamento",
    description: "Os projetos seguem em desenvolvimento, com escolhas de materiais, montagem de componentes e primeiros testes de funcionamento.",
    current: true,
  },
];

const subjects: Record<SubjectId, SubjectRecord> = {
  matematica: {
    name: "Matemática",
    symbol: "∑",
    thesis: "Modelar o que o olhar sozinho não alcança.",
    years: {
      "2026": [
        {
          name: "1ºB",
          path: "Resolução de Problemas",
          summary: "Água, gráficos e vídeos de sessenta segundos para transformar dados em argumento.",
          tags: ["gráficos", "sustentabilidade", "comunicação"],
        },
      ],
    },
  },
  fisica: {
    name: "Física e Tecnociência",
    symbol: "τ",
    thesis: "Ler forças, movimentos e energias como decisões do mundo material.",
    years: {
      "2026": [
        {
          name: "2ºB",
          path: "Feira de Acessibilidade e Movimento",
          summary: "Projeto interdisciplinar em que a turma investiga necessidades reais e desenvolve soluções envolvendo movimento, máquinas, energia e acessibilidade.",
          tags: ["τ", "acessibilidade", "projeto em andamento"],
          status: "PROJETO EM DESENVOLVIMENTO",
          timeline: accessibilityTimeline,
        },
      ],
    },
  },
  robotica: {
    name: "Robótica",
    symbol: "⌬",
    thesis: "Construir mecanismos que respondem a necessidades humanas reais.",
    years: {
      "2026": [
        {
          name: "2ºB",
          path: "Feira de Acessibilidade e Movimento",
          summary: "Protótipos assistivos desenvolvidos pela turma para transformar observação, pesquisa e modelagem em soluções que possam ser testadas.",
          tags: ["robótica", "autonomia", "projeto em andamento"],
          status: "PROJETO EM DESENVOLVIMENTO",
          timeline: accessibilityTimeline,
        },
      ],
    },
  },
  digital: {
    name: "Educação Digital",
    symbol: "01",
    thesis: "Fazer do código uma linguagem de pensamento e autoria.",
    years: {
      "2026": [
        {
          name: "1ºB",
          path: "Educação Digital",
          summary: "Espaço reservado para os métodos, as invenções e os resultados autorais da turma.",
          tags: ["autoria", "tecnologia", "2026"],
        },
        {
          name: "2ºB",
          path: "Educação Digital",
          summary: "Espaço reservado para os métodos, as invenções e os resultados autorais da turma.",
          tags: ["autoria", "tecnologia", "2026"],
        },
      ],
      "2025": [
        {
          name: "7ºs",
          path: "Projetos de 2025",
          summary: "Os projetos não são anunciados publicamente para preservar os direitos autorais dos estudantes.",
          tags: ["autoria preservada", "direitos autorais", "2025"],
        },
      ],
    },
  },
};

const methodSteps = [
  ["O", "Observar", "perceber antes de responder"],
  ["M", "Maturar", "dar tempo à ideia"],
  ["M", "Modelar", "desenhar o pensamento"],
  ["M", "Materializar", "fazer a ideia existir"],
  ["R", "Refletir", "ler o percurso"],
  ["A", "Aprimorar", "melhorar com intenção"],
  ["T", "Testar", "colocar à prova"],
  ["E", "Evoluir", "abrir o próximo ciclo"],
];

const publicPath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function CombinationMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`combination-mark ${compact ? "is-compact" : ""}`}>
      <svg className="mark-symbol" viewBox="0 0 112 96" aria-hidden="true">
        <path d="M16 18 H76 L98 40 V76 H38 L16 54 Z" className="mark-shell" />
        <path d="M16 18 L39 41 M76 18 L55 39 M98 40 L78 60 M38 76 L57 57" className="mark-construction" />
        <path d="M28 62 V34 L42 51 L56 34 V62" className="mark-monogram" />
        <path d="M68 35 H86 L72 48 H86 L68 62" className="mark-three-glyph" />
        <path d="M7 80 L105 10" className="mark-vector" />
        <circle cx="31" cy="73" r="3.5" className="mark-node node-sage" />
        <circle cx="46" cy="73" r="3.5" className="mark-node node-lilac" />
        <circle cx="61" cy="73" r="3.5" className="mark-node node-steel" />
      </svg>
      <div className="wordmark">
        <div className="wordmark-line"><span>OM</span><b>3</b><span>RATE</span></div>
        <small>mapa de projetos e práticas</small>
      </div>
    </div>
  );
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [activeSubject, setActiveSubject] = useState<SubjectId>("matematica");
  const [activeYear, setActiveYear] = useState("2026");
  const [activeClass, setActiveClass] = useState(0);

  const subject = subjects[activeSubject];
  const years = Object.keys(subject.years).sort((a, b) => Number(b) - Number(a));
  const classes = subject.years[activeYear] ?? subject.years[years[0]];
  const selectedClass = classes[activeClass] ?? classes[0];

  function chooseSubject(id: SubjectId) {
    const nextSubject = subjects[id];
    const nextYear = Object.keys(nextSubject.years).sort((a, b) => Number(b) - Number(a))[0];
    setActiveSubject(id);
    setActiveYear(nextYear);
    setActiveClass(0);
  }

  function chooseYear(year: string) {
    setActiveYear(year);
    setActiveClass(0);
  }

  return (
    <main className="site-shell">
      <div className="moving-grid" aria-hidden="true" />
      <div className="ambient-orbit orbit-one" aria-hidden="true" />
      <div className="ambient-orbit orbit-two" aria-hidden="true" />

      <header className="topbar">
        <a href="#inicio" className="brand-link" aria-label="OM3RATE, início">
          <CombinationMark compact />
        </a>
        <nav aria-label="Navegação principal">
          <button type="button" onClick={() => scrollToSection("quem-somos")}>Quem somos</button>
          <button type="button" onClick={() => scrollToSection("sigla")}>A sigla</button>
          <button type="button" onClick={() => scrollToSection("arquivo")}>Mapa de projetos</button>
          <button type="button" onClick={() => scrollToSection("contato")}>Contato</button>
        </nav>
      </header>

      <section className="hero section-frame" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">método autoral · mapa pedagógico · escola em movimento</p>
          <CombinationMark />
          <h1><span>OM3RATE</span> É<br />FORJAR O FUTURO.</h1>
          <p className="hero-text">
            Ideias não nascem prontas. Ganham método, matéria, atrito e autoria. Assim, podem devolver alguma coisa ao mundo.
          </p>
          <div className="hero-actions">
            <button type="button" className="primary-button" onClick={() => scrollToSection("arquivo")}>
              Consultar o mapa de projetos <span aria-hidden="true">↘</span>
            </button>
            <span>Colégio Estadual Cívico-Militar<br /><strong>Alcides Munhoz</strong></span>
          </div>
        </div>
        <div className="hero-field" aria-hidden="true">
          <div className="field-ring ring-a" />
          <div className="field-ring ring-b" />
          <span className="formula formula-a">τ = F · d · cos θ</span>
          <span className="formula formula-b">∑ ideia / teste → evidência</span>
          <span className="field-label">M³ / MATÉRIA · MÉTODO · MOVIMENTO</span>
          <div className="forge-core"><span>O</span><strong>M³</strong><i>R A T E</i></div>
        </div>
      </section>

      <div className="motion-ribbon" aria-hidden="true">
        <span>OBSERVAR · MATURAR · MODELAR · MATERIALIZAR · REFLETIR · APRIMORAR · TESTAR · EVOLUIR · </span>
        <span>OBSERVAR · MATURAR · MODELAR · MATERIALIZAR · REFLETIR · APRIMORAR · TESTAR · EVOLUIR · </span>
      </div>

      <section className="about-section section-frame" id="quem-somos">
        <div className="section-index">01 / QUEM SOMOS</div>
        <div className="about-heading">
          <h2>UM PROJETO DE VISIBILIDADE<br />PARA O QUE A ESCOLA <em>REALMENTE FAZ.</em></h2>
          <p>O OM3RATE reúne práticas, métodos e criações para que trabalhos significativos não desapareçam depois da nota, da feira ou do fim do trimestre.</p>
        </div>
        <div className="about-grid">
          <article><span>01</span><h3>Uma professora que documenta</h3><p>Planejamento, mediação e registro transformados em memória pedagógica compartilhável.</p></article>
          <article><span>02</span><h3>Estudantes que assinam</h3><p>Os projetos aparecem como produção de quem investigou, construiu, errou e refez.</p></article>
          <article><span>03</span><h3>Uma escola que aparece</h3><p>O cotidiano escolar ganha presença pública como lugar de conhecimento e invenção.</p></article>
        </div>
      </section>

      <section className="acronym-section" id="sigla">
        <div className="section-frame">
          <div className="section-index light">02 / A SIGLA</div>
          <div className="acronym-heading"><h2>OITO MOVIMENTOS.<br />NENHUMA RECEITA.</h2><span>O → M³ → R → A → T → E ↺</span></div>
          <div className="acronym-grid">
            {methodSteps.map(([letter, title, note], index) => (
              <article key={title} className={index >= 1 && index <= 3 ? "is-m3" : ""}>
                <span>0{index + 1}</span><strong>{letter}</strong><h3>{title}</h3><p>{note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="archive-section section-frame" id="arquivo">
        <div className="section-index">03 / MAPA DE PROJETOS</div>
        <div className="archive-heading">
          <div><h2>ESCOLHA UMA MATÉRIA.<br /><em>ENTRE NO ANO.</em></h2><p>O robô funciona como guardião do mapa de projetos: astrolábio para medir o mundo; livro para preservar o que foi aprendido.</p></div>
          <div className="route-readout"><span>ROTA ATUAL</span><strong>{subject.name} / {activeYear} / {selectedClass.name}</strong></div>
        </div>

        <div className="knowledge-machine">
          <div className="subject-stage" role="tablist" aria-label="Escolha uma matéria">
            {(Object.keys(subjects) as SubjectId[]).map((id, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeSubject === id}
                className={`subject-node node-${index} ${activeSubject === id ? "is-active" : ""}`}
                onClick={() => chooseSubject(id)}
                key={id}
              >
                <span>{subjects[id].symbol}</span><strong>{subjects[id].name}</strong>
              </button>
            ))}

            <div className="robot-frame">
              <div className="robot-halo" aria-hidden="true" />
              <img src={`${publicPath}/robot-astrolabe.webp`} alt="Robô futurístico segurando um astrolábio e um livro aberto" />
              <div className="robot-caption"><span>{subject.symbol}</span><p>{subject.thesis}</p></div>
            </div>
          </div>

          <aside className="year-panel" aria-label="Escolha o ano">
            <div className="panel-label"><span>ETAPA 02</span><strong>ANO</strong></div>
            <div className="year-buttons">
              {years.map((year) => (
                <button type="button" key={year} aria-pressed={activeYear === year} className={activeYear === year ? "is-active" : ""} onClick={() => chooseYear(year)}>
                  <span>{year.slice(0, 2)}</span><strong>{year.slice(2)}</strong><i>abrir ↗</i>
                </button>
              ))}
            </div>
            <p>Os anos exibidos dependem da matéria escolhida.</p>
          </aside>

          <div className="class-panel">
            <div className="panel-label"><span>ETAPA 03</span><strong>TURMAS</strong></div>
            <div className="class-tabs" role="tablist" aria-label={`Turmas de ${activeYear}`}>
              {classes.map((item, index) => (
                <button type="button" role="tab" aria-selected={activeClass === index} className={activeClass === index ? "is-active" : ""} onClick={() => setActiveClass(index)} key={`${item.name}-${item.path}`}>
                  <span>0{index + 1}</span><strong>{item.name}</strong><small>{item.path}</small>
                </button>
              ))}
            </div>
            <article className="class-record" role="tabpanel" aria-live="polite">
              <span className="record-code">{activeSubject.toUpperCase().slice(0, 3)}.{activeYear.slice(2)} / {selectedClass.name}</span>
              <h3>{selectedClass.path}</h3>
              <p>{selectedClass.summary}</p>
              <div>{selectedClass.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
              {selectedClass.timeline && (
                <section className="project-timeline" aria-label={`Linha do tempo de ${selectedClass.path}`}>
                  <header><span>LINHA DO TEMPO</span><small>deslize para acompanhar →</small></header>
                  <div className="timeline-track">
                    {selectedClass.timeline.map((entry) => (
                      <article className={entry.current ? "is-current" : ""} key={entry.code}>
                        <div><span>{entry.code}</span><i>{entry.stage}</i></div>
                        <h4>{entry.title}</h4>
                        <p>{entry.description}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}
              <strong className="record-status">{selectedClass.status ?? "REGISTRO EM CONSTRUÇÃO CONTÍNUA"}</strong>
            </article>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contato">
        <div className="section-frame contact-inner">
          <div className="contact-copy"><div className="section-index light">04 / CONTATO</div><h2>CONVERSAS TAMBÉM<br />MOVEM PROJETOS.</h2><p>Para conhecer as práticas, propor trocas pedagógicas ou acompanhar o mapa de projetos, entre em contato com a autora pelo e-mail informado.</p></div>
          <div className="contact-card">
            <CombinationMark compact />
            <dl><div><dt>PROJETO</dt><dd>OM3RATE</dd></div><div><dt>AUTORIA</dt><dd>Profª Mérilyn Millena Moleta</dd></div><div><dt>ESCOLA</dt><dd>Colégio Estadual Cívico-Militar Alcides Munhoz</dd></div><div><dt>CONTATO DIRETO</dt><dd><a href="mailto:merilyn.millena1825@gmail.com">merilyn.millena1825@gmail.com</a></dd></div></dl>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <p>OM3RATE foi idealizado e programado por <strong>Profª Mérilyn Millena Moleta</strong>, com a participação dos estudantes que transformam as ideias em trabalho real.</p>
        <span>© 2026 · Todos os direitos reservados.</span>
      </footer>
    </main>
  );
}
