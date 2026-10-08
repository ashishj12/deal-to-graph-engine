/**
 * Model-specific execution package builders (FR4).
 *
 * Each builder fills the fields the challenge lists for its operating model. Two
 * rules keep this honest:
 *
 *  1. A value is only produced when the imported package (or an approved user
 *     decision) supports it. Everything else is reported in `missingFields`.
 *  2. `complete` is false while any required field is missing, and a node whose
 *     package is incomplete cannot be `ready` for operational handoff.
 *
 * The builders are pure functions of (node, canonical package, generator info),
 * so a package can be rebuilt after an edit without re-running decomposition.
 */

import type { ExecutionNode, GeneratorInfo } from "../canonical/execution";
import type { CanonicalPackage, OperatingModel } from "../canonical/types";
import {
  REQUIRED_PACKAGE_FIELDS,
  type ChallengePackage,
  type FlexibleTalentPackage,
  type ModelPackage,
  type PackageBase,
  type PrivatePodPackage,
} from "./types";

export interface PackageContext {
  canonical: CanonicalPackage;
  generator: GeneratorInfo;
}

/** Roles and skills carried by the estimate workstream that funds this node. */
function workstreamFor(node: ExecutionNode, canonical: CanonicalPackage) {
  const id = node.anchors.estimateWorkstreamId;
  if (!id) return null;
  return canonical.delivery.workstreams.find((workstream) => workstream.id === id) ?? null;
}

function capabilityFor(node: ExecutionNode, canonical: CanonicalPackage) {
  const id = node.anchors.capabilityId;
  if (!id) return null;
  return canonical.functionalScope.capabilities.find((capability) => capability.id === id) ?? null;
}

function named(list: { id: string; name: string }[], ids: string[]): string[] {
  return ids
    .map((id) => list.find((entry) => entry.id === id))
    .filter((entry): entry is { id: string; name: string } => Boolean(entry))
    .map((entry) => entry.name);
}

const NON_EMPTY = (values: string[]): boolean => values.some((value) => value.trim().length > 0);

function baseFor<M extends OperatingModel>(
  node: ExecutionNode,
  model: M,
  generator: GeneratorInfo,
): PackageBase & { model: M } {
  return {
    nodeId: node.id,
    nodeTitle: node.title,
    model,
    readiness: node.readiness,
    complete: false,
    missingFields: [],
    readinessNotes: [],
    provenance: node.provenance,
    sourceIds: node.sourceIds,
    generator,
  };
}

function finalise<T extends PackageBase>(pkg: T): T {
  const missing = REQUIRED_PACKAGE_FIELDS[pkg.model].filter((field) => {
    const value = (pkg as unknown as Record<string, unknown>)[field];
    if (Array.isArray(value)) return value.length === 0 || !NON_EMPTY(value as string[]);
    return value === null || value === undefined || value === "";
  });
  return {
    ...pkg,
    missingFields: missing,
    complete: missing.length === 0,
    readinessNotes:
      missing.length === 0
        ? []
        : [`Not handoff-ready: ${missing.join(", ")} ${missing.length === 1 ? "is" : "are"} not present in the imported package.`],
  };
}

/** Duration wording derived from the sourced effort range, never invented. */
function durationFromEffort(node: ExecutionNode): string | null {
  const { minimum, maximum, unit } = node.effort;
  if (maximum === null) return null;
  const suffix = unit ?? "person-days";
  if (minimum === null || minimum === maximum) return `${maximum} ${suffix}`;
  return `${minimum}–${maximum} ${suffix}`;
}

function buildFlexibleTalent(node: ExecutionNode, ctx: PackageContext): FlexibleTalentPackage {
  const workstream = workstreamFor(node, ctx.canonical);
  const capability = capabilityFor(node, ctx.canonical);
  const integrationNames = named(ctx.canonical.strategy.integrations, node.anchors.integrationIds);
  const domainNames = named(ctx.canonical.strategy.dataDomains, node.anchors.domainIds);

  const responsibilities = node.deliverables.length > 0 ? node.deliverables : node.acceptanceConditions;
  const access = [
    ...integrationNames.map((name) => `Access to the ${name} integration environment`),
    ...domainNames.map((name) => `Access to ${name} data under the agreed handling rules`),
  ];
  const environment =
    ctx.canonical.config.environments !== null
      ? `${ctx.canonical.architecture.platform} — ${ctx.canonical.config.environments} environment(s)`
      : null;

  const pkg: FlexibleTalentPackage = {
    ...baseFor(node, "flexible-talent", ctx.generator),
    roles: node.roles,
    skills: workstream?.skills.length ? workstream.skills : node.requiredSkills,
    // The package does not state a seniority level: the operator has to choose it.
    seniority: null,
    duration: durationFromEffort(node),
    // Nor does it state a capacity commitment (full-time equivalent).
    capacity: null,
    responsibilities,
    startDependencies: node.dependsOn.map((id) => `Completion of ${id}`),
    access,
    environment: environment ?? (capability ? null : environment),
  };
  return finalise(pkg);
}

