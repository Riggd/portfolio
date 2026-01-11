---
description: Create a new field note entry in the collection
---

1.  **Gather Information**: Ask the user for the following details:
    *   **Title**: The name of the link or finding.
    *   **Link**: The URL of the discovery.
    *   **Date**: Defaults to today (YYYY-MM-DD).
    *   **Notes**: The thoughts or context (Markdown supported).

2.  **Generate Filename**: Slugify the title and prepend the date to create a unique filename.
    *   Format: `src/field-notes/YYYY-MM-DD-slugified-title.md`

3.  **Create File**: Write the new Markdown file with the following structure:
    ```markdown
    ---
    title: "Title"
    date: YYYY-MM-DD
    link: "https://example.com"
    ---
    The user's notes go here in Markdown.
    ```

4.  **Confirm**: Tell the user the note has been added and where to find it.

// turbo
5.  **Verify**: Check if the file was created successfully.
