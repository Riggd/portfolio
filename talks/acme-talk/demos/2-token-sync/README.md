# Demo 2: Token sync + change classifier

Figma variables -> DTCG diff -> `claude -p` classifies each change and writes the release notes -> tokens written back -> Style Dictionary build -> PR.

The sync is a script. The model only answers what a script can't settle: is a removed + added pair a rename, is the change breaking, what semver does it carry.

## Run it

```bash
pnpm install                                    # from talks/acme-talk (run everything below from there)
pnpm sync:replay -- --figma fixtures/export-after.json   # cached model output, no API calls
pnpm sync -- --figma fixtures/export-after.json          # live claude -p run (claude CLI must be logged in)
pnpm sync                                       # reads figma/export.json (a fresh export from Figma)
```

Outputs land in `out/` (gitignored): `diff.json`, `classification.json`, `CHANGELOG.md`. The cached copies are in `cache/`.

| Flag | Effect |
|---|---|
| `--figma <file>` | Figma export to sync from. Default `figma/export.json` |
| `--replay` | Use `cache/classification.json` instead of calling the model. Fails if the diff changed (`--force` overrides) |
| `--save-cache` | Copy this run's outputs into `cache/` |
| `--no-apply` | Stop after writing `out/`. Repo untouched |
| `--no-build` | Skip the Style Dictionary build |
| `--init` | Reset `sync-state.json` (the last-synced baseline) to the repo as it is now |

`pnpm pr -- --dry-run` previews the branch, title and PR body. Without `--dry-run` it creates a `token-sync/...` branch, commits, pushes and runs `gh pr create`.

## The demo (about 5 min)

1. In the Figma file, rename `color.danger` to `color.feedback.error`, change `space.3` from 12 to 14, add `color.feedback.info` (`figma/demo-changes.js` does all three through the Figma MCP).
2. Export the variables (`figma/export-snippet.js`) to `figma/export.json`.
3. `pnpm sync`. Show the classification, then the changelog.
4. Reset: run `figma/reset-changes.js` in Figma, then `git checkout -- packages && pnpm sync:init` from `talks/acme-talk`.

Starting state must stay as committed: `color.danger`, `space.3` = 12, no `color.feedback.info`.

## How it works

| Step | File | Model? |
|---|---|---|
| Normalize the Figma export to DTCG-shaped tokens | `lib/tokens.mjs` | no |
| Three-way diff (last sync, code, Figma), rename candidates, usage counts | `lib/diff.mjs` | no |
| Classify changes, write changelog and migration notes | `lib/classify.mjs`, `.claude/skills/token-sync/SKILL.md` | yes |
| Write tokens, propagate confirmed renames, bump version, update `CHANGELOG.md` | `lib/apply.mjs` | no |
| Build | `pnpm --filter @acme/ds tokens` | no |

- **Figma owns** `color.*`, `space.*` and `radius.*` (primitive and semantic tiers). Fonts and the component tier stay in code.
- **Drift:** a token that changed in code but not in Figma since the last sync is reported in `diff.json` and never overwritten.
- **Renames:** references are only rewritten for renames the classifier confirmed. A rename it doesn't confirm lands as remove + add, and the build fails on the dangling references. That is intended.
- **Versioning:** pre-1.0, `major` bumps the minor version and everything else bumps the patch.
- **Figma access:** the Variables REST API is Enterprise-only, so on Pro the export goes through the Figma MCP (`figma/export-snippet.js`). The export has the same shape either way.

Figma file: `Acme DS Tokens` (key `SIZQY463PNr7mGRL59zsS6`).
Plan: `docs/build-plan.md#demo-2-token-sync--change-classifier`
