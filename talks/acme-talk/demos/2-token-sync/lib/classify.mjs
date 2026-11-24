import { spawnSync } from 'node:child_process';
import { DEMO_DIR, ACME } from './tokens.mjs';
import { CLASSIFICATION_SCHEMA, validateClassification } from './schema.mjs';

const MODEL = process.env.TOKEN_SYNC_MODEL || 'sonnet';

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
    { cwd: DEMO_DIR, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 },
  );
  if (r.status !== 0) throw new Error(`claude -p failed (${r.status}): ${r.stderr || r.stdout}`.slice(0, 2000));
  const envelope = JSON.parse(r.stdout);
  const body = envelope.structured_output ?? JSON.parse(envelope.result);
  const errs = validateClassification(body);
  if (errs.length) throw new Error(`classification failed validation: ${errs.join('; ')}`);
  return { classification: body, meta: { model: MODEL, cost_usd: envelope.total_cost_usd ?? null, duration_ms: envelope.duration_ms ?? null } };
}
