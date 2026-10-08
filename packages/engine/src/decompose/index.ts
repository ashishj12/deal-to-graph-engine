/**
 * Delivery decomposition (FR3).
 *
 * Nodes are generated from the imported structure only. Nothing is invented:
 *
 *  - an open gap, question, unconfirmed assumption, stale section, platform
 *    conflict or missing estimation input produces a discovery, clarification or
 *    approval node, never an implementation node;
 *  - implementation nodes come from capabilities, integrations, AI use cases,
 *    security requirements, delivery phases and quality findings;
 *  - acceptance conditions, risks, assumptions and roles are copied from the
 *    package and keep the id of the item they came from;
 *  - effort comes only from the package's estimate workstreams. Work the package
 *    does not estimate is marked `needs-input` and cannot be `ready`.
 *
 * A node that would otherwise be ready but is gated by an unresolved critical
 * item is `blocked`, and one that is missing required package fields is
 * `review-required`, so an incomplete package is never presented as executable.
 */

import { classifyNode, applyOverride, type ClassificationInput } from "../classify";
import type { ExecutionNode, NodeAnchors, SourceRef, WorkCategory, NodeKind } from "../canonical/execution";
import type {
  CanonicalPackage,
  Capability,
  EstimateWorkstream,
  ImportedPackage,
  Readiness,
  ScopeItem,
  SourceRecord,
} from "../canonical/types";
import type { GeneratorInfo } from "../canonical/execution";
import { missingModelFields } from "../packages";
import type { DecomposeInput, DecomposeResult, NodeDraft } from "./types";

const MEASURABLE = /\b(\d+|must|shall|within|%|per|each|every|quarterly|daily)\b/i;

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function uniqueId(prefix: string, used: Set<string>): string {
  let candidate = prefix;
  let index = 2;
  while (used.has(candidate)) {
    candidate = `${prefix}_${index}`;
    index += 1;
  }
  used.add(candidate);
  return candidate;
}

function refsFor(sourceIds: string[], index: SourceRecord[]): SourceRef[] {
  return sourceIds
    .map((id) => index.find((record) => record.id === id))
    .filter((record): record is SourceRecord => Boolean(record))
    .map((record) => ({
      id: record.id,
      path: record.origin.path,
      kind: record.kind,
      title: record.title,
      quote: record.origin.quote,
      quoteVerified: record.origin.quoteVerified ?? null,
    }));
}

function emptyAnchors(): NodeAnchors {
  return {
    capabilityId: null,
    workstreamId: null,
    phaseId: null,
    componentIds: [],
    integrationIds: [],
    domainIds: [],
    aiUseCaseIds: [],
    requirementIds: [],
    estimateWorkstreamId: null,
    backlogSourceId: null,
  };
}

function intersect(a: readonly string[], b: readonly string[]): string[] {
  const set = new Set(b);
  return a.filter((value) => set.has(value));
}

/** Requirements a capability, component, integration or AI use case references. */
function requirementsOf(canonical: CanonicalPackage): Map<string, string[]> {
  const map = new Map<string, string[]>();
  const all = [
    ...canonical.scope.requirements,
    ...canonical.scope.gaps,
    ...canonical.scope.questions,
    ...canonical.scope.assumptions,
    ...canonical.scope.risks,
    ...canonical.scope.dependencies,
  ];
  for (const item of all) map.set(item.id, item.relatedIds);
  return map;
}

const CATEGORY_LABEL: Record<WorkCategory, string> = {
  discovery: "discovery",
  "ux-design": "interaction design",
  frontend: "user experience",
  "backend-api": "backend and API",
  integration: "integration",
  "data-engineering": "data engineering",
  "ai-implementation": "AI implementation",
  "cloud-devops": "cloud and DevOps",
  security: "security",
  testing: "verification",
  documentation: "documentation",
  deployment: "deployment",
  "technical-review": "technical review",
};

function measurableItems(items: ScopeItem[]): ScopeItem[] {
  return items.filter((item) => MEASURABLE.test(item.description) || MEASURABLE.test(item.title));
}

/**
 * Which categories a capability produces. Each rule cites the imported item that
 * justifies it, so the decomposition can be audited category by category.
 */
interface CategoryDecision {
  category: WorkCategory;
  sourceIds: string[];
  reason: string;
}

