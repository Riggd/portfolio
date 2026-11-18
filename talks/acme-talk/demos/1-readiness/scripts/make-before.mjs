// Builds Acme's "before" state: a copy of packages/acme without agent context.
// Output: demos/1-readiness/.before/acme (gitignored). Runs before every extract,
// so the before state always has the same components and tokens as the after state.
import { cpSync, existsSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const demoDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(demoDir, '../../packages/acme');
const dest = join(demoDir, '.before/acme');
const { exclude } = JSON.parse(readFileSync(join(demoDir, 'before-state.json'), 'utf8'));
const skip = new Set([...exclude, 'node_modules']);

if (!existsSync(join(src, 'dist/tokens.css'))) {
  console.error('packages/acme/dist/tokens.css missing. Run `pnpm tokens` first.');
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, {
  recursive: true,
  filter: (path) => {
    const rel = relative(src, path);
    return rel === '' || !skip.has(rel.split(/[\\/]/)[0]);
  },
});
// Share dependencies with the real package so docgen and compile resolve the same way.
symlinkSync(join(src, 'node_modules'), join(dest, 'node_modules'), 'dir');

console.log(`[before] ${relative(process.cwd(), dest)} (excluded: ${exclude.join(', ')})`);
