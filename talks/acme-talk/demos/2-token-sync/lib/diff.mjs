// Deterministic three-way diff. No model involved.
//   base  = tokens at the last sync (sync-state.json)
//   code  = tokens in the repo now
//   figma = tokens in the Figma export
// Figma wins, except where only code moved since the last sync (that is drift, and it is reported, not overwritten).
import fs from 'node:fs';
import path from 'node:path';
import { ACME, sameValue } from './tokens.mjs';

const TEXT_EXT = new Set(['.ts', '.tsx', '.css', '.md', '.json', '.txt', '.html']);
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', 'cache']);

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (TEXT_EXT.has(path.extname(e.name)) && e.name !== 'CHANGELOG.md') yield p;
  }
}

// Where is each affected token referenced? Counts dotted names ({space.3}, color.danger.*) and CSS vars (--space-3).
export function findUsage(names) {
  const files = [...walk(ACME)].map((f) => ({ f: path.relative(ACME, f), text: fs.readFileSync(f, 'utf8') }));
  const usage = {};
  for (const name of names) {
    const dotted = new RegExp(`(?<![\\w.-])${name.replace(/\./g, '\\.')}(?![\\w-])`, 'g');
    const css = new RegExp(`--${name.replace(/\./g, '-')}(?![A-Za-z0-9_])`, 'g');
    const hits = [];
    for (const { f, text } of files) {
      const n = (text.match(dotted) || []).length + (text.match(css) || []).length;
      if (n) hits.push({ file: f, count: n });
    }
    if (hits.length) usage[name] = hits;
  }
  return usage;
}

const parentOf = (n) => n.split('.').slice(0, -1).join('.');
const leafOf = (n) => n.split('.').pop();

// The part of a diff that decides what the model is asked. `usage` depends on file contents elsewhere, so it is left out.
export const diffFingerprint = (d) => JSON.stringify({ added: d.added, removed: d.removed, changed: d.changed, drift: d.drift, renameCandidates: d.renameCandidates, groupRenames: d.groupRenames });

export function diffTokens({ base, code, figma }) {
  const names = new Set([...Object.keys(code), ...Object.keys(figma)]);
  const added = {}, removed = {}, changed = {}, drift = {};
  for (const n of names) {
    const c = code[n], f = figma[n], b = base[n];
    if (c && f && sameValue(c, f)) continue;
    // Code moved, Figma still matches the last sync: drift. Leave the code alone.
    if (c && f && b && sameValue(f, b)) { drift[n] = { code: c.value, figma: f.value, base: b.value }; continue; }
    if (c && !f && !b) { drift[n] = { code: c.value, figma: null, base: null }; continue; }
    if (!c && f) added[n] = f;
    else if (c && !f) removed[n] = c;
    else changed[n] = { ...f, previous: c.value };
  }

  // A rename candidate: a removed token and an added token in the same tier that resolve to the same value.
  // Only candidates. Whether it is really a rename is a judgment call for the classifier.
  const renameCandidates = [];
  const usedAdded = new Set();
  for (const [rn, r] of Object.entries(removed)) {
    const matches = Object.entries(added).filter(([an, a]) => a.tier === r.tier && sameValue(a, r) && !usedAdded.has(an));
    const sameLeaf = matches.filter(([an]) => leafOf(an) === leafOf(rn));
    const pick = sameLeaf.length === 1 ? sameLeaf[0] : matches.length === 1 ? matches[0] : null;
    if (pick) {
      usedAdded.add(pick[0]);
      renameCandidates.push({ from: rn, to: pick[0], evidence: sameLeaf.length === 1 ? 'same value and same leaf name' : 'same value' });
    }
  }
  // Group renames: every removed token under G_old maps to a token under the same G_new.
  const byOld = {};
  for (const c of renameCandidates) (byOld[parentOf(c.from)] ??= []).push(c);
  const groupRenames = [];
  for (const [oldG, cs] of Object.entries(byOld)) {
    const newGs = new Set(cs.map((c) => parentOf(c.to)));
    const allRemoved = Object.keys(removed).filter((n) => parentOf(n) === oldG);
    if (newGs.size === 1 && cs.length === allRemoved.length && cs.every((c) => leafOf(c.from) === leafOf(c.to))) {
      groupRenames.push({ from: oldG, to: [...newGs][0], tokens: cs.length });
    }
  }

  const affected = new Set([...Object.keys(removed), ...Object.keys(changed)]);
  return {
    summary: { added: Object.keys(added).length, removed: Object.keys(removed).length, changed: Object.keys(changed).length, drift: Object.keys(drift).length },
    added, removed, changed, drift, renameCandidates, groupRenames,
    usage: findUsage([...affected]),
  };
}
