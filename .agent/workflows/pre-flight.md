---
description: Ensure SEO and Accessibility standards are met before launch
---

# SEO & Pre-flight Workflow

The final check to ensure the site is ready for public eyes and search engines.

## Steps

1. **SEO Audit**:
   - Check the `title` tag and `meta description` in the layout files (check `src/_includes/`).
   - Ensure every page (especially new projects) has a unique title and description in its frontmatter.

2. **Heading Hierarchy**:
   - Parse recent markdown files to ensure `h1` is unique and headings follow a logical order (`h1 -> h2 -> h3`).

3. **Semantic HTML**:
   - Review components in `src/_includes/` for proper use of `<nav>`, `<main>`, `<footer>`, and `<article>`.

4. **Interactive Accessibility**:
   - Ensure all links have descriptive text (no "click here").
   - Check that the main navigation is keyboard-accessible.

5. **Final Build**:
   // turbo
   - Run `npm run build` to ensure no build errors occur before the user commits.
