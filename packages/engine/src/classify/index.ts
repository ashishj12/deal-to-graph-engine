import type {
  Confidence,
  ModelScore,
  OperatingModelRecommendation,
} from "../canonical/execution";
import type { MaturityLevel, OperatingModel } from "../canonical/types";

export interface ClassificationInput {
  nodeId: string;
  title: string;
  workCategory: string;
  kind: string;
  sourceIds: string[];
  roles: string[];
  componentIds: string[];
  integrationIds: string[];
  domainIds: string[];
  /** True when any touched data domain is classified regulated/restricted/confidential. */
  sensitiveData: boolean;
  securityRequirementIds: string[];
  /** Acceptance conditions exist in the package for this node. */
  acceptanceMeasurable: boolean;
  effortMaximum: number | null;
  /** Delivery phases this node's sources span. */
  phaseCount: number;
  /** Open gaps/questions/assumptions that gate this node. */
  openSourceIds: string[];
  deliverableCount: number;
  humanReviewRequired: boolean;
  maturity: MaturityLevel;
}

type Model = OperatingModel;

export interface FeatureDefinition {
  id: string;
  label: string;
  weight: number;
  points: Record<Model, number>;
  /** Plain-English reason used when this feature moved the decision. */
  reason: string;
}

/** Categories where competitive exploration is genuinely valuable. */
const EXPLORATION_CATEGORIES = new Set([
  "ux-design",
  "ai-implementation",
  "testing",
  "documentation",
]);
/** Categories that require several roles working together. */
const INTEGRATIVE_CATEGORIES = new Set([
  "integration",
  "data-engineering",
  "cloud-devops",
  "security",
  "backend-api",
]);
/** Categories that are commonly one specialist with a defined skill set. */
const SPECIALIST_CATEGORIES = new Set([
  "technical-review",
  "documentation",
  "deployment",
  "discovery",
]);

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function computeFeatures(input: ClassificationInput): FeatureDefinition[] {
  const isExploration = EXPLORATION_CATEGORIES.has(input.workCategory);
  const isIntegrative = INTEGRATIVE_CATEGORIES.has(input.workCategory);
  const isSpecialist = SPECIALIST_CATEGORIES.has(input.workCategory);
  const componentCount = input.componentIds.length;
  const roleCount = input.roles.length;
  const openCount = input.openSourceIds.length;

  // Facts the features are built from. Each is a 0..1 intensity, not a decision.
  const scopeClarity = clamp01(
    (input.kind === "delivery" ? 0.7 : 0.3) +
      (input.acceptanceMeasurable ? 0.3 : 0) -
      openCount * 0.35,
  );
  const teamSize = clamp01(
    roleCount <= 1 ? 0.1 : roleCount === 2 ? 0.5 : 0.6 + (roleCount - 3) * 0.2,
  );
  const leadership = clamp01(
    (isIntegrative ? 0.6 : 0) +
      (componentCount >= 3 ? 0.4 : componentCount === 2 ? 0.2 : 0),
  );
  const collaboration = clamp01(
    roleCount >= 3 ? 0.9 : roleCount === 2 ? 0.55 : 0.15,
  );
  const coupling = clamp01(
    componentCount >= 4
      ? 1
      : componentCount === 3
        ? 0.7
        : componentCount === 2
          ? 0.45
          : componentCount === 1
            ? 0.2
            : 0,
  );
  const security = clamp01(
    (input.securityRequirementIds.length > 0 ? 0.7 : 0) +
      (input.sensitiveData ? 0.6 : 0),
  );
  const dataSensitivity = clamp01(input.sensitiveData ? 1 : 0);
  const continuity = clamp01(
    input.effortMaximum === null ? 0 : Math.min(1, input.effortMaximum / 120),
  );
  const community = clamp01(
    (isExploration ? 0.85 : 0.1) - (input.sensitiveData ? 1 : 0),
  );
  const multipleApproaches = clamp01(
    (isExploration ? 0.85 : isIntegrative ? 0.2 : 0.25) -
      (input.sensitiveData ? 0.5 : 0),
  );
  // Measurable acceptance is what makes a competition judgeable.
  const measurability = clamp01(
    (input.acceptanceMeasurable ? 0.8 : 0) +
      (input.deliverableCount > 0 ? 0.2 : 0),
  );
  // A challenged-free, packaged scope with a defined specialist is the classic
  // flexible-talent shape: known skills, bounded work, client-managed.
  const boundedSpecialist = clamp01(
    (isSpecialist ? 0.6 : isIntegrative ? 0 : 0.15) +
      (roleCount <= 2 ? 0.3 : 0) +
      (componentCount <= 1 ? 0.2 : 0) -
      (openCount > 0 ? 0.4 : 0),
  );

  const features: FeatureDefinition[] = [
    {
      id: "scope-clarity",
      label: "Scope clarity",
      weight: 1.2,
      points: {
        "flexible-talent": 0.2 * scopeClarity,
        challenge: 0.2 + scopeClarity * 0.7,
        "private-pod": scopeClarity * 0.4,
      },
      reason: `Scope is ${scopeClarity > 0.6 ? "clear enough to assign" : "still forming"}${
        openCount > 0 ? `, with ${openCount} open item(s) gating it` : ""
      }.`,
    },
    {
      id: "team-size",
      label: "Required roles and team size",
      weight: 1.7,
      points: {
        "flexible-talent": roleCount === 1 ? 0.9 : roleCount === 2 ? 0.45 : 0.1,
        challenge: roleCount <= 2 ? 0.4 : 0.2,
        "private-pod": teamSize,
      },
      reason:
        roleCount <= 1
          ? `One role is enough (${input.roles[0] ?? "role not named in the package"}), so this can be assigned to a named person.`
          : `${roleCount} roles (${input.roles.join(", ")}) have to work in step.`,
    },
    {
      id: "technical-leadership",
      label: "Need for technical leadership",
      weight: 1.6,
      points: {
        "flexible-talent": leadership < 0.3 ? 0.35 : 0.05,
        challenge: 0.1,
        "private-pod": leadership,
      },
      reason:
        leadership > 0.6
          ? `Continuous architectural ownership is needed across ${componentCount} component(s).`
          : `No standing technical lead is required for ${componentCount} component(s).`,
    },
    {
      id: "collaboration",
      label: "Degree of collaboration",
      weight: 1.4,
      points: {
        "flexible-talent": collaboration < 0.3 ? 0.5 : 0.1,
        challenge: collaboration < 0.6 ? 0.4 : 0.2,
        "private-pod": collaboration,
      },
      reason:
        collaboration > 0.6
          ? "Delivery depends on several roles working together rather than on one contributor."
          : "The work can be carried by one or two contributors.",
    },
    {
      id: "coupling",
      label: "Component coupling",
      weight: 1.6,
      points: {
        "flexible-talent": componentCount <= 1 ? 0.3 : 0.05,
        challenge: 0.15,
        "private-pod": coupling,
      },
      reason: `It touches ${componentCount} architecture component(s)${
        componentCount >= 2 ? ", which have to change together" : ""
      }.`,
    },
    {
      id: "competition",
      label: "Suitability for competitive delivery",
      weight: 1.5,
      points: {
        "flexible-talent": 0.15,
        // Restricted work must not be handed to open participation.
        challenge: input.sensitiveData ? -0.8 : 0.3 + measurability * 0.7,
        "private-pod": sensitiveOrCompetitivePenalty(input),
      },
      // The wording must agree with the points the feature awards. Awarding
      // challenge points while explaining that the work is *not* judgeable read as
      // a contradiction in the regression rationale, so the reason is graded on the
      // same measurability signal that produces the score.
      reason: input.sensitiveData
        ? "The work cannot be packaged for open participation because restricted data is involved."
        : isExploration
          ? "The deliverables can be packaged and evaluated against clear criteria."
          : measurability >= 0.5
            ? "The deliverables are bounded and can be judged against the acceptance conditions the package states."
            : "The deliverables are not yet separable into an independently judgeable submission.",
    },
    {
      id: "multiple-approaches",
      label: "Value of multiple approaches",
      weight: 1.4,
      points: {
        "flexible-talent": 0.15,
        challenge: multipleApproaches,
        "private-pod": 0.3 * (1 - multipleApproaches),
      },
      reason:
        multipleApproaches > 0.6
          ? "Several approaches are worth exploring, so more than one submission adds value."
          : "One correct approach exists; exploration would not add value.",
    },
    {
      id: "security",
      label: "Security and confidentiality",
      weight: 1.9,
      points: {
        "flexible-talent": 0.1,
        challenge: input.sensitiveData ? -0.9 : -0.1 * security,
        "private-pod": security,
      },
      reason:
        security > 0.4
          ? "Restricted access and security controls are involved, which rules out open participation."
          : "No restricted access is required.",
    },
    {
      id: "data-sensitivity",
      label: "Data sensitivity",
      weight: 1.9,
      points: {
        "flexible-talent": 0.1,
        challenge: input.sensitiveData ? -1 : 0.1,
        "private-pod": dataSensitivity,
      },
      reason:
        dataSensitivity > 0.4
          ? "Regulated or confidential data is in scope, so a controlled team is required."
          : "The data in scope is not restricted.",
    },
    {
      id: "continuity",
      label: "Duration and continuity",
      weight: 1.1,
      points: {
        "flexible-talent": continuity < 0.5 ? 0.3 : 0.15,
        challenge: continuity < 0.5 ? 0.35 : 0.1,
        "private-pod": continuity,
      },
      reason:
        input.effortMaximum === null
          ? "No effort range is available from the package, so continuity cannot be judged yet."
          : `Estimated effort is up to ${input.effortMaximum} person-days.`,
    },
    {
      id: "client-managed",
      label: "Managed directly by the client",
      weight: 1.3,
      points: {
        "flexible-talent": boundedSpecialist,
        challenge: 0.25,
        "private-pod": leadership > 0.5 ? 0.6 : 0.15,
      },
      reason:
        boundedSpecialist > 0.6
          ? "The work is bounded enough for an existing delivery team to manage directly."
          : "Delivery coordination cannot sit with the client as things stand.",
    },
    {
      id: "measurability",
      label: "Acceptance measurability",
      weight: 1.2,
      points: {
        "flexible-talent": 0.2 + measurability * 0.3,
        challenge: 0.2 + measurability * 0.7,
        "private-pod": 0.3 * (1 - measurability),
      },
      reason: input.acceptanceMeasurable
        ? "Acceptance conditions are stated in the package, so the result is objectively reviewable."
        : "No acceptance conditions exist yet, so the result cannot be judged.",
    },
    {
      id: "community",
      label: "Need for community participation",
      weight: 1.3,
      points: {
        "flexible-talent": 0.05,
        challenge: community,
        "private-pod": 0.3 * (1 - community),
      },
      reason:
        community > 0.6
          ? "Broader participation would add real value here."
          : "A closed team serves this work better than open participation.",
    },
  ];
  return features;
}

