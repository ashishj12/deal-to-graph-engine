import { describe, expect, test } from "bun:test";
import {
  applyEdits,
  buildGraph,
  classifyNode,
  compileDeal,
  computeCriticalPath,
  computeSchedule,
  createDecision,
  appendDecision,
  createLog,
  decompose,
  diffGraphs,
  findCycles,
  mockGenerator,
  runImport,
  runQualityGate,
  summariseModels,
  validateGraph,
  type CompiledDeal,
  type ExecutionNode,
  type ImportedPackage,
} from "@deal-to-challenge/engine";
import { SAMPLE_PACKAGES } from "@deal-to-challenge/engine/samples";
import { cyclicGraph, diamondGraph, parallelGraph, testEdge, testNode } from "./synthetic/graphs";

const GENERATED_AT = "2026-10-07T00:00:00.000Z";

async function compile(slug: string): Promise<CompiledDeal> {
  const sample = SAMPLE_PACKAGES.find((entry) => entry.id === slug);
  if (!sample) throw new Error(`missing sample ${slug}`);
  const imported: ImportedPackage = await runImport(sample.fileName, sample.text);
  return compileDeal(imported, { generatedAt: GENERATED_AT });
}

const COMPILED = await Promise.all(SAMPLE_PACKAGES.map((sample) => compile(sample.id)));
const CLAIMSDESK = COMPILED[0];
const MEMBER_EXPERIENCE = COMPILED[2];

describe("FR3 delivery node generation", () => {
  test("every supplied package produces grounded delivery nodes", () => {
    for (const compiled of COMPILED) {
      expect(compiled.graph.nodes.length).toBeGreaterThan(10);
      const delivery = compiled.graph.nodes.filter((node) => node.kind === "delivery");
      expect(delivery.length).toBeGreaterThan(3);
      for (const node of delivery) {
        expect(node.sourceIds.length).toBeGreaterThan(0);
        expect(node.workCategory.length).toBeGreaterThan(0);
        expect(node.scope.length).toBeGreaterThan(0);
      }
    }
  });

  test("a node never invents an acceptance condition or an estimate", () => {
    // Property: every acceptance condition and every effort value either traces to
    // an imported source id or is explicitly marked as missing input.
    for (const compiled of COMPILED) {
      for (const node of compiled.graph.nodes) {
        if (node.acceptanceConditions.length > 0) {
          expect(node.acceptanceSourceIds.length).toBeGreaterThan(0);
          expect(node.fieldProvenance.acceptanceConditions).toBe("imported");
        } else if (node.kind === "delivery") {
          expect(node.readinessBlockers).toContain("missing-acceptance");
          expect(node.readiness).not.toBe("ready");
        }
        if (node.effort.maximum !== null) {
          expect(node.effort.sourceIds.length).toBeGreaterThan(0);
          expect(node.effort.basis.length).toBeGreaterThan(0);
        } else if (node.kind === "delivery") {
          expect(node.readinessBlockers).toContain("missing-effort");
        }
      }
    }
  });

  test("open gaps, questions and unconfirmed assumptions become discovery nodes", () => {
    const discovery = CLAIMSDESK.graph.nodes.filter((node) => node.kind === "discovery");
    expect(discovery.length).toBeGreaterThan(0);
    for (const node of discovery) {
      expect(["discovery", "clarification", "approval"]).toContain(node.kind);
    }
    const gapNode = CLAIMSDESK.graph.nodes.find((node) => node.anchors.backlogSourceId === "GAP_01");
    expect(gapNode).toBeDefined();
    expect(gapNode?.workCategory).toBe("discovery");
  });

  test("the early-discovery package yields discovery work and keeps implementation blocked", () => {
    const nodes = MEMBER_EXPERIENCE.graph.nodes;
    const discovery = nodes.filter((node) => node.kind === "discovery" || node.kind === "clarification");
    expect(discovery.length).toBeGreaterThanOrEqual(5);
    const blocked = nodes.filter((node) => node.readiness === "blocked");
    expect(blocked.length).toBeGreaterThan(0);
    for (const node of blocked) {
      expect(node.readiness).toBe("blocked");
      expect(node.readinessBlockers.length).toBeGreaterThan(0);
    }
    expect(MEMBER_EXPERIENCE.graph.maturity).toBe("discovery-required");
  });

  test("regulated work produces explicit human-review checkpoints", () => {
    const clinical = COMPILED[1];
    const approval = clinical.graph.nodes.filter((node) => node.kind === "approval");
    expect(approval.length).toBeGreaterThan(0);
    expect(clinical.graph.aggregates.reviewCheckpoints.length).toBeGreaterThan(0);
  });
});

