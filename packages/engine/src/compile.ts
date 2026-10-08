import {
  MockProvider,
  MOCK_NOTICE,
  MOCK_PROMPT_VERSION,
  validateDecomposition,
  validatePackageDraft,
} from "./ai";
import type { AIProvider, AIProposal } from "./ai";
import type {
  AiSuggestion,
  ChangeImpact,
  EditableField,
  ExecutionGraph,
  ExecutionNode,
  GeneratorInfo,
  ModelScore,
  QualityReport,
} from "./canonical/execution";
import type { EdgeType } from "./canonical/execution";
import type {
  CanonicalPackage,
  ImportedPackage,
  OperatingModel,
  Readiness,
} from "./canonical/types";
import { buildGraph, recomputeEdges } from "./dag";
import { buildEdgeDrafts, type EdgeDraft } from "./dag/edges";
import {
  appendDecision,
  createDecision,
  createLog,
  mergedAwayIds,
  nodeEditsFrom,
  nodeStatusFrom,
  overridesFrom,
  removedNodesFrom,
  suggestionStatusFrom,
  userNodesFrom,
} from "./decisions";
import { classifyNode } from "./classify";
import type { DecisionLog } from "./canonical/execution";
import { decompose, finaliseReadiness } from "./decompose";
import { diffGraphs } from "./impact";
import { buildModelPackage } from "./packages";
import type { ModelPackage } from "./packages/types";
import { runQualityGate } from "./quality";

export interface CompiledDeal {
  imported: ImportedPackage;
  canonical: CanonicalPackage;
  graph: ExecutionGraph;
  quality: QualityReport;
  packages: ModelPackage[];
  decisions: DecisionLog;
  ai: {
    provider: string;
    mode: "mock" | "live";
    model: string | null;
    promptVersion: string;
    notice: string;
  };
  notes: string[];
}

export interface CompileOptions {
  decisions?: DecisionLog;
  provider?: AIProvider;
  generatedAt?: string;
  /** Extra edges the operator added, and edge keys they removed. */
  edgeOverrides?: { added: EdgeDraft[]; removed: string[] };
  /** Accepted AI suggestions, applied with `user-approved` provenance. */
  acceptedSuggestions?: Map<string, { field: string; value: string }>;
}

export function mockGenerator(): GeneratorInfo {
  return {
    mode: "mock",
    provider: "mock",
    model: null,
    promptVersion: MOCK_PROMPT_VERSION,
    notice: MOCK_NOTICE,
  };
}

