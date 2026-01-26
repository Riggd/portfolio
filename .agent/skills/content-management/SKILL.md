---
name: Content Management
description: Create and manage content types (field notes, pages, projects) ensuring consistent structure and metadata.
---

# Content Management Skill

This skill provides standardized workflows for adding new content to the portfolio.

## Capabilities

### 1. Add Field Note
**Trigger**: When the user wants to add a "field note", "link", or "finding".
**Steps**:
1.  **Gather Info**: Ask for Title, Link URL, Date (default: today), and Notes.
2.  **Generate Filename**: `src/field-notes/YYYY-MM-DD-[slugified-title].md`.
3.  **create File**: Use the `field-note.md` template.
4.  **Verify**: Confirm file creation.

### 2. Add Project (Case Study)
**Trigger**: When the user wants to add a new project or case study.
**Steps**:
1.  **Gather Info**: Ask for Title, Role, "Big Problem", "Key Outcome", and Tags.
2.  **Generate Filename**: `src/projects/[slugified-title].md`.
3.  **Create File**: Use the `project.md` template.
4.  **Assets**: Suggest adding images and running `Project Health: Optimize Assets`.

### 3. Add Primary Page
**Trigger**: When the user wants to add a new top-level page (e.g., "About", "Services").
**Steps**:
1.  **Gather Info**: Ask for Page Title, Filename query, and Meta Description.
2.  **Create File**: Use the `page.md` template.
3.  **Navigation**: Remind user to update `src/_layouts/` or `src/_data/navigation.json` (check repo structure).

## Templates
Templates are located in `.agent/skills/content-management/templates/`. Read them to understand the required frontmatter structure.