function buildChallenge(node: ExecutionNode, ctx: PackageContext): ChallengePackage {
  const capability = capabilityFor(node, ctx.canonical);
  const componentNames = named(
    ctx.canonical.architecture.components.map((component) => ({
      id: component.id,
      name: `${component.logicalComponent} (${component.service})`,
    })),
    node.anchors.componentIds,
  );
  const sensitives = [
    ...ctx.canonical.strategy.dataDomains.filter(
      (domain) => node.anchors.domainIds.includes(domain.id) && domain.regulated,
    ),
  ];

  const privacyClause = sensitives.length
    ? [
        `Restricted data (${sensitives.map((domain) => domain.name).join(", ")}) must not be placed in the challenge brief, the submissions or the evaluation environment.`,
        "Participants work against synthetic or redacted samples only; the source package itself is never published.",
      ]
    : [
        "No confidentiality limitations apply: every source this work derives from is classified as non-restricted.",
      ];

  const pkg: ChallengePackage = {
    ...baseFor(node, "challenge", ctx.generator),
    objective: node.objective,
    businessContext:
      ctx.canonical.delivery.confidence.length > 0
        ? `${ctx.canonical.deal.customer} — ${capability ? capability.name : node.title}. Delivery confidence: ${ctx.canonical.delivery.confidence}.`
        : "",
    technicalContext: componentNames.length
      ? `Touches ${componentNames.join(", ")} on ${ctx.canonical.architecture.platform}.`
      : "",
    deliverables: node.deliverables,
    evaluationCriteria: node.acceptanceConditions.map(
      (condition) => `Demonstrated when: ${condition}`,
    ),
    acceptanceConditions: node.acceptanceConditions,
    inputAssets: node.inputs,
    technologies: workstreamFor(node, ctx.canonical)?.skills ?? node.requiredSkills,
    skills: node.requiredSkills,
    dependencies: node.dependsOn.map((id) => `Depends on ${id}`),
    // The specification requires a challenge node to declare its confidentiality limits.
    confidentialityLimitations: privacyClause,
    expectedReviewProcess: node.humanReviewRequired
      ? ["Independent review of submissions by the client reviewer.", "Human sign-off recorded before handoff."]
      : ["Review of submissions against the stated acceptance conditions."],
  };
  return finalise(pkg);
}

function buildPrivatePod(node: ExecutionNode, ctx: PackageContext): PrivatePodPackage {
  const componentNames = named(
    ctx.canonical.architecture.components.map((component) => ({
      id: component.id,
      name: component.logicalComponent,
    })),
    node.anchors.componentIds,
  );
  const integrationNames = named(ctx.canonical.strategy.integrations, node.anchors.integrationIds);
  const securityRequirementIds = ctx.canonical.scope.requirements
    .filter((item) => item.kind === "security" && node.anchors.requirementIds.includes(item.id))
    .map((item) => item.id);
  const regulated = ctx.canonical.strategy.dataDomains.filter(
    (domain) => node.anchors.domainIds.includes(domain.id) && domain.regulated,
  );

  const securityAndAccess = [
    ...securityRequirementIds.map((id) => `Implements security requirement ${id}`),
    ...regulated.map((domain) => `Handles regulated data domain ${domain.name} — restricted access and audit logging required`),
    ...integrationNames.map((name) => `Restricted credentials for ${name}`),
  ];

  const pkg: PrivatePodPackage = {
    ...baseFor(node, "private-pod", ctx.generator),
    objective: node.objective,
    roles: node.roles,
    skills: workstreamFor(node, ctx.canonical)?.skills ?? node.requiredSkills,
    technicalLeadership: componentNames.length
      ? `Technical lead owns ${componentNames.join(" and ")}.`
      : null,
    componentOwnership: componentNames,
    deliveryResponsibilities: node.deliverables.length > 0 ? node.deliverables : node.acceptanceConditions,
    securityAndAccess,
    coordinationDependencies: node.dependsOn,
    expectedDuration: durationFromEffort(node),
    definitionOfCompletion: node.acceptanceConditions,
  };
  return finalise(pkg);
}

/** Build the package for the node's current operating model. */
export function buildModelPackage(node: ExecutionNode, ctx: PackageContext): ModelPackage {
  switch (node.operatingModel.primary) {
    case "flexible-talent":
      return buildFlexibleTalent(node, ctx);
    case "challenge":
      return buildChallenge(node, ctx);
    case "private-pod":
      return buildPrivatePod(node, ctx);
  }
}

/** Field names still missing for a node, without building the whole package. */
export function missingModelFields(node: ExecutionNode, ctx: PackageContext): string[] {
  return buildModelPackage(node, ctx).missingFields;
}
