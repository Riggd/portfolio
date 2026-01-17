---
name: markdown-scaffold
description: Create properly structured Markdown files with frontmatter
trigger: manual
---

# Markdown Scaffold Skill

This skill creates properly structured Markdown files with appropriate frontmatter and templates.

## Purpose

Create properly structured Markdown files with frontmatter, structure, and templates based on file type (project, page, field note).

## Trigger Conditions

- **Manual**: Invoked by `/add-project`, `/add-page`, or `/add-field-note` commands

## Actions

### Project Files (`src/projects/[slug].md`)

1. **Create File Structure**:
   - Generate filename from project title (slugified)
   - Create file with project frontmatter template:
     ```markdown
     ---
     title: [Project Title]
     description: "[Brief description]"
     client: [client-slug]
     roles: 
       - [Role]
     duration: [Date range]
     ---
     ```

2. **Add Content Sections**:
   - Add structured sections:
     - `## Overview`
     - `## The Challenge`
     - `## The Process`
     - `## The Results`

### Page Files (`src/[filename].md`)

1. **Create File Structure**:
   - Use provided filename
   - Create file with page frontmatter template:
     ```markdown
     ---
     title: [Page Title]
     layout: "base.njk"
     templateEngineOverride: njk,md
     ---
     <div class="fade-in [slug]">
         <div class="top">
             <h1 style="font-size:4rem; font-weight: 600; margin:0;">[Title]</h1>
             <h2>[Brief intro/subtitle]</h2>
         </div>
     </div>
     ```

### Field Note Files (`src/field-notes/YYYY-MM-DD-slug.md`)

1. **Create File Structure**:
   - Generate filename: `YYYY-MM-DD-slugified-title.md`
   - Create file with field note frontmatter template:
     ```markdown
     ---
     title: "[Title]"
     date: YYYY-MM-DD
     link: "https://example.com"
     ---
     [User's notes in Markdown]
     ```

## Implementation Details

- Slugify titles using lowercase, hyphen-separated format
- Use current date for field notes if not provided
- Ensure proper YAML frontmatter formatting
- Create directory structure if needed (e.g., `src/field-notes/`)

## Template Variables

- `[slug]`: Slugified version of title (lowercase, hyphens)
- `[Title]`: Original title with proper capitalization
- `YYYY-MM-DD`: Date in ISO format
- `[Brief description]`: User-provided description

## Notes

- All templates follow the portfolio's established patterns
- Frontmatter should match existing file structures
- File paths should follow the project's file structure conventions
- This skill is used by multiple commands for consistency