function categoriesForCapability(canonical: CanonicalPackage, capability: Capability): CategoryDecision[] {
  const decisions: CategoryDecision[] = [];
  const requirements = canonical.scope.requirements.filter((item) =>
    capability.requirementIds.includes(item.id),
  );
  const components = canonical.architecture.components.filter((component) =>
    component.requirementIds.some((id) => capability.requirementIds.includes(id)),
  );
  const integrations = canonical.strategy.integrations.filter((integration) =>
    integration.requirementIds.some((id) => capability.requirementIds.includes(id)),
  );
  const aiUseCases = canonical.strategy.aiUseCases.filter((useCase) =>
    useCase.requirementIds.some((id) => capability.requirementIds.includes(id)),
  );
  const functional = requirements.filter(
    (item) => item.kind === "functional" || item.kind === "business",
  );
  const experience = components.filter((component) => component.area === "experience");

  if (functional.length > 0) {
    decisions.push({
      category: "backend-api",
      sourceIds: functional.map((item) => item.id),
      reason: "implements " + functional.map((item) => item.id).join(", "),
    });
  }
  if (experience.length > 0) {
    decisions.push({
      category: "ux-design",
      sourceIds: experience.map((component) => component.id),
      reason: "designs the experience surfaces " + experience.map((component) => component.id).join(", "),
    });
    decisions.push({
      category: "frontend",
      sourceIds: experience.map((component) => component.id),
      reason: "builds the experience surfaces " + experience.map((component) => component.id).join(", "),
    });
  }
  for (const integration of integrations) {
    decisions.push({
      category: "integration",
      sourceIds: [integration.id, ...integration.requirementIds],
      reason: `connects ${integration.name} over ${integration.pattern}`,
    });
  }
  for (const useCase of aiUseCases) {
    decisions.push({
      category: "ai-implementation",
      sourceIds: [useCase.id, ...useCase.requirementIds],
      reason: `delivers the ${useCase.name} use case`,
    });
  }
  const dataItems = requirements.filter((item) => item.kind === "data");
  if (dataItems.length > 0) {
    decisions.push({
      category: "data-engineering",
      sourceIds: dataItems.map((item) => item.id),
      reason: "moves data for " + dataItems.map((item) => item.id).join(", "),
    });
  }
  const securityItems = requirements.filter((item) => item.kind === "security");
  if (securityItems.length > 0) {
    decisions.push({
      category: "security",
      sourceIds: securityItems.map((item) => item.id),
      reason: "applies " + securityItems.map((item) => item.id).join(", "),
    });
  }
  if (components.length >= 2) {
    decisions.push({
      category: "cloud-devops",
      sourceIds: components.map((component) => component.id),
      reason: "provisions " + components.map((component) => component.id).join(", "),
    });
  }
  if (functional.length > 0 || components.length > 0) {
    decisions.push({
      category: "testing",
      sourceIds: [...functional.map((item) => item.id), ...components.map((component) => component.id)],
      reason: "verifies the delivered scope",
    });
  }
  return decisions;
}

function backlogNodeDraft(item: ScopeItem, kind: NodeKind, reason: string): NodeDraft {
  const anchors = emptyAnchors();
  anchors.requirementIds = [item.id, ...item.relatedIds];
  anchors.backlogSourceId = item.id;
  return {
    id: "",
    title: item.title,
    objective: item.description || `Resolve ${item.id} before the dependent delivery work can start.`,
    workCategory: "discovery",
    kind,
    scope: `${reason} Raised by the imported package as ${item.kind} ${item.id}.${
      item.affectsInputs.length > 0 ? ` Affects estimation inputs: ${item.affectsInputs.join(", ")}.` : ""
    }`,
    sourceIds: [item.id, ...item.relatedIds],
    anchors,
    inputs: item.affectsInputs.length > 0 ? item.affectsInputs.map((input) => `Estimation input ${input}`) : [],
    deliverables: [],
    acceptanceConditions: item.resolution ? [item.resolution] : [],
    acceptanceSourceIds: item.resolution ? [item.id] : [],
    risks: [],
    riskSourceIds: [],
    assumptions: [],
    assumptionSourceIds: [],
    roles: [],
    skills: [],
    humanReviewRequired: true,
    gatedBy: [],
    generatedBy: reason,
  };
}

