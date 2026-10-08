/**
 * Node detail drawer.
 *
 * Everything the specification requires a reviewer to be able to inspect for a
 * single delivery node: fields, source evidence, the weighted classification with
 * its rationale and score table, package completeness gaps, labelled AI
 * suggestions awaiting a decision, dependencies, and the operator actions (edit,
 * override, approve, reject, block, review-required, remove).
 *
 * It is presentation only. Each action is a callback the shell turns into an
 * append-only decision.
 */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EdgeType, ExecutionNode, WorkCategory } from "@deal-to-challenge/engine";
import { WORK_CATEGORIES, EDGE_TYPES } from "@deal-to-challenge/engine";
import { useMemo, useState } from "react";
import {
  Bullets,
  Chip,
  Field,
  MODEL_MARK,
  MODEL_NAME,
  MODEL_TEXT,
  ModelChip,
  ProvenanceChip,
  ReadinessChip,
  SectionTitle,
} from "./bits";
import type { Actions, DealEntry, NodeStatus } from "./types";
import { cn } from "@/lib/utils";
import { FileText, Pencil, Split, Trash2 } from "lucide-react";

const STATUS_ACTIONS: { status: NodeStatus; label: string; hint: string }[] = [
  { status: "approved", label: "Approve", hint: "Human review complete; clears the approval blocker." },
  { status: "review-required", label: "Review required", hint: "Keep the node visible but not handoff-ready." },
  { status: "blocked", label: "Block", hint: "The node cannot start until a blocker is resolved." },
  { status: "rejected", label: "Reject", hint: "Marks the node unsupported and blocked." },
];

function joinList(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
}

export interface NodeDetailProps {
  entry: DealEntry;
  node: ExecutionNode | null;
  actions: Actions;
  busy: boolean;
  onClose: () => void;
  onOverride: (node: ExecutionNode) => void;
  onSplit: (node: ExecutionNode) => void;
  onSelectNode: (nodeId: string | null) => void;
}

