# Demo 1: Readiness audit

ODSB is installed from GitHub at a pinned commit (see `package.json`). Both Acme states are configured in `systems.config.json`:

| System | Root | Agent context |
|---|---|---|
| `acme-before` | `.before/acme` (generated, gitignored) | none |
| `acme` | `packages/acme` | AGENTS.md, llms.txt, CHANGELOG.md, `.claude/skills/acme` |

`scripts/make-before.mjs` builds the before copy by removing the files listed in `before-state.json`. It runs before every `extract` and `doctor`.

```bash
pnpm install                 # from talks/acme-talk
pnpm readiness               # build tokens, make before copy, extract, audit both
pnpm readiness:before        # audit before only (after extract)
pnpm readiness:after         # audit after only
```

Cached results: `cache/audit-before.json` (45.9), `cache/audit-after.json` (69.9).

Plan: docs/build-plan.md#demo-1-where-you-are-ai-readiness-audit
