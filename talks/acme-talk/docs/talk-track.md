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
pnpm readiness
```

> "This is Acme as most teams ship it: typed components, tokens, a little documentation, and nothing written for agents."
>
> "The score is **52.9, Invested tier**."

Walk through three lines only:

| Check | Score | Say |
|---|---|---|
| Catalog quality | 90 | "The components themselves are fine. Typed props go a long way." |
| Enablement surface | 20 | "Nothing tells an agent how to use the system: no AGENTS.md, no skill, no llms.txt." |
| Deprecation | 0 | "If we deprecate something, an agent has no way to know." |

> "Notice what's good and what's missing. The code is readable. What's missing is the context: the why, the when, and the don't."

### 3. Add agent context, re-audit (1:30)

**Show:** `git checkout acme-after` (AGENTS.md, Acme skill, llms.txt, CHANGELOG, `@deprecated` on Card). Don't edit files on stage.

> "Now we add what a new teammate would get on day one: an AGENTS.md, a skill with our usage rules, and a changelog. We don't change a single component."

**Run:** `pnpm readiness`

> "Same components. The score goes from **52.9 to [after score], [tier]**."

### 4. The run report (2:00)

**Show:** cached `small` run report (`demos/1-readiness/cache/`).

> "The audit only checks what's on disk. This next part checks behavior. ODSB gave an agent real tasks, like 'add a way to permanently delete this account'. The task never names a component; the agent has to choose."
>
> "Here's the same task at each context level."

Point at one cell:

> "With no context, the agent [what it did, e.g. used a primary Button for delete]. With the skill, it [what it did, e.g. used destructive and added a confirmation]. That's the difference context makes, and now we can measure it."

### 5. Takeaway (0:30)

> "For PMs: treat this score like test coverage. Record a baseline, track it every quarter, and never ship AI features on top of a system you haven't measured."
>
> "That measures the agents. In the last demo we'll measure the graders."

### Backup

- If anything fails: play the recording in `demos/1-readiness/cache/`.
- If running long: skip step 4 and say "the run report is in the repo."
