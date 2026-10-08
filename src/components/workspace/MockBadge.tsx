/**
 * The permanent mock-mode marker.
 *
 * The challenge requires the workflow to run in a clearly labelled mock mode, so
 * this badge is rendered in the workspace header, on the graph, and inside every
 * export. It is never conditional on anything the user does.
 */

import { cn } from "@/lib/utils";

export function MockBadge({ className, detail }: { className?: string; detail?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border border-review/50 px-2 py-1 font-mono-data text-[11px] uppercase tracking-[0.1em] text-review",
        className,
      )}
      title={detail ?? "No external AI service is contacted. Every recommendation is computed locally."}
    >
      <span aria-hidden className="size-1.5 bg-review" />
      Mock AI mode
    </span>
  );
}
