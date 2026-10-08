/**
 * The execution model: every type the compiler produces after import.
 *
 * Design rules enforced by these types:
 *  - An item is only ever grounded in an imported source id or an approved user
 *    decision. Anything else must say so (`needs-input`, `unsupported`).
 *  - Effort, acceptance conditions and risks are never invented: they carry the
 *    provenance of where they came from, and `null`/empty when the package does
 *    not contain them.
 *  - Classification is a recommendation with a quote-able rationale, never a
 *    silent default.
 */

import type { MaturityLevel, Provenance, Readiness } from "./types";

/** Work categories from the challenge specification. */
export const WORK_CATEGORIES = [
  "discovery",
  "ux-design",
  "frontend",
  "backend-api",
  "integration",
  "data-engineering",
  "ai-implementation",
  "cloud-devops",
  "security",
  "testing",
  "documentation",
  "deployment",
  "technical-review",
] as const;
export type WorkCategory = (typeof WORK_CATEGORIES)[number];

/**
 * Node kinds. A missing contract, unconfirmed assumption, unresolved question or
 * stale section becomes a `discovery`, `clarification` or `approval` node instead
 * of an invented implementation requirement.
 */
export const NODE_KINDS = ["delivery", "discovery", "clarification", "approval"] as const;
export type NodeKind = (typeof NODE_KINDS)[number];

/** Edge types from the challenge specification. */
export const EDGE_TYPES = [
  "blocking-discovery",
  "design-handoff",
  "data-dependency",
  "api-contract",
  "security-gate",
  "model-handoff",
  "approval",
  "sequencing",
] as const;
export type EdgeType = (typeof EDGE_TYPES)[number];

export type Confidence = "high" | "medium" | "low";

/** Why a node is not `ready`. Empty when it is. */
export const READINESS_BLOCKERS = [
  "missing-model",
  "missing-rationale",
  "missing-acceptance",
  "missing-effort",
  "missing-inputs",
  "missing-package-fields",
  "unsupported",
  "dependency-blocked",
  "open-blocker",
  "cycle",
  "human-approval-pending",
] as const;
export type ReadinessBlocker = (typeof READINESS_BLOCKERS)[number];

/** Which upstream source a node was generated from. */
export interface SourceRef {
  id: string;
  /** Where the id came from in the raw package, for the evidence drawer. */
  path: string;
  kind: string;
  title: string;
  quote?: string;
  quoteVerified?: boolean | null;
}

export interface EffortEstimate {
  minimum: number | null;
  maximum: number | null;
  likely: number | null;
  unit: string | null;
  provenance: Provenance;
  sourceIds: string[];
  /** Human-readable note, e.g. which estimate workstream supplied the range. */
  basis: string;
}

/** Per-field provenance so a reviewer can see where each claim came from. */
export const NODE_FIELDS = [
  "inputs",
  "deliverables",
  "acceptanceConditions",
  "risks",
  "assumptions",
] as const;
export type NodeField = (typeof NODE_FIELDS)[number];

export interface ModelScore {
  model: "flexible-talent" | "challenge" | "private-pod";
  score: number;
  /** Weighted contributions, so the recommendation can be audited feature by feature. */
  contributions: { feature: string; weight: number; value: number; points: number; evidence: string }[];
}

export interface OperatingModelRecommendation {
  primary: ModelScore["model"];
  alternatives: ModelScore["model"][];
  confidence: Confidence;
  /** One plain-English reason per feature that actually moved the decision. */
  rationale: string[];
  sourceIds: string[];
  overridden: boolean;
  overrideHistory: { from: ModelScore["model"]; to: ModelScore["model"]; rationale: string; at: string }[];
  /** Ranked scores for all three models. */
  scores: ModelScore[];
  /** Score gap between the winner and the runner-up, in points. */
  margin: number;
  splitRecommended: boolean;
  splitReason: string | null;
}

/**
 * Where a node came from inside the canonical model. Anchors are stored on the
 * node so its model-specific package can be rebuilt after a user edit without
 * re-decomposing the whole deal.
 */
export interface NodeAnchors {
  capabilityId: string | null;
  workstreamId: string | null;
  phaseId: string | null;
  componentIds: string[];
  integrationIds: string[];
  domainIds: string[];
  aiUseCaseIds: string[];
  requirementIds: string[];
  /** Estimate workstream whose range funds this node's effort. */
  estimateWorkstreamId: string | null;
  /** Backlog item that generated this node, when it is a discovery node. */
  backlogSourceId: string | null;
}

