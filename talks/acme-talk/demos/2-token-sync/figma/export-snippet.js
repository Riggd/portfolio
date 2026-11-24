// Run through the Figma MCP (use_figma) against the Acme DS Tokens file.
// Read-only. Save the returned JSON as figma/export.json.
// (On an Enterprise plan the REST Variables API returns the same data; Pro has no REST access.)
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const vars = await figma.variables.getLocalVariablesAsync();
const byId = Object.fromEntries(vars.map((v) => [v.id, v]));
const colName = Object.fromEntries(cols.map((c) => [c.id, c.name]));
const hex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
const out = vars.map((v) => {
  const col = cols.find((c) => c.id === v.variableCollectionId);
  const raw = v.valuesByMode[col.modes[0].modeId];
  const value = raw && raw.type === 'VARIABLE_ALIAS' ? { alias: byId[raw.id].name } : v.resolvedType === 'COLOR' ? hex(raw) : raw;
  return { name: v.name, collection: colName[v.variableCollectionId], type: v.resolvedType, ...(v.description ? { description: v.description } : {}), value };
});
return { version: 1, source: 'figma-mcp', collections: cols.map((c) => ({ name: c.name, modes: c.modes.map((m) => m.name) })), variables: out };
