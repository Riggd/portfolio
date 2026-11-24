# Changelog

All notable changes to Acme DS. Follows [Semantic Versioning](https://semver.org/).

## 0.2.0

### Added
- `color.feedback.info.fg`, `color.feedback.info.bg` and `color.feedback.info.border` for informational status UI.

### Changed
- Renamed the `color.danger` group (`fg`, `bg`, `border`) to `color.feedback.error`. Values are unchanged.
- `space.3` changed from 12 to 14. 14 is not on the spacing scale (4/8/12/16/24/32/48).

### Migration

#### `color.danger` renamed to `color.feedback.error`

Before: `color.danger.fg`, `color.danger.bg`, `color.danger.border`
After: `color.feedback.error.fg`, `color.feedback.error.bg`, `color.feedback.error.border`

Affected files from `usage`: `tokens/component.json` (1 reference per token, 3 total). The `usage` list does not include `acme.rules.json`, but the `token-danger-for-errors` and Input guidance there are known to mention `color.danger.*`. Check it and update it too, or the build breaks.

#### `space.3` changed from 12 to 14

Before: `space.3` = 12
After: `space.3` = 14, which is off the 4/8/12/16/24/32/48 scale.

Affected files from `usage`: `acme.rules.json` (1), `src/foundations.css` (1), `tokens/component.json` (2). Either confirm 14 is intended and add it to the scale, or keep `space.3` at 12. Any layout that relied on 12px will shift by 2px.

## 0.1.0

### Added
- `Button` with `primary`, `secondary`, `destructive` and `ghost` variants, and `sm` / `md` sizes.
- `Alert` with `success`, `warning` and `danger` intents.
- DTCG tokens in three tiers (primitive, semantic, component), built to `dist/tokens.css` and `dist/tokens.ts`.
- `foundations.css` with token variables and component styles.

### Deprecated
- `Card` is deprecated in favor of `Surface` and will be removed in 1.0.0. Neither is exported yet.
