/**
 * Representative deal-scoping workspace exports.
 *
 * The official `deal-scoping-input-packages.zip` is distributed with the
 * challenge and is not vendored here. These four fixtures reproduce the real
 * export shape (see `docs/source-to-canonical-mapping.md`) and deliberately
 * carry the same traps the official packages carry: out-of-scope items,
 * a cloud-platform conflict, nulled config values, critical open gaps, and
 * unvalidated assumptions.
 */
export interface DealFixture {
  id: string;
  fileName: string;
  title: string;
  scenario: string;
  exercises: string[];
  expectedMaturity: "execution-candidate" | "review-required" | "discovery-required" | "blocked";
  json: Record<string, unknown>;
  text: string;
}

interface ItemSpec {
  id: string;
  kind: string;
  title: string;
  description: string;
  priority?: string;
  provenance?: string;
  critical?: boolean;
  inScope?: boolean;
  resolved?: boolean;
  resolution?: string;
  review?: string;
  relatedIds?: string[];
  affectsInputs?: string[];
  /** 1-based line number in `notes` that anchors this item. */
  anchor?: number;
  /** Override the quote to simulate a stale source anchor. */
  anchorQuote?: string;
}

interface NamedSpec {
  name: string;
  capabilityIds?: string[];
  requirementIds?: string[];
  engagementModel?: string;
}

interface CapabilitySpec {
  id: string;
  name: string;
  description: string;
  priority?: string;
  requirementIds: string[];
  dependencies?: string[];
}

interface ComponentSpec {
  id: string;
  area: string;
  logicalComponent: string;
  service: string;
  requirementIds?: string[];
  assumptionIds?: string[];
}

interface IntegrationSpec {
  id: string;
  name: string;
  pattern: string;
  systemType?: string;
  direction?: string;
  authentication?: string;
  errorHandling?: string;
  requirementIds?: string[];
}

interface WorkstreamSpec {
  id: string;
  name: string;
  low: number;
  likely: number;
  high: number;
  roles?: string[];
  skills?: string[];
}

interface PackageSpec {
  id: string;
  name: string;
  customer: string;
  createdAt: string;
  updatedAt: string;
  notes: string[];
  scopeVersion: string;
  config: {
    cloudPlatform?: string | null;
    expectedUsers?: number | null;
    deadline?: string | null;
    environments?: number | null;
    targetRegions?: string[];
  };
  items: ItemSpec[];
  capabilities: CapabilitySpec[];
  modules?: NamedSpec[];
  workstreams?: NamedSpec[];
  deliveryPackages?: NamedSpec[];
  enhancements?: NamedSpec[];
  outOfScope?: NamedSpec[];
  components: ComponentSpec[];
  flows?: { from: string; to: string; label: string; kind?: string }[];
  domains?: { id: string; name: string; classification: string }[];
  integrations?: IntegrationSpec[];
  ai: {
    applicable: boolean;
    useCases?: { id: string; name: string; description: string; requirementIds?: string[] }[];
    boundaries?: { activity: string; type: string; reason: string; requirementIds?: string[] }[];
    responsibleAi?: string;
    dataPrivacy?: string;
  };
  estimate: {
    confidence: string;
    missingInputs?: string[];
    workstreams: WorkstreamSpec[];
    phases?: { id: string; name: string; workstreamIds?: string[] }[];
    totals: { low: number; likely: number; high: number };
  };
  qualityChecks: { id: string; name: string; status: "pass" | "warn"; findings?: string[] }[];
  changeLog: string[];
  prdOverview?: string;
  reviewed?: boolean;
  staleReasons?: string[];
}

function buildPackage(spec: PackageSpec): Record<string, unknown> {
  const lines = spec.notes;

  const items = spec.items.map((item) => {
    const quote = item.anchorQuote ?? (item.anchor ? (lines[item.anchor - 1] ?? "") : "");
    const source =
      item.anchor !== undefined
        ? {
            sectionId: `S${item.anchor}`,
            lineStart: item.anchor,
            lineEnd: item.anchor,
            quote,
            verified: true,
          }
        : undefined;
    return {
      id: item.id,
      kind: item.kind,
      title: item.title,
      description: item.description,
      priority: item.priority ?? "medium",
      provenance: item.provenance ?? "customer-stated",
      critical: item.critical ?? false,
      inScope: item.inScope ?? true,
      userEdited: false,
      resolved: item.resolved ?? false,
      resolution: item.resolution ?? "",
      review: item.review ?? "pending",
      relatedIds: item.relatedIds ?? [],
      affectsInputs: item.affectsInputs ?? [],
      signals: [],
      ...(source ? { source } : {}),
    };
  });

  const reviewed = spec.reviewed ?? false;

  return {
    disclaimer:
      "Sanitized export. All customer identifiers, volumes and commercial figures have been removed or replaced.",
    id: spec.id,
    name: spec.name,
    createdAt: spec.createdAt,
    updatedAt: spec.updatedAt,
    customer: { name: spec.customer, id: `CUST_${spec.id.slice(-3)}` },
    input: {
      rawText: lines.join("\n"),
      normalized: {
        lines,
        sections: lines.map((_, index) => ({
          id: `S${index + 1}`,
          title: `Section ${index + 1}`,
          lineStart: index + 1,
          lineEnd: index + 1,
        })),
      },
    },
    scope: { version: spec.scopeVersion, approvedVersion: spec.scopeVersion, items },
    config: {
      cloudPlatform: spec.config.cloudPlatform ?? null,
      expectedUsers: spec.config.expectedUsers ?? null,
      deadline: spec.config.deadline ?? null,
      environments: spec.config.environments ?? null,
      targetRegions: spec.config.targetRegions ?? [],
      currency: "USD",
    },
    estimationConfig: {
      rates: { architect: 180, engineer: 140 },
      contingencyPercent: 15,
      currency: "USD",
    },
    outputs: {
      prd: {
        status: reviewed ? "current" : "draft",
        reviewed,
        staleReasons: [],
        meta: { mode: "mock", scopeVersion: spec.scopeVersion },
        data: {
          overview: spec.prdOverview ?? "",
          functionalScope: {
            capabilities: spec.capabilities,
            recommendedEnhancements: spec.enhancements ?? [],
            modules: spec.modules ?? [],
            workstreams: spec.workstreams ?? [],
            deliveryPackages: spec.deliveryPackages ?? [],
            outOfScope: spec.outOfScope ?? [],
          },
        },
      },
      architecture: {
        status: reviewed ? "current" : "draft",
        reviewed,
        staleReasons: [],
        meta: { mode: "mock", scopeVersion: spec.scopeVersion },
        data: {
          platform: spec.config.cloudPlatform ?? null,
          components: spec.components,
          flows: spec.flows ?? [],
          environments: spec.config.environments ?? null,
          deployment: "container-based",
          securityControls: ["encryption-at-rest", "encryption-in-transit", "audit-logging"],
          selection: { approach: "single-cloud" },
          recommendation: { recommended: spec.config.cloudPlatform ?? null, scores: {} },
        },
      },
      dataIntegration: {
        status: reviewed ? "current" : "draft",
        reviewed,
        staleReasons: [],
        meta: { mode: "mock", scopeVersion: spec.scopeVersion },
        data: {
          domains: spec.domains ?? [],
          integrations: spec.integrations ?? [],
          topics: [],
          flows: [],
        },
      },
      aiStrategy: {
        status: reviewed ? "current" : "draft",
        reviewed,
        staleReasons: [],
        meta: { mode: "mock", scopeVersion: spec.scopeVersion },
        data: {
          applicable: spec.ai.applicable,
          useCases: spec.ai.useCases ?? [],
          boundaries: spec.ai.boundaries ?? [],
          evaluationApproach: spec.ai.applicable ? "offline + human review" : "not applicable",
          responsibleAi: spec.ai.responsibleAi ?? "",
          dataPrivacy: spec.ai.dataPrivacy ?? "",
        },
      },
      estimate: {
        status: reviewed ? "current" : "draft",
        reviewed,
        staleReasons: spec.staleReasons ?? [],
        meta: { mode: "mock", scopeVersion: spec.scopeVersion },
        data: {
          result: {
            workstreams: spec.estimate.workstreams,
            phases: spec.estimate.phases ?? [],
            totals: { effortDays: spec.estimate.totals, timelineWeeks: Math.round(spec.estimate.totals.likely / 5) },
            confidence: spec.estimate.confidence,
            missingInputs: spec.estimate.missingInputs ?? [],
            risks: [],
            dependencies: [],
            assumptions: [],
            exclusions: [],
            configSnapshot: { cloudPlatform: spec.config.cloudPlatform ?? null },
          },
        },
      },
    },
    quality: {
      status: "Review Required",
      scopeVersion: spec.scopeVersion,
      summary: { pass: spec.qualityChecks.filter((check) => check.status === "pass").length, warn: spec.qualityChecks.filter((check) => check.status === "warn").length },
      checks: spec.qualityChecks.map((check) => ({
        id: check.id,
        name: check.name,
        status: check.status,
        findings: check.findings ?? [],
      })),
    },
    executiveSummary: {
      headline: spec.name,
      summary: "Generated by the AI Deal Scoping Assistant (mock mode).",
    },
    changeLog: spec.changeLog,
  };
}

