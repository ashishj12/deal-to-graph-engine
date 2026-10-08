import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  EdgeType,
  ExecutionNode,
  GraphEdge,
} from "@deal-to-challenge/engine";
import { EDGE_TYPES } from "@deal-to-challenge/engine";
import { useMemo, useState } from "react";
import {
  Chip,
  MODEL_MARK,
  MODEL_NAME,
  MODEL_TEXT,
  SectionTitle,
  StackedBar,
} from "./bits";
import type { Actions, DealEntry } from "./types";
/* eslint-disable react-refresh/only-export-components */
import { cn } from "@/lib/utils";
import { AlertTriangle, MoveRight, Trash2 } from "lucide-react";

const BOX = { width: 212, height: 58, gapX: 84, gapY: 20 };
const PAD = 28;

const MODEL_STROKE: Record<string, string> = {
  "flexible-talent": "var(--color-model-flexible)",
  challenge: "var(--color-model-challenge)",
  "private-pod": "var(--color-model-pod)",
};

function truncate(text: string, max: number): string {
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

interface Positioned {
  node: ExecutionNode;
  x: number;
  y: number;
}

function layout(entry: DealEntry): {
  placed: Positioned[];
  width: number;
  height: number;
} {
  const { waves, criticalPath } = entry.compiled.graph;
  const onCritical = new Set(criticalPath.nodeIds);
  const placed: Positioned[] = [];
  let width = PAD;

  for (const wave of waves) {
    const nodes = wave.nodeIds
      .map((id) => entry.compiled.graph.nodes.find((node) => node.id === id))
      .filter((node): node is ExecutionNode => Boolean(node))
      // Critical-path nodes sit first in their column so the path reads top-to-bottom.
      .sort(
        (a, b) => Number(onCritical.has(b.id)) - Number(onCritical.has(a.id)),
      );

    nodes.forEach((node, index) => {
      placed.push({
        node,
        x: PAD + (wave.index - 1) * (BOX.width + BOX.gapX),
        y: PAD + index * (BOX.height + BOX.gapY),
      });
    });
    width = PAD + wave.index * (BOX.width + BOX.gapX);
    // Track the tallest column so the viewBox always covers every box.
    width = Math.max(
      width,
      PAD + (wave.index - 1) * (BOX.width + BOX.gapX) + BOX.width + PAD,
    );
  }

  const height = Math.max(
    220,
    ...waves.map(
      (wave) => PAD * 2 + wave.nodeIds.length * (BOX.height + BOX.gapY),
    ),
  );
  return { placed, width, height };
}

function edgePath(from: Positioned, to: Positioned): string {
  const x1 = from.x + BOX.width;
  const y1 = from.y + BOX.height / 2;
  const x2 = to.x;
  const y2 = to.y + BOX.height / 2;
  const mid = (x1 + x2) / 2;
  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
}

export interface GraphViewProps {
  entry: DealEntry;
  actions: Actions;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  busy: boolean;
}

export function GraphView({
  entry,
  actions,
  selectedNodeId,
  onSelectNode,
  busy,
}: GraphViewProps) {
  const { graph } = entry.compiled;
  const [rationale, setRationale] = useState("");
  const [edgeDraft, setEdgeDraft] = useState<{
    source: string;
    target: string;
    type: EdgeType;
    blocking: boolean;
  }>({ source: "", target: "", type: "sequencing", blocking: true });

  const { placed, width, height } = useMemo(() => layout(entry), [entry]);
  const positions = useMemo(
    () => new Map(placed.map((item) => [item.node.id, item])),
    [placed],
  );
  const criticalEdges = useMemo(
    () =>
      new Set(
        graph.criticalPath.nodeIds.map(
          (id, index, all) => `${id}->${all[index + 1] ?? ""}`,
        ),
      ),
    [graph],
  );
  const visibleEdges = useMemo(() => {
    if (selectedNodeId) {
      const touching = graph.edges.filter(
        (edge) =>
          edge.source === selectedNodeId || edge.target === selectedNodeId,
      );
      if (touching.length > 0) return touching;
    }
    return graph.edges.slice(0, 40);
  }, [graph, selectedNodeId]);

  const canAct = rationale.trim().length >= 8 && !busy;
  const onCritical = new Set(graph.criticalPath.nodeIds);
  const problems = graph.findings.filter(
    (finding) => finding.severity !== "info",
  );

  return (
    <div className="space-y-8">
      <SectionTitle
        index="FR5"
        title="Dependency graph"
        detail={
          <>
            {graph.waves.length} waves · {graph.nodes.length} nodes ·{" "}
            {graph.edges.length} edges · critical path{" "}
            {graph.criticalPath.nodeIds.length} nodes /{" "}
            {graph.criticalPath.effort} {graph.aggregates.effortUnit}
          </>
        }
        right={
          <div className="flex flex-wrap items-center gap-3">
            {(["flexible-talent", "challenge", "private-pod"] as const).map(
              (model) => (
                <span key={model} className="flex items-center gap-1.5">
                  <span
                    aria-hidden
                    className="size-2.5 border"
                    style={{ borderColor: MODEL_STROKE[model] }}
                  />
                  <span
                    className={cn(
                      "font-mono-data text-[10px] uppercase",
                      MODEL_TEXT[model],
                    )}
                  >
                    {MODEL_MARK[model]} {MODEL_NAME[model]}
                  </span>
                </span>
              ),
            )}
          </div>
        }
      />

      <div className="overflow-x-auto border border-hairline bg-black/20">
        <svg
          role="group"
          aria-label="Layered dependency graph of delivery nodes"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          className="min-w-full"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="7"
              markerHeight="7"
              orient="auto"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="currentColor" />
            </marker>
          </defs>

          {graph.waves.map((wave) => (
            <text
              key={wave.index}
              x={PAD + (wave.index - 1) * (BOX.width + BOX.gapX)}
              y={14}
              className="fill-current font-mono-data text-[11px] text-muted-foreground"
            >
              WAVE {String(wave.index).padStart(2, "0")} · {wave.nodeIds.length}{" "}
              NODES · {wave.effort} {graph.aggregates.effortUnit.toUpperCase()}
            </text>
          ))}

          {graph.edges.map((edge) => {
            const from = positions.get(edge.source);
            const to = positions.get(edge.target);
            if (!from || !to) return null;
            const critical = criticalEdges.has(
              `${edge.source}->${edge.target}`,
            );
            const active =
              selectedNodeId === edge.source || selectedNodeId === edge.target;
            return (
              <path
                key={edge.id}
                d={edgePath(from, to)}
                fill="none"
                data-edgeId={edge.id}
                stroke="currentColor"
                strokeWidth={active ? 1.6 : 1}
                strokeDasharray={edge.blocking ? "5 4" : undefined}
                opacity={active ? 0.85 : critical ? 0.5 : 0.28}
              />
            );
          })}

          {placed.map(({ node, x, y }) => {
            const selected = node.id === selectedNodeId;
            const blocked = node.readiness === "blocked";
            const review = node.readiness === "review-required";
            const critical = onCritical.has(node.id);
            const stroke =
              MODEL_STROKE[node.operatingModel.primary] ??
              "var(--color-hairline)";
            return (
              <g
                key={node.id}
                role="button"
                tabIndex={0}
                aria-label={`${node.id}, ${node.title}. ${MODEL_NAME[node.operatingModel.primary]}, ${node.readiness}, wave ${graph.earliestStart[node.id] ?? 0}`}
                aria-pressed={selected}
                className="cursor-pointer outline-none focus-visible:stroke-signal"
                onClick={() => onSelectNode(node.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelectNode(node.id);
                  }
                }}
              >
                <rect
                  x={x}
                  y={y}
                  width={BOX.width}
                  height={BOX.height}
                  fill="var(--color-background)"
                  stroke={selected ? "var(--color-signal)" : stroke}
                  strokeWidth={critical ? 2.4 : 1.2}
                  strokeDasharray={
                    blocked ? "4 3" : review ? "1.5 3" : undefined
                  }
                />
                <rect x={x} y={y} width={4} height={BOX.height} fill={stroke} />
                <text
                  x={x + 14}
                  y={y + 19}
                  className="fill-current font-mono-data text-[10px] text-muted-foreground"
                >
                  {node.id} · {MODEL_MARK[node.operatingModel.primary]} ·{" "}
                  {node.workCategory}
                </text>
                <text
                  x={x + 14}
                  y={y + 36}
                  className="fill-current text-[11px]"
                >
                  {truncate(node.title, 34)}
                </text>
                <text
                  x={x + 14}
                  y={y + 50}
                  className="fill-current font-mono-data text-[9.5px] text-muted-foreground"
                >
                  {node.readiness}
                  {critical ? " · critical" : ""}
                  {node.effort.maximum === null
                    ? " · effort needs input"
                    : ` · ${node.effort.maximum}${node.effort.unit ? ` ${node.effort.unit}` : ""}`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <p className="font-mono-data text-[11px] leading-5 text-muted-foreground">
        Solid outline = flexible talent · lighter outline = challenge · heavier
        outline = private pod. Dashed box = blocked · dotted box = review
        required · thick outline = critical path · 4px left bar = operating
        model. Click or press Enter on a node to open it.
      </p>

      {/* ----------------------------------------------------------- problems */}
      <section className="space-y-3">
        <SectionTitle
          index="FR5"
          title="Structural findings"
          detail="Cycles, orphans, duplicate or invalid edges and dangling references are computed deterministically."
        />
        {problems.length === 0 ? (
          <p className="font-mono-data text-[11px] text-ready">
            No structural problem: no cycle, no orphan node, no invalid
            dependency.
          </p>
        ) : (
          <ul className="space-y-2">
            {problems.map((finding) => (
              <li
                key={finding.id}
                className="border-l-2 border-blocked/60 pl-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Chip
                    tone={
                      finding.severity === "error"
                        ? "border-blocked/50 text-blocked"
                        : "border-review/50 text-review"
                    }
                  >
                    <AlertTriangle className="size-2.5" /> {finding.code}
                  </Chip>
                  <span className="font-mono-data text-[10px] text-muted-foreground uppercase">
                    {finding.nodeIds.join(", ") || "graph"}
                  </span>
                </div>
                <p className="mt-1 text-[12.5px] leading-6">
                  {finding.message}
                </p>
                {finding.cyclePath.length > 0 && (
                  <p className="mt-1 font-mono-data text-[11px] text-blocked">
                    cycle: {finding.cyclePath.join(" → ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ------------------------------------------------- dependency editor */}
      <section className="space-y-3">
        <SectionTitle
          index="FR5"
          title="Dependency editor"
          detail="Add or remove a dependency. Removing or adding re-runs validation immediately, so a cycle cannot be saved silently."
        />
        <div className="grid gap-3 border border-hairline p-3 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block text-[11px]">
            <span className="font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase">
              Source
            </span>
            <select
              className="mt-1 h-8 w-full border border-hairline bg-transparent px-2 font-mono-data text-[11px]"
              value={edgeDraft.source}
              onChange={(event) =>
                setEdgeDraft({ ...edgeDraft, source: event.target.value })
              }
            >
              <option value="">select…</option>
              {graph.nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.id} — {truncate(node.title, 42)}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[11px]">
            <span className="font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase">
              Target
            </span>
            <select
              className="mt-1 h-8 w-full border border-hairline bg-transparent px-2 font-mono-data text-[11px]"
              value={edgeDraft.target}
              onChange={(event) =>
                setEdgeDraft({ ...edgeDraft, target: event.target.value })
              }
            >
              <option value="">select…</option>
              {graph.nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.id} — {truncate(node.title, 42)}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-[11px]">
            <span className="font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase">
              Type
            </span>
            <select
              className="mt-1 h-8 w-full border border-hairline bg-transparent px-2 font-mono-data text-[11px]"
              value={edgeDraft.type}
              onChange={(event) =>
                setEdgeDraft({
                  ...edgeDraft,
                  type: event.target.value as EdgeType,
                })
              }
            >
              {EDGE_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-end gap-2 pb-1.5 font-mono-data text-[11px]">
            <input
              type="checkbox"
              checked={edgeDraft.blocking}
              onChange={(event) =>
                setEdgeDraft({ ...edgeDraft, blocking: event.target.checked })
              }
            />
            blocking
          </label>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="edge-rationale"
            className="label text-muted-foreground"
          >
            Rationale (required — every dependency needs a source-backed or
            user-reviewed reason)
          </Label>
          <Textarea
            id="edge-rationale"
            rows={2}
            value={rationale}
            onChange={(event) => setRationale(event.target.value)}
            className="text-[13px]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            disabled={
              !canAct ||
              edgeDraft.source.length === 0 ||
              edgeDraft.target.length === 0 ||
              edgeDraft.source === edgeDraft.target
            }
            onClick={() =>
              actions.addEdge(
                edgeDraft.source,
                edgeDraft.target,
                edgeDraft.type,
                edgeDraft.blocking,
                rationale.trim(),
              )
            }
          >
            <MoveRight className="size-3" /> Add dependency
          </Button>
          <span className="self-center font-mono-data text-[10px] text-muted-foreground">
            self-dependencies are rejected before they reach the graph
          </span>
        </div>

        <div className="max-h-[22rem] overflow-y-auto border border-hairline">
          <ul>
            {visibleEdges.map((edge) => (
              <li
                key={edge.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline/60 px-3 py-2 last:border-b-0"
              >
                <div className="min-w-0">
                  <div className="font-mono-data text-[11px]">
                    {edge.source} <MoveRight className="inline size-3" />{" "}
                    {edge.target}
                  </div>
                  <div className="mt-0.5 text-[11.5px] leading-5 text-muted-foreground">
                    {edge.type} · {edge.blocking ? "blocking" : "non-blocking"}{" "}
                    · {edge.handoff}
                  </div>
                  <div className="text-[11px] leading-5 text-muted-foreground/80">
                    {edge.rationale}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Chip tone="border-hairline text-muted-foreground">
                    {edge.provenance}
                  </Chip>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={!canAct}
                    onClick={() =>
                      actions.removeEdge(
                        `${edge.source}->${edge.target}`,
                        rationale.trim(),
                      )
                    }
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        {selectedNodeId && (
          <p className="font-mono-data text-[11px] text-muted-foreground">
            Showing edges touching {selectedNodeId}.{" "}
            <button
              type="button"
              className="underline decoration-hairline underline-offset-4"
              onClick={() => onSelectNode(null)}
            >
              Show all
            </button>
          </p>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 border border-hairline p-4">
          <div className="font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase">
            Model distribution per wave
          </div>
          <ul className="space-y-3">
            {graph.waves.map((wave) => (
              <li key={wave.index}>
                <div className="flex items-center justify-between font-mono-data text-[11px]">
                  <span>Wave {wave.index}</span>
                  <span className="text-muted-foreground">
                    FT {wave.models.flexibleTalent} · CH {wave.models.challenge}{" "}
                    · PP {wave.models.privatePod}
                  </span>
                </div>
                <div className="mt-1.5">
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
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 border border-hairline p-4">
          <div className="font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase">
            Parallel groups
          </div>
          <ul className="space-y-1.5 font-mono-data text-[11px]">
            {graph.aggregates.parallelGroups.map((group) => (
              <li
                key={group.wave}
                className="flex items-start justify-between gap-3"
              >
                <span>Wave {group.wave}</span>
                <span className="text-right text-muted-foreground">
                  {group.nodeIds.join(", ")}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-2 font-mono-data text-[11px]">
            <span>Entry nodes</span>
            <span className="text-right text-muted-foreground">
              {graph.aggregates.entryNodes.join(", ") || "none"}
            </span>
            <span>Terminal nodes</span>
            <span className="text-right text-muted-foreground">
              {graph.aggregates.terminalNodes.join(", ") || "none"}
            </span>
            <span>Orphan nodes</span>
            <span
              className={cn(
                "text-right",
                graph.aggregates.orphanNodes.length > 0
                  ? "text-review"
                  : "text-muted-foreground",
              )}
            >
              {graph.aggregates.orphanNodes.join(", ") || "none"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Edge list helper kept beside the view so the shape stays obvious. */
export function describeEdge(edge: GraphEdge): string {
  return `${edge.source}→${edge.target} (${edge.type}${edge.blocking ? ", blocking" : ""})`;
}
