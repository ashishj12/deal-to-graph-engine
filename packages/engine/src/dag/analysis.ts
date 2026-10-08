import type {
  CriticalPath,
  ExecutionNode,
  GraphAggregates,
  GraphEdge,
  Wave,
} from "../canonical/execution";

export interface ScheduleResult {
  waves: Wave[];
  earliestStart: Record<string, number>;
  cyclicNodeIds: string[];
}

function effortOf(node: ExecutionNode, bound: "minimum" | "maximum"): number {
  const value = node.effort[bound];
  return typeof value === "number" ? value : 0;
}

/** Kahn layering: wave number is the longest-path depth from an entry node. */
export function computeSchedule(
  nodes: ExecutionNode[],
  edges: GraphEdge[],
): ScheduleResult {
  const ids = nodes.map((node) => node.id).sort();
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const incoming = new Map<string, string[]>(ids.map((id) => [id, []]));
  const outgoing = new Map<string, string[]>(ids.map((id) => [id, []]));

  for (const edge of edges) {
    if (!byId.has(edge.source) || !byId.has(edge.target)) continue;
    incoming.get(edge.target)?.push(edge.source);
    outgoing.get(edge.source)?.push(edge.target);
  }

  const depth = new Map<string, number>();
  const remaining = new Map<string, number>();
  for (const id of ids) remaining.set(id, incoming.get(id)?.length ?? 0);

  const queue = ids.filter((id) => (remaining.get(id) ?? 0) === 0);
  for (const id of queue) depth.set(id, 1);

  const earliestStart: Record<string, number> = {};
  for (const id of queue) earliestStart[id] = 0;

  const processed: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift() as string;
    processed.push(current);
    const currentNode = byId.get(current) as ExecutionNode;
    const start = earliestStart[current] ?? 0;
    const nodeDepth = depth.get(current) ?? 1;

    for (const next of outgoing.get(current) ?? []) {
      depth.set(next, Math.max(depth.get(next) ?? 1, nodeDepth + 1));
      const candidate = start + effortOf(currentNode, "maximum");
      earliestStart[next] = Math.max(earliestStart[next] ?? 0, candidate);
      const left = (remaining.get(next) ?? 1) - 1;
      remaining.set(next, left);
      if (left === 0) queue.push(next);
    }
  }

  const cyclicNodeIds = ids.filter((id) => !processed.includes(id));
  // Nodes inside a cycle still need a place in the plan; they are parked in the
  // final wave and reported as a finding rather than silently dropped.
  if (cyclicNodeIds.length > 0) {
    const maxDepth = Math.max(1, ...processed.map((id) => depth.get(id) ?? 1));
    for (const id of cyclicNodeIds) {
      depth.set(id, maxDepth + 1);
      earliestStart[id] = earliestStart[id] ?? 0;
    }
  }

  const waveIndexes = [...new Set([...depth.values()])].sort((a, b) => a - b);
  const waves: Wave[] = waveIndexes.map((index) => {
    const nodeIds = ids.filter((id) => depth.get(id) === index);
    const members = nodeIds.map((id) => byId.get(id) as ExecutionNode);
    return {
      index,
      nodeIds,
      effort: members.reduce((sum, node) => sum + effortOf(node, "maximum"), 0),
      models: {
        flexibleTalent: members.filter(
          (node) => node.operatingModel.primary === "flexible-talent",
        ).length,
        challenge: members.filter(
          (node) => node.operatingModel.primary === "challenge",
        ).length,
        privatePod: members.filter(
          (node) => node.operatingModel.primary === "private-pod",
        ).length,
      },
    };
  });

  return { waves, earliestStart, cyclicNodeIds };
}

/**
 * Longest path over `effort.maximum`.
 *
 * Tie-break rule (documented and tested): when two predecessors give the same
 * running total, the path that arrives through the lexicographically smaller node
 * id wins. That makes the reported path stable across runs and across machines.
 */
