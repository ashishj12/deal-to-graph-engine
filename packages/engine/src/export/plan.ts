import type {
  ExecutionNode,
  QualityReport,
  Wave,
} from "../canonical/execution";
import type { ModelPackage } from "../packages/types";
import type { CompiledDeal } from "../compile";
import { provenanceLabel } from "../canonical/provenance";
import { MOCK_NOTICE } from "../ai";

function table(headers: string[], rows: string[][]): string {
  const head = `| ${headers.join(" | ")} |`;
  const rule = `| ${headers.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${row.join(" | ")} |`);
  return [head, rule, ...body].join("\n");
}

function escapeCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\n+/g, " ");
}

function formatEffort(node: ExecutionNode): string {
  if (node.effort.maximum === null) return "needs input";
  const { minimum, maximum, unit } = node.effort;
  return `${minimum ?? "?"}–${maximum} ${unit ?? ""}`.trim();
}

export function packageToMarkdown(
  pkg: ModelPackage,
  node: ExecutionNode,
): string {
  const lines: string[] = [];
  const modelTitle =
    pkg.model === "flexible-talent"
      ? "Flexible Talent package"
      : pkg.model === "challenge"
        ? "Challenge package"
        : "Private Pod package";
  lines.push(`# ${modelTitle}: ${node.title}`);
  lines.push("");
  lines.push(
    table(
      ["Field", "Value"],
      [
        ["Node id", node.id],
        ["Work category", node.workCategory],
        ["Operating model", node.operatingModel.primary],
        ["Classification confidence", node.operatingModel.confidence],
        ["Readiness", node.readiness],
        [
          "Handoff ready",
          pkg.complete && node.readiness === "ready" ? "yes" : "no",
        ],
        ["Provenance", provenanceLabel(node.provenance)],
        ["Source ids", node.sourceIds.join(", ") || "none"],
      ],
    ),
  );
  lines.push("");
  lines.push("## Classification rationale");
  lines.push("");
  for (const reason of node.operatingModel.rationale) lines.push(`- ${reason}`);
  if (node.operatingModel.splitRecommended && node.operatingModel.splitReason) {
    lines.push("");
    lines.push(`> Split recommended: ${node.operatingModel.splitReason}`);
  }
  lines.push("");

  const sections: [string, string | string[] | null][] =
    pkg.model === "flexible-talent"
      ? [
          ["Required roles", pkg.roles],
          ["Required skills", pkg.skills],
          ["Seniority or experience", pkg.seniority],
          [
            "Duration or capacity",
            [pkg.duration, pkg.capacity].filter((value): value is string =>
              Boolean(value),
            ),
          ],
          ["Responsibilities", pkg.responsibilities],
          ["Start dependencies", pkg.startDependencies],
          [
            "Required access and environment",
            [...pkg.access, ...(pkg.environment ? [pkg.environment] : [])],
          ],
        ]
      : pkg.model === "challenge"
        ? [
            ["Challenge objective", pkg.objective],
            ["Business context", pkg.businessContext],
            ["Technical context", pkg.technicalContext],
            ["Deliverables", pkg.deliverables],
            ["Evaluation criteria", pkg.evaluationCriteria],
            ["Acceptance conditions", pkg.acceptanceConditions],
            ["Input assets", pkg.inputAssets],
            [
              "Required technologies or skills",
              [...pkg.technologies, ...pkg.skills],
            ],
            ["Dependencies", pkg.dependencies],
            ["Confidentiality limitations", pkg.confidentialityLimitations],
            ["Expected review process", pkg.expectedReviewProcess],
          ]
        : [
            ["Pod objective", pkg.objective],
            ["Required roles and skills", [...pkg.roles, ...pkg.skills]],
            ["Technical leadership", pkg.technicalLeadership],
            ["Component ownership", pkg.componentOwnership],
            ["Delivery responsibilities", pkg.deliveryResponsibilities],
            ["Security and access", pkg.securityAndAccess],
            ["Coordination dependencies", pkg.coordinationDependencies],
            ["Expected duration", pkg.expectedDuration],
            ["Definition of completion", pkg.definitionOfCompletion],
          ];

  for (const [heading, value] of sections) {
    lines.push(`## ${heading}`);
    lines.push("");
    if (value === null || (Array.isArray(value) && value.length === 0)) {
      lines.push(
        "_Not present in the imported package — the operator must supply this before handoff._",
      );
    } else if (Array.isArray(value)) {
      for (const entry of value) lines.push(`- ${entry}`);
    } else {
      lines.push(value);
    }
    lines.push("");
  }

  lines.push("## Completeness");
  lines.push("");
  lines.push(
    pkg.complete
      ? "Every field this operating model requires is present."
      : `Missing: ${pkg.missingFields.join(", ")}`,
  );
  for (const note of pkg.readinessNotes) lines.push(`- ${note}`);
  lines.push("");
  lines.push(`> ${MOCK_NOTICE}`);
  return lines.join("\n");
}

