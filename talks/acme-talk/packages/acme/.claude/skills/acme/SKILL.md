---
name: acme
description: Build or review React UI with Acme DS. Use when writing screens, forms, dialogs or status messages that import from @acme/ds, or when checking code against Acme's usage rules.
---

# Building UI with Acme DS

Read `AGENTS.md` at the package root first. The full rules are in `acme.rules.json`.

## Workflow

1. **Pick the component by job, not by look.**
   - An action → `Button`.
   - A persistent message about page or form state → `Alert`.
   - Anything else → build with tokens, but check `AGENTS.md` first. Don't import components that aren't listed there.
2. **Pick the variant by consequence.**
   - Is the action irreversible or does it lose data (delete, remove permanently, revoke)? → `destructive`, with a confirmation step.
   - Is it reversible (archive, sign out, hide)? → never `destructive`.
   - Is it the one main action in the view? → `primary`. Only one per view or dialog.
   - Supporting action next to it (Cancel, Back) → `secondary`. Dense toolbars and inline edits → `ghost`.
3. **Pick the Alert intent by state.** Error or failure → `danger`. Done successfully → `success`. Needs attention → `warning`. A neutral message ("Saved as draft") isn't success.
4. **Pick tokens by meaning.**
   - Errors: `color.feedback.error.*`. Success: `color.feedback.success.*`. Warnings: `color.feedback.warning.*`.
   - Never `color.brand.*` on errors, status, validation or actions.
   - `color.text.secondary` only on `color.surface.default`.
   - Spacing only from `--space-0`…`--space-7` (0 / 4 / 8 / 12 / 16 / 24 / 32 / 48 px).
5. **Self-check before finishing.** Go through the 7 categories in `acme.rules.json` → `categories[]` and answer each question for your file.

## Examples

```tsx
// Irreversible: destructive, with a secondary cancel
<Button variant="secondary" onClick={close}>Cancel</Button>
<Button variant="destructive" onClick={deleteAccount}>Delete account</Button>

// Reversible: not destructive
<Button variant="secondary" onClick={archive}>Archive project</Button>

// Error message
<Alert intent="danger" title="Payment failed">Update your card to keep your plan.</Alert>
```