/** Apply the operator's field edits to a node, marking the provenance. */
function applyNodeEdits(
  node: ExecutionNode,
  edits: { field: string; value: unknown }[],
  status: "approved" | "rejected" | "blocked" | "review-required" | null,
): ExecutionNode {
  let next = node;
  for (const edit of edits) {
    switch (edit.field as EditableField | "readiness") {
      case "title":
        next = { ...next, title: String(edit.value) };
        break;
      case "scope":
        next = { ...next, scope: String(edit.value) };
        break;
      case "workCategory":
        next = {
          ...next,
          workCategory: edit.value as ExecutionNode["workCategory"],
        };
        break;
      case "acceptanceConditions": {
        const values = Array.isArray(edit.value)
          ? (edit.value as string[])
          : [String(edit.value)];
        next = {
          ...next,
          acceptanceConditions: values,
          fieldProvenance: {
            ...next.fieldProvenance,
            acceptanceConditions: "user-approved",
          },
        };
        break;
      }
      case "effort": {
        const value = edit.value as {
          minimum?: number | null;
          maximum?: number | null;
          likely?: number | null;
          unit?: string;
        };
        next = {
          ...next,
          effort: {
            minimum: value.minimum ?? null,
            maximum: value.maximum ?? null,
            likely: value.likely ?? null,
            unit: value.unit ?? next.effort.unit,
            provenance: "user-created",
            sourceIds: next.effort.sourceIds,
            basis:
              "Effort supplied by the operator; the imported package did not estimate this work.",
          },
        };
        break;
      }
      case "sourceIds": {
        const values = Array.isArray(edit.value)
          ? (edit.value as string[])
          : [String(edit.value)];
        next = {
          ...next,
          sourceIds: [...new Set([...next.sourceIds, ...values])].sort(),
        };
        break;
      }
      case "operatingModel": {
        const value = edit.value as OperatingModel;
        next = {
          ...next,
          operatingModel: {
            ...next.operatingModel,
            primary: value,
            overridden: true,
            overrideHistory: [
              ...next.operatingModel.overrideHistory,
              {
                from: next.operatingModel.primary,
                to: value,
                rationale: "Operator override",
                at: new Date(0).toISOString(),
              },
            ],
          },
        };
        break;
      }
      case "readiness": {
        const value = edit.value as Readiness;
        next = { ...next, readiness: value };
        break;
      }
      default:
        break;
    }
  }

  if (status === "rejected") {
    return {
      ...next,
      readiness: "blocked",
      // `blockingStatus` is what survives the readiness recomputation, so a
      // rejection stays a block instead of decaying back to review-required.
      blockingStatus: "blocked",
      readinessBlockers: [
        ...new Set([
          ...next.readinessBlockers,
          "unsupported" as const,
          "open-blocker" as const,
        ]),
      ].sort(),
      humanReviewRequired: true,
    };
  }
  if (status === "blocked") {
    return {
      ...next,
      readiness: "blocked",
      blockingStatus: "blocked",
      humanReviewRequired: true,
    };
  }
  if (status === "approved") {
    const blockers = next.readinessBlockers.filter(
      (blocker) =>
        blocker !== "human-approval-pending" && blocker !== "missing-rationale",
    );
    return {
      ...next,
      humanReviewRequired: false,
      readinessBlockers: blockers,
      readiness:
        blockers.length === 0
          ? "ready"
          : next.readiness === "blocked"
            ? "blocked"
            : "review-required",
    };
  }
  if (status === "review-required") {
    return {
      ...next,
      readiness: next.readiness === "blocked" ? "blocked" : "review-required",
    };
  }
  return next;
}

function edgeKey(edge: { source: string; target: string }): string {
  return `${edge.source}->${edge.target}`;
}

