import { DecompositionView } from "@/components/workspace/DecompositionView";
import { GraphView } from "@/components/workspace/GraphView";
import { ImportView } from "@/components/workspace/ImportView";
import { Inspector } from "@/components/workspace/Inspector";
import { MockBadge } from "@/components/workspace/MockBadge";
import { NodeDetail } from "@/components/workspace/NodeDetail";
import { OverrideDialog } from "@/components/workspace/OverrideDialog";
import { PackagesView } from "@/components/workspace/PackagesView";
import { PlanView } from "@/components/workspace/PlanView";
import { ValidationView } from "@/components/workspace/ValidationView";
import type { SelectionTarget } from "@/components/workspace/selection";
import {
  VIEW_IDS,
  VIEW_LABELS,
  clearSession,
  loadSession,
  saveSession,
  type PersistedSession,
  type ViewId,
} from "@/components/workspace/store";
import type {
  Actions,
  DealEntry,
  NodeDraftInput,
  NodeStatus,
} from "@/components/workspace/types";
import { downloadBlob, downloadText } from "@/components/workspace/types";
import { Button } from "@/components/ui/button";
import {
  appendDecision,
  buildModelPackage,
  compileDeal,
  createDecision,
  createLog,
  diffGraphs,
  looksLikeZip,
  packageToJson,
  packageToMarkdown,
  runImport,
  toBundleZip,
  toExecutionPlanMarkdown,
  toGraphJson,
  toQualityJson,
  unzipTextEntries,
} from "@deal-to-challenge/engine";
import type {
  DealDecision,
  DecisionLog,
  EditableField,
  EdgeType,
  ExecutionNode,
  FieldChange,
  ImportedPackage,
  OperatingModel,
} from "@deal-to-challenge/engine";
import {
  SAMPLE_PACKAGES,
  findSamplePackage,
  type SamplePackage,
} from "@deal-to-challenge/engine/samples";
import { cn } from "@/lib/utils";
import { ArrowLeft, Loader2, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";

const MATURITY_TEXT: Record<string, string> = {
  "review-required": "text-review",
  "discovery-required": "text-model-pod",
  blocked: "text-blocked",
  "execution-candidate": "text-ready",
};

interface PendingImport {
  fileName: string;
  text: string;
  source: DealEntry["source"];
  archivePath?: string;
}

function decode(bytes: Uint8Array): string {
  return new TextDecoder("utf-8").decode(bytes);
}

/** Accepted AI suggestions, read back off the decision log. */
function acceptedFrom(
  log: DecisionLog,
): Map<string, { field: string; value: string }> {
  const accepted = new Map<string, { field: string; value: string }>();
  for (const entry of log.entries) {
    const after = entry.after as {
      suggestionId?: string;
      suggestionField?: string;
      suggestionValue?: string;
    } | null;
    if (after?.suggestionId && after.suggestionField) {
      accepted.set(after.suggestionId, {
        field: after.suggestionField,
        value: after.suggestionValue ?? "",
      });
    }
  }
  return accepted;
}

export default function Workspace() {
  const [session] = useState<PersistedSession>(() => loadSession());
  const [entries, setEntries] = useState<DealEntry[]>([]);
  const [decisions, setDecisions] = useState<Record<string, DecisionLog>>(
    () => session.decisions,
  );
  const [activeFileName, setActiveFileName] = useState<string | null>(null);
  const [view, setView] = useState<ViewId>(() => session.view);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selection, setSelection] = useState<SelectionTarget>(null);
  const [overrideNode, setOverrideNode] = useState<ExecutionNode | null>(null);
  const [busy, setBusy] = useState(false);
  const bootedRef = useRef(false);
  const busyRef = useRef(false);
  const [searchParams] = useSearchParams();
  const requestedSlug = searchParams.get("sample") ?? "";

  const active =
    entries.find((entry) => entry.fileName === activeFileName) ??
    entries[0] ??
    null;

  useEffect(() => {
    saveSession({
      version: session.version,
      activeSlug: active?.fileName ?? null,
      view,
      decisions,
    });
  }, [active, view, decisions, session.version]);

  const withBusy = useCallback(
    async <T,>(task: () => Promise<T>): Promise<T | null> => {
      if (busyRef.current) return null;
      busyRef.current = true;
      setBusy(true);
      try {
        return await task();
      } catch (error) {
        toast("Operation failed", {
          description: error instanceof Error ? error.message : "Unknown error",
        });
        return null;
      } finally {
        busyRef.current = false;
        setBusy(false);
      }
    },
    [],
  );

  const buildEntry = useCallback(
    async (item: PendingImport): Promise<DealEntry> => {
      const imported: ImportedPackage = await runImport(
        item.fileName,
        item.text,
      );
      const dealId = imported.canonical.deal.id;
      const log = decisions[dealId] ?? createLog(dealId);
      const compiled = await compileDeal(imported, {
        decisions: log,
        acceptedSuggestions: acceptedFrom(log),
      });
      return {
        fileName: item.fileName,
        source: item.source,
        result: imported,
        compiled,
        impact: null,
        ...(item.archivePath ? { archivePath: item.archivePath } : {}),
      };
    },
    [decisions],
  );

  const importEntries = useCallback(
    async (pending: PendingImport[], focusFileName?: string) => {
      if (pending.length === 0) return;
      await withBusy(async () => {
        const built: DealEntry[] = [];
        for (const item of pending) built.push(await buildEntry(item));
        setEntries((previous) => {
          const map = new Map(previous.map((entry) => [entry.fileName, entry]));
          for (const entry of built) map.set(entry.fileName, entry);
          return Array.from(map.values());
        });
        const focus = focusFileName ?? built[0]?.fileName ?? null;
        setActiveFileName(focus);
        setSelectedNodeId(null);
        setSelection(null);
        const errors = built.reduce(
          (sum, entry) => sum + entry.result.report.counts.error,
          0,
        );
        toast(
          built.length === 1
            ? `${built[0]?.result.canonical.deal.title ?? "Package"} imported`
            : `${built.length} packages imported`,
          {
            description: `${errors} structural error(s) · maturity: ${built
              .map((entry) => entry.result.maturity.level.replace(/-/g, " "))
              .join(", ")}`,
          },
        );
      });
    },
    [buildEntry, withBusy],
  );

  const importFiles = useCallback(
    (files: File[]) => {
      void (async () => {
        if (files.length === 0) return;
        setBusy(true);
        const pending: PendingImport[] = [];
        const problems: string[] = [];
        for (const file of files) {
          try {
            const bytes = new Uint8Array(await file.arrayBuffer());
            if (/\.zip$/i.test(file.name) || looksLikeZip(bytes)) {
              const { files: extracted, skipped } =
                await unzipTextEntries(bytes);
              const packages = extracted.filter((entry) =>
                /\.json$/i.test(entry.baseName),
              );
              if (packages.length === 0)
                problems.push(
                  `${file.name}: no .json packages inside the archive`,
                );
              for (const entry of packages) {
                pending.push({
                  fileName: entry.baseName,
                  text: entry.text,
                  source: "archive",
                  archivePath: entry.name,
                });
              }
              if (skipped.length > 0)
                problems.push(
                  `${file.name}: skipped ${skipped.length} non-package entries`,
                );
            } else {
              pending.push({
                fileName: file.name,
                text: decode(bytes),
                source: "upload",
              });
            }
          } catch (error) {
            problems.push(
              `${file.name}: ${error instanceof Error ? error.message : "could not be read"}`,
            );
          }
        }
        setBusy(false);
        if (problems.length > 0)
          toast("Archive notes", { description: problems.join(" · ") });
        await importEntries(pending);
      })();
    },
    [importEntries],
  );

  const loadSample = useCallback(
    (deal: SamplePackage) => {
      void importEntries(
        [{ fileName: deal.fileName, text: deal.text, source: "sample" }],
        deal.fileName,
      );
    },
    [importEntries],
  );
  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    const requested =
      findSamplePackage(requestedSlug)?.fileName ??
      session.activeSlug ??
      SAMPLE_PACKAGES[0]?.fileName;
    void importEntries(
      SAMPLE_PACKAGES.map((deal) => ({
        fileName: deal.fileName,
        text: deal.text,
        source: "sample" as const,
      })),
      requested,
    );
  }, [importEntries, requestedSlug, session.activeSlug]);

  const commit = useCallback(
    async (
      mutate: (log: DecisionLog) => DecisionLog,
      changes: FieldChange[],
      message: string,
    ) => {
      if (!active) return;
      const current = active;
      await withBusy(async () => {
        const nextLog = mutate(current.compiled.decisions);
        const next = await compileDeal(current.result, {
          decisions: nextLog,
          acceptedSuggestions: acceptedFrom(nextLog),
        });
        const impact = diffGraphs({
          before: current.compiled.graph,
          after: next.graph,
          changes,
        });
        setEntries((previous) =>
          previous.map((entry) =>
            entry.fileName === current.fileName
              ? { ...entry, compiled: next, impact }
              : entry,
          ),
        );
        setDecisions((previous) => ({
          ...previous,
          [current.result.canonical.deal.id]: nextLog,
        }));
        toast(message, {
          description: `${impact.changed.length} field(s) changed · ${impact.affectedNodes.length} node(s) affected · ${impact.unaffectedNodes.length} preserved exactly`,
        });
      });
    },
    [active, withBusy],
  );

  const record = useCallback(
    (input: {
      type: DealDecision["type"];
      rationale: string;
      nodeIds?: string[];
      edgeIds?: string[];
      before?: unknown;
      after?: unknown;
      summary: string;
      changes?: FieldChange[];
      message: string;
    }) => {
      void commit(
        (log) =>
          appendDecision(
            log,
            createDecision({
              type: input.type,
              rationale: input.rationale,
              targetNodeIds: input.nodeIds ?? [],
              targetEdgeIds: input.edgeIds ?? [],
              before: input.before ?? null,
              after: input.after ?? null,
              summary: input.summary,
              at: new Date().toISOString(),
            }),
          ),
        input.changes ?? [],
        input.message,
      );
    },
    [commit],
  );

  const findNode = useCallback(
    (nodeId: string): ExecutionNode | null =>
      active?.compiled.graph.nodes.find((node) => node.id === nodeId) ?? null,
    [active],
  );

  const actions: Actions = {
    loadSample,
    importFiles,
    importText: (fileName, text) => {
      void importEntries([{ fileName, text, source: "upload" }], fileName);
    },

    edit: (nodeId, field: EditableField, value, rationale) => {
      const before = findNode(nodeId)?.[field] ?? null;
      record({
        type: "edit-node",
        rationale,
        nodeIds: [nodeId],
        before,
        after: { field, value },
        summary: `${nodeId}: ${field} updated`,
        changes: [{ nodeId, field, before, after: value }],
        message: `${nodeId} updated`,
      });
    },

    overrideModel: (nodeId, model: OperatingModel, rationale) => {
      const node = findNode(nodeId);
      record({
        type: "override-model",
        rationale,
        nodeIds: [nodeId],
        before: node?.operatingModel.primary ?? null,
        after: { model },
        summary: `${nodeId}: operating model overridden to ${model}`,
        changes: [
          {
            nodeId,
            field: "operatingModel",
            before: node?.operatingModel.primary ?? null,
            after: model,
          },
        ],
        message: `${nodeId} reclassified`,
      });
    },

    setStatus: (nodeId: string, status: NodeStatus, rationale) => {
      const type =
        status === "approved"
          ? "approve-node"
          : status === "rejected"
            ? "reject-node"
            : status === "blocked"
              ? "mark-blocked"
              : "mark-review-required";
      record({
        type,
        rationale,
        nodeIds: [nodeId],
        after: { status },
        summary: `${nodeId}: marked ${status.replace(/-/g, " ")}`,
        message: `${nodeId} marked ${status.replace(/-/g, " ")}`,
      });
    },

    decideSuggestion: (nodeId, suggestionId, accept, rationale) => {
      const node = findNode(nodeId);
      const suggestion = node?.aiSuggestions.find(
        (entry) => entry.id === suggestionId,
      );
      record({
        type: "resolve-blocker",
        rationale,
        nodeIds: [nodeId],
        before: suggestion?.status ?? null,
        after: {
          suggestionId,
          suggestionStatus: accept ? "accepted" : "rejected",
          suggestionField: suggestion?.field ?? "",
          suggestionValue: suggestion?.value ?? "",
        },
        summary: `${nodeId}: AI suggestion ${accept ? "accepted" : "rejected"} — ${suggestion?.field ?? "field"}`,
        changes: suggestion
          ? [
              {
                nodeId,
                field: "scope",
                before: node?.scope ?? null,
                after: node?.scope ?? null,
              },
            ]
          : [],
        message: `Suggestion ${accept ? "accepted" : "rejected"}`,
      });
    },

    addEdge: (source, target, type: EdgeType, blocking, rationale) => {
      record({
        type: "add-edge",
        rationale,
        nodeIds: [source, target],
        edgeIds: [`${source}->${target}`],
        after: {
          source,
          target,
          type,
          blocking,
          sourceIds: [],
          handoff: `${source} must deliver its output to ${target}`,
        },
        summary: `dependency added: ${source} → ${target} (${type})`,
        message: "Dependency recorded",
      });
    },

    removeEdge: (edgeId, rationale) => {
      record({
        type: "remove-edge",
        rationale,
        edgeIds: [edgeId],
        summary: `dependency removed: ${edgeId}`,
        message: "Dependency removed",
      });
    },

    addNode: (draft: NodeDraftInput, rationale) => {
      record({
        type: "add-node",
        rationale,
        after: { parts: [draft] },
        summary: `node added: ${draft.title}`,
        message: "Node created",
      });
    },

    splitNode: (nodeId, parts: NodeDraftInput[], rationale) => {
      record({
        type: "split-node",
        rationale,
        nodeIds: [nodeId],
        before: findNode(nodeId)?.title ?? null,
        after: { parts },
        summary: `${nodeId} split into ${parts.length} node(s)`,
        message: `Split into ${parts.length} node(s)`,
      });
    },

    mergeNodes: (nodeIds, draft: NodeDraftInput, rationale) => {
      record({
        type: "merge-nodes",
        rationale,
        nodeIds,
        before: nodeIds.map((id) => findNode(id)?.title ?? id),
        after: { parts: [draft] },
        summary: `${nodeIds.join(", ")} merged into ${draft.title}`,
        message: `${nodeIds.length} nodes merged`,
      });
    },

    removeNode: (nodeId, rationale) => {
      record({
        type: "remove-node",
        rationale,
        nodeIds: [nodeId],
        before: findNode(nodeId)?.title ?? null,
        summary: `${nodeId} removed`,
        message: `${nodeId} removed`,
      });
      setSelectedNodeId((current) => (current === nodeId ? null : current));
    },

    approveGraph: (rationale) => {
      record({
        type: "approve-graph",
        rationale,
        summary: "graph approved for operational handoff",
        message: "Graph approved",
      });
    },

    revokeApproval: (rationale) => {
      record({
        type: "revoke-approval",
        rationale,
        summary: "graph approval revoked",
        message: "Approval revoked",
      });
    },

    revert: () => {
      if (!active) return;
      const log = active.compiled.decisions;
      const reverted = [...log.entries]
        .reverse()
        .find((entry) => entry.type !== "revert");
      if (!reverted) return;
      void commit(
        () => {
          const remaining = log.entries.filter(
            (entry) => entry.id !== reverted.id,
          );
          const approvals = remaining.filter(
            (entry) => entry.type === "approve-graph",
          );
          const last = approvals[approvals.length - 1];
          const base: DecisionLog = {
            ...log,
            entries: remaining,
            revision: log.revision + 1,
            graphApproved:
              Boolean(last) &&
              !remaining.some(
                (entry) =>
                  entry.type === "revoke-approval" && entry.at > last.at,
              ),
            approvedAt: last?.at ?? null,
            approvedBy: last ? last.actor : null,
          };
          return appendDecision(
            base,
            createDecision({
              type: "revert",
              rationale: `Operator reverted ${reverted.id}`,
              targetNodeIds: reverted.targetNodeIds,
              before: reverted,
              after: { revertedDecisionId: reverted.id },
              summary: `reverted ${reverted.type}: ${reverted.summary}`,
              at: new Date().toISOString(),
            }),
          );
        },
        [],
        "Last decision reverted",
      );
    },

    exportGraph: () => {
      if (!active) return;
      downloadText(
        `${active.result.canonical.deal.id}.graph.json`,
        toGraphJson(active.compiled),
        "application/json",
      );
    },
    exportPlan: () => {
      if (!active) return;
      downloadText(
        `${active.result.canonical.deal.id}.execution-plan.md`,
        toExecutionPlanMarkdown(active.compiled),
        "text/markdown",
      );
    },
    exportQuality: () => {
      if (!active) return;
      downloadText(
        `${active.result.canonical.deal.id}.quality.json`,
        toQualityJson(active.compiled),
        "application/json",
      );
    },
    exportPackage: (nodeId, format) => {
      if (!active) return;
      const node = findNode(nodeId);
      if (!node) return;
      const slug = `${active.result.canonical.deal.id}.${nodeId}`;
      if (format === "json") {
        downloadText(
          `${slug}.json`,
          packageToJson(active.compiled, nodeId),
          "application/json",
        );
      } else {
        const pkg = buildModelPackage(node, {
          canonical: active.compiled.canonical,
          generator: active.compiled.graph.generator,
        });
        downloadText(
          `${slug}.md`,
          packageToMarkdown(pkg, node),
          "text/markdown",
        );
      }
    },
    exportBundle: () => {
      if (!active) return;
      void (async () => {
        const bytes = await toBundleZip(active.compiled);
        const copy = new Uint8Array(bytes.length);
        copy.set(bytes);
        downloadBlob(
          `${active.result.canonical.deal.id}.bundle.zip`,
          new Blob([copy.buffer], { type: "application/zip" }),
        );
      })();
    },
  };

  const clearDecisions = () => {
    if (!active) return;
    const dealId = active.result.canonical.deal.id;
    setDecisions((previous) => ({ ...previous, [dealId]: createLog(dealId) }));
    setEntries((previous) =>
      previous.map((entry) =>
        entry.fileName === active.fileName ? { ...entry, impact: null } : entry,
      ),
    );
    clearSession();
    toast("Decisions cleared", {
      description: "The graph will return to its deterministic baseline.",
    });
    void importEntries(
      [
        {
          fileName: active.fileName,
          text: active.result.rawText,
          source: active.source,
        },
      ],
      active.fileName,
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-rule-strong bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-420 flex-wrap items-center gap-x-6 gap-y-2 px-5 py-2.5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-5 items-center justify-center border border-rule-strong">
              <span className="size-1.5 bg-signal" />
            </span>
            <span className="font-mono-data text-[11px] tracking-widest uppercase">
              Deal<span className="text-muted-foreground">→</span>Challenge
            </span>
          </Link>

          <nav
            className="order-last flex basis-full items-center overflow-x-auto border-t border-hairline lg:order-0 lg:w-auto lg:basis-auto lg:overflow-visible lg:border-t-0"
            aria-label="Pipeline stages"
          >
            {VIEW_IDS.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setView(id);
                  setSelectedNodeId(null);
                }}
                aria-current={view === id ? "page" : undefined}
                className={cn(
                  "shrink-0 border-r border-hairline px-3 py-2.5 font-mono-data text-[11px] tracking-widest whitespace-nowrap uppercase last:border-r-0 lg:py-0",
                  view === id
                    ? "text-foreground"
                    : "text-muted-foreground/60 hover:text-foreground",
                )}
              >
                {VIEW_LABELS[id].index} {VIEW_LABELS[id].name}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <MockBadge />
            {active && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="font-mono-data text-[11px] tracking-widest uppercase"
                onClick={clearDecisions}
                title="Drop every operator decision and rebuild the deterministic baseline"
              >
                <RotateCcw className="size-3" /> Baseline
              </Button>
            )}
          </div>
        </div>

        {active && (
          <div className="border-t border-hairline">
            <div className="mx-auto flex w-full max-w-420 flex-wrap items-center gap-x-5 gap-y-2 px-5 py-2 sm:px-8">
              <label className="flex items-center gap-2">
                <span className="sr-only">Active package</span>
                <select
                  className="h-7 border border-hairline bg-transparent px-2 font-mono-data text-[11px]"
                  value={active.fileName}
                  onChange={(event) => {
                    setActiveFileName(event.target.value);
                    setSelectedNodeId(null);
                    setSelection(null);
                  }}
                >
                  {entries.map((entry) => (
                    <option key={entry.fileName} value={entry.fileName}>
                      {entry.result.canonical.deal.title}
                    </option>
                  ))}
                </select>
              </label>
              <span className="font-mono-data text-[11px] tracking-widest text-muted-foreground uppercase">
                {active.result.canonical.deal.id}
              </span>
              <span
                className={cn(
                  "font-mono-data text-[11px] tracking-widest uppercase",
                  MATURITY_TEXT[active.result.maturity.level] ??
                    "text-muted-foreground",
                )}
              >
                {active.result.maturity.level.replace(/-/g, " ")}
              </span>
              <span className="font-mono-data text-[11px] tracking-widest text-muted-foreground/70">
                {active.compiled.graph.nodes.length} NODES ·{" "}
                {active.compiled.graph.edges.length} EDGES ·{" "}
                {active.compiled.graph.waves.length} WAVES ·{" "}
                {active.compiled.decisions.entries.length} DECISIONS · sha256:
                {active.result.sha256.slice(0, 10)}
              </span>
              <span className="font-mono-data text-[11px] tracking-widest text-muted-foreground/70">
                {active.compiled.quality.status.toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto w-full max-w-420 px-5 py-8 sm:px-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-hairline pb-3">
          <div>
            <h1 className="text-[19px] leading-6 font-semibold tracking-[-0.02em]">
              <span className="font-mono-data mr-2 text-[12px] text-muted-foreground">
                {VIEW_LABELS[view].index}
              </span>
              {VIEW_LABELS[view].name}
            </h1>
            <p className="mt-1 text-[12.5px] leading-6 text-muted-foreground">
              {VIEW_LABELS[view].purpose}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="font-mono-data text-[11px] tracking-widest uppercase"
              onClick={() => setView("validation")}
            >
              Quality gate
            </Button>
            <Link to="/">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="font-mono-data text-[11px] tracking-widest uppercase"
              >
                <ArrowLeft className="size-3" /> Overview
              </Button>
            </Link>
          </div>
        </div>

        {busy && entries.length === 0 ? (
          <div className="flex flex-col items-center gap-4 border border-hairline py-36">
            <Loader2 className="size-5 animate-spin text-signal" />
            <p className="font-mono-data text-[11px] tracking-widest text-muted-foreground uppercase">
              Reading · validating · normalizing · compiling
            </p>
          </div>
        ) : view === "import" ? (
          <ImportView
            entries={entries}
            active={active}
            actions={actions}
            busy={busy}
            selection={selection}
            onSelect={setSelection}
            activeFileName={active?.fileName ?? null}
            onSetActiveFileName={setActiveFileName}
            onRemove={(fileName) => {
              setEntries((previous) =>
                previous.filter((entry) => entry.fileName !== fileName),
              );
              setActiveFileName((current) =>
                current === fileName ? null : current,
              );
            }}
          />
        ) : !active ? (
          <p className="border border-dashed border-hairline px-6 py-16 text-center font-mono-data text-[11px] tracking-widest text-muted-foreground uppercase">
            Load a package in the import workspace first
          </p>
        ) : view === "decomposition" ? (
          <DecompositionView
            entry={active}
            actions={actions}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            busy={busy}
            onOverride={setOverrideNode}
          />
        ) : view === "graph" ? (
          <GraphView
            entry={active}
            actions={actions}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            busy={busy}
          />
        ) : view === "plan" ? (
          <PlanView
            entry={active}
            actions={actions}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            busy={busy}
          />
        ) : view === "packages" ? (
          <PackagesView
            entry={active}
            actions={actions}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            busy={busy}
          />
        ) : (
          <ValidationView
            entry={active}
            actions={actions}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            busy={busy}
          />
        )}
      </div>

      {active && view !== "decomposition" && selectedNodeId && (
        <NodeDetail
          entry={active}
          node={
            active.compiled.graph.nodes.find(
              (candidate) => candidate.id === selectedNodeId,
            ) ?? null
          }
          actions={actions}
          busy={busy}
          onClose={() => setSelectedNodeId(null)}
          onOverride={setOverrideNode}
          onSplit={() => {
            setView("decomposition");
          }}
          onSelectNode={setSelectedNodeId}
        />
      )}

      <OverrideDialog
        key={overrideNode?.id ?? "none"}
        node={overrideNode}
        busy={busy}
        onClose={() => setOverrideNode(null)}
        onConfirm={(nodeId, model, rationale) =>
          actions.overrideModel(nodeId, model, rationale)
        }
      />

      <Inspector selection={selection} onClose={() => setSelection(null)} />
    </div>
  );
}
