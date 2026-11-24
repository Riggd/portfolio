// Puts the Acme DS Tokens file back to its starting state after a demo run.
const vars = await figma.variables.getLocalVariablesAsync();
const byName = Object.fromEntries(vars.map((v) => [v.name, v]));
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const prim = cols.find((c) => c.name === 'Primitive');
for (const k of ['fg', 'bg', 'border']) {
  const v = byName[`color/feedback/error/${k}`];
  if (v) v.name = `color/danger/${k}`;
  const info = byName[`color/feedback/info/${k}`];
  if (info) info.remove();
}
byName['space/3'].setValueForMode(prim.modes[0].modeId, 12);
return 'ok';
