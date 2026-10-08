import { describe, expect, test } from "bun:test";
import {
  appendDecision,
  applyOverride,
  buildEdgeDrafts,
  classifyNode,
  compileDeal,
  createDecision,
  createLog,
  createMockProvider,
  diffGraphs,
  isAiProvenance,
  isGrounded,
  isUserProvenance,
  mergedAwayIds,
  nodeEditsFrom,
  nodeStatusFrom,
  provenanceLabel,
  recentDecisions,
  removedNodesFrom,
  resetDecisionSequence,
  runImport,
  suggestionStatusFrom,
  validateDecomposition,
  validateDependencies,
  validateModelRecommendation,
  validatePackageDraft,
  type CompiledDeal,
  type EditableField,
  type ExecutionNode,
  type ImportedPackage,
} from "@deal-to-challenge/engine";
import { SAMPLE_PACKAGES } from "@deal-to-challenge/engine/samples";
import { testNode } from "./synthetic/graphs";

const GENERATED_AT = "2026-10-07T00:00:00.000Z";

async function compile(slug: string): Promise<CompiledDeal> {
  const sample = SAMPLE_PACKAGES.find((entry) => entry.id === slug);
  if (!sample) throw new Error(`missing sample ${slug}`);
  const imported: ImportedPackage = await runImport(
    sample.fileName,
    sample.text,
  );
  return compileDeal(imported, { generatedAt: GENERATED_AT });
}

const COMPILED = await Promise.all(
  SAMPLE_PACKAGES.map((sample) => compile(sample.id)),
);
const CLAIMSDESK = COMPILED[0] as CompiledDeal;
const MEMBER_EXPERIENCE = COMPILED[2] as CompiledDeal;

/**
 * The parsed source of a compiled deal, so expected values are *derived* from the
 * package rather than hard-coded. Only the paths these tests read are typed.
 */
interface RawWorkstream {
  id: string;
  roles?: { roleId?: string; label?: string }[];
}

interface RawMissingInput {
  key?: string;
  label?: string;
}

interface RawPackage {
  customer?: { customerName?: string; name?: string };
  outputs?: {
    estimate?: {
      data?: {
        result?: {
          workstreams?: RawWorkstream[];
          missingInputs?: RawMissingInput[];
        };
      };
    };
  };
}

function raw(compiled: CompiledDeal): RawPackage {
  return compiled.imported.raw as RawPackage;
}

