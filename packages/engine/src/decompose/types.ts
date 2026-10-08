import type {
  EffortEstimate,
  ExecutionNode,
  NodeAnchors,
  NodeKind,
  TraceabilityRow,
  WorkCategory,
} from "../canonical/execution";
import type { ImportedPackage, OperatingModel } from "../canonical/types";

/**
 * An intermediate node: everything the rules can establish from the imported
 * package before classification, effort allocation and package completeness.
 */
export interface NodeDraft {
  id: string;
  title: string;
  objective: string;
  workCategory: WorkCategory;
  kind: NodeKind;
  scope: string;
  sourceIds: string[];
  anchors: NodeAnchors;
  inputs: string[];
  deliverables: string[];
  acceptanceConditions: string[];
  acceptanceSourceIds: string[];
  risks: string[];
  riskSourceIds: string[];
  assumptions: string[];
  assumptionSourceIds: string[];
  roles: string[];
  skills: string[];
  /** Set by the effort allocator from the package's estimate workstreams. */
  effort?: EffortEstimate;
  humanReviewRequired: boolean;
  /** Open backlog items that gate this draft. */
  gatedBy: string[];
  /** Reason the draft exists, used in the generation notes. */
  generatedBy: string;
}

export interface DecomposeInput {
  imported: ImportedPackage;
  revision: number;
  /** Operating-model overrides recorded as user decisions. */
  overrides: { nodeId: string; model: OperatingModel; rationale: string; at: string }[];
  /** Nodes the user removed; they are filtered out of the result. */
  removedNodeIds: string[];
}

export interface DecomposeResult {
  nodes: ExecutionNode[];
  traceability: TraceabilityRow[];
  notes: string[];
  /** Requirements, components, integrations and AI use cases with no node. */
  uncoveredSourceIds: string[];
}