function capabilityDraft(
  canonical: CanonicalPackage,
  capability: Capability,
  decision: CategoryDecision,
): NodeDraft {
  const category = decision.category;
  const anchors = emptyAnchors();
  anchors.capabilityId = capability.id;
  anchors.requirementIds = capability.requirementIds;
  anchors.componentIds = canonical.architecture.components
    .filter((component) => intersect(component.requirementIds, capability.requirementIds).length > 0 || decision.sourceIds.includes(component.id))
    .map((component) => component.id);
  anchors.integrationIds = canonical.strategy.integrations
    .filter((integration) => decision.sourceIds.includes(integration.id) || intersect(integration.requirementIds, capability.requirementIds).length > 0)
    .map((integration) => integration.id);
  anchors.domainIds = canonical.strategy.dataDomains
    .filter((domain) => category === "data-engineering" || capability.name.toLowerCase().includes(domain.name.toLowerCase().split(" ")[0]))
    .map((domain) => domain.id);
  anchors.aiUseCaseIds = canonical.strategy.aiUseCases
    .filter((useCase) => decision.sourceIds.includes(useCase.id))
    .map((useCase) => useCase.id);
  const deliveryPackage = canonical.functionalScope.deliveryPackages.find((group) =>
    group.capabilityIds.includes(capability.id),
  );
  anchors.workstreamId = deliveryPackage ? deliveryPackage.id : null;

  const requirements = canonical.scope.requirements.filter((item) =>
    capability.requirementIds.includes(item.id),
  );
  const measurable = measurableItems(requirements);
  const risks = canonical.scope.risks.filter((risk) => intersect(risk.relatedIds, capability.requirementIds).length > 0);
  const assumptions = canonical.scope.assumptions.filter(
    (assumption) => intersect(assumption.relatedIds, capability.requirementIds).length > 0,
  );
  const componentNames = canonical.architecture.components
    .filter((component) => anchors.componentIds.includes(component.id))
    .map((component) => component.logicalComponent);
  const integrationNames = canonical.strategy.integrations
    .filter((integration) => anchors.integrationIds.includes(integration.id))
    .map((integration) => integration.name);

  const inputs: string[] = [];
  for (const integration of integrationNames) inputs.push(`Confirmed contract for the ${integration} integration`);
  for (const component of componentNames) inputs.push(`Approved design for ${component}`);
  for (const assumption of assumptions) inputs.push(`Confirmation of assumption ${assumption.id}`);

  const deliverables: string[] = [];
  if (category === "integration") {
    for (const integration of integrationNames) deliverables.push(`${integration} integrated for ${capability.name}`);
  } else if (category === "ai-implementation") {
    for (const useCase of canonical.strategy.aiUseCases.filter((entry) => anchors.aiUseCaseIds.includes(entry.id))) {
      deliverables.push(`${useCase.name} implemented`);
    }
  } else if (componentNames.length > 0) {
    for (const component of componentNames) deliverables.push(`${component} updated for ${capability.name}`);
  } else {
    deliverables.push(`${capability.name} — ${CATEGORY_LABEL[category]}`);
  }

  return {
    id: "",
    title: `${capability.name}: ${CATEGORY_LABEL[category]}`,
    objective: capability.description || `Deliver the ${CATEGORY_LABEL[category]} work for ${capability.name}.`,
    workCategory: category,
    kind: "delivery",
    scope: `Implements ${capability.name} (${decision.reason}). Requirements: ${capability.requirementIds.join(", ") || "none recorded"}.`,
    sourceIds: [...new Set([capability.id, ...decision.sourceIds, ...capability.requirementIds])],
    anchors,
    inputs,
    deliverables,
    // Acceptance comes from the package, in order of authority: the capability's
    // own stated criteria, then the measurable requirement statements it cites.
    // Nothing is drafted here; an empty list is reported as a missing condition.
    acceptanceConditions: [
      ...capability.acceptanceConditions,
      ...measurable.map((item) => item.description || item.title),
    ].filter((value, position, all) => all.indexOf(value) === position),
    acceptanceSourceIds: [
      ...(capability.acceptanceConditions.length > 0 ? [capability.id] : []),
      ...measurable.map((item) => item.id),
    ],
    risks: risks.map((risk) => `${risk.id}: ${risk.title}`),
    riskSourceIds: risks.map((risk) => risk.id),
    assumptions: assumptions.map((assumption) => `${assumption.id}: ${assumption.title}`),
    assumptionSourceIds: assumptions.map((assumption) => assumption.id),
    roles: [],
    skills: [],
    humanReviewRequired: false,
    gatedBy: [],
    generatedBy: `capability ${capability.id} → ${category} (${decision.reason})`,
  };
}

function integrationDraft(canonical: CanonicalPackage, id: string): NodeDraft {
  const integration = canonical.strategy.integrations.find((entry) => entry.id === id);
  if (!integration) throw new Error(`unknown integration ${id}`);
  const anchors = emptyAnchors();
  anchors.integrationIds = [integration.id];
  anchors.requirementIds = integration.requirementIds;
  const requirements = canonical.scope.requirements.filter((item) =>
    integration.requirementIds.includes(item.id),
  );
  const measurable = measurableItems(requirements);
  return {
    id: "",
    title: `${integration.name} integration`,
    objective: `Connect ${integration.name} using the ${integration.pattern} pattern (${integration.direction}, ${integration.authentication || "authentication not stated"}).`,
    workCategory: "integration",
    kind: "delivery",
    scope: `Integration ${integration.id} with ${integration.name}. Pattern: ${integration.pattern}. Error handling: ${integration.errorHandling || "not stated"}.`,
    sourceIds: [integration.id, ...integration.requirementIds],
    anchors,
    inputs: [`Confirmed contract for the ${integration.name} integration`],
    deliverables: [`${integration.name} integration`, `${integration.name} error handling (${integration.errorHandling || "unspecified"})`],
    acceptanceConditions: measurable.map((item) => item.description || item.title),
    acceptanceSourceIds: measurable.map((item) => item.id),
    risks: canonical.scope.risks
      .filter((risk) => intersect(risk.relatedIds, integration.requirementIds).length > 0)
      .map((risk) => `${risk.id}: ${risk.title}`),
    riskSourceIds: [],
    assumptions: [],
    assumptionSourceIds: [],
    roles: [],
    skills: [],
    humanReviewRequired: false,
    gatedBy: [],
    generatedBy: `integration ${integration.id}`,
  };
}

