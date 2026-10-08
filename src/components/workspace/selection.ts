import type { MaturityReason, ScopeItem, ValidationIssue } from "@deal-to-challenge/engine";

/** What the right-hand "Why?" inspector is currently explaining. */
export type Selection =
  | { kind: "issue"; issue: ValidationIssue }
  | { kind: "maturity"; reason: MaturityReason }
  | { kind: "item"; item: ScopeItem };

export type SelectionTarget = Selection | null;
