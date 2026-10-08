/**
 * AI orchestration (challenge §AI and Deterministic Logic).
 *
 * AI may suggest: decomposition boundaries, operating models, dependencies,
 * roles and skills, package drafts, acceptance-condition drafts, risks and
 * change-impact explanations.
 *
 * AI may never compute: identifier validation, cycles, duplicates, orphans,
 * coverage, waves, critical path, classification completeness, effort
 * aggregation, quality-gate status or readiness. Those are deterministic and
 * live in `dag/`, `quality/` and `classify/`.
 *
 * Every provider returns schema-validated plain data. Invalid output is rejected
 * and the deterministic result is used instead, so the engine behaves identically
 * whether or not a provider is reachable.
 */

import type { AIProposal } from "./schema";

export interface AIRequestContext {
  dealId: string;
  dealTitle: string;
  /** Prompt version is recorded on every AI-labelled item. */
  promptVersion: string;
  /** Source ids the model was allowed to see. */
  sourceIds: string[];
}

export interface DecomposeRequest extends AIRequestContext {
  /** Deterministic proposal, offered as the baseline the model may refine. */
  baseline: AIProposal[];
  /** Real package fragments, so a suggestion can be traced back to a section. */
  evidence: { id: string; title: string; kind: string; text: string }[];
}

export interface ClassifyRequest extends AIRequestContext {
  nodeId: string;
  nodeTitle: string;
  workCategory: string;
  features: Record<string, number | string | boolean | null>;
  deterministicScores: { model: string; score: number }[];
}

export interface DependencyRequest extends AIRequestContext {
  nodes: { id: string; title: string; workCategory: string; sourceIds: string[] }[];
  deterministicEdges: { source: string; target: string; type: string }[];
}

export interface PackageDraftRequest extends AIRequestContext {
  nodeId: string;
  model: string;
  missingFields: string[];
  evidence: { id: string; title: string; text: string }[];
  baselineDraft: Record<string, string | string[]>;
}

export interface ImpactExplainRequest extends AIRequestContext {
  /** Deterministic impact facts. The model may only re-phrase them. */
  facts: string[];
}

export interface AIResponse<T> {
  proposal: T;
  /** Provider id, mode and prompt version travel with the response. */
  provider: string;
  mode: "mock" | "live";
  model: string | null;
  promptVersion: string;
  /** True when schema validation rejected live output and the fallback was used. */
  fallbackUsed: boolean;
  /** Why a fallback happened, surfaced in the UI instead of being swallowed. */
  fallbackReason: string | null;
  latencyMs: number;
}

export interface ModelRecommendationProposal {
  primary: string;
  alternatives: string[];
  rationale: string[];
}

export interface DependencyProposal {
  source: string;
  target: string;
  type: string;
  rationale: string;
}

/**
 * The five capabilities a provider may offer. Every one of them returns a
 * schema-validated proposal; none of them may compute waves, the critical path,
 * coverage, gate status or readiness.
 */
export interface AIProvider {
  readonly id: string;
  readonly mode: "mock" | "live";
  readonly model: string | null;
  readonly promptVersion: string;
  decompose(request: DecomposeRequest): Promise<AIResponse<AIProposal[]>>;
  recommendModel(request: ClassifyRequest): Promise<AIResponse<ModelRecommendationProposal>>;
  suggestDependencies(request: DependencyRequest): Promise<AIResponse<DependencyProposal[]>>;
  draftPackage(request: PackageDraftRequest): Promise<AIResponse<Record<string, string | string[]>>>;
  explainImpact(request: ImpactExplainRequest): Promise<AIResponse<string>>;
}
