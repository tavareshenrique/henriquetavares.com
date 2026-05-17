# Henrique Tavares

<p>
  <a href="README.md"><kbd>Português</kbd></a>
  ·
  <a href="README.en.md"><kbd>English</kbd></a>
</p>

![Henrique Tavares](static/HTLogo.jpg)

[henriquetavares.com](https://henriquetavares.com/) é o blog pessoal do Henrique Tavares: um espaço para publicar aprendizados, experiências e notas sobre desenvolvimento de software. A ideia continua sendo a de um "public Notion", mas com uma base técnica mais simples, rápida e sustentável.

O projeto foi claramente inspirado, e em boa parte copiado na origem, do [overreacted.io](https://overreacted.io/), blog do [Dan Abramov](https://overreacted.io/). Essa referência faz parte da história do site e da estética original que a migração procura preservar.

O site publica artigos em português e inglês, com português como experiência principal. A versão atual é uma migração de manutenção: sai a stack antiga baseada em Gatsby e entra uma arquitetura estática com Astro, preservando as rotas públicas, o conteúdo publicado e a identidade visual do blog.

### Stack

- [Astro](https://astro.build/) 5 para geração estática.
- [Tailwind CSS](https://tailwindcss.com/) para layout, componentes e tokens visuais.
- Markdown em Astro Content Collections para os posts.
- Zod para validar frontmatter dos posts.
- Prism para syntax highlighting.
- Vitest para testes unitários e de integração.
- ESLint, Prettier, Husky e lint-staged para qualidade de código.

### Estrutura do Blog

O conteúdo vive em `src/content/posts/`. Cada post fica em uma pasta própria e mantém suas imagens/assets junto do Markdown:

```text
src/content/posts/
  meu-post/
    index.md
    index.pt-br.md
    imagem.png
```

Por convenção:

- `index.pt-br.md` é a versão em português.
- `index.md` é a versão em inglês.
- O nome da pasta define o `slug` público do post.
- A rota em português é a padrão: `/` e `/<slug>/`.
- A rota em inglês fica em `/en/` e `/en/<slug>/`.

A camada em `src/lib/posts.ts` normaliza os posts e agrupa traduções. A camada em `src/lib/routes.ts` concentra as regras de rotas públicas, alternates e paths canônicos.

### Desenvolvimento Local

Use `pnpm` para instalar dependências e rodar os scripts do projeto:

```bash
pnpm install
pnpm dev
```

Depois abra `http://localhost:4321/`.

Comandos úteis:

```bash
pnpm build          # gera a versão estática em dist/
pnpm preview        # serve o build localmente
pnpm lint           # executa ESLint
pnpm lint:fix       # corrige problemas de lint quando possível
pnpm format         # formata arquivos do workspace
pnpm format:check   # verifica formatação
pnpm test           # roda os testes com Vitest
pnpm test:coverage  # roda testes com cobertura
pnpm audit:migration # valida invariantes da migração
pnpm validate       # lint + formatação + testes + build + auditoria de migração
```

### Publicando ou Mantendo Posts

Para adicionar um post, crie uma nova pasta em `src/content/posts/<slug>/` e adicione as versões esperadas:

- `index.pt-br.md` para português.
- `index.md` para inglês.

O frontmatter é validado por `src/content/post-schema.ts` e deve conter:

```yaml
title: Título do post
date: 2026-05-16
spoiler: Resumo curto exibido nas listas do blog.
tags:
  - astro
  - javascript
updateDate: 2026-05-17
```

`updateDate` e `tags` são opcionais. Antes de publicar, rode `pnpm validate` para conferir lint, formatação, testes, build e auditoria de rotas/conteúdo.

### Contexto da Migração

Esta versão do blog nasceu do trabalho `v2-henrique-blog`, uma migração focada em manutenção e paridade. O objetivo não foi redesenhar o site, criar um produto novo ou expandir funcionalidades para leitores; foi remover o risco de manutenção da stack Gatsby antiga sem quebrar a experiência existente.

Documentos principais:

- [PRD](.compozy/tasks/v2-henrique-blog/_prd.md): define a migração como um reset de manutenção, com preservação dos posts, URLs, experiência bilíngue e identidade visual.
- [TechSpec](.compozy/tasks/v2-henrique-blog/_techspec.md): descreve a arquitetura Astro, content collections, rotas bilíngues, tema, compartilhamento e validação.

Decisões registradas:

- [ADR-001: Migrate from Gatsby to Astro](.compozy/tasks/v2-henrique-blog/adrs/adr-001.md): escolhe Astro como base estática para o blog Markdown.
- [ADR-002: Use Strict Parity Maintenance Reset for V1](.compozy/tasks/v2-henrique-blog/adrs/adr-002.md): preserva rotas, conteúdo e aparência, removendo superfícies legadas sem uso.
- [ADR-003: Use Astro Content Collections with Co-Located Post Assets](.compozy/tasks/v2-henrique-blog/adrs/adr-003.md): mantém um diretório por post com arquivos de idioma e assets próximos.
- [ADR-004: Rebuild Styling with Tailwind and a Minimal Theme Script](.compozy/tasks/v2-henrique-blog/adrs/adr-004.md): usa Tailwind e um script mínimo para dark/light mode sem hidratação React.
- [ADR-005: Use Static Share Links and Focused Migration Validation](.compozy/tasks/v2-henrique-blog/adrs/adr-005.md): substitui `react-share` por links estáticos e valida rotas/conteúdo com auditoria focada.

### Validação

A validação automatizada cobre:

- lint do código;
- build Astro;
- testes unitários e de integração;
- auditoria de migração para contagem de posts, pares de tradução, rotas esperadas e referências legadas removidas.

Para a verificação principal de manutenção, use:

```bash
pnpm validate
```
