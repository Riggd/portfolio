# AI × Design Systems Talk: Build Plan

As of 2026-11-17. Talk date: **Dec 8, 2026**. The live, editable version of this plan is the Claude doc "AI × Design Systems Talk — Build Plan".

## Overview

By Dec 8 we ship one mock design system (Acme DS) and three small demos against it, in the order the talk tells them: measure where you are, automate the token sync, then check generated output against the system's guidance.

| # | Build | What it proves on stage | Done when |
|---|-------|--------------------------|-----------|
| 0 | Acme DS | The subject: a small system with seeded errors and an ODSB config | Tokens, 8 components, agent context, a 30-file corpus and its answer key are committed |
| 1 | Readiness audit (open-design-system-bench) | You can't place AI well until you know how well agents use your system today | Before-and-after audit scores plus one small-run report for Acme |
| 2 | Token sync + change classifier | AI belongs at the judgment points of a sync, not in the pipe | One command turns a Figma variable change into a classified diff, a semver bump and a changelog |
| 3 | Adherence bench | A linter catches syntax; only models catch meaning | One command scores linter, Sonnet judge and Gemini Decision 1 on the corpus and renders a scoreboard |

The PR gate from the first draft is cut. Gemini Decision 1 appears only in Demo 3, as the one checker that isn't an agent. Jev is out of scope.

## Architecture

Everything is built around Acme in one repo. Demo 1 runs ODSB against it unchanged. Demos 2 and 3 run headless Claude Code (`claude -p`) against the repo. The only custom code is Demo 3's short Gemini Decision 1 script.

```
Acme DS (packages/acme)
  Components + AGENTS.md/skill ──> ODSB (pinned) ──> Demo 1 · Readiness audit
  Tokens ───────────────────────────────────────> Demo 2 · Token sync (Claude Code)
  Rules file + Corpus/key ──────────────────────> Demo 3 · Adherence bench ──> Gemini Decision 1 script
```

```
acme-talk/                pnpm workspaces
  packages/acme           tokens, components, rules, corpus, AGENTS.md
  demos/1-readiness       ODSB (pinned git dep) + Acme config
  demos/2-token-sync      Claude Code skill + prompt, Style Dictionary build
  demos/3-adherence       lint rules, judge prompt, Decision 1 script, scoreboard
```

## Build 0: Acme mock design system

Acme is small on purpose. Its value is the corpus: 30 code files with errors we planted ourselves, so every score in the talk is checked against a known answer.

**Tokens.** DTCG JSON in three tiers, already started in `packages/acme/tokens/`:

- Primitive: `color.blue.500`, `space.4`
- Semantic: `color.action.primary.bg`, `color.danger.fg`
- Component: `button.destructive.bg`

The spacing scale is 4 / 8 / 12 / 16 / 24 / 32 / 48 (`space.1` to `space.7`). Style Dictionary builds CSS variables and a TypeScript map from the tokens.

**Components (8).** Button (primary, secondary, destructive, ghost), Input, Surface, Card (deprecated; Surface replaces it), Chip, Alert, Badge, Stack.

**Rules file.** `acme.rules.json` holds the usage guidance for each token and component, plus the 7 error categories. Both the Sonnet judge and Gemini Decision 1 read it as context.

**Corpus.** 30 TSX screens and snippets: 20 with exactly one seeded error and 10 clean, to measure false positives. Generate the base screens against Acme, then plant the errors by hand. `answers.json` records file, line, category and expected verdict for each. The full spec is in `packages/acme/corpus/ERRORS.md`.

| Category | Example | Seeded files | Linter should catch |
|----------|---------|--------------|---------------------|
| Hardcoded value | `#1A73E8` instead of a token | 3 | Yes |
| Off-scale spacing | `padding: 13px` | 3 | Yes |
| Deprecated component | `Card` instead of `Surface` | 3 | Yes |
| Contrast failure | Secondary text token on a tinted surface | 2 | Partly |
| Semantic misuse | `color.brand` on an error Alert | 3 | No |
| Wrong variant | Primary Button on "Delete account" | 3 | No |
| Wrong component | Hand-built div where Chip exists | 3 | No |

