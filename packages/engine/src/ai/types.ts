import type { AIProposal } from "./schema";

export interface AIRequestContext {
  dealId: string;
  dealTitle: string;
  promptVersion: string;
  sourceIds: string[];
}

export interface DecomposeRequest extends AIRequestContext {
  baseline: AIProposal[];
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
  nodes: {
    id: string;
    title: string;
    workCategory: string;
    sourceIds: string[];
  }[];
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
  facts: string[];
}

export interface AIResponse<T> {
  proposal: T;
  provider: string;
  mode: "mock" | "live";
  model: string | null;
  promptVersion: string;
  fallbackUsed: boolean;
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

export interface AIProvider {
  readonly id: string;
  readonly mode: "mock" | "live";
  readonly model: string | null;
  readonly promptVersion: string;
  decompose(request: DecomposeRequest): Promise<AIResponse<AIProposal[]>>;
  recommendModel(
    request: ClassifyRequest,
  ): Promise<AIResponse<ModelRecommendationProposal>>;
  suggestDependencies(
    request: DependencyRequest,
  ): Promise<AIResponse<DependencyProposal[]>>;
  draftPackage(
    request: PackageDraftRequest,
  ): Promise<AIResponse<Record<string, string | string[]>>>;
  explainImpact(request: ImpactExplainRequest): Promise<AIResponse<string>>;
}
