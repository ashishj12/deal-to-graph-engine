import type { GeneratorInfo } from "../canonical/execution";
import type { OperatingModel, Provenance, Readiness } from "../canonical/types";

export interface PackageBase {
  nodeId: string;
  nodeTitle: string;
  model: OperatingModel;
  readiness: Readiness;
  /** False when any required field for this model is missing. */
  complete: boolean;
  /** Required fields that the imported package could not supply. */
  missingFields: string[];
  /** Why the package is not handoff-ready, in plain English. */
  readinessNotes: string[];
  provenance: Provenance;
  sourceIds: string[];
  generator: GeneratorInfo;
}

export interface FlexibleTalentPackage extends PackageBase {
  model: "flexible-talent";
  roles: string[];
  skills: string[];
  seniority: string | null;
  duration: string | null;
  capacity: string | null;
  responsibilities: string[];
  startDependencies: string[];
  access: string[];
  environment: string | null;
}

export interface ChallengePackage extends PackageBase {
  model: "challenge";
  objective: string;
  businessContext: string;
  technicalContext: string;
  deliverables: string[];
  evaluationCriteria: string[];
  acceptanceConditions: string[];
  inputAssets: string[];
  technologies: string[];
  skills: string[];
  dependencies: string[];
  confidentialityLimitations: string[];
  expectedReviewProcess: string[];
}

export interface PrivatePodPackage extends PackageBase {
  model: "private-pod";
  objective: string;
  roles: string[];
  skills: string[];
  technicalLeadership: string | null;
  componentOwnership: string[];
  deliveryResponsibilities: string[];
  securityAndAccess: string[];
  coordinationDependencies: string[];
  expectedDuration: string | null;
  definitionOfCompletion: string[];
}

export type ModelPackage =
  | FlexibleTalentPackage
  | ChallengePackage
  | PrivatePodPackage;

/** Required fields per model, used by the completeness check and the quality gate. */
export const REQUIRED_PACKAGE_FIELDS: Record<OperatingModel, string[]> = {
  "flexible-talent": [
    "roles",
    "skills",
    "seniority",
    "duration",
    "capacity",
    "responsibilities",
    "startDependencies",
    "access",
    "environment",
  ],
  challenge: [
    "objective",
    "businessContext",
    "technicalContext",
    "deliverables",
    "evaluationCriteria",
    "acceptanceConditions",
    "inputAssets",
    "technologies",
    "skills",
    "dependencies",
    "confidentialityLimitations",
    "expectedReviewProcess",
  ],
  "private-pod": [
    "objective",
    "roles",
    "skills",
    "technicalLeadership",
    "componentOwnership",
    "deliveryResponsibilities",
    "securityAndAccess",
    "coordinationDependencies",
    "expectedDuration",
    "definitionOfCompletion",
  ],
};
