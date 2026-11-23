# acme-talk

A mock design system (**Acme DS**) and three demos for a 30-minute talk on where AI fits in the design system lifecycle (Dec 8, 2026).

1. **Readiness audit:** how well agents already use the system ([open-design-system-bench](https://github.com/christophhdesign/open-design-system-bench))
2. **Token sync:** a scripted sync, with Claude Code classifying changes and writing the changelog
3. **Adherence bench:** linter vs. Claude Sonnet judge vs. Gemini Decision 1, scored against seeded errors

Start with `CLAUDE.md`, then `docs/kickoff-prompt.md`.

## What's here

| Path | Contents |
|------|----------|
| `CLAUDE.md` | Project context, locked decisions, conventions |
| `docs/build-plan.md` | Full build plan |
| `docs/talk-outline.md` | Talk run-of-show |
| `docs/kickoff-prompt.md` | First prompt for Claude Code (the day-1 spike) |
| `packages/acme/tokens/` | DTCG tokens in three tiers: primitive, semantic, component |
| `packages/acme/acme.rules.json` | Usage rules + the 7 error categories |
| `demos/3-adherence/corpus/ERRORS.md` | Spec for the seeded corpus and the answer key |
| `docs/talk-track.md` | Talk track |
| `demos/1-readiness/` | Demo 1: ODSB audit of Acme before/after agent context (built) |
| `demos/2-token-sync/` | Demo 2: token sync + change classifier (cache only, not built yet) |
| `demos/3-adherence/` | Demo 3: adherence bench (corpus spec and cache only, not built yet) |
| `patches/` | Patch applied to `open-design-system-bench` via pnpm |

## Setup

Requires Node >= 20 and pnpm 10.

```bash
pnpm install
cp .env.example .env   # Demo 3 only: GEMINI_API_KEY, GEMINI_DECISION_MODEL
```

The Sonnet judge in Demo 3 runs through `claude -p`, so the `claude` CLI must be logged in. No key needed.

## Scripts

Run from this directory.

| Command | What it does |
|---------|--------------|
| `pnpm tokens` | Build Acme tokens with Style Dictionary |
| `pnpm readiness` | Build tokens, extract, audit before and after |
| `pnpm readiness:before` | Audit the before state only |
| `pnpm readiness:after` | Audit the after state only |
| `pnpm bench` | Demo 3 adherence bench (not runnable yet: no demo-3 package) |

Cached Demo 1 results: `demos/1-readiness/cache/` (before 45.9, after 69.9).

## Acme DS package

`packages/acme` (`@acme/ds`) is a React 18 component library (Button, Alert) with DTCG tokens. From that directory: `pnpm dev` (playground), `pnpm build`, `pnpm typecheck`. Agent context files: `AGENTS.md`, `llms.txt`, `CHANGELOG.md`, `.claude/skills/acme`.
