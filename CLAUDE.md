# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — Dev server with hot reload at http://localhost:8080
- `npm run build` — Production build (cleans `public/`, then runs Eleventy)
- No test framework is configured

## Architecture

**Static site generator**: Eleventy v3.0 with Nunjucks templates, Markdown content, esbuild JS bundling, and Sass compilation. Deployed to Netlify.

### Directory Layout

- `src/` — All source files; Eleventy input directory
- `src/_layouts/` — Page layouts (`base.njk` → main layout, `blank.njk` → minimal, `project.njk` → case studies extending base)
- `src/_includes/` — Partials and macros (navbar, footer, hero, project cards)
- `src/_data/` — Global data files (`meta.js`, `github.js`, `spotify.js`, `lastfm.js`) fed into templates via Eleventy's data cascade
- `src/_11ty/` — Build helpers: `build-assets.js` (esbuild + Sass), `filters.js`, `shortcodes.js`
- `src/projects/` — Project case study Markdown files (auto-collected as `collections.projects`)
- `src/field-notes/` — Blog-style Markdown posts
- `src/assets/css/` — SCSS source; `style.scss` is the master import
- `src/assets/js/` — JS source; `index.js` is the esbuild entry → outputs `public/assets/js/bundle.js`
- `src/assets/projects/` — Per-project image assets in subdirectories named by client slug
- `public/` — Build output (gitignored)

### Build Pipeline

On `eleventy.before`: esbuild bundles JS, Sass compiles CSS. Then Eleventy processes templates, applies the `eleventyImageTransformPlugin` (converts images to WebP with lazy loading), and passthroughs `src/assets/`.

### Content Model

**Projects** use `layout: project.njk` (set via directory data or frontmatter) with this frontmatter schema:
```yaml
title, description, client, responsibilities[], image, logo,
client-url, roles[], team[], duration, wins[], issues[]
```
The `client` field is the slug used for asset paths (`src/assets/projects/{client}/`).

**Field notes** use date-prefixed filenames (`YYYY-MM-DD-slug.md`) with frontmatter: `title`, `date`, optional `link`.

### Theming

CSS custom properties in `_variables.scss` define the design system. Three theme modes: `:root` (default), `html[data-theme='light']`, `html[data-theme='dark']`. Theme toggle persists in `sessionStorage`. An inline script in `head.njk` prevents FOUC.

### Design Tokens

Use CSS variables for all values — spacing (`--space-xs` through `--space-xl`), radii (`--radius-sm` through `--radius-xl`), shadows (`--shadow-sm/md/lg`), and color tokens. Container max-width is `--container-max-width: 80ch`.

## Conventions

- **Asset filenames**: Always lowercase with hyphens. Run `bash lowercase-assets.sh` after adding new assets.
- **Image assets**: Warn if any image exceeds 500KB. Images use `data-zoomable` attribute for medium-zoom.
- **Accessibility**: Interactive elements (`<a>`, `<button>`) must have both `:hover` and `:focus-visible` states.
- **Markdown content**: Wrap sections in `<section>` tags. Use `markdown-it-attrs` syntax for adding classes/attributes.
- **Styling**: Reference CSS custom properties from `_variables.scss` instead of hardcoding values.

## Commit Protocol

Before committing, verify: heading hierarchy is correct, meta tags are present, and recent assets are optimized. List any issues as "Blocking Issues" before proceeding.
