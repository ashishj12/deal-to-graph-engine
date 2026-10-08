import { describe, expect, test } from "bun:test";
import {
  MOCK_NOTICE,
  MockProvider,
  buildBundleFiles,
  compileDeal,
  runImport,
  toBundleZip,
  toExecutionPlanMarkdown,
  toGraphJson,
  unzipTextEntries,
  validateDecomposition,
  validateDependencies,
  validateModelRecommendation,
  validatePackageDraft,
  type AIProposal,
  type AIProvider,
  type CompiledDeal,
} from "@deal-to-challenge/engine";
import { SAMPLE_PACKAGES } from "@deal-to-challenge/engine/samples";

const GENERATED_AT = "2026-10-07T00:00:00.000Z";
const CLAIMSDESK = SAMPLE_PACKAGES.find((sample) => sample.id === "claimsdesk-modernization");
if (!CLAIMSDESK) throw new Error("claimsdesk sample missing");

const IMPORTED = await runImport(CLAIMSDESK.fileName, CLAIMSDESK.text);
const COMPILED: CompiledDeal = await compileDeal(IMPORTED, { generatedAt: GENERATED_AT });

describe("FR7 export", () => {
  test("graph JSON round-trips and preserves ids, edges, models, waves and readiness", () => {
    const parsed = JSON.parse(toGraphJson(COMPILED)) as {
      nodes: { id: string; readiness: string; operatingModel: { primary: string; rationale: string[] } }[];
      edges: { id: string; source: string; target: string; rationale: string }[];
      waves: { index: number; nodeIds: string[] }[];
      criticalPath: { nodeIds: string[] };
      findings: unknown[];
      quality: { status: string; findings: { provenance: string }[] };
      generator: { mode: string; notice: string };
    };
    expect(parsed.nodes.length).toBe(COMPILED.graph.nodes.length);
    expect(parsed.edges.length).toBe(COMPILED.graph.edges.length);
    expect(parsed.waves.length).toBe(COMPILED.graph.waves.length);
    expect(parsed.criticalPath.nodeIds).toEqual(COMPILED.graph.criticalPath.nodeIds);
    expect(parsed.findings.length).toBe(COMPILED.graph.findings.length);
    expect(parsed.quality.findings.length).toBe(COMPILED.quality.findings.length);
    for (const node of parsed.nodes) {
      expect(node.operatingModel.rationale.length).toBeGreaterThan(0);
      expect(["ready", "review-required", "blocked"]).toContain(node.readiness);
    }
    for (const edge of parsed.edges) expect(edge.rationale.length).toBeGreaterThan(0);
    expect(COMPILED.graph.nodes.map((node) => node.id)).toEqual(parsed.nodes.map((node) => node.id));
  });

  test("the same compiled deal exports byte-identically", () => {
    expect(toGraphJson(COMPILED)).toBe(toGraphJson(COMPILED));
    expect(toExecutionPlanMarkdown(COMPILED)).toBe(toExecutionPlanMarkdown(COMPILED));
  });

  test("the execution plan states the waves, the critical path and the quality gate", () => {
    const plan = toExecutionPlanMarkdown(COMPILED);
    expect(plan).toContain("# Execution plan");
    expect(plan).toContain("## Execution waves");
    expect(plan).toContain("## Critical path");
    expect(plan).toContain("## Quality gate");
    expect(plan).toContain("## Traceability");
    expect(plan).toContain("not ready for operational handoff");
    expect(plan).toContain(MOCK_NOTICE);
  });

  test("every node gets a package in one of the three model shapes", () => {
    const files = buildBundleFiles(COMPILED);
    const kinds = new Set(files.map((file) => file.path.split(".").pop()));
    expect(kinds.has("json")).toBe(true);
    expect(kinds.has("md")).toBe(true);
    expect(COMPILED.packages.length).toBe(COMPILED.graph.nodes.length);
    for (const pkg of COMPILED.packages) {
      expect(["flexible-talent", "challenge", "private-pod"]).toContain(pkg.model);
      expect(pkg.generator.mode).toBe("mock");
      if (!pkg.complete) expect(pkg.missingFields.length).toBeGreaterThan(0);
    }
  });

  test("the exported bundle is a readable ZIP archive", async () => {
    const bytes = await toBundleZip(COMPILED);
    const { files } = await unzipTextEntries(bytes);
    const names = files.map((file) => file.baseName);
    expect(names.some((name) => name.endsWith(".graph.json"))).toBe(true);
    expect(names.some((name) => name.endsWith(".execution-plan.md"))).toBe(true);
    expect(names.some((name) => name.endsWith(".quality.json"))).toBe(true);
    const graph = files.find((file) => file.baseName.endsWith(".graph.json"));
    expect(JSON.parse(graph?.text ?? "{}")).toBeTruthy();
  });
});

