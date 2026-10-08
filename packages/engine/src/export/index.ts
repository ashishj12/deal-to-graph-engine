import type { GraphBundleFile } from "../canonical/execution";
import type { CompiledDeal } from "../compile";
import { buildModelPackage } from "../packages";
import { packageToMarkdown, toExecutionPlanMarkdown } from "./plan";
import { stableStringify } from "./stable-json";
import { zipFiles } from "./bundle";

export { stableStringify } from "./stable-json";
export {
  packageToMarkdown,
  toExecutionPlanMarkdown,
  qualityToMarkdown,
  wavesToMarkdown,
} from "./plan";
export { zipFiles } from "./bundle";

/** Machine-readable graph export: nodes, edges, waves, critical path, findings. */
export function toGraphJson(compiled: CompiledDeal): string {
  const { graph, quality } = compiled;
  return stableStringify({
    schemaVersion: graph.schemaVersion,
    graphId: graph.graphId,
    dealId: graph.dealId,
    dealTitle: graph.dealTitle,
    maturity: graph.maturity,
    revision: graph.revision,
    generator: graph.generator,
    operatingModelSummary: graph.operatingModelSummary,
    nodes: graph.nodes,
    edges: graph.edges,
    waves: graph.waves,
    criticalPath: graph.criticalPath,
    earliestStart: graph.earliestStart,
    aggregates: graph.aggregates,
    findings: graph.findings,
    traceability: graph.traceability,
    quality,
    decisions: compiled.decisions,
  });
}

export function toQualityJson(compiled: CompiledDeal): string {
  return stableStringify({
    schemaVersion: compiled.graph.schemaVersion,
    dealId: compiled.graph.dealId,
    revision: compiled.graph.revision,
    generator: compiled.graph.generator,
    quality: compiled.quality,
  });
}

export function packageToJson(compiled: CompiledDeal, nodeId: string): string {
  const node = compiled.graph.nodes.find((entry) => entry.id === nodeId);
  if (!node) throw new Error(`unknown node ${nodeId}`);
  const pkg = buildModelPackage(node, {
    canonical: compiled.canonical,
    generator: compiled.graph.generator,
  });
  return stableStringify({ ...pkg, title: node.title, node });
}

/** Every artefact, ready to write to disk or zip. */
export function buildBundleFiles(compiled: CompiledDeal): GraphBundleFile[] {
  const slug = compiled.graph.dealId.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const files: GraphBundleFile[] = [
    {
      path: `${slug}.graph.json`,
      kind: "json",
      contents: toGraphJson(compiled),
    },
    {
      path: `${slug}.quality.json`,
      kind: "json",
      contents: toQualityJson(compiled),
    },
    {
      path: `${slug}.execution-plan.md`,
      kind: "markdown",
      contents: toExecutionPlanMarkdown(compiled),
    },
  ];
  for (const node of compiled.graph.nodes) {
    const pkg = buildModelPackage(node, {
      canonical: compiled.canonical,
      generator: compiled.graph.generator,
    });
    const base = `${slug}.packages/${node.id.toLowerCase()}`;
    files.push({
      path: `${base}.${pkg.model}.json`,
      kind: "json",
      contents: packageToJson(compiled, node.id),
    });
    files.push({
      path: `${base}.${pkg.model}.md`,
      kind: "markdown",
      contents: packageToMarkdown(pkg, node),
    });
  }
  return files;
}

/** The bundle as one ZIP archive. */
export async function toBundleZip(compiled: CompiledDeal): Promise<Uint8Array> {
  return zipFiles(buildBundleFiles(compiled));
}
