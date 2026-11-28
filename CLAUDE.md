# Portfolio (derekonay.com)

Personal portfolio. Eleventy v3 static site, SCSS, esbuild for JS, deployed on Netlify (plus a Raspberry Pi workflow in `.github/workflows/deploy-rpi.yml`).

## Commands
- `npm install` — install deps
- `npm start` — dev server (`eleventy --serve`)
- `npm run build` — clean `public/` and build
- `npm test` — not configured (placeholder); no linter or type checker exists

## Layout
- `.eleventy.js` — config; input `src`, output `public`, includes `_includes`, layouts `_layouts`
- `src/_11ty/` — shortcodes, filters, `build-assets.js` (esbuild JS + Sass; runs on `eleventy.before`)
- `src/_data/` — global data (github, lastfm, spotify, meta, acmeTalk)
- `src/projects/*.md` — case studies (frontmatter: title, subtitle, role, tags)
- `src/assets/` — passthrough-copied assets
- `netlify/functions/` — `event.js`, `stats.js` (served via `/api/event`, `/api/stats` redirects)
- `talks/acme-talk/` — talk source; built playground and demo report are passthrough-copied from `src/talks/acme-talk/` (see `.eleventy.js`)
- `docs/` — architecture audit notes

## Project rules
- Follow `.agent/rules.md` (design/performance/accessibility standards, asset and commit protocol).
- Asset filenames: lowercase with hyphens; run `bash lowercase-assets.sh` after adding to `src/assets/`. Warn if an image exceeds 500KB.
- New interactive elements need both `:hover` and `:focus-visible` styles.
- `.env` is loaded via dotenv and exposed as global `env`; never commit secrets.

# Personal Working Rules

## Git
- Start every task on a fresh branch off main. Never commit to main.
- Commit in small, logical units. Don't push or open PRs unless asked.

## Planning
- Use plan mode for changes that touch 3+ files, change architecture, or are hard to reverse. Skip it for small, obvious fixes.
- If `tasks/todo.md` exists, write the plan there as checkboxes, check in before implementing, and tick items off as you go. Add a short "Review" section when done.
- If something goes sideways, stop and re-plan. Don't keep pushing.

## Clarifying questions
- Feature work or ambiguous scope: ask before building (use AskUserQuestion).
- Bug reports and failing tests/CI: fix them autonomously. Read logs and errors, find the root cause, then report what you changed.

## Subagents
- Use subagents for broad codebase searches or independent parallel research where only the conclusion matters.
- One focused task per subagent. Don't use them for small lookups you can do directly.

## Verification (required before calling anything done)
- Run the project's tests, linter, and type checker. Report results.
- For behavior changes, compare against main and state what changed.
- If you can't verify something, say so explicitly. Never claim untested work works.

## Code standards
- Smallest change that solves the root cause. No temporary patches or workarounds.
- Touch only what's necessary. No drive-by refactors.
- For non-trivial changes, consider whether a simpler design exists before finalizing. Don't over-engineer simple fixes.

## Lessons
- After I correct you, add a one-line rule to `tasks/lessons.md` (create it if missing) describing the pattern to avoid.
- Read `tasks/lessons.md` at session start if it exists.

## Communication
- Matter-of-fact and actionable. No filler.
- Summarize changes at a high level after each major step.
