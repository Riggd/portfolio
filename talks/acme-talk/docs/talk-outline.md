# Talk outline: Where AI fits in the design system lifecycle

30 minutes · AI meetup · audience: designers and PMs · Dec 8, 2026

**Thesis:** Generation is cheap, and judging whether output is right is the hard part of a design system. Use scripts for deterministic work, LLMs and agents for generation, and decision models for bounded judgment calls.

## Run of show

**0:00–3:00 · Hook**
- "Your design system has a new user: agents. They ship faster than a junior designer and read your docs worse."
- The question: how do you know AI output actually follows your system?

**3:00–6:00 · Framework: Generate vs. Decide**
- Lifecycle: Define → Build → Distribute → Adopt → Govern.
- At each stage, split the work three ways: deterministic (scripts), generative (LLMs/agents), judgment (decision models).
- Rule of thumb: deterministic where you can, AI at the judgment points, a human on low-confidence calls.

**6:00–12:00 · Demo 1: Where you are**
- ODSB `audit` on Acme as shipped: the tier and what's missing.
- Add AGENTS.md and a skill, re-audit: show the score change.
- Run report: the same task at each context level.
- PM takeaway: the readiness score is a baseline you track every quarter, like test coverage.

**12:00–17:00 · Demo 2: Token sync**
- Figma change: rename `color.danger` → `color.feedback.error`, `space.3` 12 → 14, add `color.feedback.info`.
- The script syncs; Claude Code classifies (rename vs delete+add, breaking, semver) and writes the changelog.
- PM takeaway: saves release-management time, not design time.

**17:00–25:00 · Demo 3: Adherence bench (finale)**
- Same 30 files, three checkers: linter, Sonnet judge, Gemini Decision 1.
- Scoreboard by category. The point: rules catch syntax, only models catch meaning.
- Decision model vs. agent: typed verdicts with confidence, at a fraction of the latency and cost. Show *measured* numbers only.
- "Demo 1 measures the agents; Demo 3 measures the graders."

**25:00–28:00 · What to try Monday**
1. Run a readiness audit on your system and record the baseline.
2. List your system's closed-set questions; each one is a candidate check.
3. Seed 20 known errors into your own system and measure what gets caught.
4. Pin model versions; thresholds drift when the model behind an alias changes.

**28:00–30:00 · Q&A / buffer**
- Absorbs overrun; cut first if demos run long.

## Stage notes

- Pre-record all three demos. Gemini Decision 1 is in preview.
- If rehearsal runs long, run Demo 3 live and play recordings for 1 and 2.
- Mention that vendor speed and cost claims haven't been independently measured.
