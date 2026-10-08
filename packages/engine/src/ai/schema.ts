export type AISurface =
  | "decompose"
  | "recommend-model"
  | "suggest-dependencies"
  | "draft-package"
  | "explain-impact";

export interface AIProposal {
  id: string;
  title: string;
  objective: string;
  workCategory: string;
  kind: string;
  sourceIds: string[];
  rationale: string;
}

export interface SchemaIssue {
  path: string;
  message: string;
}

export interface ValidationResult<T> {
  ok: boolean;
  value: T | null;
  issues: SchemaIssue[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function checkString(
  value: unknown,
  path: string,
  issues: SchemaIssue[],
): string | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    issues.push({ path, message: "expected a non-empty string" });
    return null;
  }
  return value;
}

function checkStringArray(
  value: unknown,
  path: string,
  issues: SchemaIssue[],
): string[] | null {
  if (
    !Array.isArray(value) ||
    value.some((entry) => typeof entry !== "string")
  ) {
    issues.push({ path, message: "expected an array of strings" });
    return null;
  }
  return value as string[];
}

export function validateDecomposition(
  value: unknown,
): ValidationResult<AIProposal[]> {
  const issues: SchemaIssue[] = [];
  if (!Array.isArray(value)) {
    return {
      ok: false,
      value: null,
      issues: [{ path: "$", message: "expected an array" }],
    };
  }
  const proposals: AIProposal[] = [];
  value.forEach((entry, index) => {
    const path = `$[${index}]`;
    if (!isRecord(entry)) {
      issues.push({ path, message: "expected an object" });
      return;
    }
    const id = checkString(entry.id, `${path}.id`, issues);
    const title = checkString(entry.title, `${path}.title`, issues);
    const objective = checkString(entry.objective, `${path}.objective`, issues);
    const workCategory = checkString(
      entry.workCategory,
      `${path}.workCategory`,
      issues,
    );
    const kind = checkString(entry.kind, `${path}.kind`, issues);
    const rationale = checkString(entry.rationale, `${path}.rationale`, issues);
    const sourceIds = checkStringArray(
      entry.sourceIds,
      `${path}.sourceIds`,
      issues,
    );
    if (sourceIds && sourceIds.length === 0) {
      issues.push({
        path: `${path}.sourceIds`,
        message: "a proposal must cite at least one source id",
      });
    }
    if (
      id &&
      title &&
      objective &&
      workCategory &&
      kind &&
      rationale &&
      sourceIds &&
      sourceIds.length > 0
    ) {
      proposals.push({
        id,
        title,
        objective,
        workCategory,
        kind,
        rationale,
        sourceIds,
      });
    }
  });
  return {
    ok: issues.length === 0 && proposals.length === value.length,
    value: proposals,
    issues,
  };
}

/** Validate a model recommendation: exactly one of the three operating models. */
export function validateModelRecommendation(
  value: unknown,
): ValidationResult<{
  primary: string;
  alternatives: string[];
  rationale: string[];
}> {
  const allowed = ["flexible-talent", "challenge", "private-pod"];
  const issues: SchemaIssue[] = [];
  if (!isRecord(value)) {
    return {
      ok: false,
      value: null,
      issues: [{ path: "$", message: "expected an object" }],
    };
  }
  const primary = checkString(value.primary, "$.primary", issues);
  if (primary && !allowed.includes(primary)) {
    issues.push({
      path: "$.primary",
      message: `unknown operating model "${primary}"`,
    });
  }
  const alternatives = checkStringArray(
    value.alternatives,
    "$.alternatives",
    issues,
  );
  if (alternatives) {
    for (const [index, alternative] of alternatives.entries()) {
      if (!allowed.includes(alternative)) {
        issues.push({
          path: `$.alternatives[${index}]`,
          message: `unknown operating model "${alternative}"`,
        });
      }
      if (alternative === primary) {
        issues.push({
          path: `$.alternatives[${index}]`,
          message: "alternative repeats the primary model",
        });
      }
    }
  }
  const rationale = checkStringArray(value.rationale, "$.rationale", issues);
  if (rationale && rationale.length === 0) {
    issues.push({
      path: "$.rationale",
      message: "a recommendation needs at least one reason",
    });
  }
  if (issues.length > 0) return { ok: false, value: null, issues };
  return {
    ok: true,
    value: {
      primary: primary as string,
      alternatives: alternatives as string[],
      rationale: rationale as string[],
    },
    issues,
  };
}

/** Validate suggested dependencies: endpoints and edge types must be known. */
export function validateDependencies(
  value: unknown,
  nodeIds: readonly string[],
  edgeTypes: readonly string[],
): ValidationResult<
  { source: string; target: string; type: string; rationale: string }[]
> {
  const issues: SchemaIssue[] = [];
  if (!Array.isArray(value)) {
    return {
      ok: false,
      value: null,
      issues: [{ path: "$", message: "expected an array" }],
    };
  }
  const edges: {
    source: string;
    target: string;
    type: string;
    rationale: string;
  }[] = [];
  value.forEach((entry, index) => {
    const path = `$[${index}]`;
    if (!isRecord(entry)) {
      issues.push({ path, message: "expected an object" });
      return;
    }
    const source = checkString(entry.source, `${path}.source`, issues);
    const target = checkString(entry.target, `${path}.target`, issues);
    const type = checkString(entry.type, `${path}.type`, issues);
    const rationale = checkString(entry.rationale, `${path}.rationale`, issues);
    if (source && !nodeIds.includes(source)) {
      issues.push({
        path: `${path}.source`,
        message: `unknown node "${source}"`,
      });
    }
    if (target && !nodeIds.includes(target)) {
      issues.push({
        path: `${path}.target`,
        message: `unknown node "${target}"`,
      });
    }
    if (type && !edgeTypes.includes(type)) {
      issues.push({
        path: `${path}.type`,
        message: `unknown edge type "${type}"`,
      });
    }
    if (source && target && source === target) {
      issues.push({ path, message: "an edge cannot point at its own node" });
    }
    if (
      source &&
      target &&
      type &&
      rationale &&
      nodeIds.includes(source) &&
      nodeIds.includes(target) &&
      source !== target
    ) {
      edges.push({ source, target, type, rationale });
    }
  });
  return { ok: issues.length === 0, value: edges, issues };
}

/** Validate a drafted package: plain string or string-array values only. */
export function validatePackageDraft(
  value: unknown,
): ValidationResult<Record<string, string | string[]>> {
  const issues: SchemaIssue[] = [];
  if (!isRecord(value)) {
    return {
      ok: false,
      value: null,
      issues: [{ path: "$", message: "expected an object" }],
    };
  }
  const draft: Record<string, string | string[]> = {};
  for (const [key, entry] of Object.entries(value)) {
    if (typeof entry === "string") {
      draft[key] = entry;
      continue;
    }
    if (
      Array.isArray(entry) &&
      entry.every((item) => typeof item === "string")
    ) {
      draft[key] = entry as string[];
      continue;
    }
    issues.push({
      path: `$.${key}`,
      message: "expected a string or an array of strings",
    });
  }
  return { ok: issues.length === 0, value: draft, issues };
}