function aiDraft(canonical: CanonicalPackage, id: string): NodeDraft {
  const useCase = canonical.strategy.aiUseCases.find((entry) => entry.id === id);
  if (!useCase) throw new Error(`unknown AI use case ${id}`);
  const boundaries = canonical.strategy.aiBoundaries.filter((boundary) =>
    intersect(boundary.requirementIds, useCase.requirementIds).length > 0,
  );
  const humanBoundaries = boundaries.filter((boundary) => boundary.type === "human");
  const deterministicBoundaries = boundaries.filter((boundary) => boundary.type === "deterministic");
  const anchors = emptyAnchors();
  anchors.aiUseCaseIds = [useCase.id];
  anchors.requirementIds = useCase.requirementIds;
  return {
    id: "",
    title: `${useCase.name}: AI implementation`,
    objective: useCase.description || `Implement the ${useCase.name} AI use case.`,
    workCategory: "ai-implementation",
    kind: "delivery",
    scope: `AI use case ${useCase.id}. Human-decision boundary: ${
      humanBoundaries.length > 0 ? humanBoundaries.map((boundary) => boundary.activity).join(", ") : "none declared"
    }. Deterministic boundary: ${
      deterministicBoundaries.length > 0
        ? deterministicBoundaries.map((boundary) => boundary.activity).join(", ")
        : "none declared"
    }.`,
    sourceIds: [useCase.id, ...useCase.requirementIds, ...boundaries.map(() => useCase.id)],
    anchors,
    inputs: [],
    deliverables: [`${useCase.name} implemented`, `Evaluation of ${useCase.name} following the declared approach`],
    acceptanceConditions: humanBoundaries.map(
      (boundary) => `Human review of ${boundary.activity} is recorded before release (${boundary.reason})`,
    ),
    acceptanceSourceIds: humanBoundaries.map(() => useCase.id),
    risks: [],
    riskSourceIds: [],
    assumptions: [],
    assumptionSourceIds: [],
    roles: [],
    skills: [],
    humanReviewRequired: humanBoundaries.length > 0,
    gatedBy: [],
    generatedBy: `AI use case ${useCase.id}`,
  };
}

function reviewDraft(canonical: CanonicalPackage, activity: string, requirementIds: string[]): NodeDraft {
  const anchors = emptyAnchors();
  anchors.requirementIds = requirementIds;
  return {
    id: "",
    title: `Human review checkpoint: ${activity}`,
    objective: `A named human must review ${activity} before the dependent work is released.`,
    workCategory: "technical-review",
    kind: "approval",
    scope: `Declared as a human-decision boundary in the AI strategy for ${requirementIds.join(", ") || "the deal"}.`,
    sourceIds: requirementIds,
    anchors,
    inputs: [],
    deliverables: [`Recorded human decision for ${activity}`],
    acceptanceConditions: [],
    acceptanceSourceIds: [],
    risks: [],
    riskSourceIds: [],
    assumptions: [],
    assumptionSourceIds: [],
    roles: [],
    skills: [],
    humanReviewRequired: true,
    gatedBy: [],
    generatedBy: `human-decision boundary: ${activity}`,
  };
}

function qualityDraft(canonical: CanonicalPackage, checkId: string, name: string, findings: string[]): NodeDraft {
  const anchors = emptyAnchors();
  return {
    id: "",
    title: `Resolve quality finding: ${name}`,
    objective: `Close the quality check "${name}" before operational handoff.`,
    workCategory: "technical-review",
    kind: "discovery",
    scope: `Imported quality check ${checkId} returned warn. Findings: ${findings.join(" ") || "no detail provided"}.`,
    sourceIds: [`QUALITY_${slug(checkId).toUpperCase()}`],
    anchors,
    inputs: [],
    deliverables: [],
    acceptanceConditions: [],
    acceptanceSourceIds: [],
    risks: [],
    riskSourceIds: [],
    assumptions: [],
    assumptionSourceIds: [],
    roles: [],
    skills: [],
    humanReviewRequired: true,
    gatedBy: [],
    generatedBy: `quality check ${checkId}`,
  };
}

function phaseDraft(canonical: CanonicalPackage, phaseId: string): NodeDraft {
  const phase = canonical.delivery.phases.find((entry) => entry.id === phaseId);
  if (!phase) throw new Error(`unknown phase ${phaseId}`);
  const anchors = emptyAnchors();
  anchors.phaseId = phase.id;
  return {
    id: "",
    title: `Release ${phase.name}`,
    objective: `Deploy and verify the ${phase.name} phase.`,
    workCategory: "deployment",
    kind: "delivery",
    scope: `Delivery phase ${phase.id} covering estimate workstreams ${phase.workstreamIds.join(", ") || "none recorded"}.`,
    sourceIds: [phase.id, ...phase.workstreamIds],
    anchors,
    inputs: [],
    deliverables: [`${phase.name} phase deployed`],
    acceptanceConditions: [],
    acceptanceSourceIds: [],
    risks: [],
    riskSourceIds: [],
    assumptions: [],
    assumptionSourceIds: [],
    roles: [],
    skills: [],
    humanReviewRequired: false,
    gatedBy: [],
    generatedBy: `delivery phase ${phase.id}`,
  };
}

/** Equal split of one estimate range across the nodes that draw on it. */
function splitRange(value: number | null, parts: number): number | null {
  if (value === null || parts <= 0) return null;
  return Math.max(0.5, Math.round((value / parts) * 2) / 2);
}

