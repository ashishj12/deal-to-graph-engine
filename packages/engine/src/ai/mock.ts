import type {
  AIProvider,
  AIResponse,
  ClassifyRequest,
  DecomposeRequest,
  DependencyRequest,
  ImpactExplainRequest,
  PackageDraftRequest,
} from "./types";
import type { AIProposal } from "./schema";
import type { ModelRecommendationProposal } from "./types";
import {
  validateDecomposition,
  validateModelRecommendation,
  validateDependencies,
  validatePackageDraft,
} from "./schema";

export const MOCK_NOTICE = "MOCK AI MODE — no external service was contacted.";

export const MOCK_PROMPT_VERSION = "mock-v1";

function response<T>(proposal: T, started: number): AIResponse<T> {
  return {
    proposal,
    provider: "mock",
    mode: "mock",
    model: null,
    promptVersion: MOCK_PROMPT_VERSION,
    fallbackUsed: false,
    fallbackReason: null,
    latencyMs: Math.max(0, Math.round(performance.now() - started)),
  };
}

export class MockProvider implements AIProvider {
  readonly id = "mock";
  readonly mode = "mock" as const;
  readonly model = null;
  readonly promptVersion = MOCK_PROMPT_VERSION;

  async decompose(
    request: DecomposeRequest,
  ): Promise<AIResponse<AIProposal[]>> {
    const started = performance.now();
    const covered = new Set(
      request.baseline.flatMap((proposal) => proposal.sourceIds),
    );
    const extra: AIProposal[] = request.evidence
      .filter((item) => !covered.has(item.id))
      .slice(0, 8)
      .map((item) => ({
        id: `PROPOSAL_${item.id}`,
        title: `Clarify ${item.title}`,
        objective: `Resolve ${item.id} before dependent delivery work is sequenced: ${item.text.slice(0, 180)}`,
        workCategory: "discovery",
        kind: "clarification",
        sourceIds: [item.id],
        rationale: `${item.kind} ${item.id} appears in the imported package and is not yet covered by a generated node.`,
      }));
    const proposal = [...request.baseline, ...extra];
    const validation = validateDecomposition(proposal);
    return response(validation.ok ? proposal : request.baseline, started);
  }

  async recommendModel(
    request: ClassifyRequest,
  ): Promise<AIResponse<ModelRecommendationProposal>> {
    const started = performance.now();
    const ranked = [...request.deterministicScores].sort(
      (a, b) => b.score - a.score,
    );
    const primary = ranked[0]?.model ?? "private-pod";
    const alternatives = ranked
      .slice(1)
      .filter((entry) => entry.score >= (ranked[0]?.score ?? 0) * 0.55)
      .map((entry) => entry.model);
    const probe = {
      primary,
      alternatives,
      rationale: [
        `Deterministic feature scores place ${primary} first for ${request.nodeId}.`,
        `Work category ${request.workCategory} with ${request.sourceIds.length} source reference(s).`,
      ],
    };
    const validation = validateModelRecommendation(probe);
    return response(
      validation.ok && validation.value ? validation.value : probe,
      started,
    );
  }

  async suggestDependencies(
    request: DependencyRequest,
  ): Promise<
    AIResponse<
      { source: string; target: string; type: string; rationale: string }[]
    >
  > {
    const started = performance.now();
    const proposal = request.deterministicEdges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      type: edge.type,
      rationale: `Derived from the imported structure between ${edge.source} and ${edge.target}.`,
    }));
    const validation = validateDependencies(
      proposal,
      request.nodes.map((node) => node.id),
      [
        "blocking-discovery",
        "design-handoff",
        "data-dependency",
        "api-contract",
        "security-gate",
        "model-handoff",
        "approval",
        "sequencing",
      ],
    );
    return response(
      validation.ok && validation.value ? validation.value : proposal,
      started,
    );
  }

  async draftPackage(
    request: PackageDraftRequest,
  ): Promise<AIResponse<Record<string, string | string[]>>> {
    const started = performance.now();
    const draft: Record<string, string | string[]> = {
      ...request.baselineDraft,
    };
    for (const field of request.missingFields) {
      if (field === "seniority") {
        draft.seniority =
          "Not stated in the imported package — the operator must set the seniority level.";
      } else if (field === "capacity") {
        draft.capacity =
          "Not stated in the imported package — the operator must set the committed capacity.";
      } else if (request.evidence.length > 0) {
        draft[field] = request.evidence
          .slice(0, 3)
          .map((item) => `${item.title} (${item.id})`);
      } else {
        draft[field] = [];
      }
    }
    const validation = validatePackageDraft(draft);
    return response(
      validation.ok && validation.value
        ? validation.value
        : request.baselineDraft,
      started,
    );
  }

  async explainImpact(
    request: ImpactExplainRequest,
  ): Promise<AIResponse<string>> {
    const started = performance.now();
    return response(request.facts.join(" "), started);
  }
}

export function createMockProvider(): MockProvider {
  return new MockProvider();
}
