import {
  arr,
  at,
  bool,
  num,
  obj,
  slugify,
  str,
  strArray,
  type Json,
} from "./json";
import { isWellFormedId, namespaceOf, normalizeName } from "./ids";
import type {
  AiBoundary,
  AiUseCase,
  ArchitectureComponent,
  ArchitectureFlow,
  CanonicalPackage,
  Capability,
  DataDomain,
  DeliveryPhase,
  EstimateWorkstream,
  Integration,
  ItemKind,
  NamedGroup,
  QualityFinding,
  ScopeItem,
  SourceOrigin,
  SourceRecord,
} from "../canonical/types";

export interface StructuralFindings {
  presentSections: string[];
  missingSections: string[];
  duplicateIds: { id: string; paths: string[] }[];
  malformedIds: { id: string; path: string }[];
  danglingRefs: { id: string; from: string; path: string }[];
  unresolvedNameRefs: { name: string; from: string; path: string }[];
  quoteMismatches: { id: string; path: string }[];
  invalidFlowEndpoints: { path: string; from: string; to: string }[];
}

export interface NormalizeResult {
  canonical: CanonicalPackage;
  sourceIndex: SourceRecord[];
  findings: StructuralFindings;
}

const REQUIREMENT_KINDS = new Set<string>([
  "business",
  "functional",
  "nonFunctional",
  "security",
  "integration",
  "data",
  "existingSystem",
  "constraint",
  "technology",
  "persona",
]);

/** Normalize whitespace so quote verification tolerates re-flowed text. */
function flatten(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * Read a list that holds either plain strings or records carrying a label.
 *
 * The upstream tool writes some lists as `["qa-engineer"]` and others as
 * `[{ roleId: "qa-engineer", label: "QA Engineer", days: 11.4 }]`. Only the
 * string form used to survive, so the record form — which is what the official
 * packages use for `roles` and `missingInputs` — was silently dropped. Both
 * forms are read here, the human label is preferred, and an unreadable entry is
 * skipped without inventing a value.
 */
function labeledArray(value: Json, ...preferredKeys: string[]): string[] {
  const ordered = [...preferredKeys, "label", "name", "text", "title"];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const entry of arr(value)) {
    let text = "";
    if (typeof entry === "string") text = entry;
    else if (typeof entry === "number" || typeof entry === "boolean")
      text = String(entry);
    else {
      const record = obj(entry);
      for (const key of ordered) {
        const candidate = str(record[key]);
        if (candidate.trim().length > 0) {
          text = candidate;
          break;
        }
      }
    }
    const trimmed = text.trim();
    if (trimmed.length > 0 && !seen.has(trimmed)) {
      seen.add(trimmed);
      out.push(trimmed);
    }
  }
  return out;
}

/**
 * Architecture flows may terminate at an external system rather than an internal
 * component. Those endpoints are addressed as `ext:<integration id>:<name>` and
 * must resolve against the imported integration list instead of being reported
 * as an unresolvable component.
 */
function externalEndpointId(endpoint: string): string | null {
  const match = /^ext:([^:]+):/.exec(endpoint);
  const id = match?.[1]?.trim();
  return id && id.length > 0 ? id : null;
}

function verifyQuote(
  lines: string[],
  lineStart: number | undefined,
  lineEnd: number | undefined,
  quote: string | undefined,
): boolean | null {
  if (!quote) return null;
  if (lineStart === undefined || lineEnd === undefined) return null;
  const start = Math.max(0, lineStart - 1);
  const end = Math.min(lines.length, Math.max(lineEnd, lineStart));
  const window = lines.slice(start, end).join(" ");
  return flatten(window).includes(flatten(quote));
}

