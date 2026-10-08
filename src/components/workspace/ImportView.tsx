import { PackagePicker } from "@/components/workspace/PackagePicker";
import { BacklogPanel } from "./BacklogPanel";
import { MaturityPanel } from "./MaturityPanel";
import { NormalizedPanel } from "./NormalizedPanel";
import { ValidationPanel } from "./ValidationPanel";
import { Metric, SectionTitle } from "./bits";
import type { SelectionTarget } from "./selection";
import type { Actions, DealEntry } from "./types";
import type { ImportedPackage, ScopeItem } from "@deal-to-challenge/engine";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const MATURITY_TEXT: Record<string, string> = {
  "review-required": "text-review",
  "discovery-required": "text-model-pod",
  blocked: "text-blocked",
  "execution-candidate": "text-ready",
};

function RawSource({ result }: { result: ImportedPackage }) {
  return (
    <div className="space-y-5">
      <div className="border border-hairline p-5">
        <p className="font-mono-data text-[11px] tracking-widest text-muted-foreground uppercase">
          Preserved original
        </p>
        <p className="mt-3 max-w-2xl text-[13px] leading-6 text-muted-foreground">
          The imported package is frozen and never mutated. Normalization
          happens on a separate object, and every normalized record keeps a
          pointer back to its raw path. Nothing here is uploaded anywhere: in
          mock mode the whole workflow runs in this browser tab.
        </p>
        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3 font-mono-data text-[11px] tracking-widest text-muted-foreground">
          <span>{result.fileName}</span>
          <span>{(result.byteLength / 1024).toFixed(1)} KB</span>
          <span>sha256:{result.sha256.slice(0, 24)}…</span>
        </div>
      </div>
      <pre className="max-h-[68vh] overflow-auto border border-hairline bg-black/30 p-5 font-mono-data text-[11px] leading-5 text-muted-foreground">
        {result.rawText}
      </pre>
    </div>
  );
}

export interface ImportViewProps {
  entries: DealEntry[];
  active: DealEntry | null;
  actions: Actions;
  busy: boolean;
  selection: SelectionTarget;
  onSelect: (target: SelectionTarget) => void;
  activeFileName: string | null;
  onSetActiveFileName: (fileName: string) => void;
  onRemove: (fileName: string) => void;
}

export function ImportView({
  entries,
  active,
  actions,
  busy,
  selection,
  onSelect,
  activeFileName,
  onSetActiveFileName,
  onRemove,
}: ImportViewProps) {
  const openItem = (item: ScopeItem) => onSelect({ kind: "item", item });

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <aside className="min-w-0">
          <PackagePicker
            entries={entries}
            activeFileName={activeFileName}
            busy={busy}
            onSelect={(fileName) => {
              onSetActiveFileName(fileName);
              onSelect(null);
            }}
            onRemove={onRemove}
            onLoadSample={actions.loadSample}
            onImportFiles={actions.importFiles}
            onImportText={actions.importText}
          />
        </aside>

        <section className="min-w-0">
          {!active ? (
            <div className="border border-dashed border-hairline px-6 py-16 text-center">
              <p className="font-mono-data text-[11px] tracking-widest text-muted-foreground uppercase">
                No package loaded
              </p>
              <p className="mx-auto mt-4 max-w-lg text-[13px] leading-6 text-muted-foreground">
                Load one of the four supplied packages, drop the challenge ZIP,
                or paste a workspace export into the panel on the left. The
                original file is preserved byte-for-byte and never modified.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <SectionTitle
                index="FR1"
                title="Source package"
                detail={
                  <>
                    {active.result.canonical.deal.id} · {active.result.fileName}{" "}
                    · {(active.result.byteLength / 1024).toFixed(1)} KB ·{" "}
                    {active.result.sourceIndex.length} indexed records
                  </>
                }
                right={
                  <span
                    className={cn(
                      "font-mono-data text-[11px] tracking-widest uppercase",
                      MATURITY_TEXT[active.result.maturity.level] ??
                        "text-muted-foreground",
                    )}
                  >
                    {active.result.maturity.level.replace(/-/g, " ")}
                  </span>
                }
              />

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Metric
                  label="Structural errors"
                  value={active.result.report.counts.error}
                  tone={
                    active.result.report.counts.error > 0
                      ? "text-blocked"
                      : "text-ready"
                  }
                />
                <Metric
                  label="Warnings"
                  value={active.result.report.counts.warning}
                  tone="text-review"
                />
                <Metric
                  label="Requirements"
                  value={active.result.canonical.scope.requirements.length}
                />
                <Metric
                  label="Maturity score"
                  value={active.result.maturity.score}
                  hint={`${active.result.maturity.reasons.length} contributing rule(s)`}
                />
              </div>

              <Tabs defaultValue="assess" className="gap-8">
                <TabsList className="h-auto w-full flex-wrap justify-start gap-0 rounded-none bg-transparent p-0">
                  {[
                    ["assess", "Assessment", null],
                    [
                      "validation",
                      "Validation",
                      active.result.report.issues.length,
                    ],
                    ["model", "Normalized model", null],
                    ["backlog", "Backlog & scope", null],
                    ["raw", "Raw source", null],
                  ].map(([value, label, count]) => (
                    <TabsTrigger
                      key={String(value)}
                      value={String(value)}
                      className="rounded-none border-x-0 border-t-0 border-b border-hairline bg-transparent px-5 py-3 font-mono-data text-[11px] tracking-widest uppercase text-muted-foreground shadow-none data-[state=active]:border-b-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
                    >
                      {label}
                      {typeof count === "number" && (
                        <span className="ml-2 text-[11px] text-muted-foreground/70">
                          {count}
                        </span>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="assess">
                  <MaturityPanel
                    result={active.result}
                    selectedCode={
                      selection?.kind === "maturity"
                        ? selection.reason.code
                        : null
                    }
                    onSelectReason={(reason) =>
                      onSelect({ kind: "maturity", reason })
                    }
                  />
                  <p className="mt-8 border-t border-hairline pt-5 font-mono-data text-[11px] leading-5 tracking-[0.08em] text-muted-foreground/70">
                    The critical items above become blocking discovery nodes in
                    the decomposition workspace, so implementation work that
                    depends on them stays blocked or review-required.
                  </p>
                </TabsContent>

                <TabsContent value="validation">
                  <ValidationPanel
                    report={active.result.report}
                    conflict={active.result.conflict}
                    selectedId={
                      selection?.kind === "issue" ? selection.issue.id : null
                    }
                    onSelectIssue={(issue) =>
                      onSelect({ kind: "issue", issue })
                    }
                  />
                </TabsContent>

                <TabsContent value="model">
                  <NormalizedPanel
                    result={active.result}
                    onSelectItem={openItem}
                  />
                </TabsContent>

                <TabsContent value="backlog">
                  <BacklogPanel
                    canonical={active.result.canonical}
                    onSelectItem={openItem}
                  />
                </TabsContent>

                <TabsContent value="raw">
                  <RawSource result={active.result} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
