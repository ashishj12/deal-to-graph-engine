/**
 * Shared workspace contracts.
 *
 * The views are presentation only: every action is a callback the shell turns
 * into an append-only decision. No view mutates the graph or the imported
 * package directly, which is what keeps the imported package the primary source
 * and the user decisions the secondary one.
 */

import type {
  ChangeImpact,
  CompiledDeal,
  EditableField,
  EdgeType,
  ExecutionNode,
  OperatingModel,
  WorkCategory,
} from "@deal-to-challenge/engine";
import type { SamplePackage } from "@deal-to-challenge/engine/samples";
import type { ImportedEntry } from "./PackagePicker";

export interface DealEntry extends ImportedEntry {
  /** Imported package + decomposition + graph + gate + packages, recompiled after every decision. */
  compiled: CompiledDeal;
  /** Change-impact report for the most recent decision on this deal. */
  impact: ChangeImpact | null;
}

export interface NodeDraftInput {
  title: string;
  objective: string;
  workCategory: WorkCategory;
  sourceIds: string[];
}

export type NodeStatus = "approved" | "rejected" | "blocked" | "review-required";

export interface Actions {
  /** Import workspace. */
  loadSample: (deal: SamplePackage) => void;
  importFiles: (files: File[]) => void;
  importText: (fileName: string, text: string) => void;
  /** Editing. Every one of these appends a decision and recompiles. */
  edit: (nodeId: string, field: EditableField, value: unknown, rationale: string) => void;
  overrideModel: (nodeId: string, model: OperatingModel, rationale: string) => void;
  setStatus: (nodeId: string, status: NodeStatus, rationale: string) => void;
  decideSuggestion: (nodeId: string, suggestionId: string, accept: boolean, rationale: string) => void;
  addEdge: (source: string, target: string, type: EdgeType, blocking: boolean, rationale: string) => void;
  removeEdge: (edgeId: string, rationale: string) => void;
  addNode: (draft: NodeDraftInput, rationale: string) => void;
  splitNode: (nodeId: string, parts: NodeDraftInput[], rationale: string) => void;
  mergeNodes: (nodeIds: string[], draft: NodeDraftInput, rationale: string) => void;
  removeNode: (nodeId: string, rationale: string) => void;
  approveGraph: (rationale: string) => void;
  revokeApproval: (rationale: string) => void;
  revert: () => void;
  /** Export. */
  exportBundle: () => void;
  exportGraph: () => void;
  exportPlan: () => void;
  exportQuality: () => void;
  exportPackage: (nodeId: string, format: "json" | "markdown") => void;
}

export interface ViewProps {
  entry: DealEntry;
  actions: Actions;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  busy: boolean;
}

/** Find a node, or `null` — the graph is always the source of truth. */
export function nodeById(entry: DealEntry, nodeId: string | null): ExecutionNode | null {
  if (!nodeId) return null;
  return entry.compiled.graph.nodes.find((node) => node.id === nodeId) ?? null;
}

export function downloadText(fileName: string, text: string, type = "text/plain"): void {
  const blob = new Blob([text], { type });
  downloadBlob(fileName, blob);
}

export function downloadBlob(fileName: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  // Revoked on the next tick so the download has started.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