export function NodeDetail({
  entry,
  node,
  actions,
  busy,
  onClose,
  onOverride,
  onSplit,
  onSelectNode,
}: NodeDetailProps) {
  const [rationale, setRationale] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    scope: "",
    workCategory: "backend-api" as WorkCategory,
    minimum: "",
    maximum: "",
    unit: "person-days",
    acceptance: "",
    sourceIds: "",
  });
  const [edgeDraft, setEdgeDraft] = useState<{ target: string; type: EdgeType; blocking: boolean }>({
    target: "",
    type: "sequencing",
    blocking: true,
  });

  const edges = useMemo(() => {
    if (!node) return { out: [], in: [] };
    const all = entry.compiled.graph.edges;
    return {
      out: all.filter((edge) => edge.source === node.id),
      in: all.filter((edge) => edge.target === node.id),
    };
  }, [entry, node]);

  const otherNodes = useMemo(
    () => entry.compiled.graph.nodes.filter((candidate) => candidate.id !== node?.id),
    [entry, node],
  );

  if (!node) return null;

  const canAct = rationale.trim().length >= 8 && !busy;
  const packageForNode = entry.compiled.packages.find((pkg) => pkg.nodeId === node.id) ?? null;

  const startEditing = () => {
    setDraft({
      title: node.title,
      scope: node.scope,
      workCategory: node.workCategory,
      minimum: node.effort.minimum === null ? "" : String(node.effort.minimum),
      maximum: node.effort.maximum === null ? "" : String(node.effort.maximum),
      unit: node.effort.unit ?? "person-days",
      acceptance: node.acceptanceConditions.join("\n"),
      sourceIds: node.sourceIds.join(", "),
    });
    setEditing(true);
  };

  const applyEdits = () => {
    const reason = rationale.trim() || "Operator edit";
    if (draft.title !== node.title) actions.edit(node.id, "title", draft.title, reason);
    if (draft.scope !== node.scope) actions.edit(node.id, "scope", draft.scope, reason);
    if (draft.workCategory !== node.workCategory)
      actions.edit(node.id, "workCategory", draft.workCategory, reason);
    const minimum = draft.minimum === "" ? null : Number(draft.minimum);
    const maximum = draft.maximum === "" ? null : Number(draft.maximum);
    if (minimum !== node.effort.minimum || maximum !== node.effort.maximum || draft.unit !== node.effort.unit) {
      actions.edit(node.id, "effort", { minimum, maximum, unit: draft.unit }, reason);
    }
    const acceptance = joinList(draft.acceptance);
    if (acceptance.join("|") !== node.acceptanceConditions.join("|")) {
      actions.edit(node.id, "acceptanceConditions", acceptance, reason);
    }
    const sources = joinList(draft.sourceIds);
    if (sources.join("|") !== node.sourceIds.join("|")) {
      actions.edit(node.id, "sourceIds", sources, reason);
    }
    setEditing(false);
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[92vh] w-full overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="border-rule-strong text-foreground">{node.id}</Chip>
            <Chip tone="border-hairline text-muted-foreground">{node.kind}</Chip>
            <Chip tone="border-hairline text-muted-foreground">{node.workCategory}</Chip>
            <ModelChip model={node.operatingModel.primary} confidence={node.operatingModel.confidence} />
            <ReadinessChip readiness={node.readiness} />
            <ProvenanceChip provenance={node.provenance} />
            {node.operatingModel.overridden && (
              <Chip tone="border-signal/50 text-signal">Override recorded</Chip>
            )}
            {node.blockingStatus !== "none" && (
              <Chip tone="border-blocked/50 text-blocked">{node.blockingStatus}</Chip>
            )}
          </div>
          <DialogTitle className="mt-3 text-left text-[17px] leading-6 tracking-[-0.01em]">
            {node.title}
          </DialogTitle>
          <DialogDescription className="text-left text-[12.5px] leading-6">
            {node.objective}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 px-4 pb-8">
          {/* ---------------------------------------------------- classification */}
          <section className="space-y-4">
            <SectionTitle
              title="Operating-model classification"
              index="FR4"
              detail={
                <>
                  Weighted deterministic score over {node.operatingModel.scores[0]?.contributions.length ?? 0}{" "}
                  work features. Confidence is derived from the score margin and input completeness.
                </>
              }
              right={
                <Button type="button" size="sm" variant="outline" onClick={() => onOverride(node)}>
                  Override model
                </Button>
              }
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Primary">
                <span className={cn("font-mono-data text-[12px]", MODEL_TEXT[node.operatingModel.primary])}>
                  {MODEL_NAME[node.operatingModel.primary]}
                </span>
              </Field>
              <Field label="Alternatives">
                {node.operatingModel.alternatives.length === 0
                  ? "none"
                  : node.operatingModel.alternatives
                      .map((model) => `${MODEL_MARK[model]} ${MODEL_NAME[model]}`)
                      .join(" · ")}
              </Field>
              <Field label="Confidence · margin">
                {node.operatingModel.confidence} · {node.operatingModel.margin} pts
              </Field>
            </div>

            <Bullets items={node.operatingModel.rationale} empty="No rationale recorded." />

            <div className="overflow-x-auto border border-hairline">
              <table className="w-full min-w-[420px] border-collapse text-left">
                <caption className="sr-only">Weighted model scores</caption>
                <thead>
                  <tr className="border-b border-hairline">
                    {["Model", "Score", "Rank"].map((header) => (
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
                  {node.operatingModel.scores.map((score, index) => (
                    <tr key={score.model} className="border-b border-hairline/60 last:border-b-0">
                      <td className={cn("px-3 py-2 font-mono-data text-[11px]", MODEL_TEXT[score.model])}>
                        {MODEL_NAME[score.model]}
                      </td>
                      <td className="px-3 py-2 font-mono-data text-[11px] tabular-nums">
                        {score.score.toFixed(1)}
                      </td>
                      <td className="px-3 py-2 font-mono-data text-[11px] text-muted-foreground">
                        {index === 0 ? "recommended" : `alternative ${index}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {node.operatingModel.splitRecommended && node.operatingModel.splitReason && (
              <p className="border-l-2 border-review/60 pl-3 text-[12.5px] leading-6 text-muted-foreground">
                {node.operatingModel.splitReason}
              </p>
            )}

            {node.operatingModel.overrideHistory.length > 0 && (
              <div className="space-y-2">
                <div className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  Override history
                </div>
                <ul className="space-y-1.5">
                  {node.operatingModel.overrideHistory.map((entryItem, index) => (
                    <li key={`${index}-${entryItem.at}`} className="text-[12px] leading-6">
                      <span className="font-mono-data text-[11px] text-muted-foreground">
                        {MODEL_NAME[entryItem.from]} → {MODEL_NAME[entryItem.to]}:
                      </span>{" "}
                      {entryItem.rationale}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* ------------------------------------------------- what is missing */}
          <section className="space-y-3">
            <SectionTitle
              title="Readiness and package completeness"
              index="FR4"
              detail="A node cannot be ready while a required field for its operating model is missing."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Readiness blockers">
                {node.readinessBlockers.length === 0 ? (
                  <span className="text-ready">none</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {node.readinessBlockers.map((blocker) => (
                      <Chip key={blocker} tone="border-blocked/50 text-blocked">
                        {blocker.replace(/-/g, " ")}
                      </Chip>
                    ))}
                  </div>
                )}
              </Field>
              <Field label="Missing model package fields">
                {node.modelFieldsMissing.length === 0 ? (
                  <span className="text-ready">complete</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {node.modelFieldsMissing.map((fieldName) => (
                      <Chip key={fieldName} tone="border-review/50 text-review">
                        {fieldName}
                      </Chip>
                    ))}
                  </div>
                )}
              </Field>
            </div>
          </section>

          {/* --------------------------------------------------------- evidence */}
          <section className="space-y-3">
            <SectionTitle
              title="Source evidence"
              index="FR1"
              detail="Every node is grounded in imported records or an explicit operator decision."
            />
            {node.sourceRefs.length === 0 ? (
              <p className="border-l-2 border-blocked/60 pl-3 text-[12.5px] leading-6 text-blocked">
                No imported record is attached to this node. It is unsupported until an operator adds one.
              </p>
            ) : (
              <ul className="space-y-3">
                {node.sourceRefs.map((ref) => (
                  <li key={`${ref.id}-${ref.path}`} className="border border-hairline px-3 py-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="font-mono-data text-[11px] text-signal underline decoration-hairline underline-offset-4"
                        onClick={() => onSelectNode(node.id)}
                        title="Show this node in the decomposition workspace"
                      >
                        {ref.id}
                      </button>
                      <span className="font-mono-data text-[10px] tracking-[0.08em] text-muted-foreground uppercase">
                        {ref.kind} · {ref.path}
                      </span>
                      {ref.quoteVerified === false && (
                        <Chip tone="border-blocked/50 text-blocked">quote not found</Chip>
                      )}
                    </div>
                    <p className="mt-1.5 text-[12.5px] leading-6">{ref.title}</p>
                    {ref.quote && (
                      <blockquote className="mt-2 border-l-2 border-hairline pl-3 text-[12px] leading-6 text-muted-foreground">
                        “{ref.quote}”
                      </blockquote>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* --------------------------------------------------------- content */}
          <section className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  Inputs
                </span>
                <ProvenanceChip provenance={node.fieldProvenance.inputs} />
              </div>
              <Bullets items={node.inputs} empty="No inputs recorded." />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  Deliverables
                </span>
                <ProvenanceChip provenance={node.fieldProvenance.deliverables} />
              </div>
              <Bullets items={node.deliverables} empty="No deliverables recorded." />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                <span className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  Acceptance conditions
                </span>
                <ProvenanceChip provenance={node.fieldProvenance.acceptanceConditions} />
              </div>
              <Bullets
                items={node.acceptanceConditions}
                empty="No acceptance condition is available; this node cannot be handed off as ready."
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  Risks
                </span>
                <ProvenanceChip provenance={node.fieldProvenance.risks} />
              </div>
              <Bullets items={node.risks} empty="No risks recorded." />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  Assumptions
                </span>
                <ProvenanceChip provenance={node.fieldProvenance.assumptions} />
              </div>
              <Bullets items={node.assumptions} empty="No assumptions recorded." />
            </div>
          </section>

          {/* --------------------------------------------------------- effort */}
          <section className="grid gap-3 sm:grid-cols-4">
            <Field label="Complexity">{node.complexity}</Field>
            <Field label="Effort (min)">
              {node.effort.minimum ?? <span className="text-balance text-review">needs input</span>}
            </Field>
            <Field label="Effort (max)">
              {node.effort.maximum ?? <span className="text-review">needs input</span>}
            </Field>
            <Field label="Unit">{node.effort.unit ?? "—"}</Field>
            <div className="sm:col-span-4">
              <Field label="Effort basis">
                <span className="text-muted-foreground">{node.effort.basis}</span>{" "}
                <ProvenanceChip provenance={node.effort.provenance} />
              </Field>
            </div>
          </section>

          {/* --------------------------------------------------- dependencies */}
          <section className="space-y-3">
            <SectionTitle
              title="Dependencies"
              index="FR5"
              detail="Edges carry a type, a rationale and whether they block the successor."
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <div className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  Upstream · {edges.in.length}
                </div>
                <ul className="mt-2 space-y-1.5">
                  {edges.in.map((edge) => (
                    <li key={edge.id} className="flex items-center justify-between gap-2 text-[12px]">
                      <span className="truncate">
                        <span className="font-mono-data text-[11px] text-muted-foreground">{edge.source}</span>{" "}
                        → this · {edge.type}
                        {edge.blocking && <span className="text-blocked"> · blocking</span>}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={!canAct}
                        onClick={() => actions.removeEdge(`${edge.source}->${edge.target}`, rationale.trim())}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </li>
                  ))}
                  {edges.in.length === 0 && (
                    <li className="font-mono-data text-[11px] text-muted-foreground/70">none</li>
                  )}
                </ul>
              </div>
              <div>
                <div className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  Downstream · {edges.out.length}
                </div>
                <ul className="mt-2 space-y-1.5">
                  {edges.out.map((edge) => (
                    <li key={edge.id} className="flex items-center justify-between gap-2 text-[12px]">
                      <span className="truncate">
                        this →{" "}
                        <span className="font-mono-data text-[11px] text-muted-foreground">{edge.target}</span>{" "}
                        · {edge.type}
                        {edge.blocking && <span className="text-blocked"> · blocking</span>}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={!canAct}
                        onClick={() => actions.removeEdge(`${edge.source}->${edge.target}`, rationale.trim())}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </li>
                  ))}
                  {edges.out.length === 0 && (
                    <li className="font-mono-data text-[11px] text-muted-foreground/70">none</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="grid gap-2 border border-hairline p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,11rem)_auto_auto]">
              <label className="min-w-0 text-[11px]">
                <span className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  Target node
                </span>
                <select
                  className="mt-1 h-8 w-full border border-hairline bg-transparent px-2 font-mono-data text-[11px]"
                  value={edgeDraft.target}
                  onChange={(event) => setEdgeDraft({ ...edgeDraft, target: event.target.value })}
                >
                  <option value="">select a node…</option>
                  {otherNodes.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.id} — {candidate.title.slice(0, 48)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="min-w-0 text-[11px]">
                <span className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                  Type
                </span>
                <select
                  className="mt-1 h-8 w-full border border-hairline bg-transparent px-2 font-mono-data text-[11px]"
                  value={edgeDraft.type}
                  onChange={(event) => setEdgeDraft({ ...edgeDraft, type: event.target.value as EdgeType })}
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
                  onChange={(event) => setEdgeDraft({ ...edgeDraft, blocking: event.target.checked })}
                />
                blocking
              </label>
              <div className="flex items-end pb-1.5">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={!edgeDraft.target || !canAct || edgeDraft.target === node.id}
                  onClick={() => {
                    actions.addEdge(
                      node.id,
                      edgeDraft.target,
                      edgeDraft.type,
                      edgeDraft.blocking,
                      rationale.trim(),
                    );
                    setEdgeDraft({ ...edgeDraft, target: "" });
                  }}
                >
                  Add dependency
                </Button>
              </div>
              <p className="font-mono-data text-[10px] text-muted-foreground sm:col-span-4">
                A rationale (8+ characters) is required and is recorded as a user decision.
              </p>
            </div>
          </section>

          {/* ----------------------------------------------------- AI proposals */}
          {node.aiSuggestions.length > 0 && (
            <section className="space-y-3">
              <SectionTitle
                title="AI suggestions"
                index="AI"
                detail="Labelled recommendations. Nothing is applied until an operator accepts it."
              />
              <ul className="space-y-2">
                {node.aiSuggestions.map((suggestion) => (
                  <li key={suggestion.id} className="border border-hairline px-3 py-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Chip tone="border-hairline text-model-challenge">{suggestion.field}</Chip>
                      <ProvenanceChip provenance={suggestion.provenance} />
                      <Chip tone="border-hairline text-muted-foreground">
                        {suggestion.provider}/{suggestion.mode} · {suggestion.promptVersion}
                      </Chip>
                      <Chip tone="border-hairline text-muted-foreground">{suggestion.status}</Chip>
                    </div>
                    <p className="mt-2 text-[12.5px] leading-6">{suggestion.value}</p>
                    <p className="mt-1 text-[11.5px] leading-5 text-muted-foreground">
                      {suggestion.rationale}
                    </p>
                    {suggestion.status === "proposed" && (
                      <div className="mt-2 flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          disabled={!canAct}
                          onClick={() =>
                            actions.decideSuggestion(node.id, suggestion.id, true, rationale.trim())
                          }
                        >
                          Accept
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={!canAct}
                          onClick={() =>
                            actions.decideSuggestion(node.id, suggestion.id, false, rationale.trim())
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {packageForNode && (
            <section className="space-y-2">
              <SectionTitle
                title="Model package"
                index="FR4"
                detail={`${MODEL_NAME[packageForNode.model]} package · handoff ${packageForNode.complete ? "ready" : "not ready"}`}
              />
              <p className="font-mono-data text-[11px] text-muted-foreground">
                {packageForNode.missingFields.length === 0
                  ? "All required fields for this model are present."
                  : `Missing: ${packageForNode.missingFields.join(", ")}`}
              </p>
              <Bullets items={packageForNode.readinessNotes} empty="No readiness note recorded." />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => actions.exportPackage(node.id, "json")}
                >
                  <FileText className="size-3" /> Package JSON
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => actions.exportPackage(node.id, "markdown")}
                >
                  <FileText className="size-3" /> Package Markdown
                </Button>
              </div>
            </section>
          )}

          {/* --------------------------------------------------- edit + actions */}
          <section className="space-y-4">
            <SectionTitle
              title="Operator actions"
              index="FR6"
              detail="Every change requires a rationale and is appended to the decision log, then the graph is recompiled and the impact reported."
            />
            <div className="space-y-2">
              <Label htmlFor="node-rationale" className="label text-muted-foreground">
                Rationale for the next action
              </Label>
              <Textarea
                id="node-rationale"
                rows={2}
                value={rationale}
                onChange={(event) => setRationale(event.target.value)}
                placeholder="Why is this change correct?"
                className="text-[13px]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {STATUS_ACTIONS.map((action) => (
                <Button
                  key={action.status}
                  type="button"
                  size="sm"
                  variant={action.status === "approved" ? "default" : "outline"}
                  title={action.hint}
                  disabled={!canAct}
                  onClick={() => actions.setStatus(node.id, action.status, rationale.trim())}
                >
                  {action.label}
                </Button>
              ))}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={editing ? () => setEditing(false) : startEditing}
              >
                <Pencil className="size-3" /> {editing ? "Cancel edit" : "Edit fields"}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => onSplit(node)}>
                <Split className="size-3" /> Split
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!canAct}
                onClick={() => actions.removeNode(node.id, rationale.trim())}
              >
                <Trash2 className="size-3" /> Remove node
              </Button>
            </div>

            {editing && (
              <div className="space-y-3 border border-hairline p-3">
                <label className="block text-[11px]">
                  <span className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                    Title
                  </span>
                  <Input
                    value={draft.title}
                    onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                    className="mt-1 h-8 text-[12px]"
                  />
                </label>
                <label className="block text-[11px]">
                  <span className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                    Scope
                  </span>
                  <Textarea
                    rows={2}
                    value={draft.scope}
                    onChange={(event) => setDraft({ ...draft, scope: event.target.value })}
                    className="mt-1 text-[12px]"
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-4">
                  <label className="block text-[11px]">
                    <span className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                      Work category
                    </span>
                    <select
                      className="mt-1 h-8 w-full border border-hairline bg-transparent px-2 font-mono-data text-[11px]"
                      value={draft.workCategory}
                      onChange={(event) =>
                        setDraft({ ...draft, workCategory: event.target.value as WorkCategory })
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
                    <span className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                      Effort min
                    </span>
                    <Input
                      inputMode="numeric"
                      value={draft.minimum}
                      onChange={(event) => setDraft({ ...draft, minimum: event.target.value })}
                      className="mt-1 h-8 text-[12px]"
                    />
                  </label>
                  <label className="block text-[11px]">
                    <span className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                      Effort max
                    </span>
                    <Input
                      inputMode="numeric"
                      value={draft.maximum}
                      onChange={(event) => setDraft({ ...draft, maximum: event.target.value })}
                      className="mt-1 h-8 text-[12px]"
                    />
                  </label>
                  <label className="block text-[11px]">
                    <span className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                      Unit
                    </span>
                    <Input
                      value={draft.unit}
                      onChange={(event) => setDraft({ ...draft, unit: event.target.value })}
                      className="mt-1 h-8 text-[12px]"
                    />
                  </label>
                </div>
                <label className="block text-[11px]">
                  <span className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                    Acceptance conditions (one per line)
                  </span>
                  <Textarea
                    rows={3}
                    value={draft.acceptance}
                    onChange={(event) => setDraft({ ...draft, acceptance: event.target.value })}
                    className="mt-1 text-[12px]"
                  />
                </label>
                <label className="block text-[11px]">
                  <span className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                    Source IDs (comma separated)
                  </span>
                  <Input
                    value={draft.sourceIds}
                    onChange={(event) => setDraft({ ...draft, sourceIds: event.target.value })}
                    className="mt-1 h-8 font-mono-data text-[12px]"
                  />
                </label>
                <Button type="button" size="sm" disabled={busy} onClick={applyEdits}>
                  Apply edits
                </Button>
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
