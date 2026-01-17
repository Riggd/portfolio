---
name: accessibility-check
description: Ensure images have proper alt text for accessibility
trigger: automatic
---

# Accessibility Check Skill

This skill ensures all images have proper alt text for accessibility compliance.

## Purpose

Ensure images have proper alt text to meet accessibility standards (WCAG guidelines).

## Trigger Conditions

- **Automatic**: When images are added or when markdown files are edited
- **Manual**: Invoked by `/optimize-assets` command or `/pre-flight` command

## Actions

1. **Scan Project Files**:
   - Scan `src/projects/` for all Markdown files
   - Parse each file for image references

2. **Identify Missing Alt Text**:
   - Check HTML `<img>` tags for missing or empty `alt` attributes
   - Check Markdown image syntax: `![alt text](path)` for missing or empty alt text
   - Check Nunjucks templates in `src/_includes/` if applicable

3. **Suggest Alt Text**:
   - For each image missing alt text, suggest descriptive alt text based on:
     - Image filename
     - Context from surrounding content
     - Project title and description
     - Image purpose (screenshot, diagram, logo, etc.)

4. **Report Findings**:
   - List all images missing alt text
   - Provide suggested alt text for each
   - Indicate file location and line number if possible

## Implementation Details

- Scan both Markdown and HTML/Nunjucks files
- Consider context when suggesting alt text
- Decorative images should have empty alt text (`alt=""`)
- Informative images need descriptive alt text
- Functional images (like logos) should describe their function

## Notes

- Alt text should be concise but descriptive
- Avoid redundant phrases like "image of" or "picture of"
- Decorative images should use `alt=""` to be skipped by screen readers
- This skill helps ensure WCAG 2.1 Level AA compliance