export function decompose(input: DecomposeInput): DecomposeResult {
  const { imported } = input;
  const canonical = imported.canonical;
  const notes: string[] = [];
  const used = new Set<string>();
  const drafts: NodeDraft[] = [];

  const openBacklog = [
    ...canonical.scope.gaps,
    ...canonical.scope.questions,
    ...canonical.scope.assumptions.filter((item) => item.review !== "approved" && item.review !== "validated"),
  ].filter((item) => item.inScope);

  for (const item of openBacklog) {
    const kind: NodeKind =
      item.kind === "gap" ? "discovery" : item.kind === "question" ? "clarification" : "approval";
    drafts.push(
      backlogNodeDraft(
        item,
        kind,
        item.kind === "gap"
          ? "Open gap in the imported package."
          : item.kind === "question"
            ? "Unresolved question in the imported package."
            : "Unconfirmed assumption in the imported package.",
      ),
    );
  }
  notes.push(`${openBacklog.length} discovery, clarification or approval node(s) generated from gaps, questions and unconfirmed assumptions.`);

  const staleSections = imported.report.sections.filter((section) => section.status === "stale" || !section.reviewed);
  for (const [position, section] of staleSections.entries()) {
    drafts.push({
      id: "",
      title: `Re-baseline ${section.name}`,
      // The section path is an imported identifier, so this node is sourced.
      objective: `The ${section.name} section is ${section.status}${section.reviewed === false ? " and unreviewed" : ""}; re-baseline it before dependent work starts.`,
      workCategory: "discovery",
      kind: "discovery",
      scope: `Section ${section.path} — ${section.staleReasons.join("; ") || "not reviewed by the client"}.`,
      sourceIds: [`SECTION_${String(position + 1).padStart(2, "0")}_${slug(section.name).toUpperCase()}`],
      anchors: emptyAnchors(),
      inputs: [],
      deliverables: [],
      acceptanceConditions: [],
      acceptanceSourceIds: [],
      risks: [],
      riskSourceIds: [],
      assumptions: [],
      assumptionSourceIds: [],
      roles: [],
      skills: [],
      humanReviewRequired: true,
      gatedBy: [],
      generatedBy: `stale or unreviewed section ${section.name}`,
    });
  }

  if (imported.conflict.detected && !imported.conflict.resolved) {
    drafts.push({
      id: "",
      title: "Resolve the cloud platform conflict",
      objective: imported.conflict.summary,
      workCategory: "discovery",
      kind: "clarification",
      scope: imported.conflict.claims.map((claim) => `${claim.source}: ${claim.platform}`).join(" vs ") || imported.conflict.summary,
      sourceIds: [
        "PLATFORM_CONFLICT",
        ...imported.conflict.claims.map((claim) => claim.refId).filter((id): id is string => Boolean(id)),
      ],
      anchors: emptyAnchors(),
      inputs: [],
      deliverables: [],
      acceptanceConditions: [],
      acceptanceSourceIds: [],
      risks: [],
      riskSourceIds: [],
      assumptions: [],
      assumptionSourceIds: [],
      roles: [],
      skills: [],
      humanReviewRequired: true,
      gatedBy: [],
      generatedBy: "architecture or platform conflict",
    });
  }

  for (const [position, missing] of canonical.delivery.missingInputs.entries()) {
    drafts.push({
      id: "",
      title: `Provide missing estimation input: ${missing}`,
      // Identifies the entry in the package's own missingInputs list.
      objective: `The estimate declares "${missing}" as a missing input; supply it before affected work is sequenced.`,
      workCategory: "discovery",
      kind: "clarification",
      scope: `Imported from the estimate's missingInputs list.`,
      sourceIds: [`EST_MISSING_${String(position + 1).padStart(2, "0")}`],
      anchors: emptyAnchors(),
      inputs: [],
      deliverables: [],
      acceptanceConditions: [],
      acceptanceSourceIds: [],
      risks: [],
      riskSourceIds: [],
      assumptions: [],
      assumptionSourceIds: [],
      roles: [],
      skills: [],
      humanReviewRequired: true,
      gatedBy: [],
      generatedBy: `estimate missing input: ${missing}`,
    });
  }

  for (const finding of canonical.quality.findings.filter((entry) => entry.status === "warn")) {
    drafts.push(qualityDraft(canonical, finding.checkId, finding.checkName, [finding.message]));
  }

  // Implementation nodes, capability first so the graph has a stable spine.
  for (const capability of canonical.functionalScope.capabilities) {
    for (const decision of categoriesForCapability(canonical, capability)) {
      drafts.push(capabilityDraft(canonical, capability, decision));
    }
  }

  const coveredIntegrations = new Set(drafts.flatMap((draft) => draft.anchors.integrationIds));
  for (const integration of canonical.strategy.integrations) {
    if (!coveredIntegrations.has(integration.id)) drafts.push(integrationDraft(canonical, integration.id));
  }
  const coveredAi = new Set(drafts.flatMap((draft) => draft.anchors.aiUseCaseIds));
  for (const useCase of canonical.strategy.aiUseCases) {
    if (!coveredAi.has(useCase.id)) drafts.push(aiDraft(canonical, useCase.id));
  }

  for (const boundary of canonical.strategy.aiBoundaries.filter((entry) => entry.type === "human")) {
    drafts.push(reviewDraft(canonical, boundary.activity, boundary.requirementIds));
  }
  for (const phase of canonical.delivery.phases) drafts.push(phaseDraft(canonical, phase.id));

  drafts.push({
    id: "",
    title: "Operational handoff approval",
    objective: "A human approves the graph before any work is handed to a delivery model.",
    workCategory: "technical-review",
    kind: "approval",
    scope: "Terminal approval node: the engine never recruits talent, launches a challenge or commits delivery.",
    sourceIds: [],
    anchors: emptyAnchors(),
    inputs: [],
    deliverables: [],
    acceptanceConditions: [],
    acceptanceSourceIds: [],
    risks: [],
    riskSourceIds: [],
    assumptions: [],
    assumptionSourceIds: [],
    roles: [],
    skills: [],
    humanReviewRequired: true,
    gatedBy: [],
    generatedBy: "final approval",
  });

  // Gating: an unresolved critical item blocks the implementation work that
  // cites it, and a discovery-required deal blocks all implementation work.
  const requirementIndex = requirementsOf(canonical);
  const criticalGates = openBacklog.filter((item) => item.critical || item.kind === "gap");
  const gateTargets = new Map<string, string[]>();
  for (const gate of criticalGates) {
    for (const target of [...gate.relatedIds, ...gate.affectsInputs]) {
      const list = gateTargets.get(target) ?? [];
      list.push(gate.id);
      gateTargets.set(target, list);
    }
  }
  const discoveryDeal = imported.maturity.level === "discovery-required";
  for (const draft of drafts) {
    if (draft.kind !== "delivery") continue;
    const gated = new Set<string>();
    for (const sourceId of [...draft.anchors.requirementIds, ...draft.anchors.integrationIds, ...draft.anchors.aiUseCaseIds]) {
      for (const gate of gateTargets.get(sourceId) ?? []) gated.add(gate);
      for (const related of requirementIndex.get(sourceId) ?? []) {
        for (const gate of gateTargets.get(related) ?? []) gated.add(gate);
      }
    }
    if (gated.size === 0 && discoveryDeal) {
      for (const gate of criticalGates.slice(0, 3)) gated.add(gate.id);
    }
    draft.gatedBy = [...gated].sort();
  }

  // Effort: only from the package's estimate workstreams, split across the nodes
  // that draw on the same workstream.
  //
  // A phase (release) draft is a milestone, not an implementation unit. It is
  // deliberately restricted to the workstreams *inside its own phase*: scoring it
  // against every workstream let a release adopt a workstream owned by another
  // phase (PH_5 "Testing and Hardening" scoring on the token "hardening" in
  // WS_04 "Cloud Infrastructure and Hardening"). That later made the release look
  // like a member of that other phase and closed a cycle between releases.
  const phaseWorkstreamIds = new Map<string, string[]>();
  for (const phase of canonical.delivery.phases) {
    const owned = phase.workstreamIds.filter((id) =>
      canonical.delivery.workstreams.some((workstream) => workstream.id === id),
    );
    phaseWorkstreamIds.set(phase.id, owned);
  }
  const workstreamCandidates = (draft: NodeDraft): EstimateWorkstream[] => {
    if (draft.anchors.phaseId === null) return canonical.delivery.workstreams;
    const owned = new Set(phaseWorkstreamIds.get(draft.anchors.phaseId) ?? []);
    return canonical.delivery.workstreams.filter((workstream) => owned.has(workstream.id));
  };

  const implementation = drafts.filter((draft) => draft.kind === "delivery");
  // Keyed by draft identity, not by title: two drafts can legitimately share a
  // title, and keying by title silently merged them and misfiled their effort.
  const assignment = new Map<NodeDraft, string>();
  for (const draft of implementation) {
    let best: { id: string; score: number } | null = null;
    for (const workstream of workstreamCandidates(draft)) {
      const roleOverlap = intersect(draft.roles.length > 0 ? draft.roles : [], workstream.roles).length;
      const skillOverlap = intersect(draft.skills, workstream.skills).length;
      const nameHit = workstream.name
        .toLowerCase()
        .split(/\s+/)
        .some((token: string) => token.length > 3 && draft.title.toLowerCase().includes(token));
      const score = roleOverlap * 2 + skillOverlap + (nameHit ? 1.5 : 0);
      if (score > 0 && (!best || score > best.score || (score === best.score && workstream.id < best.id))) {
        best = { id: workstream.id, score };
      }
    }
    if (best) assignment.set(draft, best.id);
  }

  const grouped = new Map<string, NodeDraft[]>();
  for (const draft of implementation) {
    const workstreamId = assignment.get(draft);
    if (!workstreamId) continue;
    draft.anchors.estimateWorkstreamId = workstreamId;
    const list = grouped.get(workstreamId) ?? [];
    list.push(draft);
    grouped.set(workstreamId, list);
  }
  for (const [workstreamId, members] of grouped) {
    const workstream = canonical.delivery.workstreams.find((entry) => entry.id === workstreamId);
    if (!workstream) continue;
    for (const member of members) {
      member.roles = member.roles.length > 0 ? member.roles : [...workstream.roles];
      member.skills = member.skills.length > 0 ? member.skills : [...workstream.skills];
      member.effort = {
        minimum: splitRange(workstream.low, members.length),
        maximum: splitRange(workstream.high, members.length),
        likely: splitRange(workstream.likely, members.length),
        unit: "person-days",
        provenance: "deterministic",
        sourceIds: [workstream.id],
        basis:
          members.length === 1
            ? `Estimate workstream ${workstream.id} "${workstream.name}" (${workstream.low ?? "?"}–${workstream.high ?? "?"} person-days).`
            : `Estimate workstream ${workstream.id} "${workstream.name}" (${workstream.low ?? "?"}–${workstream.high ?? "?"} person-days) split equally across ${members.length} nodes that draw on it.`,
      };
    }
  }

  // Roles for discovery nodes come from the workstream roles named by the gap's
  // affected inputs, otherwise an integration or data specialist is the honest
  // answer only when the package names such a role.
  const rolePool = new Set(canonical.delivery.workstreams.flatMap((workstream) => workstream.roles));

  const nodes: ExecutionNode[] = [];
  for (const draft of drafts) {
    const idPrefix =
      draft.anchors.backlogSourceId !== null
        ? `NODE_${draft.anchors.backlogSourceId}`
        : draft.kind === "approval" && draft.workCategory === "technical-review" && draft.sourceIds.length === 0
          ? `NODE_${slug(draft.title)}`
          : draft.anchors.capabilityId
            ? `NODE_${draft.anchors.capabilityId}_${slug(draft.workCategory)}`
            : draft.anchors.phaseId
              ? `NODE_${draft.anchors.phaseId}_${slug(draft.workCategory)}`
              : draft.anchors.integrationIds.length > 0
                ? `NODE_${draft.anchors.integrationIds[0]}_${slug(draft.workCategory)}`
                : draft.anchors.aiUseCaseIds.length > 0
                  ? `NODE_${draft.anchors.aiUseCaseIds[0]}_${slug(draft.workCategory)}`
                  : `NODE_${slug(draft.title)}`;
    draft.id = uniqueId(idPrefix, used).toUpperCase().replace(/-/g, "_");
    if (draft.roles.length === 0 && rolePool.size > 0 && draft.kind === "delivery") {
      const integrationRoles = canonical.delivery.workstreams
        .filter((workstream) => workstream.name.toLowerCase().includes("integrat"))
        .flatMap((workstream) => workstream.roles);
      if (draft.workCategory === "integration" && integrationRoles.length > 0) {
        draft.roles = [...new Set(integrationRoles)];
      }
    }
    nodes.push(materialise(draft, canonical, imported));
  }

  const removed = new Set(input.removedNodeIds);
  const overrides = new Map(input.overrides.map((override) => [override.nodeId, override]));
  const kept = nodes.filter((node) => !removed.has(node.id));
  notes.push(`${kept.length} node(s) after removing ${removed.size} user-removed node(s).`);

  const withOverrides = kept.map((node) => {
    const override = overrides.get(node.id);
    if (!override) return node;
    return {
      ...node,
      operatingModel: applyOverride(
        { ...node.operatingModel, features: [] },
        override.model,
        override.rationale,
        override.at,
      ),
    };
  });

  // Re-check package completeness after any model override changed the model.
  const finalised = withOverrides.map((node) => finaliseReadiness(node, canonical));

  const traceability = buildTraceability(canonical, finalised);
  const uncovered = traceability.filter((row) => !row.covered).map((row) => row.sourceId);
  return { nodes: finalised, traceability, notes, uncoveredSourceIds: uncovered };
}

