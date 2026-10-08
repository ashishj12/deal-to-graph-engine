/**
 * Workspace session state.
 *
 * Only the operator's own decisions are persisted, never the imported package
 * text and never a credential: the imported packages are reloaded from the
 * vendored samples, and nothing here leaves the browser.
 *
 * Reading is guarded by try/catch and a schema version, so a stale or corrupted
 * entry degrades to a fresh session instead of breaking the app.
 */

import type { DealDecision, DecisionLog } from "@deal-to-challenge/engine";

export const SESSION_VERSION = 1;
export const STORAGE_KEY = "deal-to-challenge.session";

export const VIEW_IDS = [
  "import",
  "decomposition",
  "graph",
  "plan",
  "packages",
  "validation",
] as const;
export type ViewId = (typeof VIEW_IDS)[number];

export const VIEW_LABELS: Record<ViewId, { index: string; name: string; purpose: string }> = {
  import: { index: "01", name: "Import", purpose: "Upload, validate and assess a deal-scoping package" },
  decomposition: { index: "02", name: "Decomposition", purpose: "Generate, edit, split and approve delivery nodes" },
  graph: { index: "03", name: "Graph", purpose: "Dependencies, cycles, orphans and blocked nodes" },
  plan: { index: "04", name: "Execution plan", purpose: "Waves, critical path, effort and review checkpoints" },
  packages: { index: "05", name: "Packages", purpose: "Model-specific execution packages and handoff readiness" },
  validation: { index: "06", name: "Validate & export", purpose: "Coverage, change impact, quality gate and export" },
};

export interface PersistedSession {
  version: typeof SESSION_VERSION;
  activeSlug: string | null;
  view: ViewId;
  /** Decision log per deal id. Decisions only: no package text is stored. */
  decisions: Record<string, DecisionLog>;
}

export function emptySession(): PersistedSession {
  return { version: SESSION_VERSION, activeSlug: null, view: "import", decisions: {} };
}

export function loadSession(): PersistedSession {
  try {
    const raw = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return emptySession();
    const parsed = JSON.parse(raw) as Partial<PersistedSession>;
    if (parsed.version !== SESSION_VERSION) return emptySession();
    return {
      version: SESSION_VERSION,
      activeSlug: typeof parsed.activeSlug === "string" ? parsed.activeSlug : null,
      view: VIEW_IDS.includes(parsed.view as ViewId) ? (parsed.view as ViewId) : "import",
      decisions: typeof parsed.decisions === "object" && parsed.decisions !== null ? parsed.decisions : {},
    };
  } catch {
    // A corrupted or unavailable store must never stop the app from running.
    return emptySession();
  }
}

export function saveSession(session: PersistedSession): void {
  try {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage can be full or disabled; the session simply does not persist.
  }
}

export function clearSession(): void {
  try {
    globalThis.localStorage?.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do: the session was not persisted.
  }
}

/** Human-readable one-liner for the decision-log view. */
export function describeDecision(decision: DealDecision): string {
  const target = decision.targetNodeIds[0] ?? decision.targetEdgeIds[0] ?? "graph";
  return `${target}: ${decision.summary}`;
}

export const MODEL_LABEL: Record<string, string> = {
  "flexible-talent": "Flexible Talent",
  challenge: "Challenge",
  "private-pod": "Private Pod",
};

export const MODEL_CLASS: Record<string, string> = {
  "flexible-talent": "text-model-flexible border-model-flexible/40",
  challenge: "text-model-challenge border-model-challenge/40",
  "private-pod": "text-model-pod border-model-pod/40",
};

export const READINESS_CLASS: Record<string, string> = {
  ready: "text-ready border-ready/40",
  "review-required": "text-review border-review/40",
  blocked: "text-blocked border-blocked/50",
};
