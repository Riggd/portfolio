#!/usr/bin/env node
// One command: Figma export -> DTCG diff -> claude -p classification -> repo update -> Style Dictionary build.
//   node scripts/sync.mjs [--figma <export.json>] [--replay] [--save-cache] [--no-apply] [--no-build] [--init] [--force]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { DEMO_DIR, ROOT, loadRepo, normalizeFigma } from '../lib/tokens.mjs';
import { diffTokens } from '../lib/diff.mjs';
import { classifyLive } from '../lib/classify.mjs';
import { validateClassification } from '../lib/schema.mjs';
import { applyTokens, confirmedRenames, rewriteRefs, nextVersion, writeVersion, changelogEntry, writeChangelog } from '../lib/apply.mjs';

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n, d) => (args.includes(`--${n}`) ? args[args.indexOf(`--${n}`) + 1] : d);
const P = (...p) => path.join(DEMO_DIR, ...p);
const writeJson = (f, o) => fs.writeFileSync(f, JSON.stringify(o, null, 2) + '\n');
const log = (m) => console.log(m);

const repo = loadRepo();
const statePath = P('sync-state.json');

if (flag('init')) {
  writeJson(statePath, repo.tokens);
  log(`sync-state.json written (${Object.keys(repo.tokens).length} tokens).`);
  process.exit(0);
}

const figmaPath = path.resolve(DEMO_DIR, opt('figma', 'figma/export.json'));
if (!fs.existsSync(figmaPath)) { console.error(`No Figma export at ${figmaPath}. Export it with figma/export-snippet.js, or pass --figma fixtures/export-after.json.`); process.exit(1); }
const figma = normalizeFigma(JSON.parse(fs.readFileSync(figmaPath, 'utf8')));
const base = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : repo.tokens;

fs.mkdirSync(P('out'), { recursive: true });

// 1. Deterministic diff.
const diff = diffTokens({ base, code: repo.tokens, figma });
writeJson(P('out/diff.json'), diff);
const s = diff.summary;
log(`1. diff: +${s.added} added, -${s.removed} removed, ~${s.changed} changed, ${s.drift} drift (${diff.groupRenames.length} group rename candidate${diff.groupRenames.length === 1 ? '' : 's'})`);
if (!s.added && !s.removed && !s.changed && !s.drift) { log('Figma and code are in sync. Nothing to do.'); process.exit(0); }

// 2. Judgment calls: live claude -p run, or replay of a cached run.
const diffHash = crypto.createHash('sha256').update(JSON.stringify(diff)).digest('hex').slice(0, 12);
let classification, meta;
if (flag('replay')) {
  const cached = JSON.parse(fs.readFileSync(P('cache/classification.json'), 'utf8'));
  if (cached.diffHash !== diffHash && !flag('force')) { console.error(`Cached classification is for a different diff (${cached.diffHash}, now ${diffHash}). Re-run live, or pass --force.`); process.exit(1); }
  ({ classification, meta } = cached);
  log(`2. classify: replayed from cache (${meta.model})`);
} else {
  log('2. classify: running claude -p ...');
  ({ classification, meta } = classifyLive(diff));
  const errs = validateClassification(classification);
  if (errs.length) throw new Error(errs.join('; '));
}
writeJson(P('out/classification.json'), { diffHash, meta, classification });
for (const c of classification.changes) log(`   ${c.id} ${c.change_type.padEnd(13)} ${c.tokens.join(', ')}${c.to ? ' -> ' + c.to : ''}  breaking=${c.is_breaking} semver=${c.semver}${c.is_drift ? ' DRIFT' : ''}`);

const version = nextVersion(classification.overall_semver);
const entry = changelogEntry(version, classification);
fs.writeFileSync(P('out/CHANGELOG.md'), entry);
log(`3. changelog: ${version} (${classification.overall_semver}) -> out/CHANGELOG.md`);

if (flag('save-cache')) {
  fs.mkdirSync(P('cache'), { recursive: true });
  for (const f of ['diff.json', 'classification.json', 'CHANGELOG.md']) fs.copyFileSync(P('out', f), P('cache', f));
  writeJson(P('cache/classification.json'), { diffHash, meta, classification });
  log('   saved to cache/');
}
if (flag('no-apply')) { log('--no-apply: repo untouched.'); process.exit(0); }

// 3. Write into the repo.
const renames = confirmedRenames(classification);
applyTokens(repo.docs, diff);
const touched = rewriteRefs(renames);
writeVersion(version);
writeChangelog(entry);
log(`4. applied: tokens written, ${renames.length} rename${renames.length === 1 ? '' : 's'} propagated to ${touched.length} file${touched.length === 1 ? '' : 's'}, version ${version}`);

// New baseline: the repo as it is now, except drift, which keeps its old base so it keeps being flagged.
const after = loadRepo().tokens;
for (const n of Object.keys(diff.drift)) { if (base[n]) after[n] = base[n]; else delete after[n]; }
writeJson(statePath, after);

// 4. Build. Fails loudly if a rename was left half-propagated.
if (!flag('no-build')) {
  const r = spawnSync('pnpm', ['--filter', '@acme/ds', 'run', 'tokens'], { cwd: ROOT, stdio: 'inherit' });
  if (r.status !== 0) { console.error('Style Dictionary build failed.'); process.exit(r.status ?? 1); }
  log('5. build: Style Dictionary OK');
}
