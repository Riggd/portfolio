---
description: Lowercase, optimize, and organize project assets
---

# Assets Guardian Workflow

Ensures all assets are performance-ready and follow naming conventions.

## Steps

// turbo
1. **Name Normalization**:
   - Run `bash lowercase-assets.sh` to ensure all filenames in `src/assets` are lowercase and hyphen-separated.

2. **Audit Assets**:
   - List the contents of `src/assets/images`.
   - Identify any files over 500KB.
   - Summarize findings to the user.

3. **Accessibility Check**:
   - Scan recent project additions in `src/projects/`.
   - Identify any `<img>` tags or markdown image links missing `alt` text.
   - Suggest descriptive `alt` text for these images.

4. **Integration**:
   - Verify that the new assets are properly referenced in the project Markdown files.
