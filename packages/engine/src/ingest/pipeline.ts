import { safeParse } from "./json";
import { normalizePackage, scanReferences, type StructuralFindings } from "./normalize";
import { validatePackage } from "./validate";
import { assessMaturity } from "./maturity";
import type {
  CanonicalPackage,
  ImportedPackage,
  MaturityAssessment,
  PlatformConflict,
  ValidationIssue,
  ValidationReport,
} from "../canonical/types";

/** Default import ceiling; configurable by callers that need more. */
export const MAX_IMPORT_BYTES = 10 * 1024 * 1024;

export async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function emptyCanonical(): CanonicalPackage {
  return {
    schemaVersion: "1.0",
    deal: {
      id: "DEAL_UNPARSED",
      title: "Unreadable package",
      customer: "unknown",
      maturity: "",
      platform: "unspecified",
      confidence: "unknown",
      updatedAt: null,
    },
    scope: {
      requirements: [],
      assumptions: [],
      questions: [],
      gaps: [],
      risks: [],
      dependencies: [],
    },
    functionalScope: {
      capabilities: [],
      modules: [],
      workstreams: [],
      deliveryPackages: [],
      enhancements: [],
      outOfScope: [],
    },
    architecture: { platform: "unspecified", components: [], flows: [] },
    strategy: { dataDomains: [], integrations: [], aiUseCases: [], aiBoundaries: [] },
    delivery: {
      phases: [],
      workstreams: [],
      confidence: "unknown",
      missingInputs: [],
      totals: { low: null, likely: null, high: null },
    },
    quality: { status: "unknown", findings: [], checksPassed: 0, checksWarned: 0 },
    config: {
      cloudPlatform: "unspecified",
      expectedUsers: null,
      deadline: null,
      environments: null,
      targetRegions: [],
    },
  };
}

function blockedReport(issue: ValidationIssue): ValidationReport {
  return {
    issues: [issue],
    counts: { error: 1, warning: 0, info: 0 },
    passed: false,
    sections: [],
    referenceCounts: {},
  };
}

function blockedMaturity(reason: string): MaturityAssessment {
  return {
    level: "blocked",
    score: 0,
    summary: reason,
    reasons: [
      {
        code: "import-failed",
        label: reason,
        severity: "critical",
        delta: -100,
        sourceIds: [],
      },
    ],
    gatingItems: [],
    missingCoreInputs: [],
    counts: {
      openQuestions: 0,
      openGaps: 0,
      unvalidatedAssumptions: 0,
      openRisks: 0,
      criticalOpen: 0,
      warnChecks: 0,
      unreviewedSections: 0,
      staleSections: 0,
      excludedItems: 0,
    },
  };
}

const NO_CONFLICT: PlatformConflict = {
  detected: false,
  claims: [],
  resolved: false,
  summary: "No platform conflict detected.",
};

/**
 * The single entry point used by both the browser workspace and the CLI.
 * Pure with respect to its inputs: the same text always produces the same
 * `ImportedPackage` (the only ambient value is the SHA-256 of the text).
 */
export async function runImport(fileName: string, text: string): Promise<ImportedPackage> {
  const byteLength = new TextEncoder().encode(text).length;
  const sha256 = await sha256Hex(text);

  if (byteLength > MAX_IMPORT_BYTES) {
    const issue: ValidationIssue = {
      id: "ISSUE_001",
      severity: "error",
      code: "file-too-large",
      message: `The package is ${(byteLength / 1024 / 1024).toFixed(1)} MB, above the ${MAX_IMPORT_BYTES / 1024 / 1024} MB import limit.`,
      path: ".",
      sourceIds: [],
      remediation: "Import a smaller export, or raise the limit for this session.",
    };
    return {
      fileName,
      byteLength,
      sha256,
      raw: null,
      rawText: "",
      canonical: emptyCanonical(),
      sourceIndex: [],
      report: blockedReport(issue),
      conflict: NO_CONFLICT,
      maturity: blockedMaturity("The package could not be imported."),
    };
  }

  const parsed = safeParse(text);

  if (!parsed.ok) {
    const error = parsed.error ?? { message: "Invalid JSON.", line: 1, column: 1 };
    const issue: ValidationIssue = {
      id: "ISSUE_001",
      severity: "error",
      code: "json-parse-error",
      message: `${error.message} (line ${error.line}, column ${error.column})`,
      path: ".",
      sourceIds: [],
      remediation: "Fix the JSON syntax and re-import. The original text is preserved unmodified.",
    };
    return {
      fileName,
      byteLength,
      sha256,
      raw: null,
      rawText: text,
      canonical: emptyCanonical(),
      sourceIndex: [],
      report: blockedReport(issue),
      conflict: NO_CONFLICT,
      maturity: blockedMaturity("The package is not valid JSON, so it cannot be assessed."),
    };
  }

  const raw = parsed.value;
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    const issue: ValidationIssue = {
      id: "ISSUE_001",
      severity: "error",
      code: "not-a-workspace-export",
      message: "The file is valid JSON but is not an object, so it is not a deal-scoping export.",
      path: ".",
      sourceIds: [],
      remediation: "Import a workspace export produced by the deal-scoping tool.",
    };
    return {
      fileName,
      byteLength,
      sha256,
      raw,
      rawText: text,
      canonical: emptyCanonical(),
      sourceIndex: [],
      report: blockedReport(issue),
      conflict: NO_CONFLICT,
      maturity: blockedMaturity("The file is not a deal-scoping export."),
    };
  }

  const normalized = normalizePackage(raw);
  const scan = scanReferences(raw, normalized.sourceIndex);

  const findings: StructuralFindings = {
    ...normalized.findings,
    danglingRefs: scan.danglingRefs,
    quoteMismatches: scan.quoteMismatches,
  };

  const { report, conflict } = validatePackage({
    raw,
    rawText: text,
    normalized,
    structural: findings,
    duplicateJsonKeys: parsed.duplicateKeys,
    strippedKeys: parsed.strippedKeys,
  });

  const reportWithCounts: ValidationReport = {
    ...report,
    referenceCounts: Object.keys(report.referenceCounts).length
      ? report.referenceCounts
      : Object.fromEntries(
          Object.entries(scan.referenceCounts).sort(([a], [b]) => a.localeCompare(b)),
        ),
  };

  const maturity = assessMaturity({
    canonical: normalized.canonical,
    report: reportWithCounts,
    conflict,
  });

  normalized.canonical.deal.maturity = maturity.level;

  return {
    fileName,
    byteLength,
    sha256,
    raw,
    rawText: text,
    canonical: normalized.canonical,
    sourceIndex: normalized.sourceIndex,
    report: reportWithCounts,
    conflict,
    maturity,
  };
}