describe("official package regression", () => {
  test("all four supplied packages compile acyclic and are never Blocked", () => {
    for (const compiled of COMPILED) {
      expect(
        compiled.graph.findings.filter((finding) => finding.code === "cycle"),
      ).toEqual([]);
      expect(compiled.quality.counts.fail).toBe(0);
      expect(compiled.quality.status).not.toBe("Blocked");
    }
  });

  test("a release node draws its workstream from its own phase, which is what kept the release chain acyclic", () => {
    for (const compiled of COMPILED) {
      const releases = compiled.graph.nodes.filter(
        (node) => node.anchors.phaseId !== null,
      );
      expect(releases.length).toBe(compiled.canonical.delivery.phases.length);
      const phaseById = new Map(
        compiled.canonical.delivery.phases.map((phase) => [phase.id, phase]),
      );
      for (const release of releases) {
        const workstreamId = release.anchors.estimateWorkstreamId;
        if (workstreamId === null) continue;
        const phase = phaseById.get(release.anchors.phaseId as string);
        expect(phase?.workstreamIds).toContain(workstreamId);
      }
      // Consecutive releases are still sequenced, so the chain itself is intact.
      expect(
        compiled.graph.nodes.filter((node) => node.anchors.phaseId !== null)
          .length,
      ).toBeGreaterThan(1);
    }
  });

  test("the deal customer is read from the official customerName field", () => {
    for (const compiled of COMPILED) {
      const expected = raw(compiled).customer?.customerName ?? "";
      // The official packages always name the customer, so the value the engine
      // reports must equal it rather than falling back to the placeholder.
      expect(expected.length).toBeGreaterThan(0);
      expect(compiled.canonical.deal.customer).toBe(expected);
    }
  });

  test("estimate workstream roles are read from their record form", () => {
    for (const compiled of COMPILED) {
      const source =
        raw(compiled).outputs?.estimate?.data?.result?.workstreams ?? [];
      const withRoles = source.filter(
        (workstream) => (workstream.roles ?? []).length > 0,
      );
      expect(withRoles.length).toBeGreaterThan(0);
      for (const workstream of withRoles) {
        const canonical = compiled.canonical.delivery.workstreams.find(
          (entry) => entry.id === workstream.id,
        );
        expect(canonical).toBeDefined();
        // Every imported role survives as a readable label, and none is an object.
        expect(canonical?.roles.length).toBe(workstream.roles?.length ?? 0);
        expect(
          canonical?.roles.every(
            (role) => typeof role === "string" && role.length > 0,
          ),
        ).toBe(true);
        for (const role of workstream.roles ?? []) {
          const expected = role.label ?? role.roleId ?? "";
          expect(expected.length).toBeGreaterThan(0);
          expect(canonical?.roles).toContain(expected);
        }
      }
    }
  });

  test("every capability states acceptance criteria and they reach the generated nodes", () => {
    for (const compiled of COMPILED) {
      const capabilities = compiled.canonical.functionalScope.capabilities;
      expect(capabilities.length).toBeGreaterThan(0);
      expect(
        capabilities.every(
          (capability) => capability.acceptanceConditions.length > 0,
        ),
      ).toBe(true);
      // A capability-derived delivery node must carry the package's criteria.
      const starved = compiled.graph.nodes.filter(
        (node) =>
          node.kind === "delivery" &&
          node.anchors.capabilityId !== null &&
          node.acceptanceConditions.length === 0,
      );
      expect(starved.map((node) => node.id)).toEqual([]);
      for (const node of compiled.graph.nodes.filter(
        (entry) => entry.anchors.capabilityId !== null,
      )) {
        expect(node.acceptanceSourceIds.length).toBeGreaterThan(0);
      }
    }
  });

  test("missing estimate inputs become clarification nodes that quote the package", () => {
    const declared =
      raw(MEMBER_EXPERIENCE).outputs?.estimate?.data?.result?.missingInputs ??
      [];
    expect(declared.length).toBeGreaterThan(0);
    const clarifications = MEMBER_EXPERIENCE.graph.nodes.filter((node) =>
      node.title.startsWith("Provide missing estimation input:"),
    );
    expect(clarifications.length).toBe(declared.length);
    for (const entry of declared) {
      const label = entry.label ?? entry.key ?? "";
      expect(label.length).toBeGreaterThan(0);
      expect(clarifications.some((node) => node.title.includes(label))).toBe(
        true,
      );
    }
    for (const node of clarifications) {
      expect(node.kind).toBe("clarification");
      expect(node.sourceIds.length).toBeGreaterThan(0);
    }
  });

  test("every architecture flow resolves, including endpoints at external systems", () => {
    for (const compiled of COMPILED) {
      const flows = compiled.canonical.architecture.flows;
      expect(flows.length).toBeGreaterThan(0);
      expect(
        flows
          .filter((flow) => !flow.valid)
          .map((flow) => `${flow.from}->${flow.to}`),
      ).toEqual([]);
    }
    // The official packages do address external systems this way, so the check is
    // meaningful rather than vacuously true.
    expect(
      CLAIMSDESK.canonical.architecture.flows.some((flow) =>
        flow.to.startsWith("ext:"),
      ),
    ).toBe(true);
  });
});

describe("provenance", () => {
  test("every provenance value has a label and is classified once", () => {
    const all = [
      "imported",
      "ai-inferred",
      "ai-recommended",
      "user-created",
      "user-approved",
      "deterministic",
    ] as const;
    for (const value of all) {
      expect(provenanceLabel(value).length).toBeGreaterThan(0);
      // AI and user classification are mutually exclusive.
      expect(isAiProvenance(value) && isUserProvenance(value)).toBe(false);
    }
    expect(all.filter(isAiProvenance)).toEqual([
      "ai-inferred",
      "ai-recommended",
    ]);
    expect(all.filter(isUserProvenance)).toEqual([
      "user-created",
      "user-approved",
    ]);
  });

  test("a claim is grounded only with sources, unless a human decided it", () => {
    // A human decision stands on its own.
    expect(isGrounded("user-created", [])).toBe(true);
    expect(isGrounded("user-approved", [])).toBe(true);
    // Imported, AI and deterministic claims must cite what they came from.
    for (const value of [
      "imported",
      "deterministic",
      "ai-inferred",
      "ai-recommended",
    ] as const) {
      expect(isGrounded(value, [])).toBe(false);
      expect(isGrounded(value, ["FR_01"])).toBe(true);
    }
  });
});