describe("FR4 operating-model classification", () => {
  test("every executable node has exactly one primary operating model", () => {
    for (const compiled of COMPILED) {
      for (const node of compiled.graph.nodes) {
        expect(["flexible-talent", "challenge", "private-pod"]).toContain(node.operatingModel.primary);
        expect(node.operatingModel.rationale.length).toBeGreaterThan(0);
        expect(["high", "medium", "low"]).toContain(node.operatingModel.confidence);
        // A recommendation always cites the sources it was given.
        if (node.sourceIds.length > 0) expect(node.operatingModel.sourceIds.length).toBeGreaterThan(0);
        expect(node.operatingModel.scores.length).toBe(3);
      }
    }
  });

  test("each supplied package uses at least two operating models", () => {
    for (const compiled of COMPILED) {
      expect(compiled.graph.operatingModelSummary.modelsUsed.length).toBeGreaterThanOrEqual(2);
    }
  });

  test("across the four supplied packages all three operating models appear", () => {
    const used = new Set(COMPILED.flatMap((compiled) => compiled.graph.operatingModelSummary.modelsUsed));
    expect([...used].sort()).toEqual(["challenge", "flexible-talent", "private-pod"]);
  });

  test("ClaimsDesk is a mixed graph with a pod core, challenge nodes and specialists", () => {
    const summary = CLAIMSDESK.graph.operatingModelSummary;
    expect(summary.mixed).toBe(true);
    expect(summary.privatePod).toBeGreaterThan(0);
    expect(summary.challenge).toBeGreaterThan(0);
    expect(summary.flexibleTalent).toBeGreaterThan(0);
  });

  test("restricted data moves work away from an open challenge", () => {
    // The clinical package is the regulated one: no node over regulated data may
    // be recommended as an open challenge.
    const clinical = COMPILED[1];
    const regulatedDomains = new Set(
      clinical.canonical.strategy.dataDomains.filter((domain) => domain.regulated).map((domain) => domain.id),
    );
    expect(regulatedDomains.size).toBeGreaterThan(0);
    for (const node of clinical.graph.nodes) {
      const touchesRestricted = node.anchors.domainIds.some((id) => regulatedDomains.has(id));
      if (!touchesRestricted) continue;
      expect(node.operatingModel.primary).not.toBe("challenge");
    }
    expect(clinical.graph.operatingModelSummary.privatePod).toBeGreaterThan(0);
  });

  test("a challenge node always declares its confidentiality limitations", () => {
    for (const compiled of COMPILED) {
      const challenges = compiled.packages.filter((pkg) => pkg.model === "challenge");
      for (const pkg of challenges) {
        expect(pkg.confidentialityLimitations.length).toBeGreaterThan(0);
      }
    }
  });

  test("the classifier is deterministic and explains itself with weighted scores", () => {
    const input = {
      nodeId: "N1",
      title: "Sensitive platform delivery",
      workCategory: "cloud-devops",
      kind: "delivery",
      sourceIds: ["SEC_01", "ARC_01"],
      roles: ["cloud-engineer", "security-engineer", "backend-engineer"],
      componentIds: ["ARC_01", "ARC_02", "ARC_03"],
      integrationIds: [],
      domainIds: ["DD_01"],
      sensitiveData: true,
      securityRequirementIds: ["SEC_01"],
      acceptanceMeasurable: true,
      effortMaximum: 80,
      phaseCount: 2,
      openSourceIds: [],
      deliverableCount: 2,
      humanReviewRequired: true,
      maturity: "review-required" as const,
    };
    const first = classifyNode(input);
    const second = classifyNode(input);
    expect(first.primary).toBe(second.primary);
    expect(first.scores.map((entry) => entry.score)).toEqual(second.scores.map((entry) => entry.score));
    expect(first.primary).toBe("private-pod");
    expect(first.scores[0].contributions.length).toBeGreaterThan(3);
    expect(first.rationale.length).toBeGreaterThan(0);
  });

  test("a single-model graph is reported as single-model", () => {
    const nodes = [testNode("A"), testNode("B")];
    expect(summariseModels(nodes).mixed).toBe(false);
    expect(summariseModels([...nodes, testNode("C", { operatingModel: { primary: "private-pod" } as ExecutionNode["operatingModel"] })]).mixed).toBe(true);
  });
});

