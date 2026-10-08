/**
 * Graph assembly (FR5): edges → dependsOn → waves → critical path → aggregates.
 *
 * The graph is a pure function of (nodes, canonical package, revision, generator),
 * so recompiling after an edit reproduces every untouched node byte-for-byte.
 */

import type {
  ExecutionGraph,
  ExecutionNode,
  GeneratorInfo,
  GraphEdge,
  OperatingModelSummary,
} from "../canonical/execution";
import type { CanonicalPackage, ImportedPackage } from "../canonical/types";
import { computeAggregates, computeCriticalPath, computeSchedule } from "./analysis";
import { buildEdges } from "./edges";
import { validateGraph } from "./validate";
import { buildTraceability } from "../decompose";

export type { GraphValidation } from "./validate";
export type { ScheduleResult } from "./analysis";

export interface BuildGraphInput {
  imported: ImportedPackage;
  nodes: ExecutionNode[];
  revision: number;
  generator: GeneratorInfo;
  graphId?: string;
}

export function summariseModels(nodes: ExecutionNode[]): OperatingModelSummary {
  const flexibleTalent = nodes.filter((node) => node.operatingModel.primary === "flexible-talent").length;
  const challenge = nodes.filter((node) => node.operatingModel.primary === "challenge").length;
  const privatePod = nodes.filter((node) => node.operatingModel.primary === "private-pod").length;
  const modelsUsed = [
    ...(flexibleTalent > 0 ? (["flexible-talent"] as const) : []),
    ...(challenge > 0 ? (["challenge"] as const) : []),
    ...(privatePod > 0 ? (["private-pod"] as const) : []),
  ];
  return {
    flexibleTalent,
    challenge,
    privatePod,
    mixed: modelsUsed.length > 1,
    modelsUsed: [...modelsUsed],
  };
}

/**
 * Recompute everything derived from the edge set.
 *
 * The compiler mutates edges after the first build: operator-created
 * dependencies, the rewiring that keeps a split or merge connected, and
 * operator-removed edges. `dependsOn`, the waves, the critical path, the
 * aggregates and the structural findings all describe the edges, so they must be
 * recomputed against the *final* edge list. Skipping this left the findings
 * describing the pre-edit graph, which meant a cycle the operator introduced was
 * never reported and the quality gate could not block it.
 */
export function recomputeEdges(graph: ExecutionGraph, edges: GraphEdge[]): ExecutionGraph {
  const dependsOn = new Map<string, string[]>();
  for (const edge of edges) {
    dependsOn.set(edge.target, [...(dependsOn.get(edge.target) ?? []), edge.source]);
  }
  const nodes: ExecutionNode[] = graph.nodes.map((node) => ({
    ...node,
    dependsOn: (dependsOn.get(node.id) ?? []).slice().sort(),
  }));

  const schedule = computeSchedule(nodes, edges);
  const criticalPath = computeCriticalPath(nodes, edges);
  const validation = validateGraph(nodes, edges);
  const aggregates = computeAggregates(nodes, edges, schedule.waves, criticalPath);

  return {
    ...graph,
    nodes,
    edges,
    waves: schedule.waves,
    criticalPath,
    earliestStart: schedule.earliestStart,
    aggregates,
    findings: validation.findings,
  };
}

export function buildGraph(input: BuildGraphInput): ExecutionGraph {
  const { imported, revision, generator } = input;
  const canonical: CanonicalPackage = imported.canonical;
  const edges = buildEdges(input.nodes, canonical);

  // dependsOn is derived from the edges so the node view and the graph agree.
  const dependsOn = new Map<string, string[]>();
  for (const edge of edges) {
    dependsOn.set(edge.target, [...(dependsOn.get(edge.target) ?? []), edge.source]);
  }
  const nodes: ExecutionNode[] = input.nodes.map((node) => ({
    ...node,
    dependsOn: (dependsOn.get(node.id) ?? []).slice().sort(),
  }));

  const schedule = computeSchedule(nodes, edges);
  const criticalPath = computeCriticalPath(nodes, edges);
  const validation = validateGraph(nodes, edges);
  const aggregates = computeAggregates(nodes, edges, schedule.waves, criticalPath);

  return {
    schemaVersion: "1.0",
    graphId: input.graphId ?? `GRAPH_${canonical.deal.id}`,
    dealId: canonical.deal.id,
    dealTitle: canonical.deal.title,
    maturity: imported.maturity.level,
    revision,
    generator,
    nodes,
    edges,
    waves: schedule.waves,
    criticalPath,
    earliestStart: schedule.earliestStart,
    aggregates,
    operatingModelSummary: summariseModels(nodes),
    findings: validation.findings,
    traceability: buildTraceability(canonical, nodes),
  };
}
