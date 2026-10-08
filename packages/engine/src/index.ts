/**
 * Public API of the Deal-to-Challenge engine.
 *
 * The engine is pure TypeScript: no React, no DOM, no network in mock mode. Every
 * function takes plain data and returns plain data, so the same code runs in the
 * browser, in the CLI (`bun run samples`) and in the test suite.
 *
 * Pipeline stages:
 *   ingest      raw package text → CanonicalPackage + source index + validation + maturity
 *   decompose   canonical model  → ExecutionNode[] with provenance, anchors, readiness
 *   classify    node features    → weighted operating-model recommendation
 *   packages    node + model     → model-specific execution package
 *   dag         nodes            → edges, waves, critical path, aggregates, findings
 *   impact      before/after     → ChangeImpact for any edited field
 *   quality     graph            → deterministic Ready | Review Required | Blocked gate
 *   decisions   user actions     → append-only decision log
 *   export      graph            → graph JSON, execution plan, packages, ZIP bundle
 *   ai          optional         → AIProvider interface + deterministic MockProvider
 */

/* ------------------------------------------------------------------ model */

export * from "./canonical/types";
export * from "./canonical/execution";
export {
  PROVENANCE_LABELS,
  AI_PROVENANCE,
  USER_PROVENANCE,
  provenanceLabel,
  isAiProvenance,
  isUserProvenance,
  isGrounded,
} from "./canonical/provenance";

/* ----------------------------------------------------------------- ingest */

export { safeParse, type ParseResult } from "./ingest/json";
export { namespaceOf, isWellFormedId, normalizeName } from "./ingest/ids";
export {
  normalizePackage,
  scanReferences,
  type NormalizeResult,
  type StructuralFindings,
  type ReferenceScan,
} from "./ingest/normalize";
export { validatePackage, detectPlatformConflict, type ValidateInput } from "./ingest/validate";
export { assessMaturity, type MaturityInput } from "./ingest/maturity";
export { runImport, sha256Hex, MAX_IMPORT_BYTES } from "./ingest/pipeline";
export {
  inspectZip,
  unzipTextEntries,
  looksLikeZip,
  type ZipEntryInfo,
  type ZipListing,
  type UnzippedTextFile,
  type UnzipResult,
} from "./ingest/zip";

/* ------------------------------------------------------------ decompose */

export { decompose, finaliseReadiness, buildTraceability } from "./decompose";
export type { DecomposeInput, DecomposeResult, NodeDraft } from "./decompose/types";

/* ------------------------------------------------------------- classify */

export { classifyNode, applyOverride, confidenceFrom } from "./classify";
export type { ClassificationInput, ClassificationResult } from "./classify";

/* ------------------------------------------------------------- packages */

export { buildModelPackage, missingModelFields } from "./packages";
export type { PackageContext } from "./packages";
export type {
  ChallengePackage,
  FlexibleTalentPackage,
  ModelPackage,
  PackageBase,
  PrivatePodPackage,
} from "./packages/types";
export { REQUIRED_PACKAGE_FIELDS } from "./packages/types";

/* ------------------------------------------------------------------ dag */

export { buildGraph, recomputeEdges, summariseModels } from "./dag";
export type { BuildGraphInput } from "./dag";
export { buildEdges, buildEdgeDrafts, flowNodeOf, modelMix } from "./dag/edges";
export type { EdgeDraft } from "./dag/edges";
export { computeSchedule, computeCriticalPath, computeAggregates } from "./dag/analysis";
export { validateGraph, findCycles } from "./dag/validate";
export type { GraphValidation, ScheduleResult } from "./dag";

/* --------------------------------------------------------------- impact */

export { diffGraphs } from "./impact";
export type { ImpactInput } from "./impact";

/* -------------------------------------------------------------- quality */

export { runQualityGate } from "./quality";
export type { QualityInput } from "./quality";

/* ------------------------------------------------------------ decisions */

export {
  appendDecision,
  createDecision,
  createLog,
  mergedAwayIds,
  nodeEditsFrom,
  nodeStatusFrom,
  overridesFrom,
  recentDecisions,
  removedNodesFrom,
  resetDecisionSequence,
  suggestionStatusFrom,
} from "./decisions";
export type { DecisionInput, NodeEdit, NodeOverride, NodeStatus } from "./decisions";

/* ----------------------------------------------------------------- export */

export {
  buildBundleFiles,
  packageToJson,
  packageToMarkdown,
  qualityToMarkdown,
  stableStringify,
  toBundleZip,
  toExecutionPlanMarkdown,
  toGraphJson,
  toQualityJson,
  wavesToMarkdown,
  zipFiles,
} from "./export";

/* --------------------------------------------------------------------- ai */

export { MockProvider, createMockProvider, MOCK_NOTICE, MOCK_PROMPT_VERSION } from "./ai";
export {
  validateDecomposition,
  validateDependencies,
  validateModelRecommendation,
  validatePackageDraft,
} from "./ai";
export type {
  AIProvider,
  AIProposal,
  AIRequestContext,
  AIResponse,
  ClassifyRequest,
  DecomposeRequest,
  DependencyProposal,
  DependencyRequest,
  ImpactExplainRequest,
  ModelRecommendationProposal,
  PackageDraftRequest,
  SchemaIssue,
  ValidationResult,
} from "./ai";

/* ---------------------------------------------------------------- compile */

export { compileDeal, applyEdits, mockGenerator, modelScores } from "./compile";
export type { CompileOptions, CompiledDeal, EditRequest } from "./compile";