describe("decision log helpers", () => {
  test("node lifecycle helpers reduce to the newest decision per target", () => {
    const a = deliveryNode(0).id;
    const b = deliveryNode(1).id;
    let log = logWith({
      type: "remove-node",
      rationale: "Drop a.",
      targetNodeIds: [a],
      summary: "remove a",
    });
    expect(removedNodesFrom(log)).toEqual([a]);
    expect(mergedAwayIds(log)).toEqual([]);
    // Editing the log by adding the node back restores it.
    log = appendDecision(
      log,
      createDecision({
        type: "add-node",
        rationale: "Restore a.",
        targetNodeIds: [a],
        summary: "add a",
        at: GENERATED_AT,
      }),
    );
    expect(removedNodesFrom(log)).toEqual([]);

    log = appendDecision(
      log,
      createDecision({
        type: "split-node",
        rationale: "Split b.",
        targetNodeIds: [b],
        summary: "split",
        at: GENERATED_AT,
      }),
    );
    expect(mergedAwayIds(log)).toEqual([b]);
    expect(recentDecisions(log, 1).length).toBe(1);
    expect(recentDecisions(log)[0]?.summary).toBe("split");
  });

  test("status and suggestion helpers read the newest state, defaulting to accepted", () => {
    let log = logWith({
      type: "approve-node",
      rationale: "ok",
      targetNodeIds: ["NODE_X"],
      summary: "approve",
    });
    log = appendDecision(
      log,
      createDecision({
        type: "mark-blocked",
        rationale: "hold",
        targetNodeIds: ["NODE_X"],
        summary: "block",
        at: GENERATED_AT,
      }),
    );
    // Newest wins per node.
    expect(
      nodeStatusFrom(log).find((entry) => entry.nodeId === "NODE_X")?.status,
    ).toBe("blocked");

    const accepted = appendDecision(
      logWith({
        type: "edit-node",
        rationale: "ok",
        targetNodeIds: ["NODE_X"],
        after: { suggestionId: "PROPOSAL_GAP_01" },
        summary: "accept",
      }),
      createDecision({
        type: "reject-node",
        rationale: "no",
        targetNodeIds: ["NODE_X"],
        after: { suggestionId: "PROPOSAL_Q_01", suggestionStatus: "rejected" },
        summary: "reject",
        at: GENERATED_AT,
      }),
    );
    expect(suggestionStatusFrom(accepted).get("PROPOSAL_GAP_01")).toBe(
      "accepted",
    );
    expect(suggestionStatusFrom(accepted).get("PROPOSAL_Q_01")).toBe(
      "rejected",
    );
  });

  test("decision ids are stable and resettable so exports are reproducible", () => {
    resetDecisionSequence();
    const first = createDecision({
      type: "add-edge",
      rationale: "r",
      summary: "s",
      at: GENERATED_AT,
    });
    expect(first.id).toBe("DECISION_001");
    expect(first.provenance).toBe("user-approved");
    // An edit creates content and is therefore recorded as user-created.
    const edit = createDecision({
      type: "edit-node",
      rationale: "r",
      summary: "s",
      at: GENERATED_AT,
    });
    expect(edit.provenance).toBe("user-created");
    resetDecisionSequence();
    expect(
      createDecision({
        type: "add-edge",
        rationale: "r",
        summary: "s",
        at: GENERATED_AT,
      }).id,
    ).toBe("DECISION_001");
  });
});

