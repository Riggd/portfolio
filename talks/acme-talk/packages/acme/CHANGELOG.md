# Changelog

All notable changes to Acme DS. Follows [Semantic Versioning](https://semver.org/).

## 0.1.0

### Added
- `Button` with `primary`, `secondary`, `destructive` and `ghost` variants, and `sm` / `md` sizes.
- `Alert` with `success`, `warning` and `danger` intents.
- `Input` with a required `label`, plus `error` and `hint`.
- `Surface` with `default`, `subtle` and `tinted` tones and token-based padding.
- `Stack` with `row` / `column` direction, token-based `gap`, and `align`.
- `Chip`, removable (`onRemove`) or selectable (`selected`, `onToggle`).
- `Badge` for read-only labels.
- DTCG tokens in three tiers (primitive, semantic, component), built to `dist/tokens.css` and `dist/tokens.ts`.
- `foundations.css` with token variables and component styles.

### Deprecated
- `Card` is deprecated in favor of `Surface` and will be removed in 1.0.0. `Card` is still exported so existing code compiles.