/* ------------------------------------------------------------------ */
/* 1. ClaimsDesk Modernization                                          */
/* ------------------------------------------------------------------ */

const claimsDesk = buildPackage({
  id: "DEAL_CLAIMSDESK",
  name: "ClaimsDesk Modernization",
  customer: "Northwind Mutual",
  createdAt: "2026-09-12T09:00:00.000Z",
  updatedAt: "2026-10-04T16:20:00.000Z",
  scopeVersion: "v7",
  reviewed: false,
  notes: [
    "ClaimsDesk is a claims handling application used by 241,850 members across four environments.",
    "Claim handlers need a single guided intake screen that replaces the current eleven-step wizard.",
    "Every claim must be acknowledged within 15 minutes of first notice of loss.",
    "The solution must post journal entries into SAP S/4HANA using its REST interface.",
    "Claim documents are stored in the existing enterprise document repository.",
    "Payment instructions are published to the finance event bus.",
    "An AI model should triage incoming claims and recommend a handling path.",
    "The platform will be hosted on Azure using the enterprise landing zone.",
    "A phased rollout is expected, starting with motor claims before property claims.",
    "Open: the SAP S/4HANA REST journal-posting contract has not been confirmed.",
    "Open: the release cadence and change-window policy are still undecided.",
    "Assumption: the enterprise document repository already exposes a batch ingestion endpoint.",
    "Assumption: existing handlers will receive two days of product training.",
    "Security and compliance require full audit logging and quarterly access reviews.",
  ],
  config: {
    cloudPlatform: "azure",
    expectedUsers: 241850,
    deadline: "2027-08-31",
    environments: 4,
    targetRegions: ["US", "CA"],
  },
  items: [
    { id: "BR_01", kind: "business", title: "Reduce claim handling time", description: "Cut average handling time by 30% through guided intake.", priority: "high", anchor: 2, relatedIds: ["FR_01"] },
    { id: "FR_01", kind: "functional", title: "Guided claim intake", description: "Single guided intake screen replacing the eleven-step wizard.", priority: "high", anchor: 2, relatedIds: ["FR_02", "NFR_01"] },
    { id: "FR_02", kind: "functional", title: "Triage and routing", description: "Route claims to the correct handling queue.", priority: "high", anchor: 2 },
    { id: "FR_03", kind: "functional", title: "Payment instruction publishing", description: "Publish payment instructions to the finance event bus.", priority: "high", anchor: 6 },
    { id: "NFR_01", kind: "nonFunctional", title: "Acknowledgement within 15 minutes", description: "Every claim acknowledged within 15 minutes of first notice of loss.", priority: "high", anchor: 3 },
    { id: "NFR_02", kind: "nonFunctional", title: "Phased rollout", description: "Motor claims first, then property claims.", priority: "medium", anchor: 9 },
    { id: "SEC_01", kind: "security", title: "Audit logging", description: "Full audit logging with quarterly access reviews.", priority: "high", anchor: 14, relatedIds: ["CON_01"] },
    { id: "CON_01", kind: "constraint", title: "Enterprise landing zone", description: "Must deploy into the Azure enterprise landing zone.", priority: "high", anchor: 8 },
    { id: "INT_01", kind: "integration", title: "SAP S/4HANA journal posting", description: "Post journal entries to SAP S/4HANA over REST.", priority: "high", anchor: 4, relatedIds: ["GAP_01", "Q_01"] },
    { id: "INT_02", kind: "integration", title: "Document repository", description: "Store claim documents in the enterprise document repository.", priority: "medium", anchor: 5, relatedIds: ["ASM_01"] },
    { id: "INT_03", kind: "integration", title: "Finance event bus", description: "Publish payment instructions to the finance event bus.", priority: "medium", anchor: 6 },
    { id: "DATA_01", kind: "data", title: "Claim record migration", description: "Migrate open claim records from the legacy system.", priority: "high", anchor: 1 },
    { id: "TECH_01", kind: "technology", title: "Azure hosting", description: "Azure is the selected cloud platform for this engagement.", priority: "high", anchor: 8 },
    { id: "PER_01", kind: "persona", title: "Claim handler", description: "Primary day-to-day user of the intake screen.", anchor: 2 },
    { id: "GAP_01", kind: "gap", title: "SAP REST contract not confirmed", description: "The journal-posting contract for SAP S/4HANA REST has not been confirmed.", priority: "high", critical: true, anchor: 10, affectsInputs: ["integrationReadiness"], relatedIds: ["Q_01"] },
    { id: "Q_01", kind: "question", title: "Is SAP REST journal posting available?", description: "Confirm whether the SAP S/4HANA REST interface supports journal posting for our volumes.", priority: "high", critical: true, anchor: 10, affectsInputs: ["integrationReadiness"], relatedIds: ["GAP_01"] },
    { id: "Q_02", kind: "question", title: "What is the release cadence?", description: "The change-window policy and release cadence are undecided.", priority: "medium", anchor: 11 },
    { id: "ASM_01", kind: "assumption", title: "Document repository batch endpoint exists", description: "The repository already exposes a batch ingestion endpoint.", priority: "medium", review: "pending", anchor: 12, relatedIds: ["INT_02"] },
    { id: "ASM_02", kind: "assumption", title: "Handlers receive training", description: "Existing handlers will receive two days of training.", priority: "low", review: "pending", anchor: 13 },
    { id: "RSK_01", kind: "risk", title: "Legacy data quality", description: "Legacy claim records may contain inconsistent policy references.", priority: "medium", anchor: 12 },
    { id: "DEP_01", kind: "dependency", title: "Enterprise landing zone approval", description: "Landing-zone approval is required before any environment is provisioned.", priority: "high", anchor: 8 },
  ],
  capabilities: [
    { id: "CAP_01", name: "Guided Claim Intake", description: "Single guided intake experience.", priority: "high", requirementIds: ["FR_01", "BR_01"], dependencies: ["Claim Triage"] },
    { id: "CAP_02", name: "Claim Triage", description: "Automated triage of incoming claims.", priority: "high", requirementIds: ["FR_02"] },
    { id: "CAP_03", name: "Payments Integration", description: "Publish payment instructions to finance.", requirementIds: ["FR_03", "INT_03"] },
    { id: "CAP_04", name: "SAP Journal Posting", description: "Post journal entries into SAP S/4HANA.", priority: "high", requirementIds: ["INT_01", "GAP_01"] },
    { id: "CAP_05", name: "Document Management", description: "Store and retrieve claim documents.", requirementIds: ["INT_02"] },
    { id: "CAP_06", name: "AI Claim Triage", description: "AI-assisted triage recommendations.", requirementIds: ["FR_02"] },
    { id: "CAP_07", name: "Security and Audit", description: "Audit logging and access reviews.", priority: "high", requirementIds: ["SEC_01", "CON_01"] },
    { id: "CAP_08", name: "Claim Data Migration", description: "Move open claims from the legacy system.", requirementIds: ["DATA_01"] },
  ],
  modules: [
    { name: "Intake", capabilityIds: ["CAP_01", "CAP_02"], requirementIds: ["FR_01"] },
    { name: "Integrations", capabilityIds: ["CAP_03", "CAP_04", "CAP_05"], requirementIds: ["INT_01"] },
  ],
  workstreams: [
    { name: "OMU Claims", capabilityIds: ["CAP_01", "CAP_02", "CAP_03"] },
    { name: "Integrations", capabilityIds: ["CAP_04", "CAP_05"] },
    { name: "Platform", capabilityIds: ["CAP_07"] },
  ],
  deliveryPackages: [
    { name: "Claims Platform Foundation", capabilityIds: ["CAP_07"], engagementModel: "dedicated-team" },
    { name: "Intake Experience", capabilityIds: ["CAP_01", "CAP_02"], engagementModel: "topcoder-challenge-series" },
    { name: "Enterprise Integrations", capabilityIds: ["CAP_03", "CAP_04", "CAP_05"], engagementModel: "blended" },
  ],
  enhancements: [{ name: "Real-time fraud signals", requirementIds: ["FR_02"] }],
  outOfScope: [{ name: "Legacy mainframe decommission", requirementIds: ["DATA_01"] }],
  components: [
    { id: "ARC_01", area: "experience", logicalComponent: "Claims Web Portal", service: "azure-app-service", requirementIds: ["FR_01"], assumptionIds: [] },
    { id: "ARC_02", area: "api", logicalComponent: "Claims API Gateway", service: "azure-api-management", requirementIds: ["FR_01", "FR_02"] },
    { id: "ARC_03", area: "integration", logicalComponent: "SAP Journal Adapter", service: "azure-functions", requirementIds: ["INT_01"], assumptionIds: ["ASM_01"] },
    { id: "ARC_04", area: "integration", logicalComponent: "Payments Event Publisher", service: "azure-service-bus", requirementIds: ["INT_03"] },
    { id: "ARC_05", area: "data", logicalComponent: "Claims Data Store", service: "azure-sql", requirementIds: ["DATA_01"] },
    { id: "ARC_06", area: "ai", logicalComponent: "Triage Inference Service", service: "azure-ml", requirementIds: ["FR_02"] },
    { id: "ARC_07", area: "security", logicalComponent: "Identity and Audit", service: "azure-entra-id", requirementIds: ["SEC_01"] },
    { id: "ARC_08", area: "platform", logicalComponent: "Landing Zone", service: "azure-landing-zone", requirementIds: ["CON_01"] },
  ],
  flows: [
    { from: "ARC_01", to: "ARC_02", label: "submit claim", kind: "sync" },
    { from: "ARC_02", to: "ARC_03", label: "post journal", kind: "sync" },
    { from: "ARC_02", to: "ARC_04", label: "publish payment", kind: "async" },
    { from: "ARC_06", to: "ARC_02", label: "triage result", kind: "async" },
  ],
  domains: [
    { id: "DD_01", name: "Claim Record", classification: "confidential" },
    { id: "DD_02", name: "Policy Reference", classification: "internal" },
  ],
  integrations: [
    { id: "IF_01", name: "SAP S/4HANA", pattern: "api", systemType: "external", direction: "outbound", authentication: "oauth2", errorHandling: "retry-with-dlq", requirementIds: ["INT_01"] },
    { id: "IF_02", name: "Guidewire ClaimCenter", pattern: "api", systemType: "external", direction: "bidirectional", authentication: "oauth2", errorHandling: "retry", requirementIds: ["FR_02"] },
    { id: "IF_03", name: "Enterprise Document Repository", pattern: "batch", systemType: "external", direction: "outbound", authentication: "service-account", errorHandling: "manual-review", requirementIds: ["INT_02"] },
    { id: "IF_04", name: "Finance Event Bus", pattern: "event", systemType: "internal", direction: "outbound", authentication: "managed-identity", errorHandling: "retry-with-dlq", requirementIds: ["INT_03"] },
  ],
  ai: {
    applicable: true,
    useCases: [
      { id: "AIUC_01", name: "Claim triage recommendation", description: "Recommend a handling path for incoming claims.", requirementIds: ["FR_02"] },
    ],
    boundaries: [
      { activity: "Claim triage", type: "ai", reason: "Pattern recognition across historical claims.", requirementIds: ["FR_02"] },
      { activity: "Claim decision", type: "human", reason: "A handler must approve the recommended path.", requirementIds: ["FR_02", "BR_01"] },
      { activity: "Payment calculation", type: "deterministic", reason: "Payment amounts must be exactly reproducible.", requirementIds: ["FR_03"] },
    ],
    responsibleAi: "Human-in-the-loop review for every triage recommendation.",
    dataPrivacy: "Claim data is confidential; no third-party model training.",
  },
  estimate: {
    confidence: "medium",
    missingInputs: [],
    workstreams: [
      { id: "WS_01", name: "Intake experience", low: 90, likely: 120, high: 160, roles: ["frontend-engineer", "ux-designer"], skills: ["react", "design-systems"] },
      { id: "WS_02", name: "Core claims services", low: 120, likely: 170, high: 220, roles: ["backend-engineer"], skills: ["api-design", "domain-modelling"] },
      { id: "WS_03", name: "SAP integration", low: 60, likely: 95, high: 140, roles: ["integration-engineer"], skills: ["sap", "rest"] },
      { id: "WS_04", name: "AI triage", low: 40, likely: 70, high: 110, roles: ["ml-engineer"], skills: ["ml", "evaluation"] },
      { id: "WS_05", name: "Platform and security", low: 70, likely: 110, high: 150, roles: ["cloud-engineer", "security-engineer"], skills: ["azure", "iac"] },
      { id: "WS_06", name: "Data migration", low: 50, likely: 75, high: 110, roles: ["data-engineer"], skills: ["etl"] },
      { id: "WS_07", name: "Testing and release", low: 30, likely: 35, high: 60, roles: ["qa-engineer"], skills: ["test-automation"] },
    ],
    phases: [
      { id: "WS_PH_1", name: "Foundation", workstreamIds: ["WS_05"] },
      { id: "WS_PH_2", name: "Build", workstreamIds: ["WS_01", "WS_02", "WS_03", "WS_04"] },
      { id: "WS_PH_3", name: "Harden", workstreamIds: ["WS_06", "WS_07"] },
    ],
    totals: { low: 460, likely: 675, high: 950 },
  },
  qualityChecks: [
    { id: "high-priority-coverage", name: "High priority coverage", status: "warn", findings: ["GAP_01 affects a high priority integration requirement."] },
    { id: "unresolved-questions", name: "Unresolved questions", status: "warn", findings: ["Q_01 is critical and unresolved."] },
    { id: "conflicting-cloud-selection", name: "Conflicting cloud selection", status: "pass" },
    { id: "missing-estimation-inputs", name: "Missing estimation inputs", status: "pass" },
    { id: "assumptions-needing-validation", name: "Assumptions needing validation", status: "warn", findings: ["ASM_01, ASM_02 are unvalidated."] },
    { id: "stale-sections", name: "Stale sections", status: "pass" },
    { id: "traceability-completeness", name: "Traceability completeness", status: "pass" },
    { id: "security-coverage", name: "Security coverage", status: "pass" },
    { id: "nfr-completeness", name: "Non-functional completeness", status: "pass" },
    { id: "integration-readiness", name: "Integration readiness", status: "warn", findings: ["Integration readiness depends on GAP_01."] },
    { id: "data-classification", name: "Data classification", status: "pass" },
    { id: "delivery-phasing", name: "Delivery phasing", status: "pass" },
  ],
  changeLog: [
    "Scope v6 → v7: added Q_02 (release cadence undecided).",
    "Scope v5 → v6: INT_01 linked to GAP_01.",
  ],
  prdOverview: "ClaimsDesk modernization hosted on Azure with SAP S/4HANA journal posting.",
});

