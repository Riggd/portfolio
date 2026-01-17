---
name: build-verification
description: Verify build succeeds before commits
trigger: automatic
---

# Build Verification Skill

This skill verifies that the Eleventy build succeeds without errors before allowing commits.

## Purpose

Verify that the build process completes successfully, ensuring no build errors occur before the user commits changes.

## Trigger Conditions

- **Automatic**: Before git commits (via commit protocol)
- **Manual**: Invoked by `/pre-flight` command

## Actions

1. **Run Build Command**:
   - Execute `npm run build` to run the Eleventy build process
   - The build command runs: `rimraf public && eleventy`
   - This cleans the `public/` directory and rebuilds the site

2. **Monitor Build Output**:
   - Capture build output and errors
   - Check for:
     - Build failures
     - Template errors
     - Missing files or assets
     - Syntax errors in Markdown or Nunjucks files
     - SCSS compilation errors
     - JavaScript bundling errors

3. **Report Results**:
   - If build succeeds: Confirm success and allow commit to proceed
   - If build fails:
     - Display error messages
     - Identify the file(s) causing the error
     - Suggest fixes if possible
     - Block commit until errors are resolved

4. **Error Handling**:
   - Parse error messages to identify:
     - File paths with errors
     - Line numbers if available
     - Error types (syntax, missing file, etc.)
   - Provide actionable error messages to the user

## Implementation Details

- Run build in non-interactive mode
- Capture both stdout and stderr
- Parse Eleventy error output format
- Check exit code to determine success/failure

## Build Process

The build process:
1. Removes existing `public/` directory
2. Runs Eleventy to generate static site
3. Processes all Markdown, Nunjucks, SCSS, and JavaScript files
4. Outputs to `public/` directory

## Notes

- Build must succeed before any commit
- This prevents broken builds from being committed
- Part of the commit protocol defined in `.agent/rules.md`
- Can be run manually with `/pre-flight` command for testing
- Build errors should be fixed before proceeding with commit
