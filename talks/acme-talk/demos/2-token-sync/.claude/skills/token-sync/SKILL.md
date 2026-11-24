---
name: token-sync
description: Classify a Figma-to-code design token diff for Acme DS and write the release notes. Use when given a token diff (diff.json) from the token sync pipeline.
---

# Token sync classifier

A script already computed the diff. Do not recompute it. Answer only the questions a script can't settle, then write the release notes.

## Input

A `diff.json` with `added`, `removed`, `changed`, `drift`, `renameCandidates`, `groupRenames` and `usage` (where each affected token is referenced in the Acme package). Read the files in `usage` if you need to confirm how a token is used. Do not edit anything.

## Decide, for each change

1. **change_type**: `rename`, `value_change`, `add`, `remove` or `alias_retarget`.
   - A removed token plus an added token with the same value is only a *candidate* rename. Call it a rename if the names and meaning carry over (same role, same leaf names, a clearer name or location). Call it a remove plus an add if the meaning changed.
   - When `groupRenames` shows a whole group moving, report one change for the group, not one per token.
   - `alias_retarget`: a semantic token now points at a different primitive.
2. **is_breaking**: `true` if code using the old name or contract stops working or changes meaning. Renames and removes are breaking. Adds are not. A value change is breaking only if it changes meaning (for example a contrast failure or an off-scale value), not for a visual tweak.
3. **semver**: `major` for breaking, `minor` for additive, `patch` for a value tweak with no API change. Acme is pre-1.0, so the pipeline maps `major` to a minor version bump. You still report `major`.
4. **is_drift**: `true` only for entries in `drift` (code changed, Figma didn't). Never overwrite drift. List it as a change so a person sees it.
5. **rationale**: one sentence a PM can read. Name the evidence (usage counts, matching values).

Check spacing against the scale in `acme.rules.json` (4/8/12/16/24/32/48). A value off that scale is worth flagging in the rationale and in the notes.

## Write the release notes

- `changelog_md`: the body of one Keep-a-Changelog release, using only `### Added`, `### Changed`, `### Removed` and `### Deprecated` headings that apply. No version heading and no date. One bullet per change. Put token names in backticks. List a rename once, under `### Changed`, and do not repeat it under Removed or Added.
- `migration_notes_md`: for every `major` change, a short before and after the consumer must apply, and which files in `usage` are affected. Use `####` headings, one per breaking change, because the notes sit under a `### Migration` heading. Empty string if nothing is breaking.

Write plainly. No marketing language.

## Output

Return only the JSON object that matches the schema you were given. Each change needs a stable `id` (`c1`, `c2`, ...). For a `rename`, set `tokens` to the old name (a token or a group) and `to` to the new one. For other types, `to` is an empty string.