/** Turn a draft into a node: classification, provenance, blockers, readiness. */
function materialise(
  draft: NodeDraft,
  canonical: CanonicalPackage,
  imported: ImportedPackage,
): ExecutionNode {
  const sensitiveData = canonical.strategy.dataDomains.some(
    (domain) => draft.anchors.domainIds.includes(domain.id) && domain.regulated,
  );
  const securityRequirementIds = canonical.scope.requirements
    .filter((item) => item.kind === "security" && draft.anchors.requirementIds.includes(item.id))
    .map((item) => item.id);
  const phases = new Set<string>();
  for (const sourceId of draft.sourceIds) {
    for (const phase of canonical.delivery.phases) {
      if (phase.workstreamIds.includes(sourceId)) phases.add(phase.id);
    }
  }

  const classificationInput: ClassificationInput = {
    nodeId: draft.id,
    title: draft.title,
    workCategory: draft.workCategory,
    kind: draft.kind,
    sourceIds: draft.sourceIds,
    roles: draft.roles,
    componentIds: draft.anchors.componentIds,
    integrationIds: draft.anchors.integrationIds,
    domainIds: draft.anchors.domainIds,
    sensitiveData,
    securityRequirementIds,
    acceptanceMeasurable: draft.acceptanceConditions.length > 0,
    effortMaximum: draft.effort?.maximum ?? null,
    phaseCount: phases.size,
    openSourceIds: draft.gatedBy,
    deliverableCount: draft.deliverables.length,
    humanReviewRequired: draft.humanReviewRequired,
    maturity: imported.maturity.level,
  };

  const recommendation = classifyNode(classificationInput);
  const componentCount = draft.anchors.componentIds.length;
  const complexity: ExecutionNode["complexity"] =
    componentCount >= 4 || draft.roles.length >= 3 ? "high" : componentCount >= 2 ? "medium" : "low";

  const node: ExecutionNode = {
    id: draft.id,
    title: draft.title,
    objective: draft.objective,
    workCategory: draft.workCategory,
    kind: draft.kind,
    scope: draft.scope,
    sourceIds: draft.sourceIds,
    sourceRefs: refsFor(draft.sourceIds, imported.sourceIndex),
    inputs: draft.inputs,
    deliverables: draft.deliverables,
    acceptanceConditions: draft.acceptanceConditions,
    dependsOn: [],
    requiredSkills: draft.skills,
    roles: draft.roles,
    complexity,
    effort: draft.effort ?? {
      minimum: null,
      maximum: null,
      likely: null,
      unit: "person-days",
      provenance: "deterministic",
      sourceIds: [],
      basis: "No estimate workstream in the imported package covers this work, so effort is unknown until the operator supplies it.",
    },
    risks: draft.risks,
    assumptions: draft.assumptions,
    blockingStatus: draft.gatedBy.length > 0 ? "blocked" : "none",
    blockedBy: draft.gatedBy,
    operatingModel: recommendation,
    provenance: "deterministic",
    readiness: "review-required",
    readinessBlockers: [],
    modelFieldsMissing: [],
    humanReviewRequired: draft.humanReviewRequired,
    fieldProvenance: {
      inputs: "deterministic",
      deliverables: "deterministic",
      acceptanceConditions: "imported",
      risks: "imported",
      assumptions: "imported",
    },
    acceptanceSourceIds: draft.acceptanceSourceIds,
    riskSourceIds: draft.riskSourceIds,
    assumptionSourceIds: draft.assumptionSourceIds,
    splitOf: null,
    mergedFrom: [],
    anchors: draft.anchors,
    aiSuggestions: [],
  };
  return finaliseReadiness(node, canonical);
}

