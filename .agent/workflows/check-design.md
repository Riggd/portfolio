---
description: Audit SCSS/CSS for consistency with Southleft design tokens
---

# Visual QA & Tokens Workflow

Aligns the local styles with the Southleft Design System standards.

## Steps

1. **Scan Styles**:
   - Locate SCSS files in `src/assets/css` or `src/assets/scss`.
   - Search for hardcoded hex values or pixel units that looks like spacing (e.g., `12px`, `24px`).

2. **Knowledge Query**:
   - Use `mcp_southleft-ds-mcp_search_design_knowledge` to find relevant tokens for:
     - Color
     - Spacing (Layout)
     - Typography (Font families, sizes)

3. **Comparison & Refactor**:
   - Compare local hardcoded values with Southleft tokens.
   - Suggest replacement with CSS variables or variables defined in the system.

4. **Interactive States**:
   - Check buttons and links for missing hover/focus/active states.
   - Propose CSS to add smooth transitions if missing.