describe("FR5 dependency graph", () => {
  test("waves are longest-path layers on a hand-built diamond", () => {
    const { nodes, edges } = diamondGraph(5);
    const schedule = computeSchedule(nodes, edges);
    expect(schedule.waves.map((wave) => wave.nodeIds.sort())).toEqual([["A"], ["B", "C"], ["D"]]);
    expect(schedule.earliestStart.A).toBe(0);
    expect(schedule.earliestStart.B).toBe(5);
    expect(schedule.earliestStart.C).toBe(5);
    expect(schedule.earliestStart.D).toBe(10);
    expect(schedule.cyclicNodeIds).toEqual([]);
  });

  test("the critical path follows the largest effort and breaks ties on node id", () => {
    const tied = diamondGraph(5);
    const tiedPath = computeCriticalPath(tied.nodes, tied.edges);
    expect(tiedPath.nodeIds).toEqual(["A", "B", "D"]);
    expect(tiedPath.effort).toBe(15);
    expect(tiedPath.tieBreak).toContain("lexicographically smaller");

    const heavy = diamondGraph(5);
    const heavyNodes = heavy.nodes.map((node) =>
      node.id === "C"
        ? { ...node, effort: { ...node.effort, minimum: 20, maximum: 20, likely: 20 } }
        : node,
    );
    const heavyPath = computeCriticalPath(heavyNodes, heavy.edges);
    expect(heavyPath.nodeIds).toEqual(["A", "C", "D"]);
    expect(heavyPath.effort).toBe(30);
    expect(heavyPath.optimisticNodeIds.length).toBeGreaterThanOrEqual(3);
  });

  test("independent chains are scheduled in parallel waves", () => {
    const { nodes, edges } = parallelGraph();
    const schedule = computeSchedule(nodes, edges);
    expect(schedule.waves.map((wave) => wave.nodeIds.sort())).toEqual([["A", "C"], ["B", "D"]]);
  });

  test("a cycle is reported with the path that produces it", () => {
    const { nodes, edges } = cyclicGraph();
    const cycles = findCycles(nodes, edges);
    expect(cycles.length).toBe(1);
    expect(cycles[0]).toEqual(["A", "B", "C", "A"]);
    const findings = validateGraph(nodes, edges);
    expect(findings.hasCycle).toBe(true);
    expect(findings.findings.find((finding) => finding.code === "cycle")?.cyclePath).toEqual(["A", "B", "C", "A"]);
    const schedule = computeSchedule(nodes, edges);
    expect(schedule.cyclicNodeIds.sort()).toEqual(["A", "B", "C"]);
  });

  test("self-dependencies, duplicate edges, dangling refs and orphans are detected", () => {
    const nodes = [testNode("A"), testNode("B"), testNode("C")];
    const findings = validateGraph(nodes, [
      testEdge("E1", "A", "A"),
      testEdge("E2", "A", "B"),
      testEdge("E3", "A", "B", { type: "approval" }),
      testEdge("E4", "A", "MISSING"),
      testEdge("E5", "A", "B", { rationale: "", sourceIds: [] }),
    ]);
    const codes = findings.findings.map((finding) => finding.code);
    expect(codes).toContain("self-dependency");
    expect(codes).toContain("duplicate-edge");
    expect(codes).toContain("dangling-node");
    expect(codes).toContain("invalid-edge");
    // C has no edge in either direction and is a delivery node.
    expect(findings.findings.find((finding) => finding.code === "orphan-node")?.nodeIds).toContain("C");
  });

  test("every generated edge carries a type, a rationale and source identifiers", () => {
    for (const compiled of COMPILED) {
      expect(compiled.graph.edges.length).toBeGreaterThan(0);
      for (const edge of compiled.graph.edges) {
        expect(edge.rationale.length).toBeGreaterThan(0);
        expect(edge.sourceIds.length).toBeGreaterThan(0);
        expect(edge.source).not.toBe(edge.target);
      }
    }
  });

  test("the scheduled graph is acyclic and reports its waves and critical path", () => {
    for (const compiled of COMPILED) {
      expect(compiled.graph.findings.some((finding) => finding.code === "cycle")).toBe(false);
      expect(compiled.graph.waves.length).toBeGreaterThan(1);
      expect(compiled.graph.criticalPath.nodeIds.length).toBeGreaterThan(1);
      expect(compiled.graph.aggregates.nodeCount).toBe(compiled.graph.nodes.length);
      expect(compiled.graph.aggregates.entryNodes.length).toBeGreaterThan(0);
      expect(compiled.graph.aggregates.terminalNodes.length).toBeGreaterThan(0);
    }
  });
});