/** Readiness is deterministic: no model, no blocker, no missing field, no ready. */
export function finaliseReadiness(node: ExecutionNode, canonical: CanonicalPackage): ExecutionNode {
  const blockers = new Set<ExecutionNode["readinessBlockers"][number]>();
  if (node.sourceIds.length === 0 && node.kind !== "discovery" && node.kind !== "approval") {
    blockers.add("unsupported");
  }
  if (node.blockedBy.length > 0) blockers.add("dependency-blocked");
  // Readiness is recomputed from scratch here, so an operator's explicit block or
  // rejection has to be re-applied rather than silently dropped on recompile.
  if (node.blockingStatus === "blocked") blockers.add("open-blocker");
  if (node.acceptanceConditions.length === 0) blockers.add("missing-acceptance");
  if (node.effort.maximum === null && node.kind === "delivery") blockers.add("missing-effort");
  if (node.inputs.length === 0) blockers.add("missing-inputs");
  if (node.operatingModel.rationale.length === 0) blockers.add("missing-rationale");
  if (node.humanReviewRequired) blockers.add("human-approval-pending");
  if (node.kind !== "delivery") {
    // Discovery work is legitimately open-ended: accept missing effort for it.
    blockers.delete("missing-effort");
  }

  const ctx = { canonical, generator: rulesGenerator() };

  const missing = missingModelFields(node, ctx);
  if (missing.length > 0) blockers.add("missing-package-fields");

  const readiness: Readiness =
    blockers.size === 0
      ? "ready"
      : blockers.has("unsupported") || blockers.has("dependency-blocked") || blockers.has("open-blocker")
        ? "blocked"
        : "review-required";

  return {
    ...node,
    readiness,
    readinessBlockers: [...blockers].sort(),
    modelFieldsMissing: missing,
  };
}