/**
 * A suggestion from the AI layer. Suggestions are never applied silently: each
 * one names the field it would fill and waits for an explicit user decision.
 */
export interface AiSuggestion {
  id: string;
  field: string;
  value: string;
  rationale: string;
  provenance: Provenance;
  provider: string;
  mode: "mock" | "live";
  promptVersion: string;
  sourceIds: string[];
  status: "proposed" | "accepted" | "rejected";
}

export interface ExecutionNode {
  id: string;
  title: string;
  objective: string;
  workCategory: WorkCategory;
  kind: NodeKind;
  /** Free text summarising what is in and out of scope for this node. */
  scope: string;
  sourceIds: string[];
  sourceRefs: SourceRef[];
  inputs: string[];
  deliverables: string[];
  acceptanceConditions: string[];
  dependsOn: string[];
  requiredSkills: string[];
  roles: string[];
  complexity: "low" | "medium" | "high";
  effort: EffortEstimate;
  risks: string[];
  assumptions: string[];
  /** `blocked` when an open gap/question or unconfirmed contract gates this node. */
  blockingStatus: "none" | "blocked" | "gated";
  blockedBy: string[];
  operatingModel: OperatingModelRecommendation;
  provenance: Provenance;
  readiness: Readiness;
  /** Every reason the node is not `ready`, so the UI never guesses. */
  readinessBlockers: ReadinessBlocker[];
  /** Model-specific fields still missing for the selected operating model. */
  modelFieldsMissing: string[];
  /** True when a human must review the output before handoff. */
  humanReviewRequired: boolean;
  fieldProvenance: Record<NodeField, Provenance>;
  acceptanceSourceIds: string[];
  riskSourceIds: string[];
  assumptionSourceIds: string[];
  /** Set when this node came from a user split. */
  splitOf: string | null;
  /** Set when this node came from a user merge. */
  mergedFrom: string[];
  /** Where in the canonical model this node came from. */
  anchors: NodeAnchors;
  /** Labelled AI suggestions awaiting a user decision. */
  aiSuggestions: AiSuggestion[];
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  rationale: string;
  sourceIds: string[];
  blocking: boolean;
  /** The required input or handoff this edge represents. */
  handoff: string;
  provenance: Provenance;
}

export interface Wave {
  /** 1-based longest-path depth. Wave 1 has no predecessors. */
  index: number;
  nodeIds: string[];
  effort: number;
  models: { flexibleTalent: number; challenge: number; privatePod: number };
}

export interface CriticalPath {
  nodeIds: string[];
  effort: number;
  /** Optimistic path over each node's minimum effort. */
  optimisticNodeIds: string[];
  optimisticEffort: number;
  /** Documented and tested tie-break rule. */
  tieBreak: string;
}

export interface GraphAggregates {
  nodeCount: number;
  edgeCount: number;
  waveCount: number;
  totalEffortMin: number;
  totalEffortMax: number;
  totalEffortLikely: number;
  effortUnit: string;
  criticalPathEffort: number;
  durationEstimate: number;
  durationBasis: string;
  parallelGroups: { wave: number; size: number; nodeIds: string[] }[];
  nodesMissingEffort: string[];
  reviewCheckpoints: string[];
  entryNodes: string[];
  terminalNodes: string[];
  orphanNodes: string[];
  blockedNodes: string[];
  unsupportedNodes: string[];
}

export interface OperatingModelSummary {
  flexibleTalent: number;
  challenge: number;
  privatePod: number;
  mixed: boolean;
  modelsUsed: ModelScore["model"][];
}

export interface GeneratorInfo {
  /** `mock` unless a real provider is configured through an environment variable. */
  mode: "mock" | "live";
  provider: string;
  model: string | null;
  promptVersion: string;
  /** Stated in every export so a reviewer can never mistake mock output for live. */
  notice: string;
}

export interface ExecutionGraph {
  schemaVersion: string;
  graphId: string;
  dealId: string;
  dealTitle: string;
  maturity: MaturityLevel;
  revision: number;
  generator: GeneratorInfo;
  nodes: ExecutionNode[];
  edges: GraphEdge[];
  waves: Wave[];
  criticalPath: CriticalPath;
  earliestStart: Record<string, number>;
  aggregates: GraphAggregates;
  operatingModelSummary: OperatingModelSummary;
  /** Structural findings from the DAG validator. */
  findings: GraphFinding[];
  traceability: TraceabilityRow[];
}