function readSource(value: Json, lines: string[], path: string): SourceOrigin {
  const node = obj(value);
  const sectionId = str(node.sectionId);
  const lineStart = num(node.lineStart);
  const lineEnd = num(node.lineEnd);
  const quote = str(node.quote);
  const declaredVerified =
    typeof node.verified === "boolean" ? node.verified : null;
  const recomputed =
    quote.length > 0
      ? verifyQuote(lines, lineStart ?? undefined, lineEnd ?? undefined, quote)
      : null;

  return {
    path,
    ...(sectionId ? { sectionId } : {}),
    ...(lineStart !== null ? { lineStart } : {}),
    ...(lineEnd !== null ? { lineEnd } : {}),
    ...(quote ? { quote } : {}),
    quoteVerified: recomputed === null ? declaredVerified : recomputed,
  };
}

function readScopeItem(value: Json, index: number, lines: string[]): ScopeItem {
  const node = obj(value);
  const path = `scope.items[${index}]`;
  const kind = str(node.kind, "unknown") as ItemKind | "unknown";
  const resolved = bool(node.resolved, false);
  return {
    id: str(node.id, `UNNAMED_${index + 1}`),
    kind,
    title: str(node.title, "Untitled item"),
    description: str(node.description),
    priority: str(node.priority, "unspecified"),
    provenance: str(node.provenance, "customer-stated"),
    critical: bool(node.critical, false),
    inScope: node.inScope === undefined ? true : bool(node.inScope, true),
    resolved,
    resolution: str(node.resolution),
    review: str(node.review, "pending"),
    relatedIds: strArray(node.relatedIds),
    affectsInputs: strArray(node.affectsInputs),
    source: readSource(node.source, lines, `${path}.source`),
  };
}

function toNamedGroup(
  value: Json,
  index: number,
  kind:
    | "module"
    | "workstream"
    | "deliveryPackage"
    | "enhancement"
    | "outOfScope",
  prefix: string,
): NamedGroup {
  const node = obj(value);
  // `outOfScope` entries on the official packages are statements shaped as
  // `{ text, refs, label }` rather than `{ name, requirementIds }`. Both shapes
  // are read so an excluded item keeps its wording and its source references
  // instead of collapsing to "Unnamed outOfScope N" with no traceability.
  const name = str(node.name, str(node.text, `Unnamed ${kind} ${index + 1}`));
  const engagementModelHint = str(node.engagementModel);
  const requirementIds = strArray(node.requirementIds);
  return {
    id: `${prefix}:${slugify(name)}`,
    name,
    synthesized: true,
    capabilityIds: strArray(node.capabilityIds),
    requirementIds:
      requirementIds.length > 0 ? requirementIds : strArray(node.refs),
    ...(engagementModelHint ? { engagementModelHint } : {}),
  };
}