describe("AI orchestration in mock mode", () => {
  test("mock mode is permanently labelled in the graph and in every package", () => {
    expect(COMPILED.graph.generator.mode).toBe("mock");
    expect(COMPILED.graph.generator.notice).toBe(MOCK_NOTICE);
    expect(COMPILED.ai.notice).toBe(MOCK_NOTICE);
    for (const pkg of COMPILED.packages) expect(pkg.generator.notice).toBe(MOCK_NOTICE);
    expect(toGraphJson(COMPILED)).toContain(MOCK_NOTICE);
  });

  test("MockProvider is deterministic for the same input", async () => {
    const request = {
      dealId: IMPORTED.canonical.deal.id,
      dealTitle: IMPORTED.canonical.deal.title,
      promptVersion: "mock-v1",
      sourceIds: ["GAP_01"],
      baseline: [] as AIProposal[],
      evidence: [
        { id: "GAP_01", title: "Open integration gap", kind: "gap", text: "The contract is unconfirmed." },
      ],
    };
    const first = await new MockProvider().decompose(request);
    const second = await new MockProvider().decompose(request);
    expect(JSON.stringify(first.proposal)).toBe(JSON.stringify(second.proposal));
    expect(first.mode).toBe("mock");
    expect(first.provider).toBe("mock");
    expect(first.promptVersion).toBe("mock-v1");
  });

  test("the complete workflow runs with no network access at all", async () => {
    const original = globalThis.fetch;
    let calls = 0;
    globalThis.fetch = (() => {
      calls += 1;
      throw new Error("network access is not allowed in mock mode");
    }) as unknown as typeof fetch;
    try {
      const compiled = await compileDeal(IMPORTED, { generatedAt: GENERATED_AT });
      expect(compiled.graph.nodes.length).toBeGreaterThan(0);
      expect(compiled.graph.generator.mode).toBe("mock");
    } finally {
      globalThis.fetch = original;
    }
    expect(calls).toBe(0);
  });

  test("AI suggestions are labelled and never applied without a user decision", () => {
    const suggestions = COMPILED.graph.nodes.flatMap((node) => node.aiSuggestions);
    expect(suggestions.length).toBeGreaterThan(0);
    for (const suggestion of suggestions) {
      expect(suggestion.mode).toBe("mock");
      expect(suggestion.provider.length).toBeGreaterThan(0);
      expect(suggestion.promptVersion.length).toBeGreaterThan(0);
      expect(suggestion.sourceIds.length).toBeGreaterThan(0);
      expect(suggestion.provenance).toBe("ai-recommended");
      expect(suggestion.status).toBe("proposed");
    }
  });

  test("a malformed provider response is rejected and the deterministic result is used", async () => {
    const badProvider: AIProvider = {
      id: "bad",
      mode: "live",
      model: "test-model",
      promptVersion: "bad-v1",
      async decompose() {
        return {
          // A proposal with no evidence must not be trusted.
          proposal: [
            {
              id: "PROPOSAL_X",
              title: "Ungrounded idea",
              objective: "Invent a work package.",
              workCategory: "backend-api",
              kind: "delivery",
              rationale: "The model felt like it.",
              sourceIds: [],
            },
          ],
          provider: "bad",
          mode: "live",
          model: "test-model",
          promptVersion: "bad-v1",
          fallbackUsed: false,
          fallbackReason: null,
          latencyMs: 1,
        };
      },
      async recommendModel() {
        throw new Error("not used in this test");
      },
      async suggestDependencies() {
        throw new Error("not used in this test");
      },
      async draftPackage() {
        // This test is about a malformed decomposition response; the drafting
        // call legitimately returns nothing here.
        return {
          proposal: {},
          provider: "bad",
          mode: "live",
          model: "test-model",
          promptVersion: "bad-v1",
          fallbackUsed: false,
          fallbackReason: null,
          latencyMs: 1,
        };
      },
      async explainImpact() {
        throw new Error("not used in this test");
      },
    };
    const compiled = await compileDeal(IMPORTED, { provider: badProvider, generatedAt: GENERATED_AT });
    expect(compiled.notes.some((note) => note.includes("rejected by schema validation"))).toBe(true);
    expect(compiled.graph.nodes.flatMap((node) => node.aiSuggestions)).toEqual([]);
    // The deterministic decomposition still produced the full graph.
    expect(compiled.graph.nodes.length).toBeGreaterThan(10);
  });
});

describe("AI output schema validation", () => {
  test("a decomposition proposal without source ids is rejected", () => {
    const result = validateDecomposition([
      { id: "P1", title: "T", objective: "O", workCategory: "discovery", kind: "discovery", rationale: "r", sourceIds: [] },
    ]);
    expect(result.ok).toBe(false);
    expect(result.issues.some((issue) => issue.path.endsWith("sourceIds"))).toBe(true);
  });

  test("a model recommendation must name exactly one known model", () => {
    expect(validateModelRecommendation({ primary: "challenge", alternatives: ["flexible-talent"], rationale: ["r"] }).ok).toBe(true);
    expect(validateModelRecommendation({ primary: "challenge", alternatives: ["challenge"], rationale: ["r"] }).ok).toBe(false);
    expect(validateModelRecommendation({ primary: "auction", alternatives: [], rationale: ["r"] }).ok).toBe(false);
    expect(validateModelRecommendation({ primary: "challenge", alternatives: [], rationale: [] }).ok).toBe(false);
  });

  test("suggested dependencies must reference known nodes and edge types", () => {
    const good = validateDependencies([{ source: "A", target: "B", type: "sequencing", rationale: "r" }], ["A", "B"], ["sequencing"]);
    expect(good.ok).toBe(true);
    const bad = validateDependencies([{ source: "A", target: "Z", type: "teleport", rationale: "r" }], ["A", "B"], ["sequencing"]);
    expect(bad.ok).toBe(false);
    expect(bad.issues.length).toBeGreaterThanOrEqual(2);
  });

  test("a package draft must contain only strings and string arrays", () => {
    expect(validatePackageDraft({ roles: ["a"], objective: "text" }).ok).toBe(true);
    expect(validatePackageDraft({ roles: [1] }).ok).toBe(false);
    expect(validatePackageDraft({ nested: { a: 1 } }).ok).toBe(false);
  });
});