/* ------------------------------------------------------------------ */
/* 2. Clinical Intake and Patient Support Assistant                     */
/* ------------------------------------------------------------------ */

const clinical = buildPackage({
  id: "DEAL_CLINICAL",
  name: "Clinical Intake and Patient Support Assistant",
  customer: "Riverside Health Network",
  createdAt: "2026-09-18T08:00:00.000Z",
  updatedAt: "2026-10-05T10:05:00.000Z",
  scopeVersion: "v4",
  reviewed: false,
  notes: [
    "Patients submit intake documents through a secure portal before their first appointment.",
    "An AI model extracts structured clinical information from the uploaded documents.",
    "Every extracted field must be confirmed by a clinician before it enters the record.",
    "The assistant answers patient questions using an approved clinical knowledge base.",
    "Intake data must be written into Epic using the FHIR interface.",
    "Identity verification happens through the existing patient identity provider.",
    "The service handles protected health information and is fully regulated.",
    "The solution will run on AWS in the research account.",
    "The delivery team previously selected Azure as the target platform.",
    "Open: write access to the Epic FHIR sandbox has not been demonstrated.",
    "Open: the clinical safety case reviewer has not been named.",
    "Assumption: the approved knowledge base is already curated and versioned.",
    "Assumption: patients always access the portal through the mobile application.",
    "Out of scope: scheduling and appointment booking.",
    "Out of scope: insurance eligibility checks.",
  ],
  config: {
    cloudPlatform: "azure",
    expectedUsers: 42000,
    deadline: "2027-03-31",
    environments: 3,
    targetRegions: ["US"],
  },
  items: [
    { id: "BR_01", kind: "business", title: "Reduce intake effort", description: "Remove manual data entry for patient intake.", priority: "high", anchor: 1 },
    { id: "BR_05", kind: "business", title: "Appointment booking", description: "Booking is handled by the existing scheduling product.", inScope: false, anchor: 15, resolution: "Customer excluded booking from scope." },
    { id: "FR_01", kind: "functional", title: "Document ingestion", description: "Accept intake documents through a secure portal.", priority: "high", anchor: 1, relatedIds: ["FR_02", "DATA_01"] },
    { id: "FR_02", kind: "functional", title: "AI information extraction", description: "Extract structured clinical information from documents.", priority: "high", anchor: 2, relatedIds: ["FR_03"] },
    { id: "FR_03", kind: "functional", title: "Clinician confirmation", description: "Require clinician confirmation for every extracted field.", priority: "high", anchor: 3 },
    { id: "FR_04", kind: "functional", title: "Patient question answering", description: "Answer questions from an approved knowledge base.", priority: "medium", anchor: 4 },
    { id: "NFR_01", kind: "nonFunctional", title: "Clinical safety", description: "No unconfirmed AI output may enter the clinical record.", priority: "high", anchor: 3, relatedIds: ["FR_03"] },
    { id: "NFR_02", kind: "nonFunctional", title: "Response latency", description: "Assistant responses within three seconds for 95% of questions.", priority: "medium", anchor: 4 },
    { id: "SEC_01", kind: "security", title: "PHI protection", description: "Protected health information must stay inside the regulated boundary.", priority: "high", anchor: 7, relatedIds: ["DATA_01"] },
    { id: "CON_01", kind: "constraint", title: "Regulatory approval", description: "A named clinical safety reviewer must approve the release.", priority: "high", anchor: 7, relatedIds: ["Q_02"] },
    { id: "INT_01", kind: "integration", title: "Epic FHIR intake write", description: "Write confirmed intake data into Epic over FHIR.", priority: "high", anchor: 5, relatedIds: ["GAP_01", "Q_01"] },
    { id: "INT_05", kind: "integration", title: "Insurance eligibility", description: "Eligibility checks are handled outside this engagement.", inScope: false, anchor: 16, resolution: "Customer excluded eligibility checks." },
    { id: "INT_02", kind: "integration", title: "Patient identity provider", description: "Verify patient identity using the existing provider.", priority: "high", anchor: 6 },
    { id: "DATA_01", kind: "data", title: "PHI classification", description: "All intake documents are classified as protected health information.", priority: "high", anchor: 7 },
    { id: "TECH_01", kind: "technology", title: "AWS research account", description: "The research account selected for prototyping runs on AWS.", priority: "medium", anchor: 8 },
    { id: "GAP_01", kind: "gap", title: "Epic FHIR sandbox write not demonstrated", description: "Write access to the Epic FHIR sandbox has not been demonstrated.", priority: "high", critical: true, anchor: 10, affectsInputs: ["integrationReadiness"], relatedIds: ["Q_01"] },
    { id: "Q_01", kind: "question", title: "Does the Epic sandbox allow writes?", description: "Confirm whether the Epic FHIR sandbox permits write operations for intake.", priority: "high", critical: true, anchor: 10, affectsInputs: ["integrationReadiness"], relatedIds: ["GAP_01"] },
    { id: "Q_02", kind: "question", title: "Who is the safety-case reviewer?", description: "The clinical safety case reviewer has not been named.", priority: "high", anchor: 11, affectsInputs: ["approvalReadiness"] },
    { id: "ASM_01", kind: "assumption", title: "Knowledge base is curated", description: "The approved knowledge base is curated and versioned upstream.", review: "pending", anchor: 12, relatedIds: ["FR_04"] },
    { id: "ASM_02", kind: "assumption", title: "Portal access via mobile app", description: "Patients always access the portal through the mobile application.", review: "pending", anchor: 13 },
    { id: "RSK_01", kind: "risk", title: "Extraction accuracy", description: "Extraction errors may create clinical risk if not confirmed.", priority: "high", anchor: 3 },
  ],
  capabilities: [
    { id: "CAP_01", name: "Secure Document Ingestion", description: "Accept and store intake documents.", priority: "high", requirementIds: ["FR_01", "SEC_01"] },
    { id: "CAP_02", name: "Clinical Information Extraction", description: "AI extraction of structured clinical fields.", priority: "high", requirementIds: ["FR_02", "NFR_01"] },
    { id: "CAP_03", name: "Clinician Review Workflow", description: "Human confirmation of extracted fields.", priority: "high", requirementIds: ["FR_03", "NFR_01"] },
    { id: "CAP_04", name: "Patient Support Assistant", description: "Knowledge-grounded question answering.", requirementIds: ["FR_04", "NFR_02"] },
    { id: "CAP_05", name: "Epic FHIR Integration", description: "Write confirmed intake data into Epic.", priority: "high", requirementIds: ["INT_01", "GAP_01"] },
    { id: "CAP_06", name: "Identity Verification", description: "Patient identity verification.", requirementIds: ["INT_02"] },
    { id: "CAP_07", name: "Clinical Governance", description: "Regulatory approval and safety case.", priority: "high", requirementIds: ["CON_01", "SEC_01"] },
  ],
  modules: [
    { name: "Intake", capabilityIds: ["CAP_01", "CAP_02", "CAP_03"] },
    { name: "Assistant", capabilityIds: ["CAP_04"] },
    { name: "Integrations", capabilityIds: ["CAP_05", "CAP_06"] },
  ],
  workstreams: [
    { name: "Regulated AI Workflow", capabilityIds: ["CAP_02", "CAP_03"] },
    { name: "Patient Experience", capabilityIds: ["CAP_01", "CAP_04"] },
  ],
  deliveryPackages: [
    { name: "Regulated AI Intake", capabilityIds: ["CAP_02", "CAP_03"], engagementModel: "dedicated-team" },
    { name: "Epic Integration", capabilityIds: ["CAP_05"], engagementModel: "blended" },
    { name: "Patient Assistant", capabilityIds: ["CAP_04"], engagementModel: "topcoder-challenge-series" },
  ],
  enhancements: [{ name: "Multilingual support", requirementIds: ["FR_04"] }],
  outOfScope: [
    { name: "Appointment booking", requirementIds: ["BR_05"] },
    { name: "Insurance eligibility", requirementIds: ["INT_05"] },
  ],
  components: [
    { id: "ARC_01", area: "experience", logicalComponent: "Patient Portal", service: "azure-app-service", requirementIds: ["FR_01"] },
    { id: "ARC_02", area: "api", logicalComponent: "Intake API", service: "azure-container-apps", requirementIds: ["FR_01", "FR_02"], assumptionIds: ["ASM_01"] },
    { id: "ARC_03", area: "ai", logicalComponent: "Clinical Extraction Service", service: "azure-ai-foundry", requirementIds: ["FR_02"] },
    { id: "ARC_04", area: "ai", logicalComponent: "Support Assistant", service: "azure-ai-search", requirementIds: ["FR_04"] },
    { id: "ARC_05", area: "workflow", logicalComponent: "Clinician Review Queue", service: "azure-container-apps", requirementIds: ["FR_03"] },
    { id: "ARC_06", area: "integration", logicalComponent: "FHIR Adapter", service: "azure-functions", requirementIds: ["INT_01"], assumptionIds: [] },
    { id: "ARC_07", area: "security", logicalComponent: "PHI Boundary", service: "azure-private-link", requirementIds: ["SEC_01"] },
    { id: "ARC_08", area: "data", logicalComponent: "Document Store", service: "azure-blob-storage", requirementIds: ["DATA_01"] },
  ],
  flows: [
    { from: "ARC_01", to: "ARC_02", label: "upload document", kind: "sync" },
    { from: "ARC_02", to: "ARC_03", label: "extract fields", kind: "sync" },
    { from: "ARC_03", to: "ARC_05", label: "queue for review", kind: "async" },
    { from: "ARC_05", to: "ARC_06", label: "write confirmed record", kind: "sync" },
  ],
  domains: [
    { id: "DD_01", name: "Patient Intake Record", classification: "regulated" },
    { id: "DD_02", name: "Clinical Knowledge Base", classification: "internal" },
    { id: "DD_03", name: "Audit Log", classification: "regulated" },
  ],
  integrations: [
    { id: "IF_01", name: "Epic FHIR", pattern: "api", systemType: "external", direction: "outbound", authentication: "smart-on-fhir", errorHandling: "retry", requirementIds: ["INT_01"] },
    { id: "IF_02", name: "Patient Identity Provider", pattern: "api", systemType: "external", direction: "inbound", authentication: "oidc", errorHandling: "fail-closed", requirementIds: ["INT_02"] },
    { id: "IF_03", name: "Document Scanner Gateway", pattern: "file", systemType: "external", direction: "inbound", authentication: "mtls", errorHandling: "quarantine", requirementIds: ["FR_01"] },
    { id: "IF_04", name: "Knowledge Base Sync", pattern: "batch", systemType: "internal", direction: "inbound", authentication: "service-account", errorHandling: "retry", requirementIds: ["FR_04"] },
  ],
  ai: {
    applicable: true,
    useCases: [
      { id: "AIUC_01", name: "Clinical field extraction", description: "Extract structured fields from intake documents.", requirementIds: ["FR_02"] },
      { id: "AIUC_02", name: "Knowledge-grounded patient support", description: "Answer patient questions from the approved knowledge base.", requirementIds: ["FR_04"] },
    ],
    boundaries: [
      { activity: "Field extraction", type: "ai", reason: "Document layout varies widely.", requirementIds: ["FR_02"] },
      { activity: "Field confirmation", type: "human", reason: "A clinician must confirm every extracted field.", requirementIds: ["FR_03"] },
      { activity: "Identity matching", type: "deterministic", reason: "Must be exactly reproducible.", requirementIds: ["INT_02"] },
      { activity: "Answer grounding", type: "deterministic", reason: "Answers must cite approved sources only.", requirementIds: ["FR_04"] },
    ],
    responsibleAi: "No AI output enters the record without clinician confirmation.",
    dataPrivacy: "PHI never leaves the regulated boundary; no third-party training.",
  },
  estimate: {
    confidence: "medium",
    missingInputs: [],
    workstreams: [
      { id: "WS_01", name: "Patient portal", low: 60, likely: 85, high: 120, roles: ["frontend-engineer"], skills: ["react"] },
      { id: "WS_02", name: "Extraction pipeline", low: 90, likely: 130, high: 180, roles: ["ml-engineer"], skills: ["nlp", "evaluation"] },
      { id: "WS_03", name: "Clinician review workflow", low: 70, likely: 100, high: 140, roles: ["backend-engineer", "ux-designer"], skills: ["workflow"] },
      { id: "WS_04", name: "Epic FHIR integration", low: 70, likely: 110, high: 160, roles: ["integration-engineer"], skills: ["fhir"] },
      { id: "WS_05", name: "Security and compliance", low: 60, likely: 90, high: 130, roles: ["security-engineer"], skills: ["hipaa"] },
      { id: "WS_06", name: "Testing and clinical validation", low: 40, likely: 58, high: 90, roles: ["qa-engineer", "clinical-reviewer"], skills: ["validation"] },
    ],
    phases: [
      { id: "WS_PH_1", name: "Foundation", workstreamIds: ["WS_05"] },
      { id: "WS_PH_2", name: "Build", workstreamIds: ["WS_01", "WS_02", "WS_03", "WS_04"] },
      { id: "WS_PH_3", name: "Validate", workstreamIds: ["WS_06"] },
    ],
    totals: { low: 390, likely: 573, high: 820 },
  },
  qualityChecks: [
    { id: "high-priority-coverage", name: "High priority coverage", status: "pass" },
    { id: "unresolved-questions", name: "Unresolved questions", status: "warn", findings: ["Q_01 and Q_02 remain open."] },
    { id: "conflicting-cloud-selection", name: "Conflicting cloud selection", status: "warn", findings: ["TECH_01 references AWS while the selected platform is Azure."] },
    { id: "missing-estimation-inputs", name: "Missing estimation inputs", status: "pass" },
    { id: "assumptions-needing-validation", name: "Assumptions needing validation", status: "warn", findings: ["ASM_01, ASM_02 are unvalidated."] },
    { id: "stale-sections", name: "Stale sections", status: "pass" },
    { id: "traceability-completeness", name: "Traceability completeness", status: "pass" },
    { id: "security-coverage", name: "Security coverage", status: "pass" },
    { id: "nfr-completeness", name: "Non-functional completeness", status: "pass" },
    { id: "integration-readiness", name: "Integration readiness", status: "warn", findings: ["Epic FHIR write access unconfirmed (GAP_01)."] },
    { id: "data-classification", name: "Data classification", status: "pass" },
    { id: "delivery-phasing", name: "Delivery phasing", status: "pass" },
  ],
  changeLog: [
    "Platform decision changed from AWS to Azure (scope v3 → v4).",
    "PRD narrative has not yet been updated to reflect the Azure selection.",
  ],
  prdOverview:
    "The clinical intake assistant will be hosted on AWS in the research account, with Epic FHIR integration.",
});

