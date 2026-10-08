import { describe, expect, test } from "bun:test";
import { inspectZip, looksLikeZip, unzipTextEntries } from "@deal-to-challenge/engine";
import { runImport } from "@deal-to-challenge/engine";
import { SAMPLE_PACKAGES } from "@deal-to-challenge/engine/samples";
import { buildZip, buildZipWithDataDescriptor, type ZipEntryInput } from "./synthetic/zip-builder";

/** The supplied packages arrive from the challenge inside one ZIP archive. */
function archiveEntries(): ZipEntryInput[] {
  return [
    { name: "packages/", directory: true },
    { name: "packages/README.txt", text: "Four sanitized deal-scoping exports.", method: "stored" },
    ...SAMPLE_PACKAGES.map((sample) => ({
      name: `packages/${sample.fileName}`,
      text: sample.text,
      method: "deflate" as const,
    })),
  ];
}

const ARCHIVE = buildZip(archiveEntries());

describe("zip import of the supplied packages", () => {
  test("recognises a real zip archive and rejects plain JSON", () => {
    expect(looksLikeZip(ARCHIVE)).toBe(true);
    expect(looksLikeZip(new TextEncoder().encode('{"id":"DEAL_X"}'))).toBe(false);
  });

  test("lists the central directory without decompressing", () => {
    const listing = inspectZip(ARCHIVE);
    expect(listing.ok).toBe(true);
    expect(listing.zip64).toBe(false);
    // 4 packages + readme.txt + the directory entry
    expect(listing.entries.length).toBe(6);
    expect(listing.entries.filter((entry) => entry.isDirectory).map((entry) => entry.name)).toEqual([
      "packages/",
    ]);
  });

  test("extracts every package from the nested folder", async () => {
    const { files, skipped } = await unzipTextEntries(ARCHIVE);
    const json = files.filter((file) => file.baseName.endsWith(".json"));
    expect(json.length).toBe(4);
    expect(json.map((file) => file.baseName).sort()).toEqual(SAMPLE_PACKAGES.map((deal) => deal.fileName).sort());
    // Directory entries are reported, never silently dropped.
    expect(skipped.some((entry) => entry.reason === "directory")).toBe(true);
  });

  test("extracted text is byte-identical to the original package", async () => {
    const { files } = await unzipTextEntries(ARCHIVE);
    for (const deal of SAMPLE_PACKAGES) {
      const extracted = files.find((file) => file.baseName === deal.fileName);
      expect(extracted).toBeDefined();
      expect(extracted?.text).toBe(deal.text);
    }
  });

  test("every extracted package imports and scores as expected", async () => {
    const { files } = await unzipTextEntries(ARCHIVE);
    for (const deal of SAMPLE_PACKAGES) {
      const extracted = files.find((file) => file.baseName === deal.fileName);
      if (!extracted) throw new Error(`${deal.fileName} missing from archive`);
      const result = await runImport(extracted.baseName, extracted.text);
      expect(result.report.counts.error).toBe(0);
      expect(result.maturity.level).toBe(deal.expectedMaturity);
    }
  });

  test("reads an archive that uses streaming data descriptors", async () => {
    // Sizes are zero in the local headers; only the central directory is reliable.
    const streaming = buildZipWithDataDescriptor(archiveEntries());
    const { files } = await unzipTextEntries(streaming);
    expect(files.filter((file) => file.baseName.endsWith(".json")).length).toBe(4);
  });
});

describe("zip safety", () => {
  test("rejects data that is not a zip", () => {
    const listing = inspectZip(new TextEncoder().encode('{"id":"DEAL_X"}'));
    expect(listing.ok).toBe(false);
    expect(listing.error).toBeDefined();
  });

  test("rejects a truncated archive", () => {
    expect(inspectZip(ARCHIVE.subarray(0, 40)).ok).toBe(false);
  });

  test("rejects an empty file", () => {
    expect(inspectZip(new Uint8Array(0)).ok).toBe(false);
  });

  test("throws a readable error rather than crashing", async () => {
    await expect(unzipTextEntries(new Uint8Array(4))).rejects.toThrow();
  });

  test("refuses an archive with more entries than the cap allows", () => {
    // A zip bomb with hundreds of thousands of entries is rejected at the
    // central-directory stage, before anything is decompressed.
    const many = buildZip(
      Array.from({ length: 513 }, (_, index) => ({ name: `f${index}.json`, text: "{}", method: "stored" as const })),
    );
    const listing = inspectZip(many);
    expect(listing.ok).toBe(false);
    expect(listing.error).toContain("512");
  });
});