function rulesGenerator(): GeneratorInfo {
  return {
    mode: "mock",
    provider: "deterministic-rules",
    model: null,
    promptVersion: "rules-v1",
    notice: "MOCK AI MODE — no external service was contacted.",
  };
}


/** Map every in-scope requirement, component, integration and AI use case to nodes. */
export function buildTraceability(
  canonical: CanonicalPackage,
  nodes: ExecutionNode[],
): DecomposeResult["traceability"] {
  const rows: DecomposeResult["traceability"] = [];
  const add = (sourceId: string, kind: string, title: string, inScope: boolean) => {
    const nodeIds = nodes.filter((node) => node.sourceIds.includes(sourceId)).map((node) => node.id);
    rows.push({ sourceId, sourceKind: kind, sourceTitle: title, inScope, nodeIds, covered: nodeIds.length > 0 });
  };
  for (const item of canonical.scope.requirements) add(item.id, item.kind, item.title, item.inScope);
  for (const component of canonical.architecture.components) {
    add(component.id, "component", `${component.logicalComponent} (${component.service})`, true);
  }
  for (const integration of canonical.strategy.integrations) {
    add(integration.id, "integration", integration.name, true);
  }
  for (const useCase of canonical.strategy.aiUseCases) add(useCase.id, "aiUseCase", useCase.name, true);
  for (const capability of canonical.functionalScope.capabilities) {
    add(capability.id, "capability", capability.name, true);
  }
  return rows;
}
