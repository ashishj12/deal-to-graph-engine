import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ExecutionNode, WorkCategory } from "@deal-to-challenge/engine";
import { WORK_CATEGORIES } from "@deal-to-challenge/engine";
import { useMemo, useState } from "react";
import {
  MODEL_MARK,
  MODEL_NAME,
  MODEL_TEXT,
  ModelChip,
  ReadinessChip,
  SectionTitle,
} from "./bits";
import { NodeDetail } from "./NodeDetail";
import type { Actions, DealEntry, NodeDraftInput } from "./types";
import { cn } from "@/lib/utils";
import { Filter, GitMerge, Plus, Split, X } from "lucide-react";

interface DraftState {
  title: string;
  objective: string;
  workCategory: WorkCategory;
  sourceIds: string;
}

const EMPTY_DRAFT: DraftState = {
  title: "",
  objective: "",
  workCategory: "backend-api",
  sourceIds: "",
};

const SELECT_CLASS =
  "mt-1 h-8 w-full border border-hairline bg-transparent px-2 font-mono-data text-[11px]";

function toInput(draft: DraftState): NodeDraftInput {
  return {
    title: draft.title.trim(),
    objective: draft.objective.trim(),
    workCategory: draft.workCategory,
    sourceIds: draft.sourceIds
      .split(/[,\s]+/)
      .map((entry) => entry.trim())
      .filter(Boolean),
  };
}

