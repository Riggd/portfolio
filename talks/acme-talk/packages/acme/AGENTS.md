# Acme DS: agent guide

Acme DS is a React 18 + TypeScript design system. Build UI with Acme components and tokens only.
Full usage rules (source of truth): `acme.rules.json`.

## Setup

```tsx
import '@acme/ds/foundations.css';           // once, at the app root
import { Button, Alert, tokens } from '@acme/ds';
```

## Principles

1. Use Acme components before building custom UI. If a component exists for the job, use it.
2. Style only with tokens. Never use raw color values, and never use spacing values outside the scale.
3. Pick tokens by meaning, not by look. A token that happens to be the right color is still wrong if its purpose is different.
4. Destructive styling is reserved for irreversible or data-losing actions.
5. Brand color is for brand expression, never for status, errors, or actions.

## Components available today

Only these are exported. Don't import anything else from `@acme/ds`.

### Button

`variant`: `primary` | `secondary` | `destructive` | `ghost` (default `primary`) · `size`: `sm` | `md`

| Variant | Use for |
|---|---|
| primary | The single most important action in a view. At most one per view or dialog. |
| secondary | Supporting actions next to a primary action, such as Cancel or Back. |
| destructive | Irreversible or data-losing actions: delete, remove permanently, revoke access. Pair it with a confirmation. |
| ghost | Low-emphasis actions in dense UI, such as toolbars and inline edits. |

Don't:
- Use primary for destructive actions, even when they're the main action in a dialog.
- Use destructive for reversible actions like Archive or Sign out.
- Put two primary Buttons in one view.

### Alert

`intent` (required): `success` | `warning` | `danger` · `title?: string` · `children`

Inline, persistent messages about the state of a page or form. Danger is for errors and failures.
There is no `info` intent.

Don't:
- Restyle an Alert with brand or action tokens.
- Build alert-like boxes from containers plus custom colors; use Alert.

### Not available yet

Input, Surface, Chip, Badge and Stack are planned but not exported. Card is deprecated (replaced by Surface).
Don't import any of them.

## Tokens

CSS variables from `foundations.css`, or the typed map: `tokens.color.text.primary` → `var(--color-text-primary)`.

- Spacing scale (padding, margin, gap, inset): `--space-0`…`--space-7` = 0 / 4 / 8 / 12 / 16 / 24 / 32 / 48 px. No other values.
- Text: `color.text.primary`, `secondary`, `disabled`, `inverse`, `link`. `color.text.secondary` is only for text on `color.surface.default`. On tinted, subtle, or colored surfaces, use `color.text.primary`.
- Surfaces: `color.surface.default`, `subtle`, `tinted`, `inverse`.
- Errors and failures: `color.feedback.error.*`. Success: `color.feedback.success.*`. Warnings: `color.feedback.warning.*`.
- Interactive controls: `color.action.*`. Don't reuse action tokens for static decoration.
- `color.brand.*`: brand moments only (hero highlights, logo lockups, marketing callouts). Never for errors, status, validation, or action buttons.

## Before you finish

Check your output for each of these. They are the errors Acme reviews flag:

- Raw color values (hex, rgb, hsl, named colors)
- Spacing values off the scale
- Deprecated components (Card)
- `color.text.secondary` on a tinted or colored surface
- A token whose meaning doesn't match its purpose (brand or action tokens on errors or status)
- A variant that contradicts its guidance (primary on an irreversible delete, destructive on Archive)
- Hand-built UI where an Acme component exists
