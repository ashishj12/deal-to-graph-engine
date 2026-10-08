/**
 * `bun run samples` — compile every deal-scoping package and write the sample
 * outputs the challenge asks the repository to contain:
 *
 *   samples/graphs/<package>.graph.json              machine-readable graph
 *   samples/quality/<package>.quality.json           quality-gate result
 *   samples/plans/<package>.execution-plan.md        human-readable plan
 *   samples/packages/<package>.<model>.json|.md      one package per model
 *   samples/mixed-model-graph.json                   a graph using all three models
 *
 * It also prints an inspection table, which is how the heuristics in the
 * decomposition and the classifier get checked against real output rather than
 * against expectations.
 */

import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { compileDeal, modelScores, toExecutionPlanMarkdown, toGraphJson, toQualityJson, packageToJson, packageToMarkdown } from "@deal-to-challenge/engine";
import type { CompiledDeal, ModelPackage } from "@deal-to-challenge/engine";
import { runImport } from "@deal-to-challenge/engine";
import { SAMPLE_PACKAGES } from "@deal-to-challenge/engine/samples";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const SAMPLES = join(ROOT, "samples");

/** Fixed timestamp so regenerating the samples is byte-stable. */
const GENERATED_AT = "2026-10-07T00:00:00.000Z";

async function main(): Promise<void> {
  const compiled: { sampleId: string; deal: CompiledDeal }[] = [];
  const modelsSeen = new Set<string>();
  const packageSamples = new Map<string, { pkg: ModelPackage; nodeTitle: string; deal: string }>();

  for (const sample of SAMPLE_PACKAGES) {
    const imported = await runImport(sample.fileName, sample.text);
    const result = await compileDeal(imported, { generatedAt: GENERATED_AT });
    compiled.push({ sampleId: sample.id, deal: result });

    const slug = sample.id;
    await Bun.write(join(SAMPLES, "graphs", `${slug}.graph.json`), toGraphJson(result));
    await Bun.write(join(SAMPLES, "quality", `${slug}.quality.json`), toQualityJson(result));
    await Bun.write(join(SAMPLES, "plans", `${slug}.execution-plan.md`), toExecutionPlanMarkdown(result));

    for (const node of result.graph.nodes) {
      const model = node.operatingModel.primary;
      if (modelsSeen.has(model)) continue;
      modelsSeen.add(model);
      const pkg = result.packages.find((entry) => entry.nodeId === node.id);
      if (!pkg) continue;
      packageSamples.set(model, { pkg, nodeTitle: node.title, deal: slug });
      await Bun.write(join(SAMPLES, "packages", `${slug}.${model}.json`), packageToJson(result, node.id));
      await Bun.write(join(SAMPLES, "packages", `${slug}.${model}.md`), packageToMarkdown(pkg, node));
    }
  }

  // The mixed-model graph: the compiled deal that uses the most operating models.
  const mixed = [...compiled].sort(
    (a, b) =>
      b.deal.graph.operatingModelSummary.modelsUsed.length - a.deal.graph.operatingModelSummary.modelsUsed.length ||
      b.deal.graph.nodes.length - a.deal.graph.nodes.length,
  )[0];
  if (mixed) {
    await Bun.write(join(SAMPLES, "mixed-model-graph.json"), toGraphJson(mixed.deal));
  }

  console.log("\nDeal-to-Challenge Graph Engine — sample run (mock AI mode)\n");
  const header = ["package", "nodes", "FT", "CH", "PP", "ready", "review", "blocked", "waves", "CP", "gate"];
  console.log(header.join("\t"));
  for (const { sampleId, deal } of compiled) {
    const readiness = (state: string) => deal.graph.nodes.filter((node) => node.readiness === state).length;
    console.log(
      [
        sampleId,
        deal.graph.nodes.length,
        deal.graph.operatingModelSummary.flexibleTalent,
        deal.graph.operatingModelSummary.challenge,
        deal.graph.operatingModelSummary.privatePod,
        readiness("ready"),
        readiness("review-required"),
        readiness("blocked"),
        deal.graph.waves.length,
        deal.graph.criticalPath.nodeIds.length,
        deal.quality.status,
      ].join("\t"),
    );
  }

  console.log("\nModel mix per package:");
  for (const { sampleId, deal } of compiled) {
    const counts = new Map<string, number>();
    for (const node of deal.graph.nodes) {
      counts.set(node.operatingModel.primary, (counts.get(node.operatingModel.primary) ?? 0) + 1);
    }
    console.log(
      `  ${sampleId}: ${[...counts.entries()].map(([model, count]) => `${model}=${count}`).join(" ")}`,
    );
    for (const model of ["flexible-talent", "challenge", "private-pod"] as const) {
      const example = deal.graph.nodes.find((node) => node.operatingModel.primary === model);
      if (!example) continue;
      const top = modelScores(example)[0];
      console.log(
        `    ${model} — ${example.id} score ${top.score}, margin ${example.operatingModel.margin}, confidence ${example.operatingModel.confidence}: ${example.operatingModel.rationale[0] ?? ""}`,
      );
    }
  }

  console.log("\nPackage samples written for:", [...packageSamples.keys()].join(", ") || "none");
  console.log(
    `Mixed-model graph: ${mixed?.deal.graph.dealId ?? "none"} (${mixed?.deal.graph.operatingModelSummary.modelsUsed.join(", ") ?? ""})`,
  );
  console.log(`\nWrote ${compiled.length} graph(s), ${compiled.length} quality report(s), ${compiled.length} plan(s).`);
}

await main();
