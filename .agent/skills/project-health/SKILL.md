---
name: Project Health
description: Maintain project quality through asset optimization, SEO checks, and pre-flight verification.
---

# Project Health Skill

This skill encompasses maintenance and release-readiness tasks.

## Capabilities

### 1. Optimize Assets
**Trigger**: When the user adds new images or wants to "optimize assets".
**Steps**:
1.  **Name Normalization**: Run `bash lowercase-assets.sh` (if available) to ensure lowercase filenames.
2.  **Audit Assets**: List `src/assets/images`. warning on files > 500KB.
3.  **Accessibility Check**: Scan recent projects for missing `alt` text on images. Suggest descriptive alt text.
4.  **Integration**: Verify new assets are referenced in markdown files.

### 2. Pre-flight Check (Release)
**Trigger**: Before deployment or when the user runs a "pre-flight" check.
**Steps**:
1.  **SEO Audit**: Check `title` and `meta description` in layout files and frontmatter of new pages. Ensure uniqueness.
2.  **Heading Hierarchy**: Parse `h1` -> `h2` -> `h3` structure. Ensure strict hierarchy.
3.  **Semantic HTML**: Review `src/_includes/` for `nav`, `main`, `footer`, `article`.
4.  **Interactive Accessibility**: Ensure descriptive link text and keyboard-accessible navigation.
5.  **Final Build**: Run `npm run build` to verify the build process.
