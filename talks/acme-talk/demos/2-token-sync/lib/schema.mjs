export const CLASSIFICATION_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['changes', 'overall_semver', 'changelog_md', 'migration_notes_md'],
  properties: {
    changes: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'change_type', 'tokens', 'to', 'is_breaking', 'semver', 'is_drift', 'rationale'],
        properties: {
          id: { type: 'string' },
          change_type: { enum: ['rename', 'value_change', 'add', 'remove', 'alias_retarget'] },
          tokens: { type: 'array', items: { type: 'string' } },
          to: { type: 'string' },
          is_breaking: { type: 'boolean' },
          semver: { enum: ['major', 'minor', 'patch'] },
          is_drift: { type: 'boolean' },
          rationale: { type: 'string' },
        },
      },
    },
    overall_semver: { enum: ['major', 'minor', 'patch'] },
    changelog_md: { type: 'string' },
    migration_notes_md: { type: 'string' },
  },
};

// Cheap structural check so a bad model response fails loudly before it touches the repo.
export function validateClassification(c) {
  const errs = [];
  if (!c || !Array.isArray(c.changes)) return ['changes missing'];
  for (const ch of c.changes) {
    for (const k of CLASSIFICATION_SCHEMA.properties.changes.items.required) if (!(k in ch)) errs.push(`${ch.id ?? '?'}: missing ${k}`);
    if (ch.change_type === 'rename' && !ch.to) errs.push(`${ch.id}: rename without "to"`);
  }
  for (const k of ['overall_semver', 'changelog_md', 'migration_notes_md']) if (!(k in c)) errs.push(`missing ${k}`);
  return errs;
}
