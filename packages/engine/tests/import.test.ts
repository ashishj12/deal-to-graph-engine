import { describe, expect, test } from "bun:test";
import { runImport } from "@deal-to-challenge/engine";
import { SAMPLE_PACKAGES } from "@deal-to-challenge/engine/samples";

const byId = Object.fromEntries(SAMPLE_PACKAGES.map((deal) => [deal.id, deal]));

describe("import of the supplied packages", () => {
  for (const deal of SAMPLE_PACKAGES) {
    test(`${deal.fileName} imports without errors`, async () => {
      const result = await runImport(deal.fileName, deal.text);
      expect(result.report.counts.error).toBe(0);
      expect(result.canonical.deal.id).toBe(deal.dealId);
      expect(result.canonical.scope.requirements.length).toBeGreaterThan(0);
      expect(result.sourceIndex.length).toBeGreaterThan(0);
    });

    test(`${deal.fileName} scores the expected maturity`, async () => {
      const result = await runImport(deal.fileName, deal.text);
      expect(result.maturity.level).toBe(deal.expectedMaturity);
    });

    test(`${deal.fileName} preserves every source id`, async () => {
      const result = await runImport(deal.fileName, deal.text);
      const ids = new Set(result.sourceIndex.map((record) => record.id));
      const declared = (deal.json as { scope: { items: { id: string }[] } }).scope.items;
      for (const item of declared) {
        expect(ids.has(item.id)).toBe(true);
      }
    });

    test(`${deal.fileName} records why it reached its maturity level`, async () => {
      const result = await runImport(deal.fileName, deal.text);
      expect(result.maturity.reasons.length).toBeGreaterThan(0);
      for (const reason of result.maturity.reasons) {
        expect(reason.label.length).toBeGreaterThan(0);
      }
    });
  }

  test("no supplied package is presented as fully ready for execution", async () => {
    const levels: string[] = [];
    for (const deal of SAMPLE_PACKAGES) {
      const result = await runImport(deal.fileName, deal.text);
      levels.push(result.maturity.level);
    }
    expect(levels).not.toContain("execution-candidate");
    expect(levels).not.toContain("blocked");
  });
});

describe("maturity signal differences", () => {
  test("member experience is discovery-required", async () => {
    const deal = byId["member-experience-modernisation-early-discovery"];
    if (!deal) throw new Error("fixture missing");
    const result = await runImport(deal.fileName, deal.text);
    expect(result.maturity.level).toBe("discovery-required");
    expect(result.maturity.missingCoreInputs.length).toBeGreaterThanOrEqual(2);
    expect(result.maturity.counts.criticalOpen).toBeGreaterThanOrEqual(3);
  });

  test("clinical package surfaces the cloud-platform conflict", async () => {
    const deal = byId["clinical-intake-and-patient-support-assistant"];
    if (!deal) throw new Error("fixture missing");
    const result = await runImport(deal.fileName, deal.text);
    expect(result.conflict.detected).toBe(true);
    expect(result.conflict.resolved).toBe(false);
    const platforms = new Set(result.conflict.claims.map((claim) => claim.platform));
    expect(platforms.has("azure")).toBe(true);
    expect(platforms.has("aws")).toBe(true);
  });

  test("claims package does not report a false platform conflict", async () => {
    const deal = byId["claimsdesk-modernization"];
    if (!deal) throw new Error("fixture missing");
    const result = await runImport(deal.fileName, deal.text);
    expect(result.conflict.detected).toBe(false);
  });

  test("out-of-scope items are preserved but flagged", async () => {
    const deal = byId["clinical-intake-and-patient-support-assistant"];
    if (!deal) throw new Error("fixture missing");
    const result = await runImport(deal.fileName, deal.text);
    const excluded = result.sourceIndex
      .filter((record) => record.namespace === "scope" && !record.inScope)
      .map((record) => record.id)
      .sort();
    expect(excluded).toEqual(["BR_05", "INT_05"]);
    expect(result.maturity.counts.excludedItems).toBeGreaterThan(0);
    // Synthesized out-of-scope groups are also excluded, and never in-scope.
    const excludedGroups = result.sourceIndex.filter(
      (record) => record.namespace === "outOfScope",
    );
    expect(excludedGroups.length).toBeGreaterThan(0);
    expect(excludedGroups.every((record) => !record.inScope)).toBe(true);
    // The official packages state exclusions as `{ text, refs }`. The wording and
    // the references must survive, so a group is never an anonymous placeholder
    // and never loses the requirement it excludes.
    const canonicalGroups = result.canonical.functionalScope.outOfScope;
    expect(canonicalGroups.length).toBe(excludedGroups.length);
    expect(canonicalGroups.every((group) => !group.id.includes("unnamed"))).toBe(true);
    expect(canonicalGroups.some((group) => group.requirementIds.length > 0)).toBe(true);
  });

  test("stale source anchors are detected", async () => {
    const deal = byId["member-experience-modernisation-early-discovery"];
    if (!deal) throw new Error("fixture missing");
    const result = await runImport(deal.fileName, deal.text);
    const issues = result.report.issues.filter((issue) => issue.code === "quote-mismatch");
    expect(issues.length).toBeGreaterThan(0);
  });

  test("null config values are treated as missing, not zero", async () => {
    const deal = byId["member-experience-modernisation-early-discovery"];
    if (!deal) throw new Error("fixture missing");
    const result = await runImport(deal.fileName, deal.text);
    expect(result.canonical.config.expectedUsers).toBeNull();
    expect(result.canonical.config.environments).toBeNull();
    expect(result.canonical.config.targetRegions).toEqual([]);
  });

  test("unresolved capability dependency names are reported, never dropped", async () => {
    const deal = byId["unified-supply-chain-analytics"];
    if (!deal) throw new Error("fixture missing");
    const result = await runImport(deal.fileName, deal.text);
    const issues = result.report.issues.filter(
      (issue) => issue.code === "unresolved-name-reference",
    );
    expect(issues.length).toBeGreaterThan(0);
    // The invariant: every capability dependency name is either resolved to a
    // capability id or reported as unresolved — nothing is silently dropped, and
    // no name is invented.
    const capabilities = result.canonical.functionalScope.capabilities.filter(
      (entry) => entry.dependencyNames.length > 0,
    );
    expect(capabilities.length).toBeGreaterThan(0);
    for (const capability of capabilities) {
      expect(capability.resolvedDependencies.length + capability.unresolvedDependencies.length).toBe(
        capability.dependencyNames.length,
      );
      for (const unresolved of capability.unresolvedDependencies) {
        expect(capability.dependencyNames).toContain(unresolved);
      }
    }
    expect(capabilities.some((entry) => entry.unresolvedDependencies.length > 0)).toBe(true);
  });
});