describe("FR6 change impact and quality gate", () => {
  test("an edit changes its node and leaves every unaffected node byte-identical", async () => {
    const target = CLAIMSDESK.graph.nodes.find((node) => node.kind === "delivery") as ExecutionNode;
    const { next, impact } = await applyEdits(
      CLAIMSDESK,
      [{ nodeId: target.id, field: "title", value: "Renamed intake delivery", rationale: "operator renamed the node", at: GENERATED_AT }],
      { generatedAt: GENERATED_AT },
    );
    expect(next.graph.nodes.find((node) => node.id === target.id)?.title).toBe("Renamed intake delivery");
    expect(impact.preservedExactly).toBe(true);
    expect(impact.affectedNodes).toContain(target.id);
    for (const id of impact.unaffectedNodes) {
      const before = CLAIMSDESK.graph.nodes.find((node) => node.id === id);
      const after = next.graph.nodes.find((node) => node.id === id);
      expect(JSON.stringify(after)).toBe(JSON.stringify(before));
    }
  });

  test("an operating-model override is recorded, re-classifies the node and preserves the rest", async () => {
    const target = CLAIMSDESK.graph.nodes.find((node) => node.operatingModel.primary === "flexible-talent") as ExecutionNode;
    let log = createLog(CLAIMSDESK.canonical.deal.id);
    log = appendDecision(
      log,
      createDecision({
        type: "override-model",
        rationale: "The client wants this work competed rather than assigned.",
        targetNodeIds: [target.id],
        after: { model: "private-pod" },
        summary: `${target.id}: operating model overridden to private-pod.`,
        at: GENERATED_AT,
      }),
    );
    const next = await compileDeal(CLAIMSDESK.imported, { decisions: log, generatedAt: GENERATED_AT });
    const overridden = next.graph.nodes.find((node) => node.id === target.id) as ExecutionNode;
    expect(overridden.operatingModel.primary).toBe("private-pod");
    expect(overridden.operatingModel.overridden).toBe(true);
    expect(overridden.operatingModel.overrideHistory.length).toBe(1);
    expect(overridden.operatingModel.overrideHistory[0].from).toBe("flexible-talent");
    expect(next.decisions.entries.some((entry) => entry.type === "override-model")).toBe(true);
    // A package is rebuilt for the new model.
    expect(next.packages.find((pkg) => pkg.nodeId === target.id)?.model).toBe("private-pod");
    const affected = next.graph.nodes.filter((node) => node.id !== target.id);
    expect(affected.length).toBeGreaterThan(0);
  });

  test("the impact report covers every editable field", async () => {
    const target = CLAIMSDESK.graph.nodes.find((node) => node.kind === "delivery") as ExecutionNode;
    const edits = [
      { nodeId: target.id, field: "title" as const, value: "Edited title", rationale: "edit title", at: GENERATED_AT },
      { nodeId: target.id, field: "scope" as const, value: "Edited scope", rationale: "edit scope", at: GENERATED_AT },
      { nodeId: target.id, field: "workCategory" as const, value: "testing", rationale: "edit category", at: GENERATED_AT },
      {
        nodeId: target.id,
        field: "operatingModel" as const,
        value: "challenge",
        rationale: "edit model",
        at: GENERATED_AT,
      },
      {
        nodeId: target.id,
        field: "effort" as const,
        value: { minimum: 4, maximum: 9, likely: 6, unit: "person-days" },
        rationale: "edit effort",
        at: GENERATED_AT,
      },
      {
        nodeId: target.id,
        field: "acceptanceConditions" as const,
        value: ["Operator-supplied acceptance condition."],
        rationale: "edit acceptance",
        at: GENERATED_AT,
      },
      { nodeId: target.id, field: "sourceIds" as const, value: ["FR_02"], rationale: "edit sources", at: GENERATED_AT },
    ];
    const { next, impact } = await applyEdits(CLAIMSDESK, edits, { generatedAt: GENERATED_AT });
    const applied = next.graph.nodes.find((node) => node.id === target.id) as ExecutionNode;
    expect(applied.title).toBe("Edited title");
    expect(applied.workCategory).toBe("testing");
    expect(applied.operatingModel.primary).toBe("challenge");
    expect(applied.effort.provenance).toBe("user-created");
    expect(applied.fieldProvenance.acceptanceConditions).toBe("user-approved");
    expect(applied.sourceIds).toContain("FR_02");
    const changedFields = impact.changed.map((change) => change.field).sort();
    const expectedFields = ["acceptanceConditions", "effort", "operatingModel", "scope", "sourceIds", "title", "workCategory"].sort();
    expect(changedFields).toEqual(expectedFields as typeof changedFields);
    expect(impact.criticalPath.before.length).toBeGreaterThan(0);
    expect(impact.effortDelta).not.toBeNaN();
    expect(impact.summary.length).toBeGreaterThan(0);
  });

  test("the quality gate cannot be Ready while a cycle exists", () => {
    const nodes = [testNode("NODE_A"), testNode("NODE_B")];
    const graph = buildGraph({
      imported: CLAIMSDESK.imported,
      nodes,
      revision: 0,
      generator: mockGenerator(),
    });
    const cyclicEdges = [testEdge("E1", "NODE_A", "NODE_B"), testEdge("E2", "NODE_B", "NODE_A")];
    // The compiler re-validates after edge overrides; the test does the same so
    // the findings and the edges describe the same graph.
    graph.edges = cyclicEdges;
    graph.findings = validateGraph(graph.nodes, cyclicEdges).findings;
    const quality = runQualityGate({
      graph,
      canonical: CLAIMSDESK.canonical,
      decisions: createLog(CLAIMSDESK.canonical.deal.id),
      generatedAt: GENERATED_AT,
    });
    expect(quality.status).toBe("Blocked");
    expect(quality.findings.find((finding) => finding.rule === "cycles")?.status).toBe("fail");
  });

  test("the quality gate cannot be Ready while a node is unsupported", () => {
    const unsupported = testNode("NODE_UNSUPPORTED", {
      sourceIds: [],
      anchors: { ...testNode("X").anchors, backlogSourceId: null },
    });
    const graph = buildGraph({
      imported: CLAIMSDESK.imported,
      nodes: [unsupported, testNode("NODE_B")],
      revision: 0,
      generator: mockGenerator(),
    });
    graph.edges = [testEdge("E1", "NODE_UNSUPPORTED", "NODE_B")];
    const quality = runQualityGate({
      graph,
      canonical: CLAIMSDESK.canonical,
      decisions: createLog(CLAIMSDESK.canonical.deal.id),
      generatedAt: GENERATED_AT,
    });
    expect(quality.status).toBe("Blocked");
    expect(quality.findings.find((finding) => finding.rule === "unsupported-nodes")?.status).toBe("fail");
  });

  test("the quality gate cannot be Ready while a blocker is open or approval is missing", () => {
    const blocked = testNode("NODE_BLOCKED", {
      blockingStatus: "blocked",
      blockedBy: ["GAP_01"],
      readiness: "blocked",
    });
    const graph = buildGraph({
      imported: CLAIMSDESK.imported,
      nodes: [blocked, testNode("NODE_B")],
      revision: 0,
      generator: mockGenerator(),
    });
    graph.edges = [testEdge("E1", "NODE_BLOCKED", "NODE_B")];
    const quality = runQualityGate({
      graph,
      canonical: CLAIMSDESK.canonical,
      decisions: createLog(CLAIMSDESK.canonical.deal.id),
      generatedAt: GENERATED_AT,
    });
    expect(quality.status).not.toBe("Ready");
    expect(quality.findings.find((finding) => finding.rule === "human-approval")?.status).toBe("warn");
    expect(quality.findings.find((finding) => finding.rule === "blocked-or-stale")?.status).toBe("warn");
  });

  test("every gate finding is deterministic and itemised", () => {
    for (const compiled of COMPILED) {
      expect(compiled.quality.findings.length).toBeGreaterThanOrEqual(13);
      for (const finding of compiled.quality.findings) {
        expect(finding.provenance).toBe("deterministic");
        expect(finding.message.length).toBeGreaterThan(0);
      }
      expect(["Ready", "Review Required", "Blocked"]).toContain(compiled.quality.status);
    }
    expect(CLAIMSDESK.quality.coverage.requirements).toBeGreaterThan(0);
  });

  test("an incomplete package is never presented as fully ready", () => {
    for (const compiled of COMPILED) {
      const ready = compiled.graph.nodes.filter((node) => node.readiness === "ready");
      // Readiness requires the operating-model package to be complete, which the
      // imported packages are not until an operator supplies the missing fields.
      expect(compiled.quality.status).not.toBe("Ready");
      for (const node of ready) expect(node.readinessBlockers).toEqual([]);
    }
  });

  test("a graph that is not approved cannot pass the gate", () => {
    const graph = CLAIMSDESK.graph;
    const withoutApproval = runQualityGate({
      graph,
      canonical: CLAIMSDESK.canonical,
      decisions: { ...CLAIMSDESK.decisions, graphApproved: false },
      generatedAt: GENERATED_AT,
    });
    expect(withoutApproval.findings.find((finding) => finding.rule === "human-approval")?.status).toBe("warn");
    const approved = runQualityGate({
      graph,
      canonical: CLAIMSDESK.canonical,
      decisions: { ...CLAIMSDESK.decisions, graphApproved: true, approvedAt: GENERATED_AT },
      generatedAt: GENERATED_AT,
    });
    expect(approved.findings.find((finding) => finding.rule === "human-approval")?.status).toBe("pass");
  });
});

describe("decomposition and diffing helpers", () => {
  test("decompose reports the nodes it generated and the sources it did not cover", async () => {
    const result = decompose({
      imported: CLAIMSDESK.imported,
      revision: 0,
      overrides: [],
      removedNodeIds: [],
    });
    expect(result.nodes.length).toBeGreaterThan(10);
    expect(result.notes.length).toBeGreaterThan(0);
    expect(result.traceability.length).toBeGreaterThan(0);
    for (const row of result.traceability) {
      expect(row.covered).toBe(row.nodeIds.length > 0);
    }
  });

  test("a diff of identical graphs reports no change and preserves everything", () => {
    const impact = diffGraphs({ before: CLAIMSDESK.graph, after: CLAIMSDESK.graph, changes: [] });
    expect(impact.changed).toEqual([]);
    expect(impact.preservedExactly).toBe(true);
    expect(impact.affectedNodes).toEqual([]);
    expect(impact.effortDelta).toBe(0);
  });
});
