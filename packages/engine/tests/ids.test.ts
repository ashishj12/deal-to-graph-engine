import { describe, expect, test } from "bun:test";
import {
  isWellFormedId,
  namespaceOf,
  normalizeName,
} from "@deal-to-challenge/engine";

describe("identifier namespaces", () => {
  test("synthesized prefixes are namespaced before anything else", () => {
    expect(namespaceOf("MOD:intake")).toBe("module");
    expect(namespaceOf("ENH:fraud-signals")).toBe("enhancement");
    expect(namespaceOf("EXT:legacy-mainframe")).toBe("outOfScope");
    expect(namespaceOf("WSF:claims-intake")).toBe("workstream");
    expect(namespaceOf("PKG:foundation")).toBe("deliveryPackage");
  });

  test("phases are detected before the generic workstream prefix", () => {
    // `WS_PH_1` must not be read as an estimate workstream.
    expect(namespaceOf("WS_PH_1")).toBe("phase");
    expect(namespaceOf("WS_PH_12")).toBe("phase");
    expect(namespaceOf("WS_01")).toBe("estimateWorkstream");
    expect(namespaceOf("WS_07")).toBe("estimateWorkstream");
  });

  test("every scope prefix maps to the scope namespace and nothing else", () => {
    for (const prefix of [
      "BR",
      "FR",
      "NFR",
      "SEC",
      "INT",
      "DATA",
      "CON",
      "SYS",
      "PER",
      "TECH",
      "GAP",
      "Q",
      "RSK",
      "ASM",
      "DEP",
    ]) {
      expect(namespaceOf(`${prefix}_01`)).toBe("scope");
    }
    expect(namespaceOf("CAP_01")).toBe("capability");
    expect(namespaceOf("ARC_01")).toBe("component");
    expect(namespaceOf("DD_01")).toBe("domain");
    expect(namespaceOf("IF_01")).toBe("integration");
    expect(namespaceOf("AIUC_01")).toBe("aiUseCase");
    expect(namespaceOf("ENH_01")).toBe("enhancement");
  });

  test("an unrecognised identifier degrades to scope rather than throwing", () => {
    expect(namespaceOf("ZZZ_99")).toBe("scope");
    expect(namespaceOf("")).toBe("scope");
  });
});

describe("identifier well-formedness", () => {
  test("numbered identifiers follow PREFIX_NN, including multi-word prefixes", () => {
    expect(isWellFormedId("FR_01")).toBe(true);
    expect(isWellFormedId("WS_PH_1")).toBe(true);
    expect(isWellFormedId("AIUC_12")).toBe(true);
    expect(isWellFormedId("NODE_CAP_01_BACKEND_API")).toBe(false);
    expect(isWellFormedId("fr_01")).toBe(false);
    expect(isWellFormedId("FR_")).toBe(false);
    expect(isWellFormedId("FR")).toBe(false);
    expect(isWellFormedId("01_FR")).toBe(false);
  });

  test("synthesized ids are accepted because they are namespaced, not numbered", () => {
    expect(isWellFormedId("PKG:foundation")).toBe(true);
    expect(isWellFormedId("EXT:unnamed-1")).toBe(true);
  });
});

describe("name normalisation", () => {
  test("case, punctuation and spacing collapse to one comparable key", () => {
    expect(normalizeName("SAP S/4HANA")).toBe("sap s 4hana");
    expect(normalizeName("  Epics   EHR  ")).toBe("epics ehr");
    expect(normalizeName("Guidewire-ClaimCenter")).toBe(
      "guidewire claimcenter",
    );
    // Two spellings of the same name normalise identically, which is what lets a
    // capability dependency name resolve to a capability id.
    expect(normalizeName("Salesforce Sales Cloud")).toBe(
      normalizeName("salesforce  sales cloud"),
    );
  });
});
