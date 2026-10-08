import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ImportedPackage, ScopeItem } from "@deal-to-challenge/engine";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

const BOUNDARY_TONE: Record<string, string> = {
  ai: "border-model-pod/50 text-model-pod",
  human: "border-review/50 text-review",
  deterministic: "border-model-flexible/50 text-model-flexible",
};

function Chip({
  item,
  onSelect,
}: {
  item: ScopeItem;
  onSelect: (item: ScopeItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      title={item.title}
      className={cn(
        "rounded border border-hairline bg-background/40 px-2 py-0.5 font-mono-data text-[11px] transition-colors hover:border-model-pod/50",
        item.inScope
          ? "text-muted-foreground"
          : "text-muted-foreground/50 line-through",
      )}
    >
      {item.id}
      {item.critical && <span className="ml-1 text-blocked">•</span>}
    </button>
  );
}

export interface NormalizedPanelProps {
  result: ImportedPackage;
  onSelectItem: (item: ScopeItem) => void;
}

export function NormalizedPanel({
  result,
  onSelectItem,
}: NormalizedPanelProps) {
  const { canonical } = result;
  const requirementsByKind = new Map<string, ScopeItem[]>();
  for (const item of canonical.scope.requirements) {
    const bucket = requirementsByKind.get(item.kind) ?? [];
    bucket.push(item);
    requirementsByKind.set(item.kind, bucket);
  }

  const invalidFlows = canonical.architecture.flows.filter(
    (flow) => !flow.valid,
  );

  return (
    <div className="space-y-5">
      <Card className="border-hairline bg-surface-raise/30 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">Deal summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-px overflow-hidden rounded-none border border-hairline bg-hairline sm:grid-cols-3">
          {[
            { label: "Deal id", value: canonical.deal.id },
            { label: "Customer", value: canonical.deal.customer },
            { label: "Platform", value: canonical.config.cloudPlatform },
            {
              label: "Estimate confidence",
              value: canonical.delivery.confidence,
            },
            {
              label: "Effort (likely)",
              value: `${canonical.delivery.totals.likely ?? 0} days`,
            },
            { label: "Updated", value: canonical.deal.updatedAt ?? "unknown" },
            { label: "SHA-256", value: `${result.sha256.slice(0, 24)}…` },
            {
              label: "Size",
              value: `${(result.byteLength / 1024).toFixed(1)} KB`,
            },
            { label: "Schema", value: canonical.schemaVersion },
          ].map((entry) => (
            <div key={entry.label} className="bg-background px-4 py-3">
              <div className="font-mono-data text-[11px] uppercase tracking-widest text-muted-foreground">
                {entry.label}
              </div>
              <div className="mt-1.5 truncate font-mono-data text-[12px]">
                {entry.value}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-hairline bg-surface-raise/30 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">Scope requirements by kind</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from(requirementsByKind.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([kind, items]) => (
              <div key={kind}>
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[12px] font-medium">{kind}</span>
                  <span className="font-mono-data text-[11px] text-muted-foreground">
                    {items.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item) => (
                    <Chip key={item.id} item={item} onSelect={onSelectItem} />
                  ))}
                </div>
              </div>
            ))}
          {requirementsByKind.size === 0 && (
            <p className="text-[13px] text-muted-foreground">
              No requirements were found.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-hairline bg-surface-raise/30 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">Capabilities</CardTitle>
          <p className="text-[12px] leading-5 text-muted-foreground">
            Capability dependencies in the source are names, not identifiers.
            Resolved names are shown in teal; anything that could not be matched
            stays visible.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {canonical.functionalScope.capabilities.map((capability) => (
            <div
              key={capability.id}
              className="rounded-none border border-hairline/70 bg-background/30 p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono-data text-[11px] text-model-pod">
                  {capability.id}
                </span>
                <span className="text-[13px] font-medium">
                  {capability.name}
                </span>
                <Badge
                  variant="outline"
                  className="border-hairline text-[11px] uppercase"
                >
                  {capability.priority}
                </Badge>
              </div>
              <p className="mt-1.5 text-[12px] leading-5 text-muted-foreground">
                {capability.description}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {capability.requirementIds.map((id) => (
                  <span
                    key={id}
                    className="rounded border border-hairline px-1.5 py-0.5 font-mono-data text-[11px] text-muted-foreground"
                  >
                    {id}
                  </span>
                ))}
                {capability.resolvedDependencies.map((id) => (
                  <span
                    key={id}
                    className="rounded border border-model-flexible/40 px-1.5 py-0.5 font-mono-data text-[11px] text-model-flexible"
                  >
                    → {id}
                  </span>
                ))}
                {capability.unresolvedDependencies.map((name) => (
                  <span
                    key={name}
                    className="rounded border border-blocked/40 px-1.5 py-0.5 font-mono-data text-[11px] text-blocked"
                  >
                    unresolved: {name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-hairline bg-surface-raise/30 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">
            Architecture — {canonical.architecture.components.length}{" "}
            components, {canonical.architecture.flows.length} flows
          </CardTitle>
          {invalidFlows.length > 0 && (
            <p className="text-[12px] text-blocked">
              {invalidFlows.length} flow(s) reference undefined components and
              were kept visible rather than dropped.
            </p>
          )}
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          {canonical.architecture.components.map((component) => (
            <div
              key={component.id}
              className="rounded-none border border-hairline/70 bg-background/30 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono-data text-[11px] text-model-pod">
                  {component.id}
                </span>
                <span className="font-mono-data text-[11px] text-muted-foreground">
                  {component.area}
                </span>
              </div>
              <div className="mt-1.5 text-[13px] leading-5">
                {component.logicalComponent}
              </div>
              <div className="font-mono-data text-[11px] text-muted-foreground">
                {component.service || "service unspecified"}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-hairline bg-surface-raise/30 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">Data domains and interfaces</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {canonical.strategy.dataDomains.map((domain) => (
              <span
                key={domain.id}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded border px-2 py-1 font-mono-data text-[11px]",
                  domain.regulated
                    ? "border-blocked/40 text-blocked"
                    : "border-hairline text-muted-foreground",
                )}
              >
                {domain.regulated && <ShieldCheck className="size-3" />}
                {domain.id} · {domain.name}
                <span className="text-muted-foreground/70">
                  {domain.classification}
                </span>
              </span>
            ))}
          </div>

          {canonical.strategy.integrations.length > 0 ? (
            <div className="overflow-hidden rounded-none border border-hairline">
              <table className="w-full text-left text-[12px]">
                <thead className="bg-background/60 font-mono-data text-[11px] uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Id</th>
                    <th className="px-3 py-2">Interface</th>
                    <th className="px-3 py-2">Pattern</th>
                    <th className="px-3 py-2">System</th>
                    <th className="px-3 py-2">Direction</th>
                  </tr>
                </thead>
                <tbody>
                  {canonical.strategy.integrations.map((integration) => (
                    <tr
                      key={integration.id}
                      className="border-t border-hairline"
                    >
                      <td className="px-3 py-2 font-mono-data text-[11px] text-model-pod">
                        {integration.id}
                      </td>
                      <td className="px-3 py-2">{integration.name}</td>
                      <td className="px-3 py-2 font-mono-data text-[11px]">
                        {integration.pattern}
                      </td>
                      <td className="px-3 py-2 font-mono-data text-[11px] text-muted-foreground">
                        {integration.systemType}
                      </td>
                      <td className="px-3 py-2 font-mono-data text-[11px] text-muted-foreground">
                        {integration.direction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-none border border-review/40 bg-review/5 p-3 text-[12px] text-review">
              No interface designs were produced, even though integration
              requirements exist. That is a discovery signal, not an empty list.
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-hairline bg-surface-raise/30 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">
            AI strategy{" "}
            {canonical.strategy.aiUseCases.length > 0 ? "" : "(not applicable)"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {canonical.strategy.aiUseCases.map((useCase) => (
            <div
              key={useCase.id}
              className="rounded-none border border-hairline/70 bg-background/30 p-4"
            >
              <span className="font-mono-data text-[11px] text-model-pod">
                {useCase.id}
              </span>
              <div className="mt-1 text-[13px] font-medium">{useCase.name}</div>
              <p className="mt-1 text-[12px] leading-5 text-muted-foreground">
                {useCase.description}
              </p>
            </div>
          ))}
          {canonical.strategy.aiBoundaries.length > 0 && (
            <div className="space-y-1.5">
              <p className="font-mono-data text-[11px] uppercase tracking-widest text-muted-foreground">
                decision boundaries
              </p>
              {canonical.strategy.aiBoundaries.map((boundary, index) => (
                <div
                  key={`${boundary.activity}-${index}`}
                  className="flex flex-wrap items-center gap-2 text-[12px]"
                >
                  <Badge
                    variant="outline"
                    className={cn(
                      "font-mono-data text-[11px] uppercase",
                      BOUNDARY_TONE[boundary.type] ??
                        "border-hairline text-muted-foreground",
                    )}
                  >
                    {boundary.type}
                  </Badge>
                  <span>{boundary.activity}</span>
                  <span className="text-muted-foreground">
                    — {boundary.reason}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-hairline bg-surface-raise/30 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">
            Delivery estimate — {canonical.delivery.workstreams.length}{" "}
            workstreams
          </CardTitle>
          <p className="text-[12px] leading-5 text-muted-foreground">
            Effort is imported verbatim from the estimate. Commercial rates are
            ignored: this tool never commits funding.
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {canonical.delivery.workstreams.map((workstream) => (
            <div
              key={workstream.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-none border border-hairline bg-background/40 px-3 py-2"
            >
              <span className="min-w-0">
                <span className="font-mono-data text-[11px] text-model-pod">
                  {workstream.id}
                </span>
                <span className="ml-2 text-[13px]">{workstream.name}</span>
              </span>
              <span className="flex items-center gap-3 font-mono-data text-[11px] text-muted-foreground">
                <span>
                  {workstream.roles.join(", ") || "roles unspecified"}
                </span>
                <span className="text-foreground">
                  {workstream.low ?? "–"} / {workstream.likely ?? "–"} /{" "}
                  {workstream.high ?? "–"}
                </span>
              </span>
            </div>
          ))}
          {canonical.delivery.missingInputs.length > 0 && (
            <p className="rounded-none border border-review/40 bg-review/5 p-3 text-[12px] text-review">
              Missing estimate inputs:{" "}
              {canonical.delivery.missingInputs.join(", ")}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="border-hairline bg-surface-raise/30 shadow-none">
        <CardHeader>
          <CardTitle className="text-sm">Imported quality findings</CardTitle>
          <p className="text-[12px] leading-5 text-muted-foreground">
            Carried through verbatim and marked as imported. This engine adds
            its own findings separately and never re-scores the source.
          </p>
        </CardHeader>
        <CardContent className="space-y-1.5">
          {canonical.quality.findings.map((finding, index) => (
            <div
              key={`${finding.checkId}-${index}`}
              className="flex items-start gap-2 text-[12px] leading-5"
            >
              <Badge
                variant="outline"
                className={cn(
                  "mt-0.5 shrink-0 font-mono-data text-[11px] uppercase",
                  finding.status === "warn"
                    ? "border-review/40 text-review"
                    : "border-ready/40 text-ready",
                )}
              >
                {finding.status}
              </Badge>
              <span className="text-muted-foreground">
                <span className="text-foreground">{finding.checkName}</span> —{" "}
                {finding.message}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
