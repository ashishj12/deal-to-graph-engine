/**
 * Change impact (FR6).
 *
 * After any edit the caller recompiles the graph and hands both revisions here.
 * The diff reports every consequence the specification asks for, and — critically
 * — it verifies that nodes which were not touched came back byte-for-byte
 * identical. If they did not, `preservedExactly` is false and the UI says so
 * instead of quietly presenting a rewritten plan.
 */

import type {
  ChangeImpact,
  ExecutionGraph,
  ExecutionNode,
  FieldChange,
} from "../canonical/execution";

function nodeById(graph: ExecutionGraph): Map<string, ExecutionNode> {
  return new Map(graph.nodes.map((node) => [node.id, node]));
}

function waveOf(graph: ExecutionGraph, nodeId: string): number | null {
  const wave = graph.waves.find((entry) => entry.nodeIds.includes(nodeId));
  return wave ? wave.index : null;
}

function edgeKey(source: string, target: string): string {
  return `${source}->${target}`;
}

function packageSignature(node: ExecutionNode): string {
  return JSON.stringify({
    model: node.operatingModel.primary,
    category: node.workCategory,
    deliverables: node.deliverables,
    acceptance: node.acceptanceConditions,
    inputs: node.inputs,
    effort: node.effort,
    roles: node.roles,
    skills: node.requiredSkills,
    components: node.anchors.componentIds,
    deps: node.dependsOn,
  });
}

export interface ImpactInput {
  before: ExecutionGraph;
  after: ExecutionGraph;
  changes: FieldChange[];
}