function sensitiveOrCompetitivePenalty(input: ClassificationInput): number {
  // A pod is the answer when competition is unsuitable *and* the work is coupled
  // enough to need a team; otherwise it is not the model that competition's
  // absence argues for.
  const unsuitable =
    input.sensitiveData ||
    input.componentIds.length >= 3 ||
    input.roles.length >= 3;
  return unsuitable ? 0.6 : 0.2;
}

export interface ClassificationResult extends OperatingModelRecommendation {
  features: FeatureDefinition[];
}

const MODEL_KEYS: Model[] = ["flexible-talent", "challenge", "private-pod"];

function scoreModels(features: FeatureDefinition[]): ModelScore[] {
  return MODEL_KEYS.map((model) => {
    const contributions = features
      .filter((feature) => Math.abs(feature.points[model]) > 0.01)
      .map((feature) => ({
        feature: feature.label,
        weight: feature.weight,
        value: feature.points[model],
        points: Number((feature.weight * feature.points[model]).toFixed(3)),
        evidence: feature.reason,
      }));
    const score = contributions.reduce(
      (sum, contribution) => sum + contribution.points,
      0,
    );
    return { model, score: Number(score.toFixed(3)), contributions };
  }).sort(
    (a, b) =>
      b.score - a.score ||
      MODEL_KEYS.indexOf(a.model) - MODEL_KEYS.indexOf(b.model),
  );
}