export function toExecutionPlanMarkdown(compiled: CompiledDeal): string {
  const { graph, quality } = compiled;
  const lines: string[] = [];
  lines.push(`# Execution plan: ${graph.dealTitle}`);
  lines.push("");
  lines.push(
    table(
      ["Field", "Value"],
      [
        ["Deal id", graph.dealId],
        ["Package maturity", graph.maturity],
        ["Graph revision", String(graph.revision)],
        ["Nodes", String(graph.aggregates.nodeCount)],
        ["Dependencies", String(graph.aggregates.edgeCount)],
        ["Waves", String(graph.aggregates.waveCount)],
        [
          "Operating models",
          `${graph.operatingModelSummary.flexibleTalent} flexible-talent · ${graph.operatingModelSummary.challenge} challenge · ${graph.operatingModelSummary.privatePod} private-pod`,
        ],
        [
          "Graph effort",
          `${graph.aggregates.totalEffortMin}–${graph.aggregates.totalEffortMax} ${graph.aggregates.effortUnit}`,
        ],
        [
          "Critical path",
          `${graph.criticalPath.nodeIds.length} node(s), ${graph.criticalPath.effort} ${graph.aggregates.effortUnit}`,
        ],
        [
          "Duration estimate",
          `${graph.aggregates.durationEstimate} ${graph.aggregates.effortUnit}`,
        ],
        ["Quality gate", quality.status],
        ["Generator", `${graph.generator.provider} (${graph.generator.mode})`],
      ],
    ),
  );
  lines.push("");
  lines.push(`> ${graph.generator.notice}`);
  lines.push("");

  lines.push("## Execution waves");
  lines.push("");
  for (const wave of graph.waves) {
    lines.push(
      `### Wave ${wave.index} — ${wave.nodeIds.length} node(s), ${wave.effort} ${graph.aggregates.effortUnit}`,
    );
    lines.push("");
    lines.push(
      table(
        ["Node", "Title", "Model", "Category", "Readiness"],
        wave.nodeIds
          .map((id) => graph.nodes.find((node) => node.id === id))
          .filter((node): node is ExecutionNode => Boolean(node))
          .map((node) => [
            node.id,
            escapeCell(node.title),
            node.operatingModel.primary,
            node.workCategory,
            node.readiness,
          ]),
      ),
    );
    lines.push("");
  }

  lines.push("## Critical path");
  lines.push("");
  lines.push(`Tie-break rule: ${graph.criticalPath.tieBreak}`);
  lines.push("");
  lines.push(
    table(
      ["Order", "Node", "Title", "Effort"],
      graph.criticalPath.nodeIds.map((id, index) => {
        const node = graph.nodes.find((entry) => entry.id === id);
        return [
          String(index + 1),
          id,
          escapeCell(node?.title ?? ""),
          formatEffort(node as ExecutionNode),
        ];
      }),
    ),
  );
  lines.push("");
  lines.push(
    `Optimistic path (effort.minimum): ${graph.criticalPath.optimisticEffort} ${graph.aggregates.effortUnit} — ${graph.criticalPath.optimisticNodeIds.join(" → ")}`,
  );
  lines.push("");

  lines.push("## Node inventory");
  lines.push("");
  lines.push(
    table(
      [
        "Node",
        "Title",
        "Model",
        "Category",
        "Kind",
        "Effort",
        "Readiness",
        "Blocked by",
        "Source ids",
      ],
      graph.nodes.map((node) => [
        node.id,
        escapeCell(node.title),
        node.operatingModel.primary,
        node.workCategory,
        node.kind,
        formatEffort(node),
        node.readiness,
        node.blockedBy.join(", ") || "—",
        node.sourceIds.join(", ") || "—",
      ]),
    ),
  );
  lines.push("");

  lines.push("## Dependencies");
  lines.push("");
  lines.push(
    table(
      ["Edge", "From", "To", "Type", "Blocking", "Handoff", "Rationale"],
      graph.edges.map((edge) => [
        edge.id,
        edge.source,
        edge.target,
        edge.type,
        edge.blocking ? "yes" : "no",
        escapeCell(edge.handoff),
        escapeCell(edge.rationale),
      ]),
    ),
  );
  lines.push("");

  lines.push("## Quality gate");
  lines.push("");
  lines.push(`Status: **${quality.status}** (score ${quality.score}/100)`);
  lines.push("");
  lines.push(
    table(
      ["Rule", "Status", "Finding"],
      quality.findings.map((finding) => [
        finding.rule,
        finding.status,
        escapeCell(finding.message),
      ]),
    ),
  );
  lines.push("");

  lines.push("## Traceability");
  lines.push("");
  lines.push(
    table(
      ["Source", "Kind", "Title", "Nodes", "Covered"],
      graph.traceability.map((row) => [
        row.sourceId,
        row.sourceKind,
        escapeCell(row.sourceTitle),
        row.nodeIds.join(", ") || "—",
        row.covered ? "yes" : "no",
      ]),
    ),
  );
  lines.push("");
  lines.push("## Notes");
  lines.push("");
  for (const note of compiled.notes) lines.push(`- ${note}`);
  lines.push("");
  lines.push(
    "Blocked or incomplete nodes are marked `not ready for operational handoff`. This document is a planning aid: it never recruits talent, launches a challenge or commits delivery.",
  );
  lines.push("");
  return lines.join("\n");
}

export function wavesToMarkdown(waves: Wave[]): string {
  return table(
    ["Wave", "Nodes", "Effort", "Flexible talent", "Challenge", "Private pod"],
    waves.map((wave) => [
      String(wave.index),
      String(wave.nodeIds.length),
      String(wave.effort),
      String(wave.models.flexibleTalent),
      String(wave.models.challenge),
      String(wave.models.privatePod),
    ]),
  );
}

export function qualityToMarkdown(quality: QualityReport): string {
  return table(
    ["Rule", "Status", "Message"],
    quality.findings.map((finding) => [
      finding.rule,
      finding.status,
      escapeCell(finding.message),
    ]),
  );
}
