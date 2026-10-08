/**
 * 06 · Validation and export workspace (FR6/FR7).
 *
 * The quality gate, the traceability matrix, the classification validation, the
 * change-impact report for the last operator action, the decision log and the
 * export controls. The gate is deterministic: it never asks a model for a verdict.
 */

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EdgeType, OperatingModel } from "@deal-to-challenge/engine";
import { useMemo, useState } from "react";
import {
  Chip,
  EmptyNote,
  MODEL_MARK,
  MODEL_NAME,
  MODEL_TEXT,
  Metric,
  ProvenanceChip,
  ReadinessChip,
  SectionTitle,
} from "./bits";
import type { Actions, DealEntry } from "./types";
import { cn } from "@/lib/utils";
import { Check, Download, FileJson, FileText, X } from "lucide-react";

const GATE_TONE: Record<string, string> = {
  Ready: "text-ready border-ready/50",
  "Review Required": "text-review border-review/50",
  Blocked: "text-blocked border-blocked/50",
};

export interface ValidationViewProps {
  entry: DealEntry;
  actions: Actions;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  busy: boolean;
}

export function ValidationView({ entry, actions, onSelectNode, busy }: ValidationViewProps) {
  const { graph, quality, decisions } = entry.compiled;
  const [rationale, setRationale] = useState("");
  const [showAllFindings, setShowAllFindings] = useState(false);

  const traceability = useMemo(
    () => graph.traceability.filter((row) => row.inScope),
    [graph],
  );
  const covered = traceability.filter((row) => row.covered).length;
  const uncovered = traceability.filter((row) => !row.covered);
  const impact = entry.impact;
  const failures = quality.findings.filter((finding) => finding.status !== "pass");
  const visibleFindings = showAllFindings ? quality.findings : failures;
  const canAct = rationale.trim().length >= 8 && !busy;

  const modelMismatch = graph.findings.filter((finding) => finding.code === "model-handoff");

  return (
    <div className="space-y-10">
      <SectionTitle
        index="FR6"
        title="Quality gate"
        detail="Deterministic rules over the compiled graph. Every finding carries a rule id and a provenance of deterministic."
        right={
          <span className={cn("border px-2 py-1 font-mono-data text-[11px] uppercase", GATE_TONE[quality.status])}>
            {quality.status}
          </span>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Gate status"
          value={quality.status}
          tone={quality.status === "Ready" ? "text-ready" : quality.status === "Blocked" ? "text-blocked" : "text-review"}
          hint={`score ${quality.score}/100 · ${quality.counts.pass} pass · ${quality.counts.warn} warn · ${quality.counts.fail} fail`}
        />
        <Metric
          label="Source coverage"
          value={`${covered}/${traceability.length}`}
          hint={`requirements ${quality.coverage.requirements}% · components ${quality.coverage.components}% · integrations ${quality.coverage.integrations}% · AI ${quality.coverage.aiUseCases}%`}
        />
        <Metric
          label="Readiness"
          value={`${graph.nodes.filter((node) => node.readiness === "ready").length} ready`}
          hint={`${graph.nodes.filter((node) => node.readiness === "blocked").length} blocked · ${graph.nodes.filter((node) => node.readiness === "review-required").length} review required`}
        />
        <Metric
          label="Graph approval"
          value={decisions.graphApproved ? "approved" : "not approved"}
          tone={decisions.graphApproved ? "text-ready" : "text-review"}
          hint={
            decisions.approvedAt
              ? `at ${decisions.approvedAt} by ${decisions.approvedBy ?? "user"}`
              : "human final approval is required before Ready"
          }
        />
      </section>

      {quality.gatedOn.length > 0 && (
        <p className="font-mono-data text-[11px] leading-5 text-muted-foreground">
          Gated on: {quality.gatedOn.join(", ")}. A graph with a cycle, a node without a valid operating
          model, an unsupported node or an open blocker can never be Ready.
        </p>
      )}

      <section className="space-y-4">
        <SectionTitle
          title="Rule findings"
          detail={`${failures.length} finding(s) did not pass.`}
          right={
            <button
              type="button"
              className="font-mono-data text-[11px] underline decoration-hairline underline-offset-4"
              onClick={() => setShowAllFindings((value) => !value)}
            >
              {showAllFindings ? "Show failures only" : `Show all ${quality.findings.length} checks`}
            </button>
          }
        />
        <div className="overflow-x-auto border border-hairline">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <caption className="sr-only">Quality gate findings</caption>
            <thead>
              <tr className="border-b border-rule-strong">
                {["Status", "Rule", "Message", "Detail", "Nodes"].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-3 py-2 font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleFindings.map((finding) => (
                <tr key={finding.id} className="border-b border-hairline/60 last:border-b-0 align-top">
                  <td className="px-3 py-2">
                    <Chip
                      tone={
                        finding.status === "pass"
                          ? "border-ready/50 text-ready"
                          : finding.status === "fail"
                            ? "border-blocked/50 text-blocked"
                            : "border-review/50 text-review"
                      }
                    >
                      {finding.status === "pass" ? <Check className="size-2.5" /> : <X className="size-2.5" />}
                      {finding.status}
                    </Chip>
                  </td>
                  <td className="px-3 py-2 font-mono-data text-[11px]">{finding.rule}</td>
                  <td className="max-w-[24rem] px-3 py-2 text-[12.5px] leading-5">{finding.message}</td>
                  <td className="max-w-[20rem] px-3 py-2 text-[11.5px] leading-5 text-muted-foreground">
                    {finding.detail}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      {finding.nodeIds.slice(0, 6).map((id) => (
                        <button
                          key={id}
                          type="button"
                          className="font-mono-data text-[11px] text-muted-foreground underline decoration-hairline underline-offset-4"
                          onClick={() => onSelectNode(id)}
                        >
                          {id}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle
          index="FR1"
          title="Traceability matrix"
          detail={`${covered} of ${traceability.length} in-scope records are referenced by at least one delivery node.`}
        />
        {uncovered.length > 0 && (
          <div className="border border-hairline p-3">
            <div className="font-mono-data text-[10px] tracking-[0.1em] text-review uppercase">
              Covered by no node ({uncovered.length})
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {uncovered.map((row) => (
                <Chip key={row.sourceId} tone="border-review/40 text-review" title={row.sourceTitle}>
                  {row.sourceId}
                </Chip>
              ))}
            </div>
          </div>
        )}
        <div className="max-h-[24rem] overflow-y-auto border border-hairline">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Source to node traceability</caption>
            <thead className="sticky top-0 bg-background">
              <tr className="border-b border-hairline">
                {["Source", "Kind", "Title", "Nodes"].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-3 py-2 font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {traceability.map((row) => (
                <tr key={row.sourceId} className="border-b border-hairline/60 align-top last:border-b-0">
                  <td className="px-3 py-1.5 font-mono-data text-[11px]">{row.sourceId}</td>
                  <td className="px-3 py-1.5 font-mono-data text-[11px] text-muted-foreground">{row.sourceKind}</td>
                  <td className="max-w-[22rem] px-3 py-1.5 text-[12px] leading-5">{row.sourceTitle}</td>
                  <td className="px-3 py-1.5">
                    {row.nodeIds.length === 0 ? (
                      <span className="font-mono-data text-[11px] text-review">none</span>
                    ) : (
                      <span className="font-mono-data text-[11px] text-muted-foreground">
                        {row.nodeIds.join(", ")}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle
          index="FR4"
          title="Classification validation"
          detail="Every executable node has exactly one primary operating model with a rationale and a confidence value."
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {(["flexible-talent", "challenge", "private-pod"] as const).map((model: OperatingModel) => {
            const nodes = graph.nodes.filter((node) => node.operatingModel.primary === model);
            return (
              <div key={model} className="border border-hairline p-3">
                <div className={cn("font-mono-data text-[11px] uppercase", MODEL_TEXT[model])}>
                  {MODEL_MARK[model]} {MODEL_NAME[model]}
                </div>
                <div className="mt-1.5 font-mono-data text-[15px] tabular-nums">{nodes.length} nodes</div>
                <ul className="mt-2 space-y-1 font-mono-data text-[10.5px] text-muted-foreground">
                  <li>high: {nodes.filter((node) => node.operatingModel.confidence === "high").length}</li>
                  <li>medium: {nodes.filter((node) => node.operatingModel.confidence === "medium").length}</li>
                  <li>low: {nodes.filter((node) => node.operatingModel.confidence === "low").length}</li>
                  <li>overridden: {nodes.filter((node) => node.operatingModel.overridden).length}</li>
                </ul>
              </div>
            );
          })}
        </div>
        <p className="font-mono-data text-[11px] leading-5 text-muted-foreground">
          {modelMismatch.length === 0
            ? "No model-to-work mismatch, split recommendation or handoff edge was raised."
            : `${modelMismatch.length} model-to-work observation(s) were raised.`}
        </p>
      </section>

      <section className="space-y-3">
        <SectionTitle
          index="FR6"
          title="Change impact"
          detail="The report for the most recent operator decision: what changed, what was preserved exactly, and how the schedule moved."
        />
        {!impact ? (
          <EmptyNote>No change has been made yet — the graph is the deterministic baseline</EmptyNote>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="Changed fields" value={impact.changed.length} />
              <Metric
                label="Affected / unaffected"
                value={`${impact.affectedNodes.length} / ${impact.unaffectedNodes.length}`}
                hint={impact.preservedExactly ? "unaffected nodes preserved byte-for-byte" : "preservation check failed"}
                tone={impact.preservedExactly ? "text-ready" : "text-blocked"}
              />
              <Metric
                label="Effort delta"
                value={`${impact.effortDelta >= 0 ? "+" : ""}${impact.effortDelta}`}
                hint={`${graph.aggregates.effortUnit} · duration ${impact.durationDelta >= 0 ? "+" : ""}${impact.durationDelta}`}
              />
              <Metric
                label="Critical path"
                value={impact.criticalPath.changed ? "changed" : "unchanged"}
                tone={impact.criticalPath.changed ? "text-review" : "text-ready"}
                hint={`${impact.criticalPath.after.length} nodes · effort delta ${impact.criticalPath.effortDelta}`}
              />
            </div>

            <ul className="space-y-1.5 text-[12.5px] leading-6">
              {impact.summary.map((line) => (
                <li key={line} className="flex gap-2">
                  <span aria-hidden className="mt-2.5 size-1 shrink-0 bg-current opacity-50" />
                  {line}
                </li>
              ))}
            </ul>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  Changed edges
                </div>
                <p className="font-mono-data text-[11px] leading-5 text-muted-foreground">
                  added {impact.changedEdges.added.length} · removed {impact.changedEdges.removed.length} ·
                  retyped {impact.changedEdges.retyped.length}
                </p>
                <div className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  Invalidated packages
                </div>
                <p className="font-mono-data text-[11px] leading-5 text-muted-foreground">
                  {impact.invalidatedPackages.length === 0 ? "none" : impact.invalidatedPackages.join(", ")}
                </p>
                <div className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  Model changes
                </div>
                <ul className="space-y-1 font-mono-data text-[11px] text-muted-foreground">
                  {impact.modelChanges.length === 0 && <li>none</li>}
                  {impact.modelChanges.map((change) => (
                    <li key={change.nodeId}>
                      {change.nodeId}: {MODEL_NAME[change.from] ?? change.from} →{" "}
                      {MODEL_NAME[change.to] ?? change.to}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <div className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  Wave changes
                </div>
                <ul className="space-y-1 font-mono-data text-[11px] text-muted-foreground">
                  {impact.waveChanges.length === 0 && <li>none</li>}
                  {impact.waveChanges.map((change) => (
                    <li key={change.nodeId}>
                      {change.nodeId}: wave {change.from} → {change.to}
                    </li>
                  ))}
                </ul>
                <div className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  Readiness movement
                </div>
                <ul className="space-y-1 font-mono-data text-[11px] text-muted-foreground">
                  <li>newly blocked: {impact.newlyBlocked.join(", ") || "none"}</li>
                  <li>newly ready: {impact.newlyReady.join(", ") || "none"}</li>
                  <li>newly unsupported: {impact.newlyUnsupported.join(", ") || "none"}</li>
                  <li>regenerated: {impact.regeneratedNodes.length} nodes</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </section>

      <section className="space-y-3">
        <SectionTitle
          index="FR6"
          title="Decision log"
          detail={`${decisions.entries.length} recorded decision(s) · revision ${decisions.revision}. Append-only: nothing is rewritten.`}
          right={
            decisions.entries.length > 0 ? (
              <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => actions.revert()}>
                Revert last decision
              </Button>
            ) : null
          }
        />
        {decisions.entries.length === 0 ? (
          <EmptyNote>No operator decision yet</EmptyNote>
        ) : (
          <ul className="border border-hairline">
            {[...decisions.entries].reverse().map((decision) => (
              <li key={decision.id} className="border-b border-hairline/60 px-3 py-2.5 last:border-b-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone="border-hairline text-muted-foreground">{decision.type}</Chip>
                  <span className="font-mono-data text-[10px] text-muted-foreground">
                    {decision.targetNodeIds.join(", ") || decision.targetEdgeIds.join(", ") || "graph"}
                  </span>
                  <span className="font-mono-data text-[10px] text-muted-foreground/70">{decision.at}</span>
                </div>
                <p className="mt-1 text-[12.5px] leading-6">{decision.summary}</p>
                <p className="mt-0.5 text-[11.5px] leading-5 text-muted-foreground">
                  rationale: {decision.rationale}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <SectionTitle
          index="FR7"
          title="Export"
          detail="Every artefact carries the generator record, the source references, the operating-model rationale, the waves, the critical path and the gate result. Blocked nodes export as not ready for operational handoff."
        />
        <div className="space-y-2">
          <Label htmlFor="approval-rationale" className="label text-muted-foreground">
            Final approval rationale
          </Label>
          <Textarea
            id="approval-rationale"
            rows={2}
            value={rationale}
            onChange={(event) => setRationale(event.target.value)}
            className="text-[13px]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" disabled={!canAct} onClick={() => actions.approveGraph(rationale.trim())}>
            <Check className="size-3" /> Approve graph
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!canAct || !decisions.graphApproved}
            onClick={() => actions.revokeApproval(rationale.trim())}
          >
            Revoke approval
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => actions.exportGraph()}>
            <FileJson className="size-3" /> Graph JSON
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => actions.exportPlan()}>
            <FileText className="size-3" /> Execution plan
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={() => actions.exportQuality()}>
            <FileJson className="size-3" /> Quality JSON
          </Button>
          <Button type="button" size="sm" onClick={() => actions.exportBundle()}>
            <Download className="size-3" /> ZIP bundle
          </Button>
        </div>
        <p className="font-mono-data text-[11px] leading-5 text-muted-foreground">
          Generator: {graph.generator.mode} / {graph.generator.provider} · prompt version{" "}
          {graph.generator.promptVersion}. {graph.generator.notice}
        </p>
        <div className="flex flex-wrap gap-2">
          <ProvenanceChip provenance="deterministic" />
          <span className="font-mono-data text-[11px] text-muted-foreground">
            waves, critical path, coverage, aggregates and gate status are deterministic
          </span>
        </div>
      </section>

      <section className="space-y-2">
        <SectionTitle
          index="FR5"
          title="Dependency types in use"
          detail="Every edge carries a type, a rationale, a blocking flag and the handoff it represents."
        />
        <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {[...new Set(graph.edges.map((edge) => edge.type as EdgeType))].sort().map((type) => (
            <li key={type} className="flex items-center justify-between border border-hairline px-3 py-1.5">
              <span className="font-mono-data text-[11px]">{type}</span>
              <span className="font-mono-data text-[11px] text-muted-foreground">
                {graph.edges.filter((edge) => edge.type === type).length}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <SectionTitle title="Readiness per node" detail="Blocked and incomplete nodes are exported as not ready for operational handoff." />
        <ul className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
          {graph.nodes.map((node) => (
            <li key={node.id} className="flex items-center justify-between gap-2 border border-hairline px-3 py-1.5">
              <button
                type="button"
                className="min-w-0 truncate text-left font-mono-data text-[11px]"
                onClick={() => onSelectNode(node.id)}
              >
                {node.id} <span className="text-muted-foreground">{node.title}</span>
              </button>
              <ReadinessChip readiness={node.readiness} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
