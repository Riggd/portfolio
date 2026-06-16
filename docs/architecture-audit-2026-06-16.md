# Architecture Audit — 2026-06-16

**Branch:** `architecture-audit` (off `stats-enhancements`)
**Status:** Findings only — nothing has been changed yet. For review.

## Overview

Stack: Eleventy 3 (SSG) → `public/`, esbuild for a single JS bundle, Sass for styles, deployed to Netlify with two Netlify Functions (`event.js` / `stats.js`) backed by Netlify Blobs for self-hosted analytics. A second pipeline pushes the same build to a personal Raspberry Pi over SSH/nginx.

---

## 1. Bugs (fix regardless of priority)

- **`deploy-rpi.yml` is almost certainly broken.** It builds with `npm run build` then `scp`s from `./_site/*`, but `.eleventy.js` sets the output dir to `public`, not 11ty's default `_site`. `_site` never exists, so every push to `main` either deploys nothing or the step fails. The workflow's own inline comment admits uncertainty about the source path.
- **No CI test gate.** `npm test` exists and covers `event.js` / `stats.js` well, but neither GitHub Actions workflow nor the Netlify build command (`npm run build` only) runs it. A regression in the tracking functions could ship without any check failing.
- **Dead Spotify integration.** `src/_data/spotify.js` is gitignored (never shared via git), partly commented out, stores OAuth tokens in module-level globals, and has no `/callback` route to ever receive an auth code. `index.md` references it only inside a Nunjucks comment — it's unreachable. Safe to delete.
- **Stale copy in `about.md`**: says the site is "hosted on GitHub Pages." It's actually Netlify + an RPi. Leftover from an earlier deploy setup.

## 2. Architecture risks to track (not urgent, but real)

- **`stats.js` does a full scan on every request.** Each event is its own blob; a stats call lists *and* fetches every blob for every requested day. Fine at current traffic, but there's no rollup/aggregation and no retention/TTL, so both storage and per-request read volume grow unbounded. Worth a daily rollup job before this becomes noticeable.
- **No abuse protection on `/api/event`.** The event-name allowlist is solid, but there's no rate limiting or dedup — anyone can hammer the endpoint with allowed event names and skew stats. Low stakes for a portfolio site; cheap to harden later (e.g. per-IP throttling via a Netlify Edge rate limit).
- **Content/code coupling with no safety net.** Adding a new project or page requires manually updating `ALLOWED_EVENTS` in `event.js` (intentional, acts as a safelist) — but nothing flags it if a new page ships without the allowlist update; tracking just silently 400s for that page.

## 3. Project hygiene

- **Three parallel, already-diverging AI-agent config systems**: `.agent/workflows/`, `.cursor/commands/`, `.cursor/skills/`, plus `.claude/`. Diffed `add-project.md` across `.agent/` and `.cursor/commands/` — they've already drifted (different frontmatter, different instructions; one references a `markdown-scaffold` skill the other doesn't mention). Worth picking one source of truth.
- **`lowercase-assets.sh` is gitignored**, even though `.agent/rules.md` instructs agents to always run it — a fresh clone won't have the script the rules assume exists.
- **No `.env.example`.** Required env vars are scattered across the codebase with no central list: `STATS_TOKEN`, `LASTFM_API`, `LASTFM_USER`, `SPOTIFY_ID`/`SPOTIFY_SECRET` (dead), `URL`, plus `NETLIFY_BUILD_SECRET_ID` as a GitHub Actions secret.
- **Minor `package.json` cruft**: `"main": "index.md"` (meaningless for an unpublished package) and an unused `"git": "^0.1.5"` dependency not referenced anywhere in the codebase.

---

## Open questions for you

1. Is the Raspberry Pi deploy target still wanted? If yes, it needs a real fix (path mismatch); if no, simplest to delete `deploy-rpi.yml` outright.
2. OK to delete the dead Spotify code, or is that integration meant to be revived at some point?
3. Any objection to consolidating `.agent/` + `.cursor/commands/` + `.cursor/skills/` into one set of instructions?

## Suggested priority order

1. Fix or remove `deploy-rpi.yml`.
2. Add `npm test` to the build/CI path.
3. Delete dead Spotify code; fix the GitHub Pages line in `about.md`.
4. Add `.env.example`; drop the `git` dependency and fix the `main` field.
5. Consolidate the triplicated agent-instruction files.
6. Plan a blob retention/rollup strategy before stats data volume grows.
