import { useMemo, useState } from "react";
import {
  MODEL_MARK,
  MODEL_NAME,
  MODEL_TEXT,
  ModelChip,
  ReadinessChip,
  SectionTitle,
  StackedBar,
  Metric,
} from "./bits";
import type { Actions, DealEntry } from "./types";
import { cn } from "@/lib/utils";

export interface PlanViewProps {
  entry: DealEntry;
  actions: Actions;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  busy: boolean;
}

export function PlanView({
  entry,
  onSelectNode,
  selectedNodeId,
}: PlanViewProps) {
  const { graph, quality } = entry.compiled;
  const [showAllWaves, setShowAllWaves] = useState(false);

  const byId = useMemo(
    () => new Map(graph.nodes.map((node) => [node.id, node])),
    [graph],
  );
  const criticalOrder = graph.criticalPath.nodeIds
    .map((id) => byId.get(id))
    .filter((node): node is NonNullable<typeof node> => Boolean(node));
  const optimisticOrder = graph.criticalPath.optimisticNodeIds
    .map((id) => byId.get(id))
    .filter((node): node is NonNullable<typeof node> => Boolean(node));

  const waves = showAllWaves ? graph.waves : graph.waves.slice(0, 6);
  const checkpoints = graph.aggregates.reviewCheckpoints
    .map((id) => byId.get(id))
    .filter((node): node is NonNullable<typeof node> => Boolean(node));

  return (
    <div className="space-y-10">
      <SectionTitle
        index="FR5"
        title="Execution plan"
        detail={
          <>
            {graph.aggregates.nodeCount} nodes across{" "}
            {graph.aggregates.waveCount} waves. Duration basis:{" "}
            {graph.aggregates.durationBasis}
          </>
        }
        right={
          <span
            className={cn(
              "font-mono-data text-[11px]",
              MODEL_TEXT[graph.nodes[0]?.operatingModel.primary ?? "challenge"],
            )}
          >
            quality gate: {quality.status}
          </span>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric
          label="Total effort (min–max)"
          value={`${graph.aggregates.totalEffortMin}–${graph.aggregates.totalEffortMax}`}
          hint={`${graph.aggregates.totalEffortLikely} likely · ${graph.aggregates.effortUnit}`}
        />
        <Metric
          label="Critical path"
          value={`${graph.aggregates.criticalPathEffort} ${graph.aggregates.effortUnit}`}
          hint={`${criticalOrder.length} nodes · optimistic ${graph.criticalPath.optimisticEffort}`}
        />
        <Metric
          label="Duration estimate"
          value={graph.aggregates.durationEstimate}
          hint={`${graph.aggregates.effortUnit} · longest path`}
        />
        <Metric
          label="Nodes without effort"
          value={graph.aggregates.nodesMissingEffort.length}
          tone={
            graph.aggregates.nodesMissingEffort.length > 0
              ? "text-review"
              : "text-ready"
          }
          hint={
            graph.aggregates.nodesMissingEffort.slice(0, 4).join(", ") ||
            "every node is estimated"
          }
        />
      </section>

      {/* -------------------------------------------------------------- waves */}
      <section className="space-y-4">
        <SectionTitle
          index="FR5"
          title="Execution waves"
          detail="Wave number is the longest-path depth, so a node only appears once every predecessor has finished."
          right={
            graph.waves.length > 6 ? (
              <button
                type="button"
                className="font-mono-data text-[11px] underline decoration-hairline underline-offset-4"
                onClick={() => setShowAllWaves((value) => !value)}
              >
                {showAllWaves
                  ? "Show first 6 waves"
                  : `Show all ${graph.waves.length} waves`}
              </button>
            ) : null
          }
        />
        <ol className="space-y-3">
          {waves.map((wave) => (
            <li key={wave.index} className="border border-hairline">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-3 py-2">
                <span className="font-mono-data text-[11px] tracking-widest uppercase">
                  Wave {String(wave.index).padStart(2, "0")}
                </span>
                <span className="font-mono-data text-[11px] text-muted-foreground">
                  {wave.nodeIds.length} nodes · {wave.effort}{" "}
                  {graph.aggregates.effortUnit} · FT{" "}
                  {wave.models.flexibleTalent} CH {wave.models.challenge} PP{" "}
                  {wave.models.privatePod}
                </span>
              </div>
              <div className="px-3 py-2">
                <StackedBar
                  segments={[
                    {
                      value: wave.models.flexibleTalent,
                      className: "bg-model-flexible",
                      label: "Flexible Talent",
                    },
                    {
                      value: wave.models.challenge,
                      className: "bg-model-challenge",
                      label: "Challenge",
                    },
                    {
                      value: wave.models.privatePod,
                      className: "bg-model-pod",
                      label: "Private Pod",
                    },
                  ]}
                />
              </div>
              <ul className="divide-y divide-hairline/60">
                {wave.nodeIds.map((id) => {
                  const node = byId.get(id);
                  if (!node) return null;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => onSelectNode(id)}
                        className={cn(
                          "flex w-full flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 text-left transition-colors hover:bg-foreground/[0.03]",
                          selectedNodeId === id && "bg-foreground/[0.05]",
                        )}
                      >
                        <span className="font-mono-data text-[11px] text-muted-foreground">
                          {node.id}
                        </span>
                        <span className="min-w-0 flex-1 text-[12.5px]">
                          {node.title}
                        </span>
                        <span className="font-mono-data text-[11px] text-muted-foreground">
                          start {graph.earliestStart[node.id] ?? 0} ·{" "}
                          {node.effort.maximum ?? "?"} {node.effort.unit ?? ""}
                        </span>
                        <ModelChip model={node.operatingModel.primary} />
                        <ReadinessChip readiness={node.readiness} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------------------------------ critical path */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <SectionTitle
            index="FR5"
            title="Critical path"
            detail={graph.criticalPath.tieBreak}
          />
          <ol className="space-y-1.5">
            {criticalOrder.map((node, index) => (
              <li
                key={node.id}
                className="flex items-baseline gap-3 text-[12.5px]"
              >
                <span className="font-mono-data text-[10px] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => onSelectNode(node.id)}
                >
                  <span className="font-mono-data text-[11px] text-muted-foreground">
                    {node.id}
                  </span>{" "}
                  {node.title}
                </button>
                <span className="font-mono-data text-[11px] tabular-nums">
                  {node.effort.maximum ?? "?"} {node.effort.unit ?? ""}
                </span>
              </li>
            ))}
          </ol>
          <div className="border-t border-hairline pt-3">
            <div className="font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase">
              Optimistic path (minimum effort)
            </div>
            <p className="mt-2 font-mono-data text-[11px] leading-5 text-muted-foreground">
              {optimisticOrder.map((node) => node.id).join(" → ") || "no path"}{" "}
              · {graph.criticalPath.optimisticEffort}{" "}
              {graph.aggregates.effortUnit}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <SectionTitle
            index="FR5"
            title="Earliest start and review checkpoints"
            detail="Earliest start is in effort units along the longest predecessor chain."
          />
          <div className="max-h-[22rem] overflow-y-auto border border-hairline">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">Earliest start per node</caption>
              <thead className="sticky top-0 bg-background">
                <tr className="border-b border-hairline">
                  {["Node", "Wave", "Earliest start", "Effort"].map(
                    (header) => (
                      <th
                        key={header}
                        scope="col"
                        className="px-3 py-2 font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase"
                      >
                        {header}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {graph.nodes.map((node) => (
                  <tr
                    key={node.id}
                    className="border-b border-hairline/60 last:border-b-0"
                  >
                    <td className="px-3 py-1.5">
                      <button
                        type="button"
                        className="font-mono-data text-[11px] text-muted-foreground underline decoration-hairline underline-offset-4"
                        onClick={() => onSelectNode(node.id)}
                      >
                        {node.id}
                      </button>
                    </td>
                    <td className="px-3 py-1.5 font-mono-data text-[11px]">
                      {graph.waves.find((wave) =>
                        wave.nodeIds.includes(node.id),
                      )?.index ?? "—"}
                    </td>
                    <td className="px-3 py-1.5 font-mono-data text-[11px] tabular-nums">
                      {graph.earliestStart[node.id] ?? 0}
                    </td>
                    <td className="px-3 py-1.5 font-mono-data text-[11px] tabular-nums">
                      {node.effort.maximum ?? "?"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border border-hairline p-3">
            <div className="font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase">
              Review checkpoints
            </div>
            {checkpoints.length === 0 ? (
              <p className="mt-2 font-mono-data text-[11px] text-muted-foreground">
                No node currently requires a human review checkpoint.
              </p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {checkpoints.map((node) => (
                  <li key={node.id} className="text-[12.5px] leading-6">
                    <button
                      type="button"
                      className="text-left"
                      onClick={() => onSelectNode(node.id)}
                    >
                      <span className="font-mono-data text-[11px] text-muted-foreground">
                        {node.id}
                      </span>{" "}
                      {node.title}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ model distribution */}
      <section className="space-y-3">
        <SectionTitle
          index="FR4"
          title="Operating-model summary"
          detail={`${graph.operatingModelSummary.mixed ? "Mixed-model graph" : "Single-model graph"} using ${graph.operatingModelSummary.modelsUsed.length} operating model(s).`}
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {(["flexible-talent", "challenge", "private-pod"] as const).map(
            (model) => {
              const count =
                model === "flexible-talent"
                  ? graph.operatingModelSummary.flexibleTalent
                  : model === "challenge"
                    ? graph.operatingModelSummary.challenge
                    : graph.operatingModelSummary.privatePod;
              const effort = graph.nodes
                .filter((node) => node.operatingModel.primary === model)
                .reduce((sum, node) => sum + (node.effort.maximum ?? 0), 0);
              return (
                <div key={model} className="border border-hairline px-3 py-3">
                  <div
                    className={cn(
                      "font-mono-data text-[11px] uppercase",
                      MODEL_TEXT[model],
                    )}
                  >
                    {MODEL_MARK[model]} {MODEL_NAME[model]}
                  </div>
                  <div className="mt-2 font-mono-data text-[19px] tabular-nums">
                    {count}
                  </div>
                  <div className="mt-1 font-mono-data text-[11px] text-muted-foreground">
                    {effort} {graph.aggregates.effortUnit} of estimated work
                  </div>
                </div>
              );
            },
          )}
        </div>
      </section>

      {graph.aggregates.nodesMissingEffort.length > 0 && (
        <section className="space-y-2">
          <SectionTitle
            index="FR3"
            title="Work without an imported estimate"
            detail="The engine never invents numbers. These nodes need an operator-supplied estimate or a discovery answer before handoff."
          />
          <p className="font-mono-data text-[11px] leading-6 text-muted-foreground">
            {graph.aggregates.nodesMissingEffort.join(", ")}
          </p>
        </section>
      )}
    </div>
  );
}
