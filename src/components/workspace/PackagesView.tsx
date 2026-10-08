/**
 * 05 · Execution package workspace (FR4).
 *
 * The model-specific package for any node, rendered from the same object the
 * export layer writes, so the preview can never disagree with the export. Missing
 * required fields and the handoff readiness verdict are shown as data, not as a
 * warning bolted on afterwards.
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ModelPackage } from "@deal-to-challenge/engine";
import { useMemo, useState } from "react";
import {
  Bullets,
  Chip,
  EmptyNote,
  MODEL_MARK,
  MODEL_NAME,
  MODEL_TEXT,
  ModelChip,
  ProvenanceChip,
  ReadinessChip,
  SectionTitle,
} from "./bits";
import type { Actions, DealEntry } from "./types";
import { cn } from "@/lib/utils";
import { Copy, Download, FileText } from "lucide-react";

/** Base fields that belong to every package and are rendered separately. */
const BASE_KEYS = new Set([
  "nodeId",
  "nodeTitle",
  "model",
  "readiness",
  "complete",
  "missingFields",
  "readinessNotes",
  "provenance",
  "sourceIds",
  "generator",
]);

function humanise(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (character) => character.toUpperCase())
    .trim();
}

function FieldValue({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === "") {
    return <span className="font-mono-data text-[11px] text-review">not available in the package</span>;
  }
  if (Array.isArray(value)) {
    const items = value.map((entry) => String(entry));
    return <Bullets items={items} empty="none" />;
  }
  return <span className="text-[12.5px] leading-6">{String(value)}</span>;
}

export interface PackagesViewProps {
  entry: DealEntry;
  actions: Actions;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
  busy: boolean;
}

export function PackagesView({ entry, actions, selectedNodeId, onSelectNode }: PackagesViewProps) {
  const { graph, packages } = entry.compiled;
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const list = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return packages
      .filter((pkg) => needle.length === 0 || pkg.nodeTitle.toLowerCase().includes(needle) || pkg.nodeId.toLowerCase().includes(needle))
      .sort((a, b) => Number(b.readiness === "ready") - Number(a.readiness === "ready"));
  }, [packages, query]);

  const active: ModelPackage | null =
    list.find((pkg) => pkg.nodeId === selectedNodeId) ?? list[0] ?? null;

  const complete = packages.filter((pkg) => pkg.complete).length;

  return (
    <div className="space-y-6">
      <SectionTitle
        index="FR4"
        title="Model-specific execution packages"
        detail={
          <>
            {packages.length} packages · {complete} complete · {packages.length - complete} with a missing
            required field. A package is only handoff-ready when every field for its operating model is present.
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <aside className="space-y-3">
          <label className="block text-[11px]">
            <span className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
              Search packages
            </span>
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="mt-1 h-8 text-[12px]"
              placeholder="node id or title"
            />
          </label>
          <ul className="max-h-[36rem] overflow-y-auto border border-hairline">
            {list.map((pkg) => (
              <li key={pkg.nodeId} className="border-b border-hairline/60 last:border-b-0">
                <button
                  type="button"
                  onClick={() => onSelectNode(pkg.nodeId)}
                  className={cn(
                    "w-full px-3 py-2 text-left transition-colors hover:bg-foreground/[0.03]",
                    active?.nodeId === pkg.nodeId && "bg-foreground/[0.05]",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-mono-data text-[11px] text-muted-foreground">{pkg.nodeId}</span>
                    <span className={cn("font-mono-data text-[10px] uppercase", MODEL_TEXT[pkg.model])}>
                      {MODEL_MARK[pkg.model]}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[12.5px] leading-5">{pkg.nodeTitle}</span>
                  <span className="mt-1 flex items-center gap-2">
                    <ReadinessChip readiness={pkg.readiness} />
                    {!pkg.complete && (
                      <span className="font-mono-data text-[10px] text-review">
                        {pkg.missingFields.length} missing
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))}
            {list.length === 0 && (
              <li className="px-3 py-8 text-center font-mono-data text-[11px] text-muted-foreground uppercase">
                No package matches
              </li>
            )}
          </ul>
        </aside>

        <section className="min-w-0 space-y-5">
          {!active ? (
            <EmptyNote>No package available for this deal</EmptyNote>
          ) : (
            <>
              <div className="space-y-3 border border-hairline p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone="border-rule-strong text-foreground">{active.nodeId}</Chip>
                  <ModelChip model={active.model} />
                  <ReadinessChip readiness={active.readiness} />
                  <ProvenanceChip provenance={active.provenance} />
                  <Chip tone={active.complete ? "border-ready/50 text-ready" : "border-review/50 text-review"}>
                    {active.complete ? "handoff ready" : "not ready for handoff"}
                  </Chip>
                </div>
                <h3 className="text-[16px] leading-6 tracking-[-0.01em]">{active.nodeTitle}</h3>
                <p className="text-[12.5px] leading-6 text-muted-foreground">
                  {MODEL_NAME[active.model]} package · source records:{" "}
                  {active.sourceIds.length > 0 ? active.sourceIds.join(", ") : "none"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      actions.exportPackage(active.nodeId, "json");
                    }}
                  >
                    <Download className="size-3" /> JSON
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      actions.exportPackage(active.nodeId, "markdown");
                    }}
                  >
                    <FileText className="size-3" /> Markdown
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      void navigator.clipboard
                        ?.writeText(JSON.stringify(active, null, 2))
                        .then(() => setCopied(active.nodeId))
                        .catch(() => setCopied(null));
                    }}
                  >
                    <Copy className="size-3" /> {copied === active.nodeId ? "Copied" : "Copy JSON"}
                  </Button>
                  <span className="self-center font-mono-data text-[10px] text-muted-foreground">
                    {active.generator.mode} mode · {active.generator.provider} ·{" "}
                    {active.generator.promptVersion}
                  </span>
                </div>
              </div>

              {(active.missingFields.length > 0 || active.readinessNotes.length > 0) && (
                <div className="space-y-3 border-l-2 border-review/60 pl-4">
                  <div className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                    Completeness check
                  </div>
                  {active.missingFields.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {active.missingFields.map((fieldName) => (
                        <Chip key={fieldName} tone="border-review/50 text-review">
                          {humanise(fieldName)}
                        </Chip>
                      ))}
                    </div>
                  )}
                  <Bullets items={active.readinessNotes} empty="No readiness note." />
                </div>
              )}

              <div className="grid gap-5 sm:grid-cols-2">
                {Object.entries(active)
                  .filter(([key]) => !BASE_KEYS.has(key))
                  .map(([key, value]) => (
                    <div key={key} className={Array.isArray(value) && value.length > 3 ? "sm:col-span-2" : undefined}>
                      <div className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                        {humanise(key)}
                      </div>
                      <div className="mt-1.5">
                        <FieldValue value={value} />
                      </div>
                    </div>
                  ))}
              </div>

              {graph.nodes.length > 0 && (
                <p className="font-mono-data text-[11px] leading-5 text-muted-foreground">
                  Package fields are derived from the imported records listed above. Nothing in this package
                  is invented: a value the package does not contain stays absent and is reported as missing.
                </p>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
