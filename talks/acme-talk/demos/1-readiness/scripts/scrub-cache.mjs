// Rewrites absolute machine paths in cache/ to repo-relative ones, so cached runs don't leak the
// author's directory layout. Run after copying a finished run into cache/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const demo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.resolve(demo, '../..'); // talks/acme-talk
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const re = new RegExp(`${esc(root)}(/|(?![\\w-]))`, 'g');
let changed = 0;
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(json|html|md)$/.test(e.name)) {
      const t = fs.readFileSync(p, 'utf8');
      const n = t.replace(re, (_, s) => (s === '/' ? './' : '.'));
      if (n !== t) { fs.writeFileSync(p, n); changed++; }
    }
  }
})(path.join(demo, 'cache'));
console.log(`scrub-cache: ${changed} file${changed === 1 ? '' : 's'} rewritten`);
