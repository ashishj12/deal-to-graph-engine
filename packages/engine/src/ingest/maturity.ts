import type {
  CanonicalPackage,
  MaturityAssessment,
  MaturityLevel,
  MaturityReason,
  PlatformConflict,
  ValidationReport,
} from "../canonical/types";

export interface MaturityInput {
  canonical: CanonicalPackage;
  report: ValidationReport;
  conflict: PlatformConflict;
}

const LEVEL_ORDER: MaturityLevel[] = [
  "execution-candidate",
  "review-required",
  "discovery-required",
  "blocked",
];

function worst(a: MaturityLevel, b: MaturityLevel): MaturityLevel {
  return LEVEL_ORDER.indexOf(a) >= LEVEL_ORDER.indexOf(b) ? a : b;
}

/**
 * Deterministic maturity assessment.
 *
 * Every rule is data-driven and recorded as a `MaturityReason` so the UI can
 * show *why* a package landed at its level. The four supplied packages must
 * never reach `execution-candidate`; a synthetic fixture proves the ladder
 * still has a top rung.
 */
export function assessMaturity(input: MaturityInput): MaturityAssessment {
  const { canonical, report, conflict } = input;
  const reasons: MaturityReason[] = [];

  const openQuestions = canonical.scope.questions.filter(
    (item) => !item.resolved && item.inScope,
  );
  const openGaps = canonical.scope.gaps.filter((item) => !item.resolved && item.inScope);
  const unvalidatedAssumptions = canonical.scope.assumptions.filter(
    (item) => !item.resolved && !/approved|validated/i.test(item.review) && item.inScope,
  );
  const openRisks = canonical.scope.risks.filter((item) => !item.resolved && item.inScope);
  const criticalOpen = [...canonical.scope.gaps, ...canonical.scope.questions].filter(
    (item) => item.critical && !item.resolved && item.inScope,
  );
  const warnChecks = canonical.quality.checksWarned;
  const unreviewedSections = report.sections.filter((section) => section.reviewed === false).length;
  const staleSections = report.sections.filter((section) => section.status === "stale").length;

  const missingCoreInputs: string[] = [];
  if (canonical.config.expectedUsers === null) missingCoreInputs.push("expected users");
  if (canonical.config.environments === null) missingCoreInputs.push("environments");
  if (canonical.config.targetRegions.length === 0) missingCoreInputs.push("target regions");
  if (canonical.config.deadline === null) missingCoreInputs.push("target deadline");

  const nfrCount = canonical.scope.requirements.filter(
    (item) => item.kind === "nonFunctional",
  ).length;
  const integrationRequirements = canonical.scope.requirements.filter(
    (item) => item.kind === "integration",
  ).length;

  let level: MaturityLevel = "execution-candidate";

  const add = (
    code: string,
    label: string,
    severity: MaturityReason["severity"],
    delta: number,
    at: MaturityLevel,
    sourceIds: string[] = [],
  ) => {
    reasons.push({ code, label, severity, delta, sourceIds });
    level = worst(level, at);
  };

  /* ---- blocking conditions ---- */
  if (report.counts.error > 0) {
    add(
      "structural-errors",
      `${report.counts.error} structural error(s) prevent normalisation from being trusted.`,
      "critical",
      -40,
      "blocked",
    );
  }

  /* ---- discovery conditions ---- */
  if (criticalOpen.length >= 3) {
    add(
      "critical-backlog",
      `${criticalOpen.length} critical gaps or questions are unresolved.`,
      "critical",
      -25,
      "discovery-required",
      criticalOpen.map((item) => item.id),
    );
  }

  if (canonical.delivery.confidence.toLowerCase() === "low") {
    add(
      "low-estimate-confidence",
      "The estimate confidence is Low, so effort and sequencing cannot be trusted yet.",
      "critical",
      -20,
      "discovery-required",
    );
  }

  if (missingCoreInputs.length >= 2) {
    add(
      "missing-core-inputs",
      `Core estimation inputs are missing: ${missingCoreInputs.join(", ")}.`,
      "critical",
      -15,
      "discovery-required",
    );
  }

  if (nfrCount === 0) {
    add(
      "no-non-functional-requirements",
      "No non-functional requirements were captured (performance, availability, retention).",
      "critical",
      -10,
      "discovery-required",
    );
  }

  if (integrationRequirements > 0 && canonical.strategy.integrations.length === 0) {
    add(
      "unknown-integrations",
      `${integrationRequirements} integration requirement(s) exist but no interface design was produced.`,
      "critical",
      -10,
      "discovery-required",
    );
  }

  /* ---- review conditions ---- */
  if (criticalOpen.length > 0 && criticalOpen.length < 3) {
    add(
      "critical-items-open",
      `${criticalOpen.length} critical item(s) remain open.`,
      "warning",
      -8,
      "review-required",
      criticalOpen.map((item) => item.id),
    );
  }

  if (conflict.detected && !conflict.resolved) {
    add(
      "platform-conflict",
      conflict.summary,
      "warning",
      -10,
      "review-required",
      conflict.claims.map((claim) => claim.refId ?? "").filter(Boolean),
    );
  }

  if (unvalidatedAssumptions.length > 0) {
    add(
      "unvalidated-assumptions",
      `${unvalidatedAssumptions.length} assumption(s) have not been validated.`,
      "warning",
      -6,
      "review-required",
      unvalidatedAssumptions.map((item) => item.id),
    );
  }

  if (warnChecks > 0) {
    add(
      "quality-warnings",
      `${warnChecks} upstream quality check(s) returned a warning.`,
      "warning",
      -5,
      "review-required",
    );
  }

  if (staleSections > 0) {
    add(
      "stale-sections",
      `${staleSections} output section(s) are stale or version-mismatched.`,
      "warning",
      -6,
      "review-required",
    );
  }

  if (unreviewedSections > 0) {
    add(
      "unreviewed-sections",
      `${unreviewedSections} output section(s) have not been reviewed.`,
      "warning",
      -5,
      "review-required",
    );
  }

  if (openQuestions.length > 0) {
    add(
      "open-questions",
      `${openQuestions.length} question(s) remain unanswered.`,
      "warning",
      -4,
      "review-required",
      openQuestions.map((item) => item.id),
    );
  }

  if (openGaps.length > 0) {
    add(
      "open-gaps",
      `${openGaps.length} capability gap(s) remain open.`,
      "warning",
      -4,
      "review-required",
      openGaps.map((item) => item.id),
    );
  }

  if (missingCoreInputs.length === 1) {
    add(
      "missing-input",
      `A core estimation input is missing: ${missingCoreInputs[0]}.`,
      "warning",
      -4,
      "review-required",
    );
  }

  if (openRisks.length > 0) {
    add(
      "open-risks",
      `${openRisks.length} risk(s) are open without an owner resolution.`,
      "info",
      -2,
      "review-required",
      openRisks.map((item) => item.id),
    );
  }

  const score = Math.max(
    0,
    Math.min(
      100,
      reasons.reduce((total, reason) => total + reason.delta, 100),
    ),
  );

  const gatingItems = Array.from(
    new Set(reasons.flatMap((reason) => reason.sourceIds)),
  ).sort();

  const summary = summarise(level, canonical, criticalOpen.length, missingCoreInputs.length);

  return {
    level,
    score,
    summary,
    reasons: reasons.sort((a, b) => a.delta - b.delta || a.code.localeCompare(b.code)),
    gatingItems,
    missingCoreInputs,
    counts: {
      openQuestions: openQuestions.length,
      openGaps: openGaps.length,
      unvalidatedAssumptions: unvalidatedAssumptions.length,
      openRisks: openRisks.length,
      criticalOpen: criticalOpen.length,
      warnChecks,
      unreviewedSections,
      staleSections,
      excludedItems: [...canonical.scope.requirements, ...canonical.scope.gaps, ...canonical.scope.questions]
        .filter((item) => !item.inScope).length,
    },
  };
}

function summarise(
  level: MaturityLevel,
  canonical: CanonicalPackage,
  criticalOpen: number,
  missingInputs: number,
): string {
  switch (level) {
    case "blocked":
      return "Structural errors prevent this package from being normalized reliably. Fix the import errors before planning.";
    case "discovery-required":
      return `This package is not ready for delivery planning. ${criticalOpen} critical item(s) and ${missingInputs} missing core input(s) mean discovery and clarification work must come first.`;
    case "review-required":
      return "The package can be planned with review checkpoints. Open questions, assumptions and quality warnings must be reviewed before any node is handed to delivery.";
    case "execution-candidate":
      return `This package is complete enough to compile directly into delivery nodes (${canonical.delivery.confidence} confidence estimate).`;
  }
}
