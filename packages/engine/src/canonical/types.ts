export const PROVENANCE = [
  "imported",
  "ai-inferred",
  "ai-recommended",
  "user-created",
  "user-approved",
  "deterministic",
] as const;
export type Provenance = (typeof PROVENANCE)[number];

/** Topcoder operating models a delivery node can be classified into. */
export const OPERATING_MODELS = [
  "flexible-talent",
  "challenge",
  "private-pod",
] as const;
export type OperatingModel = (typeof OPERATING_MODELS)[number];

export const READINESS_STATES = [
  "ready",
  "review-required",
  "blocked",
] as const;
export type Readiness = (typeof READINESS_STATES)[number];

export const MATURITY_LEVELS = [
  "execution-candidate",
  "review-required",
  "discovery-required",
  "blocked",
] as const;
export type MaturityLevel = (typeof MATURITY_LEVELS)[number];

export type Severity = "error" | "warning" | "info";

/** The `kind` discriminator carried by every item in `scope.items`. */
export const ITEM_KINDS = [
  "business",
  "functional",
  "nonFunctional",
  "security",
  "integration",
  "data",
  "existingSystem",
  "constraint",
  "technology",
  "persona",
  "gap",
  "question",
  "risk",
  "assumption",
  "dependency",
] as const;
export type ItemKind = (typeof ITEM_KINDS)[number];

/** Namespaces used by the `SourceIndex`. Synthesized namespaces are marked. */
export const SOURCE_NAMESPACES = [
  "scope",
  "capability",
  "enhancement",
  "module",
  "workstream",
  "deliveryPackage",
  "component",
  "domain",
  "integration",
  "aiUseCase",
  "estimateWorkstream",
  "phase",
  "outOfScope",
] as const;
export type SourceNamespace = (typeof SOURCE_NAMESPACES)[number];

export interface SourceOrigin {
  /** JSON path inside the raw package this record came from. */
  path: string;
  sectionId?: string;
  lineStart?: number;
  lineEnd?: number;
  quote?: string;
  /** Re-computed against `input.normalized.lines`; null when not applicable. */
  quoteVerified?: boolean | null;
}

export interface SourceRecord {
  id: string;
  namespace: SourceNamespace;
  kind: string;
  title: string;
  inScope: boolean;
  critical: boolean;
  resolved: boolean | null;
  status: "open" | "resolved" | "closed" | "n/a";
  synthesized: boolean;
  origin: SourceOrigin;
}

/** A `scope.items[]` entry after validation. */
export interface ScopeItem {
  id: string;
  kind: ItemKind | "unknown";
  title: string;
  description: string;
  priority: string;
  provenance: string;
  critical: boolean;
  inScope: boolean;
  resolved: boolean;
  resolution: string;
  review: string;
  relatedIds: string[];
  affectsInputs: string[];
  source: SourceOrigin;
}

export interface ScopeBuckets {
  requirements: ScopeItem[];
  assumptions: ScopeItem[];
  questions: ScopeItem[];
  gaps: ScopeItem[];
  risks: ScopeItem[];
  dependencies: ScopeItem[];
}

export interface Capability {
  id: string;
  name: string;
  /** The capability's prose, read from `scope` (falling back to `description`). */
  description: string;
  priority: string;
  requirementIds: string[];
  /** Dependency *names* from the source package; resolved ids listed separately. */
  dependencyNames: string[];
  resolvedDependencies: string[];
  unresolvedDependencies: string[];
  moduleNames: string[];
  acceptanceConditions: string[];
}

export interface NamedGroup {
  /** Synthesized, namespaced id (e.g. `WSF:claims-intake`) or imported id. */
  id: string;
  name: string;
  synthesized: boolean;
  capabilityIds: string[];
  requirementIds: string[];
  /** Upstream tool hint only. Never used as a classification result. */
  engagementModelHint?: string;
}

export interface ArchitectureComponent {
  id: string;
  area: string;
  logicalComponent: string;
  service: string;
  requirementIds: string[];
  assumptionIds: string[];
}

export interface ArchitectureFlow {
  from: string;
  to: string;
  label: string;
  kind: string;
  valid: boolean;
}

