# Kickoff prompt: day-1 spike

Paste the block below into Claude Code from the repo root.

---

Read CLAUDE.md, docs/build-plan.md, and everything in packages/acme/. Then do the day-1 spike. The goal is to find out today whether ODSB can read Acme, before we build all 8 components.

1. **Scaffold the workspace.**
   - Root package.json and pnpm-workspace.yaml already exist; finish them.
   - Set up TypeScript strict, React 18 and Vite in packages/acme.
   - Add Style Dictionary (v4, DTCG format) to build `packages/acme/tokens/*.json` into `dist/tokens.css` (CSS variables) and `dist/tokens.ts`.
2. **Build 2 components only: Button and Alert.**
   - Typed props that react-docgen-typescript can read. Button variants: primary, secondary, destructive, ghost. Alert intents: success, warning, danger. There's no info intent until Demo 2 adds `color.feedback.info`.
   - Style them only with the built CSS variables, using component tokens where they exist.
   - Add `packages/acme/src/foundations.css`, which imports the token CSS.
3. **Fork ODSB.**
   - Clone https://github.com/christophhdesign/open-design-system-bench into `demos/1-readiness/odsb` and remove its .git so it lives in this repo.
   - It uses npm; keep it out of the pnpm workspace.
   - Add an Acme entry to its systems.config.json: source path, `docgen` catalog strategy, foundations CSS, no agent context yet.
4. **Run ODSB `doctor` and `extract` against Acme.**
   - Fix whatever blocks a clean extract of Button and Alert.
   - Run `audit` and save the output to `demos/1-readiness/cache/audit-before-spike.json`.
5. **Report back:**
   - What worked
   - What ODSB needed that wasn't in the plan
   - The audit score and tier
   - Any changes to make to CLAUDE.md or the plan

Constraints:
- Don't rename `color.danger` or add `color.feedback.info`. Those are Demo 2's live changes.
- Don't create the corpus yet.
- Don't add AGENTS.md or skills yet; the "before" state has no agent context.
