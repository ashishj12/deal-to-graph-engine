import { arr, at, obj, str, strArray, type Json } from "./json";
import type { NormalizeResult, StructuralFindings } from "./normalize";
import type {
  CanonicalPackage,
  PlatformConflict,
  SectionStatus,
  Severity,
  SourceRecord,
  ValidationIssue,
  ValidationReport,
} from "../canonical/types";

export interface ValidateInput {
  raw: Json;
  rawText: string;
  normalized: NormalizeResult;
  structural: StructuralFindings;
  duplicateJsonKeys: string[];
  strippedKeys: string[];
  transportIssue?: ValidationIssue;
}

const SECTION_PATHS: { name: string; path: string }[] = [
  { name: "Product requirements", path: "outputs.prd" },
  { name: "Architecture", path: "outputs.architecture" },
  { name: "Data and integration", path: "outputs.dataIntegration" },
  { name: "AI strategy", path: "outputs.aiStrategy" },
  { name: "Estimate", path: "outputs.estimate" },
];

const PLATFORM_PATTERNS: { label: string; test: RegExp }[] = [
  { label: "azure", test: /\bazure\b/i },
  { label: "aws", test: /\b(aws|amazon web services)\b/i },
  { label: "gcp", test: /\b(gcp|google cloud)\b/i },
  { label: "on-prem", test: /\bon[- ]prem(ises)?\b/i },
];

/** Pull every platform mentioned in a free-text blob. */
function platformsIn(text: string): string[] {
  const found = new Set<string>();
  for (const pattern of PLATFORM_PATTERNS) {
    if (pattern.test.test(text)) found.add(pattern.label);
  }
  return Array.from(found);
}

export function detectPlatformConflict(raw: Json, canonical: CanonicalPackage): PlatformConflict {
  const root = obj(raw);
  const claims: PlatformConflict["claims"] = [];

  const addClaim = (source: string, value: string, text: string, refId?: string) => {
    for (const platform of platformsIn(value || text)) {
      claims.push({ source, platform, ...(refId ? { refId } : {}) });
    }
  };

  const configPlatform = str(at(root, "config.cloudPlatform"));
  if (configPlatform) addClaim("config.cloudPlatform", configPlatform, "");

  if (canonical.architecture.platform && canonical.architecture.platform !== "unspecified") {
    addClaim("canonical.architecture.platform", canonical.architecture.platform, "");
  }

  const architecturePlatform = str(at(root, "outputs.architecture.data.platform"));
  if (architecturePlatform) addClaim("outputs.architecture.data.platform", architecturePlatform, "");

  const recommended = str(at(root, "outputs.architecture.data.recommendation.recommended"));
  if (recommended) addClaim("architecture.recommendation", recommended, "");

  for (const entry of arr(obj(root.scope).items)) {
    const node = obj(entry);
    if (!str(node.id).startsWith("TECH_")) continue;
    const text = `${str(node.title)} ${str(node.description)}`;
    addClaim("scope.items", "", text, str(node.id));
  }

  for (const entry of arr(root.changeLog)) {
    const node = obj(entry);
    const text =
      typeof entry === "string" ? entry : `${str(node.summary)} ${str(node.description)} ${str(node.reason)}`;
    if (platformsIn(text).length > 0) addClaim("changeLog", "", text);
  }

  const prdText = str(at(root, "outputs.prd.data.overview")); 
  if (prdText) addClaim("outputs.prd.data.overview", "", prdText);

  const distinct = new Set(claims.map((claim) => claim.platform));
  const detected = distinct.size > 1;
  const summary = detected
    ? `Conflicting cloud platforms referenced: ${Array.from(distinct).sort().join(", ")}.`
    : "No platform conflict detected.";

  // A conflict is never auto-resolved: it needs an explicit user decision.
  return { detected, claims, resolved: false, summary };
}

