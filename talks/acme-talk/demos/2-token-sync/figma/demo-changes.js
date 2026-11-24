// The three on-stage edits, applied in the Acme DS Tokens file through use_figma.
// Idempotent: safe to run twice. Mirrors scripts/make-fixtures.mjs.
const vars = await figma.variables.getLocalVariablesAsync();
const byName = Object.fromEntries(vars.map((v) => [v.name, v]));
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const sem = cols.find((c) => c.name === 'Semantic');
const modeId = sem.modes[0].modeId;

// 1. Rename color.danger -> color.feedback.error
for (const k of ['fg', 'bg', 'border']) {
  const v = byName[`color/danger/${k}`];
  if (v) v.name = `color/feedback/error/${k}`;
}
// 2. space.3: 12 -> 14
const s3 = byName['space/3'];
const prim = cols.find((c) => c.name === 'Primitive');
s3.setValueForMode(prim.modes[0].modeId, 14);
// 3. Add color.feedback.info (fg/bg/border -> blue 700/50/500)
for (const [k, alias] of [['fg', 'color/blue/700'], ['bg', 'color/blue/50'], ['border', 'color/blue/500']]) {
  const name = `color/feedback/info/${k}`;
  if (byName[name]) continue;
  const v = figma.variables.createVariable(name, sem, 'COLOR');
  v.setValueForMode(modeId, { type: 'VARIABLE_ALIAS', id: byName[alias].id });
  v.scopes = ['ALL_FILLS', 'STROKE_COLOR'];
  v.setVariableCodeSyntax('WEB', `var(--${name.replace(/\//g, '-')})`);
}
return 'ok';