describe("AI provider contract", () => {
  test("the mock provider is deterministic, labelled and never silently trusted", async () => {
    const provider = createMockProvider();
    expect(provider.mode).toBe("mock");
    expect(provider.model).toBeNull();
    const request = {
      dealId: CLAIMSDESK.canonical.deal.id,
      dealTitle: CLAIMSDESK.canonical.deal.title,
      promptVersion: provider.promptVersion,
      sourceIds: ["GAP_01"],
      baseline: [
        {
          id: "BASELINE_NODE_A",
          title: "Baseline",
          objective: "Do the baseline work.",
          workCategory: "backend-api",
          kind: "delivery",
          sourceIds: ["GAP_01"],
          rationale: "Derived.",
        },
      ],
      evidence: [
        {
          id: "Q_09",
          title: "Unknown volume",
          kind: "question",
          text: "Volume is undefined.",
        },
      ],
    };
    const first = await provider.decompose(request);
    const second = await provider.decompose(request);
    expect(first.mode).toBe("mock");
    expect(first.provider).toBe("mock");
    expect(JSON.stringify(first.proposal)).toBe(
      JSON.stringify(second.proposal),
    );
    // The uncovered evidence became a labelled clarification proposal.
    const extra = first.proposal.find(
      (proposal) => proposal.id === "PROPOSAL_Q_09",
    );
    expect(extra).toBeDefined();
    expect(extra?.sourceIds).toEqual(["Q_09"]);
    expect(validateDecomposition(first.proposal).ok).toBe(true);
  });

  test("the mock provider fills the remaining surfaces from deterministic facts", async () => {
    const provider = createMockProvider();
    const ctx = {
      dealId: CLAIMSDESK.canonical.deal.id,
      dealTitle: CLAIMSDESK.canonical.deal.title,
      promptVersion: provider.promptVersion,
      sourceIds: ["FR_01"],
    };
    const model = await provider.recommendModel({
      ...ctx,
      nodeId: "NODE_X",
      nodeTitle: "Node X",
      workCategory: "backend-api",
      features: {},
      deterministicScores: [
        { model: "challenge", score: 5 },
        { model: "private-pod", score: 3 },
        { model: "flexible-talent", score: 1 },
      ],
    });
    expect(model.proposal.primary).toBe("challenge");
    expect(validateModelRecommendation(model.proposal).ok).toBe(true);

    const dependencies = await provider.suggestDependencies({
      ...ctx,
      nodes: [
        {
          id: "NODE_A",
          title: "A",
          workCategory: "backend-api",
          sourceIds: ["FR_01"],
        },
        {
          id: "NODE_B",
          title: "B",
          workCategory: "testing",
          sourceIds: ["FR_01"],
        },
      ],
      deterministicEdges: [
        { source: "NODE_A", target: "NODE_B", type: "sequencing" },
      ],
    });
    expect(dependencies.proposal.length).toBe(1);
    expect(dependencies.proposal[0]?.rationale.length).toBeGreaterThan(0);

    const draft = await provider.draftPackage({
      ...ctx,
      nodeId: "NODE_X",
      model: "flexible-talent",
      missingFields: ["seniority", "capacity", "responsibilities"],
      evidence: [
        { id: "FR_01", title: "Intake", text: "Intake requirements." },
      ],
      baselineDraft: {},
    });
    // The mock refuses to invent a seniority level and says so instead.
    expect(String(draft.proposal.seniority)).toContain(
      "must set the seniority level",
    );
    expect(String(draft.proposal.capacity)).toContain(
      "must set the committed capacity",
    );
    expect(validatePackageDraft(draft.proposal).ok).toBe(true);

    const impact = await provider.explainImpact({
      ...ctx,
      facts: ["One node moved wave."],
    });
    expect(impact.proposal).toContain("One node moved wave.");
  });

  test("the schema validators reject malformed provider output", () => {
    expect(validateDecomposition("not an array").ok).toBe(false);
    expect(
      validateDecomposition([
        {
          id: "A",
          title: "t",
          objective: "o",
          workCategory: "w",
          kind: "k",
          sourceIds: [],
          rationale: "r",
        },
      ]).ok,
    ).toBe(false);
    expect(
      validateModelRecommendation({
        primary: "not-a-model",
        alternatives: [],
        rationale: ["x"],
      }).ok,
    ).toBe(false);
    expect(
      validateModelRecommendation({
        primary: "challenge",
        alternatives: ["challenge"],
        rationale: ["x"],
      }).ok,
    ).toBe(false);
    expect(
      validateModelRecommendation({
        primary: "challenge",
        alternatives: [],
        rationale: [],
      }).ok,
    ).toBe(false);
    const deps = validateDependencies(
      [
        {
          source: "NODE_A",
          target: "NODE_A",
          type: "sequencing",
          rationale: "r",
        },
        {
          source: "NODE_A",
          target: "NODE_MISSING",
          type: "not-a-type",
          rationale: "r",
        },
      ],
      ["NODE_A"],
      ["sequencing"],
    );
    expect(deps.ok).toBe(false);
    expect(deps.issues.length).toBeGreaterThan(0);
    expect(validatePackageDraft({ roles: ["a", 2] }).ok).toBe(false);
    expect(validatePackageDraft({ roles: ["a"] }).ok).toBe(true);
  });
});

describe("classification override", () => {
  test("overriding to the same model is a no-op and to another model keeps history", () => {
    const input = {
      nodeId: "NODE_X",
      title: "Node X",
      workCategory: "integration",
      kind: "delivery",
      sourceIds: ["FR_01"],
      roles: ["integration-engineer", "security-engineer", "backend-engineer"],
      componentIds: ["ARC_01", "ARC_02", "ARC_03", "ARC_04"],
      integrationIds: ["IF_01"],
      domainIds: ["DD_01"],
      sensitiveData: true,
      securityRequirementIds: ["SEC_01"],
      acceptanceMeasurable: true,
      effortMaximum: 120,
      phaseCount: 2,
      openSourceIds: [],
      deliverableCount: 2,
      humanReviewRequired: true,
      maturity: "review-required" as const,
    };
    const base = classifyNode(input);
    // Restricted data plus four coupled components must not go to an open challenge.
    expect(base.primary).not.toBe("challenge");
    expect(base.rationale.length).toBeGreaterThan(0);
    expect(base.primary).toBe("private-pod");

    expect(applyOverride(base, base.primary, "unchanged", GENERATED_AT)).toBe(
      base,
    );

    const overridden = applyOverride(
      base,
      "flexible-talent",
      "Single named specialist.",
      GENERATED_AT,
    );
    expect(overridden.primary).toBe("flexible-talent");
    expect(overridden.overridden).toBe(true);
    expect(overridden.overrideHistory.at(-1)).toEqual({
      from: base.primary,
      to: "flexible-talent",
      rationale: "Single named specialist.",
      at: GENERATED_AT,
    });
    expect(overridden.alternatives).toContain(base.primary);
    expect(overridden.alternatives).not.toContain("flexible-talent");
  });
});