export interface DataDomain {
  id: string;
  name: string;
  classification: string;
  regulated: boolean;
}

export interface Integration {
  id: string;
  name: string;
  pattern: string;
  systemType: string;
  direction: string;
  authentication: string;
  errorHandling: string;
  requirementIds: string[];
}

export interface AiUseCase {
  id: string;
  name: string;
  description: string;
  requirementIds: string[];
}

export interface AiBoundary {
  activity: string;
  type: string;
  reason: string;
  requirementIds: string[];
}

export interface EstimateWorkstream {
  id: string;
  name: string;
  low: number | null;
  likely: number | null;
  high: number | null;
  roles: string[];
  skills: string[];
}

export interface DeliveryPhase {
  id: string;
  name: string;
  workstreamIds: string[];
}

export interface QualityFinding {
  checkId: string;
  checkName: string;
  status: "pass" | "warn";
  message: string;
  provenance: Provenance;
}

/** The normalized superset of the challenge's canonical model. */
export interface CanonicalPackage {
  schemaVersion: string;
  deal: {
    id: string;
    title: string;
    customer: string;
    maturity: string;
    platform: string;
    confidence: string;
    updatedAt: string | null;
  };
  scope: ScopeBuckets;
  functionalScope: {
    capabilities: Capability[];
    modules: NamedGroup[];
    workstreams: NamedGroup[];
    deliveryPackages: NamedGroup[];
    enhancements: NamedGroup[];
    outOfScope: NamedGroup[];
  };
  architecture: {
    platform: string;
    components: ArchitectureComponent[];
    flows: ArchitectureFlow[];
  };
  strategy: {
    dataDomains: DataDomain[];
    integrations: Integration[];
    aiUseCases: AiUseCase[];
    aiBoundaries: AiBoundary[];
  };
  delivery: {
    phases: DeliveryPhase[];
    workstreams: EstimateWorkstream[];
    confidence: string;
    missingInputs: string[];
    totals: { low: number | null; likely: number | null; high: number | null };
  };
  quality: {
    status: string;
    findings: QualityFinding[];
    checksPassed: number;
    checksWarned: number;
  };
  config: {
    cloudPlatform: string;
    expectedUsers: number | null;
    deadline: string | null;
    environments: number | null;
    targetRegions: string[];
  };
}

export interface ValidationIssue {
  id: string;
  severity: Severity;
  code: string;
  message: string;
  path: string;
  sourceIds: string[];
  remediation: string;
}

export interface SectionStatus {
  name: string;
  path: string;
  present: boolean;
  status: "current" | "stale" | "missing" | "unknown";
  reviewed: boolean | null;
  staleReasons: string[];
  scopeVersion: string | null;
}

export interface ValidationReport {
  issues: ValidationIssue[];
  counts: { error: number; warning: number; info: number };
  passed: boolean;
  sections: SectionStatus[];
  /** Each key is an original requirement/architecture id, value is count of references. */
  referenceCounts: Record<string, number>;
}

export interface PlatformConflict {
  detected: boolean;
  claims: { source: string; platform: string; refId?: string }[];
  resolved: boolean;
  summary: string;
}

export interface MaturityReason {
  code: string;
  label: string;
  severity: "critical" | "warning" | "info";
  delta: number;
  sourceIds: string[];
}

export interface MaturityAssessment {
  level: MaturityLevel;
  score: number;
  summary: string;
  reasons: MaturityReason[];
  gatingItems: string[];
  missingCoreInputs: string[];
  counts: {
    openQuestions: number;
    openGaps: number;
    unvalidatedAssumptions: number;
    openRisks: number;
    criticalOpen: number;
    warnChecks: number;
    unreviewedSections: number;
    staleSections: number;
    excludedItems: number;
  };
}

export interface ImportedPackage {
  fileName: string;
  byteLength: number;
  sha256: string;
  /** The frozen original, preserved separately from the normalized model. */
  raw: unknown;
  rawText: string;
  canonical: CanonicalPackage;
  sourceIndex: SourceRecord[];
  report: ValidationReport;
  conflict: PlatformConflict;
  maturity: MaturityAssessment;
}
