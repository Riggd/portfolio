---
name: add-page
description: Create a new primary page using consistent layout and styles
triggers: ["/add-page", "/new-page"]
skills: ["markdown-scaffold"]
---

# Add Primary Page Command

This command guides you through creating a new top-level page for your portfolio (e.g., a "Skills" or "Testimonials" page).

## Steps

1. **Information Gathering**:
   - Ask the user for the page title (e.g., "Experience").
   - Ask for the desired filename (e.g., `experience.md`).
   - Ask for a brief meta description for SEO.

2. **Structure Verification**:
   - Confirm it should use the `base.njk` layout and `fade-in` animation, similar to `about.md`.

3. **File Creation**:
   - Use the `markdown-scaffold` skill to create the new file in `src/[filename]`.
   - Populate it with standard frontmatter:
     ```markdown
     ---
     title: [Title]
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

4. **Component Suggestions**:
   - Ask if the user wants to include existing components like `resume.njk` or `capabilities.njk`.

5. **Navigation**:
   - Remind the user to add the new page to their navigation layout in `src/_includes/` if applicable.
