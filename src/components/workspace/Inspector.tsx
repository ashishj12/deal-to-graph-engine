import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SourceOrigin } from "@deal-to-challenge/engine";
import { cn } from "@/lib/utils";
import type { SelectionTarget } from "./selection";

function SourceAnchor({ origin }: { origin: SourceOrigin }) {
  const verified = origin.quoteVerified;
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="border-hairline font-mono-data text-[11px] uppercase">
          {origin.path}
        </Badge>
        {origin.sectionId && (
          <Badge
            variant="outline"
            className="border-model-flexible/40 font-mono-data text-[11px] uppercase text-model-flexible"
          >
            {origin.sectionId}
          </Badge>
        )}
        {origin.lineStart !== undefined && (
          <span className="font-mono-data text-[11px] text-muted-foreground">
            lines {origin.lineStart}
            {origin.lineEnd !== undefined && origin.lineEnd !== origin.lineStart
              ? `–${origin.lineEnd}`
              : ""}
          </span>
        )}
        {verified !== null && verified !== undefined && (
          <Badge
            variant="outline"
            className={cn(
              "font-mono-data text-[11px] uppercase",
              verified ? "border-ready/40 text-ready" : "border-blocked/50 text-blocked",
            )}
          >
            {verified ? "quote verified" : "quote not found"}
          </Badge>
        )}
      </div>
      {origin.quote && (
        <blockquote className="border-l-2 border-model-pod/50 pl-3 text-[12px] leading-6 text-muted-foreground">
          “{origin.quote}”
        </blockquote>
      )}
    </div>
  );
}

export interface InspectorProps {
  selection: SelectionTarget;
  onClose: () => void;
}

export function Inspector({ selection, onClose }: InspectorProps) {
  // Rendered only while something is selected so the drawer always has a title
  // and description for assistive technology.
  if (!selection) return null;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[88vh] w-full overflow-y-auto sm:max-w-md">
        {selection.kind === "issue" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-base">Validation finding</DialogTitle>
              <DialogDescription className="font-mono-data text-[11px]">
                {selection.issue.code} · {selection.issue.id}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 px-4 pb-6">
              <Badge
                variant="outline"
                className={cn(
                  "font-mono-data text-[11px] uppercase",
                  selection.issue.severity === "error"
                    ? "border-blocked/50 text-blocked"
                    : selection.issue.severity === "warning"
                      ? "border-review/50 text-review"
                      : "border-hairline text-muted-foreground",
                )}
              >
                {selection.issue.severity}
              </Badge>
              <p className="text-[13px] leading-6">{selection.issue.message}</p>
              <Separator />
              <div className="space-y-1">
                <p className="font-mono-data text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  path
                </p>
                <p className="font-mono-data text-[11px]">{selection.issue.path}</p>
              </div>
              {selection.issue.sourceIds.length > 0 && (
                <div className="space-y-1">
                  <p className="font-mono-data text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    source ids
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selection.issue.sourceIds.map((id) => (
                      <span
                        key={id}
                        className="rounded border border-hairline px-1.5 py-0.5 font-mono-data text-[11px]"
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <Separator />
              <div className="space-y-1">
                <p className="font-mono-data text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  remediation
                </p>
                <p className="text-[13px] leading-6 text-muted-foreground">
                  {selection.issue.remediation}
                </p>
              </div>
            </div>
          </>
        )}

        {selection.kind === "maturity" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-base">Maturity rule</DialogTitle>
              <DialogDescription className="font-mono-data text-[11px]">
                {selection.reason.code} · weight {selection.reason.delta}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 px-4 pb-6">
              <Badge
                variant="outline"
                className={cn(
                  "font-mono-data text-[11px] uppercase",
                  selection.reason.severity === "critical"
                    ? "border-blocked/50 text-blocked"
                    : "border-review/50 text-review",
                )}
              >
                {selection.reason.severity}
              </Badge>
              <p className="text-[13px] leading-6">{selection.reason.label}</p>
              {selection.reason.sourceIds.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-1">
                    <p className="font-mono-data text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                      triggering source ids
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selection.reason.sourceIds.map((id) => (
                        <span
                          key={id}
                          className="rounded border border-hairline px-1.5 py-0.5 font-mono-data text-[11px]"
                        >
                          {id}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {selection.kind === "item" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-base">{selection.item.title}</DialogTitle>
              <DialogDescription className="font-mono-data text-[11px]">
                {selection.item.id} · {selection.item.kind}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 px-4 pb-6">
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="outline" className="border-hairline text-[11px] uppercase">
                  {selection.item.provenance}
                </Badge>
                <Badge variant="outline" className="border-hairline text-[11px] uppercase">
                  priority: {selection.item.priority}
                </Badge>
                {selection.item.critical && (
                  <Badge
                    variant="outline"
                    className="border-blocked/50 text-[11px] uppercase text-blocked"
                  >
                    critical
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[11px] uppercase",
                    selection.item.inScope ? "border-ready/40 text-ready" : "border-blocked/50 text-blocked",
                  )}
                >
                  {selection.item.inScope ? "in scope" : "excluded"}
                </Badge>
              </div>

              <p className="text-[13px] leading-6">
                {selection.item.description || "No description provided."}
              </p>

              {selection.item.resolution && (
                <div className="space-y-1">
                  <p className="font-mono-data text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    resolution
                  </p>
                  <p className="text-[13px] leading-6 text-muted-foreground">
                    {selection.item.resolution}
                  </p>
                </div>
              )}

              {selection.item.affectsInputs.length > 0 && (
                <div className="space-y-1">
                  <p className="font-mono-data text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    affects estimation inputs
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selection.item.affectsInputs.map((input) => (
                      <span
                        key={input}
                        className="rounded border border-review/40 px-1.5 py-0.5 font-mono-data text-[11px] text-review"
                      >
                        {input}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selection.item.relatedIds.length > 0 && (
                <div className="space-y-1">
                  <p className="font-mono-data text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                    related ids
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selection.item.relatedIds.map((id) => (
                      <span
                        key={id}
                        className="rounded border border-hairline px-1.5 py-0.5 font-mono-data text-[11px]"
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Separator />
              <div className="space-y-2">
                <p className="font-mono-data text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
                  source anchor
                </p>
                <SourceAnchor origin={selection.item.source} />
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
