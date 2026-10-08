import type {
  ExecutionGraph,
  ExecutionNode,
  QualityGateFinding,
  QualityReport,
  QualityStatus,
} from "../canonical/execution";
import type { CanonicalPackage } from "../canonical/types";
import type { DecisionLog } from "../canonical/execution";

export interface QualityInput {
  graph: ExecutionGraph;
  canonical: CanonicalPackage;
  decisions: DecisionLog;
  /** ISO timestamp supplied by the caller so runs are reproducible in tests. */
  generatedAt: string;
}

function finding(
  id: string,
  rule: string,
  status: QualityGateFinding["status"],
  message: string,
  detail: string,
  nodeIds: string[] = [],
  sourceIds: string[] = [],
): QualityGateFinding {
  return {
    id,
    rule,
    status,
    severity:
      status === "fail" ? "error" : status === "warn" ? "warning" : "info",
    message,
    detail,
    nodeIds,
    sourceIds,
    // The gate never asks a model, so every finding is deterministic.
    provenance: "deterministic",
  };
}

function coveragePercent(covered: number, total: number): number {
  if (total === 0) return 100;
  return Math.round((covered / total) * 100);
}

export function runQualityGate(input: QualityInput): QualityReport {
  const { graph, canonical, decisions } = input;
  const nodes = graph.nodes;
  const findings: QualityGateFinding[] = [];
  const deliveryNodes = nodes.filter((node) => node.kind === "delivery");

  // 1. Source coverage across the imported model.
  const trackable = [
    ...canonical.scope.requirements
      .filter((item) => item.inScope)
      .map((item) => item.id),
    ...canonical.architecture.components.map((component) => component.id),
    ...canonical.strategy.integrations.map((integration) => integration.id),
    ...canonical.strategy.aiUseCases.map((useCase) => useCase.id),
  ];
  const covered = graph.traceability
    .filter((row) => row.covered)
    .map((row) => row.sourceId);
  const coverage = coveragePercent(new Set(covered).size, trackable.length);
  const requirementCoverage = coveragePercent(
    graph.traceability.filter(
      (row) =>
        row.covered &&
        row.sourceKind !== "component" &&
        row.sourceKind !== "integration" &&
        row.sourceKind !== "aiUseCase",
    ).length,
    graph.traceability.filter(
      (row) =>
        row.sourceKind !== "component" &&
        row.sourceKind !== "integration" &&
        row.sourceKind !== "aiUseCase",
    ).length,
  );
  const uncovered = trackable.filter((id) => !covered.includes(id));
  findings.push(
    finding(
      "QUALITY_COVERAGE",
      "source-coverage",
      coverage >= 80 ? "pass" : coverage >= 50 ? "warn" : "fail",
      `Source coverage is ${coverage}% (${new Set(covered).size}/${trackable.length} requirements, components, integrations and AI use cases are referenced by at least one node).`,
      uncovered.length > 0
        ? `Uncovered: ${uncovered.join(", ")}`
        : "Every trackable source is reflected in the graph.",
      [],
      uncovered,
    ),
  );

  // 2. Unsupported nodes.
  const unsupported = nodes.filter(
    (node) =>
      node.sourceIds.length === 0 &&
      node.anchors.backlogSourceId === null &&
      node.kind !== "approval",
  );
  findings.push(
    finding(
      "QUALITY_UNSUPPORTED",
      "unsupported-nodes",
      unsupported.length === 0 ? "pass" : "fail",
      unsupported.length === 0
        ? "Every node cites an imported source or an approved user decision."
        : `${unsupported.length} node(s) are unsupported and cannot be handed off.`,
      unsupported.map((node) => `${node.id} (${node.title})`).join("; ") ||
        "No unsupported nodes.",
      unsupported.map((node) => node.id),
    ),
  );

  // 3. Duplicate or overlapping scope.
  const bySignature = new Map<string, ExecutionNode[]>();
  for (const node of nodes) {
    const key = `${node.anchors.capabilityId ?? "-"}|${node.workCategory}|${[...node.sourceIds].sort().join(",")}`;
    bySignature.set(key, [...(bySignature.get(key) ?? []), node]);
  }
  const overlapping = [...bySignature.values()].filter(
    (group) => group.length > 1,
  );
  findings.push(
    finding(
      "QUALITY_DUPLICATE_SCOPE",
      "duplicate-scope",
      overlapping.length === 0 ? "pass" : "warn",
      overlapping.length === 0
        ? "No two nodes claim the same category over the same sources."
        : `${overlapping.length} group(s) of nodes share a category and identical sources.`,
      overlapping
        .map((group) => group.map((node) => node.id).join(" + "))
        .join("; ") || "No overlap detected.",
      overlapping.flatMap((group) => group.map((node) => node.id)),
    ),
  );

  // 4. Missing inputs and acceptance conditions.
  const missingAcceptance = deliveryNodes.filter(
    (node) => node.acceptanceConditions.length === 0,
  );
  const missingInputs = deliveryNodes.filter(
    (node) => node.inputs.length === 0,
  );
  findings.push(
    finding(
      "QUALITY_ACCEPTANCE",
      "missing-acceptance",
      missingAcceptance.length === 0 ? "pass" : "warn",
      missingAcceptance.length === 0
        ? "Every delivery node carries at least one acceptance condition taken from the package."
        : `${missingAcceptance.length} delivery node(s) have no acceptance condition in the package.`,
      missingAcceptance.map((node) => node.id).join(", ") ||
        "All delivery nodes have acceptance conditions.",
      missingAcceptance.map((node) => node.id),
    ),
  );
  findings.push(
    finding(
      "QUALITY_INPUTS",
      "missing-inputs",
      missingInputs.length === 0 ? "pass" : "warn",
      missingInputs.length === 0
        ? "Every delivery node lists the inputs it needs."
        : `${missingInputs.length} delivery node(s) do not state what they need to start.`,
      missingInputs.map((node) => node.id).join(", ") ||
        "All delivery nodes list inputs.",
      missingInputs.map((node) => node.id),
    ),
  );

  // 5. Classification completeness: one model per executable node.
  const invalidModels = nodes.filter(
    (node) =>
      !["flexible-talent", "challenge", "private-pod"].includes(
        node.operatingModel.primary,
      ),
  );
  const modelCounts = nodes.filter(
    (node) => node.operatingModel.primary,
  ).length;
  findings.push(
    finding(
      "QUALITY_MODEL_COVERAGE",
      "classification-completeness",
      invalidModels.length === 0 && modelCounts === nodes.length
        ? "pass"
        : "fail",
      `${modelCounts}/${nodes.length} nodes carry exactly one primary operating model.`,
      invalidModels.map((node) => node.id).join(", ") ||
        "Every node has exactly one primary model.",
      invalidModels.map((node) => node.id),
    ),
  );

  // 6. Rationale present on every classification.
  const missingRationale = nodes.filter(
    (node) => node.operatingModel.rationale.length === 0,
  );
  findings.push(
    finding(
      "QUALITY_RATIONALE",
      "missing-rationale",
      missingRationale.length === 0 ? "pass" : "fail",
      missingRationale.length === 0
        ? "Every classification explains itself in plain English."
        : `${missingRationale.length} node(s) are classified without a rationale.`,
      missingRationale.map((node) => node.id).join(", ") ||
        "All classifications carry a rationale.",
      missingRationale.map((node) => node.id),
    ),
  );

  // 7. Model-to-work mismatch.
  const mismatch: ExecutionNode[] = [];
  const mismatchDetail: string[] = [];
  for (const node of nodes) {
    const sensitive = canonical.strategy.dataDomains.some(
      (domain) =>
        node.anchors.domainIds.includes(domain.id) && domain.regulated,
    );
    if (node.operatingModel.primary === "challenge" && sensitive) {
      mismatch.push(node);
      mismatchDetail.push(
        `${node.id} is an open challenge over regulated data`,
      );
    }
    if (
      node.operatingModel.primary === "flexible-talent" &&
      (node.roles.length >= 3 || node.anchors.componentIds.length >= 4)
    ) {
      mismatch.push(node);
      mismatchDetail.push(
        `${node.id} is single-specialist work that spans ${node.roles.length} roles and ${node.anchors.componentIds.length} components`,
      );
    }
    if (
      node.operatingModel.primary === "private-pod" &&
      node.roles.length === 1 &&
      node.anchors.componentIds.length === 0
    ) {
      mismatch.push(node);
      mismatchDetail.push(
        `${node.id} is a pod with one role and no owned component`,
      );
    }
  }
  findings.push(
    finding(
      "QUALITY_MODEL_MISMATCH",
      "model-to-work-mismatch",
      mismatch.length === 0 ? "pass" : "warn",
      mismatch.length === 0
        ? "No operating model contradicts the work it covers."
        : `${mismatch.length} node(s) may be classified against their work profile.`,
      mismatchDetail.join("; ") || "No mismatch detected.",
      mismatch.map((node) => node.id),
    ),
  );

  // 8. Model-specific package completeness.
  const incomplete = nodes.filter((node) => node.modelFieldsMissing.length > 0);
  findings.push(
    finding(
      "QUALITY_PACKAGE_FIELDS",
      "missing-package-fields",
      incomplete.length === 0 ? "pass" : "warn",
      incomplete.length === 0
        ? "Every node's operating-model package is complete."
        : `${incomplete.length} node(s) are missing information their operating model requires.`,
      incomplete
        .map((node) => `${node.id}: ${node.modelFieldsMissing.join(", ")}`)
        .join("; ") || "All model packages complete.",
      incomplete.map((node) => node.id),
    ),
  );

  // 9. Cycles and orphans.
  const cycles = graph.findings.filter((item) => item.code === "cycle");
  const orphans = graph.findings.filter((item) => item.code === "orphan-node");
  findings.push(
    finding(
      "QUALITY_CYCLES",
      "cycles",
      cycles.length === 0 ? "pass" : "fail",
      cycles.length === 0
        ? "The dependency graph is acyclic."
        : `${cycles.length} dependency cycle(s) detected: ${cycles.flatMap((item) => item.cyclePath).join(" → ")}`,
      cycles.map((item) => item.message).join("; ") || "No cycles.",
      cycles.flatMap((item) => item.nodeIds),
    ),
  );
  findings.push(
    finding(
      "QUALITY_ORPHANS",
      "orphan-nodes",
      orphans.length === 0 ? "pass" : "warn",
      orphans.length === 0
        ? "Every delivery node is connected to the graph."
        : `${orphans.flatMap((item) => item.nodeIds).length} node(s) are unconnected in both directions.`,
      orphans.flatMap((item) => item.nodeIds).join(", ") || "No orphans.",
      orphans.flatMap((item) => item.nodeIds),
    ),
  );

  // 10. Invalid dependencies.
  const invalidEdges = graph.findings.filter(
    (item) =>
      item.code === "invalid-edge" ||
      item.code === "self-dependency" ||
      item.code === "dangling-node",
  );
  findings.push(
    finding(
      "QUALITY_INVALID_DEPS",
      "invalid-dependencies",
      invalidEdges.length === 0 ? "pass" : "fail",
      invalidEdges.length === 0
        ? "Every edge has a known type, a rationale and source identifiers."
        : `${invalidEdges.length} dependency problem(s) detected.`,
      invalidEdges.map((item) => item.message).join("; ") ||
        "No invalid dependencies.",
      invalidEdges.flatMap((item) => item.nodeIds),
    ),
  );

  // 11. Blocked and stale nodes.
  const blocked = nodes.filter((node) => node.blockingStatus === "blocked");
  const staleSections =
    graph.maturity === "review-required" ||
    graph.maturity === "discovery-required";
  findings.push(
    finding(
      "QUALITY_BLOCKED",
      "blocked-or-stale",
      blocked.length === 0 && !staleSections ? "pass" : "warn",
      blocked.length === 0
        ? "No node is blocked by an unresolved item."
        : `${blocked.length} node(s) are blocked: ${blocked.map((node) => node.id).join(", ")}`,
      staleSections
        ? `The imported package is ${graph.maturity}, so the plan stays provisional until the blockers clear.`
        : "No blocked nodes.",
      blocked.map((node) => node.id),
    ),
  );

  // 12. Critical-path completeness.
  const criticalIds = graph.criticalPath.nodeIds;
  const criticalMissingEffort = nodes.filter(
    (node) => criticalIds.includes(node.id) && node.effort.maximum === null,
  );
  findings.push(
    finding(
      "QUALITY_CRITICAL_PATH",
      "critical-path-completeness",
      criticalMissingEffort.length === 0 ? "pass" : "warn",
      criticalMissingEffort.length === 0
        ? `The critical path (${criticalIds.length} node(s), ${graph.criticalPath.effort} person-days) is fully estimated.`
        : `${criticalMissingEffort.length} node(s) on the critical path have no effort in the package.`,
      criticalMissingEffort.map((node) => node.id).join(", ") ||
        "Critical path fully estimated.",
      criticalMissingEffort.map((node) => node.id),
    ),
  );

  // 13. Human approval of the graph.
  findings.push(
    finding(
      "QUALITY_APPROVAL",
      "human-approval",
      decisions.graphApproved ? "pass" : "warn",
      decisions.graphApproved
        ? `The graph was approved by an operator at ${decisions.approvedAt ?? "an earlier revision"}.`
        : "No operator has approved the graph yet; operational handoff needs a recorded human decision.",
      decisions.graphApproved
        ? "Approval recorded."
        : "Approve the graph to clear this finding.",
    ),
  );

  const counts = {
    pass: findings.filter((item) => item.status === "pass").length,
    warn: findings.filter((item) => item.status === "warn").length,
    fail: findings.filter((item) => item.status === "fail").length,
  };
  const status: QualityStatus =
    counts.fail > 0 ? "Blocked" : counts.warn > 0 ? "Review Required" : "Ready";
  const score = Math.max(0, 100 - counts.fail * 15 - counts.warn * 4);

  return {
    status,
    score,
    findings,
    counts,
    coverage: {
      requirements: requirementCoverage,
      components: coveragePercent(
        graph.traceability.filter(
          (row) => row.sourceKind === "component" && row.covered,
        ).length,
        graph.traceability.filter((row) => row.sourceKind === "component")
          .length,
      ),
      integrations: coveragePercent(
        graph.traceability.filter(
          (row) => row.sourceKind === "integration" && row.covered,
        ).length,
        graph.traceability.filter((row) => row.sourceKind === "integration")
          .length,
      ),
      aiUseCases: coveragePercent(
        graph.traceability.filter(
          (row) => row.sourceKind === "aiUseCase" && row.covered,
        ).length,
        graph.traceability.filter((row) => row.sourceKind === "aiUseCase")
          .length,
      ),
    },
    gatedOn: findings
      .filter((item) => item.status !== "pass")
      .map((item) => item.rule),
    generatedAt: input.generatedAt,
  };
}