export async function compileDeal(
  imported: ImportedPackage,
  options: CompileOptions = {},
): Promise<CompiledDeal> {
  const provider = options.provider ?? new MockProvider();
  const decisions = options.decisions ?? createLog(imported.canonical.deal.id);
  // The generator record travels into every export, so it reflects the provider
  // that actually ran rather than a fixed assumption of mock mode.
  const generator: GeneratorInfo =
    provider.mode === "mock"
      ? mockGenerator()
      : {
          mode: "live",
          provider: provider.id,
          model: provider.model,
          promptVersion: provider.promptVersion,
          notice: `LIVE AI MODE — provider ${provider.id}. AI output is labelled and never applied without a user decision.`,
        };

  const userNodes = userNodesFrom(decisions);
  const decomposition = decompose({
    imported,
    revision: decisions.revision,
    overrides: overridesFrom(decisions),
    removedNodeIds: [
      ...removedNodesFrom(decisions),
      ...mergedAwayIds(decisions),
    ],
  });

  // Nodes the operator created by hand stay in the plan and keep `user-created`
  // provenance, so the review can always separate them from imported scope.
  const usages = new Set<string>();
  const addedNodes: ExecutionNode[] = [];
  const userEdges: EdgeDraft[] = [];

  // A split or a merge *replaces* the node(s) it was derived from, and those
  // parents are removed from the plan — which also removes every edge that touched
  // them. Without rewiring, the replacement parts would sit unconnected and be
  // reported as orphans. The parents' neighbours are therefore read from the
  // deterministic edge set computed *before* the removal, which is why the plan is
  // decomposed a second time here, and only when a parent is actually replaced.
  const replacedParents = new Set(
    userNodes
      .filter((spec) => spec.mode !== "add")
      .flatMap((spec) => spec.derivedFrom),
  );
  const neighbours = new Map<
    string,
    { upstream: string[]; downstream: string[] }
  >();
  if (replacedParents.size > 0) {
    const unremoved = decompose({
      imported,
      revision: decisions.revision,
      overrides: overridesFrom(decisions),
      removedNodeIds: [],
    });
    const unremovedEdges = buildEdgeDrafts(unremoved.nodes, imported.canonical);
    for (const parentId of replacedParents) {
      neighbours.set(parentId, {
        upstream: unremovedEdges
          .filter((edge) => edge.target === parentId)
          .map((edge) => edge.source),
        downstream: unremovedEdges
          .filter((edge) => edge.source === parentId)
          .map((edge) => edge.target),
      });
    }
  }

  let userSequence = 0;
  for (const spec of userNodes) {
    const partNodes: ExecutionNode[] = [];
    for (const part of spec.parts) {
      userSequence += 1;
      let id = `NODE_USER_${String(userSequence).padStart(2, "0")}`;
      while (usages.has(id)) id = `${id}_1`;
      usages.add(id);
      const sourceIds =
        part.sourceIds.length > 0 ? part.sourceIds : spec.derivedFrom;
      const node = createUserNode(id, part, sourceIds, imported, spec);
      partNodes.push(node);
      addedNodes.push(node);
    }

    const live = new Set<string>([
      ...decomposition.nodes.map((node) => node.id),
      ...addedNodes.map((node) => node.id),
    ]);
    for (const parentId of spec.derivedFrom) {
      const parent = decomposition.nodes.find((node) => node.id === parentId);
      // `add` keeps its parent in the plan, so the new node hangs off it directly.
      const upstream = parent
        ? [parent.id]
        : (neighbours.get(parentId)?.upstream ?? []);
      const downstream = parent
        ? []
        : (neighbours.get(parentId)?.downstream ?? []);
      for (const part of partNodes) {
        for (const source of upstream) {
          if (!live.has(source) || source === part.id) continue;
          userEdges.push({
            source,
            target: part.id,
            type: "sequencing",
            rationale: `${part.title} was ${spec.mode === "split" ? "split out of" : "created alongside"} ${parentId}: ${spec.rationale}`,
            sourceIds: sourceIdsOf(part),
            blocking: false,
            handoff: "Scope handed over",
          });
        }
        for (const target of downstream) {
          if (!live.has(target) || target === part.id) continue;
          userEdges.push({
            source: part.id,
            target,
            type: "sequencing",
            rationale: `${target} depended on ${parentId}, which ${part.title} replaces: ${spec.rationale}`,
            sourceIds: sourceIdsOf(part),
            blocking: false,
            handoff: "Scope handed over",
          });
        }
      }
    }
  }

  const edits = nodeEditsFrom(decisions);
  const statuses = new Map(
    nodeStatusFrom(decisions).map((entry) => [entry.nodeId, entry.status]),
  );
  const accepted =
    options.acceptedSuggestions ??
    new Map<string, { field: string; value: string }>();

  // Deterministic baseline first, then the operator's decisions on top. AI output
  // is merged only as a labelled suggestion, and only takes effect once the log
  // records that the operator accepted it.
  const withEdits = decomposition.nodes.map((node) => {
    const nodeEdits = edits
      .filter((edit) => edit.nodeId === node.id)
      .map((edit) => ({ field: edit.field, value: edit.value }));
    const status = statuses.get(node.id) ?? null;
    return applyNodeEdits(node, nodeEdits, status);
  });

  const baselineProposals: AIProposal[] = withEdits
    .slice(0, 12)
    .map((node) => ({
      id: `BASELINE_${node.id}`,
      title: node.title,
      objective: node.objective,
      workCategory: node.workCategory,
      kind: node.kind,
      sourceIds: node.sourceIds,
      rationale:
        node.operatingModel.rationale[0] ??
        "Generated from the imported structure.",
    }));

  const evidence = [
    ...imported.canonical.scope.gaps,
    ...imported.canonical.scope.questions,
    ...imported.canonical.scope.assumptions,
  ].map((item) => ({
    id: item.id,
    title: item.title,
    kind: item.kind,
    text: item.description,
  }));

  const aiRun = await provider.decompose({
    dealId: imported.canonical.deal.id,
    dealTitle: imported.canonical.deal.title,
    promptVersion: provider.promptVersion,
    sourceIds: evidence.map((item) => item.id),
    baseline: baselineProposals,
    evidence,
  });

  // Nothing from a provider is trusted: the response is schema-validated, and an
  // invalid response falls back to the deterministic decomposition.
  const validated = validateDecomposition(aiRun.proposal);
  const validatedProposals: AIProposal[] =
    validated.ok && validated.value ? validated.value : baselineProposals;
  const aiFallbackNote = validated.ok
    ? null
    : `AI output was rejected by schema validation (${validated.issues.length} issue(s): ${validated.issues
        .slice(0, 3)
        .map((issue) => `${issue.path} ${issue.message}`)
        .join("; ")}); the deterministic decomposition was used instead.`;

  const suggestionStatus = suggestionStatusFrom(decisions);
  const aiSuggestions: AiSuggestion[] = validatedProposals
    .filter((proposal) => proposal.id.startsWith("PROPOSAL_"))
    .map((proposal) => ({
      id: proposal.id,
      field: "scope",
      value: proposal.objective,
      rationale: proposal.rationale,
      provenance: "ai-recommended" as const,
      provider: aiRun.provider,
      mode: aiRun.mode,
      promptVersion: aiRun.promptVersion,
      sourceIds: proposal.sourceIds,
      status: suggestionStatus.get(proposal.id) ?? "proposed",
    }));

  const acceptedEdits = [...accepted.entries()].map(
    ([suggestionId, value]) => ({
      nodeId: suggestionId.replace("PROPOSAL_", "NODE_"),
      field: value.field,
      value: value.value,
    }),
  );

  const finalNodes = withEdits.map((node) => {
    const relatedSuggestions = aiSuggestions.filter((suggestion) =>
      suggestion.sourceIds.some((id) => node.sourceIds.includes(id)),
    );
    const nodeEdits = acceptedEdits.filter((edit) => edit.nodeId === node.id);
    const withSuggestions = applyNodeEdits(node, nodeEdits, null);
    const adjusted = finaliseReadiness(withSuggestions, imported.canonical);
    return { ...adjusted, aiSuggestions: relatedSuggestions };
  });

  // Field-level drafting: where the imported package does not contain what the
  // node's operating model requires, the provider may draft a value from the
  // sources. Each draft is recorded as a labelled suggestion that an operator has
  // to accept — the engine never fills a required field silently.
  const fieldSuggestions: AiSuggestion[] = [];
  for (const node of finalNodes
    .filter(
      (entry) =>
        entry.modelFieldsMissing.length > 0 && entry.sourceIds.length > 0,
    )
    .slice(0, 12)) {
    const nodeEvidence = node.sourceRefs
      .slice(0, 4)
      .map((ref) => ({
        id: ref.id,
        title: ref.title,
        text: ref.quote ?? ref.title,
      }));
    const draftRun = await provider.draftPackage({
      dealId: imported.canonical.deal.id,
      dealTitle: imported.canonical.deal.title,
      promptVersion: provider.promptVersion,
      sourceIds: node.sourceIds,
      nodeId: node.id,
      model: node.operatingModel.primary,
      missingFields: node.modelFieldsMissing,
      evidence: nodeEvidence,
      baselineDraft: {},
    });
    const validatedDraft = validatePackageDraft(draftRun.proposal);
    if (!validatedDraft.ok || !validatedDraft.value) continue;
    for (const field of node.modelFieldsMissing) {
      const value = validatedDraft.value[field];
      if (value === undefined) continue;
      const id = `SUGGEST_${node.id}_${field}`;
      fieldSuggestions.push({
        id,
        field,
        value: Array.isArray(value) ? value.join("; ") : value,
        rationale: `Drafted from ${nodeEvidence.length} source record(s) because the imported package does not state ${field}.`,
        provenance: "ai-recommended",
        provider: draftRun.provider,
        mode: draftRun.mode,
        promptVersion: draftRun.promptVersion,
        sourceIds: node.sourceIds.slice(0, 4),
        status: suggestionStatus.get(id) ?? "proposed",
      });
    }
  }
  const nodesWithSuggestions = finalNodes.map((node) => ({
    ...node,
    aiSuggestions: [
      ...node.aiSuggestions,
      ...fieldSuggestions.filter((suggestion) =>
        suggestion.id.startsWith(`SUGGEST_${node.id}_`),
      ),
    ],
  }));

  let graph = buildGraph({
    imported,
    nodes: [...nodesWithSuggestions, ...addedNodes],
    revision: decisions.revision,
    generator,
  });

  {
    const existing = new Set(graph.edges.map(edgeKey));
    const additions = userEdges
      .filter(
        (edge) =>
          !existing.has(edgeKey(edge)) &&
          graph.nodes.some((node) => node.id === edge.target),
      )
      .map((edge, position) => ({
        id: `EDGE_SPLIT_${String(position + 1).padStart(2, "0")}`,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        rationale: edge.rationale,
        sourceIds: edge.sourceIds,
        blocking: edge.blocking,
        handoff: edge.handoff,
        provenance: "user-created" as const,
      }));
    graph.edges = [...graph.edges, ...additions];
  }

  const edgeOverrides = options.edgeOverrides ?? edgeOverridesFrom(decisions);
  if (edgeOverrides.removed.length > 0 || edgeOverrides.added.length > 0) {
    const removed = new Set(edgeOverrides.removed);
    const kept = graph.edges.filter((edge) => !removed.has(edgeKey(edge)));
    const existing = new Set(kept.map(edgeKey));
    const added = edgeOverrides.added
      .filter((edge) => !existing.has(edgeKey(edge)))
      .map((edge, position) => ({
        id: `EDGE_USER_${String(position + 1).padStart(2, "0")}`,
        source: edge.source,
        target: edge.target,
        type: edge.type as EdgeType,
        rationale: edge.rationale,
        sourceIds: edge.sourceIds,
        blocking: edge.blocking,
        handoff: edge.handoff,
        provenance: "user-created" as const,
      }));
    graph.edges = [...kept, ...added];
  }

  // Only now is the edge set final. Everything derived from it — dependsOn, the
  // waves, the critical path, the aggregates and the structural findings — is
  // recomputed so the quality gate judges the graph the operator actually built.
  graph = recomputeEdges(graph, graph.edges);

  const quality = runQualityGate({
    graph,
    canonical: imported.canonical,
    decisions,
    generatedAt: options.generatedAt ?? "1970-01-01T00:00:00.000Z",
  });

  const packages = graph.nodes.map((node) =>
    buildModelPackage(node, { canonical: imported.canonical, generator }),
  );

  const notes = [
    ...decomposition.notes,
    `AI layer: provider ${aiRun.provider} in ${aiRun.mode} mode produced ${aiSuggestions.length + fieldSuggestions.length} suggestion(s); none are applied without a recorded user decision.`,
    ...(aiFallbackNote ? [aiFallbackNote] : []),
    `Quality gate: ${quality.status} (${quality.counts.fail} failing, ${quality.counts.warn} warning rule(s)).`,
  ];

  return {
    imported,
    canonical: imported.canonical,
    graph,
    quality,
    packages,
    decisions,
    ai: {
      provider: aiRun.provider,
      mode: aiRun.mode,
      model: aiRun.model,
      promptVersion: aiRun.promptVersion,
      notice: generator.notice,
    },
    notes,
  };
}

