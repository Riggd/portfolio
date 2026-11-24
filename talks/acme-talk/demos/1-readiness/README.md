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

## Benchmark runs (cached)

| Run | Cells | Result |
|---|---|---|
| `cache/runs/20261118-062703-context-compare` | confirm-account-deletion × bare / agents-md / skill | 83.8 / 84.0 / 84.0 overall |
| `cache/runs/20261118-062819-small` | 5 tasks × skill | 77.4, 83.6, 56.6, 92.1, 91.0 |

Audit with run data: `cache/audit-after-with-run.json` (82.4, AI-native).
Cache is trimmed to `results.json`, `manifest.json`, `report.html` and one `diff.patch` per cell (transcripts, `files/`, grades, judge output and PDFs dropped; `results.json` holds the scores). `audit --run` and `report --run` both work from this.
Runs are written inside `node_modules` by ODSB, so copy every finished run here.

Cached files must not hold absolute machine paths. After copying a finished run into `cache/`, run `pnpm --filter demo-1-readiness run scrub`.
