const EOCD_SIG = 0x06054b50;
const CENTRAL_SIG = 0x02014b50;
const LOCAL_SIG = 0x04034b50;

const EOCD_MIN_SIZE = 22;
const MAX_COMMENT = 0xffff;
const MAX_ENTRIES = 512;
/** Total uncompressed budget across the archive. */
const MAX_TOTAL_UNCOMPRESSED = 96 * 1024 * 1024;
const METHOD_STORE = 0;
const METHOD_DEFLATE = 8;

export interface ZipEntryInfo {
  name: string;
  method: number;
  compressedSize: number;
  uncompressedSize: number;
  localHeaderOffset: number;
  isDirectory: boolean;
}

export interface ZipListing {
  ok: boolean;
  zip64: boolean;
  entries: ZipEntryInfo[];
  error?: string;
}

export interface UnzippedTextFile {
  /** Entry path inside the archive, e.g. `packages/claims.json`. */
  name: string;
  /** Path with any directory prefix removed. */
  baseName: string;
  text: string;
}

export interface UnzipResult {
  files: UnzippedTextFile[];
  /** Entries that were deliberately not read, with the reason. */
  skipped: { name: string; reason: string }[];
}

function isJunk(name: string): boolean {
  if (name.startsWith("__MACOSX/")) return true;
  const base = name.slice(name.lastIndexOf("/") + 1);
  return base.startsWith("._") || base === ".DS_Store" || base === "Thumbs.db";
}

/** Locate the End Of Central Directory record by scanning backwards. */
function findEocd(view: DataView, length: number): number {
  const lowest = Math.max(0, length - EOCD_MIN_SIZE - MAX_COMMENT);
  for (let offset = length - EOCD_MIN_SIZE; offset >= lowest; offset -= 1) {
    if (view.getUint32(offset, true) === EOCD_SIG) return offset;
  }
  return -1;
}

/** Read the archive's central directory without decompressing anything. */
export function inspectZip(bytes: Uint8Array): ZipListing {
  const empty: ZipListing = { ok: false, zip64: false, entries: [] };
  if (bytes.byteLength < EOCD_MIN_SIZE) {
    return { ...empty, error: "The file is too small to be a zip archive." };
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const eocd = findEocd(view, bytes.byteLength);
  if (eocd < 0) {
    return {
      ...empty,
      error:
        "No zip central directory was found. The file may be corrupted or not a zip.",
    };
  }

  const totalEntries = view.getUint16(eocd + 10, true);
  const centralSize = view.getUint32(eocd + 12, true);
  const centralOffset = view.getUint32(eocd + 16, true);

  if (
    centralOffset === 0xffffffff ||
    centralSize === 0xffffffff ||
    totalEntries === 0xffff
  ) {
    return {
      ok: false,
      zip64: true,
      entries: [],
      error:
        "This archive uses ZIP64, which is not supported. Re-export it as a standard zip.",
    };
  }

  if (totalEntries > MAX_ENTRIES) {
    return {
      ...empty,
      error: `The archive declares ${totalEntries} entries, above the ${MAX_ENTRIES} entry limit.`,
    };
  }

  if (centralOffset + centralSize > bytes.byteLength) {
    return {
      ...empty,
      error: "The zip central directory points outside the file.",
    };
  }

  const entries: ZipEntryInfo[] = [];
  let cursor = centralOffset;

  for (let i = 0; i < totalEntries; i += 1) {
    if (cursor + 46 > bytes.byteLength) break;
    if (view.getUint32(cursor, true) !== CENTRAL_SIG) {
      return { ...empty, error: "The zip central directory is malformed." };
    }
    const method = view.getUint16(cursor + 10, true);
    const compressedSize = view.getUint32(cursor + 20, true);
    const uncompressedSize = view.getUint32(cursor + 24, true);
    const nameLength = view.getUint16(cursor + 28, true);
    const extraLength = view.getUint16(cursor + 30, true);
    const commentLength = view.getUint16(cursor + 32, true);
    const localHeaderOffset = view.getUint32(cursor + 42, true);
    const nameBytes = bytes.subarray(cursor + 46, cursor + 46 + nameLength);
    const name = new TextDecoder("utf-8").decode(nameBytes);

    entries.push({
      name,
      method,
      compressedSize,
      uncompressedSize,
      localHeaderOffset,
      isDirectory: name.endsWith("/"),
    });

    cursor += 46 + nameLength + extraLength + commentLength;
  }

  return { ok: true, zip64: false, entries };
}

async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([data as BlobPart])
    .stream()
    .pipeThrough(new DecompressionStream("deflate-raw"));
  const buffer = await new Response(stream).arrayBuffer();
  return new Uint8Array(buffer);
}