export interface EditRequest {
  nodeId: string;
  field: EditableField;
  value: unknown;
  rationale: string;
  at: string;
}

/**
 * Apply edits, recompile, and return the change-impact report. The previous
 * compiled deal is left untouched so a caller can show before and after.
 */
export async function applyEdits(
  compiled: CompiledDeal,
  edits: EditRequest[],
  options: CompileOptions = {},
): Promise<{ next: CompiledDeal; impact: ChangeImpact }> {
  let log = compiled.decisions;
  for (const edit of edits) {
    log = appendDecision(
      log,
      createDecision({
        type: "edit-node",
        rationale: edit.rationale,
        targetNodeIds: [edit.nodeId],
        before: null,
        after: { field: edit.field, value: edit.value },
        summary: `${edit.nodeId}: ${edit.field} updated — ${edit.rationale}`,
        at: edit.at,
      }),
    );
  }
  const next = await compileDeal(compiled.imported, {
    ...options,
    decisions: log,
  });
  const impact = diffGraphs({
    before: compiled.graph,
    after: next.graph,
    changes: edits.map((edit) => ({
      nodeId: edit.nodeId,
      field: edit.field,
      before:
        compiled.graph.nodes.find((node) => node.id === edit.nodeId)?.[
          edit.field
        ] ?? null,
      after: edit.value,
    })),
  });
  return { next, impact };
}