function DraftFields({
  draft,
  onChange,
  idPrefix,
}: {
  draft: DraftState;
  onChange: (next: DraftState) => void;
  idPrefix: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <label className="block text-[11px] sm:col-span-1">
        <span className="font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase">
          Title
        </span>
        <Input
          id={`${idPrefix}-title`}
          value={draft.title}
          onChange={(event) =>
            onChange({ ...draft, title: event.target.value })
          }
          className="mt-1 h-8 text-[12px]"
          placeholder="Confirm warehouse event coverage"
        />
      </label>
      <label className="block text-[11px]">
        <span className="font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase">
          Work category
        </span>
        <select
          id={`${idPrefix}-category`}
          className={SELECT_CLASS}
          value={draft.workCategory}
          onChange={(event) =>
            onChange({
              ...draft,
              workCategory: event.target.value as WorkCategory,
            })
          }
        >
          {WORK_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-[11px]">
        <span className="font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase">
          Source IDs
        </span>
        <Input
          id={`${idPrefix}-sources`}
          value={draft.sourceIds}
          onChange={(event) =>
            onChange({ ...draft, sourceIds: event.target.value })
          }
          className="mt-1 h-8 font-mono-data text-[12px]"
          placeholder="GAP_01, Q_02"
        />
      </label>
      <label className="block text-[11px] sm:col-span-3">
        <span className="font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase">
          Objective
        </span>
        <Textarea
          id={`${idPrefix}-objective`}
          rows={2}
          value={draft.objective}
          onChange={(event) =>
            onChange({ ...draft, objective: event.target.value })
          }
          className="mt-1 text-[12px]"
          placeholder="What must be true when this work is finished?"
        />
      </label>
    </div>
  );
}

export interface DecompositionViewProps {
  entry: DealEntry;
  actions: Actions;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  busy: boolean;
  onOverride: (node: ExecutionNode) => void;
}

export function DecompositionView({
  entry,
  actions,
  selectedNodeId,
  onSelectNode,
  busy,
  onOverride,
}: DecompositionViewProps) {
  const [query, setQuery] = useState("");
  const [model, setModel] = useState("all");
  const [category, setCategory] = useState("all");
  const [readiness, setReadiness] = useState("all");
  const [provenance, setProvenance] = useState("all");
  const [rationale, setRationale] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [splitTarget, setSplitTarget] = useState<string | null>(null);
  const [mergeIds, setMergeIds] = useState<string[]>([]);
  const [draft, setDraft] = useState<DraftState>(EMPTY_DRAFT);
  const [splitDrafts, setSplitDrafts] = useState<DraftState[]>([
    { ...EMPTY_DRAFT, title: "Part A" },
    { ...EMPTY_DRAFT, title: "Part B" },
  ]);

  const nodes = entry.compiled.graph.nodes;

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return nodes.filter((node) => {
      if (model !== "all" && node.operatingModel.primary !== model)
        return false;
      if (category !== "all" && node.workCategory !== category) return false;
      if (readiness !== "all" && node.readiness !== readiness) return false;
      if (provenance !== "all" && node.provenance !== provenance) return false;
      if (needle.length === 0) return true;
      return (
        node.title.toLowerCase().includes(needle) ||
        node.id.toLowerCase().includes(needle) ||
        node.objective.toLowerCase().includes(needle) ||
        node.sourceIds.some((sourceId) =>
          sourceId.toLowerCase().includes(needle),
        )
      );
    });
  }, [nodes, query, model, category, readiness, provenance]);

  const counts = useMemo(() => {
    const byModel = {
      "flexible-talent": 0,
      challenge: 0,
      "private-pod": 0,
    } as Record<string, number>;
    for (const node of nodes) byModel[node.operatingModel.primary] += 1;
    return {
      total: nodes.length,
      byModel,
      blocked: nodes.filter((node) => node.readiness === "blocked").length,
      review: nodes.filter((node) => node.readiness === "review-required")
        .length,
      ready: nodes.filter((node) => node.readiness === "ready").length,
      unsupported: nodes.filter((node) => node.sourceIds.length === 0).length,
    };
  }, [nodes]);

  const selected = selectedNodeId
    ? (nodes.find((node) => node.id === selectedNodeId) ?? null)
    : null;
  const splitNodeItem = splitTarget
    ? (nodes.find((node) => node.id === splitTarget) ?? null)
    : null;
  const canAct = rationale.trim().length >= 8 && !busy;

  return (
    <div className="space-y-8">
      <SectionTitle
        index="FR3"
        title="Delivery node inventory"
        detail={
          <>
            {counts.total} nodes · {counts.byModel["flexible-talent"]} flexible
            talent · {counts.byModel.challenge} challenge ·{" "}
            {counts.byModel["private-pod"]} private pod · {counts.ready} ready ·{" "}
            {counts.review} review required · {counts.blocked} blocked ·{" "}
            {counts.unsupported} unsupported
          </>
        }
        right={
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setShowAdd((open) => !open)}
            >
              {showAdd ? <X className="size-3" /> : <Plus className="size-3" />}{" "}
              Add node
            </Button>
          </div>
        }
      />

      {/* ------------------------------------------------------------- filters */}
      <div className="grid gap-3 border border-hairline p-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="block text-[11px] lg:col-span-1">
          <span className="font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase">
            <Filter className="mr-1 inline size-3" /> Search
          </span>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mt-1 h-8 text-[12px]"
            placeholder="id, title, source"
          />
        </label>
        <label className="block text-[11px]">
          <span className="font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase">
            Operating model
          </span>
          <select
            className={SELECT_CLASS}
            value={model}
            onChange={(event) => setModel(event.target.value)}
          >
            <option value="all">all</option>
            {["flexible-talent", "challenge", "private-pod"].map((value) => (
              <option key={value} value={value}>
                {MODEL_NAME[value]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[11px]">
          <span className="font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase">
            Work category
          </span>
          <select
            className={SELECT_CLASS}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">all</option>
            {WORK_CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-[11px]">
          <span className="font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase">
            Readiness
          </span>
          <select
            className={SELECT_CLASS}
            value={readiness}
            onChange={(event) => setReadiness(event.target.value)}
          >
            <option value="all">all</option>
            <option value="ready">ready</option>
            <option value="review-required">review required</option>
            <option value="blocked">blocked</option>
          </select>
        </label>
        <label className="block text-[11px]">
          <span className="font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase">
            Provenance
          </span>
          <select
            className={SELECT_CLASS}
            value={provenance}
            onChange={(event) => setProvenance(event.target.value)}
          >
            <option value="all">all</option>
            <option value="imported">imported</option>
            <option value="deterministic">deterministic</option>
            <option value="ai-recommended">ai-recommended</option>
            <option value="ai-inferred">ai-inferred</option>
            <option value="user-created">user-created</option>
            <option value="user-approved">user-approved</option>
          </select>
        </label>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="decomposition-rationale"
          className="label text-muted-foreground"
        >
          Rationale (required for add, split, merge and every operator action)
        </Label>
        <Textarea
          id="decomposition-rationale"
          rows={2}
          value={rationale}
          onChange={(event) => setRationale(event.target.value)}
          className="text-[13px]"
          placeholder="Q_02 has not been answered, so this work cannot be sequenced yet."
        />
      </div>

      {/* ----------------------------------------------------------- add node */}
      {showAdd && (
        <section className="space-y-3 border border-hairline p-4">
          <SectionTitle
            title="Add a delivery node"
            detail="Recorded as user-created work, unsupported until a source is attached."
          />
          <DraftFields draft={draft} onChange={setDraft} idPrefix="add-node" />
          <Button
            type="button"
            size="sm"
            disabled={!canAct || draft.title.trim().length === 0}
            onClick={() => {
              actions.addNode(toInput(draft), rationale.trim());
              setDraft(EMPTY_DRAFT);
              setShowAdd(false);
            }}
          >
            Create node
          </Button>
        </section>
      )}

      {/* -------------------------------------------------------------- table */}
      <div className="overflow-x-auto border border-hairline">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <caption className="sr-only">
            Delivery nodes generated from the imported package
          </caption>
          <thead>
            <tr className="border-b border-rule-strong">
              {[
                "",
                "Node",
                "Category",
                "Model",
                "Confidence",
                "Readiness",
                "Effort",
                "Sources",
                "",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-3 py-2 font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((node) => (
              <tr
                key={node.id}
                className={cn(
                  "border-b border-hairline/60 transition-colors last:border-b-0 hover:bg-foreground/[0.03]",
                  selectedNodeId === node.id && "bg-foreground/[0.05]",
                )}
              >
                <td className="px-2 py-2 align-top">
                  <input
                    type="checkbox"
                    aria-label={`Select ${node.id} for a merge`}
                    checked={mergeIds.includes(node.id)}
                    onChange={(event) =>
                      setMergeIds((previous) =>
                        event.target.checked
                          ? [...previous, node.id]
                          : previous.filter((id) => id !== node.id),
                      )
                    }
                  />
                </td>
                <td className="max-w-88 px-3 py-2 align-top">
                  <button
                    type="button"
                    className="text-left"
                    onClick={() => onSelectNode(node.id)}
                  >
                    <span className="font-mono-data text-[11px] text-muted-foreground">
                      {node.id}
                    </span>
                    <span className="mt-0.5 block text-[12.5px] leading-5">
                      {node.title}
                    </span>
                  </button>
                </td>
                <td className="px-3 py-2 align-top font-mono-data text-[11px] text-muted-foreground">
                  {node.workCategory}
                </td>
                <td className="px-3 py-2 align-top">
                  <ModelChip
                    model={node.operatingModel.primary}
                    confidence={node.operatingModel.confidence}
                  />
                  {node.operatingModel.overridden && (
                    <span className="ml-1 font-mono-data text-[10px] text-signal">
                      override
                    </span>
                  )}
                </td>
                <td
                  className={cn(
                    "px-3 py-2 align-top font-mono-data text-[11px]",
                    MODEL_TEXT[node.operatingModel.primary],
                  )}
                >
                  {node.operatingModel.confidence} ·{" "}
                  {node.operatingModel.margin}pt
                </td>
                <td className="px-3 py-2 align-top">
                  <ReadinessChip readiness={node.readiness} />
                </td>
                <td className="px-3 py-2 align-top font-mono-data text-[11px] tabular-nums">
                  {node.effort.minimum === null && node.effort.maximum === null
                    ? "needs input"
                    : `${node.effort.minimum ?? "?"}–${node.effort.maximum ?? "?"}`}
                </td>
                <td className="px-3 py-2 align-top">
                  {node.sourceIds.length === 0 ? (
                    <span className="font-mono-data text-[10px] text-blocked">
                      none
                    </span>
                  ) : (
                    <span
                      className="font-mono-data text-[11px] text-muted-foreground"
                      title={node.sourceIds.join(", ")}
                    >
                      {node.sourceIds.length} ·{" "}
                      {node.sourceIds.slice(0, 2).join(", ")}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 align-top">
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => setSplitTarget(node.id)}
                      title="Split this node"
                    >
                      <Split className="size-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="px-3 py-10 text-center font-mono-data text-[11px] text-muted-foreground uppercase"
                >
                  No node matches these filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="font-mono-data text-[11px] leading-5 text-muted-foreground">
        Showing {filtered.length} of {nodes.length} nodes. Select rows to merge
        them.
        {mergeIds.length > 0 && (
          <span className="ml-2 text-foreground">
            {mergeIds.length} selected —{" "}
            <button
              type="button"
              className="underline decoration-hairline underline-offset-4"
              onClick={() => setMergeIds([])}
            >
              clear
            </button>
          </span>
        )}
      </p>

      {/* -------------------------------------------------------------- merge */}
      {mergeIds.length > 0 && (
        <section className="space-y-3 border border-hairline p-4">
          <SectionTitle
            title="Merge selected nodes"
            detail={`Merging ${mergeIds.join(", ")}. The merged node replaces them and inherits their dependencies.`}
          />
          <DraftFields
            draft={draft}
            onChange={setDraft}
            idPrefix="merge-node"
          />
          <Button
            type="button"
            size="sm"
            disabled={!canAct || draft.title.trim().length === 0}
            onClick={() => {
              actions.mergeNodes(mergeIds, toInput(draft), rationale.trim());
              setMergeIds([]);
              setDraft(EMPTY_DRAFT);
            }}
          >
            <GitMerge className="size-3" /> Merge {mergeIds.length} nodes
          </Button>
        </section>
      )}

      {/* -------------------------------------------------------------- split */}
      {splitNodeItem && (
        <section className="space-y-3 border border-hairline p-4">
          <SectionTitle
            title={`Split ${splitNodeItem.id}`}
            index="FR3"
            detail="Each part is created as its own node and inherits a sequencing edge from the original."
            right={
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setSplitTarget(null)}
              >
                <X className="size-3" /> Cancel
              </Button>
            }
          />
          {splitDrafts.map((part, index) => (
            <div
              key={index}
              className="space-y-2 border-t border-hairline pt-3 first:border-t-0 first:pt-0"
            >
              <div className="font-mono-data text-[10px] tracking-widest text-muted-foreground uppercase">
                Part {index + 1}
              </div>
              <DraftFields
                draft={part}
                onChange={(next) =>
                  setSplitDrafts((previous) =>
                    previous.map((item, i) => (i === index ? next : item)),
                  )
                }
                idPrefix={`split-${index}`}
              />
            </div>
          ))}
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                setSplitDrafts((previous) => [...previous, { ...EMPTY_DRAFT }])
              }
            >
              <Plus className="size-3" /> Add part
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={
                !canAct ||
                splitDrafts.every((part) => part.title.trim().length === 0)
              }
              onClick={() => {
                const parts = splitDrafts
                  .filter((part) => part.title.trim().length > 0)
                  .map((part) => toInput(part));
                if (parts.length > 0)
                  actions.splitNode(splitNodeItem.id, parts, rationale.trim());
                setSplitTarget(null);
                setSplitDrafts([
                  { ...EMPTY_DRAFT, title: "Part A" },
                  { ...EMPTY_DRAFT, title: "Part B" },
                ]);
              }}
            >
              <Split className="size-3" /> Create parts
            </Button>
          </div>
        </section>
      )}

      {/* ----------------------------------------------------- node inspector */}
      <div className="flex flex-wrap gap-2">
        {(["flexible-talent", "challenge", "private-pod"] as const).map(
          (value) => (
            <span
              key={value}
              className={cn("font-mono-data text-[11px]", MODEL_TEXT[value])}
            >
              {MODEL_MARK[value]} {MODEL_NAME[value]}: {counts.byModel[value]}
            </span>
          ),
        )}
      </div>

      {selected && (
        <NodeDetail
          entry={entry}
          node={selected}
          actions={actions}
          busy={busy}
          onClose={() => onSelectNode(null)}
          onOverride={onOverride}
          onSplit={(node) => {
            setSplitTarget(node.id);
            onSelectNode(null);
          }}
          onSelectNode={onSelectNode}
        />
      )}
    </div>
  );
}
