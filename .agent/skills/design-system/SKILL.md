---
name: Design System
description: Audit and align CSS/SCSS with Southleft Design System tokens and standards.
---

# Design System Skill

This skill helps ensure visual consistency and adherence to the design system.

## Capabilities

### 1. Check Design (Visual QA)
**Trigger**: When the user wants to "check the design", audit CSS, or verify tokens.
**Steps**:
1.  **Scan Styles**: Locate SCSS files in `src/assets/css` or `src/assets/scss`. Look for hardcoded hex values or pixel spacing (e.g., `12px`, `24px`).
2.  **Knowledge Query**: Use `mcp_southleft-ds-mcp_search_design_knowledge` to find relevant tokens for Color, Spacing, and Typography.
3.  **Comparison & Refactor**: Compare hardcoded values and suggest replacements with design tokens (variables).
4.  **Interactive States**: Check buttons/links for hover/focus/active states. Propose CSS for smooth transitions if missing.