/** Score table for the operating-model summary view. */
export function modelScores(node: ExecutionNode): ModelScore[] {
  return node.operatingModel.scores;
}

/** Operator-added and operator-removed dependencies, read from the decision log. */
function edgeOverridesFrom(log: DecisionLog): {
  added: EdgeDraft[];
  removed: string[];
} {
  const added: EdgeDraft[] = [];
  const removed: string[] = [];
  for (const entry of log.entries) {
    if (entry.type === "add-edge") {
      const after = entry.after as Partial<EdgeDraft> | null;
      if (after?.source && after.target && after.type) {
        added.push({
          source: after.source,
          target: after.target,
          type: after.type,
          rationale: entry.rationale,
          sourceIds: after.sourceIds ?? [],
          blocking: after.blocking ?? false,
          handoff: after.handoff ?? "Operator-defined dependency",
        });
      }
    }
    if (entry.type === "remove-edge") removed.push(...entry.targetEdgeIds);
  }
  return { added, removed };
}

function sourceIdsOf(node: ExecutionNode): string[] {
  return node.sourceIds.length > 0
    ? node.sourceIds.slice(0, 3)
    : ["USER_DECISION"];
}

/**
 * A node the operator created: add, split or merge. It is classified by the same
 * deterministic scorer as an imported node, but its provenance is `user-created`
 * and its acceptance conditions and effort stay open until the operator supplies
 * them, so it can never be mistaken for imported scope.
 */
