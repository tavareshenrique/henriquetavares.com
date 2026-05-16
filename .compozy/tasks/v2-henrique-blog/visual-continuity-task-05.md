# Visual continuity checklist — Task 05

Manual smoke when bilingual routes land (Task 06) and theme toggle ships (Task 08).

## Representative surfaces

- **PT-BR index (`/`)**: Merriweather title link, shell width ~42rem, gutter padding, Panel callout spacing, footer links absent on index until wired in Task 06.
- **EN fixture (`/layout-verify/`)**: Post header scale, metadata stack, Prism `language-*` tokens, `blog-code-frame` chrome, responsive iframe aspect ratio, bio + footer rhythm. Remove or keep `noindex` before launch.

## Tokens mapped from legacy `global.scss`

- Dark palette variables preserved via `--blog-*` custom properties; optional `html.light` tokens mirror the commented light theme block.
- Code colors and `.blog-code-line-highlight` mirror non-Gatsby naming (no `gatsby-highlight*`).

## Known gaps vs Gatsby/Typography.js

- No Typography.js rhythm helpers — spacing is approximated with shell tokens and prose margins.
- `/profile-pic.jpg` is referenced from `public/`; add the asset before parity review.
- Language toggle placeholder reserves header space; real toggle arrives in Task 08.

## Automated guards

- Integration build asserts absence of `gatsby-` substrings in emitted HTML for index + verify fixture.
