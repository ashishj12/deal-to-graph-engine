import {
  EDGE_TYPES,
  type ExecutionNode,
  type GraphEdge,
  type GraphFinding,
} from "../canonical/execution";

export interface GraphValidation {
  findings: GraphFinding[];
  cycles: string[][];
  hasCycle: boolean;
}

/** Depth-first search that records the exact cycle path, not just a boolean. */
export function findCycles(
  nodes: ExecutionNode[],
  edges: GraphEdge[],
): string[][] {
  const outgoing = new Map<string, string[]>();
  for (const node of nodes) outgoing.set(node.id, []);
  for (const edge of edges) outgoing.get(edge.source)?.push(edge.target);

  const state = new Map<string, 0 | 1 | 2>();
  for (const node of nodes) state.set(node.id, 0);
  const stack: string[] = [];
  const cycles: string[][] = [];
  const seen = new Set<string>();

  function visit(id: string): void {
    state.set(id, 1);
    stack.push(id);
    for (const next of (outgoing.get(id) ?? []).slice().sort()) {
      const nextState = state.get(next) ?? 0;
      if (nextState === 1) {
        const start = stack.indexOf(next);
        const cycle = stack.slice(start).concat(next);
        const key = cycle.slice(0, -1).slice().sort().join(">");
        if (!seen.has(key)) {
          seen.add(key);
          cycles.push(cycle);
        }
      } else if (nextState === 0) {
        visit(next);
      }
    }
    stack.pop();
    state.set(id, 2);
  }

  for (const node of [...nodes].sort((a, b) => a.id.localeCompare(b.id))) {
    if ((state.get(node.id) ?? 0) === 0) visit(node.id);
  }
  return cycles;
}

export function validateGraph(
  nodes: ExecutionNode[],
  edges: GraphEdge[],
): GraphValidation {
  const findings: GraphFinding[] = [];
  const ids = new Set(nodes.map((node) => node.id));

  const selfEdges = edges.filter((edge) => edge.source === edge.target);
  if (selfEdges.length > 0) {
    findings.push({
      id: "FINDING_SELF_DEPENDENCY",
      code: "self-dependency",
      severity: "error",
      message: `${selfEdges.length} edge(s) point at their own node.`,
      nodeIds: [...new Set(selfEdges.map((edge) => edge.source))],
      edgeIds: selfEdges.map((edge) => edge.id),
      cyclePath: [],
      provenance: "deterministic",
    });
  }

  const dangling = edges.filter(
    (edge) => !ids.has(edge.source) || !ids.has(edge.target),
  );
  if (dangling.length > 0) {
    findings.push({
      id: "FINDING_DANGLING_NODE",
      code: "dangling-node",
      severity: "error",
      message: `${dangling.length} edge(s) reference a node that is not in the graph.`,
      nodeIds: [
        ...new Set(
          dangling
            .flatMap((edge) => [edge.source, edge.target])
            .filter((id) => !ids.has(id)),
        ),
      ],
      edgeIds: dangling.map((edge) => edge.id),
      cyclePath: [],
      provenance: "deterministic",
    });
  }

  const pairSeen = new Map<string, GraphEdge[]>();
  for (const edge of edges) {
    const key = `${edge.source}->${edge.target}`;
    pairSeen.set(key, [...(pairSeen.get(key) ?? []), edge]);
  }
  const duplicates = [...pairSeen.values()].filter((group) => group.length > 1);
  if (duplicates.length > 0) {
    findings.push({
      id: "FINDING_DUPLICATE_EDGE",
      code: "duplicate-edge",
      severity: "warning",
      message: `${duplicates.length} dependency pair(s) are declared more than once.`,
      nodeIds: [
        ...new Set(
          duplicates.flatMap((group) => [group[0].source, group[0].target]),
        ),
      ],
      edgeIds: duplicates.flatMap((group) =>
        group.slice(1).map((edge) => edge.id),
      ),
      cyclePath: [],
      provenance: "deterministic",
    });
  }

  const invalid = edges.filter(
    (edge) =>
      !(EDGE_TYPES as readonly string[]).includes(edge.type) ||
      edge.rationale.trim().length === 0 ||
      edge.sourceIds.length === 0,
  );
  if (invalid.length > 0) {
    findings.push({
      id: "FINDING_INVALID_EDGE",
      code: "invalid-edge",
      severity: "error",
      message: `${invalid.length} edge(s) lack a known type, a rationale or a source id.`,
      nodeIds: [
        ...new Set(invalid.flatMap((edge) => [edge.source, edge.target])),
      ],
      edgeIds: invalid.map((edge) => edge.id),
      cyclePath: [],
      provenance: "deterministic",
    });
  }

  const cycles = findCycles(nodes, edges);
  for (const [index, cycle] of cycles.entries()) {
    findings.push({
      id: `FINDING_CYCLE_${index + 1}`,
      code: "cycle",
      severity: "error",
      message: `Dependency cycle: ${cycle.join(" → ")}. A cyclic graph can never be Ready.`,
      nodeIds: cycle,
      edgeIds: edges
        .filter(
          (edge) => cycle.includes(edge.source) && cycle.includes(edge.target),
        )
        .map((edge) => edge.id),
      cyclePath: cycle,
      provenance: "deterministic",
    });
  }

  const incoming = new Set(edges.map((edge) => edge.target));
  const outgoing = new Set(edges.map((edge) => edge.source));
  const orphans = nodes.filter(
    (node) =>
      node.kind === "delivery" &&
      !incoming.has(node.id) &&
      !outgoing.has(node.id),
  );
  if (orphans.length > 0) {
    findings.push({
      id: "FINDING_ORPHAN_NODE",
      code: "orphan-node",
      severity: "warning",
      message: `${orphans.length} delivery node(s) have no dependency in either direction and would run unconnected to the graph.`,
      nodeIds: orphans.map((node) => node.id),
      edgeIds: [],
      cyclePath: [],
      provenance: "deterministic",
    });
  }

  const unsupported = nodes.filter(
    (node) =>
      node.sourceIds.length === 0 &&
      node.anchors.backlogSourceId === null &&
      node.kind !== "approval",
  );
  if (unsupported.length > 0) {
    findings.push({
      id: "FINDING_UNSUPPORTED_NODE",
      code: "unsupported-node",
      severity: "error",
      message: `${unsupported.length} node(s) cite no imported source and no approved user decision.`,
      nodeIds: unsupported.map((node) => node.id),
      edgeIds: [],
      cyclePath: [],
      provenance: "deterministic",
    });
  }

  const blocked = nodes.filter((node) => node.blockingStatus === "blocked");
  if (blocked.length > 0) {
    findings.push({
      id: "FINDING_BLOCKED_NODE",
      code: "blocked-node",
      severity: "warning",
      message: `${blocked.length} node(s) are blocked by unresolved items in the imported package.`,
      nodeIds: blocked.map((node) => node.id),
      edgeIds: [],
      cyclePath: [],
      provenance: "deterministic",
    });
  }

  const crossModel = edges.filter((edge) => edge.type === "model-handoff");
  if (crossModel.length > 0) {
    findings.push({
      id: "FINDING_MODEL_HANDOFF",
      code: "model-handoff",
      severity: "info",
      message: `${crossModel.length} handoff(s) cross operating models and therefore need an explicit handoff agreement.`,
      nodeIds: [
        ...new Set(crossModel.flatMap((edge) => [edge.source, edge.target])),
      ],
      edgeIds: crossModel.map((edge) => edge.id),
      cyclePath: [],
      provenance: "deterministic",
    });
  }

  return { findings, cycles, hasCycle: cycles.length > 0 };
}
