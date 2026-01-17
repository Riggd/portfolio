---
name: seo-audit
description: Ensure SEO standards are met across all pages
trigger: automatic
---

# SEO Audit Skill

This skill ensures all pages meet SEO standards including unique titles, meta descriptions, and proper heading hierarchy.

## Purpose

Ensure SEO standards are met across all pages, including unique titles, meta descriptions, and proper heading hierarchy.

## Trigger Conditions

- **Automatic**: Before git commits (via commit protocol)
- **Manual**: Invoked by `/pre-flight` command

## Actions

1. **SEO Audit**:
   - Check the `title` tag and `meta description` in layout files (`src/_includes/head.njk` or similar)
   - Scan all Markdown files in `src/` for frontmatter
   - Ensure every page has:
     - A unique `title` in frontmatter
     - A `description` in frontmatter (for meta description)
   - Verify that project pages (`src/projects/*.md`) have complete frontmatter

2. **Heading Hierarchy**:
   - Parse recent markdown files to ensure:
     - Each page has exactly one `h1` tag
     - Headings follow logical order (`h1 -> h2 -> h3`)
     - No skipped heading levels (e.g., no `h1` followed by `h3`)
   - Check both Markdown files and rendered HTML structure

3. **Semantic HTML Review**:
   - Review components in `src/_includes/` for proper use of:
     - `<nav>` for navigation
     - `<main>` for main content
     - `<footer>` for footer content
     - `<article>` for article/blog content
     - `<section>` for content sections
   - Ensure proper semantic structure

4. **Meta Tags**:
   - Verify Open Graph tags are present
   - Check for proper `og:title`, `og:description`, `og:image`
   - Ensure Twitter card meta tags if applicable

5. **Report Findings**:
   - List pages missing titles or descriptions
   - Identify heading hierarchy issues
   - Note semantic HTML improvements needed
   - Provide specific file locations and line numbers

## Implementation Details

- Focus on recently modified files first
- Check all pages, especially new projects
- Validate frontmatter structure matches expected format
- Consider Eleventy's data cascade when checking for meta information

## Notes

- Unique titles are critical for SEO
- Meta descriptions should be 150-160 characters
- Proper heading hierarchy helps both SEO and accessibility
- This skill runs silently before commits as part of the commit protocol
