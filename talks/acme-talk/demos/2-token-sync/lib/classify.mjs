import { spawnSync } from 'node:child_process';
import { DEMO_DIR, ACME } from './tokens.mjs';
import { CLASSIFICATION_SCHEMA, validateClassification } from './schema.mjs';

const MODEL = process.env.TOKEN_SYNC_MODEL || 'sonnet';
const TIMEOUT_MS = Number(process.env.TOKEN_SYNC_TIMEOUT_MS) || 180_000;
const HINT = 'Re-run with --replay to use the cached classification.';

// Headless Claude Code run with the token-sync skill. Read-only tools, no session saved.
export function classifyLive(diff) {
  const prompt = [
    'Use the token-sync skill. Classify this token diff and write the release notes.',
    'Return only the JSON that matches the schema.',
    '',
    '```json',
    JSON.stringify(diff, null, 1),
    '```',
  ].join('\n');
  const r = spawnSync(
    'claude',
    ['-p', prompt, '--model', MODEL, '--output-format', 'json', '--json-schema', JSON.stringify(CLASSIFICATION_SCHEMA),
      '--allowedTools', 'Read', 'Grep', 'Glob', '--add-dir', ACME, '--no-session-persistence'],
    { cwd: DEMO_DIR, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, timeout: TIMEOUT_MS },
  );
  if (r.error) {
    if (r.error.code === 'ENOENT') throw new Error(`The claude CLI was not found on PATH. Install it and log in. ${HINT}`);
    if (r.error.code === 'ETIMEDOUT') throw new Error(`claude -p did not finish within ${TIMEOUT_MS / 1000}s. ${HINT}`);
    throw new Error(`Could not run claude: ${r.error.message}. ${HINT}`);
  }
  if (r.status !== 0) throw new Error(`claude -p failed (exit ${r.status}${r.signal ? `, ${r.signal}` : ''}): ${(r.stderr || r.stdout || 'no output').trim()}. ${HINT}`.slice(0, 2000));
  let envelope;
  try { envelope = JSON.parse(r.stdout); } catch { throw new Error(`claude -p returned output that is not JSON: ${r.stdout.slice(0, 200)}. ${HINT}`); }
  if (envelope.is_error) throw new Error(`claude -p reported an error: ${String(envelope.result).slice(0, 500)}. ${HINT}`);
  const body = envelope.structured_output ?? JSON.parse(envelope.result);
  const errs = validateClassification(body);
  if (errs.length) throw new Error(`classification failed validation: ${errs.join('; ')}`);
  return { classification: body, meta: { model: MODEL, cost_usd: envelope.total_cost_usd ?? null, duration_ms: envelope.duration_ms ?? null } };
}