function createUserNode(
  id: string,
  part: {
    title: string;
    objective: string;
    workCategory: string;
    sourceIds: string[];
  },
  sourceIds: string[],
  imported: ImportedPackage,
  spec: { mode: string; rationale: string; derivedFrom: string[] },
): ExecutionNode {
  const recommendation = classifyNode({
    nodeId: id,
    title: part.title,
    workCategory: part.workCategory,
    kind: "delivery",
    sourceIds,
    roles: [],
    componentIds: [],
    integrationIds: [],
    domainIds: [],
    sensitiveData: false,
    securityRequirementIds: [],
    acceptanceMeasurable: false,
    effortMaximum: null,
    phaseCount: 0,
    openSourceIds: [],
    deliverableCount: 0,
    humanReviewRequired: true,
    maturity: imported.maturity.level,
  });
  return {
    id,
    title: part.title,
    objective: part.objective,
    workCategory: part.workCategory as ExecutionNode["workCategory"],
    kind: "delivery",
    scope: `Created by the operator (${spec.mode}): ${spec.rationale}`,
    sourceIds,
    sourceRefs: [],
    inputs: [],
    deliverables: [],
    acceptanceConditions: [],
    dependsOn: [],
    requiredSkills: [],
    roles: [],
    complexity: "low",
    effort: {
      minimum: null,
      maximum: null,
      likely: null,
      unit: "person-days",
      provenance: "user-created",
      sourceIds,
      basis: "Operator-created node: effort must be supplied before handoff.",
    },
    risks: [],
    assumptions: [],
    blockingStatus: "none",
    blockedBy: [],
    operatingModel: recommendation,
    provenance: "user-created",
    readiness: "review-required",
    readinessBlockers: [
      "missing-acceptance",
      "missing-effort",
      "missing-inputs",
      "human-approval-pending",
      "missing-package-fields",
    ],
    modelFieldsMissing: [],
    humanReviewRequired: true,
    fieldProvenance: {
      inputs: "user-created",
      deliverables: "user-created",
      acceptanceConditions: "user-created",
      risks: "user-created",
      assumptions: "user-created",
    },
    acceptanceSourceIds: [],
    riskSourceIds: [],
    assumptionSourceIds: [],
    // A split node records its parent; a merged node records the nodes it replaced.
    splitOf: spec.mode === "split" ? (spec.derivedFrom[0] ?? null) : null,
    mergedFrom: spec.mode === "merge" ? spec.derivedFrom : [],
    anchors: {
      capabilityId: null,
      workstreamId: null,
      phaseId: null,
      componentIds: [],
      integrationIds: [],
      domainIds: [],
      aiUseCaseIds: [],
      requirementIds: sourceIds,
      estimateWorkstreamId: null,
      backlogSourceId: null,
    },
    aiSuggestions: [],
  };
}
