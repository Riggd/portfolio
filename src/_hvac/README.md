# `/hvac` — Duct Sizing for DIYers

A self-contained React applet that teaches an amateur DIYer how to size and install
HVAC ductwork. It lives on its own route at **`/hvac`** and shares nothing with the
rest of the site except the web fonts.

```bash
npm start      # dev server with hot reload -> http://localhost:8080/hvac/
npm test       # 17 unit tests for the duct math
npm run build  # production build into public/
```

## Layout

| Path | What it is |
| --- | --- |
| `index.jsx` | Mounts `App` into `#hvac-root` |
| `App.jsx` | Shell: nav, worksheet strip, one view at a time |
| `lib/ductMath.js` | Every calculation in the app. Pure functions |
| `lib/ductMath.test.js` | Checks the math against published reference values |
| `lib/fittings.js` | Fitting equivalent-length data and total effective length |
| `lib/derive.js` | Turns the worksheet into results, in one place |
| `data/lessons.js` | Lesson content as block lists |
| `data/secrets.js` | The expert-secrets cheat sheet |
| `data/quiz.js` | Self-check questions |
| `components/` | `Prose` renders lesson blocks; `Field` and `Results` are the UI primitives |
| `calculators/` | One component per step that has a worksheet |
| `views/` | The two reference screens (secrets, quiz) |
| `styles.scss` | The applet's entire stylesheet |

Two conventions worth keeping if you extend it: lesson content is **data, not markup**
(a new block type is a three-line addition to `components/Prose.jsx`), and all
arithmetic stays in `lib/` so it can be unit tested without a browser.

## How it hooks into the site

The applet touches the rest of the project in exactly **three** places. This is the
whole integration surface, and the list you need in order to remove it.

1. **`src/hvac.njk`** — the page. Front matter only; it sets `permalink: /hvac/index.html`.
2. **`src/_layouts/hvac.njk`** — a minimal layout that loads `hvac.css` and `hvac.js`
   instead of the site bundle.
3. **`src/_11ty/build-assets.js`** — lists `src/_hvac/index.jsx` and `styles.scss` as
   esbuild and Sass entry points, so they compile to `public/assets/{js,css}/hvac.*`.

Plus two housekeeping edits. `.eleventy.js` gains two lines — one so `npm start`
rebuilds when you edit this directory, one so this README does not publish itself as a
page (markdown is a template format, and this directory sits inside Eleventy's input
dir). And `package.json` adds `react`, `react-dom`, and a real `test` script.

## Removing it

### Option 1 — take the page down, keep the code

```bash
rm src/hvac.njk
npm run build
```

The route is gone. Nothing else needs touching — the applet source stays in the repo,
and restoring the page later is just putting that one file back.

### Option 2 — revert the commits (cleanest full removal)

Ask git for the commits rather than trusting a hash written down here. Search by
message, **not** by path — one of them only touched `.eleventy.js`, so
`git log -- src/_hvac` misses it and leaves behind a watch target pointing at the
directory you just deleted:

```bash
git log --oneline -i --grep=hvac        # newest first
```

Then revert them, **newest first**, and reinstall:

```bash
git revert --no-commit <newest> <...> <oldest>
git commit -m "Remove the /hvac duct sizing applet"
npm install
```

If the work was squash-merged, that log shows a single commit and you revert just it.

### Option 3 — remove it by hand

```bash
# 1. Delete the applet and its two page files
rm -rf src/_hvac src/_layouts/hvac.njk src/hvac.njk

# 2. Restore the original single-entry asset builder
git checkout 8e6022f -- src/_11ty/build-assets.js

# 3. Drop the dependencies
npm uninstall react react-dom
```

Then delete the two `src/_hvac` lines from `.eleventy.js` (the `addWatchTarget` call and
the `ignores.add` call), and the `🌬️ The /hvac applet` section from the root
`README.md`. If you want the old placeholder `test` script back, set it to
`echo "Error: no test specified" && exit 1` in `package.json`.

Finally, `npm run build`. It begins with `rimraf public`, so the generated
`hvac.js` and `hvac.css` disappear on their own — there is nothing stale to clean up.

## Notes

- Reverting `build-assets.js` in Option 3 also reverts it for the main site bundle.
  That is intentional: `8e6022f` is the last commit before this applet existed, and the
  file's only other change was being generalised from one hardcoded pair of entry points
  to a list.
- The worksheet persists in `localStorage` under the key `hvac-worksheet`. Removing the
  applet leaves that key behind in the browsers of anyone who used it; it is inert.
- The math is deliberately honest about its simplifications — the room-by-room split is
  area weighted by exposure, not a Manual J load calculation, and fitting losses are
  representative values in the spirit of ACCA Manual D. Both caveats are stated in the
  UI. Keep them there if you edit the content.
