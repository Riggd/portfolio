#!/usr/bin/env node
// After `pnpm sync`: put the result on its own branch and open a PR with the classification as the description.
// The PR targets the branch you ran the sync on (or --base), so it shows only the sync, not that branch's history.
//   node scripts/open-pr.mjs [--dry-run] [--base <branch>]
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { DEMO_DIR, ROOT } from '../lib/tokens.mjs';

const args = process.argv.slice(2);
const fail = (m) => { console.error(m); process.exit(1); };
for (const a of args.filter((x) => x.startsWith('--') && x !== '--')) if (!['--dry-run', '--base'].includes(a)) fail(`Unknown flag ${a}. Flags: --dry-run --base <branch>`);
const dry = args.includes('--dry-run');
const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim();
const current = git('rev-parse', '--abbrev-ref', 'HEAD');
let base = current;
if (args.includes('--base')) {
  base = args[args.indexOf('--base') + 1];
  if (!base || base.startsWith('--')) fail('--base needs a branch name');
}
const out = (f) => `${DEMO_DIR}/out/${f}`;
if (!fs.existsSync(out('classification.json')) || !fs.existsSync(out('touched.json'))) fail('Nothing to ship. Run `pnpm sync` first (a --no-apply run does not count).');
if (base === 'HEAD') fail('Detached HEAD. Check out the branch you ran the sync on, or pass --base.');

const { classification } = JSON.parse(fs.readFileSync(out('classification.json'), 'utf8'));
const files = JSON.parse(fs.readFileSync(out('touched.json'), 'utf8'));
const version = fs.readFileSync(out('CHANGELOG.md'), 'utf8').match(/^## (\S+)/)[1];
const stamp = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 12);
const branch = `token-sync/v${version}-${stamp}`;
const title = `Sync design tokens from Figma (v${version}, ${classification.overall_semver})`;
const table = ['| Change | Type | Breaking | Semver |', '|---|---|---|---|',
  ...classification.changes.map((c) => `| \`${c.tokens.join('`, `')}\`${c.to ? ` → \`${c.to}\`` : ''} | ${c.change_type} | ${c.is_breaking ? 'yes' : 'no'} | ${c.semver} |`)].join('\n');
const body = [
  'Automated token sync from the Acme DS Tokens Figma file.', '',
  '## Classification', '', table, '',
  ...classification.changes.map((c) => `- **${c.id}**: ${c.rationale}`), '',
  '## Release notes', '', fs.readFileSync(out('CHANGELOG.md'), 'utf8'), '',
  '_Classified by `claude -p` with the token-sync skill. Diff, build and file writes are scripted. Review before merging._',
].join('\n');

if (dry) { console.log(`base:   ${base}\nbranch: ${branch}\ntitle:  ${title}\nstages: ${files.join(', ')}\n\n${body}`); process.exit(0); }

// The base must exist on the remote, or the PR cannot be opened against it.
try { git('ls-remote', '--exit-code', '--heads', 'origin', base); } catch { fail(`Branch ${base} is not on origin. Push it first, or pass --base.`); }
// Stage only what the sync wrote. Other uncommitted work in the tree stays out of the PR.
git('checkout', '-b', branch);
git('add', '--', ...files);
git('commit', '-m', title);
git('push', '-u', 'origin', branch);
const bodyFile = out('pr-body.md');
fs.writeFileSync(bodyFile, body);
execFileSync('gh', ['pr', 'create', '--base', base, '--head', branch, '--title', title, '--body-file', bodyFile], { cwd: ROOT, stdio: 'inherit' });