export function normalizePackage(raw: Json): NormalizeResult {
  const root = obj(raw);
  const lines = strArray(at(root, "input.normalized.lines"));

  const presentSections: string[] = [];
  const missingSections: string[] = [];
  const track = (label: string, present: boolean) => {
    if (present) presentSections.push(label);
    else missingSections.push(label);
  };

  const scopeNode = obj(root.scope);
  track("scope.items", Array.isArray(scopeNode.items));
  track(
    "outputs.prd.functionalScope",
    at(root, "outputs.prd.data.functionalScope") !== undefined,
  );
  track(
    "outputs.architecture",
    at(root, "outputs.architecture.data") !== undefined,
  );
  track(
    "outputs.dataIntegration",
    at(root, "outputs.dataIntegration.data") !== undefined,
  );
  track(
    "outputs.aiStrategy",
    at(root, "outputs.aiStrategy.data") !== undefined,
  );
  track(
    "outputs.estimate.result",
    at(root, "outputs.estimate.data.result") !== undefined,
  );
  track("quality.checks", Array.isArray(at(root, "quality.checks")));
  track("config", Object.keys(obj(root.config)).length > 0);
  track("input.normalized.lines", lines.length > 0);

  /* ---------------- scope items ---------------- */
  const items = arr(scopeNode.items).map((entry, index) =>
    readScopeItem(entry, index, lines),
  );

  const buckets = {
    requirements: [] as ScopeItem[],
    assumptions: [] as ScopeItem[],
    questions: [] as ScopeItem[],
    gaps: [] as ScopeItem[],
    risks: [] as ScopeItem[],
    dependencies: [] as ScopeItem[],
  };

  for (const item of items) {
    if (REQUIREMENT_KINDS.has(item.kind)) buckets.requirements.push(item);
    else if (item.kind === "assumption") buckets.assumptions.push(item);
    else if (item.kind === "question") buckets.questions.push(item);
    else if (item.kind === "gap") buckets.gaps.push(item);
    else if (item.kind === "risk") buckets.risks.push(item);
    else if (item.kind === "dependency") buckets.dependencies.push(item);
  }

  /* ---------------- functional scope ---------------- */
  const prdScope = obj(at(root, "outputs.prd.data.functionalScope"));
  const capabilityNodes = arr(prdScope.capabilities);
  const capabilityNameIndex = new Map<string, string>();
  for (const entry of capabilityNodes) {
    const node = obj(entry);
    const name = str(node.name);
    if (name) capabilityNameIndex.set(normalizeName(name), str(node.id));
  }

  const unresolvedNameRefs: StructuralFindings["unresolvedNameRefs"] = [];

  const capabilities: Capability[] = capabilityNodes.map((entry, index) => {
    const node = obj(entry);
    const id = str(node.id, `CAP_${String(index + 1).padStart(2, "0")}`);
    const name = str(node.name, `Untitled capability ${index + 1}`);
    const dependencyNames = strArray(node.dependencies);
    const resolved: string[] = [];
    const unresolved: string[] = [];
    for (const dependency of dependencyNames) {
      const exact = capabilityNameIndex.get(normalizeName(dependency));
      if (exact && exact !== id) resolved.push(exact);
      else if (exact === id) resolved.push(exact);
      else {
        unresolved.push(dependency);
        unresolvedNameRefs.push({
          name: dependency,
          from: id,
          path: `outputs.prd.data.functionalScope.capabilities[${index}].dependencies`,
        });
      }
    }
    return {
      id,
      name,
      // The official packages state the capability prose in `scope`; older
      // exports used `description`. Both are read so the objective is never bare.
      description: str(node.scope, str(node.description)),
      priority: str(node.priority, "unspecified"),
      requirementIds: strArray(node.requirementIds),
      dependencyNames,
      resolvedDependencies: resolved,
      unresolvedDependencies: unresolved,
      // Placement hints: singular `module`/`workstream`/`deliveryPackage` on the
      // official packages, a `moduleNames` list on older exports.
      moduleNames: [
        ...strArray(node.moduleNames),
        ...["module", "workstream", "deliveryPackage"]
          .map((key) => str(node[key]))
          .filter((value) => value.length > 0),
      ],
      acceptanceConditions: labeledArray(
        node.acceptance,
        "label",
        "text",
        "statement",
      ),
    };
  });

  const groups = (
    key: string,
    kind:
      | "module"
      | "workstream"
      | "deliveryPackage"
      | "enhancement"
      | "outOfScope",
    prefix: string,
  ): NamedGroup[] =>
    arr(prdScope[key]).map((entry, index) =>
      toNamedGroup(entry, index, kind, prefix),
    );

  /* ---------------- architecture ---------------- */
  const architectureData = obj(at(root, "outputs.architecture.data"));
  const components: ArchitectureComponent[] = arr(
    architectureData.components,
  ).map((entry, index) => {
    const node = obj(entry);
    return {
      id: str(node.id, `ARC_${String(index + 1).padStart(2, "0")}`),
      area: str(node.area, "general"),
      logicalComponent: str(node.logicalComponent, "Unnamed component"),
      service: str(node.service),
      requirementIds: strArray(node.requirementIds),
      assumptionIds: strArray(node.assumptionIds),
    };
  });

  const componentIds = new Set(components.map((component) => component.id));
  // Read the integration ids up front: a flow may end at an external system
  // (`ext:INT_01:Guidewire ClaimCenter`), which is a valid endpoint even though
  // it is not an internal architecture component.
  const integrationIdSet = new Set(
    arr(obj(at(root, "outputs.dataIntegration.data")).integrations).map(
      (entry, index) =>
        str(obj(entry).id, `IF_${String(index + 1).padStart(2, "0")}`),
    ),
  );
  // External endpoints are addressed by *scope* identifier (`ext:INT_01:...`),
  // which is the integration requirement, not the `IF_*` interface-design record.
  // Both, plus any other imported scope item, count as a resolved endpoint.
  const scopeItemIdSet = new Set(
    arr(scopeNode.items).map((entry) => str(obj(entry).id)),
  );
  const endpointKnown = (endpoint: string): boolean => {
    if (componentIds.has(endpoint)) return true;
    const external = externalEndpointId(endpoint);
    return (
      external !== null &&
      (integrationIdSet.has(external) || scopeItemIdSet.has(external))
    );
  };

  const invalidFlowEndpoints: StructuralFindings["invalidFlowEndpoints"] = [];
  const flows: ArchitectureFlow[] = arr(architectureData.flows).map(
    (entry, index) => {
      const node = obj(entry);
      const from = str(node.from);
      const to = str(node.to);
      const valid = endpointKnown(from) && endpointKnown(to);
      if (!valid) {
        invalidFlowEndpoints.push({
          path: `outputs.architecture.data.flows[${index}]`,
          from,
          to,
        });
      }
      return {
        from,
        to,
        label: str(node.label),
        kind: str(node.kind, "flow"),
        valid,
      };
    },
  );

  /* ---------------- data + integration + AI ---------------- */
  const dataIntegration = obj(at(root, "outputs.dataIntegration.data"));
  const dataDomains: DataDomain[] = arr(dataIntegration.domains).map(
    (entry, index) => {
      const node = obj(entry);
      const classification = str(node.classification, "unclassified");
      return {
        id: str(node.id, `DD_${String(index + 1).padStart(2, "0")}`),
        name: str(node.name, `Untitled domain ${index + 1}`),
        classification,
        regulated: /regulated|restricted|phi|pii|sensitive/i.test(
          classification,
        ),
      };
    },
  );

  const integrations: Integration[] = arr(dataIntegration.integrations).map(
    (entry, index) => {
      const node = obj(entry);
      return {
        id: str(node.id, `IF_${String(index + 1).padStart(2, "0")}`),
        name: str(node.name, `Untitled integration ${index + 1}`),
        pattern: str(node.pattern, "api"),
        systemType: str(node.systemType, "external"),
        direction: str(node.direction, "bidirectional"),
        authentication: str(node.authentication, "unspecified"),
        errorHandling: str(node.errorHandling, "unspecified"),
        requirementIds: strArray(node.requirementIds),
      };
    },
  );

  const aiData = obj(at(root, "outputs.aiStrategy.data"));
  const aiUseCases: AiUseCase[] = arr(aiData.useCases).map((entry, index) => {
    const node = obj(entry);
    return {
      id: str(node.id, `AIUC_${String(index + 1).padStart(2, "0")}`),
      name: str(node.name, `Untitled AI use case ${index + 1}`),
      description: str(node.description),
      requirementIds: strArray(node.requirementIds),
    };
  });

  const aiBoundaries: AiBoundary[] = arr(aiData.boundaries).map((entry) => {
    const node = obj(entry);
    return {
      activity: str(node.activity),
      type: str(node.type, "deterministic"),
      reason: str(node.reason),
      requirementIds: strArray(node.requirementIds),
    };
  });

  /* ---------------- delivery + estimate ---------------- */
  const estimate = obj(at(root, "outputs.estimate.data.result"));

  // Two export variants are in the wild: effort nested under `effortDays`, and
  // effort carried directly on the workstream. Both are accepted, and neither is
  // guessed at: an absent number stays null so the node is marked needs-input.
  const readEffort = (
    raw: unknown,
  ): { low: number | null; likely: number | null; high: number | null } => {
    const node = obj(raw) as Record<string, unknown>;
    const nested = obj(node.effortDays) as Record<string, unknown>;
    const source: Record<string, unknown> =
      Object.keys(nested).length > 0 ? nested : node;
    const toNumber = (value: unknown): number | null => {
      if (typeof value === "number" && Number.isFinite(value)) return value;
      if (
        typeof value === "string" &&
        value.trim() !== "" &&
        Number.isFinite(Number(value))
      )
        return Number(value);
      return null;
    };
    return {
      low: toNumber(source.low) ?? toNumber(source.minimum),
      likely: toNumber(source.likely),
      high: toNumber(source.high) ?? toNumber(source.maximum),
    };
  };

  const workstreams: EstimateWorkstream[] = arr(estimate.workstreams).map(
    (entry, index) => {
      const node = obj(entry);
      const effort = readEffort(node);
      return {
        id: str(node.id, `WS_${String(index + 1).padStart(2, "0")}`),
        name: str(node.name, `Untitled workstream ${index + 1}`),
        low: effort.low,
        likely: effort.likely,
        high: effort.high,
        // Prefer the human label ("Engagement Manager") over the id slug
        // ("engagement-manager") so a Flexible Talent or Private Pod package reads
        // as a brief rather than as a list of identifiers.
        roles: labeledArray(node.roles, "label", "roleId"),
        skills: labeledArray(node.skills, "label", "skillId"),
      };
    },
  );

  const phases: DeliveryPhase[] = arr(estimate.phases).map((entry, index) => {
    const node = obj(entry);
    return {
      id: str(node.id, `WS_PH_${index + 1}`),
      name: str(node.name, `Phase ${index + 1}`),
      workstreamIds: strArray(node.workstreamIds),
    };
  });

  const totalsNode = obj(estimate.totals);
  const effortTotals =
    Object.keys(obj(totalsNode.effortDays)).length > 0
      ? obj(totalsNode.effortDays)
      : totalsNode;

  /* ---------------- quality ---------------- */
  const qualityNode = obj(root.quality);
  const findings: QualityFinding[] = [];
  let checksPassed = 0;
  let checksWarned = 0;
  for (const entry of arr(qualityNode.checks)) {
    const node = obj(entry);
    const status = str(node.status, "pass") === "warn" ? "warn" : "pass";
    if (status === "warn") checksWarned += 1;
    else checksPassed += 1;
    const checkId = str(node.id, "unnamed-check");
    const checkName = str(node.name, checkId);
    const checkFindings = arr(node.findings);
    if (checkFindings.length === 0) {
      findings.push({
        checkId,
        checkName,
        status,
        message: str(node.summary, `${checkName}: ${status}`),
        provenance: "imported",
      });
    } else {
      for (const finding of checkFindings) {
        findings.push({
          checkId,
          checkName,
          status,
          message:
            typeof finding === "string" ? finding : str(obj(finding).message),
          provenance: "imported",
        });
      }
    }
  }

  /* ---------------- config ---------------- */
  const configNode = obj(root.config);

  const canonical: CanonicalPackage = {
    schemaVersion: "1.0",
    deal: {
      id: str(root.id, "DEAL_UNKNOWN"),
      title: str(root.name, "Untitled deal"),
      // `customer.name` on older exports, `customer.customerName` on the official
      // packages; both are accepted so the deal is never labelled anonymously.
      customer: str(
        at(root, "customer.customerName"),
        str(at(root, "customer.name"), str(root.customer, "Unnamed customer")),
      ),
      maturity: "",
      platform: str(
        configNode.cloudPlatform,
        str(architectureData.platform, "unspecified"),
      ),
      confidence: str(estimate.confidence, "unknown"),
      updatedAt: str(root.updatedAt) || null,
    },
    scope: buckets,
    functionalScope: {
      capabilities,
      modules: groups("modules", "module", "MOD"),
      workstreams: groups("workstreams", "workstream", "WSF"),
      deliveryPackages: groups("deliveryPackages", "deliveryPackage", "PKG"),
      enhancements: groups("recommendedEnhancements", "enhancement", "ENH"),
      outOfScope: groups("outOfScope", "outOfScope", "EXT"),
    },
    architecture: {
      platform: str(
        configNode.cloudPlatform,
        str(architectureData.platform, "unspecified"),
      ),
      components,
      flows,
    },
    strategy: {
      dataDomains,
      integrations,
      aiUseCases,
      aiBoundaries,
    },
    delivery: {
      phases,
      workstreams,
      confidence: str(estimate.confidence, "unknown"),
      // The estimate writes these either as keys (`"dataVolume"`) or as records
      // (`{ key, label, howToResolve }`). The record form is what the official
      // packages use, so it is read here rather than dropped.
      missingInputs: labeledArray(estimate.missingInputs, "label", "key"),
      totals: {
        low: num(effortTotals.low),
        likely: num(effortTotals.likely),
        high: num(effortTotals.high),
      },
    },
    quality: {
      status: str(qualityNode.status, "unknown"),
      findings,
      checksPassed,
      checksWarned,
    },
    config: {
      cloudPlatform: str(configNode.cloudPlatform, "unspecified"),
      expectedUsers: num(configNode.expectedUsers),
      deadline: str(configNode.deadline) || null,
      environments: num(configNode.environments),
      targetRegions: strArray(configNode.targetRegions),
    },
  };

  /* ---------------- source index ---------------- */
  const index: SourceRecord[] = [];
  const push = (record: SourceRecord) => index.push(record);

  for (const item of items) {
    push({
      id: item.id,
      namespace: namespaceOf(item.id),
      kind: item.kind,
      title: item.title,
      inScope: item.inScope,
      critical: item.critical,
      resolved: item.resolved,
      status: !item.inScope ? "closed" : item.resolved ? "resolved" : "open",
      synthesized: false,
      origin: item.source,
    });
  }

  for (const capability of capabilities) {
    push({
      id: capability.id,
      namespace: "capability",
      kind: "capability",
      title: capability.name,
      inScope: true,
      critical: false,
      resolved: null,
      status: "n/a",
      synthesized: false,
      origin: { path: `outputs.prd.data.functionalScope.capabilities` },
    });
  }

  for (const group of [
    ...canonical.functionalScope.modules,
    ...canonical.functionalScope.workstreams,
    ...canonical.functionalScope.deliveryPackages,
    ...canonical.functionalScope.enhancements,
    ...canonical.functionalScope.outOfScope,
  ]) {
    push({
      id: group.id,
      namespace: namespaceOf(group.id),
      kind: namespaceOf(group.id),
      title: group.name,
      inScope: namespaceOf(group.id) !== "outOfScope",
      critical: false,
      resolved: null,
      status: "n/a",
      synthesized: true,
      origin: { path: "outputs.prd.data.functionalScope" },
    });
  }

  for (const component of components) {
    push({
      id: component.id,
      namespace: "component",
      kind: "component",
      title: component.logicalComponent,
      inScope: true,
      critical: false,
      resolved: null,
      status: "n/a",
      synthesized: false,
      origin: { path: "outputs.architecture.data.components" },
    });
  }

  for (const domain of dataDomains) {
    push({
      id: domain.id,
      namespace: "domain",
      kind: "data-domain",
      title: domain.name,
      inScope: true,
      critical: false,
      resolved: null,
      status: "n/a",
      synthesized: false,
      origin: { path: "outputs.dataIntegration.data.domains" },
    });
  }

  for (const integration of integrations) {
    push({
      id: integration.id,
      namespace: "integration",
      kind: "interface",
      title: integration.name,
      inScope: true,
      critical: false,
      resolved: null,
      status: "n/a",
      synthesized: false,
      origin: { path: "outputs.dataIntegration.data.integrations" },
    });
  }

  for (const useCase of aiUseCases) {
    push({
      id: useCase.id,
      namespace: "aiUseCase",
      kind: "ai-use-case",
      title: useCase.name,
      inScope: true,
      critical: false,
      resolved: null,
      status: "n/a",
      synthesized: false,
      origin: { path: "outputs.aiStrategy.data.useCases" },
    });
  }

  for (const workstream of workstreams) {
    push({
      id: workstream.id,
      namespace: "estimateWorkstream",
      kind: "estimate-workstream",
      title: workstream.name,
      inScope: true,
      critical: false,
      resolved: null,
      status: "n/a",
      synthesized: false,
      origin: { path: "outputs.estimate.data.result.workstreams" },
    });
  }

  for (const phase of phases) {
    push({
      id: phase.id,
      namespace: "phase",
      kind: "phase",
      title: phase.name,
      inScope: true,
      critical: false,
      resolved: null,
      status: "n/a",
      synthesized: false,
      origin: { path: "outputs.estimate.data.result.phases" },
    });
  }

  const duplicateMap = new Map<string, string[]>();
  for (const record of index) {
    const existing = duplicateMap.get(record.id) ?? [];
    existing.push(record.origin.path);
    duplicateMap.set(record.id, existing);
  }
  const duplicateIds = Array.from(duplicateMap.entries())
    .filter(([, paths]) => paths.length > 1)
    .map(([id, paths]) => ({ id, paths }));

  const malformedIds = index
    .filter((record) => !isWellFormedId(record.id))
    .map((record) => ({ id: record.id, path: record.origin.path }));

  const structuralFindings: StructuralFindings = {
    presentSections,
    missingSections,
    duplicateIds,
    malformedIds,
    danglingRefs: [],
    unresolvedNameRefs,
    quoteMismatches: [],
    invalidFlowEndpoints,
  };

  return {
    canonical,
    sourceIndex: index,
    findings: structuralFindings,
  };
}