Make at least half the semantic cases subtle.

**Comprehension set.** 20 multiple-choice questions with an answer key, such as "Which token is the background of a destructive button?"

**ODSB readiness.** Components need typed props that react-docgen-typescript can read, plus a foundations CSS file. Acme ships in two states:

- **Before:** no AGENTS.md, no skill, thin docs. Target result: Emerging tier.
- **After:** AGENTS.md, an Acme skill, and the rules file linked as docs.

## Demo 1: Where you are (AI-readiness audit)

Before adding AI anywhere, measure how well agents already use the system. Run [open-design-system-bench](https://github.com/christophhdesign/open-design-system-bench) (ODSB) against Acme.

**What ODSB gives us**

- `audit`: seven static checks that need no API key, producing an AI-Readiness Score. The tiers are AI-native (70+), Invested (40+) and Emerging (below 40).
- `run`: a headless agent builds intent-level tasks that never name the expected component. Each output is scored on judgment 0.30, API fidelity 0.25, token discipline 0.15, imports 0.10, static a11y 0.10 and compile 0.10.
- A matrix of model by context level (none, then AGENTS.md, then skills and docs). This matrix is the "where you are" slide.

**Setup**

1. Add Acme to `systems.config.json`: source path, `docgen` catalog strategy, foundations CSS, and agent context files.
2. Run `doctor`, then `extract`.
3. Write 3–4 Acme tasks in `tasks/`, such as "Add a way to permanently delete this account." They double as the corpus's semantic traps.

**Demo script (about 6 min)**

1. Run `audit` on Acme as shipped. Show the tier and what's missing.
2. Add AGENTS.md and the Acme skill, re-audit, and show the score change.
3. Show the `small` run report: the same task at each context level, side by side.

Run everything ahead of time. The `full` profile is 90 cells and runs pause on usage limits, so use `small` (5 cells) and serve it from the cache.

**Done when** Acme has before-and-after audit scores and one `small` run report.

## Demo 2: Token sync + change classifier

The sync stays a script. AI only answers the questions a script can't settle, such as whether a change is a rename or a delete plus an add.

**Pipeline**

1. Export Figma variables to JSON (Figma MCP or a plugin).
2. Normalize to DTCG and diff against `main`. This step is deterministic.
3. Classify each change in a headless Claude Code run (`claude -p` with an Acme skill), which returns JSON per change:
   - `change_type`: rename, value change, add, remove, alias retarget
   - `is_breaking`: yes/no
   - `semver`: major, minor, patch
   - `is_drift`: yes/no (code changed, Figma didn't)
4. Build with Style Dictionary.
5. The same run writes the changelog, plus migration notes for every major change.

**Demo script (about 5 min).** In Figma, rename `color.danger` to `color.feedback.error`, change `space.3` from 12 to 14, and add `color.feedback.info`. Run the sync. Show the classification, then the changelog.

**Talking point for PMs.** This saves release-management time, not design time.

**Done when** one command produces `diff.json`, `classification.json` and `CHANGELOG.md` from a Figma change.

## Demo 3: Adherence bench for generated output

This is the finale. It runs three checkers over the same 30 files and scores each one against `answers.json` by error category.

Demo 1 measures the agents; this demo measures the graders. Without ground truth you can't tell when a grader is wrong, and the seeded corpus provides that ground truth. As an optional add-on, include 5 real agent outputs from Demo 1's runs, graded by hand.

| Checker | How it runs | Output |
|---------|-------------|--------|
| Linter | ESLint + Stylelint custom rules: no raw hex, spacing must be a token, no deprecated imports | Violations by rule |
| Sonnet judge | `claude -p` with Sonnet on each file, plus `acme.rules.json` and a rubric | JSON violations, each with a category |
| Gemini Decision 1 | A short script, one request per file: 7 yes/no questions, one per category, each with a confidence | Verdict + confidence per category |

The Gemini Decision 1 script calls the Decisions API directly. A request can carry up to 1,000 questions, so all 7 categories fit in one call. Agent runs vary from run to run, so fix the judge prompt and cache every output shown on stage.

**Two tracks**

- **Adherence:** catch the seeded errors without flagging the clean files.
- **Comprehension:** answer the 20 multiple-choice questions (Sonnet and Decision 1 only).

**Metrics** written to `results.json`:

- Precision, recall and F1 per category
- False-positive rate on the 10 clean files
- p50 latency and total cost per run
- Confidence against accuracy for Decision 1

Run the Sonnet judge 3 times and report the spread. Run Decision 1 twice to confirm it's stable.

**Scoreboard.** A single HTML page with categories as rows, checkers as columns, and recall in each cell, with latency and cost underneath.

**Hypothesis to test, not to claim:** the linter is near 100% on the first three categories and near 0% on the last three. Show whatever the run actually produces.

**Done when** `pnpm bench` runs end to end, writes `results.json` and renders the scoreboard.

## Schedule

The build doesn't follow talk order. Acme comes first because everything reads from it. The audit comes next because it reuses an existing tool and sets the baseline. The bench is the longest build, so it starts before the token sync.

| Work | Dates |
|------|-------|
| Acme DS + ODSB config | Nov 17 – Nov 22 |
| Demo 1 · Readiness audit | Nov 23 – Nov 25 |
| Demo 3 · Adherence bench | Nov 27 – Dec 2 |
| Demo 2 · Token sync | Nov 30 – Dec 4 |
| Record + rehearse | Dec 5 – Dec 7 |
| **Talk** | **Dec 8** |

- [ ] Nov 22: Acme committed in both states, ODSB `doctor` passes, LLM judge test-run once on the corpus
- [ ] Nov 25: Before/after audit scores and a cached `small` run
- [ ] Dec 2: `pnpm bench` produces the scoreboard
- [ ] Dec 4: Token sync demoable
- [ ] Dec 7: Three recorded backups, deck done, two timed run-throughs under 28 minutes (2 min Q&A buffer)

## Risks and fallbacks

The biggest risk is Gemini Decision 1 itself: it's in preview (since Nov 11, 2026), so access, pricing or the API could change before Dec 8.

| Risk | Mitigation |
|------|------------|
| Preview API changes or rate limits | Pin the model version and cache every result. If it breaks, Demo 3 runs as linter vs Sonnet judge. |
| Latency and cost figures come only from the vendor | Present only numbers we measured ourselves |
| ODSB runs are slow and pause on usage limits | Use the `small` profile, run it before Thanksgiving, present cached reports |
| Acme's components don't extract cleanly with `docgen` | Run `doctor` and `extract` on day 1, before building out all 8 components |
| Corpus too easy, so every checker scores 100% | Make half the semantic cases subtle; test-run the judge in week 1 |
| Figma Variables REST API may need an Enterprise plan (to verify) | Export through the Figma MCP or a plugin instead |
| Live demo fails on stage | Pre-record all three demos; keep a replay mode that reads from the cache |
| Three demos won't fit in 30 minutes | Run Demo 3 live; use the recordings for 1 and 2 if rehearsal runs long |

## Decisions

- LLM judge: Claude Sonnet.
- Repo: one public repo, three demo folders, ODSB installed as a pinned GitHub dependency of `demos/1-readiness`.
- Figma: create an Acme file with variables in week 1.
- Stack: TypeScript with pnpm workspaces, Vite and Style Dictionary.
- Agents: every AI step runs as headless Claude Code (`claude -p`) pointed at the repo. No SDK layer.
- Gemini Decision 1: Demo 3 only, through a short direct API script.
- Demo 2 classifier: the Claude Code run, not Gemini.

## Sources

- [open-design-system-bench](https://github.com/christophhdesign/open-design-system-bench)
- [Google DeepMind launches Gemini Decisions API](https://letsdatascience.com/news/google-deepmind-launches-gemini-decisions-api-for-fast-multi-f88f4710)
- [Gemini Decision 1 on OpenRouter](https://openrouter.ai/google/gemini-decision-1)
- [Gemini Decisions API, Interesting Engineering](https://interestingengineering.com/ai-robotics/google-gemini-decisions-api-fast-ai-agents)
