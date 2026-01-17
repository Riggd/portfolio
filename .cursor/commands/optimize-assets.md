---
name: optimize-assets
description: Lowercase, optimize, and organize project assets
triggers: ["/optimize-assets", "/assets"]
skills: ["asset-normalization", "image-optimization", "accessibility-check"]
---

# Assets Guardian Command

Ensures all assets are performance-ready and follow naming conventions.

## Steps

1. **Name Normalization**:
   - Use the `asset-normalization` skill to run `bash lowercase-assets.sh` and ensure all filenames in `src/assets` are lowercase and hyphen-separated.

2. **Audit Assets**:
   - Use the `image-optimization` skill to:
     - List the contents of `src/assets/images` (or `src/assets/projects`).
     - Identify any files over 500KB.
     - Summarize findings to the user.

3. **Accessibility Check**:
   - Use the `accessibility-check` skill to:
     - Scan recent project additions in `src/projects/`.
     - Identify any `<img>` tags or markdown image links missing `alt` text.
     - Suggest descriptive `alt` text for these images.

4. **Integration**:
   - Verify that the new assets are properly referenced in the project Markdown files.
