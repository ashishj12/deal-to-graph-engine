/**
 * User decision log (FR4/FR6).
 *
 * Every operator action — adding, removing or editing a node, splitting or
 * merging, approving or rejecting AI output, overriding an operating model,
 * editing a dependency, resolving a blocker, approving the graph — is appended
 * here with its rationale. The log is never rewritten, so the engine can always
 * explain why the graph looks the way it does, and the user is kept strictly
 * separate from both the imported package and the AI recommendations.
 */

import type { DealDecision, DecisionLog, DecisionType } from "../canonical/execution";
import type { OperatingModel } from "../canonical/types";

let sequence = 0;

function nextId(): string {
  sequence += 1;
  return `DECISION_${String(sequence).padStart(3, "0")}`;
}

/** Tests need a deterministic id sequence. */
export function resetDecisionSequence(): void {
  sequence = 0;
}

export interface DecisionInput {
  type: DecisionType;
  rationale: string;
  targetNodeIds?: string[];
  targetEdgeIds?: string[];
  before?: unknown;
  after?: unknown;
  summary: string;
  at: string;
}

export function createDecision(input: DecisionInput): DealDecision {
  const createsContent = input.type === "edit-node" || input.type === "resolve-blocker" || input.type === "add-node";
  return {
    id: nextId(),
    type: input.type,
    at: input.at,
    actor: "user",
    targetNodeIds: input.targetNodeIds ?? [],
    targetEdgeIds: input.targetEdgeIds ?? [],
    rationale: input.rationale,
    before: input.before ?? null,
    after: input.after ?? null,
    provenance: createsContent ? "user-created" : "user-approved",
    summary: input.summary,
  };
}

export function createLog(dealId: string): DecisionLog {
  return { dealId, revision: 0, entries: [], graphApproved: false, approvedAt: null, approvedBy: null };
}

/**
 * Append a decision. Approving the graph is the only action that sets the
 * approval flag; every later change clears it, because a plan that changed after
 * approval is no longer the plan that was approved.
 */
export function appendDecision(log: DecisionLog, decision: DealDecision): DecisionLog {
  const next: DecisionLog = { ...log, revision: log.revision + 1, entries: [...log.entries, decision] };
  if (decision.type === "approve-graph") {
    return { ...next, graphApproved: true, approvedAt: decision.at, approvedBy: "operator" };
  }
  if (decision.type === "revoke-approval") {
    return { ...next, graphApproved: false, approvedAt: null, approvedBy: null };
  }
  return { ...next, graphApproved: false, approvedAt: null, approvedBy: null };
}

/** Operating-model overrides recorded by the operator. */
export interface NodeOverride {
  nodeId: string;
  model: OperatingModel;
  rationale: string;
  at: string;
}

/** Operating-model overrides, newest wins per node. */
export function overridesFrom(log: DecisionLog): NodeOverride[] {
  const map = new Map<string, NodeOverride>();
  for (const entry of log.entries) {
    if (entry.type !== "override-model") continue;
    const next = entry.after as { model?: OperatingModel } | null;
    if (!next?.model) continue;
    for (const nodeId of entry.targetNodeIds) {
      map.set(nodeId, { nodeId, model: next.model, rationale: entry.rationale, at: entry.at });
    }
  }
  return [...map.values()];
}

/** Nodes the operator removed. A later add-node brings the id back. */
export function removedNodesFrom(log: DecisionLog): string[] {
  const removed = new Set<string>();
  for (const entry of log.entries) {
    if (entry.type === "remove-node") for (const id of entry.targetNodeIds) removed.add(id);
    if (entry.type === "add-node") for (const id of entry.targetNodeIds) removed.delete(id);
  }
  return [...removed];
}

export interface NodeEdit {
  nodeId: string;
  field: string;
  value: unknown;
  at: string;
}

/** Field edits, newest wins per (node, field). */
export function nodeEditsFrom(log: DecisionLog): NodeEdit[] {
  const map = new Map<string, NodeEdit>();
  for (const entry of log.entries) {
    if (entry.type !== "edit-node" && entry.type !== "resolve-blocker") continue;
    const after = entry.after as { field?: string; value?: unknown } | null;
    if (!after?.field) continue;
    for (const nodeId of entry.targetNodeIds) {
      map.set(`${nodeId}|${after.field}`, { nodeId, field: after.field, value: after.value, at: entry.at });
    }
  }
  return [...map.values()];
}

export type NodeStatus = "approved" | "rejected" | "blocked" | "review-required";

/** Node status decisions: approve, reject, block, require review. */
export function nodeStatusFrom(log: DecisionLog): { nodeId: string; status: NodeStatus }[] {
  const map = new Map<string, { nodeId: string; status: NodeStatus }>();
  const mapping: Partial<Record<DecisionType, NodeStatus>> = {
    "approve-node": "approved",
    "reject-node": "rejected",
    "mark-blocked": "blocked",
    "mark-review-required": "review-required",
  };
  for (const entry of log.entries) {
    const status = mapping[entry.type];
    if (!status) continue;
    for (const nodeId of entry.targetNodeIds) map.set(nodeId, { nodeId, status });
  }
  return [...map.values()];
}

/** Accepted or rejected AI suggestions, by suggestion id. */
export function suggestionStatusFrom(log: DecisionLog): Map<string, "accepted" | "rejected"> {
  const map = new Map<string, "accepted" | "rejected">();
  for (const entry of log.entries) {
    const after = entry.after as { suggestionId?: string; suggestionStatus?: "accepted" | "rejected" } | null;
    if (!after?.suggestionId) continue;
    const status = after.suggestionStatus ?? (entry.type === "reject-node" ? "rejected" : "accepted");
    map.set(after.suggestionId, status);
  }
  return map;
}

export interface UserNodePart {
  title: string;
  objective: string;
  workCategory: string;
  sourceIds: string[];
}

export interface UserNodeSpec {
  /** `add`, `split` or `merge`: how the operator created this node. */
  mode: "add" | "split" | "merge";
  /** Existing node this was derived from, for split and merge. */
  derivedFrom: string[];
  parts: UserNodePart[];
  at: string;
  rationale: string;
}

/** user-created nodes, in the order the operator created them. */
export function userNodesFrom(log: DecisionLog): UserNodeSpec[] {
  const specs: UserNodeSpec[] = [];
  for (const entry of log.entries) {
    if (entry.type !== "add-node" && entry.type !== "split-node" && entry.type !== "merge-nodes") continue;
    const after = entry.after as Partial<UserNodeSpec> | null;
    if (!after?.parts || after.parts.length === 0) continue;
    specs.push({
      mode: entry.type === "add-node" ? "add" : entry.type === "split-node" ? "split" : "merge",
      derivedFrom: entry.targetNodeIds,
      parts: after.parts,
      at: entry.at,
      rationale: entry.rationale,
    });
  }
  return specs;
}

/** Nodes the operator merged away: a merge replaces every input node. */
export function mergedAwayIds(log: DecisionLog): string[] {
  const ids = new Set<string>();
  for (const entry of log.entries) {
    if (entry.type === "merge-nodes" || entry.type === "split-node") {
      for (const id of entry.targetNodeIds) ids.add(id);
    }
  }
  return [...ids];
}

/** The most recent entries first, for the decision-log view. */
export function recentDecisions(log: DecisionLog, limit = 20): DealDecision[] {
  return [...log.entries].reverse().slice(0, limit);
}
