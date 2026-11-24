// Writes the synced tokens into the repo, rewrites references for confirmed renames, and cuts a changelog entry.
import fs from 'node:fs';
import path from 'node:path';
import { ACME, applyToDocs, writeTier } from './tokens.mjs';

const REF_FILES = ['acme.rules.json', 'AGENTS.md', 'llms.txt', '.claude/skills/acme/SKILL.md', 'tokens/component.json', 'tokens/semantic.json', 'tokens/primitive.json', 'src/foundations.css'];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Only renames the classifier confirmed are rewritten. An unconfirmed one is left as remove + add,
// which breaks the build on purpose so a person sees it.
export function confirmedRenames(classification) {
  return classification.changes.filter((c) => c.change_type === 'rename' && c.to && !c.is_drift).map((c) => ({ from: c.tokens[0], to: c.to }));
}

export function rewriteRefs(renames) {
  const touched = {};
  for (const rel of REF_FILES) {
    const file = path.join(ACME, rel);
    if (!fs.existsSync(file)) continue;
    let text = fs.readFileSync(file, 'utf8');
    const orig = text;
    for (const { from, to } of renames) {
      text = text.replace(new RegExp(`(?<![\\w.-])${esc(from)}(?=[.\\s}*\`),:;"]|$)`, 'g'), to);
      text = text.replace(new RegExp(`--${esc(from.replace(/\./g, '-'))}(?![\\w-])`, 'g'), `--${to.replace(/\./g, '-')}`);
    }
    if (text !== orig) { fs.writeFileSync(file, text); touched[rel] = true; }
  }
  return Object.keys(touched);
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
  fs.writeFileSync(file, text.slice(0, i + 1) + entry + text.slice(i + 1));
}

// Everything an apply can touch, so a failed build can be rolled back.
const SNAPSHOT_FILES = [...REF_FILES, 'package.json', 'CHANGELOG.md'];
export function snapshot() {
  const snap = {};
  for (const rel of SNAPSHOT_FILES) {
    const f = path.join(ACME, rel);
    if (fs.existsSync(f)) snap[rel] = fs.readFileSync(f, 'utf8');
  }
  return snap;
}
export function restore(snap) {
  for (const [rel, text] of Object.entries(snap)) fs.writeFileSync(path.join(ACME, rel), text);
}