function inputCompleteness(input: ClassificationInput): number {
  const checks = [
    input.sourceIds.length > 0,
    input.roles.length > 0,
    input.componentIds.length > 0 || input.kind !== "delivery",
    input.acceptanceMeasurable,
    input.effortMaximum !== null,
    input.deliverableCount > 0 || input.kind !== "delivery",
  ];
  return checks.filter(Boolean).length / checks.length;
}

/** Confidence combines the score margin with how complete the input was. */
export function confidenceFrom(
  winner: number,
  runnerUp: number,
  completeness: number,
): Confidence {
  const margin = winner - runnerUp;
  if (margin >= 4 && completeness >= 0.7) return "high";
  if (margin >= 1.5 && completeness >= 0.4) return "medium";
  return "low";
}

export function classifyNode(
  input: ClassificationInput,
  options?: { maturity?: MaturityLevel },
): ClassificationResult {
  void options;
  const features = computeFeatures(input);
  const scores = scoreModels(features);
  const [top, second] = scores;
  const margin = Number((top.score - second.score).toFixed(3));
  const completeness = inputCompleteness(input);
  const confidence = confidenceFrom(top.score, second.score, completeness);

  // When the runner-up is within 6% of the winner, the work genuinely straddles
  // two models, so the engine says so instead of picking one silently.
  const splitRecommended = margin <= Math.max(1.5, top.score * 0.06);
  const rationale = features
    .filter((feature) => {
      const topPoints = feature.weight * feature.points[top.model];
      const runnerPoints = feature.weight * feature.points[second.model];
      return (
        topPoints >= 0.45 ||
        topPoints - runnerPoints >= 0.7 ||
        feature.points[top.model] < 0
      );
    })
    .sort(
      (a, b) => b.weight * b.points[top.model] - a.weight * a.points[top.model],
    )
    .slice(0, 5)
    .map((feature) => feature.reason);

  const alternatives = scores
    .slice(1)
    .filter((entry) => entry.score >= top.score * 0.6)
    .map((entry) => entry.model);

  return {
    primary: top.model,
    alternatives,
    confidence,
    rationale,
    sourceIds: input.sourceIds,
    overridden: false,
    overrideHistory: [],
    scores,
    margin,
    splitRecommended,
    splitReason: splitRecommended
      ? `The ${top.model} score (${top.score}) and the ${second.model} score (${second.score}) are only ${margin} points apart, so this work straddles two operating models. Split it into a ${top.model} node and a ${second.model} node, or define an explicit handoff.`
      : null,
    features,
  };
}

/** Re-derive the recommendation after a user override, keeping the history. */
export function applyOverride(
  recommendation: ClassificationResult,
  to: Model,
  rationale: string,
  at: string,
): ClassificationResult {
  if (to === recommendation.primary) return recommendation;
  return {
    ...recommendation,
    primary: to,
    overridden: true,
    overrideHistory: [
      ...recommendation.overrideHistory,
      { from: recommendation.primary, to, rationale, at },
    ],
    alternatives: [
      recommendation.primary,
      ...recommendation.alternatives.filter(
        (model) => model !== to && model !== recommendation.primary,
      ),
    ],
    rationale: [
      `Operating model overridden by the operator: ${rationale}`,
      ...recommendation.rationale,
    ],
  };
}