function longestPath(
  nodes: ExecutionNode[],
  edges: GraphEdge[],
  bound: "minimum" | "maximum",
): { nodeIds: string[]; effort: number } {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const incoming = new Map<string, string[]>(
    nodes.map((node) => [node.id, []]),
  );
  for (const edge of edges) {
    if (byId.has(edge.source) && byId.has(edge.target))
      incoming.get(edge.target)?.push(edge.source);
  }
  const ids = nodes.map((node) => node.id).sort();
  const best = new Map<string, { total: number; previous: string | null }>();

  for (const id of ids) {
    const node = byId.get(id) as ExecutionNode;
    const predecessors = (incoming.get(id) ?? []).slice().sort();
    let base = 0;
    let previousId: string | null = null;
    for (const predecessor of predecessors) {
      const candidate = best.get(predecessor);
      if (!candidate) continue;
      // Tie-break: equal totals go to the lexicographically smaller predecessor,
      // which keeps the reported path stable across runs.
      if (base === 0 && previousId === null && candidate.total === 0) {
        base = 0;
        previousId = predecessor;
        continue;
      }
      if (
        previousId === null ||
        candidate.total > base ||
        (candidate.total === base && predecessor < previousId)
      ) {
        base = candidate.total;
        previousId = predecessor;
      }
    }
    best.set(id, {
      total: Number((base + effortOf(node, bound)).toFixed(3)),
      previous: previousId,
    });
  }

  let head: string | null = null;
  for (const [id, entry] of best) {
    if (!head || entry.total > (best.get(head)?.total ?? -1)) head = id;
  }
  const path: string[] = [];
  let cursor = head;
  const guard = nodes.length + 1;
  while (cursor && path.length <= guard) {
    path.push(cursor);
    cursor = best.get(cursor)?.previous ?? null;
  }
  path.reverse();
  return { nodeIds: path, effort: head ? (best.get(head)?.total ?? 0) : 0 };
}

export function computeCriticalPath(
  nodes: ExecutionNode[],
  edges: GraphEdge[],
): CriticalPath {
  const worst = longestPath(nodes, edges, "maximum");
  const optimistic = longestPath(nodes, edges, "minimum");
  return {
    nodeIds: worst.nodeIds,
    effort: Number(worst.effort.toFixed(2)),
    optimisticNodeIds: optimistic.nodeIds,
    optimisticEffort: Number(optimistic.effort.toFixed(2)),
    tieBreak:
      "Longest total effort over effort.maximum; when two predecessors tie, the path arriving through the lexicographically smaller node id wins.",
  };
}

export function computeAggregates(
  nodes: ExecutionNode[],
  edges: GraphEdge[],
  waves: Wave[],
  criticalPath: CriticalPath,
): GraphAggregates {
  const incoming = new Set(edges.map((edge) => edge.target));
  const outgoing = new Set(edges.map((edge) => edge.source));
  const sum = (bound: "minimum" | "maximum" | "likely") =>
    Number(
      nodes
        .map((node) => node.effort[bound])
        .filter((value): value is number => typeof value === "number")
        .reduce((total, value) => total + value, 0)
        .toFixed(2),
    );

  const criticalIds = new Set(criticalPath.nodeIds);
  const duration = nodes
    .filter((node) => criticalIds.has(node.id))
    .reduce(
      (total, node) =>
        node.effort.maximum === null ? total : total + node.effort.maximum,
      0,
    );

  return {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    waveCount: waves.length,
    totalEffortMin: sum("minimum"),
    totalEffortMax: sum("maximum"),
    totalEffortLikely: sum("likely"),
    effortUnit: "person-days",
    criticalPathEffort: criticalPath.effort,
    durationEstimate: Number(duration.toFixed(2)),
    durationBasis:
      "Sum of effort.maximum along the critical path. Nodes whose effort is not in the imported package contribute 0 and are listed in nodesMissingEffort.",
    parallelGroups: waves
      .filter((wave) => wave.nodeIds.length > 1)
      .map((wave) => ({
        wave: wave.index,
        size: wave.nodeIds.length,
        nodeIds: wave.nodeIds,
      })),
    nodesMissingEffort: nodes
      .filter((node) => node.effort.maximum === null)
      .map((node) => node.id)
      .sort(),
    reviewCheckpoints: nodes
      .filter((node) => node.humanReviewRequired)
      .map((node) => node.id)
      .sort(),
    entryNodes: nodes
      .filter((node) => !incoming.has(node.id))
      .map((node) => node.id)
      .sort(),
    terminalNodes: nodes
      .filter((node) => !outgoing.has(node.id))
      .map((node) => node.id)
      .sort(),
    orphanNodes: nodes
      .filter((node) => !incoming.has(node.id) && !outgoing.has(node.id))
      .map((node) => node.id)
      .sort(),
    blockedNodes: nodes
      .filter((node) => node.blockingStatus === "blocked")
      .map((node) => node.id)
      .sort(),
    unsupportedNodes: nodes
      .filter(
        (node) =>
          node.sourceIds.length === 0 && node.anchors.backlogSourceId === null,
      )
      .map((node) => node.id)
      .sort(),
  };
}

export function effortOfNode(node: ExecutionNode): number {
  return node.effort.maximum ?? 0;
}

export { byIdSafe };
function byIdSafe(nodes: ExecutionNode[]): Map<string, ExecutionNode> {
  return new Map(nodes.map((node) => [node.id, node]));
}
