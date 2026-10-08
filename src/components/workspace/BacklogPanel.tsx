import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CanonicalPackage, ScopeItem } from "@deal-to-challenge/engine";
import { cn } from "@/lib/utils";
import { Ban, CircleSlash } from "lucide-react";

const GROUPS: {
  key: keyof CanonicalPackage["scope"];
  label: string;
  tone: string;
}[] = [
  { key: "gaps", label: "Gaps", tone: "text-blocked" },
  { key: "questions", label: "Questions", tone: "text-review" },
  { key: "assumptions", label: "Assumptions", tone: "text-model-pod" },
  { key: "risks", label: "Risks", tone: "text-model-challenge" },
  { key: "dependencies", label: "Dependencies", tone: "text-model-flexible" },
];

export interface BacklogPanelProps {
  canonical: CanonicalPackage;
  onSelectItem: (item: ScopeItem) => void;
}

export function BacklogPanel({ canonical, onSelectItem }: BacklogPanelProps) {
  const excluded = [
    ...canonical.scope.requirements,
    ...canonical.scope.gaps,
    ...canonical.scope.questions,
    ...canonical.scope.assumptions,
    ...canonical.scope.risks,
    ...canonical.scope.dependencies,
  ].filter((item) => !item.inScope);

  return (
    <div className="space-y-5">
      <Card className="border-hairline bg-surface-raise/30 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">Review queue</CardTitle>
          <p className="text-[12px] leading-5 text-muted-foreground">
            Open gaps, questions, assumptions, risks and dependencies. Critical
            items feed the maturity score and will become blocking discovery
            nodes later in the pipeline.
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {GROUPS.map((group) => {
            const items = canonical.scope[group.key];
            if (items.length === 0) return null;
            const open = items.filter((item) => !item.resolved && item.inScope);
            return (
              <div key={group.key}>
                <div className="mb-2 flex items-center gap-2">
                  <span className={cn("text-[12px] font-medium", group.tone)}>
                    {group.label}
                  </span>
                  <span className="font-mono-data text-[11px] text-muted-foreground">
                    {open.length} open / {items.length} total
                  </span>
                </div>
                <div className="space-y-1.5">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSelectItem(item)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-none border border-hairline/70 px-4 py-4 text-left transition-colors",
                        item.inScope
                          ? "border-hairline bg-background/40 hover:border-model-pod/40"
                          : "border-hairline/60 bg-background/20 opacity-60",
                      )}
                    >
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-mono-data text-[11px] text-model-pod">
                            {item.id}
                          </span>
                          <span className="text-[13px] leading-5">
                            {item.title}
                          </span>
                          {item.critical && item.inScope && !item.resolved && (
                            <Badge
                              variant="outline"
                              className="border-blocked/50 font-mono-data text-[11px] uppercase text-blocked"
                            >
                              critical
                            </Badge>
                          )}
                          {item.resolved && (
                            <Badge
                              variant="outline"
                              className="border-ready/40 font-mono-data text-[11px] uppercase text-ready"
                            >
                              resolved
                            </Badge>
                          )}
                        </span>
                        <span className="mt-1 block text-[12px] leading-5 text-muted-foreground">
                          {item.description || "No description provided."}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
          {GROUPS.every((group) => canonical.scope[group.key].length === 0) && (
            <p className="text-[13px] text-muted-foreground">
              This package carries no open backlog items.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-hairline bg-surface-raise/30 shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Ban className="size-4 text-muted-foreground" />
            Excluded from scope
          </CardTitle>
          <p className="text-[12px] leading-5 text-muted-foreground">
            The customer explicitly excluded these items. Identifiers are
            preserved, they are never anchored to delivery work, and
            re-including one later is a recorded decision.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {excluded.length === 0 && (
            <p className="flex items-center gap-2 text-[13px] text-muted-foreground">
              <CircleSlash className="size-3.5" />
              Nothing was excluded from this package.
            </p>
          )}
          {excluded.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectItem(item)}
              className="w-full rounded-none border border-hairline/70 bg-background/30 px-4 py-4 text-left transition-colors hover:border-blocked/40"
            >
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-mono-data text-[11px] text-muted-foreground">
                  {item.id}
                </span>
                <span className="text-[13px]">{item.title}</span>
                <Badge
                  variant="outline"
                  className="border-hairline text-[11px] uppercase"
                >
                  {item.kind}
                </Badge>
              </span>
              {item.resolution && (
                <span className="mt-1 block text-[12px] leading-5 text-muted-foreground">
                  {item.resolution}
                </span>
              )}
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
