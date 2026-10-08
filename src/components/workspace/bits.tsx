/** Small presentational primitives shared by the six workspaces. */

import { cn } from "@/lib/utils";
import type { Provenance, Readiness } from "@deal-to-challenge/engine";
import { provenanceLabel } from "@deal-to-challenge/engine";

export const MODEL_TEXT: Record<string, string> = {
  "flexible-talent": "text-model-flexible",
  challenge: "text-model-challenge",
  "private-pod": "text-model-pod",
};

export const MODEL_BORDER: Record<string, string> = {
  "flexible-talent": "border-model-flexible/50",
  challenge: "border-model-challenge/50",
  "private-pod": "border-model-pod/50",
};

export const MODEL_NAME: Record<string, string> = {
  "flexible-talent": "Flexible Talent",
  challenge: "Challenge",
  "private-pod": "Private Pod",
};

/** Short model marks, so the encoding is never colour-only. */
export const MODEL_MARK: Record<string, string> = {
  "flexible-talent": "FT",
  challenge: "CH",
  "private-pod": "PP",
};

export const READINESS_TEXT: Record<string, string> = {
  ready: "text-ready",
  "review-required": "text-review",
  blocked: "text-blocked",
};

export const PROVENANCE_TEXT: Record<string, string> = {
  imported: "text-foreground",
  "ai-inferred": "text-model-challenge",
  "ai-recommended": "text-model-challenge",
  "user-created": "text-signal",
  "user-approved": "text-signal",
  deterministic: "text-model-pod",
};

export function Chip({
  children,
  tone = "text-muted-foreground border-hairline",
  title,
  className,
}: {
  children: React.ReactNode;
  tone?: string;
  title?: string;
  className?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex shrink-0 items-center gap-1 border px-1.5 py-0.5 font-mono-data text-[10px] tracking-[0.08em] uppercase",
        tone,
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ModelChip({ model, confidence }: { model: string; confidence?: string }) {
  return (
    <Chip
      tone={cn(MODEL_TEXT[model] ?? "text-muted-foreground", MODEL_BORDER[model] ?? "border-hairline")}
      title={confidence ? `Classification confidence: ${confidence}` : undefined}
    >
      {MODEL_MARK[model] ?? "??"} {MODEL_NAME[model] ?? model}
    </Chip>
  );
}

export function ReadinessChip({ readiness }: { readiness: Readiness | string }) {
  return (
    <Chip tone={cn(READINESS_TEXT[readiness] ?? "text-muted-foreground", "border-current/40")}>
      {String(readiness).replace(/-/g, " ")}
    </Chip>
  );
}

export function ProvenanceChip({ provenance }: { provenance: Provenance }) {
  return (
    <Chip
      tone={cn(PROVENANCE_TEXT[provenance] ?? "text-muted-foreground", "border-hairline")}
      title="Origin of this item. Imported and user-reviewed information outranks AI recommendations."
    >
      {provenanceLabel(provenance)}
    </Chip>
  );
}

export function SectionTitle({
  index,
  title,
  detail,
  right,
}: {
  index?: string;
  title: string;
  detail?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 border-b border-rule-strong pb-3">
      <div className="min-w-0">
        <h3 className="flex items-baseline gap-2 text-[15px] font-[600] tracking-[-0.01em]">
          {index && <span className="font-mono-data text-[11px] text-muted-foreground">{index}</span>}
          {title}
        </h3>
        {detail && (
          <p className="mt-1 max-w-3xl text-[12px] leading-5 text-muted-foreground">{detail}</p>
        )}
      </div>
      {right}
    </div>
  );
}

export function Metric({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  tone?: string;
}) {
  return (
    <div className="min-w-0 border border-hairline px-3 py-2.5">
      <div className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
        {label}
      </div>
      <div className={cn("mt-1.5 font-mono-data text-[17px] tabular-nums", tone)}>{value}</div>
      {hint && <div className="mt-1 text-[11px] leading-4 text-muted-foreground/80">{hint}</div>}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="font-mono-data text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
        {label}
      </div>
      <div className="mt-1.5 text-[12.5px] leading-6 break-words">{children}</div>
    </div>
  );
}

export function Bullets({
  items,
  empty,
  tone,
}: {
  items: string[];
  empty: string;
  tone?: string;
}) {
  if (items.length === 0) {
    return <p className="font-mono-data text-[11px] text-muted-foreground/70">{empty}</p>;
  }
  return (
    <ul className={cn("space-y-1.5 text-[12.5px] leading-6", tone)}>
      {items.map((item, index) => (
        <li key={`${index}-${item}`} className="flex gap-2">
          <span aria-hidden className="mt-2.5 size-1 shrink-0 bg-current opacity-50" />
          <span className="break-words">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** A horizontal proportion bar used for effort and model distribution. */
export function StackedBar({
  segments,
}: {
  segments: { value: number; className: string; label: string }[];
}) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  if (total === 0) return <div className="h-1.5 w-full bg-hairline" />;
  return (
    <div className="flex h-1.5 w-full overflow-hidden bg-hairline">
      {segments.map((segment) => (
        <span
          key={segment.label}
          className={cn("h-full", segment.className)}
          style={{ width: `${(segment.value / total) * 100}%` }}
          title={`${segment.label}: ${segment.value}`}
        />
      ))}
    </div>
  );
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="border border-dashed border-hairline px-4 py-6 text-center font-mono-data text-[11px] tracking-[0.06em] text-muted-foreground uppercase">
      {children}
    </p>
  );
}
