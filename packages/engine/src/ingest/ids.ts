import type { SourceNamespace } from "../canonical/types";

/**
 * Namespace detection for imported identifiers.
 *
 * Namespaces never mix: `INT_01` is a requirement while `IF_01` is an
 * interface design, and `WS_01` (an estimate workstream) is a different thing
 * from a functional workstream (which arrives with no id at all and is
 * synthesized as `WSF:<slug>`).
 */
export function namespaceOf(id: string): SourceNamespace {
  if (id.startsWith("MOD:")) return "module";
  if (id.startsWith("ENH:")) return "enhancement";
  if (id.startsWith("EXT:")) return "outOfScope";
  if (id.startsWith("WSF:")) return "workstream";
  if (id.startsWith("PKG:")) return "deliveryPackage";
  if (id.startsWith("WS_PH")) return "phase";

  const prefix = id.split("_")[0] ?? "";
  switch (prefix) {
    case "BR":
    case "FR":
    case "NFR":
    case "SEC":
    case "INT":
    case "DATA":
    case "CON":
    case "SYS":
    case "PER":
    case "TECH":
    case "GAP":
    case "Q":
    case "RSK":
    case "ASM":
    case "DEP":
      return "scope";
    case "CAP":
      return "capability";
    case "ENH":
      return "enhancement";
    case "ARC":
      return "component";
    case "DD":
      return "domain";
    case "IF":
      return "integration";
    case "AIUC":
      return "aiUseCase";
    case "WS":
      return "estimateWorkstream";
    default:
      return "scope";
  }
}

/** True when an id follows the challenge's `PREFIX_NN` convention. */
export function isWellFormedId(id: string): boolean {
  if (id.includes(":")) return true; // synthesized ids are namespaced, not numbered
  return /^[A-Z][A-Z0-9]*(_[A-Z]+)*_\d+$/.test(id) || /^WS_PH_\d+$/.test(id);
}

/** Normalized key for name-based reference resolution. */
export function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