export interface GraphFinding {
  id: string;
  code:
    | "cycle"
    | "self-dependency"
    | "duplicate-edge"
    | "invalid-edge"
    | "dangling-node"
    | "orphan-node"
    | "blocked-node"
    | "unsupported-node"
    | "missing-model"
    | "missing-source"
    | "model-handoff";
  severity: "error" | "warning" | "info";
  message: string;
  nodeIds: string[];
  edgeIds: string[];
  /** Populated for cycles: the offending path, in order. */
  cyclePath: string[];
  provenance: Provenance;
}

export interface TraceabilityRow {
  sourceId: string;
  sourceKind: string;
  sourceTitle: string;
  inScope: boolean;
  nodeIds: string[];
  covered: boolean;
}

/* ------------------------------------------------------------------ quality */

export const QUALITY_STATUSES = ["Ready", "Review Required", "Blocked"] as const;
export type QualityStatus = (typeof QUALITY_STATUSES)[number];

export interface QualityGateFinding {
  id: string;
  rule: string;
  /** `pass` findings are kept: a reviewer can see what was checked, not only failures. */
  status: "pass" | "warn" | "fail";
  severity: "error" | "warning" | "info";
  message: string;
  detail: string;
  nodeIds: string[];
  sourceIds: string[];
  /** Always `deterministic` for gate findings: the gate never asks a model. */
  provenance: Provenance;
}

export interface QualityReport {
  status: QualityStatus;
  score: number;
  findings: QualityGateFinding[];
  counts: { pass: number; warn: number; fail: number };
  coverage: { requirements: number; components: number; integrations: number; aiUseCases: number };
  /** Rule ids that forced the status, in evaluation order. */
  gatedOn: string[];
  generatedAt: string;
}

/* ---------------------------------------------------------------- decisions */

export const DECISION_TYPES = [
  "add-node",
  "remove-node",
  "edit-node",
  "split-node",
  "merge-nodes",
  "approve-node",
  "reject-node",
  "mark-blocked",
  "mark-review-required",
  "override-model",
  "add-edge",
  "remove-edge",
  "resolve-blocker",
  "approve-graph",
  "revoke-approval",
  "revert",
] as const;
export type DecisionType = (typeof DECISION_TYPES)[number];

export interface DealDecision {
  id: string;
  type: DecisionType;
  /** ISO timestamp. Decisions are append-only. */
  at: string;
  actor: "user";
  targetNodeIds: string[];
  targetEdgeIds: string[];
  rationale: string;
  before: unknown;
  after: unknown;
  provenance: Extract<Provenance, "user-approved" | "user-created">;
  /** Human-readable one-liner for the decision log view. */
  summary: string;
}

export interface DecisionLog {
  dealId: string;
  revision: number;
  entries: DealDecision[];
  graphApproved: boolean;
  approvedAt: string | null;
  approvedBy: string | null;
}

/* ------------------------------------------------------- change impact (FR6) */

/** Every field a user is allowed to edit, per FR6. */
export const EDITABLE_FIELDS = [
  "title",
  "scope",
  "workCategory",
  "operatingModel",
  "dependsOn",
  "sourceIds",
  "effort",
  "acceptanceConditions",
  "blockingStatus",
] as const;
export type EditableField = (typeof EDITABLE_FIELDS)[number];

export interface FieldChange {
  nodeId: string;
  field: EditableField;
  before: unknown;
  after: unknown;
}

export interface ChangeImpact {
  dealId: string;
  fromRevision: number;
  toRevision: number;
  changed: FieldChange[];
  affectedNodes: string[];
  /** Unaffected nodes are preserved byte-for-byte by the recompiler. */
  unaffectedNodes: string[];
  preservedExactly: boolean;
  changedEdges: {
    added: string[];
    removed: string[];
    retyped: { id: string; from: EdgeType; to: EdgeType }[];
  };
  invalidatedPackages: string[];
  modelChanges: { nodeId: string; from: string; to: string }[];
  waveChanges: { nodeId: string; from: number; to: number }[];
  criticalPath: { before: string[]; after: string[]; changed: boolean; effortDelta: number };
  effortDelta: number;
  durationDelta: number;
  newlyBlocked: string[];
  newlyReady: string[];
  newlyUnsupported: string[];
  regeneratedNodes: string[];
  /** Deterministic narrative the UI shows, and the AI layer may only re-phrase. */
  summary: string[];
}

/* ------------------------------------------------------------- export (FR7) */

export interface GraphBundleFile {
  path: string;
  kind: "json" | "markdown";
  contents: string;
}
