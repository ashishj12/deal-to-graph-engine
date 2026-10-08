/**
 * Deterministic JSON.
 *
 * Exports must be byte-stable: the same compiled deal has to produce the same
 * file every run, otherwise the tests could not assert preservation and a
 * reviewer could not diff two revisions. Object keys are therefore sorted
 * recursively while array order (which carries meaning: node order, wave order,
 * critical-path order) is preserved.
 */

export function stableStringify(value: unknown, indent = 2): string {
  return JSON.stringify(sortValue(value), null, indent);
}

function sortValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortValue);
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entry]) => entry !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    const out: Record<string, unknown> = {};
    for (const [key, entry] of entries) out[key] = sortValue(entry);
    return out;
  }
  return value;
}