/* ------------------------------------------------------------------ */
/* 3. Member Experience Modernisation (early discovery)                 */
/* ------------------------------------------------------------------ */

const memberExperience = buildPackage({
  id: "DEAL_MEMBER_EXP",
  name: "Member Experience Modernisation, Early Discovery",
  customer: "Harborline Benefits",
  createdAt: "2026-10-01T13:00:00.000Z",
  updatedAt: "2026-10-05T17:40:00.000Z",
  scopeVersion: "v2",
  reviewed: false,
  staleReasons: ["Upstream scope changed after the estimate was produced."],
  notes: [
    "The client wants a more modern digital experience for members.",
    "Members should be able to see their benefits in one place.",
    "We may want to use AI somewhere in the journey.",
    "It is unclear which systems hold the authoritative member data.",
    "Nobody has confirmed the volumes or the number of members involved.",
    "The compliance requirements for this market have not been discussed.",
    "There is no agreed environment strategy yet.",
    "No delivery deadline has been set.",
    "The current portal is believed to be hard to maintain.",
    "Several stakeholder groups disagree about the primary journey.",
    "The client asked for a directional estimate only.",
    "Assumption: the existing identity provider can be reused.",
  ],
  config: {
    cloudPlatform: "gcp",
    expectedUsers: null,
    deadline: null,
    environments: null,
    targetRegions: [],
  },
  items: [
    { id: "BR_01", kind: "business", title: "Modern member experience", description: "Directional goal for a modern digital member experience.", priority: "high", provenance: "customer-stated", anchor: 1 },
    { id: "BR_02", kind: "business", title: "Single view of benefits", description: "Members see their benefits in one place.", priority: "high", provenance: "customer-stated", anchor: 2, relatedIds: ["Q_02"] },
    { id: "BR_04", kind: "business", title: "AI somewhere in the journey", description: "The client has not defined where AI should be applied.", priority: "low", provenance: "customer-stated", anchor: 3, relatedIds: ["GAP_04", "Q_05"] },
    { id: "FR_01", kind: "functional", title: "Benefits summary", description: "Show a benefits summary to the member.", priority: "medium", provenance: "ai-inferred", anchor: 2 },
    { id: "FR_02", kind: "functional", title: "Member profile", description: "Show and update member profile details.", priority: "medium", provenance: "ai-inferred", anchor: 2 },
    { id: "INT_01", kind: "integration", title: "Member data integration", description: "Integrate with whatever holds authoritative member data.", priority: "high", provenance: "ai-inferred", anchor: 4, relatedIds: ["GAP_02"] },
    { id: "SYS_01", kind: "existingSystem", title: "Legacy member portal", description: "The current portal is believed to be hard to maintain.", priority: "medium", provenance: "customer-stated", anchor: 9 },
    { id: "ASM_01", kind: "assumption", title: "Identity provider reusable", description: "The existing identity provider can be reused as-is.", provenance: "assumed", review: "pending", anchor: 12 },
    { id: "GAP_01", kind: "gap", title: "Authoritative member system unknown", description: "No one has identified which system holds authoritative member data.", priority: "high", critical: true, anchor: 4, affectsInputs: ["integrationReadiness"], relatedIds: ["INT_01"] },
    { id: "GAP_02", kind: "gap", title: "No volume data", description: "Member volumes and peak load are unknown.", priority: "high", critical: true, anchor: 5, affectsInputs: ["sizing"] },
    { id: "GAP_03", kind: "gap", title: "No compliance analysis", description: "Compliance requirements for this market have not been analysed.", priority: "high", critical: true, anchor: 6, affectsInputs: ["complianceReadiness"] },
    { id: "GAP_04", kind: "gap", title: "AI use case undefined", description: "Where AI should be applied is undefined.", priority: "medium", anchor: 3, relatedIds: ["BR_04"] },
    { id: "GAP_05", kind: "gap", title: "No environment strategy", description: "There is no agreed environment strategy.", priority: "high", critical: true, anchor: 7, affectsInputs: ["environments"] },
    { id: "Q_01", kind: "question", title: "Which journey is primary?", description: "Stakeholder groups disagree about the primary journey.", priority: "high", critical: true, anchor: 10 },
    { id: "Q_03", kind: "question", title: "What are the NFRs?", description: "No non-functional requirements have been captured.", priority: "high", critical: true, anchor: 7, affectsInputs: ["nfrCompleteness"] },
    { id: "Q_04", kind: "question", title: "What is the target deadline?", description: "No delivery deadline has been set.", priority: "medium", anchor: 8, affectsInputs: ["deadline"] },
    { id: "Q_06", kind: "question", title: "Who owns the decision?", description: "Decision ownership between stakeholder groups is unclear.", priority: "medium", anchor: 10 },
    { id: "Q_02", kind: "question", title: "What data will members see?", description: "The benefits data model has not been defined.", priority: "medium", anchor: 2, anchorQuote: "Members should be able to see every benefit and claim in one consolidated place", relatedIds: ["BR_02"] },
    { id: "RSK_01", kind: "risk", title: "Directional estimate", description: "The client asked for a directional estimate only, so effort is low confidence.", priority: "medium", anchor: 11 },
  ],
  capabilities: [
    { id: "CAP_01", name: "Member Benefits Overview", description: "Directional capabilities for a benefits overview.", requirementIds: ["BR_02", "FR_01"] },
    { id: "CAP_02", name: "Member Profile Management", description: "View and update profile details.", requirementIds: ["FR_02"] },
    { id: "CAP_03", name: "Member Data Platform", description: "Provide a single view of member data.", requirementIds: ["INT_01"] },
    { id: "CAP_04", name: "Experience Foundations", description: "Design foundations for the modern experience.", requirementIds: ["BR_01"] },
  ],
  modules: [{ name: "Member Experience", capabilityIds: ["CAP_01", "CAP_02", "CAP_04"] }],
  workstreams: [{ name: "Discovery", capabilityIds: ["CAP_04"] }],
  deliveryPackages: [
    { name: "Experience Discovery", capabilityIds: ["CAP_04"], engagementModel: "topcoder-challenge-series" },
  ],
  enhancements: [],
  outOfScope: [],
  components: [
    { id: "ARC_01", area: "experience", logicalComponent: "Member Web Experience", service: "gcp-cloud-run", requirementIds: ["BR_01"] },
    { id: "ARC_02", area: "api", logicalComponent: "Member API", service: "gcp-cloud-run", requirementIds: ["FR_01", "FR_02"] },
    { id: "ARC_03", area: "integration", logicalComponent: "Member Data Adapter", service: "gcp-cloud-functions", requirementIds: ["INT_01"], assumptionIds: ["ASM_01"] },
  ],
  flows: [{ from: "ARC_01", to: "ARC_02", label: "benefits request", kind: "sync" }],
  domains: [{ id: "DD_01", name: "Member Profile", classification: "unclassified" }],
  integrations: [],
  ai: {
    applicable: true,
    useCases: [{ id: "AIUC_01", name: "Undefined member assistance", description: "Placeholder AI use case; scope undefined.", requirementIds: ["BR_04"] }],
    boundaries: [],
    responsibleAi: "Not defined.",
    dataPrivacy: "Not defined.",
  },
  estimate: {
    confidence: "low",
    missingInputs: ["memberVolumes", "environments", "complianceProfile", "targetDeadline", "nonFunctionalRequirements", "integrationInventory"],
    workstreams: [
      { id: "WS_01", name: "Discovery", low: 40, likely: 60, high: 90, roles: ["business-analyst", "ux-researcher"], skills: ["discovery"] },
      { id: "WS_02", name: "Experience design", low: 50, likely: 80, high: 130, roles: ["ux-designer"], skills: ["design"] },
      { id: "WS_03", name: "Member data exploration", low: 40, likely: 70, high: 120, roles: ["data-engineer"], skills: ["integration"] },
      { id: "WS_04", name: "Unallocated implementation", low: 90, likely: 57, high: 44, roles: ["fullstack-engineer"], skills: ["react"] },
    ],
    phases: [{ id: "WS_PH_1", name: "Discovery", workstreamIds: ["WS_01"] }],
    totals: { low: 220, likely: 267, high: 384 },
  },
  qualityChecks: [
    { id: "high-priority-coverage", name: "High priority coverage", status: "warn", findings: ["5 critical gaps have no covering capability."] },
    { id: "unresolved-questions", name: "Unresolved questions", status: "warn", findings: ["6 questions remain open."] },
    { id: "conflicting-cloud-selection", name: "Conflicting cloud selection", status: "pass" },
    { id: "missing-estimation-inputs", name: "Missing estimation inputs", status: "warn", findings: ["6 estimation inputs are missing."] },
    { id: "assumptions-needing-validation", name: "Assumptions needing validation", status: "warn", findings: ["ASM_01 is unvalidated."] },
    { id: "stale-sections", name: "Stale sections", status: "warn", findings: ["Estimate produced against an earlier scope version."] },
    { id: "traceability-completeness", name: "Traceability completeness", status: "pass" },
    { id: "security-coverage", name: "Security coverage", status: "warn", findings: ["No security requirements captured."] },
    { id: "nfr-completeness", name: "Non-functional completeness", status: "warn", findings: ["No non-functional requirements captured."] },
    { id: "integration-readiness", name: "Integration readiness", status: "warn", findings: ["Authoritative member system unknown."] },
    { id: "data-classification", name: "Data classification", status: "warn", findings: ["Member Profile domain is unclassified."] },
    { id: "delivery-phasing", name: "Delivery phasing", status: "pass" },
  ],
  changeLog: ["Scope v1 → v2: added BR_04 (AI use case unspecified).", "Estimate not regenerated after the scope change."],
  prdOverview: "Directional member experience modernisation on Google Cloud.",
});

