# Demo 1: Readiness audit

ODSB is installed from GitHub at a pinned commit (see `package.json`). Acme's entry is in `systems.config.json`.
Cached audit and run outputs go in `cache/`.

```bash
pnpm install                                   # from talks/acme-talk
pnpm readiness                                 # build tokens, extract, audit
pnpm --filter demo-1-readiness run doctor
pnpm --silent --filter demo-1-readiness run audit:json > demos/1-readiness/cache/<name>.json
```

Plan: docs/build-plan.md#demo-1-where-you-are-ai-readiness-audit
