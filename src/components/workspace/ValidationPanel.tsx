import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  PlatformConflict,
  Severity,
  ValidationIssue,
  ValidationReport,
} from "@deal-to-challenge/engine";
import { cn } from "@/lib/utils";
import {
  CircleAlert,
  CircleCheck,
  Info,
  OctagonAlert,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";

const SEVERITY_ICON = {
  error: OctagonAlert,
  warning: TriangleAlert,
  info: Info,
};

const SEVERITY_TONE: Record<Severity, string> = {
  error: "text-blocked",
  warning: "text-review",
  info: "text-muted-foreground",
};

export interface ValidationPanelProps {
  report: ValidationReport;
  conflict: PlatformConflict;
  selectedId: string | null;
  onSelectIssue: (issue: ValidationIssue) => void;
}

export function ValidationPanel({
  report,
  conflict,
  selectedId,
  onSelectIssue,
}: ValidationPanelProps) {
  const [filter, setFilter] = useState<Severity | "all">("all");

  const issues = useMemo(
    () =>
      report.issues
        .filter((issue) => filter === "all" || issue.severity === filter)
        .slice()
        .sort((a, b) => {
          const order: Severity[] = ["error", "warning", "info"];
          return (
            order.indexOf(a.severity) - order.indexOf(b.severity) ||
            a.id.localeCompare(b.id)
          );
        }),
    [report.issues, filter],
  );

  const chips: { key: Severity | "all"; label: string; count: number }[] = [
    { key: "all", label: "All", count: report.issues.length },
    { key: "error", label: "Errors", count: report.counts.error },
    { key: "warning", label: "Warnings", count: report.counts.warning },
    { key: "info", label: "Info", count: report.counts.info },
  ];

  return (
    <div className="space-y-5">
      {conflict.detected && (
        <Card className="border-blocked/40 bg-blocked/5 shadow-none">
          <CardHeader className="gap-2">
            <CardTitle className="flex items-center gap-2 text-sm text-blocked">
              <OctagonAlert className="size-4" />
              Platform conflict — requires a human decision
            </CardTitle>
            <p className="text-[13px] leading-6 text-muted-foreground">
              The package references more than one cloud platform. The engine
              will not pick one for you. Record the decision before this package
              can be planned.
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5">
              {conflict.claims.map((claim, index) => (
                <li
                  key={`${claim.source}-${claim.platform}-${index}`}
                  className="flex flex-wrap items-center gap-2 font-mono-data text-[11px]"
                >
                  <Badge
                    variant="outline"
                    className="border-hairline text-[11px] uppercase"
                  >
                    {claim.platform}
                  </Badge>
                  <span className="text-muted-foreground">{claim.source}</span>
                  {claim.refId && (
                    <span className="text-model-pod">{claim.refId}</span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="border-hairline bg-surface-raise/30 shadow-none">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-sm">Validation report</CardTitle>
            <Badge
              variant="outline"
              className={cn(
                "font-mono-data text-[11px] uppercase",
                report.passed
                  ? "border-ready/40 text-ready"
                  : "border-blocked/50 text-blocked",
              )}
            >
              {report.passed ? "structure valid" : "structure blocked"}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => setFilter(chip.key)}
                className={cn(
                  "rounded-none border px-3 py-1 font-mono-data text-[11px] uppercase tracking-widest transition-colors",
                  filter === chip.key
                    ? "border-model-pod/60 bg-model-pod/15 text-foreground"
                    : "border-hairline text-muted-foreground hover:border-model-pod/40",
                )}
              >
                {chip.label} · {chip.count}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {issues.length === 0 && (
            <p className="rounded-none border border-hairline bg-background/40 p-4 text-[13px] text-muted-foreground">
              No findings in this category.
            </p>
          )}
          {issues.map((issue) => {
            const Icon = SEVERITY_ICON[issue.severity];
            const active = selectedId === issue.id;
            return (
              <button
                key={issue.id}
                type="button"
                onClick={() => onSelectIssue(issue)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-none border border-hairline/70 px-4 py-4 text-left transition-colors",
                  active
                    ? "border-model-pod/60 bg-model-pod/10"
                    : "border-hairline bg-background/40 hover:border-model-pod/40",
                )}
              >
                <Icon
                  className={cn(
                    "mt-0.5 size-4 shrink-0",
                    SEVERITY_TONE[issue.severity],
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] leading-5">
                    {issue.message}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="font-mono-data text-[11px] uppercase tracking-widest text-muted-foreground">
                      {issue.code}
                    </span>
                    <span className="font-mono-data text-[11px] text-muted-foreground/80">
                      {issue.path}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card className="border-hairline bg-surface-raise/30 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">Output sections</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {report.sections.map((section) => (
            <div
              key={section.path}
              className="flex items-center justify-between gap-3 rounded-none border border-hairline bg-background/40 px-3 py-2"
            >
              <span className="min-w-0">
                <span className="block truncate text-[12px]">
                  {section.name}
                </span>
                <span className="font-mono-data text-[11px] text-muted-foreground">
                  {section.path}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                {section.reviewed === false && (
                  <Badge
                    variant="outline"
                    className="border-review/40 font-mono-data text-[11px] uppercase text-review"
                  >
                    unreviewed
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={cn(
                    "font-mono-data text-[11px] uppercase",
                    section.status === "current"
                      ? "border-ready/40 text-ready"
                      : "border-review/40 text-review",
                  )}
                >
                  {section.status}
                </Badge>
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-hairline bg-surface-raise/30 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <CircleCheck className="size-4 text-ready" />
            Reference coverage
          </CardTitle>
          <p className="text-[12px] leading-5 text-muted-foreground">
            How many times each source identifier is referenced by capabilities,
            components, integrations, AI use cases or related items.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(report.referenceCounts)
              .slice(0, 40)
              .map(([id, count]) => (
                <span
                  key={id}
                  title={`${id} referenced ${count} time(s)`}
                  className="rounded border border-hairline bg-background/40 px-2 py-0.5 font-mono-data text-[11px] text-muted-foreground"
                >
                  {id}
                  <span className="ml-1.5 text-foreground/70">{count}</span>
                </span>
              ))}
            {Object.keys(report.referenceCounts).length === 0 && (
              <p className="text-[13px] text-muted-foreground">
                No cross-references found.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <p className="flex items-center gap-2 text-[12px] text-muted-foreground">
        <CircleAlert className="size-3.5" />
        Findings never stop the import. Everything is reported and the original
        file is preserved unmodified.
      </p>
    </div>
  );
}
