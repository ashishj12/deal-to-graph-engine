import { cn } from "@/lib/utils";

export function MockBadge({
  className,
  detail,
}: {
  className?: string;
  detail?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border border-review/50 px-2 py-1 font-mono-data text-[11px] uppercase tracking-widest text-review",
        className,
      )}
      title={
        detail ??
        "No external AI service is contacted. Every recommendation is computed locally."
      }
    >
      <span aria-hidden className="size-1.5 bg-review" />
      Mock AI mode
    </span>
  );
}