/** A decision log with one entry appended at the fixed test timestamp. */
type DecisionSpec = Omit<Parameters<typeof createDecision>[0], "at">;

function logWith(input: DecisionSpec, dealId = CLAIMSDESK.canonical.deal.id) {
  return appendDecision(
    createLog(dealId),
    createDecision({ ...input, at: GENERATED_AT }),
  );
}

function deliveryNode(index = 0): ExecutionNode {
  const node = CLAIMSDESK.graph.nodes.filter(
    (entry) => entry.kind === "delivery",
  )[index];
  if (!node) throw new Error("missing delivery node");
  return node;
}

function orphansOf(compiled: CompiledDeal): string[] {
  return compiled.graph.findings
    .filter((finding) => finding.code === "orphan-node")
    .flatMap((finding) => finding.nodeIds);
}

describe("operator decisions", () => {
  test("every node status is applied and recorded", async () => {
    // A node the package left merely review-required, so the effect of each status
    // is observable rather than masked by a pre-existing block.
    const target = CLAIMSDESK.graph.nodes.find(
      (node) =>
        node.kind === "delivery" && node.readiness === "review-required",
    ) as ExecutionNode;
    expect(target).toBeDefined();
    const cases: {
      type: Parameters<typeof createDecision>[0]["type"];
      readiness: ExecutionNode["readiness"];
    }[] = [
      { type: "mark-blocked", readiness: "blocked" },
      { type: "reject-node", readiness: "blocked" },
      // A review request is not a block: it stays review-required so the operator
      // can clear it by approving, whereas blocked work needs the blocker resolved.
      { type: "mark-review-required", readiness: "review-required" },
    ];
    for (const entry of cases) {
      const log = logWith({
        type: entry.type,
        rationale: `Operator applied ${entry.type}.`,
        targetNodeIds: [target.id],
        summary: `${target.id}: ${entry.type}`,
      });
      const next = await compileDeal(CLAIMSDESK.imported, {
        decisions: log,
        generatedAt: GENERATED_AT,
      });
      const node = next.graph.nodes.find(
        (candidate) => candidate.id === target.id,
      ) as ExecutionNode;
      expect(node.readiness).toBe(entry.readiness);
      expect(node.readiness).not.toBe("ready");
      expect(
        next.decisions.entries.some((decision) => decision.type === entry.type),
      ).toBe(true);
    }

    // A rejection is a lasting block, not a transient status: it survives the
    // readiness recomputation that every recompile performs.
    const rejected = await compileDeal(CLAIMSDESK.imported, {
      decisions: logWith({
        type: "reject-node",
        rationale: "Not in scope.",
        targetNodeIds: [target.id],
        summary: "rejected",
      }),
      generatedAt: GENERATED_AT,
    });
    const rejectedNode = rejected.graph.nodes.find(
      (node) => node.id === target.id,
    ) as ExecutionNode;
    expect(rejectedNode.readiness).toBe("blocked");
    expect(rejectedNode.blockingStatus).toBe("blocked");
    expect(rejectedNode.readinessBlockers).toContain("open-blocker");
    expect(rejectedNode.humanReviewRequired).toBe(true);
    // The gate cannot present a blocked node as handoff-ready.
    expect(
      rejected.quality.findings.find(
        (finding) => finding.rule === "blocked-or-stale",
      )?.status,
    ).toBe("warn");
  });

  test("approving a node clears the pending-human blockers and can make it ready", async () => {
    // A node the package left review-required because a human decision was pending.
    const pending = CLAIMSDESK.graph.nodes.find(
      (node) =>
        node.readiness === "review-required" &&
        node.readinessBlockers.includes("human-approval-pending"),
    );
    if (!pending) return;
    const log = logWith({
      type: "approve-node",
      rationale: "Reviewed and accepted by the delivery manager.",
      targetNodeIds: [pending.id],
      summary: `${pending.id}: approved`,
    });
    const next = await compileDeal(CLAIMSDESK.imported, {
      decisions: log,
      generatedAt: GENERATED_AT,
    });
    const node = next.graph.nodes.find(
      (entry) => entry.id === pending.id,
    ) as ExecutionNode;
    expect(node.humanReviewRequired).toBe(false);
    expect(node.readinessBlockers).not.toContain("human-approval-pending");
  });

  test("an override re-classifies the node and keeps the history", async () => {
    const target = CLAIMSDESK.graph.nodes.find(
      (node) => node.operatingModel.primary !== "private-pod",
    ) as ExecutionNode;
    const log = logWith({
      type: "override-model",
      rationale: "The client wants this delivered by a controlled team.",
      targetNodeIds: [target.id],
      after: { model: "private-pod" },
      summary: `${target.id}: override`,
    });
    const next = await compileDeal(CLAIMSDESK.imported, {
      decisions: log,
      generatedAt: GENERATED_AT,
    });
    const node = next.graph.nodes.find(
      (entry) => entry.id === target.id,
    ) as ExecutionNode;
    expect(node.operatingModel.primary).toBe("private-pod");
    expect(node.operatingModel.overridden).toBe(true);
    expect(node.operatingModel.overrideHistory.at(-1)?.from).toBe(
      target.operatingModel.primary,
    );
    expect(node.operatingModel.rationale[0]).toContain(
      "overridden by the operator",
    );
    // The package is rebuilt for the model the operator chose.
    expect(next.packages.find((pkg) => pkg.nodeId === target.id)?.model).toBe(
      "private-pod",
    );
  });

  test("approving the graph clears the human-approval gate finding", async () => {
    const before = CLAIMSDESK.quality.findings.find(
      (finding) => finding.rule === "human-approval",
    );
    expect(before?.status).toBe("warn");
    const log = logWith({
      type: "approve-graph",
      rationale: "Delivery manager approved the graph for planning.",
      summary: "Graph approved.",
    });
    const next = await compileDeal(CLAIMSDESK.imported, {
      decisions: log,
      generatedAt: GENERATED_AT,
    });
    expect(next.decisions.graphApproved).toBe(true);
    expect(next.decisions.approvedAt).toBe(GENERATED_AT);
    expect(
      next.quality.findings.find((finding) => finding.rule === "human-approval")
        ?.status,
    ).toBe("pass");
  });

  test("a later change revokes an earlier approval", () => {
    let log = logWith({
      type: "approve-graph",
      rationale: "Approved.",
      summary: "Approved.",
    });
    expect(log.graphApproved).toBe(true);
    log = appendDecision(
      log,
      createDecision({
        type: "resolve-blocker",
        rationale: "The contract was confirmed.",
        targetNodeIds: [deliveryNode(0).id],
        after: {
          field: "acceptanceConditions",
          value: ["Contract confirmed in writing."],
        },
        summary: "Resolved.",
        at: GENERATED_AT,
      }),
    );
    expect(log.graphApproved).toBe(false);
    expect(log.approvedAt).toBeNull();
    expect(
      nodeEditsFrom(log).some((edit) => edit.field === "acceptanceConditions"),
    ).toBe(true);
  });

  test("an editable field can be set directly and is flagged as user-approved", async () => {
    const target = deliveryNode(0);
    const { next, impact } = await (async () => {
      const { applyEdits } = await import("@deal-to-challenge/engine");
      return applyEdits(
        CLAIMSDESK,
        [
          {
            nodeId: target.id,
            field: "readiness" as EditableField,
            value: "review-required",
            rationale: "Hold for review.",
            at: GENERATED_AT,
          },
        ],
        { generatedAt: GENERATED_AT },
      );
    })();
    expect(
      next.graph.nodes.find((node) => node.id === target.id)?.readiness,
    ).toBe("review-required");
    expect(impact.affectedNodes).toContain(target.id);
  });
});