/** Fields on the raw package that hold identifiers pointing at other records. */
const REFERENCE_PATHS: { path: string; field: string }[] = [
  {
    path: "outputs.prd.data.functionalScope.capabilities",
    field: "requirementIds",
  },
  { path: "outputs.architecture.data.components", field: "requirementIds" },
  { path: "outputs.architecture.data.components", field: "assumptionIds" },
  {
    path: "outputs.dataIntegration.data.integrations",
    field: "requirementIds",
  },
  { path: "outputs.aiStrategy.data.useCases", field: "requirementIds" },
  { path: "outputs.aiStrategy.data.boundaries", field: "requirementIds" },
];

export interface ReferenceScan {
  danglingRefs: StructuralFindings["danglingRefs"];
  quoteMismatches: StructuralFindings["quoteMismatches"];
  referenceCounts: Record<string, number>;
}

/** Re-read the raw package and check that every reference resolves. */
export function scanReferences(
  raw: Json,
  index: SourceRecord[],
): ReferenceScan {
  const root = obj(raw);
  const known = new Set(index.map((record) => record.id));
  const referenceCounts: Record<string, number> = {};
  const danglingRefs: StructuralFindings["danglingRefs"] = [];
  const quoteMismatches: StructuralFindings["quoteMismatches"] = [];

  const note = (id: string, from: string, path: string) => {
    if (!id) return;
    if (!known.has(id)) danglingRefs.push({ id, from, path });
    else referenceCounts[id] = (referenceCounts[id] ?? 0) + 1;
  };

  for (const item of arr(obj(root.scope).items)) {
    const node = obj(item);
    const from = str(node.id, "unknown-item");
    for (const id of strArray(node.relatedIds)) {
      note(id, from, `scope.items[${from}].relatedIds`);
    }
  }

  for (const { path, field } of REFERENCE_PATHS) {
    const entries = arr(at(root, path));
    entries.forEach((entry, index) => {
      const node = obj(entry);
      const from = str(node.id, `${path}[${index}]`);
      for (const id of strArray(node[field]))
        note(id, from, `${path}[${index}].${field}`);
    });
  }

  const lines = strArray(at(root, "input.normalized.lines"));
  for (const item of arr(obj(root.scope).items)) {
    const node = obj(item);
    const id = str(node.id, "unnamed");
    const source = obj(node.source);
    const quote = str(source.quote);
    const lineStart = num(source.lineStart);
    const lineEnd = num(source.lineEnd);
    if (!quote || lineStart === null || lineEnd === null) continue;
    if (verifyQuote(lines, lineStart, lineEnd, quote) === false) {
      quoteMismatches.push({ id, path: "scope.items.source.quote" });
    }
  }

  return { danglingRefs, quoteMismatches, referenceCounts };
}