function sectionStatuses(raw: Json): SectionStatus[] {
  const root = obj(raw);
  const projectVersion = str(at(root, "scope.version")) || null;
  const statuses: SectionStatus[] = SECTION_PATHS.map(({ name, path }) => {
    const nodeValue = at(root, path);
    const node = obj(nodeValue);
    const present = nodeValue !== undefined && Object.keys(node).length > 0;
    const rawStatus = str(node.status, present ? "unknown" : "missing");
    const staleReasons = strArray(node.staleReasons);
    const sectionVersion = str(at(node, "meta.scopeVersion")) || null;
    const reviewed = typeof node.reviewed === "boolean" ? node.reviewed : null;
    const versionMismatch =
      projectVersion !== null && sectionVersion !== null && sectionVersion !== projectVersion;
    return {
      name,
      path,
      present,
      status: !present
        ? "missing"
        : rawStatus !== "current" || staleReasons.length > 0 || versionMismatch
          ? "stale"
          : "current",
      reviewed,
      staleReasons,
      scopeVersion: sectionVersion,
    };
  });

  const qualityNode = at(root, "quality");
  const qualityObj = obj(qualityNode);
  const qualityVersion = str(qualityObj.scopeVersion) || null;
  statuses.push({
    name: "Quality", 
    path: "quality",
    present: qualityNode !== undefined,
    status:
      projectVersion !== null && qualityVersion !== null && qualityVersion !== projectVersion
        ? "stale"
        : "current",
    reviewed: null,
    staleReasons: [],
    scopeVersion: qualityVersion,
  });

  return statuses;
}

