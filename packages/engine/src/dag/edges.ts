/**
 * Dependency generation (FR5).
 *
 * Edges are derived from the imported structure — capability dependencies,
 * architecture flows, shared requirements, delivery phases and the project's own
 * human-review boundaries — never from a guess. Every edge carries the source ids
 * and a rationale that a reviewer can check against the package.
 *
 * When the two ends of a handoff use different operating models the edge is typed
 * `model-handoff`, which is what the specification asks for instead of pretending
 * a single model owns both sides.
 */

import type { EdgeType, ExecutionNode, GraphEdge, WorkCategory } from "../canonical/execution";
import type { CanonicalPackage, OperatingModel } from "../canonical/types";

const CATEGORY_ORDER: WorkCategory[] = [
  "discovery",
  "ux-design",
  "frontend",
  "backend-api",
  "integration",
  "data-engineering",
  "ai-implementation",
  "security",
  "testing",
  "documentation",
  "deployment",
  "technical-review",
];

function categoryRank(category: WorkCategory): number {
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length : index;
}

/** The node that represents a capability's main implementation flow. */
export function flowNodeOf(capabilityId: string, nodes: ExecutionNode[]): ExecutionNode | null {
  const members = nodes
    .filter((node) => node.anchors.capabilityId === capabilityId && node.kind === "delivery")
    .sort((a, b) => categoryRank(a.workCategory) - categoryRank(b.workCategory) || a.id.localeCompare(b.id));
  return members[0] ?? null;
}

export interface EdgeDraft {
  source: string;
  target: string;
  type: EdgeType;
  rationale: string;
  sourceIds: string[];
  blocking: boolean;
  handoff: string;
}

function pushEdge(
  drafts: EdgeDraft[],
  nodeIndex: Map<string, ExecutionNode>,
  draft: EdgeDraft,
): void {
  const source = nodeIndex.get(draft.source);
  const target = nodeIndex.get(draft.target);
  // Both ends must exist and the edge must not point at its own node.
  if (!source || !target || source.id === target.id) return;
  // Exactly one edge per (source, target) pair: duplicates are a quality finding.
  if (drafts.some((entry) => entry.source === draft.source && entry.target === draft.target)) return;
  const modelsDiffer = source.operatingModel.primary !== target.operatingModel.primary;
  if (modelsDiffer && (draft.type === "design-handoff" || draft.type === "sequencing")) {
    drafts.push({
      ...draft,
      type: "model-handoff",
      rationale: `${draft.rationale} Handoff from ${source.operatingModel.primary} to ${target.operatingModel.primary}.`,
    });
    return;
  }
  drafts.push(draft);
}

