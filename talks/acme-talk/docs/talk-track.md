# Talk track

What to say and do on stage, demo by demo. Timings follow `talk-outline.md` (30 min).
Use only measured numbers. Placeholders in `[brackets]` get filled from `demos/*/cache/` before rehearsal.

---

## Demo 1: Where you are (ODSB readiness audit)

**Slot:** 6:00–12:00 (6 min) · **Run from:** cache (replay), live only if time allows

**Point to land:** Before you add AI to your design system, measure how well agents already use it.

### 1. Set up (0:30)

> "Before we automate anything, we need a baseline. Agents are already using our design system. They read our code and our docs, and they guess the rest. So the first question is how well they're doing today."
>
> "I'm using an open-source tool called open-design-system-bench, ODSB for short. It does two things. It audits your system for what an agent can read, and it runs real coding tasks and grades the output."

**On screen:** Acme playground, with the Buttons and Alerts.

### 2. Before audit (1:30)

**Run:**
```bash
pnpm readiness:before
```

> "This is Acme as most teams ship it: typed components, tokens, a little documentation, and nothing written for agents."
>
> "The score is **45.9, Invested tier**."

Walk through four lines only:

| Check | Score | Say |
|---|---|---|
| Catalog quality | 90 | "The components themselves are fine. Typed props go a long way." |
| Enablement surface | 20 | "Nothing tells an agent how to use the system: no AGENTS.md, no skill, no llms.txt." |
| Docs greppability | 0 | "There are no docs an agent can search. Everything it knows, it has to guess from the code." |
| Deprecation | 0 | "If we deprecate something, an agent has no way to know." |

> "Notice what's good and what's missing. The code is readable. What's missing is the context: the why, the when, and the don't."

### 3. Add agent context, re-audit (1:30)

**Show:** the four files in `packages/acme/`: `AGENTS.md`, `llms.txt`, `CHANGELOG.md`, `.claude/skills/acme/SKILL.md`. Nothing else differs between before and after. Don't edit files on stage.

> "Now we add what a new teammate would get on day one: an AGENTS.md, a skill with our usage rules, and a changelog. We don't change a single component."

**Run:** `pnpm readiness:after`

> "Same components. The score goes from **45.9 to 69.9**. Enablement goes from 20 to 70, docs from 0 to 100, deprecation from 0 to 40."
>
> "It's still Invested, a tenth of a point under AI-native. What's left isn't documentation: there's no MCP server, the token files aren't in a format tools can detect, and the prop names differ from what models expect. Those are real engineering work, and now we know where to spend it."

### 4. The run report (2:00)

**Show:** `demos/1-readiness/cache/runs/20261118-062703-context-compare/report.html`

> "The audit only checks what's on disk. This next part checks behavior. ODSB gave an agent a real task: 'users can delete their account; add a step so they don't do it by accident.' The task never names a component; the agent has to choose."
>
> "Here's the same task at three context levels."

| | No context | AGENTS.md | Skill |
|---|---:|---:|---:|
| Overall | 83.8 | 84.0 | 84.0 |
| Token discipline | 60 | 100 | 100 |
| Judgment | 66 | 46.75 | 46.75 |
| Time | 49 s | 20 s | 21 s |
| Cost | $0.21 | $0.06 | $0.08 |

> "The total barely moves, but look underneath. With no context, the agent hardcoded widths and borders. With context, every value is a token, and it finished twice as fast at a third of the cost."
>
> "But judgment went *down*. Acme has no Dialog component, and our AGENTS.md says to use Acme components before building custom UI. So the guided agent built an inline confirmation instead of a modal. That's not a docs problem: it's a missing component. The benchmark just told us what to build next."

**Then:** re-run the audit with the run attached.

```bash
pnpm --filter demo-1-readiness run odsb audit --system acme --config systems.config.json --run cache/runs/20261118-062703-context-compare
```

> "With behavior included, Acme scores **82.4: AI-native**. Docs got us close; real agent runs show where we actually stand."

### 5. Takeaway (0:30)

> "For PMs: treat this score like test coverage. Record a baseline, track it every quarter, and never ship AI features on top of a system you haven't measured."
>
> "That measures the agents. In the last demo we'll measure the graders."

### Backup

- If anything fails: play the recording in `demos/1-readiness/cache/`.
- If running long: skip step 4 and say "the run report is in the repo."
