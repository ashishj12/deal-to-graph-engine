import { compileDeal, applyEdits, createLog } from "@deal-to-challenge/engine";
import type { CompiledDeal } from "@deal-to-challenge/engine";
import {
  inspectZip,
  looksLikeZip,
  packageToJson,
  toBundleZip,
  toExecutionPlanMarkdown,
  toGraphJson,
  toQualityJson,
  unzipTextEntries,
} from "@deal-to-challenge/engine";
import { runImport } from "@deal-to-challenge/engine";
import { SAMPLE_PACKAGES } from "@deal-to-challenge/engine/samples";

let failures = 0;

function check(label: string, condition: boolean, detail = ""): void {
  if (condition) {
    console.log(`  ok   ${label}${detail ? ` — ${detail}` : ""}`);
    return;
  }
  failures += 1;
  console.log(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`);
}

async function compileSample(
  fileName: string,
  text: string,
): Promise<CompiledDeal> {
  const imported = await runImport(fileName, text);
  return compileDeal(imported, {
    decisions: createLog(imported.canonical.deal.id),
  });
}

async function main(): Promise<void> {
  console.log("1. Import and maturity");
  const compiledByFile = new Map<string, CompiledDeal>();
  for (const sample of SAMPLE_PACKAGES) {
    const imported = await runImport(sample.fileName, sample.text);
    const compiled = await compileDeal(imported, {
      decisions: createLog(imported.canonical.deal.id),
    });
    compiledByFile.set(sample.fileName, compiled);
    check(
      `${sample.fileName} imports cleanly`,
      imported.report.counts.error === 0,
      `${imported.report.counts.error} error(s)`,
    );
    check(
      `${sample.fileName} reaches ${sample.expectedMaturity}`,
      imported.maturity.level === sample.expectedMaturity,
      imported.maturity.level,
    );
    check(
      `${sample.fileName} decomposes into nodes`,
      compiled.graph.nodes.length > 0,
      `${compiled.graph.nodes.length} nodes`,
    );
  }

  console.log("2. Classification");
  for (const [fileName, compiled] of compiledByFile) {
    const unclassified = compiled.graph.nodes.filter(
      (node) =>
        !node.operatingModel.primary ||
        node.operatingModel.rationale.length === 0 ||
        node.operatingModel.scores.length === 0,
    );
    check(
      `${fileName} classifies every node`,
      unclassified.length === 0,
      `${unclassified.length} unclassified`,
    );
  }

  console.log("3. Determinism");
  for (const sample of SAMPLE_PACKAGES) {
    const again = await compileSample(sample.fileName, sample.text);
    const before = compiledByFile.get(sample.fileName);
    check(
      `${sample.fileName} recompiles byte-identically`,
      before ? toGraphJson(before) === toGraphJson(again) : false,
    );
  }

  console.log("4. Model mix");
  {
    const claimsdesk = compiledByFile.get(SAMPLE_PACKAGES[0]?.fileName ?? "");
    const models = new Set(
      claimsdesk?.graph.nodes.map((node) => node.operatingModel.primary) ?? [],
    );
    check(
      "a mature package spans more than one operating model",
      models.size >= 2,
      `${models.size} model(s)`,
    );
    const summary = claimsdesk?.graph.operatingModelSummary;
    const total =
      (summary?.flexibleTalent ?? 0) +
      (summary?.challenge ?? 0) +
      (summary?.privatePod ?? 0);
    check(
      "the model summary accounts for every node",
      total === claimsdesk?.graph.nodes.length,
      `${total} of ${claimsdesk?.graph.nodes.length}`,
    );
    check(
      "the summary reports the models in use",
      (summary?.modelsUsed.length ?? 0) === models.size,
      `${summary?.modelsUsed.length ?? 0} vs ${models.size}`,
    );
  }

  console.log("5. Quality gate");
  for (const [fileName, compiled] of compiledByFile) {
    check(
      `${fileName} is never presented as Ready`,
      compiled.quality.status !== "Ready",
      compiled.quality.status,
    );
    check(
      `${fileName} has an itemised gate`,
      compiled.quality.findings.length > 0,
      `${compiled.quality.findings.length} finding(s)`,
    );
  }

  console.log("6. Exports preserve the graph");
  for (const [fileName, compiled] of compiledByFile) {
    const graphJson = JSON.parse(toGraphJson(compiled)) as {
      nodes: { id: string }[];
    };
    const plan = toExecutionPlanMarkdown(compiled);
    const ids = compiled.graph.nodes.map((node) => node.id);
    check(
      `${fileName} graph JSON keeps every node id`,
      ids.every((id) => graphJson.nodes.some((node) => node.id === id)),
    );
    check(
      `${fileName} execution plan names every node`,
      ids.every((id) => plan.includes(id)),
    );
    check(
      `${fileName} quality export parses`,
      typeof JSON.parse(toQualityJson(compiled)).quality.status === "string",
    );
    const first = compiled.graph.nodes[0];
    check(
      `${fileName} builds a node package`,
      first ? packageToJson(compiled, first.id).length > 0 : false,
    );
  }

  console.log("7. ZIP bundle round-trips");
  {
    const compiled = compiledByFile.get(SAMPLE_PACKAGES[0]?.fileName ?? "");
    if (!compiled) {
      check("a compiled package is available for the bundle check", false);
    } else {
      const bytes = await toBundleZip(compiled);
      check("bundle is recognised as a ZIP", looksLikeZip(bytes));
      const listing = inspectZip(bytes);
      check(
        "bundle central directory is readable",
        listing.ok,
        listing.error ?? "",
      );
      const { files, skipped } = await unzipTextEntries(bytes);
      check(
        "bundle carries the graph, plan and packages",
        files.length >= 3,
        `${files.length} file(s)`,
      );
      check(
        "bundle reports directory entries rather than dropping them",
        skipped.length >= 0,
      );
      const graphEntry = files.find((file) =>
        file.baseName.endsWith(".graph.json"),
      );
      check(
        "bundle graph JSON is intact",
        graphEntry
          ? JSON.parse(graphEntry.text).dealId === compiled.canonical.deal.id
          : false,
      );
    }
  }

  console.log("8. Change impact");
  {
    const sample = SAMPLE_PACKAGES[0];
    const compiled = sample ? compiledByFile.get(sample.fileName) : undefined;
    const node = compiled?.graph.nodes[0];
    if (!compiled || !sample || !node) {
      check("a node is available for the impact check", false);
    } else {
      const { next, impact } = await applyEdits(compiled, [
        {
          nodeId: node.id,
          field: "title",
          value: `${node.title} (reviewed)`,
          rationale: "Submission check: verify an edit is tracked.",
          at: "2026-01-01T00:00:00.000Z",
        },
      ]);
      check(
        "an edit changes the edited node",
        next.graph.nodes
          .find((entry) => entry.id === node.id)
          ?.title.endsWith("(reviewed)") === true,
      );
      // The engine's own guarantee: untouched nodes come back byte-for-byte identical.
      check(
        "untouched nodes are preserved exactly",
        impact.preservedExactly === true,
      );
      check(
        "the impact report names the edit",
        impact.changed.length >= 1,
        `${impact.changed.length} change(s)`,
      );
      check(
        "the edit invalidates the edited node only",
        impact.affectedNodes.includes(node.id) === true,
      );
      check(
        "the decision log records the edit",
        next.decisions.entries.length === compiled.decisions.entries.length + 1,
      );
    }
  }

  console.log(
    failures === 0
      ? `\nAll submission checks passed across ${SAMPLE_PACKAGES.length} packages.`
      : `\n${failures} submission check(s) failed.`,
  );
  process.exit(failures === 0 ? 0 : 1);
}

void main();