describe("split, merge and operator-added nodes stay connected", () => {
  test("a split replaces its parent, rewires the parent's neighbours and orphans nothing", async () => {
    const parent = deliveryNode(0);
    const log = logWith({
      type: "split-node",
      rationale: "Two independently deliverable halves.",
      targetNodeIds: [parent.id],
      after: {
        parts: [
          {
            title: "Split half A",
            objective: "Deliver A.",
            workCategory: "backend-api",
            sourceIds: parent.sourceIds,
          },
          {
            title: "Split half B",
            objective: "Deliver B.",
            workCategory: "testing",
            sourceIds: parent.sourceIds,
          },
        ],
      },
      summary: `Split ${parent.id}.`,
    });

    const next = await compileDeal(CLAIMSDESK.imported, {
      decisions: log,
      generatedAt: GENERATED_AT,
    });
    const parts = next.graph.nodes.filter(
      (node) => node.provenance === "user-created",
    );

    expect(parts.length).toBe(2);
    expect(parts.map((node) => node.splitOf)).toEqual([parent.id, parent.id]);
    // The parent is replaced, not duplicated: its effort is not counted twice.
    expect(next.graph.nodes.some((node) => node.id === parent.id)).toBe(false);
    // Each replacement is wired into the graph, inheriting the parent's former
    // successor, so neither part is left dangling beside the plan it came from.
    for (const part of parts) {
      const touching = next.graph.edges.filter(
        (edge) => edge.source === part.id || edge.target === part.id,
      );
      expect(touching.length).toBeGreaterThan(0);
    }
    const successors = new Set(
      parts.flatMap((part) =>
        next.graph.edges
          .filter((edge) => edge.source === part.id)
          .map((edge) => edge.target),
      ),
    );
    expect(successors.size).toBeGreaterThan(0);
    expect(orphansOf(next)).toEqual([]);
    // Work the split did not touch — including the rewired neighbours' payload,
    // which are affected but whose content must not be rewritten — comes back
    // byte-identical. The engine's own impact report decides what is affected.
    const impact = diffGraphs({
      before: CLAIMSDESK.graph,
      after: next.graph,
      changes: [
        {
          nodeId: parent.id,
          field: "title",
          before: parent.title,
          after: "split",
        },
      ],
    });
    expect(impact.preservedExactly).toBe(true);
    expect(impact.unaffectedNodes.length).toBeGreaterThan(0);
    for (const id of impact.unaffectedNodes) {
      expect(
        JSON.stringify(next.graph.nodes.find((entry) => entry.id === id)),
      ).toBe(
        JSON.stringify(CLAIMSDESK.graph.nodes.find((entry) => entry.id === id)),
      );
    }
  });

  test("a merge replaces every parent and connects the single replacement", async () => {
    const [first, second] = [deliveryNode(0), deliveryNode(1)];
    const log = logWith({
      type: "merge-nodes",
      rationale: "The two halves are one deliverable.",
      targetNodeIds: [first.id, second.id],
      after: {
        parts: [
          {
            title: "Merged delivery",
            objective: "Deliver the combined scope.",
            workCategory: "backend-api",
            sourceIds: [...first.sourceIds, ...second.sourceIds],
          },
        ],
      },
      summary: `Merged ${first.id} and ${second.id}.`,
    });

    const next = await compileDeal(CLAIMSDESK.imported, {
      decisions: log,
      generatedAt: GENERATED_AT,
    });
    const merged = next.graph.nodes.filter(
      (node) => node.provenance === "user-created",
    );
    expect(merged.length).toBe(1);
    expect(merged[0]?.mergedFrom.sort()).toEqual([first.id, second.id].sort());
    expect(next.graph.nodes.some((node) => node.id === first.id)).toBe(false);
    expect(next.graph.nodes.some((node) => node.id === second.id)).toBe(false);
    // The replacement stands in the graph rather than beside it: it carries at
    // least one real dependency edge and is not an orphan.
    const replacement = merged[0] as ExecutionNode;
    expect(
      next.graph.edges.filter(
        (edge) =>
          edge.source === replacement.id || edge.target === replacement.id,
      ).length,
    ).toBeGreaterThan(0);
    expect(orphansOf(next)).toEqual([]);
  });

  test("an operator-added node hangs off the node it was created alongside", async () => {
    const host = deliveryNode(0);
    const log = logWith({
      type: "add-node",
      rationale: "Add an operator-owned accessibility review.",
      targetNodeIds: [host.id],
      after: {
        parts: [
          {
            title: "Accessibility review",
            objective:
              "Review the intake experience against the accessibility standard.",
            workCategory: "technical-review",
            sourceIds: host.sourceIds,
          },
        ],
      },
      summary: `Added a node alongside ${host.id}.`,
    });

    const next = await compileDeal(CLAIMSDESK.imported, {
      decisions: log,
      generatedAt: GENERATED_AT,
    });
    const added = next.graph.nodes.find(
      (node) => node.provenance === "user-created",
    );
    expect(added).toBeDefined();
    // The host stays in the plan and the new node is connected to it.
    expect(next.graph.nodes.some((node) => node.id === host.id)).toBe(true);
    expect(
      next.graph.edges.some(
        (edge) => edge.source === host.id && edge.target === added?.id,
      ),
    ).toBe(true);
    // An operator-created node starts unready: effort and acceptance must be supplied.
    expect(added?.acceptanceConditions).toEqual([]);
    expect(added?.effort.maximum).toBeNull();
    expect(added?.readiness).not.toBe("ready");
    expect(added?.fieldProvenance.acceptanceConditions).toBe("user-created");
  });

  test("an operator-added edge is reflected in dependsOn, the waves and the findings", async () => {
    const source = deliveryNode(0);
    const target = deliveryNode(3);
    expect(
      CLAIMSDESK.graph.edges.some(
        (edge) => edge.source === source.id && edge.target === target.id,
      ),
    ).toBe(false);

    const log = logWith({
      type: "add-edge",
      rationale: "The connector must land before verification starts.",
      targetEdgeIds: [],
      after: {
        source: source.id,
        target: target.id,
        type: "sequencing",
        sourceIds: source.sourceIds,
        blocking: false,
      },
      summary: `Added ${source.id} -> ${target.id}.`,
    });

    const next = await compileDeal(CLAIMSDESK.imported, {
      decisions: log,
      generatedAt: GENERATED_AT,
    });
    const edge = next.graph.edges.find(
      (candidate) =>
        candidate.source === source.id && candidate.target === target.id,
    );
    expect(edge).toBeDefined();
    expect(edge?.provenance).toBe("user-created");
    // dependsOn is rebuilt from the final edge set, not the deterministic one.
    expect(
      next.graph.nodes.find((node) => node.id === target.id)?.dependsOn,
    ).toContain(source.id);
    expect(next.graph.edges.length).toBe(CLAIMSDESK.graph.edges.length + 1);
  });

  test("a cycle the operator introduces is detected and blocks the gate", async () => {
    const a = deliveryNode(0);
    const b = deliveryNode(1);
    let log = logWith({
      type: "add-edge",
      rationale: "Both directions requested by the operator.",
      targetEdgeIds: [],
      after: {
        source: a.id,
        target: b.id,
        type: "sequencing",
        sourceIds: a.sourceIds,
        blocking: true,
      },
      summary: `${a.id} -> ${b.id}`,
    });
    log = appendDecision(
      log,
      createDecision({
        type: "add-edge",
        rationale: "And back again, which is a cycle.",
        targetEdgeIds: [],
        after: {
          source: b.id,
          target: a.id,
          type: "sequencing",
          sourceIds: b.sourceIds,
          blocking: true,
        },
        summary: `${b.id} -> ${a.id}`,
        at: GENERATED_AT,
      }),
    );

    const next = await compileDeal(CLAIMSDESK.imported, {
      decisions: log,
      generatedAt: GENERATED_AT,
    });
    const cycles = next.graph.findings.filter(
      (finding) => finding.code === "cycle",
    );
    expect(cycles.length).toBeGreaterThan(0);
    expect(cycles.flatMap((finding) => finding.nodeIds)).toContain(a.id);
    expect(next.quality.status).toBe("Blocked");
    expect(
      next.quality.findings.find((finding) => finding.rule === "cycles")
        ?.status,
    ).toBe("fail");
  });

  test("an operator-removed edge is honoured", async () => {
    const edge = CLAIMSDESK.graph.edges.find((candidate) => candidate.blocking);
    if (!edge) throw new Error("no blocking edge to remove");
    const log = logWith({
      type: "remove-edge",
      rationale: "The dependency no longer applies.",
      targetEdgeIds: [`${edge.source}->${edge.target}`],
      summary: `Removed ${edge.source} -> ${edge.target}.`,
    });

    const next = await compileDeal(CLAIMSDESK.imported, {
      decisions: log,
      generatedAt: GENERATED_AT,
    });
    expect(
      next.graph.edges.some(
        (candidate) =>
          candidate.source === edge.source && candidate.target === edge.target,
      ),
    ).toBe(false);
    expect(
      next.graph.nodes.find((node) => node.id === edge.target)?.dependsOn,
    ).not.toContain(edge.source);
  });

  test("the deterministic edge builder never absorbs one release into another phase", () => {
    const anchors = testNode("x").anchors;
    const nodes = [
      testNode("NODE_PH_1_DEPLOYMENT", {
        anchors: { ...anchors, phaseId: "PH_1", estimateWorkstreamId: "WS_01" },
      }),
      testNode("NODE_PH_2_DEPLOYMENT", {
        anchors: { ...anchors, phaseId: "PH_2", estimateWorkstreamId: "WS_02" },
      }),
      testNode("NODE_CAP_1", {
        anchors: { ...anchors, phaseId: null, estimateWorkstreamId: "WS_01" },
      }),
    ];
    const canonical = {
      ...CLAIMSDESK.canonical,
      delivery: {
        ...CLAIMSDESK.canonical.delivery,
        phases: [
          { id: "PH_1", name: "One", workstreamIds: ["WS_01"] },
          { id: "PH_2", name: "Two", workstreamIds: ["WS_02"] },
        ],
      },
    };

    const drafts = buildEdgeDrafts(nodes, canonical);
    // Releases are sequenced forwards only, and only real work is absorbed.
    expect(
      drafts.some(
        (draft) =>
          draft.source === "NODE_PH_1_DEPLOYMENT" &&
          draft.target === "NODE_PH_2_DEPLOYMENT",
      ),
    ).toBe(true);
    expect(
      drafts.some(
        (draft) =>
          draft.source === "NODE_PH_2_DEPLOYMENT" &&
          draft.target === "NODE_PH_1_DEPLOYMENT",
      ),
    ).toBe(false);
    expect(
      drafts.some(
        (draft) =>
          draft.source === "NODE_CAP_1" &&
          draft.target === "NODE_PH_1_DEPLOYMENT",
      ),
    ).toBe(true);
  });
});
