import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { ImportedPackage } from "@deal-to-challenge/engine";
import {
  SAMPLE_PACKAGES,
  type SamplePackage,
} from "@deal-to-challenge/engine/samples";
import { cn } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import { useRef, useState } from "react";

export interface ImportedEntry {
  fileName: string;
  source: "sample" | "upload" | "archive";
  archivePath?: string;
  result: ImportedPackage;
}

const MATURITY_TEXT: Record<string, string> = {
  "review-required": "text-review",
  "discovery-required": "text-model-pod",
  blocked: "text-blocked",
  "execution-candidate": "text-ready",
};

const SOURCE_LABEL: Record<ImportedEntry["source"], string> = {
  sample: "sample",
  upload: "file",
  archive: "zip",
};

export interface PackagePickerProps {
  entries: ImportedEntry[];
  activeFileName: string | null;
  busy: boolean;
  onSelect: (fileName: string) => void;
  onRemove: (fileName: string) => void;
  onLoadSample: (deal: SamplePackage) => void;
  onImportFiles: (files: File[]) => void;
  onImportText: (fileName: string, text: string) => void;
}

function SectionLabel({
  children,
  count,
}: {
  children: React.ReactNode;
  count?: number;
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-rule-strong pb-2">
      <span className="font-mono-data text-[11px] tracking-widest text-muted-foreground uppercase">
        {children}
      </span>
      {count !== undefined && (
        <span className="font-mono-data text-[11px] tracking-widest text-muted-foreground/60">
          {String(count).padStart(2, "0")}
        </span>
      )}
    </div>
  );
}

export function PackagePicker({
  entries,
  activeFileName,
  busy,
  onSelect,
  onRemove,
  onLoadSample,
  onImportFiles,
  onImportText,
}: PackagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [pasted, setPasted] = useState("");

  return (
    <div className="space-y-10">
      {/* ---------------- imported ---------------- */}
      {entries.length > 0 && (
        <section className="space-y-3">
          <SectionLabel count={entries.length}>Imported</SectionLabel>
          <ul>
            {entries.map((entry) => {
              const active = entry.fileName === activeFileName;
              return (
                <li key={entry.fileName}>
                  <div
                    className={cn(
                      "group relative flex items-start gap-2 border-b border-hairline py-3 pl-3",
                      active && "bg-surface-raise/60",
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "absolute top-0 left-0 h-full w-[2px]",
                        active ? "bg-signal" : "bg-transparent",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => onSelect(entry.fileName)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <span className="block truncate font-mono-data text-[11px] tracking-[0.04em]">
                        {entry.result.canonical.deal.title}
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "font-mono-data text-[11px] tracking-widest uppercase",
                            MATURITY_TEXT[entry.result.maturity.level] ??
                              "text-muted-foreground",
                          )}
                        >
                          {entry.result.maturity.level.replace(/-/g, " ")}
                        </span>
                        <span className="font-mono-data text-[11px] tracking-widest text-muted-foreground/60 uppercase">
                          {SOURCE_LABEL[entry.source]}
                        </span>
                        {!entry.result.report.passed && (
                          <span className="font-mono-data text-[11px] tracking-widest text-blocked uppercase">
                            {entry.result.report.counts.error} err
                          </span>
                        )}
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${entry.fileName}`}
                      onClick={() => onRemove(entry.fileName)}
                      className="mt-0.5 shrink-0 p-1 text-muted-foreground/50 opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground focus-visible:opacity-100"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* ---------------- samples ---------------- */}
      <section className="space-y-3">
        <SectionLabel count={SAMPLE_PACKAGES.length}>
          Sample packages
        </SectionLabel>
        <ul>
          {SAMPLE_PACKAGES.map((deal, position) => (
            <li key={deal.id}>
              <button
                type="button"
                disabled={busy}
                onClick={() => onLoadSample(deal)}
                className="group block w-full border-b border-hairline py-3 text-left transition-colors hover:bg-surface-raise/60 disabled:opacity-50"
              >
                <span className="flex items-baseline gap-3">
                  <span className="font-mono-data text-[11px] tracking-widest text-muted-foreground/60 transition-colors group-hover:text-signal">
                    {String(position + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold tracking-[-0.005em]">
                      {deal.title}
                    </span>
                    <span className="mt-1 block truncate font-mono-data text-[11px] tracking-widest text-muted-foreground/60">
                      {deal.fileName}
                    </span>
                  </span>
                </span>
                <span
                  className={cn(
                    "mt-2 block pl-8 font-mono-data text-[11px] tracking-widest uppercase",
                    MATURITY_TEXT[deal.expectedMaturity] ??
                      "text-muted-foreground",
                  )}
                >
                  {deal.expectedMaturity.replace(/-/g, " ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- bring your own ---------------- */}
      <section className="space-y-3">
        <SectionLabel>Bring your own</SectionLabel>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            onImportFiles(Array.from(event.dataTransfer.files));
          }}
          className={cn(
            "border border-dashed p-5 text-center transition-colors",
            dragging ? "border-signal bg-signal/5" : "border-rule-strong",
          )}
        >
          <p className="font-mono-data text-[11px] leading-5 tracking-widest text-muted-foreground uppercase">
            Drop .json or .zip
          </p>
          <p className="mt-2 text-[11px] leading-5 text-muted-foreground/70">
            A zip archive is unpacked in the browser and every package inside is
            imported.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 gap-2"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? <Loader2 className="size-3.5 animate-spin" /> : null}
            Choose files
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept=".json,.zip,application/json,application/zip"
            multiple
            className="hidden"
            onChange={(event) => {
              onImportFiles(Array.from(event.target.files ?? []));
              event.target.value = "";
            }}
          />
        </div>

        <Textarea
          value={pasted}
          onChange={(event) => setPasted(event.target.value)}
          placeholder='{ "id": "DEAL_...", "scope": { "items": [] } }'
          className="min-h-24 rounded-none font-mono-data text-[11px] leading-5"
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="w-full"
          disabled={busy || pasted.trim().length === 0}
          onClick={() => {
            onImportText("pasted-package.json", pasted);
            setPasted("");
          }}
        >
          Import pasted JSON
        </Button>
      </section>
    </div>
  );
}
