# Changelog

All notable changes to Acme DS. Follows [Semantic Versioning](https://semver.org/).

## 0.1.0

### Added
- `Button` with `primary`, `secondary`, `destructive` and `ghost` variants, and `sm` / `md` sizes.
- `Alert` with `success`, `warning` and `danger` intents.
- DTCG tokens in three tiers (primitive, semantic, component), built to `dist/tokens.css` and `dist/tokens.ts`.
- `foundations.css` with token variables and component styles.

### Deprecated
- `Card` is deprecated in favor of `Surface` and will be removed in 1.0.0. Neither is exported yet.