export function diffGraphs(input: ImpactInput): ChangeImpact {
  const beforeNodes = nodeById(input.before);
  const afterNodes = nodeById(input.after);
  const beforeEdges = new Map(input.before.edges.map((edge) => [edgeKey(edge.source, edge.target), edge]));
  const afterEdges = new Map(input.after.edges.map((edge) => [edgeKey(edge.source, edge.target), edge]));

  const added: string[] = [];
  const removed: string[] = [];
  const retyped: { id: string; from: ExecutionGraph["edges"][number]["type"]; to: ExecutionGraph["edges"][number]["type"] }[] = [];
  for (const [key, edge] of afterEdges) {
    const previous = beforeEdges.get(key);
    if (!previous) {
      added.push(key);
    } else if (previous.type !== edge.type) {
      retyped.push({ id: edge.id, from: previous.type, to: edge.type });
    }
  }
  for (const key of beforeEdges.keys()) {
    if (!afterEdges.has(key)) removed.push(key);
  }

  const touched = new Set(input.changes.map((change) => change.nodeId));
  const affected = new Set<string>(touched);
  const modelChanges: ChangeImpact["modelChanges"] = [];
  const waveChanges: ChangeImpact["waveChanges"] = [];
  const invalidated = new Set<string>();
  const regenerated = new Set<string>();

  const ids = [...new Set([...beforeNodes.keys(), ...afterNodes.keys()])].sort();
  for (const id of ids) {
    const previous = beforeNodes.get(id);
    const next = afterNodes.get(id);
    if (!previous && next) {
      affected.add(id);
      regenerated.add(id);
      if (next.kind === "delivery") invalidated.add(id);
      continue;
    }
    if (previous && !next) {
      affected.add(id);
      invalidated.delete(id);
      continue;
    }
    if (!previous || !next) continue;

    const beforeJson = JSON.stringify(previous);
    const afterJson = JSON.stringify(next);
    if (beforeJson === afterJson && !touched.has(id)) continue;

    if (!affected.has(id)) affected.add(id);
    if (previous.operatingModel.primary !== next.operatingModel.primary) {
      modelChanges.push({
        nodeId: id,
        from: previous.operatingModel.primary,
        to: next.operatingModel.primary,
      });
      invalidated.add(id);
    }
    const beforeWave = waveOf(input.before, id);
    const afterWave = waveOf(input.after, id);
    if (beforeWave !== afterWave) {
      waveChanges.push({ nodeId: id, from: beforeWave ?? 0, to: afterWave ?? 0 });
    }
    if (packageSignature(previous) !== packageSignature(next)) {
      invalidated.add(id);
      regenerated.add(id);
    }
    if (previous.readiness !== next.readiness) regenerated.add(id);
  }

  // Edge changes pull their endpoints into the affected set.
  for (const key of [...added, ...removed]) {
    for (const id of key.split("->")) affected.add(id);
  }
  for (const edge of retyped) {
    const match = input.after.edges.find((entry) => entry.id === edge.id);
    if (match) {
      affected.add(match.source);
      affected.add(match.target);
    }
  }

  const newEffort = input.after.aggregates.totalEffortMax;
  const oldEffort = input.before.aggregates.totalEffortMax;
  const newlyBlocked: string[] = [];
  const newlyReady: string[] = [];
  const newlyUnsupported: string[] = [];
  for (const id of ids) {
    const previous = beforeNodes.get(id);
    const next = afterNodes.get(id);
    if (!next) continue;
    if (previous?.readiness !== "blocked" && next.readiness === "blocked") newlyBlocked.push(id);
    if (previous?.readiness !== "ready" && next.readiness === "ready") newlyReady.push(id);
    const previouslyUnsupported = previous ? previous.sourceIds.length === 0 : false;
    const nowUnsupported = next.sourceIds.length === 0 && next.kind !== "approval";
    if (!previouslyUnsupported && nowUnsupported) newlyUnsupported.push(id);
  }

  const unaffected = ids.filter((id) => !affected.has(id) && afterNodes.has(id) && beforeNodes.has(id));
  const preservedExactly = unaffected.every(
    (id) => JSON.stringify(beforeNodes.get(id)) === JSON.stringify(afterNodes.get(id)),
  );

  const criticalBefore = input.before.criticalPath.nodeIds.join(" → ");
  const criticalAfter = input.after.criticalPath.nodeIds.join(" → ");
  const criticalPathChanged = criticalBefore !== criticalAfter;

  const summary: string[] = [];
  summary.push(
    input.changes.length === 0
      ? "No field edits were supplied; the comparison reflects a recompilation."
      : `${input.changes.length} field change(s) across ${new Set(input.changes.map((change) => change.nodeId)).size} node(s).`,
  );
  if (modelChanges.length > 0) {
    summary.push(
      `Operating model changed on ${modelChanges.length} node(s): ${modelChanges
        .map((change) => `${change.nodeId} ${change.from} → ${change.to}`)
        .join(", ")}.`,
    );
  }
  summary.push(
    `${newEffort - oldEffort >= 0 ? "+" : ""}${Number((newEffort - oldEffort).toFixed(2))} person-days of graph effort (${oldEffort} → ${newEffort}).`,
  );
  if (criticalPathChanged) {
    summary.push(`The critical path changed from ${criticalBefore || "none"} to ${criticalAfter || "none"}.`);
  }
  if (waveChanges.length > 0) {
    summary.push(`${waveChanges.length} node(s) moved wave.`);
  }
  if (invalidated.size > 0) {
    summary.push(`${invalidated.size} execution package(s) must be regenerated.`);
  }
  if (added.length + removed.length > 0) {
    summary.push(`${added.length} dependency(ies) added, ${removed.length} removed.`);
  }
  summary.push(
    preservedExactly
      ? `${unaffected.length} untouched node(s) came back byte-identical.`
      : "WARNING: an untouched node changed; the recompiler is not preserving unaffected work.",
  );

  return {
    dealId: input.after.dealId,
    fromRevision: input.before.revision,
    toRevision: input.after.revision,
    changed: input.changes,
    affectedNodes: [...affected].sort(),
    unaffectedNodes: unaffected,
    preservedExactly,
    changedEdges: { added, removed, retyped },
    invalidatedPackages: [...invalidated].sort(),
    modelChanges,
    waveChanges,
    criticalPath: {
      before: input.before.criticalPath.nodeIds,
      after: input.after.criticalPath.nodeIds,
      changed: criticalPathChanged,
      effortDelta: Number((input.after.criticalPath.effort - input.before.criticalPath.effort).toFixed(2)),
    },
    effortDelta: Number((newEffort - oldEffort).toFixed(2)),
    durationDelta: Number(
      (input.after.aggregates.durationEstimate - input.before.aggregates.durationEstimate).toFixed(2),
    ),
    newlyBlocked,
    newlyReady,
    newlyUnsupported,
    regeneratedNodes: [...regenerated].sort(),
    summary,
  };
}
