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
| `demos/*/` | One folder per demo (empty until built) |
