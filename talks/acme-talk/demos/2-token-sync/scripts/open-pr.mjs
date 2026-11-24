#!/usr/bin/env node
// After `pnpm sync`: put the result on a fresh branch and open a PR with the classification as the description.
//   node scripts/open-pr.mjs [--dry-run] [--base main]
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { DEMO_DIR, ROOT } from '../lib/tokens.mjs';

const args = process.argv.slice(2);
const dry = args.includes('--dry-run');
const base = args.includes('--base') ? args[args.indexOf('--base') + 1] : 'main';
const read = (f) => fs.readFileSync(`${DEMO_DIR}/out/${f}`, 'utf8');
if (!fs.existsSync(`${DEMO_DIR}/out/classification.json`)) { console.error('Nothing to ship. Run `pnpm sync` first.'); process.exit(1); }

const { classification } = JSON.parse(read('classification.json'));
const version = read('CHANGELOG.md').match(/^## (\S+)/)[1];
const branch = `token-sync/v${version}-${new Date().toISOString().slice(0, 10)}`;
const title = `Sync design tokens from Figma (v${version}, ${classification.overall_semver})`;
const table = ['| Change | Type | Breaking | Semver |', '|---|---|---|---|',
  ...classification.changes.map((c) => `| \`${c.tokens.join('`, `')}\`${c.to ? ` → \`${c.to}\`` : ''} | ${c.change_type} | ${c.is_breaking ? 'yes' : 'no'} | ${c.semver} |`)].join('\n');
const body = [
  'Automated token sync from the Acme DS Tokens Figma file.', '',
  '## Classification', '', table, '',
  ...classification.changes.map((c) => `- **${c.id}**: ${c.rationale}`), '',
  '## Release notes', '', read('CHANGELOG.md'), '',
  '_Classified by `claude -p` with the token-sync skill. Diff, build and file writes are scripted. Review before merging._',
].join('\n');

const git = (...a) => execFileSync('git', a, { cwd: ROOT, stdio: 'inherit' });
if (dry) { console.log(`branch: ${branch}\ntitle:  ${title}\n\n${body}`); process.exit(0); }
git('checkout', '-b', branch);
git('add', 'packages/acme', 'demos/2-token-sync/sync-state.json');
git('commit', '-m', title);
git('push', '-u', 'origin', branch);
const bodyFile = `${DEMO_DIR}/out/pr-body.md`;
fs.writeFileSync(bodyFile, body);
execFileSync('gh', ['pr', 'create', '--base', base, '--head', branch, '--title', title, '--body-file', bodyFile], { cwd: ROOT, stdio: 'inherit' });
