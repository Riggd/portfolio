---
trigger: always_on
---

# Rule: Mandatory Comment & Documentation Relevancy

## Context
In this workspace, comments must always reflect the current state of the code. "Lying" comments (comments that describe outdated logic) are considered a build-breaking bug.

## Instructions
Whenever you modify a file, you MUST perform a **Comment Audit**:

1. **Review Existing Comments:** Analyze all existing comments in the modified file (both those added by users and previous agent turns).
2. **Validate Logic:** Check if the code changes have rendered any comment inaccurate, misleading, or redundant.
3. **Synchronize:** - **Update:** Rewrite comments to accurately reflect the new implementation.
    - **Prune:** Remove comments that refer to deleted features or logic that is now self-explanatory.
    - **Propose:** If you are unsure of the intent of a human-written comment after a change, you MUST flag this in the Implementation Plan for user review.

## Constraints
- DO NOT leave TODOs or "placeholder" comments unless explicitly requested.
- If a change affects a function's signature, you MUST update the associated JSDoc/Docstring immediately.
- Treat comments as part of the "Code Diff" artifact. If a comment isn't updated to match the code, the task is not complete.