---
name: asset-normalization
description: Ensure all asset filenames are lowercase and hyphenated
trigger: automatic
---

# Asset Normalization Skill

This skill ensures all asset filenames follow naming conventions and updates references throughout the codebase.

## Purpose

Ensure all asset filenames are lowercase and hyphenated, and update all references to them in source code.

## Trigger Conditions

- **Automatic**: When files are added to `src/assets/`
- **Manual**: Invoked by `/optimize-assets` command or other commands that need asset normalization

## Actions

1. **Run Normalization Script**:
   - Execute `bash lowercase-assets.sh` to rename all files and directories in `src/assets` to lowercase
   - The script handles case-only changes reliably using `git mv` (important for macOS)

2. **Update References**:
   - The script automatically updates all references in `.md` and `.njk` files using Perl regex
   - Converts asset paths to lowercase: `/assets/[path]` → `/assets/[lowercase-path]`

3. **Verification**:
   - Report any files that were renamed
   - Confirm that references have been updated

## Implementation Details

The skill leverages the existing `lowercase-assets.sh` script which:
- Processes files depth-first to handle nested items correctly
- Uses a two-step `git mv` process for case-only changes (required on macOS)
- Updates references in Markdown and Nunjucks files automatically

## Notes

- This skill should be run automatically whenever new assets are added
- The script uses `git mv` so changes are tracked by git
- Always review changes with `git status` and `git diff` before committing
