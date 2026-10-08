import { PROVENANCE, type Provenance } from "./types";

/** Display labels used by the UI and by every export. */
export const PROVENANCE_LABELS: Record<Provenance, string> = {
  imported: "Imported",
  "ai-inferred": "AI inferred",
  "ai-recommended": "AI recommended",
  "user-created": "User created",
  "user-approved": "User approved",
  deterministic: "Deterministic",
};

export const AI_PROVENANCE: Provenance[] = ["ai-inferred", "ai-recommended"];
export const USER_PROVENANCE: Provenance[] = ["user-created", "user-approved"];

export function provenanceLabel(provenance: Provenance): string {
  return PROVENANCE_LABELS[provenance] ?? provenance;
}

export function isAiProvenance(provenance: Provenance): boolean {
  return AI_PROVENANCE.includes(provenance);
}

export function isUserProvenance(provenance: Provenance): boolean {
  return USER_PROVENANCE.includes(provenance);
}

export function isGrounded(
  provenance: Provenance,
  sourceIds: readonly string[],
): boolean {
  if (!PROVENANCE.includes(provenance)) return false;
  if (isUserProvenance(provenance)) return true;
  return sourceIds.length > 0;
}
