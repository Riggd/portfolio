// Shared token helpers: flatten DTCG, normalize a Figma variables export, and write DTCG back
// in the same inline style the token files already use.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const DEMO_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ROOT = path.resolve(DEMO_DIR, '../..'); // talks/acme-talk
export const ACME = path.join(ROOT, 'packages/acme');
export const TOKEN_DIR = path.join(ACME, 'tokens');
// Figma owns these top-level groups. Fonts and the component tier stay code-only.
const OWNED = new Set(['color', 'space', 'radius']);
const TIER_FILES = { primitive: 'primitive.json', semantic: 'semantic.json' };

const isLeaf = (v) => v && typeof v === 'object' && !Array.isArray(v) && '$value' in v;
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

function normValue(value, type) {
  if (typeof value === 'string') {
    const m = value.match(/^\{(.+)\}$/);
    if (m) return { alias: m[1] };
    if (type === 'color') return value.toUpperCase();
    if (type === 'dimension') return parseFloat(value);
  }
  return value;
}

function denormValue(entry) {
  const { value, type } = entry;
  if (value && value.alias) return `{${value.alias}}`;
  if (type === 'dimension') return `${value}px`;
  return value;
}

export function flattenDtcg(doc, tier) {
  const out = {};
  const walk = (obj, p, inherited) => {
    for (const [k, v] of Object.entries(obj)) {
      if (k.startsWith('$') || !isObj(v)) continue;
      if (p.length === 0 && !OWNED.has(k)) continue;
      if (isLeaf(v)) {
        const type = v.$type ?? inherited;
        out[[...p, k].join('.')] = { tier, type, value: normValue(v.$value, type), description: v.$description };
      } else walk(v, [...p, k], v.$type ?? inherited);
    }
  };
  walk(doc, [], undefined);
  return out;
}

export function loadRepo() {
  const docs = {};
  const tokens = {};
  for (const [tier, file] of Object.entries(TIER_FILES)) {
    docs[tier] = JSON.parse(fs.readFileSync(path.join(TOKEN_DIR, file), 'utf8'));
    Object.assign(tokens, flattenDtcg(docs[tier], tier));
  }
  return { docs, tokens };
}

// Figma export (see figma/export-snippet.js) -> same flat shape as flattenDtcg.
export function normalizeFigma(exp) {
  const out = {};
  for (const v of exp.variables) {
    const name = v.name.split('/').join('.');
    const type = v.type === 'COLOR' ? 'color' : 'dimension';
    const value = v.value && v.value.alias ? { alias: v.value.alias.split('/').join('.') } : typeof v.value === 'string' ? v.value.toUpperCase() : v.value;
    out[name] = { tier: v.collection.toLowerCase(), type, value, description: v.description };
  }
  return out;
}

export const sameValue = (a, b) => JSON.stringify(a.value) === JSON.stringify(b.value);

// Serializer that matches the repo's style: token leaves inline, groups expanded.
function ser(v, depth) {
  const pad = '  '.repeat(depth);
  const inline = (x) => (Array.isArray(x) ? `[${x.map(inline).join(', ')}]` : JSON.stringify(x));
  if (isLeaf(v)) return `{ ${Object.entries(v).map(([k, x]) => `${JSON.stringify(k)}: ${inline(x)}`).join(', ')} }`;
  const entries = Object.entries(v);
  const ordered = [...entries.filter(([k]) => k.startsWith('$')), ...entries.filter(([k]) => !k.startsWith('$'))];
  const body = ordered.map(([k, x]) => `${pad}  ${JSON.stringify(k)}: ${isObj(x) ? ser(x, depth + 1) : inline(x)}`);
  return `{\n${body.join(',\n')}\n${pad}}`;
}
export const serializeDtcg = (doc) => ser(doc, 0) + '\n';

export function writeTier(tier, doc) {
  fs.writeFileSync(path.join(TOKEN_DIR, TIER_FILES[tier]), serializeDtcg(doc));
}

function prune(doc, segs) {
  const parents = [doc];
  for (const s of segs.slice(0, -1)) parents.push(parents[parents.length - 1][s]);
  delete parents[parents.length - 1][segs[segs.length - 1]];
  for (let i = segs.length - 2; i >= 0; i--) {
    const g = parents[i + 1];
    if (Object.keys(g).some((k) => !k.startsWith('$'))) break;
    delete parents[i][segs[i]];
  }
}

// Apply removed/added/changed flat entries onto the DTCG docs.
export function applyToDocs(docs, { removed, added, changed }) {
  for (const name of Object.keys(removed)) prune(docs[removed[name].tier], name.split('.'));
  for (const [name, entry] of Object.entries({ ...added, ...changed })) {
    const segs = name.split('.');
    let node = docs[entry.tier];
    for (const s of segs.slice(0, -1)) {
      node = node[s] ??= {};
      // Demo scaffolding notes ("No info group in the starting state...") go stale once the group changes.
      if (typeof node.$description === 'string' && /starting state|Demo 2/.test(node.$description)) delete node.$description;
    }
    const prev = node[segs[segs.length - 1]];
    const leaf = { ...(prev && prev.$type ? { $type: prev.$type } : {}), $value: denormValue(entry) };
    if (entry.description) leaf.$description = entry.description;
    node[segs[segs.length - 1]] = leaf;
  }
}
