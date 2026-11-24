// Writes the synced tokens into the repo, rewrites references for confirmed renames, and cuts a changelog entry.
import fs from 'node:fs';
import path from 'node:path';
import { ACME, applyToDocs, writeTier } from './tokens.mjs';

const DOC_FILES = ['acme.rules.json', 'AGENTS.md', 'llms.txt', '.claude/skills/acme/SKILL.md', 'tokens/component.json', 'tokens/semantic.json', 'tokens/primitive.json'];
const SRC_EXT = new Set(['.ts', '.tsx', '.css', '.html']);
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function srcFiles(dir = path.join(ACME, 'src'), out = []) {
  for (const e of fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : []) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) srcFiles(p, out);
    else if (SRC_EXT.has(path.extname(e.name))) out.push(path.relative(ACME, p));
  }
  return out;
}
// Every file a rename or token write can touch (also what a rollback restores).
export const refFiles = () => [...DOC_FILES, ...srcFiles()];

// Only renames the classifier confirmed are rewritten. An unconfirmed one is left as remove + add,
// which breaks the build on purpose so a person sees it.
export function confirmedRenames(classification) {
  return classification.changes.filter((c) => c.change_type === 'rename' && c.to && !c.is_drift).map((c) => ({ from: c.tokens[0], to: c.to }));
}

export function rewriteRefs(renames) {
  const touched = [];
  for (const rel of refFiles()) {
    const file = path.join(ACME, rel);
    if (!fs.existsSync(file)) continue;
    let text = fs.readFileSync(file, 'utf8');
    const orig = text;
    for (const { from, to } of renames) {
      // {color.danger.bg}, `color.danger.*`, "color.danger" in docs and rules
      text = text.replace(new RegExp(`(?<![\\w.-])${esc(from)}(?=[.\\s}*\`),:;"]|$)`, 'g'), to);
      // tokens.color.danger.fg and values.color.danger.fg in TypeScript
      text = text.replace(new RegExp(`(?<=\\b(?:tokens|values)\\.)${esc(from)}(?![\\w-])`, 'g'), to);
      // var(--color-danger-fg): the old name may be followed by a further segment
      text = text.replace(new RegExp(`--${esc(from.replace(/\./g, '-'))}(?![A-Za-z0-9_])`, 'g'), `--${to.replace(/\./g, '-')}`);
    }
    if (text !== orig) { fs.writeFileSync(file, text); touched.push(rel); }
  }
  return touched;
}

// Style Dictionary does not look at CSS or TypeScript, so check for old names that survived a rename.
export function staleRefs(renames) {
  const stale = [];
  for (const rel of refFiles()) {
    const file = path.join(ACME, rel);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, 'utf8');
    for (const { from } of renames) {
      const dotted = new RegExp(`(?<![\\w.-])${esc(from)}(?![\\w-])`);
      const tsPath = new RegExp(`\\b(?:tokens|values)\\.${esc(from)}(?![\\w-])`);
      const css = new RegExp(`--${esc(from.replace(/\./g, '-'))}(?![A-Za-z0-9_])`);
      if (dotted.test(text) || tsPath.test(text) || css.test(text)) stale.push(`${rel}: ${from}`);
    }
  }
  return stale;
}

export function applyTokens(docs, diff) {
  applyToDocs(docs, { removed: diff.removed, added: diff.added, changed: diff.changed });
  for (const tier of Object.keys(docs)) writeTier(tier, docs[tier]);
}

export function nextVersion(semver) {
  const pkg = JSON.parse(fs.readFileSync(path.join(ACME, 'package.json'), 'utf8'));
  const [maj, min, pat] = pkg.version.split('.').map(Number);
  // Pre-1.0: breaking changes bump the minor, everything else bumps the patch.
  const next = maj >= 1 ? (semver === 'major' ? [maj + 1, 0, 0] : semver === 'minor' ? [maj, min + 1, 0] : [maj, min, pat + 1])
    : (semver === 'major' ? [maj, min + 1, 0] : [maj, min, pat + 1]);
  return next.join('.');
}

export function writeVersion(version) {
  const pkgPath = path.join(ACME, 'package.json');
  fs.writeFileSync(pkgPath, fs.readFileSync(pkgPath, 'utf8').replace(/"version":\s*"[^"]+"/, `"version": "${version}"`));
}

export function changelogEntry(version, classification) {
  return [`## ${version}`, '', classification.changelog_md.trim(), ...(classification.migration_notes_md.trim() ? ['', '### Migration', '', classification.migration_notes_md.trim()] : []), '', ''].join('\n');
}

export function writeChangelog(entry) {
  const file = path.join(ACME, 'CHANGELOG.md');
  const text = fs.readFileSync(file, 'utf8');
  const i = text.indexOf('\n## ');
  // No earlier release yet: append after the title block instead of prepending before it.
  fs.writeFileSync(file, i === -1 ? `${text.trimEnd()}\n\n${entry}` : text.slice(0, i + 1) + entry + text.slice(i + 1));
}

// Everything an apply can touch, so any failure can be rolled back.
export function snapshot() {
  const snap = {};
  for (const rel of [...refFiles(), 'package.json', 'CHANGELOG.md']) {
    const f = path.join(ACME, rel);
    if (fs.existsSync(f)) snap[rel] = fs.readFileSync(f, 'utf8');
  }
  return snap;
}
export function restore(snap) {
  for (const [rel, text] of Object.entries(snap)) fs.writeFileSync(path.join(ACME, rel), text);
}
