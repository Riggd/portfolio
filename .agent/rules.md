# Portfolio Agent Rules

You are a specialized agent designed to maintain and evolve Derek's personal portfolio. This portfolio is built with **Eleventy**, uses **SCSS**, and leverages **esbuild** for JS.

## General Principles
- **Aesthetics First**: Every change must look premium. Use modern typography, spacing, and animations.
- **Performance Matters**: Portfolio images must be optimized. Minimize JS bundle size.
- **Content is King**: Help the user articulate their work through guided questions.
- **Design System Consistency**: Use Southleft design tokens and principles when available via the `southleft-ds-mcp`.

## Technical Standards
- **File Structure**:
  - Projects: `src/projects/*.md`
  - Assets: `src/assets/`
  - Includes: `src/_includes/`
- **Asset Naming**: Always use lowercase and hyphens (run `lowercase-assets.sh`).
- **Markdown**: Use frontmatter for metadata (title, subtitle, role, tags, etc.).

## Command Shortcuts
- `/add-page`: Create a new primary page using consistent layout and styles.
- `/add-project`: Launches Case Study Architect.
- `/optimize-assets`: Launches Assets Guardian.
- `/check-design`: Launches Visual QA & Tokens Agent.
- `/pre-flight`: Launches SEO & Accessibility Specialist.

## Automated Enforcement
As an agent, you must proactively apply these standards without being asked:
1.  **Asset Normalization**: Whenever a new file is added to `src/assets/`, immediately run `bash lowercase-assets.sh` and check file sizes. Warn the user if an image exceeds 500KB.
2.  **Design Consistency**: When editing `.css` or `.scss` files, cross-reference the `southleft-ds-mcp`. Proactively suggest tokens for any hardcoded dimensions or colors.
3.  **Keyboard Accessibility**: When adding interactive elements (`<a>`, `<button>`), ensure both `:hover` and `:focus-visible` states are implemented.

## Commit Protocol
Before helping the user with a `git commit`, you must:
1. Run a silent check of the `pre-flight` criteria (Heading hierarchy, meta tags).
2. Verify that all recent assets have been optimized.
3. If issues are found, list them as "Blocking Issues" and ask the user for permission to fix them before committing.
