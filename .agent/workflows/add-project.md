---
description: Create a new project case study by interviewing the user
---

# Case Study Architect Workflow

This workflow guides the user through creating a professional project case study.

## Steps

1. **Information Gathering**:
   - Ask the user for the project title.
   - Ask for their role (e.g., Lead Designer, Front-end Engineer).
   - Ask for the "Big Problem" being solved.
   - Ask for the "Key Outcome" or result.
   - Ask for relevant tags (e.g., UX, React, Animation).

2. **File Creation**:
   - Create a new file in `src/projects/[title-slug].md`.
   - Populate it with common frontmatter based on the answers.
   - Add a structured template:
     - `## Overview`
     - `## The Challenge`
     - `## The Process`
     - `## The Results`

3. **Placeholder Generation**:
   - Suggest 1-2 images that would help tell the story.
   - Offer to use `generate_image` to create mockups if the user doesn't have screenshots ready.

4. **Asset Prep**:
   - Remind the user to run `/optimize-assets` once images are added.
