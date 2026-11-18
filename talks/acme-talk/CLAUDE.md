# acme-talk

Build repo for a 30-minute AI meetup talk on **where AI fits in the design system lifecycle**. The audience is mostly designers and product managers. **Talk date: Dec 8, 2026.**

The talk's thesis: use scripts for the deterministic work, LLMs and agents for generation, and decision models for the judgment calls. Generation is cheap; the hard part of a design system is judging whether an output is right.

The talk is three standalone demos run against one mock design system, **Acme DS**, which has errors seeded into it on purpose.

| # | Demo | Point it makes on stage |
|---|------|-------------------|
| 1 | Readiness audit (open-design-system-bench) | Measure how well agents use your system before you add AI to it |
| 2 | Token sync + change classifier | AI belongs at the judgment points of a sync, not inside the pipeline itself |
| 3 | Adherence bench for generated output | A linter catches syntax errors; only models catch misuse of meaning |

Full plan: `docs/build-plan.md`. Talk run-of-show: `docs/talk-outline.md`.

## Decisions (locked)

- **One public repo**, one folder per demo, using pnpm workspaces and TypeScript (strict).
- **AI steps run as headless Claude Code** (`claude -p ...`) pointed at this repo. There's no SDK layer.
- **Gemini Decision 1** is used in Demo 3 only, as the one checker that isn't an agent. It's called by a short direct script (~50 lines) against the Gemini Decisions API. Model id: `gemini-decision-1`. It's a preview model, released Nov 11, 2026, so pin the version and cache every response.
- **LLM judge (Demo 3):** Claude Sonnet.
- **Demo 2 classifier:** the Claude Code run itself, not Gemini.
- **Demo 1 uses ODSB as-is:** https://github.com/christophhdesign/open-design-system-bench (MIT). It's a pinned GitHub dependency of `demos/1-readiness` (commit `e88f11a`), not a vendored copy. Our only config is `demos/1-readiness/systems.config.json`, passed with `--config`. TypeScript is pinned to 5.x (ODSB's docgen breaks on TS 7). `run` writes runs inside `node_modules`, so copy every finished run into `cache/`.
- **Figma:** create an Acme file with variables in week 1. Export through the Figma MCP or a plugin. The Variables REST API may require an Enterprise plan; verify before relying on it.
- **Out of scope:** Jev (TypeSafe) and the PR gate from the first draft.

## Repo layout

```
acme-talk/
  packages/acme/          tokens, components, rules, AGENTS.md, llms.txt, skill
    tokens/               DTCG JSON: primitive -> semantic -> component
    acme.rules.json       usage rules + the 7 error categories (single source of truth)
  demos/1-readiness/      ODSB (pinned git dep) + Acme systems.config.json
  demos/2-token-sync/     Claude Code skill + prompt, Style Dictionary build
  demos/3-adherence/      lint rules, judge prompt, Decision 1 script, scoreboard
    corpus/               30 TSX files + answers.json (see corpus/ERRORS.md). Kept out of packages/acme so agents in ODSB runs can't read the answer key.
  docs/                   build plan, talk outline, kickoff prompt
```

## Conventions

- `packages/acme/acme.rules.json` is the single source of truth for usage guidance and for the 7 error categories. The linter rules, the Sonnet judge prompt and the Gemini Decision 1 questions are all generated from it or must match it. Never define categories anywhere else.
- **Ground truth is sacred.** Each corpus file has exactly 0 or 1 seeded error. Any change to a corpus file must update `corpus/answers.json` in the same commit.
- **The corpus must not be too easy.** At least half of the semantic cases (semantic misuse, wrong variant, wrong component) should be subtle. If every checker scores 100%, the demo has no story.
- **Reproducibility over cleverness.** Pin prompts and model versions. Cache every model output that's shown on stage under `demos/*/cache/`. Every demo needs a replay mode that reads from the cache.
- **Report only measured numbers.** Latency and cost figures from vendors are claims, not results.
- Acme components must have typed props that react-docgen-typescript can read (ODSB uses the `docgen` catalog strategy), plus a foundations CSS file.
- Acme ships in **two states** for Demo 1:
  - *before*: no AGENTS.md, no skill, thin docs
  - *after*: AGENTS.md, an Acme skill, and the rules file linked as docs

  Switch between them with a flag, not by editing files on stage. `packages/acme` is the *after* state. `demos/1-readiness/scripts/make-before.mjs` copies it to `demos/1-readiness/.before/acme` (gitignored) without the files listed in `demos/1-readiness/before-state.json`, and ODSB audits both as systems `acme-before` and `acme`. Every new agent-context file must be added to `before-state.json`.

  Commands (from `talks/acme-talk`): `pnpm readiness` (build tokens, extract, audit both), `pnpm readiness:before`, `pnpm readiness:after`. Measured Nov 18: before 45.9, after 69.9 (both Invested).

## Token naming notes

- The starting state deliberately has `color.danger.*`, not `color.feedback.error.*`, and has no `color.feedback.info`. Demo 2's live change renames `color.danger` → `color.feedback.error`, changes `space.3` from 12 to 14, and adds `color.feedback.info`. Don't "fix" these ahead of time.
- `color.brand.*` is for brand expression only. Using it on error or status UI is a seeded semantic-misuse trap.
- Known starting-state inconsistencies (intentional, fix later as part of the demos; don't fix ahead of time):
  - `alert.danger.*` in `component.json` and `token-danger-for-errors` / Input guidance in `acme.rules.json` reference `color.danger.*` directly. Demo 2's rename must update them, or the build breaks.
  - `token-text-secondary-surface` says `text.secondary` fails on "tinted, subtle" surfaces; the token description (and the math: ~4.4:1 tinted, ~4.6:1 subtle) says only tinted fails.

## Schedule

| Due | Milestone |
|-----|-----------|
| Nov 22 | Acme committed in its before and after states; ODSB `doctor` passes; LLM judge test-run once on the corpus |
| Nov 25 | Before/after audit scores + a cached `small` ODSB run (finish before Thanksgiving, Nov 26) |
| Dec 2 | `pnpm bench` produces the Demo 3 scoreboard |
| Dec 4 | Token sync demoable |
| Dec 7 | Three recorded backups, deck done, two timed run-throughs under 28 min (2 min Q&A buffer) |

## Current status

The planning is done. Starter files exist for tokens, rules and the corpus spec. **Next step: the day-1 spike** in `docs/kickoff-prompt.md`.