function readEntryBytes(
  bytes: Uint8Array,
  view: DataView,
  entry: ZipEntryInfo,
): { data: Uint8Array } | { error: string } {
  const { localHeaderOffset } = entry;
  if (localHeaderOffset + 30 > bytes.byteLength) {
    return { error: "local header is outside the archive" };
  }
  if (view.getUint32(localHeaderOffset, true) !== LOCAL_SIG) {
    return { error: "local header signature is invalid" };
  }
  const nameLength = view.getUint16(localHeaderOffset + 26, true);
  const extraLength = view.getUint16(localHeaderOffset + 28, true);
  const start = localHeaderOffset + 30 + nameLength + extraLength;
  const end = start + entry.compressedSize;
  if (end > bytes.byteLength) {
    return { error: "entry data runs past the end of the archive" };
  }
  return { data: bytes.subarray(start, end) };
}

/**
 * Extract every text-ish entry from a zip archive.
 *
 * Directory entries, editor/OS junk and binary payloads are reported in `skipped`
 * rather than silently ignored.
 */
export async function unzipTextEntries(
  bytes: Uint8Array,
): Promise<UnzipResult> {
  const listing = inspectZip(bytes);
  if (!listing.ok)
    throw new Error(listing.error ?? "The zip archive could not be read.");

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const files: UnzippedTextFile[] = [];
  const skipped: UnzipResult["skipped"] = [];
  let budget = 0;

  for (const entry of listing.entries) {
    if (entry.isDirectory) {
      skipped.push({ name: entry.name, reason: "directory" });
      continue;
    }
    if (isJunk(entry.name)) {
      skipped.push({ name: entry.name, reason: "operating-system metadata" });
      continue;
    }
    if (entry.method !== METHOD_STORE && entry.method !== METHOD_DEFLATE) {
      skipped.push({
        name: entry.name,
        reason: `unsupported compression method ${entry.method}`,
      });
      continue;
    }
    if (!/\.(json|txt|md)$/i.test(entry.name)) {
      skipped.push({ name: entry.name, reason: "not a text or JSON file" });
      continue;
    }
    budget += entry.uncompressedSize;
    if (budget > MAX_TOTAL_UNCOMPRESSED) {
      skipped.push({
        name: entry.name,
        reason: "archive exceeds the uncompressed size budget",
      });
      break;
    }

    const raw = readEntryBytes(bytes, view, entry);
    if ("error" in raw) {
      skipped.push({ name: entry.name, reason: raw.error });
      continue;
    }

    try {
      const data =
        entry.method === METHOD_STORE ? raw.data : await inflateRaw(raw.data);
      const text = new TextDecoder("utf-8").decode(data);
      const baseName = entry.name.slice(entry.name.lastIndexOf("/") + 1);
      files.push({ name: entry.name, baseName, text });
    } catch (error) {
      skipped.push({
        name: entry.name,
        reason: error instanceof Error ? error.message : "decompression failed",
      });
    }
  }

  return { files, skipped };
}

/** True when a byte prefix looks like a zip local header or empty archive. */
export function looksLikeZip(bytes: Uint8Array): boolean {
  if (bytes.byteLength >= 4) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const sig = view.getUint32(0, true);
    if (sig === LOCAL_SIG || sig === EOCD_SIG) return true;
  }
  // Empty archives start with the EOCD record; check the tail as a fallback.
  if (bytes.byteLength >= EOCD_MIN_SIZE) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    return findEocd(view, bytes.byteLength) >= 0;
  }
  return false;
}