/* ------------------------------------------------------------------ */
/* 4. Unified Supply Chain Analytics                                    */
/* ------------------------------------------------------------------ */

const supplyChain = buildPackage({
  id: "DEAL_SUPPLY_CHAIN",
  name: "Unified Supply Chain Analytics",
  customer: "Meridian Distribution",
  createdAt: "2026-09-22T11:00:00.000Z",
  updatedAt: "2026-10-05T14:30:00.000Z",
  scopeVersion: "v6",
  reviewed: false,
  notes: [
    "The client wants one analytics view across its supply chain.",
    "Inventory positions must reconcile nightly across 46 depots.",
    "Stockout risk should be forecast for the next fourteen days.",
    "Order data comes from the ERP system over its REST API.",
    "Shipment events arrive from carrier systems.",
    "Warehouse movements come from the warehouse management system.",
    "Customer master data is held in the CRM.",
    "Identity data is synchronised from the corporate identity provider.",
    "Data quality and lineage must be visible to the analytics team.",
    "The rollout is phased, beginning with the northern region.",
    "Open: real-time event coverage from the warehouse management system is unconfirmed.",
    "Open: the migration depth for historical order data has not been confirmed.",
    "Out of scope: supplier onboarding portal.",
    "Out of scope: transport planning optimisation.",
    "The platform will run on Google Cloud.",
  ],
  config: {
    cloudPlatform: "gcp",
    expectedUsers: 18400,
    deadline: "2027-06-30",
    environments: 3,
    targetRegions: ["EU", "UK"],
  },
  items: [
    { id: "BR_01", kind: "business", title: "Single supply chain view", description: "One analytics view across the supply chain.", priority: "high", anchor: 1 },
    { id: "BR_05", kind: "business", title: "Supplier onboarding portal", description: "Supplier onboarding is out of scope.", inScope: false, anchor: 13, resolution: "Customer excluded supplier onboarding." },
    { id: "FR_01", kind: "functional", title: "Inventory reconciliation", description: "Reconcile inventory positions nightly across 46 depots.", priority: "high", anchor: 2, relatedIds: ["GAP_01"] },
    { id: "FR_02", kind: "functional", title: "Stockout forecasting", description: "Forecast stockout risk for the next fourteen days.", priority: "high", anchor: 3 },
    { id: "FR_03", kind: "functional", title: "Data quality dashboard", description: "Expose data quality and lineage to the analytics team.", priority: "medium", anchor: 9 },
    { id: "NFR_01", kind: "nonFunctional", title: "Nightly reconciliation window", description: "Reconciliation must complete within the nightly window.", priority: "high", anchor: 2 },
    { id: "NFR_02", kind: "nonFunctional", title: "Forecast horizon", description: "Forecasts must cover a fourteen-day horizon.", priority: "medium", anchor: 3 },
    { id: "SEC_01", kind: "security", title: "Retention and audit", description: "Retention and audit rules apply to all supply chain data.", priority: "high", anchor: 9 },
    { id: "INT_01", kind: "integration", title: "ERP order integration", description: "Order data from the ERP over its REST API.", priority: "high", anchor: 4 },
    { id: "INT_02", kind: "integration", title: "Carrier shipment events", description: "Shipment events arrive from carrier systems.", priority: "high", anchor: 5 },
    { id: "INT_03", kind: "integration", title: "Warehouse management events", description: "Warehouse movements arrive from the WMS.", priority: "high", anchor: 6, relatedIds: ["GAP_01"] },
    { id: "INT_04", kind: "integration", title: "CRM customer master", description: "Customer master data from the CRM.", priority: "medium", anchor: 7 },
    { id: "INT_06", kind: "integration", title: "Transport planning optimisation", description: "Transport planning is out of scope.", inScope: false, anchor: 14, resolution: "Customer excluded transport planning." },
    { id: "INT_05", kind: "integration", title: "Identity synchronisation", description: "Identity data synchronised from the corporate identity provider.", priority: "medium", anchor: 8 },
    { id: "DATA_01", kind: "data", title: "Historical order migration", description: "Migrate historical order data; depth unconfirmed.", priority: "high", anchor: 12, relatedIds: ["Q_02"] },
    { id: "TECH_01", kind: "technology", title: "Google Cloud", description: "The analytics platform will run on Google Cloud.", priority: "high", anchor: 15 },
    { id: "GAP_01", kind: "gap", title: "WMS real-time events unconfirmed", description: "Real-time event coverage from the warehouse management system is unconfirmed for 46 depots.", priority: "high", critical: true, anchor: 11, affectsInputs: ["integrationReadiness"], relatedIds: ["INT_03", "Q_01"] },
    { id: "Q_01", kind: "question", title: "Can the WMS emit real-time events?", description: "Confirm whether the WMS can emit real-time events at all 46 depots.", priority: "high", critical: true, anchor: 11, affectsInputs: ["integrationReadiness"], relatedIds: ["GAP_01"] },
    { id: "Q_02", kind: "question", title: "How deep is the data migration?", description: "The migration depth for historical order data has not been confirmed.", priority: "high", anchor: 12, affectsInputs: ["dataVolume"], relatedIds: ["DATA_01"] },
    { id: "Q_03", kind: "question", title: "What is the data volume?", description: "Peak data volumes across 46 depots are unquantified.", priority: "high", anchor: 12, affectsInputs: ["dataVolume"] },
    { id: "RSK_01", kind: "risk", title: "Reconciliation skew", description: "Late-arriving events may skew nightly reconciliation.", priority: "medium", anchor: 2 },
  ],
  capabilities: [
    { id: "CAP_01", name: "Inventory Reconciliation", description: "Nightly reconciliation across depots.", priority: "high", requirementIds: ["FR_01", "NFR_01"], dependencies: ["Supply Chain Data Platform"] },
    { id: "CAP_02", name: "Stockout Forecasting", description: "Forecast stockout risk.", priority: "high", requirementIds: ["FR_02", "NFR_02"], dependencies: ["Inventory Reconciliation"] },
    { id: "CAP_03", name: "Data Quality and Lineage", description: "Expose quality and lineage.", requirementIds: ["FR_03"] },
    { id: "CAP_04", name: "Supply Chain Data Platform", description: "Consolidated supply chain data platform.", priority: "high", requirementIds: ["INT_01", "INT_02", "INT_03"] },
    { id: "CAP_05", name: "ERP Integration", description: "ERP order integration.", requirementIds: ["INT_01"] },
    { id: "CAP_06", name: "Carrier Integration", description: "Carrier shipment events.", requirementIds: ["INT_02"] },
    { id: "CAP_07", name: "Warehouse Integration", description: "Warehouse movement events.", priority: "high", requirementIds: ["INT_03", "GAP_01"], dependencies: ["Legacy EDI Gateway"] },
    { id: "CAP_08", name: "Security and Retention", description: "Retention, privacy and audit.", requirementIds: ["SEC_01"] },
  ],
  modules: [
    { name: "Analytics", capabilityIds: ["CAP_01", "CAP_02", "CAP_03"] },
    { name: "Integration", capabilityIds: ["CAP_04", "CAP_05", "CAP_06", "CAP_07"] },
  ],
  workstreams: [
    { name: "Data Platform", capabilityIds: ["CAP_04", "CAP_08"] },
    { name: "Analytics", capabilityIds: ["CAP_01", "CAP_02", "CAP_03"] },
    { name: "Enterprise Integration", capabilityIds: ["CAP_05", "CAP_06", "CAP_07"] },
  ],
  deliveryPackages: [
    { name: "Data Platform Foundation", capabilityIds: ["CAP_04", "CAP_08"], engagementModel: "dedicated-team" },
    { name: "Reconciliation and Forecasting", capabilityIds: ["CAP_01", "CAP_02"], engagementModel: "topcoder-challenge-series" },
    { name: "Carrier and Warehouse Integrations", capabilityIds: ["CAP_06", "CAP_07"], engagementModel: "blended" },
  ],
  enhancements: [{ name: "Supplier scorecards", requirementIds: ["FR_03"] }],
  outOfScope: [
    { name: "Supplier onboarding portal", requirementIds: ["BR_05"] },
    { name: "Transport planning optimisation", requirementIds: ["INT_06"] },
  ],
  components: [
    { id: "ARC_01", area: "analytics", logicalComponent: "Supply Chain Analytics App", service: "gcp-cloud-run", requirementIds: ["FR_01", "FR_02"] },
    { id: "ARC_02", area: "data", logicalComponent: "Data Lakehouse", service: "gcp-bigquery", requirementIds: ["DATA_01"] },
    { id: "ARC_03", area: "data", logicalComponent: "Event Ingestion", service: "gcp-pubsub", requirementIds: ["INT_02", "INT_03"] },
    { id: "ARC_04", area: "integration", logicalComponent: "ERP Adapter", service: "gcp-cloud-functions", requirementIds: ["INT_01"] },
    { id: "ARC_05", area: "integration", logicalComponent: "CRM Adapter", service: "gcp-cloud-functions", requirementIds: ["INT_04"] },
    { id: "ARC_06", area: "analytics", logicalComponent: "Forecasting Service", service: "gcp-vertex-ai", requirementIds: ["FR_02"] },
    { id: "ARC_07", area: "platform", logicalComponent: "Governance and Retention", service: "gcp-dataplex", requirementIds: ["SEC_01"] },
    { id: "ARC_08", area: "security", logicalComponent: "Identity Bridge", service: "gcp-iap", requirementIds: ["INT_05"] },
  ],
  flows: [
    { from: "ARC_04", to: "ARC_02", label: "load orders", kind: "batch" },
    { from: "ARC_03", to: "ARC_02", label: "stream events", kind: "async" },
    { from: "ARC_02", to: "ARC_06", label: "training data", kind: "batch" },
    { from: "ARC_06", to: "ARC_01", label: "forecast", kind: "sync" },
  ],
  domains: [
    { id: "DD_01", name: "Order", classification: "internal" },
    { id: "DD_02", name: "Inventory Position", classification: "internal" },
    { id: "DD_03", name: "Shipment Event", classification: "internal" },
    { id: "DD_04", name: "Customer Master", classification: "confidential" },
    { id: "DD_05", name: "Warehouse Movement", classification: "internal" },
    { id: "DD_06", name: "Identity Reference", classification: "confidential" },
  ],
  integrations: [
    { id: "IF_01", name: "ERP REST API", pattern: "api", systemType: "internal", direction: "inbound", authentication: "oauth2", errorHandling: "retry", requirementIds: ["INT_01"] },
    { id: "IF_02", name: "Carrier Event Feed", pattern: "event", systemType: "external", direction: "inbound", authentication: "mtls", errorHandling: "dead-letter", requirementIds: ["INT_02"] },
    { id: "IF_03", name: "Warehouse Management System", pattern: "event", systemType: "external", direction: "inbound", authentication: "certificate", errorHandling: "dead-letter", requirementIds: ["INT_03"] },
    { id: "IF_04", name: "CRM Extract", pattern: "batch", systemType: "internal", direction: "inbound", authentication: "service-account", errorHandling: "retry", requirementIds: ["INT_04"] },
    { id: "IF_05", name: "Historical Order Archive", pattern: "file", systemType: "internal", direction: "inbound", authentication: "service-account", errorHandling: "manual-review", requirementIds: ["DATA_01"] },
  ],
  ai: {
    applicable: true,
    useCases: [{ id: "AIUC_01", name: "Stockout risk forecasting", description: "Forecast stockout risk per depot.", requirementIds: ["FR_02"] }],
    boundaries: [
      { activity: "Stockout forecasting", type: "ai", reason: "Demand patterns need statistical modelling.", requirementIds: ["FR_02"] },
      { activity: "Inventory reconciliation", type: "deterministic", reason: "Reconciliation must be exactly reproducible.", requirementIds: ["FR_01"] },
      { activity: "Forecast override", type: "human", reason: "Planners may override forecasts.", requirementIds: ["FR_02"] },
    ],
    responsibleAi: "Forecasts are advisory and overridable by planners.",
    dataPrivacy: "Customer master data is confidential and access-controlled.",
  },
  estimate: {
    confidence: "medium",
    missingInputs: ["dataVolume"],
    workstreams: [
      { id: "WS_01", name: "Data platform", low: 90, likely: 130, high: 180, roles: ["data-engineer"], skills: ["bigquery"] },
      { id: "WS_02", name: "Enterprise integrations", low: 110, likely: 160, high: 220, roles: ["integration-engineer"], skills: ["events", "batch"] },
      { id: "WS_03", name: "Reconciliation", low: 60, likely: 85, high: 120, roles: ["data-engineer"], skills: ["sql"] },
      { id: "WS_04", name: "Forecasting", low: 50, likely: 78, high: 120, roles: ["data-scientist"], skills: ["forecasting"] },
      { id: "WS_05", name: "Analytics experience", low: 40, likely: 60, high: 90, roles: ["frontend-engineer"], skills: ["dashboards"] },
      { id: "WS_06", name: "Governance and security", low: 30, likely: 45, high: 70, roles: ["security-engineer"], skills: ["retention"] },
      { id: "WS_07", name: "Testing and release", low: 25, likely: 35, high: 55, roles: ["qa-engineer"], skills: ["test-automation"] },
    ],
    phases: [
      { id: "WS_PH_1", name: "Foundation", workstreamIds: ["WS_01", "WS_06"] },
      { id: "WS_PH_2", name: "Build", workstreamIds: ["WS_02", "WS_03", "WS_04"] },
      { id: "WS_PH_3", name: "Release", workstreamIds: ["WS_05", "WS_07"] },
    ],
    totals: { low: 350, likely: 533, high: 755 },
  },
  qualityChecks: [
    { id: "high-priority-coverage", name: "High priority coverage", status: "warn", findings: ["GAP_01 blocks INT_03 coverage."] },
    { id: "unresolved-questions", name: "Unresolved questions", status: "warn", findings: ["Q_01, Q_02 and Q_03 remain open."] },
    { id: "conflicting-cloud-selection", name: "Conflicting cloud selection", status: "pass" },
    { id: "missing-estimation-inputs", name: "Missing estimation inputs", status: "warn", findings: ["dataVolume is unresolved."] },
    { id: "assumptions-needing-validation", name: "Assumptions needing validation", status: "pass" },
    { id: "stale-sections", name: "Stale sections", status: "pass" },
    { id: "traceability-completeness", name: "Traceability completeness", status: "pass" },
    { id: "security-coverage", name: "Security coverage", status: "pass" },
    { id: "nfr-completeness", name: "Non-functional completeness", status: "warn", findings: ["No availability target captured."] },
    { id: "integration-readiness", name: "Integration readiness", status: "warn", findings: ["WMS event coverage unconfirmed."] },
    { id: "data-classification", name: "Data classification", status: "pass" },
    { id: "delivery-phasing", name: "Delivery phasing", status: "pass" },
  ],
  changeLog: ["Scope v5 → v6: added Q_03 (data volume unquantified)."],
  prdOverview: "Unified supply chain analytics on Google Cloud across 46 depots.",
});

