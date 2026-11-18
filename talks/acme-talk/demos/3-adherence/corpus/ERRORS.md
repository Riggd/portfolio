# Corpus spec: seeded errors and answer key

The corpus is the ground truth for Demo 3. Every score in the talk is checked against `answers.json`, so this spec is strict.

## Shape

- **30 files** in `demos/3-adherence/corpus/files/`, named `NN-short-slug.tsx` (`01-settings-page.tsx` … `30-…`).
- **20 seeded files:** exactly **one** error each.
- **10 clean files:** zero errors. These measure false positives.
- Each file is a realistic screen or component: 30–120 lines, using Acme components and tokens correctly everywhere except at the seeded error.
- Mix the seeded and clean files in the numbering. Don't put all the clean files at the end.

## Categories

Category ids come from `packages/acme/acme.rules.json` → `categories[]`. Don't invent new ids.

| Category id | Seeded files | Subtle cases (min) | Linter should catch |
|-------------|-------------:|-------------------:|--------------------|
| `hardcoded-value` | 3 | 1 | yes |
| `off-scale-spacing` | 3 | 1 | yes |
| `deprecated-component` | 3 | 1 | yes |
| `contrast-failure` | 2 | 1 | partly |
| `semantic-misuse` | 3 | 2 | no |
| `wrong-variant` | 3 | 2 | no |
| `wrong-component` | 3 | 2 | no |
| **Total** | **20** | **10** | |

## What "subtle" means

A subtle case is one a careful human reviewer could miss on a first read.

- **hardcoded-value:** a hex value inside a template literal or a theme override object, not an inline `style` prop.
- **off-scale-spacing:** `gap: 20` in a Stack style override (20 isn't on the scale), not `padding: 13px`.
- **deprecated-component:** `Card` re-exported through a local barrel file under another name (`import { Panel } from './ui'`, where `./ui` re-exports Card).
- **contrast-failure:** `color.text.secondary` inside a `Surface tone="tinted"` that is two levels up the tree.
- **semantic-misuse:** `color.feedback.success.fg` on a "Saved as draft" message (that's neutral, not success), or `color.brand.primary` on a form-validation hint.
- **wrong-variant:** `variant="destructive"` on "Archive" (reversible), or `variant="primary"` on "Remove member" inside a confirm dialog.
- **wrong-component:** `Badge` used for removable filter tags (should be `Chip`), or a custom `<div role="alert">` with danger tokens instead of `Alert`.

## Seeding workflow

1. Generate a clean base screen against Acme. Check it's clean by running the linter and reading it yourself.
2. Plant exactly one error by hand, following this spec.
3. Add the entry to `answers.json` in the same commit.
4. Never let a model plant errors unsupervised. The answer key has to be exact.

## answers.json format

```json
{
  "version": 1,
  "files": [
    {
      "file": "01-settings-page.tsx",
      "seeded": true,
      "category": "wrong-variant",
      "line": 42,
      "subtle": true,
      "description": "Primary Button on 'Remove member' inside a confirm dialog; should be destructive.",
      "fix": "variant=\"destructive\""
    },
    {
      "file": "02-team-list.tsx",
      "seeded": false,
      "category": null,
      "line": null,
      "subtle": null,
      "description": "Clean.",
      "fix": null
    }
  ]
}
```

## Scoring (Demo 3)

- **Per file, per category:** a checker flags the category or it doesn't. Ground truth comes from `answers.json`.
- **Recall per category:** seeded files of that category the checker flagged ÷ seeded files of that category.
- **Precision per category:** correct flags ÷ all flags in that category, across all 30 files.
- **False-positive rate:** clean files with any flag ÷ 10.
- A flag in the wrong category on a seeded file counts as a miss for the true category and a false positive for the flagged one.
- Line numbers are reported but not scored. Checkers vary too much in how they locate issues.

## Comprehension set

`comprehension.json`: 20 multiple-choice questions, each with 4 options, one correct answer, and an explanation. Draw them from `acme.rules.json` and the tokens, for example:

- "Which token is the background of a destructive Button?" → `color.action.destructive.bg`
- "An 'Archive project' action is reversible. Which Button variant must it NOT use?" → `destructive`
- "Which component replaces Card?" → `Surface`