export function validatePackage(input: ValidateInput): {
  report: ValidationReport;
  conflict: PlatformConflict;
} {
  const { raw, normalized, structural } = input;
  const { canonical } = normalized;
  const issues: ValidationIssue[] = [];
  let counter = 0;

  const add = (
    severity: Severity,
    code: string,
    message: string,
    path: string,
    sourceIds: string[],
    remediation: string,
  ) => {
    counter += 1;
    issues.push({
      id: `ISSUE_${String(counter).padStart(3, "0")}`,
      severity,
      code,
      message,
      path,
      sourceIds,
      remediation,
    });
  };

  if (input.transportIssue) issues.push(input.transportIssue);

  /* -------- shape -------- */
  for (const section of structural.missingSections) {
    add(
      "warning",
      "missing-section",
      `The package is missing the "${section}" section.`,
      section,
      [],
      "Re-export the package from the deal-scoping workspace, or continue with a degraded view.",
    );
  }

  for (const key of input.strippedKeys) {
    add(
      "warning",
      "stripped-unsafe-key",
      `Removed a reserved JSON key ("${key}") while parsing to keep the import safe.`, 
      ".",
      [],
      "Rename the key in the source package if it is genuinely required.",
    );
  }

  for (const key of input.duplicateJsonKeys) {
    add(
      "warning",
      "duplicate-json-key",
      `The JSON document contains the key "${key}" more than once; only the last value is used.`,
      ".",
      [],
      "Deduplicate the key in the exported file.",
    );
  }

  /* -------- identifiers -------- */
  for (const duplicate of structural.duplicateIds) {
    add(
      "error",
      "duplicate-id",
      `Identifier ${duplicate.id} is defined ${duplicate.paths.length} times.`,
      duplicate.paths[0] ?? ".",
      [duplicate.id],
      "Identifiers must be unique across the package; remove or rename the duplicate.",
    );
  }

  for (const malformed of structural.malformedIds) {
    add(
      "warning",
      "malformed-id",
      `Identifier "${malformed.id}" does not follow the PREFIX_NN convention.`,
      malformed.path,
      [malformed.id],
      "Renumber the identifier in the source package.",
    );
  }

  const criticalIds = new Set(
    normalized.sourceIndex.filter((record) => record.critical).map((record) => record.id),
  );

  for (const dangling of structural.danglingRefs) {
    const critical = criticalIds.has(dangling.from) || criticalIds.has(dangling.id);
    add(
      critical ? "error" : "warning",
      "dangling-reference",
      `Reference "${dangling.id}" from ${dangling.from} does not exist in the package.`,
      dangling.path,
      [dangling.id, dangling.from].filter(Boolean),
      "Correct the reference or add the missing source item.",
    );
  }

  for (const unresolved of structural.unresolvedNameRefs) {
    add(
      "warning",
      "unresolved-name-reference",
      `Dependency "${unresolved.name}" (referenced by ${unresolved.from}) could not be matched to a capability.`,
      unresolved.path,
      [unresolved.from],
      "Confirm the capability name or add the missing capability.",
    );
  }

  for (const flow of structural.invalidFlowEndpoints) {
    add(
      "warning",
      "invalid-flow-endpoint",
      `Architecture flow ${flow.from} → ${flow.to} references a component that is not defined.`,
      flow.path,
      [flow.from, flow.to],
      "Align the flow endpoints with the component list.",
    );
  }

  /* -------- content integrity -------- */
  const allItems = [
    ...canonical.scope.requirements,
    ...canonical.scope.assumptions,
    ...canonical.scope.questions,
    ...canonical.scope.gaps,
    ...canonical.scope.risks,
    ...canonical.scope.dependencies,
  ];

  const excluded = allItems.filter((item) => !item.inScope);
  if (excluded.length > 0) {
    add(
      "info",
      "excluded-items",
      `${excluded.length} item(s) are excluded from scope and will not generate delivery work.`,
      "scope.items",
      excluded.map((item) => item.id),
      "Confirm the exclusions, or re-include them to bring the work back into the graph.",
    );
  }

  for (const item of allItems) {
    if (item.resolved && item.resolution.trim().length === 0) {
      add(
        "warning",
        "empty-resolution",
        `${item.id} is marked resolved but carries no resolution text.`,
        "scope.items",
        [item.id],
        "Record what was decided, or reopen the item.",
      );
    }
  }

  for (const item of allItems) {
    if (item.source.quoteVerified === false) {
      add(
        "info",
        "quote-mismatch",
        `The quote recorded for ${item.id} was not found in the cited source lines.`,
        "scope.items.source.quote",
        [item.id],
        "Re-verify the source anchor; the underlying call notes may have changed.",
      );
    }
  }

  const criticalOpen = allItems.filter((item) => item.critical && !item.resolved && item.inScope);
  if (criticalOpen.length > 0) {
    add(
      "warning",
      "critical-unresolved",
      `${criticalOpen.length} critical gap/question(s) are still unresolved.`,
      "scope.items",
      criticalOpen.map((item) => item.id),
      "Resolve each critical item or create a discovery node that owns it before execution.",
    );
  }

  /* -------- freshness -------- */
  const sections = sectionStatuses(raw);
  for (const section of sections) {
    if (!section.present) continue;
    if (section.reviewed === false) {
      add(
        "info",
        "section-unreviewed",
        `The "${section.name}" section has not been reviewed by a human.`,
        section.path,
        [],
        "Have a reviewer sign off on this section.",
      );
    }
    if (section.status === "stale") {
      add(
        "warning",
        "stale-section",
        `The "${section.name}" section is marked stale${section.staleReasons.length ? `: ${section.staleReasons.join("; ")}` : ""}.`,
        section.path,
        [],
        "Regenerate or re-approve this section before planning delivery.",
      );
    }
  }

  /* -------- platform conflict -------- */
  const conflict = detectPlatformConflict(raw, canonical);
  if (conflict.detected) {
    add(
      "warning",
      "platform-conflict",
      conflict.summary,
      "config.cloudPlatform",
      conflict.claims.map((claim) => claim.refId ?? "").filter(Boolean),
      "Record an explicit platform decision — the engine will not silently pick one.",
    );
  }

  /* -------- missing estimation inputs -------- */
  const missingCore: string[] = [];
  if (canonical.config.expectedUsers === null) missingCore.push("expectedUsers");
  if (canonical.config.environments === null) missingCore.push("environments");
  if (canonical.config.targetRegions.length === 0) missingCore.push("targetRegions");
  if (canonical.config.deadline === null) missingCore.push("deadline");

  if (missingCore.length > 0) {
    add(
      "warning",
      "missing-estimation-inputs",
      `${missingCore.length} core estimation input(s) are missing: ${missingCore.join(", ")}.`,
      "config",
      [],
      "Collect these values; estimates stay low-confidence until they are provided.",
    );
  }

  for (const missing of canonical.delivery.missingInputs) {
    add(
      "warning",
      "estimate-missing-input",
      `The estimate reports an unresolved input: ${missing}.`,
      "outputs.estimate.data.result.missingInputs",
      [],
      "Resolve the input and re-run the estimate upstream.",
    );
  }

  /* -------- quality passthrough -------- */
  for (const finding of canonical.quality.findings) {
    if (finding.status !== "warn") continue;
    add(
      "warning",
      `quality-check:${finding.checkId}`,
      `${finding.checkName}: ${finding.message}`,
      "quality.checks",
      [],
      "Address the upstream quality finding before operational handoff.",
    );
  }

  /* -------- unresolved backlog -------- */
  const openQuestions = canonical.scope.questions.filter((item) => !item.resolved && item.inScope);
  const openGaps = canonical.scope.gaps.filter((item) => !item.resolved && item.inScope);
  const unvalidated = canonical.scope.assumptions.filter(
    (item) => !item.resolved && !/approved|validated/i.test(item.review) && item.inScope,
  );
  const openRisks = canonical.scope.risks.filter((item) => !item.resolved && item.inScope);

  if (openQuestions.length > 0) {
    add(
      "info",
      "open-questions",
      `${openQuestions.length} question(s) remain open.`,
      "scope.items",
      openQuestions.map((item) => item.id),
      "Answer or defer each question; unanswered questions block ready execution.",
    );
  }

  if (openGaps.length > 0) {
    add(
      "info",
      "open-gaps",
      `${openGaps.length} gap(s) remain open.`,
      "scope.items",
      openGaps.map((item) => item.id),
      "Close each gap or create a discovery node.",
    );
  }

  if (unvalidated.length > 0) {
    add(
      "warning",
      "unvalidated-assumptions",
      `${unvalidated.length} assumption(s) have not been validated.`,
      "scope.items",
      unvalidated.map((item) => item.id),
      "Validate or explicitly accept each assumption.",
    );
  }

  if (openRisks.length > 0) {
    add(
      "info",
      "open-risks",
      `${openRisks.length} risk(s) remain open without an owner resolution.`,
      "scope.items",
      openRisks.map((item) => item.id),
      "Assign an owner to each risk before operational handoff.",
    );
  }

  const counts = {
    error: issues.filter((issue) => issue.severity === "error").length,
    warning: issues.filter((issue) => issue.severity === "warning").length,
    info: issues.filter((issue) => issue.severity === "info").length,
  };

  const referenceCounts = Object.fromEntries(
    Object.entries(buildReferenceCounts(raw, normalized.sourceIndex)).sort(([a], [b]) =>
      a.localeCompare(b),
    ),
  );

  return {
    report: {
      issues,
      counts,
      passed: counts.error === 0,
      sections,
      referenceCounts,
    },
    conflict,
  };
}

function buildReferenceCounts(raw: Json, index: SourceRecord[]): Record<string, number> {
  const root = obj(raw);
  const known = new Set(index.map((record) => record.id));
  const counts: Record<string, number> = {};
  const note = (id: string) => {
    if (known.has(id)) counts[id] = (counts[id] ?? 0) + 1;
  };

  for (const entry of arr(at(root, "outputs.prd.data.functionalScope.capabilities"))) {
    for (const id of strArray(obj(entry).requirementIds)) note(id);
  }
  for (const entry of arr(at(root, "outputs.architecture.data.components"))) {
    for (const id of strArray(obj(entry).requirementIds)) note(id);
  }
  for (const entry of arr(at(root, "outputs.dataIntegration.data.integrations"))) {
    for (const id of strArray(obj(entry).requirementIds)) note(id);
  }
  for (const entry of arr(at(root, "outputs.aiStrategy.data.useCases"))) {
    for (const id of strArray(obj(entry).requirementIds)) note(id);
  }
  for (const entry of arr(obj(root.scope).items)) {
    for (const id of strArray(obj(entry).relatedIds)) note(id);
  }

  return counts;
}