describe("determinism and safety", () => {
  test("the same text produces byte-identical output", async () => {
    const deal = SAMPLE_PACKAGES[0];
    if (!deal) throw new Error("fixture missing");
    const a = await runImport(deal.fileName, deal.text);
    const b = await runImport(deal.fileName, deal.text);
    const project = (result: Awaited<ReturnType<typeof runImport>>) =>
      JSON.stringify({
        canonical: result.canonical,
        maturity: result.maturity,
        report: result.report,
        conflict: result.conflict,
      });
    expect(project(a)).toBe(project(b));
  });

  test("re-ordered keys in the source do not change the output", async () => {
    const deal = SAMPLE_PACKAGES[0];
    if (!deal) throw new Error("fixture missing");
    const shuffled = JSON.stringify(
      Object.fromEntries(Object.entries(deal.json).reverse()),
      null,
      2,
    );
    const original = await runImport(deal.fileName, deal.text);
    const reordered = await runImport(deal.fileName, shuffled);
    expect(reordered.maturity.level).toBe(original.maturity.level);
    expect(reordered.maturity.score).toBe(original.maturity.score);
    expect(reordered.canonical.deal.id).toBe(original.canonical.deal.id);
  });

  test("invalid JSON is reported, not thrown", async () => {
    const result = await runImport("broken.json", "{ not json ");
    expect(result.report.counts.error).toBe(1);
    expect(result.report.issues[0]?.code).toBe("json-parse-error");
    expect(result.maturity.level).toBe("blocked");
  });

  test("empty input is reported, not thrown", async () => {
    const result = await runImport("empty.json", "");
    expect(result.report.issues[0]?.code).toBe("json-parse-error");
    expect(result.maturity.level).toBe("blocked");
  });

  test("a JSON array is rejected as not a workspace export", async () => {
    const result = await runImport("array.json", "[1,2,3]");
    expect(result.report.issues[0]?.code).toBe("not-a-workspace-export");
  });

  test("prototype pollution payloads are neutralised", async () => {
    // Built as a raw string: an object literal with `__proto__` would set the
    // prototype instead of emitting the key.
    const payload =
      '{"__proto__":{"polluted":true},"id":"DEAL_EVIL","name":"Evil",' +
      '"scope":{"items":[{"id":"FR_01","kind":"functional","title":"x"}]}}';
    const result = await runImport("evil.json", payload);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    const stripped = result.report.issues.filter((issue) => issue.code === "stripped-unsafe-key");
    expect(stripped.length).toBe(1);
  });

  test("a UTF-8 BOM is tolerated", async () => {
    const deal = SAMPLE_PACKAGES[0];
    if (!deal) throw new Error("fixture missing");
    const result = await runImport(deal.fileName, `\uFEFF${deal.text}`);
    expect(result.report.counts.error).toBe(0);
  });
});
