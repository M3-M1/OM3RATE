# OM3RATE

**OM3RATE é forjar o futuro.**

O OM3RATE é um projeto pedagógico de registro, organização e visibilidade das práticas desenvolvidas nos itinerários formativos. Ele reúne processos, produções e experiências construídas com os estudantes ao longo do ano.

O mapa de práticas conecta Matemática, Física e Tecnociência, Robótica e Educação Digital, preservando o percurso de cada turma e permitindo que os registros possam servir como referência para outras pessoas.

## Percurso de organização

Os registros do projeto podem ser apresentados por oito movimentos:

- O: Observar
- M: Maturar
- M: Modelar
- M: Materializar
- R: Refletir
- A: Aprimorar
- T: Testar
- E: Evoluir

Esses movimentos ajudam a organizar e comunicar os processos registrados. Eles não constituem uma metodologia fechada ou uma receita de ensino.

## Organização dos arquivos

```text
index.html                 página inicial do site
percurso.html              atalho para a página do percurso
praticas.html               atalho para o mapa de práticas
detalhes-turma.html         atalho para os registros de uma turma

html/
  percurso.html             conteúdo completo do percurso
  praticas.html              seleção de matéria, ano e turma
  detalhes-turma.html        página individual de cada turma

css/
  estilo-geral.css           estilos compartilhados
  pagina-inicial.css         estilos da página inicial
  paginas-internas.css       cabeçalho, rodapé e estrutura interna
  pagina-percurso.css        estilos do percurso
  pagina-praticas.css        estilos da seleção de práticas
  pagina-turma.css           estilos dos registros da turma

public/                      imagens, ícones e arquivos visuais
app/                         estilos-base mantidos para compatibilidade
```

## Arquivos técnicos

Os arquivos abaixo mantêm os nomes oficiais exigidos pelas ferramentas e não devem ser traduzidos ou renomeados:

- `package.json`
- `package-lock.json`
- `next-env.d.ts`
- `next.config.ts`
- `tsconfig.json`
- `postcss.config.mjs`
- `eslint.config.mjs`
- `.gitignore`

O navegador pode traduzir visualmente palavras como `next` para “próximo”, mas o nome real do arquivo no repositório continua em inglês.

## Tecnologias

- HTML
- CSS
- JavaScript
- Next.js e TypeScript como estrutura técnica disponível
- GitHub Pages

## Autoria

Projeto, identidade visual, conteúdo e programação por **Profª Mérilyn Millena Moleta**.

As práticas e produções estudantis permanecem vinculadas às turmas e aos estudantes responsáveis por sua criação.

## Direitos autorais

© 2026 Mérilyn Millena Moleta. Todos os direitos reservados.

Consulte também o arquivo [`DIREITOS-AUTORAIS.md`](DIREITOS-AUTORAIS.md).
