---
name: pre-flight
description: Ensure SEO and Accessibility standards are met before launch
triggers: ["/pre-flight", "/seo-check"]
skills: ["seo-audit", "build-verification"]
---

# SEO & Pre-flight Command

The final check to ensure the site is ready for public eyes and search engines.

## Steps

1. **SEO Audit**:
   - Use the `seo-audit` skill to:
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
   - Use the `build-verification` skill to run `npm run build` and ensure no build errors occur before the user commits.
