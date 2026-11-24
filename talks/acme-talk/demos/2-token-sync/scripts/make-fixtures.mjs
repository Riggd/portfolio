// Regenerates fixtures/export-before.json (what the Figma file holds when seeded from the repo)
// and fixtures/export-after.json (the three demo edits applied). The edits mirror figma/demo-changes.js.
import fs from 'node:fs';
import path from 'node:path';
import { DEMO_DIR, loadRepo } from '../lib/tokens.mjs';

const { tokens } = loadRepo();
const toVar = (name, t) => ({
  name: name.split('.').join('/'),
  collection: t.tier === 'primitive' ? 'Primitive' : 'Semantic',
  type: t.type === 'color' ? 'COLOR' : 'FLOAT',
  ...(t.tier === 'semantic' && t.description ? { description: t.description } : {}),
  value: t.value && t.value.alias ? { alias: t.value.alias.split('.').join('/') } : t.value,
});
const before = Object.entries(tokens).map(([n, t]) => toVar(n, t));
const wrap = (variables) => ({
  version: 1,
  source: 'figma-mcp',
  collections: [{ name: 'Primitive', modes: ['Default'] }, { name: 'Semantic', modes: ['Default'] }],
  variables,
});

// Demo edits: rename color.danger -> color.feedback.error, space.3 12 -> 14, add color.feedback.info.
const after = before
  .map((v) => ({ ...v }))
  .map((v) => (v.name.startsWith('color/danger/') ? { ...v, name: v.name.replace('color/danger/', 'color/feedback/error/') } : v))
  .map((v) => (v.name === 'space/3' ? { ...v, value: 14 } : v));
for (const k of ['fg', 'bg', 'border']) {
  after.push({ name: `color/feedback/info/${k}`, collection: 'Semantic', type: 'COLOR', value: { alias: `color/blue/${{ fg: 700, bg: 50, border: 500 }[k]}` } });
}

fs.mkdirSync(path.join(DEMO_DIR, 'fixtures'), { recursive: true });
fs.writeFileSync(path.join(DEMO_DIR, 'fixtures/export-before.json'), JSON.stringify(wrap(before), null, 1) + '\n');
fs.writeFileSync(path.join(DEMO_DIR, 'fixtures/export-after.json'), JSON.stringify(wrap(after), null, 1) + '\n');
console.log(`before: ${before.length} variables, after: ${after.length} variables`);