function fixture(
  id: string,
  scenario: string,
  exercises: string[],
  expectedMaturity: DealFixture["expectedMaturity"],
  json: Record<string, unknown>,
): DealFixture {
  return {
    id,
    fileName: `${id}.json`,
    title: String(json.name),
    scenario,
    exercises,
    expectedMaturity,
    json,
    text: JSON.stringify(json, null, 2),
  };
}

export const DEAL_PACKAGES: DealFixture[] = [
  fixture(
    "claimsdesk-modernization",
    "Mature enterprise modernization: integrations, migration, security, one AI use case.",
    [
      "Critical SAP gap with a linked question",
      "Unvalidated assumptions",
      "Warn-level quality checks and unreviewed sections",
      "Delivery-package engagement-model hints",
    ],
    "review-required",
    claimsDesk,
  ),
  fixture(
    "clinical-intake-and-patient-support-assistant",
    "Regulated AI solution with mandatory human validation and PHI boundaries.",
    [
      "Cloud-platform conflict (AWS vs Azure) that must not be auto-resolved",
      "Out-of-scope items that must never anchor delivery work",
      "Regulated data domains",
      "AI, deterministic and human decision boundaries",
    ],
    "review-required",
    clinical,
  ),
  fixture(
    "member-experience-modernisation-early-discovery",
    "Early discovery: directional requirements, undefined AI, missing NFRs and null config.",
    [
      "Null/absent config values treated as missing, never zero",
      "Low estimate confidence",
      "Nine open gaps and questions, five of them critical",
      "A stale source anchor (quote no longer matches the notes)",
    ],
    "discovery-required",
    memberExperience,
  ),
  fixture(
    "unified-supply-chain-analytics",
    "Data and integration-heavy programme with ERP, CRM, WMS and carrier systems.",
    [
      "Five integration patterns (api, event, batch, file)",
      "Six data domains including confidential ones",
      "An unresolved capability dependency name",
      "Reconciliation, forecasting and lineage work",
    ],
    "review-required",
    supplyChain,
  ),
];

export function findDealFixture(id: string): DealFixture | undefined {
  return DEAL_PACKAGES.find((entry) => entry.id === id);
}