export function buildEdgeDrafts(nodes: ExecutionNode[], canonical: CanonicalPackage): EdgeDraft[] {
  const drafts: EdgeDraft[] = [];
  const index = new Map(nodes.map((node) => [node.id, node]));
  const resolutionNodes = new Map<string, ExecutionNode>();
  for (const node of nodes) {
    if (node.anchors.backlogSourceId) resolutionNodes.set(node.anchors.backlogSourceId, node);
  }

  // 1. Blocking discovery: an open item gates the work that cites it.
  for (const node of nodes) {
    for (const gateId of node.blockedBy) {
      const resolver = resolutionNodes.get(gateId);
      if (!resolver) continue;
      pushEdge(drafts, index, {
        source: resolver.id,
        target: node.id,
        type: "blocking-discovery",
        rationale: `${resolver.id} must be resolved before this work is sequenced: ${resolver.objective}`,
        sourceIds: [gateId],
        blocking: true,
        handoff: `Resolution of ${gateId}`,
      });
    }
  }

  // 2. Capability dependencies become sequencing edges between capability flows.
  for (const capability of canonical.functionalScope.capabilities) {
    const target = flowNodeOf(capability.id, nodes);
    if (!target) continue;
    const dependencyIds = new Set<string>();
    for (const dependencyId of capability.resolvedDependencies) dependencyIds.add(dependencyId);
    for (const dependencyName of capability.dependencyNames) {
      const match = canonical.functionalScope.capabilities.find((entry) => entry.name === dependencyName);
      if (match) dependencyIds.add(match.id);
    }
    for (const dependencyId of [...dependencyIds].sort()) {
      const source = flowNodeOf(dependencyId, nodes);
      if (!source) continue;
      pushEdge(drafts, index, {
        source: source.id,
        target: target.id,
        type: "sequencing",
        rationale: `${capability.name} is declared to depend on ${dependencyId}; the imported capability record carries that relationship.`,
        sourceIds: [capability.id, dependencyId],
        blocking: true,
        handoff: `${dependencyId} delivered`,
      });
    }
  }

  // 3. Category handoffs inside a capability, in delivery order.
  for (const capability of canonical.functionalScope.capabilities) {
    const members = nodes
      .filter((node) => node.anchors.capabilityId === capability.id && node.kind === "delivery")
      .sort((a, b) => categoryRank(a.workCategory) - categoryRank(b.workCategory) || a.id.localeCompare(b.id));
    const byCategory = (category: WorkCategory) => members.filter((node) => node.workCategory === category);
    for (const design of byCategory("ux-design")) {
      for (const frontend of byCategory("frontend")) {
        pushEdge(drafts, index, {
          source: design.id,
          target: frontend.id,
          type: "design-handoff",
          rationale: `${frontend.title} needs the approved experience design from ${design.id}.`,
          sourceIds: [...new Set([...design.sourceIds, ...frontend.sourceIds])],
          blocking: true,
          handoff: "Approved experience design",
        });
      }
    }
    for (const backend of byCategory("backend-api")) {
      for (const integration of byCategory("integration")) {
        pushEdge(drafts, index, {
          source: backend.id,
          target: integration.id,
          type: "api-contract",
          rationale: `${integration.title} consumes the interface defined by ${backend.id}.`,
          sourceIds: [...new Set([...backend.sourceIds, ...integration.sourceIds])],
          blocking: true,
          handoff: "Agreed API contract",
        });
      }
    }
    for (const data of byCategory("data-engineering")) {
      for (const ai of byCategory("ai-implementation")) {
        pushEdge(drafts, index, {
          source: data.id,
          target: ai.id,
          type: "data-dependency",
          rationale: `${ai.title} trains or grounds on the data prepared by ${data.id}.`,
          sourceIds: [...new Set([...data.sourceIds, ...ai.sourceIds])],
          blocking: true,
          handoff: "Prepared data set",
        });
      }
    }
    for (const verification of byCategory("testing")) {
      for (const upstream of members.filter((node) => node.workCategory !== "testing")) {
        pushEdge(drafts, index, {
          source: upstream.id,
          target: verification.id,
          type: "sequencing",
          rationale: `${verification.title} verifies the output of ${upstream.id}.`,
          sourceIds: [...new Set([...upstream.sourceIds, ...verification.sourceIds])],
          blocking: true,
          handoff: "Deliverable ready for verification",
        });
      }
    }
    for (const security of byCategory("security")) {
      for (const implementation of members.filter((node) =>
        ["frontend", "backend-api", "integration", "data-engineering", "ai-implementation"].includes(node.workCategory),
      )) {
        pushEdge(drafts, index, {
          source: implementation.id,
          target: security.id,
          type: "security-gate",
          rationale: `${security.title} reviews the security controls of ${implementation.id} before release.`,
          sourceIds: [...new Set([...implementation.sourceIds, ...security.sourceIds])],
          blocking: true,
          handoff: "Security review",
        });
      }
    }
  }

  // 4. Human review checkpoints gate the work that shares their requirements.
  const reviewNodes = nodes.filter((node) => node.kind === "approval" && node.anchors.backlogSourceId === null);
  for (const review of reviewNodes) {
    const gated = nodes.filter(
      (node) =>
        node.id !== review.id &&
        node.kind === "delivery" &&
        node.anchors.requirementIds.some((id) => review.sourceIds.includes(id)),
    );
    for (const node of gated) {
      pushEdge(drafts, index, {
        source: node.id,
        target: review.id,
        type: "approval",
        rationale: `${review.title} is a declared human-decision boundary for the work on ${node.id}.`,
        sourceIds: review.sourceIds,
        blocking: false,
        handoff: "Human decision recorded",
      });
    }
  }

  // 5. Delivery phases run in the order the package lists them, and each phase
  //    absorbs the implementation work funded by its own estimate workstreams.
  const phaseNodes = nodes
    .filter((node) => node.anchors.phaseId !== null)
    .sort(
      (a, b) =>
        canonical.delivery.phases.findIndex((phase) => phase.id === a.anchors.phaseId) -
          canonical.delivery.phases.findIndex((phase) => phase.id === b.anchors.phaseId) ||
        a.id.localeCompare(b.id),
    );
  for (const [position, phaseNode] of phaseNodes.entries()) {
    const previous = phaseNodes[position - 1];
    if (previous) {
      pushEdge(drafts, index, {
        source: previous.id,
        target: phaseNode.id,
        type: "sequencing",
        rationale: `${phaseNode.title} follows ${previous.title} in the imported delivery plan.`,
        sourceIds: [...previous.sourceIds, ...phaseNode.sourceIds],
        blocking: true,
        handoff: `${previous.title} released`,
      });
    }
    const phase = canonical.delivery.phases.find((entry) => entry.id === phaseNode.anchors.phaseId);
    // A phase (release) node is never a *member* of another phase: it is excluded
    // structurally, so no workstream-assignment change can ever make one release
    // depend on a later one and close a cycle between releases.
    const members = nodes.filter(
      (node) =>
        node.kind === "delivery" &&
        node.anchors.phaseId === null &&
        node.anchors.estimateWorkstreamId !== null &&
        (phase?.workstreamIds ?? []).includes(node.anchors.estimateWorkstreamId),
    );
    for (const member of members) {
      pushEdge(drafts, index, {
        source: member.id,
        target: phaseNode.id,
        type: "sequencing",
        rationale: `Phase ${phaseNode.anchors.phaseId} covers estimate workstream ${member.anchors.estimateWorkstreamId}.`,
        sourceIds: [phaseNode.anchors.phaseId as string],
        blocking: true,
        handoff: "Deliverable accepted into the phase",
      });
    }
  }

  // 6. Everything terminal feeds the handoff approval node.
  const approval = nodes.find((node) => node.id.startsWith("NODE_OPERATIONAL_HANDOFF_APPROVAL"));
  if (approval) {
    const hasSuccessor = new Set(drafts.map((draft) => draft.source));
    const terminal = nodes.filter(
      (node) => node.id !== approval.id && !hasSuccessor.has(node.id) && drafts.some((draft) => draft.target === node.id),
    );
    for (const node of terminal.sort((a, b) => a.id.localeCompare(b.id))) {
      pushEdge(drafts, index, {
        source: node.id,
        target: approval.id,
        type: "approval",
        rationale: `${approval.title} requires ${node.title} to be complete.`,
        sourceIds: node.sourceIds,
        blocking: true,
        handoff: "Deliverable complete",
      });
    }
  }

  return drafts;
}

export function buildEdges(nodes: ExecutionNode[], canonical: CanonicalPackage): GraphEdge[] {
  const drafts = buildEdgeDrafts(nodes, canonical);
  const used = new Set<string>();
  return drafts
    .sort((a, b) => a.source.localeCompare(b.source) || a.target.localeCompare(b.target))
    .map((draft, position) => {
      let id = `EDGE_${String(position + 1).padStart(3, "0")}`;
      while (used.has(id)) id = `${id}_1`;
      used.add(id);
      return {
        id,
        source: draft.source,
        target: draft.target,
        type: draft.type,
        rationale: draft.rationale,
        sourceIds: [...new Set(draft.sourceIds)],
        blocking: draft.blocking,
        handoff: draft.handoff,
        provenance: "deterministic" as const,
      };
    });
}

/** True when the graph uses more than one operating model. */
export function modelMix(nodes: ExecutionNode[]): Record<OperatingModel, string[]> {
  const mix: Record<OperatingModel, string[]> = { "flexible-talent": [], challenge: [], "private-pod": [] };
  for (const node of nodes) mix[node.operatingModel.primary].push(node.id);
  return mix;
}
