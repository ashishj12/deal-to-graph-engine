import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type {
  ImportedPackage,
  MaturityReason,
} from "@deal-to-challenge/engine";
import { cn } from "@/lib/utils";
import { Info, OctagonAlert, TriangleAlert } from "lucide-react";

const LEVEL_STYLE: Record<
  ImportedPackage["maturity"]["level"],
  { label: string; className: string }
> = {
  "execution-candidate": {
    label: "Execution Candidate",
    className: "border-ready/50 text-ready",
  },
  "review-required": {
    label: "Review Required",
    className: "border-review/50 text-review",
  },
  "discovery-required": {
    label: "Discovery Required",
    className: "border-model-pod/60 text-model-pod",
  },
  blocked: { label: "Blocked", className: "border-blocked/60 text-blocked" },
};

const SEVERITY_ICON = {
  critical: OctagonAlert,
  warning: TriangleAlert,
  info: Info,
};

export interface MaturityPanelProps {
  result: ImportedPackage;
  onSelectReason: (reason: MaturityReason) => void;
  selectedCode: string | null;
}

export function MaturityPanel({
  result,
  onSelectReason,
  selectedCode,
}: MaturityPanelProps) {
  const { maturity } = result;
  const style = LEVEL_STYLE[maturity.level];

  const counts: { label: string; value: number; tone?: string }[] = [
    {
      label: "Critical open",
      value: maturity.counts.criticalOpen,
      tone: "text-blocked",
    },
    { label: "Open questions", value: maturity.counts.openQuestions },
    { label: "Open gaps", value: maturity.counts.openGaps },
    {
      label: "Unvalidated assumptions",
      value: maturity.counts.unvalidatedAssumptions,
    },
    { label: "Open risks", value: maturity.counts.openRisks },
    {
      label: "Quality warnings",
      value: maturity.counts.warnChecks,
      tone: "text-review",
    },
    { label: "Unreviewed sections", value: maturity.counts.unreviewedSections },
    { label: "Stale sections", value: maturity.counts.staleSections },
  ];

  return (
    <div className="space-y-5">
      <Card className="border-hairline bg-surface-raise/30 shadow-none">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-mono-data text-[11px] uppercase tracking-widest text-muted-foreground">
                package maturity
              </p>
              <CardTitle className="mt-2 text-xl">
                <Badge
                  variant="outline"
                  className={cn("text-[13px]", style.className)}
                >
                  {style.label}
                </Badge>
              </CardTitle>
            </div>
            <div className="text-right">
              <div className="font-mono-data text-4xl font-semibold tabular-nums">
                {maturity.score}
              </div>
              <p className="font-mono-data text-[11px] uppercase tracking-widest text-muted-foreground">
                readiness score
              </p>
            </div>
          </div>
          <Progress value={maturity.score} className="h-1.5" />
          <p className="text-[13px] leading-6 text-muted-foreground">
            {maturity.summary}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-none border border-hairline bg-hairline sm:grid-cols-4">
            {counts.map((count) => (
              <div key={count.label} className="bg-background px-4 py-3">
                <div
                  className={cn(
                    "font-mono-data text-lg font-semibold tabular-nums",
                    count.value === 0 ? "text-muted-foreground" : count.tone,
                  )}
                >
                  {count.value}
                </div>
                <div className="mt-1 text-[11px] leading-4 text-muted-foreground">
                  {count.label}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-hairline bg-surface-raise/30 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">Why this level?</CardTitle>
          <p className="text-[12px] leading-5 text-muted-foreground">
            Every contributing rule, its weight, and the source items that
            triggered it. Nothing here is inferred by a model — all of it is
            deterministic.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {maturity.reasons.map((reason) => {
            const Icon = SEVERITY_ICON[reason.severity];
            const active = selectedCode === reason.code;
            return (
              <button
                key={reason.code}
                type="button"
                onClick={() => onSelectReason(reason)}
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
                    reason.severity === "critical"
                      ? "text-blocked"
                      : reason.severity === "warning"
                        ? "text-review"
                        : "text-muted-foreground",
                  )}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] leading-5">
                    {reason.label}
                  </span>
                  <span className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="font-mono-data text-[11px] uppercase tracking-widest text-muted-foreground">
                      {reason.code}
                    </span>
                    <span
                      className={cn(
                        "font-mono-data text-[11px] tabular-nums",
                        reason.delta <= -10
                          ? "text-blocked"
                          : "text-muted-foreground",
                      )}
                    >
                      {reason.delta > 0 ? "+" : ""}
                      {reason.delta}
                    </span>
                    {reason.sourceIds.length > 0 && (
                      <span className="font-mono-data text-[11px] text-muted-foreground">
                        {reason.sourceIds.slice(0, 4).join(" · ")}
                        {reason.sourceIds.length > 4
                          ? ` +${reason.sourceIds.length - 4}`
                          : ""}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
