import type { MaturityLevel } from "../canonical/types";
import { SAMPLE_INPUTS } from "./inputs";

export interface SamplePackage {
  /** Stable slug used in URLs and in the CLI. */
  id: string;
  fileName: string;
  /** `id` inside the package itself (e.g. `DEAL_CLAIMSDESK`). */
  dealId: string;
  title: string;
  customer: string;
  /** What this package is for, from the challenge brief. */
  character: string;
  text: string;
  json: Record<string, unknown>;
  /** Maturity the engine is expected to reach for this package. */
  expectedMaturity: MaturityLevel;
}

interface SampleDescriptor {
  id: string;
  fileName: string;
  character: string;
  expectedMaturity: MaturityLevel;
}

const DESCRIPTORS: SampleDescriptor[] = [
  {
    id: "claimsdesk-modernization",
    fileName: "claimsdesk-modernization.json",
    character:
      "Mature enterprise modernization: application, enterprise integrations, cloud architecture, data and document migration, security and compliance, AI assistance, phased delivery.",
    expectedMaturity: "review-required",
  },
  {
    id: "clinical-intake-and-patient-support-assistant",
    fileName: "clinical-intake-and-patient-support-assistant.json",
    character:
      "AI-enabled regulated solution: document ingestion, extraction, knowledge grounding, mandatory human validation, healthcare integrations, privacy and safety controls.",
    expectedMaturity: "review-required",
  },
  {
    id: "member-experience-modernisation-early-discovery",
    fileName: "member-experience-modernisation-early-discovery.json",
    character:
      "Early discovery: directional requirements, undefined AI scope, unknown systems, missing non-functional, volume, timeline, compliance and environment information.",
    expectedMaturity: "discovery-required",
  },
  {
    id: "unified-supply-chain-analytics",
    fileName: "unified-supply-chain-analytics.json",
    character:
      "Data and integration heavy: ERP, CRM, warehouse, carrier and identity integrations over API, event, batch and file patterns, with analytics, reconciliation and lineage.",
    expectedMaturity: "review-required",
  },
];

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function asText(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : fallback;
}

function build(descriptor: SampleDescriptor): SamplePackage {
  const text = SAMPLE_INPUTS[descriptor.fileName];
  if (typeof text !== "string") {
    throw new Error(
      `Sample package ${descriptor.fileName} is not vendored. Run: bun run scripts/vendor-inputs.ts`,
    );
  }
  const json = asRecord(JSON.parse(text));
  const customer = asRecord(json.customer);
  return {
    id: descriptor.id,
    fileName: descriptor.fileName,
    dealId: asText(json.id, descriptor.id),
    title: asText(json.name, descriptor.fileName),
    // `customer.name` on older exports, `customer.customerName` on the official
    // packages — the same fallback the normalizer applies, so the picker and the
    // imported model never disagree about who the customer is.
    customer: asText(
      customer.customerName,
      asText(customer.name, "unknown customer"),
    ),
    character: descriptor.character,
    text,
    json,
    expectedMaturity: descriptor.expectedMaturity,
  };
}

/** Every sample package, in the order the challenge lists them. */
export const SAMPLE_PACKAGES: SamplePackage[] = DESCRIPTORS.map(build);

export const SAMPLE_FILES: string[] = DESCRIPTORS.map(
  (descriptor) => descriptor.fileName,
);

export function findSamplePackage(id: string): SamplePackage | undefined {
  return SAMPLE_PACKAGES.find(
    (sample) => sample.id === id || sample.fileName === id,
  );
}
