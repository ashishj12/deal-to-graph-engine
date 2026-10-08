import type {
  ExecutionNode,
  GraphEdge,
  OperatingModel,
  Readiness,
} from "@deal-to-challenge/engine";

export function testNode(
  id: string,
  overrides: Partial<ExecutionNode> = {},
): ExecutionNode {
  const model: OperatingModel =
    overrides.operatingModel?.primary ?? "flexible-talent";
  const base: ExecutionNode = {
    id,
    title: `Node ${id}`,
    objective: `Deliver ${id}.`,
    workCategory: "backend-api",
    kind: "delivery",
    scope: `Scope for ${id}.`,
    sourceIds: ["FR_01"],
    sourceRefs: [],
    inputs: ["Scope baseline"],
    deliverables: [`${id} deliverable`],
    acceptanceConditions: ["The deliverable is accepted."],
    dependsOn: [],
    requiredSkills: ["api-design"],
    roles: ["backend-engineer"],
    complexity: "low",
    effort: {
      minimum: 2,
      maximum: 5,
      likely: 3,
      unit: "person-days",
      provenance: "imported",
      sourceIds: ["WS_01"],
      basis: "test",
    },
    risks: [],
    assumptions: [],
    blockingStatus: "none",
    blockedBy: [],
    operatingModel: {
      primary: model,
      alternatives: [],
      confidence: "high",
      rationale: ["Hand-built test node."],
      sourceIds: ["FR_01"],
      overridden: false,
      overrideHistory: [],
      scores: [],
      margin: 5,
      splitRecommended: false,
      splitReason: null,
      ...(overrides.operatingModel ?? {}),
    },
    provenance: "imported",
    readiness: "ready",
    readinessBlockers: [],
    modelFieldsMissing: [],
    humanReviewRequired: false,
    fieldProvenance: {
      inputs: "imported",
      deliverables: "imported",
      acceptanceConditions: "imported",
      risks: "imported",
      assumptions: "imported",
    },
    acceptanceSourceIds: ["FR_01"],
    riskSourceIds: [],
    assumptionSourceIds: [],
    splitOf: null,
    mergedFrom: [],
    anchors: {
      capabilityId: null,
      workstreamId: null,
      phaseId: null,
      componentIds: [],
      integrationIds: [],
      domainIds: [],
      aiUseCaseIds: [],
      requirementIds: ["FR_01"],
      estimateWorkstreamId: "WS_01",
      backlogSourceId: null,
    },
    aiSuggestions: [],
  };
  return { ...base, ...overrides };
}

export function testEdge(
  id: string,
  source: string,
  target: string,
  overrides: Partial<GraphEdge> = {},
): GraphEdge {
  return {
    id,
    source,
    target,
    type: "sequencing",
    rationale: `${source} must finish before ${target}.`,
    sourceIds: ["FR_01"],
    blocking: true,
    handoff: "Deliverable",
    provenance: "deterministic",
    ...overrides,
  };
}

/**
 * Diamond: A → B, A → C, B → D, C → D.
 * Waves 1..3, and both A→B→D and A→C→D are 10 person-days when every node is 5,
 * so the tie-break rule decides which path is reported.
 */
export function diamondGraph(effort = 5): {
  nodes: ExecutionNode[];
  edges: GraphEdge[];
} {
  const node = (id: string) =>
    testNode(id, {
      effort: {
        minimum: effort,
        maximum: effort,
        likely: effort,
        unit: "person-days",
        provenance: "imported",
        sourceIds: ["WS_01"],
        basis: "test",
      },
    });
  return {
    nodes: [node("A"), node("B"), node("C"), node("D")],
    edges: [
      testEdge("E1", "A", "B"),
      testEdge("E2", "A", "C"),
      testEdge("E3", "B", "D"),
      testEdge("E4", "C", "D"),
    ],
  };
}

/** A cycle: A → B → C → A. */
export function cyclicGraph(): { nodes: ExecutionNode[]; edges: GraphEdge[] } {
  return {
    nodes: [testNode("A"), testNode("B"), testNode("C")],
    edges: [
      testEdge("E1", "A", "B"),
      testEdge("E2", "B", "C"),
      testEdge("E3", "C", "A"),
    ],
  };
}

/** Two independent chains, used for parallel-wave assertions. */
export function parallelGraph(): {
  nodes: ExecutionNode[];
  edges: GraphEdge[];
} {
  return {
    nodes: [testNode("A"), testNode("B"), testNode("C"), testNode("D")],
    edges: [testEdge("E1", "A", "B"), testEdge("E2", "C", "D")],
  };
}

export function readinessOf(state: Readiness): Readiness {
  return state;
}
